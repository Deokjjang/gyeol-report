import {SourceReader, canonicalJson, hash, recordHash} from "../sourceReader";
import {isRecord} from "../normalization";
import {SourceVerificationEngine} from "../source-verification/engine";
import {technicallyVerified} from "../source-verification/classification";
import {digest} from "../global-specialist-integration/candidateEnvelope";
import type {KnowledgeCatalogRecord, KnowledgeSourcePointer, KnowledgeReferenceEdge} from "../types";
import type {SourceProof, VerificationReceipt} from "../source-verification/types";
import type {SourceResolution} from "./types";
export type Grammar = {prefix:string;file:string;exportName:string;field:string|null;declarationFile:string;exactDeclaration:string;method:"EXACT_DECLARED_ALIAS_PROVEN"|"EXACT_FRAGMENT_GRAMMAR_PROVEN"};
// These strings are present in frozen source. They describe source identity,
// never a producer observation or permission to use the author's prose.
export const GRAMMARS: readonly Grammar[] = [
 {prefix:"v4:material-depth:",file:"src/lib/interpretation-v4/materialDepth.ts",exportName:"MATERIAL_DEPTH",field:"feature",declarationFile:"src/lib/interpretation-v4/materialDepthTypes.ts",exactDeclaration:'`v4:material-depth:${feature}`',method:"EXACT_DECLARED_ALIAS_PROVEN"},
 {prefix:"v4:semantic-meaning:",file:"src/lib/interpretation-v4/materialRegistry.ts",exportName:"SEMANTIC_MEANINGS",field:null,declarationFile:"src/lib/interpretation-v4/materialRegistry.ts",exactDeclaration:'meaning && `v4:semantic-meaning:${feature}`',method:"EXACT_FRAGMENT_GRAMMAR_PROVEN"},
 {prefix:"v4:structure-rule:",file:"src/lib/interpretation-v4/structureRules.ts",exportName:"STRUCTURE_RULES",field:"id",declarationFile:"src/lib/interpretation-v4/structureMaterials.ts",exactDeclaration:'`v4:structure-rule:${rule.id}`',method:"EXACT_DECLARED_ALIAS_PROVEN"},
 {prefix:"v4:structure-material:",file:"src/lib/interpretation-v4/structureMaterials.ts",exportName:"STRUCTURE_MATERIALS",field:null,declarationFile:"src/lib/interpretation-v4/structureMaterials.ts",exactDeclaration:'`v4:structure-material:${rule.id}`',method:"EXACT_FRAGMENT_GRAMMAR_PROVEN"},
];
export class ExactSourceResolver {
  private raw=new Map<string,Promise<unknown>>();
  constructor(readonly reader:SourceReader,readonly records:readonly KnowledgeCatalogRecord[],readonly frozen:ReadonlyMap<string,string>,readonly native:SourceVerificationEngine,readonly unresolved:readonly KnowledgeReferenceEdge[]){}
  async inspect(pointer:KnowledgeSourcePointer) {
    const expected=this.frozen.get(pointer.file);if(!expected)throw Error("EXACT_FILE_NOT_FROZEN");
    this.reader.text(pointer.file);if(this.reader.files.get(pointer.file)!==expected)throw Error("FROZEN_FILE_HASH_MISMATCH");
    const found=await this.reader.locate({...pointer,fileSha256:expected});if(found.code)throw Error(found.code);
    return found.value;
  }
  async record(r:KnowledgeCatalogRecord) {if(!this.raw.has(r.catalogKey))this.raw.set(r.catalogKey,this.inspect(r.locator));return this.raw.get(r.catalogKey)!;}
  async proof(pointer:KnowledgeSourcePointer, originalId:string|null, key:KnowledgeCatalogRecord["catalogKey"]|null, role:SourceProof["role"]="ORIGINAL_RECORD"):Promise<SourceProof> {
    const value=await this.inspect(pointer),actual=pointer.recordHashEncoding==="JSON_CANONICAL"?hash(canonicalJson(value)):recordHash(value);
    if(!pointer.recordSha256||actual!==pointer.recordSha256||!pointer.sourceVersion)throw Error("EXACT_RECORD_HASH_AND_VERSION_REQUIRED");
    return {locator:{...pointer,fileSha256:this.frozen.get(pointer.file)},matchedCatalogKey:key,originalId,role,expectedHash:pointer.recordSha256,actualHash:actual,hashAlgorithm:pointer.recordHashEncoding==="JSON_CANONICAL"?"SHA256_JSON_CANONICAL":"SHA256_JSON_INSERTION",sourceVersion:pointer.sourceVersion,reviewState:"TECHNICAL_PROOF_VERIFIED_NOT_CONTENT_OR_CUSTOMER_APPROVAL"};
  }
  private classifyUnsupported(r:VerificationReceipt,proven:boolean):string|null {
    if(r.resolutionState!=="UNSUPPORTED_REFERENCE")return null;
    if(proven)return "KNOWN_GRAMMAR_BUT_UNHANDLED";
    if(r.targetNamespace==="CALCULATED_EVIDENCE_REQUIREMENT"||r.targetNamespace==="FUTURE_BINDING_REQUIREMENT")return "FUTURE_PRODUCER_REQUIRED";
    if(typeof r.originalTarget!=="string")return "UNKNOWN_SYNTAX";
    if(/^(?:v4-content-synthesis|annual-month-jie|calendar:)/.test(r.originalTarget))return "DECLARATION_ONLY";
    return "TRULY_UNSUPPORTED";
  }
  async resolve(r:VerificationReceipt):Promise<SourceResolution> {
    const native=await this.native.verify(this.unresolved[r.originalEdgeOrdinal],r.originalEdgeOrdinal);
    if(digest(native)!==digest(r))throw Error("ORIGINAL_SOURCE_ENGINE_REPRODUCTION_CHANGED:"+r.referenceKey);
    const o:SourceResolution={originalReferenceKey:r.referenceKey,originalCatalogKey:r.affectedCatalogKey,originalResolutionState:r.resolutionState,newTechnicalAssessment:r.resolutionState==="AMBIGUOUS_SOURCE"?"AMBIGUOUS_REMAINS":r.resolutionState==="FUTURE_REQUIREMENT_ONLY"?"REQUIRES_NATIVE_PRODUCER":r.resolutionState==="DOCUMENTARY_REFERENCE_ONLY"?"DOCUMENTARY_ONLY":"REQUIRES_ORIGINAL_SOURCE",resolutionMethod:"NO_EXACT_ORIGINAL_PROOF",exactSourcePointer:null,resolvedCatalogKey:null,originalRecordId:null,expectedRecordHash:null,actualRecordHash:null,fileHash:null,sourceVersion:null,hashEncoding:null,sourceKind:r.requiredSourceKind,proofs:[],excludedAlternatives:[],remainingUnknown:[...r.blockingReasons],originalReceiptHash:digest(r),originalTarget:r.originalTarget,nativeRecheckState:native.resolutionState,unsupportedClassification:null,domainReviewRequired:true,semanticReviewRequired:true,actualEvidenceRequired:true,operatorApprovalRequired:true,customerApprovalRequired:true,establishesPersonalEvidence:false};
    const from=this.records.find(x=>x.catalogKey===r.affectedCatalogKey);if(!from)throw Error("AFFECTED_SOURCE_NOT_FOUND");await this.record(from);
    if(technicallyVerified(native))throw Error("ORIGINAL_UNRESOLVED_COHORT_EXPECTED");
    if(typeof r.originalTarget==="string" && !["FUTURE_REQUIREMENT_ONLY","DOCUMENTARY_REFERENCE_ONLY","AMBIGUOUS_SOURCE"].includes(r.resolutionState)) {
      const target=r.originalTarget;
      const grammar=GRAMMARS.find(g=>target.startsWith(g.prefix));
      if(grammar) {
        const declaration=this.reader.text(grammar.declarationFile);
        if(hash(declaration)!==this.frozen.get(grammar.declarationFile)||!declaration.includes(grammar.exactDeclaration))throw Error("ORIGINAL_GRAMMAR_DECLARATION_CHANGED");
        const id=r.originalTarget.slice(grammar.prefix.length),ex=await this.reader.exports(grammar.file),values=ex[grammar.exportName];
        const found:{value:unknown;pointer:string}[]=grammar.field&&Array.isArray(values)?values.flatMap((value,i)=>isRecord(value)&&value[grammar.field!]===id?[{value,pointer:"/"+i}]:[]):!grammar.field&&isRecord(values)&&Object.hasOwn(values,id)?[{value:values[id],pointer:"/"+id.replace(/~/g,"~0").replace(/\//g,"~1")}]:[];
        if(found.length===1) {
          const f=found[0],existing=this.records.filter(x=>x.locator.file===grammar.file&&x.locator.exportName===grammar.exportName&&(x.locator.pointer??"/"+x.locator.index)===f.pointer);
          if(existing.length>1)throw Error("AMBIGUOUS_ORIGINAL_CATALOG_POINTER");
          const p=existing[0]?.locator??{file:grammar.file,exportName:grammar.exportName,pointer:f.pointer,recordSha256:recordHash(f.value),sourceVersion:this.frozen.get(grammar.file)!};
          const proof=await this.proof(p,existing[0]?.originalId??id,existing[0]?.catalogKey??null);
          if(!grammar.field)proof.qualification={originalFieldKey:id,originalGrammar:grammar,notAnIndividualFact:true};
          const declarationProof:SourceProof={locator:{file:grammar.declarationFile,fileSha256:this.frozen.get(grammar.declarationFile),sourceVersion:this.frozen.get(grammar.declarationFile)},matchedCatalogKey:null,originalId:null,role:"DECLARATION",expectedHash:this.frozen.get(grammar.declarationFile)!,actualHash:hash(declaration),hashAlgorithm:"SHA256_FILE",sourceVersion:this.frozen.get(grammar.declarationFile)!,reviewState:{exactDeclaration:grammar.exactDeclaration,notMeaningApproval:true}};
          Object.assign(o,{newTechnicalAssessment:"PROVEN_TECHNICAL_RESOLUTION",resolutionMethod:grammar.method,exactSourcePointer:proof.locator,resolvedCatalogKey:proof.matchedCatalogKey,originalRecordId:proof.originalId,expectedRecordHash:proof.expectedHash,actualRecordHash:proof.actualHash,fileHash:this.frozen.get(grammar.file),sourceVersion:proof.sourceVersion,hashEncoding:p.recordHashEncoding??"JSON_INSERTION",sourceKind:existing[0]?.kind??"EDITORIAL_SOURCE_FRAGMENT",proofs:[proof,declarationProof],remainingUnknown:["ACTUAL_OWNER_DIRECTION_TIME_EVIDENCE_REQUIRED","SEMANTIC_AND_DOMAIN_REVIEW_REQUIRED","OPERATOR_APPROVAL_PENDING","CUSTOMER_APPROVAL_PENDING"]});
        }
      }
      // Existing convention explicitly names SHINSAL_RULES; its records use
      // code rather than id. Match the exact code within that declared export.
      const full=r.originalTarget.startsWith("src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:");
      const declared=this.reader.text("src/lib/report-knowledge/annualMonthExtendedEvidence.ts");
      const m=/^(?:src\/lib\/saju\/shinsalConstants\.ts:)?SHINSAL_RULES:([A-Z_]+)$/.exec(r.originalTarget);
      if(m) {
        const config=this.native.config.locatorConventions.find(c=>c.prefix==="SHINSAL_RULES");
        if(config&&(!full||declared.includes("`src/lib/saju/shinsalConstants.ts:SHINSAL_RULES:${rule.code}`"))) {
          const options=[];for(const x of this.records.filter(x=>x.locator.file===config.file&&x.locator.exportName===config.exportName)){const v=await this.record(x);if(isRecord(v)&&v.code===m[1])options.push(x);}
          if(options.length===1){const x=options[0],p=await this.proof(x.locator,x.originalId,x.catalogKey);p.qualification={exactCode:m[1],existingConvention:config,calculationDefinitionOnly:true};Object.assign(o,{newTechnicalAssessment:"PROVEN_TECHNICAL_RESOLUTION",resolutionMethod:"EXACT_ORIGINAL_SOURCE_PROVEN",exactSourcePointer:p.locator,resolvedCatalogKey:x.catalogKey,originalRecordId:x.originalId,expectedRecordHash:p.expectedHash,actualRecordHash:p.actualHash,fileHash:this.frozen.get(x.locator.file),sourceVersion:p.sourceVersion,hashEncoding:x.locator.recordHashEncoding??"JSON_INSERTION",sourceKind:x.kind,proofs:[p],remainingUnknown:["ACTUAL_EVIDENCE_REQUIRED","MEANING_DOMAIN_OPERATOR_CUSTOMER_REVIEW_PENDING"]});}
        }
      }
    }
    if(r.resolutionState==="ORIGINAL_LOCATOR_MISSING"&&typeof r.originalTarget==="string"){
      const m=/^offline-periods\.json#\/(major|annual)\/([A-C])\/(years|months)\/(\d+)$/.exec(r.originalTarget),file="tests/fixtures/temporal-interaction-01/offline-periods.json",doc="docs/validation/v4-saju-temporal-interaction-knowledge-01/README.md";
      if(m&&this.reader.text(doc).includes("`"+file+"`")){
        const data=this.reader.json(file),cases=isRecord(data)?data[m[1]]:null;
        const caseIndexes=Array.isArray(cases)?cases.flatMap((v,i)=>isRecord(v)&&v.id===m[2]?[i]:[]):[];
        if(caseIndexes.length===1&&Array.isArray(cases)){
          const ci=caseIndexes[0],c=cases[ci],items=isRecord(c)?c[m[3]]:null,key=m[3]==="years"?"year":"month";
          const itemIndexes=Array.isArray(items)?items.flatMap((v,i)=>isRecord(v)&&v[key]===Number(m[4])?[i]:[]):[];
          if(itemIndexes.length===1&&Array.isArray(items)){
            const ii=itemIndexes[0],p:KnowledgeSourcePointer={file,pointer:`/${m[1]}/${ci}/${m[3]}/${ii}`,recordSha256:recordHash(items[ii]),sourceVersion:this.frozen.get(file)!};
            const proof=await this.proof(p,null,null,"DOCUMENTARY_SNAPSHOT");proof.qualification={originalLogicalReference:r.originalTarget,caseId:m[2],period:Number(m[4]),mapping:"EXACT_CASE_ID_AND_PERIOD_IN_EXPLICITLY_DOCUMENTED_FIXTURE",notCurrentUserEvidence:true};
            Object.assign(o,{newTechnicalAssessment:"DOCUMENTARY_ONLY",resolutionMethod:"EXACT_DOCUMENTED_OFFLINE_SNAPSHOT_NOT_ORIGINAL_FACT",proofs:[proof],sourceKind:"DOCUMENTARY_SNAPSHOT",remainingUnknown:["ORIGINAL_LOCATOR_MISSING_FOR_CURRENT_USER_FACT","ACTUAL_PRODUCER_OWNER_TIME_REQUIRED","SEMANTIC_DOMAIN_OPERATOR_CUSTOMER_REVIEW_PENDING"]});
          }
        }
      }
    }
    if(o.newTechnicalAssessment==="AMBIGUOUS_REMAINS"){
      const alternatives:unknown[]=[...r.candidateTargets];
      if(typeof r.originalTarget==="string"&&r.originalTarget.includes(".json#")){
        const [name,id]=r.originalTarget.split("#"),family=this.native.catalogConfig.families.find(f=>f.name===from.family),file=family?`${family.documentation}/${name}`:null;
        if(file&&this.reader.exists(file)){
          const data=this.reader.json(file);const walk=(v:unknown,pointer:string)=>{if(Array.isArray(v))v.forEach((x,i)=>walk(x,`${pointer}/${i}`));else if(isRecord(v)){if(v.id===id||v.key===id)alternatives.push({file,pointer,originalId:id,recordHash:recordHash(v),fileHash:this.frozen.get(file),declaredOriginalLocator:{file:v.file??null,exportName:v.exportName??null,pointer:v.pointer??null,index:v.index??null},notSelected:true});for(const[k,x]of Object.entries(v))if(Array.isArray(x)||isRecord(x))walk(x,`${pointer}/${k.replace(/~/g,"~0").replace(/\//g,"~1")}`);}};walk(data,"");
        }
      }
      o.excludedAlternatives=[{notExcluded:alternatives,reason:"No unique original edition/locator proven; all candidate positions/hash identities retained, not selected"}];
    }
    o.unsupportedClassification=this.classifyUnsupported(r,o.newTechnicalAssessment==="PROVEN_TECHNICAL_RESOLUTION");return o;
  }
}
