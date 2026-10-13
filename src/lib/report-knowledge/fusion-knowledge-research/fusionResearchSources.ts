/** Full file/pointer/locator sources live in the audit catalog, with no lookup here. */
export const FUSION_RESEARCH_POLICY = {
  version: "fusion-semantic-knowledge-depth-01",
  connectedToRuntime: false,
  approvedForCustomer: false,
  existingScoreContribution: false,
  runtimeEvidenceIds: [],
  empiricalValidityClaim: "none",
  newRuntimeRules: 0,
  newEvidenceFacts: 0,
  interpretationStatus: "conditional_research_not_customer_fact",
  legacySemanticKindsAreAutomaticallyEquivalent: false,
  sourceDirectMeansEmpirical: false,
  noSourceFallback: "withhold",
} as const;
export const FUSION_RESEARCH_SOURCE_IDS = [
  "repo:legacy-fusion", "repo:semantic-fusion", "repo:complement-registry", "repo:tension",
  "repo:material-registry", "repo:mbti-source", "repo:saju-research", "repo:semantic-research",
  "repo:binding-blueprint", "authored:fusion-research", "authored:scope-research", "primary:mbti-relationships",
] as const;
