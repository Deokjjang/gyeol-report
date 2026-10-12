import type { V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
export function editorialInvariants(e: V4RuntimeEvidence) {
  const r = e.composition.result as unknown as Record<string, unknown>;
  const integration = r.integration as Record<string, unknown> | undefined;
  const fields = ['materials', 'evidence', 'persons', 'directions', 'compatibilityIndex', 'selection', 'mbtiBasis', 'mbtiPairBasis', 'behaviorBasis', 'studyBasis'];
  const profiles = ['coreGyeol', 'context', 'recommendationGrounding', 'profileDigests', 'personalDigest', 'individualDigests', 'pairReferencePersonalEvidence', 'natalBuilds', 'timeClaimSource', 'periods', 'pair'];
  const edition = integration?.readerEdition as { chapters: { id: string; paragraphs: { id: string; sentences: { evidenceIds?: string[]; individualEvidenceIds?: string[]; canonicalEvidenceIds?: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[] }[] }[] }[] } | undefined;
  const unique = (ids: string[]) => [...new Set(ids)].sort();
  const readerProof = edition?.chapters.map(c => [c.id, c.paragraphs.map(p => ({ id: p.id,
    roots: unique(p.sentences.flatMap(s => [...(s.evidenceIds ?? []), ...(s.individualEvidenceIds ?? []), ...(s.canonicalEvidenceIds ?? [])])),
    mbti: unique(p.sentences.flatMap(s => s.mbtiSourceNodeIds)), fusion: unique(p.sentences.flatMap(s => s.fusionIds)) }))]);
  return { readerProof, calculations: e.calculations, natalTableEvidence: e.natalTableEvidence, mbtiTables: e.mbtiTables,
    source: Object.fromEntries(fields.map(k => [k, r[k]])), profiles: Object.fromEntries(profiles.map(k => [k, integration?.[k]])) };
}
