import Link from "next/link";

import type {
  GyeolProduct,
  GyeolProductGridItem,
} from "../../lib/product/gyeolProducts";
import ProductTileVisual from "./ProductTileVisual";

type ProductTileProps = {
  readonly product: GyeolProductGridItem;
};

export default function ProductTile({ product }: ProductTileProps) {
  const isPurchasable = isPurchasableProduct(product);

  return (
    <article
      className={
        isPurchasable
          ? "flex h-full flex-col gap-4 rounded-lg border border-neutral-900 bg-white p-4 shadow-sm"
          : "relative flex h-full flex-col gap-4 overflow-hidden rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
      }
    >
      {!isPurchasable ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-neutral-100/45"
        />
      ) : null}
      <div className="relative z-10">
        <ProductTileVisual
          variant={product.visualKey}
          title={`${product.nameKo} 상품 비주얼`}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                isPurchasable
                  ? "rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700"
                  : "rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-500"
              }
            >
              {product.badgeKo}
            </span>
            {isPurchasable ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                구매 가능
              </span>
            ) : null}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-neutral-950">
            {product.nameKo}
          </h2>
          {isPurchasable ? (
            <div className="space-y-2">
              <p className="text-sm leading-6 text-neutral-600">
                {product.summaryKo}
              </p>
              <ul className="flex flex-wrap gap-2 text-xs font-bold">
                <li className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">
                  {product.salePriceKo}
                </li>
                <li className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  정가 {product.listPriceKo}
                </li>
                <li className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  {product.deliveryTypeKo}
                </li>
                <li className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  {product.formatKo}
                </li>
                <li className="rounded-full bg-neutral-100 px-3 py-1 text-neutral-700">
                  사람 상담이 아닌 자동 생성 리포트
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-sm leading-6 text-neutral-500">
              {product.shortDescriptionKo}
            </p>
          )}
        </div>

        {isPurchasable ? (
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-neutral-400 line-through">
                {product.listPriceLabelKo}
              </p>
              <p className="text-2xl font-extrabold text-neutral-950">
                {product.priceLabelKo}
              </p>
            </div>
            <Link
              href={product.href}
              className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              {product.priceLabelKo} 결제하고 리포트 생성하기
            </Link>
          </div>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-500"
          >
            출시 준비 중
          </button>
        )}
      </div>
    </article>
  );
}

function isPurchasableProduct(
  product: GyeolProductGridItem,
): product is GyeolProduct {
  return product.isPurchasable === true;
}
