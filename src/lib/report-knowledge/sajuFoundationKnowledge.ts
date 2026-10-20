/** Unconnected research data. Historical testimony is not empirical prediction. */
import type { SajuFoundationEntry } from "./sajuFoundationKnowledgeTypes";

export const SAJU_FOUNDATION_KNOWLEDGE: readonly SajuFoundationEntry[] = [
  {
    "id": "foundation:yin_yang:yang",
    "category": "yin_yang",
    "key": "yang",
    "labelKo": "양",
    "aliases": [
      "양",
      "陽"
    ],
    "definition": {
      "text": "전통적으로 움직임·드러남·펼침의 상대적 면을 가리킨다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "原造化之始; 動靜·陰陽 논의"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:yin_yang:yang"
      ],
      "positive": "직접 시도하는 행동의 장점을 살펴볼 수 있다.",
      "caution": "속도와 노출을 선호한다고 모든 상황에 먼저 나서야 하는 것은 아니다.",
      "excessOrDeficit": "글자 수의 편중만으로 행동의 결핍을 판정하지 않는다.",
      "applications": {}
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "음양은 상대적인 분류이며 성별·선악·외향/내향 검사와 동일하지 않다.",
      "오행 다섯 종류와 음양 두 분류는 별개 좌표다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.yinYang",
        "STEM_YIN_YANG",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:yin_yang:yin",
    "category": "yin_yang",
    "key": "yin",
    "labelKo": "음",
    "aliases": [
      "음",
      "陰"
    ],
    "definition": {
      "text": "전통적으로 고요함·수렴·안쪽의 상대적 면을 가리킨다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "原造化之始; 動靜·陰陽 논의"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:yin_yang:yin"
      ],
      "positive": "관찰하고 축적하는 행동의 장점을 살펴볼 수 있다.",
      "caution": "차분한 처리와 의사 표현의 회피를 같은 것으로 보면 안 된다.",
      "excessOrDeficit": "글자 수의 편중만으로 행동의 결핍을 판정하지 않는다.",
      "applications": {}
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "음양은 상대적인 분류이며 성별·선악·외향/내향 검사와 동일하지 않다.",
      "오행 다섯 종류와 음양 두 분류는 별개 좌표다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.yinYang",
        "STEM_YIN_YANG",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:element:wood",
    "category": "element",
    "key": "wood",
    "labelKo": "목",
    "aliases": [
      "목",
      "木",
      "wood"
    ],
    "definition": {
      "text": "목은 전개와 생장의 상징으로, 화를 생하고 토를 극하는 관계로 설명된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論五行生尅"
        }
      ]
    },
    "traditional": [
      {
        "text": "봄·동쪽·펴고 자라는 움직임의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行生成·論五行生尅"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:element:wood"
      ],
      "positive": "성장 방향을 만드는 가능성",
      "caution": "확장할 일이 많아지면 자원 한도를 놓칠 수 있다.",
      "excessOrDeficit": "수의 공급·금의 제어·화로의 발산과 월령을 보며, 개수만으로 과다·부족을 확정하지 않는다.",
      "applications": {
        "personality": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "새 일을 스스로 벌이는 습관이 있다면 성장 목표와 현재 역량을 따로 적어볼 수 있다."
        },
        "career": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "프로젝트 확장을 맡았다면 새 일의 범위와 유지할 기존 일을 함께 정해볼 수 있다."
        },
        "money": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "사업을 넓히려 한다면 성장 기대와 실제 현금 여력을 나누어 점검할 수 있다."
        },
        "study": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "배울 주제가 늘었다면 한 과목의 기초를 끝낸 뒤 다음 단계로 이동하는 계획을 세울 수 있다."
        },
        "love": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "관계를 발전시키려 한다면 본인이 원하는 속도와 상대가 편한 속도를 확인할 수 있다."
        },
        "marriage": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "공동 미래를 계획한다면 이사·일·생활의 변화에 각자가 동의하는지 물어볼 수 있다."
        },
        "family": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "가족의 성장을 돕고 싶다면 대신 결정하기보다 필요한 지원을 먼저 확인할 수 있다."
        },
        "relationships": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "모임을 이끌 때 새 제안을 밀기 전에 다른 사람의 참여 여력을 들을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "오행은 십성의 재물·관직 분류 자체가 아니다. 일간에 따라 십성 관계가 달라진다.",
      "계절 대응과 실제 생활 성향은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.elements"
      ],
      "legacyRefs": [
        "knowledge:element_wood",
        "knowledge:element_wood_missing",
        "taxonomy:element_wood_excess",
        "taxonomy:element_wood_missing"
      ]
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:element:fire",
    "category": "element",
    "key": "fire",
    "labelKo": "화",
    "aliases": [
      "화",
      "火",
      "fire"
    ],
    "definition": {
      "text": "화는 발산과 밝음의 상징으로, 토를 생하고 금을 극하는 관계로 설명된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論五行生尅"
        }
      ]
    },
    "traditional": [
      {
        "text": "여름·남쪽·밝게 드러나고 위로 향함의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行生成·論五行生尅"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:element:fire"
      ],
      "positive": "표현과 공유의 가능성",
      "caution": "반응을 빠르게 얻으려 하면 설명과 휴식을 생략할 수 있다.",
      "excessOrDeficit": "목의 공급·수의 조절·토로의 발산과 계절을 함께 보며 화가 있다고 열정 수준을 확정하지 않는다.",
      "applications": {
        "personality": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "생각을 바로 표현하는 편이라면 감정과 전달할 사실을 구별해 말할 수 있다."
        },
        "career": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "발표를 맡았다면 주목을 끄는 말과 확인 가능한 근거를 함께 준비할 수 있다."
        },
        "money": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "소비를 통해 기분을 전환하는 습관이 있다면 결제 전에 예산을 확인할 수 있다."
        },
        "study": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "말로 설명할 때 이해가 잘 된다면 복습 내용을 짧게 발표해볼 수 있다."
        },
        "love": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "호감을 적극 표현하고 싶다면 상대가 답할 시간을 둘 수 있다."
        },
        "marriage": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "함께하는 행사를 즐긴다면 행사 뒤 일상 분담도 대화할 수 있다."
        },
        "family": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "가족 모임의 분위기를 돕는다면 조용히 쉬고 싶은 사람도 배려할 수 있다."
        },
        "relationships": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "사람을 모으는 역할이라면 말이 적은 구성원의 의견을 따로 들을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "오행은 십성의 재물·관직 분류 자체가 아니다. 일간에 따라 십성 관계가 달라진다.",
      "계절 대응과 실제 생활 성향은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.elements"
      ],
      "legacyRefs": [
        "knowledge:element_fire",
        "knowledge:element_fire_missing",
        "taxonomy:element_fire_excess",
        "taxonomy:element_fire_missing"
      ]
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:element:earth",
    "category": "element",
    "key": "earth",
    "labelKo": "토",
    "aliases": [
      "토",
      "土",
      "earth"
    ],
    "definition": {
      "text": "토는 담고 기르는 상징으로, 금을 생하고 수를 극하는 관계로 설명된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論五行生尅"
        }
      ]
    },
    "traditional": [
      {
        "text": "중앙·기르고 받아들이며 매개함의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行生成·論五行生尅"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:element:earth"
      ],
      "positive": "유지와 조정의 가능성",
      "caution": "안정을 지키려는 태도가 변화 지연으로 이어질 수 있다.",
      "excessOrDeficit": "건조·습윤과 목의 소통·화의 공급·금으로의 발산을 구분한다. 토가 많다는 이유만으로 안정이 보장되지 않는다.",
      "applications": {
        "personality": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "익숙한 방식을 선호한다면 지킬 기준과 바꿔도 되는 절차를 구별할 수 있다."
        },
        "career": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "운영 업무를 맡았다면 반복 절차 중 실제로 도움이 되는 부분을 점검할 수 있다."
        },
        "money": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "자산을 오래 보유하려 한다면 보유 이유와 현금 필요 시점을 확인할 수 있다."
        },
        "study": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "반복 학습이 편하다면 외운 내용이 새 문제에도 적용되는지 풀어볼 수 있다."
        },
        "love": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "편안한 관계를 원한다면 익숙함 속에서 생략된 표현이 없는지 물을 수 있다."
        },
        "marriage": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "생활의 안정이 중요하다면 집안일과 비용의 분담을 구체적으로 합의할 수 있다."
        },
        "family": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "가족의 중재자라면 모두의 부담을 혼자 떠안지 않고 역할을 나눌 수 있다."
        },
        "relationships": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "약속을 오래 유지한다면 변한 상황에 맞춰 약속의 범위를 다시 정할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "오행은 십성의 재물·관직 분류 자체가 아니다. 일간에 따라 십성 관계가 달라진다.",
      "계절 대응과 실제 생활 성향은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.elements"
      ],
      "legacyRefs": [
        "knowledge:element_earth",
        "knowledge:element_earth_excess",
        "taxonomy:element_earth_excess",
        "taxonomy:element_earth_missing"
      ]
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:element:metal",
    "category": "element",
    "key": "metal",
    "labelKo": "금",
    "aliases": [
      "금",
      "金",
      "metal"
    ],
    "definition": {
      "text": "금은 수렴과 구분의 상징으로, 수를 생하고 목을 극하는 관계로 설명된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論五行生尅"
        }
      ]
    },
    "traditional": [
      {
        "text": "가을·서쪽·거두고 경계를 세움의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行生成·論五行生尅"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:element:metal"
      ],
      "positive": "정리와 기준 설정의 가능성",
      "caution": "구분을 지나치게 강조하면 예외나 사정을 듣기 어려울 수 있다.",
      "excessOrDeficit": "토의 공급·화의 제련·수로의 발산 및 월령을 본다. 금의 수가 많다고 엄격한 성격을 확정하지 않는다.",
      "applications": {
        "personality": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "판단 기준을 분명히 세우는 편이라면 기준의 이유도 설명할 수 있다."
        },
        "career": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "검수 업무를 맡았다면 필수 기준과 취향의 차이를 나눌 수 있다."
        },
        "money": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "비용을 줄이려 한다면 필요한 지출까지 끊고 있지 않은지 확인할 수 있다."
        },
        "study": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "정답을 점검할 때 틀린 이유를 분류하면 다음 학습 주제를 고르기 쉽다."
        },
        "love": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "관계의 경계가 중요하다면 거절의 내용과 상대에 대한 존중을 함께 표현할 수 있다."
        },
        "marriage": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "생활 규칙을 합의한다면 사정이 달라졌을 때 조정할 절차도 정할 수 있다."
        },
        "family": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "가족의 선택을 평가하려 한다면 판단 전에 그 선택의 맥락을 물어볼 수 있다."
        },
        "relationships": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "갈등의 쟁점을 정리할 때 사람 전체에 대한 평가와 개별 행동을 분리할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "오행은 십성의 재물·관직 분류 자체가 아니다. 일간에 따라 십성 관계가 달라진다.",
      "계절 대응과 실제 생활 성향은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.elements"
      ],
      "legacyRefs": [
        "knowledge:element_metal",
        "knowledge:element_metal_strong",
        "taxonomy:element_metal_excess",
        "taxonomy:element_metal_missing"
      ]
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:element:water",
    "category": "element",
    "key": "water",
    "labelKo": "수",
    "aliases": [
      "수",
      "水",
      "water"
    ],
    "definition": {
      "text": "수는 흐름과 저장의 상징으로, 목을 생하고 화를 극하는 관계로 설명된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論五行生尅"
        }
      ]
    },
    "traditional": [
      {
        "text": "겨울·북쪽·아래로 흐르고 안에 저장함의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm1",
            "locator": "論五行生成·論五行生尅"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:element:water"
      ],
      "positive": "정보를 모으고 방향을 바꾸는 가능성",
      "caution": "선택지를 계속 늘리면 결정이 미뤄질 수 있다.",
      "excessOrDeficit": "금의 공급·토의 경계·목으로의 발산과 한난을 함께 본다. 수가 없다는 이유로 사고력이나 공감을 부정하지 않는다.",
      "applications": {
        "personality": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "상황을 오래 관찰한다면 결정을 내릴 기준 시점도 정할 수 있다."
        },
        "career": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "조사나 기획을 맡았다면 정보 수집과 실행 판단의 단계를 나눌 수 있다."
        },
        "money": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "여러 재무 정보를 비교한다면 출처와 손실 가능성을 먼저 확인할 수 있다."
        },
        "study": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "깊이 읽는 편이라면 읽은 내용을 자기 말로 설명해 이해를 점검할 수 있다."
        },
        "love": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "상대의 반응을 먼저 살핀다면 본인의 의사도 숨기지 않고 전할 수 있다."
        },
        "marriage": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "변하는 일정에 잘 적응하더라도 함께 정한 중요한 약속은 확인할 수 있다."
        },
        "family": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "가족 사정을 듣는 역할이라면 모든 문제의 해결 책임까지 맡지 않을 수 있다."
        },
        "relationships": {
          "when": "해당 행동 또는 생활 상황을 사용자가 확인한 경우에만 상징을 비교 질문으로 활용한다.",
          "example": "서로 다른 사람 사이를 연결한다면 전달해도 되는 정보의 범위를 합의할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "오행은 십성의 재물·관직 분류 자체가 아니다. 일간에 따라 십성 관계가 달라진다.",
      "계절 대응과 실제 생활 성향은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.elements"
      ],
      "legacyRefs": [
        "knowledge:element_water",
        "knowledge:element_water_missing",
        "taxonomy:element_water_excess",
        "taxonomy:element_water_missing"
      ]
    },
    "deferred": [
      "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:甲",
    "category": "heavenly_stem",
    "key": "甲",
    "labelKo": "갑",
    "aliases": [
      "갑",
      "甲",
      "갑목"
    ],
    "definition": {
      "text": "甲는 양의 목에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "뿌리와 줄기, 높이 자라는 양목의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 갑목"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "강한 목이 화로 발산하는 조건을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 갑목"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "화가 너무 치열하거나 수가 넘치는 조건을 구별한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 갑목"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:甲"
      ],
      "positive": "방향을 세우고 추진하는 장점",
      "caution": "본인의 방향을 타인에게 강요할 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "갑목의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "乙의 가지·잎 비유와 달리 뿌리·줄기 비유이며, 큰 나무만으로 성격을 고정하지 않는다."
    ],
    "relatedIds": [
      "foundation:element:wood",
      "foundation:yin_yang:yang"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:甲",
    "category": "day_master",
    "key": "甲",
    "labelKo": "갑목",
    "aliases": [
      "갑목",
      "甲일간",
      "갑일간",
      "甲日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 갑목 일간은 甲를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:甲"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_gabmok"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:乙",
    "category": "heavenly_stem",
    "key": "乙",
    "labelKo": "을",
    "aliases": [
      "을",
      "乙",
      "을목"
    ],
    "definition": {
      "text": "乙는 음의 목에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "가지·잎처럼 유연한 음목의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 을목"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "丙丁의 온기와 甲寅의 의지처라는 조건을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 을목"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "차고 습한 조건의 목은 화 하나만으로 해결된다고 보지 않는다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 을목"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:乙"
      ],
      "positive": "상황에 맞는 접근을 찾는 장점",
      "caution": "갈등을 피하느라 요구를 모호하게 전할 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "을목의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "甲의 단단함과 대조되는 유연한 비유이며 유연함은 나약함과 다르다."
    ],
    "relatedIds": [
      "foundation:element:wood",
      "foundation:yin_yang:yin"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:乙",
    "category": "day_master",
    "key": "乙",
    "labelKo": "을목",
    "aliases": [
      "을목",
      "乙일간",
      "을일간",
      "乙日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 을목 일간은 乙를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:乙"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_eulmok"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:丙",
    "category": "heavenly_stem",
    "key": "丙",
    "labelKo": "병",
    "aliases": [
      "병",
      "丙",
      "병화"
    ],
    "definition": {
      "text": "丙는 양의 화에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "강하게 드러나는 양화의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 병화"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "토로의 발산과 수의 조절을 조건에 따라 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 병화"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "목화가 함께 지나치게 치열한 경우를 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 병화"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:丙"
      ],
      "positive": "생각을 넓게 공유하는 장점",
      "caution": "반응이 빠른 만큼 검토를 건너뛸 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "병화의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "丁의 안쪽 밝음과 구별되는 강한 발산의 비유다."
    ],
    "relatedIds": [
      "foundation:element:fire",
      "foundation:yin_yang:yang"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:丙",
    "category": "day_master",
    "key": "丙",
    "labelKo": "병화",
    "aliases": [
      "병화",
      "丙일간",
      "병일간",
      "丙日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 병화 일간은 丙를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:丙"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_byeonghwa"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:丁",
    "category": "heavenly_stem",
    "key": "丁",
    "labelKo": "정",
    "aliases": [
      "정",
      "丁",
      "정화"
    ],
    "definition": {
      "text": "丁는 음의 화에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "안쪽으로 밝고 온화한 음화의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 정화"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "목의 지원이 있을 때 계절에 따라 유지되는 화를 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 정화"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "같은 화라도 丙과 같은 강도로 취급하지 않는다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 정화"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:丁"
      ],
      "positive": "작은 반응을 살피며 표현하는 장점",
      "caution": "표현의 결과를 오래 신경 쓸 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "정화의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "丙의 치열함과 丁의 안쪽 밝음을 구별한다."
    ],
    "relatedIds": [
      "foundation:element:fire",
      "foundation:yin_yang:yin"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:丁",
    "category": "day_master",
    "key": "丁",
    "labelKo": "정화",
    "aliases": [
      "정화",
      "丁일간",
      "정일간",
      "丁日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 정화 일간은 丁를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:丁"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_jeonghwa"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:戊",
    "category": "heavenly_stem",
    "key": "戊",
    "labelKo": "무",
    "aliases": [
      "무",
      "戊",
      "무토"
    ],
    "definition": {
      "text": "戊는 양의 토에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "높고 두터운 양토의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 무토"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "습윤함과 한난의 조절 속에서 토의 기능을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 무토"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "건조함이나 뿌리의 흔들림을 조건 없이 길하게 보지 않는다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 무토"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:戊"
      ],
      "positive": "큰 기준을 유지하는 장점",
      "caution": "기준을 바꿀 필요가 있어도 버틸 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "무토의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "滴天髓 주석은 戊를 산언덕으로 보고 성벽으로만 보는 해석을 비판한다. 三命通會의 성벽 비유와 계보 차이를 보존한다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:yin_yang:yang"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:戊",
    "category": "day_master",
    "key": "戊",
    "labelKo": "무토",
    "aliases": [
      "무토",
      "戊일간",
      "무일간",
      "戊日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 무토 일간은 戊를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:戊"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_muto"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:己",
    "category": "heavenly_stem",
    "key": "己",
    "labelKo": "기",
    "aliases": [
      "기",
      "己",
      "기토"
    ],
    "definition": {
      "text": "己는 음의 토에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "낮고 습하며 품어 두는 음토의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 기토"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "저장하고 기르는 토의 쓰임과 도움의 조건을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 기토"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "무근한 화와 습토의 관계를 다른 조건과 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 기토"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:己"
      ],
      "positive": "작은 자원을 돌보며 유지하는 장점",
      "caution": "여러 부담을 모두 품으려 할 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "기토의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "戊의 높고 두터움과 대비되는 저장·배양의 비유다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:yin_yang:yin"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:己",
    "category": "day_master",
    "key": "己",
    "labelKo": "기토",
    "aliases": [
      "기토",
      "己일간",
      "기일간",
      "己日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 기토 일간은 己를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:己"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_gito"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:庚",
    "category": "heavenly_stem",
    "key": "庚",
    "labelKo": "경",
    "aliases": [
      "경",
      "庚",
      "경금"
    ],
    "definition": {
      "text": "庚는 양의 금에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "강건한 양금의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 경금"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "수로 맑아지고 화로 제련되는 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 경금"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "습한 토의 공급과 건조한 토의 조건을 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 경금"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:庚"
      ],
      "positive": "필요한 결정을 분명히 하는 장점",
      "caution": "결정의 속도가 타인의 수용 속도를 앞설 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "경금의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "辛의 맑고 부드러움과 다른 강건함의 비유이며 공격성 진단이 아니다."
    ],
    "relatedIds": [
      "foundation:element:metal",
      "foundation:yin_yang:yang"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:庚",
    "category": "day_master",
    "key": "庚",
    "labelKo": "경금",
    "aliases": [
      "경금",
      "庚일간",
      "경일간",
      "庚日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 경금 일간은 庚를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:庚"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_gyeonggeum"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:辛",
    "category": "heavenly_stem",
    "key": "辛",
    "labelKo": "신",
    "aliases": [
      "신",
      "辛",
      "신금"
    ],
    "definition": {
      "text": "辛는 음의 금에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "맑고 온윤한 음금의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 신금"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "수의 씻어냄과 계절에 따른 온도 조절을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 신금"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "토가 겹쳐 묻히는 조건을 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 신금"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:辛"
      ],
      "positive": "작은 차이와 완성도를 살피는 장점",
      "caution": "작은 흠을 고치느라 완료를 미룰 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "신금의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "滴天髓 주석은 보석으로만 보는 비유를 비판한다. 기존 보석 이미지와 다른 견해로 보존한다."
    ],
    "relatedIds": [
      "foundation:element:metal",
      "foundation:yin_yang:yin"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:辛",
    "category": "day_master",
    "key": "辛",
    "labelKo": "신금",
    "aliases": [
      "신금",
      "辛일간",
      "신일간",
      "辛日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 신금 일간은 辛를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:辛"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_singeum"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:壬",
    "category": "heavenly_stem",
    "key": "壬",
    "labelKo": "임",
    "aliases": [
      "임",
      "壬",
      "임수"
    ],
    "definition": {
      "text": "壬는 양의 수에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "넓게 흐르며 막히지 않는 양수의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 임수"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "금의 기운을 받아 흐르고 뿌리·癸와의 연결을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 임수"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "강한 수의 흐름은 원국 조건 없이 유리하다고 단정하지 않는다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 임수"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:壬"
      ],
      "positive": "여러 길을 연결하고 크게 보는 장점",
      "caution": "선택지가 늘어 우선순위를 놓칠 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "임수의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "해당 주석은 강과 비를 壬/癸에 고정 배분하는 이분법을 피한다."
    ],
    "relatedIds": [
      "foundation:element:water",
      "foundation:yin_yang:yang"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:壬",
    "category": "day_master",
    "key": "壬",
    "labelKo": "임수",
    "aliases": [
      "임수",
      "壬일간",
      "임일간",
      "壬日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 임수 일간은 壬를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:壬"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_imsu"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:heavenly_stem:癸",
    "category": "heavenly_stem",
    "key": "癸",
    "labelKo": "계",
    "aliases": [
      "계",
      "癸",
      "계수"
    ],
    "definition": {
      "text": "癸는 음의 수에 배속되는 천간이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論十干名字之義"
        }
      ]
    },
    "traditional": [
      {
        "text": "작고 미세하게 작용하는 음수의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 계수"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "목을 적시고 화를 조절하는 조건을 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 계수"
          }
        ],
        "aspect": "positive"
      },
      {
        "text": "戊와의 합화도 화의 뿌리가 있을 때라는 조건을 붙인다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "天干論 계수"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:heavenly_stem:癸"
      ],
      "positive": "작은 신호를 모아 판단하는 장점",
      "caution": "혼자 확인하는 동안 의사 전달을 늦출 수 있다.",
      "excessOrDeficit": "천간 한 글자의 이름만으로 과용·부족을 판정하지 않는다.",
      "applications": {
        "personality": {
          "when": "본인이 실제 습관을 확인했을 때만 비교용으로 사용한다.",
          "example": "계수의 비유가 본인의 습관과 맞는다면, 장점이 나타나는 상황과 부담이 생기는 상황을 각각 확인해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "壬보다 작은 비유가 능력의 열등함을 뜻하지 않는다."
    ],
    "relatedIds": [
      "foundation:element:water",
      "foundation:yin_yang:yin"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HEAVENLY_STEMS",
        "STEM_ELEMENT",
        "STEM_YIN_YANG"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "직업·재물·연애·결혼·가족 등으로 옮기는 상세 전통 해석은 원국 조건과 문헌 대조가 더 필요하다."
    ]
  },
  {
    "id": "foundation:day_master:癸",
    "category": "day_master",
    "key": "癸",
    "labelKo": "계수",
    "aliases": [
      "계수",
      "癸일간",
      "계일간",
      "癸日主"
    ],
    "definition": {
      "text": "일간은 일주의 천간을 해석의 기준으로 삼는 자리다. 계수 일간은 癸를 그 기준으로 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 日干/日主 설명"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산된 일주의 천간이 해당 글자일 때."
    ],
    "doNotApply": [
      "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
      "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
    ],
    "distinctions": [
      "천간 자체의 상징은 heavenly_stem 항목을 참조한다. 일간은 그 천간이 맡는 기준 역할이다.",
      "같은 일간이어도 월령·통근·다른 간지·출생시간에 따라 조건이 달라진다."
    ],
    "relatedIds": [
      "foundation:heavenly_stem:癸"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.dayMaster"
      ],
      "legacyRefs": [
        "knowledge:day_master_gyesu"
      ]
    },
    "deferred": [
      "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
      "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
    ]
  },
  {
    "id": "foundation:earthly_branch:子",
    "category": "earthly_branch",
    "key": "子",
    "labelKo": "자",
    "aliases": [
      "자",
      "子",
      "자지지"
    ],
    "definition": {
      "text": "子는 열두 지지 중 하나이며 전통 계절 대응은 겨울의 한가운데, 주된 오행은 수이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 子"
        }
      ]
    },
    "traditional": [
      {
        "text": "한밤과 물의 수렴의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 子"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 쥐이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "子는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:water",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:子"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:丑",
    "category": "earthly_branch",
    "key": "丑",
    "labelKo": "축",
    "aliases": [
      "축",
      "丑",
      "축지지"
    ],
    "definition": {
      "text": "丑는 열두 지지 중 하나이며 전통 계절 대응은 겨울의 끝, 주된 오행은 토이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 丑"
        }
      ]
    },
    "traditional": [
      {
        "text": "차고 저장하는 토의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 丑"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 소이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "丑는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:丑"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:寅",
    "category": "earthly_branch",
    "key": "寅",
    "labelKo": "인",
    "aliases": [
      "인",
      "寅",
      "인지지"
    ],
    "definition": {
      "text": "寅는 열두 지지 중 하나이며 전통 계절 대응은 봄의 시작, 주된 오행은 목이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 寅"
        }
      ]
    },
    "traditional": [
      {
        "text": "펴기 시작하는 목의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 寅"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 호랑이이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "寅는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:wood",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:寅"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:卯",
    "category": "earthly_branch",
    "key": "卯",
    "labelKo": "묘",
    "aliases": [
      "묘",
      "卯",
      "묘지지"
    ],
    "definition": {
      "text": "卯는 열두 지지 중 하나이며 전통 계절 대응은 봄의 한가운데, 주된 오행은 목이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 卯"
        }
      ]
    },
    "traditional": [
      {
        "text": "번성하는 목의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 卯"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 토끼이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "卯는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:wood",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:卯"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:辰",
    "category": "earthly_branch",
    "key": "辰",
    "labelKo": "진",
    "aliases": [
      "진",
      "辰",
      "진지지"
    ],
    "definition": {
      "text": "辰는 열두 지지 중 하나이며 전통 계절 대응은 봄의 끝, 주된 오행은 토이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 辰"
        }
      ]
    },
    "traditional": [
      {
        "text": "습한 토와 저장의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 辰"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 용이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "辰는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:辰"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:巳",
    "category": "earthly_branch",
    "key": "巳",
    "labelKo": "사",
    "aliases": [
      "사",
      "巳",
      "사지지"
    ],
    "definition": {
      "text": "巳는 열두 지지 중 하나이며 전통 계절 대응은 여름의 시작, 주된 오행은 화이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 巳"
        }
      ]
    },
    "traditional": [
      {
        "text": "드러나기 시작하는 화의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 巳"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 뱀이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "巳는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:fire",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:巳"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:午",
    "category": "earthly_branch",
    "key": "午",
    "labelKo": "오",
    "aliases": [
      "오",
      "午",
      "오지지"
    ],
    "definition": {
      "text": "午는 열두 지지 중 하나이며 전통 계절 대응은 여름의 한가운데, 주된 오행은 화이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 午"
        }
      ]
    },
    "traditional": [
      {
        "text": "왕성한 화의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 午"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 말이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "午는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:fire",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:午"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:未",
    "category": "earthly_branch",
    "key": "未",
    "labelKo": "미",
    "aliases": [
      "미",
      "未",
      "미지지"
    ],
    "definition": {
      "text": "未는 열두 지지 중 하나이며 전통 계절 대응은 여름의 끝, 주된 오행은 토이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 未"
        }
      ]
    },
    "traditional": [
      {
        "text": "더위가 남은 토의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 未"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 양이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "未는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:未"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:申",
    "category": "earthly_branch",
    "key": "申",
    "labelKo": "신",
    "aliases": [
      "신",
      "申",
      "신지지"
    ],
    "definition": {
      "text": "申는 열두 지지 중 하나이며 전통 계절 대응은 가을의 시작, 주된 오행은 금이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 申"
        }
      ]
    },
    "traditional": [
      {
        "text": "거두기 시작하는 금의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 申"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 원숭이이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "申는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:metal",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:申"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:酉",
    "category": "earthly_branch",
    "key": "酉",
    "labelKo": "유",
    "aliases": [
      "유",
      "酉",
      "유지지"
    ],
    "definition": {
      "text": "酉는 열두 지지 중 하나이며 전통 계절 대응은 가을의 한가운데, 주된 오행은 금이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 酉"
        }
      ]
    },
    "traditional": [
      {
        "text": "집중된 금의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 酉"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 닭이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "酉는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:metal",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:酉"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:戌",
    "category": "earthly_branch",
    "key": "戌",
    "labelKo": "술",
    "aliases": [
      "술",
      "戌",
      "술지지"
    ],
    "definition": {
      "text": "戌는 열두 지지 중 하나이며 전통 계절 대응은 가을의 끝, 주된 오행은 토이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 戌"
        }
      ]
    },
    "traditional": [
      {
        "text": "마른 토와 저장의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 戌"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 개이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "戌는 양지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:earth",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:戌"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:earthly_branch:亥",
    "category": "earthly_branch",
    "key": "亥",
    "labelKo": "해",
    "aliases": [
      "해",
      "亥",
      "해지지"
    ],
    "definition": {
      "text": "亥는 열두 지지 중 하나이며 전통 계절 대응은 겨울의 시작, 주된 오행은 수이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論地支 亥"
        }
      ]
    },
    "traditional": [
      {
        "text": "모여드는 수의 상징으로 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支 亥"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "띠 대응은 돼지이며, 이는 지지의 문화적 상징이다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論地支屬相"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "亥는 음지로 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽支/陰支"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "연지의 띠와 일지·월지·시지의 적용 자리는 다르다.",
      "지지의 주된 오행과 지장간 전체 구성은 동일한 정보가 아니다."
    ],
    "relatedIds": [
      "foundation:element:water",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "EARTHLY_BRANCHES",
        "BRANCH_MAIN_ELEMENT",
        "BRANCH_YIN_YANG"
      ],
      "legacyRefs": [
        "branches:亥"
      ]
    },
    "deferred": [
      "동물의 습성을 인간 성격으로 옮기는 인과 해석은 근거가 없어 보류한다.",
      "12지지 각각의 현대 직업·재물·혼인 해석을 계절 대응만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲子",
    "category": "day_pillar",
    "key": "甲子",
    "labelKo": "갑자일주",
    "aliases": [
      "갑자일주",
      "甲子",
      "甲子日柱",
      "갑자"
    ],
    "definition": {
      "text": "甲子는 60간지의 1번째 조합인 甲 천간과 子 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:子",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:0"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gabja",
        "taxonomy:day_pillar_gapja",
        "dayPillars:day_pillar_gapja"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙丑",
    "category": "day_pillar",
    "key": "乙丑",
    "labelKo": "을축일주",
    "aliases": [
      "을축일주",
      "乙丑",
      "乙丑日柱",
      "을축"
    ],
    "definition": {
      "text": "乙丑는 60간지의 2번째 조합인 乙 천간과 丑 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:丑",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:1"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_eulchuk",
        "dayPillars:day_pillar_eulchuk"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙寅",
    "category": "day_pillar",
    "key": "丙寅",
    "labelKo": "병인일주",
    "aliases": [
      "병인일주",
      "丙寅",
      "丙寅日柱",
      "병인"
    ],
    "definition": {
      "text": "丙寅는 60간지의 3번째 조합인 丙 천간과 寅 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:寅",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:2"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_byeongin",
        "dayPillars:day_pillar_byeongin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁卯",
    "category": "day_pillar",
    "key": "丁卯",
    "labelKo": "정묘일주",
    "aliases": [
      "정묘일주",
      "丁卯",
      "丁卯日柱",
      "정묘"
    ],
    "definition": {
      "text": "丁卯는 60간지의 4번째 조합인 丁 천간과 卯 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:卯",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:3"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_jeongmyo",
        "dayPillars:day_pillar_jeongmyo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊辰",
    "category": "day_pillar",
    "key": "戊辰",
    "labelKo": "무진일주",
    "aliases": [
      "무진일주",
      "戊辰",
      "戊辰日柱",
      "무진"
    ],
    "definition": {
      "text": "戊辰는 60간지의 5번째 조합인 戊 천간과 辰 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:辰",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:4"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_mujin",
        "taxonomy:day_pillar_mujin",
        "dayPillars:day_pillar_mujin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己巳",
    "category": "day_pillar",
    "key": "己巳",
    "labelKo": "기사일주",
    "aliases": [
      "기사일주",
      "己巳",
      "己巳日柱",
      "기사"
    ],
    "definition": {
      "text": "己巳는 60간지의 6번째 조합인 己 천간과 巳 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:巳",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:5"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gisa",
        "dayPillars:day_pillar_gisa"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚午",
    "category": "day_pillar",
    "key": "庚午",
    "labelKo": "경오일주",
    "aliases": [
      "경오일주",
      "庚午",
      "庚午日柱",
      "경오"
    ],
    "definition": {
      "text": "庚午는 60간지의 7번째 조합인 庚 천간과 午 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:午",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:6"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeongo",
        "dayPillars:day_pillar_gyeongo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛未",
    "category": "day_pillar",
    "key": "辛未",
    "labelKo": "신미일주",
    "aliases": [
      "신미일주",
      "辛未",
      "辛未日柱",
      "신미"
    ],
    "definition": {
      "text": "辛未는 60간지의 8번째 조합인 辛 천간과 未 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:未",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:7"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_sinmi",
        "dayPillars:day_pillar_sinmi"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬申",
    "category": "day_pillar",
    "key": "壬申",
    "labelKo": "임신일주",
    "aliases": [
      "임신일주",
      "壬申",
      "壬申日柱",
      "임신"
    ],
    "definition": {
      "text": "壬申는 60간지의 9번째 조합인 壬 천간과 申 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:申",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:8"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_imsin",
        "dayPillars:day_pillar_imsin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸酉",
    "category": "day_pillar",
    "key": "癸酉",
    "labelKo": "계유일주",
    "aliases": [
      "계유일주",
      "癸酉",
      "癸酉日柱",
      "계유"
    ],
    "definition": {
      "text": "癸酉는 60간지의 10번째 조합인 癸 천간과 酉 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:酉",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:9"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeyu",
        "dayPillars:day_pillar_gyeyu"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲戌",
    "category": "day_pillar",
    "key": "甲戌",
    "labelKo": "갑술일주",
    "aliases": [
      "갑술일주",
      "甲戌",
      "甲戌日柱",
      "갑술"
    ],
    "definition": {
      "text": "甲戌는 60간지의 11번째 조합인 甲 천간과 戌 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:戌",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:10"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gapsul",
        "dayPillars:day_pillar_gapsul"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙亥",
    "category": "day_pillar",
    "key": "乙亥",
    "labelKo": "을해일주",
    "aliases": [
      "을해일주",
      "乙亥",
      "乙亥日柱",
      "을해"
    ],
    "definition": {
      "text": "乙亥는 60간지의 12번째 조합인 乙 천간과 亥 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:亥",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:11"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_eulhae",
        "dayPillars:day_pillar_eulhae"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙子",
    "category": "day_pillar",
    "key": "丙子",
    "labelKo": "병자일주",
    "aliases": [
      "병자일주",
      "丙子",
      "丙子日柱",
      "병자"
    ],
    "definition": {
      "text": "丙子는 60간지의 13번째 조합인 丙 천간과 子 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:子",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:12"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_byeongja",
        "dayPillars:day_pillar_byeongja"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁丑",
    "category": "day_pillar",
    "key": "丁丑",
    "labelKo": "정축일주",
    "aliases": [
      "정축일주",
      "丁丑",
      "丁丑日柱",
      "정축"
    ],
    "definition": {
      "text": "丁丑는 60간지의 14번째 조합인 丁 천간과 丑 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:丑",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:13"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_jeongchuk",
        "dayPillars:day_pillar_jeongchuk"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊寅",
    "category": "day_pillar",
    "key": "戊寅",
    "labelKo": "무인일주",
    "aliases": [
      "무인일주",
      "戊寅",
      "戊寅日柱",
      "무인"
    ],
    "definition": {
      "text": "戊寅는 60간지의 15번째 조합인 戊 천간과 寅 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:寅",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:14"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_muin",
        "dayPillars:day_pillar_muin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己卯",
    "category": "day_pillar",
    "key": "己卯",
    "labelKo": "기묘일주",
    "aliases": [
      "기묘일주",
      "己卯",
      "己卯日柱",
      "기묘"
    ],
    "definition": {
      "text": "己卯는 60간지의 16번째 조합인 己 천간과 卯 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:卯",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:15"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gimyo",
        "dayPillars:day_pillar_gimyo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚辰",
    "category": "day_pillar",
    "key": "庚辰",
    "labelKo": "경진일주",
    "aliases": [
      "경진일주",
      "庚辰",
      "庚辰日柱",
      "경진"
    ],
    "definition": {
      "text": "庚辰는 60간지의 17번째 조합인 庚 천간과 辰 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:辰",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:16"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeongjin",
        "dayPillars:day_pillar_gyeongjin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛巳",
    "category": "day_pillar",
    "key": "辛巳",
    "labelKo": "신사일주",
    "aliases": [
      "신사일주",
      "辛巳",
      "辛巳日柱",
      "신사"
    ],
    "definition": {
      "text": "辛巳는 60간지의 18번째 조합인 辛 천간과 巳 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:巳",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:17"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_sinsa",
        "dayPillars:day_pillar_sinsa"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬午",
    "category": "day_pillar",
    "key": "壬午",
    "labelKo": "임오일주",
    "aliases": [
      "임오일주",
      "壬午",
      "壬午日柱",
      "임오"
    ],
    "definition": {
      "text": "壬午는 60간지의 19번째 조합인 壬 천간과 午 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:午",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:18"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_imo",
        "dayPillars:day_pillar_imo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸未",
    "category": "day_pillar",
    "key": "癸未",
    "labelKo": "계미일주",
    "aliases": [
      "계미일주",
      "癸未",
      "癸未日柱",
      "계미"
    ],
    "definition": {
      "text": "癸未는 60간지의 20번째 조합인 癸 천간과 未 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:未",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:19"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyemi",
        "dayPillars:day_pillar_gyemi"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲申",
    "category": "day_pillar",
    "key": "甲申",
    "labelKo": "갑신일주",
    "aliases": [
      "갑신일주",
      "甲申",
      "甲申日柱",
      "갑신"
    ],
    "definition": {
      "text": "甲申는 60간지의 21번째 조합인 甲 천간과 申 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:申",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:20"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gapsin",
        "taxonomy:day_pillar_gapsin",
        "dayPillars:day_pillar_gapsin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙酉",
    "category": "day_pillar",
    "key": "乙酉",
    "labelKo": "을유일주",
    "aliases": [
      "을유일주",
      "乙酉",
      "乙酉日柱",
      "을유"
    ],
    "definition": {
      "text": "乙酉는 60간지의 22번째 조합인 乙 천간과 酉 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:酉",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:21"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_eulyu",
        "dayPillars:day_pillar_eulyu"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙戌",
    "category": "day_pillar",
    "key": "丙戌",
    "labelKo": "병술일주",
    "aliases": [
      "병술일주",
      "丙戌",
      "丙戌日柱",
      "병술"
    ],
    "definition": {
      "text": "丙戌는 60간지의 23번째 조합인 丙 천간과 戌 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:戌",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:22"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_byeongsul",
        "dayPillars:day_pillar_byeongsul"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁亥",
    "category": "day_pillar",
    "key": "丁亥",
    "labelKo": "정해일주",
    "aliases": [
      "정해일주",
      "丁亥",
      "丁亥日柱",
      "정해"
    ],
    "definition": {
      "text": "丁亥는 60간지의 24번째 조합인 丁 천간과 亥 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:亥",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:23"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_jeonghae",
        "taxonomy:day_pillar_jeonghae",
        "dayPillars:day_pillar_jeonghae"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊子",
    "category": "day_pillar",
    "key": "戊子",
    "labelKo": "무자일주",
    "aliases": [
      "무자일주",
      "戊子",
      "戊子日柱",
      "무자"
    ],
    "definition": {
      "text": "戊子는 60간지의 25번째 조합인 戊 천간과 子 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:子",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:24"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_muja",
        "dayPillars:day_pillar_muja"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己丑",
    "category": "day_pillar",
    "key": "己丑",
    "labelKo": "기축일주",
    "aliases": [
      "기축일주",
      "己丑",
      "己丑日柱",
      "기축"
    ],
    "definition": {
      "text": "己丑는 60간지의 26번째 조합인 己 천간과 丑 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:丑",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:25"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gichuk",
        "dayPillars:day_pillar_gichuk"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚寅",
    "category": "day_pillar",
    "key": "庚寅",
    "labelKo": "경인일주",
    "aliases": [
      "경인일주",
      "庚寅",
      "庚寅日柱",
      "경인"
    ],
    "definition": {
      "text": "庚寅는 60간지의 27번째 조합인 庚 천간과 寅 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:寅",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:26"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeongin",
        "dayPillars:day_pillar_gyeongin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛卯",
    "category": "day_pillar",
    "key": "辛卯",
    "labelKo": "신묘일주",
    "aliases": [
      "신묘일주",
      "辛卯",
      "辛卯日柱",
      "신묘"
    ],
    "definition": {
      "text": "辛卯는 60간지의 28번째 조합인 辛 천간과 卯 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:卯",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:27"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_sinmyo",
        "dayPillars:day_pillar_sinmyo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬辰",
    "category": "day_pillar",
    "key": "壬辰",
    "labelKo": "임진일주",
    "aliases": [
      "임진일주",
      "壬辰",
      "壬辰日柱",
      "임진"
    ],
    "definition": {
      "text": "壬辰는 60간지의 29번째 조합인 壬 천간과 辰 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:辰",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:28"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_imjin",
        "dayPillars:day_pillar_imjin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸巳",
    "category": "day_pillar",
    "key": "癸巳",
    "labelKo": "계사일주",
    "aliases": [
      "계사일주",
      "癸巳",
      "癸巳日柱",
      "계사"
    ],
    "definition": {
      "text": "癸巳는 60간지의 30번째 조합인 癸 천간과 巳 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:巳",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:29"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyesa",
        "dayPillars:day_pillar_gyesa"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲午",
    "category": "day_pillar",
    "key": "甲午",
    "labelKo": "갑오일주",
    "aliases": [
      "갑오일주",
      "甲午",
      "甲午日柱",
      "갑오"
    ],
    "definition": {
      "text": "甲午는 60간지의 31번째 조합인 甲 천간과 午 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:午",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:30"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gabo",
        "dayPillars:day_pillar_gabo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙未",
    "category": "day_pillar",
    "key": "乙未",
    "labelKo": "을미일주",
    "aliases": [
      "을미일주",
      "乙未",
      "乙未日柱",
      "을미"
    ],
    "definition": {
      "text": "乙未는 60간지의 32번째 조합인 乙 천간과 未 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:未",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:31"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_eulmi",
        "dayPillars:day_pillar_eulmi"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙申",
    "category": "day_pillar",
    "key": "丙申",
    "labelKo": "병신일주",
    "aliases": [
      "병신일주",
      "丙申",
      "丙申日柱",
      "병신"
    ],
    "definition": {
      "text": "丙申는 60간지의 33번째 조합인 丙 천간과 申 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:申",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:32"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_byeongsin",
        "dayPillars:day_pillar_byeongsin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁酉",
    "category": "day_pillar",
    "key": "丁酉",
    "labelKo": "정유일주",
    "aliases": [
      "정유일주",
      "丁酉",
      "丁酉日柱",
      "정유"
    ],
    "definition": {
      "text": "丁酉는 60간지의 34번째 조합인 丁 천간과 酉 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:酉",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:33"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_jeongyu",
        "dayPillars:day_pillar_jeongyu"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊戌",
    "category": "day_pillar",
    "key": "戊戌",
    "labelKo": "무술일주",
    "aliases": [
      "무술일주",
      "戊戌",
      "戊戌日柱",
      "무술"
    ],
    "definition": {
      "text": "戊戌는 60간지의 35번째 조합인 戊 천간과 戌 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:戌",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:34"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_musul",
        "dayPillars:day_pillar_musul"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己亥",
    "category": "day_pillar",
    "key": "己亥",
    "labelKo": "기해일주",
    "aliases": [
      "기해일주",
      "己亥",
      "己亥日柱",
      "기해"
    ],
    "definition": {
      "text": "己亥는 60간지의 36번째 조합인 己 천간과 亥 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:亥",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:35"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gihae",
        "taxonomy:day_pillar_gihae",
        "dayPillars:day_pillar_gihae"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚子",
    "category": "day_pillar",
    "key": "庚子",
    "labelKo": "경자일주",
    "aliases": [
      "경자일주",
      "庚子",
      "庚子日柱",
      "경자"
    ],
    "definition": {
      "text": "庚子는 60간지의 37번째 조합인 庚 천간과 子 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:子",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:36"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeongja",
        "dayPillars:day_pillar_gyeongja"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛丑",
    "category": "day_pillar",
    "key": "辛丑",
    "labelKo": "신축일주",
    "aliases": [
      "신축일주",
      "辛丑",
      "辛丑日柱",
      "신축"
    ],
    "definition": {
      "text": "辛丑는 60간지의 38번째 조합인 辛 천간과 丑 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:丑",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:37"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_sinchuk",
        "dayPillars:day_pillar_sinchuk"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬寅",
    "category": "day_pillar",
    "key": "壬寅",
    "labelKo": "임인일주",
    "aliases": [
      "임인일주",
      "壬寅",
      "壬寅日柱",
      "임인"
    ],
    "definition": {
      "text": "壬寅는 60간지의 39번째 조합인 壬 천간과 寅 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:寅",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:38"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_imin",
        "dayPillars:day_pillar_imin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸卯",
    "category": "day_pillar",
    "key": "癸卯",
    "labelKo": "계묘일주",
    "aliases": [
      "계묘일주",
      "癸卯",
      "癸卯日柱",
      "계묘"
    ],
    "definition": {
      "text": "癸卯는 60간지의 40번째 조합인 癸 천간과 卯 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:卯",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:39"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gyemyo",
        "taxonomy:day_pillar_gyemyo",
        "dayPillars:day_pillar_gyemyo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲辰",
    "category": "day_pillar",
    "key": "甲辰",
    "labelKo": "갑진일주",
    "aliases": [
      "갑진일주",
      "甲辰",
      "甲辰日柱",
      "갑진"
    ],
    "definition": {
      "text": "甲辰는 60간지의 41번째 조합인 甲 천간과 辰 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:辰",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:40"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gapjin",
        "taxonomy:day_pillar_gapjin",
        "dayPillars:day_pillar_gapjin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙巳",
    "category": "day_pillar",
    "key": "乙巳",
    "labelKo": "을사일주",
    "aliases": [
      "을사일주",
      "乙巳",
      "乙巳日柱",
      "을사"
    ],
    "definition": {
      "text": "乙巳는 60간지의 42번째 조합인 乙 천간과 巳 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:巳",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:41"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_eulsa",
        "taxonomy:day_pillar_eulsa",
        "dayPillars:day_pillar_eulsa"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙午",
    "category": "day_pillar",
    "key": "丙午",
    "labelKo": "병오일주",
    "aliases": [
      "병오일주",
      "丙午",
      "丙午日柱",
      "병오"
    ],
    "definition": {
      "text": "丙午는 60간지의 43번째 조합인 丙 천간과 午 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:午",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:42"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_byeongoh",
        "taxonomy:day_pillar_byeongo",
        "dayPillars:day_pillar_byeongo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁未",
    "category": "day_pillar",
    "key": "丁未",
    "labelKo": "정미일주",
    "aliases": [
      "정미일주",
      "丁未",
      "丁未日柱",
      "정미"
    ],
    "definition": {
      "text": "丁未는 60간지의 44번째 조합인 丁 천간과 未 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:未",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:43"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_jeongmi",
        "dayPillars:day_pillar_jeongmi"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊申",
    "category": "day_pillar",
    "key": "戊申",
    "labelKo": "무신일주",
    "aliases": [
      "무신일주",
      "戊申",
      "戊申日柱",
      "무신"
    ],
    "definition": {
      "text": "戊申는 60간지의 45번째 조합인 戊 천간과 申 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:申",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:44"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_musin",
        "dayPillars:day_pillar_musin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己酉",
    "category": "day_pillar",
    "key": "己酉",
    "labelKo": "기유일주",
    "aliases": [
      "기유일주",
      "己酉",
      "己酉日柱",
      "기유"
    ],
    "definition": {
      "text": "己酉는 60간지의 46번째 조합인 己 천간과 酉 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:酉",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:45"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_giyu",
        "dayPillars:day_pillar_giyu"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚戌",
    "category": "day_pillar",
    "key": "庚戌",
    "labelKo": "경술일주",
    "aliases": [
      "경술일주",
      "庚戌",
      "庚戌日柱",
      "경술"
    ],
    "definition": {
      "text": "庚戌는 60간지의 47번째 조합인 庚 천간과 戌 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:戌",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:46"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyeongsul",
        "dayPillars:day_pillar_gyeongsul"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛亥",
    "category": "day_pillar",
    "key": "辛亥",
    "labelKo": "신해일주",
    "aliases": [
      "신해일주",
      "辛亥",
      "辛亥日柱",
      "신해"
    ],
    "definition": {
      "text": "辛亥는 60간지의 48번째 조합인 辛 천간과 亥 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:亥",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:47"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_sinhae",
        "dayPillars:day_pillar_sinhae"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬子",
    "category": "day_pillar",
    "key": "壬子",
    "labelKo": "임자일주",
    "aliases": [
      "임자일주",
      "壬子",
      "壬子日柱",
      "임자"
    ],
    "definition": {
      "text": "壬子는 60간지의 49번째 조합인 壬 천간과 子 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:子",
      "foundation:hidden_stem:子"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:48"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_imja",
        "taxonomy:day_pillar_imja",
        "dayPillars:day_pillar_imja"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸丑",
    "category": "day_pillar",
    "key": "癸丑",
    "labelKo": "계축일주",
    "aliases": [
      "계축일주",
      "癸丑",
      "癸丑日柱",
      "계축"
    ],
    "definition": {
      "text": "癸丑는 60간지의 50번째 조합인 癸 천간과 丑 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:丑",
      "foundation:hidden_stem:丑"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:49"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyechuk",
        "dayPillars:day_pillar_gyechuk"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:甲寅",
    "category": "day_pillar",
    "key": "甲寅",
    "labelKo": "갑인일주",
    "aliases": [
      "갑인일주",
      "甲寅",
      "甲寅日柱",
      "갑인"
    ],
    "definition": {
      "text": "甲寅는 60간지의 51번째 조합인 甲 천간과 寅 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:甲",
      "foundation:earthly_branch:寅",
      "foundation:hidden_stem:寅"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:50"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gabin",
        "dayPillars:day_pillar_gabin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:乙卯",
    "category": "day_pillar",
    "key": "乙卯",
    "labelKo": "을묘일주",
    "aliases": [
      "을묘일주",
      "乙卯",
      "乙卯日柱",
      "을묘"
    ],
    "definition": {
      "text": "乙卯는 60간지의 52번째 조합인 乙 천간과 卯 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:乙",
      "foundation:earthly_branch:卯",
      "foundation:hidden_stem:卯"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:51"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_eulmyo",
        "dayPillars:day_pillar_eulmyo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丙辰",
    "category": "day_pillar",
    "key": "丙辰",
    "labelKo": "병진일주",
    "aliases": [
      "병진일주",
      "丙辰",
      "丙辰日柱",
      "병진"
    ],
    "definition": {
      "text": "丙辰는 60간지의 53번째 조합인 丙 천간과 辰 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丙",
      "foundation:earthly_branch:辰",
      "foundation:hidden_stem:辰"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:52"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_byeongjin",
        "dayPillars:day_pillar_byeongjin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:丁巳",
    "category": "day_pillar",
    "key": "丁巳",
    "labelKo": "정사일주",
    "aliases": [
      "정사일주",
      "丁巳",
      "丁巳日柱",
      "정사"
    ],
    "definition": {
      "text": "丁巳는 60간지의 54번째 조합인 丁 천간과 巳 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:丁",
      "foundation:earthly_branch:巳",
      "foundation:hidden_stem:巳"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:53"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_jeongsa",
        "dayPillars:day_pillar_jeongsa"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:戊午",
    "category": "day_pillar",
    "key": "戊午",
    "labelKo": "무오일주",
    "aliases": [
      "무오일주",
      "戊午",
      "戊午日柱",
      "무오"
    ],
    "definition": {
      "text": "戊午는 60간지의 55번째 조합인 戊 천간과 午 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:戊",
      "foundation:earthly_branch:午",
      "foundation:hidden_stem:午"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:54"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_muo",
        "dayPillars:day_pillar_muo"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:己未",
    "category": "day_pillar",
    "key": "己未",
    "labelKo": "기미일주",
    "aliases": [
      "기미일주",
      "己未",
      "己未日柱",
      "기미"
    ],
    "definition": {
      "text": "己未는 60간지의 56번째 조합인 己 천간과 未 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:己",
      "foundation:earthly_branch:未",
      "foundation:hidden_stem:未"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:55"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gimi",
        "dayPillars:day_pillar_gimi"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:庚申",
    "category": "day_pillar",
    "key": "庚申",
    "labelKo": "경신일주",
    "aliases": [
      "경신일주",
      "庚申",
      "庚申日柱",
      "경신"
    ],
    "definition": {
      "text": "庚申는 60간지의 57번째 조합인 庚 천간과 申 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:庚",
      "foundation:earthly_branch:申",
      "foundation:hidden_stem:申"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:56"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_gyeongsin",
        "taxonomy:day_pillar_gyeongsin",
        "dayPillars:day_pillar_gyeongsin"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:辛酉",
    "category": "day_pillar",
    "key": "辛酉",
    "labelKo": "신유일주",
    "aliases": [
      "신유일주",
      "辛酉",
      "辛酉日柱",
      "신유"
    ],
    "definition": {
      "text": "辛酉는 60간지의 58번째 조합인 辛 천간과 酉 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:辛",
      "foundation:earthly_branch:酉",
      "foundation:hidden_stem:酉"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:57"
      ],
      "legacyRefs": [
        "knowledge:day_pillar_sinyu",
        "taxonomy:day_pillar_sinyu",
        "dayPillars:day_pillar_sinyu"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:壬戌",
    "category": "day_pillar",
    "key": "壬戌",
    "labelKo": "임술일주",
    "aliases": [
      "임술일주",
      "壬戌",
      "壬戌日柱",
      "임술"
    ],
    "definition": {
      "text": "壬戌는 60간지의 59번째 조합인 壬 천간과 戌 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:壬",
      "foundation:earthly_branch:戌",
      "foundation:hidden_stem:戌"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:58"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_imsul",
        "dayPillars:day_pillar_imsul"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:day_pillar:癸亥",
    "category": "day_pillar",
    "key": "癸亥",
    "labelKo": "계해일주",
    "aliases": [
      "계해일주",
      "癸亥",
      "癸亥日柱",
      "계해"
    ],
    "definition": {
      "text": "癸亥는 60간지의 60번째 조합인 癸 천간과 亥 지지로 이루어진다. 일주로 쓸 때만 그날의 기둥을 뜻한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm1",
          "locator": "論支干源流; 十干十二支 衍而成六十"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "엔진이 해당 조합을 실제 일주로 계산한 경우."
    ],
    "doNotApply": [
      "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
      "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
    ],
    "distinctions": [
      "동일 간지는 연주·월주·시주에도 쓰이므로 60간지 이름 자체가 일주 성격을 뜻하지 않는다.",
      "일지의 지장간 십성은 일간과의 관계로 따로 확인한다."
    ],
    "relatedIds": [
      "foundation:day_master:癸",
      "foundation:earthly_branch:亥",
      "foundation:hidden_stem:亥"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SEXAGENARY_CYCLE",
        "index:59"
      ],
      "legacyRefs": [
        "taxonomy:day_pillar_gyehae",
        "dayPillars:day_pillar_gyehae"
      ]
    },
    "deferred": [
      "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
      "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
    ]
  },
  {
    "id": "foundation:ten_god:bijian",
    "category": "ten_god",
    "key": "bijian",
    "labelKo": "비견",
    "aliases": [
      "비견",
      "比肩"
    ],
    "definition": {
      "text": "일간과 오행 및 음양이 같은 관계이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_tengod",
          "locator": "getTenGod"
        }
      ]
    },
    "traditional": [
      {
        "text": "자기 기준·동료라는 전통 비유와 연결해 읽는 내부 자료다.",
        "review": "repository_only",
        "sourceRefs": [
          {
            "sourceId": "repo_knowledge",
            "locator": "ten_god_bijian"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:bijian"
      ],
      "positive": "자율성과 대등한 협력",
      "caution": "독립성을 강조하다 분담을 거부할 수 있다.",
      "excessOrDeficit": "비겁다자라고 언제나 경쟁이 나쁘다는 뜻은 아니다. 일간의 강약과 재성·관성의 관계를 먼저 확인한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "스스로 결정하려는 습관이 있다면 도움을 받아도 되는 부분을 구분할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "동등한 전문가와 일한다면 담당 영역과 최종 결정권을 합의할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "동업이나 공동 지출이 있다면 개인 계좌와 공동 비용의 경계를 정할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "혼자 공부하는 편이라면 막힌 문제를 누구에게 물을지 미리 정할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "대등한 연애를 원한다면 각자의 독립 시간과 함께할 시간을 이야기할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "혼인 생활에서는 서로의 기준을 존중하면서 공동 결정의 절차를 마련할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족 안에서 독립하려 한다면 도움과 간섭의 경계를 구체적으로 말할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "친구와 비슷한 목표를 갖더라도 서로의 속도를 순위로 평가하지 않을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_bijian",
        "taxonomy:ten_god_bijian"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:jie_cai",
    "category": "ten_god",
    "key": "jie_cai",
    "labelKo": "겁재",
    "aliases": [
      "겁재",
      "劫財"
    ],
    "definition": {
      "text": "일간과 오행이 같고 음양이 다른 관계이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_tengod",
          "locator": "getTenGod"
        }
      ]
    },
    "traditional": [
      {
        "text": "동류와 자원을 나누거나 경쟁하는 내부 해석 자료다.",
        "review": "repository_only",
        "sourceRefs": [
          {
            "sourceId": "repo_knowledge",
            "locator": "ten_god_jie_cai"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:jie_cai"
      ],
      "positive": "참여와 공동 행동",
      "caution": "같이 한다는 이유로 비용·책임의 경계가 흐려질 수 있다.",
      "excessOrDeficit": "재물 탈취를 사실로 예언하지 않는다. 비겁의 도움과 재성 분담은 원국 조건에 따라 구분한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "경쟁이 동기가 된다면 비교할 대상보다 본인의 개선 항목을 정할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "동료를 모아 일한다면 공동 성과의 배분 기준을 먼저 정할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "돈을 함께 쓰는 약속이라면 손실을 감당할 범위와 정산 시점을 확인할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "스터디를 한다면 서로 돕는 시간과 개인 공부 시간을 분리할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "상대와 활동을 함께할 때 본인이 좋아하는 것과 함께 맞추는 것을 구분할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "부부가 공동 비용을 운영한다면 각자의 자율 지출을 따로 합의할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "형제자매와 자원을 나눈다면 기여한 내용과 앞으로 맡을 일을 기록할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "모임에서 참여를 독려하더라도 참여하지 않을 선택을 인정할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_jie_cai",
        "taxonomy:ten_god_jie_cai"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:shi_shen",
    "category": "ten_god",
    "key": "shi_shen",
    "labelKo": "식신",
    "aliases": [
      "식신",
      "食神"
    ],
    "definition": {
      "text": "일간이 생하는 오행이며 음양이 같은 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "我生의 작용을 자손과 먹임의 비유로 명명하는 논법이다. 이 문화적 비유는 개인에게 자녀가 존재한다는 사실이 아니다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論古人立印食官財名義"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:shi_shen"
      ],
      "positive": "지속적으로 만들어 전달하는 가능성",
      "caution": "편한 표현 방식에 머무르면 다른 역할을 놓칠 수 있다.",
      "excessOrDeficit": "식신이 많다는 이유로 음식·자녀·수명·수익을 보장하지 않는다. 일간의 발산 여력과 인성·재성 관계를 함께 검토한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "직접 해보며 익히는 편이라면 작은 결과물을 만든 뒤 피드백을 받을 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "제작·서비스 업무라면 반복 가능한 품질 기준을 마련할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "솜씨를 유료로 제공한다면 제작 시간과 실제 원가를 계산해볼 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "연습으로 익히는 과목이라면 일정한 분량을 만들고 오류를 점검할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "돌보는 행동으로 호감을 전한다면 상대가 원하는 돌봄인지 물어볼 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "함께 사는 생활의 편안함을 만들 때 한 사람만 돌봄을 맡지 않도록 나눌 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족을 위해 무언가 해주고 싶다면 본인의 휴식 시간도 확보할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "경험을 나눌 때 상대가 직접 해볼 기회를 남겨둘 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_shi_shen",
        "taxonomy:ten_god_shi_shen"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:shang_guan",
    "category": "ten_god",
    "key": "shang_guan",
    "labelKo": "상관",
    "aliases": [
      "상관",
      "傷官"
    ],
    "definition": {
      "text": "일간이 생하는 오행이며 음양이 다른 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "甲이 丁을 생하고 丁이 정관인 辛을 제어하는 관계로 상관의 명칭을 설명한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論古人立印食官財名義"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:shang_guan"
      ],
      "positive": "질문과 개선안을 제시하는 가능성",
      "caution": "비판의 정확성만 강조하면 전달 방식이 거칠어질 수 있다.",
      "excessOrDeficit": "정관과 함께 보인다고 실패나 법적 문제를 단정하지 않는다. 인성·재성 및 강약·제화 조건을 함께 검토한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "모순이 먼저 보이는 편이라면 문제 제기와 대안을 함께 정리할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "업무 개선을 제안한다면 현행 절차의 목적을 먼저 확인할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "새 수익 모델을 제안할 때 설명의 설득력과 실제 수요를 따로 검증할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "기존 풀이를 의심한다면 다른 해법으로도 같은 답이 나오는지 시험할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "관계에서 불편함을 말할 때 상대의 성격보다 특정 행동을 짚을 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "부부의 관습을 바꾸려면 없앨 규칙과 대신할 합의를 함께 제안할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족의 오래된 기대를 거절한다면 가능한 대안을 구체적으로 말할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "토론에서 상대를 이기는 것과 함께 쓸 결론을 찾는 것을 구분할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_shang_guan",
        "taxonomy:ten_god_shang_guan"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:pian_cai",
    "category": "ten_god",
    "key": "pian_cai",
    "labelKo": "편재",
    "aliases": [
      "편재",
      "偏財"
    ],
    "definition": {
      "text": "일간이 극하는 오행이며 음양이 같은 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "정재와 같은 我克의 재성 범주이되 일간과 음양이 같은 관계로 구분한다.",
        "review": "repository_only",
        "sourceRefs": [
          {
            "sourceId": "repo_tengod",
            "locator": "getTenGod"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:pian_cai"
      ],
      "positive": "여러 자원과 기회를 연결하는 가능성",
      "caution": "기회를 동시에 벌리면 감당할 시간과 자금이 분산될 수 있다.",
      "excessOrDeficit": "재성의 존재와 실제 자산은 다르다. 일간의 감당 여력·비겁·관성의 조건을 확인한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "새 기회를 자주 발견한다면 실제로 맡을 수 있는 양을 먼저 정할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "외부 제안을 검토한다면 거래 상대와 역할·비용·종료 조건을 확인할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "변동 수입이 있다면 기대 매출과 확정 수입을 분리해 예산을 짤 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "여러 관심 분야를 연결할 때 핵심 과목의 학습 시간도 남겨둘 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "만남의 기회가 늘어도 한 사람과 합의한 관계의 경계를 확인할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "공동 재무를 운영한다면 외부 투자·지출의 사전 합의 한도를 정할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족에게 기회를 제안하기 전에 당사자가 원하는 방향인지 물을 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "사람을 소개할 때 서로 기대하는 도움과 부담을 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_pian_cai",
        "taxonomy:ten_god_pian_cai"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
      "외부·공동 재물이라는 편재의 전통 비유는 卷六 후반의 전사 경고로 독립 판본 대조 전 보류한다."
    ]
  },
  {
    "id": "foundation:ten_god:zheng_cai",
    "category": "ten_god",
    "key": "zheng_cai",
    "labelKo": "정재",
    "aliases": [
      "정재",
      "正財"
    ],
    "definition": {
      "text": "일간이 극하는 오행이며 음양이 다른 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "일간과 음양이 배합되는 재성 관계로 편재와 구분한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "卷首 印食官財 명의; 論正官·論偏官"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:zheng_cai"
      ],
      "positive": "관리와 축적의 가능성",
      "caution": "손실을 피하려다 필요한 지출까지 미룰 수 있다.",
      "excessOrDeficit": "정재가 있다고 고정 급여나 부유함을 보장하지 않는다. 재성의 강약과 일간의 여력을 확인한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "정해둔 것을 지키는 습관이 있다면 실제로 유지할 수 있는 기준인지 살필 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "반복 업무를 관리한다면 누적 기록과 예외 처리 규칙을 함께 둘 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "지출을 관리한다면 생활비·예비비·장기 목표를 분리해 점검할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "계획대로 공부한다면 진도뿐 아니라 이해도도 확인할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "꾸준한 연락이 중요하다면 상대와 현실적인 빈도를 합의할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "부부의 생활비를 정한다면 숫자뿐 아니라 각자가 중요하게 여기는 지출도 들을 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족을 지원한다면 지원 규모와 본인의 생활 유지 범위를 함께 정할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "약속을 잘 지키는 만큼 지키기 어려워진 약속도 미리 조정할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_zheng_cai",
        "taxonomy:ten_god_zheng_cai"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:qi_sha",
    "category": "ten_god",
    "key": "qi_sha",
    "labelKo": "편관",
    "aliases": [
      "편관",
      "偏官",
      "칠살",
      "七殺",
      "七煞"
    ],
    "definition": {
      "text": "일간을 극하는 오행이며 음양이 같은 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "칠살이라고도 부르며, 제어·도움·강약에 따라 쓰임을 달리 논한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "卷首 印食官財 명의; 論正官·論偏官"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:qi_sha"
      ],
      "positive": "압박 속에서 대응 기준을 만드는 가능성",
      "caution": "긴장 상태가 길어지면 도움 요청과 회복을 놓칠 수 있다.",
      "excessOrDeficit": "칠살 하나를 흉으로 확정하지 않는다. 일간의 강약·식신의 제어·인성의 화살 조건은 실제 근거가 있어야 한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "급한 일을 우선 처리하는 편이라면 급하지 않은 회복 시간도 일정에 둘 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "위기 대응 업무라면 권한·보고 시점·지원 인력을 먼저 확인할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "빨리 결정해야 하는 거래라도 감당 가능한 손실 한도를 먼저 정할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "시험 압박이 크다면 남은 시간에 할 문제와 내려놓을 범위를 정할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "상대를 보호하려는 행동이 있다면 상대가 원하는 도움인지 확인할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "생활의 위험을 관리할 때 한 사람이 모든 통제권을 갖지 않도록 합의할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족의 급한 문제를 맡더라도 전문 지원이 필요한 부분을 구분할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "갈등에 개입할 때 사실 확인과 중재 권한을 먼저 살필 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_qi_sha",
        "taxonomy:ten_god_qi_sha"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:zheng_guan",
    "category": "ten_god",
    "key": "zheng_guan",
    "labelKo": "정관",
    "aliases": [
      "정관",
      "正官"
    ],
    "definition": {
      "text": "일간을 극하는 오행이며 음양이 다른 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 印食官財 명의; 論正官·論偏官"
        }
      ]
    },
    "traditional": [
      {
        "text": "음양이 배합된 제어 관계로, 규범·직분의 비유를 사용한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "卷首 印食官財 명의; 論正官·論偏官"
          }
        ],
        "aspect": "symbol"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:zheng_guan"
      ],
      "positive": "약속과 역할을 통해 신뢰를 쌓는 가능성",
      "caution": "형식에 맞추느라 필요한 예외를 설명하지 못할 수 있다.",
      "excessOrDeficit": "정관이 많거나 없다는 이유로 신분·취업·도덕성·배우자를 단정하지 않는다. 강약·재인·혼잡 조건을 확인한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "역할을 중요하게 여긴다면 남의 기대와 본인의 동의를 구분할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "조직 업무라면 책임 범위와 평가 기준을 문서로 확인할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "계약에 따른 수입을 관리한다면 지급 조건과 기한을 점검할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "평가 기준이 있는 공부라면 출제 범위와 채점 기준을 확인할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "관계를 명확히 하고 싶다면 호칭보다 서로의 기대와 동의를 이야기할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "부부의 책임을 정할 때 전통적 역할보다 두 사람의 실제 사정을 기준으로 합의할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족의 기대를 따르기 전에 본인이 감당할 역할인지 확인할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "모임 규칙을 운영한다면 모두가 같은 기준으로 안내받는지 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_zheng_guan",
        "taxonomy:ten_god_zheng_guan"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
    ]
  },
  {
    "id": "foundation:ten_god:pian_yin",
    "category": "ten_god",
    "key": "pian_yin",
    "labelKo": "편인",
    "aliases": [
      "편인",
      "偏印"
    ],
    "definition": {
      "text": "일간을 생하는 오행이며 음양이 같은 관계이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_tengod",
          "locator": "getTenGod"
        }
      ]
    },
    "traditional": [
      {
        "text": "印綬를 生我의 관계로 이름 붙이고 보호·받음의 비유를 사용한다. 이 범주의 설명만으로 정인·편인의 세부 의미 차이가 모두 검증된 것은 아니다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論古人立印食官財名義"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "정인·편인의 음양 구분은 현행 getTenGod의 매핑을 따른다.",
        "review": "repository_only",
        "sourceRefs": [
          {
            "sourceId": "repo_tengod",
            "locator": "getTenGod"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:pian_yin"
      ],
      "positive": "관점을 깊게 탐색하는 가능성",
      "caution": "검토가 길어지면 외부 확인과 실행을 미룰 수 있다.",
      "excessOrDeficit": "편인이 보였다는 이유로 도식이 성립하거나 학습·가족 문제가 생긴다고 보지 않는다. 식신·재성 등 실제 조건을 확인한다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "남들이 넘기는 질문을 오래 살핀다면 탐색의 종료 기준도 정할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "연구·분석 업무라면 가설과 확인된 사실을 따로 적을 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "투자 자료를 깊이 읽더라도 정보량과 수익 확률을 동일시하지 않을 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "독자적인 공부를 할 때 기초 자료의 출처와 반례를 함께 확인할 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "혼자 생각할 시간이 필요하다면 연락을 끊기보다 필요한 시간을 말할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "생활 방식이 독특하더라도 공동 일정과 개인 몰입 시간을 합의할 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족에게 설명하기 어려운 관심사라면 필요한 지원을 구체적으로 요청할 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "상대의 말을 여러 뜻으로 해석하기 전에 당사자에게 의도를 물을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_pian_yin",
        "taxonomy:ten_god_pian_yin"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
      "정인·편인의 세부 명명과 도식/효신 조건은 경고 없는 독립 판본 대조 전 보류한다."
    ]
  },
  {
    "id": "foundation:ten_god:zheng_yin",
    "category": "ten_god",
    "key": "zheng_yin",
    "labelKo": "정인",
    "aliases": [
      "정인",
      "正印"
    ],
    "definition": {
      "text": "일간을 생하는 오행이며 음양이 다른 관계이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_tengod",
          "locator": "getTenGod"
        }
      ]
    },
    "traditional": [
      {
        "text": "印綬를 生我의 관계로 이름 붙이고 보호·받음의 비유를 사용한다. 이 범주의 설명만으로 정인·편인의 세부 의미 차이가 모두 검증된 것은 아니다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm5",
            "locator": "論古人立印食官財名義"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "정인·편인의 음양 구분은 현행 getTenGod의 매핑을 따른다.",
        "review": "repository_only",
        "sourceRefs": [
          {
            "sourceId": "repo_tengod",
            "locator": "getTenGod"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:ten_god:zheng_yin"
      ],
      "positive": "배움과 도움을 받아 기반을 만드는 가능성",
      "caution": "준비와 보호에 기대면 스스로 시도할 때를 늦출 수 있다.",
      "excessOrDeficit": "인성 유무로 지능·학력·부모의 사랑을 단정하지 않는다. 인성의 지원과 과용은 원국과 실제 행동을 함께 본다.",
      "applications": {
        "personality": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "확실한 설명을 선호한다면 충분히 이해한 부분부터 시도할 수 있다."
        },
        "career": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "선배에게 배울 때 받은 안내를 실제 업무로 옮겨 질문을 구체화할 수 있다."
        },
        "money": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "재무 조언을 받는다면 조언자의 이해관계와 본인의 조건을 확인할 수 있다."
        },
        "study": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "자료를 체계적으로 읽는다면 배운 내용을 자기 문제에 적용해볼 수 있다."
        },
        "love": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "돌봄을 받는 관계라면 고마움과 본인의 독립적인 의견을 함께 표현할 수 있다."
        },
        "marriage": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "서로 지지하는 부부라도 상대 대신 결정하지 않도록 물어볼 수 있다."
        },
        "family": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "가족의 도움을 받는다면 계속 필요한 부분과 스스로 맡을 부분을 나눌 수 있다."
        },
        "relationships": {
          "when": "실제 생활 맥락과 행동이 확인된 경우에만 비교 질문으로 사용한다.",
          "example": "조언을 해주기 전에 상대가 조언과 경청 중 무엇을 원하는지 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 기준의 관계 분류로, 원국·대운·세운 중 어느 출처인지 별도 표시해야 한다.",
      "직업명·실제 자산·배우자 신분·지능 검사가 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.tenGods",
        "getTenGod"
      ],
      "legacyRefs": [
        "knowledge:ten_god_zheng_yin",
        "taxonomy:ten_god_zheng_yin"
      ]
    },
    "deferred": [
      "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
      "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
      "정인·편인의 세부 명명과 도식/효신 조건은 경고 없는 독립 판본 대조 전 보류한다."
    ]
  },
  {
    "id": "foundation:twelve_stage:changsheng",
    "category": "twelve_stage",
    "key": "changsheng",
    "labelKo": "장생",
    "aliases": [
      "장생",
      "長生"
    ],
    "definition": {
      "text": "만물이 처음 생겨 자라기 시작하는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 長生"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:changsheng"
      ],
      "positive": "시작을 허용하는 관점",
      "caution": "시작의 가능성을 즉시 완성된 실력으로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "새 일을 배울 때 기초 연습과 도움받을 통로를 확보해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:muyu",
    "category": "twelve_stage",
    "key": "muyu",
    "labelKo": "목욕",
    "aliases": [
      "목욕",
      "沐浴",
      "敗",
      "패"
    ],
    "definition": {
      "text": "막 생긴 형체가 여리고 새 환경에 적응하는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 沐浴"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:muyu"
      ],
      "positive": "새 방식에 적응하는 관점",
      "caution": "주변 반응에 따라 기준을 자주 바꿀 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "새 환경에 적응 중이라면 피드백을 받되 매번 전부 바꾸지 않을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:guandai",
    "category": "twelve_stage",
    "key": "guandai",
    "labelKo": "관대",
    "aliases": [
      "관대",
      "冠帶"
    ],
    "definition": {
      "text": "성장한 모습을 갖추어 드러내는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 冠帶"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:guandai"
      ],
      "positive": "역할을 맡아보는 관점",
      "caution": "겉으로 갖춘 모습과 실제 준비를 혼동할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "새 역할을 맡았다면 보이는 형식과 실제로 할 일을 나누어 준비할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:linguan",
    "category": "twelve_stage",
    "key": "linguan",
    "labelKo": "건록",
    "aliases": [
      "건록",
      "臨官",
      "임관",
      "建祿"
    ],
    "definition": {
      "text": "역할을 수행할 기반이 갖추어진 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 臨官"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:linguan"
      ],
      "positive": "스스로 맡아 수행하는 관점",
      "caution": "독립적으로 해야 한다는 부담에 도움을 거절할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "반복 업무를 맡았다면 혼자 처리할 범위와 지원이 필요한 범위를 정할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:diwang",
    "category": "twelve_stage",
    "key": "diwang",
    "labelKo": "제왕",
    "aliases": [
      "제왕",
      "帝旺"
    ],
    "definition": {
      "text": "성숙하여 힘이 가장 왕성한 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 帝旺"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:diwang"
      ],
      "positive": "주도적으로 활용하는 관점",
      "caution": "힘이 충분하다는 생각에 과도하게 벌릴 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "주도권을 맡았다면 결정권과 책임을 함께 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:shuai",
    "category": "twelve_stage",
    "key": "shuai",
    "labelKo": "쇠",
    "aliases": [
      "쇠",
      "衰"
    ],
    "definition": {
      "text": "왕성함이 줄어들고 거두는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 衰"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:shuai"
      ],
      "positive": "경험을 선별해 쓰는 관점",
      "caution": "물러남의 비유를 실패라고 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "경험이 쌓인 일을 정리할 때 남길 과정과 줄일 과정을 구분할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:bing",
    "category": "twelve_stage",
    "key": "bing",
    "labelKo": "병",
    "aliases": [
      "병",
      "病"
    ],
    "definition": {
      "text": "생장의 힘이 약해진 상태를 병에 빗댄 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 病"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:bing"
      ],
      "positive": "속도를 살피는 관점",
      "caution": "기운 단계의 이름을 실제 질병으로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "일의 속도를 조절할 상황이라면 목표와 부담을 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:si",
    "category": "twelve_stage",
    "key": "si",
    "labelKo": "사",
    "aliases": [
      "사",
      "死"
    ],
    "definition": {
      "text": "활동이 멈추는 모습을 죽음에 빗댄 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 死"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:si"
      ],
      "positive": "멈추어 점검하는 관점",
      "caution": "종료 비유를 실제 사망이나 파국으로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "한 방식을 끝내려 한다면 마무리할 기록과 다음 선택을 정리할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:mu",
    "category": "twelve_stage",
    "key": "mu",
    "labelKo": "묘",
    "aliases": [
      "묘",
      "墓",
      "庫",
      "고"
    ],
    "definition": {
      "text": "완성된 것을 안에 저장하는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 墓"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:mu"
      ],
      "positive": "경험을 보관하는 관점",
      "caution": "저장 비유를 고립이나 재물 축적의 보장으로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "경험을 정리할 때 다시 쓸 자료와 보내도 되는 자료를 나눌 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:jue",
    "category": "twelve_stage",
    "key": "jue",
    "labelKo": "절",
    "aliases": [
      "절",
      "絕",
      "受氣",
      "수기"
    ],
    "definition": {
      "text": "앞의 형상이 사라지고 새 기운을 받기 전의 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 絕"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:jue"
      ],
      "positive": "익숙한 틀을 비우는 관점",
      "caution": "끊김의 이름을 모든 관계 단절로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "기존 방법이 맞지 않다면 작은 대안부터 시험해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:tai",
    "category": "twelve_stage",
    "key": "tai",
    "labelKo": "태",
    "aliases": [
      "태",
      "胎",
      "受胎",
      "수태"
    ],
    "definition": {
      "text": "새 기운이 맺히고 아직 뚜렷한 형체는 없는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 胎"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:tai"
      ],
      "positive": "가능성을 준비하는 관점",
      "caution": "준비 단계의 상징을 실제 임신으로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "아이디어가 생겼다면 실행 가능성을 확인할 작은 실험을 설계할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:twelve_stage:yang",
    "category": "twelve_stage",
    "key": "yang",
    "labelKo": "양",
    "aliases": [
      "양",
      "養",
      "成形",
      "성형"
    ],
    "definition": {
      "text": "형체를 갖추며 보살핌 속에서 자라는 단계를 뜻하는 전통 상징어다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論五行旺相休囚死並寄生十二宮 養"
        }
      ]
    },
    "traditional": [
      {
        "text": "생왕을 곧 길로, 사절을 곧 흉으로 보지 않고 태과·불급과 생부·제복의 조건을 함께 보도록 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "寄生十二宮 末段"
          }
        ],
        "aspect": "condition"
      },
      {
        "text": "陰陽의 생사 순역을 한 가지 고정 길흉 규칙으로 고집하지 말라고 경계한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "dt",
            "locator": "地支論 陽順陰逆"
          }
        ],
        "aspect": "caution"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:twelve_stage:yang"
      ],
      "positive": "지원받으며 익히는 관점",
      "caution": "보호의 비유를 의존해야 한다는 지시로 오해할 수 있다.",
      "excessOrDeficit": "같은 단계도 월령·일간 및 다른 근거와 함께 읽으며 강한 단계가 무조건 유리하다고 보지 않는다.",
      "applications": {
        "career": {
          "when": "비유와 비슷한 실제 상황이 확인된 경우에만 자기 점검 예시로 쓴다.",
          "example": "배우는 단계라면 도움받을 내용과 직접 해볼 부분을 나눌 수 있다."
        }
      }
    },
    "appliesWhen": [
      "검증된 일간 및 해당 지지의 표시 단계가 확인되었을 때."
    ],
    "doNotApply": [
      "병·사·태·묘를 질병·사망·임신·장례 사건으로 풀이하는 용도.",
      "모든 양간/음간 순역 계보를 한 전통만으로 정답 처리하는 용도."
    ],
    "distinctions": [
      "십이신살과 이름의 개수만 같을 뿐 분류·산출 기준이 다르다.",
      "건록은 이 표시표에서 臨官에 대응한다. 별도의 建祿 격국 성립과 동일하지 않다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "SAJU_PILLAR_DISPLAY_HELPERS.twelveLifeStageByStem"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "단계별 직업·재물·연애·결혼·가족 운세는 이름의 생애 비유만으로 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:子",
    "category": "hidden_stem",
    "key": "子",
    "labelKo": "자의 지장간",
    "aliases": [
      "자의 지장간",
      "子藏干",
      "자장간"
    ],
    "definition": {
      "text": "현행 엔진의 子 지장간 집합은 癸이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.子"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:子",
      "foundation:heavenly_stem:癸"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.子",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:丑",
    "category": "hidden_stem",
    "key": "丑",
    "labelKo": "축의 지장간",
    "aliases": [
      "축의 지장간",
      "丑藏干",
      "축장간"
    ],
    "definition": {
      "text": "현행 엔진의 丑 지장간 집합은 己·癸·辛이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.丑"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:丑",
      "foundation:heavenly_stem:己",
      "foundation:heavenly_stem:癸",
      "foundation:heavenly_stem:辛"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.丑",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:寅",
    "category": "hidden_stem",
    "key": "寅",
    "labelKo": "인의 지장간",
    "aliases": [
      "인의 지장간",
      "寅藏干",
      "인장간"
    ],
    "definition": {
      "text": "현행 엔진의 寅 지장간 집합은 甲·丙·戊이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.寅"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:寅",
      "foundation:heavenly_stem:甲",
      "foundation:heavenly_stem:丙",
      "foundation:heavenly_stem:戊"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.寅",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:卯",
    "category": "hidden_stem",
    "key": "卯",
    "labelKo": "묘의 지장간",
    "aliases": [
      "묘의 지장간",
      "卯藏干",
      "묘장간"
    ],
    "definition": {
      "text": "현행 엔진의 卯 지장간 집합은 乙이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.卯"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:卯",
      "foundation:heavenly_stem:乙"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.卯",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:辰",
    "category": "hidden_stem",
    "key": "辰",
    "labelKo": "진의 지장간",
    "aliases": [
      "진의 지장간",
      "辰藏干",
      "진장간"
    ],
    "definition": {
      "text": "현행 엔진의 辰 지장간 집합은 戊·乙·癸이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.辰"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:辰",
      "foundation:heavenly_stem:戊",
      "foundation:heavenly_stem:乙",
      "foundation:heavenly_stem:癸"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.辰",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:巳",
    "category": "hidden_stem",
    "key": "巳",
    "labelKo": "사의 지장간",
    "aliases": [
      "사의 지장간",
      "巳藏干",
      "사장간"
    ],
    "definition": {
      "text": "현행 엔진의 巳 지장간 집합은 丙·戊·庚이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.巳"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:巳",
      "foundation:heavenly_stem:丙",
      "foundation:heavenly_stem:戊",
      "foundation:heavenly_stem:庚"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.巳",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:午",
    "category": "hidden_stem",
    "key": "午",
    "labelKo": "오의 지장간",
    "aliases": [
      "오의 지장간",
      "午藏干",
      "오장간"
    ],
    "definition": {
      "text": "현행 엔진의 午 지장간 집합은 丁·己이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.午"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:午",
      "foundation:heavenly_stem:丁",
      "foundation:heavenly_stem:己"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.午",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:未",
    "category": "hidden_stem",
    "key": "未",
    "labelKo": "미의 지장간",
    "aliases": [
      "미의 지장간",
      "未藏干",
      "미장간"
    ],
    "definition": {
      "text": "현행 엔진의 未 지장간 집합은 己·丁·乙이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.未"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:未",
      "foundation:heavenly_stem:己",
      "foundation:heavenly_stem:丁",
      "foundation:heavenly_stem:乙"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.未",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:申",
    "category": "hidden_stem",
    "key": "申",
    "labelKo": "신의 지장간",
    "aliases": [
      "신의 지장간",
      "申藏干",
      "신장간"
    ],
    "definition": {
      "text": "현행 엔진의 申 지장간 집합은 庚·壬·戊이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.申"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:申",
      "foundation:heavenly_stem:庚",
      "foundation:heavenly_stem:壬",
      "foundation:heavenly_stem:戊"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.申",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:酉",
    "category": "hidden_stem",
    "key": "酉",
    "labelKo": "유의 지장간",
    "aliases": [
      "유의 지장간",
      "酉藏干",
      "유장간"
    ],
    "definition": {
      "text": "현행 엔진의 酉 지장간 집합은 辛이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.酉"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:酉",
      "foundation:heavenly_stem:辛"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.酉",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:戌",
    "category": "hidden_stem",
    "key": "戌",
    "labelKo": "술의 지장간",
    "aliases": [
      "술의 지장간",
      "戌藏干",
      "술장간"
    ],
    "definition": {
      "text": "현행 엔진의 戌 지장간 집합은 戊·辛·丁이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.戌"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:戌",
      "foundation:heavenly_stem:戊",
      "foundation:heavenly_stem:辛",
      "foundation:heavenly_stem:丁"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.戌",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:hidden_stem:亥",
    "category": "hidden_stem",
    "key": "亥",
    "labelKo": "해의 지장간",
    "aliases": [
      "해의 지장간",
      "亥藏干",
      "해장간"
    ],
    "definition": {
      "text": "현행 엔진의 亥 지장간 집합은 壬·甲이다. 이는 지지 속 천간을 표현하는 저장소 상수다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_constants",
          "locator": "HIDDEN_STEMS.亥"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 人元司事는 월령 안에서 시기별로 작용하는 인원을 설명한다. 현재의 고정 지장간 집합·가중치표와 동일한 표로 취급할 수 없다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論人元司事"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
      "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
    ],
    "distinctions": [
      "본기·중기·여기의 고정 weight 0.6/0.3/0.1은 프로젝트의 계산 계약이지 해당 고전이 입증한 확률이 아니다.",
      "같은 지장간도 일간이 달라지면 십성이 달라진다.",
      "又地支藏遁歌 전사와 집합은 대조했으나 그 페이지의 출처 경고로 외부 검증 완료라고 하지 않는다."
    ],
    "relatedIds": [
      "foundation:earthly_branch:亥",
      "foundation:heavenly_stem:壬",
      "foundation:heavenly_stem:甲"
    ],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "HIDDEN_STEMS.亥",
        "SajuCalcResult.tenGods.hiddenStems"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
      "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
    ]
  },
  {
    "id": "foundation:position:year",
    "category": "position",
    "key": "year",
    "labelKo": "연주",
    "aliases": [
      "연주",
      "年柱"
    ],
    "definition": {
      "text": "연주는 출생의 연을 간지로 나타내는 기둥이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "aks",
          "locator": "내용 사주의 구성"
        }
      ]
    },
    "traditional": [
      {
        "text": "뿌리·선대의 자리에 비유하는 논법이 있다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論遁月時"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "고법의 연 기준과 자평의 일 기준, 월령의 중요성을 구분하고 네 자리를 합쳐 보아야 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論年月日時"
          }
        ],
        "aspect": "condition"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:position:year"
      ],
      "positive": "가족 배경을 묻는 관점",
      "caution": "가족의 경제력이나 부모의 경험을 사주만으로 사실화할 수 없다.",
      "excessOrDeficit": "기둥의 누락은 성격·가족·미래의 결핍이 아니라 계산 정보의 불확실성이다.",
      "applications": {
        "family": {
          "when": "관련 생활 상황을 당사자가 실제로 확인했을 때만 질문으로 활용한다.",
          "example": "가족의 기대를 검토할 상황이라면 본인이 실제로 받은 기대와 원하는 선택을 구분할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
    ],
    "doNotApply": [
      "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
      "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
    ],
    "distinctions": [
      "위치는 해석 맥락이며 그곳의 천간·지지·십성과 동일한 분류가 아니다.",
      "각 자리의 연령 구간은 계보 차이가 있어 단일 시간표로 확정하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.pillars.year"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
    ]
  },
  {
    "id": "foundation:position:month",
    "category": "position",
    "key": "month",
    "labelKo": "월주",
    "aliases": [
      "월주",
      "月柱"
    ],
    "definition": {
      "text": "월주는 출생의 월을 간지로 나타내는 기둥이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "aks",
          "locator": "내용 사주의 구성"
        }
      ]
    },
    "traditional": [
      {
        "text": "묘목·월령의 자리에 비유하는 논법이 있다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論遁月時"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "고법의 연 기준과 자평의 일 기준, 월령의 중요성을 구분하고 네 자리를 합쳐 보아야 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論年月日時"
          }
        ],
        "aspect": "condition"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:position:month"
      ],
      "positive": "계절과 생활 환경을 함께 보는 관점",
      "caution": "월지를 현재 직장이나 실제 사회적 지위라고 단정할 수 없다.",
      "excessOrDeficit": "기둥의 누락은 성격·가족·미래의 결핍이 아니라 계산 정보의 불확실성이다.",
      "applications": {
        "personality": {
          "when": "관련 생활 상황을 당사자가 실제로 확인했을 때만 질문으로 활용한다.",
          "example": "생활 환경을 정리할 때 일이나 학습에서 요구되는 조건을 실제로 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
    ],
    "doNotApply": [
      "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
      "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
    ],
    "distinctions": [
      "위치는 해석 맥락이며 그곳의 천간·지지·십성과 동일한 분류가 아니다.",
      "각 자리의 연령 구간은 계보 차이가 있어 단일 시간표로 확정하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.pillars.month"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
    ]
  },
  {
    "id": "foundation:position:day",
    "category": "position",
    "key": "day",
    "labelKo": "일주",
    "aliases": [
      "일주",
      "日柱"
    ],
    "definition": {
      "text": "일주는 출생의 일을 간지로 나타내는 기둥이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "aks",
          "locator": "내용 사주의 구성"
        }
      ]
    },
    "traditional": [
      {
        "text": "꽃·자신과 가까운 관계의 자리에 비유하는 논법이 있다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論遁月時"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "고법의 연 기준과 자평의 일 기준, 월령의 중요성을 구분하고 네 자리를 합쳐 보아야 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論年月日時"
          }
        ],
        "aspect": "condition"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:position:day"
      ],
      "positive": "본인의 기준과 가까운 관계를 함께 보는 관점",
      "caution": "일지 하나로 배우자의 성격·신분·유무를 확정할 수 없다.",
      "excessOrDeficit": "기둥의 누락은 성격·가족·미래의 결핍이 아니라 계산 정보의 불확실성이다.",
      "applications": {
        "love": {
          "when": "관련 생활 상황을 당사자가 실제로 확인했을 때만 질문으로 활용한다.",
          "example": "가까운 관계에서 본인의 요구와 상대의 요구를 따로 말해볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
    ],
    "doNotApply": [
      "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
      "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
    ],
    "distinctions": [
      "위치는 해석 맥락이며 그곳의 천간·지지·십성과 동일한 분류가 아니다.",
      "각 자리의 연령 구간은 계보 차이가 있어 단일 시간표로 확정하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.pillars.day"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
    ]
  },
  {
    "id": "foundation:position:hour",
    "category": "position",
    "key": "hour",
    "labelKo": "시주",
    "aliases": [
      "시주",
      "時柱"
    ],
    "definition": {
      "text": "시주는 출생의 시을 간지로 나타내는 기둥이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "aks",
          "locator": "내용 사주의 구성"
        }
      ]
    },
    "traditional": [
      {
        "text": "열매·뒤의 결실의 자리에 비유하는 논법이 있다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論遁月時"
          }
        ],
        "aspect": "symbol"
      },
      {
        "text": "고법의 연 기준과 자평의 일 기준, 월령의 중요성을 구분하고 네 자리를 합쳐 보아야 한다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm2",
            "locator": "論年月日時"
          }
        ],
        "aspect": "condition"
      }
    ],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:position:hour"
      ],
      "positive": "이어갈 일과 돌봄을 살피는 관점",
      "caution": "시주로 자녀의 존재·건강·성공이나 노년 사건을 단정할 수 없다.",
      "excessOrDeficit": "기둥의 누락은 성격·가족·미래의 결핍이 아니라 계산 정보의 불확실성이다.",
      "applications": {
        "family": {
          "when": "관련 생활 상황을 당사자가 실제로 확인했을 때만 질문으로 활용한다.",
          "example": "이어갈 활동을 정리한다면 직접 할 일과 다른 사람에게 맡길 일을 나눌 수 있다."
        }
      }
    },
    "appliesWhen": [
      "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
    ],
    "doNotApply": [
      "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
      "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
    ],
    "distinctions": [
      "위치는 해석 맥락이며 그곳의 천간·지지·십성과 동일한 분류가 아니다.",
      "각 자리의 연령 구간은 계보 차이가 있어 단일 시간표로 확정하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.pillars.hour"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:hyeonchim",
    "category": "shinsal_gwiin",
    "key": "hyeonchim",
    "labelKo": "현침살",
    "aliases": [
      "현침살",
      "현침"
    ],
    "definition": {
      "text": "현침살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_hyeonchim"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:HYEONCHIMSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_hyeonchim",
        "taxonomy:sinsal_hyeonchim",
        "shinsal:HYEONCHIMSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:hongyeom",
    "category": "shinsal_gwiin",
    "key": "hongyeom",
    "labelKo": "홍염살",
    "aliases": [
      "홍염살",
      "홍염"
    ],
    "definition": {
      "text": "홍염살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_hongyeom"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:HONGYEOMSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_hongyeom",
        "taxonomy:sinsal_hongyeom",
        "shinsal:HONGYEOMSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:mangsin",
    "category": "shinsal_gwiin",
    "key": "mangsin",
    "labelKo": "망신살",
    "aliases": [
      "망신살",
      "망신"
    ],
    "definition": {
      "text": "망신살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_mangsin"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:MANGSINSAL",
        "SHINSAL_RULES:TWELVE_MANGSINSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_mangsin",
        "taxonomy:twelve_sinsal_mangsin",
        "shinsal:MANGSINSAL",
        "shinsal:TWELVE_MANGSINSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:baekho",
    "category": "shinsal_gwiin",
    "key": "baekho",
    "labelKo": "백호대살",
    "aliases": [
      "백호대살",
      "백호",
      "백호살"
    ],
    "definition": {
      "text": "백호대살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_baekho"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:BAEKHODAESAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_baekho",
        "taxonomy:sinsal_baekho",
        "shinsal:BAEKHODAESAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:yeokma",
    "category": "shinsal_gwiin",
    "key": "yeokma",
    "labelKo": "역마살",
    "aliases": [
      "역마살",
      "역마",
      "驛馬"
    ],
    "definition": {
      "text": "삼합 계열에 따라 정한 이동의 상징이다. 원국 조건과 다른 보조 근거를 함께 살핀다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論驛馬"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:yeokma"
      ],
      "positive": "환경을 바꾸며 살필 가능성",
      "caution": "해외 이주·직장 이동·사고의 발생을 확정할 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "이동을 고려한다면 실제 비용과 머무를 조건을 비교할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:YEOKMASAL",
        "SHINSAL_RULES:TWELVE_YEOKMASAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_yeokma",
        "taxonomy:twelve_sinsal_yeokma",
        "shinsal:YEOKMASAL",
        "shinsal:TWELVE_YEOKMASAL"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:gwimun",
    "category": "shinsal_gwiin",
    "key": "gwimun",
    "labelKo": "귀문관살",
    "aliases": [
      "귀문관살",
      "귀문",
      "귀문관"
    ],
    "definition": {
      "text": "귀문관살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_gwimun"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: gwimun"
      ],
      "legacyRefs": [
        "knowledge:sinsal_gwimun",
        "taxonomy:sinsal_gwimun"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:wonjin",
    "category": "shinsal_gwiin",
    "key": "wonjin",
    "labelKo": "원진살",
    "aliases": [
      "원진살",
      "원진"
    ],
    "definition": {
      "text": "원진살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_wonjin"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: wonjin"
      ],
      "legacyRefs": [
        "knowledge:sinsal_wonjin",
        "taxonomy:sinsal_wonjin"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:dohwa",
    "category": "shinsal_gwiin",
    "key": "dohwa",
    "labelKo": "도화살",
    "aliases": [
      "도화살",
      "도화",
      "桃花/咸池"
    ],
    "definition": {
      "text": "咸池·桃花라고 부르는 보조 분류로 삼합 계열의 목욕 자리를 사용한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論咸池"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:dohwa"
      ],
      "positive": "관심과 표현을 점검하는 관점",
      "caution": "고전의 성별 도덕 평가·불륜 단정을 현대 고객에게 적용하지 않는다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "relationships": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "주목받는 상황이라면 상대가 이해한 표현과 본인의 의도를 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:DOHWASAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_dohwa",
        "taxonomy:sinsal_dohwa",
        "shinsal:DOHWASAL"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:hwagae",
    "category": "shinsal_gwiin",
    "key": "hwagae",
    "labelKo": "화개살",
    "aliases": [
      "화개살",
      "화개",
      "華蓋"
    ],
    "definition": {
      "text": "덮개 형상에 빗대며 삼합의 저장 자리를 쓰는 분류다. 고전의 고독·예술 비유는 현대의 실제 가족 사실과 구별한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論將星華蓋"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:hwagae"
      ],
      "positive": "혼자 깊이 익히는 시간을 살피는 관점",
      "caution": "고독·종교인·예술가의 운명을 확정할 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "study": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "혼자 몰입할 일이 있다면 필요한 집중 시간과 사람을 만날 시간을 함께 둘 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:HWAGAE",
        "SHINSAL_RULES:TWELVE_HWAGAE"
      ],
      "legacyRefs": [
        "knowledge:sinsal_hwagae",
        "taxonomy:twelve_sinsal_hwagae",
        "shinsal:HWAGAE",
        "shinsal:TWELVE_HWAGAE"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:goegang",
    "category": "shinsal_gwiin",
    "key": "goegang",
    "labelKo": "괴강살",
    "aliases": [
      "괴강살",
      "괴강"
    ],
    "definition": {
      "text": "괴강살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_goegang"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: goegang"
      ],
      "legacyRefs": [
        "knowledge:sinsal_goegang",
        "taxonomy:sinsal_goegang"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:yangin",
    "category": "shinsal_gwiin",
    "key": "yangin",
    "labelKo": "양인살",
    "aliases": [
      "양인살",
      "양인",
      "羊刃/陽刃"
    ],
    "definition": {
      "text": "극성한 기운을 칼날에 빗대는 분류다. 음간의 칼날을 인정하는 논법과 양간만 인정하는 자평 논법이 병기된다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論羊刃"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:yangin"
      ],
      "positive": "힘을 쓰는 범위를 점검하는 관점",
      "caution": "폭력·사고·수술 등 사건을 단정할 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "relationships": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "자기 선을 강하게 지킬 상황이라면 거절할 범위와 협의할 범위를 구분할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: yangin"
      ],
      "legacyRefs": [
        "knowledge:sinsal_yangin",
        "taxonomy:sinsal_yangin"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:cheonmun",
    "category": "shinsal_gwiin",
    "key": "cheonmun",
    "labelKo": "천문성",
    "aliases": [
      "천문성",
      "천문"
    ],
    "definition": {
      "text": "천문성는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_cheonmun"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": [
        "knowledge:sinsal_cheonmun",
        "taxonomy:sinsal_cheonmunseong"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:wolsal",
    "category": "shinsal_gwiin",
    "key": "wolsal",
    "labelKo": "월살",
    "aliases": [
      "월살",
      "달살"
    ],
    "definition": {
      "text": "월살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_wolsal"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_WOLSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_wolsal",
        "taxonomy:twelve_sinsal_wolsal",
        "shinsal:TWELVE_WOLSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:jangseong",
    "category": "shinsal_gwiin",
    "key": "jangseong",
    "labelKo": "장성살",
    "aliases": [
      "장성살",
      "장성",
      "將星"
    ],
    "definition": {
      "text": "장수가 중심을 잡는 모습에 빗대며 삼합의 가운데 자리를 사용하는 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論將星華蓋"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:jangseong"
      ],
      "positive": "공동 일의 중심 역할을 점검하는 관점",
      "caution": "리더 직책·승진이 주어진다는 보장은 아니다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "조정 역할을 맡았다면 결정 범위와 동료에게 맡길 일을 구분할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_JANGSEONGSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_jangseong",
        "taxonomy:twelve_sinsal_jangseong",
        "shinsal:TWELVE_JANGSEONGSAL"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:banan",
    "category": "shinsal_gwiin",
    "key": "banan",
    "labelKo": "반안살",
    "aliases": [
      "반안살",
      "반안"
    ],
    "definition": {
      "text": "반안살는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "sinsal_banan"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_BANANSAL"
      ],
      "legacyRefs": [
        "knowledge:sinsal_banan",
        "taxonomy:twelve_sinsal_banan",
        "shinsal:TWELVE_BANANSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:cheoneul",
    "category": "shinsal_gwiin",
    "key": "cheoneul",
    "labelKo": "천을귀인",
    "aliases": [
      "천을귀인",
      "천을",
      "天乙貴人"
    ],
    "definition": {
      "text": "존귀한 신의 상징에 빗대는 보조 신살이며 생왕·충파·공망·다른 근거에 따라 해석 조건을 달리 논한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論天乙貴人"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:cheoneul"
      ],
      "positive": "도움을 받을 통로를 살피는 관점",
      "caution": "도움의 상징이 모든 위험을 막는 보장은 아니다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "relationships": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "막힌 일이 있다면 실제로 물어볼 사람과 질문을 정리할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:CHEON_EUL_GWIIN"
      ],
      "legacyRefs": [
        "knowledge:nobleman_cheoneul",
        "taxonomy:gwiin_cheoneul",
        "shinsal:CHEON_EUL_GWIIN"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:cheondeok",
    "category": "shinsal_gwiin",
    "key": "cheondeok",
    "labelKo": "천덕귀인",
    "aliases": [
      "천덕귀인",
      "천덕",
      "天德"
    ],
    "definition": {
      "text": "월령에 따른 덕의 보조 분류로, 흉을 완화하는 전통 상징이 있다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論天月德"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:cheondeok"
      ],
      "positive": "해를 줄이고 협력할 관점",
      "caution": "불리한 조건을 전부 없애는 보호 장치로 볼 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "relationships": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "갈등을 정리할 때 서로가 줄일 수 있는 부담을 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:CHEON_DEOK_GWIIN"
      ],
      "legacyRefs": [
        "knowledge:nobleman_cheondeok",
        "taxonomy:gwiin_cheondeok",
        "shinsal:CHEON_DEOK_GWIIN"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:woldeok",
    "category": "shinsal_gwiin",
    "key": "woldeok",
    "labelKo": "월덕귀인",
    "aliases": [
      "월덕귀인",
      "월덕",
      "月德"
    ],
    "definition": {
      "text": "월령의 삼합 계열과 관련된 덕의 분류다. 천덕과 산출 축이 다르다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論天月德"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:woldeok"
      ],
      "positive": "관계에서 조정할 여지를 보는 관점",
      "caution": "호의의 상징을 모든 사람이 도와준다는 사실로 바꿀 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "relationships": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "공동 일이 막혔다면 역할 조정이 가능한지 당사자에게 물어볼 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:WOL_DEOK_GWIIN"
      ],
      "legacyRefs": [
        "knowledge:nobleman_woldeok",
        "taxonomy:gwiin_woldeok",
        "shinsal:WOL_DEOK_GWIIN"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:munchang",
    "category": "shinsal_gwiin",
    "key": "munchang",
    "labelKo": "문창귀인",
    "aliases": [
      "문창귀인",
      "문창"
    ],
    "definition": {
      "text": "문창귀인는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "nobleman_munchang"
        }
      ]
    },
    "traditional": [
      {
        "text": "三命通會의 太極貴 절에 실린 文昌貴 배치 구절과 현행 MUN_CHANG_GWIIN 표 사이의 차이를 별도 교감해야 한다. 동일 이름만으로 같은 규칙이라고 확정하지 않는다.",
        "review": "source_checked",
        "sourceRefs": [
          {
            "sourceId": "sm3",
            "locator": "論太極貴 중 文昌貴 구절"
          }
        ],
        "aspect": "difference"
      }
    ],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:MUN_CHANG_GWIIN"
      ],
      "legacyRefs": [
        "knowledge:nobleman_munchang",
        "taxonomy:gwiin_munchang",
        "shinsal:MUN_CHANG_GWIIN"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다.",
      "문창의 전통 배치표와 현재 계산표 사이의 계보·전사 오자 대조. 계산은 변경하지 않는다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:taegeuk",
    "category": "shinsal_gwiin",
    "key": "taegeuk",
    "labelKo": "태극귀인",
    "aliases": [
      "태극귀인",
      "태극",
      "太極貴"
    ],
    "definition": {
      "text": "기운이 시작되고 귀착하는 자리를 짝지어 설명하는 귀의 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論太極貴"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:taegeuk"
      ],
      "positive": "시작과 마무리를 함께 살피는 관점",
      "caution": "신비한 능력이나 종교적 자질을 확정할 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "몰입할 주제를 골랐다면 왜 시작하고 어디서 끝낼지 정리할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TAEGEUK_GWIIN"
      ],
      "legacyRefs": [
        "knowledge:nobleman_taegeuk",
        "taxonomy:gwiin_taegeuk",
        "shinsal:TAEGEUK_GWIIN"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:jaego",
    "category": "shinsal_gwiin",
    "key": "jaego",
    "labelKo": "재고귀인",
    "aliases": [
      "재고귀인",
      "재고",
      "자산 창고",
      "재고귀인 gwiin",
      "재고 도움"
    ],
    "definition": {
      "text": "재고귀인는 기존 knowledge에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "nobleman_jaego"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: jaego"
      ],
      "legacyRefs": [
        "knowledge:nobleman_jaego",
        "knowledge:gwiin_jaego",
        "taxonomy:gwiin_jaego"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:geopsal",
    "category": "shinsal_gwiin",
    "key": "geopsal",
    "labelKo": "겁살",
    "aliases": [
      "겁살",
      "劫煞"
    ],
    "definition": {
      "text": "밖에서 빼앗음에 빗대고 오행의 절처를 사용하는 보조 분류다. 같은 절에서도 다른 근거에 따라 역할이 달라진다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論劫煞亡神"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:geopsal"
      ],
      "positive": "자원 경계를 점검하는 관점",
      "caution": "손실·도난·재앙이 생긴다는 예언으로 쓰지 않는다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "자원을 함께 쓰는 상황이라면 맡긴 범위와 반환 조건을 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_GEOPSAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_geopsal",
        "shinsal:TWELVE_GEOPSAL"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:jaesal",
    "category": "shinsal_gwiin",
    "key": "jaesal",
    "labelKo": "재살",
    "aliases": [
      "재살"
    ],
    "definition": {
      "text": "재살는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "twelve_sinsal_jaesal"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_JAESAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_jaesal",
        "shinsal:TWELVE_JAESAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:jisal",
    "category": "shinsal_gwiin",
    "key": "jisal",
    "labelKo": "지살",
    "aliases": [
      "지살"
    ],
    "definition": {
      "text": "지살는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "twelve_sinsal_jisal"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_JISAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_jisal",
        "shinsal:TWELVE_JISAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:nyeonsal",
    "category": "shinsal_gwiin",
    "key": "nyeonsal",
    "labelKo": "연살",
    "aliases": [
      "연살",
      "년살",
      "年煞"
    ],
    "definition": {
      "text": "현행 십이신살의 한 항목이다. 도화와의 겹침은 계산 축을 따로 보존하며 독립 증거의 중복 투표로 쓰지 않는다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_stars",
          "locator": "SHINSAL_METADATA.TWELVE_NYEONSAL"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_NYEONSAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_nyeonsal",
        "shinsal:TWELVE_NYEONSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:yukhae",
    "category": "shinsal_gwiin",
    "key": "yukhae",
    "labelKo": "육해살",
    "aliases": [
      "육해살",
      "육해"
    ],
    "definition": {
      "text": "육해살는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "twelve_sinsal_yukhae"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_YUKHAESAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_yukhae",
        "shinsal:TWELVE_YUKHAESAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:cheonsal",
    "category": "shinsal_gwiin",
    "key": "cheonsal",
    "labelKo": "천살",
    "aliases": [
      "천살"
    ],
    "definition": {
      "text": "천살는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "twelve_sinsal_cheonsal"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:TWELVE_CHEONSAL"
      ],
      "legacyRefs": [
        "taxonomy:twelve_sinsal_cheonsal",
        "shinsal:TWELVE_CHEONSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:gongmang",
    "category": "shinsal_gwiin",
    "key": "gongmang",
    "labelKo": "공망",
    "aliases": [
      "공망",
      "空亡"
    ],
    "definition": {
      "text": "열 천간으로 한 旬을 배치할 때 대응되지 않는 지지를 이르는 분류다. 공망이라고 곧 흉으로 보지 않는 논의가 있다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論空亡"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:gongmang"
      ],
      "positive": "빈 부분을 확인하는 관점",
      "caution": "삶이 비었다거나 성공하지 못한다는 진단으로 쓰지 않는다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "계획의 불확실한 부분이 있다면 아직 확인되지 않은 조건을 적을 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: gongmang"
      ],
      "legacyRefs": [
        "taxonomy:sinsal_gongmang"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:mungok",
    "category": "shinsal_gwiin",
    "key": "mungok",
    "labelKo": "문곡귀인",
    "aliases": [
      "문곡귀인",
      "문곡"
    ],
    "definition": {
      "text": "문곡귀인는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "gwiin_mungok"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": [
        "taxonomy:gwiin_mungok"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:hakdang",
    "category": "shinsal_gwiin",
    "key": "hakdang",
    "labelKo": "학당귀인",
    "aliases": [
      "학당귀인",
      "학당",
      "學堂"
    ],
    "definition": {
      "text": "배움의 장소에 빗댄 보조 분류로, 납음·장생 등 서로 다른 논법을 병기한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論學堂詞館"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:hakdang"
      ],
      "positive": "배움을 쌓는 관점",
      "caution": "시험 합격·지능·학벌의 보장은 아니다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "study": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "배우는 일이 있다면 자료를 읽는 시간과 직접 연습할 시간을 함께 마련할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:HAK_DANG_GWIIN"
      ],
      "legacyRefs": [
        "taxonomy:gwiin_hakdang",
        "shinsal:HAK_DANG_GWIIN"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:bokseong",
    "category": "shinsal_gwiin",
    "key": "bokseong",
    "labelKo": "복성귀인",
    "aliases": [
      "복성귀인",
      "복성"
    ],
    "definition": {
      "text": "복성귀인는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "gwiin_bokseong"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": [
        "taxonomy:gwiin_bokseong"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:geumyeo",
    "category": "shinsal_gwiin",
    "key": "geumyeo",
    "labelKo": "금여록",
    "aliases": [
      "금여록",
      "금여",
      "金輿"
    ],
    "definition": {
      "text": "귀한 사람이 타는 수레를 비유로 한 보조 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論金輿"
        }
      ]
    },
    "traditional": [],
    "editorial": {
      "review": "editorial_example",
      "basedOn": [
        "foundation:shinsal_gwiin:geumyeo"
      ],
      "positive": "생활을 지탱하는 자원을 살피는 관점",
      "caution": "차량·부유한 배우자·신분을 사실로 예언할 수 없다.",
      "excessOrDeficit": "신살의 개수만으로 힘의 과다·부족과 길흉을 판정하지 않는다.",
      "applications": {
        "career": {
          "when": "실제 생활 상황이 확인된 경우에만 질문·점검의 비유로 사용한다.",
          "example": "도움을 받는 상황이라면 지원의 조건과 본인이 맡을 일을 확인할 수 있다."
        }
      }
    },
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: geumyeo"
      ],
      "legacyRefs": [
        "taxonomy:gwiin_geumyeorok"
      ]
    },
    "deferred": [
      "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:cheoneuiseong",
    "category": "shinsal_gwiin",
    "key": "cheoneuiseong",
    "labelKo": "천의성",
    "aliases": [
      "천의성",
      "천의"
    ],
    "definition": {
      "text": "천의성는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "gwiin_cheoneuiseong"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": [
        "taxonomy:gwiin_cheoneuiseong"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:amrok",
    "category": "shinsal_gwiin",
    "key": "amrok",
    "labelKo": "암록",
    "aliases": [
      "암록"
    ],
    "definition": {
      "text": "암록는 기존 taxonomy에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "gwiin_amrok"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "sajuComputedFeatureExtractor: amrok"
      ],
      "legacyRefs": [
        "taxonomy:gwiin_amrok"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:gosinsal",
    "category": "shinsal_gwiin",
    "key": "gosinsal",
    "labelKo": "고신살",
    "aliases": [
      "고신살"
    ],
    "definition": {
      "text": "고신살는 기존 shinsal에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_stars",
          "locator": "GOSINSAL"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:GOSINSAL"
      ],
      "legacyRefs": [
        "shinsal:GOSINSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:gwasuksal",
    "category": "shinsal_gwiin",
    "key": "gwasuksal",
    "labelKo": "과숙살",
    "aliases": [
      "과숙살"
    ],
    "definition": {
      "text": "과숙살는 기존 shinsal에 존재하는 명리 보조 항목이다. 기존 의미 자료는 해당 레코드에 보존하며 외부 전거는 아직 확인하지 못했다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_stars",
          "locator": "GWASUKSAL"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
      "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
    ],
    "distinctions": [
      "같은 명칭이라도 연지·일지·일간·월령·납음 중 기준 축이 다를 수 있다.",
      "귀인·길성의 명칭과 실제 인물의 도움·행운은 동일 사실이 아니다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SHINSAL_RULES:GWASUKSAL"
      ],
      "legacyRefs": [
        "shinsal:GWASUKSAL"
      ]
    },
    "deferred": [
      "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
      "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:wangshen",
    "category": "shinsal_gwiin",
    "key": "wangshen",
    "labelKo": "망신(亡神)",
    "aliases": [
      "망신(亡神)",
      "亡神"
    ],
    "definition": {
      "text": "밖에서 빼앗는 劫과 구별하여 안에서 잃음에 빗대는 보조 분류다. 현대 십이신살 망신살(亡身煞)과 자동 동일시하지 않는다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論劫煞亡神"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "새 계산·검출 ID로 등록하거나 실제 고객에게 적용하는 용도.",
      "문헌의 시험·관직·수명 서술을 고객의 확정된 사건으로 옮기는 용도."
    ],
    "distinctions": [
      "현재 생성기에 연결하지 않는 신규 원천 항목이다. 동일한 한국어 독음으로 기존 ID를 대체하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 검출 조건·현대 영역별 응용은 추가 검토. 현재 탐지 엔진이 이 항목을 제공한다고 주장하지 않는다."
    ]
  },
  {
    "id": "foundation:shinsal_gwiin:ciguan",
    "category": "shinsal_gwiin",
    "key": "ciguan",
    "labelKo": "사관(詞館)",
    "aliases": [
      "사관(詞館)",
      "詞館"
    ],
    "definition": {
      "text": "문장을 다루는 관청에 빗대며 임관을 사용하는 보조 분류로, 장생의 학당과 구별한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm3",
          "locator": "論學堂詞館"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
    ],
    "doNotApply": [
      "새 계산·검출 ID로 등록하거나 실제 고객에게 적용하는 용도.",
      "문헌의 시험·관직·수명 서술을 고객의 확정된 사건으로 옮기는 용도."
    ],
    "distinctions": [
      "현재 생성기에 연결하지 않는 신규 원천 항목이다. 동일한 한국어 독음으로 기존 ID를 대체하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 검출 조건·현대 영역별 응용은 추가 검토. 현재 탐지 엔진이 이 항목을 제공한다고 주장하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:jaeda_sinyak",
    "category": "structure",
    "key": "jaeda_sinyak",
    "labelKo": "재다신약",
    "aliases": [
      "재다신약"
    ],
    "definition": {
      "text": "일간의 감당 여력에 비해 재성의 부담이 두드러진다고 보는 조건부 구조이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "論正官 중 財多身弱"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간이 약한지와 재성의 역할을 먼저 확인한다. 재성 개수와 실제 부채·부유함은 다르다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:wealthHeavyWeakDaymaster"
      ],
      "legacyRefs": [
        "knowledge:pattern_jaeda_sinyak",
        "taxonomy:structure_jaeda_sinyak",
        "depth:v4_structure:wealthHeavyWeakDaymaster"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:gwansal_honjob",
    "category": "structure",
    "key": "gwansal_honjob",
    "labelKo": "관살혼잡",
    "aliases": [
      "관살혼잡"
    ],
    "definition": {
      "text": "정관과 편관이 함께 나타나는 상태. 서로 섞였다는 사실만으로 흉하게 보지 않는다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "官煞混雜"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "합·제거·제복 및 일간의 여력에 따라 다른 논의가 있으므로 두 십성의 공존과 성패 판정을 구별한다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:mixedOfficers"
      ],
      "legacyRefs": [
        "knowledge:pattern_gwansal_honjob",
        "taxonomy:structure_gwansal_mixed",
        "depth:v4_structure:mixedOfficers"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:siksang_saengjae",
    "category": "structure",
    "key": "siksang_saengjae",
    "labelKo": "식상생재",
    "aliases": [
      "식상생재"
    ],
    "definition": {
      "text": "일간이 생하는 식상에서 일간이 극하는 재성으로 이어지는 오행 상생 관계이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "pattern_siksang_saengjae"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "식상과 재성의 존재·강약·실제 관계를 확인한다. 생산이 자동으로 돈이 된다고 말하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:outputCreatesWealth"
      ],
      "legacyRefs": [
        "knowledge:pattern_siksang_saengjae",
        "taxonomy:structure_siksang_saengjae",
        "depth:v4_structure:outputCreatesWealth"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:jaesaenggwan",
    "category": "structure",
    "key": "jaesaenggwan",
    "labelKo": "재생관",
    "aliases": [
      "재생관"
    ],
    "definition": {
      "text": "일간이 극하는 재성에서 일간을 극하는 관성으로 이어지는 오행 상생 관계이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "論正官 喜財生"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "관성의 쓰임과 일간의 여력을 확인한다. 돈이 승진·권력을 만든다는 사실로 일반화하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:wealthCreatesOfficer"
      ],
      "legacyRefs": [
        "knowledge:pattern_jaesaenggwan",
        "taxonomy:structure_jaesaenggwan",
        "depth:v4_structure:wealthCreatesOfficer"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:salin_sangsaeng",
    "category": "structure",
    "key": "salin_sangsaeng",
    "labelKo": "살인상생",
    "aliases": [
      "살인상생"
    ],
    "definition": {
      "text": "일간을 극하는 편관과 일간을 생하는 인성의 연속 생조를 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "論偏官 印綬化煞"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "편관·인성의 유무만 세지 않고 제화가 가능한 조건을 본다. 압박이 곧 성장이라는 인과로 만들지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:killingResourceFlow"
      ],
      "legacyRefs": [
        "knowledge:pattern_salin_sangsaeng",
        "taxonomy:structure_salin_sangsaeng",
        "depth:v4_structure:killingResourceFlow"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:singang",
    "category": "structure",
    "key": "singang",
    "labelKo": "신강",
    "aliases": [
      "신강"
    ],
    "definition": {
      "text": "현행 일간 강약 분석에서 지원이 상대적으로 강한 쪽으로 분류한 상태이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "analyzeDayMasterStrength"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "일간 강약은 성격의 강단·건강·성공과 동일하지 않으며 개수만으로 확정하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": [
        "knowledge:pattern_singang"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:sinyak",
    "category": "structure",
    "key": "sinyak",
    "labelKo": "신약",
    "aliases": [
      "신약"
    ],
    "definition": {
      "text": "현행 일간 강약 분석에서 지원이 상대적으로 약한 쪽으로 분류한 상태이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "analyzeDayMasterStrength"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "신약을 의지 부족·질병·실패로 번역하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": [
        "knowledge:pattern_sinyak"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:no_resource",
    "category": "structure",
    "key": "no_resource",
    "labelKo": "무인성",
    "aliases": [
      "무인성"
    ],
    "definition": {
      "text": "확인된 원국 범위에서 인성 신호가 없는 상태를 부르는 내부 분류이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "pattern_no_resource"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "시간 미상인 경우 전체 네 기둥의 부재로 확정할 수 없다. 학습 능력이나 부모의 유무를 뜻하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:noResource"
      ],
      "legacyRefs": [
        "knowledge:pattern_no_resource",
        "taxonomy:structure_no_resource",
        "depth:v4_structure:noResource"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:no_output",
    "category": "structure",
    "key": "no_output",
    "labelKo": "무식상",
    "aliases": [
      "무식상"
    ],
    "definition": {
      "text": "확인된 원국 범위에서 식상 신호가 없는 상태를 부르는 내부 분류이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "pattern_no_output"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "시간 미상인 경우 부재 확정을 제한한다. 표현력·자녀의 유무를 뜻하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:noOutput"
      ],
      "legacyRefs": [
        "knowledge:pattern_no_output",
        "taxonomy:structure_no_output",
        "depth:v4_structure:noOutput"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:toda_maegeum",
    "category": "structure",
    "key": "toda_maegeum",
    "labelKo": "토다매금",
    "aliases": [
      "토다매금"
    ],
    "definition": {
      "text": "토가 겹쳐 금의 쓰임을 가리는 상황에 빗댄 조건부 구조이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "天干論 辛; 順反論 土重埋金"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "토의 개수만으로 금이 묻혔다고 확정하지 않는다. 건습·강약·소통 조건이 필요하다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별"
      ],
      "legacyRefs": [
        "knowledge:pattern_toda_maegeum"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:geumda_mokjeol",
    "category": "structure",
    "key": "geumda_mokjeol",
    "labelKo": "금다목절",
    "aliases": [
      "금다목절"
    ],
    "definition": {
      "text": "금의 제어가 목의 여력에 비해 지나칠 수 있다는 기존 내부 구조명이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_knowledge",
          "locator": "pattern_geumda_mokjeol"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "금이 있다는 이유로 목의 성장이 무조건 파괴된다고 보지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별"
      ],
      "legacyRefs": [
        "knowledge:pattern_geumda_mokjeol"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:mokda_hwasik",
    "category": "structure",
    "key": "mokda_hwasik",
    "labelKo": "목다화식",
    "aliases": [
      "목다화식"
    ],
    "definition": {
      "text": "목의 공급이 지나쳐 화의 쓰임이 흐려지는 상황을 살피는 내부 구조명이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "順反論 木旺火晦·木太旺"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "목생화의 단순 합산과 다르다. 실제 강약과 화의 상태를 함께 확인한다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별"
      ],
      "legacyRefs": [
        "knowledge:pattern_mokda_hwasik"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:suda_mokbu",
    "category": "structure",
    "key": "suda_mokbu",
    "labelKo": "수다목부",
    "aliases": [
      "수다목부"
    ],
    "definition": {
      "text": "물이 넘쳐 목이 뜨는 상황에 빗댄 조건부 구조이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "天干論 甲; 順反論 水泛木浮"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "수생목이라고 공급이 많을수록 항상 좋다는 결론을 내리지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별"
      ],
      "legacyRefs": [
        "knowledge:pattern_suda_mokbu"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:sanggwan_gyeongwan",
    "category": "structure",
    "key": "sanggwan_gyeongwan",
    "labelKo": "상관견관",
    "aliases": [
      "상관견관"
    ],
    "definition": {
      "text": "상관의 제어가 정관에 닿는 조건을 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm5",
          "locator": "卷首 官怕傷; 論正官"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "상관과 정관이 같이 있다는 것과 실제로 정관의 쓰임이 훼손되는 것은 구별한다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:hurtingOfficerMeetsOfficer"
      ],
      "legacyRefs": [
        "taxonomy:structure_sanggwan_gyeongwan",
        "depth:v4_structure:hurtingOfficerMeetsOfficer"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:bigeop_many",
    "category": "structure",
    "key": "bigeop_many",
    "labelKo": "비겁다자",
    "aliases": [
      "비겁다자"
    ],
    "definition": {
      "text": "비견·겁재의 비중이 두드러지는 내부 분류이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "structure_bigeop_many"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "비겁의 도움과 재성 분담의 조건을 구분한다. 실제 친구 수·경쟁·손해를 확정하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:peerHeavy"
      ],
      "legacyRefs": [
        "taxonomy:structure_bigeop_many",
        "depth:v4_structure:peerHeavy"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:resource_many",
    "category": "structure",
    "key": "resource_many",
    "labelKo": "인성다자",
    "aliases": [
      "인성다자"
    ],
    "definition": {
      "text": "정인·편인의 비중이 두드러지는 내부 분류이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_taxonomy",
          "locator": "structure_resource_many"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "인성의 지원과 발산을 막는 조건을 구분한다. 학력·지능·게으름을 확정하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:resourceHeavy"
      ],
      "legacyRefs": [
        "taxonomy:structure_resource_many",
        "depth:v4_structure:resourceHeavy"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:officer_resource",
    "category": "structure",
    "key": "officer_resource",
    "labelKo": "관인상생",
    "aliases": [
      "관인상생"
    ],
    "definition": {
      "text": "정관에서 인성으로 이어져 일간을 생조하는 관계를 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "清濁論 正官 身弱有印"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "관·인성의 역할과 일간의 필요를 확인한다. 조직 적응·승진을 보장하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts / V4 structureRules 후보; 원생 결과와 구별",
        "STRUCTURE_RULES:officerResourceFlow"
      ],
      "legacyRefs": [
        "depth:v4_structure:officerResourceFlow"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:output_heavy",
    "category": "structure",
    "key": "output_heavy",
    "labelKo": "식상 강함",
    "aliases": [
      "식상 강함"
    ],
    "definition": {
      "text": "현행 구조 분석의 식상 비중이 높은 조건이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns OUTPUT_HEAVY"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "발산의 비중을 나타내며 말수·생산량·자녀 수의 관측값이 아니다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:outputHeavy"
      ],
      "legacyRefs": [
        "depth:v4_structure:outputHeavy"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:wealth_heavy",
    "category": "structure",
    "key": "wealth_heavy",
    "labelKo": "재성 강함",
    "aliases": [
      "재성 강함"
    ],
    "definition": {
      "text": "현행 구조 분석의 재성 비중이 높은 조건이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns WEALTH_HEAVY"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "강한 재성과 재다신약은 같은 분류가 아니다. 일간의 여력 확인이 필요하다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:wealthHeavy"
      ],
      "legacyRefs": [
        "depth:v4_structure:wealthHeavy"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:officer_heavy",
    "category": "structure",
    "key": "officer_heavy",
    "labelKo": "관성 강함",
    "aliases": [
      "관성 강함"
    ],
    "definition": {
      "text": "현행 구조 분석의 관성 비중이 높은 조건이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns OFFICER_HEAVY"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "관성의 비중과 실제 직책·권한은 다르다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis",
        "STRUCTURE_RULES:officerHeavy"
      ],
      "legacyRefs": [
        "depth:v4_structure:officerHeavy"
      ]
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:weak_output",
    "category": "structure",
    "key": "weak_output",
    "labelKo": "식상 과다형 신약 후보",
    "aliases": [
      "식상 과다형 신약 후보"
    ],
    "definition": {
      "text": "일간이 약하다고 분석되고 식상 발산이 두드러지는 현행 후보이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns WEAK_DAYMASTER_WITH_STRONG_OUTPUT"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "건강이나 실제 피로를 입력 없이 확정하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:weak_officer",
    "category": "structure",
    "key": "weak_officer",
    "labelKo": "관성 압박형 신약 후보",
    "aliases": [
      "관성 압박형 신약 후보"
    ],
    "definition": {
      "text": "일간이 약하다고 분석되고 관성 부담이 두드러지는 현행 후보이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns WEAK_DAYMASTER_WITH_STRONG_OFFICER"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "실제 직장 스트레스나 사건이 발생했다는 뜻이 아니다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:fire_metal",
    "category": "structure",
    "key": "fire_metal",
    "labelKo": "화금 긴장 구조",
    "aliases": [
      "화금 긴장 구조"
    ],
    "definition": {
      "text": "화와 금의 강함 표시가 함께 있는 현행 휴리스틱 후보이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns FIRE_METAL_TENSION"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "정식 격국명이나 전통의 金火相成과 자동 동일시하지 않는다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:water_weak",
    "category": "structure",
    "key": "water_weak",
    "labelKo": "수 기운 보완 필요",
    "aliases": [
      "수 기운 보완 필요"
    ],
    "definition": {
      "text": "수의 약함 또는 결핍 표시에서 생성되는 현행 내부 후보이다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_structure",
          "locator": "detectStructurePatterns WATER_WEAK_RECOVERY_NEEDED"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 탐지 결과가 제공되고 원국·월령·강약 및 관련 십성의 출처가 확인된 경우."
    ],
    "doNotApply": [
      "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
      "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
    ],
    "distinctions": [
      "실제 회복 능력·휴식 부족·건강 이상을 측정한 값이 아니다.",
      "기존 탐지 기준을 전통 격국의 완전한 성립 판정으로 승격하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.structureAnalysis"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "격국의 성립·파격·용신까지 검증하는 전통 판본 대조는 보류.",
      "8개 생활 영역의 독립적인 결과 예측은 이 구조 이름만으로 작성하지 않는다."
    ]
  },
  {
    "id": "foundation:structure:season_command",
    "category": "structure",
    "key": "season_command",
    "labelKo": "월령",
    "aliases": [
      "월령"
    ],
    "definition": {
      "text": "태어난 달의 지지가 나타내는 계절의 힘을 중요한 해석 조건으로 보는 관점이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "月令論"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "문헌의 조건을 검토할 수 있는 원국 자료가 있는 경우의 연구에 한정."
    ],
    "doNotApply": [
      "오행을 건강·날씨·투자·혼인의 확정 결과로 변환하는 용도.",
      "기존 강약 계산·용신 계산을 이 설명으로 대체하는 용도."
    ],
    "distinctions": [
      "월령의 계절 조건과 월지의 고정 지장간 집합은 같은 정보가 아니다.",
      "새 원천 항목이며 생성기에 연결하거나 점수·가중치로 사용하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 정의·성립 조건의 추가 대조 및 생활 적용의 독립 검토."
    ]
  },
  {
    "id": "foundation:structure:support_restraint",
    "category": "structure",
    "key": "support_restraint",
    "labelKo": "부억",
    "aliases": [
      "부억"
    ],
    "definition": {
      "text": "약한 것을 돕고 강한 것을 덜어내는 원칙을 쓰되 전체 기세에 따라 예외를 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "體用論·衰旺論·眾寡論"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "문헌의 조건을 검토할 수 있는 원국 자료가 있는 경우의 연구에 한정."
    ],
    "doNotApply": [
      "오행을 건강·날씨·투자·혼인의 확정 결과로 변환하는 용도.",
      "기존 강약 계산·용신 계산을 이 설명으로 대체하는 용도."
    ],
    "distinctions": [
      "단순히 부족한 오행을 더하면 유리하다는 규칙이 아니다.",
      "새 원천 항목이며 생성기에 연결하거나 점수·가중치로 사용하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 정의·성립 조건의 추가 대조 및 생활 적용의 독립 검토."
    ]
  },
  {
    "id": "foundation:structure:temperature",
    "category": "structure",
    "key": "temperature",
    "labelKo": "한난",
    "aliases": [
      "한난"
    ],
    "definition": {
      "text": "원국의 차고 따뜻한 조건이 오행의 작용에 미치는 차이를 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "寒暖論"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "문헌의 조건을 검토할 수 있는 원국 자료가 있는 경우의 연구에 한정."
    ],
    "doNotApply": [
      "오행을 건강·날씨·투자·혼인의 확정 결과로 변환하는 용도.",
      "기존 강약 계산·용신 계산을 이 설명으로 대체하는 용도."
    ],
    "distinctions": [
      "계절의 한난과 사람의 체온·질병·거주 지역의 실제 날씨는 다르다.",
      "새 원천 항목이며 생성기에 연결하거나 점수·가중치로 사용하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 정의·성립 조건의 추가 대조 및 생활 적용의 독립 검토."
    ]
  },
  {
    "id": "foundation:structure:moisture",
    "category": "structure",
    "key": "moisture",
    "labelKo": "조습",
    "aliases": [
      "조습"
    ],
    "definition": {
      "text": "원국의 건조함과 습함이 오행의 쓰임에 미치는 조건을 살피는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "燥濕論"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "문헌의 조건을 검토할 수 있는 원국 자료가 있는 경우의 연구에 한정."
    ],
    "doNotApply": [
      "오행을 건강·날씨·투자·혼인의 확정 결과로 변환하는 용도.",
      "기존 강약 계산·용신 계산을 이 설명으로 대체하는 용도."
    ],
    "distinctions": [
      "사주의 물상과 실제 피부·장기·건강 상태를 혼동하지 않는다.",
      "새 원천 항목이며 생성기에 연결하거나 점수·가중치로 사용하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 정의·성립 조건의 추가 대조 및 생활 적용의 독립 검토."
    ]
  },
  {
    "id": "foundation:structure:mediation",
    "category": "structure",
    "key": "mediation",
    "labelKo": "통관",
    "aliases": [
      "통관"
    ],
    "definition": {
      "text": "서로 제어하는 두 기운 사이에 생조의 연결을 살피고 그 연결의 방해 조건도 함께 보는 논법이다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "dt",
          "locator": "通隔論"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "문헌의 조건을 검토할 수 있는 원국 자료가 있는 경우의 연구에 한정."
    ],
    "doNotApply": [
      "오행을 건강·날씨·투자·혼인의 확정 결과로 변환하는 용도.",
      "기존 강약 계산·용신 계산을 이 설명으로 대체하는 용도."
    ],
    "distinctions": [
      "연결 오행의 존재만으로 통관 성립·성공을 확정하지 않는다. 현재 새 탐지 규칙을 만들지 않는다.",
      "새 원천 항목이며 생성기에 연결하거나 점수·가중치로 사용하지 않는다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "계보별 정의·성립 조건의 추가 대조 및 생활 적용의 독립 검토."
    ]
  },
  {
    "id": "foundation:relation:stem_hap",
    "category": "relation",
    "key": "stem_hap",
    "labelKo": "천간합",
    "aliases": [
      "천간합"
    ],
    "definition": {
      "text": "두 천간의 배합을 논하는 분류. 합의 존재와 합화 성립은 구분한다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論十干合·論化氣"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "합화는 계절·기세·방해 조건의 별도 논의이며 현재 합 검출 자체가 합화 판정은 아니다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.relations.stemCombinations"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:yukhap",
    "category": "relation",
    "key": "yukhap",
    "labelKo": "지지 육합",
    "aliases": [
      "지지 육합"
    ],
    "definition": {
      "text": "서로 짝을 이루는 여섯 지지 조합을 음양 배합으로 설명하는 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元六合"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "맞물림의 상징이 협력·결혼 성공의 보장은 아니다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.relations.branchCombinations"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:chung",
    "category": "relation",
    "key": "chung",
    "labelKo": "지지 충",
    "aliases": [
      "지지 충"
    ],
    "definition": {
      "text": "마주 놓인 지지의 상충을 논하는 관계 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論衝擊"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "충의 대상·자리·힘을 살펴야 하며 사고·이별·불행을 확정하지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "native",
      "calculationRefs": [
        "SajuCalcResult.relations.branchClashes"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:samhap",
    "category": "relation",
    "key": "samhap",
    "labelKo": "지지 삼합",
    "aliases": [
      "지지 삼합"
    ],
    "definition": {
      "text": "생·왕·저장에 해당하는 세 지지의 모임을 논하는 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論支元三合"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "해당 문헌은 셋 중 하나가 빠진 상태를 완전한 삼합 화국과 구별한다. 반합을 완전 화국으로 바꾸지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:hyeong",
    "category": "relation",
    "key": "hyeong",
    "labelKo": "지지 형",
    "aliases": [
      "지지 형"
    ],
    "definition": {
      "text": "지지 사이의 형 관계를 논하는 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論三刑"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "법적 처벌·수술·자해 등의 실제 사건을 뜻한다고 단정하지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:hae",
    "category": "relation",
    "key": "hae",
    "labelKo": "지지 해",
    "aliases": [
      "지지 해"
    ],
    "definition": {
      "text": "지지의 육해 관계를 논하는 분류다.",
      "review": "source_checked",
      "sourceRefs": [
        {
          "sourceId": "sm2",
          "locator": "論六害"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "해의 존재를 타인의 적의·배신·건강 피해의 사실로 만들지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:banhap",
    "category": "relation",
    "key": "banhap",
    "labelKo": "지지 반합",
    "aliases": [
      "지지 반합"
    ],
    "definition": {
      "text": "기존 관계 의미 레지스트리에 있는 부분 결속 분류다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_relation",
          "locator": "RELATION_SEMANTICS.BANHAP"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "전통별 성립 조건 대조 전 삼합 화국의 효과를 축소 복제하지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:pa",
    "category": "relation",
    "key": "pa",
    "labelKo": "지지 파",
    "aliases": [
      "지지 파"
    ],
    "definition": {
      "text": "기존 관계 의미 레지스트리에 있는 파 관계 분류다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_relation",
          "locator": "RELATION_SEMANTICS.PA"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "기존 현대적 문장을 전통 정의로 승격하지 않는다. 출처 대조 전 독립 의미 확장을 보류한다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "knowledge_only",
      "calculationRefs": [],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  },
  {
    "id": "foundation:relation:wonjin",
    "category": "relation",
    "key": "wonjin",
    "labelKo": "원진 관계",
    "aliases": [
      "원진 관계"
    ],
    "definition": {
      "text": "기존 관계 의미 레지스트리에 있는 원진 분류다.",
      "review": "repository_only",
      "sourceRefs": [
        {
          "sourceId": "repo_relation",
          "locator": "RELATION_SEMANTICS.WONJIN"
        }
      ]
    },
    "traditional": [],
    "editorial": null,
    "appliesWhen": [
      "기존 엔진이 해당 관계와 참여 기둥·출처를 실제로 제공하는 경우 또는 문헌 연구."
    ],
    "doNotApply": [
      "새 관계를 계산하거나 기존 근거 ID·가중치를 생성하는 용도.",
      "관계 이름 하나로 성공·재물·결혼·불행을 단정하는 용도."
    ],
    "distinctions": [
      "원진살 지식 항목과 같은 이름이므로 별도의 독립 증거처럼 중복 계산하지 않는다.",
      "원국끼리·두 사람 사이·원국과 대운/세운의 관계는 참여 요소와 기간을 구분해야 한다."
    ],
    "relatedIds": [],
    "support": {
      "calculation": "projection",
      "calculationRefs": [
        "기존 computed facts 진단 경로; 원생 relations와 구별"
      ],
      "legacyRefs": []
    },
    "deferred": [
      "세부 조합·계보·합화 조건과 현대 생활 예시는 후속 원천 연구.",
      "knowledge_only는 원생 원국 결과 미지원이라는 뜻이며 궁합·시간 흐름의 다른 생산자 지원을 부정하지 않는다."
    ]
  }
];
