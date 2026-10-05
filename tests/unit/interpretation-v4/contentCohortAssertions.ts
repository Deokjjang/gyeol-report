import { expect } from "vitest";
import { reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import type { ComprehensiveNarrative } from "../../../src/lib/interpretation-v4/narrativeTypes";

type Report = { id: string; narrative: Omit<ComprehensiveNarrative, "version"> };
/** Phase13A restores explanations of shared facts. Keep the raw repetition
 * diagnostic (including its severity); do not misreport it as zero. A reused
 * explanation must have a common, concrete proof, never just a generic flag.
 * Individual reports still have the original zero-duplicate publication gate.
 */
export function expectBoundCohortReuse(reports: readonly Report[]) {
  const issues = reviewNarrativeCohort(reports);
  const unbound: string[] = [];
  expect(issues.filter(i => ["COHORT_HEADLINE", "COHORT_FINAL_LINE"].includes(i.code))).toEqual([]);
  for (const issue of issues) {
    const blocks = issue.location.split(" / ").map(location => {
      const slash = location.indexOf("/"), id = location.slice(0, slash), blockId = location.slice(slash + 1);
      const n = reports.find(r => r.id === id)?.narrative;
      return n && [...n.opening, ...n.sections.flatMap(s => s.blocks)].find(b => b.id === blockId);
    });
    expect(blocks.every(Boolean), issue.location).toBe(true);
    const keys = blocks.map(b => [
      ...b!.proof.features.map(f => `feature:${f}`), ...b!.proof.seedIds.map(f => `seed:${f}`),
      ...b!.proof.fusionIds.map(f => `fusion:${f}`),
      ...b!.proof.sourceRefs.filter(f => /^(?:mbti:|content-period:|period-ten-god:|period-element:|content-direction:|content-relation:|content-role:strength:|visible-characters-unweighted|content-assertion:|natal-element:|content-pair-loop:|content-pair-rhythm:|v4:career-route:)/.test(f)),
    ]);
    if (!keys[0].some(k => keys.every(set => set.includes(k)))) unbound.push(issue.location);
  }
  expect([...new Set(unbound)]).toEqual([]);
  return issues;
}
