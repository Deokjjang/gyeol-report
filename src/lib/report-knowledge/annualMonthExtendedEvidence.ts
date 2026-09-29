import { SHINSAL_METADATA, SHINSAL_RULES } from "../saju/shinsalConstants";
import type { ShinsalRuleDefinition, ShinsalRuleTarget } from "../saju/shinsalTypes";
import type { AnnualCalendarMonth, AnnualMonthSegment } from "./annualMonthJie";
import { normalizeBranch, normalizeStem, relationPairs } from "./sajuFeatureExtractionRules";
import { SAJU_PILLAR_DISPLAY_HELPERS } from "./sajuPillarFeaturePlacement";
import type { AnnualFortuneEvidencePacket } from "./annualFortuneEvidence";

export const ANNUAL_MONTH_EVIDENCE_VERSION = "annual-month-evidence-v1" as const;
export type MonthFeature = {
  id: string; code: string; label: string; kind: "shinsal" | "noble" | "relation" | "lifeStage";
  basis: { anchor: string; anchorValue: string; target: string; targetValue: string; rule: string };
  sourceRefs: readonly string[];
};
export type ExtendedMonthSegment = {
  startKst: string; endKstExclusive: string; ganji: string;
  features: readonly MonthFeature[];
  unsupported: readonly { code: string; reason: string }[];
};
export type AnnualMonthExtendedEvidence = {
  version: typeof ANNUAL_MONTH_EVIDENCE_VERSION;
  months: readonly { month: number; segments: readonly ExtendedMonthSegment[] }[];
};

// This is a transit-target adapter, never a synthetic natal chart. The rule's
// reference remains the real natal day/year/month; ONLY its target is the
// exact Jie segment's stem/branch. Natal detections are not input to this layer.
function matchRule(rule: ShinsalRuleDefinition, natal: AnnualFortuneEvidencePacket["baseSaju"]["pillars"], segment: AnnualMonthSegment) {
  const source = rule.source;
  let anchor: string, anchorValue: string, targets: readonly ShinsalRuleTarget[];
  switch (source.kind) {
    case "DAY_STEM_TO_BRANCH":
      anchor = "natal.day.stem"; anchorValue = natal.day[0]; targets = source.table[anchorValue as keyof typeof source.table]; break;
    case "YEAR_BRANCH_TO_BRANCH":
      anchor = "natal.year.branch"; anchorValue = natal.year[1]; targets = source.table[anchorValue as keyof typeof source.table]; break;
    case "DAY_BRANCH_TO_BRANCH":
      anchor = "natal.day.branch"; anchorValue = natal.day[1]; targets = source.table[anchorValue as keyof typeof source.table]; break;
    case "BRANCH_GROUP_TO_BRANCH":
      anchor = source.reference === "YEAR_BRANCH" ? "natal.year.branch" : "natal.day.branch";
      anchorValue = (source.reference === "YEAR_BRANCH" ? natal.year : natal.day)[1]; targets = source.table[anchorValue as keyof typeof source.table]; break;
    case "MONTH_BRANCH_TO_BRANCH":
    case "MONTH_BRANCH_TO_STEM":
    case "MONTH_BRANCH_TO_STEM_OR_BRANCH":
      anchor = "natal.month.branch"; anchorValue = natal.month[1]; targets = source.table[anchorValue as keyof typeof source.table]; break;
    // A branch-only/pillar pattern is not automatically a verified transit rule.
    case "BRANCH_ONLY": case "STEM_BRANCH_PAIR": return null;
  }
  const candidates = source.kind === "MONTH_BRANCH_TO_STEM" ? [{ target: "month.stem", value: segment.monthPillar.stem }]
    : source.kind === "MONTH_BRANCH_TO_STEM_OR_BRANCH" ? [{ target: "month.stem", value: segment.monthPillar.stem }, { target: "month.branch", value: segment.monthPillar.branch }]
      : [{ target: "month.branch", value: segment.monthPillar.branch }];
  return candidates.filter(c => targets?.includes(c.value)).map(c => ({ anchor, anchorValue, target: c.target, targetValue: c.value, rule: source.kind }));
}

export function extendAnnualMonthEvidence(packet: Pick<AnnualFortuneEvidencePacket, "baseSaju" | "calendarMonths">): AnnualMonthExtendedEvidence {
  const natal = packet.baseSaju.pillars;
  return { version: ANNUAL_MONTH_EVIDENCE_VERSION, months: (packet.calendarMonths ?? []).map(month => ({ month: month.month, segments: month.segments.map(segment => {
    const prefix = `annual-month:${segment.startKst}`;
    const features: MonthFeature[] = [];
    const unsupported = [{ code: "banghap", reason: "NO_VERIFIED_CANONICAL_RULE" }];
    for (const rule of SHINSAL_RULES as readonly ShinsalRuleDefinition[]) {
      const matches = matchRule(rule, natal, segment);
      if (matches === null) { unsupported.push({ code: rule.code, reason: "NATAL_ONLY_RULE_NO_TRANSIT_CONTRACT" }); continue; }
      for (const basis of matches) features.push({ id: `${prefix}:${rule.code}:${basis.target}`, code: rule.code, label: SHINSAL_METADATA[rule.code].labelKo,
        kind: SHINSAL_METADATA[rule.code].category === "NOBLE_HELP" ? "noble" : "shinsal", basis,
        sourceRefs: [`src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:${rule.code}`, `calendarMonths:${month.month}:${segment.startKst}`, basis.anchor] });
    }
    const dayStem = normalizeStem(natal.day[0]), branch = normalizeBranch(segment.monthPillar.branch);
    if (dayStem && branch) features.push({ id: `${prefix}:life-stage`, code: "lifeStage", kind: "lifeStage", label: SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem[dayStem][branch],
      basis: { anchor: "natal.day.stem", anchorValue: natal.day[0], target: "month.branch", targetValue: segment.monthPillar.branch, rule: "DAY_STEM_TO_LIFE_STAGE" },
      sourceRefs: ["src/lib/report-knowledge/sajuPillarFeaturePlacement.ts:twelveLifeStageByStem", `calendarMonths:${month.month}:${segment.startKst}`] });
    for (const [position, pillar] of Object.entries(natal)) {
      if (!pillar) continue;
      const natalBranch = normalizeBranch(pillar[1]);
      if (branch && natalBranch && relationPairs.wonjin.some(pair => (pair[0] === branch && pair[1] === natalBranch) || (pair[1] === branch && pair[0] === natalBranch))) {
        features.push({ id: `${prefix}:wonjin:${position}`, code: "wonjin", kind: "relation", label: `${segment.monthPillar.branch}${pillar[1]} 원진`,
          basis: { anchor: `natal.${position}.branch`, anchorValue: pillar[1], target: "month.branch", targetValue: segment.monthPillar.branch, rule: "WONJIN_PAIR" },
          sourceRefs: ["src/lib/report-knowledge/sajuFeatureExtractionRules.ts:relationPairs.wonjin", `calendarMonths:${month.month}:${segment.startKst}`, `natal.${position}.branch`] });
      }
    }
    return { startKst: segment.startKst, endKstExclusive: segment.endKstExclusive, ganji: segment.monthPillar.stem + segment.monthPillar.branch, features, unsupported };
  }) })) };
}

export function annualSegmentAt(months: readonly AnnualCalendarMonth[], instant: string) {
  const t = Date.parse(instant);
  return months.flatMap(m => m.segments).find(s => Date.parse(s.startKst) <= t && t < Date.parse(s.endKstExclusive));
}
