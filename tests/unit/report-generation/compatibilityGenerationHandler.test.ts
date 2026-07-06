import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { generateCompatibilityProductDraft } from "../../../src/lib/report-generation/compatibilityGenerationHandler";
import { validateCompatibilityReportDraft } from "../../../src/lib/report-generation/compatibilityReportDraftValidator";
import {
  deriveAllowedCompatibilityMbtiTerms,
  deriveAllowedCompatibilitySajuTerms,
} from "../../../src/lib/report-generation/openaiCompatibilityReportWriterPrompt";
import type {
  CompatibilityGenerationInput,
  CompatibilityRelationshipType,
} from "../../../src/lib/report-generation/reportInputAdapter";
import { COMPATIBILITY_RELATIONSHIP_TYPES } from "../../../src/lib/report-generation/reportInputTypes";

const sourcePath = join(
  process.cwd(),
  "src/lib/report-generation/compatibilityGenerationHandler.ts",
);
const dispatcherSourcePath = join(
  process.cwd(),
  "src/lib/report-generation/productGenerationDispatcher.ts",
);
const source = readFileSync(sourcePath, "utf8");
const dispatcherSource = readFileSync(dispatcherSourcePath, "utf8");

const basePerson = {
  name: "덕민",
  birthDate: "1999-07-31",
  birthTime: "07:30",
  birthTimeUnknown: false,
  approximateBirthTimeSlot: "",
  gender: "MALE",
  mbtiType: "ENTJ",
  calendarType: "solar",
  timezone: "Asia/Seoul",
} as const;

function makeInput(
  relationshipType: CompatibilityRelationshipType = "love",
): CompatibilityGenerationInput {
  return {
    kind: "compatibility",
    productKey: "saju_mbti_compatibility",
    productSlug: "compatibility",
    relationshipType,
    personA: basePerson,
    personB: {
      ...basePerson,
      name: "소담",
      birthDate: "1996-12-06",
      birthTime: "14:15",
      gender: "FEMALE",
      mbtiType: "INTP",
    },
    productOptions: {},
  };
}

function collectVisibleDraftText(result: Awaited<ReturnType<typeof generateCompatibilityProductDraft>>): string {
  if (!result.ok) {
    return "";
  }

  const draft = result.draft;

  return [
    draft.openingTitle,
    draft.openingSummary,
    draft.coreLine,
    draft.relationshipAnalysis.connectionSummary,
    draft.relationshipAnalysis.firstImpression,
    draft.relationshipAnalysis.stayingPower,
    ...draft.relationshipAnalysis.frictionPoints,
    draft.relationshipAnalysis.categoryReading,
    draft.relationshipAnalysis.aToBFatigue,
    draft.relationshipAnalysis.bToAFatigue,
    draft.relationshipAnalysis.communicationRecovery,
    draft.relationshipAnalysis.roleMoneyLifeRhythm,
    ...draft.relationshipAnalysis.categorySpecificAdvice,
    ...draft.relationshipAnalysis.timingCautions,
    ...draft.relationshipAnalysis.repairStrategy,
    ...draft.relationshipAnalysis.riskManagement,
    ...draft.chapters.flatMap((chapter) => [
      chapter.title,
      chapter.headline,
      chapter.body,
      ...chapter.directHitScenes,
      ...chapter.practicalAdvice,
    ]),
    ...draft.finalAdvice,
    ...draft.safetyNotes,
  ].join("\n");
}

describe("compatibility generation handler", () => {
  it("builds a validated compatibility draft and evidence packet", async () => {
    const result = await generateCompatibilityProductDraft(makeInput());

    expect(result).toMatchObject({
      ok: true,
      kind: "compatibility",
      draft: {
        version: "compatibility_v1_draft",
        productType: "saju_mbti_compatibility",
        productVersion: "1.0",
        relationshipType: "love",
      },
      evidencePacket: {
        productType: "saju_mbti_compatibility",
        relationshipType: "love",
      },
    });
    if (!result.ok) return;

    const validation = validateCompatibilityReportDraft(result.draft, {
      allowedSajuTerms: deriveAllowedCompatibilitySajuTerms(result.evidencePacket),
      allowedMbtiTerms: deriveAllowedCompatibilityMbtiTerms(result.evidencePacket),
    });

    expect(validation.ok).toBe(true);
  });

  it("keeps all seven relationshipType values in generated evidence and draft", async () => {
    for (const relationshipType of COMPATIBILITY_RELATIONSHIP_TYPES) {
      const result = await generateCompatibilityProductDraft(
        makeInput(relationshipType),
      );

      expect(result).toMatchObject({
        ok: true,
        kind: "compatibility",
        draft: {
          relationshipType,
        },
        evidencePacket: {
          relationshipType,
        },
      });
    }
  });

  it("returns generation failure for invalid A/B input", async () => {
    const result = await generateCompatibilityProductDraft({
      ...makeInput(),
      personA: {
        ...basePerson,
        birthDate: "not-a-date",
      },
    });

    expect(result).toMatchObject({
      ok: false,
      kind: "compatibility",
      error: {
        code: "COMPATIBILITY_GENERATION_FAILED",
      },
    });
  });

  it("does not expose forbidden or internal wording in visible draft fields", async () => {
    const result = await generateCompatibilityProductDraft(makeInput());
    const visibleText = collectVisibleDraftText(result);
    const forbiddenMarkers = [
      "무조건 헤어짐",
      "반드시 결혼",
      "절대 안 맞음",
      "파국",
      "이혼한다",
      "상대가 돌아온다",
      "재회 확률",
      "수익 보장",
      "사업 성공 보장",
      "질병",
      "evidence",
      "debug",
      "draft",
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
    expect(dispatcherSource).toContain("compatibility: handleCompatibilityGeneration");
  });
});
