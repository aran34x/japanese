// Save-file backup & restore. Everything the user accumulates lives in
// IndexedDB (see db.ts): decks, cards, SRS review state, imported media, game
// progress, settings, and cached wiki data. This serializes all of it to a
// single JSON file the user can save anywhere (incl. their own cloud drive),
// and restore on another device. Media blobs are base64-encoded inline.
import { db } from './db';
import { APP_VERSION } from './version';

interface BackupShape {
  app: 'nihongo-quest';
  version: string;
  exportedAt: number;
  decks: unknown[];
  cards: unknown[];
  reviews: unknown[];
  meta: unknown[];
  media: { id: string; mime: string; filename?: string; b64: string }[];
}

function blobToB64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1] ?? '');
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

function b64ToBlob(b64: string, mime: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function exportBackup(): Promise<Blob> {
  const [decks, cards, reviews, meta, mediaRows] = await Promise.all([
    db.decks.toArray(),
    db.cards.toArray(),
    db.reviews.toArray(),
    db.meta.toArray(),
    db.media.toArray()
  ]);
  // Skip cached wiki entries to keep the file small & avoid stale data.
  const cleanMeta = meta.filter((m) => !String(m.key).startsWith('wiki:'));
  const media = await Promise.all(
    mediaRows.map(async (m) => ({
      id: m.id,
      mime: m.mime,
      filename: m.filename,
      b64: await blobToB64(m.blob)
    }))
  );
  const data: BackupShape = {
    app: 'nihongo-quest',
    version: APP_VERSION,
    exportedAt: Date.now(),
    decks,
    cards,
    reviews,
    meta: cleanMeta,
    media
  };
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

export function downloadBackup(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `nihongo-quest-backup-${stamp}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importBackup(file: File): Promise<{ cards: number; decks: number }> {
  const text = await file.text();
  const data = JSON.parse(text) as BackupShape;
  if (data.app !== 'nihongo-quest') throw new Error('Not a Nihongo Quest backup file');

  await db.transaction('rw', [db.decks, db.cards, db.reviews, db.meta, db.media], async () => {
    if (data.decks?.length) await db.decks.bulkPut(data.decks as never);
    if (data.cards?.length) await db.cards.bulkPut(data.cards as never);
    if (data.reviews?.length) await db.reviews.bulkPut(data.reviews as never);
    if (data.meta?.length) await db.meta.bulkPut(data.meta as never);
    if (data.media?.length) {
      await db.media.bulkPut(
        data.media.map((m) => ({
          id: m.id,
          mime: m.mime,
          filename: m.filename,
          blob: b64ToBlob(m.b64, m.mime)
        })) as never
      );
    }
  });
  return { cards: data.cards?.length ?? 0, decks: data.decks?.length ?? 0 };
}
