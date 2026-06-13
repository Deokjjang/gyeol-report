import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { findUnsafeVisibleCopy } from "../../../src/lib/legal/copySafety";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const visibleCopySourceFiles = [
  "src/app/page.tsx",
  "src/app/products/page.tsx",
  "src/app/products/saju-mbti-full/page.tsx",
  "src/app/report/new/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/refund/page.tsx",
  "src/app/legal/terms/page.tsx",
  "src/app/legal/privacy/page.tsx",
  "src/app/legal/refund/page.tsx",
  "src/app/legal/business-info/page.tsx",
  "src/components/payment/DevTossCheckoutLauncher.tsx",
  "src/components/product/ProductSummaryCard.tsx",
  "src/components/product/ProductTile.tsx",
  "src/components/legal/BusinessFooter.tsx",
  "src/lib/legal/termsPolicy.ts",
  "src/lib/legal/privacyPolicy.ts",
  "src/lib/legal/refundPolicy.ts",
  "src/lib/product/gyeolProducts.ts",
] as const;

describe("visible copy safety", () => {
  it("keeps curated public product, pre-payment, and policy copy safe", () => {
    for (const relativePath of visibleCopySourceFiles) {
      const source = readSource(relativePath);

      expect(findUnsafeVisibleCopy(source), relativePath).toEqual([]);
    }
  });

  it("keeps pricing copy in the approved non-exaggerated shape", () => {
    const source = [
      readSource("src/app/page.tsx"),
      readSource("src/app/products/saju-mbti-full/page.tsx"),
      readSource("src/app/report/new/page.tsx"),
      readSource("src/components/payment/DevTossCheckoutLauncher.tsx"),
      readSource("src/lib/product/gyeolProducts.ts"),
    ].join("\n");

    expect(source).toContain("정가");
    expect(source).toContain("런칭가");
    expect(source).toContain("990원");
    expect(findUnsafeVisibleCopy(source)).toEqual([]);
  });
});
