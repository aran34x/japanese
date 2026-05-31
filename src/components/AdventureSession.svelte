<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { settings, t } from '../lib/stores';
  import { db } from '../lib/db';
  import { newReviewState, schedule } from '../lib/srs';
  import { makeExercise } from '../lib/exercises/generator';
  import type { Card, Exercise, ExerciseKind, ReviewState } from '../lib/types';
  import { game, mutateGame, xpForAnswer } from '../lib/game/state';
  import { rollEncounter, ENCOUNTER_LABELS, type Encounter } from '../lib/game/encounters';
  import ExerciseView from './ExerciseView.svelte';
  import { fly, scale } from 'svelte/transition';

  export let deckIds: string[];
  const dispatch = createEventDispatcher();

  type Phase = 'loading' | 'play' | 'encounter-intro' | 'boss' | 'speed' | 'gamble' | 'done';
  let phase: Phase = 'loading';

  let pool: Card[] = [];
  let order: number[] = [];
  let cursor = 0;
  const stateMap = new Map<string, ReviewState>();

  let current: Exercise | null = null;
  let exNonce = 0;
  let combo = 0;
  let sessionXp = 0;
  let cardsSinceEncounter = 0;
  let feedbackMs = 950;

  let encounter: Encounter | null = null;
  let bossHp = 0;
  let bossMaxHp = 0;
  let bossHit = false;
  let speedLeft = 30;
  let speedScore = 0;
  let speedTimer: ReturnType<typeof setInterval> | null = null;
  let sdScore = 0; // sudden death

  init();

  async function init() {
    pool = deckIds.length
      ? await db.cards.where('deckId').anyOf(deckIds).toArray()
      : await db.cards.toArray();
    const states = await db.reviews.bulkGet(pool.map((c) => c.id));
    states.forEach((s, i) => stateMap.set(pool[i].id, s ?? newReviewState(pool[i].id)));
    order = shuffle([...pool.keys()]);
    phase = 'play';
    nextCard();
  }

  function shuffle<T>(a: T[]): T[] {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function gameKind(card: Card): ExerciseKind {
    if (card.category === 'hiragana' || card.category === 'katakana')
      return Math.random() < 0.3 ? 'type-reading' : 'mcq-jp-to-reading';
    const opts: ExerciseKind[] = ['mcq-jp-to-meaning', 'mcq-meaning-to-jp', 'mcq-jp-to-reading', 'type-meaning'];
    return opts[Math.floor(Math.random() * opts.length)];
  }

  function pickCard(): Card {
    if (cursor >= order.length) {
      order = shuffle([...pool.keys()]);
      cursor = 0;
    }
    return pool[order[cursor++]];
  }

  function loadExercise() {
    const card = pickCard();
    current = makeExercise(card, pool, $settings.meaningLangs, gameKind(card));
    exNonce++;
  }

  function nextCard() {
    feedbackMs = 950;
    loadExercise();
  }

  async function srs(card: Card, grade: 'good' | 'again') {
    const st = stateMap.get(card.id) ?? newReviewState(card.id);
    const upd = schedule(st, grade);
    stateMap.set(card.id, upd);
    await db.reviews.put(upd);
  }

  async function award(correct: boolean, hard = false) {
    if (correct) {
      combo += 1;
      const gain = xpForAnswer(combo, hard);
      sessionXp += gain;
      await mutateGame((g) => ({
        ...g,
        xp: g.xp + gain,
        totalCorrect: g.totalCorrect + 1,
        bestStreak: Math.max(g.bestStreak, combo)
      }));
    } else {
      combo = 0;
      await mutateGame((g) => ({ ...g, totalWrong: g.totalWrong + 1 }));
    }
  }

  // ---- Normal play -------------------------------------------------------
  async function onPlayAnswer(e: CustomEvent<{ correct: boolean }>) {
    const card = current!.card;
    await award(e.detail.correct);
    await srs(card, e.detail.correct ? 'good' : 'again');
    cardsSinceEncounter += 1;
    setTimeout(() => {
      const enc = rollEncounter(cardsSinceEncounter);
      if (enc) startEncounter(enc);
      else nextCard();
    }, feedbackMs);
  }

  // ---- Encounters --------------------------------------------------------
  function startEncounter(enc: Encounter) {
    encounter = enc;
    cardsSinceEncounter = 0;
    phase = 'encounter-intro';
    setTimeout(() => beginEncounter(), 1500);
  }

  function beginEncounter() {
    if (!encounter) return;
    if (encounter.kind === 'boss') {
      bossMaxHp = bossHp = encounter.boss!.hp;
      phase = 'boss';
      loadExercise();
    } else if (encounter.kind === 'speed') {
      speedScore = 0;
      speedLeft = encounter.seconds ?? 30;
      phase = 'speed';
      loadExercise();
      speedTimer = setInterval(() => {
        speedLeft -= 1;
        if (speedLeft <= 0) endSpeed();
      }, 1000);
    } else if (encounter.kind === 'gamble') {
      phase = 'gamble';
    } else {
      sdScore = 0;
      phase = 'boss'; // reuse layout via suddenDeath flag below
      startSuddenDeath();
    }
  }

  // Boss
  async function onBossAnswer(e: CustomEvent<{ correct: boolean }>) {
    const card = current!.card;
    await award(e.detail.correct, true);
    await srs(card, e.detail.correct ? 'good' : 'again');
    if (e.detail.correct) {
      bossHit = true;
      bossHp -= 1;
      setTimeout(() => (bossHit = false), 300);
    }
    setTimeout(async () => {
      if (bossHp <= 0) {
        const bonus = 80 + combo * 4;
        sessionXp += bonus;
        await mutateGame((g) => ({ ...g, xp: g.xp + bonus, bossesDefeated: g.bossesDefeated + 1 }));
        endEncounter();
      } else {
        loadExercise();
      }
    }, 700);
  }

  // Speed
  async function onSpeedAnswer(e: CustomEvent<{ correct: boolean }>) {
    if (e.detail.correct) {
      speedScore += 1;
      combo += 1;
      await mutateGame((g) => ({ ...g, totalCorrect: g.totalCorrect + 1 }));
    } else {
      combo = 0;
      await mutateGame((g) => ({ ...g, totalWrong: g.totalWrong + 1 }));
    }
    setTimeout(loadExercise, 160);
  }
  async function endSpeed() {
    if (speedTimer) clearInterval(speedTimer);
    speedTimer = null;
    const bonus = speedScore * 8;
    sessionXp += bonus;
    await mutateGame((g) => ({
      ...g,
      xp: g.xp + bonus,
      bestSpeedRound: Math.max(g.bestSpeedRound, speedScore)
    }));
    endEncounter();
  }

  // Gamble
  let gambleEx: Exercise | null = null;
  function startGamble() {
    const card = pickCard();
    gambleEx = makeExercise(card, pool, $settings.meaningLangs, 'type-meaning');
    exNonce++;
  }
  async function onGambleAnswer(e: CustomEvent<{ correct: boolean }>) {
    const stake = xpForAnswer(Math.max(combo, 3)) * 2;
    if (e.detail.correct) {
      sessionXp += stake;
      await mutateGame((g) => ({ ...g, xp: g.xp + stake, gamblesWon: g.gamblesWon + 1 }));
    } else {
      sessionXp = Math.max(0, sessionXp - stake);
      combo = 0;
    }
    setTimeout(endEncounter, 1100);
  }

  // Sudden death
  function startSuddenDeath() {
    sdScore = 0;
    loadExercise();
  }
  async function onSuddenAnswer(e: CustomEvent<{ correct: boolean }>) {
    if (e.detail.correct) {
      sdScore += 1;
      const gain = 15;
      sessionXp += gain;
      await mutateGame((g) => ({ ...g, xp: g.xp + gain, totalCorrect: g.totalCorrect + 1 }));
      if (sdScore >= 8) {
        setTimeout(endEncounter, 600);
      } else {
        setTimeout(loadExercise, 500);
      }
    } else {
      await mutateGame((g) => ({ ...g, totalWrong: g.totalWrong + 1 }));
      combo = 0;
      setTimeout(endEncounter, 900);
    }
  }

  function endEncounter() {
    encounter = null;
    phase = 'play';
    nextCard();
  }

  function quit() {
    if (speedTimer) clearInterval(speedTimer);
    phase = 'done';
    dispatch('done', { xp: sessionXp });
  }
  onDestroy(() => speedTimer && clearInterval(speedTimer));

  $: isSudden = encounter?.kind === 'suddenDeath';
</script>

<div class="space-y-3">
  <!-- HUD -->
  <div class="flex items-center justify-between text-sm">
    <button class="rounded-lg bg-slate-800 px-3 py-1 text-slate-300" on:click={quit}>✕</button>
    <div class="flex items-center gap-3">
      <span class="rounded-full bg-pink-600/30 px-3 py-1 font-bold text-pink-300">🔥 {combo}</span>
      <span class="rounded-full bg-amber-500/20 px-3 py-1 font-bold text-amber-300">+{sessionXp} XP</span>
    </div>
  </div>

  {#if phase === 'loading'}
    <div class="py-20 text-center text-slate-400">{$t('loading')}</div>

  {:else if phase === 'play' && current}
    {#key exNonce}
      <div in:fly={{ y: 16, duration: 160 }}>
        <ExerciseView exercise={current} on:answer={onPlayAnswer} />
      </div>
    {/key}

  {:else if phase === 'encounter-intro' && encounter}
    <div in:scale={{ start: 0.6, duration: 400 }} class="grid place-items-center py-16 text-center">
      <div class="text-6xl">{ENCOUNTER_LABELS[encounter.kind].icon}</div>
      <div class="mt-3 animate-pulse text-2xl font-black tracking-wider text-rose-400">
        {ENCOUNTER_LABELS[encounter.kind][$settings.uiLang]}
      </div>
      {#if encounter.boss}
        <div class="mt-2 text-4xl">{encounter.boss.emoji}</div>
        <div class="text-lg font-semibold">{encounter.boss.name}</div>
      {/if}
    </div>

  {:else if phase === 'boss' && encounter?.boss && !isSudden && current}
    <div class="rounded-2xl bg-gradient-to-b from-rose-900/40 to-slate-900 p-4 text-center">
      <div class="text-5xl transition-transform {bossHit ? 'scale-125 -rotate-6' : ''}">{encounter.boss.emoji}</div>
      <div class="font-bold text-rose-300">{encounter.boss.name}</div>
      <div class="mx-auto mt-2 flex max-w-xs gap-1">
        {#each Array(bossMaxHp) as _, i}
          <div class="h-2 flex-1 rounded-full {i < bossHp ? 'bg-rose-500' : 'bg-slate-700'}"></div>
        {/each}
      </div>
    </div>
    {#key exNonce}
      <div in:fly={{ y: 12, duration: 140 }}>
        <ExerciseView exercise={current} compact on:answer={onBossAnswer} />
      </div>
    {/key}

  {:else if phase === 'boss' && isSudden && current}
    <div class="rounded-2xl bg-gradient-to-b from-purple-900/40 to-slate-900 p-3 text-center">
      <div class="text-2xl">💀 {$t('combo')}: {sdScore}</div>
      <div class="text-xs text-slate-400">{ENCOUNTER_LABELS.suddenDeath[$settings.uiLang]}</div>
    </div>
    {#key exNonce}
      <div in:fly={{ y: 12, duration: 140 }}>
        <ExerciseView exercise={current} compact on:answer={onSuddenAnswer} />
      </div>
    {/key}

  {:else if phase === 'speed' && current}
    <div class="rounded-2xl bg-gradient-to-b from-sky-900/40 to-slate-900 p-3 text-center">
      <div class="text-3xl font-black {speedLeft <= 5 ? 'text-rose-400' : 'text-sky-300'}">⏱️ {speedLeft}s</div>
      <div class="text-sm text-slate-300">{$t('combo')}: <b>{speedScore}</b></div>
    </div>
    {#key exNonce}
      <ExerciseView exercise={current} compact on:answer={onSpeedAnswer} />
    {/key}

  {:else if phase === 'gamble'}
    {#if !gambleEx}
      <div class="grid place-items-center py-12 text-center">
        <div class="text-6xl">🎴</div>
        <div class="mt-3 text-xl font-black text-amber-300">{ENCOUNTER_LABELS.gamble[$settings.uiLang]}</div>
        <p class="mt-2 max-w-xs text-sm text-slate-300">{$t('wager')}</p>
        <div class="mt-4 flex gap-3">
          <button class="rounded-xl bg-amber-500 px-6 py-3 font-bold text-slate-900" on:click={startGamble}>{$t('accept')}</button>
          <button class="rounded-xl bg-slate-700 px-6 py-3 font-semibold" on:click={endEncounter}>{$t('skip')}</button>
        </div>
      </div>
    {:else}
      {#key exNonce}
        <ExerciseView exercise={gambleEx} on:answer={onGambleAnswer} />
      {/key}
    {/if}
  {/if}
</div>
