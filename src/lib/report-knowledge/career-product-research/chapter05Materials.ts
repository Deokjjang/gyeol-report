/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH05_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH05.P1:status-student",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "학생의 현재 과제는 전공 이름과 실제 수행을 비교하는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "학생이라고 입력한 상태만 사실로 사용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "강점은 별도 원천이 있을 때만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "수업 이해·시험·팀 과제는 다른 확인 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "작은 결과에서 흥미와 도움이 필요한 부분을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "배움의 여러 경로를 안전하게 탐색할 여지",
    "risk": "성적이나 전공 이름으로 적성을 닫을 수 있음",
    "factBomb": "많이 배운 과목과 혼자 완성한 과제는 다를 수 있음",
    "twist": "어려웠던 과제도 선호하는 역할을 알려줄 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 디자인 과제에서 조사와 제작 중 맡고 싶은 부분 비교"
    },
    "economicScene": "수업료·재료·연습 시간의 투입 구분",
    "learningScene": "새 조건의 과제를 혼자 해보기",
    "action": "현재 학습과 실제 해본 범위를 질문",
    "counterexample": "성적·전공 성취·실습 경험을 만들어내지 않음",
    "distinctFromOtherParagraphs": "CH07 학습 방법보다 현재 선택의 탐색 범위",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성적·전공 성취·실습 경험을 만들어내지 않음",
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
    "id": "ckr:material:CH05.P1:status-seeker",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "구직자의 현재 과제는 공고 요구와 보여줄 수행 근거의 연결",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "구직 상태만 현재 사실로 사용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "개인 강점은 실제 원천과 샘플로 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "같은 개발 공고도 구현·검증·운영 비중이 다름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "관심 역할의 작은 과제로 준비 질문을 좁힘",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "준비를 구체적인 결과로 바꿀 여지",
    "risk": "공고 불안을 교육 과정 추가로만 해결",
    "factBomb": "지원량이 늘어도 어떤 문제를 맡을지 모를 수 있음",
    "twist": "작은 실패를 설명할 샘플도 준비의 근거",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공고의 필수 기술 하나를 작은 구현으로 시험"
    },
    "economicScene": "준비 비용·지원 시간·생활 유지 기간은 실제 자료 필요",
    "learningScene": "완성 화면 외 선택 이유·도움받은 부분 기록",
    "action": "입문 역할과 배울 지원 조건을 묻기",
    "counterexample": "취업 기간·면접·이전 경력 추정 금지",
    "distinctFromOtherParagraphs": "CH03 가능한 직업보다 지금 보여줄 준비 자료",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "취업 기간·면접·이전 경력 추정 금지",
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
    "id": "ckr:material:CH05.P1:status-employee",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "직장인의 현재 과제는 맡은 역할과 다음 판단 범위를 구분",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "직장인 입력이 있을 때 조직 용어 허용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "개인 근거는 직무 수행 자료와 별도로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 재무 역할이 보고 작성에서 가정 검토로 넓어지는 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "업무량 증가와 판단권 확대를 다르게 평가",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
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
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "더 맡고 싶은 문제를 설명할 여지",
    "risk": "큰 직함을 얻으면 역할도 저절로 좋아진다고 생각",
    "factBomb": "책임이 늘어도 자료와 결정권이 그대로면 부담만 커질 수 있음",
    "twist": "작은 전문 판단의 확대가 직함 변경보다 성장일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 새 역할의 권한·평가·지원 범위를 비교"
    },
    "economicScene": "보상·업무량·학습 시간을 실제 조건으로 분리",
    "learningScene": "새 판단에 필요한 분야 지식 확인",
    "action": "맡을 결과와 실제 권한을 질문",
    "counterexample": "현 회사·급여·승진 대상·상사 성격을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH04 협업보다 다음 역할의 선택 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현 회사·급여·승진 대상·상사 성격을 추정하지 않음",
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
    "id": "ckr:material:CH05.P1:status-freelancer",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "프리랜서는 제작과 계약·응대·회수의 과제를 나누어 볼 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "프리랜서와 입력한 detailJob만 현재 사실",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "촬영 능력·고객 수는 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 의뢰에서 촬영과 선별·보정·납품의 범위가 다름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "같은 고객이 다시 맡길 이유와 자신이 다시 맡을 조건을 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
    "positive": "작업의 전문성과 지속 조건을 함께 볼 여지",
    "risk": "의뢰를 받는 것 자체를 수익성으로 판단",
    "factBomb": "짧은 촬영도 긴 선별·수정·응대를 남길 수 있음",
    "twist": "범위를 명확히 묻는 것이 재의뢰 관계를 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 사진 의뢰에서 용도·수정·납품을 다른 항목으로 질문"
    },
    "economicScene": "촬영 시간 외 준비·이동·보정·응대 투입 구분",
    "learningScene": "새 기법을 작은 납품 규격에 적용",
    "action": "실제 분류 unknown을 유지하며 작업 분야부터 확인",
    "counterexample": "실제 계약·매출·포트폴리오·장비 보유를 추정하지 않음",
    "distinctFromOtherParagraphs": "단순 직업명 삽입이 아닌 독립 업무의 여러 과제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 계약·매출·포트폴리오·장비 보유를 추정하지 않음",
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
    "id": "ckr:material:CH05.P1:status-self-employed",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "자영업은 직접 제공할 품질과 반복 운영의 부담을 나눈다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "자영업 입력만 확인된 현재 맥락",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "강점·실력·매출은 별도 근거 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 메뉴 한 개가 주문·준비·정리에 다른 영향을 줌",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "고객이 다시 찾는 이유와 감당할 운영을 함께 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
    "positive": "잘하는 작업과 유지할 구조를 구별할 여지",
    "risk": "바쁜 날의 매출을 확대 근거로 바로 사용",
    "factBomb": "판매가 늘어도 준비와 폐기 뒤 남는 자원은 줄 수 있음",
    "twist": "한 메뉴를 줄이는 선택이 전체 품질을 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 카페의 인기 메뉴가 대기를 길게 만드는 상황"
    },
    "economicScene": "상품별 재료·폐기·준비·마감 투입",
    "learningScene": "작은 운영 변경의 전후를 기록",
    "action": "확대 전에 감당할 구간을 질문",
    "counterexample": "단골·현재 수익·직원·영업 이력을 만들지 않음",
    "distinctFromOtherParagraphs": "사업 운영자의 위임과 다른 직접 제공·반복 운영",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "단골·현재 수익·직원·영업 이력을 만들지 않음",
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
    "id": "ckr:material:CH05.P1:status-owner",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "사업 운영자는 개인 능력과 조직이 이어갈 방식을 구별",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "business_owner 입력이 있어도 인원 규모는 미상",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "개인 강점의 source와 실제 운영 자료를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 담당자가 모두 대표의 결정을 기다림",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "결과·방법·질문 경로를 나눠 다음 확대 판단",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
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
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:small_business"
    ],
    "positive": "직접 수행을 넘어 반복할 기준을 만들 여지",
    "risk": "매출 규모를 조직 성숙도로 오해",
    "factBomb": "대표가 더 많이 일하는 방식만으로 규모를 감당하기 어려울 수 있음",
    "twist": "일부 판단을 맡기는 것이 품질 통제의 시작일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 반복 업무의 허용 결과와 확인 지점을 적음"
    },
    "economicScene": "회수 시점·운영 지출·인력·약속의 자원 구분",
    "learningScene": "작은 위임 설명과 피드백 연습",
    "action": "직원 존재와 실제 권한을 먼저 확인",
    "counterexample": "직원·매출·법적 대표 지위를 자동 생성하지 않음",
    "distinctFromOtherParagraphs": "자영업의 직접 숙련과 다른 재현·위임 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직원·매출·법적 대표 지위를 자동 생성하지 않음",
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
    "id": "ckr:material:CH05.P1:status-homemaker",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "가사·돌봄 중심 생활에서는 현재 역할과 새 탐색을 나눈다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "입력된 상태가 다른 직업의 부재를 증명하지는 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "개인 강점은 실제 원천이 있을 때만 검토",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 생활에서 나눠 맡을 시간과 새 배움 시간이 겹침",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "무리 없는 작은 과제로 관심을 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "homemaker"
    ],
    "detailJobRefs": [],
    "positive": "현재 역할 밖의 선택을 탐색할 여지",
    "risk": "돌봄을 잘한다는 이유로 서비스 직업만 권할 수 있음",
    "factBomb": "현재 역할을 이어온 수고가 미래 역할까지 제한하지는 않음",
    "twist": "다른 과제의 즐거움을 찾는 것도 의미 있는 정보",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 생활 일정에서 짧은 학습 구간을 확보"
    },
    "economicScene": "소득이 아닌 시간·외부 도움·준비의 투입 구분",
    "learningScene": "관심 분야의 작은 입문 과제",
    "action": "역할 분담 가능성과 실제 여유를 묻기",
    "counterexample": "가족 구성·자녀·경제 의존·경력 단절을 추정하지 않음",
    "distinctFromOtherParagraphs": "무급 역할과 유료 직업 능력 증명을 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "가족 구성·자녀·경제 의존·경력 단절을 추정하지 않음",
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
    "id": "ckr:material:CH05.P1:status-resting",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "일을 쉬는 상태에서는 회복과 새 탐색의 목적을 나눈다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "unemployed를 입력했어도 쉬는 이유는 미상",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "실제 성향과 몸·마음 상태는 별도 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 관심 과제를 짧게 해본 뒤 부담과 흥미를 기록",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "큰 결론보다 다시 시도 가능한 리듬을 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
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
      "unemployed"
    ],
    "detailJobRefs": [],
    "positive": "경험을 요구하지 않는 작은 탐색의 여지",
    "risk": "쉼을 모두 준비 성과로 채워야 한다고 생각",
    "factBomb": "쉬는 이유를 게으름이나 실패로 만드는 해석은 입력 밖",
    "twist": "멈출 기준을 정하면 부담 적은 시도를 고를 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 짧은 읽기·만들기 과제 후 느낌을 비교"
    },
    "economicScene": "준비 지출과 생활 유지 조건은 실제 자료 확인",
    "learningScene": "부담 없는 시간의 입문 과제",
    "action": "해본 뒤 다시 할 수 있는 범위를 질문",
    "counterexample": "질병·실직·번아웃·구직 의사를 추정하지 않음",
    "distinctFromOtherParagraphs": "구직자의 채용 준비와 다른 회복·탐색의 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "질병·실직·번아웃·구직 의사를 추정하지 않음",
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
    "id": "ckr:material:CH05.P1:status-other",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "기타 상태는 직업 틀보다 실제 맡은 과제를 먼저 묻는다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "other는 특정 경력이나 비표준 능력을 뜻하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "원천 근거와 실제 활동 설명을 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "가상 복합 역할에서 제작·응대·운영을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "다음에도 해볼 과제의 기준을 찾음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "other"
    ],
    "detailJobRefs": [],
    "positive": "직함 없이 역할을 설명할 여지",
    "risk": "애매한 상태를 원하는 직업으로 보충",
    "factBomb": "이름이 없다고 경험이 없는 것도 능력이 있는 것도 아님",
    "twist": "복합 과제를 나누면 강점이 쓰일 질문이 보일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 하루의 과제 중 다시 맡고 싶은 일을 구분"
    },
    "economicScene": "과제별 시간과 보상 유무를 별도로 질문",
    "learningScene": "모르는 기능의 작은 샘플",
    "action": "실제 하는 일과 탐색하고 싶은 일을 묻기",
    "counterexample": "실제 답변 전까지 역할·수입·고용 관계를 생성하지 않음",
    "distinctFromOtherParagraphs": "미입력과 달리 사용자가 분류 한계를 알린 상태",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 답변 전까지 역할·수입·고용 관계를 생성하지 않음",
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
    "id": "ckr:material:CH05.P1:status-empty",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "readerQuestion": "현재 상태에서의 나",
    "researchKind": "input_context",
    "coreMeaning": "직업 상태 미입력에서는 특정 현재 생활을 전제로 하지 않는다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "입력한 상태",
        "knowledge": "빈 입력은 현재 상태가 확인되지 않은 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "연결 강점",
        "knowledge": "개인 근거가 있어도 현재 회사나 공부를 만들지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "가능한 어려움",
        "knowledge": "관심 과제의 가상 비교만 제시",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "선택 기준",
        "knowledge": "입력이 더해질 때 적용할 질문을 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      ""
    ],
    "detailJobRefs": [],
    "positive": "확인된 범위 안에서 탐색할 여지",
    "risk": "기본값을 직장인으로 보충",
    "factBomb": "공통 조언에 조직 용어를 섞으면 없는 상사가 생김",
    "twist": "정확히 모른다고 남기는 것이 다음 선택을 돕는 출발",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 과제들 중 관심 있는 기능을 고르는 상황"
    },
    "economicScene": "실제 소득 대신 확인할 자원 질문만 제시",
    "learningScene": "관심 분야를 확인한 뒤 연습 과제 선택",
    "action": "상태와 실제 수행을 묻기",
    "counterexample": "미입력을 무직·학생·사업가로 바꾸지 않음",
    "distinctFromOtherParagraphs": "other와 달리 상태 정보 자체가 없음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "미입력을 무직·학생·사업가로 바꾸지 않음",
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
    "id": "ckr:material:CH05.P2:current-photo-selection",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "지금 활용할 수 있는 재능",
    "researchKind": "natal_application",
    "coreMeaning": "사진가의 현재 검토 과제는 좋은 컷과 쓸 수 있는 컷을 나누는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "현재 활용 능력",
        "knowledge": "정확성 후보를 선별 기준에 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "개인 근거",
        "knowledge": "명리 근거가 촬영 실력을 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "실제 가능한 활동",
        "knowledge": "가상 납품 규격에서 초점·사용 비율·필수 정보 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "활용 방법",
        "knowledge": "선택 이유를 설명할 견본으로 실제 활용 확인",
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
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "감각을 의뢰 목적에 맞출 여지",
    "risk": "완성도만 보고 필요한 컷을 놓칠 수 있음",
    "factBomb": "가장 멋진 사진이 의뢰인이 가장 많이 쓸 사진과 다를 수 있음",
    "twist": "과감히 뺀 컷의 이유가 전문 판단을 드러냄",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 상품 사진에서 분위기 컷과 정보 컷을 구분"
    },
    "economicScene": "선별·재선별·다른 비율 출력의 투입",
    "learningScene": "같은 사진의 용도별 선택 비교",
    "action": "실제 분야·규격을 먼저 질문",
    "counterexample": "포트폴리오·납품 이력·고객 만족을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH03 직업 가능성보다 현재 detailJob의 실제 선택 과제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "포트폴리오·납품 이력·고객 만족을 추정하지 않음",
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
    "id": "ckr:material:CH05.P2:current-finance-variance",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "지금 활용할 수 있는 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "재무기획의 현재 활용은 숫자 차이를 판단 질문으로 바꾸는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "현재 활용 능력",
        "knowledge": "검토 성향을 기간과 가정 비교에 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "개인 근거",
        "knowledge": "원천 성향과 실제 재무 숙련은 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "실제 가능한 활동",
        "knowledge": "가상 계획과 실적의 차이를 기준 차이와 실제 변화로 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "활용 방법",
        "knowledge": "다른 부서가 설명할 수 있는 자료로 활용 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f25b06eb266a5bc7f915"
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
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "숫자의 의미를 명확히 할 여지",
    "risk": "모든 차이를 계산 오류로 취급",
    "factBomb": "맞는 숫자도 다른 기간이면 잘못된 판단을 만들 수 있음",
    "twist": "작은 기준 설명이 복잡한 보고보다 유용할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 전망표의 회수 시점 차이를 표시"
    },
    "economicScene": "분석 시간과 결정에 필요한 정보의 균형",
    "learningScene": "가정을 바꾼 시나리오 비교",
    "action": "원자료·집계 조건·사용할 결정을 확인",
    "counterexample": "실제 회사의 성과나 보상 기록을 생성하지 않음",
    "distinctFromOtherParagraphs": "현재 기능의 과제이며 다른 직무 추천이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 회사의 성과나 보상 기록을 생성하지 않음",
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
    "id": "ckr:material:CH05.P2:current-design-student",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "지금 활용할 수 있는 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "디자인 학생은 기법을 배운 것과 전달 목적을 푼 것을 나눈다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "현재 활용 능력",
        "knowledge": "실습 선호를 같은 요구의 대안 제작에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "개인 근거",
        "knowledge": "과제 수행과 상업 납품은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "실제 가능한 활동",
        "knowledge": "가상 시안의 작은 화면 적용에서 정보 손실을 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "활용 방법",
        "knowledge": "선택 이유와 바꾼 항목을 학습 근거로 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a78eebeaa12bff33d79b"
    ],
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
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "학습한 도구를 목적에 연결할 여지",
    "risk": "기법이 화려한 결과만 모을 수 있음",
    "factBomb": "완성 화면이 좋아도 어떤 문제를 풀었는지 설명이 비어 있을 수 있음",
    "twist": "단순한 시안이 더 분명한 전달을 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 과제의 한 문구를 다른 매체로 옮기기"
    },
    "economicScene": "재료·도구 비용과 연습 시간 구분",
    "learningScene": "초고와 수정 후 읽기 차이 비교",
    "action": "실제 전공 과제 범위에서 작은 검증",
    "counterexample": "고객·판매·수익을 이미 경험했다고 쓰지 않음",
    "distinctFromOtherParagraphs": "CH07 일반 공부법과 달리 현재 전공 적용 과제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객·판매·수익을 이미 경험했다고 쓰지 않음",
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
    "id": "ckr:material:CH05.P2:current-cafe-flow",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "지금 활용할 수 있는 재능",
    "researchKind": "natal_application",
    "coreMeaning": "카페 운영은 상품 품질과 주문 흐름의 다른 과제를 본다",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "현재 활용 능력",
        "knowledge": "기존 자원 의미를 운영 단계에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "개인 근거",
        "knowledge": "원국 근거가 실제 매출·관리 능력은 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "실제 가능한 활동",
        "knowledge": "가상 메뉴 추가로 준비와 대기 구간이 달라짐",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "활용 방법",
        "knowledge": "작은 변경에서 품질과 마감 부담을 함께 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ed5b09b1f8185708cd"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      },
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
    "positive": "반복 운영의 제약을 찾을 여지",
    "risk": "개인 작업 속도만 문제라고 생각",
    "factBomb": "내 손이 빨라도 준비 순서가 꼬이면 전체 대기는 길 수 있음",
    "twist": "상품 수를 줄이는 선택이 고객 경험을 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 바쁜 시간의 주문·제공·정리 흐름을 표시"
    },
    "economicScene": "재료·폐기·준비·마감 투입",
    "learningScene": "일정 구간만 바꿔 결과를 비교",
    "action": "고객 수보다 막히는 단계부터 질문",
    "counterexample": "실제 가게·매출·단골·인력 보유는 미확인",
    "distinctFromOtherParagraphs": "현재 운영 개선과 CH06 경제 계산의 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 가게·매출·단골·인력 보유는 미확인",
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
    "id": "ckr:material:CH05.P2:current-care-record",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "readerQuestion": "지금 활용할 수 있는 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "돌봄 직무의 현재 활용은 관찰을 이어갈 수 있는 기록으로 남기는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "현재 활용 능력",
        "knowledge": "관찰 원천을 허용된 인계 기능에 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "개인 근거",
        "knowledge": "실제 자격과 권한은 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "실제 가능한 활동",
        "knowledge": "가상 기록에서 변화 사실과 해석을 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "활용 방법",
        "knowledge": "다음 담당자가 확인할 질문을 찾도록 전달",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "9a241cbad4de6e655789"
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
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:care"
    ],
    "positive": "개인의 세심함을 공동의 작업으로 남길 여지",
    "risk": "개인 기억에만 의존해 기록을 미룸",
    "factBomb": "많이 챙겨도 다음 사람이 모르면 도움이 끊길 수 있음",
    "twist": "기록이 불완전함을 드러내도 재확인의 출발이 됨",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "익명 가상 인계의 미확인 칸을 표시"
    },
    "economicScene": "확인·인계·후속 응대 투입을 운영 과제로 봄",
    "learningScene": "기록 문장을 사실과 추론으로 나누기",
    "action": "허용 업무 범위에서만 검토",
    "counterexample": "진단·치료·대상자 건강을 추정하지 않음",
    "distinctFromOtherParagraphs": "현재 직무 과제로 일반 돌봄 성격 해석과 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "진단·치료·대상자 건강을 추정하지 않음",
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
    "id": "ckr:material:CH05.P3:grow-photo-client-fit",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "앞으로 성장할 수 있는 부분",
    "researchKind": "mbti_application",
    "coreMeaning": "작품 취향과 의뢰 목적을 함께 설명하는 전문성",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 촬영 기술 외 목적 확인과 선택 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "취향의 서비스 가치 원천은 실제 시장 수요와 별개",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 사진에서 분위기와 필수 정보를 다르게 선택",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "처음보다 정확히 묻고 고를 수 있는지 성장 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f23be8c338fde8896938"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
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
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "의뢰 조건에 맞는 판단을 설명할 여지",
    "risk": "자기 스타일을 모든 목적에 적용",
    "factBomb": "좋아하는 결과만 보여주면 다양한 사용 조건은 비어 있을 수 있음",
    "twist": "고객의 구체적 제약이 새로운 표현 실험을 도울 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 의뢰의 광고·기록 두 용도를 나눔"
    },
    "economicScene": "용도별 사용 범위·수정·선별 투입",
    "learningScene": "같은 장면을 다른 목적 기준으로 비교",
    "action": "분야와 실제 필요한 납품 규격을 확인",
    "counterexample": "스타일·고객층·포트폴리오 존재를 만들지 않음",
    "distinctFromOtherParagraphs": "CH07 기술 습득보다 제공 범위와 판단의 성장",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "스타일·고객층·포트폴리오 존재를 만들지 않음",
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
    "id": "ckr:material:CH05.P3:grow-dev-maintain",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "앞으로 성장할 수 있는 부분",
    "researchKind": "mbti_application",
    "coreMeaning": "혼자 구현하는 능력에서 다른 사람이 유지할 결과로 발전",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "발전 능력",
        "knowledge": "새 기능 외 재현·설명·검증 능력을 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "원천의 모델 제품 연결은 실제 운영 이력 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 기능을 다른 사람이 바꾸려 할 때 필요한 정보를 남김",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "도움 없이 이어 수정할 수 있는지로 성장 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "81f5a3a397cd43e89959"
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
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
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
    "positive": "개인 구현이 협업 결과로 넓어질 여지",
    "risk": "코드를 작성한 양만 성장 지표로 봄",
    "factBomb": "설명이 없는 빠른 구현은 다음 변경을 어렵게 할 수 있음",
    "twist": "작은 검증과 이유 기록이 큰 기능보다 신뢰를 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 변경 전후 테스트와 제외한 안을 적음"
    },
    "economicScene": "유지·질문·추가 구현 투입 구분",
    "learningScene": "처음 보는 사람이 따라갈 문서 연습",
    "action": "혼자 한 부분과 다른 사람 도움이 필요한 부분 분리",
    "counterexample": "실제 경력·운영 경험 생성 금지",
    "distinctFromOtherParagraphs": "다음 직급이 아니라 수행 범위의 성장",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 경력·운영 경험 생성 금지",
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
    "id": "ckr:material:CH05.P3:grow-finance-communication",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "앞으로 성장할 수 있는 부분",
    "researchKind": "mbti_application",
    "coreMeaning": "정확한 자료를 다른 부서가 판단할 설명으로 발전",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 숫자를 만드는 것과 읽게 하는 것의 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "정확성 원천이 설명 숙련까지 자동 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 보고에서 무엇을 결정할지 먼저 요약",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "질문이 자료에서 확인할 수준으로 좁혀졌는지 봄",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f25b06eb266a5bc7f915"
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "분석이 실제 선택에 쓰일 여지",
    "risk": "설명을 줄이면서 중요한 가정까지 지움",
    "factBomb": "보기 쉬운 한 장도 조건이 빠지면 오해를 키움",
    "twist": "불확실성을 짧게 적는 것이 설명의 신뢰를 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 전망의 가정·확인 사실·결정 필요를 분리"
    },
    "economicScene": "추가 회의와 재질의의 투입 차이",
    "learningScene": "숫자 하나를 비전문가의 질문으로 설명",
    "action": "결정자가 필요한 비교 질문을 먼저 확인",
    "counterexample": "현재 보상·인정·승진으로 연결됐다고 말하지 않음",
    "distinctFromOtherParagraphs": "CH02 재능 소개보다 실제 역할을 넓힐 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 보상·인정·승진으로 연결됐다고 말하지 않음",
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
    "id": "ckr:material:CH05.P3:grow-teaching-transfer",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "앞으로 성장할 수 있는 부분",
    "researchKind": "mbti_application",
    "coreMeaning": "같은 설명을 늘리는 대신 다른 조건의 학습 전이를 확인",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 이해 반응과 혼자 수행의 차이를 보는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "사람 성장 원천은 실제 성적 효과를 보장하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 학습자가 예제는 풀지만 새 조건에서 막힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "오류 이유에 맞는 다른 과제를 제시",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "746762687f99d3e36684"
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
    "positive": "지원의 깊이를 늘릴 여지",
    "risk": "도움을 더 많이 주는 방향으로만 성장",
    "factBomb": "준비 자료가 늘어도 학습자가 혼자 할 범위는 그대로일 수 있음",
    "twist": "도움을 줄여 확인하는 단계가 좋은 교육의 정보",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 같은 원리의 조건 다른 문제를 준비"
    },
    "economicScene": "수업·채점·개별 질문 투입",
    "learningScene": "오개념별 다른 피드백 연습",
    "action": "전이 과제의 반응을 확인",
    "counterexample": "시험 성적·합격·이해 증가를 입력 없이 단정하지 않음",
    "distinctFromOtherParagraphs": "CH07 고객 자신의 공부와 다른 교육 업무 전문성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "시험 성적·합격·이해 증가를 입력 없이 단정하지 않음",
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
    "id": "ckr:material:CH05.P3:grow-owner-question",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "readerQuestion": "앞으로 성장할 수 있는 부분",
    "researchKind": "mbti_application",
    "coreMeaning": "위임한 결과를 질문으로 확인하는 운영 능력",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 직접 수정 전에 상대 판단을 듣는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "협업 위임 원천과 실제 인력 상황을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 담당자가 다른 방법으로 같은 결과를 냄",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "성장 확인",
        "knowledge": "반드시 지킬 기준과 자유로운 방법을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "47ce8c7dff225ae9a200"
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
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:small_business"
    ],
    "positive": "대표 개입을 줄일 수 있는 학습 여지",
    "risk": "다른 방식의 결과를 틀린 것으로 취급",
    "factBomb": "내 방식만 답이면 위임이 승인 대기로 되돌아감",
    "twist": "다른 풀이가 운영의 선택지를 넓힐 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 중간 결과에서 이유와 남은 위험을 묻기"
    },
    "economicScene": "대기·재설명·확인 투입",
    "learningScene": "결과를 보고 질문할 기준 만들기",
    "action": "권한 범위 안에서 작은 확인 방식 시험",
    "counterexample": "직원과 조직이 없으면 가상의 예시로만 유지",
    "distinctFromOtherParagraphs": "개인 리더 성격보다 운영의 학습 구조",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직원과 조직이 없으면 가상의 예시로만 유지",
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
    "id": "ckr:material:CH05.P4:next-photo-brief",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "다음 선택을 위한 전략",
    "researchKind": "input_context",
    "coreMeaning": "다음 의뢰의 기준은 좋은 결과와 감당할 조건이 함께 남는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "상태별 우선순위",
        "knowledge": "우선순위는 촬영 목적과 납품·수정 범위 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "성급한 판단",
        "knowledge": "반가운 의뢰를 즉시 수익으로 확정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "작은 시도",
        "knowledge": "가상 견적 전 준비·촬영·보정·사용 조건을 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "다음 단계 기준",
        "knowledge": "서로 확인할 자료가 생기면 다음 합의로 넘어감",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
    "positive": "범위가 분명한 작업을 고를 여지",
    "risk": "경험을 쌓으려 모든 추가 요구를 무료로 수락",
    "factBomb": "한 번의 의뢰가 많아 보여도 다른 약속을 밀 수 있음",
    "twist": "조건을 묻는 태도가 신뢰의 출발이 될 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 의뢰 하나에 필수 질문 다섯 개 작성"
    },
    "economicScene": "작업 시간·이동·사용 범위·수정 횟수 구분",
    "learningScene": "작은 테스트로 납품 가능한 수준 확인",
    "action": "분류 미지원이므로 실제 작업 분야를 먼저 확인",
    "counterexample": "계약 이력·단가·고객 수 보장 금지",
    "distinctFromOtherParagraphs": "CH03 후보가 아닌 현재 프리랜서의 다음 과업 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "계약 이력·단가·고객 수 보장 금지",
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
    "id": "ckr:material:CH05.P4:next-employee-role",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "다음 선택을 위한 전략",
    "researchKind": "input_context",
    "coreMeaning": "다음 역할은 직함보다 맡을 판단·자료·권한을 비교",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "상태별 우선순위",
        "knowledge": "우선순위는 실제 해결할 문제와 지원 조건 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "성급한 판단",
        "knowledge": "큰 이름이 곧 성장이라는 성급한 결론을 피함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "작은 시도",
        "knowledge": "가상 새 역할에서 자료 접근과 평가 범위를 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "다음 단계 기준",
        "knowledge": "책임과 권한이 같이 바뀌는지 보고 판단",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "선택의 실제 내용을 볼 여지",
    "risk": "보상 숫자 하나로 모든 조건을 합침",
    "factBomb": "많은 일감이 더 중요한 판단을 맡는 것과 같지는 않음",
    "twist": "작은 전문 영역의 확장이 유용한 다음 단계일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 이직 공고에서 판단 대상과 필요한 지원 비교"
    },
    "economicScene": "보상·추가 시간·배울 기회를 각각 확인",
    "learningScene": "새 역할의 부족한 지식 확인",
    "action": "실제 조건을 받은 뒤 비교",
    "counterexample": "이직·연봉 결과를 예측하거나 실제 회사 정보를 만들지 않음",
    "distinctFromOtherParagraphs": "CH04 문화보다 다음 역할 제안의 비교",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "이직·연봉 결과를 예측하거나 실제 회사 정보를 만들지 않음",
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
    "id": "ckr:material:CH05.P4:next-seeker-sample",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "다음 선택을 위한 전략",
    "researchKind": "input_context",
    "coreMeaning": "구직자의 작은 시도는 공고를 실제 과제로 바꾸는 것",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "상태별 우선순위",
        "knowledge": "우선순위는 관심 역할 하나의 필수 과제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "성급한 판단",
        "knowledge": "준비가 완벽해질 때까지 지원을 미루는 선택 점검",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "작은 시도",
        "knowledge": "가상 작은 구현에서 요구·결과·실패 조건 기록",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "다음 단계 기준",
        "knowledge": "혼자 해낸 범위와 필요한 지원이 보여야 다음 단계",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "준비를 설명할 자료로 남길 여지",
    "risk": "모든 기술을 배운 뒤에만 자격이 있다고 생각",
    "factBomb": "과정 수가 늘어도 같은 샘플을 끝내지 못할 수 있음",
    "twist": "작은 미완성의 이유도 배울 질문을 구체화",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공고 한 항목에 작은 작업 샘플 대응"
    },
    "economicScene": "교육비·연습·지원 준비 투입 분리",
    "learningScene": "새 입력에서 동작을 확인",
    "action": "준비 조건과 실제 채용 요건을 대조",
    "counterexample": "채용·합격·기간 보장 금지",
    "distinctFromOtherParagraphs": "성향 추천이 아닌 지금 준비의 검증 단위",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "채용·합격·기간 보장 금지",
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
    "id": "ckr:material:CH05.P4:next-cafe-test",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "다음 선택을 위한 전략",
    "researchKind": "input_context",
    "coreMeaning": "운영 확대 전 작은 구간을 바꿔 감당할 부담을 확인",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "상태별 우선순위",
        "knowledge": "우선순위는 한 메뉴나 한 시간대의 문제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "성급한 판단",
        "knowledge": "바쁜 하루를 전체 확대의 답으로 보지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "작은 시도",
        "knowledge": "가상 준비량 조정에서 품질과 마감 시간을 같이 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "다음 단계 기준",
        "knowledge": "같은 부담을 반복할 수 있는지 다음 기준",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
    "positive": "지속 가능한 운영을 탐색할 여지",
    "risk": "새 상품을 더하는 방식으로만 개선",
    "factBomb": "선택지가 늘어도 준비·정리의 부담이 더 커질 수 있음",
    "twist": "하나를 빼는 시도가 좋은 경험을 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 메뉴 하나의 준비량만 조정"
    },
    "economicScene": "재료·폐기·대기·마감 투입",
    "learningScene": "변경한 한 조건과 다른 외부 요인 구분",
    "action": "실제 자료가 있는 작은 범위만 비교",
    "counterexample": "매출 증가·이익 개선을 보장하지 않음",
    "distinctFromOtherParagraphs": "CH06 비용 원리보다 다음 운영 선택의 실험",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "매출 증가·이익 개선을 보장하지 않음",
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
    "id": "ckr:material:CH05.P4:next-unknown-question",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "readerQuestion": "다음 선택을 위한 전략",
    "researchKind": "input_context",
    "coreMeaning": "상태 정보가 부족하거나 전환 중이면 선택할 과제를 먼저 확인",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "상태별 우선순위",
        "knowledge": "우선순위는 현재 사실과 탐색 의도를 나누기",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "성급한 판단",
        "knowledge": "회사·사업·취업 의사를 기본값으로 보충하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "작은 시도",
        "knowledge": "가상 관심 과제의 부담과 흥미를 짧게 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "다음 단계 기준",
        "knowledge": "다시 해보고 싶은 범위를 확인한 뒤 다음 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "079248d9db39848db6cd"
    ],
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
      "unemployed",
      "homemaker"
    ],
    "detailJobRefs": [],
    "positive": "강요 없는 탐색을 남길 여지",
    "risk": "모든 사람에게 같은 경력 계획을 요구",
    "factBomb": "현재의 맥락이 다른데 같은 실행량을 권하면 부담을 만들 수 있음",
    "twist": "하지 않을 일을 아는 것도 다음 선택의 정보",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 과제 두 개 중 하나를 짧게 시도하는 장면"
    },
    "economicScene": "돈·시간·외부 도움은 실제 제공된 자료만 확인",
    "learningScene": "부담 낮은 입문과 중단 기준",
    "action": "상태별 별도 프로필의 질문을 먼저 사용",
    "counterexample": "이 상태들을 동일한 생활이라고 합치지 않음",
    "distinctFromOtherParagraphs": "공통 원리는 회수하되 상태별 질문은 별도로 유지",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "이 상태들을 동일한 생활이라고 합치지 않음",
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
