<script lang="ts">
  import { settings } from '../lib/stores';
  import { game } from '../lib/game/state';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import { fly } from 'svelte/transition';

  function onImgError(e: Event) {
    const img = e.currentTarget as HTMLImageElement;
    img.style.display = 'none';
    const fallback = img.nextElementSibling as HTMLElement | null;
    if (fallback) fallback.style.display = 'grid';
  }
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-5xl px-4 py-8">
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
  </div>
</div>
