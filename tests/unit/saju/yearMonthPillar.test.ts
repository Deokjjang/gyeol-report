import { describe, expect, it } from "vitest";

import {
  getMonthPillarFromSolarDateTime,
  getYearPillarFromSolarDateTime,
} from "@/lib/saju/pillars";

describe("year pillar calculation", () => {
  it("returns 癸卯 for 2024 before IPCHUN", () => {
    expect(getYearPillarFromSolarDateTime("2024-02-04T17:26:00+09:00")).toEqual({
      stem: "癸",
      branch: "卯",
    });
  });

  it("returns 甲辰 for 2024 at IPCHUN", () => {
    expect(getYearPillarFromSolarDateTime("2024-02-04T17:27:00+09:00")).toEqual({
      stem: "甲",
      branch: "辰",
    });
  });

  it("returns 癸亥 for 1984 before IPCHUN", () => {
    expect(getYearPillarFromSolarDateTime("1984-02-04T23:59:00+09:00")).toEqual({
      stem: "癸",
      branch: "亥",
    });
  });

  it("returns 甲子 for 1984 at IPCHUN", () => {
    expect(getYearPillarFromSolarDateTime("1984-02-05T00:19:00+09:00")).toEqual({
      stem: "甲",
      branch: "子",
    });
  });
});

describe("month pillar calculation", () => {
  it("returns 丙寅 for 2024 IPCHUN boundary", () => {
    expect(getMonthPillarFromSolarDateTime("2024-02-04T17:27:00+09:00")).toEqual({
      stem: "丙",
      branch: "寅",
    });
  });

  it("returns 丁卯 for 2024 GYEONGCHIP boundary", () => {
    expect(getMonthPillarFromSolarDateTime("2024-03-05T11:23:00+09:00")).toEqual({
      stem: "丁",
      branch: "卯",
    });
  });

  it("returns 丙子 for 2024 DAESEOL boundary", () => {
    expect(getMonthPillarFromSolarDateTime("2024-12-06T23:17:00+09:00")).toEqual({
      stem: "丙",
      branch: "子",
    });
  });

  it("uses previous Saju year stem before 2025 IPCHUN", () => {
    expect(getMonthPillarFromSolarDateTime("2025-01-10T12:00:00+09:00")).toEqual({
      stem: "丁",
      branch: "丑",
    });
  });
});

describe("year and month pillar errors", () => {
  it("throws for unsupported year", () => {
    expect(() =>
      getYearPillarFromSolarDateTime("1900-01-01T12:00:00+09:00"),
    ).toThrow("Solar term data for year 1900 is not available.");
  });

  it("throws for invalid KST datetime format", () => {
    const invalidDateTimes = [
      "2024-02-04",
      "2024-02-04T17:27:00Z",
      "2024-02-04T17:27:00+00:00",
      "2024-02-30T17:27:00+09:00",
      "2024-13-01T17:27:00+09:00",
    ];

    for (const invalidDateTime of invalidDateTimes) {
      expect(() => getYearPillarFromSolarDateTime(invalidDateTime)).toThrow(
        "Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.",
      );
    }
  });
});

describe("year and month pillar determinism", () => {
  it("returns deterministic year and month pillars", () => {
    const input = "2024-03-05T11:23:00+09:00";

    expect(getYearPillarFromSolarDateTime(input)).toEqual(
      getYearPillarFromSolarDateTime(input),
    );
    expect(getMonthPillarFromSolarDateTime(input)).toEqual(
      getMonthPillarFromSolarDateTime(input),
    );
  });
});
