import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const checkedSourceFiles = [
  "src/lib/payment/reportProductCatalog.ts",
  "src/lib/payment/paymentCheckoutSessionBoundary.ts",
  "src/lib/payment/paymentCheckoutSessionTypes.ts",
  "src/app/api/payment-checkout/prepare/route.ts",
] as const;

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const mojibakeMarkers = [
  String.fromCharCode(0x00ec),
  String.fromCharCode(0x00eb),
  String.fromCharCode(0x00ed),
  String.fromCharCode(0x00c3),
  `${String.fromCharCode(0x00ea)}${String.fromCharCode(0x00b2)}`,
  `${String.fromCharCode(0x00ea)}${String.fromCharCode(0x00b3)}`,
] as const;

describe("payment Korean encoding source guard", () => {
  it("keeps checkout labels as readable UTF-8 Korean text", () => {
    const combinedSource = checkedSourceFiles.map(readSource).join("\n");

    expect(combinedSource).toContain("사주×MBTI 종합 리포트");
    expect(combinedSource).toContain("결리포트 고객");

    for (const marker of mojibakeMarkers) {
      expect(combinedSource).not.toContain(marker);
    }
  });
});
