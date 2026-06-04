<script lang="ts">
  import { getWiki } from '../lib/game/wiki';

  export let title: string;
  export let blurred = false;
  export let fallback = '👤';
  export let rounded = 'rounded-2xl';

  let src: string | undefined;
  let loading = true;
  let failed = false;

  // Re-fetch whenever the title changes.
  let lastTitle = '';
  $: if (title && title !== lastTitle) {
    lastTitle = title;
    load(title);
  }

  async function load(t: string) {
    loading = true;
    failed = false;
    src = undefined;
    const info = await getWiki(t);
    if (info?.image) src = info.image;
    else failed = true;
    loading = false;
  }
</script>

<div class="relative h-full w-full overflow-hidden {rounded} bg-slate-700">
  {#if src}
    <img
      {src}
      alt={title}
      loading="lazy"
      class="h-full w-full object-cover transition-all duration-500 {blurred
        ? 'scale-150 blur-[40px] grayscale brightness-50'
        : ''}"
    />
  {:else}
    <div class="grid h-full w-full place-items-center text-3xl text-slate-400">
      {loading ? '⏳' : fallback}
    </div>
  {/if}
  {#if blurred}
    <div class="absolute inset-0 grid place-items-center">
      <span class="text-2xl drop-shadow-lg">🔒</span>
    </div>
  {/if}
</div>
