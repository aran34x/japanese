/**
 * upload-skin-originals.mjs
 *
 * Uploads full-quality theme background originals to Supabase Storage while
 * keeping only compressed web assets in public/assets.
 *
 * Put original PNG/JPG/WebP/SVG files in ThemeBackgroundOriginals/:
 *   smash64.png
 *   sakura.png
 *   station.png
 *   nature.png
 *   comet.png
 *
 * Then run:
 *   set SUPABASE_SERVICE_KEY=...
 *   node scripts/upload-skin-originals.mjs
 *
 * Objects are written to:
 *   deck-media/skin-originals/<filename>
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE_DIR = process.env.SKIN_ORIGINALS_DIR || join(ROOT, 'ThemeBackgroundOriginals');

const SUPABASE_URL = 'https://zxzidyhyugjwgekcqobw.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = 'deck-media';
const PREFIX = 'skin-originals';

if (!SUPABASE_SERVICE_KEY) {
  console.error('\n  ERROR: SUPABASE_SERVICE_KEY required.\n');
  process.exit(1);
}

if (!existsSync(SOURCE_DIR)) {
  console.error(`\n  ERROR: source directory not found: ${SOURCE_DIR}\n`);
  process.exit(1);
}

const authHeaders = {
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`
};

function mimeFor(name) {
  const ext = name.toLowerCase().split('.').pop() ?? '';
  const map = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    svg: 'image/svg+xml'
  };
  return map[ext] ?? 'application/octet-stream';
}

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true })
  });
  if (res.ok) return;
  const body = await res.text();
  if (res.status === 409 || /exist|duplicate/i.test(body)) return;
  throw new Error(`Failed to create bucket (${res.status}): ${body}`);
}

async function uploadObject(key, bytes, contentType) {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'x-upsert': 'true'
    },
    body: bytes
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
}

function publicUrl(key) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`;
}

async function main() {
  await ensureBucket();
  const files = readdirSync(SOURCE_DIR)
    .filter((name) => /\.(png|jpe?g|webp|svg)$/i.test(name))
    .sort();

  if (!files.length) {
    console.error(`No original skin images found in ${SOURCE_DIR}`);
    process.exit(1);
  }

  for (const name of files) {
    const key = `${PREFIX}/${name}`;
    await uploadObject(key, readFileSync(join(SOURCE_DIR, name)), mimeFor(name));
    console.log(`Uploaded ${name}`);
    console.log(`  ${publicUrl(key)}`);
  }

  console.log(`\nDone. Uploaded ${files.length} skin original image(s).\n`);
}

main().catch((error) => {
  console.error('\n', error);
  process.exit(1);
});
