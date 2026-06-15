import { describe, expect, it } from "vitest";

import { buildSajuSymbolicNickname } from "../../../src/lib/report-knowledge/sajuSymbolicNickname";
import type { ComputedSajuFacts } from "../../../src/lib/report-knowledge/sajuComputedFactsTypes";

const baseFacts = {
  dayMaster: "갑",
  dayPillar: "갑신",
  yearPillar: "기묘",
  monthPillar: "신미",
  hourPillar: "무진",
  heavenlyStems: ["기", "신", "갑", "무"],
  earthlyBranches: ["묘", "미", "신", "진"],
  fiveElementCounts: { wood: 2, fire: 0, earth: 4, metal: 2, water: 0 },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  usefulElements: ["water", "wood"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
  ],
  specialPatterns: ["jaeda_sinyak"],
  sinsal: ["hyeonchim"],
  gwiin: ["jaego"],
} as const satisfies ComputedSajuFacts;

describe("saju symbolic nickname", () => {
  it("builds a strong day-pillar image for 갑신", () => {
    const nickname = buildSajuSymbolicNickname(baseFacts);

    expect(nickname).toMatchObject({
      title: "큰 나무가 날카로운 금 위에 선 사람",
    });
    expect(nickname?.subtitle).toContain("완충과 회복");
    expect(nickname?.components.map((component) => component.label)).toEqual(
      expect.arrayContaining(["갑신일주", "신(원숭이)"]),
    );
  });

  it("builds a winter water pig image for water-heavy 해 fixtures", () => {
    const nickname = buildSajuSymbolicNickname({
      ...baseFacts,
      dayMaster: "계",
      dayPillar: "계해",
      yearPillar: "계유",
      monthPillar: "신해",
      hourPillar: "임자",
      earthlyBranches: ["유", "해", "해", "자"],
      fiveElementCounts: { wood: 1, fire: 0, earth: 0, metal: 2, water: 5 },
      excessiveElements: ["water"],
      missingElements: ["fire"],
      specialPatterns: ["water_excess_floats_wood"],
      sinsal: ["hwagae"],
      gwiin: ["munchang"],
    });

    expect(nickname?.title).toBe("깊은 물을 품은 겨울 돼지의 감각");
    expect(nickname?.subtitle).toContain("감정과 직관");
    expect(JSON.stringify(nickname)).toContain("돼지");
  });

  it("builds a noon horse image for fire-heavy 오 fixtures", () => {
    const nickname = buildSajuSymbolicNickname({
      ...baseFacts,
      dayMaster: "병",
      dayPillar: "병오",
      yearPillar: "갑오",
      monthPillar: "병오",
      hourPillar: "정사",
      earthlyBranches: ["오", "오", "오", "사"],
      fiveElementCounts: { wood: 1, fire: 6, earth: 1, metal: 0, water: 0 },
      excessiveElements: ["fire"],
      missingElements: ["metal", "water"],
      specialPatterns: ["wood_excess_feeds_fire"],
      sinsal: ["dohwa"],
      gwiin: ["taegeuk"],
    });

    expect(nickname?.title).toBe("한낮의 말처럼 앞으로 달리는 사람");
    expect(nickname?.subtitle).toContain("속도 조절");
    expect(JSON.stringify(nickname)).toContain("말");
  });

  it("does not invent absent branch symbols", () => {
    const nickname = buildSajuSymbolicNickname(baseFacts);
    const serialized = JSON.stringify(nickname);

    expect(serialized).not.toContain("돼지");
    expect(serialized).not.toContain("말");
  });
});
