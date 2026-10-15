import { canonicalJson, recordHash } from "../sourceReader";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { RoleSource } from "./researchCatalog";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import { isRecord } from "../normalization";
export function validateRoleSource(source: RoleSource, owner: string, enteredType: string | null, catalog: KnowledgeBinderCatalog, actual?: ActualBindingIndex) {
  const expectedOwner = source.domain === "PARENTS" ? "A" : source.domain === "CHILDREN" ? "B" : null;
  const expectedArea = source.domain === "PARENTS" ? "parenting" : "child";
  const file = catalog.reader.text(source.file), original: unknown = JSON.parse(file);
  let value: unknown = original;
  for (const segment of source.pointer.split("/").slice(1)) value = isRecord(value) || Array.isArray(value) ? (value as Record<string, unknown>)[segment] : undefined;
  const hashVerified = catalog.reader.files.get(source.file) === source.sourceFileSha256 && value !== undefined && recordHash(value) === source.recordSha256 && canonicalJson(value) === canonicalJson(source.raw);
  const ownerMatched = owner === source.owner && source.owner === expectedOwner && source.area === expectedArea && source.pointer.startsWith("/traits/" + expectedArea + "/");
  const typeMatched = enteredType !== null && enteredType === source.type;
  const scoringNodes = actual ? [...actual.graph.nodes.values()].filter(n => n.owner.fixtureOwnerId === actual.owner(owner as "A" | "B") && n.kind === "MBTI_SOURCE_NODE" && isRecord(n.value) && n.value.sourceDomain === source.domain && n.value.classification === "SCORING_SEMANTIC") : [];
  // Current non-romantic product projection does not support either domain.
  return { originalId: source.id, sourceDeclared: true, sourceFile: source.file, pointer: source.pointer, traitId: source.raw.id, recordHash: source.recordSha256, fileHash: source.sourceFileSha256, sourceCoverage: source.sourceCoverage, classification: "DOCUMENTARY_SOURCE_NOT_PERSON_OBSERVATION", originalDomain: source.domain, actualOwner: owner, enteredType, sourceType: source.type, hashVerified, ownerMatched, typeMatched, scoringNodes: scoringNodes.map(n => n.id), scoringProjectionSupported: false, actualPersonObservationIssued: false, empiricalDevelopmentVerified: false, state: hashVerified ? "SOURCE_HASH_VERIFIED" : "SOURCE_HASH_MISMATCH", states: ["SOURCE_DECLARED", hashVerified ? "SOURCE_HASH_VERIFIED" : "SOURCE_HASH_MISMATCH", ownerMatched ? "OWNER_MATCHED" : source.domain + "_SOURCE_WRONG_OWNER", typeMatched ? "OWNER_TYPE_MATCHED" : "OWNER_TYPE_WITHHELD", "SCORING_PROJECTION_NOT_SUPPORTED", "SEMANTIC_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"] };
}
