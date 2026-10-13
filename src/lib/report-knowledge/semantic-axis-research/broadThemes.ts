/** Offline authored semantic research. Import only from research tests; no runtime connection. */
import type { ThemeResearch } from "./semanticResearchTypes";

export const BROAD_THEME_RESEARCH: readonly ThemeResearch[] = [
  {
    "id": "sar:theme:DEEP_UNDERSTANDING",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "DEEP_UNDERSTANDING",
    "axes": [
      "DEPTH",
      "PATTERN_SENSE",
      "MEANING"
    ],
    "definition": "이유·연결·가치를 깊이 이해",
    "adjacentTheme": "LEARNING_AND_EXPERTISE",
    "distinction": "깊은 분석과 가치의 이유는 다른 정보",
    "compressionRisk": "DEPTH의 원인 탐구와 MEANING의 가치 판단을 같은 깊은 사람으로 합치지 않음",
    "preserve": "분석 대상·반례·개인 가치",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:PRECISION_AND_STANDARDS",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "PRECISION_AND_STANDARDS",
    "axes": [
      "PRECISION",
      "BOUNDARY",
      "STRUCTURE_STYLE",
      "COMMUNICATION_STYLE"
    ],
    "definition": "기준·차이·범위·전달 형식",
    "adjacentTheme": "LEADERSHIP_AND_RESPONSIBILITY",
    "distinction": "오류 발견·동의 경계·계획·직설성은 같은 기준이 아님",
    "compressionRisk": "경계 존중을 꼼꼼함으로 환원하면 거절권이 사라짐",
    "preserve": "오류 비용·권한·매체·순서",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:ACTION_AND_INITIATIVE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "ACTION_AND_INITIATIVE",
    "axes": [
      "INITIATIVE",
      "ACTION_TEMPO",
      "DECISION_STYLE"
    ],
    "definition": "시작·속도·결정의 연결",
    "adjacentTheme": "GROWTH_AND_EXPANSION",
    "distinction": "먼저 제안·빠른 착수·대안 종료는 서로 독립",
    "compressionRisk": "천천히 시작하는 주도자를 소극적이라 압축하지 않음",
    "preserve": "발의자·착수 간격·결정 기준",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:GROWTH_AND_EXPANSION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "GROWTH_AND_EXPANSION",
    "axes": [
      "EXPANSION",
      "GOAL_DRIVE"
    ],
    "definition": "목표를 향해 범위를 넓힘",
    "adjacentTheme": "OPPORTUNITY_AND_MOVEMENT",
    "distinction": "범위 확대와 목표 완수는 때로 충돌",
    "compressionRisk": "좁은 목표를 끝내는 행동을 성장 부족으로 읽지 않음",
    "preserve": "범위·유지 여력·완료 기준",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:STABILITY_AND_MAINTENANCE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "STABILITY_AND_MAINTENANCE",
    "axes": [
      "STABILITY",
      "PERSISTENCE"
    ],
    "definition": "기반을 유지하고 이어감",
    "adjacentTheme": "RECOVERY_AND_INNER_PROCESS",
    "distinction": "안정의 기반과 노력 지속은 같지 않음",
    "compressionRisk": "불안정한 환경에서 버팀을 안정된 생활로 쓰지 않음",
    "preserve": "기반·반복 이유·종료 조건",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:EXPRESSION_AND_VISIBILITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "EXPRESSION_AND_VISIBILITY",
    "axes": [
      "EXPRESSION",
      "CHARISMA",
      "ENERGY_DIRECTION"
    ],
    "definition": "표현·주목·에너지의 외부 통로",
    "adjacentTheme": "SOCIAL_ATTUNEMENT_AND_CARE",
    "distinction": "내향 방향에서도 표현과 주목은 클 수 있음",
    "compressionRisk": "말 많은 사람·매력 있는 사람·외향을 하나로 합치지 않음",
    "preserve": "매체·청자·공개 범위·사적 정리",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:LEADERSHIP_AND_RESPONSIBILITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "LEADERSHIP_AND_RESPONSIBILITY",
    "axes": [
      "LEADERSHIP",
      "DUTY"
    ],
    "definition": "방향 조율과 맡은 의무",
    "adjacentTheme": "STATUS_AND_RECOGNITION",
    "distinction": "책임 이행은 지휘권이 없어도 가능",
    "compressionRisk": "모든 책임을 떠안음을 리더십으로 미화하지 않음",
    "preserve": "권한·역할·위임·지원",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:AUTONOMY_AND_SELF_DIRECTION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "AUTONOMY_AND_SELF_DIRECTION",
    "axes": [
      "AUTONOMY",
      "COMPETITION"
    ],
    "definition": "자기 선택과 비교 자극",
    "adjacentTheme": "ACTION_AND_INITIATIVE",
    "distinction": "혼자 선택하는 것과 타인과 겨루는 것은 다름",
    "compressionRisk": "경쟁하지 않는 독립성을 지우지 않음",
    "preserve": "선택권·비교 기준·공동 책임",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:MONEY_AND_REALITY",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "MONEY_AND_REALITY",
    "axes": [
      "RESOURCE_SENSE",
      "PRACTICALITY"
    ],
    "definition": "자원 배분과 현실 실행",
    "adjacentTheme": "STABILITY_AND_MAINTENANCE",
    "distinction": "RESOURCE_SENSE는 돈뿐 아니라 시간·도구도 다룸",
    "compressionRisk": "실용적 행동을 재물복이나 고소득으로 승격하지 않음",
    "preserve": "흐름·실제 비용·사용 목적",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:LEARNING_AND_EXPERTISE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "LEARNING_AND_EXPERTISE",
    "axes": [
      "LEARNING",
      "CURIOSITY"
    ],
    "definition": "질문과 배움의 축적",
    "adjacentTheme": "DEEP_UNDERSTANDING",
    "distinction": "호기심이 많아도 숙련이나 전문성이 확정되지 않음",
    "compressionRisk": "질문 많은 사람을 전문가로 부르는 과장 금지",
    "preserve": "질문 범위·연습·전이 검증",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:SOCIAL_ATTUNEMENT_AND_CARE",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "SOCIAL_ATTUNEMENT_AND_CARE",
    "axes": [
      "SOCIAL_ATTUNEMENT",
      "CARE",
      "RELATION_STYLE"
    ],
    "definition": "상대 신호·돌봄·연결",
    "adjacentTheme": "EXPRESSION_AND_VISIBILITY",
    "distinction": "사교적 연결·감정 읽기·필요한 지원은 다름",
    "compressionRisk": "CARE로 압축하면 동의 없는 과잉 지원을 놓침",
    "preserve": "요청·상호 반응·거리·동의",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:CHANGE_AND_ADAPTATION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "CHANGE_AND_ADAPTATION",
    "axes": [
      "CHANGE_ORIENTATION",
      "ADAPTABILITY"
    ],
    "definition": "새로움 선호와 조건 대응",
    "adjacentTheme": "GROWTH_AND_EXPANSION",
    "distinction": "변화를 싫어해도 잘 적응할 수 있음",
    "compressionRisk": "새 방식을 좋아한다는 이유로 적응 능력을 보증하지 않음",
    "preserve": "선호·실제 변화·조정 비용",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:OPPORTUNITY_AND_MOVEMENT",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "OPPORTUNITY_AND_MOVEMENT",
    "axes": [
      "OPPORTUNITY_SENSE",
      "RISK_STYLE"
    ],
    "definition": "가능성과 불확실성 감수",
    "adjacentTheme": "GROWTH_AND_EXPANSION",
    "distinction": "실제 Axis에는 이동 행위가 없음",
    "compressionRisk": "Theme 이름의 MOVEMENT로 이사·이직 사건을 만들지 않음",
    "preserve": "기회 확인·허용 손실·장소는 별도 자료",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:RECOVERY_AND_INNER_PROCESS",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "RECOVERY_AND_INNER_PROCESS",
    "axes": [
      "RECOVERY_NEED"
    ],
    "definition": "부하와 회복 여백",
    "adjacentTheme": "DEEP_UNDERSTANDING",
    "distinction": "현재 회원의 건강·피로는 별도 입력이 필요",
    "compressionRisk": "쉬어야 한다는 모든 조언으로 내향·깊이를 흡수하지 않음",
    "preserve": "부하·실제 여력·지원·휴식 동의",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:STATUS_AND_RECOGNITION",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "STATUS_AND_RECOGNITION",
    "axes": [
      "STATUS_DRIVE"
    ],
    "definition": "사회적 인정의 기준",
    "adjacentTheme": "LEADERSHIP_AND_RESPONSIBILITY",
    "distinction": "인정 욕구와 실제 직위는 다름",
    "compressionRisk": "칭찬 원하는 마음을 출세·명예 획득 사실로 쓰지 않음",
    "preserve": "평가 기준·공로·공식 역할",
    "overlappingAxisIds": []
  },
  {
    "id": "sar:theme:CREATION_AND_OUTPUT",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "review": "conditional_semantic_candidate",
    "sourceRefs": [
      "repo:foundationRanking"
    ],
    "sourceStatus": "repository_checked_not_empirical",
    "theme": "CREATION_AND_OUTPUT",
    "axes": [
      "CREATION",
      "STRATEGY"
    ],
    "definition": "새 결과와 경로 설계",
    "adjacentTheme": "EXPRESSION_AND_VISIBILITY",
    "distinction": "STRATEGY는 결과 제작 없이도 경로를 설계",
    "compressionRisk": "창작·전략·표현을 모두 결과를 만든다는 조언으로 합치지 않음",
    "preserve": "산출물·경로·청자·저작권",
    "overlappingAxisIds": []
  }
];
