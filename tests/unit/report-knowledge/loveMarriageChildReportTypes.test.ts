import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/lib/report-knowledge/loveMarriageChildReportTypes.ts"),
  "utf8",
);

describe("loveMarriageChildReportTypes source contract", () => {
  it("defines the love marriage child evidence packet identity and person context", () => {
    for (const marker of [
      'LoveMarriageChildReportProductType = "love_marriage_child"',
      "interface LoveMarriageChildReportEvidencePacket",
      "readonly productType: LoveMarriageChildReportProductType",
      'readonly productVersion: "v1"',
      "readonly personContext: LoveMarriageChildPersonContext",
      "readonly name: string",
      "readonly gender?: LoveMarriageChildGender | null",
      "readonly mbtiType?: string | null",
      "readonly relationshipStatus?: UserRelationshipStatus | null",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("keeps the required myeongli evidence fields explicit", () => {
    for (const marker of [
      "interface LoveMarriageChildSajuBasis",
      "readonly dayMaster: HeavenlyStem",
      "readonly dayPillar: string",
      "readonly dayBranch: EarthlyBranch",
      "readonly spousePalaceSignal: LoveMarriageChildSpousePalaceSignal | null",
      "readonly loveTenGodSignals: readonly LoveMarriageChildTenGodSignal[]",
      "readonly marriageTenGodSignals: readonly LoveMarriageChildTenGodSignal[]",
      "readonly parentingTenGodSignals: readonly LoveMarriageChildTenGodSignal[]",
      "readonly attractionSignals: readonly LoveMarriageChildSajuSignal[]",
      "readonly conflictSignals: readonly LoveMarriageChildSajuSignal[]",
      "readonly supportSignals: readonly LoveMarriageChildSajuSignal[]",
      "readonly relationInteractionSignals: readonly LoveMarriageChildSajuSignal[]",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("keeps the required MBTI and bridge evidence fields explicit", () => {
    for (const marker of [
      "interface LoveMarriageChildMbtiBasis",
      "readonly reportUseCases: readonly string[]",
      "readonly loveTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly marriageTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly parentingTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly childRoleTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly relationshipTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly communicationTraits: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly risks: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly growth: readonly LoveMarriageChildMbtiTraitEvidence[]",
      "readonly bridgeEvidence?: LoveMarriageChildBridgeEvidence",
      'readonly productKey: "loveMarriageChild"',
      "readonly timingHints: readonly LoveMarriageChildTimingHint[]",
      "readonly safetyNotes: readonly string[]",
    ]) {
      expect(source).toContain(marker);
    }
  });

  it("documents forbidden relationship claims and avoids unsafe naming", () => {
    for (const marker of [
      "LOVE_MARRIAGE_CHILD_FORBIDDEN_EXPRESSIONS",
      "무조건 헤어짐",
      "반드시 결혼",
      "결혼 못한다",
      "이혼한다",
      "배우자복 없다",
      "자식복 없다",
      "임신/출산/건강 진단",
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
});
