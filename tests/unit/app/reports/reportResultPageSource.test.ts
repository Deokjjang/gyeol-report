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
      "ManseRyeokCommonTable",
      "buildManseRyeokCommonTableData",
      "normalizePillarGridForManseRyeokTable",
      "MbtiCommonProfileTable",
      "buildMbtiCommonProfileTableData",
      "getMbtiSourceByType",
      "defaultOpen={true}",
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
      "element-bg--",
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
      "LoveMarriageChildReportView",
      "LoveMarriageChildReportDraft",
      "isLoveMarriageChildReportDraft",
      "renderGeneratedLoveMarriageChildState",
      "love_marriage_child",
      "draft.evidencePacket",
      "LoveMarriageChildReportManseRyeokTable",
      "LoveMarriageChildReportMbtiProfileTable",
      "evidencePacket === undefined ? undefined",
      "MajorFortuneReportView",
      "MajorFortuneReportDraft",
      "isMajorFortuneReportDraft",
      "renderGeneratedMajorFortuneState",
      "major_fortune",
      "AnnualFortuneReportView",
      "AnnualFortuneReportDraft",
      "isAnnualFortuneReportDraft",
      "renderGeneratedAnnualFortuneState",
      "annual_fortune",
      "renderGeneratedCompatibilityState",
      "loadProductPreviewPageState",
      'snapshotKind !== "product_preview"',
      'productPreview.productType !== "saju_mbti_compatibility"',
      "renderProductPreviewCompatibilityState",
      "상품 미리보기 준비 중입니다.",
      "createReportPersistenceRuntime",
      "CompatibilityTable",
      "buildCompatibilityTopTableData",
      "getCompatibilityRelationshipAnalysis",
      "relationshipAnalysis",
      "connectionSummary",
      "firstImpression",
      "stayingPower",
      "frictionPoints",
      "aToBFatigue",
      "bToAFatigue",
      "communicationRecovery",
      "roleMoneyLifeRhythm",
      "categorySpecificAdvice",
      "timingCautions",
      "repairStrategy",
      "riskManagement",
      "궁합 리포트",
      "두 사람 기초표",
      "상단 궁합 기초표",
      "한 줄 판정",
      "두 사람 연결 요약",
      "첫 인상과 끌림",
      "오래 가는 힘",
      "자주 부딪히는 지점",
      "A가 B에게 주는 피로",
      "B가 A에게 주는 피로",
      "관계 카테고리별 해석",
      "대화와 갈등 회복",
      "돈/역할/생활 리듬",
      "관계별 전용 조언",
      "조심할 타이밍",
      "유지 전략",
      "리스크 관리",
      "상담이나 예언이 아니라",
      "관계 카테고리",
      "normalizeCompatibilityRelationCategory",
      "draft.personALabel",
      "draft.personBLabel",
      "sanitizeCompatibilityVisibleText",
      "getCompatibilityRelationshipTypeLabel",
      "getCompatibilityScoreCaution",
      "formatCompatibilitySafetyNote",
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

    expect(pageSource.indexOf("loadProductPreviewPageState(reportId)")).toBeLessThan(
      pageSource.indexOf("getPaidReportResult({"),
    );
    expect(pageSource.indexOf("isCompatibilityReportDraft(unknownDraft)")).toBeLessThan(
      pageSource.indexOf("isLoveMarriageChildReportDraft(unknownDraft)"),
    );
    expect(pageSource.indexOf("isLoveMarriageChildReportDraft(unknownDraft)")).toBeLessThan(
      pageSource.indexOf("isMajorFortuneReportDraft(unknownDraft)"),
    );
    expect(pageSource.indexOf("isMajorFortuneReportDraft(unknownDraft)")).toBeLessThan(
      pageSource.indexOf("isAnnualFortuneReportDraft(unknownDraft)"),
    );

    expect(compatibilityViewSource).not.toContain("preview snapshot");
    expect(source).not.toContain("사주×MBTI 종합 리포트 v1.0");
    expect(source).not.toContain("사주×MBTI 궁합 리포트 v1.0");
    expect(compatibilityViewSource).not.toContain(">상태<");
    expect(compatibilityViewSource).not.toContain("mutual element complement");
    expect(compatibilityViewSource).not.toContain("출생시간 입력");
    expect(compatibilityViewSource).not.toContain("찔리는 장면");
    expect(compatibilityViewSource).not.toContain("{note.layer}</");
    expect(compatibilityViewSource).not.toContain("두 사람 만세력 비교");
    expect(compatibilityViewSource).not.toContain("renderCompatibilityChartCard");
    expect(compatibilityViewSource).not.toContain("filterPublicChartLabels");
    expect(compatibilityViewSource.indexOf("<CompatibilityTable")).toBeGreaterThan(
      compatibilityViewSource.indexOf("</dl>"),
    );
    expect(compatibilityViewSource.indexOf("<CompatibilityTable")).toBeLessThan(
      compatibilityViewSource.indexOf("한 줄 판정"),
    );
  });
});
