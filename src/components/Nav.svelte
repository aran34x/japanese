<script lang="ts">
  import { route, navigate, t } from '../lib/stores';
  const items = [
    { id: 'home', icon: '🏠', key: 'home' },
    { id: 'adventure', icon: '⚔️', key: 'adventure' },
    { id: 'study', icon: '🎯', key: 'study' },
    { id: 'stories', icon: '📖', key: 'stories' },
    { id: 'decks', icon: '🗂️', key: 'decks' },
    { id: 'stats', icon: '📊', key: 'stats' },
    { id: 'settings', icon: '⚙️', key: 'settings' }
  ];
</script>

<nav class="fixed inset-x-0 bottom-0 mx-auto max-w-2xl border-t border-slate-800 bg-slate-900/95 backdrop-blur lg:max-w-5xl">
  <div class="grid grid-cols-7">
    {#each items as item}
      <button
        class="flex flex-col items-center gap-0.5 py-2 text-xs transition-colors {$route === item.id
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
