import { writable } from 'svelte/store';
import { db } from '../db';

// Global Kanji X-ray toggle. Persisted so it stays on between sessions.
export const xrayOn = writable(false);
export const xrayFurigana = writable(true);

export async function loadXray() {
  const on = await db.meta.get('xrayOn');
  const furi = await db.meta.get('xrayFurigana');
  if (on?.value !== undefined) xrayOn.set(!!on.value);
  if (furi?.value !== undefined) xrayFurigana.set(!!furi.value);
}

xrayOn.subscribe((v) => void db.meta.put({ key: 'xrayOn', value: v }).catch(() => {}));
xrayFurigana.subscribe((v) => void db.meta.put({ key: 'xrayFurigana', value: v }).catch(() => {}));
