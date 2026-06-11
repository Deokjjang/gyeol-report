import { describe, expect, it } from "vitest";

import { comprehensiveReportDraftJsonSchema } from "../../../src/lib/report-generation/comprehensiveReportDraftSchema";
import { COMPREHENSIVE_REPORT_SECTION_IDS } from "../../../src/lib/report-knowledge/reportSectionSchema";

describe("comprehensive report draft JSON schema", () => {
  it("constrains the draft version product and section ids", () => {
    const serialized = JSON.stringify(comprehensiveReportDraftJsonSchema);

    expect(serialized).toContain("comprehensive_v1_draft");
    expect(serialized).toContain("saju_mbti_full");
    for (const sectionId of COMPREHENSIVE_REPORT_SECTION_IDS) {
      expect(serialized).toContain(sectionId);
    }
  });

  it("requires the report draft fields used by the writer boundary", () => {
    const required = comprehensiveReportDraftJsonSchema.required;

    expect(required).toEqual(
      expect.arrayContaining([
        "version",
        "productType",
        "tone",
        "openingTitle",
        "openingSummary",
        "coreLine",
        "sections",
        "finalAdvice",
        "safetyNotes",
      ]),
    );
    expect(JSON.stringify(comprehensiveReportDraftJsonSchema)).toContain(
      "additionalProperties",
    );
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
