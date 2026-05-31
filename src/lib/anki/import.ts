import { unzipSync } from 'fflate';
import initSqlJs from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { Card, Deck, MediaBlob } from '../types';
import { db, addCards } from '../db';

export interface ImportResult {
  deckId: string;
  cardsAdded: number;
  mediaAdded: number;
}

const uid = () => Math.random().toString(36).slice(2, 10);

function mimeFor(name: string): string {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  const map: Record<string, string> = {
    mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm'
  };
  return map[ext] ?? 'application/octet-stream';
}

/** Strip basic HTML and extract any media filenames referenced in a field. */
function parseField(html: string): { text: string; media: string[] } {
  const media: string[] = [];
  html.replace(/\[sound:([^\]]+)\]/g, (_, f) => (media.push(f), ''));
  html.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (_, f) => (media.push(f), ''));
  const text = html
    .replace(/\[sound:[^\]]+\]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
  return { text, media };
}

async function createDeck(name: string, builtin = false): Promise<Deck> {
  const deck: Deck = {
    id: `import-${uid()}`,
    name: { en: name, it: name },
    category: 'custom',
    builtin,
    createdAt: Date.now()
  };
  await db.decks.put(deck);
  return deck;
}

/** Import a simple CSV / TSV / TXT export: front[,reading][,meaning][,tags]. */
export async function importDelimited(text: string, fileName: string): Promise<ImportResult> {
  const deck = await createDeck(fileName.replace(/\.[^.]+$/, ''));
  const lines = text.split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'));
  const delim = lines[0]?.includes('\t') ? '\t' : ',';
  const cards: Card[] = lines.map((line, i) => {
    const cols = line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ''));
    const [front, reading, meaning, tags] = cols;
    return {
      id: `${deck.id}-${i}`,
      deckId: deck.id,
      category: 'custom',
      front: front ?? '',
      reading: reading || undefined,
      meaning: { en: meaning || '', it: meaning || '' },
      tags: tags ? tags.split(/[ ,]+/).filter(Boolean) : ['imported'],
      order: i
    };
  });
  await addCards(cards);
  return { deckId: deck.id, cardsAdded: cards.length, mediaAdded: 0 };
}

/** Import an Anki .apkg (zip with sqlite + media). Imports text and media. */
export async function importApkg(buffer: ArrayBuffer, fileName: string): Promise<ImportResult> {
  const files = unzipSync(new Uint8Array(buffer));

  // media map: { "0": "filename.mp3", ... }
  let mediaMap: Record<string, string> = {};
  if (files['media']) {
    try {
      mediaMap = JSON.parse(new TextDecoder().decode(files['media']));
    } catch {
      mediaMap = {};
    }
  }

  const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
  const dbFile = files['collection.anki21'] ?? files['collection.anki2'];
  if (!dbFile) throw new Error('No collection database found in .apkg');
  const sqlite = new SQL.Database(dbFile);

  const deck = await createDeck(fileName.replace(/\.[^.]+$/, ''));

  // Store media blobs, mapping anki numeric name -> our media id.
  const mediaByFilename = new Map<string, string>();
  const blobs: MediaBlob[] = [];
  for (const [num, name] of Object.entries(mediaMap)) {
    const data = files[num];
    if (!data) continue;
    const m: MediaBlob = {
      id: `${deck.id}-m-${num}`,
      mime: mimeFor(name),
      blob: new Blob([data], { type: mimeFor(name) }),
      filename: name
    };
    blobs.push(m);
    mediaByFilename.set(name, m.id);
  }
  if (blobs.length) await db.media.bulkPut(blobs);

  // Read notes (flds separated by 0x1f). First field = front, second = back.
  const res = sqlite.exec('SELECT flds, tags FROM notes');
  const cards: Card[] = [];
  if (res.length) {
    res[0].values.forEach((row, i) => {
      const flds = String(row[0]).split('');
      const tagStr = String(row[1] ?? '').trim();
      const front = parseField(flds[0] ?? '');
      const back = parseField(flds[1] ?? '');
      const allMedia = [...front.media, ...back.media];
      const audio = allMedia.find((f) => /\.(mp3|ogg|wav|m4a)$/i.test(f));
      const image = allMedia.find((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
      const video = allMedia.find((f) => /\.(mp4|webm)$/i.test(f));
      cards.push({
        id: `${deck.id}-${i}`,
        deckId: deck.id,
        category: 'custom',
        front: front.text || flds[0] || '(card)',
        meaning: { en: back.text, it: back.text },
        audioId: audio ? mediaByFilename.get(audio) : undefined,
        imageId: image ? mediaByFilename.get(image) : undefined,
        videoId: video ? mediaByFilename.get(video) : undefined,
        tags: tagStr ? tagStr.split(/\s+/).filter(Boolean) : ['imported'],
        order: i
      });
    });
  }
  sqlite.close();
  await addCards(cards);
  return { deckId: deck.id, cardsAdded: cards.length, mediaAdded: blobs.length };
}

/** Dispatch by file type. */
export async function importFile(file: File): Promise<ImportResult> {
  if (file.name.toLowerCase().endsWith('.apkg')) {
    return importApkg(await file.arrayBuffer(), file.name);
  }
  return importDelimited(await file.text(), file.name);
}
