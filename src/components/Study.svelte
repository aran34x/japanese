<script lang="ts">
  import { onMount } from 'svelte';
  import { t, settings } from '../lib/stores';
  import { db, resetReviews } from '../lib/db';
  import { buildQueue, deckCounts, type QueueItem } from '../lib/session';
  import { makeExercise } from '../lib/exercises/generator';
  import { schedule } from '../lib/srs';
  import type { Deck, Exercise, ExerciseKind, Grade } from '../lib/types';
  import Flashcard from './Flashcard.svelte';
  import QuizQuestion from './QuizQuestion.svelte';
  import { fly, slide } from 'svelte/transition';
  import { confetti } from '../lib/confetti';
  import { markSaving, markSaved } from '../lib/saveStatus';
  import { addStudyTime, mutateGame, xpForAnswer } from '../lib/game/state';
  import { speakJa } from '../lib/speech';

  type Phase = 'menu' | 'config' | 'running' | 'done';
  type Mode = 'mixed' | 'flashcard' | 'quiz' | 'typing';

  let phase: Phase = 'menu';
  let mode: Mode = 'flashcard';
  let isCustom = false; // Custom config shows the mode picker + multi-select
  let mixOpen = false;  // "Mix sets" section toggle (single-mode config)

  type DeckRow = Deck & { count: number };
  let decks: DeckRow[] = [];
  let selected = new Set<string>();

  $: modeOptions = [
    { id: 'mixed' as Mode, label: '🎲 ' + $t('mixed') },
    { id: 'flashcard' as Mode, label: '🃏 ' + $t('flashcards') },
    { id: 'quiz' as Mode, label: '✅ ' + $t('quiz') },
    { id: 'typing' as Mode, label: '⌨ ' + $t('typing') },
  ];
  // Tiles shown on the Study menu (no "mixed" — that lives inside Custom).
  $: menuModes = modeOptions.filter((m) => m.id !== 'mixed');
  $: modeLabel = modeOptions.find((m) => m.id === mode)?.label ?? '';

  // Group sets by category for display.
  const CATEGORY_ORDER = ['hiragana', 'katakana', 'kanji', 'vocab', 'reading', 'custom'] as const;
  const CAT_LABELS: Record<string, { en: string; it: string; icon: string }> = {
    hiragana: { en: 'Hiragana', it: 'Hiragana', icon: 'あ' },
    katakana: { en: 'Katakana', it: 'Katakana', icon: 'ア' },
    kanji: { en: 'Kanji', it: 'Kanji', icon: '漢' },
    vocab: { en: 'Vocabulary', it: 'Vocaboli', icon: '語' },
    reading: { en: 'Reading & Grammar', it: 'Lettura e grammatica', icon: '読' },
    custom: { en: 'Imported sets', it: 'Set importati', icon: '⭐' }
  };
  $: groups = CATEGORY_ORDER
    .map((cat) => ({ cat, items: decks.filter((d) => d.category === cat) }))
    .filter((g) => g.items.length > 0);

  let queue: QueueItem[] = [];
  let pool: Exercise['card'][] = [];
  let index = 0;
  let current: Exercise | null = null;
  let sessionStats = { reviewed: 0, correct: 0, xp: 0 };
  let combo = 0; // consecutive correct answers, drives the XP combo bonus

  // Daily-review summary (all decks) for the Flashcards dashboard.
  let counts = { due: 0, new: 0, learning: 0, total: 0 };
  $: dueNow = counts.due + counts.learning;
  $: newToday = Math.min(counts.new, $settings.newPerDay ?? 0);

  async function loadDecks() {
    const ds = await db.decks.toArray();
    decks = await Promise.all(
      ds.map(async (d) => ({ ...d, count: await db.cards.where('deckId').equals(d.id).count() }))
    );
    counts = await deckCounts([]);
  }
  onMount(async () => {
    await loadDecks();
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

  // ── Per-deck management (reset / delete) — two-tap confirm ──────────
  let confirmReset: string | null = null;
  let confirmDelete: string | null = null;
  let justReset = new Set<string>();
  let confirmTimer: ReturnType<typeof setTimeout>;

  function armConfirm(setFn: (id: string | null) => void, id: string) {
    clearTimeout(confirmTimer);
    setFn(id);
    confirmTimer = setTimeout(() => { confirmReset = null; confirmDelete = null; }, 3000);
  }

  async function onReset(d: DeckRow) {
    if (confirmReset !== d.id) { confirmDelete = null; armConfirm((v) => (confirmReset = v), d.id); return; }
    clearTimeout(confirmTimer);
    confirmReset = null;
    const ids = await db.cards.where('deckId').equals(d.id).primaryKeys();
    await resetReviews(ids as string[]);
    void import('../lib/sync').then((m) => m.autoPush());
    justReset = new Set(justReset).add(d.id);
    setTimeout(() => { justReset.delete(d.id); justReset = new Set(justReset); }, 1500);
  }

  async function onDelete(d: DeckRow) {
    if (d.builtin) return;
    if (confirmDelete !== d.id) { confirmReset = null; armConfirm((v) => (confirmDelete = v), d.id); return; }
    clearTimeout(confirmTimer);
    confirmDelete = null;
    await db.cards.where('deckId').equals(d.id).delete();
    await db.decks.delete(d.id);
    selected.delete(d.id); selected = new Set(selected);
    await loadDecks();
    void import('../lib/sync').then((m) => m.autoPush());
  }

  // ── Navigation ─────────────────────────────────────────────────────
  function pickMode(m: Mode) {
    mode = m;
    isCustom = false;
    mixOpen = false;
    phase = 'config';
  }
  function pickCustom() {
    isCustom = true;
    mixOpen = false;
    if (mode === 'flashcard') mode = 'mixed'; // sensible default for Custom
    phase = 'config';
  }

  function kindForMode(card: Exercise['card']): ExerciseKind | 'auto' {
    if (mode === 'flashcard') return 'flashcard';
    if (mode === 'mixed') return 'auto';
    if (mode === 'quiz') {
      if (card.category === 'hiragana' || card.category === 'katakana') return 'mcq-jp-to-reading';
      return Math.random() < 0.5 ? 'mcq-jp-to-meaning' : 'mcq-meaning-to-jp';
    }
    if (card.category === 'hiragana' || card.category === 'katakana') return 'type-reading';
    return 'type-meaning';
  }

  async function start(ids: string[] = [...selected]) {
    queue = await buildQueue(ids, $settings.newPerDay);
    pool = ids.length
      ? await db.cards.where('deckId').anyOf(ids).toArray()
      : await db.cards.toArray();
    index = 0;
    combo = 0;
    sessionStats = { reviewed: 0, correct: 0, xp: 0 };
    if (queue.length === 0) { phase = 'done'; return; }
    phase = 'running';
    loadCurrent();
  }
  /** Start a session with exactly one set. */
  const startSingle = (id: string) => start([id]);

  // Teach before testing: a card the learner has NEVER seen is shown first as an
  // intro (character + reading + meaning + audio), and only quizzed after they
  // dismiss it. Asking a question about something never taught forces a blind
  // guess. (Flashcard mode already shows the card, so it's exempt.)
  let showIntro = false;
  const introduced = new Set<string>();
  function introMeaning(c: Exercise['card']): string {
    const parts = $settings.meaningLangs.map((l) => c.meaning[l]).filter(Boolean) as string[];
    return [...new Set(parts)].join(' · ');
  }
  function dismissIntro() {
    introduced.add(queue[index].card.id);
    showIntro = false;
  }

  let cardShownAt = 0;
  function loadCurrent() {
    const item = queue[index];
    current = makeExercise(item.card, pool, $settings.meaningLangs, kindForMode(item.card));
    showIntro =
      mode !== 'flashcard' &&
      item.state.phase === 'new' &&
      item.state.totalReviews === 0 &&
      !introduced.has(item.card.id);
    if (showIntro && $settings.autoAudio) speakJa(item.card.reading || item.card.front);
    cardShownAt = Date.now();
  }

  async function grade(g: Grade) {
    // Track active study time (capped per card so idle/AFK doesn't inflate it).
    if (cardShownAt) addStudyTime(Math.min((Date.now() - cardShownAt) / 1000, 120));
    const item = queue[index];
    const updated = schedule(item.state, g);
    markSaving();
    await db.reviews.put(updated);
    markSaved();
    void import('../lib/sync').then((m) => m.autoPush());
    sessionStats.reviewed += 1;
    // Every correct answer earns XP toward leveling (combo bonus for streaks).
    if (g !== 'again') {
      combo += 1;
      const gain = xpForAnswer(combo, g === 'hard');
      sessionStats.correct += 1;
      sessionStats.xp += gain;
      void mutateGame((s) => ({
        ...s,
        xp: s.xp + gain,
        totalCorrect: (s.totalCorrect ?? 0) + 1,
        bestStreak: Math.max(s.bestStreak ?? 0, combo)
      }));
    } else {
      combo = 0;
      void mutateGame((s) => ({ ...s, totalWrong: (s.totalWrong ?? 0) + 1 }));
    }
    next();
  }

  function next() {
    if (index + 1 >= queue.length) { phase = 'done'; current = null; return; }
    index += 1;
    loadCurrent();
  }

  let lastCorrect = false;
  function onAnswer(correct: boolean) {
    lastCorrect = correct;
    if (correct) { confetti(); setTimeout(() => continueAfterAnswer(), 750); }
  }
  async function continueAfterAnswer() {
    await grade(lastCorrect ? 'good' : 'again');
  }

  $: progress = queue.length ? Math.round((index / queue.length) * 100) : 0;
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto flex min-h-full max-w-5xl flex-col px-4 py-8 {phase === 'menu' || phase === 'done' ? 'justify-center' : ''}">
    {#if phase === 'menu'}
      <section class="space-y-4">
        <h2 class="text-lg font-semibold">{$t('study')}</h2>
        <div class="grid grid-cols-2 gap-3">
          {#each menuModes as opt}
            <button class="rounded-2xl bg-slate-800 p-5 text-left active:scale-[0.98]" on:click={() => pickMode(opt.id)}>
              <div class="text-3xl">{opt.label.split(' ')[0]}</div>
              <div class="mt-2 font-medium">{opt.label.slice(opt.label.indexOf(' ') + 1)}</div>
              <div class="text-xs text-slate-400">{$t('chooseDeck')}</div>
            </button>
          {/each}
        </div>
        <button
          class="w-full rounded-2xl border border-dashed border-slate-600 p-4 text-left active:scale-[0.98]"
          on:click={pickCustom}
        >
          <div class="font-medium">⚙ Custom</div>
          <div class="text-xs text-slate-400">{$t('mixAndMatch')}</div>
        </button>
      </section>

    {:else if phase === 'config'}
      <section class="space-y-5">
        <button class="text-sm text-slate-400" on:click={() => (phase = 'menu')}>← {$t('back')}</button>

        {#if !isCustom}
          <!-- ── Single-mode: pick ONE set (tap to start) ─────────────── -->
          <h2 class="text-lg font-semibold">{modeLabel}</h2>

          {#if mode === 'flashcard'}
            <!-- Daily-review dashboard: review everything due across all decks -->
            <div class="overflow-hidden rounded-2xl bg-indigo-600 shadow-lg">
              <div class="p-6">
                <div class="mb-4 text-xs font-semibold uppercase tracking-wide text-current opacity-70">
                  {$t('todaysReview')}
                </div>
                <div class="flex items-end gap-3">
                  <div class="text-6xl font-black leading-none">{dueNow}</div>
                  <div class="pb-1 text-sm text-current opacity-90">
                    {dueNow > 0 ? $t('dueReadyNow') : $t('allCaughtUp')}
                  </div>
                </div>
                <button
                  class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 font-semibold text-indigo-700 shadow-sm transition active:scale-[0.98] hover:bg-indigo-50"
                  on:click={() => start([])}
                >
                  <span>▶</span>
                  <span>{$t('startReview')}</span>
                  {#if newToday > 0}
                    <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-600">
                      +{newToday} {$t('plusNewToday')}
                    </span>
                  {/if}
                </button>
              </div>
              <div class="flex divide-x divide-white/15 border-t border-white/15 bg-black/10 text-center text-xs">
                <div class="flex-1 py-2.5">
                  <span class="font-bold text-current">{counts.new.toLocaleString()}</span>
                  <span class="ml-1 text-current opacity-70">{$t('newWaiting')}</span>
                </div>
                <div class="flex-1 py-2.5">
                  <span class="font-bold text-current">{counts.total.toLocaleString()}</span>
                  <span class="ml-1 text-current opacity-70">{$t('inCollection')}</span>
                </div>
              </div>
            </div>
          {/if}

          <p class="text-xs text-slate-400">{$t('chooseSet')}</p>

          <div class="space-y-5">
            {#each groups as g (g.cat)}
              <div>
                <h3 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <span class="font-jp text-sm text-slate-300">{CAT_LABELS[g.cat].icon}</span>
                  {CAT_LABELS[g.cat][$settings.uiLang]}
                </h3>
                <div class="space-y-2">
                  {#each g.items as d (d.id)}
                    <div class="flex items-center gap-2 rounded-xl bg-slate-800 px-3 py-2.5">
                      <button class="flex min-w-0 flex-1 items-center gap-2 text-left active:scale-[0.99]" on:click={() => startSingle(d.id)}>
                        <span class="min-w-0 flex-1">
                          <span class="block truncate font-medium">{deckName(d)}</span>
                          <span class="block text-xs text-slate-400">{d.count} {$t('cards')}</span>
                        </span>
                        <span class="text-highlight">▶</span>
                      </button>
                      <!-- Reset progress -->
                      <button
                        class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium {confirmReset === d.id ? 'bg-amber-600 text-white' : justReset.has(d.id) ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300'}"
                        title={$t('resetDeck')}
                        on:click={() => onReset(d)}
                      >
                        {justReset.has(d.id) ? $t('resetDone') : confirmReset === d.id ? $t('resetSure') : '↺'}
                      </button>
                      {#if !d.builtin}
                        <button
                          class="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium {confirmDelete === d.id ? 'bg-rose-600 text-white' : 'bg-slate-700 text-rose-300'}"
                          on:click={() => onDelete(d)}
                        >
                          {confirmDelete === d.id ? $t('deleteSure') : '🗑'}
                        </button>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>

          <!-- ── Optional: mix multiple sets ──────────────────────────── -->
          <div>
            <button
              class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-600 py-2.5 text-sm text-slate-300 active:scale-[0.99]"
              on:click={() => (mixOpen = !mixOpen)}
            >
              <span>🔀 {$t('mixSets')}</span>
              <span class="text-xs text-slate-500">{mixOpen ? '▲' : '▼'}</span>
            </button>

            {#if mixOpen}
              <div class="mt-2 space-y-2" transition:slide={{ duration: 200 }}>
                <div class="flex justify-end">
                  <button class="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-highlight" on:click={toggleAll}>
                    {allSelected ? $t('unselectAll') : $t('selectAll')}
                  </button>
                </div>
                {#each decks as d (d.id)}
                  <label class="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2.5">
                    <input type="checkbox" checked={selected.has(d.id)} on:change={() => toggle(d.id)}
                      class="h-5 w-5 shrink-0 accent-pink-500" />
                    <span class="min-w-0 flex-1">
                      <span class="block truncate font-medium">{deckName(d)}</span>
                      <span class="block text-xs text-slate-400">{d.count} {$t('cards')}</span>
                    </span>
                  </label>
                {/each}
                <button
                  class="w-full rounded-xl bg-indigo-500 py-3 font-semibold active:scale-[0.98] disabled:opacity-40"
                  disabled={selected.size === 0}
                  on:click={() => start()}
                >
                  ▶ {$t('startReview')} · {selected.size}
                </button>
              </div>
            {/if}
          </div>

        {:else}
          <!-- ── Custom: pick decks + mode ────────────────────────────── -->
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">⚙ Custom</h2>
            <button class="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-highlight" on:click={toggleAll}>
              {allSelected ? $t('unselectAll') : $t('selectAll')}
            </button>
          </div>

          <div class="space-y-2">
            {#each decks as d (d.id)}
              <label class="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2.5">
                <input type="checkbox" checked={selected.has(d.id)} on:change={() => toggle(d.id)}
                  class="h-5 w-5 shrink-0 accent-pink-500" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate font-medium">{deckName(d)}</span>
                  <span class="block text-xs text-slate-400">{d.count} {$t('cards')}</span>
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

          <button
            class="w-full rounded-xl bg-indigo-500 py-3 font-semibold active:scale-[0.98] disabled:opacity-40"
            disabled={selected.size === 0}
            on:click={() => start()}
          >
            ▶ {$t('startReview')}
          </button>
        {/if}
      </section>

    {:else if phase === 'running' && current}
      <section class="space-y-4">
        <div class="flex items-center gap-3">
          <button class="text-xs text-slate-500 hover:text-slate-300 active:scale-95" on:click={() => (phase = 'menu')}>
            ← {$t('back')}
          </button>
          <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div class="h-full bg-pink-500 transition-all" style="width:{progress}%"></div>
          </div>
          {#if combo >= 2}
            <span class="rounded-full bg-pink-600/30 px-2 py-0.5 text-xs font-bold text-highlight">🔥 {combo}</span>
          {/if}
          <div class="text-xs text-slate-500">{index + 1} / {queue.length}</div>
        </div>

        {#key index}
          <div in:fly={{ y: 16, duration: 180 }}>
            {#if showIntro}
              <!-- Teach phase: first encounter with this card -->
              <div class="rounded-2xl border border-amber-400/30 bg-slate-800 p-6 text-center">
                <div class="mb-2 inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-amber-300">
                  ✨ {$t('newCardBadge')}
                </div>
                <button
                  class="mx-auto block py-4 font-jp text-6xl"
                  on:click={() => speakJa(current?.card.reading || current?.card.front || '')}
                  title="🔊"
                >{current.card.front}</button>
                {#if current.card.reading && current.card.reading !== current.card.front}
                  <div class="text-xl text-highlight">{current.card.reading}</div>
                {/if}
                {#if current.card.romaji && $settings.showRomaji}
                  <div class="text-sm text-slate-400">{current.card.romaji}</div>
                {/if}
                <div class="mt-2 text-lg">{introMeaning(current.card)}</div>
                <p class="mt-3 text-xs text-slate-500">{$t('memorizeHint')}</p>
              </div>
              <button
                class="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 py-3 font-bold active:scale-[0.98]"
                on:click={dismissIntro}
              >{$t('continueBtn')}</button>
            {:else if current.kind === 'flashcard'}
              <Flashcard exercise={current} state={queue[index]?.state ?? null} on:grade={(e) => grade(e.detail)} />
            {:else}
              <QuizQuestion
                prompt={current.prompt}
                instruction={$t(current.instructionKey || 'meaning')}
                options={current.options ? current.options.map((o) => ({ label: o.text, correct: o.correct })) : null}
                answers={current.answers ?? []}
                promptSpeak={current.promptSpeak ?? ''}
                promptAudioUrl={current.promptAudioUrl ?? ''}
                answerAudio={current.answerAudio ?? false}
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
          {#if sessionStats.xp > 0}
            <div class="mt-4 rounded-2xl bg-amber-500/15 px-8 py-3">
              <div class="text-3xl font-black text-amber-300">+{sessionStats.xp}</div>
              <div class="text-xs uppercase tracking-wide text-amber-200">{$t('xpEarned')}</div>
            </div>
          {/if}
        {:else}
          <p class="mt-4 text-slate-400">{$t('noDue')}</p>
        {/if}
        <button class="mt-6 rounded-xl bg-indigo-500 px-6 py-3 font-semibold" on:click={() => (phase = 'menu')}>
          {$t('back')}
        </button>
      </section>
    {/if}
  </div>
</div>
