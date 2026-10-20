import { ActualBindingIndex } from '../knowledge-binder/matching';
import { bindKnowledgeCandidate } from '../knowledge-binder/engine';
import type { NativeCase } from '../global-book-planner/nativeRehearsal';
import type { KnowledgeBindingApprovalProvider } from '../knowledge-binder/types';
import { isOfficialOfflineProvider } from './approvalProvider';
export function rehearseSignedBinder(native:NativeCase,provider:KnowledgeBindingApprovalProvider){
 if(!isOfficialOfflineProvider(provider)||native.candidates.some(c=>c.provenance!=='SYNTHETIC_TEST_ONLY')||!native.request.graph.context.synthetic)throw Error('AUTHENTIC_OFFICIAL_SYNTHETIC_PROVIDER_REQUIRED');
 const index=new ActualBindingIndex(native.request,native.catalog);
 return native.candidates.map(c=>bindKnowledgeCandidate(c,index,native.catalog,provider));
}
