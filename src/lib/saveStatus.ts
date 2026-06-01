import { writable } from 'svelte/store';

// Tiny global indicator of background save activity. Anything that persists data
// calls markSaving()/markSaved(); the header shows an unobtrusive icon.
export type SaveState = 'idle' | 'saving' | 'saved';
export const saveState = writable<SaveState>('idle');

let resetTimer: ReturnType<typeof setTimeout> | null = null;

export function markSaving() {
  saveState.set('saving');
}

export function markSaved() {
  saveState.set('saved');
  if (resetTimer) clearTimeout(resetTimer);
  // Fade back to idle after a moment so it stays unobtrusive.
  resetTimer = setTimeout(() => saveState.set('idle'), 2000);
}
