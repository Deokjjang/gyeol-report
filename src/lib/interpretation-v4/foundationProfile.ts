import type { ElementLabel, SajuCalcResult } from "../saju/types";
import { buildYinYangEvidence, type YinYangState } from "./foundationYinYang";
import { ELEMENT_STATE_MULTIPLIERS, FOUNDATION_ELEMENTS, buildElementEvidence, type ElementKey, type FoundationElementInput, type FoundationElementState } from "./foundationElements";
import { buildFoundationCandidates, foundationExtrema } from "./foundationSynthesis";
import { FOUNDATION_VERSION, aggregateSemanticEvidence, type AxisContributionSource, type EvidenceAtom, type FoundationResult, type FoundationSynthesisCandidate, type SemanticAxis } from "./semanticCore";

export type FoundationInput = {
  yinYang: { yinCount: number; yangCount: number; metadata?: Record<string, unknown> };
  elements: Record<ElementKey, FoundationElementInput>;
};
export type FoundationSemanticProfile = {
  registryVersion: typeof FOUNDATION_VERSION;
  axes: Record<SemanticAxis, number>;
  contributions: Partial<Record<SemanticAxis, AxisContributionSource[]>>;
  evidence: EvidenceAtom[];
  synthesisCandidates: FoundationSynthesisCandidate[];
  yinYang: { yinCount: number; yangCount: number; state: YinYangState };
  elements: {
    states: Record<ElementKey, FoundationElementState>;
    strongest?: ElementKey;
    weakest?: ElementKey;
    strongestIsUnique: boolean;
    weakestIsUnique: boolean;
  };
};

/** Pure foundation builder. Invalid input returns an error and no partial profile. */
export function buildFoundationProfile(input: FoundationInput): FoundationResult<FoundationSemanticProfile> {
  const yinYang = buildYinYangEvidence(input.yinYang.yinCount, input.yinYang.yangCount);
  if (!yinYang.ok) return yinYang;
  if (FOUNDATION_ELEMENTS.some(element => {
    const value = input.elements[element];
    return !value || !Object.hasOwn(ELEMENT_STATE_MULTIPLIERS, value.state) ||
      !Number.isFinite(value.weightedScore) || value.weightedScore < 0;
  })) return { ok: false, error: "INVALID_ELEMENT_INPUT" };

  const yyEvidence = yinYang.value.evidence;
  const evidence: EvidenceAtom[] = [
    { ...yyEvidence, metadata: { ...input.yinYang.metadata, ...yyEvidence.metadata } },
    ...FOUNDATION_ELEMENTS.map(e => buildElementEvidence(e, input.elements[e])),
  ];
  const { axes, contributions } = aggregateSemanticEvidence(evidence);
  return { ok: true, value: {
    registryVersion: FOUNDATION_VERSION, axes, contributions, evidence,
    synthesisCandidates: buildFoundationCandidates(input.elements, { state: yinYang.value.state, evidenceId: yyEvidence.id }),
    yinYang: { yinCount: input.yinYang.yinCount, yangCount: input.yinYang.yangCount, state: yinYang.value.state },
    elements: {
      states: Object.fromEntries(FOUNDATION_ELEMENTS.map(e => [e, input.elements[e].state])) as Record<ElementKey, FoundationElementState>,
      ...foundationExtrema(input.elements),
    },
  } };
}

/** Existing analyzeFullElements labels are authoritative. No new thresholds:
 * STRONG -> STRONG; WEAK -> WEAK; MISSING -> VERY_WEAK; no label -> BALANCED.
 * The current producer has no VERY_STRONG label, so this adapter never invents it.
 * An unknown/unstable hour cannot meet this phase's visible-eight contract. */
export function adaptFoundationInput(calculation: SajuCalcResult): FoundationResult<FoundationInput> {
  if (!calculation.pillars.hour || calculation.input.birthTimeUnknown || calculation.input.birthTimePrecision === "unknown" ||
      (calculation.birthTimeContext && !calculation.birthTimeContext.stable.hour)) {
    return { ok: false, error: "INCOMPLETE_CHART" };
  }
  const counts = buildYinYangEvidence(calculation.yinYang.yin, calculation.yinYang.yang);
  if (!counts.ok) return counts;
  const elements = {} as FoundationInput["elements"];
  for (const element of FOUNDATION_ELEMENTS) {
    const mappings: readonly [ElementLabel, FoundationElementState][] = [
      [`${element}_STRONG`, "STRONG"], [`${element}_WEAK`, "WEAK"], [`${element}_MISSING`, "VERY_WEAK"],
    ];
    const matches = mappings.filter(([label]) => calculation.elements.labels.includes(label));
    if (matches.length > 1) return { ok: false, error: "CONFLICTING_ELEMENT_LABELS" };
    const score = calculation.elements.weighted[element];
    if (!Number.isFinite(score) || score < 0) return { ok: false, error: "INVALID_ELEMENT_INPUT" };
    elements[element] = {
      state: matches[0]?.[1] ?? "BALANCED", weightedScore: score,
      metadata: {
        canonicalLabels: calculation.elements.labels.filter(label => mappings.some(([expected]) => label === expected)),
        canonicalVisibleCount: calculation.elements.visible[element], canonicalWeightedScore: score,
        calculationVersion: calculation.calculationVersion ?? null,
        birthTimePrecision: calculation.birthTimeContext?.birthTimePrecision ?? calculation.input.birthTimePrecision ?? "exact",
        provenance: [`SajuCalcResult:elements.weighted:${element}`, "saju/analyze.ts:analyzeFullElements", "saju/analyze.ts:createElementLabels"],
      },
    };
  }
  return { ok: true, value: {
    yinYang: { yinCount: calculation.yinYang.yin, yangCount: calculation.yinYang.yang,
      metadata: { canonicalLabel: calculation.yinYang.label, calculationVersion: calculation.calculationVersion ?? null } },
    elements,
  } };
}

export function buildFoundationFromCalculation(calculation: SajuCalcResult): FoundationResult<FoundationSemanticProfile> {
  const input = adaptFoundationInput(calculation);
  return input.ok ? buildFoundationProfile(input.value) : input;
}
