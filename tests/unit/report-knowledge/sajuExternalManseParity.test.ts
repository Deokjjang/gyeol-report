import { describe, expect, it } from "vitest";

import {
  calculateExternalManseParity,
  DEFAULT_SMOKE_SAJU_FIXTURE,
  DEOKMIN_EXTERNAL_MANSE_FIXTURE,
  formatExternalManseParity,
  formatSajuFeatureAuditResult,
  auditComputedSajuFeatures,
} from "../../../src/lib/report-knowledge/sajuFeatureAudit";

describe("external manse parity fixture", () => {
  it("records the canonical external user fixture", () => {
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.birthDate).toBe("1999-07-31");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.calendar).toBe("solar");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.birthTime).toBe("07:30");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.timezone).toBe("Asia/Seoul");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.gender).toBe("male");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.expectedPillars).toEqual({
      year: "己卯",
      month: "辛未",
      day: "甲申",
      hour: "戊辰",
    });
  });

  it("keeps the default smoke fixture separate from the canonical user fixture", () => {
    expect(DEFAULT_SMOKE_SAJU_FIXTURE.auditLabel).toBe("default-smoke");
    expect(DEOKMIN_EXTERNAL_MANSE_FIXTURE.auditLabel).toBe("deokmin-external-manse");
    expect(DEFAULT_SMOKE_SAJU_FIXTURE.expectedPillars).toEqual({
      year: "丙子",
      month: "己亥",
      day: "甲申",
      hour: "丁未",
    });
    expect(DEFAULT_SMOKE_SAJU_FIXTURE.expectedPillars).not.toEqual(
      DEOKMIN_EXTERNAL_MANSE_FIXTURE.expectedPillars,
    );
  });

  it("formats explicit parity output without hiding mismatches", () => {
    const parity = calculateExternalManseParity(DEOKMIN_EXTERNAL_MANSE_FIXTURE);
    const output = formatExternalManseParity(parity).join("\n");

    expect(output).toContain("external expected pillars:");
    expect(output).toContain("hour 戊辰");
    expect(output).toContain("day 甲申");
    expect(output).toContain("month 辛未");
    expect(output).toContain("year 己卯");
    expect(output).toContain("current calculated pillars:");
    expect(output).toContain("parity:");
    expect(output).toMatch(/year (PASS|FAIL)/u);
    expect(output).toMatch(/month (PASS|FAIL)/u);
    expect(output).toMatch(/day (PASS|FAIL)/u);
    expect(output).toMatch(/hour (PASS|FAIL)/u);
  });

  it("includes 반안살 and 백호살 production, diagnostic, and external diagnostics", () => {
    const output = formatSajuFeatureAuditResult(
      auditComputedSajuFeatures(DEOKMIN_EXTERNAL_MANSE_FIXTURE.input),
      {
        fixture: DEOKMIN_EXTERNAL_MANSE_FIXTURE,
        parity: calculateExternalManseParity(DEOKMIN_EXTERNAL_MANSE_FIXTURE),
      },
    ).join("\n");

    expect(output).toContain("audit fixture: deokmin-external-manse");
    expect(output).toContain("external fixture placements:");
    expect(output).toContain("반안살:");
    expect(output).toContain("백호살:");
    expect(output).toContain("production result:");
    expect(output).toContain("diagnostic basis result:");
    expect(output).toContain("external fixture placement result:");
    expect(output).toContain("시주 戊辰");
  });
});
