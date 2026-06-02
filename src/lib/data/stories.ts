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
}

/** A typing question — the learner types the answer (e.g. a name). */
export interface StoryType {
  type: 'type';
  q: { en: string; it: string };
  /** Accepted answers (case-insensitive, trimmed). First is the canonical one. */
  answers: string[];
  /** Optional hint shown under the input. */
  hint?: { en: string; it: string };
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
  // ── 4 ─ N5+ ──
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
  // ── 5 ─ N5+ ──
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
  // ── 6 ─ N4 ──
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
