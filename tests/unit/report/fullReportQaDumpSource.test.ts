import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptPath = join(process.cwd(), "scripts/dump_full_report_qa.ts");
const pagePath = join(process.cwd(), "src/app/report/new/page.tsx");
const scriptSource = readFileSync(scriptPath, "utf8");
const pageSource = readFileSync(pagePath, "utf8");

describe("full report QA dump source", () => {
  it("defines the local full report markdown dump fixture", () => {
    const requiredMarkers = [
      "tmp/full-report-qa.md",
      "결리포트 QA Full Report",
      "FREE_PREVIEW",
      "PAID_FULL",
      "displayName",
      "birthDate",
      "mbtiType",
      "덕짱",
      "1996-12-06",
      "ENTJ",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("uses the report pipeline and writes markdown blocks", () => {
    const requiredMarkers = [
      "createReportFromRawInput",
      "renderReport",
      "renderBlock",
      "section.blocks",
      "block.itemsKo",
      "block.keyValues",
      "writeFileSync",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("keeps public report UI locked and payment inactive", () => {
    expect(pageSource).toContain("전체 리포트 잠금");
    expect(pageSource).toContain("정식 결제 연동 후 제공 예정");
    expect(pageSource).not.toContain("/api/payments");
    expect(pageSource).not.toContain("/api/reports/unlock");
    expect(pageSource).not.toContain("paymentKey");
    expect(pageSource).not.toContain("providerPaymentId");
  });
});
