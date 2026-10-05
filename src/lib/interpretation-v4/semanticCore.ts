/** Shared foundation only. Not imported by the current writer or Book projection. */
export const FOUNDATION_VERSION = "semantic-foundation-13d-1a-v1" as const;

export const BIPOLAR_AXES = [
  "ACTION_TEMPO", "ENERGY_DIRECTION", "STRUCTURE_STYLE", "COMMUNICATION_STYLE",
  "CHANGE_ORIENTATION", "DECISION_STYLE", "RELATION_STYLE", "RISK_STYLE",
] as const;
export const STRENGTH_AXES = [
  "INITIATIVE", "GOAL_DRIVE", "EXPANSION", "PERSISTENCE", "ADAPTABILITY", "DEPTH",
  "CURIOSITY", "PATTERN_SENSE", "PRECISION", "LEARNING", "STRATEGY", "CREATION",
  "EXPRESSION", "SOCIAL_ATTUNEMENT", "CARE", "CHARISMA", "DUTY", "LEADERSHIP",
  "AUTONOMY", "COMPETITION", "BOUNDARY", "PRACTICALITY", "RESOURCE_SENSE",
  "OPPORTUNITY_SENSE", "STABILITY", "STATUS_DRIVE", "MEANING", "RECOVERY_NEED",
] as const;
export const SEMANTIC_AXES = [...BIPOLAR_AXES, ...STRENGTH_AXES] as const;
export type BipolarAxis = typeof BIPOLAR_AXES[number];
export type StrengthAxis = typeof STRENGTH_AXES[number];
export type SemanticAxis = BipolarAxis | StrengthAxis;
export type SemanticSignature = Partial<Record<SemanticAxis, number>>;

export const BIPOLAR_DIRECTIONS = {
  ACTION_TEMPO: ["천천히 검토", "빠르게 행동"],
  ENERGY_DIRECTION: ["안으로 모음", "밖으로 발산"],
  STRUCTURE_STYLE: ["유연·즉흥", "기준·계획"],
  COMMUNICATION_STYLE: ["완곡·간접", "직설·명확"],
  CHANGE_ORIENTATION: ["익숙함·안정", "변화·새로움"],
  DECISION_STYLE: ["가능성을 열어둠", "결론·결정"],
  RELATION_STYLE: ["자기 영역", "함께 연결"],
  RISK_STYLE: ["안전·검토", "도전·감수"],
} as const satisfies Record<BipolarAxis, readonly [negative: string, positive: string]>;

export type EvidenceKind = "TRAIT" | "DYNAMIC" | "FORTUNE";
export type EvidenceTier = "CORE" | "SUPPORT" | "AMPLIFIER";
export type InterpretationContext = "identity" | "work" | "money" | "social" | "love" | "stress" | "learning" | "recovery";
export type FoundationEvidenceSource = "yin_yang" | "element" | "heavenly_stem" | "earthly_branch" | "ten_god";
export type AxisContribution = { axis: SemanticAxis; value: number };
export type EvidenceAtom = {
  id: string;
  sourceType: FoundationEvidenceSource;
  sourceKey: string;
  kind: EvidenceKind;
  tier: EvidenceTier;
  strength: "WEAK" | "MEDIUM" | "STRONG";
  /** State multiplier; axes store the raw signature, applied exactly once. */
  weight: number;
  axes: SemanticSignature;
  contexts: InterpretationContext[];
  family: string;
  easyMeaning: string;
  humanDescription?: string;
  positiveMeaning?: string;
  shadowMeaning?: string;
  metadata?: Record<string, unknown>;
};
export type AxisContributionSource = {
  evidenceId: string;
  sourceType: FoundationEvidenceSource;
  sourceKey: string;
  rawValue: number;
  weightedValue: number;
};
export type FoundationSynthesisCandidate = {
  id: string;
  source: "ELEMENT_PAIR" | "STRONGEST_WEAKEST" | "YIN_YANG_ELEMENT" | "STEM" | "BRANCH" |
    "TEN_GOD_FAMILY_PAIR" | "TEN_GOD_CHAIN" | "SPECIFIC_TEN_GOD" | "DAY_MASTER_TEN_GOD";
  semanticTheme: string;
  evidenceIds: string[];
  primaryAxes: SemanticAxis[];
  contexts: InterpretationContext[];
  humanDescription: string;
  secondaryDescription?: string;
  positiveMeaning?: string;
  shadowMeaning?: string;
  strength: "SUPPORT" | "MAIN" | "SIGNATURE";
  exclusivityGroup: string;
  priority: number;
  metadata?: Record<string, unknown>;
};
export type FoundationResult<T> = { ok: true; value: T } | {
  ok: false;
  error: "INVALID_YIN_YANG_COUNTS" | "INCOMPLETE_CHART" | "INVALID_ELEMENT_INPUT" | "CONFLICTING_ELEMENT_LABELS";
};

/** Shared contribution ledger. Composite candidates never add the same axes again. */
export function aggregateSemanticEvidence(evidence: readonly EvidenceAtom[]) {
  const axes = Object.fromEntries(SEMANTIC_AXES.map(axis => [axis, 0])) as Record<SemanticAxis, number>;
  const contributions: Partial<Record<SemanticAxis, AxisContributionSource[]>> = {};
  for (const axis of SEMANTIC_AXES) {
    for (const atom of evidence) {
      const rawValue = atom.axes[axis];
      if (rawValue === undefined) continue;
      const weightedValue = atom.weight === 0 ? 0 : rawValue * atom.weight;
      axes[axis] += weightedValue;
      (contributions[axis] ??= []).push({ evidenceId: atom.id, sourceType: atom.sourceType, sourceKey: atom.sourceKey, rawValue, weightedValue });
    }
  }
  return { axes, contributions };
}
