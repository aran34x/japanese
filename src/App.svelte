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
    <header class="flex items-center justify-between px-4 pb-2 pt-4">
      <button class="text-left" on:click={() => navigate('home')}>
        <h1 class="bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-2xl font-bold text-transparent">
          日本語 · {$t('appName')}
        </h1>
      </button>
      <div class="flex items-center gap-2">
        <SaveIndicator />
        <button
          class="grid h-9 w-9 place-items-center rounded-full text-sm font-bold {$furiganaOn ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}"
          title="Furigana"
          on:click={() => furiganaOn.update((v) => !v)}>ふ</button>
        <button
          class="grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-sm font-bold text-slate-300"
          title="Kanji meanings on screen"
          on:click={() => (kanjiSheetOpen = true)}>漢</button>
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
