<script lang="ts">
  import { route, navigate, t } from '../lib/stores';
  import { UI } from '../lib/ui-config';
  const items = [
    { id: 'home', icon: '🏠', key: 'home' },
    { id: 'study', icon: '📚', key: 'study' },
    { id: 'adventure', icon: '⚔️', key: 'adventure' },
    { id: 'stories', icon: '📖', key: 'stories' }
  ];
</script>

<nav class="z-50 shrink-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
  <div class="mx-auto grid max-w-5xl grid-cols-4">
    {#each items as item}
      <button
        class="flex flex-col items-center gap-0.5 {UI.navItemPad} text-xs transition-colors {$route === item.id
          ? 'text-pink-400'
          : 'text-slate-400'}"
        on:click={() => navigate(item.id)}
      >
        <span class="text-xl">{item.icon}</span>
        <span>{$t(item.key)}</span>
      </button>
    {/each}
  </div>
</nav>
