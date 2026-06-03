import type { GameState } from './state';

export interface Achievement {
  id: string;
  icon: string;       // emoji fallback
  imageUrl?: string;  // Wikipedia Commons image (shown when earned)
  name: { en: string; it: string };
  desc: { en: string; it: string };
  /** Returns true once earned, given the current game state. */
  test: (s: GameState) => boolean;
}

// Wikipedia Commons images via Special:FilePath redirect.
// If a URL breaks, the emoji fallback (icon) shows instead.
const wiki = (file: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${file}`;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-blood',
    icon: '🌸',
    imageUrl: wiki('9/9f/Cherry_blossoms_in_Vancouver_3_crop.jpg/96px-Cherry_blossoms_in_Vancouver_3_crop.jpg'),
    name: { en: 'Sakura Spirit', it: 'Spirito Sakura' },
    desc: { en: 'Answer your first card', it: 'Rispondi alla prima carta' },
    test: (s) => s.totalCorrect + s.totalWrong >= 1
  },
  {
    id: 'combo-10',
    icon: '🥁',
    imageUrl: wiki('9/9d/Wadaiko_drum.jpg/96px-Wadaiko_drum.jpg'),
    name: { en: 'Matsuri Drummer', it: 'Batterista del Matsuri' },
    desc: { en: 'Reach a 10-answer streak', it: 'Raggiungi una serie di 10' },
    test: (s) => s.bestStreak >= 10
  },
  {
    id: 'combo-25',
    icon: '⚔️',
    imageUrl: wiki('e/e3/Samurai_armour%2C_Edo_period%2C_Japan.jpg/96px-Samurai_armour%2C_Edo_period%2C_Japan.jpg'),
    name: { en: 'Bushido Blade', it: 'Lama del Bushido' },
    desc: { en: 'Reach a 25-answer streak', it: 'Raggiungi una serie di 25' },
    test: (s) => s.bestStreak >= 25
  },
  {
    id: 'over-9000',
    icon: '🦊',
    imageUrl: wiki('8/8b/Kitsune_Mythology_Cassetteboy.jpg/96px-Kitsune_Mythology_Cassetteboy.jpg'),
    name: { en: 'Fox Fire', it: 'Fuoco della Volpe' },
    desc: { en: 'Unlock the Kitsune Adept', it: "Sblocca l'Adepto Kitsune" },
    test: (s) => s.xp >= 1800
  },
  {
    id: 'boss-slayer',
    icon: '👹',
    imageUrl: wiki('2/28/Hannya.jpg/96px-Hannya.jpg'),
    name: { en: 'Oni Breaker', it: 'Spezzatore di Oni' },
    desc: { en: 'Defeat a boss encounter', it: 'Sconfiggi un boss' },
    test: (s) => s.bossesDefeated >= 1
  },
  {
    id: 'boss-master',
    icon: '🐦',
    imageUrl: wiki('b/bc/Tengu_Hiroshige.jpg/96px-Tengu_Hiroshige.jpg'),
    name: { en: 'Tengu Vanquisher', it: 'Sterminatore di Tengu' },
    desc: { en: 'Defeat 10 bosses', it: 'Sconfiggi 10 boss' },
    test: (s) => s.bossesDefeated >= 10
  },
  {
    id: 'streak-7',
    icon: '⛩️',
    imageUrl: wiki('6/68/Fushimi_Inari_Taisha_shrine%2C_Kyoto%2C_Japan.jpg/96px-Fushimi_Inari_Taisha_shrine%2C_Kyoto%2C_Japan.jpg'),
    name: { en: 'Shrine Keeper', it: 'Guardiano del Santuario' },
    desc: { en: 'Study 7 days in a row', it: 'Studia 7 giorni di fila' },
    test: (s) => s.dayStreak >= 7
  },
  {
    id: 'century',
    icon: '🗻',
    imageUrl: wiki('1/1b/080103_hakkai_fuji.jpg/96px-080103_hakkai_fuji.jpg'),
    name: { en: 'Fuji Climber', it: 'Scalatore del Fuji' },
    desc: { en: 'Answer 100 cards correctly', it: 'Rispondi a 100 carte correttamente' },
    test: (s) => s.totalCorrect >= 100
  },
  {
    id: 'sharpshooter',
    icon: '🏹',
    imageUrl: wiki('e/e6/Kyudo_Range_Meiji_Jingu.jpg/96px-Kyudo_Range_Meiji_Jingu.jpg'),
    name: { en: 'Kyudo Master', it: 'Maestro di Kyudo' },
    desc: { en: '95%+ accuracy over 50+ answers', it: '95%+ di precisione su 50+ risposte' },
    test: (s) => {
      const total = s.totalCorrect + s.totalWrong;
      return total >= 50 && s.totalCorrect / total >= 0.95;
    }
  },
  {
    id: 'gambler',
    icon: '🎴',
    imageUrl: wiki('7/7f/Hanafuda_Chrysanthemum.jpg/96px-Hanafuda_Chrysanthemum.jpg'),
    name: { en: 'Hanafuda Ace', it: 'Asso dell\'Hanafuda' },
    desc: { en: 'Win a Double-or-Nothing', it: 'Vinci un Raddoppia-o-Niente' },
    test: (s) => s.gamblesWon >= 1
  },
  {
    id: 'speed-demon',
    icon: '🚅',
    imageUrl: wiki('5/50/Shinkansen_N700.jpg/96px-Shinkansen_N700.jpg'),
    name: { en: 'Bullet Train', it: 'Treno Proiettile' },
    desc: { en: 'Score 15+ in a Speed Round', it: 'Fai 15+ in un Round Veloce' },
    test: (s) => s.bestSpeedRound >= 15
  },
  {
    id: 'legend',
    icon: '🏯',
    imageUrl: wiki('5/5f/Himeji_Castle_The_White_Heron_Castle.jpg/96px-Himeji_Castle_The_White_Heron_Castle.jpg'),
    name: { en: 'Immortal', it: 'Immortale' },
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
