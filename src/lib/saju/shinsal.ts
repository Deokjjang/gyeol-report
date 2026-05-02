import { SHINSAL_METADATA, SHINSAL_RULES } from "./shinsalConstants";
import type { PillarSet } from "./analyze";
import type {
  ShinsalDetection,
  ShinsalDetectionBasis,
  ShinsalRuleDefinition,
  ShinsalRuleTarget,
} from "./shinsalTypes";
import type { RelationPosition } from "./relations";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "./types";

type OrderedPillar = {
  position: RelationPosition;
  pillar: Pillar;
};

function getOrderedPillars(pillars: PillarSet): OrderedPillar[] {
  const ordered: OrderedPillar[] = [
    { position: "year", pillar: pillars.year },
    { position: "month", pillar: pillars.month },
    { position: "day", pillar: pillars.day },
  ];

  if (pillars.hour) {
    ordered.push({ position: "hour", pillar: pillars.hour });
  }

  return ordered;
}

function createDetection(params: {
  rule: ShinsalRuleDefinition;
  position: RelationPosition;
  basis: ShinsalDetectionBasis;
  evidence: string[];
}): ShinsalDetection {
  const metadata = SHINSAL_METADATA[params.rule.code];

  return {
    code: params.rule.code,
    category: metadata.category,
    severity: metadata.defaultSeverity,
    confidence: "MEDIUM",
    labelKo: metadata.labelKo,
    descriptionKo: metadata.shortDescriptionKo,
    positions: [params.position],
    evidence: [
      `shinsal:${params.rule.code}`,
      `position:${params.position}`,
      `basis:${params.basis.kind}`,
      ...params.evidence,
    ],
    basis: params.basis,
  };
}

function includesTarget(
  targets: readonly ShinsalRuleTarget[],
  target: ShinsalRuleTarget,
): boolean {
  return targets.includes(target);
}

function createBranchOnlyDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "BRANCH_ONLY",
      matchedBranch: branch,
    },
    evidence: [`branch:${branch}`],
  });
}

function createDayStemToBranchDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  dayStem: HeavenlyStem,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "DAY_STEM_TO_BRANCH",
      dayStem,
      matchedBranch: branch,
    },
    evidence: [`dayStem:${dayStem}`, `branch:${branch}`],
  });
}

function createYearBranchToBranchDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  yearBranch: EarthlyBranch,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "YEAR_BRANCH_TO_BRANCH",
      yearBranch,
      matchedBranch: branch,
    },
    evidence: [`yearBranch:${yearBranch}`, `branch:${branch}`],
  });
}

function createDayBranchToBranchDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  dayBranch: EarthlyBranch,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "DAY_BRANCH_TO_BRANCH",
      dayBranch,
      matchedBranch: branch,
    },
    evidence: [`dayBranch:${dayBranch}`, `branch:${branch}`],
  });
}

function createMonthBranchToBranchDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  monthBranch: EarthlyBranch,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "MONTH_BRANCH_TO_BRANCH",
      monthBranch,
      matchedBranch: branch,
    },
    evidence: [`monthBranch:${monthBranch}`, `branch:${branch}`],
  });
}

function createStemBranchPairDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  stem: HeavenlyStem,
  branch: EarthlyBranch,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "STEM_BRANCH_PAIR",
      stem,
      branch,
    },
    evidence: [`stem:${stem}`, `branch:${branch}`],
  });
}

function createMonthBranchToStemDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  monthBranch: EarthlyBranch,
  stem: HeavenlyStem,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "MONTH_BRANCH_TO_STEM",
      monthBranch,
      matchedStem: stem,
    },
    evidence: [`monthBranch:${monthBranch}`, `stem:${stem}`],
  });
}

function createMonthBranchToStemOrBranchDetection(
  rule: ShinsalRuleDefinition,
  entry: OrderedPillar,
  monthBranch: EarthlyBranch,
  matchedTarget: ShinsalRuleTarget,
): ShinsalDetection {
  return createDetection({
    rule,
    position: entry.position,
    basis: {
      kind: "MONTH_BRANCH_TO_STEM_OR_BRANCH",
      monthBranch,
      matchedTarget,
    },
    evidence: [`monthBranch:${monthBranch}`, `target:${matchedTarget}`],
  });
}

function matchRule(
  rule: ShinsalRuleDefinition,
  pillars: PillarSet,
  entries: readonly OrderedPillar[],
): ShinsalDetection[] {
  const detections: ShinsalDetection[] = [];

  switch (rule.source.kind) {
    case "BRANCH_ONLY": {
      for (const entry of entries) {
        const branch = entry.pillar.branch;

        if (rule.source.branches.includes(branch)) {
          detections.push(createBranchOnlyDetection(rule, entry, branch));
        }
      }

      return detections;
    }

    case "DAY_STEM_TO_BRANCH": {
      const dayStem = pillars.day.stem;
      const targetBranches = rule.source.table[dayStem];

      for (const entry of entries) {
        const branch = entry.pillar.branch;

        if (targetBranches.includes(branch)) {
          detections.push(
            createDayStemToBranchDetection(rule, entry, dayStem, branch),
          );
        }
      }

      return detections;
    }

    case "YEAR_BRANCH_TO_BRANCH": {
      const yearBranch = pillars.year.branch;
      const targetBranches = rule.source.table[yearBranch];

      for (const entry of entries) {
        const branch = entry.pillar.branch;

        if (targetBranches.includes(branch)) {
          detections.push(
            createYearBranchToBranchDetection(
              rule,
              entry,
              yearBranch,
              branch,
            ),
          );
        }
      }

      return detections;
    }

    case "DAY_BRANCH_TO_BRANCH": {
      const dayBranch = pillars.day.branch;
      const targetBranches = rule.source.table[dayBranch];

      for (const entry of entries) {
        const branch = entry.pillar.branch;

        if (targetBranches.includes(branch)) {
          detections.push(
            createDayBranchToBranchDetection(rule, entry, dayBranch, branch),
          );
        }
      }

      return detections;
    }

    case "MONTH_BRANCH_TO_BRANCH": {
      const monthBranch = pillars.month.branch;
      const targetBranches = rule.source.table[monthBranch];

      for (const entry of entries) {
        const branch = entry.pillar.branch;

        if (targetBranches.includes(branch)) {
          detections.push(
            createMonthBranchToBranchDetection(
              rule,
              entry,
              monthBranch,
              branch,
            ),
          );
        }
      }

      return detections;
    }

    case "STEM_BRANCH_PAIR": {
      for (const entry of entries) {
        const { stem, branch } = entry.pillar;
        const matched = rule.source.pairs.some(
          (pair) => pair.stem === stem && pair.branch === branch,
        );

        if (matched) {
          detections.push(
            createStemBranchPairDetection(rule, entry, stem, branch),
          );
        }
      }

      return detections;
    }

    case "MONTH_BRANCH_TO_STEM": {
      const monthBranch = pillars.month.branch;
      const targetStems = rule.source.table[monthBranch];

      for (const entry of entries) {
        const stem = entry.pillar.stem;

        if (targetStems.includes(stem)) {
          detections.push(
            createMonthBranchToStemDetection(rule, entry, monthBranch, stem),
          );
        }
      }

      return detections;
    }

    case "MONTH_BRANCH_TO_STEM_OR_BRANCH": {
      const monthBranch = pillars.month.branch;
      const targets = rule.source.table[monthBranch];

      for (const entry of entries) {
        const { stem, branch } = entry.pillar;

        if (includesTarget(targets, stem)) {
          detections.push(
            createMonthBranchToStemOrBranchDetection(
              rule,
              entry,
              monthBranch,
              stem,
            ),
          );
        }

        if (includesTarget(targets, branch)) {
          detections.push(
            createMonthBranchToStemOrBranchDetection(
              rule,
              entry,
              monthBranch,
              branch,
            ),
          );
        }
      }

      return detections;
    }
  }
}

export function detectShinsal(pillars: PillarSet): ShinsalDetection[] {
  const entries = getOrderedPillars(pillars);
  const detections: ShinsalDetection[] = [];

  for (const rule of SHINSAL_RULES) {
    detections.push(...matchRule(rule, pillars, entries));
  }

  return detections;
}
