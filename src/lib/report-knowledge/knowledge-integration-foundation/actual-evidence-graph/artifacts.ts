import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { stableJson } from "../compiler";
import { evidenceHash } from "./graph";
import type { ActualEvidenceGraph } from "./types";
/** Export only synthetic fixtures. Original person IDs and private-derived graph
 * hashes are retained in memory; public IDs are ordinal aliases, never input hashes. */
export function privacySafeGraph(graph: ActualEvidenceGraph, forbiddenStrings: readonly string[], rootAliases?: ReadonlyMap<string, string>) {
  if (graph.context.synthetic !== true || !graph.context.fixtureId.startsWith("fixture-")) throw new Error("ONLY_SYNTHETIC_GRAPH_EXPORT_ALLOWED");
  const replacements = new Map<string, string>();
  graph.nodes.forEach((n, i) => replacements.set(n.id, `${graph.context.fixtureId}:node:${i + 1}`));
  [...new Set(graph.nodes.flatMap(n => n.ancestry.rootIds))].sort().forEach((r, i) => replacements.set(r, rootAliases?.get(r) ?? `${graph.context.fixtureId}:root:${i + 1}`));
  for (const n of graph.nodes) if (n.owner.originalPersonId) replacements.set(n.owner.originalPersonId, n.owner.fixtureOwnerId);
  for (const s of forbiddenStrings.filter(s => s.length >= 3)) replacements.set(s, "[private-fixture-input-omitted]");
  const ordered = [...replacements].filter(([a]) => !a.startsWith("aeg:")).sort(([a], [b]) => b.length - a.length);
  function visit(v: unknown): unknown {
    if (typeof v === "string") { const exact = replacements.get(v); if (exact) return exact; let text = v.replace(/aeg:(?:node|root):[a-f0-9]{64}/g, id => replacements.get(id) ?? id); for (const [a, b] of ordered) if (text.includes(a)) text = text.split(a).join(b); return text; }
    if (Array.isArray(v)) return v.map(visit);
    if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).filter(([k]) => k !== "originalPersonId").map(([k, x]) => [k, visit(x)]));
    return v;
  }
  const safe = visit(graph) as ActualEvidenceGraph;
  const text = JSON.stringify(safe);
  if (forbiddenStrings.filter(s => s.length >= 3).some(s => text.includes(s)) || /"(?:birthDate|birthTime|email|orderId|shareToken|paymentKey|contact)"\s*:/.test(text) || /aeg:(?:node|root):[a-f0-9]{64}/.test(text)) throw new Error("GRAPH_PRIVACY_EXPORT_REJECTED");
  return safe;
}
export function writeGraphArtifacts(out: string, graphs: ReturnType<typeof privacySafeGraph>[], inherited: unknown, producerContracts: unknown[]) {
  mkdirSync(join(out, "shards"), { recursive: true });
  const write = (name: string, value: unknown) => writeFileSync(join(out, `${name}.json`), stableJson(value));
  const nodeIndex: unknown[] = [], edgeIndex: unknown[] = [], lineage: unknown[] = [], owners: unknown[] = [], directions: unknown[] = [], temporal: unknown[] = [], withheld: unknown[] = [], receipts: unknown[] = [], binding: unknown[] = [];
  const rootIndex = new Map<string, { rootId: string; originNodes: string[]; referenceCount: number; independentCalculatedFact: boolean }>();
  for (const g of graphs) {
    const id = g.context.fixtureId;
    write(`shards/${id}-nodes`, g.nodes); write(`shards/${id}-edges`, g.edges);
    nodeIndex.push({ fixtureId: id, product: g.product, relationship: g.relationship, file: `shards/${id}-nodes.json`, count: g.nodes.length });
    edgeIndex.push({ fixtureId: id, file: `shards/${id}-edges.json`, count: g.edges.length });
    for (const n of g.nodes) {
      if (n.sources.length) lineage.push({ nodeId: n.id, sources: n.sources });
      if (n.direction) directions.push({ nodeId: n.id, direction: n.direction, participants: n.participants, verified: !n.blockers.some(b => b.code === "WRONG_DIRECTION") });
      if (n.temporal) temporal.push({ nodeId: n.id, temporal: n.temporal, certainty: n.certainty });
      for (const id of n.ancestry.rootIds) { const row = rootIndex.get(id) ?? { rootId: id, originNodes: [], referenceCount: 0, independentCalculatedFact: false }; row.referenceCount++; if (n.fact.rootId === id) { row.originNodes.push(n.id); row.independentCalculatedFact ||= n.fact.independentFact; } rootIndex.set(id, row); }
      if (n.blockers.length) withheld.push({ nodeId: n.id, kind: n.kind, status: n.status, reasons: n.blockers });
    }
    const ownerIds = [...new Set(g.nodes.map(n => n.owner.fixtureOwnerId))];
    owners.push(...ownerIds.map(owner => ({ fixtureId: id, owner, nodeIds: g.nodes.filter(n => n.owner.fixtureOwnerId === owner).map(n => n.id), unknownOwnerNodeIds: g.nodes.filter(n => n.owner.fixtureOwnerId === owner && n.owner.slot === "UNKNOWN").map(n => n.id) })));
    write(`shards/${id}-receipts`, g.receipts); receipts.push({ fixtureId: id, file: `shards/${id}-receipts.json`, count: g.receipts.length });
    binding.push({ fixtureId: id, nodeShard: `shards/${id}-nodes.json`, nodeIds: g.nodes.map(n => n.id), requiredFieldsFromEachNode: ["fact", "producer", "owner", "direction", "participants", "sources", "ancestry", "temporal", "certainty", "blockers"], allNodesRequire: ["EXACT_SUPPORTED_PRODUCER", "ALL_REQUIRED_SOURCE_ROOTS", "ACTUAL_OWNER_DIRECTION_TIME", "ORIGINAL_SOURCE_GROUP_COMPATIBILITY", "SOURCE_AND_SEMANTIC_REVIEW", "PRODUCT_POLICY", "CUSTOMER_APPROVAL"], customerApproved: false, bindingAllowed: false });
  }
  const refs = (kinds: string[], system?: string) => graphs.flatMap(g => g.nodes.filter(n => kinds.includes(n.kind) && (!system || n.producer.system === system)).map(n => n.id));
  write("actual-evidence-nodes", nodeIndex); write("actual-evidence-edges", edgeIndex); write("actual-source-lineage", lineage); write("owner-verification", owners); write("direction-verification", directions); write("temporal-window-verification", temporal); write("fact-root-deduplication", [...rootIndex.values()].sort((a, b) => a.rootId.localeCompare(b.rootId, "en"))); write("withheld-evidence", withheld); write("evidence-graph-receipts", receipts); write("binding-requirements", binding);
  write("mbti-source-graph", refs(["MBTI_INPUT_TYPE", "MBTI_SOURCE_NODE", "SOURCE_DECLARATION", "SEMANTIC_DERIVATION"], "mbti"));
  write("fusion-source-graph", refs(["FUSION_DERIVATION"])); write("pair-evidence-graph", refs(["CANONICAL_PAIR_FACT", "DIRECTIONAL_RELATION_FACT"]));
  write("major-evidence-graph", graphs.filter(g => g.product === "major_fortune").map(g => ({ fixtureId: g.context.fixtureId, nodes: g.nodes.filter(n => ["major", "dayun"].includes(n.producer.system)).map(n => n.id) })));
  write("annual-evidence-graph", graphs.filter(g => g.product === "annual_fortune").map(g => ({ fixtureId: g.context.fixtureId, nodes: g.nodes.filter(n => ["annual-month", "dayun"].includes(n.producer.system)).map(n => n.id) })));
  write("unsupported-evidence", graphs.flatMap(g => g.nodes.filter(n => n.kind === "UNSUPPORTED_REQUIREMENT").map(n => ({ nodeId: n.id, reasons: n.blockers }))));
  write("producer-contract-inventory", producerContracts);
  write("producer-support-matrix", graphs.map(g => ({ fixtureId: g.context.fixtureId, producers: Object.fromEntries(Object.keys(g.coverage.producerCounts).sort().map(key => { const nodes = g.nodes.filter(n => `${n.producer.symbol}@${n.producer.version}` === key); return [key, { observed: nodes.length, verified: nodes.filter(n => n.status === "VERIFIED").length, partial: nodes.filter(n => n.status === "PARTIAL").length, withheld: nodes.filter(n => n.status === "WITHHELD").length, originalIdPresent: nodes.filter(n => n.fact.producerEvidenceId !== null).length, producerObservationOnly: nodes.filter(n => n.fact.producerEvidenceId === null).length, ancestryComplete: nodes.filter(n => n.ancestry.complete).length, ancestryIncomplete: nodes.filter(n => !n.ancestry.complete).length }]; })), unsupported: g.coverage.unsupportedNodes, incomplete: g.coverage.incompleteAncestry, graphStatus: g.validation.status })));
  write("graph-integrity-audit", graphs.map(g => ({ fixtureId: g.context.fixtureId, validation: g.validation, fingerprintOfRedactedGraph: evidenceHash(g), customerApproval: 0, runtimeConnection: 0, specialistClaimsEmitted: 0 })));
  write("privacy-preservation", { syntheticFixturesOnly: true, rawInputsExported: false, originalPersonIdsExported: false, privateDerivedNodeAndRootHashesExported: false, ordinalFixtureAliases: true, originalEvidenceIdsRetainedInMemory: true, customerApproval: 0 });
  write("coverage-manifest", graphs.map(g => ({ fixtureId: g.context.fixtureId, product: g.product, relationship: g.relationship, ...g.coverage })));
  write("actual-evidence-graph-manifest", { version: "actual-evidence-graph-v1", inherited, fixtures: graphs.length, products: [...new Set(graphs.map(g => g.product))].sort(), relationships: [...new Set(graphs.flatMap(g => g.relationship ? [g.relationship] : []))].sort(), validGraphs: graphs.filter(g => g.validation.ok).length, partialGraphs: graphs.filter(g => g.validation.status === "PARTIAL").length, customerApproval: 0, researchRuntimeConnection: 0, specialistClaimsEmitted: 0, bookChanges: 0, coverage: Object.fromEntries(["nodes", "edges", "actualProducerFacts", "actualEvidenceIds", "canonicalFactRoots", "duplicateRootReferences", "completeAncestry", "incompleteAncestry", "sourceVerificationLinks", "semanticDomainLinks", "fusionComplete", "fusionIncomplete", "withheldNodes"].map(key => [key, graphs.reduce((s, g) => s + Number(g.coverage[key as keyof typeof g.coverage]), 0)])), countsAreFixtureOccurrencesNotDistinctHumanFacts: true });
}
