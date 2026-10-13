/** Design only. No functions, IDs minted, score changes or runtime imports. */
export type MajorResearchId = `mfpr:${string}`;
declare const calculatedEvidenceBrand: unique symbol;
export type ExistingCalculatedEvidenceId = string & { readonly [calculatedEvidenceBrand]: true };
export type SourceLocator = { readonly file: string; readonly exportName: string; readonly index: number; readonly originalId: string; readonly sourceVersion: string; readonly recordSha256: string };
export type TimeScope = "natal" | "dayun" | "annual" | "transition" | "natal_dayun" | "natal_saeun" | "dayun_saeun" | "natal_dayun_saeun";
export type FutureClaimBinding = {
 readonly researchId: MajorResearchId;
 readonly actualEvidenceIds: readonly ExistingCalculatedEvidenceId[];
 readonly sourceIds: readonly string[];
 readonly sourceVersions: readonly string[];
 readonly scope: TimeScope;
 readonly participants: readonly { readonly owner: "person" | "dayun" | "annual"; readonly position: string; readonly stemOrBranch: string }[];
 readonly validWindow: { readonly startInclusive: string; readonly endExclusive: string; readonly precision: "exact" | "range" };
 readonly certainty: "confirmed" | "possible" | "unknown";
 readonly formationConditions: readonly string[];
 readonly counterconditions: readonly string[];
 readonly factRoots: readonly { readonly id: string; readonly scope: TimeScope; readonly periodKey: string }[];
 readonly unsupportedReasons: readonly string[];
 readonly informationFunction: "new_fact" | "new_application" | "comparison" | "continuity" | "withhold";
 readonly approvedForCustomer: false;
 readonly implemented: false;
};
