// On-demand kanji dictionary. Each kanji is fetched once from kanjiapi.dev
// (free, KANJIDIC/JMdict-based, CC-licensed) and cached in IndexedDB, so the
// X-ray works offline after a kanji has been seen once. Runs in the browser,
// so the CDN/API is reachable at runtime.
import { db } from '../db';

export interface KanjiInfo {
  kanji: string;
  on: string[]; // on'yomi (katakana)
  kun: string[]; // kun'yomi (hiragana)
  meanings: string[];
  /** primary reading for furigana display (kun preferred, else on) */
  primary: string;
  fetchedAt: number;
}

const mem = new Map<string, KanjiInfo | null>();
const inflight = new Map<string, Promise<KanjiInfo | null>>();

export function isKanji(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return (c >= 0x4e00 && c <= 0x9faf) || (c >= 0x3400 && c <= 0x4dbf);
}

// Convert katakana on-readings to hiragana for nicer furigana display.
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));
}

export async function lookupKanji(ch: string): Promise<KanjiInfo | null> {
  if (!isKanji(ch)) return null;
  if (mem.has(ch)) return mem.get(ch)!;
  if (inflight.has(ch)) return inflight.get(ch)!;

  const p = (async (): Promise<KanjiInfo | null> => {
    // IndexedDB cache first.
    const cached = await db.meta.get(`kanji:${ch}`);
    if (cached?.value) {
      mem.set(ch, cached.value as KanjiInfo);
      return cached.value as KanjiInfo;
    }
    try {
      const res = await fetch(`https://kanjiapi.dev/v1/kanji/${encodeURIComponent(ch)}`);
      if (!res.ok) {
        mem.set(ch, null);
        return null;
      }
      const data = await res.json();
      const kun: string[] = data.kun_readings ?? [];
      const on: string[] = (data.on_readings ?? []).map(kataToHira);
      const cleanKun = kun.map((r) => r.replace(/[.\-]/g, '').replace(/、.*/, ''));
      const info: KanjiInfo = {
        kanji: ch,
        on,
        kun,
        meanings: data.meanings ?? [],
        primary: cleanKun[0] || on[0] || '',
        fetchedAt: Date.now()
      };
      mem.set(ch, info);
      await db.meta.put({ key: `kanji:${ch}`, value: info });
      return info;
    } catch {
      mem.set(ch, null);
      return null;
    } finally {
      inflight.delete(ch);
    }
  })();

  inflight.set(ch, p);
  return p;
}
