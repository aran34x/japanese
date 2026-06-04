<script lang="ts">
  import { onMount } from 'svelte';
  import {
    BackSide,
    CanvasTexture,
    CircleGeometry,
    CylinderGeometry,
    Group,
    Mesh,
    MeshPhysicalMaterial,
    SRGBColorSpace,
    Texture,
    TextureLoader,
  } from 'three';
  import type { GameCharacter } from '../lib/game/characters';
  import { createThreeStage } from '../lib/three/stage';

  export let character: GameCharacter;
  export let level = 1;
  export let size = 92;
  export let interactive = true;
  export let autoSpin = true;
  export let showImage = true;

  const textureWidth = 1200;
  const autoSpinDelayMs = 5000;

  let viewport: HTMLDivElement;
  let faceImage: HTMLImageElement;
  let mounted = false;
  let textureLoaded = false;
  let addSpinImpulse = (_axis: 'x' | 'y' = 'y', _direction = 1, _strength = 1) => {};

  function highResolutionTexture(url?: string) {
    if (!url) return undefined;
    if (url.includes('width=')) return url.replace(/width=\d+/, `width=${textureWidth}`);
    return `${url}${url.includes('?') ? '&' : '?'}width=${textureWidth}`;
  }

  function hexToRgb(hex: string) {
    const normalized = hex.replace('#', '');
    const value = Number.parseInt(normalized.length === 3
      ? normalized.split('').map((x) => x + x).join('')
      : normalized, 16);

    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function mixColor(hex: string, target: '#ffffff' | '#000000', amount: number) {
    const base = hexToRgb(hex);
    const to = target === '#ffffff' ? 255 : 0;
    const mix = (channel: number) => Math.round(channel + (to - channel) * amount);
    return `rgb(${mix(base.r)}, ${mix(base.g)}, ${mix(base.b)})`;
  }

  $: coinLight = mixColor(character.color, '#ffffff', 0.72);
  $: coinMid = mixColor(character.color, '#ffffff', 0.28);
  $: coinDark = mixColor(character.color, '#000000', 0.38);
  $: coinDeep = mixColor(character.color, '#000000', 0.66);

  function makeLevelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new CanvasTexture(canvas);

    const gradient = ctx.createRadialGradient(330, 230, 30, 512, 512, 520);
    gradient.addColorStop(0, coinLight);
    gradient.addColorStop(0.42, coinMid);
    gradient.addColorStop(0.72, coinDark);
    gradient.addColorStop(1, coinDeep);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.36)';
    ctx.lineWidth = 36;
    ctx.beginPath();
    ctx.arc(512, 512, 410, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function makeCharacterFallbackTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new CanvasTexture(canvas);

    const gradient = ctx.createRadialGradient(330, 230, 30, 512, 512, 520);
    gradient.addColorStop(0, coinLight);
    gradient.addColorStop(0.38, coinMid);
    gradient.addColorStop(0.72, coinDark);
    gradient.addColorStop(1, coinDeep);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = character.color;
    ctx.globalAlpha = 0.28;
    ctx.beginPath();
    ctx.arc(512, 512, 380, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.4)';
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(512, 512, 410, 0, Math.PI * 2);
    ctx.stroke();

    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }

  function loadImageTexture(url: string, onLoad: (texture: Texture) => void, onError: () => void) {
    const loader = new TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = 12;
        texture.center.set(0.5, 0.5);
        texture.repeat.set(1, 1);
        onLoad(texture);
      },
      undefined,
      onError
    );
  }

  onMount(() => {
    mounted = true;
    const stage = createThreeStage(viewport);
    const radius = 1.18;
    const depth = 0.2;
    const coin = new Group();
    const fallbackFrontTexture = makeCharacterFallbackTexture();
    const backTexture = makeLevelTexture();
    let activeFrontTexture: Texture = fallbackFrontTexture;

    stage.camera.position.set(0, 0, 5.2);
    stage.camera.lookAt(0, 0, 0);

    const edgeMaterial = new MeshPhysicalMaterial({
      color: character.color,
      metalness: 0.78,
      roughness: 0.24,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18
    });

    const frontMaterial = new MeshPhysicalMaterial({
      map: fallbackFrontTexture,
      color: coinLight,
      metalness: 0.12,
      roughness: 0.34,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2
    });

    const backMaterial = new MeshPhysicalMaterial({
      map: backTexture,
      metalness: 0.25,
      roughness: 0.28,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18
    });

    const geometry = new CylinderGeometry(radius, radius, depth, 128, 1, true);
    const cylinder = new Mesh(geometry, edgeMaterial);
    cylinder.rotation.x = Math.PI / 2;
    coin.add(cylinder);

    const faceGeometry = new CircleGeometry(radius * 1.02, 128);
    const frontFace = new Mesh(faceGeometry, frontMaterial);
    frontFace.position.z = depth / 2 + 0.006;
    coin.add(frontFace);

    const backFace = new Mesh(faceGeometry.clone(), backMaterial);
    backFace.rotation.y = Math.PI;
    backFace.position.z = -depth / 2 - 0.006;
    coin.add(backFace);

    const sideGlow = new Mesh(
      new CylinderGeometry(radius * 1.01, radius * 1.01, depth * 1.04, 128, 1, true),
      new MeshPhysicalMaterial({
        color: character.color,
        transparent: true,
        opacity: 0.18,
        side: BackSide,
        metalness: 0,
        roughness: 0.5
      })
    );
    sideGlow.rotation.x = Math.PI / 2;
    coin.add(sideGlow);

    stage.scene.add(coin);

    const textureUrl = showImage ? highResolutionTexture(character.imageUrl) : undefined;
    if (textureUrl) {
      loadImageTexture(textureUrl, (texture) => {
        if (!mounted) {
          texture.dispose();
          return;
        }
        activeFrontTexture = texture;
        frontMaterial.map = texture;
        frontMaterial.color.set(0xffffff);
        frontMaterial.needsUpdate = true;
        textureLoaded = true;
      }, () => {
        textureLoaded = false;
      });
    }

    const resizeObserver = new ResizeObserver(stage.resize);
    resizeObserver.observe(viewport);

    let frame = 0;
    let start = performance.now();
    let lastFrameAt = start;
    let angleX = 0;
    let angleY = 0;
    let angularVelocityX = 0;
    let angularVelocityY = 0;
    let lastImpulseAt = start;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let pointerInside = false;

    addSpinImpulse = (axis = 'y', direction = 1, strength = 1) => {
      const now = performance.now();
      if (axis === 'x') {
        angularVelocityX += direction * strength * 6.5;
        angularVelocityX = Math.max(-14, Math.min(14, angularVelocityX));
      } else {
        angularVelocityY += direction * strength * 6.5;
        angularVelocityY = Math.max(-14, Math.min(14, angularVelocityY));
      }
      lastImpulseAt = now;
    };

    function handleWindowPointerMove(event: PointerEvent) {
      if (!pointerInside) return;
      const dx = lastPointerX ? event.clientX - lastPointerX : 0;
      const dy = lastPointerY ? event.clientY - lastPointerY : 0;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      const horizontalForce = dx / 42;
      const verticalForce = dy / 42;
      if (Math.abs(horizontalForce) > 0.035) {
        addSpinImpulse('y', Math.sign(horizontalForce), Math.min(0.85, Math.abs(horizontalForce)));
      }
      if (Math.abs(verticalForce) > 0.035) {
        addSpinImpulse('x', Math.sign(verticalForce), Math.min(0.85, Math.abs(verticalForce)));
      }
    }

    function handleWindowTouchStart() {
      addSpinImpulse('y', 1, 0.85);
    }

    function handlePointerEnter(event: PointerEvent) {
      pointerInside = true;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      const rect = viewport.getBoundingClientRect();
      const fromLeft = event.clientX < rect.left + rect.width / 2;
      addSpinImpulse('y', fromLeft ? 1 : -1, 0.45);
    }

    function handlePointerLeave() {
      pointerInside = false;
      lastPointerX = 0;
      lastPointerY = 0;
    }

    if (interactive) {
      window.addEventListener('pointermove', handleWindowPointerMove);
      window.addEventListener('touchstart', handleWindowTouchStart, { passive: true });
      viewport.addEventListener('pointerenter', handlePointerEnter);
      viewport.addEventListener('pointerleave', handlePointerLeave);
    }

    function animate(now: number) {
      const dt = Math.min(0.033, Math.max(0.001, (now - lastFrameAt) / 1000));
      lastFrameAt = now;

      const idleTime = (now - start) / 1000;
      const hover = Math.sin(idleTime * Math.PI * 0.75);
      const frontErrorX = Math.atan2(Math.sin(angleX), Math.cos(angleX));
      const frontErrorY = Math.atan2(Math.sin(angleY), Math.cos(angleY));
      const returnTorqueX = -frontErrorX * 34;
      const returnTorqueY = -frontErrorY * 34;
      const dampingTorqueX = angularVelocityX * -2.4;
      const dampingTorqueY = angularVelocityY * -2.4;

      if (
        autoSpin &&
        now - lastImpulseAt > autoSpinDelayMs &&
        Math.abs(angularVelocityX) < 0.08 &&
        Math.abs(angularVelocityY) < 0.08 &&
        Math.abs(frontErrorX) < 0.025 &&
        Math.abs(frontErrorY) < 0.025
      ) {
        addSpinImpulse('y', 1, 1.15);
      }

      angularVelocityX += (returnTorqueX + dampingTorqueX) * dt;
      angularVelocityY += (returnTorqueY + dampingTorqueY) * dt;
      angleX += angularVelocityX * dt;
      angleY += angularVelocityY * dt;

      coin.position.y = hover * 0.018;
      coin.rotation.z = Math.sin(idleTime * Math.PI * 0.45) * 0.01;
      coin.rotation.x = angleX;
      coin.rotation.y = angleY;

      if (faceImage) {
        const frontVisibility = Math.cos(angleX) * Math.cos(angleY);
        faceImage.style.opacity = !textureLoaded && frontVisibility > 0.08 ? '1' : '0';
        faceImage.style.transform = `translate(-50%, -50%) translateY(${coin.position.y * -18}px) perspective(620px) rotateX(${-angleX}rad) rotateY(${angleY}rad) rotateZ(${coin.rotation.z}rad)`;
      }

      stage.renderer.render(stage.scene, stage.camera);
      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => {
      mounted = false;
      cancelAnimationFrame(frame);
      if (interactive) {
        window.removeEventListener('pointermove', handleWindowPointerMove);
        window.removeEventListener('touchstart', handleWindowTouchStart);
        viewport.removeEventListener('pointerenter', handlePointerEnter);
        viewport.removeEventListener('pointerleave', handlePointerLeave);
      }
      resizeObserver.disconnect();
      geometry.dispose();
      frontFace.geometry.dispose();
      backFace.geometry.dispose();
      edgeMaterial.dispose();
      activeFrontTexture.dispose();
      if (activeFrontTexture !== fallbackFrontTexture) fallbackFrontTexture.dispose();
      frontMaterial.dispose();
      backTexture.dispose();
      backMaterial.dispose();
      sideGlow.geometry.dispose();
      sideGlow.material.dispose();
      stage.dispose();
    };
  });
</script>

<div
  bind:this={viewport}
  class="level-coin-3d"
  role="img"
  aria-label={`Level ${level}: ${character.name}`}
  style={`--coin-size:${size}px`}
  on:touchstart={() => interactive && addSpinImpulse('y', 1, 1)}
  on:focus={() => interactive && addSpinImpulse('y', 1, 1)}
>
  {#if showImage && character.imageUrl}
    <img bind:this={faceImage} class="level-coin-3d__image" src={highResolutionTexture(character.imageUrl)} alt="" />
  {/if}
</div>

<style>
  .level-coin-3d {
    width: calc(var(--coin-size) + 40px);
    height: calc(var(--coin-size) + 40px);
    margin: -20px;
    overflow: visible;
    contain: layout;
    position: relative;
  }

  .level-coin-3d :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .level-coin-3d__image {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    width: calc(var(--coin-size) * 0.78);
    height: calc(var(--coin-size) * 0.78);
    border-radius: 50%;
    object-fit: cover;
    pointer-events: none;
    transform-origin: center;
    opacity: 0;
    transition: opacity 120ms linear;
    will-change: transform, opacity;
  }

</style>
