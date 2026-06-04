<script lang="ts">
  import { t, settings } from '../lib/stores';
  import { translate } from '../lib/i18n';
  import type { Lang } from '../lib/types';
  import { APP_VERSION } from '../lib/version';
  import { resetAllProgress } from '../lib/game/state';
  import CloudSync from './CloudSync.svelte';

  let confirmReset = false;
  let resetMsg = '';
  async function doReset() {
    await resetAllProgress();
    confirmReset = false;
    resetMsg = translate('progressReset', $settings.uiLang);
  }

  const langOptions: { code: Lang; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'it', label: 'Italiano' }
  ];

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

  const kanjiSizes: { value: number; label: string }[] = [
    { value: 1.0, label: 'S' },
    { value: 1.15, label: 'M' },
    { value: 1.3, label: 'L' },
    { value: 1.6, label: 'XL' }
  ];
  function setKanjiScale(v: number) {
    settings.update((s) => ({ ...s, xrayKanjiScale: v }));
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
    <div class="mb-1 text-sm font-medium">🔍 {$t('xrayKanjiSize')}</div>
    <p class="mb-2 text-xs text-slate-400">{$t('xrayKanjiSizeDesc')}</p>
    <div class="flex gap-2">
      {#each kanjiSizes as opt}
        <button
          class="flex-1 rounded-lg py-2 text-sm font-semibold {($settings.xrayKanjiScale ?? 1.6) === opt.value ? 'bg-indigo-500 text-white' : 'bg-slate-700'}"
          on:click={() => setKanjiScale(opt.value)}>{opt.label}</button>
      {/each}
    </div>
  </div>

  <CloudSync />

  <div class="rounded-2xl border border-rose-900/40 bg-slate-800 p-4">
    <div class="mb-1 text-sm font-medium text-rose-300">{$t('dangerZone')}</div>
    <p class="mb-3 text-xs text-slate-400">{$t('dangerZoneDesc')}</p>
    {#if !confirmReset}
      <button class="w-full rounded-lg bg-rose-900/50 py-2 text-sm font-semibold text-rose-200" on:click={() => (confirmReset = true)}>
        ↺ {$t('resetProgress')}
      </button>
    {:else}
      <div class="flex gap-2">
        <button class="flex-1 rounded-lg bg-rose-600 py-2 text-sm font-bold text-white" on:click={doReset}>
          {$t('resetConfirm')}
        </button>
        <button class="flex-1 rounded-lg bg-slate-700 py-2 text-sm font-semibold" on:click={() => (confirmReset = false)}>
          {$t('cancel')}
        </button>
      </div>
    {/if}
    {#if resetMsg}<div class="mt-2 text-center text-xs text-pink-300">{resetMsg}</div>{/if}
  </div>

  <div class="pt-2 text-center text-xs text-slate-600">Nihongo Quest · v{APP_VERSION}</div>
</section>
