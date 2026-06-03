<script lang="ts">
  import type { GameCharacter } from '../lib/game/characters';
  export let character: GameCharacter;
  export let locked = false;
  export let size = 160;
  export let glow = true;

  let imgFailed = false;
  $: useImage = !locked && !!character.imageUrl && !imgFailed;
</script>

<div
  class="relative grid place-items-center transition-transform"
  style="width:{size}px;height:{size}px"
>
  {#if glow && !locked}
    <div
      class="absolute inset-0 animate-pulse rounded-full blur-2xl"
      style="background:{character.color};opacity:0.25"
    ></div>
  {/if}

  {#if useImage}
    <!-- Wikipedia photo clipped to circle with colour-matched ring -->
    <div
      class="relative z-10 overflow-hidden rounded-full"
      style="width:{size}px;height:{size}px;
             outline:2px solid {character.color}66;
             box-shadow:0 4px 20px {character.color}55"
    >
      <img
        src={character.imageUrl}
        alt={character.name}
        class="h-full w-full object-cover"
        on:error={() => (imgFailed = true)}
      />
    </div>
  {:else}
    <!-- SVG: used for locked silhouette OR as fallback when image fails -->
    <svg
      viewBox="0 0 100 100"
      class="relative z-10 h-full w-full {locked ? 'silhouette' : ''}"
      style={locked ? '' : `filter: drop-shadow(0 4px 12px ${character.color}55)`}
    >
      {@html character.svg}
    </svg>
  {/if}

  {#if locked}
    <div class="absolute z-20 text-3xl font-black text-slate-300/70">?</div>
  {/if}
</div>

<style>
  .silhouette {
    filter: brightness(0) saturate(0);
    opacity: 0.45;
  }
</style>
