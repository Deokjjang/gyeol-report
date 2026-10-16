// Existing isolated Specialist factories remain the authority for synthetic
// sources, facts, approvals and additional product/relationship constraints.
import { syntheticFixture as comprehensive } from '../comprehensive-specialist-engine/syntheticValidation';
import { selectionViolations as fullReuse, REUSE_CONTRACT } from '../comprehensive-specialist-engine/reuseConstraints';
import { careerSyntheticFixture as career } from '../career-specialist-engine/syntheticValidation';
import { careerSelectionViolations as careerReuse, CAREER_REUSE_CONTRACT } from '../career-specialist-engine/reuseConstraints';
import { loveSyntheticFixture as love } from '../love-specialist-engine/syntheticValidation';
import { loveSelectionViolations as loveReuse, LOVE_REUSE_CONTRACT } from '../love-specialist-engine/reuseConstraints';
import { majorSyntheticFixture as major } from '../major-fortune-specialist-engine/syntheticValidation';
import { majorReuseViolations, MAJOR_ROOT_REUSE_CONTRACT } from '../major-fortune-specialist-engine/reuseConstraints';
import { annualSyntheticFixture as annual } from '../annual-fortune-specialist-engine/syntheticValidation';
import { annualReuseViolations, ANNUAL_ROOT_REUSE_CONTRACT } from '../annual-fortune-specialist-engine/selectionEngine';
import * as pairLove from '../compatibility-love-specialist-engine/synthetic';
import * as pairMarriage from '../compatibility-marriage-specialist-engine/synthetic';
import * as parentChild from '../compatibility-parent-child-specialist-engine/synthetic';
import * as coworker from '../compatibility-coworker-specialist-engine/synthetic';
import * as manager from '../compatibility-manager-report-specialist-engine/synthetic';
import * as business from '../compatibility-business-partner-specialist-engine/synthetic';
import * as friendship from '../compatibility-friendship-specialist-engine/synthetic';
import { selectionViolations as pairLoveReuse } from '../compatibility-love-specialist-engine/selection';
import { selectionViolations as pairMarriageReuse } from '../compatibility-marriage-specialist-engine/selection';
import { selectionViolations as parentReuse } from '../compatibility-parent-child-specialist-engine/selection';
import { selectionViolations as coworkerReuse } from '../compatibility-coworker-specialist-engine/selection';
import { selectionViolations as managerReuse } from '../compatibility-manager-report-specialist-engine/selection';
import { selectionViolations as businessReuse } from '../compatibility-business-partner-specialist-engine/selection';
import { selectionViolations as friendshipReuse } from '../compatibility-friendship-specialist-engine/selection';
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider } from '../knowledge-binder/types';
import type { KnowledgeBinderCatalog } from '../knowledge-binder/catalog';
import type { NativePolicy } from './types';
export type NativeCase = {request: KnowledgeBindingRequest; catalog: KnowledgeBinderCatalog; candidates: readonly KnowledgeCandidate[]; provider: KnowledgeBindingApprovalProvider; options: readonly unknown[]; questions: readonly unknown[]; policy: NativePolicy; displays: readonly unknown[]};

function pairPolicy<T extends {id:string}>(reference:string,original:unknown,options:readonly T[],check:(rows:T[],final:boolean)=>readonly string[]):NativePolicy{
 const byId=new Map(options.map(o=>[o.id,o])),cache=new Map<string,readonly string[]>();
 const pair=(a:string,b?:string)=>{const key=JSON.stringify([a,b]);let reasons=cache.get(key);if(!reasons){reasons=check([byId.get(a)!,...(b?[byId.get(b)!]:[])],false);cache.set(key,reasons);}return reasons;};
 return{reference,original,validateSelection:(ids,final)=>check(ids.map(id=>byId.get(id)!),final),validateAddition:(ids,next)=>[...pair(next),...ids.flatMap(id=>pair(id,next))]};
}
export async function nativeRehearsal(root: string, engine: string, display = false, negative?: 'missingApproval'|'wrongOwner'|'referenceOnly'|'badSourceHash'|'missingFact'|'missingGroupSource'|'domainBlocked'): Promise<NativeCase> {
 if(process.env.VERCEL)throw Error('GLOBAL_PLANNER_OFFLINE_ONLY');
 if(negative&&engine!=='comprehensive')throw Error('REGISTERED_COMPREHENSIVE_NEGATIVE_VARIANT_ONLY');
 switch(engine) {
 case 'comprehensive': { const f=await comprehensive(root,[1,2,3,4],negative?{[negative]:true}:{});return {...f,displays:[],policy:{reference:engine,original:REUSE_CONTRACT,validateSelection:ids=>fullReuse(f.options.filter(o=>ids.includes(o.id)),[])}}; }
 case 'career': {const f=await career(root);return {...f,displays:[],policy:{reference:engine,original:CAREER_REUSE_CONTRACT,validateSelection:ids=>careerReuse(f.options.filter(o=>ids.includes(o.id)),[])}};}
 case 'love': {const f=await love(root);return {...f,displays:[],policy:{reference:engine,original:LOVE_REUSE_CONTRACT,validateSelection:ids=>loveReuse(f.options.filter(o=>ids.includes(o.id)),[])}};}
 case 'major-fortune': {const f=await major(root);return {...f,displays:[],policy:{reference:engine,original:MAJOR_ROOT_REUSE_CONTRACT,validateSelection:ids=>majorReuseViolations(f.options.filter(o=>ids.includes(o.id)))}};}
 case 'annual-fortune': {const f=await annual(root);return {...f,displays:f.displays,policy:{reference:engine,original:ANNUAL_ROOT_REUSE_CONTRACT,validateSelection:ids=>annualReuseViolations(f.options.filter(o=>ids.includes(o.id)))}};}
 case 'compatibility-love': {const f=await pairLove.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_PAIR_LOVE_CONSTRAINTS_NO_NEW_GLOBAL_CAP',f.options,pairLoveReuse)};}
 case 'compatibility-marriage': {const f=await pairMarriage.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_MARRIAGE_CONSTRAINTS_NO_NEW_GLOBAL_CAP',f.options,pairMarriageReuse)};}
 case 'compatibility-parent-child': {const f=await parentChild.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_PARENT_A_CHILD_B_CONSTRAINTS',f.options,parentReuse)};}
 case 'compatibility-coworker': {const f=await coworker.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_COWORKER_CONSTRAINTS_NO_NEW_GLOBAL_CAP',f.options,coworkerReuse)};}
 case 'compatibility-manager-report': {const f=await manager.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_MANAGER_A_REPORT_B_CONSTRAINTS',f.options,managerReuse)};}
 case 'compatibility-business-partner': {const f=await business.syntheticFixture(root,{},display);return {...f,questions:f.options.map(o=>o.question),displays:[],policy:pairPolicy(engine,'NATIVE_BUSINESS_CONTEXT_AND_SOURCE_GROUP_CONSTRAINTS',f.options,businessReuse)};}
 case 'compatibility-friendship': {const f=await friendship.syntheticFixture(root,undefined,display);return {...f,questions:f.fixture.questions,displays:display?f.fixture.displays:[],policy:pairPolicy(engine,'NATIVE_FRIENDSHIP_REPAIR_AND_RECALL_ARE_DISTINCT',f.options,friendshipReuse)};}
 default: throw Error('UNREGISTERED_REHEARSAL_ROUTE');
 }
}
