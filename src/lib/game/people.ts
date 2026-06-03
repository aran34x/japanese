// Logic for the real-people 'Icons'. DATA (ROLES, PEOPLE, CATEGORY_META,
// types) lives in src/lib/data/game/people.ts; this re-exports it and keeps
// the challenge/lesson generators.
import type { Localized } from './tracks';
import {
  ROLES, PEOPLE, CATEGORY_META,
  type PersonCategory, type RealPerson
} from '../data/game/people';
export { ROLES, PEOPLE, CATEGORY_META };
export type { PersonCategory, RealPerson };

// ---- Challenge generation ----------------------------------------------------
export interface PChoice {
  text: string;
  correct: boolean;
}
export interface PQuestion {
  instruction: Localized;
  show?: string; // big Japanese text to display
  options: PChoice[];
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Build the (deterministic-in-spirit) scripted challenge for a person. */
export function buildPersonChallenge(person: RealPerson): PQuestion[] {
  const others = shuffle(PEOPLE.filter((x) => x.id !== person.id));
  const role = ROLES[person.role];

  // Q1 — read their real name
  const nameWrong = others.slice(0, 3).map((o) => ({ text: o.romaji, correct: false }));
  const q1: PQuestion = {
    instruction: { en: 'How is this name read?', it: 'Come si legge questo nome?' },
    show: person.ja,
    options: shuffle([{ text: person.romaji, correct: true }, ...nameWrong])
  };

  // Q2 — the vocabulary for their profession
  const roleWrong = shuffle(Object.values(ROLES).filter((r) => r.ja !== role.ja))
    .slice(0, 3)
    .map((r) => ({ text: r.ja, correct: false }));
  const q2: PQuestion = {
    instruction: {
      en: `${person.name} is a ${role.en}. How do you say "${role.en}" in Japanese?`,
      it: `${person.name} è un ${role.it}. Come si dice "${role.it}" in giapponese?`
    },
    options: shuffle([{ text: role.ja, correct: true }, ...roleWrong])
  };

  return [q1, q2];
}

export interface PersonLesson {
  vocab: { jp: string; reading: string; meaning: Localized }[];
  tip: Localized;
}

export function buildPersonLesson(person: RealPerson): PersonLesson {
  const role = ROLES[person.role];
  return {
    vocab: [
      { jp: person.ja, reading: person.reading, meaning: { en: person.name, it: person.name } },
      { jp: role.ja, reading: role.reading, meaning: { en: role.en, it: role.it } }
    ],
    tip: {
      en: `Japanese names are written family-name first. Sound out each kanji using its reading "${person.reading}".`,
      it: `I nomi giapponesi si scrivono col cognome per primo. Pronuncia ogni kanji con la lettura "${person.reading}".`
    }
  };
}
