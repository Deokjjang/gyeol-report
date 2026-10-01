import { paragraph, proof, particle } from "./copyRealizer";
import { pairProof } from "./compatibilityInteractions";
import type { PairEvidence } from "./compatibilityEvidence";
import type { PairCategory, PairPerson } from "./compatibilityNarrativeTypes";

export function compatibilityHarmony(e: PairEvidence, a: PairPerson, b: PairPerson) {
  const harmony = e.relations.find(r => ["six_harmony", "three_harmony", "half_harmony"].includes(r.kind));
  const tension = e.relations.find(r => ["clash", "harm"].includes(r.kind));
  const A = `${a.name}님`, B = `${b.name}님`;
  const scenes: Record<PairCategory, string> = {
    love: `${A}과 ${B}은 이야기가 딱 맞아떨어지지 않는 날에도 같이 움직이며 가까워질 구석이 있습니다. 나들이 준비를 나눠 하거나 좋아하는 가게를 함께 찾아볼 때, 말로 확인하던 사이가 같이 해본 기억을 가진 사이가 됩니다. 상대가 혼자서는 챙기지 않던 부분을 보태주는 순간이 좋은 끌림으로 남습니다.`,
    marriage: `${A}과 ${B}에게는 각자 잘하던 것을 한집의 편안함으로 이어갈 바탕이 있습니다. 한 사람이 장본 것을 다른 사람이 저녁으로 완성하듯, 시작과 마무리가 다른 손을 거쳐도 괜찮습니다. 모든 일을 반씩 쪼개야만 공평한 것이 아니라 서로의 수고가 이어지고 있다는 감각이 중요합니다.`,
    parentChild: `${A}과 ${B}이 무언가를 함께 만들거나 해보는 시간은 잔소리 없이 서로를 알아갈 좋은 통로입니다. 부모가 시작을 돕고 자녀가 자기 방식으로 마무리할 때, 가르침과 선택이 같은 장면에 놓입니다. 결과를 대신 만들어주지 않아도 함께했다는 든든함은 남습니다.`,
    coworker: `${A}이 넘긴 일을 ${B}이 다른 눈으로 완성하고, 반대 방향으로도 도움을 주고받을 바탕이 있습니다. 빈 종이부터 둘이 붙잡기보다 각자 만든 것을 가져오면 서로의 쓸모가 더 잘 보입니다. 덕분에 내 방식만 고집하던 작업에도 다른 사람의 좋은 습관이 들어올 수 있습니다.`,
    managerReport: `${A}이 큰 방향을 설명하고 ${B}이 실제 반응을 가져오는 순환에 좋은 여지가 있습니다. 상사가 답을 모두 정해두지 않아도 팀원의 판단이 다음 결정에 보탬이 될 수 있습니다. 작은 일을 맡겨 성공적으로 돌아오는 경험이 쌓이면, 믿음은 막연한 기대보다 구체적인 기억이 됩니다.`,
    businessPartner: `${A}과 ${B}이 고객을 만나고 약속을 지키는 일을 이어 맡을 좋은 바탕이 있습니다. 한 번의 판매만 보지 않고 다음에도 찾아올 이유를 함께 만들 때 서로의 역할이 살아납니다. 기회를 발견한 사람과 지켜낸 사람의 공이 모두 남으면, 함께 키운 일이 관계도 단단하게 만듭니다.`,
    friendship: `${A}과 ${B}에게는 같이 해본 경험이 믿음으로 남을 여지가 있습니다. 여행지에서 길을 잘못 들어도 서로 다른 것을 발견하고 웃을 수 있는 순간이 생깁니다. 편한 대화만큼 작은 일을 함께 해결한 기억이 오랜 우정을 받쳐줍니다.`,
  };
  const harmonyProof = harmony ? pairProof(a.proof, b.proof, proof([], [], [], [`compatibilityRelationRules:detectCrossBranchRelations:${harmony.identity}`])) : null;
  const quietLove = e.category === "love" && [a.style, b.style].includes("independent");
  const harmonic = harmony && harmonyProof ? paragraph("pair-harmony", quietLove
    ? `${A}과 ${B}은 각자 좋아하는 일에 집중하다가도 같이 해볼 주제가 생기면 자연스럽게 이어질 구석이 있습니다. 굳이 모든 시간을 채우지 않아도 함께 준비한 여행이나 작은 취미가 관계를 엮어줍니다. 친해지는 속도를 겨루지 않을 때 담백한 만남에도 둘만의 기억이 늘어납니다.`
    : scenes[e.category], harmonyProof, "positive", "joint-action") : null;
  const tensionContexts: Record<PairCategory, string> = {
    love: "만날 계획을 바꾸는 순간", marriage: "휴일을 각자 다르게 쓰고 싶은 순간", parentChild: "부모의 계획과 자녀의 선택이 어긋나는 순간", coworker: "마감을 앞두고 수정 범위를 정하는 순간",
    managerReport: "보고한 내용과 상사가 기대한 답이 어긋나는 순간", businessPartner: "더 투자할지 멈출지 정하는 순간", friendship: "함께 잡은 일정을 바꾸는 순간",
  };
  const clashScenes: Record<PairCategory, string> = {
    love: "늦게 바뀐 약속 하나가 ‘나를 얼마나 생각했어?’라는 말로 커지기 쉽습니다. 상대가 정한 속도를 무조건 따라가야 한다고 느끼면 설렘이 긴장으로 바뀝니다.",
    marriage: "밖에서 쉬자는 제안과 집에서 아무것도 하고 싶지 않다는 대답이 부딪힐 수 있습니다. 같이 산다는 이유로 쉬는 방식까지 하나로 맞출 필요는 없습니다.",
    parentChild: "부모는 안전한 답을 빨리 정하고 싶어도 자녀는 자기 방법을 끝까지 해보고 싶을 수 있습니다. 반대하는 대답에도 이유를 붙일 자리가 있어야 보호가 통제로만 남지 않습니다.",
    coworker: "지금 끝내자는 사람과 한 번 더 고치자는 사람 모두 결과를 생각하고 있습니다. 다만 수정의 끝이 보이지 않으면 성실함도 서로에게 피로가 됩니다.",
    managerReport: "팀원은 해볼 수 있는 방법을 말했는데 상사는 아직 영향부터 확인하고 싶을 수 있습니다. 확인을 위한 질문과 실행을 막는 거절을 구분하면 불필요한 신경전이 줄어듭니다.",
    businessPartner: "기회를 놓칠까 두려운 쪽과 이미 감당할 것이 많다는 쪽의 판단이 맞부딪힙니다. 전망이 좋다는 말과 손실을 버틸 수 있다는 말은 따로 확인할 문제입니다.",
    friendship: "친구의 즉흥적인 변경이 한쪽에게는 재미고 다른 쪽에게는 준비한 마음을 무시한 일로 느껴질 수 있습니다. 못 가겠다는 답도 편하게 할 수 있어야 다음 만남이 가벼워집니다.",
  };
  const friction = tension ? paragraph("pair-natal-tension", tension.kind === "clash"
    ? `${tensionContexts[e.category]}에 ${A}과 ${B}의 속도 차이가 커지기 쉽습니다. ${clashScenes[e.category]}`
    : `${tensionContexts[e.category]}에 ${A}은 별뜻 없이 한 말인데 ${B}에게는 배려가 빠진 것으로 들릴 수 있고, 반대도 생길 수 있습니다. 크게 다투기보다 사소한 서운함을 남겨두는 쪽을 조심할 만합니다. 겉으로 조용하다고 두 사람의 마음까지 같은 것은 아닙니다.`,
    proof([], [], [], [`compatibilityRelationRules:detectCrossBranchRelations:${tension.identity}`]), "shadow", "natal-friction") : null;
  return { harmony, tension, harmonic, friction };
}

const elementImages = {
  WOOD: "새로운 것을 시작하고 배워보는 움직임", FIRE: "먼저 표현하고 분위기를 살리는 온기", EARTH: "흐트러진 일상을 붙잡는 꾸준함", METAL: "선을 긋고 필요한 것을 골라내는 판단", WATER: "잠시 멈춰 듣고 생각을 가라앉히는 여유",
};
export function compatibilityElementScene(e: PairEvidence, a: PairPerson, b: PairPerson) {
  // Use ONLY Phase3 verified weighted states. No absence claim from unknown hour.
  const options = [[a, b], [b, a]].flatMap(([giver, receiver]) => giver.materials.symbolicElements.flatMap(high => high.state === "high" && receiver.materials.symbolicElements.some(low => low.element === high.element && low.state === "low") ? [{ giver, receiver, high }] : []))
    .sort((x, y) => `${x.high.element}:${x.giver.personId}`.localeCompare(`${y.high.element}:${y.giver.personId}`));
  const selected = options[0];
  if (!selected) return null;
  const { giver, receiver, high } = selected;
  const low = receiver.materials.symbolicElements.find(v => v.element === high.element)!;
  const contexts: Record<PairCategory, string> = {
    love: "데이트가 늘 같은 흐름으로 끝날 때", marriage: "집안의 작은 일이 한쪽에 몰릴 때", parentChild: "함께 해볼 일을 찾을 때", coworker: "익숙한 방법으로 일이 풀리지 않을 때", managerReport: "팀의 일하는 방식을 돌아볼 때", businessPartner: "새 기회와 기존 약속 사이에서 고민할 때", friendship: "평소와 다른 주말을 보내고 싶을 때",
  };
  const symbolicScenes: Record<PairCategory, string> = {
    love: [a.style, b.style].includes("independent") ? "각자의 취미를 보여주며 새로운 방식을 가볍게 만나볼 수 있습니다. 닮으라는 요구 없이 옆에서 다른 즐거움을 발견하는 만남입니다." : high.element === "EARTH" ? "만날 약속을 기억하고 작은 준비를 챙기는 모습이 의외로 큰 안심이 될 수 있습니다. 늘 특별한 것을 해야 한다는 부담 없이 평범한 날을 같이 보내는 이미지입니다." : "서로에게 익숙한 방식을 번갈아 만나볼 만합니다. 한 사람의 취향만 따라가는 만남보다 둘의 좋은 습관이 나란히 놓이는 그림입니다.",
    marriage: "누가 옳은지 고르는 대신 다른 생활 습관을 잠깐 빌려 써볼 만합니다. 한집의 편안함은 성격을 하나로 맞추지 않고도 만들 수 있습니다.",
    parentChild: "부모에게 익숙하지 않은 시도도 함께 보는 여유가 생깁니다. 자녀를 특정 성격으로 키워야 한다는 뜻이 아니라, 서로 다른 방식을 안전하게 경험하는 그림입니다.",
    coworker: "일을 넘겨받는 순간에 서로의 강점을 짧게 빌려 쓸 수 있습니다. 같은 방식으로 일하지 않아도 결과를 함께 좋게 만들 여지가 있습니다.",
    managerReport: "직위 때문에 한 방식만 정답이 될 필요는 없습니다. 서로 다른 관점을 듣는 시간이 쌓이면 지시와 보고 사이에도 새로운 답이 들어옵니다.",
    businessPartner: "매출을 늘리는 생각 옆에 놓친 조건을 보는 눈도 필요합니다. 실제 매출과 비용을 함께 들여다보며 각자 놓칠 질문을 나눠 갖는 데 쓸 만한 차이입니다.",
    friendship: "친구의 취향을 따라가봤다가 의외로 좋아하는 것을 발견할 수 있습니다. 서로 닮기보다 즐길 수 있는 생활의 폭이 넓어지는 이미지입니다.",
  };
  return { giver: giver.personId, receiver: receiver.personId, element: high.element,
    block: paragraph("element-complement", `${contexts[e.category]}, ${giver.name}님의 ${particle(elementImages[high.element], "이", "가")} ${receiver.name}님에게 새로운 선택지가 됩니다. ${symbolicScenes[e.category]}`,
      proof([], [], [], [...high.sourceRefs.map(r => `${giver.personId}:${r}`), ...low.sourceRefs.map(r => `${receiver.personId}:${r}`)]), "positive", "element-balance") };
}

export function compatibilityGoodCards(e: PairEvidence, a: PairPerson, b: PairPerson) {
  const romantic = ["love", "marriage"].includes(e.category);
  const choices = romantic ? ["sinsal_dohwa", "sinsal_hongyeom", "gwiin_cheoneul", "gwiin_woldeok", "twelve_sinsal_banan", "gwiin_jaego"] :
    ["gwiin_cheoneul", "gwiin_woldeok", "gwiin_jaego", "gwiin_munchang", "twelve_sinsal_banan", "twelve_sinsal_jangseong"];
  const used = new Set<string>();
  return [a, b].flatMap((p, i) => {
    const m = choices.flatMap(f => p.materials.selected.filter(m => m.feature === f && !used.has(f)))[0];
    if (!m) return [];
    used.add(m.feature);
    const P = `${p.name}님`, Q = `${(i === 0 ? b : a).name}님`;
    const meaning: Record<string, string> = {
      sinsal_dohwa: `${P}에게는 도화의 첫인상 매력이 있습니다. 모임에서 눈에 들어오는 표정과 분위기가 ${Q}에게도 관심의 시작이 될 수 있습니다`,
      sinsal_hongyeom: e.category === "marriage" ? `${P}에게 있는 홍염은 가까이 지내며 발견하는 매력입니다. ${Q}에게만 보이는 표정이나 집에서의 작은 장난처럼, 익숙해진 뒤에도 새로 좋아질 구석이 있습니다` : `${P}의 홍염은 가까워질수록 살아나는 매력입니다. 겉으로 본 모습보다 ${Q}과 둘이 있을 때의 취향과 작은 표현이 오래 남습니다`,
      gwiin_cheoneul: e.category === "parentChild" && i === 0 ? `${P}에게는 천을귀인의 사람복이 있습니다. 자녀 ${Q}에 관한 고민도 혼자 감당하기보다 함께 의논할 어른을 찾는 데 이 좋은 패를 쓸 만합니다` : `${P}에게는 천을귀인의 사람복이 있습니다. ${Q}에게도 혼자 버티려 하지 않고 도움을 청할 수 있다면, ${P}의 좋은 패를 가까운 사이에서도 써볼 여지가 생깁니다`,
      gwiin_woldeok: `${P}에게 월덕의 좋은 관계 바탕이 있습니다. 거친 상황에서 ${Q}을 적으로만 보지 않고, 의견이 달라도 ${P}의 곁에 대화할 자리를 남기는 힘으로 쓸 수 있습니다`,
      gwiin_jaego: `${P}에게는 경험과 기술을 쌓아두는 재고의 좋은 패가 있습니다. ${Q}과 함께 해낸 것도 한 번의 일로 흘리지 않고 다음에 꺼내 쓸 자산으로 남길 만합니다`,
      gwiin_munchang: `${P}에게는 배운 것을 말과 글로 풀어내는 문창의 힘이 있습니다. ${Q}이 막힌 내용을 이해하기 쉽게 정리해줄 때 둘이 아는 것이 함께 늘어납니다`,
      twelve_sinsal_banan: `${P}에게는 맡은 자리에서 인정받는 반안의 힘이 있습니다. ${Q}에게도 말만 하는 사람이 아니라 제 몫을 해내는 사람으로 보일 좋은 바탕입니다`,
      twelve_sinsal_jangseong: `${P}의 장성은 앞에 서서 중심을 잡는 힘입니다. 어려운 순간에 ${Q}을 혼자 두지 않고 책임을 나누는 모습으로 쓸 수 있습니다`,
    };
    const ending: Record<PairCategory, string> = {
      love: ` ${P}의 좋은 면을 ${Q}이 발견해주는 과정도 연애의 즐거움입니다.`, marriage: ["sinsal_dohwa", "sinsal_hongyeom"].includes(m.feature) ? ` 배우자 ${Q}이 익숙하다는 이유로 지나치지 않을 때, 매일 함께하는 사이에도 설렘이 남습니다.` : ` 배우자 ${Q}이 그 수고를 당연하게 넘기지 않을 때 집에서도 이 힘이 편해집니다.`, parentChild: ` 가족인 ${Q}에게 늘 잘해야 한다는 부담이 아니라 나눠 쓸 수 있는 힘입니다.`, coworker: ` 동료 ${Q}과 공을 나눠 가질 때 이 장점은 다음 협업의 믿음이 됩니다.`, managerReport: ` 함께 일하는 ${Q}의 몫도 인정할 때 직위와 무관하게 좋은 영향을 나눌 수 있습니다.`, businessPartner: ` 파트너 ${Q}과 역할을 나눠 쓰면 한 사람이 전부 감당하지 않아도 됩니다.`, friendship: ` 친구 ${Q}에게도 그 장점을 편하게 꺼낼 수 있는 사이가 좋습니다.`,
    };
    return [paragraph(`good-card-${i}`, `${meaning[m.feature]}.${ending[e.category]}`, proof([m], [], [], [`person:${p.personId}`]), "positive", `good-card-${i}`)];
  });
}
