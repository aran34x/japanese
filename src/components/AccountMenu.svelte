<script lang="ts">
  import { navigate, t, settings, settingsOpen, statsOpen } from '../lib/stores';
  import { syncSession, syncConfigured, signOut, syncStatus, initSync } from '../lib/sync';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import Backdrop from './Backdrop.svelte';
  import { portal } from '../lib/portal';
  import { checkForUpdates } from '../lib/sw-update';

  let open = false;
  let busy = false;
  let msg = '';
  let triggerEl: HTMLElement;
  let pos = { top: 0, right: 0 };
  let triggerRect = { top: 0, left: 0, width: 0, height: 0 };

  onMount(initSync);

  $: email = $syncSession?.user?.email ?? '';
  $: initial = email ? email[0].toUpperCase() : '?';

  function toggle() {
    if (!open && triggerEl) {
      const r = triggerEl.getBoundingClientRect();
      pos = { top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) };
      triggerRect = { top: r.top, left: r.left, width: r.width, height: r.height };
    }
    open = !open;
  }
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

  let updateLabel = '🔄 Check for updates';
  async function doCheckUpdates() {
    updateLabel = '⟳ Checking…';
    checkForUpdates();
    await new Promise((r) => setTimeout(r, 1500));
    updateLabel = '✓ Up to date';
    await new Promise((r) => setTimeout(r, 2000));
    updateLabel = '🔄 Check for updates';
  }
</script>

<div>
  {#if $syncConfigured && $syncSession}
    <button
      bind:this={triggerEl}
      class="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-bold text-white"
      on:click={toggle}
      title={email}
    >{initial}</button>
  {:else}
    <button
      bind:this={triggerEl}
      class="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-base"
      on:click={toggle}
      title="Menu"
    >☰</button>
  {/if}

  {#if open}
    <!-- Portaled to <body> so the blur + dropdown sit above the entire page. -->
    <div use:portal>
      <Backdrop onClose={close} />
      <!-- Sharp clone of the trigger, sitting ABOVE the blur so it stays crisp. -->
      <button
        class="fixed z-[999] grid place-items-center rounded-full {$syncConfigured && $syncSession ? 'bg-indigo-600 text-sm font-bold text-white' : 'bg-slate-800 text-base'}"
        style="top:{triggerRect.top}px; left:{triggerRect.left}px; width:{triggerRect.width}px; height:{triggerRect.height}px"
        on:click={close}
      >{$syncConfigured && $syncSession ? initial : '☰'}</button>
      <div
        class="fixed z-[999] w-64 rounded-2xl bg-slate-800 p-3 shadow-2xl ring-1 ring-slate-700"
        style="top:{pos.top}px; right:{pos.right}px"
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

      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700" on:click={() => { statsOpen.set(true); close(); }}>
        📊 {$t('stats')}
      </button>
      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700" on:click={() => { settingsOpen.set(true); close(); }}>
        ⚙ {$t('settingsLabel')}
      </button>

      {#if $syncConfigured && $syncSession}
        <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-rose-300 hover:bg-slate-700 disabled:opacity-50" disabled={busy} on:click={doSignOut}>
          ⎋ {$t('signOut')}
        </button>
      {:else}
        <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-indigo-300 hover:bg-slate-700" on:click={() => { settingsOpen.set(true); close(); }}>
          → {$t('signIn')}
        </button>
      {/if}

      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs text-slate-400 hover:bg-slate-700" on:click={doCheckUpdates}>
        {updateLabel}
      </button>

      {#if msg}<div class="mt-1 px-2 text-xs text-pink-300">{msg}</div>{/if}
      </div>
    </div>
  {/if}
</div>
