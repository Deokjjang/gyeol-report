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
  readonly title: string;
};

export default function ProductTileVisual({
  variant,
  title,
}: ProductTileVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-lg bg-[#f4efe7]"
      aria-label={title}
    >
      <svg
        role="img"
        aria-label={title}
        viewBox="0 0 360 180"
        className="h-auto w-full"
      >
        <rect width="360" height="180" rx="16" fill="#f4efe7" />
        {variant === "half_year" ? <HalfYearVisual /> : null}
        {variant === "comprehensive" ? <ComprehensiveVisual /> : null}
        {variant === "career_money_study" ? <CareerMoneyStudyVisual /> : null}
        {variant === "love_marriage_child" ? <LoveMarriageChildVisual /> : null}
        {variant === "daewoon" ? <DaewoonVisual /> : null}
        {variant === "saewoon" ? <SaewoonVisual /> : null}
        {variant === "compatibility" ? <CompatibilityVisual /> : null}
      </svg>
    </figure>
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
    <>
      <circle cx="106" cy="90" r="42" fill="#fffdf8" stroke="#7f1d38" strokeWidth="5" />
      <path d="M106 48 V132 M64 90 H148 M76 60 L136 120 M136 60 L76 120" stroke="#d8d1c4" strokeWidth="2" />
      <circle cx="106" cy="90" r="7" fill="#2c2724" />
      <rect x="174" y="48" width="96" height="58" rx="12" fill="#241719" />
      <text x="192" y="84" fill="#fffaf0" fontSize="22" fontWeight="800">MBTI</text>
      <rect x="198" y="110" width="96" height="48" rx="10" fill="#fffdf8" stroke="#d8d1c4" />
      <rect x="216" y="126" width="52" height="6" rx="3" fill="#8b8174" />
      <rect x="216" y="140" width="38" height="6" rx="3" fill="#d8d1c4" />
    </>
  );
}

function CareerMoneyStudyVisual() {
  return (
    <>
      <rect x="54" y="42" width="116" height="96" rx="14" fill="#fffdf8" stroke="#d8d1c4" />
      <rect x="78" y="66" width="68" height="8" rx="4" fill="#7f1d38" />
      <rect x="78" y="88" width="48" height="8" rx="4" fill="#c79a43" />
      <rect x="78" y="110" width="58" height="8" rx="4" fill="#5b6770" />
      <path d="M206 132 V54" stroke="#2c2724" strokeWidth="6" strokeLinecap="round" />
      <path d="M206 132 C232 108 248 82 266 50" fill="none" stroke="#7f1d38" strokeWidth="7" strokeLinecap="round" />
      <circle cx="266" cy="50" r="12" fill="#c79a43" />
      <rect x="236" y="106" width="54" height="30" rx="8" fill="#fffdf8" stroke="#d8d1c4" />
    </>
  );
}

function LoveMarriageChildVisual() {
  return (
    <>
      <rect x="60" y="48" width="90" height="88" rx="42" fill="#fffdf8" stroke="#7f1d38" strokeWidth="4" />
      <rect x="210" y="48" width="90" height="88" rx="42" fill="#fffdf8" stroke="#c79a43" strokeWidth="4" />
      <path d="M150 92 H210" stroke="#2c2724" strokeWidth="5" strokeLinecap="round" />
      <circle cx="180" cy="92" r="16" fill="#f4efe7" stroke="#d8d1c4" strokeWidth="4" />
      <path d="M174 92 C178 84 188 84 192 92 C188 101 178 101 174 92" fill="#7f1d38" opacity="0.72" />
    </>
  );
}

function DaewoonVisual() {
  return (
    <>
      <path d="M48 126 C92 56 132 140 176 82 C220 24 254 72 312 44" fill="none" stroke="#2c2724" strokeWidth="8" strokeLinecap="round" />
      <path d="M56 132 C104 78 136 154 184 96 C226 46 264 88 306 64" fill="none" stroke="#c79a43" strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="110" r="11" fill="#fffdf8" stroke="#2c2724" strokeWidth="4" />
      <circle cx="178" cy="84" r="11" fill="#fffdf8" stroke="#2c2724" strokeWidth="4" />
      <circle cx="294" cy="52" r="11" fill="#fffdf8" stroke="#2c2724" strokeWidth="4" />
    </>
  );
}

function SaewoonVisual() {
  return (
    <>
      <circle cx="180" cy="90" r="54" fill="#fffdf8" stroke="#d8d1c4" strokeWidth="4" />
      <circle cx="180" cy="90" r="10" fill="#2c2724" />
      <circle cx="180" cy="36" r="13" fill="#c79a43" />
      <circle cx="231" cy="106" r="11" fill="#7f1d38" />
      <circle cx="132" cy="112" r="11" fill="#5b6770" />
      <path d="M180 36 A54 54 0 0 1 231 106 A54 54 0 0 1 132 112 A54 54 0 0 1 180 36" fill="none" stroke="#2c2724" strokeWidth="3" strokeDasharray="8 8" />
    </>
  );
}

function CompatibilityVisual() {
  return (
    <>
      <circle cx="144" cy="90" r="48" fill="#fffdf8" stroke="#7f1d38" strokeWidth="5" />
      <circle cx="216" cy="90" r="48" fill="#fffdf8" stroke="#5b6770" strokeWidth="5" />
      <path d="M174 90 C184 74 204 74 214 90 C204 108 184 108 174 90" fill="#f4efe7" stroke="#8b8174" strokeWidth="3" />
      <rect x="96" y="138" width="168" height="10" rx="5" fill="#d8d1c4" />
    </>
  );
}
