import type { ComprehensiveManuscriptDraft, ManuscriptInput } from "./comprehensiveManuscriptCore";
import type { AdaptedNarrativeSource } from "./comprehensiveNarrativeAdapter";
import { classifyCustomerSentence, humanFirstPenalty, workBlockIntent } from "./narrativeHumanFirst";
import { classifyRecovery } from "./narrativeRecovery";
import { humanDescriptiveness } from "./narrativeValidator";
import { meaningSignature } from "./narrativeMeaningSignature";
import { rhythmSignature } from "./narrativeRhythm";

/** Supplementary observations only. Never replaces/raises the locked 5A/5B scores. */
export function auditHumanManuscript(draft: ComprehensiveManuscriptDraft, input?: ManuscriptInput) {
  const sections = Object.values(draft.sections);
  const source = (section: string, id: string) => draft.debug.sources[`${section}:${id}`] as AdaptedNarrativeSource | undefined;
  const blocks = sections.flatMap(s => s.blocks.map(b => {
    const adapted = source(s.sectionId, b.sourceUnitIds[0]);
    const signature = adapted?.candidate && adapted.placement ? rhythmSignature(b, meaningSignature(adapted.candidate,s.sectionId,adapted.placement)) : undefined;
    return { section: s.sectionId, id: b.id, signature, firstSentencePenalty: humanFirstPenalty(b.sentences,s.sectionId),
      sentences: b.sentences.map(sentence=>({id:sentence.id,text:sentence.text,role:sentence.role,kind:classifyCustomerSentence(sentence),hd:humanDescriptiveness(sentence.text,true)})) };
  }));
  const sentences=blocks.flatMap(b=>b.sentences), counts=Object.fromEntries([...new Set(sentences.map(s=>s.kind))].map(k=>[k,sentences.filter(s=>s.kind===k).length]));
  const rhythms=blocks.flatMap(b=>b.signature?[b.signature]:[]);
  const repetition=rhythms.filter((r,n)=>rhythms.slice(0,n).some(p=>p.behaviorFamily===r.behaviorFamily && p.traitArcRole===r.traitArcRole && p.clauseShape===r.clauseShape));
  const selectedC9=Object.entries(draft.debug.sources).filter(([key])=>key.startsWith("C9:")).map(([,s])=>(s as AdaptedNarrativeSource).candidate).filter(Boolean);
  const availableC9=input?.plan.candidates.filter(c=>!c.invalidReasons.length&&c.allowedSections.includes("C9")&&classifyRecovery(c).relevance>0)??selectedC9.filter(c=>classifyRecovery(c).relevance>0);
  const c9Rows=draft.sections.C9.sourceCandidateIds.map(id=>({id,...classifyRecovery(source("C9",id)!.candidate)}));
  const c8=draft.sections.C8.blocks.map(b=>{const a=source("C8",b.sourceUnitIds[0]);return{id:b.id,primaryIntent:a?workBlockIntent(a.candidate):null,
    secondaryIntent:null,causalRelation:null,upstreamMoneyContextWithoutMoney:a?.placement.context==="money"&&workBlockIntent(a.candidate)!=="MONEY_STYLE",
    misleadingMoneyPrefix:a&&workBlockIntent(a.candidate)!=="MONEY_STYLE"&&/^돈을 생각할 때는/.test(b.plainText),text:b.plainText};});
  const c5Sources=draft.sections.C5.sourceCandidateIds.map(id=>source("C5",id)!.candidate);
  const selectedPositive=input?.plan.sections.C5.placements.length??c5Sources.length;
  const positivePool=input?.plan.candidates.filter(c=>!c.invalidReasons.length&&c.allowedSections.includes("C5"));
  const reward={score:draft.validation.scores.PositiveReward,selectedPositive,rendered:draft.sections.C5.blocks.length,knownFortune:c5Sources.some(c=>c.fortune),
    candidatePool:positivePool?.length??null,sourceScarcity:positivePool?positivePool.length===0:null,
    cause:(draft.validation.scores.PositiveReward??0)>=75?null:draft.sections.C5.blocks.length<selectedPositive?"RENDERER_LIMIT":positivePool?.length?"SELECTED_COVERAGE_LIMIT":positivePool?"SOURCE_SCARCITY":"BASELINE_POOL_NOT_CAPTURED",
    rows:draft.sections.C5.blocks.map(b=>({id:b.id,why:b.sentences.filter(s=>s.role==="MYEONGLI_REASON").length,benefit:b.sentences.filter(s=>s.role==="CLOSER").length,
      independentEvidence:[...new Set(b.sentences.filter(s=>s.role==="MYEONGLI_REASON").flatMap(s=>s.evidenceIds))]}))};
  const low=sentences.filter(s=>["DIRECT_CLAIM","GOOD_RESULT","CONTRAST","FUSION","ACTION"].includes(s.role)).filter(s=>s.hd<85)
    .sort((a,b)=>a.hd-b.hd).slice(0,10).map(s=>({...s,reasons:[s.kind==="META_EXPLANATION"?"META_EXPLANATION":/강점|특징|성향/.test(s.text)?"GENERIC_TRAIT_LABEL":"NO_BEHAVIOR"]}));
  const mbti=Object.values(draft.debug.sources).flatMap(value=>{
    const a=value as AdaptedNarrativeSource;
    if(!a.source||!a.candidate)return[];
    return a.source.phrases.filter(p=>p.role==="MBTI_REASON").flatMap(p=>p.refs.mbtiSourceNodeIds.map(id=>({id,domain:input?.profiles.mbti.sourceNodes.find(n=>n.id===id)?.sourceDomain??null,text:p.text,
      visible:sections.some(s=>s.blocks.some(b=>b.sentences.some(s=>s.sourcePhraseId===p.id)))})));
  });
  const causal=Object.entries(draft.debug.sources).flatMap(([sourceId,value])=>(value as AdaptedNarrativeSource).diagnostics?.filter(s=>s.startsWith("CAUSAL_")).map(diagnostic=>({sourceId,diagnostic}))??[]);
  const tripleRhythms=rhythms.filter((r,n)=>n>=2&&rhythms.slice(n-2,n).every(p=>p.section===r.section&&(p.openingFamily===r.openingFamily||p.clauseShape===r.clauseShape)));
  return {sentenceCounts:counts,totalSentences:sentences.length,blocks,hdOffenders:low,repeatedPrimaryRhythms:repetition,tripleRhythms,causal,
    endingFrequency:{pyeon:sentences.filter(s=>/편(?:입니다|이에요|이죠)[.]$/.test(s.text)).length,think:sentences.filter(s=>/중요하게 생각/.test(s.text)).length,person:sentences.filter(s=>/사람(?:입니다|이에요|이죠)[.]$/.test(s.text)).length},
    reward,c8,c9:{available:availableC9.map(c=>({id:c.id,...classifyRecovery(c)})),selected:selectedC9.map(c=>({id:c.id,...classifyRecovery(c)})),rendered:c9Rows,
      failure:availableC9.length>0&&!c9Rows.some(r=>r.relevance>0),sourceScarcity:input?!availableC9.length:null,
      cause:c9Rows.some(r=>r.relevance>0)?null:availableC9.length?"AVAILABLE_RECOVERY_NOT_SELECTED_OR_RENDERED":input?"SOURCE_SCARCITY":"BASELINE_POOL_NOT_CAPTURED"},
    c10:{eligible:draft.debug.operatingRules?.eligible.length??0,rendered:draft.sections.C10.operatingRules?.length??0,
      rows:draft.sections.C10.operatingRules?.map(r=>({sourceType:r.source?.sourceType,sourceTheme:r.source?.semanticTheme,sourceSection:r.source?.introducedInSection,
        contextSpecificity:r.source?.sourceType==="GUIDANCE"?"CONTEXTUAL":"TRAIT_SCOPED",actionability:/보|정|나누|확인|말|남겨/.test(r.text),genericness:/강점을.*활용|자신을.*사랑/.test(r.text),text:r.text}))??[]},
    mbti,unresolvedCausal:draft.diagnostics.suppressed.filter(s=>s.reasons.some(r=>r.startsWith("CAUSAL"))),
    titles:sections.map(s=>({section:s.sectionId,text:s.title,length:s.title.length,statusMismatch:input?.profiles.guidance.context.lifeStatus!=="EMPLOYEE"&&/승진/.test(s.title)}))};
}
