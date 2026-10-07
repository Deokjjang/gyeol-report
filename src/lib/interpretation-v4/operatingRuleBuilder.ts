import type { ManuscriptInput, ComprehensiveManuscriptDraft } from "./comprehensiveManuscriptCore";
import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { OperatingRuleCandidate, OperatingRuleSourceType, OperatingSlot } from "./operatingRuleCore";
import { GUIDANCE_SHORT_TITLES, STRENGTH_USE_RULES } from "./operatingRuleRegistry";
import type { GuidanceStrategyId } from "./guidanceCore";

const unique=<T>(a:T[])=>[...new Set(a)];
export function mergeOperatingRules(rows:OperatingRuleCandidate[]):OperatingRuleCandidate[]{
  const groups=new Map<string,OperatingRuleCandidate>();
  for(const row of [...rows].sort((a,b)=>Number(b.sourceType==="GUIDANCE")-Number(a.sourceType==="GUIDANCE")||b.priority-a.priority)){
    const prev=groups.get(row.meaningKey);
    if(!prev){groups.set(row.meaningKey,structuredClone(row));continue;}
    for(const k of ["sourceTraitArcIds","sourceResonanceIds","sourceFusionIds","sourceClaimIds","sourceGuidanceIds","evidenceIds","mbtiSourceNodeIds","antecedentCandidateIds","introducedInSection","mergedSourceTypes"] as const)
      Object.assign(prev,{[k]:unique([...prev[k],...row[k]])});
    prev.priority=Math.max(prev.priority,row.priority);
  }
  return [...groups.values()].sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
}
/** A use rule is permitted only for a candidate actually explained before the manual. */
export function buildOperatingRules(input:ManuscriptInput,draft:ComprehensiveManuscriptDraft){
  const earlier=Object.values(draft.sections).filter(s=>s.sectionId!=="C10");
  const evidence=new Set(earlier.flatMap(s=>s.evidenceIds));
  const introduced=input.plan.candidates.filter(c=>earlier.some(s=>s.sourceCandidateIds.includes(c.id)));
  const rows:OperatingRuleCandidate[]=[];
  const add=(c:EditorialCandidate,type:OperatingRuleSourceType,key:string,slot:OperatingSlot,title:string,text:string,priority:number,anchors=[c],extra:Partial<OperatingRuleCandidate>={})=>{
    const sections=earlier.filter(s=>anchors.some(a=>s.sourceCandidateIds.includes(a.id))).map(s=>s.sectionId);
    const ids=unique(anchors.flatMap(a=>a.myeongliEvidenceIds));
    if(!sections.length||!ids.length||ids.some(id=>!evidence.has(id))||c.confidence<.5||anchors.some(a=>a.confidence<.5||a.invalidReasons.length))return;
    rows.push({id:`operating:${type}:${key}:${c.id}`,sourceType:type,operatingSlot:slot,sourceTraitArcIds:unique(anchors.flatMap(a=>a.traitArcIds)),
      sourceResonanceIds:unique(anchors.flatMap(a=>a.resonanceIds)),sourceFusionIds:unique(anchors.flatMap(a=>a.fusionIds)),sourceClaimIds:unique(anchors.flatMap(a=>a.claimIds)),sourceGuidanceIds:unique(anchors.flatMap(a=>a.guidanceIds)),
      evidenceIds:ids,mbtiSourceNodeIds:unique(anchors.flatMap(a=>a.mbtiSourceNodeIds)),antecedentCandidateIds:anchors.map(a=>a.id),introducedInSection:sections,
      ruleText:text,shortTitle:title,confidence:c.confidence>=.75?"HIGH":"MEDIUM",alreadyIntroduced:true,semanticTheme:c.broadTheme,meaningKey:key,priority,mergedSourceTypes:[type],...extra});
  };
  for(const c of input.plan.candidates.filter(c=>c.sourceType==="GUIDANCE")){
    // Only scheduler-selected Guidance; no unrelated advice from the full profile.
    if(!Object.values(input.plan.sections).some(s=>s.placements.some(p=>p.candidateId===c.id)))continue;
    const anchors=introduced.filter(a=>c.precursorIds.some(id=>[a.sourceId,...a.claimIds,...a.resonanceIds,...a.fusionIds,...a.traitArcIds].includes(id)));
    if(!anchors.length||c.myeongliEvidenceIds.some(id=>!evidence.has(id)))continue;
    const g=[...input.profiles.guidance.mergedGuidance,...input.profiles.guidance.guidanceCandidates].find(g=>g.id===c.sourceId);
    if(!g||g.confidence==="LOW"||g.applicability==="FORBIDDEN")continue;
    const strategy=g.selectedStrategyIds.includes("DECISION_EXECUTION_SPLIT")?"DECISION_EXECUTION_SPLIT":g.selectedStrategyIds[0];
    add(c,"GUIDANCE",strategy,c.operatingRuleType??"THINKING",GUIDANCE_SHORT_TITLES[strategy],g.customerAdvice,90,anchors,{sourceGuidanceIds:[g.id],evidenceIds:[...c.myeongliEvidenceIds]});
  }
  for(const c of introduced){
    if(!c.factBomb&&!c.fortune&&c.sourceType!=="GUIDANCE") for(const spec of STRENGTH_USE_RULES){
      if(!c.primaryAxes.includes(spec.axis))continue;
      const proof=input.profiles.myeongli.evidence.filter(e=>c.myeongliEvidenceIds.includes(e.id));
      if(!proof.some(e=>(e.axes[spec.axis]??0)>0))continue;
      add(c,"STRENGTH_USE",`USE:${spec.axis}`,spec.slot,spec.title,spec.text,50);
    }
    const split=c.conditionSplit;
    if(c.fusionType==="TENSION"&&split?.resolved){
      const proof=input.profiles.myeongli.evidence.filter(e=>c.myeongliEvidenceIds.includes(e.id));
      const defs:Partial<Record<NonNullable<typeof split.type>,[string,OperatingSlot,string,string]>>={
        BEFORE_AFTER_DECISION:["DECISION_EXECUTION_SPLIT","EXECUTION","결정 전과 후의 속도를 나누세요","결정하기 전에는 충분히 생각해도 됩니다. 대신 방향을 정한 뒤에는 다시 처음부터 고민하지 않고 움직이는 편이 좋습니다."],
        IDEA_EXECUTION:["IDEA_EXECUTION","EXECUTION","생각은 열고 실행은 정하세요","아이디어를 생각할 때는 유연하게 열어두고 실제로 움직일 때는 기준과 순서를 정하는 편이 잘 맞습니다."],
        START_MAINTAIN:["START_MAINTAIN","EXECUTION","시작과 유지의 속도를 나누세요","시작할 때의 속도를 끝까지 유지하려고 하지 않아도 됩니다. 오래 이어갈 일은 속도를 낮춰 꾸준히 붙드는 방식을 써보세요."],
      };
      const def=split.type?defs[split.type]:undefined;
      if(def && (split.type!=="START_MAINTAIN"||proof.some(e=>(e.axes.STABILITY??0)>0||(e.axes.PERSISTENCE??0)>0)))add(c,"TENSION_SWITCH",...def,100);
      if(split.type==="OUTER_INNER"&&c.sourceText.includes("회복")&&proof.some(e=>(e.axes.RECOVERY_NEED??0)>0))add(c,"TENSION_SWITCH","RECOVERY_BLOCK","RECOVERY","밖에서 쓴 만큼 혼자 정리하세요","밖에서 사람들과 에너지를 썼다면 혼자 생각을 정리하고 회복할 시간도 같이 남겨두는 편이 좋습니다.",100);
      if(split.type==="HEAD_HEART"&&c.primaryAxes.includes("MEANING"))add(c,"TENSION_SWITCH","HEAD_HEART","THINKING","맞는 선택과 원하는 선택을 나누세요","머리로 맞는 선택인지와 내가 실제로 오래 하고 싶은지는 따로 확인하는 편이 좋습니다.",100);
      if(split.type==="NORMAL_STRESS"&&c.primaryAxes.includes("STRATEGY"))add(c,"TENSION_SWITCH","PRIORITIZE_BY_IMPACT","EXECUTION","급할수록 할 순서부터 정하세요","압박이 커지면 모든 것을 같이 붙들기보다 먼저 해야 할 순서부터 정하는 편이 잘 맞습니다.",100);
    }
    if(c.fortune&&draft.sections.C5?.sourceCandidateIds.includes(c.id)){
      const direct=(c.claimLevel??0)>=4;
      if(direct && c.sourceId==="P01_PEOPLE_LUCK")add(c,"FORTUNE_OPPORTUNITY","PEOPLE_HELP","RELATIONSHIP","막힐 때는 사람에게 물어보세요","막혔을 때 혼자 오래 버티기보다 믿을 만한 사람에게 먼저 물어보는 편이 좋습니다.",45);
      const ally=introduced.find(a=>!a.factBomb&&a.id!==c.id&&a.primaryAxes.some(axis=> c.fortuneFamilies.includes("MONEY_FORTUNE")?axis==="RESOURCE_SENSE":c.fortuneFamilies.includes("HONOR_POSITION")?a.traitArcIds.length>0&&["LEADERSHIP","DUTY"].includes(axis):axis==="EXPRESSION"));
      if(direct && ally && c.fortuneFamilies.includes("MONEY_FORTUNE"))add(c,"FORTUNE_OPPORTUNITY","USE:RESOURCE_SENSE","WORK_MONEY","기회와 남길 것을 같이 보세요","돈이 들어오는 기회뿐 아니라 실제로 남길 수 있는 것까지 같이 보는 방식이 잘 맞습니다.",45,[c,ally]);
      if(direct && ally && c.fortuneFamilies.includes("HONOR_POSITION"))add(c,"FORTUNE_OPPORTUNITY","USE:LEADERSHIP","EXECUTION","책임 있는 역할에서 실력을 보이세요","책임과 결정권이 큰 일을 무조건 피하기보다 실력을 보여줄 기회로 보는 편이 잘 맞습니다.",45,[c,ally]);
      if((c.claimLevel??0)>=3 && ally && c.fortuneFamilies.some(f=>f.startsWith("CHARM"))
        && input.profiles.myeongli.evidence.some(e=>ally.myeongliEvidenceIds.includes(e.id)&&(e.axes.EXPRESSION??0)>0))add(c,"FORTUNE_OPPORTUNITY","USE:EXPRESSION","RELATIONSHIP","보여줄 순간에는 숨지 않아도 됩니다","사람 앞에서 말하거나 보여줘야 하는 순간에는 지나치게 숨기기보다 자기 표현을 쓰는 편이 잘 맞습니다.",45,[c,ally]);
    }
  }
  const guards:Record<string,[GuidanceStrategyId,OperatingSlot,string]>={
    PRECISION_AND_STANDARDS:["DEFINE_DONE","THINKING","정확함은 유지하되 끝낼 기준을 먼저 정하는 편이 좋습니다."],
    DEEP_UNDERSTANDING:["TIMEBOX_THINKING","THINKING","깊게 보는 방식은 유지하되 언제까지 생각할지를 먼저 정하는 편이 좋습니다."],
    SOCIAL_ATTUNEMENT_AND_CARE:["DEFINE_RESPONSIBILITY","RELATIONSHIP","사람을 챙기되 도와줄 범위와 책임질 범위는 나누는 편이 좋습니다."],
    LEADERSHIP_AND_RESPONSIBILITY:["DELEGATE_BY_OUTCOME","EXECUTION","방향은 정하되 모든 문제까지 직접 가져오지는 않는 편이 좋습니다."],
    GROWTH_AND_EXPANSION:["RECOVERY_BLOCK","RECOVERY","목표는 밀고 가되 끝난 뒤 회복할 시간까지 일정에 넣는 편이 좋습니다."],
  };
  for(const arc of input.profiles.resonance.traitArcs){
    const g=guards[arc.semanticTheme];
    if(!g||!arc.shadowDescription||!arc.provenance.shadow)continue;
    const positive=introduced.find(c=>c.traitArcIds.includes(arc.id)&&!c.factBomb);
    const shadow=introduced.find(c=>c.factBomb&&(c.traitArcIds.includes(arc.id)||c.claimIds.some(id=>arc.provenance.shadow!.claimIds.includes(id))));
    if(positive&&shadow)add(positive,"STRENGTH_SHADOW_GUARD",g[0],g[1],GUIDANCE_SHORT_TITLES[g[0]],g[2],75,[positive,shadow]);
  }
  const eligible=mergeOperatingRules(rows),selected:OperatingRuleCandidate[]=[];
  for(const r of eligible)if(!selected.some(x=>x.operatingSlot===r.operatingSlot)&&selected.length<5)selected.push(r);
  for(const r of eligible)if(selected.length<3&&!selected.includes(r)&&selected.filter(x=>x.operatingSlot===r.operatingSlot).length<2)selected.push(r);
  return {eligible,selected};
}
