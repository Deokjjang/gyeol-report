import { describe, expect, it } from "vitest";

import { calculateSaju } from "@/lib/saju/calculateSaju";
import type { SajuCalcInput } from "@/lib/saju/types";

const baseInput: SajuCalcInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
};

describe("calculateSaju", () => {
  it("calculates full Saju with known birth time", () => {
    const result = calculateSaju(baseInput);

    expect(result.input).toEqual(baseInput);
    expect(result.converted?.solarDate).toBe("2024-02-04");
    expect(result.pillars).toEqual({
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "丙", branch: "申" },
      hour: { stem: "丁", branch: "酉" },
    });
    expect(result.dayMaster).toBe("丙");
    expect(result.notices).toEqual([]);
    expect(result.elements.visible).toBeDefined();
    expect(result.elements.weighted).toBeDefined();
    expect(result.elements.labels).toBeDefined();
    expect(result.tenGods.stems).toBeDefined();
    expect(result.tenGods.hiddenStems).toBeDefined();
    expect(result.tenGods.distribution).toBeDefined();
    expect(result.yinYang).toBeDefined();
    expect(result.relations.stemCombinations).toBeDefined();
    expect(result.relations.branchCombinations).toBeDefined();
    expect(result.relations.branchClashes).toBeDefined();
  });

  it("includes structure analysis result", () => {
    const result = calculateSaju(baseInput);

    expect(result.structureAnalysis).toBeDefined();
    expect(result.structureAnalysis.dayMasterStrength.labelKo).toBeTruthy();
    expect(result.structureAnalysis.dayMasterStrength.summaryKo).toBeTruthy();
    expect(result.structureAnalysis.patterns.length).toBeGreaterThan(0);
    expect(result.structureAnalysis.summary.titleKo).toBe("사주 구조 요약");
    expect(result.structureAnalysis.notices.length).toBeGreaterThan(0);
  });

  it("includes deterministic structure analysis evidence keys", () => {
    const result = calculateSaju(baseInput);

    expect(
      result.structureAnalysis.dayMasterStrength.evidence.map(
        (item) => item.keyKo,
      ),
    ).toEqual(["비겁", "인성", "식상", "재성", "관성"]);
  });

  it("does not expose long float artifacts in structure analysis", () => {
    const result = calculateSaju(baseInput);

    expect(JSON.stringify(result.structureAnalysis)).not.toContain(
      "0.7999999999999999",
    );
  });

  it("returns deterministic structure analysis through calculateSaju", () => {
    expect(calculateSaju(baseInput).structureAnalysis).toEqual(
      calculateSaju(baseInput).structureAnalysis,
    );
  });

  it("omits hour pillar when birth time is unknown", () => {
    const input: SajuCalcInput = {
      ...baseInput,
      birthTime: undefined,
      birthTimeUnknown: true,
    };
    const result = calculateSaju(input);

    expect(result.pillars.hour).toBeUndefined();
    expect(result.notices).toContain(
      "출생시간을 모르면 년·월·일주 중심으로 분석됩니다.",
    );
    expect(result.pillars.year).toBeDefined();
    expect(result.pillars.month).toBeDefined();
    expect(result.pillars.day).toBeDefined();
  });

  it("uses noon for year and month boundary when birth time is unknown", () => {
    const input: SajuCalcInput = {
      birthDate: "2024-02-04",
      birthTimeUnknown: true,
      calendarType: "SOLAR",
      gender: "MALE",
      timezone: "Asia/Seoul",
    };
    const result = calculateSaju(input);

    expect(result.pillars.year).toEqual({ stem: "癸", branch: "卯" });
    expect(result.pillars.month).toEqual({ stem: "乙", branch: "丑" });
  });

  it("uses new year and month at the IPCHUN boundary with known birth time", () => {
    const result = calculateSaju(baseInput);

    expect(result.pillars.year).toEqual({ stem: "甲", branch: "辰" });
    expect(result.pillars.month).toEqual({ stem: "丙", branch: "寅" });
  });

  it("uses verified calendar engine pillars for broad-year production input", () => {
    const result = calculateSaju({
      birthDate: "1996-12-06",
      birthTime: "14:15",
      birthTimeUnknown: false,
      calendarType: "SOLAR",
      gender: "FEMALE",
      timezone: "Asia/Seoul",
    });

    expect(result.pillars).toEqual({
      year: { stem: "丙", branch: "子" },
      month: { stem: "己", branch: "亥" },
      day: { stem: "丁", branch: "丑" },
      hour: { stem: "丁", branch: "未" },
    });
    expect(result.dayMaster).toBe("丁");
  });

  it("throws for lunar calendar", () => {
    const input: SajuCalcInput = {
      ...baseInput,
      calendarType: "LUNAR",
    };

    expect(() => calculateSaju(input)).toThrow(
      "Lunar calendar conversion is not supported in V1.",
    );
  });

  it("throws for non-Korea timezone", () => {
    const input = {
      ...baseInput,
      timezone: "UTC",
    } as unknown as SajuCalcInput;

    expect(() => calculateSaju(input)).toThrow(
      "Only Asia/Seoul timezone is supported.",
    );
  });

  it("throws when known birth time is missing", () => {
    const input: SajuCalcInput = {
      ...baseInput,
      birthTime: undefined,
      birthTimeUnknown: false,
    };

    expect(() => calculateSaju(input)).toThrow(
      "Birth time is required when birthTimeUnknown is false.",
    );
  });

  it("propagates invalid birth date errors", () => {
    const input: SajuCalcInput = {
      ...baseInput,
      birthDate: "2024-02-30",
    };

    expect(() => calculateSaju(input)).toThrow("Invalid calendar date.");
  });

  it("propagates invalid birth time errors", () => {
    const input: SajuCalcInput = {
      ...baseInput,
      birthTime: "24:00",
    };

    expect(() => calculateSaju(input)).toThrow(
      "Invalid birth time format. Expected HH:mm.",
    );
  });

  it("returns relation values as string arrays", () => {
    const result = calculateSaju(baseInput);

    for (const value of result.relations.stemCombinations) {
      expect(typeof value).toBe("string");
    }
    for (const value of result.relations.branchCombinations) {
      expect(typeof value).toBe("string");
    }
    for (const value of result.relations.branchClashes) {
      expect(typeof value).toBe("string");
    }
  });

  it("returns deterministic full Saju results", () => {
    expect(calculateSaju(baseInput)).toEqual(calculateSaju(baseInput));
  });
});
