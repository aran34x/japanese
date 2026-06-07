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
}

export interface LessonSection {
  title: Record<Lang, string>;
  body: Record<Lang, string>;
  examples?: { jp: string; reading: string; en: string; it: string }[];
  note?: Record<Lang, string>;
}

export interface LessonQuizQuestion {
  prompt: Record<Lang, string>;
  options: { label: Record<Lang, string>; correct: boolean }[];
  explanation: Record<Lang, string>;
}

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
    title: { en: 'Saying What Something Is', it: 'Dire che cosa e qualcosa' },
    summary: {
      en: 'です makes a simple identity sentence: "I am...", "This is...", or "It is...".',
      it: 'です crea una frase semplice di identita: "io sono...", "questo e...", o "e...".'
    },
    teaches: {
      en: ['A は B です', 'Simple character clues', 'Story introductions'],
      it: ['A は B です', 'Indizi semplici sui personaggi', 'Introduzioni nelle storie']
    },
    patterns: [
      { jp: 'A は B です。', reading: 'A wa B desu.', en: 'A is B.', it: 'A e B.' }
    ],
    examples: [
      { jp: 'わたしはねずみです。', reading: 'watashi wa nezumi desu.', en: 'I am a mouse.', it: 'Sono un topo.' },
      { jp: '猫の名前はタマです。', reading: 'neko no namae wa Tama desu.', en: "The cat's name is Tama.", it: 'Il gatto si chiama Tama.' }
    ]
  },
  {
    id: 'wa-topic',
    category: 'particles',
    level: 'N5',
    title: { en: 'The Topic Particle は', it: 'La particella tema は' },
    summary: {
      en: 'は marks the topic: the thing the sentence is talking about. It is written は but read wa.',
      it: 'は marca il tema: la cosa di cui parla la frase. Si scrive は ma si legge wa.'
    },
    teaches: {
      en: ['Topic marking', 'Reading は as wa', 'Character clue sentences'],
      it: ['Marcare il tema', 'Leggere は come wa', 'Frasi-indizio sui personaggi']
    },
    patterns: [
      { jp: 'わたしは...', reading: 'watashi wa...', en: 'As for me...', it: 'Quanto a me...' }
    ],
    examples: [
      { jp: 'わたしは黄色いです。', reading: 'watashi wa kiiroi desu.', en: 'I am yellow.', it: 'Sono giallo.' },
      { jp: 'タマは魚が大好きです。', reading: 'Tama wa sakana ga daisuki desu.', en: 'Tama loves fish.', it: 'Tama adora il pesce.' }
    ]
  },
  {
    id: 'ga-subject',
    category: 'particles',
    level: 'N5',
    title: { en: 'The Subject Particle が', it: 'La particella soggetto が' },
    summary: {
      en: 'が points to the subject or the thing being noticed: "there is...", "X likes Y", or "Y happens".',
      it: 'が indica il soggetto o la cosa notata: "c e...", "a X piace Y", o "succede Y".'
    },
    teaches: {
      en: ['There is/are', 'Likes with が', 'Reading simple story lines'],
      it: ['C e / ci sono', 'Piacere con が', 'Leggere frasi semplici nelle storie']
    },
    patterns: [
      { jp: 'N が います。', reading: 'N ga imasu.', en: 'There is N.', it: "C'e N." }
    ],
    examples: [
      { jp: '小さい猫がいます。', reading: 'chiisai neko ga imasu.', en: 'There is a little cat.', it: "C'e un gattino." },
      { jp: '魚が大好きです。', reading: 'sakana ga daisuki desu.', en: 'I love fish.', it: 'Adoro il pesce.' }
    ]
  },
  {
    id: 'no-possessive',
    category: 'particles',
    level: 'N5',
    title: { en: 'The の Link', it: 'Il collegamento の' },
    summary: {
      en: 'の connects nouns. It can mean possession, description, or "of".',
      it: 'の collega nomi. Puo indicare possesso, descrizione, o "di".'
    },
    teaches: {
      en: ['Names and titles', 'Possession', 'Phrases like cat name or royal family'],
      it: ['Nomi e titoli', 'Possesso', 'Frasi come nome del gatto o famiglia reale']
    },
    patterns: [
      { jp: 'A の B', reading: 'A no B', en: "B of A / A's B", it: 'B di A' }
    ],
    examples: [
      { jp: '猫の名前', reading: 'neko no namae', en: "the cat's name", it: 'il nome del gatto' },
      { jp: 'ゼルダ姫の友だち', reading: 'Zeruda-hime no tomodachi', en: "Princess Zelda's friend", it: "l'amica della Principessa Zelda" }
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
    title: { en: 'で for Using and Place', it: 'で per usare e luogo' },
    summary: {
      en: 'で can mark where something happens or what tool/power is used.',
      it: 'で puo marcare dove succede qualcosa o quale strumento/potere viene usato.'
    },
    teaches: {
      en: ['Using a tool or power', 'Doing something at a place', 'Story and battle clues'],
      it: ['Usare uno strumento o potere', 'Fare qualcosa in un luogo', 'Indizi di storie e battaglie']
    },
    patterns: [
      { jp: 'N で V', reading: 'N de V', en: 'do V with/at N', it: 'fare V con/in N' }
    ],
    examples: [
      { jp: '公園で遊びます。', reading: 'kouen de asobimasu.', en: 'I play in the park.', it: 'Gioco al parco.' },
      { jp: '電気で戦います。', reading: 'denki de tatakaimasu.', en: 'I fight with electricity.', it: "Combatto con l'elettricita." }
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
    title: { en: 'The Particles を and へ', it: 'Le particelle を e へ' },
    summary: {
      en: 'を marks the thing you act on. へ marks a direction. Both are written oddly but read simply.',
      it: 'を marca la cosa su cui fai un azione. へ marca una direzione. Entrambe si scrivono in modo strano ma si leggono semplice.'
    },
    teaches: {
      en: ['を as object marker', 'へ as direction marker', 'Special readings o and e'],
      it: ['を come marcatore oggetto', 'へ come marcatore direzione', 'Letture speciali o ed e']
    },
    patterns: [
      { jp: 'N を V', reading: 'N o V', en: 'do V to N', it: 'fare V su N' },
      { jp: 'N へ行きます', reading: 'N e ikimasu', en: 'go to N', it: 'andare verso N' }
    ],
    examples: [
      { jp: '本を読みます。', reading: 'hon o yomimasu.', en: 'I read a book.', it: 'Leggo un libro.' },
      { jp: '学校へ行きます。', reading: 'gakkou e ikimasu.', en: 'I go to school.', it: 'Vado a scuola.' }
    ]
  },
  {
    id: 'ni-place-time',
    category: 'particles',
    level: 'N5',
    title: { en: 'に for Place and Time', it: 'に per luogo e tempo' },
    summary: {
      en: 'に can mark where something exists, where you go, or when something happens.',
      it: 'に puo marcare dove esiste qualcosa, dove vai, o quando succede qualcosa.'
    },
    teaches: {
      en: ['Existence place', 'Destination', 'Time point'],
      it: ['Luogo di esistenza', 'Destinazione', 'Punto nel tempo']
    },
    patterns: [
      { jp: 'N に います', reading: 'N ni imasu', en: 'is in/at N', it: 'e in/a N' },
      { jp: '七時に', reading: 'shichi-ji ni', en: 'at seven o clock', it: 'alle sette' }
    ],
    examples: [
      { jp: '先生は教室にいます。', reading: 'sensei wa kyoushitsu ni imasu.', en: 'The teacher is in the classroom.', it: "L'insegnante e in classe." },
      { jp: '七時に起きます。', reading: 'shichi-ji ni okimasu.', en: 'I wake up at seven.', it: 'Mi sveglio alle sette.' }
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
    title: { en: 'First Adjectives', it: 'Primi aggettivi' },
    summary: {
      en: 'Adjectives let you describe size, color, feeling and simple traits in stories and clues.',
      it: 'Gli aggettivi ti fanno descrivere dimensione, colore, emozione e tratti semplici in storie e indizi.'
    },
    teaches: {
      en: ['い adjectives', 'Simple descriptions', 'Colors and size'],
      it: ['Aggettivi in い', 'Descrizioni semplici', 'Colori e dimensioni']
    },
    patterns: [
      { jp: '小さい / 大きい', reading: 'chiisai / ookii', en: 'small / big', it: 'piccolo / grande' },
      { jp: '赤い / 青い / 黄色い', reading: 'akai / aoi / kiiroi', en: 'red / blue / yellow', it: 'rosso / blu / giallo' }
    ],
    examples: [
      { jp: '小さい猫です。', reading: 'chiisai neko desu.', en: 'It is a little cat.', it: 'E un gattino.' },
      { jp: 'わたしは黄色いです。', reading: 'watashi wa kiiroi desu.', en: 'I am yellow.', it: 'Sono giallo.' }
    ]
  },
  {
    id: 'daily-verbs-first',
    category: 'grammar',
    level: 'N5',
    title: { en: 'Daily Verbs in ます', it: 'Verbi quotidiani in ます' },
    summary: {
      en: 'First reading uses common action verbs in the polite ます form.',
      it: 'Le prime letture usano verbi comuni nella forma cortese ます.'
    },
    teaches: {
      en: ['Polite verbs', 'Daily actions', 'Reading action sentences'],
      it: ['Verbi cortesi', 'Azioni quotidiane', 'Leggere frasi d azione']
    },
    patterns: [
      { jp: '読みます・書きます・行きます', reading: 'yomimasu / kakimasu / ikimasu', en: 'read / write / go', it: 'leggere / scrivere / andare' },
      { jp: '食べます・寝ます・遊びます', reading: 'tabemasu / nemasu / asobimasu', en: 'eat / sleep / play', it: 'mangiare / dormire / giocare' }
    ],
    examples: [
      { jp: '毎日、書きます。', reading: 'mainichi, kakimasu.', en: 'I write every day.', it: 'Scrivo ogni giorno.' },
      { jp: '公園で遊びます。', reading: 'kouen de asobimasu.', en: 'I play in the park.', it: 'Gioco al parco.' }
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

const wrongTranslations = [
  { en: 'I go from home to school.', it: 'Vado da casa a scuola.' },
  { en: 'I am wearing a red hat.', it: 'Indosso un cappello rosso.' },
  { en: 'There is a little cat.', it: "C'e un gattino." },
  { en: 'I fight using electricity.', it: "Combatto usando l'elettricita." },
  { en: 'The cat loves fish.', it: 'Il gatto adora il pesce.' }
];

function optionsFor(correct: { en: string; it: string }, seed: string) {
  const wrongs = wrongTranslations
    .filter((item) => item.en !== correct.en)
    .sort((a, b) => score(seed, a.en) - score(seed, b.en))
    .slice(0, 3)
    .map((item) => ({ label: item, correct: false }));
  return [{ label: correct, correct: true }, ...wrongs].sort((a, b) => score(seed + ':order', a.label.en) - score(seed + ':order', b.label.en));
}

function score(seed: string, value: string): number {
  let h = 2166136261;
  const s = `${seed}:${value}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function lessonSections(lesson: AppLesson): LessonSection[] {
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

  return [
    {
      title: { en: 'What This Lesson Is For', it: 'A cosa serve questa lezione' },
      body: {
        en: lesson.summary.en,
        it: lesson.summary.it
      }
    },
    {
      title: { en: 'The Core Pattern', it: 'La struttura centrale' },
      body: {
        en: `The main pattern is ${lesson.patterns[0]?.reading ?? 'shown below'}. Read it as a shape first, then swap in new words.`,
        it: `La struttura principale e ${lesson.patterns[0]?.reading ?? 'qui sotto'}. Leggila prima come forma, poi cambia le parole.`
      },
      examples: lesson.patterns
    },
    {
      title: { en: 'How You Will See It in the App', it: 'Come la vedrai nell app' },
      body: {
        en: 'Stories and character clues use short, controlled sentences. When you see this pattern, slow down and find the particle or verb ending before guessing.',
        it: 'Storie e indizi dei personaggi usano frasi brevi e controllate. Quando vedi questa struttura, rallenta e trova la particella o la fine del verbo prima di indovinare.'
      },
      examples: lesson.examples
    },
    {
      title: { en: 'Exceptions and Traps', it: 'Eccezioni e trappole' },
      body: {
        en: 'Japanese often looks small but carries a lot in one particle. If a sentence feels wrong, check the particle first: は, が, の, で and から change the job of the words around them.',
        it: 'Il giapponese sembra spesso piccolo ma una particella porta molto significato. Se una frase sembra strana, controlla prima la particella: は, が, の, で e から cambiano il ruolo delle parole vicine.'
      },
      note: {
        en: 'Do not memorize only translations. Memorize what the pattern does.',
        it: 'Non memorizzare solo traduzioni. Memorizza che cosa fa la struttura.'
      }
    }
  ];
}

export function lessonQuiz(lesson: AppLesson): LessonQuizQuestion[] {
  const firstExample = lesson.examples[0] ?? lesson.patterns[0];
  const secondExample = lesson.examples[1] ?? firstExample;
  const firstPattern = lesson.patterns[0] ?? firstExample;

  return [
    {
      prompt: {
        en: `Which phrase means: "${firstExample.en}"?`,
        it: `Quale frase significa: "${firstExample.it}"?`
      },
      options: [
        { label: { en: firstExample.jp, it: firstExample.jp }, correct: true },
        { label: { en: secondExample.jp, it: secondExample.jp }, correct: false },
        { label: { en: firstPattern.jp, it: firstPattern.jp }, correct: false },
        { label: { en: 'これは違います。', it: 'これは違います。' }, correct: false }
      ].sort((a, b) => score(lesson.id + ':jp', a.label.en) - score(lesson.id + ':jp', b.label.en)),
      explanation: {
        en: `Read the full phrase: ${firstExample.reading}.`,
        it: `Leggi tutta la frase: ${firstExample.reading}.`
      }
    },
    {
      prompt: {
        en: `What does "${firstExample.jp}" mean?`,
        it: `Che cosa significa "${firstExample.jp}"?`
      },
      options: optionsFor({ en: firstExample.en, it: firstExample.it }, lesson.id + ':meaning'),
      explanation: {
        en: 'Match the structure first, then the vocabulary.',
        it: 'Abbina prima la struttura, poi il vocabolario.'
      }
    },
    {
      prompt: {
        en: `Which reading belongs to "${firstPattern.jp}"?`,
        it: `Quale lettura appartiene a "${firstPattern.jp}"?`
      },
      options: [
        { label: { en: firstPattern.reading, it: firstPattern.reading }, correct: true },
        { label: { en: firstExample.reading, it: firstExample.reading }, correct: false },
        { label: { en: secondExample.reading, it: secondExample.reading }, correct: false },
        { label: { en: 'kara desu', it: 'kara desu' }, correct: false }
      ].sort((a, b) => score(lesson.id + ':reading', a.label.en) - score(lesson.id + ':reading', b.label.en)),
      explanation: {
        en: 'Readings are the bridge between Japanese text and what you say aloud.',
        it: 'Le letture sono il ponte tra testo giapponese e cio che pronunci.'
      }
    }
  ];
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
