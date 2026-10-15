import { readFileSync } from "node:fs";
import { generateV4ShadowReport } from "../../../interpretation-v4/runtimeShadow";
import type { V4RuntimeEvidence } from "../../../interpretation-v4/runtimeProjection";
import { normalizeReportInputPayload } from "../../../report-generation/reportInputAdapter";
import { observeActualProfiles } from "../actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "../actual-evidence-graph/engine";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { canonicalJson, hash } from "../sourceReader";
import { observeAnnualLedger } from "./fullSegmentLedger";
import { validateDayunContext, validateJieCalendar } from "./boundaryValidator";
import { validateAnnualRelation, validateNominalStemRelation } from "./relationMatcher";
import { matchAnnualTransit } from "./transitEvidence";
import { compareAnnualSegments } from "./monthComparator";
import { godReferenceAudit } from "./monthlyTenGodMatcher";
type Case = { id: string; payload: unknown; clock: { evaluatedAt: string; policyDate?: string }; expectation: string };
type OldMonth = { caseId: string; month: number; focus: { start: string; end: string }; segmentCount: number; allSegmentOriginalIds: string[]; displayedProofSourceRefs: string[]; exactDisplayedText: unknown; acceptedTransit: unknown[]; heldTransit: unknown[] };
export async function auditAnnualObservations(root: string, foundation: ProductSpecialistFoundation, cached: readonly KnowledgeBindingRequest[] = []) {
  const folder = "docs/validation/v4-annual-fortune-product-knowledge-01/", cases = JSON.parse(readFileSync(root + "/" + folder + "input-cases.json", "utf8")) as Case[], old = JSON.parse(readFileSync(root + "/" + folder + "monthly-information-matrix.json", "utf8")) as OldMonth[];
  const rows = [], rejected = [], forbidden: string[] = []; let reused = 0;
  for (const c of cases) {
    const normalized = normalizeReportInputPayload(c.payload, { now: () => new Date(c.clock.policyDate ?? c.clock.evaluatedAt) });
    const known = normalized.ok ? cached.find(r => canonicalJson(r.graphInput.evidence.input) === canonicalJson(normalized.value) && r.graph.context.evaluatedAt === c.clock.evaluatedAt) : undefined;
    let request = known;
    if (known) reused++;
    if (!request) {
      const g = await generateV4ShadowReport(c.payload, c.clock);
      if (!g.ok) { rejected.push({ id: c.id, originalError: g.error, expected: c.expectation === "failure" }); continue; }
      if (c.expectation === "failure") throw Error("ORIGINAL_ANNUAL_POLICY_REJECTION_LOST");
      if (g.externalCalls?.length) throw Error("OFFLINE_EXTERNAL_CALL");
      const evidence = g.evidencePacket as V4RuntimeEvidence, profiles = observeActualProfiles(evidence).profiles, context = { fixtureId: "fixture-observation-annual-" + c.id, synthetic: true as const, evaluatedAt: evidence.generatedAt, owners: { person: "observation-owner-person" }, catalogVersion: foundation.catalog.evidence.versions.catalog, sourceVersion: foundation.catalog.evidence.versions.source, semanticVersion: foundation.catalog.evidence.versions.semantic }, graphInput = { evidence, profiles, context }, built = buildActualEvidenceGraph(graphInput, foundation.catalog.evidence);
      if (!built.ok) throw Error("ORIGINAL_OBSERVATION_GRAPH_INVALID");
      request = { graph: built.graph, graphInput, product: "annual_fortune", relationship: null, contexts: [], actualUserState: evidence.input.kind !== "compatibility" ? evidence.input.userContext : {} };
    }
    const composition = request.graphInput.evidence.composition, input = request.graphInput.evidence.input;
    if (composition.product !== "annual_fortune" || input.kind !== "annualFortune") throw Error("ANNUAL_OBSERVATION_SCOPE_REQUIRED");
    forbidden.push(input.person.name, input.person.birthDate);
    const e = composition.result.evidence, observation = observeAnnualLedger(request, new ActualBindingIndex(request, foundation.catalog), foundation.questions), relations = observation.segments.flatMap(s => s.raw.relationFacts.map(f => validateAnnualRelation(s, f, e))), transit = observation.segments.flatMap(s => matchAnnualTransit(s, e));
    const monthly = e.months.map(m => {
      const previous = old.find(o => o.caseId === c.id && o.month === m.month), narrative = composition.result.narrative.sections.flatMap(s => s.blocks).filter(b => b.id.startsWith(`month-${m.month}-`));
      if (!previous || !narrative.length) throw Error("ORIGINAL_MONTH_OBSERVATION_REQUIRED");
      const allRelations = m.segments.flatMap(s => s.relationFacts.map(f => f.id));
      const currentText = narrative.map(b => ({ id: b.id, text: b.text, proof: b.proof }));
      return { month: m.month, focus: { start: m.focus.startKst, end: m.focus.endKstExclusive }, segmentCount: m.segments.length, originalFocusPreserved: previous.focus.start === m.focus.startKst && previous.focus.end === m.focus.endKstExclusive, originalSegmentCountPreserved: previous.segmentCount === m.segments.length, originalRelationIdsPreserved: canonicalJson(previous.allSegmentOriginalIds) === canonicalJson(allRelations), existingDisplayedProof: previous.displayedProofSourceRefs, originalObservationHash: hash(canonicalJson(previous)), originalTextHash: hash(canonicalJson(previous.exactDisplayedText)), originalTextPreserved: canonicalJson(previous.exactDisplayedText) === canonicalJson(currentText), currentNarrativeHash: hash(canonicalJson(narrative)), availableEvidenceIsNotDisplayed: true, newSpecialistDisplayRecords: 0 };
    });
    const errors = [...observation.errors, ...observation.segments.flatMap(s => validateDayunContext(e.raw.customerDayun!, s.raw)), ...monthly.filter(m => !m.originalFocusPreserved || !m.originalSegmentCountPreserved || !m.originalRelationIdsPreserved).map(m => "ORIGINAL_MONTH_OBSERVATION_MISMATCH:" + m.month)];
    rows.push({ caseId: c.id, selectedYear: e.selectedYear, policyDate: c.clock.policyDate ?? null, evaluatedAt: c.clock.evaluatedAt, segments: observation.segments.map(s => ({ ...s, nodes: s.nodes.map(n => ({ id: n.id, kind: n.kind, fact: n.fact, producer: n.producer, owner: n.owner, temporal: n.temporal, participants: n.participants, ancestry: n.ancestry, status: n.status, blockers: n.blockers })) })), months: monthly, jie: validateJieCalendar(e.raw.calendarMonths!, e.selectedYear), boundaries: observation.boundaryAudit, godReferences: godReferenceAudit(e), nominalStemRelations: observation.segments.flatMap(s => e.annualStemRelations.map(d => validateNominalStemRelation(s, d))), relations, transit, unsupported: e.monthly.months.flatMap(m => m.segments.flatMap(s => s.unsupported)), comparison: compareAnnualSegments(observation.segments), unknownMbti: !input.person.mbtiType, unknownHour: !e.calculation.pillars.hour, graphHasMbtiSource: request.graph.nodes.some(n => n.kind === "MBTI_SOURCE_NODE"), graphHasNatalHour: request.graph.nodes.some(n => n.kind === "CALCULATED_NATAL_FACT" && n.participants.some(p => p.position === "hour")), errors });
  }
  return { rows, rejected, reusedPreparedInputs: reused, books: rows.length, months: rows.reduce((n, r) => n + r.months.length, 0), forbidden };
}
