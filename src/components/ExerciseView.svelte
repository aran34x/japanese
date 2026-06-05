<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '../lib/types';
  import { settings, t } from '../lib/stores';
  import { speakJa } from '../lib/speech';
  import QuizQuestion, { type QuizOption } from './QuizQuestion.svelte';

  export let exercise: Exercise;
  export let compact = false;

  const dispatch = createEventDispatcher<{ answer: { correct: boolean }; next: void }>();

  $: options = exercise.options
    ? (exercise.options.map((o) => ({ label: o.text, correct: o.correct })) as QuizOption[])
    : null;

  function playResultAudio() {
    if (exercise.card.audioUrl) {
      new Audio(exercise.card.audioUrl).play().catch(() => {});
    } else {
      speakJa(exercise.card.reading || exercise.card.front);
    }
  }
</script>

<QuizQuestion
  prompt={exercise.prompt}
  instruction={$t(exercise.instructionKey || 'meaning')}
  {options}
  answers={exercise.answers ?? []}
  promptSpeak={exercise.promptSpeak ?? ''}
  promptAudioUrl={exercise.promptAudioUrl ?? ''}
  answerAudio={exercise.answerAudio ?? false}
  {compact}
  lesson={exercise.lesson}
  on:answer={(e) => dispatch('answer', e.detail)}
  on:next={() => dispatch('next')}
  let:answered
  let:correct
>
  {#if answered}
    <div class="mt-3 flex items-center gap-2 rounded-xl p-3 text-center text-sm {correct ? 'bg-green-900/40 text-green-300' : 'bg-rose-900/40 text-rose-300'}">
      <div class="flex-1">
        {correct ? '✓ ' + $t('correct') : '✗ ' + $t('incorrect')}
        <span class="text-slate-300">— {exercise.card.front}
          {#if exercise.card.reading && exercise.card.reading !== exercise.card.front}・{exercise.card.reading}{/if}
          {#if exercise.card.meaning[$settings.uiLang]}・{exercise.card.meaning[$settings.uiLang]}{/if}
        </span>
      </div>
      <button
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs active:scale-95"
        on:click={playResultAudio}
        title="🔊">🔊</button>
    </div>
  {/if}
</QuizQuestion>
