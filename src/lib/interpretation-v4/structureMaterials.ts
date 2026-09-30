import type { Material, SemanticTag } from "./types";
import type { StructureId } from "./structureTypes";
import { STRUCTURE_RULES } from "./structureRules";

export type StructureMaterial = {
  readonly identity: string;
  readonly strengths: string;
  readonly weaknesses: string;
  readonly workMoney: string;
  readonly loveRelationships: string;
  readonly successFortune: string;
  readonly imagery: string;
  readonly tags: readonly SemanticTag[];
};
export const STRUCTURE_MATERIALS: Readonly<Record<StructureId, StructureMaterial>> = {
  wealthHeavyWeakDaymaster: {
    identity: "돈과 현실적인 결과를 크게 의식하는데, 그만큼 스스로를 몰아붙이기 쉬운 구조입니다.",
    strengths: "돈과 현실을 보는 눈이 빠릅니다. 작은 기회보다 실제로 남는 결과를 중요하게 생각합니다.",
    weaknesses: "하고 싶은 일은 많은데 쉴 틈은 자꾸 뒤로 밀립니다. 쉬는 날에도 다음 일을 생각하기 쉽습니다.",
    workMoney: "남는 게 없는 일에는 금방 예민해집니다. 잘 벌 기회를 보는 눈과 혼자 전부 맡는 습관은 나눠볼 필요가 있습니다.",
    loveRelationships: "좋아하면 현실적으로 챙기려 합니다. 다만 해결할 일을 자꾸 떠안으면 함께 있는 시간이 숙제처럼 느껴질 때가 있습니다.",
    successFortune: "현실 성과를 향한 욕심이 분명합니다. 사람과 시간을 잘 나눠 쓰면 내 손 하나보다 큰 일을 남길 여지가 있습니다.",
    imagery: "넓은 밭을 보고 어디부터 거둘지 빠르게 알아보는 사람", tags: ["wealth"],
  },
  outputCreatesWealth: {
    identity: "생각만 해두기보다 만들어서 쓸모를 확인하는 사람입니다.", strengths: "잘하는 것을 남이 원하는 결과로 바꾸는 재주가 있습니다.",
    weaknesses: "재미있던 일도 자꾸 돈이 될지 계산하면 피곤해집니다.", workMoney: "내가 만든 것에 누가 값을 내는지 감이 붙습니다. 기술과 표현이 돈으로 이어지는 좋은 연결입니다.",
    loveRelationships: "좋아한다는 마음을 작은 선물이나 직접 해준 일로 보여주는 편입니다.", successFortune: "솜씨가 결과와 돈으로 이어지는 좋은 패가 있습니다.", imagery: "내 손으로 만든 것이 누군가의 생활에 들어가는 모습", tags: ["wealth", "expression"],
  },
  wealthCreatesOfficer: {
    identity: "결과를 내는 데서 끝나지 않고 그에 맞는 자리도 원합니다.", strengths: "돈과 자원을 맡은 일의 신뢰로 바꿀 줄 압니다.",
    weaknesses: "잘해낸 만큼 책임이 늘어나는 걸 당연하게 받아들이기 쉽습니다.", workMoney: "성과를 내고 나면 다음에는 결정까지 맡고 싶어집니다. 내 몫과 내 역할이 함께 커질 때 보람이 큽니다.",
    loveRelationships: "믿을 만한 사람이 되고 싶어 약속을 가볍게 하지 않습니다. 대신 마음까지 의무처럼 챙기면 딱딱해집니다.",
    successFortune: "현실 성과가 신뢰와 자리로 이어지는 좋은 흐름이 있습니다.", imagery: "채운 곳간이 마을에서 맡는 역할까지 키우는 모습", tags: ["wealth", "status", "consistency"],
  },
  officerResourceFlow: {
    identity: "맡은 일이 생기면 아는 것부터 더 단단하게 만듭니다.", strengths: "기준을 익히고 자기 실력으로 바꾸는 힘이 있습니다.",
    weaknesses: "모르면 물어보면 되는데 혼자 완벽히 알아야 한다고 느끼기 쉽습니다.", workMoney: "책임이 공부의 이유가 되고, 배운 것이 다시 판단을 받쳐줍니다. 오래 맡길 수 있는 사람이라는 신뢰가 남습니다.",
    loveRelationships: "상대를 이해하려고 이유를 오래 생각합니다. 가끔은 분석보다 한 번의 따뜻한 반응이 더 잘 닿습니다.",
    successFortune: "배움과 신뢰가 서로를 키우는 좋은 패가 있습니다.", imagery: "맡은 자리 아래에 책과 경험이 층층이 쌓이는 모습", tags: ["learning", "consistency", "help"],
  },
  killingResourceFlow: {
    identity: "어려운 일이 닥치면 이유를 파고들며 내 것으로 만들려 합니다.", strengths: "압박을 그냥 참는 데서 끝내지 않고 배움으로 바꾸는 힘이 있습니다.",
    weaknesses: "힘든 일까지 전부 성장 기회로 삼으려 하면 쉬는 때를 놓칩니다.", workMoney: "낯선 문제를 맡고 공부하며 자기 무기를 늘립니다. 처음엔 버거웠던 일이 나중에는 전문성이 되는 흐름입니다.",
    loveRelationships: "상대가 힘들어하면 방법을 찾아주고 싶습니다. 답을 찾는 동안 마음을 같이 들어주는 일도 남아 있습니다.",
    successFortune: "어려운 경험을 실력으로 바꾸는 좋은 연결이 있습니다.", imagery: "거친 돌을 깎으며 자기 손에 맞는 도구를 만드는 모습", tags: ["inquiry", "learning"],
  },
  hurtingOfficerMeetsOfficer: {
    identity: "틀린 걸 보면 그냥 넘기지 못합니다.", strengths: "문제의 빈틈을 보고 고치는 능력이 좋습니다.",
    weaknesses: "윗사람에게도 그대로 말해서 부딪힐 수 있습니다. 맞는 말과 잘 닿는 말이 항상 같지는 않습니다.",
    workMoney: "말이 안 되는 규칙이 제일 답답합니다. 문제를 바꾸는 힘은 있지만 누가 듣는지도 함께 보면 손해가 줄어듭니다.",
    loveRelationships: "서운한 일을 이야기하다가 어느새 누가 맞는지 따지고 있을 때가 있습니다.",
    successFortune: "오래된 불편을 그냥 두지 않는 힘이 있습니다. 비판이 실제 개선으로 이어질 때 존재감이 살아납니다.", imagery: "삐뚤어진 울타리를 발견하고 바로 고치려는 손", tags: ["precision", "experimentation"],
  },
  mixedOfficers: {
    identity: "차근차근 지키려는 마음과 빨리 끝내려는 긴장이 같이 있습니다.", strengths: "평소의 기준과 급한 순간의 압박을 둘 다 알아챕니다.",
    weaknesses: "나에게 요구하는 기준이 두 개라 스스로도 피곤할 때가 있습니다.", workMoney: "정해진 방식대로 하라면서 결과는 빨리 내라는 상황에 특히 예민합니다. 역할의 기준이 분명할수록 힘을 모으기 좋습니다.",
    loveRelationships: "든든하게 책임지고 싶다가도 자꾸 재촉하는 사람이 될 수 있습니다.", successFortune: "책임의 무게를 가볍게 보지 않습니다. 서로 다른 요구를 가려낼 때 판단력이 살아납니다.",
    imagery: "서로 다른 속도의 북소리를 들으며 보폭을 정하는 사람", tags: ["consistency", "leadership"],
  },
  peerHeavy: {
    identity: "내가 납득해야 움직입니다.", strengths: "자기 기준과 버티는 힘이 분명합니다.", weaknesses: "고집이 센 편입니다. 남의 도움도 간섭처럼 들릴 때가 있습니다.",
    workMoney: "남이 정한 방식보다 직접 해볼 때 힘이 납니다. 경쟁 상대가 보이면 관심 없던 일에도 욕심이 붙습니다.", loveRelationships: "가까운 사람이어도 내 선택을 존중해주길 바랍니다.",
    successFortune: "내 힘으로 시작하고 버티는 좋은 자원이 있습니다.", imagery: "자기 자리에서 단단히 뿌리내린 나무", tags: ["autonomy", "leadership"],
  },
  outputHeavy: {
    identity: "생각이 나면 말이나 손이 먼저 움직입니다.", strengths: "아이디어를 밖으로 꺼내는 힘이 큽니다.", weaknesses: "하고 싶은 말을 다 하면 상대가 따라오는 속도를 놓칩니다.",
    workMoney: "직접 만든 결과가 있어야 속이 시원합니다. 보여줄 솜씨가 분명한 사람입니다.", loveRelationships: "좋아하면 나누고 보여주고 싶습니다. 말이 많은 날이 관심이 많은 날일 때도 있습니다.",
    successFortune: "자기 색을 밖으로 보여주는 표현의 좋은 패입니다.", imagery: "가만히 담아두기보다 흘려보내는 샘", tags: ["expression"],
  },
  wealthHeavy: {
    identity: "그래서 실제로 뭐가 남는지 먼저 봅니다.", strengths: "돈과 시간의 쓰임을 빨리 알아봅니다.", weaknesses: "쉬는 시간까지 쓸모를 따지면 쉬어도 쉰 것 같지 않습니다.",
    workMoney: "일을 벌이는 것보다 결과를 챙기는 감각이 선명합니다. 새는 돈과 놓친 기회가 눈에 잘 들어옵니다.", loveRelationships: "말뿐인 약속보다 실제로 시간을 내주는 사람에게 마음이 갑니다.",
    successFortune: "현실의 기회를 결과로 남기는 좋은 자원이 있습니다. 큰 부를 보장하는 뜻은 아닙니다.", imagery: "흩어진 열매를 모아 자기 바구니에 담는 모습", tags: ["wealth", "accumulation"],
  },
  officerHeavy: {
    identity: "누가 맡아야 할 일이 비어 있으면 그냥 지나치기 어렵습니다.", strengths: "책임과 기준을 붙잡는 힘이 있습니다.", weaknesses: "아직 일어나지도 않은 평가를 미리 걱정할 때가 있습니다.",
    workMoney: "믿고 맡길 사람이라는 인상을 줍니다. 다만 늘 맡는 쪽이 되면 보상보다 책임이 먼저 늘 수 있습니다.", loveRelationships: "가볍게 대하지 않지만 함께 쉬는 시간에도 잘하려고 애쓸 수 있습니다.",
    successFortune: "맡은 역할에서 신뢰를 쌓아갈 힘이 있습니다.", imagery: "사람들이 기대는 문기둥", tags: ["leadership", "consistency", "status"],
  },
  resourceHeavy: {
    identity: "이유를 알아야 마음이 놓입니다.", strengths: "배우고 기억하고 다시 정리하는 힘이 큽니다.", weaknesses: "준비가 더 필요하다는 생각으로 시작을 미룰 때가 있습니다.",
    workMoney: "당장 써먹을 답뿐 아니라 오래 쓸 지식도 챙깁니다. 쌓인 경험이 판단의 바탕이 됩니다.", loveRelationships: "상대의 사정을 오래 생각해줍니다. 말하지 않은 마음까지 혼자 추측하느라 지치지는 않는지 볼 필요가 있습니다.",
    successFortune: "배움과 도움을 내 자원으로 쌓는 좋은 패가 있습니다.", imagery: "필요할 때 꺼내 쓰는 넓은 서재", tags: ["learning", "inquiry", "help"],
  },
  noResource: {
    identity: "익숙한 설명을 오래 기다리기보다 직접 겪으며 감을 잡는 통로를 살펴볼 수 있습니다.", strengths: "배우는 힘이 없다는 뜻은 아닙니다. 경험도 충분히 내 공부가 됩니다.",
    weaknesses: "인성 신호의 부재만으로 성격의 약점이나 가족 관계를 정하지 않습니다.", workMoney: "공부와 일의 방식은 실제 십성·MBTI의 다른 근거와 함께 읽습니다.",
    loveRelationships: "이 표식 하나로 돌봄이나 애정이 부족하다고 말하지 않습니다.", successFortune: "인성이 없다는 이유로 배움과 성취의 가능성을 닫지 않습니다.", imagery: "책 말고도 열려 있는 배움의 문", tags: [],
  },
  noOutput: {
    identity: "표현이 나오는 다른 통로를 함께 살펴볼 자리입니다.", strengths: "말이나 창작 능력이 없다는 뜻은 아닙니다. 익숙한 사람과 관심사가 표현의 문을 열기도 합니다.",
    weaknesses: "식상 신호의 부재만으로 말솜씨나 인간관계의 약점을 정하지 않습니다.", workMoney: "결과를 만드는 방식은 실제 재성·관성·MBTI 근거와 함께 읽습니다.",
    loveRelationships: "식상이 없다는 이유로 사랑을 표현하지 못한다고 말하지 않습니다.", successFortune: "보이지 않는 한 가지 신호가 재능 전체를 정하지 않습니다.", imagery: "아직 고르지 않은 표현의 출구", tags: [],
  },
};

export const STRUCTURE_REGISTRY: readonly Material[] = STRUCTURE_RULES.map(rule => {
  const m = STRUCTURE_MATERIALS[rule.id];
  return { feature: `v4_structure:${rule.id}`, label: rule.label, semanticTags: m.tags,
    positiveMeaning: m.strengths, shadowMeaning: m.weaknesses, imagery: m.imagery,
    domains: ["identity", "strengths", "weaknesses", "work", "money", "love", "marriage", "relationships", "study", "success/fortune"],
    evidenceStrength: "none", sourceRefs: [`v4:structure-rule:${rule.id}`, `v4:structure-material:${rule.id}`] };
});
