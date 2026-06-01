<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '../lib/stores';
  import { initSync, signInWithGoogle, signOut, push, pull, syncSession, syncConfigured } from '../lib/sync';

  let msg = '';
  let busy = false;
  const it = () => $settings.uiLang === 'it';

  onMount(initSync);

  async function run(fn: () => Promise<unknown>, ok: string) {
    busy = true;
    msg = '';
    try {
      await fn();
      msg = ok;
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  const login = () => run(signInWithGoogle, '');
  const doPush = () => run(push, it() ? 'Caricato nel cloud.' : 'Uploaded to the cloud.');
  async function doPull() {
    busy = true;
    msg = '';
    try {
      const had = await pull();
      msg = had ? (it() ? 'Ripristinato. Ricarico…' : 'Restored. Reloading…') : (it() ? 'Nessun salvataggio.' : 'No cloud save yet.');
      if (had) setTimeout(() => location.reload(), 900);
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }
</script>

<div class="rounded-2xl bg-slate-800 p-4">
  <div class="mb-1 flex items-center gap-2 text-sm font-medium">
    ☁️ {it() ? 'Sincronizzazione cloud' : 'Cloud sync'}
    {#if $syncSession}
      <span class="ml-auto rounded-full bg-green-600/30 px-2 py-0.5 text-xs text-green-300">● {it() ? 'attivo' : 'on'}</span>
    {/if}
  </div>

  {#if !$syncConfigured}
    <p class="text-xs text-slate-400">
      {it() ? 'Sincronizzazione non ancora disponibile.' : 'Sync not available yet.'}
    </p>
  {:else if !$syncSession}
    <p class="mb-3 text-xs text-slate-400">
      {it()
        ? 'Accedi per sincronizzare i progressi su tutti i tuoi dispositivi.'
        : 'Sign in to sync your progress across all your devices.'}
    </p>
    <button
      class="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-800 disabled:opacity-50"
      disabled={busy}
      on:click={login}
    >
      <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 5.1 29.5 3 24 3 16 3 9.1 7.6 6.3 14.7z"/><path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36 26.7 37 24 37c-5.3 0-9.7-2.6-11.3-7l-6.5 5C9.1 42.3 16 45 24 45z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C39.9 36.7 45 31 45 24c0-1.2-.1-2.3-.4-3.5z"/></svg>
      {it() ? 'Continua con Google' : 'Continue with Google'}
    </button>
  {:else}
    <div class="mb-3 truncate text-xs text-slate-400">{$syncSession.user.email}</div>
    <div class="flex gap-2">
      <button class="flex-1 rounded-lg bg-indigo-500 py-2 text-sm font-semibold disabled:opacity-50" disabled={busy} on:click={doPush}>
        ⬆ {it() ? 'Carica' : 'Upload'}
      </button>
      <button class="flex-1 rounded-lg bg-slate-700 py-2 text-sm font-semibold disabled:opacity-50" disabled={busy} on:click={doPull}>
        ⬇ {it() ? 'Scarica' : 'Download'}
      </button>
    </div>
    <button class="mt-2 w-full text-center text-xs text-slate-500 underline" on:click={signOut}>
      {it() ? 'Esci' : 'Sign out'}
    </button>
  {/if}

  {#if msg}<div class="mt-2 text-center text-xs text-pink-300">{msg}</div>{/if}
</div>
