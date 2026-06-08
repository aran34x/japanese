// Tae Kim's Guide to Japanese Grammar — beginner core (Writing System + Basic
// Grammar), adapted as a structured reader for Nihongo Quest.
//
// Source: Tae Kim — "Guide to Japanese Grammar" (guidetojapanese.org).
// Licensed CC BY-NC-SA 4.0. This is a faithful, abridged adaptation used
// non-commercially with attribution and share-alike. Examples and explanations
// follow Tae Kim's own progression and wording.

export interface BookExample {
  jp: string;
  reading?: string;
  en: string;
}

export type BookBlock =
  | { type: 'p'; en: string }
  | { type: 'note'; en: string }
  | { type: 'example'; items: BookExample[] }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface BookSection {
  heading: string;
  blocks: BookBlock[];
}

export interface BookChapter {
  id: string;
  title: string;
  jpTitle?: string;
  level: 'Start' | 'N5' | 'N5+';
  group: 'writing' | 'basic';
  sections: BookSection[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  /** Ordered groups for the chapter list. */
  groups: { id: BookChapter['group']; label: string }[];
  chapters: BookChapter[];
}

const HIRAGANA_CHART: BookBlock = {
  type: 'table',
  head: ['', 'a', 'i', 'u', 'e', 'o'],
  rows: [
    ['—', 'あ', 'い', 'う', 'え', 'お'],
    ['k', 'か', 'き', 'く', 'け', 'こ'],
    ['s', 'さ', 'し', 'す', 'せ', 'そ'],
    ['t', 'た', 'ち', 'つ', 'て', 'と'],
    ['n', 'な', 'に', 'ぬ', 'ね', 'の'],
    ['h', 'は', 'ひ', 'ふ', 'へ', 'ほ'],
    ['m', 'ま', 'み', 'む', 'め', 'も'],
    ['y', 'や', '', 'ゆ', '', 'よ'],
    ['r', 'ら', 'り', 'る', 'れ', 'ろ'],
    ['w', 'わ', '', '', '', 'を'],
    ['n', 'ん', '', '', '', '']
  ]
};

const KATAKANA_CHART: BookBlock = {
  type: 'table',
  head: ['', 'a', 'i', 'u', 'e', 'o'],
  rows: [
    ['—', 'ア', 'イ', 'ウ', 'エ', 'オ'],
    ['k', 'カ', 'キ', 'ク', 'ケ', 'コ'],
    ['s', 'サ', 'シ', 'ス', 'セ', 'ソ'],
    ['t', 'タ', 'チ', 'ツ', 'テ', 'ト'],
    ['n', 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ'],
    ['h', 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ'],
    ['m', 'マ', 'ミ', 'ム', 'メ', 'モ'],
    ['y', 'ヤ', '', 'ユ', '', 'ヨ'],
    ['r', 'ラ', 'リ', 'ル', 'レ', 'ロ'],
    ['w', 'ワ', '', '', '', 'ヲ'],
    ['n', 'ン', '', '', '', '']
  ]
};

export const TAEKIM: Book = {
  id: 'taekim',
  title: "Tae Kim's Grammar Guide",
  author: 'Tae Kim',
  sourceUrl: 'https://guidetojapanese.org/learn/grammar',
  license: 'CC BY-NC-SA 4.0',
  groups: [
    { id: 'writing', label: 'The Writing System' },
    { id: 'basic', label: 'Basic Grammar' }
  ],
  chapters: [
    // ── Writing System ──────────────────────────────────────────────
    {
      id: 'hiragana',
      title: 'Hiragana',
      jpTitle: 'ひらがな',
      level: 'Start',
      group: 'writing',
      sections: [
        {
          heading: 'What hiragana is for',
          blocks: [
            { type: 'p', en: 'Hiragana is the basic Japanese phonetic script: it can represent every sound in the language. It is used for native Japanese words and for all the grammatical "glue" — particles and verb/adjective endings.' },
            { type: 'p', en: 'In principle you could write everything in hiragana, but because Japanese has no spaces between words, all-hiragana text is hard to read. That is one reason kanji exists.' },
            HIRAGANA_CHART
          ]
        },
        {
          heading: 'Voiced sounds (dakuten / handakuten)',
          blocks: [
            { type: 'p', en: 'Five extra consonant sounds are made by adding two small strokes (dakuten ゛) or a small circle (handakuten ゜). They "muddy" the sound: か → が, さ → ざ, た → だ, は → ば, and は → ぱ.' },
            { type: 'example', items: [
              { jp: 'か → が', reading: 'ka → ga', en: 'voicing with dakuten' },
              { jp: 'は → ば → ぱ', reading: 'ha → ba → pa', en: 'dakuten and handakuten' }
            ] }
          ]
        },
        {
          heading: 'Small ゃ ゅ ょ and small っ',
          blocks: [
            { type: 'p', en: 'Attaching a small や/ゆ/よ to an i-row character blends them into one sound (youon): きゃ = kya, しゃ = sha, ちゃ = cha.' },
            { type: 'p', en: 'A small っ doubles the consonant of the following character (it is a short pause).' },
            { type: 'example', items: [
              { jp: 'ざっし', reading: 'zasshi', en: 'magazine' },
              { jp: 'きょう', reading: 'kyou', en: 'today' }
            ] }
          ]
        },
        {
          heading: 'Long vowels',
          blocks: [
            { type: 'p', en: 'A long vowel is written by adding あ, い, or う after the matching vowel. Length changes meaning, so read it out fully.' },
            { type: 'example', items: [
              { jp: 'がくせい', reading: 'gakusei', en: 'student' },
              { jp: 'おかあさん', reading: 'okaasan', en: 'mother' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'katakana',
      title: 'Katakana',
      jpTitle: 'カタカナ',
      level: 'Start',
      group: 'writing',
      sections: [
        {
          heading: 'What katakana is for',
          blocks: [
            { type: 'p', en: 'Katakana represents the same sounds as hiragana with different characters. It is used mainly for words borrowed from other languages, and sometimes for emphasis (like italics).' },
            KATAKANA_CHART
          ]
        },
        {
          heading: 'Long vowels and foreign sounds',
          blocks: [
            { type: 'p', en: 'In katakana a long vowel is written with a dash ー. Because foreign words must fit Japanese sounds, they change a lot when written in katakana.' },
            { type: 'example', items: [
              { jp: 'コーヒー', reading: 'koohii', en: 'coffee' },
              { jp: 'ケーキ', reading: 'keeki', en: 'cake' },
              { jp: 'アメリカ', reading: 'amerika', en: 'America' }
            ] },
            { type: 'note', en: 'New combinations cover foreign sounds, e.g. ファ (fa), ウィ (wi), ウェ (we).' }
          ]
        }
      ]
    },
    {
      id: 'kanji',
      title: 'Kanji',
      jpTitle: '漢字',
      level: 'N5',
      group: 'writing',
      sections: [
        {
          heading: 'What kanji are',
          blocks: [
            { type: 'p', en: 'Kanji are Chinese characters used to write nouns, the stems of verbs and adjectives, and many adverbs. You need them to read most real Japanese, and they also visually separate words in spaceless text.' }
          ]
        },
        {
          heading: 'On-yomi and kun-yomi',
          blocks: [
            { type: 'p', en: 'Most kanji have two kinds of reading: the 音読み (on-yomi), the original Chinese-derived reading used mostly in compound words; and the 訓読み (kun-yomi), the native Japanese reading used mostly when the kanji stands alone.' },
            { type: 'example', items: [
              { jp: '力', reading: 'chikara (kun)', en: 'power — standalone' },
              { jp: '能力', reading: 'nouryoku (on)', en: 'ability — in a compound' }
            ] },
            { type: 'note', en: 'Some compounds have special readings unrelated to the individual kanji and must be memorized — treat names and such words as their own vocabulary.' }
          ]
        },
        {
          heading: 'Okurigana',
          blocks: [
            { type: 'p', en: 'Okurigana are the kana that trail a kanji in verbs and adjectives. They let the kanji keep one reading while the ending conjugates.' },
            { type: 'example', items: [
              { jp: '食べる → 食べた', reading: 'taberu → tabeta', en: 'eat → ate (食 stays た-be)' }
            ] }
          ]
        }
      ]
    },

    // ── Basic Grammar ───────────────────────────────────────────────
    {
      id: 'state-of-being',
      title: 'State-of-Being (だ / です)',
      jpTitle: 'だ・です',
      level: 'Start',
      group: 'basic',
      sections: [
        {
          heading: 'There is no "to be"',
          blocks: [
            { type: 'p', en: 'Japanese has no verb that works like English "to be." Instead you attach 「だ」 to a noun or na-adjective to declare what something is.' },
            { type: 'example', items: [
              { jp: '人だ', reading: 'hito da', en: 'is a person' },
              { jp: '学生だ', reading: 'gakusei da', en: 'is a student' },
              { jp: '元気だ', reading: 'genki da', en: 'is well' }
            ] },
            { type: 'note', en: 'In casual speech 「だ」 is often dropped: 「元気？」「元気。」 (Are you well? — I\'m well.) Using 「だ」 makes the statement firmer and more declarative.' }
          ]
        },
        {
          heading: 'Negative and past',
          blocks: [
            { type: 'p', en: 'Attach 「じゃない」 for the negative, 「だった」 for the past, and 「じゃなかった」 for the negative past.' },
            { type: 'example', items: [
              { jp: '学生じゃない', reading: 'gakusei ja nai', en: 'is not a student' },
              { jp: '学生だった', reading: 'gakusei datta', en: 'was a student' },
              { jp: '学生じゃなかった', reading: 'gakusei ja nakatta', en: 'was not a student' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'particles-intro',
      title: 'Particles は, も, が',
      jpTitle: 'は・も・が',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'What particles do',
          blocks: [
            { type: 'p', en: 'Particles are hiragana that attach to a word to define its grammatical job. Change the particle and you change the meaning of the sentence.' }
          ]
        },
        {
          heading: 'は — the topic',
          blocks: [
            { type: 'p', en: '「は」 marks the topic: what the sentence is about. It is written は but pronounced "wa" when used as a particle. Once a topic is set, you don\'t need to repeat it.' },
            { type: 'example', items: [
              { jp: 'アリスは学生？', reading: 'Arisu wa gakusei?', en: 'Is Alice a student?' }
            ] }
          ]
        },
        {
          heading: 'も — "also"',
          blocks: [
            { type: 'p', en: '「も」 replaces は to mean "also" — it adds another topic that shares the same statement.' },
            { type: 'example', items: [
              { jp: 'トムも学生。', reading: 'Tomu mo gakusei.', en: 'Tom is also a student.' }
            ] }
          ]
        },
        {
          heading: 'が — the identifier',
          blocks: [
            { type: 'p', en: '「が」 points out which unknown thing is the one in question. It answers "who?" or "what?" when the subject isn\'t yet known. は talks about a topic in general; が singles out a specific one.' },
            { type: 'example', items: [
              { jp: '誰が学生？', reading: 'dare ga gakusei?', en: 'Who is the student?' },
              { jp: 'ジョンが学生。', reading: 'Jon ga gakusei.', en: 'John is the one who is a student.' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'adjectives',
      title: 'Adjectives (い / な)',
      jpTitle: '形容詞',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'na-adjectives',
          blocks: [
            { type: 'p', en: 'There are two kinds of adjective. na-adjectives behave like nouns. To put one directly in front of a noun, link them with 「な」. They conjugate exactly like nouns (with だ/じゃない/だった).' },
            { type: 'example', items: [
              { jp: '静かな人', reading: 'shizuka na hito', en: 'a quiet person' },
              { jp: '魚が好きだ', reading: 'sakana ga suki da', en: 'likes fish' },
              { jp: '魚が好きじゃない', reading: 'sakana ga suki ja nai', en: 'does not like fish' }
            ] }
          ]
        },
        {
          heading: 'i-adjectives',
          blocks: [
            { type: 'p', en: 'i-adjectives all end in い. Never attach だ to them, and they modify a noun directly — no な needed. To conjugate, drop the い: negative = くない, past = かった, negative past = くなかった.' },
            { type: 'example', items: [
              { jp: '高いビル', reading: 'takai biru', en: 'a tall building' },
              { jp: '高くない', reading: 'takakunai', en: 'is not tall' },
              { jp: '高かった', reading: 'takakatta', en: 'was tall' }
            ] },
            { type: 'note', en: 'Exception: いい (good) conjugates from its older form よい → よくない, よかった.' }
          ]
        }
      ]
    },
    {
      id: 'verbs',
      title: 'Verb Basics',
      jpTitle: '動詞',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'ru-verbs and u-verbs',
          blocks: [
            { type: 'p', en: 'Almost every verb is a ru-verb or a u-verb (only two are irregular). All ru-verbs end in る; u-verbs can end in several u-sounds, including る. The dictionary form is the plain present tense.' },
            { type: 'example', items: [
              { jp: '食べる', reading: 'taberu', en: 'to eat (ru-verb)' },
              { jp: '分かる', reading: 'wakaru', en: 'to understand (u-verb)' }
            ] },
            { type: 'note', en: 'The two exceptions are する (to do) and 来る・くる (to come).' }
          ]
        },
        {
          heading: 'A verb is a whole sentence',
          blocks: [
            { type: 'p', en: 'Unlike English, a grammatically complete Japanese sentence needs only a verb. The verb always comes at the end of the clause; the subject (if stated) comes before it with a particle.' },
            { type: 'example', items: [
              { jp: '食べる。', reading: 'taberu.', en: 'Eat. / I eat. / She eats.' },
              { jp: 'アリスは食べる。', reading: 'Arisu wa taberu.', en: 'Alice eats.' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'negative-verbs',
      title: 'Negative Verbs',
      jpTitle: '否定形',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'Making the negative (ない)',
          blocks: [
            { type: 'p', en: 'For ru-verbs, drop る and add ない. For u-verbs ending in う, replace う with わ and add ない. For other u-verbs, change the final u-sound to its a-sound and add ない.' },
            { type: 'example', items: [
              { jp: '食べる → 食べない', reading: 'taberu → tabenai', en: 'eat → does not eat' },
              { jp: '買う → 買わない', reading: 'kau → kawanai', en: 'buy → does not buy' },
              { jp: '待つ → 待たない', reading: 'matsu → matanai', en: 'wait → does not wait' }
            ] },
            { type: 'note', en: 'Exceptions: する → しない, くる → こない, ある → ない.' }
          ]
        }
      ]
    },
    {
      id: 'past-tense',
      title: 'Past Tense',
      jpTitle: '過去形',
      level: 'N5+',
      group: 'basic',
      sections: [
        {
          heading: 'ru-verbs',
          blocks: [
            { type: 'p', en: 'Drop る and add た.' },
            { type: 'example', items: [
              { jp: '食べる → 食べた', reading: 'taberu → tabeta', en: 'eat → ate' },
              { jp: '見る → 見た', reading: 'miru → mita', en: 'see → saw' }
            ] }
          ]
        },
        {
          heading: 'u-verbs (by ending)',
          blocks: [
            { type: 'p', en: 'The past-tense ending depends on the final kana: む/ぶ/ぬ → んだ; く → いた; ぐ → いだ; す → した; つ/う/る → った.' },
            { type: 'example', items: [
              { jp: '飲む → 飲んだ', reading: 'nomu → nonda', en: 'drink → drank' },
              { jp: '書く → 書いた', reading: 'kaku → kaita', en: 'write → wrote' },
              { jp: '話す → 話した', reading: 'hanasu → hanashita', en: 'speak → spoke' },
              { jp: '買う → 買った', reading: 'kau → katta', en: 'buy → bought' }
            ] },
            { type: 'note', en: 'Exceptions: する → した, 来る → 来た (kita), 行く → 行った (itta).' }
          ]
        }
      ]
    },
    {
      id: 'verb-particles',
      title: 'Particles with Verbs (を / に / へ / で)',
      jpTitle: 'を・に・へ・で',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'を — the direct object',
          blocks: [
            { type: 'p', en: '「を」 marks the thing a verb acts on (read "o"). With motion verbs it can mark the place moved through.' },
            { type: 'example', items: [
              { jp: '魚を食べる。', reading: 'sakana o taberu.', en: 'eat fish' }
            ] }
          ]
        },
        {
          heading: 'に — target, place of existence, time',
          blocks: [
            { type: 'p', en: '「に」 marks a destination, where something exists, or a point in time.' },
            { type: 'example', items: [
              { jp: '日本に行った。', reading: 'Nihon ni itta.', en: 'went to Japan' },
              { jp: '猫は部屋にいる。', reading: 'neko wa heya ni iru.', en: 'the cat is in the room' },
              { jp: '七時に起きる。', reading: 'shichi-ji ni okiru.', en: 'wake up at seven' }
            ] }
          ]
        },
        {
          heading: 'へ — direction',
          blocks: [
            { type: 'p', en: '「へ」 (read "e") marks heading toward a direction, not necessarily a final destination. Used with motion verbs.' },
            { type: 'example', items: [
              { jp: '学校へ行きます。', reading: 'gakkou e ikimasu.', en: 'go (toward) school' }
            ] }
          ]
        },
        {
          heading: 'で — place of action, means',
          blocks: [
            { type: 'p', en: '「で」 marks where an action happens, or the means used to do it.' },
            { type: 'example', items: [
              { jp: '公園で遊ぶ。', reading: 'kouen de asobu.', en: 'play in the park' },
              { jp: 'バスで帰る。', reading: 'basu de kaeru.', en: 'go home by bus' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'noun-particles',
      title: 'Noun Particles (の / と / や)',
      jpTitle: 'の・と・や',
      level: 'N5',
      group: 'basic',
      sections: [
        {
          heading: 'の — possession / linking nouns',
          blocks: [
            { type: 'p', en: '「の」 connects two nouns to show possession or description ("A\'s B" / "B of A"). It can also stand in for a noun ("the ~ one").' },
            { type: 'example', items: [
              { jp: 'ボブの本', reading: 'Bobu no hon', en: "Bob's book" },
              { jp: '白いのは、かわいい。', reading: 'shiroi no wa, kawaii.', en: 'the white one is cute' }
            ] }
          ]
        },
        {
          heading: 'と — "and" / "with"',
          blocks: [
            { type: 'p', en: '「と」 joins nouns completely ("and"), or marks who you do something with.' },
            { type: 'example', items: [
              { jp: 'ナイフとフォーク', reading: 'naifu to fooku', en: 'knife and fork' },
              { jp: '友達と話した。', reading: 'tomodachi to hanashita.', en: 'talked with a friend' }
            ] }
          ]
        },
        {
          heading: 'や — a vague list',
          blocks: [
            { type: 'p', en: '「や」 (and とか) lists nouns loosely, implying there are others too ("things like ~, etc.").' },
            { type: 'example', items: [
              { jp: '靴やシャツを買う。', reading: 'kutsu ya shatsu o kau.', en: 'buy shoes and shirts (and such)' }
            ] }
          ]
        }
      ]
    },
    {
      id: 'adverbs',
      title: 'Adverbs & ね / よ',
      jpTitle: '副詞・ね・よ',
      level: 'N5+',
      group: 'basic',
      sections: [
        {
          heading: 'Adjectives into adverbs',
          blocks: [
            { type: 'p', en: 'Turn an i-adjective into an adverb by changing い to く; turn a na-adjective into an adverb by adding に.' },
            { type: 'example', items: [
              { jp: '早い → 早く', reading: 'hayai → hayaku', en: 'fast → quickly' },
              { jp: 'きれい → きれいに', reading: 'kirei → kirei ni', en: 'pretty → prettily' },
              { jp: '朝ご飯を早く食べた。', reading: 'asagohan o hayaku tabeta.', en: 'ate breakfast quickly' }
            ] }
          ]
        },
        {
          heading: 'ね and よ',
          blocks: [
            { type: 'p', en: '「ね」 at the end seeks agreement ("right?", "isn\'t it?"). 「よ」 tells the listener something new ("you know..."). Together, 「よね」 does both.' },
            { type: 'example', items: [
              { jp: 'いい天気だね。', reading: 'ii tenki da ne.', en: 'Nice weather, isn\'t it?' },
              { jp: '時間がないよ。', reading: 'jikan ga nai yo.', en: 'There\'s no time, you know.' }
            ] }
          ]
        }
      ]
    }
  ]
};
