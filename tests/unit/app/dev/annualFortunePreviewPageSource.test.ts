import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/dev/annual-fortune-preview/page.tsx"),
  "utf8",
);

describe("annual fortune preview page source", () => {
  it("reads fixture and snapshot query params from annual-fortune-preview snapshots", () => {
    expect(pageSource).toContain("searchParams");
    expect(pageSource).toContain("fixture");
    expect(pageSource).toContain("snapshot");
    expect(pageSource).toContain("snapshotMode");
    expect(pageSource).toContain("deokmin-2026-current");
    expect(pageSource).toContain("readAnnualFortunePreviewSnapshot");
    expect(pageSource).toContain("annual-fortune-preview");
    expect(pageSource).toContain("Preview snapshot not found. Run:");
    expect(pageSource).toContain("--write-preview");
  });

  it("gates the preview route and avoids OpenAI writer imports", () => {
    expect(pageSource).toContain("ANNUAL_FORTUNE_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("COMPATIBILITY_DEV_PREVIEW_ENABLED");
    expect(pageSource).toContain("notFound()");
    expect(pageSource).toContain("AnnualFortuneReportView");
    expect(pageSource).not.toContain("openaiAnnualFortuneReportWriter");
    expect(pageSource).not.toContain("generateAnnualFortuneReportDraft");
  });
});
