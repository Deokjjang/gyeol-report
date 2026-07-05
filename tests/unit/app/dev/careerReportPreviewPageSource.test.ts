import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/career-report-preview/page.tsx"),
  "utf8",
);

describe("career report preview page source", () => {
  it("reads fixture and snapshot query params", () => {
    expect(pageSource).toContain("fixture?: string");
    expect(pageSource).toContain("snapshot?: string");
    expect(pageSource).toContain("getFixtureId");
    expect(pageSource).toContain("getSnapshotMode");
    expect(pageSource).toContain("snapshot=latest");
  });

  it("uses the career-report-preview snapshot path through the snapshot helper", () => {
    expect(pageSource).toContain("readCareerReportPreviewSnapshot");
    expect(pageSource).toContain("snapshot.fixtureId");
    expect(pageSource).toContain("snapshot.generatedAt");
  });

  it("renders a fixture fallback draft with evidence when no snapshot exists", () => {
    expect(pageSource).toContain("buildCareerReportEvidence");
    expect(pageSource).toContain("buildCareerReportScreenQaFallbackDraft");
    expect(pageSource).toContain("evidencePacket={fallbackEvidencePacket}");
    expect(pageSource).toContain("evidencePacket={snapshot.evidencePacket}");
  });

  it("gates preview by CAREER_REPORT_DEV_PREVIEW_ENABLED", () => {
    expect(pageSource).toContain("CAREER_REPORT_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
  });

  it("does not import the OpenAI writer", () => {
    expect(pageSource).not.toContain("openaiCareerReportWriter");
    expect(pageSource).not.toContain("generateCareerReportDraft");
  });
});
