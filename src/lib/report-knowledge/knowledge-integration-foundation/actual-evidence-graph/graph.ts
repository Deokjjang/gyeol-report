import { hash, canonicalJson } from "../sourceReader";
import type { ActualEvidenceGraph, ActualEvidenceNode, ActualEvidenceEdge, EvidenceGraphContext, EvidenceGraphCoverage, EvidenceGraphValidationResult, EvidenceGraphDiagnostic } from "./types";
import { intersectEvidencePeriods } from "./temporal";
export const evidenceHash = (v: unknown) => hash(canonicalJson(v));
export class ActualGraphIndex {
  readonly nodes = new Map<string, ActualEvidenceNode>();
  readonly producerIds = new Map<string, string[]>();
  readonly edges: ActualEvidenceEdge[] = [];
  readonly errors: EvidenceGraphDiagnostic[] = [];
  private edgeKeys = new Set<string>();
  private originalIds = new Map<string, ActualEvidenceNode[]>();
  constructor(readonly context: EvidenceGraphContext) {}
  add(node: Omit<ActualEvidenceNode, "id" | "ancestry" | "status" | "customerApproved">): ActualEvidenceNode {
    const identity = [node.kind, node.owner.fixtureOwnerId, node.producer, node.fact.producerEvidenceId ?? node.fact.observationPointer, node.participants, node.direction, node.temporal];
    const id = `aeg:node:${evidenceHash(identity)}`;
    const existing = this.nodes.get(id);
    if (existing) {
      if (canonicalJson(existing.value) !== canonicalJson(node.value)) this.errors.push({ code: "PRODUCER_IDENTITY_COLLISION", nodeIds: [id] });
      return existing;
    }
    const result: ActualEvidenceNode = { ...node, id, ancestry: { parentIds: [], rootIds: [], missingIds: [], complete: true, cycle: false, domains: [] }, status: "VERIFIED", customerApproved: false };
    this.nodes.set(id, result);
    const originalKey = `${node.owner.fixtureOwnerId}|${node.fact.producerEvidenceId}`;
    this.originalIds.set(originalKey, [...(this.originalIds.get(originalKey) ?? []), result]);
    if (node.fact.producerEvidenceId) {
      const key = `${node.owner.fixtureOwnerId}|${node.producer.symbol}|${node.fact.producerEvidenceId}`;
      this.producerIds.set(key, [...(this.producerIds.get(key) ?? []), id]);
    }
    this.link(id, node.owner.fixtureOwnerId, "HAS_OWNER", false);
    return result;
  }
  link(from: string, to: string, kind: ActualEvidenceEdge["kind"] = "DERIVED_FROM_ACTUAL_EVIDENCE", required = true) {
    const key = canonicalJson([from, to, kind, required]);
    if (!this.edgeKeys.has(key)) { this.edgeKeys.add(key); this.edges.push({ from, to, kind, required }); }
  }
  block(node: ActualEvidenceNode, code: string, refs: string[] = []) { if (!node.blockers.some(b => b.code === code && canonicalJson(b.refs) === canonicalJson(refs))) node.blockers.push({ code, refs }); }
  resolve(owner: string, producerId: string) { return this.originalIds.get(`${owner}|${producerId}`) ?? []; }
  finalize(): EvidenceGraphValidationResult {
    const done = new Set<string>(), stack = new Set<string>();
    const parents = new Map<string, ActualEvidenceEdge[]>();
    for (const e of this.edges) if (e.required) parents.set(e.from, [...(parents.get(e.from) ?? []), e]);
    const walk = (id: string): void => {
      if (done.has(id)) return;
      const n = this.nodes.get(id); if (!n) return;
      if (stack.has(id)) { n.ancestry.cycle = true; this.block(n, "ANCESTRY_CYCLE", [id]); return; }
      stack.add(id);
      if (!n.owner.fixtureOwnerId || n.owner.slot === "UNKNOWN") this.block(n, "UNKNOWN_OWNER");
      if (!n.producer.version || n.producer.version.includes("UNKNOWN")) this.block(n, "UNSUPPORTED_PRODUCER");
      if (n.sources.some(s => s.state === "HASH_MISMATCH")) this.block(n, "SOURCE_HASH_MISMATCH");
      if (n.sources.some(s => s.state === "UNRESOLVED")) this.block(n, "SOURCE_REFERENCE_UNRESOLVED");
      const roots = new Set<string>(n.fact.rootId ? [n.fact.rootId] : []);
      const domains = new Set<string>();
      const ownDomain = n.kind === "MBTI_SOURCE_NODE" && typeof (n.value as { sourceDomain?: unknown })?.sourceDomain === "string" ? (n.value as { sourceDomain: string }).sourceDomain : null;
      if (ownDomain) domains.add(ownDomain);
      const ps = parents.get(id) ?? [];
      for (const e of ps) {
        const p = this.nodes.get(e.to);
        if (!p) { n.ancestry.missingIds.push(e.to); continue; }
        if (stack.has(e.to)) { n.ancestry.cycle = true; this.block(n, "ANCESTRY_CYCLE", [e.to]); continue; }
        walk(p.id);
        if (p.status === "WITHHELD") {
          this.block(n, "REQUIRED_ANCESTOR_WITHHELD", [p.id]);
          this.link(n.id, p.id, "HAS_UNVERIFIED_ANCESTOR", false);
        }
        if (n.temporal && p.temporal) {
          const intersection = intersectEvidencePeriods([n.temporal, p.temporal]);
          if (intersection.state === "NO_INTERSECTION") this.block(n, "NO_TIME_INTERSECTION", [p.id]);
          if (intersection.state === "UNKNOWN_INTERVAL") this.block(n, "UNKNOWN_INTERVAL", [p.id]);
          if (intersection.state === "UNSUPPORTED_COMBINATION") this.block(n, "UNSUPPORTED_COMPOSITE", [p.id]);
        }
        p.ancestry.rootIds.forEach(r => roots.add(r)); p.ancestry.domains.forEach(d => domains.add(d));
        if (!p.ancestry.complete) n.ancestry.missingIds.push(...p.ancestry.missingIds, p.id);
        if (["SEMANTIC_DERIVATION", "FUSION_DERIVATION"].includes(n.kind) && p.owner.fixtureOwnerId !== n.owner.fixtureOwnerId) this.block(n, "WRONG_OWNER", [p.id]);
      }
      n.ancestry.parentIds = ps.map(p => p.to).sort(); n.ancestry.rootIds = [...roots].sort(); n.ancestry.domains = [...domains].sort();
      n.ancestry.missingIds = [...new Set(n.ancestry.missingIds)].sort();
      n.ancestry.complete = !n.ancestry.cycle && !n.ancestry.missingIds.length && !n.blockers.some(b => ["MISSING_FUSION_ROOT", "SOURCE_REFERENCE_UNRESOLVED", "SOURCE_HASH_MISMATCH", "MISSING_PRODUCER_OUTPUT", "UNKNOWN_EVIDENCE_ID", "UNKNOWN_OWNER", "WRONG_OWNER", "WRONG_DIRECTION", "UNSUPPORTED_PRODUCER"].includes(b.code));
      if (n.kind === "FUSION_DERIVATION" && n.fact.rootId) this.errors.push({ code: "FUSION_CANNOT_BE_INDEPENDENT_ROOT", nodeIds: [id] });
      if (n.kind === "SOURCE_DECLARATION" && n.fact.independentFact) this.errors.push({ code: "SOURCE_DECLARATION_NOT_EVIDENCE", nodeIds: [id] });
      n.status = n.blockers.some(b => ["WRONG_OWNER", "WRONG_DIRECTION", "UNKNOWN_OWNER", "MISSING_FUSION_ROOT", "SOURCE_HASH_MISMATCH", "DISALLOWED_ANCESTOR_DOMAIN", "UNSUPPORTED_PRODUCER", "UNSUPPORTED_COMPOSITE", "AMBIGUOUS_MANGSIN_RULE", "UNSUPPORTED_TRANSIT", "NO_CANONICAL_TRANSIT_PROVENANCE", "BEFORE_FIRST_DAYUN", "UNCERTAIN_TRANSITION", "NO_TIME_INTERSECTION", "MISSING_PARTICIPANT", "UNKNOWN_BIRTH_TIME", "REQUIRED_ANCESTOR_WITHHELD"].includes(b.code)) ? "WITHHELD" : n.blockers.length || !n.ancestry.complete ? "PARTIAL" : "VERIFIED";
      stack.delete(id); done.add(id);
    };
    for (const id of this.nodes.keys()) walk(id);
    for (const e of this.edges) if (!this.nodes.has(e.from) || e.required && !this.nodes.has(e.to)) this.errors.push({ code: "DANGLING_REQUIRED_EDGE", nodeIds: [e.from, e.to] });
    return { ok: !this.errors.length, errors: this.errors, status: this.errors.length ? "INVALID" : [...this.nodes.values()].some(n => n.status !== "VERIFIED") ? "PARTIAL" : "VERIFIED" };
  }
}
export function graphCoverage(nodes: ActualEvidenceNode[], edges: ActualEvidenceEdge[]): EvidenceGraphCoverage {
  const counts = (f: (n: ActualEvidenceNode) => string) => Object.fromEntries([...new Set(nodes.map(f))].sort().map(k => [k, nodes.filter(n => f(n) === k).length]));
  const roots = new Set(nodes.flatMap(n => n.ancestry.rootIds));
  return { nodes: nodes.length, edges: edges.length, actualProducerFacts: nodes.filter(n => n.fact.independentFact).length, actualEvidenceIds: new Set(nodes.filter(n => n.fact.producerEvidenceId).map(n => canonicalJson([n.owner.fixtureOwnerId, n.producer, n.fact.producerEvidenceId, n.temporal, n.participants, n.direction]))).size, canonicalFactRoots: roots.size, duplicateRootReferences: nodes.reduce((s, n) => s + n.ancestry.rootIds.length, 0) - roots.size, completeAncestry: nodes.filter(n => n.ancestry.complete).length, incompleteAncestry: nodes.filter(n => !n.ancestry.complete).length, ownerVerified: nodes.filter(n => n.owner.slot !== "UNKNOWN" && !!n.owner.fixtureOwnerId).length, directionVerified: nodes.filter(n => n.direction && !n.blockers.some(b => b.code === "WRONG_DIRECTION")).length, directionTotal: nodes.filter(n => n.direction).length, temporalVerified: nodes.filter(n => n.temporal?.certainty === "confirmed" && n.temporal.start && n.temporal.endExclusive && !n.blockers.some(b => ["NO_TIME_INTERSECTION", "UNKNOWN_INTERVAL", "UNSUPPORTED_COMPOSITE", "UNCERTAIN_TRANSITION", "REQUIRED_ANCESTOR_WITHHELD"].includes(b.code))).length, temporalTotal: nodes.filter(n => n.temporal).length, sourceVerificationLinks: nodes.reduce((s, n) => s + n.sources.reduce((a, v) => a + v.sourceReferenceKeys.length, 0), 0), semanticDomainLinks: nodes.reduce((s, n) => s + n.sources.reduce((a, v) => a + v.semanticDecisionKeys.length, 0) + n.blockers.filter(b => b.code === "DISALLOWED_ANCESTOR_DOMAIN").length, 0), withheldNodes: nodes.filter(n => n.status === "WITHHELD").length, unsupportedNodes: nodes.filter(n => n.kind === "UNSUPPORTED_REQUIREMENT").length, unknownInputNodes: nodes.filter(n => n.kind === "UNKNOWN_REQUIREMENT").length, fusionComplete: nodes.filter(n => n.kind === "FUSION_DERIVATION" && n.ancestry.complete && !n.blockers.some(b => b.code === "MISSING_FUSION_ROOT" || b.code === "WRONG_OWNER")).length, fusionIncomplete: nodes.filter(n => n.kind === "FUSION_DERIVATION" && (!n.ancestry.complete || n.blockers.some(b => b.code === "MISSING_FUSION_ROOT" || b.code === "WRONG_OWNER"))).length, kindCounts: counts(n => n.kind), producerCounts: counts(n => `${n.producer.symbol}@${n.producer.version}`) };
}
export function bindingRequirements(g: ActualEvidenceGraph) { return g.nodes.map(n => ({ nodeId: n.id, producer: n.producer, originalEvidenceId: n.fact.producerEvidenceId, owner: n.owner, direction: n.direction, participants: n.participants, temporal: n.temporal, certainty: n.certainty, roots: n.ancestry.rootIds, missingAncestry: n.ancestry.missingIds, blockers: n.blockers, customerApproved: false, gates: ["EXACT_SUPPORTED_PRODUCER", "ALL_REQUIRED_SOURCE_ROOTS", "ACTUAL_OWNER_DIRECTION_TIME", "ORIGINAL_SOURCE_GROUP_COMPATIBILITY", "SOURCE_AND_SEMANTIC_REVIEW", "PRODUCT_POLICY", "CUSTOMER_APPROVAL"] })); }
