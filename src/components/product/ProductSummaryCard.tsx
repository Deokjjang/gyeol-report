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
    <article className="grid gap-5 rounded-lg border border-neutral-800 bg-neutral-900/70 p-5 md:grid-cols-[0.8fr_1fr] md:items-center">
      <ProductVisual title={`${product.nameKo} 상품 비주얼`} />

      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-neutral-400">
            현재 구매 가능한 상품
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-neutral-50">
            {product.nameKo}
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <dt className="text-neutral-500">가격</dt>
              <dd className="mt-1 text-lg font-semibold text-neutral-50">
                {product.priceKo}
              </dd>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <dt className="text-neutral-500">형태</dt>
              <dd className="mt-1 font-semibold text-neutral-100">
                {product.formatKo}
              </dd>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 sm:col-span-2">
              <dt className="text-neutral-500">제공 방식</dt>
              <dd className="mt-1 font-semibold text-neutral-100">
                {product.deliveryTypeKo}
              </dd>
            </div>
          </dl>
          <p className="text-sm leading-6 text-neutral-400">
            {product.summaryKo}
          </p>
          <p className="text-sm leading-6 text-neutral-500">
            자기이해용 참고 콘텐츠입니다. {product.cautionKo}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-4 py-3 text-sm font-semibold text-neutral-100 transition hover:bg-neutral-800"
          >
            자세히 보기
          </Link>
          <Link
            href="/report/new"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-white"
          >
            리포트 작성하기
          </Link>
        </div>

        <nav aria-label="상품 정책 링크" className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/legal/refund"
            className="text-neutral-300 underline underline-offset-4"
          >
            환불/취소 정책
          </Link>
          <Link
            href="/legal/privacy"
            className="text-neutral-300 underline underline-offset-4"
          >
            개인정보처리방침
          </Link>
        </nav>
      </div>
    </article>
  );
}
