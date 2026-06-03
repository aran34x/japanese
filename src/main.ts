import './app.css';
import App from './App.svelte';
import { registerSW } from 'virtual:pwa-register';
import { registerUpdateTrigger } from './lib/sw-update';

// Auto-update: register the service worker and, whenever a new version is
// available, activate it and reload so the user always gets the latest build
// on open — no manual refresh / incognito needed.
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    // A new version was downloaded in the background. Activate + reload.
    updateSW(true);
  }
});

registerUpdateTrigger(() => updateSW());

// Also proactively check for updates every time the tab becomes visible again
// (e.g. reopening the installed PWA from the Android home screen).
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    navigator.serviceWorker?.getRegistration().then((r) => r?.update());
  }
});

const app = new App({
  target: document.getElementById('app')!
});

export default app;
