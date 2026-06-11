import ProductGrid from "../../components/product/ProductGrid";
import { GYEOL_HOME_PRODUCT_GRID } from "../../lib/product/gyeolProducts";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-7">
        <header className="space-y-2">
          <p className="text-sm font-bold text-emerald-700">상품</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            결리포트에서 제공하는 리포트
          </h1>
        </header>

        <ProductGrid products={GYEOL_HOME_PRODUCT_GRID} />
      </section>
    </main>
  );
}
