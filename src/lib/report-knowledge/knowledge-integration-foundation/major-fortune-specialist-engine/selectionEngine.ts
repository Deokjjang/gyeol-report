import { canonicalJson, hash, recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BINDING_HARD_GATES } from "../types";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import { majorReuseViolations } from "./reuseConstraints";
import type { SyntheticMajorSession, SyntheticMajorQuestion, SyntheticMajorMeaning, SyntheticMajorOption, MajorSelectionResult, SelectionMethod } from "./types";
export const SYNTHETIC_FILE = "tests/fixtures/major-fortune-specialist-engine-01/synthetic-knowledge.json";
type Display = { id: string; meaningId: string; claimId: string; roots: string[]; owner: string; actuallyDisplayed: true };
type Data = { questions: SyntheticMajorQuestion[]; options: SyntheticMajorOption[] };
const sessions = new WeakMap<SyntheticMajorSession, Data>();
export function temporalOptionReasons(q: SyntheticMajorQuestion, m: SyntheticMajorMeaning, observation: { scope: string; cycle: number; year: number | null; comparedYears: number[]; participants: string[] }, actualFacts: readonly string[] = []) {
  const reasons: string[] = [];
  if (m.scope === "natal_dayun_saeun") reasons.push("UNSUPPORTED_COMPOSITE");
  if (q.scope !== m.scope || observation.scope !== m.scope) reasons.push("WRONG_RELATION_SCOPE");
  if (q.cycle !== m.cycle || observation.cycle !== m.cycle) reasons.push("WRONG_CYCLE");
  if (m.year !== null && (m.year !== q.year || observation.year !== q.year)) reasons.push("WRONG_ANNUAL_YEAR");
  if (m.questionKey !== q.questionKey) reasons.push("QUESTION_INFORMATION_FUNCTION_MISMATCH");
  if (!q.requiredMeanings.every(k => k === m.questionKey)) reasons.push("QUESTION_REQUIRED_MEANING_MISSING");
  if (!m.temporalWindow.start || !m.temporalWindow.endExclusive) reasons.push("UNKNOWN_INTERVAL");
  else if (q.instant && (!Number.isFinite(Date.parse(q.instant)) || Date.parse(q.instant) < Date.parse(m.temporalWindow.start) || Date.parse(q.instant) >= Date.parse(m.temporalWindow.endExclusive))) reasons.push("NO_TEMPORAL_OVERLAP");
  if (!m.requiredParticipants.every(p => observation.participants.includes(p))) reasons.push("MISSING_PARTICIPANT");
  if (m.function === "VERIFIED_COMPARISON" && (new Set(m.observedYears).size < 2 || !m.observedYears.every(y => observation.comparedYears.includes(y)))) reasons.push("COMPARISON_REQUIRES_TWO_PERIODS");
  if (m.factsRequired.some(f => !actualFacts.includes(f))) reasons.push("UNVERIFIED_LIFE_STATE");
  if (m.prohibitedEvent) reasons.push("UNSUPPORTED_EVENT_OR_PHASE_VERDICT");
  if (["WITHHELD", "UNSUPPORTED"].includes(m.function)) reasons.push("UNSUPPORTED_INFORMATION_FUNCTION");
  if (m.beforeAfter && m.transition) {
    const t = q.instant ? Date.parse(q.instant) : NaN, start = Date.parse(m.transition.earliest), end = Date.parse(m.transition.latest);
    if (!Number.isFinite(t) || t >= start && t < end) reasons.push("ACTIVE_CYCLE_UNCERTAIN");
    else if (m.beforeAfter === "before" ? t >= start : t < end) reasons.push("PRE_POST_TRANSITION_CONFLICT");
  }
  if (!m.reviewId.startsWith("synthetic:major:review:")) reasons.push("MEANING_REVIEW_REQUIRED");
  return reasons;
}
export async function createMajorSyntheticSession(catalog: KnowledgeBinderCatalog, request: KnowledgeBindingRequest, candidates: readonly KnowledgeCandidate[], questions: readonly SyntheticMajorQuestion[], meanings: ReadonlyMap<string, SyntheticMajorMeaning>, approvals: KnowledgeBindingApprovalProvider, display: readonly Display[] = []) {
  if (!request.graph.context.fixtureId.startsWith("synthetic:major:") || request.product !== "major_fortune" || request.graph.nodes.some(n => n.producer.file !== SYNTHETIC_FILE || !n.owner.fixtureOwnerId.startsWith("synthetic:major:") || n.fact.rootId && !n.fact.rootId.startsWith("synthetic:major:root:")) || catalog.input.records.length !== candidates.length || catalog.input.records.some(r => r.family !== "major-specialist-synthetic-fixture" || r.locator.file !== SYNTHETIC_FILE || !r.originalId.startsWith("synthetic:major:"))) throw Error("SYNTHETIC_MAJOR_ISOLATION_REQUIRED");
  if (hash(catalog.reader.text(SYNTHETIC_FILE)) !== catalog.input.frozen.get(SYNTHETIC_FILE)) throw Error("SYNTHETIC_SOURCE_HASH_MISMATCH");
  const declared = catalog.reader.json(SYNTHETIC_FILE);
  if (!isRecord(declared) || !Array.isArray(declared.questions) || !Array.isArray(declared.facts)) throw Error("SYNTHETIC_REGISTRY_REQUIRED");
  const declaredFacts = declared.facts.filter(isRecord);
  const declaredQuestions = request.graph.context.fixtureId === "synthetic:major:selection-range" ? declared.rangeQuestions : declared.questions;
  if (!Array.isArray(declaredQuestions)) throw Error("SYNTHETIC_QUESTION_REGISTRY_REQUIRED");
  for (const q of questions) if (!declaredQuestions.some(v => canonicalJson(v) === canonicalJson(q))) throw Error("SYNTHETIC_QUESTION_NOT_REGISTERED");
  for (const d of display) if (!Array.isArray(declared.displays) || !declared.displays.some(v => canonicalJson(v) === canonicalJson(d))) throw Error("SYNTHETIC_DISPLAY_NOT_REGISTERED");
  const index = new ActualBindingIndex(request, catalog);
  if (index.errors.length) throw Error("SYNTHETIC_GRAPH_INVALID:" + index.errors.join("|"));
  const options: SyntheticMajorOption[] = [];
  for (const c of candidates) {
    const source = await catalog.reader.locate(c.record.locator), m = meanings.get(c.record.originalId);
    if (c.provenance !== "SYNTHETIC_TEST_ONLY" || source.code || recordHash(source.value) !== c.record.locator.recordSha256 || !isRecord(source.value) || canonicalJson(source.value.meaning) !== canonicalJson(m) || !m) throw Error("SYNTHETIC_MATERIAL_NOT_REGISTERED");
    const rawSource = source.value;
    const receipt = bindKnowledgeCandidate(c, index, catalog, approvals);
    if (receipt.allTwelveGateResults.map(g => g.gate).join("|") !== BINDING_HARD_GATES.join("|")) throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
    for (const q of questions.filter(q => q.id === rawSource.questionId)) {
      const primary = receipt.matches.find(m => m.requirementId === c.record.originalId + ":actual-period");
      const nodes = (primary?.matchedActualEvidence ?? []).map(m => index.graph.nodes.get(m.nodeId)!).filter(Boolean), raw = nodes.length === 1 && isRecord(nodes[0].value) ? nodes[0].value : null;
      const fact = declaredFacts.find(f => f.id === rawSource.fact);
      const reasons = receipt.allTwelveGateResults.filter(g => !["PASS", "NOT_APPLICABLE"].includes(g.state)).flatMap(g => g.reasons);
      if (!raw || !fact || canonicalJson(raw) !== canonicalJson(fact)) reasons.push("SYNTHETIC_PRODUCER_OBSERVATION_NOT_REGISTERED");
      if (nodes.length !== 1 || canonicalJson(nodes[0].temporal) !== canonicalJson(m.temporalWindow)) reasons.push("REGISTERED_TEMPORAL_WINDOW_MISMATCH");
      if (!m.requiredParticipants.every(p => nodes.some(n => n.participants.some(a => a.owner === request.graph.context.owners.person && a.position === p.split(":")[0] && a.slot === p.split(":")[1] && a.value === "synthetic:" + p + ":" + rawSource.fact)))) reasons.push("MISSING_PARTICIPANT");
      const comparisonWitnesses = m.function === "VERIFIED_COMPARISON" ? m.observedYears.flatMap(year => [...index.graph.nodes.values()].filter(n => n.kind === "CALCULATED_PERIOD_FACT" && n.owner.fixtureOwnerId === request.graph.context.owners.person && n.status === "VERIFIED" && n.producer.symbol === "declaredSyntheticPeriod" && n.producer.version === "synthetic-major-v1" && isRecord(n.value) && n.value.year === year && declaredFacts.some(f => f.year === year && typeof f.id === "string" && n.fact.producerEvidenceId === "synthetic:major:fact:" + f.id && canonicalJson(f) === canonicalJson(n.value) && canonicalJson(n.temporal) === canonicalJson({ scope: f.scope, start: f.start, endExclusive: f.end, certainty: "confirmed", originalBounds: { syntheticOnly: true }, compatibleCombination: true }) && Array.isArray(f.participants) && f.participants.every(p => typeof p === "string" && n.participants.some(a => a.owner === request.graph.context.owners.person && a.position === p.split(":")[0] && a.slot === p.split(":")[1] && a.value === "synthetic:" + p + ":" + f.id)))).map(n => n.id)) : [];
      if (m.function === "VERIFIED_COMPARISON" && comparisonWitnesses.length !== new Set(m.observedYears).size) reasons.push("COMPARISON_REQUIRES_TWO_PERIODS");
      if (m.requiresCycle) {
        const cycleNodes = receipt.selectedActualEvidence.map(id => index.graph.nodes.get(id)!).filter(n => n.temporal?.scope === "dayun" && isRecord(n.value) && n.value.cycle === m.cycle);
        const cycle = cycleNodes.length === 1 && isRecord(cycleNodes[0].value) ? cycleNodes[0].value : null;
        if (!cycle || typeof cycle.start !== "string" || typeof cycle.end !== "string") reasons.push("TARGET_CYCLE_UNAVAILABLE");
        else {
          const bounds = isRecord(cycle.startRange) ? cycle.startRange : { earliest: cycle.start, latest: cycle.start };
          const t = q.instant ? Date.parse(q.instant) : NaN;
          if (typeof bounds.earliest !== "string" || typeof bounds.latest !== "string" || !Number.isFinite(t)) reasons.push("UNKNOWN_INTERVAL");
          else if (t >= Date.parse(bounds.earliest) && t < Date.parse(bounds.latest)) reasons.push("ACTIVE_CYCLE_UNCERTAIN");
          else if (t < Date.parse(bounds.latest) || t >= Date.parse(cycle.end)) reasons.push("WRONG_CYCLE", "NO_TEMPORAL_OVERLAP");
          if (m.transition && canonicalJson(m.transition) !== canonicalJson(bounds)) reasons.push("WRONG_TRANSITION_BOUNDARY");
        }
      }
      if (raw && typeof raw.scope === "string" && typeof raw.cycle === "number" && Array.isArray(raw.comparedYears) && Array.isArray(raw.participants)) reasons.push(...temporalOptionReasons(q, m, { scope: raw.scope, cycle: raw.cycle, year: typeof raw.year === "number" ? raw.year : null, comparedYears: raw.comparedYears as number[], participants: raw.participants as string[] }));
      else reasons.push("ACTUAL_TEMPORAL_OBSERVATION_MISSING");
      if (!receipt.canonicalFactRoots.length) reasons.push("ACTUAL_ROOT_REQUIRED");
      if (m.function === "RECALL" && !display.some(d => d.actuallyDisplayed && d.id === m.recallOf && d.owner === request.graph.context.owners.person && d.meaningId === m.meaningId && d.claimId === m.claimId && canonicalJson([...d.roots].sort()) === canonicalJson([...receipt.canonicalFactRoots].sort()))) reasons.push("ACTUALLY_DISPLAYED_COMPATIBLE_LEDGER_REQUIRED");
      options.push({ id: c.record.originalId, questionId: q.id, year: q.year, roots: receipt.canonicalFactRoots, informationRoots: [...new Set((primary?.matchedActualEvidence ?? []).flatMap(m => m.rootIds))], owner: request.graph.context.owners.person!, meaning: structuredClone(m), receipt, comparisonWitnesses, eligible: receipt.customerApproved && !reasons.length, reasons: [...new Set(reasons)].sort() });
    }
  }
  const session: SyntheticMajorSession = Object.freeze({ mode: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" });
  sessions.set(session, { questions: structuredClone([...questions]), options });
  return session;
}
export function majorSyntheticOptions(session: SyntheticMajorSession) { const d = sessions.get(session); if (!d) throw Error("AUTHENTIC_SYNTHETIC_MAJOR_SESSION_REQUIRED"); return structuredClone(d.options); }
const preference = (a: SyntheticMajorOption, b: SyntheticMajorOption) => Number(b.meaning.direct) - Number(a.meaning.direct) || a.id.localeCompare(b.id, "en");
const independent = (o: SyntheticMajorOption) => ["NEW_CALCULATED_FACT", "VERIFIED_NEW_APPLICATION", "VERIFIED_COMPARISON"].includes(o.meaning.function);
export function selectMajorSynthetic(session: SyntheticMajorSession, method: SelectionMethod, limit = 200000): MajorSelectionResult {
  const data = sessions.get(session); if (!data) throw Error("AUTHENTIC_SYNTHETIC_MAJOR_SESSION_REQUIRED");
  if (!Number.isInteger(limit) || limit < 1) throw Error("EXPLICIT_POSITIVE_SEARCH_LIMIT_REQUIRED");
  const qs = [...data.questions].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id, "en")), byQ = new Map(qs.map(q => [q.id, data.options.filter(o => o.eligible && o.questionId === q.id).sort(method === "FIRST_ELIGIBLE" ? (a, b) => a.id.localeCompare(b.id, "en") : preference)]));
  const active = qs.filter(q => byQ.get(q.id)!.length), critical = new Set(qs.filter(q => ["TRANSITION", "COMPARISON"].includes(q.priority)).map(q => q.id));
  const objective = (rows: readonly SyntheticMajorOption[]) => [rows.filter(o => critical.has(o.questionId)).length, rows.length, rows.filter(independent).length, new Set(rows.flatMap(o => o.roots)).size, rows.filter(o => o.meaning.direct).length];
  const compare = (a: number[], b: number[]) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  let selected: SyntheticMajorOption[] = [], visited = 0, complete = true;
  if (method !== "GLOBAL_CONSTRAINT_AWARE") {
    for (const q of active) { const o = byQ.get(q.id)!.find(o => !majorReuseViolations([...selected, o]).length); if (o) selected.push(o); }
  } else {
    const visit = (i: number, rows: SyntheticMajorOption[]) => {
      if (!complete || ++visited > limit) { complete = false; return; }
      const score = objective(rows), best = objective(selected), remaining = active.slice(i);
      if (score[0] + remaining.filter(q => critical.has(q.id)).length < best[0] || score[0] + remaining.filter(q => critical.has(q.id)).length === best[0] && rows.length + remaining.length < selected.length) return;
      if (i === active.length) { const order = compare(score, best); if (order > 0 || order === 0 && rows.map(o => o.id).join("|") < selected.map(o => o.id).join("|")) selected = [...rows]; return; }
      for (const o of byQ.get(active[i].id)!) if (!majorReuseViolations([...rows, o]).length) visit(i + 1, [...rows, o]);
      visit(i + 1, rows);
    };
    visit(0, []);
  }
  const roots = new Set(selected.flatMap(o => o.roots)), violations = majorReuseViolations(selected);
  const uncoveredQuestions = qs.filter(q => !selected.some(o => o.questionId === q.id)).map(q => { const options = data.options.filter(o => o.questionId === q.id), reasons = options.flatMap(o => o.eligible ? majorReuseViolations([...selected, o]) : o.reasons); return { questionId: q.id, year: q.year, reasons: [...new Set([...reasons, ...(!options.length ? ["NO_REGISTERED_MATERIAL_FOR_QUESTION"] : !reasons.length ? ["GLOBAL_RESERVATION_OR_OBJECTIVE"] : []), ...(!complete ? ["SEARCH_LIMIT_NO_OPTIMALITY_CLAIM"] : [])])].sort() }; });
  return { method, selected: selected.map(o => ({ candidateId: o.id, questionId: o.questionId, year: o.year, function: o.meaning.function })), uncoveredQuestions, coveredQuestions: selected.length, independentInformation: selected.filter(independent).length, distinctRoots: roots.size, repeatedRootUses: selected.flatMap(o => o.roots).length - roots.size, transitionComparisons: selected.filter(o => critical.has(o.questionId)).length, continuityReferences: selected.filter(o => o.meaning.function === "CONTINUITY").length, unsupportedRelationsUsed: selected.filter(o => o.reasons.includes("UNSUPPORTED_COMPOSITE")).length, wrongYearAssignments: selected.filter(o => o.meaning.year !== null && o.meaning.year !== o.year).length, claimsEmitted: 0, search: { visited, complete, status: complete ? "COMPLETE" : "SEARCH_LIMIT_NO_OPTIMALITY_CLAIM" }, violations, notSelected: data.options.filter(o => !selected.includes(o)).map(o => ({ id: o.id, reasons: o.eligible ? majorReuseViolations([...selected, o]).length ? majorReuseViolations([...selected, o]) : ["GLOBAL_RESERVATION_OR_DETERMINISTIC_PREFERENCE"] : o.reasons })) };
}
