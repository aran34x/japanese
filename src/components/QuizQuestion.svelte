<script lang="ts" context="module">
  export interface QuizOption {
    label: string;
    correct: boolean;
  }
</script>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { settings, t } from '../lib/stores';
  import { speakJa } from '../lib/speech';
  import type { Lesson } from '../lib/types';
  import { scale } from 'svelte/transition';
  import { matchesAnswer } from '../lib/quiz/match';

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
  /** TTS text for the prompt (no button if empty). */
  export let promptSpeak = '';
  /** Recorded audio URL for the prompt — preferred over TTS when present. */
  export let promptAudioUrl = '';
  /** Allow playing the answer OPTIONS aloud (adds a 🔊 per option). Defaults to true if Japanese is detected. */
  export let answerAudio = true;
  /** Optional hint shown under a typing input before answering. */
  export let hint = '';
  export let compact = false;
  /** Mini-lesson to show after answering. */
  export let lesson: Lesson | null = null;

  $: hasPromptAudio = !!(promptAudioUrl || promptSpeak);
  function playPrompt() {
    if (promptAudioUrl) { new Audio(promptAudioUrl).play(); return; }
    if (promptSpeak) speakJa(promptSpeak);
  }

  const dispatch = createEventDispatcher<{ answer: { correct: boolean }; next: void }>();

  let answered = false;
  let correct = false;
  let picked: number | null = null;
  let typed = '';
  let showLesson = false;

  function isJapanese(s: string): boolean {
    return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(s);
  }

  /**
   * Determine if we should show a TTS button for this option.
   * True if it's Japanese AND not already the main focus of a reading question.
   */
  function shouldShowAudio(optLabel: string): boolean {
    if (!answerAudio || !isJapanese(optLabel)) return false;
    // If the instruction specifically asks for the reading/pronunciation,
    // playing the audio would be a spoiler.
    const lowerInstr = instruction.toLowerCase();
    const isReadingTask = lowerInstr.includes('reading') || lowerInstr.includes('lettura') || lowerInstr.includes('pronun');
    if (isReadingTask) {
        // Simple collision check: if the option text appears in the prompt or vice versa
        if (optLabel.includes(prompt) || prompt.includes(optLabel)) return false;
    }
    return true;
  }

  function finish(isCorrect: boolean) {
    if (answered) return;
    answered = true;
    correct = isCorrect;
    if (!correct || $settings.showLessonAlways) {
      showLesson = true;
    }
    dispatch('answer', { correct: isCorrect });
  }

  function pickOption(i: number) {
    if (answered || !options) return;
    picked = i;
    finish(options[i].correct);
  }

  function checkTyped() {
    if (answered) return;
    finish(matchesAnswer(typed, answers));
  }
</script>

<div class="rounded-2xl bg-slate-800 p-5 text-center">
  {#if instruction}
    <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">{instruction}</div>
  {/if}
  <div class="font-jp {compact ? 'py-3 text-4xl' : 'py-5 text-5xl'}">{prompt}</div>
  {#if hasPromptAudio}
    <button
      class="mx-auto mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-lg transition-transform active:scale-95"
      on:click={playPrompt}
      title="🔊">🔊</button>
  {/if}
</div>

{#if options}
  <div class="mt-3 grid gap-2">
    {#each options as opt, i}
      <div class="flex items-stretch gap-2">
        <button
          disabled={answered}
          class="flex-1 rounded-xl px-4 py-3 text-left text-lg transition-colors
            {answered && opt.correct ? 'bg-green-600 text-white' : ''}
            {answered && !opt.correct && picked === i ? 'bg-rose-700 text-white' : ''}
            {answered && !opt.correct && picked !== i ? 'bg-slate-800 opacity-40' : ''}
            {!answered ? 'bg-slate-800 active:bg-slate-700' : ''}"
          on:click={() => pickOption(i)}>{opt.label}</button>
        {#if shouldShowAudio(opt.label)}
          <button
            class="shrink-0 rounded-xl bg-slate-800 px-3 active:bg-slate-700"
            title="🔊"
            on:click|stopPropagation={() => speakJa(opt.label)}>🔊</button>
        {/if}
      </div>
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

{#if showLesson && lesson}
  <div in:scale={{ start: 0.9, duration: 200 }} class="mt-4 rounded-2xl border border-amber-500/30 bg-slate-900 p-4 text-left">
    <div class="mb-2 font-bold text-amber-300">📖 {$t('miniLesson')}</div>
    <div class="space-y-2">
      {#each lesson.vocab as v}
        <div class="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2">
          <div class="flex flex-col">
            <span class="font-jp text-xl">{v.jp}</span>
            <span class="text-xs text-highlight">{v.reading}</span>
          </div>
          <span class="ml-auto text-sm text-slate-300">
            {#if v.meaning[$settings.uiLang]}
              {v.meaning[$settings.uiLang]}
            {:else if v.meaning.en}
              {v.meaning.en}
            {/if}
          </span>
          <button
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs active:scale-95"
            on:click={() => speakJa(v.jp)}
            title="🔊">🔊</button>
        </div>
      {/each}
    </div>
    {#if lesson.tip[$settings.uiLang] || lesson.tip.en}
      <p class="mt-3 text-sm italic text-slate-400">
        💡 {lesson.tip[$settings.uiLang] || lesson.tip.en}
      </p>
    {/if}
  </div>
{/if}

{#if answered}
  <button
    class="mt-4 w-full rounded-xl bg-indigo-600 py-3 font-bold shadow-lg active:scale-[0.98]"
    on:click={() => dispatch('next')}
  >
    {$t('next')} →
  </button>
{/if}
