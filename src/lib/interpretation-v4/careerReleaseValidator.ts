import type { CareerReleaseDraft } from "./careerReleaseContracts";
import { CAREER_READER_CHAPTERS } from "./careerReleaseContracts";
import type { CareerProfiles } from "./careerProductSelection";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { CareerNarrative } from "./careerNarrativeTypes";

/** Safety errors choose the existing safe edition. Editorial diagnostics do not
 * add a paid publication gate or change Worker retries. */
export function validateCareerRelease(draft: CareerReleaseDraft, profiles: CareerProfiles, candidates: readonly EditorialCandidate[], legacy: CareerNarrative, retainedSources: Readonly<Record<string, readonly string[]>> = {}) {
  const hardErrors: string[] = [], qualityIssues = [...draft.shortages], seen = new Set<string>(), introduced = new Set<string>();
  const atoms = new Map(profiles.myeongli.evidence.map(e => [e.id, e])), nodes = new Set(profiles.mbti.sourceNodes.map(n => n.id));
  const fusions = new Set([...profiles.fusion.reinforce, ...profiles.fusion.tensions, ...profiles.fusion.complements].map(f => f.id));
  for (const c of draft.chapters) {
    if (c.paragraphs.length !== 4) qualityIssues.push(`${c.id}:PARAGRAPH_SHORTAGE`);
    for (const p of c.paragraphs) {
      if (seen.has(p.text)) qualityIssues.push(`${p.id}:DUPLICATE_PARAGRAPH`); seen.add(p.text);
      if (p.sentences.length < 3 || p.sentences.length > 5) qualityIssues.push(`${p.id}:SENTENCE_COUNT`);
      for (const s of p.sentences) {
        if (s.evidenceIds.some(id => !atoms.has(id))) hardErrors.push(`${p.id}:UNKNOWN_MYEONGLI_PROOF`);
        if (s.mbtiSourceNodeIds.some(id => !nodes.has(id))) hardErrors.push(`${p.id}:UNKNOWN_MBTI_PROOF`);
        if (s.fusionIds.some(id => !fusions.has(id))) hardErrors.push(`${p.id}:UNKNOWN_FUSION_PROOF`);
        const candidate = candidates.find(c => c.id === s.sourceCandidateId);
        if (candidate && (!candidate.primaryEligible || candidate.invalidReasons.length)) hardErrors.push(`${p.id}:INELIGIBLE_SOURCE_CANDIDATE`);
        const route = legacy.recommendations.find(r => `career-route:${r.id}` === s.sourceCandidateId);
        const avoid = legacy.avoidEnvironments.find((_, i) => `career-avoid:${i}` === s.sourceCandidateId);
        const retained = retainedSources[s.sourceCandidateId];
        if (!candidate && !nodes.has(s.sourceCandidateId) && s.sourceCandidateId !== "input:jobStatus" && !route && !avoid && !retained) hardErrors.push(`${p.id}:UNKNOWN_SOURCE_CANDIDATE`);
        if (retained && s.provenance.sourceRefs.some(ref => !retained.includes(ref))) hardErrors.push(`${p.id}:MISMATCHED_RETAINED_SOURCE`);
        if (avoid && s.provenance.sourceRefs.some(ref => !avoid.proof.sourceRefs.includes(ref))) hardErrors.push(`${p.id}:MISMATCHED_AVOID_SOURCE`);
        if (candidate && s.evidenceIds.some(id => !candidate.myeongliEvidenceIds.includes(id))) hardErrors.push(`${p.id}:MISMATCHED_SOURCE_ROOT`);
        if (s.provenance.axis) {
          const axis = s.provenance.axis as keyof typeof profiles.myeongli.axes;
          if (!candidate?.primaryAxes.includes(axis) || (profiles.myeongli.axes[axis] ?? 0) * s.provenance.direction! <= 0
            || !s.evidenceIds.some(id => (atoms.get(id)?.axes[axis] ?? 0) * s.provenance.direction! > 0)) hardErrors.push(`${p.id}:UNSUPPORTED_SIGNED_AXIS`);
        }
        if (s.sourceCandidateId.startsWith("career-route:") && !legacy.recommendations.some(r => `career-route:${r.id}` === s.sourceCandidateId
          && s.provenance.sourceRefs.every(ref => r.proof.sourceRefs.includes(ref)))) hardErrors.push(`${p.id}:UNKNOWN_RECOMMENDATION`);
        if (s.provenance.application === "RECALL" && s.evidenceIds.some(id => !introduced.has(id))) qualityIssues.push(`${p.id}:RECALL_UNINTRODUCED_PROOF`);
        if (!s.evidenceIds.length && !s.mbtiSourceNodeIds.length && !s.provenance.sourceRefs.length) hardErrors.push(`${p.id}:MISSING_PROVENANCE`);
      }
      p.sentences.flatMap(s => s.evidenceIds).forEach(id => introduced.add(id));
    }
  }
  if (draft.chapters.map(c => c.id).join() !== CAREER_READER_CHAPTERS.map(c => c.id).join()) qualityIssues.push("CHAPTER_CONTRACT");
  if (draft.bodyLength < 8000 || draft.bodyLength > 10000) qualityIssues.push("BODY_LENGTH");
  const text = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n");
  if (profiles.guidance.context.lifeStatus !== "EMPLOYEE" && /승진|상사|부하 직원|현재 회사/.test(text)) hardErrors.push("UNSUPPORTED_EMPLOYEE_CONTEXT");
  if (/반드시 부자|확정 수익|CEO가 됩니다|사업하면 성공|무조건 승진/.test(text)) hardErrors.push("UNSUPPORTED_DESTINY");
  if (!profiles.mbti.mbtiType && /\b[EI][SN][TF][JP]\b/.test(text)) hardErrors.push("INVENTED_MBTI");
  return { hardErrors: [...new Set(hardErrors)], qualityIssues: [...new Set(qualityIssues)] };
}

export function compareCareerReaders(readers: readonly { id: string; draft: CareerReleaseDraft }[]) {
  return readers.flatMap((a, i) => readers.slice(i + 1).map(b => {
    const ap = a.draft.chapters.flatMap(c => c.paragraphs), bp = b.draft.chapters.flatMap(c => c.paragraphs);
    const sentences = new Set(ap.flatMap(p => p.sentences.map(s => s.text)));
    return { left: a.id, right: b.id, sameParagraphs: ap.filter(p => bp.some(q => q.id === p.id && q.text === p.text)).map(p => p.id),
      sharedSentences: [...new Set(bp.flatMap(p => p.sentences.map(s => s.text)).filter(s => sentences.has(s)))],
      chapters: a.draft.chapters.map(c => ({ id: c.id, firstSentenceEqual: c.paragraphs[0]?.sentences[0]?.text === b.draft.chapters.find(d => d.id === c.id)?.paragraphs[0]?.sentences[0]?.text })) };
  }));
}
