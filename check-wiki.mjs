import fs from 'fs';
import https from 'https';

function checkWiki(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            if (json.type === 'disambiguation') {
               resolve({ title, status: 'disambiguation' });
            } else if (!json.thumbnail) {
               resolve({ title, status: 'no_image' });
            } else {
               resolve({ title, status: 'ok' });
            }
          } catch (e) {
            resolve({ title, status: 'parse_error' });
          }
        } else {
          resolve({ title, status: 'not_found' });
        }
      });
    }).on('error', () => resolve({ title, status: 'error' }));
  });
}

async function run() {
  const fictional = fs.readFileSync('src/lib/data/game/fictional.ts', 'utf8');
  const people = fs.readFileSync('src/lib/data/game/people.ts', 'utf8');

  const extractTitles = (content, regex) => {
    const titles = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      // The name is match[1]. 
      // To reliably get wiki, it's the 11th/10th arg, which is hard with regex.
      // Let's just find the whole line and parse the last string if it's a string, or use the name.
      const fullCall = match[0];
      const argsMatch = fullCall.match(/'([^'\\]*(?:\\.[^'\\]*)*)'/g);
      if (argsMatch) {
         const strings = argsMatch.map(s => s.slice(1, -1));
         // The 2nd string is always the name.
         const name = strings[1];
         // The last string *might* be the wiki title if it's longer than a hex color or emoji, but it's tricky.
         // Let's just look at the last argument in the call.
         let wiki = name;
         const lastStr = strings[strings.length - 1];
         // If the last string doesn't look like a hex color, emoji, or translation string, it might be the wiki title.
         // Actually, I can just write a simpler regex since the wiki title is at the very end of the line: ` 'Wiki Title')`
         const wikiMatch = fullCall.match(/,\s*'([^']+)'\s*\)/);
         if (wikiMatch) {
            wiki = wikiMatch[1];
         }
         titles.push(wiki);
      }
    }
    return titles;
  };

  // match c(...) spanning multiple lines
  const cRegex = /c\([^)]+\)/g;
  const pRegex = /p\([^)]+\)/g;

  const ficTitles = extractTitles(fictional, cRegex);
  const peoTitles = extractTitles(people, pRegex);

  const allTitles = [...new Set([...ficTitles, ...peoTitles])];
  console.log(`Checking ${allTitles.length} titles...`);

  const results = [];
  // Run in batches of 10
  for (let i = 0; i < allTitles.length; i += 10) {
    const batch = allTitles.slice(i, i + 10);
    const batchResults = await Promise.all(batch.map(checkWiki));
    results.push(...batchResults);
    process.stdout.write('.');
  }
  
  console.log('\n\n--- RESULTS ---');
  const bad = results.filter(r => r.status !== 'ok');
  bad.forEach(r => console.log(`${r.title}: ${r.status}`));
  if (bad.length === 0) console.log('All titles have images!');
}

run();