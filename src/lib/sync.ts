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

let client: SupabaseClient | null = null;

export async function initSync(): Promise<void> {
  if (!supabaseConfigured()) {
    syncConfigured.set(false);
    return;
  }
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  syncConfigured.set(true);
  const { data } = await client.auth.getSession();
  syncSession.set(data.session);
  client.auth.onAuthStateChange((_e, session) => {
    syncSession.set(session);
    // Auto-pull right after a fresh sign-in.
    if (session) void pull().catch(() => {});
  });
}

export async function signInWithGoogle(): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: location.href }
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
