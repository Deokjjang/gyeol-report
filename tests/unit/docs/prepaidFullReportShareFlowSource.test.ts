import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const doc = readDoc("docs/prepaid-full-report-share-flow.md");

describe("prepaid full report share flow source", () => {
  it("documents the prepayment-first report flow decision", () => {
    const requiredMarkers = [
      "Prepaid Full Report + Share Link Flow",
      "V1 paid flow uses prepayment before personalized full report generation.",
      "Before payment, the user may see static sample content and section previews, but not a generated personalized full report.",
      "Full report generation happens only after payment success is confirmed.",
      "No payment implementation in this task.",
      "No Supabase implementation in this task.",
    ];

    for (const marker of requiredMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("documents share link policy and public access model", () => {
    const shareMarkers = [
      "A paid report can be shared by link.",
      "Anyone with the share link can view the same paid report.",
      "/r/[shareToken]",
      "`reportId` can stay internal",
      "`shareToken` can be random and unguessable",
      "`shareToken` can be rotated or revoked later",
    ];

    for (const marker of shareMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("documents data states and API boundaries", () => {
    const boundaryMarkers = [
      "PENDING_PAYMENT",
      "PAID",
      "GENERATED",
      "FAILED",
      "REFUNDED",
      "PRIVATE",
      "LINK_SHARED",
      "DISABLED",
      "POST /api/checkout/create",
      "POST /api/payments/toss/confirm",
      "POST /api/payments/toss/webhook",
      "POST /api/reports/generate-paid",
      "GET /api/reports/[shareToken]",
    ];

    for (const marker of boundaryMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("documents security notes and excludes rejected directions", () => {
    const securityMarkers = [
      "Do not expose payment secrets.",
      "Do not put personal birth data in URL.",
      "Share token should be random and unguessable.",
      "Report page should not expose raw internal traces.",
    ];
    const rejectedMarkers = [
      "무료 개인 리포트 생성 후 " + "결제",
      "raw birth data " + "in URL",
      "payment secret " + "in URL",
    ];

    for (const marker of securityMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of rejectedMarkers) {
      expect(doc).not.toContain(marker);
    }
  });

  it("documents implementation order", () => {
    const implementationOrder = [
      "SUPABASE-01 create real report storage",
      "RESULT-SHARE-01 read-only share route",
      "PRODUCT-FLOW-02 adapt UI to prepayment-first copy",
      "PAYMENT-01 Toss test checkout",
      "PAYMENT-02 payment success triggers report generation",
      "QA-PAYMENT-01 end-to-end paid report test",
    ];

    for (const marker of implementationOrder) {
      expect(doc).toContain(marker);
    }
  });
});
