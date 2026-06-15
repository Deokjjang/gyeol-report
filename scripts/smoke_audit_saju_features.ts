import {
  auditComputedSajuFeatures,
  formatSajuFeatureAuditResult,
} from "../src/lib/report-knowledge/sajuFeatureAudit";
import type { ComputedSajuFeatureExtractionInput } from "../src/lib/report-knowledge/sajuComputedFeatureExtractor";

const deokminSampleFacts = {
  dayMaster: "甲",
  dayPillar: "甲申",
  yearPillar: "丙子",
  monthPillar: "己亥",
  hourPillar: "丁未",
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
    { tenGod: "zheng_yin", strength: "missing" },
    { tenGod: "shi_shen", strength: "missing" },
  ],
  specialPatterns: ["jaeda_sinyak", "no_resource", "no_output"],
  existingSinsal: ["hyeonchim", "hongyeom", "gwimun", "wonjin"],
  existingGwiin: ["jaego"],
} as const satisfies ComputedSajuFeatureExtractionInput;

function writeStatus(message: string): void {
  process.stdout.write(`${message}\n`);
}

function main(): void {
  const audit = auditComputedSajuFeatures({
    ...deokminSampleFacts,
  });

  for (const line of formatSajuFeatureAuditResult(audit)) {
    writeStatus(line);
  }
}

main();
