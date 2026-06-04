import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from 'three';

export interface ThreeStage {
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  resize: () => void;
  dispose: () => void;
}

export function createThreeStage(container: HTMLElement): ThreeStage {
  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 100);
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });

  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const ambient = new AmbientLight(0xfff4d6, 1.6);
  scene.add(ambient);

  const key = new DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 4, 5);
  scene.add(key);

  const rim = new DirectionalLight(0xfbbf24, 2.4);
  rim.position.set(-4, 1.5, -3);
  scene.add(rim);

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
  }

  resize();

  return {
    scene,
    camera,
    renderer,
    resize,
    dispose() {
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
