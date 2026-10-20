import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_BANHAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:banhap:申子",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "申",
      "子"
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
        "symbol": "子",
        "element": "WATER",
        "yinYang": "yang",
        "hiddenStems": [
          "癸"
        ]
      }
    ],
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "삼합 원리의 생왕 부분, 현대 왕지 포함 반합 전승과 저장소12쌍 정책에 모두 속한다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "申:METAL·yang·장간 庚壬戊 / 子:WATER·yang·장간 癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "수국의 생지申·왕지子 두 자리이며 辰은 실제로 없다면 보충하지 않는다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "시작과 중심의 연결 가능성을 제한적으로 검토한다.",
    "risk": "갈무리 辰이 있다고 가정해 완성 화국으로 읽지 않는다.",
    "reversal": "부족한 구성을 인정하는 것이 무리한 완성 선언을 줄일 수 있다.",
    "distinction": "子辰은 왕고이고 申辰은 왕지 없는 생고다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "시작과 실행은 맞지만 정리 담당이 실제 없다면 마무리 조건을 확인한다.",
      "action": "종료 담당과 보존할 결과물을 정한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:申辰",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "申",
      "辰"
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
      "text": "왕지 없는 생고는 미채택·약한 반합이라는 현대 이견이 있다. 고전 완전 화국이 아니다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "申:METAL·yang·장간 庚壬戊 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "수국의 생지申·고지辰이며 왕지子가 없다면 없다 그대로 둔다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심 역할이 확인되지 않은 연결로 검토 범위를 제한할 수 있다.",
    "risk": "子를 공허로 채워 수국의 힘을 확정하지 않는다.",
    "reversal": "유보가 필요한 구성을 드러내는 것이 후보의 긍정적 쓰임이다.",
    "distinction": "申子·子辰과 달리 왕지 포함8쌍에 들지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "기획과 보관은 있는데 실제 실행 결정을 할 사람이 없다면 결정권을 확인한다.",
      "action": "중심 역할을 확보하기 전 확장을 보류한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:子辰",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "子",
      "辰"
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
      "text": "수국의 왕고 부분이며 부분 구성과 세 자리 완성은 다르다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "子:WATER·yang·장간 癸 / 辰:EARTH·yang·장간 戊乙癸; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "왕지子·고지辰 두 자리와 생지申의 실제 유무를 확인한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심과 갈무리의 연결을 별도 관점으로 검토한다.",
    "risk": "시작 기능申까지 있다고 쓰지 않는다.",
    "reversal": "새 시작보다 현재 연결의 정리가 유용한 조건일 수 있다.",
    "distinction": "申子의 생왕 부분과 빠진 역할이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "진행과 정리는 맞는데 새 과제의 시작 조건이 없다면 시작 권한을 확인한다.",
      "action": "새 요청을 받는 기준을 만든다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:亥卯",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "亥",
      "卯"
    ],
    "form": "pair",
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
      }
    ],
    "traditional": {
      "class": "E_UNVERIFIED",
      "text": "왕지 포함 생왕 반합으로 현대 전승과 코드에 모두 해당한다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "亥:WATER·yin·장간 壬甲 / 卯:WOOD·yin·장간 乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "목국 생지亥·왕지卯의 실제 두 자리이며 未를 가정하지 않는다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "시작과 중심에 해당하는 부분 연결을 연구할 수 있다.",
    "risk": "목 연결을 성장·합격의 보장으로 바꾸지 않는다.",
    "reversal": "연결 범위를 작게 남겨 실제 완수 여력을 확인할 수 있다.",
    "distinction": "卯未는 왕고이고 亥未는 왕지 없는 생고다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "새 아이디어를 실제 진행한다면 끝낼 방식이 마련됐는지 확인한다.",
      "action": "완수 후 맡을 사람을 먼저 정한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:亥未",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "亥",
      "未"
    ],
    "form": "pair",
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
      "class": "E_UNVERIFIED",
      "text": "왕지 없는 반합은 이견 대상이며12쌍 검출과 보편 성립을 구별한다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "亥:WATER·yin·장간 壬甲 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "목국 생지亥·고지未이며 왕지卯가 빠진 구성을 보존한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심 역할의 부재를 검토 질문으로 드러낼 수 있다.",
    "risk": "없는 卯를 있다고 하거나 미약한 완전 목국이라 수치화하지 않는다.",
    "reversal": "불완전한 후보가 추가 자료가 필요한 이유를 보여준다.",
    "distinction": "亥卯·卯未와 왕지 포함 여부가 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "시작 자원과 정리 도구는 있지만 실제 운영자가 없다면 운영 책임을 확인한다.",
      "action": "운영 책임 없는 상태에서 약속을 늘리지 않는다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:卯未",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "卯",
      "未"
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
      "class": "E_UNVERIFIED",
      "text": "왕고 부분이며 완전 삼합으로 확장하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "卯:WOOD·yin·장간 乙 / 未:EARTH·yin·장간 己丁乙; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "목국 왕지卯·고지未 두 자리와 亥의 실제 유무를 확인한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심의 작용과 갈무리의 연결을 따로 볼 수 있다.",
    "risk": "잘 마무리한다는 성격이나 가족 안정으로 단정하지 않는다.",
    "reversal": "마무리가 마련됐어도 시작 조건은 별도 질문일 수 있다.",
    "distinction": "亥卯와 빠진 구성의 역할이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "지속하는 과제가 실제 있다면 신규 시작을 누가 맡는지 확인한다.",
      "action": "현재 운영과 신규 착수의 책임을 구분한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:寅午",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "寅",
      "午"
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
      "text": "왕지 포함 생왕 부분이며 실제 합화는 다른 검토다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 午:FIRE·yang·장간 丁己; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "화국 생지寅·왕지午의 실제 두 자리이며 戌을 채우지 않는다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "추진의 시작과 중심이 연결되는 조건을 살필 수 있다.",
    "risk": "발표 성공·열정·명성을 기호에서 추정하지 않는다.",
    "reversal": "범위를 작게 시험하면 없는 마무리 조건을 확인할 수 있다.",
    "distinction": "午戌은 왕고, 寅戌은 왕지 없는 생고다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 행사를 시작한다면 진행 후 정리와 인계가 가능한지 확인한다.",
      "action": "행사 뒤 처리 목록을 정한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:寅戌",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "寅",
      "戌"
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
      "text": "왕지 없는 부분 연결의 미채택·약화 견해와 현행 검출을 따로 둔다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "寅:WOOD·yang·장간 甲丙戊 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "화국 생지寅·고지戌이며 왕지午가 빠졌는지 확인한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심 역할이 확인되지 않았음을 연구 한계로 남길 수 있다.",
    "risk": "지장간火가 있다는 이유로 실제 午를 생성하지 않는다.",
    "reversal": "강한 방향을 선언하지 않는 것이 다른 가능성을 남긴다.",
    "distinction": "寅午·午戌과 달리 엄격8쌍 목록에서 제외된다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "아이디어와 종료 계획만 실제 있다면 실행을 누가 맡는지 확인한다.",
      "action": "실행 책임과 실행 자원을 먼저 확인한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:午戌",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "午",
      "戌"
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
      "text": "왕고 부분이며 셋의 모두 존재와 다르다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "午:FIRE·yang·장간 丁己 / 戌:EARTH·yang·장간 戊辛丁; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "화국 왕지午·고지戌 두 자리와 寅의 실제 유무를 확인한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심과 정리의 역할을 비교할 수 있다.",
    "risk": "화국의 완성·인기·정리 능력을 단정하지 않는다.",
    "reversal": "현재 과제의 마무리가 새 시작보다 우선일 수 있는지 현실에서 확인한다.",
    "distinction": "寅午의 생왕 부분과 없는 역할이 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "진행 중인 공동 활동이 실제 있다면 새 기획의 승인 기준을 확인한다.",
      "action": "마무리와 새 기획을 같은 약속으로 묶지 않는다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:巳酉",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "巳",
      "酉"
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
      "text": "왕지 포함 생왕 반합 전승이며 완전 금국과 다르다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 酉:METAL·yin·장간 辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "금국 생지巳·왕지酉의 실제 두 글자이며 丑은 없다면 채우지 않는다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "시작과 중심의 부분 연결을 살필 수 있다.",
    "risk": "금국의 재물·판단 능력을 작은 연결에서 확정하지 않는다.",
    "reversal": "실제 결과를 보관할 기능이 있는지 질문할 수 있다.",
    "distinction": "酉丑은 왕고, 巳丑는 왕지 없는 생고다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "평가를 실제 시작한다면 결과를 보존하고 인계할 기준을 확인한다.",
      "action": "판단 이후 기록 책임을 정한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:巳丑",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "巳",
      "丑"
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
      "class": "E_UNVERIFIED",
      "text": "왕지 없는 부분 전승 차이로 직접 효과는 미확정이다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "巳:FIRE·yin·장간 丙戊庚 / 丑:EARTH·yin·장간 己癸辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "금국 생지巳·고지丑이며 왕지酉가 빠진 구성을 유지한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "필요한 중심 기능을 별도로 요구할 연구 질문이 된다.",
    "risk": "없던 酉의 판단 기능을 장간만으로 채웠다고 하지 않는다.",
    "reversal": "부분 연결을 유보하는 것이 무근거 완성 판정을 막는다.",
    "distinction": "巳酉·酉丑와 왕지 유무가 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "수집과 보관은 있는데 실제 판단자가 없다면 판단 권한을 확인한다.",
      "action": "판단 기준과 승인자를 확보한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
    "id": "rr:combination:banhap:酉丑",
    "relation": "banhap",
    "targetId": "foundation:relation:banhap",
    "members": [
      "酉",
      "丑"
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
      "class": "E_UNVERIFIED",
      "text": "왕고 부분으로 현대 왕지8쌍 전승에 속한다.",
      "sourceRefs": [
        {
          "sourceId": "half",
          "locator": "반합 / 유파 차이"
        }
      ]
    },
    "composition": "酉:METAL·yin·장간 辛 / 丑:EARTH·yin·장간 己癸辛; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "금국 왕지酉·고지丑 두 실제 자리와 巳의 유무를 확인한다.",
    "exclusions": [
      "왕지가 없는 寅戌에 午가 숨어 있다고 쓰는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "왕지 존재·계절·투출·다른 작용을 확인하되 지장간만으로 없는 왕지를 채우지 않는다. 12쌍은 저장소 정책;8쌍 엄격 전승과4쌍 약한/미채택 전승을 별도 목록으로 보존한다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "중심과 보존의 연결 범위를 검토할 수 있다.",
    "risk": "금이 완성됐으니 돈을 잘 지킨다는 능력으로 바꾸지 않는다.",
    "reversal": "운영과 보존이 맞아도 새 입력 조건은 별도다.",
    "distinction": "巳酉와 빠진 역할이 다르며 子丑 육합과도 다르다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "정해진 기준과 기록은 있지만 새 자료 수집이 실제 부족하면 입력 조건을 확인한다.",
      "action": "필요한 새 자료와 기존 자료를 구분한다.",
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
      "왕지8쌍/생고4쌍 차이는 확인한 현대 전승이며 모든 학파의 보편 규칙을 확정한 것이 아니다.",
      "현행12쌍 정책은 변경하지 않는다.",
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
