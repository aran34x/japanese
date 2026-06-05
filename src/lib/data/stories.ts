import type { Lesson } from '../types';

// Simple original children's-style stories for reading comprehension. Each line
// has Japanese + reading + translation; questions test understanding of what was
// read. All original text in graded, beginner-friendly Japanese.
//
// Stories are ordered by increasing difficulty; later ones have more lines and
// more questions, and mix multiple-choice with typing questions.
export interface StoryLine {
  jp: string;
  reading: string;
  en: string;
  it: string;
}

/** A multiple-choice question. */
export interface StoryMcq {
  type: 'mcq';
  q: { en: string; it: string };
  options: { en: string; it: string; correct: boolean }[];
  lesson?: Lesson;
}

/** A typing question — the learner types the answer (e.g. a name). */
export interface StoryType {
  type: 'type';
  q: { en: string; it: string };
  /** Accepted answers (case-insensitive, trimmed). First is the canonical one. */
  answers: string[];
  /** Optional hint shown under the input. */
  hint?: { en: string; it: string };
  lesson?: Lesson;
}

export type StoryQuestion = StoryMcq | StoryType;

export interface Story {
  id: string;
  title: { en: string; it: string };
  /** Japanese title — itself a reading hint, shown above the translation. */
  titleJp: string;
  emoji: string;
  level: 'N5' | 'N5+' | 'N4' | 'N4+';
  lines: StoryLine[];
  questions: StoryQuestion[];
}

// Helper builders to keep the data terse.
const mcq = (
  qen: string,
  qit: string,
  opts: [string, string, boolean][]
): StoryMcq => ({
  type: 'mcq',
  q: { en: qen, it: qit },
  options: opts.map(([en, it, correct]) => ({ en, it, correct }))
});
const type = (
  qen: string,
  qit: string,
  answers: string[],
  hint?: { en: string; it: string }
): StoryType => ({ type: 'type', q: { en: qen, it: qit }, answers, hint });

export const STORIES: Story[] = [
  // ── 1 ─ very easy (N5): 5 lines, 3 questions ──
  {
    id: 'neko',
    title: { en: 'The Little Cat', it: 'Il gattino' },
    titleJp: '小さい猫',
    emoji: '🐱',
    level: 'N5',
    lines: [
      { jp: '小さい猫がいます。', reading: 'ちいさいねこがいます。', en: 'There is a little cat.', it: "C'è un gattino." },
      { jp: '猫の名前はタマです。', reading: 'ねこのなまえはタマです。', en: "The cat's name is Tama.", it: 'Il gatto si chiama Tama.' },
      { jp: 'タマは魚が大好きです。', reading: 'タマはさかながだいすきです。', en: 'Tama loves fish.', it: 'Tama adora il pesce.' },
      { jp: '毎日、公園で遊びます。', reading: 'まいにち、こうえんであそびます。', en: 'Every day it plays in the park.', it: 'Ogni giorno gioca al parco.' },
      { jp: '夜は家で寝ます。', reading: 'よるはいえでねます。', en: 'At night it sleeps at home.', it: 'Di notte dorme a casa.' }
    ],
    questions: [
      type("What is the cat's name? (type it)", 'Come si chiama il gatto? (scrivilo)', ['Tama', 'タマ'], { en: 'It starts with T', it: 'Inizia con T' }),
      mcq('What does Tama love?', 'Cosa adora Tama?', [['Fish', 'Il pesce', true], ['Milk', 'Il latte', false], ['Meat', 'La carne', false]]),
      mcq('Where does Tama play?', 'Dove gioca Tama?', [['In the park', 'Al parco', true], ['At school', 'A scuola', false], ['At the station', 'Alla stazione', false]])
    ]
  },
  // ── 2 ─ easy (N5) ──
  {
    id: 'picnic',
    title: { en: "Taro's Picnic", it: 'Il picnic di Taro' },
    titleJp: '太郎のピクニック',
    emoji: '🍱',
    level: 'N5',
    lines: [
      { jp: '日曜日です。', reading: 'にちようびです。', en: 'It is Sunday.', it: 'È domenica.' },
      { jp: '太郎は山へ行きます。', reading: 'たろうはやまへいきます。', en: 'Taro goes to the mountain.', it: 'Taro va in montagna.' },
      { jp: 'お母さんはお弁当を作りました。', reading: 'おかあさんはおべんとうをつくりました。', en: 'His mother made a lunch box.', it: 'La mamma ha preparato il pranzo al sacco.' },
      { jp: 'お弁当の中におにぎりがあります。', reading: 'おべんとうのなかにおにぎりがあります。', en: 'There are rice balls inside.', it: 'Dentro ci sono polpette di riso.' },
      { jp: '太郎はとても嬉しいです。', reading: 'たろうはとてもうれしいです。', en: 'Taro is very happy.', it: 'Taro è molto felice.' }
    ],
    questions: [
      mcq('What day is it?', 'Che giorno è?', [['Sunday', 'Domenica', true], ['Monday', 'Lunedì', false], ['Saturday', 'Sabato', false]]),
      mcq('Where does Taro go?', 'Dove va Taro?', [['To the mountain', 'In montagna', true], ['To the sea', 'Al mare', false], ['To the city', 'In città', false]]),
      type('What food is in the box? (English)', 'Che cibo c\'è nella scatola? (in inglese)', ['rice balls', 'rice ball', 'onigiri'])
    ]
  },
  // ── 3 ─ easy+ (N5) ──
  {
    id: 'asagohan',
    title: { en: 'Breakfast', it: 'La colazione' },
    titleJp: '朝ご飯',
    emoji: '🍳',
    level: 'N5',
    lines: [
      { jp: '私は朝六時に起きます。', reading: 'わたしはあさろくじにおきます。', en: 'I wake up at six in the morning.', it: 'Mi sveglio alle sei del mattino.' },
      { jp: '顔を洗って、服を着ます。', reading: 'かおをあらって、ふくをきます。', en: 'I wash my face and get dressed.', it: 'Mi lavo la faccia e mi vesto.' },
      { jp: '朝ご飯はパンと卵です。', reading: 'あさごはんはパンとたまごです。', en: 'Breakfast is bread and eggs.', it: 'La colazione è pane e uova.' },
      { jp: '牛乳も飲みます。', reading: 'ぎゅうにゅうものみます。', en: 'I also drink milk.', it: 'Bevo anche il latte.' },
      { jp: 'それから学校へ行きます。', reading: 'それからがっこうへいきます。', en: 'Then I go to school.', it: 'Poi vado a scuola.' }
    ],
    questions: [
      mcq('What time do I wake up?', 'A che ora mi sveglio?', [['6:00', '6:00', true], ['7:00', '7:00', false], ['8:00', '8:00', false]]),
      mcq('What is for breakfast?', "Cosa c'è per colazione?", [['Bread and eggs', 'Pane e uova', true], ['Rice and fish', 'Riso e pesce', false], ['Soup', 'Zuppa', false]]),
      type('What do I drink? (English)', 'Cosa bevo? (in inglese)', ['milk'])
    ]
  },
  // ── 4 ─ easy+ (N5) ──
  {
    id: 'kazoku',
    title: { en: 'My Family', it: 'La mia famiglia' },
    titleJp: '私の家族',
    emoji: '👨‍👩‍👧‍👦',
    level: 'N5',
    lines: [
      { jp: '私は四人家族です。', reading: 'わたしはよにんかぞくです。', en: 'I am a family of four.', it: 'Siamo in quattro in famiglia.' },
      { jp: '父と母と姉と私です。', reading: 'ちちとははとあねとわたしです。', en: 'Father, mother, older sister, and me.', it: 'Mio padre, mia madre, mia sorella maggiore e io.' },
      { jp: '父は医者です。', reading: 'ちちはいしゃです。', en: 'My father is a doctor.', it: 'Mio padre è un medico.' },
      { jp: '母は先生です。', reading: 'はははせんせいです。', en: 'My mother is a teacher.', it: "Mia madre è un'insegnante." },
      { jp: '私たちはとても幸せです。', reading: 'わたしたちはとてもしあわせです。', en: 'We are very happy.', it: 'Siamo molto felici.' }
    ],
    questions: [
      mcq('How many people are in the family?', 'Quante persone ci sono in famiglia?', [['4', '4', true], ['3', '3', false], ['5', '5', false]]),
      mcq("What is the father's job?", 'Che lavoro fa il padre?', [['Doctor', 'Medico', true], ['Teacher', 'Insegnante', false], ['Engineer', 'Ingegnere', false]]),
      type('Who is the teacher? (English)', "Chi è l'insegnante? (in inglese)", ['mother', 'mom', 'the mother'])
    ]
  },
  // ── 5 ─ easy+ (N5) ──
  {
    id: 'heya',
    title: { en: 'My Room', it: 'La mia stanza' },
    titleJp: '私の部屋',
    emoji: '🛌',
    level: 'N5',
    lines: [
      { jp: 'これは私の部屋です。', reading: 'これはわたしのへやです。', en: 'This is my room.', it: 'Questa è la mia stanza.' },
      { jp: 'ベッドと机があります。', reading: 'ベッドとつくえがあります。', en: 'There is a bed and a desk.', it: 'Ci sono un letto e una scrivania.' },
      { jp: 'ベッドの上に猫がいます。', reading: 'ベッドのうえにねこがいます。', en: 'There is a cat on the bed.', it: 'C\'è un gatto sul letto.' },
      { jp: '机の上に本がたくさんあります。', reading: 'つくえのうえにほんがたくさんあります。', en: 'There are many books on the desk.', it: 'Ci sono molti libri sulla scrivania.' },
      { jp: '私の部屋はとてもきれいです。', reading: 'わたしのへやはとてもきれいです。', en: 'My room is very clean.', it: 'La mia stanza è molto pulita.' }
    ],
    questions: [
      mcq('What is on the bed?', "Cosa c'è sul letto?", [['A cat', 'Un gatto', true], ['A dog', 'Un cane', false], ['A book', 'Un libro', false]]),
      mcq('What is on the desk?', "Cosa c'è sulla scrivania?", [['Books', 'Libri', true], ['A computer', 'Un computer', false], ['A lamp', 'Una lampada', false]]),
      type('How is the room? (English)', "Com'è la stanza? (in inglese)", ['clean', 'very clean'])
    ]
  },
  // ── 6 ─ easy+ (N5) ──
  {
    id: 'tenki',
    title: { en: "Today's Weather", it: 'Il tempo di oggi' },
    titleJp: '今日のお天気',
    emoji: '☀️',
    level: 'N5',
    lines: [
      { jp: '今日はお天気がいいです。', reading: 'きょうはおてんきがいいです。', en: 'Today the weather is good.', it: 'Oggi è bel tempo.' },
      { jp: '空がとても青いです。', reading: 'そらがとてもあおいです。', en: 'The sky is very blue.', it: 'Il cielo è molto azzurro.' },
      { jp: '少し暑いです。', reading: 'すこしあついです。', en: 'It is a little hot.', it: 'Fa un po\' caldo.' },
      { jp: '私は冷たい水を飲んでいます。', reading: 'わたしはつめたいみずをのんでいます。', en: 'I am drinking cold water.', it: 'Sto bevendo dell\'acqua fredda.' },
      { jp: '今から公園へ行きます。', reading: 'いまからこうえんへいきます。', en: 'I will go to the park now.', it: 'Ora vado al parco.' }
    ],
    questions: [
      mcq('What color is the sky?', 'Di che colore è il cielo?', [['Blue', 'Azzurro', true], ['White', 'Bianco', false], ['Grey', 'Grigio', false]]),
      mcq('What am I drinking?', 'Cosa sto bevendo?', [['Cold water', 'Acqua fredda', true], ['Hot tea', 'Tè caldo', false], ['Juice', 'Succo', false]]),
      type('Where am I going? (English)', 'Dove sto andando? (in inglese)', ['park', 'to the park', 'the park'])
    ]
  },
  // ── 7 ─ easy+ (N5) ──
  {
    id: 'shumi',
    title: { en: 'My Hobby', it: 'Il mio hobby' },
    titleJp: '私の趣味',
    emoji: '🎹',
    level: 'N5',
    lines: [
      { jp: '私の趣味は音楽です。', reading: 'わたしのしゅみはおんがくです。', en: 'My hobby is music.', it: 'Il mio hobby è la musica.' },
      { jp: '毎日ピアノを弾きます。', reading: 'まいにちピアノをひきます。', en: 'I play the piano every day.', it: 'Suono il pianoforte ogni giorno.' },
      { jp: '姉はギターを弾きます。', reading: 'あねはギターをひきます。', en: 'My sister plays the guitar.', it: 'Mia sorella suona la chitarra.' },
      { jp: '一緒に歌を歌います。', reading: 'いっしょにうたをうたいます。', en: 'We sing songs together.', it: 'Cantiamo insieme.' },
      { jp: 'とても楽しいです。', reading: 'とてもたのしいです。', en: 'It is very fun.', it: 'È molto divertente.' }
    ],
    questions: [
      mcq('What is my hobby?', 'Qual è il mio hobby?', [['Music', 'Musica', true], ['Sports', 'Sport', false], ['Cooking', 'Cucina', false]]),
      mcq('What instrument do I play?', 'Quale strumento suono?', [['Piano', 'Pianoforte', true], ['Guitar', 'Chitarra', false], ['Violin', 'Violino', false]]),
      type('Who plays the guitar? (English)', 'Chi suona la chitarra? (in inglese)', ['sister', 'older sister', 'my sister'])
    ]
  },
  // ── 7.1 ─ N5 ──
  {
    id: 'ringo',
    title: { en: 'The Red Apple', it: 'La mela rossa' },
    titleJp: '赤いりんご',
    emoji: '🍎',
    level: 'N5',
    lines: [
      { jp: 'ここに赤いりんごがあります。', reading: 'ここにあかいりんごがあります。', en: 'There is a red apple here.', it: "Qui c'è una mela rossa." },
      { jp: 'りんごは甘くて美味しいです。', reading: 'りんごはあまくておいしいです。', en: 'The apple is sweet and delicious.', it: 'La mela è dolce e deliziosa.' },
      { jp: '私は毎日りんごを食べます。', reading: 'わたしはまいにちりんごをたべます。', en: 'I eat an apple every day.', it: 'Mangio una mela ogni giorno.' },
      { jp: 'お父さんもりんごが好きです。', reading: 'おとうさんもりんごがすきです。', en: 'My father also likes apples.', it: 'Anche mio padre ama le mele.' },
      { jp: '今日は二個買いました。', reading: 'きょうはにこかいました。', en: 'I bought two today.', it: 'Ne ho comprate due oggi.' }
    ],
    questions: [
      mcq('What color is the apple?', 'Di che colore è la mela?', [['Red', 'Rossa', true], ['Green', 'Verde', false], ['Yellow', 'Gialla', false]]),
      type('How many did I buy today? (English)', 'Quante ne ho comprate oggi? (in inglese)', ['two', '2']),
      mcq('Who also likes apples?', 'A chi piacciono anche le mele?', [['Father', 'Il padre', true], ['Mother', 'La madre', false], ['Sister', 'La sorella', false]])
    ]
  },
  // ── 7.2 ─ N5 ──
  {
    id: 'gakkou',
    title: { en: 'Going to School', it: 'Andare a scuola' },
    titleJp: '学校へ行きます',
    emoji: '🏫',
    level: 'N5',
    lines: [
      { jp: '八時に家を出ます。', reading: 'はちじにいえをでます。', en: 'I leave home at eight.', it: 'Esco di casa alle otto.' },
      { jp: '学校まで歩いて行きます。', reading: 'がっこうまであるいていきます。', en: 'I walk to school.', it: 'Vado a scuola a piedi.' },
      { jp: '道にきれいな花が咲いています。', reading: 'みちにきれいなはながさいています。', en: 'Beautiful flowers are blooming on the road.', it: 'Lungo la strada sbocciano fiori bellissimi.' },
      { jp: '友だちに会いました。', reading: 'ともだちにあいました。', en: 'I met a friend.', it: 'Ho incontrato un amico.' },
      { jp: '「おはよう」と言いました。', reading: '「おはよう」といいました。', en: 'I said "Good morning".', it: 'Ho detto "Buongiorno".' }
    ],
    questions: [
      mcq('What time do I leave?', 'A che ora esco?', [['8:00', '8:00', true], ['7:00', '7:00', false], ['9:00', '9:00', false]]),
      mcq('How do I go to school?', 'Come vado a scuola?', [['Walking', 'A piedi', true], ['By bus', 'In autobus', false], ['By bike', 'In bici', false]]),
      type('What did I say to my friend? (Japanese)', 'Cosa ho detto al mio amico? (in giapponese)', ['ohayou', 'おはよう'])
    ]
  },
  // ── 7.3 ─ N5 ──
  {
    id: 'iro',
    title: { en: 'My Favorite Color', it: 'Il mio colore preferito' },
    titleJp: '好きな色',
    emoji: '🎨',
    level: 'N5',
    lines: [
      { jp: 'いろいろな色があります。', reading: 'いろいろないろがあります。', en: 'There are many colors.', it: 'Ci sono molti colori.' },
      { jp: '私は青色が大好きです。', reading: 'わたしはあおいろがだいすきです。', en: 'I love blue.', it: 'Amo il blu.' },
      { jp: '私の鞄は青いです。', reading: 'わたしのかばんはあおいです。', en: 'My bag is blue.', it: 'La mia borsa è blu.' },
      { jp: '妹はピンクが好きです。', reading: 'いもうとはピンクがすきです。', en: 'My little sister likes pink.', it: 'Mia sorella minore ama il rosa.' },
      { jp: 'ピンクの服を着ています。', reading: 'ピンクのふくをきています。', en: 'She is wearing pink clothes.', it: 'Indossa vestiti rosa.' }
    ],
    questions: [
      mcq('What color do I love?', 'Quale colore amo?', [['Blue', 'Blu', true], ['Red', 'Rosso', false], ['Green', 'Verde', false]]),
      type('What color does my sister like? (English)', 'Che colore piace a mia sorella? (in inglese)', ['pink']),
      mcq('What item of mine is blue?', 'Quale mio oggetto è blu?', [['Bag', 'Borsa', true], ['Shoes', 'Scarpe', false], ['Hat', 'Cappello', false]])
    ]
  },
  // ── 7.4 ─ N5 ──
  {
    id: 'pan',
    title: { en: 'The Bakery', it: 'Il panificio' },
    titleJp: 'パン屋さん',
    emoji: '🥐',
    level: 'N5',
    lines: [
      { jp: 'パン屋さんに来ました。', reading: 'パンやさんにきました。', en: 'I came to the bakery.', it: 'Sono venuto al panificio.' },
      { jp: 'いい匂いがします。', reading: 'いいにおいがします。', en: 'It smells good.', it: "C'è un buon profumo." },
      { jp: 'カレーパンとメロンパンを買いました。', reading: 'カレーパンとメロンパンをかいました。', en: 'I bought curry bread and melon bread.', it: 'Ho comprato un pane al curry e un melon pan.' },
      { jp: '全部で四百円でした。', reading: 'ぜんぶでよんひゃくえんでした。', en: 'It was 400 yen in total.', it: 'In totale erano 400 yen.' },
      { jp: '公園で食べます。', reading: 'こうえんでたべます。', en: 'I will eat them at the park.', it: 'Li mangerò al parco.' }
    ],
    questions: [
      mcq('Where am I?', 'Dove sono?', [['Bakery', 'Al panificio', true], ['Library', 'In biblioteca', false], ['Beach', 'Al mare', false]]),
      type('How much was it total? (Number)', 'Quanto è venuto in totale? (numero)', ['400']),
      mcq('Where will I eat?', 'Dove mangerò?', [['At the park', 'Al parco', true], ['At home', 'A casa', false], ['At school', 'A scuola', false]])
    ]
  },
  // ── 7.5 ─ N5 ──
  {
    id: 'tori',
    title: { en: 'The Little Bird', it: "L'uccellino" },
    titleJp: '小鳥',
    emoji: '🐦',
    level: 'N5',
    lines: [
      { jp: '庭に小鳥が来ました。', reading: 'にわにことりがきました。', en: 'A little bird came to the garden.', it: 'Un uccellino è venuto in giardino.' },
      { jp: '鳥は黄色いです。', reading: 'とりはきいろいです。', en: 'The bird is yellow.', it: "L'uccello è giallo." },
      { jp: '歌を歌っています。', reading: 'うたをうたっています。', en: 'It is singing a song.', it: 'Sta cantando una canzone.' },
      { jp: '私は窓から見ています。', reading: 'わたしはまどからみています。', en: 'I am watching from the window.', it: 'Sto guardando dalla finestra.' },
      { jp: 'とても可愛いです。', reading: 'とてもかわいいです。', en: 'It is very cute.', it: 'È molto carino.' }
    ],
    questions: [
      mcq('What color is the bird?', "Di che colore è l'uccello?", [['Yellow', 'Giallo', true], ['Blue', 'Blu', false], ['Red', 'Rosso', false]]),
      mcq('What is the bird doing?', "Cosa sta facendo l'uccello?", [['Singing', 'Cantando', true], ['Sleeping', 'Dormendo', false], ['Eating', 'Mangiando', false]]),
      type('Where am I watching from? (English)', 'Da dove sto guardando? (in inglese)', ['window', 'the window'])
    ]
  },
  // ── 7.6 ─ N5 ──
  {
    id: 'yasai',
    title: { en: 'Eating Vegetables', it: 'Mangiare verdure' },
    titleJp: '野菜を食べよう',
    emoji: '🥦',
    level: 'N5',
    lines: [
      { jp: 'お母さんは野菜を料理します。', reading: 'おかあさんはやさいをりょうりします。', en: 'Mother cooks vegetables.', it: 'La mamma cucina le verdure.' },
      { jp: '人参と大根があります。', reading: 'にんじんとだいこんがあります。', en: 'There are carrots and radishes.', it: 'Ci sono carote e ravanelli.' },
      { jp: '野菜は体にいいです。', reading: 'やさいはからだにいいです。', en: 'Vegetables are good for the body.', it: 'Le verdure fanno bene al corpo.' },
      { jp: '私はサラダが好きです。', reading: 'わたしはサラダがすきです。', en: 'I like salad.', it: "Mi piace l'insalata." },
      { jp: '残さず食べます。', reading: 'のこさずたべます。', en: 'I eat everything without leaving any.', it: 'Mangio tutto senza lasciare nulla.' }
    ],
    questions: [
      mcq('Who cooks the vegetables?', 'Chi cucina le verdure?', [['Mother', 'La mamma', true], ['Father', 'Il padre', false], ['Me', 'Io', false]]),
      type('What vegetable is mentioned besides radish? (English)', 'Quale verdura è menzionata oltre al ravanello? (in inglese)', ['carrot', 'carrots']),
      mcq('Are vegetables good for you?', 'Le verdure fanno bene?', [['Yes', 'Sì', true], ['No', 'No', false], ['I don\'t know', 'Non lo so', false]])
    ]
  },
  // ── 7.7 ─ N5 ──
  {
    id: 'jitensha',
    title: { en: 'My Bicycle', it: 'La mia bicicletta' },
    titleJp: '私の自転車',
    emoji: '🚲',
    level: 'N5',
    lines: [
      { jp: 'これは私の新しい自転車です。', reading: 'これはわたしのあたらしいじてんしゃです。', en: 'This is my new bicycle.', it: 'Questa è la mia nuova bicicletta.' },
      { jp: '色は白です。', reading: 'いろはしろです。', en: 'The color is white.', it: 'Il colore è bianco.' },
      { jp: '毎日、駅まで行きます。', reading: 'まいにち、えきまでいきます。', en: 'I go to the station every day.', it: 'Ogni giorno vado alla stazione.' },
      { jp: '風がとても気持ちいいです。', reading: 'かぜがとてもきもちいいです。', en: 'The wind feels very good.', it: 'Il vento è molto piacevole.' },
      { jp: '自転車が大好きです。', reading: 'じてんしゃがだいすきです。', en: 'I love my bicycle.', it: 'Amo la mia bicicletta.' }
    ],
    questions: [
      mcq('What color is the bike?', 'Di che colore è la bici?', [['White', 'Bianca', true], ['Black', 'Nera', false], ['Blue', 'Blu', false]]),
      type('Where do I go every day? (English)', 'Dove vado ogni giorno? (in inglese)', ['station', 'to the station']),
      mcq('How does the wind feel?', "Com'è il vento?", [['Good', 'Piacevole', true], ['Cold', 'Freddo', false], ['Bad', 'Sgradevole', false]])
    ]
  },
  // ── 7.8 ─ N5 ──
  {
    id: 'mizu',
    title: { en: 'Water', it: 'Acqua' },
    titleJp: 'お水',
    emoji: '💧',
    level: 'N5',
    lines: [
      { jp: '喉が渇きました。', reading: 'のどがかわきました。', en: 'I am thirsty.', it: 'Ho sete.' },
      { jp: '台所へ行きます。', reading: 'だいどころへいきます。', en: 'I go to the kitchen.', it: 'Vado in cucina.' },
      { jp: '冷たい水を飲みます。', reading: 'つめたいみずをのみます。', en: 'I drink cold water.', it: "Bevo dell'acqua fredda." },
      { jp: 'ああ、美味しい。', reading: 'ああ、おいしい。', en: 'Ah, it tastes good.', it: 'Ah, è buona.' },
      { jp: '元気になりました。', reading: 'げんきになりました。', en: 'I feel better now.', it: 'Ora mi sento meglio.' }
    ],
    questions: [
      mcq('Why did I go to the kitchen?', 'Perché sono andato in cucina?', [['Thirsty', 'Sete', true], ['Hungry', 'Fame', false], ['Tired', 'Stanco', false]]),
      type('What did I drink? (English)', 'Cosa ho bevuto? (in inglese)', ['water', 'cold water']),
      mcq('How was the water?', "Com'era l'acqua?", [['Cold', 'Fredda', true], ['Hot', 'Calda', false], ['Warm', 'Tiepida', false]])
    ]
  },
  // ── 7.9 ─ N5 ──
  {
    id: 'fuku',
    title: { en: 'New Clothes', it: 'Vestiti nuovi' },
    titleJp: '新しい服',
    emoji: '👕',
    level: 'N5',
    lines: [
      { jp: 'デパートへ来ました。', reading: 'デパートへきました。', en: 'I came to the department store.', it: 'Sono venuto al grande magazzino.' },
      { jp: '新しいＴシャツを買いたいです。', reading: 'あたらしいＴシャツをかいたいです。', en: 'I want to buy a new T-shirt.', it: 'Voglio comprare una nuova maglietta.' },
      { jp: 'この白いシャツはいくらですか。', reading: 'このしろいシャツはいくらですか。', en: 'How much is this white shirt?', it: 'Quanto costa questa camicia bianca?' },
      { jp: '二千円です。', reading: 'にせんえんです。', en: 'It is 2000 yen.', it: 'Costa 2000 yen.' },
      { jp: 'これを買います。', reading: 'これをかいます。', en: 'I will buy this.', it: 'Compro questa.' }
    ],
    questions: [
      mcq('What do I want to buy?', 'Cosa voglio comprare?', [['T-shirt', 'Una maglietta', true], ['Pants', 'Pantaloni', false], ['Shoes', 'Scarpe', false]]),
      type('How much is it? (Number)', 'Quanto costa? (numero)', ['2000']),
      mcq('Where am I?', 'Dove sono?', [['Department store', 'Grande magazzino', true], ['Park', 'Parco', false], ['School', 'Scuola', false]])
    ]
  },
  // ── 7.10 ─ N5 ──
  {
    id: 'kagami',
    title: { en: 'The Mirror', it: 'Lo specchio' },
    titleJp: '鏡',
    emoji: '🪞',
    level: 'N5',
    lines: [
      { jp: '部屋に鏡があります。', reading: 'へやにかがみがあります。', en: 'There is a mirror in the room.', it: "C'è uno specchio nella stanza." },
      { jp: '鏡を見ます。', reading: 'かがみをみます。', en: 'I look in the mirror.', it: 'Mi guardo allo specchio.' },
      { jp: '髪をとかします。', reading: 'かみをとかします。', en: 'I comb my hair.', it: 'Mi pettino i capelli.' },
      { jp: '顔を洗います。', reading: 'かおをあらいます。', en: 'I wash my face.', it: 'Mi lavo la faccia.' },
      { jp: '今日も頑張ります。', reading: 'きょうもがんばります。', en: 'I will do my best today too.', it: 'Anche oggi darò il massimo.' }
    ],
    questions: [
      mcq('What is in the room?', "Cosa c'è nella stanza?", [['Mirror', 'Specchio', true], ['Clock', 'Orologio', false], ['TV', 'TV', false]]),
      type('What do I comb? (English)', 'Cosa pettino? (in inglese)', ['hair', 'my hair']),
      mcq('What do I wash?', 'Cosa lavo?', [['Face', 'La faccia', true], ['Hands', 'Le mani', false], ['Clothes', 'I vestiti', false]])
    ]
  },
  // ── 8 ─ N5+ ──
  {
    id: 'tanjoubi',
    title: { en: 'Birthday Party', it: 'Festa di compleanno' },
    titleJp: '誕生日パーティー',
    emoji: '🎂',
    level: 'N5+',
    lines: [
      { jp: '今日は私の誕生日です。', reading: 'きょうはわたしのたんじょうびです。', en: 'Today is my birthday.', it: 'Oggi è il mio compleanno.' },
      { jp: '友だちが家に来ました。', reading: 'ともだちがいえにきました。', en: 'My friends came to my house.', it: 'I miei amici sono venuti a casa mia.' },
      { jp: '大きなケーキを食べました。', reading: 'おおきなケーキをたべました。', en: 'We ate a big cake.', it: 'Abbiamo mangiato una torta grande.' },
      { jp: 'プレゼントをたくさんもらいました。', reading: 'プレゼントをたくさんもらいました。', en: 'I received many presents.', it: 'Ho ricevuto molti regali.' },
      { jp: 'とても嬉しかったです。', reading: 'とてもうれしかったです。', en: 'I was very happy.', it: 'Ero molto felice.' }
    ],
    questions: [
      mcq('What did we eat?', 'Cosa abbiamo mangiato?', [['A big cake', 'Una torta grande', true], ['Pizza', 'Pizza', false], ['Sushi', 'Sushi', false]]),
      mcq('Did I get any presents?', 'Ho ricevuto dei regali?', [['Yes, many', 'Sì, molti', true], ['No, none', 'No, nessuno', false], ['Only one', 'Solo uno', false]]),
      type('How did I feel? (English)', 'Come mi sentivo? (in inglese)', ['happy', 'very happy', 'glad'])
    ]
  },
  // ── 9 ─ N5+ ──
  {
    id: 'toshokan',
    title: { en: 'At the Library', it: 'In biblioteca' },
    titleJp: '図書館で',
    emoji: '📚',
    level: 'N5+',
    lines: [
      { jp: '昨日、図書館へ行きました。', reading: 'きのう、としょかんへいきました。', en: 'Yesterday I went to the library.', it: 'Ieri sono andato in biblioteca.' },
      { jp: '本を三冊借りました。', reading: 'ほんをさんさつかりました。', en: 'I borrowed three books.', it: 'Ho preso in prestito tre libri.' },
      { jp: '図書館で二時間本を読みました。', reading: 'としょかんでにじかんほんをよみました。', en: 'I read books in the library for two hours.', it: 'Ho letto dei libri in biblioteca per due ore.' },
      { jp: 'とても静かでした。', reading: 'とてもしずかでした。', en: 'It was very quiet.', it: 'Era molto tranquillo.' },
      { jp: '私は図書館が好きです。', reading: 'わたしはとしょかんがすきです。', en: 'I like the library.', it: 'Mi piace la biblioteca.' }
    ],
    questions: [
      mcq('How many books did I borrow?', 'Quanti libri ho preso in prestito?', [['3', '3', true], ['2', '2', false], ['5', '5', false]]),
      mcq('How long was I there?', 'Per quanto tempo sono rimasto?', [['2 hours', '2 ore', true], ['1 hour', '1 ora', false], ['30 minutes', '30 minuti', false]]),
      type('Was it noisy? (English)', 'C\'era rumore? (in inglese)', ['no', 'it was quiet', 'quiet'])
    ]
  },
  // ── 10 ─ N5+ ──
  {
    id: 'umi',
    title: { en: 'Trip to the Sea', it: 'Viaggio al mare' },
    titleJp: '海の旅行',
    emoji: '🏖️',
    level: 'N5+',
    lines: [
      { jp: '夏に海へ行きました。', reading: 'なつにうみへいきました。', en: 'In summer, I went to the sea.', it: 'In estate sono andato al mare.' },
      { jp: '海はとても青くてきれいでした。', reading: 'うみはとてもあおくてきれいでした。', en: 'The sea was very blue and beautiful.', it: 'Il mare era molto azzurro e bello.' },
      { jp: '弟と一緒に泳ぎました。', reading: 'おとうとといっしょにおよぎました。', en: 'I swam with my younger brother.', it: 'Ho nuotato con mio fratello minore.' },
      { jp: '魚をたくさん見ました。', reading: 'さかなをたくさんみました。', en: 'We saw many fish.', it: 'Abbiamo visto molti pesci.' },
      { jp: 'アイスクリームも食べました。', reading: 'アイスクリームもたべました。', en: 'We also ate ice cream.', it: 'Abbiamo anche mangiato il gelato.' }
    ],
    questions: [
      mcq('When did I go?', 'Quando ci sono andato?', [['In summer', 'In estate', true], ['In winter', 'In inverno', false], ['In spring', 'In primavera', false]]),
      mcq('Who did I swim with?', 'Con chi ho nuotato?', [['Younger brother', 'Fratello minore', true], ['Sister', 'Sorella', false], ['Friend', 'Amico', false]]),
      type('What did we eat? (English)', 'Cosa abbiamo mangiato? (in inglese)', ['ice cream'])
    ]
  },
  // ── 11 ─ N5+ ──
  {
    id: 'hamusutaa',
    title: { en: 'My Hamster', it: 'Il mio criceto' },
    titleJp: '私のハムスター',
    emoji: '🐹',
    level: 'N5+',
    lines: [
      { jp: '私はハムスターを飼っています。', reading: 'わたしはハムスターをかっています。', en: 'I have a hamster.', it: 'Ho un criceto.' },
      { jp: '名前はチョコです。', reading: 'なまえはチョコです。', en: 'Its name is Choco.', it: 'Si chiama Choco.' },
      { jp: 'チョコは小さくて茶色いです。', reading: 'チョコはちいさくてちゃいろいです。', en: 'Choco is small and brown.', it: 'Choco è piccolo e marrone.' },
      { jp: 'ひまわりの種を食べます。', reading: 'ひまわりのたねをたべます。', en: 'It eats sunflower seeds.', it: 'Mangia semi di girasole.' },
      { jp: '夜、走ります。', reading: 'よる、はしります。', en: 'It runs at night.', it: 'Corre di notte.' }
    ],
    questions: [
      type('What is its name? (type it)', 'Come si chiama? (scrivilo)', ['Choco', 'チョコ']),
      mcq('What color is Choco?', 'Di che colore è Choco?', [['Brown', 'Marrone', true], ['White', 'Bianco', false], ['Black', 'Nero', false]]),
      mcq('When does it run?', 'Quando corre?', [['At night', 'Di notte', true], ['In the morning', 'Di mattina', false], ['At noon', 'A mezzogiorno', false]])
    ]
  },
  // ── 12 ─ N5+ ──
  {
    id: 'kaimono',
    title: { en: 'Shopping', it: 'La spesa' },
    titleJp: '買い物',
    emoji: '🛒',
    level: 'N5+',
    lines: [
      { jp: 'スーパーへ行きました。', reading: 'スーパーへいきました。', en: 'I went to the supermarket.', it: 'Sono andato al supermercato.' },
      { jp: 'りんごとバナナを買いました。', reading: 'りんごとバナナをかいました。', en: 'I bought apples and bananas.', it: 'Ho comprato mele e banane.' },
      { jp: '牛乳も買いました。', reading: 'ぎゅうにゅうもかいました。', en: 'I also bought milk.', it: 'Ho comprato anche il latte.' },
      { jp: 'りんごは五百円でした。', reading: 'りんごはごひゃくえんでした。', en: 'The apples were 500 yen.', it: 'Le mele costavano 500 yen.' },
      { jp: '家に帰って、ジュースを作りました。', reading: 'いえにかえって、ジュースをつくりました。', en: 'I went home and made juice.', it: 'Sono tornato a casa e ho fatto il succo.' }
    ],
    questions: [
      mcq('What fruits did I buy?', 'Che frutta ho comprato?', [['Apples and bananas', 'Mele e banane', true], ['Oranges', 'Arance', false], ['Grapes', 'Uva', false]]),
      mcq('How much were the apples?', 'Quanto costavano le mele?', [['500 yen', '500 yen', true], ['100 yen', '100 yen', false], ['1000 yen', '1000 yen', false]]),
      type('What did I make? (English)', 'Cosa ho fatto? (in inglese)', ['juice', 'apple juice'])
    ]
  },
  // ── 13 ─ N5+ ──
  {
    id: 'koen',
    title: { en: 'In the Park', it: 'Al parco' },
    titleJp: '公園で',
    emoji: '🌳',
    level: 'N5+',
    lines: [
      { jp: '家の近くに広い公園があります。', reading: 'いえのちかくにひろいこうえんがあります。', en: 'There is a big park near my house.', it: 'C\'è un grande parco vicino a casa mia.' },
      { jp: '花や木がたくさんあります。', reading: 'はなやきがたくさんあります。', en: 'There are many flowers and trees.', it: 'Ci sono molti fiori e alberi.' },
      { jp: '子供たちがたくさん遊んでいます。', reading: 'こどもたちがたくさんあそんでいます。', en: 'Many children are playing.', it: 'Molti bambini stanno giocando.' },
      { jp: '私はベンチで本を読んでいます。', reading: 'わたしはベンチでほんをよんでいます。', en: 'I am reading a book on the bench.', it: 'Sto leggendo un libro sulla panchina.' },
      { jp: 'とても静かです。', reading: 'とてもしずかです。', en: 'It is very peaceful.', it: 'È molto tranquillo.' }
    ],
    questions: [
      mcq('Where is the park?', 'Dov\'è il parco?', [['Near my house', 'Vicino a casa mia', true], ['Near the station', 'Vicino alla stazione', false], ['In the city', 'In città', false]]),
      mcq('What am I doing?', 'Cosa sto facendo?', [['Reading a book', 'Leggendo un libro', true], ['Playing', 'Giocando', false], ['Sleeping', 'Dormendo', false]]),
      type('Who is playing? (English)', 'Chi sta giocando? (in inglese)', ['children', 'kids', 'many children'])
    ]
  },
  // ── 14 ─ N5+ ──
  {
    id: 'inu',
    title: { en: 'The Lost Dog', it: 'Il cane smarrito' },
    titleJp: '迷子の犬',
    emoji: '🐶',
    level: 'N5+',
    lines: [
      { jp: '公園で小さい犬を見つけました。', reading: 'こうえんでちいさいいぬをみつけました。', en: 'I found a small dog in the park.', it: 'Ho trovato un cagnolino al parco.' },
      { jp: '犬は元気がありませんでした。', reading: 'いぬはげんきがありませんでした。', en: 'The dog had no energy.', it: 'Il cane era senza forze.' },
      { jp: '首輪に「ポチ」と書いてありました。', reading: 'くびわに「ポチ」とかいてありました。', en: 'On the collar it said "Pochi".', it: 'Sul collare c\'era scritto "Pochi".' },
      { jp: '私はポチに水をあげました。', reading: 'わたしはポチにみずをあげました。', en: 'I gave Pochi some water.', it: 'Ho dato a Pochi un po\' d\'acqua.' },
      { jp: '夕方、飼い主が来ました。', reading: 'ゆうがた、かいぬしがきました。', en: 'In the evening, the owner came.', it: 'Verso sera è arrivato il padrone.' },
      { jp: '飼い主はとても感謝しました。', reading: 'かいぬしはとてもかんしゃしました。', en: 'The owner was very grateful.', it: 'Il padrone era molto grato.' }
    ],
    questions: [
      type("What is the dog's name? (type it)", 'Come si chiama il cane? (scrivilo)', ['Pochi', 'ポチ'], { en: 'On the collar', it: 'Sul collare' }),
      mcq('Where was the dog found?', 'Dove è stato trovato il cane?', [['In the park', 'Al parco', true], ['At home', 'A casa', false], ['At school', 'A scuola', false]]),
      mcq('What did I give the dog?', 'Cosa ho dato al cane?', [['Water', "Dell'acqua", true], ['Food', 'Del cibo', false], ['A toy', 'Un giocattolo', false]]),
      mcq('When did the owner come?', 'Quando è arrivato il padrone?', [['In the evening', 'Di sera', true], ['In the morning', 'Di mattina', false], ['At noon', 'A mezzogiorno', false]])
    ]
  },
  // ── 15 ─ N5+ ──
  {
    id: 'matsuri',
    title: { en: 'The Summer Festival', it: 'La festa estiva' },
    titleJp: '夏祭り',
    emoji: '🎆',
    level: 'N5+',
    lines: [
      { jp: '今日は夏祭りです。', reading: 'きょうはなつまつりです。', en: 'Today is the summer festival.', it: 'Oggi è la festa estiva.' },
      { jp: 'ゆう子は浴衣を着ています。', reading: 'ゆうこはゆかたをきています。', en: 'Yuko is wearing a yukata.', it: 'Yuko indossa uno yukata.' },
      { jp: '屋台でたこ焼きを買いました。', reading: 'やたいでたこやきをかいました。', en: 'She bought takoyaki at a stall.', it: 'Ha comprato takoyaki a una bancarella.' },
      { jp: '友だちと金魚すくいをしました。', reading: 'ともだちときんぎょすくいをしました。', en: 'She played goldfish scooping with friends.', it: 'Ha giocato a pesca i pesci rossi con gli amici.' },
      { jp: '夜は花火を見ました。', reading: 'よるははなびをみました。', en: 'At night they watched fireworks.', it: 'La sera hanno visto i fuochi d\'artificio.' },
      { jp: '花火はとてもきれいでした。', reading: 'はなびはとてもきれいでした。', en: 'The fireworks were very beautiful.', it: 'I fuochi erano bellissimi.' }
    ],
    questions: [
      type("What is the girl's name? (type it)", 'Come si chiama la ragazza? (scrivilo)', ['Yuko', 'ゆう子', 'ゆうこ']),
      mcq('What is Yuko wearing?', 'Cosa indossa Yuko?', [['A yukata', 'Uno yukata', true], ['A kimono', 'Un kimono', false], ['A dress', 'Un vestito', false]]),
      mcq('What did she buy?', 'Cosa ha comprato?', [['Takoyaki', 'Takoyaki', true], ['Ramen', 'Ramen', false], ['Sushi', 'Sushi', false]]),
      mcq('What did they watch at night?', 'Cosa hanno visto la sera?', [['Fireworks', 'I fuochi d\'artificio', true], ['A movie', 'Un film', false], ['A parade', 'Una parata', false]])
    ]
  },
  // ── 15.1 ─ N5+ ──
  {
    id: 'doubutsuen',
    title: { en: 'At the Zoo', it: 'Allo zoo' },
    titleJp: '動物園で',
    emoji: '🐘',
    level: 'N5+',
    lines: [
      { jp: '今日、家族と動物園へ行きました。', reading: 'きょう、かぞくとどうぶつえんへいきました。', en: 'Today, I went to the zoo with my family.', it: 'Oggi sono andato allo zoo con la mia famiglia.' },
      { jp: 'たくさんの動物がいました。', reading: 'たくさんのどうぶつがいました。', en: 'There were many animals.', it: "C'erano molti animali." },
      { jp: 'ゾウはとても大きかったです。', reading: 'ゾウはとてもおおきかったです。', en: 'The elephant was very big.', it: "L'elefante era molto grande." },
      { jp: 'キリンは首が長いです。', reading: 'キリンはくびがながいです。', en: 'The giraffe has a long neck.', it: 'La giraffa ha il collo lungo.' },
      { jp: '私はパンダが一番好きです。', reading: 'わたしはパンダがいちばんすきです。', en: 'I like pandas the best.', it: 'I panda mi piacciono più di tutti.' },
      { jp: 'とても楽しかったです。', reading: 'とてもたのしかったです。', en: 'It was very fun.', it: 'È stato molto divertente.' }
    ],
    questions: [
      mcq('Who did I go with?', 'Con chi sono andato?', [['Family', 'Famiglia', true], ['Friends', 'Amici', false], ['Teacher', 'Insegnante', false]]),
      type('Which animal was very big? (English)', 'Quale animale era molto grande? (in inglese)', ['elephant']),
      mcq('Which animal do I like best?', 'Quale animale mi piace di più?', [['Panda', 'Panda', true], ['Lion', 'Leone', false], ['Monkey', 'Scimmia', false]]),
      type('How is the giraffe\'s neck? (English)', 'Com\'è il collo della giraffa? (in inglese)', ['long'])
    ]
  },
  // ── 15.2 ─ N5+ ──
  {
    id: 'kudamono',
    title: { en: 'Fruit Market', it: 'Mercato della frutta' },
    titleJp: '果物市場',
    emoji: '🍓',
    level: 'N5+',
    lines: [
      { jp: '近所の市場へ行きました。', reading: 'きんじょのいちばへいきました。', en: 'I went to a nearby market.', it: 'Sono andato a un mercato vicino.' },
      { jp: '新鮮な果物がたくさんあります。', reading: 'しんせんなくだものがたくさんあります。', en: 'There are many fresh fruits.', it: "C'è molta frutta fresca." },
      { jp: 'いちごは赤くて甘いです。', reading: 'いちごはあかくてあまいいです。', en: 'The strawberries are red and sweet.', it: 'Le fragole sono rosse e dolci.' },
      { jp: 'みかんを十個買いました。', reading: 'みかんをじゅっこかいました。', en: 'I bought ten mandarin oranges.', it: 'Ho comprato dieci mandarini.' },
      { jp: '店の人と話をしました。', reading: 'みせのひととはなしをしました。', en: 'I talked with the shopkeeper.', it: 'Ho parlato con il negoziante.' }
    ],
    questions: [
      mcq('What did I buy?', 'Cosa ho comprato?', [['Mandarin oranges', 'Mandarini', true], ['Apples', 'Mele', false], ['Grapes', 'Uva', false]]),
      type('How many did I buy? (Number)', 'Quanti ne ho comprati? (numero)', ['10', 'ten']),
      mcq('How are the strawberries?', 'Come sono le fragole?', [['Red and sweet', 'Rosse e dolci', true], ['Green and sour', 'Verdi e aspre', false], ['Small and hard', 'Piccole e dure', false]])
    ]
  },
  // ── 15.3 ─ N5+ ──
  {
    id: 'supootsu',
    title: { en: 'Playing Sports', it: 'Fare sport' },
    titleJp: 'スポーツをしよう',
    emoji: '⚽',
    level: 'N5+',
    lines: [
      { jp: '私はスポーツが好きです。', reading: 'わたしはスポーツがすきです。', en: 'I like sports.', it: 'Mi piace lo sport.' },
      { jp: '土曜日に友だちとサッカーをします。', reading: 'どようびにともだちとサッカーをします。', en: 'I play soccer with friends on Saturdays.', it: 'Il sabato gioco a calcio con gli amici.' },
      { jp: '昨日はテニスをしました。', reading: 'きのうはテニスをしました。', en: 'Yesterday I played tennis.', it: 'Ieri ho giocato a tennis.' },
      { jp: '少し疲れましたが、楽しかったです。', reading: 'すこしつかれましたが、たのしかったです。', en: 'I got a little tired, but it was fun.', it: "Mi sono stancato un po', ma è stato divertente." },
      { jp: 'もっと上手になりたいです。', reading: 'もっとじょうずになりたいです。', en: 'I want to get better.', it: 'Voglio diventare più bravo.' }
    ],
    questions: [
      mcq('What do I play on Saturdays?', 'A cosa gioco il sabato?', [['Soccer', 'Calcio', true], ['Baseball', 'Baseball', false], ['Basketball', 'Basket', false]]),
      type('What did I play yesterday? (English)', 'A cosa ho giocato ieri? (in inglese)', ['tennis']),
      mcq('How did I feel?', 'Come mi sentivo?', [['Tired but happy', 'Stanco ma felice', true], ['Angry', 'Arrabbiato', false], ['Bored', 'Annoiato', false]])
    ]
  },
  // ── 15.4 ─ N5+ ──
  {
    id: 'eiga',
    title: { en: 'The Movie', it: 'Il film' },
    titleJp: '映画を見に行こう',
    emoji: '🎬',
    level: 'N5+',
    lines: [
      { jp: '今夜、映画を見に行きます。', reading: 'こんや、えいがをみにいきます。', en: 'I am going to see a movie tonight.', it: 'Stasera vado a vedere un film.' },
      { jp: '新しいアニメの映画です。', reading: 'あたらしいアニメのえいがです。', en: 'It is a new anime movie.', it: "È un nuovo film d'animazione." },
      { jp: 'ポップコーンを食べながら見ます。', reading: 'ポップコーンをたべながらみます。', en: 'I will watch it while eating popcorn.', it: 'Lo guarderò mangiando i popcorn.' },
      { jp: 'チケットは千円でした。', reading: 'チケットはせんえんでした。', en: 'The ticket was 1000 yen.', it: 'Il biglietto costava 1000 yen.' },
      { jp: 'とても楽しみです。', reading: 'とてもたのしみです。', en: 'I am looking forward to it.', it: "Non vedo l'ora." }
    ],
    questions: [
      mcq('What kind of movie is it?', 'Che tipo di film è?', [['Anime', 'Anime', true], ['Horror', 'Horror', false], ['Comedy', 'Commedia', false]]),
      type('How much was the ticket? (Number)', 'Quanto costava il biglietto? (numero)', ['1000']),
      mcq('What will I eat?', 'Cosa mangerò?', [['Popcorn', 'Popcorn', true], ['Candy', 'Caramelle', false], ['Hot dog', 'Hot dog', false]])
    ]
  },
  // ── 15.5 ─ N5+ ──
  {
    id: 'denwa',
    title: { en: 'A Phone Call', it: 'Una telefonata' },
    titleJp: '電話',
    emoji: '📞',
    level: 'N5+',
    lines: [
      { jp: 'プルルル、電話が鳴りました。', reading: 'プルルル、でんわがなりました。', en: 'Ring ring, the phone rang.', it: 'Rin rin, il telefono ha suonato.' },
      { jp: 'おばあちゃんからの電話でした。', reading: 'おばあちゃんからのでんわでした。', en: 'It was a call from grandma.', it: 'Era una telefonata della nonna.' },
      { jp: '「来週、遊びに来てね」と言いました。', reading: '「らいしゅう、あそびにきてね」といいました。', en: 'She said "Please come visit next week".', it: 'Ha detto "Vieni a trovarmi la prossima settimana".' },
      { jp: '私は「はい、行きます」と答えました。', reading: 'わたしは「はい、いきます」とこたえました。', en: 'I answered "Yes, I will go".', it: 'Ho risposto "Sì, verrò".' },
      { jp: 'おばあちゃんの声を聞いて、嬉しかったです。', reading: 'おばあちゃんのこえをきいて、うれしかったです。', en: 'I was happy to hear grandma\'s voice.', it: 'Ero felice di sentire la voce della nonna.' }
    ],
    questions: [
      mcq('Who called?', 'Chi ha chiamato?', [['Grandma', 'La nonna', true], ['Grandpa', 'Il nonno', false], ['Friend', 'Un amico', false]]),
      type('When should I visit? (English)', 'Quando dovrei andare a trovarla? (in inglese)', ['next week']),
      mcq('How did I feel?', 'Come mi sentivo?', [['Happy', 'Felice', true], ['Sad', 'Triste', false], ['Surprised', 'Sorpreso', false]])
    ]
  },
  // ── 15.6 ─ N5+ ──
  {
    id: 'niwa',
    title: { en: 'The Garden', it: 'Il giardino' },
    titleJp: '庭の仕事',
    emoji: '🌻',
    level: 'N5+',
    lines: [
      { jp: '休みの日に、庭で仕事をしました。', reading: 'やすみのひに、にわでしごとをしました。', en: 'On my day off, I worked in the garden.', it: 'Nel mio giorno libero ho lavorato in giardino.' },
      { jp: '花に水をあげました。', reading: 'はなにはなをあげました。', en: 'I gave water to the flowers.', it: "Ho dato l'acqua ai fiori." },
      { jp: '草を引きました。', reading: 'くさをひきました。', en: 'I pulled the weeds.', it: "Ho strappato l'erba." },
      { jp: 'ひまわりが大きく咲いています。', reading: 'ひまわりがおおきくさいています。', en: 'Sunflowers are blooming big.', it: 'I girasoli sono in piena fioritura.' },
      { jp: '庭がきれいになって、良かったです。', reading: 'にわがきれいになって、よかったです。', en: 'I\'m glad the garden became beautiful.', it: 'Sono contento che il giardino sia diventato bello.' }
    ],
    questions: [
      mcq('What did I do in the garden?', 'Cosa ho fatto in giardino?', [['Watered flowers', "Dato l'acqua ai fiori", true], ['Slept', 'Dormito', false], ['Played soccer', 'Giocato a calcio', false]]),
      type('Which flower is mentioned? (English)', 'Quale fiore è menzionato? (in inglese)', ['sunflower', 'sunflowers']),
      mcq('How is the garden now?', "Com'è il giardino adesso?", [['Beautiful', 'Bello', true], ['Dirty', 'Sporco', false], ['Small', 'Piccolo', false]])
    ]
  },
  // ── 15.7 ─ N5+ ──
  {
    id: 'kasa',
    title: { en: 'The Yellow Umbrella', it: "L'ombrello giallo" },
    titleJp: '黄色い傘',
    emoji: '💛',
    level: 'N5+',
    lines: [
      { jp: '外は雨が降っています。', reading: 'そとはあめがふっています。', en: 'It is raining outside.', it: 'Fuori piove.' },
      { jp: '私はお気に入りの黄色い傘を持っています。', reading: 'わたしはおきにいりのきいろいかさをもっています。', en: 'I have my favorite yellow umbrella.', it: 'Ho il mio ombrello giallo preferito.' },
      { jp: '長靴も履いています。', reading: 'ながぐつもはいています。', en: 'I am also wearing rain boots.', it: 'Indosso anche gli stivali da pioggia.' },
      { jp: '水たまりで遊びました。', reading: 'みずたまりであそびました。', en: 'I played in a puddle.', it: 'Ho giocato in una pozzanghera.' },
      { jp: '服が濡れましたが、楽しかったです。', reading: 'ふくがぬれましたが、たのしかったです。', en: 'My clothes got wet, but it was fun.', it: 'I vestiti si sono bagnati, ma è stato divertente.' }
    ],
    questions: [
      mcq('What color is the umbrella?', "Di che colore è l'ombrello?", [['Yellow', 'Giallo', true], ['Blue', 'Blu', false], ['Red', 'Rosso', false]]),
      type('What am I wearing besides the umbrella? (English)', 'Cosa indosso oltre all\'ombrello? (in inglese)', ['boots', 'rain boots']),
      mcq('What got wet?', 'Cosa si è bagnato?', [['Clothes', 'I vestiti', true], ['Shoes', 'Le scarpe', false], ['The bag', 'La borsa', false]])
    ]
  },
  // ── 15.8 ─ N5+ ──
  {
    id: 'ehon',
    title: { en: 'Picture Book', it: 'Libro illustrato' },
    titleJp: '絵本',
    emoji: '📖',
    level: 'N5+',
    lines: [
      { jp: '寝る前に、絵本を読みます。', reading: 'ねるまえに、えほんをよみます。', en: 'Before sleeping, I read a picture book.', it: 'Prima di dormire leggo un libro illustrato.' },
      { jp: '絵がとてもきれいです。', reading: 'えがとてもきれいです。', en: 'The pictures are very beautiful.', it: 'Le figure sono molto belle.' },
      { jp: 'お母さんが読んでくれることもあります。', reading: 'おかあさんがよんでくれることもあります。', en: 'Sometimes my mother reads it to me.', it: 'A volte me lo legge la mamma.' },
      { jp: 'お話はとても面白いです。', reading: 'おはなしはとてもおもしろいです。', en: 'The story is very interesting.', it: 'La storia è molto interessante.' },
      { jp: 'すぐ眠くなりました。', reading: 'すぐねむくなりました。', en: 'I became sleepy soon.', it: 'Mi è venuto sonno subito.' }
    ],
    questions: [
      mcq('When do I read the book?', 'Quando leggo il libro?', [['Before sleeping', 'Prima di dormire', true], ['In the morning', 'Di mattina', false], ['At school', 'A scuola', false]]),
      type('Who sometimes reads to me? (English)', 'Chi me lo legge a volte? (in inglese)', ['mother', 'mom']),
      mcq('How are the pictures?', 'Come sono le figure?', [['Beautiful', 'Belle', true], ['Bad', 'Brutte', false], ['Small', 'Piccole', false]])
    ]
  },
  // ── 15.9 ─ N5+ ──
  {
    id: 'suizokukan',
    title: { en: 'Aquarium', it: 'Acquario' },
    titleJp: '水族館',
    emoji: '🐬',
    level: 'N5+',
    lines: [
      { jp: '日曜日に、水族館へ行きました。', reading: 'にちようびに、すいぞくかんへいきました。', en: 'On Sunday, I went to the aquarium.', it: 'Domenica sono andato all\'acquario.' },
      { jp: '大きな水槽に魚がいっぱいいます。', reading: 'おおきなすいそうにさかながいっぱいいます。', en: 'There are many fish in a large tank.', it: 'Ci sono molti pesci in una grande vasca.' },
      { jp: 'イルカのショーを見ました。', reading: 'イルカのショーをみました。', en: 'I watched a dolphin show.', it: 'Ho visto lo spettacolo dei delfini.' },
      { jp: 'イルカは高く跳びました。', reading: 'イルカはたかくとびました。', en: 'The dolphin jumped high.', it: 'Il delfino ha saltato in alto.' },
      { jp: 'ペンギンも歩いていて、可愛かったです。', reading: 'ペンギンもあるいていて、かわいかったです。', en: 'The penguins were walking and they were cute.', it: 'I pinguini camminavano ed erano carini.' }
    ],
    questions: [
      mcq('What show did I watch?', 'Quale spettacolo ho visto?', [['Dolphin', 'Delfini', true], ['Seal', 'Foche', false], ['Whale', 'Balene', false]]),
      type('What other animal was walking? (English)', 'Quale altro animale camminava? (in inglese)', ['penguin', 'penguins']),
      mcq('How was the tank?', "Com'era la vasca?", [['Large', 'Grande', true], ['Small', 'Piccola', false], ['Empty', 'Vuota', false]])
    ]
  },
  // ── 15.10 ─ N5+ ──
  {
    id: 'shukudai',
    title: { en: 'Homework', it: 'I compiti' },
    titleJp: '宿題',
    emoji: '📝',
    level: 'N5+',
    lines: [
      { jp: '学校から帰りました。', reading: 'がっこうからかえりました。', en: 'I came home from school.', it: 'Sono tornato da scuola.' },
      { jp: '今日は宿題がたくさんあります。', reading: 'きょうはしゅくだいがたくさんあります。', en: 'I have a lot of homework today.', it: 'Oggi ho molti compiti.' },
      { jp: '算数と国語の宿題です。', reading: 'さんすうとこくごのしゅくだいです。', en: 'They are math and Japanese homework.', it: 'Sono compiti di matematica e lingua giapponese.' },
      { jp: '一時間で終わりました。', reading: 'いちじかんでおわりました。', en: 'I finished in one hour.', it: "Ho finito in un'ora." },
      { jp: 'それからテレビを見ました。', reading: 'それからテレビをみました。', en: 'After that, I watched TV.', it: 'Dopo ho guardato la TV.' }
    ],
    questions: [
      mcq('What subjects were the homework?', 'Di che materie erano i compiti?', [['Math and Japanese', 'Matematica e giapponese', true], ['English', 'Inglese', false], ['Science', 'Scienze', false]]),
      type('How long did it take? (English)', 'Quanto tempo ci è voluto? (in inglese)', ['one hour', '1 hour']),
      mcq('What did I do after homework?', 'Cosa ho fatto dopo i compiti?', [['Watched TV', 'Guardato la TV', true], ['Slept', 'Dormito', false], ['Played outside', 'Giocato fuori', false]])
    ]
  },
  // ── 15.11 ─ N5+ ──
  {
    id: 'kakekko',
    title: { en: 'The Race', it: 'La gara' },
    titleJp: 'かけっこ',
    emoji: '🏃',
    level: 'N5+',
    lines: [
      { jp: '今日は運動会です。', reading: 'きょうはうんどうかいです。', en: 'Today is the sports day.', it: 'Oggi è la giornata dello sport.' },
      { jp: '私はかけっこに出ました。', reading: 'わたしはかけっこにでました。', en: 'I participated in a race.', it: 'Ho partecipato a una gara di corsa.' },
      { jp: '一生懸命走りました。', reading: 'いっしょうけんめいはしりました。', en: 'I ran as hard as I could.', it: 'Ho corso più forte che potevo.' },
      { jp: '二位になりました。', reading: 'にいになりました。', en: 'I came in second place.', it: 'Sono arrivato secondo.' },
      { jp: '少し悔しかったですが、楽しかったです。', reading: 'すこしくやしかったですが、たのしかったです。', en: 'I was a bit disappointed, but it was fun.', it: "Ero un po' deluso, ma è stato divertente." }
    ],
    questions: [
      mcq('What day is it?', 'Che giorno è?', [['Sports day', 'Giornata dello sport', true], ['Birthday', 'Compleanno', false], ['Holiday', 'Vacanza', false]]),
      type('What place did I get? (English)', 'In che posizione sono arrivato? (in inglese)', ['second', '2nd']),
      mcq('How did I run?', 'Come ho corso?', [['Hard', 'Forte', true], ['Slowly', 'Lentamente', false], ['With a friend', 'Con un amico', false]])
    ]
  },
  // ── 15.12 ─ N5+ ──
  {
    id: 'hoshi',
    title: { en: 'Stars', it: 'Le stelle' },
    titleJp: '星空',
    emoji: '⭐',
    level: 'N5+',
    lines: [
      { jp: '夜、空を見ました。', reading: 'よる、そらをみました。', en: 'I looked at the sky at night.', it: 'Di notte ho guardato il cielo.' },
      { jp: '星がたくさん見えました。', reading: 'ほしがたくさんみえました。', en: 'I could see many stars.', it: 'Si vedevano molte stelle.' },
      { jp: 'とてもキラキラしていました。', reading: 'とてもキラキラしていました。', en: 'They were sparkling a lot.', it: 'Brillavano tantissimo.' },
      { jp: 'お父さんが星の名前を教えてくれました。', reading: 'おとうさんがほしのなまえをおしえてくれました。', en: 'My father taught me the names of the stars.', it: 'Mio padre mi ha insegnato i nomi delle stelle.' },
      { jp: '宇宙は広いなと思いました。', reading: 'うちゅうはひろいなとおもいました。', en: 'I thought the universe is vast.', it: "Ho pensato che l'universo è vasto." }
    ],
    questions: [
      mcq('When did I look at the sky?', 'Quando ho guardato il cielo?', [['At night', 'Di notte', true], ['In the morning', 'Di mattina', false], ['At noon', 'A mezzogiorno', false]]),
      type('Who taught me the star names? (English)', 'Chi mi ha insegnato i nomi delle stelle? (in inglese)', ['father', 'dad']),
      mcq('How were the stars?', 'Come erano le stelle?', [['Sparkling', 'Brillanti', true], ['Red', 'Rosse', false], ['Cloudy', 'Nuvolose', false]])
    ]
  },
  // ── 15.13 ─ N5+ ──
  {
    id: 'basu',
    title: { en: 'The Bus', it: "L'autobus" },
    titleJp: 'バスに乗る',
    emoji: '🚌',
    level: 'N5+',
    lines: [
      { jp: '今日はバスでおばあちゃんの家へ行きます。', reading: 'きょうはバスでおばあちゃんのいえへいきます。', en: 'Today I go to grandma\'s house by bus.', it: 'Oggi vado a casa della nonna in autobus.' },
      { jp: 'バス停でバスを待ちます。', reading: 'バスていでバスをまちます。', en: 'I wait for the bus at the bus stop.', it: "Aspetto l'autobus alla fermata." },
      { jp: '青いバスが来ました。', reading: 'あおいバスがきました。', en: 'A blue bus came.', it: 'È arrivato un autobus blu.' },
      { jp: '窓から景色を見ました。', reading: 'まどからけしきをみました。', en: 'I looked at the scenery from the window.', it: 'Ho guardato il paesaggio dal finestrino.' },
      { jp: '三十分で着きました。', reading: 'さんじゅっぷんでつきました。', en: 'I arrived in thirty minutes.', it: 'Sono arrivato in trenta minuti.' }
    ],
    questions: [
      mcq('Where am I going?', 'Dove sto andando?', [['Grandma\'s house', 'Casa della nonna', true], ['School', 'Scuola', false], ['Market', 'Mercato', false]]),
      type('What color was the bus? (English)', 'Di che colore era l\'autobus? (in inglese)', ['blue']),
      mcq('How long did it take?', 'Quanto tempo ci è voluto?', [['30 minutes', '30 minuti', true], ['10 minutes', '10 minuti', false], ['1 hour', '1 ora', false]])
    ]
  },
  // ── 15.14 ─ N5+ ──
  {
    id: 'camera',
    title: { en: 'The Camera', it: 'La fotocamera' },
    titleJp: 'カメラ',
    emoji: '📷',
    level: 'N5+',
    lines: [
      { jp: '誕生日にカメラをもらいました。', reading: 'たんじょうびにカメラをもらいました。', en: 'I received a camera for my birthday.', it: 'Ho ricevuto una fotocamera per il mio compleanno.' },
      { jp: '写真を撮るのが大好きです。', reading: 'しゃしんをとるのがだいすきです。', en: 'I love taking photos.', it: 'Amo scattare foto.' },
      { jp: '公園で花の写真を撮りました。', reading: 'こうえんではなのしゃしんをとりました。', en: 'I took photos of flowers in the park.', it: 'Ho scattato foto ai fiori nel parco.' },
      { jp: '犬のポチも撮りました。', reading: 'いぬのポチもとりました。', en: 'I also took a photo of my dog Pochi.', it: 'Ho fotografato anche il mio cane Pochi.' },
      { jp: 'もっとたくさん撮りたいです。', reading: 'もっとたくさんとりたいです。', en: 'I want to take many more.', it: 'Voglio scattarne molte altre.' }
    ],
    questions: [
      mcq('When did I get the camera?', 'Quando ho ricevuto la fotocamera?', [['Birthday', 'Compleanno', true], ['Christmas', 'Natale', false], ['New Year', 'Capodanno', false]]),
      type('What is the dog\'s name? (type it)', 'Come si chiama il cane? (scrivilo)', ['Pochi', 'ポチ']),
      mcq('What did I take photos of in the park?', 'A cosa ho fatto le photo al parco?', [['Flowers', 'Fiori', true], ['People', 'Persone', false], ['Cars', 'Auto', false]])
    ]
  },
  // ── 15.15 ─ N5+ ──
  {
    id: 'hikoki',
    title: { en: 'The Airplane', it: "L'aereo" },
    titleJp: '飛行機',
    emoji: '✈️',
    level: 'N5+',
    lines: [
      { jp: '空に大きな飛行機が飛んでいます。', reading: 'そらにおおきなひこうきがとんでいます。', en: 'A big airplane is flying in the sky.', it: 'Un grande aereo vola nel cielo.' },
      { jp: '私はいつか飛行機に乗りたいです。', reading: 'わたしはいつかひこうきにのりたいです。', en: 'I want to ride an airplane someday.', it: 'Voglio salire su un aereo un giorno.' },
      { jp: '遠くの国へ行きたいです。', reading: 'とおくのくにへいきたいです。', en: 'I want to go to a far country.', it: 'Voglio andare in un paese lontano.' },
      { jp: '海の上を飛びます。', reading: 'うみのうえをとびます。', en: 'It flies over the sea.', it: 'Vola sopra il mare.' },
      { jp: '飛行機はかっこいいです。', reading: 'ひこうきはかっこいいです。', en: 'Airplanes are cool.', it: 'Gli aerei sono fighi.' }
    ],
    questions: [
      mcq('Where is the airplane flying?', 'Dove vola l\'aereo?', [['In the sky', 'Nel cielo', true], ['On the ground', 'A terra', false], ['In the water', 'In acqua', false]]),
      type('Where do I want to go? (English phrase)', 'Dove voglio andare? (frase in inglese)', ['far country', 'to a far country']),
      mcq('What does it fly over?', 'Sopra cosa vola?', [['The sea', 'Il mare', true], ['The mountains', 'Le montagne', false], ['The forest', 'La foresta', false]])
    ]
  },
  // ── 15.16 ─ N5+ ──
  {
    id: 'mori',
    title: { en: 'The Forest', it: 'La foresta' },
    titleJp: '森の中',
    emoji: '🌲',
    level: 'N5+',
    lines: [
      { jp: '森へ散歩に行きました。', reading: 'もりへさんぽにいきました。', en: 'I went for a walk in the forest.', it: 'Sono andato a fare una passeggiata nella foresta.' },
      { jp: '木がたくさんあって、涼しいです。', reading: 'きがたくさんあって、すずしいです。', en: 'There are many trees and it is cool.', it: 'Ci sono molti alberi e fa fresco.' },
      { jp: '鳥の声が聞こえます。', reading: 'とりのこえがきこえます。', en: 'I can hear birds\' voices.', it: 'Sento le voci degli uccelli.' },
      { jp: 'どんぐりを拾いました。', reading: 'どんぐりをひろいました。', en: 'I picked up acorns.', it: 'Ho raccolto delle ghiande.' },
      { jp: '森は空気がきれいです。', reading: 'もりはくうきがれいです。', en: 'The air is clean in the forest.', it: "L'aria è pulita nella foresta." }
    ],
    questions: [
      mcq('How is the temperature in the forest?', 'Com\'è la temperatura nella foresta?', [['Cool', 'Fresco', true], ['Hot', 'Caldo', false], ['Humid', 'Umido', false]]),
      type('What did I pick up? (English)', 'Cosa ho raccolto? (in inglese)', ['acorns', 'acorn']),
      mcq('What can I hear?', 'Cosa sento?', [['Birds', 'Uccelli', true], ['Cars', 'Auto', false], ['Music', 'Musica', false]])
    ]
  },
  // ── 15.17 ─ N5+ ──
  {
    id: 'yuki',
    title: { en: 'Snow', it: 'Neve' },
    titleJp: '雪の日',
    emoji: '❄️',
    level: 'N5+',
    lines: [
      { jp: '今朝、窓の外を見ました。', reading: 'けさ、まどのそとをみました。', en: 'I looked out the window this morning.', it: 'Stamattina ho guardato fuori dalla finestra.' },
      { jp: '雪が降っていました。', reading: 'ゆきがふっていました。', en: 'It was snowing.', it: 'Stava nevicando.' },
      { jp: '外は真っ白です。', reading: 'そとはまっしろです。', en: 'Outside is all white.', it: 'Fuori è tutto bianco.' },
      { jp: '雪だるまを作りました。', reading: 'ゆきだるまをつくりました。', en: 'I made a snowman.', it: 'Ho fatto un pupazzo di neve.' },
      { jp: '寒かったですが、楽しかったです。', reading: 'さむかったですが、たのしかったです。', en: 'It was cold, but it was fun.', it: 'Faceva freddo, ma è stato divertente.' }
    ],
    questions: [
      mcq('What was the weather?', "Com'era il tempo?", [['Snowing', 'Nevicava', true], ['Raining', 'Pioveva', false], ['Sunny', 'Soleggiato', false]]),
      type('What did I make? (English)', 'Cosa ho fatto? (in inglese)', ['snowman']),
      mcq('How was the outside?', "Com'era fuori?", [['All white', 'Tutto bianco', true], ['Dirty', 'Sporco', false], ['Green', 'Verde', false]])
    ]
  },
  // ── 16 ─ N4 ──
  {
    id: 'ame',
    title: { en: 'A Rainy Day', it: 'Un giorno di pioggia' },
    titleJp: '雨の日',
    emoji: '☔',
    level: 'N4',
    lines: [
      { jp: '今朝から雨が降っています。', reading: 'けさからあめがふっています。', en: 'It has been raining since this morning.', it: 'Piove da stamattina.' },
      { jp: '花子は傘を持って学校へ行きました。', reading: 'はなこはかさをもってがっこうへいきました。', en: 'Hanako took an umbrella and went to school.', it: "Hanako ha preso l'ombrello ed è andata a scuola." },
      { jp: 'でも、友だちは傘を忘れました。', reading: 'でも、ともだちはかさをわすれました。', en: 'But her friend forgot an umbrella.', it: "Ma la sua amica ha dimenticato l'ombrello." },
      { jp: '花子は友だちと一緒に傘を使いました。', reading: 'はなこはともだちといっしょにかさをつかいました。', en: 'Hanako shared the umbrella.', it: "Hanako ha condiviso l'ombrello." },
      { jp: '二人は笑いながら帰りました。', reading: 'ふたりはわらいながらかえりました。', en: 'The two went home laughing.', it: 'Le due sono tornate a casa ridendo.' }
    ],
    questions: [
      type("What is the girl's name? (type it)", 'Come si chiama la ragazza? (scrivilo)', ['Hanako', '花子', 'はなこ']),
      mcq('What is the weather like?', "Com'è il tempo?", [['Rainy', 'Piovoso', true], ['Sunny', 'Soleggiato', false], ['Snowy', 'Nevoso', false]]),
      mcq('What did the friend forget?', "Cosa ha dimenticato l'amica?", [['An umbrella', 'Un ombrello', true], ['A bag', 'La borsa', false], ['Lunch', 'Il pranzo', false]]),
      mcq('How did they go home?', 'Come sono tornate a casa?', [['Laughing together', 'Ridendo insieme', true], ['Crying', 'Piangendo', false], ['Separately', 'Separate', false]])
    ]
  },
  // ── 7 ─ N4 ──
  {
    id: 'densha',
    title: { en: 'The Wrong Train', it: 'Il treno sbagliato' },
    titleJp: '間違えた電車',
    emoji: '🚃',
    level: 'N4',
    lines: [
      { jp: '健は急いで駅に着きました。', reading: 'けんはいそいでえきにつきました。', en: 'Ken arrived at the station in a hurry.', it: 'Ken è arrivato in stazione di fretta.' },
      { jp: '電車にすぐ乗りました。', reading: 'でんしゃにすぐのりました。', en: 'He got on a train right away.', it: 'È salito subito su un treno.' },
      { jp: 'でも、反対方向の電車でした。', reading: 'でも、はんたいほうこうのでんしゃでした。', en: 'But it was going the opposite way.', it: 'Ma andava nella direzione opposta.' },
      { jp: '次の駅で降りました。', reading: 'つぎのえきでおりました。', en: 'He got off at the next station.', it: 'È sceso alla stazione successiva.' },
      { jp: '正しい電車に乗り換えました。', reading: 'ただしいでんしゃにのりかえました。', en: 'He transferred to the right train.', it: 'Ha cambiato treno con quello giusto.' },
      { jp: '会社に少し遅れました。', reading: 'かいしゃにすこしおくれました。', en: 'He was a little late to work.', it: 'È arrivato un po\' tardi al lavoro.' }
    ],
    questions: [
      type("What is the man's name? (type it)", "Come si chiama l'uomo? (scrivilo)", ['Ken', '健', 'けん']),
      mcq('What was wrong with the train?', 'Cosa c\'era di sbagliato nel treno?', [['Wrong direction', 'Direzione sbagliata', true], ['It was full', 'Era pieno', false], ['It was cancelled', 'Era cancellato', false]]),
      mcq('What did he do at the next station?', 'Cosa ha fatto alla stazione successiva?', [['Got off', 'È sceso', true], ['Slept', 'Ha dormito', false], ['Ate', 'Ha mangiato', false]]),
      mcq('Why was he late?', 'Perché era in ritardo?', [['Wrong train', 'Treno sbagliato', true], ['He overslept', 'Si è alzato tardi', false], ['Traffic', 'Traffico', false]])
    ]
  },
  // ── 8 ─ N4 ──
  {
    id: 'tegami',
    title: { en: "Grandma's Letter", it: 'La lettera della nonna' },
    titleJp: 'おばあちゃんの手紙',
    emoji: '✉️',
    level: 'N4',
    lines: [
      { jp: 'ある日、美香は手紙をもらいました。', reading: 'あるひ、みかはてがみをもらいました。', en: 'One day, Mika received a letter.', it: 'Un giorno Mika ha ricevuto una lettera.' },
      { jp: '手紙はおばあちゃんからでした。', reading: 'てがみはおばあちゃんからでした。', en: 'The letter was from her grandmother.', it: 'La lettera era della nonna.' },
      { jp: '「元気ですか。私は元気です」と書いてありました。', reading: '「げんきですか。わたしはげんきです」とかいてありました。', en: 'It said "How are you? I am well."', it: 'Diceva "Come stai? Io sto bene."' },
      { jp: 'おばあちゃんは田舎に住んでいます。', reading: 'おばあちゃんはいなかにすんでいます。', en: 'Grandma lives in the countryside.', it: 'La nonna vive in campagna.' },
      { jp: '美香は返事を書くことにしました。', reading: 'みかはへんじをかくことにしました。', en: 'Mika decided to write a reply.', it: 'Mika ha deciso di scrivere una risposta.' },
      { jp: '夏休みに会いに行く約束をしました。', reading: 'なつやすみにあいにいくやくそくをしました。', en: 'She promised to visit in summer.', it: 'Ha promesso di andarla a trovare in estate.' }
    ],
    questions: [
      type("Who is the girl? (type her name)", 'Chi è la ragazza? (scrivi il nome)', ['Mika', '美香', 'みか']),
      mcq('Who sent the letter?', 'Chi ha mandato la lettera?', [['Her grandmother', 'La nonna', true], ['Her teacher', "L'insegnante", false], ['Her friend', "L'amica", false]]),
      mcq('Where does grandma live?', 'Dove vive la nonna?', [['In the countryside', 'In campagna', true], ['In Tokyo', 'A Tokyo', false], ['By the sea', 'Al mare', false]]),
      mcq('When will Mika visit?', 'Quando andrà a trovarla Mika?', [['In summer', 'In estate', true], ['In winter', 'In inverno', false], ['Next week', 'La prossima settimana', false]])
    ]
  },
  // ── 9 ─ N4+ ──
  {
    id: 'ryori',
    title: { en: 'First Time Cooking', it: 'La prima volta ai fornelli' },
    titleJp: '初めての料理',
    emoji: '🍛',
    level: 'N4+',
    lines: [
      { jp: '今日、健太は初めてカレーを作りました。', reading: 'きょう、けんたははじめてカレーをつくりました。', en: 'Today Kenta made curry for the first time.', it: 'Oggi Kenta ha fatto il curry per la prima volta.' },
      { jp: 'まず、野菜を切りました。', reading: 'まず、やさいをきりました。', en: 'First, he cut the vegetables.', it: 'Prima ha tagliato le verdure.' },
      { jp: '玉ねぎを切る時、涙が出ました。', reading: 'たまねぎをきるとき、なみだがでました。', en: 'When cutting onions, his eyes teared up.', it: 'Tagliando le cipolle, gli sono venute le lacrime.' },
      { jp: '次に、肉と野菜を炒めました。', reading: 'つぎに、にくとやさいをいためました。', en: 'Next, he fried the meat and vegetables.', it: 'Poi ha saltato carne e verdure.' },
      { jp: '三十分間、ゆっくり煮込みました。', reading: 'さんじゅっぷんかん、ゆっくりにこみました。', en: 'He simmered it slowly for 30 minutes.', it: 'Ha fatto sobbollire lentamente per 30 minuti.' },
      { jp: 'カレーはとても美味しかったです。', reading: 'カレーはとてもおいしかったです。', en: 'The curry was very delicious.', it: 'Il curry era buonissimo.' },
      { jp: '健太は自分の料理に満足しました。', reading: 'けんたはじぶんのりょうりにまんぞくしました。', en: 'Kenta was satisfied with his cooking.', it: 'Kenta era soddisfatto del suo piatto.' }
    ],
    questions: [
      type('What dish did he make? (English)', 'Che piatto ha fatto? (in inglese)', ['curry', 'カレー']),
      type("What is the cook's name? (type it)", 'Come si chiama il cuoco? (scrivilo)', ['Kenta', '健太', 'けんた']),
      mcq('Why did his eyes tear up?', 'Perché gli sono venute le lacrime?', [['Cutting onions', 'Tagliando le cipolle', true], ['He was sad', 'Era triste', false], ['The spice', 'Il piccante', false]]),
      mcq('How long did he simmer it?', 'Quanto a lungo ha sobbollito?', [['30 minutes', '30 minuti', true], ['10 minutes', '10 minuti', false], ['1 hour', "1 ora", false]]),
      mcq('How did he feel at the end?', 'Come si è sentito alla fine?', [['Satisfied', 'Soddisfatto', true], ['Angry', 'Arrabbiato', false], ['Tired', 'Stanco', false]])
    ]
  },
  // ── 10 ─ N4+ ──
  {
    id: 'tomodachi',
    title: { en: 'A New Friend', it: 'Un nuovo amico' },
    titleJp: '新しい友だち',
    emoji: '🤝',
    level: 'N4+',
    lines: [
      { jp: '転校生が私のクラスに来ました。', reading: 'てんこうせいがわたしのクラスにきました。', en: 'A transfer student came to my class.', it: 'Un nuovo studente è arrivato nella mia classe.' },
      { jp: '名前はアレックスで、アメリカ人です。', reading: 'なまえはアレックスで、アメリカじんです。', en: 'His name is Alex, and he is American.', it: 'Si chiama Alex ed è americano.' },
      { jp: '最初は日本語が下手でした。', reading: 'さいしょはにほんごがへたでした。', en: 'At first his Japanese was poor.', it: 'All\'inizio il suo giapponese era scarso.' },
      { jp: 'でも、毎日一生懸命練習しました。', reading: 'でも、まいにちいっしょうけんめいれんしゅうしました。', en: 'But he practiced hard every day.', it: 'Ma si è esercitato duramente ogni giorno.' },
      { jp: '私はアレックスに漢字を教えました。', reading: 'わたしはアレックスにかんじをおしえました。', en: 'I taught Alex kanji.', it: 'Io ho insegnato i kanji ad Alex.' },
      { jp: 'アレックスは私に英語を教えてくれました。', reading: 'アレックスはわたしにえいごをおしえてくれました。', en: 'Alex taught me English.', it: 'Alex ha insegnato l\'inglese a me.' },
      { jp: '今、私たちは親友です。', reading: 'いま、わたしたちはしんゆうです。', en: 'Now we are best friends.', it: 'Ora siamo migliori amici.' }
    ],
    questions: [
      type("What is the new student's name? (type it)", 'Come si chiama il nuovo studente? (scrivilo)', ['Alex', 'アレックス']),
      mcq('Where is Alex from?', "Da dove viene Alex?", [['America', 'America', true], ['England', 'Inghilterra', false], ['Australia', 'Australia', false]]),
      mcq('What did I teach Alex?', 'Cosa ho insegnato ad Alex?', [['Kanji', 'I kanji', true], ['Cooking', 'A cucinare', false], ['Music', 'La musica', false]]),
      mcq('What did Alex teach me?', "Cosa mi ha insegnato Alex?", [['English', "L'inglese", true], ['French', 'Il francese', false], ['Math', 'La matematica', false]]),
      mcq('What are they now?', 'Cosa sono adesso?', [['Best friends', 'Migliori amici', true], ['Rivals', 'Rivali', false], ['Strangers', 'Sconosciuti', false]])
    ]
  },
  // ── 11 ─ N4+ ──
  {
    id: 'yume',
    title: { en: 'A Strange Dream', it: 'Uno strano sogno' },
    titleJp: '不思議な夢',
    emoji: '🌙',
    level: 'N4+',
    lines: [
      { jp: '昨夜、変な夢を見ました。', reading: 'さくや、へんなゆめをみました。', en: 'Last night I had a strange dream.', it: 'Ieri notte ho fatto uno strano sogno.' },
      { jp: '夢の中で、私は鳥になりました。', reading: 'ゆめのなかで、わたしはとりになりました。', en: 'In the dream, I became a bird.', it: 'Nel sogno sono diventato un uccello.' },
      { jp: '青い空を自由に飛びました。', reading: 'あおいそらをじゆうにとびました。', en: 'I flew freely in the blue sky.', it: 'Ho volato libero nel cielo azzurro.' },
      { jp: '下に大きな海が見えました。', reading: 'したにおおきなうみがみえました。', en: 'Below I could see a big sea.', it: 'Sotto vedevo un grande mare.' },
      { jp: '突然、雨が降り始めました。', reading: 'とつぜん、あめがふりはじめました。', en: 'Suddenly, it began to rain.', it: 'All\'improvviso ha iniziato a piovere.' },
      { jp: '私は目が覚めました。', reading: 'わたしはめがさめました。', en: 'I woke up.', it: 'Mi sono svegliato.' },
      { jp: '窓の外では本当に雨が降っていました。', reading: 'まどのそとではほんとうにあめがふっていました。', en: 'Outside the window it was really raining.', it: 'Fuori dalla finestra pioveva davvero.' }
    ],
    questions: [
      mcq('What did I become in the dream?', 'Cosa sono diventato nel sogno?', [['A bird', 'Un uccello', true], ['A fish', 'Un pesce', false], ['A cat', 'Un gatto', false]]),
      type('What animal? (English)', 'Quale animale? (in inglese)', ['bird']),
      mcq('What could I see below?', 'Cosa vedevo sotto?', [['A big sea', 'Un grande mare', true], ['A city', 'Una città', false], ['A forest', 'Una foresta', false]]),
      mcq('What happened when I woke up?', 'Cosa è successo al risveglio?', [['It was really raining', 'Pioveva davvero', true], ['It was sunny', 'C\'era il sole', false], ['It was night', 'Era notte', false]])
    ]
  },
  // ── 12 ─ N4+ longer ──
  {
    id: 'omatsuri2',
    title: { en: 'The Lost Wallet', it: 'Il portafoglio perduto' },
    titleJp: '無くした財布',
    emoji: '👛',
    level: 'N4+',
    lines: [
      { jp: '買い物の後、由美は財布が無いことに気づきました。', reading: 'かいもののあと、ゆみはさいふがないことにきづきました。', en: 'After shopping, Yumi noticed her wallet was gone.', it: 'Dopo la spesa, Yumi si è accorta che il portafoglio non c\'era.' },
      { jp: 'とても困って、店に戻りました。', reading: 'とてもこまって、みせにもどりました。', en: 'Very troubled, she went back to the shop.', it: 'Molto preoccupata, è tornata al negozio.' },
      { jp: '店員さんに聞きましたが、ありませんでした。', reading: 'てんいんさんにききましたが、ありませんでした。', en: 'She asked the clerk, but it was not there.', it: 'Ha chiesto al commesso, ma non c\'era.' },
      { jp: '次に、交番へ行きました。', reading: 'つぎに、こうばんへいきました。', en: 'Next, she went to the police box.', it: 'Poi è andata alla guardiola della polizia.' },
      { jp: '親切な人が財布を届けていました。', reading: 'しんせつなひとがさいふをとどけていました。', en: 'A kind person had turned in the wallet.', it: 'Una persona gentile aveva consegnato il portafoglio.' },
      { jp: 'お金は全部ありました。', reading: 'おかねはぜんぶありました。', en: 'All the money was there.', it: 'C\'erano tutti i soldi.' },
      { jp: '由美はとても安心しました。', reading: 'ゆみはとてもあんしんしました。', en: 'Yumi was very relieved.', it: 'Yumi è stata molto sollevata.' },
      { jp: '日本は本当に安全だと思いました。', reading: 'にほんはほんとうにあんぜんだとおもいました。', en: 'She thought Japan is really safe.', it: 'Ha pensato che il Giappone è davvero sicuro.' }
    ],
    questions: [
      type("Who lost the wallet? (type the name)", 'Chi ha perso il portafoglio? (scrivi il nome)', ['Yumi', '由美', 'ゆみ']),
      mcq('What did Yumi lose?', 'Cosa ha perso Yumi?', [['Her wallet', 'Il portafoglio', true], ['Her phone', 'Il telefono', false], ['Her keys', 'Le chiavi', false]]),
      mcq('Where did she find it?', 'Dove lo ha ritrovato?', [['At the police box', 'Alla guardiola', true], ['At the shop', 'Al negozio', false], ['At home', 'A casa', false]]),
      mcq('Was the money still there?', 'I soldi c\'erano ancora?', [['Yes, all of it', 'Sì, tutti', true], ['No, none', 'No, niente', false], ['Only half', 'Solo metà', false]]),
      mcq('What did she think about Japan?', 'Cosa ha pensato del Giappone?', [["It's safe", 'È sicuro', true], ["It's big", 'È grande', false], ["It's expensive", 'È caro', false]])
    ]
  },
  // ── 13 ─ N4+ hardest ──
  {
    id: 'sakura',
    title: { en: 'Cherry Blossoms', it: 'I fiori di ciliegio' },
    titleJp: '桜の季節',
    emoji: '🌸',
    level: 'N4+',
    lines: [
      { jp: '春になると、日本中に桜が咲きます。', reading: 'はるになると、にほんじゅうにさくらがさきます。', en: 'When spring comes, cherry blossoms bloom all over Japan.', it: 'Quando arriva la primavera, i ciliegi fioriscono in tutto il Giappone.' },
      { jp: '人々は公園に集まります。', reading: 'ひとびとはこうえんにあつまります。', en: 'People gather in the parks.', it: 'Le persone si riuniscono nei parchi.' },
      { jp: 'これを「花見」と言います。', reading: 'これを「はなみ」といいます。', en: 'This is called "hanami".', it: 'Questo si chiama "hanami".' },
      { jp: '家族や友だちと一緒に食べたり飲んだりします。', reading: 'かぞくやともだちといっしょにたべたりのんだりします。', en: 'People eat and drink with family and friends.', it: 'Si mangia e si beve con familiari e amici.' },
      { jp: '桜の花はとても美しいですが、すぐに散ります。', reading: 'さくらのはなはとてもうつくしいですが、すぐにちります。', en: 'The blossoms are beautiful but fall quickly.', it: 'I fiori sono bellissimi ma cadono in fretta.' },
      { jp: 'だから、日本人は桜を特別に思います。', reading: 'だから、にほんじんはさくらをとくべつにおもいます。', en: 'So Japanese people think of cherry blossoms as special.', it: 'Per questo i giapponesi considerano i ciliegi speciali.' },
      { jp: '桜は命の短さを表しています。', reading: 'さくらはいのちのみじかさをあらわしています。', en: 'Cherry blossoms represent the shortness of life.', it: 'I fiori di ciliegio rappresentano la brevità della vita.' }
    ],
    questions: [
      type('What is flower-viewing called? (type the Japanese romaji)', 'Come si chiama l\'osservare i fiori? (scrivi in romaji)', ['hanami', '花見', 'はなみ'], { en: 'hana + mi', it: 'hana + mi' }),
      mcq('When do cherry blossoms bloom?', 'Quando fioriscono i ciliegi?', [['In spring', 'In primavera', true], ['In summer', 'In estate', false], ['In autumn', 'In autunno', false]]),
      mcq('Where do people gather?', 'Dove si riuniscono le persone?', [['In parks', 'Nei parchi', true], ['At temples', 'Ai templi', false], ['At home', 'A casa', false]]),
      mcq('What do the blossoms represent?', 'Cosa rappresentano i fiori?', [['The shortness of life', 'La brevità della vita', true], ['Wealth', 'La ricchezza', false], ['Strength', 'La forza', false]]),
      mcq('What happens to the blossoms quickly?', 'Cosa succede in fretta ai fiori?', [['They fall', 'Cadono', true], ['They grow', 'Crescono', false], ['They change color', 'Cambiano colore', false]])
    ]
  }
];
