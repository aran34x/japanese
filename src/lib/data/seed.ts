import type { Card, Deck } from '../types';
import { db, addCards } from '../db';
import { kanaTable } from './kana';
import { kanjiN5 } from './kanji';
import { vocab, readings } from './vocab';
import { phrasesN4 } from './phrases';
import { daysOfWeek, colors, months, grammar } from './topics';

// Deterministic id helper so re-seeding never duplicates builtin cards.
const id = (s: string) => s;

function deck(d: Omit<Deck, 'createdAt'>): Deck {
  return { ...d, createdAt: Date.now() };
}

export const BUILTIN_DECKS: Deck[] = [
  deck({ id: 'hiragana', name: { en: 'Hiragana', it: 'Hiragana' }, category: 'hiragana', builtin: true,
    description: { en: 'The full hiragana syllabary', it: 'Tutto il sillabario hiragana' } }),
  deck({ id: 'katakana', name: { en: 'Katakana', it: 'Katakana' }, category: 'katakana', builtin: true,
    description: { en: 'The full katakana syllabary', it: 'Tutto il sillabario katakana' } }),
  deck({ id: 'kanji-n5', name: { en: 'Kanji N5', it: 'Kanji N5' }, category: 'kanji', builtin: true,
    description: { en: 'Core JLPT N5 kanji', it: 'Kanji fondamentali JLPT N5' } }),
  deck({ id: 'vocab-n5', name: { en: 'Vocabulary N5', it: 'Vocaboli N5' }, category: 'vocab', builtin: true,
    description: { en: 'Common beginner words', it: 'Parole comuni per principianti' } }),
  deck({ id: 'reading', name: { en: 'Reading', it: 'Lettura' }, category: 'reading', builtin: true,
    description: { en: 'Short sentences to read', it: 'Brevi frasi da leggere' } }),
  deck({ id: 'phrases-n4', name: { en: 'Phrases N4', it: 'Frasi N4' }, category: 'reading', builtin: true,
    description: { en: 'Advanced everyday sentences', it: 'Frasi quotidiane avanzate' } }),
  deck({ id: 'days', name: { en: 'Days & Time', it: 'Giorni e tempo' }, category: 'vocab', builtin: true,
    description: { en: 'Days of the week and time words', it: 'Giorni della settimana e parole di tempo' } }),
  deck({ id: 'colors', name: { en: 'Colors', it: 'Colori' }, category: 'vocab', builtin: true,
    description: { en: 'Common colors', it: 'Colori comuni' } }),
  deck({ id: 'months', name: { en: 'Months', it: 'Mesi' }, category: 'vocab', builtin: true,
    description: { en: 'The twelve months', it: 'I dodici mesi' } }),
  deck({ id: 'grammar', name: { en: 'Grammar', it: 'Grammatica' }, category: 'reading', builtin: true,
    description: { en: 'Key sentence patterns (must, should, can…)', it: 'Strutture chiave (dovere, potere…)' } })
];

function buildCards(): Card[] {
  const cards: Card[] = [];

  kanaTable.forEach((k, i) => {
    cards.push({
      id: id(`hira-${k.romaji}`), deckId: 'hiragana', category: 'hiragana',
      front: k.hira, reading: k.hira, romaji: k.romaji,
      meaning: { en: k.romaji, it: k.romaji }, tags: ['hiragana'], order: i
    });
    cards.push({
      id: id(`kata-${k.romaji}`), deckId: 'katakana', category: 'katakana',
      front: k.kata, reading: k.kata, romaji: k.romaji,
      meaning: { en: k.romaji, it: k.romaji }, tags: ['katakana'], order: i
    });
  });

  kanjiN5.forEach((k, i) => {
    cards.push({
      id: id(`kanji-${k.kanji}`), deckId: 'kanji-n5', category: 'kanji',
      front: k.kanji, reading: k.reading,
      meaning: { en: k.en, it: k.it }, tags: ['jlpt-n5', 'kanji'], order: i
    });
  });

  vocab.forEach((v, i) => {
    cards.push({
      id: id(`vocab-${v.romaji}-${i}`), deckId: 'vocab-n5', category: 'vocab',
      front: v.word, reading: v.reading, romaji: v.romaji,
      meaning: { en: v.en, it: v.it }, tags: ['jlpt-n5', 'vocab', ...(v.tags ?? [])], order: i
    });
  });

  readings.forEach((r, i) => {
    cards.push({
      id: id(`reading-${i}`), deckId: 'reading', category: 'reading',
      front: r.text, reading: r.reading,
      meaning: { en: r.en, it: r.it }, tags: ['reading'], order: i
    });
  });

  phrasesN4.forEach((r, i) => {
    cards.push({
      id: id(`phrase-${i}`), deckId: 'phrases-n4', category: 'reading',
      front: r.text, reading: r.reading,
      meaning: { en: r.en, it: r.it }, tags: ['jlpt-n4', 'phrases'], order: i
    });
  });

  const topicDecks: [string, typeof daysOfWeek, string][] = [
    ['days', daysOfWeek, 'days'],
    ['colors', colors, 'colors'],
    ['months', months, 'months']
  ];
  for (const [deckId, list, tag] of topicDecks) {
    list.forEach((v, i) => {
      cards.push({
        id: id(`${deckId}-${i}`), deckId, category: 'vocab',
        front: v.word, reading: v.reading, romaji: v.romaji,
        meaning: { en: v.en, it: v.it }, tags: [tag], order: i
      });
    });
  }

  grammar.forEach((g, i) => {
    cards.push({
      id: id(`grammar-${i}`), deckId: 'grammar', category: 'reading',
      front: g.word, reading: g.reading, romaji: g.romaji,
      meaning: { en: g.en, it: g.it }, tags: ['grammar'], order: i
    });
  });

  return cards;
}

/**
 * Idempotent seeding. `addCards`/`bulkPut` won't clobber existing review
 * progress, so bumping SEED_VERSION safely adds newly-introduced builtin decks
 * for users who already seeded an earlier version.
 */
const SEED_VERSION = 3;
export async function ensureSeeded(): Promise<void> {
  const row = await db.meta.get('seedVersion');
  let current = (row?.value as number) ?? 0;
  // Migrate the old boolean flag (v1) to the numeric version.
  if (current === 0 && (await db.meta.get('seeded-v1'))) current = 1;
  if (current >= SEED_VERSION) return;
  await db.decks.bulkPut(BUILTIN_DECKS);
  await addCards(buildCards());
  await db.meta.put({ key: 'seedVersion', value: SEED_VERSION });
}
