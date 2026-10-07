import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { SemanticAxis } from "./semanticCore";

/** Typed realizations of existing meanings. Not a paraphrase/model engine. */
const claimSurfaces: Record<string, string> = {
  S01_LEADERSHIP: "사람들이 결정을 미루면 무엇부터 할지 먼저 정하고, 함께 움직일 방향을 말하는 쪽입니다.",
  M01_REALISTIC_MONEY_SENSE: "돈이 들어왔을 때 금액만 보고 끝내지 않고, 쓰고 난 뒤 실제로 얼마가 남는지 확인합니다.",
  M02_ACCUMULATION: "돈이나 기술을 한번 얻으면 그때 쓰고 끝내기보다 다음에도 꺼내 쓸 밑천으로 남겨두고 싶어 합니다.",
  M03_MONEY_OPPORTUNITY: "새로운 사람이나 일을 만나면 무엇을 해볼 수 있을지 봅니다. 그중 돈으로 이어질 만한 기회도 빨리 알아차리는 편이에요.",
  M06_BIG_MONEY_DESIRE: "생활비를 채웠다고 돈 생각이 끝나지는 않아요. 목표를 더 크게 정하고 어디까지 늘릴 수 있을지 보고 싶어 합니다.",
  SU02_GROWTH_DESIRE: "지금 하는 일을 잘 끝냈어도 거기서 멈추고 싶지는 않아요. 다음에는 무엇을 더 해볼지 생각하고, 지금보다 큰 일을 맡고 싶어 합니다.",
  P02_GOOD_RELATION_RECIPROCITY: "상대가 곤란해하는 것을 알아차리면 챙길 일을 찾고, 그 뒤에도 어떻게 됐는지 확인하며 관계를 이어가는 쪽입니다.",
  P03_NETWORK_OPPORTUNITY: "사람을 만났을 때 이야기만 듣고 끝내지 않고, 함께 해볼 일이 있는지도 봅니다. 그 연결에서 새로운 기회를 찾아 움직일 수 있어요.",
};
export function directHumanSurface(c: EditorialCandidate): string | undefined {
  // Preserve levels, masks, conditions and the strong/weak distinction in the selected Claim.
  return c.sourceType === "CLAIM" && (c.claimLevel ?? 0) >= 3 && !c.factBomb && !c.fortune ? claimSurfaces[c.sourceId] : undefined;
}
const complementSurfaces:Record<string,string>={
  C001:"틀린 점은 빨리 알아차리지만, 그걸 말할 때 사람까지 몰아붙이지 않으려는 쪽입니다.",
  C003:"실수 하나를 고칠 때도 거기서 끝내기보다 같은 문제가 왜 다시 생겼는지 확인하려는 쪽입니다.",
  C004:"궁금한 점이 생기면 설명만 듣고 끝내기보다, 앞뒤가 맞는지 직접 확인할 때까지 생각을 이어갈 수 있습니다.",
  C007:"지금 일어난 일만 보지 않고 전에 비슷한 일이 있었는지 생각하며, 다음에 막힐 곳까지 미리 확인하려는 쪽입니다.",
  C008:"앞으로 갈 방향을 정할 때 큰 그림만 그리지 않고, 빠진 조건이 없는지 확인하며 계획을 세울 수 있습니다.",
  C019:"계획대로 안 되어도 원하는 결과까지 바꾸지는 않고, 지금 가능한 방법을 다시 보며 움직일 수 있습니다.",
  C022:"해야 할 일이 보이면 빨리 시작하고, 시작한 뒤에는 쉽게 놓지 않고 끝내려는 쪽입니다.",
  C033:"인정받고 싶은 마음이 있어도 자리만 바라보지는 않고, 배워서 쌓은 실력을 보여주고 싶어 하는 쪽입니다.",
  C036:"맡은 일이 끝났다고 해도 빠진 것은 없는지 확인하고, 틀린 부분까지 고쳐야 마음이 놓일 수 있습니다.",
  C049:"함께 있던 사람의 기분이 달라지면 빨리 알아차리고, 무엇을 챙겨줄 수 있을지 생각하는 쪽입니다.",
  C070:"궁금한 것을 알아낸 뒤에는 머릿속에만 두기보다, 직접 만들어 다른 사람에게 보여주고 싶어 할 수 있습니다.",
  C073:"좋아하는 사람이 생기면 큰말 한 번보다, 약속을 지키고 필요한 것을 오래 챙기는 쪽일 수 있습니다.",
  C074:"좋아하는 마음을 혼자 생각하고 끝내기보다, 상대에게 말하고 필요한 것을 챙기며 보여주려는 쪽입니다.",
  C077:"가까운 사람을 챙기고 싶어도 모든 시간을 함께 쓰려 하지는 않고, 중요한 선택은 직접 정할 몫으로 남겨둘 수 있습니다.",
  C080:"사람을 만날 때 작은 반응까지 알아차리는 만큼, 돌아온 뒤에는 혼자 생각을 정리할 시간이 더 필요할 수 있습니다.",
  C082:"좋아한다고 크게 말하는 순간만큼, 다음에도 연락하고 약속을 지키며 마음을 보여주는 일을 중요하게 볼 수 있습니다.",
  C085:"쉬는 시간에는 새로운 자극을 더 찾기보다 익숙한 생활을 유지하며, 혼자 생각을 정리할 때 편할 수 있습니다.",
  C095:"누군가 어려워하면 챙기고 싶다는 말에서 끝내지 않고, 맡겠다고 정한 일은 끝까지 지키려는 쪽입니다.",
};
export function fusionHumanSurface(c:EditorialCandidate):string|undefined {
  if(c.fusionType!=="COMPLEMENT")return undefined;
  return complementSurfaces[c.sourceId.split(":")[2]];
}
export const WORK_APPLICATION: Partial<Record<SemanticAxis, string>> = {
  PRECISION: "검토할 일이 생기면 다 끝났다는 말보다 빠진 조건이 없는지 먼저 봅니다. 작은 틀림이 뒤의 결과를 바꾸는 일에서 이 눈을 쓸 수 있어요.",
  DEPTH: "설명을 맡으면 답만 옮기기보다 왜 그런지 확인하고 싶어 해요. 이해되지 않은 부분을 남겨두지 않는 방식이 일의 깊이로 이어집니다.",
  CURIOSITY: "처음 보는 일을 맡았을 때 예전 답을 그대로 쓰기보다 다른 사례도 찾아봅니다. 모르는 것을 묻고 알아보는 과정까지 일의 일부로 보는 쪽이에요.",
  ADAPTABILITY: "하던 방식이 막히면 일의 목표까지 버리지는 않아요. 바꿀 수 있는 순서나 방법을 다시 보고, 지금 가능한 쪽부터 움직입니다.",
  LEADERSHIP: "의견만 오가고 결정이 늦어질 때는 먼저 해야 할 일을 정해 말합니다. 여러 사람이 기다리는 상황에서 방향을 잡는 역할이 잘 맞아요.",
  CREATION: "설명만 길어질 때는 직접 만든 것을 놓고 이야기하고 싶어 해요. 눈에 보이는 결과를 만들면 무엇을 고칠지도 함께 확인할 수 있습니다.",
  EXPRESSION: "혼자 떠올린 생각도 누군가에게 전할 때 더 또렷해져요. 말이나 작업으로 보여주는 과정에서 무엇을 전달할지 정리하는 쪽입니다.",
  PERSISTENCE: "처음의 재미가 줄어도 맡은 일을 곧바로 놓지는 않습니다. 어디까지 끝냈는지 확인하며 이어가는 방식으로 결과를 남기는 쪽이에요.",
  DUTY: "맡은 일이 생기면 끝냈다는 말로만 넘기지 않아요. 남은 것이 없는지 확인하고 약속한 만큼 지키려 합니다.",
  STABILITY: "새로운 제안을 볼 때도 오래 유지할 수 있는지 확인하고 싶어 해요. 한 번만 되는 방식보다 반복해 지킬 수 있는 조건을 중요하게 봅니다.",
};
export const RELATION_APPLICATION: Partial<Record<SemanticAxis, string>> = {
  LEADERSHIP: "함께 정해야 할 일이 생기면 상대의 답을 기다리기만 하지는 않아요. 무엇부터 고를지 말하고 같이 움직이고 싶어 합니다.",
  CARE: "가까워질수록 상대가 무심코 말한 불편도 기억해요. 다시 만났을 때 그 일이 어떻게 됐는지 확인하고 챙기는 식입니다.",
  PRECISION: "친한 사이에서도 앞뒤가 다른 말은 그냥 넘기기 어려워요. 무슨 뜻이었는지 다시 묻고 확인해야 마음이 놓이는 쪽입니다.",
  BOUNDARY: "친하다는 이유로 모든 부탁이 괜찮아지지는 않아요. 상대 마음을 살피더라도 내가 지킬 선은 분명하게 말하고 싶어 합니다.",
};
export const AXIS_HUMAN_REASON: Partial<Record<SemanticAxis, string>> = {
  DEPTH: "그럴듯한 답을 듣는 것보다 이해되지 않은 부분을 남겨두지 않는 쪽입니다.",
  CURIOSITY: "모르는 것이 생기면 누가 시키지 않아도 이유를 찾아보는 쪽입니다.",
  PRECISION: "큰 흐름이 맞아도 작은 차이나 빠진 조건을 그냥 넘기지 않는 쪽입니다.",
  PERSISTENCE: "처음의 의욕보다 한번 붙든 일을 오래 이어가는 쪽에 가깝습니다.",
  ADAPTABILITY: "처음 정한 방법보다 지금 통하는 방법을 찾는 쪽에 가깝습니다.",
  CARE: "상대의 어려움을 듣는 데서 끝내지 않고 실제로 덜어줄 것을 찾는 쪽입니다.",
  LEADERSHIP: "결정이 필요한 순간에 뒤로 빠지기보다 직접 방향을 잡으려는 쪽입니다.",
  DUTY: "맡기로 한 약속을 다 했는지 끝까지 살피려는 쪽입니다.",
  STABILITY: "눈앞의 변화보다 오래 유지할 수 있는 생활을 바라는 쪽입니다.",
  BOUNDARY: "관계가 가까워져도 괜찮은 일과 어려운 일의 선은 남겨두는 쪽입니다.",
  CREATION: "생각을 실제로 만든 것에 담아 밖으로 꺼내는 쪽입니다.",
  EXPRESSION: "생각이나 감정을 혼자 두기보다 말이나 작업으로 전하려는 쪽입니다.",
  RESOURCE_SENSE: "들어오는 양만큼 쓰고 남는 몫도 살피는 쪽입니다.",
  PRACTICALITY: "좋아 보이는 이야기라도 실제 생활에서 가능한지 살피는 쪽입니다.",
  SOCIAL_ATTUNEMENT: "말의 내용뿐 아니라 표정과 분위기가 달라지는 순간도 읽는 쪽입니다.",
  RECOVERY_NEED: "밖에서 쓴 생각과 반응을 혼자 정리할 시간이 필요한 쪽입니다.",
  CHANGE_ORIENTATION: "익숙한 것이 있어도 새로 해볼 경험을 찾는 쪽입니다.",
  DECISION_STYLE: "여러 답을 계속 열어두기보다 한 가지를 골라 결론짓는 쪽입니다.",
  GOAL_DRIVE: "목표가 정해지면 끝낸 결과를 보고 다음 행동을 정하려는 쪽입니다.",
  OPPORTUNITY_SENSE: "익숙한 답 밖에서도 해볼 만한 일을 찾으려는 쪽입니다.",
};
const coreRecalls: Record<string, string> = {
  OUTER_INNER: "늘 목소리를 높이지 않아도 결정할 때가 되면 내 판단을 꺼내 함께 움직일 방향을 정할 수 있습니다.",
  TWO_NEEDS: "새로운 것을 해보고 싶을 때도 돌아올 생활을 같이 보는 만큼, 바꿀 것과 지킬 것을 나란히 정할 수 있습니다.",
  A_TO_B: "생각할 때는 여러 가능성을 열어두지만, 움직일 때가 되면 기준을 정하고 하나씩 확인하는 모습도 나에게 있습니다.",
  A_AND_B: "멀리 갈 방향을 생각하면서 눈앞에서 고칠 작은 틀림도 함께 보는 눈을 가지고 있습니다.",
};
export function coreRecallSurface(c: EditorialCandidate): string | undefined {
  if (c.sourceType !== "CORE_GYEOL") return undefined;
  const key = c.sourceId.split(":")[1];
  if (key === "A_BUT_B") {
    if (c.primaryAxes.includes("BOUNDARY") && c.primaryAxes.includes("SOCIAL_ATTUNEMENT")) return "상대 마음을 살피면서도 납득되지 않는 것은 다시 확인하고 내 기준을 지키는 모습이 나에게 있습니다.";
    if (c.primaryAxes.includes("CARE") && c.primaryAxes.includes("BOUNDARY")) return "누군가를 챙기고 싶어도 모든 부탁을 다 맡지는 않고, 내가 지킬 선을 정해 마음을 전하는 모습도 나에게 있습니다.";
    if (c.primaryAxes.includes("ADAPTABILITY") && c.primaryAxes.includes("AUTONOMY")) return "내가 정한 방향을 지키고 싶을 때, 막힌 방법을 바꾸고 다른 길을 찾는 모습도 나의 일부입니다.";
    return undefined;
  }
  if (key === "STRENGTH_SHADOW") {
    if (c.primaryAxes.includes("CARE")) return "누군가 어려워하면 챙기고 싶은 마음이 먼저 움직이는 만큼, 도울 때 내 일까지 놓고 있지는 않은지 같이 보는 게 중요합니다.";
    if (c.primaryAxes.includes("GOAL_DRIVE")) return "한 일을 끝내고도 다음을 해보고 싶은 마음이 큰 만큼, 앞으로 갈 방향과 지금 남긴 결과를 같이 볼 만합니다.";
    return undefined;
  }
  const required:Record<string,SemanticAxis[]>={OUTER_INNER:["ENERGY_DIRECTION","LEADERSHIP"],TWO_NEEDS:["CHANGE_ORIENTATION","STABILITY"],A_TO_B:["ADAPTABILITY","STRUCTURE_STYLE"],A_AND_B:["PRECISION","STRATEGY"]};
  return required[key]?.every(a=>c.primaryAxes.includes(a))?coreRecalls[key]:undefined;
}
