import { mkdirSync, writeFileSync } from "node:fs";
import { canonicalJson, hash } from "../sourceReader";
import { bindingCoverage } from "../knowledge-binder/engine";
import type { MajorFortuneSpecialistEngine } from "./engine";
import type { MajorResult } from "./types";
import type { runMajorInputProbes } from "./inputProbes";
import type { runMajorSyntheticValidation } from "./syntheticValidation";
import { publicMajorObservation } from "./inputProbes";
import { MAJOR_ROOT_REUSE_CONTRACT } from "./reuseConstraints";
export function writeMajorArtifacts(out: string, engine: MajorFortuneSpecialistEngine, cases: readonly MajorResult[], synthetic: Awaited<ReturnType<typeof runMajorSyntheticValidation>>, probes: Awaited<ReturnType<typeof runMajorInputProbes>>, forbidden: string[], baseSha: string) {
  const all = cases.flatMap(c => c.receipts), baseline = cases.flatMap(c => c.baselineReceipts), before = bindingCoverage(baseline), after = bindingCoverage(all);
  const candidates = [...engine.index.candidates.values()], diagnostics = cases.flatMap(c => c.diagnostics), matches = diagnostics.flatMap(d => d.matches), observations = cases.map(c => ({ fixtureId: c.fixtureId, ...publicMajorObservation(c.observation) }));
  const facts = (rs: typeof all) => rs.filter(r => r.stages.includes("FACTS_MATCHED")).length;
  const registry = engine.index.registry.map(c => ({ catalogKey: c.record.catalogKey, originalId: c.record.originalId, locator: c.record.locator, originalKind: c.record.kind, classification: engine.index.candidates.get(c.record.catalogKey)?.researchKind ?? (c.record.locator.file.endsWith("Crosswalk.ts") ? "INHERITED_REFERENCE" : c.record.locator.file.endsWith("/sourceInventory.ts") ? "SOURCE_INVENTORY" : c.record.locator.file.endsWith("/bindingDesign.ts") ? "FUTURE_BINDING_DESIGN" : "REJECTED_OR_HELD"), originalSourceState: c.sourceCheck, customerApproved: false }));
  const rootGroups = cases.map(c => ({ fixtureId: c.fixtureId, groups: [...new Set(c.receipts.flatMap(r => r.canonicalFactRoots))].map(root => ({ root, candidates: c.receipts.filter(r => r.canonicalFactRoots.includes(root)).map(r => r.candidateCatalogKey) })).filter(g => g.candidates.length > 1) }));
  const sourceGroups = candidates.map(c => ({ catalogKey: c.catalogKey, originalSemantics: c.bindingCandidate.requirement.sourceGroupSemantics, originalGroups: c.bindingCandidate.requirement.sourceGroups, roles: c.sourceRoles, inferredGroups: 0, blocker: "NO_NEW_AND_OR_SEMANTICS_OR_CUSTOMER_APPROVAL" }));
  const supportFile = "docs/validation/v4-major-fortune-product-knowledge-01/producer-support-matrix.json";
  const source = engine.foundation.catalog;
  const manifest = { version: "major-fortune-specialist-v1", baseSha, status: "OFFLINE_IMPLEMENTED", mode: "REAL_RESEARCH_DIAGNOSTICS", registryRecords: registry.length, inheritedReferences: registry.filter(r => r.classification === "INHERITED_REFERENCE").length, researchMaterials: candidates.length, sourceInventory: registry.filter(r => r.classification === "SOURCE_INVENTORY").length, bindingDesign: registry.filter(r => r.classification === "FUTURE_BINDING_DESIGN").length, rejectedOrHeld: registry.filter(r => r.classification === "REJECTED_OR_HELD").length, yearSlots: cases[0].observation.years.length, questionViews: cases[0].questions.length, graphFixtureCases: cases.length, candidateFixtureEvaluations: all.length, before: { ...before, factsMatched: facts(baseline) }, after: { ...after, factsMatched: facts(all) }, graphWitnessMatchingNotApplicationApproval: true, meaningIdentityResolved: 0, meaningReviewRequired: candidates.length, semanticConflictPairs: cases.reduce((n, c) => n + c.conflicts.length, 0), duplicateFactGroups: rootGroups.reduce((n, c) => n + c.groups.length, 0), actualCustomerEligible: 0, actualCustomerSelection: 0, actualClaimsEmitted: 0, runtimeConnection: 0, bookChanges: 0 };
  const payloads: Record<string, unknown> = {
    "major-specialist-manifest.json": manifest,
    "major-registry-classification.json": registry,
    "major-inherited-reference-audit.json": registry.filter(r => r.classification === "INHERITED_REFERENCE").map(r => ({ ...r, original: source.raw.get(r.catalogKey), interpretationApproval: false })),
    "major-research-index.json": candidates,
    "major-year-question-registry.json": cases.map(c => ({ fixtureId: c.fixtureId, questions: c.questions, links: c.links, coverage: c.coverage })),
    "major-period-evidence-matches.json": cases.map(c => ({ fixtureId: c.fixtureId, diagnostics: c.diagnostics })),
    "major-cycle-selection-results.json": observations,
    "major-transition-validation.json": probes.boundaries.filter(b => b.boundary?.exact),
    "major-range-transition-results.json": probes.boundaries.filter(b => b.boundary && !b.boundary.exact),
    "major-producer-support.json": { originalMatrixFile: supportFile, originalFileHash: source.input.frozen.get(supportFile), matrix: source.reader.json(supportFile), graphExposure: observations.map(o => ({ fixtureId: o.fixtureId, unknownIntervalCycles: o.cycles.filter(c => c.graphTimeState === "UNKNOWN_INTERVAL").length, annualPreciseIntervals: 0, newGraphRootsCreated: 0 })), independentCompositeVerdicts: 0, calculationChanges: 0 },
    "major-relation-scope-audit.json": observations.map(o => ({ fixtureId: o.fixtureId, natalDayun: o.natalDayunRelations, annual: o.years.map(y => ({ year: y.calendarYear, relations: y.relations })) })),
    "major-year-comparison-graph.json": cases.map(c => ({ fixtureId: c.fixtureId, graph: c.comparison })),
    "major-information-function.json": { actual: matches.map(m => ({ catalogKey: m.catalogKey, year: m.year, function: m.informationFunction, approvedApplication: false })), facts: observations.map(o => ({ fixtureId: o.fixtureId, yearFacts: o.years.map(y => ({ year: y.calendarYear, annualRoots: y.annualRoots, dayunContinuityRoots: y.cycle?.canonicalFactRoots ?? [], function: "NEW_CALCULATED_FACT_OBSERVATION_NOT_NEW_APPROVED_APPLICATION" })) })), synthetic: synthetic.comparison },
    "major-semantic-conflicts.json": { realResearch: cases.map(c => ({ fixtureId: c.fixtureId, conflicts: c.conflicts })), synthetic: synthetic.conflicts },
    "major-root-reuse.json": { contract: MAJOR_ROOT_REUSE_CONTRACT, groups: rootGroups },
    "major-before-after-binding.json": { before: manifest.before, after: manifest.after, cohorts: cases.map(c => ({ fixtureId: c.fixtureId, candidateKeys: c.receipts.map(r => r.candidateCatalogKey), before: bindingCoverage(c.baselineReceipts), after: bindingCoverage(c.receipts) })), extraAFObservationsExcluded: true },
    "major-synthetic-selection.json": synthetic,
    "major-algorithm-comparison.json": synthetic.comparison,
    "major-operator-worklist.json": candidates.map(c => ({ catalogKey: c.catalogKey, originalResearchId: c.originalResearchId, researchKind: c.researchKind, scope: c.original.scope ?? null, requiredSourceRefs: c.original.sourceRefs ?? null, observations: matches.filter(m => m.catalogKey === c.catalogKey), semanticReviewState: "MEANING_REVIEW_REQUIRED", domainPolicyState: "ORIGINAL_BINDER_GATES_RETAINED", counterconditions: c.original.counterconditions ?? c.original.forbidden ?? null, customerApproval: false, nextAction: "Resolve original conditions, period and ancestry; independently review meaning and application. Operator review order is not customer ranking." })).sort((a, b) => b.observations.filter(m => m.observed).length - a.observations.filter(m => m.observed).length || a.originalResearchId.localeCompare(b.originalResearchId, "en")),
    "major-withheld-evidence.json": { yearRequirements: matches.map(m => ({ catalogKey: m.catalogKey, year: m.year, reasons: m.reasons })), originalFailures: probes.withheld },
    "major-producer-gaps.json": { gaps: cases[0].observation.producerGaps, unsupportedComposite: "NATAL_DAYUN_ANNUAL_COMPOSITE_VERDICT", noNewEndpoints: true, sourceGroups, requiredProducerFollowup: { input: "same owner, original pillars, original exact/range cycles, year and explicit evaluation instant", output: "original producer-supported before/after cycle-specific natal and annual relation packets with positions, participants, IDs, versions and valid bounds", invariants: ["no changed calculations or transition instants", "range interior remains uncertain", "unknown hour stays absent", "no composed three-layer verdict", "preserve existing evidence IDs and stored Books"], performed: false } },
    "major-a-f-observations.json": { ...probes, forbidden: undefined },
    "major-source-ancestry.json": { sourceRoles: sourceGroups, originalSourceReferenceIsNotEvidence: true, cycleSourceNeverCopiedToAnotherCycle: true },
    "major-annual-evidence-identity.json": observations.map(o => ({ fixtureId: o.fixtureId, owner: o.owner, years: o.years.map(y => ({ year: y.calendarYear, cycle: y.cycle?.cycleIndex, annual: y.annualGanji, annualEvidenceIds: y.annualEvidenceIds, originalReasons: y.reasonIds, annualRoots: y.annualRoots, graphNodes: y.graphNodeIds, sourceAncestry: y.sourceAncestry })) })),
    "major-semantic-pending.json": { resolved: 0, pending: candidates.map(c => ({ catalogKey: c.catalogKey, originalMeaning: c.original.meaning ?? c.original.core ?? null, state: "MEANING_REVIEW_REQUIRED", operatorApproved: false })) },
    "major-unresolved-requirements.json": candidates.map(c => ({ catalogKey: c.catalogKey, original: c.bindingCandidate.requirement.unresolvedConditions, additionalOriginalFields: c.sourceRoles.filter(s => s.role === "ACTUAL_REQUIRED_EVIDENCE" && !s.machineCheckable), sourceGroups: c.bindingCandidate.requirement.sourceGroups })),
    "major-privacy-audit.json": { inputNamesAndBirthDatesOmitted: true, customerData: 0, externalCalls: 0, claims: 0, syntheticApprovalsAppliedToActual: 0 },
  };
  mkdirSync(out, { recursive: true }); const files: Record<string, string> = {};
  for (const [file, value] of Object.entries(payloads)) {
    const text = JSON.stringify(value, null, 2) + "\n";
    if ([...new Set(forbidden)].filter(Boolean).some(s => text.includes(s))) throw Error("PERSONAL_DATA_IN_SPECIALIST_ARTIFACT:" + file);
    writeFileSync(out + "/" + file, text); files[file] = hash(text);
  }
  const deterministic = { algorithm: "SHA256 exact JSON bytes", files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b, "en"))), combinedDigest: hash(canonicalJson(files)) };
  writeFileSync(out + "/deterministic-output.json", JSON.stringify(deterministic, null, 2) + "\n");
  return manifest;
}
