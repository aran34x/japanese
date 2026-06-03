<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, t } from '../lib/stores';
  import { db } from '../lib/db';
  import type { Deck } from '../lib/types';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import { CHARACTERS } from '../lib/game/characters';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import CharacterPortrait from './CharacterPortrait.svelte';
  import AdventureSession from './AdventureSession.svelte';
  import Icons from './Icons.svelte';
  import Characters from './Characters.svelte';
  import { fly } from 'svelte/transition';

  type Tab = 'quest' | 'icons' | 'characters' | 'collection' | 'achievements';
  let tab: Tab = 'quest';
  type View = 'hub' | 'deck' | 'session' | 'result';
  let view: View = 'hub';

  let decks: Deck[] = [];
  let selected = new Set<string>();
  let lastXp = 0;

  onMount(async () => {
    decks = await db.decks.toArray();
    selected = new Set(decks.map((d) => d.id));
  });

  $: tabs = [
    { id: 'quest' as Tab, label: $t('adventure') },
    { id: 'icons' as Tab, label: $t('icons') },
    { id: 'characters' as Tab, label: $t('charactersTab') },
    { id: 'collection' as Tab, label: $t('heroes') },
    { id: 'achievements' as Tab, label: $t('achievements') }
  ];

  $: cur = characterForXp($game.xp);
  $: nx = nextUnlock($game.xp);
  $: curUnlockedIndex = cur.index;

  function deckName(d: Deck) {
    return d.name[$settings.uiLang] ?? d.name.en ?? d.id;
  }
  function toggle(id: string) {
    selected.has(id) ? selected.delete(id) : selected.add(id);
    selected = new Set(selected);
  }
  function onDone(e: CustomEvent<{ xp: number }>) {
    lastXp = e.detail.xp;
    view = 'result';
  }

  function onImgError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement | null;
    if (fallback) fallback.style.display = 'grid';
  }
</script>

{#if view === 'session'}
  <AdventureSession deckIds={[...selected]} on:done={onDone} />

{:else if view === 'result'}
  <section class="grid place-items-center py-12 text-center" in:fly={{ y: 20, duration: 250 }}>
    <CharacterPortrait character={cur.character} size={180} />
    <div class="mt-2 text-2xl font-black">{cur.character.name}</div>
    <div class="text-sm text-slate-400">{$t('powerLevel')}: {cur.character.power}</div>
    <div class="mt-4 rounded-2xl bg-amber-500/15 px-8 py-4">
      <div class="text-4xl font-black text-amber-300">+{lastXp}</div>
      <div class="text-xs uppercase tracking-wide text-amber-200">{$t('xpEarned')}</div>
    </div>
    <div class="mt-6 flex gap-3">
      <button class="rounded-xl bg-indigo-500 px-6 py-3 font-semibold" on:click={() => (view = 'session')}>
        ⚔ {$t('continueQuest')}
      </button>
      <button class="rounded-xl bg-slate-700 px-6 py-3 font-semibold" on:click={() => (view = 'hub')}>
        {$t('back')}
      </button>
    </div>
  </section>

{:else if view === 'deck'}
  <section class="space-y-4">
    <h2 class="text-lg font-semibold">{$t('questDeck')}</h2>
    <div class="space-y-2">
      {#each decks as d}
        <label class="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
          <input type="checkbox" checked={selected.has(d.id)} on:change={() => toggle(d.id)} class="h-5 w-5 accent-pink-500" />
          <span class="flex-1">{deckName(d)}</span>
        </label>
      {/each}
    </div>
    <button
      class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98] disabled:opacity-40"
      disabled={selected.size === 0}
      on:click={() => (view = 'session')}>⚔ {$t('beginQuest')}</button>
    <button class="w-full rounded-xl bg-slate-800 py-2 text-slate-300" on:click={() => (view = 'hub')}>{$t('back')}</button>
  </section>

{:else}
  <!-- HUB with tabs -->
  <div class="mb-4 flex flex-wrap gap-1 rounded-2xl bg-slate-800 p-1 text-sm sm:rounded-full">
    {#each tabs as tb}
      <button
        class="flex-1 whitespace-nowrap rounded-full px-3 py-1.5 font-medium {tab === tb.id ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
        on:click={() => (tab = tb.id)}>{tb.label}</button>
    {/each}
  </div>

  {#if tab === 'quest'}
    <section class="space-y-5 text-center" in:fly={{ y: 12, duration: 200 }}>
      <div class="relative grid place-items-center rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 p-6">
        <CharacterPortrait character={cur.character} size={190} />
        <div class="mt-2 text-2xl font-black">{cur.character.name}</div>
        <div class="text-sm text-pink-300">{cur.character.title[$settings.uiLang]}</div>
        <div class="mt-1 inline-block rounded-full bg-slate-700 px-3 py-0.5 text-xs">
          {$t('level')} {curUnlockedIndex + 1} · {$t('powerLevel')} {cur.character.power}
        </div>
        <p class="mt-3 max-w-sm text-sm italic text-slate-400">"{cur.character.blurb[$settings.uiLang]}"</p>
      </div>

      <!-- XP progress to next hero -->
      {#if nx.next}
        <div class="rounded-2xl bg-slate-800 p-4">
          <div class="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span>{Math.round($game.xp).toLocaleString()} XP</span>
            <span>{Math.round(nx.next.xpRequired).toLocaleString()} XP · {$t('toNextHero')}</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-slate-700">
            <div class="h-full bg-gradient-to-r from-pink-400 to-amber-300 transition-all" style="width:{nx.progress * 100}%"></div>
          </div>
          <div class="mt-3 flex items-center gap-3 opacity-80">
            <div class="scale-75"><CharacterPortrait character={nx.next} size={56} locked glow={false} /></div>
            <div class="text-left">
              <div class="text-sm font-semibold text-slate-300">??? <span class="text-xs">({$t('locked')})</span></div>
              <div class="text-xs text-slate-500">{$t('powerLevel')} {nx.next.power}</div>
            </div>
          </div>
        </div>
      {/if}

      <button
        class="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 py-4 text-lg font-bold shadow-lg active:scale-[0.98]"
        on:click={() => (view = 'deck')}>⚔ {$t('continueQuest')}</button>
    </section>

  {:else if tab === 'icons'}
    <Icons />

  {:else if tab === 'characters'}
    <Characters />

  {:else if tab === 'collection'}
    <section class="grid grid-cols-3 gap-3" in:fly={{ y: 12, duration: 200 }}>
      {#each CHARACTERS as c, i}
        {@const unlocked = i <= curUnlockedIndex}
        <div class="flex flex-col items-center rounded-2xl bg-slate-800 p-2 text-center">
          <CharacterPortrait character={c} size={84} locked={!unlocked} glow={false} />
          <div class="mt-1 text-xs font-semibold {unlocked ? '' : 'text-slate-500'}">
            {unlocked ? c.name : '???'}
          </div>
          <div class="text-[10px] text-slate-500">{unlocked ? '⚡' + c.power : '🔒'}</div>
        </div>
      {/each}
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
{/if}
