// Fictional characters from Japanese pop culture. Their ARTWORK is copyrighted,
// so we never bundle or hot-link images for these — instead we show a clean
// styled card (emoji + their real Japanese name). The text bio is still fetched
// live from Wikipedia (freely licensed text). The challenge is reading their
// actual Japanese name — excellent katakana/kanji practice.
import type { Localized } from '../../game/tracks';

export type FictionalCategory = 'games' | 'anime';

export interface FictionalChar {
  id: string;
  name: string; // display / English name
  wiki: string; // Wikipedia article title (for the live bio)
  ja: string; // real Japanese name
  reading: string; // kana reading
  romaji: string;
  category: FictionalCategory;
  emoji: string;
  color: string;
  imageUrl?: string;
  imageSource?: FictionalImageSource;
  fact: Localized;
  trait: { ja: string; reading: string; en: string; it: string };
  xp: number;
}

export interface FictionalImageSource {
  wiki: string;
  title: string;
}

const FICTIONAL_IMAGE_URLS: Record<string, string> = {
  impa: 'https://static.wikia.nocookie.net/zelda/images/e/e1/ImpaHWAoC.png/revision/latest?cb=20201126191310&path-prefix=it'
};

const FICTIONAL_IMAGE_SOURCES: Record<string, FictionalImageSource> = {
  impa: { wiki: 'zelda', title: 'Impa' },
  jigglypuff: { wiki: 'pokemon', title: 'Jigglypuff' },
  peach: { wiki: 'mario', title: 'Princess Peach' },
  sheik: { wiki: 'zelda', title: 'Sheik' },
  luigi: { wiki: 'mario', title: 'Luigi' },
  eevee: { wiki: 'pokemon', title: 'Eevee' },
  bowser: { wiki: 'mario', title: 'Bowser' },
  ganon: { wiki: 'zelda', title: 'Ganondorf' },
  charizard: { wiki: 'pokemon', title: 'Charizard' },
  kirby: { wiki: 'kirby', title: 'Kirby' },
  mewtwo: { wiki: 'pokemon', title: 'Mewtwo' },
  zelda: { wiki: 'zelda', title: 'Princess Zelda' },
  mario: { wiki: 'mario', title: 'Mario' },
  link: { wiki: 'zelda', title: 'Link' },
  pikachu: { wiki: 'pokemon', title: 'Pikachu' },
  morrigan: { wiki: 'darkstalkers', title: 'Morrigan Aensland' },
  shimon: { wiki: 'castlevania', title: 'Simon Belmont' },
  terry: { wiki: 'snk', title: 'Terry Bogard' },
  kazuya: { wiki: 'tekken', title: 'Kazuya Mishima' },
  heihachi: { wiki: 'tekken', title: 'Heihachi Mishima' },
  '2b': { wiki: 'nier', title: 'YoRHa No.2 Type B' },
  shulk: { wiki: 'xenoblade', title: 'Shulk' },
  lucina: { wiki: 'fireemblem', title: 'Lucina' },
  marth: { wiki: 'fireemblem', title: 'Marth' },
  jill: { wiki: 'residentevil', title: 'Jill Valentine' },
  chris: { wiki: 'residentevil', title: 'Chris Redfield' },
  leon: { wiki: 'residentevil', title: 'Leon Scott Kennedy' },
  kiryu: { wiki: 'yakuza', title: 'Kazuma Kiryu' },
  majima: { wiki: 'yakuza', title: 'Goro Majima' },
  chunli: { wiki: 'streetfighter', title: 'Chun-Li' },
  ryu: { wiki: 'streetfighter', title: 'Ryu' },
  bayonetta: { wiki: 'bayonetta', title: 'Bayonetta (character)' },
  dante: { wiki: 'devilmaycry', title: 'Dante' },
  vergil: { wiki: 'devilmaycry', title: 'Vergil' },
  joker: { wiki: 'megamitensei', title: 'Ren Amamiya' },
  rockman: { wiki: 'megaman', title: 'Mega Man' },
  samus: { wiki: 'metroid', title: 'Samus Aran' },
  donkeykong: { wiki: 'mario', title: 'Donkey Kong (character)' },
  kinopio: { wiki: 'mario', title: 'Toad (character)' },
  yoshi: { wiki: 'mario', title: 'Yoshi (character)' },
  sora: { wiki: 'kingdomhearts', title: 'Sora' },
  riku: { wiki: 'kingdomhearts', title: 'Riku' },
  kairi: { wiki: 'kingdomhearts', title: 'Kairi' },
  tifa: { wiki: 'finalfantasy', title: 'Tifa Lockhart' },
  aerith: { wiki: 'finalfantasy', title: 'Aerith Gainsborough' },
  snake: { wiki: 'metalgear', title: 'Solid Snake' },
  sephiroth: { wiki: 'finalfantasy', title: 'Sephiroth' },
  cloud: { wiki: 'finalfantasy', title: 'Cloud Strife' },
  pacman: { wiki: 'pacman', title: 'Pac-Man' },
  sonic: { wiki: 'sonic', title: 'Sonic the Hedgehog' },
  mari: { wiki: 'evangelion', title: 'Mari Makinami Illustrious' },
  suneo: { wiki: 'doraemon', title: 'Suneo Honekawa' },
  shinobu: { wiki: 'kimetsu-no-yaiba', title: 'Shinobu Kocho' },
  mina: { wiki: 'sailormoon', title: 'Minako Aino / Sailor Venus (anime)' },
  luka: { wiki: 'vocaloid', title: 'Megurine Luka' },
  inosuke: { wiki: 'kimetsu-no-yaiba', title: 'Inosuke Hashibira' },
  mako: { wiki: 'sailormoon', title: 'Makoto Kino / Sailor Jupiter (anime)' },
  kaito: { wiki: 'vocaloid', title: 'KAITO' },
  san: { wiki: 'ghibli', title: 'San' },
  gian: { wiki: 'doraemon', title: 'Takeshi Gouda' },
  piccolo: { wiki: 'dragonball', title: 'Piccolo' },
  'rei-sailor': { wiki: 'sailormoon', title: 'Rei Hino / Sailor Mars (anime)' },
  rin: { wiki: 'vocaloid', title: 'Kagamine Rin & Len' },
  chopper: { wiki: 'onepiece', title: 'Tony Tony Chopper' },
  zenitsu: { wiki: 'kimetsu-no-yaiba', title: 'Zenitsu Agatsuma' },
  ami: { wiki: 'sailormoon', title: 'Ami Mizuno / Sailor Mercury (anime)' },
  len: { wiki: 'vocaloid', title: 'Kagamine Rin & Len' },
  howl: { wiki: 'ghibli', title: 'Howl Jenkins Pendragon' },
  shizuka: { wiki: 'doraemon', title: 'Shizuka Minamoto' },
  sakura: { wiki: 'naruto', title: 'Sakura Haruno' },
  misato: { wiki: 'evangelion', title: 'Misato Katsuragi' },
  nami: { wiki: 'onepiece', title: 'Nami' },
  gohan: { wiki: 'dragonball', title: 'Gohan' },
  kiki: { wiki: 'ghibli', title: 'Kiki' },
  asuka: { wiki: 'evangelion', title: 'Asuka Langley Sohryu' },
  nobita: { wiki: 'doraemon', title: 'Nobita Nobi' },
  sanji: { wiki: 'onepiece', title: 'Sanji' },
  kakashi: { wiki: 'naruto', title: 'Kakashi Hatake' },
  frieza: { wiki: 'dragonball', title: 'Frieza' },
  chihiro: { wiki: 'ghibli', title: 'Chihiro Ogino' },
  nezuko: { wiki: 'kimetsu-no-yaiba', title: 'Nezuko Kamado' },
  zoro: { wiki: 'onepiece', title: 'Roronoa Zoro' },
  itachi: { wiki: 'naruto', title: 'Itachi Uchiha' },
  vegeta: { wiki: 'dragonball', title: 'Vegeta' },
  usagi: { wiki: 'sailormoon', title: 'Usagi Tsukino / Sailor Moon (anime)' },
  rei: { wiki: 'evangelion', title: 'Rei Ayanami' },
  totoro: { wiki: 'ghibli', title: 'Totoro' },
  tanjiro: { wiki: 'kimetsu-no-yaiba', title: 'Tanjiro Kamado' },
  shinji: { wiki: 'evangelion', title: 'Shinji Ikari' },
  sasuke: { wiki: 'naruto', title: 'Sasuke Uchiha' },
  luffy: { wiki: 'onepiece', title: 'Monkey D. Luffy' },
  miku: { wiki: 'vocaloid', title: 'Hatsune Miku' },
  doraemon: { wiki: 'doraemon', title: 'Doraemon' },
  naruto: { wiki: 'naruto', title: 'Naruto Uzumaki' },
  goku: { wiki: 'dragonball', title: 'Goku' },
  edward: { wiki: 'fma', title: 'Edward Elric' },
  saitama: { wiki: 'onepunchman', title: 'Saitama' },
  levi: { wiki: 'attackontitan', title: 'Levi Ackerman' },
  eren: { wiki: 'attackontitan', title: 'Eren Yeager' },
  gojo: { wiki: 'jujutsu-kaisen', title: 'Satoru Gojo' }
};

const c = (
  id: string,
  name: string,
  ja: string,
  reading: string,
  romaji: string,
  category: FictionalCategory,
  emoji: string,
  color: string,
  fact: Localized,
  trait: { ja: string; reading: string; en: string; it: string },
  wiki?: string
): FictionalChar => ({
  id,
  name,
  wiki: wiki ?? name,
  ja,
  reading,
  romaji,
  category,
  emoji,
  color,
  imageUrl: FICTIONAL_IMAGE_URLS[id],
  imageSource: FICTIONAL_IMAGE_SOURCES[id],
  fact,
  trait,
  xp: 50
});

export const FICTIONAL_CATEGORIES: Record<FictionalCategory, { label: Localized; emoji: string; color: string }> = {
  games: { label: { en: 'Games', it: 'Giochi' }, emoji: '🎮', color: '#10b981' },
  anime: { label: { en: 'Anime', it: 'Anime' }, emoji: '🌟', color: '#fbbf24' }
};

export const CHARACTERS_FICTIONAL: FictionalChar[] = [
  // --- GAMES (Ordered Least to Most Popular, Mixed Categories) ---
  c('impa', 'Impa', 'インパ', 'いんぱ', 'inpa', 'games', '🛡', '#475569',
    { en: 'The faithful protector of a Royal Family.', it: 'La fedele protettrice di una famiglia reale.' },
    { ja: '守', reading: 'まもり', en: 'protect', it: 'difesa' }),
  c('jigglypuff', 'Jigglypuff', 'プリン', 'ぷりん', 'purin', 'games', '🎤', '#f9a8d4',
    { en: 'A pink creature that sings foes to sleep.', it: 'Una creatura rosa che addormenta i nemici cantando.' },
    { ja: '歌', reading: 'うた', en: 'song', it: 'canzone' }),
  c('peach', 'Princess Peach', 'ピーチ姫', 'ぴーちひめ', 'piichi hime', 'games', '👑', '#f9a8d4',
    { en: 'The ruler of a kingdom often captured by a turtle.', it: 'La sovrana di un regno spesso catturata da una tartaruga.' },
    { ja: '姫', reading: 'ひめ', en: 'princess', it: 'principessa' }),
  c('sheik', 'Sheik', 'シーク', 'しーく', 'shiiku', 'games', '🥷', '#6366f1',
    { en: 'A mysterious identity assumed by a princess.', it: 'Un\'identità misteriosa assunta da una principessa.' },
    { ja: '影', reading: 'かげ', en: 'shadow', it: 'ombra' }, 'Sheik (The Legend of Zelda)'),
  c('luigi', 'Luigi', 'ルイージ', 'るいーじ', 'ruiiji', 'games', '🟢', '#22c55e',
    { en: 'The younger brother of a famous plumber.', it: 'Il fratello minore di un famoso idraulico.' },
    { ja: '弟', reading: 'おとうと', en: 'younger brother', it: 'fratello minore' }, 'Luigi (character)'),
  c('eevee', 'Eevee', 'イーブイ', 'いーぶい', 'iibui', 'games', '🦊', '#a16207',
    { en: 'A creature known for its many possible evolutions.', it: 'Una creatura nota per le sue molte possibili evoluzioni.' },
    { ja: '進化', reading: 'しんか', en: 'evolution', it: 'evoluzione' }),
  c('bowser', 'Bowser', 'クッパ', 'くっぱ', 'kuppa', 'games', '🐢', '#f97316',
    { en: 'A powerful turtle king who breathes fire.', it: 'Un potente re tartaruga che sputa fuoco.' },
    { ja: '亀', reading: 'かめ', en: 'turtle', it: 'tartaruga' }),
  c('ganon', 'Ganondorf', 'ガノンドロフ', 'がのんどろふ', 'ganondorofu', 'games', '👿', '#991b1b',
    { en: 'The main antagonist who seeks a golden relic.', it: 'L\'antagonista principale che cerca una reliquia dorata.' },
    { ja: '闇', reading: 'やみ', en: 'darkness', it: 'oscurità' }),
  c('charizard', 'Charizard', 'リザードン', 'りざーどん', 'rizaadon', 'games', '🔥', '#f97316',
    { en: 'A fire-breathing creature that flies high.', it: 'Una creatura sputafuoco che vola alto.' },
    { ja: '火', reading: 'ひ', en: 'fire', it: 'fuoco' }),
  c('kirby', 'Kirby', 'カービィ', 'かーびぃ', 'kaabii', 'games', '🌟', '#f9a8d4',
    { en: 'A pink puffball hero who inhales enemies.', it: 'Un eroe rosa e soffice che inghiotte i nemici.' },
    { ja: '空腹', reading: 'くうふく', en: 'hungry', it: 'affamato' }, 'Kirby (character)'),
  c('mewtwo', 'Mewtwo', 'ミュウツー', 'みゅうつー', 'myuutsuu', 'games', '🧬', '#a855f7',
    { en: 'A genetically engineered legendary creature.', it: 'Una leggendaria creatura creata geneticamente.' },
    { ja: '最強', reading: 'さいきょう', en: 'strongest', it: 'più forte' }),
  c('zelda', 'Princess Zelda', 'ゼルダ', 'ぜるだ', 'zeruda', 'games', '👑', '#fbbf24',
    { en: 'A princess whose name is in the title of her series.', it: 'Una principessa il cui nome è nel titolo della sua serie.' },
    { ja: '伝説', reading: 'でんせつ', en: 'legend', it: 'leggenda' }),
  c('mario', 'Mario', 'マリオ', 'まりお', 'mario', 'games', '🍄', '#ef4444',
    { en: 'The world\'s most famous plumber hero.', it: 'L\'eroe idraulico più famoso del mondo.' },
    { ja: '有名', reading: 'ゆうめい', en: 'famous', it: 'famoso' }),
  c('link', 'Link', 'リンク', 'りんく', 'rinku', 'games', '🗡', '#22c55e',
    { en: 'The legendary hero who carries a master sword.', it: 'Il leggendario eroe che impugna una spada suprema.' },
    { ja: '勇者', reading: 'ゆうしゃ', en: 'hero', it: 'eroe' }, 'Link (The Legend of Zelda)'),
  c('pikachu', 'Pikachu', 'ピカチュウ', 'ぴかちゅう', 'pikachuu', 'games', '⚡', '#fbbf24',
    { en: 'A yellow creature that uses electric attacks.', it: 'Una creatura gialla che usa attacchi elettrici.' },
    { ja: '電気', reading: 'でんき', en: 'electric', it: 'elettrico' }),
  c('morrigan', 'Morrigan Aensland', 'モリガン', 'もりがん', 'morigan', 'games', '🦇', '#22c55e',
    { en: 'A succubus from the demon realm with bat-like wings on her head and back.', it: 'Una succube del regno dei demoni con ali da pipistrello sulla testa e sulla schiena.' },
    { ja: '夜', reading: 'よる', en: 'night', it: 'notte' }),
  c('shimon', 'Simon Belmont', 'シモン・ベルモンド', 'しもんべるもんど', 'shimon berumondo', 'games', '⛓', '#b45309',
    { en: 'A classic vampire hunter armed with a legendary whip.', it: 'Un classico cacciatore di vampiri armato di una leggendaria frusta.' },
    { ja: '鞭', reading: 'むち', en: 'whip', it: 'frusta' }),
  c('terry', 'Terry Bogard', 'テリー・ボガード', 'てりーぼがーど', 'terii bogaado', 'games', '🧢', '#ef4444',
    { en: 'A legendary fighter known as the hungry wolf who asks if you are okay.', it: 'Un leggendario combattente noto come il lupo solitario che chiede se stai bene.' },
    { ja: '狼', reading: 'おおかみ', en: 'wolf', it: 'lupo' }),
  c('kazuya', 'Kazuya Mishima', '三島一八', 'みしまかずや', 'mishima kazuya', 'games', '😈', '#991b1b',
    { en: 'A martial artist possessed by a devil, known for throwing his father off a cliff.', it: 'Un artista marziale posseduto da un diavolo, noto per aver gettato suo padre da un dirupo.' },
    { ja: '崖', reading: 'がけ', en: 'cliff', it: 'dirupo' }),
  c('heihachi', 'Heihachi Mishima', '三島平八', 'みしまへいはち', 'mishima heihachi', 'games', '⚡', '#475569',
    { en: 'An old but immensely strong martial artist who hosts a grand tournament.', it: 'Un anziano ma immensamente forte artista marziale che organizza un grande torneo.' },
    { ja: '鉄', reading: 'てつ', en: 'iron', it: 'ferro' }),
  c('2b', '2B', '2B', 'とぅーびー', 'tuu bii', 'games', '🤖', '#000000',
    { en: 'A combat android who wears a distinctive black blindfold.', it: 'Un androide da combattimento che indossa una caratteristica benda nera.' },
    { ja: '機械', reading: 'きかい', en: 'machine', it: 'macchina' }, '2B (NieR: Automata)'),
  c('shulk', 'Shulk', 'シュルク', 'しゅるく', 'shuruku', 'games', '🗡', '#ef4444',
    { en: 'A boy who wields a unique sword that grants him visions of the future.', it: 'Un ragazzo che brandisce una spada unica che gli conferisce visioni del futuro.' },
    { ja: '未来', reading: 'みらい', en: 'future', it: 'futuro' }),
  c('lucina', 'Lucina', 'ルキナ', 'るきな', 'rukina', 'games', '🦋', '#3b82f6',
    { en: 'A time-traveling princess who wields her father\'s sacred sword.', it: 'Una principessa che viaggia nel tempo e impugna la spada sacra di suo padre.' },
    { ja: '時間', reading: 'じかん', en: 'time', it: 'tempo' }),
  c('marth', 'Marth', 'マルス', 'まるす', 'marusu', 'games', '👑', '#3b82f6',
    { en: 'The original hero-king who wields a divine sword to slay dragons.', it: 'L\'originale re eroe che impugna una spada divina per uccidere i draghi.' },
    { ja: '英雄', reading: 'えいゆう', en: 'hero', it: 'eroe' }),
  c('jill', 'Jill Valentine', 'ジル・バレンタイン', 'じるばれんたいん', 'jiru barentain', 'games', '🔫', '#3b82f6',
    { en: 'A special forces agent who survived a mansion full of zombies.', it: 'Un\'agente delle forze speciali sopravvissuta in una villa piena di zombi.' },
    { ja: '生存', reading: 'せいぞん', en: 'survival', it: 'sopravvivenza' }),
  c('chris', 'Chris Redfield', 'クリス・レッドフィールド', 'くりすれっどふぃーるど', 'kurisu reddofiirudo', 'games', '🪨', '#22c55e',
    { en: 'A strong agent famous for punching a giant boulder.', it: 'Un forte agente famoso per aver preso a pugni un masso gigante.' },
    { ja: '筋肉', reading: 'きんにく', en: 'muscle', it: 'muscolo' }),
  c('leon', 'Leon S. Kennedy', 'レオン・S・ケネディ', 'れおんえすけねでぃ', 'reon esu kenedi', 'games', '👮', '#38bdf8',
    { en: 'A rookie cop whose first day involved a zombie outbreak.', it: 'Una recluta poliziotto il cui primo giorno includeva un\'epidemia di zombi.' },
    { ja: '警察', reading: 'けいさつ', en: 'police', it: 'polizia' }),
  c('kiryu', 'Kazuma Kiryu', '桐生一馬', 'きりゅうかずま', 'kiryuu kazuma', 'games', '🐉', '#ef4444',
    { en: 'A legendary former gangster known as a dragon.', it: 'Un leggendario ex gangster noto come un drago.' },
    { ja: '龍', reading: 'りゅう', en: 'dragon', it: 'drago' }),
  c('majima', 'Goro Majima', '真島吾朗', 'まじまごろう', 'majima gorou', 'games', '🗡', '#fbbf24',
    { en: 'A chaotic gangster known as a mad dog who wears an eyepatch.', it: 'Un gangster caotico noto come cane pazzo che indossa una benda sull\'occhio.' },
    { ja: '狂気', reading: 'きょうき', en: 'madness', it: 'follia' }),
  c('chunli', 'Chun-Li', '春麗', 'ちゅんりー', 'chunrii', 'games', '🦵', '#3b82f6',
    { en: 'A martial artist known for her rapid kicking techniques.', it: 'Un\'esperta di arti marziali nota per le sue tecniche di calci rapidi.' },
    { ja: '脚', reading: 'あし', en: 'leg', it: 'gamba' }),
  c('ryu', 'Ryu', 'リュウ', 'りゅう', 'ryuu', 'games', '🥋', '#ffffff',
    { en: 'A wandering martial artist who throws energy projectiles.', it: 'Un artista marziale errante che lancia proiettili di energia.' },
    { ja: '波動', reading: 'はどう', en: 'wave', it: 'onda' }, 'Ryu (Street Fighter)'),
  c('bayonetta', 'Bayonetta', 'ベヨネッタ', 'べよねった', 'beyonetta', 'games', '👠', '#000000',
    { en: 'A stylish witch who fights using guns on her high heels.', it: 'Una strega elegante che combatte usando pistole sui tacchi alti.' },
    { ja: '魔女', reading: 'まじょ', en: 'witch', it: 'strega' }),
  c('dante', 'Dante', 'ダンテ', 'だんて', 'dante', 'games', '🍕', '#ef4444',
    { en: 'A demon hunter in a red coat who loves pizza.', it: 'Un cacciatore di demoni in cappotto rosso che ama la pizza.' },
    { ja: '悪魔', reading: 'あくま', en: 'demon', it: 'demone' }),
  c('vergil', 'Vergil', 'バージル', 'ばーじる', 'baajiru', 'games', '🗡', '#3b82f6',
    { en: 'A demon hunter in a blue coat seeking absolute power.', it: 'Un cacciatore di demoni in cappotto blu che cerca il potere assoluto.' },
    { ja: '力', reading: 'ちから', en: 'power', it: 'potere' }),
  c('joker', 'Joker', 'ジョーカー', 'じょーかー', 'jookaa', 'games', '🎭', '#000000',
    { en: 'A phantom thief who infiltrates corrupted hearts.', it: 'Un ladro fantasma che si infiltra nei cuori corrotti.' },
    { ja: '泥棒', reading: 'どろぼう', en: 'thief', it: 'ladro' }, 'Joker (Persona)'),
  c('rockman', 'Mega Man (Rockman)', 'ロックマン', 'ろっくまん', 'rokkuman', 'games', '🤖', '#3b82f6',
    { en: 'A blue robot who copies the weapons of defeated foes.', it: 'Un robot blu che copia le armi dei nemici sconfitti.' },
    { ja: '岩', reading: 'いわ', en: 'rock', it: 'roccia' }, 'Mega Man (character)'),
  c('samus', 'Samus Aran', 'サムス・アラン', 'さむすあらん', 'samusu aran', 'games', '🚀', '#f97316',
    { en: 'A lone bounty hunter wearing a powerful orange armor suit.', it: 'Una cacciatrice di taglie solitaria che indossa una potente armatura arancione.' },
    { ja: '狩人', reading: 'かりゅうど', en: 'hunter', it: 'cacciatore' }),
  c('donkeykong', 'Donkey Kong', 'ドンキーコング', 'どんきーこんぐ', 'donkii kongu', 'games', '🦍', '#a16207',
    { en: 'A strong ape who wears a signature red necktie.', it: 'Un forte primate che indossa una caratteristica cravatta rossa.' },
    { ja: '猿', reading: 'さる', en: 'monkey', it: 'scimmia' }, 'Donkey Kong (character)'),
  c('kinopio', 'Toad (Kinopio)', 'キノピオ', 'きのぴお', 'kinopio', 'games', '🍄', '#ef4444',
    { en: 'A loyal mushroom attendant who helps the hero.', it: 'Un leale servitore fungo che aiuta l\'eroe.' },
    { ja: '茸', reading: 'きのこ', en: 'mushroom', it: 'fungo' }, 'Toad (Nintendo)'),
  c('yoshi', 'Yoshi', 'ヨッシー', 'よっしー', 'yosshii', 'games', '🦖', '#22c55e',
    { en: 'A friendly green dinosaur who eats apples and enemies.', it: 'Un amichevole dinosauro verde che mangia mele e nemici.' },
    { ja: '恐竜', reading: 'きょうりゅう', en: 'dinosaur', it: 'dinosauro' }),
  c('sora', 'Sora', 'ソラ', 'そら', 'sora', 'games', '🗝', '#fbbf24',
    { en: 'A cheerful boy chosen by a magical key-shaped weapon.', it: 'Un ragazzo allegro scelto da una magica arma a forma di chiave.' },
    { ja: '空', reading: 'そら', en: 'sky', it: 'cielo' }, 'Sora (Kingdom Hearts)'),
  c('riku', 'Riku', 'リク', 'りく', 'riku', 'games', '⚔', '#94a3b8',
    { en: 'A silver-haired boy who walked the path of dawn.', it: 'Un ragazzo dai capelli argentati che ha percorso il sentiero dell\'alba.' },
    { ja: '陸', reading: 'りく', en: 'land', it: 'terra' }),
  c('kairi', 'Kairi', 'カイリ', 'かいり', 'kairi', 'games', '🌅', '#f472b6',
    { en: 'A princess of heart originating from destiny islands.', it: 'Una principessa del cuore originaria delle isole del destino.' },
    { ja: '海', reading: 'うみ', en: 'sea', it: 'mare' }),
  c('tifa', 'Tifa', 'ティファ', 'てぃふぁ', 'tifa', 'games', '🥊', '#ef4444',
    { en: 'A martial artist who fights with her fists.', it: 'Un\'esperta di arti marziali che combatte con i pugni.' },
    { ja: '拳', reading: 'こぶし', en: 'fist', it: 'pugno' }, 'Tifa Lockhart'),
  c('aerith', 'Aerith', 'エアリス', 'えありす', 'earisu', 'games', '🌸', '#f472b6',
    { en: 'A gentle flower girl with magical powers.', it: 'Una dolce fioraia con poteri magici.' },
    { ja: '花', reading: 'はな', en: 'flower', it: 'fiore' }, 'Aerith Gainsborough'),
  c('snake', 'Solid Snake', 'ソリッド・スネーク', 'そりっどすねーく', 'soriddo suneeku', 'games', '📦', '#475569',
    { en: 'A stealth operative who often hides in cardboard boxes.', it: 'Un agente furtivo che spesso si nasconde in scatole di cartone.' },
    { ja: '蛇', reading: 'へび', en: 'snake', it: 'serpente' }, 'Solid Snake'),
  c('sephiroth', 'Sephiroth', 'セフィロス', 'せふぃろす', 'sefirosu', 'games', '🪽', '#000000',
    { en: 'A fallen hero with a long katana and one black wing.', it: 'Un eroe caduto con una lunga katana e un\'ala nera.' },
    { ja: '絶望', reading: 'ぜつぼう', en: 'despair', it: 'disperazione' }),
  c('cloud', 'Cloud', 'クラウド', 'くらうど', 'kuraudo', 'games', '🗡', '#fbbf24',
    { en: 'A mercenary with spiked hair and a huge sword.', it: 'Un mercenario con i capelli a punta e una spada enorme.' },
    { ja: '雲', reading: 'くも', en: 'cloud', it: 'nuvola' }, 'Cloud Strife'),
  c('pacman', 'Pac-Man', 'パックマン', 'ぱっくまん', 'pakkuman', 'games', '🟡', '#fbbf24',
    { en: 'A yellow hero who eats dots and runs from colorful ghosts.', it: 'Un eroe giallo che mangia pallini e fugge da fantasmi colorati.' },
    { ja: '幽霊', reading: 'ゆうれい', en: 'ghost', it: 'fantasma' }),
  c('sonic', 'Sonic', 'ソニック', 'そにっく', 'sonikku', 'games', '🦔', '#3b82f6',
    { en: 'A famous blue hedgehog who runs at supersonic speeds.', it: 'Un famoso riccio blu che corre a velocità supersonica.' },
    { ja: '速い', reading: 'はやい', en: 'fast', it: 'veloce' }, 'Sonic the Hedgehog (character)'),

  // --- ANIME (Ordered Least to Most Popular, Mixed Categories) ---
  c('mari', 'Mari Illustrious Makinami', '真希波・マリ・イラストリアス', 'まきなみまりいらすとりあす', 'makinami mari irasutoriasu', 'anime', '👓', '#ec4899',
    { en: 'A mysterious pilot of giant robots.', it: 'Una misteriosa pilota di robot giganti.' },
    { ja: '歌', reading: 'うた', en: 'song', it: 'canzone' }),
  c('suneo', 'Suneo Honekawa', '骨川スネ夫', 'ほねかわすねお', 'honekawa suneo', 'anime', '🏙', '#22c55e',
    { en: 'The wealthy and boastful friend of a lazy boy.', it: 'Il ricco e vanitoso amico di un ragazzo pigro.' },
    { ja: '金', reading: 'かね', en: 'money', it: 'soldi' }),
  c('shinobu', 'Shinobu Kocho', '胡蝶しのぶ', 'こちょうしのぶ', 'kochou shinobu', 'anime', '🦋', '#a855f7',
    { en: 'A high-ranking warrior who masters poisons.', it: 'Una guerriera di alto rango esperta nei veleni.' },
    { ja: '毒', reading: 'どく', en: 'poison', it: 'veleno' }),
  c('mina', 'Sailor Venus (Minako)', '愛野美奈子', 'あいのみなこ', 'aino minako', 'anime', '💛', '#fbbf24',
    { en: 'The leader of a team of planetary guardians.', it: 'La leader di un team di guardiani planetari.' },
    { ja: '愛', reading: 'あい', en: 'love', it: 'amore' }, 'Sailor Venus'),
  c('luka', 'Megurine Luka', '巡音ルカ', 'めぐりねるか', 'megurine ruka', 'anime', '🐙', '#f9a8d4',
    { en: 'A virtual singer with a mature, husky voice.', it: 'Una cantante virtuale dalla voce matura e roca.' },
    { ja: '巡', reading: 'めぐり', en: 'travel', it: 'viaggio' }),
  c('inosuke', 'Inosuke Hashibira', '嘴平伊之助', 'はしびらいのすけ', 'hashibira inosuke', 'anime', '🐗', '#475569',
    { en: 'A wild warrior who wears a boar mask.', it: 'Un guerriero selvaggio che indossa una maschera da cinghiale.' },
    { ja: '猪', reading: 'いのしし', en: 'boar', it: 'cinghiale' }),
  c('mako', 'Sailor Jupiter (Makoto)', '木野まこと', 'きのまこと', 'kino makoto', 'anime', '⚡', '#22c55e',
    { en: 'A strong and tall guardian of thunder.', it: 'Una forte e alta guardiana del tuono.' },
    { ja: '雷', reading: 'かみなり', en: 'thunder', it: 'tuono' }, 'Sailor Jupiter'),
  c('kaito', 'Kaito', 'KAITO', 'かいと', 'kaito', 'anime', '🍦', '#3b82f6',
    { en: 'A popular virtual singer associated with blue.', it: 'Un popolare cantante virtuale associato al blu.' },
    { ja: '氷', reading: 'こおり', en: 'ice', it: 'ghiaccio' }),
  c('san', 'Princess Mononoke (San)', 'サン', 'さん', 'san', 'anime', '🐺', '#991b1b',
    { en: 'A girl raised by wolves who protects a forest.', it: 'Una ragazza cresciuta dai lupi che protegge una foresta.' },
    { ja: '獣', reading: 'けもの', en: 'beast', it: 'bestia' }, 'Princess Mononoke'),
  c('gian', 'Takeshi Goda (Gian)', '剛田武', 'ごうだたけし', 'gouda takeshi', 'anime', '🎤', '#f97316',
    { en: 'A neighborhood bully who loves to sing loudly.', it: 'Un bullo di quartiere che ama cantare a squarciagola.' },
    { ja: '歌', reading: 'うた', en: 'song', it: 'canzone' }),
  c('piccolo', 'Piccolo', 'ピッコロ', 'ぴっころ', 'pikkoro', 'anime', '👺', '#22c55e',
    { en: 'A warrior from another world who became a mentor.', it: 'Un guerriero di un altro mondo diventato un mentore.' },
    { ja: '再生', reading: 'さいせい', en: 'regeneration', it: 'rigenerazione' }),
  c('rei-sailor', 'Sailor Mars (Rei)', '火野レイ', 'ひのれい', 'hino rei', 'anime', '🔥', '#ef4444',
    { en: 'A fiery shrine maiden and planetary guardian.', it: 'Una focosa sacerdotessa e guardiana planetaria.' },
    { ja: '火', reading: 'ひ', en: 'fire', it: 'fuoco' }, 'Sailor Mars'),
  c('rin', 'Kagamine Rin', '鏡音リン', 'かがみねりん', 'kagamine rin', 'anime', '🍊', '#fbbf24',
    { en: 'A virtual singer with a powerful, bright voice.', it: 'Una cantante virtuale dalla voce potente e brillante.' },
    { ja: '鏡', reading: 'かがみ', en: 'mirror', it: 'specchio' }),
  c('chopper', 'Tony Tony Chopper', 'トニートニー・チョッパー', 'とにーとにーちょっぱー', 'tonii tonii choppaa', 'anime', '🦌', '#f9a8d4',
    { en: 'A reindeer doctor who can change forms.', it: 'Una renna dottore che può cambiare forma.' },
    { ja: '医者', reading: 'いしゃ', en: 'doctor', it: 'medico' }, 'Tony Tony Chopper'),
  c('zenitsu', 'Zenitsu Agatsuma', '我妻善逸', 'あがつまぜんいつ', 'agatsuma zenitsu', 'anime', '⚡', '#fbbf24',
    { en: 'A warrior who fights best while asleep.', it: 'Un guerriero che combatte meglio mentre dorme.' },
    { ja: '雷', reading: 'かみなり', en: 'thunder', it: 'tuono' }),
  c('ami', 'Sailor Mercury (Ami)', '水野亜美', 'みずのあみ', 'mizuno ami', 'anime', '💧', '#3b82f6',
    { en: 'The intelligent brain of a group of guardians.', it: 'L\'intelligente cervello di un gruppo di guardiani.' },
    { ja: '知', reading: 'ち', en: 'wisdom', it: 'saggezza' }, 'Sailor Mercury'),
  c('len', 'Kagamine Len', '鏡音レン', 'かがみねれん', 'kagamine ren', 'anime', '🍌', '#fbbf24',
    { en: 'A versatile male virtual singer.', it: 'Un versatile cantante virtuale maschio.' },
    { ja: '音', reading: 'おと', en: 'sound', it: 'suono' }),
  c('howl', 'Howl Pendragon', 'ハウル', 'はうる', 'hauru', 'anime', '🏰', '#38bdf8',
    { en: 'A powerful wizard with a moving castle.', it: 'Un potente mago con un castello errante.' },
    { ja: '城', reading: 'しろ', en: 'castle', it: 'castello' }),
  c('shizuka', 'Shizuka Minamoto', '源静香', 'みなもとしずか', 'minamoto shizuka', 'anime', '🛁', '#f9a8d4',
    { en: 'A smart and kind girl who loves taking baths.', it: 'Una bambina intelligente e gentile che ama fare il bagno.' },
    { ja: '風呂', reading: 'ふろ', en: 'bath', it: 'bagno' }),
  c('sakura', 'Sakura Haruno', '春野サクラ', 'はるのさくら', 'haruno sakura', 'anime', '🌸', '#f472b6',
    { en: 'A skilled medical ninja in a famous team.', it: 'Un ninja medico esperto in un team famoso.' },
    { ja: '医療', reading: 'いりょう', en: 'medical', it: 'medico' }),
  c('misato', 'Misato Katsuragi', '葛城ミサト', 'かつらぎみさと', 'katsuragi misato', 'anime', '🍺', '#6366f1',
    { en: 'A tactical commander of a secret organization.', it: 'Una comandante tattica di un\'organizzazione segreta.' },
    { ja: '指揮', reading: 'しき', en: 'command', it: 'comando' }),
  c('nami', 'Nami', 'ナミ', 'なみ', 'nami', 'anime', '🗺', '#f97316',
    { en: 'A clever navigator of a pirate crew.', it: 'L\'intelligente navigatrice di una ciurma pirata.' },
    { ja: '航海', reading: 'こうかい', en: 'navigation', it: 'navigazione' }, 'Nami (One Piece)'),
  c('gohan', 'Gohan', '孫悟飯', 'そんごはん', 'son gohan', 'anime', '📖', '#f59e0b',
    { en: 'The elder son of a powerful alien hero.', it: 'Il figlio maggiore di un potente eroe alieno.' },
    { ja: '勉強', reading: 'べんきょう', en: 'study', it: 'studio' }),
  c('kiki', 'Kiki', 'キキ', 'きき', 'kiki', 'anime', '🧹', '#6366f1',
    { en: 'A young witch who starts a delivery service.', it: 'Una giovane strega che avvia un servizio di consegne.' },
    { ja: '配達', reading: 'はいたつ', en: 'delivery', it: 'consegna' }, "Kiki's Delivery Service"),
  c('asuka', 'Asuka Langley Soryu', '惣流・アスカ・ラングレー', 'そうりゅうあすからんぐれー', 'souryuu asuka ranguree', 'anime', '🔴', '#ef4444',
    { en: 'A proud and fiery pilot of a giant robot.', it: 'Una fiera e focosa pilota di un robot gigante.' },
    { ja: '誇', reading: 'ほこり', en: 'pride', it: 'orgoglio' }),
  c('nobita', 'Nobita Nobi', '野比のび太', 'のびのびた', 'nobi nobita', 'anime', '👓', '#fbbf24',
    { en: 'A lazy but kind-hearted boy with a robot cat.', it: 'Un ragazzo pigro ma gentile con un gatto robot.' },
    { ja: '昼寝', reading: 'ひるね', en: 'nap', it: 'pisolino' }),
  c('sanji', 'Sanji', 'サンジ', 'さんじ', 'sanji', 'anime', '🍳', '#fbbf24',
    { en: 'A fighting chef of a famous pirate crew.', it: 'Un cuoco combattente di una famosa ciurma pirata.' },
    { ja: '料理', reading: 'りょうり', en: 'cooking', it: 'cucina' }, 'Sanji (One Piece)'),
  c('kakashi', 'Kakashi Hatake', 'はたけカカシ', 'はたけかかし', 'hatake kakashi', 'anime', '📕', '#94a3b8',
    { en: 'A famous teacher of a group of ninjas.', it: 'Un famoso maestro di un gruppo di ninja.' },
    { ja: '先生', reading: 'せんせい', en: 'teacher', it: 'maestro' }),
  c('frieza', 'Frieza', 'フリーザ', 'ふりーざ', 'furiiza', 'anime', '👽', '#a855f7',
    { en: 'A powerful galactic tyrant who destroys planets.', it: 'Un potente tiranno galattico che distrugge pianeti.' },
    { ja: '宇宙', reading: 'うちゅう', en: 'space', it: 'spazio' }),
  c('chihiro', 'Chihiro Ogino', '千尋', 'ちひろ', 'chihiro', 'anime', '⛩', '#f472b6',
    { en: 'A brave girl who enters a world of spirits.', it: 'Una coraggiosa bambina che entra in un mondo di spiriti.' },
    { ja: '名前', reading: 'なまえ', en: 'name', it: 'nome' }),
  c('nezuko', 'Nezuko Kamado', '竈門禰豆子', 'かまどねずこ', 'kamado nezuko', 'anime', '🎋', '#ec4899',
    { en: 'A girl turned into a demon who fights with her brother.', it: 'Una ragazza trasformata in demone che combatte con suo fratello.' },
    { ja: '妹', reading: 'いもうと', en: 'younger sister', it: 'sorella minore' }),
  c('zoro', 'Roronoa Zoro', 'ロロノア・ゾロ', 'ろろのあぞろ', 'roronoa zoro', 'anime', '⚔', '#22c55e',
    { en: 'A swordsman who uses three swords at once.', it: 'Uno spadaccino che usa tre spade contemporaneamente.' },
    { ja: '剣士', reading: 'けんし', en: 'swordsman', it: 'spadaccino' }),
  c('itachi', 'Itachi Uchiha', 'うちはイタチ', 'うちはいたち', 'uchiha itachi', 'anime', '👁', '#ef4444',
    { en: 'A master of illusion who protected his brother.', it: 'Un maestro delle illusioni che ha protetto suo fratello.' },
    { ja: '天才', reading: 'てんさい', en: 'genius', it: 'genio' }),
  c('vegeta', 'Vegeta', 'ベジータ', 'べじーた', 'bejiita', 'anime', '👑', '#3b82f6',
    { en: 'The proud prince of a powerful alien race.', it: 'Il fiero principe di una potente razza aliena.' },
    { ja: '王子', reading: 'おうじ', en: 'prince', it: 'principe' }),
  c('usagi', 'Sailor Moon (Usagi)', '月野うさぎ', 'つきのうさぎ', 'tsukino usagi', 'anime', '🌙', '#ec4899',
    { en: 'A girl who transforms into a lunar guardian.', it: 'Una ragazza che si trasforma in una guardiana lunare.' },
    { ja: '月', reading: 'つき', en: 'moon', it: 'luna' }, 'Sailor Moon (character)'),
  c('rei', 'Rei Ayanami', '綾波レイ', 'あやなみれい', 'ayanami rei', 'anime', '🔵', '#38bdf8',
    { en: 'An enigmatic and quiet pilot of a giant robot.', it: 'Un\'enigmatica e silenziosa pilota di un robot gigante.' },
    { ja: '青', reading: 'あお', en: 'blue', it: 'blu' }),
  c('totoro', 'Totoro', 'トトロ', 'ととろ', 'totoro', 'anime', '🌳', '#10b981',
    { en: 'A large forest spirit who carries an umbrella.', it: 'Un grande spirito della foresta che porta un ombrello.' },
    { ja: '森', reading: 'もり', en: 'forest', it: 'foresta' }, 'My Neighbor Totoro'),
  c('tanjiro', 'Tanjiro Kamado', '竈門炭治郎', 'かまどたんじろう', 'kamado tanjirou', 'anime', '⚔', '#0ea5e9',
    { en: 'A kind-hearted boy who hunts demons.', it: 'Un ragazzo dal cuore gentile che caccia i demoni.' },
    { ja: '家族', reading: 'かぞく', en: 'family', it: 'famiglia' }),
  c('shinji', 'Shinji Ikari', '碇シンジ', 'いかりしんじ', 'ikari shinji', 'anime', '🤖', '#a855f7',
    { en: 'A reluctant hero who pilots a giant machine.', it: 'Un eroe riluttante che pilota una macchina gigante.' },
    { ja: '勇気', reading: 'ゆうき', en: 'courage', it: 'coraggio' }),
  c('sasuke', 'Sasuke Uchiha', 'うちはサスケ', 'うちはさすけ', 'uchiha sasuke', 'anime', '⚡', '#6366f1',
    { en: 'A rival warrior who seeks power and revenge.', it: 'Un guerriero rivale che cerca potere e vendetta.' },
    { ja: '復讐', reading: '復讐', en: 'revenge', it: 'vendetta' }),
  c('luffy', 'Monkey D. Luffy', 'モンキー・D・ルフィ', 'もんきーでぃーるふぃ', 'monkii dii rufi', 'anime', '🏴‍☠', '#ef4444',
    { en: 'A rubber-bodied captain seeking a great treasure.', it: 'Un capitano dal corpo di gomma che cerca un grande tesoro.' },
    { ja: '海賊', reading: 'かいぞく', en: 'pirate', it: 'pirata' }),
  c('miku', 'Hatsune Miku', '初音ミク', 'はつねみく', 'hatsune miku', 'anime', '🎤', '#22d3ee',
    { en: 'The world\'s most popular virtual idol.', it: 'La idol virtuale più famosa del mondo.' },
    { ja: '未来', reading: 'みらい', en: 'future', it: 'futuro' }),
  c('doraemon', 'Doraemon', 'ドラえもん', 'どらえもん', 'doraemon', 'anime', '🐱', '#3b82f6',
    { en: 'A robot cat from the future with magic gadgets.', it: 'Un gatto robot dal futuro con gadget magici.' },
    { ja: '秘密', reading: 'ひみつ', en: 'secret', it: 'segreto' }),
  c('naruto', 'Naruto Uzumaki', 'うずまきナルト', 'うずまきなると', 'uzumaki naruto', 'anime', '🍥', '#f59e0b',
    { en: 'A determined ninja who wants to lead his village.', it: 'Un ninja determinato che vuole guidare il suo villaggio.' },
    { ja: '忍者', reading: 'にんじゃ', en: 'ninja', it: 'ninja' }),
  c('goku', 'Goku', '孫悟空', 'そんごくう', 'son gokuu', 'anime', '🥋', '#f97316',
    { en: 'A powerful warrior who constantly trains to get stronger.', it: 'Un potente guerriero che si allena costantemente per diventare più forte.' },
    { ja: '修行', reading: 'しゅぎょう', en: 'training', it: 'allenamento' }),
  c('edward', 'Edward Elric', 'エドワード・エルリック', 'えどわーどえるりっく', 'edowaado erurikku', 'anime', '🦾', '#ef4444',
    { en: 'A young alchemist with an automail arm seeking a philosopher\'s stone.', it: 'Un giovane alchimista con un braccio automail che cerca una pietra filosofale.' },
    { ja: '鋼', reading: 'はがね', en: 'steel', it: 'acciaio' }),
  c('saitama', 'Saitama', 'サイタマ', 'さいたま', 'saitama', 'anime', '👊', '#fbbf24',
    { en: 'A bald hero who can defeat any opponent with a single punch.', it: 'Un eroe calvo che può sconfiggere qualsiasi avversario con un solo pugno.' },
    { ja: '禿', reading: 'はげ', en: 'bald', it: 'calvo' }),
  c('levi', 'Levi Ackerman', 'リヴァイ', 'りゔぁい', 'rivai', 'anime', '⚔', '#475569',
    { en: 'Humanity\'s strongest soldier who fights giant humanoid titans.', it: 'Il soldato più forte dell\'umanità che combatte contro giganti umanoidi.' },
    { ja: '兵士', reading: 'へいし', en: 'soldier', it: 'soldato' }),
  c('eren', 'Eren Yeager', 'エレン・イェーガー', 'えれんいえーがー', 'eren yeegaa', 'anime', '🗝', '#b45309',
    { en: 'A boy who vows to eradicate the giant titans that destroyed his home.', it: 'Un ragazzo che giura di sradicare i giganti che hanno distrutto la sua casa.' },
    { ja: '自由', reading: 'じゆう', en: 'freedom', it: 'libertà' }),
  c('gojo', 'Satoru Gojo', '五条悟', 'ごじょうさとる', 'gojou satoru', 'anime', '🤞', '#3b82f6',
    { en: 'An incredibly powerful sorcerer who wears a blindfold and has limitless abilities.', it: 'Uno stregone incredibilmente potente che indossa una benda e ha abilità illimitate.' },
    { ja: '無限', reading: 'むげん', en: 'infinity', it: 'infinito' })
];

export interface FChoice {
  text?: string;
  en?: string;
  it?: string;
  correct: boolean;
}

export interface FQuestion {
  instruction: Localized;
  show?: string;
  options: FChoice[];
}

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const POPULAR_IDS = ['pikachu', 'goku', 'naruto', 'luffy', 'mario', 'miku', 'doraemon', 'link', 'totoro', 'usagi', 'shinji', 'tanjiro', 'charizard', 'mewtwo', 'vegeta', 'sonic', 'cloud', 'sephiroth', 'pacman', 'snake', 'ryu', 'gojo', 'saitama', 'levi', 'eren', 'edward'];

export function buildCharChallenge(ch: FictionalChar): FQuestion[] {
  const others = CHARACTERS_FICTIONAL.filter((x) => x.id !== ch.id);
  const popIndex = POPULAR_IDS.indexOf(ch.id);
  const isPopular = popIndex !== -1;
  
  let numQuestions = 3;
  if (isPopular) {
    numQuestions += Math.floor((popIndex / POPULAR_IDS.length) * 7);
  }
  const optionsCount = isPopular ? 5 : 3;

  // Pseudo-random based on character ID to keep formats consistent on retry
  const seed = ch.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getFormat = (index: number) => (seed + index) % 5;

  // Select the traits we will test in this challenge
  const testedTraits = [ch.trait];
  const shuffledOthers = shuffle(others);
  for (let i = 0; i < numQuestions - 2; i++) {
    testedTraits.unshift(shuffledOthers[i].trait);
  }

  // Pool of distractors that are NOT part of the tested traits
  const safeDistractors = CHARACTERS_FICTIONAL.filter(
    (x) => !testedTraits.some(t => t.ja === x.trait.ja)
  );

  const questions: FQuestion[] = [];

  for (let i = 0; i < numQuestions - 1; i++) {
    const format = getFormat(i);
    const targetTrait = testedTraits[i];
    const isMainTrait = i === numQuestions - 2;

    const prefixEn = isMainTrait ? "This mystery character is associated with this word." : "Vocabulary Check:";
    const prefixIt = isMainTrait ? "Questo personaggio misterioso è associato a questa parola." : "Controllo Vocabolario:";

    if (format === 0) {
      const wrongs = shuffle(safeDistractors).slice(0, optionsCount - 1).map(x => ({ en: x.trait.en, it: x.trait.it, correct: false }));
      questions.push({
        instruction: {
          en: `${prefixEn} What does it mean?`,
          it: `${prefixIt} Cosa significa?`
        },
        show: targetTrait.ja,
        options: shuffle([{ en: targetTrait.en, it: targetTrait.it, correct: true }, ...wrongs])
      });
    } else if (format === 1) {
      const wrongs = shuffle(safeDistractors).slice(0, optionsCount - 1).map(x => ({ text: x.trait.ja, correct: false }));
      questions.push({
        instruction: {
          en: `${prefixEn} Which Japanese word means "${targetTrait.en}"?`,
          it: `${prefixIt} Quale parola giapponese significa "${targetTrait.it}"?`
        },
        options: shuffle([{ text: targetTrait.ja, correct: true }, ...wrongs])
      });
    } else if (format === 2) {
      const wrongs = shuffle(safeDistractors).slice(0, optionsCount - 1).map(x => ({ text: x.trait.reading, correct: false }));
      questions.push({
        instruction: {
          en: `${prefixEn} How do you read it?`,
          it: `${prefixIt} Come si legge?`
        },
        show: targetTrait.ja,
        options: shuffle([{ text: targetTrait.reading, correct: true }, ...wrongs])
      });
    } else if (format === 3) {
      const wrongs = shuffle(safeDistractors).slice(0, optionsCount - 1).map(x => ({ en: x.trait.en, it: x.trait.it, correct: false }));
      questions.push({
        instruction: {
          en: `${prefixEn} What does the reading "${targetTrait.reading}" mean?`,
          it: `${prefixIt} Cosa significa la lettura "${targetTrait.reading}"?`
        },
        options: shuffle([{ en: targetTrait.en, it: targetTrait.it, correct: true }, ...wrongs])
      });
    } else {
      const wrongs = shuffle(safeDistractors).slice(0, optionsCount - 1).map(x => ({ text: x.trait.reading, correct: false }));
      questions.push({
        instruction: {
          en: `${prefixEn} What is the reading for "${targetTrait.en}"?`,
          it: `${prefixIt} Qual è la lettura di "${targetTrait.it}"?`
        },
        options: shuffle([{ text: targetTrait.reading, correct: true }, ...wrongs])
      });
    }
  }

  // --- Q Final: Name Reading (Hard - Final Reveal) ---
  const nameWrong = others.slice(0, optionsCount - 1).map((o) => ({ text: o.romaji, correct: false }));
  questions.push({
    instruction: {
      en: 'The identity is revealed! Match the name to its reading:',
      it: 'L\'identità è svelata! Abbina il nome alla sua lettura:'
    },
    show: ch.ja,
    options: shuffle([{ text: ch.romaji, correct: true }, ...nameWrong])
  });

  return questions;
}

export interface FLesson {
  vocab: { jp: string; reading: string; meaning: Localized }[];
  tip: Localized;
}

export function buildCharLesson(ch: FictionalChar): FLesson {
  const isKatakana = /[゠-ヿ]/.test(ch.ja) && !/[一-鿿]/.test(ch.ja);
  return {
    vocab: [{ jp: ch.ja, reading: ch.reading, meaning: { en: ch.name, it: ch.name } }],
    tip: isKatakana
      ? {
          en: 'This name is written in katakana — the script used for foreign or invented words. Sound out each symbol.',
          it: 'Questo nome è in katakana — la scrittura per parole straniere o inventate. Pronuncia ogni simbolo.'
        }
      : {
          en: 'Read each kanji/kana in order using the reading shown. Japanese family names usually come first.',
          it: 'Leggi ogni kanji/kana in ordine con la lettura mostrata. Il cognome di solito viene prima.'
        }
  };
}
