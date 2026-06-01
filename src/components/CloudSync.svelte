<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '../lib/stores';
  import { initSync, signInWithEmail, signOut, push, pull, syncSession, syncConfigured } from '../lib/sync';

  let msg = '';
  let busy = false;
  let email = '';
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

  const login = () =>
    run(
      () => signInWithEmail(email.trim()),
      it() ? 'Controlla la tua email per il link di accesso.' : 'Check your email for the login link.'
    );
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
        ? 'Inserisci la tua email: ti invieremo un link per accedere e sincronizzare i progressi su tutti i dispositivi.'
        : "Enter your email — we'll send a one-tap login link to sync your progress across all devices."}
    </p>
    <input
      bind:value={email}
      type="email"
      placeholder="you@example.com"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500"
    />
    <button
      class="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold disabled:opacity-50"
      disabled={busy || !email.includes('@')}
      on:click={login}
    >
      ✉️ {it() ? 'Inviami il link' : 'Send me the link'}
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
