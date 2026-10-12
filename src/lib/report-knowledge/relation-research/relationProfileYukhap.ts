import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_YUKHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:yukhap",
    "key": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "label": "지지 육합",
    "hanja": "地支六合",
    "aliases": [
      "지지 육합",
      "육합",
      "지합"
    ],
    "existingDefinition": "서로 짝을 이루는 여섯 지지 조합을 음양 배합으로 설명하는 분류다.",
    "definition": "열두 지지의 여섯 정해진 짝이다. 두 지지가 음양의 짝이라는 분류와 실제 오행 변화·협력 성과는 구분한다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회 論支元六合는 여섯 짝과 음양·월건·율려의 대응을 서술한다. 합의 유불리를 동등한 보편 효과로 처리하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "formation": {
      "membership": "子丑·寅亥·卯戌·辰酉·巳申·午未 두 지지가 실제로 있어야 한다.",
      "direction": "표의 쌍은 대칭이다. 문헌의 주객별 길흉 차이는 대칭 검출과 구별한다.",
      "positions": "원국과 두 사람 사이를 분리하고 연월일시 위치를 유지한다.",
      "season": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다.",
      "multiple": "같은 지지가 여러 기둥에 있으면 서로 다른 위치 사실이지만 독립된 생활 효과를 곱하지 않는다.",
      "operation": "합을 합화·결혼·동의·평화로 환산하지 않는다."
    },
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "주변 충·형·파를 지우고 육합만 남기는 경우.",
      "두 사람의 연지만으로 완벽한 궁합을 확정하는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "삼합의 생왕고 완성보다 두 자리 사이의 맞물림을 다룬다. 원래 생극과 지장간은 배합 후에도 검토 대상이다.",
      "positive": "서로 다른 기능이 실제 과업 안에서 맞물릴 여지가 있는지 살필 질문을 제공한다.",
      "risk": "짝이 맞아도 용도와 여력이 다르면 필요한 작용이 제약될 수 있다.",
      "excess": "실제 협력이 한 상대에게만 의존한다면 다른 선택지와 검증이 약해질 수 있다.",
      "reversal": "가까운 결속이 좋은 작용을 붙잡을 수 있고 느슨한 합이 선택권을 남길 수 있다.",
      "mitigation": "합의 대상을 보호할 필요가 있는지, 다른 결속과 경쟁하는지 따로 확인한다.",
      "coOccurrence": "寅亥·巳申은 현행 파 표와 겹친다. 巳申은 형에도 속한다. 이름 수로 사건 수를 늘리지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "samhap",
        "difference": "두 자리의 배합과 세 단계의 집결은 같은 협력 문장의 다른 이름이 아니다."
      },
      {
        "other": "hae",
        "difference": "육해는 합과 충의 방해 연결을 설명하는 다른 쌍이다."
      }
    ],
    "lineage": [
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다."
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
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": []
  }
] as const satisfies readonly RelationProfile[];
