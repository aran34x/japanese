<script lang="ts">
  import { settings, t } from '../lib/stores';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import { CHARACTERS } from '../lib/game/characters';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import LevelCoin3D from './LevelCoin3D.svelte';
  import Icons from './Icons.svelte';
  import Characters from './Characters.svelte';
  import { fly } from 'svelte/transition';

  type Tab = 'heroes' | 'characters' | 'achievements';
  let tab: Tab = 'heroes';
  type CharSubTab = 'real' | 'fictional';
  let charSub: CharSubTab = 'fictional';

  $: tabs = [
    { id: 'heroes' as Tab, label: $t('heroes') },
    { id: 'characters' as Tab, label: $t('charactersTab') },
    { id: 'achievements' as Tab, label: $t('achievements') }
  ];

  $: cur = characterForXp($game.xp);
  $: nx = nextUnlock($game.xp);
  $: curUnlockedIndex = cur.index;

  function onImgError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement | null;
    if (fallback) fallback.style.display = 'grid';
  }
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-5xl px-4 py-8">
    <!-- Tabs -->
    <div class="mb-4 flex flex-wrap gap-1 rounded-2xl bg-slate-800 p-1 text-sm sm:rounded-full">
      {#each tabs as tb}
        <button
          class="flex-1 whitespace-nowrap rounded-full px-3 py-1.5 font-medium {tab === tb.id ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
          on:click={() => (tab = tb.id)}>{tb.label}</button>
      {/each}
    </div>

    {#if tab === 'heroes'}
      <section class="space-y-5" in:fly={{ y: 12, duration: 200 }}>
        <!-- Slim progress banner: where you are + how far to the next hero -->
        <div class="rounded-2xl bg-slate-800 p-4">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold uppercase tracking-wider text-slate-400">
              {$t('level')} {curUnlockedIndex + 1} · <span class="text-indigo-300">{cur.character.name}</span>
            </span>
            <span class="text-slate-500">{Math.round($game.xp).toLocaleString()} XP</span>
          </div>
          {#if nx.next}
            <div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-700">
              <div class="h-full bg-gradient-to-r from-pink-400 to-amber-300 transition-all" style="width:{nx.progress * 100}%"></div>
            </div>
            <div class="mt-1.5 text-xs text-slate-500">
              {Math.ceil(nx.next.xpRequired - $game.xp).toLocaleString()} XP {$t('toNextHero')} ???
            </div>
          {:else}
            <div class="mt-2 text-xs text-amber-400">✦ {$t('level')} max</div>
          {/if}
        </div>

        <!-- Hero ladder: the collection you grow into as you earn XP -->
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

    {:else if tab === 'characters'}
      <section class="space-y-4" in:fly={{ y: 12, duration: 200 }}>
        <div class="flex gap-2 rounded-xl bg-slate-900/50 p-1">
          <button
            class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all {charSub === 'fictional' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}"
            on:click={() => charSub = 'fictional'}
          >
            <span class="text-base">🎭</span>
            <span>{$t('fictional')}</span>
          </button>
          <button
            class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all {charSub === 'real' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}"
            on:click={() => charSub = 'real'}
          >
            <span class="text-base">👤</span>
            <span>{$t('realPeople')}</span>
          </button>
        </div>

        {#if charSub === 'fictional'}
          <Characters />
        {:else}
          <Icons />
        {/if}
      </section>

    {:else}
      <section class="space-y-2" in:fly={{ y: 12, duration: 200 }}>
        {#each ACHIEVEMENTS as a}
          {@const earned = $game.achievements.includes(a.id)}
          <div class="flex items-center gap-3 rounded-xl p-3 {earned ? 'bg-amber-500/15' : 'bg-slate-800 opacity-60'}">
            <div class="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-slate-900 {earned ? '' : 'grayscale'}">
              {#if earned && a.imageUrl}
                <img
                  src={a.imageUrl}
                  alt={a.name.en}
                  class="h-full w-full object-cover"
                  on:error={onImgError}
                />
                <div class="hidden h-full w-full place-items-center text-2xl">{a.icon}</div>
              {:else}
                <div class="grid h-full w-full place-items-center text-2xl">{earned ? a.icon : '🔒'}</div>
              {/if}
            </div>
            <div class="flex-1">
              <div class="text-sm font-semibold {earned ? 'text-amber-300' : 'text-slate-400'}">{a.name[$settings.uiLang]}</div>
              <div class="text-xs text-slate-500">{a.desc[$settings.uiLang]}</div>
            </div>
          </div>
        {/each}
      </section>
    {/if}
  </div>
</div>
