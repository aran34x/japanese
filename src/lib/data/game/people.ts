// Real Japanese pop-culture & historical figures. We store ONLY names + the
// (authored) challenge data; bios and photos are fetched live from Wikipedia at
// runtime (see wiki.ts). Each person's challenge is specific to them: read their
// actual name in Japanese, and the vocabulary for their actual profession.
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

interface Role {
  ja: string;
  reading: string;
  en: string;
  it: string;
}

export const ROLES: Record<string, Role> = {
  singer: { ja: '歌手', reading: 'かしゅ', en: 'singer', it: 'cantante' },
  composer: { ja: '作曲家', reading: 'さっきょくか', en: 'composer', it: 'compositore' },
  director: { ja: '映画監督', reading: 'えいがかんとく', en: 'film director', it: 'regista' },
  actor: { ja: '俳優', reading: 'はいゆう', en: 'actor', it: 'attore' },
  mangaka: { ja: '漫画家', reading: 'まんがか', en: 'manga artist', it: 'fumettista' },
  animator: { ja: 'アニメ監督', reading: 'アニメかんとく', en: 'anime director', it: 'regista di anime' },
  gamedev: { ja: 'ゲームデザイナー', reading: 'ゲームデザイナー', en: 'game designer', it: 'game designer' },
  athlete: { ja: '選手', reading: 'せんしゅ', en: 'athlete', it: 'atleta' },
  author: { ja: '作家', reading: 'さっか', en: 'author', it: 'scrittore' },
  painter: { ja: '画家', reading: 'がか', en: 'painter', it: 'pittore' },
  warlord: { ja: '武将', reading: 'ぶしょう', en: 'warlord', it: 'signore della guerra' },
  swordsman: { ja: '剣豪', reading: 'けんごう', en: 'swordmaster', it: 'spadaccino' },
  samurai: { ja: '武士', reading: 'ぶし', en: 'samurai', it: 'samurai' },
  educator: { ja: '教育者', reading: 'きょういくしゃ', en: 'educator', it: 'educatore' }
};

export interface RealPerson {
  id: string;
  name: string; // English/display name (also the Wikipedia title)
  wiki: string; // Wikipedia article title
  ja: string; // name in Japanese (kanji/kana)
  reading: string; // kana reading
  romaji: string; // romaji reading
  category: PersonCategory;
  role: keyof typeof ROLES;
  fact?: Localized; // short flavor note (shown in detail)
  xp: number;
}

const p = (
  id: string,
  name: string,
  ja: string,
  reading: string,
  romaji: string,
  category: PersonCategory,
  role: keyof typeof ROLES,
  fact?: Localized,
  wiki?: string
): RealPerson => ({ id, name, wiki: wiki ?? name, ja, reading, romaji, category, role, fact, xp: 50 });

export const PEOPLE: RealPerson[] = [
  // ---- Music ----
  p('sakamoto-r', 'Ryuichi Sakamoto', '坂本龍一', 'さかもとりゅういち', 'sakamoto ryuichi', 'music', 'composer',
    { en: 'Member of Yellow Magic Orchestra; won an Oscar for The Last Emperor.', it: 'Membro degli Yellow Magic Orchestra; vinse un Oscar per L\'ultimo imperatore.' }),
  p('utada', 'Hikaru Utada', '宇多田ヒカル', 'うただひかる', 'utada hikaru', 'music', 'singer',
    { en: 'Debut album First Love (1999) is among Japan\'s best-selling albums.', it: 'L\'album di debutto First Love (1999) è tra i più venduti in Giappone.' }),
  p('hamasaki', 'Ayumi Hamasaki', '浜崎あゆみ', 'はまさきあゆみ', 'hamasaki ayumi', 'music', 'singer'),
  p('amuro', 'Namie Amuro', '安室奈美恵', 'あむろなみえ', 'amuro namie', 'music', 'singer'),
  p('misora', 'Hibari Misora', '美空ひばり', 'みそらひばり', 'misora hibari', 'music', 'singer'),
  p('sakamoto-k', 'Kyu Sakamoto', '坂本九', 'さかもときゅう', 'sakamoto kyu', 'music', 'singer',
    { en: '"Sukiyaki" reached #1 on the US Billboard chart in 1963.', it: '"Sukiyaki" raggiunse il #1 della classifica Billboard USA nel 1963.' }),
  p('sheena', 'Ringo Sheena', '椎名林檎', 'しいなりんご', 'shiina ringo', 'music', 'singer'),
  p('hisaishi', 'Joe Hisaishi', '久石譲', 'ひさいしじょう', 'hisaishi joe', 'music', 'composer',
    { en: 'Composed the scores for many Studio Ghibli films.', it: 'Ha composto le colonne sonore di molti film dello Studio Ghibli.' }),

  // ---- Film ----
  p('kurosawa', 'Akira Kurosawa', '黒澤明', 'くろさわあきら', 'kurosawa akira', 'film', 'director',
    { en: 'Directed Seven Samurai and Rashomon.', it: 'Ha diretto I sette samurai e Rashōmon.' }),
  p('kitano', 'Takeshi Kitano', '北野武', 'きたのたけし', 'kitano takeshi', 'film', 'director',
    { en: 'Also a famous comedian known as "Beat Takeshi".', it: 'Anche famoso comico noto come "Beat Takeshi".' }),
  p('mifune', 'Toshiro Mifune', '三船敏郎', 'みふねとしろう', 'mifune toshiro', 'film', 'actor',
    { en: 'Starred in 16 films with director Akira Kurosawa.', it: 'Recitò in 16 film con il regista Akira Kurosawa.' }),
  p('watanabe', 'Ken Watanabe', '渡辺謙', 'わたなべけん', 'watanabe ken', 'film', 'actor'),
  p('koreeda', 'Hirokazu Kore-eda', '是枝裕和', 'これえだひろかず', 'koreeda hirokazu', 'film', 'director',
    { en: 'Shoplifters won the Palme d\'Or at Cannes in 2018.', it: 'Un affare di famiglia vinse la Palma d\'Oro a Cannes nel 2018.' }, 'Hirokazu Kore-eda'),
  p('ozu', 'Yasujiro Ozu', '小津安二郎', 'おづやすじろう', 'ozu yasujiro', 'film', 'director',
    { en: 'Directed the classic Tokyo Story (1953).', it: 'Diresse il classico Viaggio a Tokyo (1953).' }, 'Yasujirō Ozu'),
  p('yakusho', 'Koji Yakusho', '役所広司', 'やくしょこうじ', 'yakusho koji', 'film', 'actor', undefined, 'Kōji Yakusho'),
  p('takakura', 'Ken Takakura', '高倉健', 'たかくらけん', 'takakura ken', 'film', 'actor'),

  // ---- Anime / Manga ----
  p('miyazaki', 'Hayao Miyazaki', '宮崎駿', 'みやざきはやお', 'miyazaki hayao', 'anime', 'animator',
    { en: 'Co-founded Studio Ghibli; Spirited Away won an Academy Award.', it: 'Cofondò lo Studio Ghibli; La città incantata vinse un Oscar.' }),
  p('tezuka', 'Osamu Tezuka', '手塚治虫', 'てづかおさむ', 'tezuka osamu', 'anime', 'mangaka',
    { en: 'Creator of Astro Boy; called the "god of manga".', it: 'Creatore di Astro Boy; chiamato il "dio del manga".' }),
  p('toriyama', 'Akira Toriyama', '鳥山明', 'とりやまあきら', 'toriyama akira', 'anime', 'mangaka',
    { en: 'Created Dragon Ball and Dr. Slump.', it: 'Ha creato Dragon Ball e Dr. Slump.' }),
  p('oda', 'Eiichiro Oda', '尾田栄一郎', 'おだえいいちろう', 'oda eiichiro', 'anime', 'mangaka',
    { en: 'Creator of One Piece, the best-selling manga series.', it: 'Creatore di One Piece, il manga più venduto.' }),
  p('kishimoto', 'Masashi Kishimoto', '岸本斉史', 'きしもとまさし', 'kishimoto masashi', 'anime', 'mangaka',
    { en: 'Creator of Naruto.', it: 'Creatore di Naruto.' }),
  p('takahashi', 'Rumiko Takahashi', '高橋留美子', 'たかはしるみこ', 'takahashi rumiko', 'anime', 'mangaka',
    { en: 'Created Inuyasha and Ranma ½.', it: 'Ha creato Inuyasha e Ranma ½.' }),
  p('anno', 'Hideaki Anno', '庵野秀明', 'あんのひであき', 'anno hideaki', 'anime', 'animator',
    { en: 'Creator of Neon Genesis Evangelion.', it: 'Creatore di Neon Genesis Evangelion.' }),
  p('shinkai', 'Makoto Shinkai', '新海誠', 'しんかいまこと', 'shinkai makoto', 'anime', 'animator',
    { en: 'Directed Your Name (Kimi no Na wa).', it: 'Ha diretto Your Name (Kimi no Na wa).' }),
  p('takahata', 'Isao Takahata', '高畑勲', 'たかはたいさお', 'takahata isao', 'anime', 'animator',
    { en: 'Directed Grave of the Fireflies.', it: 'Ha diretto Una tomba per le lucciole.' }),
  p('otomo', 'Katsuhiro Otomo', '大友克洋', 'おおともかつひろ', 'otomo katsuhiro', 'anime', 'mangaka',
    { en: 'Creator of Akira.', it: 'Creatore di Akira.' }),
  p('oshii', 'Mamoru Oshii', '押井守', 'おしいまもる', 'oshii mamoru', 'anime', 'animator',
    { en: 'Directed Ghost in the Shell (1995).', it: 'Ha diretto Ghost in the Shell (1995).' }),
  p('takeuchi', 'Naoko Takeuchi', '武内直子', 'たけうちなおこ', 'takeuchi naoko', 'anime', 'mangaka',
    { en: 'Creator of Sailor Moon.', it: 'Creatrice di Sailor Moon.' }),

  // ---- Videogames ----
  p('miyamoto', 'Shigeru Miyamoto', '宮本茂', 'みやもとしげる', 'miyamoto shigeru', 'games', 'gamedev',
    { en: 'Created Super Mario, The Legend of Zelda and Donkey Kong.', it: 'Ha creato Super Mario, The Legend of Zelda e Donkey Kong.' }),
  p('kojima', 'Hideo Kojima', '小島秀夫', 'こじまひでお', 'kojima hideo', 'games', 'gamedev',
    { en: 'Creator of the Metal Gear series.', it: 'Creatore della serie Metal Gear.' }),
  p('iwata', 'Satoru Iwata', '岩田聡', 'いわたさとし', 'iwata satoru', 'games', 'gamedev',
    { en: 'Programmer and former president of Nintendo.', it: 'Programmatore ed ex presidente di Nintendo.' }),
  p('sakaguchi', 'Hironobu Sakaguchi', '坂口博信', 'さかぐちひろのぶ', 'sakaguchi hironobu', 'games', 'gamedev',
    { en: 'Creator of the Final Fantasy series.', it: 'Creatore della serie Final Fantasy.' }),
  p('nomura', 'Tetsuya Nomura', '野村哲也', 'のむらてつや', 'nomura tetsuya', 'games', 'gamedev',
    { en: 'Director of the Kingdom Hearts series.', it: 'Director della serie Kingdom Hearts.' }),
  p('iwatani', 'Toru Iwatani', '岩谷徹', 'いわたにとおる', 'iwatani toru', 'games', 'gamedev',
    { en: 'Designer of Pac-Man (1980).', it: 'Designer di Pac-Man (1980).' }, 'Tōru Iwatani'),
  p('yokoi', 'Gunpei Yokoi', '横井軍平', 'よこいぐんぺい', 'yokoi gunpei', 'games', 'gamedev',
    { en: 'Created the Game Boy.', it: 'Ha creato il Game Boy.' }),

  // ---- Sports ----
  p('ohtani', 'Shohei Ohtani', '大谷翔平', 'おおたにしょうへい', 'ohtani shohei', 'sports', 'athlete',
    { en: 'Two-way baseball superstar (pitcher and hitter).', it: 'Stella del baseball, sia lanciatore che battitore.' }),
  p('ichiro', 'Ichiro Suzuki', '鈴木一朗', 'すずきいちろう', 'suzuki ichiro', 'sports', 'athlete',
    { en: 'Baseball legend with a record for hits in a season.', it: 'Leggenda del baseball, record di battute valide in una stagione.' }),
  p('hanyu', 'Yuzuru Hanyu', '羽生結弦', 'はにゅうゆづる', 'hanyu yuzuru', 'sports', 'athlete',
    { en: 'Two-time Olympic figure-skating champion.', it: 'Due volte campione olimpico di pattinaggio artistico.' }),
  p('osaka', 'Naomi Osaka', '大坂なおみ', 'おおさかなおみ', 'osaka naomi', 'sports', 'athlete',
    { en: 'Four-time Grand Slam tennis champion.', it: 'Quattro volte campionessa di tennis del Grande Slam.' }),
  p('nishikori', 'Kei Nishikori', '錦織圭', 'にしこりけい', 'nishikori kei', 'sports', 'athlete'),
  p('honda', 'Keisuke Honda', '本田圭佑', 'ほんだけいすけ', 'honda keisuke', 'sports', 'athlete'),

  // ---- Literature ----
  p('murakami-h', 'Haruki Murakami', '村上春樹', 'むらかみはるき', 'murakami haruki', 'literature', 'author',
    { en: 'Author of Norwegian Wood and Kafka on the Shore.', it: 'Autore di Norwegian Wood e Kafka sulla spiaggia.' }),
  p('mishima', 'Yukio Mishima', '三島由紀夫', 'みしまゆきお', 'mishima yukio', 'literature', 'author'),
  p('soseki', 'Natsume Soseki', '夏目漱石', 'なつめそうせき', 'natsume soseki', 'literature', 'author',
    { en: 'Author of Kokoro; once featured on the 1000-yen note.', it: 'Autore di Kokoro; un tempo sulla banconota da 1000 yen.' }, 'Natsume Sōseki'),
  p('kawabata', 'Yasunari Kawabata', '川端康成', 'かわばたやすなり', 'kawabata yasunari', 'literature', 'author',
    { en: 'Won the Nobel Prize in Literature in 1968.', it: 'Vinse il Nobel per la letteratura nel 1968.' }),
  p('oe', 'Kenzaburo Oe', '大江健三郎', 'おおえけんざぶろう', 'oe kenzaburo', 'literature', 'author',
    { en: 'Won the Nobel Prize in Literature in 1994.', it: 'Vinse il Nobel per la letteratura nel 1994.' }, 'Kenzaburō Ōe'),
  p('akutagawa', 'Ryunosuke Akutagawa', '芥川龍之介', 'あくたがわりゅうのすけ', 'akutagawa ryunosuke', 'literature', 'author',
    { en: 'Wrote the story behind the film Rashomon.', it: 'Scrisse il racconto alla base del film Rashōmon.' }, 'Ryūnosuke Akutagawa'),
  p('dazai', 'Osamu Dazai', '太宰治', 'だざいおさむ', 'dazai osamu', 'literature', 'author',
    { en: 'Author of No Longer Human.', it: 'Autore di Lo squalificato (No Longer Human).' }),
  p('murasaki', 'Murasaki Shikibu', '紫式部', 'むらさきしきぶ', 'murasaki shikibu', 'literature', 'author',
    { en: 'Wrote The Tale of Genji, an early novel (c. 1010).', it: 'Scrisse Il racconto di Genji, uno dei primi romanzi (~1010).' }),

  // ---- History ----
  p('nobunaga', 'Oda Nobunaga', '織田信長', 'おだのぶなが', 'oda nobunaga', 'history', 'warlord',
    { en: 'A unifier of Japan during the Sengoku period.', it: 'Un unificatore del Giappone nel periodo Sengoku.' }),
  p('ieyasu', 'Tokugawa Ieyasu', '徳川家康', 'とくがわいえやす', 'tokugawa ieyasu', 'history', 'warlord',
    { en: 'Founder of the Tokugawa shogunate.', it: 'Fondatore dello shogunato Tokugawa.' }),
  p('hideyoshi', 'Toyotomi Hideyoshi', '豊臣秀吉', 'とよとみひでよし', 'toyotomi hideyoshi', 'history', 'warlord'),
  p('masamune', 'Date Masamune', '伊達政宗', 'だてまさむね', 'date masamune', 'history', 'warlord'),
  p('shingen', 'Takeda Shingen', '武田信玄', 'たけだしんげん', 'takeda shingen', 'history', 'warlord'),
  p('ryoma', 'Sakamoto Ryoma', '坂本龍馬', 'さかもとりょうま', 'sakamoto ryoma', 'history', 'samurai',
    { en: 'Key figure in the movement to modernise Japan.', it: 'Figura chiave nel movimento per modernizzare il Giappone.' }, 'Sakamoto Ryōma'),
  p('musashi', 'Miyamoto Musashi', '宮本武蔵', 'みやもとむさし', 'miyamoto musashi', 'history', 'swordsman',
    { en: 'Legendary swordsman; wrote The Book of Five Rings.', it: 'Leggendario spadaccino; scrisse Il libro dei cinque anelli.' }),
  p('fukuzawa', 'Yukichi Fukuzawa', '福沢諭吉', 'ふくざわゆきち', 'fukuzawa yukichi', 'history', 'educator',
    { en: 'Educator featured on the 10,000-yen note.', it: 'Educatore raffigurato sulla banconota da 10.000 yen.' }),

  // ---- Art ----
  p('hokusai', 'Hokusai', '葛飾北斎', 'かつしかほくさい', 'katsushika hokusai', 'art', 'painter',
    { en: 'Created The Great Wave off Kanagawa.', it: 'Creò La grande onda di Kanagawa.' }),
  p('hiroshige', 'Hiroshige', '歌川広重', 'うたがわひろしげ', 'utagawa hiroshige', 'art', 'painter',
    { en: 'Ukiyo-e master of landscape prints.', it: 'Maestro ukiyo-e delle stampe di paesaggi.' }),
  p('kusama', 'Yayoi Kusama', '草間彌生', 'くさまやよい', 'kusama yayoi', 'art', 'painter',
    { en: 'Contemporary artist famous for polka dots.', it: 'Artista contemporanea famosa per i pois.' }),
  p('murakami-t', 'Takashi Murakami', '村上隆', 'むらかみたかし', 'murakami takashi', 'art', 'painter',
    { en: 'Contemporary artist behind the "Superflat" style.', it: 'Artista contemporaneo dietro lo stile "Superflat".' })
];

export const CATEGORY_META: Record<PersonCategory, { label: Localized; emoji: string; color: string }> = {
  music: { label: { en: 'Music', it: 'Musica' }, emoji: '🎵', color: '#ec4899' },
  film: { label: { en: 'Film', it: 'Cinema' }, emoji: '🎬', color: '#f59e0b' },
  anime: { label: { en: 'Anime', it: 'Anime' }, emoji: '📺', color: '#8b5cf6' },
  games: { label: { en: 'Games', it: 'Videogiochi' }, emoji: '🎮', color: '#22c55e' },
  sports: { label: { en: 'Sports', it: 'Sport' }, emoji: '🏅', color: '#06b6d4' },
  literature: { label: { en: 'Literature', it: 'Letteratura' }, emoji: '📖', color: '#a855f7' },
  history: { label: { en: 'History', it: 'Storia' }, emoji: '🏯', color: '#b45309' },
  art: { label: { en: 'Art', it: 'Arte' }, emoji: '🎨', color: '#ef4444' }
};
