import { canonicalJson, hash, recordHash } from "../sourceReader";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BINDING_HARD_GATES } from "../types";
import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import { domainReasons } from "../../../../../tools/compatibility-friendship-specialist-engine/sharedServices";
import { evaluateFriendshipAssertion, type Assertion } from "./relationshipContext";
import { evaluateIntroducedGroups, type Display, type IntroducedGroup } from "./introducedGroups";
import { meaningRelations, type Meaning } from "./conflictGraph";
import type { Fixture } from "./synthetic";
export const SYNTHETIC_FILE="tests/fixtures/compatibility-friendship-specialist-engine-01/synthetic-knowledge.json";
export type Question={id:string;address:string;chapter:number;paragraph:number;role:number|null;owner:"A"|"B"|"PAIR";direction:"A_TO_B"|"B_TO_A"|null;mode:string};
export type SyntheticMeaning=Meaning & { factIds:string[];fit:number;assertion:Assertion;introducedGroups:IntroducedGroup[];concepts:string[];lifeContext:string;informationFunction:"POSITIVE"|"RISK"|"DIRECT"|"TWIST" };
export type Option={id:string;question:Question;meaning:SyntheticMeaning;receipt:KnowledgeBindingReceipt;informationRoots:string[];supportingAncestryRoots:string[];eligible:boolean;reasons:string[]};
export type Session={mode:"SYNTHETIC_ELIGIBLE_SELECTION_TEST"};
export type Method="FIRST_ELIGIBLE"|"QUESTION_FIT_FIRST"|"GLOBAL_CONSTRAINT_AWARE";
const sessions=new WeakMap<Session,{questions:Question[];options:Option[]}>();
export async function createVerifiedSession(catalog:KnowledgeBinderCatalog,request:KnowledgeBindingRequest,candidates:KnowledgeCandidate[],questions:Question[],approvals:KnowledgeBindingApprovalProvider,displays:Display[]) {
  if(request.relationship!=="friendship"||request.product!=="saju_mbti_compatibility"||!request.graph.context.fixtureId.startsWith("synthetic:friendship:")||request.graphInput.evidence.input.kind!=="compatibility"||request.graphInput.evidence.input.compatibilityRoleVersion!=="compatibility-fixed-ab-v1"||catalog.input.records.length!==candidates.length||catalog.input.records.some(r=>r.family!=="friendship-independent-synthetic"||r.locator.file!==SYNTHETIC_FILE)||request.graph.nodes.some(n=>n.producer.file!==SYNTHETIC_FILE))throw Error("INDEPENDENT_FRIENDSHIP_SYNTHETIC_REGISTRY_REQUIRED");
  const text=catalog.reader.text(SYNTHETIC_FILE);
  if(hash(text)!==catalog.input.frozen.get(SYNTHETIC_FILE))throw Error("SYNTHETIC_SOURCE_HASH_MISMATCH");
  const native=JSON.parse(text) as Fixture;
  if(request.graph.context.fixtureId.endsWith(":same-god"))native.facts=native.sameGodFacts;
  if(canonicalJson(questions)!==canonicalJson(native.questions)||displays.some(d=>!native.displays.some(v=>canonicalJson(v)===canonicalJson(d))))throw Error("REGISTERED_QUESTIONS_AND_DISPLAYS_REQUIRED");
  const actual=new ActualBindingIndex(request,catalog),options:Option[]=[],expected=new Map(native.displays.map(d=>[d.materialId,d]));
  for(const d of native.displays){
    const m=native.materials.find(m=>m.id===d.materialId),q=native.questions.find(q=>q.id===m?.questionId);
    const roots=new Set<string>(),seen=new Set<string>(),pending=[...(m?.meaning.factIds??[])];
    while(pending.length){const id=pending.pop()!;if(seen.has(id))continue;seen.add(id);const fact=native.facts.find(f=>f.id===id);if(!fact)throw Error("REGISTERED_DISPLAY_ANCESTRY_REQUIRED");if(fact.root)roots.add("synthetic:friendship:root:"+fact.root);pending.push(...fact.parents);}
    if(!m||!q||d.originalHash!==recordHash(m)||d.catalogKey!==m.requirement.catalogKey||d.address!==q.address||d.meaningId!==m.meaning.id||d.claimId!==m.meaning.claim||d.context!==m.meaning.context||d.sourceGroupId!==m.requirement.sourceGroups[0].originalId||canonicalJson(d.sourceKeys)!==canonicalJson(m.meaning.factIds)||canonicalJson(d.sourceRoots)!==canonicalJson(["synthetic:friendship:root:"+m.meaning.factIds[0]])||canonicalJson(d.supportingAncestryRoots)!==canonicalJson([...roots].sort())||canonicalJson(d.owners)!==canonicalJson(["synthetic:friendship:owner:A","synthetic:friendship:owner:B"])||canonicalJson(d.types)!==canonicalJson(["INTP","ESFJ"])||!d.safe||!d.actuallyDisplayed)throw Error("REGISTERED_DISPLAY_IDENTITY_REQUIRED");
  }
  for(const c of candidates) {
    const material=native.materials.find(m=>m.id===c.record.originalId),located=await catalog.reader.locate(c.record.locator);
    if(c.provenance!=="SYNTHETIC_TEST_ONLY"||!material||located.code||recordHash(located.value)!==c.record.locator.recordSha256||canonicalJson(material)!==canonicalJson(located.value))throw Error("REGISTERED_SYNTHETIC_MATERIAL_REQUIRED");
    if(canonicalJson(c.requirement)!==canonicalJson(material.requirement))throw Error("REGISTERED_REQUIREMENTS_MUST_NOT_CHANGE");
    const q=questions.find(q=>q.id===material.questionId);if(!q)throw Error("REGISTERED_QUESTION_REQUIRED");
    const receipt=bindKnowledgeCandidate(c,actual,catalog,approvals);
    if(receipt.allTwelveGateResults.map(g=>g.gate).join()!==BINDING_HARD_GATES.join())throw Error("ALL_TWELVE_GATES_REQUIRED");
    const reasons=[...actual.errors,...receipt.allTwelveGateResults.filter(g=>!["PASS","NOT_APPLICABLE"].includes(g.state)).flatMap(g=>g.reasons)];
    const ids=[...new Set(material.meaning.factIds.concat(material.requirement.sourceGroups.flatMap(g=>g.sourceRequirementIds.map(id=>id.split(":fact:").at(-1)!))))];
    for(const id of ids){
      const fact=native.facts.find(f=>f.id===id),node=request.graph.nodes.find(n=>n.fact.producerEvidenceId==="synthetic:friendship:fact:"+id),expectedOwner=fact?.owner==="PAIR"?actual.owner("PAIR"):actual.owner(fact?.owner==="A"?"A":"B");
      if(!fact||!node||node.kind!==fact.kind||node.owner.fixtureOwnerId!==expectedOwner||node.status!=="VERIFIED"||!node.ancestry.complete||node.producer.version!=="synthetic-friendship-v1"||canonicalJson(node.value)!==canonicalJson(fact.value)||node.fact.rootId!==(fact.root?"synthetic:friendship:root:"+fact.root:null)||canonicalJson(node.ancestry.parentIds.slice().sort())!==canonicalJson(fact.parents.map(id=>request.graph.nodes.find(n=>n.fact.producerEvidenceId==="synthetic:friendship:fact:"+id)?.id??"MISSING").sort()))reasons.push("REGISTERED_OWNED_PRODUCER_WITNESS_REQUIRED");
      if(node){const ancestry=actual.ancestors(node);reasons.push(...domainReasons(ancestry.flatMap(n=>n.ancestry.domains).concat(ancestry.flatMap(n=>isRecord(n.value)&&typeof n.value.sourceDomain==="string"?[n.value.sourceDomain]:[]))));
        if(node.kind==="CANONICAL_PAIR_FACT"&&(!isRecord(node.value)||!["six_harmony","three_harmony","half_harmony","clash","harm"].includes(String(node.value.kind))||canonicalJson(node.participants.map(p=>[p.owner,p.position,p.value]))!==canonicalJson([[actual.owner("A"),"day","申"],[actual.owner("B"),"day","子"]])))reasons.push("EXACT_SUPPORTED_PAIR_PARTICIPANTS_REQUIRED");
        if(node.kind==="DIRECTIONAL_RELATION_FACT"&&(!node.direction||node.direction.subject!==actual.owner(fact?.owner==="A"?"A":"B")||node.direction.recipient!==actual.owner(fact?.owner==="A"?"B":"A")||node.direction.relationId!==node.fact.producerEvidenceId||canonicalJson(node.direction)!==canonicalJson(fact?.direction)))reasons.push("EXACT_RECIPIENT_TEN_GOD_REQUIRED");
        if(node.kind==="FUSION_DERIVATION"&&(!isRecord(node.value)||node.value.ruleId==="UNKNOWN"||!ancestry.some(n=>n.kind==="CALCULATED_NATAL_FACT"&&n.owner.fixtureOwnerId===node.owner.fixtureOwnerId)||!ancestry.some(n=>n.kind==="MBTI_SOURCE_NODE"&&n.owner.fixtureOwnerId===node.owner.fixtureOwnerId)||ancestry.some(n=>["CALCULATED_NATAL_FACT","MBTI_SOURCE_NODE"].includes(n.kind)&&n.owner.fixtureOwnerId!==node.owner.fixtureOwnerId)))reasons.push("OWN_FUSION_ROOT_AND_RULE_REQUIRED");
      }
    }
    const contextFact=material.meaning.factIds.map(id=>request.graph.nodes.find(n=>n.fact.producerEvidenceId==="synthetic:friendship:fact:"+id)).find(n=>n?.kind==="CONTEXT_INPUT");
    if(!contextFact||!isRecord(contextFact.value)||canonicalJson(contextFact.value.friendshipContext)!==canonicalJson(material.meaning.assertion.context))reasons.push("REGISTERED_FRIENDSHIP_CONTEXT_REQUIRED");
    reasons.push(...evaluateFriendshipAssertion(material.meaning.assertion));
    if(!material.meaning.reviewed)reasons.push("MEANING_REVIEW_REQUIRED");
    if(material.meaning.function!==(q.mode==="REPAIR"?"REPAIR":q.mode==="RECALL"?"RECALL":"NEW_APPLICATION"))reasons.push("QUESTION_INFORMATION_MODE_MISMATCH");
    if(material.meaning.assertion.action==="ACTUAL_REPAIR"&&material.meaning.function!=="REPAIR")reasons.push("ACTUAL_REPAIR_REQUIRES_REPAIR_MATERIAL");
    if(material.meaning.assertion.owner!==material.meaning.owner)reasons.push("ASSERTION_OWNER_MISMATCH");
    if(q.owner!==material.meaning.owner||q.direction!==material.meaning.direction)reasons.push("QUESTION_OWNER_DIRECTION_MISMATCH");
    if(material.meaning.function!=="NEW_APPLICATION")reasons.push(...evaluateIntroducedGroups(material.meaning.introducedGroups,displays,expected).reasons);
    const primary=request.graph.nodes.find(n=>n.fact.producerEvidenceId==="synthetic:friendship:fact:"+material.meaning.factIds[0]),roots=primary?.fact.rootId?[primary.fact.rootId]:[];
    if(!roots.length)reasons.push("ACTUAL_INFORMATION_ROOT_REQUIRED");
    options.push({id:c.record.originalId,question:q,meaning:material.meaning,receipt,informationRoots:roots,supportingAncestryRoots:receipt.canonicalFactRoots,eligible:receipt.customerApproved&&!reasons.length,reasons:[...new Set(reasons)].sort()});
  }
  if(hash(catalog.reader.text(SYNTHETIC_FILE))!==catalog.input.frozen.get(SYNTHETIC_FILE))throw Error("SYNTHETIC_SOURCE_CHANGED_DURING_RUN");
  const session=Object.freeze({mode:"SYNTHETIC_ELIGIBLE_SELECTION_TEST" as const});sessions.set(session,structuredClone({questions,options}));return session;
}
export function optionsFor(session:Session){const data=sessions.get(session);if(!data)throw Error("AUTHENTIC_FRIENDSHIP_SESSION_REQUIRED");return structuredClone(data.options);}
export function selectionViolations(rows:Option[],final=false){const reasons:string[]=[];for(let i=0;i<rows.length;i++){const a=rows[i];for(const b of rows.slice(i+1)){if(a.question.id===b.question.id)reasons.push("ONE_CANDIDATE_PER_QUESTION");if(meaningRelations(a.meaning,b.meaning,a.informationRoots.some(r=>b.informationRoots.includes(r))).confirmedConflict)reasons.push("SAME_MEANING_OR_CLAIM");}if(final&&a.meaning.function==="REPAIR"&&!a.meaning.introducedGroups.some(g=>g.materialIds.every(id=>rows.some(b=>b.id===id&&b.question.chapter===7))))reasons.push("SELECTED_PRECEDING_FRICTION_REQUIRED");}return [...new Set(reasons)].sort();}
export function selectSynthetic(session:Session,method:Method,limit=100000){
 const data=sessions.get(session);if(!data)throw Error("AUTHENTIC_FRIENDSHIP_SESSION_REQUIRED");if(!Number.isInteger(limit)||limit<1)throw Error("POSITIVE_SEARCH_LIMIT_REQUIRED");
 const reserve=(q:Question)=>q.chapter===5?0:q.chapter===6?1:q.chapter===7?2:3;
 const questions=[...data.questions].sort((a,b)=>(method==="GLOBAL_CONSTRAINT_AWARE"?reserve(a)-reserve(b):0)||a.chapter-b.chapter||a.id.localeCompare(b.id,"en")),pools=new Map(questions.map(q=>[q.id,data.options.filter(o=>o.question.id===q.id&&o.eligible).sort((a,b)=>method==="FIRST_ELIGIBLE"?a.id.localeCompare(b.id,"en"):b.meaning.fit-a.meaning.fit||a.id.localeCompare(b.id,"en"))]));
 const score=(rows:Option[])=>[rows.filter(o=>o.question.chapter===5).length,rows.filter(o=>o.question.chapter===6).length,rows.filter(o=>o.question.chapter===7).length,rows.length,new Set(rows.filter(o=>o.meaning.function!=="RECALL").map(o=>o.meaning.id)).size,new Set(rows.flatMap(o=>o.meaning.concepts)).size,new Set(rows.map(o=>o.meaning.lifeContext)).size,Math.min(rows.filter(o=>o.meaning.owner==="A").length,rows.filter(o=>o.meaning.owner==="B").length),new Set(rows.map(o=>o.meaning.informationFunction)).size,new Set(rows.flatMap(o=>o.informationRoots)).size,rows.reduce((n,o)=>n+o.meaning.fit,0)];
 const compare=(a:number[],b:number[])=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;};
 let selected:Option[]=[],visited=0,complete=true;
 if(method!=="GLOBAL_CONSTRAINT_AWARE"){for(const q of questions){const found=pools.get(q.id)!.find(o=>!selectionViolations([...selected,o]).length);if(found)selected.push(found);}selected=selected.filter(o=>o.meaning.function!=="REPAIR"||o.meaning.introducedGroups.some(g=>g.materialIds.every(id=>selected.some(p=>p.id===id&&p.question.chapter===7))));}
 else {const remaining=questions.map((_,i)=>questions.slice(i).filter(q=>pools.get(q.id)!.length).length);const stack:{i:number;rows:Option[]}[]=[{i:0,rows:[]}];while(stack.length){if(++visited>limit){complete=false;break;}const {i,rows}=stack.pop()!;const upper=[5,6,7].map(ch=>rows.filter(o=>o.question.chapter===ch).length+questions.slice(i).filter(q=>q.chapter===ch&&pools.get(q.id)!.length).length).concat(rows.length+(remaining[i]??0));if(compare(upper,score(selected).slice(0,4))<0)continue;if(i===questions.length){if(selectionViolations(rows,true).length)continue;const c=compare(score(rows),score(selected));if(c>0||c===0&&canonicalJson(rows.map(r=>r.id))<canonicalJson(selected.map(r=>r.id)))selected=rows;continue;}stack.push({i:i+1,rows});for(const o of [...pools.get(questions[i].id)!].reverse())if(!selectionViolations([...rows,o]).length)stack.push({i:i+1,rows:[...rows,o]});}}
 const roots=selected.flatMap(o=>o.informationRoots),issues=selected.flatMap(o=>evaluateFriendshipAssertion(o.meaning.assertion));
 return {method,selected:selected.map(o=>({id:o.id,questionId:o.question.id,address:o.question.address,function:o.meaning.function})),coveredQuestions:selected.length,independentMeanings:new Set(selected.filter(o=>o.meaning.function!=="RECALL").map(o=>o.meaning.id)).size,distinctConcepts:new Set(selected.flatMap(o=>o.meaning.concepts)).size,distinctLifeContexts:new Set(selected.map(o=>o.meaning.lifeContext)).size,rootReferences:roots.length,distinctRoots:new Set(roots).size,repeatedRootReferences:roots.length-new Set(roots).size,meaningDuplication:selectionViolations(selected).filter(r=>r==="SAME_MEANING_OR_CLAIM").length,conflicts:selectionViolations(selected,true),hardGateViolations:selected.filter(o=>o.receipt.allTwelveGateResults.some(g=>!["PASS","NOT_APPLICABLE"].includes(g.state))).length,policyViolations:issues,ownerErrors:selected.filter(o=>o.reasons.some(r=>r.includes("OWNER"))).length,directionErrors:selected.filter(o=>o.reasons.some(r=>r.includes("DIRECTION"))).length,domainErrors:selected.filter(o=>o.reasons.some(r=>r.includes("DOMAIN"))).length,unfilled:questions.filter(q=>!selected.some(o=>o.question.id===q.id)).map(q=>({id:q.id,reasons:[...new Set(data.options.filter(o=>o.question.id===q.id).flatMap(o=>o.eligible?[...selectionViolations([...selected,o]),"GLOBAL_RESERVATION_OR_DEPENDENCY"]:o.reasons))].sort()})),search:{visited,complete,status:complete?"COMPLETE":"SEARCH_LIMIT_NO_OPTIMALITY_CLAIM"},actualCustomerApproval:0,claimsEmitted:0};
}
