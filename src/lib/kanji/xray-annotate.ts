// Kanji X-ray overlay: when enabled, walks the visible DOM and draws an animated
// annotation above every kanji character — a cycling English meaning (white) and
// an alternating reading (kun in red, on in blue). Mirrors the furigana engine's
// DOM-walk + MutationObserver approach, but with a shared 0.6s ticker driving the
// cycle. Data comes from the on-demand kanji dictionary (cached in IndexedDB).
import { lookupKanji, isKanji } from './dict';

let enabled = false;
let observer: MutationObserver | null = null;
let scheduled = false;
let ticker: ReturnType<typeof setInterval> | null = null;
let tick = 0;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'RUBY', 'RT', 'RP', 'INPUT', 'TEXTAREA', 'SELECT', 'CODE']);
const KANJI = /[㐀-龯㐀-䶿]/;

interface Entry {
  readEl: HTMLElement;
  meanEl: HTMLElement;
  reads: { r: string; on: boolean }[]; // interleaved kun/on
  meanings: string[];
}
let entries: Entry[] = [];

const rootEl = () => document.getElementById('app');

// ── Slot width: pre-measure the widest hint so every slot fits the longest
// reading/meaning fully (no clipping) and stays a constant width (no jitter).
// Measured as a ratio to font-size (em) so it scales with any kanji size.
// Hint font sizes (px) — must match the CSS below so measurement is exact.
let measureCtx: CanvasRenderingContext2D | null = null;
let maxPx = 0;

interface RuntimeSizing {
  readingFontPx: number;
  meaningFontPx: number;
  slotMarginPx: number;
  slotMinWidthPx: number;
  hintCycleMs: number;
}

let sizing: RuntimeSizing = {
  readingFontPx: 15,
  meaningFontPx: 14,
  slotMarginPx: 10,
  slotMinWidthPx: 96,
  hintCycleMs: 2000
};

function cssNumber(name: string, fallback: number): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function readRuntimeSizing(): RuntimeSizing {
  sizing = {
    readingFontPx: Math.max(1, cssNumber('--xray-reading-font', 15)),
    meaningFontPx: Math.max(1, cssNumber('--xray-meaning-font', 14)),
    slotMarginPx: Math.max(0, cssNumber('--xray-slot-margin', 10)),
    slotMinWidthPx: Math.max(24, cssNumber('--xray-slot-min', 96)),
    hintCycleMs: Math.max(250, cssNumber('--xray-hint-cycle-ms', 2000))
  };
  return sizing;
}

/** Rendered pixel width of a string at the given weight/size. */
function measurePx(s: string, weight: number, px: number): number {
  if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
  if (!measureCtx) return s.length * px * 0.62;
  measureCtx.font = `${weight} ${px}px "Noto Sans JP", system-ui, sans-serif`;
  return measureCtx.measureText(s).width;
}

function considerWidths(reads: string[], meanings: string[]) {
  let grew = false;
  const upd = (w: number) => { if (w > maxPx) { maxPx = w; grew = true; } };
  for (const r of reads) upd(measurePx(r, 700, sizing.readingFontPx));
  for (const m of meanings) upd(measurePx(m, 600, sizing.meaningFontPx));
  if (grew) {
    // Fixed pixel slot -> wrapper width never depends on the cycling text.
    const slot = Math.max(sizing.slotMinWidthPx, Math.ceil(maxPx + sizing.slotMarginPx));
    document.documentElement.style.setProperty('--xray-slot', `${slot}px`);
  }
}

function recomputeSlotWidth() {
  readRuntimeSizing();
  maxPx = 0;
  document.documentElement.style.setProperty('--xray-slot', `${sizing.slotMinWidthPx}px`);
  for (const entry of entries) {
    considerWidths(entry.reads.map((r) => r.r), entry.meanings);
  }
}

function restartTicker() {
  if (ticker) clearInterval(ticker);
  ticker = setInterval(() => { tick++; paintAll(); }, sizing.hintCycleMs);
}

function inOurs(t: Node | null): boolean {
  const el = t instanceof HTMLElement ? t : (t?.parentElement ?? null);
  return !!el?.closest('[data-xray]');
}

function textNodes(el: HTMLElement): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('ruby,[data-furi],[data-xray]')) return NodeFilter.FILTER_REJECT;
      return KANJI.test(node.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

/** Build a kun/on interleaved reading list so they alternate as the ticker runs. */
function buildReads(kun: string[], on: string[]): { r: string; on: boolean }[] {
  const cleanKun = kun.map((r) => r.replace(/[.\-].*$/, '').trim()).filter(Boolean);
  const reads: { r: string; on: boolean }[] = [];
  const max = Math.max(cleanKun.length, on.length);
  for (let i = 0; i < max; i++) {
    if (cleanKun[i]) reads.push({ r: cleanKun[i], on: false });
    if (on[i]) reads.push({ r: on[i], on: true });
  }
  return reads;
}

function annotate(el: HTMLElement) {
  for (const textNode of textNodes(el)) {
    const text = textNode.nodeValue ?? '';
    const span = document.createElement('span');
    span.setAttribute('data-xray', '1');
    span.setAttribute('data-orig', text); // restore from this, never textContent

    for (const ch of text) {
      if (isKanji(ch)) {
        // The wrapper has an EXPLICIT fixed width + padding-top. The hint is
        // absolutely positioned inside it (out of flow), so the cycling text can
        // NEVER change the wrapper's width (zero jitter); the padding reserves
        // vertical room so the hint can't overlap the row above.
        const wrap = document.createElement('span');
        wrap.className = 'xray-kanji';
        wrap.appendChild(document.createTextNode(ch));
        const anno = document.createElement('span');
        anno.className = 'xray-anno';
        const read = document.createElement('span');
        read.className = 'xray-read';
        const mean = document.createElement('span');
        mean.className = 'xray-mean';
        anno.append(read, mean);
        wrap.appendChild(anno);
        span.appendChild(wrap);

        const entry: Entry = { readEl: read, meanEl: mean, reads: [], meanings: [] };
        entries.push(entry);
        void lookupKanji(ch).then((info) => {
          if (!info) return;
          entry.reads = buildReads(info.kun, info.on);
          entry.meanings = info.meanings;
          considerWidths(entry.reads.map((r) => r.r), entry.meanings);
          paintOne(entry);
        });
      } else {
        span.appendChild(document.createTextNode(ch));
      }
    }
    textNode.parentNode?.replaceChild(span, textNode);
  }
}

function paintOne(e: Entry) {
  if (e.reads.length) {
    const r = e.reads[tick % e.reads.length];
    e.readEl.textContent = r.r;
    e.readEl.style.color = r.on ? '#60a5fa' : '#f87171'; // on = blue, kun = red
  }
  if (e.meanings.length) {
    e.meanEl.textContent = e.meanings[tick % e.meanings.length];
  }
}

function paintAll() {
  for (const e of entries) paintOne(e);
}

function removeAll() {
  const r = rootEl();
  if (!r) return;
  r.querySelectorAll('[data-xray]').forEach((span) => {
    const orig = span.getAttribute('data-orig') ?? span.textContent ?? '';
    span.replaceWith(document.createTextNode(orig));
  });
  entries = [];
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => { scheduled = false; run(); }, 150);
}

function connect() {
  const r = rootEl();
  if (!r) return;
  observer = new MutationObserver((muts) => {
    // Ignore our own annotation churn (the ticker rewrites text inside [data-xray]).
    const relevant = muts.some(
      (m) => !inOurs(m.target) &&
        [...m.addedNodes].some((nd) => !(nd instanceof HTMLElement && nd.hasAttribute('data-xray')))
    );
    if (relevant) schedule();
  });
  observer.observe(r, { childList: true, subtree: true, characterData: true });
}

function run() {
  const r = rootEl();
  if (!r || !enabled) return;
  observer?.disconnect();
  annotate(r);
  if (enabled) connect();
}

export function enableXray() {
  if (enabled) return;
  enabled = true;
  document.documentElement.classList.add('xray-active');
  readRuntimeSizing();
  maxPx = 0; // recompute slot width fresh
  document.documentElement.style.setProperty('--xray-slot', `${sizing.slotMinWidthPx}px`);
  tick = 0;
  run();
  restartTicker();
}

export function refreshXraySizing() {
  if (!enabled) return;
  recomputeSlotWidth();
  restartTicker();
}

export function disableXray() {
  enabled = false;
  document.documentElement.classList.remove('xray-active');
  document.documentElement.style.removeProperty('--xray-slot');
  observer?.disconnect();
  observer = null;
  if (ticker) { clearInterval(ticker); ticker = null; }
  removeAll();
}
