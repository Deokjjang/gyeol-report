import type { RelationshipStatus } from "../report-generation/reportInputTypes";
import { particle, proof } from "./copyRealizer";

/** No inferred partner, children, breakup, or new status. Action is evidence-bound. */
export function loveContext(status: RelationshipStatus, action: string, voice = "natal") {
  const topic = particle(action, "은", "는"), subject = particle(action, "이", "가"), object = particle(action, "을", "를");
  const contexts = {
    "": { title: "사랑에서 유난히 내 모습이 드러나는 때", scene: `관계의 이름을 먼저 정하지 않아도 ${topic} 가까운 사람과의 작은 선택에서 드러납니다. 설렘을 서두르기보다 누구 앞에서 억지로 애쓰지 않아도 되는지 떠올리면 내 사랑의 방식이 더 선명해집니다.`, home: "함께 사는 삶을 선택한다면", ending: "관계의 이름보다 사람을 바라보면," },
    single: { title: "아직 내 사람이 없다면, 눈여겨볼 장면", scene: `지금 솔로라면 ${object} 아무에게나 다 쓸 필요는 없습니다. ${voice === "inquiry" ? "관심이 없는 만남을 횟수로 늘리면 오히려 피곤합니다. 취향이나 질문을 편하게 나눌 자리에서 누구와 이야기가 더 이어지는지 보면 내 마음의 문이 잘 보입니다." : "처음 만난 사람의 말보다 같이 작은 선택을 해볼 때의 반응이 더 많은 것을 알려줍니다. 급하게 관계를 시작하지 않아도, 내 좋은 면을 편하게 꺼낼 수 있는 만남은 충분히 기대할 만합니다."}`, home: "훗날 함께 살게 된다면", ending: "아직 누군가를 정하지 않은 지금도," },
    some: { title: "썸의 속도는 말보다 다음 만남에 보입니다", scene: `썸에서는 ${subject} 설렘을 키우는 통로가 됩니다. 다정했던 하루만으로 마음을 전부 정하기보다, 제안했던 다음 만남이 실제 약속이 되는지 보면 좋습니다. 나도 반가움을 표시하되 상대의 답까지 대신 만들어둘 필요는 없습니다.`, home: "아직 알아가는 상대와 먼 생활까지 떠올린다면", ending: "아직 서로를 알아가는 중이어도," },
    dating: { title: "익숙해진 연애에서 더 잘 보이는 내 마음", scene: `지금의 연애에서는 ${object} 상대가 어떤 방식으로 받고 있는지가 중요해집니다. ${voice === "caring" ? "연인이 내 배려를 잘 안다고 생각해 바라는 것을 생략하기 쉽습니다. 챙기는 역할만 남지 않고 나도 마음을 받는 경험이 쌓여야 둘의 관계가 든든합니다." : "처음 잘 보이려고 했던 일보다 바쁜 주에 남기는 배려가 내 모습을 더 잘 보여줍니다. 친해졌다는 이유로 줄여버린 애정 표현이 있는지 돌아볼 만합니다."}`, home: "지금의 연애가 함께 사는 생활로 이어진다면", ending: "지금의 연애를 돌아보면," },
    marriage_preparing: { title: "예식 준비보다, 둘의 생활을 정하는 순간", scene: `결혼을 준비할 때 ${topic} 둘의 바탕을 만드는 데 쓰입니다. 견적과 날짜를 고르는 일만큼 부모님의 기대, 쓸 돈의 범위, 준비를 맡는 비율에서도 마음이 드러납니다. 준비를 잘 끝내는 두 사람보다 의견이 달라도 같이 정할 수 있는 두 사람이 되는 시간이기도 합니다.`, home: "결혼 뒤의 생활을 준비하며 보면", ending: "둘의 생활을 준비하는 지금도," },
    married: { title: "부부가 된 뒤에도, 마음까지 알아서 전해지지는 않습니다", scene: `기혼인 지금 ${topic} 특별한 날보다 반복되는 하루에서 빛납니다. 서로 바빴던 저녁에 무엇을 먼저 묻는지, 주말의 피로를 누가 더 알아주는지에 부부만의 온도가 담깁니다. 이미 함께 산다는 사실과 오늘도 내 편이라고 느끼는 일은 따로 챙길 가치가 있습니다.`, home: "함께 살고 있는 지금은", ending: "함께 살아온 시간을 돌아보면," },
  } as const;
  const c = contexts[status];
  return { ...c, proof: proof([], [], [], [`input:relationshipStatus:${status || "unselected"}`]) };
}
