import { describe, expect, it } from "vitest";

import {
  getHourBranchFromBirthTime,
  getHourPillarFromBirthTime,
} from "@/lib/saju/pillars";

describe("hour branch calculation", () => {
  it("returns 子 for 23:00 through 00:59", () => {
    expect(getHourBranchFromBirthTime("23:00")).toBe("子");
    expect(getHourBranchFromBirthTime("23:59")).toBe("子");
    expect(getHourBranchFromBirthTime("00:00")).toBe("子");
    expect(getHourBranchFromBirthTime("00:59")).toBe("子");
  });

  it("returns the matching branch for every remaining hour range", () => {
    const cases = [
      ["01:00", "丑"],
      ["02:59", "丑"],
      ["03:00", "寅"],
      ["04:59", "寅"],
      ["05:00", "卯"],
      ["06:59", "卯"],
      ["07:00", "辰"],
      ["08:59", "辰"],
      ["09:00", "巳"],
      ["10:59", "巳"],
      ["11:00", "午"],
      ["12:59", "午"],
      ["13:00", "未"],
      ["14:59", "未"],
      ["15:00", "申"],
      ["16:59", "申"],
      ["17:00", "酉"],
      ["18:59", "酉"],
      ["19:00", "戌"],
      ["20:59", "戌"],
      ["21:00", "亥"],
      ["22:59", "亥"],
    ] as const;

    for (const [birthTime, branch] of cases) {
      expect(getHourBranchFromBirthTime(birthTime)).toBe(branch);
    }
  });
});

describe("hour pillar calculation", () => {
  it("calculates hour pillars for 甲 day", () => {
    expect(getHourPillarFromBirthTime("23:00", "甲")).toEqual({
      stem: "甲",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("00:30", "甲")).toEqual({
      stem: "甲",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("01:00", "甲")).toEqual({
      stem: "乙",
      branch: "丑",
    });
    expect(getHourPillarFromBirthTime("03:00", "甲")).toEqual({
      stem: "丙",
      branch: "寅",
    });
    expect(getHourPillarFromBirthTime("11:30", "甲")).toEqual({
      stem: "庚",
      branch: "午",
    });
    expect(getHourPillarFromBirthTime("21:59", "甲")).toEqual({
      stem: "乙",
      branch: "亥",
    });
  });

  it("calculates hour pillars for 乙 day", () => {
    expect(getHourPillarFromBirthTime("23:00", "乙")).toEqual({
      stem: "丙",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("01:00", "乙")).toEqual({
      stem: "丁",
      branch: "丑",
    });
    expect(getHourPillarFromBirthTime("03:00", "乙")).toEqual({
      stem: "戊",
      branch: "寅",
    });
  });

  it("calculates hour pillar start stems for 丙 丁 戊 day groups", () => {
    expect(getHourPillarFromBirthTime("23:00", "丙")).toEqual({
      stem: "戊",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("01:00", "丙")).toEqual({
      stem: "己",
      branch: "丑",
    });
    expect(getHourPillarFromBirthTime("23:00", "丁")).toEqual({
      stem: "庚",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("01:00", "丁")).toEqual({
      stem: "辛",
      branch: "丑",
    });
    expect(getHourPillarFromBirthTime("23:00", "戊")).toEqual({
      stem: "壬",
      branch: "子",
    });
    expect(getHourPillarFromBirthTime("01:00", "戊")).toEqual({
      stem: "癸",
      branch: "丑",
    });
  });
});

describe("hour pillar errors", () => {
  it("throws for invalid birth time format", () => {
    const invalidInputs = [
      "24:00",
      "7:00",
      "07:0",
      "07:000",
      "ab:cd",
      "12:60",
      "-1:00",
    ];

    for (const input of invalidInputs) {
      expect(() => getHourBranchFromBirthTime(input)).toThrow(
        "Invalid birth time format. Expected HH:mm.",
      );
    }
  });

  it("throws for invalid birth time format when calculating hour pillar", () => {
    const invalidInputs = [
      "24:00",
      "7:00",
      "07:0",
      "07:000",
      "ab:cd",
      "12:60",
      "-1:00",
    ];

    for (const input of invalidInputs) {
      expect(() => getHourPillarFromBirthTime(input, "甲")).toThrow(
        "Invalid birth time format. Expected HH:mm.",
      );
    }
  });
});

describe("hour pillar determinism", () => {
  it("returns deterministic hour pillars", () => {
    const first = getHourPillarFromBirthTime("17:27", "甲");
    const second = getHourPillarFromBirthTime("17:27", "甲");

    expect(second).toEqual(first);
  });
});
