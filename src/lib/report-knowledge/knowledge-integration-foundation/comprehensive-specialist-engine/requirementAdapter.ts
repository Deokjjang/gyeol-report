import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate, NormalizedSourceRequirement } from "../knowledge-binder/types";
import type { Material } from "../../comprehensive-product-research/researchTypes";
import { STRUCTURE_VERSION } from "../../../interpretation-v4/structureTypes";
import { canonicalJson } from "../sourceReader";
/** Add only the existence observation supported by an exact native definition.
 * The original definition requirement, meaning, prerequisites and all unknown
 * conditions remain mandatory. A matching god is not an applied personality. */
export function adaptComprehensiveRequirements(original: KnowledgeCandidate, material: Material, catalog: KnowledgeBinderCatalog) {
    const nativeTypeFile = "src/lib/saju/types.ts", nativeGods = catalog.reader.typeLiterals(nativeTypeFile, "TenGod");
    if (catalog.reader.files.get(nativeTypeFile) !== catalog.input.frozen.get(nativeTypeFile))
        throw Error("NATIVE_TEN_GOD_TYPE_CHANGED");
    const candidate = structuredClone(original), added: NormalizedSourceRequirement[] = [], producer = { file: "src/lib/interpretation-v4/strength.ts", symbol: "collectStructureAtoms", version: STRUCTURE_VERSION, system: "myeongli" };
    for (const ref of material.sourceRefs) {
        if (ref.sourceKind !== "natal_research")
            continue;
        const matches = catalog.semantic.graph.byId.get(ref.sourceId) ?? [];
        if (matches.length !== 1)
            continue;
        const record = matches[0], raw = catalog.raw.get(record.catalogKey);
        if (catalog.sourceChecks.get(record.catalogKey)?.state !== "PASS" || record.locator.recordSha256 !== ref.recordSha256 || catalog.input.frozen.get(record.locator.file) !== ref.sourceFileSha256 || !isRecord(raw) || raw.category !== "ten_god" || typeof raw.labelKo !== "string" || !isRecord(raw.support) || raw.support.calculation !== "native" || !Array.isArray(raw.support.calculationRefs) || !raw.support.calculationRefs.includes("getTenGod"))
            continue;
        const aliases = [raw.labelKo, ...(Array.isArray(raw.aliases) ? raw.aliases : [])].filter((s): s is string => typeof s === "string" && nativeGods.includes(s));
        if (new Set(aliases).size !== 1)
            continue;
        const nativeGod = aliases[0];
        added.push({ id: material.id + ":native-god:" + record.originalId, originalField: "/sourceRefs/" + material.sourceRefs.indexOf(ref), originalDeclaration: { originalRef: ref, definitionLocator: record.locator, nativeTypeLocator: { file: nativeTypeFile, exportName: "type:TenGod", pointer: "/" + nativeGod, fileSha256: catalog.input.frozen.get(nativeTypeFile) }, aliasResolution: "EXACT_ORIGINAL_ALIAS_IN_EXISTING_NATIVE_TYPE", observationOnly: true }, sourceKey: record.originalId, sourceCatalogKeys: [record.catalogKey], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_NATAL_FACT"], owner: "person", producer, fields: [{ path: "value.god", equals: nativeGod }] }, required: true, gaps: [] });
    }
    candidate.requirement.sourceRequirements.push(...added);
    if (canonicalJson(candidate.requirement.sourceRequirements.slice(0, original.requirement.sourceRequirements.length)) !== canonicalJson(original.requirement.sourceRequirements) || canonicalJson(candidate.requirement.unresolvedConditions) !== canonicalJson(original.requirement.unresolvedConditions))
        throw Error("ORIGINAL_REQUIREMENTS_RELAXED");
    return { candidate, added };
}
