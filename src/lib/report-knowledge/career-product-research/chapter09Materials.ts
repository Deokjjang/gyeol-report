/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH09_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH09.P1:choose-task-rights",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "readerQuestion": "가장 중요한 직업 선택 기준",
    "researchKind": "recall",
    "coreMeaning": "소개된 검토 의미를 과제·자료·권한의 선택 기준으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "핵심 조건",
        "knowledge": "핵심 조건은 중요한 오류를 실제로 바꿀 수 있는가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "중요한 이유",
        "knowledge": "앞서 같은 개인에게 도입된 검토 의미만 사용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "선택 질문",
        "knowledge": "직함보다 어떤 자료와 수정 통로가 있는지 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "잘못된 선택 방지",
        "knowledge": "이름만 좋은 역할의 오판을 줄이는 기준",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
    "positive": "강점이 쓰일 조건을 구체적으로 고를 여지",
    "risk": "아직 소개하지 않은 능력을 선택 이유로 추가",
    "factBomb": "자료 후보가 존재하는 것과 해당 고객에게 실제 소개된 것은 다름",
    "twist": "작은 권한의 명확함이 큰 직함보다 중요할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 두 역할에서 자료·판단·책임을 비교"
    },
    "economicScene": "역할의 준비·검토·재처리 투입 구분",
    "learningScene": "선택한 역할에 부족한 기준 확인",
    "action": "실제 introduced ledger에서 같은 fact root를 확인",
    "counterexample": "선행 의미가 없으면 회수 보류",
    "distinctFromOtherParagraphs": "CH01 업무 방식이 아니라 실제 선택을 비교하는 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "선행 의미가 없으면 회수 보류",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH01.P4:permission-to-correct",
      "ckr:material:CH03.P4:blocked-review"
    ],
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
    "id": "ckr:material:CH09.P1:choose-freelance-purpose",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "readerQuestion": "가장 중요한 직업 선택 기준",
    "researchKind": "recall",
    "coreMeaning": "목적과 지속 조건이 함께 있는 작업인지 고르는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "핵심 조건",
        "knowledge": "핵심 조건은 서로 같은 납품 결과를 말하는가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "중요한 이유",
        "knowledge": "앞서 확인한 본인의 의뢰·범위 질문만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "선택 질문",
        "knowledge": "사용 목적·수정·준비를 따로 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "잘못된 선택 방지",
        "knowledge": "반가운 의뢰를 바로 좋은 선택으로 확정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "작업과 생활의 약속을 함께 고를 여지",
    "risk": "포트폴리오에 좋아 보인다는 이유로 모든 범위 수락",
    "factBomb": "좋은 한 장을 만들고 싶다는 의도와 계약 범위는 별개",
    "twist": "구체적인 질문이 창작 기회를 더 오래 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 의뢰 두 개에서 같은 기준으로 범위 비교"
    },
    "economicScene": "촬영 밖 선별·보정·응대 투입을 회수",
    "learningScene": "부족한 기술을 작은 견본으로 확인",
    "action": "실제 도입된 조건 중 이번 선택에 맞는 부분만 회수",
    "counterexample": "현재 분류 unknown과 실제 경력 미상을 유지",
    "distinctFromOtherParagraphs": "다시 사진가를 소개하지 않고 계약 비교 기준을 추가",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 분류 unknown과 실제 경력 미상을 유지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P4:next-photo-brief",
      "ckr:material:CH06.P2:photo-use-value"
    ],
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
    "id": "ckr:material:CH09.P1:choose-learning-sample",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "readerQuestion": "가장 중요한 직업 선택 기준",
    "researchKind": "recall",
    "coreMeaning": "새 역할을 고르기 전에 작은 과제로 질문을 좁히는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "핵심 조건",
        "knowledge": "핵심 조건은 해보고 확인할 수 있는가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "중요한 이유",
        "knowledge": "앞서 도입된 준비·학습 의미를 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "선택 질문",
        "knowledge": "공고의 필수 과제와 도움받을 통로를 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "잘못된 선택 방지",
        "knowledge": "과정 이름만 늘리는 선택을 점검",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "job_seeker",
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "준비의 크기를 실제 질문에 맞출 여지",
    "risk": "완벽한 경력이 있어야 선택 가능하다고 생각",
    "factBomb": "모든 기술을 배우는 준비는 실제 역할의 질문을 늦출 수 있음",
    "twist": "작은 실패를 설명할 수 있는 과제가 다음 선택을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공고 하나의 핵심 요구를 작은 구현으로 시험"
    },
    "economicScene": "과정·연습·지원 준비 투입을 비교",
    "learningScene": "새 입력의 수행 범위를 확인",
    "action": "도입된 의미와 현재 상태가 같은지 확인",
    "counterexample": "source pool의 다른 유형을 함께 사실로 회수하지 않음",
    "distinctFromOtherParagraphs": "CH07 학습 과정이 아니라 역할 선택의 확인 기준",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "source pool의 다른 유형을 함께 사실로 회수하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P4:next-seeker-sample",
      "ckr:material:CH07.P2:dev-new-input"
    ],
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
    "id": "ckr:material:CH09.P1:choose-repeat-burden",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "readerQuestion": "가장 중요한 직업 선택 기준",
    "researchKind": "recall",
    "coreMeaning": "반복할 수 있는 품질과 부담을 동시에 고르는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "핵심 조건",
        "knowledge": "핵심 조건은 다음에도 같은 약속을 지킬 수 있는가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "중요한 이유",
        "knowledge": "앞서 도입된 운영·투입 의미만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "선택 질문",
        "knowledge": "새 상품의 매력과 준비·정리 부담을 따로 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "잘못된 선택 방지",
        "knowledge": "한 번의 바쁨으로 확대를 확정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "self_employed"
    ],
    "detailJobRefs": [
      "ckr:job:cafe"
    ],
    "positive": "지속할 운영 범위를 고를 여지",
    "risk": "개별 메뉴만 보고 전체 흐름을 놓침",
    "factBomb": "상품 하나의 성공처럼 보여도 다른 약속을 밀 수 있음",
    "twist": "범위를 줄이는 선택이 장기 제공을 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 운영안 두 개의 품질·대기·마감 비교"
    },
    "economicScene": "이미 확인한 자원 항목만 회수",
    "learningScene": "작게 바꿀 조건 하나 확인",
    "action": "도입된 운영 조건과 실제 입력을 대조",
    "counterexample": "실제 매출·고객 수·확대 성공 생성 금지",
    "distinctFromOtherParagraphs": "CH06 관리 원리보다 운영안의 비교 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 매출·고객 수·확대 성공 생성 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P4:next-cafe-test",
      "ckr:material:CH06.P4:fixed-variable-time"
    ],
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
    "id": "ckr:material:CH09.P1:choose-known-context",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "readerQuestion": "가장 중요한 직업 선택 기준",
    "researchKind": "recall",
    "coreMeaning": "현재 상태가 확인되기 전에는 결정 질문부터 좁히는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "핵심 조건",
        "knowledge": "핵심 조건은 사실로 아는 것과 원하는 것을 구분하는가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "중요한 이유",
        "knowledge": "둘 중 실제 도입된 상태 자료만 선택",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "선택 질문",
        "knowledge": "현재 과제와 탐색 의도를 다른 질문으로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "잘못된 선택 방지",
        "knowledge": "미입력을 특정 생활로 보충하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "other"
    ],
    "detailJobRefs": [],
    "positive": "없는 정보에 기대지 않는 선택의 여지",
    "risk": "좋은 전략처럼 보이게 현재 경험을 발명",
    "factBomb": "정확한 선택은 자료가 많은 것보다 적용 대상이 맞는지에 달림",
    "twist": "모르는 정보를 남기는 것이 더 구체적인 다음 질문을 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 관심 과제의 조건을 물어보기"
    },
    "economicScene": "돈·시간·지원의 실제 입력만 회수",
    "learningScene": "관심 분야 확인 뒤 작은 과제",
    "action": "상태가 다른 선행 후보를 동시에 사실로 사용하지 않음",
    "counterexample": "other와 empty를 동일한 상태로 합치지 않음",
    "distinctFromOtherParagraphs": "CH05 상태 소개에서 이번 선택의 정보 부족을 관리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "other와 empty를 동일한 상태로 합치지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P1:status-empty",
      "ckr:material:CH05.P1:status-other"
    ],
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
    "id": "ckr:material:CH09.P2:guard-precision-loop",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "readerQuestion": "내가 반드시 조심해야 할 것",
    "researchKind": "recall",
    "coreMeaning": "검토 과용의 다른 비용을 이번 행동에서 분리해 회수",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "소개된 위험",
        "knowledge": "소개된 위험은 모든 흠을 직접 고치는 반복",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "연결 이유",
        "knowledge": "즉시 협업 비용과 장기 기준 부족을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "악화 조건",
        "knowledge": "급한 마감에서 같은 검토를 다시 가져오는 조건 주의",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "보완 방법",
        "knowledge": "중요 오류 기준과 전달할 사실을 먼저 정함",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
    "positive": "정확성을 유지하며 확인 범위를 조절할 여지",
    "risk": "위험을 새로운 결함이나 실제 실패로 추가",
    "factBomb": "같은 root의 위험 설명 두 개가 독립 약점 두 개는 아님",
    "twist": "검토를 공유하면 자기 정확성도 필요한 곳에 남길 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 검토에서 핵심 오류 하나를 공동 기준으로 기록"
    },
    "economicScene": "직접 교정·재질의·기준 유지 투입",
    "learningScene": "다른 사람이 기준을 쓸 수 있는지",
    "action": "같은 개인에게 소개된 위험과 적용 조건만 회수",
    "counterexample": "이전 위험이 실제 도입되지 않았다면 보류",
    "distinctFromOtherParagraphs": "CH08 위험 재서술 대신 지금의 방지 기준을 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "이전 위험이 실제 도입되지 않았다면 보류",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH08.P3:career-precision-lock",
      "ckr:material:CH04.P3:sharp-correction-cost"
    ],
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
    "id": "ckr:material:CH09.P2:guard-depth-delay",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "readerQuestion": "내가 반드시 조심해야 할 것",
    "researchKind": "recall",
    "coreMeaning": "준비 지연과 결과 미전달을 구분해 확인하는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "소개된 위험",
        "knowledge": "소개된 위험은 질문을 끝없이 늘리는 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "연결 이유",
        "knowledge": "배움의 착수와 직업 결과의 전달은 다른 비용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "악화 조건",
        "knowledge": "미확인 질문이 남았다는 이유로 전부 보류할 때 주의",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "보완 방법",
        "knowledge": "필수 결론과 남은 질문을 별도로 닫음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
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
    "positive": "깊이를 실제 사용으로 남길 여지",
    "risk": "서로 다른 MBTI 후보를 같은 사람의 약점으로 합침",
    "factBomb": "원천과 ledger가 맞지 않으면 좋은 회수 문장도 허위가 됨",
    "twist": "한계를 공개한 결과가 완벽한 준비보다 도움이 될 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석의 이번 답과 다음 조사를 분리"
    },
    "economicScene": "추가 조사와 사용 지연의 투입",
    "learningScene": "질문 하나가 바꿀 결정을 확인",
    "action": "실제로 도입된 호환 부분집합만 선택",
    "counterexample": "INTP·INTJ 양쪽 원천이 한 입력에 동시에 참이라고 회수하지 않음",
    "distinctFromOtherParagraphs": "복수 후보 풀과 실제 도입된 의미를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "INTP·INTJ 양쪽 원천이 한 입력에 동시에 참이라고 회수하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH08.P3:career-depth-without-use",
      "ckr:material:CH07.P3:perfection-start"
    ],
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
    "id": "ckr:material:CH09.P2:guard-help-responsibility",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "readerQuestion": "내가 반드시 조심해야 할 것",
    "researchKind": "recall",
    "coreMeaning": "도움의 범위와 전문 준비의 자원을 함께 지키는 기준",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "소개된 위험",
        "knowledge": "소개된 위험은 지원량으로만 자신의 가치를 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "연결 이유",
        "knowledge": "시간 비용과 장기 준비 부족을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "악화 조건",
        "knowledge": "반복 질문에 모두 직접 답하려 할 때 주의",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "보완 방법",
        "knowledge": "공통 안내와 개별 지원을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
      "ckr:job:teaching"
    ],
    "positive": "배려를 지속 가능한 도움으로 남길 여지",
    "risk": "도움을 줄이면 나쁜 사람이 된다고 결론",
    "factBomb": "호의의 크기가 전문 기여의 깊이와 같지는 않음",
    "twist": "다른 통로에 연결하는 것이 필요한 지원일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 수업 후 반복 문의를 자료와 질의로 나눔"
    },
    "economicScene": "이미 소개된 준비·응대 투입 회수",
    "learningScene": "처음 보는 사람이 안내를 따라가는지",
    "action": "실제 도입된 ENFJ 의미와 현재 역할만 회수",
    "counterexample": "없는 수업·대상자·소진 경험 생성 금지",
    "distinctFromOtherParagraphs": "새 약점 아닌 앞선 도움 위험의 실행 조절",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "없는 수업·대상자·소진 경험 생성 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH08.P3:career-help-overload",
      "ckr:material:CH06.P3:help-hidden-cost"
    ],
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
    "id": "ckr:material:CH09.P2:guard-drive-review",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "readerQuestion": "내가 반드시 조심해야 할 것",
    "researchKind": "recall",
    "coreMeaning": "속도의 과용은 필수 검증 생략과 책임 회수로 나눠 점검",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "소개된 위험",
        "knowledge": "소개된 위험은 급한 수습을 반복하는 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "연결 이유",
        "knowledge": "서로 다른 실제 과제에서 도입한 위험만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "악화 조건",
        "knowledge": "시간 압박에 모든 일을 내 손으로 가져올 때 주의",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "보완 방법",
        "knowledge": "검증할 지점과 담당자의 권한을 먼저 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "axis": "GOAL_DRIVE",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
        "notIndependentEvidence": true
      },
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
      "ckr:job:software",
      "ckr:job:small_business"
    ],
    "positive": "실행과 조정을 함께 지킬 여지",
    "risk": "속도가 빠른 성격이라고 실제 실패를 추가",
    "factBomb": "혼자 빨리 끝내도 다음에도 같은 대기가 생길 수 있음",
    "twist": "잠깐의 공유가 다음 실행을 빠르게 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 급한 과제에서 담당·검증·질문 지점 정리"
    },
    "economicScene": "수습·대기·재수행 투입의 차이",
    "learningScene": "반복되는 원인을 검증 사례로 남김",
    "action": "실제 상태와 도입된 위험이 일치할 때만",
    "counterexample": "사업 owner와 개발 직무를 입력 없이 동시에 생성하지 않음",
    "distinctFromOtherParagraphs": "직무가 다른 후보는 자동 결합하지 않는 회수",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "사업 owner와 개발 직무를 입력 없이 동시에 생성하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH08.P3:career-drive-repeat-fire",
      "ckr:material:CH04.P3:take-back-work"
    ],
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
    "id": "ckr:material:CH09.P2:guard-boundary-isolation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "readerQuestion": "내가 반드시 조심해야 할 것",
    "researchKind": "recall",
    "coreMeaning": "집중 경계를 지키며 다른 전문 조건을 들을 통로 남기기",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "소개된 위험",
        "knowledge": "소개된 위험은 범위 밖 대화를 모두 닫는 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "연결 이유",
        "knowledge": "즉시 거절 비용과 장기 연결 부족을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "악화 조건",
        "knowledge": "내가 맞는 이유만 설명하며 상대 목적을 듣지 않을 때 주의",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "보완 방법",
        "knowledge": "가능한 대안과 필요한 확인을 한 가지 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
      "ckr:job:research",
      "ckr:job:software"
    ],
    "positive": "독립 판단을 더 넓은 기여로 연결할 여지",
    "risk": "협업을 무조건 시간을 빼앗는 것으로 해석",
    "factBomb": "집중 시간만 늘려도 결과의 사용 조건은 여전히 모를 수 있음",
    "twist": "짧은 질문이 긴 재작업을 줄일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석 사용자의 다음 작업 조건을 묻기"
    },
    "economicScene": "협의와 잘못된 적용의 투입 비교",
    "learningScene": "다른 영역의 질문을 설명받기",
    "action": "소개된 같은 root와 과제만 회수",
    "counterexample": "실제 갈등·고립·상대 유형을 생성하지 않음",
    "distinctFromOtherParagraphs": "경계의 새 성격이 아닌 앞선 위험의 보완 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 갈등·고립·상대 유형을 생성하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH08.P3:career-boundary-isolation",
      "ckr:material:CH04.P3:scope-refusal-cost"
    ],
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
    "id": "ckr:material:CH09.P3:strategy-photo-cycle",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "readerQuestion": "앞으로 실천할 성장 전략",
    "researchKind": "recall",
    "coreMeaning": "작은 촬영 과제에서 목적·기술·투입을 함께 검증하는 순서",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "첫 행동",
        "knowledge": "첫 행동은 사용할 목적을 정한 테스트 컷",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "장기 능력",
        "knowledge": "장기 능력은 조건에 맞게 고르고 설명하는 판단",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "일 돈 학업 연결",
        "knowledge": "새 장비보다 결과 차이와 작업 투입을 먼저 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "다른 목적에도 원리를 쓸 수 있는지 성장 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "기술과 경제 조건을 같은 과제에서 볼 여지",
    "risk": "후보 원천을 모두 한 사람의 사실로 취급",
    "factBomb": "ISFP와 ISTP 후보가 동시에 도입됐다고 가정하면 회수가 깨짐",
    "twist": "호환되는 한 후보만으로도 충분한 작은 실험 가능",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 상품 컷의 광원·선별 기준 하나씩 비교"
    },
    "economicScene": "이미 소개된 준비·보정·도구 투입만 연결",
    "learningScene": "한 조건의 변경 이유 설명",
    "action": "실제 도입된 호환 의미의 부분집합만 사용",
    "counterexample": "현재 직무·유형·분류 unknown 유지",
    "distinctFromOtherParagraphs": "새 근거 없이 일·돈·학습의 실행 순서를 추가",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 직무·유형·분류 unknown 유지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P3:grow-photo-client-fit",
      "ckr:material:CH07.P2:photo-light-comparison",
      "ckr:material:CH06.P3:tool-demand-gap"
    ],
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
    "id": "ckr:material:CH09.P3:strategy-dev-cycle",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "readerQuestion": "앞으로 실천할 성장 전략",
    "researchKind": "recall",
    "coreMeaning": "작은 구현을 검증·설명·다음 역할의 자료로 잇는 순서",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "첫 행동",
        "knowledge": "첫 행동은 요구 하나와 실패 조건 하나 정리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "장기 능력",
        "knowledge": "장기 능력은 다른 사람이 이어 쓸 결과",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "일 돈 학업 연결",
        "knowledge": "기술 학습과 제공 범위를 별도로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "새 입력에서 수행·설명 가능한 범위로 성장 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "job_seeker",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "배운 것을 선택 가능한 경력 자료로 남길 여지",
    "risk": "다른 유형의 선행 후보를 하나의 사실로 합침",
    "factBomb": "INTP 분석과 ISTP 수익 원천의 참조 풀은 동시에 적용 목록이 아님",
    "twist": "한 종류의 실제 근거로도 단계별 새 질문을 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기능의 구현·검증·인계 자료 작성"
    },
    "economicScene": "새 제작·유지·학습 투입의 차이 회수",
    "learningScene": "실패 이유와 개선 한 가지 설명",
    "action": "같은 개인·맥락에서 도입된 호환 의미만",
    "counterexample": "실전 데이터·서비스 임의 변경 금지",
    "distinctFromOtherParagraphs": "추천 직업을 다시 나열하지 않는 결과 중심 전략",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실전 데이터·서비스 임의 변경 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P3:grow-dev-maintain",
      "ckr:material:CH07.P2:dev-new-input",
      "ckr:material:CH06.P1:skill-to-use"
    ],
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
    "id": "ckr:material:CH09.P3:strategy-finance-cycle",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "readerQuestion": "앞으로 실천할 성장 전략",
    "researchKind": "recall",
    "coreMeaning": "가정 비교를 설명·기여·다음 학습 질문으로 잇기",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "첫 행동",
        "knowledge": "첫 행동은 같은 숫자의 다른 기간·가정 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "장기 능력",
        "knowledge": "장기 능력은 판단에 쓰일 정확한 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "일 돈 학업 연결",
        "knowledge": "분석 결과와 관찰한 기여를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "새 가정에서도 비교 이유를 설명하는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "전문성을 실제 역할과 연결할 여지",
    "risk": "보고서를 늘리는 것을 전략으로 삼음",
    "factBomb": "같은 숫자를 여러 장에서 반복해도 판단 질문이 늘지는 않음",
    "twist": "짧은 차이 설명이 다음 학습의 빈틈을 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 전망 하나의 확인·설명·후속 질문을 작성"
    },
    "economicScene": "이미 소개된 검토·재질의·학습 투입 회수",
    "learningScene": "다른 가정의 시나리오 비교",
    "action": "실제 도입된 ISTJ 의미와 현재 역할 확인",
    "counterexample": "보상·회사 절감·승진 결과를 보장하지 않음",
    "distinctFromOtherParagraphs": "앞선 자료의 반복이 아닌 적용 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "보상·회사 절감·승진 결과를 보장하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P3:grow-finance-communication",
      "ckr:material:CH06.P2:employee-contribution",
      "ckr:material:CH07.P2:finance-scenario-learning"
    ],
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
    "id": "ckr:material:CH09.P3:strategy-cafe-cycle",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "readerQuestion": "앞으로 실천할 성장 전략",
    "researchKind": "recall",
    "coreMeaning": "운영 한 구간의 품질·부담을 비교해 다음 시도를 고르기",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "첫 행동",
        "knowledge": "첫 행동은 가상 또는 실제 제공된 단계 자료를 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "장기 능력",
        "knowledge": "장기 능력은 반복할 기준과 바꿀 방법을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "일 돈 학업 연결",
        "knowledge": "매출 합계 대신 투입·대기·품질을 따로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "다음에도 감당할 범위가 보이는지 성장 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:PERSISTENCE:repeat-practice",
        "axis": "PERSISTENCE",
        "definition": "정한 연습을 반복",
        "condition": "피드백을 받을 수 있는 과제",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "self_employed"
    ],
    "detailJobRefs": [
      "ckr:job:cafe"
    ],
    "positive": "운영 학습을 작은 선택으로 만들 여지",
    "risk": "많은 개선을 동시에 적용",
    "factBomb": "변경 원인을 구분하지 못하면 잘된 결과도 재현하기 어려움",
    "twist": "하나만 바꾼 작은 시도가 더 많은 정보를 줄 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 메뉴 준비 순서 한 개를 바꾸는 비교"
    },
    "economicScene": "기존 자원 의미만 회수하며 금액 생성 금지",
    "learningScene": "외부 조건과 변경한 조건을 분리",
    "action": "같은 실제 root·상태의 도입 여부 확인",
    "counterexample": "이익 개선·단골 증가·사업 확장 예언 금지",
    "distinctFromOtherParagraphs": "돈 관리·강점 반복이 아닌 운영 학습의 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "이익 개선·단골 증가·사업 확장 예언 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P2:current-cafe-flow",
      "ckr:material:CH06.P2:cafe-unit-value",
      "ckr:material:CH08.P4:positive-to-repeat-system"
    ],
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
    "id": "ckr:material:CH09.P3:strategy-context-before-plan",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "readerQuestion": "앞으로 실천할 성장 전략",
    "researchKind": "recall",
    "coreMeaning": "현재 조건을 확인한 뒤 부담 낮은 배움을 선택하는 순서",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "첫 행동",
        "knowledge": "첫 행동은 지금 사실과 탐색 의도를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "장기 능력",
        "knowledge": "장기 능력은 다시 해볼 수 있는 과제를 찾는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "일 돈 학업 연결",
        "knowledge": "생활·준비 자원을 실제 입력으로만 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "해본 뒤 흥미·부담·필요 지원을 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
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
    "jobStatuses": [
      "homemaker",
      "unemployed",
      "other",
      ""
    ],
    "detailJobRefs": [],
    "positive": "개인 속도에 맞는 탐색의 여지",
    "risk": "서로 다른 상태에 같은 계획을 강요",
    "factBomb": "좋은 전략도 지금 가능한 자원이 없으면 적용되지 않음",
    "twist": "중단할 기준을 정하면 시도를 더 구체적으로 고를 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 짧은 과제 뒤 다시 할 범위 기록"
    },
    "economicScene": "생활·학습·외부 도움은 확인된 자료만 회수",
    "learningScene": "입문 과제의 도움받은 부분 확인",
    "action": "원래 상태별 프로필을 먼저 적용",
    "counterexample": "미입력에 가족·질병·실업 원인 생성 금지",
    "distinctFromOtherParagraphs": "새 인생 계획이 아닌 확인 가능한 다음 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "미입력에 가족·질병·실업 원인 생성 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P4:next-unknown-question",
      "ckr:material:CH07.P4:career-change-learning"
    ],
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
    "id": "ckr:material:CH09.P4:closing-precision-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "readerQuestion": "마지막 메시지",
    "researchKind": "recall",
    "coreMeaning": "소개된 정확성을 중요한 차이를 실제로 바꾸는 원칙으로 마무리",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "소개된 강점",
        "knowledge": "앞서 소개한 강점만 짧게 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "긍정 가능성",
        "knowledge": "좋은 가능성은 조건을 확인하고 수정할 수 있을 때",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 원칙",
        "knowledge": "모든 흠보다 다음 판단을 바꾸는 차이에 집중",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "개인별 마무리",
        "knowledge": "개인의 실제 근거가 있을 때만 선택 가능한 결론",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
    "positive": "작은 차이를 공동의 가치로 남길 여지",
    "risk": "마무리에 새로운 천직·성과를 추가",
    "factBomb": "끝 문장이 매력적이어도 새 사실을 만들 권한은 없음",
    "twist": "작은 기준이 큰 직함보다 오래 쓸 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 다음 선택에서 자료·권한을 한 번 묻기"
    },
    "economicScene": "확인한 투입·기여만 회수",
    "learningScene": "부족한 기준을 배울 질문으로 남김",
    "action": "도입된 주소와 같은 underlying fact만 사용",
    "counterexample": "새 명리·MBTI·기간 사실 추가 금지",
    "distinctFromOtherParagraphs": "업무 정체성 반복이 아닌 기억할 판단 원칙",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "새 명리·MBTI·기간 사실 추가 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH02.P1:detect-mismatch",
      "ckr:material:CH09.P1:choose-task-rights"
    ],
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
    "id": "ckr:material:CH09.P4:closing-creative-purpose",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "readerQuestion": "마지막 메시지",
    "researchKind": "recall",
    "coreMeaning": "소개된 표현의 힘을 목적과 사용 가능한 결과의 원칙으로 마무리",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "소개된 강점",
        "knowledge": "실제로 소개한 창작 의미만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "긍정 가능성",
        "knowledge": "좋은 가능성은 비교할 결과를 완성할 때",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 원칙",
        "knowledge": "새로움과 쓰임을 함께 남기는 원칙",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "개인별 마무리",
        "knowledge": "개인에게 도입된 범위 안의 긍정으로 마무리",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer",
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:photography",
      "ckr:job:brand_design"
    ],
    "positive": "선택지를 현실 결과로 만들 여지",
    "risk": "마지막에 작가·사진가 천직을 새로 확정",
    "factBomb": "아름다운 한 줄도 실제 숙련을 증명하지 않음",
    "twist": "제약이 있어도 자신만의 선택을 설명할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 다음 과제에서 사용할 목적 먼저 확인"
    },
    "economicScene": "이미 소개한 제작·수정 투입만 회수",
    "learningScene": "같은 목적의 작은 결과 비교",
    "action": "상태가 다른 선행 후보는 제외",
    "counterexample": "없는 고객·수익·경력 생성 금지",
    "distinctFromOtherParagraphs": "직업 이름이 아닌 결과를 고르는 원칙",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "없는 고객·수익·경력 생성 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH02.P1:make-alternative",
      "ckr:material:CH09.P1:choose-freelance-purpose"
    ],
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
    "id": "ckr:material:CH09.P4:closing-depth-use",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "readerQuestion": "마지막 메시지",
    "researchKind": "recall",
    "coreMeaning": "소개된 깊이를 사용할 답과 정직한 한계의 원칙으로 마무리",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "소개된 강점",
        "knowledge": "앞서 도입된 탐구 의미만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "긍정 가능성",
        "knowledge": "좋은 가능성은 다른 사람이 판단을 이어갈 때",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 원칙",
        "knowledge": "이해한 범위와 남은 질문을 같이 남기는 원칙",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "개인별 마무리",
        "knowledge": "실제 개인 근거의 범위 안에서 결론",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
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
    "positive": "깊은 생각이 공동의 선택에 쓰일 여지",
    "risk": "새 통찰력·지능·전문가 지위를 추가",
    "factBomb": "어려운 표현이 더 깊은 결론의 증거는 아님",
    "twist": "모르는 한 조건이 다음의 좋은 질문",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 조사 결과에서 이번 답과 후속 질문을 분리"
    },
    "economicScene": "이미 소개한 조사·사용 투입 회수",
    "learningScene": "반례를 설명하는 과제",
    "action": "실제 도입된 호환 의미만 선택",
    "counterexample": "원천 후보의 여러 MBTI를 한 사람에게 합치지 않음",
    "distinctFromOtherParagraphs": "CH01 탐구 성격을 반복하지 않는 마무리 기준",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "원천 후보의 여러 MBTI를 한 사람에게 합치지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH02.P1:causal-model",
      "ckr:material:CH09.P2:guard-depth-delay"
    ],
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
    "id": "ckr:material:CH09.P4:closing-help-sustainable",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "readerQuestion": "마지막 메시지",
    "researchKind": "recall",
    "coreMeaning": "소개된 도움을 상대의 다음 행동과 지속 범위의 원칙으로 마무리",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "소개된 강점",
        "knowledge": "실제 소개된 지원 기능만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "긍정 가능성",
        "knowledge": "좋은 가능성은 상대도 스스로 할 여지가 있을 때",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 원칙",
        "knowledge": "도움을 대신함과 필요한 연결을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "개인별 마무리",
        "knowledge": "도입된 같은 유형·맥락일 때만 개인화",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
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
      "ckr:job:teaching",
      "ckr:job:customer_support"
    ],
    "positive": "배려를 지속 가능한 전문 기여로 남길 여지",
    "risk": "ISFJ와 ENFJ 선행 풀을 동시에 사실로 회수",
    "factBomb": "좋은 말의 결합도 실제 원천이 다른 사람이면 맞지 않음",
    "twist": "한 가지 소개된 의미로도 충분히 구체적인 끝맺음 가능",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 지원의 종료와 다음 도움 통로를 확인"
    },
    "economicScene": "이미 소개된 지원·준비 투입만 회수",
    "learningScene": "혼자 할 수 있는 단계 확인",
    "action": "호환되는 선행 부분집합을 선택",
    "counterexample": "실제 조력·인정·건강 상태 생성 금지",
    "distinctFromOtherParagraphs": "새로운 좋은 성격이 아닌 도움의 선택 원칙",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 조력·인정·건강 상태 생성 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH02.P2:care-distinct",
      "ckr:material:CH09.P2:guard-help-responsibility"
    ],
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
    "id": "ckr:material:CH09.P4:closing-self-chosen-scope",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "readerQuestion": "마지막 메시지",
    "researchKind": "recall",
    "coreMeaning": "입력이 부족해도 없는 현재를 만들지 않는 탐색 원칙으로 마무리",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "소개된 강점",
        "knowledge": "실제로 도입된 상태 질문만 회수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "긍정 가능성",
        "knowledge": "좋은 가능성은 확인 가능한 작은 경험을 늘리는 데",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 원칙",
        "knowledge": "지금 사실과 원하는 다음을 구분하는 원칙",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "개인별 마무리",
        "knowledge": "다른 상태의 의미를 합치지 않고 끝맺음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "",
      "other",
      "homemaker",
      "unemployed"
    ],
    "detailJobRefs": [],
    "positive": "자신의 조건으로 선택을 좁힐 여지",
    "risk": "미입력을 무능력이나 무직으로 결론",
    "factBomb": "정보가 없다는 사실은 가능성이 없다는 뜻이 아님",
    "twist": "모른다고 남긴 질문이 나중의 정확한 선택을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 관심 과제 하나의 범위를 정하는 장면"
    },
    "economicScene": "확인되지 않은 경제 숫자 없이 자원 질문만 회수",
    "learningScene": "부담 낮은 과제와 중단 기준",
    "action": "실제 도입된 상태 후보와 일치 확인",
    "counterexample": "직업·가족·소득·건강·이전 경험 보충 금지",
    "distinctFromOtherParagraphs": "새 사실 없는 통합과 현실적인 선택 여지",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직업·가족·소득·건강·이전 경험 보충 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": false
    },
    "missingMbti": "withhold_mbti_and_fusion_no_invented_type",
    "unknownBirthTime": "no_synthetic_hour_recheck_actual_support",
    "precedingMeaningRefs": [
      "ckr:material:CH05.P1:status-empty",
      "ckr:material:CH09.P3:strategy-context-before-plan"
    ],
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
