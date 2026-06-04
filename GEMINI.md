# Nihongo Quest - Project Specifications & Rules

## 1. Core Principles
- **Total Mystery:** The identity, story, and specific franchise of locked characters/people MUST NOT be revealed before they are unlocked.
- **Visual Privacy:** Locked characters must use a neutral slate background. They must display a heavily blurred, grayscale Wikipedia image, preventing identification by color or distinctive silhouette. No iconic emojis or colors can be shown before unlock.
- **Language First:** All challenges must be pure Japanese language exercises (vocabulary, reading). Pop-culture trivia is strictly forbidden in challenge generation.

## 2. Roster & Categories
- **Strict 50/50/50 Balance:** The game features exactly 50 "Games" characters, 50 "Anime" characters, and 50 "Real People".
- **Broad Fictional Categories:** Fictional characters are grouped broadly into "Games" or "Anime". Specific franchises (e.g., Pokémon, Zelda, Dragon Ball) are NOT used as UI categories or revealed before unlock. Characters from different franchises are mixed together.
- **Unified Real People:** Real People do not have visible sub-categories (like "Music" or "Film") in the UI before unlock.
- **Popularity Ordering:** Within their respective lists (Games, Anime, Real People), entities MUST be ordered from **Least Popular to Most Popular**. Legendary icons (e.g., Pikachu, Goku, Hayao Miyazaki) act as the final rewards for their sections.
- **Progress Tracking:** Category buttons must dynamically display unlock progress (e.g., "Games (5/50)").

## 3. Challenge Generation ("Strict Teacher Mode")
- **Dynamic Length:** Challenges scale dynamically from **3 to 10 questions** based on the entity's popularity. Options count scales from 3 to 5.
- **Deterministic Seeding:** To prevent questions from flipping formats when a user clicks "Retry" after failing, question formats must be deterministically seeded based on the character's unique ID.
- **Vocabulary Isolation:** If a specific Japanese word (trait or role) is being tested in a challenge, that word is **permanently banned** from appearing as a "wrong answer" (distractor) in any other question during that same challenge. This prevents self-spoiling.
- **5 Language Formats:** Questions cycle through 5 distinct formats:
  1. Japanese Word -> English/Italian Meaning
  2. English/Italian Meaning -> Japanese Word
  3. Japanese Word -> Hiragana Reading
  4. Hiragana Reading -> English/Italian Meaning
  5. English/Italian Meaning -> Hiragana Reading
- **Vocabulary Checks:** For longer challenges padding out difficulty, generic questions testing *other* characters' traits are inserted. These must be explicitly prefixed with "Vocabulary Check:" so the user knows they are general practice and not hints about the mystery character.
- **Final Reveal:** The *very last* question is always the Name Reveal (matching the Kanji/Kana name to its reading). The name is never shown in earlier questions.

## 4. UI & Interaction
- **"My Adventure" Hub:** The main progression flow merges Quests and Hero collections. It prominently displays the user's current "Level" and "Title" (e.g., "Tanuki Trickster") with a "Next Levels →" link to view the full progression track.
- **Interactive Audio (TTS):** 
  - Answer options containing Japanese text automatically get a dedicated 🔊 (TTS) button.
  - The main Japanese prompt (if present) gets a 🔊 button below it.
  - **Spoiler Protection:** TTS buttons are dynamically hidden if playing the audio would spoil a reading/pronunciation question, including the final Name Reveal.
- **Clean Interface:** Manual Hiragana readings (e.g., `(reading)`) are omitted from the UI to prevent clutter, relying instead on the user's global furigana browser tool. 
