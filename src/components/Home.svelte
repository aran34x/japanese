<script lang="ts">
  import { onMount } from 'svelte';
  import { t, navigate, settings } from '../lib/stores';
  import { deckCounts } from '../lib/session';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import CharacterPortrait from './CharacterPortrait.svelte';

  let counts = { due: 0, new: 0, learning: 0, total: 0 };
  onMount(async () => {
    counts = await deckCounts([]);
  });

  $: cur = characterForXp($game.xp);
  $: nx = nextUnlock($game.xp);
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

  <!-- Level / Adventure card -->
  <button
    class="w-full rounded-2xl bg-slate-800 p-4 text-left shadow-lg active:scale-[0.98]"
    on:click={() => navigate('adventure')}
  >
    <div class="flex items-center gap-4">
      <div class="shrink-0">
        <CharacterPortrait character={cur.character} size={64} glow={false} />
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex items-baseline justify-between">
          <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">{$t('level')} {cur.index + 1}</div>
          <div class="text-xs text-slate-500">{Math.round($game.xp).toLocaleString()} XP</div>
        </div>
        <div class="text-lg font-black leading-tight">{cur.character.name}</div>
        <div class="text-sm text-pink-300">{cur.character.title[$settings.uiLang]}</div>
        <!-- XP progress bar -->
        <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
          <div class="h-full rounded-full bg-gradient-to-r from-pink-400 to-amber-300 transition-all" style="width:{nx.progress * 100}%"></div>
        </div>
        {#if nx.next}
          {@const xpLeft = Math.ceil(nx.next.xpRequired - $game.xp)}
          <div class="mt-1 text-xs text-slate-500">{xpLeft.toLocaleString()} XP {$t('toNextHero')} ???</div>
        {:else}
          <div class="mt-1 text-xs text-amber-400">✦ {$t('level')} max</div>
        {/if}
      </div>
    </div>
  </button>

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
      <button class="rounded-xl bg-slate-800 p-4 text-left active:scale-[0.98]" on:click={() => navigate('study')}>
        <div class="text-2xl">⚙️</div>
        <div class="mt-1 font-medium">Custom</div>
      </button>
    </div>
  </div>

</section>
