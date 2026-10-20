import {digest} from '../global-specialist-integration/candidateEnvelope';
import {redactOriginalPersonHashes} from './privacy';
import {isRecord} from '../normalization';
import type {ReviewUnit,OriginalReading,ReadingProposal} from './types';
import type {Intake,ReviewUnitBuilder} from './reviewUnitIndex';
export const SPECIALIST_BOUNDARIES:Readonly<Record<string,{unknownFacts:string[];conditions:string[];avoid:string[]}>>={
 comprehensive:{unknownFacts:['현재 직업·수입·가족·과거 사건'],conditions:['동일 개인의 실제 원국·MBTI·Fusion 출처'],avoid:['MBTI 원문을 실제 행동 관찰로 단정']},
 career:{unknownFacts:['직무·능력·경제 상태·정식 권한'],conditions:['입력된 직업 맥락·실제 예산·과제·되돌릴 수 있는 실행'],avoid:['성공·합격·승진·수익 보장']},
 love:{unknownFacts:['상대·자녀의 존재·성격·실제 동의'],conditions:['본인의 원천과 상대 사실 분리·안전 책임 유지'],avoid:['parenting 원천으로 아이 성격 생성']},
 'major-fortune':{unknownFacts:['미입력 과거 경험·앞으로 생길 사건'],conditions:['실제 10년 cycle ID·기간·전환 exact/range·14년 편집 범위 분리'],avoid:['원국/대운/세운 동일 십성을 같은 사실로 합침','전환 전 근거를 연도 전체에 적용']},
 'annual-fortune':{unknownFacts:['실제 도움을 줄 사람·매월의 생활 사건'],conditions:['12 Gregorian 월·가변 segment·실효 연주·월간/월지 본기·대운 배경 분리'],avoid:['명목 연주와 effective annual 혼합','월간 정재를 월지 정인으로 교환']},
 'compatibility-love':{unknownFacts:['교제 사실·상대의 동의·속마음·반응'],conditions:['A/B owner·canonical pair·방향별 수신자 십성·개인 Fusion root'],avoid:['적극적 제안을 일정 예약권으로 변환']},
 'compatibility-marriage':{unknownFacts:['혼인·동거·재정·분담 사실'],conditions:['실제 관계 맥락·양쪽 참여 기둥·원래 성립/배제 조건'],avoid:['합을 혼인 성공·충을 이혼 사건으로 변환']},
 'compatibility-parent-child':{unknownFacts:['친자 사실·발달 평가·현재 필요·동의'],conditions:['fixed-ab-v1 A 부모/B 자녀·TEEN/ADULT 분리·성인의 비대칭 보호 책임'],avoid:['자녀에게 부모 감정 회복 의무 부과','성인 자녀에게 영구 통제권 생성']},
 'compatibility-coworker':{unknownFacts:['실제 업무·성과·권한·산출물·이력'],conditions:['동일 실제 과제·기존 표시 이력·승인선·A→B/B→A 각각 확인'],avoid:['최신 파일을 정답·전달을 승인으로 간주']},
 'compatibility-manager-report':{unknownFacts:['인사 평가·명령·승인 권한'],conditions:['선언 역할과 실제 조직 권한 분리·각 owner/방향 검증'],avoid:['합충·성향을 평가 권한·성과로 환산']},
 'compatibility-business-partner':{unknownFacts:['계약·지분·손익·현금·채무·법률적 권한'],conditions:['사업 Context·실제 자료·전문 법률/경제 판단 별도'],avoid:['육합을 사업 성공·충을 손실로 단정','MONEY/INVESTMENT 금지 ancestry 우회']},
 'compatibility-friendship':{unknownFacts:['친밀도·관계 이력·호의·동의·우정 기간'],conditions:['현재 요청·자발성·비독점성·A/B 방향·호의의 거절 가능성'],avoid:['도움을 갚을 의무·다른 관계 포기 강요']}
};
export function specialistScope(unit:ReviewUnit,builder:ReviewUnitBuilder){
 return {reviewUnitId:unit.reviewUnitId,product:unit.productScope,relationship:unit.relationshipScope,policies:unit.engines.map(engine=>({engine,...SPECIALIST_BOUNDARIES[engine]})),actualGraphWitnessDetails:unit.actualGraphWitnesses.map(id=>{const node=builder.witnesses.get(id);if(!node)throw Error('EXACT_GRAPH_WITNESS_MISSING');return {originalWitnessHash:digest(node),originalWitnessPreserved:true,presentation:redactOriginalPersonHashes(node)};}),requiredOwner:unit.requiredOwner,requiredDirection:unit.requiredDirection,requiredTemporalScope:unit.requiredTemporalScope,sourceGroups:unit.originalSourceGroups,requiredActualContext:unit.requiredActualContext,nativeContracts:unit.affectedFixtureEvaluations.map(id=>({candidate:id,contract:builder.applications.get(id)?.nativeSpecialistContract,display:builder.applications.get(id)?.displayRequirements})),actualRolesProvenByDeclaration:false,allConditionsFulfilled:false};
}
export function domainApplicability(unit:ReviewUnit,input:Intake){
 const own=input.domains.filter(d=>unit.domainDecisions.includes(d.decisionKey)),ancestry=input.ancestry.filter(a=>a.root===unit.catalogKey);
 const inheritedKeys=new Set(ancestry.flatMap(a=>a.requiredSourceKeys)),inherited=input.domains.filter(d=>inheritedKeys.has(d.catalogKey));
 return {reviewUnitId:unit.reviewUnitId,originalDecisions:own,requiredAncestry:ancestry,inheritedDecisions:inherited,explicitProhibition:own.concat(inherited).some(d=>d.decisionState==='EXPLICITLY_PROHIBITED')||ancestry.some(a=>a.prohibitions.length),sourceProofGrantsDomainPermission:false,customerUse:'WITHHELD',policiesRemainUnchanged:true};
}
export function meaningDecomposition(reading:OriginalReading,proposal:ReadingProposal){
 const fields=new Map(reading.contentFields.map(f=>[f.pointer,f.text]));
 const claims=proposal.claimLayers.map(c=>{if(!fields.has(c.field))throw Error('CLAIM_FIELD_NOT_ORIGINAL_CONTENT:'+c.field);return {...c,originalText:fields.get(c.field),state:'MODEL_PROPOSED_NOT_APPROVED',independentFactAdded:0}});
 return {catalogKey:reading.catalogKey,claims,originalMeaning:proposal.says,modelInterpretation:proposal.primaryMeaning,conditionalApplication:proposal.safeExample,unsupportedExtension:[proposal.unsafeFactExample,proposal.unsafeFutureExample],actualUserFactsEstablished:0,futureEventsEstablished:0,traditionalSymbolIsEmpiricalEvidence:false,mbtiTypeIsBehaviourObservation:false};
}
export function counterexampleReview(reading:OriginalReading,proposal:ReadingProposal,unit:ReviewUnit){return {reviewUnitId:unit.reviewUnitId,originalCounterexamples:reading.original.counterexample??reading.original.exclusions??'NOT_SEPARATELY_DECLARED',originalDisallowed:reading.original.disallowed??reading.original.forbidden??reading.original.exclusions??'NOT_SEPARATELY_DECLARED',normalizedOriginalCounterexamples:unit.counterexamples,normalizedOriginalProhibitions:unit.prohibitedInferences,modelProposedCounterexamples:proposal.counterexamples,requiredConditions:proposal.requiredConditions,missingActualContext:proposal.missingUserFacts,illustrations:[{kind:'VALID_CONDITIONAL_ILLUSTRATION',text:proposal.safeExample,state:'MODEL_PROPOSED_NOT_APPROVED'},{kind:'INVALID_FACT_ASSERTION',text:proposal.unsafeFactExample,state:'BLOCKED_WITHOUT_ACTUAL_FACT'},{kind:'UNSUPPORTED_FUTURE_PREDICTION',text:proposal.unsafeFutureExample,state:'BLOCKED'}],originalAndProposalSeparated:true};}
export function validateMbtiMeaning(reading:OriginalReading,supports:readonly {locator:{file:string};original:unknown}[],unit:ReviewUnit){
 const mbti=supports.filter(s=>s.locator.file.startsWith('docs/product/mbti/source/')).map(s=>({locator:s.locator,original:s.original,claimLayer:'MBTI_SOURCE_DESCRIPTION',sourceCoverage:isRecord(s.original)?s.original.sourceCoverage??'UNKNOWN':'UNKNOWN',sourceTextHash:digest(s.original),actualTypeOwnerRequired:true,actualBehaviourEstablished:false,empiricalVerification:'NOT_ESTABLISHED_BY_SOURCE_COVERAGE'}));
 return {reviewUnitId:unit.reviewUnitId,material:reading.catalogKey,sourceDescriptions:mbti,meaningReviewMethod:'MECHANICAL_SCOPE_BOUNDARY_VALIDATION_NOT_DIRECT_MODEL_READING',state:mbti.length?'SOURCE_TEXT_RECHECKED_APPLICATION_REQUIRES_REVIEW':'NO_PRIMARY_MBTI_SOURCE_IN_THIS_PACKET',unknownMbtiCannotBeFilled:true,oppositeOwnerCannotBeCopied:true};
}
export function validateFusionMeaning(unit:ReviewUnit,builder:ReviewUnitBuilder,scopeOriginal:unknown){
 const requirements=unit.affectedFixtureEvaluations.flatMap(id=>builder.index.candidates.get(id)!.sourceRequirements).filter(s=>s.use==='FUSION'||s.selector?.requiresFusionRoots);
 return {reviewUnitId:unit.reviewUnitId,claimLayer:'FUSION_CONDITIONAL_MEANING',originalScopeContract:scopeOriginal,actualRequirements:requirements,actualWitnesses:unit.actualGraphWitnesses,requiredAncestry:unit.originalSourceGroups,state:requirements.length?'ANCESTRY_CONDITIONS_RETAINED_NOT_APPROVED':'NO_FUSION_CLAIM_ESTABLISHED',sameOwnerTwoPrimaryRootsRequired:true,sourceAssignmentRuleContextDirectionRequired:true,newIndependentFacts:0,personalFusionIsNotPairScore:true,missingSourceIsNotReplaced:true};
}
