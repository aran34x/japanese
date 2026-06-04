<script lang="ts">
  import { fade } from 'svelte/transition';
  export let onClose: () => void = () => {};
</script>

<!-- Full-viewport blur. Portaled to <body> by the caller, so a high z-index
     here sits above the topbar, nav and all page content. -->
<div
  class="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm"
  transition:fade={{ duration: 150 }}
  on:click={onClose}
  role="presentation"
></div>
