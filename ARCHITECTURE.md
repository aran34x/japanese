# Nihongo Quest — Architecture & Content Map

This document is the map for finding and changing things. It separates **content
data** (the cards, characters, stories, quests, etc. you'll want to edit/expand)
from the **app machinery** (engines, UI, storage, sync).

> TL;DR for "where do I change X":
> - **Learning content** (kana, kanji, vocab, phrases, grammar, topics) →
>   `src/lib/data/`
> - **Game content** (heroes, real people, fictional characters, achievements,
>   bosses, cultural tracks) → `src/lib/game/` (data + a little logic, see below)
> - **Stories** → `src/lib/data/stories.ts`
> - **UI screens** → `src/components/`
> - **Engines/infra** (SRS, DB, sync, auth, importer, kanji dict) → `src/lib/`

---

## 1. High-level structure

```
src/
  main.ts            App bootstrap + PWA auto-update registration
  App.svelte         Root: header, routing, auth gate, global overlays
  app.css            Global styles (Tailwind)

  components/        All UI screens & widgets (Svelte)

  lib/
    data/            ── PURE CONTENT DATA (learning material) ──
    game/            ── GAME CONTENT + light game logic ──
    exercises/       Exercise/question generator
    anki/            .apkg / CSV importer
    kanji/           Kanji dictionary, furigana, kanji X-ray
    *.ts             Engines & infrastructure (see §5)
```

The app is a **Svelte + Vite + TypeScript PWA**. All user data lives locally in
**IndexedDB** (via Dexie) and optionally syncs to **Supabase** per account.

---

## 2. CONTENT DATA — `src/lib/data/` (edit these to add learning material)

These files are **pure data** (arrays of objects). They are the easiest to edit
and the first place to add content.

| File | What it holds | Shape |
|------|---------------|-------|
| `kana.ts` | Full hiragana + katakana tables (gojūon, dakuten, combos) | `{ romaji, hira, kata }` |
| `kanji.ts` | JLPT N5 kanji with reading + EN/IT meanings | `{ kanji, reading, en, it }` |
| `vocab.ts` | Beginner vocabulary + reading sentences | `{ word, reading, romaji, en, it, tags }` |
| `phrases.ts` | N4 everyday sentences | `{ text, reading, en, it }` |
| `topics.ts` | Days, colors, months, grammar patterns | `{ word, reading, romaji, en, it }` |
| `stories.ts` | Reading-comprehension stories + quizzes | `Story` (see §3) |
| `seed.ts` | **Turns the above data into decks/cards** in the DB | builders + `ensureSeeded()` |

### Adding a new built-in deck
1. Add a data array (in an existing `data/*.ts` or a new file).
2. In `seed.ts`:
   - add a `deck({...})` entry to `BUILTIN_DECKS`
   - push its cards in `buildCards()`
   - **bump `SEED_VERSION`** so existing users get the new deck without losing
     progress (the migration only adds; it never clobbers review history).

---

## 3. STORIES — `src/lib/data/stories.ts`

Self-contained. Each `Story`:

```ts
{
  id, titleJp, title{en,it}, emoji, level,   // level: N5 | N5+ | N4 | N4+
  lines:  [{ jp, reading, en, it }, ...],
  questions: [ StoryMcq | StoryType, ... ]   // mix freely
}
```

- **`mcq(qen, qit, [[en,it,correct], ...])`** — multiple choice.
- **`type(qen, qit, [answers], hint?)`** — typing question (answers matched
  case-insensitively; accepts romaji/kanji/kana variants).
- Stories are **ordered by difficulty**; later ones have more lines/questions.
- Completion (≥ half correct) is stored in game state `storiesDone` and shows a
  **stamp** in the album; the emoji is hidden until completed.

To add a story: append an object to `STORIES`. No other change needed.

---

## 4. GAME CONTENT & LOGIC — `src/lib/data/game/` + `src/lib/game/`

The big roster arrays now live as **pure data** in `src/lib/data/game/`, and the
matching `src/lib/game/` module keeps the generation/helper logic and re-exports
the data (so existing imports keep working).

| Data file (`data/game/`) | Logic file (`game/`) | Content / logic |
|--------------------------|----------------------|-----------------|
| `characters.ts` — `CHARACTERS[]`, the original SVG hero ladder (Mochi-chan → Amaterasu) + `GameCharacter` type | `characters.ts` | `characterForXp`, `nextUnlock` |
| `people.ts` — `PEOPLE[]` real figures + `ROLES`, `CATEGORY_META`, types | `people.ts` | `buildPersonChallenge`, `buildPersonLesson` |
| `fictional.ts` — `CHARACTERS_FICTIONAL[]` + `FRANCHISE_META`, types | `fictional.ts` | `buildCharChallenge`, `buildCharLesson` |
| — | `achievements.ts` | `ACHIEVEMENTS[]` + `newlyEarned` (still combined; small) |
| — | `encounters.ts` | `BOSSES[]` + `rollEncounter` (still combined; small) |
| — | `tracks.ts` | `HOSTS[]` + `TRACK_META` — pure data, no logic |
| — | `state.ts` | **The game-state engine**: XP, levels, unlocks, achievements, streaks, stories; `mutateGame`, `markStoryDone`, `unlockPerson`, `unlockFictional`, `resetAllProgress`, debounced cloud push |

To **edit roster content**, change the arrays in `src/lib/data/game/`. To change
how challenges are generated, edit the matching `src/lib/game/` file.

`state.ts` is the **single source of truth** for all gamification progress
(`GameState`). It persists to IndexedDB and triggers cloud sync.

---

## 5. ENGINES & INFRASTRUCTURE — `src/lib/`

| File | Responsibility |
|------|----------------|
| `types.ts` | Core domain types: `Card`, `Deck`, `ReviewState`, `Exercise`, `Settings`, etc. |
| `db.ts` | Dexie schema (tables: decks, cards, reviews, media, meta) + settings + save helpers |
| `srs.ts` | SM-2 spaced-repetition scheduler (`schedule`, `newReviewState`, `previewInterval`) |
| `session.ts` | Builds the daily study queue (due + new cards) |
| `exercises/generator.ts` | Turns a card into an `Exercise`; **`allowedKinds`** decides which question types are valid per card category; category-matched distractors |
| `anki/import.ts` | `.apkg` (sql.js + fflate) and CSV/TSV import; maps fields by script (front/reading/meaning), handles media |
| `kanji/dict.ts` | On-demand kanji dictionary via kanjiapi.dev, cached in IndexedDB |
| `kanji/furigana.ts` | Global furigana: DOM walker that puts `<ruby>` readings above every kanji; toggled by `furiganaOn` |
| `kanji/xray.ts` | `furiganaOn` store (persisted) |
| `speech.ts` | Japanese text-to-speech (Web Speech API) |
| `confetti.ts` | Dependency-free confetti burst |
| `i18n.ts` | EN/IT UI translation table (`strings`, `translate`) |
| `stores.ts` | Svelte stores: `settings`, `route`, `ready`, `t`, `navigate` |
| `saveStatus.ts` | The little "saving/saved" header indicator state |
| `backup.ts` | Serialize/restore the whole DB to JSON (used by sync) |
| `sync.ts` | Supabase auth (email+password) + cloud save (push/pull), guest/account data isolation via `dataOwner` |
| `supabase-config.ts` | Supabase URL + publishable key (safe for client) |
| `version.ts` | `APP_VERSION` + `CHANGELOG` (drives the "What's new" popup) |

---

## 6. UI — `src/components/`

| Component | Screen / role |
|-----------|---------------|
| `Home.svelte` | Dashboard, mode shortcuts |
| `Study.svelte` | Core SRS study: mode menu, deck picker (Custom), question runner |
| `ExerciseView.svelte` | Renders a single exercise (used by Adventure) |
| `Flashcard.svelte` | SRS self-graded flip card |
| `Stories.svelte` | Story mode: list/album, reader, quiz, stamps |
| `Adventure.svelte` | Gamified hub with tabs (Quest / Icons / Characters / Collection / Achievements) |
| `AdventureSession.svelte` | Adventure play loop incl. random encounters/bosses |
| `CharacterPortrait.svelte` | Renders a hero's SVG (locked = silhouette) |
| `Icons.svelte` | Real people (Wikipedia photos/bios + challenges) |
| `Characters.svelte` | Fictional pop-culture characters |
| `WikiImage.svelte` | Live Wikipedia image loader (cached) |
| `Decks.svelte` | Deck browser, reset/delete |
| `Stats.svelte` | Progress stats |
| `SettingsScreen.svelte` | Settings + Cloud sync + reset progress |
| `ImportScreen.svelte` | Anki/CSV import UI |
| `KanjiSheet.svelte` | "All kanji on screen" bottom-sheet (漢 button) |
| `AccountMenu.svelte` | Top-right account dropdown |
| `SaveIndicator.svelte` | Autosave spinner/check |
| `AuthGate.svelte` | Startup login/signup screen |
| `Nav.svelte` | Bottom navigation |
| `Toasts.svelte` / `WhatsNew.svelte` | Overlays |

---

## 7. Data storage & sync model

- **IndexedDB** (Dexie, DB name `nihongo-quest`) tables:
  `decks`, `cards`, `reviews`, `media`, `meta` (key/value: settings, gamestate,
  seedVersion, dataOwner, kanji cache, wiki cache…).
- **Guest vs account**: local data is tagged with `meta.dataOwner` = a Supabase
  user id or `'guest'`. On startup / auth change, `sync.ts` reconciles: if the
  owner changed, it resets local progress and (if signed in) pulls that
  account's cloud save. So a guest never inherits an account's data.
- **Cloud**: one JSON row per user in the Supabase `saves` table (see README for
  the SQL). Auto-push is debounced after changes; pull on sign-in.

---

## 8. Conventions

- **Bilingual**: user-facing strings are `{ en, it }` or go through `i18n.ts`.
- **Adding a release note**: bump `APP_VERSION` and prepend a `CHANGELOG` entry
  in `version.ts`; the "What's new" popup shows unseen versions.
- **Type-check before committing**: `npm run check` (Vite build does *not*
  type-check). Build: `npm run build`.
