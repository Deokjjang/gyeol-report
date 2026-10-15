import {adaptPairMaterial} from "../compatibility-love-specialist-engine/candidateIndex";
import type {OriginalMaterial} from "../compatibility-love-specialist-engine/researchCatalog";
import {SOURCE_USE} from "../compatibility-parent-child-specialist-engine/requirementAdapter";
import type {KnowledgeCandidate} from "../knowledge-binder/types";
import type {ProductSpecialistFoundation} from "../product-specialist-foundation/binderIntegration";
import type {Material,readManagerReportResearch} from "./researchCatalog";
export {SOURCE_USE};
export function adaptManagerReportMaterial(original:KnowledgeCandidate,material:Material,foundation:ProductSpecialistFoundation,research:ReturnType<typeof readManagerReportResearch>){
 const view={...material,ownedSources:material.ownedSources.map(s=>{if(!(s.sourceUse in SOURCE_USE))throw Error("UNKNOWN_ORIGINAL_SOURCE_USE");return {...s,sourceUse:SOURCE_USE[s.sourceUse as keyof typeof SOURCE_USE]};})} as unknown as OriginalMaterial;
 const adapted=adaptPairMaterial(original,view,foundation,{sources:research.sources,relations:research.relations,pairReviews:[],records:[]});
 return {...adapted,sources:adapted.sources.map((s,i)=>{const source=material.ownedSources[i];if(s.spec)s.spec.originalDeclaration={source,sourceLocator:s.originalLocator,sourceHash:s.registry?.recordSha256,existenceOnly:true};return {...s,source};}),originalRequirements:material.requirements,undeclaredConjunction:"ORIGINAL_EXPLICIT_GROUPS_ONLY",originalGroupsUnchanged:true};
}
