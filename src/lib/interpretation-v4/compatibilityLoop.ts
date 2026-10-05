import { paragraph, proof, particle } from "./copyRealizer";
import { pairProof } from "./compatibilityInteractions";
import type { PairEvidence } from "./compatibilityEvidence";
import type { PairPerson } from "./compatibilityNarrativeTypes";

/** Feedback loops are conditional interpretations of two evidence-bound
 * characters, not new relations inferred from their four-letter labels. */
export function compatibilityLoop(e: PairEvidence, a: PairPerson, b: PairPerson) {
  const people = [a, b];
  const quiet = people.find(p => ["inquiry", "independent", "social-rest"].includes(p.style));
  const reactive = people.find(p => ["care", "sensitive", "express"].includes(p.style));
  const steady = people.find(p => p.style === "steady");
  const changing = people.find(p => ["explore", "practical", "decisive"].includes(p.style));
  const setting = { love: "서운한 말을 주고받은 뒤", marriage: "생활비와 주말 일정을 정할 때", parentChild: "부모가 자녀의 선택을 확인할 때", coworker: "초안을 고치는 회의에서", managerReport: "상사가 진행 상황을 물을 때", businessPartner: "아직 합의하지 않은 제안을 밖에 약속하려 할 때", friendship: "여행 계획이 바뀌었을 때" }[e.category];
  let loop: string, repair: string, route: string;
  if (quiet && reactive && quiet !== reactive) {
    route = "quiet-response";
    loop = `${setting} ${reactive.name}님은 대답을 더 확인하고 ${quiet.name}님은 생각을 정리하려 더 조용해질 수 있어요. 조용해질수록 확인은 늘고, 확인이 늘수록 말할 여유는 줄어드는 식입니다. 한쪽에게 필요한 시간과 다른 쪽에게 필요한 반응이 서로의 불안을 키우는 순간이죠.`;
    repair = `${quiet.name}님은 답이 완성되기 전에도 ‘듣고 있고, 조금 정리한 뒤 이야기하겠다’는 신호부터 줄 수 있습니다. ${reactive.name}님은 그때 정한 대화 시간까지 같은 질문을 다시 던지지 않는 쪽이 좋아요. 기다림에 끝이 생기면 침묵을 거절로 읽는 일이 줄어듭니다.`;
  } else if (steady && changing && steady !== changing) {
    route = "change-confirmation";
    loop = `${setting} ${changing.name}님은 먼저 바꾸고 싶고 ${steady.name}님은 기존 약속부터 확인하고 싶습니다. 확인이 길어질수록 먼저 움직이고, 이미 움직였다는 말을 들을수록 더 많은 조건을 확인하게 되죠. 속도가 신뢰를 깎고, 신뢰를 지키려는 확인이 속도를 더 재촉하는 고리예요.`;
    repair = `${changing.name}님이 바로 시도해도 되는 작은 범위와 ${steady.name}님과 먼저 정할 큰 약속을 나누면 좋습니다. 모든 선택을 허락받을 필요도, 모든 변화를 뒤늦게 통보받을 필요도 없어져요. 바꾼 뒤 무엇을 함께 확인할지도 처음에 하나만 정해두는 식입니다.`;
  } else return null;
  const refs = pairProof(a.proof, b.proof, proof([], [], [], [`content-pair-loop:${route}`, `category:${e.category}`]));
  return { route, loop: paragraph("conflict-loop", loop, refs, "shadow", `pair-loop:${route}`), repair: paragraph("loop-repair", repair, refs, "direction", `pair-repair:${route}`) };
}

export function pairRhythm(e: PairEvidence, a: PairPerson, b: PairPerson) {
  const x = e.persons.personA.yinYang, y = e.persons.personB.yinYang;
  if (!x.complete || !y.complete || Math.abs(x.yin - x.yang) < 4 || Math.abs(y.yin - y.yang) < 4 || x.direction === y.direction) return null;
  const inward = x.direction === "inward" ? a : b, outward = inward === a ? b : a;
  const tension = ["inquiry", "independent", "social-rest"].includes(outward.style);
  const scene = tension
    ? `${outward.name}님은 평소 생각을 정리한 뒤 말하는 쪽이지만, 할 이유를 찾고 나면 행동을 먼저 시작할 수 있어요. ${inward.name}님은 반응을 잘 나누다가도 중요한 선택에서는 다시 자기 마음을 확인할 시간이 필요합니다. 말하는 속도와 움직이는 속도가 꼭 같지는 않은 두 사람이죠.`
    : `${particle(outward.name, "이", "가")} 시작한 대화에 ${particle(inward.name, "이", "가")} 생각을 보태면 출발과 마무리를 나눌 수 있죠. 말수가 많거나 적다는 판정은 아니고, 함께 움직인 뒤 힘을 거두는 순서의 차이에 가까워요.`;
  return paragraph("pair-rhythm", `${outward.name}님 쪽의 밖으로 움직이는 박자와 ${inward.name}님 쪽의 안에서 정리하는 박자가 다릅니다. 확인된 음양 분포는 이 차이를 보조해서 보여줘요. ${scene}`,
    pairProof(a.proof, b.proof, proof([], [], [], [...x.provenance.map(r => `personA:${r}`), ...y.provenance.map(r => `personB:${r}`), "content-pair-rhythm:opposite-complete-6-of-8"])), "positive", "pair-rhythm");
}
