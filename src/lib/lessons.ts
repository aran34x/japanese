import { writable, get } from 'svelte/store';
import { db } from './db';
import type { Lang } from './types';
import type { FictionalChar } from './data/game/fictional';
import type { Story } from './data/stories';

export type LessonCategory = 'foundation' | 'particles' | 'grammar' | 'vocabulary' | 'reading';

export interface AppLesson {
  id: string;
  category: LessonCategory;
  level: 'Start' | 'N5' | 'N5+' | 'N4';
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  teaches: Record<Lang, string[]>;
  patterns: { jp: string; reading: string; en: string; it: string }[];
  examples: { jp: string; reading: string; en: string; it: string }[];
  /** Optional hand-authored quiz; if absent, a hardened quiz is generated. */
  quiz?: LessonQuizQuestion[];
  /** Hand-authored Bunpo-style sections (meaning / formation / examples). */
  content?: LessonSection[];
  /** Links this lesson to a chapter in the Guide (Tae Kim) for "read the full chapter". */
  bookChapterId?: string;
}

export interface LessonSection {
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  examples?: { jp: string; reading: string; en: string; it: string }[];
  note?: Record<Lang, string>;
}

/** Multiple-choice (also used for fill-in-the-blank — the blank lives in the prompt). */
export interface QuizChoice {
  kind?: 'mcq';
  prompt: Record<Lang, string>;
  options: { label: Record<Lang, string>; correct: boolean }[];
  explanation: Record<Lang, string>;
}

/** Word-order "build the sentence": tap the shuffled tokens into the right order. */
export interface QuizOrder {
  kind: 'order';
  prompt: Record<Lang, string>;
  tokens: string[];
  answer: string[];
  reading?: string;
  translation?: Record<Lang, string>;
  explanation: Record<Lang, string>;
}

export type LessonQuizQuestion = QuizChoice | QuizOrder;

const META_KEY = 'lessonProgress';

export const lessonProgress = writable<string[]>([]);

export const LESSON_CATEGORIES: Record<LessonCategory, { label: Record<Lang, string> }> = {
  foundation: { label: { en: 'Foundations', it: 'Fondamenta' } },
  particles: { label: { en: 'Particles', it: 'Particelle' } },
  grammar: { label: { en: 'Grammar', it: 'Grammatica' } },
  vocabulary: { label: { en: 'Vocabulary', it: 'Vocabolario' } },
  reading: { label: { en: 'Reading', it: 'Lettura' } }
};

export const LESSONS: AppLesson[] = [
  {
    id: 'kana-names',
    category: 'foundation',
    level: 'Start',
    bookChapterId: 'hiragana',
    title: { en: 'Kana for Names', it: 'Kana per i nomi' },
    summary: {
      en: 'Read hiragana and katakana slowly, one sound at a time. Character names often use katakana.',
      it: 'Leggi hiragana e katakana lentamente, un suono alla volta. I nomi dei personaggi spesso usano il katakana.'
    },
    teaches: {
      en: ['Hiragana sounds', 'Katakana names', 'Long vowels like マリオ and ルイージ'],
      it: ['Suoni hiragana', 'Nomi in katakana', 'Vocali lunghe come マリオ e ルイージ']
    },
    patterns: [
      { jp: 'カタカナ', reading: 'katakana', en: 'katakana', it: 'katakana' },
      { jp: 'ひらがな', reading: 'hiragana', en: 'hiragana', it: 'hiragana' }
    ],
    examples: [
      { jp: 'マリオ', reading: 'mario', en: 'Mario', it: 'Mario' },
      { jp: 'ピカチュウ', reading: 'pikachuu', en: 'Pikachu', it: 'Pikachu' }
    ]
  },
  {
    id: 'desu-identity',
    category: 'grammar',
    level: 'Start',
    bookChapterId: 'state-of-being',
    title: { en: 'State-of-Being (だ / です)', it: "Stato dell'essere (だ / です)" },
    summary: {
      en: 'Japanese has no verb "to be". You attach だ (plain) or です (polite) to a noun to declare what something is.',
      it: 'Il giapponese non ha il verbo "essere". Attacchi だ (semplice) o です (cortese) a un nome per dire cos\'è qualcosa.'
    },
    teaches: {
      en: ['Noun + だ / です', 'Negative じゃない', 'Past だった'],
      it: ['Nome + だ / です', 'Negativo じゃない', 'Passato だった']
    },
    patterns: [
      { jp: '〜だ', reading: '~ da', en: 'is ~ (plain)', it: 'è ~ (semplice)' },
      { jp: '〜じゃない', reading: '~ ja nai', en: 'is not ~', it: 'non è ~' }
    ],
    examples: [
      { jp: '学生だ。', reading: 'gakusei da.', en: 'is a student', it: 'è uno studente' },
      { jp: '学生じゃない。', reading: 'gakusei ja nai.', en: 'is not a student', it: 'non è uno studente' }
    ]
  },
  {
    id: 'wa-topic',
    category: 'particles',
    level: 'N5',
    bookChapterId: 'particles-intro',
    title: { en: 'The Topic Particle は', it: 'La particella tema は' },
    summary: {
      en: 'は marks the topic — what the sentence is about. It is written は but pronounced "wa". も replaces は to mean "also".',
      it: 'は marca il tema — di cosa parla la frase. Si scrive は ma si pronuncia "wa". も sostituisce は per dire "anche".'
    },
    teaches: {
      en: ['は marks the topic', 'Read は as "wa"', 'も means "also"'],
      it: ['は marca il tema', 'Leggere は come "wa"', 'も significa "anche"']
    },
    patterns: [
      { jp: 'A は B', reading: 'A wa B', en: 'As for A, B', it: 'Quanto ad A, B' }
    ],
    examples: [
      { jp: 'アリスは学生。', reading: 'Arisu wa gakusei.', en: 'As for Alice, (she is) a student.', it: 'Quanto ad Alice, è una studentessa.' },
      { jp: 'トムも学生。', reading: 'Tomu mo gakusei.', en: 'Tom is also a student.', it: 'Anche Tom è uno studente.' }
    ]
  },
  {
    id: 'ga-subject',
    category: 'particles',
    level: 'N5',
    bookChapterId: 'particles-intro',
    title: { en: 'The Identifier Particle が', it: "La particella identificatore が" },
    summary: {
      en: 'が singles out which unknown thing is the one in question. は talks about a topic in general; が answers "who?" or "what?".',
      it: 'が indica quale cosa sconosciuta è quella in questione. は parla di un tema in generale; が risponde a "chi?" o "cosa?".'
    },
    teaches: {
      en: ['が identifies the subject', 'は (general) vs が (specific)', 'Answering who/what'],
      it: ['が identifica il soggetto', 'は (generale) vs が (specifico)', 'Rispondere a chi/cosa']
    },
    patterns: [
      { jp: '誰が〜', reading: 'dare ga ~', en: 'who is the one that ~', it: 'chi è quello che ~' }
    ],
    examples: [
      { jp: '誰が学生？', reading: 'dare ga gakusei?', en: 'Who is the student?', it: 'Chi è lo studente?' },
      { jp: 'ジョンが学生。', reading: 'Jon ga gakusei.', en: 'John is the one who is a student.', it: 'John è quello che è studente.' }
    ]
  },
  {
    id: 'no-possessive',
    category: 'particles',
    level: 'N5',
    bookChapterId: 'noun-particles',
    title: { en: 'The の Link', it: 'Il collegamento の' },
    summary: {
      en: 'の connects two nouns to show possession or description ("A\'s B" / "B of A"). It can also stand in for a noun ("the ~ one").',
      it: 'の collega due nomi per indicare possesso o descrizione ("B di A"). Può anche sostituire un nome ("quello ~").'
    },
    teaches: {
      en: ['Possession (A の B)', 'Description', 'の as "the ~ one"'],
      it: ['Possesso (A の B)', 'Descrizione', 'の come "quello ~"']
    },
    patterns: [
      { jp: 'A の B', reading: 'A no B', en: "B of A / A's B", it: 'B di A' }
    ],
    examples: [
      { jp: 'ボブの本', reading: 'Bobu no hon', en: "Bob's book", it: 'il libro di Bob' },
      { jp: '白いのはかわいい。', reading: 'shiroi no wa kawaii.', en: 'The white one is cute.', it: 'Quello bianco è carino.' }
    ]
  },
  {
    id: 'kara-from',
    category: 'particles',
    level: 'N5',
    title: { en: 'から Means From', it: 'から significa da' },
    summary: {
      en: 'から marks a starting point: from a place, from a time, or from a source.',
      it: 'から marca un punto di partenza: da un luogo, da un tempo, o da una fonte.'
    },
    teaches: {
      en: ['From a place', 'From a time', 'Useful story movement'],
      it: ['Da un luogo', 'Da un tempo', 'Movimento utile nelle storie']
    },
    patterns: [
      { jp: 'A から B へ', reading: 'A kara B e', en: 'from A to B', it: 'da A a B' }
    ],
    examples: [
      { jp: '家から学校へ行きます。', reading: 'ie kara gakkou e ikimasu.', en: 'I go from home to school.', it: 'Vado da casa a scuola.' },
      { jp: '朝から勉強します。', reading: 'asa kara benkyou shimasu.', en: 'I study from morning.', it: 'Studio dalla mattina.' }
    ]
  },
  {
    id: 'colors-traits',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Colors and Simple Traits', it: 'Colori e tratti semplici' },
    summary: {
      en: 'Many character clues are built from visible traits: colors, clothes, size, and shape.',
      it: 'Molti indizi sui personaggi vengono da tratti visibili: colori, vestiti, dimensione e forma.'
    },
    teaches: {
      en: ['Colors', 'Clothes', 'Visual character hints'],
      it: ['Colori', 'Vestiti', 'Indizi visivi sui personaggi']
    },
    patterns: [
      { jp: '赤い / 青い / 黄色い', reading: 'akai / aoi / kiiroi', en: 'red / blue / yellow', it: 'rosso / blu / giallo' }
    ],
    examples: [
      { jp: '赤い帽子', reading: 'akai boushi', en: 'red hat', it: 'cappello rosso' },
      { jp: '青い服', reading: 'aoi fuku', en: 'blue clothes', it: 'vestiti blu' }
    ]
  },
  {
    id: 'verbs-actions',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Action Verbs for Clues', it: 'Verbi d azione per gli indizi' },
    summary: {
      en: 'Character and story clues often use everyday actions: go, wear, fight, jump, sleep, play.',
      it: 'Gli indizi di personaggi e storie usano spesso azioni quotidiane: andare, indossare, combattere, saltare, dormire, giocare.'
    },
    teaches: {
      en: ['Common verbs', 'ます polite form', 'Understanding action clues'],
      it: ['Verbi comuni', 'Forma cortese ます', 'Capire indizi d azione']
    },
    patterns: [
      { jp: 'V ます', reading: 'V masu', en: 'polite present/future verb', it: 'verbo cortese presente/futuro' }
    ],
    examples: [
      { jp: 'ジャンプします。', reading: 'janpu shimasu.', en: 'I jump.', it: 'Salto.' },
      { jp: '電気で戦います。', reading: 'denki de tatakaimasu.', en: 'I fight using electricity.', it: "Combatto usando l'elettricita." }
    ]
  },
  {
    id: 'de-using',
    category: 'particles',
    level: 'N5+',
    bookChapterId: 'verb-particles',
    title: { en: 'で — Place of Action & Means', it: 'で — luogo dell\'azione e mezzo' },
    summary: {
      en: 'で marks where an action happens, or the means/tool used to do it.',
      it: "で marca dove avviene un'azione, o il mezzo/strumento usato per farla."
    },
    teaches: {
      en: ['で = where an action happens', 'で = by what means', 'Contrast with に (location of existence)'],
      it: ["で = dove avviene un'azione", 'で = con quale mezzo', 'Contrasto con に (luogo di esistenza)']
    },
    patterns: [
      { jp: 'N で V', reading: 'N de V', en: 'do V at/with N', it: 'fare V in/con N' }
    ],
    examples: [
      { jp: '公園で遊ぶ。', reading: 'kouen de asobu.', en: 'play in the park', it: 'gioco al parco' },
      { jp: 'バスで帰る。', reading: 'basu de kaeru.', en: 'go home by bus', it: 'torno a casa in autobus' }
    ]
  },
  {
    id: 'reading-short-sentences',
    category: 'reading',
    level: 'N5+',
    title: { en: 'Reading Short Sentences', it: 'Leggere frasi brevi' },
    summary: {
      en: 'Break a sentence into small chunks: topic, object, particle, verb.',
      it: 'Dividi una frase in piccoli pezzi: tema, oggetto, particella, verbo.'
    },
    teaches: {
      en: ['Chunking sentences', 'Reading stories line by line', 'Using translations as a check'],
      it: ['Dividere le frasi', 'Leggere storie riga per riga', 'Usare le traduzioni come controllo']
    },
    patterns: [
      { jp: '毎日、公園で遊びます。', reading: 'mainichi, kouen de asobimasu.', en: 'Every day, it plays in the park.', it: 'Ogni giorno gioca al parco.' }
    ],
    examples: [
      { jp: '夜は家で寝ます。', reading: 'yoru wa ie de nemasu.', en: 'At night it sleeps at home.', it: 'Di notte dorme a casa.' },
      { jp: 'わたしはマスクをつけています。', reading: 'watashi wa masuku o tsuketeimasu.', en: 'I am wearing a mask.', it: 'Indosso una maschera.' }
    ]
  },
  {
    id: 'hiragana-sounds',
    category: 'foundation',
    level: 'Start',
    bookChapterId: 'hiragana',
    title: { en: 'Hiragana Sound Map', it: 'Mappa dei suoni hiragana' },
    summary: {
      en: 'Learn hiragana as a sound grid: a, i, u, e, o, then consonant rows.',
      it: 'Impara hiragana come griglia di suoni: a, i, u, e, o, poi le righe consonanti.'
    },
    teaches: {
      en: ['The vowel row', 'Consonant rows', 'Reading kana by sound, not by letter names'],
      it: ['La riga delle vocali', 'Le righe consonanti', 'Leggere kana per suono, non per nome della lettera']
    },
    patterns: [
      { jp: 'あ い う え お', reading: 'a i u e o', en: 'the five base vowels', it: 'le cinque vocali base' },
      { jp: 'か き く け こ', reading: 'ka ki ku ke ko', en: 'the K row', it: 'la riga K' }
    ],
    examples: [
      { jp: 'ねこ', reading: 'neko', en: 'cat', it: 'gatto' },
      { jp: 'さかな', reading: 'sakana', en: 'fish', it: 'pesce' }
    ]
  },
  {
    id: 'sound-changes',
    category: 'foundation',
    level: 'Start',
    bookChapterId: 'hiragana',
    title: { en: 'Dakuten, Small Tsu, Long Sounds', it: 'Dakuten, piccolo tsu, suoni lunghi' },
    summary: {
      en: 'Small marks change sounds. This is essential for names, stories and card readings.',
      it: 'Piccoli segni cambiano i suoni. E fondamentale per nomi, storie e letture delle carte.'
    },
    teaches: {
      en: ['Dakuten like か to が', 'Small っ doubling', 'Long vowels'],
      it: ['Dakuten come か a が', 'Piccolo っ che raddoppia', 'Vocali lunghe']
    },
    patterns: [
      { jp: 'か / が', reading: 'ka / ga', en: 'clear sound / voiced sound', it: 'suono chiaro / suono sonoro' },
      { jp: 'きって', reading: 'kitte', en: 'small っ doubles the next consonant', it: 'piccolo っ raddoppia la consonante dopo' }
    ],
    examples: [
      { jp: 'がっこう', reading: 'gakkou', en: 'school', it: 'scuola' },
      { jp: 'ルイージ', reading: 'ruiiji', en: 'Luigi', it: 'Luigi' }
    ]
  },
  {
    id: 'katakana-basics',
    category: 'foundation',
    level: 'Start',
    bookChapterId: 'katakana',
    title: { en: 'Katakana for Names and Loanwords', it: 'Katakana per nomi e prestiti' },
    summary: {
      en: 'Katakana is common for foreign names, game names, sounds and borrowed words.',
      it: 'Katakana e comune per nomi stranieri, nomi di giochi, suoni e parole prese in prestito.'
    },
    teaches: {
      en: ['Katakana shape recognition', 'Loanwords', 'Character names'],
      it: ['Riconoscere le forme katakana', 'Prestiti linguistici', 'Nomi dei personaggi']
    },
    patterns: [
      { jp: 'テレビ', reading: 'terebi', en: 'television', it: 'televisione' },
      { jp: 'ゲーム', reading: 'geemu', en: 'game', it: 'gioco' }
    ],
    examples: [
      { jp: 'マリオ', reading: 'mario', en: 'Mario', it: 'Mario' },
      { jp: 'ピカチュウ', reading: 'pikachuu', en: 'Pikachu', it: 'Pikachu' }
    ]
  },
  {
    id: 'first-kanji-map',
    category: 'foundation',
    level: 'N5',
    bookChapterId: 'kanji',
    title: { en: 'First Grade Kanji Map', it: 'Mappa dei kanji di prima elementare' },
    summary: {
      en: 'Start with the kanji Japanese children meet early: numbers, nature, body, school and direction words.',
      it: 'Inizia dai kanji che i bambini giapponesi incontrano presto: numeri, natura, corpo, scuola e direzioni.'
    },
    teaches: {
      en: ['Kanji are meaning blocks', 'Simple first-grade kanji', 'Kanji can have more than one reading'],
      it: ['I kanji sono blocchi di significato', 'Kanji semplici da prima elementare', 'I kanji possono avere piu letture']
    },
    patterns: [
      { jp: '一 二 三', reading: 'ichi ni san', en: 'one, two, three', it: 'uno, due, tre' },
      { jp: '日 月 火 水 木 金 土', reading: 'nichi getsu ka sui moku kin do', en: 'day, moon, fire, water, tree, gold, earth', it: 'giorno, luna, fuoco, acqua, albero, oro, terra' }
    ],
    examples: [
      { jp: '山', reading: 'やま', en: 'mountain', it: 'montagna' },
      { jp: '川', reading: 'かわ', en: 'river', it: 'fiume' }
    ]
  },
  {
    id: 'numbers-counting',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Numbers and Counting', it: 'Numeri e contare' },
    summary: {
      en: 'Numbers appear everywhere: dates, scores, school work, time and story details.',
      it: 'I numeri appaiono ovunque: date, punteggi, compiti, tempo e dettagli delle storie.'
    },
    teaches: {
      en: ['1 to 10', 'Bigger numbers', 'Counting people and things as a beginner'],
      it: ['Da 1 a 10', 'Numeri piu grandi', 'Contare persone e cose da principiante']
    },
    patterns: [
      { jp: '一、二、三、四、五', reading: 'ichi, ni, san, yon, go', en: 'one to five', it: 'da uno a cinque' },
      { jp: '十、百、千', reading: 'juu, hyaku, sen', en: 'ten, hundred, thousand', it: 'dieci, cento, mille' }
    ],
    examples: [
      { jp: '三人', reading: 'さんにん', en: 'three people', it: 'tre persone' },
      { jp: '五つ', reading: 'いつつ', en: 'five things', it: 'cinque cose' }
    ]
  },
  {
    id: 'calendar-time',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Days, Months and Time', it: 'Giorni, mesi e tempo' },
    summary: {
      en: 'A first-year learner needs the rhythm of the week, the day and school time.',
      it: 'Uno studente principiante ha bisogno del ritmo della settimana, del giorno e del tempo scolastico.'
    },
    teaches: {
      en: ['Weekdays', 'Morning/day/night', 'Basic time words'],
      it: ['Giorni della settimana', 'Mattina/giorno/notte', 'Parole base del tempo']
    },
    patterns: [
      { jp: '月曜日から金曜日まで', reading: 'getsuyoubi kara kinyoubi made', en: 'from Monday to Friday', it: 'da lunedi a venerdi' },
      { jp: '朝・昼・夜', reading: 'asa / hiru / yoru', en: 'morning / noon / night', it: 'mattina / mezzogiorno / notte' }
    ],
    examples: [
      { jp: '今日は月曜日です。', reading: 'kyou wa getsuyoubi desu.', en: 'Today is Monday.', it: 'Oggi e lunedi.' },
      { jp: '夜は家で寝ます。', reading: 'yoru wa ie de nemasu.', en: 'At night I sleep at home.', it: 'Di notte dormo a casa.' }
    ]
  },
  {
    id: 'school-classroom',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'School and Classroom Words', it: 'Parole di scuola e classe' },
    summary: {
      en: 'Elementary Japanese starts with the world around the child: school, teacher, friends, books and desk.',
      it: 'Il giapponese elementare parte dal mondo intorno al bambino: scuola, maestro, amici, libri e banco.'
    },
    teaches: {
      en: ['School nouns', 'Classroom objects', 'People at school'],
      it: ['Nomi scolastici', 'Oggetti in classe', 'Persone a scuola']
    },
    patterns: [
      { jp: '学校・先生・友だち', reading: 'gakkou / sensei / tomodachi', en: 'school / teacher / friend', it: 'scuola / maestro / amico' },
      { jp: '本・机・鉛筆', reading: 'hon / tsukue / enpitsu', en: 'book / desk / pencil', it: 'libro / banco / matita' }
    ],
    examples: [
      { jp: '先生は教室にいます。', reading: 'sensei wa kyoushitsu ni imasu.', en: 'The teacher is in the classroom.', it: "L'insegnante e in classe." },
      { jp: '本を読みます。', reading: 'hon o yomimasu.', en: 'I read a book.', it: 'Leggo un libro.' }
    ]
  },
  {
    id: 'greetings-classroom',
    category: 'vocabulary',
    level: 'Start',
    title: { en: 'Greetings and Classroom Phrases', it: 'Saluti e frasi da classe' },
    summary: {
      en: 'Polite classroom phrases help you read school stories and understand common Japanese routines.',
      it: 'Le frasi cortesi da classe aiutano a leggere storie scolastiche e capire routine giapponesi comuni.'
    },
    teaches: {
      en: ['Greetings', 'Thanking and apologizing', 'Classroom routines'],
      it: ['Saluti', 'Ringraziare e scusarsi', 'Routine di classe']
    },
    patterns: [
      { jp: 'おはようございます', reading: 'ohayou gozaimasu', en: 'good morning', it: 'buongiorno' },
      { jp: 'ありがとうございます', reading: 'arigatou gozaimasu', en: 'thank you', it: 'grazie' }
    ],
    examples: [
      { jp: 'すみません。', reading: 'sumimasen.', en: 'Excuse me / I am sorry.', it: 'Scusa / mi dispiace.' },
      { jp: 'いただきます。', reading: 'itadakimasu.', en: 'said before eating', it: 'si dice prima di mangiare' }
    ]
  },
  {
    id: 'family-people',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Family and People', it: 'Famiglia e persone' },
    summary: {
      en: 'Stories and character bios often describe family, friends, older and younger siblings.',
      it: 'Storie e biografie dei personaggi descrivono spesso famiglia, amici, fratelli maggiori e minori.'
    },
    teaches: {
      en: ['Family words', 'Friend words', 'Older/younger sibling words'],
      it: ['Parole di famiglia', 'Parole per amici', 'Fratelli maggiori/minori']
    },
    patterns: [
      { jp: '家族・友だち', reading: 'kazoku / tomodachi', en: 'family / friend', it: 'famiglia / amico' },
      { jp: '兄・姉・弟・妹', reading: 'ani / ane / otouto / imouto', en: 'older brother / older sister / younger brother / younger sister', it: 'fratello maggiore / sorella maggiore / fratello minore / sorella minore' }
    ],
    examples: [
      { jp: 'ルイージは弟です。', reading: 'Ruiiji wa otouto desu.', en: 'Luigi is the younger brother.', it: 'Luigi e il fratello minore.' },
      { jp: '友だちと遊びます。', reading: 'tomodachi to asobimasu.', en: 'I play with a friend.', it: 'Gioco con un amico.' }
    ]
  },
  {
    id: 'nature-animals',
    category: 'vocabulary',
    level: 'N5',
    title: { en: 'Nature, Animals and Weather', it: 'Natura, animali e meteo' },
    summary: {
      en: 'First-year reading often uses concrete things: cat, dog, flower, sky, mountain, rain and sun.',
      it: 'La lettura di prima elementare usa spesso cose concrete: gatto, cane, fiore, cielo, montagna, pioggia e sole.'
    },
    teaches: {
      en: ['Animal words', 'Nature words', 'Weather words'],
      it: ['Parole per animali', 'Parole di natura', 'Parole del meteo']
    },
    patterns: [
      { jp: '猫・犬・鳥', reading: 'neko / inu / tori', en: 'cat / dog / bird', it: 'gatto / cane / uccello' },
      { jp: '空・山・川・雨', reading: 'sora / yama / kawa / ame', en: 'sky / mountain / river / rain', it: 'cielo / montagna / fiume / pioggia' }
    ],
    examples: [
      { jp: '小さい猫がいます。', reading: 'chiisai neko ga imasu.', en: 'There is a little cat.', it: "C'e un gattino." },
      { jp: '空に鳥がいます。', reading: 'sora ni tori ga imasu.', en: 'There is a bird in the sky.', it: "C'e un uccello nel cielo." }
    ]
  },
  {
    id: 'wo-and-he',
    category: 'particles',
    level: 'N5',
    bookChapterId: 'verb-particles',
    title: { en: 'The Particles を and へ', it: 'Le particelle を e へ' },
    summary: {
      en: 'を marks the direct object (the thing a verb acts on); it is read "o". へ marks a direction; it is read "e".',
      it: 'を marca l\'oggetto diretto (la cosa su cui agisce il verbo); si legge "o". へ marca una direzione; si legge "e".'
    },
    teaches: {
      en: ['を = direct object (read "o")', 'へ = direction (read "e")', 'Verb comes at the end'],
      it: ['を = oggetto diretto (si legge "o")', 'へ = direzione (si legge "e")', 'Il verbo va alla fine']
    },
    patterns: [
      { jp: 'N を V', reading: 'N o V', en: 'do V to N', it: 'fare V su N' },
      { jp: 'N へ V', reading: 'N e V', en: 'V toward N', it: 'V verso N' }
    ],
    examples: [
      { jp: '魚を食べる。', reading: 'sakana o taberu.', en: 'eat fish', it: 'mangio pesce' },
      { jp: '学校へ行く。', reading: 'gakkou e iku.', en: 'go to school', it: 'vado a scuola' }
    ]
  },
  {
    id: 'ni-place-time',
    category: 'particles',
    level: 'N5',
    bookChapterId: 'verb-particles',
    title: { en: 'に for Target, Place & Time', it: 'に per destinazione, luogo e tempo' },
    summary: {
      en: 'に marks a destination, where something exists, or a point in time. (で is where an action happens; に is where something IS.)',
      it: 'に marca una destinazione, dove esiste qualcosa, o un punto nel tempo. (で è dove avviene un\'azione; に è dove qualcosa È.)'
    },
    teaches: {
      en: ['に = destination / existence / time', 'Contrast with で', 'いる / ある with に'],
      it: ['に = destinazione / esistenza / tempo', 'Contrasto con で', 'いる / ある con に']
    },
    patterns: [
      { jp: 'N に いる', reading: 'N ni iru', en: 'is in/at N', it: 'è in/a N' },
      { jp: '〜時に', reading: '~ ji ni', en: 'at ~ o\'clock', it: 'alle ~' }
    ],
    examples: [
      { jp: '猫は部屋にいる。', reading: 'neko wa heya ni iru.', en: 'The cat is in the room.', it: 'Il gatto è nella stanza.' },
      { jp: '七時に起きる。', reading: 'shichi-ji ni okiru.', en: 'wake up at seven', it: 'mi sveglio alle sette' }
    ]
  },
  {
    id: 'question-ka',
    category: 'grammar',
    level: 'N5',
    title: { en: 'Questions with か', it: 'Domande con か' },
    summary: {
      en: 'The particle か turns a polite sentence into a question.',
      it: 'La particella か trasforma una frase cortese in domanda.'
    },
    teaches: {
      en: ['Question particle か', 'Yes/no questions', 'Simple classroom questions'],
      it: ['Particella interrogativa か', 'Domande si/no', 'Domande semplici da classe']
    },
    patterns: [
      { jp: 'A ですか。', reading: 'A desu ka.', en: 'Is it A?', it: 'E A?' },
      { jp: 'V ますか。', reading: 'V masu ka.', en: 'Do you V?', it: 'Fai V?' }
    ],
    examples: [
      { jp: 'これは本ですか。', reading: 'kore wa hon desu ka.', en: 'Is this a book?', it: 'Questo e un libro?' },
      { jp: '読みますか。', reading: 'yomimasu ka.', en: 'Will you read?', it: 'Leggi?' }
    ]
  },
  {
    id: 'adjectives-first',
    category: 'grammar',
    level: 'N5',
    bookChapterId: 'adjectives',
    title: { en: 'Adjectives (い / な)', it: 'Aggettivi (い / な)' },
    summary: {
      en: 'い-adjectives end in い and attach directly to a noun (no な, never だ). な-adjectives behave like nouns and need な before the noun.',
      it: "Gli aggettivi in い finiscono in い e si attaccano direttamente al nome (niente な, mai だ). Gli aggettivi in な si comportano come nomi e vogliono な prima del nome."
    },
    teaches: {
      en: ['い-adjectives (高い建物)', 'な-adjectives (静かな人)', 'Negative くない / past かった'],
      it: ['Aggettivi in い (高い建物)', 'Aggettivi in な (静かな人)', 'Negativo くない / passato かった']
    },
    patterns: [
      { jp: 'い-adj + 名詞', reading: 'takai biru', en: 'tall building (direct)', it: 'edificio alto (diretto)' },
      { jp: 'な-adj + な + 名詞', reading: 'shizuka na hito', en: 'quiet person', it: 'persona tranquilla' }
    ],
    examples: [
      { jp: '高いビル。', reading: 'takai biru.', en: 'a tall building', it: 'un edificio alto' },
      { jp: '静かな人。', reading: 'shizuka na hito.', en: 'a quiet person', it: 'una persona tranquilla' }
    ]
  },
  {
    id: 'daily-verbs-first',
    category: 'grammar',
    level: 'N5',
    bookChapterId: 'verbs',
    title: { en: 'Verb Basics', it: 'Basi dei verbi' },
    summary: {
      en: 'Almost every verb is a ru-verb or a u-verb (only する and 来る are irregular). The dictionary form is the plain present, and the verb always ends the sentence.',
      it: 'Quasi ogni verbo è ru-verbo o u-verbo (solo する e 来る sono irregolari). La forma del dizionario è il presente semplice, e il verbo è sempre alla fine.'
    },
    teaches: {
      en: ['ru-verbs (食べる)', 'u-verbs (飲む)', 'する / 来る are irregular'],
      it: ['Ru-verbi (食べる)', 'U-verbi (飲む)', 'する / 来る sono irregolari']
    },
    patterns: [
      { jp: 'ru-verb: 食べる', reading: 'taberu', en: 'to eat', it: 'mangiare' },
      { jp: 'u-verb: 飲む', reading: 'nomu', en: 'to drink', it: 'bere' }
    ],
    examples: [
      { jp: '魚を食べる。', reading: 'sakana o taberu.', en: 'eat fish', it: 'mangio pesce' },
      { jp: '水を飲む。', reading: 'mizu o nomu.', en: 'drink water', it: 'bevo acqua' }
    ]
  },
  {
    id: 'punctuation-reading',
    category: 'reading',
    level: 'Start',
    title: { en: 'Punctuation and Reading Aloud', it: 'Punteggiatura e lettura ad alta voce' },
    summary: {
      en: 'Japanese punctuation helps you breathe, pause and read short sentences without panic.',
      it: 'La punteggiatura giapponese aiuta a respirare, fermarsi e leggere frasi brevi senza panico.'
    },
    teaches: {
      en: ['Japanese period 。', 'Japanese comma 、', 'Reading in chunks'],
      it: ['Punto giapponese 。', 'Virgola giapponese 、', 'Leggere a blocchi']
    },
    patterns: [
      { jp: '。', reading: 'maru', en: 'sentence end', it: 'fine frase' },
      { jp: '、', reading: 'ten', en: 'small pause', it: 'piccola pausa' }
    ],
    examples: [
      { jp: '毎日、公園で遊びます。', reading: 'mainichi, kouen de asobimasu.', en: 'Every day, I play in the park.', it: 'Ogni giorno gioco al parco.' },
      { jp: '朝、学校へ行きます。', reading: 'asa, gakkou e ikimasu.', en: 'In the morning, I go to school.', it: 'La mattina vado a scuola.' }
    ]
  },
  {
    id: 'first-diary',
    category: 'reading',
    level: 'N5+',
    title: { en: 'First Diary Sentences', it: 'Prime frasi da diario' },
    summary: {
      en: 'Japanese children practice simple diary writing: today, what happened, how it felt.',
      it: 'I bambini giapponesi praticano semplici diari: oggi, cosa e successo, come ci si e sentiti.'
    },
    teaches: {
      en: ['Today sentences', 'Past feeling words', 'Simple personal writing'],
      it: ['Frasi con oggi', 'Parole di emozione al passato', 'Scrittura personale semplice']
    },
    patterns: [
      { jp: '今日は ... しました。', reading: 'kyou wa ... shimashita.', en: 'Today I did...', it: 'Oggi ho fatto...' },
      { jp: '楽しかったです。', reading: 'tanoshikatta desu.', en: 'It was fun.', it: 'E stato divertente.' }
    ],
    examples: [
      { jp: '今日は公園で遊びました。', reading: 'kyou wa kouen de asobimashita.', en: 'Today I played in the park.', it: 'Oggi ho giocato al parco.' },
      { jp: 'とても楽しかったです。', reading: 'totemo tanoshikatta desu.', en: 'It was very fun.', it: 'E stato molto divertente.' }
    ]
  }
];

// ── Quiz distractor pools — built from REAL example sentences across every
// lesson, so wrong answers are plausible and varied (never a fixed handful, a
// template with A/B/N placeholders, or a meta "this is wrong" option). ──
const ALL_EXAMPLES = LESSONS.flatMap((l) => l.examples);

function dedupeBy<T>(arr: T[], key: (t: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) { const k = key(x); if (k && !seen.has(k)) { seen.add(k); out.push(x); } }
  return out;
}

const MEANING_POOL = dedupeBy(ALL_EXAMPLES.map((e) => ({ en: e.en, it: e.it })), (x) => x.en);
const JP_POOL = [...new Set(ALL_EXAMPLES.map((e) => e.jp))];
const READING_POOL = [...new Set(ALL_EXAMPLES.map((e) => e.reading))];

type Opt = { label: { en: string; it: string }; correct: boolean };

/** Deterministically pick `n` distractor strings, excluding the correct one. */
function pickStrings(pool: string[], correct: string, seed: string, n = 3): string[] {
  return pool.filter((v) => v && v !== correct).sort((a, b) => score(seed, a) - score(seed, b)).slice(0, n);
}
/** Deterministically pick `n` distractor meanings, excluding the correct one. */
function pickMeanings(correct: { en: string; it: string }, seed: string, n = 3) {
  return MEANING_POOL.filter((m) => m.en !== correct.en).sort((a, b) => score(seed, a.en) - score(seed, b.en)).slice(0, n);
}
/** Stable (deterministic) option order so the answer isn't always first. */
function shuffleOpts(opts: Opt[], seed: string): Opt[] {
  return [...opts].sort((a, b) => score(seed + ':o', a.label.en + a.label.it) - score(seed + ':o', b.label.en + b.label.it));
}

// Particle-cloze data: the actual skill a particle lesson should test.
const PARTICLE_QUIZ: Record<string, { particle: string; options: string[]; role: { en: string; it: string } }> = {
  'wa-topic': { particle: 'は', options: ['は', 'が', 'を', 'の'], role: { en: 'は marks the topic — what the sentence is about.', it: 'は marca il tema — di cosa parla la frase.' } },
  'ga-subject': { particle: 'が', options: ['が', 'は', 'の', 'に'], role: { en: 'が marks the subject, or what exists / is noticed.', it: 'が marca il soggetto, o ciò che esiste / si nota.' } },
  'no-possessive': { particle: 'の', options: ['の', 'は', 'が', 'で'], role: { en: 'の links two nouns (possession or description).', it: 'の collega due nomi (possesso o descrizione).' } },
  'kara-from': { particle: 'から', options: ['から', 'まで', 'で', 'に'], role: { en: 'から marks a starting point (from).', it: 'から marca un punto di partenza (da).' } },
  'de-using': { particle: 'で', options: ['で', 'に', 'を', 'へ'], role: { en: 'で marks where an action happens or the means used.', it: "で marca dove avviene l'azione o il mezzo usato." } },
  'wo-and-he': { particle: 'を', options: ['を', 'が', 'に', 'で'], role: { en: 'を marks the direct object of the action.', it: "を marca l'oggetto diretto dell'azione." } },
  'ni-place-time': { particle: 'に', options: ['に', 'で', 'へ', 'を'], role: { en: 'に marks a destination, a time, or where something exists.', it: 'に marca una destinazione, un tempo, o dove esiste qualcosa.' } }
};

function score(seed: string, value: string): number {
  let h = 2166136261;
  const s = `${seed}:${value}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ── Hand-authored Bunpo-style content + quizzes for the core grammar/particle
// lessons (grounded in the Tae Kim Guide). Merged into LESSONS below. ──
type Authored = { content: LessonSection[]; quiz: LessonQuizQuestion[] };

const meaningSection = (en: string, it: string): LessonSection => ({
  title: { en: 'Meaning', it: 'Significato' }, body: { en, it }
});
const formationSection = (en: string, it: string, examples?: LessonSection['examples']): LessonSection => ({
  title: { en: 'How to make it', it: 'Come si forma' }, body: { en, it }, examples
});
const examplesSection = (examples: LessonSection['examples']): LessonSection => ({
  title: { en: 'Examples', it: 'Esempi' },
  body: { en: 'Tap the speaker to hear each sentence.', it: "Tocca l'altoparlante per ascoltare ogni frase." },
  examples
});

const LESSON_AUTHORED: Record<string, Authored> = {
  'desu-identity': {
    content: [
      meaningSection(
        'Japanese has no verb like English "to be". You attach だ (plain) or です (polite) to a noun (or na-adjective) to declare what something is.',
        'Il giapponese non ha un verbo come "essere". Attacchi だ (semplice) o です (cortese) a un nome (o aggettivo in な) per dire cos\'è qualcosa.'
      ),
      formationSection(
        'Noun + だ (plain) / です (polite). Negative: Noun + じゃない. Past: Noun + だった.',
        'Nome + だ (semplice) / です (cortese). Negativo: Nome + じゃない. Passato: Nome + だった.',
        [
          { jp: '学生だ。', reading: 'gakusei da.', en: 'is a student', it: 'è uno studente' },
          { jp: '学生じゃない。', reading: 'gakusei ja nai.', en: 'is not a student', it: 'non è uno studente' },
          { jp: '学生だった。', reading: 'gakusei datta.', en: 'was a student', it: 'era uno studente' }
        ]
      ),
      examplesSection([
        { jp: 'アリスは学生だ。', reading: 'Arisu wa gakusei da.', en: 'Alice is a student.', it: 'Alice è una studentessa.' },
        { jp: '元気だ。', reading: 'genki da.', en: '(I) am well.', it: '(Io) sto bene.' }
      ])
    ],
    quiz: [
      { kind: 'order', prompt: { en: 'Build: "Alice is a student."', it: 'Componi: "Alice è una studentessa."' },
        tokens: ['アリス', 'は', '学生', 'だ'], answer: ['アリス', 'は', '学生', 'だ'],
        reading: 'Arisu wa gakusei da.', translation: { en: 'Alice is a student.', it: 'Alice è una studentessa.' },
        explanation: { en: 'Topic (は) first, then the noun + だ at the end.', it: 'Prima il tema (は), poi il nome + だ alla fine.' } },
      { prompt: { en: 'What is the negative of 学生だ?', it: 'Qual è il negativo di 学生だ?' },
        options: [
          { label: { en: '学生じゃない', it: '学生じゃない' }, correct: true },
          { label: { en: '学生くない', it: '学生くない' }, correct: false },
          { label: { en: '学生ない', it: '学生ない' }, correct: false },
          { label: { en: '学生だった', it: '学生だった' }, correct: false }
        ],
        explanation: { en: 'Nouns take じゃない for the negative (くない is for い-adjectives).', it: 'I nomi usano じゃない al negativo (くない è per gli aggettivi in い).' } },
      { prompt: { en: 'What does 元気だ mean?', it: 'Cosa significa 元気だ?' },
        options: [
          { label: { en: 'is well / energetic', it: 'sta bene / pieno di energia' }, correct: true },
          { label: { en: 'is a student', it: 'è uno studente' }, correct: false },
          { label: { en: 'was not well', it: 'non stava bene' }, correct: false },
          { label: { en: 'is a person', it: 'è una persona' }, correct: false }
        ],
        explanation: { en: '元気 (genki) is a na-adjective meaning healthy/energetic; + だ states it.', it: '元気 (genki) è un aggettivo in な che significa sano/energico; + だ lo afferma.' } }
    ]
  },

  'wa-topic': {
    content: [
      meaningSection(
        'は marks the topic — what the sentence is about. It is written は but pronounced "wa". も replaces は to mean "also".',
        'は marca il tema — di cosa parla la frase. Si scrive は ma si pronuncia "wa". も sostituisce は per dire "anche".'
      ),
      formationSection(
        'Topic + は + (comment). Swap は for も to add "also".',
        'Tema + は + (commento). Sostituisci は con も per aggiungere "anche".',
        [
          { jp: 'アリスは学生。', reading: 'Arisu wa gakusei.', en: 'As for Alice, (she is) a student.', it: 'Quanto ad Alice, è una studentessa.' },
          { jp: 'トムも学生。', reading: 'Tomu mo gakusei.', en: 'Tom is also a student.', it: 'Anche Tom è uno studente.' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Fill the blank:  アリス＿＿学生。  ("As for Alice, a student.")', it: 'Completa:  アリス＿＿学生。' },
        options: [
          { label: { en: 'は', it: 'は' }, correct: true },
          { label: { en: 'が', it: 'が' }, correct: false },
          { label: { en: 'を', it: 'を' }, correct: false },
          { label: { en: 'の', it: 'の' }, correct: false }
        ],
        explanation: { en: 'は marks Alice as the topic.', it: 'は marca Alice come tema.' } },
      { prompt: { en: 'How is the particle は pronounced?', it: 'Come si pronuncia la particella は?' },
        options: [
          { label: { en: 'wa', it: 'wa' }, correct: true },
          { label: { en: 'ha', it: 'ha' }, correct: false },
          { label: { en: 'a', it: 'a' }, correct: false },
          { label: { en: 'ba', it: 'ba' }, correct: false }
        ],
        explanation: { en: 'As a particle, は is read "wa" (even though the kana is "ha").', it: 'Come particella, は si legge "wa" (anche se il kana è "ha").' } },
      { kind: 'order', prompt: { en: 'Build: "Tom is also a student."', it: 'Componi: "Anche Tom è uno studente."' },
        tokens: ['トム', 'も', '学生'], answer: ['トム', 'も', '学生'],
        reading: 'Tomu mo gakusei.', translation: { en: 'Tom is also a student.', it: 'Anche Tom è uno studente.' },
        explanation: { en: 'も replaces は to mean "also".', it: 'も sostituisce は per dire "anche".' } }
    ]
  },

  'ga-subject': {
    content: [
      meaningSection(
        'が singles out which unknown thing is the one in question — it answers "who?" or "what?". は talks about a topic in general; が points to a specific subject.',
        'が indica quale cosa sconosciuta è quella in questione — risponde a "chi?" o "cosa?". は parla di un tema in generale; が indica un soggetto specifico.'
      ),
      formationSection(
        'Question word (誰 / 何) + が … ? → Answer + が … .',
        'Parola interrogativa (誰 / 何) + が … ? → Risposta + が … .',
        [
          { jp: '誰が学生？', reading: 'dare ga gakusei?', en: 'Who is the student?', it: 'Chi è lo studente?' },
          { jp: 'ジョンが学生。', reading: 'Jon ga gakusei.', en: 'John is the one who is a student.', it: 'John è quello che è studente.' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Fill the blank:  誰＿＿学生？  ("Who is the student?")', it: 'Completa:  誰＿＿学生？' },
        options: [
          { label: { en: 'が', it: 'が' }, correct: true },
          { label: { en: 'は', it: 'は' }, correct: false },
          { label: { en: 'を', it: 'を' }, correct: false },
          { label: { en: 'に', it: 'に' }, correct: false }
        ],
        explanation: { en: 'With an unknown subject (誰), use が, not は.', it: 'Con un soggetto sconosciuto (誰), usa が, non は.' } },
      { prompt: { en: 'Which particle singles out a specific subject (answers who/what)?', it: 'Quale particella indica un soggetto specifico (risponde a chi/cosa)?' },
        options: [
          { label: { en: 'が', it: 'が' }, correct: true },
          { label: { en: 'は', it: 'は' }, correct: false },
          { label: { en: 'も', it: 'も' }, correct: false },
          { label: { en: 'の', it: 'の' }, correct: false }
        ],
        explanation: { en: 'は sets a general topic; が identifies the specific one.', it: 'は imposta un tema generale; が identifica quello specifico.' } },
      { kind: 'order', prompt: { en: 'Build: "John is the one who is a student."', it: 'Componi: "John è quello che è studente."' },
        tokens: ['ジョン', 'が', '学生'], answer: ['ジョン', 'が', '学生'],
        reading: 'Jon ga gakusei.', translation: { en: 'John is the one who is a student.', it: 'John è quello che è studente.' },
        explanation: { en: 'が marks John as the identified subject.', it: 'が marca John come soggetto identificato.' } }
    ]
  },

  'no-possessive': {
    content: [
      meaningSection(
        'の connects two nouns to show possession or description ("A\'s B" / "B of A"). It can also stand in for a noun ("the ~ one").',
        'の collega due nomi per indicare possesso o descrizione ("B di A"). Può anche sostituire un nome ("quello ~").'
      ),
      formationSection(
        'A の B  →  "A\'s B". Adjective + の  →  "the ~ one".',
        'A の B  →  "B di A". Aggettivo + の  →  "quello ~".',
        [
          { jp: 'ボブの本', reading: 'Bobu no hon', en: "Bob's book", it: 'il libro di Bob' },
          { jp: '白いの', reading: 'shiroi no', en: 'the white one', it: 'quello bianco' }
        ]
      )
    ],
    quiz: [
      { kind: 'order', prompt: { en: 'Build: "Bob\'s book"', it: 'Componi: "il libro di Bob"' },
        tokens: ['ボブ', 'の', '本'], answer: ['ボブ', 'の', '本'],
        reading: 'Bobu no hon', translation: { en: "Bob's book", it: 'il libro di Bob' },
        explanation: { en: 'Owner + の + thing.', it: 'Proprietario + の + cosa.' } },
      { prompt: { en: 'Fill the blank:  ボブ＿＿本  ("Bob\'s book")', it: 'Completa:  ボブ＿＿本' },
        options: [
          { label: { en: 'の', it: 'の' }, correct: true },
          { label: { en: 'は', it: 'は' }, correct: false },
          { label: { en: 'が', it: 'が' }, correct: false },
          { label: { en: 'で', it: 'で' }, correct: false }
        ],
        explanation: { en: 'の links the two nouns (owner → thing).', it: 'の collega i due nomi (proprietario → cosa).' } },
      { prompt: { en: 'What does 白いのはかわいい mean?', it: 'Cosa significa 白いのはかわいい?' },
        options: [
          { label: { en: 'The white one is cute.', it: 'Quello bianco è carino.' }, correct: true },
          { label: { en: 'White is not cute.', it: 'Il bianco non è carino.' }, correct: false },
          { label: { en: "The cute one's white.", it: 'Il bianco di quello carino.' }, correct: false },
          { label: { en: 'Is the white one cute?', it: 'Quello bianco è carino?' }, correct: false }
        ],
        explanation: { en: 'Here の stands in for a noun: "the white one".', it: 'Qui の sostituisce un nome: "quello bianco".' } }
    ]
  },

  'adjectives-first': {
    content: [
      meaningSection(
        'There are two kinds of adjective. い-adjectives end in い and attach straight to a noun. な-adjectives behave like nouns and need な before the noun.',
        'Ci sono due tipi di aggettivo. Quelli in い finiscono in い e si attaccano direttamente al nome. Quelli in な si comportano come nomi e vogliono な prima del nome.'
      ),
      formationSection(
        'い-adj + 名詞 (direct, no だ). な-adj + な + 名詞. Negative of い-adj: drop い + くない. Past: + かった.',
        'Agg. in い + nome (diretto, niente だ). Agg. in な + な + nome. Negativo (い): togli い + くない. Passato: + かった.',
        [
          { jp: '高いビル', reading: 'takai biru', en: 'a tall building', it: 'un edificio alto' },
          { jp: '静かな人', reading: 'shizuka na hito', en: 'a quiet person', it: 'una persona tranquilla' },
          { jp: '高くない', reading: 'takakunai', en: 'is not tall', it: 'non è alto' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Which is correct for "a quiet person"?', it: 'Qual è corretto per "una persona tranquilla"?' },
        options: [
          { label: { en: '静かな人', it: '静かな人' }, correct: true },
          { label: { en: '静か人', it: '静か人' }, correct: false },
          { label: { en: '静かい人', it: '静かい人' }, correct: false },
          { label: { en: '静かだ人', it: '静かだ人' }, correct: false }
        ],
        explanation: { en: '静か is a な-adjective, so it needs な before the noun.', it: '静か è un aggettivo in な, quindi vuole な prima del nome.' } },
      { prompt: { en: 'The negative of 高い ("tall") is…', it: 'Il negativo di 高い ("alto") è…' },
        options: [
          { label: { en: '高くない', it: '高くない' }, correct: true },
          { label: { en: '高いじゃない', it: '高いじゃない' }, correct: false },
          { label: { en: '高じゃない', it: '高じゃない' }, correct: false },
          { label: { en: '高ない', it: '高ない' }, correct: false }
        ],
        explanation: { en: 'い-adjectives drop い and add くない (never じゃない).', it: 'Gli aggettivi in い tolgono い e aggiungono くない (mai じゃない).' } },
      { kind: 'order', prompt: { en: 'Build: "a quiet person"', it: 'Componi: "una persona tranquilla"' },
        tokens: ['静か', 'な', '人'], answer: ['静か', 'な', '人'],
        reading: 'shizuka na hito', translation: { en: 'a quiet person', it: 'una persona tranquilla' },
        explanation: { en: 'な-adjective + な + noun.', it: 'Aggettivo in な + な + nome.' } }
    ]
  },

  'daily-verbs-first': {
    content: [
      meaningSection(
        'Almost every verb is a ru-verb or a u-verb; only する (to do) and 来る (to come) are irregular. The dictionary form is the plain present, and the verb always ends the sentence.',
        'Quasi ogni verbo è ru-verbo o u-verbo; solo する (fare) e 来る (venire) sono irregolari. La forma del dizionario è il presente semplice, e il verbo è sempre alla fine.'
      ),
      formationSection(
        'ru-verbs end in る (食べる). u-verbs end in an u-sound (飲む, 話す, 買う). A verb alone is a full sentence.',
        'I ru-verbi finiscono in る (食べる). Gli u-verbi finiscono in un suono in u (飲む, 話す, 買う). Un verbo da solo è una frase completa.',
        [
          { jp: '食べる', reading: 'taberu', en: 'to eat (ru-verb)', it: 'mangiare (ru-verbo)' },
          { jp: '飲む', reading: 'nomu', en: 'to drink (u-verb)', it: 'bere (u-verbo)' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Which is a ru-verb?', it: 'Quale è un ru-verbo?' },
        options: [
          { label: { en: '食べる (taberu)', it: '食べる (taberu)' }, correct: true },
          { label: { en: '飲む (nomu)', it: '飲む (nomu)' }, correct: false },
          { label: { en: '話す (hanasu)', it: '話す (hanasu)' }, correct: false },
          { label: { en: '買う (kau)', it: '買う (kau)' }, correct: false }
        ],
        explanation: { en: '食べる ends in る with an e-sound before it → ru-verb.', it: '食べる finisce in る con un suono "e" prima → ru-verbo.' } },
      { prompt: { en: 'Which two verbs are irregular?', it: 'Quali due verbi sono irregolari?' },
        options: [
          { label: { en: 'する and 来る', it: 'する e 来る' }, correct: true },
          { label: { en: '食べる and 飲む', it: '食べる e 飲む' }, correct: false },
          { label: { en: '行く and 買う', it: '行く e 買う' }, correct: false },
          { label: { en: '見る and 話す', it: '見る e 話す' }, correct: false }
        ],
        explanation: { en: 'Only する (to do) and 来る (to come) break the rules.', it: 'Solo する (fare) e 来る (venire) rompono le regole.' } },
      { kind: 'order', prompt: { en: 'Build: "Alice eats fish."', it: 'Componi: "Alice mangia pesce."' },
        tokens: ['アリス', 'は', '魚', 'を', '食べる'], answer: ['アリス', 'は', '魚', 'を', '食べる'],
        reading: 'Arisu wa sakana o taberu.', translation: { en: 'Alice eats fish.', it: 'Alice mangia pesce.' },
        explanation: { en: 'Topic は … object を … verb at the end.', it: 'Tema は … oggetto を … verbo alla fine.' } }
    ]
  },

  'wo-and-he': {
    content: [
      meaningSection(
        'を marks the direct object — the thing a verb acts on; it is read "o". へ marks a direction; it is read "e".',
        'を marca l\'oggetto diretto — la cosa su cui agisce il verbo; si legge "o". へ marca una direzione; si legge "e".'
      ),
      formationSection(
        'Object + を + verb. Place + へ + motion verb.',
        'Oggetto + を + verbo. Luogo + へ + verbo di moto.',
        [
          { jp: '魚を食べる。', reading: 'sakana o taberu.', en: 'eat fish', it: 'mangio pesce' },
          { jp: '学校へ行く。', reading: 'gakkou e iku.', en: 'go to school', it: 'vado a scuola' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Fill the blank:  魚＿＿食べる  ("eat fish")', it: 'Completa:  魚＿＿食べる' },
        options: [
          { label: { en: 'を', it: 'を' }, correct: true },
          { label: { en: 'は', it: 'は' }, correct: false },
          { label: { en: 'に', it: 'に' }, correct: false },
          { label: { en: 'で', it: 'で' }, correct: false }
        ],
        explanation: { en: 'を marks 魚 as the direct object of 食べる.', it: 'を marca 魚 come oggetto diretto di 食べる.' } },
      { prompt: { en: 'The particle を is pronounced…', it: 'La particella を si pronuncia…' },
        options: [
          { label: { en: 'o', it: 'o' }, correct: true },
          { label: { en: 'wo', it: 'wo' }, correct: false },
          { label: { en: 'e', it: 'e' }, correct: false },
          { label: { en: 'ha', it: 'ha' }, correct: false }
        ],
        explanation: { en: 'を is read "o" (only used as the object particle).', it: 'を si legge "o" (usata solo come particella oggetto).' } },
      { kind: 'order', prompt: { en: 'Build: "go to school"', it: 'Componi: "vado a scuola"' },
        tokens: ['学校', 'へ', '行く'], answer: ['学校', 'へ', '行く'],
        reading: 'gakkou e iku.', translation: { en: 'go to school', it: 'vado a scuola' },
        explanation: { en: 'へ marks the direction; it is read "e".', it: 'へ marca la direzione; si legge "e".' } }
    ]
  },

  'ni-place-time': {
    content: [
      meaningSection(
        'に marks a destination, where something exists, or a point in time. (Compare で, which marks where an action happens.)',
        'に marca una destinazione, dove esiste qualcosa, o un punto nel tempo. (Confronta で, che marca dove avviene un\'azione.)'
      ),
      formationSection(
        'Place + に + いる/ある (exists). Time + に + verb.',
        'Luogo + に + いる/ある (esiste). Tempo + に + verbo.',
        [
          { jp: '猫は部屋にいる。', reading: 'neko wa heya ni iru.', en: 'The cat is in the room.', it: 'Il gatto è nella stanza.' },
          { jp: '七時に起きる。', reading: 'shichi-ji ni okiru.', en: 'wake up at seven', it: 'mi sveglio alle sette' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Fill the blank:  七時＿＿起きる  ("wake up at seven")', it: 'Completa:  七時＿＿起きる' },
        options: [
          { label: { en: 'に', it: 'に' }, correct: true },
          { label: { en: 'で', it: 'で' }, correct: false },
          { label: { en: 'を', it: 'を' }, correct: false },
          { label: { en: 'へ', it: 'へ' }, correct: false }
        ],
        explanation: { en: 'に marks the point in time (seven o\'clock).', it: 'に marca il punto nel tempo (le sette).' } },
      { prompt: { en: 'Which particle marks where something EXISTS (with いる/ある)?', it: 'Quale particella marca dove qualcosa ESISTE (con いる/ある)?' },
        options: [
          { label: { en: 'に', it: 'に' }, correct: true },
          { label: { en: 'で', it: 'で' }, correct: false },
          { label: { en: 'を', it: 'を' }, correct: false },
          { label: { en: 'へ', it: 'へ' }, correct: false }
        ],
        explanation: { en: 'に = place of existence; で = place of an action.', it: 'に = luogo di esistenza; で = luogo di un\'azione.' } },
      { kind: 'order', prompt: { en: 'Build: "The cat is in the room."', it: 'Componi: "Il gatto è nella stanza."' },
        tokens: ['猫', 'は', '部屋', 'に', 'いる'], answer: ['猫', 'は', '部屋', 'に', 'いる'],
        reading: 'neko wa heya ni iru.', translation: { en: 'The cat is in the room.', it: 'Il gatto è nella stanza.' },
        explanation: { en: 'Place + に + いる for existence.', it: 'Luogo + に + いる per l\'esistenza.' } }
    ]
  },

  'de-using': {
    content: [
      meaningSection(
        'で marks where an action happens, or the means/tool used to do it. (に is where something IS; で is where something is DONE.)',
        'で marca dove avviene un\'azione, o il mezzo/strumento usato. (に è dove qualcosa È; で è dove qualcosa si FA.)'
      ),
      formationSection(
        'Place + で + action verb. Means + で + verb.',
        'Luogo + で + verbo d\'azione. Mezzo + で + verbo.',
        [
          { jp: '公園で遊ぶ。', reading: 'kouen de asobu.', en: 'play in the park', it: 'gioco al parco' },
          { jp: 'バスで帰る。', reading: 'basu de kaeru.', en: 'go home by bus', it: 'torno a casa in autobus' }
        ]
      )
    ],
    quiz: [
      { prompt: { en: 'Fill the blank:  公園＿＿遊ぶ  ("play in the park")', it: 'Completa:  公園＿＿遊ぶ' },
        options: [
          { label: { en: 'で', it: 'で' }, correct: true },
          { label: { en: 'に', it: 'に' }, correct: false },
          { label: { en: 'を', it: 'を' }, correct: false },
          { label: { en: 'へ', it: 'へ' }, correct: false }
        ],
        explanation: { en: 'で marks the park as where the action (playing) happens.', it: 'で marca il parco come dove avviene l\'azione (giocare).' } },
      { prompt: { en: 'で marks…', it: 'で marca…' },
        options: [
          { label: { en: 'place of an action / the means', it: 'luogo di un\'azione / il mezzo' }, correct: true },
          { label: { en: 'the direct object', it: 'l\'oggetto diretto' }, correct: false },
          { label: { en: 'possession', it: 'il possesso' }, correct: false },
          { label: { en: 'the topic', it: 'il tema' }, correct: false }
        ],
        explanation: { en: 'で = where an action happens, or by what means.', it: 'で = dove avviene un\'azione, o con quale mezzo.' } },
      { kind: 'order', prompt: { en: 'Build: "go home by bus"', it: 'Componi: "torno a casa in autobus"' },
        tokens: ['バス', 'で', '帰る'], answer: ['バス', 'で', '帰る'],
        reading: 'basu de kaeru.', translation: { en: 'go home by bus', it: 'torno a casa in autobus' },
        explanation: { en: 'で marks the bus as the means.', it: 'で marca l\'autobus come mezzo.' } }
    ]
  }
};

// Merge authored content/quizzes into the lesson objects (once, at module load).
for (const lesson of LESSONS) {
  const authored = LESSON_AUTHORED[lesson.id];
  if (authored) {
    lesson.content = authored.content;
    lesson.quiz = authored.quiz;
  }
}

export function lessonSections(lesson: AppLesson): LessonSection[] {
  // Hand-authored Bunpo-style content wins.
  if (lesson.content && lesson.content.length) return lesson.content;
  if (lesson.id === 'kana-names') {
    return [
      {
        title: { en: 'Names Can Be Written in Different Scripts', it: 'I nomi possono essere scritti in scritture diverse' },
        body: {
          en: 'Japanese uses hiragana, katakana and kanji. Names can appear in any of them, so the first job is to notice which script you are looking at.',
          it: 'Il giapponese usa hiragana, katakana e kanji. I nomi possono apparire in ciascuna scrittura, quindi il primo passo e notare che scrittura stai guardando.'
        },
        examples: [
          { jp: 'ひらがな', reading: 'hiragana', en: 'rounded native syllables', it: 'sillabe native tondeggianti' },
          { jp: 'カタカナ', reading: 'katakana', en: 'angular syllables for many names and loanwords', it: 'sillabe angolari per molti nomi e prestiti' }
        ]
      },
      {
        title: { en: 'Foreign and Game Names Often Use Katakana', it: 'Nomi stranieri e di giochi spesso usano katakana' },
        body: {
          en: 'Mario, Luigi and many creature names are written sound by sound in katakana. Read each block aloud. Do not translate the name first: sound it out.',
          it: 'Mario, Luigi e molti nomi di creature sono scritti suono per suono in katakana. Leggi ogni blocco ad alta voce. Non tradurre prima il nome: pronuncialo.'
        },
        examples: lesson.examples,
        note: {
          en: 'Long vowels matter: ルイージ is ruiiji, not ruiji.',
          it: 'Le vocali lunghe contano: ルイージ e ruiiji, non ruiji.'
        }
      },
      {
        title: { en: 'Some Character Names Come From Japanese Words', it: 'Alcuni nomi di personaggi vengono da parole giapponesi' },
        body: {
          en: 'A name can be written in katakana and still be built from Japanese sounds or wordplay. Pikachu is a famous example: it is a name, but it also feels Japanese.',
          it: 'Un nome puo essere scritto in katakana e comunque nascere da suoni o giochi di parole giapponesi. Pikachu e un esempio famoso: e un nome, ma suona anche giapponese.'
        },
        examples: [
          { jp: 'ピカチュウ', reading: 'pikachuu', en: 'a name you should read by sound', it: 'un nome da leggere per suono' }
        ]
      },
      {
        title: { en: 'People Names Often Use Kanji', it: 'I nomi di persone spesso usano kanji' },
        body: {
          en: 'Real people and many anime characters may have kanji names. Kanji names can have special readings, so the app gives you the reading first and asks you to connect it to the romaji.',
          it: 'Persone reali e molti personaggi anime possono avere nomi in kanji. I nomi in kanji possono avere letture speciali, quindi l app ti mostra prima la lettura e ti chiede di collegarla al romaji.'
        },
        note: {
          en: 'Exception mindset: names do not always follow the most common kanji reading. Treat names as their own vocabulary.',
          it: 'Mentalita per le eccezioni: i nomi non seguono sempre la lettura piu comune del kanji. Tratta i nomi come vocaboli propri.'
        }
      }
    ];
  }

  // Minimal, non-filler fallback for lessons without authored content.
  const sections: LessonSection[] = [
    {
      title: { en: 'Meaning', it: 'Significato' },
      body: { en: lesson.summary.en, it: lesson.summary.it },
      examples: lesson.patterns.length ? lesson.patterns : undefined
    }
  ];
  if (lesson.examples.length) {
    sections.push({
      title: { en: 'Examples', it: 'Esempi' },
      body: {
        en: 'Read each sentence aloud, then check the meaning.',
        it: 'Leggi ogni frase ad alta voce, poi controlla il significato.'
      },
      examples: lesson.examples
    });
  }
  return sections;
}

// ── Level path ───────────────────────────────────────────────────────
// Curated teaching order. Lessons appear in the menu in this sequence,
// grouped by level (Start → N5 → N5+ → N4).
export const LESSON_LEVELS = ['Start', 'N5', 'N5+', 'N4'] as const;
export type LessonLevel = (typeof LESSON_LEVELS)[number];

export const LESSON_PATH: string[] = [
  // Start — writing system + first sentence
  'kana-names', 'hiragana-sounds', 'sound-changes', 'katakana-basics', 'desu-identity',
  // N5 — kanji, particles, adjectives, verbs, questions, core vocab
  'first-kanji-map', 'wa-topic', 'ga-subject', 'no-possessive', 'adjectives-first',
  'daily-verbs-first', 'verbs-actions', 'wo-and-he', 'ni-place-time', 'question-ka',
  'numbers-counting', 'calendar-time', 'colors-traits', 'family-people', 'school-classroom',
  'greetings-classroom', 'nature-animals', 'punctuation-reading',
  // N5+ — more particles & reading
  'de-using', 'kara-from', 'reading-short-sentences', 'first-diary'
];

/** Lessons grouped into the level path, in teaching order. */
export function lessonsByLevel(): { level: LessonLevel; lessons: AppLesson[] }[] {
  const ordered = [
    ...LESSON_PATH.map((id) => LESSONS.find((l) => l.id === id)).filter((l): l is AppLesson => !!l),
    // any lesson not listed in the path, appended so nothing is hidden
    ...LESSONS.filter((l) => !LESSON_PATH.includes(l.id))
  ];
  return LESSON_LEVELS
    .map((level) => ({ level, lessons: ordered.filter((l) => l.level === level) }))
    .filter((g) => g.lessons.length > 0);
}

export function lessonQuiz(lesson: AppLesson): LessonQuizQuestion[] {
  if (lesson.quiz && lesson.quiz.length) return lesson.quiz;

  const ex0 = lesson.examples[0];
  if (!ex0) return [];
  const ex1 = lesson.examples[1];
  const questions: LessonQuizQuestion[] = [];

  // 1) Particle cloze — actually tests the skill a particle lesson teaches.
  const pq = PARTICLE_QUIZ[lesson.id];
  if (pq) {
    const ex = lesson.examples.find((e) => e.jp.includes(pq.particle)) ?? ex0;
    const blanked = ex.jp.replace(pq.particle, '＿＿');
    questions.push({
      prompt: {
        en: `Choose the particle:  ${blanked}  ("${ex.en}")`,
        it: `Scegli la particella:  ${blanked}  ("${ex.it}")`
      },
      options: shuffleOpts(
        pq.options.map((p) => ({ label: { en: p, it: p }, correct: p === pq.particle })),
        lesson.id + ':cloze'
      ),
      explanation: {
        en: `${ex.jp} — ${ex.reading}. ${pq.role.en}`,
        it: `${ex.jp} — ${ex.reading}. ${pq.role.it}`
      }
    });
  }

  // 2) Meaning of example 0 (JP → meaning); distractors are other real meanings.
  questions.push({
    prompt: { en: `What does "${ex0.jp}" mean?`, it: `Che cosa significa "${ex0.jp}"?` },
    options: shuffleOpts(
      [
        { label: { en: ex0.en, it: ex0.it }, correct: true },
        ...pickMeanings({ en: ex0.en, it: ex0.it }, lesson.id + ':mean').map((m) => ({ label: m, correct: false }))
      ],
      lesson.id + ':mean'
    ),
    explanation: { en: `${ex0.jp} reads ${ex0.reading} — "${ex0.en}".`, it: `${ex0.jp} si legge ${ex0.reading} — "${ex0.it}".` }
  });

  // 3) Phrase of example 1 (meaning → JP) for breadth; only if a 2nd example exists.
  if (ex1 && ex1.jp !== ex0.jp) {
    questions.push({
      prompt: { en: `Which Japanese means "${ex1.en}"?`, it: `Quale frase giapponese significa "${ex1.it}"?` },
      options: shuffleOpts(
        [
          { label: { en: ex1.jp, it: ex1.jp }, correct: true },
          ...pickStrings(JP_POOL, ex1.jp, lesson.id + ':jp').map((jp) => ({ label: { en: jp, it: jp }, correct: false }))
        ],
        lesson.id + ':jp'
      ),
      explanation: { en: `${ex1.jp} — ${ex1.reading}.`, it: `${ex1.jp} — ${ex1.reading}.` }
    });
  }

  // 4) Reading of example 0 (JP → romaji).
  questions.push({
    prompt: { en: `How do you read "${ex0.jp}"?`, it: `Come si legge "${ex0.jp}"?` },
    options: shuffleOpts(
      [
        { label: { en: ex0.reading, it: ex0.reading }, correct: true },
        ...pickStrings(READING_POOL, ex0.reading, lesson.id + ':read').map((r) => ({ label: { en: r, it: r }, correct: false }))
      ],
      lesson.id + ':read'
    ),
    explanation: { en: `Sound it out: ${ex0.reading}.`, it: `Pronuncia: ${ex0.reading}.` }
  });

  return questions;
}

export async function loadLessonProgress() {
  const row = await db.meta.get(META_KEY);
  lessonProgress.set(Array.isArray(row?.value) ? (row.value as string[]) : []);
}

export async function toggleLessonDone(id: string) {
  const done = get(lessonProgress);
  const next = done.includes(id) ? done.filter((lessonId) => lessonId !== id) : [...done, id];
  lessonProgress.set(next);
  await db.meta.put({ key: META_KEY, value: next });
  void import('./sync').then((m) => m.autoPush());
}

export const markLessonDone = toggleLessonDone;

export async function resetLessonProgress() {
  lessonProgress.set([]);
  await db.meta.put({ key: META_KEY, value: [] });
  void import('./sync').then((m) => m.autoPush());
}

export function isLessonDone(id: string, done: string[]) {
  return done.includes(id);
}

export function lessonsByIds(ids: string[]) {
  return ids.map((id) => LESSONS.find((lesson) => lesson.id === id)).filter((lesson): lesson is AppLesson => !!lesson);
}

export function recommendedLessonsForCharacter(ch: FictionalChar): string[] {
  const recs = ['kana-names', 'katakana-basics', 'sound-changes', 'desu-identity', 'wa-topic', 'no-possessive'];
  const trait = `${ch.trait.en} ${ch.trait.ja}`;
  if (/color|red|blue|yellow|hat|clothes|青|赤|黄|服|帽子/i.test(trait)) recs.push('colors-traits');
  if (/electric|fight|fire|jump|song|sleep|play|戦|火|歌|ジャンプ/i.test(`${ch.fact.en} ${trait}`)) recs.push('verbs-actions', 'de-using');
  return [...new Set(recs)];
}

export function recommendedLessonsForStory(story: Story): string[] {
  const recs = ['hiragana-sounds', 'punctuation-reading', 'desu-identity', 'wa-topic', 'ga-subject', 'no-possessive'];
  if (story.level !== 'N5') recs.push('kara-from', 'de-using', 'reading-short-sentences');
  if (story.lines.some((line) => line.jp.includes('で'))) recs.push('de-using');
  if (story.lines.some((line) => line.jp.includes('から'))) recs.push('kara-from');
  if (story.lines.some((line) => line.jp.includes('を'))) recs.push('wo-and-he');
  if (story.lines.some((line) => line.jp.includes('に'))) recs.push('ni-place-time');
  return [...new Set(recs)];
}

export function missingRecommended(ids: string[], done: string[]) {
  return lessonsByIds(ids.filter((id) => !done.includes(id)));
}
