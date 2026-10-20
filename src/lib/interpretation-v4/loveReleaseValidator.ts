import { LOVE_READER_CHAPTERS, type LoveReleaseDraft } from "./loveReleaseContracts";
import type { RelationshipView } from "./relationshipProductView";
import type { NarrativeProof, MaterialPacket } from "./narrativeTypes";
/** Safety violations retain the previous safe edition. Copy diagnostics never
 * change a supported input into a new paid publication/Worker failure. */
export function validateLoveRelease(draft: LoveReleaseDraft, view: RelationshipView, packet: MaterialPacket, retained: Readonly<Record<string, NarrativeProof>>) {
  const hardErrors: string[] = [], qualityIssues = [...draft.shortages], introduced = new Set<string>(), seen = new Set<string>();
  const atoms = new Map(view.profiles.myeongli.evidence.map(a => [a.id, a]));
  const nodes = new Map(view.profiles.mbti.sourceNodes.map(n => [n.id, n]));
  const fusions = new Set([...view.profiles.fusion.reinforce, ...view.profiles.fusion.complements, ...view.profiles.fusion.tensions].map(f => f.id).concat(packet.fusions.map(f => f.ruleId)));
  for (const c of draft.chapters) {
    if (c.paragraphs.length !== 4) qualityIssues.push(`${c.id}:PARAGRAPH_SHORTAGE`);
    for (const p of c.paragraphs) {
      if (seen.has(p.text)) qualityIssues.push(`${p.id}:DUPLICATE_PARAGRAPH`); seen.add(p.text);
      if (p.sentences.length < 3 || p.sentences.length > 5) qualityIssues.push(`${p.id}:SENTENCE_COUNT`);
      for (const s of p.sentences) {
        const candidate = view.candidates.find(c => c.id === s.sourceCandidateId), asset = retained[s.sourceCandidateId], node = nodes.get(s.sourceCandidateId);
        if (!candidate && !asset && !node) hardErrors.push(`${p.id}:UNKNOWN_SOURCE`);
        if (candidate && (!candidate.primaryEligible || candidate.invalidReasons.length)) hardErrors.push(`${p.id}:INELIGIBLE_CANDIDATE`);
        if (s.evidenceIds.some(id => !atoms.has(id))) hardErrors.push(`${p.id}:UNKNOWN_MYEONGLI`);
        if (s.evidenceIds.some(id => candidate && !candidate.myeongliEvidenceIds.includes(id))) hardErrors.push(`${p.id}:MISMATCHED_ROOT`);
        if (s.mbtiSourceNodeIds.some(id => !nodes.has(id))) hardErrors.push(`${p.id}:UNKNOWN_MBTI`);
        if (s.mbtiSourceNodeIds.some(id => { const n = nodes.get(id); return n && (!view.nodes.some(v => v.id === id) && !(c.id === "CH08" && n.sourceDomain === "PARENTS")); })) hardErrors.push(`${p.id}:WRONG_MBTI_DOMAIN`);
        if (s.fusionIds.some(id => !fusions.has(id))) hardErrors.push(`${p.id}:UNKNOWN_FUSION`);
        if (asset && s.provenance.sourceRefs.some(ref => !asset.sourceRefs.includes(ref))) hardErrors.push(`${p.id}:MISMATCHED_ASSET`);
        if (/notablePairs|relationshipHints|:traits:child:/.test(s.provenance.sourceRefs.join(" "))) hardErrors.push(`${p.id}:PEER_OR_CHILD_INFERENCE`);
        if (s.provenance.axis) {
          const axis = s.provenance.axis as keyof typeof view.profiles.myeongli.axes, direction = s.provenance.direction!;
          if (!candidate?.primaryAxes.includes(axis) || (view.profiles.myeongli.axes[axis] ?? 0) * direction <= 0
            || !s.evidenceIds.some(id => (atoms.get(id)?.axes[axis] ?? 0) * direction > 0)) hardErrors.push(`${p.id}:UNSUPPORTED_SIGNED_AXIS`);
        }
        if (!s.evidenceIds.length && !s.mbtiSourceNodeIds.length && !s.provenance.sourceRefs.length) hardErrors.push(`${p.id}:MISSING_PROVENANCE`);
        if (s.provenance.application === "RECALL" && s.evidenceIds.some(id => !introduced.has(id))) hardErrors.push(`${p.id}:UNINTRODUCED_RECALL`);
      }
      p.sentences.flatMap(s => s.evidenceIds).forEach(id => introduced.add(id));
    }
  }
  if (draft.chapters.map(c => c.id).join() !== LOVE_READER_CHAPTERS.map(c => c.id).join()) qualityIssues.push("CHAPTER_CONTRACT");
  if (draft.bodyLength < 8000 || draft.bodyLength > 10000) qualityIssues.push("BODY_LENGTH");
  const text = draft.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join("\n");
  if (/자녀는 \d|자녀가 \d|아들을 낳|딸을 낳|결혼하게 됩니다|외도합니다|이별하게 됩니다|반드시 결혼|인기가 반드시|이성이 끊이지/.test(text)) hardErrors.push("UNSUPPORTED_PREDICTION");
  if (!view.profiles.mbti.mbtiType && /\b[EI][SN][TF][JP]\b/.test(text)) hardErrors.push("INVENTED_MBTI");
  const status = draft.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences))[0]?.relationshipStatus;
  if (status !== "married" && /현재 배우자|당신의 배우자|함께 사는 현재 생활/.test(text)) hardErrors.push("INVENTED_SPOUSE");
  return { hardErrors: [...new Set(hardErrors)], qualityIssues: [...new Set(qualityIssues)] };
}
export function compareLoveReaders(readers: readonly { id: string; draft: LoveReleaseDraft }[]) {
  return readers.flatMap((a, i) => readers.slice(i + 1).map(b => {
    const ap = a.draft.chapters.flatMap(c => c.paragraphs), bp = b.draft.chapters.flatMap(c => c.paragraphs), bs = new Set(bp.flatMap(p => p.sentences.map(s => s.text)));
    return { left: a.id, right: b.id, sameParagraphs: ap.flatMap(p => bp.filter(q => q.text === p.text).map(q => ({ left: p.id, right: q.id }))),
      sharedSentences: [...new Set(ap.flatMap(p => p.sentences.map(s => s.text)).filter(s => bs.has(s)))],
      chapters: a.draft.chapters.map(c => ({ id: c.id, firstSentenceEqual: c.paragraphs[0]?.sentences[0]?.text === b.draft.chapters.find(d => d.id === c.id)?.paragraphs[0]?.sentences[0]?.text })) };
  }));
}
