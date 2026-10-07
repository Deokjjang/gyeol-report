import { broadTheme, isMeaningfulEvidence } from "./foundationRanking";
import { CLAIM_REGISTRY } from "./claimRegistry";
import { PERSONAL_RESONANCE_REGISTRY } from "./personalResonanceRegistry";
import { CLAIM_SECTION_PREFERENCES } from "./comprehensiveSectionContracts";
import type { ComprehensivePlanInputs, EditorialCandidate as Candidate, EditorialRefs, ComprehensiveSectionId as S, SectionSlot, OperatingManualSlot } from "./comprehensivePlanCore";

export const editorialUnique = <T extends string>(xs: readonly T[]): T[] => [...new Set(xs)].sort();
const rankValue = { SUPPORT: .4, MAIN: .8, SIGNATURE: 1 } as const;
const bandValue = { LOW: .3, MEDIUM: .75, HIGH: 1 } as const;
export function guidanceRuleType(problemId: string): OperatingManualSlot {
  const n = Number(problemId.slice(1));
  return n <= 6 ? "THINKING" : n <= 12 ? "EXECUTION" : n <= 18 ? "WORK_MONEY" : n <= 28 ? "RELATIONSHIP" : n <= 34 ? "WORK_MONEY" : "RECOVERY";
}
const sectionForRule: Record<OperatingManualSlot, S> = { THINKING: "C6", EXECUTION: "C8", WORK_MONEY: "C8", RELATIONSHIP: "C7", RECOVERY: "C9" };

/** Only normalizes existing, validated meanings. sourceText is copied verbatim,
 * never concatenated into paragraphs or made more confident here. */
export function collectComprehensiveCandidates(i: ComprehensivePlanInputs): Candidate[] {
  const rows: Candidate[] = [];
  const atomIds = new Set(i.myeongli.evidence.map(e => e.id)), sourceIds = new Set(i.mbti.sourceNodes.map(n => n.id));
  const fusion = [...i.fusion.reinforce, ...i.fusion.tensions, ...i.fusion.complements];
  const refs = (evidence: readonly string[], other: Partial<EditorialRefs> = {}): EditorialRefs => {
    // Upstream derived IDs point back to these roots, never to synthetic evidence.
    const ids = editorialUnique(evidence);
    return { evidenceIds: ids, underlyingEvidenceIds: ids, myeongliEvidenceIds: ids.filter(id => atomIds.has(id)), mbtiSourceNodeIds: ids.filter(id => sourceIds.has(id)),
      fusionIds: [], claimIds: [], resonanceIds: [], traitArcIds: [], guidanceIds: [], ...other };
  };
  function add(c: Pick<Candidate, "sourceType" | "sourceId" | "sourceText" | "semanticTheme" | "primaryAxes" | "contexts"> & Partial<Candidate>) {
    const r = refs(c.evidenceIds ?? [], c), atoms = i.myeongli.evidence.filter(e => r.myeongliEvidenceIds.includes(e.id));
    const family = broadTheme(c.primaryAxes, c.semanticTheme);
    const applicable: S[] = ["C1", "C4", ...(c.contexts.some(x => x === "social" || x === "love") ? ["C7" as const] : []), ...(c.contexts.some(x => x === "work" || x === "money" || x === "learning") ? ["C8" as const] : []), ...(c.contexts.includes("recovery") ? ["C9" as const] : [])];
    const independentFamilies = editorialUnique([...atoms.filter(isMeaningfulEvidence).map(e => e.family), ...r.mbtiSourceNodeIds.map(id => `mbti:${i.mbti.sourceNodes.find(n => n.id === id)?.sourceDomain ?? "source"}`)]);
    const defaults: Candidate = {
      id: `editorial:${c.sourceType}:${c.sourceId}`, sourceType: c.sourceType, sourceId: c.sourceId, sourceText: c.sourceText, semanticTheme: c.semanticTheme,
      broadTheme: family, primaryAxes: c.primaryAxes, contexts: c.contexts, ...r,
      allowedSections: applicable, preferredSections: ["C4"], confidence: .8, specificity: .8, emotionalValue: .75, fusionValue: r.fusionIds.length ? .8 : 0,
      inputFit: .5, evidenceDiversity: Math.min(1, independentFamilies.length / 3), independentFamilies, independentEvidenceCount: r.underlyingEvidenceIds.length,
      positiveValence: 1, negativeValence: 0, genericness: 0, priorityScore: 0, rank: "MAIN", emotionTags: ["RELATABLE", "UPLIFTING"], slots: [],
      fortune: false, fortuneFamilies: [], compositeFortune: false, factBomb: false, precursorIds: [], guidanceMerged: false,
      elementComposite: false, strongYinYang: false, primaryEligible: true, invalidReasons: [],
    };
    const row: Candidate = { ...defaults, ...c, ...r };
    row.id = c.id ?? defaults.id;
    row.broadTheme = c.broadTheme ?? family;
    row.allowedSections = editorialUnique(row.allowedSections);
    row.preferredSections = row.preferredSections.filter(s => row.allowedSections.includes(s));
    row.primaryEligible = row.primaryEligible && row.rank !== "SUPPORT";
    row.slots = editorialUnique([...row.slots,
      ...(row.contexts.includes("social") && !row.factBomb && row.arcRole !== "SHADOW" ? ["OTHERS_SEE_ME", "RELATION_STRENGTH"] as SectionSlot[] : []),
      ...(row.contexts.includes("love") && !row.factBomb && row.arcRole !== "SHADOW" ? ["LOVE_STYLE"] as SectionSlot[] : []),
      ...((row.factBomb || row.arcRole === "SHADOW") && row.contexts.some(x => x === "social" || x === "love") ? ["RELATION_RISK"] as SectionSlot[] : []),
      ...(row.contexts.includes("work") && !row.fortune && !row.factBomb ? ["WORK_STYLE", "CURRENT_CONTEXT"] as SectionSlot[] : []),
      ...(row.contexts.includes("money") && !row.fortune && !row.factBomb ? ["MONEY_STYLE"] as SectionSlot[] : []),
      ...(row.contexts.includes("recovery") || row.primaryAxes.includes("RECOVERY_NEED") ? ["RECOVERY_STYLE"] as SectionSlot[] : []),
      ...(row.elementComposite ? ["ELEMENT_COMPOSITE", "ENVIRONMENT"] as SectionSlot[] : []),
      ...(row.strongYinYang ? ["YIN_YANG"] as SectionSlot[] : []),
    ]);
    if (row.primaryAxes.some(a => ["GOAL_DRIVE", "CREATION", "PERSISTENCE"].includes(a))) row.slots.push("RESULT_STYLE");
    if (row.primaryAxes.includes("STATUS_DRIVE")) row.slots.push("SUCCESS_DESIRE");
    rows.push(row);
  }

  const core = i.resonance.bestCoreGyeol;
  if (core) add({ sourceType: "CORE_GYEOL", sourceId: core.id, sourceText: core.humanDescription, semanticTheme: core.primaryTheme,
    primaryAxes: editorialUnique(i.resonance.candidates.filter(c => core.sourceResonanceIds.includes(c.id)).flatMap(c => c.primaryAxes)), contexts: ["identity"],
    ...refs(core.evidenceIds, { resonanceIds: core.sourceResonanceIds, claimIds: core.sourceClaimIds, fusionIds: core.sourceFusionIds }),
    allowedSections: ["C1"], preferredSections: ["C1"], confidence: core.evidenceConfidence, specificity: core.personalSpecificity, evidenceDiversity: core.evidenceDiversity,
    emotionalValue: core.emotionalImpact, fusionValue: core.fusionValue, genericness: core.genericness, rank: "SIGNATURE",
    invalidReasons: core.diagnostics.eligibleBest && core.diagnostics.concepts.length <= 3 ? [] : ["INVALID_CORE_QUALITY"] });

  for (const c of i.resonance.candidates) {
    const definition = PERSONAL_RESONANCE_REGISTRY.find(d => d.id === c.ruleId);
    add({ sourceType: "PERSONAL_RESONANCE", sourceId: c.id, sourceText: c.humanDescription, semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: c.contexts,
      ...refs([...c.evidence.myeongliEvidenceIds, ...c.evidence.mbtiSourceNodeIds], { resonanceIds: [c.id], claimIds: c.evidence.claimIds, fusionIds: c.evidence.fusionCandidateIds }),
      rank: c.rank, confidence: rankValue[c.rank], specificity: c.specificity, emotionalValue: c.emotionalImpact, fusionValue: c.fusionValue, genericness: c.genericness,
      ...(definition?.polarity === "neutral" ? { positiveValence: .5, negativeValence: .5 } : {}),
      semanticOverlapGroup: c.semanticGroup, duplicateGroupId: c.duplicateGroupId, conflictGroupId: c.conflictGroupId,
      conditionSplit: c.conditionSplit, thirdInterpretationSource: c.conditionSplit?.resolved ? c.id : undefined,
      ...(definition?.polarity === "shadow" ? { factBomb: true, positiveValence: 0, negativeValence: 1, emotionTags: ["FACT_BOMB" as const], preferredSections: ["C6" as const], allowedSections: ["C6" as const, ...(c.contexts.some(x => x === "social" || x === "love") ? ["C7" as const] : []), ...(c.contexts.includes("recovery") ? ["C9" as const] : [])] } : {}),
      invalidReasons: [...(c.diagnostics.unsupportedSpecificity ? ["UNSUPPORTED_SPECIFICITY"] : []), ...(c.diagnostics.unresolvedContradiction ? ["UNRESOLVED_CONTRADICTION"] : []), ...(c.diagnostics.amplifierOnly ? ["AMPLIFIER_ONLY"] : [])],
      slots: c.conditionSplit?.type === "STRANGER_CLOSE" ? ["CLOSE_RELATION_CHANGE"] : [],
    });
  }
  for (const c of i.claims.candidates) {
    const definition = CLAIM_REGISTRY.find(d => d.id === c.id);
    const charmAtoms = i.myeongli.evidence.filter(e => c.evidence.myeongliEvidenceIds.includes(e.id));
    const families = c.id === "S08_MONEY_AND_HONOR" ? ["MONEY_FORTUNE", "HONOR_POSITION"] : c.id === "A05_ROMANTIC_VISIBILITY" ? editorialUnique(charmAtoms.flatMap(e => [
      ...(e.fortuneTags?.INTIMATE_CHARM ? ["CHARM_INTIMACY"] : []), ...(e.fortuneTags?.FIRST_IMPRESSION || e.fortuneTags?.SOCIAL_VISIBILITY ? ["CHARM_VISIBILITY"] : []),
    ])) : c.fortuneClaim ? [c.exclusivityGroup] : [];
    add({ sourceType: "CLAIM", sourceId: c.id, sourceText: c.customerClaim, semanticTheme: c.semanticTheme, primaryAxes: definition?.requiredAxes.map(a => a.axis) ?? [], contexts: c.contexts,
      ...refs([...c.evidence.myeongliEvidenceIds, ...c.evidence.mbtiSourceNodeIds], { claimIds: [c.id], fusionIds: c.evidence.fusionCandidateIds }),
      rank: c.level >= 4 ? "SIGNATURE" : c.level >= 2 ? "MAIN" : "SUPPORT", confidence: bandValue[c.confidenceBand], specificity: c.level >= 3 ? .9 : .65,
      claimCategory: c.category, claimLevel: c.level, fortune: c.fortuneClaim, fortuneFamilies: families, compositeFortune: c.id === "S08_MONEY_AND_HONOR",
      factBomb: c.factBomb, positiveValence: c.factBomb ? 0 : 1, negativeValence: c.factBomb ? 1 : 0,
      emotionTags: c.factBomb ? ["FACT_BOMB"] : c.fortuneClaim ? ["FORTUNE_REWARD"] : ["UPLIFTING"],
      allowedSections: c.fortuneClaim ? ["C5", "C7", "C8"] : c.factBomb ? ["C6", ...(c.contexts.some(x => x === "social" || x === "love") ? ["C7" as const] : [])] : editorialUnique([...(CLAIM_SECTION_PREFERENCES[c.category] ?? []), ...(c.contexts.some(x => x === "love" || x === "social") ? ["C7" as const] : []), ...(c.contexts.includes("work") || c.contexts.includes("money") ? ["C8" as const] : []), "C5"]),
      preferredSections: c.fortuneClaim ? ["C5"] : CLAIM_SECTION_PREFERENCES[c.category],
      ...(c.fortuneClaim ? { broadTheme: `FORTUNE:${c.id === "S08_MONEY_AND_HONOR" ? "WEALTH_HONOR" : families.join("+")}` } : c.category === "MONEY_STYLE" ? { broadTheme: "MONEY_AND_REALITY" } : {}),
      invalidReasons: c.fortuneClaim && (!c.diagnostics.primaryMyeongliGatePassed || c.level > c.maxAllowedLevel) ? ["FORBIDDEN_FORTUNE_PROMOTION"] : [],
      conflictGroupId: c.conflictGroupId, semanticOverlapGroup: c.exclusivityGroup,
    });
  }
  for (const c of fusion) add({ sourceType: "FUSION", sourceId: c.id, sourceText: c.sourceDescription, semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: c.contexts,
    ...refs([...c.myeongli.evidenceIds, ...c.mbti.sourceNodeIds], { fusionIds: [c.id] }),
    rank: c.strength, confidence: rankValue[c.strength], specificity: c.type === "TENSION" ? 1 : .85, fusionValue: 1, fusionType: c.type,
    allowedSections: [c.type === "REINFORCE" ? "C2" : "C3", "C4", "C7", "C8", "C9"], preferredSections: [c.type === "REINFORCE" ? "C2" : "C3"],
    conditionSplit: c.conditionSplit, thirdInterpretationSource: c.conditionSplit?.resolved ? c.id : undefined,
    emotionTags: ["SURPRISING", "DISCOVERY"], duplicateGroupId: c.duplicateGroupId,
    invalidReasons: [...(!c.mbti.actualSourceEvidenceIds.length ? ["PRIOR_ONLY_FUSION"] : []), ...(c.amplifierOnly ? ["AMPLIFIER_ONLY"] : []), ...(c.type === "TENSION" && !c.conditionSplit?.resolved ? ["UNRESOLVED_TENSION"] : [])],
  });
  for (const c of i.resonance.traitArcs) {
    for (const role of ["STRENGTH", "SHADOW"] as const) {
      const proof = role === "STRENGTH" ? c.provenance.strength : c.provenance.shadow;
      if (!proof || role === "SHADOW" && !c.shadowDescription) continue;
      add({ sourceType: "TRAIT_ARC", sourceId: c.id, id: `editorial:TRAIT_ARC:${c.id}:${role}`, sourceText: role === "STRENGTH" ? c.strengthDescription : c.shadowDescription!, semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: c.contexts,
        ...refs([...proof.myeongliEvidenceIds, ...proof.mbtiSourceNodeIds], { traitArcIds: [c.id], resonanceIds: proof === c.provenance.strength ? c.sourceResonanceIds : [], claimIds: proof.claimIds, fusionIds: proof.fusionCandidateIds }),
        rank: c.strengthRank, confidence: rankValue[c.strengthRank], arcRole: role,
        allowedSections: role === "STRENGTH" ? ["C4", "C5", "C7", "C8", "C9"] : ["C6", "C7", "C9"], preferredSections: [role === "STRENGTH" ? "C4" : "C6"],
        positiveValence: role === "STRENGTH" ? 1 : 0, negativeValence: role === "SHADOW" ? 1 : 0, factBomb: role === "SHADOW", emotionTags: [role === "STRENGTH" ? "UPLIFTING" : "FACT_BOMB"],
      });
    }
  }
  for (const c of i.myeongli.rankedCandidates) {
    const atoms = i.myeongli.evidence.filter(e => c.evidenceIds.includes(e.id));
    const synthesis = i.myeongli.synthesisCandidates.find(x => x.id === c.originCandidateId);
    const tension = i.myeongli.tensionCandidates.find(x => x.id === c.id);
    const elementComposite = !!synthesis && ["ELEMENT_PAIR", "STRONGEST_WEAKEST", "YIN_YANG_ELEMENT"].includes(synthesis.source);
    const strongYinYang = atoms.some(e => e.sourceType === "yin_yang" && /^(STRONG|EXTREME)_/.test(e.sourceKey));
    add({ sourceType: "MYEONGLI_PATTERN", sourceId: c.id, sourceText: c.humanDescription, semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes,
      contexts: synthesis?.contexts ?? editorialUnique(atoms.flatMap(e => e.contexts)), ...refs(c.evidenceIds), broadTheme: c.broadTheme,
      rank: c.rank, confidence: rankValue[c.rank], specificity: Math.min(1, c.rankingFactors.specificityFactor / 1.15), duplicateGroupId: c.duplicateGroupId,
      elementComposite, strongYinYang, allowedSections: c.source === "TENSION" ? ["C3", "C9"] : ["C1", "C2", "C3", "C4", "C5", "C7", "C8", "C9"], preferredSections: elementComposite || strongYinYang ? ["C9"] : ["C4"],
      primaryEligible: c.mainEligible && !c.amplifierOnly && !atoms.every(e => ["shinsal", "gwiin", "twelve_stage"].includes(e.sourceType)) && c.source !== "STRENGTH_SHADOW",
      ...(tension?.quality === "MAIN" && tension.metadata.relationship === "CONDITIONAL_COEXISTENCE" ? { internalComplexity: { sideA: tension.positiveSideEvidenceIds, sideB: tension.negativeSideEvidenceIds, hypotheses: tension.candidateConditionSplits, sourceId: tension.id } } : {}),
      invalidReasons: atoms.every(e => e.sourceType === "yin_yang" && e.sourceKey === "BALANCED") ? ["BALANCED_NOT_A_STORY"] : c.amplifierOnly ? ["AMPLIFIER_ONLY"] : c.source === "TENSION" && (!tension || tension.metadata.relationship === "OPPOSITE_DIRECTION") ? ["UNRESOLVED_INTERNAL_TENSION"] : [],
    });
  }
  for (const c of [...i.guidance.guidanceCandidates, ...i.guidance.mergedGuidance]) {
    const problems = i.guidance.problems.filter(p => p.id === c.problemId || c.mergedFromGuidanceIds?.includes(`guidance:${p.id}`));
    const arcs = i.resonance.traitArcs.filter(a => c.sourceTraitArcIds.includes(a.id));
    const resonances = i.resonance.candidates.filter(r => c.sourceResonanceIds.includes(r.id));
    const claimAxes = i.claims.candidates.filter(x => c.sourceClaimIds.includes(x.id)).flatMap(x => CLAIM_REGISTRY.find(d => d.id === x.id)?.requiredAxes.map(a => a.axis) ?? []);
    const axes = editorialUnique([...arcs.flatMap(a => a.primaryAxes), ...resonances.flatMap(r => r.primaryAxes), ...claimAxes]);
    const rule = guidanceRuleType(c.problemId);
    add({ sourceType: "GUIDANCE", sourceId: c.id, sourceText: c.customerAdvice, semanticTheme: problems[0]?.semanticTheme ?? c.problem, primaryAxes: axes, contexts: editorialUnique(problems.flatMap(p => p.contexts)),
      ...refs(c.evidenceIds, { guidanceIds: [c.id], resonanceIds: c.sourceResonanceIds, claimIds: c.sourceClaimIds, traitArcIds: c.sourceTraitArcIds, fusionIds: c.sourceFusionIds }),
      rank: c.confidence === "HIGH" ? "SIGNATURE" : c.confidence === "MEDIUM" ? "MAIN" : "SUPPORT", confidence: bandValue[c.confidence], specificity: c.diagnostics.personalSpecificity, inputFit: c.contextFit,
      allowedSections: ["C6", sectionForRule[rule], "C10"], preferredSections: [sectionForRule[rule], "C10"], positiveValence: 1, negativeValence: 0,
      operatingRuleType: rule, problemId: c.problemId, strategyIds: c.selectedStrategyIds, guidanceMerged: !!c.mergedFromGuidanceIds,
      precursorIds: editorialUnique([...c.sourceResonanceIds, ...c.sourceClaimIds, ...c.sourceTraitArcIds, ...c.sourceFusionIds]),
      emotionTags: ["PRACTICAL"], slots: [rule, ...(rule === "RELATIONSHIP" ? ["RELATION_GUIDANCE"] as SectionSlot[] : rule === "RECOVERY" ? ["RECOVERY_GUIDANCE"] as SectionSlot[] : rule === "WORK_MONEY" ? ["WORK_GUIDANCE"] as SectionSlot[] : [])],
      invalidReasons: [...(c.confidence === "LOW" ? ["LOW_GUIDANCE"] : []), ...(c.conflictGroupId && !c.mergedFromGuidanceIds ? ["USE_MERGED_GUIDANCE"] : []), ...(c.applicability === "FORBIDDEN" || c.diagnostics.unsafeContextPenalty ? ["UNSAFE_GUIDANCE"] : [])],
    });
  }
  // Context fit changes editorial relevance only, never the candidate population.
  for (const c of rows.filter(c => c.sourceType !== "GUIDANCE")) {
    const relevant = i.guidance.topGuidance.filter(g => g.sourceTraitArcIds.some(id => c.traitArcIds.includes(id)) || g.sourceResonanceIds.some(id => c.resonanceIds.includes(id)) || g.sourceClaimIds.some(id => c.claimIds.includes(id)));
    c.inputFit = Math.max(c.inputFit, ...relevant.map(g => g.contextFit));
    c.traitArcIds = editorialUnique([...c.traitArcIds, ...i.resonance.traitArcs.filter(a => a.sourceResonanceIds.some(id => c.resonanceIds.includes(id)) || a.sourceClaimIds.some(id => c.claimIds.includes(id))).map(a => a.id)]);
  }
  return structuredClone(rows).sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}
