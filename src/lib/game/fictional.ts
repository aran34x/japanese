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

interface ChallengeClue {
  ja: string;
  en: string;
  it: string;
  trait?: Trait;
}

const CURATED_CLUES: Record<string, ChallengeClue[]> = {
  impa: [
    {
      ja: 'わたしはゼルダ姫の友だちです。',
      en: "I am Princess Zelda's friend.",
      it: "Sono l'amica della Principessa Zelda."
    },
    {
      ja: 'わたしはマスクをつけて、青い服を着ています。',
      en: 'I wear a mask and blue clothes.',
      it: 'Indosso una maschera e vestiti blu.'
    },
    {
      ja: '忍者はどういう意味ですか。',
      en: 'Ninja',
      it: 'Ninja',
      trait: { ja: '忍者', reading: 'にんじゃ', en: 'ninja', it: 'ninja' }
    }
  ],
  pikachu: [
    {
      ja: 'わたしはねずみです。',
      en: 'I am a mouse.',
      it: 'Sono un topo.'
    },
    {
      ja: 'わたしは黄色いです。',
      en: 'I am yellow.',
      it: 'Sono giallo.'
    },
    {
      ja: 'わたしは電気で戦います。',
      en: 'I fight using electricity.',
      it: "Combatto usando l'elettricita.",
      trait: { ja: '電気', reading: 'でんき', en: 'electricity', it: 'elettricita' }
    }
  ],
  mario: [
    {
      ja: 'ジャンプすると、わたしはうれしいです。',
      en: 'I am happy when I jump.',
      it: 'Sono felice quando salto.'
    },
    {
      ja: 'Aボタンを長く押すと、高くジャンプします。',
      en: 'Hold the A button to jump higher.',
      it: 'Tieni premuto il pulsante A per saltare piu in alto.'
    },
    {
      ja: 'わたしは1981年に生まれました。',
      en: 'I was born in 1981.',
      it: 'Sono nato nel 1981.'
    },
    {
      ja: 'わたしは赤い帽子をかぶっています。',
      en: 'I wear a red hat.',
      it: 'Indosso un cappello rosso.'
    }
  ]
};

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

function lessonForClue(clue: ChallengeClue): FLesson {
  if (clue.trait) return lessonForTrait(clue.trait);
  return {
    vocab: [{ jp: clue.ja, reading: clue.ja, meaning: { en: clue.en, it: clue.it } }],
    tip: {
      en: 'Read the Japanese clue first, then choose the matching English sentence.',
      it: 'Leggi prima il suggerimento in giapponese, poi scegli la frase corrispondente.'
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

function defaultClues(ch: FictionalChar): ChallengeClue[] {
  return [
    {
      ja: `わたしのヒントは「${ch.trait.ja}」です。`,
      en: `My clue is "${ch.trait.en}".`,
      it: `Il mio indizio e "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `わたしは「${ch.trait.ja}」と関係があります。`,
      en: `I am connected with "${ch.trait.en}".`,
      it: `Sono collegato a "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `${ch.trait.ja}はどういう意味ですか。`,
      en: ch.trait.en,
      it: ch.trait.it,
      trait: ch.trait
    },
    {
      ja: `大切な言葉は「${ch.trait.ja}」です。`,
      en: `The important word is "${ch.trait.en}".`,
      it: `La parola importante e "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `わたしを覚える言葉は「${ch.trait.ja}」です。`,
      en: `The word to remember me is "${ch.trait.en}".`,
      it: `La parola per ricordarmi e "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `このキャラクターは「${ch.trait.ja}」のイメージがあります。`,
      en: `This character has the image of "${ch.trait.en}".`,
      it: `Questo personaggio ha l'immagine di "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `キーワードは「${ch.trait.ja}」です。`,
      en: `The keyword is "${ch.trait.en}".`,
      it: `La parola chiave e "${ch.trait.it}".`,
      trait: ch.trait
    },
    {
      ja: `「${ch.trait.ja}」を英語で何と言いますか。`,
      en: ch.trait.en,
      it: ch.trait.it,
      trait: ch.trait
    },
    {
      ja: `最後のヒントの前に「${ch.trait.ja}」を読んでください。`,
      en: `Before the final clue, read "${ch.trait.en}".`,
      it: `Prima dell'indizio finale, leggi "${ch.trait.it}".`,
      trait: ch.trait
    }
  ];
}

function challengeLength(ch: FictionalChar): number {
  const index = CHARACTERS_FICTIONAL.findIndex((x) => x.id === ch.id);
  const rank = index < 0 ? 0 : index / Math.max(1, CHARACTERS_FICTIONAL.length - 1);
  return Math.max(3, Math.min(10, 3 + Math.floor(rank * 8)));
}

function clueChoices(ch: FictionalChar, clue: ChallengeClue, seed: string): FChoice[] {
  const wrongs = stablePick(
    CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id && x.trait.en !== clue.en),
    seed + ':clue',
    3,
    (x) => x.id
  ).map((x) => ({ en: `My clue is "${x.trait.en}".`, it: `Il mio indizio e "${x.trait.it}".`, correct: false }));

  return stableOptions([{ en: clue.en, it: clue.it, correct: true }, ...wrongs], seed);
}

export function buildCharChallenge(ch: FictionalChar): FQuestion[] {
  const others = CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id);
  const clueCount = challengeLength(ch) - 1;
  const baseClues = [...(CURATED_CLUES[ch.id] ?? []), ...defaultClues(ch)];
  const clues = baseClues.slice(0, clueCount);

  const questions = clues.map((clue, i) => ({
    instruction: {
      en: 'Choose the correct translation.',
      it: 'Scegli la traduzione corretta.'
    },
    show: clue.ja,
    options: clueChoices(ch, clue, `${ch.id}:clue:${i}`),
    lesson: lessonForClue(clue)
  }));

  const nameWrong = stablePick(others, ch.id + ':name', 3, (o) => o.id)
    .map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: {
      en: `My name is "${ch.reading}". How do you read this?`,
      it: `Il mio nome e "${ch.reading}". Come si legge?`
    },
    show: ch.reading,
    options: stableOptions([{ text: ch.romaji, correct: true }, ...nameWrong], ch.id + ':final'),
    lesson: lessonForName(ch)
  });

  return questions;
}
