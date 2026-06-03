<script lang="ts">
  import { fade } from 'svelte/transition';
  export let onClose: () => void = () => {};
</script>

<!-- z-[199]: above topbar (z-50) and nav — full-app blur -->
<!-- Dropdown must use z-[200]+ to sit on top -->
<div
  class="fixed inset-0 z-[199] bg-black/40 backdrop-blur-sm"
  transition:fade={{ duration: 150 }}
  on:click={onClose}
  role="presentation"
></div>
