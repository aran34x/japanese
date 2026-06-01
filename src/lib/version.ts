// App version + changelog. Bump APP_VERSION on each release and add an entry;
// the "What's new" popup shows entries the user hasn't seen yet.
export const APP_VERSION = '0.8.0';

export interface ChangelogEntry {
  version: string;
  date: string;
  title: { en: string; it: string };
  changes: { en: string; it: string }[];
}

// Newest first.
export const CHANGELOG: ChangelogEntry[] = [
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
