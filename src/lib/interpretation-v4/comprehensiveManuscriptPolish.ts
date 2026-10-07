import type { AdaptedNarrativeSource } from "./comprehensiveNarrativeAdapter";
import type { ComprehensivePlanInputs, ComprehensiveSectionId } from "./comprehensivePlanCore";
import type { NarrativePhrase } from "./narrativeCore";
import { humanOutcome, strongestHumanAxis, HUMAN_VALUE, REINFORCE_OUTCOMES } from "./narrativeHumanOutcome";
import { fortuneReason, fortuneSupportReason, planFortuneReasons, positiveReward } from "./narrativePositiveReward";
import type { SemanticSignature, SemanticAxis } from "./semanticCore";
import { statusVocabulary, workBlockIntent } from "./narrativeHumanFirst";
import { causalAxes, reasonLink } from "./narrativeCausality";
import { directHumanSurface, fusionHumanSurface, WORK_APPLICATION, RELATION_APPLICATION, AXIS_HUMAN_REASON } from "./narrativeHumanSurface";
import { termDefinitionText } from "./narrativeTerminology";

export const GYEOL_MANUSCRIPT_POLISH_VERSION = "comprehensive-quality-13d-6a2-v1";
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
    for(const p of phrases) if(p.role==="DIRECT_CLAIM") p.text="가까운 사람의 말이어도 납득되지 않으면 다시 묻고, 한번 정한 생각을 쉽게 바꾸지는 않습니다.";
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
  const actualFusion = [...i.fusion.reinforce,...i.fusion.tensions,...i.fusion.complements].find(f=>f.id===c.sourceId);
  // A primary's human reading is not the unrelated positiveMeaning on a many-axis atom.
  if (actualFusion && direct) {
    if (actualFusion.type === "REINFORCE") direct.text = humanOutcome(actualFusion.myeongli.side.axis,actualFusion.myeongli.side.direction) ?? direct.text;
    else direct.text = humanizeSourceClause(c.sourceText);
  }
  const directSurface=directHumanSurface(c);
  if(direct && directSurface) direct.text=directSurface;
  const fusionSurface=fusionHumanSurface(c);
  if(fusionSurface) for(const p of phrases)if(p.role==="FUSION"||p.role==="DIRECT_CLAIM")p.text=fusionSurface;
  const roleApplication=out.placement.reuseIntent==="DIFFERENT_APPLICATION";
  if(direct && roleApplication && !c.fusionType && !c.fortune && !c.factBomb) {
    const registry=section==="C8"?WORK_APPLICATION:section==="C7"?RELATION_APPLICATION:undefined;
    const axis=registry&&strongestHumanAxis(c.primaryAxes.filter(a=>!!registry[a]),sourceAxes);
    if(axis && registry?.[axis])direct.text=registry[axis]!;
  }
  // Do not turn a work-process candidate into a money claim with a prefix.
  if(section==="C8") out.diagnostics.push(`C8_INTENT:${workBlockIntent(c)}`);
  for(let n=phrases.length-1;n>=0;n--) {
    const p=phrases[n];
    if(p.id.endsWith(":context-recall")) {phrases.splice(n,1);continue;}
    p.text=statusVocabulary(p.text,i.guidance.context.lifeStatus);
    if(p.role==="MYEONGLI_REASON" && !c.fortune) {
      const term=p.termDefinitionKey&&src.evidenceTerms?.find(t=>t.key===p.termDefinitionKey);
      const proof=atoms.filter(e=>(term?term.sourceEvidenceIds:p.refs.evidenceIds).includes(e.id));
      const linked=proof.filter(e=>reasonLink(c,e));
      const side=actualFusion?.myeongli.side;
      const a=linked.find(e=>side && (e.axes[side.axis]??0)*side.direction>0) ?? linked[0];
      const axis=a && (side && (a.axes[side.axis]??0)*side.direction>0 ? side.axis : strongestHumanAxis(causalAxes(c,a),a.axes));
      const human=a&&axis?((a.axes[axis]??0)>0?AXIS_HUMAN_REASON[axis]:undefined)??humanOutcome(axis,a.axes[axis]??0):undefined;
      if(!human) {phrases.splice(n,1);out.diagnostics.push(`CAUSAL_REASON_SUPPRESSED:${p.id}`);continue;}
      if(term) {
        term.easyDefinition=human;
        // Korean termDefinitionPhrase owns the subject particle.
        p.text=termDefinitionText(term);
      } else p.text=human;
      p.refs={...p.refs,evidenceIds:[a!.id]};
      out.diagnostics.push(`CAUSAL_LINK:${JSON.stringify(reasonLink(c,a!))}`);
    }
    if(p.role==="CLOSER" && !c.fortune && /^A\d/.test(c.sourceId)) {
      // Quiet charm is a valid selected Claim, but depth alone is not a charm explanation.
      const proof=atoms.filter(e=>p.refs.evidenceIds.includes(e.id));
      const axis=proof.flatMap(e=>causalAxes(c,e).filter(a=>(e.axes[a]??0)>0).map(axis=>({e,axis})))[0];
      if(!axis) {phrases.splice(n,1);out.diagnostics.push("CHARM_REWARD_SOURCE_SCARCITY");}
      else { p.text=humanOutcome(axis.axis,axis.e.axes[axis.axis]!)!;p.refs={...p.refs,evidenceIds:[axis.e.id]}; }
    }
  }
  // The resolved third interpretation is the person, not a label about two systems.
  if(actualFusion?.type==="TENSION") {
    const contrast=phrases.find(p=>p.role==="CONTRAST");
    const side=actualFusion.mbti.side;
    if(contrast) contrast.text=humanOutcome(side.axis,side.direction)??contrast.text;
  }
  // Avoid a second verbatim conclusion inside the same block. Keep the richer closing role.
  src.phrases=phrases.filter((p,n)=> !phrases.slice(0,n).some(prev=>prev.text===p.text&&prev.role===p.role));
  return out;
}
