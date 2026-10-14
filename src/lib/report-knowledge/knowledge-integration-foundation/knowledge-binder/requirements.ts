import { isRecord, selected } from "../normalization";
import type { CatalogKey, JsonRecord, KnowledgeCatalogRecord, ProductKey, RelationshipCategory } from "../types";
import type { KnowledgeBinderCatalog } from "./catalog";
import type { BindingOwner, EvidenceSelector, KnowledgeCandidate, NormalizedKnowledgeRequirement, NormalizedSourceRequirement } from "./types";
const strings=(v:unknown):string[]=>typeof v==="string"?[v]:Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"):[];
const owners:Record<string,BindingOwner>={person:"person",A:"A",B:"B",SHARED:"PAIR",PAIR_AB:"PAIR",PAIR_BA:"PAIR",DIRECTION_AB:"A",DIRECTION_BA:"B",GUIDANCE:"GUIDANCE"};
export function interpretationClassification(r:KnowledgeCatalogRecord,raw:JsonRecord):Pick<KnowledgeCandidate,"classification"|"classificationReason">{
 const potential=["CONDITIONAL_INTERPRETATION","FUSION_RESEARCH","PRODUCT_SPECIALIST","RELATIONSHIP_SPECIALIST"].includes(r.kind);
 if(!potential)return {classification:"NOT_INTERPRETATION_CANDIDATE",classificationReason:r.kind};
 if(raw.materialRef||raw.materialId||raw.isNewMaterial===false||raw.notAdditionalIndependentFact===true||raw.originalRole||raw.originalTitle||raw.materialIds&&!raw.coreMeaning&&!raw.core&&!raw.meaning)return {classification:"NOT_INTERPRETATION_CANDIDATE",classificationReason:"VIEW_ROLE_CHAPTER_OR_INDEX_NOT_NEW_INTERPRETATION"};
 return {classification:"INTERPRETATION_CANDIDATE",classificationReason:"POTENTIAL_RESEARCH_NOT_APPROVED"};
}
const relationKeys:RelationshipCategory[]=["love","marriage","parentChild","coworker","managerReport","businessPartner","friendship"];
const productKeys:ProductKey[]=["saju_mbti_full","career_money_study","love_marriage_child","saju_mbti_compatibility","major_fortune","annual_fortune"];
export function adaptKnowledgeRequirement(r:KnowledgeCatalogRecord,raw:JsonRecord,catalog:KnowledgeBinderCatalog):NormalizedKnowledgeRequirement{
 const relationship=[...new Set([...r.applicability.relationships,...strings(raw.relationshipType).filter((x):x is RelationshipCategory=>relationKeys.includes(x as RelationshipCategory))])];
 const products=[...r.applicability.products];if(relationship.length&&r.kind==="RELATIONSHIP_SPECIALIST"&&!products.includes("saju_mbti_compatibility"))products.push("saju_mbti_compatibility");
 const single=products.length===1&&products[0]!=="saju_mbti_compatibility",defaultOwner:BindingOwner=single?"person":"UNKNOWN";
 const requirements=isRecord(raw.requirements)?raw.requirements:{},binding=isRecord(raw.binding)?raw.binding:{};
 const q:NormalizedKnowledgeRequirement={catalogKey:r.catalogKey,originalId:r.originalId,knowledgeKind:r.kind,adapter:"DECLARED_REFERENCE_ONLY",products,relationships:relationship,readerQuestion:typeof(raw.readerQuestion??raw.question)==="string"?String(raw.readerQuestion??raw.question):null,coreMeaning:typeof(raw.coreMeaning??raw.core??raw.meaning)==="string"?String(raw.coreMeaning??raw.core??raw.meaning):null,chapterId:typeof raw.chapterId==="string"?raw.chapterId:null,paragraphId:typeof raw.paragraphId==="string"?raw.paragraphId:null,sentenceRole:typeof raw.sentenceRole==="string"?raw.sentenceRole:null,claimIdentity:typeof raw.claimIdentity==="string"?raw.claimIdentity:null,meaningIdentity:typeof raw.meaningIdentity==="string"?raw.meaningIdentity:null,sourceRequirements:[],sourceGroups:[],sourceGroupSemantics:r.groupSemantics,requiredOwner:[],requiredDirection:[],requiredParticipants:null,requiredTemporalScope:null,compositeLayers:2,requiredContext:[],requiredUserState:[],producerRequirements:[],counterexamples:raw.counterexample??raw.counterexamples??"UNKNOWN",prohibitions:selected(raw,["disallowed","exclusions","doNotApply","doNotInfer","forbidden","prohibitedInference","disallowedClaims"]),originalReviewState:r.review,originalSourceLocators:[r.locator],unresolvedConditions:[],requiresIntroducedLedger:raw.mode==="RECALL"||raw.kind==="recall"||raw.researchKind==="recall"||requirements.introducedRequired===true,introducedIds:strings(raw.precedingMeaningRefs),applicabilityState:"CONTRACT_NOT_MACHINE_CHECKABLE"};
 if(typeof raw.address==="string"&&!q.chapterId){const m=/^(CH\d+)\.(P\d+)(?:\.(S\d+))?$/.exec(raw.address);if(m){q.chapterId=m[1];q.paragraphId=m[2];q.sentenceRole=m[3]??null;}}
 const add=(field:string,declaration:unknown,owner:BindingOwner,use:NormalizedSourceRequirement["use"],selector:EvidenceSelector|null,keys:CatalogKey[]=[],sourceKey:string|null=null,gaps:string[]=[])=>{
  const spec:NormalizedSourceRequirement={id:`${r.catalogKey}#${field}:${q.sourceRequirements.length}`,originalField:field,originalDeclaration:declaration,sourceKey,sourceCatalogKeys:keys,owner,use,selector,required:true,gaps};q.sourceRequirements.push(spec);return spec;
 };
 const source=(declaration:unknown,field:string,owner:BindingOwner,useHint:string|undefined,sourceKey:string|null=null)=>{
  const obj=isRecord(declaration)?declaration:{};
  let refs:KnowledgeCatalogRecord[]=[];
  if(sourceKey)refs=catalog.sourceKey(r.family,sourceKey);
  if(!refs.length&&typeof obj.sourceId==="string")refs=catalog.originalIds.get(obj.sourceId)??[];
  if(!refs.length){const links=(catalog.semantic.graph.outgoing.get(r.catalogKey)??[]).filter(l=>l.field===field||l.field.startsWith(field+"/")).filter(l=>l.to);refs=[...new Set(links.map(l=>l.to!))].map(k=>catalog.semantic.graph.byKey.get(k)!).filter(Boolean);}
  const keyRefs=[...new Set(refs.map(x=>x.catalogKey))];
  const sourceRecord=refs.length===1?catalog.raw.get(refs[0].catalogKey):null;
  const declarationBody=sourceRecord??obj,sourceKind=String(declarationBody.sourceKind??obj.sourceKind??"UNKNOWN");
  const allKeys=[...new Set([...keyRefs,...keyRefs.flatMap(k=>catalog.sourceAncestors(k))])];
  for(const key of allKeys){const original=catalog.raw.get(key);if(original)for(const [name,value]of Object.entries(selected(original,["prerequisites","requirements","conditions","strengthConditions","formation"])))if(value!==null&&(!Array.isArray(value)||value.length))q.unresolvedConditions.push({field:`${key}#/${name}`,original:value});}
  const foundations=allKeys.map(k=>catalog.semantic.graph.byKey.get(k)!).filter(x=>x?.namespace==="FOUNDATION"&&x.locator.pointer!==undefined&&x.locator.file.endsWith(".json"));
  const mbti=sourceKind==="individual_mbti"||sourceKind==="mbti_trait"||useHint==="own_entered_type_only"||useHint==="individual_trait_condition";
  const pair=sourceKind==="mbti_pair_reference"||useHint==="directed_reference_only";
  if(mbti||pair){
   const referenceDirection=pair&&obj.owner==="PAIR_AB"?"A_TO_B":pair&&obj.owner==="PAIR_BA"?"B_TO_A":undefined;
   const selectorOwner:BindingOwner=referenceDirection==="A_TO_B"?"A":referenceDirection==="B_TO_A"?"B":owner;
   const eligible=foundations.filter(x=>pair?x.locator.pointer?.startsWith("/relationshipHints/notablePairs/"):x.locator.pointer?.startsWith("/traits/"));
   if(eligible.length){for(const target of eligible)add(field,declaration,owner,pair?"PAIR_REFERENCE":"MBTI_SOURCE",{kinds:pair?["SOURCE_DECLARATION"]:["MBTI_SOURCE_NODE"],owner:selectorOwner,referenceDirection,source:{catalogKey:target.catalogKey,file:target.locator.file,fileSha256:catalog.input.frozen.get(target.locator.file)},fields:pair?[{path:"value.classification",equals:"REFERENCE_ONLY"}]:[{path:"value.classification",equals:"SCORING_SEMANTIC"}],requiresScoring:!pair},[...keyRefs,target.catalogKey],sourceKey);return;}
  }
  if(typeof obj.file==="string"&&typeof obj.pointer==="string"){
   const known=catalog.byLocator.get(JSON.stringify([obj.file,obj.pointer]))??[];
   const mbtiPointer=/^\/traits\/[^/]+\/\d+(?:\/[^/]+)*$/.test(obj.pointer);
   add(field,declaration,owner,mbtiPointer?"MBTI_SOURCE":"DEFINITION",mbtiPointer?{kinds:["MBTI_SOURCE_NODE"],owner,source:known.length===1?{catalogKey:known[0].catalogKey,file:obj.file,fileSha256:catalog.input.frozen.get(obj.file)}:{file:obj.file,pointer:obj.pointer,fileSha256:catalog.input.frozen.get(obj.file)},fields:[{path:"value.classification",equals:"SCORING_SEMANTIC"}],requiresScoring:true}:null,[...keyRefs,...known.map(x=>x.catalogKey)],sourceKey,mbtiPointer?[]:["DEFINITION_IS_NOT_CALCULATED_FACT"]);return;
  }
  const kind=sourceKind==="external_context"||owner==="GUIDANCE"?"DOCUMENTARY":sourceKind==="individual_fusion_research"||sourceKind==="fusion_research"?"FUSION":sourceKind==="relation_definition"?"DEFINITION":sourceKind==="natal_definition"||sourceKind==="natal_research"?"ACTUAL_FACT":"UNKNOWN";
  if(kind==="FUSION"){
   const fusionRecords=allKeys.map(k=>catalog.raw.get(k)).filter((v):v is JsonRecord=>!!v&&typeof v.existingRuleId==="string");
   if(fusionRecords.length===1){const f=fusionRecords[0],ancestorSelectors:EvidenceSelector[]=[];
    if(isRecord(f.myeongli))for(const feature of strings(f.myeongli.features))ancestorSelectors.push({kinds:["CALCULATED_NATAL_FACT"],owner,fields:[{path:"value.featureDefinitionId",equals:feature}]});
    if(isRecord(f.mbti)&&Array.isArray(f.mbti.traitRefs))for(const trait of f.mbti.traitRefs)if(isRecord(trait)&&typeof trait.file==="string"&&typeof trait.pointer==="string"){const target=catalog.byLocator.get(JSON.stringify([trait.file,trait.pointer]))??[];ancestorSelectors.push({kinds:["MBTI_SOURCE_NODE"],owner,source:target.length===1?{catalogKey:target[0].catalogKey,file:trait.file,fileSha256:catalog.input.frozen.get(trait.file)}:{file:trait.file,pointer:trait.pointer,fileSha256:catalog.input.frozen.get(trait.file)},fields:[{path:"value.classification",equals:"SCORING_SEMANTIC"}],requiresScoring:true});}
    add(field,declaration,owner,"FUSION",{kinds:["FUSION_DERIVATION"],owner,fields:[{path:"value.ruleId",equals:f.existingRuleId}],requiresFusionRoots:true,requiredAncestors:ancestorSelectors,allowedContexts:strings(f.contexts)},keyRefs,sourceKey);return;
   }
  }
  add(field,declaration,owner,kind,null,keyRefs,sourceKey,kind==="DOCUMENTARY"?[]:["CONTRACT_NOT_MACHINE_CHECKABLE"]);
 };
 if(Array.isArray(raw.ownedSources)){
  q.adapter=relationship[0]==="friendship"?"FRIENDSHIP_SOURCE_USE":"OWNED_RELATIONSHIP_SOURCE_ASSIGNMENT";
  for(const [i,d]of raw.ownedSources.entries())if(isRecord(d)){const key=typeof(d.sourceKey??d.sourceRef)==="string"?String(d.sourceKey??d.sourceRef):null;source(d,`/ownedSources/${i}`,owners[String(d.owner)]??"UNKNOWN",typeof d.sourceUse==="string"?d.sourceUse:undefined,key);}
 }else if(Array.isArray(raw.sourceKeys)){
  q.adapter="PRODUCT_SOURCE_KEY_REGISTRY";for(const [i,key]of raw.sourceKeys.entries())if(typeof key==="string")source({sourceKey:key},`/sourceKeys/${i}`,defaultOwner,undefined,key);
 }else if(Array.isArray(raw.sourceRefs)&&raw.sourceRefs.some(isRecord)){
  q.adapter="PRODUCT_TYPED_SOURCE_REF";for(const [i,d]of raw.sourceRefs.entries())if(isRecord(d))source(d,`/sourceRefs/${i}`,defaultOwner,undefined);
 }
 if(Array.isArray(raw.basis)&&typeof raw.type==="string"){
  q.adapter="MBTI_TYPED_BASIS";for(const [i,d]of raw.basis.entries())if(isRecord(d))source(d,`/basis/${i}`,defaultOwner,"own_entered_type_only");
 }
 if(Array.isArray(raw.sourceTraitRefs)||Array.isArray(raw.targetTraitRefs)){
  q.adapter="DIRECTED_MBTI_PAIR_TRAITS";for(const [field,owner]of [["sourceTraitRefs","A"],["targetTraitRefs","B"]]as const)for(const [i,d]of (Array.isArray(raw[field])?raw[field]as unknown[]:[]).entries())source(d,`/${field}/${i}`,owner,"individual_trait_condition");
  q.requiredDirection.push("A_TO_B");q.unresolvedConditions.push({field:"/sourceType/targetType owner assignment",original:{sourceType:raw.sourceType,targetType:raw.targetType}});
 }
 const declaredDirection=isRecord(requirements.direction)?requirements.direction.direction:requirements.direction??binding.direction??raw.direction;
 const direction=declaredDirection??(raw.mode==="AB"?"A_TO_B":raw.mode==="BA"?"B_TO_A":undefined);
 if(direction==="A_TO_B"||direction==="B_TO_A"){
  q.requiredDirection.push(direction);const owner=direction==="A_TO_B"?"A":"B";
  add("/requirements/direction",requirements.direction??binding.direction??raw.direction,owner,"ACTUAL_FACT",{kinds:["DIRECTIONAL_RELATION_FACT"],owner,direction,fields:[]});
 }
 if(requirements.canonicalClaim==="actual_supported_relation_or_withhold"||binding.actualCanonicalMembershipRequired===true)add("/requirements/canonicalClaim",requirements.canonicalClaim??binding.actualCanonicalMembershipRequired,"PAIR","ACTUAL_FACT",{kinds:["CANONICAL_PAIR_FACT"],owner:"PAIR",fields:[{path:"value.actualCrossPersonDetection",equals:true}]});
 if(typeof raw.actualCrossProducerKind==="string")add("/actualCrossProducerKind",raw.actualCrossProducerKind,"PAIR","ACTUAL_FACT",{kinds:["CANONICAL_PAIR_FACT"],owner:"PAIR",fields:[{path:"value.kind",equals:raw.actualCrossProducerKind}],memberValues:strings(raw.members)});
 if(raw.crossSupport==="unsupported_withhold"||raw.producerSupport==="unsupported")q.producerRequirements.push("UNSUPPORTED_PRODUCER");
 if(typeof raw.existingRuleId==="string"){
  q.adapter="EXISTING_FUSION_RULE";const ancestors:EvidenceSelector[]=[];
  if(isRecord(raw.myeongli))for(const feature of strings(raw.myeongli.features))ancestors.push({kinds:["CALCULATED_NATAL_FACT"],owner:defaultOwner,fields:[{path:"value.featureDefinitionId",equals:feature}]});
  if(isRecord(raw.mbti)&&Array.isArray(raw.mbti.traitRefs))for(const [i,trait]of raw.mbti.traitRefs.entries())if(isRecord(trait)){source(trait,`/mbti/traitRefs/${i}`,defaultOwner,"own_entered_type_only");const s=q.sourceRequirements.at(-1)?.selector;if(s)ancestors.push(s);}
  add("/existingRuleId",raw.existingRuleId,defaultOwner,"FUSION",{kinds:["FUSION_DERIVATION"],owner:defaultOwner,fields:[{path:"value.ruleId",equals:raw.existingRuleId}],requiresFusionRoots:true,requiredAncestors:ancestors,allowedContexts:strings(raw.contexts)});
 }
 if(typeof raw.god==="string"&&raw.scope==="dayun"){
  q.adapter="MAJOR_TEN_GOD";q.requiredTemporalScope="dayun";add("/god",raw.god,"person","ACTUAL_FACT",{kinds:["CALCULATED_PERIOD_FACT"],owner:"person",temporalScope:"dayun",fields:[{path:"value.tenGod",equals:raw.god}]});
 }
 if(typeof raw.god==="string"&&raw.scope==="monthly_segment"){
  q.adapter="MONTHLY_TEN_GOD";q.requiredTemporalScope="month";q.unresolvedConditions.push({field:"/god/location",original:{god:raw.god,monthlyGate:raw.monthlyGate}});
 }
 const scope:Record<string,NormalizedKnowledgeRequirement["requiredTemporalScope"]>={dayun:"dayun",annual:"annual",year:"annual",monthly_segment:"month",natal:"natal"};
 if(typeof raw.scope==="string"&&scope[raw.scope])q.requiredTemporalScope=scope[raw.scope];
 if(typeof raw.scope==="string"&&!scope[raw.scope]&&!["individual","personal_only","person_comparison","relationship_interaction","research_questions_not_specialist_product_database","future_binding_design"].includes(raw.scope))q.requiredTemporalScope="UNKNOWN";
 if(typeof raw.scope==="string"&&["natal_dayun_annual","natal_major_annual","three_layer","four_layer"].includes(raw.scope)){q.compositeLayers=raw.scope==="four_layer"?4:3;q.producerRequirements.push("UNSUPPORTED_COMPOSITE");}
 for(const field of ["jobStatuses","relationshipStatuses"])if(Array.isArray(raw[field]))q.requiredUserState.push({key:field==="jobStatuses"?"jobStatus":"relationshipStatus",allowed:raw[field]as unknown[],originalField:`/${field}`});
 for(const [field,value]of Object.entries({additionalInput:requirements.additionalInput,actualContextRequired:binding.actualContextRequired,additionalBusinessInfo:raw.additionalBusinessInfo}))for(const key of strings(value))q.requiredUserState.push({key,allowed:null,originalField:`/${field}`});
 if(requirements.actualWorkContextRequired===true)q.requiredUserState.push({key:"actualWorkContext",allowed:null,originalField:"/requirements/actualWorkContextRequired"});
 if(relationship.includes("parentChild"))for(const key of ["verifiedParentChildRoles","developmentalContext"])q.requiredUserState.push({key,allowed:null,originalField:"/requirements/fixedRole"});
 if(relationship.includes("managerReport"))q.requiredUserState.push({key:"verifiedManagerReportAuthority",allowed:null,originalField:"/requirements/authority"});
 for(const [field,value]of Object.entries(selected(raw,["prerequisites","requires","conditions","applicationGate","requiredContext","counterconditions","appliesWhen"])))if(value!==null&&(!Array.isArray(value)||value.length))q.unresolvedConditions.push({field:`/${field}`,original:value});
 if(Object.keys(requirements).length)q.unresolvedConditions.push({field:"/requirements",original:requirements});
 if(Array.isArray(raw.sourceRefs))for(const [i,d]of raw.sourceRefs.entries())if(typeof d==="string"){const found=catalog.originalIds.get(d)??[];add(`/sourceRefs/${i}`,d,"GUIDANCE","DOCUMENTARY",null,found.map(x=>x.catalogKey),null,found.length?[]:["SOURCE_REFERENCE_UNRESOLVED"]).required=false;}
 const originalGroup=catalog.input.sourceGroups.find(g=>g.catalogKey===r.catalogKey);
 if(originalGroup){q.sourceGroups=originalGroup.groups.map((g,i)=>{const body=isRecord(g.originalGroup)?g.originalGroup:{};return {originalIndex:i,originalId:typeof body.groupId==="string"?body.groupId:null,semantics:originalGroup.semantics,sourceRequirementIds:q.sourceRequirements.filter(s=>s.sourceKey&&g.requiredSources.includes(s.sourceKey)).map(s=>s.id),typePredicates:(Array.isArray(body.typePredicates)?body.typePredicates:[]).filter(isRecord).map(t=>({owner:owners[String(t.owner)]??"UNKNOWN",type:String(t.type),sourceKey:String(t.sourceKey)})),originalDeclaration:g.originalGroup,originalTechnicalState:g.status,requiresDisplayedLedger:originalGroup.semantics==="AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS"};});}
 q.requiredOwner=[...new Set(q.sourceRequirements.map(s=>s.owner))];q.requiredDirection=[...new Set(q.requiredDirection)];
 q.requiredContext=strings(raw.context??raw.contexts);
 const machine=q.sourceRequirements.filter(s=>s.selector).length;
 q.applicabilityState=machine&&!q.unresolvedConditions.length&&!q.sourceRequirements.some(s=>s.gaps.length)?"MACHINE_CHECKABLE":machine?"PARTIALLY_CHECKABLE":"CONTRACT_NOT_MACHINE_CHECKABLE";
 if(!q.products.every(p=>productKeys.includes(p)))throw new Error("INVALID_PRODUCT_CONTRACT");
 return q;
}
