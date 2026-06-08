<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { ready, route, navigate, t, settings, settingsOpen, statsOpen } from './lib/stores';
  import { UI } from './lib/ui-config';
  import Modal from './components/Modal.svelte';
  import { loadSettings } from './lib/stores';
  import { ensureSeeded } from './lib/data/seed';
  import { loadGame, resetAllProgress } from './lib/game/state';
  import { loadXray, furiganaOn, xrayOn } from './lib/kanji/xray';
  import { enableFurigana, disableFurigana } from './lib/kanji/furigana';
  import { enableXray, disableXray, refreshXraySizing } from './lib/kanji/xray-annotate';
  import { initSync, authReady, syncSession, syncConfigured, setSignedOutHandler } from './lib/sync';
  import AuthGate from './components/AuthGate.svelte';
  import AccountMenu from './components/AccountMenu.svelte';
  import SaveIndicator from './components/SaveIndicator.svelte';
  import Home from './components/Home.svelte';
  import Study from './components/Study.svelte';
  import Lessons from './components/Lessons.svelte';
  import Guide from './components/Guide.svelte';
  import Stories from './components/Stories.svelte';
  import { loadBookProgress } from './lib/book';
  import Stats from './components/Stats.svelte';
  import SettingsScreen from './components/SettingsScreen.svelte';
  import { ensureAnkiDecks } from './lib/data/anki-seed';
  import { checkForUpdates } from './lib/sw-update';
  import Adventure from './components/Adventure.svelte';
  import Levels from './components/Levels.svelte';
  import Achievements from './components/Achievements.svelte';
  import Toasts from './components/Toasts.svelte';
  import WhatsNew from './components/WhatsNew.svelte';
  import { getXrayKanjiSizePreset } from './lib/xray-size-presets';
  import { loadLessonProgress } from './lib/lessons';

  let skippedAuth = false;

  // Toggle global furigana annotation across the whole app.
  $: if (typeof document !== 'undefined') {
    if ($furiganaOn) enableFurigana();
    else disableFurigana();
  }

  // Toggle the kanji X-ray overlay (cycling meaning + readings above each kanji).
  $: if (typeof document !== 'undefined') {
    if ($xrayOn) enableXray();
    else disableXray();
  }

  // Furigana and X-ray are mutually exclusive (both annotate kanji).
  function toggleFurigana() {
    furiganaOn.update((v) => !v);
    if ($furiganaOn) xrayOn.set(false);
  }
  function toggleXray() {
    xrayOn.update((v) => !v);
    if ($xrayOn) furiganaOn.set(false);
  }

  // Apply the active skin to <html> so its CSS-variable palette takes effect.
  $: if (typeof document !== 'undefined') {
    document.documentElement.dataset.skin = $settings.skin ?? 'default';
  }

  // User-chosen X-ray size preset. The preset owns every sizing/timing knob.
  $: if (typeof document !== 'undefined') {
    const xraySize = getXrayKanjiSizePreset($settings.xrayKanjiScale);
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--xray-kanji-scale', String(xraySize.kanjiTextScale));
    rootStyle.setProperty('--xray-reading-font', `${xraySize.readingHintFontPx}px`);
    rootStyle.setProperty('--xray-meaning-font', `${xraySize.meaningHintFontPx}px`);
    rootStyle.setProperty('--xray-hint-line-height', String(xraySize.hintLineHeight));
    rootStyle.setProperty('--xray-hint-cycle-ms', String(xraySize.hintCycleMs));
    rootStyle.setProperty('--xray-slot-margin', `${xraySize.horizontalHintMarginPx}px`);
    rootStyle.setProperty('--xray-slot-min', `${xraySize.slotMinWidthPx}px`);
    rootStyle.setProperty('--xray-hint-kanji-gap', `${xraySize.hintKanjiGapRem}rem`);
    if ($xrayOn) refreshXraySizing();
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
    await loadLessonProgress();
    await loadBookProgress();
    await loadXray();
    ready.set(true);
    // Seed built-in Anki decks in background (fetches JSON + media URLs from Supabase).
    void ensureAnkiDecks();
    // Initialise cloud sync (resolves the session and sets authReady).
    void initSync();
    // Check for a new app version silently on every launch.
    void checkForUpdates();
  });

  // Show the login gate on startup until the user logs in or chooses to skip.
  // If sync isn't configured, never gate.
  $: showGate =
    $ready && $authReady && $syncConfigured && !$syncSession && !skippedAuth;
  $: routeTitleKey =
    $route === 'study'
      ? 'custom'
      : $route === 'adventure'
        ? 'charactersTab'
        : $route;
</script>

{#if showGate}
  <AuthGate on:done={() => (skippedAuth = true)} />
{:else if $ready}
  <div class="flex h-screen max-w-none flex-col overflow-hidden bg-slate-950">
    <!-- Fixed-height App Header -->
    <header class="z-50 shrink-0 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div class="relative mx-auto flex max-w-5xl items-center justify-between px-4 {UI.topbarPadding}">
        {#if $route === 'home'}
          <div class="xray-dim-el grid h-9 w-9 place-items-center rounded-full bg-slate-800 text-lg">🏠</div>
        {:else}
          <button
            class="xray-dim-el flex h-9 items-center gap-1.5 rounded-full bg-slate-800 px-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 active:scale-95"
            title={$t('menu')}
            on:click={() => navigate('home')}>← {$t('menu')}</button>
        {/if}
        {#if $route !== 'home'}
          <div class="xray-dim-el pointer-events-none absolute left-1/2 -translate-x-1/2 text-sm font-bold tracking-wide text-slate-200">
            {$t(routeTitleKey)}
          </div>
        {/if}
        <div class="flex items-center gap-2">
          <span class="xray-dim-el"><SaveIndicator /></span>
          <button
            class="xray-dim-el grid h-9 w-9 place-items-center rounded-full text-sm font-bold {$furiganaOn ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}"
            title="Furigana"
            on:click={toggleFurigana}>ふ</button>
          <button
            class="grid h-9 w-9 place-items-center rounded-full text-sm font-bold {$xrayOn ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-300'}"
            title="Kanji X-ray (meanings + readings on screen)"
            on:click={toggleXray}>🔍</button>
          <span class="xray-dim-el"><AccountMenu /></span>
        </div>
      </div>
    </header>

    <!-- Content Area (NOT scrollable here, children handle it for edge-to-edge scrollbars) -->
    <main class="flex-1 flex flex-col overflow-hidden">
      {#key $route}
        <div class="flex-1 flex flex-col overflow-hidden" in:fly={{ y: 28, duration: 240, delay: 60 }} out:fade={{ duration: 100 }}>
          {#if $route === 'adventure'}
            <Adventure />
          {:else if $route === 'levels'}
            <Levels />
          {:else if $route === 'achievements'}
            <Achievements />
          {:else if $route === 'study'}
            <Study />
          {:else if $route === 'lessons'}
            <Lessons />
          {:else if $route === 'guide'}
            <Guide />
          {:else if $route === 'stories'}
            <Stories />
          {:else}
            <Home />
          {/if}
        </div>
      {/key}
    </main>

    <Toasts />
    <WhatsNew />
    {#if $xrayOn}
      <!-- Dims the whole screen; kanji are lifted above it via z-index. -->
      <div class="xray-dim-overlay" transition:fade={{ duration: 200 }}></div>
    {/if}

    {#if $settingsOpen}
      <Modal onClose={() => settingsOpen.set(false)}><SettingsScreen /></Modal>
    {/if}
    {#if $statsOpen}
      <Modal onClose={() => statsOpen.set(false)}><Stats /></Modal>
    {/if}
  </div>
{:else}
  <div class="grid min-h-screen place-items-center text-slate-400">読み込み中…</div>
{/if}

<style>
  /* Ensure the app container takes up exactly the viewport height */
  :global(body) {
    overflow: hidden;
    height: 100vh;
  }
</style>
