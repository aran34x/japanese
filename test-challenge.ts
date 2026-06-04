import { CHARACTERS_FICTIONAL, buildCharChallenge } from './src/lib/data/game/fictional.js';

const impa = CHARACTERS_FICTIONAL.find(c => c.id === 'impa');
const challenge = buildCharChallenge(impa);

challenge.forEach((q, i) => {
   console.log(`\n--- Q${i+1} ---`);
   console.log(`Instr: ${q.instruction.en}`);
   console.log(`Show: ${q.show}`);
   console.log(`Options: ${q.options.map(o => o.en || o.text).join(' | ')}`);
});