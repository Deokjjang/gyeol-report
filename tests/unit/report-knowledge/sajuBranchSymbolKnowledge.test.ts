import { describe, expect, it } from "vitest";

import {
  assertSajuBranchSymbolSafety,
  getSajuBranchSymbolEntry,
  SAJU_BRANCH_SYMBOL_KNOWLEDGE,
} from "../../../src/lib/report-knowledge/sajuBranchSymbolKnowledge";

describe("saju branch symbol knowledge", () => {
  it("covers all twelve branches with animal element and season symbols", () => {
    expect(SAJU_BRANCH_SYMBOL_KNOWLEDGE.map((entry) => entry.branch)).toEqual([
      "子",
      "丑",
      "寅",
      "卯",
      "辰",
      "巳",
      "午",
      "未",
      "申",
      "酉",
      "戌",
      "亥",
    ]);

    for (const entry of SAJU_BRANCH_SYMBOL_KNOWLEDGE) {
      expect(entry.animalKo).toBeTruthy();
      expect(entry.symbolicImage.length).toBeGreaterThan(30);
      expect(entry.positiveKeywords.length).toBeGreaterThanOrEqual(2);
      expect(entry.cautionKeywords.length).toBeGreaterThanOrEqual(2);
      expect(entry.sceneSeeds.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps key branch symbol meanings vivid but not deterministic", () => {
    expect(getSajuBranchSymbolEntry("亥")).toMatchObject({
      animalKo: "돼지",
      element: "water",
      seasonKo: "겨울 시작",
    });
    expect(getSajuBranchSymbolEntry("亥")?.symbolicImage).toContain("겨울 물");
    expect(getSajuBranchSymbolEntry("申")).toMatchObject({
      animalKo: "원숭이",
      element: "metal",
    });
    expect(getSajuBranchSymbolEntry("申")?.symbolicImage).toContain("기민함");
    expect(getSajuBranchSymbolEntry("午")).toMatchObject({
      animalKo: "말",
      element: "fire",
    });
    expect(getSajuBranchSymbolEntry("午")?.symbolicImage).toContain("한낮");
  });

  it("contains no unsafe claims", () => {
    expect(() => assertSajuBranchSymbolSafety()).not.toThrow();
    const serialized = JSON.stringify(SAJU_BRANCH_SYMBOL_KNOWLEDGE);

    for (const blocked of [
      "100%",
      "반드시",
      "무조건",
      "운명 확정",
      "수익 보장",
      "성공 보장",
      "진단",
      "치료",
    ]) {
      expect(serialized).not.toContain(blocked);
    }
  });
});
