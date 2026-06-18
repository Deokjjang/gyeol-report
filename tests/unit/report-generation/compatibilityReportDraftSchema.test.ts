import { describe, expect, it } from "vitest";

import {
  compatibilityReportDraftJsonSchema,
  getCompatibilityReportDraftSchemaTopLevelKeys,
} from "../../../src/lib/report-generation/compatibilityReportDraftSchema";

function collectObjectSchemas(value: unknown): Array<Record<string, unknown>> {
  if (typeof value !== "object" || value === null) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.flatMap(collectObjectSchemas);
  }

  const record = value as Record<string, unknown>;
  return [
    ...(record.type === "object" ? [record] : []),
    ...Object.values(record).flatMap(collectObjectSchemas),
  ];
}

describe("compatibilityReportDraftSchema", () => {
  it("defines compatibility v1 draft identity and required top-level fields", () => {
    expect(compatibilityReportDraftJsonSchema.properties.version).toMatchObject({
      enum: ["compatibility_v1_draft"],
    });
    expect(compatibilityReportDraftJsonSchema.properties.productType).toMatchObject({
      enum: ["saju_mbti_compatibility"],
    });
    expect(compatibilityReportDraftJsonSchema.properties.productVersion).toMatchObject({
      enum: ["1.0"],
    });
    expect(compatibilityReportDraftJsonSchema.properties.relationshipType).toMatchObject({
      enum: [
        "love",
        "marriage",
        "some",
        "friendship",
        "family",
        "business_work_partner",
      ],
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

  it("keeps the OpenAI response format strict and simple", () => {
    const scoreSummary = compatibilityReportDraftJsonSchema.properties.scoreSummary;
    const chapterItems = compatibilityReportDraftJsonSchema.properties.chapters.items;
    const serialized = JSON.stringify(compatibilityReportDraftJsonSchema);

    expect(scoreSummary.properties.totalScore).toEqual({ type: "number" });
    expect(scoreSummary.properties.breakdown.properties.attraction).toEqual({
      type: "number",
    });
    expect(chapterItems.properties.directHitScenes).toMatchObject({
      type: "array",
      items: { type: "string" },
    });
    expect(serialized).not.toContain("unknown");
    expect(serialized).not.toContain("anyOf");
    expect(serialized).not.toContain("oneOf");
    expect(serialized).not.toContain("nullable");
    expect(serialized).not.toContain("additionalProperties\":true");
    for (const objectSchema of collectObjectSchemas(compatibilityReportDraftJsonSchema)) {
      expect(objectSchema.additionalProperties).toBe(false);
    }
  });

  it("uses string summaries for chart comparison in the response format", () => {
    expect(
      compatibilityReportDraftJsonSchema.properties.chartComparison.properties.personA,
    ).toEqual({ type: "string" });
    expect(
      compatibilityReportDraftJsonSchema.properties.chartComparison.properties.personB,
    ).toEqual({ type: "string" });
  });
});
