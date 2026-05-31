<script lang="ts">
  import { t } from '../lib/stores';
  import { importFile, type ImportResult } from '../lib/anki/import';

  let importing = false;
  let result: ImportResult | null = null;
  let error = '';

  async function onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    importing = true;
    error = '';
    result = null;
    try {
      result = await importFile(file);
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    } finally {
      importing = false;
      input.value = '';
    }
  }
</script>

<section class="space-y-4">
  <h2 class="text-lg font-semibold">{$t('importTitle')}</h2>
  <p class="text-sm text-slate-400">{$t('importCsvHelp')}</p>

  <label class="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-600 p-8 text-center active:scale-[0.99]">
    <input type="file" accept=".apkg,.csv,.txt,.tsv" class="hidden" on:change={onFile} />
    <div class="text-4xl">⬆</div>
    <div class="mt-2 font-medium">{importing ? $t('importing') : $t('importBtn')}</div>
    <div class="mt-1 text-xs text-slate-500">.apkg · .csv · .txt</div>
  </label>

  {#if result}
    <div class="rounded-xl bg-green-900/40 p-4 text-center text-green-300">
      ✓ {$t('imported')}: {result.cardsAdded} {$t('cards')}
      {#if result.mediaAdded}· {result.mediaAdded} media{/if}
    </div>
  {/if}
  {#if error}
    <div class="rounded-xl bg-rose-900/40 p-4 text-center text-rose-300 text-sm">{error}</div>
  {/if}

  <div class="rounded-2xl bg-slate-800 p-4 text-sm text-slate-400">
    <div class="mb-1 font-medium text-slate-300">CSV format</div>
    <code class="block whitespace-pre rounded bg-slate-900 p-2 text-xs">front,reading,meaning,tags
猫,ねこ,cat / gatto,animals
犬,いぬ,dog / cane,animals</code>
  </div>
</section>
