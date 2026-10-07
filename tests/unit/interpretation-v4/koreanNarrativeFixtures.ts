import type { NarrativePhrase, NarrativeRequest, NarrativeSourceUnit, SentenceRole } from "../../../src/lib/interpretation-v4/narrativeCore";
import { HUMAN_GOLDEN_LANGUAGE } from "../../../src/lib/interpretation-v4/humanDescription";
import { CLAIM_REGISTRY } from "../../../src/lib/interpretation-v4/claimRegistry";
import { guidanceStrategy } from "../../../src/lib/interpretation-v4/guidanceStrategies";

/** Explicit language-unit fixtures, not synthetic chart evidence or customer adapters. */
export function phrase(role: SentenceRole, text: string, extra: Partial<NarrativePhrase> = {}): NarrativePhrase {
  return { id: role, role, text, semanticTheme: "PRECISION", primaryAxes: ["PRECISION"], contexts: ["identity", "work", "money"], directnessLevel: 2,
    origin: role === "MBTI_REASON" ? "MBTI_ACTUAL" : role === "ACTION" ? "GUIDANCE" : role === "LIFE_SCENE" ? "SCENE" : ["FUSION", "CONTRAST", "CLOSER"].includes(role) ? "SYNTHESIS" : "MYEONGLI",
    refs: { evidenceIds: ["unit-proof"], claimIds: [], fusionIds: [], resonanceIds: ["unit-human-source"], guidanceIds: role === "ACTION" ? ["unit-guidance"] : [], mbtiSourceNodeIds: role === "MBTI_REASON" || role === "FUSION" ? ["unit-actual-mbti"] : [] }, ...extra };
}
export function unit(phrases: NarrativePhrase[], extra: Partial<NarrativeSourceUnit> = {}): NarrativeSourceUnit {
  return { id: "unit", sourceType: "PERSONAL_RESONANCE", semanticTheme: "PRECISION", primaryAxes: ["PRECISION"], contexts: ["identity", "work", "money"], confidence: "HIGH", directnessLevel: 2, phrases, ...extra };
}
export function request(source = humanUnit(), extra: Partial<NarrativeRequest> = {}): NarrativeRequest {
  return { source, reportStableKey: "language-golden", sectionId: "C1", intent: "HUMAN", depthIntent: "NORMAL", context: "identity", presentationIntent: "HIDDEN", explicitMbtiBudget: 7, ...extra };
}
export function humanUnit() {
  return unit([phrase("DIRECT_CLAIM", HUMAN_GOLDEN_LANGUAGE.precision), phrase("MYEONGLI_REASON", "작은 차이를 빨리 보는 성향이 강하기 때문입니다."), phrase("CLOSER", "작은 오류를 찾아 고치는 데 장점이 있습니다.")]);
}
export function reinforceUnit() {
  return unit([phrase("DIRECT_CLAIM", HUMAN_GOLDEN_LANGUAGE.precision), phrase("HOOK", "잘하고도 고칠 곳부터 먼저 보지 않나요?"),
    phrase("MYEONGLI_REASON", "작은 차이를 빠르게 구분하는 성향이 있습니다."), phrase("MBTI_REASON", "생각의 앞뒤가 맞는지 확인하는 것을 중요하게 봅니다."),
    phrase("FUSION", "작은 오류를 넘기지 않고 정확하게 고치려 합니다."), phrase("CLOSER", "그래서 충분히 잘해도 확인할 곳이 먼저 보입니다.")], { sourceType: "FUSION", fusionType: "REINFORCE" });
}
export function tensionUnit() {
  return unit([phrase("DIRECT_CLAIM", HUMAN_GOLDEN_LANGUAGE.thinkMove), phrase("MYEONGLI_REASON", "생각을 안에서 충분히 정리하는 편입니다."),
    phrase("MBTI_REASON", "답을 정한 뒤에는 빠르게 행동하려 합니다."), phrase("CONTRAST", "결정하기 전에는 오래 살피지만 방향을 정하면 쉽게 바꾸지 않습니다.", { splitType: "BEFORE_AFTER_DECISION" }),
    phrase("CLOSER", "생각하는 시간과 움직이는 시간이 분명히 나뉘는 사람입니다.", { thirdInterpretation: true })],
  { sourceType: "FUSION", fusionType: "TENSION", conditionSplit: { resolved: true, type: "BEFORE_AFTER_DECISION", rationale: "upstream resolved unit fixture", sides: { myeongli: "검토", mbti: "행동" }, status: "CONDITIONAL_HYPOTHESIS", myeongliEvidenceIds: ["unit-proof"], mbtiSourceNodeIds: ["unit-actual-mbti"] } });
}
export function claimText(id: string, level: 2 | 3 | 4) { return CLAIM_REGISTRY.find(c => c.id === id)!.claimsByLevel[level]!; }
export function claimUnit(id: string, level: 2 | 3 | 4, fortune: boolean) {
  const text = claimText(id, level);
  return unit([phrase(fortune ? "GOOD_RESULT" : "DIRECT_CLAIM", text, { directnessLevel: level, refs: { evidenceIds: ["unit-proof"], claimIds: [id], fusionIds: [], resonanceIds: [], guidanceIds: [], mbtiSourceNodeIds: [] } })],
    { sourceType: "CLAIM", directnessLevel: level });
}
export const GOLDEN_LANGUAGE_REQUESTS: NarrativeRequest[] = [
  ...Object.entries(HUMAN_GOLDEN_LANGUAGE).map(([id, text]) => request(unit([phrase("DIRECT_CLAIM", text)], { id }))),
  request(unit([phrase("DIRECT_CLAIM", "문제를 빨리 알아차리면서도 사람을 함부로 몰아붙이지 않는 편입니다.")], { id: "kindPrecision" })),
  request(claimUnit("S08_MONEY_AND_HONOR", 4, true), { intent: "FORTUNE" }),
  request(claimUnit("F01_STUBBORN", 3, false), { intent: "FACT_BOMB" }),
  request(unit([phrase("ACTION", guidanceStrategy("DECISION_EXECUTION_SPLIT").generalAdvice)], { id: "guidance", sourceType: "GUIDANCE", metadata: { problemAlreadyExplained: true } }), { intent: "GUIDANCE" }),
];
