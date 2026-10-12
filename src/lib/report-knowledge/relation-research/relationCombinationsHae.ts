import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_HAE = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:子未",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "子",
      "未"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "子",
        "element": "WATER",
        "yinYang": "yang",
        "hiddenStems": [
          "癸"
        ]
      },
      {
        "symbol": "未",
        "element": "EARTH",
        "yinYang": "yin",
        "hiddenStems": [
          "己",
          "丁",
          "乙"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "육해의 子未는 합·충 매개 설명과 토수 여력 논설을 가진다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "子·未 두 실제 글자와 각 계절·장간을 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "기대가 연결되지 않는 조건을 구체적으로 확인할 질문이 가능하다.",
    "risk": "원진에도 겹치지만 감정 갈등 두 배로 세지 않는다.",
    "reversal": "드러난 차이는 실제 약속의 빈칸을 알리는 자료가 될 수 있다.",
    "distinction": "丑午도 원진·해가 겹치나 기본 수토·화토 구성이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "받기로 한 도움과 실제 제공된 도움이 다르면 요청 내용을 확인한다.",
      "action": "도움의 내용·기한·동의를 다시 묻는다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:wonjin:子未"
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:丑午",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "丑",
      "午"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "丑",
        "element": "EARTH",
        "yinYang": "yin",
        "hiddenStems": [
          "己",
          "癸",
          "辛"
        ]
      },
      {
        "symbol": "午",
        "element": "FIRE",
        "yinYang": "yang",
        "hiddenStems": [
          "丁",
          "己"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "육해 전승은 대표 오행뿐 아니라 丑의 장간 논의를 포함한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "丑:EARTH·yin·장간 己癸辛 / 午:FIRE·yang·장간 丁己; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丑·午의 실제 두 자리와 하절 화·동절 장간 조건을 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 지원으로 보이는 작용의 다른 영향을 검토할 수 있다.",
    "risk": "화생토만으로 해가 무효라 하거나 원진과 합산하지 않는다.",
    "reversal": "호의의 양보다 필요한 형태가 중요한 조건을 질문할 수 있다.",
    "distinction": "子未는 대표 토수 제약, 丑午는 대표 화토 생조가 있다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 도와주려는 방식이 부담이 된다면 필요한 도움의 형태를 묻는다.",
      "action": "제공자의 의도와 수혜자의 필요를 따로 확인한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:wonjin:丑午"
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:寅巳",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "寅",
      "巳"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "寅",
        "element": "WOOD",
        "yinYang": "yang",
        "hiddenStems": [
          "甲",
          "丙",
          "戊"
        ]
      },
      {
        "symbol": "巳",
        "element": "FIRE",
        "yinYang": "yin",
        "hiddenStems": [
          "丙",
          "戊",
          "庚"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "육해와 순환형 일부가 겹치는 쌍이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 巳:FIRE·yin·장간 丙戊庚; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅·巳 두 실제 위치와 申·亥 등의 다른 관계를 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "공통된 출발 기능도 서로 다른 작용을 가질 수 있음을 검토한다.",
    "risk": "형과 해의 공존을 숨은 적의나 관재로 바꾸지 않는다.",
    "reversal": "직접 충돌이 없더라도 조정할 조건은 실제 자료로 확인할 수 있다.",
    "distinction": "申亥도 각 생지 논설이 있지만 寅巳는 형에도 속한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "업무를 서로 잘 안다고 가정했는데 전달이 어긋났다면 전제 지식을 확인한다.",
      "action": "서로 이미 안다고 생각한 내용을 적는다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hyeong:寅巳"
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:卯辰",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "卯",
      "辰"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "卯",
        "element": "WOOD",
        "yinYang": "yin",
        "hiddenStems": [
          "乙"
        ]
      },
      {
        "symbol": "辰",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": [
          "戊",
          "乙",
          "癸"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "육해의 한 쌍이며 고전은 목·토의 조건을 서술한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "卯:WOOD·yin·장간 乙 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "卯·辰의 실제 두 자리와 목토의 기세를 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "가까운 위치나 상생 이미지가 자동 일치를 뜻하지 않음을 살필 수 있다.",
    "risk": "봄 지지라는 공통점으로 실제 파괴·배신·건강 문제를 예언하지 않는다.",
    "reversal": "작은 조건 차이를 초기에 밝히면 조정 질문이 가능하다.",
    "distinction": "酉戌과 다른 대표 목토 관계이며 봄 방합의 일부라는 사실이 육해를 지우지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "같은 목표인데 완료 기준이 실제 달랐다면 기준 문구를 비교한다.",
      "action": "완료했다고 보는 조건을 한 문장씩 확인한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:申亥",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "申",
      "亥"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "申",
        "element": "METAL",
        "yinYang": "yang",
        "hiddenStems": [
          "庚",
          "壬",
          "戊"
        ]
      },
      {
        "symbol": "亥",
        "element": "WATER",
        "yinYang": "yin",
        "hiddenStems": [
          "壬",
          "甲"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "육해 전승의 경쟁·생왕 논설을 역사적 조건으로만 읽는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "申:METAL·yang·장간 庚壬戊 / 亥:WATER·yin·장간 壬甲; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "申·亥 두 실제 글자와 각 장간의 연결을 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "생조의 대표값과 방해 관계가 병존함을 검토한다.",
    "risk": "금생수니 항상 유리하거나 해니 은밀한 배신이라고 할 수 없다.",
    "reversal": "도움이 유용해지려면 실제 요구와 연결 방식이 맞아야 한다.",
    "distinction": "寅巳와 달리 동일쌍 형은 없고 각각 삼합 소속도 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "지원 부서와 실행 부서가 실제 서로 다른 우선순위를 가지면 필요한 결과를 확인한다.",
      "action": "지원 요청의 우선순위와 마감일을 합의한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hae:酉戌",
    "relation": "hae",
    "targetId": "foundation:relation:hae",
    "members": [
      "酉",
      "戌"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "酉",
        "element": "METAL",
        "yinYang": "yin",
        "hiddenStems": [
          "辛"
        ]
      },
      {
        "symbol": "戌",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": [
          "戊",
          "辛",
          "丁"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "고전에는 酉見戌·戌見酉의 비대칭 평가가 있으나 현행 표는 대칭이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "composition": "酉:METAL·yin·장간 辛 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "酉·戌 두 실제 위치와 금·토·戌 장간을 함께 확인한다.",
    "exclusions": [
      "해를 적의·배신·장애·질병의 사실로 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·장간·납음 논의가 있으나 현행 표 판정에 모두 들어 있지는 않다. 충·합 매개를 설명하는 그림에서 부재한 매개 지지가 실제 원국에 있다고 가정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "검출 대칭과 해석 주객의 차이를 구별할 수 있다.",
    "risk": "토생금 한 줄로 장간·방해를 없애거나 비대칭 길흉을 계산된 사실이라 하지 않는다.",
    "reversal": "관계도를 같은 쌍이라도 관점별로 다시 볼 필요가 있다.",
    "distinction": "卯辰과 달리 대표 토금 생조와 고전 주객 차이가 명시된다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "두 당사자가 실제 같은 합의를 다르게 이해하면 각자 기대를 따로 듣는다.",
      "action": "한쪽 해석을 다른 쪽의 의도로 대입하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ],
    "uncertainties": [
      "납음·주객·궁위 조건이 다른 전승을 현행 대칭 쌍 검출이 모두 지원한다고 말하지 않는다.",
      "원국의 실제 매개 지지가 없어도 표 일치가 있지만 그 지지의 존재를 창작하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
] as const satisfies readonly RelationCombination[];
