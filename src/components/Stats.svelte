<script lang="ts">
  import { onMount } from 'svelte';
  import { t, settings } from '../lib/stores';
  import { db } from '../lib/db';
  import { game, characterForXp } from '../lib/game/state';
  import { CHARACTERS } from '../lib/game/characters';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import { PEOPLE } from '../lib/game/people';
  import { STORIES } from '../lib/data/stories';
  import type { Card } from '../lib/types';

  let total = 0, mature = 0, reviewedTotal = 0, correctTotal = 0, dueToday = 0, learnedCards = 0;
  // Struggle cards: low accuracy after enough reps.
  let struggle: { card: Card; acc: number; reviews: number }[] = [];

  onMount(async () => {
    const states = await db.reviews.toArray();
    const now = Date.now();
    total = states.length;
    const strugIds: { id: string; acc: number; reviews: number }[] = [];
    for (const s of states) {
      if (s.interval >= 21) mature++;
      if (s.phase !== 'new') learnedCards++;
      reviewedTotal += s.totalReviews;
      correctTotal += s.totalCorrect;
      if (s.due <= now && s.phase !== 'new') dueToday++;
      if (s.totalReviews >= 3) {
        const acc = s.totalCorrect / s.totalReviews;
        if (acc < 0.6) strugIds.push({ id: s.cardId, acc, reviews: s.totalReviews });
      }
    }
    strugIds.sort((a, b) => a.acc - b.acc);
    const top = strugIds.slice(0, 6);
    const cards = await db.cards.bulkGet(top.map((x) => x.id));
    struggle = top
      .map((x, i) => ({ card: cards[i], acc: x.acc, reviews: x.reviews }))
      .filter((x): x is { card: Card; acc: number; reviews: number } => !!x.card);
  });

  $: accuracy = reviewedTotal ? Math.round((correctTotal / reviewedTotal) * 100) : 0;
  $: charsUnlocked = characterForXp($game.xp).index + 1;
  $: studyTime = formatDuration($game.studySeconds ?? 0);

  function formatDuration(secs: number): string {
    const m = Math.floor(secs / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }

  // Coloured stat tiles.
  $: tiles = [
    { value: `${accuracy}%`, label: $t('accuracy'), color: 'text-highlight' },
    { value: reviewedTotal, label: $t('totalReviews'), color: 'text-highlight' },
    { value: studyTime, label: $t('timeStudied'), color: 'text-highlight' },
    { value: mature, label: $t('mature'), color: 'text-green-400' },
    { value: learnedCards, label: $t('cardsLearned'), color: 'text-amber-400' },
    { value: total, label: $t('totalCards'), color: 'text-slate-300' }
  ];

  $: progress = [
    { icon: '⚡', value: Math.round($game.xp).toLocaleString(), label: 'XP' },
    { icon: '🔥', value: $game.dayStreak, label: $t('streak') },
    { icon: '🏅', value: `${$game.achievements.length}/${ACHIEVEMENTS.length}`, label: $t('achievements') },
    { icon: '🦊', value: `${charsUnlocked}/${CHARACTERS.length}`, label: $t('charactersTab') },
    { icon: '🌟', value: `${$game.unlockedPeople.length}/${PEOPLE.length}`, label: $t('icons') },
    { icon: '📖', value: `${$game.storiesDone.length}/${STORIES.length}`, label: $t('stories') }
  ];

  function front(c: Card) { return c.front; }
  function meaning(c: Card) { return c.meaning[$settings.uiLang] ?? c.meaning.en ?? ''; }
</script>

<section class="space-y-5">
  <h2 class="text-lg font-semibold">{$t('stats')}</h2>

  <!-- Learning numbers -->
  <div class="grid grid-cols-3 gap-3">
    {#each tiles as s}
      <div class="rounded-2xl bg-slate-800 p-4">
        <div class="text-2xl font-bold {s.color}">{s.value}</div>
        <div class="mt-0.5 text-[11px] leading-tight text-slate-400">{s.label}</div>
      </div>
    {/each}
  </div>

  <!-- Levels / collection progress -->
  <div>
    <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">{$t('levels')}</h3>
    <div class="grid grid-cols-3 gap-3">
      {#each progress as p}
        <div class="flex flex-col items-center rounded-2xl bg-slate-800 p-3 text-center">
          <div class="text-2xl">{p.icon}</div>
          <div class="mt-1 text-base font-bold">{p.value}</div>
          <div class="text-[11px] leading-tight text-slate-400">{p.label}</div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Struggle cards -->
  <div>
    <h3 class="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">😣 {$t('struggleCards')}</h3>
    {#if struggle.length === 0}
      <p class="rounded-2xl bg-slate-800 p-4 text-sm text-slate-400">{$t('noStruggles')}</p>
    {:else}
      <div class="space-y-2">
        {#each struggle as s}
          <div class="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
            <div class="font-jp text-2xl">{front(s.card)}</div>
            <div class="min-w-0 flex-1">
              <div class="truncate text-sm text-slate-300">{meaning(s.card)}</div>
              <div class="text-xs text-slate-500">{s.reviews} {$t('cards')}</div>
            </div>
            <div class="shrink-0 rounded-lg bg-rose-900/40 px-2.5 py-1 text-sm font-bold text-rose-300">
              {Math.round(s.acc * 100)}%
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section>
