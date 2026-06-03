<script lang="ts">
  import { fade } from 'svelte/transition';
  export let onClose: () => void = () => {};
  export let zIndex = 'z-40';
</script>

<div
  class="fixed inset-0 {zIndex} bg-black/40 backdrop-blur-sm"
  transition:fade={{ duration: 150 }}
  on:click={onClose}
  role="presentation"
></div>
