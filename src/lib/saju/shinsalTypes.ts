import type { RelationPosition as PillarPosition } from "./relations";
import type { EarthlyBranch as Branch, HeavenlyStem } from "./types";

export type ShinsalCategory =
  | "PRECISION"
  | "CHARM"
  | "INTENSITY"
  | "SOCIAL_VISIBILITY"
  | "NOBLE_HELP"
  | "MOVEMENT"
  | "RELATION"
  | "WARNING"
  | "STRUCTURAL";

export type ShinsalSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH";

export type ShinsalConfidence = "LOW" | "MEDIUM" | "HIGH";

export type ShinsalCode =
  | "HYEONCHIMSAL"
  | "HONGYEOMSAL"
  | "BAEKHODAESAL"
  | "MANGSINSAL"
  | "YEOKMASAL"
  | "DOHWASAL"
  | "HWAGAE"
  | "GOSINSAL"
  | "GWASUKSAL"
  | "CHEON_EUL_GWIIN"
  | "TAEGEUK_GWIIN"
  | "MUN_CHANG_GWIIN"
  | "HAK_DANG_GWIIN"
  | "WOL_DEOK_GWIIN"
  | "CHEON_DEOK_GWIIN";

export type ShinsalRuleTarget = HeavenlyStem | Branch;

export type ShinsalDetectionBasis =
  | {
      kind: "DAY_STEM_TO_BRANCH";
      dayStem: HeavenlyStem;
      matchedBranch: Branch;
    }
  | {
      kind: "YEAR_BRANCH_TO_BRANCH";
      yearBranch: Branch;
      matchedBranch: Branch;
    }
  | {
      kind: "DAY_BRANCH_TO_BRANCH";
      dayBranch: Branch;
      matchedBranch: Branch;
    }
  | {
      kind: "MONTH_BRANCH_TO_BRANCH";
      monthBranch: Branch;
      matchedBranch: Branch;
    }
  | {
      kind: "MONTH_BRANCH_TO_STEM";
      monthBranch: Branch;
      matchedStem: HeavenlyStem;
    }
  | {
      kind: "MONTH_BRANCH_TO_STEM_OR_BRANCH";
      monthBranch: Branch;
      matchedTarget: ShinsalRuleTarget;
    }
  | {
      kind: "STEM_BRANCH_PAIR";
      stem: HeavenlyStem;
      branch: Branch;
    }
  | {
      kind: "BRANCH_ONLY";
      matchedBranch: Branch;
    };

export type ShinsalDetection = {
  code: ShinsalCode;
  category: ShinsalCategory;
  severity: ShinsalSeverity;
  confidence: ShinsalConfidence;
  labelKo: string;
  descriptionKo: string;
  positions: PillarPosition[];
  evidence: string[];
  basis: ShinsalDetectionBasis;
};

export type ShinsalMetadata = {
  code: ShinsalCode;
  category: ShinsalCategory;
  defaultSeverity: ShinsalSeverity;
  labelKo: string;
  shortDescriptionKo: string;
};

export type BranchSetByStem = Readonly<
  Record<HeavenlyStem, readonly Branch[]>
>;

export type BranchSetByBranch = Readonly<Record<Branch, readonly Branch[]>>;

export type StemSetByBranch = Readonly<
  Record<Branch, readonly HeavenlyStem[]>
>;

export type StemOrBranchSetByBranch = Readonly<
  Record<Branch, readonly ShinsalRuleTarget[]>
>;

export type StemBranchPair = {
  stem: HeavenlyStem;
  branch: Branch;
};

export type ShinsalRuleSource =
  | {
      kind: "DAY_STEM_TO_BRANCH";
      table: BranchSetByStem;
    }
  | {
      kind: "YEAR_BRANCH_TO_BRANCH";
      table: BranchSetByBranch;
    }
  | {
      kind: "DAY_BRANCH_TO_BRANCH";
      table: BranchSetByBranch;
    }
  | {
      kind: "MONTH_BRANCH_TO_BRANCH";
      table: BranchSetByBranch;
    }
  | {
      kind: "MONTH_BRANCH_TO_STEM";
      table: StemSetByBranch;
    }
  | {
      kind: "MONTH_BRANCH_TO_STEM_OR_BRANCH";
      table: StemOrBranchSetByBranch;
    }
  | {
      kind: "STEM_BRANCH_PAIR";
      pairs: readonly StemBranchPair[];
    }
  | {
      kind: "BRANCH_ONLY";
      branches: readonly Branch[];
    };

export type ShinsalRuleDefinition = {
  code: ShinsalCode;
  source: ShinsalRuleSource;
};
