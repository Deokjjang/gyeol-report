import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  COMPATIBILITY_RELATIONSHIP_TYPES,
  FOCUS_AREAS,
  JOB_STATUSES,
  RELATIONSHIP_STATUSES,
  REPORT_PRODUCT_KEYS,
  REPORT_PRODUCT_SLUGS,
  SINGLE_PERSON_REPORT_PRODUCT_KEYS,
} from "../../../src/lib/report-generation/reportInputTypes";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/reportInputTypes.ts",
);
const source = readFileSync(sourcePath, "utf8");

describe("report input payload contract", () => {
  it("keeps supported product key and slug constants", () => {
    expect(REPORT_PRODUCT_KEYS).toEqual([
      "career_money_study",
      "love_marriage_child",
      "major_fortune",
      "annual_fortune",
      "saju_mbti_full",
      "saju_mbti_compatibility",
    ]);
    expect(SINGLE_PERSON_REPORT_PRODUCT_KEYS).toEqual([
      "career_money_study",
      "love_marriage_child",
      "major_fortune",
      "annual_fortune",
      "saju_mbti_full",
    ]);
    expect(REPORT_PRODUCT_SLUGS).toEqual([
      "career-money-study",
      "love-marriage-child",
      "major-fortune",
      "annual-fortune",
      "saju-mbti-full",
      "compatibility",
    ]);
  });

  it("keeps shared user context unions intentionally small", () => {
    expect(RELATIONSHIP_STATUSES).toContain("single");
    expect(RELATIONSHIP_STATUSES).toContain("dating");
    expect(JOB_STATUSES).toContain("employee");
    expect(JOB_STATUSES).toContain("freelancer");
    expect(FOCUS_AREAS).toEqual([
      "직업",
      "돈",
      "연애",
      "관계",
      "건강관리",
      "공부",
      "가족",
      "생활 리듬",
    ]);
  });

  it("keeps compatibility canonical relationship types", () => {
    expect(COMPATIBILITY_RELATIONSHIP_TYPES).toEqual([
      "love",
      "marriage",
      "parentChild",
      "coworker",
      "managerReport",
      "businessPartner",
      "friendship",
    ]);
  });

  it("defines single-person payload shape", () => {
    const requiredMarkers = [
      "SinglePersonReportInputPayload",
      "productKey: SinglePersonReportProductKey",
      "productSlug: SinglePersonReportProductSlug",
      "person: ReportPersonInputPayload",
      "userContext",
      "relationshipStatus: RelationshipStatus",
      "jobStatus: JobStatus",
      "detailJob: string",
      "focusAreas: readonly FocusArea[]",
      "productOptions",
      "selectedYear: string",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("defines compatibility payload shape", () => {
    const requiredMarkers = [
      "CompatibilityReportInputPayload",
      'productKey: "saju_mbti_compatibility"',
      'productSlug: "compatibility"',
      "relationshipType: CompatibilityRelationshipType",
      "personA: ReportPersonInputPayload",
      "personB: ReportPersonInputPayload",
      "ReportInputPayload",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not reintroduce removed input fields", () => {
    const removedMarkers = [
      "currentConcern",
      "현재 고민",
      "자녀 계획",
      "자녀 유무",
      "결혼 상태",
    ];

    for (const marker of removedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
