// Fictional characters from Japanese pop culture. Their ARTWORK is copyrighted,
// so we never bundle or hot-link images for these — instead we show a clean
// styled card (emoji + their real Japanese name). The text bio is still fetched
// live from Wikipedia (freely licensed text). The challenge is reading their
// actual Japanese name — excellent katakana/kanji practice.
import type { Localized } from './tracks';

export type Franchise =
  | 'pokemon'
  | 'dragonball'
  | 'naruto'
  | 'onepiece'
  | 'vocaloid'
  | 'mario'
  | 'zelda'
  | 'ghibli'
  | 'sailormoon'
  | 'evangelion'
  | 'demonslayer'
  | 'doraemon';

export interface FictionalChar {
  id: string;
  name: string; // display / English name
  wiki: string; // Wikipedia article title (for the live bio)
  ja: string; // real Japanese name
  reading: string; // kana reading
  romaji: string;
  franchise: Franchise;
  emoji: string;
  color: string;
  fact: Localized;
  xp: number;
}

const c = (
  id: string,
  name: string,
  ja: string,
  reading: string,
  romaji: string,
  franchise: Franchise,
  emoji: string,
  color: string,
  fact: Localized,
  wiki?: string
): FictionalChar => ({ id, name, wiki: wiki ?? name, ja, reading, romaji, franchise, emoji, color, fact, xp: 50 });

export const FRANCHISE_META: Record<Franchise, { label: string; emoji: string; color: string }> = {
  pokemon: { label: 'Pokémon', emoji: '⚡', color: '#fbbf24' },
  dragonball: { label: 'Dragon Ball', emoji: '🐉', color: '#f97316' },
  naruto: { label: 'Naruto', emoji: '🍥', color: '#f59e0b' },
  onepiece: { label: 'One Piece', emoji: '🏴‍☠️', color: '#ef4444' },
  vocaloid: { label: 'Vocaloid', emoji: '🎤', color: '#22d3ee' },
  mario: { label: 'Super Mario', emoji: '🍄', color: '#ef4444' },
  zelda: { label: 'Zelda', emoji: '🗡️', color: '#22c55e' },
  ghibli: { label: 'Studio Ghibli', emoji: '🌳', color: '#10b981' },
  sailormoon: { label: 'Sailor Moon', emoji: '🌙', color: '#ec4899' },
  evangelion: { label: 'Evangelion', emoji: '🤖', color: '#a855f7' },
  demonslayer: { label: 'Demon Slayer', emoji: '⚔️', color: '#0ea5e9' },
  doraemon: { label: 'Doraemon', emoji: '🐱', color: '#3b82f6' }
};

export const CHARACTERS_FICTIONAL: FictionalChar[] = [
  // Pokémon
  c('pikachu', 'Pikachu', 'ピカチュウ', 'ぴかちゅう', 'pikachuu', 'pokemon', '⚡', '#fbbf24',
    { en: 'Mascot of the Pokémon franchise; an Electric-type Pokémon.', it: 'Mascotte del franchise Pokémon; un Pokémon di tipo Elettro.' }),
  c('eevee', 'Eevee', 'イーブイ', 'いーぶい', 'iibui', 'pokemon', '🦊', '#a16207',
    { en: 'A Pokémon known for its many evolutions.', it: 'Un Pokémon noto per le sue molte evoluzioni.' }),
  c('charizard', 'Charizard', 'リザードン', 'りざーどん', 'rizaadon', 'pokemon', '🔥', '#f97316',
    { en: 'A Fire/Flying-type Pokémon, fully evolved from Charmander.', it: 'Un Pokémon Fuoco/Volante, evoluzione finale di Charmander.' }),
  c('mewtwo', 'Mewtwo', 'ミュウツー', 'みゅうつー', 'myuutsuu', 'pokemon', '🧬', '#a855f7',
    { en: 'A genetically engineered Legendary Psychic-type Pokémon.', it: 'Un Pokémon Leggendario Psico creato geneticamente.' }),
  c('jigglypuff', 'Jigglypuff', 'プリン', 'ぷりん', 'purin', 'pokemon', '🎤', '#f9a8d4',
    { en: 'A Fairy-type Pokémon that sings foes to sleep.', it: 'Un Pokémon Folletto che addormenta i nemici cantando.' }),

  // Dragon Ball
  c('goku', 'Goku', '孫悟空', 'そんごくう', 'son gokuu', 'dragonball', '🥋', '#f97316',
    { en: 'The Saiyan hero of Dragon Ball, created by Akira Toriyama.', it: 'L\'eroe Saiyan di Dragon Ball, creato da Akira Toriyama.' }, 'Goku'),
  c('vegeta', 'Vegeta', 'ベジータ', 'べじーた', 'bejiita', 'dragonball', '👑', '#3b82f6',
    { en: 'The proud prince of the Saiyans.', it: 'Il fiero principe dei Saiyan.' }),
  c('gohan', 'Gohan', '孫悟飯', 'そんごはん', 'son gohan', 'dragonball', '📖', '#f59e0b',
    { en: 'Goku\'s elder son; his name puns on "rice/meal".', it: 'Il figlio maggiore di Goku; il nome gioca su "riso/pasto".' }),

  // Naruto
  c('naruto', 'Naruto Uzumaki', 'うずまきナルト', 'うずまきなると', 'uzumaki naruto', 'naruto', '🍥', '#f59e0b',
    { en: 'A ninja who dreams of becoming Hokage.', it: 'Un ninja che sogna di diventare Hokage.' }, 'Naruto Uzumaki'),
  c('sasuke', 'Sasuke Uchiha', 'うちはサスケ', 'うちはさすけ', 'uchiha sasuke', 'naruto', '⚡', '#6366f1',
    { en: 'Naruto\'s rival from the Uchiha clan.', it: 'Il rivale di Naruto, del clan Uchiha.' }, 'Sasuke Uchiha'),
  c('kakashi', 'Kakashi Hatake', 'はたけカカシ', 'はたけかかし', 'hatake kakashi', 'naruto', '📕', '#94a3b8',
    { en: 'The "Copy Ninja" and Team 7\'s teacher.', it: 'Il "Ninja Copione" e maestro del Team 7.' }, 'Kakashi Hatake'),

  // One Piece
  c('luffy', 'Monkey D. Luffy', 'モンキー・D・ルフィ', 'もんきーでぃーるふぃ', 'monkii dii rufi', 'onepiece', '🏴‍☠️', '#ef4444',
    { en: 'Captain of the Straw Hat Pirates, with a rubber body.', it: 'Capitano dei Pirati di Cappello di Paglia, dal corpo di gomma.' }, 'Monkey D. Luffy'),
  c('zoro', 'Roronoa Zoro', 'ロロノア・ゾロ', 'ろろのあぞろ', 'roronoa zoro', 'onepiece', '⚔️', '#22c55e',
    { en: 'A three-sword-style swordsman of the crew.', it: 'Spadaccino dello stile a tre spade della ciurma.' }, 'Roronoa Zoro'),

  // Vocaloid
  c('miku', 'Hatsune Miku', '初音ミク', 'はつねみく', 'hatsune miku', 'vocaloid', '🎤', '#22d3ee',
    { en: 'A virtual singer and Vocaloid voicebank released in 2007.', it: 'Una cantante virtuale e voce Vocaloid uscita nel 2007.' }, 'Hatsune Miku'),

  // Mario / Nintendo
  c('mario', 'Mario', 'マリオ', 'まりお', 'mario', 'mario', '🍄', '#ef4444',
    { en: 'Nintendo\'s mascot plumber, created by Shigeru Miyamoto.', it: 'L\'idraulico mascotte Nintendo, creato da Shigeru Miyamoto.' }, 'Mario'),
  c('luigi', 'Luigi', 'ルイージ', 'るいーじ', 'ruiiji', 'mario', '🟢', '#22c55e',
    { en: 'Mario\'s younger brother.', it: 'Il fratello minore di Mario.' }),
  c('bowser', 'Bowser', 'クッパ', 'くっぱ', 'kuppa', 'mario', '🐢', '#f97316',
    { en: 'The Koopa king; called "Kuppa" in Japan.', it: 'Il re dei Koopa; in Giappone si chiama "Kuppa".' }, 'Bowser'),
  c('kirby', 'Kirby', 'カービィ', 'かーびぃ', 'kaabii', 'mario', '🌟', '#f9a8d4',
    { en: 'A pink puffball hero who inhales enemies.', it: 'Un eroe rosa e soffice che inghiotte i nemici.' }, 'Kirby (character)'),

  // Zelda
  c('link', 'Link', 'リンク', 'りんく', 'rinku', 'zelda', '🗡️', '#22c55e',
    { en: 'The hero of The Legend of Zelda series.', it: 'L\'eroe della serie The Legend of Zelda.' }, 'Link (The Legend of Zelda)'),
  c('zelda', 'Princess Zelda', 'ゼルダ', 'ぜるだ', 'zeruda', 'zelda', '👑', '#fbbf24',
    { en: 'The princess of Hyrule.', it: 'La principessa di Hyrule.' }, 'Princess Zelda'),

  // Ghibli
  c('totoro', 'Totoro', 'トトロ', 'ととろ', 'totoro', 'ghibli', '🌳', '#10b981',
    { en: 'The forest spirit from My Neighbor Totoro.', it: 'Lo spirito della foresta di Il mio vicino Totoro.' }, 'My Neighbor Totoro'),

  // Sailor Moon
  c('usagi', 'Sailor Moon (Usagi)', '月野うさぎ', 'つきのうさぎ', 'tsukino usagi', 'sailormoon', '🌙', '#ec4899',
    { en: 'Usagi Tsukino transforms into Sailor Moon.', it: 'Usagi Tsukino si trasforma in Sailor Moon.' }, 'Sailor Moon (character)'),

  // Evangelion
  c('shinji', 'Shinji Ikari', '碇シンジ', 'いかりしんじ', 'ikari shinji', 'evangelion', '🤖', '#a855f7',
    { en: 'The reluctant Eva pilot of Neon Genesis Evangelion.', it: 'Il riluttante pilota di Eva di Neon Genesis Evangelion.' }, 'Shinji Ikari'),
  c('rei', 'Rei Ayanami', '綾波レイ', 'あやなみれい', 'ayanami rei', 'evangelion', '🔵', '#38bdf8',
    { en: 'The enigmatic pilot of Evangelion Unit-00.', it: 'L\'enigmatica pilota dell\'Eva-00.' }, 'Rei Ayanami'),

  // Demon Slayer
  c('tanjiro', 'Tanjiro Kamado', '竈門炭治郎', 'かまどたんじろう', 'kamado tanjirou', 'demonslayer', '⚔️', '#0ea5e9',
    { en: 'The kind-hearted demon slayer protagonist.', it: 'Il protagonista cacciatore di demoni dal cuore gentile.' }, 'Tanjiro Kamado'),
  c('nezuko', 'Nezuko Kamado', '竈門禰豆子', 'かまどねずこ', 'kamado nezuko', 'demonslayer', '🎋', '#ec4899',
    { en: 'Tanjiro\'s sister, turned into a demon.', it: 'La sorella di Tanjiro, trasformata in demone.' }, 'Nezuko Kamado'),

  // Doraemon
  c('doraemon', 'Doraemon', 'ドラえもん', 'どらえもん', 'doraemon', 'doraemon', '🐱', '#3b82f6',
    { en: 'A robotic cat from the future with gadget pockets.', it: 'Un gatto robot dal futuro con tasche piene di gadget.' }, 'Doraemon')
];

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
