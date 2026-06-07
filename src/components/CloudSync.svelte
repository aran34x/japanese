<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, t } from '../lib/stores';
  import { translate } from '../lib/i18n';
  import {
    initSync,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    syncSession,
    syncConfigured,
    syncStatus,
    lastSyncError
  } from '../lib/sync';

  let msg = '';
  let busy = false;
  let email = '';
  let password = '';
  let mode: 'login' | 'signup' = 'login';

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

  const tr = (k: string) => translate(k, $settings.uiLang);
  async function auth() {
    if (mode === 'signup') {
      await run(async () => {
        const r = await signUpWithPassword(email.trim(), password);
        if (r === 'confirm-email') msg = tr('confirmEmailThenLogin');
      }, tr('accountCreated'));
    } else {
      await run(() => signInWithPassword(email.trim(), password), tr('loggedIn'));
    }
  }
</script>

<div class="rounded-2xl bg-slate-800 p-4">
  <div class="mb-1 flex items-center gap-2 text-sm font-medium">
    ☁ {$t('cloudSync')}
    {#if $syncSession}
      <span class="ml-auto rounded-full bg-green-600/30 px-2 py-0.5 text-xs text-green-300">● {$t('on')}</span>
    {/if}
  </div>

  {#if !$syncConfigured}
    <p class="text-xs text-slate-400">
      {$t('syncUnavailable')}
    </p>
  {:else if !$syncSession}
    <div class="mb-2 flex gap-1 rounded-full bg-slate-900 p-1 text-xs">
      <button class="flex-1 rounded-full py-1 {mode === 'login' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'login'; msg = ''; }}>{$t('logIn')}</button>
      <button class="flex-1 rounded-full py-1 {mode === 'signup' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => { mode = 'signup'; msg = ''; }}>{$t('signUp')}</button>
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
      {mode === 'signup' ? $t('createAccount') : $t('logIn')}
    </button>
  {:else}
    <div class="truncate text-xs text-slate-400">{$syncSession.user.email}</div>
    <div class="mt-2 flex items-center gap-2 text-xs">
      {#if $syncStatus === 'error'}
        <span class="text-rose-400">⚠ {$t('syncError')}</span>
      {:else if $syncStatus === 'pushing' || $syncStatus === 'pulling'}
        <span class="text-slate-400">⟳ {$t('syncing')}</span>
      {:else}
        <span class="text-green-400">✓ {$t('allSaved')}</span>
      {/if}
    </div>
    {#if $syncStatus === 'error' && $lastSyncError}
      <div class="mt-1 rounded-lg bg-rose-900/40 p-2 text-[11px] text-rose-200">{$lastSyncError}</div>
    {/if}
    <button class="mt-3 w-full text-center text-xs text-slate-500 underline" on:click={signOut}>
      {$t('signOut')}
    </button>
  {/if}

  {#if msg}<div class="mt-2 text-center text-xs text-pink-300">{msg}</div>{/if}
</div>
