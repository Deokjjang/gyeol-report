import type { AdaptedNarrativeSource } from "./comprehensiveNarrativeAdapter";
import type { ComprehensivePlanInputs, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { NarrativePhrase } from "./narrativeCore";
import { humanOutcome, strongestHumanAxis, HUMAN_VALUE, REINFORCE_OUTCOMES } from "./narrativeHumanOutcome";
import { fortuneReason, fortuneSupportReason, planFortuneReasons, positiveReward } from "./narrativePositiveReward";
import type { SemanticSignature, SemanticAxis } from "./semanticCore";

export const GYEOL_MANUSCRIPT_POLISH_VERSION = "comprehensive-quality-13d-6a-v1";
export const META_LANGUAGE = /보조합니다|보조하는|보태는 신호|힘을 보탭니다|강점이 있습니다|장점이 있습니다|근거가 있습니다/;
/** Suffix-only, role-scoped realization. Never replaces predicates throughout an arbitrary paragraph. */
export function humanizeSourceClause(text:string) {
  if(text.endsWith("사람으로 이어질 수 있습니다.")) return text.replace(/사람으로 이어질 수 있습니다[.]$/, "편일 수 있습니다.");
  if(text.endsWith("조합입니다.")) return text.replace(/조합입니다[.]$/, "모습입니다.");
  if(text.endsWith("수 있는 구조.")) return text.replace(/수 있는 구조[.]$/, "수 있습니다.");
  if(text.endsWith("구조.")) return text.replace(/구조[.]$/, "모습입니다.");
  if(text.endsWith("쪽을 보조합니다.")) return text.replace(/쪽을 보조합니다[.]$/, "쪽이에요.");
  return text;
}
/** Same selected source, deeper realization. Not a second renderer and not a finished-text filter. */
export function polishComprehensiveSource(adapted:AdaptedNarrativeSource,i:ComprehensivePlanInputs,section:ComprehensiveSectionId):AdaptedNarrativeSource {
  const out=structuredClone(adapted), c=out.candidate, src=out.source;
  const atoms=i.myeongli.evidence.filter(e=>c.myeongliEvidenceIds.includes(e.id));
  const phrases=src.phrases.map(p=>({...p}));
  const sourceAxes:SemanticSignature=Object.assign({},...atoms.map(e=>e.axes));
  const reinforce=c.fusionType==="REINFORCE"?i.fusion.reinforce.find(f=>f.id===c.sourceId):undefined;
  if(c.sourceId==="F01_STUBBORN" && out.placement.reuseIntent==="DIFFERENT_APPLICATION" && ["social","love"].includes(out.placement.context)) {
    for(const p of phrases) if(p.role==="DIRECT_CLAIM") p.text="가까운 사람과 의견이 엇갈려도 납득되지 않으면 자기 뜻을 쉽게 거두지 않습니다.";
  }
  for(const p of phrases){
    if(p.role==="ACTION"||p.role==="LIFE_SCENE"||p.termDefinitionKey||p.role==="MBTI_REASON") continue;
    if(reinforce && p.role==="FUSION" && reinforce.myeongli.side.direction>0 && reinforce.mbti.side.direction>0
      && reinforce.myeongli.side.axis===reinforce.mbti.side.axis) {
      const conclusion=REINFORCE_OUTCOMES[reinforce.myeongli.side.axis];
      if(conclusion) { p.text=conclusion;continue; }
    }
    if(c.fortune && p.role==="GOOD_RESULT" && c.sourceId==="P01_PEOPLE_LUCK") {
      // Existing L4 is direct; L3 remains a possibility, not promoted to a luck guarantee.
      p.text=(c.claimLevel??0)>=4?"사람복이 있습니다.":"사람을 통해 도움이나 새로운 길을 만날 수 있어요.";continue;
    }
    if(!c.factBomb && META_LANGUAGE.test(p.text)){
      const proof=atoms.filter(e=>p.refs.evidenceIds.includes(e.id));
      const axes:SemanticSignature=Object.assign({},...proof.map(e=>e.axes));
      const axis=strongestHumanAxis(c.primaryAxes.length?c.primaryAxes:Object.keys(axes) as SemanticAxis[],axes);
      const human=axis?humanOutcome(axis,axes[axis]??0):undefined;
      if(human) p.text=human;
    }
    if(!c.factBomb && (c.claimLevel??0)<3) p.text=humanizeSourceClause(p.text);
  }
  const direct=phrases.find(p=>["DIRECT_CLAIM","GOOD_RESULT"].includes(p.role));
  const add=(base:NarrativePhrase,role:NarrativePhrase["role"],text:string,tag:string,ids=base.refs.evidenceIds)=>phrases.push({...base,id:`${c.id}:quality:${tag}`,role,text,
    origin:"MYEONGLI",refs:{...base.refs,evidenceIds:[...ids]},termDefinitionKey:undefined,imageKey:undefined});
  if(section==="C9" && direct && !src.fusionType && /회복|혼자 쉬|혼자 정리/.test(c.sourceText)) {
    const recovery=atoms.filter(e=>(e.axes.RECOVERY_NEED??0)>0);
    if(recovery.length){
      for(let n=phrases.length-1;n>=0;n--)if(phrases[n].role==="CLOSER" || phrases[n].role==="MYEONGLI_REASON" && !phrases[n].termDefinitionKey)phrases.splice(n,1);
      add(direct,"MYEONGLI_REASON",humanOutcome("RECOVERY_NEED",1)!,"recovery-reason",recovery.map(e=>e.id));
      add(direct,"CLOSER",HUMAN_VALUE.RECOVERY_NEED!,"recovery-value",recovery.map(e=>e.id));
    }
  }
  if(direct && (section==="C4"||section==="C5")){
    const axis=strongestHumanAxis(c.primaryAxes.filter(a=>HUMAN_VALUE[a]),sourceAxes);
    if(axis && !c.fusionType) {
      for(let n=phrases.length-1;n>=0;n--) if(phrases[n].role==="CLOSER") phrases.splice(n,1);
      add(direct,"CLOSER",HUMAN_VALUE[axis]!,"value");
    }
  }
  if(section==="C5" && direct){
    // Reason selection reads complete underlying proof, not the unrelated term-definition owner.
    const plan=planFortuneReasons(c,i), ids=[...plan.primaryReasonEvidenceIds,...plan.secondaryReasonEvidenceIds];
    const reasons=ids.flatMap(id=>{const e=atoms.find(e=>e.id===id)!;
      const text=plan.secondaryReasonEvidenceIds.includes(id)&&c.sourceId!=="S08_MONEY_AND_HONOR"?fortuneSupportReason(e,c):fortuneReason(e);
      return text?[{e,text}]:[];});
    if(c.fortune && reasons.length){
      for(let n=phrases.length-1;n>=0;n--) if(["MYEONGLI_REASON","CLOSER","IMAGE"].includes(phrases[n].role)) phrases.splice(n,1);
      // A reason pair is indivisible: the paragraph planner must not choose just
      // wealth without status, or helper luck without its actual social support.
      add(direct,"MYEONGLI_REASON",reasons.map(r=>r.text).join(" "),"fortune-reasons",reasons.map(r=>r.e.id));
    }
    const reward=positiveReward(c,atoms);
    if(reward) add(direct,"CLOSER",reward,"reward");
    out.diagnostics.push(`FORTUNE_REASON_PLAN:${JSON.stringify(plan)}`);
  }
  // Avoid a second verbatim conclusion inside the same block. Keep the richer closing role.
  src.phrases=phrases.filter((p,n)=> !phrases.slice(0,n).some(prev=>prev.text===p.text&&prev.role===p.role));
  return out;
}
