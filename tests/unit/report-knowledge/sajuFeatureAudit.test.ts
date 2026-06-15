import { describe, expect, it } from "vitest";

import {
  auditComputedSajuFeatures,
  formatSajuFeatureAuditResult,
} from "../../../src/lib/report-knowledge/sajuFeatureAudit";

const sampleInput = {
  yearPillar: "丙子",
  monthPillar: "己亥",
  dayPillar: "甲申",
  hourPillar: "丁未",
  dayMaster: "甲",
  fiveElementCounts: {
    wood: 2,
    fire: 0,
    earth: 4,
    metal: 2,
    water: 0,
  },
  excessiveElements: ["earth"],
  missingElements: ["fire", "water"],
  tenGodSignals: [
    { tenGod: "pian_cai", strength: "strong" },
    { tenGod: "zheng_cai", strength: "present" },
    { tenGod: "zheng_guan", strength: "strong" },
    { tenGod: "qi_sha", strength: "strong" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  existingSinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  existingGwiin: ["jaego"],
} as const;

describe("saju feature audit", () => {
  it("derives stems and branches from the sample four pillars", () => {
    const audit = auditComputedSajuFeatures(sampleInput);

    expect(audit.ruleSetVersion).toBe("v1");
    expect(audit.pillars.heavenlyStems).toEqual(["丙", "己", "甲", "丁"]);
    expect(audit.pillars.earthlyBranches).toEqual(["子", "亥", "申", "未"]);
    expect(audit.pillars.dayBranch).toBe("申");
  });

  it("reports detected and watched-not-detected features without faking absent features", () => {
    const audit = auditComputedSajuFeatures(sampleInput);
    const detectedLabels = audit.detected.map((item) => item.labelKo);
    const watchedLabels = audit.watchedNotDetected.map((item) => item.labelKo);

    expect(detectedLabels).toEqual(expect.arrayContaining(["장성살", "천을귀인", "암록", "공망", "천문성"]));
    expect(watchedLabels).toEqual(expect.arrayContaining(["반안살", "백호대살"]));
    expect(detectedLabels).not.toContain("반안살");
    expect(detectedLabels).not.toContain("백호대살");
  });

  it("audits twelve-sinsal basis options and baekho rule table checks", () => {
    const audit = auditComputedSajuFeatures(sampleInput);
    const basisNames = audit.twelveSinsalByBasis.map((basis) => basis.basis);
    const baekhoCheck = audit.ruleTableChecks.find(
      (check) => check.meta.ruleId === "sinsal_baekho_v1",
    );

    expect(basisNames).toEqual([
      "yearBranch",
      "monthBranch",
      "dayBranch",
      "hourBranch",
    ]);
    expect(baekhoCheck?.checked.map((item) => item.pillarRole)).toEqual([
      "yearPillar",
      "monthPillar",
      "dayPillar",
      "hourPillar",
    ]);
    expect(baekhoCheck?.checked.some((item) => item.productionEligible)).toBe(true);
  });

  it("formats a safe audit summary for local smoke output", () => {
    const lines = formatSajuFeatureAuditResult(
      auditComputedSajuFeatures(sampleInput),
    );
    const output = lines.join("\n");

    expect(output).toContain("feature audit rule set: v1");
    expect(output).toContain("pillars: 丙子 己亥 甲申 丁未");
    expect(output).toContain("stems: 丙 己 甲 丁");
    expect(output).toContain("branches: 子 亥 申 未");
    expect(output).toContain("detected features:");
    expect(output).toContain("basis diagnostics:");
    expect(output).toContain("반안살:");
    expect(output).toContain("yearBranch basis:");
    expect(output).toContain("dayBranch basis:");
    expect(output).toContain("백호대살:");
    expect(output).toContain("dayPillar rule:");
    expect(output).toContain("anyPillar rule:");
    expect(output).toContain("watched not detected:");
    expect(output).not.toContain("OPENAI_API_KEY");
    expect(output).not.toContain("SUPABASE_SERVICE_ROLE");
  });
});
