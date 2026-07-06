import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  generateLoveMarriageChildProductDraft,
} from "../../../src/lib/report-generation/loveMarriageChildGenerationHandler";
import {
  validateLoveMarriageChildReportDraft,
} from "../../../src/lib/report-generation/loveMarriageChildReportDraftValidator";
import type {
  SinglePersonGenerationInput,
} from "../../../src/lib/report-generation/reportInputAdapter";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/loveMarriageChildGenerationHandler.ts",
);
const dispatcherSourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");
const dispatcherSource = readFileSync(dispatcherSourcePath, "utf8");

const baseInput: SinglePersonGenerationInput = {
  kind: "loveMarriageChild",
  productKey: "love_marriage_child",
  productSlug: "love-marriage-child",
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
  result: Awaited<ReturnType<typeof generateLoveMarriageChildProductDraft>>,
): string {
  if (!result.ok) {
    return "";
  }

  const draft = result.draft;

  return [
    draft.headline,
    draft.openingSummary,
    draft.loveStyle.headline,
    draft.loveStyle.body,
    draft.attractionPattern.headline,
    draft.attractionPattern.body,
    draft.loveStrengths.body,
    draft.loveFriction.body,
    draft.marriageRhythm.body,
    draft.householdMoneyAndRoleSplit.body,
    draft.conflictRecovery.body,
    draft.parentMode.body,
    draft.breakupReunionPattern.body,
    ...draft.relationshipTimingHints.flatMap((hint) => [
      hint.headline,
      hint.body,
      ...hint.push,
      ...hint.avoid,
    ]),
    ...draft.actionPlan.flatMap((item) => [
      item.label,
      item.headline,
      item.body,
      item.firstAction,
    ]),
    ...draft.riskManagement.flatMap((item) => [
      item.title,
      item.body,
      item.prevention,
    ]),
    ...draft.safetyNotes,
  ].join("\n");
}

describe("love marriage child generation handler", () => {
  it("builds a validated love marriage child draft and evidence packet", async () => {
    const result = await generateLoveMarriageChildProductDraft(baseInput);

    expect(result).toMatchObject({
      ok: true,
      kind: "loveMarriageChild",
      draft: {
        version: "v1",
        productType: "love_marriage_child",
        productVersion: "v1",
        personLabel: "덕민",
      },
      evidencePacket: {
        productType: "love_marriage_child",
        productVersion: "v1",
        personContext: {
          name: "덕민",
          relationshipStatus: "single",
          mbtiType: "ENTJ",
        },
      },
    });
    if (!result.ok) return;

    const validation = validateLoveMarriageChildReportDraft(result.draft);

    expect(validation.ok).toBe(true);
    expect(result.evidencePacket.sajuBasis.fullPillars.length).toBeGreaterThanOrEqual(3);
  });

  it("uses userContext as visible scene context without making it a calculation cause", async () => {
    const result = await generateLoveMarriageChildProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);

    expect(visibleText).toContain("서비스 기획자");
    expect(visibleText).toContain("직업, 돈");
    expect(visibleText).toContain("계산 원인이 아니라");
  });

  it("returns generation failure for invalid birth date", async () => {
    const result = await generateLoveMarriageChildProductDraft({
      ...baseInput,
      person: {
        ...baseInput.person,
        birthDate: "not-a-date",
      },
    });

    expect(result).toMatchObject({
      ok: false,
      kind: "loveMarriageChild",
      error: {
        code: "LOVE_MARRIAGE_CHILD_GENERATION_FAILED",
      },
    });
  });

  it("does not expose forbidden or internal wording in visible draft fields", async () => {
    const result = await generateLoveMarriageChildProductDraft(baseInput);
    const visibleText = collectVisibleDraftText(result);
    const forbiddenMarkers = [
      "무조건 헤어짐",
      "반드시 결혼",
      "결혼 못한다",
      "이혼한다",
      "배우자복 없다",
      "자식복 없다",
      "임신",
      "출산 확정",
      "건강 진단",
      "재회 확률",
      "상대가 돌아온다",
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
    expect(dispatcherSource).toContain("loveMarriageChild: handleLoveMarriageChildGeneration");
  });
});
