import type { RelationProfile } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_PROFILE_HAE = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:profile:hae",
    "key": "hae",
    "targetId": "foundation:relation:hae",
    "label": "지지 해",
    "hanja": "地支害",
    "aliases": [
      "지지 해",
      "해",
      "육해",
      "六害"
    ],
    "existingDefinition": "지지의 육해 관계를 논하는 분류다.",
    "definition": "子未·丑午·寅巳·卯辰·申亥·酉戌의 여섯 쌍이다. 육합 상대를 충하는 대상과의 얽힘으로 설명하는 전승을 보존한다.",
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "삼명통회 論六害는 각 쌍의 왕쇠·지장간 논설과 육합·충을 통한 방해 설명을 병기한다. 현대의 서운함은 별도 생활 비유다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "formation": {
      "membership": "현행 육해6쌍의 실제 두 글자가 필요하다.",
      "direction": "검출은 대칭이나 고전 酉見戌과 戌見酉의 평가 차이는 별도 해석 전승이다.",
      "positions": "원국 위치와 타인 소유자·기간을 명시한다.",
      "season": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다.",
      "multiple": "반복 참여자와 공유되는 충·합 구조를 별도로 남긴다.",
      "operation": "충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다."
    },
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "육해와 십이신살 六厄·육해살을 이름만 보고 합치는 경우.",
      "간접 방해 설명을 실제 사람의 숨은 의도로 바꾸는 경우."
    ],
    "inference": {
      "class": "C_CONDITIONAL_RESEARCH",
      "mechanism": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다.",
      "positive": "연결이 잘못 이해되는 조건을 사전에 확인하는 질문으로 사용할 수 있다.",
      "risk": "실제로 다른 기대가 있어도 직접 충돌이 없다는 이유로 해결된 것으로 볼 수 없다.",
      "excess": "모든 작은 어긋남을 타인의 악의로 읽으면 확인할 기회를 없앨 수 있다.",
      "reversal": "드러난 불일치는 약속을 구체화할 자료가 될 수 있다. 해 자체가 의사소통 능력을 주는 것은 아니다.",
      "mitigation": "당사자의 실제 기대·연결·동의를 확인하고 고전의 작용 조건과 현대 생활 판단을 분리한다.",
      "coOccurrence": "寅巳 형·子未/丑午 원진과 겹치지만 독립 위험을 더하지 않는다.",
      "limits": "관계 기호는 현실 행동·사건·능력의 증거가 아니다. 아래 생활 질문은 실제 경험을 확인한 후에만 검토하는 연구 후보이며 독점 성향·예측 효력을 주장하지 않는다."
    },
    "distinctions": [
      {
        "other": "wonjin",
        "difference": "육해6쌍과 원진6쌍은 子未·丑午 두 쌍만 겹치며 동일 분류가 아니다."
      },
      {
        "other": "chung",
        "difference": "직접 대향과 합의 매개 방해 설명은 다르다."
      }
    ],
    "lineage": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다."
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
      "natal_month",
      "between_periods"
    ],
    "unsupportedProducerScopeRefs": [
      "natal"
    ]
  }
] as const satisfies readonly RelationProfile[];
