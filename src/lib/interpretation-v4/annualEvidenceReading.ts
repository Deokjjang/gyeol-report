import { materialLabel } from "./contentEvidence";
import type { MaterialPacket, NarrativeBlock } from "./narrativeTypes";
import type { MajorContext } from "./majorContext";

/** The same allocated-evidence separation as majorEvidenceReading, scoped to
 * Annual chapter IDs. Preserve every source/MBTI block; infer no interaction. */
export function separateAnnualChapter(id: string, blocks: readonly NarrativeBlock[], packet: MaterialPacket, context?: MajorContext): NarrativeBlock[] {
  const natal = blocks.filter(b => b.id.startsWith(`${id}-why-`) || b.id.startsWith(`${id}-manifest-`) || b.id === "fortune-planned-assertion");
  const mbti = blocks.filter(b => b.id.startsWith(`${id}-synthesis-`));
  const period = blocks.filter(b => !natal.includes(b) && !mbti.includes(b));
  const root = packet.selected.find(m => natal[0]?.proof.features.includes(m.feature));
  const label = root ? materialLabel(root) : "기본";
  const intro = id === "dayun-cross" ? `흐름이 바뀌어도 타고난 사주인 원국의 ${label} 성향은 내 바탕으로 남습니다.`
    : id === "fortune" ? "한 해의 기회와 함께 활용할 타고난 장점도 있습니다."
    : id === "annual-relationship" ? `관계에서 평소 드러나는 원국의 ${label} 성향도 돌아볼 만해요.`
    : `타고난 사주에는 ${label}의 성향도 있습니다.`;
  const lens = id === "dayun-cross" ? "시기를 지나며 무엇을 고르는지에는 평소의 성향도 드러납니다."
    : id === "fortune" ? "돈을 대하는 평소 반응은 원국과 MBTI를 함께 살펴볼 만해요."
    : id === "annual-relationship" ? "가까운 사람에게 보이는 평소 반응에는 MBTI의 성향도 있습니다."
    : "평소 일을 대하는 방식에는 MBTI의 성향도 드러납니다.";
  const contextualMbti = (b: NarrativeBlock) => {
    // Retain the allocated DB trait/root/proof. In a student's edition its
    // existing expertise/value meaning is applied to learning, not paid work.
    if (context?.mode !== "student" || !b.id.endsWith("-synthesis-INTJ:expertise_income_path")) return b;
    const source = packet.selected.find(m => b.proof.features.includes(m.feature));
    if (!source) return b;
    return { ...b, text: `INTJ는 남이 쉽게 대신하지 못할 실력의 값을 중요하게 보는 편입니다. 타고난 ${materialLabel(source)}의 현실적인 감각과 함께, 배운 것이 어디에 쓰일지도 궁금해할 수 있어요. 공부와 진로 탐색에서는 여러 활동에 이름을 올리기보다 직접 풀어본 문제와 익힌 방법을 남겨볼 만합니다. 당장 수입으로 이어지지 않아도 다음 경험을 고르는 기준이 될 수 있어요.` };
  };
  return [...period, ...natal.map((b, i) => ({ ...b, text: i ? b.text : `${intro} ${b.text}` })),
    ...mbti.map(contextualMbti).map((b, i) => ({ ...b, text: i ? b.text : `${lens} ${b.text}` }))];
}
