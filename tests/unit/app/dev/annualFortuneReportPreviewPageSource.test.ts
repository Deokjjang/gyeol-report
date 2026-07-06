import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/annual-fortune-preview/page.tsx"),
  "utf8",
);

describe("annual fortune report preview page source", () => {
  it("reads fixture/latest snapshot params and renders the launch view with evidence", () => {
    expect(pageSource).toContain("fixture?: string");
    expect(pageSource).toContain("snapshot?: string");
    expect(pageSource).toContain("getFixtureId");
    expect(pageSource).toContain("getSnapshotMode");
    expect(pageSource).toContain("snapshot=latest");
    expect(pageSource).toContain("readAnnualFortunePreviewSnapshot");
    expect(pageSource).toContain("AnnualFortuneReportView");
    expect(pageSource).toContain("draft={snapshot.draft}");
    expect(pageSource).toContain("evidencePacket={snapshot.evidencePacket}");
  });

  it("renders an in-memory fixture preview when no snapshot is loaded", () => {
    expect(pageSource).toContain("buildAnnualFortuneEvidence");
    expect(pageSource).toContain("buildInMemoryAnnualFortunePreviewDraft");
    expect(pageSource).toContain("in-memory fixture");
    expect(pageSource).toContain("draft={draft}");
    expect(pageSource).toContain("evidencePacket={evidencePacket}");
  });

  it("keeps the preview route gated and avoids writer, API, payment hooks", () => {
    expect(pageSource).toContain("ANNUAL_FORTUNE_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).not.toContain("openaiAnnualFortuneReportWriter");
    expect(pageSource).not.toContain("generateAnnualFortuneReportDraft");
    expect(pageSource).not.toContain("DevTossCheckoutLauncher");
    expect(pageSource).not.toContain("/api/");
  });

  it("uses the same light result tone and avoids blocked user-facing markers", () => {
    expect(pageSource).toContain("bg-[#f6f0e7]");
    expect(pageSource).toContain("w-full overflow-x-hidden");
    expect(pageSource).toContain("max-w-6xl");
    expect(pageSource).toContain("bg-[#fffaf1]");
    expect(pageSource).not.toContain("bg-neutral-950");
    expect(pageSource).not.toContain("placeholder");
    expect(pageSource).not.toContain("calendar_month_approximation");
    expect(pageSource).not.toContain("투자 수익 보장");
    expect(pageSource).not.toContain("합격 확정");
    expect(pageSource).not.toContain("승진 확정");
    expect(pageSource).not.toContain("이직 확정");
    expect(pageSource).not.toContain("결혼 확정");
    expect(pageSource).not.toContain("이혼 확정");
    expect(pageSource).not.toContain("임신/출산 확정");
    expect(pageSource).not.toContain("질병/사고/사망 예언");
  });
});
