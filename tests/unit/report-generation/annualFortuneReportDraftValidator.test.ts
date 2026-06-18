import { describe, expect, it } from "vitest";

import type { AnnualFortuneReportDraft } from "../../../src/lib/report-generation/annualFortuneReportDraftTypes";
import {
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
      totalScore: 72,
      scoreLabel: "확장형 흐름",
      scoreCaution: "점수는 결과를 단정하지 않고 조율할 지점을 보여 줍니다.",
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
      elementFocus: "화",
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
});
