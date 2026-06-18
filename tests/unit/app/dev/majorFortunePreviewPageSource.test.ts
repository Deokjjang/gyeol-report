import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/major-fortune-preview/page.tsx"),
  "utf8",
);

describe("major fortune preview page source", () => {
  it("reads fixture and snapshot query params", () => {
    expect(pageSource).toContain("fixture?: string");
    expect(pageSource).toContain("snapshot?: string");
    expect(pageSource).toContain("getFixtureId");
    expect(pageSource).toContain("getSnapshotMode");
    expect(pageSource).toContain("snapshot=latest");
  });

  it("uses the major-fortune-preview snapshot path through the snapshot helper", () => {
    expect(pageSource).toContain("readMajorFortunePreviewSnapshot");
    expect(pageSource).toContain(".tmp/major-fortune-preview");
    expect(pageSource).toContain("smoke_generate_major_fortune_report_draft.ts");
  });

  it("gates preview by MAJOR_FORTUNE_DEV_PREVIEW_ENABLED", () => {
    expect(pageSource).toContain("MAJOR_FORTUNE_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
  });

  it("does not import the OpenAI writer", () => {
    expect(pageSource).not.toContain("openaiMajorFortuneReportWriter");
    expect(pageSource).not.toContain("generateMajorFortuneReportDraft");
  });
});
