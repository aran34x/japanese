// Common beginner vocabulary (JLPT N5-ish). `word` is the written form
// (kana or kanji), `reading` is kana, `romaji` for typing answers.
export interface VocabEntry {
  word: string;
  reading: string;
  romaji: string;
  en: string;
  it: string;
  tags?: string[];
}

export const vocab: VocabEntry[] = [
  { word: 'こんにちは', reading: 'こんにちは', romaji: 'konnichiwa', en: 'hello / good afternoon', it: 'ciao / buongiorno', tags: ['greetings'] },
  { word: 'おはよう', reading: 'おはよう', romaji: 'ohayou', en: 'good morning', it: 'buongiorno (mattina)', tags: ['greetings'] },
  { word: 'こんばんは', reading: 'こんばんは', romaji: 'konbanwa', en: 'good evening', it: 'buonasera', tags: ['greetings'] },
  { word: 'ありがとう', reading: 'ありがとう', romaji: 'arigatou', en: 'thank you', it: 'grazie', tags: ['greetings'] },
  { word: 'すみません', reading: 'すみません', romaji: 'sumimasen', en: 'excuse me / sorry', it: 'scusi / mi dispiace', tags: ['greetings'] },
  { word: 'さようなら', reading: 'さようなら', romaji: 'sayounara', en: 'goodbye', it: 'arrivederci', tags: ['greetings'] },
  { word: 'はい', reading: 'はい', romaji: 'hai', en: 'yes', it: 'sì' },
  { word: 'いいえ', reading: 'いいえ', romaji: 'iie', en: 'no', it: 'no' },
  { word: '私', reading: 'わたし', romaji: 'watashi', en: 'I, me', it: 'io' },
  { word: 'あなた', reading: 'あなた', romaji: 'anata', en: 'you', it: 'tu' },
  { word: '名前', reading: 'なまえ', romaji: 'namae', en: 'name', it: 'nome' },
  { word: '水', reading: 'みず', romaji: 'mizu', en: 'water', it: 'acqua' },
  { word: 'お茶', reading: 'おちゃ', romaji: 'ocha', en: 'tea', it: 'tè' },
  { word: 'コーヒー', reading: 'コーヒー', romaji: 'koohii', en: 'coffee', it: 'caffè' },
  { word: 'ご飯', reading: 'ごはん', romaji: 'gohan', en: 'rice / meal', it: 'riso / pasto' },
  { word: '魚', reading: 'さかな', romaji: 'sakana', en: 'fish', it: 'pesce' },
  { word: '肉', reading: 'にく', romaji: 'niku', en: 'meat', it: 'carne' },
  { word: '野菜', reading: 'やさい', romaji: 'yasai', en: 'vegetables', it: 'verdure' },
  { word: '果物', reading: 'くだもの', romaji: 'kudamono', en: 'fruit', it: 'frutta' },
  { word: '猫', reading: 'ねこ', romaji: 'neko', en: 'cat', it: 'gatto' },
  { word: '犬', reading: 'いぬ', romaji: 'inu', en: 'dog', it: 'cane' },
  { word: '家', reading: 'いえ', romaji: 'ie', en: 'house, home', it: 'casa' },
  { word: '学校', reading: 'がっこう', romaji: 'gakkou', en: 'school', it: 'scuola' },
  { word: '先生', reading: 'せんせい', romaji: 'sensei', en: 'teacher', it: 'insegnante' },
  { word: '学生', reading: 'がくせい', romaji: 'gakusei', en: 'student', it: 'studente' },
  { word: '本', reading: 'ほん', romaji: 'hon', en: 'book', it: 'libro' },
  { word: '車', reading: 'くるま', romaji: 'kuruma', en: 'car', it: 'auto' },
  { word: '電車', reading: 'でんしゃ', romaji: 'densha', en: 'train', it: 'treno' },
  { word: '駅', reading: 'えき', romaji: 'eki', en: 'station', it: 'stazione' },
  { word: '町', reading: 'まち', romaji: 'machi', en: 'town', it: 'città' },
  { word: '今日', reading: 'きょう', romaji: 'kyou', en: 'today', it: 'oggi' },
  { word: '明日', reading: 'あした', romaji: 'ashita', en: 'tomorrow', it: 'domani' },
  { word: '昨日', reading: 'きのう', romaji: 'kinou', en: 'yesterday', it: 'ieri' },
  { word: '朝', reading: 'あさ', romaji: 'asa', en: 'morning', it: 'mattina' },
  { word: '夜', reading: 'よる', romaji: 'yoru', en: 'night', it: 'notte' },
  { word: '時間', reading: 'じかん', romaji: 'jikan', en: 'time, hour', it: 'tempo, ora' },
  { word: '大きい', reading: 'おおきい', romaji: 'ookii', en: 'big', it: 'grande' },
  { word: '小さい', reading: 'ちいさい', romaji: 'chiisai', en: 'small', it: 'piccolo' },
  { word: '新しい', reading: 'あたらしい', romaji: 'atarashii', en: 'new', it: 'nuovo' },
  { word: '古い', reading: 'ふるい', romaji: 'furui', en: 'old', it: 'vecchio' },
  { word: '高い', reading: 'たかい', romaji: 'takai', en: 'tall / expensive', it: 'alto / costoso' },
  { word: '安い', reading: 'やすい', romaji: 'yasui', en: 'cheap', it: 'economico' },
  { word: '良い', reading: 'いい', romaji: 'ii', en: 'good', it: 'buono' },
  { word: '悪い', reading: 'わるい', romaji: 'warui', en: 'bad', it: 'cattivo' },
  { word: '暑い', reading: 'あつい', romaji: 'atsui', en: 'hot (weather)', it: 'caldo' },
  { word: '寒い', reading: 'さむい', romaji: 'samui', en: 'cold (weather)', it: 'freddo' },
  { word: '食べる', reading: 'たべる', romaji: 'taberu', en: 'to eat', it: 'mangiare' },
  { word: '飲む', reading: 'のむ', romaji: 'nomu', en: 'to drink', it: 'bere' },
  { word: '行く', reading: 'いく', romaji: 'iku', en: 'to go', it: 'andare' },
  { word: '来る', reading: 'くる', romaji: 'kuru', en: 'to come', it: 'venire' },
  { word: '見る', reading: 'みる', romaji: 'miru', en: 'to see, watch', it: 'vedere, guardare' },
  { word: '聞く', reading: 'きく', romaji: 'kiku', en: 'to listen, ask', it: 'ascoltare, chiedere' },
  { word: '読む', reading: 'よむ', romaji: 'yomu', en: 'to read', it: 'leggere' },
  { word: '書く', reading: 'かく', romaji: 'kaku', en: 'to write', it: 'scrivere' },
  { word: '話す', reading: 'はなす', romaji: 'hanasu', en: 'to speak', it: 'parlare' },
  { word: '買う', reading: 'かう', romaji: 'kau', en: 'to buy', it: 'comprare' },
  { word: 'する', reading: 'する', romaji: 'suru', en: 'to do', it: 'fare' },
  { word: '寝る', reading: 'ねる', romaji: 'neru', en: 'to sleep', it: 'dormire' },
  { word: '起きる', reading: 'おきる', romaji: 'okiru', en: 'to wake up', it: 'svegliarsi' }
];

// Short reading-practice sentences (kana/kanji), with reading + meaning.
export interface ReadingEntry {
  text: string;
  reading: string;
  en: string;
  it: string;
}

export const readings: ReadingEntry[] = [
  { text: 'わたしは がくせいです。', reading: 'わたしは がくせいです。', en: 'I am a student.', it: 'Sono uno studente.' },
  { text: 'これは ほんです。', reading: 'これは ほんです。', en: 'This is a book.', it: 'Questo è un libro.' },
  { text: 'みずを のみます。', reading: 'みずを のみます。', en: 'I drink water.', it: 'Bevo acqua.' },
  { text: 'ねこが すきです。', reading: 'ねこが すきです。', en: 'I like cats.', it: 'Mi piacciono i gatti.' },
  { text: 'きょうは あついです。', reading: 'きょうは あついです。', en: 'It is hot today.', it: 'Oggi fa caldo.' },
  { text: 'がっこうへ いきます。', reading: 'がっこうへ いきます。', en: 'I go to school.', it: 'Vado a scuola.' },
  { text: 'なまえは なんですか。', reading: 'なまえは なんですか。', en: 'What is your name?', it: 'Come ti chiami?' },
  { text: 'コーヒーを ください。', reading: 'コーヒーを ください。', en: 'Coffee, please.', it: 'Un caffè, per favore.' },
  { text: 'でんしゃで いきます。', reading: 'でんしゃで いきます。', en: 'I go by train.', it: 'Vado in treno.' },
  { text: 'ほんを よみます。', reading: 'ほんを よみます。', en: 'I read a book.', it: 'Leggo un libro.' }
];
