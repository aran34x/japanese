# 日本語 · Nihongo Quest

A bilingual (English / Italian) Japanese-learning **PWA** — a website that also
installs on Android as an offline app. Built for recognizing **hiragana,
katakana, kanji**, **vocabulary**, and **reading**, with **Anki-style
spaced-repetition flashcards** and an **Anki import** system.

## Features

- **Five built-in decks**: full Hiragana, full Katakana (gojūon + dakuten +
  combos), core JLPT N5 Kanji (~95), beginner Vocabulary, and Reading sentences.
- **Practice modes**: Mixed, Flashcards (SRS self-grade), Multiple choice,
  and Typing — every card can become several exercise variants.
- **SM-2 spaced repetition** (the Anki algorithm) with Again / Hard / Good / Easy.
- **Bilingual**: switch the UI and meanings between English and Italian; show
  both at once if you like.
- **Audio**: on-device Japanese text-to-speech (no files needed), plus imported
  audio when available.
- **Anki import**: drop in a `.apkg` (with audio/image media) or a CSV/TSV/TXT
  export. Everything is stored offline in IndexedDB.
- **Installable PWA**: works offline, add to Android home screen.

## Run it locally

```bash
npm install
npm run dev      # open the printed localhost URL
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build
npm run check    # type-check
```

## Install on Android

1. Host the built `dist/` folder (e.g. GitHub Pages, Vercel, Netlify) or run
   `npm run preview` on your network.
2. Open the URL in Chrome on Android.
3. Menu → **Add to Home screen**. It launches fullscreen and works offline.

> Deploying to a GitHub Pages *project* site? Build with the sub-path base:
> `BASE=/japanese/ npm run build`.

## Importing your Anki cards

Go to **Import** and choose a file:

- **`.apkg`** — Anki deck export. Notes become cards (field 1 = front,
  field 2 = meaning); `[sound:…]` and `<img>` media are imported automatically.
- **CSV / TSV / TXT** — one card per line:
  ```csv
  front,reading,meaning,tags
  猫,ねこ,cat / gatto,animals
  ```

## Cloud sync (optional, Supabase)

Progress is stored locally (IndexedDB) and can be exported/imported as a JSON
file from **Settings → Save & backup**. For automatic cross-device sync, connect
your own free Supabase project (no credentials are stored in this repo):

1. Create a free project at [supabase.com](https://supabase.com).
2. In the project's **SQL Editor**, run:

   ```sql
   create table if not exists saves (
     user_id uuid primary key references auth.users on delete cascade,
     data jsonb,
     updated_at timestamptz default now()
   );
   alter table saves enable row level security;
   create policy "own save" on saves
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```
3. In **Authentication → Providers**, keep **Email** enabled (magic link).
   Under **Authentication → URL Configuration**, add your app URL
   (`https://aran34x.github.io/japanese/`) to the redirect allow-list.
4. From **Project Settings → API**, copy the **Project URL** and **anon public**
   key, then paste them into the app under **Settings → Cloud sync → Connect**.
5. Sign in with your email (magic link). Progress now uploads automatically and
   can be pulled on any other device with the same login.

## Tech

Svelte + Vite + TypeScript · Tailwind CSS · Dexie (IndexedDB) ·
vite-plugin-pwa · sql.js + fflate (for `.apkg` parsing).

## Project layout

```
src/
  lib/
    data/        kana, kanji, vocab, reading + deck seeding
    exercises/   exercise-variant generator
    anki/        .apkg / CSV importers (with media)
    srs.ts       SM-2 scheduler
    db.ts        Dexie schema & helpers
    session.ts   builds the daily study queue
    i18n.ts      EN/IT translations
  components/    Svelte UI screens
```
