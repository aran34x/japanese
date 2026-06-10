// Lenient typed-answer matching. Beginners shouldn't fail on formatting:
// accents (lunedì vs lunedi), a leading "to " on verbs / an article, romaji
// long vowels (ohayou vs ohayo), or parenthetical notes in the expected answer.
// A match succeeds if ANY normalized variant of the typed text equals ANY
// variant of an accepted answer.

function base(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[。、．.!?，,;:'"’«»]/g, '')
    .trim();
}

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Leading particles a learner legitimately omits: EN "to/the/a/an", IT articles.
const LEADERS = /^(to|the|a|an|il|lo|la|le|gli|i|un|uno|una)\s+/;
function stripLeader(s: string): string {
  let out = s;
  for (let i = 0; i < 2; i++) out = out.replace(LEADERS, '');
  return out.replace(/^l'/, '');
}

// Romaji long-vowel tolerance: ohayou≈ohayo, kyou≈kyo, juu≈ju, ē/ō macrons.
function squashLongVowels(s: string): string {
  return s
    .replace(/ō/g, 'o').replace(/ū/g, 'u').replace(/ā/g, 'a').replace(/ē/g, 'e').replace(/ī/g, 'i')
    .replace(/ou/g, 'o')
    .replace(/([aeiou])\1/g, '$1');
}

/** All tolerated spellings of a string, from strict to loose. */
function variants(s: string): string[] {
  const v0 = base(s.replace(/\([^)]*\)/g, '')); // drop "(must do)"-style notes
  const v1 = stripAccents(v0);
  const v2 = stripLeader(v1);
  const v3 = squashLongVowels(v2);
  return [...new Set([v0, v1, v2, v3])].filter(Boolean);
}

/** Does the typed text match any accepted answer, leniently? */
export function matchesAnswer(typed: string, answers: string[]): boolean {
  const t = variants(typed);
  if (t.length === 0) return false;
  for (const a of answers) {
    const av = variants(a);
    if (t.some((x) => av.includes(x))) return true;
  }
  return false;
}
