import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_HYEONG = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:寅巳",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
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
      "text": "삼명통회의 寅→巳 방향 일부; 無恩·恃勢 명칭 이견을 보존한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 巳:FIRE·yin·장간 丙戊庚; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅·巳의 실제 두 자리이며 申이 없다면 삼형 전체는 아니다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "상생 대표값 속에도 장간별 제약이 있을 조건을 검토한다.",
    "risk": "현행 해와의 겹침으로 독립 위험을 더하지 않는다.",
    "reversal": "두 글자 부분 구성은 세 방향 순환보다 해석 범위가 좁다.",
    "distinction": "巳申과 달리 寅巳는 육해에도 포함되고 육합은 아니다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 업무를 넘길 때 서로의 역할 기대가 다르면 지시와 재량을 확인한다.",
      "action": "주어진 조건과 스스로 정할 조건을 나눈다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hae:寅巳"
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:巳申",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "巳",
      "申"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "巳",
        "element": "FIRE",
        "yinYang": "yin",
        "hiddenStems": [
          "丙",
          "戊",
          "庚"
        ]
      },
      {
        "symbol": "申",
        "element": "METAL",
        "yinYang": "yang",
        "hiddenStems": [
          "庚",
          "壬",
          "戊"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "巳→申의 형 방향 일부이며 현대 대칭 함수는 역순도 같은 쌍으로 낸다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 申:METAL·yang·장간 庚壬戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "巳·申의 실제 두 자리만으로 寅까지 있다고 할 수 없다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "결속과 제약의 공존을 검토할 수 있다.",
    "risk": "육합·형·파의 겹침을 3배 위험이나 순서 있는 사건으로 만들지 않는다.",
    "reversal": "협력 의지와 절차 부적합이 동시에 있을 수 있다는 질문은 가능하다.",
    "distinction": "寅申과 달리 육합·파에 겹치고 충 쌍은 아니다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "서로 협조하지만 승인 절차가 반복 충돌한다면 승인 권한을 확인한다.",
      "action": "재승인이 필요한 경우만 정한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:yukhap:巳申",
      "rr:combination:pa:巳申"
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:申寅",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "申",
      "寅"
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
        "symbol": "寅",
        "element": "WOOD",
        "yinYang": "yang",
        "hiddenStems": [
          "甲",
          "丙",
          "戊"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "申→寅은 순환형의 일부이며 충에도 해당한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "申:METAL·yang·장간 庚壬戊 / 寅:WOOD·yang·장간 甲丙戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "申·寅의 실제 두 자리, 巳의 유무를 따로 기록한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "대향과 순환 분류의 서로 다른 조건을 함께 볼 수 있다.",
    "risk": "충이니 모든 형 작용을 알았다고 하거나 형이니 사고를 추가하지 않는다.",
    "reversal": "같은 pair의 여러 이름은 판단을 풍부하게 할 수 있어도 새로운 사건 근거가 아니다.",
    "distinction": "寅巳·巳申과 달리 대향 충을 포함한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 변경 요청과 검토 요청이 같은 문제를 반복한다면 중복 검토를 확인한다.",
      "action": "한 번 확인한 근거와 새로 생긴 조건을 구분한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:chung:寅申"
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:丑戌",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "丑",
      "戌"
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
      "text": "丑→戌 방향의 일부; 未 없는 상태를 완전 丑戌未라 하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "丑:EARTH·yin·장간 己癸辛 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丑·戌 두 저장 지지의 실제 자리와 未의 유무를 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "장간의 서로 다른 제약을 구체적으로 비교할 수 있다.",
    "risk": "같은 토의 반복으로 모든 기능이 같다고 하지 않는다.",
    "reversal": "제약하는 대상이 무엇인지 알기 전에는 유불리를 고정할 수 없다.",
    "distinction": "戌未와 달리 현행 파 표의 동일 쌍이 아니다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "기존 규칙끼리 실제 충돌한다면 적용 범위가 다른지 확인한다.",
      "action": "상위 규칙과 현장 규칙의 경계를 적는다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:戌未",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "戌",
      "未"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "戌",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": [
          "戊",
          "辛",
          "丁"
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
      "text": "戌→未 방향의 일부이며 현재 육파 표와 겹친다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "戌:EARTH·yang·장간 戊辛丁 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "戌·未의 실제 두 자리와 丑의 유무를 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "형의 순환 조건과 파의 분류를 나누어 검토한다.",
    "risk": "형·파가 함께 있으니 배신·처벌이 온다고 단정하지 않는다.",
    "reversal": "같은 연결에 붙은 여러 이름보다 실제 제약 대상을 우선할 수 있다.",
    "distinction": "丑戌과 달리 파에 겹치고 丑未처럼 충 쌍은 아니다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 유지 규칙이 수정 규칙과 충돌하면 어떤 기준을 우선할지 확인한다.",
      "action": "수정 사유와 유지해야 할 조건을 함께 기록한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:pa:未戌"
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:未丑",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "未",
      "丑"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "未",
        "element": "EARTH",
        "yinYang": "yin",
        "hiddenStems": [
          "己",
          "丁",
          "乙"
        ]
      },
      {
        "symbol": "丑",
        "element": "EARTH",
        "yinYang": "yin",
        "hiddenStems": [
          "己",
          "癸",
          "辛"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "未→丑 방향의 일부이며 丑未충과 같은 구성이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "未:EARTH·yin·장간 己丁乙 / 丑:EARTH·yin·장간 己癸辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "未·丑의 실제 두 자리와 戌의 유무를 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "계절·장간 차이와 순환 일부를 함께 검토한다.",
    "risk": "토충·형이 있다는 이유로 재고가 열리거나 가족 문제가 난다고 하지 않는다.",
    "reversal": "서로 다른 저장 조건을 분리하면 같은 토라는 성급한 판단을 줄일 수 있다.",
    "distinction": "丑戌·戌未와 달리 대향 충이 함께 있다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 오래된 예산 원칙과 새 지출 기준이 충돌하면 기간과 목적을 대조한다.",
      "action": "예외 승인 조건을 명확히 한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:chung:丑未"
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:子卯",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "子",
      "卯"
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
        "symbol": "卯",
        "element": "WOOD",
        "yinYang": "yin",
        "hiddenStems": [
          "乙"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "無禮之刑 전승이지만 무례한 인격·성별 도덕성으로 쓰지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 卯:WOOD·yin·장간 乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "子·卯 서로 다른 실제 위치가 필요하며 반복과 합해법을 함께 검토한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "대표 수생목이 곧 무제약 관계가 아니라는 검토가 가능하다.",
    "risk": "상생이니 형이 없다고 하거나 형이니 부모자녀 불화를 예언하지 않는다.",
    "reversal": "수정 가능한 기대 차이를 확인할 질문으로 제한한다.",
    "distinction": "순환 삼형과 달리 子卯의 이자 관계 자체가 형 분류다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 배려가 지시로 받아들여졌다면 어떤 행동이 달랐는지 확인한다.",
      "action": "의도 설명보다 요청받은 행동을 먼저 묻는다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:辰辰",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "辰",
      "辰"
    ],
    "form": "self_pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "辰",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": [
          "戊",
          "乙",
          "癸"
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
      "text": "고전의 辰見辰 자형과 제형 조건; 하나의 辰을 복제하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "辰:EARTH·yang·장간 戊乙癸 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "서로 다른 두 자리에 辰이 실제 반복되어야 한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 기호 반복과 주변 구성의 차이를 함께 살필 수 있다.",
    "risk": "수묘 반복을 우울·자해·자기파괴로 읽지 않는다.",
    "reversal": "반복을 줄이는 것보다 필요한 작용을 살리는 조건이 중요하다.",
    "distinction": "午午·酉酉·亥亥와 대표 오행·장간이 달라 같은 심리를 복제하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제로 같은 검토를 반복하고 있다면 새 정보가 있었는지 확인한다.",
      "action": "반복 검토의 종료 기준을 정한다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:午午",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "午",
      "午"
    ],
    "form": "self_pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "午",
        "element": "FIRE",
        "yinYang": "yang",
        "hiddenStems": [
          "丁",
          "己"
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
      "text": "午見午 자형 전승이며 고전은 제어가 있는 경우를 별도 논한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "午:FIRE·yang·장간 丁己 / 午:FIRE·yang·장간 丁己; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "서로 다른 실제 두 위치의 午와 화의 월령·제어를 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "집중된 작용의 과도를 조절할 조건을 검토할 수 있다.",
    "risk": "화 반복으로 분노·사고·심장질환을 확정하지 않는다.",
    "reversal": "작용을 없애기보다 필요한 양을 남기는 검토가 가능하다.",
    "distinction": "辰辰의 저장 지지와 달리 午는 화 왕지의 반복이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제로 일정을 과밀하게 반복한다면 누가 요청한 일인지 확인한다.",
      "action": "필수 일정과 관성적으로 반복한 일정을 나눈다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:酉酉",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "酉",
      "酉"
    ],
    "form": "self_pair",
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
        "symbol": "酉",
        "element": "METAL",
        "yinYang": "yin",
        "hiddenStems": [
          "辛"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "酉見酉 자형 전승; 고전의 과강·제형 논설은 현대 완벽주의의 증거가 아니다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "酉:METAL·yin·장간 辛 / 酉:METAL·yin·장간 辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "두 별도 위치의 酉를 확인하고 금의 계절·다른 작용을 본다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 기능의 집중에 조절이 필요한지 질문할 수 있다.",
    "risk": "금 반복으로 냉혹·범죄·정신 문제를 부여하지 않는다.",
    "reversal": "집중된 기준이 현실에 유용한지 먼저 확인한다.",
    "distinction": "午午와 같은 왕지 반복이나 대표 오행과 제어 대상이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 작은 오류를 계속 고치느라 제출이 늦다면 허용 기준을 확인한다.",
      "action": "완성 기준과 제출 기준을 분리한다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:亥亥",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "亥",
      "亥"
    ],
    "form": "self_pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "亥",
        "element": "WATER",
        "yinYang": "yin",
        "hiddenStems": [
          "壬",
          "甲"
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
      "text": "亥見亥 자형 전승; 수의 기세와 제약을 함께 논한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "亥:WATER·yin·장간 壬甲 / 亥:WATER·yin·장간 壬甲; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "두 실제 위치의 亥와 수·목 장간 및 계절을 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "기호 반복만으로 결론 내리지 않고 구성의 여력을 살필 수 있다.",
    "risk": "반복 수로 비밀·불안·질병을 추정하지 않는다.",
    "reversal": "같은 기호라도 역할·기둥이 다르면 단순 반복 효과가 아니다.",
    "distinction": "辰辰과 수에 관련되지만 亥는 수 생왕 논의와 목 장간을 가진다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제로 혼자 생각하는 시간이 늘었다면 해결에 필요한 정보가 빠졌는지 묻는다.",
      "action": "생각만으로 채울 수 없는 정보를 요청한다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:寅巳申",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "寅",
      "巳",
      "申"
    ],
    "form": "triple",
    "producerMembership": "historical_group_only",
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
      },
      {
        "symbol": "申",
        "element": "METAL",
        "yinYang": "yang",
        "hiddenStems": [
          "庚",
          "壬",
          "戊"
        ]
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "고전 전체 순환형. 현행 함수의 세 쌍을 묶은 새 전체 Evidence는 만들지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 巳:FIRE·yin·장간 丙戊庚 / 申:METAL·yang·장간 庚壬戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅·巳·申의 세 다른 실제 글자를 모두 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "다중 제약의 참여자를 각각 구분하는 연구가 가능하다.",
    "risk": "세 방향 전체를 흉사 확정 또는 위험3배로 읽지 않는다.",
    "reversal": "한 제약의 변화가 다른 연결을 바꿀 수 있어 단일 해법의 한계를 살핀다.",
    "distinction": "같은 세 자리에는 육합·해·충·파가 일부 겹치므로 형만으로 전체를 축약하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "세 담당자의 승인 조건이 실제 순환 충돌한다면 각각의 거절 사유를 확인한다.",
      "action": "결정 권한과 필요한 정보를 한 표에 기록한다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [],
    "unsupportedProducerScopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ]
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:hyeong:丑戌未",
    "relation": "hyeong",
    "targetId": "foundation:relation:hyeong",
    "members": [
      "丑",
      "戌",
      "未"
    ],
    "form": "triple",
    "producerMembership": "historical_group_only",
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
        "symbol": "戌",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": [
          "戊",
          "辛",
          "丁"
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
      "text": "고전 전체 삼형이며 無恩·恃勢 명칭을 바꾸는 전승이 병기되어 있다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "composition": "丑:EARTH·yin·장간 己癸辛 / 戌:EARTH·yang·장간 戊辛丁 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丑·戌·未 세 저장 지지를 모두 확인한다.",
    "exclusions": [
      "한 개 辰만으로 辰辰 자형을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 참여 지지·장간의 왕쇠와 다른 조절을 확인한다. 자형·상형은 법적 형벌이나 자해가 아니며 완전 삼형 검출 함수는 현행 경로에 없다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 토 안의 다른 장간과 관계를 함께 검토할 수 있다.",
    "risk": "토3개만 세어 장간·계절과 전체 기세를 생략하지 않는다.",
    "reversal": "서로 다른 저장 기능의 조정이 필요한지 연구할 수 있다.",
    "distinction": "三土 집합과 四庫 辰戌丑未는 글자 수도 구성도 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "세 부서가 실제 각기 다른 기준으로 비용을 잡는다면 기준의 목적을 대조한다.",
      "action": "책임 범위와 승인 순서를 확인한다.",
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
      "삼명통회 주 설명은 寅巳申 無恩·丑戌未 恃勢이며 병기한 다른 전승은 이름을 바꾼다.",
      "자평진전은 三刑 취의의 이유를 미결로 두기도 한다. 하나의 근원 이론으로 확정하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [],
    "unsupportedProducerScopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ]
  }
] as const satisfies readonly RelationCombination[];
