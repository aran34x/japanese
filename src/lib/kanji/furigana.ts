// Global furigana: when enabled, walks the visible DOM and renders the reading
// above every kanji using <ruby>, anywhere in the app. Re-applies on DOM
// changes (route navigation, new cards) via a MutationObserver.
import { lookupKanji, isKanji } from './dict';

let observer: MutationObserver | null = null;
let enabled = false;
let scheduled = false;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'RUBY', 'RT', 'RP', 'INPUT', 'TEXTAREA', 'SELECT', 'CODE']);

function root(): HTMLElement | null {
  return document.getElementById('app');
}

/** Collect unique kanji currently visible (so we can prefetch readings). */
function collectKanji(el: HTMLElement): Set<string> {
  const set = new Set<string>();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('ruby,[data-furi]')) return NodeFilter.FILTER_REJECT;
      return /[㐀-龯]/.test(node.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let n: Node | null;
  while ((n = walker.nextNode())) {
    for (const ch of n.nodeValue ?? '') if (isKanji(ch)) set.add(ch);
  }
  return set;
}

/** Replace qualifying text nodes with spans containing per-kanji <ruby>. */
function annotate(el: HTMLElement, reading: (k: string) => string) {
  const targets: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('ruby,[data-furi]')) return NodeFilter.FILTER_REJECT;
      return /[㐀-龯]/.test(node.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let n: Node | null;
  while ((n = walker.nextNode())) targets.push(n as Text);

  for (const textNode of targets) {
    const text = textNode.nodeValue ?? '';
    const span = document.createElement('span');
    span.setAttribute('data-furi', '1');
    for (const ch of text) {
      if (isKanji(ch)) {
        const r = reading(ch);
        if (r) {
          const ruby = document.createElement('ruby');
          ruby.textContent = ch;
          const rt = document.createElement('rt');
          rt.textContent = r;
          rt.style.fontSize = '0.5em';
          rt.style.color = '#f9a8d4';
          ruby.appendChild(rt);
          span.appendChild(ruby);
          continue;
        }
      }
      span.appendChild(document.createTextNode(ch));
    }
    textNode.parentNode?.replaceChild(span, textNode);
  }
}

/** Undo all annotations, restoring plain text. */
function removeAll() {
  const r = root();
  if (!r) return;
  r.querySelectorAll('[data-furi]').forEach((span) => {
    span.replaceWith(document.createTextNode(span.textContent ?? ''));
  });
}

async function run() {
  const r = root();
  if (!r || !enabled) return;
  const kanji = collectKanji(r);
  if (kanji.size === 0) return;
  // Prefetch all readings, then annotate synchronously.
  const map = new Map<string, string>();
  await Promise.all(
    [...kanji].map(async (k) => {
      const info = await lookupKanji(k);
      map.set(k, info?.primary ?? '');
    })
  );
  observer?.disconnect();
  annotate(r, (k) => map.get(k) ?? '');
  if (enabled) connect();
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  setTimeout(() => {
    scheduled = false;
    void run();
  }, 150);
}

function connect() {
  const r = root();
  if (!r) return;
  observer = new MutationObserver((muts) => {
    // Ignore our own ruby insertions.
    const relevant = muts.some((m) =>
      [...m.addedNodes].some((nd) => !(nd instanceof HTMLElement && nd.hasAttribute('data-furi')))
    );
    if (relevant) schedule();
  });
  observer.observe(r, { childList: true, subtree: true, characterData: true });
}

export function enableFurigana() {
  if (enabled) return;
  enabled = true;
  void run();
  connect();
}

export function disableFurigana() {
  enabled = false;
  observer?.disconnect();
  observer = null;
  removeAll();
}
