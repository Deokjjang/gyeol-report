import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/page.tsx"),
  "utf8",
);
const compatibilityViewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/CompatibilityReportView.tsx"),
  "utf8",
);
const source = `${pageSource}\n${compatibilityViewSource}`;

describe("report result page source", () => {
  it("renders generated report draft sections and safe fallback states", () => {
    const requiredMarkers = [
      "사주×MBTI 종합 리포트",
      "draft.openingTitle",
      "draft.openingSummary",
      "draft.coreLine",
      "draft.sections.filter",
      "draft.chapters.map",
      "만세력 및 명리학 표",
      "profile.fourPillarGrid",
      "profile.yearPillar",
      "profile.monthPillar",
      "profile.dayPillar",
      "profile.hourPillar",
      "profile.dayMaster",
      "profile.fiveElementSummary",
      "profile.fiveElementBadges",
      "profile.tenGodSummary",
      "profile.majorSinsal",
      "profile.gwiinGilshin",
      "profile.sinsal",
      "profile.gwiin",
      "pillarGridRows",
      "element-bg--",
      "천간",
      "지지",
      "지장간",
      "십이운성",
      "십이신살",
      "신살 요약",
      "귀인/길신 요약",
      "사주 원국 요약",
      "MBTI 입력 요약",
      "리포트 본문",
      "chapter.titleKo",
      "chapter.headline",
      "chapter.hitReadingLines",
      "chapter.body",
      "chapter.solutionLines",
      "renderV2IntegratedChapterProse",
      "<details",
      "section.titleKo",
      "section.oneLine",
      "section.body",
      "분석 근거 보기",
      "사주 근거",
      "MBTI 참고",
      "최종 조언",
      "isCompatibilityReportDraft",
      "renderGeneratedCompatibilityState",
      "사주×MBTI 궁합 리포트 v1.0",
      "두 사람 만세력 비교",
      "관계 유형",
      "총점",
      "draft.scoreSummary.breakdown",
      "draft.chartComparison.personA",
      "draft.chartComparison.personB",
      "draft.finalAdvice.map",
      "draft.safetyNotes.map",
      "리포트 준비 완료",
      "결제가 완료되었고 리포트가 생성되었습니다.",
      "상세 리포트 생성 대기 중입니다.",
      "리포트를 찾을 수 없습니다.",
      "결제가 완료된 리포트만 조회할 수 있습니다.",
      "리포트 정보가 올바르지 않습니다.",
      "저장된 리포트 형식을 확인할 수 없습니다.",
      "getPaidReportResult",
    ];
    const blockedMarkers = [
      "callOpenAIReportWriter",
      "generateComprehensiveReportDraft",
      "saveComprehensiveReportDraftSnapshot",
      "confirmTossPayment",
      "payment" + "Key",
      "provider" + "PaymentId",
      "provider" + "_payment" + "_id",
      "input" + "Snapshot",
      "input" + "_snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "OPENAI" + "_API" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
      "바" + "넘",
      "Bar" + "num",
      "만세력 요약",
      "이런 장면 있지 않나요?",
      "이렇게 쓰면 좋습니다",
      "renderV2KeyPhrases",
      "branch.animalKo",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
