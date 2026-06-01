import { writable, get } from 'svelte/store';
import { db } from '../db';
import { characterForXp, nextUnlock, CHARACTERS } from './characters';
import { newlyEarned } from './achievements';

// Persistent gamification state for Adventure mode.
export interface GameState {
  xp: number;
  totalCorrect: number;
  totalWrong: number;
  bestStreak: number;
  dayStreak: number;
  lastPlayedDay: string; // YYYY-MM-DD
  bossesDefeated: number;
  gamblesWon: number;
  bestSpeedRound: number;
  achievements: string[];
  unlockedCharacters: string[];
  /** ids of real-person "Icons" whose challenge has been cleared. */
  unlockedPeople: string[];
  /** ids of fictional characters whose challenge has been cleared. */
  unlockedFictional: string[];
}

export const DEFAULT_GAME: GameState = {
  xp: 0,
  totalCorrect: 0,
  totalWrong: 0,
  bestStreak: 0,
  dayStreak: 0,
  lastPlayedDay: '',
  bossesDefeated: 0,
  gamblesWon: 0,
  bestSpeedRound: 0,
  achievements: [],
  unlockedCharacters: ['mochi'],
  unlockedPeople: [],
  unlockedFictional: []
};

export const game = writable<GameState>(DEFAULT_GAME);

// Transient toast queue for unlocks/achievements (shown by the UI).
export interface Toast {
  id: number;
  kind: 'character' | 'achievement' | 'levelup';
  title: string;
  subtitle: string;
  icon?: string;
}
export const toasts = writable<Toast[]>([]);
let toastId = 0;
export function pushToast(t: Omit<Toast, 'id'>) {
  const id = ++toastId;
  toasts.update((list) => [...list, { ...t, id }]);
  setTimeout(() => toasts.update((list) => list.filter((x) => x.id !== id)), 4200);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function loadGame() {
  const row = await db.meta.get('gamestate');
  game.set({ ...DEFAULT_GAME, ...((row?.value as Partial<GameState>) ?? {}) });
}

async function persist(s: GameState) {
  await db.meta.put({ key: 'gamestate', value: s });
}

/** Register a day of activity and update the consecutive-day streak. */
export function touchDay(s: GameState): GameState {
  const t = today();
  if (s.lastPlayedDay === t) return s;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const dayStreak = s.lastPlayedDay === yesterday ? s.dayStreak + 1 : 1;
  return { ...s, lastPlayedDay: t, dayStreak };
}

/**
 * Apply a batch of mutations to the game state, then detect new character
 * unlocks and achievements and fire toasts. Returns the updated state.
 */
export async function mutateGame(fn: (s: GameState) => GameState) {
  const before = get(game);
  const prevChar = characterForXp(before.xp).index;

  let next = fn({ ...before });
  next = touchDay(next);

  // Character unlocks by XP.
  const nowChar = characterForXp(next.xp).index;
  if (nowChar > prevChar) {
    for (let i = prevChar + 1; i <= nowChar; i++) {
      const c = CHARACTERS[i];
      if (!next.unlockedCharacters.includes(c.id)) next.unlockedCharacters.push(c.id);
      pushToast({
        kind: 'character',
        title: `Unlocked: ${c.name}`,
        subtitle: `Power level ${c.power}`,
        icon: '✨'
      });
    }
  }

  // Achievements.
  const earned = newlyEarned(next);
  if (earned.length) {
    next.achievements = [...next.achievements, ...earned];
    // toast text filled in by UI lookup; keep id here
    for (const id of earned) pushToast({ kind: 'achievement', title: id, subtitle: '', icon: '🏅' });
  }

  game.set(next);
  await persist(next);
  return next;
}

/** XP for a single correct answer given the current combo streak. */
export function xpForAnswer(streak: number, hard = false): number {
  const base = 10;
  const comboBonus = Math.min(streak, 20) * 2; // up to +40
  return Math.round((base + comboBonus) * (hard ? 1.5 : 1));
}

/** Mark a real-person Icon as unlocked and award XP (idempotent). */
export async function unlockPerson(id: string, xp: number, name: string) {
  const before = get(game);
  if (before.unlockedPeople.includes(id)) return;
  pushToast({ kind: 'character', title: `Unlocked: ${name}`, subtitle: '+' + xp + ' XP', icon: '🌟' });
  await mutateGame((g) =>
    g.unlockedPeople.includes(id)
      ? g
      : { ...g, xp: g.xp + xp, unlockedPeople: [...g.unlockedPeople, id] }
  );
}

/** Mark a fictional character as unlocked and award XP (idempotent). */
export async function unlockFictional(id: string, xp: number, name: string) {
  const before = get(game);
  if (before.unlockedFictional.includes(id)) return;
  pushToast({ kind: 'character', title: `Unlocked: ${name}`, subtitle: '+' + xp + ' XP', icon: '🎉' });
  await mutateGame((g) =>
    g.unlockedFictional.includes(id)
      ? g
      : { ...g, xp: g.xp + xp, unlockedFictional: [...g.unlockedFictional, id] }
  );
}

export { characterForXp, nextUnlock };
