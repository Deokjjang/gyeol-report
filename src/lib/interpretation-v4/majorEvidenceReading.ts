import { TEN_GOD_SEMANTICS } from "./foundationTenGods";
import { materialLabel } from "./contentEvidence";
import { MAJOR_MEANINGS } from "./majorMaterials";
import { paragraph, proof } from "./copyRealizer";
import { withKoreanParticle } from "../report-knowledge/koreanCopyUtils";
import type { TenGod } from "../report-knowledge/annualFortuneTypes";
import type { MaterialPacket, NarrativeBlock, NarrativeProof } from "./narrativeTypes";

type MajorPeriod = { ganji: string; tenGod: TenGod; proof: NarrativeProof };

/** Present already allocated evidence. Never select a new natal root, infer a
 * transit interaction, or alter year/transition paragraphs. */
export function separateMajorChapter(id: string, blocks: readonly NarrativeBlock[], packet: MaterialPacket, period: MajorPeriod): NarrativeBlock[] {
  const natal = blocks.filter(b => b.id.startsWith(`${id}-why-`) || b.id.startsWith(`${id}-manifest-`) || b.id === "natal-strength");
  const mbti = blocks.filter(b => b.id.startsWith(`${id}-synthesis-`));
  const existing = blocks.filter(b => !natal.includes(b) && !mbti.includes(b));
  const labelFor = (block: NarrativeBlock | undefined) => {
    const material = packet.selected.find(m => block?.proof.features.includes(m.feature));
    return material ? materialLabel(material) : "기본";
  };
  const natalLabel = labelFor(natal[0]), mbtiRoot = labelFor(mbti[0]);
  const natalIntro = id === "next-cycle"
    ? `다음 장에도 가져갈 ${natalLabel} 성향은 태어날 때의 사주, 원국에서 읽습니다.`
    : id === "current-context" ? `지금의 흐름에 대응할 내 바탕은 원국의 ${natalLabel} 성향부터 살펴볼 만해요.`
    : id === "relationships" ? `가까운 관계에서는 타고난 ${natalLabel} 성향이 드러나는 모습도 살펴봅니다.`
    : `타고난 ${natalLabel}부터 내 바탕을 따로 살펴볼까요?`;
  const mbtiIntro = id === "next-cycle"
    ? `새 대운의 십성과는 별개로, 원국의 ${mbtiRoot} 성향과 MBTI에서 평소 선택 방식을 읽어봅니다.`
    : id === "current-context" ? `타고난 ${mbtiRoot} 성향이 평소 행동에 드러나는 모습은 MBTI와 함께 살펴봅니다.`
    : id === "relationships" ? `관계에서 보이는 MBTI의 반응과 원국의 ${mbtiRoot} 성향도 나란히 읽어볼 만해요.`
    : `원국의 ${mbtiRoot} 성향에 MBTI를 겹쳐보면 평소의 반응을 더 구체적으로 볼 수 있어요.`;
  const result = [...existing,
    ...natal.map((b, i) => ({ ...b, text: i === 0 ? `${natalIntro} ${b.text}` : b.text })),
    ...mbti.map((b, i) => ({ ...b, text: i === 0 ? `${mbtiIntro} ${b.text}` : b.text })),
  ];
  if (!["current-context", "next-cycle"].includes(id)) return result;
  if (!period.proof.sourceRefs.includes(`period-ten-god:${period.tenGod}`)
    || !period.proof.sourceRefs.some(ref => ref.startsWith("dayun-cycle:") && ref.endsWith(`:${period.ganji}`))) return result;
  // A shared everyday context permits an application question, NOT a claim
  // of strengthening, clashes, or causation between the two ten-gods.
  const root = packet.selected.find(m => m.evidence.length && m.evidence.every(e => e.usable)
    && natal.some(b => b.proof.features.includes(m.feature))
    && Object.values(TEN_GOD_SEMANTICS).some(s => s.label === materialLabel(m)));
  if (!root) return result;
  const entry = Object.entries(TEN_GOD_SEMANTICS).find(([, s]) => s.label === materialLabel(root));
  const transit = Object.values(TEN_GOD_SEMANTICS).find(s => s.label === period.tenGod)!;
  if (!entry) return result;
  const [god, natalMeaning] = entry;
  const common = ["money", "work", "learning"].find(context =>
    (natalMeaning.contexts as readonly string[]).includes(context) && (transit.contexts as readonly string[]).includes(context));
  if (!common) return result;
  const meaning = MAJOR_MEANINGS[period.tenGod];
  const question = common === "money" ? meaning.money : meaning.work;
  const focus = id === "next-cycle" ? "다음" : "현재";
  const advice = id === "next-cycle"
    ? `${natalMeaning.shadowMeaning} ${natalMeaning.label}의 기준 중 앞으로도 지켜갈 부분과 새로 시도할 부분을 나눠 적어보세요.`
    : `실제 선택 앞에서는 ${natalMeaning.label} 성향이 도움이 될 부분과 부담이 될 부분을 하나씩 짚어보세요.`;
  result.push(paragraph(`${id}-natal-application`,
    `타고난 ${natalMeaning.label}의 ‘${natalMeaning.easyMeaning}’이 자신의 모습과 맞는다면, ${focus} ${period.ganji} 대운에서는 ${withKoreanParticle(`‘${question}’`, "object")} 살필 때 그 기준을 써볼 수 있어요. ${advice}`,
    proof([root], [], [], [...period.proof.sourceRefs, `TEN_GOD_SEMANTICS:${god}`, "major-evidence-role:conditional-application"]), "direction"));
  return result;
}
