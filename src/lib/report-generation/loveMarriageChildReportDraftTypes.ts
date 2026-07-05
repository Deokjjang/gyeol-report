import type {
  LoveMarriageChildReportEvidencePacket,
} from "../report-knowledge/loveMarriageChildReportTypes";

export type LoveMarriageChildActionPlanLabel =
  | "연애"
  | "결혼"
  | "갈등 회복"
  | "부모 역할"
  | "관계 정리"
  | "생활 리듬";

export const loveMarriageChildActionPlanLabels = [
  "연애",
  "결혼",
  "갈등 회복",
  "부모 역할",
  "관계 정리",
  "생활 리듬",
] as const satisfies readonly LoveMarriageChildActionPlanLabel[];

export interface LoveMarriageChildTextSection {
  readonly headline: string;
  readonly body: string;
  readonly keyPoints: readonly string[];
  readonly caution: string | null;
}

export interface LoveMarriageChildPatternSection
  extends LoveMarriageChildTextSection {
  readonly repeatedPattern: readonly string[];
  readonly betterUse: readonly string[];
}

export interface LoveMarriageChildParentModeSection
  extends LoveMarriageChildTextSection {
  readonly parentingRolePattern: readonly string[];
  readonly avoidProjection: readonly string[];
}

export interface LoveMarriageChildBreakupReunionPatternSection
  extends LoveMarriageChildTextSection {
  readonly myLoop: readonly string[];
  readonly emotionalProcessing: readonly string[];
  readonly repairBoundary: readonly string[];
}

export interface LoveMarriageChildRelationshipTimingHint {
  readonly label: string;
  readonly headline: string;
  readonly body: string;
  readonly push: readonly string[];
  readonly avoid: readonly string[];
}

export interface LoveMarriageChildActionPlanItem {
  readonly label: LoveMarriageChildActionPlanLabel;
  readonly headline: string;
  readonly body: string;
  readonly firstAction: string;
}

export interface LoveMarriageChildRiskManagementItem {
  readonly title: string;
  readonly body: string;
  readonly prevention: string;
}

export interface LoveMarriageChildReportDraft {
  readonly version: "v1";
  readonly productType: "love_marriage_child";
  readonly productVersion: "v1";
  readonly personLabel: string;
  readonly headline: string;
  readonly openingSummary: string;
  readonly evidencePacket?: LoveMarriageChildReportEvidencePacket;
  readonly loveStyle: LoveMarriageChildTextSection;
  readonly attractionPattern: LoveMarriageChildPatternSection;
  readonly loveStrengths: LoveMarriageChildTextSection;
  readonly loveFriction: LoveMarriageChildPatternSection;
  readonly marriageRhythm: LoveMarriageChildTextSection;
  readonly householdMoneyAndRoleSplit: LoveMarriageChildTextSection;
  readonly conflictRecovery: LoveMarriageChildTextSection;
  readonly parentMode: LoveMarriageChildParentModeSection;
  readonly breakupReunionPattern: LoveMarriageChildBreakupReunionPatternSection;
  readonly relationshipTimingHints: readonly LoveMarriageChildRelationshipTimingHint[];
  readonly actionPlan: readonly LoveMarriageChildActionPlanItem[];
  readonly riskManagement: readonly LoveMarriageChildRiskManagementItem[];
  readonly safetyNotes: readonly string[];
}
