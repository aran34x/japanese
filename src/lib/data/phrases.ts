// Advanced sentence/phrase decks (JLPT N4-ish): full natural sentences with
// reading + EN/IT meaning. Original, accurate Japanese — the kind of phrases
// like "There are lots of temples in Tokyo".
export interface PhraseEntry {
  text: string; // sentence with kanji
  reading: string; // full kana reading
  en: string;
  it: string;
}

export const phrasesN4: PhraseEntry[] = [
  { text: '東京にはお寺がたくさんあります。', reading: 'とうきょうにはおてらがたくさんあります。', en: 'There are lots of temples in Tokyo.', it: 'A Tokyo ci sono molti templi.' },
  { text: '日本語を勉強するのは楽しいです。', reading: 'にほんごをべんきょうするのはたのしいです。', en: 'Studying Japanese is fun.', it: 'Studiare il giapponese è divertente.' },
  { text: '昨日、友だちと映画を見に行きました。', reading: 'きのう、ともだちとえいがをみにいきました。', en: 'Yesterday I went to see a movie with a friend.', it: 'Ieri sono andato a vedere un film con un amico.' },
  { text: '電車が遅れているので、少し待ってください。', reading: 'でんしゃがおくれているので、すこしまってください。', en: 'The train is delayed, so please wait a little.', it: 'Il treno è in ritardo, quindi aspetta un po\'.' },
  { text: '私は毎朝コーヒーを飲みます。', reading: 'わたしはまいあさコーヒーをのみます。', en: 'I drink coffee every morning.', it: 'Bevo il caffè ogni mattina.' },
  { text: 'この料理はとても辛いですが、おいしいです。', reading: 'このりょうりはとてもからいですが、おいしいです。', en: 'This dish is very spicy, but delicious.', it: 'Questo piatto è molto piccante, ma buono.' },
  { text: '週末は家族と公園へ行く予定です。', reading: 'しゅうまつはかぞくとこうえんへいくよていです。', en: 'On the weekend I plan to go to the park with my family.', it: 'Nel fine settimana ho in programma di andare al parco con la famiglia.' },
  { text: 'すみません、駅までの道を教えてください。', reading: 'すみません、えきまでのみちをおしえてください。', en: 'Excuse me, please tell me the way to the station.', it: 'Mi scusi, mi indichi la strada per la stazione.' },
  { text: '日本では靴を脱いで家に入ります。', reading: 'にほんではくつをぬいでいえにはいります。', en: 'In Japan, you take off your shoes and enter the house.', it: 'In Giappone ci si tolgono le scarpe e si entra in casa.' },
  { text: '彼女は英語と日本語が話せます。', reading: 'かのじょはえいごとにほんごがはなせます。', en: 'She can speak English and Japanese.', it: 'Lei sa parlare inglese e giapponese.' },
  { text: '明日は雨が降るかもしれません。', reading: 'あしたはあめがふるかもしれません。', en: 'It might rain tomorrow.', it: 'Domani potrebbe piovere.' },
  { text: 'もっと安いホテルを探しています。', reading: 'もっとやすいホテルをさがしています。', en: 'I am looking for a cheaper hotel.', it: 'Sto cercando un hotel più economico.' },
  { text: 'この本を読んだことがありますか。', reading: 'このほんをよんだことがありますか。', en: 'Have you ever read this book?', it: 'Hai mai letto questo libro?' },
  { text: '仕事が終わったら、一緒に食事しましょう。', reading: 'しごとがおわったら、いっしょにしょくじしましょう。', en: 'When work is over, let\'s eat together.', it: 'Quando finisce il lavoro, mangiamo insieme.' },
  { text: '京都は古い建物が多くて、きれいな町です。', reading: 'きょうとはふるいたてものがおおくて、きれいなまちです。', en: 'Kyoto is a beautiful town with many old buildings.', it: 'Kyoto è una bella città con molti edifici antichi.' },
  { text: '日本の夏はとても暑くて湿気が多いです。', reading: 'にほんのなつはとてもあつくてしっけがおおいです。', en: 'Japanese summers are very hot and humid.', it: 'Le estati giapponesi sono molto calde e umide.' },
  { text: '駅の前に新しいレストランができました。', reading: 'えきのまえにあたらしいレストランができました。', en: 'A new restaurant has opened in front of the station.', it: 'Davanti alla stazione ha aperto un nuovo ristorante.' },
  { text: 'すしを食べたことがありますか。', reading: 'すしをたべたことがありますか。', en: 'Have you ever eaten sushi?', it: 'Hai mai mangiato il sushi?' },
  { text: 'もう少しゆっくり話してくれませんか。', reading: 'もうすこしゆっくりはなしてくれませんか。', en: 'Could you speak a little more slowly?', it: 'Potresti parlare un po\' più lentamente?' },
  { text: '私の趣味は写真を撮ることです。', reading: 'わたしのしゅみはしゃしんをとることです。', en: 'My hobby is taking photos.', it: 'Il mio hobby è fare foto.' },
  { text: '日本語で手紙を書くのは難しいです。', reading: 'にほんごでてがみをかくのはむずかしいです。', en: 'Writing a letter in Japanese is difficult.', it: 'Scrivere una lettera in giapponese è difficile.' },
  { text: '富士山に登ってみたいです。', reading: 'ふじさんにのぼってみたいです。', en: 'I would like to try climbing Mt. Fuji.', it: 'Vorrei provare a scalare il Monte Fuji.' },
  { text: 'この電車は新宿に止まりますか。', reading: 'このでんしゃはしんじゅくにとまりますか。', en: 'Does this train stop at Shinjuku?', it: 'Questo treno si ferma a Shinjuku?' },
  { text: '寒くなってきたので、コートを着ましょう。', reading: 'さむくなってきたので、コートをきましょう。', en: 'It\'s getting cold, so let\'s put on a coat.', it: 'Sta facendo freddo, quindi mettiamoci il cappotto.' },
  { text: '彼は毎日忙しそうに働いています。', reading: 'かれはまいにちいそがしそうにはたらいています。', en: 'He works busily every day.', it: 'Lui lavora indaffarato ogni giorno.' },
  { text: '日本には四つの季節があります。', reading: 'にほんにはよっつのきせつがあります。', en: 'Japan has four seasons.', it: 'Il Giappone ha quattro stagioni.' },
  { text: '宿題をしてからテレビを見ます。', reading: 'しゅくだいをしてからテレビをみます。', en: 'I watch TV after doing my homework.', it: 'Guardo la TV dopo aver fatto i compiti.' },
  { text: 'この漢字の読み方が分かりません。', reading: 'このかんじのよみかたがわかりません。', en: 'I don\'t know how to read this kanji.', it: 'Non so come si legge questo kanji.' },
  { text: '友だちが日本から遊びに来ます。', reading: 'ともだちがにほんからあそびにきます。', en: 'A friend is coming from Japan to visit.', it: 'Un amico viene dal Giappone a trovarmi.' },
  { text: '一番好きな食べ物はラーメンです。', reading: 'いちばんすきなたべものはラーメンです。', en: 'My favorite food is ramen.', it: 'Il mio cibo preferito è il ramen.' }
];
