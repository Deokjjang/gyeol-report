import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "scripts/smoke_openai_writer_launch_qa.ts"),
  "utf8",
);

const loaderSource = readFileSync(
  join(process.cwd(), "scripts/lib/loadLocalEnv.ts"),
  "utf8",
);

describe("OpenAI writer launch QA smoke source", () => {
  it("loads .env.local before checking writer env", () => {
    const requiredMarkers = [
      "loadLocalEnv()",
      ".env.local",
      "OPENAI_REPORT_WRITER_ENABLED",
      "OPENAI_API_KEY",
      "OPENAI_REPORT_MODEL",
      "missing env:",
      "OPENAI_API_KEY=set",
      "OPENAI_REPORT_MODEL=${model}",
    ];

    for (const marker of requiredMarkers) {
      expect(source + loaderSource).toContain(marker);
    }
  });

  it("covers all six launch product targets", () => {
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
      "product_preview",
      "reportId",
      "productType",
      "draft productType",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("covers compatibility seven relationship categories", () => {
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
      expect(source).toContain(marker);
    }
  });

  it("uses varied launch QA fixtures across products and compatibility categories", () => {
    const requiredMarkers = [
      "writerLaunchQaSingleFixtures",
      "writerLaunchQaCompatibilityFixtures",
      "서비스 기획자",
      "브랜드 디자이너",
      "영상 전공 대학생",
      "온라인 쇼핑몰 대표",
      "데이터 분석 취업 준비생",
      "birthTimeUnknown: true",
      "approximateBirthTimeSlot: \"YUSI\"",
      "approximateBirthTimeSlot: \"HAESI\"",
      "relationshipStatus: \"dating\"",
      "jobStatus: \"freelancer\"",
      "jobStatus: \"student\"",
      "jobStatus: \"business_owner\"",
      "jobStatus: \"job_seeker\"",
      "mbtiType: \"INTJ\"",
      "mbtiType: \"ENFP\"",
      "mbtiType: \"ISTJ\"",
      "mbtiType: \"ISFP\"",
      "personA: fixture.personA",
      "personB: fixture.personB",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("checks writer QA quality markers and failure path", () => {
    const requiredMarkers = [
      "forbiddenVisibleMarkers",
      "placeholder",
      "fallback",
      "source registry",
      "raw output",
      "internal",
      "assertMinimumTextLength",
      "assertNoExcessiveSentenceRepetition",
      "splitSentencesForRepetition",
      "sentence.length >= 40",
      "count >= 3",
      "assertLongformSections",
      "process.exitCode = 1",
      "OpenAI writer launch QA complete",
      "FAIL product=",
      "PASS product=",
      "label=${qaCase.label}",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("supports targeted writer QA reruns", () => {
    const requiredMarkers = [
      "--only",
      "getOnlySelectors",
      "selectWriterLaunchQaCases",
      "writerLaunchQaCaseAliases",
      "comprehensive",
      "major-fortune",
      "compatibility:marriage",
      "--only matched no writer QA cases",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not print secrets or wire paid infrastructure", () => {
    const forbiddenMarkers = [
      "process.stdout.write(apiKey",
      "writeWriterEnvStatus(apiKey",
      "OPENAI_API_KEY=${",
      "Authorization",
      "lib/payment",
      "lib/supabase",
      "confirmTossPayment",
      "createSupabase",
      "git add",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source + loaderSource).not.toContain(marker);
    }
  });
});
