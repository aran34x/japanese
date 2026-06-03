<script lang="ts">
  import { onMount } from 'svelte';
  import { settings, t } from '../lib/stores';
  import { db } from '../lib/db';
  import { CHANGELOG, APP_VERSION } from '../lib/version';
  import { fly, fade } from 'svelte/transition';

  let show = false;
  let entries = CHANGELOG;

  onMount(async () => {
    const row = await db.meta.get('lastSeenVersion');
    const lastSeen = (row?.value as string) ?? '';
    if (lastSeen !== APP_VERSION) {
      // Show only entries newer than what they last saw (or all on first run).
      entries = lastSeen
        ? CHANGELOG.filter((c) => cmp(c.version, lastSeen) > 0)
        : CHANGELOG.slice(0, 1);
      if (entries.length) show = true;
    }
  });

  // Simple semver compare.
  function cmp(a: string, b: string): number {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
      if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
    }
    return 0;
  }

  async function dismiss() {
    show = false;
    await db.meta.put({ key: 'lastSeenVersion', value: APP_VERSION });
  }
</script>

{#if show}
  <div class="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4" transition:fade={{ duration: 150 }} on:click|self={dismiss} role="presentation">
    <div class="w-full max-w-sm rounded-3xl bg-slate-900 p-5 shadow-2xl ring-1 ring-slate-700" in:fly={{ y: 24, duration: 250 }}>
      <div class="mb-1 text-center text-3xl">🎉</div>
      <div class="text-center text-lg font-bold">
        {$t('whatsNew')}
        <span class="text-sm font-normal text-slate-500">v{APP_VERSION}</span>
      </div>

      <div class="mt-4 max-h-[50vh] space-y-4 overflow-y-auto">
        {#each entries as e}
          <div>
            <div class="text-sm font-semibold text-pink-300">{e.title[$settings.uiLang]}</div>
            <ul class="mt-1 space-y-1">
              {#each e.changes as ch}
                <li class="flex gap-2 text-sm text-slate-300">
                  <span class="text-pink-400">›</span><span>{ch[$settings.uiLang]}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>

      <button class="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 font-bold active:scale-[0.98]" on:click={dismiss}>
        {$t('gotIt')}
      </button>
    </div>
  </div>
{/if}
