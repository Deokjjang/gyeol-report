import type { SupplementSemanticDefinition } from "./semanticCore";

export const RELATION_CONTENT_PRIORITY = {
  STRONG_SAMHAP_OR_MAJOR_HAP: 3, CHUNG: 3, HYEONG: 2.5, YUKHAP: 2, WONJIN: 2, HAE: 1.5, PA: 1.5, BANHAP: 1,
} as const;
const support = { kind: "DYNAMIC", tier: "SUPPORT", rawWeight: 0.5, stablePriority: 0,
  fortuneTags: {}, contexts: ["identity", "social", "work"] } as const;
export const RELATION_SEMANTICS = {
  STEM_HAP: { ...support, family: "RELATION_STEM_HAP", contentPriority: 3,
    axes: { ADAPTABILITY: 0.5, RELATION_STYLE: 0.5 }, dynamicTags: ["BINDING", "COORDINATION", "MUTUAL_PULL", "COMPROMISE"],
    easyMeaning: "서로 다른 두 힘이 그냥 지나치지 않고 붙어서 영향을 주고받는 관계입니다.",
    humanDescription: "자기 기준이 있어도 중요한 사람이나 일에서는 서로 맞출 자리를 찾으려는 모습으로 이어질 수 있습니다." },
  YUKHAP: { ...support, family: "RELATION_YUKHAP", contentPriority: 2, axes: {}, dynamicTags: ["PAIR_COHESION", "COOPERATION", "MUTUAL_ADJUSTMENT"],
    easyMeaning: "서로 다른 두 기운이 함께 움직일 접점을 만드는 관계입니다.",
    humanDescription: "완전히 같은 방식은 아니어도 서로 맞춰가며 함께 움직일 자리를 찾는 모습이 있습니다." },
  SAMHAP: { ...support, family: "RELATION_SAMHAP", contentPriority: 3, axes: {}, dynamicTags: ["STRONG_COHERENCE", "SHARED_DIRECTION", "ENERGY_CONCENTRATION"],
    easyMeaning: "여러 기운이 한 방향으로 힘을 모으는 구조입니다.", humanDescription: "서로 다른 부분이 따로 움직이기보다 한 방향으로 힘이 몰리는 모습이 있습니다." },
  BANHAP: { ...support, tier: "AMPLIFIER", rawWeight: 0.25, family: "RELATION_BANHAP", contentPriority: 1, axes: {}, dynamicTags: ["PARTIAL_COHERENCE", "POTENTIAL_COMMON_GROUND"],
    easyMeaning: "완전히 한 팀은 아니지만 함께 움직일 이유가 있는 두 기운입니다.", humanDescription: "모든 부분이 같은 것은 아니어도 함께 움직일 접점이 생기는 편입니다." },
  CHUNG: { ...support, family: "RELATION_CHUNG", contentPriority: 3, axes: { CHANGE_ORIENTATION: 0.5, ADAPTABILITY: 0.5 }, dynamicTags: ["CHANGE_PRESSURE", "DIRECT_CONFLICT", "REPOSITIONING", "MOVEMENT"],
    easyMeaning: "가만히 두면 편한 두 힘이 서로 다른 방향으로 부딪히는 구조입니다.", humanDescription: "한쪽을 고르면 다른 쪽이 다시 당겨서 변화나 방향 수정이 자주 생길 수 있습니다.",
    positiveMeaning: "기존 방식이 깨질 때 새로운 선택을 만들 수 있습니다.", shadowMeaning: "서로 다른 방향을 동시에 잡으려 하면 피로가 커질 수 있습니다." },
  HYEONG: { ...support, family: "RELATION_HYEONG", contentPriority: 2.5, axes: { DUTY: 0.5, PRECISION: 0.5 }, dynamicTags: ["INTERNAL_PRESSURE", "REPETITIVE_FRICTION", "SELF_DEMAND"],
    easyMeaning: "같은 문제를 쉽게 넘기지 못하고 계속 고치거나 압박을 느끼게 하는 구조입니다.", humanDescription: "한번 마음에 걸린 문제는 그냥 넘기기보다 계속 손보고 해결하려는 모습이 생길 수 있습니다.",
    positiveMeaning: "기준을 높이고 실력을 다듬는 쪽으로 쓰일 수 있습니다.", shadowMeaning: "자기 자신이나 주변을 계속 몰아붙일 수 있습니다." },
  PA: { ...support, tier: "AMPLIFIER", rawWeight: 0.25, family: "RELATION_PA", contentPriority: 1.5, axes: {}, dynamicTags: ["BREAK_AND_REBUILD", "PLAN_DISRUPTION", "MAINTENANCE_FRICTION"],
    easyMeaning: "이미 맞춰둔 것을 다시 뜯어고쳐야 하는 구조입니다.", humanDescription: "한번 정리한 일도 작은 문제 때문에 다시 손볼 일이 생기기 쉬운 모습입니다.",
    positiveMeaning: "오래된 방식에서 문제가 보이면 다시 고칠 수 있습니다.", shadowMeaning: "시작보다 유지하고 관리하는 과정에서 자잘한 수정이 반복될 수 있습니다." },
  HAE: { ...support, tier: "AMPLIFIER", rawWeight: 0.25, family: "RELATION_HAE", contentPriority: 1.5, axes: {}, dynamicTags: ["UNSPOKEN_MISMATCH", "EXPECTATION_GAP", "SUBTLE_HURT"],
    easyMeaning: "크게 부딪치기보다 작은 어긋남이나 서운함이 남기 쉬운 구조입니다.", humanDescription: "'이 정도는 알아줄 줄 알았는데' 같은 작은 기대 차이가 쌓일 수 있습니다.",
    positiveMeaning: "말을 정확하게 하면 큰 충돌이 되기 전에 풀 수 있는 문제로 남을 수 있습니다.", shadowMeaning: "대놓고 싸우지 않아도 작은 서운함이 오래 갈 수 있습니다." },
  WONJIN: { ...support, family: "RELATION_WONJIN", contentPriority: 2, axes: {}, dynamicTags: ["ATTRACTION_FRICTION", "LINGERING_EMOTION", "FIXATION", "RESENTMENT_LOOP"],
    easyMeaning: "신경이 쓰이기 때문에 더 자꾸 보게 되는 관계입니다.", humanDescription: "끌리거나 신경 쓰이는 만큼 작은 말과 행동도 더 크게 느낄 수 있습니다.",
    positiveMeaning: "관심과 감정이 쉽게 사라지지 않는 관계의 집중력으로 나타날 수 있습니다.", shadowMeaning: "좋아하거나 신경 쓸수록 사소한 일에도 예민해질 수 있습니다." },
} as const satisfies Record<string, SupplementSemanticDefinition>;
export type FoundationRelation = keyof typeof RELATION_SEMANTICS;
/** Registry support is not producer support. Cross-person/transit rules do not
 * establish natal facts. These five await a canonical natal result contract. */
export const RELATIONS_WITHOUT_NATAL_PRODUCER = ["SAMHAP", "BANHAP", "HYEONG", "PA", "HAE"] as const;
