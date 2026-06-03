/**
 * extract-anki-decks.mjs
 *
 * Reads each .apkg in AnkiDecks/, uploads all media (audio/images) to
 * Supabase Storage, and writes card-data JSON to public/decks/.
 *
 * Run once whenever you add or update a deck:
 *   node scripts/extract-anki-decks.mjs
 *
 * Requires env var:
 *   SUPABASE_SERVICE_KEY=<service_role key from Supabase → Settings → API>
 *
 * The service key is only used here locally — never committed to git.
 * The publishable URL below is safe to hardcode (same as supabase-config.ts).
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { unzipSync } from 'fflate';
import initSqlJs from 'sql.js';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DECKS_DIR = join(ROOT, 'AnkiDecks');
const OUT_DIR = join(ROOT, 'public', 'decks');

const SUPABASE_URL = 'https://zxzidyhyugjwgekcqobw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'deck-media';

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY env var is required.');
  console.error('Find it in Supabase → Settings → API → service_role key.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// --- Field mapping (mirrors src/lib/anki/import.ts) ---

const hasKanji = (s) => /[一-龯]/.test(s);
const hasKana = (s) => /[぀-ゟ゠-ヿ]/.test(s);
const isJapanese = (s) => hasKanji(s) || hasKana(s);
const isKanaOnly = (s) => hasKana(s) && !hasKanji(s) && !/[a-zA-Z]/.test(s);
const isMetaField = (s) => /^(item|sentence|word|vocab(ulary)?|core\d*)[:\s]?\d*$/i.test(s.trim());

function parseField(html) {
  const media = [];
  html.replace(/\[sound:([^\]]+)\]/g, (_, f) => media.push(f));
  html.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (_, f) => media.push(f));
  const text = html
    .replace(/\[sound:[^\]]+\]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
  return { text, media };
}

function mapNoteFields(rawFields) {
  const parsed = rawFields.map(parseField);
  const media = parsed.flatMap((p) => p.media);
  const texts = parsed.map((p) => p.text);

  let frontIdx = texts.findIndex((t) => t && hasKanji(t) && !isMetaField(t));
  if (frontIdx === -1) frontIdx = texts.findIndex((t) => t && isJapanese(t) && !isMetaField(t));
  const front = frontIdx >= 0 ? texts[frontIdx] : (texts.find((t) => t && !isMetaField(t)) ?? '');

  const reading = texts.find(
    (t, i) => i !== frontIdx && t && isKanaOnly(t) && t !== front && !isMetaField(t)
  );

  const hasLatin = (t) => /[a-zA-Z]/.test(t);
  const meaning =
    texts.find((t, i) => i !== frontIdx && t !== reading && t && hasLatin(t) && !isMetaField(t)) ??
    texts.find((t, i) => i !== frontIdx && t && t !== reading && !isJapanese(t) && !isMetaField(t)) ??
    '';

  return { front, reading, meaning, media };
}

function mimeFor(name) {
  const ext = (name.toLowerCase().split('.').pop()) ?? '';
  const map = {
    mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm'
  };
  return map[ext] ?? 'application/octet-stream';
}

// --- Deck ID mapping ---

function deckIdFor(filename) {
  const f = filename.toLowerCase();
  if (f.includes('core_2000_2k') || f.includes('core_2000_-') || (f.includes('core_2000') && !f.includes('step'))) return 'anki-core-2000';
  if (f.includes('step_01') || f.includes('step01')) return 'anki-core-step01';
  if (f.includes('step_02') || f.includes('step02')) return 'anki-core-step02';
  if (f.includes('tae_kim') || f.includes('taekim')) return 'anki-tae-kim';
  if (f.includes('kaishi')) return 'anki-kaishi';
  // fallback: sanitise filename
  return 'anki-' + filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

const DECK_NAMES = {
  'anki-core-2000':  { en: 'Core 2000', it: 'Core 2000' },
  'anki-core-step01': { en: 'Core 2000 · Step 1', it: 'Core 2000 · Passo 1' },
  'anki-core-step02': { en: 'Core 2000 · Step 2', it: 'Core 2000 · Passo 2' },
  'anki-tae-kim':    { en: "Tae Kim's Grammar", it: 'Grammatica di Tae Kim' },
  'anki-kaishi':     { en: 'Kaishi Vocabulary', it: 'Vocabolario Kaishi' },
};

// --- Supabase Storage helpers ---

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`  Created bucket "${BUCKET}"`);
  }
}

async function uploadMedia(deckId, filename, data) {
  const path = `${deckId}/${filename}`;
  // Skip if already uploaded
  const { data: existing } = await supabase.storage.from(BUCKET).list(deckId, {
    search: filename, limit: 1
  });
  if (existing?.length) {
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  }
  const { error } = await supabase.storage.from(BUCKET).upload(path, data, {
    contentType: mimeFor(filename),
    upsert: false
  });
  if (error && !error.message.includes('already exists')) {
    throw new Error(`Upload failed for ${filename}: ${error.message}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

// --- Main extraction ---

async function extractDeck(apkgPath) {
  const filename = basename(apkgPath);
  const deckId = deckIdFor(filename);
  console.log(`\nProcessing: ${filename} → ${deckId}`);

  const buffer = readFileSync(apkgPath);
  const files = unzipSync(new Uint8Array(buffer));

  // Media map: { "0": "actual-filename.mp3", ... }
  let mediaMap = {};
  if (files['media']) {
    try { mediaMap = JSON.parse(new TextDecoder().decode(files['media'])); } catch {}
  }

  const wasmPath = join(ROOT, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
  const SQL = await initSqlJs({ locateFile: () => wasmPath });
  const dbFile = files['collection.anki21'] ?? files['collection.anki2'];
  if (!dbFile) throw new Error('No collection database found in .apkg');
  const sqlite = new SQL.Database(dbFile);

  // Upload media and collect filename → URL mapping
  console.log(`  Uploading media (${Object.keys(mediaMap).length} files)…`);
  const mediaUrlMap = new Map();
  let uploaded = 0;
  let skipped = 0;
  for (const [num, name] of Object.entries(mediaMap)) {
    const data = files[num];
    if (!data) { skipped++; continue; }
    try {
      const url = await uploadMedia(deckId, name, data);
      mediaUrlMap.set(name, url);
      uploaded++;
      if (uploaded % 100 === 0) process.stdout.write(`    ${uploaded} uploaded…\r`);
    } catch (e) {
      console.warn(`  Warning: ${e.message}`);
      skipped++;
    }
  }
  console.log(`  Media: ${uploaded} uploaded, ${skipped} skipped`);

  // Extract notes
  const res = sqlite.exec('SELECT flds, tags FROM notes');
  sqlite.close();

  const cards = [];
  if (res.length) {
    res[0].values.forEach((row, i) => {
      const flds = String(row[0]).split('\x1f');
      const tagStr = String(row[1] ?? '').trim();
      const m = mapNoteFields(flds);
      const audio = m.media.find((f) => /\.(mp3|ogg|wav|m4a)$/i.test(f));
      const image = m.media.find((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f));
      const video = m.media.find((f) => /\.(mp4|webm)$/i.test(f));

      const card = {
        id: `${deckId}-${i}`,
        deckId,
        category: 'custom',
        front: m.front || '(card)',
        reading: m.reading || undefined,
        meaning: { en: m.meaning, it: m.meaning },
        tags: tagStr ? tagStr.split(/\s+/).filter(Boolean) : ['anki'],
        order: i,
      };
      if (audio && mediaUrlMap.has(audio)) card.audioUrl = mediaUrlMap.get(audio);
      if (image && mediaUrlMap.has(image)) card.imageUrl = mediaUrlMap.get(image);
      if (video && mediaUrlMap.has(video)) card.videoUrl = mediaUrlMap.get(video);
      cards.push(card);
    });
  }
  console.log(`  Cards extracted: ${cards.length}`);

  const deck = {
    id: deckId,
    name: DECK_NAMES[deckId] ?? { en: filename.replace(/\.[^.]+$/, ''), it: filename.replace(/\.[^.]+$/, '') },
    category: 'custom',
    builtin: true,
    createdAt: Date.now(),
  };

  const outPath = join(OUT_DIR, `${deckId}.json`);
  writeFileSync(outPath, JSON.stringify({ deck, cards }));
  console.log(`  Written: public/decks/${deckId}.json (${Math.round(buffer.length / 1024 / 1024 * 10) / 10} MB → ${Math.round(JSON.stringify({ deck, cards }).length / 1024)} KB JSON)`);
}

async function main() {
  await ensureBucket();

  const apkgFiles = readdirSync(DECKS_DIR)
    .filter((f) => f.endsWith('.apkg'))
    .map((f) => join(DECKS_DIR, f));

  if (!apkgFiles.length) {
    console.error(`No .apkg files found in ${DECKS_DIR}`);
    process.exit(1);
  }

  for (const path of apkgFiles) {
    await extractDeck(path);
  }

  console.log('\nDone. Commit the files in public/decks/ to git.');
}

main().catch((e) => { console.error(e); process.exit(1); });
