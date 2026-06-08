import { writable, get } from 'svelte/store';
import { db } from './db';

export { TAEKIM } from './data/book/taekim';
export type { Book, BookChapter, BookSection, BookBlock, BookExample } from './data/book/taekim';

const BOOK_META = 'bookProgress';

/** Ids of chapters the reader has marked read. Persisted to IndexedDB `meta`. */
export const bookProgress = writable<string[]>([]);

/** Set by a Lesson's "Read the full chapter" link so the Guide opens it directly. */
export const guideTarget = writable<string | null>(null);

export async function loadBookProgress() {
  const row = await db.meta.get(BOOK_META);
  bookProgress.set(Array.isArray(row?.value) ? (row.value as string[]) : []);
}

export async function toggleChapterRead(id: string) {
  const cur = get(bookProgress);
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  bookProgress.set(next);
  await db.meta.put({ key: BOOK_META, value: next });
  void import('./sync').then((m) => m.autoPush());
}

export async function markChapterRead(id: string) {
  const cur = get(bookProgress);
  if (cur.includes(id)) return;
  const next = [...cur, id];
  bookProgress.set(next);
  await db.meta.put({ key: BOOK_META, value: next });
  void import('./sync').then((m) => m.autoPush());
}
