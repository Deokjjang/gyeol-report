import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_HYEONG = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:hyeong",
    "key": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "label": "지지 형",
    "hanja": "地支刑",
    "aliases": [
      "지지 형",
      "형",
      "삼형",
      "자형"
    ],
    "existingDefinition": "지지 사이의 형 관계를 논하는 분류다.",
    "definition": "寅巳申·丑戌未의 순환형, 子卯의 상형, 辰午酉亥의 반복 자형을 구별하는 전승이다. 쌍 표 일치와 세 자리 전체 구성은 분리한다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회 論三刑는 방향 순환·자형 및 형을 곧바로 흉으로 보지 않는 조건을 싣고, 三車一覧의 無恩·恃勢 명칭 교환도 병기한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "formation": {
      "membership": "현행 쌍11개와 전통의 전체 삼자그룹2개를 구분한다.",
      "direction": "전통 寅→巳→申→寅, 丑→戌→未→丑 방향을 보존한다. 현재 함수는 양방향 같은 쌍으로 판정한다.",
      "positions": "서로 다른 위치를 요구한다. 자형은 하나의 지지를 두 번 참조하는 것이 아니라 별도 자리의 반복이다.",
      "season": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다.",
      "multiple": "삼형 전체는 3개의 실제 서로 다른 지지; 두 글자는 전체 삼형 성립이 아니다.",
      "operation": "자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다."
    },
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "寅巳 한 쌍으로 寅巳申 전체가 있다고 쓰는 경우.",
      "학설별 無恩·恃勢 명칭을 뒤섞어 하나의 확정 분류로 덮는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "형은 대향이 아닌 순환·반복의 상호 제약을 다룬다. 반복 조건과 다중 대상이 있어 단순 두 방향 충돌보다 구성 검토가 더 필요하다.",
      "positive": "지나치게 모이는 작용을 조절하는 조건을 살필 수 있지만 형에서 정밀한 재능을 바로 추정하지 않는다.",
      "risk": "같은 기능의 과도나 여러 제약의 순환이 완화되지 않는 조건을 검토한다.",
      "excess": "실제 검토·수정이 끝나지 않는 상황이라면 기준 개선 자체가 부담을 재생산할 수 있다.",
      "reversal": "제약은 무질서를 줄일 수도 있지만 필요한 기능까지 누르면 손실이다. 반복 자형이 꼼꼼함을 입증하지 않는다.",
      "mitigation": "고전의 제형·해형 예는 참여 구조와 조건이 갖춰질 때만 검토하며 단어 하나로 자동 상쇄하지 않는다.",
      "coOccurrence": "寅巳는 해, 巳申은 육합·파, 寅申은 충, 戌未는 파, 丑未는 충과 겹친다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "chung",
        "difference": "형의 비대향·순환·자형 조건과 충의 대향은 다르다."
      },
      {
        "other": "pa",
        "difference": "戌未·巳申의 겹침은 의미가 같다는 증거가 아니다."
      }
    ],
    "lineage": [
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다."
    ],
    "safety": [
      "성공·재물 증가·혼인·이별·사고·질병·외도·법적 처벌·과거 사건을 확정하지 않는다.",
      "미상 시주를 보충하지 않으며 확인하지 못한 관계의 부재도 확정하지 않는다.",
      "두 사람의 관계는 한 사람의 타고난 성향이 아니며 기간 관계는 적용 구간 밖으로 확장하지 않는다."
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "handoff": [
      "실제 producer·참여 기둥·간지·성립 상태·출처를 확인한다.",
      "학설·작용 조건·다른 관계·실제 분야 맥락을 대조한다.",
      "연구 ID를 계산 Evidence ID로 변환하거나 점수에 자동 더하지 않는다."
    ],
    "producerScopeRefs": [
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": [
      "natal",
      "cross_person"
    ]
  }
] as const satisfies readonly RelationProfile[];
