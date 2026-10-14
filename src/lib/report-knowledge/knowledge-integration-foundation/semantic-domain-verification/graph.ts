import { isRecord } from "../normalization";
import { technicallyVerified } from "../source-verification/classification";
import type { CatalogKey, KnowledgeCatalogRecord } from "../types";
import type { AncestorPolicyReceipt, AncestryLink, SemanticInputs } from "./types";
/** Indexed source provenance only. Never emits actual Evidence or flattens displayed alternatives. */
export class SemanticAncestryIndex {
  readonly byKey: Map<CatalogKey, KnowledgeCatalogRecord>;
  readonly byId = new Map<string, KnowledgeCatalogRecord[]>();
  readonly byFamilyKey = new Map<string, KnowledgeCatalogRecord[]>();
  readonly byDomain = new Map<string, CatalogKey[]>();
  readonly byProduct = new Map<string, CatalogKey[]>();
  readonly byRelationship = new Map<string, CatalogKey[]>();
  readonly outgoing = new Map<CatalogKey, AncestryLink[]>();
  private cache = new Map<CatalogKey, AncestorPolicyReceipt>();
  constructor(readonly input: SemanticInputs) {
    this.byKey = new Map(input.records.map(r => [r.catalogKey, r]));
    const add = <T,>(map: Map<string, T[]>, key: string, value: T) => map.set(key, [...(map.get(key) ?? []), value]);
    for (const r of input.records) {
      add(this.byId, r.originalId, r);
      if (typeof r.metadata.key === "string") add(this.byFamilyKey, `${r.family}:${r.metadata.key}`, r);
      for (const p of r.applicability.products) add(this.byProduct, p, r.catalogKey);
      for (const c of r.applicability.relationships) add(this.byRelationship, c, r.catalogKey);
      for (const d of typeof r.metadata.domain === "string" ? [r.metadata.domain] : Array.isArray(r.metadata.domains) ? r.metadata.domains.filter((d): d is string => typeof d === "string") : []) add(this.byDomain, d, r.catalogKey);
    }
    const receipts = new Map<string, SemanticInputs["sourceReceipts"]>();
    for (const r of input.sourceReceipts) { const key = JSON.stringify([r.affectedCatalogKey, r.referenceField, r.referenceKind, r.originalTarget]); receipts.set(key, [...(receipts.get(key) ?? []), r]); }
    for (const edge of input.edges) {
      const r = this.byKey.get(edge.from); if (!r) continue;
      const matchingReceipts = receipts.get(JSON.stringify([edge.from, edge.field, edge.kind, edge.target])) ?? [];
      const receipt = matchingReceipts[0];
      const target = edge.to && this.byKey.has(edge.to.split("#")[0] as CatalogKey) ? edge.to.split("#")[0] as CatalogKey : receipt && technicallyVerified(receipt) ? receipt.candidateTargets[0]?.catalogKey ?? null : null;
      const to = target ? this.byKey.get(target) : null;
      let role: AncestryLink["role"];
      if (!["REFERENCES", "REQUIRES", "REUSES_SOURCE"].includes(edge.kind)) role = "RELATED_ONLY";
      else if (/\/sourceGroups\//.test(edge.field) && r.groupSemantics !== "ALL_DIRECT_SOURCES" || r.groupSemantics === "AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS" && /\/ownedSources\/|\/sourceKeys\/|\/typePredicates\//.test(edge.field)) role = "CONDITIONAL_GROUP";
      else if (receipt?.resolutionState === "FUTURE_REQUIREMENT_ONLY") role = "FUTURE_REQUIREMENT";
      else if (receipt?.resolutionState === "DOCUMENTARY_REFERENCE_ONLY" || to?.kind === "AUDIT_METADATA" || to?.kind === "BINDING_DESIGN" || to && (typeof to.metadata.url === "string" || to.locator.file.startsWith("docs/validation/"))) role = "DOCUMENTARY_REFERENCE";
      else if (receipt?.verificationStrength === "DECLARATION_ONLY" || edge.to && !target && edge.resolution === "RESOLVED") role = "DEFINITION_REFERENCE";
      else role = target ? "REQUIRED_SOURCE" : "UNRESOLVED_REQUIRED_SOURCE";
      const link: AncestryLink = { from: edge.from, to: target, field: edge.field, originalKind: edge.kind, role, sourceReferenceKey: receipt?.referenceKey ?? null, originalTarget: edge.target };
      this.outgoing.set(edge.from, [...(this.outgoing.get(edge.from) ?? []), ...(matchingReceipts.length ? matchingReceipts.map(r => ({ ...link, sourceReferenceKey: r.referenceKey })) : [link])]);
    }
  }
  sourceKey(family: string, key: string): KnowledgeCatalogRecord[] { return this.byFamilyKey.get(`${family}:${key}`) ?? []; }
  trace(root: CatalogKey): AncestorPolicyReceipt {
    const old = this.cache.get(root); if (old) return old;
    const reached = new Set<CatalogKey>(), visiting = new Set<CatalogKey>(), contextual = new Set<CatalogKey>(), conditional = new Set<CatalogKey>();
    const refs = new Set<NonNullable<AncestryLink["sourceReferenceKey"]>>(), missing = new Set<NonNullable<AncestryLink["sourceReferenceKey"]>>(), cycleEdges: AncestorPolicyReceipt["cycleEdges"] = [];
    const walk = (key: CatalogKey) => {
      if (reached.has(key)) return;
      reached.add(key); visiting.add(key);
      for (const e of this.outgoing.get(key) ?? []) {
        if (e.sourceReferenceKey) refs.add(e.sourceReferenceKey);
        if (e.role === "CONDITIONAL_GROUP") { conditional.add(key); continue; }
        if (e.role === "UNRESOLVED_REQUIRED_SOURCE" && e.sourceReferenceKey) missing.add(e.sourceReferenceKey);
        if (e.role !== "REQUIRED_SOURCE") { if (e.to) contextual.add(e.to); continue; }
        if (!e.to) continue;
        if (visiting.has(e.to)) cycleEdges.push({ from: key, to: e.to }); else walk(e.to);
      }
      visiting.delete(key);
    };
    walk(root);
    const result: AncestorPolicyReceipt = { root, requiredSourceKeys: [...reached].sort(), contextualSourceKeys: [...contextual].sort(), cycleEdges, conditionalGroupOwners: [...conditional].sort(), sourceReferenceKeys: [...refs].sort(), incompleteReferenceKeys: [...missing].sort(), prohibitions: [], documentaryAndFutureAreNotCalculatedAncestors: true };
    this.cache.set(root, result); return result;
  }
}
/** Explicit fields only. Do not infer domains from prose, similar labels or any whole-profile child. */
export function declaredDomains(raw: unknown): string[] {
  if (!isRecord(raw)) return [];
  const strings = (v: unknown): string[] => typeof v === "string" ? [v] : Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  const node = isRecord(raw.originalState) && isRecord(raw.originalState.node) ? raw.originalState.node : {};
  return [...new Set([...strings(raw.domain), ...strings(raw.domains), ...strings(raw.sourceDomain), ...strings(raw.originalDomain), ...strings(node.sourceDomain)])];
}
