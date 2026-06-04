import { writable, derived, get } from 'svelte/store';
import type { Lang, Settings } from './types';
import { DEFAULT_SETTINGS, getSettings, saveSettings } from './db';
import { translate } from './i18n';

export const settings = writable<Settings>(DEFAULT_SETTINGS);
export const ready = writable(false);

// Whether the Settings / Stats modals are open (overlay the current page).
export const settingsOpen = writable(false);
export const statsOpen = writable(false);

// Simple hash-based route: '#/study', '#/decks', etc.
function readRoute(): string {
  return location.hash.replace(/^#\//, '') || 'home';
}
export const route = writable(readRoute());
window.addEventListener('hashchange', () => route.set(readRoute()));
export function navigate(to: string) {
  location.hash = `#/${to}`;
}

export async function loadSettings() {
  settings.set(await getSettings());
}

settings.subscribe((s) => {
  if (get(ready)) void saveSettings(s);
});

export const uiLang = derived(settings, ($s) => $s.uiLang);

// Translation helper as a store-aware function.
export const t = derived(settings, ($s) => (key: string) => translate(key, $s.uiLang));

export function setLang(lang: Lang) {
  settings.update((s) => ({ ...s, uiLang: lang }));
}
