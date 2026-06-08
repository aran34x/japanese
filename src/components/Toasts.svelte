<script lang="ts">
  import { toasts } from '../lib/game/state';
  import { ACHIEVEMENTS } from '../lib/game/achievements';
  import { settings } from '../lib/stores';
  import { fly } from 'svelte/transition';

  // Achievement toasts carry the achievement id in `title`; resolve to a label.
  function label(t: { kind: string; title: string }) {
    if (t.kind === 'achievement') {
      const a = ACHIEVEMENTS.find((x) => x.id === t.title);
      return a ? `${a.icon} ${a.name[$settings.uiLang]}` : t.title;
    }
    return t.title;
  }
</script>

<div class="pointer-events-none fixed inset-x-0 top-2 z-50 mx-auto flex max-w-md flex-col items-center gap-2 px-4">
  {#each $toasts as t (t.id)}
    <div
      in:fly={{ y: -24, duration: 250 }}
      out:fly={{ y: -24, duration: 200 }}
      class="pointer-events-auto w-full rounded-xl border border-amber-400/40 bg-amber-500/15 px-4 py-2 text-center shadow-lg backdrop-blur"
    >
      <div class="text-sm font-bold text-amber-300">{t.icon ?? ''} {label(t)}</div>
      {#if t.subtitle}<div class="text-xs text-amber-100">{t.subtitle}</div>{/if}
    </div>
  {/each}
</div>
