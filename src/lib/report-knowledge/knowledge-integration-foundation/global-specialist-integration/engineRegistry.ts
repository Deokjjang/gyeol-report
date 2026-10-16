import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { EngineRegistration } from "./types";

export class GlobalSpecialistRegistry {
  readonly byEngine = new Map<string, EngineRegistration>();
  readonly byScope = new Map<string, EngineRegistration>();
  constructor(entries: readonly EngineRegistration[]) {
    for (const entry of entries) {
      const scope = JSON.stringify([entry.productKey, entry.relationshipCategory]);
      if (this.byEngine.has(entry.engineId) || this.byScope.has(scope)) throw Error("DUPLICATE_ENGINE_OR_SCOPE");
      this.byEngine.set(entry.engineId, entry); this.byScope.set(scope, entry);
    }
  }
  route(request: Pick<KnowledgeBindingRequest, "product" | "relationship">): EngineRegistration {
    const entry = this.byScope.get(JSON.stringify([request.product, request.relationship]));
    if (!entry) throw Error("UNREGISTERED_PRODUCT_RELATIONSHIP");
    return entry;
  }
  assertRequest(entry: EngineRegistration, request: KnowledgeBindingRequest): void {
    if (this.route(request) !== entry || request.graph.product !== entry.productKey || request.graph.relationship !== entry.relationshipCategory || request.graph.context.fixtureId !== request.graphInput.context.fixtureId || !entry.fixtureIds.includes(request.graph.context.fixtureId)) throw Error("ENGINE_GRAPH_SCOPE_MISMATCH");
    if (request.graphInput.evidence.productType !== request.product || request.graphInput.evidence.composition.product !== request.product) throw Error("ENGINE_PRODUCER_SCOPE_MISMATCH");
    if (request.graphInput.evidence.input.kind === "compatibility" && request.graphInput.evidence.composition.product === "saju_mbti_compatibility" && request.graphInput.evidence.composition.result.evidence.category !== request.relationship) throw Error("ENGINE_RELATIONSHIP_SCOPE_MISMATCH");
  }
}
