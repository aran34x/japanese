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
  mixed: { en: 'Mixed', it: 'Misto' },
  mixAndMatch: { en: 'Mix decks & modes your way', it: 'Combina mazzi e modalità a piacere' },
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
  chooseSet: { en: 'Tap a set to start', it: 'Tocca un set per iniziare' },
  mixSets: { en: 'Mix multiple sets', it: 'Combina più set' },
  allDecks: { en: 'All decks', it: 'Tutti i mazzi' },
  cards: { en: 'cards', it: 'carte' },
  resetDeck: { en: 'Reset progress', it: 'Azzera progressi' },
  resetSure: { en: 'Reset?', it: 'Azzerare?' },
  resetDone: { en: 'Reset ✓', it: 'Azzerato ✓' },
  deleteSure: { en: 'Delete?', it: 'Eliminare?' },

  uiLanguage: { en: 'Interface language', it: 'Lingua interfaccia' },
  meaningLanguages: { en: 'Show meanings in', it: 'Mostra significati in' },
  newPerDay: { en: 'New cards per day', it: 'Nuove carte al giorno' },
  showRomaji: { en: 'Show romaji', it: 'Mostra romaji' },
  autoAudio: { en: 'Auto-play audio', it: 'Audio automatico' },
  xrayKanjiSize: { en: 'Kanji X-ray size', it: 'Dimensione X-ray kanji' },
  xrayKanjiSizeDesc: {
    en: 'How large kanji grow when the 🔍 hints are on',
    it: 'Quanto si ingrandiscono i kanji con i suggerimenti 🔍 attivi'
  },

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
  totalReviews: { en: 'Reviews', it: 'Ripassi' },
  timeStudied: { en: 'Time studied', it: 'Tempo studio' },
  cardsLearned: { en: 'Cards started', it: 'Carte iniziate' },
  struggleCards: { en: 'Struggle cards', it: 'Carte difficili' },
  noStruggles: { en: 'No struggle cards yet — keep it up!', it: 'Nessuna carta difficile — continua così!' },
  totalCards: { en: 'Total cards', it: 'Carte totali' },
  mature: { en: 'Mature', it: 'Mature' },
  streak: { en: 'Day streak', it: 'Giorni di fila' },
  back: { en: 'Back', it: 'Indietro' },
  loading: { en: 'Loading…', it: 'Caricamento…' },

  adventure: { en: 'Adventure', it: 'Avventura' },
  collection: { en: 'Collection', it: 'Collezione' },
  heroes: { en: 'Heroes', it: 'Eroi' },
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
  },
  fictional: { en: 'Fictional', it: 'Di fantasia' },
  realPeople: { en: 'Real People', it: 'Persone reali' },

  // Settings — danger zone
  dangerZone: { en: 'Danger zone', it: 'Zona pericolosa' },
  dangerZoneDesc: {
    en: 'Reset all progress: study history (SRS), XP, levels, unlocks and achievements. Your decks and settings are kept.',
    it: 'Azzera tutti i progressi: cronologia di studio (SRS), XP, livelli, sblocchi e obiettivi. I mazzi e le impostazioni restano.'
  },
  resetProgress: { en: 'Reset progress', it: 'Azzera i progressi' },
  resetConfirm: { en: 'Yes, reset everything', it: 'Sì, azzera tutto' },
  cancel: { en: 'Cancel', it: 'Annulla' },
  progressReset: { en: 'Progress reset to zero.', it: 'Progressi azzerati.' },

  // Study — select all
  selectAll: { en: 'Select all', it: 'Seleziona tutto' },
  unselectAll: { en: 'Unselect all', it: 'Deseleziona tutto' },
  lines: { en: 'lines', it: 'frasi' },

  // What's new popup
  whatsNew: { en: "What's new", it: 'Novità' },
  gotIt: { en: 'Got it!', it: 'Fantastico!' },

  // Stories
  stampAlbum: { en: 'Stamp album', it: 'Album dei timbri' },
  stampEarned: { en: 'Stamp earned!', it: 'Timbro ottenuto!' },
  showTranslation: { en: 'Show translation', it: 'Mostra traduzione' },
  answerQuestions: { en: 'Answer the questions', it: 'Rispondi alle domande' },
  correctCount: { en: 'correct', it: 'corrette' },
  tryAgainStamp: { en: 'Try again to earn the stamp!', it: 'Riprova per ottenere il timbro!' },
  readAgain: { en: 'Read again', it: 'Rileggi' },
  moreStories: { en: 'More stories', it: 'Altre storie' },

  // Kanji sheet
  kanjiOnScreen: { en: 'Kanji on screen', it: 'Kanji sullo schermo' },
  noKanji: { en: 'No kanji on screen.', it: 'Nessun kanji sullo schermo.' },
  kunLabel: { en: 'kun (native):', it: 'kun (nativo):' },
  onLabel: { en: 'on (Chinese):', it: 'on (cinese):' },
  meaningLabel: { en: 'meaning:', it: 'significato:' },

  // Auth / cloud sync
  cloudSync: { en: 'Cloud sync', it: 'Sincronizzazione cloud' },
  on: { en: 'on', it: 'attivo' },
  syncUnavailable: { en: 'Sync not available yet.', it: 'Sincronizzazione non ancora disponibile.' },
  logIn: { en: 'Log in', it: 'Accedi' },
  signUp: { en: 'Sign up', it: 'Registrati' },
  signIn: { en: 'Sign in', it: 'Accedi' },
  signOut: { en: 'Sign out', it: 'Esci' },
  createAccount: { en: 'Create account', it: 'Crea account' },
  accountCreated: { en: 'Account created.', it: 'Account creato.' },
  loggedIn: { en: 'Logged in.', it: 'Accesso effettuato.' },
  confirmEmailThenLogin: { en: 'Confirm your email, then log in.', it: 'Conferma la tua email, poi accedi.' },
  syncError: { en: 'Sync error', it: 'Errore di sincronizzazione' },
  syncing: { en: 'Syncing…', it: 'Sincronizzazione…' },
  allSaved: { en: 'All changes saved automatically', it: 'Tutto salvato automaticamente' },
  autoSaved: { en: 'Auto-saved', it: 'Salvato automaticamente' },
  settingsLabel: { en: 'Settings', it: 'Impostazioni' },
  enterEmailFirst: { en: 'Enter your email first.', it: 'Inserisci prima la tua email.' },
  resetEmailSent: { en: 'Password reset email sent.', it: 'Email di reset inviata.' },
  invalidCredentials: { en: 'Invalid email or password.', it: 'Email o password non validi.' },
  alreadyRegistered: { en: 'Email already registered. Log in.', it: 'Email già registrata. Accedi.' },
  loginToSave: { en: 'Log in to save your progress everywhere', it: 'Accedi per salvare i progressi ovunque' },
  rememberMe: { en: 'Remember me on this device', it: 'Ricordami su questo dispositivo' },
  forgotPassword: { en: 'Forgot password?', it: 'Password dimenticata?' },
  continueWithout: { en: 'Continue without an account →', it: 'Continua senza account →' },
  confirmEmailSent: {
    en: "We've sent a confirmation email. Confirm it, then log in.",
    it: "Ti abbiamo inviato un'email di conferma. Confermala, poi accedi."
  },
  storiesIntro: {
    en: 'Read a story, then answer the questions. Stories get progressively harder.',
    it: 'Leggi una storia, poi rispondi alle domande. Le storie diventano più difficili.'
  }
};

export function translate(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
