import type { SupplementSemanticDefinition } from "./semanticCore";

const amplifier = { tier: "AMPLIFIER", rawWeight: 0.5, contentPriority: 0, axes: {}, dynamicTags: [], fortuneTags: {},
  contexts: ["identity", "social", "work"] } as const;
export const SHINSAL_SEMANTICS = {
  CHEONEUL: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "천을귀인", family: "HELPER", stablePriority: 20, fortuneTags: { HELPER_LUCK: 2, RELATION_RESOURCE: 1 },
    easyMeaning: "막혔을 때 사람을 통해 도움이나 길이 생길 수 있는 좋은 신호입니다.", humanDescription: "혼자 해결되지 않는 순간에 사람의 도움이나 연결이 중요한 역할을 할 수 있습니다.", positiveMeaning: "좋은 인연과 도움을 받을 가능성을 보조합니다." },
  CHEONDEOK: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "천덕귀인", family: "HELPER_SOFTENING", stablePriority: 20, fortuneTags: { CONFLICT_SOFTENING: 1, RECOVERY: 1 },
    easyMeaning: "거친 상황이 생겨도 조금 부드럽게 풀어갈 여지를 보태는 좋은 신호입니다.", humanDescription: "문제가 생겨도 너무 거칠게 끝내기보다 풀어갈 방법을 찾는 쪽을 보조합니다." },
  WOLDEOK: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "월덕귀인", family: "HELPER_SOFTENING", stablePriority: 10, axes: { SOCIAL_ATTUNEMENT: 0.5 }, fortuneTags: { RELATION_SOFTENING: 1 },
    easyMeaning: "사람 사이의 어려운 일을 너무 거칠게 끝내지 않도록 돕는 신호로 봅니다.", humanDescription: "관계에서 문제가 생겨도 완전히 끊기보다 풀 수 있는 길을 찾는 쪽을 보조합니다." },
  TAEGEUK: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "태극귀인", family: "INSIGHT", stablePriority: 20, axes: { PATTERN_SENSE: 1, MEANING: 1, DEPTH: 0.5 }, fortuneTags: { INSIGHT: 1 },
    easyMeaning: "복잡한 상황에서도 중요한 의미와 중심을 다시 찾는 데 도움을 주는 신호입니다.", humanDescription: "복잡한 일을 그냥 넘기기보다 그 안에서 중요한 의미가 무엇인지 다시 찾아보는 쪽을 보조합니다." },
  MUNCHANG: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "문창귀인", family: "LEARNING_WRITING", stablePriority: 20, axes: { LEARNING: 1, EXPRESSION: 1, CREATION: 1 }, fortuneTags: { WRITING_EXPRESSION: 1 },
    easyMeaning: "배운 것을 글과 말로 정리해 보여주는 재주를 보조하는 신호입니다.", humanDescription: "알게 된 것을 글이나 말로 정리해서 다른 사람에게 보여주는 데 도움을 주는 기운입니다." },
  HAKDANG: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "학당귀인", family: "LEARNING_WRITING", stablePriority: 10, axes: { LEARNING: 2, DEPTH: 0.5, PERSISTENCE: 0.5 }, fortuneTags: { LEARNING_SUPPORT: 1 },
    easyMeaning: "배우고 익혀 자기 것으로 만드는 데 도움을 주는 신호입니다.", humanDescription: "새로운 것을 배우고 오래 익혀 자기 실력으로 만드는 쪽을 보조합니다." },
  JAEGO: { ...amplifier, sourceType: "gwiin", kind: "FORTUNE", label: "재고귀인", family: "ACCUMULATION", stablePriority: 20, axes: { RESOURCE_SENSE: 1, STABILITY: 1 }, fortuneTags: { ACCUMULATION: 1 },
    easyMeaning: "얻은 돈이나 경험을 다음에도 쓸 수 있게 남기는 쪽을 보조하는 신호입니다.", humanDescription: "한번 얻은 돈, 기술, 경험을 그냥 쓰고 끝내기보다 다음에 다시 쓸 밑천으로 남기려는 쪽을 보조합니다." },
  JANGSEONG: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "장성살", family: "LEADERSHIP_POSITION", stablePriority: 20, axes: { LEADERSHIP: 1, STATUS_DRIVE: 1, INITIATIVE: 0.5 }, fortuneTags: { VISIBLE_AUTHORITY: 1 }, dynamicTags: ["LEADERSHIP"], image: "깃발을 들고 앞에 선 장수",
    easyMeaning: "사람들이 망설일 때 앞에 서서 방향을 잡는 기운입니다.", humanDescription: "상황이 필요하면 뒤에 머무르기보다 앞에서 방향을 잡는 쪽을 보조합니다." },
  BANAN: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "반안살", family: "LEADERSHIP_POSITION", stablePriority: 10, axes: { STATUS_DRIVE: 1, STABILITY: 1, DUTY: 0.5 }, fortuneTags: { POSITION: 1, RECOGNITION: 1 }, dynamicTags: ["POSITION"], image: "말 안장에 올라 자기 자리를 잡는 모습",
    easyMeaning: "잘하는 데서 끝나지 않고 책임 있는 자리에서 인정받고 싶은 기운입니다.", humanDescription: "실력을 보여주는 데서 끝나지 않고 더 높은 책임과 인정을 얻고 싶어 하는 쪽을 보조합니다." },
  YEOKMA: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "역마살", family: "MOVEMENT", stablePriority: 20, axes: { CHANGE_ORIENTATION: 1, ADAPTABILITY: 1, OPPORTUNITY_SENSE: 1 }, fortuneTags: { MOVEMENT_OPPORTUNITY: 1 }, dynamicTags: ["MOVEMENT"],
    easyMeaning: "움직이면서 새로운 길과 기회를 발견하는 기운입니다.", humanDescription: "익숙한 자리에만 있기보다 사람, 장소, 환경이 바뀔 때 새로운 기회를 발견하는 쪽을 보조합니다." },
  JISAL: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "지살", family: "MOVEMENT", stablePriority: 10, rawWeight: 0.25, axes: { CHANGE_ORIENTATION: 0.5, OPPORTUNITY_SENSE: 0.5 }, dynamicTags: ["LOCAL_MOVEMENT"],
    easyMeaning: "익숙한 자리 밖으로 움직일 때 새로운 것을 보기 쉬운 기운입니다.", humanDescription: "한곳에만 있기보다 움직이면서 새로운 정보와 기회를 얻는 쪽을 조금 보조합니다." },
  DOHWA: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "도화살", family: "VISIBILITY", stablePriority: 20, axes: { CHARISMA: 1, SOCIAL_ATTUNEMENT: 0.5, EXPRESSION: 0.5 }, fortuneTags: { FIRST_IMPRESSION: 1, SOCIAL_VISIBILITY: 1 },
    easyMeaning: "처음 만났을 때 사람 눈에 들어오는 매력을 보조하는 기운입니다.", humanDescription: "처음 만나는 자리에서 말투나 분위기, 인상으로 기억되기 쉬운 쪽을 보조합니다." },
  NYEON: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "년살", family: "VISIBILITY", stablePriority: 10, rawWeight: 0.25, axes: { CHARISMA: 0.5 }, fortuneTags: { SOCIAL_VISIBILITY: 1 }, dynamicTags: ["VISIBILITY"],
    easyMeaning: "사람 눈에 띄고 보이기 쉬운 기운입니다.", humanDescription: "여럿이 있는 자리에서 내 행동이나 분위기가 눈에 들어오는 쪽을 조금 보조합니다." },
  HONGYEOM: { ...amplifier, sourceType: "shinsal", kind: "FORTUNE", label: "홍염살", family: "INTIMATE_CHARM", stablePriority: 20, axes: { CHARISMA: 1, SOCIAL_ATTUNEMENT: 1 }, contexts: ["love", "social"], fortuneTags: { INTIMATE_CHARM: 1 },
    easyMeaning: "처음보다 가까워졌을 때 더 살아나는 매력을 보조하는 기운입니다.", humanDescription: "처음보다 친해지고 가까워질수록 매력이 더 잘 보이는 쪽을 보조합니다." },
  HYEONCHIM: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "현침살", family: "PRECISION", stablePriority: 20, axes: { PRECISION: 2, COMMUNICATION_STYLE: 0.5 }, image: "바늘처럼 작은 틈을 찌르는 눈",
    easyMeaning: "작은 오류와 빠진 조건을 먼저 알아차리는 눈을 보조하는 기운입니다.", humanDescription: "남들이 그냥 넘어가는 작은 틀림이나 빠진 부분이 먼저 눈에 들어오는 쪽을 보조합니다.", positiveMeaning: "작은 오류를 빨리 찾는 데 도움이 됩니다.", shadowMeaning: "문제뿐 아니라 사람의 말까지 날카롭게 볼 수 있습니다." },
  GWIMUN: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "귀문관살", family: "DEEP_SENSITIVITY", stablePriority: 20, axes: { DEPTH: 1, PATTERN_SENSE: 1, CURIOSITY: 1 }, riskTags: ["RUMINATION", "FIXATION"],
    easyMeaning: "이상한 점 하나가 걸리면 그냥 넘기지 않고 오래 들여다보는 쪽을 보조하는 기운입니다.", humanDescription: "남들이 지나간 작은 이상함도 마음에 걸리면 이유를 찾을 때까지 오래 생각할 수 있습니다." },
  HWAGAE: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "화개살", family: "DEEP_SENSITIVITY", stablePriority: 10, axes: { ENERGY_DIRECTION: -0.5, DEPTH: 1, CREATION: 1, MEANING: 1 }, dynamicTags: ["DEPTH_SOLITUDE"], image: "혼자 깊게 들어가는 방",
    easyMeaning: "사람들과 떨어져 혼자 깊게 생각하고 만드는 시간을 보조하는 기운입니다.", humanDescription: "사람들과 잘 지내더라도 혼자 생각하거나 만들 시간이 꼭 필요할 수 있습니다." },
  YANGIN: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "양인살", family: "BOUNDARY_FORCE", stablePriority: 20, axes: { RISK_STYLE: 0.5, BOUNDARY: 1, INITIATIVE: 1, AUTONOMY: 1 },
    easyMeaning: "내 선을 강하게 지키고 필요할 때 밀고 나가는 기운입니다.", humanDescription: "중요한 문제에서는 쉽게 물러나기보다 자기 기준을 지키려는 쪽을 보조합니다.", shadowMeaning: "강하게 쓰이면 고집이나 강경함으로 보일 수 있습니다." },
  GONGMANG: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "공망", family: "EMPTY_REINTERPRET", stablePriority: 20, dynamicTags: ["EMPTY_SLOT", "REINTERPRETATION", "LOOSENED_ATTACHMENT"],
    easyMeaning: "기대한 자리가 그대로 채워지지 않아 다른 방법을 다시 찾게 만드는 흐름입니다.", humanDescription: "처음 기대한 방식이 그대로 맞지 않을 때 다른 답과 방법을 다시 찾는 경험으로 이어질 수 있습니다." },
  GOSIN: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "고신살", family: "SOLITUDE", stablePriority: 20, axes: { RELATION_STYLE: -0.5, RECOVERY_NEED: 0.5, AUTONOMY: 0.5 },
    easyMeaning: "가까운 사람이 있어도 혼자 정리할 공간이 필요한 쪽을 보조하는 기운입니다.", humanDescription: "사람과 가까워도 혼자 생각하고 정리할 시간이 있어야 편할 수 있습니다." },
  GWASUK: { ...amplifier, sourceType: "shinsal", kind: "TRAIT", label: "과숙살", family: "SOLITUDE", stablePriority: 10, axes: { RELATION_STYLE: -0.5, RECOVERY_NEED: 0.5, AUTONOMY: 0.5 },
    easyMeaning: "관계가 있어도 자기 안에서 감정과 생각을 정리할 시간이 필요한 쪽을 보조하는 기운입니다.", humanDescription: "가까운 사람에게도 모든 생각을 바로 보여주기보다 혼자 정리한 뒤 말하고 싶어 할 수 있습니다." },
  GEOP: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "겁살", family: "TIMING_COMPETITION", stablePriority: 0, rawWeight: 0.25, axes: { COMPETITION: 0.5 }, dynamicTags: ["COMPETITIVE_PRESSURE"],
    easyMeaning: "갑자기 경쟁하거나 먼저 잡아야 한다는 압박이 생기는 흐름입니다.", humanDescription: "남보다 먼저 움직여야 한다는 생각이 들 때 자기 속도가 빨라질 수 있습니다." },
  JAE: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "재살", family: "TIMING_CONSTRAINT", stablePriority: 0, rawWeight: 0.25, axes: { STRATEGY: 0.5 }, dynamicTags: ["CONSTRAINT_STRATEGY"],
    easyMeaning: "조건이 제한된 상황에서 빠져나갈 방법을 찾게 만드는 흐름입니다.", humanDescription: "쓸 수 있는 방법이 줄어들면 남은 길을 더 꼼꼼히 살피는 쪽을 보조합니다." },
  CHEON: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "천살", family: "TIMING_EXTERNAL", stablePriority: 0, rawWeight: 0.25, dynamicTags: ["EXTERNAL_LIMIT"],
    easyMeaning: "내 뜻대로만 움직이기 어려운 외부 조건을 만나게 되는 흐름입니다.", humanDescription: "내 계획과 바깥의 사정이 다를 때 방법을 다시 살피는 쪽을 보조합니다." },
  WOL: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "월살", family: "TIMING_REVIEW", stablePriority: 0, rawWeight: 0.25, axes: { RECOVERY_NEED: 0.25, DEPTH: 0.25 }, dynamicTags: ["DELAY_REVIEW"],
    easyMeaning: "속도가 잘 붙지 않아 다시 점검하고 기다려야 하는 흐름입니다.", humanDescription: "바로 나아가기 어려울 때 놓친 것이 없는지 다시 보는 쪽을 보조합니다." },
  MANGSIN: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "망신살", family: "TIMING_VISIBILITY", stablePriority: 0, rawWeight: 0.25, axes: { CHARISMA: 0.25 }, dynamicTags: ["VISIBILITY_RISK"],
    easyMeaning: "좋든 싫든 내 행동이나 결과가 평소보다 눈에 잘 띄는 흐름입니다.", humanDescription: "내가 한 말과 행동이 다른 사람에게 어떻게 보이는지 더 의식하는 쪽을 보조합니다." },
  YUKHAE: { ...amplifier, sourceType: "shinsal", kind: "DYNAMIC", label: "육해살", family: "TIMING_LOAD", stablePriority: 0, rawWeight: 0.25, axes: { RECOVERY_NEED: 0.5 }, dynamicTags: ["LOAD_FATIGUE"],
    easyMeaning: "여러 일을 함께 들고 가며 피로가 쌓이기 쉬운 흐름입니다.", humanDescription: "한꺼번에 챙길 것이 늘면 쉬어갈 틈이 줄어드는 모습을 보조합니다." },
} as const satisfies Record<string, SupplementSemanticDefinition & { sourceType: "shinsal" | "gwiin"; label: string }>;
export type FoundationMarker = keyof typeof SHINSAL_SEMANTICS;

/** References, not a second set of definitions or a second evidence producer. */
export const TWELVE_SHINSAL_REFERENCES = {
  겁살: "GEOP", 재살: "JAE", 천살: "CHEON", 월살: "WOL", 망신: "MANGSIN", 육해: "YUKHAE",
  지살: "JISAL", 년살: "NYEON", 장성: "JANGSEONG", 반안: "BANAN", 역마: "YEOKMA", 화개: "HWAGAE",
} as const satisfies Record<string, FoundationMarker>;

/** Existing producer IDs and canonical aliases; display labels are not proof. */
export const NATAL_MARKER_ALIASES: Readonly<Record<string, FoundationMarker>> = {
  gwiin_cheoneul: "CHEONEUL", gwiin_cheondeok: "CHEONDEOK", gwiin_woldeok: "WOLDEOK", gwiin_taegeuk: "TAEGEUK",
  gwiin_munchang: "MUNCHANG", gwiin_hakdang: "HAKDANG", gwiin_jaego: "JAEGO",
  sinsal_hyeonchim: "HYEONCHIM", sinsal_hongyeom: "HONGYEOM", sinsal_dohwa: "DOHWA", sinsal_gwimun: "GWIMUN",
  sinsal_yangin: "YANGIN", sinsal_gongmang: "GONGMANG",
  sinsal_yeokma: "YEOKMA", sinsal_hwagae: "HWAGAE", sinsal_jangseong: "JANGSEONG",
  twelve_sinsal_geopsal: "GEOP", twelve_sinsal_jaesal: "JAE", twelve_sinsal_cheonsal: "CHEON", twelve_sinsal_jisal: "JISAL",
  twelve_sinsal_nyeonsal: "NYEON", twelve_sinsal_wolsal: "WOL", twelve_sinsal_mangsin: "MANGSIN",
  twelve_sinsal_jangseong: "JANGSEONG", twelve_sinsal_banan: "BANAN", twelve_sinsal_yeokma: "YEOKMA", twelve_sinsal_yukhae: "YUKHAE", twelve_sinsal_hwagae: "HWAGAE",
  "shinsal:CHEON_EUL_GWIIN": "CHEONEUL", "shinsal:CHEON_DEOK_GWIIN": "CHEONDEOK", "shinsal:WOL_DEOK_GWIIN": "WOLDEOK", "shinsal:TAEGEUK_GWIIN": "TAEGEUK", "shinsal:MUN_CHANG_GWIIN": "MUNCHANG", "shinsal:HAK_DANG_GWIIN": "HAKDANG",
  "shinsal:HYEONCHIMSAL": "HYEONCHIM", "shinsal:HONGYEOMSAL": "HONGYEOM", "shinsal:DOHWASAL": "DOHWA", "shinsal:YEOKMASAL": "YEOKMA", "shinsal:HWAGAE": "HWAGAE", "shinsal:GOSINSAL": "GOSIN", "shinsal:GWASUKSAL": "GWASUK", "shinsal:MANGSINSAL": "MANGSIN",
  "shinsal:TWELVE_GEOPSAL": "GEOP", "shinsal:TWELVE_JAESAL": "JAE", "shinsal:TWELVE_CHEONSAL": "CHEON", "shinsal:TWELVE_JISAL": "JISAL", "shinsal:TWELVE_NYEONSAL": "NYEON", "shinsal:TWELVE_WOLSAL": "WOL", "shinsal:TWELVE_MANGSINSAL": "MANGSIN",
  "shinsal:TWELVE_JANGSEONGSAL": "JANGSEONG", "shinsal:TWELVE_BANANSAL": "BANAN", "shinsal:TWELVE_YEOKMASAL": "YEOKMA", "shinsal:TWELVE_YUKHAESAL": "YUKHAE", "shinsal:TWELVE_HWAGAE": "HWAGAE",
};
export function foundationMarkerKey(id: string): FoundationMarker | undefined {
  const canonicalId = id.replace(/:day-reference$/, "");
  return Object.hasOwn(NATAL_MARKER_ALIASES, canonicalId) ? NATAL_MARKER_ALIASES[canonicalId] : undefined;
}
