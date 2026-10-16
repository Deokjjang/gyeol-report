import {digest} from '../global-specialist-integration/candidateEnvelope';
import {DECISIONS} from '../global-source-domain-resolution/semanticReviewPackets';
import {VERSION,REVIEW_FIELDS} from './types';
import type {ReviewCard,ReviewDraft} from './types';
// This pure validator is also embedded in the offline UI. It issues no authority,
// time, signature or identity; a valid draft is still an unauthenticated draft.
export function validateDraftShape(value:unknown,cards:readonly {reviewUnitId:string;catalogKey:string;originalResearchId:string;originalRecordHash:string;originalSourceVersion:string;productScope:string;relationshipScope:string|null;reviewPacketHash:string;sourceProofHash:string;decisionChoices:readonly string[]}[],version:string,fields:readonly string[]){
 const errors:string[]=[],object=(v:unknown):v is Record<string,unknown>=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const exact=(v:Record<string,unknown>,keys:readonly string[])=>Object.keys(v).every(k=>keys.includes(k))&&keys.every(k=>Object.hasOwn(v,k));
 const forbidden=(v:unknown):boolean=>Array.isArray(v)?v.some(forbidden):object(v)?Object.entries(v).some(([k,x])=>/^(?:operatorApproved|customerApproved|approvedForCustomer|approverIdentity|reviewRecord|approvalSignature|issuedAt|expiresAt|approvalVersion|ApprovalRecord)$/i.test(k)||forbidden(x)):false;
 if(forbidden(value))errors.push('UNSUPPORTED_APPROVAL_FIELD');
 if(!object(value)||!exact(value,['format','purpose','decisions'])||value.format!==version||value.purpose!=='REVIEW_DRAFT_NOT_APPROVAL'||!Array.isArray(value.decisions)||value.decisions.length>1000)return {ok:false,errors:[...errors,'INVALID_DRAFT_ENVELOPE'],approvalRecordsIssued:0};
 const byId=new Map(cards.map(c=>[c.reviewUnitId,c])),seen=new Set<string>();
 for(const [i,d]of value.decisions.entries()){
  if(!object(d)||!exact(d,['reviewUnitId','catalogKey','originalResearchId','originalRecordHash','originalSourceVersion','productScope','relationshipScope','reviewPacketHash','sourceProofHash','selectedDecision','reviewerNotes','reviewedFields','decisionDraftVersion'])){errors.push('INVALID_DECISION_SHAPE:'+i);continue;}
  const c=typeof d.reviewUnitId==='string'?byId.get(d.reviewUnitId):undefined;
  if(!c){errors.push('UNKNOWN_REVIEW_UNIT:'+i);continue;}
  if(seen.has(c.reviewUnitId))errors.push('DUPLICATE_DECISION:'+i);seen.add(c.reviewUnitId);
  for(const key of ['catalogKey','originalResearchId','originalRecordHash','originalSourceVersion','productScope','relationshipScope','reviewPacketHash','sourceProofHash'] as const)if(d[key]!==c[key])errors.push('DRAFT_SCOPE_OR_HASH_MISMATCH:'+key+':'+i);
  if(d.decisionDraftVersion!==version)errors.push('DRAFT_VERSION_MISMATCH:'+i);
  if(typeof d.selectedDecision!=='string'||d.selectedDecision!=='UNSELECTED'&&!c.decisionChoices.includes(d.selectedDecision))errors.push('INVALID_DECISION_CHOICE:'+i);
  if(typeof d.reviewerNotes!=='string'||d.reviewerNotes.length>10000)errors.push('INVALID_REVIEWER_NOTES:'+i);
  if(!Array.isArray(d.reviewedFields)||d.reviewedFields.some(f=>typeof f!=='string'||!fields.includes(f))||new Set(d.reviewedFields).size!==d.reviewedFields.length||d.selectedDecision!=='UNSELECTED'&&fields.some(f=>!(d.reviewedFields as unknown[]).includes(f)))errors.push('REQUIRED_REVIEW_FIELDS_MISSING:'+i);
 }
 return {ok:errors.length===0,errors,approvalRecordsIssued:0};
}
export function packetHash(card:Omit<ReviewCard,'reviewPacketHash'>|ReviewCard){const {reviewPacketHash:ignored,...payload}=card as ReviewCard;void ignored;return digest(payload);}
export function validateReviewDraft(value:unknown,cards:readonly ReviewCard[]){
 if(cards.some(c=>packetHash(c)!==c.reviewPacketHash||digest(c.reading.proof)!==c.sourceProofHash||c.operatorApproved||c.customerApproved))return {ok:false,errors:['TRUSTED_PACKET_CHANGED'],approvalRecordsIssued:0};
 return validateDraftShape(value,cards,VERSION,REVIEW_FIELDS);
}
export function blankDraft(cards:readonly ReviewCard[]):ReviewDraft{return {format:VERSION,purpose:'REVIEW_DRAFT_NOT_APPROVAL',decisions:cards.map(c=>({reviewUnitId:c.reviewUnitId,catalogKey:c.catalogKey,originalResearchId:c.originalResearchId,originalRecordHash:c.originalRecordHash,originalSourceVersion:c.originalSourceVersion,productScope:c.productScope,relationshipScope:c.relationshipScope,reviewPacketHash:c.reviewPacketHash,sourceProofHash:c.sourceProofHash,selectedDecision:'UNSELECTED',reviewerNotes:'',reviewedFields:[],decisionDraftVersion:VERSION}))};}
export const draftSchema={format:VERSION,purpose:'REVIEW_DRAFT_NOT_APPROVAL',allowedDecisions:['UNSELECTED',...DECISIONS],requiredReviewFields:REVIEW_FIELDS,additionalProperties:false,scopeIsExact:true,selectedDecisionDoesNotAuthenticateReviewer:true,officialApprovalConversion:'FORBIDDEN',maxBytes:2*1024*1024,maxDecisions:1000};
