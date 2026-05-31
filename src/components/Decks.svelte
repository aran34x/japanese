<script lang="ts">
  import { onMount } from 'svelte';
  import { t, settings } from '../lib/stores';
  import { db, resetReviews } from '../lib/db';
  import type { Deck } from '../lib/types';

  let decks: (Deck & { count: number })[] = [];

  async function load() {
    const ds = await db.decks.toArray();
    decks = await Promise.all(
      ds.map(async (d) => ({ ...d, count: await db.cards.where('deckId').equals(d.id).count() }))
    );
  }
  onMount(load);

  function name(d: Deck) {
    return d.name[$settings.uiLang] ?? d.name.en ?? d.id;
  }
  function desc(d: Deck) {
    return d.description?.[$settings.uiLang] ?? d.description?.en ?? '';
  }

  async function reset(d: Deck) {
    const ids = await db.cards.where('deckId').equals(d.id).primaryKeys();
    await resetReviews(ids as string[]);
  }

  async function remove(d: Deck) {
    if (d.builtin) return;
    await db.cards.where('deckId').equals(d.id).delete();
    await db.decks.delete(d.id);
    await load();
  }

  const emoji: Record<string, string> = {
    hiragana: 'あ', katakana: 'ア', kanji: '漢', vocab: '語', reading: '読', custom: '⭐'
  };
</script>

<section class="space-y-3">
  <h2 class="text-lg font-semibold">{$t('decks')}</h2>
  {#each decks as d}
    <div class="rounded-2xl bg-slate-800 p-4">
      <div class="flex items-center gap-3">
        <div class="grid h-12 w-12 place-items-center rounded-xl bg-slate-700 font-jp text-2xl">
          {emoji[d.category] ?? '⭐'}
        </div>
        <div class="flex-1">
          <div class="font-medium">{name(d)}</div>
          <div class="text-xs text-slate-400">{d.count} {$t('cards')}{desc(d) ? ' · ' + desc(d) : ''}</div>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="flex-1 rounded-lg bg-slate-700 py-2 text-sm" on:click={() => reset(d)}>↺ {$t('resetDeck')}</button>
        {#if !d.builtin}
          <button class="rounded-lg bg-rose-700 px-4 py-2 text-sm" on:click={() => remove(d)}>🗑</button>
        {/if}
      </div>
    </div>
  {/each}
</section>
