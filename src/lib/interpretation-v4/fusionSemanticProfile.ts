import { SEMANTIC_AXES, BIPOLAR_AXES } from "./semanticCore";
import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { GYEOL_FUSION_ENGINE_VERSION, FUSION_RANK_POLICY, type FusionCandidate, type FusionResult, type FusionSide, type AxisRequirement } from "./fusionCore";
import { FUSION_CONTEXTS, selectFusionPair } from "./fusionContext";
import { adaptMbtiFusionSide, adaptMyeongliFusionSide, inspectFusionInputs } from "./fusionProfileAdapter";
import { fusionAxisMeaning } from "./fusionMeanings";
import { resolveFusionTension } from "./fusionTension";
import { FUSION_COMPLEMENT_RULES, FUSION_COMPLEMENT_REGISTRY_VERSION } from "./fusionComplementRegistry";
import { makeFusionCandidate, rankFusionCandidates } from "./fusionRanking";
import { emptyFusionDiagnostics, inspectFusionRegistry, inspectFusionMyeongliSource, validateFusionCandidates, completeFusionDiagnostics, fusionDebugCandidates, stableFusionIssues } from "./fusionDiagnostics";

/** First comparison boundary. Neither source builder calls this module; no
 * writer, runtime packet, route or customer renderer imports it. */
export function buildMyeongliMbtiFusion(myeongli: MyeongliSemanticProfile, mbti: MbtiSemanticProfile): FusionResult {
  let diagnostics = emptyFusionDiagnostics();
  diagnostics.hardErrors = stableFusionIssues([...inspectFusionInputs(myeongli, mbti), ...inspectFusionMyeongliSource(myeongli), ...inspectFusionRegistry(FUSION_COMPLEMENT_RULES)]);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const candidates: FusionCandidate[] = [];
  if (!mbti.available) diagnostics.warnings.push({ code: "MBTI_UNAVAILABLE", refs: [] });
  else {
    const m = adaptMyeongliFusionSide(myeongli), adapted = adaptMbtiFusionSide(mbti), b = adapted.sides, all = [...m, ...b];
    diagnostics.priorOnlySuppressed = adapted.priorOnly;
    const filter = (rows: FusionSide[], requirement: AxisRequirement) => rows.filter(s => s.axis === requirement.axis && s.direction === requirement.direction);
    for (const axis of SEMANTIC_AXES) for (const mDirection of [1, -1] as const) for (const bDirection of [1, -1] as const) {
      if (!(BIPOLAR_AXES as readonly string[]).includes(axis) && (mDirection < 0 || bDirection < 0)) continue;
      const left = filter(m, { axis, direction: mDirection }), right = filter(b, { axis, direction: bDirection });
      if (!left.length || !right.length) continue;
      let accepted = false;
      for (const context of FUSION_CONTEXTS) {
        const pair = selectFusionPair(left, right, context); if (!pair) continue;
        accepted = true;
        if (mDirection === bDirection) candidates.push(makeFusionCandidate(pair, "REINFORCE", `SAME_DIRECTION_${axis}`,
          `${fusionAxisMeaning(axis, mDirection)}${axis === "RECOVERY_NEED" ? "를" : "을"} 두 체계가 같은 방향으로 말합니다.`));
        else { const t = resolveFusionTension(pair.myeongli, pair.mbti, all);
          candidates.push(makeFusionCandidate(pair, "TENSION", `CONDITIONAL_${axis}`, t.description, undefined, t.split)); }
      }
      if (!accepted) diagnostics.contextRejected.push({ code: "CONTEXT_REJECTED", refs: [...left.flatMap(s => s.evidenceIds), ...right.flatMap(s => s.evidenceIds)], detail: `${axis}:${mDirection}:${bDirection}` });
    }
    for (const rule of FUSION_COMPLEMENT_RULES) for (const [a, z] of [[rule.axisA, rule.axisB], [rule.axisB, rule.axisA]]) {
      const left = filter(m, a), right = filter(b, z); if (!left.length || !right.length) continue;
      let accepted = false;
      for (const context of rule.contexts) {
        // Both concrete scopes must be allowed by the rule. General support
        // cannot launder a money-only or work-only node into love material.
        const allowed = (s: FusionSide) => s.scope === "general" || rule.contexts.includes(s.scope);
        const pair = selectFusionPair(left.filter(allowed), right.filter(allowed), context); if (!pair) continue;
        accepted = true; candidates.push(makeFusionCandidate(pair, "COMPLEMENT", rule.semanticTheme, rule.sourceDescription, rule.id));
      }
      if (!accepted) diagnostics.contextRejected.push({ code: "COMPLEMENT_CONTEXT_REJECTED", refs: [rule.id], detail: `${a.axis}:${a.direction}:${z.axis}:${z.direction}` });
    }
  }
  const ranked = rankFusionCandidates(candidates);
  diagnostics.duplicateGroups = ranked.duplicateGroups;
  diagnostics.hardErrors = validateFusionCandidates(ranked.candidates, myeongli, mbti);
  diagnostics = completeFusionDiagnostics(diagnostics, ranked.candidates);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const reinforce = ranked.candidates.filter(c => c.type === "REINFORCE"), tensions = ranked.candidates.filter(c => c.type === "TENSION"), complements = ranked.candidates.filter(c => c.type === "COMPLEMENT");
  const byContext = Object.fromEntries(FUSION_CONTEXTS.map(c => [c, ranked.candidates.filter(v => v.primaryContext === c)]));
  return { ok: true, value: { version: GYEOL_FUSION_ENGINE_VERSION, registryVersion: FUSION_COMPLEMENT_REGISTRY_VERSION,
    reinforce, tensions, complements, topCandidates: ranked.candidates.slice(0, FUSION_RANK_POLICY.topLimit), byContext, diagnostics,
    debug: { topReinforce: fusionDebugCandidates(reinforce), topTensions: fusionDebugCandidates(tensions), topComplements: fusionDebugCandidates(complements),
      byContext: Object.fromEntries(FUSION_CONTEXTS.map(c => [c, byContext[c].map(v => v.id)])), priorHeavy: [...diagnostics.priorHeavyCandidates],
      suppressedPriorOnly: structuredClone(diagnostics.priorOnlySuppressed), duplicateGroups: structuredClone(diagnostics.duplicateGroups), diagnostics: structuredClone(diagnostics) } } };
}
