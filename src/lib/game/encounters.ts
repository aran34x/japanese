// Random "disruptive" encounters that interrupt an Adventure session.
export type EncounterKind = 'boss' | 'speed' | 'gamble' | 'suddenDeath';

export interface BossDef {
  name: string;
  emoji: string;
  hp: number;
  color: string;
}

export const BOSSES: BossDef[] = [
  { name: 'Yokai of Doubt', emoji: '👻', hp: 5, color: '#64748b' },
  { name: 'The Forgetting Oni', emoji: '👹', hp: 6, color: '#ef4444' },
  { name: 'Shadow Tengu', emoji: '🪶', hp: 6, color: '#7c3aed' },
  { name: 'Kanji Kraken', emoji: '🐙', hp: 7, color: '#0891b2' },
  { name: 'Lord Procrastinasu', emoji: '😴', hp: 5, color: '#a16207' }
];

export interface Encounter {
  kind: EncounterKind;
  boss?: BossDef;
  /** seconds for timed encounters */
  seconds?: number;
}

const ENCOUNTER_CHANCE = 0.22;

/**
 * Roll for a random encounter to inject between cards. Returns null most of the
 * time so normal study continues. `cardsSinceLast` prevents back-to-back events.
 */
export function rollEncounter(cardsSinceLast: number): Encounter | null {
  if (cardsSinceLast < 4) return null;
  if (Math.random() > ENCOUNTER_CHANCE) return null;

  const roll = Math.random();
  if (roll < 0.4) {
    const boss = BOSSES[Math.floor(Math.random() * BOSSES.length)];
    return { kind: 'boss', boss };
  }
  if (roll < 0.7) return { kind: 'speed', seconds: 30 };
  if (roll < 0.88) return { kind: 'gamble' };
  return { kind: 'suddenDeath' };
}

export const ENCOUNTER_LABELS: Record<EncounterKind, { en: string; it: string; icon: string }> = {
  boss: { en: 'BOSS BATTLE', it: 'BATTAGLIA CON IL BOSS', icon: '⚔' },
  speed: { en: 'SPEED ROUND', it: 'ROUND VELOCE', icon: '⏱' },
  gamble: { en: 'DOUBLE OR NOTHING', it: 'RADDOPPIA O NIENTE', icon: '🎴' },
  suddenDeath: { en: 'SUDDEN DEATH', it: 'MORTE IMPROVVISA', icon: '💀' }
};
