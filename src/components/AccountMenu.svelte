<script lang="ts">
  import { settings, navigate } from '../lib/stores';
  import { syncSession, syncConfigured, signOut, push, pull, initSync } from '../lib/sync';
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';

  let open = false;
  let busy = false;
  let msg = '';
  const it = () => $settings.uiLang === 'it';

  onMount(initSync);

  $: email = $syncSession?.user?.email ?? '';
  $: initial = email ? email[0].toUpperCase() : '?';

  function close() {
    open = false;
  }

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
  const doSync = () => act(push, it() ? 'Sincronizzato' : 'Synced');
</script>

<div class="relative">
  {#if $syncConfigured && $syncSession}
    <button
      class="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 text-sm font-bold text-white"
      on:click={() => (open = !open)}
      title={email}
    >{initial}</button>
  {:else}
    <button
      class="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200"
      on:click={() => navigate('settings')}
    >{it() ? 'Accedi' : 'Sign in'}</button>
  {/if}

  {#if open}
    <!-- backdrop -->
    <button class="fixed inset-0 z-40 cursor-default" on:click={close} aria-label="close"></button>
    <div
      class="absolute right-0 top-11 z-50 w-60 rounded-2xl bg-slate-800 p-3 shadow-2xl ring-1 ring-slate-700"
      in:fly={{ y: -8, duration: 160 }}
    >
      <div class="mb-2 flex items-center gap-3 border-b border-slate-700 pb-3">
        <div class="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 font-bold text-white">{initial}</div>
        <div class="min-w-0">
          <div class="truncate text-sm font-semibold">{email}</div>
          <div class="text-xs text-green-400">● {it() ? 'Sincronizzato' : 'Synced'}</div>
        </div>
      </div>

      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700" on:click={() => { navigate('settings'); close(); }}>
        ⚙️ {it() ? 'Impostazioni e dati' : 'Settings & data'}
      </button>
      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-700 disabled:opacity-50" disabled={busy} on:click={doSync}>
        ☁️ {it() ? 'Sincronizza ora' : 'Sync now'}
      </button>
      <button class="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-rose-300 hover:bg-slate-700 disabled:opacity-50" disabled={busy} on:click={doSignOut}>
        ⎋ {it() ? 'Esci' : 'Sign out'}
      </button>
      {#if msg}<div class="mt-1 px-2 text-xs text-pink-300">{msg}</div>{/if}
    </div>
  {/if}
</div>
