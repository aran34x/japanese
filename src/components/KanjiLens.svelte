<script lang="ts">
  // Global Kanji X-ray lens. When enabled, it detects the character directly
  // under the pointer ANYWHERE on screen (via the browser caret-position APIs)
  // and shows its reading + meaning in a floating popup. Works regardless of
  // which component rendered the text — no per-element wrapping needed.
  import { onMount, onDestroy } from 'svelte';
  import { xrayOn } from '../lib/kanji/xray';
  import { lookupKanji, isKanji, type KanjiInfo } from '../lib/kanji/dict';
  import { settings } from '../lib/stores';

  let visible = false;
  let x = 0;
  let y = 0;
  let ch = '';
  let info: KanjiInfo | null = null;
  let loading = false;

  let raf = 0;
  let lastCh = '';

  // Resolve the character under a screen point using whichever caret API exists.
  function charAtPoint(cx: number, cy: number): string {
    const anyDoc = document as unknown as {
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    };
    let node: Node | null = null;
    let offset = 0;
    if (anyDoc.caretRangeFromPoint) {
      const r = anyDoc.caretRangeFromPoint(cx, cy);
      if (r) {
        node = r.startContainer;
        offset = r.startOffset;
      }
    } else if (anyDoc.caretPositionFromPoint) {
      const p = anyDoc.caretPositionFromPoint(cx, cy);
      if (p) {
        node = p.offsetNode;
        offset = p.offset;
      }
    }
    if (!node || node.nodeType !== Node.TEXT_NODE) return '';
    const data = (node as Text).data;
    // The caret offset sits between characters; check the char at and before it.
    const cand = data[offset] ?? '';
    if (isKanji(cand)) return cand;
    const prev = data[offset - 1] ?? '';
    return isKanji(prev) ? prev : '';
  }

  function onMove(e: PointerEvent | MouseEvent) {
    if (!$xrayOn) return;
    if (raf) cancelAnimationFrame(raf);
    const cx = e.clientX;
    const cy = e.clientY;
    raf = requestAnimationFrame(() => {
      const found = charAtPoint(cx, cy);
      if (!found) {
        if (visible) hide();
        return;
      }
      x = cx;
      y = cy;
      if (found !== lastCh) {
        lastCh = found;
        void reveal(found);
      } else {
        visible = true;
      }
    });
  }

  async function reveal(c: string) {
    ch = c;
    visible = true;
    loading = true;
    info = null;
    const result = await lookupKanji(c);
    if (lastCh === c) {
      info = result;
      loading = false;
    }
  }

  function hide() {
    visible = false;
    lastCh = '';
  }

  function meaningText(k: KanjiInfo | null): string {
    return k ? k.meanings.slice(0, 4).join(', ') : '';
  }

  onMount(() => {
    window.addEventListener('pointermove', onMove, { passive: true });
    // Mobile tap fallback (e.g. tapping text with a finger).
    window.addEventListener('pointerdown', onMove, { passive: true });
    window.addEventListener('scroll', hide, { passive: true });
  });
  onDestroy(() => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onMove);
    window.removeEventListener('scroll', hide);
    if (raf) cancelAnimationFrame(raf);
  });

  // Hide instantly if the lens is switched off.
  $: if (!$xrayOn && visible) hide();

  // Keep the popup on-screen.
  $: left = Math.min(Math.max(x, 90), (typeof window !== 'undefined' ? window.innerWidth : 360) - 90);
  $: top = y;
</script>

{#if $xrayOn && visible && ch}
  <div
    class="pointer-events-none fixed z-[100] w-44 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 p-2 text-left shadow-2xl ring-1 ring-pink-500/50"
    style="left:{left}px; top:{top - 12}px"
  >
    <span class="block font-jp text-2xl leading-none">{ch}</span>
    {#if loading}
      <span class="mt-1 block text-xs text-slate-500">…</span>
    {:else if info}
      {#if info.kun.length}
        <span class="mt-1 block text-xs text-pink-300">訓 {info.kun.slice(0, 3).join('、')}</span>
      {/if}
      {#if info.on.length}
        <span class="block text-xs text-sky-300">音 {info.on.slice(0, 3).join('、')}</span>
      {/if}
      <span class="mt-1 block text-xs text-slate-300">{meaningText(info)}</span>
    {:else}
      <span class="mt-1 block text-xs text-slate-500">—</span>
    {/if}
  </div>
{/if}
