// Global furigana: when enabled, walks the visible DOM and renders the reading
// above kanji words using <ruby>, anywhere in the app. Uses the kuromoji
// tokenizer so readings are correct IN CONTEXT (今日 → きょう as a word), not
// per-character. Re-applies on DOM changes via a MutationObserver.
import { loadTokenizer, tokenize, isTokenizerReady } from './tokenizer';

let observer: MutationObserver | null = null;
let enabled = false;
let scheduled = false;

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'RUBY', 'RT', 'RP', 'INPUT', 'TEXTAREA', 'SELECT', 'CODE']);
const KANJI = /[㐀-龯]/;

function root(): HTMLElement | null {
  return document.getElementById('app');
}

function textNodesToAnnotate(el: HTMLElement): Text[] {
  const out: Text[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('ruby,[data-furi]')) return NodeFilter.FILTER_REJECT;
      return KANJI.test(node.nodeValue ?? '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  let n: Node | null;
  while ((n = walker.nextNode())) out.push(n as Text);
  return out;
}

/** Replace each kanji-bearing text node with per-word <ruby> annotations. */
function annotate(el: HTMLElement) {
  for (const textNode of textNodesToAnnotate(el)) {
    const text = textNode.nodeValue ?? '';
    const span = document.createElement('span');
    span.setAttribute('data-furi', '1');
    span.setAttribute('data-orig', text); // restore from this, never textContent
    for (const tok of tokenize(text)) {
      if (tok.hasKanji && tok.reading) {
        const ruby = document.createElement('ruby');
        ruby.textContent = tok.surface;
        const rt = document.createElement('rt');
        rt.textContent = tok.reading;
        rt.style.fontSize = '0.5em';
        rt.style.color = '#f9a8d4';
        ruby.appendChild(rt);
        span.appendChild(ruby);
      } else {
        span.appendChild(document.createTextNode(tok.surface));
      }
    }
    textNode.parentNode?.replaceChild(span, textNode);
  }
}

/** Undo all annotations, restoring the original text verbatim. */
function removeAll() {
  const r = root();
  if (!r) return;
  r.querySelectorAll('[data-furi]').forEach((span) => {
    const orig = span.getAttribute('data-orig') ?? span.textContent ?? '';
    span.replaceWith(document.createTextNode(orig));
  });
}

async function run() {
  const r = root();
  if (!r || !enabled) return;
  // Ensure the tokenizer is loaded before annotating (first time may take a
  // moment to fetch the dictionary).
  if (!isTokenizerReady()) await loadTokenizer();
  if (!enabled) return; // toggled off while loading
  observer?.disconnect();
  annotate(r);
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
}

export function disableFurigana() {
  enabled = false;
  observer?.disconnect();
  observer = null;
  removeAll();
}
