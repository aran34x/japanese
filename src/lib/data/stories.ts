// Simple original children's-style stories for reading comprehension. Each line
// has Japanese + reading + translation; questions test understanding of what was
// read. All original text in graded, beginner-friendly Japanese.
export interface StoryLine {
  jp: string;
  reading: string;
  en: string;
  it: string;
}

export interface StoryQuestion {
  q: { en: string; it: string };
  options: { en: string; it: string; correct: boolean }[];
}

export interface Story {
  id: string;
  title: { en: string; it: string };
  emoji: string;
  level: 'N5' | 'N4';
  lines: StoryLine[];
  questions: StoryQuestion[];
}

export const STORIES: Story[] = [
  {
    id: 'neko',
    title: { en: 'The Little Cat', it: 'Il gattino' },
    emoji: '🐱',
    level: 'N5',
    lines: [
      { jp: '小さい猫がいます。', reading: 'ちいさいねこがいます。', en: 'There is a little cat.', it: "C'è un gattino." },
      { jp: '猫の名前はタマです。', reading: 'ねこのなまえはタマです。', en: "The cat's name is Tama.", it: 'Il gatto si chiama Tama.' },
      { jp: 'タマは魚が大好きです。', reading: 'タマはさかながだいすきです。', en: 'Tama loves fish.', it: 'Tama adora il pesce.' },
      { jp: '毎日、公園で遊びます。', reading: 'まいにち、こうえんであそびます。', en: 'Every day, it plays in the park.', it: 'Ogni giorno gioca al parco.' },
      { jp: '夜は家で寝ます。', reading: 'よるはいえでねます。', en: 'At night it sleeps at home.', it: 'Di notte dorme a casa.' }
    ],
    questions: [
      {
        q: { en: "What is the cat's name?", it: 'Come si chiama il gatto?' },
        options: [
          { en: 'Tama', it: 'Tama', correct: true },
          { en: 'Mike', it: 'Mike', correct: false },
          { en: 'Shiro', it: 'Shiro', correct: false }
        ]
      },
      {
        q: { en: 'What does Tama love?', it: 'Cosa adora Tama?' },
        options: [
          { en: 'Fish', it: 'Il pesce', correct: true },
          { en: 'Milk', it: 'Il latte', correct: false },
          { en: 'Meat', it: 'La carne', correct: false }
        ]
      },
      {
        q: { en: 'Where does Tama play every day?', it: 'Dove gioca Tama ogni giorno?' },
        options: [
          { en: 'In the park', it: 'Al parco', correct: true },
          { en: 'At school', it: 'A scuola', correct: false },
          { en: 'At the station', it: 'Alla stazione', correct: false }
        ]
      }
    ]
  },
  {
    id: 'momotaro',
    title: { en: "Taro's Picnic", it: 'Il picnic di Taro' },
    emoji: '🍱',
    level: 'N5',
    lines: [
      { jp: '日曜日です。', reading: 'にちようびです。', en: 'It is Sunday.', it: 'È domenica.' },
      { jp: '太郎は山へ行きます。', reading: 'たろうはやまへいきます。', en: 'Taro goes to the mountain.', it: 'Taro va in montagna.' },
      { jp: 'お母さんはお弁当を作りました。', reading: 'おかあさんはおべんとうをつくりました。', en: 'His mother made a lunch box.', it: 'La mamma ha preparato il pranzo al sacco.' },
      { jp: 'お弁当の中におにぎりがあります。', reading: 'おべんとうのなかにおにぎりがあります。', en: 'There are rice balls in the lunch box.', it: 'Nel pranzo ci sono polpette di riso.' },
      { jp: '太郎はとても嬉しいです。', reading: 'たろうはとてもうれしいです。', en: 'Taro is very happy.', it: 'Taro è molto felice.' }
    ],
    questions: [
      {
        q: { en: 'What day is it?', it: 'Che giorno è?' },
        options: [
          { en: 'Sunday', it: 'Domenica', correct: true },
          { en: 'Monday', it: 'Lunedì', correct: false },
          { en: 'Saturday', it: 'Sabato', correct: false }
        ]
      },
      {
        q: { en: 'Where does Taro go?', it: 'Dove va Taro?' },
        options: [
          { en: 'To the mountain', it: 'In montagna', correct: true },
          { en: 'To the sea', it: 'Al mare', correct: false },
          { en: 'To the city', it: 'In città', correct: false }
        ]
      },
      {
        q: { en: 'What is in the lunch box?', it: 'Cosa c\'è nel pranzo al sacco?' },
        options: [
          { en: 'Rice balls', it: 'Polpette di riso', correct: true },
          { en: 'Bread', it: 'Pane', correct: false },
          { en: 'Noodles', it: 'Noodles', correct: false }
        ]
      }
    ]
  },
  {
    id: 'ame',
    title: { en: 'A Rainy Day', it: 'Un giorno di pioggia' },
    emoji: '☔',
    level: 'N4',
    lines: [
      { jp: '今朝から雨が降っています。', reading: 'けさからあめがふっています。', en: 'It has been raining since this morning.', it: 'Piove da stamattina.' },
      { jp: '花子は傘を持って学校へ行きました。', reading: 'はなこはかさをもってがっこうへいきました。', en: 'Hanako took an umbrella and went to school.', it: "Hanako ha preso l'ombrello ed è andata a scuola." },
      { jp: 'でも、友だちは傘を忘れました。', reading: 'でも、ともだちはかさをわすれました。', en: 'But her friend forgot an umbrella.', it: "Ma la sua amica ha dimenticato l'ombrello." },
      { jp: '花子は友だちと一緒に傘を使いました。', reading: 'はなこはともだちといっしょにかさをつかいました。', en: 'Hanako shared the umbrella with her friend.', it: "Hanako ha condiviso l'ombrello con l'amica." },
      { jp: '二人は笑いながら帰りました。', reading: 'ふたりはわらいながらかえりました。', en: 'The two went home laughing.', it: 'Le due sono tornate a casa ridendo.' }
    ],
    questions: [
      {
        q: { en: 'What is the weather like?', it: "Com'è il tempo?" },
        options: [
          { en: 'Rainy', it: 'Piovoso', correct: true },
          { en: 'Sunny', it: 'Soleggiato', correct: false },
          { en: 'Snowy', it: 'Nevoso', correct: false }
        ]
      },
      {
        q: { en: 'What did the friend forget?', it: "Cosa ha dimenticato l'amica?" },
        options: [
          { en: 'An umbrella', it: 'Un ombrello', correct: true },
          { en: 'Her bag', it: 'La borsa', correct: false },
          { en: 'Her lunch', it: 'Il pranzo', correct: false }
        ]
      },
      {
        q: { en: 'How did they go home?', it: 'Come sono tornate a casa?' },
        options: [
          { en: 'Laughing together', it: 'Ridendo insieme', correct: true },
          { en: 'Crying', it: 'Piangendo', correct: false },
          { en: 'Separately', it: 'Separatamente', correct: false }
        ]
      }
    ]
  }
];
