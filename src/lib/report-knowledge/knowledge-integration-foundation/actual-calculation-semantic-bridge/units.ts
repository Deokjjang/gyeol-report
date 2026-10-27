import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import { buildActualEvidenceGraph } from "../actual-evidence-graph/engine";
import { observeActualProfiles } from "../actual-evidence-graph/producers";
import { isReadableSajuCalendarVersion } from "../../../saju/calendarVersion";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { TEMPORAL_DEFINITION_IDS, type TemporalGod, type TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { verifyTemporalTenGodCalculation, type TenGodApplicationRequest, type TenGodOrigin, type TenGodCalculationContract } from "../global-source-domain-resolution/temporalTenGodEvidence";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { ActualEvidenceNode, EvidenceTemporalWindow, EvidenceAncestry } from "../actual-evidence-graph/types";
import type { SourceProof } from "../source-verification/types";

export const ACTUAL_SEMANTIC_UNIT_VERSION = "actual-calculation-semantic-unit-v1" as const;
const digest = (v: unknown) => hash(canonicalJson(v));
const definitionFile = "src/lib/report-knowledge/sajuFoundationKnowledge.ts";
export type ActualFactContext = Readonly<{ fixtureId: string; product: "major_fortune" | "annual_fortune"; graphHash: string; evidenceHash: string }>;
export type ActualCalculatedSemanticUnit = {
  version: typeof ACTUAL_SEMANTIC_UNIT_VERSION; unitId: string; evidenceKind: "VERIFIED_CALCULATED_FACT";
  factType: "NATAL_DAY_MASTER" | "TEN_GOD_RELATION"; originalEvidenceNodeId: string;
  originalEvidenceKind: ActualEvidenceNode["kind"]; originalProducer: ActualEvidenceNode["producer"]; producerVersion: string;
  sourceIdentity: string; sourceHash: string; sourceVersion: string; sourceProof: SourceProof;
  producerSources: { file: string; sha256: string }[];
  calculationSource: NonNullable<TenGodCalculationContract["calculationSource"]>;
  canonicalFactRoot: string | null; canonicalFactRoots: string[];
  completeAncestry: { complete: true; original: EvidenceAncestry; nodes: { nodeId: string; producer: ActualEvidenceNode["producer"]; ancestry: EvidenceAncestry; factRoot: string | null }[] };
  owner: ActualEvidenceNode["owner"]; direction: ActualEvidenceNode["direction"];
  referenceStem: string; targetStem: string; calculatedTenGod: string | null; definitionLabel: string;
  referenceBasis: "NATAL_DAY_MASTER" | "DAYUN_STEM"; originLayer: TenGodOrigin;
  temporalScope: "natal" | "dayun" | "annual" | "month";
  effectiveInterval: EvidenceTemporalWindow | null; calculationCertainty: "confirmed";
  nominalAnnualPillar: string | null; effectiveAnnualPillar: string | null;
  supportedMeaningScope: "CALCULATED_STEM_IDENTITY_ONLY" | "CALCULATED_TEN_GOD_RELATION_ONLY";
  requiredContext: { interpretation: "SEPARATE_NATAL_ELEMENT_AND_ACTUAL_CONTEXT_REQUIRED"; observedPersonalEvents: 0 };
  prohibitedInference: readonly string[];
  customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING"; meaningReview: "MEANING_REVIEW_REQUIRED"; productReview: "PRODUCT_REVIEW_REQUIRED";
  calculationVerified: true; sourceDefinitionVerified: true; customerApproved: false; customerClaims: 0; newIndependentFacts: 0;
  originalGraphNodeStatus: ActualEvidenceNode["status"]; originalBlockers: ActualEvidenceNode["blockers"];
  calculationWitness: TenGodApplicationRequest | null;
};
export type ActualFactAttempt = { ok: true; unit: ActualCalculatedSemanticUnit } | {
  ok: false; evidenceKind: "UNVERIFIED_CALCULATED_FACT"; originalEvidenceNodeId: string; originLayer: TenGodOrigin; reasons: string[]; unitIssued: false;
};
type VerifiedInput = { resolver: TemporalTenGodSourceResolver; request: KnowledgeBindingRequest; nodes: Map<string, ActualEvidenceNode> };
const contexts = new WeakMap<ActualFactContext, VerifiedInput>();
function freeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ACTUAL_CALCULATION_BRIDGE_OFFLINE_ONLY"); }
/** Recompile the existing Graph from the unchanged packet and original profile
 * producers. A caller's validation/verified/status flags are not authority. */
export function prepareActualFactContext(resolver: TemporalTenGodSourceResolver, request: KnowledgeBindingRequest, catalog: KnowledgeBinderCatalog) {
  offline();
  try {
    if (!["major_fortune", "annual_fortune"].includes(request.product) || request.relationship !== null) throw Error("SUPPORTED_ACTUAL_TEMPORAL_PRODUCT_REQUIRED");
    const { contentDigest, ...body } = request.graphInput.evidence;
    if (v4Digest(body) !== contentDigest) throw Error("ORIGINAL_EVIDENCE_PACKET_DIGEST_REQUIRED");
    const profiles = observeActualProfiles(request.graphInput.evidence);
    if (profiles.failures.length || digest(profiles.profiles) !== digest(request.graphInput.profiles)) throw Error("ORIGINAL_PROFILE_PROJECTION_REQUIRED");
    const rebuilt = buildActualEvidenceGraph(request.graphInput, catalog.evidence);
    if (!rebuilt.ok || !rebuilt.inputUnchanged || digest(rebuilt.graph) !== digest(request.graph)
      || digest(request.graph.context) !== digest(request.graphInput.context)) throw Error("EXACT_REBUILT_ACTUAL_GRAPH_REQUIRED");
    const snapshot = structuredClone(request);
    const context = freeze({ fixtureId: snapshot.graph.context.fixtureId, product: snapshot.product as ActualFactContext["product"],
      graphHash: digest(snapshot.graph), evidenceHash: digest(snapshot.graphInput.evidence) });
    contexts.set(context, { resolver, request: snapshot, nodes: new Map(snapshot.graph.nodes.map(n => [n.id, n])) });
    return { ok: true as const, context, reasons: [] as string[] };
  } catch (e) { return { ok: false as const, reasons: [e instanceof Error ? e.message : "ACTUAL_FACT_CONTEXT_UNVERIFIED"] }; }
}
async function definition(input: VerifiedInput, god: string | null, stem?: string) {
  const ids = god === null ? [`foundation:day_master:${stem}`] : Object.values(TEMPORAL_DEFINITION_IDS);
  for (const id of ids) {
    const records = input.resolver.records.filter(r => r.originalId === id && r.kind === "SOURCE_KNOWLEDGE" && r.locator.file === definitionFile && r.locator.exportName === "SAJU_FOUNDATION_KNOWLEDGE");
    if (records.length !== 1) throw Error("EXACT_FOUNDATION_DEFINITION_REQUIRED");
    const record = records[0], raw = await input.resolver.record(record);
    if (!isRecord(raw) || !Array.isArray(raw.aliases) || typeof raw.labelKo !== "string" || !isRecord(raw.definition)
      || !isRecord(raw.support) || !Array.isArray(raw.support.calculationRefs)) throw Error("DEFINITION_IDENTITY_AND_CALCULATION_SUPPORT_REQUIRED");
    if (god !== null && !raw.aliases.includes(god)) continue;
    if (god === null ? raw.category !== "day_master" || raw.key !== stem || !raw.support.calculationRefs.includes("SajuCalcResult.dayMaster")
      : raw.category !== "ten_god" || !raw.support.calculationRefs.includes("getTenGod") || TEMPORAL_DEFINITION_IDS[raw.labelKo as TemporalGod] !== id)
      throw Error("EXACT_DEFINITION_RELATION_REQUIRED");
    const proof = await input.resolver.proof(record.locator, id, record.catalogKey);
    return { proof, label: raw.labelKo };
  }
  throw Error("NO_DECLARED_TEN_GOD_ALIAS");
}
function ancestry(input: VerifiedInput, supportingNodeIds: readonly string[]) {
  const seen = new Set<string>(), roots = new Set<string>(), stack = [...supportingNodeIds];
  while (stack.length) {
    const id = stack.pop()!; if (seen.has(id)) continue; seen.add(id);
    const n = input.nodes.get(id);
    if (!n || !n.ancestry.complete || n.ancestry.cycle || n.ancestry.missingIds.length
      || n.owner.fixtureOwnerId !== input.nodes.get(supportingNodeIds[0])?.owner.fixtureOwnerId || n.direction)
      throw Error("COMPLETE_SAME_OWNER_ANCESTRY_REQUIRED");
    if (n.certainty !== "confirmed" || n.temporal && (n.temporal.certainty !== "confirmed" || !n.temporal.start || !n.temporal.endExclusive
      || Date.parse(n.temporal.start) >= Date.parse(n.temporal.endExclusive))) throw Error("CONFIRMED_ANCESTRY_INTERVAL_REQUIRED");
    if (n.blockers.some(b => b.code !== "UNADDRESSABLE_PRODUCER_OBSERVATION") || n.sources.some(s => s.state !== "VERIFIED")) throw Error("ACTUAL_ANCESTOR_SOURCE_OR_PRODUCER_HELD");
    if (n.fact.rootId) roots.add(n.fact.rootId);
    for (const source of n.sources) {
      input.resolver.reader.text(source.file);
      if (source.fileSha256 !== input.resolver.frozen.get(source.file) || source.fileSha256 !== input.resolver.reader.files.get(source.file)) throw Error("ACTUAL_ANCESTOR_SOURCE_HASH_MISMATCH");
    }
    stack.push(...n.ancestry.parentIds);
  }
  const nodes = [...seen].sort().map(id => input.nodes.get(id)!);
  if (supportingNodeIds.some(id => input.nodes.get(id)!.ancestry.rootIds.some(root => !roots.has(root)))) throw Error("ORIGINAL_ROOT_SET_REQUIRED");
  return { nodes, roots: [...roots].sort() };
}
function blocked(nodeId: string, originLayer: TenGodOrigin, e: unknown): ActualFactAttempt {
  return { ok: false, evidenceKind: "UNVERIFIED_CALCULATED_FACT", originalEvidenceNodeId: nodeId, originLayer,
    reasons: [e instanceof Error ? e.message : String(e)], unitIssued: false };
}
async function produce(context: ActualFactContext, nodeId: string, spec: TenGodApplicationRequest | null): Promise<ActualFactAttempt> {
  offline();
  const origin = spec?.origin ?? "NATAL_STEM";
  try {
    const input = contexts.get(context); if (!input) throw Error("AUTHENTIC_ACTUAL_FACT_CONTEXT_REQUIRED");
    const n = input.nodes.get(nodeId);
    if (!n || !["CALCULATED_NATAL_FACT", "CALCULATED_PERIOD_FACT"].includes(n.kind)) throw Error("DIRECT_CALCULATED_NODE_REQUIRED");
    let reference: string, target: string, god: string | null = null, nominal: string | null = null, effective: string | null = null;
    let support: string[], calculationFile: string, calculationSource: ActualCalculatedSemanticUnit["calculationSource"], basis: ActualCalculatedSemanticUnit["referenceBasis"] = "NATAL_DAY_MASTER";
    if (spec) {
      const keys = ["nodeId", "owner", "origin", "god", "referenceStem", "targetStem", "cycleIndex", "direction", "window"];
      if (Object.keys(spec).some(key => !keys.includes(key))) throw Error("UNEXPECTED_CALCULATION_REQUEST_FIELD");
      if (!["NATAL_STEM", "DAYUN_STEM", "ANNUAL_STEM", "MONTH_STEM", "MONTH_BRANCH_MAIN", "FLOW_GOD"].includes(spec.origin)
        || spec.direction !== undefined || spec.cycleIndex !== undefined && (!["DAYUN_STEM", "FLOW_GOD"].includes(spec.origin) || !Number.isInteger(spec.cycleIndex)))
        throw Error("EXACT_ORIGIN_CYCLE_AND_DIRECTION_REQUIRED");
      const c = verifyTemporalTenGodCalculation(input.resolver, input.request, spec);
      if (c.actualCalculation !== "ACTUAL_CALCULATION_VERIFIED" || !c.producerSupported || !c.temporalScopeValid || !c.graphAndPacketUnchanged)
        throw Error("ACTUAL_SCOPED_CALCULATION_REQUIRED:" + c.reasons.join("|"));
      if (!c.referenceStem || !c.targetStem || !c.calculatedTenGod || !c.calculationSource || digest(spec.window) !== digest(n.temporal)) throw Error("ORIGINAL_EXACT_INTERVAL_REQUIRED");
      reference = c.referenceStem; target = c.targetStem; god = c.calculatedTenGod; support = c.supportingFactNodes;
      calculationSource = c.calculationSource; calculationFile = c.calculationSource.file; nominal = c.nominalAnnualPillar; effective = c.effectiveAnnualPillar; basis = c.referenceBasis;
    } else {
      const calc = input.request.graphInput.evidence.calculations.person, confirmed = calc.birthTimeContext?.confirmed.day;
      if (n.fact.observationPointer !== "/calculations/person/pillars/day/stem" || n.owner.slot !== "person" || n.temporal !== null || n.direction !== null
        || !isRecord(n.value) || n.value.value !== calc.dayMaster || n.value.isDayMaster !== true || calc.pillars.day.stem !== calc.dayMaster
        || confirmed?.stem !== calc.dayMaster || n.producer.file !== "src/lib/saju/calculateSaju.ts" || n.producer.symbol !== "calculateSaju"
        || n.producer.version !== calc.calculationVersion || !isReadableSajuCalendarVersion(calc.calculationVersion)) throw Error("EXACT_ACTUAL_DAY_MASTER_REQUIRED");
      reference = calc.dayMaster; target = calc.dayMaster; support = [n.id]; calculationFile = n.producer.file;
      calculationSource = { file: n.producer.file, symbol: n.producer.symbol, fileSha256: input.resolver.frozen.get(n.producer.file)!, versionBasis: "EXACT_FROZEN_SOURCE_HASH" };
    }
    const a = ancestry(input, support);
    const originalRoots = [...new Set(support.flatMap(id => input.nodes.get(id)!.ancestry.rootIds))].sort();
    if (digest(a.roots) !== digest(originalRoots) || !a.roots.length) throw Error("CANONICAL_ROOT_ANCESTRY_MISMATCH");
    const producerSources = [...new Set([calculationFile, ...a.nodes.map(n => n.producer.file), ...a.nodes.flatMap(n => n.sources.map(s => s.file)), ...(spec ? ["src/lib/report-knowledge/annualFortuneYearRules.ts"] : []), ...(spec?.origin === "MONTH_BRANCH_MAIN" ? ["src/lib/saju/constants.ts"] : [])])].sort().map(file => {
      input.resolver.reader.text(file); const sha256 = input.resolver.reader.files.get(file)!;
      if (sha256 !== input.resolver.frozen.get(file)) throw Error("ACTUAL_PRODUCER_SOURCE_HASH_MISMATCH");
      return { file, sha256 };
    });
    const source = await definition(input, god, target);
    const temporalScope = n.temporal?.scope ?? "natal";
    if (temporalScope === "input" || temporalScope === "UNKNOWN") throw Error("SUPPORTED_CALCULATED_TEMPORAL_SCOPE_REQUIRED");
    const body: Omit<ActualCalculatedSemanticUnit, "unitId"> = {
      version: ACTUAL_SEMANTIC_UNIT_VERSION, evidenceKind: "VERIFIED_CALCULATED_FACT", factType: spec ? "TEN_GOD_RELATION" : "NATAL_DAY_MASTER",
      originalEvidenceNodeId: n.id, originalEvidenceKind: n.kind, originalProducer: n.producer, producerVersion: n.producer.version,
      sourceIdentity: source.proof.originalId!, sourceHash: source.proof.actualHash, sourceVersion: source.proof.sourceVersion, sourceProof: source.proof,
      producerSources, calculationSource, canonicalFactRoot: n.fact.rootId, canonicalFactRoots: a.roots,
      completeAncestry: { complete: true, original: n.ancestry, nodes: a.nodes.map(x => ({ nodeId: x.id, producer: x.producer, ancestry: x.ancestry, factRoot: x.fact.rootId })) },
      owner: n.owner, direction: n.direction, referenceStem: reference, targetStem: target, calculatedTenGod: god, definitionLabel: source.label,
      referenceBasis: basis, originLayer: origin, temporalScope,
      effectiveInterval: n.temporal, calculationCertainty: "confirmed", nominalAnnualPillar: nominal, effectiveAnnualPillar: effective,
      supportedMeaningScope: spec ? "CALCULATED_TEN_GOD_RELATION_ONLY" : "CALCULATED_STEM_IDENTITY_ONLY",
      requiredContext: { interpretation: "SEPARATE_NATAL_ELEMENT_AND_ACTUAL_CONTEXT_REQUIRED", observedPersonalEvents: 0 },
      prohibitedInference: ["조건부 생활 조언을 계산 사실로 전환 금지", "미입력 소득·직업·권한·경험·미래 사건 생성 금지", "원국 일간 기준과 대운간 기준 십성 교환 금지", "명목 연주를 실효 연주로 교환 금지", "계산·Source 검증을 의미·상품·고객 승인으로 전환 금지"],
      customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING", meaningReview: "MEANING_REVIEW_REQUIRED", productReview: "PRODUCT_REVIEW_REQUIRED",
      calculationVerified: true, sourceDefinitionVerified: true, customerApproved: false, customerClaims: 0, newIndependentFacts: 0,
      originalGraphNodeStatus: n.status, originalBlockers: n.blockers, calculationWitness: spec,
    };
    return { ok: true, unit: freeze(structuredClone({ ...body, unitId: `actual-semantic-unit:v1:${v4Digest(body)}` })) };
  } catch (e) { return blocked(nodeId, origin, e); }
}
export function createActualTenGodUnit(context: ActualFactContext, spec: TenGodApplicationRequest) { return produce(context, spec.nodeId, spec); }
export function createActualDayMasterUnit(context: ActualFactContext, nodeId: string) { return produce(context, nodeId, null); }
export async function validateActualCalculatedUnit(context: ActualFactContext, candidate: ActualCalculatedSemanticUnit) {
  const actual = candidate.factType === "NATAL_DAY_MASTER" ? await createActualDayMasterUnit(context, candidate.originalEvidenceNodeId)
    : candidate.factType === "TEN_GOD_RELATION" && candidate.calculationWitness ? await createActualTenGodUnit(context, candidate.calculationWitness) : null;
  return { ok: !!actual?.ok && v4Digest(actual.unit) === v4Digest(candidate), reasons: actual?.ok ? v4Digest(actual.unit) === v4Digest(candidate) ? [] : ["ACTUAL_UNIT_CONTENT_OR_AUTHORIZATION_CHANGED"] : ["ACTUAL_UNIT_CANNOT_BE_REVERIFIED"] };
}
export function actualSemanticDigest(value: unknown) { return digest(value); }
