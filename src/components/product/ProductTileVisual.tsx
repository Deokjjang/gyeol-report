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

// Layered paper, solid silhouettes and fine engraved lines form one editorial set.
function ComprehensiveVisual() {
  return (
    <g className={styles.ink} data-illustration="person-and-maps">
      <ellipse cx="185" cy="152" rx="109" ry="10" fill="#e9dfd0" stroke="none" />
      <path d="M76 53L210 24L287 112L148 147Z" fill="#e7d9bd" stroke="#a38247" />
      <path d="M84 40L224 38L271 131L126 133Z" fill="#fffaf1" />
      <path className={styles.guide} d="M100 69L237 65M109 100L251 96M128 40L163 133M185 39L220 132" />
      <path className={styles.gold} d="M104 112C144 114 132 74 172 74S226 54 248 85M120 121C151 127 170 93 210 104" />
      <path d="M145 33H221V143H145Z" fill="#f3e9dc" stroke="#7f1d38" strokeWidth="2" />
      <path className={styles.guide} d="M154 42H212V134H154Z" />
      <circle cx="183" cy="68" r="16" fill="#7f1d38" stroke="none" />
      <path d="M156 120V109C156 87 210 87 210 109V120Z" fill="#7f1d38" stroke="none" />
      <path d="M167 98Q183 111 199 98M183 111V125" stroke="#e7d9bd" />
      <path className={styles.gold} d="M133 27V45M124 36H142M229 128H245M237 120V136" />
      <circle className={styles.nodeGold} cx="110" cy="80" r="4" />
    </g>
  );
}

function CareerMoneyStudyVisual() {
  return (
    <g className={styles.ink} data-illustration="work-and-learning-path">
      <path d="M55 150H305" className={styles.guide} />
      <path d="M63 144V122H124V96H189V67H256V39H292V144Z" fill="#e7d9bd" stroke="none" />
      <path d="M63 122H124V96H189V67H256V39H292" stroke="#a38247" strokeWidth="2" />
      <g transform="rotate(-8 102 99)">
        <path d="M61 68Q83 62 102 72Q124 64 143 71V117Q123 110 102 120Q83 110 61 117Z" fill="#fffaf1" />
        <path d="M102 72V120M71 81L92 83M71 92L92 94M112 83L132 80M112 94L132 91" className={styles.gold} />
      </g>
      <path d="M158 42H204L222 60V105H158Z" fill="#fffaf1" stroke="#7f1d38" strokeWidth="1.8" />
      <path d="M204 42V60H222M170 71H206M170 82H197M170 93H200" className={styles.wine} />
      <path d="M236 95L265 36L272 40L243 99L235 105Z" fill="#a38247" />
      <path d="M265 36L268 30L275 34L272 40M235 105L239 96" />
      <circle cx="276" cy="118" r="19" fill="#7f1d38" stroke="none" />
      <path d="M269 136L264 152L276 146L286 151L283 136" fill="#7f1d38" stroke="none" />
      <circle cx="276" cy="118" r="12" stroke="#e7d9bd" />
    </g>
  );
}

function LoveMarriageChildVisual() {
  return (
    <g className={styles.ink} data-illustration="person-relationship-home">
      <path d="M54 143H304" className={styles.guide} />
      <path d="M73 112C120 156 153 52 218 86" className={styles.gold} />
      <path d="M213 83L259 44L305 83V139H213Z" fill="#e7d9bd" stroke="none" />
      <path d="M203 85L259 37L314 85" stroke="#a38247" strokeWidth="2.5" />
      <path d="M225 139V91H293V139M249 139V112Q259 98 269 112V139" stroke="#a38247" />
      <path d="M56 134V82Q56 46 87 46Q118 46 118 82V134Z" fill="#fffaf1" />
      <circle cx="87" cy="84" r="12" fill="#7f1d38" stroke="none" />
      <path d="M66 127V116C66 96 108 96 108 116V127Z" fill="#7f1d38" stroke="none" />
      <circle cx="159" cy="71" r="11" fill="#7f1d38" stroke="none" />
      <circle cx="187" cy="77" r="10" fill="#a38247" stroke="none" />
      <path d="M143 115V99C143 82 172 82 175 99L181 120M175 117V104C175 90 204 90 204 108V128" stroke="#7f1d38" strokeWidth="5" />
      <path d="M224 49Q216 30 229 25Q244 35 233 49M231 49L236 67" className={styles.gold} />
    </g>
  );
}

function CompatibilityVisual() {
  return (
    <g className={styles.ink} data-illustration="two-structures-meeting">
      <path d="M66 37H173L203 135H96Z" fill="#efe1d7" stroke="#7f1d38" strokeWidth="2" />
      <path d="M187 43L282 30L297 129L202 146Z" fill="#e7d9bd" stroke="#a38247" strokeWidth="2" />
      <path d="M84 59H179M90 83H186M97 107H194M108 37L138 135M144 37L174 135" stroke="#7f1d38" strokeOpacity=".45" />
      <path d="M199 62Q239 92 287 56M202 83Q243 114 290 77M205 105Q250 135 293 101M229 38Q210 86 243 140M263 34Q243 82 276 134" stroke="#a38247" />
      <path d="M173 52Q154 87 173 120Q203 129 221 107Q229 76 203 58Z" fill="#fffaf1" stroke="#493b32" strokeWidth="2" />
      <path d="M167 79Q193 59 217 88M166 97Q191 119 219 99M181 62Q202 89 183 121" className={styles.wine} />
      <circle cx="112" cy="149" r="10" fill="#7f1d38" stroke="none" />
      <circle cx="265" cy="153" r="10" fill="#a38247" stroke="none" />
      <path d="M125 150H160M217 152H251" className={styles.guide} />
    </g>
  );
}

function DaewoonVisual() {
  return (
    <g className={styles.ink} data-illustration="decade-chapters">
      <path d="M48 139V59L130 35L214 58L312 30V123L214 149L130 127Z" fill="#fffaf1" />
      <path d="M48 98L89 62L130 79L168 61L214 111L262 62L312 83V123L214 149L130 127L48 139Z" fill="#e7d9bd" stroke="none" />
      <path d="M48 119C91 131 97 89 130 98S180 142 214 123S267 62 312 69" stroke="#7f1d38" strokeWidth="4" />
      <path d="M130 35V127M214 58V149" className={styles.gold} />
      <path d="M48 156H312M48 151V162M130 151V162M214 151V162M312 151V162" className={styles.wine} />
      <path d="M56 154V158M64 154V158M72 154V158M80 154V158M88 154V158M96 154V158M104 154V158M112 154V158M120 154V158M138 154V158M146 154V158M154 154V158M162 154V158M170 154V158M178 154V158M186 154V158M194 154V158M202 154V158M224 154V158M234 154V158M244 154V158M254 154V158M264 154V158M274 154V158M284 154V158M294 154V158M304 154V158" className={styles.guide} />
      <circle cx="130" cy="98" r="5" className={styles.nodeWine} />
      <circle cx="214" cy="123" r="5" className={styles.nodeGold} />
      <circle cx="276" cy="50" r="10" fill="#a38247" stroke="none" />
    </g>
  );
}

function SaewoonVisual() {
  return (
    <g className={styles.ink} data-illustration="four-seasons-twelve-months">
      <path d="M62 31H298V145H62Z" fill="#fffaf1" />
      <path d="M62 31H121V145H62ZM180 31H239V145H180Z" fill="#e7d9bd" fillOpacity=".55" stroke="none" />
      <path d="M121 31V145M180 31V145M239 31V145M62 98H298" className={styles.guide} />
      <path d="M92 81V52Q74 43 76 62Q78 70 92 70M92 63Q108 43 109 56Q111 69 92 73" className={styles.wine} />
      <circle cx="151" cy="61" r="12" fill="#a38247" stroke="none" />
      <path d="M151 40V35M151 82V87M130 61H126M172 61H176M136 46L132 42M166 76L170 80M166 46L170 42M136 76L132 80" className={styles.gold} />
      <path d="M199 79C189 55 217 46 225 43C228 65 218 85 199 79ZM199 79L218 53" fill="#7f1d38" stroke="#fffaf1" />
      <path d="M269 43V81M252 52L286 72M252 72L286 52M263 46L269 51L275 46M263 78L269 73L275 78" className={styles.gold} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={69 + i * 19} y="111" width="12" height="21" rx="1" fill={i === 2 || i === 7 ? "#7f1d38" : "#d7c5a5"} stroke="none" />
      ))}
      <path d="M75 155C109 145 129 166 161 151S217 145 246 154S277 160 288 150" className={styles.wine} />
    </g>
  );
}
