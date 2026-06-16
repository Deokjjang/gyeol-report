import { describe, expect, it } from "vitest";

import {
  compatibilityReportDraftJsonSchema,
  getCompatibilityReportDraftSchemaTopLevelKeys,
} from "../../../src/lib/report-generation/compatibilityReportDraftSchema";

describe("compatibilityReportDraftSchema", () => {
  it("defines compatibility v1 draft identity and required top-level fields", () => {
    expect(compatibilityReportDraftJsonSchema.properties.version).toMatchObject({
      const: "compatibility_v1_draft",
    });
    expect(compatibilityReportDraftJsonSchema.properties.productType).toMatchObject({
      const: "saju_mbti_compatibility",
    });
    expect(compatibilityReportDraftJsonSchema.properties.productVersion).toMatchObject({
      const: "1.0",
    });
    expect(getCompatibilityReportDraftSchemaTopLevelKeys()).toEqual(
      expect.arrayContaining([
        "scoreSummary",
        "chartComparison",
        "keyCompatibilityPoints",
        "chapters",
        "finalAdvice",
        "safetyNotes",
      ]),
    );
  });

  it("requires bounded scores, chapter scenes, final advice, and safety notes", () => {
    const scoreSummary = compatibilityReportDraftJsonSchema.properties.scoreSummary;
    const chapterItems = compatibilityReportDraftJsonSchema.properties.chapters.items;

    expect(scoreSummary.properties.totalScore).toMatchObject({
      minimum: 35,
      maximum: 95,
    });
    expect(scoreSummary.properties.breakdown.properties.attraction).toMatchObject({
      minimum: 35,
      maximum: 95,
    });
    expect(compatibilityReportDraftJsonSchema.properties.chapters).toMatchObject({
      minItems: 8,
    });
    expect(chapterItems.properties.directHitScenes).toMatchObject({
      minItems: 1,
    });
    expect(compatibilityReportDraftJsonSchema.properties.finalAdvice).toMatchObject({
      minItems: 3,
    });
    expect(compatibilityReportDraftJsonSchema.properties.safetyNotes).toMatchObject({
      minItems: 1,
    });
  });
});
