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
  return [...new Set(parts)].join(' / ');
}

/** Normalize a typed answer for comparison. */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[。、．]/g, '');
}

const hasMeaning = (c: Card) => !!(c.meaning.en || c.meaning.it);

/**
 * The only question types that make sense for a given card. This is the
 * "question type category" system: each card category maps to coherent kinds,
 * and we never produce a degenerate question (e.g. read-the-reading on a card
 * whose reading equals its front, like a full sentence).
 */
export function allowedKinds(card: Card): ExerciseKind[] {
  const k: ExerciseKind[] = [];
  switch (card.category) {
    case 'hiragana':
    case 'katakana':
      // kana ↔ romaji only
      k.push('mcq-jp-to-reading', 'mcq-meaning-to-jp');
      if (card.romaji) k.push('type-reading');
      break;
    case 'kanji':
      k.push('mcq-jp-to-meaning', 'mcq-meaning-to-jp', 'mcq-jp-to-reading', 'type-meaning');
      break;
    case 'vocab':
      k.push('mcq-jp-to-meaning', 'mcq-meaning-to-jp', 'mcq-jp-to-reading', 'type-meaning');
      if (card.romaji) k.push('type-reading');
      break;
    case 'reading':
      // a full sentence: only "what does it mean?" makes sense
      k.push('mcq-jp-to-meaning');
      break;
    default: {
      // custom / imported — adapt to whatever fields exist
      if (hasMeaning(card)) k.push('mcq-jp-to-meaning', 'mcq-meaning-to-jp', 'type-meaning');
      if (card.reading && card.reading !== card.front) k.push('mcq-jp-to-reading');
      if (card.romaji) k.push('type-reading');
      if (k.length === 0) k.push('flashcard');
    }
  }
  return k;
}

// Text accessor for each "answer kind" — what the option/answer text should be.
const readingText = (c: Card) => c.romaji ?? c.reading ?? '';

/**
 * Pick distractor cards from the SAME category so options are homogeneous
 * (kana with kana, kanji with kanji…). Falls back to the wider pool only if a
 * category is too small to fill the choices.
 */
function distractors(card: Card, pool: Card[], pick: (c: Card) => string, n = 3): Card[] {
  const target = pick(card);
  const seen = new Set<string>([target]);
  const out: Card[] = [];

  const sameCat = shuffle(pool.filter((c) => c.category === card.category && c.id !== card.id));
  for (const c of sameCat) {
    const v = pick(c);
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(c);
    }
    if (out.length >= n) return out;
  }
  // Fallback: borrow from anywhere just to reach a full set of options.
  const rest = shuffle(pool.filter((c) => c.id !== card.id && c.category !== card.category));
  for (const c of rest) {
    const v = pick(c);
    if (v && !seen.has(v)) {
      seen.add(v);
      out.push(c);
    }
    if (out.length >= n) break;
  }
  return out;
}

function mcq(
  card: Card,
  pool: Card[],
  pick: (c: Card) => string,
  prompt: string,
  kind: ExerciseKind,
  instructionKey: string
): Exercise {
  const wrong = distractors(card, pool, pick);
  const options: McqOption[] = shuffle([
    { text: pick(card), correct: true, cardId: card.id },
    ...wrong.map((c) => ({ text: pick(c), correct: false, cardId: c.id }))
  ]);
  return { kind, card, prompt, options, instructionKey };
}

/**
 * Generate one exercise for a card. `kind` may be 'auto', or a specific kind —
 * but a requested kind that isn't valid for this card is sanitized to a safe
 * one, so callers can never accidentally create a broken question.
 */
export function makeExercise(
  card: Card,
  pool: Card[],
  langs: Lang[],
  kind: ExerciseKind | 'auto' = 'auto'
): Exercise {
  const meaning = (c: Card) => meaningOf(c, langs);
  const allowed = allowedKinds(card);

  let chosen: ExerciseKind;
  if (kind === 'flashcard') chosen = 'flashcard';
  else if (kind === 'auto' || !allowed.includes(kind)) {
    chosen = allowed[Math.floor(Math.random() * allowed.length)] ?? 'flashcard';
  } else {
    chosen = kind;
  }

  switch (chosen) {
    case 'mcq-jp-to-meaning':
      return mcq(card, pool, meaning, card.front, 'mcq-jp-to-meaning', 'q_meaning');
    case 'mcq-meaning-to-jp':
      return mcq(card, pool, (c) => c.front, meaning(card), 'mcq-meaning-to-jp', 'q_say');
    case 'mcq-jp-to-reading':
      return mcq(card, pool, readingText, card.front, 'mcq-jp-to-reading', 'q_reading');
    case 'type-reading':
      return {
        kind: 'type-reading',
        card,
        prompt: card.front,
        instructionKey: 'q_type_reading',
        answers: [card.romaji, card.reading].filter(Boolean).map((s) => normalize(s!))
      };
    case 'type-meaning':
      return {
        kind: 'type-meaning',
        card,
        prompt: card.front,
        instructionKey: 'q_type_meaning',
        answers: langs
          .flatMap((l) => (card.meaning[l] ? card.meaning[l]!.split(/[\/,]/) : []))
          .map((s) => normalize(s))
          .filter(Boolean)
      };
    case 'flashcard':
    default:
      return { kind: 'flashcard', card, prompt: card.front, instructionKey: '' };
  }
}

export function makeBatch(
  cards: Card[],
  pool: Card[],
  langs: Lang[],
  kind: ExerciseKind | 'auto' = 'auto'
): Exercise[] {
  return cards.map((c) => makeExercise(c, pool, langs, kind));
}
