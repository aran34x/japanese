<script lang="ts">
  import { xrayOn, xrayFurigana } from '../lib/kanji/xray';
  import { lookupKanji, isKanji, type KanjiInfo } from '../lib/kanji/dict';

  // Renders Japanese `text`, drawing furigana above each kanji when X-ray +
  // furigana are on. Interactive reading/meaning popups are handled globally by
  // KanjiLens, so this component only adds the reading hint above each kanji.
  export let text: string;
  /** Tailwind text-size class for the base text. */
  export let size = 'text-2xl';

  interface Tok { ch: string; kanji: boolean }
  $: tokens = [...(text ?? '')].map((ch) => ({ ch, kanji: isKanji(ch) }));

  const cache: Record<string, KanjiInfo | null> = {};
  // furigana readings keyed by char index, filled lazily when xray+furigana on.
  let furi: Record<number, string> = {};

  $: if ($xrayOn && $xrayFurigana) void loadFuri();
  async function loadFuri() {
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!t.kanji || furi[i] !== undefined) continue;
      const info = cache[t.ch] ?? (cache[t.ch] = await lookupKanji(t.ch));
      furi = { ...furi, [i]: info?.primary ?? '' };
    }
  }
</script>

<span class="relative inline">
  {#if $xrayOn && $xrayFurigana}
    {#each tokens as t, i}
      {#if t.kanji}
        <span class="relative">
          {#if furi[i]}
            <span class="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.4em] leading-none text-pink-300">{furi[i]}</span>
          {/if}<span class={size}>{t.ch}</span>
        </span>
      {:else}
        <span class={size}>{t.ch}</span>
      {/if}
    {/each}
  {:else}
    <span class={size}>{text}</span>
  {/if}
</span>
