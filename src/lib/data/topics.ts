// Themed beginner vocab/grammar sets: days, colors, months, and common
// grammatical structures. Same shape as vocab so they slot into the SRS.
export interface TopicEntry {
  word: string;
  reading: string;
  romaji: string;
  en: string;
  it: string;
}

export const daysOfWeek: TopicEntry[] = [
  { word: '月曜日', reading: 'げつようび', romaji: 'getsuyoubi', en: 'Monday', it: 'lunedì' },
  { word: '火曜日', reading: 'かようび', romaji: 'kayoubi', en: 'Tuesday', it: 'martedì' },
  { word: '水曜日', reading: 'すいようび', romaji: 'suiyoubi', en: 'Wednesday', it: 'mercoledì' },
  { word: '木曜日', reading: 'もくようび', romaji: 'mokuyoubi', en: 'Thursday', it: 'giovedì' },
  { word: '金曜日', reading: 'きんようび', romaji: 'kinyoubi', en: 'Friday', it: 'venerdì' },
  { word: '土曜日', reading: 'どようび', romaji: 'doyoubi', en: 'Saturday', it: 'sabato' },
  { word: '日曜日', reading: 'にちようび', romaji: 'nichiyoubi', en: 'Sunday', it: 'domenica' },
  { word: '今日', reading: 'きょう', romaji: 'kyou', en: 'today', it: 'oggi' },
  { word: '明日', reading: 'あした', romaji: 'ashita', en: 'tomorrow', it: 'domani' },
  { word: '昨日', reading: 'きのう', romaji: 'kinou', en: 'yesterday', it: 'ieri' },
  { word: '週末', reading: 'しゅうまつ', romaji: 'shuumatsu', en: 'weekend', it: 'fine settimana' }
];

export const colors: TopicEntry[] = [
  { word: '赤', reading: 'あか', romaji: 'aka', en: 'red', it: 'rosso' },
  { word: '青', reading: 'あお', romaji: 'ao', en: 'blue', it: 'blu' },
  { word: '黄色', reading: 'きいろ', romaji: 'kiiro', en: 'yellow', it: 'giallo' },
  { word: '緑', reading: 'みどり', romaji: 'midori', en: 'green', it: 'verde' },
  { word: '黒', reading: 'くろ', romaji: 'kuro', en: 'black', it: 'nero' },
  { word: '白', reading: 'しろ', romaji: 'shiro', en: 'white', it: 'bianco' },
  { word: '茶色', reading: 'ちゃいろ', romaji: 'chairo', en: 'brown', it: 'marrone' },
  { word: '紫', reading: 'むらさき', romaji: 'murasaki', en: 'purple', it: 'viola' },
  { word: 'ピンク', reading: 'ピンク', romaji: 'pinku', en: 'pink', it: 'rosa' },
  { word: 'オレンジ', reading: 'オレンジ', romaji: 'orenji', en: 'orange', it: 'arancione' },
  { word: '灰色', reading: 'はいいろ', romaji: 'haiiro', en: 'grey', it: 'grigio' },
  { word: '金色', reading: 'きんいろ', romaji: 'kiniro', en: 'gold', it: 'oro' }
];

export const months: TopicEntry[] = [
  { word: '一月', reading: 'いちがつ', romaji: 'ichigatsu', en: 'January', it: 'gennaio' },
  { word: '二月', reading: 'にがつ', romaji: 'nigatsu', en: 'February', it: 'febbraio' },
  { word: '三月', reading: 'さんがつ', romaji: 'sangatsu', en: 'March', it: 'marzo' },
  { word: '四月', reading: 'しがつ', romaji: 'shigatsu', en: 'April', it: 'aprile' },
  { word: '五月', reading: 'ごがつ', romaji: 'gogatsu', en: 'May', it: 'maggio' },
  { word: '六月', reading: 'ろくがつ', romaji: 'rokugatsu', en: 'June', it: 'giugno' },
  { word: '七月', reading: 'しちがつ', romaji: 'shichigatsu', en: 'July', it: 'luglio' },
  { word: '八月', reading: 'はちがつ', romaji: 'hachigatsu', en: 'August', it: 'agosto' },
  { word: '九月', reading: 'くがつ', romaji: 'kugatsu', en: 'September', it: 'settembre' },
  { word: '十月', reading: 'じゅうがつ', romaji: 'juugatsu', en: 'October', it: 'ottobre' },
  { word: '十一月', reading: 'じゅういちがつ', romaji: 'juuichigatsu', en: 'November', it: 'novembre' },
  { word: '十二月', reading: 'じゅうにがつ', romaji: 'juunigatsu', en: 'December', it: 'dicembre' }
];

// Common grammatical structures as full example sentences. Front is the
// pattern in use; meaning explains the structure.
export const grammar: TopicEntry[] = [
  { word: '勉強しなければなりません。', reading: 'べんきょうしなければなりません。', romaji: 'benkyou shinakereba narimasen', en: 'I have to study. (must do)', it: 'Devo studiare. (obbligo)' },
  { word: '行かなくてはいけません。', reading: 'いかなくてはいけません。', romaji: 'ikanakute wa ikemasen', en: 'I have to go. (must do)', it: 'Devo andare. (obbligo)' },
  { word: 'タバコを吸ってはいけません。', reading: 'タバコをすってはいけません。', romaji: 'tabako o sutte wa ikemasen', en: 'You must not smoke. (prohibition)', it: 'Non devi fumare. (divieto)' },
  { word: '食べすぎないほうがいいです。', reading: 'たべすぎないほうがいいです。', romaji: 'tabesuginai hou ga ii desu', en: "You shouldn't overeat. (advice)", it: 'Non dovresti mangiare troppo. (consiglio)' },
  { word: '休んだほうがいいです。', reading: 'やすんだほうがいいです。', romaji: 'yasunda hou ga ii desu', en: 'You should rest. (advice)', it: 'Dovresti riposare. (consiglio)' },
  { word: '日本語を話すことができます。', reading: 'にほんごをはなすことができます。', romaji: 'nihongo o hanasu koto ga dekimasu', en: 'I can speak Japanese. (ability)', it: 'So parlare giapponese. (capacità)' },
  { word: '食べてもいいですか。', reading: 'たべてもいいですか。', romaji: 'tabete mo ii desu ka', en: 'May I eat? (permission)', it: 'Posso mangiare? (permesso)' },
  { word: '映画を見たいです。', reading: 'えいがをみたいです。', romaji: 'eiga o mitai desu', en: 'I want to watch a movie. (desire)', it: 'Voglio vedere un film. (desiderio)' },
  { word: '雨が降っているから、行きません。', reading: 'あめがふっているから、いきません。', romaji: 'ame ga futte iru kara, ikimasen', en: "Because it's raining, I won't go. (reason)", it: 'Siccome piove, non vado. (motivo)' },
  { word: '宿題をしてから、遊びます。', reading: 'しゅくだいをしてから、あそびます。', romaji: 'shukudai o shite kara, asobimasu', en: 'After doing homework, I play. (sequence)', it: 'Dopo aver fatto i compiti, gioco. (sequenza)' },
  { word: '寒いので、窓を閉めます。', reading: 'さむいので、まどをしめます。', romaji: 'samui node, mado o shimemasu', en: "Because it's cold, I close the window. (reason)", it: 'Siccome fa freddo, chiudo la finestra. (motivo)' },
  { word: '日本へ行ったことがあります。', reading: 'にほんへいったことがあります。', romaji: 'nihon e itta koto ga arimasu', en: 'I have been to Japan. (experience)', it: 'Sono stato in Giappone. (esperienza)' },
  { word: 'もし時間があれば、行きます。', reading: 'もしじかんがあれば、いきます。', romaji: 'moshi jikan ga areba, ikimasu', en: 'If I have time, I will go. (conditional)', it: 'Se ho tempo, andrò. (condizionale)' },
  { word: '食べながら、テレビを見ます。', reading: 'たべながら、テレビをみます。', romaji: 'tabenagara, terebi o mimasu', en: 'While eating, I watch TV. (simultaneous)', it: 'Mentre mangio, guardo la TV. (contemporaneità)' },
  { word: '友だちに本をあげました。', reading: 'ともだちにほんをあげました。', romaji: 'tomodachi ni hon o agemashita', en: 'I gave a book to my friend. (giving)', it: 'Ho dato un libro al mio amico. (dare)' }
];
