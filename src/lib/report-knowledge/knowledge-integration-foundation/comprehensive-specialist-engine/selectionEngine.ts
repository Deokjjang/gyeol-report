import { canonicalJson, recordHash, hash } from "../sourceReader";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate, KnowledgeBindingRequest, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";
import { isRecord } from "../normalization";
import { checkSyntheticRecall, selectionViolations } from "./reuseConstraints";
import type { SyntheticSession, SyntheticOption, SyntheticQuestion, ApprovedSyntheticMeaning, SyntheticIntroduction, SelectionMethod, SyntheticSelectionResult } from "./types";
export const SYNTHETIC_FILE = "tests/fixtures/comprehensive-specialist-engine-01/synthetic-knowledge.json";
type SessionData = {
    options: SyntheticOption[];
    questions: SyntheticQuestion[];
    ledger: SyntheticIntroduction[];
};
const sessions = new WeakMap<SyntheticSession, SessionData>();
/** Dedicated fixture registry, original-file hash, synthetic-only IDs, graph
 * producer isolation and fresh execution of all Binder gates are mandatory.
 * A flag, receipt supplied by a caller or changed provenance alone is insufficient. */
export async function createSyntheticSelectionSession(catalog: KnowledgeBinderCatalog, request: KnowledgeBindingRequest, candidates: readonly KnowledgeCandidate[], questions: readonly SyntheticQuestion[], meanings: ReadonlyMap<string, ApprovedSyntheticMeaning>, approvals: KnowledgeBindingApprovalProvider, ledger: readonly SyntheticIntroduction[] = []): Promise<SyntheticSession> {
    if (!request.graph.context.fixtureId.startsWith("synthetic:cse:") || request.graph.product !== "saju_mbti_full" || request.graph.nodes.some(n => n.producer.file !== SYNTHETIC_FILE || !n.owner.fixtureOwnerId.startsWith("synthetic:cse:") || n.fact.rootId && !n.fact.rootId.startsWith("synthetic:cse:root:")) || catalog.input.records.length !== candidates.length || catalog.input.records.some(r => r.family !== "comprehensive-specialist-synthetic-fixture" || r.locator.file !== SYNTHETIC_FILE || !r.originalId.startsWith("synthetic:cse:")))
        throw Error("SYNTHETIC_ISOLATION_REQUIRED");
    if (hash(catalog.reader.text(SYNTHETIC_FILE)) !== catalog.input.frozen.get(SYNTHETIC_FILE))
        throw Error("SYNTHETIC_SOURCE_HASH_MISMATCH");
    const declared = catalog.reader.json(SYNTHETIC_FILE);
    if (!isRecord(declared) || !Array.isArray(declared.questions))
        throw Error("SYNTHETIC_QUESTION_REGISTRY_REQUIRED");
    for (const q of questions)
        if (!q.id.startsWith("synthetic:cse:q:") || !declared.questions.some(x => canonicalJson(x) === canonicalJson(q)))
            throw Error("SYNTHETIC_QUESTION_NOT_REGISTERED");
    const index = new ActualBindingIndex(request, catalog);
    if (index.errors.length)
        throw Error("SYNTHETIC_GRAPH_INVALID:" + index.errors.join("|"));
    const options: SyntheticOption[] = [];
    for (const c of candidates) {
        const source = await catalog.reader.locate(c.record.locator), meaning = meanings.get(c.record.originalId);
        if (c.provenance !== "SYNTHETIC_TEST_ONLY" || c.record.locator.file !== SYNTHETIC_FILE || !c.record.originalId.startsWith("synthetic:cse:") || source.code || recordHash(source.value) !== c.record.locator.recordSha256 || !isRecord(source.value) || canonicalJson(source.value.meaning) !== canonicalJson(meaning) || !meaning?.reviewId.startsWith("synthetic:cse:review:"))
            throw Error("SYNTHETIC_CANDIDATE_NOT_REGISTERED");
        const receipt = bindKnowledgeCandidate(c, index, catalog, approvals);
        if (receipt.allTwelveGateResults.map(g => g.gate).join("|") !== BINDING_HARD_GATES.join("|"))
            throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
        const sourceQuestionId = source.value.questionId;
        for (const q of questions.filter(q => q.id === sourceQuestionId)) {
            const reasons = [...receipt.allTwelveGateResults.filter(g => !["PASS", "NOT_APPLICABLE"].includes(g.state)).flatMap(g => g.reasons)];
            if (!q.requiredMeanings.every(m => meaning.requiredMeanings.includes(m)))
                reasons.push("QUESTION_REQUIRED_MEANING_MISSING");
            if (q.domain !== meaning.domain || q.context !== meaning.context)
                reasons.push("QUESTION_DOMAIN_CONTEXT_MISMATCH");
            if (c.requirement.meaningIdentity !== meaning.meaningId || c.requirement.claimIdentity !== meaning.claimId)
                reasons.push("APPROVED_MEANING_IDENTITY_MISMATCH");
            if (!receipt.canonicalFactRoots.length)
                reasons.push("VERIFIED_ROOT_REQUIRED");
            if (q.chapter === "CH13" && !meaning.recallOf)
                reasons.push("CLOSING_REQUIRES_ACTUAL_INTRODUCTION");
            const option: SyntheticOption = { id: c.record.originalId, questionId: q.id, receipt, meaning: structuredClone(meaning), roots: receipt.canonicalFactRoots, owner: request.graph.context.owners.person!, mbtiType: request.graphInput.evidence.input.kind === "compatibility" ? null : request.graphInput.evidence.input.person.mbtiType || null, eligible: false, reasons };
            reasons.push(...checkSyntheticRecall(option, ledger));
            option.reasons = [...new Set(reasons)].sort();
            option.eligible = receipt.customerApproved && option.reasons.length === 0;
            options.push(option);
        }
    }
    const session: SyntheticSession = Object.freeze({ kind: "SYNTHETIC_ELIGIBLE_SELECTION_TEST" });
    sessions.set(session, { options, questions: structuredClone([...questions]), ledger: structuredClone([...ledger]) });
    return session;
}
export function syntheticOptions(session: SyntheticSession): readonly SyntheticOption[] { const data = sessions.get(session); if (!data)
    throw Error("AUTHENTIC_SYNTHETIC_SESSION_REQUIRED"); return structuredClone(data.options); }
const preference = (a: SyntheticOption, b: SyntheticOption) => Number(b.meaning.direct) - Number(a.meaning.direct) || b.meaning.extraMeanings.length - a.meaning.extraMeanings.length || a.id.localeCompare(b.id, "en");
const preferenceCounts = (rows: readonly SyntheticOption[]) => ({ directMaterials: rows.filter(r => r.meaning.direct).length, explicitWitnesses: rows.reduce((n, r) => n + r.receipt.selectedActualEvidence.length, 0), functionVariety: new Set(rows.map(r => r.meaning.polarity)).size });
const objective = (rows: readonly SyntheticOption[]) => { const p = preferenceCounts(rows); return [new Set(rows.map(r => r.questionId)).size, rows.reduce((n, r) => n + r.meaning.requiredMeanings.length, 0), p.directMaterials, p.explicitWitnesses, new Set(rows.filter(r => !r.meaning.recallOf).map(r => r.meaning.meaningId)).size, new Set(rows.flatMap(r => r.roots)).size, p.functionVariety, -(rows.flatMap(r => r.roots).length - new Set(rows.flatMap(r => r.roots)).size)]; };
const compare = (a: readonly number[], b: readonly number[]) => { for (let i = 0; i < a.length; i++)
    if (a[i] !== b[i])
        return a[i] - b[i]; return 0; };
export function selectSynthetic(session: SyntheticSession, method: SelectionMethod): SyntheticSelectionResult {
    const data = sessions.get(session);
    if (!data)
        throw Error("AUTHENTIC_SYNTHETIC_SESSION_REQUIRED");
    if (data.questions.length > 24 || data.options.length > 256)
        throw Error("EXPLICIT_SYNTHETIC_SEARCH_SCOPE_REQUIRED");
    const qs = [...data.questions].sort((a, b) => a.id.localeCompare(b.id, "en")), byQuestion = new Map(qs.map(q => [q.id, data.options.filter(o => o.questionId === q.id && o.eligible).sort(method === "FIRST_ELIGIBLE" ? (a, b) => a.id.localeCompare(b.id, "en") : preference)]));
    let selected: SyntheticOption[] = [], visited = 0, complete = true;
    if (method !== "CONSTRAINT_SEARCH")
        for (const q of qs) {
            const o = byQuestion.get(q.id)!.find(o => !selectionViolations([...selected, o], data.ledger).length);
            if (o)
                selected.push(o);
        }
    else {
        let best: SyntheticOption[] = [];
        const visit = (i: number, rows: SyntheticOption[]) => { if (++visited > 200000) {
            complete = false;
            return;
        } if (objective(rows)[0] + qs.length - i < objective(best)[0])
            return; if (i === qs.length) {
            const order = compare(objective(rows), objective(best));
            if (order > 0 || order === 0 && rows.map(r => r.id).join("|") < best.map(r => r.id).join("|"))
                best = [...rows];
            return;
        } for (const o of byQuestion.get(qs[i].id)!)
            if (!selectionViolations([...rows, o], data.ledger).length)
                visit(i + 1, [...rows, o]); visit(i + 1, rows); };
        visit(0, []);
        selected = best;
    }
    const score = objective(selected), hardViolations = selectionViolations(selected, data.ledger);
    if (!complete)
        hardViolations.push("SEARCH_LIMIT_NO_OPTIMALITY_CLAIM");
    return { method, selected: selected.map(o => ({ questionId: o.questionId, candidateId: o.id })), coveredQuestions: score[0], requiredMeaningUnits: score[1], distinctMeanings: score[4], distinctRoots: score[5], repeatedRootUses: -score[7], hardViolations, preferences: preferenceCounts(selected), search: { visited, complete }, notSelected: data.options.filter(o => !selected.includes(o)).map(o => ({ candidateId: o.id, reasons: o.eligible ? selectionViolations([...selected, o], data.ledger).length ? selectionViolations([...selected, o], data.ledger) : ["LEXICOGRAPHIC_PREFERENCE_OR_GLOBAL_RESERVATION"] : o.reasons })), actualCustomerClaimsEmitted: 0 };
}
