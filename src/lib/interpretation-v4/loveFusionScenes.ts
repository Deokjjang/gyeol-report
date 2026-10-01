import { paragraph, proof } from "./copyRealizer";
import type { NarrativeState } from "./narrativeTypes";

const SCENES: Readonly<Record<string, string>> = {
  "isfp-love": "천천히 마음을 여는 태도와 가까워질수록 살아나는 홍염의 매력이 함께 있습니다. 큰 신호를 보내지 않았는데도 둘이 보내는 시간이 다정해서, 상대가 먼저 특별한 사이로 느낄 수 있습니다. 관심의 깊이와 관계를 정하는 속도가 꼭 같은 것은 아닙니다.",
  "intj-charm": "가까이에서 느껴지는 온기는 분명한데 관계를 정하는 기준은 여전히 높습니다. 다정하게 이야기한 뒤에도 혼자 더 생각할 수 있어서 상대는 속도를 헷갈립니다. 홍염의 친밀한 매력과 신중한 선택이 다른 일을 하는 모습입니다.",
  "enfp-alone": "사람들과 즐겁게 웃은 뒤에도 내 감정을 혼자 들여다볼 시간이 남습니다. 활발하게 반응하는 ENFP의 모습과 명리의 안쪽을 향하는 결은 사랑에서도 다른 시간을 필요로 합니다. 먼저 만나자고 했던 사람이 하루쯤 조용히 있고 싶은 것도 같은 사람 안의 자연스러운 리듬입니다.",
  "entj-alone": "다 같이 있을 때는 만남을 이끌어도 중요한 마음의 결정은 혼자 정리하고 싶습니다. 바깥의 자신감 뒤에 화개의 조용한 방이 있는 모습입니다. 연인이 보는 확신과 내 안에서 한 번 더 생각하는 과정이 함께 있어도 이상하지 않습니다.",
  "esfj-alone": "다른 사람의 반응을 챙기던 얼굴과 혼자 있을 때의 고요함이 꽤 다릅니다. 화개가 깊어지는 시간을 원해도 사람들과 잘 어울리는 모습 때문에 상대는 그 필요를 놓칠 수 있습니다. 다정한 사람에게도 아무 표정을 준비하지 않아도 되는 시간이 있습니다.",
  "enfp-expression": "혼자서는 말로 잘 잡히지 않던 마음도 좋아하는 사람이 반응하면 표정과 이야기로 풀립니다. 원국에서 덜 드러난 표현을 ENFP의 감정을 주고받는 행동이 펼칠 통로가 됩니다. 꼭 길게 고백하지 않아도 함께 웃고 내 생각을 꺼내는 경험으로 애정이 더 잘 전해질 수 있습니다.",
  "intp-expression": "평소의 짧은 대답만 보고 애정도 적다고 생각하면 놓치는 것이 있습니다. 표현의 신호가 적어도 함께 궁금한 주제가 생기면 말문이 열립니다. 혼자 찾아보던 것을 같이 설명하고 질문하는 시간이, 당신에게는 마음을 드러내는 작은 통로가 될 수 있습니다.",
  "enfj-expression": "혼자 마음을 완벽한 문장으로 정리하려고 할 때보다 상대의 이야기를 들을 때 내 말도 살아납니다. 명리에서 덜 드러난 표현을 사람 앞에서 풀어내는 ENFJ의 행동이 돕는 모습입니다. 사랑한다는 정답 문장 하나보다 그 사람의 하루를 진심으로 묻는 대화가 애정의 통로가 될 수 있습니다.",
  "esfp-expression": "표현의 신호가 원국에서 크지 않아도 실제 행동까지 조용할 필요는 없습니다. ESFP의 반응과 함께 즐기는 방식이 말 밖의 통로를 만듭니다. 반가운 얼굴을 보여주고 같이 해보자고 손을 내미는 행동에 애정이 실릴 수 있습니다.",
};
export function loveFusionTurn(state: NarrativeState, usedRule?: string) {
  const candidates = state.packet.fusions.filter(f => f.ruleId !== usedRule && SCENES[f.ruleId]);
  const f = candidates.find(f => f.kind === "complement") ?? candidates.find(f => f.kind === "contrast");
  if (!f) return undefined;
  // Complement remains supporting, never upgrades the natal low signal to a hero.
  return { fusion: f, block: paragraph("love-fusion-turn", SCENES[f.ruleId], proof([], [], [f], [`v4:love-fusion:${f.ruleId}`]), "observation", "private-public-rhythm") };
}
