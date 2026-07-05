import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(
    process.cwd(),
    "src/lib/report-generation/loveMarriageChildReportDraftTypes.ts",
  ),
  "utf8",
);

describe("loveMarriageChildReportDraftTypes source contract", () => {
  it("defines the launch draft identity and opening fields", () => {
    for (const marker of [
      "interface LoveMarriageChildReportDraft",
      'readonly version: "v1"',
      'readonly productType: "love_marriage_child"',
      'readonly productVersion: "v1"',
      "readonly personLabel: string",
      "readonly headline: string",
      "readonly openingSummary: string",
      "readonly evidencePacket?: LoveMarriageChildReportEvidencePacket",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("keeps the required result sections explicit", () => {
    for (const marker of [
      "readonly loveStyle: LoveMarriageChildTextSection",
      "readonly attractionPattern: LoveMarriageChildPatternSection",
      "readonly loveStrengths: LoveMarriageChildTextSection",
      "readonly loveFriction: LoveMarriageChildPatternSection",
      "readonly marriageRhythm: LoveMarriageChildTextSection",
      "readonly householdMoneyAndRoleSplit: LoveMarriageChildTextSection",
      "readonly conflictRecovery: LoveMarriageChildTextSection",
      "readonly parentMode: LoveMarriageChildParentModeSection",
      "readonly breakupReunionPattern: LoveMarriageChildBreakupReunionPatternSection",
      "readonly relationshipTimingHints: readonly LoveMarriageChildRelationshipTimingHint[]",
      "readonly actionPlan: readonly LoveMarriageChildActionPlanItem[]",
      "readonly riskManagement: readonly LoveMarriageChildRiskManagementItem[]",
      "readonly safetyNotes: readonly string[]",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("uses safe names for parenting and breakup reunion sections", () => {
    for (const marker of [
      "LoveMarriageChildParentModeSection",
      "readonly parentingRolePattern: readonly string[]",
      "readonly avoidProjection: readonly string[]",
      "LoveMarriageChildBreakupReunionPatternSection",
      "readonly myLoop: readonly string[]",
      "readonly emotionalProcessing: readonly string[]",
      "readonly repairBoundary: readonly string[]",
    ]) {
      expect(source).toContain(marker);
    }

    for (const forbiddenName of [
      "childFortune",
      "childDestiny",
      "childAnalysis",
      "reunionProbability",
      "willBreakup",
    ]) {
      expect(source).not.toContain(forbiddenName);
    }
  });

  it("keeps action plan labels relationship-specific without deterministic claims", () => {
    for (const marker of [
      "LoveMarriageChildActionPlanLabel",
      '"연애"',
      '"결혼"',
      '"갈등 회복"',
      '"부모 역할"',
      '"관계 정리"',
      '"생활 리듬"',
    ]) {
      expect(source).toContain(marker);
    }

    for (const forbiddenClaim of [
      "무조건 헤어짐",
      "반드시 결혼",
      "결혼 못한다",
      "이혼한다",
      "배우자복 없다",
      "자식복 없다",
      "임신/출산/건강 진단",
    ]) {
      expect(source).not.toContain(forbiddenClaim);
    }
  });
});
