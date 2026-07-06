import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/major-fortune-preview/page.tsx"),
  "utf8",
);

describe("major fortune report preview page source", () => {
  it("reads fixture and latest snapshot query params", () => {
    expect(pageSource).toContain("fixture?: string");
    expect(pageSource).toContain("snapshot?: string");
    expect(pageSource).toContain("getFixtureId");
    expect(pageSource).toContain("getSnapshotMode");
    expect(pageSource).toContain("snapshot=latest");
  });

  it("renders snapshot draft and evidence packet through the launch view", () => {
    expect(pageSource).toContain("readMajorFortunePreviewSnapshot");
    expect(pageSource).toContain("MajorFortuneReportView");
    expect(pageSource).toContain("draft={snapshot.draft}");
    expect(pageSource).toContain("evidencePacket={snapshot.evidencePacket}");
  });

  it("wraps the dev preview in the same light result tone as the launch view", () => {
    expect(pageSource).toContain("bg-[#f6f0e7]");
    expect(pageSource).toContain("max-w-6xl");
    expect(pageSource).toContain("bg-[#fffaf1]");
    expect(pageSource).not.toContain("bg-neutral-950");
    expect(pageSource).not.toContain("bg-neutral-900");
  });

  it("renders an in-memory fixture preview when no snapshot exists", () => {
    expect(pageSource).toContain("buildMajorFortuneEvidence");
    expect(pageSource).toContain("buildInMemoryMajorFortunePreviewDraft");
    expect(pageSource).toContain("in-memory fixture");
    expect(pageSource).toContain("draft={draft}");
    expect(pageSource).toContain("evidencePacket={evidencePacket}");
  });

  it("keeps preview gated and avoids direct writer/API/payment hooks", () => {
    expect(pageSource).toContain("MAJOR_FORTUNE_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).not.toContain("openaiMajorFortuneReportWriter");
    expect(pageSource).not.toContain("generateMajorFortuneReportDraft");
    expect(pageSource).not.toContain("DevTossCheckoutLauncher");
    expect(pageSource).not.toContain("/api/");
  });

  it("does not add user-visible raw or forbidden markers", () => {
    expect(pageSource).not.toContain("source registry");
    expect(pageSource).not.toContain("placeholder");
    expect(pageSource).not.toContain("투자 수익 보장");
    expect(pageSource).not.toContain("합격 확정");
    expect(pageSource).not.toContain("승진 확정");
    expect(pageSource).not.toContain("결혼 확정");
    expect(pageSource).not.toContain("이혼 확정");
    expect(pageSource).not.toContain("질병/사고/사망 예언");
  });
});
