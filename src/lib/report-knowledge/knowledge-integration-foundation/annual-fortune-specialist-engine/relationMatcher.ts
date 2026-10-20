import { canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import { validateAnnualNodeIdentity } from "./annualIdentity";
import type { AnnualSegment, RelationCheck, OriginalAnnual } from "./types";
const scopes = { month_natal_branch: "natal_wolun", month_natal_element: "natal_wolun", month_dayun_branch: "dayun_wolun", month_annual_branch: "saeun_wolun" } as const;
export function validateAnnualRelation(s: AnnualSegment, f: AnnualSegment["raw"]["relationFacts"][number], e: OriginalAnnual): RelationCheck {
  const nodes = s.nodes.filter(n => n.fact.producerEvidenceId === f.id && canonicalJson(n.value) === canonicalJson(f));
  const participants = nodes.flatMap(n => n.participants), reasons: string[] = [];
  if (nodes.length !== 1) reasons.push("ORIGINAL_RELATION_ID_VALUE_WINDOW_REQUIRED");
  reasons.push(...nodes.flatMap(n=>validateAnnualNodeIdentity(n,s)));
  if (nodes.some(n => n.status !== "VERIFIED" || n.owner.fixtureOwnerId !== s.owner)) reasons.push("ORIGINAL_GRAPH_RELATION_WITHHELD");
  if (participants.some(p => p.owner !== s.owner)) reasons.push("WRONG_OWNER");
  if (f.source !== "month_natal_element") {
    if (f.monthBranch !== s.raw.monthPillar.branch || !participants.some(p => p.position === "month" && p.value === f.monthBranch)) reasons.push("WRONG_MONTH_PILLAR");
    if (f.source === "month_natal_branch") {
      for (const position of f.affectedPillars) {
        const branch = e.calculation.pillars[position]?.branch;
        if (!branch || !f.participants.includes(branch) || !participants.some(p => p.position === position && p.value === branch && p.slot === "natal_branch")) reasons.push("MISSING_PARTICIPANT");
      }
    } else if (f.counterpart.scope === "annual") {
      if (f.counterpart.pillar !== s.raw.effectiveAnnualPillar.stem + s.raw.effectiveAnnualPillar.branch || !participants.some(p => p.position === "annual" && p.value === s.raw.effectiveAnnualPillar.branch)) reasons.push("WRONG_EFFECTIVE_ANNUAL");
    } else {
      const index = f.counterpart.cycleIndex, ganji = f.counterpart.pillar;
      if (s.raw.activeDayunContext.status !== "active" || s.raw.activeDayunContext.cycles.length !== 1 || !s.raw.activeDayunContext.cycles.some(c => c.index === index && c.ganji === ganji)) reasons.push("WRONG_ACTIVE_DAYUN_OR_UNKNOWN_TRANSITION");
      if (!participants.some(p => p.position === `dayun-cycle:${index}` && p.value === ganji[1])) reasons.push("MISSING_PARTICIPANT");
    }
    if (f.type === "삼합" && (new Set(f.participants).size !== 3 || !f.participants.every(v => participants.some(p => p.value === v)))) reasons.push("THREE_SIMULTANEOUS_PARTICIPANTS_REQUIRED");
  } else if (!e.calculation.pillars.hour) reasons.push("UNKNOWN_BIRTH_TIME_ELEMENT_LIMIT");
  if (f.certainty !== "confirmed") reasons.push("CONDITIONAL_RELATION_NOT_CONFIRMED");
  return { originalEvidenceId: f.id, source: f.source, scope: scopes[f.source], type: f.type, participants, nodeIds: nodes.map(n => n.id), canonicalFactRoots: [...new Set(nodes.flatMap(n => n.ancestry.rootIds))], window: nodes[0]?.temporal ?? { ...s.contract.window, certainty: f.certainty, transitionRange: f.certainty === "conditional" ? s.raw.activeDayunContext.transitionRange : null }, state: reasons.length ? "WITHHELD" : "VERIFIED", reasons: [...new Set(reasons)].sort() };
}
export function validateNominalStemRelation(s: AnnualSegment, declaration: OriginalAnnual["annualStemRelations"][number]) {
  return { original: declaration, segmentPointer: s.originalPointer, targetStem: s.raw.effectiveAnnualPillar.stem, state: declaration.annualStem === s.raw.effectiveAnnualPillar.stem ? "YEAR_OBSERVATION_COMPATIBLE_REQUIRES_EXACT_GRAPH_ANCESTRY" : "WITHHELD", reasons: declaration.annualStem === s.raw.effectiveAnnualPillar.stem ? ["NO_DEDICATED_SEGMENT_STEM_RELATION_GRAPH_ID"] : ["WRONG_EFFECTIVE_ANNUAL"] };
}
export function unsupportedComposite(scope: string, participants: readonly unknown[], relationType?: string): string[] {
  return [...(["natal_dayun_saeun", "natal_saeun_wolun", "natal_dayun_saeun_wolun"].includes(scope) ? ["UNSUPPORTED_COMPOSITE"] : []), ...(relationType === "삼합" && (participants.length !== 3 || !participants.every(isRecord)) ? ["THREE_SIMULTANEOUS_PARTICIPANTS_REQUIRED"] : [])];
}
