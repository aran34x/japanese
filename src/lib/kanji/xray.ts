import { writable } from 'svelte/store';
import { db } from '../db';

// Furigana display toggle (persisted). When on, kanji show their reading above.
export const furiganaOn = writable(false);

export async function loadXray() {
  const f = await db.meta.get('furiganaOn');
  if (f?.value !== undefined) furiganaOn.set(!!f.value);
}

furiganaOn.subscribe((v) => void db.meta.put({ key: 'furiganaOn', value: v }).catch(() => {}));
