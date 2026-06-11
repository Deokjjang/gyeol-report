import type { GyeolProductGridItem } from "../../lib/product/gyeolProducts";
import ProductTile from "./ProductTile";

type ProductGridProps = {
  readonly products: readonly GyeolProductGridItem[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section aria-label="상품 목록" className="grid gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <ProductTile key={product.id} product={product} />
      ))}
    </section>
  );
}
