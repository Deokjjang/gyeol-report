import type { FusionInterpretation } from "./types";
import type { ExpressionLens } from "./narrativeVariation";

/** Different manifestations of the same reviewed pair, not an MBTI-only appendix. */
const actions: readonly [readonly string[], string][] = [
  [["entj-pressure", "estj-status"], "이야기를 듣는 동안 이미 당장 할 일과 나중에 할 일을 가릅니다. 말이 길어지면 속으로는 ‘그래서 누가 언제 하는데?’가 먼저 뜹니다. 당신은 답을 알아서만 앞에 서는 게 아니라 결정 뒤의 일까지 움직이고 싶어서 앞에 섭니다."],
  [["entj-wealth", "entj-made-value-structure", "entj-wealth-pressure-structure"], "좋아 보인다는 말 다음에 실제로 무엇이 남는지 묻습니다. 고생했다는 칭찬은 반갑지만 그 수고가 다음 선택권이나 보상으로 이어져야 더 신납니다. 결과를 좇는 마음과 현실의 몫을 보는 눈이 같이 움직입니다."],
  [["entj-needle", "estj-needle"], "어긋난 것을 발견하면 지적에서 멈추지 않고 고칠 순서를 꺼냅니다. 본인은 일을 빨리 끝내주려던 건데 듣는 사람에게는 준비해온 답을 한꺼번에 검사받는 순간처럼 느껴질 때도 있습니다. 정확함에 결론을 내고 싶은 성향이 붙어 말의 속도가 빨라집니다."],
  [["istj-needle"], "기억해둔 기준과 지금 눈앞의 결과를 조용히 맞춰봅니다. 대충 괜찮다는 말보다 빠진 항목이 없다는 확인이 편합니다. 한 번 제대로 정리한 방식을 다음에도 쓸 수 있게 남기는 꼼꼼함입니다."],
  [["enfp-connection", "enfp-expression", "enfj-expression", "esfp-expression"], "처음 생각한 답을 그대로 말하다가도 상대의 반응에서 다른 실마리를 얻습니다. 잘 맞는 질문 하나가 들어오면 혼자서는 흐릿하던 생각까지 꺼내집니다. 당신이 편하게 말을 주고받을 사람을 만나야 하는 이유는 기분뿐 아니라 생각도 그 자리에서 자라기 때문입니다."],
  [["intp-inquiry", "intj-inquiry", "intp-pressure-learning-structure", "infj-depth"], "바로 답을 내라는 재촉보다 잠깐 이유를 살펴볼 시간이 필요합니다. 한번 납득하면 겉으로 비슷해 보이는 다른 일에서도 무엇이 같은지 알아봅니다. 오래 생각한 사람에게만 보이는 연결이 자신감의 바탕이 됩니다."],
  [["isfp-needle", "estp-needle"], "설명을 끝까지 듣기 전에 실제로 어떤 반응이 나오는지 눈이 갑니다. 작은 불편이 보이면 거창한 계획을 다시 세우기보다 지금 바꿔볼 한 가지를 찾습니다. 당신의 정확함은 머릿속의 깔끔한 답보다 눈앞에서 달라지는 결과에 가깝습니다."],
  [["enfj-help", "esfj-help"], "누가 막혀 있는지 눈치챘다면 그 사람이 물어볼 수 있게 먼저 말을 건넵니다. 도움을 받았다는 사실보다 혼자가 아니라는 느낌을 남기는 편입니다. 당신의 사람복은 사람을 알아보는 눈과 실제로 다가가는 행동이 만나는 모습입니다."],
  [["istp-study", "estp-study"], "직접 한 번 해보면 길게 들은 설명보다 빨리 감이 옵니다. 잘 안 되는 지점을 눈앞에서 고치면서 내 방법을 만듭니다. 깊이 알아야 한다는 마음과 일단 시험해보려는 행동이 번갈아 배움을 밀어줍니다."],
];
export function fusionScene(fusions: readonly FusionInterpretation[], lens?: ExpressionLens) {
  for (const [ids, text] of actions) {
    const fusion = fusions.find(f => ids.includes(f.ruleId));
    if (fusion) {
      const scene: "conversation" | "learning" | "handoff" | "pressure" =
        ["enfp-connection", "enfp-expression", "enfj-expression", "esfp-expression"].includes(fusion.ruleId) || ["expression", "sociability"].includes(fusion.mbtiEvidence.semanticTag) ? "conversation" :
        ["inquiry", "learning", "practical-learning"].includes(fusion.mbtiEvidence.semanticTag) ? "learning" :
        fusion.mbtiEvidence.semanticTag === "help" ? "handoff" : "pressure";
      const continuation = lens === "capacity" && fusion.ruleId === "entj-pressure" ? "들어온 일을 전부 살리고 싶어서 먼저 가능한 방법부터 셉니다. 본인은 길을 찾아낸 건데 어느새 직접 할 일까지 늘어 있기도 합니다. 판단하는 힘을 어디에 쓸지 고르는 것이 다음 크기를 가르는 순간입니다." :
        lens === "practice" && fusion.ruleId === "estp-needle" ? "눈앞에서 바뀌는 반응을 보며 바로 다음 시도를 고릅니다. 오래 말한 계획보다 방금 달라진 한 가지가 더 잘 이해됩니다. 직접 확인한 차이를 다시 써볼 수 있을 때 감각이 자신감으로 남습니다." :
        lens === "inquiry" && ["intp-inquiry", "intj-inquiry", "intp-pressure-learning-structure"].includes(fusion.ruleId) ? "짧게 끝낼 수 있는 답이어도 왜 맞는지 모르겠으면 다시 확인합니다. 알아낸 이유를 다른 경우에 가져가 쓸 수 있어야 진짜 해결한 느낌이 듭니다. 남보다 오래 걸린 첫 질문이 다음에는 돌아가지 않을 길을 알려줍니다." :
        lens === "privacy" && fusion.ruleId === "infj-depth" ? "바로 취향을 단정하기보다 어떤 필요가 그 말을 만들었는지 살핍니다. 조용히 듣고 돌아본 뒤에야 내가 건넬 수 있는 답이 분명해집니다. 빨리 설득하는 말보다 상대에게 오래 맞을 이유를 고르는 쪽입니다." : text;
      return { fusion, text: continuation, scene };
    }
  }
}
