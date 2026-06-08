<script lang="ts">
  import { t } from '../lib/stores';
  import Icons from './Icons.svelte';
  import Characters from './Characters.svelte';
  import { fly } from 'svelte/transition';

  type CharSubTab = 'real' | 'fictional';
  let charSub: CharSubTab = 'fictional';
</script>

<div class="flex-1 overflow-y-auto overflow-x-hidden">
  <div class="mx-auto max-w-5xl px-4 py-8">
    <section class="space-y-4" in:fly={{ y: 12, duration: 200 }}>
      <div class="flex gap-2 rounded-xl bg-slate-900/50 p-1">
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all {charSub === 'fictional' ? 'bg-indigo-600 text-current shadow-lg' : 'text-slate-400 hover:bg-slate-800'}"
          on:click={() => charSub = 'fictional'}
        >
          <span class="text-base">🎭</span>
          <span>{$t('fictional')}</span>
        </button>
        <button
          class="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-all {charSub === 'real' ? 'bg-indigo-600 text-current shadow-lg' : 'text-slate-400 hover:bg-slate-800'}"
          on:click={() => charSub = 'real'}
        >
          <span class="text-base">👤</span>
          <span>{$t('realPeople')}</span>
        </button>
      </div>

      {#if charSub === 'fictional'}
        <Characters />
      {:else}
        <Icons />
      {/if}
    </section>
  </div>
</div>
