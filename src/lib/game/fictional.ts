// Logic for fictional pop-culture characters. DATA (FICTIONAL_CATEGORIES,
// CHARACTERS_FICTIONAL, types) lives in src/lib/data/game/fictional.ts.
import type { Localized } from './tracks';
import {
  FICTIONAL_CATEGORIES, CHARACTERS_FICTIONAL,
  type FictionalCategory, type FictionalChar
} from '../data/game/fictional';
export { FICTIONAL_CATEGORIES, CHARACTERS_FICTIONAL };
export type { FictionalCategory, FictionalChar };

// ---- Challenge generation (name-reading) ------------------------
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

const POPULAR_IDS = ['pikachu', 'goku', 'naruto', 'luffy', 'mario', 'miku', 'doraemon', 'link', 'totoro', 'usagi', 'shinji', 'tanjiro', 'charizard', 'mewtwo', 'vegeta'];

export function buildCharChallenge(ch: FictionalChar): FQuestion[] {
  const others = shuffle(CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id));
  const popIndex = POPULAR_IDS.indexOf(ch.id);
  const isPopular = popIndex !== -1;
  // Scale difficulty based on popularity: min 3 questions, max 10.
  // The earlier in POPULAR_IDS (or if not in it), the fewer questions.
  let numQuestions = 3;
  if (isPopular) {
    numQuestions += Math.floor((popIndex / POPULAR_IDS.length) * 7);
  }
  
  const optionsCount = isPopular ? 5 : 3;

  const questions: FQuestion[] = [];

  // Generate dynamic language questions based on 'trait'
  // We want to avoid repetitive formats, so we cycle through different types of vocab tasks.
  for (let i = 0; i < numQuestions - 1; i++) {
    const format = i % 3; 

    if (format === 0) {
      // Format 0: Match Japanese trait to meaning
      const traitWrong = shuffle(CHARACTERS_FICTIONAL.filter((x) => x.trait.ja !== ch.trait.ja))
        .slice(0, optionsCount - 1)
        .map((x) => ({ en: x.trait.en, it: x.trait.it, correct: false }));
      
      questions.push({
        instruction: {
          en: `This mystery character is associated with this word. What does it mean?`,
          it: `Questo personaggio misterioso è associato a questa parola. Cosa significa?`
        },
        show: ch.trait.ja,
        options: shuffle([{ en: ch.trait.en, it: ch.trait.it, correct: true }, ...traitWrong])
      });
    } else if (format === 1) {
      // Format 1: Match meaning to Japanese trait
      const traitWrong = shuffle(CHARACTERS_FICTIONAL.filter((x) => x.trait.ja !== ch.trait.ja))
        .slice(0, optionsCount - 1)
        .map((x) => ({ text: x.trait.ja, correct: false }));

      questions.push({
        instruction: {
          en: `Which Japanese word means "${ch.trait.en}"?`,
          it: `Quale parola giapponese significa "${ch.trait.it}"?`
        },
        options: shuffle([{ text: ch.trait.ja, correct: true }, ...traitWrong])
      });
    } else {
      // Format 2: Match trait reading
      const traitWrong = shuffle(CHARACTERS_FICTIONAL.filter((x) => x.trait.reading !== ch.trait.reading))
        .slice(0, optionsCount - 1)
        .map((x) => ({ text: x.trait.reading, correct: false }));

      questions.push({
        instruction: {
          en: `How do you read the word associated with this character?`,
          it: `Come si legge la parola associata a questo personaggio?`
        },
        show: ch.trait.ja,
        options: shuffle([{ text: ch.trait.reading, correct: true }, ...traitWrong])
      });
    }
  }

  // --- Q Final: Name Reading (Hard - Final Reveal) ---
  const nameWrong = others.slice(0, optionsCount - 1).map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: {
      en: 'The identity is revealed! Match the name to its reading:',
      it: 'L\'identità è svelata! Abbina il nome alla sua lettura:'
    },
    show: ch.ja,
    options: shuffle([{ text: ch.romaji, correct: true }, ...nameWrong])
  });

  return questions;
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
