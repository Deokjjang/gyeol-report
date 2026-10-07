import type { NarrativePhrase, NarrativeSentenceDraft } from "./narrativeCore";
import type { EditorialCandidate, ComprehensiveSectionId } from "./comprehensivePlanCore";

export const CUSTOMER_SENTENCE_KINDS = ["HUMAN_BEHAVIOR", "HUMAN_VALUE", "HUMAN_DESIRE", "HUMAN_PROCESS", "SCENE", "EVIDENCE_REASON", "META_EXPLANATION", "GOOD_RESULT", "SHADOW", "GUIDANCE", "BRIDGE"] as const;
export type CustomerSentenceKind = typeof CUSTOMER_SENTENCE_KINDS[number];
type Sentence = Pick<NarrativeSentenceDraft, "text" | "role">;
export function classifyCustomerSentence(s: Sentence): CustomerSentenceKind {
  if (/이 특징은 다른 해석|두 모습이 함께 이해|두 체계|같은 방향으로 말|보조합|강점이 있습니다|근거가 있습니다|이런 장점이 성격으로만|모든 부분이 똑같이 맞아|좋은 점이 큰 만큼 세게 쓰면|이런 모습은 혼자 있을 때보다/.test(s.text)) return "META_EXPLANATION";
  if (s.role === "ACTION") return "GUIDANCE";
  if (s.role === "LIFE_SCENE") return "SCENE";
  if (s.role === "MYEONGLI_REASON" || s.role === "MBTI_REASON") return "EVIDENCE_REASON";
  if (s.role === "GOOD_RESULT") return "GOOD_RESULT";
  if (s.role === "SHADOW" || /고집이 셉|말이 날카|시작이 늦|지칠 때|몰아붙(?:입|이게|일|이는)/.test(s.text)) return "SHADOW";
  if (/싶|원하|바라/.test(s.text)) return "HUMAN_DESIRE";
  if (/중요|기준|납득|인정|만족/.test(s.text)) return "HUMAN_VALUE";
  if (/뒤|먼저|다음|정리|순서|확인|과정/.test(s.text)) return "HUMAN_PROCESS";
  return "HUMAN_BEHAVIOR";
}
export function humanOpening(s: Sentence | undefined) {
  return !!s && ["HUMAN_BEHAVIOR", "HUMAN_VALUE", "HUMAN_DESIRE", "HUMAN_PROCESS", "GOOD_RESULT", "SHADOW"].includes(classifyCustomerSentence(s))
    && !/^(명리에서는|MBTI에서는|이 근거는|이 기운은|이 조합은|이 특징을 받쳐주는)/.test(s.text);
}
/** Job context changes nouns only. It cannot change a Claim's level or infer a trait. */
export function statusVocabulary(text: string, lifeStatus: string): string {
  if (lifeStatus === "EMPLOYEE") return text;
  const role = lifeStatus === "FREELANCER" ? "더 큰 프로젝트" : lifeStatus === "BUSINESS_OWNER" ? "리더 역할" : "책임이 큰 역할";
  return text.replace(/승진이나 더 큰 책임/g, `${role}이나 더 큰 책임`).replace(/승진/g, "실력에 대한 인정")
    .replace(/높은 직책/g, role).replace(/높은 자리를/g, "더 큰 책임과 인정을");
}
/** Phrase-level editorial order; source roles and provenance are untouched. */
export function humanFirstPenalty(sentences: readonly Sentence[], section: ComprehensiveSectionId) {
  const cap = section === "C2" || section === "C5" ? 2 : 1;
  const meta = sentences.filter(s => classifyCustomerSentence(s) === "META_EXPLANATION").length;
  const operatingAction = section === "C10" && sentences[0]?.role === "ACTION";
  return (humanOpening(sentences[0]) || operatingAction ? 0 : 10) + Math.max(0, meta - cap) * 20;
}
export type C8Intent = "WORK_STYLE" | "RESULT_STYLE" | "MONEY_STYLE" | "SUCCESS_DESIRE" | "CURRENT_CONTEXT" | "GUIDANCE";
export function workBlockIntent(c: EditorialCandidate): C8Intent {
  if (c.sourceType === "GUIDANCE") return "GUIDANCE";
  if (c.conditionSplit?.type === "START_MAINTAIN") return "WORK_STYLE";
  if (c.primaryAxes.includes("RESOURCE_SENSE") || /^M\d/.test(c.sourceId)) return "MONEY_STYLE";
  if (c.primaryAxes.includes("STATUS_DRIVE") || c.primaryAxes.includes("EXPANSION")) return "SUCCESS_DESIRE";
  if (c.primaryAxes.includes("CREATION") || c.primaryAxes.includes("EXPRESSION")) return "RESULT_STYLE";
  return "WORK_STYLE";
}
export function phraseIsMeta(p: NarrativePhrase) { return classifyCustomerSentence(p) === "META_EXPLANATION"; }
