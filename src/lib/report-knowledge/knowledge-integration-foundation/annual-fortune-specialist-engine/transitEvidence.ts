import { annualTransitMaterials } from "../../../interpretation-v4/annualEvidence";
import { canonicalJson } from "../sourceReader";
import { validateAnnualNodeIdentity } from "./annualIdentity";
import type { AnnualSegment, OriginalAnnual, TransitCheck } from "./types";
export function matchAnnualTransit(s: AnnualSegment, e: OriginalAnnual): TransitCheck[] {
  const extension = e.monthly.months[s.contract.month - 1]?.segments.find(x => x.startKst === s.raw.startKst && x.endKstExclusive === s.raw.endKstExclusive);
  if (!extension) return [];
  const gated = annualTransitMaterials(extension.features);
  return extension.features.map(f => {
    const accepted = gated.accepted.some(a => a.observations.includes(f)), nodes = s.nodes.filter(n => n.fact.producerEvidenceId === f.id), reasons = gated.held.filter(h => h.observation === f).map(h => h.reason);
    reasons.push(...nodes.flatMap(n=>validateAnnualNodeIdentity(n,s,e.monthly.version)));
    if (nodes.length !== 1 || nodes.some(n => n.status !== "VERIFIED" || n.owner.fixtureOwnerId !== s.owner || canonicalJson(n.value) !== canonicalJson({ code: f.code, kind: f.kind, basis: f.basis, sourceRefs: f.sourceRefs }))) reasons.push("ORIGINAL_TRANSIT_GRAPH_WITNESS_REQUIRED");
    if (!f.sourceRefs.includes(`calendarMonths:${s.contract.month}:${s.raw.startKst}`) || !f.basis.target.startsWith("month.")) reasons.push("NO_CANONICAL_TRANSIT_PROVENANCE");
    const anchor = /^natal\.(year|month|day|hour)\.(stem|branch)$/.exec(f.basis.anchor), target = /^month\.(stem|branch)$/.exec(f.basis.target);
    const natal = anchor ? e.calculation.pillars[anchor[1] as "year" | "month" | "day" | "hour"] : null;
    if (!anchor || !target || !natal || natal[anchor[2] as "stem" | "branch"] !== f.basis.anchorValue || s.raw.monthPillar[target[1] as "stem" | "branch"] !== f.basis.targetValue) reasons.push("MISSING_PARTICIPANT");
    if (nodes.some(n => !n.ancestry.rootIds.length || n.sources.some(x => !x.fileSha256 || x.state !== "VERIFIED"))) reasons.push("MISSING_SOURCE_ANCESTRY");
    return { originalEvidenceId: f.id, feature: f.code, basis: f.basis, sourceRefs: f.sourceRefs, window: s.contract.window, nodeIds: nodes.map(n => n.id), canonicalFactRoots: [...new Set(nodes.flatMap(n => n.ancestry.rootIds))], acceptedByOriginalAdapter: accepted, state: reasons.length ? "WITHHELD" : "VERIFIED_OBSERVATION", reasons: [...new Set(reasons)].sort() };
  });
}
