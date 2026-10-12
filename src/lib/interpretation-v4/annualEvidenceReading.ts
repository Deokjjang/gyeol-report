import { materialLabel } from "./contentEvidence";
import type { MaterialPacket, NarrativeBlock } from "./narrativeTypes";

/** The same allocated-evidence separation as majorEvidenceReading, scoped to
 * Annual chapter IDs. Preserve every source/MBTI block; infer no interaction. */
export function separateAnnualChapter(id: string, blocks: readonly NarrativeBlock[], packet: MaterialPacket): NarrativeBlock[] {
  const natal = blocks.filter(b => b.id.startsWith(`${id}-why-`) || b.id.startsWith(`${id}-manifest-`) || b.id === "fortune-planned-assertion");
  const mbti = blocks.filter(b => b.id.startsWith(`${id}-synthesis-`));
  const period = blocks.filter(b => !natal.includes(b) && !mbti.includes(b));
  const root = packet.selected.find(m => natal[0]?.proof.features.includes(m.feature));
  const label = root ? materialLabel(root) : "기본";
  const intro = id === "dayun-cross" ? `이 기간에 대응하는 내 바탕은 타고난 사주인 원국의 ${label} 성향에서 따로 살펴봅니다.`
    : id === "fortune" ? "한 해의 기회와 함께 활용할 타고난 장점도 있습니다."
    : id === "annual-relationship" ? `관계에서 평소 드러나는 원국의 ${label} 성향도 돌아볼 만해요.`
    : `시간의 흐름과 구분해 보면, 타고난 ${label} 성향은 이런 모습입니다.`;
  const lens = id === "dayun-cross" ? "대운·세운의 십성과는 별개로, 원국 성향과 MBTI에서 평소 선택 방식을 읽어봅니다."
    : id === "fortune" ? "돈을 대하는 평소 반응은 원국과 MBTI를 함께 살펴볼 만해요."
    : id === "annual-relationship" ? "가까운 사람에게 보이는 평소 반응에는 MBTI의 성향도 있습니다."
    : "MBTI에서는 익숙한 행동 방식을, 원국에서는 그와 나란히 볼 성향을 살펴봅니다.";
  return [...period, ...natal.map((b, i) => ({ ...b, text: i ? b.text : `${intro} ${b.text}` })),
    ...mbti.map((b, i) => ({ ...b, text: i ? b.text : `${lens} ${b.text}` }))];
}
