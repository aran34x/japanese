import type { Card, Deck } from '../types';
import { db, addCards } from '../db';
import { kanaTable } from './kana';
import { kanjiN5 } from './kanji';
import { vocab, readings } from './vocab';

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
    description: { en: 'Short sentences to read', it: 'Brevi frasi da leggere' } })
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

  return cards;
}

/** Idempotent: seeds builtin decks/cards on first run. */
export async function ensureSeeded(): Promise<void> {
  const seeded = await db.meta.get('seeded-v1');
  if (seeded) return;
  await db.decks.bulkPut(BUILTIN_DECKS);
  await addCards(buildCards());
  await db.meta.put({ key: 'seeded-v1', value: true });
}
