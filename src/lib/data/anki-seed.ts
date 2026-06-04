import type { Card, Deck } from '../types';
import { db, addCards } from '../db';

export interface AnkiDeckJson {
  deck: Deck;
  cards: Card[];
}

// Built-in Anki decks. Each JSON is fetched once per SEED_VERSION. Bump the
// version when the extraction logic changes so existing installs re-seed with
// the corrected cards (old cards for the deck are cleared first).
const SEED_VERSION = 3;

const ANKI_DECKS = [
  'anki-core-2000',
  'anki-core-step01',
  'anki-core-step02',
  'anki-tae-kim',
  'anki-kaishi',
] as const;

export type AnkiDeckId = (typeof ANKI_DECKS)[number];

async function seedOne(id: AnkiDeckId): Promise<void> {
  const key = `ankiSeeded-${id}`;
  const cur = (await db.meta.get(key))?.value;
  if (cur === SEED_VERSION) return;

  const res = await fetch(`./decks/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch deck ${id}: ${res.status}`);
  const { deck, cards }: AnkiDeckJson = await res.json();

  // Clean re-seed: drop the deck's previous cards + their review state so stale
  // / junk cards from an earlier version don't linger.
  const oldIds = (await db.cards.where('deckId').equals(id).primaryKeys()) as string[];
  if (oldIds.length) {
    await db.cards.where('deckId').equals(id).delete();
    await db.reviews.bulkDelete(oldIds);
  }

  await db.decks.put(deck);
  await addCards(cards);
  await db.meta.put({ key, value: SEED_VERSION });
}

/**
 * Seed all built-in Anki decks in the background. Safe to call repeatedly.
 * Per-deck errors are logged but don't block the others.
 */
export async function ensureAnkiDecks(): Promise<void> {
  for (const id of ANKI_DECKS) {
    await seedOne(id).catch((e) => console.warn(`[anki-seed] skipped ${id}:`, e));
  }
}
