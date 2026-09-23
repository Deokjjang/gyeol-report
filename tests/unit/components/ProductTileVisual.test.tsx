import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ProductGrid from "../../../src/components/product/ProductGrid";
import ProductTileVisual from "../../../src/components/product/ProductTileVisual";
import { GYEOL_HOME_PRODUCT_GRID } from "../../../src/lib/product/gyeolProducts";

const expectedMapping = [
  ["saju-mbti-full", "comprehensive"],
  ["career-money-study", "career_money_study"],
  ["love-marriage-child", "love_marriage_child"],
  ["compatibility", "compatibility"],
  ["major-fortune", "daewoon"],
  ["annual-fortune", "saewoon"],
] as const;

describe("product visual collection", () => {
  it("maps each of the six actual home cards to its own visual and original destination", () => {
    const html = renderToStaticMarkup(<ProductGrid products={GYEOL_HOME_PRODUCT_GRID} presentation="editorial" />);
    const cards = html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    expect(cards).toHaveLength(6);
    expect(new Set(GYEOL_HOME_PRODUCT_GRID.map((product) => product.visualKey)).size).toBe(6);
    expectedMapping.forEach(([slug, variant], index) => {
      expect(cards[index]).toContain(`data-product-visual="${variant}"`);
      expect(cards[index]).toContain(`href="/report/new?product=${slug}"`);
      expect(cards[index].match(/<a\b/g)).toHaveLength(1);
      expect(cards[index].match(/1,290원/g)).toHaveLength(1);
      expect(cards[index]).toContain('data-product-card="true"');
    });
  });

  it.each(expectedMapping)("%s renders a decorative, self-contained SVG", (_, variant) => {
    const html = renderToStaticMarkup(<ProductTileVisual variant={variant} />);
    expect(html.match(/<svg\b/g)).toHaveLength(1);
    expect(html).toContain('viewBox="0 0 360 180"');
    expect(html).toContain('aria-hidden="true" focusable="false"');
    expect(html).toContain('stroke-linecap="round"');
    expect(html).toContain('stroke-linejoin="round"');
    expect(html).not.toMatch(/<text\b|<image\b|<img\b|<foreignObject\b|<filter\b|<animate\b|<title\b|<a\b|role="img"|aria-label=|https?:/);
    // Inline paths are reusable multiple times without shared SVG ID collisions.
    expect(html).not.toMatch(/\bid=|url\(#/);
    expect(html.match(/<(path|ellipse|circle)\b/g)?.length).toBeLessThan(20);
  });

  it("keeps six distinct editorial scenes and twelve months separate from decade chapters", () => {
    const drawings = expectedMapping.map(([, variant]) =>
      renderToStaticMarkup(<ProductTileVisual variant={variant} />).replace(/data-product-visual="[^"]+"/, ""),
    );
    expect(new Set(drawings).size).toBe(6);
    expect(drawings[0]).toContain('data-illustration="person-and-maps"');
    expect(drawings[1]).toContain('data-illustration="work-and-learning-path"');
    expect(drawings[2]).toContain('data-illustration="person-relationship-home"');
    expect(drawings[3]).toContain('data-illustration="two-structures-meeting"');
    expect(drawings[4]).toContain('data-illustration="decade-chapters"');
    expect(drawings[5]).toContain('data-illustration="four-seasons-twelve-months"');
    expect(drawings[5].match(/<rect\b/g)).toHaveLength(12);
  });

  it("limits illustration motion to pointer hover or keyboard focus and respects reduced motion", () => {
    const css = readFileSync("src/components/product/productVisual.module.css", "utf8");
    expect(css).toContain("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    expect(css).toContain(":is(:hover, :focus-within)");
    expect(css).toContain("360ms");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).not.toMatch(/transition:\s*all|infinite|@keyframes|url\(/);
    const cardCss = readFileSync("src/components/product/editorialProduct.module.css", "utf8");
    expect(cardCss).toContain(".cta::after");
    expect(cardCss).toContain(":focus-visible");
  });
});
