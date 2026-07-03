import ProductTile from "./ProductTile";
import type { ProductTileItem } from "./ProductTile";

type ProductGridProps = {
  readonly products: readonly ProductTileItem[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section
      aria-label="상품 목록"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {products.map((product) => (
        <ProductTile key={product.id} product={product} />
      ))}
    </section>
  );
}
