# Skin System Specification

Nihongo Quest skins are mostly CSS-token themes. The intended workflow is:

1. Add or edit a skin block in `src/app.css`.
2. Set the shared colors and visual parameters with CSS variables.
3. Add two background images in `public/`: one desktop image and one mobile image.
4. Register the skin in the TypeScript settings list if it is a new selectable skin.

Components should not usually get custom colors. New UI should use semantic classes such as
`surface-card`, `surface-secondary`, `surface-highlight`, `text-main`, `text-muted`, and
`text-highlight`.

Older UI still contains Tailwind color-name classes such as `bg-slate-800` and `text-slate-400`.
Those are compatibility aliases that the skin system remaps globally to semantic tokens. For
example, old `text-pink-300` meant "accent/highlight text", not literally pink. Prefer
`text-highlight` in new or edited code.

Gradients are not part of the app UI style. Do not use gradient utility classes or CSS gradients for
buttons, cards, progress bars, text, panels, hover states, or skin tokens. Use solid token colors,
opacity, borders, shadows, and background images instead.

## Runtime Model

The active skin is stored in `settings.skin`.

`src/App.svelte` applies it to the document root:

```ts
document.documentElement.dataset.skin = $settings.skin ?? 'default';
```

That produces markup like:

```html
<html data-skin="sakura">
```

Skin CSS is then selected with:

```css
:root[data-skin='sakura'] {
  ...
}
```

The default dark look is the plain `:root` token set. The `default` skin does not need its own
`data-skin='default'` block unless it wants extra overrides.

## Main Files

- `src/app.css`: owns all skin tokens, Tailwind-to-token mappings, background image swaps, and skin-specific flair.
- `src/App.svelte`: writes `data-skin` onto `<html>`.
- `src/lib/types.ts`: defines the `AppSkin` union for valid skin ids.
- `src/components/SettingsScreen.svelte`: lists selectable skins, labels, descriptions, and swatches.
- `src/lib/i18n.ts`: stores translated skin names and descriptions.
- `public/`: stores background images, served from `/filename.jpg`.

## Token Layer

The base tokens live in `src/app.css` under the default `:root` block. A skin overrides whichever
tokens it needs.

```css
:root[data-skin='myskin'] {
  color-scheme: dark;
  --skin-bg-image: url('/skin-myskin-bg.jpg');
  --bg: var(--skin-bg-image), #101010;
  --panel: #101010;
  --panel-soft: rgba(16, 16, 16, 0.7);
  --chrome-bg: rgba(16, 16, 16, 0.95);
  --box-bg: #202020;
  --box-bg-2: #303030;
  --box-border: rgba(255, 255, 255, 0.14);
  --box-backdrop: none;
  --scrim: rgba(0, 0, 0, 0.65);
  --hover: #3a3a3a;

  --text: #e8e8e8;
  --text-strong: #ffffff;
  --text-soft: #d0d0d0;
  --text-muted: #a0a0a0;
  --text-faint: #777777;

  --accent: #6366f1;
  --accent-2: #8b5cf6;
  --on-accent: #ffffff;
  --accent-text: #c4b5fd;
  --accent-input: #6366f1;

  --warning: #fbbf24;
  --warning-bg: rgba(245, 158, 11, 0.15);
  --success: #4ade80;
  --success-bg: rgba(20, 83, 45, 0.4);
  --danger: #fb7185;
  --danger-bg: rgba(136, 19, 55, 0.4);
  --danger-solid: #be123c;

  --font: 'Noto Sans JP', 'Noto Emoji', system-ui, sans-serif;
}
```

## Token Meanings

`--bg`: Page background. Usually combines a dark/light overlay, `var(--skin-bg-image)`, and a fallback color.

`--panel`: Base app surface. Used by `bg-slate-950` and `bg-slate-900`.

`--panel-soft`: Softer panel layer. Used by `bg-slate-900/50` and `bg-slate-900/60`.

`--chrome-bg`: Header and bottom navigation background. Used by `bg-slate-900/95`.

`--box-bg`: Main container/card surface. This is the most important surface token. It powers
`bg-slate-800` and `bg-slate-800/80`.

`--box-bg-2`: Secondary surface, such as inner button rows and inset controls. It powers `bg-slate-700`.

`--box-border`: Border/ring color for cards and panels.

`--box-backdrop`: Optional glass blur. Use `none` for solid skins, or values like `blur(16px)`.

`--scrim`: Modal and overlay dim background.

`--hover`: Hover background for interactive rows and buttons that use `hover:bg-slate-*`.

`--text`, `--text-strong`, `--text-soft`, `--text-muted`, `--text-faint`: The app text scale, mapped
from `text-slate-*`.

`--accent`: Primary highlight surface. Used by `bg-indigo-500`, `bg-indigo-600`, and `bg-pink-500`.

`--accent-2`: Secondary accent color. Do not use it to create gradients.

`--on-accent`: Text and icon color on accent surfaces. This must be readable against `--accent`.
For light accents, use a dark value.

`--accent-text`: Accent/highlight text. Use it through `text-highlight`.

`--accent-input`: Native form accent color.

`--warning`, `--success`, `--danger`: Status text colors.

`--warning-bg`, `--success-bg`, `--danger-bg`, `--danger-solid`: Status backgrounds.

`--font`: Skin font stack. Keep `Noto Sans JP` and `Noto Emoji` in the fallback list so Japanese and
emoji render correctly.

## Semantic Classes

Prefer these classes in new or edited components:

| Component intent | Use this class | Skin token |
| --- | --- | --- |
| Page/base surface | `surface-page` | `--panel` |
| Soft panel | `surface-soft` | `--panel-soft` |
| Header/nav chrome | `surface-chrome` | `--chrome-bg` |
| Main card/container | `surface-card` | `--box-bg`, `--box-border`, `--box-backdrop` |
| Secondary surface | `surface-secondary` | `--box-bg-2` |
| Accent button/fill | `surface-highlight` | `--accent`, `--on-accent` |
| Main body text | `text-main` | `--text` |
| Strong text | `text-strong` | `--text-strong` |
| Soft text | `text-soft` | `--text-soft` |
| Muted text | `text-muted` | `--text-muted` |
| Faint text | `text-faint` | `--text-faint` |
| Highlight/accent text | `text-highlight` | `--accent-text` |
| Warning text/surface | `text-warning`, `surface-warning` | `--warning`, `--warning-bg` |
| Success text/surface | `text-success`, `surface-success` | `--success`, `--success-bg` |
| Danger text/surface | `text-danger`, `surface-danger` | `--danger`, `--danger-bg` |

To change the highlighted text color for Countryside, edit this token in `src/app.css`:

```css
:root[data-skin='countryside'] {
  --accent-text: #166534;
}
```

## Legacy Utility Mapping

These Tailwind color-name classes still work for older code, but do not use them in new UI:

| Component intent | Use this class | Skin token |
| --- | --- | --- |
| Page/base surface | `bg-slate-950`, `bg-slate-900` | `--panel` |
| Soft panel | `bg-slate-900/50`, `bg-slate-900/60` | `--panel-soft` |
| Header/nav chrome | `bg-slate-900/95` | `--chrome-bg` |
| Main card/container | `bg-slate-800` | `--box-bg`, `--box-border`, `--box-backdrop` |
| Secondary surface | `bg-slate-700` | `--box-bg-2` |
| Hover row/button | `hover:bg-slate-700`, etc. | `--hover` |
| Strong text | `text-slate-100`, `text-slate-200` | `--text-strong` |
| Soft text | `text-slate-300` | `--text-soft` |
| Muted text | `text-slate-400` | `--text-muted` |
| Faint text | `text-slate-500` | `--text-faint` |
| Accent button | `bg-indigo-500`, `bg-indigo-600`, `bg-pink-500` | `--accent`, `--on-accent` |
| Accent text | `text-pink-300`, `text-indigo-400`, etc. | `--accent-text` |

New UI should use semantic classes or the token variables directly. Avoid hardcoded component-level
colors, bespoke card backgrounds, and one-off gradients.

## Background Images

Yes: each visual skin should normally have two background images.

Place them in `public/`:

```text
public/skin-myskin-bg.jpg
public/skin-myskin-bg-mobile.jpg
```

Reference the desktop image in the skin block:

```css
:root[data-skin='myskin'] {
  --skin-bg-image: url('/skin-myskin-bg.jpg');
}
```

Swap to the mobile image in the shared media query near the bottom of `src/app.css`:

```css
@media (max-width: 768px) {
  :root[data-skin='myskin'] { --skin-bg-image: url('/skin-myskin-bg-mobile.jpg'); }
}
```

Skins that use image backgrounds should also make the top app wrapper transparent:

```css
:root[data-skin='myskin'] #app > .bg-slate-950 {
  background: transparent;
}
```

Recommended image notes:

- Desktop: landscape composition, safe behind centered app content.
- Mobile: portrait composition, important detail away from the topbar and bottom nav.
- Keep images reasonably compressed. Existing backgrounds are roughly 80 KB to 200 KB.
- Always include a solid fallback color in `--bg` after the image layers.

## Skin-Specific Flair

After the token block, a skin may add small overrides for its personality:

```css
:root[data-skin='myskin'] .bg-slate-800 {
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
}

:root[data-skin='myskin'] .rounded-xl,
:root[data-skin='myskin'] .rounded-2xl,
:root[data-skin='myskin'] .rounded-3xl {
  border-radius: 12px;
}
```

Use flair sparingly. Prefer tokens first, then add overrides for things tokens cannot express well:
shadows, border radius, special header treatment, glass effects, and a few view-specific details.

## Adding A New Skin

1. Pick a lowercase id, for example `myskin`.
2. Add `myskin` to `AppSkin` in `src/lib/types.ts`.
3. Add skin labels and descriptions in `src/lib/i18n.ts`.
4. Add the skin option in `src/components/SettingsScreen.svelte`, including three swatch colors.
5. Add `public/skin-myskin-bg.jpg`.
6. Add `public/skin-myskin-bg-mobile.jpg`.
7. Add the `:root[data-skin='myskin']` token block in `src/app.css`.
8. Add the mobile background swap in the `@media (max-width: 768px)` block.
9. Add `myskin` to the shared transparent-wrapper selector if it uses an image background.
10. Run `npm run check` and `npm run build`.

## Rules For New UI

- Use the established Tailwind classes that the skin system maps.
- Do not use gradients in app UI or skin CSS tokens.
- Do not hardcode `text-white` on accent surfaces. Let `--on-accent` handle contrast.
- Do not create bespoke cards inside components when `bg-slate-800` should be the themed container box.
- If a color is truly component-specific, prefer a new token or a carefully scoped skin flair rule.
- Keep Japanese font fallback intact.
- Check both dark and light-style skins for contrast.
- Check desktop and mobile backgrounds after changing a skin.
