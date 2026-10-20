import type { RelationApplication } from "./relationResearchTypes";

/** Independent offline research. Not a runtime rule or approved customer claim. */
export const RELATION_APPLICATIONS_HAE = [
  {
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "id": "rr:application:hae:personality",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "personality",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "기대했던 연결이 막힐 때 숨은 조건을 확인하는가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 성격은 원인 추정 방식, 직업은 절차 간 의존성을 본다.",
    "positive": "직접 대립이 아닌 중간 조건을 살피면 불편의 원인을 세분할 수 있다.",
    "risk": "막힌 일을 타인의 악의로 단정하는 경우.",
    "excess": "모든 상황에서 보이지 않는 방해자를 찾는 상황.",
    "unexpected": "기대를 바꾸는 것이 상대를 바꾸는 것보다 현실적일 수 있다.",
    "conditionalScene": "협의가 지연되면 상대 의도보다 일정·승인 조건을 먼저 묻는다.",
    "judgment": "확인된 제약과 추정한 의도의 구별.",
    "additionalEvidence": "실제 상황·관련자 설명·중간 절차.",
    "doNotApply": "해를 의심 많은 성격이나 해코지의 증거로 쓰지 않는다.",
    "contrast": "성격은 원인 추정 방식, 직업은 절차 간 의존성을 본다.",
    "secondLens": {
      "question": "내 기대가 상대에게 전달됐는가?",
      "conditionalAction": "말하지 않은 기대를 실제 요청으로 바꿔 확인한다.",
      "limitation": "고전의 매개 지지가 원국에 실제 있다고 가정하지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:career",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "career",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "협업을 막는 중간 절차나 의존 과업이 무엇인가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 직업은 과업 의존성, 연애는 전달되지 않은 기대를 본다.",
    "positive": "승인·자료·일정의 의존성을 확인해 실제 병목을 찾을 수 있다.",
    "risk": "지연을 동료의 방해로 읽고 관계를 손상하는 경우.",
    "excess": "모든 협업에 감시 절차를 늘리는 상황.",
    "unexpected": "한 절차의 순서를 바꾸면 대립 없이 해결될 수 있다.",
    "conditionalScene": "다른 부서의 자료가 늦으면 그 부서의 선행 과업을 확인한다.",
    "judgment": "의존 작업의 완료 조건과 담당.",
    "additionalEvidence": "실제 일정·권한·업무 흐름.",
    "doNotApply": "해로 방해자·실직·직장 내 음모를 예언하지 않는다.",
    "contrast": "직업은 과업 의존성, 연애는 전달되지 않은 기대를 본다.",
    "secondLens": {
      "question": "필요한 정보를 같은 시점에 받았는가?",
      "conditionalAction": "공유 자료의 전달 시점과 변경 내역을 대조한다.",
      "limitation": "합이 충에 방해받는 전통 설명을 실제 조직 원인으로 단정하지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:money",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "money",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "기대한 입금과 실제 사용 가능한 돈 사이에 어떤 조건이 있는가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 재물은 지급 조건, 가족은 지원 기대의 전달을 본다.",
    "positive": "정산·수수료·지급 조건을 확인하면 현금 흐름의 착오를 줄일 수 있다.",
    "risk": "지연을 사기나 손실로 미리 단정하는 경우.",
    "excess": "불확실성을 없애려 불필요한 보증이나 수수료를 추가하는 상황.",
    "unexpected": "기대 시점을 늦추는 것이 급한 차입보다 나을 수 있다.",
    "conditionalScene": "정산 예정일과 실제 출금 가능일이 다른지 확인한다.",
    "judgment": "계약상 지급 조건과 실제 잔액.",
    "additionalEvidence": "계약·정산 주기·비용·전문 자문.",
    "doNotApply": "해로 사기·재물 손실·채무를 예언하지 않는다.",
    "contrast": "재물은 지급 조건, 가족은 지원 기대의 전달을 본다.",
    "secondLens": {
      "question": "한 수입의 지연이 다른 의무를 막는가?",
      "conditionalAction": "납부 일정과 비상 자금을 따로 확인한다.",
      "limitation": "해의 전통적 이름을 신용 평가로 쓰지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:study",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "study",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "이해하려는 과목에 필요한 선수 지식이 빠져 있지 않은가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 학업은 선수 조건, 직업은 업무 의존 관계를 본다.",
    "positive": "현재 과제의 선행 조건을 확인하면 막힘을 구체화할 수 있다.",
    "risk": "진도 지연을 능력 부족이나 나쁜 운으로 여기는 경우.",
    "excess": "모든 기초를 다시 하느라 실제 목표를 잃는 상황.",
    "unexpected": "부족한 한 개념만 보완해도 다음 단계가 열릴 수 있다.",
    "conditionalScene": "새 단원이 막히면 필요한 이전 개념을 짧은 과제로 확인한다.",
    "judgment": "선수 개념 확인 후 해결되는 문제.",
    "additionalEvidence": "과목 구조·실제 풀이·피드백.",
    "doNotApply": "해로 학습 능력·합격·집중력 문제를 진단하지 않는다.",
    "contrast": "학업은 선수 조건, 직업은 업무 의존 관계를 본다.",
    "secondLens": {
      "question": "자료 부족과 이해 부족을 구별했는가?",
      "conditionalAction": "다른 설명 자료로 같은 과제를 확인한다.",
      "limitation": "관계 기호가 선수 지식을 특정해 주지는 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:love",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "love",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "서로 말하지 않은 기대가 관계를 어렵게 하는가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 연애는 기대의 전달, 충 응용은 드러난 요구의 대립을 본다.",
    "positive": "실제 기대를 확인하면 서운함과 의도적 거절을 구별할 수 있다.",
    "risk": "상대의 반응을 악의·숨김·배신으로 읽는 경우.",
    "excess": "모든 말을 재해석해 숨은 뜻을 찾는 상황.",
    "unexpected": "뜻을 해석하기보다 직접 묻는 것이 도움이 될 수 있다.",
    "conditionalScene": "약속 뒤 서운했다면 기대한 행동과 합의한 행동을 나눠 말한다.",
    "judgment": "당사자 설명·동의·반복 행동.",
    "additionalEvidence": "관계 상태·실제 대화·안전.",
    "doNotApply": "해를 외도·이별·기만의 징조로 쓰지 않는다.",
    "contrast": "연애는 기대의 전달, 충 응용은 드러난 요구의 대립을 본다.",
    "secondLens": {
      "question": "제삼자의 말이 당사자의 설명을 대신하는가?",
      "conditionalAction": "전달된 이야기와 본인이 확인한 사실을 구별한다.",
      "limitation": "전통 매개 구조를 제삼자의 실재나 개입으로 번역하지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:marriage",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "marriage",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "공동 생활에서 당연하다고 여긴 기대를 서로 아는가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 결혼은 장기 기대의 명시, 재물은 지급 조건 확인을 본다.",
    "positive": "공유되지 않은 분담·지원 기대를 명시할 수 있다.",
    "risk": "불이행을 곧 배우자의 적대감으로 해석하는 경우.",
    "excess": "모든 생활을 의심과 확인 요구로 운영하는 상황.",
    "unexpected": "기대 자체를 낮추거나 외부 도움을 쓰는 길도 있다.",
    "conditionalScene": "가족 행사를 준비할 때 누가 무엇을 할 것으로 예상했는지 확인한다.",
    "judgment": "실제 합의와 실행 가능 시간.",
    "additionalEvidence": "생활 기록·근무·돌봄 조건.",
    "doNotApply": "해로 혼인 실패·양가 갈등·질병을 예언하지 않는다.",
    "contrast": "결혼은 장기 기대의 명시, 재물은 지급 조건 확인을 본다.",
    "secondLens": {
      "question": "한쪽의 지원자가 다른 쪽의 부담을 늘리는가?",
      "conditionalAction": "도움을 받는 조건과 추가 의무를 함께 확인한다.",
      "limitation": "합과 충의 전통 도식을 실제 양가 관계로 고정하지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:family",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "family",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "도움을 주는 뜻과 받는 사람이 필요한 것이 같은가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 가족은 지원의 적합성, 인간관계는 전달 과정의 정확성을 본다.",
    "positive": "지원 방식을 확인하면 선의가 부담이 되는 상황을 구별할 수 있다.",
    "risk": "기대에 못 미친 지원을 사랑 부족으로 읽는 경우.",
    "excess": "가족의 모든 선택을 보호라는 명분으로 통제하는 상황.",
    "unexpected": "도움을 줄이는 것이 자율성을 보존할 때도 있다.",
    "conditionalScene": "부모·자녀를 돕기 전 원하는 지원과 원하지 않는 개입을 묻는다.",
    "judgment": "당사자 동의와 실제 필요의 충족.",
    "additionalEvidence": "가족 구성·요청·경제와 돌봄 상황.",
    "doNotApply": "해로 가족의 해코지·자녀 피해를 단정하지 않는다.",
    "contrast": "가족은 지원의 적합성, 인간관계는 전달 과정의 정확성을 본다.",
    "secondLens": {
      "question": "가족 간 전달자가 요청을 바꾸지는 않았는가?",
      "conditionalAction": "가능하면 요청 당사자의 뜻을 직접 확인한다.",
      "limitation": "존재하지 않는 지지나 가족 역할을 매개자로 채우지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
    "id": "rr:application:hae:relationships",
    "targetId": "foundation:relation:hae",
    "relation": "hae",
    "domain": "relationships",
    "class": "D_MODERN_APPLICATION",
    "structuralMeaningRef": "rr:profile:hae#inference",
    "formationRef": "rr:profile:hae#formation",
    "readerQuestion": "전달 과정에서 기대와 정보가 달라진 지점은 어디인가?",
    "core": "충처럼 직접 대향하는 관계가 아니라 결속과 대립이 엇갈리는 방해 설명이다. 관계도와 실제 의도는 별개다. 이 분야의 검토 초점: 인간관계는 정보 전달, 육합 응용은 두 자리의 접점을 본다.",
    "positive": "공지·전언·역할 기대를 확인하면 불필요한 오해를 줄일 수 있다.",
    "risk": "소외감을 누군가의 의도적 배제로 단정하는 경우.",
    "excess": "모임의 모든 전달을 의심해 소통 비용을 늘리는 상황.",
    "unexpected": "한 번의 공개 확인이 추측을 반복하는 것보다 낫다.",
    "conditionalScene": "모임 일정이 다르게 전달됐다면 원래 공지와 변경 내역을 확인한다.",
    "judgment": "확인 가능한 정보와 당사자의 설명.",
    "additionalEvidence": "실제 공지·연락 경로·접근 권한.",
    "doNotApply": "해를 소인·배신·숨은 적의 근거로 쓰지 않는다.",
    "contrast": "인간관계는 정보 전달, 육합 응용은 두 자리의 접점을 본다.",
    "secondLens": {
      "question": "누가 어떤 정보를 받을 권한이 있었는가?",
      "conditionalAction": "정보 접근 문제와 관계 감정을 분리한다.",
      "limitation": "모든 지연을 관계의 흉함으로 묶지 않는다."
    },
    "sourceRefs": [
      {
        "sourceId": "authored",
        "locator": "실제 해당 분야의 상황이 있을 때만 검토하는 현대 응용; 고전의 직접 분야별 예언 아님"
      }
    ],
    "scopeRefs": [
      "natal",
      "cross_person",
      "natal_major",
      "natal_annual",
      "natal_month",
      "between_periods"
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
] as const satisfies readonly RelationApplication[];
