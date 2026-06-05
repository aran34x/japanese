<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, unlockFictional } from '../lib/game/state';
  import { speakJa } from '../lib/speech';
  import {
    CHARACTERS_FICTIONAL,
    FICTIONAL_CATEGORIES,
    buildCharChallenge,
    type FictionalChar,
    type FictionalCategory,
    type FQuestion
  } from '../lib/game/fictional';
  import { getWiki, type WikiInfo } from '../lib/game/wiki';
  import FictionalPortrait from './FictionalPortrait.svelte';
  import { fly, scale } from 'svelte/transition';

  type View = 'grid' | 'detail' | 'challenge' | 'cleared';
  let view: View = 'grid';
  let cat: FictionalCategory = 'games';
  let ch: FictionalChar | null = null;

  const categories = Object.keys(FICTIONAL_CATEGORIES) as FictionalCategory[];
  $: roster = CHARACTERS_FICTIONAL.filter((x) => x.category === cat);
  $: isUnlocked = (x: FictionalChar) => $game.unlockedFictional.includes(x.id);

  let bio: WikiInfo | undefined;
  async function openDetail(x: FictionalChar) {
    ch = x;
    bio = undefined;
    view = 'detail';
    bio = await getWiki(x.wiki);
  }

  let questions: FQuestion[] = [];
  let qIndex = 0;
  let picked: number | null = null;
  let wrong = false;
  let showLesson = false;

  function startChallenge() {
    if (!ch) return;
    questions = buildCharChallenge(ch);
    qIndex = 0;
    picked = null;
    wrong = false;
    showLesson = false;
    view = 'challenge';
  }

  async function answer(i: number) {
    if (picked !== null && !wrong) return;
    picked = i;
    if (!questions[qIndex].options[i].correct) {
      wrong = true;
      setTimeout(() => (showLesson = true), 450);
      return;
    }
    setTimeout(async () => {
      if (qIndex + 1 >= questions.length) {
        if (ch) await unlockFictional(ch.id, ch.xp, ch.name);
        view = 'cleared';
      } else {
        qIndex += 1;
        picked = null;
        wrong = false;
        showLesson = false;
      }
    }, 600);
  }

  function retry() {
    if (ch) {
        const fresh = buildCharChallenge(ch);
        questions[qIndex] = fresh[qIndex];
    }
    picked = null;
    wrong = false;
    showLesson = false;
  }

  $: lesson = questions[qIndex]?.lesson ?? null;
</script>

{#if view === 'grid'}
  <section class="characters-view" in:fly={{ y: 12, duration: 180 }}>
    <p class="mb-3 text-sm text-slate-400">{$t('charsIntro')}</p>
    <div class="mb-4 flex flex-wrap gap-2">
      {#each categories as c}
        {@const totalInCat = CHARACTERS_FICTIONAL.filter(x => x.category === c).length}
        {@const unlockedInCat = CHARACTERS_FICTIONAL.filter(x => x.category === c && isUnlocked(x)).length}
        <button
          class="rounded-full px-3 py-1.5 text-sm font-medium {cat === c
            ? 'bg-indigo-500 text-white'
            : 'bg-slate-800 text-slate-300'}"
          on:click={() => (cat = c)}>
          {FICTIONAL_CATEGORIES[c].emoji} {FICTIONAL_CATEGORIES[c].label[$settings.uiLang]} ({unlockedInCat}/{totalInCat})
        </button>
      {/each}
    </div>

    <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {#each roster as x (x.id)}
        {@const unlocked = isUnlocked(x)}
        <button class="text-center" on:click={() => openDetail(x)}>
          <div
            class="grid aspect-square place-items-center rounded-xl border border-slate-700/70 bg-slate-800 text-3xl"
            style={unlocked ? `background:${x.color}22;border-color:${x.color}55` : ''}
          >
            {#if unlocked}
              <FictionalPortrait character={x} />
            {:else}
              🔒
            {/if}
          </div>
          <div class="mt-1 truncate text-xs font-medium {unlocked ? '' : 'text-slate-500'}">
            {unlocked ? x.name : '???'}
          </div>
          <div class="text-[10px] text-slate-500">{unlocked ? '✓' : '🔒'}</div>
        </button>
      {/each}
    </div>
  </section>

{:else if view === 'detail' && ch}
  <section in:fly={{ y: 12, duration: 180 }} class="characters-view space-y-4">
    <button class="text-sm text-slate-400" on:click={() => (view = 'grid')}>← {$t('back')}</button>
    <div class="grid place-items-center">
      <div
        class="grid h-28 w-28 overflow-hidden place-items-center rounded-3xl border border-slate-700 bg-slate-800 text-5xl"
        style={isUnlocked(ch) ? `background:${ch.color}22;border-color:${ch.color}55` : ''}
      >
        {#if isUnlocked(ch)}
          <FictionalPortrait character={ch} rounded="rounded-3xl" />
        {:else}
          🔒
        {/if}
      </div>
      <div class="mt-3 text-center">
        <div class="text-xl font-bold">{isUnlocked(ch) ? ch.name : '???'}</div>
        <div class="font-jp text-lg text-pink-300">{isUnlocked(ch) ? ch.ja : '???'}</div>
        <div class="text-xs text-slate-500">{FICTIONAL_CATEGORIES[ch.category].emoji} {FICTIONAL_CATEGORIES[ch.category].label[$settings.uiLang]}</div>
      </div>
    </div>

    {#if isUnlocked(ch)}
      <div class="text-center font-jp text-sm text-slate-300">{ch.reading} · {ch.romaji}</div>
      {#if bio?.extract}
        <p class="rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">{bio.extract}</p>
      {/if}
      <p class="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">💡 {ch.fact[$settings.uiLang]}</p>
      {#if bio?.pageUrl}
        <a href={bio.pageUrl} target="_blank" rel="noopener" class="block text-center text-sm text-sky-400 underline">
          {$t('openWikipedia')} ↗
        </a>
      {/if}
      <button class="w-full rounded-xl bg-slate-700 py-3 font-semibold" on:click={startChallenge}>
        ↺ {$t('replay')}
      </button>
    {:else}
      <p class="text-center text-sm text-slate-400">{$t('charsLockedHint')}</p>
      <button
        class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
        on:click={startChallenge}>⚔ {$t('takeChallenge')}</button>
    {/if}
  </section>

{:else if view === 'challenge' && ch}
  <section class="characters-view space-y-4">
    <div class="flex items-center justify-between text-sm">
      <button class="text-slate-400" on:click={() => (view = 'detail')}>✕</button>
      <span class="text-slate-400">{qIndex + 1} / {questions.length}</span>
    </div>

    {#key qIndex}
      <div in:fly={{ y: 14, duration: 160 }}>
        <div class="rounded-2xl bg-slate-800 p-5 text-center">
          <div class="mx-auto max-w-2xl text-base font-semibold leading-snug text-slate-200 sm:text-lg">
            {questions[qIndex].instruction[$settings.uiLang]}
          </div>
          {#if questions[qIndex].show}
            {@const showText = questions[qIndex].show ?? ''}
            <div class="flex items-center justify-center gap-4 py-4">
              <div class="font-jp text-5xl">{showText}</div>
              {#if /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(showText) && qIndex < questions.length - 1}
                <button
                  class="rounded-xl bg-slate-700 p-3 text-xl transition-colors active:bg-slate-600"
                  title="🔊"
                  on:click={() => speakJa(showText)}
                >🔊</button>
              {/if}
            </div>
          {/if}
        </div>
        <div class="mt-3 grid gap-2">
          {#each questions[qIndex].options as opt, i}
            {@const txt = opt.text ?? opt[$settings.uiLang] ?? ''}
            <div class="flex items-stretch gap-2">
              <button
                disabled={picked !== null && !wrong}
                class="flex-1 rounded-xl px-4 py-3 text-left text-lg transition-colors
                  {picked === i && opt.correct ? 'bg-green-600 text-white' : ''}
                  {picked === i && !opt.correct ? 'bg-rose-700 text-white' : ''}
                  {picked !== i ? 'bg-slate-800 active:bg-slate-700' : ''}"
                on:click={() => answer(i)}>{txt}</button>
              {#if /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(txt)}
                <button
                  class="shrink-0 rounded-xl bg-slate-800 px-3 active:bg-slate-700"
                  title="🔊"
                  on:click|stopPropagation={() => speakJa(txt)}>🔊</button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/key}

    {#if showLesson && lesson}
      <div in:scale={{ start: 0.9, duration: 200 }} class="rounded-2xl border border-amber-500/30 bg-slate-900 p-4">
        <div class="mb-2 font-bold text-amber-300">📖 {$t('miniLesson')}</div>
        {#each lesson.vocab as v}
          <div class="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2">
            <span class="font-jp text-xl">{v.jp}</span>
            <span class="text-sm text-pink-300">{v.reading}</span>
            <span class="ml-auto text-sm text-slate-300">{v.meaning[$settings.uiLang]}</span>
          </div>
        {/each}
        <p class="mt-3 text-sm italic text-slate-400">{lesson.tip[$settings.uiLang]}</p>
        <button class="mt-3 w-full rounded-xl bg-indigo-500 py-2 font-semibold" on:click={retry}>
          {$t('gotItRetry')}
        </button>
      </div>
    {/if}
  </section>

{:else if view === 'cleared' && ch}
  <section class="characters-view grid place-items-center py-10 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="grid h-32 w-32 overflow-hidden place-items-center rounded-3xl border text-6xl" style="background:{ch.color}22;border-color:{ch.color}55">
      <FictionalPortrait character={ch} rounded="rounded-3xl" />
    </div>
    <div class="mt-3 text-2xl">🎉</div>
    <div class="text-xl font-black">{ch.name}</div>
    <div class="font-jp text-pink-300">{ch.ja}</div>
    <div class="mt-1 text-sm text-slate-400">
      {$t('unlocked')} +{ch.xp} XP
    </div>
    <div class="mt-5 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => ch && openDetail(ch)}>
        {$t('viewBio')}
      </button>
      <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'grid')}>{$t('back')}</button>
    </div>
  </section>
{/if}
