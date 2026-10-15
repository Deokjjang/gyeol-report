import {canonicalJson} from "../sourceReader";
import {evaluateSourceGroups} from "../knowledge-binder/groups";
import type {KnowledgeBindingMatch,KnowledgeCandidate} from "../knowledge-binder/types";
import type {ActualBindingIndex} from "../knowledge-binder/matching";
import type {KnowledgeBinderCatalog} from "../knowledge-binder/catalog";
import type {Material,OriginalSourceView} from "./researchCatalog";
export type DisplayGroup={id:string;materialId:string;groupId:string;owners:string[];types:(string|null)[];sourceKeys:string[];roots:string[];direction:string|null;taskId:string;meaning:string;claim:string;address:string;actuallyDisplayed:boolean};
export type DisplayExpectation=Omit<DisplayGroup,"id"|"actuallyDisplayed">;
export function compatibleDisplayedGroup(expected:DisplayExpectation,ledger:readonly DisplayGroup[]){return ledger.some(d=>d.actuallyDisplayed&&Object.keys(expected).every(k=>canonicalJson(d[k as keyof DisplayGroup])===canonicalJson(expected[k as keyof DisplayExpectation])));}
/** Native groups retain source-key references, including repeats. They never issue facts. */
export function normalizeSourceGroups(material:Material,sources:readonly OriginalSourceView[],candidate:KnowledgeCandidate,catalog:KnowledgeBinderCatalog){
 return material.requirements.sourceGroups.map(g=>({originalGroupId:g.groupId,originalMaterialId:material.id,sourceKeys:[...g.sourceKeys],groupPolicy:material.requirements.groupPolicy,allSourcesWithinGroupRequired:g.allSourcesWithinGroupRequired,originalTypePredicates:g.typePredicates,originalDeclaration:g,normalizedBinderGroups:candidate.requirement.sourceGroups.filter(s=>s.originalId===g.groupId),sources:g.sourceKeys.map(key=>{const assignment=material.ownedSources.filter(s=>s.sourceKey===key),registry=sources.find(s=>s.key===key),record=registry?catalog.originalIds.get(registry.id)?.[0]:null;return {key,assignment,registry:registry??null,locator:record?.locator??null,requiredOwner:assignment.map(s=>s.owner),requiredType:g.typePredicates.filter(t=>t.sourceKey===key),sourceUse:assignment.map(s=>s.sourceUse),requiredProducer:registry?.sourceKind??"UNKNOWN",documentary:registry?.sourceKind==="external_context",originalDomain:registry?.originalState.currentRelationshipDomain??null,originalReviewState:record?.review??null,missingConditions:!registry?["SOURCE_REFERENCE_UNRESOLVED"]:[]};}),customerApproved:false}));
}
export function evaluateManagerSourceGroups(candidate:KnowledgeCandidate,matches:readonly KnowledgeBindingMatch[],index:ActualBindingIndex,catalog:KnowledgeBinderCatalog){return evaluateSourceGroups(candidate,matches,index,catalog);}
