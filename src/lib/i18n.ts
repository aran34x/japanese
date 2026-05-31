import type { Lang } from './types';

type Dict = Record<string, { en: string; it: string }>;

// Central translation table. Add keys here and reference via t(key).
export const strings: Dict = {
  appName: { en: 'Nihongo Quest', it: 'Nihongo Quest' },
  tagline: {
    en: 'Learn Japanese: kana, kanji, vocab & flashcards',
    it: 'Impara il giapponese: kana, kanji, vocaboli e flashcard'
  },
  home: { en: 'Home', it: 'Home' },
  study: { en: 'Study', it: 'Studia' },
  decks: { en: 'Decks', it: 'Mazzi' },
  stats: { en: 'Stats', it: 'Statistiche' },
  settings: { en: 'Settings', it: 'Impostazioni' },
  import: { en: 'Import', it: 'Importa' },

  due: { en: 'Due', it: 'Da rivedere' },
  newCards: { en: 'New', it: 'Nuove' },
  learning: { en: 'Learning', it: 'In apprendimento' },
  startReview: { en: 'Start review', it: 'Inizia ripasso' },
  noDue: { en: 'Nothing due right now — great job!', it: 'Niente da rivedere ora — ottimo!' },
  reviewDone: { en: 'Session complete!', it: 'Sessione completata!' },

  modes: { en: 'Practice modes', it: 'Modalità di pratica' },
  flashcards: { en: 'Flashcards (SRS)', it: 'Flashcard (SRS)' },
  quiz: { en: 'Multiple choice', it: 'Scelta multipla' },
  typing: { en: 'Typing', it: 'Scrittura' },
  matching: { en: 'Matching', it: 'Abbinamento' },
  reading: { en: 'Reading', it: 'Lettura' },

  showAnswer: { en: 'Show answer', it: 'Mostra risposta' },
  again: { en: 'Again', it: 'Di nuovo' },
  hard: { en: 'Hard', it: 'Difficile' },
  good: { en: 'Good', it: 'Bene' },
  easy: { en: 'Easy', it: 'Facile' },
  correct: { en: 'Correct!', it: 'Corretto!' },
  incorrect: { en: 'Not quite', it: 'Non proprio' },
  answer: { en: 'Answer', it: 'Risposta' },
  check: { en: 'Check', it: 'Verifica' },
  next: { en: 'Next', it: 'Avanti' },
  typeAnswer: { en: 'Type your answer…', it: 'Scrivi la risposta…' },
  meaning: { en: 'Meaning', it: 'Significato' },
  readingLabel: { en: 'Reading', it: 'Lettura' },

  chooseDeck: { en: 'Choose decks to study', it: 'Scegli i mazzi da studiare' },
  allDecks: { en: 'All decks', it: 'Tutti i mazzi' },
  cards: { en: 'cards', it: 'carte' },
  resetDeck: { en: 'Reset progress', it: 'Azzera progressi' },

  uiLanguage: { en: 'Interface language', it: 'Lingua interfaccia' },
  meaningLanguages: { en: 'Show meanings in', it: 'Mostra significati in' },
  newPerDay: { en: 'New cards per day', it: 'Nuove carte al giorno' },
  showRomaji: { en: 'Show romaji', it: 'Mostra romaji' },
  autoAudio: { en: 'Auto-play audio', it: 'Audio automatico' },

  importTitle: { en: 'Import flashcards', it: 'Importa flashcard' },
  importCsvHelp: {
    en: 'Import a CSV (front, reading, meaning, tags) or an Anki .apkg / .txt export. Media (audio/image) inside .apkg is imported automatically.',
    it: 'Importa un CSV (fronte, lettura, significato, tag) o un export Anki .apkg / .txt. I media (audio/immagini) dentro .apkg vengono importati automaticamente.'
  },
  importBtn: { en: 'Choose file', it: 'Scegli file' },
  importing: { en: 'Importing…', it: 'Importazione…' },
  imported: { en: 'Imported', it: 'Importate' },

  accuracy: { en: 'Accuracy', it: 'Precisione' },
  reviewsToday: { en: 'Reviews today', it: 'Ripassi oggi' },
  totalCards: { en: 'Total cards', it: 'Carte totali' },
  mature: { en: 'Mature', it: 'Mature' },
  streak: { en: 'Day streak', it: 'Giorni di fila' },
  back: { en: 'Back', it: 'Indietro' },
  loading: { en: 'Loading…', it: 'Caricamento…' },

  adventure: { en: 'Adventure', it: 'Avventura' },
  collection: { en: 'Collection', it: 'Collezione' },
  achievements: { en: 'Achievements', it: 'Obiettivi' },
  continueQuest: { en: 'Continue Quest', it: 'Continua la Missione' },
  level: { en: 'Level', it: 'Livello' },
  powerLevel: { en: 'Power level', it: 'Livello di potenza' },
  locked: { en: 'Locked', it: 'Bloccato' },
  toNextHero: { en: 'to next hero', it: 'al prossimo eroe' },
  questDeck: { en: 'Choose your battlefield', it: 'Scegli il campo di battaglia' },
  beginQuest: { en: 'Begin Quest', it: 'Inizia la Missione' },
  xpEarned: { en: 'XP earned', it: 'XP guadagnati' },
  combo: { en: 'Combo', it: 'Combo' },
  attack: { en: 'Attack!', it: 'Attacca!' },
  defeated: { en: 'DEFEATED!', it: 'SCONFITTO!' },
  bossWins: { en: 'The boss got away…', it: 'Il boss è scappato…' },
  wager: { en: 'Answer correctly to DOUBLE your combo XP. Miss and lose it all.', it: 'Rispondi bene per RADDOPPIARE gli XP della combo. Sbaglia e perdi tutto.' },
  accept: { en: 'Accept', it: 'Accetta' },
  skip: { en: 'Skip', it: 'Salta' },
  go: { en: 'GO!', it: 'VIA!' },
  timeUp: { en: "Time's up!", it: 'Tempo scaduto!' },
  earnedAch: { en: 'Achievement unlocked', it: 'Obiettivo sbloccato' }
};

export function translate(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
