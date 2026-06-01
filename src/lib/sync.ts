// Cloud sync via Supabase with Google sign-in. The publishable key lives in
// supabase-config.ts (safe for client code). Progress is stored as a single
// JSON row per user (last-write-wins), reusing the local backup serialization.
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { exportBackup, importBackup } from './backup';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, supabaseConfigured } from './supabase-config';

export const syncSession = writable<Session | null>(null);
export const syncConfigured = writable(false);
export const syncStatus = writable<string>('');
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
  authReady.set(true);
  client.auth.onAuthStateChange((_e, session) => {
    syncSession.set(session);
    // Auto-pull right after a fresh sign-in.
    if (session) void pull().catch(() => {});
  });
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
}

/** Push the local save up to the cloud (overwrites the user's row). */
export async function push(): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  const { data: u } = await client.auth.getUser();
  if (!u.user) throw new Error('Not signed in');
  syncStatus.set('pushing');
  const blob = await exportBackup();
  const payload = JSON.parse(await blob.text());
  const { error } = await client
    .from('saves')
    .upsert({ user_id: u.user.id, data: payload, updated_at: new Date().toISOString() });
  if (error) throw error;
  syncStatus.set('synced');
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
  syncStatus.set('synced');
  return true;
}

/** Push silently if signed in (used on app changes). */
export async function autoPush(): Promise<void> {
  try {
    if (client) {
      const { data } = await client.auth.getUser();
      if (data.user) await push();
    }
  } catch {
    /* offline or not configured — ignore */
  }
}
