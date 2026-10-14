import { ACTUAL_GRAPH_VERSION, type ActualEvidenceGraph, type GraphInput, type EvidenceGraphBuildResult } from "./types";
import { EvidenceBuilder } from "./builder";
import { graphCoverage, evidenceHash } from "./graph";
import type { EvidenceKnowledgeIndex } from "./knowledge";
import { adaptNatalEvidence } from "./natal";
import { adaptSemanticEvidence, applyActualDomainPolicy } from "./semantic";
import { adaptPairEvidence } from "./pair";
import { adaptPeriodEvidence } from "./periods";
import { isRecord } from "../normalization";
import type { NarrativeBlock, NarrativeSection } from "../../../interpretation-v4/narrativeTypes";

function observeEditorialProof(b: EvidenceBuilder) {
  const c = b.input.evidence.composition, owner = b.owner(c.product === "saju_mbti_compatibility" ? "personA" : "person");
  const n = c.result.narrative;
  const blocks: readonly NarrativeBlock[] = [...n.opening, ...(n.sections as readonly NarrativeSection[]).flatMap(s => s.blocks)];
  const writerVersion = "writerVersion" in c.result && typeof c.result.writerVersion === "string" ? c.result.writerVersion : n.version;
  for (const [i, block] of blocks.entries()) {
    const observation = b.node("EDITORIAL_PROOF_OBSERVATION", owner, b.producer("interpretation-v4/runtimeProjection", "V4Composition.narrative.proof", writerVersion, "editorial-observation"), block.id, `/composition/result/narrative/proofObservations/${i}`, { existingBlockId: block.id, sourceRefs: block.proof.sourceRefs, fusionIds: block.proof.fusionIds, seedIds: block.proof.seedIds, customerParagraphCreated: false });
    for (const id of [...block.proof.sourceRefs, ...block.proof.fusionIds]) {
      let slot = owner.slot as "person" | "personA" | "personB", target = id;
      if (c.product === "saju_mbti_compatibility" && (id.startsWith("personA:") || id.startsWith("personB:"))) { const i = id.indexOf(":"); slot = id.slice(0, i) as "personA" | "personB"; target = id.slice(i + 1); }
      const found = b.index.resolve(b.owner(slot).fixtureOwnerId, target);
      if (found.length === 1) b.index.link(observation.id, found[0].id);
      else b.index.block(observation, "SOURCE_REFERENCE_UNRESOLVED", [id]);
    }
    // SourceRef observations are never promoted to newly calculated facts.
  }
}
function observeLegacyFusion(b: EvidenceBuilder) {
  const e = b.input.evidence;
  const slots = e.input.kind === "compatibility" ? ["personA", "personB"] as const : ["person"] as const;
  for (const slot of slots) {
    const r: unknown = e.composition.result;
    const packet: unknown = e.composition.product === "saju_mbti_compatibility" ? e.composition.result.evidence.persons[slot as "personA" | "personB"].materials : isRecord(r) ? r.materials : null;
    if (!isRecord(packet) || !Array.isArray(packet.fusions)) continue;
    for (const [i, f] of packet.fusions.entries()) {
      if (!isRecord(f) || !Array.isArray(f.myeongliEvidence) || !isRecord(f.mbtiEvidence)) continue;
      const owner = b.owner(slot), parents: string[] = [], missing: string[] = [];
      for (const d of f.myeongliEvidence) if (isRecord(d) && isRecord(d.evidence)) {
        const feature = d.evidence.feature, actual = typeof feature === "string" ? b.anchors.get(`${slot}:feature:${feature}`) : null;
        if (actual) parents.push(actual); else missing.push(String(d.evidence.id));
      }
      const mb = f.mbtiEvidence, profile = b.input.profiles[slot]?.mbti;
      const matches = profile?.sourceNodes.filter(n => n.id.includes(`:${String(mb.area)}:${encodeURIComponent(String(mb.traitId))}:`) && n.sourcePath.endsWith("/plainKo")) ?? [];
      if (matches.length === 1) { const found = b.index.resolve(owner.fixtureOwnerId, matches[0].id); if (found.length === 1) parents.push(found[0].id); else missing.push(matches[0].id); } else missing.push("LEGACY_MBTI_TRAIT_NOT_EXACTLY_ADDRESSABLE");
      const n = b.node("FUSION_DERIVATION", owner, b.producer("interpretation-v4/materialPacket", "buildMyeongliMaterialPacket", String(packet.version), "legacy-fusion"), null, `/materials/${slot}/fusions/${i}`, { ruleId: f.ruleId, kind: f.kind, domain: f.domain, confidence: f.confidence, sourceCoverage: mb.sourceCoverage, independentFactsAdded: 0 }, { parents });
      if (missing.length || parents.length < 2) b.index.block(n, "MISSING_FUSION_ROOT", missing);
    }
  }
}
export function buildActualEvidenceGraph(input: GraphInput, knowledge: EvidenceKnowledgeIndex): EvidenceGraphBuildResult {
  const before = evidenceHash(input.evidence), b = new EvidenceBuilder(input, knowledge), e = input.evidence;
  const { contentDigest, ...body } = e;
  const validContext = input.context.synthetic === true && /^fixture[-:]/.test(input.context.fixtureId) && Number.isFinite(Date.parse(input.context.evaluatedAt)) && Date.parse(input.context.evaluatedAt) === Date.parse(e.generatedAt) && input.context.catalogVersion === knowledge.versions.catalog && input.context.sourceVersion === knowledge.versions.source && input.context.semanticVersion === knowledge.versions.semantic;
  if (!validContext || e.version !== "v4-runtime-evidence-1" || e.mode !== "shadow" || evidenceHash(body) !== contentDigest) b.index.errors.push({ code: "INVALID_PRODUCER_PACKET_OR_CONTEXT", nodeIds: [] });
  if (e.composition.product === "saju_mbti_compatibility" && (!input.context.owners.personA || !input.context.owners.personB || input.context.owners.personA === input.context.owners.personB || e.composition.result.evidence.persons.personA.personId === e.composition.result.evidence.persons.personB.personId)) b.index.errors.push({ code: "PAIR_OWNER_IDENTITY_NOT_DISTINCT", nodeIds: [] });
  const slots = e.input.kind === "compatibility" ? ["personA", "personB"] as const : ["person"] as const;
  if (e.input.kind !== "compatibility") b.node("CONTEXT_INPUT", b.owner("person"), b.producer("report-generation/reportInputAdapter", "normalizeReportInputPayload", `source-sha256:${knowledge.input.frozen.get("src/lib/report-generation/reportInputAdapter.ts") ?? "UNKNOWN"}`, "normalized-input"), null, "/input/userContext", { jobStatus: e.input.userContext.jobStatus, relationshipStatus: e.input.userContext.relationshipStatus, detailJobProvided: !!e.input.userContext.detailJob, rawFreeTextRetainedOnlyInCallerInput: true }, { root: true });
  for (const slot of slots) { adaptNatalEvidence(b, slot); adaptSemanticEvidence(b, slot); }
  adaptPairEvidence(b); adaptPeriodEvidence(b); observeLegacyFusion(b); observeEditorialProof(b);
  b.index.finalize(); applyActualDomainPolicy(b);
  const validation = b.index.finalize();
  const nodes = [...b.index.nodes.values()].sort((a, z) => a.id.localeCompare(z.id, "en"));
  const edges = b.index.edges.sort((a, z) => `${a.from}|${a.to}|${a.kind}`.localeCompare(`${z.from}|${z.to}|${z.kind}`, "en"));
  const graph: ActualEvidenceGraph = { version: ACTUAL_GRAPH_VERSION, context: input.context, product: e.productType, relationship: e.composition.product === "saju_mbti_compatibility" ? e.composition.result.evidence.category : null, nodes, edges, validation, coverage: graphCoverage(nodes, edges), receipts: nodes.map(n => ({ nodeId: n.id, producerFactVerified: n.fact.independentFact && n.certainty === "confirmed" && !n.blockers.some(b => ["WRONG_OWNER", "WRONG_DIRECTION", "UNSUPPORTED_PRODUCER", "MISSING_PARTICIPANT", "MISSING_PRODUCER_OUTPUT", "AMBIGUOUS_MANGSIN_RULE", "UNSUPPORTED_TRANSIT", "NO_CANONICAL_TRANSIT_PROVENANCE", "BEFORE_FIRST_DAYUN", "UNCERTAIN_TRANSITION", "NO_TIME_INTERSECTION", "UNKNOWN_BIRTH_TIME", "REQUIRED_ANCESTOR_WITHHELD"].includes(b.code)), sourceReferenceVerified: n.sources.length > 0 && n.sources.every(s => s.state === "VERIFIED"), ownerVerified: !!n.owner.fixtureOwnerId && n.owner.slot !== "UNKNOWN" && !n.blockers.some(b => b.code === "WRONG_OWNER"), directionVerified: n.direction ? !n.blockers.some(b => b.code === "WRONG_DIRECTION") : null, temporalScopeVerified: n.temporal ? n.temporal.certainty === "confirmed" && !!n.temporal.start && !!n.temporal.endExclusive && !n.blockers.some(b => ["NO_TIME_INTERSECTION", "UNKNOWN_INTERVAL", "UNSUPPORTED_COMPOSITE", "UNCERTAIN_TRANSITION", "REQUIRED_ANCESTOR_WITHHELD"].includes(b.code)) : null, ancestryComplete: n.ancestry.complete, customerApproved: false, semanticReviewRequired: true, customerApprovalRequired: true })), customerApproval: 0, runtimeConnection: 0, specialistClaimsEmitted: 0 };
  const inputUnchanged = before === evidenceHash(input.evidence);
  if (!inputUnchanged) { graph.validation.errors.push({ code: "PRODUCER_INPUT_MUTATED", nodeIds: [] }); graph.validation.ok = false; graph.validation.status = "INVALID"; }
  return { ok: graph.validation.ok && inputUnchanged, graph, inputUnchanged };
}
