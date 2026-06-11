// App version + changelog. Bump APP_VERSION on each release and add an entry;
// the "What's new" popup shows entries the user hasn't seen yet.
export const APP_VERSION = '0.24.0';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: { en: string; it: string };
  changes: { en: string; it: string }[];
}

// Newest first.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: '0.24.0',
    date: '2026-06-11',
    title: { en: 'First lesson rebuilt for real teaching', it: 'Prima lezione rifatta per insegnare davvero' },
    changes: [
      { en: '"Kana for Names" now has a proper quiz: recognize the script, read マ by sound, sound out マリオ block by block, handle long vowels (ルイージ), and build ナルト by tapping the blocks. No more "Mario → Mario".', it: '"Kana per i nomi" ora ha un vero quiz: riconosci la scrittura, leggi マ per suono, pronuncia マリオ blocco per blocco, gestisci le vocali lunghe (ルイージ) e costruisci ナルト toccando i blocchi. Niente più "Mario → Mario".' }
    ]
  },
  {
    version: '0.23.0',
    date: '2026-06-10',
    title: { en: 'Taught like a teacher would', it: 'Insegnato come farebbe un insegnante' },
    changes: [
      { en: 'New cards in Study are now TAUGHT first (character + reading + meaning + audio), then quizzed — no more blind first guess.', it: 'Le carte nuove in Studia vengono prima INSEGNATE (carattere + lettura + significato + audio), poi chieste — niente più primo tentativo alla cieca.' },
      { en: 'Quiz options are confusable on purpose (Monday vs Tuesday, め vs ぬ, シ vs ツ) instead of random giveaways.', it: 'Le opzioni dei quiz sono volutamente confondibili (lunedì vs martedì, め vs ぬ) invece di risposte ovvie.' },
      { en: 'Typing answers are forgiving: "eat" for "to eat", "lunedi" for "lunedì", "ohayo" for "ohayou".', it: 'Le risposte scritte sono tolleranti: "eat" per "to eat", "lunedi" per "lunedì", "ohayo" per "ohayou".' },
      { en: 'New cards arrive in learning order: hiragana → katakana → words → kanji → sentences.', it: 'Le carte nuove arrivano in ordine didattico: hiragana → katakana → parole → kanji → frasi.' }
    ]
  },
  {
    version: '0.22.0',
    date: '2026-06-09',
    title: { en: 'Lessons, rebuilt Bunpo-style', it: 'Lezioni, rifatte in stile Bunpo' },
    changes: [
      { en: 'Lessons are now a JLPT level path (Start → N5 → N5+ → N4): one clear grammar point per lesson — meaning, how to make it, and real examples (tap 🔊 to hear them).', it: 'Le lezioni sono ora un percorso per livello (Start → N5 → N5+ → N4): un punto grammaticale chiaro per lezione — significato, come si forma ed esempi reali (tocca 🔊 per ascoltarli).' },
      { en: 'New practice: multiple-choice, fill-in-the-blank, and "build the sentence" word-order exercises — no more vague filler.', it: 'Nuove esercitazioni: scelta multipla, completa lo spazio e "componi la frase" — niente più riempitivi vaghi.' },
      { en: 'Grammar content is grounded in the Guide (Tae Kim), so it is accurate and consistent.', it: 'I contenuti grammaticali sono basati sulla Guida (Tae Kim), quindi sono accurati e coerenti.' }
    ]
  },
  {
    version: '0.21.0',
    date: '2026-06-08',
    title: { en: 'A real grammar guide — and grounded Lessons', it: 'Una vera guida di grammatica — e lezioni fondate' },
    changes: [
      { en: 'New Guide section: read a real beginner grammar textbook (Tae Kim, CC BY-NC-SA) chapter by chapter — from the writing system through だ/です, particles, adjectives and verbs.', it: 'Nuova sezione Guida: leggi un vero libro di grammatica per principianti (Tae Kim) capitolo per capitolo — dal sistema di scrittura a だ/です, particelle, aggettivi e verbi.' },
      { en: 'Lessons are now grounded in that book: real examples and explanations, with a "Read the full chapter" link on each grammar lesson.', it: 'Le lezioni sono ora fondate su quel libro: esempi e spiegazioni reali, con un link "Leggi il capitolo completo" su ogni lezione di grammatica.' },
      { en: 'Lesson quizzes rebuilt: particle lessons now actually test particle choice, and wrong answers are real, varied sentences.', it: 'Quiz delle lezioni rifatti: le lezioni sulle particelle ora testano davvero la scelta della particella, e le risposte sbagliate sono frasi reali e varie.' },
      { en: 'Emojis adopt your skin color (monochrome Noto Emoji), and each skin now has its own font.', it: 'Le emoji assumono il colore della skin (Noto Emoji monocromatica) e ogni skin ha il proprio font.' }
    ]
  },
  {
    version: '0.20.0',
    date: '2026-06-08',
    title: { en: 'Lessons, a new home, and themeable skins', it: 'Lezioni, nuova home e skin personalizzabili' },
    changes: [
      { en: 'New Lessons mode: guided grammar, particle & vocab lessons grouped by topic and JLPT level, each ending in a short quiz.', it: 'Nuova modalità Lezioni: lezioni guidate di grammatica, particelle e vocaboli per argomento e livello JLPT, con un breve quiz finale.' },
      { en: 'Home is now a game-style mode-select (Study · Lessons · Adventure · Stories), and everything you do earns XP toward your level.', it: 'La Home è ora una selezione modalità in stile gioco (Studia · Lezioni · Avventura · Storie) e tutto ciò che fai dà XP per salire di livello.' },
      { en: 'Adventure is now your Characters & Heroes collection — your level appears once, not twice.', it: 'Avventura è ora la tua collezione di Personaggi ed Eroi — il tuo livello appare una volta, non due.' },
      { en: 'Skins overhaul: every skin has its own colors AND font; Light is now just a skin; buttons and text stay readable on all of them.', it: 'Revisione skin: ogni skin ha colori E font propri; Chiara è ora una skin; pulsanti e testo restano leggibili ovunque.' },
      { en: 'Kanji X-ray: drag with a precision crosshair that stays above your finger; the reading card never hides under your hand and matches your skin.', it: 'Raggi-X Kanji: trascina con un mirino di precisione sopra il dito; la scheda di lettura non si nasconde sotto la mano e segue la skin.' },
      { en: 'Flashcards: the daily review dashboard now lives in Study → Flashcards. Fixed: level coin images now show on the live app.', it: 'Flashcard: il riepilogo ripassi è ora in Studia → Flashcard. Corretto: le immagini delle monete livello ora si vedono nell\'app online.' }
    ]
  },
  {
    version: '0.19.0',
    date: '2026-06-02',
    title: { en: 'Accurate furigana readings', it: 'Furigana accurata' },
    changes: [
      { en: 'Furigana now reads words in context (今日 → きょう), using a real Japanese tokenizer.', it: 'La furigana ora legge le parole nel contesto (今日 → きょう), con un vero analizzatore.' },
      { en: 'The dictionary loads on first use and is cached for offline use.', it: 'Il dizionario si carica al primo uso e viene salvato per l\'uso offline.' }
    ]
  },
  {
    version: '0.18.0',
    date: '2026-06-02',
    title: { en: 'Bigger, harder stories', it: 'Storie più grandi' },
    changes: [
      { en: '13 stories now, ordered easy → hard, with more questions and typing tests.', it: '13 storie, dalla più facile alla più difficile, con più domande e test di scrittura.' },
      { en: 'Story titles shown in Japanese; pass the quiz to complete the story.', it: 'Titoli in giapponese; supera il quiz per completare la storia.' },
      { en: 'Story icons stay hidden until you complete them.', it: 'Le icone delle storie restano nascoste finché non le completi.' },
      { en: 'Kanji-on-screen panel: labels and meanings now follow the app language.', it: 'Pannello kanji: etichette e significati seguono la lingua dell\'app.' }
    ]
  },
  {
    version: '0.17.0',
    date: '2026-06-02',
    title: { en: 'Furigana, kanji meanings & proper account isolation', it: 'Furigana, significati kanji e account separati' },
    changes: [
      { en: 'The ふ button now adds readings above every kanji across the whole app.', it: 'Il pulsante ふ ora aggiunge la lettura sopra ogni kanji in tutta l\'app.' },
      { en: 'The 漢 button opens a panel listing every kanji on screen with its meaning.', it: 'Il pulsante 漢 apre un pannello con ogni kanji sullo schermo e il suo significato.' },
      { en: 'Fixed: a guest device no longer shows a previous account\'s unlocks/progress.', it: 'Corretto: un dispositivo ospite non mostra più sblocchi/progressi di un account precedente.' }
    ]
  },
  {
    version: '0.16.0',
    date: '2026-06-02',
    title: { en: 'Live account sync — no more manual backup', it: 'Sync account live — niente più backup manuale' },
    changes: [
      { en: 'Removed Upload/Download/Export/Import buttons — your account saves everything live, automatically.', it: 'Rimossi i pulsanti Carica/Scarica/Esporta/Importa — il tuo account salva tutto in tempo reale.' },
      { en: 'Sign in and your data + settings load automatically; sign out and the device starts clean.', it: "Accedi e i tuoi dati + impostazioni si caricano da soli; esci e il dispositivo riparte pulito." },
      { en: 'Sync errors are now shown clearly instead of failing silently.', it: 'Gli errori di sincronizzazione ora sono mostrati chiaramente.' }
    ]
  },
  {
    version: '0.15.0',
    date: '2026-06-02',
    title: { en: 'Furigana toggle & hidden story translations', it: 'Interruttore furigana e traduzioni nascoste' },
    changes: [
      { en: 'Replaced the magnifying lens with a simple ふ button to show/hide furigana above kanji.', it: 'Sostituita la lente con un semplice pulsante ふ per mostrare/nascondere la furigana.' },
      { en: 'In stories, a 漢 button per line lists all kanji meanings beside the text.', it: 'Nelle storie, un pulsante 漢 per riga elenca i significati dei kanji accanto al testo.' },
      { en: 'Story translations are now hidden until you tap "Show translation".', it: 'Le traduzioni delle storie sono nascoste finché non tocchi "Mostra traduzione".' }
    ]
  },
  {
    version: '0.14.0',
    date: '2026-06-02',
    title: { en: 'Kanji X-ray now works everywhere', it: 'I Raggi-X Kanji ora funzionano ovunque' },
    changes: [
      { en: 'With 🔍 on, hover (or tap) ANY kanji anywhere in the app to see its reading & meaning.', it: 'Con la 🔍 attiva, passa sopra (o tocca) QUALSIASI kanji ovunque per vederne lettura e significato.' },
      { en: 'A global lens follows your cursor — no longer limited to stories.', it: 'Una lente globale segue il cursore — non più solo nelle storie.' }
    ]
  },
  {
    version: '0.13.0',
    date: '2026-06-02',
    title: { en: 'Kanji X-ray 🔍', it: 'Raggi-X Kanji 🔍' },
    changes: [
      { en: 'Tap the 🔍 in the header to turn on Kanji X-ray.', it: 'Tocca la 🔍 in alto per attivare i Raggi-X Kanji.' },
      { en: 'In stories, hover (or tap) any kanji to see its reading and meaning; furigana appears above each one.', it: 'Nelle storie, passa sopra (o tocca) un kanji per vederne lettura e significato; la furigana appare sopra.' },
      { en: 'Readings are fetched once and cached, so it works offline afterwards.', it: 'Le letture vengono scaricate una volta e salvate, poi funziona offline.' }
    ]
  },
  {
    version: '0.12.0',
    date: '2026-06-02',
    title: { en: 'Story mode + new topic decks', it: 'Modalità storie + nuovi mazzi' },
    changes: [
      { en: 'New Story mode: read a simple story, then answer comprehension questions.', it: 'Nuova modalità Storie: leggi una storia semplice, poi rispondi a domande di comprensione.' },
      { en: 'New decks: Days & Time, Colors, Months, and Grammar patterns (must/should/can…).', it: 'Nuovi mazzi: Giorni e tempo, Colori, Mesi e strutture grammaticali.' },
      { en: 'Character challenges now ask a real fact about the character, not the name twice.', it: 'Le sfide dei personaggi ora chiedono un fatto reale, non due volte il nome.' },
      { en: 'Imported Anki decks (e.g. Core 2000) now keep their furigana reading.', it: 'I mazzi Anki importati (es. Core 2000) ora mantengono la lettura furigana.' }
    ]
  },
  {
    version: '0.11.0',
    date: '2026-06-01',
    title: { en: 'Wider on desktop, no more ugly scrollbars', it: 'Più largo su desktop, niente barre brutte' },
    changes: [
      { en: 'Category and tab selectors now wrap into neat rows instead of a horizontal scrollbar.', it: 'I selettori di categoria e schede ora vanno a capo invece di una barra di scorrimento.' },
      { en: 'The app uses a wider layout on PC, with more cards per row.', it: "L'app usa un layout più largo su PC, con più carte per riga." }
    ]
  },
  {
    version: '0.10.0',
    date: '2026-06-01',
    title: { en: 'Account menu & autosave', it: 'Menu account e salvataggio automatico' },
    changes: [
      { en: 'Account menu (top-right): your email, sync now, settings & data, sign out.', it: 'Menu account (in alto a destra): la tua email, sincronizza, impostazioni e dati, esci.' },
      { en: 'Everything autosaves — a small icon shows when it happens. Manual backup buttons removed.', it: 'Tutto si salva da solo — una piccola icona lo segnala. Rimossi i pulsanti di backup manuale.' },
      { en: 'Confetti + auto-advance on correct answers; smooth fade transitions between pages.', it: 'Coriandoli e avanzamento automatico sulle risposte corrette; transizioni in dissolvenza tra le pagine.' },
      { en: 'Select all/none for decks; deck descriptions; locked Icons stay hidden until unlocked.', it: 'Seleziona tutto/niente per i mazzi; descrizioni dei mazzi; le Icone bloccate restano nascoste.' }
    ]
  },
  {
    version: '0.9.0',
    date: '2026-06-01',
    title: { en: 'Remember me, reset, and N4 phrases', it: 'Ricordami, azzera e frasi N4' },
    changes: [
      { en: '"Remember me on this device" option on the login screen.', it: 'Opzione "Ricordami su questo dispositivo" nella schermata di accesso.' },
      { en: 'Reset all progress to zero from Settings → Danger zone.', it: 'Azzera tutti i progressi da Impostazioni → Zona pericolosa.' },
      { en: 'New "Phrases N4" deck: advanced everyday sentences like "There are lots of temples in Tokyo".', it: 'Nuovo mazzo "Frasi N4": frasi quotidiane avanzate come "A Tokyo ci sono molti templi".' }
    ]
  },
  {
    version: '0.8.0',
    date: '2026-06-01',
    title: { en: 'Real accounts (email + password)', it: 'Account reali (email + password)' },
    changes: [
      { en: 'Proper Sign up / Log in screen on startup — create an account with email and password.', it: 'Vera schermata Registrati / Accedi all\'avvio — crea un account con email e password.' },
      { en: 'You stay logged in across opens; progress syncs automatically.', it: 'Resti connesso tra le aperture; i progressi si sincronizzano automaticamente.' },
      { en: 'You can still continue without an account if you prefer.', it: 'Puoi comunque continuare senza account se preferisci.' }
    ]
  },
  {
    version: '0.7.0',
    date: '2026-06-01',
    title: { en: 'Cloud sync is live', it: 'Sincronizzazione cloud attiva' },
    changes: [
      { en: 'Sign in with your email in Settings → Cloud sync to save progress across devices.', it: 'Accedi con la tua email in Impostazioni → Sincronizzazione cloud per salvare i progressi su tutti i dispositivi.' },
      { en: 'No passwords — you get a one-tap login link in your inbox.', it: 'Niente password — ricevi un link di accesso con un tocco nella tua casella.' }
    ]
  },
  {
    version: '0.6.0',
    date: '2026-06-01',
    title: { en: 'Automatic cloud sync', it: 'Sincronizzazione cloud automatica' },
    changes: [
      { en: 'Connect a free Supabase account to sync progress across all your devices.', it: 'Collega un account Supabase gratuito per sincronizzare i progressi su tutti i dispositivi.' },
      { en: 'Sign in with email; your progress uploads automatically as you play.', it: 'Accedi via email; i progressi si caricano automaticamente mentre giochi.' },
      { en: 'See Settings → Cloud sync to set it up.', it: 'Vai su Impostazioni → Sincronizzazione cloud per configurarla.' }
    ]
  },
  {
    version: '0.5.0',
    date: '2026-06-01',
    title: { en: 'Auto-update & cloud-ready saves', it: 'Aggiornamento automatico e salvataggi' },
    changes: [
      { en: 'The app now updates itself every time you open it — no more incognito.', it: "L'app ora si aggiorna a ogni apertura — niente più incognito." },
      { en: 'This "What\'s new" popup will show you each update.', it: 'Questo popup "Novità" ti mostrerà ogni aggiornamento.' },
      { en: 'Backup & restore your progress to a file (cloud sync coming).', it: 'Backup e ripristino dei progressi su file (sync cloud in arrivo).' }
    ]
  },
  {
    version: '0.4.0',
    date: '2026-06-01',
    title: { en: 'Characters & Icons', it: 'Personaggi e Icone' },
    changes: [
      { en: 'New Characters tab: read the real Japanese names of Pikachu, Goku, Miku and more.', it: 'Nuova scheda Personaggi: leggi i veri nomi giapponesi di Pikachu, Goku, Miku e altri.' },
      { en: 'New Icons tab: real Japanese figures with live Wikipedia photos & bios.', it: 'Nuova scheda Icone: figure giapponesi reali con foto e bio dal vivo da Wikipedia.' }
    ]
  },
  {
    version: '0.3.0',
    date: '2026-06-01',
    title: { en: 'Adventure mode', it: 'Modalità Avventura' },
    changes: [
      { en: 'Level up, unlock heroes, battle bosses and earn achievements.', it: 'Sali di livello, sblocca eroi, sconfiggi boss e ottieni obiettivi.' },
      { en: 'Study modes now start instantly; deck-picking moved to Custom mode.', it: 'Le modalità di studio ora partono subito; la scelta dei mazzi è in modalità Personalizzata.' }
    ]
  }
];
