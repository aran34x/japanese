import type { Card, Exercise, ExerciseKind, Lang, McqOption } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function meaningOf(card: Card, langs: Lang[]): string {
  const parts = langs.map((l) => card.meaning[l]).filter(Boolean) as string[];
  // de-dupe (en & it can be identical for kana)
  return [...new Set(parts)].join(' / ');
}

/** Normalize a typed answer for comparison. */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[。、．]/g, '');
}

function distractors(card: Card, pool: Card[], pick: (c: Card) => string, n = 3): Card[] {
  const target = pick(card);
  const candidates = shuffle(pool.filter((c) => c.id !== card.id && pick(c) && pick(c) !== target));
  return candidates.slice(0, n);
}

function mcq(card: Card, pool: Card[], pick: (c: Card) => string, prompt: string, kind: ExerciseKind): Exercise {
  const wrong = distractors(card, pool, pick);
  const options: McqOption[] = shuffle([
    { text: pick(card), correct: true, cardId: card.id },
    ...wrong.map((c) => ({ text: pick(c), correct: false, cardId: c.id }))
  ]);
  return { kind, card, prompt, options };
}

/**
 * Generate a single exercise for a card. `kind` may be 'auto' to choose a
 * sensible variant based on the card's category. This is what powers the
 * "many variants" — every card can become several different exercises.
 */
export function makeExercise(
  card: Card,
  pool: Card[],
  langs: Lang[],
  kind: ExerciseKind | 'auto' = 'auto'
): Exercise {
  const meaning = (c: Card) => meaningOf(c, langs);
  const reading = (c: Card) => c.reading ?? c.romaji ?? '';

  let chosen = kind;
  if (kind === 'auto') {
    const opts: ExerciseKind[] =
      card.category === 'hiragana' || card.category === 'katakana'
        ? ['mcq-jp-to-reading', 'type-reading', 'mcq-jp-to-reading']
        : card.category === 'reading'
          ? ['mcq-jp-to-meaning', 'flashcard']
          : ['mcq-jp-to-meaning', 'mcq-meaning-to-jp', 'type-meaning', 'mcq-jp-to-reading'];
    chosen = opts[Math.floor(Math.random() * opts.length)];
  }

  switch (chosen) {
    case 'mcq-jp-to-meaning':
      return mcq(card, pool, meaning, card.front, 'mcq-jp-to-meaning');
    case 'mcq-meaning-to-jp':
      return mcq(card, pool, (c) => c.front, meaning(card), 'mcq-meaning-to-jp');
    case 'mcq-jp-to-reading':
      return mcq(card, pool, (c) => c.romaji ?? c.reading ?? '', card.front, 'mcq-jp-to-reading');
    case 'type-reading':
      return {
        kind: 'type-reading',
        card,
        prompt: card.front,
        answers: [card.romaji, card.reading].filter(Boolean).map((s) => normalize(s!))
      };
    case 'type-meaning':
      return {
        kind: 'type-meaning',
        card,
        prompt: card.front,
        answers: langs
          .flatMap((l) => (card.meaning[l] ? card.meaning[l]!.split('/').map((p) => p.split(',')) : []))
          .flat()
          .map((s) => normalize(s))
      };
    case 'flashcard':
    default:
      return { kind: 'flashcard', card, prompt: card.front };
  }
}

/** Build a batch of exercises from a list of cards (one per card). */
export function makeBatch(cards: Card[], pool: Card[], langs: Lang[], kind: ExerciseKind | 'auto' = 'auto'): Exercise[] {
  return cards.map((c) => makeExercise(c, pool, langs, kind));
}
