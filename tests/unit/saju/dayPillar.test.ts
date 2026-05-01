import { describe, expect, it } from "vitest";

import { getDayPillarFromSolarDate } from "@/lib/saju/pillars";

describe("getDayPillarFromSolarDate", () => {
  it("returns 甲子 for the fixed epoch date", () => {
    expect(getDayPillarFromSolarDate("1984-02-02")).toEqual({
      stem: "甲",
      branch: "子",
    });
  });

  it("returns 乙丑 for the day after the epoch", () => {
    expect(getDayPillarFromSolarDate("1984-02-03")).toEqual({
      stem: "乙",
      branch: "丑",
    });
  });

  it("returns 癸亥 for the day before the epoch", () => {
    expect(getDayPillarFromSolarDate("1984-02-01")).toEqual({
      stem: "癸",
      branch: "亥",
    });
  });

  it("returns 甲子 again after 60 days", () => {
    expect(getDayPillarFromSolarDate("1984-04-02")).toEqual({
      stem: "甲",
      branch: "子",
    });
  });

  it("throws for invalid date formats", () => {
    const invalidDateFormats = [
      "1984/02/02",
      "84-02-02",
      "1984-2-2",
      "abcd",
    ] as const;

    invalidDateFormats.forEach((value) => {
      expect(() => getDayPillarFromSolarDate(value)).toThrow(
        "Invalid date format. Expected YYYY-MM-DD.",
      );
    });
  });

  it("throws for invalid calendar dates", () => {
    const invalidCalendarDates = [
      "2024-02-30",
      "2023-13-01",
      "2023-00-10",
      "2023-01-00",
    ] as const;

    invalidCalendarDates.forEach((value) => {
      expect(() => getDayPillarFromSolarDate(value)).toThrow(
        "Invalid calendar date.",
      );
    });
  });

  it("handles dates before the epoch with positive modulo", () => {
    expect(getDayPillarFromSolarDate("1983-12-04")).toEqual({
      stem: "甲",
      branch: "子",
    });
  });

  it("returns the same output for the same input", () => {
    const first = getDayPillarFromSolarDate("2024-02-04");
    const second = getDayPillarFromSolarDate("2024-02-04");

    expect(second).toEqual(first);
  });
});
