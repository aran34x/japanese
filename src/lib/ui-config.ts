// ─────────────────────────────────────────────────────────────────
//  UI SIZE CONFIG  —  edit here to resize things across the app
//  After changing, restart the dev server (Ctrl+C → dev.bat)
// ─────────────────────────────────────────────────────────────────

export const UI = {

  // ── Topbar ───────────────────────────────────────────────────
  // Controls the height of the fixed top bar.
  // Change BOTH values together to keep content below the bar.
  //
  //   topbarPadding options:  py-1  py-2  py-3  py-4  py-5
  //   mainTopPad    options:  pt-12 pt-14 pt-16 pt-18 pt-20
  //
  topbarPadding: 'py-3',   // padding inside the topbar
  mainTopPad:    'pt-16',  // padding-top on <main> — must clear the topbar

  // ── Nav bar ──────────────────────────────────────────────────
  //   navItemPad options:  py-1  py-2  py-3  py-4
  navItemPad: 'py-2',

} as const;
