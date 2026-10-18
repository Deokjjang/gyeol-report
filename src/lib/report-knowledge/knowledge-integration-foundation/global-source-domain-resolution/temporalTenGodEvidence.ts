import { HIDDEN_STEMS } from "../../../saju/constants";
import { STRUCTURE_VERSION } from "../../../interpretation-v4/structureTypes";
import { ANNUAL_MONTH_CALCULATION_VERSION } from "../../../report-knowledge/annualMonthJie";
import { SAJU_CALENDAR_VERSION, DAYUN_CALCULATION_VERSION } from "../../../saju/calendarVersion";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { evidenceHash } from "../actual-evidence-graph/graph";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
import { canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate } from "../knowledge-binder/types";
import type { ActualEvidenceNode, EvidenceTemporalWindow } from "../actual-evidence-graph/types";
import type { KnowledgeSourcePointer } from "../types";
import type { SourceProof } from "../source-verification/types";
import type { TemporalTenGodSourceContract, TemporalTenGodSourceResolver } from "./temporalTenGodSource";

export type TenGodOrigin = "NATAL_STEM" | "DAYUN_STEM" | "ANNUAL_STEM" | "MONTH_STEM" | "MONTH_BRANCH_MAIN" | "FLOW_GOD";
export type TenGodApplicationRequest = {
  nodeId: string; owner: string; origin: TenGodOrigin; god: string;
  referenceStem: string; targetStem: string; cycleIndex?: number;
  direction?: "A_TO_B" | "B_TO_A";
  window: EvidenceTemporalWindow | null;
};
export type TenGodCalculationContract = {
  status: "WITHHELD"; actualCalculation: "ACTUAL_CALCULATION_VERIFIED" | "UNVERIFIED_CALCULATION";
  producerSupported: boolean; temporalScopeValid: boolean;
  origin: TenGodOrigin; owner: string; referenceStem: string | null; targetStem: string | null;
  calculatedTenGod: string | null; referenceBasis: "NATAL_DAY_MASTER" | "DAYUN_STEM";
  producer: ActualEvidenceNode["producer"] | null;
  calculationSource: { file: string; symbol: string; fileSha256: string; versionBasis: "EXACT_FROZEN_SOURCE_HASH" } | null;
  sourceAncestry: ActualEvidenceNode["sources"]; supportingFactNodes: string[]; canonicalFactRoots: string[];
  effectiveInterval: EvidenceTemporalWindow | null; calculationObservationInterval: { start: string; endExclusive: string } | null; calculationCertainty: ActualEvidenceNode["certainty"];
  selectedYear: number | null; nominalAnnualPillar: string | null; effectiveAnnualPillar: string | null;
  meaningReview: "MEANING_REVIEW_REQUIRED"; customerApproval: "CUSTOMER_APPROVAL_PENDING";
  reasons: string[]; newIndependentFacts: 0; graphAndPacketUnchanged: boolean;
};
const same = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);
function authenticNode(n: ActualEvidenceNode): boolean {
  const identity = [n.kind, n.owner.fixtureOwnerId, n.producer, n.fact.producerEvidenceId ?? n.fact.observationPointer, n.participants, n.direction, n.temporal];
  if (n.id !== `aeg:node:${evidenceHash(identity)}`) return false;
  if (!n.fact.rootId) return true;
  const originalIdentity = n.fact.producerEvidenceId ?? (n.kind === "CALCULATED_NATAL_FACT" && n.participants.length ? ["natal-participants", n.participants] : n.fact.observationPointer);
  return n.fact.rootId === `aeg:root:${evidenceHash([n.owner.fixtureOwnerId, n.producer, originalIdentity, n.participants, n.temporal, n.direction, n.value])}`;
}
/** Verify already calculated packet values. Never call a ten-god/calendar
 * calculator, issue a node/root, or substitute a nominal annual pillar. */
export function verifyTemporalTenGodCalculation(resolver: TemporalTenGodSourceResolver, request: KnowledgeBindingRequest, spec: TenGodApplicationRequest): TenGodCalculationContract {
  const before = evidenceHash([request.graph, request.graphInput.evidence]);
  const out: TenGodCalculationContract = { status: "WITHHELD", actualCalculation: "UNVERIFIED_CALCULATION",
    producerSupported: false, temporalScopeValid: false, origin: spec.origin, owner: spec.owner,
    referenceStem: null, targetStem: null, calculatedTenGod: null,
    referenceBasis: spec.origin === "FLOW_GOD" ? "DAYUN_STEM" : "NATAL_DAY_MASTER",
    producer: null, calculationSource: null, sourceAncestry: [], supportingFactNodes: [], canonicalFactRoots: [], effectiveInterval: null, calculationObservationInterval: null,
    calculationCertainty: "unknown", selectedYear: null, nominalAnnualPillar: null, effectiveAnnualPillar: null,
    meaningReview: "MEANING_REVIEW_REQUIRED", customerApproval: "CUSTOMER_APPROVAL_PENDING",
    reasons: [], newIndependentFacts: 0, graphAndPacketUnchanged: true };
  try {
    const { contentDigest, ...body } = request.graphInput.evidence;
    if (v4Digest(body) !== contentDigest || !same(request.graph.context, request.graphInput.context)
      || request.graph.version !== "actual-evidence-graph-v1" || !request.graph.validation.ok
      || request.product !== request.graph.product || request.relationship !== request.graph.relationship)
      throw Error("ORIGINAL_PACKET_GRAPH_CONTEXT_REQUIRED");
    const n = request.graph.nodes.find(n => n.id === spec.nodeId);
    if (!n || !authenticNode(n) || !n.ancestry.complete || n.ancestry.cycle || !n.ancestry.rootIds.length)
      throw Error("CANONICAL_ACTUAL_FACT_ANCESTRY_REQUIRED");
    if (spec.direction || n.direction || n.owner.fixtureOwnerId !== spec.owner || request.graph.context.owners[n.owner.slot as "person"] !== spec.owner)
      throw Error("WRONG_OWNER_OR_DIRECTION");
    const ancestors = new Map(request.graph.nodes.map(x => [x.id, x])), seen = new Set<string>();
    const visit = (id: string) => {
      if (seen.has(id)) return; seen.add(id); const parent = ancestors.get(id);
      if (!parent || !authenticNode(parent) || !parent.ancestry.complete || parent.ancestry.cycle
        || parent.owner.fixtureOwnerId !== spec.owner || parent.sources.some(s => s.state !== "VERIFIED"))
        throw Error("MISSING_OR_INVALID_ACTUAL_ANCESTOR");
      parent.ancestry.parentIds.forEach(visit);
    };
    n.ancestry.parentIds.forEach(visit);
    const roots = [...seen, n.id].map(id => ancestors.get(id)!).flatMap(x => x.fact.rootId ? [x.fact.rootId] : []);
    if (!same([...new Set(roots)].sort(), [...new Set(n.ancestry.rootIds)].sort())) throw Error("CANONICAL_ROOT_SET_MISMATCH");
    const slot = n.owner.slot;
    if (!["person", "personA", "personB"].includes(slot)) throw Error("ACTUAL_PERSON_OWNER_REQUIRED");
    const calculation = request.graphInput.evidence.calculations[slot as "person"];
    if (!calculation || calculation.calculationVersion !== SAJU_CALENDAR_VERSION || calculation.dayMaster !== calculation.pillars.day.stem)
      throw Error("NATAL_REFERENCE_STEM_REQUIRED");
    const c = request.graphInput.evidence.composition, value = isRecord(n.value) ? n.value : {}, pointer = n.fact.observationPointer;
    let god: string | null = null, target: string | null = null, reference: string = calculation.dayMaster;
    let producerFile = "", producerSymbol = "", version = "", calculationFile = "", calculationSymbol = "";
    if (spec.origin === "NATAL_STEM") {
      const m = /^\/calculationObservations\/(person|personA|personB)\/structureAtoms\/(year|month|hour):visible:([^:]+)$/.exec(pointer);
      if (!m || m[1] !== slot || n.kind !== "CALCULATED_NATAL_FACT" || value.location !== "visible") throw Error("EXISTING_NATAL_STEM_OBSERVATION_REQUIRED");
      const position = m[2] as "year" | "month" | "hour", pillar = calculation.pillars[position];
      target = pillar?.stem ?? null; god = calculation.tenGods.stems[position] ?? null;
      if (!pillar || !god || value.god !== god || value.stem !== target || value.position !== position
        || !n.participants.some(p => p.owner === spec.owner && p.position === position && p.value === target)) throw Error("NATAL_GOD_OR_PARTICIPANT_MISMATCH");
      producerFile = "src/lib/interpretation-v4/strength.ts"; producerSymbol = "collectStructureAtoms"; version = STRUCTURE_VERSION;
      calculationFile = "src/lib/saju/tenGods.ts"; calculationSymbol = "getTenGod";
    } else if (c.product === "major_fortune") {
      const e = c.result.evidence;
      if (e.years.length !== 14 || e.horizon.from !== e.currentYear - 3 || e.horizon.through !== e.currentYear + 10)
        throw Error("ORIGINAL_FOURTEEN_YEAR_CONTRACT_REQUIRED");
      if (spec.origin === "DAYUN_STEM") {
        const row = e.horizon.rows.find(y => y.cycle.index === spec.cycleIndex), cycle = row?.cycle;
        if (!cycle || n.kind !== "CALCULATED_PERIOD_FACT" || pointer !== `/composition/result/evidence/horizon/cycles/${cycle.index}`
          || cycle.endYear - cycle.startYear !== 9 || value.cycleIndex !== cycle.index || value.ganji !== cycle.ganji || value.tenGod !== cycle.tenGod)
          throw Error("ORIGINAL_DAYUN_CYCLE_REQUIRED");
        target = cycle.ganji[0]; god = cycle.tenGod;
        producerFile = "src/lib/saju/customerDayun.ts"; producerSymbol = "calculateCustomerDayun"; version = DAYUN_CALCULATION_VERSION;
        if (e.dayunSelection?.calculationVersion !== version) throw Error("UNSUPPORTED_DAYUN_PRODUCER_VERSION");
        calculationFile = "src/lib/report-knowledge/majorFortuneDecadeReading.ts"; calculationSymbol = "buildMajorFortuneDecadeReading";
      } else if (spec.origin === "ANNUAL_STEM") {
        const m = /^\/composition\/result\/evidence\/years\/(\d+)\/annual\/evidenceIds\/1$/.exec(pointer), y = m ? e.years[Number(m[1])] : null;
        if (!y || n.kind !== "EDITORIAL_PROOF_OBSERVATION" || value.year !== y.year || value.tenGod !== y.annual.tenGod || n.fact.producerEvidenceId !== y.annual.evidenceIds[1])
          throw Error("ORIGINAL_MAJOR_ANNUAL_OBSERVATION_REQUIRED");
        target = y.annual.ganji[0]; god = y.annual.tenGod; out.selectedYear = y.year; out.nominalAnnualPillar = y.annual.ganji;
        producerFile = "src/lib/report-knowledge/majorFortuneDecadeReading.ts"; producerSymbol = "buildMajorFortuneDecadeReading"; version = "major-decade-v2";
        calculationFile = producerFile; calculationSymbol = producerSymbol;
      } else throw Error("UNSUPPORTED_PERIOD_ROLE_FOR_MAJOR_PACKET");
    } else if (c.product === "annual_fortune") {
      const e = c.result.evidence, m = /^\/composition\/result\/evidence\/raw\/calendarMonths\/(\d+)\/segments\/(\d+)\/evidenceIds\/(\d+)$/.exec(pointer);
      const s = m ? e.raw.calendarMonths?.[Number(m[1])]?.segments[Number(m[2])] : null;
      if (!m || !s || n.kind !== "CALCULATED_PERIOD_FACT" || n.fact.producerEvidenceId !== s.evidenceIds[Number(m[3])]
        || n.temporal?.start !== s.startKst || n.temporal.endExclusive !== s.endKstExclusive || e.raw.dayMaster !== reference)
        throw Error("EXACT_ORIGINAL_SEGMENT_REQUIRED");
      out.selectedYear = e.selectedYear; out.nominalAnnualPillar = e.raw.annualGanji.stem + e.raw.annualGanji.branch; out.effectiveAnnualPillar = s.effectiveAnnualPillar.stem + s.effectiveAnnualPillar.branch;
      // Existing cross-period observations can span several monthly segments.
      // Require containment AND the same effective annual/cycle context; retain
      // both intervals and never widen the segment into the cross-period/year.
      const cross = e.crossPeriods.filter(p => Date.parse(p.startKst) <= Date.parse(s.startKst)
        && Date.parse(p.endKstExclusive) >= Date.parse(s.endKstExclusive)
        && same(p.segment.effectiveAnnualPillar, s.effectiveAnnualPillar)
        && same(p.segment.activeDayunContext, s.activeDayunContext));
      if (spec.origin === "MONTH_STEM" || spec.origin === "MONTH_BRANCH_MAIN") {
        if (Number(m[3]) !== 3 || !same(value, { component: "ten_gods", stemTenGod: s.stemTenGod, branchTenGod: s.branchTenGod })) throw Error("EXACT_MONTH_TEN_GOD_COMPONENT_REQUIRED");
        target = spec.origin === "MONTH_STEM" ? s.monthPillar.stem : HIDDEN_STEMS[s.monthPillar.branch][0].stem;
        god = spec.origin === "MONTH_STEM" ? s.stemTenGod : s.branchTenGod;
        calculationFile = "src/lib/report-knowledge/annualMonthJie.ts"; calculationSymbol = "buildAnnualMonthCalendar";
      } else {
        if (cross.length !== 1) throw Error("EXACT_CROSS_PERIOD_OBSERVATION_REQUIRED");
        out.calculationObservationInterval = { start: cross[0].startKst, endExclusive: cross[0].endKstExclusive };
        if (spec.origin === "ANNUAL_STEM") {
          if (Number(m[3]) !== 1 || !same(value, { component: "annual", effectiveAnnualPillar: s.effectiveAnnualPillar })) throw Error("EFFECTIVE_ANNUAL_COMPONENT_REQUIRED");
          target = s.effectiveAnnualPillar.stem; god = cross[0].annualGod;
        } else {
          if (Number(m[3]) !== 2 || !same(value, { component: "dayun", activeDayunContext: s.activeDayunContext })) throw Error("EXACT_DAYUN_COMPONENT_REQUIRED");
          const cycles = cross[0].cycles.filter(x => x.cycle.index === spec.cycleIndex && s.activeDayunContext.cycles.some(y => y.index === x.cycle.index && y.ganji === x.cycle.ganji));
          if (cycles.length !== 1) throw Error("EXACT_ACTIVE_CYCLE_REQUIRED");
          if (spec.origin === "FLOW_GOD") { reference = cycles[0].cycle.stem; target = s.effectiveAnnualPillar.stem; god = cycles[0].flowGod; }
          else if (spec.origin === "DAYUN_STEM") { target = cycles[0].cycle.stem; god = cycles[0].god; }
          else throw Error("UNSUPPORTED_PERIOD_ROLE");
        }
        calculationFile = "src/lib/interpretation-v4/annualEvidence.ts"; calculationSymbol = "annualNarrativeEvidence";
      }
      producerFile = "src/lib/report-knowledge/annualMonthJie.ts"; producerSymbol = "buildAnnualMonthCalendar"; version = ANNUAL_MONTH_CALCULATION_VERSION;
      if (e.raw.monthlyCalculationVersion !== version) throw Error("UNSUPPORTED_MONTH_PRODUCER_VERSION");
    } else throw Error("UNSUPPORTED_TEMPORAL_PACKET");
    if (!version || !same(n.producer, { file: producerFile, symbol: producerSymbol, version, system: spec.origin === "NATAL_STEM" ? "myeongli" : c.product === "major_fortune" ? spec.origin === "DAYUN_STEM" ? "dayun" : "major" : "annual-month" }))
      throw Error("ACTUAL_PRODUCER_IDENTITY_VERSION_MISMATCH");
    const supporting = [n];
    if (spec.origin !== "FLOW_GOD") {
      const referenceNode = request.graph.nodes.find(x => x.owner.fixtureOwnerId === spec.owner
        && x.fact.observationPointer === `/calculations/${slot}/pillars/day/stem`);
      if (!referenceNode || !isRecord(referenceNode.value) || referenceNode.value.value !== reference
        || referenceNode.kind !== "CALCULATED_NATAL_FACT" || referenceNode.producer.symbol !== "calculateSaju"
        || referenceNode.producer.version !== SAJU_CALENDAR_VERSION) throw Error("ACTUAL_REFERENCE_STEM_ROOT_REQUIRED");
      visit(referenceNode.id); supporting.push(referenceNode);
    } else {
      const targetNode = request.graph.nodes.find(x => x.owner.fixtureOwnerId === spec.owner
        && x.fact.observationPointer === pointer.replace(/evidenceIds\/2$/, "evidenceIds/1"));
      if (!targetNode || !isRecord(targetNode.value) || !isRecord(targetNode.value.effectiveAnnualPillar)
        || targetNode.value.effectiveAnnualPillar.stem !== target || !same(targetNode.temporal, n.temporal)
        || !same(targetNode.producer, n.producer)) throw Error("ACTUAL_FLOW_ANNUAL_TARGET_ROOT_REQUIRED");
      visit(targetNode.id); supporting.push(targetNode);
    }
    for (const file of [producerFile, calculationFile, ...supporting.map(x => x.producer.file), "src/lib/report-knowledge/annualFortuneYearRules.ts", ...(spec.origin === "MONTH_BRANCH_MAIN" ? ["src/lib/saju/constants.ts"] : [])]) {
      const expected = resolver.frozen.get(file); resolver.reader.text(file);
      if (!expected || resolver.reader.files.get(file) !== expected) throw Error("CALCULATION_SOURCE_HASH_MISMATCH");
    }
    // The native enum and the period producer's Korean labels have different
    // encodings. Preserve that encoding here; no ten-god relation is recalculated.
    if (!god || god !== spec.god || reference !== spec.referenceStem || target !== spec.targetStem) throw Error("REFERENCE_TARGET_OR_TEN_GOD_MISMATCH");
    out.actualCalculation = "ACTUAL_CALCULATION_VERIFIED"; out.producerSupported = true;
    out.referenceStem = reference; out.targetStem = target; out.calculatedTenGod = god;
    out.producer = n.producer; out.calculationSource = { file: calculationFile, symbol: calculationSymbol, fileSha256: resolver.frozen.get(calculationFile)!, versionBasis: "EXACT_FROZEN_SOURCE_HASH" };
    out.sourceAncestry = supporting.flatMap(x => x.sources); out.supportingFactNodes = [...new Set(supporting.map(x => x.id))].sort();
    out.canonicalFactRoots = [...new Set(supporting.flatMap(x => x.ancestry.rootIds))].sort();
    out.effectiveInterval = n.temporal; out.calculationCertainty = n.certainty;
    if (spec.origin === "NATAL_STEM") {
      out.temporalScopeValid = spec.window === null && n.temporal === null;
    } else if (spec.window && n.temporal && spec.window.scope === n.temporal.scope) {
      const intersection = intersectEvidencePeriods([spec.window, n.temporal]);
      out.temporalScopeValid = intersection.state === "CONFIRMED_INTERSECTION"
        && Date.parse(intersection.start!) === Date.parse(spec.window.start!) && Date.parse(intersection.endExclusive!) === Date.parse(spec.window.endExclusive!);
    }
    if (!out.temporalScopeValid) out.reasons.push("UNKNOWN_CONDITIONAL_OR_OUTSIDE_EFFECTIVE_INTERVAL");
    out.reasons.push(...n.blockers.map(b => b.code));
  } catch (e) { out.reasons.push(e instanceof Error ? e.message : "UNVERIFIED_CALCULATION"); }
  out.reasons = [...new Set([...out.reasons, "MEANING_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"])].sort();
  out.graphAndPacketUnchanged = before === evidenceHash([request.graph, request.graphInput.evidence]);
  return out;
}
/** Bind with the unchanged twelve-gate engine, then attach independent source
 * and calculation diagnostics. Neither proof changes its native decision. */
export async function bindTemporalTenGodSource(resolver: TemporalTenGodSourceResolver, candidate: KnowledgeCandidate, request: KnowledgeBindingRequest, catalog: KnowledgeBinderCatalog, spec: TenGodApplicationRequest) {
  const original = bindKnowledgeCandidate(candidate, new ActualBindingIndex(request, catalog), catalog);
  const raw = catalog.raw.get(candidate.record.catalogKey), inherited = raw?.inheritedRole;
  let source: TemporalTenGodSourceContract | null = null, inheritedSourceProof: SourceProof | null = null;
  if (isRecord(inherited) && typeof inherited.originalId === "string" && typeof inherited.file === "string"
    && typeof inherited.recordSha256 === "string" && typeof inherited.sourceVersion === "string") {
    const records = resolver.records.filter(r => r.originalId === inherited.originalId && r.locator.file === inherited.file);
    if (records.length === 1 && inherited.exportName === records[0].locator.exportName) {
      try {
        // The major research already declares this exact original pointer,
        // record hash and edition. Never infer the ancestor from a god label.
        const inheritedProof = await resolver.proof(inherited as KnowledgeSourcePointer, inherited.originalId, records[0].catalogKey);
        const proof = await resolver.temporalContract(records[0]);
        if (proof.originalRecordHash === inherited.recordSha256) { source = proof; inheritedSourceProof = inheritedProof; }
      } catch { /* Keep the original source gate and the missing proof. */ }
    }
  }
  const calculation = verifyTemporalTenGodCalculation(resolver, request, spec);
  const god = raw?.god;
  if (typeof god !== "string" || source?.originalResearchId !== `tr:god:${god}` || spec.origin === "FLOW_GOD" || spec.origin === "NATAL_STEM" || god !== calculation.calculatedTenGod) {
    calculation.reasons.push("CONDITIONAL_RESEARCH_ROLE_OR_GOD_NOT_VERIFIED");
  }
  return { status: "WITHHELD" as const, originalBindingReceipt: original, source, inheritedSourceProof, calculation,
    meaningReview: "MEANING_REVIEW_REQUIRED" as const, customerApproval: "CUSTOMER_APPROVAL_PENDING" as const,
    customerApproved: false as const, customerClaims: 0 as const, newIndependentFacts: 0 as const };
}
