import {publicMajorObservation} from "../../src/lib/report-knowledge/knowledge-integration-foundation/major-fortune-specialist-engine/inputProbes";
import { ComprehensiveSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/comprehensive-specialist-engine/engine";
import { CareerSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/career-specialist-engine/engine";
import { LoveSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/love-specialist-engine/engine";
import { MajorFortuneSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/major-fortune-specialist-engine/engine";
import { AnnualFortuneSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/engine";
import { CompatibilityLoveSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-love-specialist-engine/engine";
import { CompatibilityMarriageSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-marriage-specialist-engine/engine";
import { CompatibilityParentChildSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-parent-child-specialist-engine/engine";
import { CompatibilityCoworkerSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/engine";
import { CompatibilityManagerReportSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-manager-report-specialist-engine/engine";
import {sharedServices as services9} from "../compatibility-manager-report-specialist-engine/sharedServices";
import { CompatibilityBusinessPartnerSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-business-partner-specialist-engine/engine";
import {sharedServices as services10} from "../compatibility-business-partner-specialist-engine/sharedServices";
import { CompatibilityFriendshipSpecialistEngine } from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-friendship-specialist-engine/engine";
import type {EngineInvoker, NativeInvocation} from "../../src/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/types";
import type {KnowledgeCandidate} from "../../src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
import type {KnowledgeBindingRequest} from "../../src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
import type {SpecialistFoundationResult} from "../../src/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/types";
// Explicit heterogeneous receipt fields: never replace original Binder receipts.
type NativeEngine = ComprehensiveSpecialistEngine | CareerSpecialistEngine | LoveSpecialistEngine | MajorFortuneSpecialistEngine | AnnualFortuneSpecialistEngine | CompatibilityLoveSpecialistEngine | CompatibilityMarriageSpecialistEngine | CompatibilityParentChildSpecialistEngine | CompatibilityCoworkerSpecialistEngine | CompatibilityManagerReportSpecialistEngine | CompatibilityBusinessPartnerSpecialistEngine | CompatibilityFriendshipSpecialistEngine;
type NativeResult = ReturnType<NativeEngine["diagnose"]>;
type BinderCapture = (invoke:()=>NativeResult)=>{result:NativeResult;candidates:Map<string,KnowledgeCandidate>};
let capture:BinderCapture|null=null;
export function installBinderCapture(observer:BinderCapture) {if(capture)throw Error("BINDER_OBSERVER_ALREADY_INSTALLED");capture=observer;}
function invokeNative(engine:NativeEngine,request:KnowledgeBindingRequest,prepared:SpecialistFoundationResult):NativeInvocation {
 if(!capture)throw Error("AUTHENTIC_NATIVE_BINDER_OBSERVER_REQUIRED");
 const observed=capture(()=>engine.diagnose(request,prepared));
 return adaptNative(engine,observed.result,observed.candidates);
}
function adaptNative(engine:NativeEngine,result:NativeResult,candidates:Map<string,KnowledgeCandidate>):NativeInvocation {
 const receipts="allProductReceipts"in result?result.allProductReceipts:result.receipts;
 const baseline="baselineProductReceipts"in result?result.baselineProductReceipts:result.baselineReceipts;
 const stateEntries=Object.entries(result).filter(([key])=>["actualCustomerEligible","actualOperatorApproved","actualClaimsEmitted","actualSpecialistClaims","actualSpecialistClaimsEmitted","customerSelectionRun","customerSelection","newActualRoots","bookChanges"].includes(key));
 if(result.mode!=="REAL_RESEARCH_DIAGNOSTICS"||!stateEntries.some(([key])=>key.includes("Claims"))||!stateEntries.some(([key])=>key.startsWith("customerSelection"))||stateEntries.some(([,value])=>value!==0&&value!==false))throw Error("NATIVE_ACTUAL_APPROVAL_SELECTION_CLAIMS_NOT_ZERO");
 const approvalObservations=Object.fromEntries(stateEntries) as Record<string,number|boolean>;
 return {version:result.version,receipts,baseline,candidates,diagnostics:result.diagnostics,originalResult:result,errors:result.errors,approvalObservations,nativeQuestionLinks:"links"in result?result.links:[],nativeResultViews:Object.fromEntries(Object.entries(result).filter(([key])=>["context","proofs","enteredContext","signedAxes","ownerIds","role"].includes(key))),
 finish:()=>"sourceAuditPromise"in engine?engine.sourceAuditPromise:Promise.resolve(null),
 temporal:"observation"in result?{observation:engine instanceof MajorFortuneSpecialistEngine&&"years"in result.observation?publicMajorObservation(result.observation):result.observation,...("questions"in result?{questions:result.questions}:{}),...("links"in result?{links:result.links}:{}),...("foundation"in result?{annualMonths:result.foundation.annualMonths,periodAttempts:result.foundation.periodAttempts,temporalDiagnostics:result.foundation.temporalDiagnostics}:{}),...("comparison"in result?{comparison:result.comparison}:{}),...("transit"in result?{transit:result.transit}:{}),...("crossPeriods"in result?{crossPeriods:result.crossPeriods}:{})}:null,
 policies:"policy"in result?result.policy:null,semantic:{conflicts:result.conflicts,...("meaningRelations"in result?{meaningRelations:result.meaningRelations}:{}),...("duplicateFactGroups"in result?{duplicateFactGroups:result.duplicateFactGroups}:{})}};
}
export const ACTUAL_INVOKERS:Record<string,EngineInvoker>={
"comprehensive": foundation => { const engine=new ComprehensiveSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"career": foundation => { const engine=new CareerSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"love": foundation => { const engine=new LoveSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"major-fortune": foundation => { const engine=new MajorFortuneSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"annual-fortune": foundation => { const engine=new AnnualFortuneSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-love": foundation => { const engine=new CompatibilityLoveSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-marriage": foundation => { const engine=new CompatibilityMarriageSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-parent-child": foundation => { const engine=new CompatibilityParentChildSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-coworker": foundation => { const engine=new CompatibilityCoworkerSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-manager-report": foundation => { const engine=new CompatibilityManagerReportSpecialistEngine(foundation,services9); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-business-partner": foundation => { const engine=new CompatibilityBusinessPartnerSpecialistEngine(foundation,services10); return (request, prepared) => invokeNative(engine,request,prepared); },
"compatibility-friendship": foundation => { const engine=new CompatibilityFriendshipSpecialistEngine(foundation); return (request, prepared) => invokeNative(engine,request,prepared); }
};
