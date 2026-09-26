import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { CompatibilityReportView } from "../../../../src/app/reports/[reportId]/CompatibilityReportView";
import { generateCompatibilityProductDraft } from "../../../../src/lib/report-generation/compatibilityGenerationHandler";
import type { CompatibilityReportDraft } from "../../../../src/lib/report-generation/compatibilityReportDraftTypes";
import { validateProductPublication } from "../../../../src/lib/report-generation/productPublishGate";
import type { CompatibilityGenerationInput } from "../../../../src/lib/report-generation/reportInputAdapter";
import type { CompatibilityPersonChartSummary } from "../../../../src/lib/report-knowledge/compatibilityTypes";

const viewSource = readFileSync(
  join(process.cwd(), "src/app/reports/[reportId]/CompatibilityReportView.tsx"),
  "utf8",
);

function createChart(
  role: "personA" | "personB",
  displayName: string,
  mbti: CompatibilityPersonChartSummary["mbti"],
  dayMaster: string,
  dayPillar: string,
): CompatibilityPersonChartSummary {
  return {
    role,
    displayName,
    mbti,
    birthTimeConfidence: "known",
    pillars: {
      year: role === "personA" ? "己卯" : "庚辰",
      month: role === "personA" ? "辛未" : "壬午",
      day: dayPillar,
      hour: role === "personA" ? "戊辰" : "癸酉",
    },
    dayMaster,
    dayPillar,
    featureIds: [],
    featureLabels: ["천을귀인"],
    diagnosticFeatureLabels: [],
    sajuFacts: {} as CompatibilityPersonChartSummary["sajuFacts"],
  };
}

function createDraft(): CompatibilityReportDraft {
  return {
    version: "compatibility_v1_draft",
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: "love",
    personALabel: "덕민",
    personBLabel: "소담",
    openingTitle: "끌림은 빠르고 안정은 규칙에서 오는 궁합",
    openingSummary:
      "두 사람은 끌림이 있지만 속도와 확인 방식이 달라 조율 장치가 필요합니다.",
    coreLine:
      "끌림은 있지만, 속도와 확정 타이밍을 맞추지 않으면 금방 피곤해지는 조합입니다.",
    scoreSummary: {
      totalScore: 69,
      scoreLabel: "조율형 궁합",
      scoreCaution: "안 맞는 점수가 아니라 조율 장치가 필요하다는 뜻입니다.",
      breakdown: {
        attraction: 72,
        communication: 66,
        lifestyleRhythm: 68,
        conflictRecovery: 64,
        longTermStability: 70,
        growthComplement: 74,
      },
    },
    chartComparison: {
      personA: createChart("personA", "덕민", "ENTJ", "甲", "甲申"),
      personB: createChart("personB", "소담", "INTP", "丁", "丁丑"),
    },
    keyCompatibilityPoints: {
      attractionPoints: ["빠른 결론과 깊은 검토가 서로를 자극합니다."],
      strengthPoints: ["역할이 나뉘면 실행과 검토가 모두 살아납니다."],
      frictionPoints: ["결론 속도와 감정 확인 방식이 자주 부딪힙니다."],
      relationshipRules: ["결론 시간과 검토 시간을 분리해야 합니다."],
    },
    relationshipAnalysis: {
      connectionSummary:
        "두 사람은 끌림보다 운영 방식에서 진짜 궁합이 갈립니다.",
      firstImpression:
        "처음에는 A의 추진력과 B의 깊은 검토가 서로에게 매력으로 보입니다.",
      stayingPower:
        "오래 가려면 감정 확인과 실행 결정을 한 자리에서 처리하지 않아야 합니다.",
      frictionPoints: [
        "A는 빠르게 정리하려 하고 B는 조건을 더 확인하려 합니다.",
      ],
      categoryReading:
        "연애 관계에서는 끌림보다 대화 속도와 갈등 회복 방식이 핵심입니다.",
      aToBFatigue:
        "A는 B의 검토가 길어질수록 결정이 미뤄진다고 느낄 수 있습니다.",
      bToAFatigue:
        "B는 A의 결론 속도가 빠를수록 감정과 전제를 건너뛴다고 느낄 수 있습니다.",
      communicationRecovery:
        "갈등이 생기면 결론을 바로 내기보다 감정 확인과 실행 결정을 나눠야 합니다.",
      roleMoneyLifeRhythm:
        "돈과 일정은 각자 관리하되 공유 기준만 먼저 맞추는 쪽이 덜 지칩니다.",
      categorySpecificAdvice: ["답을 재촉하기보다 다시 말할 시간을 정하세요."],
      timingCautions: ["약속 변경이 생기면 즉시 결론보다 확인 시간을 먼저 둡니다."],
      repairStrategy: ["결론, 검토, 실행을 단계로 나누세요."],
      riskManagement: ["속도 차이를 성의 부족으로 해석하지 않는 규칙이 필요합니다."],
    },
    chapters: [
      {
        id: "communication",
        title: "대화 속도",
        headline: "대화 회복이 핵심입니다.",
        body: "대화 속도 차이가 반복됩니다.",
        directHitScenes: ["결론과 검토가 엇갈리는 장면"],
        practicalAdvice: ["검토 시간을 먼저 정하세요."],
      },
    ],
    finalAdvice: ["결론 시간과 검토 시간을 분리하세요."],
    safetyNotes: ["관계의 성공이나 실패를 단정하지 않습니다."],
  };
}

const compatibilityFixturePeople = [
  { name: "가람", birthDate: "1999-07-31", birthTime: "07:30", gender: "MALE", mbtiType: "ENTJ" },
  { name: "나래", birthDate: "1996-12-06", birthTime: "14:15", gender: "FEMALE", mbtiType: "INTP" },
  { name: "다온", birthDate: "1980-05-18", birthTime: "10:15", gender: "MALE", mbtiType: "ISFJ" },
  { name: "서우", birthDate: "2001-03-02", birthTime: "16:20", gender: "FEMALE", mbtiType: "ENFP" },
  { name: "한결", birthDate: "1990-01-10", birthTime: "09:20", gender: "MALE", mbtiType: "" },
  { name: "윤슬", birthDate: "1987-08-20", birthTime: "11:10", gender: "FEMALE", mbtiType: "ESTP" },
] as const;

const compatibilityRegressionFixtures = [
  { name: "love-entj-intp", relationshipType: "love", personA: 0, personB: 1 },
  { name: "marriage-isfj-enfp", relationshipType: "marriage", personA: 2, personB: 3 },
  { name: "parent-child-mbti-missing", relationshipType: "parentChild", personA: 4, personB: 3 },
  { name: "business-partner-estp-entj", relationshipType: "businessPartner", personA: 5, personB: 0 },
  { name: "friendship-intp-isfj", relationshipType: "friendship", personA: 1, personB: 2 },
] as const;

function compatibilityGenerationPerson(
  index: number,
): CompatibilityGenerationInput["personA"] {
  return {
    ...compatibilityFixturePeople[index],
    birthTimeUnknown: false,
    approximateBirthTimeSlot: "",
    calendarType: "solar",
    timezone: "Asia/Seoul",
  };
}

describe("CompatibilityReportView", () => {
  it("renders launch relationshipAnalysis sections and the shared table block", () => {
    const html = renderToStaticMarkup(
      <CompatibilityReportView draft={createDraft()} reportId="compat_result" />,
    );

    expect(html).toContain("궁합 리포트");
    expect(html).not.toContain("직업 리포트");
    expect(html).toContain("두 사람 기초표");
    expect(html).toContain("가운데의 작은 연결 지점");
    expect(html).toContain("한 줄 판정");
    expect(html).toContain("두 사람 연결 요약");
    expect(html).toContain("궁합 핵심 표");
    expect(html).toContain("전체 톤");
    expect(html).toContain("명리 연결");
    expect(html).toContain("MBTI 연결");
    expect(html).toContain("일간·일지");
    expect(html).not.toContain("오행 균형");
    expect(html).not.toContain("십성 관계");
    expect(html.split(createDraft().relationshipAnalysis.roleMoneyLifeRhythm)).toHaveLength(2);
    expect(html.split(createDraft().relationshipAnalysis.categoryReading)).toHaveLength(2);
    expect(html).toContain("첫 인상과 끌림");
    expect(html).toContain("오래 가는 힘");
    expect(html).toContain("자주 부딪히는 지점");
    expect(html).toContain("A가 B에게 주는 피로");
    expect(html).toContain("B가 A에게 주는 피로");
    expect(html).toContain("관계 카테고리별 해석");
    expect(html).toContain("대화와 갈등 회복");
    expect(html).toContain("돈/역할/생활 리듬");
    expect(html).toContain("관계별 전용 조언");
    expect(html).toContain("조심할 타이밍");
    expect(html).toContain("유지 전략");
    expect(html).toContain("리스크 관리");
    expect(html).toContain("덕민님 × 소담님");
    expect(html).not.toContain("relationshipAnalysis");
    expect(html).not.toContain("directFindings");
    expect(html).not.toContain("draft");
  });

  it.each(compatibilityRegressionFixtures)(
    "$name generates, publishes, and SSR renders without a numeric or ranked compatibility score",
    async (fixture) => {
      const input: CompatibilityGenerationInput = {
        kind: "compatibility",
        productKey: "saju_mbti_compatibility",
        productSlug: "compatibility",
        relationshipType: fixture.relationshipType,
        personA: compatibilityGenerationPerson(fixture.personA),
        personB: compatibilityGenerationPerson(fixture.personB),
        productOptions: {},
      };
      const result = await generateCompatibilityProductDraft(input);

      expect(result.ok, JSON.stringify(result)).toBe(true);
      if (!result.ok) {
        throw new Error(result.error.message);
      }

      expect(
        validateProductPublication(
          "saju_mbti_compatibility",
          result.draft,
          result.evidencePacket,
        ),
      ).toEqual({ ok: true, errors: [] });

      const html = renderToStaticMarkup(
        <CompatibilityReportView
          draft={result.draft}
          evidencePacket={result.evidencePacket}
          reportId={`compatibility-${fixture.name}`}
        />,
      );
      const text = html.replace(/<[^>]+>/gu, " ").replace(/\s+/gu, " ");

      expect(text).not.toMatch(/(?<!\d)(?:100|[1-9]?\d)\s*점/gu);
      expect(text).not.toMatch(/[SABCDF][+-]?\s*등급/giu);
      expect(text).not.toMatch(/[★☆]/gu);
      expect(text).not.toContain("관계 온도");
      expect(text).toContain("궁합 한눈에 보기");
      expect(text).toContain("맞는 부분과 조정할 부분이 함께 있는 궁합");
      expect(text).toContain("가장 잘 맞는 부분");
      expect(text).toContain("가장 부딪히는 부분");
      expect(text).toContain("유지하는 핵심 조건");
      expect(text).toContain("A가 B에게 주는 피로");
      expect(text).toContain("B가 A에게 주는 피로");
      expect(text).toContain("관계 카테고리별 해석");
    },
  );

  it("keeps legacy score fields readable but never uses them in customer copy", () => {
    const legacyDraft = {
      ...createDraft(),
      coreLine: "67점은 파트너십의 성공을 단정하지 않습니다.",
      scoreSummary: {
        ...createDraft().scoreSummary,
        totalScore: 67,
        scoreLabel: "S등급",
        scoreCaution: "67점 · ★★★★★",
      },
    };
    const html = renderToStaticMarkup(
      <CompatibilityReportView draft={legacyDraft} />,
    );

    expect(html).not.toContain("67점");
    expect(html).not.toContain("S등급");
    expect(html).not.toContain("★★★★★");
    expect(html).not.toContain("관계 온도");
    expect(html).toContain("궁합 한눈에 보기");
    expect(html).toContain("파트너십의 성공을 단정하지 않습니다.");
  });

  it("translates raw saju relation labels before rendering user-facing text", () => {
    const draft = createDraft();
    const rawDraft = {
      ...draft,
      relationshipAnalysis: {
        ...draft.relationshipAnalysis,
        riskManagement: [
          "申子辰 삼합 수 흐름 · 亥卯未 삼합 목 흐름",
          "丑未 충",
          "子未 해 · 申亥 해",
        ],
      },
    };
    const html = renderToStaticMarkup(<CompatibilityReportView draft={rawDraft} />);

    expect(html).not.toContain("申子辰 삼합 수 흐름");
    expect(html).not.toContain("亥卯未 삼합 목 흐름");
    expect(html).not.toContain("丑未 충");
    expect(html).not.toContain("子未 해");
    expect(html).not.toContain("申亥 해");
    expect(html).toContain("대화 흐름이 강해지는 신호");
    expect(html).toContain("생활 기준, 가족관, 역할 분담");
    expect(html).toContain("말하지 않은 불편감과 피로가 누적");
  });

  it("keeps seven canonical relationship labels available in source", () => {
    expect(viewSource).toContain("love: \"끌림, 감정 표현");
    expect(viewSource).toContain("marriage: \"생활 리듬");
    expect(viewSource).toContain("parentChild: \"기대");
    expect(viewSource).toContain("coworker: \"업무 속도");
    expect(viewSource).toContain("managerReport: \"지시와 평가");
    expect(viewSource).toContain("businessPartner: \"돈, 리스크");
    expect(viewSource).toContain("friendship: \"거리감");
  });

  it("renders legacy drafts through relationshipAnalysis fallback", () => {
    const draft = createDraft();
    const legacyDraft = {
      ...draft,
      relationshipAnalysis: undefined,
    } as unknown as CompatibilityReportDraft;
    const html = renderToStaticMarkup(
      <CompatibilityReportView draft={legacyDraft} />,
    );

    expect(html).toContain("A가 B에게 주는 피로");
    expect(html).toContain("B가 A에게 주는 피로");
    expect(html).toContain("덕민님이 소담님에게 주는 부담을 구분할 정보가");
    expect(html).toContain("소담님이 덕민님에게 주는 부담을 구분할 정보가");
  });

  it("does not add forbidden fixed-outcome copy", () => {
    expect(viewSource).not.toContain("무조건 헤어짐");
    expect(viewSource).not.toContain("반드시 결혼");
    expect(viewSource).not.toContain("파국");
    expect(viewSource).not.toContain("사업 성공 보장");
    expect(viewSource).not.toContain("재회 확률");
  });
});
