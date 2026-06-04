import { CHARACTERS_FICTIONAL } from './src/lib/data/game/fictional';
import { PEOPLE } from './src/lib/data/game/people';
import fs from 'fs';

const fictionalFile = 'src/lib/data/game/fictional.ts';
const peopleFile = 'src/lib/data/game/people.ts';

async function findBestWikiTitle(query, isReal) {
  // Try to find a Wikipedia page that matches the query AND has an image.
  // Add context for fictional characters if needed.
  let q = query;
  if (!isReal && !q.includes('(')) {
     // q += ' character';
  }
  
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=5&prop=pageimages&pithumbsize=100&format=json`;
  
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'NihongoQuest/1.0' } });
    const json = await res.json();
    if (!json.query || !json.query.pages) return null;
    
    const pages = Object.values(json.query.pages);
    // Sort by search index, but prioritize pages with images
    pages.sort((a, b) => {
      const aImage = a.thumbnail ? 1 : 0;
      const bImage = b.thumbnail ? 1 : 0;
      if (aImage !== bImage) return bImage - aImage;
      return a.index - b.index;
    });

    for (const page of pages) {
       // if we found one with an image, check if it's not a disambiguation
       if (page.thumbnail) {
           return page.title;
       }
    }
    
    // If no images found, just return the first result
    return pages[0].title;
  } catch (e) {
    return null;
  }
}

async function fixFile(filePath, items, isReal) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  for (const item of items) {
    // Check if current is broken
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wiki)}`);
    let needsFix = false;
    if (res.status !== 200) {
      needsFix = true;
    } else {
      const json = await res.json();
      if (json.type === 'disambiguation' || !json.thumbnail) needsFix = true;
    }

    if (needsFix) {
      console.log(`Fixing: ${item.wiki} (Name: ${item.name})`);
      // Try with name first, then name + ' (character)', then franchise
      const queries = [
        item.wiki,
        item.name,
        `${item.name} (character)`,
        `${item.name} (${item.franchise || ''})`
      ];

      let bestTitle = null;
      for (const q of queries) {
        if (!q) continue;
        bestTitle = await findBestWikiTitle(q, isReal);
        if (bestTitle) {
           const check = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`);
           if (check.status === 200) {
             const j = await check.json();
             if (j.type !== 'disambiguation' && j.thumbnail) break; // Found perfect match
           }
        }
      }

      if (bestTitle && bestTitle !== item.wiki) {
        console.log(`  -> Found: ${bestTitle}`);
        // Regex to find the c(...) or p(...) call for this id and replace the last argument
        // This is tricky. Let's just do a string replace of the exact wiki string.
        // Wait, if wiki is NOT in the string, it means it's falling back to name.
        // If we add it, we need to append it.
        // To be safe, I'll print the fixes and apply them manually or via regex.
        console.log(`   Replace: '${item.wiki}' with '${bestTitle}' in ${filePath}`);
        
        // Let's try a simple regex for the specific line
        // Look for the id in quotes, then match the rest of the c(...) call
        const regex = new RegExp(`(c\\('${item.id}'.*?\\})\\)(?:,|$)`, 'm');
        if (regex.test(content)) {
            // It didn't have a wiki string.
            content = content.replace(regex, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
            changes++;
        } else {
            // It had a wiki string. Let's look for the exact string before the closing paren.
            const regex2 = new RegExp(`(c\\('${item.id}'.*?),\\s*'${item.wiki.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\)(?:,|$)`, 'm');
            if (regex2.test(content)) {
                content = content.replace(regex2, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
                changes++;
            }
        }
      } else {
        console.log(`  -> No good match found.`);
      }
    }
  }

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Saved ${changes} changes to ${filePath}`);
  }
}

async function run() {
  await fixFile(fictionalFile, CHARACTERS_FICTIONAL, false);
  // Actually, wait, let's fix people too.
  let peopleContent = fs.readFileSync(peopleFile, 'utf8');
  let peopleChanges = 0;
  for (const item of PEOPLE) {
     const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wiki)}`);
    let needsFix = false;
    if (res.status !== 200) {
      needsFix = true;
    } else {
      const json = await res.json();
      if (json.type === 'disambiguation' || !json.thumbnail) needsFix = true;
    }

    if (needsFix) {
      console.log(`Fixing: ${item.wiki} (Name: ${item.name})`);
      const bestTitle = await findBestWikiTitle(item.wiki, true) || await findBestWikiTitle(item.name, true);
      if (bestTitle && bestTitle !== item.wiki) {
        console.log(`  -> Found: ${bestTitle}`);
        const regex = new RegExp(`(p\\('${item.id}'.*?\\})\\)(?:,|$)`, 'm');
        if (regex.test(peopleContent)) {
            peopleContent = peopleContent.replace(regex, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
            peopleChanges++;
        } else {
            const regex2 = new RegExp(`(p\\('${item.id}'.*?),\\s*'${item.wiki.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'\\)(?:,|$)`, 'm');
            if (regex2.test(peopleContent)) {
                peopleContent = peopleContent.replace(regex2, `$1, '${bestTitle.replace(/'/g, "\\'")}')`);
                peopleChanges++;
            }
        }
      }
    }
  }
  if (peopleChanges > 0) {
    fs.writeFileSync(peopleFile, peopleContent, 'utf8');
    console.log(`Saved ${peopleChanges} changes to ${peopleFile}`);
  }
}

run();