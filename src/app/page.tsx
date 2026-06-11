import ProductGrid from "../components/product/ProductGrid";
import { GYEOL_HOME_PRODUCT_GRID, GYEOL_PRODUCTS } from "../lib/product/gyeolProducts";

const activeProduct = GYEOL_PRODUCTS[0];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-7">
        <header className="space-y-3">
          <p className="text-base font-extrabold text-neutral-950">결리포트</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              사주와 MBTI로 보는 나의 결
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
              생년월일시와 MBTI를 입력하면 성향, 관계, 일의 흐름을 가볍게
              정리해 드립니다.
            </p>
          </div>
        </header>

        <ProductGrid products={GYEOL_HOME_PRODUCT_GRID} />

        <p className="max-w-3xl text-xs leading-5 text-neutral-500 sm:text-sm">
          {activeProduct.cautionKo}
        </p>
      </section>
    </main>
  );
}
