import { CAREER_SOURCE_REGISTRY } from "../../career-product-research/sourceRegistry";
import type { Material, SourceRef } from "../../career-product-research/researchTypes";
import { isRecord } from "../normalization";
import { canonicalJson, hash, recordHash } from "../sourceReader";
import { JOB_STATUSES } from "../../../report-generation/reportInputTypes";
import { STRUCTURE_VERSION } from "../../../interpretation-v4/structureTypes";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeCandidate, NormalizedSourceRequirement } from "../knowledge-binder/types";
import type { CareerSourceResolution } from "./types";
export function resolveCareerReference(ref:SourceRef,catalog:KnowledgeBinderCatalog){
  const valid=(r:KnowledgeCandidate["record"])=>catalog.sourceChecks.get(r.catalogKey)?.state==="PASS"&&r.locator.recordSha256===ref.recordSha256&&catalog.input.frozen.get(r.locator.file)===ref.sourceFileSha256;
  let records=(catalog.originalIds.get(ref.sourceId)??[]).filter(valid),method="EXACT_ORIGINAL_ID";
  if(!records.length&&ref.sourceKind==="mbti_trait"){
    const m=/^mbti:([A-Z]{4}):traits:([^:]+):([^:]+)$/.exec(ref.sourceId);
    if(m){records=(catalog.originalIds.get(m[3])??[]).filter(r=>valid(r)&&r.namespace==="FOUNDATION"&&r.locator.file.endsWith(".json")&&(r.locator.pointer??"").startsWith("/traits/"+m[2]+"/")&&/^\d+$/.test((r.locator.pointer??"").slice(("/traits/"+m[2]+"/").length))&&(()=>{const profile=catalog.reader.json(r.locator.file);return isRecord(profile)&&profile.type===m[1];})());method="QUALIFIED_MBTI_REFERENCE_TO_EXACT_ORIGINAL_TRAIT";}
  }
  if(records.length===1)return {record:records[0],originalId:records[0].originalId,locator:records[0].locator,method,verified:true};
  const file="src/lib/report-generation/reportInputTypes.ts";
  if(ref.sourceKind==="input_contract"&&ref.sourceId==="input-contract:jobStatus"&&catalog.input.frozen.get(file)===ref.sourceFileSha256&&recordHash(JOB_STATUSES)===ref.recordSha256)return {record:null,originalId:"JOB_STATUSES",locator:{file,exportName:"JOB_STATUSES",recordSha256:ref.recordSha256,fileSha256:ref.sourceFileSha256},method:"EXACT_ORIGINAL_INPUT_ENUM_REFERENCE_ONLY",verified:true};
  return {record:null,originalId:null,locator:null,method:"CONTRACT_NOT_MACHINE_CHECKABLE",verified:false};
}
const registryByKey=new Map<string,SourceRef[]>();
for(const ref of CAREER_SOURCE_REGISTRY)registryByKey.set(ref.key,[...(registryByKey.get(ref.key)??[]),ref]);
const registryFile = "src/lib/report-knowledge/career-product-research/sourceRegistry.ts";
/** Existence-only native observations. The deep definition and every original
 * condition remain required. No job ability, income or application is inferred. */
export function adaptCareerRequirements(original: KnowledgeCandidate, material: Material, catalog: KnowledgeBinderCatalog) {
  if (hash(catalog.reader.text(registryFile)) !== catalog.input.frozen.get(registryFile)) throw Error("CAREER_SOURCE_REGISTRY_CHANGED");
  const candidate = structuredClone(original), resolutions: CareerSourceResolution[] = [], nativeFile = "src/lib/saju/types.ts", nativeGods = catalog.reader.typeLiterals(nativeFile,"TenGod");
  if(catalog.reader.files.get(nativeFile)!==catalog.input.frozen.get(nativeFile)) throw Error("NATIVE_TYPE_CHANGED");
  for (const key of material.sourceKeys) {
    const refs=registryByKey.get(key)??[], ref=refs.length===1?refs[0]:null;
    const registryRecords=ref?catalog.semantic.graph.byId.get(ref.id)??[]:[], rr=registryRecords.length===1?registryRecords[0]:null;
    const resolved=ref?resolveCareerReference(ref,catalog):null,record=resolved?.record??null;
    const verified=!!ref&&!!rr&&catalog.sourceChecks.get(rr.catalogKey)?.state==="PASS"&&!!resolved?.verified;
    const r:CareerSourceResolution={key,registry:ref,registryLocator:rr?.locator??null,originalId:resolved?.originalId??null,resolutionMethod:resolved?.method??"CONTRACT_NOT_MACHINE_CHECKABLE",originalLocator:resolved?.locator??null,verified,nativeTarget:null,nativeLocator:null,addedRequirementIds:[],blockers:verified?[]:["SOURCE_KEY_REGISTRY_HASH_OR_ID_UNRESOLVED"]};
    resolutions.push(r); if(!verified||!ref||!record||ref.sourceKind!=="natal_research")continue;
    const raw=catalog.raw.get(record.catalogKey);
    // Only an explicit original targetId may connect a deep definition to its
    // native definition. Broad ancestry or a matching label is insufficient.
    const targetId=isRecord(raw)&&typeof raw.targetId==="string"?raw.targetId:record.originalId;
    const targets=catalog.semantic.graph.byId.get(targetId)??[], target=targets.length===1?targets[0]:null;
    const def=target?catalog.raw.get(target.catalogKey):null;
    if(!target||catalog.sourceChecks.get(target.catalogKey)?.state!=="PASS"||!catalog.sourceAncestors(record.catalogKey).includes(target.catalogKey)||!isRecord(def)||def.category!=="ten_god"||!isRecord(def.support)||def.support.calculation!=="native"||!Array.isArray(def.support.calculationRefs)||!def.support.calculationRefs.includes("getTenGod")){r.blockers.push("NATIVE_EXISTENCE_CONTRACT_NOT_DECLARED");continue;}
    const aliases=[def.labelKo,...(Array.isArray(def.aliases)?def.aliases:[])].filter((x):x is string=>typeof x==="string"&&nativeGods.includes(x));
    if(new Set(aliases).size!==1){r.blockers.push("NATIVE_ALIAS_AMBIGUOUS");continue;}
    const producer={file:"src/lib/interpretation-v4/strength.ts",symbol:"collectStructureAtoms",version:STRUCTURE_VERSION,system:"myeongli"};
    const spec:NormalizedSourceRequirement={id:material.id+":native-god:"+key,originalField:"/sourceKeys/"+material.sourceKeys.indexOf(key),originalDeclaration:{sourceKey:key,registryRef:ref,registryLocator:rr?.locator,originalDefinition:record.locator,nativeDefinition:target.locator,nativeTypeFile:nativeFile,nativeTypeHash:catalog.input.frozen.get(nativeFile),observationOnly:true,positionScope:"Original natural position conditions remain unresolved; matched native participants are retained"},sourceKey:record.originalId,sourceCatalogKeys:[...new Set([record.catalogKey,target.catalogKey])],owner:"person",use:"ACTUAL_FACT",selector:{kinds:["CALCULATED_NATAL_FACT"],owner:"person",producer,fields:[{path:"value.god",equals:aliases[0]}]},required:true,gaps:[]};
    candidate.requirement.sourceRequirements.push(spec);r.nativeTarget=target.originalId;r.nativeLocator=target.locator;r.addedRequirementIds.push(spec.id);
  }
  if(canonicalJson(candidate.requirement.sourceRequirements.slice(0,original.requirement.sourceRequirements.length))!==canonicalJson(original.requirement.sourceRequirements)||canonicalJson({...candidate.requirement,sourceRequirements:original.requirement.sourceRequirements})!==canonicalJson(original.requirement))throw Error("ORIGINAL_CAREER_CONDITIONS_RELAXED");
  return {candidate,resolutions};
}
