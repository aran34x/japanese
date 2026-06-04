<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { portal } from '../lib/portal';
  import { t } from '../lib/stores';

  export let onClose: () => void;
</script>

<!-- Portaled to <body> so it overlays the whole app; the page underneath stays
     mounted and is restored on Back. -->
<div use:portal>
  <div
    class="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm"
    transition:fade={{ duration: 150 }}
    on:click={onClose}
    role="presentation"
  ></div>
  <div class="fixed inset-0 z-[201] flex flex-col" transition:fly={{ y: 24, duration: 220 }}>
    <div class="mx-auto flex h-full w-full max-w-2xl flex-col lg:max-w-3xl">
      <div class="flex items-center px-4 py-3">
        <button
          class="flex items-center gap-1 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium shadow-lg active:scale-95"
          on:click={onClose}
        >← {$t('back')}</button>
      </div>
      <div class="flex-1 overflow-y-auto rounded-t-3xl bg-slate-900 px-4 pb-12 pt-4 shadow-2xl">
        <slot />
      </div>
    </div>
  </div>
</div>
