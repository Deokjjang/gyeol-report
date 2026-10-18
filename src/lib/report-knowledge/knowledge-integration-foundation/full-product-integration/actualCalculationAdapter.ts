import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HIDDEN_STEMS } from "../../../saju/constants";
import { generateV4ShadowReport, type V4ShadowClock } from "../../../interpretation-v4/runtimeShadow";
import type { V4RuntimeEvidence } from "../../../interpretation-v4/runtimeProjection";
import { observeActualProfiles } from "../actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "../actual-evidence-graph/engine";
import { isRecord } from "../normalization";
import { hash } from "../sourceReader";
import { readerSourcePins } from "./sourcePins";
import { reviewTemporalMeaning, applyTemporalMeaningReview } from "../global-source-domain-resolution/conditionalTemporalMeaningReview";
import type { MeaningField } from "../global-source-domain-resolution/conditionalTemporalReviewMaterial";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import type { TenGodApplicationRequest } from "../global-source-domain-resolution/temporalTenGodEvidence";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { prepareActualFactContext, createActualDayMasterUnit, createActualTenGodUnit, validateActualCalculatedUnit, actualSemanticDigest,
  type ActualFactContext, type ActualCalculatedSemanticUnit, type ActualFactAttempt } from "../actual-calculation-semantic-bridge/units";

const FIXTURE_FILE = "tests/fixtures/six-product-integration-01/source-locks.json";
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ACTUAL_CALCULATION_ADAPTER_OFFLINE_ONLY"); }
/** Enumerate existing packet fields, not new ten-god/calendar calculations. */
export function actualCalculationSpecs(request: KnowledgeBindingRequest): TenGodApplicationRequest[] {
  const specs: TenGodApplicationRequest[] = [], c = request.graphInput.evidence.composition;
  const calc = request.graphInput.evidence.calculations.person;
  if (!calc || !["major_fortune", "annual_fortune"].includes(c.product)) return specs;
  for (const n of request.graph.nodes) {
    const v = isRecord(n.value) ? n.value : {}, pointer = n.fact.observationPointer;
    const add = (origin: TenGodApplicationRequest["origin"], god: string, referenceStem: string, targetStem: string, cycleIndex?: number) => {
      specs.push({ nodeId: n.id, owner: n.owner.fixtureOwnerId, origin, god, referenceStem, targetStem, cycleIndex, window: n.temporal });
    };
    if (n.producer.symbol === "collectStructureAtoms" && v.location === "visible" && typeof v.god === "string" && typeof v.stem === "string") add("NATAL_STEM", v.god, calc.dayMaster, v.stem);
    if (c.product === "major_fortune") {
      if (n.producer.symbol === "calculateCustomerDayun" && typeof v.tenGod === "string" && typeof v.ganji === "string" && typeof v.cycleIndex === "number") add("DAYUN_STEM", v.tenGod, calc.dayMaster, v.ganji[0], v.cycleIndex);
      if (n.kind === "EDITORIAL_PROOF_OBSERVATION" && typeof v.tenGod === "string" && /annual\/evidenceIds\/1$/.test(pointer)) {
        const year = c.result.evidence.years.find(y => y.year === v.year); if (year) add("ANNUAL_STEM", v.tenGod, calc.dayMaster, year.annual.ganji[0]);
      }
    }
    if (c.product !== "annual_fortune" || n.kind !== "CALCULATED_PERIOD_FACT") continue;
    const e = c.result.evidence, m = /calendarMonths\/(\d+)\/segments\/(\d+)\/evidenceIds\/(\d+)$/.exec(pointer);
    const s = m && e.raw.calendarMonths?.[+m[1]]?.segments[+m[2]]; if (!m || !s) continue;
    if (+m[3] === 3) { add("MONTH_STEM", s.stemTenGod, calc.dayMaster, s.monthPillar.stem); add("MONTH_BRANCH_MAIN", s.branchTenGod, calc.dayMaster, HIDDEN_STEMS[s.monthPillar.branch][0].stem); }
    const cross = e.crossPeriods.find(x => Date.parse(x.startKst) <= Date.parse(s.startKst) && Date.parse(x.endKstExclusive) >= Date.parse(s.endKstExclusive)
      && actualSemanticDigest(x.segment.effectiveAnnualPillar) === actualSemanticDigest(s.effectiveAnnualPillar)
      && actualSemanticDigest(x.segment.activeDayunContext) === actualSemanticDigest(s.activeDayunContext));
    if (!cross) continue;
    if (+m[3] === 1) add("ANNUAL_STEM", cross.annualGod, calc.dayMaster, s.effectiveAnnualPillar.stem);
    if (+m[3] === 2) for (const x of cross.cycles) { add("DAYUN_STEM", x.god, calc.dayMaster, x.cycle.stem, x.cycle.index); add("FLOW_GOD", x.flowGod, x.cycle.stem, s.effectiveAnnualPillar.stem, x.cycle.index); }
  }
  return specs;
}
export async function linkConditionalReview(context: ActualFactContext, unit: ActualCalculatedSemanticUnit, request: KnowledgeBindingRequest, resolver: TemporalTenGodSourceResolver) {
  if (!(await validateActualCalculatedUnit(context, unit)).ok) throw Error("VERIFIED_ACTUAL_UNIT_REQUIRED_FOR_REVIEW_LINK");
  const pending = { evidenceKind: "CONDITIONAL_INTERPRETIVE_MEANING" as const, unitId: unit.unitId,
    calculationVerified: true as const, sourceDefinitionVerified: true as const, meaningReview: "MEANING_REVIEW_REQUIRED" as const,
    productReview: "PRODUCT_REVIEW_REQUIRED" as const, customerApproval: "CUSTOMER_APPROVAL_PENDING" as const,
    meaningApproved: false as const, customerApproved: false as const, customerClaims: 0 as const };
  if (!unit.calculationWitness || unit.originLayer === "NATAL_STEM" || unit.originLayer === "FLOW_GOD") return { ...pending,
    reviewPacketHash: null, originalResearchId: null, field: null, technicalLinkage: "NOT_APPLICABLE" as const,
    reasons: [unit.originLayer === "FLOW_GOD" ? "FLOW_REFERENCE_IS_DAYUN_NOT_NATAL_MEANING" : "NO_TEMPORAL_MEANING_FOR_NATAL_FACT"] };
  const field: MeaningField = unit.originLayer === "DAYUN_STEM" ? "dayun" : unit.originLayer === "ANNUAL_STEM" ? "saeun" : "wolun";
  try {
    const records = resolver.records.filter(r => r.originalId === `tr:god:${unit.definitionLabel}` && r.locator.exportName === "TEMPORAL_GOD_ROLES");
    if (records.length !== 1) throw Error("EXACT_REVIEW_ORIGINAL_REQUIRED");
    const review = await reviewTemporalMeaning(resolver, records[0], field);
    if (review.originalSourceIdentity !== unit.sourceIdentity || review.definitionProof?.actualHash !== unit.sourceHash || review.definitionProof.sourceVersion !== unit.sourceVersion) throw Error("EXACT_UNIT_REVIEW_DEFINITION_REQUIRED");
    const applied = await applyTemporalMeaningReview(resolver, records[0], field, request, unit.calculationWitness, { packetHash: review.packetHash, requestedScope: review.temporalScope });
    if (applied.actualEvidence.nodeId !== unit.originalEvidenceNodeId || actualSemanticDigest(applied.actualEvidence.roots) !== actualSemanticDigest(unit.canonicalFactRoots)
      || actualSemanticDigest(applied.effectiveInterval) !== actualSemanticDigest(unit.effectiveInterval)) throw Error("EXACT_UNIT_REVIEW_EVIDENCE_REQUIRED");
    return { ...pending, reviewPacketHash: review.packetHash, originalResearchId: review.originalResearchId, field,
      technicalLinkage: applied.technicalLinkage, reasons: applied.reasons, classifications: review.meaningClaim.classification, exactModernSource: review.exactConditionalMeaningSource };
  } catch (e) { return { ...pending, reviewPacketHash: null, originalResearchId: null, field,
    technicalLinkage: "WITHHELD" as const, reasons: [e instanceof Error ? e.message : "CONDITIONAL_REVIEW_SOURCE_UNVERIFIED"] }; }
}
/** Consume a real native Foundation request. This new diagnostic adapter does
 * not call Planner/Writer, install an approval provider or change receipts. */
export async function adaptActualCalculationRequest(request: KnowledgeBindingRequest, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  offline(); const before = actualSemanticDigest(request), prepared = prepareActualFactContext(services.resolver, request, services.foundation.catalog);
  if (!prepared.ok) return { ok: false as const, reasons: prepared.reasons };
  const native = services.foundation.run(request);
  if (native.errors.length || !native.graphUnchanged || !native.catalogUnchanged || native.customerClaimsEmitted) return { ok: false as const, reasons: ["NATIVE_FOUNDATION_VERIFICATION_REQUIRED", ...native.errors] };
  const nativeBefore = actualSemanticDigest(native), attempts: ActualFactAttempt[] = [];
  const day = request.graph.nodes.find(n => n.fact.observationPointer === "/calculations/person/pillars/day/stem");
  if (day) attempts.push(await createActualDayMasterUnit(prepared.context, day.id));
  for (const spec of actualCalculationSpecs(request)) attempts.push(await createActualTenGodUnit(prepared.context, spec));
  const units = [...new Map(attempts.flatMap(a => a.ok ? [[a.unit.unitId, a.unit] as const] : [])).values()];
  const reviewLinks = [];
  for (const unit of units) reviewLinks.push(await linkConditionalReview(prepared.context, unit, request, services.resolver));
  const rootIds = [...new Set(units.flatMap(u => u.canonicalFactRoots))].sort();
  const handoff = { version: "actual-calculation-fact-handoff-v1" as const, fixtureId: request.graph.context.fixtureId,
    units, canonicalFactRoots: rootIds, rootReferenceOccurrences: units.reduce((n, u) => n + u.canonicalFactRoots.length, 0),
    nativeEvidenceLinks: units.map(u => ({ unitId: u.unitId, originalNodeId: u.originalEvidenceNodeId,
      nativeReceiptIds: native.after.filter(r => r.selectedActualEvidence.includes(u.originalEvidenceNodeId)).map(r => r.receiptId) })),
    conditionalMeaningLinks: reviewLinks, customerClaims: 0 as const, customerReaderBridge: 0 as const, customerApproval: 0 as const,
    syntheticMeaningDefinitionsUsed: 0 as const, newIndependentFacts: 0 as const, plannerChanged: false as const, writerChanged: false as const };
  if (before !== actualSemanticDigest(request) || nativeBefore !== actualSemanticDigest(native)) throw Error("ORIGINAL_GRAPH_PACKET_OR_NATIVE_RECEIPTS_CHANGED");
  return { ok: true as const, context: prepared.context, handoff, native, withheld: attempts.filter((a): a is Extract<ActualFactAttempt, { ok: false }> => !a.ok),
    originalGraphAndPacketUnchanged: true as const, originalNativeReceiptsUnchanged: true as const };
}
/** Same registered offline inputs, generator, profile producers and Graph as
 * the existing full-product actual fixture route; stop before customer prose. */
export async function runActualCalculationFixture(root: string, selection: { product: "major" | "annual"; id: string }, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  offline(); const bytes = readFileSync(join(root, FIXTURE_FILE));
  if (hash(bytes) !== readerSourcePins(root)[FIXTURE_FILE]) throw Error("ORIGINAL_ACTUAL_INPUT_FIXTURE_CHANGED");
  const fixtures = JSON.parse(bytes.toString()) as { product: string; id: string; payload: unknown; clock: V4ShadowClock }[];
  const fixture = fixtures.find(f => f.product === selection.product && f.id === selection.id);
  if (!fixture) throw Error("REGISTERED_ACTUAL_FIXTURE_REQUIRED");
  const generated = await generateV4ShadowReport(fixture.payload, fixture.clock);
  if (!generated.ok || generated.externalCalls?.length) return { ok: false as const, reasons: ["ACTUAL_OFFLINE_GENERATION_REQUIRED"] };
  const evidence = generated.evidencePacket as V4RuntimeEvidence, observed = observeActualProfiles(evidence);
  if (observed.failures.length) return { ok: false as const, reasons: observed.failures };
  const knowledge = services.foundation.catalog.evidence;
  const graphInput = { evidence, profiles: observed.profiles, context: { fixtureId: `fixture-${selection.product}-${selection.id}`, synthetic: true as const,
    evaluatedAt: evidence.generatedAt, owners: { person: `fixture-person-${selection.product}-${selection.id}` },
    catalogVersion: knowledge.versions.catalog, sourceVersion: knowledge.versions.source, semanticVersion: knowledge.versions.semantic } };
  const built = buildActualEvidenceGraph(graphInput, knowledge);
  if (!built.ok || !built.inputUnchanged || built.graph.relationship !== null) return { ok: false as const, reasons: ["ACTUAL_EVIDENCE_GRAPH_REQUIRED"] };
  const request: KnowledgeBindingRequest = { graph: built.graph, graphInput, product: built.graph.product, relationship: null,
    contexts: [], actualUserState: evidence.input.kind === "compatibility" ? {} : evidence.input.userContext };
  const result = await adaptActualCalculationRequest(request, services);
  return { ...result, request, inputSource: { file: FIXTURE_FILE, sha256: hash(bytes) },
    calculationHash: actualSemanticDigest(evidence.calculations), profilesHash: actualSemanticDigest(observed.profiles), birthCalendarRecalculationsInBridge: observed.birthCalendarRecalculations };
}
