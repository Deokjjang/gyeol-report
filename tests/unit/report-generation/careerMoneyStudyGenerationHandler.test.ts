import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateCareerMoneyStudyProductDraft,
} from "../../../src/lib/report-generation/careerMoneyStudyGenerationHandler";
import {
  validateCareerReportDraft,
} from "../../../src/lib/report-generation/careerReportDraftValidator";
import type {
  SinglePersonGenerationInput,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/careerMoneyStudyGenerationHandler.ts",
);
const dispatcherSourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");
const dispatcherSource = readFileSync(dispatcherSourcePath, "utf8");

const baseInput: SinglePersonGenerationInput = {
  kind: "careerMoneyStudy",
  productKey: "career_money_study",
  productSlug: "career-money-study",
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
  result: Awaited<ReturnType<typeof generateCareerMoneyStudyProductDraft>>,
): string {
  if (!result.ok) {
    return "";
  }

  const draft = result.draft;

  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.userContextSummary.lifeStatusLabel,
    draft.userContextSummary.fieldLabel ?? "",
    draft.userContextSummary.relationshipStatusLabel ?? "",
    draft.userContextSummary.contextNote,
    draft.careerIdentity.headline,
    draft.careerIdentity.body,
    draft.careerIdentity.strongestFit,
    draft.careerIdentity.biggestRisk,
    draft.myeongliMbtiSummary.myeongliCore,
    draft.myeongliMbtiSummary.mbtiCore,
    draft.myeongliMbtiSummary.combinedReading,
    draft.moneyEarningStyle.headline,
    draft.moneyEarningStyle.body,
    ...draft.moneyEarningStyle.bestIncomeChannels,
    ...draft.moneyEarningStyle.riskyIncomeChannels,
    ...draft.moneyEarningStyle.sideIncomeIdeas,
    draft.investmentAndSavingStyle.headline,
    draft.investmentAndSavingStyle.body,
    draft.investmentAndSavingStyle.forbiddenNote,
    draft.studyCertificatePlan.headline,
    draft.studyCertificatePlan.body,
    ...draft.recommendedJobs.flatMap((job) => [
      job.title,
      job.tagline,
      job.reason,
      job.caution,
      ...job.exampleFields,
    ]),
    ...draft.unsuitableJobs.flatMap((job) => [
      job.title,
      job.reason,
      job.warning,
    ]),
    ...draft.careerPaths.flatMap((path) => [
      path.label,
      path.headline,
      path.body,
      ...path.push,
      ...path.avoid,
    ]),
    ...draft.careerTiming.flatMap((timing) => [
      timing.label,
      timing.headline,
      timing.body,
      ...timing.push,
      ...timing.avoid,
    ]),
    ...draft.actionPlan.flatMap((item) => [
      item.label,
      item.headline,
      item.body,
      item.firstAction,
    ]),
    ...draft.riskWarnings.flatMap((risk) => [
      risk.title,
      risk.body,
      risk.prevention,
    ]),
    ...draft.safetyNotes,
  ].join("\n");
}

describe("career money study generation handler", () => {
  it("builds a validated career money study draft and evidence packet", async () => {
    const result = await generateCareerMoneyStudyProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      kind: "careerMoneyStudy",
      draft: {
        version: "v1",
        productType: "career_money_study",
        productVersion: "v1",
        personLabel: "덕민",
      },
      evidencePacket: {
        productType: "career_money_study",
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

    const validation = validateCareerReportDraft(result.draft);

    expect(validation.ok).toBe(true);
    expect(result.evidencePacket.userPillars.day).toMatch(/^[甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]$/u);
    expect(result.evidencePacket.recommendedJobs.length).toBeGreaterThanOrEqual(8);
  });

  it("uses userContext as visible work and money context without making it a calculation cause", async () => {
    const result = await generateCareerMoneyStudyProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);

    expect(visibleText).toContain("서비스 기획자");
    expect(visibleText).toContain("직업");
    expect(visibleText).toContain("돈");
    expect(visibleText).toContain("계산 기준이 아니라");
  });

  it("returns generation failure for invalid birth date", async () => {
    const result = await generateCareerMoneyStudyProductDraft({
      ...baseInput,
      person: {
        ...baseInput.person,
        birthDate: "not-a-date",
      },
    });

    expect(result).toMatchObject({
      ok: false,
      kind: "careerMoneyStudy",
      error: {
        code: "CAREER_MONEY_STUDY_GENERATION_FAILED",
      },
    });
  });

  it("does not expose forbidden or internal wording in visible draft fields", async () => {
    const result = await generateCareerMoneyStudyProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);
    const forbiddenMarkers = [
      "원금 보장",
      "수익 보장",
      "반드시 합격",
      "합격 확정",
      "승진 확정",
      "이직 확정",
      "매수하세요",
      "매도하세요",
      "productKey",
      "source registry",
      "debug",
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
    expect(dispatcherSource).toContain("careerMoneyStudy: handleCareerMoneyStudyGeneration");
  });
});
