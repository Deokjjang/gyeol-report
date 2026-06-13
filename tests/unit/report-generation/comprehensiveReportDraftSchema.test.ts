import { describe, expect, it } from "vitest";

import {
  comprehensiveReportDraftJsonSchema,
  comprehensiveReportV1DraftJsonSchema,
  comprehensiveReportV2DraftJsonSchema,
} from "../../../src/lib/report-generation/comprehensiveReportDraftSchema";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../../../src/lib/report-knowledge/reportSectionSchema";
import { COMPREHENSIVE_REPORT_V2_CHAPTER_IDS } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";

describe("comprehensive report draft JSON schema", () => {
  it("uses V2 narrative draft schema by default", () => {
    const serialized = JSON.stringify(comprehensiveReportDraftJsonSchema);

    expect(serialized).toContain("comprehensive_v2_draft");
    expect(serialized).toContain("saju_mbti_full");
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

  it("requires the V2 report draft fields used by the writer boundary", () => {
    const required = comprehensiveReportV2DraftJsonSchema.required;

    expect(required).toEqual(
      expect.arrayContaining([
        "version",
        "productType",
        "openingTitle",
        "openingSummary",
        "coreLine",
        "chapters",
        "finalAdvice",
        "safetyNotes",
      ]),
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain(
      "additionalProperties",
    );
    expect(JSON.stringify(comprehensiveReportV2DraftJsonSchema)).toContain("maxLength");
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
