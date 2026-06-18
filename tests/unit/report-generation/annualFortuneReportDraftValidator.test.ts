import { describe, expect, it } from "vitest";

import type { AnnualFortuneReportDraft } from "../../../src/lib/report-generation/annualFortuneReportDraftTypes";
import {
  buildAnnualDomainLockedFinalAdvice,
  inferAnnualAdviceDomain,
  sanitizeAnnualFortuneVisibleText,
  summarizeAnnualFortuneDraftQuality,
  validateAnnualFortuneReportDraft,
} from "../../../src/lib/report-generation/annualFortuneReportDraftValidator";

function createValidAnnualDraft(
  overrides: Partial<AnnualFortuneReportDraft> = {},
): AnnualFortuneReportDraft {
  const mode = overrides.mode ?? "current_year";
  const modeText =
    mode === "past_review"
      ? "그해 회고 흐름에서 왜 압박이 반복됐는지 봅니다."
      : mode === "new_year_preview"
        ? "신년 준비와 활용, 기회와 조심할 지점을 봅니다."
        : "올해 준비와 활용, 기회와 조심할 지점을 봅니다.";

  return {
    version: "v1",
    productType: "annual_fortune",
    productVersion: "v1",
    targetYear: 2026,
    mode,
    personLabel: "덕민",
    userContextSummary: {
      lifeStatusLabel: "직장인",
      fieldLabel: "개발·서비스 기획",
      translationNote:
        "올해 흐름은 직장·프로젝트·보고·서비스 운영 장면을 중심으로 번역했습니다.",
    },
    openingTitle: "2026년 세운 흐름",
    openingSummary: modeText,
    coreLine: "丙午의 화 기운이 표현과 실행을 밀어 올리는 흐름입니다.",
    yearSummary: {
      ganji: "丙午",
      displayTitle: "2026년 丙午",
      elementLabel: "화의 해",
      tenGodLabel: "식신의 해",
      modeLabel: mode === "past_review" ? "회고" : mode === "new_year_preview" ? "신년운세" : "올해 흐름",
      yearTone: modeText,
    },
    scoreSummary: {
      flowIndex: 72,
      flowTypeLabel: "출력·현실압 동시 상승형",
      flowIndexCaution: "흐름 지표는 결과를 단정하지 않고 조율할 지점을 보여 줍니다.",
    },
    flowCards: [
      {
        label: "일·성과",
        score: 78,
        headline: "결과물을 밖으로 꺼내기 쉽습니다.",
        body: "직장이나 작업에서 보여 줄 결과가 생기기 쉽습니다.",
      },
    ],
    keySignals: [
      {
        type: "opportunity",
        title: "표현 기회",
        body: "말과 결과물이 밖으로 나오는 장면이 생길 수 있습니다.",
        evidenceLabel: "식신",
      },
      {
        type: "difficulty",
        title: "현실 부담",
        body: "일과 돈의 기준을 직접 정리해야 하는 장면이 생길 수 있습니다.",
        evidenceLabel: "토 과다",
      },
    ],
    annualStructure: {
      ganjiExplanation: "丙午는 화의 기운이 강하게 들어오는 해입니다.",
      tenGodExplanation: "식신은 결과물을 꾸준히 밖으로 꺼내는 기운입니다.",
      elementEffectExplanation: "화 부족을 채우지만 토 책임도 같이 무거워질 수 있습니다.",
      branchInteractionExplanation: "午未 육합은 생활 리듬에 약속과 움직임을 만듭니다.",
    },
    chapters: Array.from({ length: 6 }, (_, index) => ({
      title: `흐름 ${index + 1}`,
      headline: "생활 장면으로 확인되는 흐름입니다.",
      body: "직장, 돈, 가족 중 한 영역에서 내가 정리해야 하는 역할이 강해졌을 가능성이 큽니다.",
      likelyScenes: [
        "맡은 일을 결과물로 정리해야 하는 장면입니다.",
        "일정과 돈의 기준을 다시 세우는 장면입니다.",
      ],
      practicalAdvice: [
        "큰 결정을 바로 확정하지 말고 근거를 한 번 더 확인하세요.",
        "책임이 몰리면 역할과 마감 기준을 문장으로 남기세요.",
      ],
    })),
    monthlyFlow: Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      label: `${index + 1}월`,
      headline: "흐름을 확인하는 달입니다.",
      monthGanji: "甲子",
      monthlyBasis: "달력월 기준 운영 가이드",
      elementFocus: "화",
      natalInteractionSummary: "화 부족 보완 / 토 과다 자극 / 뚜렷한 지지 충·합·해는 약함",
      body: "일과 생활의 리듬을 같이 확인해야 합니다.",
      advice: "무리한 확정보다 기준 정리를 먼저 하세요.",
    })),
    finalAdvice: [
      "일정과 책임을 한 문장으로 정리하세요.",
      "돈과 기록은 미루지 말고 같은 날 확인하세요.",
      "몸의 리듬이 무너지면 약속을 줄이세요.",
      "결과를 내야 하는 일은 작은 단위로 쪼개세요.",
    ],
    safetyNotes: [
      "이 리포트는 결과를 단정하지 않습니다.",
      "입력되지 않았거나 확실하지 않은 정보는 제한적으로만 반영했습니다.",
    ],
    ...overrides,
  };
}

describe("annualFortuneReportDraftValidator", () => {
  it("accepts a valid annual fortune draft", () => {
    const result = validateAnnualFortuneReportDraft(createValidAnnualDraft());

    expect(result.ok).toBe(true);
    expect(result.value?.monthlyFlow).toHaveLength(12);
  });

  it("maps legacy scoreSummary fields to flow index fields", () => {
    const draft = createValidAnnualDraft();
    const result = validateAnnualFortuneReportDraft({
      ...draft,
      scoreSummary: {
        totalScore: 68,
        scoreLabel: "중상",
        scoreCaution: "세운 흐름 점수는 참고값입니다.",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.scoreSummary).toMatchObject({
      flowIndex: 68,
      flowTypeLabel: "중상",
      flowIndexCaution: "세운 흐름 점수는 참고값입니다.",
    });
  });

  it("fills missing userContextSummary with fallback copy", () => {
    const draft = createValidAnnualDraft();
    const result = validateAnnualFortuneReportDraft({
      ...draft,
      userContextSummary: undefined,
    });

    expect(result.ok).toBe(true);
    expect(result.value?.userContextSummary).toMatchObject({
      lifeStatusLabel: "기타",
      fieldLabel: null,
    });
  });

  it("ignores interestArea if it appears in an incoming draft", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      interestArea: "career",
    });

    expect(result.ok).toBe(true);
    expect("interestArea" in (result.value as Record<string, unknown>)).toBe(
      false,
    );
  });

  it("normalizes missing monthlyFlow elementFocus to null", () => {
    const draft = createValidAnnualDraft();
    const result = validateAnnualFortuneReportDraft({
      ...draft,
      monthlyFlow: draft.monthlyFlow.map((flow) => ({
        month: flow.month,
        label: flow.label,
        headline: flow.headline,
        body: flow.body,
        advice: flow.advice,
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      result.value?.monthlyFlow.every((flow) => flow.elementFocus === null),
    ).toBe(true);
    expect(result.value?.monthlyFlow[0]).toMatchObject({
      monthGanji: null,
      monthlyBasis: "달력월 기준 운영 가이드",
      natalInteractionSummary: null,
    });
  });

  it("accepts monthlyFlow elementFocus null", () => {
    const draft = createValidAnnualDraft();
    const result = validateAnnualFortuneReportDraft({
      ...draft,
      monthlyFlow: draft.monthlyFlow.map((flow) => ({
        ...flow,
        elementFocus: null,
      })),
    });

    expect(result.ok).toBe(true);
    expect(
      result.value?.monthlyFlow.every((flow) => flow.elementFocus === null),
    ).toBe(true);
  });

  it("preserves monthlyFlow elementFocus string", () => {
    const draft = createValidAnnualDraft();
    const expectedElementFocus = draft.monthlyFlow[0]?.elementFocus;
    const result = validateAnnualFortuneReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.value?.monthlyFlow[0]?.elementFocus).toBe(
      expectedElementFocus,
    );
  });

  it("maps raw monthly basis enum to visible Korean copy", () => {
    const draft = createValidAnnualDraft();
    const result = validateAnnualFortuneReportDraft({
      ...draft,
      monthlyFlow: draft.monthlyFlow.map((flow) => ({
        ...flow,
        monthlyBasis: "calendar_month_approximation",
      })),
    });

    expect(result.ok).toBe(true);
    expect(result.value?.monthlyFlow[0]?.monthlyBasis).toBe(
      "달력월 기준 운영 가이드",
    );
    expect(JSON.stringify(result.value?.monthlyFlow)).not.toContain(
      "calendar_month_approximation",
    );
  });

  it("sanitizes repeated annual fortune terms", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      annualStructure: {
        ...createValidAnnualDraft().annualStructure,
        tenGodExplanation:
          "식신(식신, 말·결과물·생산성)은 甲일간과 甲 일간(갑 일간)에게 들어온 흐름입니다.",
        elementEffectExplanation: "토 과다(흙이 무거움)를 같이 봅니다.",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.annualStructure.tenGodExplanation).toContain(
      "식신: 말·결과물·생산성",
    );
    expect(result.value?.annualStructure.tenGodExplanation).toContain(
      "甲(갑목) 일간",
    );
    expect(result.value?.annualStructure.tenGodExplanation).not.toContain(
      "甲일간",
    );
    expect(result.value?.annualStructure.elementEffectExplanation).toContain(
      "토 과다: 현실·책임·관리의 기운이 무거운 구조",
    );
  });

  it("sanitizes grammar residue around annual ten-god terms", () => {
    expect(
      sanitizeAnnualFortuneVisibleText(
        "식신: 결과를 밖으로 꺼내는 별으로 들어오고 甲일간 기준입니다.",
      ),
    ).toContain("식신으로 들어와 결과물과 표현을 밖으로 꺼내는 힘을 키우고");
    expect(
      sanitizeAnnualFortuneVisibleText(
        "식신: 결과를 밖으로 꺼내는 별으로 들어옵니다.",
      ),
    ).toContain("식신으로 들어와 결과물과 표현을 밖으로 꺼내는 힘을 키웁니다");
    expect(sanitizeAnnualFortuneVisibleText("甲일간")).toBe(
      "甲(갑목) 일간",
    );
    expect(sanitizeAnnualFortuneVisibleText("별으로")).toBe("별로");
  });

  it("sanitizes repeated branch and generating terminology", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      annualStructure: {
        ...createValidAnnualDraft().annualStructure,
        branchInteractionExplanation:
          "卯午 파(卯午 파, 익숙한 방식이 깨지며 다시 조정되는 작용), 午未 육합(午未 육합, 월지에 묶이는 리듬), 寅申 충(寅申 충, 서로 부딪혀 방향이 바뀌는 작용), 申寅 형(申寅 형, 긴장과 마찰이 생기기 쉬운 작용), 생(생, 낳아줌)을 함께 봅니다.",
      },
    });

    expect(result.ok).toBe(true);
    expect(result.value?.annualStructure.branchInteractionExplanation).toContain(
      "卯午 파: 익숙한 방식이 깨지며 다시 조정되는 작용",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).toContain(
      "午未 육합: 실제 약속과 움직임이 묶이는 흐름",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).toContain(
      "寅申 충: 서로 부딪히며 방향이 바뀌는 작용",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).toContain(
      "申寅 형: 긴장과 마찰이 생기기 쉬운 작용",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).toContain(
      "생: 기운을 보태는 작용",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).not.toContain(
      "卯午 파(",
    );
    expect(result.value?.annualStructure.branchInteractionExplanation).not.toContain(
      "午未 육합(",
    );
  });

  it("strips duplicated final advice prefixes", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      finalAdvice: [
        "실행 기준: 결과물을 작은 단위로 나누세요.",
        "일·성과: 프로젝트 마감을 먼저 정리하세요.",
        "돈·현실: 생활비 기준을 문장으로 남기세요.",
        "올해 운영법: 일정과 수면을 같이 보세요.",
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value?.finalAdvice[0]).not.toContain("실행 기준:");
    expect(result.value?.finalAdvice[1]).not.toContain("일·성과:");
    expect(result.value?.finalAdvice[2]).not.toContain("돈·현실:");
  });

  it("infers final advice domain labels from body keywords", () => {
    expect(inferAnnualAdviceDomain("프로젝트 결과물, 보고, 문서화, 발표처럼 눈에 보이는 산출물을 먼저 만드세요.")).toBe(
      "일·성과",
    );
    expect(inferAnnualAdviceDomain("생활비와 정산, 계약 기준은 미리 적어 두세요.")).toBe(
      "돈·현실",
    );
    expect(inferAnnualAdviceDomain("자격증, 오답, 요약, 발표 연습은 시험 전에 정리하세요.")).toBe(
      "학업·자격증",
    );
    expect(inferAnnualAdviceDomain("수면과 식사 시간을 먼저 고정하세요.")).toBe(
      "몸·생활 리듬",
    );
    expect(inferAnnualAdviceDomain("연인이나 부모와의 약속은 가족 일정과 함께 조율하세요.")).toBe(
      "연애·가족",
    );
    expect(inferAnnualAdviceDomain("상사와 동료에게 역할 분담을 다시 확인하세요.")).toBe(
      "일·성과",
    );
  });

  it("builds six domain-locked final advice items", () => {
    const draft = createValidAnnualDraft({
      finalAdvice: [
        "프로젝트 결과물, 보고, 문서화, 발표처럼 눈에 보이는 산출물을 먼저 만드세요.",
        "수면과 식사 시간을 먼저 고정하세요.",
        "상사·동료·가족과의 조율은 한 문장으로 남기세요.",
      ],
    });
    const lockedAdvice = buildAnnualDomainLockedFinalAdvice({ draft });

    expect(lockedAdvice).toHaveLength(6);
    expect(lockedAdvice.map((item) => item.label)).toEqual([
      "일·성과",
      "돈·현실",
      "인간관계",
      "연애·가족",
      "학업·자격증",
      "몸·생활 리듬",
    ]);
    expect(lockedAdvice.find((item) => item.label === "일·성과")?.body).toContain(
      "프로젝트 결과물",
    );
    expect(
      lockedAdvice.find((item) => item.label === "몸·생활 리듬")?.body,
    ).toContain("수면");
    expect(
      lockedAdvice.find((item) => item.label === "일·성과")?.body,
    ).not.toContain("가족");
  });

  it("counts final lock and visible polish quality warnings", () => {
    const clean = validateAnnualFortuneReportDraft(createValidAnnualDraft());

    expect(clean.ok).toBe(true);
    expect(
      summarizeAnnualFortuneDraftQuality(clean.value!)
        .futureDevelopmentWordingWarnings,
    ).toBe(0);
    expect(
      summarizeAnnualFortuneDraftQuality(clean.value!).grammarResidueWarnings,
    ).toBe(0);
    expect(
      summarizeAnnualFortuneDraftQuality(clean.value!)
        .finalAdviceDomainLockWarnings,
    ).toBe(0);
  });

  it("rejects missing monthlyFlow", () => {
    const draft = { ...createValidAnnualDraft() } as Partial<AnnualFortuneReportDraft>;
    delete draft.monthlyFlow;

    expect(validateAnnualFortuneReportDraft(draft).ok).toBe(false);
  });

  it("rejects monthlyFlow not length 12", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      monthlyFlow: createValidAnnualDraft().monthlyFlow.slice(0, 11),
    });

    expect(result.errors).toContain("ANNUAL_FORTUNE_MONTHLY_FLOW_INVALID");
  });

  it("rejects unsupported mode", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      mode: "locked_future",
    });

    expect(result.ok).toBe(false);
  });

  it("rejects too few chapters", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      chapters: createValidAnnualDraft().chapters.slice(0, 5),
    });

    expect(result.errors).toContain("ANNUAL_FORTUNE_CHAPTER_COUNT_INVALID");
  });

  it("removes hard deterministic claims and internal words", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      openingSummary:
        "올해 반드시 승진합니다. evidence debug schema fixture diagnostic-only 진단용",
    });
    const visibleSummary = result.value?.openingSummary ?? "";

    expect(result.ok).toBe(true);
    expect(visibleSummary).not.toContain("반드시");
    expect(visibleSummary).not.toContain("승진합니다");
    expect(visibleSummary).not.toMatch(/evidence|debug|schema|fixture|diagnostic-only|진단용/u);
  });

  it("keeps mode-specific tones for past, current, and new year drafts", () => {
    expect(
      validateAnnualFortuneReportDraft(
        createValidAnnualDraft({ mode: "past_review" }),
      ).ok,
    ).toBe(true);
    expect(
      validateAnnualFortuneReportDraft(
        createValidAnnualDraft({ mode: "current_year" }),
      ).ok,
    ).toBe(true);
    expect(
      validateAnnualFortuneReportDraft(
        createValidAnnualDraft({ mode: "new_year_preview" }),
      ).ok,
    ).toBe(true);
  });

  it("accepts current_year mid-year 상반기 and 하반기 tone", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft({ mode: "current_year" }),
      openingSummary:
        "올해 상반기에는 이미 직장과 프로젝트에서 압박을 체감했을 수 있고, 하반기에는 준비와 조율로 손실을 줄이기 좋습니다.",
      coreLine:
        "상반기 체감과 하반기 활용을 함께 보는 올해 흐름입니다.",
      yearSummary: {
        ...createValidAnnualDraft().yearSummary,
        yearTone:
          "지금부터는 상반기 신호를 정리하고 하반기 흐름을 쓰기 위한 준비가 중요합니다.",
      },
    });

    expect(result.ok).toBe(true);
  });

  it("flags generic vague annual fortune phrases", () => {
    const draft = createValidAnnualDraft({
      chapters: createValidAnnualDraft().chapters.map((chapter, index) =>
        index === 0
          ? {
              ...chapter,
              body: "올해는 책임이 커질 수 있습니다.",
            }
          : chapter,
      ),
    });
    const result = validateAnnualFortuneReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.warnings).toContain("ANNUAL_FORTUNE_VAGUE_COPY_WARNING:1");
  });

  it("accepts concrete scene candidates even when they mention pressure", () => {
    const draft = createValidAnnualDraft({
      chapters: createValidAnnualDraft().chapters.map((chapter, index) =>
        index === 0
          ? {
              ...chapter,
              body:
                "직장 프로젝트에서 책임이 커질 수 있습니다. 결과물과 성과 기준을 직접 잡아야 하는 장면으로 이어지기 쉽습니다.",
            }
          : chapter,
      ),
    });
    const result = validateAnnualFortuneReportDraft(draft);

    expect(result.ok).toBe(true);
    expect(result.warnings).not.toContain("ANNUAL_FORTUNE_VAGUE_COPY_WARNING:1");
  });

  it("rejects purely past-review tone for current_year drafts", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft({ mode: "current_year" }),
      openingSummary:
        "그해 회고에서 왜 흔들렸는지와 그 시기 압박이 반복된 이유만 봅니다.",
      coreLine: "그해 왜 압박이 반복됐는지 회고하는 흐름입니다.",
      yearSummary: {
        ...createValidAnnualDraft().yearSummary,
        yearTone: "그해 회고와 그 시기 반복 압박만 설명합니다.",
      },
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain(
      "ANNUAL_FORTUNE_CURRENT_YEAR_TONE_REVIEW_ONLY",
    );
  });

  it("counts missing key signal balance warnings", () => {
    const result = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      keySignals: [
        {
          type: "opportunity",
          title: "표현 기회",
          body: "결과물을 밖으로 꺼내는 흐름입니다.",
          evidenceLabel: "식신",
        },
      ],
    });

    expect(result.ok).toBe(true);
    expect(result.value).toBeDefined();
    expect(
      summarizeAnnualFortuneDraftQuality(result.value!)
        .missingDifficultySignalWarnings,
    ).toBe(1);
    expect(
      summarizeAnnualFortuneDraftQuality(result.value!)
        .missingOpportunitySignalWarnings,
    ).toBe(0);
  });

  it("warns on obvious context overreach but not balanced family copy", () => {
    const overreach = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      flowCards: [
        {
          label: "연애·가족",
          score: 60,
          headline: "프로젝트와 보고가 가족 영역까지 들어옵니다.",
          body: "상사, 동료, 프로젝트, 보고, 마감 이야기가 전부인 문장입니다.",
        },
      ],
    });
    const balanced = validateAnnualFortuneReportDraft({
      ...createValidAnnualDraft(),
      flowCards: [
        {
          label: "연애·가족",
          score: 60,
          headline: "가족 일정과 생활 리듬을 조율합니다.",
          body: "가족, 부모, 약속을 중심으로 보되 직장 마감이 집안 일정에 영향을 줄 수 있습니다.",
        },
      ],
    });

    expect(overreach.ok).toBe(true);
    expect(balanced.ok).toBe(true);
    expect(
      summarizeAnnualFortuneDraftQuality(overreach.value!)
        .domainContextOverreachWarnings,
    ).toBe(1);
    expect(
      summarizeAnnualFortuneDraftQuality(balanced.value!)
        .domainContextOverreachWarnings,
    ).toBe(0);
  });
});
