import { ExactSourceResolver } from "./exactSourceResolver";
import { isRecord } from "../normalization";
import { recordHash } from "../sourceReader";
import type { KnowledgeCatalogRecord } from "../types";
import type { SourceProof, VerificationReceipt } from "../source-verification/types";
import type { SourceResolution } from "./types";

// Exact existing IDs in the file explicitly declared by repo-gods. This is an
// identity contract, never a similarity search or approval of temporal prose.
export const TEMPORAL_DEFINITION_IDS = {
  비견: "foundation:ten_god:bijian", 겁재: "foundation:ten_god:jie_cai",
  식신: "foundation:ten_god:shi_shen", 상관: "foundation:ten_god:shang_guan",
  편재: "foundation:ten_god:pian_cai", 정재: "foundation:ten_god:zheng_cai",
  편관: "foundation:ten_god:qi_sha", 정관: "foundation:ten_god:zheng_guan",
  편인: "foundation:ten_god:pian_yin", 정인: "foundation:ten_god:zheng_yin",
} as const;
export type TemporalGod = keyof typeof TEMPORAL_DEFINITION_IDS;
const researchFile = "src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts";
const declarationFile = "src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts";
const definitionFile = "src/lib/report-knowledge/sajuFoundationKnowledge.ts";
export type TemporalTenGodSourceContract = {
  version: "temporal-ten-god-source-contract-v1";
  originalResearchId: string; originalRecordHash: string | null; originalSourceVersion: string | null;
  originalResearch: SourceProof | null;
  traditionalReference: { kind: "NATURAL_LANGUAGE_SUMMARY_NOT_SOURCE_ID"; text: string | null };
  traditionalDefinition: { state: "SOURCE_TECHNICALLY_VERIFIED" | "UNVERIFIED_SOURCE";
    sourceKind: "TRADITIONAL_DEFINITION"; sourceRecordKind: "SOURCE_KNOWLEDGE";
    exactSourceRecordIdentity: string | null; sourceHash: string | null;
    sourceVersion: string | null; declaredEdition: string | null;
    exactDefinitionSource: SourceProof | null; declaration: SourceProof | null;
    originalDefinitionReview: string | null; originalDefinitionReferences: unknown[];
    verificationLevel: "REPOSITORY_DEFINITION_ONLY_NOT_EXTERNAL_TRADITION_REVIEW" };
  conditionalApplication: { state: "UNVERIFIED_SOURCE"; sourceKind: "CONDITIONAL_TEMPORAL_APPLICATION";
    scope: readonly ["dayun", "annual", "month"]; meaning: { dayun: string; annual: string; month: string } | null;
    unresolvedConditions: string[]; meaningReview: "MEANING_REVIEW_REQUIRED" };
  sourceResolved: boolean; sourceUnresolved: true; customerApproval: "CUSTOMER_APPROVAL_PENDING";
  establishesPersonalEvidence: false; newIndependentFacts: 0; customerApproved: false;
  blockingReasons: string[];
};
/** Extends the existing exact resolver without changing native receipts,
 * research records, the Binder, or the global frozen overlay. */
export class TemporalTenGodSourceResolver extends ExactSourceResolver {
  async temporalContract(record: KnowledgeCatalogRecord): Promise<TemporalTenGodSourceContract> {
    const result: TemporalTenGodSourceContract = {
      version: "temporal-ten-god-source-contract-v1", originalResearchId: record.originalId,
      originalRecordHash: null, originalSourceVersion: null, originalResearch: null,
      traditionalReference: { kind: "NATURAL_LANGUAGE_SUMMARY_NOT_SOURCE_ID", text: null },
      traditionalDefinition: { state: "UNVERIFIED_SOURCE", sourceKind: "TRADITIONAL_DEFINITION",
        sourceRecordKind: "SOURCE_KNOWLEDGE", exactSourceRecordIdentity: null, sourceHash: null,
        sourceVersion: null, declaredEdition: null, exactDefinitionSource: null, declaration: null,
        originalDefinitionReview: null, originalDefinitionReferences: [],
        verificationLevel: "REPOSITORY_DEFINITION_ONLY_NOT_EXTERNAL_TRADITION_REVIEW" },
      conditionalApplication: { state: "UNVERIFIED_SOURCE", sourceKind: "CONDITIONAL_TEMPORAL_APPLICATION",
        scope: ["dayun", "annual", "month"], meaning: null,
        unresolvedConditions: ["EXACT_TEMPORAL_MEANING_SOURCE_NOT_DECLARED", "ACTUAL_OWNER_DIRECTION_TIME_REQUIRED",
          "ANCESTOR_DOMAIN_AND_SOURCE_GROUP_GATES_REMAIN", "PRODUCT_AND_COUNTEREXAMPLE_REVIEW_REQUIRED"],
        meaningReview: "MEANING_REVIEW_REQUIRED" },
      sourceResolved: false, sourceUnresolved: true, customerApproval: "CUSTOMER_APPROVAL_PENDING",
      establishesPersonalEvidence: false, newIndependentFacts: 0, customerApproved: false, blockingReasons: [],
    };
    try {
      const registered = this.records.filter(r => r.catalogKey === record.catalogKey);
      if (registered.length !== 1 || recordHash(registered[0]) !== recordHash(record)
        || record.locator.file !== researchFile || record.locator.exportName !== "TEMPORAL_GOD_ROLES")
        throw Error("EXACT_REGISTERED_TEMPORAL_RECORD_REQUIRED");
      const raw = await this.record(record);
      if (!isRecord(raw) || typeof raw.god !== "string" || !Object.hasOwn(TEMPORAL_DEFINITION_IDS, raw.god)
        || raw.id !== `tr:god:${raw.god}` || raw.id !== record.originalId
        || !Array.isArray(raw.sourceRefs) || !raw.sourceRefs.includes("repo-gods")
        || typeof raw.traditionalRef !== "string" || raw.approvedForCustomer !== false || raw.connectedToRuntime !== false
        || ![raw.dayun, raw.saeun, raw.wolun, raw.extraEvidence].every(v => typeof v === "string"))
        throw Error("ORIGINAL_TEMPORAL_DECLARATION_REQUIRED");
      result.originalResearch = await this.proof(record.locator, record.originalId, record.catalogKey);
      result.originalRecordHash = result.originalResearch.actualHash;
      result.originalSourceVersion = result.originalResearch.sourceVersion;
      result.traditionalReference.text = raw.traditionalRef;
      result.conditionalApplication.meaning = { dayun: String(raw.dayun), annual: String(raw.saeun), month: String(raw.wolun) };
      result.conditionalApplication.unresolvedConditions.unshift(String(raw.extraEvidence));
      const declarations = this.records.filter(r => r.originalId === "repo-gods" && r.locator.file === declarationFile && r.locator.exportName === "TEMPORAL_SOURCES");
      if (declarations.length !== 1) throw Error("EXACT_REPO_GODS_DECLARATION_REQUIRED");
      const declaration = await this.record(declarations[0]);
      if (!isRecord(declaration) || declaration.kind !== "repository" || typeof declaration.edition !== "string"
        || typeof declaration.locator !== "string" || !declaration.locator.split(";").includes(definitionFile)
        || !declaration.locator.split(";").includes("src/lib/report-knowledge/annualFortuneYearRules.ts"))
        throw Error("DEFINITION_FILE_NOT_EXPLICITLY_DECLARED");
      const exactId = TEMPORAL_DEFINITION_IDS[raw.god as TemporalGod];
      const definitions = this.records.filter(r => r.originalId === exactId && r.locator.file === definitionFile && r.locator.exportName === "SAJU_FOUNDATION_KNOWLEDGE" && r.kind === "SOURCE_KNOWLEDGE");
      if (definitions.length !== 1) throw Error("EXACT_DEFINITION_RECORD_REQUIRED");
      const definition = await this.record(definitions[0]);
      if (!isRecord(definition) || definition.id !== exactId || definition.category !== "ten_god"
        || definition.labelKo !== raw.god || !isRecord(definition.definition)
        || !["repository_only", "source_checked"].includes(String(definition.definition.review)) || typeof definition.definition.text !== "string"
        || !Array.isArray(definition.definition.sourceRefs)
        || !isRecord(definition.support) || !Array.isArray(definition.support.calculationRefs)
        || !definition.support.calculationRefs.includes("getTenGod")) throw Error("DEFINITION_CALCULATION_BASIS_REQUIRED");
      const proof = await this.proof(definitions[0].locator, exactId, definitions[0].catalogKey);
      proof.qualification = { sourceKind: "TRADITIONAL_DEFINITION", originalReferenceIsNotAnId: true,
        explicitFileDeclaration: declarations[0].originalId, identityContract: exactId,
        verifiesConditionalMeaning: false, verifiesExternalTraditionalSource: false, customerApproved: false };
      result.traditionalDefinition = { ...result.traditionalDefinition, state: "SOURCE_TECHNICALLY_VERIFIED",
        exactSourceRecordIdentity: exactId, sourceHash: proof.actualHash, sourceVersion: proof.sourceVersion,
        declaredEdition: declaration.edition, exactDefinitionSource: proof,
        originalDefinitionReview: String(definition.definition.review), originalDefinitionReferences: definition.definition.sourceRefs,
        declaration: await this.proof(declarations[0].locator, "repo-gods", declarations[0].catalogKey) };
      result.sourceResolved = true;
    } catch (e) { result.blockingReasons.push(e instanceof Error ? e.message : "UNVERIFIED_SOURCE"); }
    result.blockingReasons.push("CONDITIONAL_TEMPORAL_MEANING_UNVERIFIED", "MEANING_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING");
    return result;
  }
  override async resolve(receipt: VerificationReceipt): Promise<SourceResolution & { temporalTenGod?: TemporalTenGodSourceContract }> {
    const original = await super.resolve(receipt);
    if (receipt.originalLocator.file !== researchFile || receipt.referenceField !== "/traditionalRef/0") return original;
    const record = this.records.find(r => r.catalogKey === receipt.affectedCatalogKey);
    if (!record) return original;
    const contract = await this.temporalContract(record);
    // Preserve the original unresolved target/state. Definition verification
    // does not establish equivalence to its natural-language temporal meaning.
    return { ...original, temporalTenGod: contract };
  }
}
