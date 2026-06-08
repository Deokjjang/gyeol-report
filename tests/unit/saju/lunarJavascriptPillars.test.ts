import { describe, expect, it } from "vitest";

import { getLunarJavascriptPillarsFromSolarDateTime } from "@/lib/saju/lunarJavascriptPillars";
import { UnsupportedSolarTermYearError } from "@/lib/saju/solarTerms";

describe("getLunarJavascriptPillarsFromSolarDateTime", () => {
  it("returns verified broad-year pillars for the 1996 production payload", () => {
    expect(
      getLunarJavascriptPillarsFromSolarDateTime(
        "1996-12-06T14:15:00+09:00",
      ),
    ).toEqual({
      year: { stem: "丙", branch: "子" },
      month: { stem: "己", branch: "亥" },
      day: { stem: "丁", branch: "丑" },
      hour: { stem: "丁", branch: "未" },
    });
  });

  it("throws honest unsupported-year error outside the engine range", () => {
    expect(() =>
      getLunarJavascriptPillarsFromSolarDateTime(
        "0000-12-06T14:15:00+09:00",
      ),
    ).toThrow(UnsupportedSolarTermYearError);
  });

  it("throws for invalid KST date-time format", () => {
    expect(() =>
      getLunarJavascriptPillarsFromSolarDateTime("1996-12-06T14:15:00Z"),
    ).toThrow("Invalid KST date-time format.");
  });
});
