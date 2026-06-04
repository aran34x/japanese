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

const POPULAR_IDS = ['sak-r', 'hisai-j', 'miya-h', 'kuro-a', 'miya-s', 'hoku-k', 'utada', 'ohtani', 'oda-n', 'toriyama', 'anno', 'ichiro', 'ieyasu', 'mifune', 'kusama'];

/** Build the (deterministic-in-spirit) scripted challenge for a person. */
export function buildPersonChallenge(person: RealPerson): PQuestion[] {
  const others = PEOPLE.filter((x) => x.id !== person.id);
  const popIndex = POPULAR_IDS.indexOf(person.id);
  const isPopular = popIndex !== -1;
  const role = ROLES[person.role];

  let numQuestions = 3;
  if (isPopular) {
    numQuestions += Math.floor((popIndex / POPULAR_IDS.length) * 7);
  }
  const optionsCount = isPopular ? 5 : 3;

  // Pseudo-random based on ID
  const seed = person.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getFormat = (index: number) => (seed + index) % 5;

  const testedTraits = [person.trait];
  const testedRoles = [role];
  const shuffledOthers = shuffle(others);
  
  const vocabCount = Math.max(0, numQuestions - 3);
  for (let i = 0; i < vocabCount; i++) {
     if (i % 2 === 0) {
       testedTraits.unshift(shuffledOthers[i].trait);
     } else {
       testedRoles.unshift(ROLES[shuffledOthers[i].role]);
     }
  }

  // Safe pools
  const safePeopleForTraits = PEOPLE.filter(x => !testedTraits.some(t => t.ja === x.trait.ja));
  const safeRoles = Object.values(ROLES).filter(r => !testedRoles.some(tr => tr.ja === r.ja));

  const questions: PQuestion[] = [];
  
  let traitIdx = 0;
  let roleIdx = 0;

  for (let i = 0; i < numQuestions - 1; i++) {
    const isMainRole = i === numQuestions - 2;
    const isMainTrait = i === numQuestions - 3;
    
    let isTestingTrait = true;
    if (isMainRole) isTestingTrait = false;
    else if (isMainTrait) isTestingTrait = true;
    else {
       isTestingTrait = (i % 2 === 0);
    }
    
    const format = getFormat(i);
    
    if (isTestingTrait) {
       const targetTrait = testedTraits[traitIdx++];
       const prefixEn = isMainTrait ? "This mystery person is associated with this word." : "Vocabulary Check:";
       const prefixIt = isMainTrait ? "Questa persona misteriosa è associata a questa parola." : "Controllo Vocabolario:";
       
       if (format === 0 || format === 3) {
          const wrongs = shuffle(safePeopleForTraits).slice(0, optionsCount - 1).map(x => ({ text: x.trait.en, correct: false }));
          questions.push({
            instruction: { en: `${prefixEn} What does it mean?`, it: `${prefixIt} Cosa significa?` },
            show: targetTrait.ja,
            options: shuffle([{ text: targetTrait.en, correct: true }, ...wrongs])
          });
       } else if (format === 1) {
          const wrongs = shuffle(safePeopleForTraits).slice(0, optionsCount - 1).map(x => ({ text: x.trait.ja, correct: false }));
          questions.push({
            instruction: { en: `${prefixEn} Which Japanese word means "${targetTrait.en}"?`, it: `${prefixIt} Quale parola giapponese significa "${targetTrait.it}"?` },
            options: shuffle([{ text: targetTrait.ja, correct: true }, ...wrongs])
          });
       } else {
          const wrongs = shuffle(safePeopleForTraits).slice(0, optionsCount - 1).map(x => ({ text: x.trait.reading, correct: false }));
          questions.push({
            instruction: { en: `${prefixEn} How do you read it?`, it: `${prefixIt} Come si legge?` },
            show: targetTrait.ja,
            options: shuffle([{ text: targetTrait.reading, correct: true }, ...wrongs])
          });
       }
    } else {
       const targetRole = testedRoles[roleIdx++];
       const prefixEn = isMainRole ? "This mystery person has this profession." : "Vocabulary Check:";
       const prefixIt = isMainRole ? "Questa persona misteriosa ha questa professione." : "Controllo Vocabolario:";
       
       if (format % 2 === 0) {
          const wrongs = shuffle(safeRoles).slice(0, optionsCount - 1).map(x => ({ text: x.ja, correct: false }));
          questions.push({
            instruction: { en: `${prefixEn} Which Japanese word means "${targetRole.en}"?`, it: `${prefixIt} Quale parola giapponese significa "${targetRole.it}"?` },
            options: shuffle([{ text: targetRole.ja, correct: true }, ...wrongs])
          });
       } else {
          const wrongs = shuffle(safeRoles).slice(0, optionsCount - 1).map(x => ({ text: x.reading, correct: false }));
          questions.push({
            instruction: { en: `${prefixEn} How do you read this profession?`, it: `${prefixIt} Come si legge questa professione?` },
            show: targetRole.ja,
            options: shuffle([{ text: targetRole.reading, correct: true }, ...wrongs])
          });
       }
    }
  }

  // --- Q Final: Name Reading (Hard - Final Reveal) ---
  const nameWrong = shuffle(others).slice(0, optionsCount - 1).map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: {
      en: 'The identity is revealed! Match the name to its reading:',
      it: 'L\'identità è svelata! Abbina il nome alla sua lettura:'
    },
    show: person.ja,
    options: shuffle([{ text: person.romaji, correct: true }, ...nameWrong])
  });

  return questions;
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
