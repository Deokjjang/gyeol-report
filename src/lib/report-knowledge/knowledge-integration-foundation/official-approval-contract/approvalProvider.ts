import type { KnowledgeBindingApprovalProvider, ApprovalRecord, KnowledgeBindingApprovalRequirement } from '../knowledge-binder/types';
import { APPROVAL_VERSION } from './types';
import type { ApprovalBundle, ApprovalReviewContext, VerificationEnvironment, OfflineProviderProof } from './types';
import { approvalHash, jsonSnapshot, sameApprovalValue } from './canonicalApproval';
import { verifyApprovalBundle } from './approvalEnvelope';
import { instant } from './validityWindow';
const officialProviders=new WeakSet<KnowledgeBindingApprovalProvider>();
export function isOfficialOfflineProvider(p:KnowledgeBindingApprovalProvider):boolean{return !process.env.VERCEL&&officialProviders.has(p)&&Object.isFrozen(p);}
export function createOfflineApprovalProvider(entries:readonly {context:ApprovalReviewContext;bundle:ApprovalBundle}[],environment:()=>VerificationEnvironment):KnowledgeBindingApprovalProvider {
 const approved=entries.map(e=>({context:e.context,bundle:jsonSnapshot(e.bundle)})),proofs=new Map<string,OfflineProviderProof>();
 const provider:KnowledgeBindingApprovalProvider={
  lookup:(requirement:KnowledgeBindingApprovalRequirement)=>{
   try {
    if(process.env.VERCEL)return null;
    const entry=approved.find(e=>sameApprovalValue(e.context.requirement,requirement));if(!entry)return null;
    const audit=verifyApprovalBundle(entry.bundle,entry.context,environment());if(!audit.ok)return null;
    const rows=Object.values(entry.bundle),start=rows.flatMap(e=>[e.validFrom,e.issuedAt]).sort((a,b)=>instant(a)!-instant(b)!)[7],end=rows.map(e=>e.validUntil).sort((a,b)=>instant(a)!-instant(b)!)[0],bundleHash=approvalHash(entry.bundle);
    const approval:ApprovalRecord={...jsonSnapshot(requirement),approvalVersion:APPROVAL_VERSION,approverIdentity:'synthetic:official:'+rows.map(e=>e.reviewerAuthorityRef).join('|'),reviewRecord:bundleHash,operatorApproved:true,customerApproved:true,issuedAt:start,expiresAt:end,revoked:false};
    proofs.set(approvalHash(approval),{approval:jsonSnapshot(approval),bundleHash,audit});return approval;
   }catch{return null;}
  },
  verifyAuthenticity:(approval:ApprovalRecord)=>{
   try {
    if(process.env.VERCEL)return false;
    const proof=proofs.get(approvalHash(approval));if(!proof||!sameApprovalValue(approval,proof.approval))return false;
    const entry=approved.find(e=>approvalHash(e.bundle)===proof.bundleHash&&sameApprovalValue(e.context.requirement,Object.fromEntries(Object.keys(e.context.requirement).map(k=>[k,approval[k as keyof ApprovalRecord]]))));
    return !!entry&&verifyApprovalBundle(entry.bundle,entry.context,environment()).ok;
   }catch{return false;}
  }
 };
 Object.freeze(provider);officialProviders.add(provider);return provider;
}
export const ACTUAL_APPROVAL_PROVIDER:KnowledgeBindingApprovalProvider=Object.freeze({lookup:()=>null,verifyAuthenticity:()=>false});
