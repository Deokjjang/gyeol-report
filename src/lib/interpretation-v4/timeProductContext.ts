import "server-only";
import { createHash } from "node:crypto";
import { buildRelationshipProfiles } from "./relationshipProductView";
import { collectComprehensiveCandidates } from "./comprehensiveCandidateAdapter";
import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { MAJOR_MEANINGS } from "./majorMaterials";
import { renderNarrativeBlock } from "./narrativeBlockRenderer";
import { freshNarrativeMemory } from "./narrativeMemory";
import { directHumanSurface, fusionHumanSurface } from "./narrativeHumanSurface";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { particle } from "./copyRealizer";
import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import type { NarrativeInput, NarrativeBlock } from "./narrativeTypes";
import type { ComprehensivePlanInputs, EditorialCandidate } from "./comprehensivePlanCore";
import type { NarrativePhrase } from "./narrativeCore";
import type { InterpretationContext, SemanticAxis } from "./semanticCore";

export type TimeProductPeriod = {
  id: string; label: string; kind: "dayun" | "year" | "month";
  tenGod: TenGod; sourceRefs: readonly string[];
};
export type TimeContextProjection = {
  natalProfile: ComprehensivePlanInputs;
  timePeriod: TimeProductPeriod;
  timeEvidence: readonly string[];
  activatedThemes: readonly SemanticAxis[];
  supportedClaims: readonly EditorialCandidate[];
  opportunities: string; pressures: string;
  practicalContexts: readonly InterpretationContext[];
};

/** Product-local join, not a time semantic/scoring engine. The existing profile
 * builder is domain-neutral; its relationship projection is deliberately NOT used.
 * Periods reuse the already-calculated ten-god and its frozen semantic definition.
 * Natal fortune claims never become time claims, even at Level 4. */
export function createTimeProductContext(input: NarrativeInput, version: string) {
  const built = buildRelationshipProfiles(input);
  if (!built.ok) return built;
  const profiles = built.profiles;
  const candidates = collectComprehensiveCandidates(profiles).filter(c => c.primaryEligible && !c.invalidReasons.length
    && !c.fortune && !c.factBomb && !["CORE_GYEOL", "GUIDANCE"].includes(c.sourceType)
    && (!c.fusionType || c.fusionType === "REINFORCE"));
  const stableKey = createHash("sha256").update(JSON.stringify([version, input.name, input.calculation.pillars, input.mbti || null])).digest("hex");
  let memory = freshNarrativeMemory();
  const usedThemes = new Set<string>();
  const usedHuman = new Set<string>(), usedPeriodThemes = new Set<string>();
  const represented: { period: string; candidate: string; theme: string; natalEvidence: string[]; timeEvidence: readonly string[]; mbtiNodes: string[]; pattern: string }[] = [];
  function project(period: TimeProductPeriod): TimeContextProjection {
    const semantics = Object.values(TEN_GOD_SEMANTICS).find(s => s.label === period.tenGod)!;
    const axes = Object.keys(semantics.axes) as SemanticAxis[];
    const contexts: readonly InterpretationContext[] = semantics.contexts;
    return { natalProfile: profiles, timePeriod: period, timeEvidence: period.sourceRefs,
      activatedThemes: axes, practicalContexts: contexts,
      // This is relevance, NOT a claim that natal and transit reinforce each other.
      // Preserve upstream rank/confidence; no new score, weight or threshold.
      supportedClaims: period.sourceRefs.length ? candidates.filter(c => c.primaryAxes.some(a => axes.includes(a)) && c.contexts.some(x => contexts.includes(x)))
        .sort((a, b) => Number(b.sourceType === "FUSION") - Number(a.sourceType === "FUSION")
          || Number(b.rank === "SIGNATURE") - Number(a.rank === "SIGNATURE") || b.confidence - a.confidence || a.id.localeCompare(b.id)) : [],
      opportunities: MAJOR_MEANINGS[period.tenGod].gift, pressures: MAJOR_MEANINGS[period.tenGod].cost };
  }
  function render(p: TimeContextProjection): NarrativeBlock | undefined {
    // Four distinct baseline applications at most, never 12/14 personality repeats.
    if (represented.length >= 4 || !p.timeEvidence.length || usedPeriodThemes.has(p.timePeriod.tenGod)) return;
    for (const c of p.supportedClaims) {
      const theme = c.duplicateGroupId ?? c.semanticOverlapGroup ?? c.semanticTheme;
      if (usedThemes.has(theme)) continue;
      const context = c.contexts.find(x => p.practicalContexts.includes(x))!;
      const fusion = profiles.fusion.reinforce.find(f => f.id === c.sourceId);
      const reason = fusion && memory.usedExplicitMbtiMentions < 3 ? humanMbtiReason(profiles, fusion, context === "work" || context === "money" ? "C8" : "C1", memory) : undefined;
      const refs = { evidenceIds: c.myeongliEvidenceIds, claimIds: c.claimIds, fusionIds: c.fusionIds,
        resonanceIds: c.resonanceIds, guidanceIds: c.guidanceIds, mbtiSourceNodeIds: c.mbtiSourceNodeIds };
      const atom = profiles.myeongli.evidence.find(e => c.myeongliEvidenceIds.includes(e.id) && c.primaryAxes.some(a => e.axes[a]));
      const human = directHumanSurface(c) ?? fusionHumanSurface(c) ?? atom?.humanDescription;
      if (!human || usedHuman.has(human)) continue;
      const common = { semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: [context], directnessLevel: c.claimLevel ?? 2, refs };
      const phrases: NarrativePhrase[] = [
        { ...common, id: `${p.timePeriod.id}:time`, role: "DIRECT_CLAIM", origin: "MYEONGLI",
          refs: { evidenceIds: p.timeEvidence, claimIds: [], fusionIds: [], resonanceIds: [], guidanceIds: [], mbtiSourceNodeIds: [] },
          text: `${p.timePeriod.label}, ${particle(MAJOR_MEANINGS[p.timePeriod.tenGod].theme, "을", "를")} 다루는 때예요.` },
        { ...common, id: `${p.timePeriod.id}:natal`, role: "MYEONGLI_REASON", origin: "MYEONGLI", text: `평소에는 ${human}` },
        ...(reason ? [{ ...common, id: `${p.timePeriod.id}:mbti`, role: "MBTI_REASON" as const, origin: "MBTI_ACTUAL" as const,
          text: reason.text, refs: { ...refs, mbtiSourceNodeIds: [reason.nodeId] } }] : []),
      ];
      for (const patternId of reason ? ["P28", "P29"] : ["P01", "P24", "P03"]) {
      const result = renderNarrativeBlock({ source: { id: `${p.timePeriod.id}:${c.id}`, sourceType: reason ? "FUSION" : "MYEONGLI_EVIDENCE",
        ...(reason ? { fusionType: "REINFORCE" as const } : {}),
        semanticTheme: c.semanticTheme, primaryAxes: c.primaryAxes, contexts: [context], confidence: "MEDIUM",
        directnessLevel: common.directnessLevel, phrases }, reportStableKey: stableKey, sectionId: p.timePeriod.id,
        intent: reason ? "REINFORCE" : "HUMAN", context, depthIntent: "NORMAL", presentationIntent: reason ? "EXPLICIT" : "HIDDEN", explicitMbtiBudget: 3, patternId }, memory);
      if (!result.ok) continue; // Sparse is valid. Never fabricate a fallback trait.
      memory = result.nextMemory; usedThemes.add(theme); usedHuman.add(human); usedPeriodThemes.add(p.timePeriod.tenGod);
      const mbtiNodes = result.block.sentences.flatMap(s => s.role === "MBTI_REASON" ? s.mbtiSourceNodeIds : []);
      represented.push({ period: p.timePeriod.id, candidate: c.id, theme, natalEvidence: c.myeongliEvidenceIds,
        timeEvidence: p.timeEvidence, mbtiNodes, pattern: result.block.patternId });
      return { id: `${p.timePeriod.id}-natal-response`, text: result.block.plainText, mode: "prose", tone: "observation",
        proof: { features: [], seedIds: [], fusionIds: c.fusionIds, sourceRefs: [...c.evidenceIds, ...c.claimIds, ...c.resonanceIds, ...p.timeEvidence, ...mbtiNodes] } };
      }
    }
  }
  return { ok: true as const, project, render, represented,
    personalDigest: createHash("sha256").update(JSON.stringify(profiles)).digest("hex"),
    natalBuilds: 1 as const, timeClaimSource: "canonical-period-only" as const };
}
