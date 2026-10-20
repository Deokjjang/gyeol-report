import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_PA = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:pa:子酉",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
    "members": [
      "子",
      "酉"
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
        "symbol": "酉",
        "element": "METAL",
        "yinYang": "yin",
        "hiddenStems": [
          "辛"
        ]
      }
    ],
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "현대 파6쌍의 하나. 현재 표의 고전 직접 전거·조합 고유 사건 의미는 미확인이다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 酉:METAL·yin·장간 辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "子水·酉金의 실제 두 자리와 본래 금생수 관계를 확인한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "생조와 파 표의 분류가 다름을 비교하는 연구가 가능하다.",
    "risk": "금이 녹슨다는 비유를 관계 법칙·건강 위험으로 사용하지 않는다.",
    "reversal": "파 분류가 있어도 실제 관계의 도움이 확인되면 그 사실을 우선한다.",
    "distinction": "寅亥·巳申과 달리 동일쌍 육합에 속하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 전달 체계에 작은 누락이 있다면 전체 관계를 탓하기 전 전달 단계를 확인한다.",
      "action": "누락이 생긴 연결부만 고친다.",
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
    "id": "rr:combination:pa:丑辰",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
    "members": [
      "丑",
      "辰"
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
      "class": "E_UNVERIFIED",
      "text": "현대 파 표의 토토 쌍이며 개고재물 해석을 입증하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "丑:EARTH·yin·장간 己癸辛 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丑·辰 두 토 지지와 서로 다른 장간·계절을 확인한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 토 대표값으로 사라지는 구성 차이를 드러낼 수 있다.",
    "risk": "창고 균열 비유로 재산 손실을 확정하지 않는다.",
    "reversal": "작은 수정이 유용할지는 실제 유지 조건에 달려 있다.",
    "distinction": "未戌은 형에도 겹치지만 丑辰은 현행 동일쌍 형이 아니다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 자료 보관 규칙이 맞지 않으면 어느 형식에서 누락되는지 확인한다.",
      "action": "보관 형식과 수정 이력을 합의한다.",
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
    "id": "rr:combination:pa:寅亥",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
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
      "class": "E_UNVERIFIED",
      "text": "현대 표는 육합과 파가 함께 있는 쌍으로 둔다. 단일한 고전 결론은 미확인이다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 亥:WATER·yin·장간 壬甲; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅木·亥水의 실제 두 자리와 생조·육합 겹침을 기록한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "연결의 존재와 유지 방식의 적합성을 나누어 질문할 수 있다.",
    "risk": "합 다음 반드시 파가 온다는 시계열을 만들지 않는다.",
    "reversal": "좋은 결속이 있어도 유지 방식을 조정할 필요는 있을 수 있다.",
    "distinction": "巳申의 합·형·파와 달리 동일쌍 형은 없다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "서로 실제 도움을 주지만 운영이 번거롭다면 도움과 절차를 분리한다.",
      "action": "도움의 가치를 보존하며 절차만 조정한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:yukhap:寅亥"
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
    "id": "rr:combination:pa:卯午",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
    "members": [
      "卯",
      "午"
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
      "class": "E_UNVERIFIED",
      "text": "현대 파6쌍 중 하나이며 생활 효과의 고전 직접 근거는 미확인이다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "卯:WOOD·yin·장간 乙 / 午:FIRE·yang·장간 丁己; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "卯木·午火 실제 두 자리와 목생화·계절을 확인한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "생조와 유지 조건의 차이를 검토할 수 있다.",
    "risk": "목이 불타 없어진다는 물리 비유로 소진·질병을 확정하지 않는다.",
    "reversal": "제작과 소비의 속도 차이를 실제로 확인한 경우에만 조정 질문이 된다.",
    "distinction": "子酉도 생조지만 오행·계절이 달라 같은 고유 성격을 복제하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제로 결과물을 만드는 속도와 쓰는 속도가 다르면 인계 주기를 확인한다.",
      "action": "산출량보다 사용 주기를 맞춘다.",
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
    "id": "rr:combination:pa:巳申",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
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
      "class": "E_UNVERIFIED",
      "text": "현대 파 표의 겹침 쌍. 세 이름의 독립 효력은 확인되지 않았다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 申:METAL·yang·장간 庚壬戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "巳火·申金 실제 두 자리와 육합·형의 겹침을 기록한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "협업과 제약·수정의 질문을 각각 분리할 수 있다.",
    "risk": "합·형·파를 협력→고통→배신이라는 사건 서사로 바꾸지 않는다.",
    "reversal": "같은 문제를 여러 이름으로 부르기보다 실제 병목 하나를 찾을 수 있다.",
    "distinction": "寅亥와 달리 본래 화극금·형이 함께 관여한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제로 합의한 작업이 자주 재승인된다면 승인 규칙을 확인한다.",
      "action": "재승인 사유와 책임자부터 정한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:yukhap:巳申",
      "rr:combination:hyeong:巳申"
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
    "id": "rr:combination:pa:未戌",
    "relation": "pa",
    "targetId": "foundation:relation:pa",
    "members": [
      "未",
      "戌"
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
      "class": "E_UNVERIFIED",
      "text": "현대 파6쌍의 하나이며 고전 순환형의 일부이기도 하다.",
      "sourceRefs": [
        {
          "sourceId": "pa",
          "locator": "여섯 쌍 / 파를 쓰지 않는 사람들"
        }
      ]
    },
    "composition": "未:EARTH·yin·장간 己丁乙 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "未·戌 실제 두 토 자리와 장간·형 겹침을 확인한다.",
    "exclusions": [
      "파를 배신·계약 파기·수술·자기파괴로 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "각 쌍의 본래 오행·장간·겹치는 관계를 기록하되 녹·소각 같은 물리 현상을 명리 법칙으로 만들지 않는다. 파를 쓰지 않거나 보조로만 쓰는 견해를 별도로 보존하고 가중치를 새로 정하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 조합에 붙은 다른 분류의 목적을 대조할 수 있다.",
    "risk": "형·파 공존으로 계약 파기나 법적 문제를 보장하지 않는다.",
    "reversal": "절차의 수정이 필요한지와 관계를 끝낼지의 판단은 별개다.",
    "distinction": "丑辰과 달리 동일쌍 형에 속하고 丑未충과는 목록이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 규정 수정 때문에 유지 업무가 흔들리면 영향받는 부분을 확인한다.",
      "action": "기존 책임을 유지하면서 바꿀 범위를 정한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hyeong:戌未"
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
      "현대 제공자 자체 설명만 확인; 원전·학파별 전체 교감은 보류.",
      "직접 분야별 효과는 검증되지 않았으며 아래 D는 실제 생활 조건이 있어야 하는 비유다.",
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
  }
] as const satisfies readonly RelationCombination[];
