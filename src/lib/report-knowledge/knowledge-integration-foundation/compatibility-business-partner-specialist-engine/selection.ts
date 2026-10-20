import { canonicalJson, hash, recordHash } from "../sourceReader";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BINDING_HARD_GATES } from "../types";
import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import type { Fixture } from "./synthetic";
import {compatibleBusinessDisplay,validateBusinessAssertion,type BusinessMeaning,type Display} from "./policy";
import {meaningConflict} from "../compatibility-love-specialist-engine/policy";
import {domainReasons} from "./domainBoundary";
import type { KnowledgeBindingReceipt } from "../knowledge-binder/types";
export const SYNTHETIC_FILE = "tests/fixtures/compatibility-business-partner-specialist-engine-01/synthetic-knowledge.json";
export type Question = { id: string; address: string; chapter: number; paragraph: number; role: number | null; priority: boolean; requiredDirection: string | null; requiredOwner: string; repair: boolean; recall: boolean };
import {ROLE_VERSION,type BusinessAssertion} from "./policy";
export type SyntheticMeaning = BusinessMeaning & { introductionAddress:string|null;displaySourceGroupId:string;displaySourceKeys:string[];precedingConditionMeaning:string|null; precedingIntroductionAddress:string|null; precedingMaterialId:string|null; precedingWorkStage:string|null; precedingOutputType:string|null; businessPartner:BusinessAssertion; informationFunction:"POSITIVE"|"RISK"|"DIRECT"|"TWIST"; factIds: string[]; fit: number; requiresFriction: boolean; frictionOf: string | null; event: boolean; forcedContact: boolean; forcedRepair: boolean; safety: string[]; types: string[] };
export type Option = { id: string; question: Question; meaning: SyntheticMeaning; receipt: KnowledgeBindingReceipt; informationRoots: string[]; supportingAncestryRoots: string[]; owners: string[]; eligible: boolean; reasons: string[] };
export type Method = "FIRST_ELIGIBLE" | "QUESTION_FIT_FIRST" | "GLOBAL_CONSTRAINT_AWARE";
export type Session = { mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" };
const sessions = new WeakMap<Session, { questions: Question[]; options: Option[]; byQuestion: Map<string,Option[]> }>();
// Only the authenticated fixture builder can register a session. Data returned
// to callers is cloned; a fabricated session or option cannot gain approval.
function registerSyntheticSession(questions: Question[], options: Option[]): Session {
  if (questions.length !== 180 || options.some(o => !o.id.startsWith("synthetic:business-partner:") || o.eligible && (!o.receipt.customerApproved || o.receipt.allTwelveGateResults.some(g => !["PASS", "NOT_APPLICABLE"].includes(g.state))))) throw Error("AUTHENTIC_SYNTHETIC_GATES_REQUIRED");
  const s = Object.freeze({ mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" as const }); const cloned=structuredClone({questions,options}),byQuestion=new Map<string,Option[]>();
  for(const o of cloned.options){const rows=byQuestion.get(o.question.id)??[];rows.push(o);byQuestion.set(o.question.id,rows);}
  sessions.set(s,{...cloned,byQuestion}); return s;
}
export async function createVerifiedSession(catalog: KnowledgeBinderCatalog, request: KnowledgeBindingRequest, candidates: readonly KnowledgeCandidate[], questions: Question[], approvals: KnowledgeBindingApprovalProvider, displays: readonly Display[]) {
  if (request.product !== "saju_mbti_compatibility" || request.relationship !== "businessPartner" || !request.graph.context.fixtureId.startsWith("synthetic:business-partner:") || catalog.input.records.length !== candidates.length || catalog.input.records.some(r => r.family !== "compatibility-business-partner-synthetic-fixture" || r.locator.file !== SYNTHETIC_FILE || !r.originalId.startsWith("synthetic:business-partner:")) || request.graph.nodes.some(n => n.producer.file !== SYNTHETIC_FILE)) throw Error("INDEPENDENT_SYNTHETIC_REGISTRY_REQUIRED");
  const text = catalog.reader.text(SYNTHETIC_FILE);
  if (hash(text) !== catalog.input.frozen.get(SYNTHETIC_FILE)) throw Error("SYNTHETIC_REGISTRY_HASH_MISMATCH");
  const native = JSON.parse(text) as Fixture;
  if (request.graph.context.fixtureId.endsWith(":same-god")) native.facts = native.sameGodFacts;
  if (canonicalJson(questions) !== canonicalJson(native.questions) || displays.some(d => !native.displays.some(p => canonicalJson(d) === canonicalJson(p)))) throw Error("REGISTERED_QUESTIONS_AND_ACTUAL_DISPLAYS_REQUIRED");
  const index = new ActualBindingIndex(request, catalog), options: Option[] = [];
  if(request.graphInput.evidence.input.kind!=="compatibility" || request.graphInput.evidence.input.compatibilityRoleVersion!==ROLE_VERSION)throw Error("SYNTHETIC_FIXED_ROLE_PACKET_REQUIRED");
  for (const c of candidates) {
    const source = await catalog.reader.locate(c.record.locator), record = native.materials.find(m => m.id === c.record.originalId);
    if (c.provenance !== "SYNTHETIC_TEST_ONLY" || !record || source.code || recordHash(source.value) !== c.record.locator.recordSha256 || canonicalJson(source.value) !== canonicalJson(record)) throw Error("REGISTERED_SYNTHETIC_MATERIAL_REQUIRED");
    if(c.requirement.sourceGroups.length!==record.sourceGroups.length||c.requirement.sourceGroups.some((g,i)=>canonicalJson(g.originalDeclaration)!==canonicalJson(record.sourceGroups[i])||g.originalId!==record.sourceGroups[i].id||canonicalJson(g.sourceRequirementIds)!==canonicalJson(record.sourceGroups[i].factIds.map(id=>record.id+":fact:"+id))))throw Error("REGISTERED_SOURCE_GROUP_CONJUNCTION_REQUIRED");
    for(const id of new Set([...record.meaning.factIds,...record.sourceGroups.flatMap(g=>g.factIds)])){const spec=c.requirement.sourceRequirements.find(s=>s.id===record.id+":fact:"+id),fact=native.facts.find(f=>f.id===id);if(!spec||!spec.required||spec.use!=="ACTUAL_FACT"||spec.selector?.evidenceId!=="synthetic:business-partner:fact:"+id||spec.owner!==fact?.owner||spec.selector.owner!==fact?.owner||canonicalJson(spec.selector.kinds)!==canonicalJson([fact?.kind]))throw Error("REGISTERED_SOURCE_OWNERSHIP_REQUIREMENT_REQUIRED");}
    const q = questions.find(q => q.id === record.questionId)!;
    if (!q) throw Error("REGISTERED_QUESTION_REQUIRED");
    const receipt = bindKnowledgeCandidate(c, index, catalog, approvals);
    if (receipt.allTwelveGateResults.map(g => g.gate).join("|") !== BINDING_HARD_GATES.join("|")) throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
    const requiredAncestors = receipt.selectedActualEvidence.flatMap(id => { const n = index.graph.nodes.get(id); return n ? index.ancestors(n) : []; });
    const reasons = [...index.errors, ...domainReasons(requiredAncestors.flatMap(n => n.ancestry.domains)), ...receipt.allTwelveGateResults.filter(g => !["PASS", "NOT_APPLICABLE"].includes(g.state)).flatMap(g => g.reasons)];
    for (const id of record.meaning.factIds) {
      const declared = native.facts.find(f => f.id === id), n = request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:business-partner:fact:" + id);
      const expectedOwner = declared?.owner === "PAIR" ? index.owner("PAIR") : declared?.owner === "A" ? index.owner("A") : index.owner("B");
      if (!n || !declared || n.kind !== declared.kind || n.owner.fixtureOwnerId !== expectedOwner || n.producer.version !== "synthetic-business-partner-v1" || n.status !== "VERIFIED" || !n.ancestry.complete || canonicalJson(n.value) !== canonicalJson(declared.value) || n.fact.rootId !== (declared.root ? "synthetic:business-partner:root:" + declared.root : null) || canonicalJson(n.ancestry.parentIds.slice().sort()) !== canonicalJson(declared.parents.map(id => request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:business-partner:fact:" + id)?.id ?? "MISSING").sort())) reasons.push("REGISTERED_OWNED_PRODUCER_WITNESS_REQUIRED");
      if (n?.kind === "CANONICAL_PAIR_FACT" && (n.participants.length !== 2 || new Set(n.participants.map(p => p.owner)).size !== 2 || !isRecord(n.value) || !["six_harmony", "three_harmony", "half_harmony", "clash", "harm"].includes(String(n.value.kind)) || canonicalJson(n.participants.map(p => [p.owner, p.position, p.value])) !== canonicalJson([[index.owner("A"), "day", "申"], [index.owner("B"), "day", "子"]]))) reasons.push("EXACT_SUPPORTED_PAIR_PARTICIPANTS_REQUIRED");
      if(n?.kind === "DIRECTIONAL_RELATION_FACT" && (!isRecord(n.value)||canonicalJson(n.value)!==canonicalJson(declared?.value)||n.direction?.relationId!=="synthetic:business-partner:fact:"+id))reasons.push("EXACT_RECIPIENT_TEN_GOD_REQUIRED");
      if (n?.kind === "FUSION_DERIVATION" && (!isRecord(n.value) || n.value.ruleId === "UNKNOWN" || !index.ancestors(n).some(p => p.owner.fixtureOwnerId === n.owner.fixtureOwnerId && p.kind === "MBTI_SOURCE_NODE") || !index.ancestors(n).some(p => p.owner.fixtureOwnerId === n.owner.fixtureOwnerId && p.kind === "CALCULATED_NATAL_FACT"))) reasons.push("OWN_FUSION_ROOT_AND_RULE_REQUIRED");
      if (n?.kind === "SOURCE_DECLARATION" && (!isRecord(n.value) || n.value.sourceType !== "INTP" || n.value.targetType !== "ESTJ" || n.value.classification !== "REFERENCE_ONLY")) reasons.push("EXACT_DIRECTED_PAIR_REFERENCE_REQUIRED");
    }
    const businessFacts=record.meaning.factIds.flatMap(id=>{const n=request.graph.nodes.find(n=>n.fact.producerEvidenceId==="synthetic:business-partner:fact:"+id);return n?.kind==="CONTEXT_INPUT"&&isRecord(n.value)?[n.value.businessContext]:[];});
    if(!businessFacts.some(v=>canonicalJson(v)===canonicalJson(record.meaning.businessPartner.context)))reasons.push("REGISTERED_ACTUAL_BUSINESS_CONTEXT_REQUIRED");
    const primary = request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:business-partner:fact:" + record.meaning.factIds[0]), roots = primary?.fact.rootId ? [primary.fact.rootId] : [];
    if(receipt.sourceGroupEvaluation.length!==record.sourceGroups.length||receipt.sourceGroupEvaluation.some(g=>g.state!=="PASS"))reasons.push("SOURCE_GROUP_AND_INCOMPLETE");
    reasons.push(...optionPolicy(q, record.meaning, roots, displays));
    options.push({ id: c.record.originalId, question: q, meaning: record.meaning, receipt, informationRoots: roots, supportingAncestryRoots: receipt.canonicalFactRoots, owners: [index.owner("A")!, index.owner("B")!], eligible: receipt.customerApproved && !reasons.length, reasons: [...new Set(reasons)].sort() });
  }
  if(hash(catalog.reader.text(SYNTHETIC_FILE))!==catalog.input.frozen.get(SYNTHETIC_FILE))throw Error("SYNTHETIC_REGISTRY_CHANGED_DURING_VALIDATION");
  return registerSyntheticSession(questions, options);
}
export function optionsFor(s: Session) { const d = sessions.get(s); if (!d) throw Error("AUTHENTIC_BUSINESS_PARTNER_SESSION_REQUIRED"); return structuredClone(d.options); }
export function optionPolicy(q: Question, m: SyntheticMeaning, roots: string[], displays: readonly Display[]): string[] {
  const reasons=validateBusinessAssertion(m.businessPartner);
  if(!m.reviewed)reasons.push("MEANING_REVIEW_REQUIRED");
  if(q.requiredDirection!==m.direction||q.requiredOwner!==m.owner)reasons.push("QUESTION_OWNER_DIRECTION_MISMATCH");
  if(m.event)reasons.push("UNENTERED_PAST_EXPERIENCE_BLOCKED");
  if(!roots.length)reasons.push("ACTUAL_INFORMATION_ROOT_REQUIRED");
  const expected={owners:["synthetic:business-partner:owner:A","synthetic:business-partner:owner:B"],types:m.types,roots,direction:m.direction,meaning:m.id,claim:m.claim,context:m.context,roleVersion:m.businessPartner.roleVersion,workStage:m.workStage,taskId:m.businessPartner.context?.taskId??"UNKNOWN",outputType:m.outputType,materialId:m.precedingMaterialId??"MISSING",sourceGroupId:m.displaySourceGroupId,sourceKeys:m.displaySourceKeys,businessStatus:m.businessPartner.context?.businessStatus??"UNKNOWN",contributionKind:m.contributionKind,financialQuestion:m.financialQuestion,decisionRight:m.decisionRight,contractRight:m.contractRight};
  if(m.requiresFriction){
    if(!m.precedingConditionMeaning||!/^CH07\.P[1-4](?:\.S[1-4])?$/.test(m.frictionOf??""))reasons.push("CH08_REQUIRES_PRECEDING_FRICTION");
    if(!compatibleBusinessDisplay({...expected,meaning:m.precedingConditionMeaning??"MISSING",claim:(m.precedingConditionMeaning??"MISSING")+":claim",workStage:m.precedingWorkStage??"UNKNOWN",outputType:m.precedingOutputType??"UNKNOWN"},displays,m.precedingIntroductionAddress))reasons.push("CH08_REQUIRES_ACTUAL_PRECEDING_DISPLAY");
  }
  if(m.function==="RECALL"&&!compatibleBusinessDisplay(expected,displays,m.introductionAddress))reasons.push("ACTUAL_COMPATIBLE_DISPLAY_REQUIRED");
  return reasons;
}
function exactPredecessor(a:Option,b:Option){return b.question.chapter===7&&b.question.address===a.meaning.frictionOf&&b.eligible&&b.id===a.meaning.precedingMaterialId&&b.meaning.id===a.meaning.precedingConditionMeaning&&b.meaning.claim===(a.meaning.precedingConditionMeaning??"MISSING")+":claim"&&canonicalJson(b.owners)===canonicalJson(a.owners)&&canonicalJson(b.meaning.types)===canonicalJson(a.meaning.types)&&b.meaning.direction===a.meaning.direction&&b.meaning.displaySourceGroupId===a.meaning.displaySourceGroupId&&canonicalJson(b.meaning.displaySourceKeys)===canonicalJson(a.meaning.displaySourceKeys)&&canonicalJson(b.supportingAncestryRoots)===canonicalJson(a.supportingAncestryRoots)&&b.meaning.businessPartner.context?.taskId===a.meaning.businessPartner.context?.taskId&&b.meaning.workStage===a.meaning.precedingWorkStage&&b.meaning.outputType===a.meaning.precedingOutputType&&b.informationRoots.some(r=>a.informationRoots.includes(r));}
export function selectionViolations(rows: readonly Option[], final = false): string[] {
  const reasons = [];
  for (let i = 0; i < rows.length; i++) {
    const a = rows[i];
    for (const b of rows.slice(i + 1)) {
      if (a.question.id === b.question.id) reasons.push("ONE_CANDIDATE_PER_QUESTION");
      const sameRoot=a.informationRoots.some(r=>b.informationRoots.includes(r));
      reasons.push(...(a.meaning.function==="RECALL"?meaningConflict(b.meaning,a.meaning,sameRoot):meaningConflict(a.meaning,b.meaning,sameRoot)));
      if(!a.meaning.requiresFriction&&!b.meaning.requiresFriction&&sameRoot&&a.meaning.function!=="RECALL"&&b.meaning.function==="NEW_APPLICATION"&&a.meaning.workStage===b.meaning.workStage&&a.meaning.outputType===b.meaning.outputType&&a.meaning.contributionKind===b.meaning.contributionKind&&a.meaning.financialQuestion===b.meaning.financialQuestion&&a.meaning.contractRight===b.meaning.contractRight&&a.meaning.decisionRight===b.meaning.decisionRight)reasons.push("VERIFIED_NEW_BUSINESS_APPLICATION_REQUIRED");
    }
    if (final && (a.meaning.requiresFriction || a.meaning.businessPartner.actualRecovery) && !rows.some(b=>exactPredecessor(a,b))) reasons.push("SELECTED_VERIFIED_FRICTION_REQUIRED");
  }
  return [...new Set(reasons)].sort();
}
export function selectSynthetic(s:Session,method:Method,limit=100000){
 const data=sessions.get(s);if(!data)throw Error("AUTHENTIC_BUSINESS_PARTNER_SESSION_REQUIRED");if(!Number.isInteger(limit)||limit<1)throw Error("POSITIVE_SEARCH_LIMIT_REQUIRED");
 const qs=[...data.questions].sort((a,b)=>method==="GLOBAL_CONSTRAINT_AWARE"?Number(b.priority)-Number(a.priority)||a.address.localeCompare(b.address,"en"):a.address.localeCompare(b.address,"en"));
 const pools=qs.map(q=>(data.byQuestion.get(q.id)??[]).filter(o=>o.eligible).sort((a,b)=>method==="FIRST_ELIGIBLE"?a.id.localeCompare(b.id,"en"):b.meaning.fit-a.meaning.fit||a.id.localeCompare(b.id,"en")));
 const score=(rows:Option[])=>[rows.filter(o=>o.question.priority).length,rows.length,new Set(rows.filter(o=>o.meaning.function!=="RECALL").map(o=>o.meaning.id)).size,new Set(rows.map(o=>o.meaning.workStage)).size,new Set(rows.map(o=>o.meaning.contributionKind)).size,new Set(rows.map(o=>o.meaning.financialQuestion)).size,new Set(rows.map(o=>o.meaning.decisionRight)).size,Math.min(rows.filter(o=>o.meaning.owner==="A").length,rows.filter(o=>o.meaning.owner==="B").length),new Set(rows.map(o=>o.meaning.informationFunction)).size,rows.reduce((n,o)=>n+o.meaning.fit,0)];
 const better=(a:Option[],b:Option[])=>{const x=score(a),y=score(b);for(let i=0;i<x.length;i++)if(x[i]!==y[i])return x[i]>y[i];return canonicalJson(a.map(o=>o.id))<canonicalJson(b.map(o=>o.id));};
 let selected:Option[]=[],visited=0,complete=true;
 const feasible=(rows:Option[])=>!selectionViolations(rows).length;
 if(method!=="GLOBAL_CONSTRAINT_AWARE") {for(const pool of pools){const found=pool.find(o=>feasible([...selected,o]));if(found)selected.push(found);}selected=selected.filter(o=>!o.meaning.requiresFriction||selected.some(p=>exactPredecessor(o,p)));}
 else {
  // Explicit stack with admissible remaining-coverage bounds. Hard conditions
  // are checked before scoring. A finite limit never claims optimality.
  const pending:{at:number;rows:Option[]}[]=[{at:0,rows:[]}];
  while(pending.length){if(++visited>limit){complete=false;break;}const state=pending.pop()!,{at,rows}=state,current=score(rows),best=score(selected),remaining=qs.slice(at).filter((_,i)=>pools[at+i].length),upperPriority=current[0]+remaining.filter(q=>q.priority).length;
   if(upperPriority<best[0]||upperPriority===best[0]&&rows.length+remaining.length<selected.length)continue;
   if(at===qs.length){if(!selectionViolations(rows,true).length&&better(rows,selected))selected=rows;continue;}
   pending.push({at:at+1,rows});for(const o of pools[at].slice().reverse())if(feasible([...rows,o]))pending.push({at:at+1,rows:[...rows,o]});
  }
 }
 const roots=selected.flatMap(o=>o.informationRoots),policyIssues=selected.flatMap(o=>validateBusinessAssertion(o.meaning.businessPartner));
 return {method,selected:selected.map(o=>({id:o.id,questionId:o.question.id,address:o.question.address,function:o.meaning.function})),coveredQuestions:selected.length,coveredParagraphs:new Set(selected.map(o=>o.question.address.split(".").slice(0,2).join("."))).size,coveredChapters:new Set(selected.map(o=>o.question.chapter)).size,independentMeanings:new Set(selected.filter(o=>o.meaning.function!=="RECALL").map(o=>o.meaning.id)).size,distinctRoots:new Set(roots).size,repeatedRootReferences:roots.length-new Set(roots).size,conflicts:selectionViolations(selected,true),unfilled:qs.filter(q=>!selected.some(o=>o.question.id===q.id)).map(q=>({questionId:q.id,address:q.address,reasons:[...new Set((data.byQuestion.get(q.id)??[]).flatMap(o=>o.eligible?[...selectionViolations([...selected,o]),"GLOBAL_RESERVATION_OR_DEPENDENCY"]:o.reasons))].sort()})),search:{visited,complete,status:complete?"COMPLETE":"SEARCH_LIMIT_NO_OPTIMALITY_CLAIM"},distinctStageCoverage:new Set(selected.map(o=>o.meaning.workStage)).size,distinctContributionCoverage:new Set(selected.map(o=>o.meaning.contributionKind)).size,distinctFinancialQuestionCoverage:new Set(selected.map(o=>o.meaning.financialQuestion)).size,distinctDecisionRightCoverage:new Set(selected.map(o=>o.meaning.decisionRight)).size,ownerInformationBalance:{A:selected.filter(o=>o.meaning.owner==="A").length,B:selected.filter(o=>o.meaning.owner==="B").length},ownerErrors:selected.filter(o=>o.reasons.some(r=>r.includes("OWNER"))).length,directionErrors:selected.filter(o=>o.reasons.some(r=>r.includes("DIRECTION"))).length,domainErrors:selected.filter(o=>o.reasons.some(r=>r.includes("DOMAIN"))).length,recallErrors:selected.filter(o=>o.meaning.function==="RECALL"&&o.reasons.length).length,hardGateViolations:selected.filter(o=>o.receipt.allTwelveGateResults.some(g=>!["PASS","NOT_APPLICABLE"].includes(g.state))).length,sourceGroupPass:selected.filter(o=>o.receipt.sourceGroupEvaluation.every(g=>g.state==="PASS")).length,safetyViolations:policyIssues.filter(r=>r.includes("SAFETY")||r.includes("UNCONSENTED")).length,unverifiedFinancialClaims:policyIssues.filter(r=>r.includes("FINANCIAL")).length,unverifiedLegalClaims:policyIssues.filter(r=>r.includes("LEGAL")).length,unverifiedAuthorityClaims:policyIssues.filter(r=>r.includes("AUTHORITY")).length,unsupportedBusinessOutcomes:policyIssues.filter(r=>r.includes("BUSINESS_OUTCOME")).length,claimsEmitted:0};
}
