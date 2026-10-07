import { BIPOLAR_AXES, BIPOLAR_DIRECTIONS, type EvidenceAtom, type FoundationSynthesisCandidate, type SemanticAxis } from "./semanticCore";
import { broadTheme, canonicalConfidence, independentFamilies, isMeaningfulEvidence, lexical, sortedUnique, synthesisDepth,
  type BroadSemanticTheme, type InterpretationSeed, type RankedInterpretationCandidate } from "./foundationRanking";
import { SPECIFIC_TEN_GOD_RULES } from "./foundationTenGodSynthesis";

export const MYEONGLI_CONDITION_SPLITS = ["BEFORE_AFTER_DECISION", "START_MAINTAIN", "OUTER_INNER", "NORMAL_PRESSURE", "IDEA_EXECUTION", "SHORT_LONG_TERM", "DESIRE_BEHAVIOR"] as const;
export type MyeongliConditionSplit = typeof MYEONGLI_CONDITION_SPLITS[number];
export type MyeongliTensionCandidate = {
  id: string; axis: SemanticAxis; opposingAxis: SemanticAxis; positiveSideEvidenceIds: string[]; negativeSideEvidenceIds: string[];
  positiveScore: number; negativeScore: number; totalStrength: number; evidenceFamilyDiversity: number;
  candidateConditionSplits: MyeongliConditionSplit[]; semanticTheme: BroadSemanticTheme;
  quality: "SUPPORT" | "MAIN"; sourceDescription: string; confidence?: number;
  metadata: { relationship: "OPPOSITE_DIRECTION" | "CONDITIONAL_COEXISTENCE"; promotion: "INTERNAL_ONLY" };
};
type ConditionRule = { id: string; left: SemanticAxis; right: SemanticAxis; splits: readonly MyeongliConditionSplit[]; description: string; stressRequired?: boolean };
/** Six bounded condition hypotheses, not a Personal Resonance/copy registry.
 * No timing, relationship, workplace or MBTI context is inferred. */
export const MYEONGLI_CONDITION_RULES: readonly ConditionRule[] = [
  { id: "THOUGHT_THEN_ACTION", left: "DEPTH", right: "ACTION_TEMPO", splits: ["BEFORE_AFTER_DECISION"],
    description: "결정 전에는 충분히 생각하지만 답이 정해진 뒤에는 빠르게 움직일 수 있는 구조." },
  { id: "EXPAND_AND_MAINTAIN", left: "EXPANSION", right: "STABILITY", splits: ["START_MAINTAIN", "DESIRE_BEHAVIOR"],
    description: "새로운 일을 키우고 싶어 하면서도 생활이나 운영은 안정적으로 유지하고 싶은 구조." },
  { id: "OUTSIDE_AND_RECOVERY", left: "ENERGY_DIRECTION", right: "RECOVERY_NEED", splits: ["OUTER_INNER"],
    description: "밖에서는 에너지를 잘 쓰지만 끝난 뒤에는 혼자 회복할 시간이 필요한 구조." },
  { id: "SELF_AND_PRESSURE", left: "AUTONOMY", right: "DUTY", splits: ["NORMAL_PRESSURE"], stressRequired: true,
    description: "내 방식대로 하고 싶다가도 책임이 걸리면 지켜야 할 기준을 먼저 살필 수 있습니다." },
  { id: "IDEAS_TO_MAKING", left: "DEPTH", right: "CREATION", splits: ["IDEA_EXECUTION"],
    description: SPECIFIC_TEN_GOD_RULES.find(r => r.id === "UNUSUAL_THOUGHT_TO_OUTPUT")!.humanDescription },
  { id: "OPPORTUNITY_AND_PERSISTENCE", left: "OPPORTUNITY_SENSE", right: "PERSISTENCE", splits: ["SHORT_LONG_TERM"],
    description: "눈앞의 기회도 놓치고 싶지 않지만 오래 붙들고 키울 일도 중요하게 볼 수 있습니다." },
];
const AXIS_SPLITS = {
  ACTION_TEMPO: ["BEFORE_AFTER_DECISION"], ENERGY_DIRECTION: ["OUTER_INNER"], STRUCTURE_STYLE: ["START_MAINTAIN"],
  CHANGE_ORIENTATION: ["DESIRE_BEHAVIOR", "START_MAINTAIN"], DECISION_STYLE: ["BEFORE_AFTER_DECISION"],
  RELATION_STYLE: ["OUTER_INNER"], RISK_STYLE: ["SHORT_LONG_TERM"], COMMUNICATION_STYLE: ["DESIRE_BEHAVIOR"],
} as const;

export function detectMyeongliTensions(evidence: readonly EvidenceAtom[]): MyeongliTensionCandidate[] {
  const atoms = [...evidence].filter(isMeaningfulEvidence).sort((a, b) => lexical(a.id, b.id));
  const result: MyeongliTensionCandidate[] = [];
  function add(id: string, axis: SemanticAxis, opposingAxis: SemanticAxis, left: EvidenceAtom[], right: EvidenceAtom[], splits: readonly MyeongliConditionSplit[], description: string, opposite: boolean) {
    // A single atom supporting two axes is not independent evidence of tension.
    const shared = new Set(left.filter(a => right.some(b => a.id === b.id)).map(e => e.id));
    const a = left.filter(e => !shared.has(e.id)), b = right.filter(e => !shared.has(e.id));
    if (!a.length || !b.length || !a.some(x => b.some(y => x.family !== y.family))) return;
    const positiveScore = a.reduce((sum, e) => sum + Math.abs(e.axes[axis]! * e.weight), 0);
    const negativeScore = b.reduce((sum, e) => sum + Math.abs(e.axes[opposingAxis]! * e.weight), 0);
    if (!positiveScore || !negativeScore) return;
    const confidence = [...a, ...b].map(canonicalConfidence);
    result.push({ id: `tension:${id}`, axis, opposingAxis, positiveSideEvidenceIds: a.map(e => e.id), negativeSideEvidenceIds: b.map(e => e.id),
      positiveScore, negativeScore, totalStrength: positiveScore + negativeScore, evidenceFamilyDiversity: independentFamilies([...a, ...b]).length,
      candidateConditionSplits: [...splits], semanticTheme: broadTheme([axis, opposingAxis]),
      quality: a.some(e => e.tier !== "AMPLIFIER") && b.some(e => e.tier !== "AMPLIFIER") ? "MAIN" : "SUPPORT",
      sourceDescription: description, ...(confidence.every(v => v !== undefined) ? { confidence: Math.min(...confidence as number[]) } : {}),
      metadata: { relationship: opposite ? "OPPOSITE_DIRECTION" : "CONDITIONAL_COEXISTENCE", promotion: "INTERNAL_ONLY" },
    });
  }
  for (const axis of BIPOLAR_AXES) {
    const left = atoms.filter(e => (e.axes[axis] ?? 0) > 0), right = atoms.filter(e => (e.axes[axis] ?? 0) < 0);
    // Source descriptions are existing source strings, not new prose generation.
    const descriptions = sortedUnique([...left, ...right].map(e => e.humanDescription ?? e.easyMeaning));
    add(axis, axis, axis, left, right, AXIS_SPLITS[axis], descriptions.join(" "), true);
  }
  for (const rule of MYEONGLI_CONDITION_RULES) {
    const left = atoms.filter(e => (e.axes[rule.left] ?? 0) > 0);
    const right = atoms.filter(e => (e.axes[rule.right] ?? 0) > 0 && (!rule.stressRequired || e.contexts.includes("stress")));
    add(rule.id, rule.left, rule.right, left, right, rule.splits, rule.description, false);
  }
  return result.sort((a, b) => b.totalStrength - a.totalStrength || lexical(a.id, b.id));
}

export type HumanPatternType = "COMPOSITE" | "TENSION" | "STRENGTH_SHADOW" | "PROCESS" | "VALUE_CONFLICT";
export type StrengthShadowPair = { semanticTheme: string; evidenceIds: string[]; strengthDescription: string; shadowDescription: string };
export type MyeongliHumanPatternCandidate = {
  id: string; patternType: HumanPatternType; semanticTheme: string; evidenceIds: string[]; primaryAxes: SemanticAxis[];
  sourceDescription: string; positiveMeaning?: string; shadowMeaning?: string; specificityScore: number;
  evidenceDiversity: number; rankingScore: number; candidateConditionSplit?: MyeongliConditionSplit;
};

export function buildInterpretationSeeds(evidence: readonly EvidenceAtom[], synthesis: readonly FoundationSynthesisCandidate[], tensions: readonly MyeongliTensionCandidate[]): InterpretationSeed[] {
  const seeds: InterpretationSeed[] = evidence.map(e => ({ id: `single:${e.id}`, source: "EVIDENCE", semanticTheme: e.family,
    evidenceIds: [e.id], primaryAxes: Object.keys(e.axes) as SemanticAxis[], humanDescription: e.humanDescription ?? e.easyMeaning,
    ...(e.positiveMeaning ? { positiveMeaning: e.positiveMeaning } : {}), ...(e.shadowMeaning ? { shadowMeaning: e.shadowMeaning } : {}),
    synthesisDepth: e.tier === "CORE" && e.strength === "STRONG" ? 2 : 1, supportOnly: !isMeaningfulEvidence(e) }));
  // Existing pillar meanings remain visible too; overlap is flagged, not deleted.
  for (const c of synthesis) seeds.push({
    id: `synthesis:${c.id}`, source: "SYNTHESIS", originCandidateId: c.id, semanticTheme: c.semanticTheme,
    evidenceIds: [...c.evidenceIds], primaryAxes: [...c.primaryAxes], humanDescription: c.humanDescription,
    ...(c.positiveMeaning ? { positiveMeaning: c.positiveMeaning } : {}), ...(c.shadowMeaning ? { shadowMeaning: c.shadowMeaning } : {}), synthesisDepth: synthesisDepth(c),
  });
  for (const t of tensions) seeds.push({ id: t.id, source: "TENSION", semanticTheme: t.semanticTheme,
    evidenceIds: sortedUnique([...t.positiveSideEvidenceIds, ...t.negativeSideEvidenceIds]), primaryAxes: [...new Set([t.axis, t.opposingAxis])],
    humanDescription: t.sourceDescription, synthesisDepth: 3, contextual: true, supportOnly: t.quality === "SUPPORT" });
  for (const source of [...seeds].filter(s => s.source !== "TENSION" && s.positiveMeaning && s.shadowMeaning)) seeds.push({
    ...source, id: `shadow:${source.id}`, source: "STRENGTH_SHADOW", originCandidateId: source.id,
  });
  return seeds;
}
const VALUE_THEMES = new Set(["MONEY_AND_MEANING", "SELF_VS_RULE", "EXPRESSION_VS_RULE"]);
const PROCESS_THEMES = new Set(["LEARN_OWN_USE", "LEARNING_TO_OUTPUT", "SELF_TO_OUTPUT", "OUTPUT_TO_WEALTH", "SELF_OUTPUT_TO_VALUE", "RESULT_TO_MONEY_TO_STATUS", "RESULT_RESPONSIBILITY_EXPERTISE", "RESPONSIBILITY_TO_SELF_STANDARD", "UNUSUAL_THOUGHT_TO_OUTPUT"]);
export function buildHumanPatterns(candidates: readonly RankedInterpretationCandidate[], tensions: readonly MyeongliTensionCandidate[]) {
  const humanPatternCandidates: MyeongliHumanPatternCandidate[] = candidates.filter(c => c.source !== "EVIDENCE" && !(c.source === "SYNTHESIS" && c.synthesisDepth < 3)).map(c => {
    const t = tensions.find(t => t.id === c.id);
    const patternType: HumanPatternType = c.source === "STRENGTH_SHADOW" ? "STRENGTH_SHADOW" : c.source === "TENSION" ? "TENSION" : VALUE_THEMES.has(c.semanticTheme) ? "VALUE_CONFLICT" : PROCESS_THEMES.has(c.semanticTheme) ? "PROCESS" : "COMPOSITE";
    return { id: c.id, patternType, semanticTheme: c.semanticTheme, evidenceIds: c.evidenceIds, primaryAxes: c.primaryAxes,
      sourceDescription: c.humanDescription, ...(c.positiveMeaning ? { positiveMeaning: c.positiveMeaning } : {}), ...(c.shadowMeaning ? { shadowMeaning: c.shadowMeaning } : {}),
      specificityScore: c.rankingFactors.specificityFactor, evidenceDiversity: c.evidenceFamilyDiversity, rankingScore: c.rankingScore,
      ...(t?.candidateConditionSplits[0] ? { candidateConditionSplit: t.candidateConditionSplits[0] } : {}) };
  });
  const strengthShadowPairs: StrengthShadowPair[] = candidates.filter(c => c.source === "STRENGTH_SHADOW").map(c => ({
    semanticTheme: c.semanticTheme, evidenceIds: c.evidenceIds, strengthDescription: c.positiveMeaning!, shadowDescription: c.shadowMeaning!,
  }));
  return { humanPatternCandidates, strengthShadowPairs };
}

// Labels for future debug inspectors only; no customer renderer is imported.
export const TENSION_DIRECTION_LABELS = BIPOLAR_DIRECTIONS;
