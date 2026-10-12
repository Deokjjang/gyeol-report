import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_SAMHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:samhap:申子辰",
    "relation": "samhap",
    "targetId": "foundation:relation:samhap",
    "members": [
      "申",
      "子",
      "辰"
    ],
    "form": "triple",
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
        "symbol": "子",
        "element": "WATER",
        "yinYang": "yang",
        "hiddenStems": [
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
      "text": "생·왕·고의 수국 전승; 한 글자가 없으면 완전 삼합 화국과 다르다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "composition": "申:METAL·yang·장간 庚壬戊 / 子:WATER·yang·장간 癸 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "申·子·辰 세 다른 글자와 수의 생왕고 역할을 확인한다.",
    "exclusions": [
      "반합에 없는 글자를 가정해 삼합을 완성하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "특정 오행의 기세·투간·월령·방해 조건을 별도로 확인한다. 현행 함수는 셋의 존재를 판정하며 완전한 화국 성립을 계산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "시작·중심·갈무리의 실제 집결을 검토할 수 있다.",
    "risk": "수의 집결을 누구에게나 유익한 유연성·재물로 바꾸지 않는다.",
    "reversal": "집중이 필요 없는 구성이라면 다른 기능의 여력 보존이 더 중요하다.",
    "distinction": "세 지지의 대표 오행은 금·수·토이며 각 글자를 모두 수로 지우지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "팀이 기획·실행·정리를 실제 갖췄다면 역할이 한 목표로 연결되는지 확인한다.",
      "action": "세 역할의 인계 지점을 적는다.",
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
      "자평진전 七의 三會 용례는 이 절에서 申子辰 같은 삼합을 가리킨다. 현대 방합 三會와 자동 병합하지 않는다.",
      "고전의 네 토지 토국은 현재 4삼합 검출 목록에 없으며 새 삼합으로 추가하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:samhap:亥卯未",
    "relation": "samhap",
    "targetId": "foundation:relation:samhap",
    "members": [
      "亥",
      "卯",
      "未"
    ],
    "form": "triple",
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
        "symbol": "卯",
        "element": "WOOD",
        "yinYang": "yin",
        "hiddenStems": [
          "乙"
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
      "text": "목국 전승이며 부족한 卯·未·亥를 다른 기호로 대체하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "composition": "亥:WATER·yin·장간 壬甲 / 卯:WOOD·yin·장간 乙 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "亥·卯·未의 목 생왕고 실제 세 자리와 월령을 확인한다.",
    "exclusions": [
      "반합에 없는 글자를 가정해 삼합을 완성하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "특정 오행의 기세·투간·월령·방해 조건을 별도로 확인한다. 현행 함수는 셋의 존재를 판정하며 완전한 화국 성립을 계산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "한 방향을 지속할 구성인지 전체 여력을 비교할 수 있다.",
    "risk": "목 집결을 자동 성장·합격·사업 확장으로 해석하지 않는다.",
    "reversal": "방향이 모여도 과제의 필요와 맞지 않으면 분산이 도움이 될 수 있다.",
    "distinction": "대표 오행 수·목·토의 조합으로 寅卯辰 방합과 다른 목록이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "기획에서 유지까지 같은 과제를 맡는다면 확장보다 완수 조건을 확인한다.",
      "action": "새로 늘릴 일과 마무리할 일을 구분한다.",
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
      "자평진전 七의 三會 용례는 이 절에서 申子辰 같은 삼합을 가리킨다. 현대 방합 三會와 자동 병합하지 않는다.",
      "고전의 네 토지 토국은 현재 4삼합 검출 목록에 없으며 새 삼합으로 추가하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:samhap:寅午戌",
    "relation": "samhap",
    "targetId": "foundation:relation:samhap",
    "members": [
      "寅",
      "午",
      "戌"
    ],
    "form": "triple",
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
        "symbol": "午",
        "element": "FIRE",
        "yinYang": "yang",
        "hiddenStems": [
          "丁",
          "己"
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
      "text": "화국 전승이며 합국과 실제 화기의 우세 판정은 다르다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 午:FIRE·yang·장간 丁己 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅·午·戌 세 실제 글자와 화의 생왕고·기세를 확인한다.",
    "exclusions": [
      "반합에 없는 글자를 가정해 삼합을 완성하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "특정 오행의 기세·투간·월령·방해 조건을 별도로 확인한다. 현행 함수는 셋의 존재를 판정하며 완전한 화국 성립을 계산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "실제 추진 역할이 연결될 조건을 검토한다.",
    "risk": "화국을 유명세·열정·공개 성공으로 단정하지 않는다.",
    "reversal": "집중을 잠시 줄이는 것이 감당 가능한 실행을 남길 수도 있다.",
    "distinction": "대표 오행 목·화·토이며 寅戌만 있는 경우에는 午가 없다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "공동 발표를 실제 준비한다면 시작·발표·후속 정리의 책임을 나눈다.",
      "action": "공개 활동 뒤 정리 담당을 확인한다.",
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
      "자평진전 七의 三會 용례는 이 절에서 申子辰 같은 삼합을 가리킨다. 현대 방합 三會와 자동 병합하지 않는다.",
      "고전의 네 토지 토국은 현재 4삼합 검출 목록에 없으며 새 삼합으로 추가하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
  },
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:samhap:巳酉丑",
    "relation": "samhap",
    "targetId": "foundation:relation:samhap",
    "members": [
      "巳",
      "酉",
      "丑"
    ],
    "form": "triple",
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
        "symbol": "酉",
        "element": "METAL",
        "yinYang": "yin",
        "hiddenStems": [
          "辛"
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
      "text": "금국 전승이며 酉 없는 巳丑는 왕지 없는 부분 조합이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 酉:METAL·yin·장간 辛 / 丑:EARTH·yin·장간 己癸辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "巳·酉·丑의 금 생왕고 세 구성과 계절·통근을 확인한다.",
    "exclusions": [
      "반합에 없는 글자를 가정해 삼합을 완성하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "특정 오행의 기세·투간·월령·방해 조건을 별도로 확인한다. 현행 함수는 셋의 존재를 판정하며 완전한 화국 성립을 계산하지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "여러 기능이 한 판단 기준으로 모이는 조건을 살필 수 있다.",
    "risk": "금 집결을 금융 능력·냉정함·부를 증명하는 자료로 쓰지 않는다.",
    "reversal": "집중된 기준이 필요한 여백을 줄이면 조정이 유익할 수 있다.",
    "distinction": "대표 오행 화·금·토이며 申酉戌 방합이나 午未 육합과 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "공동 작업의 기준을 실제 통일해야 한다면 수집·판단·보존 역할을 대조한다.",
      "action": "검토 기준과 예외 승인자를 정한다.",
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
      "자평진전 七의 三會 용례는 이 절에서 申子辰 같은 삼합을 가리킨다. 현대 방합 三會와 자동 병합하지 않는다.",
      "고전의 네 토지 토국은 현재 4삼합 검출 목록에 없으며 새 삼합으로 추가하지 않는다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
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
] as const satisfies readonly RelationCombination[];
