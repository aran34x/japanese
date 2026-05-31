// Live Wikipedia fetch — runs in the user's browser (CORS-enabled), so we only
// ever store names + our own challenges; bios and photos come from Wikipedia at
// runtime and are hot-linked, never bundled. Results are cached (in-memory +
// IndexedDB) so revisits are instant and work after first view.
import { db } from '../db';

export interface WikiInfo {
  title: string;
  extract: string;
  image?: string;
  pageUrl?: string;
  fetchedAt: number;
}

const mem = new Map<string, WikiInfo>();

const REST = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const API = 'https://en.wikipedia.org/w/api.php';

async function fromCache(title: string): Promise<WikiInfo | undefined> {
  if (mem.has(title)) return mem.get(title);
  const row = await db.meta.get(`wiki:${title}`);
  if (row?.value) {
    mem.set(title, row.value as WikiInfo);
    return row.value as WikiInfo;
  }
  return undefined;
}

async function store(info: WikiInfo) {
  mem.set(info.title, info);
  await db.meta.put({ key: `wiki:${info.title}`, value: info });
}

/** Resolve a title via search when the exact article title isn't found. */
async function resolveTitle(query: string): Promise<string | undefined> {
  const url = `${API}?action=query&list=search&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;
  const res = await fetch(url);
  if (!res.ok) return undefined;
  const data = await res.json();
  return data?.query?.search?.[0]?.title;
}

export async function getWiki(title: string): Promise<WikiInfo | undefined> {
  const cached = await fromCache(title);
  if (cached) return cached;

  try {
    let res = await fetch(REST + encodeURIComponent(title), {
      headers: { accept: 'application/json' }
    });
    if (!res.ok) {
      const resolved = await resolveTitle(title);
      if (resolved && resolved !== title) {
        const alt = await fromCache(resolved);
        if (alt) return alt;
        res = await fetch(REST + encodeURIComponent(resolved), {
          headers: { accept: 'application/json' }
        });
      }
    }
    if (!res.ok) return undefined;
    const data = await res.json();
    const info: WikiInfo = {
      title,
      extract: data.extract ?? '',
      image: data.thumbnail?.source ?? data.originalimage?.source,
      pageUrl: data.content_urls?.desktop?.page,
      fetchedAt: Date.now()
    };
    await store(info);
    return info;
  } catch {
    return undefined;
  }
}
