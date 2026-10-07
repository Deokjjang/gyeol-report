import { BIPOLAR_AXES, SEMANTIC_AXES, type EvidenceAtom, type FoundationSynthesisCandidate, type SemanticAxis } from "./semanticCore";
import { PILLAR_CONTENT_WEIGHTS } from "./foundationPillars";

/** Editorial importance only. None of these constants classify a natal chart. */
export const CONTENT_TIER_BASE = { CORE: { STRONG: 2, MEDIUM: 1.3, WEAK: 0.25 }, SUPPORT: { STRONG: 1.2, MEDIUM: 0.8, WEAK: 0.15 }, AMPLIFIER: { STRONG: 0.5, MEDIUM: 0.5, WEAK: 0.1 } } as const;
export const FAMILY_DIVERSITY_BONUS = [1, 1.15, 1.3, 1.4] as const;
export const SYNTHESIS_DEPTH_MULTIPLIER = { 1: 0.7, 2: 1, 3: 1.2, 4: 1.35, 5: 1.5 } as const;
export const SPECIFICITY_FACTOR = { single: 0.8, pair: 1, composite: 1.1, contextual: 1.15 } as const;
export const DUPLICATION_PENALTIES = [0, 0.15, 0.3, 0.5] as const;
export const CONTENT_RANK_POLICY = { overlapThreshold: 0.7, amplifierOnlyPenalty: 0.25, signatureLimit: 5, dominantAxisLimit: 8 } as const;
export const BROAD_SEMANTIC_THEMES = {
  DEEP_UNDERSTANDING: ["DEPTH", "PATTERN_SENSE", "MEANING"],
  PRECISION_AND_STANDARDS: ["PRECISION", "BOUNDARY", "STRUCTURE_STYLE", "COMMUNICATION_STYLE"],
  ACTION_AND_INITIATIVE: ["INITIATIVE", "ACTION_TEMPO", "DECISION_STYLE"],
  GROWTH_AND_EXPANSION: ["EXPANSION", "GOAL_DRIVE"],
  STABILITY_AND_MAINTENANCE: ["STABILITY", "PERSISTENCE"],
  EXPRESSION_AND_VISIBILITY: ["EXPRESSION", "CHARISMA", "ENERGY_DIRECTION"],
  LEADERSHIP_AND_RESPONSIBILITY: ["LEADERSHIP", "DUTY"],
  AUTONOMY_AND_SELF_DIRECTION: ["AUTONOMY", "COMPETITION"],
  MONEY_AND_REALITY: ["RESOURCE_SENSE", "PRACTICALITY"],
  LEARNING_AND_EXPERTISE: ["LEARNING", "CURIOSITY"],
  SOCIAL_ATTUNEMENT_AND_CARE: ["SOCIAL_ATTUNEMENT", "CARE", "RELATION_STYLE"],
  CHANGE_AND_ADAPTATION: ["CHANGE_ORIENTATION", "ADAPTABILITY"],
  OPPORTUNITY_AND_MOVEMENT: ["OPPORTUNITY_SENSE", "RISK_STYLE"],
  RECOVERY_AND_INNER_PROCESS: ["RECOVERY_NEED"],
  STATUS_AND_RECOGNITION: ["STATUS_DRIVE"],
  CREATION_AND_OUTPUT: ["CREATION", "STRATEGY"],
} as const satisfies Record<string, readonly SemanticAxis[]>;
export type BroadSemanticTheme = keyof typeof BROAD_SEMANTIC_THEMES;
export type SynthesisDepth = keyof typeof SYNTHESIS_DEPTH_MULTIPLIER;
export const lexical = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export const sortedUnique = (xs: readonly string[]) => [...new Set(xs)].sort(lexical);
export const isMeaningfulEvidence = (e: EvidenceAtom) => e.strength !== "WEAK" && e.weight > 0 && e.metadata?.canonicalConfidence !== 0;
export const independentFamilies = (e: readonly EvidenceAtom[]) => sortedUnique(e.map(a => a.family));
export const diversityMultiplier = (count: number) => FAMILY_DIVERSITY_BONUS[Math.max(0, Math.min(count - 1, 3))];
export const canonicalConfidence = (e: EvidenceAtom): number | undefined => typeof e.metadata?.canonicalConfidence === "number" ? e.metadata.canonicalConfidence : undefined;
export const positionFactor = (e: EvidenceAtom) => typeof e.metadata?.positionWeight === "number" ? e.metadata.positionWeight / PILLAR_CONTENT_WEIGHTS.day.stem : 1;
export const rawEvidenceWeight = (e: EvidenceAtom) => typeof e.metadata?.rawWeight === "number" ? e.metadata.rawWeight : e.weight / positionFactor(e);
/** Signed, monotonic, bounded; raw sums are never overwritten. */
export const normalizeContentScore = (value: number) => value / (1 + Math.abs(value));

export type AxisContributionRecord = {
  axis: SemanticAxis; evidenceId: string; sourceType: EvidenceAtom["sourceType"]; sourceKey: string; family: string;
  tier: EvidenceAtom["tier"]; strength: EvidenceAtom["strength"]; rawValue: number; rawContribution: number; effectiveContribution: number;
  rawWeight: number; effectiveWeight: number; positionWeight?: number; canonicalConfidence?: number;
  semanticTheme: BroadSemanticTheme; metadata?: Record<string, unknown>;
};
export type RankedAxis = {
  axis: SemanticAxis; score: number; netScore: number; rawAggregate: number; normalizedAggregate: number;
  positiveMagnitude: number; negativeMagnitude: number; absoluteStrength: number;
  supportingEvidenceIds: string[]; familyDiversity: number; topContributors: AxisContributionRecord[];
  positiveOrNegativeDirection?: "positive" | "negative" | "balanced";
};
const THEME_OVERRIDES: Readonly<Record<string, BroadSemanticTheme>> = {
  PRECISE_DEEP_ANALYSIS: "DEEP_UNDERSTANDING", MONEY_AND_MEANING: "MONEY_AND_REALITY", SELF_VS_RULE: "AUTONOMY_AND_SELF_DIRECTION",
  LEARN_OWN_USE: "LEARNING_AND_EXPERTISE", LEARNING_TO_OUTPUT: "CREATION_AND_OUTPUT",
  "element:METAL": "PRECISION_AND_STANDARDS", "element:WATER": "DEEP_UNDERSTANDING", "element:EARTH": "STABILITY_AND_MAINTENANCE",
  "element:WOOD": "GROWTH_AND_EXPANSION", "element:FIRE": "EXPRESSION_AND_VISIBILITY",
  HELPER: "SOCIAL_ATTUNEMENT_AND_CARE", HELPER_SOFTENING: "SOCIAL_ATTUNEMENT_AND_CARE", VISIBILITY: "EXPRESSION_AND_VISIBILITY",
  INTIMATE_CHARM: "EXPRESSION_AND_VISIBILITY", LEADERSHIP_POSITION: "LEADERSHIP_AND_RESPONSIBILITY", MOVEMENT: "OPPORTUNITY_AND_MOVEMENT",
};
export function broadTheme(axes: readonly SemanticAxis[], theme?: string): BroadSemanticTheme {
  if (theme && Object.hasOwn(THEME_OVERRIDES, theme)) return THEME_OVERRIDES[theme];
  const keys = Object.keys(BROAD_SEMANTIC_THEMES) as BroadSemanticTheme[];
  const matches = (key: BroadSemanticTheme) => axes.filter(a => (BROAD_SEMANTIC_THEMES[key] as readonly SemanticAxis[]).includes(a)).length;
  return keys.slice().sort((a, b) => matches(b) - matches(a) || lexical(a, b))[0];
}

export function buildIntegratedAxisLedger(evidence: readonly EvidenceAtom[]) {
  const axes = Object.fromEntries(SEMANTIC_AXES.map(a => [a, 0])) as Record<SemanticAxis, number>;
  const contributions: Partial<Record<SemanticAxis, AxisContributionRecord[]>> = {};
  const rankedAxes = SEMANTIC_AXES.map(axis => {
    const rows: AxisContributionRecord[] = [...evidence].sort((a, b) => lexical(a.id, b.id)).flatMap(e => {
      const rawValue = e.axes[axis]; if (rawValue === undefined) return [];
      const rawWeight = rawEvidenceWeight(e), confidence = canonicalConfidence(e);
      return [{ axis, evidenceId: e.id, sourceType: e.sourceType, sourceKey: e.sourceKey, family: e.family, tier: e.tier, strength: e.strength,
        rawValue, rawWeight, effectiveWeight: e.weight, rawContribution: rawWeight === 0 ? 0 : rawValue * rawWeight, effectiveContribution: e.weight === 0 ? 0 : rawValue * e.weight,
        ...(typeof e.metadata?.positionWeight === "number" ? { positionWeight: e.metadata.positionWeight } : {}),
        ...(confidence !== undefined ? { canonicalConfidence: confidence } : {}), semanticTheme: broadTheme([axis]), metadata: structuredClone(e.metadata ?? {}) }];
    });
    if (rows.length) contributions[axis] = rows;
    const sum = (select: (r: AxisContributionRecord) => number) => rows.reduce((n, r) => n + select(r), 0);
    const netScore = sum(r => r.effectiveContribution), positiveMagnitude = sum(r => Math.max(0, r.effectiveContribution)), negativeMagnitude = sum(r => Math.max(0, -r.effectiveContribution));
    axes[axis] = netScore;
    return { axis, score: netScore, netScore, rawAggregate: sum(r => r.rawContribution), normalizedAggregate: normalizeContentScore(netScore),
      positiveMagnitude, negativeMagnitude, absoluteStrength: positiveMagnitude + negativeMagnitude,
      supportingEvidenceIds: rows.filter(r => r.effectiveContribution !== 0).map(r => r.evidenceId),
      familyDiversity: new Set(rows.filter(r => r.effectiveContribution !== 0).map(r => r.family)).size,
      topContributors: rows.slice().sort((a, b) => Math.abs(b.effectiveContribution) - Math.abs(a.effectiveContribution) || lexical(a.evidenceId, b.evidenceId)),
      ...((BIPOLAR_AXES as readonly string[]).includes(axis) ? { positiveOrNegativeDirection: netScore > 0 ? "positive" as const : netScore < 0 ? "negative" as const : "balanced" as const } : {}),
    };
  }).sort((a, b) => b.absoluteStrength - a.absoluteStrength || lexical(a.axis, b.axis));
  return { axes, contributions, rankedAxes };
}

export type InterpretationSeed = Pick<FoundationSynthesisCandidate, "id" | "semanticTheme" | "primaryAxes" | "evidenceIds" | "humanDescription" | "positiveMeaning" | "shadowMeaning"> & {
  source: "EVIDENCE" | "SYNTHESIS" | "TENSION" | "STRENGTH_SHADOW";
  synthesisDepth: SynthesisDepth; contextual?: boolean; supportOnly?: boolean; originCandidateId?: string;
};
export type RankedInterpretationCandidate = InterpretationSeed & {
  broadTheme: BroadSemanticTheme; evidenceFamilyDiversity: number; credibleFamilyDiversity: number;
  families: string[]; amplifierOnly: boolean; signatureEligible: boolean; mainEligible: boolean;
  rank: "SIGNATURE" | "MAIN" | "SUPPORT"; rankingScore: number; unpenalizedScore: number;
  rankingFactors: { baseEvidenceImportance: number; synthesisDepthMultiplier: number; familyDiversityMultiplier: number;
    positionFactor: number; confidenceFactor: number; specificityFactor: number; duplicationPenalty: number; amplifierOnlyPenalty: number };
  duplicateGroupId?: string; similarCandidateIds: string[]; semanticOverlapScore: number;
};
export function synthesisDepth(candidate: FoundationSynthesisCandidate): SynthesisDepth {
  const supplied = candidate.metadata?.priorityLevel;
  if (typeof supplied === "number" && [1, 2, 3, 4, 5].includes(supplied)) return supplied as SynthesisDepth;
  if (candidate.source === "TEN_GOD_CHAIN") return 5;
  if (candidate.source === "DAY_MASTER_TEN_GOD") return 4;
  return candidate.source === "STEM" || candidate.source === "BRANCH" ? 1 : 3;
}
const jaccard = (a: readonly string[], b: readonly string[]) => {
  const union = new Set([...a, ...b]); return union.size ? new Set(a.filter(x => b.includes(x))).size / union.size : 0;
};
export function semanticOverlap(a: Pick<RankedInterpretationCandidate, "broadTheme" | "primaryAxes" | "evidenceIds" | "families">,
  b: Pick<RankedInterpretationCandidate, "broadTheme" | "primaryAxes" | "evidenceIds" | "families">) {
  return (a.broadTheme === b.broadTheme ? 0.5 : 0) + 0.3 * jaccard(a.primaryAxes, b.primaryAxes) + 0.2 * Math.max(jaccard(a.evidenceIds, b.evidenceIds), jaccard(a.families, b.families));
}

export function rankInterpretationCandidates(seeds: readonly InterpretationSeed[], evidence: readonly EvidenceAtom[]) {
  const byId = new Map(evidence.map(e => [e.id, e]));
  const candidates: RankedInterpretationCandidate[] = seeds.map(seed => {
    const atoms = sortedUnique(seed.evidenceIds).map(id => byId.get(id)!).filter(Boolean);
    const meaningful = atoms.filter(isMeaningfulEvidence), families = independentFamilies(atoms), credible = independentFamilies(meaningful);
    const amplifierOnly = atoms.every(e => e.tier === "AMPLIFIER");
    // Same-family repetitions cannot inflate importance or independence. Their
    // complete raw/effective sums remain in the axis and family ledgers.
    const representatives = families.map(f => atoms.filter(e => e.family === f).sort((a, b) =>
      CONTENT_TIER_BASE[b.tier][b.strength] * b.weight - CONTENT_TIER_BASE[a.tier][a.strength] * a.weight || lexical(a.id, b.id))[0]);
    const importance = representatives.map(e => CONTENT_TIER_BASE[e.tier][e.strength] * e.weight / positionFactor(e));
    const base = importance.reduce((a, b) => a + b, 0);
    const factor = (fn: (e: EvidenceAtom) => number) => base ? representatives.reduce((n, e, i) => n + importance[i] * fn(e), 0) / base : 1;
    const factors = { baseEvidenceImportance: base, synthesisDepthMultiplier: SYNTHESIS_DEPTH_MULTIPLIER[seed.synthesisDepth],
      familyDiversityMultiplier: diversityMultiplier(credible.length), positionFactor: factor(positionFactor),
      confidenceFactor: factor(e => canonicalConfidence(e) ?? 1),
      specificityFactor: seed.contextual ? SPECIFICITY_FACTOR.contextual : seed.synthesisDepth >= 4 ? SPECIFICITY_FACTOR.composite : seed.synthesisDepth === 3 ? SPECIFICITY_FACTOR.pair : SPECIFICITY_FACTOR.single,
      duplicationPenalty: 0, amplifierOnlyPenalty: amplifierOnly ? CONTENT_RANK_POLICY.amplifierOnlyPenalty : 0 };
    const unpenalizedScore = factors.baseEvidenceImportance * factors.synthesisDepthMultiplier * factors.familyDiversityMultiplier * factors.positionFactor * factors.confidenceFactor * factors.specificityFactor;
    const core = meaningful.some(e => e.tier === "CORE" && e.strength === "STRONG");
    const nonAmplifier = meaningful.some(e => e.tier !== "AMPLIFIER");
    const specific = seed.source !== "EVIDENCE" && (seed.synthesisDepth >= 3 || (core && seed.primaryAxes.length >= 2));
    const signatureEligible = !seed.supportOnly && nonAmplifier && credible.length >= 2 && specific;
    const mainEligible = !seed.supportOnly && nonAmplifier && (core || (specific && credible.length >= 2));
    return { ...seed, broadTheme: broadTheme(seed.primaryAxes, seed.semanticTheme), families, evidenceFamilyDiversity: families.length,
      credibleFamilyDiversity: credible.length, amplifierOnly, signatureEligible, mainEligible, rank: "SUPPORT",
      rankingScore: unpenalizedScore - factors.amplifierOnlyPenalty, unpenalizedScore, rankingFactors: factors, similarCandidateIds: [], semanticOverlapScore: 0 };
  });
  // A shadow view must not outrank the identical original composite merely
  // because its generated identifier sorts first.
  const sourceOrder = { SYNTHESIS: 0, TENSION: 1, EVIDENCE: 2, STRENGTH_SHADOW: 3 } as const;
  const order = (a: RankedInterpretationCandidate, b: RankedInterpretationCandidate) => b.rankingScore - a.rankingScore || b.synthesisDepth - a.synthesisDepth || sourceOrder[a.source] - sourceOrder[b.source] || lexical(a.id, b.id);
  candidates.sort(order);
  const adjacent = new Map(candidates.map(c => [c.id, new Set<string>()]));
  for (let i = 0; i < candidates.length; i++) for (let j = i + 1; j < candidates.length; j++) {
    const a = candidates[i], b = candidates[j], overlap = semanticOverlap(a, b);
    // Opposite directional conclusions are not duplicates of each other.
    const value = (c: RankedInterpretationCandidate, axis: SemanticAxis) => c.evidenceIds.reduce((n, id) => n + (byId.get(id)?.axes[axis] ?? 0) * (byId.get(id)?.weight ?? 0), 0);
    const opposite = BIPOLAR_AXES.some(axis => a.primaryAxes.includes(axis) && b.primaryAxes.includes(axis) && value(a, axis) * value(b, axis) < 0);
    if (overlap < CONTENT_RANK_POLICY.overlapThreshold || opposite) continue;
    adjacent.get(a.id)!.add(b.id); adjacent.get(b.id)!.add(a.id);
    a.semanticOverlapScore = Math.max(a.semanticOverlapScore, overlap); b.semanticOverlapScore = Math.max(b.semanticOverlapScore, overlap);
  }
  const visited = new Set<string>(), duplicateGroups: { id: string; candidateIds: string[] }[] = [];
  for (const c of candidates) {
    c.similarCandidateIds = sortedUnique([...adjacent.get(c.id)!]);
    if (visited.has(c.id) || !adjacent.get(c.id)!.size) continue;
    const ids = new Set<string>(), queue = [c.id];
    while (queue.length) { const id = queue.pop()!; if (ids.has(id)) continue; ids.add(id); visited.add(id); queue.push(...adjacent.get(id)!); }
    const members = candidates.filter(v => ids.has(v.id)), id = `duplicate:${sortedUnique([...ids])[0]}`;
    members.forEach((v, index) => { v.duplicateGroupId = id; v.rankingFactors.duplicationPenalty = DUPLICATION_PENALTIES[Math.min(index, 3)]; v.rankingScore -= v.rankingFactors.duplicationPenalty; });
    duplicateGroups.push({ id, candidateIds: members.map(v => v.id) });
  }
  candidates.sort(order);
  let signatures = 0;
  for (const c of candidates) c.rank = c.signatureEligible && signatures < CONTENT_RANK_POLICY.signatureLimit ? (signatures++, "SIGNATURE") : c.mainEligible ? "MAIN" : "SUPPORT";
  return { candidates, duplicateGroups: duplicateGroups.sort((a, b) => lexical(a.id, b.id)) };
}
