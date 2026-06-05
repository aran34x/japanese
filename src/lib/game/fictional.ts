// Logic for fictional pop-culture characters. DATA (FICTIONAL_CATEGORIES,
// CHARACTERS_FICTIONAL, types) lives in src/lib/data/game/fictional.ts.
import type { Localized } from './tracks';
import {
  FICTIONAL_CATEGORIES,
  CHARACTERS_FICTIONAL,
  type FictionalCategory,
  type FictionalChar
} from '../data/game/fictional';

export { FICTIONAL_CATEGORIES, CHARACTERS_FICTIONAL };
export type { FictionalCategory, FictionalChar };

export interface FChoice {
  text?: string;
  en?: string;
  it?: string;
  correct: boolean;
}

export interface FLesson {
  vocab: { jp: string; reading: string; meaning: Localized }[];
  tip: Localized;
}

export interface FQuestion {
  instruction: Localized;
  show?: string;
  options: FChoice[];
  lesson: FLesson;
}

type Trait = FictionalChar['trait'];

const POPULAR_IDS = [
  'pikachu',
  'goku',
  'naruto',
  'luffy',
  'mario',
  'miku',
  'doraemon',
  'link',
  'totoro',
  'usagi',
  'shinji',
  'tanjiro',
  'charizard',
  'mewtwo',
  'vegeta',
  'sonic',
  'cloud',
  'sephiroth',
  'pacman',
  'snake',
  'ryu',
  'gojo',
  'saitama',
  'levi',
  'eren',
  'edward'
];

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

function stableOptions(options: FChoice[], seed: string): FChoice[] {
  return stablePick(options, seed, options.length, (opt) => opt.text ?? opt.en ?? opt.it ?? '');
}

function lessonForTrait(trait: Trait): FLesson {
  const hasKanji = /[\u4e00-\u9faf]/.test(trait.ja);
  return {
    vocab: [{ jp: trait.ja, reading: trait.reading, meaning: { en: trait.en, it: trait.it } }],
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

function lessonForName(ch: FictionalChar): FLesson {
  return {
    vocab: [{ jp: ch.ja, reading: ch.reading, meaning: { en: 'Character name', it: 'Nome del personaggio' } }],
    tip: {
      en: 'Read the Japanese name only. The character is revealed after you clear the challenge.',
      it: 'Leggi solo il nome giapponese. Il personaggio si svela dopo la sfida.'
    }
  };
}

export function buildCharChallenge(ch: FictionalChar): FQuestion[] {
  const others = CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id);
  const popIndex = POPULAR_IDS.indexOf(ch.id);
  const isPopular = popIndex !== -1;
  let numQuestions = 3;
  if (isPopular) numQuestions += Math.floor((popIndex / POPULAR_IDS.length) * 7);

  const optionsCount = isPopular ? 5 : 3;
  const vocabQuestions = numQuestions - 1;
  const supportTraits = stablePick(
    others.filter((x) => x.trait.ja !== ch.trait.ja),
    ch.id + ':traits',
    Math.max(0, vocabQuestions - 1),
    (x) => x.id + ':' + x.trait.ja
  ).map((x) => x.trait);
  const testedTraits = [...supportTraits, ch.trait];
  const distractorPool = CHARACTERS_FICTIONAL.filter(
    (x) => !testedTraits.some((trait) => trait.ja === x.trait.ja)
  );

  const questions: FQuestion[] = [];

  for (let i = 0; i < vocabQuestions; i++) {
    const target = testedTraits[i];
    const format = score(ch.id + ':format', target.ja) % 3;
    const seed = `${ch.id}:q${i}:${target.ja}`;
    const lesson = lessonForTrait(target);

    if (format === 0) {
      const wrongs = stablePick(distractorPool, seed + ':meaning', optionsCount - 1, (x) => x.id)
        .map((x) => ({ en: x.trait.en, it: x.trait.it, correct: false }));
      questions.push({
        instruction: { en: 'What does this mean?', it: 'Cosa significa?' },
        show: target.ja,
        options: stableOptions([{ en: target.en, it: target.it, correct: true }, ...wrongs], seed),
        lesson
      });
    } else if (format === 1) {
      const wrongs = stablePick(distractorPool, seed + ':word', optionsCount - 1, (x) => x.id)
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
      const wrongs = stablePick(distractorPool, seed + ':reading', optionsCount - 1, (x) => x.id)
        .map((x) => ({ text: x.trait.reading, correct: false }));
      questions.push({
        instruction: { en: 'How do you read this?', it: 'Come si legge?' },
        show: target.ja,
        options: stableOptions([{ text: target.reading, correct: true }, ...wrongs], seed),
        lesson
      });
    }
  }

  const nameWrong = stablePick(others, ch.id + ':name', optionsCount - 1, (o) => o.id)
    .map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: { en: 'How do you read this name?', it: 'Come si legge questo nome?' },
    show: ch.ja,
    options: stableOptions([{ text: ch.romaji, correct: true }, ...nameWrong], ch.id + ':final'),
    lesson: lessonForName(ch)
  });

  return questions;
}
