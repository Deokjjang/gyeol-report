import { actualSemanticDigest as digest } from "../actual-calculation-semantic-bridge/units";
import { hash } from "../sourceReader";
import { isRecord } from "../normalization";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { COMPARISON_CONTRACTS, validateComparisonCandidate, type ComparisonMonth, type ComparisonCandidate } from "../annual-temporal-comparison/contract";
import { prepareFactualPreview, generateFactualPreview, type FactSentence } from "../annual-actual-evidence-preview/contract";
import { readOriginal, validateReading } from "../semantic-domain-review-workbench/sourceReaderAdapter";
import { meaningDecomposition } from "../semantic-domain-review-workbench/applicability";
import type { ReadingProposal } from "../semantic-domain-review-workbench/types";
import { realizePredicate, joinReviewedClauses } from "../korean-editorial-engine/typedKoreanSlots";

export const REVIEW_VERSION = "annual-march-september-interpretation-review-v1" as const;
type OriginalGraphNode = KnowledgeBindingRequest["graph"]["nodes"][number];
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
type FactualRun = Extract<Awaited<ReturnType<typeof prepareFactualPreview>>, { ok: true }>;
type SourceProof = FactSentence["sourceRecordIdentity"];
export type ReviewClassification = "CALCULATED_FACT_EXPLANATION" | "CONDITIONAL_INTERPRETATION_PROPOSAL" | "WITHHELD_UNSUPPORTED_INFERENCE";
export type ReviewSentence = {
  draftSentenceId: string; fixtureId: string; owner: string; product: "annual_fortune"; month: ComparisonMonth;
  originalResearchId: string; originalRecordHash: string; originalSourceVersion: string; originalResearchFields: string[];
  sourceProof: SourceProof; originalFactualSourceProof: SourceProof | null; originalFactualSentenceId: string | null;
  actualEvidenceNodeIds: string[]; originalProducers: FactSentence["actualProducers"]; originalFactRoots: string[];
  completeAncestry: FactSentence["completeAncestry"]; exactTemporalWindows: { nodeId: string; temporal: FactSentence["completeAncestry"][number]["temporal"] }[];
  originalComparisonWitnessIds: string[]; periodSemantics: FactSentence["periodSemantics"];
  sentenceText: string | null; sentenceTextHash: string | null; attemptedInference: string | null;
  sentenceFunction: string; classification: ReviewClassification; requiredContext: string[]; counterexamples: string[];
  prohibitedInferences: string[]; withholdReasons: string[];
  sourceSupportLimitations: string[];
  directSourceSupport: { originalResearch: "RESEARCH_ORIGINAL_SOURCE_VERIFIED"; actualCalculation: "CALCULATED_FACT_VERIFIED" | "CALCULATED_COMPARISON_CONTEXT_ONLY"; exactMeaning: "DIRECT_MEANING_SOURCE_UNVERIFIED"; traditionalOrEmpiricalEffectProven: false };
  meaningReviewState: "MEANING_REVIEW_REQUIRED"; productReviewState: "PRODUCT_REVIEW_REQUIRED"; customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING";
  modelReviewState: "MODEL_PROPOSED_REVIEW" | null; reviewer: null; officialApprovalEnvelope: null; meaningIdentity: null; claimIdentity: null;
  plannerAssignment: null; readerQuestionId: null; bookAllocation: null; customerApproved: false; newFactRoots: 0;
};
export type ReviewCase = {
  month: ComparisonMonth; originalResearchId: string; technicalState: "TECHNICALLY_ELIGIBLE_FOR_REVIEW" | "TECHNICALLY_WITHHELD";
  originalCandidateId: string | null; originalCandidateHash: string | null; originalNativeReceiptId: string; originalNativeReceiptHash: string;
  typedNativeReceiptRefs: { segmentPointer: string; receiptId: string; receiptHash: string }[];
  comparisonEvidenceNodes: FactSentence["completeAncestry"]; originalAncestryStates: { nodeId: string; ancestry: OriginalGraphNode["ancestry"] }[]; missingOriginalAncestorIds: string[]; originalGraphWithholds: { nodeId: string; blockers: OriginalGraphNode["blockers"] }[];
  originalBlockingReasons: unknown[]; comparisonWitnesses: ComparisonCandidate["comparisonWitnesses"]; comparisonWitnessHash: string;
  requiredContext: string[]; paragraphs: { function: string; sentenceIds: string[]; text: string }[];
  sentences: ReviewSentence[]; workbenchDecomposition: ReturnType<typeof meaningDecomposition> | null;
};
export type ReviewDraft = {
  version: typeof REVIEW_VERSION; fixtureId: string; selectedYear: number; requestHash: string; graphHash: string; calculationHash: string;
  originalFactualPreviewHash: string; research: { month: ComparisonMonth; original: Record<string, unknown>; proof: SourceProof; sourceReferences: { original: unknown; proof: SourceProof }[] }[];
  cases: ReviewCase[]; customerClaims: 0; customerApprovals: 0; customerReaderBridges: 0; customerBookAllocations: 0;
  newFactRoots: 0; independentMeaningsAdded: 0; humanReviewCompleted: false; meaningApproved: false; productApproved: false;
  customerApproved: false; customerEdition: false; wholeBookCompleted: false; customerReady: false; draftHash: string;
};
export type ReviewContext = Readonly<{ version: typeof REVIEW_VERSION; fixtureId: string; requestHash: string }>;
const sessions = new WeakMap<ReviewContext, { draft: ReviewDraft; factual: FactualRun; services: Services; sourcePins: Record<string, string> }>();
const same = (a: unknown, b: unknown) => digest(a) === digest(b);
const uniq = <T,>(a: readonly T[]) => [...new Set(a)];
function ensure(v: unknown, code: string): asserts v { if (!v) throw Error(code); }
function offline() { ensure(!process.env.VERCEL && typeof window === "undefined", "INTERPRETATION_REVIEW_OFFLINE_ONLY"); }
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function join(clauses: string[]) { const r = joinReviewedClauses(clauses); ensure(r.ok, "REVIEW_GRAMMAR_WITHHELD"); return r.text; }
function predicate(owner: string, kind: "condition" | "question") {
  const r = realizePredicate({ kind: "predicate", subjectOwner: owner, lemma: kind === "condition" ? "있다" : "확인하다", reviewedSurface: kind === "condition" ? "있다면" : "확인해 볼까요?", honorificTarget: null, tense: kind === "condition" ? "present_conditional" : "timeless", polarity: "affirmative", mood: kind === "condition" ? "conditional" : "question" });
  ensure(r.ok, "REVIEW_PREDICATE_OUTSIDE_FINITE_GRAMMAR"); return r.text;
}
const researchFile = "src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts";
const researchVersion = "6d471db103d53dd9165e4832744501a686e59edc";
const researchFileHash = "261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3";
// New bounded author questions, not old Research facts, Synthetic definitions or approvals.
function questions(month: ComparisonMonth, owner: string) {
  const condition = predicate(owner, "condition"), question = predicate(owner, "question");
  return month === 3 ? [
    `실제로 유지하고 있는 학습 목표와 비교할 과제가 ${condition}, 같은 목표를 두 과제에 적용할 때 확인할 조건이 같은지 ${question}`,
    `같은 목표를 실제로 점검하려는 상황이 ${condition}, 2월 말과 경칩 뒤의 계산상 차이 가운데 검토 질문을 달리해야 할 항목이 있는지 ${question}`,
  ] : [
    `이미 정한 작업 순서와 실제 점검 기준이 ${condition}, 월초에 이어지는 조건과 백로 뒤 조건을 나누어 같은 작업 순서를 계속 쓸지 ${question}`,
    `다시 검토하려는 실제 계획이 ${condition}, 계산 조건이 이어지는 구간과 달라지는 구간을 구별해 유지할 기준과 다시 확인할 기준이 있는지 ${question}`,
  ];
}
export async function prepareInterpretationReview(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = digest([request, bridge.handoff, bridge.native]), factual = await prepareFactualPreview(request, bridge, services);
    ensure(factual.ok, "AUTHENTIC_FACTUAL_PREVIEW_REQUIRED");
    // November -> June -> January -> August -> February -> April -> original comparison adapter.
    const comparison = factual.baseline.baseline.baseline.baseline.baseline.baseline.baseline;
    ensure(comparison.context && comparison.observations.length === 2, "ACTUAL_MARCH_SEPTEMBER_COMPARISONS_REQUIRED");
    const index = new AnnualSpecialistIndex(services.foundation), cases: ReviewCase[] = [], research: ReviewDraft["research"] = [];
    const sourcePins: Record<string, string> = { [researchFile]: researchFileHash };
    const grammarFile = "src/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/typedKoreanSlots.ts";
    sourcePins[grammarFile] = "b91fd6d619a3816cc2924f98cd2072927b2eba37250bdb378d510276406a268b";
    const graph = new Map(request.graph.nodes.map(n => [n.id, n]));
    for (const month of [3, 9] as const) {
      const pin = COMPARISON_CONTRACTS[month], row = index.byOriginalId.get(pin.originalId);
      ensure(row, "EXACT_RESEARCH_REQUIRED");
      const reading = await readOriginal(row.candidate.record, services.resolver, p => p.file === researchFile && p.sourceVersion === researchVersion && p.recordSha256 === pin.recordSha256);
      validateReading(reading);
      ensure(reading.proof.locator.fileSha256 === researchFileHash && hash(services.resolver.reader.text(researchFile)) === researchFileHash && same(reading.original, row.original), "ORIGINAL_SOURCE_HASH_REQUIRED");
      const raw = reading.original;
      ensure(["meaning", "positive", "risk", "twist", "action", "counterexample"].every(k => typeof raw[k] === "string") && Array.isArray(raw.requires) && Array.isArray(raw.disallowed) && Array.isArray(raw.sourceRefs) && isRecord(raw.scene) && raw.scene.hypothetical === true && raw.scene.isCustomerHistory === false && typeof raw.scene.text === "string", "ORIGINAL_CONDITIONS_AND_SCENE_REQUIRED");
      const originalDisallowed = raw.disallowed.map(String);
      const sourceReferences: ReviewDraft["research"][number]["sourceReferences"] = [];
      for (const id of raw.sourceRefs) {
        const refs = services.resolver.records.filter(r => r.originalId === id && r.locator.file === "src/lib/report-knowledge/annual-fortune-product-research/sourceInventory.ts" && r.locator.exportName === "ANNUAL_RESEARCH_SOURCES");
        ensure(refs.length === 1, "EXACT_DECLARED_SOURCE_REFERENCE_REQUIRED");
        const original = await services.resolver.record(refs[0]), proof = await services.resolver.proof(refs[0].locator, refs[0].originalId, refs[0].catalogKey);
        sourcePins[proof.locator.file] = proof.locator.fileSha256!; sourceReferences.push({ original, proof });
      }
      // Explicitly read action/scene omitted by the legacy Workbench content extractor.
      const meaningReading = { ...reading, contentFields: [...reading.contentFields, { pointer: "/action", text: String(raw.action) }, { pointer: "/scene/text", text: String(raw.scene.text) }] };
      meaningReading.contentHash = digest(meaningReading.contentFields);
      research.push({ month, original: Object.fromEntries(["id", "requires", "meaning", "positive", "risk", "twist", "action", "scene", "counterexample", "disallowed", "sourceRefs", "verification"].map(k => [k, raw[k]])), proof: reading.proof, sourceReferences });
      const observation = comparison.observations.find(o => o.month === month);
      ensure(observation && same(observation.source, reading.proof), "ACTUAL_COMPARISON_SOURCE_REQUIRED");
      const candidate = comparison.handoff.comparisonCandidates.find(c => c.month === month);
      if (candidate) ensure((await validateComparisonCandidate(comparison.context, candidate)).ok, "AUTHENTIC_COMPARISON_CANDIDATE_REQUIRED");
      const witnesses = observation.comparisonWitnesses;
      ensure(!!candidate === witnesses.every(w => w.result !== "WITHHELD"), "COMPARISON_WITHHOLD_MUST_BE_PRESERVED");
      const native = comparison.baseline.baseline.baseline.baseline.native.receipts.find(r => r.originalResearchId === pin.originalId);
      ensure(native, "ORIGINAL_NATIVE_RECEIPT_REQUIRED");
      const requiredContext = month === 3 ? ["실제 학습 목표", "비교할 실제 과제", "기존 점검 기준", "해당 상황의 실제 적용 기간과 관찰 시각"] : ["이미 정한 실제 작업 순서", "현재 점검하려는 실제 계획", "기존 점검 기준", "해당 상황의 실제 적용 기간과 관찰 시각"];
      const sentences: ReviewSentence[] = [], paragraphs: ReviewCase["paragraphs"] = [];
      const comparisonIds = witnesses.map(w => w.comparisonId), allIds = uniq(witnesses.flatMap(w => [...w.beforeGraphEvidence, ...w.afterGraphEvidence]));
      const missingOriginalAncestorIds = new Set<string>();
      function provenance(ids: string[], includeWithheld = false) {
        const nodes = new Map<string, FactSentence["completeAncestry"][number]>();
        function visit(id: string) {
          if (nodes.has(id)) return;
          const n = graph.get(id);
          if (!n) { ensure(includeWithheld, "EXACT_COMPLETE_OWNER_ANCESTRY_REQUIRED"); missingOriginalAncestorIds.add(id); return; }
          ensure(n.owner.fixtureOwnerId === request.graph.context.owners.person, "EXACT_OWNER_REQUIRED");
          ensure(includeWithheld || n.ancestry.complete && !n.ancestry.cycle && !n.ancestry.missingIds.length && n.sources.every(s => s.state === "VERIFIED"), "EXACT_COMPLETE_OWNER_ANCESTRY_REQUIRED");
          if (includeWithheld) n.ancestry.missingIds.forEach(id => missingOriginalAncestorIds.add(id));
          nodes.set(id, { nodeId: n.id, nodeHash: digest(n), observationPointer: n.fact.observationPointer, evidenceId: n.fact.producerEvidenceId, directRootId: n.fact.rootId, temporal: n.temporal, parentIds: n.ancestry.parentIds, rootIds: n.ancestry.rootIds, status: n.status, certainty: n.certainty, producer: n.producer, sources: n.sources, owner: n.owner });
          n.ancestry.parentIds.forEach(visit);
        }
        ids.forEach(visit); return [...nodes.values()].sort((a, b) => a.nodeId.localeCompare(b.nodeId, "en"));
      }
      function add(text: string | null, fn: string, classification: ReviewClassification, fields: string[], fact: FactSentence | null = null, attemptedInference: string | null = null, comparisonWitness: typeof witnesses[number] | null = null) {
        ensure(candidate, "WITHHELD_COMPARISON_CANNOT_GENERATE_DRAFT");
        const calculated = classification === "CALCULATED_FACT_EXPLANATION";
        ensure(!calculated || fact || fn === "VERIFIED_SIGNATURE_RESULT" && comparisonWitness && comparisonWitness.result !== "WITHHELD", "EXACT_CALCULATED_COMPARISON_REQUIRED");
        const ids = fact ? fact.originalGraphNodeIds : comparisonWitness ? uniq([...comparisonWitness.beforeGraphEvidence, ...comparisonWitness.afterGraphEvidence]) : allIds, ancestry = fact ? fact.completeAncestry : provenance(ids);
        const body: Omit<ReviewSentence, "draftSentenceId"> = {
          fixtureId: request.graph.context.fixtureId, owner: request.graph.context.owners.person!, product: "annual_fortune", month,
          originalResearchId: pin.originalId, originalRecordHash: reading.proof.actualHash, originalSourceVersion: reading.proof.sourceVersion, originalResearchFields: fields,
          sourceProof: reading.proof, originalFactualSourceProof: fact?.sourceRecordIdentity ?? null, originalFactualSentenceId: fact?.sentenceId ?? null,
          actualEvidenceNodeIds: ids, originalProducers: uniq(ids.map(id => graph.get(id)!.producer)), originalFactRoots: uniq(ancestry.flatMap(n => n.rootIds)).sort(), completeAncestry: ancestry,
          exactTemporalWindows: ids.map(id => ({ nodeId: id, temporal: graph.get(id)!.temporal })), originalComparisonWitnessIds: comparisonWitness ? [comparisonWitness.comparisonId] : comparisonIds, periodSemantics: fact?.periodSemantics ?? "NON_SIMULTANEOUS_COMPARISON",
          sentenceText: text, sentenceTextHash: text === null ? null : digest(text), attemptedInference, sentenceFunction: fn, classification, requiredContext,
          counterexamples: [String(raw.counterexample)], prohibitedInferences: originalDisallowed, withholdReasons: classification === "WITHHELD_UNSUPPORTED_INFERENCE" ? ["NO_ACTUAL_PERSONAL_EVENT_EVIDENCE", "RESEARCH_SCENE_IS_HYPOTHETICAL", "DIRECT_MEANING_SOURCE_UNVERIFIED"] : [],
          sourceSupportLimitations: ["검증된 것은 원본 연구 Record와 계산 출처의 기술적 신원이다.", "생활 점검 질문의 효과나 개인 사건의 발생을 직접 입증하지 않는다.", "sourceRefs의 원래 선언 확인은 참조 파일의 현행 내용이나 고전 직접 명제의 신규 검증이 아니다.", "가상 장면은 개인 경험이 아니며 추가 Context의 실제 적용은 보류한다."],
          directSourceSupport: { originalResearch: "RESEARCH_ORIGINAL_SOURCE_VERIFIED", actualCalculation: calculated ? "CALCULATED_FACT_VERIFIED" : "CALCULATED_COMPARISON_CONTEXT_ONLY", exactMeaning: "DIRECT_MEANING_SOURCE_UNVERIFIED", traditionalOrEmpiricalEffectProven: false },
          meaningReviewState: "MEANING_REVIEW_REQUIRED", productReviewState: "PRODUCT_REVIEW_REQUIRED", customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING", modelReviewState: calculated ? null : "MODEL_PROPOSED_REVIEW",
          reviewer: null, officialApprovalEnvelope: null, meaningIdentity: null, claimIdentity: null, plannerAssignment: null, readerQuestionId: null, bookAllocation: null, customerApproved: false, newFactRoots: 0,
        };
        const sentence = { ...body, draftSentenceId: `annual-interpretation-review-sentence:v1:${digest(body)}` }; sentences.push(sentence); return sentence;
      }
      function paragraph(fn: string, lines: ReviewSentence[]) { ensure(lines.length && lines.every(s => s.sentenceText !== null), "READABLE_REVIEW_PARAGRAPH_REQUIRED"); paragraphs.push({ function: fn, sentenceIds: lines.map(s => s.draftSentenceId), text: join(lines.map(s => s.sentenceText!)) }); }
      let decomposition: ReviewCase["workbenchDecomposition"] = null;
      if (candidate) {
        const pointers = uniq(witnesses.flatMap(w => [w.beforeSegmentPointer, w.afterSegmentPointer]));
        for (const pointer of pointers) {
          const facts = factual.preview.sentences.filter(s => s.originalSegmentPointer === pointer && ["PERIOD", "PILLAR", "TEN_GOD_ROLE", "DAYUN", "BOUNDARY", "RELATION"].includes(s.function));
          ensure(facts.length && facts.every(s => s.calculationCertainty === "confirmed"), "VERIFIED_FACT_EXPLANATIONS_REQUIRED");
          paragraph("A_ACTUAL_FACT_EXPLANATION", facts.map(f => add(f.text, f.function, "CALCULATED_FACT_EXPLANATION", ["/requires"], f)));
        }
        const changes = factual.preview.sentences.filter(s => witnesses.some(w => w.afterSegmentPointer === s.originalSegmentPointer) && s.function === "COMPARISON");
        ensure(changes.length === witnesses.length, "ALL_ORIGINAL_COMPARISONS_REQUIRED");
        const labels = { monthPillar: "월주", effectiveAnnualPillar: "실효 연주", activeDayunContext: "대운 Context", stemTenGod: "월간 십성 역할", branchTenGod: "월지 본기 십성 역할", relations: "관계 Signature와 참가자" };
        const signatureLines = witnesses.map(w => {
          const start = w.afterInterval.start!.replace("T", " ").replace("+09:00", " KST");
          const text = w.result === "VERIFIED_SIGNATURE_DIFFERENCE" ? `${start} 경계 앞뒤에서 실제로 달라진 항목은 ${w.changedFields.map(k => labels[k]).join("·")}입니다.` : `${start} 경계 앞뒤에서는 월주·실효 연주·대운·십성 역할·관계 Signature가 이어집니다.`;
          return add(`${text} 양쪽 구간이 함께 참조하는 원래 Root는 ${w.sharedRootSet.length}개입니다.`, "VERIFIED_SIGNATURE_RESULT", "CALCULATED_FACT_EXPLANATION", ["/requires", "/action"], null, null, w);
        });
        paragraph("B_PERIOD_COMPARISON", [...changes.map(f => add(f.text, "COMPARISON", "CALCULATED_FACT_EXPLANATION", ["/requires", "/action"], f)), ...signatureLines]);
        const bounds = ["이 계산 비교만으로 실제 생활 사건이나 유리함·불리함이 확인되는 것은 아닙니다.", "아래 질문은 원본 연구를 참고해 작성한 조건부 검토 제안이며, 전통 원문의 직접 명제나 검증된 개인 효과로 승인되지 않았습니다."];
        paragraph("B_INFERENCE_LIMIT", bounds.map(t => add(t, "INTERPRETATION_LIMIT", "CONDITIONAL_INTERPRETATION_PROPOSAL", ["/risk", "/disallowed"])));
        const proposed = questions(month, request.graph.context.owners.person!);
        paragraph("C_CONDITIONAL_QUESTIONS", proposed.map(t => add(t, "CONDITIONAL_QUESTION", "CONDITIONAL_INTERPRETATION_PROPOSAL", ["/action", "/positive", "/twist", "/scene/text"])));
        paragraph("D_COUNTEREXAMPLE_AND_LIMIT", [add(`원본 연구의 반례를 그대로 확인합니다: ${String(raw.counterexample)}`, "COUNTEREXAMPLE", "CONDITIONAL_INTERPRETATION_PROPOSAL", ["/counterexample"]), add("같은 Root의 반복 참조와 달력의 월 이름은 새로운 독립 의미나 개인 사건의 근거가 되지 않습니다.", "ROOT_AND_CALENDAR_LIMIT", "CONDITIONAL_INTERPRETATION_PROPOSAL", ["/risk", "/counterexample"])]);
        paragraph("E_MISSING_ACTUAL_CONTEXT", [add(`이 초안에는 ${requiredContext.join("·")}을 확인할 개인 상황 근거가 연결되지 않았으므로, 질문의 개인 적용 여부는 보류합니다.`, "MISSING_CONTEXT", "CONDITIONAL_INTERPRETATION_PROPOSAL", ["/scene/text", "/requires"])]);
        for (const text of ["이번 달에 수입이 늘어납니다.", "새로운 인간관계가 시작됩니다.", "이 변화로 실패할 가능성이 높아집니다.", "연구의 가상 장면을 실제로 겪었습니다."]) add(null, "UNSUPPORTED_EVENT_ATTEMPT", "WITHHELD_UNSUPPORTED_INFERENCE", ["/disallowed", "/risk", "/scene/text"], null, text);
        const proposal: ReadingProposal = { catalogKey: reading.catalogKey, originalId: reading.originalId, expectedRecordHash: reading.proof.actualHash, engine: "annual-fortune", primaryMeaning: proposed.join(" "), relatedButDifferentMeaning: String(raw.meaning), requiredConditions: [...raw.requires.map(String), ...requiredContext], counterexamples: [String(raw.counterexample)], validConditionalApplication: proposed[0], unusableInterpretation: originalDisallowed.join(" · "), reviewState: "MODEL_PROPOSED_REVIEW", operatorApproved: false, customerApproved: false, originalRecordActuallyRead: true, supportingExternalPagesFreshlyRead: false, sourceFields: ["/action", "/scene/text"], says: String(raw.action), doesNotSay: String(raw.risk), missingUserFacts: requiredContext.join(" · "), safeExample: proposed[0], unsafeFactExample: "연구 장면을 실제로 겪었다.", unsafeFutureExample: "계산 변화가 성공을 보장한다.", claimLayers: [{ layer: "PRACTICAL_REFLECTION_QUESTION", field: "/action", explanation: proposed[1] }, { layer: "PRACTICAL_REFLECTION_QUESTION", field: "/scene/text", explanation: proposed[0] }] };
        decomposition = meaningDecomposition(meaningReading, proposal);
      }
      const blocked = comparison.withheld.filter(w => w.month === month), comparisonEvidenceNodes = provenance(allIds, true);
      cases.push({ month, originalResearchId: pin.originalId, technicalState: candidate ? "TECHNICALLY_ELIGIBLE_FOR_REVIEW" : "TECHNICALLY_WITHHELD", originalCandidateId: candidate?.candidateId ?? null, originalCandidateHash: candidate ? digest(candidate) : null, originalNativeReceiptId: native.receiptId, originalNativeReceiptHash: digest(native),
        typedNativeReceiptRefs: candidate ? candidate.typedReceipts.map(r => ({ segmentPointer: r.segmentPointer, receiptId: r.typedNativeReceipt.receiptId, receiptHash: r.typedNativeReceiptHash })) : [],
        comparisonEvidenceNodes, originalAncestryStates: comparisonEvidenceNodes.map(n => ({ nodeId: n.nodeId, ancestry: graph.get(n.nodeId)!.ancestry })), missingOriginalAncestorIds: [...missingOriginalAncestorIds].sort(), originalGraphWithholds: comparisonEvidenceNodes.filter(n => n.status !== "VERIFIED" || n.certainty !== "confirmed").map(n => ({ nodeId: n.nodeId, blockers: graph.get(n.nodeId)!.blockers })), originalBlockingReasons: candidate ? candidate.blockingReasons : [...blocked, ...witnesses.flatMap(w => w.reasons)], comparisonWitnesses: witnesses, comparisonWitnessHash: digest(witnesses), requiredContext, paragraphs, sentences, workbenchDecomposition: decomposition });
    }
    ensure(before === digest([request, bridge.handoff, bridge.native]), "ORIGINAL_INPUT_MUTATED");
    const body: Omit<ReviewDraft, "draftHash"> = { version: REVIEW_VERSION, fixtureId: request.graph.context.fixtureId, selectedYear: factual.preview.selectedYear, requestHash: digest(request), graphHash: factual.preview.graphHash, calculationHash: factual.preview.calculationHash, originalFactualPreviewHash: factual.preview.previewHash, research, cases, customerClaims: 0, customerApprovals: 0, customerReaderBridges: 0, customerBookAllocations: 0, newFactRoots: 0, independentMeaningsAdded: 0, humanReviewCompleted: false, meaningApproved: false, productApproved: false, customerApproved: false, customerEdition: false, wholeBookCompleted: false, customerReady: false };
    const draft = freeze({ ...body, draftHash: digest(body) }), context = freeze({ version: REVIEW_VERSION, fixtureId: draft.fixtureId, requestHash: draft.requestHash });
    sessions.set(context, { draft, factual, services, sourcePins });
    return { ok: true as const, context, draft: structuredClone(draft), factual };
  } catch (e) { return { ok: false as const, reasons: [e instanceof Error ? e.message : "INTERPRETATION_REVIEW_WITHHELD"], customerUseAllowed: false as const }; }
}
export function generateInterpretationReview(context: ReviewContext) {
  offline(); const s = sessions.get(context); ensure(s && Object.isFrozen(context), "AUTHENTIC_REVIEW_CONTEXT_REQUIRED");
  for (const [file, pin] of Object.entries(s.sourcePins)) ensure(hash(s.services.resolver.reader.text(file)) === pin, "REVIEW_SOURCE_HASH_MISMATCH");
  ensure(generateFactualPreview(s.factual.context).previewHash === s.draft.originalFactualPreviewHash, "FACTUAL_PREVIEW_CHANGED");
  return structuredClone(s.draft);
}
export function validateInterpretationReview(context: ReviewContext, draft: ReviewDraft, usage: "OFFLINE_INTERPRETATION_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "OFFLINE_INTERPRETATION_REVIEW") {
  try { ensure(usage === "OFFLINE_INTERPRETATION_REVIEW", "REVIEW_IS_NOT_CUSTOMER_OR_PLANNER_AUTHORITY"); ensure(same(generateInterpretationReview(context), draft), "REVIEW_SOURCE_EVIDENCE_TEXT_CONDITION_OR_AUTHORITY_CHANGED"); return { ok: true, customerUseAllowed: false as const, approvalsIssued: 0 as const }; }
  catch (e) { return { ok: false, reasons: [e instanceof Error ? e.message : "REVIEW_WITHHELD"], customerUseAllowed: false as const, approvalsIssued: 0 as const }; }
}
