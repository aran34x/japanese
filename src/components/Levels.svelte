<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import { CHARACTERS } from '../lib/game/characters';
  import LevelCoin3D from './LevelCoin3D.svelte';
  import { fly } from 'svelte/transition';

  $: cur = characterForXp($game.xp);
  $: nx = nextUnlock($game.xp);
  $: curUnlockedIndex = cur.index;
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-5xl px-4 py-8">
    <section class="space-y-5" in:fly={{ y: 12, duration: 200 }}>
      <div class="rounded-2xl bg-slate-800 p-4">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold uppercase tracking-wider text-slate-400">
            {$t('level')} {curUnlockedIndex + 1} · <span class="text-indigo-300">{cur.character.name}</span>
          </span>
          <span class="text-slate-500">{Math.round($game.xp).toLocaleString()} XP</span>
        </div>
        {#if nx.next}
          <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-700">
            <div class="h-full bg-pink-500 transition-all" style="width:{nx.progress * 100}%"></div>
          </div>
          <div class="mt-1.5 text-xs text-slate-500">
            {Math.ceil(nx.next.xpRequired - $game.xp).toLocaleString()} XP {$t('toNextLevel')} ???
          </div>
        {:else}
          <div class="mt-2 text-xs text-amber-400">✦ {$t('level')} max</div>
        {/if}
      </div>

      <div class="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {#each CHARACTERS as c, i}
          {@const unlocked = i <= curUnlockedIndex}
          {@const isCurrent = i === curUnlockedIndex}
          <div class="relative flex flex-col items-center rounded-2xl p-2 text-center {isCurrent ? 'bg-indigo-500/15 ring-2 ring-indigo-400' : 'bg-slate-800'}">
            {#if isCurrent}
              <span class="absolute right-1.5 top-1.5 rounded-full bg-indigo-400 px-1.5 py-0.5 text-[9px] font-black uppercase text-slate-900">{$t('youLabel')}</span>
            {/if}
            <LevelCoin3D character={c} level={i + 1} size={78} interactive={false} autoSpin={false} showImage={unlocked} />
            <div class="mt-1 text-xs font-semibold {unlocked ? '' : 'text-slate-500'}">
              {unlocked ? c.name : '???'}
            </div>
            <div class="text-[10px] text-slate-500">{unlocked ? '⚡' + c.power : '🔒 ' + c.xpRequired.toLocaleString() + ' XP'}</div>
          </div>
        {/each}
      </div>
    </section>
  </div>
</div>
