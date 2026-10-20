/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH03_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH03.P1:attracted-to-dialogue",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "내가 끌리기 쉬운 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "지적인 재치에 끌리는 마음과 함께 지내기 편한 조건을 별도로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "끌리는 특징",
        "knowledge": "witty_intellectual_attraction는 본인의 호감 단서다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "매력의 이유",
        "knowledge": "서로의 생각을 넓히는 대화가 관심의 통로가 될 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "호감 장면",
        "knowledge": "대화가 즐거워도 존중과 일정 조정은 따로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "조건과 관계의 구분",
        "knowledge": "상대의 실제 지능이나 MBTI는 이 자료로 알 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6710f0f66fdf88a7a033"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CURIOSITY:question-making",
        "axis": "CURIOSITY",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DEPTH:context-layer",
        "axis": "DEPTH",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "관심 있는 주제를 나누며 알아갈 가능성",
    "risk": "대화의 재치를 모든 관계 문제의 해답으로 보기",
    "factBomb": "재미있는 답을 잘하는 사람과 내 거절을 듣는 사람은 같은 조건이 아니다.",
    "twist": "생각이 달라도 잘 듣는 태도에서 편안함을 찾을 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 토론 뒤 의견이 달랐을 때 서로 어떻게 들었는지 묻는다."
      }
    ],
    "repairAction": "매력 단서와 꼭 필요한 관계 조건을 따로 적는다.",
    "counterexample": "지적 대화가 잘 맞아도 작은 거절을 존중하지 않는다면 편한 관계의 조건은 확인되지 않았다.",
    "applicationLimit": "특정 상대 유형이나 궁합 점수를 만들지 않는다.",
    "distinctFromOtherParagraphs": "호감의 입구를 설명하며 장기 적합성을 판정하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 상대 유형이나 궁합 점수를 만들지 않는다.",
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
    "id": "lkr:material:CH03.P1:attracted-to-direction",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "내가 끌리기 쉬운 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "중요한 방향을 공유하는 모습에 끌릴 때 선언과 실제 선택을 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "끌리는 특징",
        "knowledge": "same_direction_attraction은 본인 선호 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "매력의 이유",
        "knowledge": "추구하는 목표의 이름보다 실제 선택의 이유를 물을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "호감 장면",
        "knowledge": "비슷한 목표를 갖고도 방법과 생활 속도는 다를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "조건과 관계의 구분",
        "knowledge": "장래 계획의 유사성이 결혼 의사를 뜻하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "829aba7d8c1c08596ec1"
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
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "axis": "GOAL_DRIVE",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "표면 취향 밖의 관심을 알아갈 가능성",
    "risk": "같은 비전을 말하면 신뢰까지 확인됐다고 보기",
    "factBomb": "함께 꿈을 말한 시간이 함께 결정한 생활은 아니다.",
    "twist": "방향이 일부 달라도 합의할 방법을 찾을 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 하고 싶은 일과 지금 포기하기 어려운 일을 각각 묻는다."
      }
    ],
    "repairAction": "큰 목표 하나와 현재의 작은 선택을 나란히 본다.",
    "counterexample": "목표가 달라도 실제 선택을 존중하는 사람과는 편안함을 느낄 수 있다.",
    "applicationLimit": "상대의 경제력·성취·미래를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "의미의 끌림과 생활의 검증 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 경제력·성취·미래를 추정하지 않는다.",
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
    "id": "lkr:material:CH03.P1:attracted-to-liveliness",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "내가 끌리기 쉬운 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "함께 움직이는 즐거움에 끌릴 때 참여 속도와 거절 권리를 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "끌리는 특징",
        "knowledge": "fun_active_love는 본인에게 생동감이 호감 통로인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "매력의 이유",
        "knowledge": "같이 해보자는 제안이 관심을 알아갈 기회가 될 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "호감 장면",
        "knowledge": "즐거운 활동과 평범한 날의 배려는 별도로 살핀다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "조건과 관계의 구분",
        "knowledge": "활동 참여가 연애 관계의 합의는 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e49363e69d48e0771b10"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:start-latency",
        "axis": "ACTION_TEMPO",
        "definition": "결론과 첫 행동 사이의 간격",
        "condition": "결론이 실제로 난 뒤의 간격을 비교",
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "직접 함께하며 취향을 알아갈 가능성",
    "risk": "소극적인 참여를 관심 없음으로 단정",
    "factBomb": "함께 해봤다고 다음 단계도 동의한 것은 아니다.",
    "twist": "활동을 줄여도 대화가 편한지 알아볼 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 체험 활동 뒤 다음에는 쉬는 만남도 원하는지 묻는다."
      }
    ],
    "repairAction": "활동 제안과 관계 확인 질문을 분리한다.",
    "counterexample": "함께 활동하지 않아도 차분한 대화에서 호감이 생길 수 있으므로 활동량을 호감의 조건으로 고정하지 않는다.",
    "applicationLimit": "적극적인 상대를 정해진 이상형으로 만들지 않는다.",
    "distinctFromOtherParagraphs": "활동에서 생기는 끌림과 지속 조건의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "적극적인 상대를 정해진 이상형으로 만들지 않는다.",
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
    "id": "lkr:material:CH03.P1:attracted-to-safe-kindness",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "내가 끌리기 쉬운 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "천천히 신뢰를 확인하는 선호에서 친절한 인상과 실제 존중을 나눠 본다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "끌리는 특징",
        "knowledge": "slow_trust_love는 본인의 속도 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "매력의 이유",
        "knowledge": "작은 거절을 했을 때 반응이 어떤지 확인할 질문을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "호감 장면",
        "knowledge": "친절이 내 선택을 넓힐 때 편안함으로 이어질 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "조건과 관계의 구분",
        "knowledge": "배려를 받았다는 사실로 상대의 마음을 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d048a1db929d8e81a67f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:minimum-security",
        "axis": "STABILITY",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "서두르지 않고 관찰할 여지",
    "risk": "좋은 태도를 잃기 싫어 불편을 숨기기",
    "factBomb": "다정하게 대해줬다고 내 답을 바꿀 의무는 없다.",
    "twist": "조금 다른 의견을 말하는 순간이 신뢰를 알아갈 기회가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 시간이 어려운 제안에 대안을 말하고 반응을 살핀다."
      }
    ],
    "repairAction": "고마움과 동의 여부를 별도로 표현한다.",
    "counterexample": "친절한 도움 뒤에 거절을 바꾸라는 압박이 있다면 편안한 존중의 증거로 쓰지 않는다.",
    "applicationLimit": "첫 만남의 친절로 안전한 인격을 보장하지 않는다.",
    "distinctFromOtherParagraphs": "신뢰 선호를 외모나 유형의 이상형으로 치환하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "첫 만남의 친절로 안전한 인격을 보장하지 않는다.",
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
    "id": "lkr:material:CH03.P2:comfort-space",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "나와 편안한 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "개인 시간을 설명하고도 관계에서 밀려날 걱정을 덜 수 있는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "편안한 조건",
        "knowledge": "freedom_love_boundary는 본인 경계 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "자신의 근거",
        "knowledge": "혼자 쓸 시간과 함께 지킬 약속을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "맞춰갈 행동",
        "knowledge": "상대의 시간을 통제하지 않고 재연결 방법을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "안정감의 요소",
        "knowledge": "실제 상대가 간섭한다는 사실은 입력되지 않았다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f3a71de74732acc8d4fd"
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "개인의 관심과 관계를 동시에 지킬 여지",
    "risk": "자유를 이유로 연락 합의 전체를 생략",
    "factBomb": "내 시간을 존중받고 싶다면 함께 정한 시간도 보여줘야 한다.",
    "twist": "경계가 분명하면 함께하는 시간을 더 편하게 고를 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 취미 시간 뒤 다시 연락할 때를 서로 정한다."
      }
    ],
    "repairAction": "공간과 공동 약속 두 가지를 함께 물어본다.",
    "counterexample": "상대가 함께 쉬는 방식을 선호한다면 각자 떨어지는 방법만으로 공간 문제를 풀 수는 없다.",
    "applicationLimit": "자율성 선호를 애정 부족이나 회피 진단으로 바꾸지 않는다.",
    "distinctFromOtherParagraphs": "CH01 기본 스타일과 달리 관계 환경의 확인 기준",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자율성 선호를 애정 부족이나 회피 진단으로 바꾸지 않는다.",
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
    "id": "lkr:material:CH03.P2:comfort-explained-change",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "나와 편안한 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "일정이 늘 같아야 하는 관계보다 변경의 이유를 알려주는 관계 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "편안한 조건",
        "knowledge": "신뢰를 중시하는 실제 본인 자료가 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "자신의 근거",
        "knowledge": "못 지킬 약속을 미리 수정하는 행동을 살핀다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "맞춰갈 행동",
        "knowledge": "예측 가능성은 횟수보다 수정 절차에서도 생긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "안정감의 요소",
        "knowledge": "한 번의 변경만으로 상대의 성격을 판단하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5190684455c102b45097"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:STABILITY:protective-change",
        "axis": "STABILITY",
        "definition": "지속을 위해 필요한 변경을 수용",
        "condition": "유지할 가치와 바꿀 방법을 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "변화 속에서도 합의를 다시 만들 가능성",
    "risk": "일정 변화를 애정 감소로 자동 번역",
    "factBomb": "변경하지 않는 약속보다 변경을 숨기지 않는 약속이 중요할 수 있다.",
    "twist": "정해진 횟수를 줄여도 설명이 있으면 편할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 근무가 바뀐 주에 만남 주기를 다시 상의한다."
      }
    ],
    "repairAction": "지킬 최소 조건과 알릴 시점을 합의 질문으로 둔다.",
    "counterexample": "변경 안내가 있어도 이미 생긴 실제 비용은 별도로 조정해야 하며 설명만으로 해결됐다고 보지 않는다.",
    "applicationLimit": "상대의 근무나 생활사를 사실로 생성하지 않는다.",
    "distinctFromOtherParagraphs": "규칙의 강도가 아닌 변경 가능성의 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 근무나 생활사를 사실로 생성하지 않는다.",
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
    "id": "lkr:material:CH03.P2:comfort-emotional-answer",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "나와 편안한 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "마음의 확인을 원하는 본인에게 추측 대신 서로 답할 통로가 있는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "편안한 조건",
        "knowledge": "emotional_confirmation_need는 본인의 확인 욕구 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "자신의 근거",
        "knowledge": "매번 즉시 답하기와 중요한 때 답을 미루는 이유를 말하기는 다르다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "맞춰갈 행동",
        "knowledge": "부담 없이 현재 마음을 설명할 때 불필요한 추측을 줄일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "안정감의 요소",
        "knowledge": "상대가 불안하게 만들었다는 원인은 단정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8a6e798d5bb288c958fa"
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "질문을 통해 실제 답을 얻을 기회",
    "risk": "확인을 반복해 같은 답을 시험하기",
    "factBomb": "여러 번 물었다고 더 정확한 답이 생기는 것은 아니다.",
    "twist": "답할 시간을 정하는 것이 확인을 줄일 방법이 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바쁜 날에는 짧은 안부와 긴 대화 시간을 따로 정한다."
      }
    ],
    "repairAction": "질문 빈도와 답하기 어려울 때의 안내를 함께 묻는다.",
    "counterexample": "지금 답할 수 없다는 명확한 안내가 있다면 다시 확인하는 빈도를 늘리는 것이 필요하지 않을 수 있다.",
    "applicationLimit": "상대의 감정 크기나 성격을 추측하지 않는다.",
    "distinctFromOtherParagraphs": "표현량보다 확인이 가능한 관계 절차",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 감정 크기나 성격을 추측하지 않는다.",
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
    "id": "lkr:material:CH03.P2:comfort-unforced-self",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "나와 편안한 사람",
    "researchKind": "mbti_application",
    "coreMeaning": "내면의 관심을 모두 공개하지 않아도 존중받는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "편안한 조건",
        "knowledge": "inner_world_respect는 inferred 자료임을 보존한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "자신의 근거",
        "knowledge": "말하고 싶은 범위와 아직 정리할 범위를 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "맞춰갈 행동",
        "knowledge": "다른 생각을 설명할 여유가 있을 때 친밀함과 사생활을 함께 지킬 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "안정감의 요소",
        "knowledge": "모든 질문을 침해로 보거나 모든 공개를 친밀함으로 보지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "04bdba29a1fd1c319537"
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "꾸미지 않은 관심을 꺼낼 여지",
    "risk": "알아주길 바라면서 필요한 정보까지 숨기기",
    "factBomb": "마음을 존중받는 일과 마음을 알아맞히게 하는 일은 다르다.",
    "twist": "전부 말하지 않아도 필요한 뜻은 전할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 개인 글의 내용 대신 지금 쉬고 싶은 이유만 알려준다."
      }
    ],
    "repairAction": "공유할 내용과 공유하지 않을 이유를 구분해 말한다.",
    "counterexample": "공동 책임의 중요한 정보까지 숨기는 상황이라면 사생활 존중만으로 충분한 답이 아니다.",
    "applicationLimit": "비공개 영역을 거짓말이나 정서적 진단으로 취급하지 않는다.",
    "distinctFromOtherParagraphs": "상대 유형 대신 공개 범위와 존중 행동을 확인",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "비공개 영역을 거짓말이나 정서적 진단으로 취급하지 않는다.",
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
    "id": "lkr:material:CH03.P3:difference-new-and-stable",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "서로 다른 모습이 도움이 될 때",
    "researchKind": "mbti_application",
    "coreMeaning": "새 경험을 좋아하는 본인이 안정된 약속을 함께 두면 도움이 되는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "도움 되는 차이",
        "knowledge": "본인의 열정과 후속 이행 어려움 자료를 나란히 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "검증된 근거",
        "knowledge": "실제 상대가 계획형이라는 정보는 필요할 때 별도로 받아야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "긍정적 영향",
        "knowledge": "새 제안을 할 때 바뀌지 않을 약속을 먼저 남길 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "갈등으로 변할 조건",
        "knowledge": "상반된 유형의 상대가 필요하다는 결론을 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "dfc34b2596abcc59968f",
      "c72ad7e4dbeab2b8b75f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "새로움과 기다릴 기준을 함께 고를 가능성",
    "risk": "상대에게 계획과 정리 일을 몰아주기",
    "factBomb": "누군가 안정적이어야 한다며 내 약속을 넘기는 것은 보완이 아니다.",
    "twist": "내가 작은 기준을 남겨도 변화의 재미를 유지할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 갑작스러운 외출 제안에 기존 약속을 먼저 확인한다."
      }
    ],
    "repairAction": "변경할 부분과 유지할 부분을 분리한다.",
    "counterexample": "상대가 안정 역할을 원하지 않는다면 보완 관계라는 이유로 계획 담당을 맡기지 않는다.",
    "applicationLimit": "상대의 안정성이나 역할을 본인 유형에서 생성하지 않는다.",
    "distinctFromOtherParagraphs": "차이는 사실이 아니라 조율이 필요한 가상 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 안정성이나 역할을 본인 유형에서 생성하지 않는다.",
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
    "id": "lkr:material:CH03.P3:difference-listening-and-solution",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "서로 다른 모습이 도움이 될 때",
    "researchKind": "mbti_application",
    "coreMeaning": "해결을 잘 제안하려는 본인이 듣기를 원하는 경우와 만났을 때의 조건부 보완을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "도움 되는 차이",
        "knowledge": "useful_support_style는 본인의 지원 방식 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "검증된 근거",
        "knowledge": "실제 상대가 무엇을 원했는지 먼저 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "긍정적 영향",
        "knowledge": "해결 이전에 질문하면 제안의 방향을 맞출 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "갈등으로 변할 조건",
        "knowledge": "듣는 사람과 해결하는 사람이라는 고정 역할을 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d35d738ef528ee981728"
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "도움의 효율과 마음의 수신을 함께 확인",
    "risk": "상대의 감정 설명을 비효율로 보기",
    "factBomb": "도움의 목적이 맞아도 도움의 순서는 물어야 한다.",
    "twist": "잠깐 듣는 일이 해결을 늦추는 것만은 아니다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 고민을 들었을 때 제안할지 같이 정리할지 묻는다."
      }
    ],
    "repairAction": "현재 필요한 도움을 한 번 확인한 뒤 제안한다.",
    "counterexample": "상대가 방법 제시를 분명히 원한다면 듣기만 하는 조율이 더 적절하다고 단정하지 않는다.",
    "applicationLimit": "상대가 특정 감정형이라는 가정을 넣지 않는다.",
    "distinctFromOtherParagraphs": "서로 다른 필요가 있을 때 도움 순서를 조율",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대가 특정 감정형이라는 가정을 넣지 않는다.",
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
    "id": "lkr:material:CH03.P3:difference-direct-gentle",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "서로 다른 모습이 도움이 될 때",
    "researchKind": "mbti_application",
    "coreMeaning": "돌려 말하는 본인이 직접적인 질문을 받았을 때 활용할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "도움 되는 차이",
        "knowledge": "indirect_expression는 본인의 전달 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "검증된 근거",
        "knowledge": "직접적인 말이 무례했는지 단지 명확했는지는 실제 표현을 봐야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "긍정적 영향",
        "knowledge": "상대가 묻는 핵심을 확인하고 필요한 요청을 짧게 말할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "갈등으로 변할 조건",
        "knowledge": "모든 직설을 참아야 하는 관계로 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e8152f5a228dde8da538"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "axis": "COMMUNICATION_STYLE",
        "definition": "맥락과 관계를 고려해 전달",
        "condition": "민감한 피드백의 장소와 수신자 확인",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "짐작의 부담을 줄일 기회",
    "risk": "말투의 차이를 인격 전체의 차이로 확대",
    "factBomb": "부드러운 뜻도 알아들을 정보가 있어야 전달된다.",
    "twist": "짧고 직접적인 요청을 부드럽게 말할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 뜻이 애매한 질문에 무엇을 결정하려는지 되묻는다."
      }
    ],
    "repairAction": "전달 의도와 실제 받은 영향을 따로 확인한다.",
    "counterexample": "직접적인 말에 모욕이나 위협이 포함된다면 단순 화법 차이로 조율하지 않는다.",
    "applicationLimit": "상대 유형이나 말투를 태생적 특성으로 고정하지 않는다.",
    "distinctFromOtherParagraphs": "일방적인 화법 교정이 아닌 서로 필요한 정보의 조율",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대 유형이나 말투를 태생적 특성으로 고정하지 않는다.",
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
    "id": "lkr:material:CH03.P3:difference-rest-and-company",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "서로 다른 모습이 도움이 될 때",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "사회 반응을 살피는 활동과 회복의 필요가 다를 때 둘의 시간을 조율하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "도움 되는 차이",
        "knowledge": "C080의 양측 근거와 실제 활동 부하가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "검증된 근거",
        "knowledge": "상대가 모임을 좋아한다는 사실은 별도 입력으로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "긍정적 영향",
        "knowledge": "모든 만남을 함께하지 않아도 다시 나눌 통로를 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "갈등으로 변할 조건",
        "knowledge": "사회 감각이 좋으면 반드시 혼자 쉬어야 한다고 인과를 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1be2f30bf579c8de2ede"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "만남 뒤의 부하를 설명할 가능성",
    "risk": "휴식을 관계 거절로 해명하느라 더 지치기",
    "factBomb": "쉬고 싶다는 말은 상대의 가치에 대한 평가가 아니다.",
    "twist": "함께 있는 휴식이 더 편한 경우도 반례로 남긴다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 모임 다음 날 각자 쉬고 저녁에 짧게 연락하기로 정한다."
      }
    ],
    "repairAction": "실제 회복 선호를 묻고 일정을 조율한다.",
    "counterexample": "실제 회복 선호가 함께 있는 활동이라면 모임 뒤 혼자 쉬는 장면은 적용되지 않을 수 있다.",
    "applicationLimit": "상대와 본인의 피로 정도를 미리 확정하지 않는다.",
    "distinctFromOtherParagraphs": "보완형 Fusion의 조건과 실제 휴식 선택을 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "상대와 본인의 피로 정도를 미리 확정하지 않는다.",
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
    "id": "lkr:material:CH03.P4:selection-no-test",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "관계를 선택할 때 중요한 기준",
    "researchKind": "mbti_application",
    "coreMeaning": "높은 관계 기준을 비밀 시험 대신 말할 수 있는 질문으로 바꾸는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "관계 기준",
        "knowledge": "slow_high_standard_love는 본인의 기준 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "중요한 조건을 실제 행동 질문으로 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "실제 살필 행동",
        "knowledge": "말하지 않은 정답을 상대가 맞혀야 하는 상황을 줄인다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "알아보는 방법",
        "knowledge": "이상형 목록의 충족을 안전이나 관계 성공으로 보장하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "00a52eadb4c1c9dbf9d1"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "선택 기준을 자기 이해에 쓸 가능성",
    "risk": "보이지 않는 시험을 통과해야 마음을 주기",
    "factBomb": "알려주지 않은 기준을 못 맞힌 것은 불성실함의 증거가 아니다.",
    "twist": "중요 기준을 줄이면 실제 차이를 더 잘 볼 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 갈등 때 어떤 방식으로 대화하고 싶은지 묻는다."
      }
    ],
    "repairAction": "필수 조건과 취향 조건을 나누고 실제 답을 듣는다.",
    "counterexample": "필수 기준이 자유로운 동의나 안전이라면 취향처럼 낮추거나 협상해야 하는 조건으로 보지 않는다.",
    "applicationLimit": "특정 MBTI와의 결혼을 권하지 않는다.",
    "distinctFromOtherParagraphs": "끌림을 평가가 아닌 명시 가능한 기준으로 전환",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 MBTI와의 결혼을 권하지 않는다.",
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
    "id": "lkr:material:CH03.P4:selection-refusal",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "관계를 선택할 때 중요한 기준",
    "researchKind": "legacy_application",
    "coreMeaning": "거절할 때 선택이 유지되는지를 관계 선택의 관찰 기준으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "관계 기준",
        "knowledge": "기존 boundary는 signed axis의 편집 응용이지 새 원국 사실이 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "작은 제안을 거절했을 때 수정이나 중단이 가능한지 살핀다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "실제 살필 행동",
        "knowledge": "동의를 철회할 여지가 있어야 지속한 선택도 의미가 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "알아보는 방법",
        "knowledge": "거절을 시험 목적으로 일부러 유도하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "86ce278eca349b89b4d4"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "자기 경계를 말할 가능성",
    "risk": "선을 말하면 반드시 관계를 잃는다고 생각하기",
    "factBomb": "싫다는 말을 설득 과제로 바꾸면 동의할 자리도 줄어든다.",
    "twist": "관계를 선택하지 않는 답도 유효한 선택이다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 개인 정보 공유 요청에 지금은 어렵다고 말한다."
      }
    ],
    "repairAction": "편안한 거절 범위를 확인하고 압박에는 추가 설득 의무를 두지 않는다.",
    "counterexample": "거절 뒤 위협이 생기는 상황에서는 작은 거절로 상대를 시험하기보다 안전을 먼저 확인해야 한다.",
    "applicationLimit": "위협이나 통제를 성향 차이로 정상화하지 않는다.",
    "distinctFromOtherParagraphs": "관계 만족 이전에 필요한 동의와 선택의 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "위협이나 통제를 성향 차이로 정상화하지 않는다.",
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
    "id": "lkr:material:CH03.P4:selection-response-over-image",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "관계를 선택할 때 중요한 기준",
    "researchKind": "mbti_application",
    "coreMeaning": "좋은 이미지를 바라는 마음과 실제 상대의 응답을 나눠 보는 기준을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "관계 기준",
        "knowledge": "idealizing_people는 본인의 해석 위험 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "좋았던 인상과 반복해서 확인한 행동을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "실제 살필 행동",
        "knowledge": "상대의 설명이 바뀌면 내 해석도 갱신할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "알아보는 방법",
        "knowledge": "한 번의 실수로 나쁜 사람이라고 단정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "46657b0a756f0987de92"
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
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "기대와 관찰을 분리할 가능성",
    "risk": "좋은 의도일 거라며 불편한 행동을 계속 덮기",
    "factBomb": "내가 믿고 싶은 모습은 상대가 선택한 행동의 대체 자료가 아니다.",
    "twist": "기대를 낮추기보다 사실을 더 분명히 둘 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 변경의 이유와 다음 행동을 나란히 확인한다."
      }
    ],
    "repairAction": "관찰한 말·행동과 내 의미 부여를 별도 칸에 둔다.",
    "counterexample": "관찰한 부정적 행동 하나만으로 인격 전체를 정하는 것 역시 사실과 해석을 섞는 경우다.",
    "applicationLimit": "관계의 위험을 MBTI 탓으로 돌리거나 용서를 강요하지 않는다.",
    "distinctFromOtherParagraphs": "관계 이미지보다 실제 확인 방법의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "관계의 위험을 MBTI 탓으로 돌리거나 용서를 강요하지 않는다.",
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
    "id": "lkr:material:CH03.P4:selection-reciprocity",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "관계를 선택할 때 중요한 기준",
    "researchKind": "mbti_application",
    "coreMeaning": "잘해주는 정도보다 서로 필요한 몫을 조정할 수 있는지를 기준으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "관계 기준",
        "knowledge": "본인의 돌봄 성향이 실제로 확인되어야 개인 설명이 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "주고받는 일이 정확히 같아야 한다는 계산과 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "실제 살필 행동",
        "knowledge": "서로 여력과 요청을 말할 때 일방적 역할을 알아볼 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "알아보는 방법",
        "knowledge": "상대의 현재 사정은 본인 자료로 알 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "7dd6ccfe702fb492ef5e",
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "돌봄의 불균형을 질문으로 확인",
    "risk": "내 수고를 모른다는 이유로 상대 마음을 판정",
    "factBomb": "고마움을 받는 것과 책임을 나누는 것은 다른 답이다.",
    "twist": "같은 양보다 합의 가능한 방식이 중요할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음 만남 준비에서 가능한 역할을 각자 제안한다."
      }
    ],
    "repairAction": "감사 표현과 실제 분담 요청을 별도로 둔다.",
    "counterexample": "지금의 여력 차이에 대해 서로 동의했다면 다른 양의 참여도 상호적일 수 있다.",
    "applicationLimit": "경제력이나 돌봄 능력이 낮은 사람을 배제하는 기준으로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "상호성의 실질 절차를 관계 선택에 적용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "경제력이나 돌봄 능력이 낮은 사람을 배제하는 기준으로 쓰지 않는다.",
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
