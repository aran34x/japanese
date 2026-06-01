<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '../lib/stores';
  import {
    initSync,
    loadSyncConfig,
    saveSyncConfig,
    clearSyncConfig,
    signInWithEmail,
    signOut,
    push,
    pull,
    syncSession,
    syncConfigured,
    syncStatus
  } from '../lib/sync';

  let url = '';
  let anonKey = '';
  let email = '';
  let msg = '';
  let busy = false;
  let showSetup = false;

  const it = () => $settings.uiLang === 'it';

  onMount(async () => {
    await initSync();
    const cfg = await loadSyncConfig();
    if (cfg) {
      url = cfg.url;
      anonKey = cfg.anonKey;
    }
  });

  async function saveCfg() {
    busy = true;
    msg = '';
    try {
      await saveSyncConfig({ url: url.trim(), anonKey: anonKey.trim() });
      showSetup = false;
      msg = it() ? 'Configurazione salvata.' : 'Configuration saved.';
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  async function disconnect() {
    await clearSyncConfig();
    url = '';
    anonKey = '';
    msg = it() ? 'Disconnesso.' : 'Disconnected.';
  }

  async function login() {
    busy = true;
    msg = '';
    try {
      await signInWithEmail(email.trim());
      msg = it()
        ? 'Controlla la tua email per il link di accesso.'
        : 'Check your email for the login link.';
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  async function doPush() {
    busy = true;
    msg = '';
    try {
      await push();
      msg = it() ? 'Progressi caricati nel cloud.' : 'Progress uploaded to the cloud.';
    } catch (e) {
      msg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  async function doPull() {
    busy = true;
    msg = '';
    try {
      const had = await pull();
      msg = had
        ? it()
          ? 'Progressi ripristinati. Ricarico…'
          : 'Progress restored. Reloading…'
        : it()
          ? 'Nessun salvataggio nel cloud ancora.'
          : 'No cloud save yet.';
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
      <span class="ml-auto rounded-full bg-green-600/30 px-2 py-0.5 text-xs text-green-300">●  {it() ? 'attivo' : 'on'}</span>
    {/if}
  </div>

  {#if !$syncConfigured || showSetup}
    <p class="mb-3 text-xs leading-relaxed text-slate-400">
      {it()
        ? 'Crea un progetto gratuito su supabase.com, poi incolla qui l\'URL e la chiave anon (Project Settings → API). Le credenziali restano solo su questo dispositivo.'
        : 'Create a free project at supabase.com, then paste your Project URL and anon key (Project Settings → API). Credentials stay only on this device.'}
    </p>
    <input bind:value={url} placeholder="https://xxxx.supabase.co"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500" />
    <input bind:value={anonKey} placeholder="anon public key"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500" />
    <button class="w-full rounded-lg bg-indigo-500 py-2 text-sm font-semibold disabled:opacity-50" disabled={busy || !url || !anonKey} on:click={saveCfg}>
      {it() ? 'Connetti' : 'Connect'}
    </button>
    <a href="https://supabase.com" target="_blank" rel="noopener" class="mt-2 block text-center text-xs text-sky-400 underline">supabase.com ↗</a>
  {:else if !$syncSession}
    <p class="mb-2 text-xs text-slate-400">
      {it() ? 'Accedi via email per sincronizzare tra dispositivi.' : 'Sign in via email to sync across devices.'}
    </p>
    <input bind:value={email} type="email" placeholder="you@example.com"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-500" />
    <button class="w-full rounded-lg bg-indigo-500 py-2 text-sm font-semibold disabled:opacity-50" disabled={busy || !email} on:click={login}>
      {it() ? 'Inviami il link' : 'Send me the link'}
    </button>
    <button class="mt-2 w-full text-center text-xs text-slate-500 underline" on:click={() => (showSetup = true)}>
      {it() ? 'Modifica credenziali' : 'Edit credentials'}
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
