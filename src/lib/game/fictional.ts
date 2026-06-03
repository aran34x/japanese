// Logic for fictional pop-culture characters. DATA (FRANCHISE_META,
// CHARACTERS_FICTIONAL, types) lives in src/lib/data/game/fictional.ts.
import type { Localized } from './tracks';
import {
  FRANCHISE_META, CHARACTERS_FICTIONAL,
  type Franchise, type FictionalChar
} from '../data/game/fictional';
export { FRANCHISE_META, CHARACTERS_FICTIONAL };
export type { Franchise, FictionalChar };

// ---- Challenge generation (name-reading + franchise) ------------------------
export interface FChoice {
  // Either a fixed `text` (e.g. romaji) or a localized en/it pair.
  text?: string;
  en?: string;
  it?: string;
  correct: boolean;
}
export interface FQuestion {
  instruction: Localized;
  show?: string;
  options: FChoice[];
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function buildCharChallenge(ch: FictionalChar): FQuestion[] {
  const others = shuffle(CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id));

  // Q1 — read the Japanese name
  const q1: FQuestion = {
    instruction: { en: 'How is this name read?', it: 'Come si legge questo nome?' },
    show: ch.ja,
    options: shuffle([
      { text: ch.romaji, correct: true },
      ...others.slice(0, 3).map((o) => ({ text: o.romaji, correct: false }))
    ])
  };

  // Q2 — a simple comprehension question about who this character is, using
  // their real fact vs. other characters' facts as distractors.
  const factWrong = others
    .filter((o) => o.fact.en !== ch.fact.en)
    .slice(0, 3)
    .map((o) => ({ en: o.fact.en, it: o.fact.it, correct: false }));
  const q2: FQuestion = {
    instruction: {
      en: `Which is true about ${ch.name}?`,
      it: `Cosa è vero su ${ch.name}?`
    },
    options: shuffle([{ en: ch.fact.en, it: ch.fact.it, correct: true }, ...factWrong])
  };

  return [q1, q2];
}

export interface FLesson {
  vocab: { jp: string; reading: string; meaning: Localized }[];
  tip: Localized;
}

export function buildCharLesson(ch: FictionalChar): FLesson {
  const isKatakana = /[゠-ヿ]/.test(ch.ja) && !/[一-鿿]/.test(ch.ja);
  return {
    vocab: [{ jp: ch.ja, reading: ch.reading, meaning: { en: ch.name, it: ch.name } }],
    tip: isKatakana
      ? {
          en: 'This name is written in katakana — the script used for foreign or invented words. Sound out each symbol.',
          it: 'Questo nome è in katakana — la scrittura per parole straniere o inventate. Pronuncia ogni simbolo.'
        }
      : {
          en: 'Read each kanji/kana in order using the reading shown. Japanese family names usually come first.',
          it: 'Leggi ogni kanji/kana in ordine con la lettura mostrata. Il cognome di solito viene prima.'
        }
  };
}
