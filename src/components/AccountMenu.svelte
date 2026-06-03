<script lang="ts">
  import { navigate, t, settings } from '../lib/stores';
  import { syncSession, syncConfigured, signOut, syncStatus, initSync } from '../lib/sync';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Backdrop from './Backdrop.svelte';

  let open = false;
  let busy = false;
  let msg = '';

  onMount(initSync);

  $: email = $syncSession?.user?.email ?? '';
  $: initial = email ? email[0].toUpperCase() : '?';

  function close() { open = false; }

  async function act(fn: () => Promise<unknown>, ok: string) {
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

  const doSignOut = () => act(async () => { await signOut(); open = false; }, '');

  function toggleTheme() {
    settings.update((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  }
</script>

<div class="relative">
  {#if $syncConfigured && $syncSession}
    <button
      class="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white"
      on:click={() => (open = !open)}
      title={email}
    >{initial}</button>
  {:else}
    <button
      class="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-base"
      on:click={() => (open = !open)}
      title="Menu"
    >☰</button>
  {/if}

  {#if open}
    <Backdrop onClose={close} />
    <div
      class="absolute right-0 top-11 z-50 w-64 rounded-2xl bg-slate-800 p-3 shadow-2xl ring-1 ring-slate-700"
      transition:fly={{ y: -8, duration: 160 }}
    >
      <!-- Language -->
      <div class="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
        <span class="px-2 text-xs text-slate-400">{$t('uiLanguage')}</span>
        <div class="flex gap-1 rounded-full bg-slate-700 p-1 text-xs">
          <button
            class="rounded-full px-3 py-1 {$settings.uiLang === 'en' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
            on:click={() => settings.update((s) => ({ ...s, uiLang: 'en' }))}>EN</button>
          <button
            class="rounded-full px-3 py-1 {$settings.uiLang === 'it' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
            on:click={() => settings.update((s) => ({ ...s, uiLang: 'it' }))}>IT</button>
        </div>
      </div>

      <!-- Theme -->
      <div class="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
        <span class="px-2 text-xs text-slate-400">{$settings.theme === 'dark' ? 'Dark' : 'Light'}</span>
        <button
          class="grid h-8 w-8 place-items-center rounded-full bg-slate-700 text-base hover:bg-slate-600"
          on:click={toggleTheme}
          title="Toggle theme"
        >{$settings.theme === 'dark' ? '☀️' : '🌙'}</button>
      </div>

      <!-- Account info (signed in only) -->
      {#if $syncConfigured && $syncSession}
        <div class="mb-2 flex items-center gap-3 border-b border-slate-700 pb-3">
          <div class="grid h-10 w-10 place-items-center rounded-full bg-indigo-600 font-bold text-white">{initial}</div>
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold">{email}</div>
            {#if $syncStatus === 'error'}
              <div class="text-xs text-rose-400">⚠ {$t('syncError')}</div>
            {:else if $syncStatus === 'pushing' || $syncStatus === 'pulling'}
              <div class="text-xs text-slate-400">⟳ {$t('syncing')}</div>
            {:else}
              <div class="text-xs text-green-400">● {$t('autoSaved')}</div>
            {/if}
          </div>
        </div>
      {/if}

      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700" on:click={() => { navigate('stats'); close(); }}>
        📊 {$t('stats')}
      </button>
      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700" on:click={() => { navigate('settings'); close(); }}>
        ⚙️ {$t('settingsLabel')}
      </button>

      {#if $syncConfigured && $syncSession}
        <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-rose-300 hover:bg-slate-700 disabled:opacity-50" disabled={busy} on:click={doSignOut}>
          ⎋ {$t('signOut')}
        </button>
      {:else}
        <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-indigo-300 hover:bg-slate-700" on:click={() => { navigate('settings'); close(); }}>
          → {$t('signIn')}
        </button>
      {/if}

      {#if msg}<div class="mt-1 px-2 text-xs text-pink-300">{msg}</div>{/if}
    </div>
  {/if}
</div>
