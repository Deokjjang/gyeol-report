import { canonicalJson, hash, recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BINDING_HARD_GATES } from "../types";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate, KnowledgeBindingRequest, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import type { SyntheticQuestion, SyntheticFact, SyntheticMeaning, SyntheticOption, SyntheticSession, SelectionMethod, SelectionResult } from "./types";
export const SYNTHETIC_FILE = "tests/fixtures/annual-fortune-specialist-engine-01/synthetic-knowledge.json";
export type SyntheticDisplay = { id: string; owner: string; meaningId: string; claim: string; roots: string[]; context: string; actuallyDisplayed: true };
const sessions = new WeakMap<SyntheticSession, { questions: SyntheticQuestion[]; options: SyntheticOption[] }>();
export const ANNUAL_ROOT_REUSE_CONTRACT = { informationRoots: "Primary independent information; same root is not another calculated fact", supportingAncestryRoots: "Required ancestry can span months without new independent facts", hardRootCap: null, newApplication: "Reviewed distinct meaning AND actual condition AND application", recall: "Same owner/root/meaning/claim/context with actual registered display", realDisplayLedgerIssued: false } as const;
export function validateSyntheticMeaning(q: SyntheticQuestion, m: SyntheticMeaning, facts: readonly SyntheticFact[], segment: SyntheticFact): string[] {
  const primary = facts[0], reasons: string[] = [];
  if (!primary) return ["ACTUAL_FACT_REQUIRED"];
  if (m.id !== q.requiredMeaning) reasons.push("QUESTION_MEANING_MISMATCH");
  if (m.role === "AMBIGUOUS") reasons.push("AMBIGUOUS_MONTHLY_GOD_ROLE");
  if (m.role !== primary.role || m.god !== primary.god || m.referenceStem !== primary.referenceStem || m.targetStem !== primary.targetStem) reasons.push("WRONG_GOD_ROLE_OR_REFERENCE_STEM");
  if (m.annual !== segment.annual) reasons.push("WRONG_EFFECTIVE_ANNUAL");
  if (m.pillar !== segment.pillar) reasons.push("WRONG_MONTH_PILLAR");
  if (m.requiresDayun && (segment.uncertainDayun || segment.dayun === null || primary.uncertainDayun || primary.dayun === null)) reasons.push("UNKNOWN_TRANSITION");
  if (m.requiresDayun && (m.dayun !== segment.dayun || m.dayun !== primary.dayun)) reasons.push("WRONG_ACTIVE_DAYUN");
  if (m.scope !== primary.scope) reasons.push("WRONG_RELATION_SCOPE");
  if (!m.requiredParticipants.every(p => primary.participants.includes(p))) reasons.push("MISSING_PARTICIPANT");
  if (primary.scope.includes("samhap") && new Set(primary.participants).size !== 3) reasons.push("THREE_SIMULTANEOUS_PARTICIPANTS_REQUIRED");
  if (facts.some(f => f.composite)) reasons.push("UNSUPPORTED_COMPOSITE");
  if (facts.some(f => f.transit === "held")) reasons.push("UNSUPPORTED_TRANSIT");
  if (m.requiredLifeState.length) reasons.push("INPUT_CONTEXT_NOT_HISTORICAL_OR_FUTURE_FACT");
  if (m.event) reasons.push("UNVERIFIED_EVENT_OR_EXPERIENCE");
  if (!m.review.startsWith("synthetic:annual:review:")) reasons.push("MEANING_REVIEW_REQUIRED");
  if (["UNSUPPORTED", "WITHHELD"].includes(m.function)) reasons.push("UNSUPPORTED_INFORMATION_FUNCTION");
  if (m.function === "VERIFIED_COMPARISON" && (facts.length < 2 || new Set(facts.map(f => f.start + f.end)).size < 2)) reasons.push("COMPARISON_REQUIRES_TWO_REGISTERED_WINDOWS");
  const intersection = intersectEvidencePeriods([segment, ...facts].map(f => ({ scope: "month", start: f.start, endExclusive: f.end, certainty: "confirmed", originalBounds: {}, compatibleCombination: true })));
  // Comparison operands have different windows by definition. Each must be
  // registered, while an application requires coverage of its entire segment.
  if (m.function !== "VERIFIED_COMPARISON" && (intersection.state !== "CONFIRMED_INTERSECTION" || facts.some(f => Date.parse(f.start) > Date.parse(segment.start) || Date.parse(f.end) < Date.parse(segment.end)))) reasons.push("EXACT_SEGMENT_WINDOW_REQUIRED");
  return [...new Set(reasons)].sort();
}
export async function createAnnualSyntheticSession(catalog: KnowledgeBinderCatalog, request: KnowledgeBindingRequest, candidates: readonly KnowledgeCandidate[], questions: readonly SyntheticQuestion[], meanings: ReadonlyMap<string, SyntheticMeaning>, approvals: KnowledgeBindingApprovalProvider, displays: readonly SyntheticDisplay[] = []) {
  if (request.product !== "annual_fortune" || !request.graph.context.fixtureId.startsWith("synthetic:annual:") || request.graph.nodes.some(n => n.producer.file !== SYNTHETIC_FILE || !n.owner.fixtureOwnerId.startsWith("synthetic:annual:") || n.fact.rootId && !n.fact.rootId.startsWith("synthetic:annual:root:")) || catalog.input.records.length !== candidates.length || catalog.input.records.some(r => r.family !== "annual-specialist-synthetic-fixture" || r.locator.file !== SYNTHETIC_FILE || !r.originalId.startsWith("synthetic:annual:"))) throw Error("SYNTHETIC_ANNUAL_ISOLATION_REQUIRED");
  if (hash(catalog.reader.text(SYNTHETIC_FILE)) !== catalog.input.frozen.get(SYNTHETIC_FILE)) throw Error("SYNTHETIC_SOURCE_HASH_MISMATCH");
  const registered = catalog.reader.json(SYNTHETIC_FILE);
  if (!isRecord(registered) || !Array.isArray(registered.questions) || !Array.isArray(registered.facts) || !Array.isArray(registered.displays)) throw Error("SYNTHETIC_REGISTRY_REQUIRED");
  const nativeFacts = registered.facts.filter(isRecord), nativeQuestions = request.graph.context.fixtureId.endsWith("-range") ? registered.rangeQuestions : registered.questions;
  if (!Array.isArray(nativeQuestions) || !Array.isArray(registered.segments)) throw Error("REGISTERED_SYNTHETIC_SEGMENT_LEDGER_REQUIRED");
  const registeredSegments = registered.segments;
  const ledger = registeredSegments.map(id => nativeFacts.find(f => f.id === id));
  if (ledger.some(f => !f)) throw Error("REGISTERED_SYNTHETIC_SEGMENT_MISSING");
  for (let month = 1; month <= 12; month++) { const rows = ledger.filter(f => f?.month === month).sort((a, b) => String(a!.start).localeCompare(String(b!.start), "en")); const start = `2026-${String(month).padStart(2, "0")}-01T00:00:00+09:00`, end = month === 12 ? "2027-01-01T00:00:00+09:00" : `2026-${String(month + 1).padStart(2, "0")}-01T00:00:00+09:00`; if (!rows.length || rows[0]!.start !== start || rows.at(-1)!.end !== end || rows.some((f, i) => Date.parse(String(f!.start)) >= Date.parse(String(f!.end)) || i > 0 && rows[i - 1]!.end !== f!.start)) throw Error("SYNTHETIC_FULL_SEGMENT_COVERAGE_REQUIRED"); }
  if (questions.some(q => !registeredSegments.includes(q.segmentId)) || questions.length !== nativeQuestions.length || questions.some(q => !nativeQuestions.some(n => canonicalJson(n) === canonicalJson(q)))) throw Error("REGISTERED_TWELVE_MONTH_QUESTIONS_REQUIRED");
  for (const d of displays) if (!registered.displays.some(n => canonicalJson(n) === canonicalJson(d))) throw Error("ACTUAL_REGISTERED_DISPLAY_REQUIRED");
  const index = new ActualBindingIndex(request, catalog), options: SyntheticOption[] = [];
  if (index.errors.length) throw Error("SYNTHETIC_GRAPH_INVALID");
  for (const c of candidates) {
    const source = await catalog.reader.locate(c.record.locator), meaning = meanings.get(c.record.originalId);
    if (c.provenance !== "SYNTHETIC_TEST_ONLY" || source.code || !isRecord(source.value) || recordHash(source.value) !== c.record.locator.recordSha256 || !meaning || canonicalJson(source.value.meaning) !== canonicalJson(meaning)) throw Error("REGISTERED_SYNTHETIC_MATERIAL_REQUIRED");
    const sourceValue = source.value;
    const q = questions.find(q => q.id === sourceValue.questionId); if (!q) throw Error("REGISTERED_QUESTION_REQUIRED");
    const receipt = bindKnowledgeCandidate(c, index, catalog, approvals);
    if (receipt.allTwelveGateResults.map(g => g.gate).join("|") !== BINDING_HARD_GATES.join("|")) throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
    const reasons = receipt.allTwelveGateResults.filter(g => !["PASS", "NOT_APPLICABLE"].includes(g.state)).flatMap(g => g.reasons);
    const selected = receipt.selectedActualEvidence.map(id => index.graph.nodes.get(id)!);
    const facts: SyntheticFact[] = [];
    for (const id of meaning.factIds) {
      const node = (meaning.function === "VERIFIED_COMPARISON" ? request.graph.nodes : selected).find(n => n.fact.producerEvidenceId === "synthetic:annual:fact:" + id), declared = nativeFacts.find(f => f.id === id);
      if (!node || !declared || canonicalJson(node.value) !== canonicalJson(declared) || node.producer.version !== "synthetic-annual-v1" || node.owner.fixtureOwnerId !== request.graph.context.owners.person || node.status !== "VERIFIED" || !isRecord(node.value) || canonicalJson(node.temporal) !== canonicalJson({ scope: "month", start: declared.start, endExclusive: declared.end, certainty: "confirmed", originalBounds: { syntheticOnly: true }, compatibleCombination: true }) || !Array.isArray(declared.participants) || !declared.participants.every(p => typeof p === "string" && node.participants.some(a => a.owner === request.graph.context.owners.person && a.position === p && a.value === p))) reasons.push("REGISTERED_PRODUCER_WITNESS_REQUIRED");
      else facts.push(node.value as unknown as SyntheticFact);
    }
    const segmentNode = request.graph.nodes.find(n => n.fact.producerEvidenceId === "synthetic:annual:fact:" + q.segmentId), registeredSegment = nativeFacts.find(f => f.id === q.segmentId);
    if (!segmentNode || !registeredSegment || canonicalJson(segmentNode.value) !== canonicalJson(registeredSegment) || segmentNode.producer.version !== "synthetic-annual-v1" || segmentNode.status !== "VERIFIED" || segmentNode.owner.fixtureOwnerId !== request.graph.context.owners.person) reasons.push("REGISTERED_SEGMENT_REQUIRED");
    else reasons.push(...validateSyntheticMeaning(q, meaning, facts, segmentNode.value as SyntheticFact));
    const primary = selected.filter(n => n.fact.producerEvidenceId === "synthetic:annual:fact:" + meaning.factIds[0]), informationRoots = [...new Set(primary.flatMap(n => n.ancestry.rootIds))];
    if (!informationRoots.length) reasons.push("CANONICAL_INFORMATION_ROOT_REQUIRED");
    if (meaning.function === "VALID_RECALL" && !displays.some(d => d.id === meaning.recallOf && d.actuallyDisplayed && d.owner === request.graph.context.owners.person && d.meaningId === meaning.id && d.claim === meaning.claim && d.context === meaning.condition && canonicalJson([...d.roots].sort()) === canonicalJson([...informationRoots].sort()))) reasons.push("ACTUALLY_DISPLAYED_COMPATIBLE_LEDGER_REQUIRED");
    options.push({ id: c.record.originalId, question: q, meaning, receipt, owner: request.graph.context.owners.person!, informationRoots, supportingAncestryRoots: receipt.canonicalFactRoots, eligible: receipt.customerApproved && !reasons.length, reasons: [...new Set(reasons)].sort() });
  }
  const session: SyntheticSession = Object.freeze({ mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" }); sessions.set(session, { questions: structuredClone([...questions]), options }); return session;
}
export function annualSyntheticOptions(session: SyntheticSession) { const d = sessions.get(session); if (!d) throw Error("AUTHENTIC_ANNUAL_SYNTHETIC_SESSION_REQUIRED"); return structuredClone(d.options); }
export function annualReuseViolations(options: readonly SyntheticOption[]): string[] {
  const reasons: string[] = [];
  for (let i = 0; i < options.length; i++) for (let j = i + 1; j < options.length; j++) {
    const a = options[i], b = options[j], shared = a.informationRoots.some(r => b.informationRoots.includes(r));
    if (a.question.id === b.question.id) reasons.push("ONE_MATERIAL_PER_QUESTION");
    if (b.meaning.function !== "VALID_RECALL" && (a.meaning.id === b.meaning.id || a.meaning.claim === b.meaning.claim)) reasons.push("SAME_MEANING_OR_CLAIM");
    if (shared && a.meaning.function === "NEW_CALCULATED_FACT" && b.meaning.function === "NEW_CALCULATED_FACT") reasons.push("SAME_ROOT_NOT_NEW_CALCULATED_FACT");
    if (shared && ["VERIFIED_NEW_APPLICATION", "CONDITIONAL_COMPARISON"].includes(b.meaning.function) && (a.meaning.application === b.meaning.application || a.meaning.condition === b.meaning.condition)) reasons.push("REUSE_WITHOUT_VERIFIED_NEW_APPLICATION");
  } return [...new Set(reasons)].sort();
}
export function selectAnnualSynthetic(session: SyntheticSession, method: SelectionMethod, limit = 200000): SelectionResult {
  const d = sessions.get(session); if (!d) throw Error("AUTHENTIC_ANNUAL_SYNTHETIC_SESSION_REQUIRED");
  if (!Number.isInteger(limit) || limit < 1) throw Error("POSITIVE_SEARCH_LIMIT_REQUIRED");
  const qs = [...d.questions].sort((a, b) => a.month - b.month || a.id.localeCompare(b.id, "en")), byQuestion = new Map(qs.map(q => [q.id, d.options.filter(o => o.eligible && o.question.id === q.id).sort((a, b) => method === "FIRST_ELIGIBLE" ? a.id.localeCompare(b.id, "en") : Number(b.meaning.direct) - Number(a.meaning.direct) || a.id.localeCompare(b.id, "en"))]));
  const independent = (o: SyntheticOption) => ["NEW_CALCULATED_FACT", "VERIFIED_NEW_APPLICATION", "VERIFIED_COMPARISON"].includes(o.meaning.function), score = (rows: SyntheticOption[]) => [rows.filter(o => o.question.priority === "BOUNDARY").length, rows.length, rows.filter(independent).length, new Set(rows.flatMap(o => o.informationRoots)).size, rows.filter(o => o.meaning.direct).length];
  const compare = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  let selected: SyntheticOption[] = [], visited = 0, complete = true;
  if (method !== "GLOBAL_CONSTRAINT_AWARE") for (const q of qs) { const found = byQuestion.get(q.id)!.find(o => !annualReuseViolations([...selected, o]).length); if (found) selected.push(found); }
  else {
    const walk = (i: number, rows: SyntheticOption[]) => {
      if (!complete || ++visited > limit) { complete = false; return; }
      const remaining = qs.slice(i), best = score(selected), current = score(rows), critical = remaining.filter(q => q.priority === "BOUNDARY" && byQuestion.get(q.id)!.length).length;
      if (current[0] + critical < best[0] || current[0] + critical === best[0] && rows.length + remaining.length < selected.length) return;
      if (i === qs.length) { const c = compare(current, best); if (c > 0 || c === 0 && rows.map(o => o.id).join("|") < selected.map(o => o.id).join("|")) selected = [...rows]; return; }
      for (const o of byQuestion.get(qs[i].id)!) if (!annualReuseViolations([...rows, o]).length) walk(i + 1, [...rows, o]); walk(i + 1, rows);
    }; walk(0, []);
  }
  const roots = selected.flatMap(o => o.informationRoots), meanings = selected.map(o => o.meaning.id);
  return { method, selected: selected.map(o => ({ id: o.id, month: o.question.month, questionId: o.question.id, function: o.meaning.function })), coveredQuestions: selected.length, independentInformation: selected.filter(independent).length, distinctRoots: new Set(roots).size, repeatedRootUses: roots.length - new Set(roots).size, repeatedMeanings: meanings.length - new Set(meanings).size, coveredMonths: new Set(selected.map(o => o.question.month)).size, uncovered: qs.filter(q => !selected.some(o => o.question.id === q.id)).map(q => ({ questionId: q.id, month: q.month, reasons: [...new Set(d.options.filter(o => o.question.id === q.id).flatMap(o => o.eligible ? annualReuseViolations([...selected, o]) : o.reasons).concat(byQuestion.get(q.id)!.length ? ["GLOBAL_RESERVATION_OR_OBJECTIVE"] : ["NO_ELIGIBLE_REGISTERED_MATERIAL"]))].sort() })), periodErrors: 0, ambiguousRolesApproved: selected.filter(o => o.meaning.role === "AMBIGUOUS").length, unsupportedRelationsUsed: selected.filter(o => o.reasons.some(r => /UNSUPPORTED/.test(r))).length, claimsEmitted: 0, search: { visited, complete, status: complete ? "COMPLETE" : "SEARCH_LIMIT_NO_OPTIMALITY_CLAIM" }, violations: annualReuseViolations(selected) };
}
