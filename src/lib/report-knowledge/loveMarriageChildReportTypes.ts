import type {
  EarthlyBranch,
  HeavenlyStem,
  TenGod,
} from "./annualFortuneTypes";
import type { ProductBridgeEvidencePacket } from "./bridge/types";
import type { UserRelationshipStatus } from "./userContextTypes";

export type LoveMarriageChildReportProductType = "love_marriage_child";

export type LoveMarriageChildGender = "male" | "female" | "other" | "unknown";

export type LoveMarriageChildSignalStrength = "low" | "medium" | "high";

export type LoveMarriageChildSignalTone = "support" | "friction" | "mixed";

export type LoveMarriageChildFullPillarKey = "year" | "month" | "day" | "hour";

export type LoveMarriageChildBridgeEvidence = ProductBridgeEvidencePacket & {
  readonly productKey: "loveMarriageChild";
};

export interface LoveMarriageChildPersonContext {
  readonly name: string;
  readonly gender?: LoveMarriageChildGender | null;
  readonly mbtiType?: string | null;
  readonly relationshipStatus?: UserRelationshipStatus | null;
}

export interface LoveMarriageChildSajuSignal {
  readonly label: string;
  readonly plain: string;
  readonly strength: LoveMarriageChildSignalStrength;
  readonly tone: LoveMarriageChildSignalTone;
  readonly basis?: string | null;
}

export interface LoveMarriageChildTenGodSignal
  extends LoveMarriageChildSajuSignal {
  readonly tenGod: TenGod;
}

export interface LoveMarriageChildSpousePalaceSignal
  extends LoveMarriageChildSajuSignal {
  readonly dayBranch: EarthlyBranch;
}

export interface LoveMarriageChildFullPillarEvidence {
  readonly key: LoveMarriageChildFullPillarKey;
  readonly pillar: string;
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
  readonly stemTenGod?: TenGod | null;
  readonly branchTenGod?: TenGod | null;
  readonly hiddenStems?: readonly string[];
  readonly twelveLifeStage?: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
  readonly interactions?: readonly string[];
}

export interface LoveMarriageChildTimingHint {
  readonly label: string;
  readonly headline: string;
  readonly body: string;
  readonly push: readonly string[];
  readonly avoid: readonly string[];
}

export interface LoveMarriageChildMbtiTraitEvidence {
  readonly id?: string | null;
  readonly label: string;
  readonly plain: string;
  readonly risk?: string | null;
  readonly growth?: string | null;
}

export interface LoveMarriageChildSajuBasis {
  readonly dayMaster: HeavenlyStem;
  readonly dayPillar: string;
  readonly dayBranch: EarthlyBranch;
  readonly fullPillars: readonly LoveMarriageChildFullPillarEvidence[];
  readonly spousePalaceSignal: LoveMarriageChildSpousePalaceSignal | null;
  readonly loveTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly marriageTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly parentingTenGodSignals: readonly LoveMarriageChildTenGodSignal[];
  readonly attractionSignals: readonly LoveMarriageChildSajuSignal[];
  readonly conflictSignals: readonly LoveMarriageChildSajuSignal[];
  readonly supportSignals: readonly LoveMarriageChildSajuSignal[];
  readonly relationInteractionSignals: readonly LoveMarriageChildSajuSignal[];
}

export interface LoveMarriageChildMbtiBasis {
  readonly reportUseCases: readonly string[];
  readonly loveTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly marriageTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly parentingTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly childRoleTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly relationshipTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly communicationTraits: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly risks: readonly LoveMarriageChildMbtiTraitEvidence[];
  readonly growth: readonly LoveMarriageChildMbtiTraitEvidence[];
}

export interface LoveMarriageChildReportEvidencePacket {
  readonly productType: LoveMarriageChildReportProductType;
  readonly productVersion: "v1";
  readonly personContext: LoveMarriageChildPersonContext;
  readonly sajuBasis: LoveMarriageChildSajuBasis;
  readonly mbtiBasis: LoveMarriageChildMbtiBasis;
  readonly bridgeEvidence?: LoveMarriageChildBridgeEvidence;
  readonly timingHints: readonly LoveMarriageChildTimingHint[];
  readonly safetyNotes: readonly string[];
}

export const LOVE_MARRIAGE_CHILD_FORBIDDEN_EXPRESSIONS = [
  "무조건 헤어짐",
  "반드시 결혼",
  "결혼 못한다",
  "이혼한다",
  "배우자복 없다",
  "자식복 없다",
  "임신/출산/건강 진단",
] as const;
