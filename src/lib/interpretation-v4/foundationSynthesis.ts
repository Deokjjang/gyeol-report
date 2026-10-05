import { FOUNDATION_ELEMENTS, elementEvidenceId, isStrongElement, isWeakElement, type ElementKey, type FoundationElementInput } from "./foundationElements";
import type { Polarity, YinYangState } from "./foundationYinYang";
import type { FoundationSynthesisCandidate, InterpretationContext, SemanticAxis } from "./semanticCore";

type RuleCopy = {
  semanticTheme: string;
  humanDescription: string;
  secondaryDescription?: string;
  positiveMeaning?: string;
  shadowMeaning?: string;
  primaryAxes: readonly SemanticAxis[];
  contexts: readonly InterpretationContext[];
};
type PairRule = RuleCopy & { requiredElements: readonly [ElementKey, ElementKey] };
type ExtremesRule = RuleCopy & { strongest: ElementKey; weakest: ElementKey };
type PolarityRule = RuleCopy & { polarity: Polarity; element: ElementKey };

export const STRONG_ELEMENT_PAIRS = [
  {
    requiredElements: ["WOOD", "FIRE"], semanticTheme: "GROWTH_TO_EXPRESSION",
    humanDescription: "하고 싶은 게 생기면 머릿속에만 두기보다 빨리 밖으로 꺼내고 싶어 합니다.",
    positiveMeaning: "새로운 일을 시작하고 사람들에게 보여주는 속도가 빠른 편입니다.",
    shadowMeaning: "키울 생각부터 앞서서 아직 정리되지 않은 상태로 일을 벌일 수도 있습니다.",
    primaryAxes: ["INITIATIVE", "EXPANSION", "EXPRESSION"], contexts: ["identity", "work", "social"],
  },
  {
    requiredElements: ["WOOD", "EARTH"], semanticTheme: "GROWTH_WITH_STABILITY",
    humanDescription: "커지고 싶지만 아무렇게나 커지고 싶지는 않습니다.",
    positiveMeaning: "새로운 일을 시작해도 오래 유지할 방법까지 같이 생각하는 편입니다.",
    shadowMeaning: "성장하고 싶은 마음과 지금 가진 것을 지키고 싶은 마음이 부딪힐 수 있습니다.",
    primaryAxes: ["EXPANSION", "STABILITY", "PRACTICALITY"], contexts: ["identity", "work"],
  },
  {
    requiredElements: ["WOOD", "METAL"], semanticTheme: "GROWTH_WITH_CORRECTION",
    humanDescription: "앞으로 나가고 싶은 마음도 강하고, 잘못 가고 있는 건 바로 고치고 싶어 합니다.",
    positiveMeaning: "성장하면서 스스로 방향을 고치는 데 강점이 있습니다.",
    shadowMeaning: "계속 더 잘하려고 고치느라 스스로 만족하기 어려울 수 있습니다.",
    primaryAxes: ["EXPANSION", "PRECISION", "GOAL_DRIVE"], contexts: ["identity", "work", "learning"],
  },
  {
    requiredElements: ["WOOD", "WATER"], semanticTheme: "LEARNING_TO_EXPANSION",
    humanDescription: "하나를 배우면 거기서 새로운 가능성을 계속 찾아냅니다.",
    positiveMeaning: "배운 것을 새로운 아이디어와 다음 기회로 넓히는 데 강합니다.",
    shadowMeaning: "관심과 방향이 너무 많아질 수 있습니다.",
    primaryAxes: ["LEARNING", "CURIOSITY", "EXPANSION", "PATTERN_SENSE"], contexts: ["identity", "learning", "work"],
  },
  {
    requiredElements: ["FIRE", "EARTH"], semanticTheme: "EXPRESSION_TO_REALITY",
    humanDescription: "말만 하고 끝내기보다 실제로 굴러가는 결과를 만들고 싶어 합니다.",
    positiveMeaning: "아이디어를 실제 결과로 남기는 데 강점이 있습니다.",
    shadowMeaning: "보여주는 일과 유지하는 일까지 모두 책임지려다 지칠 수 있습니다.",
    primaryAxes: ["EXPRESSION", "PRACTICALITY", "STABILITY"], contexts: ["identity", "work"],
  },
  {
    requiredElements: ["FIRE", "METAL"], semanticTheme: "PRECISE_EXPRESSION",
    humanDescription: "할 말도 있고, 그 말을 꽤 정확하게 하는 편입니다.",
    positiveMeaning: "설명, 발표, 피드백처럼 정확하게 전달해야 하는 일에 강점이 있습니다.",
    shadowMeaning: "말이 빠르고 정확해서 상대에게는 생각보다 더 세게 들릴 수 있습니다.",
    primaryAxes: ["EXPRESSION", "PRECISION", "COMMUNICATION_STYLE"], contexts: ["identity", "work", "social"],
  },
  {
    requiredElements: ["FIRE", "WATER"], semanticTheme: "OUTSIDE_EXPRESSION_INNER_DEPTH",
    humanDescription: "그 자리에서는 잘 말해도 혼자 있을 때 그 말을 다시 생각하는 편입니다.",
    positiveMeaning: "사람들과 이야기하며 생각을 넓히고, 혼자 있을 때 더 깊게 정리할 수 있습니다.",
    shadowMeaning: "밖에서 에너지를 쓰고 안에서도 생각이 계속 이어져 쉽게 지칠 수 있습니다.",
    primaryAxes: ["EXPRESSION", "DEPTH", "RECOVERY_NEED"], contexts: ["identity", "social", "recovery"],
  },
  {
    requiredElements: ["EARTH", "METAL"], semanticTheme: "PRACTICAL_ORDER",
    humanDescription: "애매하게 굴러가는 상태를 오래 두고 보기 어렵습니다.",
    positiveMeaning: "돈, 일정, 기준처럼 실제로 관리해야 하는 것을 정리하는 데 강합니다.",
    shadowMeaning: "이미 세운 기준을 바꾸는 데 시간이 걸릴 수 있습니다.",
    primaryAxes: ["PRACTICALITY", "STRUCTURE_STYLE", "PRECISION", "STABILITY"], contexts: ["identity", "work", "money"],
  },
  {
    requiredElements: ["EARTH", "WATER"], semanticTheme: "STABLE_BUT_ADAPTIVE",
    humanDescription: "기본 생활은 안정적이길 바라지만 상황이 바뀌면 생각보다 잘 적응하는 편입니다.",
    positiveMeaning: "돌아올 기준을 하나 가지고 변화를 받아들이는 데 강점이 있습니다.",
    shadowMeaning: "안정과 변화 중 어느 쪽을 먼저 지킬지 오래 고민할 수 있습니다.",
    primaryAxes: ["STABILITY", "ADAPTABILITY", "DEPTH"], contexts: ["identity", "work", "recovery"],
  },
  {
    requiredElements: ["METAL", "WATER"], semanticTheme: "PRECISE_DEEP_ANALYSIS",
    humanDescription: "작은 오류를 보는 눈과 그 오류가 왜 생겼는지 파고드는 성향이 같이 있습니다.",
    positiveMeaning: "분석, 편집, 연구, 기획처럼 정확성과 깊이가 함께 필요한 일에 강합니다.",
    shadowMeaning: "생각과 검토가 너무 길어질 수 있습니다.",
    primaryAxes: ["PRECISION", "DEPTH", "PATTERN_SENSE", "STRATEGY"], contexts: ["identity", "work", "learning"],
  },
] as const satisfies readonly PairRule[];

export const STRONGEST_WEAKEST_RULES = [
  {
    strongest: "WOOD", weakest: "FIRE", semanticTheme: "DIRECTION_BEFORE_EXPRESSION",
    humanDescription: "하고 싶은 방향은 잘 잡지만 그것을 바로 보여주거나 알리는 일은 한 박자 늦을 수 있습니다.",
    secondaryDescription: "목표는 분명한데 표현이나 홍보가 뒤로 밀릴 수 있습니다.",
    primaryAxes: ["GOAL_DRIVE", "EXPANSION", "EXPRESSION"], contexts: ["identity", "work"],
  },
  {
    strongest: "WOOD", weakest: "EARTH", semanticTheme: "GROWTH_BEFORE_MAINTENANCE",
    humanDescription: "새로운 일을 시작하고 키우는 건 좋아하지만 매일 같은 방식으로 관리하는 일은 쉽게 지루해질 수 있습니다.",
    secondaryDescription: "벌이는 속도보다 정리하고 유지하는 속도가 늦을 수 있습니다.",
    primaryAxes: ["EXPANSION", "STABILITY"], contexts: ["identity", "work", "recovery"],
  },
  {
    strongest: "WOOD", weakest: "METAL", semanticTheme: "GROWTH_BEFORE_PRUNING",
    humanDescription: "앞으로 가는 힘은 좋은데 어디에서 멈추고 무엇을 버릴지 정하는 게 어려울 수 있습니다.",
    primaryAxes: ["EXPANSION", "BOUNDARY"], contexts: ["identity", "work"],
  },
  {
    strongest: "WOOD", weakest: "WATER", semanticTheme: "DIRECTION_BEFORE_REFLECTION",
    humanDescription: "방향이 잡히면 빠르게 가는 대신 중간에 멈춰 다시 생각하는 시간이 부족할 수 있습니다.",
    primaryAxes: ["GOAL_DRIVE", "DEPTH", "RECOVERY_NEED"], contexts: ["identity", "work", "recovery"],
  },
  {
    strongest: "FIRE", weakest: "WOOD", semanticTheme: "EXPRESSION_BEFORE_LONG_DIRECTION",
    humanDescription: "표현과 반응은 빠른데 장기적으로 무엇을 키울지는 자주 다시 정할 수 있습니다.",
    primaryAxes: ["EXPRESSION", "GOAL_DRIVE"], contexts: ["identity", "work", "social"],
  },
  {
    strongest: "FIRE", weakest: "EARTH", semanticTheme: "EXPRESSION_BEFORE_ROUTINE",
    humanDescription: "말하고 보여주는 속도는 빠른데 생활을 일정하게 굴리는 마지막 관리가 밀릴 수 있습니다.",
    secondaryDescription: "약속과 일은 잘해도 쉬는 시간, 정리, 생활 루틴이 뒤로 갈 수 있습니다.",
    primaryAxes: ["EXPRESSION", "STABILITY", "PRACTICALITY"], contexts: ["identity", "work", "recovery"],
  },
  {
    strongest: "FIRE", weakest: "METAL", semanticTheme: "EXPRESSION_BEFORE_EDITING",
    humanDescription: "일단 표현한 뒤 나중에 정리하거나 수정하는 편일 수 있습니다.",
    shadowMeaning: "말이 먼저 나가고 기준은 뒤늦게 붙을 수 있습니다.",
    primaryAxes: ["EXPRESSION", "PRECISION"], contexts: ["identity", "work", "social"],
  },
  {
    strongest: "FIRE", weakest: "WATER", semanticTheme: "RESPONSE_BEFORE_REFLECTION",
    humanDescription: "생각을 오래 끌기보다 반응하고 움직이는 쪽이 빠릅니다.",
    shadowMeaning: "쉬거나 돌아보는 시간이 부족할 수 있습니다.",
    primaryAxes: ["EXPRESSION", "ACTION_TEMPO", "RECOVERY_NEED"], contexts: ["identity", "social", "recovery"],
  },
  {
    strongest: "EARTH", weakest: "WOOD", semanticTheme: "MAINTENANCE_BEFORE_NEW_DIRECTION",
    humanDescription: "지금 있는 것을 지키고 잘 굴리는 데 강하지만 완전히 새로운 방향을 처음 만드는 데는 시간이 필요할 수 있습니다.",
    primaryAxes: ["STABILITY", "PERSISTENCE", "INITIATIVE"], contexts: ["identity", "work"],
  },
  {
    strongest: "EARTH", weakest: "FIRE", semanticTheme: "RESPONSIBILITY_BEFORE_VISIBILITY",
    humanDescription: "실력과 책임감은 있어도 그것을 밖으로 크게 드러내는 편은 아닐 수 있습니다.",
    secondaryDescription: "본인이 한 일을 굳이 크게 말하지 않아 나중에 알아주는 경우가 생길 수 있습니다.",
    primaryAxes: ["DUTY", "PRACTICALITY", "EXPRESSION"], contexts: ["identity", "work", "social"],
  },
  {
    strongest: "EARTH", weakest: "METAL", semanticTheme: "PERSISTENCE_BEFORE_STOPPING",
    humanDescription: "오래 버티기는 잘하지만 이제 그만할 것을 정하는 게 늦을 수 있습니다.",
    primaryAxes: ["PERSISTENCE", "BOUNDARY", "DECISION_STYLE"], contexts: ["identity", "work"],
  },
  {
    strongest: "EARTH", weakest: "WATER", semanticTheme: "ROUTINE_BEFORE_ADAPTATION",
    humanDescription: "한번 익숙해진 방식은 잘 유지하지만 갑자기 상황이 바뀌면 적응할 시간을 조금 더 필요로 할 수 있습니다.",
    primaryAxes: ["STABILITY", "ADAPTABILITY"], contexts: ["identity", "work", "recovery"],
  },
  {
    strongest: "METAL", weakest: "WOOD", semanticTheme: "CORRECTION_BEFORE_NEW_DIRECTION",
    humanDescription: "틀린 건 잘 찾는데 그럼 다음에 뭘 새로 할지를 정하는 건 별도의 고민일 수 있습니다.",
    primaryAxes: ["PRECISION", "INITIATIVE", "GOAL_DRIVE"], contexts: ["identity", "work", "learning"],
  },
  {
    strongest: "METAL", weakest: "FIRE", semanticTheme: "JUDGMENT_BEFORE_EXPRESSION",
    humanDescription: "생각과 판단은 정확한데 그것을 바로 말하거나 보여주는 단계에서 한 번 더 고민할 수 있습니다.",
    primaryAxes: ["PRECISION", "DECISION_STYLE", "EXPRESSION"], contexts: ["identity", "work", "social"],
  },
  {
    strongest: "METAL", weakest: "EARTH", semanticTheme: "STANDARDS_BEFORE_ROUTINE",
    humanDescription: "기준은 높은데 그 기준을 매일 유지할 생활 구조가 따라오지 않으면 스스로 답답해질 수 있습니다.",
    primaryAxes: ["PRECISION", "STRUCTURE_STYLE", "STABILITY"], contexts: ["identity", "work", "recovery"],
  },
  {
    strongest: "METAL", weakest: "WATER", semanticTheme: "JUDGMENT_BEFORE_RECONSIDERATION",
    humanDescription: "결론은 잘 내리지만 한번 내린 판단을 다시 넓혀 보는 과정은 의식적으로 필요할 수 있습니다.",
    primaryAxes: ["DECISION_STYLE", "DEPTH", "ADAPTABILITY"], contexts: ["identity", "work", "learning"],
  },
  {
    strongest: "WATER", weakest: "WOOD", semanticTheme: "DEPTH_BEFORE_DIRECTION",
    humanDescription: "생각은 깊게 이어지는데 결국 어느 방향으로 갈지를 정하는 데 시간이 걸릴 수 있습니다.",
    primaryAxes: ["DEPTH", "GOAL_DRIVE"], contexts: ["identity", "learning", "work"],
  },
  {
    strongest: "WATER", weakest: "FIRE", semanticTheme: "THOUGHT_BEFORE_VISIBILITY",
    humanDescription: "머릿속에서는 많은 일이 일어나는데 다른 사람은 그걸 잘 모를 수 있습니다.",
    primaryAxes: ["DEPTH", "EXPRESSION"], contexts: ["identity", "work", "social"],
  },
  {
    strongest: "WATER", weakest: "EARTH", semanticTheme: "IDEAS_BEFORE_ROUTINE",
    humanDescription: "아이디어와 생각은 계속 움직이는데 생활은 조금 흐트러질 수 있습니다.",
    primaryAxes: ["DEPTH", "ADAPTABILITY", "STABILITY"], contexts: ["identity", "learning", "recovery"],
  },
  {
    strongest: "WATER", weakest: "METAL", semanticTheme: "POSSIBILITIES_BEFORE_CHOICE",
    humanDescription: "여러 가능성을 잘 보는 대신 하나를 버리고 하나를 고르는 결정이 늦어질 수 있습니다.",
    primaryAxes: ["DEPTH", "ADAPTABILITY", "DECISION_STYLE"], contexts: ["identity", "work", "learning"],
  },
] as const satisfies readonly ExtremesRule[];

export const YIN_YANG_ELEMENT_RULES = [
  {
    polarity: "YANG", element: "WOOD", semanticTheme: "YANG_WOOD",
    humanDescription: "목표가 생기면 기다리기보다 먼저 움직이는 쪽입니다.",
    shadowMeaning: "앞으로 가는 속도가 너무 빨라질 수 있습니다.",
    primaryAxes: ["INITIATIVE", "GOAL_DRIVE", "ACTION_TEMPO"], contexts: ["identity", "work"],
  },
  {
    polarity: "YIN", element: "WOOD", semanticTheme: "YIN_WOOD",
    humanDescription: "겉으로 크게 서두르지는 않아도 속에서는 오래 성장할 방향을 붙잡습니다.",
    secondaryDescription: "조용해 보여도 목표까지 작은 사람은 아닙니다.",
    primaryAxes: ["PERSISTENCE", "GOAL_DRIVE", "EXPANSION"], contexts: ["identity", "work", "learning"],
  },
  {
    polarity: "YANG", element: "FIRE", semanticTheme: "YANG_FIRE",
    humanDescription: "생각과 반응이 밖으로 나오는 속도가 빠른 편입니다.",
    positiveMeaning: "사람들 사이에서 존재감이 쉽게 드러날 수 있습니다.",
    shadowMeaning: "에너지를 너무 빨리 써서 지칠 수 있습니다.",
    primaryAxes: ["EXPRESSION", "ENERGY_DIRECTION", "CHARISMA"], contexts: ["identity", "social", "recovery"],
  },
  {
    polarity: "YIN", element: "FIRE", semanticTheme: "YIN_FIRE",
    humanDescription: "모든 사람 앞에서 크게 드러나기보다 좋아하는 사람이나 일에 집중해서 표현하는 편입니다.",
    primaryAxes: ["EXPRESSION", "ENERGY_DIRECTION", "DEPTH"], contexts: ["identity", "work", "love"],
  },
  {
    polarity: "YANG", element: "EARTH", semanticTheme: "YANG_EARTH",
    humanDescription: "버티기만 하는 사람이 아니라 버티면서 계속 앞으로 밀어가는 편입니다.",
    primaryAxes: ["PERSISTENCE", "INITIATIVE", "STABILITY"], contexts: ["identity", "work"],
  },
  {
    polarity: "YIN", element: "EARTH", semanticTheme: "YIN_EARTH",
    humanDescription: "겉으로 크게 움직이지 않아도 한번 맡은 것은 오래 지키는 편입니다.",
    primaryAxes: ["PERSISTENCE", "DUTY", "STABILITY"], contexts: ["identity", "work"],
  },
  {
    polarity: "YANG", element: "METAL", semanticTheme: "YANG_METAL",
    humanDescription: "판단이 빠르고 필요한 말도 비교적 바로 하는 편입니다.",
    shadowMeaning: "다른 사람이 생각을 정리할 시간을 덜 줄 수 있습니다.",
    primaryAxes: ["ACTION_TEMPO", "DECISION_STYLE", "COMMUNICATION_STYLE"], contexts: ["identity", "work", "social"],
  },
  {
    polarity: "YIN", element: "METAL", semanticTheme: "YIN_METAL",
    humanDescription: "속으로는 기준이 꽤 분명하지만 그 생각을 매번 다 말하지는 않는 편입니다.",
    primaryAxes: ["STRUCTURE_STYLE", "PRECISION", "COMMUNICATION_STYLE"], contexts: ["identity", "work", "social"],
  },
  {
    polarity: "YANG", element: "WATER", semanticTheme: "YANG_WATER",
    humanDescription: "생각이 많아도 머릿속에만 머무르지 않고 다른 정보나 행동으로 이어지는 편입니다.",
    primaryAxes: ["DEPTH", "PATTERN_SENSE", "INITIATIVE"], contexts: ["identity", "work", "learning"],
  },
  {
    polarity: "YIN", element: "WATER", semanticTheme: "YIN_WATER",
    humanDescription: "한번 생각하기 시작하면 안쪽으로 깊게 들어가는 편입니다.",
    shadowMeaning: "같은 생각을 오래 반복할 수 있습니다.",
    primaryAxes: ["DEPTH", "ENERGY_DIRECTION", "RECOVERY_NEED"], contexts: ["identity", "learning", "recovery"],
  },
] as const satisfies readonly PolarityRule[];

const CANDIDATE_PRIORITY = { ELEMENT_PAIR: 20, STRONGEST_WEAKEST: 30, YIN_YANG_ELEMENT: 10 } as const;
function candidate(rule: RuleCopy, source: keyof typeof CANDIDATE_PRIORITY, key: string, evidenceIds: string[]): FoundationSynthesisCandidate {
  return {
    id: `foundation:${source}:${key}`, source, semanticTheme: rule.semanticTheme, evidenceIds,
    primaryAxes: [...rule.primaryAxes], contexts: [...rule.contexts], humanDescription: rule.humanDescription,
    ...(rule.secondaryDescription ? { secondaryDescription: rule.secondaryDescription } : {}),
    ...(rule.positiveMeaning ? { positiveMeaning: rule.positiveMeaning } : {}),
    ...(rule.shadowMeaning ? { shadowMeaning: rule.shadowMeaning } : {}),
    strength: "MAIN", exclusivityGroup: `foundation:${rule.semanticTheme}`, priority: CANDIDATE_PRIORITY[source],
  };
}

/** Candidate interpretation only; does not add axes again or select Book claims. */
export function buildFoundationCandidates(
  elements: Record<ElementKey, FoundationElementInput>,
  yinYang: { state: YinYangState; evidenceId: string },
): FoundationSynthesisCandidate[] {
  const candidates: FoundationSynthesisCandidate[] = [];
  const id = (element: ElementKey) => elementEvidenceId(element, elements[element].state);
  for (const rule of STRONG_ELEMENT_PAIRS) {
    if (rule.requiredElements.every(e => isStrongElement(elements[e].state))) {
      candidates.push(candidate(rule, "ELEMENT_PAIR", rule.requiredElements.join("_"), rule.requiredElements.map(id)));
    }
  }
  const { strongest, weakest } = foundationExtrema(elements);
  if (strongest && weakest && isStrongElement(elements[strongest].state) && isWeakElement(elements[weakest].state)) {
    const rule = STRONGEST_WEAKEST_RULES.find(r => r.strongest === strongest && r.weakest === weakest);
    if (rule) candidates.push(candidate(rule, "STRONGEST_WEAKEST", `${strongest}_${weakest}`, [id(strongest), id(weakest)]));
  }
  const polarity = yinYang.state === "STRONG_YANG" || yinYang.state === "EXTREME_YANG" ? "YANG" :
    yinYang.state === "STRONG_YIN" || yinYang.state === "EXTREME_YIN" ? "YIN" : null;
  for (const rule of YIN_YANG_ELEMENT_RULES) {
    if (polarity === rule.polarity && isStrongElement(elements[rule.element].state)) {
      candidates.push(candidate(rule, "YIN_YANG_ELEMENT", rule.semanticTheme, [yinYang.evidenceId, id(rule.element)]));
    }
  }
  // Code-point comparison, independent of host locale and object insertion order.
  return candidates.sort((a, b) => b.priority - a.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

/** The current canonical result has scores, but no authoritative tie winner.
 * Equal scores stay tied; no epsilon, state threshold or element-order winner. */
export function foundationExtrema(elements: Record<ElementKey, FoundationElementInput>) {
  const scores = FOUNDATION_ELEMENTS.map(e => elements[e].weightedScore);
  const top = FOUNDATION_ELEMENTS.filter(e => elements[e].weightedScore === Math.max(...scores));
  const bottom = FOUNDATION_ELEMENTS.filter(e => elements[e].weightedScore === Math.min(...scores));
  return {
    ...(top.length === 1 ? { strongest: top[0] } : {}),
    ...(bottom.length === 1 ? { weakest: bottom[0] } : {}),
    strongestIsUnique: top.length === 1, weakestIsUnique: bottom.length === 1,
  };
}
