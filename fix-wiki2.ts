import { CHARACTERS_FICTIONAL } from './src/lib/data/game/fictional';
import { PEOPLE } from './src/lib/data/game/people';
import fs from 'fs';

const fictionalFile = 'src/lib/data/game/fictional.ts';
const peopleFile = 'src/lib/data/game/people.ts';

async function checkTitle(title) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
       headers: { 'User-Agent': 'NihongoQuest/1.0' }
    });
    if (res.status === 200) {
      const json = await res.json();
      if (json.type !== 'disambiguation' && json.thumbnail) return true;
    }
  } catch(e) {}
  return false;
}

async function findCorrectFictional(c) {
  const possible = [
    c.name,
    `${c.name} (character)`,
    `${c.name.split(' ')[0]} (character)`,
    c.name.replace(/ \(.+\)/, ''), // e.g. "Toad (Kinopio)" -> "Toad"
    `${c.name.replace(/ \(.+\)/, '')} (character)`,
    `${c.name} (${c.franchise || c.category})`,
    `${c.romaji}`,
    `${c.romaji} (character)`,
    c.wiki // whatever is there now
  ];
  
  // Specific hardcoded fixes for known ones
  if (c.id === 'sonic') possible.unshift('Sonic the Hedgehog (character)');
  if (c.id === 'joker') possible.unshift('Joker (Persona)');
  if (c.id === 'ryu') possible.unshift('Ryu (Street Fighter)');
  if (c.id === 'donkeykong') possible.unshift('Donkey Kong (character)');
  if (c.id === 'kinopio') possible.unshift('Toad (Nintendo)');
  if (c.id === 'link') possible.unshift('Link (The Legend of Zelda)');
  if (c.id === 'sheik') possible.unshift('Sheik (The Legend of Zelda)');
  if (c.id === 'ganon') possible.unshift('Ganon');
  if (c.id === 'rockman') possible.unshift('Mega Man (character)');
  if (c.id === 'usagi') possible.unshift('Sailor Moon (character)');
  if (c.id === 'mina') possible.unshift('Sailor Venus');
  if (c.id === 'mako') possible.unshift('Sailor Jupiter');
  if (c.id === 'ami') possible.unshift('Sailor Mercury');
  if (c.id === 'rei-sailor') possible.unshift('Sailor Mars');
  if (c.id === 'kiki') possible.unshift("Kiki (Kiki's Delivery Service)");
  if (c.id === 'totoro') possible.unshift('My Neighbor Totoro'); // character has no page, use film
  if (c.id === 'san') possible.unshift('Princess Mononoke');
  
  for (const p of possible) {
     if (await checkTitle(p)) return p;
  }
  return null;
}

async function findCorrectPerson(p) {
  const possible = [
    p.name,
    `${p.name} (actor)`,
    `${p.name} (director)`,
    p.romaji,
    p.wiki
  ];
  if (p.id === 'abe-h') possible.unshift('Hiroshi Abe (actor)');
  
  for (const title of possible) {
     if (await checkTitle(title)) return title;
  }
  return null;
}

async function fixFile(filePath, items, finder) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  for (const item of items) {
    const isOk = await checkTitle(item.wiki);
    if (!isOk) {
      const bestTitle = await finder(item);
      if (bestTitle && bestTitle !== item.wiki) {
        console.log(`Fixing ${item.name} -> ${bestTitle}`);
        const regex1 = new RegExp(`(c\\('${item.id}'.*?),\\s*'[^']+'\\)(?:,|$)`, 'm');
        const regex2 = new RegExp(`(p\\('${item.id}'.*?),\\s*'[^']+'\\)(?:,|$)`, 'm');
        
        let matched = false;
        if (regex1.test(content)) {
            content = content.replace(regex1, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
            matched = true;
        } else if (regex2.test(content)) {
            content = content.replace(regex2, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
            matched = true;
        } else {
            // No wiki string present, append it.
            const regex3 = new RegExp(`((?:c|p)\\('${item.id}'.*?\\})\\)(?:,|$)`, 'm');
            if (regex3.test(content)) {
               content = content.replace(regex3, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
               matched = true;
            }
        }
        if (matched) changes++;
      } else {
        console.log(`Could not find image for ${item.name}`);
      }
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${changes} changes to ${filePath}`);
  }
}

async function run() {
  await fixFile(fictionalFile, CHARACTERS_FICTIONAL, findCorrectFictional);
  await fixFile(peopleFile, PEOPLE, findCorrectPerson);
}

run();