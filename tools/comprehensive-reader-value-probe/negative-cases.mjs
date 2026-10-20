import assert from'node:assert/strict';import{guardSentence,assertPrototypeBoundary,customerUse}from'./guards.mjs';
export function negativeAudit(c,prototypes){
 const a=c.cases.find(r=>r.id==='A'),f=c.cases.find(r=>r.id==='F'),p=prototypes.find(p=>p.id==='probe-ga-1'),fact=p.sentences[0],reading=c.readings.find(r=>r.originalId===p.researchId),held=c.readings.find(r=>r.originalId.endsWith('help-with-hidden-expectation')),rows=[];
 const expect=(name,result,code)=>{assert(!result.ok,name);assert(result.errors.includes(code),name+':'+result.errors.join(','));rows.push({name,rejected:true,reason:code,authorityIssued:0});};
 expect('wrong producer evidence',{...guardSentence({...fact,producerEvidenceId:'NO_SUCH_PRODUCER'},a,reading)},'CALCULATED_FACT_NOT_VERIFIED');
 expect('wrong calculated value',guardSentence({...fact,expectedValue:{god:'正財'}},a,reading),'EXPECTED_FACT_VALUE_MISMATCH');
 const ownerGraph={...a,graph:{...a.graph,nodes:a.graph.nodes.map(n=>n.fact.producerEvidenceId===fact.producerEvidenceId?{...n,owner:{...n.owner,fixtureOwnerId:'OTHER_OWNER'}}:n)}};
 expect('wrong owner',guardSentence(fact,ownerGraph,reading),'CALCULATED_FACT_NOT_VERIFIED');
 const noRoot={...a,graph:{...a.graph,nodes:a.graph.nodes.map(n=>n.fact.producerEvidenceId===fact.producerEvidenceId?{...n,fact:{...n.fact,rootId:null}}:n)}};
 expect('missing existing fact root',guardSentence(fact,noRoot,reading),'CALCULATED_FACT_NOT_VERIFIED');
 expect('unknown hour',guardSentence(fact,f,reading),'UNKNOWN_HOUR_FACT');
 expect('invented missing MBTI',guardSentence({text:'ENFJ라면 사람을 돕는 편입니다.',kind:'RESEARCH_CONDITIONAL_MEANING',researchFields:['coreMeaning']},f,held),'UNKNOWN_MBTI_APPLICATION');
 expect('original unknown MBTI prohibition',guardSentence({text:'도움을 줄 때는 범위를 확인합니다.',kind:'RESEARCH_CONDITIONAL_MEANING',researchFields:['application']},f,held),'RESEARCH_UNKNOWN_MBTI_POLICY');
 expect('unverified hypothesis',guardSentence({...fact,kind:'UNVERIFIED_HYPOTHESIS'},a,reading),'UNVERIFIED_OR_PROHIBITED_CLAIM');
 expect('prohibited assertion',guardSentence({...fact,kind:'PROHIBITED_PERSONAL_ASSERTION'},a,reading),'UNVERIFIED_OR_PROHIBITED_CLAIM');
 expect('invented past experience',guardSentence({...fact,text:'당신이 겪은 직장 갈등이 출발점입니다.'},a,reading),'UNSUPPORTED_PERSONAL_OR_FUTURE_ASSERTION');
 expect('future guarantee',guardSentence({...fact,text:'반드시 성공하고 승진이 확정됩니다.'},a,reading),'UNSUPPORTED_PERSONAL_OR_FUTURE_ASSERTION');
 expect('missing research field',guardSentence({...fact,researchFields:['nonexistentMeaning']},a,reading),'UNKNOWN_OR_MISSING_RESEARCH_FIELD');
 expect('conditional claim promoted to fact',guardSentence({text:'당신은 뛰어난 전문가입니다.',kind:'RESEARCH_CONDITIONAL_MEANING',researchFields:['coreMeaning']},a,reading),'CONDITIONAL_SCOPE_NOT_EXPLICIT');
 expect('connective adds personal fact',guardSentence({...fact,kind:'EDITORIAL_CONNECTIVE_ONLY',text:'당신의 직업은 성공합니다.'},a,reading),'CONNECTIVE_CANNOT_ADD_PERSONAL_FACT');
 expect('unknown input root',guardSentence({text:'입력한 유형은 ENFJ입니다.',kind:'VERIFIED_EXISTING_INPUT',inputPointer:'/input/person/mbtiType',researchFields:['sourceRefs']},f,held),'INPUT_ROOT_NOT_VERIFIED');
 const boundary={status:'RESEARCH_ONLY_EDITORIAL_PROTOTYPE',product:'saju_mbti_full',customerAssignable:false,customerApproved:0,customerEligible:0,customerSelections:0,claimsEmitted:0,bookAllocations:0};
 for(const key of ['customerAssignable','customerApproved','customerEligible','customerSelections','claimsEmitted','bookAllocations']){assert.throws(()=>assertPrototypeBoundary({...boundary,[key]:true}));rows.push({name:'forged '+key,rejected:true,authorityIssued:0});}
 assert.deepEqual(customerUse(),{ok:false,code:'RESEARCH_ONLY_NOT_CUSTOMER_APPROVED',gatePromotions:0});return{cases:rows,passed:rows.length,customerUse:customerUse(),syntheticApprovalRecordsCreated:0};
}
