import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const sourcePath = join(
  process.cwd(),
  "scripts",
  "smoke_build_compatibility_evidence.ts",
);

describe("REPORT-18A compatibility evidence smoke source", () => {
  it("supports fixture selection and prints compatibility evidence summary labels", () => {
    const source = readFileSync(sourcePath, "utf8");

    expect(source).toContain("--fixture");
    expect(source).toContain("deokmin-sodam-love");
    expect(source).toContain("compatibility fixture:");
    expect(source).toContain("relationship type:");
    expect(source).toContain("relationship label:");
    expect(source).toContain("getCompatibilityRelationshipTypeLabel");
    expect(source).toContain("score labels:");
    expect(source).toContain("getCompatibilityScoreDisplayLabels");
    expect(source).toContain("business-work-partner-sample");
    expect(source).toContain("score total:");
    expect(source).toContain("lifestyleRhythm");
    expect(source).toContain("shared features:");
    expect(source).toContain("deep saju layers:");
    expect(source).toContain("note.layer");
    expect(source).toContain("note.relationLabel");
    expect(source).toContain("plain:");
    expect(source).toContain("note.plainKoreanSummary");
    expect(source).toContain("branch_trine");
    expect(source).toContain("cross_ten_god");
    expect(source).not.toContain("mutual element complement");
    expect(source).toContain("warnings:");
  });
});
