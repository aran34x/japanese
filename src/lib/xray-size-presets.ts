// Designer-editable Kanji X-ray size presets.
//
// Edit XRAY_SMALL_PRESET to tune the default S size. M/L/XL are generated from
// S by multiplying every numeric sizing/timing value by 2/3/4. This keeps the
// preset human-editable while preserving the simple S/M/L/XL settings UI.

export interface XraySizePreset {
  id: 's' | 'm' | 'l' | 'xl';
  shortName: string;
  name: string;
  multiplier: number;

  // Main kanji text size, relative to the surrounding text.
  kanjiTextScale: number;

  // Hint text above the kanji.
  readingHintFontPx: number;
  meaningHintFontPx: number;
  hintLineHeight: number;
  hintCycleMs: number;

  // Horizontal slot sizing. The engine measures the widest hint on screen and
  // adds horizontalHintMarginPx. slotMinWidthPx is the floor for empty/loading
  // states and short hints.
  horizontalHintMarginPx: number;
  slotMinWidthPx: number;

  // Vertical spacing between the hint stack and the kanji glyph.
  hintKanjiGapRem: number;
}

const XRAY_SMALL_PRESET: XraySizePreset = {
  id: 's',
  shortName: 'S',
  name: 'Small / default',
  multiplier: 1,

  kanjiTextScale: 1,
  readingHintFontPx: 15,
  meaningHintFontPx: 14,
  hintLineHeight: 1.2,
  hintCycleMs: 3000,

  horizontalHintMarginPx: 10,
  slotMinWidthPx: 2,

  hintKanjiGapRem: 0.04
};

function scalePreset(multiplier: 1 | 2 | 3 | 4, shortName: string, name: string): XraySizePreset {
  return {
    ...XRAY_SMALL_PRESET,
    id: multiplier === 1 ? 's' : multiplier === 2 ? 'm' : multiplier === 3 ? 'l' : 'xl',
    shortName,
    name,
    multiplier,
    kanjiTextScale: XRAY_SMALL_PRESET.kanjiTextScale * multiplier,
    readingHintFontPx: XRAY_SMALL_PRESET.readingHintFontPx * multiplier,
    meaningHintFontPx: XRAY_SMALL_PRESET.meaningHintFontPx * multiplier,
    hintLineHeight: XRAY_SMALL_PRESET.hintLineHeight * multiplier,
    hintCycleMs: XRAY_SMALL_PRESET.hintCycleMs * multiplier,
    horizontalHintMarginPx: XRAY_SMALL_PRESET.horizontalHintMarginPx * multiplier,
    slotMinWidthPx: XRAY_SMALL_PRESET.slotMinWidthPx * multiplier,
    hintKanjiGapRem: XRAY_SMALL_PRESET.hintKanjiGapRem * multiplier
  };
}

export const XRAY_KANJI_SIZE_PRESETS = [
  XRAY_SMALL_PRESET,
  scalePreset(2, 'M', 'Medium'),
  scalePreset(3, 'L', 'Large'),
  scalePreset(4, 'XL', 'Extra large')
] as const;

export const DEFAULT_XRAY_KANJI_SIZE_MULTIPLIER = XRAY_KANJI_SIZE_PRESETS[0].multiplier;

const allowedMultipliers = new Set<number>(XRAY_KANJI_SIZE_PRESETS.map((preset) => preset.multiplier));

export function normalizeXrayKanjiSize(value: unknown): number {
  return typeof value === 'number' && allowedMultipliers.has(value)
    ? value
    : DEFAULT_XRAY_KANJI_SIZE_MULTIPLIER;
}

export function getXrayKanjiSizePreset(value: unknown): XraySizePreset {
  const multiplier = normalizeXrayKanjiSize(value);
  return XRAY_KANJI_SIZE_PRESETS.find((preset) => preset.multiplier === multiplier) ?? XRAY_KANJI_SIZE_PRESETS[0];
}
