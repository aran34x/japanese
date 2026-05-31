import { db } from './db';
import type { Card, ReviewState } from './types';

export interface QueueItem {
  card: Card;
  state: ReviewState;
}

/**
 * Build a study queue from selected decks: all due review/learning cards plus
 * up to `newLimit` brand-new cards. Sorted so due cards come first.
 */
export async function buildQueue(deckIds: string[], newLimit: number): Promise<QueueItem[]> {
  const now = Date.now();
  const cards = deckIds.length
    ? await db.cards.where('deckId').anyOf(deckIds).toArray()
    : await db.cards.toArray();
  const cardMap = new Map(cards.map((c) => [c.id, c]));
  const states = await db.reviews.bulkGet([...cardMap.keys()]);

  const due: QueueItem[] = [];
  const fresh: QueueItem[] = [];
  states.forEach((state) => {
    if (!state) return;
    const card = cardMap.get(state.cardId);
    if (!card) return;
    if (state.phase === 'new') fresh.push({ card, state });
    else if (state.due <= now) due.push({ card, state });
  });

  due.sort((a, b) => a.state.due - b.state.due);
  fresh.sort((a, b) => (a.card.order ?? 0) - (b.card.order ?? 0));
  return [...due, ...fresh.slice(0, newLimit)];
}

/** Counts for the home dashboard. */
export async function deckCounts(deckIds: string[]) {
  const now = Date.now();
  const cards = deckIds.length
    ? await db.cards.where('deckId').anyOf(deckIds).toArray()
    : await db.cards.toArray();
  const states = await db.reviews.bulkGet(cards.map((c) => c.id));
  let due = 0, fresh = 0, learning = 0;
  for (const s of states) {
    if (!s) continue;
    if (s.phase === 'new') fresh++;
    else if (s.phase === 'learning' && s.due <= now) learning++;
    else if (s.due <= now) due++;
  }
  return { due, new: fresh, learning, total: cards.length };
}
