import {digest} from '../global-specialist-integration/candidateEnvelope';
import type {ReviewUnit,OriginalReading,ReadingProposal} from './types';
export function proposeIdentity(left:ReviewUnit,right:ReviewUnit,leftReading:OriginalReading,rightReading:OriginalReading,leftProposal:ReadingProposal,rightProposal:ReadingProposal){
 const relations:string[]=[],sameRecord=left.materialIdentity===right.materialIdentity;
 const l=leftReading.original,r=rightReading.original;
 if(sameRecord)relations.push('POTENTIAL_SAME_MEANING');
 if(left.productScope!==right.productScope||left.relationshipScope!==right.relationshipScope)relations.push('DIFFERENT_RELATIONSHIP_ROLE');
 if(digest(left.requiredOwner)!==digest(right.requiredOwner)||digest(left.requiredDirection)!==digest(right.requiredDirection))relations.push('DIFFERENT_OWNER');
 if(digest(left.requiredTemporalScope)!==digest(right.requiredTemporalScope))relations.push('DIFFERENT_TEMPORAL_SCOPE');
 if(digest(left.applicationContext)!==digest(right.applicationContext))relations.push('DIFFERENT_ACTUAL_CONTEXT');
 if(typeof l.sourceId==='string'&&l.sourceId===r.sourceId)relations.push('POTENTIAL_SAME_FACT','RELATED_BUT_NOT_EQUIVALENT');
 if(leftProposal.primaryMeaning===rightProposal.primaryMeaning)relations.push('POTENTIAL_SAME_CLAIM');
 if(!relations.length)relations.push('INSUFFICIENT_VERIFICATION');
 return {proposalId:'identity-proposal:'+digest([left.reviewUnitId,right.reviewUnitId]),left:left.reviewUnitId,right:right.reviewUnitId,relations:[...new Set([...relations,'OPERATOR_REVIEW_REQUIRED'])],reason:sameRecord?'같은 원문을 재사용하되 상품·조건이 다른 적용 판정은 독립적으로 남긴다.':typeof l.sourceId==='string'&&l.sourceId===r.sourceId?'같은 관계 정의를 참고해도 생활 질문·역할·실제 두 사람의 계산 사실까지 같아지지는 않는다.':'소유자·기간·관계·적용 조건을 먼저 대조한다. 표현이나 축 이름만으로 같은 의미라고 확정하지 않는다.',applicationState:'PROPOSED_NEW_APPLICATION',state:'PROPOSED',verifiedSameFact:false,actuallyApprovedRelation:false,originalHashes:[left.originalRecordHash,right.originalRecordHash]};
}
export function conflictReview(unit:ReviewUnit,reading:OriginalReading){
 const original=reading.original,positive=original.positive??original.positiveSource??null,risk=original.risk??original.shadow??original.riskSource??null;
 return {reviewUnitId:unit.reviewUnitId,positive,risk,twist:original.twist??null,relation:positive&&risk?'CONDITIONAL_TENSION':'INSUFFICIENT_VERIFICATION',explanation:'가능한 이점과 과용 위험은 같은 사건에 대한 상반된 계산 결과가 아니다. 원래 조건·대상·기간을 대조한 뒤 사람이 판단한다.',state:'PROPOSED',confirmedConflict:false};
}
