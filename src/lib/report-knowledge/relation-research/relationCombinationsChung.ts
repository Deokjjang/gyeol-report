import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_CHUNG = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:chung:子午",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "子",
      "午"
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
      "text": "수화 충이며 적천수는 자왕오쇠와 자쇠오왕을 같은 결과로 보지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 午:FIRE·yang·장간 丁己; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "子水·午火의 대향과 월령별 왕쇠를 검토한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "필요 없어진 배치를 바꿀 조건인지 검토할 수 있다.",
    "risk": "충이라는 이유만으로 화·수 중 한쪽이 항상 사라진다고 할 수 없다.",
    "reversal": "왕한 쪽을 자극하는 것과 쇠한 뿌리를 흔드는 것은 방향이 다르다.",
    "distinction": "丑未와 달리 대표 오행이 수화의 직접 제어다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 집중 시간과 외부 일정이 맞부딪치면 둘을 동시에 지킬 수 있는지 확인한다.",
      "action": "보존할 시간과 옮길 시간을 선택한다.",
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
    "id": "rr:combination:chung:丑未",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "丑",
      "未"
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
      "text": "사고지 토의 충이다. 충해야 창고가 열린다는 보편 결론은 미확정이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "丑:EARTH·yin·장간 己癸辛 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "겨울 丑土·여름 未土의 두 자리와 장간 구성을 확인한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "같은 토라도 다른 저장 구성을 가진다는 비교가 가능하다.",
    "risk": "토가 같으니 무작용이라는 해석과 개고재물 예언을 모두 제한한다.",
    "reversal": "닫힌 구성을 흔드는 것이 항상 유익하지는 않다.",
    "distinction": "辰戌과 함께 토충이나 丑·未 장간과 계절이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "공동 보관·예산 방식이 다르다면 무엇을 유지하려는지 실제 목적을 확인한다.",
      "action": "재고와 예산의 실제 사용 목적을 대조한다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hyeong:未丑"
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
    "id": "rr:combination:chung:寅申",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "寅",
      "申"
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
      "text": "대표 목금 충이며 형 표에도 같은 쌍이 있다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 申:METAL·yang·장간 庚壬戊; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "寅木·申金의 대향과 장간의 여러 생극을 함께 검토한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "배치 변경의 필요와 보존할 기능을 같이 살필 수 있다.",
    "risk": "충·형의 겹침을 두 개의 독립 불행으로 세지 않는다.",
    "reversal": "제약의 조정이 기능을 살릴 수도 있으나 상대의 소멸을 전제하지 않는다.",
    "distinction": "卯酉의 목금 충보다 寅申은 각 장간이 복수이며 형에도 참여한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 추진 방식과 검토 방식이 충돌하면 어느 단계에서 문제가 나는지 확인한다.",
      "action": "제안 단계와 검토 단계를 나눈다.",
      "sourceRefs": [
        {
          "sourceId": "authored",
          "locator": "조합별 조건부 현대 질문; 독립 전통 사실·예측 효력 아님"
        }
      ]
    },
    "overlaps": [
      "rr:combination:hyeong:申寅"
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
    "id": "rr:combination:chung:卯酉",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "卯",
      "酉"
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
      "text": "목금 대향이며 자평진전은 辰·戌·다른 삼합의 개입 예를 비교한다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "卯:WOOD·yin·장간 乙 / 酉:METAL·yin·장간 辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "卯木·酉金의 두 자리와 각 월령·뿌리를 확인한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "서로 맞지 않는 기준의 구체적 수정 지점을 질문할 수 있다.",
    "risk": "酉金이 언제나 卯木을 압도한다고 고정할 수 없다.",
    "reversal": "중개가 존재해도 그 중개가 다른 곳에 묶이면 원래 충이 남을 수 있다.",
    "distinction": "寅申과 다르게 본기 중심 장간과 해충 예의 구성 조건을 검토한다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "표현 내용과 평가 기준이 실제 어긋난다면 기준을 바꾸는지 산출을 바꾸는지 선택한다.",
      "action": "고칠 대상과 유지할 강점을 함께 적는다.",
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
    "id": "rr:combination:chung:辰戌",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "辰",
      "戌"
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
      "text": "사고지 충이며 단순 토 개수나 자동 개고 해석으로 환원하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "辰:EARTH·yang·장간 戊乙癸 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "辰土·戌土와 각 지장간·건습·월령을 확인한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "서로 다른 저장·지원 구성을 비교할 연구 조건이 된다.",
    "risk": "충하면 숨은 재물이 나온다는 독립 명제는 반려한다.",
    "reversal": "새로 드러난 조건이 도움이 될지는 실제 용도에 달려 있다.",
    "distinction": "丑未와 계절·장간이 다르고 토라는 공통명만으로 같은 의미를 복제하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "예전에 묶어 둔 비용을 재검토해야 한다면 실제 계약과 사용 가능성을 확인한다.",
      "action": "묶인 자원과 당장 쓸 수 있는 자원을 구분한다.",
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
    "id": "rr:combination:chung:巳亥",
    "relation": "chung",
    "targetId": "foundation:relation:chung",
    "members": [
      "巳",
      "亥"
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
      "text": "수화 충이나 巳·亥는 서로 다른 삼합의 생지다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 亥:WATER·yin·장간 壬甲; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "巳火·亥水의 실제 대향과 각 장간의 기세를 확인한다.",
    "exclusions": [
      "사고·이혼·실직의 발생을 쌍에서 단정하는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕쇠·뿌리·노출·장간을 함께 보며 같은 쌍도 계절이 다르면 작용 평가가 다르다. 방향이 대립한다는 구조와 이동·실패라는 생활 결과를 구분한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "기존 기능이 어느 환경에서 제한되는지 질문할 수 있다.",
    "risk": "오행 대표값 하나로 장간의 모든 작용이 취소된다고 하지 않는다.",
    "reversal": "바뀐 조건이 기존의 유용한 역할을 드러낼 수도 있지만 예언은 아니다.",
    "distinction": "子午보다 장간 구성이 복수이고 두 생지의 여력을 별도로 본다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "준비와 실행의 생활 환경이 실제 달라졌다면 같은 방법을 계속 쓸 이유를 확인한다.",
      "action": "환경이 달라진 항목만 수정한다.",
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
      "적천수 본문·주석 전사는 층위가 섞여 있으며 후대 주석의 귀속을 단정하지 않는다.",
      "사고지 개고는 정설로 확정하지 않고 실제 재물과 연결하지 않는다.",
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
