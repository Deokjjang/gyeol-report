import Link from "next/link";

import type { GyeolProduct } from "../../lib/product/gyeolProducts";
import ProductVisual from "./ProductVisual";

type ProductSummaryCardProps = {
  readonly product: GyeolProduct;
};

export default function ProductSummaryCard({
  product,
}: ProductSummaryCardProps) {
  return (
    <article className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-[0.9fr_1fr] md:items-center">
      <ProductVisual title={`${product.nameKo} 상품 비주얼`} />

      <div className="space-y-5">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              현재 구매 가능
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">
              {product.salePriceKo}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-950">
            {product.fullNameKo}
          </h2>
          <p className="text-sm font-semibold text-neutral-500">
            {product.nameKo}
          </p>
          <p className="text-sm leading-6 text-neutral-600">
            {product.summaryKo}
          </p>
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div
            aria-label={`정가 ${product.listPriceKo}`}
            className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
          >
            <dt className="text-neutral-500">정가</dt>
            <dd className="mt-1 text-base font-semibold text-neutral-400 line-through">
              {product.listPriceLabelKo}
            </dd>
          </div>
          <div
            aria-label={product.salePriceKo}
            className="rounded-lg border border-rose-200 bg-rose-50 p-4"
          >
            <dt className="text-rose-700">런칭가</dt>
            <dd className="mt-1 text-2xl font-extrabold text-rose-700">
              {product.priceLabelKo}
            </dd>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <dt className="text-neutral-500">형태</dt>
            <dd className="mt-1 font-semibold text-neutral-900">
              {product.formatKo}
            </dd>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <dt className="text-neutral-500">제공 방식</dt>
            <dd className="mt-1 font-semibold text-neutral-900">
              {product.deliveryTypeKo}
            </dd>
          </div>
        </dl>

        <p className="text-sm leading-6 text-neutral-500">
          자기이해용 참고 콘텐츠입니다. {product.cautionKo}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            자세히 보기
          </Link>
          <Link
            href={product.ctaHref}
            className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            리포트 작성하기
          </Link>
        </div>

        <nav aria-label="상품 정책 링크" className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/legal/refund"
            className="text-neutral-700 underline underline-offset-4"
          >
            환불/취소 정책
          </Link>
          <Link
            href="/legal/privacy"
            className="text-neutral-700 underline underline-offset-4"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </article>
  );
}
