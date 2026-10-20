import type { CandidateEnvelope } from "./types";
export class GlobalCandidateIdentityIndex {
  readonly candidates = new Map<string, CandidateEnvelope>();
  readonly dimensions = new Map<string, Map<string, Set<string>>>();
  add(key: string, value: string | null, id: string): void {
    const index = this.dimensions.get(key) ?? new Map<string, Set<string>>();
    const ids = index.get(value ?? "NULL") ?? new Set<string>(); ids.add(id); index.set(value ?? "NULL", ids); this.dimensions.set(key, index);
  }
  register(e: CandidateEnvelope): void {
    if (this.candidates.has(e.identity.globalId)) throw Error("GLOBAL_CANDIDATE_ADDRESS_COLLISION");
    this.candidates.set(e.identity.globalId, e);
    const id = e.identity.globalId;
    for (const [key, value] of Object.entries({EngineId: e.engine, ProductKey: e.productScope, RelationshipCategory: e.relationshipScope, CatalogKey: e.identity.catalogKey, OriginalResearchId: e.identity.originalResearchId, FixtureId: e.fixtureScope.fixtureId, ApprovalState: e.approvalState})) this.add(key, value, id);
    for (const link of e.questionLinks) {this.add("QuestionId", link.questionId, id); this.add("MaterialLinkKind", link.kind, id);}
    for (const link of e.nativeQuestionLinks) this.add("NativeQuestionId", link.questionId, id);
    for (const address of e.readerAddress) this.add("ReaderAddress", JSON.stringify([e.productScope, e.relationshipScope, address]), id);
    for (const owner of e.fixtureScope.ownerIds) this.add("OwnerId", JSON.stringify([e.fixtureScope.fixtureId, owner]), id);
    for (const source of e.sourceRequirements) { for (const key of source.sourceCatalogKeys) this.add("SourceId", key, id); if (source.sourceKey) this.add("SourceReferenceKey", source.sourceKey, id); }
    for (const source of e.sourceHashes) this.add("SourceHash", source.hash, id);
    for (const group of e.sourceGroups) this.add("SourceGroupId", JSON.stringify([e.identity.catalogKey, group.originalIndex, group.originalId]), id);
    for (const node of e.actualEvidenceWitnesses) this.add("ActualEvidenceId", node, id);
    for (const root of e.informationRootAddresses) this.add("CanonicalFactRoot", root.address, id);
    for (const gate of e.normalizedGateResults) this.add("GateState", gate.gate + ":" + gate.state, id);
    for (const reason of e.withholdReasons) this.add("WithholdReason", reason, id);
  }
  lookup(dimension: string, value: string): readonly string[] { return [...(this.dimensions.get(dimension)?.get(value) ?? [])].sort(); }
  export() { return Object.fromEntries([...this.dimensions].sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, values]) => [key, Object.fromEntries([...values].sort(([a], [b]) => a.localeCompare(b, "en")).map(([value, ids]) => [value, [...ids].sort()]))])); }
}
