import type { SupplementSemanticDefinition } from "./semanticCore";

const stage = { kind: "TRAIT", tier: "AMPLIFIER", rawWeight: 0.5, contentPriority: 0, stablePriority: 0,
  fortuneTags: {}, contexts: ["identity", "work", "recovery"] } as const;
export const TWELVE_STAGE_SEMANTICS = {
  장생: { ...stage, family: "STAGE_BEGINNING", axes: { INITIATIVE: 1, EXPANSION: 1, CREATION: 1 }, dynamicTags: ["BEGINNING"],
    easyMeaning: "막 시작해서 자라고 힘을 키우는 단계입니다.", humanDescription: "새로운 것을 배우고 시작할 때 힘이 붙는 모습으로 볼 수 있습니다." },
  목욕: { ...stage, family: "STAGE_EXPERIMENT", axes: { CHANGE_ORIENTATION: 1, EXPRESSION: 1, CHARISMA: 0.5 }, dynamicTags: ["EXPERIMENT"], riskTags: ["VOLATILITY"],
    easyMeaning: "밖으로 처음 드러나며 여러 경험을 해보는 단계입니다.", humanDescription: "처음부터 한 가지 답만 고르기보다 직접 겪어보며 알아가는 모습이 있습니다." },
  관대: { ...stage, family: "STAGE_ROLE", axes: { STATUS_DRIVE: 1, SOCIAL_ATTUNEMENT: 0.5, DUTY: 0.5 }, dynamicTags: ["ROLE_FORMATION"],
    easyMeaning: "밖에서 맡을 역할을 준비하고 갖춰가는 단계입니다.", humanDescription: "사람들 사이에서 어떻게 보이고 어떤 책임을 맡을지 의식하는 모습이 있습니다." },
  건록: { ...stage, family: "STAGE_SELF", axes: { AUTONOMY: 1, DUTY: 1, STABILITY: 1 }, dynamicTags: ["SELF_STANDING"],
    easyMeaning: "자기 힘으로 서고 직접 움직이는 단계입니다.", humanDescription: "남에게 기대기보다 자기 힘으로 해내고 싶어 하는 모습이 강해질 수 있습니다." },
  제왕: { ...stage, family: "STAGE_PEAK", axes: { LEADERSHIP: 1, CHARISMA: 1, GOAL_DRIVE: 1 }, dynamicTags: ["PEAK_FORCE"], riskTags: ["OVERDRIVE"],
    easyMeaning: "힘이 가장 크게 올라와 앞에 나서기 쉬운 단계입니다.", humanDescription: "해야 할 일이 분명하면 앞에 서고 밀어붙이는 모습이 강해질 수 있습니다." },
  쇠: { ...stage, family: "STAGE_SELECTIVE", axes: { STRATEGY: 1, RESOURCE_SENSE: 1 }, dynamicTags: ["SELECTIVE_USE"],
    easyMeaning: "힘을 아무 데나 쓰기보다 필요한 곳에 골라 쓰는 단계입니다.", humanDescription: "모든 일에 에너지를 쓰기보다 중요한 것을 고르고 관리하려는 모습이 있습니다." },
  병: { ...stage, family: "STAGE_MAINTENANCE", axes: { RECOVERY_NEED: 1, DEPTH: 0.5 }, dynamicTags: ["MAINTENANCE"],
    easyMeaning: "속도를 조금 줄이고 점검하고 돌볼 것이 보이는 단계입니다.", humanDescription: "계속 밀어붙이기보다 한번 멈춰 상태를 점검해야 할 때가 생기기 쉬운 모습입니다." },
  사: { ...stage, family: "STAGE_RELEASE", axes: { ENERGY_DIRECTION: -0.5, DEPTH: 1 }, dynamicTags: ["RELEASE"],
    easyMeaning: "오래 붙들던 것을 내려놓고 중요한 것에 집중하는 단계입니다.", humanDescription: "계속 넓히기보다 필요 없는 것을 덜어내고 안으로 정리하는 모습이 있습니다." },
  묘: { ...stage, family: "STAGE_STORAGE", axes: { STABILITY: 1, RESOURCE_SENSE: 1 }, dynamicTags: ["STORAGE"],
    easyMeaning: "중요한 것을 안에 모아두고 저장하는 단계입니다.", humanDescription: "쉽게 꺼내 쓰기보다 필요한 것을 모아두고 지키는 모습이 있습니다." },
  절: { ...stage, family: "STAGE_RESET", axes: { CHANGE_ORIENTATION: 1, ADAPTABILITY: 0.5 }, dynamicTags: ["RESET"],
    easyMeaning: "이전 흐름을 끊고 다른 단계로 넘어가는 시점입니다.", humanDescription: "오래 이어오던 방식을 멈추고 새로 시작할 필요가 생기는 모습으로 볼 수 있습니다." },
  태: { ...stage, family: "STAGE_POTENTIAL", axes: { CURIOSITY: 0.5, CREATION: 0.5 }, dynamicTags: ["LATENT_POTENTIAL"],
    easyMeaning: "아직 밖으로 나오지 않았지만 새로운 가능성이 준비되는 단계입니다.", humanDescription: "바로 결과를 내기보다 안에서 새로운 생각과 가능성을 키우는 모습이 있습니다." },
  양: { ...stage, family: "STAGE_NURTURE", axes: { CARE: 1, PERSISTENCE: 0.5 }, dynamicTags: ["NURTURE"],
    easyMeaning: "밖으로 나오기 전에 차근차근 키우고 준비하는 단계입니다.", humanDescription: "급하게 드러내기보다 필요한 것을 키우고 준비하는 모습이 있습니다." },
} as const satisfies Record<string, SupplementSemanticDefinition>;
export type FoundationTwelveStage = keyof typeof TWELVE_STAGE_SEMANTICS;
