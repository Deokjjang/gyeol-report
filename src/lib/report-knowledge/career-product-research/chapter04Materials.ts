/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH04_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH04.P1:shared-vocabulary",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "함께 일하는 나",
    "researchKind": "mbti_application",
    "coreMeaning": "협업은 같은 단어를 다른 뜻으로 쓰는지 확인하는 일",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "협업 특징",
        "knowledge": "부드러운 설명 선호를 합의할 용어에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "소통 근거",
        "knowledge": "원천의 언어 선호는 갈등 없는 관계의 보장이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "타인에게 주는 장점",
        "knowledge": "가상 기능의 완료라는 말을 각자가 다르게 이해",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "좋은 협업 조건",
        "knowledge": "상대가 이어 할 수 있는 정보를 합의",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8a3b104ce2a794e55b60"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "반복 설명을 줄일 여지",
    "risk": "기분을 살피다 모호한 약속을 그대로 둘 수 있음",
    "factBomb": "친절한 말도 범위가 불분명하면 서로 다른 실행을 만듦",
    "twist": "직접 확인 질문이 오히려 부드러운 협업을 지킴",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 리뷰에서 완료·검증·반영의 뜻을 나눔"
    },
    "economicScene": "되묻기와 재작업의 투입 구분",
    "learningScene": "상대가 다시 말한 정의와 원래 뜻 대조",
    "action": "애매한 단어 하나를 구체적인 행동으로 바꾸기",
    "counterexample": "상대의 말과 반응 정보가 없으면 실제 오해를 단정하지 않음",
    "distinctFromOtherParagraphs": "CH01 개인 정보 수집보다 사람 사이 의미 합의",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 말과 반응 정보가 없으면 실제 오해를 단정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P1:handoff-observation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "함께 일하는 나",
    "researchKind": "mbti_application",
    "coreMeaning": "관찰과 해석을 구분해서 넘기는 협업",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "협업 특징",
        "knowledge": "기억·관찰 원천을 인계의 사실 전달에 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "소통 근거",
        "knowledge": "실제 인계 기록의 내용은 별도로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "타인에게 주는 장점",
        "knowledge": "가상 대상자의 말과 기록의 차이를 사실로 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "좋은 협업 조건",
        "knowledge": "다음 담당자의 재확인을 돕는 정보를 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "9a241cbad4de6e655789"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
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
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:care"
    ],
    "positive": "연결이 끊기는 부분을 줄일 여지",
    "risk": "상대에게 필요 없는 세부까지 모두 전달",
    "factBomb": "많이 기억한다는 것이 중요한 변화의 우선순위를 정했다는 뜻은 아님",
    "twist": "확신보다 확인이 필요한 칸을 남기는 것이 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "익명 가상 인계에서 변경과 미확인 항목을 나눔"
    },
    "economicScene": "확인·인계 시간을 개인 호의로 지우지 않음",
    "learningScene": "관찰 문장과 판단 문장을 대조",
    "action": "추정은 추정으로 표시해 담당자에게 연결",
    "counterexample": "건강 판단·자격·실제 대상자 경험을 생성하지 않음",
    "distinctFromOtherParagraphs": "기억력 일반론과 다른 전달 정보의 품질",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "건강 판단·자격·실제 대상자 경험을 생성하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P1:parallel-constraints",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "함께 일하는 나",
    "researchKind": "mbti_application",
    "coreMeaning": "협업자의 다른 제약을 같은 목적 아래 비교",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "협업 특징",
        "knowledge": "유능한 동료 선호는 같은 방법을 쓴다는 뜻이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "소통 근거",
        "knowledge": "원천은 협업 선호이며 상대의 능력 정보가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "타인에게 주는 장점",
        "knowledge": "개발과 영업의 완료 시점이 다른 가상 기획",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "좋은 협업 조건",
        "knowledge": "각자의 필요를 공개해야 같은 약속을 만들 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "392a9907c29658c54cc8"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "axis": "LEADERSHIP",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:project_planning"
    ],
    "positive": "서로 기다리는 결정을 좁힐 여지",
    "risk": "자신의 우선순위를 공동 목표로 강요",
    "factBomb": "빠른 결론이 상대의 준비 부족을 없애주지는 않음",
    "twist": "다른 속도의 이유를 들으면 불필요한 재결정이 줄어듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 일정표에 부서별 선행 조건을 표시"
    },
    "economicScene": "결정 대기와 조율 시간의 차이",
    "learningScene": "결과 목표와 수행 제약을 다른 항목으로 설명",
    "action": "각자가 기다리는 정보 한 가지 확인",
    "counterexample": "상대 역할·조직이 입력되지 않았다면 가상 상황으로만 유지",
    "distinctFromOtherParagraphs": "CH04 협업 정보로 CH05 다음 경력 선택과 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대 역할·조직이 입력되지 않았다면 가상 상황으로만 유지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P1:client-brief",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "함께 일하는 나",
    "researchKind": "mbti_application",
    "coreMeaning": "의뢰인과 창작자의 협업은 목적·승인·수정 기준을 나누는 일",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "협업 특징",
        "knowledge": "피드백 안전 원천을 의뢰 대화의 조건에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "소통 근거",
        "knowledge": "실제 의뢰인의 취향이나 요청 이력을 추정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "타인에게 주는 장점",
        "knowledge": "촬영 전 참고 이미지와 사용 목적이 다르다는 가상 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "좋은 협업 조건",
        "knowledge": "시안·테스트 컷·선정 기준을 합의하면 협업 정보가 남음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1668268fb9233e277c7b"
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer",
      "self_employed"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "방어적 취향 논쟁을 줄일 여지",
    "risk": "의뢰인의 질문을 전부 작업 간섭으로 볼 수 있음",
    "factBomb": "최대한 자유롭게 하라는 말도 최종 사용 조건을 대신하지 못함",
    "twist": "명확한 질문이 창작의 자유를 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 고객에게 꼭 필요한 컷과 참고 분위기를 나눠 묻기"
    },
    "economicScene": "재촬영과 같은 컷 보정의 투입 차이",
    "learningScene": "피드백을 목적·사실·취향으로 분류",
    "action": "승인자와 중간 확인 시점을 묻기",
    "counterexample": "의뢰·계약 존재를 입력 없이 과거 경험으로 말하지 않음",
    "distinctFromOtherParagraphs": "직장 상사를 만들지 않는 프리랜서 협업",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "의뢰·계약 존재를 입력 없이 과거 경험으로 말하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P1:student-role-dialogue",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "readerQuestion": "함께 일하는 나",
    "researchKind": "mbti_application",
    "coreMeaning": "팀 과제의 역할·산출물을 맞추는 협업",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "협업 특징",
        "knowledge": "학생에게 회사 평가·승진을 적용하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "소통 근거",
        "knowledge": "협업 선호 원천은 팀원의 성격 추정이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "타인에게 주는 장점",
        "knowledge": "가상 디자인 과제에서 자료 조사와 시안 담당을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "좋은 협업 조건",
        "knowledge": "각 결과가 최종 제출에 어떻게 연결되는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cdc60c6b316ee8a858c1"
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "서로의 기여를 드러낼 여지",
    "risk": "분위기를 지키려고 다른 사람의 과제까지 맡음",
    "factBomb": "친구가 편해졌어도 내 학습 기회가 사라질 수 있음",
    "twist": "역할을 분명히 나누는 것이 관계를 지키는 배려",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 팀 과제의 각자 연습할 기능을 표시"
    },
    "economicScene": "공동 제출량과 개인 학습 시간을 구분",
    "learningScene": "자기 역할의 결과를 설명하는 연습",
    "action": "도울 범위와 각자 해볼 부분 합의",
    "counterexample": "실제 팀 과제·친구 성격을 만들어내지 않음",
    "distinctFromOtherParagraphs": "공통 협업 기능과 학생 신분의 적용 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 팀 과제·친구 성격을 만들어내지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P2:decision-owner",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "조직 안에서의 역할",
    "researchKind": "natal_application",
    "coreMeaning": "결정할 권한과 결과 책임을 같은 범위로 맞추는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "적합한 역할",
        "knowledge": "적합 역할은 모든 일을 대신하는 사람이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "칠살의 압박 대응 상징은 직급의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "적용 상황",
        "knowledge": "가상 과제에서 승인자 부재로 작업이 멈춤",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "한계",
        "knowledge": "누가 어떤 결정을 할 수 있는지 먼저 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f8f90022e047bfe61557"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "axis": "LEADERSHIP",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:small_business"
    ],
    "positive": "대기를 줄이는 조정에 기여할 여지",
    "risk": "책임감 때문에 권한 없는 결과까지 약속",
    "factBomb": "책임만 늘면 결정의 무게와 통제 가능성이 어긋남",
    "twist": "일부 결정을 돌려주는 것이 더 큰 책임을 지키는 방법",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 위임에 중단·질의·완료 기준을 작성"
    },
    "economicScene": "확인 지연과 반복 승인 투입",
    "learningScene": "역할·권한·질문 통로를 분리",
    "action": "범위가 불명확하면 먼저 확인",
    "counterexample": "실제 지위가 없으면 관리자로 호명하지 않음",
    "distinctFromOtherParagraphs": "CH02 능력 가능성과 다른 조직 권한 계약",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 지위가 없으면 관리자로 호명하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P2:quality-gate-role",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "조직 안에서의 역할",
    "researchKind": "natal_application",
    "coreMeaning": "검수 역할은 발견·수정·승인을 구분해야 한다",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "적합한 역할",
        "knowledge": "검토할 문제와 최종 결정을 다른 역할로 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "원국 근거는 검수 전문성의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "적용 상황",
        "knowledge": "가상 리뷰에서 큰 오류와 표현 의견이 섞임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "한계",
        "knowledge": "안전·동작 기준과 개선 의견을 구별",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "필요한 검토를 통과 가능한 기준으로 만들 여지",
    "risk": "검토자의 취향이 모든 승인 기준을 차지",
    "factBomb": "지적이 많다는 사실만으로 중요한 위험을 줄였다고 볼 수 없음",
    "twist": "승인할 조건을 명확히 말하는 검토가 실제 협력을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 구현에서 반드시 고칠 오류만 먼저 표시"
    },
    "economicScene": "필수 수정과 선택 개선의 투입 차이",
    "learningScene": "오류 크기에 따른 검토 순서 연습",
    "action": "발견과 최종 결정의 담당을 확인",
    "counterexample": "권한·실제 결과 없이 최종 책임을 개인에게 귀속하지 않음",
    "distinctFromOtherParagraphs": "검토 재능과 다른 협업 승인 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "권한·실제 결과 없이 최종 책임을 개인에게 귀속하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P2:instruction-role",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "조직 안에서의 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "설명 역할은 다른 사람의 다음 행동까지 연결",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "적합한 역할",
        "knowledge": "알려줄 내용과 상대가 스스로 할 부분을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "교육 선호는 모든 직무의 설명 권한이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "적용 상황",
        "knowledge": "가상 신입 안내에서 따라한 단계와 이해한 이유가 다름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "한계",
        "knowledge": "질문 통로와 실습 범위를 함께 정함",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8bf155c8bcdbb54b9142"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
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
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:teaching"
    ],
    "positive": "팀의 반복 질문을 줄일 여지",
    "risk": "교육 역할이 모든 지원 요청의 담당으로 커짐",
    "factBomb": "한 사람이 모두 알려주면 조직의 자료 공백이 숨겨질 수 있음",
    "twist": "모르는 내용을 전문가에게 연결하는 것도 교육 역할",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 사용 안내에서 자주 막히는 단계만 자료로 남김"
    },
    "economicScene": "교육 준비·자료 유지 투입",
    "learningScene": "설명 뒤 혼자 수행할 과제 설계",
    "action": "지원 범위와 전문 확인 필요를 밝히기",
    "counterexample": "없는 신입·동료·부하 직원을 생성하지 않음",
    "distinctFromOtherParagraphs": "상대의 배움을 잇는 역할이며 직급이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "없는 신입·동료·부하 직원을 생성하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P2:operations-bridge",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "조직 안에서의 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "작업 사이의 선행 조건을 연결하는 운영 역할",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "적합한 역할",
        "knowledge": "직접 작업과 순서 조정을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "운영 선호는 실제 공정 권한의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "적용 상황",
        "knowledge": "가상 앞 공정 지연으로 여러 작업이 대기",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "한계",
        "knowledge": "변경된 순서와 영향받는 담당을 함께 알림",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5b8d6b11c49970419712"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:logistics"
    ],
    "positive": "일의 공백을 줄일 여지",
    "risk": "계획 유지 때문에 현장 예외를 못 들을 수 있음",
    "factBomb": "표가 맞아도 현장에서 실행할 자원이 없으면 조율이 끝난 게 아님",
    "twist": "현장 담당자의 예외 정보가 계획을 더 현실적으로 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 작업표에서 시작 불가능한 단계를 표시"
    },
    "economicScene": "대기·인수인계·다시 시작할 투입 구분",
    "learningScene": "순서 변경의 영향을 설명하는 연습",
    "action": "실제 상태를 확인할 담당에게 먼저 묻기",
    "counterexample": "안전·설비 절차를 임의 변경하는 지침 금지",
    "distinctFromOtherParagraphs": "직접 실행과 다른 작업 간 연결의 책임",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전·설비 절차를 임의 변경하는 지침 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P2:independent-contributor",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "readerQuestion": "조직 안에서의 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "전문 기여자는 독립 판단과 확인이 필요한 범위를 나눈다",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "적합한 역할",
        "knowledge": "적합 역할은 전문가라는 호칭보다 다룰 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "근거",
        "knowledge": "권한·범위 정렬 원천을 실제 작업 계약에 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "적용 상황",
        "knowledge": "가상 분석에서 자료 판단과 사업 최종 결정이 다름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "한계",
        "knowledge": "분석 한계와 필요한 확인을 같이 전달",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c782e08817e7f4ae8cd7"
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee",
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:research"
    ],
    "positive": "전문 판단이 결정에 쓰일 여지",
    "risk": "분석 담당이 최종 사업 책임까지 떠안을 수 있음",
    "factBomb": "잘 안다는 이유가 모든 판단을 혼자 해도 된다는 허가는 아님",
    "twist": "한계를 공개하면 전문 역할의 신뢰가 커질 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 보고서에 확인 사실·추론·결정 필요를 분리"
    },
    "economicScene": "추가 조사와 최종 결정 대기의 자원 구분",
    "learningScene": "불확실성 수준을 전달하는 연습",
    "action": "내가 답할 질문과 의사결정자의 질문을 나눔",
    "counterexample": "실제 전문 자격·경력을 자동 인정하지 않음",
    "distinctFromOtherParagraphs": "CH03 직무 후보보다 현재 역할의 판단 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 전문 자격·경력을 자동 인정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P3:sharp-correction-cost",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "직장생활 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "오류를 지적하는 말이 수정 협력을 막는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "반복 위험",
        "knowledge": "반복 위험은 오류와 사람 평가를 한꺼번에 말하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "원천의 즉시 교정 위험과 실제 행동은 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "충돌과 성과 비용",
        "knowledge": "가상 검토에서 왜 이런 것도 틀렸냐는 평가가 섞임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "고칠 사실과 수정할 기준을 먼저 전달",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "76d4c68e32d1662f8abf"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:accounting"
    ],
    "positive": "정확한 내용이 실제 수정으로 이어질 여지",
    "risk": "급한 교정이 상대의 설명을 끊을 수 있음",
    "factBomb": "내가 맞아도 상대가 자료를 숨기면 검토 품질이 떨어짐",
    "twist": "확인 질문이 단정보다 빠른 수정을 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 증빙 누락에 사람 평가 없이 요청 문장 쓰기"
    },
    "economicScene": "방어적 대화·자료 재요청의 투입",
    "learningScene": "관찰한 오류와 추정한 의도를 분리",
    "action": "변경할 사실 하나와 필요한 자료를 제시",
    "counterexample": "실제 갈등이나 동료 감정을 단정하지 않음",
    "distinctFromOtherParagraphs": "CH06 금전 비용보다 즉시 협업 정보 손실",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 갈등이나 동료 감정을 단정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P3:take-back-work",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "직장생활 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "늦은 결과를 되가져오는 과용이 위임을 약하게 한다",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "반복 위험",
        "knowledge": "반복 위험은 돕기와 책임 회수의 경계",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "원천의 위임 압력은 실제 팀 실패의 증거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "충돌과 성과 비용",
        "knowledge": "가상 과제의 중간 결과가 느려 대표가 전부 수정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "담당자의 설명과 필요한 지원부터 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce00081ce37c25f1db93"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "axis": "LEADERSHIP",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:small_business"
    ],
    "positive": "스스로 끝낼 조건을 남길 여지",
    "risk": "급한 때마다 다시 내 손으로 가져옴",
    "factBomb": "오늘 빠르게 끝내도 다음에는 더 많은 일이 내게 돌아올 수 있음",
    "twist": "질문 시간을 남기면 직접 처리 시간을 줄일 가능성",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 중간 검토에서 결과 기준만 다시 맞춤"
    },
    "economicScene": "재수행·승인 대기·대표 개입 투입 구분",
    "learningScene": "부족한 결과와 다른 방법을 구별",
    "action": "중간 확인 지점을 조정",
    "counterexample": "직원·팀이 없는 입력에는 적용 불가",
    "distinctFromOtherParagraphs": "CH08 장기 성장 정체와 달리 지금의 위임 흐름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직원·팀이 없는 입력에는 적용 불가",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P3:silent-disagreement",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "직장생활 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "갈등을 줄이려다 중요한 이견을 전달하지 않는 비용",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "반복 위험",
        "knowledge": "반복 위험은 불명확한 요청에 동의부터 하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "갈등 회피 원천은 실제 고객 반응을 만들지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "충돌과 성과 비용",
        "knowledge": "가상 접수에서 기한이 불가능하지만 바로 수락",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "가능한 범위와 확인할 조건을 먼저 알림",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "59ee9c7408ed5dac4efe"
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:administration"
    ],
    "positive": "약속이 커지기 전에 조정할 여지",
    "risk": "좋은 관계를 위해 불가능한 결과도 암묵 약속",
    "factBomb": "짧은 불편을 피하다 마감 뒤 큰 설명 부담을 받을 수 있음",
    "twist": "일찍 말한 제한이 오히려 상대의 계획을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 요청에 처리 가능·질의 필요를 나눠 답함"
    },
    "economicScene": "추가 문의·뒤늦은 보완의 투입",
    "learningScene": "거절 대신 가능한 다음 절차를 설명",
    "action": "바로 답할 수 없는 항목 표시",
    "counterexample": "실제 성격 결함이나 반복 실패로 단정하지 않음",
    "distinctFromOtherParagraphs": "CH03 회피 환경과 달리 자신의 조건부 응대 습관",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 성격 결함이나 반복 실패로 단정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P3:invisible-change",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "직장생활 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "현장 변경을 알리지 않으면 다른 사람이 옛 약속대로 움직인다",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "반복 위험",
        "knowledge": "반복 위험은 빠른 조정 뒤 공유를 생략하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "협상 유연성 원천과 실제 계약 권한은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "충돌과 성과 비용",
        "knowledge": "가상 고객에게 납기를 바꿨지만 제공 팀은 모름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "바뀐 조건과 영향받는 약속을 함께 알림",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f93bf80f81c4305dbee6"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:sales"
    ],
    "positive": "빠른 적응을 공동의 실행으로 만들 여지",
    "risk": "작은 예외니까 알릴 필요가 없다고 여김",
    "factBomb": "고객에게 친절한 변경이 내부의 재작업으로 돌아갈 수 있음",
    "twist": "짧은 변경 기록이 다음 대응의 자율성을 지킴",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 제안서의 변경된 항목만 공유"
    },
    "economicScene": "납기·준비·다른 고객 일정의 투입 비교",
    "learningScene": "변경 전후 차이를 짧게 설명",
    "action": "변경 승인과 알림의 대상을 확인",
    "counterexample": "실제 계약을 임의 변경하거나 법률 조언하지 않음",
    "distinctFromOtherParagraphs": "CH06 무료 추가 투입과 달리 정보 불일치 위험",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 계약을 임의 변경하거나 법률 조언하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P3:scope-refusal-cost",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "readerQuestion": "직장생활 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "비합리적 요청을 거절할 때 연결 대안을 남기는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "반복 위험",
        "knowledge": "위험은 이유가 맞아도 상대의 목적을 닫는 대응",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "권위 질문 원천은 반항한 실제 사건의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "충돌과 성과 비용",
        "knowledge": "가상 요청에서 기술적 불가능과 일정 부담이 섞임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "조정 행동",
        "knowledge": "불가능한 부분과 가능한 대안을 따로 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "caf2f3ef4f21ea3ad88f"
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "판단의 질을 협력으로 옮길 여지",
    "risk": "옳은 결론을 먼저 말해 질문을 막을 수 있음",
    "factBomb": "안 된다는 말만 남으면 사용 문제는 다른 곳에서 반복됨",
    "twist": "요구를 다시 나눈 대안이 더 큰 독립성을 가능하게 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기능의 꼭 필요한 결과와 원하는 방법을 분리"
    },
    "economicScene": "재논의·불필요한 구현 투입 구분",
    "learningScene": "목적을 지키는 다른 구현 설명",
    "action": "거절 이유와 확인할 대안 한 가지 제시",
    "counterexample": "실제 상사와 갈등이 있다고 단정하지 않음",
    "distinctFromOtherParagraphs": "경계 기능의 일반 소개와 다른 거절 이후 협업 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상사와 갈등이 있다고 단정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P4:culture-exception-path",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "나에게 맞는 조직문화",
    "researchKind": "mbti_application",
    "coreMeaning": "좋은 문화는 규칙과 예외 질의 통로를 함께 갖춘다",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "편안한 환경",
        "knowledge": "편안한 환경을 안내의 명료성으로 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "자율성 규칙 소통",
        "knowledge": "명확한 지시 선호는 변화 불가 요구가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "피할 문제",
        "knowledge": "가상 새 기준이 도입될 때 이유와 적용일을 알림",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "개선 방법",
        "knowledge": "예외를 누구에게 물을지 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "01b252c15ec6d3cc4064"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:administration"
    ],
    "positive": "기준을 지키며 필요한 변화에 적응할 여지",
    "risk": "규칙의 존재만 보고 실제 적용 공백을 놓침",
    "factBomb": "규정집이 있어도 서로 다르게 해석하면 문의가 반복됨",
    "twist": "좋은 질문이 규칙을 약하게 하기보다 정확하게 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 변경 공지의 모호한 항목 질의"
    },
    "economicScene": "확인·재처리·공지 유지 시간의 구분",
    "learningScene": "새 기준을 사례에 대조",
    "action": "최근 변경과 예외 처리 과정을 묻기",
    "counterexample": "실제 조직 사례가 없으면 문화 품질 판정 보류",
    "distinctFromOtherParagraphs": "CH01 개인 조건보다 조직의 기준 변경 운영",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 조직 사례가 없으면 문화 품질 판정 보류",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P4:culture-feedback-safety",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "나에게 맞는 조직문화",
    "researchKind": "mbti_application",
    "coreMeaning": "피드백을 사람 평가와 작업 기준으로 나누는 문화",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "편안한 환경",
        "knowledge": "편안함은 비판이 전혀 없다는 뜻이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "자율성 규칙 소통",
        "knowledge": "원천의 안전한 피드백 선호를 실제 절차로 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "피할 문제",
        "knowledge": "가상 시안에 목적·사실·취향 의견이 섞임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "개선 방법",
        "knowledge": "검토 기준과 변경 범위를 먼저 맞춤",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1668268fb9233e277c7b"
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "불편한 의견도 개선 정보로 들을 여지",
    "risk": "칭찬만 있는 곳을 좋은 문화로 볼 수 있음",
    "factBomb": "갈등을 피하느라 수정할 문제도 말하지 않으면 결과는 나아지지 않음",
    "twist": "분명한 기준의 비판이 막연한 칭찬보다 편할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 회의에서 사람 성향 대신 읽기 문제를 지적"
    },
    "economicScene": "방향 재제작과 세부 조정 투입 차이",
    "learningScene": "의견의 근거를 요청하는 연습",
    "action": "피드백 시점·기준·결정자를 묻기",
    "counterexample": "현재 조직이 적대적이라고 추정하지 않음",
    "distinctFromOtherParagraphs": "CH03 회피 여부보다 개선 가능한 검토 문화",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 조직이 적대적이라고 추정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P4:culture-recovery",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "나에게 맞는 조직문화",
    "researchKind": "mbti_application",
    "coreMeaning": "준비·집중·회복이 역할의 일부로 인정되는 문화",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "편안한 환경",
        "knowledge": "편안한 환경은 일과 사람을 피하는 곳이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "자율성 규칙 소통",
        "knowledge": "차분한 집중 선호와 건강 상태를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "피할 문제",
        "knowledge": "가상 지원 업무에서 후속 연락과 기록이 겹침",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "개선 방법",
        "knowledge": "응대 범위와 인계 시간을 운영에 포함",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "248692af90259c9eebe4"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:counsel_support"
    ],
    "positive": "지속 가능한 전문 기여의 여지",
    "risk": "회복을 개인의 감정 문제로만 축소",
    "factBomb": "좋은 마음만으로 상시 대응을 지속할 수 있다는 가정은 운영 비용을 숨김",
    "twist": "일의 경계를 정하면 도움을 더 오래 이어갈 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 지원 일정에 기록·인계 시간을 배정"
    },
    "economicScene": "응대와 후속 작업의 투입 분리",
    "learningScene": "업무 종료와 인계 기준 설명",
    "action": "회복과 집중 시간을 운영에서 어떻게 지키는지 묻기",
    "counterexample": "질병·번아웃 진단 또는 개인 건강 예측 금지",
    "distinctFromOtherParagraphs": "직무 조건과 회복 자원에 대한 문화 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "질병·번아웃 진단 또는 개인 건강 예측 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P4:culture-evidence-decision",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "나에게 맞는 조직문화",
    "researchKind": "mbti_application",
    "coreMeaning": "근거가 실제 결정에 쓰이는 문화인지 확인",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "편안한 환경",
        "knowledge": "능력 평가의 말보다 질문·수정의 통로를 봄",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "자율성 규칙 소통",
        "knowledge": "능력주의 선호는 특정 조직의 정답 판정이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "피할 문제",
        "knowledge": "가상 분석의 반례가 나왔을 때 결론을 고칠 수 있는지",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "개선 방법",
        "knowledge": "직급과 무관하게 근거를 검토할 절차 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ab11baeaebb982a96e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
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
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:research"
    ],
    "positive": "깊은 검토가 실행에 연결될 여지",
    "risk": "능력 평가를 자기 기준의 동의로 오해",
    "factBomb": "근거를 말해도 결정 권한의 다른 제약은 존재할 수 있음",
    "twist": "다른 결론의 이유를 듣는 것이 자율 판단을 넓힘",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 회의에서 채택·보류 이유를 기록"
    },
    "economicScene": "재조사와 결정 지연의 투입 구분",
    "learningScene": "주장과 근거, 최종 결정을 구분",
    "action": "최근에 근거로 바꾼 선택이 있는지 묻기",
    "counterexample": "조직 정치·차별·평가 사실을 입력 없이 만들지 않음",
    "distinctFromOtherParagraphs": "CH04 문화의 판단 과정으로 CH02 분석 능력과 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "조직 정치·차별·평가 사실을 입력 없이 만들지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  },
  {
    "id": "ckr:material:CH04.P4:culture-frontline-voice",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "readerQuestion": "나에게 맞는 조직문화",
    "researchKind": "mbti_application",
    "coreMeaning": "현장의 반응을 다음 운영에 반영할 통로",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "편안한 환경",
        "knowledge": "편안한 환경은 반응에 대응만 하는 곳이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "자율성 규칙 소통",
        "knowledge": "반응하는 팀 선호는 실제 고객 만족의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "피할 문제",
        "knowledge": "가상 매장 고객이 반복해 묻는 정보를 안내에 반영",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "개선 방법",
        "knowledge": "관찰·전달·수정의 역할을 정함",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0b4c5f82e25554523be7"
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
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "student",
      "job_seeker",
      "employee",
      "freelancer",
      "self_employed",
      "business_owner",
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [
      "ckr:job:retail",
      "ckr:job:cafe"
    ],
    "positive": "현장 경험이 누적될 여지",
    "risk": "큰 목소리의 반응만 전체 고객 뜻으로 읽음",
    "factBomb": "상시 응대만 하고 원인을 못 바꾸면 같은 문의가 돌아옴",
    "twist": "작은 안내 수정이 친절한 반복 설명을 줄일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 품절 문의를 운영 담당에게 묶어 전달"
    },
    "economicScene": "응대량과 안내 유지의 투입 비교",
    "learningScene": "반응의 빈도와 실제 원인을 구분",
    "action": "관찰한 문제를 바꿀 담당과 통로 확인",
    "counterexample": "실제 고객 수·반응 통계를 추정하지 않음",
    "distinctFromOtherParagraphs": "개인 서비스 선호와 다른 현장 정보의 조직 활용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 고객 수·반응 통계를 추정하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "disallowed": [
      "직업·경력·소득·고객 수·자격·가족·건강·과거 사건을 입력 없이 사실로 보충",
      "직무 분류·직업 상태를 명리 사실·점수·추천 순위로 변환",
      "기간·Pair 근거를 본인 원국 성향이나 직장 상대의 성격으로 자동 사용",
      "성공·승진·합격·재물 증가·투자 능력 확정"
    ],
    "newCalculatedFacts": 0,
    "recommendationRankChange": false
  }
];
