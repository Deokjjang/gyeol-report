import type { GyeolProductGridItem } from "../../lib/product/gyeolProducts";

type ProductTileVisualProps = {
  readonly variant: GyeolProductGridItem["visualKey"];
  readonly title: string;
};

export default function ProductTileVisual({
  variant,
  title,
}: ProductTileVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-lg bg-slate-50"
      aria-label={title}
    >
      <svg
        role="img"
        aria-label={title}
        viewBox="0 0 360 180"
        className="h-auto w-full"
      >
        <rect width="360" height="180" rx="16" fill="#f8fafc" />
        {variant === "half_year" ? <HalfYearVisual /> : null}
        {variant === "comprehensive" ? <ComprehensiveVisual /> : null}
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
      <rect x="58" y="42" width="128" height="94" rx="12" fill="#ffffff" stroke="#d1d5db" />
      <path d="M58 68 H186" stroke="#0f172a" strokeWidth="3" />
      <rect x="78" y="84" width="22" height="18" rx="4" fill="#bae6fd" />
      <rect x="110" y="84" width="22" height="18" rx="4" fill="#bbf7d0" />
      <rect x="142" y="84" width="22" height="18" rx="4" fill="#fed7aa" />
      <path d="M214 118 C244 78 284 78 310 110" fill="none" stroke="#2563eb" strokeWidth="8" strokeLinecap="round" />
      <circle cx="236" cy="62" r="22" fill="#fde68a" />
      <path d="M296 55 A22 22 0 1 0 296 99 A16 22 0 1 1 296 55" fill="#94a3b8" />
    </>
  );
}

function ComprehensiveVisual() {
  return (
    <>
      <circle cx="106" cy="90" r="42" fill="#ecfdf5" stroke="#10b981" strokeWidth="5" />
      <path d="M106 48 V132 M64 90 H148 M76 60 L136 120 M136 60 L76 120" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="106" cy="90" r="7" fill="#0f172a" />
      <rect x="174" y="48" width="96" height="58" rx="12" fill="#0f172a" />
      <text x="192" y="84" fill="#ffffff" fontSize="22" fontWeight="800">MBTI</text>
      <rect x="198" y="110" width="96" height="48" rx="10" fill="#ffffff" stroke="#cbd5e1" />
      <rect x="216" y="126" width="52" height="6" rx="3" fill="#94a3b8" />
      <rect x="216" y="140" width="38" height="6" rx="3" fill="#cbd5e1" />
    </>
  );
}

function DaewoonVisual() {
  return (
    <>
      <path d="M48 126 C92 56 132 140 176 82 C220 24 254 72 312 44" fill="none" stroke="#0f172a" strokeWidth="8" strokeLinecap="round" />
      <path d="M56 132 C104 78 136 154 184 96 C226 46 264 88 306 64" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round" />
      <circle cx="74" cy="110" r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
      <circle cx="178" cy="84" r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
      <circle cx="294" cy="52" r="11" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
    </>
  );
}

function SaewoonVisual() {
  return (
    <>
      <circle cx="180" cy="90" r="54" fill="#eff6ff" stroke="#93c5fd" strokeWidth="4" />
      <circle cx="180" cy="90" r="10" fill="#2563eb" />
      <circle cx="180" cy="36" r="13" fill="#fbbf24" />
      <circle cx="231" cy="106" r="11" fill="#34d399" />
      <circle cx="132" cy="112" r="11" fill="#fb7185" />
      <path d="M180 36 A54 54 0 0 1 231 106 A54 54 0 0 1 132 112 A54 54 0 0 1 180 36" fill="none" stroke="#0f172a" strokeWidth="3" strokeDasharray="8 8" />
    </>
  );
}

function CompatibilityVisual() {
  return (
    <>
      <circle cx="144" cy="90" r="48" fill="#fce7f3" stroke="#fb7185" strokeWidth="5" />
      <circle cx="216" cy="90" r="48" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="5" />
      <path d="M174 90 C184 74 204 74 214 90 C204 108 184 108 174 90" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
      <rect x="96" y="138" width="168" height="10" rx="5" fill="#cbd5e1" />
    </>
  );
}
