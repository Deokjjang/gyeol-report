import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_SAMHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:samhap",
    "key": "samhap",
    "targetId": "foundation:relation:samhap",
    "label": "지지 삼합",
    "hanja": "地支三合",
    "aliases": [
      "지지 삼합",
      "삼합",
      "삼합국"
    ],
    "existingDefinition": "생·왕·저장에 해당하는 세 지지의 모임을 논하는 분류다.",
    "definition": "申子辰 수·亥卯未 목·寅午戌 화·巳酉丑 금의 생왕고 세 자리 집결이다. 세 자리의 존재와 합국·화기의 실제 작용은 나눈다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회는 생·성·수의 세 역할을 설명하고 하나가 빠지면 완전 삼합 화국으로 논할 수 없다고 구분한다. 辰戌丑未 전부의 토국 설명은 네 자리 별도 전승이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "formation": {
      "membership": "해당 세 지지의 서로 다른 실제 값이 모두 필요하다.",
      "direction": "집합 소속은 대칭이나 생·왕·고의 역할 순서는 보존한다.",
      "positions": "한 사람의 네 기둥과 두 사람을 합친 세 자리의 소유자를 구분한다.",
      "season": "특정 오행의 기세·투간·월령·방해 조건을 별도로 확인한다.",
      "multiple": "두 글자를 여러 번 반복해도 세 번째 다른 글자가 생기지 않는다.",
      "operation": "현행 함수는 셋의 존재를 판정하며 완전한 화국 성립을 계산하지 않는다."
    },
    "exclusions": [
      "반합에 없는 글자를 가정해 삼합을 완성하는 경우.",
      "두 사람을 합친 집합을 한 사람의 원국 삼합으로 기록하는 경우.",
      "모이는 오행이 그 사람에게 항상 유리하다고 단정하는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "시작·중심·갈무리의 세 역할이 하나의 오행으로 조직된다는 설명은 둘의 친화성과 다른 정보다. 중심과 마무리가 실제로 있는지를 구별할 수 있다.",
      "positive": "분산된 기능을 같은 과업으로 연결할 수 있는지 살피되 어느 기능의 여력을 줄이는지 함께 본다.",
      "risk": "한 방향의 기세 집중이 다른 기능의 여력을 제한할 수 있다.",
      "excess": "현실에서 공동 목표만 강조하면 반대 의견이나 독립 역할을 지우는 결속으로 흐를 수 있다.",
      "reversal": "힘이 한곳에 모였다는 사실이 항상 강점은 아니다. 필요한 방향이면 집중, 불필요한 방향이면 과도다.",
      "mitigation": "생왕고의 실제 구성·방해와 각 참여자의 역할을 확인하며 부족한 구성은 이름으로 보충하지 않는다.",
      "coOccurrence": "삼합과 반합이 같은 세 자리에서 함께 출력되면 새 독립 구조로 점수를 합산하지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "banhap",
        "difference": "세 역할의 모두 존재와 두 역할의 부분 연결은 구별된다."
      },
      {
        "other": "yukhap",
        "difference": "여섯 짝 배합과 네 개 생왕고 집합은 구성 원리가 다르다."
      }
    ],
    "lineage": [
      "자평진전 七의 三會 용례는 이 절에서 申子辰 같은 삼합을 가리킨다. 현대 방합 三會와 자동 병합하지 않는다.",
      "고전의 네 토지 토국은 현재 4삼합 검출 목록에 없으며 새 삼합으로 추가하지 않는다."
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
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month"
    ],
    "unsupportedProducerScopeRefs": [
      "natal",
      "between_periods"
    ]
  }
] as const satisfies readonly RelationProfile[];
