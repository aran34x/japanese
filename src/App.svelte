<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { ready, route, navigate, t, settings } from './lib/stores';
  import { loadSettings } from './lib/stores';
  import { ensureSeeded } from './lib/data/seed';
  import { loadGame } from './lib/game/state';
  import { initSync, authReady, syncSession, syncConfigured } from './lib/sync';
  import AuthGate from './components/AuthGate.svelte';
  import AccountMenu from './components/AccountMenu.svelte';
  import SaveIndicator from './components/SaveIndicator.svelte';
  import Home from './components/Home.svelte';
  import Study from './components/Study.svelte';
  import Stories from './components/Stories.svelte';
  import Decks from './components/Decks.svelte';
  import Stats from './components/Stats.svelte';
  import SettingsScreen from './components/SettingsScreen.svelte';
  import ImportScreen from './components/ImportScreen.svelte';
  import Adventure from './components/Adventure.svelte';
  import Toasts from './components/Toasts.svelte';
  import WhatsNew from './components/WhatsNew.svelte';
  import Nav from './components/Nav.svelte';

  let skippedAuth = false;

  onMount(async () => {
    await loadSettings();
    await ensureSeeded();
    await loadGame();
    ready.set(true);
    // Initialise cloud sync (resolves the session and sets authReady).
    void initSync();
  });

  // Show the login gate on startup until the user logs in or chooses to skip.
  // If sync isn't configured, never gate.
  $: showGate =
    $ready && $authReady && $syncConfigured && !$syncSession && !skippedAuth;
</script>

{#if showGate}
  <AuthGate on:done={() => (skippedAuth = true)} />
{:else if $ready}
  <div class="mx-auto flex min-h-screen max-w-2xl flex-col lg:max-w-5xl">
    <header class="flex items-center justify-between px-4 pb-2 pt-4">
      <button class="text-left" on:click={() => navigate('home')}>
        <h1 class="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent">
          日本語 · {$t('appName')}
        </h1>
      </button>
      <div class="flex items-center gap-2">
        <SaveIndicator />
        <div class="flex gap-1 rounded-full bg-slate-800 p-1 text-xs">
          <button
            class="rounded-full px-3 py-1 {$settings.uiLang === 'en' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
            on:click={() => settings.update((s) => ({ ...s, uiLang: 'en' }))}>EN</button>
          <button
            class="rounded-full px-3 py-1 {$settings.uiLang === 'it' ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
            on:click={() => settings.update((s) => ({ ...s, uiLang: 'it' }))}>IT</button>
        </div>
        <AccountMenu />
      </div>
    </header>

    <main class="flex-1 px-4 pb-24">
      {#key $route}
        <div in:fade={{ duration: 220, delay: 60 }} out:fade={{ duration: 100 }}>
          {#if $route === 'adventure'}
            <Adventure />
          {:else if $route === 'study'}
            <Study />
          {:else if $route === 'stories'}
            <Stories />
          {:else if $route === 'decks'}
            <Decks />
          {:else if $route === 'stats'}
            <Stats />
          {:else if $route === 'settings'}
            <SettingsScreen />
          {:else if $route === 'import'}
            <ImportScreen />
          {:else}
            <Home />
          {/if}
        </div>
      {/key}
    </main>

    <Nav />
    <Toasts />
    <WhatsNew />
  </div>
{:else}
  <div class="grid min-h-screen place-items-center text-slate-400">読み込み中…</div>
{/if}
