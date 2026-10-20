import type { SyntheticMajorOption } from "./types";
export function majorReuseViolations(rows: readonly SyntheticMajorOption[]) {
  const errors: string[] = [];
  const sorted = [...rows].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id, "en"));
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i], prior = sorted.slice(0, i), same = prior.filter(b => a.informationRoots.some(r => b.informationRoots.includes(r)));
    if (a.meaning.function === "NEW_CALCULATED_FACT" && same.some(b => b.meaning.function === "NEW_CALCULATED_FACT")) errors.push("SAME_FACT_ROOT_NOT_NEW_CALCULATED_FACT");
    if (a.meaning.function === "CONTINUITY" && !same.some(b => b.meaning.cycle === a.meaning.cycle && b.meaning.meaningId === a.meaning.meaningId)) errors.push("CONTINUITY_REQUIRES_PRIOR_SAME_CYCLE_MEANING");
    if (a.meaning.function === "VERIFIED_NEW_APPLICATION" && same.some(b => b.meaning.application === a.meaning.application || b.meaning.condition === a.meaning.condition)) errors.push("REUSE_WITHOUT_VERIFIED_NEW_APPLICATION");
    for (const b of prior) {
      if (a.questionId === b.questionId) errors.push("ONE_MATERIAL_PER_QUESTION");
      if (["CONTINUITY", "RECALL"].includes(a.meaning.function)) continue;
      if (a.meaning.meaningId === b.meaning.meaningId || a.meaning.claimId === b.meaning.claimId) errors.push("REUSE_WITHOUT_NEW_MEANING");
    }
  }
  return [...new Set(errors)].sort();
}
export const MAJOR_ROOT_REUSE_CONTRACT = { newFact: "Canonical Graph root may be counted once, regardless of year or wording", continuity: "Same cycle/root/approved meaning, distinct question, prior introduction; zero independent facts", application: "Reviewed distinct condition and application; never a new calculated root", comparison: "Two observed periods and approved comparison; zero new dayun roots", recall: "Actual compatible displayed ledger, not a planned selection", redundant: "Same claim/meaning cannot be reissued as independent annual information", hardRootCap: null, customerApplicationApprovals: 0 } as const;
