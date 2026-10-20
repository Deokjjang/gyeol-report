import {auditPairObservations as audit0} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-love-specialist-engine/observations";
import {auditPairObservations as audit1} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-marriage-specialist-engine/observations";
import {auditPairObservations as audit2} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-parent-child-specialist-engine/observations";
import {auditPairObservations as audit3} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/observations";
import {auditPairObservations as audit4} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-manager-report-specialist-engine/observations";
import {auditPairObservations as audit5} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-business-partner-specialist-engine/observations";
import {auditFriendshipObservations as audit6} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-friendship-specialist-engine/observations";
import type {ProductSpecialistFoundation} from "../../src/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
export async function auditPublication(root:string,foundation:ProductSpecialistFoundation) {
 const results=[],forbidden:string[]=[];
 for(const [relationship,invoke] of [["love",audit0],["marriage",audit1],["parent-child",audit2],["coworker",audit3],["manager-report",audit4],["business-partner",audit5],["friendship",audit6]] as const){
  const result=await invoke(root,foundation);forbidden.push(...result.forbidden);
  const publicResult=Object.fromEntries(Object.entries(result).filter(([key])=>key!=="forbidden"));
  results.push({relationship,actualRuntimeRegenerated:true,originalArchivedDigestsVerified:true,writerRepaired:false,result:publicResult});
 }
 return {results,forbidden,customerDisplaysIssued:0,writerRepaired:false};
}
