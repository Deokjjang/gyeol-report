import ProductTile from "./ProductTile";
import type { ProductTileItem } from "./ProductTile";
import styles from "./editorialProduct.module.css";

type ProductGridProps = {
  readonly products: readonly ProductTileItem[];
  readonly presentation?: "editorial";
};

export default function ProductGrid({ products, presentation }: ProductGridProps) {
  return (
    <section
      aria-label="상품 목록"
      className={presentation === "editorial" ? styles.grid : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}
    >
      {products.map((product) => (
        <ProductTile key={product.id} product={product} presentation={presentation} />
      ))}
    </section>
  );
}
