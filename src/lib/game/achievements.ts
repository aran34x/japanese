import type { GameState } from './state';

export interface Achievement {
  id: string;
  icon: string;
  name: { en: string; it: string };
  desc: { en: string; it: string };
  /** Returns true once earned, given the current game state. */
  test: (s: GameState) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    icon: '🌱',
    name: { en: 'First Steps', it: 'Primi Passi' },
    desc: { en: 'Answer your first card', it: 'Rispondi alla prima carta' },
    test: (s) => s.totalCorrect + s.totalWrong >= 1
  },
  {
    id: 'combo-10',
    icon: '🔥',
    name: { en: 'On Fire', it: 'In Fiamme' },
    desc: { en: 'Reach a 10-answer streak', it: 'Raggiungi una serie di 10' },
    test: (s) => s.bestStreak >= 10
  },
  {
    id: 'combo-25',
    icon: '⚡',
    name: { en: 'Combo King', it: 'Re delle Combo' },
    desc: { en: 'Reach a 25-answer streak', it: 'Raggiungi una serie di 25' },
    test: (s) => s.bestStreak >= 25
  },
  {
    id: 'over-9000',
    icon: '🦊',
    name: { en: "It's Over 9000", it: 'Oltre 9000' },
    desc: { en: 'Unlock the Kitsune Adept', it: "Sblocca l'Adepto Kitsune" },
    test: (s) => s.xp >= 1800
  },
  {
    id: 'boss-slayer',
    icon: '⚔️',
    name: { en: 'Boss Slayer', it: 'Sterminatore di Boss' },
    desc: { en: 'Defeat a boss encounter', it: 'Sconfiggi un boss' },
    test: (s) => s.bossesDefeated >= 1
  },
  {
    id: 'boss-master',
    icon: '👹',
    name: { en: 'Demon Bane', it: 'Flagello dei Demoni' },
    desc: { en: 'Defeat 10 bosses', it: 'Sconfiggi 10 boss' },
    test: (s) => s.bossesDefeated >= 10
  },
  {
    id: 'streak-7',
    icon: '🗓️',
    name: { en: 'Iron Will', it: 'Volontà di Ferro' },
    desc: { en: 'Study 7 days in a row', it: 'Studia 7 giorni di fila' },
    test: (s) => s.dayStreak >= 7
  },
  {
    id: 'century',
    icon: '💯',
    name: { en: 'Century', it: 'Centenario' },
    desc: { en: 'Answer 100 cards correctly', it: 'Rispondi a 100 carte correttamente' },
    test: (s) => s.totalCorrect >= 100
  },
  {
    id: 'sharpshooter',
    icon: '🎯',
    name: { en: 'Sharpshooter', it: 'Cecchino' },
    desc: { en: '95%+ accuracy over 50+ answers', it: '95%+ di precisione su 50+ risposte' },
    test: (s) => {
      const total = s.totalCorrect + s.totalWrong;
      return total >= 50 && s.totalCorrect / total >= 0.95;
    }
  },
  {
    id: 'gambler',
    icon: '🎴',
    name: { en: 'High Roller', it: 'Giocatore d\'Azzardo' },
    desc: { en: 'Win a Double-or-Nothing', it: 'Vinci un Raddoppia-o-Niente' },
    test: (s) => s.gamblesWon >= 1
  },
  {
    id: 'speed-demon',
    icon: '⏱️',
    name: { en: 'Speed Demon', it: 'Demone della Velocità' },
    desc: { en: 'Score 15+ in a Speed Round', it: 'Fai 15+ in un Round Veloce' },
    test: (s) => s.bestSpeedRound >= 15
  },
  {
    id: 'legend',
    icon: '☀️',
    name: { en: 'Living Legend', it: 'Leggenda Vivente' },
    desc: { en: 'Reach the FINAL FORM', it: 'Raggiungi la FORMA FINALE' },
    test: (s) => s.xp >= 400000
  }
];

/** Returns the ids of achievements newly satisfied that aren't already earned. */
export function newlyEarned(state: GameState): string[] {
  return ACHIEVEMENTS.filter((a) => !state.achievements.includes(a.id) && a.test(state)).map(
    (a) => a.id
  );
}
