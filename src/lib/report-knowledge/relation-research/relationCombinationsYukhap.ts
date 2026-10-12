import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_YUKHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:子丑",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "members": [
      "子",
      "丑"
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
      "text": "육합 목록의 한 쌍이다. 고전의 주객별 평가와 현행 대칭 검출은 다르다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 丑:EARTH·yin·장간 己癸辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "子水·丑土가 실제 별도 자리에 있어야 하며 동절 토수의 여력을 검토한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "배합과 본래 토수 제약이 공존하는 조건을 확인할 수 있다.",
    "risk": "丑의 장간과 계절을 생략하고 합화토를 확정하지 않는다.",
    "reversal": "느슨한 연결이 원래 기능을 남길 수도 있다.",
    "distinction": "午未 역시 토 참여 육합이나 상대 오행과 계절이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 함께 쓰는 자원의 사용 시간이 다르면 운영 규칙을 확인한다.",
      "action": "사용권과 보관 책임을 나눈다.",
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:寅亥",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "members": [
      "寅",
      "亥"
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
      "text": "육합 전승이며 현행 파 표와도 겹친다. 합 뒤 파괴라는 사건 순서가 아니다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 亥:WATER·yin·장간 壬甲; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅木·亥水의 실제 두 자리와 목을 돕는 수의 여력을 확인한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "생조와 배합이 함께 나타나는 구성을 검토할 수 있다.",
    "risk": "생조가 과하거나 다른 필요한 기능을 묶는지 추가 검토가 필요하다.",
    "reversal": "도움의 양을 줄이는 것이 대상의 자립을 남길 수 있다.",
    "distinction": "巳申과 같은 합·파 겹침이나 본래 오행은 수생목이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "도움을 계속 주는데 상대가 원하지 않는 상황이라면 요청 여부를 확인한다.",
      "action": "필요한 지원과 원치 않는 개입을 묻는다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:pa:寅亥"
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:卯戌",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "members": [
      "卯",
      "戌"
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
      "text": "육합 쌍으로 자평진전의 卯酉충 해법 예에 등장하지만 자동 해충 규칙은 아니다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "卯:WOOD·yin·장간 乙 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "卯木·戌土가 있어야 하며 목토의 기세·戌의 장간을 함께 검토한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "제약과 배합이 겹치는 구성을 전체 관계도에서 비교할 수 있다.",
    "risk": "戌이 다른 삼합에 참여하면 해충이 유지된다고 단정할 수 없다.",
    "reversal": "연결 하나가 다른 충의 작용을 달리할 수 있으나 새로운 결과를 보장하지 않는다.",
    "distinction": "辰酉와 다른 목토 배합이며 卯의 충 상대 酉를 실제로 보아야 해충 문맥이 성립한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "당사자 사이의 중재가 실제 다른 약속과 충돌한다면 중재자의 가능한 범위를 확인한다.",
      "action": "중재 가능한 약속만 명시한다.",
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:辰酉",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "members": [
      "辰",
      "酉"
    ],
    "form": "pair",
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
      "text": "육합이며 卯酉충의 해법 예가 있으나 원국 전체의 배합 조건이 필요하다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "辰:EARTH·yang·장간 戊乙癸 / 酉:METAL·yin·장간 辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "辰土·酉金의 두 자리와 장간·금의 여력을 확인한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "토생금과 배합의 관계를 분리하여 필요한 지원을 살필 수 있다.",
    "risk": "辰이 수국·충 등에 관여하면 같은 기능으로 고정할 수 없다.",
    "reversal": "지원의 집중이 다른 기능의 여력을 줄일 가능성도 검토한다.",
    "distinction": "子丑의 토수 제약과 달리 대표 오행은 토생금이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "자료를 넘기는 협업에서 받는 쪽의 기준이 불명확하면 전달 조건을 맞춘다.",
      "action": "완료 기준과 인수 기준을 따로 합의한다.",
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:巳申",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
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
      "text": "육합 쌍이자 현행 형·파의 겹침이다. 고전 원리와 현대 파 표를 같은 전거로 합치지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 申:METAL·yang·장간 庚壬戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "巳火·申金의 실제 두 자리와 계절별 여력을 확인한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "결속과 제약이 공존하는 구성을 한 가지 길흉으로 축약하지 않을 수 있다.",
    "risk": "합이 있으니 형·파가 사라졌다고 하거나 셋이면 위험3배라고 할 수 없다.",
    "reversal": "결속이 있다는 사실이 조정 필요성을 함께 보여줄 수도 있다.",
    "distinction": "寅亥는 생조를 포함하지만 巳申의 대표 오행은 화극금이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "같은 팀인데 업무 방식이 계속 어긋난다면 팀 소속과 작업 규칙을 구분한다.",
      "action": "협업 의지와 실제 절차 적합성을 각각 확인한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hyeong:巳申",
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:yukhap:午未",
    "relation": "yukhap",
    "targetId": "foundation:relation:yukhap",
    "members": [
      "午",
      "未"
    ],
    "form": "pair",
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
      "text": "육합의 한 쌍이며 화토 논의와 현실 궁합 성공은 별개다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "composition": "午:FIRE·yang·장간 丁己 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "午火·未土의 실제 쌍과 하절 기세·건습을 확인한다.",
    "exclusions": [
      "짝의 한 글자가 없는데 합록·공허 이론으로 채우는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "월령·각 지지의 장간·주변 기세를 확인하며 화한 오행은 별도 판본 비교가 필요하다. 합을 합화·결혼·동의·평화로 환산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "생조와 배합이 어떤 기능에 집중되는지 검토할 수 있다.",
    "risk": "화생토만 보고 전체에 필요한 균형이라고 확정하지 않는다.",
    "reversal": "잘 맞는 연결이 과도하면 다른 기능을 남기는 것이 도움이 될 수 있다.",
    "distinction": "子丑과 모두 토 참여지만 화생토와 동절 토수는 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "함께 추진하는 일이 실제 일정을 과밀하게 만들면 감당 가능한 양을 확인한다.",
      "action": "같이 할 일의 수와 쉬는 시간을 함께 합의한다.",
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
      "고전의 방향별 복 차이를 현행 대칭 표에서 계산한 것처럼 말하지 않는다.",
      "육합의 화오행은 이 레지스트리에서 새 판정을 만들지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
] as const satisfies readonly RelationCombination[];
