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
  menu: { en: 'Menu', it: 'Menu' },
  study: { en: 'Study', it: 'Studia' },
  lessons: { en: 'Lessons', it: 'Lezioni' },
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
  skins: { en: 'Skins', it: 'Skin' },
  skinDefault: { en: 'Default (Dark)', it: 'Predefinita (Scura)' },
  skinDefaultDesc: { en: 'The original Nihongo Quest dark look.', it: 'Lo stile scuro originale di Nihongo Quest.' },
  skinLight: { en: 'Light', it: 'Chiara' },
  skinLightDesc: { en: 'Clean iOS-inspired warm off-white.', it: 'Bianco caldo pulito ispirato a iOS.' },
  skinSmash64: { en: 'Smash 64', it: 'Smash 64' },
  skinSmash64Desc: { en: 'Chunky, arcade, character-select energy.', it: 'Massiccia, arcade, da selezione personaggi.' },
  skinSakura: { en: 'Sakura', it: 'Sakura' },
  skinSakuraDesc: { en: 'Soft pinks, plum shadows, warm paper.', it: 'Rosa delicati, ombre prugna, carta calda.' },
  skinStation: { en: 'Station', it: 'Stazione' },
  skinStationDesc: { en: 'Transit-board contrast with orange and cyan.', it: 'Contrasto da tabellone ferroviario con arancio e ciano.' },
  skinNature: { en: 'Nature', it: 'Natura' },
  skinNatureDesc: { en: 'Deep greens, moss surfaces, sunlight accents.', it: 'Verdi profondi, superfici muschio, accenti solari.' },
  skinComet: { en: 'Comet', it: 'Cometa' },
  skinCometDesc: { en: 'Cinematic twilight sky, glass panels, electric cyan.', it: 'Cielo crepuscolare cinematografico, pannelli di vetro, ciano elettrico.' },
  skinFuji: { en: 'Fuji', it: 'Fuji' },
  skinFujiDesc: { en: 'Calm sunrise blues, snow, lake reflections, and soft rose light.', it: 'Blu dell alba, neve, riflessi sul lago e luce rosa delicata.' },
  skinSushi: { en: 'Sushi', it: 'Sushi' },
  skinSushiDesc: { en: 'Warm counter wood, rice white, nori green, and cozy lantern glow.', it: 'Legno caldo da bancone, bianco riso, verde nori e luce di lanterna.' },
  skinCountryside: { en: 'Countryside', it: 'Campagna' },
  skinCountrysideDesc: { en: 'Rice fields, open sky, straw gold, and fresh rural greens.', it: 'Risaie, cielo aperto, oro paglia e verdi rurali freschi.' },
  skinSamurai: { en: 'Samurai', it: 'Samurai' },
  skinSamuraiDesc: { en: 'Dark lacquer, steel blues, candlelight, and focused castle calm.', it: 'Lacca scura, blu acciaio, lume di candela e calma da castello.' },
  skinTemple: { en: 'Temple', it: 'Tempio' },
  skinTempleDesc: { en: 'Vermilion wood, moss, stone lanterns, and golden morning air.', it: 'Legno vermiglio, muschio, lanterne di pietra e aria dorata del mattino.' },
  skinDojo: { en: 'Dojo', it: 'Dojo' },
  skinDojoDesc: { en: 'Tatami greens, warm wood, paper screens, and quiet discipline.', it: 'Verdi tatami, legno caldo, shoji e disciplina silenziosa.' },
  skinTouge: { en: 'Touge', it: 'Touge' },
  skinTougeDesc: { en: 'Midnight mountain roads, wet asphalt, teal glow, and red light trails.', it: 'Strade di montagna notturne, asfalto bagnato, bagliori teal e scie rosse.' },
  newPerDay: { en: 'New cards per day', it: 'Nuove carte al giorno' },
  showRomaji: { en: 'Show romaji', it: 'Mostra romaji' },
  showLessonAlways: { en: 'Always show mini-lesson', it: 'Mostra sempre mini-lezione' },
  showLessonAlwaysDesc: {
    en: 'Show the explanation even when you answer correctly.',
    it: 'Mostra la spiegazione anche quando rispondi correttamente.'
  },
  autoAudio: { en: 'Auto-play audio', it: 'Audio automatico' },
  xrayKanjiSize: { en: 'Kanji X-ray size', it: 'Dimensione X-ray kanji' },
  xrayKanjiSizeDesc: {
    en: 'Designer presets from the X-ray size config file.',
    it: 'Preset designer dal file di configurazione dimensioni X-ray.'
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
  homeStudyDesc: { en: 'Flashcards, quizzes & typing', it: 'Flashcard, quiz e scrittura' },
  homeLessonsDesc: { en: 'Grammar, particles & useful vocab', it: 'Grammatica, particelle e vocaboli utili' },
  homeAdventureDesc: { en: 'Character reading challenges', it: 'Sfide di lettura dei personaggi' },
  homeCharactersDesc: { en: 'Character reading challenges', it: 'Sfide di lettura dei personaggi' },
  homeCustomDesc: { en: 'Flashcards, quizzes, typing, and deck mixes', it: 'Flashcard, quiz, scrittura e mix di mazzi' },
  homeStoriesDesc: { en: 'Read & comprehend', it: 'Leggi e comprendi' },
  homeGuideDesc: { en: 'Read the grammar textbook', it: 'Leggi il libro di grammatica' },
  test: { en: 'Test', it: 'Test' },
  custom: { en: 'Custom', it: 'Personalizzato' },
  levels: { en: 'Levels', it: 'Livelli' },
  guide: { en: 'Guide', it: 'Guida' },
  guideIntro: {
    en: 'A real beginner grammar textbook — read it chapter by chapter, from the writing system up.',
    it: 'Un vero libro di grammatica per principianti — leggilo capitolo per capitolo, dal sistema di scrittura in poi.'
  },
  chaptersRead: { en: 'chapters read', it: 'capitoli letti' },
  markRead: { en: 'Mark as read', it: 'Segna come letto' },
  bookSource: { en: 'Source', it: 'Fonte' },
  readFullChapter: { en: 'Read the full chapter', it: 'Leggi il capitolo completo' },
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
  toNextLevel: { en: 'to next level', it: 'al prossimo livello' },
  youLabel: { en: 'You', it: 'Tu' },
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
  lessonsTitle: { en: 'Japanese lessons for the whole app', it: 'Lezioni di giapponese per tutta l app' },
  lessonsIntro: {
    en: 'Short guided lessons for the grammar, vocabulary and reading patterns you meet in stories, character challenges and cards.',
    it: 'Brevi lezioni guidate per grammatica, vocabolario e strutture di lettura che trovi in storie, sfide e carte.'
  },
  lessonsMenuTitle: { en: 'Choose a lesson', it: 'Scegli una lezione' },
  lessonsMenuIntro: {
    en: 'One quiet lesson at a time. Read, respond, take the quiz, then return here.',
    it: 'Una lezione tranquilla alla volta. Leggi, rispondi, fai il quiz, poi torna qui.'
  },
  lessonProgress: { en: 'Lesson progress', it: 'Progresso lezioni' },
  lessonCategories: { en: 'Categories', it: 'Categorie' },
  completed: { en: 'Completed', it: 'Completata' },
  categoryComplete: { en: 'All complete', it: 'Tutto completato' },
  missingLesson: { en: 'Missing', it: 'Mancante' },
  missingLessons: { en: 'missing', it: 'mancanti' },
  markComplete: { en: 'Mark complete', it: 'Segna completata' },
  markIncomplete: { en: 'Mark incomplete', it: 'Segna incompleta' },
  lessonPart: { en: 'Lesson', it: 'Lezione' },
  lessonNote: { en: 'Note', it: 'Nota' },
  quizAfterIntro: { en: 'Quiz after intro', it: 'Quiz dopo introduzione' },
  continueLesson: { en: 'Continue', it: 'Continua' },
  startLessonQuiz: { en: 'Start quiz', it: 'Inizia quiz' },
  lessonQuiz: { en: 'Lesson quiz', it: 'Quiz lezione' },
  finishQuiz: { en: 'Finish quiz', it: 'Finisci quiz' },
  lessonPassed: { en: 'Lesson complete', it: 'Lezione completata' },
  lessonCompleteBody: {
    en: 'Nice work. This lesson is now counted as complete.',
    it: 'Bel lavoro. Questa lezione ora conta come completata.'
  },
  lessonRetryTitle: { en: 'Review and retry', it: 'Ripassa e riprova' },
  readLessonAgain: { en: 'Read lesson again', it: 'Rileggi la lezione' },
  retryQuiz: { en: 'Retry quiz', it: 'Riprova quiz' },
  returnToLessons: { en: 'Return to lessons', it: 'Torna alle lezioni' },
  chooseFocus: { en: 'Before moving on, choose the focus.', it: 'Prima di continuare, scegli il punto importante.' },
  focusGuessing: { en: 'Just guess from the English.', it: 'Indovinare solo dall inglese.' },
  focusNudge: {
    en: 'Almost. Try to follow the Japanese pattern, not only the translation.',
    it: 'Quasi. Prova a seguire la struttura giapponese, non solo la traduzione.'
  },
  youWillLearn: { en: 'You will learn', it: 'Imparerai' },
  patterns: { en: 'Patterns', it: 'Strutture' },
  examples: { en: 'Examples', it: 'Esempi' },
  recommendedLessons: { en: 'Recommended lessons', it: 'Lezioni consigliate' },
  missingLessonsWarning: {
    en: 'You may miss key vocabulary or grammar here.',
    it: 'Qui potresti perdere vocaboli o grammatica importanti.'
  },
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
  selectiveReset: { en: 'Reset one section', it: 'Azzera una sezione' },
  selectiveResetDesc: {
    en: 'Clear only the part you choose. Decks, settings and login are kept.',
    it: 'Cancella solo la parte scelta. Mazzi, impostazioni e accesso restano.'
  },
  resetSrs: { en: 'Study reviews', it: 'Ripassi studio' },
  resetSrsDesc: { en: 'Reset SRS card history only.', it: 'Azzera solo la cronologia SRS delle carte.' },
  resetAdventure: { en: 'Adventure XP and levels', it: 'XP e livelli Avventura' },
  resetAdventureDesc: { en: 'Reset XP, hero level, streaks and encounters.', it: 'Azzera XP, livello eroe, serie e incontri.' },
  resetChallengesOnly: { en: 'Character challenges', it: 'Sfide personaggi' },
  resetChallengesOnlyDesc: {
    en: 'Lock real-person Icons and fictional Characters again. XP stays as-is.',
    it: 'Riblocca Icone reali e Personaggi di fantasia. Gli XP restano.'
  },
  resetStoriesOnly: { en: 'Story progress', it: 'Progressi storie' },
  resetStoriesOnlyDesc: { en: 'Clear completed stories only.', it: 'Cancella solo le storie completate.' },
  resetLessonsOnly: { en: 'Lesson progress', it: 'Progressi lezioni' },
  resetLessonsOnlyDesc: { en: 'Clear completed lessons only.', it: 'Cancella solo le lezioni completate.' },
  resetAchievementsOnly: { en: 'Achievements', it: 'Obiettivi' },
  resetAchievementsOnlyDesc: { en: 'Clear earned achievement badges only.', it: 'Cancella solo gli obiettivi ottenuti.' },
  resetSectionAction: { en: 'Reset', it: 'Azzera' },
  resetSectionConfirm: { en: 'Confirm', it: 'Conferma' },
  sectionResetDone: { en: 'Section reset.', it: 'Sezione azzerata.' },
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
  showTranslation: { en: 'Show translation', it: 'Mostra traduzione' },
  answerQuestions: { en: 'Answer the questions', it: 'Rispondi alle domande' },
  correctCount: { en: 'correct', it: 'corrette' },
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
  },

  todaysReview: { en: "Today's review", it: 'Ripasso di oggi' },
  dueReadyNow: { en: 'cards ready to review now', it: 'carte pronte da rivedere ora' },
  allCaughtUp: { en: 'All caught up — nothing due!', it: 'Tutto in pari — niente da rivedere!' },
  plusNewToday: { en: 'new today', it: 'nuove oggi' },
  newWaiting: { en: 'new waiting', it: 'nuove in attesa' },
  inCollection: { en: 'in collection', it: 'in raccolta' },
  reviewExplain: {
    en: 'Spaced-repetition reviews are scheduled automatically — study the due ones each day to remember them long-term.',
    it: 'I ripassi a ripetizione dilazionata sono pianificati in automatico — studia ogni giorno quelle in scadenza per ricordarle a lungo.'
  }
};

export function translate(key: string, lang: Lang): string {
  const entry = strings[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
