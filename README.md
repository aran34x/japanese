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
