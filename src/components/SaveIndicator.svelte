<script lang="ts">
  import { saveState } from '../lib/saveStatus';
  import { fade } from 'svelte/transition';
</script>

{#if $saveState !== 'idle'}
  <span class="flex items-center gap-1 text-xs text-slate-400" transition:fade={{ duration: 150 }} title="Autosaved">
    {#if $saveState === 'saving'}
      <svg class="h-3.5 w-3.5 animate-spin text-slate-400" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" opacity="0.25" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      </svg>
    {:else}
      <svg class="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    {/if}
  </span>
{/if}
