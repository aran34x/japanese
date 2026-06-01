// Supabase connection config. The publishable (anon) key is SAFE to ship in
// client code — that's its intended use; data is protected by Row Level
// Security policies, not by keeping this key secret. NEVER put the secret
// (sb_secret_...) key here.
//
// Fill these in with your project's values (Settings → API in Supabase):
export const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_ii969Tu0BY3OXcKAh0YB9A_IrmVdc-q';

export const supabaseConfigured = () =>
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('YOUR-PROJECT') &&
  SUPABASE_PUBLISHABLE_KEY.startsWith('sb_') &&
  !SUPABASE_PUBLISHABLE_KEY.includes('REPLACE_ME');
