const categoryChips = ["전체", "구매 가능", "준비 중"] as const;

export default function ProductCategoryChips() {
  return (
    <div aria-label="상품 분류" className="flex flex-wrap gap-2">
      {categoryChips.map((chip, index) => (
        <span
          key={chip}
          className={
            index === 0
              ? "rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white"
              : "rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-600"
          }
        >
          {chip}
        </span>
      ))}
    </div>
  );
}
