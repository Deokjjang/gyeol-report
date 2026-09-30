import { proof } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";

/** Strong natal-only realization: no guessed MBTI, no wealth promotion. */
export function careerNatalMoney(state: NarrativeState) {
  const rows: readonly (readonly [string, string])[] = [
    ["ten_god_zheng_cai", "작게 들어오는 것도 실제로 남는지 보는 힘을 돈에 쓸 수 있습니다. 한 번 크게 벌 기회보다 반복할 수 있는 수입과 지출의 차이를 아는 쪽에서 마음이 놓입니다. 일의 값을 정할 때도 내가 계속 지킬 수 있는 분량인지 함께 보는 것이 꾸준함을 지키는 길입니다."],
    ["ten_god_pian_cai", "여러 사람의 필요를 듣다가 내가 연결할 일을 찾는 감각이 있습니다. 직접 만드는 시간 외에도 거래가 성립하게 도운 판단이 값이 될 수 있습니다. 다만 새 제안이 많다고 전부 같은 수입으로 이어지는 것은 아니어서, 생활을 지킬 몫과 시험해볼 몫을 나누어 생각할 만합니다."],
    ["ten_god_shi_shen", "솜씨를 남이 쓰고 싶어 하는 결과로 만드는 쪽에서 일의 값이 생깁니다. 한 번 잘 만든 것을 다음에도 같은 품질로 내놓을 수 있으면 신뢰가 붙습니다. 좋아서 더 해준 수고까지 계속 공짜가 되지 않도록 어디까지가 한 번의 일인지 알아두는 것도 돈을 지키는 방식입니다."],
    ["sinsal_hyeonchim", "남들이 그냥 넘긴 차이를 찾아 고치는 눈도 돈이 되는 기술입니다. 상대가 다시 고칠 시간과 실수를 줄여준 만큼 내 일의 값도 생깁니다. 빨리 해냈다는 이유로 쉬운 일이었다고 깎아볼 필요는 없습니다. 반복해서 믿고 맡길 수 있는 확인과 손질을 내 기술로 남기는 쪽을 생각해볼 만합니다."],
    ["ten_god_pian_yin", "모두가 아는 답보다 특정한 질문에 깊이 답할 수 있는 지식이 일의 값이 됩니다. 알아보는 시간이 길어도 다음에 비슷한 일을 맡을 때 다시 쓰인다면 흩어진 수고만은 아닙니다. 다만 혼자 더 알고 싶은 범위와 상대가 부탁한 범위를 나누어야 공부한 시간도 내 생활을 지켜줍니다."],
  ];
  for (const [feature, text] of rows) {
    const material = state.packet.selected.find(m => m.feature === feature);
    if (material) return { text, proof: proof([material], [], [], [`v4:career-natal-money:${feature}`]) };
  }
  const material = state.pillar, seed = material.material.seeds.find(s => s.role === "work")!;
  return { text: "새 수입을 생각한다면 해낼 수 있는 일의 크기와 그 일에 쓸 시간을 함께 볼 만합니다. 한 번의 큰 약속보다 끝낸 결과를 확인하고 다음 일을 정하는 경험이 내 일값의 기준을 만들어줍니다.", proof: proof([material], [seed], [], ["v4:career-natal-money:exploration"]) };
}
