// Logic for the real-people 'Icons'. DATA (ROLES, PEOPLE, CATEGORY_META,
// types) lives in src/lib/data/game/people.ts; this re-exports it and keeps
// the challenge/lesson generators.
import type { Localized } from './tracks';
import {
  ROLES,
  PEOPLE,
  CATEGORY_META,
  type PersonCategory,
  type RealPerson,
  type RoleDef
} from '../data/game/people';

export { ROLES, PEOPLE, CATEGORY_META };
export type { PersonCategory, RealPerson };

export interface PChoice {
  text?: string;
  en?: string;
  it?: string;
  correct: boolean;
}

export interface PersonLesson {
  vocab: { jp: string; reading: string; meaning: Localized }[];
  tip: Localized;
}

export interface PQuestion {
  instruction: Localized;
  show?: string;
  options: PChoice[];
  lesson: PersonLesson;
}

type Trait = RealPerson['trait'];

const POPULAR_IDS = ['sak-r', 'hisai-j', 'miya-h', 'kuro-a', 'miya-s', 'hoku-k', 'utada', 'ohtani', 'oda-n', 'toriyama', 'anno', 'ichiro', 'ieyasu', 'mifune', 'kusama'];

function score(seed: string, value: string): number {
  let h = 2166136261;
  const s = seed + ':' + value;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function stablePick<T>(items: T[], seed: string, count: number, key: (item: T) => string): T[] {
  return [...items]
    .sort((a, b) => score(seed, key(a)) - score(seed, key(b)))
    .slice(0, count);
}

function stableOptions(options: PChoice[], seed: string): PChoice[] {
  return stablePick(options, seed, options.length, (opt) => opt.text ?? opt.en ?? opt.it ?? '');
}

function lessonForVocab(vocab: { ja: string; reading: string; en: string; it: string }): PersonLesson {
  const hasKanji = /[\u4e00-\u9faf]/.test(vocab.ja);
  return {
    vocab: [{ jp: vocab.ja, reading: vocab.reading, meaning: { en: vocab.en, it: vocab.it } }],
    tip: hasKanji
      ? {
          en: 'Use X-Ray on the kanji, then read the whole word.',
          it: "Usa l'X-Ray sul kanji, poi leggi la parola intera."
        }
      : {
          en: 'Read the kana aloud and connect the sound to the meaning.',
          it: 'Leggi il kana ad alta voce e collega il suono al significato.'
        }
  };
}

function lessonForRole(role: RoleDef): PersonLesson {
  return lessonForVocab({ ja: role.ja, reading: role.reading, en: role.en, it: role.it });
}

function lessonForName(person: RealPerson): PersonLesson {
  return {
    vocab: [{ jp: person.ja, reading: person.reading, meaning: { en: 'Person name', it: 'Nome della persona' } }],
    tip: {
      en: 'Read the Japanese name only. The person is revealed after you clear the challenge.',
      it: 'Leggi solo il nome giapponese. La persona si svela dopo la sfida.'
    }
  };
}

export function buildPersonChallenge(person: RealPerson): PQuestion[] {
  const others = PEOPLE.filter((x) => x.id !== person.id);
  const popIndex = POPULAR_IDS.indexOf(person.id);
  const isPopular = popIndex !== -1;
  const role = ROLES[person.role];

  let numQuestions = 3;
  if (isPopular) numQuestions += Math.floor((popIndex / POPULAR_IDS.length) * 7);

  const optionsCount = isPopular ? 5 : 3;
  const vocabQuestions = numQuestions - 1;
  const supportPeople = stablePick(others, person.id + ':support', Math.max(0, vocabQuestions - 2), (x) => x.id);
  const questionItems: Array<{ kind: 'trait'; value: Trait } | { kind: 'role'; value: RoleDef }> = [
    ...supportPeople.map((x, i) =>
      i % 2 === 0
        ? ({ kind: 'trait', value: x.trait } as const)
        : ({ kind: 'role', value: ROLES[x.role] } as const)
    ),
    { kind: 'trait', value: person.trait } as const,
    { kind: 'role', value: role } as const
  ].slice(-vocabQuestions);

  const testedTraitJa = questionItems.filter((x) => x.kind === 'trait').map((x) => x.value.ja);
  const testedRoleJa = questionItems.filter((x) => x.kind === 'role').map((x) => x.value.ja);
  const traitPool = PEOPLE.filter((x) => !testedTraitJa.includes(x.trait.ja));
  const rolePool = Object.values(ROLES).filter((x) => !testedRoleJa.includes(x.ja));
  const questions: PQuestion[] = [];

  for (let i = 0; i < questionItems.length; i++) {
    const item = questionItems[i];
    const seed = `${person.id}:q${i}`;
    const format = score(seed, item.kind) % 3;

    if (item.kind === 'trait') {
      const target = item.value;
      const lesson = lessonForVocab(target);
      if (format === 0) {
        const wrongs = stablePick(traitPool, seed + ':meaning', optionsCount - 1, (x) => x.id)
          .map((x) => ({ text: x.trait.en, correct: false }));
        questions.push({
          instruction: { en: 'What does this mean?', it: 'Cosa significa?' },
          show: target.ja,
          options: stableOptions([{ text: target.en, correct: true }, ...wrongs], seed),
          lesson
        });
      } else if (format === 1) {
        const wrongs = stablePick(traitPool, seed + ':word', optionsCount - 1, (x) => x.id)
          .map((x) => ({ text: x.trait.ja, correct: false }));
        questions.push({
          instruction: {
            en: `Which Japanese word means "${target.en}"?`,
            it: `Quale parola giapponese significa "${target.it}"?`
          },
          options: stableOptions([{ text: target.ja, correct: true }, ...wrongs], seed),
          lesson
        });
      } else {
        const wrongs = stablePick(traitPool, seed + ':reading', optionsCount - 1, (x) => x.id)
          .map((x) => ({ text: x.trait.reading, correct: false }));
        questions.push({
          instruction: { en: 'How do you read this?', it: 'Come si legge?' },
          show: target.ja,
          options: stableOptions([{ text: target.reading, correct: true }, ...wrongs], seed),
          lesson
        });
      }
    } else {
      const target = item.value;
      const lesson = lessonForRole(target);
      if (format === 0) {
        const wrongs = stablePick(rolePool, seed + ':meaning', optionsCount - 1, (x) => x.ja)
          .map((x) => ({ text: x.en, correct: false }));
        questions.push({
          instruction: { en: 'What does this mean?', it: 'Cosa significa?' },
          show: target.ja,
          options: stableOptions([{ text: target.en, correct: true }, ...wrongs], seed),
          lesson
        });
      } else if (format === 1) {
        const wrongs = stablePick(rolePool, seed + ':word', optionsCount - 1, (x) => x.ja)
          .map((x) => ({ text: x.ja, correct: false }));
        questions.push({
          instruction: {
            en: `Which Japanese word means "${target.en}"?`,
            it: `Quale parola giapponese significa "${target.it}"?`
          },
          options: stableOptions([{ text: target.ja, correct: true }, ...wrongs], seed),
          lesson
        });
      } else {
        const wrongs = stablePick(rolePool, seed + ':reading', optionsCount - 1, (x) => x.ja)
          .map((x) => ({ text: x.reading, correct: false }));
        questions.push({
          instruction: { en: 'How do you read this?', it: 'Come si legge?' },
          show: target.ja,
          options: stableOptions([{ text: target.reading, correct: true }, ...wrongs], seed),
          lesson
        });
      }
    }
  }

  const nameWrong = stablePick(others, person.id + ':name', optionsCount - 1, (o) => o.id)
    .map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: { en: 'How do you read this name?', it: 'Come si legge questo nome?' },
    show: person.ja,
    options: stableOptions([{ text: person.romaji, correct: true }, ...nameWrong], person.id + ':final'),
    lesson: lessonForName(person)
  });

  return questions;
}
