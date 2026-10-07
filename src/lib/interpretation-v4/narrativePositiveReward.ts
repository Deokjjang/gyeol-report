import type { EditorialCandidate, ComprehensivePlanInputs } from "./comprehensivePlanCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";
import { humanOutcome, strongestHumanAxis, HUMAN_VALUE } from "./narrativeHumanOutcome";

export type FortuneReasonPlan = { claimId: string; primaryReasonEvidenceIds: string[]; secondaryReasonEvidenceIds: string[]; imageEvidenceId?: string; humanRewardIntent: string };
const positive = (e: EvidenceAtom, tag: keyof NonNullable<EvidenceAtom["fortuneTags"]>) => (e.fortuneTags?.[tag] ?? 0) > 0;
export function fortuneSupportAxes(c:EditorialCandidate):readonly SemanticAxis[] {
  if(c.fortuneFamilies.includes("PEOPLE_LUCK")||c.fortuneFamilies.includes("CHARM_INTIMACY"))return["SOCIAL_ATTUNEMENT","CARE","RELATION_STYLE"];
  if(c.fortuneFamilies.includes("CHARM_VISIBILITY"))return["EXPRESSION","CHARISMA"];
  if(c.fortuneFamilies.includes("MONEY_FORTUNE"))return["RESOURCE_SENSE","PRACTICALITY"];
  if(c.fortuneFamilies.includes("HONOR_POSITION"))return["LEADERSHIP","DUTY","STATUS_DRIVE"];
  return c.primaryAxes;
}
export function fortuneSupportReason(e:EvidenceAtom,c:EditorialCandidate) {
  const axis=strongestHumanAxis(fortuneSupportAxes(c).filter(a=>(e.axes[a]??0)>0),e.axes);
  return axis?humanOutcome(axis,e.axes[axis]!):undefined;
}
export function planFortuneReasons(c: EditorialCandidate, i: ComprehensivePlanInputs): FortuneReasonPlan {
  const atoms = i.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id));
  const score = (e: EvidenceAtom) => c.fortuneFamilies.includes("PEOPLE_LUCK") ? Number(positive(e, "HELPER_LUCK")) * 10
    : c.fortuneFamilies.includes("CHARM_INTIMACY") ? Number(positive(e, "INTIMATE_CHARM")) * 10
    : c.fortuneFamilies.includes("CHARM_VISIBILITY") ? Number(positive(e, "FIRST_IMPRESSION") || positive(e, "SOCIAL_VISIBILITY")) * 10
    : Number(e.family === "WEALTH" || e.family === "OFFICER") * 10 + Number(positive(e, "POSITION") || positive(e, "ACCUMULATION")) * 5;
  const composite = c.sourceId === "S08_MONEY_AND_HONOR";
  const primary = (composite ? atoms.filter(e=>e.family==="WEALTH") : atoms).sort((a,b)=>score(b)-score(a)||b.weight-a.weight)[0];
  const other = atoms.filter(e => e.family !== primary?.family && (composite ? e.family==="OFFICER" : fortuneSupportAxes(c).some(a=>(e.axes[a]??0)>0)))
    .sort((a,b)=>Math.max(...fortuneSupportAxes(c).map(axis=>(b.axes[axis]??0)*b.weight),0)-Math.max(...fortuneSupportAxes(c).map(axis=>(a.axes[axis]??0)*a.weight),0)||b.weight-a.weight)[0];
  return { claimId:c.sourceId, primaryReasonEvidenceIds:primary?[primary.id]:[],secondaryReasonEvidenceIds:other?[other.id]:[],
    humanRewardIntent:c.fortuneFamilies.join("+") || c.broadTheme };
}
/** Each description is licensed by the exact tag/family on this atom, never a label-only lookup. */
export function fortuneReason(e: EvidenceAtom): string | undefined {
  const label=typeof e.metadata?.label === "string" ? e.metadata.label : undefined;
  if(positive(e,"HELPER_LUCK")) return `${label ?? "사람의 도움을 보는 기운"}은 혼자 막혔을 때 사람의 도움이나 연결로 길을 찾는 좋은 신호입니다.`;
  if(positive(e,"INTIMATE_CHARM")) return `${label ?? "가까운 사이에서 살아나는 매력"}은 멀리서 눈에 띄는 것과 달리, 가까이 지내며 알게 되는 모습에서 살아나는 매력이에요.`;
  if(positive(e,"FIRST_IMPRESSION")||positive(e,"SOCIAL_VISIBILITY")) return `${label ?? "첫인상에서 드러나는 매력"}은 처음 만났을 때 분위기나 표현으로 눈에 들어오는 쪽이에요.`;
  if(e.family==="WEALTH") return "재성은 실제로 얻고 남기는 결과를 보니, 마음에 드는 기회라도 들어가는 돈과 남는 것을 같이 확인하려는 쪽이에요.";
  if(e.family==="OFFICER") return "관성은 책임과 기준을 보는 기운이라, 결정해야 할 일이 생겼을 때 맡은 역할을 분명히 하고 지키려는 모습이에요.";
  if(positive(e,"POSITION")||positive(e,"RECOGNITION")||positive(e,"VISIBLE_AUTHORITY")) return `${label ?? "자리와 인정을 보는 기운"}은 필요한 순간에 앞에서 역할을 맡고 자기 존재를 보여주며 인정받는 쪽에 닿아 있어요.`;
  if(positive(e,"ACCUMULATION")) return "쌓아두는 기운은 한 번 얻는 데서 끝내지 않고, 돈뿐 아니라 기술과 경험도 오래 남길 것으로 보는 쪽이에요.";
  const a=strongestHumanAxis(Object.keys(e.axes) as (keyof typeof e.axes)[],e.axes);
  return a? humanOutcome(a,e.axes[a]!):undefined;
}
export function positiveReward(c: EditorialCandidate, atoms: readonly EvidenceAtom[]): string | undefined {
  if(c.sourceId==="S08_MONEY_AND_HONOR") return "실제로 남기는 결과와 책임 있는 자리, 둘을 함께 노려볼 만한 패입니다. 돈만 좇거나 이름만 얻는 데서 끝내기보다 해낸 만큼 자기 몫도 남기고 싶은 쪽이에요.";
  if(c.fortuneFamilies.includes("PEOPLE_LUCK")) return "혼자 해결할 때와 사람에게 길을 물을 때는 이야기가 달라질 수 있어요. 도움을 받을 연결이 있다는 점이 좋은 패입니다.";
  if(c.fortuneFamilies.includes("CHARM_INTIMACY")) return "첫 만남에서 다 보여주지 않아도 괜찮은 매력이에요. 함께 지내며 알게 되는 모습이 관계를 더 가깝게 만들 수 있습니다.";
  if(c.fortuneFamilies.includes("CHARM_VISIBILITY")) return "처음 만난 자리에서 먼저 눈에 들어오는 매력이죠. 자기 표현을 보여줄 기회가 있을 때 이 좋은 면도 드러납니다.";
  if(c.fortuneFamilies.includes("MONEY_FORTUNE")) return "기회를 알아보는 데서 그치지 않고 실제로 남길 것을 찾는 쪽이에요. 돈을 다루는 감각을 써볼 만한 패입니다.";
  if(c.fortuneFamilies.includes("HONOR_POSITION")) return "실력을 쌓은 뒤에는 책임 있는 자리에서 그것을 보여줄 여지도 있습니다. 앞에 서서 인정받는 쪽을 노려볼 만해요.";
  const axes = Object.assign({},...atoms.map(e=>e.axes));
  const a=strongestHumanAxis(c.primaryAxes.filter(a=>HUMAN_VALUE[a]),axes);
  return a ? HUMAN_VALUE[a] : undefined;
}
