import type { Card, Exercise, ExerciseKind, Lang, Lesson, McqOption } from '../types';

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

function makeLesson(card: Card): Lesson {
  return {
    vocab: [
      {
        jp: card.front,
        reading: card.reading || '',
        meaning: card.meaning
      }
    ],
    tip: card.notes || {}
  };
}

/** Normalize a typed answer for comparison. */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[。、．]/g, '');
}

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
    default:
      // custom / imported Anki decks → classic flip flashcards only. Their
      // content doesn't map cleanly to MCQ (distractors become nonsensical),
      // so we keep the authentic Anki front → back + SRS grading experience.
      k.push('flashcard');
  }
  return k;
}

// Text accessor for each "answer kind" — what the option/answer text should be.
const readingText = (c: Card) => c.romaji ?? c.reading ?? '';

// ---------------------------------------------------------------------------
// Pedagogical distractor selection. Good options are CONFUSABLE with the
// answer, not random: kana from the same consonant row / vowel column or a
// visually-similar glyph; vocab from the same deck (days with days, colors
// with colors). Random distractors are trivially eliminable and teach nothing.
// ---------------------------------------------------------------------------

// Classic visually-confusable kana sets (hiragana and katakana).
const VISUAL_GROUPS: string[][] = [
  ['あ', 'お'], ['め', 'ぬ'], ['わ', 'れ', 'ね'], ['る', 'ろ'], ['は', 'ほ', 'ま'],
  ['き', 'さ'], ['ち', 'ら'], ['す', 'む'], ['い', 'り'], ['こ', 'に'], ['た', 'な'],
  ['シ', 'ツ'], ['ソ', 'ン', 'リ'], ['ク', 'タ', 'ケ'], ['コ', 'ユ', 'ヨ'],
  ['ワ', 'ウ', 'フ', 'ヲ'], ['チ', 'テ'], ['ア', 'マ', 'ム'], ['ナ', 'メ'], ['ル', 'レ']
];
function visualGroup(front: string): number {
  const ch = front[0] ?? '';
  return VISUAL_GROUPS.findIndex((g) => g.includes(ch));
}

/** How confusable (and therefore pedagogically useful) is `cand` vs `card`? */
function affinity(card: Card, cand: Card): number {
  if (card.category === 'hiragana' || card.category === 'katakana') {
    let s = 0;
    const ra = card.romaji ?? '';
    const rb = cand.romaji ?? '';
    if (ra && rb) {
      if (ra.slice(0, -1) === rb.slice(0, -1)) s += 2; // same consonant row
      else if (ra.slice(-1) === rb.slice(-1)) s += 1; // same vowel column
    }
    const g = visualGroup(card.front);
    if (g !== -1 && g === visualGroup(cand.front)) s += 3; // め vs ぬ etc.
    return s;
  }
  let s = 0;
  if (cand.deckId === card.deckId) s += 2; // days with days, colors with colors
  if (cand.tags?.some((t) => card.tags?.includes(t))) s += 1;
  return s;
}

/**
 * Pick distractor cards from the SAME category, preferring confusable ones via
 * `affinity`. Samples from the top candidates (not strictly the top 3) so the
 * same question doesn't always show identical options.
 */
function distractors(card: Card, pool: Card[], pick: (c: Card) => string, n = 3): Card[] {
  const target = pick(card);
  const seen = new Set<string>([target]);
  const out: Card[] = [];

  const sameCat = pool.filter(
    (c) => c.category === card.category && c.id !== card.id && pick(c) && pick(c) !== target
  );
  const ranked = sameCat
    .map((c) => ({ c, score: affinity(card, c) + Math.random() * 0.5 }))
    .sort((a, b) => b.score - a.score)
    .map((r) => r.c);
  for (const c of shuffle(ranked.slice(0, n * 2))) {
    const v = pick(c);
    if (!seen.has(v)) {
      seen.add(v);
      out.push(c);
    }
    if (out.length >= n) return out;
  }
  for (const c of ranked) {
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

  // Audio for the prompt is appropriate only when the prompt is Japanese AND
  // the task isn't "read this" (where hearing it gives away the answer). Prefer
  // the card's recorded audio, else fall back to TTS in the UI.
  const jpPrompt = card.reading || card.front;

  switch (chosen) {
    case 'mcq-jp-to-meaning':
      // Prompt is Japanese, asking for meaning → speaking it is fine/helpful.
      return {
        ...mcq(card, pool, meaning, card.front, 'mcq-jp-to-meaning', 'q_meaning'),
        promptSpeak: jpPrompt,
        promptAudioUrl: card.audioUrl,
        lesson: makeLesson(card)
      };
    case 'mcq-meaning-to-jp':
      // Prompt is the MEANING (a UI label, not Japanese) → no prompt audio.
      // Answers are Japanese, so they may be played.
      return { ...mcq(card, pool, (c) => c.front, meaning(card), 'mcq-meaning-to-jp', 'q_say'), answerAudio: true, lesson: makeLesson(card) };
    case 'mcq-jp-to-reading':
      // "How do you read this?" → never speak the prompt; answers (readings) ok.
      return { ...mcq(card, pool, readingText, card.front, 'mcq-jp-to-reading', 'q_reading'), answerAudio: true, lesson: makeLesson(card) };
    case 'type-reading':
      // "How do you read this?" (typed) → no audio at all.
      return {
        kind: 'type-reading',
        card,
        prompt: card.front,
        instructionKey: 'q_type_reading',
        answers: [card.romaji, card.reading].filter(Boolean).map((s) => normalize(s!)),
        lesson: makeLesson(card)
      };
    case 'type-meaning':
      // Prompt is Japanese, asking for meaning → speaking it is fine.
      return {
        kind: 'type-meaning',
        card,
        prompt: card.front,
        instructionKey: 'q_type_meaning',
        promptSpeak: jpPrompt,
        promptAudioUrl: card.audioUrl,
        answers: langs
          .flatMap((l) => (card.meaning[l] ? card.meaning[l]!.split(/[\/,]/) : []))
          .map((s) => normalize(s))
          .filter(Boolean),
        lesson: makeLesson(card)
      };
    case 'flashcard':
    default:
      return { kind: 'flashcard', card, prompt: card.front, instructionKey: '', lesson: makeLesson(card) };
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
