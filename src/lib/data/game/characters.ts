// The original character roster for Adventure mode. Each character is hand-drawn
// as inline SVG (viewBox 0 0 100 100) so it stays tiny, scales crisply, and can
// be rendered as a locked silhouette via a CSS brightness(0) filter.
//
// All characters are ORIGINAL creations (Japanese folklore / pop-culture *vibe*,
// not copyrighted characters). Power levels escalate as an anime parody.

export interface GameCharacter {
  id: string;
  name: string;
  title: { en: string; it: string };
  blurb: { en: string; it: string };
  /** Total lifetime XP required to unlock this character. */
  xpRequired: number;
  /** Tongue-in-cheek anime "power level". */
  power: string;
  color: string;
  svg: string;
  /** Wikipedia Commons photo shown when unlocked. SVG used as locked silhouette. */
  imageUrl?: string;
}

// Shared aura ring used behind each portrait.
const aura = (c: string) =>
  `<circle cx="50" cy="50" r="46" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>`;

// Wikipedia REST API thumbnail — most reliable cross-origin approach.
const wiki = (file: string, w = 300) =>
  `https://en.wikipedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(file)}&width=${w}`;

export const CHARACTERS: GameCharacter[] = [
  {
    id: 'mochi',
    name: 'Mochi-chan',
    title: { en: 'The Squishy Initiate', it: "L'Iniziato Morbidoso" },
    blurb: {
      en: 'A humble rice-cake sprite. Believes in you. Mostly naps.',
      it: 'Un umile spiritello di mochi. Crede in te. Per lo più dorme.'
    },
    xpRequired: 0,
    power: '5',
    color: '#f9a8d4',
    imageUrl: wiki('Mochi 002.jpg'),
    svg: `${aura('#f9a8d4')}
      <ellipse cx="50" cy="56" rx="30" ry="26" fill="#fdf2f8"/>
      <ellipse cx="50" cy="56" rx="30" ry="26" fill="none" stroke="#f9a8d4" stroke-width="2"/>
      <circle cx="40" cy="54" r="3.5" fill="#3f1d38"/>
      <circle cx="60" cy="54" r="3.5" fill="#3f1d38"/>
      <ellipse cx="34" cy="62" rx="5" ry="3" fill="#fbcfe8"/>
      <ellipse cx="66" cy="62" rx="5" ry="3" fill="#fbcfe8"/>
      <path d="M44 64 q6 5 12 0" fill="none" stroke="#3f1d38" stroke-width="2" stroke-linecap="round"/>`
  },
  {
    id: 'onigiri',
    name: 'Onigiri Apprentice',
    title: { en: 'Rice-Ball Rookie', it: 'Recluta Palla di Riso' },
    blurb: {
      en: 'Wraps wisdom in seaweed. Tightens its headband and trains.',
      it: 'Avvolge la saggezza nelle alghe. Si stringe la fascia e si allena.'
    },
    xpRequired: 120,
    power: '40',
    color: '#94a3b8',
    imageUrl: wiki('Japanese rice balls (onigiri).jpg'),
    svg: `${aura('#94a3b8')}
      <path d="M50 22 L78 74 Q80 80 72 80 L28 80 Q20 80 22 74 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="36" y="62" width="28" height="16" rx="2" fill="#334155"/>
      <circle cx="43" cy="52" r="3" fill="#1e293b"/>
      <circle cx="57" cy="52" r="3" fill="#1e293b"/>
      <path d="M46 56 q4 3 8 0" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
      <rect x="20" y="40" width="60" height="6" rx="3" fill="#ef4444"/>
      <path d="M20 43 l-8 -4 M80 43 l8 -4" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>`
  },
  {
    id: 'tanuki',
    name: 'Tanuki Trickster',
    title: { en: 'Master of Mischief', it: 'Maestro della Malizia' },
    blurb: {
      en: 'Shapeshifts your doubts into confidence. And leaves.',
      it: 'Trasforma i tuoi dubbi in fiducia. Poi sparisce.'
    },
    xpRequired: 350,
    power: '300',
    color: '#a16207',
    imageUrl: '/assets/characters/tanuki-trickster.png',
    svg: `${aura('#a16207')}
      <circle cx="50" cy="54" r="30" fill="#b45309"/>
      <path d="M26 40 q-6 -16 6 -18 q4 8 0 16Z" fill="#92400e"/>
      <path d="M74 40 q6 -16 -6 -18 q-4 8 0 16Z" fill="#92400e"/>
      <ellipse cx="50" cy="64" rx="20" ry="16" fill="#fde68a"/>
      <ellipse cx="40" cy="52" rx="8" ry="9" fill="#3f2d12"/>
      <ellipse cx="60" cy="52" rx="8" ry="9" fill="#3f2d12"/>
      <circle cx="40" cy="51" r="3" fill="#fff"/>
      <circle cx="60" cy="51" r="3" fill="#fff"/>
      <ellipse cx="50" cy="64" rx="4" ry="3" fill="#1c1917"/>
      <path d="M30 30 q4 -6 0 -10 M70 30 q-4 -6 0 -10" stroke="#16a34a" stroke-width="3" fill="none" stroke-linecap="round"/>`
  },
  {
    id: 'kappa',
    name: 'Kappa Cadet',
    title: { en: 'River Brawler', it: 'Lottatore del Fiume' },
    blurb: {
      en: 'Keeps a dish of water — and a deep grudge against wrong answers.',
      it: "Tiene un piatto d'acqua — e rancore per le risposte sbagliate."
    },
    xpRequired: 800,
    power: '1,200',
    color: '#15803d',
    imageUrl: wiki('Water_kappa.jpg'),
    svg: `${aura('#15803d')}
      <circle cx="50" cy="54" r="30" fill="#22c55e"/>
      <ellipse cx="50" cy="30" rx="18" ry="7" fill="#86efac"/>
      <ellipse cx="50" cy="29" rx="13" ry="4.5" fill="#38bdf8"/>
      <circle cx="42" cy="52" r="6" fill="#fff"/><circle cx="42" cy="52" r="3" fill="#064e3b"/>
      <circle cx="58" cy="52" r="6" fill="#fff"/><circle cx="58" cy="52" r="3" fill="#064e3b"/>
      <ellipse cx="50" cy="64" rx="9" ry="6" fill="#fde047"/>
      <path d="M46 64 h8" stroke="#a16207" stroke-width="1.5"/>`
  },
  {
    id: 'kitsune',
    name: 'Kitsune Adept',
    title: { en: 'Nine-Tail Prodigy', it: 'Prodigio dalle Nove Code' },
    blurb: {
      en: 'Gains a tail with every breakthrough. Power level: over 9,000. 😏',
      it: 'Guadagna una coda a ogni svolta. Livello di potenza: oltre 9.000. 😏'
    },
    xpRequired: 1800,
    power: '9,001',
    color: '#ea580c',
    imageUrl: wiki('Kitsune_mask.jpg'),
    svg: `${aura('#ea580c')}
      <g fill="#fb923c" stroke="#c2410c" stroke-width="1.5">
        <path d="M50 70 q-26 6 -30 -8 q14 2 22 0Z"/>
        <path d="M50 72 q-18 14 -26 6 q12 -4 18 -10Z"/>
        <path d="M50 70 q26 6 30 -8 q-14 2 -22 0Z"/>
        <path d="M50 72 q18 14 26 6 q-12 -4 -18 -10Z"/>
      </g>
      <path d="M50 30 L30 38 L36 60 Q50 76 64 60 L70 38Z" fill="#fb923c"/>
      <path d="M30 38 l-4 -16 l16 8Z" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M70 38 l4 -16 l-16 8Z" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M44 52 L56 52 L50 64Z" fill="#fff"/>
      <ellipse cx="41" cy="46" rx="3.5" ry="5" fill="#7c2d12"/>
      <ellipse cx="59" cy="46" rx="3.5" ry="5" fill="#7c2d12"/>
      <circle cx="50" cy="60" r="2.5" fill="#7c2d12"/>`
  },
  {
    id: 'daruma',
    name: 'Daruma Sensei',
    title: { en: 'The Unfallen', it: "L'Imbattuto" },
    blurb: {
      en: 'Knocked down seven times, rises eight. Paints in an eye when you win.',
      it: 'Caduto sette volte, si rialza otto. Dipinge un occhio quando vinci.'
    },
    xpRequired: 4000,
    power: '50,000',
    color: '#dc2626',
    imageUrl: wiki('Daruma doll, cut out, 03.jpg'),
    svg: `${aura('#dc2626')}
      <path d="M50 26 q26 0 26 30 q0 24 -26 24 q-26 0 -26 -24 q0 -30 26 -30Z" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
      <ellipse cx="50" cy="58" rx="20" ry="16" fill="#fcd34d"/>
      <circle cx="41" cy="52" r="7" fill="#fff" stroke="#1c1917" stroke-width="2"/>
      <circle cx="41" cy="52" r="3" fill="#1c1917"/>
      <circle cx="59" cy="52" r="7" fill="#fde68a" stroke="#a16207" stroke-width="2" stroke-dasharray="2 2"/>
      <path d="M33 44 q8 -5 14 0 M53 44 q8 -5 14 0" stroke="#1c1917" stroke-width="2.5" fill="none"/>
      <path d="M44 64 q6 4 12 0" stroke="#7c2d12" stroke-width="2" fill="none"/>`
  },
  {
    id: 'tengu',
    name: 'Tengu Windblade',
    title: { en: 'Mountain Swordmaster', it: 'Maestro di Spada del Monte' },
    blurb: {
      en: 'Rides the wind off cliff-tops. Its long nose sniffs out lazy guesses.',
      it: 'Cavalca il vento dalle scogliere. Il lungo naso fiuta le risposte pigre.'
    },
    xpRequired: 9000,
    power: '250,000',
    color: '#b91c1c',
    imageUrl: wiki('The Tengu King Training his Pupils.jpg'),
    svg: `${aura('#b91c1c')}
      <path d="M50 24 q22 0 24 24 q-12 8 -24 8 q-12 0 -24 -8 q2 -24 24 -24Z" fill="#fff"/>
      <circle cx="50" cy="56" r="26" fill="#ef4444"/>
      <path d="M50 54 q0 18 0 22 q4 -2 4 -10 q-2 -8 -4 -12Z" fill="#fca5a5"/>
      <path d="M36 50 q6 -4 10 0 M54 50 q6 -4 10 0" stroke="#450a0a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="41" cy="54" r="2.5" fill="#450a0a"/>
      <circle cx="59" cy="54" r="2.5" fill="#450a0a"/>
      <path d="M28 40 l-10 -6 M72 40 l10 -6" stroke="#1c1917" stroke-width="3" stroke-linecap="round"/>`
  },
  {
    id: 'oni',
    name: 'Oni Berserker',
    title: { en: 'Thunderclub Demon', it: 'Demone della Mazza Tuonante' },
    blurb: {
      en: 'Crushes hesitation. Two horns, zero patience for excuses.',
      it: "Schiaccia l'esitazione. Due corna, zero pazienza per le scuse."
    },
    xpRequired: 20000,
    power: '1,000,000',
    color: '#2563eb',
    imageUrl: wiki('Oni-1995.266.53-P8260136-gradient.jpg'),
    svg: `${aura('#2563eb')}
      <path d="M34 30 q-6 -14 -12 -16 q2 12 8 18Z" fill="#e5e7eb"/>
      <path d="M66 30 q6 -14 12 -16 q-2 12 -8 18Z" fill="#e5e7eb"/>
      <circle cx="50" cy="56" r="30" fill="#3b82f6"/>
      <path d="M22 50 q12 -16 28 -12 q16 -4 28 12 q-12 6 -28 6 q-16 0 -28 -6Z" fill="#1d4ed8" opacity="0.4"/>
      <circle cx="40" cy="52" r="6" fill="#fde047"/><circle cx="40" cy="52" r="2.5" fill="#1c1917"/>
      <circle cx="60" cy="52" r="6" fill="#fde047"/><circle cx="60" cy="52" r="2.5" fill="#1c1917"/>
      <path d="M38 66 q12 8 24 0 q-3 6 -12 6 q-9 0 -12 -6Z" fill="#1e3a8a"/>
      <path d="M42 66 l2 5 M50 67 l0 6 M58 66 l-2 5" stroke="#fff" stroke-width="2"/>`
  },
  {
    id: 'karakuri',
    name: 'Karakuri Mecha',
    title: { en: 'Clockwork Titan', it: 'Titano a Orologeria' },
    blurb: {
      en: 'Ancient gears, future firepower. Calculates the kanji you fear.',
      it: 'Ingranaggi antichi, potenza futura. Calcola i kanji che temi.'
    },
    xpRequired: 45000,
    power: '10,000,000',
    color: '#0891b2',
    imageUrl: wiki('Karakuri ningyo.jpg'),
    svg: `${aura('#0891b2')}
      <rect x="26" y="34" width="48" height="44" rx="8" fill="#64748b" stroke="#334155" stroke-width="2"/>
      <rect x="32" y="42" width="36" height="20" rx="4" fill="#0f172a"/>
      <circle cx="42" cy="52" r="5" fill="#22d3ee"/>
      <circle cx="58" cy="52" r="5" fill="#22d3ee"/>
      <rect x="38" y="68" width="24" height="5" rx="2" fill="#0f172a"/>
      <line x1="50" y1="34" x2="50" y2="24" stroke="#334155" stroke-width="3"/>
      <circle cx="50" cy="22" r="4" fill="#f43f5e"/>
      <circle cx="30" cy="38" r="2" fill="#334155"/><circle cx="70" cy="38" r="2" fill="#334155"/>
      <circle cx="30" cy="74" r="2" fill="#334155"/><circle cx="70" cy="74" r="2" fill="#334155"/>`
  },
  {
    id: 'raijin',
    name: 'Raijin Striker',
    title: { en: 'God of Thunder', it: 'Dio del Tuono' },
    blurb: {
      en: 'Beats the storm-drums. Every correct answer cracks like lightning.',
      it: 'Batte i tamburi della tempesta. Ogni risposta giusta è un fulmine.'
    },
    xpRequired: 90000,
    power: '100,000,000',
    color: '#7c3aed',
    imageUrl: wiki('Raijin-ogata-emuseum.JPG'),
    svg: `${aura('#7c3aed')}
      <path d="M24 36 q26 -10 52 0 q6 18 -2 34 q-24 10 -48 0 q-8 -16 -2 -34Z" fill="#6d28d9"/>
      <circle cx="50" cy="50" r="22" fill="none" stroke="#c4b5fd" stroke-width="3"/>
      <g fill="#fbbf24">
        <circle cx="28" cy="34" r="3"/><circle cx="50" cy="28" r="3"/><circle cx="72" cy="34" r="3"/>
        <circle cx="76" cy="56" r="3"/><circle cx="50" cy="74" r="3"/><circle cx="24" cy="56" r="3"/>
      </g>
      <path d="M52 40 L42 54 L50 54 L46 66 L60 50 L52 50Z" fill="#fde047" stroke="#f59e0b" stroke-width="1"/>
      <circle cx="40" cy="48" r="2.5" fill="#ede9fe"/><circle cx="62" cy="48" r="2.5" fill="#ede9fe"/>`
  },
  {
    id: 'ryujin',
    name: 'Ryūjin',
    title: { en: 'Dragon God of the Sea', it: 'Dio Drago del Mare' },
    blurb: {
      en: 'Tides obey it. The kana bow before its coils.',
      it: 'Le maree gli obbediscono. I kana si inchinano alle sue spire.'
    },
    xpRequired: 180000,
    power: '1,000,000,000',
    color: '#059669',
    imageUrl: wiki('The Dragon King Ryujin and the Tide-controlling Jewels beneath the sea.jpg'),
    svg: `${aura('#059669')}
      <path d="M30 70 q-6 -20 8 -30 q-2 -8 6 -12 q-4 10 2 12 q10 -2 16 6 q12 0 14 14 q-8 -6 -16 -2 q6 8 -2 16 q-4 -10 -12 -8 q-8 6 -4 16 q-12 -2 -16 -18Z" fill="#10b981" stroke="#047857" stroke-width="1.5"/>
      <path d="M58 28 l8 -10 l-2 10Z" fill="#34d399"/>
      <path d="M66 34 l10 -6 l-4 10Z" fill="#34d399"/>
      <circle cx="56" cy="38" r="4" fill="#fde047"/><circle cx="56" cy="38" r="2" fill="#7c2d12"/>
      <path d="M46 34 q-8 2 -12 -2" stroke="#a7f3d0" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M62 46 q4 4 10 4" stroke="#a7f3d0" stroke-width="2" fill="none" stroke-linecap="round"/>`
  },
  {
    id: 'amaterasu',
    name: 'Amaterasu Ascendant',
    title: { en: 'Radiant Sun Goddess — FINAL FORM', it: 'Dea Solare Radiante — FORMA FINALE' },
    blurb: {
      en: 'The dawn itself. You have read your way to legend. ☀️',
      it: "L'alba stessa. Hai letto la tua strada verso la leggenda. ☀️"
    },
    xpRequired: 400000,
    power: '∞',
    color: '#f59e0b',
    imageUrl: wiki('Amaterasu cave wide.jpg'),
    svg: `<g stroke="#fbbf24" stroke-width="3" stroke-linecap="round">
        ${Array.from({ length: 12 })
          .map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            const x1 = 50 + Math.cos(a) * 38, y1 = 50 + Math.sin(a) * 38;
            const x2 = 50 + Math.cos(a) * 48, y2 = 50 + Math.sin(a) * 48;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
          })
          .join('')}
      </g>
      <circle cx="50" cy="50" r="30" fill="#fbbf24"/>
      <circle cx="50" cy="50" r="30" fill="none" stroke="#f59e0b" stroke-width="2"/>
      <circle cx="42" cy="48" r="3" fill="#7c2d12"/>
      <circle cx="58" cy="48" r="3" fill="#7c2d12"/>
      <path d="M42 58 q8 6 16 0" stroke="#7c2d12" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="36" cy="56" rx="4" ry="2.5" fill="#fca5a5"/>
      <ellipse cx="64" cy="56" rx="4" ry="2.5" fill="#fca5a5"/>`
  }
];
