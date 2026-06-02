<script lang="ts">
  import { lookupKanji, isKanji, type KanjiInfo } from '../lib/kanji/dict';

  // Lists every unique kanji in `text` with its reading + meaning, shown as a
  // panel BESIDE the text (not above each character). Toggled by `open`.
  export let text: string;
  export let open = false;

  $: uniqueKanji = [...new Set([...(text ?? '')].filter(isKanji))];
  let infos: Record<string, KanjiInfo | null> = {};

  $: if (open) void load();
  async function load() {
    for (const k of uniqueKanji) {
      if (k in infos) continue;
      infos = { ...infos, [k]: await lookupKanji(k) };
    }
  }
</script>

{#if open && uniqueKanji.length}
  <div class="mt-2 space-y-1 rounded-xl bg-slate-900/70 p-2">
    {#each uniqueKanji as k}
      <div class="flex items-center gap-2 text-sm">
        <span class="font-jp text-lg">{k}</span>
        {#if infos[k]}
          {#if infos[k]?.primary}<span class="text-pink-300">{infos[k]?.primary}</span>{/if}
          <span class="ml-auto truncate text-slate-300">{infos[k]?.meanings.slice(0, 3).join(', ')}</span>
        {:else if k in infos}
          <span class="ml-auto text-slate-500">—</span>
        {:else}
          <span class="ml-auto text-slate-500">…</span>
        {/if}
      </div>
    {/each}
  </div>
{/if}
