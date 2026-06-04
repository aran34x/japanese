import { CHARACTERS_FICTIONAL } from './src/lib/data/game/fictional';
import { PEOPLE } from './src/lib/data/game/people';

async function checkWiki(title) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`, {
      headers: { 'User-Agent': 'NihongoQuest/1.0 (test@example.com)' }
    });
    if (res.status === 200) {
      const json = await res.json();
      if (json.type === 'disambiguation') return { title, status: 'disambiguation' };
      if (!json.thumbnail) return { title, status: 'no_image' };
      return { title, status: 'ok' };
    }
    return { title, status: res.status.toString() };
  } catch (e) {
    return { title, status: 'error' };
  }
}

async function run() {
  const allTitles = [
    ...CHARACTERS_FICTIONAL.map(c => c.wiki),
    ...PEOPLE.map(p => p.wiki)
  ];
  
  const uniqueTitles = [...new Set(allTitles)];
  console.log(`Checking ${uniqueTitles.length} unique titles...`);

  const results = [];
  // Run in batches of 5
  for (let i = 0; i < uniqueTitles.length; i += 5) {
    const batch = uniqueTitles.slice(i, i + 5);
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