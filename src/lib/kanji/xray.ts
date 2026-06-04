import { writable } from 'svelte/store';
import { db } from '../db';

// Furigana display toggle (persisted). When on, kanji show their reading above.
export const furiganaOn = writable(false);
// Kanji X-ray toggle (persisted). When on, kanji show cycling meaning + readings.
export const xrayOn = writable(false);

export async function loadXray() {
  const f = await db.meta.get('furiganaOn');
  if (f?.value !== undefined) furiganaOn.set(!!f.value);
  const x = await db.meta.get('xrayOn');
  if (x?.value !== undefined) xrayOn.set(!!x.value);
}

furiganaOn.subscribe((v) => void db.meta.put({ key: 'furiganaOn', value: v }).catch(() => {}));
xrayOn.subscribe((v) => void db.meta.put({ key: 'xrayOn', value: v }).catch(() => {}));
