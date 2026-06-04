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
  const cat = CATEGORY_META[person.category];

  // --- Q1: Profession (Easy) ---
  const roleWrong = shuffle(Object.values(ROLES).filter((r) => r.ja !== role.ja))
    .slice(0, 3)
    .map((r) => ({ text: r.ja, correct: false }));

  const q1: PQuestion = {
    instruction: {
      en: `This mystery person is a ${role.en}. Which word means "${role.en}"?`,
      it: `Questa persona misteriosa è un ${role.it}. Quale parola significa "${role.it}"?`
    },
    options: shuffle([{ text: role.ja, correct: true }, ...roleWrong])
  };

  // --- Q2: Fact or Category (Medium) ---
  let q2: PQuestion;
  if (person.fact) {
    const factWrong = others
      .filter((o) => o.fact && o.fact.en !== person.fact?.en)
      .slice(0, 3)
      .map((o) => ({ text: o.fact!.en, correct: false })); // Note: Simple string for fact text here, assuming PChoice.text is used

    // Since PChoice.text is used in Icons.svelte, we need to handle localization here or in the component.
    // Looking at Icons.svelte: {opt.text} is used. PChoice only has 'text'.
    // Wait, fictional.ts uses {opt.text ?? opt[$settings.uiLang]}.
    // Let's check Icons.svelte again. It uses {opt.text}.
    // I should probably update PChoice to support localization if I want to use facts.
    // Or just use the current language for the fact text in the generator.

    q2 = {
      instruction: {
        en: 'Which of these is true about this person?',
        it: 'Quale di queste affermazioni è vera su questa persona?'
      },
      options: shuffle([
        { text: person.fact.en, correct: true },
        ...factWrong
      ])
    };
  } else {
    // Fallback: Category question
    const catWrong = shuffle(Object.values(CATEGORY_META).filter((c) => c.emoji !== cat.emoji))
      .slice(0, 3)
      .map((c) => ({ text: `${c.emoji} ${c.label.en}`, correct: false }));

    q2 = {
      instruction: {
        en: 'Which category does this person belong to?',
        it: 'A quale categoria appartiene questa persona?'
      },
      options: shuffle([
        { text: `${cat.emoji} ${cat.label.en}`, correct: true },
        ...catWrong
      ])
    };
  }

  // --- Q3: Name Reading (Hard - Final Boss) ---
  const nameWrong = others.slice(0, 3).map((o) => ({ text: o.romaji, correct: false }));
  const q3: PQuestion = {
    instruction: {
      en: 'The identity is revealed! Match the name to its reading:',
      it: 'L\'identità è svelata! Abbina il nome alla sua lettura:'
    },
    show: person.ja,
    options: shuffle([{ text: person.romaji, correct: true }, ...nameWrong])
  };

  return [q1, q2, q3];
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
