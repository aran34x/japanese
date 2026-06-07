// Themed Adventure tracks: Music, Anime, Videogames. Each track has a host
// character who shares REAL factual history about that part of Japanese
// culture, plus a set of comprehension challenges. All passages are ORIGINAL,
// accurate Japanese (no copyrighted lyrics/quotes/scripts bundled here).

export type Track = 'music' | 'anime' | 'videogames';

export interface LocalizedList {
  en: string[];
  it: string[];
}
export interface Localized {
  en: string;
  it: string;
}

export interface TrackHost {
  track: Track;
  name: string;
  role: Localized;
  emoji: string;
  color: string;
  /** Real, factual statements the host "says" about the genre's history. */
  facts: LocalizedList;
}

export interface ChallengeQuestion {
  prompt: Localized;
  options: { en: string; it: string; correct: boolean }[];
}

export interface VocabItem {
  jp: string;
  reading: string;
  meaning: Localized;
}

export interface GrammarPoint {
  point: Localized;
  example: string;
  exampleMeaning: Localized;
}

/** The gentle, retry-oriented tutorial shown when a challenge is failed. */
export interface Lesson {
  intro: Localized;
  vocab: VocabItem[];
  grammar: GrammarPoint[];
  tip: Localized;
}

export interface Challenge {
  id: string;
  track: Track;
  title: Localized;
  /** Optional media: a YouTube / YouTube Music URL or search link. */
  youtube?: string;
  youtubeLabel?: Localized;
  /** The Japanese passage under study (lyrics / quote / instructions). */
  passage: string;
  passageReading?: string;
  passageTranslation: Localized;
  questions: ChallengeQuestion[];
  lesson: Lesson;
  builtin: boolean;
  /** XP awarded on first clear. */
  xp: number;
}

export const TRACK_META: Record<Track, { name: Localized; emoji: string; color: string }> = {
  music: { name: { en: 'Music', it: 'Musica' }, emoji: '🎵', color: '#ec4899' },
  anime: { name: { en: 'Anime', it: 'Anime' }, emoji: '📺', color: '#8b5cf6' },
  videogames: { name: { en: 'Videogames', it: 'Videogiochi' }, emoji: '🎮', color: '#22c55e' }
};

export const HOSTS: TrackHost[] = [
  {
    track: 'music',
    name: 'Hikari',
    role: { en: 'J-Pop Idol', it: 'Idol del J-Pop' },
    emoji: '🎤',
    color: '#ec4899',
    facts: {
      en: [
        'The word "karaoke" means "empty orchestra" — kara (空, empty) + oke (orchestra).',
        'The term "J-pop" was popularised around 1990 by the Tokyo radio station J-WAVE.',
        'The virtual singer Hatsune Miku, released in 2007, is a Vocaloid software voice.'
      ],
      it: [
        'La parola "karaoke" significa "orchestra vuota" — kara (空, vuoto) + oke (orchestra).',
        'Il termine "J-pop" fu reso popolare intorno al 1990 dalla radio di Tokyo J-WAVE.',
        'La cantante virtuale Hatsune Miku, uscita nel 2007, è una voce del software Vocaloid.'
      ]
    }
  },
  {
    track: 'anime',
    name: 'Ren',
    role: { en: 'Shonen Hero', it: 'Eroe Shonen' },
    emoji: '⚔',
    color: '#8b5cf6',
    facts: {
      en: [
        'The word "anime" comes from the English word "animation".',
        "Osamu Tezuka's Astro Boy (Tetsuwan Atomu, 1963) was one of the first hit TV anime.",
        'Studio Ghibli was founded in 1985 by Hayao Miyazaki and Isao Takahata.'
      ],
      it: [
        'La parola "anime" deriva dall\'inglese "animation".',
        'Astro Boy (Tetsuwan Atomu, 1963) di Osamu Tezuka fu uno dei primi anime TV di successo.',
        'Lo Studio Ghibli fu fondato nel 1985 da Hayao Miyazaki e Isao Takahata.'
      ]
    }
  },
  {
    track: 'videogames',
    name: 'Pixel',
    role: { en: 'Platformer Mascot', it: 'Mascotte Platform' },
    emoji: '🕹',
    color: '#22c55e',
    facts: {
      en: [
        'Nintendo was founded in 1889 as a hanafuda playing-card company.',
        'The Family Computer (Famicom) launched in Japan in 1983.',
        'Space Invaders (1978) was created by Tomohiro Nishikado at Taito.'
      ],
      it: [
        'Nintendo fu fondata nel 1889 come azienda di carte da gioco hanafuda.',
        'Il Family Computer (Famicom) uscì in Giappone nel 1983.',
        'Space Invaders (1978) fu creato da Tomohiro Nishikado alla Taito.'
      ]
    }
  }
];

export function hostFor(track: Track): TrackHost {
  return HOSTS.find((h) => h.track === track)!;
}
