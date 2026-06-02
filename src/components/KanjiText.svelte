<script lang="ts">
  import { xrayOn, xrayFurigana } from '../lib/kanji/xray';
  import { lookupKanji, isKanji, type KanjiInfo } from '../lib/kanji/dict';
  import { settings } from '../lib/stores';

  // Renders Japanese `text`. When X-ray is on, each kanji becomes interactive:
  // hover (desktop) or tap (mobile) shows reading + meaning, with optional
  // furigana written above. Non-kanji characters render as-is.
  export let text: string;
  /** Tailwind text-size class for the base text. */
  export let size = 'text-2xl';

  interface Tok { ch: string; kanji: boolean }
  $: tokens = [...(text ?? '')].map((ch) => ({ ch, kanji: isKanji(ch) }));

  const cache: Record<string, KanjiInfo | null> = {};
  let active: { ch: string; info: KanjiInfo | null; loading: boolean } | null = null;
  // furigana readings keyed by char index, filled lazily when xray+furigana on.
  let furi: Record<number, string> = {};

  // Preload furigana for visible kanji when enabled.
  $: if ($xrayOn && $xrayFurigana) void loadFuri();
  async function loadFuri() {
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!t.kanji || furi[i] !== undefined) continue;
      const info = cache[t.ch] ?? (cache[t.ch] = await lookupKanji(t.ch));
      furi = { ...furi, [i]: info?.primary ?? '' };
    }
  }

  async function show(ch: string) {
    active = { ch, info: cache[ch] ?? null, loading: !(ch in cache) };
    if (!(ch in cache)) {
      const info = await lookupKanji(ch);
      cache[ch] = info;
      if (active?.ch === ch) active = { ch, info, loading: false };
    }
  }
  function hide() {
    active = null;
  }

  function meaningText(info: KanjiInfo | null): string {
    if (!info) return '';
    return info.meanings.slice(0, 3).join(', ');
  }
</script>

<span class="relative inline">
  {#if $xrayOn}
    {#each tokens as t, i}
      {#if t.kanji}
        <span
          class="relative cursor-help rounded transition-colors hover:bg-pink-500/20 {active?.ch === t.ch ? 'bg-pink-500/30' : ''}"
          role="button"
          tabindex="0"
          on:mouseenter={() => show(t.ch)}
          on:mouseleave={hide}
          on:click|stopPropagation={() => (active?.ch === t.ch ? hide() : show(t.ch))}
          on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && show(t.ch)}
        >
          {#if $xrayFurigana && furi[i]}
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

  {#if active}
    <span
      class="absolute left-1/2 top-full z-50 mt-1 w-44 -translate-x-1/2 rounded-xl bg-slate-900 p-2 text-left shadow-xl ring-1 ring-pink-500/40"
      role="tooltip"
    >
      <span class="block font-jp text-2xl">{active.ch}</span>
      {#if active.loading}
        <span class="block text-xs text-slate-500">…</span>
      {:else if active.info}
        {#if active.info.kun.length}
          <span class="block text-xs text-pink-300">訓 {active.info.kun.slice(0, 3).join('、')}</span>
        {/if}
        {#if active.info.on.length}
          <span class="block text-xs text-sky-300">音 {active.info.on.slice(0, 3).join('、')}</span>
        {/if}
        <span class="mt-1 block text-xs text-slate-300">{meaningText(active.info)}</span>
      {:else}
        <span class="block text-xs text-slate-500">—</span>
      {/if}
    </span>
  {/if}
</span>
