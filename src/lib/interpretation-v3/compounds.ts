import { TEN_GODS } from "../report-knowledge/sajuKnowledgeBase";
import type { TenGod } from "../report-knowledge/sajuKnowledgeTypes";
import type { CompoundMatch, CompoundRule, Domain, Evidence } from "./types";

export const TEN_GOD_FAMILIES = {
  peer: ["bijian", "jie_cai"], output: ["shi_shen", "shang_guan"], wealth: ["pian_cai", "zheng_cai"], officer: ["qi_sha", "zheng_guan"], resource: ["pian_yin", "zheng_yin"],
} as const;
type Family = keyof typeof TEN_GOD_FAMILIES;
type PairDecision = { classification: "meaningful" | "tension" | "no-special-compound"; judgment: string; directive: string; caution: string; domains: readonly Domain[] };
// Exhaustive family review, including no-special decisions. Co-presence does not
// assert a classical structure (e.g. 식상생재) or a measured personality score.
const FAMILY_REVIEW: Record<string, PairDecision> = {
  "peer+peer": { classification: "no-special-compound", judgment: "자기 기준과 동료 경쟁은 원자 재료로 각각 유지합니다.", directive: "", caution: "같은 계열의 동시 존재만으로 새 구조를 만들지 않습니다.", domains: ["identity"] },
  "output+output": { classification: "meaningful", judgment: "꾸준한 생산과 새로운 표현을 함께 쓸 자원이 있습니다.", directive: "익숙한 결과물과 실험용 초안을 나누세요.", caution: "변화 때문에 완성을 미루지 마세요.", domains: ["career", "study"] },
  "wealth+wealth": { classification: "meaningful", judgment: "기회를 잡는 감각과 자원을 지키는 감각을 함께 갖고 있습니다.", directive: "새 기회 예산과 유지 자원을 분리하세요.", caution: "확장과 안정의 기준을 섞지 마세요.", domains: ["money", "business"] },
  "officer+officer": { classification: "tension", judgment: "공식 기준을 지키는 힘과 압박에 즉시 대응하는 힘이 함께 작동합니다.", directive: "정규 책임과 긴급 대응의 우선순위를 나누세요.", caution: "두 책임을 한꺼번에 떠안지 마세요.", domains: ["career", "leadership"] },
  "resource+resource": { classification: "meaningful", judgment: "체계적인 학습과 독자적인 탐구를 함께 쓸 자원이 있습니다.", directive: "정리한 원리 옆에 새로운 가설을 구분해 적으세요.", caution: "탐구가 적용을 무한정 미루지 않게 하세요.", domains: ["study", "career"] },
  "peer+output": { classification: "meaningful", judgment: "자기 기준을 결과물과 표현으로 꺼낼 자원이 있습니다.", directive: "내 판단을 설명할 결과물 하나를 보여 주세요.", caution: "내 기준만으로 상대의 반응을 정하지 마세요.", domains: ["identity", "career"] },
  "peer+wealth": { classification: "tension", judgment: "독립적인 판단과 공동 자원 관리 사이에 조정할 지점이 있습니다.", directive: "자율 결정 범위와 공동 자원 한도를 따로 정하세요.", caution: "관계의 경쟁을 자원 투입으로 풀지 마세요.", domains: ["money", "business", "relationship"] },
  "peer+officer": { classification: "tension", judgment: "자기 기준과 공식 책임이 서로 다른 요구를 만듭니다.", directive: "자율적으로 정할 일과 승인받을 일을 구분하세요.", caution: "기준 차이를 사람 사이의 적대감으로 확대하지 마세요.", domains: ["career", "leadership"] },
  "peer+resource": { classification: "meaningful", judgment: "배운 기준을 자기 판단으로 정리할 자원이 있습니다.", directive: "도움을 받은 내용과 직접 결정할 부분을 나누세요.", caution: "독립성을 이유로 필요한 도움까지 거절하지 마세요.", domains: ["study", "identity"] },
  "output+wealth": { classification: "meaningful", judgment: "만든 결과물을 기회와 자원 흐름에 연결하는 힘이 있습니다.", directive: "결과물의 대상과 교환 조건을 함께 정하세요.", caution: "표현의 재능을 수익 보장으로 읽지 않습니다.", domains: ["money", "business", "career"] },
  "output+officer": { classification: "tension", judgment: "새롭게 표현하려는 힘과 책임 기준 사이에 조정할 지점이 있습니다.", directive: "바꿀 방식과 지켜야 할 기준을 나누세요.", caution: "개선 제안을 권한 다툼으로 만들지 마세요.", domains: ["career", "leadership"] },
  "output+resource": { classification: "meaningful", judgment: "배운 내용을 자기 결과물로 바꾸는 힘이 있습니다.", directive: "학습 단위마다 설명이나 작은 완성품을 남기세요.", caution: "이해한 느낌과 검증한 결과를 구분하세요.", domains: ["study", "career"] },
  "wealth+officer": { classification: "meaningful", judgment: "자원 관리와 공식 책임을 연결할 자원이 있습니다.", directive: "맡을 책임에 필요한 자원과 권한을 함께 적으세요.", caution: "성과를 직함이나 승진의 보장으로 읽지 않습니다.", domains: ["career", "business", "money"] },
  "wealth+resource": { classification: "no-special-compound", judgment: "자원 관리와 학습은 각 영역에서 읽습니다.", directive: "", caution: "존재 여부만으로 두 요소의 생극 강도를 판정하지 않습니다.", domains: ["money", "study"] },
  "officer+resource": { classification: "meaningful", judgment: "전문성과 학습을 공식 역할의 기반으로 쓸 힘이 있습니다.", directive: "역할에 필요한 지식을 문서와 적용 사례로 정리하세요.", caution: "자격과 책임을 합격이나 승진 보장으로 바꾸지 않습니다.", domains: ["career", "study", "leadership"] },
};
const family = (god: TenGod): Family => (Object.keys(TEN_GOD_FAMILIES) as Family[]).find(f => (TEN_GOD_FAMILIES[f] as readonly string[]).includes(god))!;
const familyOrder = Object.keys(TEN_GOD_FAMILIES) as Family[];
export const TEN_GOD_PAIR_REVIEW = TEN_GODS.flatMap((a, i) => TEN_GODS.slice(i + 1).map(b => {
  const key = [family(a), family(b)].sort((x, y) => familyOrder.indexOf(x) - familyOrder.indexOf(y)).join("+");
  const override: Partial<PairDecision> = a === "shi_shen" && b === "qi_sha"
    ? { classification: "meaningful", judgment: "압박을 구체적인 작업과 결과물로 풀어내는 힘이 있습니다.", directive: "급한 요구를 바로 시작할 수 있는 작업 단위로 바꾸세요." }
    : a === "shang_guan" && b === "pian_cai"
      ? { judgment: "새 표현과 개선안을 외부 기회로 연결하는 힘이 있습니다.", directive: "새 기획을 작은 시장 반응으로 먼저 검토하세요." } : {};
  return { id: `pair:${a}+${b}`, pair: [a, b] as const, family: key, ...FAMILY_REVIEW[key], ...override,
    sourceRefs: [`sajuKnowledgeBase:ten_god_${a}`, `sajuKnowledgeBase:ten_god_${b}`] };
}));
const pairRules: CompoundRule[] = TEN_GOD_PAIR_REVIEW.flatMap(p => p.classification === "no-special-compound" ? [] : [{
  id: p.id, allOf: p.pair.map(g => [`ten_god_${g}`]), domains: p.domains, kind: p.classification, judgment: p.judgment, directive: p.directive, caution: p.caution, sourceRefs: p.sourceRefs,
}]);
export const SEMANTIC_GROUPS = {
  leadership: ["twelve_sinsal_jangseong", "sinsal_jangseong"], precision: ["sinsal_hyeonchim"], attention: ["sinsal_dohwa"], charm: ["sinsal_hongyeom"], movement: ["twelve_sinsal_yeokma", "sinsal_yeokma"], depth: ["twelve_sinsal_hwagae", "sinsal_hwagae"],
} as const;
const mixed: readonly [string, readonly (readonly string[])[], readonly Domain[], string, string, string][] = [
  ["leadership-pressure", [SEMANTIC_GROUPS.leadership, ["ten_god_qi_sha"]], ["career", "leadership"], "앞에서 방향을 잡는 힘과 압박에 대응하는 힘이 함께 있습니다.", "결정권과 긴급 대응의 종료 기준을 먼저 정하세요.", "강한 책임감이 모든 일을 통제하는 방식이 되지 않게 하세요."],
  ["precision-expression", [SEMANTIC_GROUPS.precision, ["ten_god_shang_guan"]], ["career", "relationship"], "예리한 관찰을 명확한 표현으로 꺼내는 힘이 있습니다.", "발견한 문제와 실행할 개선안을 함께 말하세요.", "정확한 말도 전달 순서가 필요합니다."],
  ["expression-attention", [["ten_god_shi_shen"], SEMANTIC_GROUPS.attention, SEMANTIC_GROUPS.charm], ["love", "relationship", "career"], "결과물과 표현으로 사람의 시선을 모으는 힘이 있습니다.", "보여 줄 결과물과 전할 감정을 구체적으로 고르세요.", "주목을 관계 성립의 보장으로 읽지 않습니다."],
  ["mobile-opportunity", [["ten_god_pian_cai"], SEMANTIC_GROUPS.movement], ["business", "money", "career"], "외부 연결을 기회로 읽고 움직이는 힘이 있습니다.", "새 접점마다 후속 연락과 자원 한도를 정하세요.", "이동 횟수를 성과로 착각하지 마세요."],
  ["deep-perspective", [SEMANTIC_GROUPS.depth, ["ten_god_pian_yin"]], ["study", "career", "identity"], "혼자 깊게 파고들며 독자적인 관점을 만드는 힘이 있습니다.", "숙성한 생각을 사례 하나로 공유하세요.", "깊은 몰입 뒤에 바깥의 피드백 통로를 남기세요."],
  ["official-leadership-entj", [["ten_god_zheng_guan"], SEMANTIC_GROUPS.leadership, ["mbti:ENTJ:traits:career:executive_natural_habitat"]], ["career", "leadership"], "공식 기준을 세우는 힘이 조직의 방향을 정리하는 방식으로 드러납니다.", "목표와 담당 권한을 함께 명시하세요.", "속도에 앞서 구성원의 동의를 확인하세요."],
];
export const COMPOUND_RULES: readonly CompoundRule[] = [...pairRules, ...mixed.map(([id, allOf, domains, judgment, directive, caution]) => ({
  id, allOf, domains, kind: "meaningful" as const, judgment, directive, caution,
  sourceRefs: allOf.flat().map(id => id.startsWith("mbti:") ? `source:${id}` : `atomic:${id}`),
}))];

/** Subject + selected period form the evaluation boundary. Never mix A and B,
 * distinct annual/monthly periods, or synthesize a natal pattern from flow. */
export function matchCompounds(evidence: readonly Evidence[], subject: Evidence["subject"], period?: string): readonly CompoundMatch[] {
  const eligible = evidence.filter(e => e.subject === subject && e.certainty !== "weak" && e.sourceRefs.length && e.lineage.length &&
    (e.scope === "natal" || e.scope === "behavior" || e.scope === "context" || Boolean(period && e.period === period))).toSorted((a, b) => a.id.localeCompare(b.id));
  return COMPOUND_RULES.flatMap(rule => {
    const groups = rule.allOf.map(ids => eligible.filter(e => ids.includes(e.featureId)));
    if (groups.some(g => !g.length)) return [];
    const matched = [...new Map(groups.flat().map(e => [e.id, e])).values()];
    return [{ rule, evidence: matched }];
  });
}
