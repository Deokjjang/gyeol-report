import styles from "./productVisual.module.css";

export type ProductTileVisualKey =
  | "half_year"
  | "comprehensive"
  | "career_money_study"
  | "love_marriage_child"
  | "daewoon"
  | "saewoon"
  | "compatibility";

type ProductTileVisualProps = {
  readonly variant: ProductTileVisualKey;
};

export default function ProductTileVisual({
  variant,
}: ProductTileVisualProps) {
  return (
    <div className={styles.canvas} data-product-visual={variant} aria-hidden="true">
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 360 180"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {variant === "half_year" ? <HalfYearVisual /> : null}
        {variant === "comprehensive" ? <ComprehensiveVisual /> : null}
        {variant === "career_money_study" ? <CareerMoneyStudyVisual /> : null}
        {variant === "love_marriage_child" ? <LoveMarriageChildVisual /> : null}
        {variant === "daewoon" ? <DaewoonVisual /> : null}
        {variant === "saewoon" ? <SaewoonVisual /> : null}
        {variant === "compatibility" ? <CompatibilityVisual /> : null}
      </svg>
    </div>
  );
}

function HalfYearVisual() {
  return (
    <>
      <rect x="58" y="42" width="128" height="94" rx="12" fill="#fffdf8" stroke="#d8d1c4" />
      <path d="M58 68 H186" stroke="#2c2724" strokeWidth="3" />
      <rect x="78" y="84" width="22" height="18" rx="4" fill="#c79a43" opacity="0.78" />
      <rect x="110" y="84" width="22" height="18" rx="4" fill="#7f1d38" opacity="0.72" />
      <rect x="142" y="84" width="22" height="18" rx="4" fill="#5b6770" opacity="0.72" />
      <path d="M214 118 C244 78 284 78 310 110" fill="none" stroke="#2c2724" strokeWidth="8" strokeLinecap="round" />
      <circle cx="236" cy="62" r="22" fill="#c79a43" opacity="0.76" />
      <path d="M296 55 A22 22 0 1 0 296 99 A16 22 0 1 1 296 55" fill="#5b6770" />
    </>
  );
}

function ComprehensiveVisual() {
  return (
    <g className={styles.ink}>
      {/* CORE: nested contours gather around a single, off-centre axis. */}
      <path className={styles.guide} d="M64 92H296 M180 22V158" />
      <g data-visual-motion="orbit">
        <path d="M82 99C82 53 133 30 180 30C228 30 276 51 278 84C282 125 223 150 180 150C137 150 82 135 82 99Z" />
        <path d="M96 98C96 61 138 39 180 39C221 39 263 55 264 85C267 119 219 141 180 141C143 141 96 128 96 98Z" />
        <path className={styles.wine} d="M111 96C111 67 146 49 180 49C214 49 249 61 250 86C252 113 212 131 180 131C150 131 111 121 111 96Z" />
        <path d="M128 94C128 72 154 60 180 60C206 60 232 67 233 87C235 108 204 120 180 120C157 120 128 113 128 94Z" />
        <path d="M146 93C146 78 164 71 180 71C198 71 215 77 215 88C216 101 196 109 180 109C164 109 146 105 146 93Z" />
      </g>
      <path className={styles.gold} d="M109 132C145 132 164 107 180 90C198 69 218 47 252 47" />
      <circle className={styles.nodeWine} cx="180" cy="90" r="4" data-visual-motion="node" />
      <circle className={styles.nodeGold} cx="252" cy="47" r="2.5" />
    </g>
  );
}

function CareerMoneyStudyVisual() {
  return (
    <g className={styles.ink}>
      {/* ASCENT: separate strands turn into one direction, without chart axes. */}
      <path className={styles.guide} d="M94 150C164 151 219 129 270 80" />
      <g data-visual-motion="orbit">
        <path d="M78 138C152 142 123 71 183 57C213 50 233 56 268 31" />
        <path d="M94 145C168 144 139 83 193 66C224 56 239 61 275 40" />
        <path className={styles.wine} d="M111 149C186 144 155 92 204 76C233 66 249 65 283 49" />
        <path d="M132 149C198 139 178 99 217 85C243 77 258 73 290 60" />
        <path className={styles.gold} d="M78 89C108 83 143 89 158 112C174 138 205 142 236 120" />
      </g>
      <circle className={styles.nodeGold} cx="158" cy="112" r="3" />
      <circle className={styles.nodeWine} cx="204" cy="76" r="3" />
      <circle className={styles.nodeWine} cx="283" cy="49" r="4" data-visual-motion="node" />
    </g>
  );
}

function LoveMarriageChildVisual() {
  return (
    <g className={styles.ink}>
      {/* BOND: two open strands become a continuous, woven middle. */}
      <g className={styles.wine} data-visual-motion="orbit">
        <path d="M65 55C121 27 128 133 180 133C230 133 238 65 295 89" />
        <path d="M65 65C119 38 132 143 180 143C235 143 242 75 295 99" />
        <path d="M65 75C116 49 136 153 180 153C240 153 246 85 295 109" />
      </g>
      <g className={styles.gold}>
        <path d="M65 109C121 137 128 31 180 31C230 31 238 99 295 75" />
        <path d="M65 119C125 147 132 41 180 41C227 41 234 109 295 85" />
        <path d="M65 129C128 157 136 51 180 51C224 51 230 119 295 95" />
      </g>
      <circle className={styles.nodeWine} cx="180" cy="143" r="3" />
      <circle className={styles.nodeGold} cx="180" cy="41" r="3" data-visual-motion="node" />
    </g>
  );
}

function DaewoonVisual() {
  return (
    <g className={styles.ink}>
      {/* ERA: broad phases on a shared time contour. */}
      <TimeContours />
      <g className={styles.wine} data-visual-motion="orbit">
        <path d={timeContourPaths[0]} pathLength="100" strokeDasharray="27 9" />
      </g>
      <path className={styles.gold} d="M74 140C134 165 231 160 286 139" />
      <circle className={styles.nodeWine} cx="136" cy="49" r="3" />
      <circle className={styles.nodeGold} cx="247" cy="64" r="3" data-visual-motion="node" />
      <circle className={styles.nodeWine} cx="296" cy="119" r="3" />
    </g>
  );
}

function SaewoonVisual() {
  return (
    <g className={styles.ink}>
      {/* YEAR: one interval is brought into focus on the same time contour. */}
      <TimeContours />
      <path className={styles.guide} d="M210 25V153" />
      <g className={styles.wine} data-visual-motion="orbit">
        {timeContourPaths.map((d) => (
          <path key={d} d={d} pathLength="100" strokeDasharray="22 78" strokeDashoffset="-48" />
        ))}
      </g>
      <g data-visual-motion="node">
        <circle className={styles.gold} cx="210" cy="58" r="15" />
        <circle className={styles.nodeWine} cx="210" cy="58" r="4" />
      </g>
      <path className={styles.gold} d="M184 137H236 M184 132V142 M236 132V142" />
    </g>
  );
}

function CompatibilityVisual() {
  return (
    <g className={styles.ink}>
      {/* RESONANCE: independent fields generate a third structure between them. */}
      <g className={styles.wine}>
        <ellipse cx="147" cy="90" rx="66" ry="53" transform="rotate(-28 147 90)" />
        <ellipse cx="147" cy="90" rx="55" ry="43" transform="rotate(-28 147 90)" />
        <ellipse cx="147" cy="90" rx="44" ry="33" transform="rotate(-28 147 90)" />
      </g>
      <g className={styles.gold} data-visual-motion="orbit">
        <ellipse cx="213" cy="90" rx="66" ry="53" transform="rotate(28 213 90)" />
        <ellipse cx="213" cy="90" rx="55" ry="43" transform="rotate(28 213 90)" />
        <ellipse cx="213" cy="90" rx="44" ry="33" transform="rotate(28 213 90)" />
      </g>
      <path className={styles.intersection} d="M180 51C164 64 157 78 157 90C157 106 167 120 180 129C193 120 203 106 203 90C203 78 196 64 180 51Z" />
      <circle className={styles.nodeWine} cx="180" cy="90" r="3" data-visual-motion="node" />
    </g>
  );
}

// The same three long contours make the two time scales visibly related.
const timeContourPaths = [
  "M64 131C126 16 210 3 296 119",
  "M64 144C126 29 210 16 296 132",
  "M74 153C134 48 210 34 286 131",
] as const;

function TimeContours() {
  return (
    <g className={styles.timeContours}>
      {timeContourPaths.map((d) => <path key={d} d={d} />)}
    </g>
  );
}
