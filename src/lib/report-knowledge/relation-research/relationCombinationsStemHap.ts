import type { RelationCombination } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_COMBINATIONS_STEM_HAP = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:combination:stem_hap:甲己",
    "relation": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "members": [
      "甲",
      "己"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "甲",
        "element": "WOOD",
        "yinYang": "yang",
        "hiddenStems": []
      },
      {
        "symbol": "己",
        "element": "EARTH",
        "yinYang": "yin",
        "hiddenStems": []
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "中正之合이라는 고전 별칭과 토화 논의가 있으나 인품의 중정함을 증명하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "composition": "甲:WOOD·yang / 己:EARTH·yin; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "甲木과 己土가 겉 천간에 각각 있어야 하며 갑목의 통근과 기토의 계절 여력을 비교한다.",
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다. 합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "필요한 기능을 해치지 않는 배합이면 서로의 작용을 조절할 조건을 검토한다.",
    "risk": "목극토와 합의 얽힘이 있으므로 기토가 배합만으로 강해졌다고 하지 않는다.",
    "reversal": "지나친 맞춤을 줄이는 것이 오히려 원래 필요한 기능을 남길 수 있다.",
    "distinction": "乙庚과 달리 목·토의 배합이며 전통 화기 방향은 토다. 화토 판정은 지원하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "역할을 맞추느라 실제 책임이 흐려진 상황이라면 원래 맡은 일부터 확인한다.",
      "action": "공동 합의와 개인 책임을 두 칸으로 나눈다.",
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
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
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
    "id": "rr:combination:stem_hap:乙庚",
    "relation": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "members": [
      "乙",
      "庚"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "乙",
        "element": "WOOD",
        "yinYang": "yin",
        "hiddenStems": []
      },
      {
        "symbol": "庚",
        "element": "METAL",
        "yinYang": "yang",
        "hiddenStems": []
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "仁義之合·금화가 전통 명칭이며 강유 조절이라는 상징이 인격의 의로움을 뜻하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "composition": "乙:WOOD·yin / 庚:METAL·yang; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "乙木·庚金의 노출과 각 통근을 확인하고 금왕 계절과 목의 여력을 별도로 본다.",
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다. 합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "제어와 배합이 동시에 검토되므로 양쪽 기능이 남는 조정을 질문할 수 있다.",
    "risk": "庚金의 제어를 합이 자동으로 없앤다고 읽을 수 없다.",
    "reversal": "조절이 유익하려면 보호할 기능과 남겨야 할 경계를 함께 확인한다.",
    "distinction": "甲己와 같은 목 참여라도 상대는 금이고 본래 금극목 관계다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "실제 기준을 맞추는 회의에서 한쪽 요구만 남는다면 수정할 기준을 특정한다.",
      "action": "양쪽의 변경 불가 조건을 먼저 적는다.",
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
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
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
    "id": "rr:combination:stem_hap:丙辛",
    "relation": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "members": [
      "丙",
      "辛"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "丙",
        "element": "FIRE",
        "yinYang": "yang",
        "hiddenStems": []
      },
      {
        "symbol": "辛",
        "element": "METAL",
        "yinYang": "yin",
        "hiddenStems": []
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "威制之合·수화 논의가 있으나 권위·성적 행동·도덕성의 고전 단정을 사용하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "composition": "丙:FIRE·yang / 辛:METAL·yin; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丙火·辛金을 실제로 확인하고 화금의 여력·월령·화신 수의 조건을 따로 검토한다.",
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다. 합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "필요한 제어를 배합 속에서 어떻게 유지할지 살피는 후보가 된다.",
    "risk": "화가 금을 제어하는 조건을 수화 확정으로 지우면 실제 근거가 사라진다.",
    "reversal": "합이 강해 보여도 유용한 기능을 붙잡으면 선택을 재검토할 이유가 된다.",
    "distinction": "丁壬도 화·수가 관련되지만 이 쌍의 원래 두 오행은 화·금이다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "평가와 협력이 같은 자리에서 이루어져 혼란스럽다면 평가 기준을 따로 확인한다.",
      "action": "협력 약속과 평가 권한을 분리한다.",
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
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
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
    "id": "rr:combination:stem_hap:丁壬",
    "relation": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "members": [
      "丁",
      "壬"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "丁",
        "element": "FIRE",
        "yinYang": "yin",
        "hiddenStems": []
      },
      {
        "symbol": "壬",
        "element": "WATER",
        "yinYang": "yang",
        "hiddenStems": []
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "淫慝之合이라는 역사적 명칭은 기록하되 음란·외도·인격 낙인은 반려한다. 목화는 별도 조건이다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "composition": "丁:FIRE·yin / 壬:WATER·yang; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "丁火·壬水의 겉 천간 쌍과 각 뿌리·월령을 확인한다.",
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다. 합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "상반된 작용을 함께 검토하며 어느 역할을 보존할지 질문할 수 있다.",
    "risk": "수극화와 합을 실제 감정의 끌림으로 바로 바꾸는 오류를 경계한다.",
    "reversal": "배합의 제한은 필요한 독립 작용을 남기는 조건일 수 있다.",
    "distinction": "丙辛과 원래 오행·전통 화기 방향이 다르며 같은 관계 심리로 복제하지 않는다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "대화에서 합의와 각자의 판단이 섞였다면 동의한 범위를 다시 묻는다.",
      "action": "동의한 내용과 아직 결정하지 않은 내용을 구분한다.",
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
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
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
    "id": "rr:combination:stem_hap:戊癸",
    "relation": "stem_hap",
    "targetId": "foundation:relation:stem_hap",
    "members": [
      "戊",
      "癸"
    ],
    "form": "pair",
    "producerMembership": "existing_table",
    "participants": [
      {
        "symbol": "戊",
        "element": "EARTH",
        "yinYang": "yang",
        "hiddenStems": []
      },
      {
        "symbol": "癸",
        "element": "WATER",
        "yinYang": "yin",
        "hiddenStems": []
      }
    ],
    "traditional": {
      "class": "A_HISTORICAL_TEXT",
      "text": "無情之合·화화 설명을 고전 별칭으로만 기록한다. 나이 차 혼인·무정함을 예언하지 않는다.",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合 / 論十干化氣"
        }
      ]
    },
    "composition": "戊:EARTH·yang / 癸:WATER·yin; 본기·음양·장간은 저장소 상수의 그대로인 구성 정보이며 이 항목만으로 길흉·힘·사건을 계산하지 않는다.",
    "formation": "戊土·癸水의 실제 노출과 토수의 여력을 확인하며 계절과 방해를 남긴다.",
    "exclusions": [
      "한 천간만 존재하거나 음양이 다르다는 이유만으로 임의 쌍을 만드는 경우.",
      "표의 구성과 실제 기둥·소유자·기간이 확인되지 않으면 적용하지 않는다. 미상 시주·누락 지지를 채우지 않는다."
    ],
    "modifiers": "득령·화신의 기세·통근·방해를 검토해야 하며 합 검출은 화기 계산이 아니다. 합이 용신을 붙잡는지 방해를 묶는지에 따라 방향이 다르며 본래 오행을 지우지 않는다.",
    "meaningClass": "C_CONDITIONAL_RESEARCH",
    "positive": "제약과 연결이 함께 있는 조건에서 실제 부담 배분을 살필 수 있다.",
    "risk": "토극수의 제약을 합 또는 화화가 자동 해소했다고 할 수 없다.",
    "reversal": "겉의 합의보다 각자의 필요한 기능이 보존되는 것이 더 유익할 수 있다.",
    "distinction": "甲己와 토가 참여해도 상대는 수이며 화기 논의는 화다.",
    "modern": {
      "class": "D_MODERN_APPLICATION",
      "condition": "비용을 함께 맡기로 했지만 부담이 다르다면 실제 금액과 결정권을 대조한다.",
      "action": "명목상 공동 부담과 실제 부담을 각각 적는다.",
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
      "삼명통회의 中正·仁義·威制·淫慝·無情은 역사적 별칭이며 현대 인격 판정으로 쓰지 않는다.",
      "자평진전 五의 원거리 합과 작용 제한은 원생 표 일치 정책에 반영되어 있지 않다.",
      "조합별 생활 장면의 고유 효과는 검증되지 않았다. 장면 차이를 독립 명리 사실로 집계하지 않는다."
    ],
    "producerScopeRefs": [
      "natal"
    ],
    "unsupportedProducerScopeRefs": [
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
    ]
  }
] as const satisfies readonly RelationCombination[];
