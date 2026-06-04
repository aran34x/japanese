import fs from 'fs';

let content = fs.readFileSync('src/lib/data/game/fictional.ts', 'utf8');

// The bad script produced:
// c(...), 'Wiki Title',
// Or c(...), 'Wiki Title'
// Specifically: `}), 'WikiTitle'` instead of `}, 'WikiTitle')`
// Wait, the regex matched up to `})`, so it was:
// `match` = `c(.... })`
// It replaced it with `${match}, 'WikiTitle'`
// Result: `c(.... }), 'WikiTitle'`

content = content.replace(/\}\), '([^']+)'/g, "}, '$1')");

fs.writeFileSync('src/lib/data/game/fictional.ts', content);

let pContent = fs.readFileSync('src/lib/data/game/people.ts', 'utf8');
pContent = pContent.replace(/\}\), '([^']+)'/g, "}, '$1')");
fs.writeFileSync('src/lib/data/game/people.ts', pContent);

console.log('Cleaned up broken parentheses!');