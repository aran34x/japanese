# Nihongo Quest — Codebase Review & Improvement Plan

_Review date: 2026-06-05. Scope: whole repo. This is a planning doc — nothing here
has been applied. Items are tagged **[effort: S/M/L]** and grouped by theme, with a
prioritized roadmap at the end._

---

## 0. Executive summary

The app is in good shape: clean Svelte-store architecture, offline-first Dexie
storage, a thoughtful SRS, and a lot of polished gamification. The biggest risks to
"expanding going forward" are: (1) the **production bundle has ballooned to ~1.24 MB**
(369 KB gzip) — mostly Three.js loaded eagerly; (2) **cloud sync re-uploads the entire
database on every single card answer** (full-snapshot, last-write-wins) which won't
scale and can silently lose cross-device progress; (3) **no automated tests** on the
parts most likely to break (SRS scheduler, Anki field mapping, exercise generator);
and (4) a few **maintainability cliffs** (a 700-line `app.css` of repetitive per-skin
overrides, a single growing `i18n.ts`). None are urgent bugs, but all get harder to
fix the more features land on top.

---

## 1. Security & data integrity

### 1.1 Rotate the Supabase `service_role` key **[effort: S] — do this first**
The `service_role` key was pasted into a chat session to run `extract-decks`. Treat it
as compromised: **roll it in Supabase → Settings → API**. It grants full DB access
(bypasses RLS). The app never needs it (only the local extraction script does), so
rotating has zero app impact.

### 1.2 Verify Row-Level Security on the `saves` table **[effort: S]**
`sync.ts` upserts `{ user_id, data }` into `saves`. Confirm an RLS policy restricts
`select`/`upsert` to `auth.uid() = user_id`. Without it, any authenticated user could
read/overwrite others' saves with the public anon key. Add a short note to `CLAUDE.md`
documenting the expected policy.

### 1.3 The publishable/anon key in `supabase-config.ts` is fine
Shipping it is by design — just keep the comment that forbids the secret key there.

---

## 2. Performance & bundle size

### 2.1 Lazy-load Three.js **[effort: M] — highest-impact perf win**
`LevelCoin3D.svelte` and `src/lib/three/stage.ts` import `three` **statically**, so the
whole engine lands in the main chunk. The main bundle went **617 KB → 1,237 KB** when
Three.js was added. Fix: dynamic-import Three only when the 3D coin actually mounts
(`const THREE = await import('three')`), or wrap `LevelCoin3D` behind
`{#await import('./LevelCoin3D.svelte')}`. Expect the initial bundle to roughly halve.

### 2.2 Lazy-load Supabase auth **[effort: M]**
`@supabase/supabase-js` is pulled into the main bundle via `sync.ts` (imported eagerly
by `App.svelte`). Guests who never sign in still download it. Consider deferring
`initSync`'s `createClient` import until auth is actually needed (the per-answer
`autoPush` already uses `import('./sync')` dynamically — make the whole module lazy).

### 2.3 Route/feature code-splitting **[effort: M]**
`App.svelte` statically imports every screen (Home, Study, Adventure, Stories, Stats,
Settings, Characters, Icons…). Adventure pulls in `wiki.ts`, portraits, fictional/people
rosters (`fictional.ts` is 623 lines, `stories.ts` 1097). Lazy-load the heavier routes
(`{#await import(...)}`) so first paint only ships Home + Study.

### 2.4 Move `sql.js` and `fflate` to `devDependencies` **[effort: S]**
Both are now used **only** in `scripts/extract-anki-decks.mjs` — nothing in `src/`
imports them anymore (the old in-app importer was removed). They're currently in
`dependencies`. Move them to `devDependencies`, drop the stale
`optimizeDeps.exclude: ['sql.js']` from `vite.config.ts`, and remove the unused `sql.js`
typings block in `vite-env.d.ts`.

### 2.5 `Stats` loads every review row **[effort: S]**
`Stats.svelte` does `db.reviews.toArray()` to compute aggregates + struggle cards.
Fine at hundreds of cards; with the 5k Anki cards it's a few thousand rows on every
open. Acceptable for now — revisit with a Dexie index/`.count()` queries if it gets
sluggish.

---

## 3. Cloud sync architecture

### 3.1 Stop full-snapshot upload on every answer **[effort: M] — important**
Every graded card triggers `autoPush()` → `exportBackup()` (serializes the **entire**
Dexie DB) → upsert. With imported decks that's thousands of rows serialized and
uploaded per review. Two problems: network/CPU waste, and it amplifies the
last-write-wins race. Minimum fix: **debounce** `autoPush` (e.g. 10–20 s trailing) in
one place instead of calling it from `db.ts`, `state.ts`, and 3 spots in `Study.svelte`.

### 3.2 Last-write-wins risks silent data loss **[effort: L]**
The whole save is one JSON row; the last device to push wins. Studying on phone then
laptop can clobber progress. Longer term, move to **per-entity sync** (review rows keyed
by `cardId` with `updated_at`, merge by max timestamp) or at least pull-before-push with
a conflict check. Document the current limitation in `CLAUDE.md` until then.

### 3.3 `pull()`/`signOut()` hard-reload the page **[effort: M]**
`location.reload()` is used to refresh in-memory stores after a pull. It works but is
jarring (and loses the modal/page you were on — which you've been deliberately avoiding
elsewhere). Consider re-hydrating the stores in place (`loadSettings()`, `loadGame()`,
re-run seeders) instead of reloading.

---

## 4. Maintainability

### 4.1 Skin CSS is 700 lines of repetitive overrides **[effort: M]**
`app.css` overrides dozens of Tailwind utilities per skin (`smash64`, `sakura`,
`station`, `nature`, `comet`). Adding a skin means hand-editing ~40 selectors and it's
easy to miss one (e.g. the stamp gradient that didn't respond to themes). **Refactor to
CSS custom properties**: define semantic tokens once (`--surface`, `--surface-glass`,
`--accent`, `--accent-2`, `--text`, `--text-muted`, `--bg-gradient`, `--radius`), have
each skin set just those tokens, and have components consume the tokens. This turns a
new skin into ~10 lines and removes whole classes of "X doesn't respond to the theme"
bugs. (Tailwind can read CSS vars via `theme.extend.colors` or arbitrary values.)

### 4.2 Split `i18n.ts` and add a key-coverage guard **[effort: S]**
It's a single 266-line table and growing. Two cheap improvements: (a) type the keys
(`export type StringKey = keyof typeof strings`) so `t()` is type-checked and typos
fail at build; (b) a tiny dev assertion (or test) that every entry has both `en` and
`it`. Optionally split by domain (study, game, settings) and merge.

### 4.3 Centralize the per-answer "save + push" path **[effort: S]**
`markSaving/markSaved` + `autoPush` + review write is duplicated across `Study.svelte`,
`AdventureSession`, `Stories`, `state.ts`. A single `recordReview(state, grade)` helper
(write review → update saveStatus → schedule debounced push → add study time) would
remove duplication and make 3.1 a one-line change.

### 4.4 Tame remaining `any` / loose typings **[effort: S]**
`db.meta` is `{ key; value: unknown }` and read with `as` casts throughout
(`as KanjiInfo`, `as number`, `as string`). A typed `meta` accessor
(`getMeta<T>(key)` / `setMeta<T>`) with a key→type map would catch mismatches and
document what lives in `meta` (settings, gamestate, seed versions, dataOwner, kanji
cache, furigana/xray flags…).

### 4.5 `LevelCoin3D.svelte` (434 lines) is the new largest component **[effort: M]**
Worth splitting the Three.js setup/teardown into `lib/three/` helpers (some already in
`stage.ts`) and keeping the `.svelte` file to lifecycle + props. Also ensure the
renderer, geometries, textures and `requestAnimationFrame` loop are disposed on
`onDestroy` to avoid GPU/memory leaks when navigating away repeatedly.

---

## 5. Testing & tooling

### 5.1 Add unit tests for the pure logic **[effort: M] — best ROI for stability**
No tests exist. The highest-value, easiest-to-test pure modules:
- `srs.ts` — `schedule()` transitions and `previewInterval()` (Again→relearn, Good
  graduation, ease floor, interval growth).
- `exercises/generator.ts` — `allowedKinds()` per category, and that `makeExercise`
  sanitizes an out-of-range kind to a valid one (custom decks → flashcard only).
- `scripts/extract-anki-decks.mjs` field-mapping helpers — extract `mapNote`/`pickText`
  into an importable module and test against fixture notes (the JLab/InfoNote cases
  that bit us). Prevents regressions when adding new decks.

Add Vitest (`npm i -D vitest`), a `test` script, and a CI step.

### 5.2 Run `check` + `build` in CI **[effort: S]**
The GitHub Actions workflow only builds for Pages. Add `npm run check` (and the tests)
as a gate so a broken typecheck can't deploy. The session already hit cases where
`svelte-check` failed while `build` passed (e.g. missing `@types/three`).

### 5.3 Add Prettier + lint config **[effort: S]**
Formatting is consistent by hand today; a committed Prettier config + `eslint-plugin-svelte`
keeps it that way as contributors (or AI sessions) pile on.

---

## 6. UX, accessibility & PWA

### 6.1 Accessibility pass **[effort: M]**
- Many icon-only buttons use `title` but no `aria-label` (topbar 🏠/ふ/🔍, audio 🔊,
  account ☰). Screen readers read emoji names or nothing. Add `aria-label`.
- Modals (`Modal.svelte`) need focus trapping, `role="dialog"`/`aria-modal`, Esc-to-close,
  and returning focus to the trigger on close. Backdrops are `<div on:click>` — add
  keyboard equivalents or make them non-focusable presentation layers (some already are).
- X-ray dim overlay relies on color/brightness only; fine, but ensure contrast of the
  dimmed UI still meets WCAG when a skin is active.

### 6.2 `speechSynthesis` reliability **[effort: S]**
TTS quality varies wildly by device and the JP voice may be absent. Surface a one-time
hint when no `ja-JP` voice is found, and consider a settings note. (Recorded audio
already covers the imported decks.)

### 6.3 PWA update UX **[effort: S]**
`main.ts` auto-activates new SWs and the account menu has "Check for updates". Consider a
non-blocking toast ("Updated to vX — reload to apply") instead of silent
`updateSW(true)` mid-session, which can swap assets under the user.

### 6.4 Respect `prefers-reduced-motion` **[effort: S]**
Confetti, fly/scale transitions, the X-ray 2 s cycle, and the 3D coin spin should
honor reduced-motion for accessibility and battery.

---

## 7. Data & content pipeline

### 7.1 Make `extract-anki-decks.mjs` deck list data-driven **[effort: S]**
Deck id mapping + names are hard-coded by filename substring. A small `decks.config.json`
(filename → id, names, category) would make adding the 5th/6th deck declarative and keep
`anki-seed.ts`'s `ANKI_DECKS` list in sync (today they can drift — e.g. `anki-kaishi` is
listed in the seeder but no JSON exists, so it silently 404s every load).

### 7.2 Tae Kim meaning cleanup **[effort: S]**
A few cards still carry verbose run-on glosses (first greeting card). Optionally cap the
fallback meaning to the first sentence/sense during extraction.

### 7.3 Consider committing decks to git-lfs or a release asset **[effort: S]**
`public/decks` is 2.7 MB of JSON in the repo (fine for Pages, but it grows with each
deck). If it balloons, move the JSON to Supabase Storage too and fetch at runtime like
the media, keeping the repo lean.

---

## 8. Feature-expansion enablers (to make "going forward" easier)

- **Theme tokens (4.1)** unlock community/seasonal skins cheaply.
- **`recordReview` helper (4.3)** + **debounced sync (3.1)** make new study modes
  (listening drills, writing/stroke practice, matching) drop-in without re-implementing
  the save path.
- **Typed `meta` (4.4)** + **typed i18n keys (4.2)** make large refactors safe.
- **Tests on SRS + generator (5.1)** let you tune the algorithm or add exercise kinds
  without fear.
- **Per-entity sync (3.2)** is the prerequisite for any social/leaderboard/multi-device
  feature.

---

## 9. Prioritized roadmap

| # | Item | Theme | Effort | Impact |
|---|------|-------|--------|--------|
| 1 | Rotate `service_role` key (1.1) | Security | S | High |
| 2 | Lazy-load Three.js (2.1) | Perf | M | High |
| 3 | Debounce/centralize sync push (3.1, 4.3) | Sync | M | High |
| 4 | Verify `saves` RLS (1.2) | Security | S | High |
| 5 | Tests for SRS + generator + extractor (5.1) | Stability | M | High |
| 6 | `check` (+tests) in CI (5.2) | Tooling | S | Med |
| 7 | Move sql.js/fflate to devDeps; drop dead config (2.4) | Perf/hygiene | S | Med |
| 8 | Skin CSS → CSS custom properties (4.1) | Maintainability | M | Med |
| 9 | Lazy-load Supabase + heavy routes (2.2, 2.3) | Perf | M | Med |
| 10 | Typed i18n keys + meta accessor (4.2, 4.4) | Maintainability | S | Med |
| 11 | Accessibility pass on modals/buttons (6.1) | UX/a11y | M | Med |
| 12 | Per-entity sync / conflict handling (3.2) | Sync | L | High (later) |
| 13 | reduced-motion + PWA update toast (6.3, 6.4) | UX | S | Low |
| 14 | Data-driven deck config (7.1) | Pipeline | S | Low |

**Suggested first sprint:** 1, 4 (security), 2, 7 (quick perf), 3 (sync), 5–6 (tests/CI).
Those remove the scariest risks and the biggest waste with mostly S/M effort, and set up
everything else to be safe to build on.
