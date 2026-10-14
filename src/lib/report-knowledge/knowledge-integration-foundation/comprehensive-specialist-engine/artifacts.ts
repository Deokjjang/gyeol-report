import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { privacySafeGraph } from "../actual-evidence-graph/artifacts";
import { bindingCoverage } from "../knowledge-binder/engine";
import { canonicalJson, hash } from "../sourceReader";
import type { ComprehensiveSpecialistEngine } from "./engine";
import { VERSION, type RealRun } from "./types";
import { REUSE_CONTRACT } from "./reuseConstraints";
import type { runSyntheticValidation } from "./syntheticValidation";
export function writeSpecialistArtifacts(out: string, engine: ComprehensiveSpecialistEngine, cases: readonly RealRun[], synthetic: Awaited<ReturnType<typeof runSyntheticValidation>>, forbidden: readonly string[], baseSha: string) {
    mkdirSync(join(out, "shards"), { recursive: true });
    const files: Record<string, string> = {};
    const write = (file: string, value: unknown) => { const text = JSON.stringify(value, null, 2) + "\n"; if (/aeg:(node|root):[a-f0-9]{64}/.test(text) || forbidden.filter(x => x.length > 1).some(x => text.includes(x)))
        throw Error("SPECIALIST_PRIVACY_CHECK_FAILED:" + file); writeFileSync(join(out, file), text); files[file] = hash(text); };
    const roots = new Map([...new Set(cases.flatMap(c => c.request.graph.nodes.flatMap(n => n.ancestry.rootIds)))].sort().map((r, i) => [r, `fixture-root-${i + 1}`]));
    const redacted: unknown[] = [];
    const comparisons: unknown[] = [];
    for (const run of cases) {
        const safe = privacySafeGraph(run.request.graph, forbidden, roots), aliases = new Map<string, string>(), people = new Map<string, string>();
        run.request.graph.nodes.forEach((n, i) => { aliases.set(n.id, safe.nodes[i].id); if (n.fact.producerEvidenceId && safe.nodes[i].fact.producerEvidenceId)
            aliases.set(n.fact.producerEvidenceId, safe.nodes[i].fact.producerEvidenceId!); if (n.owner.originalPersonId)
            people.set(n.owner.originalPersonId, n.owner.fixtureOwnerId); });
        for (const [k, v] of roots)
            aliases.set(k, v);
        const redact = (v: unknown): unknown => typeof v === "string" ? (() => { let s = aliases.get(v) ?? v; for (const [k, a] of people)
            s = s.split(k).join(a); for (const f of forbidden.filter(x => x.length > 1))
            s = s.split(f).join("[synthetic-private-input]"); return s; })() : Array.isArray(v) ? v.map(redact) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, redact(x)])) : v;
        const result = redact(run.result) as RealRun["result"];
        for (const [i, r] of result.allProductReceipts.entries())
            r.receiptId = `${result.fixtureId}:specialist:${i + 1}`;
        for (const [i, d] of result.diagnostics.entries())
            d.binderReceipt.receiptId = `${result.fixtureId}:material:${i + 1}`;
        write(`shards/${result.fixtureId}-binding.json`, result.allProductReceipts);
        write(`shards/${result.fixtureId}-diagnostics.json`, { ...result, allProductReceipts: undefined, baselineProductReceipts: undefined, diagnostics: result.diagnostics.map(d => ({ ...d, binderReceipt: undefined, bindingReceiptFile: `${result.fixtureId}-binding.json`, bindingCatalogKey: d.catalogKey })) });
        redacted.push(result);
        comparisons.push({ fixtureId: result.fixtureId, before: bindingCoverage(run.result.baselineProductReceipts), after: bindingCoverage(run.result.allProductReceipts), materialEvaluations: result.diagnostics.length, materialActualWitnesses: result.diagnostics.reduce((n, d) => n + d.binderReceipt.matches.reduce((n, m) => n + m.matchedActualEvidence.length, 0), 0), nativeStructuralWitnesses: result.diagnostics.reduce((n, d) => n + d.binderReceipt.matches.filter(m => m.requirementId.includes(":native-god:")).reduce((n, m) => n + m.matchedActualEvidence.length, 0), 0), customerEligible: 0 });
    }
    const rs = redacted as RealRun["result"][], coverage = rs.flatMap(r => r.coverage), materials = [...engine.index.candidates.values()];
    write("comprehensive-candidate-index.json", materials.map(c => ({ ...c, bindingCandidate: c.bindingCandidate.requirement })));
    write("question-material-matches.json", materials.flatMap(c => c.questionLinks));
    write("product-question-registry.json", engine.index.questions);
    write("question-evidence-coverage.json", coverage);
    write("specialist-binding-comparison.json", comparisons);
    write("semantic-identity-audit.json", { originalMaterialIdentities: materials.map(c => ({ id: c.originalResearchId, originalMeaningId: c.meaning.originalMeaningId, originalClaimId: c.meaning.originalClaimId, meaningClass: c.meaning.originalClass, review: c.meaning.review })), fixturePairs: rs.map(r => ({ fixtureId: r.fixtureId, relations: r.meaningRelations })), wordingDifferenceIsNotIndependence: true, sharedAxisIsNotEquivalence: true });
    write("candidate-conflict-graph.json", rs.map(r => ({ fixtureId: r.fixtureId, edges: r.conflicts, duplicateFactGroups: r.duplicateFactGroups, reviewedRelationsResolved: 0 })));
    write("fact-root-reuse-constraints.json", { ...REUSE_CONTRACT, fixtures: rs.map(r => ({ fixtureId: r.fixtureId, rootReferences: r.diagnostics.map(d => ({ material: d.researchId, roots: d.roots, meaning: d.binderReceipt.meaningIdentity, claim: d.binderReceipt.claimIdentity, firstIntroduction: "NOT_ISSUED", currentApplication: "NOT_SELECTED", independentFactsAdded: 0 })) })) });
    write("reader-scheduler-boundary.json", { status: "READER_SCHEDULER_BRIDGE_UNVERIFIED", reader: { chapters: engine.index.questions.filter(q => q.address.level === "PARAGRAPH").map(q => q.address.chapterId).filter((v, i, a) => a.indexOf(v) === i), paragraphs: engine.index.questions.filter(q => q.address.level === "PARAGRAPH").length, roles: engine.index.questions.filter(q => q.address.level === "SENTENCE_ROLE").length }, schedulerIds: ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"], numberMappingCreated: false, originalSchedulerModified: false, originalReleaseSourceAllocationModified: false, roles: "Existing scheduler selects runtime profile candidates; this engine diagnoses original specialist research applicability. No Book allocation or rendering occurs." });
    write("specialist-eligibility-results.json", rs.map(r => ({ fixtureId: r.fixtureId, mode: r.mode, actualCustomerEligible: r.actualCustomerEligible, claimsEmitted: r.actualClaimsEmitted, customerSelectionRun: r.customerSelectionRun, states: r.diagnostics.map(d => ({ id: d.researchId, states: d.states, blockers: d.binderReceipt.blockingReasons })) })));
    write("real-research-withheld.json", rs.map(r => ({ fixtureId: r.fixtureId, materials: r.diagnostics.map(d => ({ id: d.researchId, reasons: d.binderReceipt.followupRequirements, rank: null, selected: false, customerApproved: false })) })));
    write("operator-review-worklist.json", materials.map(c => { const ds = rs.flatMap(r => r.diagnostics.filter(d => d.catalogKey === c.catalogKey)), witnesses = ds.flatMap(d => d.actualNodes), direct = c.questionLinks.some(l => l.kind === "DIRECT_QUESTION_MATERIAL"), blocked = ds.some(d => d.states.includes("POLICY_WITHHELD")); return { questionIds: [...new Set(c.questionLinks.map(l => l.questionId))], researchId: c.originalResearchId, catalogKey: c.catalogKey, originalMeaning: c.material.coreMeaning, requiredEvidence: c.bindingCandidate.requirement.sourceRequirements, matchedEvidence: witnesses, sourceRoots: [...new Set(ds.flatMap(d => d.roots))], semanticReview: "PENDING", domainReview: blocked ? "SCOPED_USE_WITHHELD" : "REVIEW_REQUIRED", originalCounterexample: c.material.counterexample, missingConditions: [...new Set(ds.flatMap(d => d.binderReceipt.followupRequirements))], sourceGroupState: ds.map(d => d.binderReceipt.sourceGroupEvaluation), operatorApproval: false, customerApproval: false, currentDispositions: ds.map(d => d.binderReceipt.finalDisposition), reviewPriority: [witnesses.length ? 0 : 1, direct ? 0 : 1, blocked ? 1 : 0], priorityIsNotCustomerRank: true, nextVerificationAction: "Review original meaning, prerequisites, counterexample, exact source ancestry and entered context; do not infer approval from witnesses." }; }).sort((a, b) => JSON.stringify(a.reviewPriority).localeCompare(JSON.stringify(b.reviewPriority)) || a.researchId.localeCompare(b.researchId, "en")));
    const aggregate = (ids: string[]) => { const q = new Set(ids), rows = coverage.filter(c => q.has(c.questionId)); return { registered: ids.length, fixtureQuestionOccurrences: rows.length, linkedOccurrences: rows.filter(r => r.linkedMaterials > 0).length, witnessOccurrences: rows.filter(r => r.actualWitnessMaterials > 0).length, customerEligible: 0 }; };
    write("chapter-specialism-matrix.json", [...new Set(engine.index.questions.map(q => q.address.chapterId))].map(id => ({ chapter: id, ...aggregate(engine.index.questions.filter(q => q.address.chapterId === id).map(q => q.id)), originalQuestions: engine.index.questions.filter(q => q.address.chapterId === id && q.address.level === "PARAGRAPH").map(q => ({ address: q.address.originalAddress, question: q.originalQuestion, purpose: q.readerPurpose, domain: q.allowedDomains, context: q.allowedContexts })) })));
    write("paragraph-evidence-matrix.json", engine.index.questions.filter(q => q.address.level === "PARAGRAPH").map(q => ({ address: q.address.originalAddress, ...aggregate([q.id]) })));
    write("role-requirement-matrix.json", engine.index.questions.filter(q => q.address.level === "SENTENCE_ROLE").map(q => ({ address: q.address.originalAddress, role: q.originalRole, ...aggregate([q.id]) })));
    write("missing-contract-diagnostics.json", rs.map(r => ({ fixtureId: r.fixtureId, materials: r.diagnostics.map(d => ({ id: d.researchId, originalReview: engine.index.candidates.get(d.catalogKey)?.originalReview, unenteredFacts: d.unenteredFacts, actualFacetObservations: "UNSUPPORTED_PRODUCER", unknown: d.binderReceipt.followupRequirements, recall: d.recall, fusion: d.fusion, sourceCoverage: d.sourceCoverage })) })));
    const syntheticAliases = new Map<string, string>();
    for (const o of synthetic.options)
        for (const id of [...o.receipt.selectedActualEvidence, ...o.receipt.matches.flatMap(m => [...m.rejectedNodeIds, ...m.matchedActualEvidence.map(n => n.nodeId)])])
            if (!syntheticAliases.has(id))
                syntheticAliases.set(id, `synthetic-node-${syntheticAliases.size + 1}`);
    const redactSynthetic = (v: unknown): unknown => typeof v === "string" ? syntheticAliases.get(v) ?? v : Array.isArray(v) ? v.map(redactSynthetic) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, redactSynthetic(x)])) : v;
    write("synthetic-selection-results.json", redactSynthetic(synthetic));
    write("synthetic-algorithm-comparison.json", { rootReservation: synthetic.comparison, questionFit: synthetic.questionFitComparison });
    const before = cases.flatMap(c => c.result.baselineProductReceipts), after = cases.flatMap(c => c.result.allProductReceipts), manifest = { version: VERSION, baseSha, specialistStatus: "OFFLINE_IMPLEMENTED", mode: "REAL_RESEARCH_DIAGNOSTICS", researchRecords: engine.foundation.catalog.candidates.size, product: "saju_mbti_full", readerChapters: new Set(engine.index.questions.map(q => q.address.chapterId)).size, readerParagraphs: engine.index.questions.filter(q => q.address.level === "PARAGRAPH").length, readerRoles: engine.index.questions.filter(q => q.address.level === "SENTENCE_ROLE").length, registeredQuestions: engine.index.questions.length, applicableProductCandidates: engine.index.applicableCandidates.length, researchMaterials: materials.length, questionLinkedMaterials: materials.filter(c => c.questionLinks.length > 0).length, originalReviewStates: Object.fromEntries([...new Set(materials.map(c => c.originalReview))].map(s => [s, materials.filter(c => c.originalReview === s).length])), natalOnlyMaterials: materials.filter(c => c.material.kind === "natal").length, fixtures: cases.length, evaluationUnit: "Same original comprehensive candidate-fixture pairs; source-reference matches and graph-node witnesses are not independent interpretations", before: bindingCoverage(before), after: bindingCoverage(after), materialFixtureOccurrences: cases.reduce((n, c) => n + c.result.diagnostics.length, 0), meaningIdentityResolved: 0, meaningReviewRequired: materials.length, semanticConflictPairOccurrences: cases.reduce((n, c) => n + c.result.meaningRelations.length, 0), duplicateFactGroupOccurrences: cases.reduce((n, c) => n + c.result.duplicateFactGroups.length, 0), verifiedDifferentApplications: 0, actualOperatorApproved: 0, actualCustomerEligible: 0, actualSpecialistClaimsEmitted: 0, actualCustomerSelections: 0, newIndependentFacts: 0, runtimeConnections: 0, bookChanges: 0 };
    if (after.some(r => r.customerApproved) || cases.some(c => c.result.errors.length || !c.result.graphUnchanged || !c.result.researchUnchanged))
        throw Error("REAL_SPECIALIST_SAFETY_INVARIANT_FAILED");
    write("comprehensive-specialist-manifest.json", manifest);
    write("privacy-audit.json", { matchingBeforeRedaction: true, rawNamesBirthdatesPersonHashesOrGraphFingerprintsExported: false, realCustomerDataAccessed: false, syntheticOnly: true });
    write("deterministic-output.json", { version: VERSION, files, outputDigest: hash(canonicalJson(files)), timingsExcluded: true });
    return manifest;
}
