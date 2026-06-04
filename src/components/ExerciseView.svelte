<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '../lib/types';
  import { settings, t } from '../lib/stores';
  import QuizQuestion, { type QuizOption } from './QuizQuestion.svelte';

  export let exercise: Exercise;
  export let compact = false;

  const dispatch = createEventDispatcher<{ answer: { correct: boolean } }>();

  $: options = exercise.options
    ? (exercise.options.map((o) => ({ label: o.text, correct: o.correct })) as QuizOption[])
    : null;
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
  on:answer={(e) => dispatch('answer', e.detail)}
  let:answered
  let:correct
>
  {#if answered}
    <div class="mt-3 rounded-xl p-3 text-center text-sm {correct ? 'bg-green-900/40 text-green-300' : 'bg-rose-900/40 text-rose-300'}">
      {correct ? '✓ ' + $t('correct') : '✗ ' + $t('incorrect')}
      <span class="text-slate-300">— {exercise.card.front}
        {#if exercise.card.reading && exercise.card.reading !== exercise.card.front}・{exercise.card.reading}{/if}
        {#if exercise.card.meaning[$settings.uiLang]}・{exercise.card.meaning[$settings.uiLang]}{/if}
      </span>
    </div>
  {/if}
</QuizQuestion>
