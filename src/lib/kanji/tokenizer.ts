// Contextual furigana via kuromoji (a real Japanese morphological tokenizer).
// The ~18MB dictionary is served from /dict and loaded lazily the first time
// furigana is enabled; the browser caches it afterwards. Tokenizing turns a
// sentence into words with correct in-context readings (今日 → きょう, not
// いま+ひ), which per-character lookup can never do.
export interface FuriToken {
  surface: string;       // the word as written
  reading: string;       // hiragana reading of the whole word ('' if none)
  hasKanji: boolean;
}

type Tokenizer = {
  tokenize: (text: string) => Array<{ surface_form: string; reading?: string }>;
};

let tokenizer: Tokenizer | null = null;
let loading: Promise<Tokenizer | null> | null = null;

const KANJI = /[㐀-龯]/;
const kataToHira = (s: string) =>
  s.replace(/[ァ-ヶ]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));

// Resolve the dict path against the app's base URL (handles GitHub Pages
// sub-path deploys).
function dicPath(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}dict`.replace(/\/\/+/g, '/');
}

/** Begin loading the tokenizer (idempotent). Resolves to null on failure. */
export function loadTokenizer(): Promise<Tokenizer | null> {
  if (tokenizer) return Promise.resolve(tokenizer);
  if (loading) return loading;
  loading = (async () => {
    try {
      // Dynamic import keeps kuromoji out of the main bundle until furigana is
      // first enabled.
      const { default: kuromoji } = await import('@sglkc/kuromoji');
      return await new Promise<Tokenizer | null>((resolve) => {
        kuromoji.builder({ dicPath: dicPath() }).build((err: unknown, tk: Tokenizer) => {
          if (err) {
            console.warn('kuromoji load failed', err);
            resolve(null);
            return;
          }
          tokenizer = tk;
          resolve(tk);
        });
      });
    } catch (e) {
      console.warn('kuromoji init failed', e);
      return null;
    }
  })();
  return loading;
}

export function isTokenizerReady(): boolean {
  return tokenizer !== null;
}

/** Tokenize a sentence into words with hiragana readings. */
export function tokenize(text: string): FuriToken[] {
  if (!tokenizer) return [{ surface: text, reading: '', hasKanji: KANJI.test(text) }];
  return tokenizer.tokenize(text).map((t) => {
    const surface = t.surface_form;
    const hasKanji = KANJI.test(surface);
    // kuromoji gives katakana readings; convert to hiragana for furigana.
    const reading = hasKanji && t.reading ? kataToHira(t.reading) : '';
    return { surface, reading, hasKanji };
  });
}
