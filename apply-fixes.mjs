import fs from 'fs';

const fixes = {
  'sheik': 'Sheik (The Legend of Zelda)',
  'luigi': 'Luigi (character)',
  'kirby': 'Kirby (character)',
  'link': 'Link (The Legend of Zelda)',
  '2b': '2B (NieR: Automata)',
  'ryu': 'Ryu (Street Fighter)',
  'joker': 'Joker (Persona)',
  'rockman': 'Mega Man (character)',
  'donkeykong': 'Donkey Kong (character)',
  'kinopio': 'Toad (Nintendo)',
  'san': 'Princess Mononoke',
  'totoro': 'My Neighbor Totoro',
  'sonic': 'Sonic the Hedgehog (character)',
  'sora': 'Sora (Kingdom Hearts)',
  'tifa': 'Tifa Lockhart',
  'aerith': 'Aerith Gainsborough',
  'snake': 'Solid Snake',
  'cloud': 'Cloud Strife',
  'nami': 'Nami (One Piece)',
  'sanji': 'Sanji (One Piece)',
  'usagi': 'Sailor Moon (character)',
  'mako': 'Sailor Jupiter',
  'mina': 'Sailor Venus',
  'rei-sailor': 'Sailor Mars',
  'ami': 'Sailor Mercury',
  'abe-h': 'Hiroshi Abe (actor)',
  'kiki': "Kiki's Delivery Service", // since she doesn't have her own page
  'chopper': 'Tony Tony Chopper'
};

const file = 'src/lib/data/game/fictional.ts';
let content = fs.readFileSync(file, 'utf8');

for (const [id, wiki] of Object.entries(fixes)) {
  // Find the c('id', ... ) line
  const regex = new RegExp(`c\\('${id}',[\\s\\S]*?\\}\\)`, 'g');
  content = content.replace(regex, (match) => {
    // If it already has a wiki string, it's harder, but let's assume none of these have a 11th arg
    return `${match}, '${wiki.replace(/'/g, "\\'")}'`;
  });
}
fs.writeFileSync(file, content);

const pFile = 'src/lib/data/game/people.ts';
let pContent = fs.readFileSync(pFile, 'utf8');
const pRegex = new RegExp(`p\\('abe-h',[\\s\\S]*?\\}\\)`, 'g');
pContent = pContent.replace(pRegex, (match) => {
    return `${match}, 'Hiroshi Abe (actor)'`;
});
fs.writeFileSync(pFile, pContent);

console.log('Fixed wiki links!');