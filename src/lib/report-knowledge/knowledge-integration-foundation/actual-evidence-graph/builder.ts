import type { ActualEvidenceNode, EvidenceOwner, EvidenceProducerIdentity, EvidenceParticipant, EvidenceTemporalWindow, NodeKind, GraphInput } from "./types";
import { ActualGraphIndex, evidenceHash } from "./graph";
import type { EvidenceKnowledgeIndex } from "./knowledge";
export type NodeOptions = { participants?: EvidenceParticipant[]; temporal?: EvidenceTemporalWindow; parents?: string[]; independent?: boolean; root?: boolean; certainty?: ActualEvidenceNode["certainty"]; sources?: ActualEvidenceNode["sources"]; direction?: ActualEvidenceNode["direction"] };
export class EvidenceBuilder {
  readonly index: ActualGraphIndex;
  readonly anchors = new Map<string, string>();
  constructor(readonly input: GraphInput, readonly knowledge: EvidenceKnowledgeIndex) { this.index = new ActualGraphIndex(input.context); }
  owner(slot: "person" | "personA" | "personB"): EvidenceOwner {
    const e = this.input.evidence, originalPersonId = e.composition.product === "saju_mbti_compatibility" ? e.composition.result.evidence.persons[slot as "personA" | "personB"]?.personId ?? null : null;
    return { slot, fixtureOwnerId: this.input.context.owners[slot] ?? "", originalPersonId };
  }
  producer(file: string, symbol: string, version: string, system = "myeongli"): EvidenceProducerIdentity { return { file: `src/lib/${file}.ts`, symbol, version, system }; }
  node(kind: NodeKind, owner: EvidenceOwner, producer: EvidenceProducerIdentity, id: string | null, pointer: string, value: unknown, options: NodeOptions = {}): ActualEvidenceNode {
    // A/B is an input slot, not a new natal fact. For ID-less pillar observations
    // use the verified owner/position/slot/value tuple; retain the exact source
    // pointer separately. Explicit MBTI input is likewise owned by the person.
    const observationIdentity = id ?? (kind === "CALCULATED_NATAL_FACT" && options.participants?.length ? ["natal-participants", options.participants] : kind === "MBTI_INPUT_TYPE" ? "explicit-mbti-input" : pointer);
    const factIdentity = [owner.fixtureOwnerId, producer, observationIdentity, options.participants ?? [], options.temporal ?? null, options.direction ?? null, value];
    const n = this.index.add({ kind, owner, producer, fact: { producerEvidenceId: id, observationPointer: pointer, addressability: id ? "ORIGINAL_ID" : "PRODUCER_OBSERVATION_ONLY", rootId: options.root ? `aeg:root:${evidenceHash(factIdentity)}` : null, rootType: !options.root ? null : kind === "MBTI_SOURCE_NODE" ? "SOURCE_ATTRIBUTION" : kind === "MBTI_INPUT_TYPE" || kind === "CONTEXT_INPUT" ? "SELF_REPORTED_INPUT" : "PRODUCER_OBSERVATION", independentFact: options.independent ?? false }, value, participants: options.participants ?? [], temporal: options.temporal ?? null, certainty: options.certainty ?? "confirmed", direction: options.direction ?? null, sources: options.sources ?? [], blockers: [] });
    for (const parent of options.parents ?? []) this.index.link(n.id, parent);
    n.participants.forEach((_, i) => this.index.link(n.id, `${n.id}#/participants/${i}`, "HAS_PARTICIPANT", false));
    if (n.direction) this.index.link(n.id, `${n.id}#/direction`, "HAS_DIRECTION", false);
    if (n.temporal) this.index.link(n.id, `${n.id}#/temporal`, "HAS_EFFECTIVE_PERIOD", false);
    n.sources.forEach((_, i) => this.index.link(n.id, `${n.id}#/sources/${i}`, "USES_SOURCE_DECLARATION", false));
    if (id === null && options.independent) this.index.block(n, "UNADDRESSABLE_PRODUCER_OBSERVATION", [pointer]);
    return n;
  }
  reference(n: ActualEvidenceNode, owner: string, ids: readonly string[], code = "UNKNOWN_EVIDENCE_ID") {
    for (const id of [...new Set(ids)]) {
      const found = this.index.resolve(owner, id);
      if (found.length === 1) this.index.link(n.id, found[0].id, found[0].kind === "MBTI_SOURCE_NODE" ? "USES_MBTI_SOURCE_NODE" : found[0].kind === "SEMANTIC_DERIVATION" ? "USES_SEMANTIC_CONTRIBUTION" : "DERIVED_FROM_ACTUAL_EVIDENCE");
      else { n.ancestry.missingIds.push(id); this.index.block(n, code, [id]); }
    }
  }
  requirement(owner: EvidenceOwner, code: string, pointer: string, unsupported = false, refs: string[] = []) {
    const n = this.node(unsupported ? "UNSUPPORTED_REQUIREMENT" : "UNKNOWN_REQUIREMENT", owner, this.producer("interpretation-v4/runtimeProjection", "V4RuntimeEvidence", "v4-runtime-evidence-1", "requirement"), null, pointer, { code, actualFact: false });
    this.index.block(n, code, refs); return n;
  }
}
