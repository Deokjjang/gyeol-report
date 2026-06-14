import { describe, expect, it } from "vitest";

import {
  comprehensiveReportDraftJsonSchema,
  comprehensiveReportV1DraftJsonSchema,
  comprehensiveReportV2DraftJsonSchema,
  openAIComprehensiveReportV2NarrativeDraftJsonSchema,
} from "../../../src/lib/report-generation/comprehensiveReportDraftSchema";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../../../src/lib/report-knowledge/reportSectionSchema";
import { COMPREHENSIVE_REPORT_V2_CHAPTER_IDS } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";

describe("comprehensive report draft JSON schema", () => {
  it("uses OpenAI V2 narrative draft schema by default", () => {
    const serialized = JSON.stringify(comprehensiveReportDraftJsonSchema);

    expect(serialized).toContain("comprehensive_v2_draft");
    expect(serialized).toContain("saju_mbti_full");
    expect(serialized).not.toContain("profileTable");
    expect(serialized).not.toContain("yearPillar");
    for (const chapterId of COMPREHENSIVE_REPORT_V2_CHAPTER_IDS) {
      expect(serialized).toContain(chapterId);
    }
  });

  it("keeps a V1 schema for backward compatibility", () => {
    const serialized = JSON.stringify(comprehensiveReportV1DraftJsonSchema);

    expect(serialized).toContain("comprehensive_v1_draft");
    for (const sectionId of COMPREHENSIVE_REPORT_SECTION_IDS) {
      expect(serialized).toContain(sectionId);
    }
  });

  it("keeps final V2 report draft schema with deterministic profile table", () => {
    const required = comprehensiveReportV2DraftJsonSchema.required;

    expect(required).toEqual(
      expect.arrayContaining([
        "version",
        "productType",
        "openingTitle",
        "openingSummary",
        "coreLine",
        "profileTable",
        "chapters",
        "finalAdvice",
        "safetyNotes",
      ]),
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "profileTable",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "yearPillar",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "dayPillarKeywords",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "tenGodSummary",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "hitReadingLines",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "solutionLines",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "additionalProperties",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain("maxLength");
  });

  it("keeps the OpenAI response format schema narrative-only", () => {
    const serialized = JSON.stringify(
      openAIComprehensiveReportV2NarrativeDraftJsonSchema,
    );

    expect(openAIComprehensiveReportV2NarrativeDraftJsonSchema.required).toEqual([
      "version",
      "productType",
      "openingTitle",
      "openingSummary",
      "coreLine",
      "chapters",
      "finalAdvice",
      "safetyNotes",
    ]);
    expect(Object.keys(openAIComprehensiveReportV2NarrativeDraftJsonSchema.properties)).toEqual([
      "version",
      "productType",
      "openingTitle",
      "openingSummary",
      "coreLine",
      "chapters",
      "finalAdvice",
      "safetyNotes",
    ]);
    expect(serialized).not.toContain("profileTable");
    expect(serialized).not.toContain("yearPillar");
    expect(serialized).not.toContain("monthPillar");
    expect(serialized).not.toContain("hourPillar");
    expect(serialized).not.toContain("dayPillarKeywords");
    expect(serialized).toContain("hitReadingLines");
    expect(serialized).toContain("solutionLines");
  });

  it("does not include private or payment fields in the schema", () => {
    const serialized = JSON.stringify(comprehensiveReportDraftJsonSchema);
    const blockedMarkers = [
      "payment" + "Key",
      "provider" + "PaymentId",
      "input" + "Snapshot",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of blockedMarkers) {
      expect(serialized).not.toContain(marker);
    }
  });
});
