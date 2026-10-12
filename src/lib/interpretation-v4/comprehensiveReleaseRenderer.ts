import type { NarrativeInput, ComprehensiveNarrative, NarrativeBlock } from "./narrativeTypes";
import type { ComprehensiveEditorialPlan, ComprehensivePlanInputs, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { COMPREHENSIVE_READER_CHAPTERS, COMPREHENSIVE_RELEASE_VERSION } from "./comprehensiveReleaseContracts";
import { RELEASE_FACETS, RELEASE_RISKS, RELEASE_RISK_SCENES, RELEASE_SOCIAL_INTENT, RELEASE_CLOSINGS, RELEASE_SOCIAL_BOUNDARY_RISK, RELEASE_SOCIAL_REPAIR, RELEASE_SOCIAL_LEARNING_FIT, RELEASE_MONEY_VALUE, RELEASE_MONEY_AXES, RELEASE_POSITIVE, RELEASE_POSITIVE_ACTIVATION, RELEASE_SOCIAL_FIT, type ReleaseContext } from "./comprehensiveReleaseMaterials";
import { collectReleaseSources, freshReleaseAllocation, selectReleaseSource, commitReleaseSource, allocateReleaseDemands, releaseAtomName, type ReleasePreflight, type ReleaseSource } from "./comprehensiveReleaseSources";
import { humanOutcome, mbtiHumanBehavior } from "./narrativeHumanOutcome";
import { humanizeSourceClause } from "./comprehensiveManuscriptPolish";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { freshNarrativeMemory } from "./narrativeMemory";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { READER_FIRST_IMPRESSION, READER_PRIORITIES, READER_TALENT_PRACTICE, READER_FRIEND_VALUE, READER_MONEY_VALUE, READER_TALENT_SELECTION } from "./comprehensiveReaderApplications";

export type ReleaseSentence = {
  chapterId: string; paragraphId: string; sentenceRole: string; roleDescription: string; text: string;
  sourceCandidateId: string; evidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[];
  semanticTheme: string; context: string; provenance: { materialId: string; source: string; application: "FACT" | "CONDITIONAL_APPLICATION" | "RECALL"; axis?: SemanticAxis; direction?: 1 | -1 };
};
export type ReleaseParagraph = { id: string; purpose: string; sentences: ReleaseSentence[]; text: string; semanticKey: string; legacySections: ComprehensiveSectionId[] };
export type ReleaseChapter = { id: string; key: string; title: string; paragraphs: ReleaseParagraph[] };
export type ReleaseDraft = { version: string; chapters: ReleaseChapter[]; bodyLength: number; explicitMbtiUsage: number; shortages: string[]; allocation?: { complete:boolean; failures:string[]; attempts:number; blocked:string[]; demands:{slot:string;context:ReleaseContext;reserved:boolean}[] }; rootOwnership: { evidenceId: string; owner: string; applications: string[] }[] };
const sentence = (s:string)=> /[.!?]$/.test(s.trim())?s.trim():`${s.trim()}.`;
const clause = (s:string)=>s.trim().replace(/[.]$/,'').replace(/입니다$|합니다$|있습니다$|보입니다$|편입니다$/,'');
const meaningQuote = (s:string) => {
  const text=clause(s), last=text.charCodeAt(text.length-1);
  return `‘${text}’${last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28!==0?"이라는":"라는"}`;
};
const mbtiDomainLabels: Record<string,string> = {MONEY:"돈 관리",INVESTMENT:"자원 선택",LOVE:"애정 표현",MARRIAGE:"가까운 관계",RELATIONSHIPS:"관계 방식",COMMUNICATION:"대화 방식",WORK:"업무 방식",CAREER:"직업 선호",STUDY:"학습 방식",THINKING:"사고 방식",IDENTITY:"행동 선호",STRENGTHS:"강점"};
const riskMessage = (facet:string,context:ReleaseContext) => RELEASE_RISKS[facet]?.[context] ?? RELEASE_FACETS[facet].risk;
const workIntro: Record<string,string> = {student:"지금 학생으로 배우는 과정에서는 남보다 앞선 진도만큼, 스스로 설명할 수 있게 된 내용에도 기준을 두어 보세요.",job_seeker:"취업을 준비하는 지금은 직무 이름만 고르기보다 잘할 수 있는 행동을 실제로 보여 줄 작은 과제를 정해 보세요.",employee:"지금의 직장생활에서는 맡은 범위 안에서 해볼 작은 개선과 새롭게 배울 능력을 연결해 볼 수 있습니다.",freelancer:"프리랜서로 일하는 지금은 잘하는 작업과 계속 맡을 수 있는 조건을 함께 정하면 배울 방향도 분명해집니다.",self_employed:"자영업에서는 직접 잘하는 일과 도움을 받아 유지할 일을 나누면 새로 익힐 능력을 고르기 쉬워집니다.",business_owner:"사업을 운영하는 지금은 혼자 해내는 능력과 다른 사람에게 전할 수 있는 방식을 함께 키워 볼 수 있습니다.",homemaker:"가사를 돌보는 현재에도 자신을 위해 배우고 싶은 한 가지를 정해 작은 시간을 남겨 보세요.",unemployed:"지금 일을 쉬고 있다면 곧바로 성과를 내야 한다는 부담보다 다시 시도할 수 있는 작은 배움부터 골라도 좋습니다.",other:"현재 하는 일의 이름보다 실제로 어떤 과제를 다룰 때 힘이 살아나는지 살펴보면 배움의 방향을 찾기 쉽습니다.","":"일과 배움에서 어떤 방식을 쓸 때 이해와 결과가 함께 남는지 살펴보세요."};
const loveIntro: Record<string,string> = {single:"지금 솔로라면 누군가를 만나기 위해 자신을 바꾸기 전에, 가까워졌을 때 편안할 관계의 조건부터 알아두면 좋습니다.",some:"지금처럼 서로 알아가는 단계에서는 반응 하나로 마음을 결론 내리기보다 관심을 나눌 작은 제안을 해보세요.",dating:"연애 중인 지금은 마음이 같다는 확인만큼 서로가 편하게 느끼는 대화의 방식도 함께 알아갈 수 있습니다.",marriage_preparing:"결혼을 준비하는 지금은 좋은 마음과 함께 일상에서 합의할 역할과 선택의 기준도 이야기해 보세요.",married:"기혼인 현재에는 가까운 생활에서 반복할 수 있는 작은 소통의 방법을 함께 정하는 것이 도움이 될 수 있습니다.","":"관계가 어떤 단계이든 자신이 편안한 친밀감의 조건을 알고 전하는 일이 좋은 출발점이 됩니다."};

/** A generation-only reader edition. The frozen scheduler/manuscript still
 * validates the upstream proof; persisted readers never call this function. */
export function renderComprehensiveRelease(input: NarrativeInput, profiles: ComprehensivePlanInputs, plan: ComprehensiveEditorialPlan, legacy: ComprehensiveManuscriptDraft) {
  const preflight:ReleasePreflight={demands:[],blocked:new Set()};
  renderReleasePass(input,profiles,plan,legacy,preflight);
  const allocation=allocateReleaseDemands(collectReleaseSources(plan,profiles),preflight,plan);
  const result=renderReleasePass(input,profiles,plan,legacy,undefined,allocation.choices);
  result.draft.allocation={complete:allocation.complete,failures:allocation.failures,attempts:allocation.attempts,blocked:allocation.blocked,demands:allocation.demands};
  return result;
}
function renderReleasePass(input: NarrativeInput, profiles: ComprehensivePlanInputs, plan: ComprehensiveEditorialPlan, legacy: ComprehensiveManuscriptDraft,
  preflight?:ReleasePreflight, assignments?:Map<string,ReleaseSource>):{draft:ReleaseDraft;narrative:ComprehensiveNarrative} {
  const pool=collectReleaseSources(plan,profiles), memory=freshReleaseAllocation();
  const shortages:string[]=[], chapters:ReleaseChapter[]=[], terms=new Set<string>(), mbtiNodes=new Set<string>(), mbtiAxes=new Set<string>();
  let explicitMbti=0;
  const rootOwnership = new Map<string,{evidenceId:string;owner:string;applications:string[]}>();
  const seenText = new Set<string>();
  const hasText = (text:string) => [...seenText].some(prior=>prior.includes(text));
  const introduced = new Set<string>();
  const selectedStrengths: ReleaseSource[]=[];
  let coreSource: ReleaseSource | undefined;
  let current:ReleaseChapter;
  const blockMeaning=(key:string)=>{memory.meanings.add(key);preflight?.blocked.add(key);};
  function add(p:number, texts:string[], refs:{source:string;ids:string[];mbti?:string[];fusion?:string[];theme:string;context:string;material:string;recall?:boolean;axis?:SemanticAxis;direction?:1|-1}) {
    const contract=COMPREHENSIVE_READER_CHAPTERS.find(c=>c.id===current.id)!.paragraphs[p];
    const id=`${current.id}.${contract.id}`;
    const slots=texts.map((text,slot)=>({text:text?sentence(text):"",slot})).filter(s=>s.text);
    const unique=slots.map(s=>s.text);
    if(unique.some(t=>seenText.has(t))) {shortages.push(`${id}:REPEATED_MATERIAL_REJECTED`);return false;}
    if(unique.length<3) {shortages.push(`${id}:INSUFFICIENT_INDEPENDENT_SENTENCES`);return false;}
    const usesMbti=(text:string)=>/\b[EI][SN][TF][JP]\b/.test(text)||(refs.mbti??[]).some(id=>profiles.mbti.sourceNodes.some(n=>n.id===id&&n.value===text));
    const sentences=unique.map((text,n):ReleaseSentence=>({chapterId:current.id,paragraphId:contract.id,sentenceRole:`S${slots[n].slot+1}`,roleDescription:contract.sentences[slots[n].slot]??contract.sentences[3],text,
      sourceCandidateId:!refs.fusion?.length&&refs.mbti?.length&&usesMbti(text)?refs.mbti[0]:refs.source,evidenceIds:[...new Set(refs.ids)],mbtiSourceNodeIds:usesMbti(text)?[...(refs.mbti??[])]:[],fusionIds:[...(refs.fusion??[])],semanticTheme:refs.theme,context:refs.context,
      provenance:{materialId:refs.material,source:refs.source,application:refs.recall?"RECALL":refs.material.startsWith("fact:")?"FACT":"CONDITIONAL_APPLICATION",...(refs.axis?{axis:refs.axis,direction:refs.direction}:{})}}));
    unique.forEach(t=>seenText.add(t));
    if(current.id!=="CH13")refs.ids.forEach(id=>introduced.add(id));
    for(const evidenceId of refs.ids) {const entry=rootOwnership.get(evidenceId);if(entry)entry.applications.push(id);else rootOwnership.set(evidenceId,{evidenceId,owner:id,applications:[]});}
    const legacySections=[...new Set(plan.evidenceOwnership.filter(o=>refs.ids.includes(o.evidenceId)).map(o=>o.primaryOwner))];
    current.paragraphs.push({id,purpose:contract.purpose,sentences,text:unique.join(" "),semanticKey:refs.material,legacySections});
    return true;
  }
  function reason(s:ReleaseSource,context:ReleaseContext):{text:string;mbti:string[]} {
    const type=profiles.mbti.mbtiType;
    const domains = context==="money"?["MONEY","INVESTMENT"]:context==="love"?["LOVE","MARRIAGE"]:context==="family"?["RELATIONSHIPS","COMMUNICATION"]:context==="work"?["WORK","CAREER"]:context==="learning"?["STUDY","THINKING"]:["IDENTITY","STRENGTHS","THINKING","COMMUNICATION"];
    const n=profiles.mbti.annotations.find(a=>!mbtiNodes.has(a.sourceNodeId)&&!mbtiAxes.has(`${s.axis}:${s.direction}`)&&a.annotationConfidence!=="REFERENCE_ONLY"&&domains.includes(a.sourceDomain)&&(a.axes[s.axis]??0)*s.direction>0
      && profiles.mbti.sourceNodes.some(n=>n.id===a.sourceNodeId&&n.classification==="SCORING_SEMANTIC"));
    const term=`${s.atom.sourceType}:${s.atom.sourceKey}`;
    // Reusing proof in a new domain must still explain the connection. A
    // definition budget is not a reason to silently drop the Myeongli reason.
    const root = `${releaseAtomName(s.atom)}에서는 ${meaningQuote(s.atom.easyMeaning)} 면을 읽습니다.`;
    const introducedTerm=terms.has(term);
    terms.add(term);
    if(current.id>="CH04"&&n&&type&&explicitMbti<7){mbtiNodes.add(n.sourceNodeId);mbtiAxes.add(`${s.axis}:${s.direction}`);explicitMbti++;return {text:`${introducedTerm?"":root+" "}${type}의 ${mbtiDomainLabels[n.sourceDomain]??"선택 방식"} 자료에서도 ${mbtiHumanBehavior(s.axis,s.direction)}`,mbti:[n.sourceNodeId]};}
    return {text:introducedTerm?"":root,mbti:[]};
  }
  function application(p:number,context:ReleaseContext,preferred:readonly string[]=[],risk=false,intro?:string) {
    const slot=`${current.id}.P${p+1}`, recall=context==="positive"||current.id>="CH08";
    const separateQuestion=current.id==="CH04"&&p===0||current.id==="CH09"&&p===1||current.id==="CH12"&&(p===1||p===3);
    const selectionMemory=separateQuestion?{...memory,meanings:new Set([...memory.meanings].filter(k=>!k.endsWith(`:${context}`)))}:memory;
    // Later chapters apply already introduced proof to genuinely different
    // reader questions. They do not spend another primary-definition slot.
    const base=recall?pool.filter(s=>introduced.has(s.atom.id)):pool;
    const material=(s:ReleaseSource)=>current.id==="CH04"&&p===0?READER_FIRST_IMPRESSION[s.facet]:current.id==="CH09"&&p===1?READER_MONEY_VALUE[s.facet]??RELEASE_MONEY_VALUE[s.facet]:context==="money"&&s.direction===1&&RELEASE_MONEY_AXES[s.axis]?RELEASE_MONEY_AXES[s.axis]:context==="positive"?RELEASE_POSITIVE[s.facet]:current.id==="CH12"&&p===1?READER_FRIEND_VALUE[s.facet]:current.id==="CH12"&&p===3?s.axis==="LEARNING"&&s.direction===1?RELEASE_SOCIAL_LEARNING_FIT:RELEASE_SOCIAL_FIT[s.facet]:RELEASE_FACETS[s.facet].applications[context];
    const wealth=base.filter(s=>s.atom.sourceType==="ten_god"&&["正財","偏財"].includes(s.atom.sourceKey));
    const eligibleBase=current.id==="CH09"&&p===1&&wealth.length?wealth:base;
    let candidates=eligibleBase.filter(s=>{const a=material(s);
      if(context==="positive"&&(!s.atom.positiveMeaning||s.facet===coreSource?.facet))return false;
      if(context==="work"&&!s.atom.contexts.includes("work"))return false;return a&&!hasText(risk?RELEASE_RISK_SCENES[s.facet]?.[context]??a[1]:a[1])&&!hasText(a[2])
      &&!hasText(intro??(risk?riskMessage(s.facet,context):a[0]));});
    const usedFacets=new Set(current.paragraphs.filter(p=>p.semanticKey.startsWith("application:")).map(p=>p.semanticKey.split(":")[1]));
    const distinct=candidates.filter(s=>!usedFacets.has(s.facet));
    if(distinct.length&&!(current.id==="CH09"&&risk))candidates=distinct;
    // Rank an economic caution by existing domain evidence, not by a
    // universal price-comparison scene or a type-name template.
    if(current.id==="CH09"&&risk&&profiles.mbti.available){
      const ranked=[...candidates].sort((a,b)=>(profiles.mbti.contextAxes.money?.[b.axis]??0)*b.direction-(profiles.mbti.contextAxes.money?.[a.axis]??0)*a.direction);
      const strongest=ranked[0];
      if(strongest&&(profiles.mbti.contextAxes.money?.[strongest.axis]??0)*strongest.direction>0)preferred=[strongest.facet];
    }
    preflight?.demands.push({slot,context,preferred,recall,eligible:candidates.map(s=>`${s.atom.id}|${s.facet}`)});
    while(candidates.length) {
    const reserved=assignments?.get(slot);
    const validReserved=reserved&&candidates.some(s=>s.candidate.id===reserved.candidate.id&&s.atom.id===reserved.atom.id&&s.facet===reserved.facet)
      ?selectReleaseSource([reserved],context,selectionMemory,plan,preferred,recall):undefined;
    const s=validReserved??selectReleaseSource(candidates,context,selectionMemory,plan,preferred,recall)
      ??selectReleaseSource(candidates.filter(s=>introduced.has(s.atom.id)),context,selectionMemory,plan,preferred,true);
    const appliedRecall=recall||!!s&&introduced.has(s.atom.id)&&((memory.rootUses.get(s.atom.id)??0)>=3||(memory.uses.get(s.facet)??0)>=5);
    if(!s)break;
    const before={terms:new Set(terms),nodes:new Set(mbtiNodes),axes:new Set(mbtiAxes),explicitMbti};
    const f=RELEASE_FACETS[s.facet], a=material(s)!, r=current.id==="CH01"&&p===0||context==="positive"||current.id==="CH09"&&p===1?{text:"",mbti:[]}:reason(s,context);
    let texts=[intro??a[0],r.text,a[1],a[2]];
    if(risk) texts=current.id==="CH12"&&s.axis==="BOUNDARY"&&s.direction===1
      ?[RELEASE_SOCIAL_BOUNDARY_RISK[0],r.text,RELEASE_SOCIAL_BOUNDARY_RISK[1],RELEASE_SOCIAL_BOUNDARY_RISK[2]]
      :[riskMessage(s.facet,context),r.text,RELEASE_RISK_SCENES[s.facet]?.[context]??a[1],current.id==="CH12"?RELEASE_SOCIAL_REPAIR[s.facet]:a[2]];
    if(current.id==="CH01"&&p===0) texts=[humanOutcome(s.axis,s.direction)!,`비유하자면 ${f.image}에 가깝습니다.`,a[1],a[2]];
    if(current.id==="CH09"&&p===1&&!wealth.length)texts=[`수입과 연결해 볼 바탕은 ${releaseAtomName(s.atom)}에서 읽은 기질입니다.`,a[0],a[1],a[2]];
    if(current.id==="CH09"&&p===1&&wealth.length)texts=[`재물과 연결해 읽는 근거는 ${releaseAtomName(s.atom)}입니다. ${meaningQuote(s.atom.easyMeaning)} 뜻을 수입의 경로와 자원의 활용에 적용합니다.`,a[0],a[1],a[2]];
    if(context==="positive") texts=[`${withKoreanParticle(releaseAtomName(s.atom),"topic")} ${meaningQuote(s.atom.easyMeaning)} 뜻으로 읽습니다.`,s.atom.positiveMeaning!,a[1],a[2]];
    if(add(p,texts,{source:s.candidate.id,ids:[s.atom.id],mbti:r.mbti,theme:s.candidate.semanticTheme,context,material:`application:${s.facet}:${separateQuestion?slot:context}`,recall:appliedRecall,axis:s.axis,direction:s.direction})) {
      const priorMeaning=memory.meanings.has(`${s.facet}:${context}`);
      commitReleaseSource(s,context,memory,appliedRecall);
      if(separateQuestion&&!priorMeaning)memory.meanings.delete(`${s.facet}:${context}`);
      if(current.id==="CH01"&&p===0){coreSource=s;const d=preflight?.demands.at(-1);if(d)d.fixed=s;}
      if(current.id==="CH05"&&p<3)selectedStrengths.push(s);
      return;
    }else {
      shortages.pop();
      // Failed paragraphs consume neither source budgets nor term/MBTI slots.
      terms.clear();before.terms.forEach(t=>terms.add(t));mbtiNodes.clear();before.nodes.forEach(n=>mbtiNodes.add(n));
      mbtiAxes.clear();before.axes.forEach(a=>mbtiAxes.add(a));explicitMbti=before.explicitMbti;
      candidates=candidates.filter(row=>row.candidate.id!==s.candidate.id||row.atom.id!==s.atom.id||row.facet!==s.facet);
    }
    }
    shortages.push(`${slot}:NO_INDEPENDENT_${context.toUpperCase()}_SOURCE`);
  }
  function facts(p:number,atoms:EvidenceAtom[],texts:string[],theme:string) {
    if(!atoms.length){shortages.push(`${current.id}.P${p+1}:CANONICAL_FACT_UNAVAILABLE`);return;}
    for(const atom of atoms)if(texts.some(t=>t.includes(clause(atom.easyMeaning))))terms.add(`${atom.sourceType}:${atom.sourceKey}`);
    add(p,texts,{source:atoms[0].id,ids:atoms.map(e=>e.id),theme,context:"identity",material:`fact:${theme}`});
  }
  const usedFusion=new Set<string>(), fusionBridges=new Set<string>();
  function fusionParagraph(p:number,kind:"REINFORCE"|"TENSION"|"COMPLEMENT",scope?:string) {
    const list=kind==="REINFORCE"?profiles.fusion.reinforce:kind==="TENSION"?profiles.fusion.tensions:profiles.fusion.complements;
    const eligible=list.filter(f=>!f.priorHeavy&&!f.amplifierOnly&&f.strength!=="SUPPORT"&&(f.type!=="TENSION"||f.conditionSplit?.resolved));
    const options=eligible.filter(f=>!usedFusion.has(f.id))
      .flatMap(f=>{
        const mbti=humanMbtiReason(profiles,f,kind==="REINFORCE"?"C2":"C3",freshNarrativeMemory());
        const atom=profiles.myeongli.evidence.find(e=>f.myeongli.evidenceIds.includes(e.id)&&(e.axes[f.myeongli.side.axis]??0)*f.myeongli.side.direction>0);
        const source=plan.candidates.find(c=>c.fusionIds.includes(f.id)&&c.sourceType==="FUSION"&&!c.invalidReasons.length&&c.primaryEligible);
        if(!mbti||!atom||!source)return [];
        const side=humanOutcome(f.myeongli.side.axis,f.myeongli.side.direction)!;
        const facet=Object.entries(RELEASE_FACETS).find(([,r])=>r.axes.some(([a,d])=>a===f.myeongli.side.axis&&d===f.myeongli.side.direction));
        const context:ReleaseContext=p===1?"work":p===3?"inner":"identity";
        const applied=facet?.[1].applications[context];
        const mbtiFacet=Object.values(RELEASE_FACETS).find(r=>r.axes.some(([axis,direction])=>axis===f.mbti.side.axis&&direction===f.mbti.side.direction));
        const mbtiApplication=mbtiFacet?.applications[context]?.find(t=>![...seenText].some(prior=>prior.includes(t))&&!applied?.includes(t));
        const mbtiText=mbtiAxes.has(`${f.mbti.side.axis}:${f.mbti.side.direction}`)&&mbtiApplication?`${profiles.mbti.mbtiType}의 ${mbtiDomainLabels[mbti.domain??"IDENTITY"]??"행동 선호"} 자료를 이 상황에 적용하면, ${mbtiApplication}`:mbti.text;
        const split=f.conditionSplit?.resolved?f.conditionSplit.sides:undefined;
        const texts=f.type==="TENSION"?[side,`${releaseAtomName(atom)}에는 ${meaningQuote(atom.easyMeaning)} 뜻이 담겨 있습니다.`,mbtiText,split?`${split.myeongli}의 반응과 ${split.mbti}의 반응을 나누어 보면, 한쪽이 진짜 성격이고 다른 쪽이 거짓이라는 결론 없이 각 필요를 살필 수 있습니다.`:humanizeSourceClause(f.sourceDescription)]
          :[scope??side,`${releaseAtomName(atom)}에서는 ${meaningQuote(atom.easyMeaning)} 명리적 이유를 읽습니다.`,mbtiText,applied?.[1]??humanizeSourceClause(f.sourceDescription)];
        return [{f,mbti,source,texts,facet,context,atom}];
      });
    const found=explicitMbti<7?options.find(o=>o.texts.every(t=>!seenText.has(sentence(t)))):undefined;
    if(!found) {
      if(kind==="TENSION")return fusionParagraph(p,"COMPLEMENT","두 분석에서 뚜렷한 충돌은 확인되지 않아, 서로 다른 강점이 이어지는 모습을 살펴봅니다.");
      // A previously introduced Fusion may have a genuinely different domain
      // application. Select that domain and its actual scoring node before
      // writing; do not relabel generic Myeongli prose as a combined analysis.
      if(profiles.mbti.available&&explicitMbti<7)for(const f of eligible) {
        const source=plan.candidates.find(c=>c.fusionIds.includes(f.id)&&c.sourceType==="FUSION"&&!c.invalidReasons.length&&c.primaryEligible);
        const atom=profiles.myeongli.evidence.find(e=>f.myeongli.evidenceIds.includes(e.id)&&(e.axes[f.myeongli.side.axis]??0)*f.myeongli.side.direction>0);
        const facet=Object.entries(RELEASE_FACETS).find(([,r])=>r.axes.some(([a,d])=>a===f.myeongli.side.axis&&d===f.myeongli.side.direction));
        if(!source||!atom||!facet)continue;
        const contexts:ReleaseContext[]=p===3?["inner","direction"]:p===1?["work","learning"]:["learning","identity"];
        for(const context of contexts) {
          const domains=context==="work"?["WORK","CAREER"]:context==="learning"?["STUDY","THINKING"]:["IDENTITY","THINKING","STRENGTHS"];
          const node=profiles.mbti.sourceNodes.find(n=>f.mbti.sourceNodeIds.includes(n.id)&&!mbtiNodes.has(n.id)&&n.classification==="SCORING_SEMANTIC"&&domains.includes(n.sourceDomain??"")&&typeof n.value==="string"
            &&n.value.split(/[.!?]\s+/).length<=2&&profiles.mbti.annotations.some(a=>a.sourceNodeId===n.id&&a.annotationConfidence!=="REFERENCE_ONLY"&&(a.axes[f.mbti.side.axis]??0)*f.mbti.side.direction>0));
          const a=facet[1].applications[context];
          if(!node||!a||memory.meanings.has(`${facet[0]}:${context}`))continue;
          // Keep the existing candidate reservation while omitting the
          // repeated, non-informative bridge from customer prose.
          const bridge=`${releaseAtomName(atom)}에서 읽은 경향도 ${context==="learning"?"배움":context==="work"?"업무":context==="inner"?"혼자 생각하는 시간":"앞으로의 선택"}에서는 어떤 조건에 쓰이는지 살펴야 합니다.`;
          const mbtiFacet=Object.values(RELEASE_FACETS).find(r=>r.axes.some(([axis,direction])=>axis===f.mbti.side.axis&&direction===f.mbti.side.direction));
          const mbtiApplication=mbtiFacet?.applications[context]?.find(t=>!a.includes(t)&&![...seenText].some(prior=>prior.includes(t)))
            ??mbtiFacet?.applications.work?.find(t=>![...seenText].some(prior=>prior.includes(t)));
          if(!mbtiApplication)continue;
          const texts=[scope??a[0],bridge,`${profiles.mbti.mbtiType}의 ${mbtiDomainLabels[node.sourceDomain??"IDENTITY"]??"행동 선호"} 자료를 이 상황에 적용하면, ${mbtiApplication}`,a[1]];
          if(texts.some(t=>seenText.has(sentence(t)))||fusionBridges.has(bridge))continue;
          usedFusion.add(f.id);mbtiNodes.add(node.id);mbtiAxes.add(`${f.mbti.side.axis}:${f.mbti.side.direction}`);explicitMbti++;
          blockMeaning(`${facet[0]}:${context}`);
          if(add(p,[texts[0],`${releaseAtomName(atom)}의 ${meaningQuote(atom.easyMeaning)} 뜻이 이 해석의 명리 쪽 출발점입니다.`,texts[2],texts[3]],{source:source.id,ids:f.myeongli.evidenceIds,mbti:[node.id],fusion:[f.id],theme:f.semanticTheme,context,material:`fusion:${f.id}:${context}`}))fusionBridges.add(bridge);
          return;
        }
      }
      application(p,p===3?"inner":"identity",["research","self","care"],false,!profiles.mbti.available&&p===0?"MBTI 유형이 확인되지 않은 만큼 두 분석의 일치나 차이를 만들지 않고, 명리에서 확인되는 서로 다른 면을 함께 살펴봅니다.":undefined);return;
    }
    const {f,mbti,source,texts,facet,context,atom}=found;
    terms.add(`${atom.sourceType}:${atom.sourceKey}`);
    usedFusion.add(f.id);mbtiNodes.add(mbti.nodeId);mbtiAxes.add(`${f.mbti.side.axis}:${f.mbti.side.direction}`);explicitMbti++;
    if(facet)blockMeaning(`${facet[0]}:${context}`);
    add(p,texts,{source:source.id,ids:f.myeongli.evidenceIds,mbti:[mbti.nodeId],fusion:[f.id],theme:f.semanticTheme,context:f.primaryContext,material:`fusion:${f.id}`});
  }
  for(const contract of COMPREHENSIVE_READER_CHAPTERS) {
    current={id:contract.id,key:contract.key,title:contract.title,paragraphs:[]};chapters.push(current);
    switch(contract.id) {
      case "CH01": {
        application(0,"identity");
        const day=profiles.myeongli.foundation.pillars.find(e=>e.metadata?.isDayMaster===true), branch=profiles.myeongli.foundation.pillars.find(e=>e.metadata?.pillar==="day"&&e.sourceType==="earthly_branch");
        if(day&&branch) facts(1,[day,branch],[`일간은 ${releaseAtomName(day).replace("일간 ","")}이며, 명리에서는 자신의 기본 성향을 읽는 출발점으로 봅니다.`,
          `${input.calculation.pillars.day.stem}${input.calculation.pillars.day.branch} 일주는 이 일간과 일지의 조합으로, ${clause(day.easyMeaning)}이라는 면을 가까운 일상에서 살펴볼 수 있습니다.`,
          `${releaseAtomName(branch)}에는 ${clause(branch.easyMeaning)}이라는 의미도 있어, 같은 사람 안에서 다른 필요가 함께 작동할 수 있습니다.`,
          "기본 성향에 다른 기둥과 십성의 조건이 더해져, 한 글자만으로 전체를 정하지 않습니다."],"day-master-and-pillar");
        fusionParagraph(2,"REINFORCE");
        if(coreSource){const f=RELEASE_FACETS[coreSource.facet];add(3,[f.risk,f.applications.strength![1],f.applications.stress![1],f.applications.direction![2]],{source:coreSource.candidate.id,ids:[coreSource.atom.id],theme:coreSource.candidate.semanticTheme,context:"identity",material:"core:contrast"});
          for(const c of ["strength","stress","direction"])blockMeaning(`${coreSource.facet}:${c}`);}
        break;
      }
      case "CH02": {
        const elements=profiles.myeongli.evidence.filter(e=>e.sourceType==="element"), foundation=profiles.myeongli.foundation.elements;
        if(foundation&&elements.length) {
          const names:Record<string,string>={WOOD:"목",FIRE:"화",EARTH:"토",METAL:"금",WATER:"수"};
          const strong=elements.filter(e=>["STRONG","VERY_STRONG"].includes(String(e.metadata?.state)));
          const weak=elements.filter(e=>["WEAK","VERY_WEAK"].includes(String(e.metadata?.state)));
          const row=strong[0]??elements.find(e=>e.sourceKey===foundation.strongest)??elements[0];
          facts(0,elements,[strong.length?`전체 오행에서는 ${strong.map(e=>names[e.sourceKey]).join("·")} 기운이 상대적으로 두드러지는 구성입니다.`:"오행에서 특별히 강하다고 분류된 기운은 없어, 여러 기운이 함께 작동하는 구성을 읽습니다.",
            `${names[row.sourceKey]}의 의미는 ${clause(row.easyMeaning)}이라는 방향에서 이해할 수 있습니다.`,
            `같은 ${names[row.sourceKey]} 기운이라도 위치와 십성에 따라 쓰임은 달라집니다.`,
            "자연스럽게 쓰는 힘과 연습할 방식을 구분하면, 오행이 생활의 단서가 됩니다."],"element-configuration");
          const strength=pool.find(s=>s.atom.id===row.id);
          if(strength){const a=RELEASE_FACETS[strength.facet].applications.learning!;facts(1,[row],[`${names[row.sourceKey]} 기운의 ${meaningQuote(row.easyMeaning)} 뜻을 배움에도 연결해 볼 수 있습니다.`,a[0],a[1],a[2]],"element-strength-application");}
          else facts(1,[row],[`${names[row.sourceKey]}의 ${meaningQuote(row.easyMeaning)} 뜻은 기운의 작동 방식을 설명합니다.`,"강한 오행 하나가 모든 재능을 대신하지는 않으며, 함께 놓인 기둥과 십성의 의미를 살펴야 합니다.","자주 쓰는 방식을 알아두면 필요한 상황에 힘을 배정하고 다른 방식도 시험할 기준이 됩니다."],"element-strength-application");
          const balance=weak.length?weak:[row];
          facts(2,balance,[weak.length?`${weak.map(e=>names[e.sourceKey]).join("·")} 기운은 상대적으로 약하지만, 관련 능력이 없다는 판정은 아닙니다.`:"상대적으로 약하다고 분류된 오행이 없어도 모든 상황에서 늘 균형 있게 행동한다는 뜻은 아닙니다.",
            weak.length?`${names[balance[0].sourceKey]}의 과제는 ${meaningQuote(balance[0].easyMeaning)} 방향을 필요한 상황에서 연습하는 것으로 볼 수 있습니다.`:`${names[row.sourceKey]}의 ${clause(row.easyMeaning)}이라는 힘도 과하게 쓰면 다른 선택을 살필 여지가 줄 수 있습니다.`,
            "어떤 준비나 도움이 있을 때 더 쉽게 할 수 있는지 확인해 보세요.",
            "작은 계획·기록·대화로 시험하면, 평가 대신 균형을 찾는 방법이 남습니다."],"element-balance");
          const alternate=elements.find(e=>e.id!==row.id&&pool.some(s=>s.atom.id===e.id&&RELEASE_FACETS[s.facet].applications.direction!.every(t=>!seenText.has(t))));
          const use=alternate&&pool.find(s=>s.atom.id===alternate.id&&RELEASE_FACETS[s.facet].applications.direction!.every(t=>!seenText.has(t)));
          if(use){const a=RELEASE_FACETS[use.facet].applications.direction!;facts(3,[row,use.atom],[`${names[row.sourceKey]}의 쓰임에 ${names[use.atom.sourceKey]}의 ${meaningQuote(use.atom.easyMeaning)} 면을 함께 고려해 봅니다.`,a[0],a[1],a[2]],"element-use-in-life");}
          else facts(3,[row],[`${names[row.sourceKey]}의 작동 방식을 생활에 쓸 때는 어떤 상황에서 도움이 되는지 먼저 살펴보세요.`,"새 일을 시작한다면 익숙한 방식으로 작은 부분을 해 보고, 그 방식만으로 풀리지 않은 조건은 따로 남겨 볼 수 있습니다.","좋아진 결과와 여전히 필요한 도움을 나누면, 타고난 기질을 모든 상황의 정답으로 쓰지 않고 필요한 곳에 배정하게 됩니다."],"element-use-in-life");
        } else {
          const natal=profiles.myeongli.foundation.pillars.filter(e=>e.metadata?.pillar!=="hour");
          facts(0,natal,["출생시간이 확정되지 않은 입력에서는 시주를 보태어 완전한 오행 구성을 만든 것처럼 설명하지 않습니다.","현재 확인된 년주·월주·일주의 기질은 읽을 수 있지만, 여덟 글자 전체를 전제로 한 오행의 우세와 부족은 유보합니다.","시간을 모른다는 이유로 임의의 시주를 넣으면 기운의 배분과 해석 조건까지 달라지므로, 확인한 범위와 모르는 범위를 구분합니다.","다음 해석은 실제로 남아 있는 기둥의 근거를 사용하며, 확인되지 않은 부분을 능력의 부재로 연결하지 않습니다."],"unknown-hour-boundary");
          application(1,"strength");application(2,"stress");application(3,"work");
        }break;
      }
      case "CH03": {
        fusionParagraph(0,"REINFORCE");fusionParagraph(1,"COMPLEMENT");fusionParagraph(2,"TENSION");
        const previous=current.paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.fusionIds));
        const f=[...profiles.fusion.complements,...profiles.fusion.tensions,...profiles.fusion.reinforce].find(f=>previous.includes(f.id));
        const source=f&&plan.candidates.find(c=>c.fusionIds.includes(f.id)&&c.primaryEligible&&!c.invalidReasons.length);
        const facet=f&&Object.entries(RELEASE_FACETS).find(([,r])=>r.axes.some(([a,d])=>a===f.myeongli.side.axis&&d===f.myeongli.side.direction));
        const a=facet?.[1].applications.inner;
        const mbti=f&&humanMbtiReason(profiles,f,"C3",freshNarrativeMemory());
        const atom=f&&profiles.myeongli.evidence.find(e=>f.myeongli.evidenceIds.includes(e.id)&&(e.axes[f.myeongli.side.axis]??0)*f.myeongli.side.direction>0);

        const texts=f&&a&&mbti&&atom?[`${releaseAtomName(atom)}의 ${meaningQuote(atom.easyMeaning)} 면과 ${profiles.mbti.mbtiType}의 행동 선호를 함께 활용할 때는 순서를 정하는 편이 좋습니다.`,
          humanizeSourceClause(f.sourceDescription),"타고난 기질이 가리키는 힘을 쓸 과제와 행동 선호가 편안해하는 과정을 나누어 고르면, 두 설명을 함께 활용할 수 있습니다.",a[1]]:[];
        if(f&&source&&facet&&texts.every(t=>!seenText.has(sentence(t)))&&!memory.meanings.has(`${facet[0]}:inner`)) {
          add(3,texts,{source:source.id,ids:f.myeongli.evidenceIds,mbti:mbti?[mbti.nodeId]:[],fusion:[f.id],theme:f.semanticTheme,context:"inner",material:`fusion-recall:${f.id}:inner`,recall:true});
          explicitMbti++;blockMeaning(`${facet[0]}:inner`);
        }else application(3,"inner",["research","self","care"]);
        break;
      }
      case "CH04": application(0,"social");application(1,"inner");application(2,"love");application(3,"family");break;
      case "CH05": {
        application(0,"strength");application(1,"strength");application(2,"strength");
        const first=selectedStrengths[0];
        if(first){const a=READER_TALENT_PRACTICE[first.facet];add(3,[`이 장의 첫 번째 재능을 발전시킬 때는 잘하는 행동을 모든 상황에 적용하기보다 필요한 과제를 고르는 편이 좋습니다.`,a[0],a[1]],{source:first.candidate.id,ids:[first.atom.id],theme:first.candidate.semanticTheme,context:"direction",material:`talent-maintenance:${first.facet}`,recall:true,axis:first.axis,direction:first.direction});blockMeaning(`${first.facet}:direction`);}
        break;
      }
      case "CH06": {
        const factCandidates=legacy.sections.C6.blocks.flatMap(b=>b.sourceUnitIds).map(id=>plan.candidates.find(c=>c.id===id)).filter(c=>c?.factBomb&&!c.invalidReasons.length);
        const preferredPool=pool.filter(s=>factCandidates.some(c=>c!.primaryAxes.includes(s.axis)&&c!.myeongliEvidenceIds.includes(s.atom.id)));
        const usable=(s:ReleaseSource)=>s.facet!==coreSource?.facet&&![...RELEASE_FACETS[s.facet].applications.direction!,RELEASE_FACETS[s.facet].applications.stress![1],RELEASE_FACETS[s.facet].applications.social![1]].some(t=>seenText.has(t));
        const preferredEligible=preferredPool.filter(usable);
        const eligible=preferredEligible.length?preferredEligible:pool.filter(usable);
        const stressSupport=(c:NonNullable<typeof factCandidates[number]>)=>Math.max(0,...c.primaryAxes.map(axis=>profiles.mbti.contextAxes.stress?.[axis]??0));
        const rankedFacts=profiles.mbti.available?[...factCandidates].sort((a,b)=>stressSupport(b!)-stressSupport(a!)):factCandidates;
        const firstFact=rankedFacts.find(c=>eligible.some(s=>c!.primaryAxes.includes(s.axis)&&c!.myeongliEvidenceIds.includes(s.atom.id)));
        const strongest=firstFact&&eligible.filter(s=>firstFact.primaryAxes.includes(s.axis)&&firstFact.myeongliEvidenceIds.includes(s.atom.id));
        const selected=assignments?.get("CH06.P1")??(strongest&&selectReleaseSource(strongest,"stress",memory,plan))??selectReleaseSource(eligible,"stress",memory,plan);
        preflight?.demands.push({slot:"CH06.P1",context:"stress",preferred:[],fixed:selected});
        const fact=selected&&factCandidates.find(c=>c!.primaryAxes.includes(selected.axis)&&c!.myeongliEvidenceIds.includes(selected.atom.id));
        const s=selected&&{...selected,candidate:fact??selected.candidate};
        if(!s){shortages.push("CH06:NO_VERIFIED_OVERUSE_SOURCE");break;}
        const previousParagraphs=current.paragraphs.length;
        const f=RELEASE_FACETS[s.facet],a=f.applications.stress!,social=f.applications.social!,direction=f.applications.direction!;
        const refs={source:s.candidate.id,ids:[s.atom.id],theme:s.candidate.semanticTheme,context:"stress",axis:s.axis,direction:s.direction};
        add(0,[f.risk,a[1],"좋은 의도로 한 일도 상대가 받은 경험과 다를 수 있어, 의도만으로 결과까지 설명하기는 어렵습니다.",a[2]],{...refs,material:`fact-bomb:${s.facet}:recognition`});
        const r=reason(s,"stress");
        const cause=`${releaseAtomName(s.atom)}에서 읽은 성향을 상황과 관계없이 계속 쓰면, 장점이 의도하지 않은 비용을 만들 수 있습니다.`;
        add(1,[r.mbti.length?cause:r.text||cause,a[0],r.mbti.length?r.text:"압박이 생기면 익숙한 방식을 더 세게 쓰다 적절한 힘의 크기를 놓칠 수 있습니다.","방법을 버리기보다 멈춰 확인할 조건을 정하면 과사용을 줄일 수 있습니다."],{...refs,mbti:r.mbti,material:`fact-bomb:${s.facet}:cause`});
        add(2,[RELEASE_RISK_SCENES[s.facet].social!,...RELEASE_SOCIAL_INTENT[s.facet],social[2]],{...refs,context:"social",material:`fact-bomb:${s.facet}:social-cost`});
        add(3,[RELEASE_CLOSINGS[s.facet][0],direction[0],direction[1],direction[2]],{...refs,context:"direction",material:`fact-bomb:${s.facet}:conversion`,recall:true});
        if(current.paragraphs.length>previousParagraphs)commitReleaseSource(selected!,"stress",memory);
        blockMeaning(`${s.facet}:social`);blockMeaning(`${s.facet}:direction`);
        break;
      }
      case "CH07": {
        for(let p=0;p<3;p++) {
          const block=legacy.sections.C5.blocks[p];
          const candidate=block&&plan.candidates.find(c=>block.sourceUnitIds.includes(c.id)&&c.fortune);
          if(block&&candidate) {
            const claim=block.sentences.find(s=>s.role==="GOOD_RESULT"||s.role==="DIRECT_CLAIM");
            const reasons=block.sentences.filter(s=>s.role==="MYEONGLI_REASON");
            const family=candidate.fortuneFamilies[0];
            const scene=family==="PEOPLE_LUCK"?"혼자 막힌 문제에서 필요한 정보를 가진 사람에게 질문하거나 도움을 연결받는 상황에, 이 좋은 기운의 가능성을 현실적으로 이어 볼 수 있습니다.":family==="CHARM_INTIMACY"?"짧은 첫인상보다 함께 이야기하고 시간을 나눌 때 자신의 방식이 전해질 수 있어, 한 번의 반응만으로 매력을 판단할 필요는 없습니다.":family==="CHARM_VISIBILITY"?"사람 앞에 서거나 자신의 결과를 보여 주는 기회에서 관심을 얻을 가능성으로 읽되, 주목과 오래 남을 신뢰는 나누어 생각하는 편이 좋습니다.":family==="HONOR_POSITION"?"맡은 역할과 결과를 사람들이 이해할 수 있게 보여 주는 상황에서, 책임을 지는 힘이 인정받을 조건을 만들 수 있습니다.":"자원을 얻는 가능성과 실제로 남겨 관리하는 과정은 다르므로, 가진 능력과 생활의 조건을 함께 살펴 활용할 부분을 찾을 수 있습니다.";
            const close=family==="PEOPLE_LUCK"?"도움이 필요한 내용을 구체적으로 알리고 받은 연결을 소중히 이어 가는 행동이 있어야, 좋은 신호도 사용할 수 있는 관계가 됩니다.":family?.startsWith("CHARM")?"매력은 모든 사람에게 같은 반응을 얻는 보장이 아니라, 자신에게 맞는 관계에서 자연스럽게 드러낼 수 있는 좋은 가능성입니다.":"좋은 명칭만 믿기보다 실제로 지킬 행동과 준비를 함께 두면, 타고난 조건을 자신의 선택에 연결하기 쉬워집니다.";
            const rootIds=[...new Set(block.sentences.flatMap(s=>s.evidenceIds))];
            // The named signal and its eligibility support stay paired. For
            // intimacy, a CARE support is realized in close conversation rather
            // than repeating the people-luck paragraph's general mood reading.
            const careSupport=rootIds.some(id=>(profiles.myeongli.evidence.find(e=>e.id===id)?.axes.CARE??0)>0);
            const reasonText=family==="PEOPLE_LUCK"&&careSupport&&reasons[0]?.text.startsWith("천을귀인은")
              ?`${reasons[0].text.split(/(?<=[.!?])\s+/)[0]} 가까운 사람의 어려움에 필요한 도움을 나누는 태도는, 자신도 막혔을 때 질문할 수 있는 관계를 만드는 바탕이 될 수 있습니다.`
              :family==="CHARM_INTIMACY"&&careSupport&&reasons[0]?.text.startsWith("홍염살은")
              ?`${reasons[0].text.split(/(?<=[.!?])\s+/)[0]} 상대의 반응을 살피는 면이 가까운 대화에서는 세심함으로 전해질 수 있어, 서로 마음을 주고받을 때 이 매력을 살리기 쉽습니다.`
              :reasons.map(s=>s.text).join(" ");
            const fortuneFacet=family==="PEOPLE_LUCK"||family==="CHARM_INTIMACY"?"care":family==="CHARM_VISIBILITY"?"voice":family==="HONOR_POSITION"?"steady":"resources";
            blockMeaning(`${fortuneFacet}:positive`);
            if(claim&&reasons.length){if(!add(p,[claim.text,reasonText,scene,close],{source:candidate.id,ids:rootIds,theme:candidate.semanticTheme,context:"identity",material:`fortune:${candidate.id}`})){shortages.pop();application(p,"positive");}}
            else application(p,"positive");
          }else application(p,"positive");
        }
        const source=current.paragraphs.flatMap(p=>p.sentences).find(s=>s.provenance.axis);
        const chosen=source&&pool.find(s=>s.atom.id===source.evidenceIds[0]&&s.axis===source.provenance.axis&&s.direction===source.provenance.direction);
        const first=current.paragraphs[0]?.sentences[0];
        const family=first&&plan.candidates.find(c=>c.id===first.sourceCandidateId)?.fortuneFamilies[0];
        const activations:Record<string,string[]>={
          PEOPLE_LUCK:["도움을 받을 좋은 신호는 막힌 지점을 구체적으로 전할 때 쓸 자리를 찾습니다.","필요한 정보가 있는 사람에게 지금까지 해 본 것과 남은 질문 하나를 함께 보내면, 상대도 도울 범위를 고르기 쉽습니다.","받은 도움 뒤에 무엇이 달라졌는지 알려 주는 연락이 한 번의 연결을 신뢰로 남깁니다."],
          CHARM_INTIMACY:["가까운 대화에서 전해지는 매력은 여러 사람에게 인상을 남기는 방식과 다르게 살릴 수 있습니다.","관심이 가는 사람과 짧게라도 취향을 주고받을 시간을 마련하면, 첫 반응만으로는 보이지 않던 서로의 면을 알아갈 여지가 생깁니다.","친밀해지는 속도는 함께 정해야 세심한 관심도 상대가 편하게 받을 수 있습니다."],
          CHARM_VISIBILITY:["눈길을 끄는 좋은 신호는 자신이 무엇을 전할지 정했을 때 방향을 얻습니다.","사람 앞에 설 일이 있다면 보여 줄 결과 하나와 나누고 싶은 이야기 하나를 준비해, 관심이 머물 실제 내용을 남길 수 있습니다.","주목받은 뒤의 약속도 지킬 수 있는 크기여야 첫 관심이 다음 신뢰로 이어집니다."],
          HONOR_POSITION:["역할에서 인정받을 가능성은 맡은 일을 이해하기 쉽게 보여 줄 때 살아납니다.","무엇을 결정했고 어떤 기준을 지켰는지 짧게 남기면, 직함보다 실제 책임의 무게가 전해질 수 있습니다.","인정을 얻으려고 역할 밖의 일까지 맡는 순간에는 책임의 경계부터 다시 살펴야 합니다."],
        };
        if(!chosen&&first&&family&&activations[family])add(3,activations[family],{source:first.sourceCandidateId,ids:first.evidenceIds,theme:first.semanticTheme,context:"positive",material:`fortune-activation:${family}`,recall:true});
        else if(chosen){const a=RELEASE_POSITIVE_ACTIVATION[chosen.facet];add(3,a?[...a]:[],{source:chosen.candidate.id,ids:[chosen.atom.id],theme:chosen.candidate.semanticTheme,context:"positive",material:`positive-activation:${chosen.facet}`,recall:true,axis:chosen.axis,direction:chosen.direction});}
        break;
      }
      case "CH08": application(0,"work");application(1,"work");application(2,"work",[],true);application(3,"learning",[],false,workIntro[input.context.jobStatus]);break;
      case "CH09": {
        // Money is four different questions about this person's actual axes,
        // rather than a shared wealth disclaimer followed by generic advice.
        application(0,"money");application(1,"money");
        application(2,"money",[],true);application(3,"money",["order","self","steady"]);break;
      }
      case "CH10": application(0,"love");application(1,"love");application(2,"love",[],true);application(3,"love",[],false,loveIntro[input.context.relationshipStatus]);break;
      case "CH11": application(0,"family");application(1,"family");application(2,"family",[],true);application(3,"family");break;
      case "CH12": application(0,"social");application(1,"social");application(2,"social",[],true);application(3,"social");break;
      case "CH13": {
        const core=coreSource, talent=selectedStrengths[0];
        const shadow=chapters.find(c=>c.id==="CH06")?.paragraphs[0]?.sentences[0];
        const overuse=shadow&&pool.find(s=>s.atom.id===shadow.evidenceIds[0]&&s.axis===shadow.provenance.axis&&s.direction===shadow.provenance.direction);
        const emit=(p:number,s:ReleaseSource,texts:string[],material:string)=>add(p,texts,{source:s.candidate.id,ids:[s.atom.id],theme:s.candidate.semanticTheme,context:"direction",material,recall:true,axis:s.axis,direction:s.direction});
        if(core){const a=RELEASE_FACETS[core.facet].applications.direction!;emit(0,core,[`첫 장에서 읽은 ${meaningQuote(core.atom.easyMeaning)} 성향을 선택에 쓸 때는, 잘할 수 있는지와 지금 필요한 일을 구분해 보세요.`,a[0],a[1]],"core:decision-criterion");}
        if(talent){emit(1,talent,[`재능을 쓸 과제는 ${meaningQuote(talent.atom.easyMeaning)} 힘이 실제 결과에 필요한지를 기준으로 고를 수 있습니다.`,READER_TALENT_SELECTION[talent.facet],"그 과제에서 바꿀 부분 하나와 이미 충분한 부분 하나를 구분하면, 장점을 더 세게 쓰는 대신 어디에 써야 하는지 판단하게 됩니다."],`talent:bounded-use:${talent.facet}`);}
        if(overuse){emit(2,overuse,[`팩폭 장에서 본 약점은 문제가 커진 뒤 반성하기보다 선택 직전에 확인할 신호로 쓸 수 있습니다.`,RELEASE_CLOSINGS[overuse.facet][1],READER_TALENT_PRACTICE[overuse.facet][2]],`shadow:before-choice:${overuse.facet}`);}
        if(core&&talent&&overuse){const added=add(3,[READER_PRIORITIES[core.facet][0],READER_PRIORITIES[talent.facet][1],READER_PRIORITIES[overuse.facet][2]],{source:core.candidate.id,ids:[core.atom.id],theme:core.candidate.semanticTheme,context:"direction",material:"core:three-domain-priority",recall:true,axis:core.axis,direction:core.direction});
          if(added){const last=current.paragraphs.at(-1)!;[core,talent,overuse].forEach((source,index)=>{const sent=last.sentences[index];sent.sourceCandidateId=source.candidate.id;sent.evidenceIds=[source.atom.id];sent.semanticTheme=source.candidate.semanticTheme;sent.provenance={...sent.provenance,source:source.candidate.id,axis:source.axis,direction:source.direction};
              const ownership=rootOwnership.get(source.atom.id);if(ownership&&!ownership.applications.includes(last.id))ownership.applications.push(last.id);
            });last.legacySections=[...new Set(plan.evidenceOwnership.filter(o=>last.sentences.some(s=>s.evidenceIds.includes(o.evidenceId))).map(o=>o.primaryOwner))];}
        }
        break;
      }
    }
    if(!current.paragraphs.length)shortages.push(`${current.id}:CHAPTER_SOURCE_SCARCITY`);
  }
  const blocks=(c:ReleaseChapter):NarrativeBlock[]=>c.paragraphs.map(p=>({id:p.id,text:p.text,mode:"prose",tone:c.id==="CH06"?"shadow":c.id==="CH13"?"direction":"positive",
    proof:{features:[],seedIds:[],fusionIds:[...new Set(p.sentences.flatMap(s=>s.fusionIds))],sourceRefs:[...new Set(p.sentences.flatMap(s=>[...s.evidenceIds,...s.mbtiSourceNodeIds]))]}}));
  const closing=chapters.at(-1)!.paragraphs.at(-1);
  const narrative:ComprehensiveNarrative={version:"v4-comprehensive-narrative-1",headline:chapters[0].title,opening:blocks(chapters[0]),
    sections:chapters.slice(1).filter(c=>c.paragraphs.length).map(c=>({id:c.key,title:c.title,domain:COMPREHENSIVE_READER_CHAPTERS.find(x=>x.id===c.id)!.domain,blocks:blocks(c)})),
    finalLine:closing?.sentences.at(-1)?.text??input.name+"님의 결을 자신의 선택에 맞게 사용해 보세요.",finalProof:{features:[],seedIds:[],fusionIds:[],sourceRefs:closing?.sentences.flatMap(s=>s.evidenceIds)??[]}};
  const draft:ReleaseDraft={version:COMPREHENSIVE_RELEASE_VERSION,chapters,bodyLength:chapters.flatMap(c=>c.paragraphs.map(p=>p.text)).join("\n\n").length,explicitMbtiUsage:explicitMbti,shortages,rootOwnership:[...rootOwnership.values()]};
  return {draft,narrative};
}
