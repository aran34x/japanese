<script lang="ts">
  import type { FictionalChar } from '../lib/data/game/fictional';
  import { getFandomImage } from '../lib/game/fandom-image';

  export let character: FictionalChar;
  export let rounded = 'rounded-xl';
  export let className = 'h-full w-full';

  let src = '';
  let failed = false;
  let lastId = '';
  let triedSource = false;

  $: if (character?.id && character.id !== lastId) {
    lastId = character.id;
    load(character);
  }

  async function load(ch: FictionalChar) {
    src = ch.imageUrl ?? '';
    failed = false;
    triedSource = false;
    if (src || !ch.imageSource) return;
    await loadFromSource(ch);
  }

  async function loadFromSource(ch: FictionalChar) {
    if (!ch.imageSource || triedSource) {
      failed = true;
      return;
    }
    triedSource = true;
    const info = await getFandomImage(ch.imageSource);
    if (info?.image) src = info.image;
    else failed = true;
  }
</script>

<div class="grid overflow-hidden bg-slate-800 {rounded} {className}" style={`background:${character.color}22`}>
  {#if src}
    <img
      src={src}
      alt={character.name}
      class="h-full w-full object-cover"
      loading="lazy"
      on:error={() => loadFromSource(character)}
    />
  {:else}
    <div class="grid h-full w-full place-items-center text-3xl text-slate-400">
      {failed ? character.emoji : '...'}
    </div>
  {/if}
</div>
