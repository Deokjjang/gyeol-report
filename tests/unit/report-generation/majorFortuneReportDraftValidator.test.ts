import { describe, expect, it } from "vitest";

import type { MajorFortuneReportDraft } from "../../../src/lib/report-generation/majorFortuneReportDraftTypes";
import {
  sanitizeMajorFortuneVisibleText,
  summarizeMajorFortuneDraftQuality,
  validateMajorFortuneReportDraft,
} from "../../../src/lib/report-generation/majorFortuneReportDraftValidator";

export function createValidMajorFortuneDraft(
  overrides: Partial<MajorFortuneReportDraft> = {},
): MajorFortuneReportDraft {
  return {
    version: "v1",
    productType: "major_fortune",
    productVersion: "v1",
    personLabel: "덕민",
    openingTitle: "현재 대운 甲戌 흐름",
    openingSummary:
      "이 대운은 10년 동안 역할과 책임 기준을 다시 잡는 배경으로 체감될 수 있습니다.",
    coreLine:
      "甲戌 대운은 일과 현실 책임을 동시에 다루며 장기 방향을 다시 세우는 흐름입니다.",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      translationNote:
        "개발·서비스 기획의 프로젝트, 문서화, 운영 책임 장면으로 번역했습니다.",
    },
    cycleSummary: {
      ganji: "甲戌",
      displayTitle: "현재 대운 甲戌",
      cycleIndexLabel: "3번째 대운",
      currentPositionLabel: "2026년 기준 4년차",
      ageRangeLabel: "24세~33세",
      yearRangeLabel: "2023년~2032년",
      stemLabel: "甲 · 양목",
      branchLabel: "戌 · 양토",
      elementLabel: "목·토의 대운",
      tenGodLabel: "비견의 대운",
      basisLabel: "사전 계산된 대운표 기준",
    },
    calculationBasis: {
      basisType: "precomputed_major_fortune_table",
      displayLabel: "사전 계산된 대운표 기준",
      explanation:
        "이 대운 구간은 입력된 만세력의 대운표를 기준으로 잡았습니다.",
      ageBasisLabel: "표기 나이는 대운표 기준 나이입니다.",
      note: "현재 리포트에서는 2026년을 기준으로 현재 위치한 대운을 읽습니다.",
    },
    flowIndexSummary: {
      flowIndex: 72,
      flowTypeLabel: "책임·구조 재편형",
      flowIndexCaution:
        "이 지표는 좋고 나쁨이 아니라 10년 동안 반복될 체감 강도를 보여 줍니다.",
    },
    bigThemes: [
      {
        title: "기준을 직접 세우는 10년",
        metaphor: "일이 흙처럼 쌓이기 전에 길을 먼저 내는 흐름",
        body: "비견은 내 기준을 세우는 힘이고, 토는 현실 책임을 쌓이게 만드는 배경입니다.",
        likelyScenes: [
          "프로젝트 기준을 직접 문서화하는 장면",
          "맡을 일과 맡지 않을 일을 나누는 장면",
        ],
        strategy: "초반부터 역할 경계를 문서로 남기세요.",
      },
      {
        title: "현실 숫자를 정리하는 10년",
        metaphor: "돈과 계약의 흙더미를 월 단위로 나누는 흐름",
        body: "토 과다는 급여, 생활비, 계약처럼 관리할 항목이 늘어나는 구조로 체감될 수 있습니다.",
        likelyScenes: [
          "고정지출을 월초에 나누는 장면",
          "계약과 정산 기준을 다시 맞추는 장면",
        ],
        strategy: "반복 비용과 책임 비용을 먼저 분리하세요.",
      },
      {
        title: "관계의 거리와 역할을 재배치하는 10년",
        metaphor: "사람과 약속이 실제 역할로 묶이는 흐름",
        body: "육합과 충은 사람, 일정, 역할이 묶였다가 다시 조정되는 장면으로 나타날 수 있습니다.",
        likelyScenes: [
          "가족 일정과 업무 일정이 겹치는 장면",
          "상사, 동료, 친구와 역할 경계를 다시 맞추는 장면",
        ],
        strategy: "관계 안에서도 감정보다 역할과 시간을 먼저 확인하세요.",
      },
    ],
    decadeCards: [
      {
        label: "일·성과",
        index: 78,
        headline: "프로젝트 기준을 잡는 역할이 반복됩니다.",
        body: "보고, 문서화, 일정 조율처럼 결과를 보이게 만드는 일이 중요해집니다.",
      },
      {
        label: "돈·현실",
        index: 70,
        headline: "고정지출과 장기 관리 기준이 중요해집니다.",
        body: "급여, 생활비, 계약, 정산처럼 현실 숫자를 직접 챙기는 장면이 늘 수 있습니다.",
      },
      {
        label: "인간관계",
        index: 64,
        headline: "연락과 역할 경계를 다시 맞춥니다.",
        body: "동료, 친구, 메시지, 거리감의 기준을 짧고 분명하게 정리해야 합니다.",
      },
      {
        label: "연애·가족",
        index: 62,
        headline: "가족과 가까운 관계의 역할이 재배치됩니다.",
        body: "부모, 집안 일정, 약속, 생활 동선에서 맡아야 할 몫을 조율하게 됩니다.",
      },
      {
        label: "학업·자격증",
        index: 68,
        headline: "업무 공부와 포트폴리오를 장기 자산으로 만듭니다.",
        body: "자격증, 실무 정리, 발표 자료처럼 남는 결과물을 쌓는 방식이 좋습니다.",
      },
      {
        label: "몸·생활 리듬",
        index: 59,
        headline: "회복 루틴을 구조화해야 합니다.",
        body: "수면, 식사, 피로, 컨디션을 일정처럼 관리해야 장기 압박을 버틸 수 있습니다.",
      },
    ],
    keySignals: [
      {
        type: "opportunity",
        title: "역할 재정리 기회",
        body: "결과물을 보이게 만들고 기준을 세우는 방식으로 커리어 기반을 만들 수 있습니다.",
        evidenceLabel: "비견 대운",
      },
      {
        type: "difficulty",
        title: "현실 책임 부담",
        body: "토 과다가 자극되어 돈, 계약, 관리 책임이 누적될 수 있습니다.",
        evidenceLabel: "토 과다 자극",
      },
      {
        type: "transition",
        title: "이전 대운과 다른 배경",
        body: "이전 금·수 배경에서 목·토 배경으로 바뀌며 선택 기준이 달라집니다.",
        evidenceLabel: "previous_to_current",
      },
    ],
    majorStructure: {
      ganjiExplanation:
        "甲戌은 목과 토가 함께 들어와 방향성과 현실 기준을 동시에 건드립니다.",
      tenGodExplanation:
        "비견: 자기 기준, 동등함, 경쟁과 공감이 장기 배경으로 반복됩니다.",
      elementEffectExplanation:
        "목은 방향을 세우고 토는 현실 책임을 무겁게 만들 수 있습니다.",
      branchInteractionExplanation:
        "卯戌 육합: 사람과 일정이 묶이며 실제 움직임이 생기기 쉽습니다.",
      transitionExplanation:
        "癸酉 대운에서 甲戌 대운으로 넘어오며 생각보다 실행 기준이 중요해졌습니다.",
    },
    cycleChapters: Array.from({ length: 6 }, (_, index) => ({
      title: `대운 해석 ${index + 1}`,
      headline: "반복되는 장기 장면을 구체적으로 봅니다.",
      body:
        "직장, 가족, 돈 중 한 영역에서 내가 정리해야 하는 역할이 반복될 가능성이 큽니다.",
      likelyScenes: [
        "프로젝트 기준을 문서로 남겨야 하는 장면",
        "계약과 생활비 기준을 다시 맞추는 장면",
      ],
      practicalAdvice: [
        "역할과 마감 기준을 말보다 문서로 남기세요.",
        "돈과 일정은 월 단위로 먼저 나누어 보세요.",
      ],
    })),
    phaseTimeline: [
      {
        phase: "early",
        label: "초반 1~3년",
        headline: "새 기준을 세우는 구간",
        body: "이전 대운과 달라진 역할을 파악하는 시간이 됩니다.",
        advice: "큰 결론보다 반복되는 압박의 원인을 먼저 기록하세요.",
      },
      {
        phase: "middle",
        label: "중반 4~7년",
        headline: "책임이 구체화되는 구간",
        body: "프로젝트, 돈, 관계의 기준이 실제 선택으로 굳어집니다.",
        advice: "맡을 일과 맡지 않을 일을 구분하세요.",
      },
      {
        phase: "late",
        label: "후반 8~10년",
        headline: "다음 대운으로 넘어갈 준비",
        body: "쌓아 둔 구조가 다음 선택의 기반이 됩니다.",
        advice: "성과와 비용을 정리해 다음 방향을 준비하세요.",
      },
    ],
    strongYears: [
      {
        year: 2024,
        ganji: "甲辰",
        headline: "대운 천간이 반복되는 해",
        body: "자기 기준과 현실 책임이 동시에 강해질 수 있습니다.",
        advice: "결정을 미루기보다 기준을 문서로 정리하세요.",
      },
      {
        year: 2025,
        ganji: "乙巳",
        headline: "목과 화가 이어지는 해",
        body: "대운 오행의 목 기운이 이어지고 화가 결과물을 밖으로 꺼내는 힘을 보탭니다.",
        advice: "작은 결과물부터 공개 가능한 형태로 남기세요.",
      },
      {
        year: 2026,
        ganji: "丙午",
        headline: "표현과 실행이 강해지는 해",
        body: "대운 지지와 원국 지지 작용 위에 표현과 실행의 오행이 강해질 수 있습니다.",
        advice: "마감 전 중간 점검 기준을 두세요.",
      },
    ],
    cycleYearTimeline: Array.from({ length: 10 }, (_, index) => {
      const year = 2023 + index;
      const yearIndexInCycle = index + 1;
      const phase =
        yearIndexInCycle <= 3
          ? "early"
          : yearIndexInCycle <= 7
            ? "middle"
            : "late";

      return {
        year,
        ganji: ["癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子"][index] ?? "癸卯",
        yearIndexInCycle,
        phase,
        headline: `${yearIndexInCycle}년차 흐름`,
        relationToMajorCycle: "대운 배경을 통과하며 장기 테마를 확인하는 해",
        plain: `${year}년은 甲戌 대운의 ${yearIndexInCycle}년차로 큰 흐름 안에서 역할을 조정합니다.`,
      };
    }),
    finalAdvice: [
      {
        label: "일·성과",
        body: "프로젝트·보고·문서화는 중간 점검 기준을 먼저 잡아 두세요.",
      },
      {
        label: "돈·현실",
        body: "급여·생활비·정산·계약은 월초에 분리해 두세요.",
      },
      {
        label: "인간관계",
        body: "상사·동료·친구와의 연락은 요청 사항을 짧게 정리해 전달하세요.",
      },
      {
        label: "연애·가족",
        body: "연인·가족·부모와의 약속은 시간과 역할을 먼저 맞춰 두세요.",
      },
      {
        label: "학업·자격증",
        body: "자격증·업무 공부·포트폴리오는 결과물 단위로 쪼개서 남기세요.",
      },
      {
        label: "몸·생활 리듬",
        body: "수면·식사·회복 시간을 일정처럼 고정하세요.",
      },
    ],
    safetyNotes: [
      "이 리포트는 인생의 성공이나 실패를 단정하지 않습니다.",
      "대운은 장기 배경이며 실제 선택과 환경에 따라 체감이 달라질 수 있습니다.",
    ],
    ...overrides,
  };
}

describe("majorFortuneReportDraftValidator", () => {
  it("accepts a valid major fortune draft", () => {
    const result = validateMajorFortuneReportDraft(createValidMajorFortuneDraft());

    expect(result.ok).toBe(true);
    expect(result.value?.productType).toBe("major_fortune");
    expect(result.value?.phaseTimeline).toHaveLength(3);
    expect(result.value?.finalAdvice).toHaveLength(6);
  });

  it("rejects unsupported productType", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      productType: "annual_fortune",
    });

    expect(result.ok).toBe(false);
  });

  it("rejects missing phaseTimeline", () => {
    const draft = {
      ...createValidMajorFortuneDraft(),
    } as Partial<MajorFortuneReportDraft>;
    delete draft.phaseTimeline;

    expect(validateMajorFortuneReportDraft(draft).ok).toBe(false);
  });

  it("rejects phaseTimeline not length 3", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: createValidMajorFortuneDraft().phaseTimeline.slice(0, 2),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  });

  it("rejects finalAdvice not length 6", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      finalAdvice: createValidMajorFortuneDraft().finalAdvice.slice(0, 5),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_FINAL_ADVICE_INVALID");
  });

  it("rejects missing big themes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      bigThemes: createValidMajorFortuneDraft().bigThemes.slice(0, 2),
    });

    expect(result.errors).toContain("MAJOR_FORTUNE_BIG_THEMES_INVALID");
  });

  it("requires exactly ten cycle timeline years", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleYearTimeline: createValidMajorFortuneDraft().cycleYearTimeline.slice(0, 9),
    });

    expect(result.errors).toContain(
      "MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_INVALID",
    );
  });

  it("rejects missing or shifted cycle timeline years", () => {
    const timeline = createValidMajorFortuneDraft().cycleYearTimeline.map(
      (year, index) => (index === 4 ? { ...year, year: 2099 } : year),
    );
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleYearTimeline: timeline,
    });

    expect(result.errors).toContain(
      "MAJOR_FORTUNE_CYCLE_YEAR_TIMELINE_MISSING_YEARS",
    );
  });

  it("clamps decade card indexes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      decadeCards: createValidMajorFortuneDraft().decadeCards.map((card) => ({
        ...card,
        index: card.label === "일·성과" ? 130 : card.index,
      })),
    });

    expect(result.ok).toBe(true);
    expect(result.value?.decadeCards[0]?.index).toBe(100);
  });

  it("sanitizes hard claims and internal artifacts", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "반드시 성공합니다. evidence debug schema fixture precomputed 진단용",
    });

    expect(result.ok).toBe(true);
    expect(result.value?.openingSummary).not.toMatch(
      /반드시|성공합니다|evidence|debug|schema|fixture|precomputed|진단용/u,
    );
  });

  it("sanitizes repeated terms and branch parentheses", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      majorStructure: {
        ...createValidMajorFortuneDraft().majorStructure,
        tenGodExplanation: "편관(편관, 압박과 책임)과 甲일간이 만납니다.",
        branchInteractionExplanation:
          "卯戌 육합(卯戌 육합, 실제 약속과 움직임이 묶이는 흐름), 辰戌 충(충, 부딪혀 방향이 바뀌는 구조)",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.majorStructure.tenGodExplanation).toContain(
      "편관: 압박과 책임",
    );
    expect(result.value?.majorStructure.tenGodExplanation).toContain(
      "甲(갑목) 일간",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).toContain(
      "卯戌 육합: 실제 약속과 움직임이 묶이는 흐름",
    );
    expect(result.value?.majorStructure.branchInteractionExplanation).toContain(
      "辰戌 충: 부딪혀 방향이 바뀌는 구조",
    );
  });

  it("maps precomputed basis to user-facing Korean", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      cycleSummary: {
        ...createValidMajorFortuneDraft().cycleSummary,
        basisLabel: "fixture_precomputed",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.cycleSummary.basisLabel).toBe(
      "사전 계산된 대운표 기준",
    );
    expect(result.value?.calculationBasis.displayLabel).toBe(
      "사전 계산된 대운표 기준",
    );
  });

  it("summarizes clean quality counters", () => {
    const result = validateMajorFortuneReportDraft(createValidMajorFortuneDraft());

    expect(result.ok).toBe(true);
    expect(summarizeMajorFortuneDraftQuality(result.value!)).toEqual({
      hardClaimWarnings: 0,
      internalArtifactWarnings: 0,
      repeatedTerminologyWarnings: 0,
      annualToneWarnings: 0,
      decadeToneWarnings: 0,
      strongYearReasonWarnings: 0,
      cycleYearTimelineCount: 10,
      missingCycleYearWarnings: 0,
      cycleIndexLeakWarnings: 0,
      technicalTermWithoutExplanationWarnings: 0,
      smallEventOverfocusWarnings: 0,
    });
  });

  it("warns when a major fortune draft overuses annual tone", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "올해는 2026년에는 이번 해 흐름을 봅니다. 올해 1월과 2월의 월별 흐름처럼 보입니다.",
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).annualToneWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_ANNUAL_TONE_WARNING"),
    )).toBe(true);
  });

  it("accepts decade tone markers for a major fortune draft", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      openingSummary:
        "이 대운은 이 10년 동안 반복되는 구조를 봅니다. 이 구간은 초반, 중반, 후반으로 나뉘며 이전 대운과 다음 대운 사이의 연도 구간도 함께 봅니다.",
    });

    expect(result.ok).toBe(true);
    expect(summarizeMajorFortuneDraftQuality(result.value!).decadeToneWarnings).toBe(0);
  });

  it("rejects missing early/middle/late phase order and more than three phases", () => {
    const missingEarly = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: [
        createValidMajorFortuneDraft().phaseTimeline[1],
        createValidMajorFortuneDraft().phaseTimeline[2],
        createValidMajorFortuneDraft().phaseTimeline[0],
      ],
    });
    const tooMany = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      phaseTimeline: [
        ...createValidMajorFortuneDraft().phaseTimeline,
        createValidMajorFortuneDraft().phaseTimeline[2],
      ],
    });

    expect(missingEarly.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_ORDER_INVALID");
    expect(tooMany.errors).toContain("MAJOR_FORTUNE_PHASE_TIMELINE_INVALID");
  });

  it("warns when strong years do not explain why the year is strong", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      strongYears: createValidMajorFortuneDraft().strongYears.map((year) => ({
        ...year,
        headline: "강한 해",
        body: "중요하게 체감될 수 있습니다.",
        advice: "기록하세요.",
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).strongYearReasonWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_STRONG_YEAR_REASON_WARNING"),
    )).toBe(true);
  });

  it("warns when cycle index leaks into flow-like indexes", () => {
    const result = validateMajorFortuneReportDraft({
      ...createValidMajorFortuneDraft(),
      flowIndexSummary: {
        ...createValidMajorFortuneDraft().flowIndexSummary,
        flowIndex: 3,
      },
      decadeCards: createValidMajorFortuneDraft().decadeCards.map((card) => ({
        ...card,
        index: 3,
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      summarizeMajorFortuneDraftQuality(result.value!).cycleIndexLeakWarnings,
    ).toBeGreaterThan(0);
    expect(result.warnings.some((warning) =>
      warning.startsWith("MAJOR_FORTUNE_CYCLE_INDEX_LEAK_WARNING"),
    )).toBe(true);
  });

  it("exposes visible sanitizer directly", () => {
    expect(sanitizeMajorFortuneVisibleText("식신(식신, 결과물·표현·생산성)")).toBe(
      "식신: 결과물·표현·생산성",
    );
    expect(sanitizeMajorFortuneVisibleText("甲일간")).toBe("甲(갑목) 일간");
  });
});
