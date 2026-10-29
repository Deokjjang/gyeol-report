import { describe, expect, it } from "vitest";
import { conditionClauses, conditionsHold, type ConditionCtx } from "@/lib/brief/conditions";
import { analyzeChartDetections, type ChartPosition } from "@/lib/saju/detections";
import { chartOf } from "../saju/detections/chartFixture";

const ctxOf = (text: string, positions: ChartPosition[] = [], hitIds: string[] = []): ConditionCtx => {
  const saju = chartOf(text);
  return { saju, det: analyzeChartDetections(saju), positions, hitIds: new Set(hitIds) };
};

describe("팩폭 자리 조건 대조(P3 A4)", () => {
  const c1 = ctxOf("丙子 己亥 丁丑 乙巳", ["day"], ["shinsal:BAEKHODAESAL"]);

  it("c1: 괴강·양인이 없으니 '괴강·양인과 함께 있으면' 문장은 고르지 않는다", () => {
    expect(conditionsHold("센 말이 먼저 나갑니다. 급할 때 내뱉은 한마디가 상대에게 오래 남으니, 괴강·양인과 함께 있으면 말의 속도를 한 박자 늦추세요.", c1)).toBe(false);
    expect(conditionsHold("센 말이 먼저 나갑니다. 괴강·양인과 함께 있으면 말의 속도를 늦추세요.", { ...c1, hitIds: new Set(["shinsal:YANGIN"]) })).toBe(true);
  });

  it("c1: 편인(乙, 시간)은 식신(己 월간·丑 일지) 옆이 아니다", () => {
    expect(conditionsHold("편인이 바로 옆에서 식신을 누르면 고전이 도식이라 부른 자리입니다.", c1)).toBe(false);
    // 편인(乙 월간)이 식신(己 일지 본기... 丁 일간 기준 己=식신) 옆에 붙은 원국
    expect(conditionsHold("편인이 바로 옆에서 식신을 누르면 고전이 도식이라 부른 자리입니다.", ctxOf("丙子 乙未 丁丑 庚子"))).toBe(true);
  });

  it("특정 자리의 글자: '일지에 자수가 있으면'", () => {
    expect(conditionsHold("일지에 자수가 있으면 배우자가 이 벽을 가장 크게 느낍니다.", ctxOf("丙子 己亥 丁丑 乙巳", ["year"]))).toBe(false);
    expect(conditionsHold("일지에 자수가 있으면 배우자가 이 벽을 가장 크게 느낍니다.", ctxOf("丙寅 己亥 甲子 乙巳", ["day"]))).toBe(true);
  });

  it("자리 + 선택지(거나): '토 글자가 많거나 일지에 있으면'", () => {
    const line = "토 글자가 많거나 일지에 있으면 가까운 사람이 답답해합니다.";
    expect(conditionsHold(line, ctxOf("丙子 己亥 丁丑 乙巳", ["month"]))).toBe(false);
    expect(conditionsHold(line, ctxOf("丙子 己亥 丁丑 乙巳", ["day"]))).toBe(true);
  });

  it("관계·계절·시간 미상", () => {
    expect(conditionsHold("오화가 옆에 와 자오충이 되면 감정이 갑자기 튑니다.", c1)).toBe(false);
    expect(conditionsHold("오화가 옆에 와 자오충이 되면 감정이 갑자기 튑니다.", ctxOf("甲子 庚午 丙寅 丙申"))).toBe(true);
    expect(conditionsHold("봄생이거나 나무 글자가 많으면 남을 챙기다 자기 몫이 사라집니다.", c1)).toBe(false);
    expect(conditionsHold("시지에 놓이면 늦게 꽃핍니다.", ctxOf("丙子 己亥 丁丑", ["day"]))).toBe(false);
  });

  it("조건이 없거나 알아보지 못한 조건은 통과", () => {
    expect(conditionsHold("속을 너무 감춰 가까운 사람도 당신을 계산적이라고 오해합니다.", c1)).toBe(true);
    expect(conditionClauses("움직임이 많을수록 한 가지는 끝까지 붙드는 장치가 필요합니다.")).toHaveLength(0);
  });
});
