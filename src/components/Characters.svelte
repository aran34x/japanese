<script lang="ts">
  import { settings, t, navigate } from '../lib/stores';
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
  import QuizQuestion from './QuizQuestion.svelte';
  import { fly, scale } from 'svelte/transition';
  import { lessonProgress, missingRecommended, recommendedLessonsForCharacter } from '../lib/lessons';

  type View = 'grid' | 'detail' | 'challenge' | 'cleared';
  let view: View = 'grid';
  let cat: FictionalCategory = 'games';
  let ch: FictionalChar | null = null;

  const categories = Object.keys(FICTIONAL_CATEGORIES) as FictionalCategory[];
  $: roster = CHARACTERS_FICTIONAL.filter((x) => x.category === cat);
  $: isUnlocked = (x: FictionalChar) => $game.unlockedFictional.includes(x.id);
  $: recommendedLessonIds = ch ? recommendedLessonsForCharacter(ch) : [];
  $: missingLessons = missingRecommended(recommendedLessonIds, $lessonProgress);

  let bio: WikiInfo | undefined;
  async function openDetail(x: FictionalChar) {
    ch = x;
    bio = undefined;
    view = 'detail';
    bio = await getWiki(x.wiki);
  }

  let questions: FQuestion[] = [];
  let qIndex = 0;
  let exNonce = 0;

  function startChallenge() {
    if (!ch) return;
    questions = buildCharChallenge(ch);
    qIndex = 0;
    exNonce++;
    view = 'challenge';
  }

  let correctCount = 0;
  async function onAnswer(correct: boolean) {
    if (correct) correctCount++;
  }

  async function onNext() {
    if (qIndex + 1 >= questions.length) {
      if (correctCount >= questions.length && ch) {
        await unlockFictional(ch.id, ch.xp, ch.name);
        view = 'cleared';
      } else {
        // If they missed any, they must retry the whole thing or just the failed ones?
        // The original logic was "Got it - retry" which resets the current question.
        // But QuizQuestion handles the lesson display.
        // If they were wrong, they should probably stay on this question until they retry?
        // Actually, let's keep it simple: if wrong, the Next button will just refresh the same question.
        if (correctCount <= qIndex) {
            // They were wrong on THIS question
            if (ch) {
                const fresh = buildCharChallenge(ch);
                questions[qIndex] = fresh[qIndex];
                exNonce++;
            }
        } else {
            qIndex++;
            exNonce++;
        }
      }
    } else {
      if (correctCount <= qIndex) {
         if (ch) {
            const fresh = buildCharChallenge(ch);
            questions[qIndex] = fresh[qIndex];
            exNonce++;
         }
      } else {
         qIndex++;
         exNonce++;
      }
    }
  }

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
        <div class="flex items-center justify-center gap-2">
          <div class="text-xl font-bold">{isUnlocked(ch) ? ch.name : '???'}</div>
          {#if isUnlocked(ch)}
            <button
              class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]"
              on:click={() => ch && speakJa(ch.name)}
              title="🔊">🔊</button>
          {/if}
        </div>
        <div class="flex items-center justify-center gap-2 font-jp text-lg text-highlight">
          {isUnlocked(ch) ? ch.ja : '???'}
          {#if isUnlocked(ch)}
            <button
              class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]"
              on:click={() => ch && speakJa(ch.ja)}
              title="🔊">🔊</button>
          {/if}
        </div>
        <div class="text-xs text-slate-500">{FICTIONAL_CATEGORIES[ch.category].emoji} {FICTIONAL_CATEGORIES[ch.category].label[$settings.uiLang]}</div>
      </div>
    </div>

    {#if missingLessons.length}
      <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
        <div class="font-bold">⚠ {$t('recommendedLessons')}</div>
        <div class="mt-1 text-amber-100/80">{$t('missingLessonsWarning')}</div>
        <div class="mt-2 flex flex-wrap gap-1.5">
          {#each missingLessons as lesson}
            <span class="rounded-full bg-slate-900/60 px-2 py-1 text-xs">{lesson.title[$settings.uiLang]}</span>
          {/each}
        </div>
        <button class="mt-3 rounded-lg bg-slate-900/70 px-3 py-1.5 text-xs font-bold" on:click={() => navigate('lessons')}>
          {$t('lessons')}
        </button>
      </div>
    {/if}

    {#if isUnlocked(ch)}
      <div class="text-center font-jp text-sm text-slate-300">{ch.reading} · {ch.romaji}</div>
      {#if bio?.extract}
        <p class="rounded-2xl bg-slate-800 p-4 text-sm leading-relaxed text-slate-300">{bio.extract}</p>
      {/if}
      <p class="rounded-xl bg-amber-500/10 p-3 text-sm text-amber-200">💡 {ch.fact[$settings.uiLang]}</p>
      {#if bio?.pageUrl}
        <a href={bio.pageUrl} target="_blank" rel="noopener" class="block text-center text-sm text-highlight underline">
          {$t('openWikipedia')} ↗
        </a>
      {/if}
      <button class="w-full rounded-xl bg-slate-700 py-3 font-semibold" on:click={startChallenge}>
        ↺ {$t('replay')}
      </button>
    {:else}
      <p class="text-center text-sm text-slate-400">{$t('charsLockedHint')}</p>
      <button
        class="w-full rounded-xl bg-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
        on:click={startChallenge}>⚔ {$t('takeChallenge')}</button>
    {/if}
  </section>

{:else if view === 'challenge' && ch}
  {@const q = questions[qIndex]}
  <section class="characters-view space-y-4">
    <div class="flex items-center justify-between text-sm">
      <button class="text-slate-400" on:click={() => (view = 'detail')}>✕</button>
      <span class="text-slate-400">{qIndex + 1} / {questions.length}</span>
    </div>

    {#key exNonce}
      <div in:fly={{ y: 14, duration: 160 }}>
        <QuizQuestion
            prompt={q.show || ''}
            instruction={q.instruction[$settings.uiLang] || ''}
            options={q.options.map(o => ({ label: o.text || o[$settings.uiLang] || '', correct: o.correct }))}
            lesson={q.lesson}
            on:answer={(e) => onAnswer(e.detail.correct)}
            on:next={onNext}
        />
      </div>
    {/key}
  </section>

{:else if view === 'cleared' && ch}
  <section class="characters-view grid place-items-center py-10 text-center" in:scale={{ start: 0.8, duration: 300 }}>
    <div class="grid h-32 w-32 overflow-hidden place-items-center rounded-3xl border text-6xl" style="background:{ch.color}22;border-color:{ch.color}55">
      <FictionalPortrait character={ch} rounded="rounded-3xl" />
    </div>
    <div class="mt-3 text-2xl">🎉</div>
    <div class="text-xl font-black">{ch.name}</div>
    <div class="font-jp text-highlight">{ch.ja}</div>
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
