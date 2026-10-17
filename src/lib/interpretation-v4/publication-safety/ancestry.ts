import type { RelationshipView } from '../relationshipProductView';
import type { EditorialCandidate } from '../comprehensivePlanCore';
import { v4Digest } from '../runtimeProjection';

export type SourceAncestor = { id: string; kind: string; sourceHash: string; sourcePath: string | null; domain: string | null; parents: string[] };
/** Actual profile references only. No aliases, replacement source IDs or new
 * inference. Derived records keep every declared upstream parent. */
export function createPublicationAncestryInspector(view: RelationshipView) {
  const p = view.profiles, records = new Map<string, SourceAncestor>();
  const add = (id: string, kind: string, value: unknown, parents: string[], domain: string | null = null, sourcePath: string | null = null) => {
    records.set(id, { id, kind, sourceHash: v4Digest(value), sourcePath, domain, parents: [...new Set(parents)] });
  };
  for (const a of p.myeongli.evidence) add(a.id, 'MYEONGLI', a, []);
  for (const n of p.mbti.sourceNodes) add(n.id, 'MBTI', n, [], n.sourceDomain ?? null, n.sourcePath);
  for (const f of [...p.fusion.reinforce, ...p.fusion.complements, ...p.fusion.tensions]) add(f.id, 'FUSION', f,
    [...f.myeongli.evidenceIds, ...f.mbti.sourceNodeIds, ...f.myeongli.side.evidenceIds, ...f.mbti.side.evidenceIds]);
  for (const c of p.claims.candidates) add(c.id, 'CLAIM', c, [...c.evidence.myeongliEvidenceIds, ...c.evidence.mbtiSourceNodeIds, ...c.evidence.fusionCandidateIds]);
  for (const r of p.resonance.candidates) add(r.id, 'RESONANCE', r, [...r.evidence.myeongliEvidenceIds, ...r.evidence.mbtiSourceNodeIds, ...r.evidence.fusionCandidateIds, ...r.evidence.claimIds]);
  for (const a of p.resonance.traitArcs) add(a.id, 'TRAIT_ARC', a, [...a.evidenceIds, ...a.sourceClaimIds, ...a.sourceResonanceIds, ...a.sourceFusionIds]);
  for (const g of [...p.guidance.guidanceCandidates, ...p.guidance.mergedGuidance]) add(g.id, 'GUIDANCE', g,
    [...g.evidenceIds, ...g.sourceClaimIds, ...g.sourceResonanceIds, ...g.sourceFusionIds, ...g.sourceTraitArcIds]);
  for (const c of view.candidates) add(c.id, 'EDITORIAL_CANDIDATE', c, candidateParents(c));
  return (ids: readonly string[]) => {
  const found = new Map<string, SourceAncestor>(), errors = new Set<string>(), visiting = new Set<string>();
  function walk(id: string) {
    if (visiting.has(id)) { errors.add('ANCESTRY_CYCLE:' + id); return; }
    if (found.has(id)) return;
    const r = records.get(id); if (!r) { errors.add('FULL_ANCESTRY_MISSING:' + id); return; }
    found.set(id, r); visiting.add(id); r.parents.forEach(walk); visiting.delete(id);
  }
  ids.forEach(walk);
  const ancestors = [...found.values()].sort((a, b) => a.id.localeCompare(b.id));
  for (const a of ancestors) {
    if (a.domain && prohibited.has(a.domain)) errors.add('PROHIBITED_ANCESTOR_DOMAIN:' + a.id);
    else if (a.domain && !view.domains.includes(a.domain as RelationshipView['domains'][number])) errors.add('UNAPPROVED_ANCESTOR_DOMAIN:' + a.id);
  }
  return { roots: [...ids], ancestors, errors: [...errors].sort() };
  };
}
function candidateParents(c: EditorialCandidate) {
  return [...c.underlyingEvidenceIds, ...c.myeongliEvidenceIds, ...c.mbtiSourceNodeIds, ...c.fusionIds, ...c.claimIds, ...c.resonanceIds, ...c.traitArcIds, ...c.guidanceIds];
}
const prohibited = new Set(['CHILDREN', 'PARENTS', 'RELATIONSHIP_PAIR', 'MYEONGLI_BRIDGE_HINT', 'RECOMMENDED_JOBS', 'AVOID_JOBS_OR_ENVIRONMENTS']);
export function inspectPublicationAncestry(view: RelationshipView, ids: readonly string[]) {
  return createPublicationAncestryInspector(view)(ids);
}
/** Withhold an entire derived side if ANY original contributing parent is
 * prohibited or absent. Never prune roots then reuse its old score/band. */
export function publicationView(view: RelationshipView): RelationshipView {
  const inspect = createPublicationAncestryInspector(view);
  return { ...view,
    candidates: view.candidates.filter(c => !inspect([c.id]).errors.length),
    sides: view.sides.filter(s => !inspect([...s.evidenceIds, ...s.exactEvidenceIds]).errors.length),
  };
}
