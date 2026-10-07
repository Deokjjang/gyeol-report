import { getMbtiSourceProfile } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import { MBTI_TRAIT_DOMAINS, semanticOrder, type MbtiDiagnostic, type MbtiSourceDomain, type MbtiSourceNode, type MbtiType } from "./mbtiSemanticCore";

const object = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const SOURCE_METADATA = ["type", "sourceStatus", "preferenceAxes", "functionStack", "enrichment"];
const SOURCE_REFERENCES: Readonly<Record<string, MbtiSourceDomain>> = {
  recommendedJobs: "RECOMMENDED_JOBS", avoidJobsOrEnvironments: "AVOID_JOBS_OR_ENVIRONMENTS",
  relationshipHints: "RELATIONSHIP_PAIR", notablePairs: "RELATIONSHIP_PAIR", myeongliBridgeHints: "MYEONGLI_BRIDGE_HINT",
  reportUseCases: "GROWTH", titleKo: "IDENTITY", archetype: "IDENTITY", oneLine: "IDENTITY", closeKeywords: "IDENTITY", farKeywords: "IDENTITY",
};
const SUMMARY_DOMAINS: Readonly<Record<string, MbtiSourceDomain>> = { identity: "IDENTITY", strength: "STRENGTHS", risk: "RISKS", growthStrategy: "GROWTH" };
const TRAIT_METADATA = ["id", "productDomains", "sourceCoverage"];
const TRAIT_REFERENCES: Readonly<Record<string, string>> = {
  label: "TRAIT_LABEL", strongLine: "ALTERNATIVE_TRAIT_REALIZATION", positiveUse: "DOWNSTREAM_APPLICATION", risk: "CONDITIONAL_SHADOW_REFERENCE",
};

/** Inventory every primitive leaf; no prose matching, type stereotype or semantic
 * inference. Unrecognized shape/field stays unclassified and fails coverage. */
export function inventoryMbtiSource(type: MbtiType, source: unknown) {
  const nodes: MbtiSourceNode[] = [], hardErrors: MbtiDiagnostic[] = [];
  if (!object(source) || source.type !== type || !object(source.traits)) {
    return { nodes, hardErrors: [{ code: "INVALID_MBTI_SOURCE", sourceNodeIds: [] }], sourceMetadata: {} };
  }
  function walk(value: unknown, path: string[], stable: string[], coverage?: string) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const key = object(item) && typeof item.id === "string" ? item.id : object(item) && typeof item.withType === "string" ? item.withType : String(index);
        walk(item, [...path, String(index)], [...stable, key], object(item) && typeof item.sourceCoverage === "string" ? item.sourceCoverage : coverage);
      }); return;
    }
    if (object(value)) {
      Object.keys(value).sort(semanticOrder).forEach(key => walk(value[key], [...path, key], [...stable, key], coverage)); return;
    }
    if (!["string", "boolean", "number"].includes(typeof value) && value !== null) {
      hardErrors.push({ code: "INVALID_SOURCE_LEAF", sourceNodeIds: [], detail: path.join(".") }); return;
    }
    const root = path[0], field = path[3];
    let sourceDomain: MbtiSourceDomain | null = null, classification: MbtiSourceNode["classification"] = "UNCLASSIFIED", reason = "EXPLICIT_ANNOTATION_REQUIRED";
    if (SOURCE_METADATA.includes(root)) { classification = "METADATA"; reason = "SOURCE_METADATA"; }
    else if (Object.hasOwn(SOURCE_REFERENCES, root)) { sourceDomain = SOURCE_REFERENCES[root]; classification = "REFERENCE_ONLY"; reason = "DOWNSTREAM_OR_DISPLAY_REFERENCE"; }
    else if (root === "summary" && Object.hasOwn(SUMMARY_DOMAINS, path[1])) { sourceDomain = SUMMARY_DOMAINS[path[1]]; classification = "REFERENCE_ONLY"; reason = "SUMMARY_OF_TRAITS"; }
    else if (root === "traits" && Object.hasOwn(MBTI_TRAIT_DOMAINS, path[1])) {
      sourceDomain = MBTI_TRAIT_DOMAINS[path[1] as keyof typeof MBTI_TRAIT_DOMAINS];
      if (TRAIT_METADATA.includes(field)) { classification = "METADATA"; reason = "TRAIT_METADATA"; }
      else if (field === "matchingMyeongliSignals") { sourceDomain = "MYEONGLI_BRIDGE_HINT"; classification = "REFERENCE_ONLY"; reason = "NO_BRIDGE_CIRCULARITY"; }
      else if (Object.hasOwn(TRAIT_REFERENCES, field)) { classification = "REFERENCE_ONLY"; reason = TRAIT_REFERENCES[field]; }
    }
    const stablePath = stable.map(encodeURIComponent).join(":"), id = `mbti:${type}:${stablePath}`;
    nodes.push({ id, mbtiType: type, sourceDomain, sourcePath: `/${path.map(s => s.replace(/~/g, "~0").replace(/\//g, "~1")).join("/")}`,
      stablePath, value: value as MbtiSourceNode["value"], classification, reason, ...(coverage ? { sourceCoverage: coverage } : {}) });
  }
  walk(source, [], []);
  const seen = new Set<string>();
  for (const node of nodes) { if (seen.has(node.id)) hardErrors.push({ code: "DUPLICATE_SOURCE_NODE_ID", sourceNodeIds: [node.id] }); seen.add(node.id); }
  return { nodes: nodes.sort((a, b) => semanticOrder(a.id, b.id)), hardErrors,
    sourceMetadata: structuredClone({ sourceStatus: source.sourceStatus ?? null, enrichment: source.enrichment ?? null }) };
}

export function readMbtiSemanticSource(type: MbtiType) {
  try {
    const source = getMbtiSourceProfile(type);
    if (!source) return { ok: false as const, error: "MBTI_SOURCE_MISSING" };
    return { ok: true as const, source };
  } catch (error) {
    return { ok: false as const, error: error instanceof SyntaxError ? "MBTI_SOURCE_PARSE_FAILED" : "MBTI_SOURCE_READ_FAILED" };
  }
}
