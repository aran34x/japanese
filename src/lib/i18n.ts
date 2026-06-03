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
  q_meaning: { en: 'What does this mean?', it: 'Cosa significa?' },
  q_say: { en: 'How do you say this?', it: 'Come si dice?' },
  q_reading: { en: 'How is this read?', it: 'Come si legge?' },
  q_type_reading: { en: 'Type the reading (romaji)', it: 'Scrivi la lettura (romaji)' },
  q_type_meaning: { en: 'Type the meaning', it: 'Scrivi il significato' },

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
  icons: { en: 'Icons', it: 'Icone' },
  charactersTab: { en: 'Characters', it: 'Personaggi' },
  stories: { en: 'Stories', it: 'Storie' },
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
  earnedAch: { en: 'Achievement unlocked', it: 'Obiettivo sbloccato' },

  // Icons / Characters (real & fictional figures)
  openWikipedia: { en: 'Open on Wikipedia', it: 'Apri su Wikipedia' },
  replayChallenge: { en: 'Replay challenge', it: 'Rigioca la sfida' },
  takeChallenge: { en: 'Take the challenge', it: 'Affronta la sfida' },
  miniLesson: { en: 'Mini-lesson', it: 'Mini-lezione' },
  gotItRetry: { en: 'Got it — retry', it: 'Ho capito — riprova' },
  unlocked: { en: 'Unlocked!', it: 'Sbloccato!' },
  viewBio: { en: 'View bio', it: 'Vedi bio' },
  replay: { en: 'Replay', it: 'Rigioca' },
  iconsIntro: {
    en: 'Challenge real figures of Japanese culture. Photos & bios live from Wikipedia.',
    it: 'Sfida figure reali della cultura giapponese. Foto e bio dal vivo da Wikipedia.'
  },
  iconsLockedHint: {
    en: 'Beat the challenge to reveal the photo and biography.',
    it: 'Supera la sfida per svelare la foto e la biografia.'
  },
  charsIntro: {
    en: 'Fictional characters: read their real Japanese names. Live bios from Wikipedia (no copyrighted art).',
    it: 'Personaggi di fantasia: leggi i loro nomi giapponesi reali. Bio dal vivo da Wikipedia (niente immagini protette).'
  },
  charsLockedHint: {
    en: 'Read the Japanese name to unlock the character and its bio.',
    it: 'Leggi il nome giapponese per sbloccare il personaggio e la sua bio.'
  }
};

export function translate(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
