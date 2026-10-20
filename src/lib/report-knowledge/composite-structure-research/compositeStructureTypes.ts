import type { StructureId } from "../../interpretation-v4/structureTypes";

/** Research identities are never runtime calculation Evidence IDs. */
export type CompositeKey = "jaeda_sinyak" | "singang" | "sinyak" | "weak_output" | "weak_officer" |
  "siksang_saengjae" | "jaesaenggwan" | "officer_resource" | "salin_sangsaeng" |
  "sanggwan_gyeongwan" | "gwansal_honjob" | "bigeop_many" | "resource_many" |
  "output_heavy" | "wealth_heavy" | "officer_heavy" | "no_resource" | "no_output" |
  "toda_maegeum" | "geumda_mokjeol" | "mokda_hwasik" | "suda_mokbu" | "fire_metal" |
  "water_weak" | "season_command" | "support_restraint" | "temperature" | "moisture" | "mediation";
export type CompositeDomain = "personality" | "career" | "money" | "study" | "love" | "marriage" | "family" | "relationships";
export type CompositeClass = "A_TEXT_CHECKED" | "B_REPOSITORY" | "C_CONDITIONAL_RESEARCH" | "D_MODERN_APPLICATION" | "E_UNVERIFIED" | "F_REJECTED";
export type CompositeRef = { readonly sourceId: string; readonly locator: string };
export type CompositeStatement = {
  readonly class: CompositeClass;
  readonly text: string;
  readonly sourceRefs: readonly CompositeRef[];
};
export type CompositeProfile = {
  readonly id: `csr:profile:${CompositeKey}`;
  readonly targetId: `foundation:structure:${CompositeKey}`;
  readonly key: CompositeKey;
  readonly label: string;
  readonly hanja: string;
  readonly aliases: readonly string[];
  readonly family: "strength" | "flow" | "tension" | "weight" | "absence" | "element" | "principle";
  readonly participants: { readonly tenGods: readonly string[]; readonly elements: readonly string[]; readonly natalScope: string };
  readonly existingDefinition: CompositeStatement;
  readonly researchDefinition: string;
  readonly formation: Readonly<Record<"strength" | "position" | "monthCommand" | "visibleStems" | "roots" | "hiddenStems" | "generationControl" | "additional", string>>;
  readonly counterconditions: readonly string[];
  readonly traditional: readonly CompositeStatement[];
  readonly inference: {
    readonly class: "C_CONDITIONAL_RESEARCH";
    readonly mechanism: string;
    readonly positive: string;
    readonly risk: string;
    readonly strengthToRisk: string;
    readonly weaknessToResource: string;
    readonly tension: string;
    readonly limits: string;
  };
  readonly distinctions: readonly { readonly otherTargetId: `foundation:structure:${CompositeKey}`; readonly difference: string }[];
  readonly support: {
    readonly classification: "A_DETECTED_CANDIDATE" | "B_FACTS_NO_V4_DETECTOR" | "C_KNOWLEDGE_ONLY";
    readonly lineageOrDefinitionVaries: boolean;
    readonly insufficientForTraditionalFormation: true;
    readonly v4RuleIds: readonly StructureId[];
    readonly legacyPatternCodes: readonly string[];
    readonly actualBehavior: string;
    readonly codeRefs: readonly string[];
    readonly runtimeEvidenceIds: readonly never[];
  };
  readonly handoff: readonly string[];
  readonly sourceRefs: readonly CompositeRef[];
  readonly connectedToRuntime: false;
};
type CompositeDomainResearch = {
  readonly targetId: CompositeProfile["targetId"];
  readonly profileRef: CompositeProfile["id"];
  readonly domain: CompositeDomain;
  readonly approvedForCustomer: false;
  readonly connectedToRuntime: false;
  readonly sourceRefs: readonly CompositeRef[];
  readonly structuralMeaningRef: string;
  readonly formationRef: string;
  readonly readerQuestion: string;
  readonly additionalEvidence: string;
  readonly doNotApply: string;
};
export type CompositeApplication = CompositeDomainResearch & {
  readonly id: `csr:application:${CompositeKey}:${CompositeDomain}`;
  readonly class: "D_MODERN_APPLICATION";
  readonly core: string;
  readonly positive: string;
  readonly risk: string;
  readonly excess: string;
  readonly unexpected: string;
  readonly conditionalScene: string;
  readonly action: string;
  readonly contrast: string;
};
export type CompositeBoundary = CompositeDomainResearch & {
  readonly id: `csr:boundary:${CompositeKey}:${CompositeDomain}`;
  readonly class: "E_UNVERIFIED";
  readonly gap: string;
  readonly researchAction: string;
};
export type CompositeRejected = {
  readonly id: `csr:rejected:${CompositeKey}`;
  readonly targetId: CompositeProfile["targetId"];
  readonly class: "F_REJECTED";
  readonly claim: string;
  readonly whyRejected: string;
  readonly replacementPolicy: string;
  readonly approvedForCustomer: false;
  readonly sourceRefs: readonly CompositeRef[];
};
export type CompositeSource = {
  readonly id: string;
  readonly kind: "historical_transcription" | "repository" | "editorial_research";
  readonly title: string;
  readonly url?: string;
  readonly path?: string;
  readonly accessed?: string;
  readonly scope: string;
  readonly limits: string;
};
