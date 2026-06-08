// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'it';
export type AppSkin =
  | 'default'
  | 'light'
  | 'smash64'
  | 'sakura'
  | 'station'
  | 'nature'
  | 'comet'
  | 'fuji'
  | 'sushi'
  | 'countryside'
  | 'samurai'
  | 'temple'
  | 'dojo'
  | 'touge';

/** A category groups decks/cards so exercises can be generated per topic. */
export type Category = 'hiragana' | 'katakana' | 'kanji' | 'vocab' | 'reading' | 'custom';

/**
 * A single learnable item. Designed to be flexible enough to carry imported
 * Anki content: arbitrary text, plus optional media (audio/image/video) that
 * is stored separately in the `media` table and referenced by id.
 */
export interface Card {
  id: string;
  deckId: string;
  category: Category;
  /** The Japanese form shown as the main prompt (kana/kanji/word/sentence). */
  front: string;
  /** Reading in hiragana/romaji where relevant. */
  reading?: string;
  /** Romaji transliteration (used by kana drills & typing answers). */
  romaji?: string;
  /** Meaning per language. en/it keyed. */
  meaning: Partial<Record<Lang, string>>;
  /** Free-form notes / example sentence per language. */
  notes?: Partial<Record<Lang, string>>;
  /** Optional media references (ids into the media store, for user-imported blobs). */
  audioId?: string;
  imageId?: string;
  videoId?: string;
  /** Direct URLs for Supabase-hosted media (built-in Anki decks). Preferred over blob IDs. */
  audioUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  /** Tags for filtering (e.g. "jlpt-n5", "greetings"). */
  tags: string[];
  /** Ordering hint within a deck. */
  order?: number;
}

export interface Deck {
  id: string;
  name: Partial<Record<Lang, string>>;
  category: Category;
  description?: Partial<Record<Lang, string>>;
  /** true for the bundled starter decks (cannot be deleted, only reset). */
  builtin: boolean;
  createdAt: number;
}

/** Binary media payload imported from Anki or added by the user. */
export interface MediaBlob {
  id: string;
  mime: string;
  blob: Blob;
  filename?: string;
}

// ---------------------------------------------------------------------------
// Spaced repetition (SM-2) review state, stored per card.
// ---------------------------------------------------------------------------

export interface ReviewState {
  cardId: string;
  /** Ease factor (SM-2), starts at 2.5. */
  ease: number;
  /** Current inter-repetition interval in days. */
  interval: number;
  /** Number of consecutive correct reviews. */
  reps: number;
  /** Epoch ms when the card is next due. */
  due: number;
  /** Last time reviewed (epoch ms). 0 = never. */
  lastReviewed: number;
  /** Lifetime counters for stats. */
  totalReviews: number;
  totalCorrect: number;
  /** 'new' | 'learning' | 'review' */
  phase: 'new' | 'learning' | 'review';
}

/** The four Anki-style grades. */
export type Grade = 'again' | 'hard' | 'good' | 'easy';

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------

export type ExerciseKind =
  | 'mcq-jp-to-meaning' // see Japanese, pick meaning
  | 'mcq-meaning-to-jp' // see meaning, pick Japanese
  | 'mcq-jp-to-reading' // see kana/kanji, pick reading
  | 'type-reading' // type the romaji/reading
  | 'type-meaning' // type the meaning
  | 'match' // match pairs
  | 'flashcard'; // SRS flip card with self-grading

export interface McqOption {
  text: string;
  correct: boolean;
  cardId: string;
}

export interface Lesson {
  vocab: { jp: string; reading: string; meaning: Partial<Record<Lang, string>> }[];
  tip: Partial<Record<Lang, string>>;
}

export interface Exercise {
  kind: ExerciseKind;
  card: Card;
  prompt: string;
  /** i18n key describing the task, e.g. 'q_say' → "How do you say this?". */
  instructionKey?: string;
  /** for MCQ kinds */
  options?: McqOption[];
  /** acceptable answers for typed kinds (lowercased, trimmed) */
  answers?: string[];
  /**
   * TTS text to speak for the PROMPT — set only when speaking the prompt is
   * appropriate (i.e. the prompt is Japanese and it's not a "how do you read
   * this?" question, where audio would reveal the answer). Undefined = no
   * prompt audio.
   */
  promptSpeak?: string;
  /** Recorded audio URL for the prompt; preferred over promptSpeak (TTS). */
  promptAudioUrl?: string;
  /** Whether the answer OPTIONS may be played aloud (Japanese/reading answers). */
  answerAudio?: boolean;
  /** Mini-lesson to show after answering. */
  lesson?: Lesson;
}

export interface Settings {
  uiLang: Lang;
  /** Which languages to show meanings in. */
  meaningLangs: Lang[];
  /** Daily new-card introduction limit. */
  newPerDay: number;
  /** Play audio automatically when available. */
  autoAudio: boolean;
  showRomaji: boolean;
  skin: AppSkin;
  /** Kanji enlargement factor in X-ray mode (em multiplier). */
  xrayKanjiScale: number;
  /** Whether to always show the mini-lesson (even if correct). */
  showLessonAlways: boolean;
}
