import type { GyeolComingSoonProduct } from "../../lib/product/gyeolProducts";

type ComingSoonProductCardProps = {
  readonly product: GyeolComingSoonProduct;
};

export default function ComingSoonProductCard({
  product,
}: ComingSoonProductCardProps) {
  return (
    <article className="flex h-full flex-col justify-between gap-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
          {product.badgeKo}
        </span>
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-neutral-950">
            {product.nameKo}
          </h3>
          <p className="text-sm leading-6 text-neutral-600">
            {product.shortDescriptionKo}
          </p>
        </div>
      </div>
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-500"
      >
        리포트 보기
      </button>
    </article>
  );
}
