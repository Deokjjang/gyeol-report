import { describe, expect, it } from "vitest";
import { resolveBirthTimeCalculation } from "@/lib/saju/birthTimePrecision";
import { birthTimeUncertaintyNotice } from "@/lib/saju/birthTimeUncertaintyNotice";

describe("절입일 × 시간 미상 안내", () => {
  it("월주 두 후보와 절기가 바뀐 시각을 밝힌다", () => {
    const n = birthTimeUncertaintyNotice(resolveBirthTimeCalculation({ birthDate: "2024-03-05", birthTimeUnknown: true }))!;
    expect(n.pillars).toEqual(["month"]);
    expect(n.candidates.month).toHaveLength(2);
    expect(n.message).toContain(`${n.candidates.month![0]}월 또는 ${n.candidates.month![1]}월`);
    expect(n.boundaryKst).toMatch(/^(오전|오후) \d{1,2}시 \d{1,2}분$/);
    expect(n.message).toContain(n.boundaryKst!);
    expect(n.message).not.toMatch(/[甲-龥]/); // 한자 없이
  });
  it("입춘이면 연주·월주 둘 다", () => {
    const n = birthTimeUncertaintyNotice(resolveBirthTimeCalculation({ birthDate: "2024-02-04", birthTimeUnknown: true }))!;
    expect(n.pillars).toEqual(["year", "month"]);
    expect(n.message).toContain("연주(태어난 해의 기운)가");
  });
  it("평일·정확한 시각이면 안내 없음", () => {
    expect(birthTimeUncertaintyNotice(resolveBirthTimeCalculation({ birthDate: "1996-12-06", birthTimeUnknown: true }))).toBeNull();
    expect(birthTimeUncertaintyNotice(resolveBirthTimeCalculation({ birthDate: "2024-03-05", birthTime: "08:00" }))).toBeNull();
  });
});
