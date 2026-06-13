import ProductGrid from "../components/product/ProductGrid";
import { GYEOL_HOME_PRODUCT_GRID } from "../lib/product/gyeolProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-7">
        <header className="space-y-3">
          <p className="text-base font-extrabold text-neutral-950">결리포트</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              사주×MBTI 종합 리포트
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              결제 후 입력값을 바탕으로 자동 생성되는 유료 디지털
              리포트입니다. 사람 상담이 아닌 자동 생성 리포트이며, 결제 후
              온라인에서 결과를 열람할 수 있습니다.
            </p>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
              <dt className="font-semibold text-rose-700">런칭가</dt>
              <dd className="mt-1 text-lg font-extrabold text-rose-700">
                990원
              </dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <dt className="font-semibold text-neutral-500">정가</dt>
              <dd className="mt-1 font-bold text-neutral-500 line-through">
                1,290원
              </dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <dt className="font-semibold text-neutral-500">제공 방식</dt>
              <dd className="mt-1 font-bold text-neutral-900">
                결제 후 온라인 열람
              </dd>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-3">
              <dt className="font-semibold text-neutral-500">상품 유형</dt>
              <dd className="mt-1 font-bold text-neutral-900">
                자동 생성 디지털 리포트
              </dd>
            </div>
          </dl>
        </header>

        <ProductGrid products={GYEOL_HOME_PRODUCT_GRID} />
      </section>
    </main>
  );
}
