/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH04_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH04.P1:single-interest",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "솔로 상태에서 호감은 만남을 늘리는 의무보다 자신의 관심을 알아보는 질문이 된다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "신규 만남이 있다면 본인이 반가운 대화와 활동을 살핀다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "유형 자료의 열정은 현재 연애 상대의 존재를 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "작은 제안 뒤 실제 답을 기다리는 조건을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "만남을 선택하지 않아도 자기 관심을 이해할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "dfc34b2596abcc59968f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "single"
    ],
    "positive": "좋아하는 방식을 부담 없이 탐색",
    "risk": "솔로를 해결해야 할 결함으로 보기",
    "factBomb": "아직 관계가 없다는 사실이 사랑할 능력의 점수는 아니다.",
    "twist": "새 만남 없이도 내 선택의 기준을 정리할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 모임에서 한 사람과 대화가 이어지면 다음 대화를 제안한다."
      }
    ],
    "repairAction": "만남 여부와 별도로 편했던 장면을 한 가지 적는다.",
    "counterexample": "새 만남을 원하지 않는 현재 선택이라면 만남 제안은 적용 대상이 아니다.",
    "applicationLimit": "실제 상대·연애 경험·외로움을 보충하지 않는다.",
    "distinctFromOtherParagraphs": "솔로의 자기 이해와 선택 가능한 제안",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대·연애 경험·외로움을 보충하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P1:some-observed",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "썸에서는 관찰한 반응과 관계에 붙인 해석을 나눠 관심을 읽는다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "다정한 답이나 다음 약속은 관찰 가능한 단서다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "한 번의 반응을 상대의 확정된 사랑으로 바꾸지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "확인 질문은 상대가 답할 때를 고를 수 있게 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "서로 알아가는 동안 관계의 이름을 급히 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "8a6e798d5bb288c958fa"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "some"
    ],
    "positive": "추측의 부담을 줄일 질문",
    "risk": "답장의 길이로 관계 전체를 평가",
    "factBomb": "다정했던 하루가 관계의 이름을 대신 정해주지는 않는다.",
    "twist": "모르는 부분을 남기는 것이 솔직한 관심일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 반가웠던 만남 뒤 다시 만날 의사를 짧게 묻는다."
      }
    ],
    "repairAction": "관찰한 반응·내 추측·확인할 질문을 나눈다.",
    "counterexample": "상대가 관계 의사를 명확히 말한 경우에는 그 답을 두고 계속 추측을 만드는 단계가 아니다.",
    "applicationLimit": "상대가 이미 좋아한다거나 밀고 당긴다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "썸의 불확실성은 개인 성향이 아닌 현재 맥락",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대가 이미 좋아한다거나 밀고 당긴다고 단정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P1:dating-current-interest",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "연애 중에는 처음의 방식이 지금도 반가운지 확인하는 관심을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "익숙한 애정 표현도 현재의 필요와 다를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "본인의 devoted_partner는 제공하고 싶은 돌봄의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "받는 방식은 연인에게 실제로 물어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "관심을 새로 묻는 일이 애정이 식었다는 판정은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "1004e6a907ac24e91902"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "dating"
    ],
    "positive": "익숙함 속의 현재 마음을 알아갈 가능성",
    "risk": "과거에 좋아했으니 계속 좋아한다고 보기",
    "factBomb": "오래 만났다는 사실이 오늘의 답을 대신하지는 않는다.",
    "twist": "새 이벤트보다 기존 표현을 고치는 것이 필요할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 평소 안부 연락이 요즘도 편한지 묻는다."
      }
    ],
    "repairAction": "반가웠던 표현과 바꿨으면 하는 표현을 하나씩 듣는다.",
    "counterexample": "현재 표현이 편하다는 실제 답이 있다면 변화를 위한 변화를 요구할 필요는 없다.",
    "applicationLimit": "실제 교제 기간이나 현재 갈등을 만들지 않는다.",
    "distinctFromOtherParagraphs": "연애 중의 현재 수신을 확인하는 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 교제 기간이나 현재 갈등을 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P1:preparing-affection-not-task",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "결혼 준비의 결정과 서로에게 관심을 보이는 대화를 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "예식과 생활 계획의 과제는 실제 준비 맥락이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "future_planning_partner는 본인의 계획 성향 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "준비가 잘돼도 마음을 들을 시간은 별도로 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "업무 목록을 잘 처리한 것을 애정의 완전한 증거로 보지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "793ccb7ecbcc8f1751b7"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "marriage_preparing"
    ],
    "positive": "결정 속에서도 서로의 마음을 놓치지 않을 가능성",
    "risk": "모든 만남을 준비 진행 점검으로 만들기",
    "factBomb": "일정을 많이 끝냈다고 서로를 많이 들은 것은 아니다.",
    "twist": "결정을 하지 않는 대화가 준비의 부담을 알아볼 자리가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 준비 이야기 뒤 오늘 힘들었던 부분을 별도로 묻는다."
      }
    ],
    "repairAction": "결정 대화와 관심 대화의 시간을 구분한다.",
    "counterexample": "함께 준비 이야기를 하는 시간이 실제로 반갑다는 답이 있다면 그 대화를 무조건 과제로 분리할 필요는 없다.",
    "applicationLimit": "실제 예식 일정이나 가족 갈등을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "준비 중의 애정 질문을 공동생활 운영과 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 예식 일정이나 가족 갈등을 생성하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P1:married-person-interest",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "기혼 상태에서도 생활 역할과 그 사람 자체에 대한 관심을 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "shared_attention_security는 inferred 자료이며 현재 감정의 증거는 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "생활 과제 외에 요즘 관심을 묻는 통로를 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "배우자의 답은 본인의 MBTI로 채우지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "새로운 상대를 찾는 초기 연애 장면을 적용하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "6689bf3aa131cde10ea0"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "married"
    ],
    "positive": "공동생활 속에 개인의 새 관심을 들을 가능성",
    "risk": "집안일 보고만 남고 사적 이야기를 생략",
    "factBomb": "함께 산다는 사실이 오늘 서로를 알아봤다는 뜻은 아니다.",
    "twist": "평범한 질문도 익숙한 사람을 새로 만나는 통로가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 저녁에 할 일 외에 최근 재미있었던 것을 묻는다."
      }
    ],
    "repairAction": "역할 대화와 개인 관심 질문을 하나씩 나눈다.",
    "counterexample": "혼인 상태만 있고 실제 생활 형태가 다르면 함께하는 저녁 장면은 적용되지 않을 수 있다.",
    "applicationLimit": "실제 동거 형태·혼인 기간·자녀 유무를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "기혼의 관심 갱신은 새 연애 시작과 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 동거 형태·혼인 기간·자녀 유무를 추정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P1:unknown-open-context",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "호감이 생겼을 때의 나",
    "researchKind": "input_context",
    "coreMeaning": "상태 미입력에서는 관계 단계를 정하지 않고 마음을 보이는 조건만 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "상태에 맞는 관심",
        "knowledge": "현재 연인이나 결혼 준비를 전제로 둘 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "관심이 생기거나 가까운 사람과 이야기하는 경우로 범위를 연다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "만남과 대화",
        "knowledge": "표현의 크기와 답할 시간을 함께 생각할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "매력의 조건",
        "knowledge": "무응답을 솔로나 이별 상태로 변환하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "ed0c5d1ef8da661c9fde"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      ""
    ],
    "positive": "입력 없이도 자기표현 질문을 고를 가능성",
    "risk": "일반 조언에 현재 연인이라는 주어를 끼워 넣기",
    "factBomb": "관계 이름을 모른다면 그 빈칸도 남겨야 한다.",
    "twist": "관계 단계를 몰라도 편한 대화 조건은 정리할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 관심을 전할 상황이 있다면 어떤 방식이 편할지 고른다."
      }
    ],
    "repairAction": "관계를 확정하는 문구 없이 조건부 질문을 남긴다.",
    "counterexample": "실제 상태가 추가 입력되기 전에는 특정 단계의 맞춤 행동으로 확정하지 않는다.",
    "applicationLimit": "배우자·연인·썸·과거 이별을 만들어 넣지 않는다.",
    "distinctFromOtherParagraphs": "미입력은 별도 상태이며 다른 상태의 완곡 표현이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "배우자·연인·썸·과거 이별을 만들어 넣지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:single-small-invite",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "빠르게 제안하는 힘을 관계를 서두르는 속도와 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "fast_start_romance는 본인의 시작 통로 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "만남 제안은 작게 하고 관계 정의는 별도 답을 기다린다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "수정하거나 거절할 수 있는 제안이면 선택권이 남는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "빠른 반응을 받아야 한다는 의무는 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "3f713efd6c7ca838b2f8"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "single"
    ],
    "positive": "관심을 묻히지 않고 표현",
    "risk": "상대가 고르기 전에 계획을 확정",
    "factBomb": "제안의 속도와 동의의 속도는 같은 것이 아니다.",
    "twist": "빠르게 초대하고 천천히 기다릴 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 짧은 커피 약속을 제안하고 날짜 변경을 열어둔다."
      }
    ],
    "repairAction": "한 가지 제안 뒤 추가 압박 없이 답할 시간을 둔다.",
    "counterexample": "상대가 이미 거절했다면 작은 제안을 다시 하는 것이 적절한 시작 행동은 아니다.",
    "applicationLimit": "실제 상대의 관심이나 교제 가능성을 보장하지 않는다.",
    "distinctFromOtherParagraphs": "솔로의 제안 속도와 관계 합의 속도",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 관심이나 교제 가능성을 보장하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:some-response-window",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "신중한 마음을 썸에서 무기한 침묵으로 전달하지 않는 속도 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "신중한 시작 자료는 본인의 검토 시간만 설명한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "아직 생각 중이면 답할 수 있는 때나 현재 가능한 범위를 전한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "관계를 확정하지 않아도 만남 의사는 따로 말할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "애매함을 상대를 붙잡아두는 방법으로 쓰지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "f4b08443773729cee364"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:review-window",
        "axis": "ACTION_TEMPO",
        "definition": "행동 전 검토 시간을 배정",
        "condition": "오류 비용과 기한이 모두 주어진 상황",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "some"
    ],
    "positive": "내 속도를 유지하며 상대의 대기를 줄일 가능성",
    "risk": "완벽한 확신이 생길 때까지 어떤 답도 미루기",
    "factBomb": "결정이 어려운 것과 아무 정보도 주지 않는 것은 다르다.",
    "twist": "아직 모르겠다는 정확한 답도 선택 정보가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다시 만나고 싶지만 관계는 더 알아가고 싶다고 말한다."
      }
    ],
    "repairAction": "지금 가능한 답과 보류한 답을 분리한다.",
    "counterexample": "관계를 더 알아가고 싶지 않다는 답이 있다면 보류를 설명하며 상대를 기다리게 해서는 안 된다.",
    "applicationLimit": "관계의 확정을 거부하면 나쁜 성격이라고 평가하지 않는다.",
    "distinctFromOtherParagraphs": "썸의 선택 정보와 시간 조율",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "관계의 확정을 거부하면 나쁜 성격이라고 평가하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:dating-expression-update",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "연애 중 표현의 빈도를 둘의 생활 변화에 맞춰 다시 정하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "reciprocal_expression_need는 본인의 수신 필요 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "원하는 빈도와 실제 가능한 빈도를 함께 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "표현 방식이 바뀌어도 중요한 관심을 남길 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "연락 횟수로 충실함을 판정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "99d6728eeef28d090237"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "dating"
    ],
    "positive": "반복되는 추측 대신 합의 가능한 통로",
    "risk": "기존 주기를 사랑의 의무로 고정",
    "factBomb": "답장이 줄었다는 사실만으로 마음의 양을 계산할 수는 없다.",
    "twist": "짧게 자주와 길게 가끔 중 더 편한 답이 다를 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바쁜 주에 안부와 깊은 대화 시간을 따로 고른다."
      }
    ],
    "repairAction": "현재 생활 제약과 필요한 최소 표현을 상의한다.",
    "counterexample": "현재 연락 방식에 양쪽이 만족한다면 빈도를 다시 고치라는 과제는 필요하지 않을 수 있다.",
    "applicationLimit": "상대가 바빠졌거나 마음이 식었다고 생성하지 않는다.",
    "distinctFromOtherParagraphs": "초기 호감 속도와 다른 기존 관계의 표현 재조정",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대가 바빠졌거나 마음이 식었다고 생성하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:preparing-decision-pace",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "준비 결정을 빠르게 하는 힘과 둘이 받아들일 시간을 나눠 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "planned_intense_romance는 본인의 계획 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "견적 선택의 마감과 서로 생각할 시간을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "한 사람이 빠르면 정보 정리를 맡되 동의는 대신하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "실제 지출 규모나 결정권은 입력 없이 정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "63e067b6cec4f0da1ffe"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:LEADERSHIP:dissent-channel",
        "axis": "LEADERSHIP",
        "definition": "이견이 들어올 통로를 만듦",
        "condition": "권력·평가 관계를 먼저 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "marriage_preparing"
    ],
    "positive": "결정 지연의 이유를 알아갈 가능성",
    "risk": "준비 효율을 이유로 상대의 답을 생략",
    "factBomb": "내가 먼저 알아봤다는 사실이 둘의 결정을 끝내지는 않는다.",
    "twist": "결정할 항목을 줄이면 두 사람의 속도가 맞을 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 후보를 두 개 정리한 뒤 필요한 고민 시간을 묻는다."
      }
    ],
    "repairAction": "정보 수집·검토·동의를 분리한다.",
    "counterexample": "두 사람이 이미 빠른 결정에 동의했고 필요한 정보가 있다면 일부러 결론을 늦출 이유는 없다.",
    "applicationLimit": "상대의 무능함이나 소극성을 성향으로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "준비 과제의 마감과 관계 동의의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 무능함이나 소극성을 성향으로 단정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:married-talk-not-demand",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "기혼의 대화 빈도를 정할 때 혼자 정리할 시간과 함께 확인할 시간을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "emotional_checkin_frequency는 inferred 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "바로 설명이 어렵다면 다시 이야기할 통로를 남긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "공동생활의 정보와 개인의 사적인 생각은 범위가 다를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "모든 마음을 보고하는 규칙을 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "bedf4254e50989e1a90e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "married"
    ],
    "positive": "필요한 이야기를 미루지 않고 시간을 고를 가능성",
    "risk": "휴식을 이유로 공동 책임의 대화를 계속 미루기",
    "factBomb": "혼자 정리할 자유는 약속한 대화를 없애는 자유와 다르다.",
    "twist": "대화의 시간을 줄여도 다시 돌아올 기준은 남길 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 저녁에 피곤하면 다음 날 가능한 짧은 대화 시간을 정한다."
      }
    ],
    "repairAction": "당장 필요한 생활 정보와 나중에 나눌 감정을 분리한다.",
    "counterexample": "당장 결정해야 할 공동 생활 정보가 있다면 모든 대화를 개인 정리 뒤로 미루는 방식은 맞지 않을 수 있다.",
    "applicationLimit": "실제 배우자의 표현 성향이나 감정을 만들지 않는다.",
    "distinctFromOtherParagraphs": "기혼의 재연결 절차와 사생활의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 배우자의 표현 성향이나 감정을 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P2:unknown-channel-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "마음을 표현하는 속도",
    "researchKind": "input_context",
    "coreMeaning": "관계 상태 없이도 말·글·행동 중 편한 전달 통로를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "방식과 속도",
        "knowledge": "조용한 표현 자료는 실제 signed 근거 확인 전 편집 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "현재 전하고 싶은 뜻 하나를 골라 어떤 통로가 맞을지 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "속도 차이",
        "knowledge": "긴 설명을 하지 않아도 필요한 정보는 전할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "편안한 표현",
        "knowledge": "주어를 연인으로 지정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "b750d95ce60a2ec5ba58"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      ""
    ],
    "positive": "표현의 난도를 낮출 가능성",
    "risk": "완벽하게 정리할 때까지 뜻을 전하지 않기",
    "factBomb": "상태를 모른다고 필요한 표현까지 없어지는 것은 아니다.",
    "twist": "관계의 이름보다 말하고 싶은 정보부터 정할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 중요한 약속이 있다면 가능한 범위를 글로 전한다."
      }
    ],
    "repairAction": "조건부로 뜻과 전달 통로를 고른다.",
    "counterexample": "전하고 싶은 뜻이나 실제 대화 상황이 없다면 표현 과제를 의무로 만들지 않는다.",
    "applicationLimit": "새 관계나 실제 갈등을 임의로 보충하지 않는다.",
    "distinctFromOtherParagraphs": "무상태의 전달 연구로 초기 썸 스크립트와 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "새 관계나 실제 갈등을 임의로 보충하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:single-overhelp",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "처음 알아가는 사람에게 도움을 많이 주는 것으로 호감의 답을 대신 받으려는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "세심한 관심이 확인된 본인일 때 적용 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "요청 전에 준비를 떠맡으면 역할이 먼저 고정될 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "도움의 동의와 다음 만남 의사는 별개로 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "실제 상대가 이용하거나 의존한다고 단정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "6e846060eca8b8a32399"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "single"
    ],
    "positive": "호감과 도움의 범위를 구분",
    "risk": "잘해준 양으로 답을 기대",
    "factBomb": "도움은 호감을 사는 계약서가 아니다.",
    "twist": "적게 도와도 자기 관심은 분명히 전할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 모임 정리를 전부 맡기 전 필요한 도움을 묻는다."
      }
    ],
    "repairAction": "도움과 사적인 제안을 별도로 말한다.",
    "counterexample": "상대가 구체적으로 도움을 요청했고 본인도 여력이 있다면 도움 자체를 과용으로 판단하지 않는다.",
    "applicationLimit": "솔로가 반드시 만남을 원한다고 가정하지 않는다.",
    "distinctFromOtherParagraphs": "초기 역할 고정의 위험",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "솔로가 반드시 만남을 원한다고 가정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:some-reading-delay",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "썸의 연락 지연을 거절이나 밀당으로 단정하는 해석 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "답을 확인하고 싶은 본인 자료가 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "관찰은 지연이며 이유는 아직 미확인이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "반복 압박 대신 가능한 의사 확인을 한 번 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "상대의 생활사를 임의로 설명하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "8a6e798d5bb288c958fa"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:PATTERN_SENSE:counterpattern",
        "axis": "PATTERN_SENSE",
        "definition": "맞지 않는 사례를 적극 확인",
        "condition": "자료의 출처·범위를 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "some"
    ],
    "positive": "추측에서 실제 질문으로 이동",
    "risk": "불안을 줄이려 같은 질문을 연속하기",
    "factBomb": "답이 늦다는 사실에는 아직 이유가 붙어 있지 않다.",
    "twist": "모르는 이유를 남겨두는 것이 더 정확할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음 만남이 가능한지 짧게 묻고 답할 시간을 둔다."
      }
    ],
    "repairAction": "추측을 말하기 전 확인 가능한 질문 하나를 고른다.",
    "counterexample": "명확한 거절을 받은 경우에는 단지 바쁜 것일 수 있다는 추측으로 답을 무효화하지 않는다.",
    "applicationLimit": "조종·회피형·관심 없음으로 진단하지 않는다.",
    "distinctFromOtherParagraphs": "썸의 관찰과 해석 간격",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "조종·회피형·관심 없음으로 진단하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:dating-unspoken-score",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "익숙한 연애에서 말하지 않은 부탁을 수고의 비교로 바꾸는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "본인의 낮은 요청과 높은 책임 자료가 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "내가 선택한 도움과 상대에게 부탁한 몫을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "알아주길 바라는 마음은 실제 요청으로 바꿀 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "관계의 희생 역사를 만들어 넣지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "78cdb2e803560073a1c5"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "dating"
    ],
    "positive": "불편이 쌓이기 전에 필요한 몫을 드러낼 가능성",
    "risk": "동의하지 않은 일을 상대의 빚으로 기록",
    "factBomb": "나는 많이 했다는 말만으로 다음 역할은 정해지지 않는다.",
    "twist": "작은 부탁이 수고 비교보다 구체적인 답을 만든다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 준비 후 다음에는 누가 맡을지 직접 묻는다."
      }
    ],
    "repairAction": "한 가지 수고와 한 가지 요청을 나눠 말한다.",
    "counterexample": "실제로 요청하고 합의한 담당이 있다면 그 이행 문제를 말하지 않은 기대라고 축소하지 않는다.",
    "applicationLimit": "연인이 고마움을 모른다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "현재 연애의 암묵적 기대 위험",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "연인이 고마움을 모른다고 단정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:preparing-finance-consent",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "결혼 준비 비용을 많이 부담한 사람이 결정권도 자동으로 갖는다는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "joint_finance_authority는 inferred 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "부담 비율·정보 확인·결정 동의는 각각 상의해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "절약과 취향의 우선순위를 말할 기회를 남긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "실제 소득과 가족 지원금은 입력 없이 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "8670a7cd306dd817250d"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "marriage_preparing"
    ],
    "positive": "비용 대화를 권한 대화와 분리",
    "risk": "돈을 이유로 반대 의견을 차단",
    "factBomb": "더 냈다는 사실이 상대의 선택권을 구매하지는 않는다.",
    "twist": "예산을 줄이는 결정도 동등한 정보 속에서 할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 준비 예산의 상한과 각자 중요 항목을 따로 고른다."
      }
    ],
    "repairAction": "금액·권한·변경 동의를 세 가지 질문으로 나눈다.",
    "counterexample": "현재 비용 분담 자체를 알 수 없다면 권한 불균형이 실제로 존재한다고 판단하지 않는다.",
    "applicationLimit": "법률·자산 분쟁이나 실제 금액의 답을 새로 만들지 않는다.",
    "distinctFromOtherParagraphs": "준비 비용과 관계 동의의 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "법률·자산 분쟁이나 실제 금액의 답을 새로 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:married-labor-invisible",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "기혼 생활에서 분위기를 관리하는 수고가 보이지 않는 담당으로 고정되는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "marital_emotional_labor는 inferred 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "기억·연락·일정 확인의 수고도 실제 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "감사와 역할 재분배를 구분해 질문한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "배우자가 책임을 피했다고 단정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "d43c7946bfba7c3d5f9a"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "married"
    ],
    "positive": "보이지 않는 과제를 말할 가능성",
    "risk": "편안한 분위기를 위해 필요한 분담을 숨기기",
    "factBomb": "분위기가 괜찮다는 사실이 역할도 괜찮다는 뜻은 아니다.",
    "twist": "고마운 말과 맡을 행동을 같이 요청할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 가족 일정의 기억과 연락을 누가 할지 함께 적는다."
      }
    ],
    "repairAction": "반복 과제를 드러내고 가능한 담당을 다시 묻는다.",
    "counterexample": "역할이 이미 공유되고 조정되는 경우라면 한 사람이 감정 노동을 독점한다고 가정하지 않는다.",
    "applicationLimit": "성별에 따라 가사·감정 노동을 배정하지 않는다.",
    "distinctFromOtherParagraphs": "현재 생활의 미확인 부담을 질문으로 드러냄",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성별에 따라 가사·감정 노동을 배정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P3:unknown-no-stage-script",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "썸에서 반복하기 쉬운 실수",
    "researchKind": "input_context",
    "coreMeaning": "관계 상태를 모를 때 맞춤처럼 보이는 단계 추정을 피하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "초기 약점",
        "knowledge": "어떤 반응이 있었다는 사실도 입력되지 않았다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "타인의 작은 반응을 해석하는 경우에만 조건부 질문을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "오해의 장면",
        "knowledge": "관찰과 의미 부여를 나누는 일반 과정을 제시한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "현재 연인과의 연락을 기정사실로 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "2b973ff1bebbfb3da944"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      ""
    ],
    "positive": "정보 없는 부분을 남기면서 자기 판단을 살필 가능성",
    "risk": "무상태를 연애 초반으로 처리",
    "factBomb": "모르는 관계를 아는 듯 말하면 조언의 출발점부터 달라진다.",
    "twist": "관계 단계를 채우지 않아도 내 추측을 점검할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 누군가의 짧은 답을 받는 상황이라면 실제 말과 내 해석을 나눈다."
      }
    ],
    "repairAction": "조건부 장면과 실제 입력을 분리한다.",
    "counterexample": "새 상태 정보가 확인되면 일반 조건 질문만 고집하지 않고 그 입력의 범위에서 재검토해야 한다.",
    "applicationLimit": "현재 관심 대상·이별·부부 갈등을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "미상 상태에서 허위 맞춤화를 차단",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 관심 대상·이별·부부 갈등을 생성하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:single-open-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "주저함이 확인된 솔로에게 작은 관심 표현과 만남을 하지 않을 선택을 함께 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "passive_initiation_love는 본인의 시작 어려움 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "좋아하는 주제에 반응하는 작은 행동을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "상대의 답이 없으면 더 애써야 한다는 의무를 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "새 관계를 시작하지 않는 선택도 인정한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "d49fb42c265aa76d5310"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "single"
    ],
    "positive": "표현의 첫 단계를 작게 고를 가능성",
    "risk": "표현하지 않은 마음을 상대가 알아야 한다고 기대",
    "factBomb": "기다린 마음의 길이가 상대가 답할 의무는 아니다.",
    "twist": "관심을 한 번 말하고 멈추는 것도 자기 선택이다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 대화가 좋았다면 다시 이야기하고 싶다는 뜻을 짧게 전한다."
      }
    ],
    "repairAction": "한 번의 표현과 기다릴 범위를 스스로 정한다.",
    "counterexample": "표현하지 않겠다는 선택도 가능하며 내향적 태도를 반드시 고쳐야 할 문제로 보지 않는다.",
    "applicationLimit": "결과나 인연 시기를 보장하지 않는다.",
    "distinctFromOtherParagraphs": "솔로의 능동성과 선택권을 함께 둠",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "결과나 인연 시기를 보장하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:some-answer-not-label",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "썸에서는 관계 이름의 확정보다 지금 가능한 다음 선택을 묻는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "높은 기준은 내 중요 조건을 정리하는 데 사용한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "다음 만남과 관계 정의의 답을 한꺼번에 요구하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "서로가 더 알아갈 의사가 있는지 확인할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "망설임을 부족한 애정으로 단정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "00a52eadb4c1c9dbf9d1"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "some"
    ],
    "positive": "선택 단위를 줄여 알아갈 여지",
    "risk": "확실한 이름이 없으면 모든 관심을 무효로 보기",
    "factBomb": "이름을 빨리 정했다고 서로를 빨리 안 것은 아니다.",
    "twist": "모르는 부분이 있어도 다음 만남의 의사는 물을 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음에 만나고 싶은지 묻고 단계 이야기는 따로 둔다."
      }
    ],
    "repairAction": "현재 답할 수 있는 질문을 하나 고른다.",
    "counterexample": "두 사람이 관계 정의를 명시적으로 원한다면 그 대화를 무조건 뒤로 미루는 것이 좋은 속도는 아니다.",
    "applicationLimit": "특정 유형이 반드시 결정을 회피한다고 만들지 않는다.",
    "distinctFromOtherParagraphs": "썸의 선택 단계와 관계 확정 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 유형이 반드시 결정을 회피한다고 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:dating-renew-small",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "기존 관계에서 작고 반복 가능한 표현을 함께 고르는 방향 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "C082의 양측 조건과 실제 교제 맥락을 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "매번 큰 표현보다 가능한 통로와 빈도를 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "상대에게 지금도 반가운지 확인해야 반복이 의미가 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "일정한 양이 사랑을 보증하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "5cee60f48e9d45ace3fb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "dating"
    ],
    "positive": "관심을 지속 가능한 행동으로 바꿀 가능성",
    "risk": "같은 반복을 의무로 만들어 솔직한 피로를 막기",
    "factBomb": "꾸준함은 같은 반응을 계속 연기하는 일이 아니다.",
    "twist": "방식이 바뀌어도 중요한 관심은 남길 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바쁜 주에는 짧은 안부와 주말 대화를 합의한다."
      }
    ],
    "repairAction": "가능한 빈도와 수정할 조건을 정한다.",
    "counterexample": "실제 원천이 한쪽만 있거나 현재 표현이 원치 않는 방식이면 C082의 반복 표현 응용을 보류한다.",
    "applicationLimit": "한쪽 근거가 빠지면 Fusion 설명을 보류한다.",
    "distinctFromOtherParagraphs": "기존 연애의 표현 지속과 수신 갱신",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "한쪽 근거가 빠지면 Fusion 설명을 보류한다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:preparing-both-directions",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "준비를 잘 끝내는 것보다 두 사람이 결정 방식을 알아가는 방향을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "role_agreement_marriage는 inferred 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "누가 알아보고 누가 동의해야 하는지를 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "역할을 맡아도 거절과 수정 권한은 남길 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "준비 역할이 결혼 후 영구 분담은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "048c520649d4c0b898cb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "marriage_preparing"
    ],
    "positive": "함께 정하는 절차를 연습할 가능성",
    "risk": "잘하는 사람이 모든 준비를 떠맡기",
    "factBomb": "능숙하게 처리했다는 사실이 계속 담당하겠다는 동의는 아니다.",
    "twist": "역할을 바꿔보는 것이 준비보다 생활을 알아갈 기회가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음 준비 항목의 조사와 최종 합의를 따로 배정한다."
      }
    ],
    "repairAction": "담당·동의·변경 시점을 함께 정한다.",
    "counterexample": "담당을 바꾸는 것이 오히려 부담이라는 합의가 있다면 역할 교대 자체를 목표로 삼지 않는다.",
    "applicationLimit": "실제 생활 능력과 미래 역할을 유형으로 고정하지 않는다.",
    "distinctFromOtherParagraphs": "준비의 결과보다 협의 방식의 학습",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 생활 능력과 미래 역할을 유형으로 고정하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:married-current-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "기혼 관계에서 지금 고를 수 있는 작은 관심을 다시 찾는 방향 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "romantic_daily_care는 본인 자료이며 배우자의 만족은 별도다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "생활 역할 외에 반가웠던 행동을 짧게 알릴 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "새 준비 없이도 관심을 전달할 통로를 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "모든 관계의 회복 책임을 본인에게 주지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "61b30ec0831489592e05"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "married"
    ],
    "positive": "일상에서 선택한 애정을 표현",
    "risk": "계속 다정하면 모든 문제가 해결된다고 보기",
    "factBomb": "작은 관심은 공동 책임을 대신하는 보상이 아니다.",
    "twist": "일을 나누는 대화와 애정을 전하는 대화를 같이 둘 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 하루 중 고마웠던 행동을 말하고 다음 할 일도 나눈다."
      }
    ],
    "repairAction": "관심 하나와 조정할 생활 과제를 별도로 말한다.",
    "counterexample": "안전이나 공동 책임의 문제가 해결되지 않은 경우 작은 애정 표현이 그 문제를 대신할 수 없다.",
    "applicationLimit": "폭력·위협 관계에 다정함을 더하라고 권하지 않는다.",
    "distinctFromOtherParagraphs": "기혼의 애정과 공동 책임은 별도 축",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "폭력·위협 관계에 다정함을 더하라고 권하지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  },
  {
    "id": "lkr:material:CH04.P4:unknown-no-deficit",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "관계를 시작할 때 기억할 것",
    "researchKind": "input_context",
    "coreMeaning": "관계 이름 없이도 자기 기준을 정하는 긍정적 마무리를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "좋은 힘",
        "knowledge": "미입력은 부족함이나 연애 회피의 증거가 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "서두름과 주저함",
        "knowledge": "가까운 관계를 선택한다면 필요한 조건을 정리할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "선택의 여지",
        "knowledge": "관계를 선택하지 않는 삶도 유효하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "긍정적 메시지",
        "knowledge": "개인화된 운명이나 시기는 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "3571efa2a1cfc06f784f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      ""
    ],
    "positive": "정보를 억지로 채우지 않고 자기 선택을 정리",
    "risk": "일반 질문을 현재 연애의 진단으로 쓰기",
    "factBomb": "상태를 말하지 않았다고 대신 정할 권리는 생기지 않는다.",
    "twist": "관계의 이름보다 편한 선택의 기준을 먼저 둘 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 미래에 관계를 고른다면 지키고 싶은 공간과 표현을 적는다."
      }
    ],
    "repairAction": "조건부 기준 하나를 남기고 현재 사실로 쓰지 않는다.",
    "counterexample": "현재 관계에 관한 사실이 없으면 미래의 관계를 원할 것이라는 가정도 두지 않는다.",
    "applicationLimit": "결혼·출산·만남을 의무로 만들지 않는다.",
    "distinctFromOtherParagraphs": "무상태의 긍정 방향을 단계 진단과 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "결혼·출산·만남을 의무로 만들지 않는다.",
      "partnerFactsRequiredForCoupleClaims": true,
      "childFactsRequiredForChildClaims": true,
      "positiveSymbolNeedsActualProducer": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "상대의 MBTI·사주·속마음·동의·과거 사건을 본인 입력에서 생성",
      "parenting을 child로 전이하거나 자녀 존재·나이·성격·건강·성적·진로 추정",
      "호감·결혼·출산·재물·안전·외도·이별을 상징이나 유형만으로 보장",
      "위협·폭력·감시·강요를 성향 차이로 정상화하거나 화해 의무 부과"
    ],
    "newCalculatedFacts": 0,
    "inferenceOfPartnerOrChild": false
  }
];
