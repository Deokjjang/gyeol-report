import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { calculateSaju } from "@/lib/saju/calculateSaju";
import type { Pillar, SajuCalcInput } from "@/lib/saju/types";

const baseInput: SajuCalcInput = {
  birthDate: "2024-02-04",
  birthTime: "17:27",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "MALE",
  timezone: "Asia/Seoul",
};

const broadYearProductionInput: SajuCalcInput = {
  birthDate: "1996-12-06",
  birthTime: "14:15",
  birthTimeUnknown: false,
  calendarType: "SOLAR",
  gender: "FEMALE",
  timezone: "Asia/Seoul",
};

function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

function expectHourPillar(result: ReturnType<typeof calculateSaju>): Pillar {
  const { hour } = result.pillars;

  expect(hour).toBeDefined();
  if (!hour) {
    throw new Error("Expected hour pillar.");
  }

  return hour;
}

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
    const result = calculateSaju(broadYearProductionInput);

    expect(result.pillars).toEqual({
      year: { stem: "丙", branch: "子" },
      month: { stem: "己", branch: "亥" },
      day: { stem: "丁", branch: "丑" },
      hour: { stem: "丁", branch: "未" },
    });
    expect(formatPillar(result.pillars.year)).toBe("丙子");
    expect(formatPillar(result.pillars.month)).toBe("己亥");
    expect(formatPillar(result.pillars.day)).toBe("丁丑");
    expect(formatPillar(expectHourPillar(result))).toBe("丁未");
    expect(result.dayMaster).toBe("丁");
    expect(result.input.timezone).toBe("Asia/Seoul");
  });

  it("uses verified calendar engine year month and day when 1996 birth time is unknown", () => {
    const result = calculateSaju({
      ...broadYearProductionInput,
      birthTime: undefined,
      birthTimeUnknown: true,
    });
    const serializedResult = JSON.stringify(result);

    expect(result.input.timezone).toBe("Asia/Seoul");
    expect(result.pillars).toEqual({
      year: { stem: "丙", branch: "子" },
      month: { stem: "己", branch: "亥" },
      day: { stem: "丁", branch: "丑" },
    });
    expect(result.pillars.hour).toBeUndefined();
    expect(result.notices).toContain(
      "출생시간을 모르면 년·월·일주 중심으로 분석됩니다.",
    );
    expect(serializedResult).not.toContain("SOLAR_TERM_YEAR_UNSUPPORTED");
  });

  it("keeps verified solar-term table fixture for 2024 IPCHUN boundary", () => {
    const result = calculateSaju(baseInput);
    const serializedResult = JSON.stringify(result);

    expect(result.input.timezone).toBe("Asia/Seoul");
    expect(result.pillars).toEqual({
      year: { stem: "甲", branch: "辰" },
      month: { stem: "丙", branch: "寅" },
      day: { stem: "丙", branch: "申" },
      hour: { stem: "丁", branch: "酉" },
    });
    expect(serializedResult).not.toContain("SOLAR_TERM_YEAR_UNSUPPORTED");
  });

  it("handles 1996 Asia/Seoul time-pillar boundary smoke cases", () => {
    const birthTimes = ["00:30", "01:30", "14:15", "23:30"] as const;
    const results = birthTimes.map((birthTime) =>
      calculateSaju({
        ...broadYearProductionInput,
        birthTime,
      }),
    );
    const hourCodes = results.map((result) => formatPillar(expectHourPillar(result)));

    for (const result of results) {
      expect(result.input.timezone).toBe("Asia/Seoul");
      expect(result.pillars.year).toBeDefined();
      expect(result.pillars.month).toBeDefined();
      expect(result.pillars.day).toBeDefined();
      expect(result.pillars.hour).toBeDefined();
    }

    expect(hourCodes[0]).not.toBe(hourCodes[1]);
    expect(new Set(hourCodes).size).toBeGreaterThan(1);
    expect(JSON.stringify(results)).not.toContain("SOLAR_TERM_YEAR_UNSUPPORTED");
  });

  it("does not add unsafe broad-year source markers", () => {
    const sourceFiles = [
      "src/lib/saju/calculateSaju.ts",
      "src/lib/saju/lunarJavascriptPillars.ts",
      "src/lib/saju/pillars.ts",
      "src/lib/saju/solarTerms.ts",
    ];
    const source = sourceFiles
      .map((relativePath) =>
        readFileSync(join(process.cwd(), relativePath), "utf8"),
      )
      .join("\n");
    const unsafeMarkers = [
      "fa" + "ke",
      "approxi" + "mate solar term",
      "dum" + "my",
      "임" + "시",
      "대" + "충",
      "fallback month " + "pillar",
    ];

    for (const marker of unsafeMarkers) {
      expect(source).not.toContain(marker);
    }
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
