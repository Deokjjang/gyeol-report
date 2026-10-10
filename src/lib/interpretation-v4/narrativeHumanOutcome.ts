import type { SemanticAxis, SemanticSignature } from "./semanticCore";

/** Reviewed behavior realizations, not new scores or inferred traits. Bipolar rows are [negative, positive]. */
export const HUMAN_OUTCOMES = {
  ACTION_TEMPO: ["답을 내리기 전에 놓친 조건이 없는지 한번 더 확인합니다", "방향이 보이면 오래 기다리기보다 먼저 움직입니다"],
  ENERGY_DIRECTION: ["사람들과 지낸 뒤에는 혼자 생각을 정리하고 싶어 합니다", "생각이 생기면 혼자 두기보다 사람들과 나누고 싶어 합니다"],
  STRUCTURE_STYLE: ["계획대로 안 되면 처음 정한 순서를 다시 보고, 지금 가능한 방법으로 바꾸며 움직입니다", "할 일이 생기면 순서와 기준부터 정하고, 빠진 일이 없는지 확인하며 움직입니다"],
  COMMUNICATION_STYLE: ["의견이 달라도 바로 말하기 전에 상대가 어떻게 들을지 생각하고, 받아들일 말을 골라서 전합니다", "틀린 점이 보이면 돌려 말하기보다 무엇이 다른지 바로 말하고 고칠 부분을 짚습니다"],
  CHANGE_ORIENTATION: ["새 방법이 보여도 익숙한 생활을 지킬 수 있는지 먼저 봅니다", "익숙해진 일에서도 바꿔볼 곳을 찾고 새 방법을 시도하고 싶어 합니다"],
  DECISION_STYLE: ["답이 하나 떠올라도 다른 선택지가 없는지 더 살펴봅니다", "선택해야 할 때는 답을 정하고 다음으로 넘어가고 싶어 합니다"],
  RELATION_STYLE: ["가까운 사이라도 혼자 결정하고 지킬 영역이 필요합니다", "좋은 일이 생기면 혼자 끝내기보다 누군가와 함께 나누고 싶어 합니다"],
  RISK_STYLE: ["기회가 보여도 잃을 수 있는 것부터 확인하고 움직입니다", "해볼 만한 기회가 보이면 불확실한 점이 있어도 움직이고 싶어 합니다"],
  INITIATIVE: ["시작할 일이 보이면 누가 먼저 해주길 기다리기보다 직접 움직입니다"],
  GOAL_DRIVE: ["목표가 생기면 얼마나 가까워졌는지 확인하며 끝까지 붙듭니다"],
  EXPANSION: ["하나를 해낸 뒤에는 여기서 더 키울 수 있는 것이 무엇인지 봅니다"],
  PERSISTENCE: ["처음보다 재미가 줄어도 시작한 일을 쉽게 놓지 않고, 어디까지 왔는지 확인하며 끝내고 싶어 합니다"],
  ADAPTABILITY: ["방법이 막히면 지금까지 한 것을 다시 보고, 바꿀 수 있는 부분부터 확인하며 움직입니다"],
  DEPTH: ["답을 들었어도 이해되지 않는 부분이 있으면 그냥 넘기지 않고, 왜 그런지 생각하며 다시 확인합니다"],
  CURIOSITY: ["궁금한 점이 생기면 답만 듣고 끝내기보다 직접 찾아보고, 알고 있던 것과 무엇이 다른지도 확인합니다"],
  PATTERN_SENSE: ["서로 다른 이야기를 듣다가도 전에 본 것과 닮은 점을 알아차리고, 같은 일이 반복되는 이유를 생각합니다"],
  PRECISION: ["다들 끝났다고 말할 때도 빠진 조건이 없는지 다시 보고, 작은 틀림을 알아차리면 확인합니다"],
  LEARNING: ["하나를 배우면 외운 답보다 스스로 이해했는지 다시 확인합니다"],
  STRATEGY: ["지금 해야 할 일을 정할 때 다음에 막힐 곳까지 같이 생각합니다"],
  CREATION: ["좋은 생각이 떠오르면 머릿속에서만 고치기보다 직접 만들어보고, 눈에 보이는 결과로 확인하고 싶어 합니다"],
  EXPRESSION: ["생각이나 마음이 생기면 말이나 작업으로 밖에 보여주고 싶어 합니다"],
  SOCIAL_ATTUNEMENT: ["함께 있던 사람의 말투나 표정이 달라지면 무슨 일이 있는지 빨리 알아차립니다"],
  CARE: ["누군가 곤란해 보이면 필요한 것을 알아차리고, 무엇을 챙겨줄 수 있을지 생각하며 먼저 움직입니다"],
  CHARISMA: ["사람 앞에 서서 말하거나 보여줄 때 자기 존재가 눈에 들어오는 쪽입니다"],
  DUTY: ["맡은 일이 남아 있으면 끝난 것과 남은 것을 확인하며 책임지려 합니다"],
  LEADERSHIP: ["사람들이 망설일 때 무엇부터 정할지 생각하고, 먼저 해야 할 일을 말하며 함께 움직이게 합니다"],
  AUTONOMY: ["중요한 선택일수록 남의 답을 따르기보다 직접 판단하고 싶어 합니다"],
  COMPETITION: ["가까이에서 잘하는 사람을 보면 나도 더 해보고 싶어 움직입니다"],
  BOUNDARY: ["부탁을 받으면 들어줄 수 있는지 먼저 확인하고, 어렵다고 생각한 부분은 자기 기준을 지키며 말합니다"],
  PRACTICALITY: ["좋은 이야기라도 실제로 할 수 있는지, 끝내고 무엇이 남는지 봅니다"],
  RESOURCE_SENSE: ["돈이나 시간을 쓸 때 들어가는 양과 실제로 남는 것을 같이 봅니다"],
  OPPORTUNITY_SENSE: ["새로운 사람이나 상황을 만나면 무엇을 해볼 수 있을지 생각하고, 기회가 보이는 쪽부터 확인하며 움직입니다"],
  STABILITY: ["새 일을 정할 때도 오래 지킬 수 있는 생활과 약속이 중요합니다"],
  STATUS_DRIVE: ["일을 잘 끝낸 뒤에는 그만큼 제대로 인정받았는지도 중요합니다"],
  MEANING: ["결과가 좋아 보여도 내가 왜 이 일을 하는지는 따로 생각합니다"],
  RECOVERY_NEED: ["바깥일을 마친 뒤에는 조용히 쉬며 생각을 정리할 시간이 필요합니다"],
} as const satisfies Record<SemanticAxis, readonly string[]>;

export function humanOutcome(axis: SemanticAxis, value: number): string | undefined {
  if (!value) return undefined;
  const row: readonly string[] = HUMAN_OUTCOMES[axis];
  if (row.length === 1 && value < 0) return undefined; // Absence never becomes an opposite trait.
  return row[row.length === 2 && value > 0 ? 1 : 0] + ".";
}
export function strongestHumanAxis(axes: readonly SemanticAxis[], proof: SemanticSignature) {
  return [...axes].filter(a => humanOutcome(a, proof[a] ?? 0)).sort((a, b) => Math.abs(proof[b] ?? 0) - Math.abs(proof[a] ?? 0))[0];
}

/** Consequences of an actually shared positive axis, not a second trait or a fortune claim. */
export const REINFORCE_OUTCOMES: Partial<Record<SemanticAxis, string>> = {
  DEPTH: "설명이 그럴듯해도 이해되지 않는 점이 남으면 다시 생각하고 확인하니, 답만 아는 것보다 왜 그런지 아는 일이 중요합니다.",
  CURIOSITY: "하나를 알게 되면 다음 궁금증이 생겨 직접 찾아보게 되니, 누가 시키지 않아도 배울 것을 계속 발견하는 쪽입니다.",
  PERSISTENCE: "처음의 의욕이 줄어도 끝내고 싶다는 마음은 남아 있으니, 어디까지 했는지 확인하면서 하던 일을 계속 이어갑니다.",
  ADAPTABILITY: "처음 방법이 안 된다고 시작한 일까지 포기하지는 않으니, 지금 할 수 있는 것을 확인하고 방법을 바꾸며 다시 움직입니다.",
  CARE: "상대가 무엇을 필요로 하는지 알아차리면 실제로 챙겨주고 싶어 하니, 걱정하는 말에서 끝내지 않고 도울 것을 찾습니다.",
  PRECISION: "작은 차이를 알아차리면 고칠 곳을 확인하고 싶어 하니, 다들 괜찮다고 말한 뒤에도 한 번 더 보는 눈이 남습니다.",
  BOUNDARY: "가까운 사람의 부탁이어도 무조건 받아들이기보다 가능한지 확인하고 말하니, 관계를 지키면서 자기 선도 지키고 싶어 합니다.",
  CREATION: "좋은 생각이 나면 직접 만들어 확인하고 싶어 하니, 말로 설명할 때보다 눈에 보이는 결과를 놓고 이야기할 때 더 신이 납니다.",
  OPPORTUNITY_SENSE: "새로운 상황을 보면 지금 해볼 일을 생각하고 직접 확인하고 싶어 하니, 익숙한 답만 찾기보다 열린 길을 먼저 봅니다.",
  STABILITY: "새 일을 시작할 때도 오래 지킬 수 있는지 확인하고 싶어 하니, 눈앞의 변화보다 생활을 유지할 수 있는지가 중요합니다.",
};

/** A second behavior of the same signed axis, for the actual MBTI side. No type inference. */
export const MBTI_HUMAN_BEHAVIORS = {
  ACTION_TEMPO: ["결정을 재촉받아도 한번 더 확인한 뒤 움직이고 싶어 합니다", "해야 할 일이 보이면 생각만 이어가기보다 직접 시작하고 싶어 합니다"],
  ENERGY_DIRECTION: ["사람을 만난 뒤에는 조용히 혼자 정리할 시간을 중요하게 봅니다", "새로운 생각이 떠오르면 대화를 나누며 더 알아보고 싶어 합니다"],
  STRUCTURE_STYLE: ["예상과 달라져도 처음 순서에 매달리기보다 그때 맞는 방법을 찾습니다", "해야 할 것이 여럿이면 순서를 정하고 하나씩 확인하며 움직입니다"],
  COMMUNICATION_STYLE: ["같은 말이라도 상대가 어떻게 들을지 생각한 뒤 전합니다", "의견이 다르면 애매하게 넘기기보다 무엇이 다른지 말하고 싶어 합니다"],
  CHANGE_ORIENTATION: ["새로운 일을 정하기 전에는 익숙한 생활을 지킬 방법부터 생각합니다", "익숙한 방법이 있어도 더 나은 길이 보이면 바꿔보고 싶어 합니다"],
  DECISION_STYLE: ["한 가지 답을 정하기 전에 놓친 가능성이 없는지 확인하고 싶어 합니다", "고를 때마다 처음으로 돌아가기보다 답을 정하고 움직이고 싶어 합니다"],
  RELATION_STYLE: ["친한 사람과도 선택을 모두 같이 하기보다 각자 정할 몫을 중요하게 봅니다", "가까운 사람이 생기면 좋은 경험도 함께하고 싶어 합니다"],
  RISK_STYLE: ["좋은 기회라는 말을 들어도 감당할 수 있는지 먼저 확인합니다", "아직 확실하지 않아도 직접 해보며 기회를 확인하고 싶어 합니다"],
  INITIATIVE: ["해야겠다고 생각한 일이 있으면 다른 사람을 기다리기보다 먼저 시작합니다"],
  GOAL_DRIVE: ["목표를 정한 뒤에는 지금 하는 일이 결과에 가까워지는지 확인합니다"],
  EXPANSION: ["잘된 일이 있으면 거기서 끝내기보다 다음에 더 해볼 것을 생각합니다"],
  PERSISTENCE: ["진도가 더뎌도 의미 있다고 정한 일은 끝내고 싶어 합니다"],
  ADAPTABILITY: ["계획대로 안 되면 포기부터 하기보다 방법을 바꿔서 해보고 싶어 합니다"],
  DEPTH: ["설명을 듣고도 이해되지 않는 부분이 있으면 이유를 확인하고 싶어 합니다"],
  CURIOSITY: ["새로운 것을 알게 되면 답만 외우기보다 왜 그런지 찾아보고 싶어 합니다"],
  PATTERN_SENSE: ["서로 다른 일을 보다가도 비슷하게 반복되는 이유가 있는지 생각합니다"],
  PRECISION: ["다 끝난 것처럼 보여도 맞지 않는 부분이 없는지 다시 확인합니다"],
  LEARNING: ["배운 것을 그대로 따르기보다 이해한 대로 다시 해보며 확인합니다"],
  STRATEGY: ["움직이기 전에는 지금 고른 방법이 다음에 무엇을 바꿀지 생각합니다"],
  CREATION: ["아이디어를 떠올린 뒤에는 실제로 만들어 확인하고 싶어 합니다"],
  EXPRESSION: ["좋은 생각을 했을 때 혼자 간직하기보다 말이나 결과물로 전하고 싶어 합니다"],
  SOCIAL_ATTUNEMENT: ["대화가 달라지면 말의 내용뿐 아니라 상대 반응도 같이 봅니다"],
  CARE: ["가까운 사람이 어려워하면 무엇을 해줄 수 있을지 생각합니다"],
  CHARISMA: ["사람들이 보는 자리에서는 자기 생각과 모습을 드러내고 싶어 합니다"],
  DUTY: ["맡기로 한 것이 있으면 끝났다고 넘기기 전에 빠진 일을 확인합니다"],
  LEADERSHIP: ["여럿이 결정을 미루면 먼저 방향을 정해 함께 움직이고 싶어 합니다"],
  AUTONOMY: ["중요한 일일수록 정해진 답을 받기보다 직접 결정하고 싶어 합니다"],
  COMPETITION: ["다른 사람이 잘하는 모습을 보면 나도 더 해보고 싶어 합니다"],
  BOUNDARY: ["요청을 받으면 들어줄 수 있는지부터 확인하고 내 기준도 지키고 싶어 합니다"],
  PRACTICALITY: ["그럴듯한 생각을 들었을 때 실제로 쓸 수 있는지부터 봅니다"],
  RESOURCE_SENSE: ["시간이나 돈을 쓸 일이 생기면 무엇이 들어가고 남는지 확인합니다"],
  OPPORTUNITY_SENSE: ["새로운 상황을 만났을 때 지금 잡을 수 있는 기회가 무엇인지 봅니다"],
  STABILITY: ["선택을 해야 할 때 오래 지킬 수 있는 생활인지 중요하게 봅니다"],
  STATUS_DRIVE: ["성과를 냈을 때 해낸 만큼 인정받는지도 중요하게 봅니다"],
  MEANING: ["눈앞의 결과가 좋아도 계속하고 싶은 이유가 있는지 생각합니다"],
  RECOVERY_NEED: ["일과 만남을 마친 뒤에는 혼자 생각을 내려놓을 시간을 중요하게 봅니다"],
} as const satisfies Record<SemanticAxis, readonly string[]>;
export function mbtiHumanBehavior(axis: SemanticAxis, value: number) {
  const row: readonly string[] = MBTI_HUMAN_BEHAVIORS[axis];
  if (!value || row.length === 1 && value < 0) return undefined;
  return row[row.length === 2 && value > 0 ? 1 : 0] + ".";
}

/** Context is a use of the already-supported behavior, not a personality diagnosis. */
export const HUMAN_VALUE: Partial<Record<SemanticAxis, string>> = {
  STRUCTURE_STYLE: "여러 일을 함께 맡아도 기준과 순서를 잡아두면, 빠뜨린 일을 뒤늦게 수습하는 수고를 줄일 수 있어요.",
  DEPTH: "답이 쉽게 나오지 않는 문제를 만났을 때, 한 번 더 파고드는 과정이 남이 놓친 이유를 찾게 해줍니다.",
  PRECISION: "작은 틀림이 결과를 바꾸는 일에서는, 남들이 넘어간 부분을 다시 보는 눈을 실제로 쓸 수 있어요.",
  ADAPTABILITY: "처음 세운 방법이 통하지 않을 때도 끝이라고 보지 않아요. 지금 할 수 있는 다른 길을 찾는 쪽입니다.",
  LEADERSHIP: "여러 사람이 기다리고만 있을 때는, 먼저 해야 할 일을 정해주는 사람이 필요하죠. 그 순간 앞에 설 수 있습니다.",
  CARE: "누군가 필요한 것을 말하기 어려워할 때도, 먼저 살피고 챙기는 행동으로 마음을 전할 수 있어요.",
  SOCIAL_ATTUNEMENT: "대화가 어긋나기 시작할 때 작은 반응을 먼저 알아차리니, 상대에게 다시 설명할 지점을 찾을 수 있어요.",
  LEARNING: "새로운 내용을 만났을 때 외운 답만 찾지 않아요. 이해한 것을 다시 써보며 자기 실력으로 남기는 쪽입니다.",
  GOAL_DRIVE: "끝내야 할 일이 분명해지면 어디까지 왔는지 확인하며 움직이죠. 막연한 의욕을 실제 결과로 옮길 수 있어요.",
  EXPRESSION: "혼자 생각할 때보다 누군가에게 말하거나 보여줄 때, 무엇을 전하고 싶은지가 더 선명해집니다.",
  CREATION: "생각한 것을 직접 만들어 보여주면, 말로만 설명할 때 놓쳤던 부분까지 확인할 수 있어요.",
  RESOURCE_SENSE: "무엇을 벌었는지만 보지 않아요. 시간과 비용을 빼고도 남는 것이 있는지 확인하는 눈이 있습니다.",
  PRACTICALITY: "좋은 계획을 들었을 때도 당장 할 수 있는 일을 찾죠. 생각에 머문 것을 현실로 옮기는 데 이 판단을 쓸 수 있어요.",
  PERSISTENCE: "처음의 기분이 가라앉은 뒤에도 하던 일을 놓지 않죠. 반복해서 익혀야 하는 일에서 그 시간이 남습니다.",
  STRATEGY: "일이 몰려와도 한꺼번에 붙잡기보다 먼저 할 일을 정할 수 있어요. 다음 순서를 보는 습관이 여기서 쓰입니다.",
  BOUNDARY: "같이 일을 정하거나 부탁을 받을 때, 어디까지 괜찮은지를 말로 나눌 수 있어요.",
  AUTONOMY: "남의 의견을 듣더라도 마지막 선택은 직접 확인하고 싶어 하죠. 자기 판단이 필요한 일에서 이 기준이 살아납니다.",
  RECOVERY_NEED: "바깥일을 잠깐 멈추고 조용히 정리할 때, 무엇을 계속하고 무엇을 내려놓을지 더 잘 볼 수 있어요.",
};
