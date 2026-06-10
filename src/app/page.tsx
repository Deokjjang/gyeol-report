import Link from "next/link";

import ComingSoonProductCard from "../components/product/ComingSoonProductCard";
import ProductCategoryChips from "../components/product/ProductCategoryChips";
import ProductFlowSteps from "../components/product/ProductFlowSteps";
import ProductSummaryCard from "../components/product/ProductSummaryCard";
import {
  GYEOL_COMING_SOON_PRODUCTS,
  GYEOL_PRODUCTS,
} from "../lib/product/gyeolProducts";

const activeProduct = GYEOL_PRODUCTS[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-neutral-950">
      <section className="border-b border-neutral-200 bg-white px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-bold text-emerald-700">결리포트</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl">
                사주와 MBTI를 함께 보는 자기이해 리포트
              </h1>
              <p className="max-w-2xl text-base leading-8 text-neutral-600">
                생년월일시와 MBTI를 입력하면 성향, 관계, 일의 흐름을 한 번에
                정리합니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/report/new"
                className="inline-flex items-center justify-center rounded-lg bg-neutral-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                리포트 시작하기
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-4 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50"
              >
                상품 보기
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm font-semibold text-neutral-500">
              현재 구매 가능한 상품 1개
            </p>
            <p className="mt-3 text-xl font-bold text-neutral-950">
              {activeProduct.nameKo}
            </p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div
                aria-label={`정가 ${activeProduct.listPriceKo}`}
                className="flex justify-between gap-4"
              >
                <dt className="text-neutral-500">정가</dt>
                <dd className="font-semibold text-neutral-400 line-through">
                  {activeProduct.listPriceKo}
                </dd>
              </div>
              <div
                aria-label={activeProduct.salePriceKo}
                className="flex justify-between gap-4"
              >
                <dt className="text-neutral-500">런칭가</dt>
                <dd className="font-extrabold text-rose-700">
                  {activeProduct.priceKo}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500">제공 방식</dt>
                <dd className="text-right font-semibold text-neutral-900">
                  {activeProduct.deliveryTypeKo}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-bold text-emerald-700">Products</p>
              <h2 className="text-2xl font-extrabold tracking-tight">
                현재 구매 가능한 리포트
              </h2>
            </div>
            <ProductCategoryChips />
          </div>

          <ProductSummaryCard product={activeProduct} />
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">
              곧 추가될 리포트
            </h2>
            <p className="text-sm leading-6 text-neutral-600">
              아래 상품은 준비 중이며 결제와 연결되어 있지 않습니다.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GYEOL_COMING_SOON_PRODUCTS.map((product) => (
              <ComingSoonProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight">
            이용 흐름
          </h2>
          <ProductFlowSteps />
          <div className="rounded-lg border border-neutral-200 bg-white p-5 text-sm leading-6 text-neutral-600 shadow-sm">
            <p className="font-semibold text-neutral-900">
              자기이해용 참고 콘텐츠
            </p>
            <p className="mt-2">{activeProduct.cautionKo}</p>
            <nav aria-label="정책 링크" className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/products/saju-mbti-full"
                className="text-neutral-800 underline underline-offset-4"
              >
                상품 상세 보기
              </Link>
              <Link
                href="/legal/terms"
                className="text-neutral-800 underline underline-offset-4"
              >
                이용약관
              </Link>
              <Link
                href="/legal/privacy"
                className="text-neutral-800 underline underline-offset-4"
              >
                개인정보처리방침
              </Link>
              <Link
                href="/legal/refund"
                className="text-neutral-800 underline underline-offset-4"
              >
                환불/취소 정책
              </Link>
            </nav>
          </div>
        </div>
      </section>
    </main>
  );
}
