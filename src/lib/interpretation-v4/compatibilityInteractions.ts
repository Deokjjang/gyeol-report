import { paragraph, proof, uniqueRefs, particle } from "./copyRealizer";
import { pairMove } from "./compatibilityCategoryCopy";
import type { PairEvidence } from "./compatibilityEvidence";
import type { PairCategory, PairPerson } from "./compatibilityNarrativeTypes";
import type { NarrativeProof } from "./narrativeTypes";

export const pairProof = (...sources: readonly NarrativeProof[]): NarrativeProof => ({ features: uniqueRefs(sources.flatMap(p => p.features)), seedIds: uniqueRefs(sources.flatMap(p => p.seedIds)), fusionIds: uniqueRefs(sources.flatMap(p => p.fusionIds)), sourceRefs: uniqueRefs(sources.flatMap(p => p.sourceRefs)) });

// These interpretations translate the EXISTING target-viewer ten-god result.
// They never infer it from MBTI, input order or a score.
const godEffects: Record<string, string> = {
  비견: "자기 의견을 더 또렷하게 꺼내게 합니다", 겁재: "가만있기보다 같이 도전하고 싶은 마음을 건드립니다",
  식신: "긴장을 풀고 직접 해보는 즐거움을 끌어냅니다", 상관: "그동안 삼켰던 의견과 다른 방법을 꺼내게 합니다",
  편재: "새로운 경험과 실제로 얻을 결과를 함께 생각하게 합니다", 정재: "시간과 돈을 어디에 쓰는지 더 구체적으로 보게 합니다",
  편관: "안주하던 기준에 긴장을 주고 더 잘하고 싶게 만듭니다", 정관: "약속과 책임을 한 번 더 의식하게 합니다",
  편인: "당연하게 알던 것에도 다시 이유를 묻게 합니다", 정인: "모르는 것을 물어보고 도움을 받아도 된다는 여유를 줍니다",
};
export function compatibilityDirectionBlock(e: PairEvidence, subject: PairPerson, target: PairPerson, slot: "aToB" | "bToA") {
  const d = e.directions[slot], S = `${subject.name}님`, T = `${target.name}님`, m = pairMove(target), category = e.category;
  const effect = godEffects[d.receivedTenGod?.tenGodKo ?? ""] ?? "평소와 다른 관점을 만나게 합니다";
  const contexts: Record<PairCategory, string> = {
    love: `${S}과 데이트하면 ${T}은 평소 혼자 고를 때와 다른 선택을 해보게 됩니다. ${S}의 존재가 ${T}에게 ${effect}. 마음이 움직여도 ${T}에게는 ${particle(m.want, "이", "가")} 남아 있어야 만남이 즐겁습니다.`,
    marriage: `함께 사는 동안 ${S}의 생활 습관은 ${T}에게 ${effect}. ${subject.style === "steady" ? `공동 지출을 정할 때 ${T}이 원하는 ${m.want}까지 남겨두면, 꼼꼼함이 간섭보다 든든함으로 전달됩니다.` : `주말을 준비하며 ${T}에게 중요한 ${particle(m.want, "을", "를")} 놓치지 않는 ${S}의 선택이 생활에 다른 즐거움을 넣어줍니다.`}`,
    parentChild: slot === "aToB" ? `부모 ${S}의 반응은 자녀 ${T}에게 ${effect}. 자녀가 요즘의 고민을 꺼낼 때 ${m.want}까지 지켜주면, 걱정할까 봐 숨기는 대신 생각한 것을 말할 여지가 생깁니다.` : `자녀 ${S}의 반응은 부모 ${T}에게 ${effect}. 부모에게도 ${particle(m.want, "이", "가")} 중요하지만, 그 마음을 자녀가 모두 채워줄 의무는 없습니다. 자녀의 대답을 기다리는 순간은 부모가 자신의 익숙한 방법도 돌아보는 시간이 됩니다.`,
    coworker: `${S}의 질문은 ${T}에게 ${effect}. 자료를 함께 고치는 자리에서 ${T}에게 ${particle(m.want, "이", "가")} 확보되면, ${S}의 지적도 방어할 말보다 고칠 곳을 발견하는 기회가 됩니다.`,
    managerReport: slot === "aToB" ? `상사 ${S}의 지시는 팀원 ${T}에게 ${effect}. 새 일을 맡길 때 ${T}에게 필요한 ${particle(m.want, "을", "를")} 실제로 허용하면, 좋은 인상을 남기는 데만 쓰던 신경이 일 자체로 돌아옵니다.` : `팀원 ${S}이 가져온 보고는 상사 ${T}에게 ${effect}. ${T}에게 필요한 ${particle(m.want, "을", "를")} 염두에 두고 결정이 필요한 대목을 짚으면, 보고가 변명처럼 들리지 않고 함께 판단할 자료가 됩니다.`,
    businessPartner: `${S}이 내놓는 제안은 ${T}에게 ${effect}. ${subject.style === "steady" ? `약속의 조건을 하나씩 확인하는 태도는 ${T}에게 느리게 보여도 손해를 막는 질문이 됩니다. ${T}의 ${m.want}까지 들으면 확인과 반대의 차이를 서로 알 수 있습니다.` : `새 계약에서 ${T}에게 중요한 ${particle(m.want, "을", "를")} ${S}이 먼저 남겨두면, 둘의 동의가 같은 뜻인지 확인하기 쉽습니다.`}`,
    friendship: `${S}과 취미를 나누는 경험은 ${T}에게 ${effect}. ${T}이 바라는 ${particle(m.want, "을", "를")} ${S}이 존중하면, 친구의 새 관심사도 부담 없이 만나기 쉬워집니다.`,
  };
  const refs = [`compatibilityRelationRules:getCrossTenGodRelation:${d.relationId}:${d.receivedTenGod?.tenGod}`, `target-viewer:${target.personId}`];
  return { subjectPerson: subject.personId, targetPerson: target.personId, receivedTenGod: d.receivedTenGod,
    block: paragraph(slot, contexts[category], pairProof(subject.proof, target.proof, proof([], [], [], refs)), "positive", `influence-${subject.personId}`) };
}

/** Pair DB details remain internal with both source viewpoints. A missing entry
 * has no synthetic pair label, grade, repair claim or default "perfect pair". */
export function compatibilityPairBasis(e: PairEvidence) {
  return [e.directions.aToB, e.directions.bToA].flatMap(d => d.mbtiPair ? [{
    sourceType: d.mbtiPair.sourceType, targetType: d.mbtiPair.targetType, sourceCoverage: d.mbtiPair.sourceCoverage,
    sharedGround: d.mbtiPair.sharedGround, friction: d.mbtiPair.friction, positiveInfluence: d.mbtiPair.positiveInfluence,
    lovePattern: d.mbtiPair.lovePattern, marriagePattern: d.mbtiPair.marriagePattern, repairStrategy: d.mbtiPair.repairStrategy,
    sourceRef: `docs/product/mbti/source/${d.mbtiPair.sourceType}.json:relationshipHints:notablePairs:${d.mbtiPair.targetType}`,
  }] : []);
}

export function compatibilityPairScene(e: PairEvidence, a: PairPerson, b: PairPerson) {
  const basis = compatibilityPairBasis(e);
  if (!basis.length) return null;
  const types = [a.mbti, b.mbti].sort().join(":"), A = `${a.name}님`, B = `${b.name}님`;
  const context: Record<PairCategory, string> = {
    love: "호감을 보여주고 받아들이는 순간", marriage: "집안의 일정과 돈을 같이 정하는 순간", parentChild: "해야 할 일과 해보고 싶은 일을 나누는 순간",
    coworker: "회의에서 서로의 초안을 펼쳐놓는 순간", managerReport: "새 일을 맡기고 중간 소식을 받는 순간", businessPartner: "고객과 한 약속을 실제로 지켜야 하는 순간", friendship: "오랜만에 만나 서로의 근황을 듣는 순간",
  };
  const name = (type: string) => a.mbti === type ? A : B;
  // Curated semantic routes require the actual DB row and both per-person
  // portraits. No regex classification of source copy or invented pair facts.
  const interpretations: Record<string, string> = {
    "ESFJ:INTP": `${name("INTP")}은 생각이 끝나야 말이 나오고, ${name("ESFJ")}은 반응이 와야 마음이 놓입니다. 조용히 들었다는 사실이 관심의 증거인 사람과, 들었다는 표시가 관심의 증거인 사람이 만난 셈입니다. ${name("INTP")}의 차분한 판단은 감정에 휩쓸린 날 도움이 되고, ${name("ESFJ")}의 반응은 혼자 머릿속에 있던 이야기를 밖으로 데려옵니다.`,
    "ENFP:ISTJ": `${name("ISTJ")}은 정한 일을 지키며 믿음을 쌓고, ${name("ENFP")}은 같이 해볼 것을 늘리며 마음을 보여줍니다. ‘또 바뀌었어?’와 ‘이것도 해보면 좋잖아’ 사이에 두 사람의 재미와 마찰이 함께 있습니다. ${name("ISTJ")}이 새로움을 전부 막지 않고 ${name("ENFP")}이 마무리를 떠넘기지 않으면, 생각만 했던 즐거움이 실제 하루가 됩니다.`,
    "ENTP:ISFJ": `${name("ISFJ")}은 빠뜨린 것을 챙기고, ${name("ENTP")}은 왜 그렇게 해야 하는지 묻습니다. 질문이 많다고 성의가 없는 것은 아니고, 준비를 챙긴다고 재미를 모르는 것도 아닙니다. ${name("ISFJ")}의 든든함과 ${name("ENTP")}의 다른 발상이 만나면, 익숙한 방식 밖에서도 안전하게 시도해볼 여지가 생깁니다.`,
    "ENTJ:INTP": `${name("ENTJ")}은 쓸 수 있는 답을 빨리 원하고, ${name("INTP")}은 그 답이 왜 맞는지 더 확인하고 싶어 합니다. 답을 늦추는 질문처럼 보여도 한번 짚고 나면 나중에 다시 할 일이 줄어듭니다. ${name("ENTJ")}이 방향을 잡고 ${name("INTP")}이 빈 곳을 찾는 힘을 서로의 공으로 인정하면, 생각과 실행이 따로 놀지 않습니다.`,
    "ESTP:INFJ": `${name("INFJ")}은 눈앞의 일 너머에 남을 영향을 보고, ${name("ESTP")}은 지금 바꿀 수 있는 것을 먼저 봅니다. 오래 생각한 계획도 실제 반응 앞에서는 달라질 수 있고, 빠른 행동에도 오래 갈 이유가 필요합니다. ${name("INFJ")}의 긴 시야와 ${name("ESTP")}의 현장감은 서로를 답답한 사람으로 정해버리지 않을 때 함께 힘을 냅니다.`,
    "ENTJ:ISTJ": `${name("ENTJ")}은 더 크게 만들 일을 보고, ${name("ISTJ")}은 지금 약속을 지킬 방법부터 봅니다. ${name("ENTJ")}에게 작은 확인이 답답해도 ${name("ISTJ")}에게는 무너지지 않게 쌓는 일입니다. 성과를 원한다는 공통점이 있어, 확장과 마무리를 서로의 발목이 아니라 맡길 수 있는 역할로 나누면 좋습니다.`,
    "ENFP:ISFP": `${name("ISFP")}은 직접 좋았던 경험과 취향을 소중히 여기고, ${name("ENFP")}은 거기서 다음 이야기를 발견합니다. 마음에 드는 것을 설명할 때 놀림받지 않는다는 감각이 둘을 편하게 만듭니다. ${name("ENFP")}의 많은 제안 중 ${name("ISFP")}이 정말 좋아하는 것을 고를 수 있으면, 밝은 만남 안에서도 각자의 색이 남습니다.`,
    "INFJ:ISTP": `${name("INFJ")}은 한마디 안에 담긴 뜻을 오래 보고, ${name("ISTP")}은 실제로 해준 일을 더 분명한 표현으로 봅니다. ${name("INFJ")}이 기다린 말이 없는데 ${name("ISTP")}은 이미 충분히 도왔다고 생각할 수 있습니다. 말의 깊이와 행동의 담백함을 함께 알아볼 때, 과장하지 않아도 서로에게 필요한 사람이 됩니다.`,
  };
  const text = interpretations[types];
  if (!text) return null; // Unreviewed pair prose stays held, not fabricated.
  return { block: paragraph("pair-dialogue", `${context[e.category]}에 ${A}과 ${B}의 차이가 더 또렷해집니다. ${text}`,
    pairProof(a.proof, b.proof, proof([], [], [], basis.map(p => p.sourceRef))), "positive", "pair-dialogue"), basis };
}
