import Link from "next/link";

import ComingSoonProductCard from "../../components/product/ComingSoonProductCard";
import ProductCategoryChips from "../../components/product/ProductCategoryChips";
import ProductSummaryCard from "../../components/product/ProductSummaryCard";
import {
  GYEOL_COMING_SOON_PRODUCTS,
  GYEOL_PRODUCTS,
} from "../../lib/product/gyeolProducts";

const activeProduct = GYEOL_PRODUCTS[0];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-5">
          <p className="text-sm font-bold text-emerald-700">Products</p>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight">상품 안내</h1>
            <p className="max-w-2xl text-base leading-8 text-neutral-600">
              현재 결제 가능한 리포트와 곧 추가될 리포트를 한곳에서 확인할 수
              있습니다.
            </p>
          </div>
          <ProductCategoryChips />
        </div>

        <section className="space-y-5" aria-labelledby="available-product-title">
          <div className="space-y-2">
            <h2
              id="available-product-title"
              className="text-2xl font-extrabold tracking-tight"
            >
              현재 구매 가능한 리포트
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              결제 승인 후 온라인으로 열람하는 디지털 리포트입니다.
            </p>
          </div>
          <ProductSummaryCard product={activeProduct} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products/saju-mbti-full"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-4 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50"
            >
              상품 상세 보기
            </Link>
            <Link
              href="/report/new"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
            >
              리포트 작성하기
            </Link>
          </div>
        </section>

        <section className="space-y-5" aria-labelledby="coming-soon-product-title">
          <div className="space-y-2">
            <h2
              id="coming-soon-product-title"
              className="text-2xl font-extrabold tracking-tight"
            >
              곧 추가될 리포트
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              준비 중인 상품은 아직 결제와 연결되어 있지 않습니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GYEOL_COMING_SOON_PRODUCTS.map((product) => (
              <ComingSoonProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
