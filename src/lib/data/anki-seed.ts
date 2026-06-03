import type { Card, Deck } from '../types';
import { db, addCards } from '../db';

export interface AnkiDeckJson {
  deck: Deck;
  cards: Card[];
}

// The five built-in Anki decks. Each JSON file is fetched once, then the
// deck is marked seeded in `meta` so it never runs again.
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
  const already = await db.meta.get(key);
  if (already?.value) return;

  const res = await fetch(`./decks/${id}.json`);
  if (!res.ok) throw new Error(`Failed to fetch deck ${id}: ${res.status}`);
  const { deck, cards }: AnkiDeckJson = await res.json();

  await db.decks.put(deck);
  await addCards(cards);
  await db.meta.put({ key, value: true });
}

/**
 * Seed all built-in Anki decks in the background. Safe to call multiple times
 * (each deck is idempotent). Errors per-deck are logged but don't block others.
 */
export async function ensureAnkiDecks(): Promise<void> {
  for (const id of ANKI_DECKS) {
    await seedOne(id).catch((e) =>
      console.warn(`[anki-seed] skipped ${id}:`, e)
    );
  }
}
