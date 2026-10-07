import { collectComprehensiveCandidates } from "./comprehensiveCandidateAdapter";
import type { ComprehensivePlanInputs, EditorialCandidate } from "./comprehensivePlanCore";
import type { InterpretationContext, SemanticAxis } from "./semanticCore";

export type CareerProfiles = ComprehensivePlanInputs;
export type CareerQuestion = "K1" | "K2" | "K3" | "K4" | "K5" | "K6" | "K7" | "K8" | "K9" | "K10";
export type CareerPlacement = { question: CareerQuestion; context: InterpretationContext; candidate: EditorialCandidate };
const has = (c: EditorialCandidate, axes: readonly SemanticAxis[]) => c.primaryAxes.some(a => axes.includes(a));
export const CAREER_VISIBLE_DOMAINS = ["WORK", "CAREER", "STRENGTHS", "RISKS", "COMMUNICATION", "IDENTITY", "THINKING", "MONEY", "GROWTH"];

/** Reuses source normalization only, never the Comprehensive C1–C10 scheduler.
 * Career allocation neither recalculates axes nor reads job recommendation names. */
export function selectCareerProductSources(profiles: CareerProfiles) {
  const learning = ["STUDENT", "JOB_SEEKER"].includes(profiles.guidance.context.lifeStatus);
  const allowed = new Set([...CAREER_VISIBLE_DOMAINS, ...(learning ? ["STUDY"] : [])]);
  const candidates = collectComprehensiveCandidates(profiles).filter(c => c.primaryEligible && !c.invalidReasons.length
    && c.sourceType !== "CORE_GYEOL" && c.contexts.some(x => ["work", "money", "learning", "stress", "recovery"].includes(x))
    && (!c.fusionType || c.mbtiSourceNodeIds.some(id => profiles.mbti.sourceNodes.some(n => n.id === id && n.classification === "SCORING_SEMANTIC" && allowed.has(n.sourceDomain ?? ""))))
    && (!c.fortune || c.sourceType === "CLAIM" && /^(M08|S08|S03|S04|P01)/.test(c.sourceId)));
  const selected: CareerPlacement[] = [], used = new Set<string>(), groups = new Map<string, number>();
  const score = (c: EditorialCandidate) => (c.contexts.includes("work") ? 25 : 0)
    + ({ PERSONAL_RESONANCE: 18, TRAIT_ARC: 15, FUSION: 13, CLAIM: 12, GUIDANCE: 8, MYEONGLI_PATTERN: 4, CORE_GYEOL: 0 }[c.sourceType])
    + c.confidence * 8 + c.specificity * 4 + c.inputFit * 3;
  function take(question: CareerQuestion, context: InterpretationContext, count: number, predicate: (c: EditorialCandidate) => boolean, repeatTheme = false) {
    const rows = candidates.filter(c => !used.has(c.id) && predicate(c) && c.contexts.includes(context))
      .sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
    let n = 0;
    for (const c of rows) {
      const key = c.duplicateGroupId ?? c.semanticOverlapGroup ?? c.semanticTheme;
      if ((groups.get(key) ?? 0) >= (repeatTheme ? 2 : 1)) continue;
      if (selected.some(p => p.question === question && p.candidate.broadTheme === c.broadTheme)) continue;
      selected.push({ question, context, candidate: c }); used.add(c.id); groups.set(key, (groups.get(key) ?? 0) + 1);
      if (++n >= count) break;
    }
  }
  const positive = (c: EditorialCandidate) => !c.factBomb && !c.fortune && c.sourceType !== "GUIDANCE";
  // Reserve the distinctive domains before filling general work strengths.
  take("K5", "money", 2, c => positive(c) && (c.claimCategory === "MONEY_STYLE" || c.sourceType === "PERSONAL_RESONANCE" || !!c.fusionType));
  take("K6", "work", 1, c => positive(c) && c.sourceType === "CLAIM" && /^(S01|S02|S03|S05|S07|SU05|SU06)/.test(c.sourceId));
  take("K3", "work", 2, c => !!c.fusionType && c.fusionType !== "REINFORCE");
  take("K1", "work", 1, c => positive(c) && c.sourceType === "PERSONAL_RESONANCE");
  take("K1", "work", 1, c => c.fusionType === "REINFORCE");
  if (!selected.some(p => p.question === "K1")) take("K1", "work", 1, positive);
  take("K2", "work", 3, c => positive(c) && ["TRAIT_ARC", "PERSONAL_RESONANCE", "MYEONGLI_PATTERN"].includes(c.sourceType));
  take("K4", "work", 1, c => positive(c) && has(c, ["AUTONOMY", "STRUCTURE_STYLE", "STABILITY", "CHANGE_ORIENTATION", "RECOVERY_NEED"]));
  take("K7", "work", 2, c => c.factBomb && ["TRAIT_ARC", "CLAIM"].includes(c.sourceType), true);
  const fortune = candidates.filter(c => c.fortune).sort((a, b) => Number(b.compositeFortune) - Number(a.compositeFortune) || score(b) - score(a));
  const fortuneFamilies = new Set<string>();
  const fortunes = fortune.filter(c => {
    if (c.fortuneFamilies.some(f => fortuneFamilies.has(f))) return false;
    c.fortuneFamilies.forEach(f => fortuneFamilies.add(f)); return true;
  }).slice(0, 2);
  const guidance = candidates.filter(c => c.sourceType === "GUIDANCE" && c.contexts.some(x => ["work", "money", "learning", "recovery"].includes(x)))
    .sort((a, b) => score(b) - score(a) || a.id.localeCompare(b.id));
  const strategyUsed = new Set<string>();
  const operating = guidance.filter(c => {
    if (!c.strategyIds?.length || c.strategyIds.some(s => strategyUsed.has(s))) return false;
    c.strategyIds.forEach(s => strategyUsed.add(s)); return true;
  }).slice(0, 5);
  return { selected, fortunes, operating, candidates, learning };
}
