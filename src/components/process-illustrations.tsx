/**
 * Spot illustrations for "My design process" — one per step, drawn on a
 * 240 × 180 canvas: ink outlines with a few flat fills from the site palette.
 */

const INK = "#1a1816"
const ORANGE = "#ef8b2b"
const SUN = "#f6c453"
const SKY = "#8fb2ff"
const BLUSH = "#f2b8a8"
const SAGE = "#a9cfa4"
const PAPER = "#fffdf8"

const line = { fill: "none", stroke: INK, strokeWidth: 2.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
const shape = (fill: string) => ({ fill, stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const })

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 240 180" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  )
}

/** A stack of notes and a magnifying glass over a chart. */
export function Research() {
  return (
    <Frame label="Research: notes and a magnifying glass">
      <rect x="44" y="34" width="96" height="120" rx="6" {...shape(PAPER)} transform="rotate(-8 92 94)" />
      <rect x="62" y="28" width="96" height="120" rx="6" {...shape(PAPER)} />
      <path d="M76 48h52M76 60h68M76 72h40" {...line} />
      <rect x="76" y="112" width="10" height="22" {...shape(SKY)} />
      <rect x="92" y="100" width="10" height="34" {...shape(SUN)} />
      <rect x="108" y="90" width="10" height="44" {...shape(ORANGE)} />
      <circle cx="160" cy="98" r="28" {...shape("rgba(143,178,255,.35)")} />
      <path d="M180 118l26 26" {...line} strokeWidth={8} />
      <path d="M148 86a14 14 0 0 1 14-6" {...line} stroke={PAPER} strokeWidth={3} />
    </Frame>
  )
}

/** Swatches, a photo and a fabric scrap pinned to a board. */
export function Moodboard() {
  return (
    <Frame label="Moodboard: swatches and references pinned to a board">
      <rect x="28" y="22" width="184" height="138" rx="8" {...shape("#efe6d6")} />
      <rect x="42" y="36" width="62" height="52" rx="3" {...shape(SKY)} transform="rotate(-4 73 62)" />
      <circle cx="66" cy="58" r="10" {...shape(SUN)} />
      <path d="M44 84l18-16 14 10 12-8 16 14" {...line} />
      <rect x="116" y="34" width="22" height="30" {...shape(ORANGE)} />
      <rect x="142" y="34" width="22" height="30" {...shape(BLUSH)} />
      <rect x="168" y="34" width="22" height="30" {...shape(SAGE)} />
      <path d="M118 80c14-6 26 6 40 0s26 6 40 0v40c-14 6-26-6-40 0s-26-6-40 0z" {...shape(PAPER)} />
      <path d="M126 92c10-4 18 4 28 0M126 104c10-4 18 4 28 0M164 92c8-3 14 3 22 0M164 104c8-3 14 3 22 0" {...line} strokeWidth={1.8} />
      <rect x="44" y="100" width="58" height="44" rx="3" {...shape(PAPER)} transform="rotate(5 73 122)" />
      <path d="M54 114h38M54 124h28M54 134h34" {...line} strokeWidth={2} transform="rotate(5 73 122)" />
      {[[73, 38], [127, 36], [153, 36], [179, 36], [73, 102], [158, 82]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="4.5" {...shape(ORANGE)} />
      ))}
    </Frame>
  )
}

/** Storyboard frames being sketched, with a pencil. */
export function Concept() {
  return (
    <Frame label="Concept: storyboard frames and a pencil">
      <rect x="22" y="30" width="196" height="124" rx="6" {...shape(PAPER)} />
      <rect x="34" y="42" width="54" height="44" rx="2" {...line} />
      <rect x="94" y="42" width="54" height="44" rx="2" {...line} />
      <rect x="154" y="42" width="52" height="44" rx="2" {...line} />
      <rect x="34" y="96" width="54" height="44" rx="2" {...line} />
      <rect x="94" y="96" width="54" height="44" rx="2" {...line} strokeDasharray="5 5" />
      {/* frame 1: a figure */}
      <circle cx="61" cy="57" r="6" {...line} />
      <path d="M61 63v12M53 70h16M61 75l-6 9M61 75l6 9" {...line} strokeWidth={2} />
      {/* frame 2: two figures */}
      <circle cx="111" cy="58" r="5" {...line} />
      <circle cx="131" cy="58" r="5" {...line} />
      <path d="M111 63v14M131 63v14M116 70h10" {...line} strokeWidth={2} />
      {/* frame 3: a speech bubble */}
      <path d="M164 52h32a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6h-20l-8 8v-8h-4a6 6 0 0 1-6-6V58a6 6 0 0 1 6-6z" {...shape(SUN)} />
      {/* frame 4: a close-up */}
      <circle cx="61" cy="118" r="14" {...line} />
      <path d="M55 116h2M65 116h2M56 125c3 2 7 2 10 0" {...line} strokeWidth={2} />
      {/* pencil */}
      <g transform="rotate(35 176 120)">
        <rect x="150" y="112" width="58" height="14" {...shape(SUN)} />
        <rect x="200" y="112" width="10" height="14" {...shape(BLUSH)} />
        <path d="M150 112l-14 7 14 7z" {...shape(PAPER)} />
        <path d="M140 117l-4 2 4 2" {...line} strokeWidth={3} />
      </g>
    </Frame>
  )
}

/** A garment on a hanger, a prop and a set light. */
export function Styling() {
  return (
    <Frame label="Styling and set: a garment on a hanger, a prop and a light">
      <path d="M20 30h200" {...line} strokeWidth={4} />
      <path d="M88 30v10a6 6 0 1 1 6 6" {...line} />
      <path d="M94 46l-40 22h80z" {...line} />
      <path d="M62 68h64l12 70a8 8 0 0 1-8 9H58a8 8 0 0 1-8-9z" {...shape(ORANGE)} />
      <path d="M62 68c10 14 22 14 32 0c10 14 22 14 32 0" {...line} />
      <path d="M70 100c16 6 32 6 48 0M66 122c18 6 38 6 56 0" {...line} strokeWidth={2} stroke={PAPER} />
      {/* set light */}
      <path d="M178 156v-62M164 156h28M170 156l8-14 8 14" {...line} />
      <path d="M160 58l36 0l-6 36h-24z" {...shape(INK)} />
      <path d="M150 100l-34 52M206 100l20 52" {...line} strokeDasharray="3 7" stroke={SUN} strokeWidth={3} />
      {/* prop: a vase */}
      <path d="M140 156c-10 0-12-10-8-18 3-6 2-10 0-14h16c-2 4-3 8 0 14 4 8 2 18-8 18z" {...shape(SKY)} />
      <path d="M140 124c-2-10 2-18 8-24M140 124c0-8-6-14-12-16" {...line} strokeWidth={2} />
    </Frame>
  )
}

/** A camera with a flash burst. */
export function Shoot() {
  return (
    <Frame label="The shoot: a camera with a flash">
      <path d="M182 26l6 14 14-4-8 12 12 8-15 1 2 15-11-10-9 12-1-15-15 2 11-10-10-11 15 3z" {...shape(SUN)} />
      <rect x="40" y="62" width="150" height="92" rx="12" {...shape(INK)} />
      <path d="M70 62l10-18h46l10 18" {...shape(INK)} />
      <rect x="48" y="70" width="28" height="12" rx="3" fill={ORANGE} />
      <rect x="160" y="70" width="20" height="10" rx="3" fill={PAPER} />
      <circle cx="115" cy="108" r="36" {...shape("#3a3a3a")} stroke={PAPER} />
      <circle cx="115" cy="108" r="24" fill={SKY} stroke={PAPER} strokeWidth={2.5} />
      <circle cx="115" cy="108" r="10" fill={INK} />
      <path d="M104 98a14 14 0 0 1 10-4" {...line} stroke={PAPER} strokeWidth={3} />
    </Frame>
  )
}

/** A layout with type, a colour palette and a pen-tool curve. */
export function Design() {
  return (
    <Frame label="Design: type, a colour palette and a pen-tool curve">
      <rect x="24" y="26" width="192" height="130" rx="8" {...shape(PAPER)} />
      <path d="M24 44h192" {...line} />
      <circle cx="36" cy="35" r="3" fill={ORANGE} />
      <circle cx="46" cy="35" r="3" fill={SUN} />
      <circle cx="56" cy="35" r="3" fill={SAGE} />
      <text x="38" y="102" fontFamily="var(--heading-family)" fontWeight="700" fontSize="52" fill={INK}>
        Aa
      </text>
      <path d="M40 120h66M40 132h50M40 144h58" {...line} strokeWidth={2} />
      {[ORANGE, SUN, SKY, BLUSH].map((c, i) => (
        <rect key={c} x={124 + i * 22} y="56" width="18" height="18" rx="3" {...shape(c)} />
      ))}
      <path d="M126 140c10-40 50-50 74-24" {...line} />
      <path d="M126 140l18-46M200 116l-24-30" {...line} strokeWidth={1.5} strokeDasharray="3 4" />
      <rect x="121" y="135" width="10" height="10" {...shape(PAPER)} />
      <rect x="195" y="111" width="10" height="10" {...shape(PAPER)} />
      <circle cx="144" cy="94" r="4" {...shape(ORANGE)} />
      <circle cx="176" cy="86" r="4" {...shape(ORANGE)} />
    </Frame>
  )
}

/** A billboard by the road, under a sun. */
export function OutInTheWorld() {
  return (
    <Frame label="Out in the world: a billboard under the sun">
      <circle cx="196" cy="40" r="16" {...shape(SUN)} />
      <path d="M12 156h216" {...line} />
      <path d="M150 156c0-18 10-26 22-26s22 8 22 26" {...shape(SAGE)} />
      <rect x="30" y="38" width="140" height="78" rx="4" {...shape(SKY)} />
      <rect x="40" y="48" width="56" height="58" rx="2" {...shape(ORANGE)} />
      <circle cx="68" cy="68" r="10" {...shape(PAPER)} />
      <path d="M52 106c4-14 12-20 16-20s12 6 16 20" {...shape(PAPER)} />
      <path d="M108 60h48M108 72h38M108 84h44" {...line} stroke={PAPER} strokeWidth={4} />
      <path d="M70 116v40M130 116v40M70 132l60 0M70 132l60 24M130 132l-60 24" {...line} />
      <path d="M44 116h112" {...line} strokeWidth={4} />
    </Frame>
  )
}
