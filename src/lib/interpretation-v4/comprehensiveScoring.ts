import { sectionFit } from "./comprehensiveSectionContracts";
import type { ComprehensiveSectionId, EditorialCandidate } from "./comprehensivePlanCore";

const bounded = (n: number) => Math.max(0, Math.min(1, n));
export function editorialScore(c: EditorialCandidate, section: ComprehensiveSectionId, primaryReuse = 0, evidenceReuse = false, conflict = false, support = false): number {
  const repetition = primaryReuse ? (support ? 5 : primaryReuse === 1 ? 20 : primaryReuse === 2 ? 40 : 100) : 0;
  const n = 30 * bounded(c.confidence) + 20 * sectionFit(c, section) + 15 * bounded(c.specificity) + 10 * bounded(c.evidenceDiversity) + 10 * bounded(c.fusionValue) + 5 * bounded(c.inputFit) + 10 * bounded(c.emotionalValue)
    - 20 * bounded(c.genericness) - repetition - (evidenceReuse ? support ? 5 : 50 : 0) - (c.invalidReasons.length ? 100 : 0) - (conflict ? 100 : 0);
  return Math.round(n * 100) / 100;
}
export function editorialOrder(section: ComprehensiveSectionId) {
  return (a: EditorialCandidate, b: EditorialCandidate) => {
    // Composites win only amongst equally qualified fortune candidates. Never
    // elevate weak money above a stronger helper/relationship claim.
    const quality = b.confidence - a.confidence || (b.claimLevel ?? 0) - (a.claimLevel ?? 0);
    if (section === "C5" && a.fortune && b.fortune && quality) return quality;
    if (section === "C5" && a.fortune && b.fortune && a.compositeFortune !== b.compositeFortune) return a.compositeFortune ? -1 : 1;
    const score = editorialScore(b, section) - editorialScore(a, section);
    if (score) return score;
    if (section === "C5") {
      const priority = (c: EditorialCandidate) => ["MONEY_FORTUNE", "HONOR", "HIGH_POSITION", "SUCCESS", "PEOPLE_LUCK", "CHARM", "EXPERTISE"].indexOf(c.claimCategory ?? "");
      const tie = (priority(a) < 0 ? 10 : priority(a)) - (priority(b) < 0 ? 10 : priority(b));
      if (tie) return tie;
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  };
}
export function editorialOverlap(a: EditorialCandidate, b: EditorialCandidate) {
  const jaccard = (x: readonly string[], y: readonly string[]) => { const union = new Set([...x, ...y]); return union.size ? new Set(x.filter(v => y.includes(v))).size / union.size : 0; };
  return (a.broadTheme === b.broadTheme ? .5 : 0) + .3 * jaccard(a.primaryAxes, b.primaryAxes) + .2 * jaccard(a.underlyingEvidenceIds, b.underlyingEvidenceIds);
}
