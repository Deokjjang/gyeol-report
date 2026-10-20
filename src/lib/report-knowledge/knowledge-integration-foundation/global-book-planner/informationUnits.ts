import{isRecord}from'../normalization';
import type{GlobalBookPlanningRequest,InformationKind}from'./types';
export function informationUnits(r:GlobalBookPlanningRequest){
 return r.actualEvidenceWitnesses.flatMap(value=>{
  if(!isRecord(value))return[];const n=isRecord(value.originalNode)?value.originalNode:value,kind=String(n.kind),fact=isRecord(n.fact)?n.fact:{};
  const informationKind:InformationKind=kind==='CALCULATED_NATAL_FACT'||kind==='CALCULATED_PERIOD_FACT'||kind==='CANONICAL_PAIR_FACT'||kind==='DIRECTIONAL_RELATION_FACT'?'ACTUAL_CALCULATED_FACT':kind==='MBTI_INPUT_TYPE'||kind==='CONTEXT_INPUT'?'ACTUAL_ENTERED_INPUT':kind==='SEMANTIC_DERIVATION'||kind==='FUSION_DERIVATION'?'SEMANTIC_DERIVATION':'SUPPORTING_INFORMATION';
  return[{id:value.globalAddress??n.id,informationKind,originalKind:kind,originalProducer:n.producer,owner:n.owner,root:fact.rootId??null,independentFact:fact.independentFact===true,sourceDeclarationIsFact:false,newIndependentFactsIssued:0}];
 });
}
