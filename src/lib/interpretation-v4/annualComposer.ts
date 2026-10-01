import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import { annualNarrativeEvidence, type AnnualClock, type AnnualEvidence } from "./annualEvidence";
import { getAnnualFortuneSeoulDateParts } from "../report-knowledge/annualFortuneYearRules";
import { annualMonthNarrative, type AnnualEditorialState } from "./annualMonthNarrative";
import { majorContext } from "./majorContext";
import { MAJOR_MEANINGS } from "./majorMaterials";
import { paragraph, proof, particle } from "./copyRealizer";
import { reviewNarrative } from "./editorialGuard";
import type { NarrativeBlock, NarrativeSection } from "./narrativeTypes";

const YEAR: Record<TenGod, { opening: string; gift: string; caution: string; final: string }> = {
  비견: { opening: "남이 보기 좋은 선택보다 내가 계속 하고 싶은 선택이 더 중요해지는 해입니다. 누가 허락해줘야 시작할 수 있다는 마음에서 한 걸음 나와 내 방식의 크기를 정해볼 때예요.", gift: "스스로 고른 길을 버틸 힘이 좋은 패입니다. 같은 일을 해도 내 취향과 판단이 들어간 부분은 오래 가져갈 이유가 됩니다. 독립적으로 결정해본 경험이 다음 선택의 자신감으로 남을 만해요.", caution: "내 방식이 맞다는 확신이 남의 방식까지 틀렸다는 뜻은 아닙니다.", final: "남이 정해준 속도보다 내가 책임질 선택이 오래 갑니다" },
  겁재: { opening: "혼자 할 수 있는 일의 크기보다 누구와 함께 움직일지가 더 중요해지는 해입니다. 비슷한 열정을 가진 사람은 경쟁자가 되기도 하지만 내가 시작할 용기를 주는 편이 될 수도 있어요.", gift: "사람과 힘을 합쳐 판을 넓히는 장점이 살아납니다. 나에게 없는 솜씨를 가진 사람을 알아보고 같은 목표로 움직일 때 혼자서는 못 만들 결과를 기대해볼 만해요. 함께하는 힘이 곧 내 몫을 없애는 뜻은 아닙니다.", caution: "친하다고 비용과 기여까지 저절로 공평해지지는 않습니다.", final: "내 몫을 지키는 선이 있어야 같이 키운 기쁨도 오래 남습니다" },
  식신: { opening: "계획을 더 세우기보다 이미 가진 솜씨를 눈앞의 결과로 꺼내는 쪽이 강한 해입니다. 머릿속에서는 별것 아니었던 재주도 다른 사람이 직접 써보면 값이 달라질 수 있어요.", gift: "표현과 결과물에 좋은 힘이 있습니다. 한 번 잘했다고 끝나는 것이 아니라 다시 찾을 이유를 만드는 능력에 마음을 써볼 만해요. 좋아서 꾸준히 해온 일이 밖에서도 통할 수 있다는 기대를 가져도 좋습니다.", caution: "재미가 붙으면 쉬는 시간까지 전부 일에 넣는 버릇이 있습니다.", final: "해보겠다는 말보다 내가 남긴 하나가 다음 문을 엽니다" },
  상관: { opening: "참고 맞추던 사람이 다른 답을 꺼내는 쪽으로 무게가 가는 해입니다. 불편한 것을 알아보는 눈은 이미 있고, 이제는 지적에서 끝내지 않고 바뀐 모습을 보여줄 때 힘이 납니다.", gift: "남과 다른 답으로 눈에 띌 표현의 좋은 패가 있습니다. 익숙해서 모두 넘기던 질문을 잡으면 결과의 모양이 달라져요. 누군가에게는 번거로운 질문이 나에게는 실력을 드러낼 입구가 될 만합니다.", caution: "틀린 점을 말하다가 그 사람 전체를 평가하기 쉽습니다.", final: "옳았다는 말보다 내가 바꿔놓은 장면이 더 오래 기억됩니다" },
  편재: { opening: "익숙한 곳 밖에서 기회를 발견하고 현실적인 값으로 이어보는 해입니다. 사람과 새로운 경험을 만나는 일이 단순한 구경으로 끝나지 않게 내 기술의 쓰임을 넓혀볼 때예요.", gift: "재물과 바깥 기회를 연결해볼 좋은 힘이 있습니다. 내가 해온 일을 다른 사람이 어디에 필요로 하는지 듣다 보면 생각보다 넓은 길이 보일 만해요. 크게 보이는 제안보다 실제로 주고받을 것이 분명한 곳에서 실속을 찾기 좋습니다.", caution: "좋아 보이는 제안을 다 잡으려 하면 정작 잘할 일을 놓칩니다.", final: "넓어진 판보다 그 안에서 내 손에 남긴 것이 나를 키웁니다" },
  정재: { opening: "더 크게 벌이는 것보다 이미 해낸 것을 돈과 생활의 안정으로 남기는 해입니다. 수고한 만큼 내 것이 무엇인지 궁금해지고, 반복할 수 있는 수입과 리듬이 더 반갑게 느껴질 수 있어요.", gift: "쌓아두는 재물의 힘을 적극적으로 써볼 만합니다. 꾸준히 잘하는 일의 값을 확인하고 작게 새는 비용을 정리하면 성과의 모양이 생활 가까이로 와요. 요란한 성공만큼 다음 달에도 편안한 선택이 좋은 패입니다.", caution: "모든 즐거움을 비용으로만 세면 아끼고도 답답해집니다.", final: "바쁜 하루가 아니라 오래 내 것으로 남는 하루를 고를 때입니다" },
  편관: { opening: "실력을 조용히 쌓는 데서 어려운 판단을 맡는 쪽으로 무게가 옮겨가는 해입니다. 부담도 커질 수 있지만 그만큼 앞에 서고 존재감을 보여줄 자리도 생각해볼 만해요.", gift: "압박 속에서 판단을 내리는 리더십과 자리운이 좋은 힘입니다. 쉬운 답이 없을 때도 먼저 골라야 할 것을 알아보면 주변이 기대하는 역할이 달라질 수 있어요. 잘 버티는 것만 아니라 내 판단의 값을 알릴 만한 흐름입니다.", caution: "해결할 수 있다는 이유로 전부 떠안으면 쉬는 날에도 머리가 일합니다.", final: "버틸 힘을 전부 쓰기보다 판단할 자리를 내 것으로 만들 때입니다" },
  정관: { opening: "해온 일을 믿고 맡길 수 있는 이름으로 바꾸는 해입니다. 한 번 눈에 띄는 것보다 계속 약속을 지키는 태도가 더 크게 읽혀요. 칭찬을 넘어서 실제로 맡을 역할을 생각해볼 때입니다.", gift: "명예와 자리의 좋은 흐름을 써볼 만합니다. 해온 일의 끝을 분명하게 보여주면 성실함이 막연한 인상을 넘어 맡겨볼 이유가 돼요. 요란하지 않아도 믿음이 쌓이는 방식으로 인정의 폭을 넓힐 수 있습니다.", caution: "실망시키기 싫어서 계속 괜찮다고 하면 내 일정만 사라집니다.", final: "좋은 평판은 내 시간을 지우지 않고도 쌓을 수 있습니다" },
  편인: { opening: "남의 답을 따라가기보다 내가 오래 궁금했던 것을 다시 파는 해입니다. 바로 쓸모를 설명하지 못했던 관심도 버릴 재료는 아니에요. 다른 관점으로 이해한 것이 다음 길의 차이를 만들 수 있습니다.", gift: "남다른 이해를 전문성으로 바꾸는 학습운이 있습니다. 혼자 고민한 질문에서 나만 알던 연결을 발견하면 과거 경험의 쓰임도 새로 보일 만해요. 빨리 아는 사람과 다르게 이해하는 사람은 서로 다른 힘을 갖고 있습니다.", caution: "답을 더 찾느라 해볼 수 있는 작은 시작까지 미루기 쉽습니다.", final: "오래 궁금했던 질문이 내가 다시 시작할 길이 될 수 있습니다" },
  정인: { opening: "배움과 도움을 받아 앞으로 오래 쓸 기반을 다지는 해입니다. 혼자 다 해내려는 마음에서 조금 내려와 좋은 설명을 만나면 이미 가진 실력도 다른 모양으로 이어질 수 있어요.", gift: "배워둔 것을 내 편으로 만드는 좋은 흐름입니다. 쌓인 경험을 정리하거나 믿을 만한 사람에게 모르는 부분을 묻는 시간이 나중의 수고를 줄일 수 있어요. 조용히 익힌 것이 필요할 때 꺼내 쓸 힘으로 남을 만합니다.", caution: "준비가 편해지면 이미 아는 것도 계속 연습만 합니다.", final: "더 배워야 할 나만 보지 말고 이미 꺼내 쓸 나를 믿을 때입니다" },
};

function crossText(p: AnnualEvidence["crossPeriods"][number]) {
  const annual = MAJOR_MEANINGS[p.annualGod], c = p.cycles[0];
  if (!c) return "첫 대운이 시작되기 전에는 한 해의 변화와 익숙한 생활을 함께 보는 편이 자연스럽습니다. 큰 역할을 미리 정하기보다 어떤 경험을 편하게 받아들이는지 살펴볼 시간입니다.";
  if (p.segment.activeDayunContext.status === "transition_uncertain") return "큰 흐름이 넘어가는 경계에 걸쳐 있습니다. 지금까지 익힌 방식을 버리기보다 새롭게 중요해지는 선택을 함께 살펴볼 때입니다. 전환 전후 어느 쪽이 중심인지는 출생시간의 범위 안에서 열어둡니다.";
  const major = MAJOR_MEANINGS[c.god];
  const flow = c.flowGod;
  if (["비견", "겁재"].includes(flow)) return `${c.god === p.annualGod ? `${particle(major.theme, "은", "는")} 큰 흐름과 한 해가 함께 비추는 주제입니다.` : `큰 흐름이 향하는 ${particle(major.theme, "과", "와")} 한 해의 ${particle(annual.theme, "이", "가")} 같은 쪽을 밀어줍니다.`} 오래 중요하게 보던 것을 구체적인 선택으로 옮겨볼 접점이에요. 같은 방향의 힘이 겹치는 만큼 더 많이 하기보다 무엇을 내 것으로 남길지 고르는 감각이 중요합니다.`;
  if (["식신", "상관"].includes(flow)) return `그동안 ${particle(major.theme, "에", "에")} 쌓아온 힘을 ${particle(annual.work, "에", "에")} 꺼내볼 흐름입니다. 큰 배경이 한 해의 움직임에 재료를 내어주는 쪽이에요. 준비해둔 것을 밖에서 써보는 즐거움이 있지만, 익숙한 기반까지 모두 써버리지 않을 여유도 남길 만합니다.`;
  if (["정인", "편인"].includes(flow)) return `한 해의 ${particle(annual.theme, "이", "가")} 더 긴 목표인 ${particle(major.theme, "을", "를")} 받쳐줄 수 있습니다. 당장 하는 일이 먼 목표와 따로인 것 같아도 그 결과를 어디에 쌓느냐에 따라 연결이 생겨요. ${particle(annual.work, "을", "를")} 한 번의 수고로 끝내지 않을 이유가 여기에 있습니다.`;
  if (["편재", "정재"].includes(flow)) return `큰 흐름은 ${particle(major.theme, "을", "를")} 보고, 한 해는 ${particle(annual.theme, "을", "를")} 요구합니다. 오래 세운 기준으로 새 선택의 크기를 정해야 하는 관계예요. 하고 싶은 것과 감당할 수 있는 것을 함께 놓으면 서로 다른 방향도 싸움 대신 균형을 만드는 재료가 됩니다.`;
  return `오래 익숙했던 ${particle(major.theme, "에", "에")} 한 해의 ${particle(annual.theme, "이", "가")} 질문을 던지는 흐름입니다. 편하게 해오던 방식만으로는 부족하다고 느끼며 선택을 다시 볼 수 있어요. 압박을 전부 나쁜 신호로 읽기보다 ${particle(major.cost, "을", "를")} 알아차리는 계기로 쓰는 쪽이 유용합니다.`;
}

/** Text/packet only. No route, persistence, payment, provider, ambient clock. */
export async function composeAnnualFortuneNarrative(payload: unknown, clock: AnnualClock) {
  const e = await annualNarrativeEvidence(payload, clock); if (!e.ok) return e;
  const c = majorContext(e.input), god = e.raw.annualFortune.stemTenGod, branchGod = e.raw.annualFortune.branchTenGod;
  const year = YEAR[god], meaning = MAJOR_MEANINGS[god], source = proof([], [], [], e.sourceRefs);
  const b = (id: string, text: string, tone: NarrativeBlock["tone"] = "positive") => paragraph(id, text, source, tone);
  const section = (id: string, title: string, blocks: readonly NarrativeBlock[], domain: NarrativeSection["domain"] = "success/fortune"): NarrativeSection => ({ id, title, blocks, domain });
  const atYear = e.time === "past" ? `${e.selectedYear}년을 돌아보면` : e.time === "future" ? `다가올 ${e.selectedYear}년에는` : `${e.selectedYear}년 지금은`;
  const opening = [
    b("annual-opening", `${atYear} ${particle(meaning.theme, "을", "를")} 한 해의 중심에 놓아볼 수 있습니다. ${year.opening}`),
    b("annual-context", `${e.time === "past" ? "지금의 직업이 과거에도 같았다고 정해두지는 않습니다. 아래 장면은 현재 알려준 경험에 비춰 돌아보는 이야기입니다. " : ""}${c.raw ? `${withKoreanParticle(`‘${c.raw}’`, "called")} 현재 맥락에서는` : "지금의 생활에서는"} ${particle(c.craft, "을", "를")} ${particle(meaning.work, "과", "와")} 이어볼 만합니다. ${particle(meaning.money, "도", "도")} 함께 보는 동안 ${particle(meaning.people, "과", "와")} 어떤 이야기를 나눌지 궁금해집니다.`),
    b("annual-gift", year.gift),
    b("annual-shadow", year.caution, "shadow"),
  ];
  const mainPeriod = e.crossPeriods.find(p => p.time === "current") ?? e.crossPeriods.find(p => p.annualGod === god) ?? e.crossPeriods[0];
  const longGod = mainPeriod.segment.activeDayunContext.status === "active" ? mainPeriod.cycles[0]?.god : undefined;
  if (longGod) opening.push(b("annual-long-view", `${e.time === "past" ? "그해 초반의 큰 배경을 돌아보면" : e.time === "future" ? "그해 초반의 긴 흐름에서는" : "지금의 더 큰 배경에서는"} ${particle(MAJOR_MEANINGS[longGod].theme, "을", "를")} 이어${e.time === "past" ? "가던 결을 읽을 수 있습니다" : e.time === "future" ? "갈 전망입니다" : "가고 있습니다"}. ${god === longGod ? "한 해도 같은 주제를 비추니 오래 해온 선택을 더 선명하게 볼 만합니다." : `한 해의 ${particle(meaning.theme, "은", "는")} 그 길 안에서 새롭게 다뤄볼 부분입니다.`}`));
  const sections: NarrativeSection[] = [];
  const crossBlocks = e.crossPeriods.map((p, i) => {
    const start = `${Number(p.startKst.slice(5, 7))}월 ${Number(p.startKst.slice(8, 10))}일`, end = getAnnualFortuneSeoulDateParts(new Date(Date.parse(p.endKstExclusive) - 1));
    const label = `${start}부터 ${end.month}월 ${end.day}일까지${p.time === "past" ? "를 돌아보면" : p.time === "future" ? "를 내다보면" : " 이어지는 지금 흐름에서는"}`;
    const effective = p.segment.effectiveAnnualPillar.stem + p.segment.effectiveAnnualPillar.branch;
    const carryover = effective !== e.raw.annualGanji.ganji;
    const text = carryover ? `새 달력을 펼쳐도 ${particle(MAJOR_MEANINGS[p.annualGod].theme, "을", "를")} 다루던 앞선 흐름이 잠시 이어집니다. ${p.cycles[0] ? `큰 배경인 ${particle(MAJOR_MEANINGS[p.cycles[0].god].theme, "도", "도")} 이 구간에서는 그대로입니다. ` : ""}2월 초를 지나며 한 해의 관심이 바뀌므로 1월부터 모든 것을 새로 정할 필요는 없습니다.` : crossText(p);
    return paragraph(`dayun-cross-${i}`, `${label}, ${text}`, proof([], [], [], p.sourceRefs));
  });
  sections.push(section("dayun-cross", "오래 가는 흐름과 한 해의 욕심이 만나는 자리", crossBlocks));
  const branch = MAJOR_MEANINGS[branchGod];
  sections.push(section("fortune", "바쁘기만 한 해가 아니라, 내 것이 남는 해로", [
    b("fortune-underneath", `${particle(meaning.work, "을", "를")} 겉으로 보여주는 동안 생활 가까이에서는 ${particle(branch.theme, "도", "도")} 함께 작동합니다. ${god === branchGod ? "하고 싶은 방향과 평소의 선택이 비슷한 이야기를 하는 셈입니다." : "밖에서 힘을 쓰는 방식과 돌아와 챙길 실속이 꼭 같은 모양일 필요는 없습니다."} ${particle(c.noun, "에서", "에서")} ${particle(branch.gift, "을", "를")} 떠올려볼 만합니다.`),
    b("fortune-value", `${particle(c.craft, "이", "가")} ${particle(branch.money, "과", "와")} 연결될 때 한 해의 수고도 더 구체적으로 남습니다. ${e.time === "past" ? "그해 남긴 경험 중 지금도 꺼내 쓸 만한 것을 찾아보면 좋겠습니다." : "눈에 띄는 결과 옆에 계속 지킬 수 있는 생활도 같이 놓아볼 때입니다."}`),
  ], "money"));
  const annualRelation = e.raw.natalAnnualRelations.interactions.find(r => r.affectedPillars?.includes("day")) ?? e.raw.natalAnnualRelations.interactions[0];
  if (annualRelation || e.annualStemRelations.length) sections.push(section("annual-relationship", "나만 열심히 한다고 관계의 속도까지 같지는 않습니다", [
    paragraph("annual-relations", annualRelation && ["충", "형", "파", "해"].includes(annualRelation.type)
      ? `한 해의 움직임이 익숙한 생활의 속도와 부딪히는 부분도 있습니다. ${particle(meaning.theme, "에", "에")} 힘을 쏟을수록 가까운 사람의 다른 속도까지 고치고 싶어질 수 있어요. 내 기준을 설명하는 것과 상대의 하루를 대신 정하는 것은 다른 일입니다.`
      : `내가 중요하게 여기는 것과 다른 사람의 쓰임이 만날 여지가 있습니다. ${particle(meaning.work, "을", "를")} 혼자 다 해내기보다 각자가 잘하는 부분을 맞춰보면 관계의 즐거움도 살아날 만해요. 처음부터 같다는 확신보다 같이 해보며 편해지는 경험이 좋은 바탕입니다.`,
      proof([], [], [], annualRelation ? [`annual:${e.selectedYear}:natal:${annualRelation.type}:${annualRelation.branches.join("")}`] : e.annualStemRelations.flatMap(r => r.sourceRefs))),
  ], "relationships"));
  const state: AnnualEditorialState = { godUses: new Map(), features: new Set(), relations: new Set(), fusions: new Set() };
  const months = e.months.map(m => annualMonthNarrative(e, m, c, state));
  for (const m of months) sections.push(section(`month-${m.month}`, `${m.month}월 · ${m.time === "past" ? "돌아보기" : m.time === "current" ? "지금" : "앞으로"}\n${m.title}`, m.blocks));
  const pillar = e.materials.selected.find(m => m.material.category === "dayPillar");
  const strength = pillar?.material.seeds.find(s => s.role === "strength");
  const finalBlocks = [
    b("final-focus", `${e.input.name}님에게 ${e.selectedYear}년은 ${particle(meaning.theme, "을", "를")} 내 방식으로 다뤄보는 한 해입니다. ${particle(c.noun, "을", "를")} 남의 성적표와만 비교하지 않으면 내가 가진 실력의 쓰임도 더 넓게 보입니다.`),
    ...(pillar && strength ? [paragraph("final-natal", `${strength.text} 한 해의 분위기가 달라져도 이 바탕까지 새로 만들어야 하는 것은 아닙니다.`, proof([pillar], [strength]), "positive")] : []),
    b("final-release", `${particle(meaning.cost, "은", "는")} 알아두되 한 해 전체의 이름으로 삼을 필요는 없습니다. ${particle(meaning.gift, "을", "를")} 써볼 장면도 같은 시간 안에 있습니다.`),
    b("final-carry", `${e.selectedYear + 1}년으로 가져갈 것은 더 긴 할 일 목록보다 ${particle(c.craft, "을", "를")} 어디에 쓰면 좋았는지 아는 경험입니다. 잘한 일과 나에게 편한 사람을 함께 남기면 다음 선택의 출발점도 달라집니다.`),
  ];
  sections.push(section("final", "올해를 잘 쓰는 핵심", finalBlocks));
  const narrative = { version: "v4-annual-fortune-narrative-1" as const,
    headline: `${e.input.name}님의 ${e.selectedYear}년 — ${withKoreanParticle(meaning.theme, "object")} ${c.noun}에 담는 해`,
    opening, sections, finalLine: `${e.selectedYear}년, ${year.final}.`, finalProof: source };
  return { ok: true as const, narrative, evidence: e, months, materials: e.materials,
    behaviorBasis: months.flatMap(m => m.behavior ? [m.behavior] : []),
    completeness: { months: months.length, opening: true, dayunCross: crossBlocks.length, fortune: true, final: true,
      monthProvenance: months.every(m => m.provenance.length > 0), ordered: e.segments.every((s, i) => Date.parse(s.startKst) < Date.parse(s.endKstExclusive) && (!i || e.segments[i - 1].endKstExclusive === s.startKst)) },
    editorial: reviewNarrative(narrative) };
}
