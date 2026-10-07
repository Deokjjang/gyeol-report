import type { GuidanceCandidate } from "./guidanceCore";
import { APPLICABILITY_VALUE } from "./guidanceStrategies";

/** Editorial ordering, not a behavioral success probability. */
export function rankGuidance(rows: readonly GuidanceCandidate[]): GuidanceCandidate[] {
  return rows.map(c => {
    const d = c.diagnostics;
    const score = 30 * d.problemEvidenceStrength + 25 * c.contextFit + 20 * APPLICABILITY_VALUE[c.applicability] + 15 + 10 * d.personalSpecificity - d.genericAdvicePenalty - d.conflictPenalty - d.unsafeContextPenalty;
    return { ...structuredClone(c), diagnostics: { ...d, rankingScore: Math.round(Math.max(0, Math.min(100, score)) * 100) / 100 } };
  }).sort((a, b) => b.diagnostics.rankingScore - a.diagnostics.rankingScore || a.id.localeCompare(b.id));
}
