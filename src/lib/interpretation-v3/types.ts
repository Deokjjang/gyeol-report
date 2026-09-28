/** Shared interpretation types; only explicit comprehensive V3 consumes them. */
export const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
export type Product = typeof PRODUCTS[number];
export const DOMAINS = ["identity", "career", "business", "money", "relationship", "love", "study", "leadership", "lifestyle"] as const;
export type Domain = typeof DOMAINS[number];
export type EvidenceKind = "day_master" | "day_pillar" | "pillar" | "season" | "yin_yang" | "element" | "hidden_stem" | "ten_god" | "life_stage" | "shinsal" | "gwiin" | "structure" | "relation" | "spouse_palace" | "fortune" | "mbti" | "context";
export type Scope = "natal" | "major" | "annual" | "monthly" | "behavior" | "context";
export type Evidence = {
  readonly id: string;
  readonly featureId: string;
  readonly kind: EvidenceKind;
  readonly subject: "person" | "personA" | "personB";
  readonly scope: Scope;
  /** Required for fortune facts; exact period/segment from canonical evidence. */
  readonly period?: string;
  readonly value: unknown;
  readonly sourceRefs: readonly string[];
  /** Same underlying fact in two adapters MUST retain the same lineage. */
  readonly lineage: readonly string[];
  readonly certainty: "confirmed" | "conditional" | "weak";
  readonly salience: "supporting" | "direct" | "prominent";
  readonly domains: readonly Domain[];
  readonly conflictsWith?: readonly string[];
};
export type AtomicMaterial = {
  readonly id: string;
  readonly name: string;
  readonly sourceRefs: readonly string[];
  readonly readiness: "material" | "reviewed" | "needs-source";
  readonly coreMeaning: string;
  readonly feltQuestions: readonly string[];
  readonly personalityExpression: readonly string[];
  readonly strength: readonly string[];
  readonly overuseRisk: readonly string[];
  readonly use: Readonly<Record<Domain, readonly string[]>>;
  readonly modernUses: readonly string[];
  readonly directives: readonly string[];
  readonly mbtiInteractionTags: readonly string[];
  readonly contextTags: readonly string[];
  readonly positiveSignalStrength: "explicit" | "mixed" | "unreviewed";
  readonly cautionTags: readonly string[];
  readonly unsupportedClaimGuards: readonly string[];
};
export type ClaimStrength = "strong" | "domain" | "tension" | "question" | "suppressed";
export type Directive = {
  readonly id: string;
  readonly headline: string;
  readonly directive: string;
  readonly rationale: string;
  readonly positiveUse: string;
  readonly caution: string;
  readonly professionalEvidence: readonly string[];
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly strength: Exclude<ClaimStrength, "suppressed">;
  readonly domain: Domain;
  readonly context: string;
};
export type CompoundRule = {
  readonly id: string;
  /** AND of OR groups. Only evidence IDs, never prose or job keyword inference. */
  readonly allOf: readonly (readonly string[])[];
  readonly domains: readonly Domain[];
  readonly kind: "meaningful" | "tension";
  readonly judgment: string;
  readonly directive: string;
  readonly caution: string;
  readonly sourceRefs: readonly string[];
};
export type CompoundMatch = {
  readonly rule: CompoundRule;
  readonly evidence: readonly Evidence[];
};
