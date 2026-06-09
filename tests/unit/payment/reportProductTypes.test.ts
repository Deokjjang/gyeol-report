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
      "saju_basic",
      "saju_full",
      "daewoon",
      "saewoon",
      "compatibility",
    ]);
  });

  it("parses known report product types only", () => {
    expect(parseReportProductType("saju_mbti_full")).toBe("saju_mbti_full");
    expect(parseReportProductType("saju_basic")).toBe("saju_basic");
    expect(parseReportProductType("saju_full")).toBe("saju_full");
    expect(parseReportProductType("daewoon")).toBe("daewoon");
    expect(parseReportProductType("saewoon")).toBe("saewoon");
    expect(parseReportProductType("compatibility")).toBe("compatibility");
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
