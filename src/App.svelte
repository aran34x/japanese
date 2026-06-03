<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { ready, route, navigate, t, settings } from './lib/stores';
  import { loadSettings } from './lib/stores';
  import { ensureSeeded } from './lib/data/seed';
  import { loadGame, resetAllProgress } from './lib/game/state';
  import { loadXray, furiganaOn } from './lib/kanji/xray';
  import { enableFurigana, disableFurigana } from './lib/kanji/furigana';
  import { initSync, authReady, syncSession, syncConfigured, setSignedOutHandler } from './lib/sync';
  import AuthGate from './components/AuthGate.svelte';
  import AccountMenu from './components/AccountMenu.svelte';
  import SaveIndicator from './components/SaveIndicator.svelte';
  import KanjiSheet from './components/KanjiSheet.svelte';
  import Home from './components/Home.svelte';
  import Study from './components/Study.svelte';
  import Stories from './components/Stories.svelte';
  import Decks from './components/Decks.svelte';
  import Stats from './components/Stats.svelte';
  import SettingsScreen from './components/SettingsScreen.svelte';
  import { ensureAnkiDecks } from './lib/data/anki-seed';
  import Adventure from './components/Adventure.svelte';
  import Toasts from './components/Toasts.svelte';
  import WhatsNew from './components/WhatsNew.svelte';
  import Nav from './components/Nav.svelte';

  let skippedAuth = false;
  let kanjiSheetOpen = false;

  // Toggle global furigana annotation across the whole app.
  $: if (typeof document !== 'undefined') {
    if ($furiganaOn) enableFurigana();
    else disableFurigana();
  }

  // Apply theme class to <html> so CSS variables switch.
  $: if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('light', $settings.theme === 'light');
  }

  // Clear local progress so a guest/other identity starts clean. Called by sync
  // during startup reconciliation (awaited) and on explicit sign-out.
  setSignedOutHandler(async () => {
    await resetAllProgress();
  });

  onMount(async () => {
    await loadSettings();
    await ensureSeeded();
    await loadGame();
    await loadXray();
    ready.set(true);
    // Seed built-in Anki decks in background (fetches JSON + media URLs from Supabase).
    void ensureAnkiDecks();
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
    <header class="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div class="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 lg:max-w-5xl">
        <button
          class="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-lg"
          title="Home"
          on:click={() => navigate('home')}>🏠</button>
        <div class="flex items-center gap-2">
          <SaveIndicator />
          <button
            class="grid h-9 w-9 place-items-center rounded-full text-sm font-bold {$furiganaOn ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}"
            title="Furigana"
            on:click={() => furiganaOn.update((v) => !v)}>ふ</button>
          <button
            class="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-sm font-bold text-slate-300"
            title="Kanji meanings on screen"
            on:click={() => (kanjiSheetOpen = true)}>🔍</button>
          <AccountMenu />
        </div>
      </div>
    </header>

    <main class="flex-1 px-4 pb-24 pt-16">
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
          {:else}
            <Home />
          {/if}
        </div>
      {/key}
    </main>

    <Nav />
    <Toasts />
    <WhatsNew />
    <KanjiSheet open={kanjiSheetOpen} onClose={() => (kanjiSheetOpen = false)} />
  </div>
{:else}
  <div class="grid min-h-screen place-items-center text-slate-400">読み込み中…</div>
{/if}
