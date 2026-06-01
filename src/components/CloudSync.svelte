<script lang="ts">
  import { onMount } from 'svelte';
  import { settings } from '../lib/stores';
  import {
    initSync,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    push,
    pull,
    syncSession,
    syncConfigured
  } from '../lib/sync';

  let msg = '';
  let busy = false;
  let email = '';
  let password = '';
  let mode: 'login' | 'signup' = 'login';
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

  async function auth() {
    if (mode === 'signup') {
      await run(async () => {
        const r = await signUpWithPassword(email.trim(), password);
        if (r === 'confirm-email')
          msg = it() ? 'Conferma la tua email, poi accedi.' : 'Confirm your email, then log in.';
      }, it() ? 'Account creato.' : 'Account created.');
    } else {
      await run(() => signInWithPassword(email.trim(), password), it() ? 'Accesso effettuato.' : 'Logged in.');
    }
  }
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
    <div class="mb-2 flex gap-1 rounded-full bg-slate-900 p-1 text-xs">
      <button class="flex-1 rounded-full py-1 {mode === 'login' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'login'; msg = ''; }}>{it() ? 'Accedi' : 'Log in'}</button>
      <button class="flex-1 rounded-full py-1 {mode === 'signup' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'signup'; msg = ''; }}>{it() ? 'Registrati' : 'Sign up'}</button>
    </div>
    <input
      bind:value={email}
      type="email"
      autocomplete="email"
      placeholder="you@example.com"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500"
    />
    <input
      bind:value={password}
      type="password"
      autocomplete={mode === 'signup' ? 'new-password' : 'current-password'}
      placeholder="Password"
      class="mb-2 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-pink-500"
    />
    <button
      class="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold disabled:opacity-50"
      disabled={busy || !email.includes('@') || password.length < 6}
      on:click={auth}
    >
      {mode === 'signup' ? (it() ? 'Crea account' : 'Create account') : (it() ? 'Accedi' : 'Log in')}
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
