<script lang="ts">
  export let label = '3D scene';
  export let size = 96;
  export let perspective = 900;
  export let rotateX = -10;
  export let rotateY = 0;
  export let padding = 0;
  export let className = '';
</script>

<div
  class={`scene-3d ${className}`}
  role="img"
  aria-label={label}
  style={`--scene-size:${size}px;--scene-padding:${padding}px;--scene-perspective:${perspective}px;--scene-rotate-x:${rotateX}deg;--scene-rotate-y:${rotateY}deg`}
>
  <div class="scene-3d__world">
    <slot />
  </div>
</div>

<style>
  .scene-3d {
    width: calc(var(--scene-size) + var(--scene-padding) * 2);
    height: calc(var(--scene-size) + var(--scene-padding) * 2);
    display: grid;
    place-items: center;
    perspective: var(--scene-perspective);
    perspective-origin: 50% 45%;
    overflow: visible;
    contain: layout;
  }

  .scene-3d__world {
    width: var(--scene-size);
    height: var(--scene-size);
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(var(--scene-rotate-x)) rotateY(var(--scene-rotate-y));
  }

  :global(.object-3d),
  :global(.object-3d *) {
    transform-style: preserve-3d;
  }
</style>
