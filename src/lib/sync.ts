// Cloud sync via Supabase with Google sign-in. The publishable key lives in
// supabase-config.ts (safe for client code). Progress is stored as a single
// JSON row per user (last-write-wins), reusing the local backup serialization.
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { db } from './db';
import { exportBackup, importBackup } from './backup';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, supabaseConfigured } from './supabase-config';

export const syncSession = writable<Session | null>(null);
export const syncConfigured = writable(false);
/** 'idle' | 'pushing' | 'pulling' | 'synced' | 'error' */
export const syncStatus = writable<string>('idle');
export const lastSyncError = writable<string>('');
/** Set once the initial session has been resolved (so the gate can render). */
export const authReady = writable(false);

let client: SupabaseClient | null = null;

const REMEMBER_KEY = 'nq-remember-login';
/** Whether to keep the user signed in across browser restarts on this device. */
export function getRememberLogin(): boolean {
  return localStorage.getItem(REMEMBER_KEY) !== '0';
}
export function setRememberLogin(on: boolean): void {
  localStorage.setItem(REMEMBER_KEY, on ? '1' : '0');
}

export async function initSync(): Promise<void> {
  if (!supabaseConfigured()) {
    syncConfigured.set(false);
    authReady.set(true);
    return;
  }
  // When "remember me" is off, keep the session only for this tab/session so it
  // is cleared when the browser closes; otherwise persist it on this device.
  const remember = getRememberLogin();
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: remember ? window.localStorage : window.sessionStorage
    }
  });
  syncConfigured.set(true);
  const { data } = await client.auth.getSession();
  syncSession.set(data.session);

  // Reconcile the local database's "owner" with the current identity so a guest
  // never inherits a previous account's data (and vice-versa). The owner tag is
  // stored locally; 'guest' means no account.
  const currentOwner = data.session?.user?.id ?? 'guest';
  const storedOwner = (await db.meta.get('dataOwner'))?.value as string | undefined;
  if (storedOwner !== undefined && storedOwner !== currentOwner) {
    // Identity changed since this device last ran → reset to a clean slate.
    await onSignedOut?.();
    await db.meta.put({ key: 'dataOwner', value: currentOwner });
    if (currentOwner !== 'guest') {
      // Signed-in identity: pull their cloud save over the clean slate (pull
      // reloads the page on success). If there's no cloud save yet, reload to
      // reflect the cleared state.
      const had = await pull().catch((e) => {
        lastSyncError.set(e instanceof Error ? e.message : String(e));
        syncStatus.set('error');
        return false;
      });
      if (!had) location.reload();
    } else {
      // Became a guest with leftover account data → reload the clean slate.
      location.reload();
    }
    return; // page is reloading; stop here
  } else if (storedOwner === undefined) {
    await db.meta.put({ key: 'dataOwner', value: currentOwner });
  }

  authReady.set(true);

  let prevUserId = data.session?.user?.id ?? null;
  client.auth.onAuthStateChange((event, session) => {
    const newUserId = session?.user?.id ?? null;
    syncSession.set(session);

    if (event === 'SIGNED_IN' && newUserId && newUserId !== prevUserId) {
      void (async () => {
        await db.meta.put({ key: 'dataOwner', value: newUserId });
        // Load THEIR cloud data over the local state.
        await pull().catch((e) => {
          lastSyncError.set(e instanceof Error ? e.message : String(e));
          syncStatus.set('error');
        });
      })();
    } else if (event === 'SIGNED_OUT') {
      // Logged out → wipe progress so a guest starts clean.
      void (async () => {
        await db.meta.put({ key: 'dataOwner', value: 'guest' });
        await onSignedOut?.();
      })();
    }
    prevUserId = newUserId;
  });
}

// Set by the app so sync can clear local progress without a circular import to
// the game-state module. Must NOT reload the page itself (initSync awaits it).
let onSignedOut: (() => Promise<void>) | null = null;
export function setSignedOutHandler(fn: () => Promise<void>) {
  onSignedOut = fn;
}

export async function signUpWithPassword(email: string, password: string): Promise<string> {
  if (!client) throw new Error('Sync not configured');
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: location.href }
  });
  if (error) throw error;
  // If email confirmation is on, there's no session yet.
  return data.session ? 'signed-in' : 'confirm-email';
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function resetPassword(email: string): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  const { error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: location.href
  });
  if (error) throw error;
}

export async function signOut(): Promise<void> {
  if (client) await client.auth.signOut();
  syncSession.set(null);
  // The SIGNED_OUT handler wipes local data; reload so the UI starts clean.
  setTimeout(() => location.reload(), 300);
}

/** Push the local save up to the cloud (overwrites the user's row). */
export async function push(): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  const { data: u } = await client.auth.getUser();
  if (!u.user) throw new Error('Not signed in');
  syncStatus.set('pushing');
  try {
    const blob = await exportBackup();
    const payload = JSON.parse(await blob.text());
    const { error } = await client
      .from('saves')
      .upsert({ user_id: u.user.id, data: payload, updated_at: new Date().toISOString() });
    if (error) throw error;
    lastSyncError.set('');
    syncStatus.set('synced');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    lastSyncError.set(msg);
    syncStatus.set('error');
    throw e;
  }
}

/** Pull the cloud save down and merge into the local database. */
export async function pull(): Promise<boolean> {
  if (!client) throw new Error('Sync not configured');
  const { data: u } = await client.auth.getUser();
  if (!u.user) throw new Error('Not signed in');
  syncStatus.set('pulling');
  const { data, error } = await client
    .from('saves')
    .select('data')
    .eq('user_id', u.user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data?.data) {
    syncStatus.set('synced');
    return false;
  }
  const file = new File([JSON.stringify(data.data)], 'cloud.json', { type: 'application/json' });
  await importBackup(file);
  lastSyncError.set('');
  syncStatus.set('synced');
  // Reload so all in-memory stores (game state, settings) reflect pulled data.
  setTimeout(() => location.reload(), 300);
  return true;
}

/** Push in the background if signed in. Errors are reflected in syncStatus. */
export async function autoPush(): Promise<void> {
  if (!client) return;
  const { data } = await client.auth.getUser();
  if (!data.user) return; // not signed in → nothing to sync
  try {
    await push();
  } catch {
    // push() already set syncStatus='error' and lastSyncError; stay quiet here.
  }
}
