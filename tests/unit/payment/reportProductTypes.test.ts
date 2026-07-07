import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  parseReportProductType,
  reportProductTypes,
} from "../../../src/lib/payment/reportProductTypes";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/reportProductTypes.ts"),
  "utf8",
);

describe("report product types", () => {
  it("defines current and planned report product types", () => {
    expect(reportProductTypes).toEqual([
      "saju_mbti_full",
      "career_money_study",
      "love_marriage_child",
      "saju_mbti_compatibility",
      "major_fortune",
      "annual_fortune",
    ]);
  });

  it("parses known report product types only", () => {
    expect(parseReportProductType("saju_mbti_full")).toBe("saju_mbti_full");
    expect(parseReportProductType("career_money_study")).toBe("career_money_study");
    expect(parseReportProductType("love_marriage_child")).toBe("love_marriage_child");
    expect(parseReportProductType("saju_mbti_compatibility")).toBe(
      "saju_mbti_compatibility",
    );
    expect(parseReportProductType("major_fortune")).toBe("major_fortune");
    expect(parseReportProductType("annual_fortune")).toBe("annual_fortune");
    expect(parseReportProductType("unknown_product")).toBeNull();
  });

  it("does not define stored-value or bundle product types", () => {
    const blockedMarkers = [
      "wallet",
      "recharge",
      "point",
      "credit",
      "balance",
      "package",
      "bundle",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
