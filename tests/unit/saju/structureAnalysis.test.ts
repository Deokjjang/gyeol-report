import { describe, expect, it } from "vitest";

import { analyzeSajuStructure } from "@/lib/saju/structureAnalysis";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import type { SajuCalcInput } from "@/lib/saju/types";

const fixtureInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
} as const satisfies SajuCalcInput;

const structureAnalysisNotice =
  "신강신약과 구조 후보는 단정이 아니라 현재 계산된 오행·십성 신호를 바탕으로 한 해석 기준입니다.";

const forbiddenWords = [
  "무" + "조건",
  "반" + "드시",
  "운" + "명",
  "죽" + "음",
  "사고가 " + "난다",
  "바람기가 " + "있다",
  "돈복이 " + "있다",
  "결혼" + "한다",
  "망" + "한다",
  "절" + "대",
  "항" + "상",
  "틀" + "렸다",
] as const;

function getFixtureAnalysis() {
  return analyzeSajuStructure(calculateSaju(fixtureInput));
}

describe("analyzeSajuStructure", () => {
  it("produces day master strength analysis", () => {
    const result = getFixtureAnalysis();

    expect(result.dayMasterStrength.labelKo).toBeTruthy();
    expect(result.dayMasterStrength.summaryKo).toBeTruthy();
    expect(result.dayMasterStrength.confidence).toBe("MEDIUM");
    expect(result.dayMasterStrength.evidence.map((item) => item.keyKo)).toEqual([
      "비겁",
      "인성",
      "식상",
      "재성",
      "관성",
    ]);
  });

  it("uses clean score formatting", () => {
    const result = getFixtureAnalysis();
    const text = JSON.stringify(result.dayMasterStrength.evidence);

    expect(text).not.toContain("0.7999999999999999");
    expect(result.dayMasterStrength.evidence.map((item) => item.valueKo)).toEqual(
      ["2.3", "1.9", "0.8", "1.2", "0.4"],
    );
  });

  it("detects expected fixture patterns", () => {
    const result = getFixtureAnalysis();
    const codes = result.patterns.map((item) => item.code);

    expect(codes).toContain("RESOURCE_HEAVY");
    expect(codes).toContain("PEER_HEAVY");
    expect(codes).toContain("MIXED_OFFICER_KILLING");
    expect(codes).toContain("FIRE_METAL_TENSION");
    expect(codes).toContain("WATER_WEAK_RECOVERY_NEEDED");
  });

  it("returns pattern labels, summaries, confidence, and evidence", () => {
    const result = getFixtureAnalysis();

    for (const pattern of result.patterns) {
      expect(pattern.labelKo).toBeTruthy();
      expect(pattern.summaryKo).toBeTruthy();
      expect(pattern.confidence).toBeTruthy();
      expect(pattern.evidence.length).toBeGreaterThan(0);
    }
  });

  it("includes strength and pattern keywords in summary", () => {
    const result = getFixtureAnalysis();

    expect(result.summary.titleKo).toBe("사주 구조 요약");
    expect(result.summary.bodyKo).toBeTruthy();
    expect(result.summary.keywordsKo.length).toBeGreaterThan(0);
    expect(result.summary.keywordsKo).toContain(
      result.dayMasterStrength.labelKo,
    );
  });

  it("includes structure analysis notice", () => {
    const result = getFixtureAnalysis();

    expect(result.notices).toContain(structureAnalysisNotice);
  });

  it("avoids unsafe wording in serialized output", () => {
    const result = getFixtureAnalysis();
    const text = JSON.stringify(result);

    for (const word of forbiddenWords) {
      expect(text).not.toContain(word);
    }
  });

  it("returns deterministic output", () => {
    const saju = calculateSaju(fixtureInput);

    expect(analyzeSajuStructure(saju)).toEqual(analyzeSajuStructure(saju));
  });
});
