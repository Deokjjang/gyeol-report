import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  generateMajorFortuneProductDraft,
} from "../../../src/lib/report-generation/majorFortuneGenerationHandler";
import {
  validateMajorFortuneReportDraft,
} from "../../../src/lib/report-generation/majorFortuneReportDraftValidator";
import type {
  SinglePersonGenerationInput,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/majorFortuneGenerationHandler.ts",
);
const dispatcherSourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");
const dispatcherSource = readFileSync(dispatcherSourcePath, "utf8");

const baseInput: SinglePersonGenerationInput = {
  kind: "majorFortune",
  productKey: "major_fortune",
  productSlug: "major-fortune",
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
  productOptions: {},
};

function collectVisibleDraftText(
  result: Awaited<ReturnType<typeof generateMajorFortuneProductDraft>>,
): string {
  if (!result.ok) {
    return "";
  }

  const draft = result.draft;

  return [
    draft.headline ?? "",
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.relationshipStatusLabel ?? "",
    draft.userContextSummary.translationNote,
    draft.currentCycleSummary ?? "",
    draft.tenYearTheme ?? "",
    draft.timelineReading ?? "",
    draft.annualCrossReading ?? "",
    draft.mbtiExpression ?? "",
    ...draft.bigThemes.flatMap((theme) => [
      theme.title,
      theme.metaphor,
      theme.body,
      ...theme.likelyScenes,
      theme.strategy,
    ]),
    ...draft.majorFortuneTimelineRows.flatMap((row) => [
      row.oneLine,
      row.strategy,
      row.yearDetail.coreFlow,
      row.yearDetail.realWorldScenes,
      row.yearDetail.cautionPoint,
      row.yearDetail.actionStandard,
    ]),
    ...(draft.riskManagement ?? []),
    ...(draft.actionPlan ?? []),
    ...draft.finalAdvice.map((advice) => advice.body),
    ...draft.safetyNotes,
  ].join("\n");
}

describe("major fortune generation handler", () => {
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-21T12:00:00+09:00")); });
  afterEach(() => vi.useRealTimers());
  it("builds a validated major fortune draft and evidence packet", async () => {
    const result = await generateMajorFortuneProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      kind: "majorFortune",
      draft: {
        version: "v1",
        productType: "major_fortune",
        productVersion: "v1",
        personLabel: "덕민",
      },
      evidencePacket: {
        productType: "major_fortune",
        productVersion: "v1",
        personLabel: "덕민",
        userContext: {
          lifeStatus: "employee",
          fieldLabel: "서비스 기획자",
          relationshipStatus: "single",
        },
      },
    });
    if (!result.ok) return;

    const validation = validateMajorFortuneReportDraft(result.draft);

    expect(validation.ok).toBe(true);
    expect(result.evidencePacket.majorFortuneTimelineRows).toHaveLength(10);
    expect(result.draft.majorFortuneTimelineRows).toHaveLength(10);
  });

  it("uses the calculated customer cycle for deterministic fallback", async () => {
    const result = await generateMajorFortuneProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      evidencePacket: {
        majorCycleBasis: {
          basisType: "manse_engine_major_fortune_table",
        },
        currentMajorFortune: {
          ganji: "己巳",
          yearRange: "2017년~2026년",
        },
      },
    });
  });

  it("uses userContext as visible scene context without making it a calculation cause", async () => {
    const result = await generateMajorFortuneProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);

    expect(visibleText).toContain("서비스 기획자");
    expect(visibleText).toContain("직장인");
    expect(visibleText).toContain("계산 원인이 아니라");
  });

  it("returns generation failure for invalid birth date", async () => {
    const result = await generateMajorFortuneProductDraft({
      ...baseInput,
      person: {
        ...baseInput.person,
        birthDate: "not-a-date",
      },
    });

    expect(result).toMatchObject({
      ok: false,
      kind: "majorFortune",
      error: {
        code: "INVALID_REPORT_INPUT",
      },
    });
  });

  it("does not expose forbidden or internal wording in visible draft fields", async () => {
    const result = await generateMajorFortuneProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);
    const forbiddenMarkers = [
      "투자 수익 보장",
      "합격 확정",
      "승진 확정",
      "이직 확정",
      "결혼 확정",
      "이혼 확정",
      "질병/사고/사망 예언",
      "productKey",
      "source registry",
      "debug",
      "${",
    ];

    for (const marker of forbiddenMarkers) {
      expect(visibleText).not.toContain(marker);
    }
  });

  it("does not synthesize replacement advice while validating fallback content", async () => {
    const result = await generateMajorFortuneProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);
    const repeatedActionHint =
      "역할, 권한, 마감 기준을 문서로 남기고 반복 업무는 시스템으로 고정하세요.";
    const count = visibleText.split(repeatedActionHint).length - 1;

    expect(count).toBeLessThan(3);
    expect(visibleText).not.toMatch(/반복\s*압박\s*\d+번째|\d+번째\s*점검/u);
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
    expect(dispatcherSource).toContain("majorFortune: handleMajorFortuneGeneration");
  });
});
