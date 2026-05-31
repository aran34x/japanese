import Dexie, { type Table } from 'dexie';
import type { Card, Deck, MediaBlob, ReviewState, Settings } from './types';
import { newReviewState } from './srs';

// IndexedDB-backed store. Media blobs (audio/image/video) live in their own
// table so imported Anki media of any type can be persisted offline.
export class AppDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  reviews!: Table<ReviewState, string>;
  media!: Table<MediaBlob, string>;
  meta!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('nihongo-quest');
    this.version(1).stores({
      decks: 'id, category, builtin',
      cards: 'id, deckId, category, *tags',
      reviews: 'cardId, due, phase',
      media: 'id',
      meta: 'key'
    });
  }
}

export const db = new AppDB();

export const DEFAULT_SETTINGS: Settings = {
  uiLang: 'en',
  meaningLangs: ['en', 'it'],
  newPerDay: 20,
  autoAudio: true,
  showRomaji: true
};

export async function getSettings(): Promise<Settings> {
  const row = await db.meta.get('settings');
  return { ...DEFAULT_SETTINGS, ...((row?.value as Partial<Settings>) ?? {}) };
}

export async function saveSettings(s: Settings): Promise<void> {
  await db.meta.put({ key: 'settings', value: s });
}

/** Insert cards and create their initial (new) review states in one tx. */
export async function addCards(cards: Card[]): Promise<void> {
  await db.transaction('rw', db.cards, db.reviews, async () => {
    await db.cards.bulkPut(cards);
    const states = cards.map((c) => newReviewState(c.id));
    // bulkAdd would throw on existing keys; use bulkPut but don't clobber progress.
    const existing = new Set(
      (await db.reviews.bulkGet(cards.map((c) => c.id))).filter(Boolean).map((r) => r!.cardId)
    );
    await db.reviews.bulkPut(states.filter((s) => !existing.has(s.cardId)));
  });
}

export async function resetReviews(cardIds: string[]): Promise<void> {
  await db.reviews.bulkPut(cardIds.map((id) => newReviewState(id)));
}

/** Build a URL for a stored media blob (caller should revoke when done). */
export async function mediaUrl(id?: string): Promise<string | undefined> {
  if (!id) return undefined;
  const m = await db.media.get(id);
  if (!m) return undefined;
  return URL.createObjectURL(m.blob);
}
