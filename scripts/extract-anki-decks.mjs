/**
 * extract-anki-decks.mjs
 *
 * Reads each .apkg in AnkiDecks/, uploads media to Supabase Storage (numeric
 * keys), and writes card-data JSON to public/decks/. Cards are mapped by the
 * Anki note-type's FIELD NAMES (not guessed), and instructional "info" notes
 * are skipped.
 *
 *   set SUPABASE_SERVICE_KEY=...   (needed unless SKIP_UPLOAD=1)
 *   npm run extract-decks
 *
 * Env:
 *   SUPABASE_SERVICE_KEY  service_role key (Supabase → Settings → API)
 *   SKIP_UPLOAD=1         media already uploaded → only regenerate JSON (fast)
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import { unzipSync } from 'fflate';
import initSqlJs from 'sql.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DECKS_DIR = join(ROOT, 'AnkiDecks');
const OUT_DIR = join(ROOT, 'public', 'decks');

const SUPABASE_URL = 'https://zxzidyhyugjwgekcqobw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SKIP_UPLOAD = process.env.SKIP_UPLOAD === '1';
const BUCKET = 'deck-media';
const UPLOAD_CONCURRENCY = 12;

if (!SKIP_UPLOAD && !SUPABASE_SERVICE_KEY) {
  console.error('\n  ERROR: SUPABASE_SERVICE_KEY required (or set SKIP_UPLOAD=1 to only regenerate JSON).\n');
  process.exit(1);
}
const authHeaders = SUPABASE_SERVICE_KEY
  ? { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
  : {};

// ── Text helpers ────────────────────────────────────────────────────
const hasKanji = (s) => /[一-龯]/.test(s);
const hasKana = (s) => /[぀-ゟ゠-ヿ]/.test(s);
const isJapanese = (s) => hasKanji(s) || hasKana(s);

/** Strip HTML, [sound:], Anki furigana brackets and cloze placeholders. */
function clean(html) {
  return String(html ?? '')
    .replace(/\[sound:[^\]]+\]/g, '')
    .replace(/<br\s*\/?>/gi, ' ')                       // line breaks → space
    .replace(/<\/(div|p|li|tr|h[1-6])>/gi, ' ')         // block ends → space
    .replace(/<[^>]+>/g, '')
    .replace(/\[[^\]]*\]/g, '')      // furigana 一[ひと] → 一
    .replace(/（\s*）|\(\s*\)/g, '')  // cloze blanks
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function extOf(name) {
  const e = name.toLowerCase().split('.').pop() ?? '';
  return /^[a-z0-9]+$/.test(e) ? e : 'bin';
}
function mimeFor(name) {
  const map = {
    mp3: 'audio/mpeg', ogg: 'audio/ogg', wav: 'audio/wav', m4a: 'audio/mp4',
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
    webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', webm: 'video/webm'
  };
  return map[extOf(name)] ?? 'application/octet-stream';
}

// ── Field-name based note mapping ───────────────────────────────────
const FRONT_PATTERNS = [/vocab.*kanji/i, /jlab.?kanji$/i, /^kanji/i, /expression/i, /^word/i, /term/i, /^front/i, /question/i, /^sentence/i, /japanese/i];
const READING_PATTERNS = [/vocab.*kana/i, /jlab.?hiragana$/i, /^reading$/i, /furigana/i, /hiragana$/i, /^kana/i, /yomi/i];
const MEANING_PATTERNS = [/vocab.*english/i, /jlab.?translation/i, /^meaning$/i, /translation/i, /english/i, /definition/i, /gloss/i];
const MEANING_FALLBACK = [/remarksback/i, /other.?back/i, /^notes?$/i]; // NOT RemarksFront
const NOTES_PATTERNS = [/remarksfront/i, /^explanation/i, /^note$/i]; // back-of-card explanation
const AUDIO_PATTERNS = [/vocab.*audio/i, /^audio$/i, /sound/i];
const IMAGE_PATTERNS = [/image/i, /picture/i, /photo/i];

function pickText(map, patterns, requireJa = false) {
  for (const re of patterns) {
    for (const name of Object.keys(map)) {
      if (!re.test(name)) continue;
      const t = clean(map[name]);
      if (t && (!requireJa || isJapanese(t))) return t;
    }
  }
  return '';
}

function extractMediaFilename(raw, extRe) {
  const s = String(raw ?? '');
  const snd = s.match(/\[sound:([^\]]+)\]/);
  if (snd && extRe.test(snd[1])) return snd[1];
  const img = s.match(/<img[^>]*src=["']?([^"'>\s]+)/i);
  if (img && extRe.test(img[1])) return img[1];
  const bare = s.trim();
  if (extRe.test(bare) && !/\s/.test(bare)) return bare;
  return null;
}
function pickMedia(map, namePatterns, extRe) {
  for (const re of namePatterns) {
    for (const name of Object.keys(map)) {
      if (!re.test(name)) continue;
      const f = extractMediaFilename(map[name], extRe);
      if (f) return f;
    }
  }
  for (const name of Object.keys(map)) {
    const f = extractMediaFilename(map[name], extRe);
    if (f) return f;
  }
  return null;
}

/** Map one note → card fields, or null to SKIP (info/junk notes). */
function mapNote(model, flds) {
  if (!model || /info|notice|instruction/i.test(model.name)) return null;
  const map = {};
  model.flds.forEach((f, j) => { map[f.name] = flds[j] ?? ''; });

  const front = pickText(map, FRONT_PATTERNS, true);
  if (!front) return null; // no Japanese front → not a study card

  let reading = pickText(map, READING_PATTERNS, false);
  if (reading === front) reading = '';
  let meaning = pickText(map, MEANING_PATTERNS, false) || pickText(map, MEANING_FALLBACK, false) || '';
  // Strip a leading romaji prefix like "ohayou: good morning" → "good morning".
  meaning = meaning.replace(/^[A-Za-zāōūēī'’-]{2,}:\s+/, '').trim();
  const notes = pickText(map, NOTES_PATTERNS, false);

  const AUDIO_RE = /\.(mp3|ogg|wav|m4a)$/i;
  const IMG_RE = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return {
    front,
    reading: reading || undefined,
    meaning,
    notes: notes || undefined,
    audio: pickMedia(map, AUDIO_PATTERNS, AUDIO_RE),
    image: pickMedia(map, IMAGE_PATTERNS, IMG_RE)
  };
}

// ── Deck identity ───────────────────────────────────────────────────
function deckIdFor(filename) {
  const f = filename.toLowerCase();
  if (f.includes('step_01') || f.includes('step01')) return 'anki-core-step01';
  if (f.includes('step_02') || f.includes('step02')) return 'anki-core-step02';
  if (f.includes('core_2000')) return 'anki-core-2000';
  if (f.includes('tae_kim') || f.includes('taekim') || f.includes('tae kim')) return 'anki-tae-kim';
  if (f.includes('kaishi')) return 'anki-kaishi';
  return 'anki-' + filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}
const DECK_NAMES = {
  'anki-core-2000':   { en: 'Core 2000', it: 'Core 2000' },
  'anki-core-step01': { en: 'Core 2000 · Step 1', it: 'Core 2000 · Passo 1' },
  'anki-core-step02': { en: 'Core 2000 · Step 2', it: 'Core 2000 · Passo 2' },
  'anki-tae-kim':     { en: "Tae Kim's Grammar", it: 'Grammatica di Tae Kim' },
  'anki-kaishi':      { en: 'Kaishi Vocabulary', it: 'Vocabolario Kaishi' }
};

// ── Supabase Storage (REST) ─────────────────────────────────────────
async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true })
  });
  if (res.ok) { console.log(`  Created public bucket "${BUCKET}"`); return; }
  const body = await res.text();
  if (res.status === 409 || /exist|duplicate/i.test(body)) return;
  throw new Error(`Failed to create bucket (${res.status}): ${body}`);
}
async function uploadObject(key, bytes, contentType) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': contentType, 'Cache-Control': 'public, max-age=31536000, immutable', 'x-upsert': 'true' },
    body: bytes
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}
const publicUrl = (key) => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`;

async function runPool(items, worker, concurrency, onProgress) {
  let i = 0, done = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      await worker(items[idx], idx);
      if (onProgress && ++done % 50 === 0) onProgress(done, items.length);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, next));
}

// ── Per-deck extraction ─────────────────────────────────────────────
async function extractDeck(apkgPath) {
  const filename = basename(apkgPath);
  const deckId = deckIdFor(filename);
  console.log(`\nProcessing ${filename}  →  ${deckId}`);

  const files = unzipSync(new Uint8Array(readFileSync(apkgPath)));
  let mediaMap = {};
  if (files['media']) { try { mediaMap = JSON.parse(new TextDecoder().decode(files['media'])); } catch {} }

  const SQL = await initSqlJs({ locateFile: () => join(ROOT, 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm') });
  const dbFile = files['collection.anki21'] ?? files['collection.anki2'];
  if (!dbFile) throw new Error('No collection database found in .apkg');
  const sqlite = new SQL.Database(dbFile);
  const models = JSON.parse(sqlite.exec('SELECT models FROM col')[0].values[0][0]);

  // Media: original filename → public URL (numeric storage keys).
  const entries = Object.entries(mediaMap).filter(([num]) => files[num]);
  const urlByName = new Map();
  if (SKIP_UPLOAD) {
    for (const [num, name] of entries) urlByName.set(name, publicUrl(`${deckId}/${num}.${extOf(name)}`));
    console.log(`  (skip-upload) reusing ${entries.length} media URLs`);
  } else {
    console.log(`  Uploading ${entries.length} media files…`);
    let failed = 0;
    await runPool(entries, async ([num, name]) => {
      const key = `${deckId}/${num}.${extOf(name)}`;
      try { await uploadObject(key, files[num], mimeFor(name)); urlByName.set(name, publicUrl(key)); }
      catch { failed++; }
    }, UPLOAD_CONCURRENCY, (d, t) => process.stdout.write(`    ${d}/${t}\r`));
    console.log(`    ${entries.length - failed}/${entries.length} uploaded${failed ? ` (${failed} failed)` : ''}      `);
  }

  // Notes → cards (name-based mapping, junk skipped).
  const res = sqlite.exec('SELECT mid, flds, tags FROM notes');
  sqlite.close();

  const cards = [];
  let skipped = 0;
  if (res.length) {
    for (const row of res[0].values) {
      const model = models[String(row[0])];
      const flds = String(row[1]).split('\x1f');
      const tagStr = String(row[2] ?? '').trim();
      const m = mapNote(model, flds);
      if (!m) { skipped++; continue; }
      const order = cards.length;
      const card = {
        id: `${deckId}-${order}`,
        deckId,
        category: 'custom',
        front: m.front,
        reading: m.reading,
        meaning: { en: m.meaning, it: m.meaning },
        tags: tagStr ? tagStr.split(/\s+/).filter(Boolean) : ['anki'],
        order
      };
      if (m.notes) card.notes = { en: m.notes, it: m.notes };
      if (m.audio && urlByName.has(m.audio)) card.audioUrl = urlByName.get(m.audio);
      if (m.image && urlByName.has(m.image)) card.imageUrl = urlByName.get(m.image);
      cards.push(card);
    }
  }

  const deck = {
    id: deckId,
    name: DECK_NAMES[deckId] ?? { en: filename.replace(/\.[^.]+$/, ''), it: filename.replace(/\.[^.]+$/, '') },
    category: 'custom', builtin: true, createdAt: Date.now()
  };
  const json = JSON.stringify({ deck, cards });
  writeFileSync(join(OUT_DIR, `${deckId}.json`), json);
  const withAudio = cards.filter((c) => c.audioUrl).length;
  const withImg = cards.filter((c) => c.imageUrl).length;
  console.log(`  Wrote ${deckId}.json — ${cards.length} cards (skipped ${skipped} junk) · audio ${withAudio} · img ${withImg} · ${Math.round(json.length / 1024)} KB`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  if (!SKIP_UPLOAD) await ensureBucket();
  const apkgs = readdirSync(DECKS_DIR).filter((f) => f.toLowerCase().endsWith('.apkg')).map((f) => join(DECKS_DIR, f));
  if (!apkgs.length) { console.error(`No .apkg files in ${DECKS_DIR}`); process.exit(1); }
  for (const p of apkgs) await extractDeck(p);
  console.log('\nDone. Commit public/decks/*.json with deploy.bat.\n');
}
main().catch((e) => { console.error('\n', e); process.exit(1); });
