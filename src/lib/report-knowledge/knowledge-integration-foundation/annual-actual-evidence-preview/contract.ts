import { actualSemanticDigest as digest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { ComparisonGraph } from "../annual-fortune-specialist-engine/types";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import { adaptAnnualNovemberContext } from "../annual-november-context/adapter";
import { validateNovemberObservation, NOVEMBER_SOURCE_FILES } from "../annual-november-context/contract";
import { hash } from "../sourceReader";
import { isRecord } from "../normalization";
import { realizeCopula, joinReviewedClauses } from "../korean-editorial-engine/typedKoreanSlots";
import { annualPeriodTime } from "../../../interpretation-v4/annualEvidence";

export const FACT_PREVIEW_VERSION = "annual-actual-evidence-korean-preview-v1" as const;
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
type NovemberRun = Extract<Awaited<ReturnType<typeof adaptAnnualNovemberContext>>, { ok: true }>;
type SourceProof = Awaited<ReturnType<TemporalTenGodSourceResolver["proof"]>>;
export type FactSentence = {
  sentenceId: string; fixtureId: string; owner: string; product: "annual_fortune"; selectedYear: number; civilMonth: number;
  originalSegmentPointer: string; actualSegmentWindow: { start: string; endExclusive: string };
  text: string; textHash: string; periodSemantics: "SINGLE_SEGMENT" | "NON_SIMULTANEOUS_COMPARISON"; function: "PERIOD" | "PILLAR" | "TEN_GOD_ROLE" | "BOUNDARY" | "DAYUN" | "RELATION" | "COMPARISON" | "READING_POSITION" | "WITHHOLD";
  informationFunction: "CALCULATED_FACT" | "CALCULATED_COMPARISON" | "CALCULATION_CONDITIONAL" | "REVIEW_WITHHOLD";
  actualProducers: ActualEvidenceNode["producer"][]; producerVersions: string[];
  originalGraphNodeIds: string[]; originalEvidenceIds: string[]; originalFactRoots: string[];
  completeAncestry: { nodeId: string; nodeHash: string; observationPointer: string; evidenceId: string | null; directRootId: string | null; temporal: ActualEvidenceNode["temporal"]; parentIds: string[]; rootIds: string[]; status: ActualEvidenceNode["status"]; certainty: ActualEvidenceNode["certainty"]; producer: ActualEvidenceNode["producer"]; sources: ActualEvidenceNode["sources"]; owner: ActualEvidenceNode["owner"] }[];
  sourceRecordIdentity: SourceProof; sourceVersion: string;
  calculationCertainty: "confirmed" | "conditional"; technicalReviewState: string; meaningReviewState: "MEANING_REVIEW_REQUIRED";
  customerAuthorizationState: "CUSTOMER_PUBLICATION_NOT_AUTHORIZED"; originalResearchApplication: string;
  originalComparison: ComparisonGraph["segmentEdges"][number] | null;
  sourceReviewWitness: { observationHash: string; version: string; state: string; originalWitnessIds: string[]; reasons: string[]; sourceRecord: SourceProof; sourceFiles: { file: string; sha256: string }[]; contextPayloadNodeId: string | null; contextPayloadNodeHash: string | null; contextTimestampSource: null } | null;
  contextObservationTimestamp: null; readerQuestionId: null; bookAllocation: null; meaningIdentity: null; claimIdentity: null;
  newFactRoots: 0; customerApproved: false;
};
export type FactMonth = { month: number; bounds: { start: string; endExclusive: string }; technicalContractState: string;
  technicalCandidateIds: string[]; originalResearchApplication: string; paragraphs: { segmentPointer: string; sentenceIds: string[]; text: string }[] };
export type FactualPreview = { version: typeof FACT_PREVIEW_VERSION; fixtureId: string; product: "annual_fortune"; selectedYear: number;
  requestHash: string; graphHash: string; calculationHash: string; readingInstant: string;
  months: FactMonth[]; sentences: FactSentence[]; distinctOriginalRoots: string[]; repeatedRootReferences: number;
  originalWithheldGraphNodes: { nodeId: string; hash: string; reasons: string[] }[];
  originalWithheldAttemptsHash: string; originalNativeReceiptsHash: string; historicalCandidatesHash: string;
  verifiedMonthContracts: readonly number[]; newFactRoots: 0; customerClaims: 0; customerApprovals: 0; customerReaderBridges: 0;
  customerPlannerAllocations: 0; customerEdition: false; wholeBookCompleted: false; customerReady: false; meaningApproved: false;
  readerQuestionId: null; previewHash: string };
export type FactualPreviewContext = Readonly<{ version: typeof FACT_PREVIEW_VERSION; fixtureId: string; requestHash: string }>;
const sessions = new WeakMap<FactualPreviewContext, { canonical: FactualPreview; services: Services; sourcePins: Record<string, string> }>();
const uniq = <T,>(xs: readonly T[]): T[] => [...new Set(xs)];
const same = (a: unknown, b: unknown) => digest(a) === digest(b);
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("FACT_PREVIEW_OFFLINE_ONLY"); }
function ensure(ok: unknown, code: string): asserts ok { if (!ok) throw Error(code); }
const stamp = (s: string) => s.replace("T", " ").replace("+09:00", " KST");
const pillar = (p: { stem: string; branch: string }) => p.stem + p.branch;
function copula(surface: string, owner: string) {
  const slot = realizeCopula({ kind: "noun_phrase", surface: "표기", owner, pronunciation: { status: "known", reading: "표기", final: "none" } }, "formal");
  ensure(slot.ok, "FACT_GRAMMAR_WITHHELD");
  // Formal 입니다 is invariant. Never claim a pronunciation for a quoted Hanja value.
  return surface + slot.text.slice("표기".length);
}
function join(clauses: string[]) { const r = joinReviewedClauses(clauses); ensure(r.ok, "FACT_CLAUSE_WITHHELD"); return r.text; }
function closure(request: KnowledgeBindingRequest, seeds: ActualEvidenceNode[]) {
  const index = new Map(request.graph.nodes.map(n => [n.id, n])), nodes = new Map<string, ActualEvidenceNode>();
  function visit(n: ActualEvidenceNode) {
    if (nodes.has(n.id)) return;
    ensure(same(index.get(n.id), n) && n.owner.fixtureOwnerId === request.graph.context.owners.person && n.ancestry.complete && !n.ancestry.cycle && !n.ancestry.missingIds.length && n.sources.every(s => s.state === "VERIFIED"), "ORIGINAL_GRAPH_ANCESTRY_REQUIRED");
    nodes.set(n.id, n); for (const id of n.ancestry.parentIds) { const p = index.get(id); ensure(p, "MISSING_ORIGINAL_ANCESTOR"); visit(p); }
  }
  seeds.forEach(visit); return [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id, "en"));
}
/** Facts are bounded templates, never Research meaning, life advice or customer claims. */
function compile(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, baseline: NovemberRun, proofs: SourceProof[]) {
  const packet = request.graphInput.evidence, c = packet.composition;
  ensure(c.product === "annual_fortune" && packet.input.kind !== "compatibility", "ACTUAL_ANNUAL_REQUIRED");
  const native = baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
  ensure(native.version === "annual-fortune-specialist-v1" && !native.observation.errors.length, "ORIGINAL_ANNUAL_OBSERVATION_REQUIRED");
  const juneObservation = baseline.baseline.observation, novemberObservation = baseline.observation;
  ensure(juneObservation && novemberObservation, "AUTHENTIC_SOURCE_REVIEW_OBSERVATIONS_REQUIRED");
  const june = juneObservation, november = novemberObservation, comparisonEdges = native.comparison.segmentEdges;
  const e = c.result.evidence, segments = native.observation.segments, months: FactMonth[] = [], sentences: FactSentence[] = [];
  const candidates = baseline.handoff.historicalAnnualCandidates;
  const known = [1, 2, 3, 4, 5, 7, 8, 9, 10, 12] as const;
  const application = (month: number) => month === 6 ? "ROLE_SOURCE_DECISION_REQUIRED" : month === 11 ? "ACTUAL_CONTEXT_TIMESTAMP_REQUIRED" : "MEANING_REVIEW_REQUIRED";
  for (const originalMonth of native.observation.months) {
    const month = originalMonth.civilMonth;
    const matching = candidates.filter(v => v.originalResearchId === `afpr:month-slot:${String(month).padStart(2, "0")}`);
    const state = matching.length ? "TECHNICAL_MONTH_CONTRACT_VERIFIED" : "ORIGINAL_RESEARCH_APPLICATION_WITHHELD";
    const section: FactMonth = { month, bounds: originalMonth.calendarBounds, technicalContractState: state, technicalCandidateIds: matching.map(v => v.candidateId), originalResearchApplication: application(month), paragraphs: [] };
    for (const [ordinal, s] of segments.filter(s => s.contract.month === month).entries()) {
      const pointer = s.originalPointer, raw = s.raw, ids: string[] = [], proof = proofs[month - 1];
      ensure(same(raw, e.raw.calendarMonths?.[month - 1]?.segments[s.contract.segmentIndex]) && digest(raw) === s.recordHash, "ORIGINAL_SEGMENT_REQUIRED");
      const node = (id: string | null | undefined) => { const n = request.graph.nodes.find(n => n.id === id); ensure(n && (n.id === s.contract.boundaryNodeId && n.kind === "TEMPORAL_BOUNDARY" && n.fact.observationPointer === pointer || s.nodes.some(x => same(x, n))) && n.temporal?.start === raw.startKst && n.temporal.endExclusive === raw.endKstExclusive, "EXACT_SEGMENT_GRAPH_NODE_REQUIRED"); return n; };
      const boundary = node(s.contract.boundaryNodeId), mn = node(s.contract.componentNodeIds.month), an = node(s.contract.componentNodeIds.annual), god = node(s.contract.componentNodeIds.ten_gods), dn = node(s.contract.componentNodeIds.dayun);
      for (const n of [mn, an, god]) ensure(!validateAnnualNodeIdentity(n, s).length && n.certainty === "confirmed" && n.status !== "WITHHELD", "ORIGINAL_CALCULATED_COMPONENT_REQUIRED");
      ensure(same(mn.value, { component: "month", monthPillar: raw.monthPillar }) && same(an.value, { component: "annual", effectiveAnnualPillar: raw.effectiveAnnualPillar }) && same(god.value, { component: "ten_gods", stemTenGod: raw.stemTenGod, branchTenGod: raw.branchTenGod }), "ORIGINAL_COMPONENT_VALUE_REQUIRED");
      function add(fn: FactSentence["function"], text: string, seeds = [boundary], information: FactSentence["informationFunction"] = "CALCULATED_FACT") {
        const ancestors = closure(request, seeds), producers = [...new Map(seeds.map(n => [digest(n.producer), n.producer])).values()];
        const roots = uniq(ancestors.flatMap(n => n.ancestry.rootIds)).sort();
        ensure(roots.every(r => request.graph.nodes.some(n => n.fact.rootId === r)), "NEW_ROOT_FORBIDDEN");
        const review = fn === "WITHHOLD" && month === 6 ? june : fn === "WITHHOLD" && month === 11 ? november : null;
        const sourceReviewWitness = review ? { observationHash: digest(review), version: review.version,
          state: month === 6 ? june.roleSourceResolution : november.contextTimestampProvenance.contextProvenanceState,
          originalWitnessIds: month === 6 ? june.previousGodWitnesses.map(w => w.witnessId) : november.witnesses.map(w => w.witnessId), reasons: review.explicitWithholdReasons,
          sourceRecord: review.originalSourceProof.research, sourceFiles: review.originalSourceProof.files.map(f => ({ file: f.file, sha256: f.actualHash })),
          contextPayloadNodeId: month === 11 ? november.contextTimestampProvenance.originalSourceId : null,
          contextPayloadNodeHash: month === 11 ? november.contextTimestampProvenance.originalSourceHash : null, contextTimestampSource: null } : null;
        const originalComparison = fn === "COMPARISON" ? comparisonEdges.find(e => e.to === pointer) ?? null : null;
        ensure(fn !== "COMPARISON" || originalComparison?.comparisonApproved === false, "ORIGINAL_COMPARISON_WITNESS_REQUIRED");
        const body: Omit<FactSentence, "sentenceId"> = { fixtureId: request.graph.context.fixtureId, owner: s.owner, product: "annual_fortune", selectedYear: e.selectedYear, civilMonth: month,
          originalSegmentPointer: pointer, actualSegmentWindow: { start: raw.startKst, endExclusive: raw.endKstExclusive }, text, textHash: digest(text), periodSemantics: fn === "COMPARISON" ? "NON_SIMULTANEOUS_COMPARISON" : "SINGLE_SEGMENT", function: fn, informationFunction: information,
          actualProducers: producers, producerVersions: uniq(producers.map(p => p.version)), originalGraphNodeIds: seeds.map(n => n.id), originalEvidenceIds: uniq(seeds.flatMap(n => n.fact.producerEvidenceId ? [n.fact.producerEvidenceId] : [])), originalFactRoots: roots,
          completeAncestry: ancestors.map(n => ({ nodeId: n.id, nodeHash: digest(n), observationPointer: n.fact.observationPointer, evidenceId: n.fact.producerEvidenceId, directRootId: n.fact.rootId, temporal: n.temporal, parentIds: n.ancestry.parentIds, rootIds: n.ancestry.rootIds, status: n.status, certainty: n.certainty, producer: n.producer, sources: n.sources, owner: n.owner })),
          sourceRecordIdentity: proof, sourceVersion: proof.sourceVersion, calculationCertainty: seeds.some(n => n.certainty !== "confirmed" || n.status === "WITHHELD") ? "conditional" : "confirmed", technicalReviewState: fn === "WITHHOLD" ? "ORIGINAL_RESEARCH_APPLICATION_WITHHELD" : "CALCULATED_FACT_VERIFIED",
          meaningReviewState: "MEANING_REVIEW_REQUIRED", customerAuthorizationState: "CUSTOMER_PUBLICATION_NOT_AUTHORIZED", originalResearchApplication: application(month),
          originalComparison, sourceReviewWitness, contextObservationTimestamp: null, readerQuestionId: null, bookAllocation: null, meaningIdentity: null, claimIdentity: null, newFactRoots: 0, customerApproved: false };
        const sentence = { ...body, sentenceId: `annual-fact-sentence:v1:${digest(body)}` }; sentences.push(sentence); ids.push(sentence.sentenceId);
      }
      add("PERIOD", `${stamp(raw.startKst)}부터 ${stamp(raw.endKstExclusive)} 전까지의 계산 구간입니다.`);
      add("PILLAR", join([`이 구간의 월주 표기는 ${copula(`‘${pillar(raw.monthPillar)}’`, s.owner)}`, `실효 연주 표기는 ${copula(`‘${pillar(raw.effectiveAnnualPillar)}’`, s.owner)}`]), [mn, an]);
      add("TEN_GOD_ROLE", `일간을 기준으로 월간의 십성 표기는 ${copula(`‘${raw.stemTenGod}’`, s.owner)} 월지 본기의 십성 표기는 ${copula(`‘${raw.branchTenGod}’`, s.owner)} 두 계산 역할을 구분하며 원본 연구의 의미 적용을 뜻하지 않습니다.`, [god]);
      for (const reason of raw.boundaryReason.filter(r => r.startsWith("jie:"))) add("BOUNDARY", `${stamp(raw.startKst)}의 ${reason.slice(4)} 절입부터 이 구간의 월주가 적용됩니다.`, [boundary, mn, an]);
      const dc = raw.activeDayunContext;
      if (dc.status === "active") {
        ensure(dn.status !== "WITHHELD" && dn.certainty === "confirmed" && dc.cycles.length === 1, "CONFIRMED_DAYUN_REQUIRED");
        add("DAYUN", `이 구간에서 확인되는 대운은 ${copula(`‘${dc.cycles[0].ganji}’`, s.owner)}`, [dn]);
      } else if (dc.status === "transition_uncertain") {
        ensure(dc.transitionRange && dn.certainty === "conditional", "CONDITIONAL_DAYUN_RANGE_REQUIRED");
        add("DAYUN", `${stamp(dc.transitionRange.earliestKst)}부터 ${stamp(dc.transitionRange.latestKst)}까지는 교운 시각이 확정되지 않은 범위입니다. 대운 후보 ${dc.cycles.map(c => `‘${c.ganji}’`).join(" 또는 ")} 중 하나가 적용될 수 있으며 두 대운의 동시 활성을 뜻하지 않습니다.`, [boundary, dn], "CALCULATION_CONDITIONAL");
      } else add("DAYUN", "이 구간은 계산상 첫 대운이 시작되기 전이며 활성 대운을 확정하지 않습니다.", [boundary, dn], "CALCULATION_CONDITIONAL");
      const pos = annualPeriodTime(raw.startKst, raw.endKstExclusive, e.clock.currentDate);
      const positionText = pos === "current" ? "현재 활성" : pos === "past" ? "이미 지난" : "아직 시작되지 않은 미래";
      add("READING_POSITION", `독해 기준 시각 ${stamp(e.clock.currentDate)}에서 이 구간은 ${positionText} 구간입니다.${s.contract.focus ? " 원래 대표 Focus로 선택된 구간이지만 현재 활성 여부는 별도로 판정합니다." : ""}`);
      const previous = ordinal ? segments.filter(v => v.contract.month === month)[ordinal - 1] : month > 1 ? segments.filter(v => v.contract.month === month - 1).at(-1) : null;
      if (previous) {
        const prevNode = request.graph.nodes.find(n => n.id === previous.contract.componentNodeIds.month)!;
        const prevAnnual = request.graph.nodes.find(n => n.id === previous.contract.componentNodeIds.annual)!;
        const prevGod = request.graph.nodes.find(n => n.id === previous.contract.componentNodeIds.ten_gods)!, prevDayun = request.graph.nodes.find(n => n.id === previous.contract.componentNodeIds.dayun)!;
        const describeDayun = (v: typeof dc) => v.status === "active" ? `확정 활성 ${v.cycles.map(c => c.ganji).join(" · ")}` : v.status === "transition_uncertain" ? `교운 범위 내 조건부 후보 ${v.cycles.map(c => c.ganji).join(" 또는 ")}` : "첫 대운 시작 전";
        add("COMPARISON", `${stamp(previous.raw.startKst)}부터 ${stamp(previous.raw.endKstExclusive)} 전까지의 앞 구간과 비교하면, 월주 ${pillar(previous.raw.monthPillar)} → ${pillar(raw.monthPillar)}${same(previous.raw.monthPillar, raw.monthPillar) ? "(동일)" : "(변경)"}, 실효 연주 ${pillar(previous.raw.effectiveAnnualPillar)} → ${pillar(raw.effectiveAnnualPillar)}${same(previous.raw.effectiveAnnualPillar, raw.effectiveAnnualPillar) ? "(동일)" : "(변경)"}입니다. 월간 십성은 ${previous.raw.stemTenGod} → ${raw.stemTenGod}, 월지 본기 십성은 ${previous.raw.branchTenGod} → ${raw.branchTenGod}입니다. 대운 상태는 ${describeDayun(previous.raw.activeDayunContext)} → ${describeDayun(dc)}입니다. 서로 다른 기간의 비교이며 동시 발생을 뜻하지 않습니다.`, [prevNode, prevAnnual, prevGod, prevDayun, mn, an, god, dn], "CALCULATED_COMPARISON");
      }
      for (const n of s.nodes.filter(n => n.fact.observationPointer.startsWith(pointer + "/relationFacts/") && n.status !== "WITHHELD" && n.certainty === "confirmed")) {
        ensure(!validateAnnualNodeIdentity(n, s).length && isRecord(n.value) && typeof n.value.source === "string" && typeof n.value.type === "string", "VERIFIED_RELATION_REQUIRED");
        const v = n.value;
        if (v.source !== "month_natal_branch" && v.source !== "month_annual_branch" && v.source !== "month_dayun_branch") continue;
        const labels = n.participants.map(p => `${p.slot === "natal_branch" ? "원국 " : ""}${p.position === "month" ? "월지" : p.position === "annual" ? "실효 연지" : p.position.startsWith("dayun-cycle:") ? "대운 " + p.position : ({ year: "연지", day: "일지", hour: "시지" }[p.position as "year" | "day" | "hour"] ?? p.position + " 지지")} ‘${p.value}’`);
        add("RELATION", `${labels.join(" · ")} 사이에 계산된 관계 표기는 ${copula(`‘${v.type}’`, s.owner)} 관계의 생활 사건·성공·실패 의미는 승인하지 않습니다.`, [n]);
      }
      if (ordinal === 0) {
        if (month === 6) add("WITHHOLD", "6월의 계산값은 확인되지만 원본 previous same god의 역할은 미확정입니다. ROLE_SOURCE_DECISION_REQUIRED로 해석 적용을 보류합니다.", [boundary, god], "REVIEW_WITHHOLD");
        if (month === 11) add("WITHHOLD", "11월의 월주·절입 계산은 확인됩니다. 원래 생활 상태를 관찰한 시각이 없어 ACTUAL_CONTEXT_TIMESTAMP_REQUIRED로 적용을 보류하며 가상 장면을 실제 경험이나 미래 상태로 사용하지 않습니다.", [boundary, mn], "REVIEW_WITHHOLD");
        if (month === 1) add("WITHHOLD", "양력 연도와 이 구간의 실효 연주는 구분합니다. 이전 12월 SOURCE_ONLY Witness를 이 문서의 Graph Fact로 사용하지 않습니다.", [boundary, an], "REVIEW_WITHHOLD");
        if (packet.input.person.birthTimeUnknown) {
          const precision = request.graph.nodes.find(n => n.fact.observationPointer === "/calculations/person/pillars/day/stem" && isRecord(n.value) && n.value.birthTimePrecision === "unknown");
          ensure(precision, "ORIGINAL_UNKNOWN_HOUR_SOURCE_REQUIRED");
          add("WITHHOLD", "출생시간 미상 입력입니다. 확인할 수 없는 시주·교운 시각과 보류된 계산 근거를 확정하지 않습니다.", [boundary, precision], "REVIEW_WITHHOLD");
        }
        if (!matching.length && month !== 6 && month !== 11) add("WITHHOLD", "이 입력에서는 원래 월별 기술 적용 계약이 보류되어 있습니다. 확인된 계산 사실만 표시하며 다른 입력의 통과 결과를 적용하지 않습니다.", [boundary], "REVIEW_WITHHOLD");
      }
      const held = s.nodes.filter(n => n.status === "WITHHELD");
      if (held.length) add("WITHHOLD", `이 구간에서 원래 보류된 계산 근거가 있습니다. 보류 사유: ${uniq(held.flatMap(n => n.blockers.map(b => b.code))).sort().join(" · ")}. 이 근거들을 확정 사실이나 해석으로 사용하지 않습니다.`, [boundary, ...held], "REVIEW_WITHHOLD");
      section.paragraphs.push({ segmentPointer: pointer, sentenceIds: ids, text: ids.map(id => sentences.find(s => s.sentenceId === id)!.text).join(" ") });
    }
    months.push(section);
  }
  ensure(months.length === 12 && months.every((m, i) => m.month === i + 1 && m.paragraphs.length), "TWELVE_ACTUAL_MONTHS_REQUIRED");
  const roots = uniq(sentences.flatMap(s => s.originalFactRoots)).sort();
  const body: Omit<FactualPreview, "previewHash"> = { version: FACT_PREVIEW_VERSION, fixtureId: request.graph.context.fixtureId, product: "annual_fortune", selectedYear: e.selectedYear,
    requestHash: digest(request), graphHash: digest(request.graph), calculationHash: digest(packet.calculations), readingInstant: e.clock.currentDate,
    months, sentences, distinctOriginalRoots: roots, repeatedRootReferences: sentences.reduce((n, s) => n + s.originalFactRoots.length, 0) - roots.length,
    originalWithheldGraphNodes: request.graph.nodes.filter(n => n.status === "WITHHELD").map(n => ({ nodeId: n.id, hash: digest(n), reasons: n.blockers.map(b => b.code) })),
    originalWithheldAttemptsHash: digest(bridge.withheld), originalNativeReceiptsHash: digest(native.receipts), historicalCandidatesHash: digest(candidates), verifiedMonthContracts: known,
    newFactRoots: 0, customerClaims: 0, customerApprovals: 0, customerReaderBridges: 0, customerPlannerAllocations: 0,
    customerEdition: false, wholeBookCompleted: false, customerReady: false, meaningApproved: false, readerQuestionId: null };
  return freeze({ ...body, previewHash: digest(body) });
}
export async function prepareFactualPreview(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    ensure(request.product === "annual_fortune", "ACTUAL_ANNUAL_REQUIRED");
    const before = digest([request, bridge.handoff, bridge.native]);
    const baseline = await adaptAnnualNovemberContext(request, bridge, services);
    ensure(baseline.ok && baseline.context && baseline.observation, "ORIGINAL_MONTH_CONTRACTS_REQUIRED");
    ensure((await validateNovemberObservation(baseline.context, baseline.observation)).ok, "AUTHENTIC_NOVEMBER_REQUIRED");
    const index = new AnnualSpecialistIndex(services.foundation), proofs: SourceProof[] = [], sourcePins: Record<string, string> = {};
    for (let month = 1; month <= 12; month++) {
      const row = index.byOriginalId.get(`afpr:month-slot:${String(month).padStart(2, "0")}`); ensure(row, "ORIGINAL_MONTH_RESEARCH_REQUIRED");
      const proof = await services.resolver.proof(row.candidate.record.locator, row.originalResearchId, row.catalogKey);
      ensure(proof.actualHash === row.candidate.record.locator.recordSha256 && proof.actualHash === proof.expectedHash && proof.role === "ORIGINAL_RECORD", "ORIGINAL_SOURCE_HASH_REQUIRED");
      proofs.push(proof); sourcePins[proof.locator.file] = hash(services.resolver.reader.text(proof.locator.file));
    }
    Object.assign(sourcePins, NOVEMBER_SOURCE_FILES, {"src/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/typedKoreanSlots.ts": "b91fd6d619a3816cc2924f98cd2072927b2eba37250bdb378d510276406a268b", "src/lib/report-knowledge/koreanCopyUtils.ts": "728cc882d1c242c4d593fd78cf4deeef4a9454d07c8421ae2cd46691a87c6ed0"});
    const canonical = compile(request, bridge, baseline, proofs);
    ensure(before === digest([request, bridge.handoff, bridge.native]), "ORIGINAL_INPUT_MUTATED");
    const context = freeze({ version: FACT_PREVIEW_VERSION, fixtureId: request.graph.context.fixtureId, requestHash: digest(request) });
    sessions.set(context, { canonical, services, sourcePins });
    return { ok: true as const, context, baseline, preview: structuredClone(canonical) };
  } catch (e) { return { ok: false as const, reasons: [e instanceof Error ? e.message : "FACT_PREVIEW_WITHHELD"], customerUseAllowed: false as const }; }
}
export function generateFactualPreview(context: FactualPreviewContext) {
  offline(); const session = sessions.get(context); ensure(session && Object.isFrozen(context), "AUTHENTIC_FACT_PREVIEW_CONTEXT_REQUIRED");
  for (const [file, pin] of Object.entries(session.sourcePins)) ensure(hash(session.services.resolver.reader.text(file)) === pin, "SOURCE_HASH_MISMATCH");
  return structuredClone(session.canonical);
}
export function validateFactualPreview(context: FactualPreviewContext, proposed: FactualPreview, usage: "OFFLINE_FACT_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "OFFLINE_FACT_REVIEW") {
  try { ensure(usage === "OFFLINE_FACT_REVIEW", "CUSTOMER_PUBLICATION_NOT_AUTHORIZED"); ensure(same(generateFactualPreview(context), proposed), "SOURCE_FACT_PERIOD_TEXT_OR_AUTHORITY_CHANGED"); return { ok: true, customerUseAllowed: false as const }; }
  catch (e) { return { ok: false, reasons: [e instanceof Error ? e.message : "FACT_PREVIEW_WITHHELD"], customerUseAllowed: false as const }; }
}
