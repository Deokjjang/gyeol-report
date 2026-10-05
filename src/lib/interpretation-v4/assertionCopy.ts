import { paragraph, proof } from "./copyRealizer";
import { materialLabel, type ChapterEvidencePlan } from "./contentEvidence";
import type { SemanticTag } from "./types";
import { MATERIAL_BY_FEATURE } from "./materialRegistry";

/** Only the planner grants directness. A weak symbolic hint cannot enter this
 * copy table; multiple aliases of one observation cannot upgrade permission. */
const CLAIMS: Partial<Record<SemanticTag, readonly [string, string]>> = {
  wealth: ["돈과 현실적인 결과를 잡는 힘이 있습니다.", "돈을 쓸 때도 무엇이 남는지 먼저 보는 편이에요."],
  accumulation: ["한 번 얻은 것을 오래 쌓아두는 힘이 강합니다.", "작게라도 내 몫으로 남기는 일을 중요하게 보는 편이에요."],
  leadership: ["앞에 서서 방향을 잡는 힘이 강합니다.", "아무도 결정을 맡지 않으면 직접 순서를 정하는 편이에요."],
  status: ["맡는 자리와 인정의 크기를 키워볼 좋은 패가 있습니다.", "잘한 일이 어떤 역할로 돌아오는지 신경 쓰는 편이에요."],
  help: ["사람복이 있습니다.", "도움을 주고받는 관계에서 힘을 얻는 편이에요."],
  precision: ["작은 오류를 찾아내는 눈이 예리합니다.", "남들이 넘긴 빈틈을 한 번 더 살피는 편이에요."],
  expression: ["생각을 밖으로 꺼내 사람에게 닿게 하는 힘이 있습니다.", "직접 보여주거나 설명할 때 생각이 더 또렷해지는 편이에요."],
  learning: ["배운 것을 자기 실력으로 만드는 힘이 강합니다.", "이해한 것이 하나씩 늘 때 의욕도 살아나는 편이에요."],
  mobility: ["움직이며 새로운 기회를 찾아내는 힘이 있습니다.", "익숙한 자리 밖에서 다른 쓰임을 발견하는 편이에요."],
  "first-attraction": ["사람의 시선을 끄는 매력이 있습니다.", "처음 만나는 자리에서 인상을 남기는 편이에요."],
  "intimate-attraction": ["가까워질수록 더 알아보고 싶은 매력이 있습니다.", "가까워져 편한 사이가 된 뒤 자기 매력이 더 잘 드러나는 편이에요."],
};

export function plannedAssertion(plan: ChapterEvidencePlan) {
  const copy = plan.theme ? CLAIMS[plan.theme] : undefined;
  if (plan.assertion === "WEAK" || !copy || !plan.roots.length) return null;
  const lead = copy[plan.assertion === "STRONG" ? 0 : 1];
  const roots = plan.roots.filter(m => plan.theme && MATERIAL_BY_FEATURE.get(m.feature)?.semanticTags.includes(plan.theme));
  const names = roots.map(materialLabel).filter(Boolean);
  if (!names.length) return null;
  const why = plan.assertion === "STRONG" && plan.independentFeatures.length >= 2
    ? `${names.join("·")}이 따로 비추는 장점이 한 방향으로 모이는 부분입니다.`
    : `${names[0]}의 좋은 얼굴이 드러나는 장면이죠.`;
  return paragraph(`${plan.id}-planned-assertion`, `${lead} ${why}`,
    proof(roots, [], [], [`planner:assertion:${plan.assertion}`, `content-assertion:${plan.theme}`]), "positive");
}
