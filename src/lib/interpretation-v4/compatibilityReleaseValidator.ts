import { COMPATIBILITY_READER_CHAPTERS, type PairReleaseDraft } from "./compatibilityReleaseContracts";
import type { PairReleaseRegistry } from "./compatibilityReleaseRenderer";
import type { PairEvidence } from "./compatibilityEvidence";
import type { RelationshipView } from "./relationshipProductView";
import { sentences, sentenceKey } from "./editorialGuard";
/** Density remains diagnostic. Invalid identity, provenance or direction keeps
 * the previous approved edition; it never adds a paid/Worker failure gate. */
export function validateCompatibilityRelease(draft: PairReleaseDraft, e: PairEvidence,
  views: { personA: RelationshipView; personB: RelationshipView }, registry: PairReleaseRegistry) {
  const hardErrors: string[] = [], qualityIssues = [...draft.shortages], seen = new Set<string>();
  const allAtoms = new Set(Object.values(views).flatMap(v => v.profiles.myeongli.evidence.map(a => a.id)));
  const allNodes = new Set(Object.values(views).flatMap(v => v.profiles.mbti.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC").map(n => n.id)));
  const allFusions = new Set(Object.values(views).flatMap(v => [...v.profiles.fusion.reinforce, ...v.profiles.fusion.complements, ...v.profiles.fusion.tensions].map(f => f.id))
    .concat(Object.values(e.persons).flatMap(p => p.materials.fusions.map(f => f.ruleId))));
  const relationIds = new Set(e.relations.map(r => r.identity)), directionIds = new Set(Object.values(e.directions).map(d => d.relationId));
  const known = new Set([e.persons.personA.personId, e.persons.personB.personId]);
  const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((id, i) => id === b[i]);
  for (const c of draft.chapters) {
    if (c.paragraphs.length !== 4) qualityIssues.push(`${c.id}:PARAGRAPH_SHORTAGE`);
    for (const p of c.paragraphs) {
      if (p.sentences.length < 3 || p.sentences.length > 5 || sentences(p.text).length !== p.sentences.length) qualityIssues.push(`${p.id}:SENTENCE_CONTRACT`);
      if (p.text !== p.sentences.map(s => s.text).join(" ")) hardErrors.push(`${p.id}:TEXT_PROVENANCE_MISMATCH`);
      for (const s of p.sentences) {
        const source = registry[s.provenance.sourceRegistryKey];
        if (!source) { hardErrors.push(`${p.id}:UNKNOWN_SOURCE`); continue; }
        if (s.sourceCandidateId !== source.candidateId) hardErrors.push(`${p.id}:MISMATCHED_SOURCE_ID`);
        if (s.relationshipCategory !== e.category || s.personAId !== e.persons.personA.personId || s.personBId !== e.persons.personB.personId
          || s.subjectPersonId && !known.has(s.subjectPersonId) || s.targetPersonId && !known.has(s.targetPersonId)) hardErrors.push(`${p.id}:PERSON_OR_CATEGORY_MISMATCH`);
        if (!same(s.individualEvidenceIds, source.individual) || s.individualEvidenceIds.some(id => !allAtoms.has(id))) hardErrors.push(`${p.id}:UNKNOWN_PERSONAL_ROOT`);
        if (!same(s.mbtiSourceNodeIds, source.nodes) || s.mbtiSourceNodeIds.some(id => !allNodes.has(id))) hardErrors.push(`${p.id}:UNKNOWN_MBTI`);
        if (!same(s.fusionIds, source.fusions) || s.fusionIds.some(id => !allFusions.has(id)) || !same(s.provenance.sourceRefs, source.proof.sourceRefs)) hardErrors.push(`${p.id}:MISMATCHED_PROVENANCE`);
        if (s.relationIds.some(id => !relationIds.has(id)) || s.canonicalEvidenceIds.some(id => !relationIds.has(id) && !directionIds.has(id))) hardErrors.push(`${p.id}:INVENTED_PAIR_RELATION`);
        if (s.directionId) {
          const expected = e.directions[c.id === "CH05" ? "aToB" : "bToA"];
          if (!["CH05", "CH06"].includes(c.id) || s.directionId !== expected.relationId || s.subjectPersonId !== expected.subjectPerson || s.targetPersonId !== expected.targetPerson) hardErrors.push(`${p.id}:REVERSED_DIRECTION`);
        }
        if (source.slot) {
          const view = views[source.slot];
          const candidate = source.candidateId && view.candidates.find(c => c.id === source.candidateId);
          if (source.candidateId && (!candidate || !candidate.primaryEligible || candidate.invalidReasons.length || source.individual.some(id => !candidate.myeongliEvidenceIds.includes(id)))) hardErrors.push(`${p.id}:INELIGIBLE_CANDIDATE`);
          if (source.individual.some(id => !view.profiles.myeongli.evidence.some(a => a.id === id)) || source.nodes.some(id => !view.nodes.some(n => n.id === id))) hardErrors.push(`${p.id}:WRONG_PERSON_EVIDENCE`);
          if (source.axis && source.individual.some(id => {
            const atom = view.profiles.myeongli.evidence.find(a => a.id === id), axis = source.axis as keyof typeof view.profiles.myeongli.axes;
            return !atom || (atom.axes[axis] ?? 0) * source.sign! <= 0 || (view.profiles.myeongli.axes[axis] ?? 0) * source.sign! <= 0;
          })) hardErrors.push(`${p.id}:UNSUPPORTED_SIGNED_ROOT`);
        }
        const key = sentenceKey(s.text); if (seen.has(key)) qualityIssues.push(`${p.id}:DUPLICATE_SENTENCE`); seen.add(key);
      }
    }
  }
  if (draft.chapters.map(c => c.id).join() !== COMPATIBILITY_READER_CHAPTERS.map(c => c.id).join()) hardErrors.push("CHAPTER_CONTRACT");
  if (draft.bodyLength !== draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n").length) hardErrors.push("BODY_TEXT_MISMATCH");
  if (draft.bodyLength < 8000 || draft.bodyLength > 10000) qualityIssues.push("BODY_LENGTH");
  const text = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n");
  if (/반드시.{0,8}(성공|결혼)|외도합니다|이혼합니다|학대합니다|사기꾼|투자 수익.{0,8}보장/.test(text)) hardErrors.push("UNSUPPORTED_PREDICTION");
  if (!["love", "marriage"].includes(e.category) && /데이트|설렘|연애|배우자|성적 매력|애정 표현/.test(text)) hardErrors.push("ROMANTIC_DOMAIN_LEAK");
  for (const slot of ["personA", "personB"] as const) if (!e.persons[slot].mbti && draft.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences)).some(s => s.mbtiSourceNodeIds.some(id => registry[s.provenance.sourceRegistryKey]?.slot === slot && id.startsWith("mbti:")))) hardErrors.push(`${slot}:INVENTED_MBTI`);
  return { hardErrors: [...new Set(hardErrors)], qualityIssues: [...new Set(qualityIssues)] };
}
