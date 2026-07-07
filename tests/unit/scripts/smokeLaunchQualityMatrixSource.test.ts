import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const scriptSource = readFileSync(
  join(process.cwd(), "scripts/smoke_launch_quality_matrix.ts"),
  "utf8",
);

describe("launch quality matrix smoke source", () => {
  it("covers the six launch product preview smoke targets", () => {
    const requiredMarkers = [
      "saju-mbti-full",
      "saju_mbti_full",
      "career-money-study",
      "career_money_study",
      "love-marriage-child",
      "love_marriage_child",
      "compatibility",
      "saju_mbti_compatibility",
      "major-fortune",
      "major_fortune",
      "annual-fortune",
      "annual_fortune",
      "/api/reports/create",
      "/reports/${reportId}",
      "snapshotKind",
      "product_preview",
      "reportId",
      "draft productType",
      "version/productVersion",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("covers compatibility seven relationship types", () => {
    const requiredMarkers = [
      "love",
      "marriage",
      "parentChild",
      "coworker",
      "managerReport",
      "businessPartner",
      "friendship",
      "compatibility draft relationshipType",
      "compatibility evidence relationshipType",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("keeps multiple launch fixtures and edge cases", () => {
    const requiredMarkers = [
      "launchQaFixtures",
      "student-birth-time-unknown-infp",
      "employee-exact-time-estj",
      "freelancer-no-gender-isfp",
      "unemployed-no-mbti",
      "other-job-exact-time-entj",
      "birthTimeUnknown: true",
      'mbtiType: ""',
      'detailJob: ""',
      'gender: ""',
      'jobStatus: "student"',
      'jobStatus: "employee"',
      'jobStatus: "freelancer"',
      'jobStatus: "unemployed"',
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks annual selectedYear matrix", () => {
    const requiredMarkers = [
      'const annualSelectedYears = ["2026", "2025"]',
      "annual draft selectedYear",
      "annual evidence selectedYear",
      "selectedYear=${selectedYear}",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks draft and visible forbidden/internal markers", () => {
    const requiredMarkers = [
      "forbiddenDraftMarkers",
      "forbiddenVisibleMarkers",
      "placeholder",
      "fallback",
      "source registry",
      "calendar_month_approximation",
      "리포트를 찾을 수 없습니다",
      "상품 미리보기 준비 중입니다",
      "assertNoForbiddenText",
      "normalizeVisibleText",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("checks result page html markers", () => {
    const requiredMarkers = [
      "getReportHtml",
      "result page status",
      "오행 분포",
      "만세력",
      "월운",
      "세운",
      "sajuFeatureChapter",
      "내 사주의 주요 표식 해석",
      "명리×MBTI",
    ];

    for (const marker of requiredMarkers) {
      expect(scriptSource).toContain(marker);
    }
  });

  it("keeps away from paid or external integrations", () => {
    const forbiddenMarkers = [
      "lib/payment",
      "lib/supabase",
      "src/lib/payment",
      "src/lib/supabase",
      "confirmTossPayment",
      "SUPABASE",
      "OPENAI_API_KEY",
      "new OpenAI",
    ];

    for (const marker of forbiddenMarkers) {
      expect(scriptSource).not.toContain(marker);
    }
  });

  it("marks failures with process exit code", () => {
    expect(scriptSource).toContain("process.exitCode = 1");
    expect(scriptSource).toContain("PASS product=");
    expect(scriptSource).toContain("FAIL product=");
    expect(scriptSource).toContain("launch QA matrix complete");
  });
});
