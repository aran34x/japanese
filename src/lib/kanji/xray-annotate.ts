// Kanji X-ray — scrub-to-reveal.
//
// When active, a transparent CAPTURE layer is placed over the content (below the
// topbar/nav). It swallows every pointer event, so the underlying page is fully
// inert — nothing behind it can be clicked/scrolled. Drag a finger across it (or
// hover with a mouse) and a bubble follows above the pointer, reading whatever
// Japanese character is beneath it: kanji → kun (red) / on (blue) + meanings,
// kana → romaji. Tap empty space → exit. Kanji are kept full-colour above the
// dim veil; everything else is dimmed.
//
// Kanji are wrapped in *inline* spans (display unchanged → zero reflow) only to
// lift them above the veil. Hit-testing uses caret hit-testing against the text
// beneath the capture layer (we toggle the layer's pointer-events off for the
// single synchronous measurement).
import { lookupKanji, isKanji } from './dict';
import { kanaTable } from '../data/kana';
import { xrayOn } from './xray';

let enabled = false;
let observer: MutationObserver | null = null;
let scheduled = false;
let capture: HTMLDivElement | null = null;
let bubble: HTMLDivElement | null = null;
let cross: HTMLDivElement | null = null;
let hint: HTMLDivElement | null = null;

let dragging = false;
let rafId: number | null = null;
let pending: { x: number; y: number } | null = null;
let currentCh = '';
let lastX = 0;
let lastY = 0;
// Tap/exit tracking: only an undragged tap on empty space exits X-ray.
let downX = 0;
let downY = 0;
let moved = false;
let scannedJa = false;

const EDGE = 8;
const SCAN_LIFT = 104; // touch: scan this far ABOVE the finger so the fingertip never covers the crosshair
const TAP_SLOP = 10;  // movement (px) beyond which a touch counts as a drag, not a tap
const FINGER_GAP = 28; // bubble floats this far above the scan crosshair (clears the ring)
const SIDE_GAP = 26;   // gap when the bubble sits beside the crosshair instead

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'RUBY', 'RT', 'RP', 'INPUT', 'TEXTAREA', 'SELECT', 'CODE', 'BUTTON']);
const KANJI = /[㐀-龯㐀-䶿]/;
const isKana = (ch: string) => { const c = ch.codePointAt(0) ?? 0; return (c >= 0x3040 && c <= 0x309f) || (c >= 0x30a0 && c <= 0x30ff); };
const isJa = (ch: string) => isKanji(ch) || isKana(ch);

const ROMAJI = new Map<string, string>();
for (const k of kanaTable) {
  if ([...k.hira].length === 1) ROMAJI.set(k.hira, k.romaji);
  if ([...k.kata].length === 1) ROMAJI.set(k.kata, k.romaji);
}

const rootEl = () => document.getElementById('app');

// ── Lifecycle (exports consumed by App.svelte) ──────────────────────
export function enableXray() {
  if (enabled) return;
  enabled = true;
  document.documentElement.classList.add('xray-active');
  highlight(rootEl());
  connect();
  ensureCapture();
  showHint();
}

export function disableXray() {
  if (!enabled) return;
  enabled = false;
  document.documentElement.classList.remove('xray-active');
  observer?.disconnect();
  observer = null;
  capture?.remove();          // removing the node drops its listeners
  capture = null;
  hideBubble();
  cross?.remove();
  cross = null;
  removeHint();
  unhighlight();
}

export function refreshXraySizing() { /* popover reads CSS vars live */ }

// ── Capture layer (makes the page inert + is the only event target) ─
function ensureCapture(): HTMLDivElement {
  if (capture) return capture;
  const el = document.createElement('div');
  el.className = 'xray-capture';
  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
  el.addEventListener('pointerleave', onPointerLeave);
  el.addEventListener('click', onClick);
  document.body.appendChild(el);
  capture = el;
  return el;
}

// Transform a raw pointer into the SCAN point: touch is lifted above the finger
// (so the fingertip never covers what you're reading); mouse stays exact.
function handle(e: PointerEvent) {
  const lift = e.pointerType === 'mouse' ? 0 : SCAN_LIFT;
  queue(e.clientX, e.clientY - lift);
}

function onPointerDown(e: PointerEvent) {
  downX = e.clientX; downY = e.clientY; moved = false;
  if (e.pointerType !== 'mouse') { dragging = true; handle(e); }
}
function onPointerMove(e: PointerEvent) {
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > TAP_SLOP) moved = true;
  if (e.pointerType === 'mouse') handle(e);
  else if (dragging) handle(e);
}
function onPointerUp(e: PointerEvent) {
  if (e.pointerType !== 'mouse') { dragging = false; hideBubble(); hideCross(); }
}
function onPointerLeave(e: PointerEvent) {
  if (e.pointerType === 'mouse') { hideBubble(); hideCross(); }
}
function onClick() {
  // An undragged tap that wasn't over a Japanese character exits X-ray.
  if (!moved && !scannedJa) xrayOn.set(false);
}

function queue(x: number, y: number) {
  pending = { x, y };
  if (rafId == null) rafId = requestAnimationFrame(flush);
}
function flush() {
  rafId = null;
  const p = pending;
  pending = null;
  if (p) update(p.x, p.y);
}

function update(x: number, y: number) {
  positionCross(x, y);                                    // crosshair tracks the scan point
  lastX = x; lastY = y;
  if (bubble && !bubble.hidden) positionBubble(x, y);     // bubble trails the crosshair too
  const ch = charAtPoint(x, y);
  // Keep the last reading on momentary gaps (between glyphs) → no flicker.
  if (!ch || !isJa(ch)) { scannedJa = false; setCrossOn(false); return; }
  scannedJa = true; setCrossOn(true);
  if (ch !== currentCh) { currentCh = ch; void fillBubble(ch); }
  positionBubble(x, y);
}

// ── Crosshair (a ring + centre dot showing the precise scan point) ──
function ensureCross(): HTMLDivElement {
  if (cross) return cross;
  cross = document.createElement('div');
  cross.className = 'xray-cross';
  document.body.appendChild(cross);
  return cross;
}
function positionCross(x: number, y: number) {
  const el = ensureCross();
  el.hidden = false;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
}
function setCrossOn(on: boolean) {
  cross?.classList.toggle('is-on', on);
}
function hideCross() {
  if (cross) cross.hidden = true;
}

/** Char under a viewport point, hit-testing the text BENEATH the capture layer. */
function charAtPoint(x: number, y: number): string | null {
  const prev = capture?.style.pointerEvents;
  if (capture) capture.style.pointerEvents = 'none'; // see through to the text
  try {
    const doc = document as Document & {
      caretRangeFromPoint?: (x: number, y: number) => Range | null;
      caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    };
    let node: Node | null = null;
    let offset = 0;
    if (doc.caretRangeFromPoint) {
      const r = doc.caretRangeFromPoint(x, y);
      if (!r) return null;
      node = r.startContainer; offset = r.startOffset;
    } else if (doc.caretPositionFromPoint) {
      const p = doc.caretPositionFromPoint(x, y);
      if (!p) return null;
      node = p.offsetNode; offset = p.offset;
    } else return null;
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.nodeValue ?? '';
    for (const idx of [offset, offset - 1]) {
      if (idx < 0 || idx >= text.length) continue;
      if (isJa(text[idx])) {
        const range = document.createRange();
        range.setStart(node, idx); range.setEnd(node, idx + 1);
        const rect = range.getBoundingClientRect();
        if (x >= rect.left - 3 && x <= rect.right + 3) return text[idx];
      }
    }
    for (const idx of [offset, offset - 1]) {
      if (idx >= 0 && idx < text.length && isJa(text[idx])) return text[idx];
    }
    return null;
  } finally {
    if (capture) capture.style.pointerEvents = prev || 'auto';
  }
}

// ── Kanji highlight (inline wrap → no reflow) ───────────────────────
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

function highlight(root: HTMLElement | null) {
  if (!root) return;
  for (const node of textNodes(root)) {
    const text = node.nodeValue ?? '';
    const frag = document.createDocumentFragment();
    let buf = '';
    const flushBuf = () => { if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ''; } };
    for (const ch of text) {
      if (isKanji(ch)) {
        flushBuf();
        const s = document.createElement('span');
        s.className = 'xray-k';
        s.textContent = ch;
        frag.appendChild(s);
      } else buf += ch;
    }
    flushBuf();
    const wrap = document.createElement('span');
    wrap.setAttribute('data-xray', '1');
    wrap.setAttribute('data-orig', text);
    wrap.appendChild(frag);
    node.parentNode?.replaceChild(wrap, node);
  }
}

function unhighlight() {
  const root = rootEl();
  if (!root) return;
  root.querySelectorAll('[data-xray]').forEach((span) => {
    span.replaceWith(document.createTextNode(span.getAttribute('data-orig') ?? span.textContent ?? ''));
  });
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    if (!enabled) return;
    observer?.disconnect();
    highlight(rootEl());
    connect();
  });
}

function connect() {
  const root = rootEl();
  if (!root) return;
  observer = new MutationObserver((muts) => {
    const relevant = muts.some((m) => {
      const el = m.target instanceof HTMLElement ? m.target : m.target.parentElement;
      if (el?.closest('[data-xray]')) return false;
      return [...m.addedNodes].some((nd) => !(nd instanceof HTMLElement && nd.hasAttribute('data-xray')));
    });
    if (relevant) schedule();
  });
  observer.observe(root, { childList: true, subtree: true, characterData: true });
}

// ── Bubble ──────────────────────────────────────────────────────────
function ensureBubble(): HTMLDivElement {
  if (bubble) return bubble;
  bubble = document.createElement('div');
  bubble.className = 'xray-pop';
  bubble.setAttribute('data-xray-pop', '1');
  document.body.appendChild(bubble);
  return bubble;
}

async function fillBubble(ch: string) {
  const el = ensureBubble();
  el.hidden = false;
  removeHint();

  const head = document.createElement('div');
  head.className = 'xray-pop-kanji';
  head.textContent = ch;
  const body = document.createElement('div');
  body.className = 'xray-pop-body';
  el.replaceChildren(head, body);

  if (isKana(ch)) {
    const kind = (ch.codePointAt(0) ?? 0) >= 0x30a0 ? 'katakana' : 'hiragana';
    body.appendChild(readingRow(kind, ROMAJI.get(ch) ?? '—', 'xray-pop-on'));
    positionBubble(lastX, lastY);   // re-clamp now that height is known
    return;
  }

  body.textContent = '…';
  positionBubble(lastX, lastY);
  const info = await lookupKanji(ch);
  if (currentCh !== ch || !el.isConnected) return;
  body.textContent = '';
  if (!info) { body.textContent = '—'; positionBubble(lastX, lastY); return; }
  const kun = info.kun.map((r) => r.replace(/[.\-].*$/, '').trim()).filter(Boolean);
  if (kun.length) body.appendChild(readingRow('kun', kun.slice(0, 4).join('、'), 'xray-pop-kun'));
  if (info.on.length) body.appendChild(readingRow('on', info.on.slice(0, 4).join('、'), 'xray-pop-on'));
  if (info.meanings.length) {
    const m = document.createElement('div');
    m.className = 'xray-pop-mean';
    m.textContent = info.meanings.slice(0, 5).join(', ');
    body.appendChild(m);
  }
  positionBubble(lastX, lastY);    // content grew → keep it above the finger
}

function readingRow(tag: string, value: string, cls: string): HTMLElement {
  const row = document.createElement('div');
  row.className = cls;
  const t = document.createElement('span');
  t.className = 'xray-pop-tag';
  t.textContent = tag;
  row.append(t, document.createTextNode(' ' + value));
  return row;
}

// Place the bubble so it NEVER covers the finger: prefer above the crosshair,
// then to the right, then left; only if nothing fits, pin it to the top edge.
function positionBubble(x: number, y: number) {
  if (!bubble) return;
  const vw = window.innerWidth, vh = window.innerHeight;
  const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(v, hi));
  let left: number, top: number;
  if (y - bh - FINGER_GAP >= EDGE) {
    left = clamp(x - bw / 2, EDGE, vw - bw - EDGE);   // above (preferred)
    top = y - bh - FINGER_GAP;
  } else if (x + SIDE_GAP + bw <= vw - EDGE) {
    left = x + SIDE_GAP;                              // to the right
    top = clamp(y - bh / 2, EDGE, vh - bh - EDGE);
  } else if (x - SIDE_GAP - bw >= EDGE) {
    left = x - SIDE_GAP - bw;                         // to the left
    top = clamp(y - bh / 2, EDGE, vh - bh - EDGE);
  } else {
    left = clamp(x - bw / 2, EDGE, vw - bw - EDGE);   // last resort: top edge (still above finger)
    top = EDGE;
  }
  bubble.style.left = `${left}px`;
  bubble.style.top = `${top}px`;
}

function hideBubble() {
  currentCh = '';
  if (bubble) bubble.hidden = true;
}

// ── Hint ────────────────────────────────────────────────────────────
function showHint() {
  if (hint) return;
  hint = document.createElement('div');
  hint.className = 'xray-hint';
  hint.textContent = '🔍 Drag over the kanji';
  document.body.appendChild(hint);
}
function removeHint() { hint?.remove(); hint = null; }
