<script lang="ts">
  import { t, navigate, settings } from '../lib/stores';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import LevelCoin3D from './LevelCoin3D.svelte';

  $: cur = characterForXp($game.xp);
  $: nx = nextUnlock($game.xp);

  // Top-level destinations — the "mode select" screen. Every tile uses the
  // app's primary highlighted-button style (from-pink-500 to-indigo-500),
  // which the skin system already restyles — no per-tile colors.
  $: modes = [
    { id: 'study', icon: '📚', title: $t('study'), desc: $t('homeStudyDesc') },
    { id: 'lessons', icon: '先', title: $t('lessons'), desc: $t('homeLessonsDesc') },
    { id: 'adventure', icon: '⚔️', title: $t('adventure'), desc: $t('homeAdventureDesc') },
    { id: 'stories', icon: '📖', title: $t('stories'), desc: $t('homeStoriesDesc') }
  ];
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <section class="mx-auto flex min-h-full max-w-5xl flex-col justify-center gap-6 px-4 py-8">
    <!-- Level / Adventure progress strip -->
    <button
      class="group w-full rounded-2xl bg-slate-800/80 p-4 text-left shadow-lg ring-1 ring-white/5 transition active:scale-[0.99] hover:ring-white/15"
      on:click={() => navigate('adventure')}
    >
      <div class="flex items-center gap-4">
        <div class="shrink-0">
          <LevelCoin3D character={cur.character} level={cur.index + 1} size={120} />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline justify-between">
            <div class="text-xs font-semibold uppercase tracking-wide text-slate-400">{$t('level')} {cur.index + 1}</div>
            <div class="text-xs text-slate-500">{Math.round($game.xp).toLocaleString()} XP</div>
          </div>
          <div class="text-lg font-black leading-tight">{cur.character.name}</div>
          <div class="text-sm text-pink-300">{cur.character.title[$settings.uiLang]}</div>
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

    <!-- Mode select — game-style tiles -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each modes as m (m.id)}
        <button
          class="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-indigo-500 p-5 text-left shadow-lg ring-1 ring-white/10 transition-transform duration-150 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl active:scale-95"
          on:click={() => navigate(m.id)}
        >
          <!-- sheen -->
          <span class="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rounded-full bg-white/15 blur-2xl"></span>
          <div class="relative flex items-center gap-4 sm:flex-col sm:items-start">
            <div class="text-5xl drop-shadow-lg transition-transform duration-150 group-hover:scale-110 group-active:scale-95 sm:text-6xl">{m.icon}</div>
            <div class="min-w-0">
              <div class="text-xl font-black tracking-tight text-current drop-shadow">{m.title}</div>
              <div class="text-sm text-current opacity-80">{m.desc}</div>
            </div>
          </div>
          <div class="relative mt-3 text-base font-black text-current opacity-80 transition-transform duration-150 group-hover:translate-x-1 sm:mt-4">
            ▶
          </div>
        </button>
      {/each}
    </div>
  </section>
</div>
