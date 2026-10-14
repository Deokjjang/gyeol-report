import { evidenceHash } from "../actual-evidence-graph/graph";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { MajorSpecialistIndex } from "./candidateIndex";
import { MajorPeriodQuestionIndex } from "./periodQuestionRegistry";
import { observeMajorPeriods } from "./temporalEvidence";
import { compareMajorYears } from "./yearComparator";
import { majorResearchYearMatch } from "./diagnostics";
import { majorMeaningConflicts } from "./conflictGraph";
import { VERSION, type MajorResult } from "./types";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { matchMajorTenGod } from "./tenGodMatcher";
import { observeMajorInput } from "./inputProbes";
export class MajorFortuneSpecialistEngine {
  readonly index: MajorSpecialistIndex;
  constructor(readonly foundation: ProductSpecialistFoundation) { this.index = new MajorSpecialistIndex(foundation); }
  observeInput(payload: unknown, evaluatedAt: string) { return observeMajorInput(payload, evaluatedAt); }
  diagnose(request: KnowledgeBindingRequest, prepared?: SpecialistFoundationResult): MajorResult {
    const input = request.graphInput.evidence.input, composition = request.graphInput.evidence.composition;
    if (request.product !== "major_fortune" || request.relationship !== null || input.kind !== "majorFortune" || composition.product !== "major_fortune") throw Error("MAJOR_SINGLE_PERSON_SCOPE_REQUIRED");
    const before = evidenceHash([request.graph, request.graphInput.evidence]);
    const base = prepared ?? this.foundation.run(request), actual = new ActualBindingIndex(request, this.foundation.catalog);
    const observation = observeMajorPeriods(composition.result.evidence, input.person, request, actual), questions = new MajorPeriodQuestionIndex(this.index, observation.baseYear);
    const receipts = [...this.index.candidates.values()].map(c => bindKnowledgeCandidate(c.bindingCandidate, actual, this.foundation.catalog));
    const diagnostics = [...this.index.candidates.values()].map((c, i) => ({ catalogKey: c.catalogKey, originalResearchId: c.originalResearchId, receipt: receipts[i], matches: observation.years.map(y => majorResearchYearMatch(c, y, observation, receipts[i], this.foundation.catalog, request.graph.context.fixtureId)), tenGodChecks: typeof c.original.god === "string" ? observation.cycles.filter(c => observation.years.some(y => y.cycle?.cycleIndex === c.cycleIndex)).map(cycle => matchMajorTenGod(c, cycle, composition.result.evidence, actual)) : [], originalConditions: c.sourceRoles, meaningIdentity: null, meaningReviewRequired: true as const, customerEligible: false as const, customerRank: null }));
    const coverage = questions.questions.map(q => { const links = questions.links.filter(l => l.questionId === q.id), matches = diagnostics.filter(d => links.some(l => l.catalogKey === d.catalogKey)).flatMap(d => d.matches.filter(m => m.year === q.calendarYear)); return { questionId: q.id, year: q.calendarYear, linkedMaterials: links.length, observedMaterials: matches.filter(m => m.observed).length, customerEligible: 0 as const, missing: ["ORIGINAL_QUESTION_REFERENCE_ONLY", "APPROVAL_PENDING", "MEANING_REVIEW_REQUIRED", ...(q.questionKey === "previous" && q.relativeYearOffset === -3 || q.questionKey === "next" && q.relativeYearOffset === 10 ? ["ADJACENT_YEAR_PACKET_OUTSIDE_HORIZON"] : [])] }; });
    const { contentDigest, ...body } = request.graphInput.evidence;
    const errors = [...base.errors, ...actual.errors, ...(contentDigest !== v4Digest(body) ? ["ORIGINAL_PRODUCER_PACKET_SEAL_INVALID"] : []), ...(!observation.originalSelectionMatches ? ["ORIGINAL_DAYUN_SELECTION_OR_CYCLE_MISMATCH"] : []), ...(before !== evidenceHash([request.graph, request.graphInput.evidence]) ? ["ORIGINAL_GRAPH_OR_PACKET_MUTATED"] : []), ...(receipts.some(r => r.customerApproved || r.operatorApproved) ? ["REAL_RESEARCH_APPROVAL_MUST_REMAIN_ZERO"] : [])];
    return { version: VERSION, mode: "REAL_RESEARCH_DIAGNOSTICS", fixtureId: request.graph.context.fixtureId, observation, diagnostics, baselineReceipts: base.after, receipts, questions: questions.questions, links: questions.links, coverage, comparison: compareMajorYears(observation.years), conflicts: majorMeaningConflicts(diagnostics), actualCustomerEligible: 0, actualClaimsEmitted: 0, customerSelectionRun: false, errors };
  }
}
