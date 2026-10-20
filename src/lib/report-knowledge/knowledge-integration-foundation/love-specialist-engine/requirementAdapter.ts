import { LOVE_SOURCE_REGISTRY } from "../../love-product-research/sourceRegistry";
import { LOVE_RELEASE_MATERIALS } from "../../../interpretation-v4/loveReleaseMaterials";
import { RELATIONSHIP_STATUSES } from "../../../report-generation/reportInputTypes";
import { resolveCareerReference } from "../career-specialist-engine/requirementAdapter";
import { adaptComprehensiveRequirements } from "../comprehensive-specialist-engine/requirementAdapter";
import { isRecord } from "../normalization";
import { canonicalJson, hash, recordHash } from "../sourceReader";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate } from "../knowledge-binder/types";
import type { Material, SourceRef } from "../../love-product-research/researchTypes";
import type { LoveSourceResolution } from "./types";
type SourceIdentity = Pick<SourceRef,"sourceKind"|"sourceId"|"recordSha256"|"sourceFileSha256">;
// These frozen helpers read only these identity fields/id/sourceRefs. Narrow
// structural views reuse their exact checks without copying product policies.
const resolveOriginal = resolveCareerReference as (ref: SourceIdentity, catalog: KnowledgeBinderCatalog) => ReturnType<typeof resolveCareerReference>;
const addNative = adaptComprehensiveRequirements as unknown as (original: KnowledgeCandidate, view: { id: string; sourceRefs: SourceIdentity[] }, catalog: KnowledgeBinderCatalog) => ReturnType<typeof adaptComprehensiveRequirements>;
const registry = new Map(LOVE_SOURCE_REGISTRY.map(r=>[r.key,r]));
export function resolveLoveReference(ref: SourceIdentity, catalog: KnowledgeBinderCatalog) {
  const shared=resolveOriginal(ref,catalog);if(shared.verified)return shared;
  const inputFile="src/lib/report-generation/reportInputTypes.ts",legacyFile="src/lib/interpretation-v4/loveReleaseMaterials.ts";
  if(ref.sourceKind==="input_contract"&&ref.sourceId==="input-contract:relationshipStatus"&&catalog.input.frozen.get(inputFile)===ref.sourceFileSha256&&recordHash(RELATIONSHIP_STATUSES)===ref.recordSha256)return {record:null,originalId:"RELATIONSHIP_STATUSES",locator:{file:inputFile,exportName:"RELATIONSHIP_STATUSES",recordSha256:ref.recordSha256},method:"EXACT_ORIGINAL_INPUT_ENUM_REFERENCE_ONLY",verified:true};
  if(ref.sourceKind==="legacy_application"&&ref.sourceId.startsWith("legacy-love:")){
    const key=ref.sourceId.slice("legacy-love:".length),row=Object.entries(LOVE_RELEASE_MATERIALS).find(([k])=>k===key);
    if(row&&catalog.input.frozen.get(legacyFile)===ref.sourceFileSha256&&hash(catalog.reader.text(legacyFile))===ref.sourceFileSha256&&recordHash(row[1])===ref.recordSha256)return {record:null,originalId:ref.sourceId,locator:{file:legacyFile,exportName:"LOVE_RELEASE_MATERIALS."+key,recordSha256:ref.recordSha256},method:"EXACT_ORIGINAL_LEGACY_APPLICATION_REFERENCE_ONLY",verified:true};
  }
  return shared;
}
export function adaptLoveRequirements(original: KnowledgeCandidate, material: Material, catalog: KnowledgeBinderCatalog) {
  const file="src/lib/report-knowledge/love-product-research/sourceRegistry.ts";
  if(hash(catalog.reader.text(file))!==catalog.input.frozen.get(file)||registry.size!==LOVE_SOURCE_REGISTRY.length)throw Error("LOVE_SOURCE_REGISTRY_CHANGED_OR_DUPLICATED");
  const sources:LoveSourceResolution[]=[],nativeRefs:SourceIdentity[]=[];
  for(const key of material.sourceKeys){
    const ref=registry.get(key)??null,rs=ref?catalog.semantic.graph.byId.get(ref.id)??[]:[],rr=rs.length===1?rs[0]:null,resolved=ref?resolveLoveReference(ref,catalog):null,r=resolved?.record??null;
    const verified=!!ref&&!!rr&&catalog.sourceChecks.get(rr.catalogKey)?.state==="PASS"&&!!resolved?.verified;
    const ancestors=r?catalog.sourceAncestors(r.catalogKey).map(k=>catalog.semantic.graph.byKey.get(k)!).filter(Boolean):[];
    const row:LoveSourceResolution={key,registry:ref,registryLocator:rr?.locator??null,originalLocator:resolved?.locator??null,originalId:resolved?.originalId??null,verified,method:resolved?.method??"CONTRACT_NOT_MACHINE_CHECKABLE",requiredAncestors:ancestors.map(a=>({catalogKey:a.catalogKey,originalId:a.originalId,file:a.locator.file,pointer:a.locator.pointer??null})),blockers:verified?[]:["ORIGINAL_SOURCE_KEY_ID_LOCATOR_OR_HASH_UNRESOLVED"],nativeRequirements:[]};sources.push(row);
    if(!verified||ref?.sourceKind!=="natal_research"||!r)continue;
    const raw=catalog.raw.get(r.catalogKey),targetId=isRecord(raw)&&typeof raw.targetId==="string"?raw.targetId:r.originalId,targets=catalog.semantic.graph.byId.get(targetId)??[],target=targets.length===1?targets[0]:null;
    if(!target||!catalog.sourceAncestors(r.catalogKey).includes(target.catalogKey)||catalog.sourceChecks.get(target.catalogKey)?.state!=="PASS")continue;
    const def=catalog.raw.get(target.catalogKey);if(!isRecord(def)||def.category!=="ten_god")continue;
    nativeRefs.push({sourceKind:"natal_research",sourceId:target.originalId,recordSha256:target.locator.recordSha256!,sourceFileSha256:catalog.input.frozen.get(target.locator.file)!});
  }
  const unique=[...new Map(nativeRefs.map(r=>[r.sourceId,r])).values()],adapted=addNative(original,{id:material.id,sourceRefs:unique},catalog);
  for(const s of sources)if(s.registry?.sourceKind==="natal_research")s.nativeRequirements=adapted.added.filter(a=>s.requiredAncestors.some(r=>r.originalId===a.sourceKey)).map(a=>a.id);
  if(canonicalJson({...adapted.candidate.requirement,sourceRequirements:original.requirement.sourceRequirements})!==canonicalJson(original.requirement))throw Error("ORIGINAL_LOVE_REQUIREMENTS_RELAXED");
  return {candidate:adapted.candidate,sources};
}
