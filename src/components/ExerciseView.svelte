<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise } from '../lib/types';
  import { normalize } from '../lib/exercises/generator';
  import { settings, t } from '../lib/stores';
  import { speakJa } from '../lib/speech';

  export let exercise: Exercise;
  export let compact = false;

  const dispatch = createEventDispatcher<{ answer: { correct: boolean } }>();
  let answered = false;
  let correct = false;
  let typed = '';

  function finish(isCorrect: boolean) {
    if (answered) return;
    answered = true;
    correct = isCorrect;
    dispatch('answer', { correct: isCorrect });
  }

  function checkTyped() {
    if (answered) return;
    const ans = normalize(typed);
    finish((exercise.answers ?? []).some((a) => a === ans));
  }
</script>

<div class="rounded-2xl bg-slate-800 p-5 text-center">
  <div class="mb-1 text-xs uppercase tracking-wide text-slate-500">
    {exercise.kind === 'mcq-jp-to-reading' ? $t('readingLabel') : $t('meaning')}
  </div>
  <button
    class="mx-auto block py-{compact ? 3 : 5} font-jp {compact ? 'text-4xl' : 'text-6xl'}"
    on:click={() => speakJa(exercise.card.reading || exercise.card.front)}
    title="🔊">{exercise.prompt}</button>
</div>

{#if exercise.options}
  <div class="mt-3 grid gap-2">
    {#each exercise.options as opt}
      <button
        disabled={answered}
        class="rounded-xl px-4 py-3 text-left text-lg transition-colors
          {answered && opt.correct ? 'bg-green-600 text-white' : ''}
          {answered && !opt.correct ? 'bg-slate-800 opacity-40' : ''}
          {!answered ? 'bg-slate-800 active:bg-slate-700' : ''}"
        on:click={() => finish(opt.correct)}>{opt.text}</button>
    {/each}
  </div>
{:else}
  <input
    bind:value={typed}
    disabled={answered}
    placeholder={$t('typeAnswer')}
    on:keydown={(e) => e.key === 'Enter' && checkTyped()}
    class="mt-3 w-full rounded-xl bg-slate-800 px-4 py-3 text-lg outline-none focus:ring-2 focus:ring-pink-500" />
  {#if !answered}
    <button class="mt-2 w-full rounded-xl bg-indigo-500 py-3 font-semibold" on:click={checkTyped}>
      {$t('check')}
    </button>
  {/if}
{/if}

{#if answered}
  <div class="mt-3 rounded-xl p-3 text-center text-sm {correct ? 'bg-green-900/40 text-green-300' : 'bg-rose-900/40 text-rose-300'}">
    {correct ? '✓ ' + $t('correct') : '✗ ' + $t('incorrect')}
    <span class="text-slate-300">— {exercise.card.front}
      {#if exercise.card.reading && exercise.card.reading !== exercise.card.front}・{exercise.card.reading}{/if}
      {#if exercise.card.meaning[$settings.uiLang]}・{exercise.card.meaning[$settings.uiLang]}{/if}
    </span>
  </div>
{/if}
