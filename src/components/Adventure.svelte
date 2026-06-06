<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, t } from '../lib/stores';
  import { db } from '../lib/db';
  import type { Deck } from '../lib/types';
  import { game, characterForXp, nextUnlock } from '../lib/game/state';
  import { CHARACTERS } from '../lib/game/characters';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import CharacterPortrait from './CharacterPortrait.svelte';
  import LevelCoin3D from './LevelCoin3D.svelte';
  import AdventureSession from './AdventureSession.svelte';
  import Icons from './Icons.svelte';
  import Characters from './Characters.svelte';
  import { fly } from 'svelte/transition';

  type Tab = 'adventure' | 'characters' | 'achievements';
  let tab: Tab = 'adventure';
  type CharSubTab = 'real' | 'fictional';
  let charSub: CharSubTab = 'fictional';
  type View = 'hub' | 'deck' | 'session' | 'result' | 'levels';
  let view: View = 'hub';

  type DeckWithCount = Deck & { count: number };
  let decks: DeckWithCount[] = [];
  let selected = new Set<string>();
  let lastXp = 0;

  // Group sets by category for display, ordered by typical difficulty path.
  const CATEGORY_ORDER = ['hiragana', 'katakana', 'kanji', 'vocab', 'reading', 'custom'] as const;
  const CAT_LABELS: Record<string, { en: string; it: string; icon: string }> = {
    hiragana: { en: 'Hiragana', it: 'Hiragana', icon: 'あ' },
    katakana: { en: 'Katakana', it: 'Katakana', icon: 'ア' },
    kanji: { en: 'Kanji', it: 'Kanji', icon: '漢' },
    vocab: { en: 'Vocabulary', it: 'Vocaboli', icon: '語' },
    reading: { en: 'Reading & Grammar', it: 'Lettura e grammatica', icon: '読' },
    custom: { en: 'Imported sets', it: 'Set importati', icon: '⭐' }
  };

  onMount(async () => {
    const deckRows = await db.decks.toArray();
    const cards = await db.cards.toArray();
    const counts = new Map<string, number>();
    for (const card of cards) counts.set(card.deckId, (counts.get(card.deckId) ?? 0) + 1);
    decks = deckRows.map((deck) => ({ ...deck, count: counts.get(deck.id) ?? 0 }));
    selected = new Set(decks.map((d) => d.id));
  });

  $: groups = CATEGORY_ORDER
    .map((cat) => ({ cat, items: decks.filter((d) => d.category === cat) }))
    .filter((g) => g.items.length > 0);

  $: tabs = [
    { id: 'adventure' as Tab, label: $t('adventure') },
    { id: 'characters' as Tab, label: $t('charactersTab') },
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
  $: allSelected = decks.length > 0 && selected.size === decks.length;
  function toggleAll() {
    selected = allSelected ? new Set() : new Set(decks.map((d) => d.id));
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
  <div class="mx-auto max-w-5xl px-4 py-8">
    <AdventureSession deckIds={[...selected]} on:done={onDone} />
  </div>

{:else if view === 'result'}
  <div class="flex-1 overflow-y-auto overflow-x-hidden">
    <section class="mx-auto max-w-5xl grid place-items-center py-12 text-center px-4" in:fly={{ y: 20, duration: 250 }}>
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
  </div>

{:else if view === 'deck'}
  <section class="flex flex-col h-full overflow-hidden">
    <div class="shrink-0 space-y-3 px-4 pt-8 pb-4 mx-auto w-full max-w-5xl">
      <h2 class="text-center text-lg font-bold">{$t('questDeck')}</h2>
      <button
        class="mx-auto block w-full max-w-xs rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-pink-300 transition-colors active:bg-slate-700"
        on:click={toggleAll}
      >
        {allSelected ? $t('unselectAll') : $t('selectAll')}
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-4">
      <div class="mx-auto max-w-5xl space-y-5 pb-8">
        {#each groups as g (g.cat)}
          <div>
            <h3 class="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span class="font-jp text-sm text-slate-300">{CAT_LABELS[g.cat].icon}</span>
              {CAT_LABELS[g.cat][$settings.uiLang]}
            </h3>
            <div class="space-y-2">
              {#each g.items as d (d.id)}
                <label class="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2.5">
                  <input type="checkbox" checked={selected.has(d.id)} on:change={() => toggle(d.id)}
                    class="h-5 w-5 shrink-0 accent-pink-500" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-medium">{deckName(d)}</span>
                    <span class="block text-xs text-slate-400">{d.count} {$t('cards')}</span>
                  </span>
                </label>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="shrink-0 space-y-3 px-4 py-6 bg-slate-950 border-t border-slate-800">
      <div class="mx-auto max-w-5xl space-y-3">
        <button
          class="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 text-lg font-bold active:scale-[0.98] disabled:opacity-40"
          disabled={selected.size === 0}
          on:click={() => (view = 'session')}>⚔ {$t('beginQuest')}</button>
        <button class="w-full rounded-xl bg-slate-800 py-2 text-slate-300" on:click={() => (view = 'hub')}>{$t('back')}</button>
      </div>
    </div>
  </section>

{:else}
  <div class="flex-1 overflow-y-auto overflow-x-hidden">
    <div class="mx-auto max-w-5xl px-4 py-8">
      <!-- HUB with tabs -->
      <div class="mb-4 flex flex-wrap gap-1 rounded-2xl bg-slate-800 p-1 text-sm sm:rounded-full">
        {#each tabs as tb}
          <button
            class="flex-1 whitespace-nowrap rounded-full px-3 py-1.5 font-medium {tab === tb.id ? 'bg-indigo-500 text-white' : 'text-slate-300'}"
            on:click={() => (tab = tb.id)}>{tb.label}</button>
        {/each}
      </div>

      {#if tab === 'adventure'}
        {#if view === 'levels'}
          <section class="space-y-4" in:fly={{ y: 12, duration: 180 }}>
            <button class="text-sm text-slate-400" on:click={() => (view = 'hub')}>← {$t('back')}</button>
            <h2 class="text-xl font-bold">{$t('heroes')}</h2>
            <div class="grid grid-cols-3 gap-3">
              {#each CHARACTERS as c, i}
                {@const unlocked = i <= curUnlockedIndex}
                <div class="flex flex-col items-center rounded-2xl bg-slate-800 p-2 text-center">
                  <LevelCoin3D character={c} level={i + 1} size={78} interactive={false} autoSpin={false} showImage={unlocked} />
                  <div class="mt-1 text-xs font-semibold {unlocked ? '' : 'text-slate-500'}">
                    {unlocked ? c.name : '???'}
                  </div>
                  <div class="text-[10px] text-slate-500">{unlocked ? '⚡' + c.power : '🔒'}</div>
                </div>
              {/each}
            </div>
          </section>
        {:else}
          <section class="space-y-5 text-center" in:fly={{ y: 12, duration: 200 }}>
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 p-6">
              <div class="mb-4 flex items-center justify-between">
                <div class="text-left">
                  <div class="text-xs font-bold uppercase tracking-wider text-slate-500">My Level</div>
                  <div class="text-lg font-black text-indigo-400">"{cur.character.title[$settings.uiLang]}"</div>
                </div>
                <button class="text-xs font-bold text-pink-400 underline" on:click={() => (view = 'levels')}>Next Levels →</button>
              </div>
              <div class="grid place-items-center">
                <LevelCoin3D character={cur.character} level={curUnlockedIndex + 1} size={190} />
              </div>
              <div class="mt-4 text-2xl font-black">{cur.character.name}</div>
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
        {/if}

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
{/if}
