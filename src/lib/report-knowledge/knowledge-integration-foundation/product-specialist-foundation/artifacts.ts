import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { canonicalJson, hash } from "../sourceReader";
import { privacySafeGraph } from "../actual-evidence-graph/artifacts";
import { bindingCoverage } from "../knowledge-binder/engine";
import type { ProductSpecialistFoundation } from "./binderIntegration";
import type { FoundationRunCase } from "./types";
import { SPECIALIST_FOUNDATION_VERSION } from "./types";
import { unscopedCommonResearch } from "./questionMatcher";
import { operatorReviewWorklist } from "./reviewWorklist";
import { coverageReadiness } from "./coverage";
export function writeFoundationArtifacts(out: string, engine: ProductSpecialistFoundation, cases: readonly FoundationRunCase[], forbidden: readonly string[], baseSha: string) {
    mkdirSync(join(out, "shards"), { recursive: true });
    const files: Record<string, string> = {};
    const write = (file: string, v: unknown) => { const text = JSON.stringify(v, null, 2) + "\n"; if (/aeg:(node|root):[a-f0-9]{64}/.test(text) || forbidden.filter(f => f.length > 1).some(f => text.includes(f)))
        throw Error("FOUNDATION_PRIVACY_CHECK_FAILED:" + file); writeFileSync(join(out, file), text); files[file] = hash(text); };
    const roots = new Map([...new Set(cases.flatMap(c => c.request.graph.nodes.flatMap(n => n.ancestry.rootIds)))].sort().map((id, i) => [id, `fixture-root-${i + 1}`]));
    const caseAliases = new Map<string, Map<string, string>>(), nodeAliases = new Map<string, string>(), people = new Map<string, string>();
    for (const c of cases) {
        const safe = privacySafeGraph(c.request.graph, forbidden, roots), local = new Map<string, string>();
        caseAliases.set(c.result.fixtureId, local);
        for (const [n, i] of c.request.graph.nodes.map((n, i) => [n, i] as const)) {
            local.set(n.id, safe.nodes[i].id);
            if (!nodeAliases.has(n.id))
                nodeAliases.set(n.id, safe.nodes[i].id);
            if (n.fact.producerEvidenceId && safe.nodes[i].fact.producerEvidenceId) {
                local.set(n.fact.producerEvidenceId, safe.nodes[i].fact.producerEvidenceId!);
                if (!nodeAliases.has(n.fact.producerEvidenceId))
                    nodeAliases.set(n.fact.producerEvidenceId, safe.nodes[i].fact.producerEvidenceId!);
            }
            if (n.owner.originalPersonId)
                people.set(n.owner.originalPersonId, n.owner.fixtureOwnerId);
        }
    }
    const redact = (v: unknown, aliases = nodeAliases): unknown => typeof v === "string" ? (() => { let s = roots.get(v) ?? aliases.get(v) ?? v; for (const [id, alias] of people)
        s = s.split(id).join(alias); for (const f of forbidden.filter(f => f.length > 1))
        s = s.split(f).join("[synthetic-private-input]"); return s; })() : Array.isArray(v) ? v.map(x => redact(x, aliases)) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, redact(x, aliases)])) : v;
    const summaries: unknown[] = [], allQuestionCoverage = cases.flatMap(c => c.result.questionCoverage);
    for (const c of cases) {
        const result = redact(c.result, caseAliases.get(c.result.fixtureId)) as FoundationRunCase["result"];
        for (const [g, rows] of [result.before, result.after, result.periodAttempts.map(a => a.receipt)].entries())
            for (const [i, r] of rows.entries()) {
                r.receiptId = `${result.fixtureId}:specialist:${g === 2 ? "period" : "primary"}:${i + 1}`;
            }
        const changes = result.after.filter((r, i) => canonicalJson({ ...r, receiptId: null }) !== canonicalJson({ ...result.before[i], receiptId: null }));
        const file = `shards/${result.fixtureId}-foundation.json`;
        write(file, { fixtureId: result.fixtureId, product: c.request.product, relationship: c.request.relationship, baselineReceiptFile: `../v4-knowledge-binder-01/shards/${result.fixtureId}-receipts.json`, primaryCandidateFixtureOccurrences: result.after.length, changedPrimaryReceipts: changes, annualMonths: result.annualMonths, temporalDiagnostics: result.temporalDiagnostics, periodAttempts: result.periodAttempts, majorSelection: result.majorSelection, questionCoverage: result.questionCoverage, errors: result.errors, graphUnchanged: result.graphUnchanged, catalogUnchanged: result.catalogUnchanged });
        summaries.push({ fixtureId: result.fixtureId, product: c.request.product, relationship: c.request.relationship, file, baseline: bindingCoverage(result.before), primaryAfter: bindingCoverage(result.after), periodAttempts: result.periodAttempts.length, periodBinding: bindingCoverage(result.periodAttempts.map(a => a.receipt)), roleAlternativeWitnessOccurrences: result.temporalDiagnostics.reduce((n, w) => n + w.acceptedNodeIds.length, 0), questionReadiness: coverageReadiness(result.questionCoverage) });
    }
    const overlayIndex: unknown[] = [], candidateOverlays = [...engine.overlays.values()];
    for (const family of [...new Set(candidateOverlays.map(c => c.original.record.family))].sort()) {
        const rows = candidateOverlays.filter(c => c.original.record.family === family).sort((a, b) => a.original.record.catalogKey.localeCompare(b.original.record.catalogKey, "en")), file = `shards/${family}-contracts.json`;
        write(file, rows.map(c => c.overlay));
        overlayIndex.push({ family, file, candidates: rows.length });
    }
    write("specialist-contract-overlay.json", overlayIndex);
    write("product-question-registry.json", engine.registry.questions);
    write("product-contracts.json", engine.registry.products);
    write("question-material-links.json", engine.questions.links);
    write("product-question-coverage.json", allQuestionCoverage);
    const readinessMatrix = engine.registry.products.map(p => { const qs = engine.registry.questions.filter(q => q.productKey === p.productKey && q.relationshipCategory === p.relationship), ids = new Set(qs.map(q => q.id)), linked = engine.questions.links.filter(l => ids.has(l.questionId)), rows = allQuestionCoverage.filter(q => ids.has(q.questionId)); return { ...p, registeredQuestions: qs.length, distinctLinkedInterpretationCandidates: new Set(linked.filter(l => engine.overlays.has(l.catalogKey)).map(l => l.catalogKey)).size, linkKinds: Object.fromEntries(["DIRECT_QUESTION_MATERIAL", "CONDITIONAL_APPLICATION", "SHARED_FOUNDATION_MATERIAL", "RECALL_ONLY", "REFERENCE_ONLY", "EXPRESSION_ONLY"].map(k => [k, linked.filter(l => l.kind === k).length])), applicableCatalogCandidates: engine.catalog.search(p.productKey, p.relationship).length, originalProductScopedCandidates: candidateOverlays.filter(c => c.original.requirement.products.includes(p.productKey) && (!p.relationship || c.original.requirement.relationships.includes(p.relationship))).length, typedSourceConditions: candidateOverlays.filter(c => c.original.requirement.products.includes(p.productKey) && (!p.relationship || c.original.requirement.relationships.includes(p.relationship))).reduce((n, c) => n + c.overlay.normalization.filter(r => r.requiredEvidence.length > 0).length, 0), fixtureReadiness: coverageReadiness(rows), fixtureGateCounts: { actualWitnessOccurrences: rows.reduce((n, r) => n + r.actualWitnessOccurrences, 0), structuralMatches: rows.reduce((n, r) => n + r.structuralMatches, 0), semanticReviewPending: rows.reduce((n, r) => n + r.semanticReviewPending, 0), domainBlocks: rows.reduce((n, r) => n + r.domainBlocks, 0), inputUnknown: rows.reduce((n, r) => n + r.inputUnknown, 0), sourceGroupBlocked: rows.reduce((n, r) => n + r.sourceGroupBlocked, 0), operatorReviewPending: rows.reduce((n, r) => n + r.operatorReviewPending, 0) }, countingPolicy: "Question-fixture counts can repeat the same material and are not independent claims.", customerApproved: 0, customerAnswerable: 0 }; });
    write("product-readiness-matrix.json", readinessMatrix);
    write("relationship-interface-coverage.json", readinessMatrix.filter(p => p.relationship));
    write("specialist-binder-comparison.json", summaries);
    write("annual-selector-results.json", summaries.filter((r) => (r as {
        product: string;
    }).product === "annual_fortune"));
    write("major-selector-results.json", summaries.filter((r) => (r as {
        product: string;
    }).product === "major_fortune"));
    write("unscoped-common-research.json", unscopedCommonResearch(engine.catalog, engine.questions));
    write("source-contract-gap-audit.json", candidateOverlays.filter(c => c.overlay.normalizedRequirement.applicabilityState !== "MACHINE_CHECKABLE").map(c => ({ catalogKey: c.original.record.catalogKey, before: c.original.requirement.applicabilityState, after: c.candidate.requirement.applicabilityState, unknown: c.overlay.normalization.filter(n => n.remainingUnknown.length).map(n => ({ field: n.originalField, state: n.verificationStatus, reasons: n.remainingUnknown })), proposalsActivated: 0 })));
    const selectorRegistry: unknown[] = candidateOverlays.flatMap(c => c.overlay.normalization.filter(n => n.requiredEvidence.length).map(n => ({ catalogKey: c.original.record.catalogKey, field: n.originalField, selectors: n.requiredEvidence, method: n.normalizationMethod, source: n.sourceLocator, hash: n.sourceHash, proposalOnly: n.proposalOnly })));
    selectorRegistry.push({ catalogKey: null, field: "/annual-role-templates", selectors: [], method: "MONTH_STEM_AND_MONTH_BRANCH_MAIN_SEPARATE; EFFECTIVE_ANNUAL_AND_DAYUN_GOD_UNEXPOSED", source: { file: "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts" }, hash: engine.catalog.input.frozen.get("src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts") ?? "UNKNOWN", proposalOnly: true });
    write("typed-selector-registry.json", selectorRegistry);
    write("operator-review-worklist.json", redact(operatorReviewWorklist(engine.catalog, engine.questions, cases)));
    const before = cases.flatMap(c => c.result.before), after = cases.flatMap(c => c.result.after), periods = cases.flatMap(c => c.result.periodAttempts.map(a => a.receipt));
    const states = (field: "original" | "candidate") => Object.fromEntries(["MACHINE_CHECKABLE", "PARTIALLY_CHECKABLE", "CONTRACT_NOT_MACHINE_CHECKABLE"].map(state => [state, candidateOverlays.filter(c => c[field].requirement.applicabilityState === state).length]));
    write("unknown-unsupported-requirements.json", redact({ unknownSourceRequirements: candidateOverlays.flatMap(c => c.overlay.normalization.filter(n => n.remainingUnknown.length).map(n => ({ catalogKey: c.original.record.catalogKey, field: n.originalField, source: n.sourceLocator, sourceHash: n.sourceHash, state: n.verificationStatus, reasons: n.remainingUnknown }))), unsupportedProducerUses: cases.flatMap(c => c.result.after.filter(r => r.producerSupport === "FAIL").map(r => ({ fixtureId: c.result.fixtureId, catalogKey: r.candidateCatalogKey, sourceRequirements: engine.overlays.get(r.candidateCatalogKey)?.candidate.requirement.sourceRequirements.map(s => ({ sourceKey: s.sourceKey, selector: s.selector })), gate: r.allTwelveGateResults.find(g => g.gate === "PRODUCER_SUPPORT"), actualGraphProducerBlockers: c.request.graph.nodes.filter(n => r.matches.some(m => m.rejectedNodeIds.includes(n.id))).map(n => ({ producer: n.producer, kind: n.kind, blockers: n.blockers })) }))) }));
    const eligibility = [...after, ...periods].filter(r => r.customerApproved).length;
    if (eligibility)
        throw Error("CUSTOMER_ELIGIBLE_MUST_REMAIN_ZERO");
    const manifest = { version: SPECIALIST_FOUNDATION_VERSION, baseSha, researchRecords: engine.catalog.candidates.size, interpretationCandidates: engine.overlays.size, nonCandidateRecords: engine.catalog.candidates.size - engine.overlays.size, questions: engine.registry.questions.length, productKeys: [...new Set(engine.registry.products.map(p => p.productKey))].sort(), relationships: engine.registry.products.flatMap(p => p.relationship ? [p.relationship] : []).sort(), questionLevels: Object.fromEntries(["PARAGRAPH", "SENTENCE_ROLE", "PERIOD", "PERIOD_ROLE"].map(level => [level, engine.registry.questions.filter(q => q.address.level === level).length])), distinctQuestionMappedCandidates: new Set(engine.questions.links.filter(l => engine.overlays.has(l.catalogKey)).map(l => l.catalogKey)).size, directSpecialistMaterials: new Set(engine.questions.links.filter(l => l.kind === "DIRECT_QUESTION_MATERIAL" && engine.overlays.has(l.catalogKey)).map(l => l.catalogKey)).size, unscopedCommonResearch: candidateOverlays.filter(c => !c.original.requirement.products.length).length, normalizationBefore: states("original"), normalizationAfter: states("candidate"), graphFixtures: cases.length, primaryCandidateFixtureOccurrencesBefore: before.length, primaryCandidateFixtureOccurrencesAfter: after.length, before: bindingCoverage(before), primaryAfter: bindingCoverage(after), separateExactPeriodAttemptOccurrences: periods.length, separatePeriodBinding: bindingCoverage(periods), separateRoleAlternativeWitnessOccurrences: cases.reduce((n, c) => n + c.result.temporalDiagnostics.reduce((n, w) => n + w.acceptedNodeIds.length, 0), 0), denominatorPolicy: "Primary comparison retains the same candidate-fixture pairs. Explicit monthly period attempts and ambiguous-role diagnostics are separate and never added to primary matching counts or independent interpretations.", readiness: coverageReadiness(allQuestionCoverage), operatorApproved: 0, customerEligible: 0, customerClaimsEmitted: 0, runtimeConnections: 0, bookChanges: 0 };
    write("product-specialist-foundation-manifest.json", manifest);
    write("privacy-audit.json", { rawInputsExported: false, rawPersonHashExported: false, rawGraphFingerprintsExported: false, matchingBeforeOrdinalAliases: true, syntheticOnly: true });
    write("deterministic-output.json", { version: SPECIALIST_FOUNDATION_VERSION, files, outputDigest: hash(canonicalJson(files)), performanceExcluded: true });
    return manifest;
}
