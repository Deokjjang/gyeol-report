import { defineClaim as d, axis as a, axisGate as ag, any, synthesis } from "./claimCore";

export const SUCCESS_CLAIMS = [
  d({ id: "SU01_GOAL_FINISHER", category: "SUCCESS", semanticTheme: "GOAL_COMPLETION", requiredAxes: [a("GOAL_DRIVE"), a("PERSISTENCE")], exclusivityGroup: "SUCCESS_STYLE",
    claimsByLevel: { 2: "목표를 잡으면 쉽게 놓지 않는 편입니다.", 3: "목표를 잡으면 끝을 볼 때까지 오래 붙드는 사람입니다." } }),
  d({ id: "SU02_GROWTH_DESIRE", category: "IDENTITY", semanticTheme: "GROWTH_DESIRE", requiredAxes: [a("EXPANSION", "STRONG"), a("GOAL_DRIVE", "SUPPORT")], exclusivityGroup: "SUCCESS_STYLE",
    claimsByLevel: { 2: "지금보다 더 성장하고 싶어 하는 편입니다.", 3: "지금 수준에 오래 머무르기보다 더 큰 일을 하고 싶어 하는 사람입니다." } }),
  d({ id: "SU03_BIGGER_STAGE", category: "SUCCESS", semanticTheme: "BIGGER_SCALE", requiredAxes: [a("EXPANSION", "STRONG"), a("OPPORTUNITY_SENSE")],
    requiredConditions: [any(ag("LEADERSHIP", "SUPPORT"), ag("GOAL_DRIVE", "SUPPORT"))], exclusivityGroup: "SUCCESS_STYLE", priority: 60,
    claimsByLevel: { 2: "익숙한 작은 일만 반복하면 답답함을 느낄 수 있습니다.", 3: "점점 더 큰 일과 더 넓은 기회를 맡을수록 동기가 살아나는 편입니다." } }),
  d({ id: "SU04_EXPERTISE", category: "EXPERTISE", semanticTheme: "DEEP_EXPERTISE", contexts: ["work", "learning", "identity"],
    requiredAxes: [a("DEPTH"), a("PRECISION"), a("LEARNING")], preferredFusionIds: ["C006"], exclusivityGroup: "EXPERTISE_STYLE",
    claimsByLevel: { 2: "한 분야를 깊게 파서 자기 전문성을 만드는 데 잘 맞습니다.", 3: "남이 쉽게 대신하기 어려운 전문성을 만드는 쪽으로 강점이 분명합니다." } }),
  d({ id: "SU05_MANAGEMENT_STYLE", category: "LEADERSHIP", semanticTheme: "MANAGEMENT_STYLE", contexts: ["work", "identity"],
    requiredAxes: [a("LEADERSHIP"), a("STRUCTURE_STYLE"), a("DUTY")], exclusivityGroup: "LEADERSHIP_CORE", priority: 55,
    claimsByLevel: { 2: "혼자 잘하는 것보다 사람과 일을 정리하는 역할에도 잘 맞는 편입니다.", 3: "사람과 일을 정리하고 이끄는 관리자 역할에서 장점이 살아날 수 있습니다." } }),
  d({ id: "SU06_BUSINESS_INDEPENDENCE", category: "BUSINESS", semanticTheme: "BUSINESS_INDEPENDENCE", contexts: ["work", "money"],
    requiredAxes: [a("AUTONOMY"), a("OPPORTUNITY_SENSE"), a("RESOURCE_SENSE")],
    requiredConditions: [any(ag("RISK_STYLE", "SUPPORT"), ag("ADAPTABILITY"), synthesis("OUTPUT_TO_WEALTH"), synthesis("SELF_OUTPUT_TO_VALUE"))], exclusivityGroup: "BUSINESS_STYLE", priority: 60,
    claimsByLevel: { 2: "남이 정해준 구조보다 직접 일을 만들고 결정하는 방식에도 관심이 갈 수 있습니다.", 3: "자기 사업이나 독립적으로 일하는 방식도 충분히 생각해볼 만한 성향입니다." } }),
];
