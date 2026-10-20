import type { ReleaseDraft } from "./comprehensiveReleaseRenderer";
import type { ComprehensivePlanInputs, ComprehensiveEditorialPlan } from "./comprehensivePlanCore";

/** Proof errors stay fail-closed. Editorial density/repetition is measured and
 * reported; it does not turn a successfully paid order into a polish failure. */
export function validateComprehensiveRelease(draft:ReleaseDraft,profiles:ComprehensivePlanInputs,plan:ComprehensiveEditorialPlan) {
  const hardErrors:string[]=[], qualityIssues=[...draft.shortages];
  const atoms=new Set(profiles.myeongli.evidence.map(e=>e.id)), nodes=new Set(profiles.mbti.sourceNodes.filter(n=>n.classification==="SCORING_SEMANTIC").map(n=>n.id));
  const candidates=new Set(plan.candidates.filter(c=>!c.invalidReasons.length).map(c=>c.id));
  const fusions=new Set([...profiles.fusion.reinforce,...profiles.fusion.tensions,...profiles.fusion.complements].map(f=>f.id));
  const texts=new Map<string,string>(), introduced=new Set<string>();
  for(const c of draft.chapters) for(const p of c.paragraphs) {
    if(p.sentences.length<3||p.sentences.length>5)qualityIssues.push(`${p.id}:SENTENCE_COUNT`);
    for(const s of p.sentences) {
      if(!s.evidenceIds.length||s.evidenceIds.some(id=>!atoms.has(id)))hardErrors.push(`${p.id}:UNKNOWN_MYEONGLI_PROOF`);
      if(s.mbtiSourceNodeIds.some(id=>!nodes.has(id))||!profiles.mbti.available&&s.mbtiSourceNodeIds.length)hardErrors.push(`${p.id}:UNKNOWN_MBTI_PROOF`);
      if(s.fusionIds.some(id=>!fusions.has(id)))hardErrors.push(`${p.id}:UNKNOWN_FUSION_PROOF`);
      if(!atoms.has(s.sourceCandidateId)&&!candidates.has(s.sourceCandidateId)&&!nodes.has(s.sourceCandidateId))hardErrors.push(`${p.id}:UNKNOWN_SOURCE`);
      const source=plan.candidates.find(c=>c.id===s.sourceCandidateId);
      if(source&&(!source.primaryEligible||s.evidenceIds.some(id=>!source.myeongliEvidenceIds.includes(id))))hardErrors.push(`${p.id}:SOURCE_PROOF_MISMATCH`);
      for(const id of s.fusionIds) {
        const f=[...profiles.fusion.reinforce,...profiles.fusion.tensions,...profiles.fusion.complements].find(f=>f.id===id);
        if(f&&(f.amplifierOnly||f.priorHeavy||f.strength==="SUPPORT"||f.type==="TENSION"&&!f.conditionSplit?.resolved
          ||s.evidenceIds.some(id=>!f.myeongli.evidenceIds.includes(id))||s.mbtiSourceNodeIds.some(id=>!f.mbti.sourceNodeIds.includes(id))))hardErrors.push(`${p.id}:FUSION_PROOF_MISMATCH`);
      }
      const axis=s.provenance.axis, direction=s.provenance.direction;
      if(axis&&(!direction||!s.evidenceIds.some(id=>(profiles.myeongli.evidence.find(e=>e.id===id)?.axes[axis]??0)*direction>0)))hardErrors.push(`${p.id}:UNSUPPORTED_SIGNED_AXIS`);
      if(axis&&s.mbtiSourceNodeIds.some(id=>!profiles.mbti.annotations.some(a=>a.sourceNodeId===id&&a.annotationConfidence!=="REFERENCE_ONLY"&&(a.axes[axis]??0)*(direction??0)>0)))hardErrors.push(`${p.id}:UNSUPPORTED_MBTI_AXIS`);
      if(/sourceRefs|evidenceIds|sourceCandidateId|[A-Z]{2,}_[A-Z_]+|(?:natal|editorial|foundation):|undefined|\[object Object\]/.test(s.text))hardErrors.push(`${p.id}:INTERNAL_TEXT_LEAK`);
      if(!profiles.mbti.available&&/\b[EI][SN][TF][JP]\b/.test(s.text))hardErrors.push(`${p.id}:INVENTED_MBTI`);
      if((s.text.match(/\b[EI][SN][TF][JP]\b/g)??[]).some(type=>type!==profiles.mbti.mbtiType))hardErrors.push(`${p.id}:WRONG_MBTI_TYPE`);
      if(s.provenance.application==="RECALL"&&s.evidenceIds.some(id=>!introduced.has(id)))qualityIssues.push(`${p.id}:RECALL_UNINTRODUCED_PROOF`);
      if(c.id==="CH13"&&s.evidenceIds.some(id=>!introduced.has(id)))qualityIssues.push(`${p.id}:CLOSING_NEW_EVIDENCE`);
      if(texts.has(s.text))qualityIssues.push(`${p.id}:DUPLICATE_SENTENCE:${texts.get(s.text)}`);else texts.set(s.text,p.id);
    }
    if(c.id!=="CH13")p.sentences.flatMap(s=>s.evidenceIds).forEach(id=>introduced.add(id));
  }
  if(draft.bodyLength<9000||draft.bodyLength>11000)qualityIssues.push(`BODY_LENGTH:${draft.bodyLength}`);
  if(draft.explicitMbtiUsage>7||!profiles.mbti.available&&draft.explicitMbtiUsage)hardErrors.push("EXPLICIT_MBTI_BUDGET");
  for(const c of draft.chapters)if(c.paragraphs.length!==4)qualityIssues.push(`${c.id}:PARAGRAPH_COUNT:${c.paragraphs.length}`);
  const keys=draft.chapters.flatMap(c=>c.paragraphs.map(p=>p.semanticKey));
  if(new Set(keys).size!==keys.length)qualityIssues.push("SEMANTIC_APPLICATION_REUSE");
  const paragraphs=draft.chapters.flatMap(c=>c.paragraphs);
  const longPhrases: {left:string;right:string;phrase:string}[]=[];
  for(let i=0;i<paragraphs.length;i++)for(let j=i+1;j<paragraphs.length;j++) {
    const words=paragraphs[i].text.split(/\s+/);
    for(let w=0;w+8<=words.length;w++) {const phrase=words.slice(w,w+8).join(" ");if(phrase.length>=35&&paragraphs[j].text.includes(phrase)){longPhrases.push({left:paragraphs[i].id,right:paragraphs[j].id,phrase});break;}}
  }
  if(longPhrases.length)qualityIssues.push(`LONG_PHRASE_REUSE:${longPhrases.length}`);
  return {hardErrors:[...new Set(hardErrors)],qualityIssues:[...new Set(qualityIssues)],longPhrases,notice:"자동 진단은 원고 전문의 독자 관점 검수를 대신하지 않습니다."};
}

/** Cross-reader copy audit, deliberately separate from publication eligibility.
 * Shared signed traits can legitimately share language; the report records
 * exact overlap and different-proof/same-copy instead of pretending variation. */
export function compareComprehensiveReaders(readers:{id:string;draft:ReleaseDraft}[]) {
  return readers.flatMap((left,i)=>readers.slice(i+1).map(right=>{
    const rows=left.draft.chapters.flatMap(c=>c.paragraphs), other=right.draft.chapters.flatMap(c=>c.paragraphs);
    const sameParagraphs=rows.filter(p=>other.some(q=>q.id===p.id&&q.text===p.text)).map(p=>p.id);
    const proof=(p:typeof rows[number])=>JSON.stringify(p.sentences.map(s=>[s.evidenceIds,s.mbtiSourceNodeIds,s.fusionIds,s.provenance.axis,s.provenance.direction]));
    const differentProofSameCopy=rows.filter(p=>other.some(q=>q.id===p.id&&q.text===p.text&&proof(p)!==proof(q))).map(p=>p.id);
    const sentences=rows.flatMap(p=>p.sentences.map(s=>s.text)), others=new Set(other.flatMap(p=>p.sentences.map(s=>s.text)));
    const sharedSentences=sentences.filter(s=>others.has(s)).length;
    const chapters=["CH01","CH05","CH06","CH07","CH09","CH10","CH12","CH13"].map(id=>{
      const a=rows.filter(p=>p.id.startsWith(id)),b=other.filter(p=>p.id.startsWith(id));
      return {id,identicalParagraphs:a.filter(p=>b.some(q=>q.id===p.id&&q.text===p.text)).length,
        firstSentenceEqual:a[0]?.sentences[0]?.text===b[0]?.sentences[0]?.text};
    });
    return {left:left.id,right:right.id,sameParagraphs,differentProofSameCopy,sharedSentences,totalSentences:sentences.length,chapters,
      qualityIssues:differentProofSameCopy.map(id=>`${id}:DIFFERENT_PROOF_SAME_COPY`)};
  }));
}
