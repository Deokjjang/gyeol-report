import { describe, expect, it } from "vitest";

import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionId,
} from "../../../src/lib/report-knowledge/reportSectionSchema";

const requiredSectionIds = [
  "opening_summary",
  "manse_table",
  "mbti_table",
  "saju_core",
  "mbti_core",
  "saju_mbti_fusion",
  "personality",
  "strengths",
  "weaknesses",
  "work_career",
  "money_asset",
  "love_relationship",
  "human_relations",
  "family_independence",
  "study_growth",
  "environment_luck",
  "final_advice",
] as const satisfies readonly ComprehensiveReportSectionId[];

describe("comprehensive report section schema", () => {
  it("contains all canonical section ids", () => {
    expect(COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map((item) => item.id)).toEqual(
      requiredSectionIds,
    );
  });

  it("keeps most interpretation sections saju-first", () => {
    const interpretationSections = COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.filter(
      (section) =>
        section.primaryBasis !== "display" && section.id !== "mbti_core",
    );
    const sajuFirstSections = interpretationSections.filter(
      (section) => section.sajuWeight > section.mbtiWeight,
    );

    expect(sajuFirstSections.length).toBeGreaterThanOrEqual(
      Math.ceil(interpretationSections.length * 0.75),
    );
    expect(
      COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.find(
        (section) => section.id === "personality",
      ),
    ).toMatchObject({
      sajuWeight: 0.6,
      mbtiWeight: 0.25,
      fusionWeight: 0.15,
    });
  });

  it("allows display and mbti core sections to be non-saju-primary", () => {
    const byId = Object.fromEntries(
      COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map((section) => [
        section.id,
        section,
      ]),
    );

    expect(byId.manse_table.primaryBasis).toBe("display");
    expect(byId.mbti_table.primaryBasis).toBe("display");
    expect(byId.mbti_core.primaryBasis).toBe("mbti");
    expect(byId.mbti_core.mbtiWeight).toBeGreaterThan(byId.mbti_core.sajuWeight);
  });

  it("has Korean titles, collapsible flags, and evidence minimums", () => {
    for (const section of COMPREHENSIVE_REPORT_SECTION_DEFINITIONS) {
      expect(section.titleKo.trim().length).toBeGreaterThan(0);
      expect(typeof section.shouldBeCollapsible).toBe("boolean");

      if (section.primaryBasis === "display") {
        expect(section.minimumEvidenceCount).toBeGreaterThanOrEqual(0);
      } else {
        expect(section.minimumEvidenceCount).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
