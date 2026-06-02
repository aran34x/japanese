<script lang="ts">
  import { settings } from '../lib/stores';
  import { lookupKanji, isKanji, type KanjiInfo } from '../lib/kanji/dict';
  import { fly, fade } from 'svelte/transition';

  export let open = false;
  export let onClose: () => void;

  const it = () => $settings.uiLang === 'it';
  let items: { ch: string; info: KanjiInfo | null }[] = [];
  let loading = false;

  // Scan every kanji currently rendered inside the app and look each up.
  async function scan() {
    loading = true;
    const root = document.getElementById('app');
    const found = new Set<string>();
    if (root) {
      for (const ch of root.textContent ?? '') if (isKanji(ch)) found.add(ch);
    }
    const list = [...found];
    items = list.map((ch) => ({ ch, info: null }));
    await Promise.all(
      list.map(async (ch, i) => {
        const info = await lookupKanji(ch);
        items[i] = { ch, info };
        items = [...items];
      })
    );
    loading = false;
  }

  $: if (open) void scan();
</script>

{#if open}
  <div class="fixed inset-0 z-[90] bg-black/50" transition:fade={{ duration: 150 }} on:click={onClose} role="presentation"></div>
  <div
    class="fixed inset-x-0 bottom-0 z-[91] mx-auto max-h-[70vh] max-w-2xl overflow-y-auto rounded-t-3xl bg-slate-900 p-4 shadow-2xl lg:max-w-5xl"
    transition:fly={{ y: 300, duration: 250 }}
  >
    <div class="mb-3 flex items-center justify-between">
      <h3 class="text-lg font-bold">漢 {it() ? 'Kanji sullo schermo' : 'Kanji on screen'}</h3>
      <button class="rounded-full bg-slate-800 px-3 py-1 text-sm" on:click={onClose}>✕</button>
    </div>

    {#if items.length === 0}
      <p class="py-6 text-center text-sm text-slate-400">
        {loading ? '…' : it() ? 'Nessun kanji sullo schermo.' : 'No kanji on screen.'}
      </p>
    {:else}
      <div class="grid gap-2 sm:grid-cols-2">
        {#each items as item}
          <div class="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
            <span class="font-jp text-3xl leading-none">{item.ch}</span>
            <div class="min-w-0 flex-1">
              {#if item.info}
                <div class="flex flex-wrap gap-x-2 text-xs">
                  {#if item.info.kun.length}<span class="text-pink-300">訓 {item.info.kun.slice(0, 2).join('、')}</span>{/if}
                  {#if item.info.on.length}<span class="text-sky-300">音 {item.info.on.slice(0, 2).join('、')}</span>{/if}
                </div>
                <div class="truncate text-sm text-slate-200">{item.info.meanings.slice(0, 4).join(', ')}</div>
              {:else}
                <div class="text-xs text-slate-500">…</div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
