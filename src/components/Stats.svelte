<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '../lib/stores';
  import { db } from '../lib/db';

  let total = 0, mature = 0, reviewedTotal = 0, correctTotal = 0, dueToday = 0;

  onMount(async () => {
    const states = await db.reviews.toArray();
    const now = Date.now();
    total = states.length;
    for (const s of states) {
      if (s.interval >= 21) mature++;
      reviewedTotal += s.totalReviews;
      correctTotal += s.totalCorrect;
      if (s.due <= now && s.phase !== 'new') dueToday++;
    }
  });

  $: accuracy = reviewedTotal ? Math.round((correctTotal / reviewedTotal) * 100) : 0;
</script>

<section class="space-y-4">
  <h2 class="text-lg font-semibold">{$t('stats')}</h2>
  <div class="grid grid-cols-2 gap-3">
    <div class="rounded-2xl bg-slate-800 p-5">
      <div class="text-3xl font-bold text-pink-400">{accuracy}%</div>
      <div class="text-xs text-slate-400">{$t('accuracy')}</div>
    </div>
    <div class="rounded-2xl bg-slate-800 p-5">
      <div class="text-3xl font-bold text-indigo-400">{reviewedTotal}</div>
      <div class="text-xs text-slate-400">{$t('reviewsToday')}</div>
    </div>
    <div class="rounded-2xl bg-slate-800 p-5">
      <div class="text-3xl font-bold text-green-400">{mature}</div>
      <div class="text-xs text-slate-400">{$t('mature')}</div>
    </div>
    <div class="rounded-2xl bg-slate-800 p-5">
      <div class="text-3xl font-bold text-amber-400">{total}</div>
      <div class="text-xs text-slate-400">{$t('totalCards')}</div>
    </div>
  </div>
</section>
