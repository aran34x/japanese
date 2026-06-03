// Logic for the Adventure hero ladder. The roster DATA lives in
// src/lib/data/game/characters.ts; this module keeps the XP/level helpers
// and re-exports the data so existing imports keep working.
import { CHARACTERS, type GameCharacter } from '../data/game/characters';
export { CHARACTERS, type GameCharacter };


/** The character earned at a given total XP (highest threshold reached). */
export function characterForXp(xp: number): { character: GameCharacter; index: number } {
  let index = 0;
  for (let i = 0; i < CHARACTERS.length; i++) {
    if (xp >= CHARACTERS[i].xpRequired) index = i;
  }
  return { character: CHARACTERS[index], index };
}

/** XP needed for the next character, and progress fraction toward it. */
export function nextUnlock(xp: number): { next?: GameCharacter; progress: number } {
  const { index } = characterForXp(xp);
  const next = CHARACTERS[index + 1];
  if (!next) return { next: undefined, progress: 1 };
  const base = CHARACTERS[index].xpRequired;
  const progress = (xp - base) / (next.xpRequired - base);
  return { next, progress: Math.max(0, Math.min(1, progress)) };
}
