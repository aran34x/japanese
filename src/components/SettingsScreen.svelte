<script lang="ts">
  import { t, settings } from '../lib/stores';
  import type { Lang } from '../lib/types';
  import { exportBackup, downloadBackup, importBackup } from '../lib/backup';
  import { APP_VERSION } from '../lib/version';

  const langOptions: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' }
  ];

  let busy = false;
  let backupMsg = '';

  async function doExport() {
    busy = true;
    backupMsg = '';
    try {
      downloadBackup(await exportBackup());
      backupMsg = $settings.uiLang === 'it' ? 'Backup salvato.' : 'Backup saved.';
    } catch (e) {
      backupMsg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
    }
  }

  async function doImport(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    busy = true;
    backupMsg = '';
    try {
      const r = await importBackup(file);
      backupMsg =
        ($settings.uiLang === 'it' ? 'Ripristinato: ' : 'Restored: ') + `${r.cards} cards`;
      setTimeout(() => location.reload(), 900);
    } catch (e) {
      backupMsg = e instanceof Error ? e.message : String(e);
    } finally {
      busy = false;
      input.value = '';
    }
  }

  function setUiLang(lang: Lang) {
    settings.update((s) => ({ ...s, uiLang: lang }));
  }

  function toggleMeaning(lang: Lang) {
    settings.update((s) => {
      const set = new Set(s.meaningLangs);
      set.has(lang) ? set.delete(lang) : set.add(lang);
      if (set.size === 0) set.add('en');
      return { ...s, meaningLangs: [...set] };
    });
  }
</script>

<section class="space-y-5">
  <h2 class="text-lg font-semibold">{$t('settings')}</h2>

  <div class="rounded-2xl bg-slate-800 p-4">
    <div class="mb-2 text-sm font-medium">{$t('uiLanguage')}</div>
    <div class="flex gap-2">
      {#each langOptions as opt}
        <button
          class="flex-1 rounded-lg py-2 text-sm {$settings.uiLang === opt.code ? 'bg-indigo-500' : 'bg-slate-700'}"
          on:click={() => setUiLang(opt.code)}>{opt.label}</button>
      {/each}
    </div>
  </div>

  <div class="rounded-2xl bg-slate-800 p-4">
    <div class="mb-2 text-sm font-medium">{$t('meaningLanguages')}</div>
    <div class="flex gap-2">
      {#each langOptions as opt}
        <button
          class="flex-1 rounded-lg py-2 text-sm {$settings.meaningLangs.includes(opt.code) ? 'bg-pink-500' : 'bg-slate-700'}"
          on:click={() => toggleMeaning(opt.code)}>{opt.label}</button>
      {/each}
    </div>
  </div>

  <div class="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
    <span class="text-sm font-medium">{$t('newPerDay')}</span>
    <input type="number" min="0" max="200" bind:value={$settings.newPerDay}
      class="w-20 rounded-lg bg-slate-700 px-3 py-1 text-right" />
  </div>

  <label class="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
    <span class="text-sm font-medium">{$t('showRomaji')}</span>
    <input type="checkbox" bind:checked={$settings.showRomaji} class="h-5 w-5 accent-pink-500" />
  </label>

  <label class="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
    <span class="text-sm font-medium">{$t('autoAudio')}</span>
    <input type="checkbox" bind:checked={$settings.autoAudio} class="h-5 w-5 accent-pink-500" />
  </label>

  <div class="rounded-2xl bg-slate-800 p-4">
    <div class="mb-1 text-sm font-medium">
      {$settings.uiLang === 'it' ? 'Salvataggio e backup' : 'Save & backup'}
    </div>
    <p class="mb-3 text-xs text-slate-400">
      {$settings.uiLang === 'it'
        ? 'I progressi sono salvati su questo dispositivo. Esporta un file di backup per spostarli su un altro dispositivo (anche tramite il tuo cloud).'
        : 'Your progress is saved on this device. Export a backup file to move it to another device (e.g. via your own cloud drive).'}
    </p>
    <div class="flex gap-2">
      <button class="flex-1 rounded-lg bg-indigo-500 py-2 text-sm font-semibold disabled:opacity-50" disabled={busy} on:click={doExport}>
        ⬇ {$settings.uiLang === 'it' ? 'Esporta' : 'Export'}
      </button>
      <label class="flex-1 cursor-pointer rounded-lg bg-slate-700 py-2 text-center text-sm font-semibold">
        ⬆ {$settings.uiLang === 'it' ? 'Importa' : 'Import'}
        <input type="file" accept="application/json,.json" class="hidden" on:change={doImport} />
      </label>
    </div>
    {#if backupMsg}<div class="mt-2 text-center text-xs text-pink-300">{backupMsg}</div>{/if}
  </div>

  <div class="pt-2 text-center text-xs text-slate-600">Nihongo Quest · v{APP_VERSION}</div>
</section>
