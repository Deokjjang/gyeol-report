import type { NarrativeInput, ComprehensiveNarrative, NarrativeBlock } from "./narrativeTypes";
import type { ComprehensiveEditorialPlan, ComprehensivePlanInputs, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { COMPREHENSIVE_READER_CHAPTERS, COMPREHENSIVE_RELEASE_VERSION } from "./comprehensiveReleaseContracts";
import { RELEASE_FACETS, RELEASE_RISKS, RELEASE_RISK_SCENES, RELEASE_SOCIAL_INTENT, RELEASE_CLOSINGS, type ReleaseContext } from "./comprehensiveReleaseMaterials";
import { collectReleaseSources, freshReleaseAllocation, selectReleaseSource, releaseAtomName, type ReleaseSource } from "./comprehensiveReleaseSources";
import { humanOutcome, mbtiHumanBehavior } from "./narrativeHumanOutcome";
import { humanizeSourceClause } from "./comprehensiveManuscriptPolish";
import { humanMbtiReason } from "./narrativeMbtiReason";
import { freshNarrativeMemory } from "./narrativeMemory";

export type ReleaseSentence = {
  chapterId: string; paragraphId: string; sentenceRole: string; roleDescription: string; text: string;
  sourceCandidateId: string; evidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[];
  semanticTheme: string; context: string; provenance: { materialId: string; source: string; application: "FACT" | "CONDITIONAL_APPLICATION" | "RECALL"; axis?: SemanticAxis; direction?: 1 | -1 };
};
export type ReleaseParagraph = { id: string; purpose: string; sentences: ReleaseSentence[]; text: string; semanticKey: string; legacySections: ComprehensiveSectionId[] };
export type ReleaseChapter = { id: string; key: string; title: string; paragraphs: ReleaseParagraph[] };
export type ReleaseDraft = { version: string; chapters: ReleaseChapter[]; bodyLength: number; explicitMbtiUsage: number; shortages: string[]; rootOwnership: { evidenceId: string; owner: string; applications: string[] }[] };
const sentence = (s:string)=> /[.!?]$/.test(s.trim())?s.trim():`${s.trim()}.`;
const clause = (s:string)=>s.trim().replace(/[.]$/,'').replace(/입니다$|합니다$|있습니다$|보입니다$|편입니다$/,'');
const meaningQuote = (s:string) => {
  const text=clause(s), last=text.charCodeAt(text.length-1);
  return `‘${text}’${last>=0xac00&&last<=0xd7a3&&(last-0xac00)%28!==0?"이라는":"라는"}`;
};
const mbtiDomainLabels: Record<string,string> = {MONEY:"돈 관리",INVESTMENT:"자원 선택",LOVE:"애정 표현",MARRIAGE:"가까운 관계",RELATIONSHIPS:"관계 방식",COMMUNICATION:"대화 방식",WORK:"업무 방식",CAREER:"직업 선호",STUDY:"학습 방식",THINKING:"사고 방식",IDENTITY:"행동 선호",STRENGTHS:"강점"};
// Reader realizations of these actual scoring nodes. Detecting another person's
// truth or mind is not a verified capability; preserve the observation preference.
const mbtiReaderCopy: Record<string,string> = {
  "mbti:ENFP:traits:thinkingStyle:question_burst_pattern:plainKo":"ENFP의 사고 자료에서는 설명이 모호할 때 질문으로 전체 맥락을 알아보려는 선호를 읽습니다. 질문을 더하는 재미와 실제 답을 듣는 시간을 나누면, 새로운 연결을 찾는 힘을 이해까지 이어 갈 수 있습니다.",
  "mbti:INFP:traits:thinkingStyle:contextual_truth_detection:plainKo":"INFP의 사고 자료에는 말의 뉘앙스와 행동의 맥락을 함께 살피려는 선호가 있습니다. 이는 상대의 진심을 맞힌다는 뜻이 아니므로, 알아차린 차이는 확인할 질문으로 사용하는 편이 좋습니다.",
};
const riskMessage = (facet:string,context:ReleaseContext) => RELEASE_RISKS[facet]?.[context] ?? RELEASE_FACETS[facet].risk;
const workIntro: Record<string,string> = {student:"지금 학생으로 배우는 과정에서는 남보다 앞선 진도만큼, 스스로 설명할 수 있게 된 내용에도 기준을 두어 보세요.",job_seeker:"취업을 준비하는 지금은 직무 이름만 고르기보다 잘할 수 있는 행동을 실제로 보여 줄 작은 과제를 정해 보세요.",employee:"지금의 직장생활에서는 맡은 범위 안에서 해볼 작은 개선과 새롭게 배울 능력을 연결해 볼 수 있습니다.",freelancer:"프리랜서로 일하는 지금은 잘하는 작업과 계속 맡을 수 있는 조건을 함께 정하면 배울 방향도 분명해집니다.",self_employed:"자영업에서는 직접 잘하는 일과 도움을 받아 유지할 일을 나누면 새로 익힐 능력을 고르기 쉬워집니다.",business_owner:"사업을 운영하는 지금은 혼자 해내는 능력과 다른 사람에게 전할 수 있는 방식을 함께 키워 볼 수 있습니다.",homemaker:"가사를 돌보는 현재에도 자신을 위해 배우고 싶은 한 가지를 정해 작은 시간을 남겨 보세요.",unemployed:"지금 일을 쉬고 있다면 곧바로 성과를 내야 한다는 부담보다 다시 시도할 수 있는 작은 배움부터 골라도 좋습니다.",other:"현재 하는 일의 이름보다 실제로 어떤 과제를 다룰 때 힘이 살아나는지 살펴보면 배움의 방향을 찾기 쉽습니다.","":"일과 배움에서 어떤 방식을 쓸 때 이해와 결과가 함께 남는지 살펴보세요."};
const loveIntro: Record<string,string> = {single:"지금 솔로라면 누군가를 만나기 위해 자신을 바꾸기 전에, 가까워졌을 때 편안할 관계의 조건부터 알아두면 좋습니다.",some:"지금처럼 서로 알아가는 단계에서는 반응 하나로 마음을 결론 내리기보다 관심을 나눌 작은 제안을 해보세요.",dating:"연애 중인 지금은 마음이 같다는 확인만큼 서로가 편하게 느끼는 대화의 방식도 함께 알아갈 수 있습니다.",marriage_preparing:"결혼을 준비하는 지금은 좋은 마음과 함께 일상에서 합의할 역할과 선택의 기준도 이야기해 보세요.",married:"기혼인 현재에는 가까운 생활에서 반복할 수 있는 작은 소통의 방법을 함께 정하는 것이 도움이 될 수 있습니다.","":"관계가 어떤 단계이든 자신이 편안한 친밀감의 조건을 알고 전하는 일이 좋은 출발점이 됩니다."};

/** A generation-only reader edition. The frozen scheduler/manuscript still
 * validates the upstream proof; persisted readers never call this function. */
export function renderComprehensiveRelease(input: NarrativeInput, profiles: ComprehensivePlanInputs, plan: ComprehensiveEditorialPlan, legacy: ComprehensiveManuscriptDraft) {
  const pool=collectReleaseSources(plan,profiles), memory=freshReleaseAllocation();
  const shortages:string[]=[], chapters:ReleaseChapter[]=[], terms=new Set<string>(), mbtiNodes=new Set<string>(), mbtiAxes=new Set<string>();
  let explicitMbti=0;
  const rootOwnership = new Map<string,{evidenceId:string;owner:string;applications:string[]}>();
  const seenText = new Set<string>();
  const introduced = new Set<string>();
  const selectedStrengths: string[]=[];
  let coreSource: ReleaseSource | undefined;
  let current:ReleaseChapter;
  function add(p:number, texts:string[], refs:{source:string;ids:string[];mbti?:string[];fusion?:string[];theme:string;context:string;material:string;recall?:boolean;axis?:SemanticAxis;direction?:1|-1}) {
    const contract=COMPREHENSIVE_READER_CHAPTERS.find(c=>c.id===current.id)!.paragraphs[p];
    const id=`${current.id}.${contract.id}`;
    const slots=texts.map((text,slot)=>({text:text?sentence(text):"",slot})).filter(s=>s.text);
    const unique=slots.map(s=>s.text);
    if(unique.some(t=>seenText.has(t))) {shortages.push(`${id}:REPEATED_MATERIAL_REJECTED`);return;}
    if(unique.length<3) {shortages.push(`${id}:INSUFFICIENT_INDEPENDENT_SENTENCES`);return;}
    const usesMbti=(text:string)=>/\b[EI][SN][TF][JP]\b/.test(text)||(refs.mbti??[]).some(id=>profiles.mbti.sourceNodes.some(n=>n.id===id&&n.value===text));
    const sentences=unique.map((text,n):ReleaseSentence=>({chapterId:current.id,paragraphId:contract.id,sentenceRole:`S${slots[n].slot+1}`,roleDescription:contract.sentences[slots[n].slot]??contract.sentences[3],text,
      sourceCandidateId:!refs.fusion?.length&&refs.mbti?.length&&usesMbti(text)?refs.mbti[0]:refs.source,evidenceIds:[...new Set(refs.ids)],mbtiSourceNodeIds:usesMbti(text)?[...(refs.mbti??[])]:[],fusionIds:[...(refs.fusion??[])],semanticTheme:refs.theme,context:refs.context,
      provenance:{materialId:refs.material,source:refs.source,application:refs.recall?"RECALL":refs.material.startsWith("fact:")?"FACT":"CONDITIONAL_APPLICATION",...(refs.axis?{axis:refs.axis,direction:refs.direction}:{})}}));
    unique.forEach(t=>seenText.add(t));
    if(current.id!=="CH13")refs.ids.forEach(id=>introduced.add(id));
    for(const evidenceId of refs.ids) {const entry=rootOwnership.get(evidenceId);if(entry)entry.applications.push(id);else rootOwnership.set(evidenceId,{evidenceId,owner:id,applications:[]});}
    const legacySections=[...new Set(plan.evidenceOwnership.filter(o=>refs.ids.includes(o.evidenceId)).map(o=>o.primaryOwner))];
    current.paragraphs.push({id,purpose:contract.purpose,sentences,text:unique.join(" "),semanticKey:refs.material,legacySections});
  }
  function reason(s:ReleaseSource,context:ReleaseContext):{text:string;mbti:string[]} {
    const type=profiles.mbti.mbtiType;
    const domains = context==="money"?["MONEY","INVESTMENT"]:context==="love"?["LOVE","MARRIAGE"]:context==="family"?["RELATIONSHIPS","COMMUNICATION"]:context==="work"?["WORK","CAREER"]:context==="learning"?["STUDY","THINKING"]:["IDENTITY","STRENGTHS","THINKING","COMMUNICATION"];
    const n=profiles.mbti.annotations.find(a=>!mbtiNodes.has(a.sourceNodeId)&&!mbtiAxes.has(`${s.axis}:${s.direction}`)&&a.annotationConfidence!=="REFERENCE_ONLY"&&domains.includes(a.sourceDomain)&&(a.axes[s.axis]??0)*s.direction>0
      && profiles.mbti.sourceNodes.some(n=>n.id===a.sourceNodeId&&n.classification==="SCORING_SEMANTIC"));
    const term=`${s.atom.sourceType}:${s.atom.sourceKey}`;
    if(current.id>="CH04"&&terms.has(term)&&n&&type&&explicitMbti<7){mbtiNodes.add(n.sourceNodeId);mbtiAxes.add(`${s.axis}:${s.direction}`);explicitMbti++;return {text:`${type}의 ${mbtiDomainLabels[n.sourceDomain]??"선택 방식"}에서도 ${mbtiHumanBehavior(s.axis,s.direction)}`,mbti:[n.sourceNodeId]};}
    if(!terms.has(term)&&terms.size<10){terms.add(term);return {text:`${releaseAtomName(s.atom)}에는 ${meaningQuote(s.atom.easyMeaning)} 뜻이 담겨 있습니다.`,mbti:[]};}
    // Do not repeat a definition to force four sentences. The three authored
    // application sentences remain a complete, source-backed paragraph.
    return {text:"",mbti:[]};
  }
  function application(p:number,context:ReleaseContext,preferred:readonly string[]=[],risk=false,intro?:string) {
    const base=current.id==="CH13"?pool.filter(s=>introduced.has(s.atom.id)&&(memory.uses.get(s.facet)??0)>0):pool;
    const candidates=base.filter(s=>{const a=RELEASE_FACETS[s.facet].applications[context];return a&&!seenText.has(risk?RELEASE_RISK_SCENES[s.facet]?.[context]??a[1]:a[1])&&!seenText.has(a[2])
      &&!seenText.has(intro??(risk?riskMessage(s.facet,context):a[0]));});
    const s=selectReleaseSource(candidates,context,memory,plan,preferred,current.id==="CH13");
    if(!s){shortages.push(`${current.id}.P${p+1}:NO_INDEPENDENT_${context.toUpperCase()}_SOURCE`);return;}
    const f=RELEASE_FACETS[s.facet], a=f.applications[context]!, r=current.id==="CH13"||current.id==="CH01"&&p===0||current.id==="CH05"&&p===3?{text:"",mbti:[]}:reason(s,context);
    let texts=[intro??a[0],r.text,a[1],a[2]];
    if(risk) texts=[riskMessage(s.facet,context),r.text,RELEASE_RISK_SCENES[s.facet]?.[context]??a[1],a[2]];
    if(current.id==="CH01"&&p===0)coreSource=s;
    if(current.id==="CH05"&&p<3)selectedStrengths.push(s.facet);
    if(current.id==="CH01"&&p===0) texts=[humanOutcome(s.axis,s.direction)!,`비유하자면 ${f.image}에 가깝습니다.`,a[1],a[2]];
    if(current.id==="CH05"&&p===3) texts=[`앞서 읽은 재능 중 ${f.image} 같은 면을 오래 쓰려면, 힘을 더하기보다 필요한 순간을 고르는 기준이 중요합니다.`,f.risk,a[1],a[2]];
    if(current.id==="CH06"&&p===0) texts=[f.risk,a[1],"본인은 필요한 일을 했다고 생각해도 상대가 받은 경험은 다를 수 있으니, 의도만으로 결과까지 설명하지 않는 편이 좋습니다.",a[2]];
    add(p,texts,{source:s.candidate.id,ids:[s.atom.id],mbti:r.mbti,theme:s.candidate.semanticTheme,context,material:`application:${s.facet}:${context}`,recall:current.id==="CH13",axis:s.axis,direction:s.direction});
  }
  function facts(p:number,atoms:EvidenceAtom[],texts:string[],theme:string) {
    if(!atoms.length){shortages.push(`${current.id}.P${p+1}:CANONICAL_FACT_UNAVAILABLE`);return;}
    for(const atom of atoms)if(texts.some(t=>t.includes(clause(atom.easyMeaning))))terms.add(`${atom.sourceType}:${atom.sourceKey}`);
    add(p,texts,{source:atoms[0].id,ids:atoms.map(e=>e.id),theme,context:"identity",material:`fact:${theme}`});
  }
  const usedFusion=new Set<string>();
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
        const texts=f.type==="TENSION"?[side,`${releaseAtomName(atom)}에는 ${meaningQuote(atom.easyMeaning)} 뜻이 담겨 있습니다.`,mbti.text,humanizeSourceClause(f.sourceDescription)]
          :[scope??side,`${releaseAtomName(atom)}에서는 ${meaningQuote(atom.easyMeaning)} 명리적 이유를 읽습니다.`,mbti.text,applied?.[1]??humanizeSourceClause(f.sourceDescription)];
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
          const texts=[scope??a[0],`${releaseAtomName(atom)}에서 읽은 경향도 ${context==="learning"?"배움":context==="work"?"업무":context==="inner"?"혼자 생각하는 시간":"앞으로의 선택"}에서는 어떤 조건에 쓰이는지 살펴야 합니다.`,mbtiReaderCopy[node.id]??String(node.value),a[1]];
          if(texts.some(t=>seenText.has(sentence(t))))continue;
          usedFusion.add(f.id);mbtiNodes.add(node.id);mbtiAxes.add(`${f.mbti.side.axis}:${f.mbti.side.direction}`);explicitMbti++;
          memory.meanings.add(`${facet[0]}:${context}`);
          add(p,texts,{source:source.id,ids:f.myeongli.evidenceIds,mbti:[node.id],fusion:[f.id],theme:f.semanticTheme,context,material:`fusion:${f.id}:${context}`});
          return;
        }
      }
      application(p,p===3?"inner":"identity",["research","self","care"],false,!profiles.mbti.available&&p===0?"MBTI 유형이 확인되지 않은 만큼 두 분석의 일치나 차이를 만들지 않고, 명리에서 확인되는 서로 다른 면을 함께 살펴봅니다.":undefined);return;
    }
    const {f,mbti,source,texts,facet,context,atom}=found;
    terms.add(`${atom.sourceType}:${atom.sourceKey}`);
    usedFusion.add(f.id);mbtiNodes.add(mbti.nodeId);mbtiAxes.add(`${f.mbti.side.axis}:${f.mbti.side.direction}`);explicitMbti++;
    if(facet)memory.meanings.add(`${facet[0]}:${context}`);
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
          for(const c of ["strength","stress","direction"])memory.meanings.add(`${coreSource.facet}:${c}`);}
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
            "같은 오행 수라도 위치와 십성에 따라 쓰임은 달라집니다.",
            "자연스럽게 쓰는 힘과 연습할 방식을 구분하면, 오행이 생활의 단서가 됩니다."],"element-configuration");
          application(1,"strength");
          const balance=weak.length?weak:[row];
          facts(2,balance,[weak.length?`${weak.map(e=>names[e.sourceKey]).join("·")} 기운은 상대적으로 약하지만, 관련 능력이 없다는 판정은 아닙니다.`:"상대적으로 약하다고 분류된 오행이 없어도 모든 상황에서 늘 균형 있게 행동한다는 뜻은 아닙니다.",
            weak.length?`${names[balance[0].sourceKey]}의 과제는 ${meaningQuote(balance[0].easyMeaning)} 방향을 필요한 상황에서 연습하는 것으로 볼 수 있습니다.`:`${names[row.sourceKey]}의 ${clause(row.easyMeaning)}이라는 힘도 과하게 쓰면 다른 선택을 살필 여지가 줄 수 있습니다.`,
            "어떤 준비나 도움이 있을 때 더 쉽게 할 수 있는지 확인해 보세요.",
            "작은 계획·기록·대화로 시험하면, 평가 대신 균형을 찾는 방법이 남습니다."],"element-balance");
          application(3,"work");
        } else {
          const natal=profiles.myeongli.foundation.pillars.filter(e=>e.metadata?.pillar!=="hour");
          facts(0,natal,["출생시간이 확정되지 않은 입력에서는 시주를 보태어 완전한 오행 구성을 만든 것처럼 설명하지 않습니다.","현재 확인된 년주·월주·일주의 기질은 읽을 수 있지만, 여덟 글자 전체를 전제로 한 오행의 우세와 부족은 유보합니다.","시간을 모른다는 이유로 임의의 시주를 넣으면 기운의 배분과 해석 조건까지 달라지므로, 확인한 범위와 모르는 범위를 구분합니다.","다음 해석은 실제로 남아 있는 기둥의 근거를 사용하며, 확인되지 않은 부분을 능력의 부재로 연결하지 않습니다."],"unknown-hour-boundary");
          application(1,"strength");application(2,"stress");application(3,"work");
        }break;
      }
      case "CH03": {
        fusionParagraph(0,"REINFORCE");fusionParagraph(1,"REINFORCE");fusionParagraph(2,"TENSION");
        const previous=current.paragraphs.flatMap(p=>p.sentences.flatMap(s=>s.fusionIds));
        const f=[...profiles.fusion.reinforce,...profiles.fusion.tensions,...profiles.fusion.complements].find(f=>previous.includes(f.id));
        const source=f&&plan.candidates.find(c=>c.fusionIds.includes(f.id)&&c.primaryEligible&&!c.invalidReasons.length);
        const facet=f&&Object.entries(RELEASE_FACETS).find(([,r])=>r.axes.some(([a,d])=>a===f.myeongli.side.axis&&d===f.myeongli.side.direction));
        const a=facet?.[1].applications.inner;
        const texts=f&&a?[humanizeSourceClause(f.sourceDescription),a[0],a[1],a[2]]:[];
        if(f&&source&&facet&&texts.every(t=>!seenText.has(sentence(t)))&&!memory.meanings.has(`${facet[0]}:inner`)) {
          add(3,texts,{source:source.id,ids:f.myeongli.evidenceIds,fusion:[f.id],theme:f.semanticTheme,context:"inner",material:`fusion-recall:${f.id}:inner`,recall:true});
          memory.meanings.add(`${facet[0]}:inner`);
        }else application(3,"inner",["research","self","care"]);
        break;
      }
      case "CH04": application(0,"social");application(1,"inner");application(2,"love");application(3,"family");break;
      case "CH05": application(0,"strength");application(1,"strength");application(2,"strength");application(3,"direction",selectedStrengths);break;
      case "CH06": {
        const factCandidates=legacy.sections.C6.blocks.flatMap(b=>b.sourceUnitIds).map(id=>plan.candidates.find(c=>c.id===id)).filter(c=>c?.factBomb&&!c.invalidReasons.length);
        const preferredPool=pool.filter(s=>factCandidates.some(c=>c!.primaryAxes.includes(s.axis)&&c!.myeongliEvidenceIds.includes(s.atom.id)));
        const usable=(s:ReleaseSource)=>s.facet!==coreSource?.facet&&![...RELEASE_FACETS[s.facet].applications.direction!,RELEASE_FACETS[s.facet].applications.stress![1],RELEASE_FACETS[s.facet].applications.social![1]].some(t=>seenText.has(t));
        const preferredEligible=preferredPool.filter(usable);
        const eligible=preferredEligible.length?preferredEligible:pool.filter(usable);
        const selected=selectReleaseSource(eligible,"stress",memory,plan);
        const fact=selected&&factCandidates.find(c=>c!.primaryAxes.includes(selected.axis)&&c!.myeongliEvidenceIds.includes(selected.atom.id));
        const s=selected&&{...selected,candidate:fact??selected.candidate};
        if(!s){shortages.push("CH06:NO_VERIFIED_OVERUSE_SOURCE");break;}
        const f=RELEASE_FACETS[s.facet],a=f.applications.stress!,social=f.applications.social!,direction=f.applications.direction!;
        const refs={source:s.candidate.id,ids:[s.atom.id],theme:s.candidate.semanticTheme,context:"stress",axis:s.axis,direction:s.direction};
        add(0,[fact?humanizeSourceClause(fact.sourceText):f.risk,a[1],"좋은 의도로 한 일도 상대가 받은 경험과 다를 수 있어, 의도만으로 결과까지 설명하기는 어렵습니다.",a[2]],{...refs,material:`fact-bomb:${s.facet}:recognition`});
        const r=reason(s,"stress");
        const cause=`${releaseAtomName(s.atom)}에서 읽은 성향을 상황과 관계없이 계속 쓰면, 장점이 의도하지 않은 비용을 만들 수 있습니다.`;
        add(1,[r.mbti.length?cause:r.text||cause,a[0],r.mbti.length?r.text:"압박이 생기면 익숙한 방식을 더 세게 쓰다 적절한 힘의 크기를 놓칠 수 있습니다.","방법을 버리기보다 멈춰 확인할 조건을 정하면 과사용을 줄일 수 있습니다."],{...refs,mbti:r.mbti,material:`fact-bomb:${s.facet}:cause`});
        add(2,[RELEASE_RISK_SCENES[s.facet].social!,...RELEASE_SOCIAL_INTENT[s.facet],social[2]],{...refs,context:"social",material:`fact-bomb:${s.facet}:social-cost`});
        add(3,[RELEASE_CLOSINGS[s.facet][0],direction[0],direction[1],direction[2]],{...refs,context:"direction",material:`fact-bomb:${s.facet}:conversion`,recall:true});
        memory.meanings.add(`${s.facet}:social`);memory.meanings.add(`${s.facet}:direction`);
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
            if(claim&&reasons.length)add(p,[claim.text,reasonText,scene,close],{source:candidate.id,ids:rootIds,theme:candidate.semanticTheme,context:"identity",material:`fortune:${candidate.id}`});
            else application(p,"strength");
          }else application(p,"strength");
        }
        const first=current.paragraphs[0]?.sentences[0];
        if(first)add(3,["좋은 가능성은 기다리기보다 쓸 자리를 고를 때 생활과 연결됩니다.","도움이 필요하면 질문을, 능력을 보여 주고 싶다면 작은 결과를 준비해 보세요.","좋은 관계와 평가도 역할의 범위를 넘기면 부담이 될 수 있으니, 기대와 책임을 함께 살펴야 합니다.","어떤 패를 가졌는지만큼 어떤 순간에 꺼내 쓸지 고르는 힘도 중요합니다."],{source:first.sourceCandidateId,ids:first.evidenceIds,theme:first.semanticTheme,context:"identity",material:"fortune:application",recall:true});
        break;
      }
      case "CH08": application(0,"work");application(1,"work");application(2,"work",[],true);application(3,"learning",[],false,workIntro[input.context.jobStatus]);break;
      case "CH09": {
        application(0,"money",["resources"]);
        const wealth=profiles.myeongli.foundation.tenGods.evidence.filter(e=>["정재","편재"].includes(e.sourceKey)||["정재","편재"].some(k=>releaseAtomName(e).includes(k)));
        if(wealth.length)facts(1,wealth,[`${wealth.slice(0,2).map(releaseAtomName).join("·")}에서 재물과 자원을 대하는 성향의 근거를 확인할 수 있습니다.`,
          "재성은 돈이 반드시 많아진다는 결과가 아니라, 자원을 얻고 관리하는 방식에 관심을 두어 읽는 십성입니다.",
          "실제로 들어오는 돈과 쓰는 비용을 나누어 확인하고, 자신의 능력이 어떤 필요에 도움이 되는지 살피는 행동에 이 관점을 적용할 수 있습니다.",
          "새로운 수입을 기대할 때에도 반복할 수 있는 조건과 남길 자원을 함께 계산하면, 가능성을 현실적인 관리로 연결하기 좋습니다."],"wealth-application");
        else application(1,"money",["steady","growth"]);
        application(2,"money",["chance","voice"],true);application(3,"money",["order","self"]);break;
      }
      case "CH10": application(0,"love");application(1,"love");application(2,"love",[],true);application(3,"love",[],false,loveIntro[input.context.relationshipStatus]);break;
      case "CH11": application(0,"family");application(1,"family");application(2,"family",[],true);application(3,"family");break;
      case "CH12": application(0,"social");application(1,"social");application(2,"social",[],true);application(3,"social");break;
      case "CH13": {
        application(0,"direction",coreSource?[coreSource.facet]:[]);application(1,"direction",["research","order","direct"]);application(2,"direction",["resources","care","self","steady"]);
        if(coreSource){const f=RELEASE_FACETS[coreSource.facet];add(3,[`${f.image} 같은 힘은 일·돈·관계에서 조건을 바꾸어 쓸 수 있습니다.`,...RELEASE_CLOSINGS[coreSource.facet]],{source:coreSource.candidate.id,ids:[coreSource.atom.id],theme:coreSource.candidate.semanticTheme,context:"direction",material:"core-recall:closing",recall:true});}
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
