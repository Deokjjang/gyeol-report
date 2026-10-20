/** Offline product research contracts. None of these IDs are calculated facts. */
import type { MajorResearchId, SourceLocator } from "./bindingProposalTypes";

export type Offline = {
  readonly id: MajorResearchId;
  readonly productKey: "major_fortune";
  readonly connectedToRuntime: false;
  readonly approvedForCustomer: false;
  readonly existingScoreContribution: false;
  readonly runtimeEvidenceIds: readonly [];
};
export type Material = Offline & {
  readonly scope: string;
  readonly sourceRefs: readonly string[];
  readonly [field: string]: unknown;
};
export type Source = Offline & {
  readonly key: string;
  readonly status: "repository_checked" | "conditional_editorial" | "historical_transcription_read_not_empirical";
  readonly limitation: string;
  readonly file?: string | null;
  readonly fileSha256?: string | null;
  readonly sourceVersion?: string;
  readonly symbol?: string;
  readonly url?: string;
  readonly title?: string;
  readonly location?: string;
  readonly principle?: string;
  readonly checkedOn?: string;
  readonly modernApplicationsSource?: string;
};
export type TenGodStudy = Offline & {
  readonly god: string;
  readonly scope: "dayun";
  readonly core: string;
  readonly positive: string;
  readonly risk: string;
  readonly distinction: string;
  readonly natalRequired: string;
  readonly elementRequired: string;
  readonly domains: Readonly<Record<"work" | "money" | "learning" | "relationship", string>>;
  readonly environment: string;
  readonly surprising: string;
  readonly twist: string;
  readonly forbidden: readonly string[];
  readonly layerRoles: Readonly<Record<"natal" | "dayun" | "annual", string>>;
  readonly sourceRefs: readonly string[];
  readonly inheritedRole: SourceLocator;
  readonly verification: "conditional_editorial";
};
export type Crosswalk = Offline & {
  readonly locator: SourceLocator;
  readonly originalState: unknown;
  readonly referenceOnly: true;
  readonly majorUse: string;
  readonly bindingImplemented: false;
  readonly temporalFactSource?: false;
  readonly newAxisOrFacet?: false;
  readonly notNewFusionRule?: true;
  readonly unsupported?: string;
};
export type MbtiStudy = Offline & {
  readonly type: string;
  readonly scope: "personal_only";
  readonly referenceOnly: true;
  readonly sourceLocators: readonly SourceLocator[];
  readonly originalStates: readonly unknown[];
  readonly majorUse: string;
  readonly sameMeaning: string;
  readonly coexistence: string;
  readonly tension: string;
  readonly invalid: string;
  readonly missingPolicy: string;
  readonly bindingImplemented: false;
};
export type YearStudy = Offline & {
  readonly offset: number;
  readonly yearExpression: string;
  readonly timePosition: "past" | "current" | "future";
  readonly scope: "year";
  readonly purpose: string;
  readonly focus: string;
  readonly limit: string;
  readonly cyclePositionNotDeterminedByOffset: true;
  readonly requiredFacts: readonly string[];
  readonly questions: readonly {
    readonly key: string;
    readonly question: string;
    readonly requires: string;
    readonly missingPolicy: string;
    readonly notCalculatedEvidence: true;
  }[];
  readonly sourceRefs: readonly string[];
  readonly verification: "relative_editorial_question_not_forecast";
};
export type BindingStage = Offline & {
  readonly stage: string;
  readonly requirement: string;
  readonly fields: readonly string[];
  readonly rejected: string;
  readonly implemented: false;
  readonly missingPolicy: string;
  readonly sourceRefs: readonly string[];
};
export type Rejected = Offline & {
  readonly claim: string;
  readonly reason: string;
  readonly review: "rejected_or_withheld";
  readonly sourceRefs: readonly string[];
  readonly approved: false;
};
