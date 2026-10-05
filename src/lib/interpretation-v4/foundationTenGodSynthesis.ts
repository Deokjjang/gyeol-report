import type { TenGod } from "../saju/types";
import type { EvidenceAtom, FoundationSynthesisCandidate, InterpretationContext, SemanticAxis } from "./semanticCore";
import { TEN_GOD_SEMANTICS, type NormalizedTenGodStates, type TenGodFamily, type VerifiedIntensity } from "./foundationTenGods";

type SynthesisMeaning = {
  id: string; primaryAxes: readonly SemanticAxis[]; contexts: readonly InterpretationContext[];
  humanDescription: string; secondaryDescription?: string; positiveMeaning?: string; shadowMeaning?: string;
  exclusivityGroup: string;
};
type FamilyRule = SynthesisMeaning & { families: readonly TenGodFamily[] };
export const TEN_GOD_PAIR_RULES = [
  {
    id: "SELF_TO_OUTPUT", families: ["PEER", "OUTPUT"], primaryAxes: ["AUTONOMY", "CREATION", "EXPRESSION"], contexts: ["work", "identity"], exclusivityGroup: "self-expression",
    humanDescription: "남이 시키는 방식보다 내가 생각한 방법으로 직접 만들어볼 때 강합니다.",
    positiveMeaning: "자기 아이디어를 실제 결과로 꺼내는 데 강점이 있습니다.",
    shadowMeaning: "정해진 방식이 답답하면 필요한 기준까지 무시하고 싶어질 수 있습니다.",
  },
  {
    id: "SELF_AND_REALITY", families: ["PEER", "WEALTH"], primaryAxes: ["AUTONOMY", "RESOURCE_SENSE", "PRACTICALITY"], contexts: ["money", "work"], exclusivityGroup: "self-reality",
    humanDescription: "돈 문제에서도 남에게 맡기기보다 직접 계산하고 결정하고 싶은 쪽입니다.",
    positiveMeaning: "자기 판단으로 돈과 현실 문제를 관리하려는 성향이 강합니다.",
    shadowMeaning: "모든 결정을 직접 쥐려고 하면 사람과 자원을 나누기 어려울 수 있습니다.",
  },
  {
    id: "SELF_VS_RULE", families: ["PEER", "OFFICER"], primaryAxes: ["AUTONOMY", "DUTY", "BOUNDARY"], contexts: ["work", "stress"], exclusivityGroup: "self-rule",
    humanDescription: "내 방식대로 하고 싶은 마음도 강한데 책임과 기준도 무시하지 못합니다.",
    secondaryDescription: "마음에 들지 않는 방식이어도 맡은 일 자체는 끝내려 할 수 있습니다.",
    positiveMeaning: "자기 기준과 책임을 함께 지킬 수 있습니다.",
    shadowMeaning: "내 방식과 조직의 기준이 부딪히면 스트레스가 커질 수 있습니다.",
  },
  {
    id: "LEARNING_IN_MY_WAY", families: ["PEER", "RESOURCE"], primaryAxes: ["AUTONOMY", "LEARNING", "DEPTH"], contexts: ["learning", "identity"], exclusivityGroup: "self-learning",
    humanDescription: "남의 설명을 듣더라도 마지막에는 자기 방식으로 이해해야 마음이 놓입니다.",
    positiveMeaning: "배운 것을 그대로 외우기보다 자기 것으로 바꾸는 데 강점이 있습니다.",
    shadowMeaning: "이미 충분한 설명도 다시 자기 방식으로 확인하느라 시간이 걸릴 수 있습니다.",
  },
  {
    id: "OUTPUT_TO_WEALTH", families: ["OUTPUT", "WEALTH"], primaryAxes: ["CREATION", "EXPRESSION", "RESOURCE_SENSE", "PRACTICALITY"], contexts: ["work", "money"], exclusivityGroup: "output-value",
    humanDescription: "내가 만든 것과 해낸 결과를 실제 돈이나 현실적인 성과와 연결하고 싶어 합니다.",
    positiveMeaning: "재능이나 결과를 현실적인 가치로 바꾸는 데 관심이 큽니다.",
    shadowMeaning: "결과가 바로 돈이나 성과로 이어지지 않으면 흥미가 떨어질 수 있습니다.",
  },
  {
    id: "EXPRESSION_VS_RULE", families: ["OUTPUT", "OFFICER"], primaryAxes: ["EXPRESSION", "AUTONOMY", "DUTY", "STRUCTURE_STYLE"], contexts: ["work", "social"], exclusivityGroup: "expression-rule",
    humanDescription: "자기 방식으로 말하고 만들고 싶은 마음과 지켜야 할 기준을 무시할 수 없는 마음이 같이 있습니다.",
    positiveMeaning: "규칙 안에서 더 나은 방법을 찾아내는 데 강점이 있습니다.",
    shadowMeaning: "이유를 설명하지 않는 규칙이나 지시에는 답답함이 커질 수 있습니다.",
  },
  {
    id: "LEARNING_TO_OUTPUT", families: ["OUTPUT", "RESOURCE"], primaryAxes: ["LEARNING", "CREATION", "EXPRESSION", "DEPTH"], contexts: ["learning", "work"], exclusivityGroup: "learning-output",
    humanDescription: "배우기만 하는 사람도 아니고 만들기만 하는 사람도 아닙니다. 이해한 것을 설명하거나 결과물로 만들 때 가장 좋습니다.",
    positiveMeaning: "배운 것을 말, 글, 제품, 기술 같은 결과로 바꾸는 데 강점이 있습니다.",
    shadowMeaning: "배우는 단계와 만드는 단계를 동시에 완벽하게 하려다 속도가 늦어질 수 있습니다.",
  },
  {
    id: "WEALTH_AND_STATUS", families: ["WEALTH", "OFFICER"], primaryAxes: ["RESOURCE_SENSE", "STATUS_DRIVE", "DUTY", "PRACTICALITY"], contexts: ["money", "work"], exclusivityGroup: "value-status",
    humanDescription: "돈과 현실적인 결과도 중요하고, 제대로 인정받는 것도 중요하게 생각합니다.",
    positiveMeaning: "재물과 명예를 모두 중요하게 보는 욕구가 분명할 수 있습니다.",
    shadowMeaning: "돈과 인정 두 가지를 동시에 잡으려다 스스로에게 요구하는 수준이 너무 높아질 수 있습니다.",
  },
  {
    id: "MONEY_AND_MEANING", families: ["WEALTH", "RESOURCE"], primaryAxes: ["RESOURCE_SENSE", "MEANING", "LEARNING", "PRACTICALITY"], contexts: ["money", "learning", "work"], exclusivityGroup: "value-meaning",
    humanDescription: "돈이 된다는 이유만으로 움직이지도 않고, 좋아한다는 이유만으로 현실을 무시하지도 않습니다.",
    secondaryDescription: "배울 가치도 있고 실제 돈과 결과도 남는 일을 오래 하고 싶어 할 수 있습니다.",
    positiveMeaning: "의미와 현실을 함께 보는 데 강점이 있습니다.",
    shadowMeaning: "두 조건을 모두 만족시키려다 선택이 늦어질 수 있습니다.",
  },
  {
    id: "STATUS_TO_EXPERTISE", families: ["OFFICER", "RESOURCE"], primaryAxes: ["DUTY", "STATUS_DRIVE", "LEARNING", "MEANING"], contexts: ["work", "learning"], exclusivityGroup: "responsibility-learning",
    humanDescription: "책임을 맡을수록 더 배우고 제대로 해내려는 쪽입니다.",
    positiveMeaning: "실력과 신뢰를 같이 쌓는 데 강점이 있습니다.",
    shadowMeaning: "책임이 커질수록 준비와 자기검열까지 함께 커질 수 있습니다.",
  },
] as const satisfies readonly FamilyRule[];

export const TEN_GOD_CHAIN_RULES = [
  {
    id: "LEARN_OWN_USE", families: ["RESOURCE", "PEER", "OUTPUT"], primaryAxes: ["LEARNING", "AUTONOMY", "CREATION"], contexts: ["learning", "work"], exclusivityGroup: "self-learning-output",
    humanDescription: "배운 것을 그대로 가지고 있기보다 자기 방식으로 이해한 뒤 실제로 써먹어야 만족하는 편입니다.",
    positiveMeaning: "배움이 자기 기술이나 결과로 이어지기 좋습니다.",
    shadowMeaning: "이해부터 결과까지 전부 자기 방식으로 하려다 시간이 오래 걸릴 수 있습니다.",
  },
  {
    id: "SELF_OUTPUT_TO_VALUE", families: ["PEER", "OUTPUT", "WEALTH"], primaryAxes: ["AUTONOMY", "CREATION", "RESOURCE_SENSE"], contexts: ["work", "money"], exclusivityGroup: "self-output-value",
    humanDescription: "자기 방식으로 만든 결과를 실제 돈이나 현실적인 가치와 연결하고 싶어 합니다.",
    positiveMeaning: "직접 만든 것을 현실 성과로 이어가려는 흐름이 있습니다.",
    shadowMeaning: "내가 직접 해야 한다는 생각이 강하면 규모를 키울 때 병목이 될 수 있습니다.",
  },
  {
    id: "RESULT_TO_MONEY_TO_STATUS", families: ["OUTPUT", "WEALTH", "OFFICER"], primaryAxes: ["CREATION", "RESOURCE_SENSE", "STATUS_DRIVE", "DUTY"], contexts: ["work", "money"], exclusivityGroup: "output-value-status",
    humanDescription: "실력과 결과가 실제 돈으로 이어지고, 그 성과가 더 큰 책임이나 인정으로 이어지는 그림을 중요하게 봅니다.",
    positiveMeaning: "실력, 돈, 명예를 서로 따로 보기보다 연결해서 생각하는 경향이 있습니다.",
    shadowMeaning: "결과가 바로 보이지 않으면 자기 가치를 너무 낮게 평가할 수 있습니다.",
  },
  {
    id: "RESULT_RESPONSIBILITY_EXPERTISE", families: ["WEALTH", "OFFICER", "RESOURCE"], primaryAxes: ["RESOURCE_SENSE", "DUTY", "LEARNING", "STATUS_DRIVE"], contexts: ["work", "learning", "money"], exclusivityGroup: "value-responsibility-learning",
    humanDescription: "현실적인 성과를 내고 책임이 커질수록 더 배우고 전문성을 쌓으려는 편입니다.",
    positiveMeaning: "성과와 공부를 반복하면서 실력을 높이는 데 강점이 있습니다.",
    shadowMeaning: "책임이 커질 때마다 더 완벽하게 준비해야 한다는 부담도 커질 수 있습니다.",
  },
  {
    id: "RESPONSIBILITY_TO_SELF_STANDARD", families: ["OFFICER", "RESOURCE", "PEER"], primaryAxes: ["DUTY", "LEARNING", "AUTONOMY", "BOUNDARY"], contexts: ["work", "identity"], exclusivityGroup: "responsibility-self-learning",
    humanDescription: "책임과 경험이 쌓일수록 남의 기준을 따르기보다 자기 기준이 더 단단해지는 편입니다.",
    positiveMeaning: "배우고 책임진 경험을 자기 판단력으로 바꾸는 데 강점이 있습니다.",
    shadowMeaning: "경험이 쌓인 뒤에는 다른 방식의 조언을 받아들이기 어려워질 수 있습니다.",
  },
] as const satisfies readonly FamilyRule[];

type SpecificRule = SynthesisMeaning & { families: readonly TenGodFamily[]; gods: readonly TenGod[] };
export const SPECIFIC_TEN_GOD_RULES = [
  {
    id: "BETTER_RULE_NOT_BLIND_RULE", families: ["OFFICER"], gods: ["傷官"], primaryAxes: ["AUTONOMY", "CURIOSITY", "DUTY", "STRUCTURE_STYLE"], contexts: ["work", "social"], exclusivityGroup: "expression-rule",
    humanDescription: "'시키니까 그냥 해'라는 말에 특히 답답함을 느낄 수 있습니다.",
    positiveMeaning: "규칙을 무조건 깨려는 사람보다 더 나은 규칙과 방법을 찾는 쪽으로 쓰면 강합니다.",
    shadowMeaning: "이유가 납득되지 않는 조직 기준과 부딪힐 수 있습니다.",
  },
  {
    id: "OUTPUT_UNDER_PRESSURE", families: [], gods: ["食神", "偏官"], primaryAxes: ["CREATION", "EXPRESSION", "DUTY", "GOAL_DRIVE"], contexts: ["work", "stress"], exclusivityGroup: "expression-rule",
    humanDescription: "압박이 생기면 말이나 실력, 실제 결과로 문제를 풀어내려는 편입니다.",
    positiveMeaning: "어려운 상황에서 자기가 잘하는 것을 실제 해결책으로 꺼내는 데 강점이 있습니다.",
    shadowMeaning: "문제를 해결하려고 자기 에너지를 너무 많이 쓸 수 있습니다.",
  },
  {
    id: "UNUSUAL_THOUGHT_TO_OUTPUT", families: [], gods: ["偏印", "食神"], primaryAxes: ["DEPTH", "PATTERN_SENSE", "CREATION", "EXPRESSION"], contexts: ["learning", "work"], exclusivityGroup: "learning-output",
    humanDescription: "생각은 남들과 조금 다르게 깊게 들어가면서도 결국 그것을 실제 결과로 보여주고 싶어 합니다.",
    positiveMeaning: "독특한 생각을 말, 글, 기술, 결과물로 바꾸는 데 강점이 있습니다.",
    shadowMeaning: "생각을 더 다듬을지 밖으로 꺼낼지 사이에서 시간이 오래 걸릴 수 있습니다.",
  },
] as const satisfies readonly SpecificRule[];

type DayMasterRule = SynthesisMeaning & { dayMaster: "STRONG" | "WEAK"; family: TenGodFamily; intensity: "HIGH" | "SUPPORT" };
export const DAY_MASTER_TEN_GOD_RULES = [
  {
    id: "STRONG_SELF_PEER_HIGH", dayMaster: "STRONG", family: "PEER", intensity: "HIGH", primaryAxes: ["AUTONOMY", "COMPETITION"], contexts: ["identity", "social"], exclusivityGroup: "day-master-peer",
    humanDescription: "자기 확신과 독립성이 강해서 도움을 받을 수 있어도 혼자 해결하려 할 때가 있습니다.",
    positiveMeaning: "자기 힘으로 버티고 결정하는 힘이 강합니다.", shadowMeaning: "자기 방식에 대한 고집과 경쟁심이 너무 커질 수 있습니다.",
  },
  {
    id: "WEAK_SELF_PEER_SUPPORT", dayMaster: "WEAK", family: "PEER", intensity: "SUPPORT", primaryAxes: ["AUTONOMY", "CARE"], contexts: ["social", "work"], exclusivityGroup: "day-master-peer",
    humanDescription: "혼자 모든 걸 짊어지기보다 사람과 힘을 나눌 때 더 안정되는 편입니다.", positiveMeaning: "좋은 동료와 협력할 때 자기 능력을 더 잘 쓸 수 있습니다.",
  },
  {
    id: "STRONG_SELF_OUTPUT_HIGH", dayMaster: "STRONG", family: "OUTPUT", intensity: "HIGH", primaryAxes: ["CREATION", "EXPRESSION"], contexts: ["work", "identity"], exclusivityGroup: "day-master-output",
    humanDescription: "자기 생각이나 실력을 밖으로 꺼내 실제로 써보는 데 강점이 있습니다.", shadowMeaning: "표현과 일을 너무 많이 벌이면 에너지를 과하게 쓸 수 있습니다.",
  },
  {
    id: "WEAK_SELF_OUTPUT_HIGH", dayMaster: "WEAK", family: "OUTPUT", intensity: "HIGH", primaryAxes: ["EXPRESSION", "RECOVERY_NEED"], contexts: ["work", "recovery"], exclusivityGroup: "day-master-output",
    humanDescription: "하고 싶은 말과 만들어야 할 것은 많은데 일을 너무 많이 벌이면 에너지가 먼저 빠질 수 있습니다.",
    positiveMeaning: "표현과 생산 욕구 자체는 분명합니다.", shadowMeaning: "출력량에 비해 회복이 따라오지 않을 수 있습니다.",
  },
  {
    id: "STRONG_SELF_WEALTH_HIGH", dayMaster: "STRONG", family: "WEALTH", intensity: "HIGH", primaryAxes: ["RESOURCE_SENSE", "PRACTICALITY"], contexts: ["money", "work"], exclusivityGroup: "day-master-wealth",
    humanDescription: "돈과 현실적인 결과를 직접 관리하고 결정하려는 성향을 잘 써볼 수 있습니다.", positiveMeaning: "현실 문제를 직접 다루는 데 부담이 비교적 적을 수 있습니다.",
  },
  {
    id: "WEAK_SELF_WEALTH_HIGH", dayMaster: "WEAK", family: "WEALTH", intensity: "HIGH", primaryAxes: ["RESOURCE_SENSE", "RECOVERY_NEED"], contexts: ["money", "stress"], exclusivityGroup: "day-master-wealth",
    humanDescription: "돈과 현실 문제를 너무 많이 한꺼번에 붙잡으면 오히려 부담이 커질 수 있습니다.", shadowMeaning: "해야 할 현실적인 일이 많아질수록 자기 에너지보다 책임이 앞설 수 있습니다.",
  },
  {
    id: "STRONG_SELF_OFFICER_HIGH", dayMaster: "STRONG", family: "OFFICER", intensity: "HIGH", primaryAxes: ["DUTY", "PERSISTENCE"], contexts: ["work", "stress"], exclusivityGroup: "day-master-officer",
    humanDescription: "책임이 큰 일을 맡았을 때 그 압박을 버티며 해내려는 힘을 잘 써볼 수 있습니다.", positiveMeaning: "책임 있는 자리에서 강점이 살아날 수 있습니다.",
  },
  {
    id: "WEAK_SELF_OFFICER_HIGH", dayMaster: "WEAK", family: "OFFICER", intensity: "HIGH", primaryAxes: ["DUTY", "RECOVERY_NEED"], contexts: ["work", "stress"], exclusivityGroup: "day-master-officer",
    humanDescription: "'해야 한다'는 책임과 압박을 실제보다 더 크게 느낄 수 있습니다.", shadowMeaning: "맡은 일을 계속 짊어지다 자기 여유를 잃을 수 있습니다.",
  },
  {
    id: "STRONG_SELF_RESOURCE_HIGH", dayMaster: "STRONG", family: "RESOURCE", intensity: "HIGH", primaryAxes: ["LEARNING", "DEPTH"], contexts: ["learning", "work"], exclusivityGroup: "day-master-resource",
    humanDescription: "배우고 생각하는 힘은 충분한데 준비만 계속 길어지지 않도록 조심할 필요가 있습니다.",
    positiveMeaning: "깊게 배우고 자기 것으로 만드는 데 강점이 있습니다.", shadowMeaning: "준비가 충분해도 더 알아봐야 한다고 느낄 수 있습니다.",
  },
  {
    id: "WEAK_SELF_RESOURCE_SUPPORT", dayMaster: "WEAK", family: "RESOURCE", intensity: "SUPPORT", primaryAxes: ["LEARNING", "CARE"], contexts: ["learning", "social"], exclusivityGroup: "day-master-resource",
    humanDescription: "충분히 배우고 도움을 받을수록 자기 능력을 더 편하게 꺼내는 편입니다.", positiveMeaning: "지식과 좋은 지원을 자기 힘으로 바꾸는 데 도움이 됩니다.",
  },
] as const satisfies readonly DayMasterRule[];

const sortedUnique = (values: readonly string[]) => [...new Set(values)].sort();
const eligible = (value?: VerifiedIntensity) => value?.state === "HIGH" || value?.state === "MEANINGFUL";

/** Hook for already-normalized producer states. It does not calculate strength,
 * make fortunes, select winners, or add composite axes to the atomic ledger. */
export function buildTenGodCandidates(states: NormalizedTenGodStates, evidence: readonly EvidenceAtom[]): FoundationSynthesisCandidate[] {
  const byId = new Map(evidence.map(atom => [atom.id, atom]));
  const hasRefs = (state: { evidenceIds: readonly string[]; provenance: readonly string[] } | undefined,
    match: (atom: EvidenceAtom) => boolean) => Boolean(state && state.provenance.length && state.evidenceIds.length &&
      state.evidenceIds.every(id => byId.has(id) && match(byId.get(id)!)));
  const validFamily = (family: TenGodFamily) => hasRefs(states.families[family], atom => atom.sourceType === "ten_god" && atom.family === family);
  const validGod = (god: TenGod) => hasRefs(states.gods[god], atom => atom.sourceType === "ten_god" && atom.sourceKey === god && atom.family === TEN_GOD_SEMANTICS[god].family);
  const result: FoundationSynthesisCandidate[] = [];
  function add(rule: SynthesisMeaning, source: FoundationSynthesisCandidate["source"], level: 3 | 4 | 5,
    inputs: readonly { evidenceIds: readonly string[]; provenance: readonly string[] }[]) {
    result.push({
      id: rule.id, source, semanticTheme: rule.id, evidenceIds: sortedUnique(inputs.flatMap(value => value.evidenceIds)),
      primaryAxes: [...rule.primaryAxes], contexts: [...rule.contexts], humanDescription: rule.humanDescription,
      ...(rule.secondaryDescription ? { secondaryDescription: rule.secondaryDescription } : {}),
      ...(rule.positiveMeaning ? { positiveMeaning: rule.positiveMeaning } : {}),
      ...(rule.shadowMeaning ? { shadowMeaning: rule.shadowMeaning } : {}),
      strength: level === 5 ? "SIGNATURE" : "MAIN", exclusivityGroup: rule.exclusivityGroup,
      // Same tens scale as 1A; level is retained for the later scheduler.
      priority: level * 10, metadata: { priorityLevel: level, provenance: sortedUnique(inputs.flatMap(value => value.provenance)), promotion: "INTERNAL_ONLY" },
    });
  }
  for (const rule of TEN_GOD_PAIR_RULES) {
    if (rule.families.every(f => validFamily(f) && eligible(states.families[f])))
      add(rule, "TEN_GOD_FAMILY_PAIR", 3, rule.families.map(f => states.families[f]!));
  }
  for (const rule of TEN_GOD_CHAIN_RULES) {
    if (rule.families.every(f => validFamily(f) && eligible(states.families[f])))
      add(rule, "TEN_GOD_CHAIN", 5, rule.families.map(f => states.families[f]!));
  }
  for (const rule of SPECIFIC_TEN_GOD_RULES) {
    if (rule.families.every(f => validFamily(f) && eligible(states.families[f])) && rule.gods.every(g => validGod(g) && eligible(states.gods[g])))
      add(rule, "SPECIFIC_TEN_GOD", 3, [...rule.families.map(f => states.families[f]!), ...rule.gods.map(g => states.gods[g]!)]);
  }
  for (const rule of DAY_MASTER_TEN_GOD_RULES) {
    if (states.dayMaster?.state === rule.dayMaster && validFamily(rule.family) && states.families[rule.family]?.state === rule.intensity &&
      hasRefs(states.dayMaster, atom => atom.sourceType === "heavenly_stem" && atom.metadata?.isDayMaster === true))
      add(rule, "DAY_MASTER_TEN_GOD", 4, [states.dayMaster, states.families[rule.family]!]);
  }
  return result.sort((a, b) => b.priority - a.priority || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}
