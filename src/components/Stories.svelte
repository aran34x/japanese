<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { STORIES, type Story } from '../lib/data/stories';
  import { speakJa } from '../lib/speech';
  import { confetti } from '../lib/confetti';
  import { game, markStoryDone } from '../lib/game/state';
  import QuizQuestion from './QuizQuestion.svelte';
  import { fly, scale } from 'svelte/transition';

  type View = 'list' | 'read' | 'quiz' | 'done';
  let view: View = 'list';
  let story: Story | null = null;

  $: isDone = (id: string) => $game.storiesDone.includes(id);

  // Per-line reveal state for translations.
  let showTrans: Record<number, boolean> = {};

  let qIndex = 0;
  let correctCount = 0;

  function open(s: Story) {
    story = s;
    showTrans = {};
    view = 'read';
  }
  function startQuiz() {
    qIndex = 0;
    correctCount = 0;
    view = 'quiz';
  }

  // Called by QuizQuestion when a question is answered.
  async function onAnswer(correct: boolean) {
    if (correct) {
      correctCount++;
      confetti({ count: 50 });
    }
  }

  async function onNext() {
    if (!story) return;
    if (qIndex + 1 >= story.questions.length) {
      // Pass = at least half correct; mark done + reward stamp.
      if (correctCount >= Math.ceil(story.questions.length / 2)) {
        await markStoryDone(story.id, 60);
      }
      view = 'done';
    } else {
      qIndex++;
    }
  }

  $: passedCount = $game.storiesDone.length;
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-5xl px-4 py-8">
    {#if view === 'list'}
      <section in:fly={{ y: 12, duration: 180 }} class="space-y-3">
        <p class="text-sm text-slate-400">{$t('storiesIntro')}</p>

        <!-- Stamp album -->
        <div class="rounded-2xl bg-slate-800 p-4">
          <div class="mb-2 text-sm font-semibold">
            🏅 {$t('stampAlbum')}
            <span class="text-xs text-slate-400">{passedCount}/{STORIES.length}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each STORIES as s}
              <div
                class="grid h-10 w-10 place-items-center rounded-full text-xl {isDone(s.id)
                  ? 'bg-gradient-to-br from-amber-400 to-pink-500'
                  : 'bg-slate-900 text-slate-700'}"
                title={isDone(s.id) ? s.title[$settings.uiLang] : '???'}
              >{isDone(s.id) ? s.emoji : '?'}</div>
            {/each}
          </div>
        </div>

        {#each STORIES as s, i}
          <button
            class="flex w-full items-center gap-4 rounded-2xl bg-slate-800 p-4 text-left active:scale-[0.98]"
            on:click={() => open(s)}
          >
            <!-- Hide the emoji until the story is completed. -->
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-900 text-2xl">
              {isDone(s.id) ? s.emoji : '📕'}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block font-jp text-base font-semibold">{s.titleJp}</span>
              <span class="block text-xs text-slate-400">
                {s.level} · {s.lines.length} {$t('lines')} · {s.questions.length} Q
                {#if isDone(s.id)}· ✓{/if}
              </span>
            </span>
            <span class="text-slate-500">›</span>
          </button>
        {/each}
      </section>

    {:else if view === 'read' && story}
      <section in:fly={{ y: 12, duration: 180 }} class="space-y-4">
        <button class="text-sm text-slate-400" on:click={() => (view = 'list')}>← {$t('back')}</button>
        <div class="text-center">
          <div class="text-5xl">{isDone(story.id) ? story.emoji : '📕'}</div>
          <div class="mt-2 flex items-center justify-center gap-2">
            <h2 class="font-jp text-2xl font-bold">{story.titleJp}</h2>
            <button
              class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs active:scale-95"
              on:click={() => story && speakJa(story.titleJp)}
              title="🔊">🔊</button>
          </div>
          <div class="text-sm text-slate-400">{isDone(story.id) ? story.title[$settings.uiLang] + ' · ' : ''}{story.level}</div>
        </div>
        <div class="space-y-3">
          {#each story.lines as line, i}
            <div class="rounded-xl bg-slate-800 p-4">
              <div class="flex items-start gap-2">
                <div class="flex-1 font-jp text-lg">{line.jp}</div>
                <button class="shrink-0 rounded-lg bg-slate-700 px-2 py-1 text-sm" title="🔊" on:click={() => speakJa(line.reading)}>🔊</button>
              </div>
              <div class="mt-1 text-xs text-pink-300">{line.reading}</div>

              {#if showTrans[i]}
                <div class="mt-2 text-sm text-slate-300" in:fly={{ y: 4, duration: 120 }}>
                  {$settings.uiLang === 'it' ? line.it : line.en}
                </div>
              {:else}
                <button
                  class="mt-2 text-xs text-slate-500 underline"
                  on:click={() => (showTrans = { ...showTrans, [i]: true })}
                >{$t('showTranslation')}</button>
              {/if}
            </div>
          {/each}
        </div>
        <button
          class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98]"
          on:click={startQuiz}
        >📝 {$t('answerQuestions')}</button>
      </section>

    {:else if view === 'quiz' && story}
      {@const q = story.questions[qIndex]}
      <section class="space-y-4">
        <div class="flex items-center justify-between text-sm">
          <button class="text-slate-400" on:click={() => (view = 'read')}>← {$t('back')}</button>
          <span class="text-slate-400">{qIndex + 1} / {story.questions.length}</span>
        </div>
        {#key qIndex}
          <div in:fly={{ y: 14, duration: 160 }}>
            <QuizQuestion
              prompt={q.q[$settings.uiLang]}
              options={q.type === 'mcq' ? q.options.map((o) => ({ label: o[$settings.uiLang], correct: o.correct })) : null}
              answers={q.type === 'type' ? q.answers : []}
              hint={q.type === 'type' && q.hint ? q.hint[$settings.uiLang] : ''}
              lesson={q.lesson}
              on:answer={(e) => onAnswer(e.detail.correct)}
              on:next={onNext}
              let:answered
              let:correct
            >
              {#if answered && q.type === 'type'}
                <div class="mt-2 rounded-xl p-3 text-center text-sm {correct ? 'bg-green-900/40 text-green-300' : 'bg-rose-900/40 text-rose-300'}">
                  {correct ? '✓' : '✗'} {q.answers[0]}
                </div>
              {/if}
            </QuizQuestion>
          </div>
        {/key}
      </section>

    {:else if view === 'done' && story}
      {@const passed = correctCount >= Math.ceil(story.questions.length / 2)}
      <section class="grid place-items-center py-12 text-center" in:scale={{ start: 0.8, duration: 300 }}>
        {#if passed}
          <div class="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-pink-500 text-5xl shadow-lg">
            {story.emoji}
          </div>
          <div class="mt-3 text-sm font-bold text-amber-300">
            🏅 {$t('stampEarned')}
          </div>
        {:else}
          <div class="text-6xl">📖</div>
        {/if}
        <h2 class="mt-2 text-xl font-bold">
          {correctCount}/{story.questions.length} {$t('correctCount')}
        </h2>
        {#if !passed}
          <p class="mt-1 text-sm text-slate-400">
            {$t('tryAgainStamp')}
          </p>
        {/if}
        <div class="mt-5 flex gap-3">
          <button class="rounded-xl bg-indigo-500 px-5 py-3 font-semibold" on:click={() => { if (story) open(story); }}>
            {$t('readAgain')}
          </button>
          <button class="rounded-xl bg-slate-700 px-5 py-3 font-semibold" on:click={() => (view = 'list')}>
            {$t('moreStories')}
          </button>
        </div>
      </section>
    {/if}
  </div>
</div>
