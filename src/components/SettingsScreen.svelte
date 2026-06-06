<script lang="ts">
  import { t, settings } from '../lib/stores';
  import { translate } from '../lib/i18n';
  import type { AppSkin, Lang } from '../lib/types';
  import { APP_VERSION } from '../lib/version';
  import { resetAllProgress, resetProgressSection, type ProgressSection } from '../lib/game/state';
  import { DEFAULT_XRAY_KANJI_SIZE_MULTIPLIER, XRAY_KANJI_SIZE_PRESETS } from '../lib/xray-size-presets';
  import CloudSync from './CloudSync.svelte';

  let confirmReset = false;
  let confirmSection: ProgressSection | '' = '';
  let resetMsg = '';
  async function doReset() {
    await resetAllProgress();
    confirmReset = false;
    resetMsg = translate('progressReset', $settings.uiLang);
  }

  async function doSectionReset(section: ProgressSection) {
    await resetProgressSection(section);
    confirmSection = '';
    resetMsg = translate('sectionResetDone', $settings.uiLang);
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

  function setKanjiScale(v: number) {
    settings.update((s) => ({ ...s, xrayKanjiScale: v }));
  }

  const skinOptions: { id: AppSkin; title: string; desc: string; swatches: string[] }[] = [
    { id: 'default', title: 'skinDefault', desc: 'skinDefaultDesc', swatches: ['#0f172a', '#6366f1', '#ec4899'] },
    { id: 'smash64', title: 'skinSmash64', desc: 'skinSmash64Desc', swatches: ['#0b1f5e', '#e11d2e', '#facc15'] },
    { id: 'sakura', title: 'skinSakura', desc: 'skinSakuraDesc', swatches: ['#4a102a', '#f9a8d4', '#fde68a'] },
    { id: 'station', title: 'skinStation', desc: 'skinStationDesc', swatches: ['#111827', '#f97316', '#38bdf8'] },
    { id: 'nature', title: 'skinNature', desc: 'skinNatureDesc', swatches: ['#052e16', '#22c55e', '#fbbf24'] },
    { id: 'comet', title: 'skinComet', desc: 'skinCometDesc', swatches: ['#0b1030', '#22d3ee', '#a78bfa'] }
  ];
  function setSkin(skin: AppSkin) {
    settings.update((s) => ({ ...s, skin }));
  }

  const resetSections: { id: ProgressSection; title: string; desc: string }[] = [
    { id: 'challenges', title: 'resetChallengesOnly', desc: 'resetChallengesOnlyDesc' },
    { id: 'stories', title: 'resetStoriesOnly', desc: 'resetStoriesOnlyDesc' },
    { id: 'achievements', title: 'resetAchievementsOnly', desc: 'resetAchievementsOnlyDesc' },
    { id: 'adventure', title: 'resetAdventure', desc: 'resetAdventureDesc' },
    { id: 'srs', title: 'resetSrs', desc: 'resetSrsDesc' }
  ];
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

  <div class="rounded-2xl bg-slate-800 p-4">
    <div class="mb-2 text-sm font-medium">{$t('skins')}</div>
    <div class="grid gap-2 sm:grid-cols-2">
      {#each skinOptions as opt}
        <button
          class="rounded-xl border p-3 text-left transition-colors {$settings.skin === opt.id
            ? 'border-indigo-400 bg-indigo-500/20'
            : 'border-slate-700 bg-slate-900/60'}"
          on:click={() => setSkin(opt.id)}
        >
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-semibold text-slate-100">{$t(opt.title)}</span>
            <span class="flex shrink-0 gap-1">
              {#each opt.swatches as color}
                <span class="h-4 w-4 rounded-full border border-white/30" style={`background:${color}`}></span>
              {/each}
            </span>
          </div>
          <div class="mt-1 text-xs text-slate-400">{$t(opt.desc)}</div>
        </button>
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
    <div class="flex-1 pr-4">
      <div class="text-sm font-medium">{$t('showLessonAlways')}</div>
      <div class="text-[10px] text-slate-400">{$t('showLessonAlwaysDesc')}</div>
    </div>
    <input type="checkbox" bind:checked={$settings.showLessonAlways} class="h-5 w-5 accent-pink-500" />
  </label>

  <label class="flex items-center justify-between rounded-2xl bg-slate-800 p-4">
    <span class="text-sm font-medium">{$t('autoAudio')}</span>
    <input type="checkbox" bind:checked={$settings.autoAudio} class="h-5 w-5 accent-pink-500" />
  </label>

  <div class="rounded-2xl bg-slate-800 p-4">
    <div class="mb-1 text-sm font-medium">🔍 {$t('xrayKanjiSize')}</div>
    <p class="mb-2 text-xs text-slate-400">{$t('xrayKanjiSizeDesc')}</p>
    <div class="flex gap-2">
      {#each XRAY_KANJI_SIZE_PRESETS as opt}
        <button
          class="flex-1 rounded-lg py-2 text-sm font-semibold {($settings.xrayKanjiScale ?? DEFAULT_XRAY_KANJI_SIZE_MULTIPLIER) === opt.multiplier ? 'bg-indigo-500 text-white' : 'bg-slate-700'}"
          title={`${opt.name} (${opt.multiplier}x)`}
          on:click={() => setKanjiScale(opt.multiplier)}
        >
          <span class="block">{opt.shortName}</span>
          <span class="block text-[10px] opacity-75">{opt.multiplier}x</span>
        </button>
      {/each}
    </div>
  </div>

  <CloudSync />

  <div class="rounded-2xl border border-rose-900/40 bg-slate-800 p-4">
    <div class="mb-1 text-sm font-medium text-rose-300">{$t('dangerZone')}</div>
    <div class="rounded-xl bg-slate-900/60 p-3">
      <div class="text-sm font-semibold text-slate-200">{$t('selectiveReset')}</div>
      <p class="mt-1 text-xs text-slate-400">{$t('selectiveResetDesc')}</p>
      <div class="mt-3 space-y-2">
        {#each resetSections as item}
          <div class="rounded-lg bg-slate-800/80 p-3">
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <div class="text-sm font-semibold text-slate-100">{$t(item.title)}</div>
                <div class="mt-0.5 text-xs text-slate-400">{$t(item.desc)}</div>
              </div>
              {#if confirmSection === item.id}
                <div class="flex shrink-0 gap-1">
                  <button
                    class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white"
                    on:click={() => doSectionReset(item.id)}
                  >
                    {$t('resetSectionConfirm')}
                  </button>
                  <button
                    class="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold"
                    on:click={() => (confirmSection = '')}
                  >
                    {$t('cancel')}
                  </button>
                </div>
              {:else}
                <button
                  class="shrink-0 rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
                  on:click={() => (confirmSection = item.id)}
                >
                  {$t('resetSectionAction')}
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <p class="mb-3 mt-4 text-xs text-slate-400">{$t('dangerZoneDesc')}</p>
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
