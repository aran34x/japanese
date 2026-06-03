<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Exercise, Grade } from '../lib/types';
  import { t, settings } from '../lib/stores';
  import { speakJa, canSpeak } from '../lib/speech';
  import { mediaUrl } from '../lib/db';
  import { onDestroy } from 'svelte';

  export let exercise: Exercise;
  const dispatch = createEventDispatcher<{ grade: Grade }>();

  let flipped = false;
  let audioUrl: string | undefined;
  let imageUrl: string | undefined;

  $: card = exercise.card;

  // Reset flip + load any imported media whenever the card changes.
  let lastId = '';
  $: if (card.id !== lastId) {
    lastId = card.id;
    flipped = false;
    void loadMedia();
    if ($settings.autoAudio) maybeSpeak();
  }

  async function loadMedia() {
    revoke();
    audioUrl = card.audioUrl ?? await mediaUrl(card.audioId);
    imageUrl = card.imageUrl ?? await mediaUrl(card.imageId);
  }
  function revoke() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    audioUrl = undefined;
    imageUrl = undefined;
  }
  onDestroy(revoke);

  function maybeSpeak() {
    if (audioUrl) return; // imported audio takes precedence
    if (canSpeak()) speakJa(card.reading || card.front);
  }

  function playAudio() {
    if (audioUrl) new Audio(audioUrl).play();
    else speakJa(card.reading || card.front);
  }

  const grades: { g: Grade; key: string; color: string }[] = [
    { g: 'again', key: 'again', color: 'bg-rose-600' },
    { g: 'hard', key: 'hard', color: 'bg-amber-600' },
    { g: 'good', key: 'good', color: 'bg-green-600' },
    { g: 'easy', key: 'easy', color: 'bg-sky-600' }
  ];

  function meaningText(): string {
    const langs = $settings.meaningLangs;
    const parts = langs.map((l) => card.meaning[l]).filter(Boolean) as string[];
    return [...new Set(parts)].join('  ·  ');
  }
</script>

<div
  class="card-3d grid min-h-[16rem] place-items-center rounded-2xl bg-slate-800 p-6 text-center"
  on:click={() => (flipped = true)}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === ' ' && (flipped = true)}
>
  {#if imageUrl}
    <img src={imageUrl} alt="" class="mb-3 max-h-32 rounded-lg" />
  {/if}
  <div class="font-jp text-6xl leading-tight">{card.front}</div>

  {#if flipped}
    <div class="mt-4 space-y-1 border-t border-slate-700 pt-4">
      {#if card.reading && card.reading !== card.front}
        <div class="text-xl text-pink-300">{card.reading}</div>
      {/if}
      {#if card.romaji}<div class="text-sm text-slate-400">{card.romaji}</div>{/if}
      <div class="text-lg">{meaningText()}</div>
    </div>
  {/if}

  <button
    class="mt-3 rounded-full bg-slate-700 px-4 py-1 text-sm"
    on:click|stopPropagation={playAudio}>🔊</button>
</div>

{#if !flipped}
  <button
    class="mt-3 w-full rounded-xl bg-indigo-500 py-3 font-semibold active:scale-[0.98]"
    on:click={() => (flipped = true)}>{$t('showAnswer')}</button>
{:else}
  <div class="mt-3 grid grid-cols-4 gap-2">
    {#each grades as { g, key, color }}
      <button class="{color} rounded-xl py-3 text-sm font-medium active:scale-[0.98]" on:click={() => dispatch('grade', g)}>
        {$t(key)}
      </button>
    {/each}
  </div>
{/if}
