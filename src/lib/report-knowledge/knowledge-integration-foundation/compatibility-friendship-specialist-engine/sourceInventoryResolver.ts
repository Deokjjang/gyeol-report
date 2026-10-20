import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import { pairWitnessErrors } from "../compatibility-love-specialist-engine/pairWitness";
import type { Material } from "./researchCatalog";
export function resolveSourceInventory(material: Material, catalog: KnowledgeBinderCatalog, actual?: ActualBindingIndex) {
  return material.ownedSources.map((source, index) => {
    const refs = catalog.originalIds.get(source.sourceRef) ?? [], ref = refs.length === 1 ? refs[0] : null;
    const documentary = source.sourceRef.startsWith("frpr:source:"), inventory = source.sourceRef.startsWith("frpr:inventory:");
    const kinds: Record<string, string[]> = { "personal-natal": ["CALCULATED_NATAL_FACT"], "individual-mbti": ["MBTI_SOURCE_NODE"], "individual-fusion": ["FUSION_DERIVATION"], "canonical-pair": ["CANONICAL_PAIR_FACT"], "mbti-pair": ["SOURCE_DECLARATION"], "recipient-ten-god": ["DIRECTIONAL_RELATION_FACT"] };
    const kind = source.sourceRef.split(":").at(-1)!, owner = source.owner === "A" || source.owner === "DIRECTION_AB" || source.owner === "PAIR_AB" ? "A" : source.owner === "B" || source.owner === "DIRECTION_BA" || source.owner === "PAIR_BA" ? "B" : "PAIR";
    const observations = actual ? [...actual.graph.nodes.values()].filter(n => (kinds[kind] ?? []).includes(n.kind) && n.owner.fixtureOwnerId === actual.owner(owner) && (!source.owner.startsWith("DIRECTION_") || n.direction?.recipient === actual.owner(owner === "A" ? "B" : "A"))).map(n => ({ nodeId: n.id, originalEvidenceId: n.fact.producerEvidenceId, kind:n.kind, owner: n.owner.fixtureOwnerId, errors: pairWitnessErrors(actual, n), applicationApproved: false })) : [];
    return { source, originalField: "/ownedSources/" + index, referenceKind: documentary ? "DOCUMENTARY_EDITORIAL_REFERENCE" : inventory ? "SOURCE_INVENTORY_REFERENCE" : "UNSUPPORTED_COMPARISON", catalogKey: ref?.catalogKey ?? null, sourceLocator: ref?.locator ?? null, sourceHash: ref?.locator.recordSha256 ?? null, sourceVerified: !!ref && catalog.sourceChecks.get(ref.catalogKey)?.state === "PASS", accessScope: ref ? catalog.raw.get(ref.catalogKey)?.access ?? null : null, actualEvidenceId: null, requirementState: documentary ? "DOCUMENTARY_ONLY_NOT_PERSON_OBSERVATION" : "SOURCE_ROLE_NOT_MACHINE_CHECKABLE", requiredEvidenceSelector: null, observations, observationsAreProposalOnly: true, createsSourceAnd: false };
  });
}
