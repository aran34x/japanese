<script lang="ts" context="module">
  export interface QuizOption {
    label: string;
    correct: boolean;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '../lib/stores';
  import { speakJa } from '../lib/speech';

  // A single, shared quiz-question UI used by Study, Adventure (ExerciseView)
  // and Stories. Handles the prompt, multiple-choice OR typing input, answer
  // detection and post-answer highlighting; emits `answer` { correct }. Each
  // caller supplies already-localized option labels and renders its own
  // post-answer feedback via the default slot (gets { answered, correct }).

  /** Prompt text shown large (usually Japanese). */
  export let prompt: string;
  /** Small instruction label above the prompt (already translated). */
  export let instruction = '';
  /** Multiple-choice options. Omit for a typing question. */
  export let options: QuizOption[] | null = null;
  /** Accepted answers for a typing question (matched after normalize()). */
  export let answers: string[] = [];
  /** Optional text to speak when the prompt is tapped (no button if empty). */
  export let speakText = '';
  /** Optional hint shown under a typing input before answering. */
  export let hint = '';
  export let compact = false;

  const dispatch = createEventDispatcher<{ answer: { correct: boolean } }>();

  let answered = false;
  let correct = false;
  let picked: number | null = null;
  let typed = '';

  export function normalize(s: string): string {
    return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[。、．.!?]/g, '');
  }

  function finish(isCorrect: boolean) {
    if (answered) return;
    answered = true;
    correct = isCorrect;
    dispatch('answer', { correct: isCorrect });
  }

  function pickOption(i: number) {
    if (answered || !options) return;
    picked = i;
    finish(options[i].correct);
  }

  function checkTyped() {
    if (answered) return;
    const ans = normalize(typed);
    finish(answers.some((a) => normalize(a) === ans));
  }
</script>

<div class="rounded-2xl bg-slate-800 p-5 text-center">
  {#if instruction}
    <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">{instruction}</div>
  {/if}
  {#if speakText}
    <button
      class="mx-auto block font-jp {compact ? 'py-3 text-4xl' : 'py-5 text-5xl'}"
      on:click={() => speakJa(speakText)}
      title="🔊">{prompt}</button>
  {:else}
    <div class="font-jp {compact ? 'py-3 text-4xl' : 'py-5 text-5xl'}">{prompt}</div>
  {/if}
</div>

{#if options}
  <div class="mt-3 grid gap-2">
    {#each options as opt, i}
      <button
        disabled={answered}
        class="rounded-xl px-4 py-3 text-left text-lg transition-colors
          {answered && opt.correct ? 'bg-green-600 text-white' : ''}
          {answered && !opt.correct && picked === i ? 'bg-rose-700 text-white' : ''}
          {answered && !opt.correct && picked !== i ? 'bg-slate-800 opacity-40' : ''}
          {!answered ? 'bg-slate-800 active:bg-slate-700' : ''}"
        on:click={() => pickOption(i)}>{opt.label}</button>
    {/each}
  </div>
{:else}
  <input
    bind:value={typed}
    disabled={answered}
    placeholder={$t('typeAnswer')}
    on:keydown={(e) => e.key === 'Enter' && checkTyped()}
    class="mt-3 w-full rounded-xl bg-slate-800 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-pink-500" />
  {#if hint && !answered}
    <div class="mt-1 text-xs text-slate-500">💡 {hint}</div>
  {/if}
  {#if !answered}
    <button class="mt-2 w-full rounded-xl bg-indigo-500 py-3 font-semibold" on:click={checkTyped}>
      {$t('check')}
    </button>
  {/if}
{/if}

<slot {answered} {correct} />
