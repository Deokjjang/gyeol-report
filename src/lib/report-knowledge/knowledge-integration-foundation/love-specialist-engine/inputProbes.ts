import { LOVE_INPUT_CASES } from "../../love-product-research/inputContextResearch";
import { LOVE_READER_CHAPTERS } from "../../../interpretation-v4/loveReleaseContracts";
import { generateV4ShadowReport } from "../../../interpretation-v4/runtimeShadow";
import { observeActualProfiles } from "../actual-evidence-graph/producers";
import { v4Digest, type V4RuntimeEvidence } from "../../../interpretation-v4/runtimeProjection";
import { projectBook } from "../../../../app/dev/book-preview/bookProjection";
import type { LoveProduct } from "../../../interpretation-v4/loveProductAdapter";
import type { NarrativeInput } from "../../../interpretation-v4/narrativeTypes";
export type OriginalLoveProbeFixture = { date: string; time?: string; gender: "FEMALE" | "MALE"; context: NarrativeInput["context"] };
/** These are separately counted original A-W input probes, never new members of
 * the two-Graph Binder comparison. No original narrative is rewritten. */
export async function runLoveInputProbes(fixtures: readonly OriginalLoveProbeFixture[]) {
 const rows=[];
 for(const c of LOVE_INPUT_CASES)for(const[i,v]of c.variants.entries()){
  const f=fixtures[v.fixtureIndex];if(!f)throw Error("ORIGINAL_LOVE_PROBE_FIXTURE_MISSING");
  const payload={productKey:"love_marriage_child",productSlug:"love-marriage-child",person:{name:"검수가상"+c.letter,birthDate:f.date,birthTime:v.unknownTime?"":f.time??"",gender:f.gender,mbtiType:v.mbtiType,birthTimeUnknown:v.unknownTime,birthTimePrecision:v.unknownTime?"unknown":"exact",approximateBirthTimeSlot:""},userContext:{...f.context,relationshipStatus:v.relationshipStatus,focusAreas:[]},productOptions:{contentVersion:"v3"}};
  const g=await generateV4ShadowReport(payload,{evaluatedAt:"2026-10-12T12:00:00+09:00"});
  if(!g.ok){rows.push({letter:c.letter,variant:i,ok:false,error:g.error});continue;}
  if(g.externalCalls?.length)throw Error("OFFLINE_LOVE_PROBE_EXTERNAL_CALL");
  const e=g.evidencePacket as V4RuntimeEvidence;if(e.composition.product!=="love_marriage_child")throw Error("ORIGINAL_LOVE_PROBE_PRODUCT_MISMATCH");
  const r=e.composition.result as LoveProduct,d=r.integration.readerEdition,profiles=observeActualProfiles(e).profiles.person,book=projectBook(e);
  const missing=d.shortages.map(s=>{const address=s.split(":")[0],chapter=LOVE_READER_CHAPTERS.find(ch=>ch.id===address.split(".")[0]),paragraph=chapter?.paragraphs.find(p=>p.id===address.split(".")[1]);return {address,originalRendererShortage:s,originalRequiredRoles:paragraph?.sentences??[],sourceRequirementReview:"QUESTION_AND_MATERIAL_CONDITIONS_REVIEW_REQUIRED",natalOnlyIsNotCrossSystemComparison:true};});
  rows.push({letter:c.letter,variant:i,ok:true,relationshipStatus:v.relationshipStatus,mbtiType:v.mbtiType||null,birthTimeUnknown:v.unknownTime,chapterCount:d.chapters.length,paragraphCount:d.chapters.reduce((n,ch)=>n+ch.paragraphs.length,0),bodyLength:d.bodyLength,publishedEdition:r.integration.publishedEdition,hardErrors:r.integration.readerValidation.hardErrors,qualityIssues:r.integration.readerValidation.qualityIssues,shortages:missing,hashes:{calculation:v4Digest(e.calculations),fullEvidence:v4Digest(e),narrative:v4Digest(r.narrative),integration:v4Digest(r.integration),personal:r.integration.personalDigest,book:v4Digest(book)},natalEvidence:profiles?.myeongli.evidence.map(a=>({id:a.id,sourceKey:a.sourceKey,sourceType:a.sourceType,metadata:a.metadata})),actualMbtiSources:profiles?.mbti.sourceNodes.map(n=>({id:n.id,type:n.mbtiType,domain:n.sourceDomain,classification:n.classification,sourcePath:n.sourcePath})),fusion:{reinforce:profiles?.fusion.reinforce.map(x=>({id:x.id,type:x.type,ruleId:x.ruleId??null,roots:{natal:x.myeongli.evidenceIds,mbti:x.mbti.actualSourceEvidenceIds},contexts:x.contexts})),tension:profiles?.fusion.tensions.map(x=>({id:x.id,type:x.type,ruleId:x.ruleId??null,roots:{natal:x.myeongli.evidenceIds,mbti:x.mbti.actualSourceEvidenceIds},contexts:x.contexts}))},bookGenerated:!!book});
 }
 return rows;
}
