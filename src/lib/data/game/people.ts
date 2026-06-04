// Real Japanese pop-culture & historical figures. We store ONLY names + the
// (authored) challenge data; bios and photos are fetched live from Wikipedia at
// runtime (see wiki.ts). Each person's challenge is specific to them: read
// their name, understand their job, etc.
import type { Localized } from '../../game/tracks';

export type PersonCategory =
  | 'music'
  | 'film'
  | 'anime'
  | 'games'
  | 'sports'
  | 'literature'
  | 'history'
  | 'art';

export interface RealPerson {
  id: string;
  name: string; // display / English name
  wiki: string; // Wikipedia article title (for the live bio)
  ja: string; // real Japanese name
  reading: string; // kana reading
  romaji: string;
  category: PersonCategory;
  role: string; // Key into ROLES
  trait: { ja: string; reading: string; en: string; it: string };
  fact?: Localized;
  xp: number;
}

export interface RoleDef {
  en: string;
  it: string;
  ja: string;
  reading: string;
}

export const ROLES: Record<string, RoleDef> = {
  musician: { en: 'Musician', it: 'Musicista', ja: '音楽家', reading: 'おんがくか' },
  singer: { en: 'Singer', it: 'Cantante', ja: '歌手', reading: 'かしゅ' },
  composer: { en: 'Composer', it: 'Compositore', ja: '作曲家', reading: 'さっきょくか' },
  actor: { en: 'Actor', it: 'Attore', ja: '俳優', reading: 'はいゆう' },
  director: { en: 'Director', it: 'Regista', ja: '監督', reading: 'かんとく' },
  mangaka: { en: 'Manga Artist', it: 'Mangaka', ja: '漫画家', reading: 'まんがか' },
  gamedev: { en: 'Game Designer', it: 'Game Designer', ja: 'ゲームデザイナー', reading: 'げーむでざいなー' },
  athlete: { en: 'Athlete', it: 'Atleta', ja: '選手', reading: 'せんしゅ' },
  author: { en: 'Author', it: 'Autore', ja: '作家', reading: 'さっか' },
  educator: { en: 'Educator', it: 'Educatore', ja: '教育者', reading: 'きょういくしゃ' },
  warlord: { en: 'Warlord', it: 'Signore della guerra', ja: '武将', reading: 'ぶしょう' },
  painter: { en: 'Painter', it: 'Pittore', ja: '画家', reading: 'がか' }
};

const p = (
  id: string,
  name: string,
  ja: string,
  reading: string,
  romaji: string,
  category: PersonCategory,
  role: string,
  trait: { ja: string; reading: string; en: string; it: string },
  fact?: Localized,
  wiki?: string
): RealPerson => ({ id, name, wiki: wiki ?? name, ja, reading, romaji, category, role, trait, fact, xp: 60 });

export const PEOPLE: RealPerson[] = [
  // Reordered: LEAST to MOST popular per category

  // Music
  p('kyary', 'Kyary Pamyu Pamyu', 'きゃりーぱみゅぱみゅ', 'きゃりーぱみゅぱみゅ', 'kyary pamyu pamyu', 'music', 'singer',
    { ja: '派手', reading: 'はで', en: 'flashy', it: 'appariscente' },
    { en: 'Known as the "Harajuku Pop Princess".', it: 'Conosciuta come la "Principessa del Pop di Harajuku".' }),
  p('mariya', 'Mariya Takeuchi', '竹内まりや', 'たけうちまりや', 'takeuchi mariya', 'music', 'singer',
    { ja: '都市', reading: 'とし', en: 'city', it: 'città' },
    { en: 'A key figure in the Japanese city pop genre.', it: 'Una figura chiave nel genere city pop giapponese.' }),
  p('ayumi', 'Ayumi Hamasaki', '浜崎あゆみ', 'はまさきあゆみ', 'hamasaki ayumi', 'music', 'singer',
    { ja: '歌姫', reading: 'うたひめ', en: 'diva', it: 'diva' },
    { en: 'One of the best-selling Japanese solo artists of all time.', it: 'Una delle artiste soliste giapponesi con più vendite di tutti i tempi.' }),
  p('yonezu', 'Kenshi Yonezu', '米津玄師', 'よねづけんし', 'yonezu kenshi', 'music', 'singer',
    { ja: '独特', reading: 'どくとく', en: 'unique', it: 'unico' },
    { en: 'His song "Lemon" is one of the most viewed Japanese music videos.', it: 'La sua canzone "Lemon" è uno dei video musicali giapponesi più visti.' }),
  p('utada', 'Hikaru Utada', '宇多田ヒカル', 'うただひかる', 'utada hikaru', 'music', 'singer',
    { ja: '名声', reading: 'めいせい', en: 'fame', it: 'fama' },
    { en: 'J-pop superstar known for the Kingdom Hearts themes.', it: 'Superstar del J-pop nota per i temi di Kingdom Hearts.' }),
  p('hisai-j', 'Joe Hisaishi', '久石譲', 'ひさいしじょう', 'hisaishi jou', 'music', 'composer',
    { ja: '感動', reading: 'かんどう', en: 'emotional', it: 'emozionante' },
    { en: 'Legendary composer for Studio Ghibli films.', it: 'Leggendario compositore per i film dello Studio Ghibli.' }),
  p('sak-r', 'Ryuichi Sakamoto', '坂本龍一', 'さかもとりゅういち', 'sakamoto ryuichi', 'music', 'composer',
    { ja: '電子', reading: 'でんし', en: 'electronic', it: 'elettronico' },
    { en: 'Pioneering electronic musician and Oscar-winning composer.', it: 'Pioniere della musica elettronica e compositore premio Oscar.' }),

  // Film / TV
  p('abe-h', 'Hiroshi Abe', '阿部寛', 'あべひろし', 'abe hiroshi', 'film', 'actor',
    { ja: '背が高い', reading: 'せがたかい', en: 'tall', it: 'alto' },
    { en: 'Known for roles in Still Walking and Thermae Romae.', it: 'Noto per i ruoli in Aruitemo aruitemo e Thermae Romae.' }, 'Hiroshi Abe (actor)'),
  p('ishihara', 'Satomi Ishihara', '石原さとみ', 'いしはらさとみ', 'ishihara satomi', 'film', 'actor',
    { ja: '人気', reading: 'にんき', en: 'popular', it: 'popolare' }),
  p('koreeda', 'Hirokazu Kore-eda', '是枝裕和', 'これえだひろかず', 'koreeda hirokazu', 'film', 'director',
    { ja: '家族', reading: 'かぞく', en: 'family', it: 'famiglia' },
    { en: 'Palme d\'Or winning director of Shoplifters.', it: 'Regista vincitore della Palma d\'oro per Un affare di famiglia.' }),
  p('watanabe', 'Ken Watanabe', '渡辺謙', 'わたなべけん', 'watanabe ken', 'film', 'actor',
    { ja: '威厳', reading: 'いげん', en: 'dignity', it: 'dignità' },
    { en: 'Acclaimed actor known for The Last Samurai and Inception.', it: 'Attore acclamato noto per L\'ultimo samurai e Inception.' }),
  p('kitano', 'Takeshi Kitano', '北野武', 'きたのたけし', 'kitano takeshi', 'film', 'director',
    { ja: '暴力', reading: 'ぼうりょく', en: 'violence', it: 'violenza' },
    { en: 'Renowned director also known as "Beat" Takeshi.', it: 'Famoso regista noto anche come "Beat" Takeshi.' }),
  p('mifune', 'Toshiro Mifune', '三船敏郎', 'みふねとしろう', 'mifune toshirou', 'film', 'actor',
    { ja: '侍', reading: 'さむらい', en: 'samurai', it: 'samurai' },
    { en: 'Famed for his legendary collaborations with Akira Kurosawa.', it: 'Famoso per le sue leggendarie collaborazioni con Akira Kurosawa.' }),
  p('kuro-a', 'Akira Kurosawa', '黒澤明', 'くろさわあきら', 'kurosawa akira', 'film', 'director',
    { ja: '巨匠', reading: 'きょしょう', en: 'master', it: 'maestro' },
    { en: 'One of the most influential filmmakers in history.', it: 'Uno dei registi più influenti della storia.' }),

  // Anime / Manga
  p('horikoshi', 'Kohei Horikoshi', '堀越耕平', 'ほりこしこうへい', 'horikoshi kohei', 'anime', 'mangaka',
    { ja: '個性', reading: 'こせい', en: 'quirk/individuality', it: 'individualità' },
    { en: 'Creator of My Hero Academia.', it: 'Creatore di My Hero Academia.' }),
  p('takahashi', 'Rumiko Takahashi', '高橋留美子', 'たかはしるみこ', 'takahashi rumiko', 'anime', 'mangaka',
    { ja: '犬', reading: 'いぬ', en: 'dog', it: 'cane' },
    { en: 'Creator of Inuyasha and Ranma ½.', it: 'Creatrice di Inuyasha e Ranma ½.' }),
  p('shinkai', 'Makoto Shinkai', '新海誠', 'しんかいまこと', 'shinkai makoto', 'anime', 'director',
    { ja: '彗星', reading: 'すいせい', en: 'comet', it: 'cometa' },
    { en: 'Director of the global blockbuster Your Name.', it: 'Regista del blockbuster globale Your Name.' }),
  p('arakawa', 'Hiromu Arakawa', '荒川弘', 'あらかわひろむ', 'arakawa hiromu', 'anime', 'mangaka',
    { ja: '等価交換', reading: 'とうかこうかん', en: 'equivalent exchange', it: 'scambio equivalente' },
    { en: 'Creator of Fullmetal Alchemist.', it: 'Creatrice di Fullmetal Alchemist.' }),
  p('togashi', 'Yoshihiro Togashi', '冨樫義博', 'とがしよしひろ', 'togashi yoshihiro', 'anime', 'mangaka',
    { ja: '休載', reading: 'きゅうさい', en: 'hiatus', it: 'pausa' },
    { en: 'Creator of YuYu Hakusho and Hunter × Hunter.', it: 'Creatore di YuYu Hakusho e Hunter × Hunter.' }),
  p('anno', 'Hideaki Anno', '庵野秀明', 'あんのひであき', 'anno hideaki', 'anime', 'director',
    { ja: '絶望', reading: 'ぜつぼう', en: 'despair', it: 'disperazione' },
    { en: 'Creator of the influential Neon Genesis Evangelion.', it: 'Creatore dell\'influente Neon Genesis Evangelion.' }),
  p('toriyama', 'Akira Toriyama', '鳥山明', 'とりやまあきら', 'toriyama akira', 'anime', 'mangaka',
    { ja: '竜', reading: 'りゅう', en: 'dragon', it: 'drago' },
    { en: 'The legendary creator of Dragon Ball.', it: 'Il leggendario creatore di Dragon Ball.' }),
  p('oda-e', 'Eiichiro Oda', '尾田栄一郎', 'おだえいいちろう', 'oda eiichiro', 'anime', 'mangaka',
    { ja: '冒険', reading: 'ぼうけん', en: 'adventure', it: 'avventura' },
    { en: 'The mastermind behind the epic series One Piece.', it: 'La mente dietro l\'epica serie One Piece.' }),
  p('miya-h', 'Hayao Miyazaki', '宮崎駿', 'みやざきはやお', 'miyazaki hayao', 'anime', 'director',
    { ja: '空想', reading: 'くうそう', en: 'fantasy', it: 'fantasia' },
    { en: 'Co-founder of Studio Ghibli and animation legend.', it: 'Cofondatore dello Studio Ghibli e leggenda dell\'animazione.' }),

  // Games
  p('naka', 'Yuji Naka', '中裕司', 'なかゆうじ', 'naka yuji', 'games', 'gamedev',
    { ja: '速度', reading: 'そくど', en: 'speed', it: 'velocità' },
    { en: 'Lead programmer of the original Sonic the Hedgehog.', it: 'Programmatore principale dell\'originale Sonic the Hedgehog.' }, 'Yuji Naka'),
  p('uematsu', 'Nobuo Uematsu', '植松伸夫', 'うえまつのぶお', 'uematsu nobuo', 'games', 'composer',
    { ja: '幻想', reading: 'げんそう', en: 'fantasy', it: 'fantasia' },
    { en: 'Famed composer for the Final Fantasy series.', it: 'Celebre compositore per la serie Final Fantasy.' }),
  p('sakaguchi', 'Hironobu Sakaguchi', '坂口博信', 'さかぐちひろのぶ', 'sakaguchi hironobu', 'games', 'gamedev',
    { ja: '最後', reading: 'さいご', en: 'final', it: 'finale' },
    { en: 'The creator of the Final Fantasy series.', it: 'Il creatore della serie Final Fantasy.' }),
  p('sakurai', 'Masahiro Sakurai', '桜井政博', 'さくらいまさはろ', 'sakurai masahiro', 'games', 'gamedev',
    { ja: '乱闘', reading: 'らんとう', en: 'brawl', it: 'rissa' },
    { en: 'Creator of Kirby and the Super Smash Bros. series.', it: 'Creatore di Kirby e della serie Super Smash Bros.' }),
  p('tajiri', 'Satoshi Tajiri', '田尻智', 'たじりさとし', 'tajiri satoshi', 'games', 'gamedev',
    { ja: '昆虫', reading: 'こんちゅう', en: 'insect', it: 'insetto' },
    { en: 'Creator of the Pokémon franchise.', it: 'Creatore del franchise di Pokémon.' }),
  p('koji-h', 'Hideo Kojima', '小島秀夫', 'こじまひでお', 'kojima hideo', 'games', 'gamedev',
    { ja: '潜入', reading: 'せんにゅう', en: 'infiltration', it: 'infiltrazione' },
    { en: 'Creator of the Metal Gear series and Death Stranding.', it: 'Creatore della serie Metal Gear e di Death Stranding.' }),
  p('miya-s', 'Shigeru Miyamoto', '宮本茂', 'みやもとしげる', 'miyamoto shigeru', 'games', 'gamedev',
    { ja: '創造', reading: 'そうぞう', en: 'creation', it: 'creazione' },
    { en: 'The "Father of Modern Video Games" (Mario, Zelda).', it: 'Il "padre dei moderni videogiochi" (Mario, Zelda).' }),

  // Sports
  p('asada', 'Mao Asada', '浅田真央', 'あさだまお', 'asada mao', 'sports', 'athlete',
    { ja: '氷上', reading: 'ひょうじょう', en: 'on ice', it: 'sul ghiaccio' },
    { en: 'Three-time World figure skating champion.', it: 'Tre volte campionessa mondiale di pattinaggio di figura.' }),
  p('nakata', 'Hidetoshi Nakata', '中田英寿', 'なかたひでとし', 'nakata hidetoshi', 'sports', 'athlete',
    { ja: '伝説', reading: 'でんせつ', en: 'legend', it: 'leggenda' },
    { en: 'One of the greatest Asian players of all time.', it: 'Uno dei più grandi giocatori asiatici di tutti i tempi.' }),
  p('osaka-n', 'Naomi Osaka', '大坂なおみ', 'おおさかなおみ', 'osaka naomi', 'sports', 'athlete',
    { ja: '勝利', reading: 'しょうり', en: 'victory', it: 'vittoria' },
    { en: 'Tennis champion and former world No. 1.', it: 'Campionessa di tennis ed ex n. 1 al mondo.' }),
  p('hanyu', 'Yuzuru Hanyu', '羽生結弦', 'はにゅうゆづる', 'hanyuu yuzuru', 'sports', 'athlete',
    { ja: '氷', reading: 'こおり', en: 'ice', it: 'ghiaccio' },
    { en: 'Two-time Olympic champion in figure skating.', it: 'Due volte campione olimpico di pattinaggio di figura.' }),
  p('ichiro', 'Ichiro Suzuki', '鈴木一朗', 'すずきいちろう', 'suzuki ichirou', 'sports', 'athlete',
    { ja: '野球', reading: 'やきゅう', en: 'baseball', it: 'baseball' },
    { en: 'Holds the MLB record for the most hits in a single season.', it: 'Detiene il record della MLB per il maggior numero di battute valide in una singola stagione.' }, 'Ichiro Suzuki'),
  p('ohtani', 'Shohei Ohtani', '大谷翔平', 'おおたにしょうへい', 'ohtani shouhei', 'sports', 'athlete',
    { ja: '二刀流', reading: 'にとうりゅう', en: 'dual-role', it: 'doppio ruolo' },
    { en: 'Dual-role baseball star in the MLB.', it: 'Stella del baseball dal doppio ruolo nella MLB.' }),

  // Literature
  p('yoshimoto', 'Banana Yoshimoto', '吉本ばなな', 'よしもとばなな', 'yoshimoto banana', 'literature', 'author',
    { ja: '台所', reading: 'だいどころ', en: 'kitchen', it: 'cucina' },
    { en: 'Famous for her novel Kitchen.', it: 'Famosa per il suo romanzo Kitchen.' }),
  p('akutagawa', 'Ryunosuke Akutagawa', '芥川龍之介', 'あくたがわりゅうのすけ', 'akutagawa ryuunosuke', 'literature', 'author',
    { ja: '短編', reading: 'たんぺん', en: 'short story', it: 'racconto breve' },
    { en: 'The "Father of the Japanese short story".', it: 'Il "padre del racconto breve giapponese".' }),
  p('mishima', 'Yukio Mishima', '三島由紀夫', 'みしまゆきお', 'mishima yukio', 'literature', 'author',
    { ja: '美', reading: 'び', en: 'beauty', it: 'bellezza' },
    { en: 'One of the most important Japanese authors of the 20th century.', it: 'Uno dei più importanti autori giapponesi del XX secolo.' }),
  p('mura-h', 'Haruki Murakami', '村上春樹', 'むらかみはるき', 'murakami haruki', 'literature', 'author',
    { ja: '現実', reading: 'げんじつ', en: 'reality', it: 'realtà' },
    { en: 'Globally acclaimed author of surrealist fiction.', it: 'Autore di narrativa surrealista acclamato a livello mondiale.' }),
  p('natsu-s', 'Natsume Soseki', '夏目漱石', 'なつめそうせき', 'natsume souseki', 'literature', 'author',
    { ja: '吾輩', reading: 'わがはい', en: 'I (old/formal)', it: 'Io (formale)' },
    { en: 'Meiji-era novelist famous for "I Am a Cat".', it: 'Romanziere dell\'era Meiji famoso per "Io sono un gatto".' }),

  // History
  p('himiko', 'Himiko', '卑弥呼', 'ひみこ', 'himiko', 'history', 'warlord',
    { ja: '卑弥呼', reading: 'ひみこ', en: 'shamaness', it: 'sciamana' },
    { en: 'Shamaness-queen of Yamataikoku in ancient Japan.', it: 'Regina sciamana di Yamataikoku nell\'antico Giappone.' }),
  p('shotoku', 'Prince Shotoku', '聖徳太子', 'しょうとくたいし', 'shotoku taishi', 'history', 'educator',
    { ja: '憲法', reading: 'けんぽう', en: 'constitution', it: 'costituzione' },
    { en: 'Semi-legendary regent and politician of the Asuka period.', it: 'Reggente e politico semi-leggendario del periodo Asuka.' }, 'Prince Shōtoku'),
  p('hideyoshi', 'Toyotomi Hideyoshi', '豊臣秀吉', 'とよとみひでよし', 'toyotomi hideyoshi', 'history', 'warlord',
    { ja: '猿', reading: 'さる', en: 'monkey', it: 'scimmia' },
    { en: 'The second "Great Unifier" of Japan.', it: 'Il secondo "grande unificatore" del Giappone.' }),
  p('ieyasu', 'Tokugawa Ieyasu', '徳川家康', 'とくがわいえやす', 'tokugawa ieyasu', 'history', 'warlord',
    { ja: '忍耐', reading: 'にんたい', en: 'patience', it: 'pazienza' },
    { en: 'Founder of the Tokugawa shogunate.', it: 'Fondatore dello shogunato Tokugawa.' }),
  p('oda-n', 'Oda Nobunaga', '織田信長', 'おだのぶなが', 'oda nobunaga', 'history', 'warlord',
    { ja: '統一', reading: 'とういつ', en: 'unification', it: 'unificazione' },
    { en: 'A major daimyo who unified much of Japan.', it: 'Un importante daimyo che unificò gran parte del Giappone.' }),

  // Art
  p('nara', 'Yoshitomo Nara', '奈良美智', 'ならよしとも', 'nara yoshitomo', 'art', 'painter',
    { ja: '反抗', reading: 'はんこう', en: 'rebellion', it: 'ribellione' },
    { en: 'Known for paintings of children with challenging looks.', it: 'Noto per i dipinti di bambini dagli sguardi di sfida.' }),
  p('kusama', 'Yayoi Kusama', '草間彌生', 'くさまやよい', 'kusama yayoi', 'art', 'painter',
    { ja: '水玉', reading: 'みずたま', en: 'polka dot', it: 'pois' },
    { en: 'Contemporary artist famous for her polka dot motif and infinity rooms.', it: 'Artista contemporanea famosa per il suo motivo a pois e le infinity room.' }),
  p('murakami-t', 'Takashi Murakami', '村上隆', 'むらかみたかし', 'murakami takashi', 'art', 'painter',
    { ja: '超平面', reading: 'ちょうへいめん', en: 'superflat', it: 'superflat' },
    { en: 'Contemporary artist behind the "Superflat" style.', it: 'Artista contemporaneo dietro lo stile "Superflat".' }),
  p('hoku-k', 'Katsushika Hokusai', '葛飾北斎', 'かつしかほくさい', 'katsushika hokusai', 'art', 'painter',
    { ja: '波', reading: 'なみ', en: 'wave', it: 'onda' },
    { en: 'Master of ukiyo-e, famous for The Great Wave.', it: 'Maestro dell\'ukiyo-e, famoso per La grande onda.' })
];

export const CATEGORY_META: Record<PersonCategory, { label: Localized; emoji: string; color: string }> = {
  music: { label: { en: 'Music', it: 'Musica' }, emoji: '🎵', color: '#06b6d4' },
  film: { label: { en: 'Film & TV', it: 'Cinema e TV' }, emoji: '🎬', color: '#f43f5e' },
  anime: { label: { en: 'Anime', it: 'Anime' }, emoji: '🌟', color: '#fbbf24' },
  games: { label: { en: 'Games', it: 'Giochi' }, emoji: '🎮', color: '#10b981' },
  sports: { label: { en: 'Sports', it: 'Sport' }, emoji: '⚽', color: '#3b82f6' },
  literature: { label: { en: 'Literature', it: 'Letteratura' }, emoji: '📖', color: '#a855f7' },
  history: { label: { en: 'History', it: 'Storia' }, emoji: '🏯', color: '#b45309' },
  art: { label: { en: 'Art', it: 'Arte' }, emoji: '🎨', color: '#ef4444' }
};
