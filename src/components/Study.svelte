<script lang="ts">
  import { onMount } from 'svelte';
  import { t, settings } from '../lib/stores';
  import { db } from '../lib/db';
  import { buildQueue, type QueueItem } from '../lib/session';
  import { makeExercise } from '../lib/exercises/generator';
  import { schedule, previewInterval } from '../lib/srs';
  import type { Deck, Exercise, ExerciseKind, Grade } from '../lib/types';
  import Flashcard from './Flashcard.svelte';
  import QuizQuestion from './QuizQuestion.svelte';
  import { fly, fade } from 'svelte/transition';
  import { confetti } from '../lib/confetti';
  import { markSaving, markSaved } from '../lib/saveStatus';

  type Phase = 'menu' | 'config' | 'running' | 'done';
  type Mode = 'mixed' | 'flashcard' | 'quiz' | 'typing';

  let phase: Phase = 'menu';
  let decks: Deck[] = [];
  let selected = new Set<string>();
  let mode: Mode = 'mixed';

  $: modeOptions = [
    { id: 'mixed' as Mode, label: '🎲 Mixed' },
    { id: 'flashcard' as Mode, label: '🃏 ' + $t('flashcards') },
    { id: 'quiz' as Mode, label: '✅ ' + $t('quiz') },
    { id: 'typing' as Mode, label: '⌨️ ' + $t('typing') }
  ];

  let queue: QueueItem[] = [];
  let pool: Exercise['card'][] = [];
  let index = 0;
  let current: Exercise | null = null;
  let sessionStats = { reviewed: 0, correct: 0 };

  onMount(async () => {
    decks = await db.decks.toArray();
    selected = new Set(decks.map((d) => d.id));
  });

  function deckName(d: Deck) {
    return d.name[$settings.uiLang] ?? d.name.en ?? d.id;
  }

  function toggle(id: string) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    selected = new Set(selected);
  }

  $: allSelected = decks.length > 0 && selected.size === decks.length;
  function toggleAll() {
    selected = allSelected ? new Set() : new Set(decks.map((d) => d.id));
  }

  // Short explanation per deck category, shown under each deck name.
  function deckBlurb(d: Deck): string {
    const en: Record<string, string> = {
      hiragana: 'Basic phonetic script for native Japanese words',
      katakana: 'Phonetic script for foreign/loan words',
      kanji: 'Chinese characters — meaning + reading',
      vocab: 'Common words and their meanings',
      reading: 'Short sentences to read and understand',
      custom: 'Your imported cards'
    };
    const it: Record<string, string> = {
      hiragana: 'Scrittura fonetica di base per parole giapponesi',
      katakana: 'Scrittura fonetica per parole straniere',
      kanji: 'Caratteri cinesi — significato + lettura',
      vocab: 'Parole comuni e i loro significati',
      reading: 'Brevi frasi da leggere e capire',
      custom: 'Le tue carte importate'
    };
    const map = $settings.uiLang === 'it' ? it : en;
    return d.description?.[$settings.uiLang] ?? map[d.category] ?? '';
  }

  function kindForMode(card: Exercise['card']): ExerciseKind | 'auto' {
    if (mode === 'flashcard') return 'flashcard';
    if (mode === 'mixed') return 'auto';
    if (mode === 'quiz') {
      if (card.category === 'hiragana' || card.category === 'katakana') return 'mcq-jp-to-reading';
      return Math.random() < 0.5 ? 'mcq-jp-to-meaning' : 'mcq-meaning-to-jp';
    }
    // typing
    if (card.category === 'hiragana' || card.category === 'katakana') return 'type-reading';
    return 'type-meaning';
  }

  // Quick modes start immediately across all decks — no checkbox gate.
  function quickStart(m: Mode) {
    mode = m;
    selected = new Set(decks.map((d) => d.id));
    start();
  }

  async function start() {
    const ids = [...selected];
    queue = await buildQueue(ids, $settings.newPerDay);
    pool = ids.length
      ? await db.cards.where('deckId').anyOf(ids).toArray()
      : await db.cards.toArray();
    index = 0;
    sessionStats = { reviewed: 0, correct: 0 };
    if (queue.length === 0) {
      phase = 'done';
      return;
    }
    phase = 'running';
    loadCurrent();
  }

  function loadCurrent() {
    const item = queue[index];
    current = makeExercise(item.card, pool, $settings.meaningLangs, kindForMode(item.card));
  }

  async function grade(g: Grade) {
    const item = queue[index];
    const updated = schedule(item.state, g);
    markSaving();
    await db.reviews.put(updated);
    markSaved();
    void import('../lib/sync').then((m) => m.autoPush());
    sessionStats.reviewed += 1;
    if (g !== 'again') sessionStats.correct += 1;
    next();
  }

  function next() {
    if (index + 1 >= queue.length) {
      phase = 'done';
      current = null;
      return;
    }
    index += 1;
    loadCurrent();
  }

  // QuizQuestion reports the result. Correct → confetti + auto-advance; wrong →
  // wait for the user to tap Next (continueAfterAnswer).
  let lastCorrect = false;
  function onAnswer(correct: boolean) {
    lastCorrect = correct;
    if (correct) {
      confetti();
      setTimeout(() => continueAfterAnswer(), 750);
    }
  }

  // Map correctness to an SRS grade and continue.
  async function continueAfterAnswer() {
    await grade(lastCorrect ? 'good' : 'again');
  }

  $: progress = queue.length ? Math.round((index / queue.length) * 100) : 0;
</script>

{#if phase === 'menu'}
  <section class="space-y-4">
    <h2 class="text-lg font-semibold">{$t('study')}</h2>
    <div class="grid grid-cols-2 gap-3">
      {#each modeOptions as opt}
        <button
          class="rounded-2xl bg-slate-800 p-5 text-left active:scale-[0.98]"
          on:click={() => quickStart(opt.id)}
        >
          <div class="text-3xl">{opt.label.split(' ')[0]}</div>
          <div class="mt-2 font-medium">{opt.label.slice(opt.label.indexOf(' ') + 1)}</div>
          <div class="text-xs text-slate-400">{$t('allDecks')}</div>
        </button>
      {/each}
    </div>
    <button
      class="w-full rounded-2xl border border-dashed border-slate-600 p-4 text-left active:scale-[0.98]"
      on:click={() => (phase = 'config')}
    >
      <div class="font-medium">⚙️ Custom</div>
      <div class="text-xs text-slate-400">{$t('chooseDeck')}</div>
    </button>
  </section>
{:else if phase === 'config'}
  <section class="space-y-5">
    <button class="text-sm text-slate-400" on:click={() => (phase = 'menu')}>← {$t('back')}</button>
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">{$t('chooseDeck')}</h2>
      <button class="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-pink-300" on:click={toggleAll}>
        {allSelected
          ? ($settings.uiLang === 'it' ? 'Deseleziona tutto' : 'Unselect all')
          : ($settings.uiLang === 'it' ? 'Seleziona tutto' : 'Select all')}
      </button>
    </div>
    <div class="space-y-2">
      {#each decks as d}
        <label class="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
          <input type="checkbox" checked={selected.has(d.id)} on:change={() => toggle(d.id)}
            class="h-5 w-5 shrink-0 accent-pink-500" />
          <span class="flex-1">
            <span class="block font-medium">{deckName(d)}</span>
            <span class="block text-xs text-slate-400">{deckBlurb(d)}</span>
          </span>
        </label>
      {/each}
    </div>

    <div>
      <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{$t('modes')}</h3>
      <div class="grid grid-cols-2 gap-2">
        {#each modeOptions as opt}
          <button
            class="rounded-xl px-3 py-3 text-sm font-medium {mode === opt.id ? 'bg-pink-500 text-white' : 'bg-slate-800'}"
            on:click={() => (mode = opt.id)}>{opt.label}</button>
        {/each}
      </div>
    </div>

    <button class="w-full rounded-xl bg-indigo-500 py-3 font-semibold active:scale-[0.98]" on:click={start}>
      ▶ {$t('startReview')}
    </button>
  </section>
{:else if phase === 'running' && current}
  <section class="space-y-4">
    <div class="h-2 overflow-hidden rounded-full bg-slate-800">
      <div class="h-full bg-gradient-to-r from-pink-400 to-indigo-400 transition-all" style="width:{progress}%"></div>
    </div>
    <div class="text-center text-xs text-slate-500">{index + 1} / {queue.length}</div>

    {#key index}
      <div in:fly={{ y: 16, duration: 180 }}>
        {#if current.kind === 'flashcard'}
          <Flashcard exercise={current} on:grade={(e) => grade(e.detail)} />
        {:else}
          <QuizQuestion
            prompt={current.prompt}
            instruction={$t(current.instructionKey || 'meaning')}
            options={current.options ? current.options.map((o) => ({ label: o.text, correct: o.correct })) : null}
            answers={current.answers ?? []}
            speakText={current.card.reading || current.card.front}
            on:answer={(e) => onAnswer(e.detail.correct)}
            let:answered
            let:correct
          >
            {#if answered}
              <div class="mt-4 rounded-xl p-4 text-center {correct ? 'bg-green-900/40' : 'bg-rose-900/40'}">
                <div class="font-semibold {correct ? 'text-green-400' : 'text-rose-400'}">
                  {correct ? '✓ ' + $t('correct') : '✗ ' + $t('incorrect')}
                </div>
                <div class="mt-1 text-sm text-slate-300">
                  {current.card.front} — {current.card.reading ?? ''}
                  {#if current.card.meaning[$settings.uiLang]}· {current.card.meaning[$settings.uiLang]}{/if}
                </div>
                {#if !correct}
                  <button class="mt-3 w-full rounded-xl bg-slate-700 py-2 font-medium" on:click={continueAfterAnswer}>
                    {$t('next')} →
                  </button>
                {/if}
              </div>
            {/if}
          </QuizQuestion>
        {/if}
      </div>
    {/key}
  </section>
{:else}
  <section class="grid place-items-center py-16 text-center">
    <div class="text-6xl">🎉</div>
    {#if sessionStats.reviewed > 0}
      <h2 class="mt-4 text-xl font-semibold">{$t('reviewDone')}</h2>
      <p class="mt-2 text-slate-400">
        {sessionStats.correct}/{sessionStats.reviewed} · {$t('accuracy')}
        {Math.round((sessionStats.correct / sessionStats.reviewed) * 100)}%
      </p>
    {:else}
      <p class="mt-4 text-slate-400">{$t('noDue')}</p>
    {/if}
    <button class="mt-6 rounded-xl bg-indigo-500 px-6 py-3 font-semibold" on:click={() => (phase = 'menu')}>
      {$t('back')}
    </button>
  </section>
{/if}
