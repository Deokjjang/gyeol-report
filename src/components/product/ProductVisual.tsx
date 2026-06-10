type ProductVisualProps = {
  readonly title?: string;
};

export default function ProductVisual({
  title = "사주×MBTI 전체 리포트 상품 비주얼",
}: ProductVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
      aria-label={title}
    >
      <svg
        role="img"
        aria-labelledby="gyeol-product-visual-title"
        viewBox="0 0 640 420"
        className="h-auto w-full"
      >
        <title id="gyeol-product-visual-title">{title}</title>
        <defs>
          <linearGradient id="gyeol-soft-bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="52%" stopColor="#eefaf4" />
            <stop offset="100%" stopColor="#fff7ed" />
          </linearGradient>
          <linearGradient id="gyeol-chart-ring" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
        </defs>

        <rect width="640" height="420" fill="url(#gyeol-soft-bg)" />
        <rect x="42" y="38" width="556" height="344" rx="18" fill="#ffffff" />
        <rect
          x="42"
          y="38"
          width="556"
          height="344"
          rx="18"
          fill="none"
          stroke="#e5e7eb"
        />

        <circle cx="208" cy="208" r="112" fill="#f8fafc" />
        <circle
          cx="208"
          cy="208"
          r="88"
          fill="none"
          stroke="url(#gyeol-chart-ring)"
          strokeWidth="5"
        />
        <circle cx="208" cy="208" r="52" fill="none" stroke="#cbd5e1" strokeWidth="3" />
        <path d="M208 106 L208 310" stroke="#d1d5db" strokeWidth="2" />
        <path d="M106 208 L310 208" stroke="#d1d5db" strokeWidth="2" />
        <path d="M136 136 L280 280" stroke="#e5e7eb" strokeWidth="2" />
        <path d="M280 136 L136 280" stroke="#e5e7eb" strokeWidth="2" />
        <circle cx="208" cy="208" r="13" fill="#111827" />
        <text x="188" y="96" fill="#334155" fontSize="18" fontWeight="700">
          사주
        </text>

        <rect x="350" y="78" width="178" height="116" rx="16" fill="#111827" />
        <rect x="370" y="98" width="56" height="10" rx="5" fill="#34d399" />
        <text x="378" y="142" fill="#ffffff" fontSize="34" fontWeight="800">
          MBTI
        </text>
        <text x="378" y="170" fill="#cbd5e1" fontSize="17">
          자기보고 성향
        </text>

        <rect x="346" y="224" width="190" height="118" rx="14" fill="#ffffff" />
        <rect
          x="346"
          y="224"
          width="190"
          height="118"
          rx="14"
          fill="none"
          stroke="#d1d5db"
        />
        <text x="374" y="262" fill="#111827" fontSize="22" fontWeight="800">
          Report
        </text>
        <rect x="374" y="282" width="120" height="8" rx="4" fill="#94a3b8" />
        <rect x="374" y="302" width="136" height="8" rx="4" fill="#d1d5db" />
        <rect x="374" y="322" width="96" height="8" rx="4" fill="#d1d5db" />

        <path
          d="M312 202 C334 202 326 136 350 136"
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M316 226 C340 226 322 284 346 284"
          fill="none"
          stroke="#10b981"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </figure>
  );
}
