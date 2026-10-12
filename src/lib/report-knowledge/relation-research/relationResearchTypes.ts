/** Offline research contracts; these IDs are never calculation evidence IDs. */
export type RelationKey = "stem_hap" | "yukhap" | "chung" | "samhap" | "hyeong" | "hae" | "banhap" | "pa" | "wonjin";
export type RelationDomain = "personality" | "career" | "money" | "study" | "love" | "marriage" | "family" | "relationships";
export type ResearchScope = "natal" | "cross_person" | "natal_major" | "natal_annual" | "natal_month" | "between_periods";
export type ResearchClass = "A_HISTORICAL_TEXT" | "B_REPOSITORY" | "C_CONDITIONAL_RESEARCH" | "D_MODERN_APPLICATION" | "E_UNVERIFIED" | "F_REJECTED";
export type SourceRef = { readonly sourceId: string; readonly locator: string };
type Offline = { readonly connectedToRuntime: false; readonly approvedForCustomer: false; readonly runtimeEvidenceIds: readonly [] };
export type RelationProfile = Offline & {
  readonly id: string; readonly key: RelationKey; readonly targetId: `foundation:relation:${RelationKey}`;
  readonly label: string; readonly hanja: string; readonly aliases: readonly string[];
  readonly existingDefinition: string; readonly definition: string;
  readonly traditional: { readonly class: ResearchClass; readonly text: string; readonly sourceRefs: readonly SourceRef[] };
  readonly formation: { readonly membership: string; readonly direction: string; readonly positions: string; readonly season: string; readonly multiple: string; readonly operation: string };
  readonly exclusions: readonly string[];
  readonly inference: { readonly class: "C_CONDITIONAL_RESEARCH"; readonly mechanism: string; readonly positive: string; readonly risk: string; readonly excess: string; readonly reversal: string; readonly mitigation: string; readonly coOccurrence: string; readonly limits: string };
  readonly distinctions: readonly { readonly other: RelationKey; readonly difference: string }[];
  readonly lineage: readonly string[]; readonly safety: readonly string[]; readonly scopeRefs: readonly ResearchScope[]; readonly producerScopeRefs: readonly ResearchScope[]; readonly unsupportedProducerScopeRefs: readonly ResearchScope[];
  readonly handoff: readonly string[];
};
export type RelationCombination = Offline & {
  readonly id: string; readonly relation: RelationKey; readonly targetId: `foundation:relation:${RelationKey}`; readonly members: readonly string[];
  readonly form: "pair" | "self_pair" | "triple"; readonly producerMembership: "existing_table" | "historical_group_only";
  readonly participants: readonly { readonly symbol: string; readonly element: string; readonly yinYang: "yin" | "yang"; readonly hiddenStems: readonly string[] }[];
  readonly traditional: { readonly class: ResearchClass; readonly text: string; readonly sourceRefs: readonly SourceRef[] };
  readonly composition: string; readonly formation: string; readonly exclusions: readonly string[]; readonly modifiers: string;
  readonly meaningClass: "C_CONDITIONAL_RESEARCH"; readonly positive: string; readonly risk: string; readonly reversal: string;
  readonly distinction: string; readonly modern: { readonly class: "D_MODERN_APPLICATION"; readonly condition: string; readonly action: string; readonly sourceRefs: readonly SourceRef[] };
  readonly overlaps: readonly string[]; readonly scopeRefs: readonly ResearchScope[]; readonly producerScopeRefs: readonly ResearchScope[]; readonly unsupportedProducerScopeRefs: readonly ResearchScope[]; readonly uncertainties: readonly string[];
};
export type RelationApplication = Offline & {
  readonly id: string; readonly targetId: `foundation:relation:${RelationKey}`; readonly relation: RelationKey; readonly domain: RelationDomain;
  readonly class: "D_MODERN_APPLICATION"; readonly structuralMeaningRef: string; readonly formationRef: string;
  readonly readerQuestion: string; readonly core: string; readonly positive: string; readonly risk: string; readonly excess: string;
  readonly unexpected: string; readonly conditionalScene: string; readonly judgment: string; readonly additionalEvidence: string;
  readonly doNotApply: string; readonly contrast: string; readonly secondLens: { readonly question: string; readonly conditionalAction: string; readonly limitation: string };
  readonly sourceRefs: readonly SourceRef[]; readonly scopeRefs: readonly ResearchScope[]; readonly producerScopeRefs: readonly ResearchScope[]; readonly unsupportedProducerScopeRefs: readonly ResearchScope[];
};
export type RelationBoundary = Offline & {
  readonly id: string; readonly relation: RelationKey; readonly domain: RelationDomain; readonly class: "E_UNVERIFIED";
  readonly gap: string; readonly needed: string; readonly prohibited: string;
};
export type RelationRejected = Offline & {
  readonly id: string; readonly relation: RelationKey; readonly class: "F_REJECTED"; readonly claim: string; readonly reason: string;
};
export type RelationScope = Offline & {
  readonly id: ResearchScope; readonly definition: string; readonly supported: readonly RelationKey[]; readonly unsupported: readonly RelationKey[];
  readonly producers: readonly { readonly path: string; readonly symbol: string; readonly behavior: string }[];
  readonly positions: string; readonly multiplicity: string; readonly timeBoundary: string; readonly doNotTransfer: readonly string[];
  readonly handoff: readonly string[];
};
export type RelationSource = {
  readonly id: string; readonly title: string; readonly author: string | null; readonly edition: string; readonly url: string;
  readonly kind: "historical_transcription" | "modern_author" | "modern_provider" | "academic_abstract" | "repository" | "authored";
  readonly accessed: string; readonly sections: readonly string[]; readonly supports: string; readonly limitations: readonly string[];
};
