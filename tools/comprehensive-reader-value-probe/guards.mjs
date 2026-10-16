import assert from'node:assert/strict';
export const KINDS=['VERIFIED_EXISTING_CALCULATED_FACT','VERIFIED_EXISTING_INPUT','RESEARCH_CONDITIONAL_MEANING','EDITORIAL_CONNECTIVE_ONLY','UNVERIFIED_HYPOTHESIS','PROHIBITED_PERSONAL_ASSERTION'];
export function guardSentence(sentence,row,reading){
 const errors=[];if(!KINDS.includes(sentence.kind))errors.push('UNKNOWN_CLAIM_KIND');
 if(['UNVERIFIED_HYPOTHESIS','PROHIBITED_PERSONAL_ASSERTION'].includes(sentence.kind))errors.push('UNVERIFIED_OR_PROHIBITED_CLAIM');
 if(typeof sentence.text!=='string'||!sentence.text.trim())errors.push('EMPTY_PROSE');
 if(/당신은 이미|당신이 겪은|반드시 성공|틀림없이 부자|결혼하게 됩니다|친구는 당신을 싫어합니다|승진이 확정/.test(sentence.text))errors.push('UNSUPPORTED_PERSONAL_OR_FUTURE_ASSERTION');
 if(!Array.isArray(sentence.researchFields)||!sentence.researchFields.length||sentence.researchFields.some(f=>!Object.hasOwn(reading.original,f)))errors.push('UNKNOWN_OR_MISSING_RESEARCH_FIELD');
 const nodes=row.graph.nodes.filter(n=>n.owner.slot==='person'&&n.owner.fixtureOwnerId===row.graph.context.owners.person);
 let selected=[];
 if(sentence.kind==='VERIFIED_EXISTING_CALCULATED_FACT'){
  selected=nodes.filter(n=>n.kind==='CALCULATED_NATAL_FACT'&&n.fact.producerEvidenceId===sentence.producerEvidenceId);
  if(selected.length!==1||!selected[0].fact.rootId||!row.graph.receipts.find(r=>r.nodeId===selected[0]?.id)?.producerFactVerified||selected[0]?.status!=='VERIFIED')errors.push('CALCULATED_FACT_NOT_VERIFIED');
 }
 if(sentence.kind==='VERIFIED_EXISTING_INPUT'){
  selected=nodes.filter(n=>n.kind==='MBTI_INPUT_TYPE'&&n.fact.observationPointer===sentence.inputPointer);
  if(selected.length!==1||!selected[0].fact.rootId||selected[0]?.fact.rootType!=='SELF_REPORTED_INPUT'||selected[0]?.status!=='VERIFIED')errors.push('INPUT_ROOT_NOT_VERIFIED');
 }
 if(selected.length===1&&sentence.expectedValue&&Object.entries(sentence.expectedValue).some(([k,v])=>selected[0].value?.[k]!==v))errors.push('EXPECTED_FACT_VALUE_MISMATCH');
 if(sentence.kind==='RESEARCH_CONDITIONAL_MEANING'){
  if(!/(?:면|경우|때|가능|조건|아니|설명|뜻|입증|보장|사실|확인|질문|연구|않|없|구분)/.test(sentence.text))errors.push('CONDITIONAL_SCOPE_NOT_EXPLICIT');
  if(!row.profiles.mbti.available&&/ENFJ|INTJ|INFP|MBTI가 .*성향/.test(sentence.text))errors.push('UNKNOWN_MBTI_APPLICATION');
  if(!row.profiles.mbti.available&&reading.original.sourcePolicy.unknownMbti==='withhold_mbti_and_fusion')errors.push('RESEARCH_UNKNOWN_MBTI_POLICY');
 }
 if(sentence.kind==='EDITORIAL_CONNECTIVE_ONLY'&&(sentence.producerEvidenceId||/당신|성향|성공|재물|친구|직업/.test(sentence.text)))errors.push('CONNECTIVE_CANNOT_ADD_PERSONAL_FACT');
 if(sentence.producerEvidenceId?.startsWith('hour:')&&row.fixture.payload.person.birthTimeUnknown)errors.push('UNKNOWN_HOUR_FACT');
 return{ok:errors.length===0,errors,selectedNodes:selected};
}
export function assertPrototypeBoundary(value){assert.equal(value.status,'RESEARCH_ONLY_EDITORIAL_PROTOTYPE');assert.equal(value.product,'saju_mbti_full');assert.equal(value.customerAssignable,false);for(const k of ['customerApproved','customerEligible','customerSelections','claimsEmitted','bookAllocations'])assert.equal(value[k],0);return true;}
export function customerUse(){return{ok:false,code:'RESEARCH_ONLY_NOT_CUSTOMER_APPROVED',gatePromotions:0};}
