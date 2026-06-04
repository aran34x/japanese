# Nihongo Quest — project guide

A bilingual (EN/IT) Japanese-learning PWA: kana, kanji, vocab, reading, Anki-style
SRS flashcards, plus a gamified "Adventure" mode. Svelte 4 + Vite + TypeScript +
Tailwind. All data is local (IndexedDB via Dexie) with optional Supabase cloud sync.

## Commands

- `dev.bat` (or `npm run dev`) — local dev server at http://localhost:5173 (auto-opens browser).
- `deploy.bat` — commit + push; GitHub Actions builds with `BASE=/japanese/` and deploys to Pages.
- `npm run check` — `svelte-check` (typecheck). Run this after changes; keep it at 0 errors.
- `npm run build` — production build (also good for catching errors).
- `npm run extract-decks` — regenerate built-in Anki decks (see "Anki decks" below).

`dev.bat` / `deploy.bat` are git-ignored personal tooling. The `.bat` files must be
**plain ASCII** — Unicode (em-dashes, box-drawing) corrupts cmd.exe batch parsing,
and `npm` must be called as `call npm ...` so control returns to the script.

## Architecture

- **Entry:** `src/main.ts` registers the PWA service worker (auto-update) and mounts `App.svelte`.
- **Routing:** hash-based, in `src/lib/stores.ts` (`route`, `navigate`). Routes: home, study,
  adventure, stories. Settings & Stats are **modals**, not routes (see below).
- **State:** Svelte stores. `settings` (persisted to IndexedDB `meta`), `game` (Adventure state),
  `route`, `ready`, `settingsOpen`/`statsOpen` (modal toggles).
- **Storage:** Dexie (`src/lib/db.ts`) — tables `decks`, `cards`, `reviews`, `media`, `meta`.
  `getSettings()` merges stored settings over `DEFAULT_SETTINGS`, so new settings keys are safe.
- **Sync:** `src/lib/sync.ts` + Supabase (`src/lib/supabase-config.ts` has the public anon key —
  safe to ship; never put the `service_role` key in client code). Cloud pushes are debounced.
- **i18n:** `src/lib/i18n.ts` — central `strings` table keyed by `t(key)`; every string has en/it.

## Study & SRS

- `src/lib/srs.ts` — SM-2-ish scheduler with learning steps; grades Again/Hard/Good/Easy.
  `previewInterval(state, grade)` powers the interval labels under the Flashcard grade buttons.
- `src/lib/session.ts` — `buildQueue` (due + new-per-day) and `deckCounts`.
- `src/lib/exercises/generator.ts` — `makeExercise` + `allowedKinds`. **Imported/custom decks are
  flashcard-only** (their content doesn't map to sane MCQ distractors). Built-in decks support
  MCQ/typing. `allowedKinds` gates this; `makeExercise` sanitizes an out-of-range requested kind
  down to a valid one.
- `Study.svelte` flow: menu (mode tiles + Custom) → config (mode-first: pick ONE set to start, or a
  collapsible "Mix sets" multi-select; Custom = decks + mode picker) → running → done. Deck
  management (reset progress / delete, two-tap confirm) lives in the config deck list, grouped by
  category. Tracks active study time via `addStudyTime` (per-card delta, capped 120s).
- Audio policy (challenges, in the generator): speak the prompt only when it's Japanese AND not a
  "how do you read this?" question (would spoil the answer). Reading-MCQ answers may be played.
  Flashcards: kana = no audio at all; kanji = audio button but no autoplay; others = recorded audio
  (Supabase) preferred, TTS fallback, autoplay if enabled. TTS is the Web Speech API (`speech.ts`).

## Anki decks (built-in)

Big `.apkg` files in `AnkiDecks/` (git-ignored) are **not** committed. The pipeline splits them:

- **`scripts/extract-anki-decks.mjs`** reads each `.apkg`, maps notes to cards **by the note type's
  field NAMES** (not guessing — e.g. `Vocabulary-Kanji`/`Jlab-Translation`), skips junk `InfoNote`
  cards, uploads media to **Supabase Storage** (`deck-media` bucket, numeric keys), and writes card
  JSON to `public/decks/*.json` (text only, ~2 MB total — committed, served by Pages).
  - Run: `SUPABASE_SERVICE_KEY=... npm run extract-decks`. Use `SKIP_UPLOAD=1` to only regenerate
    JSON (media already uploaded — fast).
  - It uses the Storage **REST API via fetch**, NOT `@supabase/supabase-js` (the SDK spins up a
    realtime WebSocket client that Node 20 lacks).
- **`src/lib/data/anki-seed.ts`** (`ensureAnkiDecks`, called from `App.svelte` onMount) fetches the
  JSON once per `SEED_VERSION` and seeds into IndexedDB. Cards carry direct Supabase **`audioUrl`/
  `imageUrl`** (fetched on demand). Bump `SEED_VERSION` after changing extraction to force a clean
  re-seed (it clears the deck's old cards first).

## Kanji helpers (the 🔍 and ふ topbar toggles, mutually exclusive)

- `src/lib/kanji/dict.ts` — per-kanji lookups from kanjiapi.dev, cached in IndexedDB (`meta`).
- **Furigana** (`furigana.ts` + `tokenizer.ts`): kuromoji walks the DOM and adds `<ruby>` readings
  over kanji words. Dict ships as `public/dict/*.dat.gz`. NOTE: Vite's dev server serves `.gz` with
  `Content-Encoding: gzip`, which double-decompresses and breaks kuromoji — the `serveDictRaw` plugin
  in `vite.config.ts` serves `/dict/*.gz` raw to fix this in dev.
- **X-ray** (`xray.ts` store + `xray-annotate.ts` engine): overlays each kanji with a cycling
  English meaning (white) + alternating kun (red)/on (blue) reading, stepping every 2s. Built with
  `<ruby>` + a fixed-width inner `.xray-box` (ruby reserves vertical space; fixed width = no jitter).
  Slot width is **pre-measured** (canvas `measureText`) from the widest reading/meaning on screen and
  written to `--xray-slot`, so nothing clips. When active (`.xray-active` on `<html>`): kanji enlarge
  by `--xray-kanji-scale` (user setting, S/M/L/XL), and a full-screen `.xray-dim-overlay` (z-40) dims
  everything while kanji (z-45) show through; the 🔍 toggle stays bright (`.xray-dim-el` exempts it).

## UI conventions

- **Modals** (`Modal.svelte`): Settings and Stats overlay the current page (portaled to `<body>`,
  dim backdrop + slide-up, Back button) so you don't lose where you were. Opened via `settingsOpen`/
  `statsOpen` stores from the account menu.
- **Portal** (`src/lib/portal.ts`): Svelte action that moves a node to `<body>` to escape ancestor
  stacking contexts. Used by the account dropdown and modals. Always use **quick smooth fade/fly
  transitions** for overlays.
- **Topbar** is `fixed` (`App.svelte`); 🏠 left, ふ/🔍/account right. Sizing knobs live in
  `src/lib/ui-config.ts` (`UI.topbarPadding`, `UI.mainTopPad`, `UI.navItemPad`).
- **Theme:** `settings.theme` toggles a `light` class on `<html>`; `app.css` overrides Tailwind
  slate/accent classes for an iOS-inspired light mode. Dark is default and gradient-light.
- **Spoiler rules:** never reveal the next hero's name (show `???`), and never show a Story's English
  title until it's completed.

## Gamification (`src/lib/game/`)

`state.ts` holds `GameState` (xp, streaks, unlocks, `achievements`, `unlockedPeople`/`Fictional`,
`storiesDone`, `studySeconds`). `mutateGame` applies changes then fires unlock/achievement toasts.
Rosters: `characters.ts` (XP ladder, Wikipedia photos via `CharacterPortrait`), `people.ts` (Icons),
`fictional.ts` (Characters), `achievements.ts` (Japan-themed, Wikipedia images). Stats modal
(`Stats.svelte`) surfaces learning numbers, collection progress, and "struggle cards" (≥3 reviews,
<60% accuracy).
