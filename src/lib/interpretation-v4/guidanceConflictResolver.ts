import type { GuidanceCandidate, GuidanceConflictGroup, GuidanceInputs, GuidanceProblem, GuidanceStrategyId, GuidanceUserContext } from "./guidanceCore";
import { emptyGuidanceRefs, evaluateGuidanceCondition, guidanceScope, mergeGuidanceRefs } from "./guidanceEvidence";
import { a, any, split } from "./personalResonanceRules";
import type { ResonanceCondition } from "./personalResonanceCore";
import { guidanceStrategy, strategyApplicability, APPLICABILITY_VALUE } from "./guidanceStrategies";

/** Originals remain inspectable; resolved candidates replace them in topGuidance.
 * Additional value evidence is traced too, not guessed from the job. */
export function resolveGuidanceConflicts(candidates: readonly GuidanceCandidate[], i: GuidanceInputs, context: GuidanceUserContext) {
  const originals = structuredClone(candidates), merged: GuidanceCandidate[] = [], groups: GuidanceConflictGroup[] = [];
  function resolve(key: string, problems: GuidanceProblem[], ids: GuidanceStrategyId[], advice: string, condition?: ResonanceCondition, requireAll = false) {
    const rows = originals.filter(c => !c.conflictGroupId && problems.includes(c.problem));
    if (!rows.length || (requireAll && !problems.every(p => rows.some(c => c.problem === p)))) return;
    const problemContexts = rows.flatMap(c => {
      // Only contexts actually supporting the source problem may justify a merge.
      const pr = i.resonance.candidates.filter(r => c.sourceResonanceIds.includes(r.id));
      const claims = i.claims.candidates.filter(r => c.sourceClaimIds.includes(r.id));
      return [...pr.flatMap(r => r.contexts), ...claims.flatMap(r => r.contexts)];
    });
    const gates = condition ? [...new Set(problemContexts)].map(ctx => evaluateGuidanceCondition({ kind: "existing", condition }, i, guidanceScope(i, ctx))).filter(g => g.passed && !g.low) : [];
    if (condition && !gates.length) return;
    if (ids.some(id => ["FORBIDDEN", "CAUTION"].includes(strategyApplicability(id, context.workModes)))) return;
    const groupId = `guidance-conflict:${key}`, id = `guidance-merge:${key}`, first = rows[0];
    const applicability = ids.map(id => strategyApplicability(id, context.workModes)).sort((a, b) => APPLICABILITY_VALUE[a] - APPLICABILITY_VALUE[b])[0];
    const result: GuidanceCandidate = { ...structuredClone(first), ...mergeGuidanceRefs(...rows, ...gates), id, selectedStrategyIds: ids, customerAdvice: advice,
      conflictGroupId: groupId, mergedFromGuidanceIds: rows.map(r => r.id).sort(), applicability, whyThisFits: undefined,
      confidence: rows.every(r => r.confidence === "HIGH") ? "HIGH" : "MEDIUM", contextFit: Math.min(...rows.map(r => r.contextFit)),
      diagnostics: { ...first.diagnostics, contextVariantId: `merge:${key}`, action: ids.map(id => guidanceStrategy(id).action).join(" / "), conflictPenalty: 0, rankingScore: 0 } };
    for (const row of rows) { row.conflictGroupId = groupId; row.diagnostics.conflictPenalty = 20; }
    groups.push({ id: groupId, sourceGuidanceIds: result.mergedFromGuidanceIds!, mergedGuidanceId: id }); merged.push(result);
  }
  resolve("decision-execution", ["OVERTHINKING", "PREMATURE_DECISION"], ["DECISION_EXECUTION_SPLIT"], "결정하기 전에는 충분히 생각해도 됩니다. 대신 방향을 정한 뒤에는 다시 처음부터 고민하지 말고 움직이는 편이 좋습니다.", undefined, true);
  if (!groups.some(g => g.id === "guidance-conflict:decision-execution")) resolve("decision-execution", ["OVERTHINKING"], ["DECISION_EXECUTION_SPLIT"], "결정하기 전에는 충분히 생각해도 됩니다. 대신 방향을 정한 뒤에는 다시 처음부터 고민하지 말고 움직이는 편이 좋습니다.", split("BEFORE_AFTER_DECISION"));
  resolve("care-boundary", ["PEOPLE_PLEASING", "WEAK_BOUNDARY", "OVER_CARE"], ["SET_BOUNDARY", "DEFINE_RESPONSIBILITY"], "사람을 챙기는 장점은 그대로 두되, 도와줄 수 있는 일과 내가 책임질 일은 구분하는 편이 좋습니다.", a("CARE", "STRONG"));
  resolve("directness-care", ["BLUNT_COMMUNICATION"], ["PERSON_VS_PROBLEM"], "말을 무조건 부드럽게 바꾸기보다 사람을 평가하지 않고 문제를 정확하게 말하는 편이 좋습니다.", any(a("CARE", "STRONG"), a("SOCIAL_ATTUNEMENT", "STRONG")));
  resolve("stability-change", ["OVER_STABILITY", "CHANGE_CHASING"], ["SMALL_EXPERIMENT"], "생활의 기본을 전부 바꾸지 말고 작은 부분 하나에서만 새로운 방식을 시험해보는 편이 좋습니다.", a("CHANGE_ORIENTATION"));
  const value = i.resonance.candidates.find(r => r.ruleId === "PR037" && r.rank !== "SUPPORT" && !r.diagnostics.unresolvedContradiction);
  if (value) {
    resolve("money-meaning", ["MONEY_OVER_MEANING", "MEANING_OVER_MONEY"], ["VALUE_AND_PRICE_SEPARATE"], "돈과 의미 중 하나를 포기하려 하기보다 의미 있다고 느끼는 일 중에서 내 시간과 돈의 값도 맞는지를 따로 확인하는 편이 좋습니다.");
    const row = merged.find(c => c.id === "guidance-merge:money-meaning");
    if (row) Object.assign(row, mergeGuidanceRefs(row, { ...emptyGuidanceRefs(), sourceResonanceIds: [value.id], sourceClaimIds: value.evidence.claimIds, sourceFusionIds: value.evidence.fusionCandidateIds, evidenceIds: [...value.evidence.myeongliEvidenceIds, ...value.evidence.mbtiSourceNodeIds] }));
  }
  resolve("saving-experience", ["OVER_SAVING"], ["BUDGET_BUCKETS"], "지켜야 할 돈과 써도 되는 돈을 처음부터 나눠두면 아끼는 것과 경험하는 것을 둘 다 가져가기 쉽습니다.", any(a("MEANING"), a("CHANGE_ORIENTATION")));
  return { candidates: originals, merged, groups };
}
