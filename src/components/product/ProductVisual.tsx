type ProductVisualProps = {
  readonly title?: string;
};

export default function ProductVisual({
  title = "사주×MBTI 전체 리포트 상품 비주얼",
}: ProductVisualProps) {
  return (
    <figure
      className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950"
      aria-label={title}
    >
      <svg
        role="img"
        aria-labelledby="gyeol-product-visual-title"
        viewBox="0 0 640 420"
        className="h-auto w-full"
      >
        <title id="gyeol-product-visual-title">{title}</title>
        <rect width="640" height="420" fill="#0a0a0a" />
        <rect x="36" y="34" width="568" height="352" rx="18" fill="#171717" />
        <rect
          x="36"
          y="34"
          width="568"
          height="352"
          rx="18"
          fill="none"
          stroke="#3f3f46"
        />

        <circle cx="204" cy="208" r="104" fill="#0f172a" />
        <circle cx="204" cy="208" r="84" fill="none" stroke="#a3e635" strokeWidth="3" />
        <circle cx="204" cy="208" r="48" fill="none" stroke="#38bdf8" strokeWidth="3" />
        <path d="M204 104 L204 312" stroke="#52525b" strokeWidth="2" />
        <path d="M100 208 L308 208" stroke="#52525b" strokeWidth="2" />
        <path d="M130 134 L278 282" stroke="#52525b" strokeWidth="2" />
        <path d="M278 134 L130 282" stroke="#52525b" strokeWidth="2" />
        <circle cx="204" cy="208" r="11" fill="#f5f5f5" />
        <text x="188" y="98" fill="#d4d4d8" fontSize="18" fontWeight="700">
          사주
        </text>

        <rect x="348" y="82" width="176" height="112" rx="14" fill="#262626" />
        <rect x="348" y="82" width="176" height="112" rx="14" fill="none" stroke="#52525b" />
        <text x="378" y="132" fill="#f5f5f5" fontSize="34" fontWeight="800">
          MBTI
        </text>
        <text x="378" y="163" fill="#a3a3a3" fontSize="17">
          자기보고 성향
        </text>

        <rect x="346" y="218" width="184" height="116" rx="12" fill="#fafafa" />
        <text x="374" y="255" fill="#18181b" fontSize="22" fontWeight="800">
          Report
        </text>
        <rect x="374" y="276" width="116" height="8" rx="4" fill="#a3a3a3" />
        <rect x="374" y="296" width="132" height="8" rx="4" fill="#d4d4d8" />
        <rect x="374" y="316" width="92" height="8" rx="4" fill="#d4d4d8" />

        <path
          d="M300 208 C322 208 324 138 348 138"
          fill="none"
          stroke="#67e8f9"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M304 224 C330 224 322 274 346 274"
          fill="none"
          stroke="#bef264"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </figure>
  );
}
