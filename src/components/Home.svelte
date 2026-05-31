<script lang="ts">
  import { onMount } from 'svelte';
  import { t, navigate } from '../lib/stores';
  import { deckCounts } from '../lib/session';

  let counts = { due: 0, new: 0, learning: 0, total: 0 };
  onMount(async () => {
    counts = await deckCounts([]);
  });
</script>

<section class="space-y-6">
  <p class="text-slate-400">{$t('tagline')}</p>

  <div class="rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-lg">
    <div class="grid grid-cols-3 gap-3 text-center">
      <div>
        <div class="text-3xl font-bold">{counts.due + counts.learning}</div>
        <div class="text-xs text-indigo-200">{$t('due')}</div>
      </div>
      <div>
        <div class="text-3xl font-bold">{counts.new}</div>
        <div class="text-xs text-indigo-200">{$t('newCards')}</div>
      </div>
      <div>
        <div class="text-3xl font-bold">{counts.total}</div>
        <div class="text-xs text-indigo-200">{$t('totalCards')}</div>
      </div>
    </div>
    <button
      class="mt-5 w-full rounded-xl bg-white py-3 font-semibold text-indigo-700 active:scale-[0.98]"
      on:click={() => navigate('study')}
    >
      ▶ {$t('startReview')}
    </button>
  </div>

  <div>
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">{$t('modes')}</h2>
    <div class="grid grid-cols-2 gap-3">
      <button class="rounded-xl bg-slate-800 p-4 text-left active:scale-[0.98]" on:click={() => navigate('study')}>
        <div class="text-2xl">🃏</div>
        <div class="mt-1 font-medium">{$t('flashcards')}</div>
      </button>
      <button class="rounded-xl bg-slate-800 p-4 text-left active:scale-[0.98]" on:click={() => navigate('study')}>
        <div class="text-2xl">✅</div>
        <div class="mt-1 font-medium">{$t('quiz')}</div>
      </button>
      <button class="rounded-xl bg-slate-800 p-4 text-left active:scale-[0.98]" on:click={() => navigate('study')}>
        <div class="text-2xl">⌨️</div>
        <div class="mt-1 font-medium">{$t('typing')}</div>
      </button>
      <button class="rounded-xl bg-slate-800 p-4 text-left active:scale-[0.98]" on:click={() => navigate('decks')}>
        <div class="text-2xl">🗂️</div>
        <div class="mt-1 font-medium">{$t('decks')}</div>
      </button>
    </div>
  </div>

  <button
    class="w-full rounded-xl border border-dashed border-slate-600 py-3 text-slate-300 active:scale-[0.98]"
    on:click={() => navigate('import')}
  >
    ⬆ {$t('importTitle')}
  </button>
</section>
