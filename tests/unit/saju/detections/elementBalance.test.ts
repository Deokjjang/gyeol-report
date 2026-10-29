import { describe, expect, it } from "vitest";
import { analyzeChartDetections, ELEMENT_ORDER, judgeElementBalance, natalEntries } from "@/lib/saju/detections";
import { calculateSaju } from "@/lib/saju/calculateSaju";
import { chartOf } from "./chartFixture";

describe("오행 강약 단일 판단(P3, 정책 §6)", () => {
  it("c1 丙子 己亥 丁丑 乙巳: 월지 亥(물) 두 배 → 물이 가장 강함(많음), 쇠가 가장 약함(부족), 불은 보통", () => {
    const b = analyzeChartDetections(chartOf("丙子 己亥 丁丑 乙巳")).elementBalance;
    expect(b.scores).toEqual({ WOOD: 1.6, FIRE: 3.6, EARTH: 2.9, METAL: 0.2, WATER: 5.1 });
    expect(b.strongest).toMatchObject({ element: "WATER", level: "많음" });
    expect(b.weakest).toMatchObject({ element: "METAL", level: "부족" });
    expect(b.status.FIRE).toBe("보통");
    expect(b.strongest.reason).toContain("태어난 달의 주인 기운이 물이라");
  });

  it("많음은 언제나 가장 강한 기운 하나뿐이고, 점수 0이면 없음", () => {
    for (const text of ["甲寅 丙寅 甲午 丙寅", "庚申 庚辰 庚申 甲申", "壬子 癸亥 壬子 癸亥", "丁巳 丙午 丁未 丙午"]) {
      const b = judgeElementBalance(natalEntries(chartOf(text)));
      expect(ELEMENT_ORDER.filter(e => b.status[e] === "많음").length).toBeLessThanOrEqual(1);
      for (const e of ELEMENT_ORDER) if (b.scores[e] === 0) expect(b.status[e]).toBe("없음");
      expect(b.scores[b.strongest.element]).toBe(Math.max(...ELEMENT_ORDER.map(e => b.scores[e])));
    }
  });

  it("시간 미상이면 시주를 빼고 계산한다", () => {
    const known = calculateSaju({ birthDate: "1989-03-21", birthTime: "13:00", birthTimeUnknown: false, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    const unknown = calculateSaju({ birthDate: "1989-03-21", birthTime: "", birthTimeUnknown: true, approximateBirthTimeSlot: "" as never, calendarType: "SOLAR", gender: "FEMALE", timezone: "Asia/Seoul" });
    expect(analyzeChartDetections(unknown).elementBalance).toEqual(judgeElementBalance(natalEntries(known).filter(e => e.position !== "hour")));
  });
});
