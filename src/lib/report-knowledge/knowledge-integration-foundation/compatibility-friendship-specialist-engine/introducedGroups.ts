import { canonicalJson } from "../sourceReader";
export type Display = { materialId:string; address:string; catalogKey:string; originalHash:string; owners:string[]; types:(string|null)[]; sourceRoots:string[]; supportingAncestryRoots:string[]; canonicalIds:string[]; directionalIds:string[]; context:string; meaningId:string; claimId:string; sourceGroupId:string; sourceKeys:string[]; safe:boolean; actuallyDisplayed:true };
export type IntroducedGroup = { materialIds:readonly string[]; allActuallyDisplayed:true; samePeopleContextRootsAndDirection:true; compatibleDisplayedSubsetOnly:true };
// Expected proofs are native registered predecessor records, never the current
// candidate with its name substituted. Each alternative remains a whole group.
export function evaluateIntroducedGroups(groups:readonly IntroducedGroup[], displays:readonly Display[], expected:ReadonlyMap<string,Display>) {
  const evaluations=groups.map((g,index)=>{
    const missing=g.materialIds.filter(id=>!displays.some(d=>d.materialId===id));
    const incompatible=g.materialIds.filter(id=>{const proof=expected.get(id);return !proof || !displays.some(d=>d.materialId===id && d.actuallyDisplayed===true && d.safe===true && canonicalJson(d)===canonicalJson(proof));});
    return {index,materialIds:g.materialIds,state:!missing.length&&!incompatible.length?"PASS":"WITHHELD",missing,incompatible};
  });
  return {evaluations,selectedGroup:evaluations.find(g=>g.state==="PASS")?.index??null,pass:evaluations.some(g=>g.state==="PASS"),reasons:evaluations.some(g=>g.state==="PASS")?[]:["INCOMPATIBLE_INTRODUCED_GROUP","ACTUAL_COMPATIBLE_DISPLAY_REQUIRED"],sourceGroupSemanticsUnchanged:true};
}
