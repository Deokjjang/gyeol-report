import Link from "next/link";

import ProductTileVisual from "./ProductTileVisual";
import type { ProductTileVisualKey } from "./ProductTileVisual";

export type ProductTileItem = {
  readonly id: string;
  readonly productKey?: string;
  readonly slug?: string;
  readonly nameKo: string;
  readonly versionBadgeKo: string;
  readonly status: string;
  readonly isPurchasable: boolean;
  readonly href: string | null;
  readonly previewHref?: string;
  readonly previewCtaLabelKo?: string;
  readonly previewStatusKo?: string;
  readonly badgeKo: string;
  readonly visualKey: ProductTileVisualKey;
  readonly shortDescriptionKo?: string;
  readonly summaryKo?: string;
  readonly salePriceKo?: string;
  readonly listPriceKo?: string;
  readonly listPriceLabelKo?: string;
  readonly priceLabelKo?: string;
  readonly deliveryTypeKo?: string;
  readonly formatKo?: string;
};

type PurchasableProductTileItem = ProductTileItem & {
  readonly isPurchasable: true;
  readonly href: string;
  readonly summaryKo: string;
  readonly salePriceKo: string;
  readonly listPriceKo: string;
  readonly listPriceLabelKo: string;
  readonly priceLabelKo: string;
  readonly deliveryTypeKo: string;
  readonly formatKo: string;
};

type ProductTileProps = {
  readonly product: ProductTileItem;
};

export default function ProductTile({ product }: ProductTileProps) {
  const isPurchasable = isPurchasableProduct(product);
  const hasPreviewFlow = !isPurchasable && Boolean(product.previewHref);

  return (
    <article
      className={
        isPurchasable
          ? "group flex h-full flex-col gap-4 rounded-lg border border-[#321820]/20 bg-[#fffdf8] p-4 shadow-[0_18px_50px_rgba(40,24,28,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[#7f1d38]/35 hover:shadow-[0_24px_70px_rgba(40,24,28,0.16)]"
          : "group relative flex h-full flex-col gap-4 overflow-hidden rounded-lg border border-[#d8d1c4] bg-[#fbf8f1] p-4 shadow-[0_14px_40px_rgba(40,24,28,0.07)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b8ab98]"
      }
    >
      {!isPurchasable ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#f4efe7]/40"
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
                  ? "rounded-full bg-[#7f1d38]/10 px-3 py-1 text-xs font-bold text-[#7f1d38]"
                  : "rounded-full bg-[#2c2724]/10 px-3 py-1 text-xs font-bold text-[#6f675d]"
              }
            >
              {product.badgeKo}
            </span>
            {isPurchasable ? (
              <span className="rounded-full bg-[#c79a43]/15 px-3 py-1 text-xs font-bold text-[#7a5420]">
                구매 가능
              </span>
            ) : hasPreviewFlow ? (
              <span className="rounded-full border border-[#d8d1c4] bg-[#fffdf8] px-3 py-1 text-xs font-bold text-[#7b7165]">
                {product.previewStatusKo ?? "미리보기 가능"}
              </span>
            ) : (
              <span className="rounded-full border border-[#d8d1c4] bg-[#fffdf8] px-3 py-1 text-xs font-bold text-[#7b7165]">
                비활성
              </span>
            )}
          </div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-xl font-extrabold tracking-normal text-[#201a18]">
              {product.nameKo}
            </h2>
            <span className="shrink-0 rounded-full border border-[#d8d1c4] bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-[#6f675d]">
              {product.versionBadgeKo}
            </span>
          </div>
          {isPurchasable ? (
            <div className="space-y-2">
              <p className="text-sm leading-6 text-[#554b44]">
                {product.summaryKo}
              </p>
              <ul className="flex flex-wrap gap-2 text-xs font-bold">
                <li className="rounded-full bg-[#7f1d38]/10 px-3 py-1 text-[#7f1d38]">
                  {product.salePriceKo}
                </li>
                <li className="rounded-full bg-[#f0ebe3] px-3 py-1 text-[#4c433c]">
                  정가 {product.listPriceKo}
                </li>
                <li className="rounded-full bg-[#f0ebe3] px-3 py-1 text-[#4c433c]">
                  {product.deliveryTypeKo}
                </li>
                <li className="rounded-full bg-[#f0ebe3] px-3 py-1 text-[#4c433c]">
                  {product.formatKo}
                </li>
                <li className="rounded-full bg-[#f0ebe3] px-3 py-1 text-[#4c433c]">
                  사람 상담이 아닌 자동 생성 리포트
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#6f675d]">
              {product.shortDescriptionKo}
            </p>
          )}
        </div>

        {isPurchasable ? (
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#8b8174] line-through">
                {product.listPriceLabelKo}
              </p>
              <p className="text-2xl font-extrabold text-[#201a18]">
                {product.priceLabelKo}
              </p>
            </div>
            <Link
              href={product.href}
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#241719] px-4 py-3 text-sm font-bold text-[#fffaf0] transition duration-200 hover:bg-[#7f1d38] active:scale-[0.98]"
            >
              {product.priceLabelKo} 결제하고 리포트 생성하기
            </Link>
          </div>
        ) : hasPreviewFlow ? (
          <Link
            href={product.previewHref ?? "#"}
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#7f1d38]/25 bg-[#fffdf8] px-4 py-3 text-sm font-bold text-[#7f1d38] transition duration-200 hover:border-[#7f1d38]/45 hover:bg-white active:scale-[0.98]"
          >
            {product.previewCtaLabelKo ?? "입력 흐름 미리보기"}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="min-h-12 rounded-lg border border-[#d8d1c4] bg-[#efe9df] px-4 py-3 text-sm font-bold text-[#786e62]"
          >
            출시 준비 중
          </button>
        )}
      </div>
    </article>
  );
}

function isPurchasableProduct(
  product: ProductTileItem,
): product is PurchasableProductTileItem {
  return product.isPurchasable === true;
}
