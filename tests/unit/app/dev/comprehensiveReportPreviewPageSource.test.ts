import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/comprehensive-preview/page.tsx"),
  "utf8",
);

describe("comprehensive report preview page source", () => {
  it("reads the deterministic comprehensive v2 smoke snapshot", () => {
    expect(pageSource).toContain(
      ".tmp/comprehensive-report-preview/deokmin-external-manse.latest.json",
    );
    expect(pageSource).toContain("readComprehensivePreviewSnapshot");
    expect(pageSource).toContain("getPreviewDisplayName");
    expect(pageSource).toContain("ComprehensiveReportV2View");
    expect(pageSource).toContain("draft={snapshot.draft}");
    expect(pageSource).toContain(
      "displayName={getPreviewDisplayName(snapshot.fixtureId)}",
    );
  });

  it("renders a short missing snapshot guide", () => {
    expect(pageSource).toContain("renderMissingSnapshot");
    expect(pageSource).toContain(
      "pnpm dlx tsx scripts/smoke_generate_comprehensive_report_draft.ts --fixture deokmin --write-preview",
    );
  });

  it("keeps the dev preview gated and uses the light premium shell", () => {
    expect(pageSource).toContain("COMPREHENSIVE_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).toContain("bg-[#f6f0e7]");
    expect(pageSource).toContain("w-full overflow-x-hidden");
    expect(pageSource).toContain("bg-[#fffaf1]");
    expect(pageSource).not.toContain("bg-neutral-950");
    expect(pageSource).not.toContain("bg-neutral-900");
  });

  it("does not connect API, payment, or writer paths", () => {
    expect(pageSource).not.toContain("/api/");
    expect(pageSource).not.toContain("DevTossCheckoutLauncher");
    expect(pageSource).not.toContain("generateComprehensiveReportDraft");
    expect(pageSource).not.toContain("openai");
  });
});
