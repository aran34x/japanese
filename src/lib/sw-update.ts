// Coordinates PWA service-worker update checks.
// main.ts registers the live checker; anything else calls checkForUpdates().

let _trigger: (() => void) | null = null;

export function registerUpdateTrigger(fn: () => void) {
  _trigger = fn;
}

export function checkForUpdates() {
  if (_trigger) {
    _trigger();
    return;
  }
  // Fallback when SW isn't registered yet (e.g. dev mode)
  navigator.serviceWorker?.getRegistration().then((r) => r?.update());
}
