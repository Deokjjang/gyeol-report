import Link from "next/link";

import ProductSummaryCard from "../../components/product/ProductSummaryCard";
import { GYEOL_PRODUCTS } from "../../lib/product/gyeolProducts";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-medium text-neutral-400">Products</p>
          <h1 className="text-4xl font-bold tracking-tight">상품 안내</h1>
          <p className="max-w-2xl text-base leading-8 text-neutral-400">
            결리포트에서 현재 구매 가능한 상품은 사주×MBTI 전체 리포트 1개입니다.
            결제 승인 후 온라인으로 열람하는 디지털 리포트입니다.
          </p>
        </div>

        <section className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-neutral-500">정가</p>
            <p className="mt-1 font-semibold text-neutral-100">
              {GYEOL_PRODUCTS[0].listPriceKo}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">런칭가</p>
            <p className="mt-1 font-semibold text-neutral-100">
              {GYEOL_PRODUCTS[0].salePriceKo}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">결제금액</p>
            <p className="mt-1 font-semibold text-neutral-100">
              {GYEOL_PRODUCTS[0].priceKo}
            </p>
          </div>
        </section>

        {GYEOL_PRODUCTS.map((product) => (
          <ProductSummaryCard key={product.productType} product={product} />
        ))}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/products/saju-mbti-full"
            className="inline-flex items-center justify-center rounded-lg border border-neutral-700 px-5 py-4 font-semibold text-neutral-100 transition hover:bg-neutral-800"
          >
            상품 상세 보기
          </Link>
          <Link
            href="/report/new"
            className="inline-flex items-center justify-center rounded-lg bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 transition hover:bg-white"
          >
            리포트 작성하기
          </Link>
        </div>
      </section>
    </main>
  );
}
