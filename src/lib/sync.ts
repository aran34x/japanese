// Optional cloud sync via Supabase. Credentials are NOT baked into the repo —
// the user pastes their own Supabase project URL + anon key into Settings, and
// they're stored locally (IndexedDB). Auth uses a magic-link email; progress is
// stored as a single JSON row per user (last-write-wins), reusing the same
// serialization as the local backup.
import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';
import { writable } from 'svelte/store';
import { db } from './db';
import { exportBackup, importBackup } from './backup';

export interface SyncConfig {
  url: string;
  anonKey: string;
}

export const syncSession = writable<Session | null>(null);
export const syncConfigured = writable(false);
export const syncStatus = writable<string>('');

let client: SupabaseClient | null = null;

export async function loadSyncConfig(): Promise<SyncConfig | null> {
  const row = await db.meta.get('syncConfig');
  return (row?.value as SyncConfig) ?? null;
}

export async function initSync(): Promise<void> {
  const cfg = await loadSyncConfig();
  if (!cfg?.url || !cfg?.anonKey) {
    syncConfigured.set(false);
    return;
  }
  client = createClient(cfg.url, cfg.anonKey, {
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

export async function saveSyncConfig(cfg: SyncConfig): Promise<void> {
  await db.meta.put({ key: 'syncConfig', value: cfg });
  await initSync();
}

export async function clearSyncConfig(): Promise<void> {
  if (client) await client.auth.signOut().catch(() => {});
  await db.meta.delete('syncConfig');
  client = null;
  syncConfigured.set(false);
  syncSession.set(null);
}

export async function signInWithEmail(email: string): Promise<void> {
  if (!client) throw new Error('Sync not configured');
  syncStatus.set('sending');
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.href }
  });
  if (error) throw error;
  syncStatus.set('check-email');
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
