import { canonicalJson, hash, recordHash } from "../sourceReader";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BINDING_HARD_GATES } from "../types";
import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import type { Fixture } from "./synthetic";
import { parentChildRecallDisplay, meaningConflict, safetyReasons, parentChildDomainReasons, type Meaning, type Display } from "./parentChildPolicy";
import type { KnowledgeBindingReceipt } from "../knowledge-binder/types";
export const SYNTHETIC_FILE = "tests/fixtures/compatibility-parent-child-specialist-engine-01/synthetic-knowledge.json";
export type Question = { id: string; address: string; chapter: number; paragraph: number; role: number | null; priority: boolean; requiredDirection: string | null; requiredOwner: string; repair: boolean; recall: boolean };
import {validateParentChildAssertion,type ParentChildAssertion} from "./parentChildPolicy";
import {ROLE_VERSION} from "./roleValidator";
export type SyntheticMeaning = Meaning & { introductionAddress:string|null;precedingConditionMeaning:string|null; parentChild:ParentChildAssertion; informationFunction:"POSITIVE"|"RISK"|"DIRECT"|"TWIST"; factIds: string[]; fit: number; requiresFriction: boolean; frictionOf: string | null; event: boolean; forcedContact: boolean; forcedRepair: boolean; safety: string[]; types: string[] };
export type Option = { id: string; question: Question; meaning: SyntheticMeaning; receipt: KnowledgeBindingReceipt; informationRoots: string[]; supportingAncestryRoots: string[]; owners: string[]; eligible: boolean; reasons: string[] };
export type Method = "FIRST_ELIGIBLE" | "QUESTION_FIT_FIRST" | "GLOBAL_CONSTRAINT_AWARE";
export type Session = { mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" };
const sessions = new WeakMap<Session, { questions: Question[]; options: Option[]; byQuestion: Map<string,Option[]> }>();
// Only the authenticated fixture builder can register a session. Data returned
// to callers is cloned; a fabricated session or option cannot gain approval.
function registerSyntheticSession(questions: Question[], options: Option[]): Session {
  if (questions.length !== 180 || options.some(o => !o.id.startsWith("synthetic:parent-child:") || o.eligible && (!o.receipt.customerApproved || o.receipt.allTwelveGateResults.some(g => !["PASS", "NOT_APPLICABLE"].includes(g.state))))) throw Error("AUTHENTIC_SYNTHETIC_GATES_REQUIRED");
  const s = Object.freeze({ mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" as const }); const cloned=structuredClone({questions,options}),byQuestion=new Map<string,Option[]>();
  for(const o of cloned.options){const rows=byQuestion.get(o.question.id)??[];rows.push(o);byQuestion.set(o.question.id,rows);}
  sessions.set(s,{...cloned,byQuestion}); return s;
}
export async function createVerifiedSession(catalog: KnowledgeBinderCatalog, request: KnowledgeBindingRequest, candidates: readonly KnowledgeCandidate[], questions: Question[], approvals: KnowledgeBindingApprovalProvider, displays: readonly Display[]) {
  if (request.product !== "saju_mbti_compatibility" || request.relationship !== "parentChild" || !request.graph.context.fixtureId.startsWith("synthetic:parent-child:") || catalog.input.records.length !== candidates.length || catalog.input.records.some(r => r.family !== "compatibility-parent-child-synthetic-fixture" || r.locator.file !== SYNTHETIC_FILE || !r.originalId.startsWith("synthetic:parent-child:")) || request.graph.nodes.some(n => n.producer.file !== SYNTHETIC_FILE)) throw Error("INDEPENDENT_SYNTHETIC_REGISTRY_REQUIRED");
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
    const q = questions.find(q => q.id === record.questionId)!;
    if (!q) throw Error("REGISTERED_QUESTION_REQUIRED");
    const receipt = bindKnowledgeCandidate(c, index, catalog, approvals);
    if (receipt.allTwelveGateResults.map(g => g.gate).join("|") !== BINDING_HARD_GATES.join("|")) throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
    const requiredAncestors = receipt.selectedActualEvidence.flatMap(id => { const n = index.graph.nodes.get(id); return n ? index.ancestors(n) : []; });
    const reasons = [...index.errors, ...parentChildDomainReasons(requiredAncestors.flatMap(n => n.ancestry.domains)), ...receipt.allTwelveGateResults.filter(g => !["PASS", "NOT_APPLICABLE"].includes(g.state)).flatMap(g => g.reasons)];
    for (const id of record.meaning.factIds) {
      const declared = native.facts.find(f => f.id === id), n = request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:parent-child:fact:" + id);
      const expectedOwner = declared?.owner === "PAIR" ? index.owner("PAIR") : declared?.owner === "A" ? index.owner("A") : index.owner("B");
      if (!n || !declared || n.kind !== declared.kind || n.owner.fixtureOwnerId !== expectedOwner || n.producer.version !== "synthetic-parent-child-v1" || n.status !== "VERIFIED" || !n.ancestry.complete || canonicalJson(n.value) !== canonicalJson(declared.value) || n.fact.rootId !== (declared.root ? "synthetic:parent-child:root:" + declared.root : null) || canonicalJson(n.ancestry.parentIds.slice().sort()) !== canonicalJson(declared.parents.map(id => request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:parent-child:fact:" + id)?.id ?? "MISSING").sort())) reasons.push("REGISTERED_OWNED_PRODUCER_WITNESS_REQUIRED");
      if (n?.kind === "CANONICAL_PAIR_FACT" && (n.participants.length !== 2 || new Set(n.participants.map(p => p.owner)).size !== 2 || !isRecord(n.value) || !["six_harmony", "three_harmony", "half_harmony", "clash", "harm"].includes(String(n.value.kind)) || canonicalJson(n.participants.map(p => [p.owner, p.position, p.value])) !== canonicalJson([[index.owner("A"), "day", "申"], [index.owner("B"), "day", "子"]]))) reasons.push("EXACT_SUPPORTED_PAIR_PARTICIPANTS_REQUIRED");
      if (n?.kind === "FUSION_DERIVATION" && (!isRecord(n.value) || n.value.ruleId === "UNKNOWN" || !index.ancestors(n).some(p => p.owner.fixtureOwnerId === n.owner.fixtureOwnerId && p.kind === "MBTI_SOURCE_NODE") || !index.ancestors(n).some(p => p.owner.fixtureOwnerId === n.owner.fixtureOwnerId && p.kind === "CALCULATED_NATAL_FACT"))) reasons.push("OWN_FUSION_ROOT_AND_RULE_REQUIRED");
      if (n?.kind === "SOURCE_DECLARATION" && (!isRecord(n.value) || n.value.sourceType !== "INTP" || n.value.targetType !== "ESFJ" || n.value.classification !== "REFERENCE_ONLY")) reasons.push("EXACT_DIRECTED_PAIR_REFERENCE_REQUIRED");
    }
    const primary = request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:parent-child:fact:" + record.meaning.factIds[0]), roots = primary?.fact.rootId ? [primary.fact.rootId] : [];
    reasons.push(...optionPolicy(q, record.meaning, roots, displays));
    options.push({ id: c.record.originalId, question: q, meaning: record.meaning, receipt, informationRoots: roots, supportingAncestryRoots: receipt.canonicalFactRoots, owners: [index.owner("A")!, index.owner("B")!], eligible: receipt.customerApproved && !reasons.length, reasons: [...new Set(reasons)].sort() });
  }
  return registerSyntheticSession(questions, options);
}
export function optionsFor(s: Session) { const d = sessions.get(s); if (!d) throw Error("AUTHENTIC_PARENT_CHILD_SESSION_REQUIRED"); return structuredClone(d.options); }
export function optionPolicy(q: Question, m: SyntheticMeaning, roots: string[], displays: readonly Display[]): string[] {
  const reasons = [...safetyReasons(m.safety, m.forcedContact, m.forcedRepair),...validateParentChildAssertion(m.parentChild)];
  if(m.parentChild.roleVersion!==ROLE_VERSION)reasons.push("V4_FIXED_ROLE_REQUIRED");
  if (!m.reviewed) reasons.push("MEANING_REVIEW_REQUIRED");
  if (q.requiredDirection !== m.direction || q.requiredOwner !== m.owner) reasons.push("QUESTION_OWNER_DIRECTION_MISMATCH");
  if (m.event) reasons.push("UNENTERED_PAST_EXPERIENCE_BLOCKED");
  if (!roots.length) reasons.push("ACTUAL_INFORMATION_ROOT_REQUIRED");
  if(m.requiresFriction && !m.precedingConditionMeaning)reasons.push("PRECEDING_CONDITION_MEANING_REQUIRED");
  if (m.requiresFriction && !/^CH07\.P[1-4]$/.test(m.frictionOf ?? "")) reasons.push("VERIFIED_PRECEDING_FRICTION_REQUIRED");
  if (m.function === "RECALL" && !parentChildRecallDisplay({ owners: ["synthetic:parent-child:owner:A", "synthetic:parent-child:owner:B"], types: m.types, roots, direction: m.direction, meaning: m.id, claim: m.claim, context: m.context,roleVersion:m.parentChild.roleVersion??"",developmentalContext:m.parentChild.context?.context??"UNKNOWN" }, displays,m.introductionAddress)) reasons.push("ACTUAL_COMPATIBLE_DISPLAY_REQUIRED");
  return reasons;
}
export function selectionViolations(rows: readonly Option[], final = false): string[] {
  const reasons = [];
  for (let i = 0; i < rows.length; i++) {
    const a = rows[i];
    for (const b of rows.slice(i + 1)) {
      if (a.question.id === b.question.id) reasons.push("ONE_CANDIDATE_PER_QUESTION");
      reasons.push(...meaningConflict(a.meaning, b.meaning, a.informationRoots.some(r => b.informationRoots.includes(r))));
    }
    if (final && (a.meaning.requiresFriction || a.meaning.parentChild.actualRecovery) && !rows.some(b => b.question.address === a.meaning.frictionOf && b.question.chapter === 7 && b.eligible && b.meaning.id===a.meaning.precedingConditionMeaning && canonicalJson(b.owners)===canonicalJson(a.owners) && b.informationRoots.some(r=>a.informationRoots.includes(r)))) reasons.push("SELECTED_VERIFIED_FRICTION_REQUIRED");
  }
  return [...new Set(reasons)].sort();
}
export function selectSynthetic(s: Session, method: Method, limit = 100000) {
  const data = sessions.get(s); if (!data) throw Error("AUTHENTIC_PARENT_CHILD_SESSION_REQUIRED");
  if (!Number.isInteger(limit) || limit < 1) throw Error("POSITIVE_SEARCH_LIMIT_REQUIRED");
  const qs = [...data.questions].sort((a, b) => method === "GLOBAL_CONSTRAINT_AWARE" ? Number(b.priority) - Number(a.priority) || a.chapter - b.chapter || a.id.localeCompare(b.id, "en") : a.chapter - b.chapter || a.id.localeCompare(b.id, "en"));
  const pools = new Map(qs.map(q => [q.id, (data.byQuestion.get(q.id)??[]).filter(o => o.eligible).sort((a, b) => method === "FIRST_ELIGIBLE" ? a.id.localeCompare(b.id, "en") : b.meaning.fit - a.meaning.fit || a.id.localeCompare(b.id, "en"))]));
  const score = (rows: Option[]) => [rows.filter(o => o.question.priority).length, rows.length, new Set(rows.filter(o => o.meaning.function !== "RECALL").map(o => o.meaning.id)).size,new Set(rows.map(o=>o.meaning.informationFunction)).size,rows.reduce((n,o)=>n+o.meaning.fit,0)];
  const compare = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  let selected: Option[] = [], visited = 0, complete = true;
  const valid = (rows: Option[]) => !selectionViolations(rows).length;
  if (method !== "GLOBAL_CONSTRAINT_AWARE") {
    for (const q of qs) { const found = pools.get(q.id)!.find(o => valid([...selected, o])); if (found) selected.push(found); }
    selected = selected.filter(o => !o.meaning.requiresFriction || selected.some(p => p.question.address === o.meaning.frictionOf && p.eligible && p.meaning.id===o.meaning.precedingConditionMeaning && canonicalJson(p.owners)===canonicalJson(o.owners) && p.informationRoots.some(r=>o.informationRoots.includes(r))));
  } else {
    const walk = (i: number, rows: Option[]) => {
      if (!complete || ++visited > limit) { complete = false; return; }
      const remaining = qs.slice(i), current = score(rows), best = score(selected), possible = remaining.filter(q => q.priority && pools.get(q.id)!.length).length;
      if (current[0] + possible < best[0] || current[0] + possible === best[0] && rows.length + remaining.filter(q => pools.get(q.id)!.length).length < selected.length) return;
      if (i === qs.length) { if (selectionViolations(rows, true).length) return; const c = compare(current, best); if (c > 0 || c === 0 && canonicalJson(rows.map(r => r.id)) < canonicalJson(selected.map(r => r.id))) selected = [...rows]; return; }
      for (const o of pools.get(qs[i].id)!) if (valid([...rows, o])) walk(i + 1, [...rows, o]); walk(i + 1, rows);
    }; walk(0, []);
  }
  const roots = selected.flatMap(o => o.informationRoots);
  return { method, selected: selected.map(o => ({ id: o.id, questionId: o.question.id, address: o.question.address, function: o.meaning.function })), coveredQuestions: selected.length, coveredParagraphs: new Set(selected.map(o => o.question.address.split(".").slice(0, 2).join("."))).size, coveredChapters: new Set(selected.map(o => o.question.chapter)).size, independentMeanings: new Set(selected.filter(o => o.meaning.function !== "RECALL").map(o => o.meaning.id)).size, distinctRoots: new Set(roots).size, repeatedRootReferences: roots.length - new Set(roots).size, rootNewFactViolations: selectionViolations(selected).filter(s => s === "SAME_ROOT_NOT_NEW_FACT").length, ownerErrors: selected.filter(o => o.reasons.some(r => r.includes("OWNER"))).length, directionErrors: selected.filter(o => o.reasons.some(r => r.includes("DIRECTION"))).length, domainErrors: selected.filter(o => o.reasons.some(r => r.includes("DOMAIN"))).length, recallErrors: selected.filter(o => o.meaning.function === "RECALL" && o.reasons.length).length, conflicts: selectionViolations(selected, true), unfilled: qs.filter(q => !selected.some(o => o.question.id === q.id)).map(q => ({ questionId: q.id, address: q.address, reasons: [...new Set((data.byQuestion.get(q.id)??[]).flatMap(o => o.eligible ? [...selectionViolations([...selected, o]), "GLOBAL_RESERVATION_OR_DEPENDENCY"] : o.reasons))] })), search: { visited, complete, status: complete ? "COMPLETE" : "SEARCH_LIMIT_NO_OPTIMALITY_CLAIM" }, wrongRole:selected.filter(o=>o.meaning.parentChild.roleVersion!==ROLE_VERSION).length,unsupportedDevelopmentalClaims:selected.filter(o=>o.meaning.parentChild.abilityPrediction||o.meaning.parentChild.schoolPrediction||o.meaning.parentChild.developmentalDiagnosis).length,childSafetyViolations:selected.filter(o=>validateParentChildAssertion(o.meaning.parentChild).length).length,unverifiedParentingClaims:selected.filter(o=>o.meaning.parentChild.requiredFacts.length).length, safetyViolations:selected.filter(o=>safetyReasons(o.meaning.safety,o.meaning.forcedContact,o.meaning.forcedRepair).length).length,claimsEmitted: 0 };
}
