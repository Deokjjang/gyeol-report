import type { ActualEvidenceNode, EvidenceTemporalWindow } from "../actual-evidence-graph/types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { isRecord } from "../normalization";
import { canonicalJson } from "../sourceReader";

export function temporalCompatibility(required: EvidenceTemporalWindow | undefined, actual: EvidenceTemporalWindow | null): "PASS" | "FAIL" | "UNKNOWN" | "NOT_APPLICABLE" {
  if (!required) return "NOT_APPLICABLE";
  if (!actual || actual.scope === "UNKNOWN" || required.scope === "UNKNOWN" || actual.certainty === "unknown" || required.certainty === "unknown" || !actual.start || !actual.endExclusive || !required.start || !required.endExclusive) return "UNKNOWN";
  if (actual.scope !== required.scope || actual.certainty !== required.certainty || actual.compatibleCombination !== required.compatibleCombination) return "FAIL";
  const a = Date.parse(actual.start), b = Date.parse(actual.endExclusive), c = Date.parse(required.start), d = Date.parse(required.endExclusive);
  if (![a, b, c, d].every(Number.isFinite) || a >= b || c >= d) return "UNKNOWN";
  return Math.max(a, c) < Math.min(b, d) ? "PASS" : "FAIL";
}
export function auditNodeScope(request: KnowledgeBindingRequest, node: ActualEvidenceNode, nodes = new Map(request.graph.nodes.map(n => [n.id, n]))) {
  const owners = request.graph.context.owners;
  const expectedOwner = node.owner.slot === "pair" ? null : node.owner.slot === "UNKNOWN" ? undefined : owners[node.owner.slot];
  const owner = expectedOwner === undefined ? "UNKNOWN" : expectedOwner === null ? "PAIR_REMAINS_PAIR" : expectedOwner === node.owner.fixtureOwnerId ? "PASS" : "FAIL";
  const pending = [node.id], seen = new Set<string>(), missing = new Set<string>(), roots = new Set<string>();
  while (pending.length) {const id = pending.pop()!; if (seen.has(id)) continue; seen.add(id); const n = nodes.get(id); if (!n) {missing.add(id); continue;} for (const root of n.ancestry.rootIds) roots.add(root); pending.push(...n.ancestry.parentIds); for (const m of n.ancestry.missingIds) missing.add(m);}
  const e = request.graphInput.evidence;
  let direction: string = node.direction ? "UNKNOWN" : "NOT_APPLICABLE";
  let receivedTenGod: string = "NOT_APPLICABLE";
  if (node.direction && e.composition.product === "saju_mbti_compatibility") {
    const d = node.direction, original = e.composition.result.evidence.directions;
    const isAB = d.subject === owners.personA && d.recipient === owners.personB;
    const isBA = d.subject === owners.personB && d.recipient === owners.personA;
    direction = isAB || isBA ? "PASS" : "FAIL";
    const expected = isAB ? original.aToB : isBA ? original.bToA : null;
    if (expected && isRecord(node.value) && "receivedTenGod" in node.value) receivedTenGod = canonicalJson(node.value.receivedTenGod) === canonicalJson(expected.receivedTenGod) ? "PASS" : "FAIL";
  }
  return {nodeId: node.id, fixtureId: request.graph.context.fixtureId, owner, originalOwner: node.owner, direction, originalDirection: node.direction, receivedTenGod, requiredAncestry: {visitedIds: [...seen].sort(), missingIds: [...missing].sort(), originalComplete: node.ancestry.complete, originalCycle: node.ancestry.cycle, originalDomains: node.ancestry.domains, supportingRoots: [...roots].sort()}, temporal: {original: node.temporal, compatibility: temporalCompatibility(request.requiredWindow, node.temporal)}, evidenceIsNotSourceReference: !["SOURCE_DECLARATION", "UNSUPPORTED_REQUIREMENT", "UNKNOWN_REQUIREMENT"].includes(node.kind), actualCustomerApproval: false};
}
