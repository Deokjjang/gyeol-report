import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateAnnualFortuneProductDraft,
} from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import {
  validateAnnualFortuneReportDraft,
} from "../../../src/lib/report-generation/annualFortuneReportDraftValidator";
import type {
  SinglePersonGenerationInput,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/annualFortuneGenerationHandler.ts",
);
const dispatcherSourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");
const dispatcherSource = readFileSync(dispatcherSourcePath, "utf8");

const baseInput: SinglePersonGenerationInput = {
  kind: "annualFortune",
  productKey: "annual_fortune",
  productSlug: "annual-fortune",
  person: {
    name: "덕민",
    birthDate: "1999-07-31",
    birthTime: "07:30",
    birthTimeUnknown: false,
    approximateBirthTimeSlot: "",
    gender: "MALE",
    mbtiType: "ENTJ",
    calendarType: "solar",
    timezone: "Asia/Seoul",
  },
  userContext: {
    relationshipStatus: "single",
    jobStatus: "employee",
    detailJob: "서비스 기획자",
    focusAreas: ["직업", "돈"],
  },
  productOptions: {
    selectedYear: "2026",
  },
};

function collectVisibleDraftText(
  result: Awaited<ReturnType<typeof generateAnnualFortuneProductDraft>>,
): string {
  if (!result.ok) {
    return "";
  }

  const draft = result.draft;

  return [
    draft.headline,
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.selectedYearSummary,
    draft.yearAccessNotice,
    draft.majorAnnualCrossReading,
    draft.natalAnnualReading,
    draft.monthlyFlowReading,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.translationNote,
    draft.mbtiExpression,
    ...draft.monthlyHighlights.flatMap((highlight) => [
      highlight.monthLabel,
      highlight.headline,
      highlight.body,
      highlight.actionHint,
    ]),
    ...draft.monthlyFlow.flatMap((month) => [
      month.label,
      month.headline,
      month.body,
      month.advice,
    ]),
    ...draft.flowCards.flatMap((card) => [card.label, card.headline, card.body]),
    ...draft.riskManagement,
    ...draft.actionPlan,
    ...draft.finalAdvice,
    ...draft.safetyNotes,
  ].join("\n");
}

describe("annual fortune generation handler", () => {
  it("builds a validated annual fortune draft and evidence packet", async () => {
    const result = await generateAnnualFortuneProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      kind: "annualFortune",
      draft: {
        version: "v1",
        productType: "annual_fortune",
        productVersion: "v1",
        targetYear: 2026,
        personLabel: "덕민",
      },
      evidencePacket: {
        productType: "annual_fortune",
        productVersion: "v1",
        selectedYear: 2026,
        personContext: {
          name: "덕민",
          userContext: {
            lifeStatus: "employee",
            fieldLabel: "서비스 기획자",
            relationshipStatus: "single",
          },
        },
      },
    });
    if (!result.ok) return;

    const validation = validateAnnualFortuneReportDraft(result.draft);

    expect(validation.ok).toBe(true);
    expect(result.evidencePacket.monthlyFortunes).toHaveLength(12);
    expect(result.draft.monthlyFlow).toHaveLength(12);
  });

  it("passes selectedYear into annual evidence and draft sections", async () => {
    const result = await generateAnnualFortuneProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      evidencePacket: {
        selectedYear: 2026,
        annualFortune: {
          year: 2026,
        },
        yearAccessPolicy: {
          selectedYear: 2026,
        },
      },
      draft: {
        targetYear: 2026,
        openingTitle: "덕민님의 2026년 세운 리포트",
      },
    });
  });

  it("uses fixture major fortune cycles for the major annual cross context", async () => {
    const result = await generateAnnualFortuneProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      evidencePacket: {
        currentMajorFortune: {
          ganji: "戊辰",
          yearRange: "2026년~2035년",
        },
        majorAnnualCross: {
          majorGanji: "戊辰",
          annualGanji: "丙午",
        },
      },
    });
  });

  it("uses userContext as visible scene context without making it a calculation cause", async () => {
    const result = await generateAnnualFortuneProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);

    expect(visibleText).toContain("서비스 기획자");
    expect(visibleText).toContain("직장인");
    expect(visibleText).toContain("계산의 원인이 아니라");
  });

  it("returns generation failure for invalid selectedYear", async () => {
    const result = await generateAnnualFortuneProductDraft({
      ...baseInput,
      productOptions: {
        selectedYear: "not-a-year",
      },
    });

    expect(result).toMatchObject({
      ok: false,
      kind: "annualFortune",
      error: {
        code: "ANNUAL_FORTUNE_GENERATION_FAILED",
      },
    });
  });

  it("does not expose forbidden or internal wording in visible draft fields", async () => {
    const result = await generateAnnualFortuneProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);
    const forbiddenMarkers = [
      "투자 수익 보장",
      "합격 확정",
      "승진 확정",
      "이직 확정",
      "결혼 확정",
      "이혼 확정",
      "임신 확정",
      "출산 확정",
      "질병/사고/사망 예언",
      "productKey",
      "source registry",
      "debug",
      "calendar_month_approximation",
      "${",
    ];

    for (const marker of forbiddenMarkers) {
      expect(visibleText).not.toContain(marker);
    }
  });

  it("does not connect API, persistence, payment, or unconditional writer execution", () => {
    const forbiddenMarkers = [
      "api/reports",
      "persistence",
      "supabase",
      "payment",
      "Date.now",
    ];

    for (const marker of forbiddenMarkers) {
      expect(source).not.toContain(marker);
      expect(dispatcherSource).not.toContain(marker);
    }

    expect(source).toContain("options.writer?.enabled === true");
    expect(dispatcherSource).toContain("annualFortune: handleAnnualFortuneGeneration");
  });
});
