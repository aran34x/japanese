import { db } from '../db';
import type { FictionalImageSource } from '../data/game/fictional';

export interface FandomImageInfo {
  image: string;
  pageUrl?: string;
  title: string;
  fetchedAt: number;
}

const mem = new Map<string, FandomImageInfo>();

const keyFor = (source: FictionalImageSource) => `fandom-image:${source.wiki}:${source.title}`;

async function fromCache(source: FictionalImageSource): Promise<FandomImageInfo | undefined> {
  const key = keyFor(source);
  if (mem.has(key)) return mem.get(key);
  const row = await db.meta.get(key);
  if (row?.value) {
    const info = row.value as FandomImageInfo;
    mem.set(key, info);
    return info;
  }
  return undefined;
}

async function store(source: FictionalImageSource, info: FandomImageInfo) {
  const key = keyFor(source);
  mem.set(key, info);
  await db.meta.put({ key, value: info });
}

function apiUrl(source: FictionalImageSource, search = false) {
  const base = `https://${source.wiki}.fandom.com/api.php`;
  const query = search
    ? `generator=search&gsrsearch=${encodeURIComponent(source.title)}&gsrlimit=5`
    : `titles=${encodeURIComponent(source.title)}`;
  return `${base}?action=query&${query}&prop=pageimages|info&pithumbsize=500&inprop=url&redirects=1&format=json&origin=*`;
}

async function fetchPages(source: FictionalImageSource, search = false) {
  const res = await fetch(apiUrl(source, search), { headers: { accept: 'application/json' } });
  if (!res.ok) return [];
  const data = await res.json();
  return Object.values(data?.query?.pages ?? {}) as Array<{
    missing?: string;
    title?: string;
    thumbnail?: { source?: string };
    fullurl?: string;
  }>;
}

export async function getFandomImage(source: FictionalImageSource): Promise<FandomImageInfo | undefined> {
  const cached = await fromCache(source);
  if (cached) return cached;

  try {
    let pages = await fetchPages(source);
    let page = pages.find((p) => !p.missing && p.thumbnail?.source) ?? pages.find((p) => !p.missing);
    if (!page?.thumbnail?.source) {
      pages = await fetchPages(source, true);
      page = pages.find((p) => !p.missing && p.thumbnail?.source) ?? pages.find((p) => !p.missing);
    }
    if (!page?.thumbnail?.source) return undefined;
    const info = {
      image: page.thumbnail.source,
      pageUrl: page.fullurl,
      title: page.title ?? source.title,
      fetchedAt: Date.now()
    };
    await store(source, info);
    return info;
  } catch {
    return undefined;
  }
}
