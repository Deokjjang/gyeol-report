import type { PlanningQuestion, PlanningOption, QuestionLinkState } from './types';
export function questionLink(q: PlanningQuestion, o: PlanningOption): QuestionLinkState {
 if(q.id!==o.questionId||q.product!==o.product||q.relationship!==o.relationship)return 'NO_VALID_LINK';
 if(o.link==='EDITORIAL_TOPIC_SIMILARITY_ONLY'||o.link==='BRIDGE_UNVERIFIED')return o.link;
 if(q.original?.readerAgreement==='REVIEW_REQUIRED')return 'BRIDGE_UNVERIFIED';
 if(['REFERENCE_ONLY','EXPRESSION_ONLY','UNMAPPED','SHARED_FOUNDATION_MATERIAL'].includes(o.materialLinkKind))return 'NO_VALID_LINK';
 return o.link;
}
export function primaryQuestionReasons(q: PlanningQuestion,o:PlanningOption){
 const link=questionLink(q,o),reasons:string[]=[];
 if(!['EXACT_VERIFIED_QUESTION_LINK','EXACT_VERIFIED_MATERIAL_LINK'].includes(link))reasons.push('EXACT_READER_QUESTION_LINK_REQUIRED:'+link);
 if(q.owner&&o.owner!==q.owner)reasons.push('QUESTION_OWNER_MISMATCH');
 if(q.direction&&o.direction!==q.direction)reasons.push('QUESTION_DIRECTION_MISMATCH');
 if(q.requiredMeaning.length&&(!o.primaryMeaning||!q.requiredMeaning.includes(o.primaryMeaning))&&q.synthetic)reasons.push('QUESTION_REQUIRED_MEANING_MISMATCH');
 return reasons;
}
