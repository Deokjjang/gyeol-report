import { actualSemanticDigest as digest } from "../actual-calculation-semantic-bridge/units";
import { generateInterpretationReview, validateInterpretationReview, type ReviewContext, type ReviewDraft, type ReviewCase, type ReviewSentence } from "../annual-interpretation-review-pilot/contract";
import { COMPARISON_CONTRACTS } from "../annual-temporal-comparison/contract";

export const EDITORIAL_VERSION = "annual-march-september-editorial-quality-review-v1" as const;
export type RevisionRow = {
  revisedSentenceId: string; originalSentenceIds: string[]; originalText: (string | null)[]; originalTextHashes: (string | null)[]; originalSentenceHashes: string[]; revisedText: string | null; revisedTextHash: string | null;
  disposition: "REVISED" | "UNCHANGED" | "WITHHELD"; placement: "MANUSCRIPT" | "EVIDENCE_DETAIL" | "LEDGER_ONLY";
  revisionReason: string; diagnostic: string; originalResearchId: string; owner: string;
  actualEvidenceNodeIds: string[]; sourceIdentity: ReviewSentence["sourceProof"]; originalFactRoots: string[];
  completeAncestry: ReviewSentence["completeAncestry"]; exactTemporalWindows: ReviewSentence["exactTemporalWindows"];
  originalMeaningReviewState: "MEANING_REVIEW_REQUIRED"; revisedMeaningReviewState: "MEANING_REVIEW_REQUIRED";
  requiredContext: string[]; counterexamples: string[]; prohibitedInferences: string[]; originalResearchFields: string[];
  periodSemantics: "NON_SIMULTANEOUS_COMPARISON"; calculationAuthority: "ORIGINAL_FACTS_ONLY";
  meaningScope: "ORIGINAL_CONDITIONAL_SCOPE_ONLY"; directMeaningSourceVerified: false; reviewer: null;
  originalMeaningIdentity: null; originalClaimIdentity: null; customerApproved: false;
};
export type RevisionCase = {
  fixtureId: string; month: 3 | 9; originalCase: ReviewCase; rows: RevisionRow[];
  paragraphs: { id: string; function: string; sentenceIds: string[]; text: string }[];
  humanDecisions: { paragraphId: string; selected: "UNSELECTED"; choices: readonly string[]; reviewer: null; humanReviewCompleted: false; meaningApproved: false; productApproved: false; customerApproved: false; officialApprovalEnvelope: null }[];
  quality: { calculationAccuracy: "AUTOMATICALLY_VERIFIED" | "WITHHELD_REQUIRED_EVIDENCE"; sourceFidelity: "IDENTITY_AND_SCOPE_VERIFIED_EFFECT_NOT_PROVEN"; koreanReadability: "HUMAN_REVIEW_REQUIRED"; monthSpecificInformation: "HUMAN_REVIEW_REQUIRED"; repetition: "HUMAN_REVIEW_REQUIRED"; conditionalMeaningScope: "ORIGINAL_SCOPE_RETAINED_HUMAN_REVIEW_REQUIRED"; missingPersonalContext: "PERSONAL_APPLICATION_WITHHELD" };
};
export type EditorialDraft = {
  version: typeof EDITORIAL_VERSION; fixtureId: string; originalDraftHash: string; originalDraft: ReviewDraft; cases: RevisionCase[];
  humanReviewCompleted: false; humanQualityApproved: false; meaningApproved: false; productApproved: false; customerApproved: false;
  customerClaims: 0; customerReaderBridges: 0; customerBookAllocations: 0; plannerAllocations: 0; newFactRoots: 0; newUnverifiedMeanings: 0;
  customerReady: false; draftHash: string;
};
export type EditorialContext = Readonly<{ version: typeof EDITORIAL_VERSION; fixtureId: string; originalDraftHash: string }>;
const sessions = new WeakMap<EditorialContext, { originalContext: ReviewContext; draft: EditorialDraft }>();
function ensure(value: unknown, code: string): asserts value { if (!value) throw Error(code); }
function offline() { ensure(!process.env.VERCEL && typeof window === "undefined", "EDITORIAL_REVIEW_OFFLINE_ONLY"); }
const unique = <T,>(values: T[]) => [...new Set(values)];
const byDigest = <T,>(values: T[]) => [...new Map(values.map(v => [digest(v), v])).values()];
const date = (v: string | null) => { ensure(v && /[+]09:00$/.test(v), "EXACT_KST_BOUND_REQUIRED"); return v.replace("T", " ").replace("+09:00", " KST"); };
function freeze<T>(value: T): T { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
function revise(original: ReviewDraft): EditorialDraft {
  const cases = original.cases.map(c => {
    const rows: RevisionRow[] = [], paragraphs: RevisionCase["paragraphs"] = [];
    const select = (...functions: string[]) => c.sentences.filter(s => functions.includes(s.sentenceFunction));
    function add(text: string | null, originals: ReviewSentence[], reason: string, diagnostic: string, placement: RevisionRow["placement"] = "MANUSCRIPT") {
      ensure(originals.length && originals.every(s => s.owner === originals[0].owner && s.originalResearchId === c.originalResearchId), "EXACT_ORIGINAL_SENTENCES_REQUIRED");
      const body: Omit<RevisionRow, "revisedSentenceId"> = {
        originalSentenceIds: originals.map(s => s.draftSentenceId), originalText: originals.map(s => s.sentenceText), originalTextHashes: originals.map(s => s.sentenceTextHash), originalSentenceHashes: originals.map(s => digest(s)), revisedText: text, revisedTextHash: text === null ? null : digest(text),
        disposition: text === null ? "WITHHELD" : originals.length === 1 && originals[0].sentenceText === text ? "UNCHANGED" : "REVISED", placement,
        revisionReason: reason, diagnostic, originalResearchId: c.originalResearchId, owner: originals[0].owner,
        actualEvidenceNodeIds: unique(originals.flatMap(s => s.actualEvidenceNodeIds)), sourceIdentity: originals[0].sourceProof,
        originalFactRoots: unique(originals.flatMap(s => s.originalFactRoots)).sort(), completeAncestry: byDigest(originals.flatMap(s => s.completeAncestry)), exactTemporalWindows: byDigest(originals.flatMap(s => s.exactTemporalWindows)),
        originalMeaningReviewState: "MEANING_REVIEW_REQUIRED", revisedMeaningReviewState: "MEANING_REVIEW_REQUIRED",
        requiredContext: unique(originals.flatMap(s => s.requiredContext)), counterexamples: unique(originals.flatMap(s => s.counterexamples)), prohibitedInferences: unique(originals.flatMap(s => s.prohibitedInferences)), originalResearchFields: unique(originals.flatMap(s => s.originalResearchFields)),
        periodSemantics: "NON_SIMULTANEOUS_COMPARISON", calculationAuthority: "ORIGINAL_FACTS_ONLY", meaningScope: "ORIGINAL_CONDITIONAL_SCOPE_ONLY", directMeaningSourceVerified: false, reviewer: null, originalMeaningIdentity: null, originalClaimIdentity: null, customerApproved: false,
      };
      const row = { ...body, revisedSentenceId: `annual-editorial-revision:v1:${digest(body)}` }; rows.push(row); return row;
    }
    function paragraph(fn: string, lines: RevisionRow[]) {
      ensure(lines.length && lines.every(s => s.revisedText !== null && s.placement === "MANUSCRIPT"), "READABLE_REVISED_PARAGRAPH_REQUIRED");
      const body = { function: fn, sentenceIds: lines.map(s => s.revisedSentenceId), text: lines.map(s => s.revisedText).join(" ") };
      paragraphs.push({ id: `annual-editorial-paragraph:v1:${digest(body)}`, ...body });
    }
    if (c.technicalState === "TECHNICALLY_ELIGIBLE_FOR_REVIEW") {
      const carry = c.comparisonWitnesses.find(w => w.comparisonType === "ADJACENT_MONTH"), change = c.comparisonWitnesses.find(w => w.comparisonType === "WITHIN_MONTH");
      // This revision supports exactly the already verified continuity/change pattern. Other patterns stay withheld.
      ensure(carry && change && (carry.result === "CONTINUITY" || carry.result === "CARRYOVER_CONTINUITY") && change.result === "VERIFIED_SIGNATURE_DIFFERENCE", "UNSUPPORTED_COMPARISON_PATTERN_WITHHELD");
      const b = change.beforeSignature, a = change.afterSignature;
      ensure(b && a && carry.beforeSignature && carry.afterSignature && digest(carry.afterSignature) === digest(b), "EXACT_CURRENT_PRODUCER_SIGNATURES_REQUIRED");
      ensure(!change.changedFields.includes("effectiveAnnualPillar") && !change.changedFields.includes("activeDayunContext") && a.activeDayunContext.status === "active" && a.activeDayunContext.cycles.length === 1, "UNSUPPORTED_YEAR_OR_DAYUN_CHANGE_WITHHELD");
      ensure(carry.beforeInterval.endExclusive === carry.afterInterval.start && change.beforeInterval.endExclusive === change.afterInterval.start && carry.afterInterval.start === change.beforeInterval.start, "NON_OVERLAPPING_COMPLETE_COMPARISON_REQUIRED");
      const pillar = (v: typeof a.monthPillar) => `${v.stem}${v.branch}`, jie = COMPARISON_CONTRACTS[c.month].jie, at = date(change.afterInterval.start);
      const comparisons = select("COMPARISON", "VERIFIED_SIGNATURE_RESULT"), pillars = select("PILLAR");
      paragraph("KEY_CHANGE", [add(c.month === 3
        ? `3월의 월주는 1일에 바뀌지 않습니다. 경칩 절입인 ${at}에 ‘${pillar(b.monthPillar)}’에서 ‘${pillar(a.monthPillar)}’ 표기로 바뀝니다.`
        : `9월 초의 월주는 8월 말과 같은 ‘${pillar(b.monthPillar)}’입니다. 백로 절입인 ${at}부터는 ‘${pillar(a.monthPillar)}’입니다.`, [...comparisons, ...pillars], "월별 핵심 차이를 먼저 제시하고 Root 개수의 반복은 근거 상세로 옮김. 값과 시각은 실제 비교 Producer에서 읽음.", "INFORMATION_PRIORITY_AND_MONTH_SPECIFICITY")]);
      const periods = [carry.beforeInterval, change.beforeInterval, change.afterInterval];
      paragraph("EXACT_PERIODS", periods.map((p, i) => {
        const originalPeriod = select("PERIOD").filter(s => s.exactTemporalWindows.some(w => w.temporal?.start === p.start && w.temporal?.endExclusive === p.endExclusive));
        return add(`${date(p.start)}부터 ${date(p.endExclusive)} 전까지의 월주 표기는 ‘${pillar(i === 2 ? a.monthPillar : b.monthPillar)}’입니다.`, originalPeriod, "연속된 세 구간의 시작 포함·끝 제외를 빠뜨리지 않고 짧게 나누어 설명. 서로 다른 기간을 동시 성립으로 합치지 않음.", "EXACT_PERIOD_AND_KOREAN_LENGTH");
      }));
      paragraph("CONTINUITY_AND_ROLES", [
        add(`위 세 구간에서 연도에 적용되는 기둥인 실효 연주 표기는 ‘${pillar(a.effectiveAnnualPillar)}’이고, 확인된 대운 표기는 ‘${a.activeDayunContext.cycles[0].ganji}’입니다.`, select("PILLAR", "DAYUN"), "변하지 않는 연주·대운을 한 번만 설명. 원래 각 기간과 Source 연결은 모두 유지.", "REPETITION"),
        add(`${jie} 전후 월간의 십성은 ‘${b.stemTenGod} → ${a.stemTenGod}’입니다. 월지 본기의 십성은 ‘${b.branchTenGod} → ${a.branchTenGod}’입니다. 둘은 일간을 기준으로 각각 다른 역할을 계산한 값입니다.`, select("TEN_GOD_ROLE"), "서로 다른 월간·월지 역할을 분리하고 전후 차이를 한 문장으로 비교. 역할값에서 생활 효과를 도출하지 않음.", "ROLE_SEPARATION"),
      ]);
      paragraph("INFERENCE_LIMITS", [
        add("이 차이는 계산 조건의 변화입니다. 관계 표기와 참여 대상은 아래 근거에서 구간별로 확인할 수 있지만, 이 자료만으로 개인 사건이나 유리함·불리함을 판단할 수는 없습니다.", [...select("INTERPRETATION_LIMIT", "ROOT_AND_CALENDAR_LIMIT"), ...select("RELATION")], "각 관계 뒤에 반복하던 한계를 모아 제시. 관계 참여 대상·기간·원래 Root는 상세와 Ledger에 보존.", "SOURCE_AND_INFERENCE_LIMIT"),
        add("아래 질문은 원본 연구 범위에서 다듬은 편집 제안입니다. 생활에서의 효과나 전통 문헌의 직접 근거는 검증되지 않았습니다.", select("INTERPRETATION_LIMIT"), "계산 사실과 신규 편집 제안의 출처 수준을 구분. 직접 의미 Source가 없는 생활 효과는 서술하지 않음.", "SOURCE_FIDELITY"),
      ]);
      paragraph("CONDITIONAL_REVIEW", [
        add(c.month === 3
          ? "실제로 같은 학습 목표 아래 비교할 과제가 있다면, 2월 말과 경칩 뒤를 나누어 각 과제의 점검 조건이 같은지 확인해 볼까요?"
          : "이미 정한 작업 순서와 점검할 계획이 있다면, 8월 말부터 이어진 구간과 백로 뒤 구간에서 유지할 기준과 다시 확인할 기준을 나누어 볼까요?", select("CONDITIONAL_QUESTION"), "원본 action·가상 scene에 속하는 두 질문을 하나로 축약. 질문의 효과·개인 경험·시기 적합성은 주장하지 않음.", "CONDITIONAL_QUESTION_REPETITION"),
        add("개인 상황 근거가 연결되지 않았으므로 이 질문을 본인에게 적용할지는 보류합니다. 실제 목표나 계획, 점검 기준, 적용 기간과 관찰 시각이 먼저 필요합니다.", select("MISSING_CONTEXT"), "미입력 상황을 보유한 사실로 취급하지 않고 필요한 Context와 개인 적용 보류를 명시.", "MISSING_PERSONAL_CONTEXT"),
        add(select("COUNTEREXAMPLE")[0].sentenceText, select("COUNTEREXAMPLE"), "반례는 짧고 정확하므로 원문을 그대로 유지.", "COUNTEREXAMPLE_RETAINED"),
      ]);
      // Every original record remains addressable, even when repetition leaves the primary manuscript.
      for (const s of c.sentences) {
        if (s.sentenceText === null) add(null, [s], "근거 없는 사건·경험 추론은 계속 차단. 자연스러운 문장으로 대체하지 않음.", "UNSUPPORTED_MEANING_WITHHELD", "LEDGER_ONLY");
        else if (s.sentenceFunction === "RELATION" || s.sentenceFunction === "BOUNDARY") add(s.sentenceText, [s], "정확한 대상·절입 표기를 보존하되 반복되는 기술 설명은 계산 근거 상세에 배치.", "DETAIL_RETAINED", "EVIDENCE_DETAIL");
      }
      ensure(c.sentences.every(s => rows.some(r => r.originalSentenceIds.includes(s.draftSentenceId))), "ORIGINAL_SENTENCE_COVERAGE_REQUIRED");
    } else ensure(!c.sentences.length && !c.paragraphs.length, "WITHHELD_CASE_CANNOT_RECEIVE_REVISION");
    const humanDecisions = paragraphs.map(p => ({ paragraphId: p.id, selected: "UNSELECTED" as const, choices: ["KEEP", "REVISE", "WITHHOLD", "SOURCE_REQUIRED", "CONTEXT_REQUIRED"] as const, reviewer: null, humanReviewCompleted: false as const, meaningApproved: false as const, productApproved: false as const, customerApproved: false as const, officialApprovalEnvelope: null }));
    return { fixtureId: original.fixtureId, month: c.month, originalCase: c, rows, paragraphs, humanDecisions, quality: { calculationAccuracy: c.technicalState === "TECHNICALLY_WITHHELD" ? "WITHHELD_REQUIRED_EVIDENCE" : "AUTOMATICALLY_VERIFIED", sourceFidelity: "IDENTITY_AND_SCOPE_VERIFIED_EFFECT_NOT_PROVEN", koreanReadability: "HUMAN_REVIEW_REQUIRED", monthSpecificInformation: "HUMAN_REVIEW_REQUIRED", repetition: "HUMAN_REVIEW_REQUIRED", conditionalMeaningScope: "ORIGINAL_SCOPE_RETAINED_HUMAN_REVIEW_REQUIRED", missingPersonalContext: "PERSONAL_APPLICATION_WITHHELD" } } satisfies RevisionCase;
  });
  const body = { version: EDITORIAL_VERSION, fixtureId: original.fixtureId, originalDraftHash: original.draftHash, originalDraft: original, cases, humanReviewCompleted: false, humanQualityApproved: false, meaningApproved: false, productApproved: false, customerApproved: false, customerClaims: 0, customerReaderBridges: 0, customerBookAllocations: 0, plannerAllocations: 0, newFactRoots: 0, newUnverifiedMeanings: 0, customerReady: false } as const;
  return { ...body, draftHash: digest(body) };
}
export function prepareEditorialRevision(originalContext: ReviewContext) {
  offline();
  try {
    const original = generateInterpretationReview(originalContext);
    ensure(validateInterpretationReview(originalContext, original).ok, "AUTHENTIC_ORIGINAL_REVIEW_REQUIRED");
    const draft = freeze(revise(original)), context = freeze({ version: EDITORIAL_VERSION, fixtureId: original.fixtureId, originalDraftHash: original.draftHash });
    sessions.set(context, { originalContext, draft }); return { ok: true as const, context, draft: structuredClone(draft) };
  } catch (e) { return { ok: false as const, reasons: [e instanceof Error ? e.message : "EDITORIAL_REVISION_WITHHELD"], customerUseAllowed: false as const }; }
}
export function generateEditorialRevision(context: EditorialContext) {
  offline(); const s = sessions.get(context); ensure(s && Object.isFrozen(context), "AUTHENTIC_EDITORIAL_CONTEXT_REQUIRED");
  ensure(generateInterpretationReview(s.originalContext).draftHash === s.draft.originalDraftHash, "ORIGINAL_REVIEW_SOURCE_CHANGED");
  return structuredClone(s.draft);
}
export function validateEditorialRevision(context: EditorialContext, draft: EditorialDraft, usage: "OFFLINE_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" | "OFFICIAL_APPROVAL" = "OFFLINE_REVIEW") {
  try { ensure(usage === "OFFLINE_REVIEW", "EDITORIAL_REVISION_IS_NOT_APPROVAL_OR_CUSTOMER_AUTHORITY"); ensure(digest(generateEditorialRevision(context)) === digest(draft), "EDITORIAL_TEXT_EVIDENCE_SOURCE_PERIOD_OR_AUTHORITY_CHANGED"); return { ok: true, customerUseAllowed: false as const }; }
  catch (e) { return { ok: false, reasons: [e instanceof Error ? e.message : "EDITORIAL_REVISION_WITHHELD"], customerUseAllowed: false as const }; }
}
