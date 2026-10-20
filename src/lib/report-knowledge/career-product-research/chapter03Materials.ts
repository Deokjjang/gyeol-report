/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH03_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH03.P1:task-not-title",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "나에게 맞는 일의 공통점",
    "researchKind": "natal_application",
    "coreMeaning": "같은 직함에서도 검토할 대상과 고칠 권한이 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "적합한 직무의 공통점",
        "knowledge": "적합성의 공통점은 중요한 조건을 대조하는 과제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "근거",
        "knowledge": "관성 근거가 있어도 실제 자격·업무 접근은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "만족 조건",
        "knowledge": "규격 검토와 재무 증빙 검토는 다른 학습이 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "직업 선택 기준",
        "knowledge": "직함 대신 실제 과제와 필요한 기준을 질문",
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
      "ckr:job:accounting",
      "ckr:job:finance"
    ],
    "positive": "같은 기능을 여러 분야에서 탐색할 여지",
    "risk": "검토라는 말만으로 모든 규정 직무를 추천할 수 있음",
    "factBomb": "다른 분야에서 꼼꼼함을 인정받아도 전문 기준은 다시 배워야 함",
    "twist": "한 직업을 고집하지 않고 기능을 따라 후보를 넓힐 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공고 두 개에서 검토 자료와 수정 권한을 비교"
    },
    "economicScene": "비교할 자료 준비와 재검토 투입 차이",
    "learningScene": "분야마다 필수 기준을 배울 방법 확인",
    "action": "하루의 과제·자료·권한을 묻기",
    "counterexample": "실제 추천 경로와 근거가 없으면 추천 순위에 삽입 불가",
    "distinctFromOtherParagraphs": "CH01 환경 조건보다 서로 다른 직무 사이의 기능 공통점",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 추천 경로와 근거가 없으면 추천 순위에 삽입 불가",
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
    "id": "ckr:material:CH03.P1:investigation-object",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "나에게 맞는 일의 공통점",
    "researchKind": "mbti_application",
    "coreMeaning": "조사 기능이 쓰이는 대상과 완료 기준을 구별",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "적합한 직무의 공통점",
        "knowledge": "원인을 묻는 관심이 어떤 대상에서 지속되는지 탐색",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "근거",
        "knowledge": "연구 선호 원천만으로 모든 분석 분야 적성 확정 불가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "만족 조건",
        "knowledge": "버그 재현과 사회 자료 분석은 다른 자료·검증을 요구",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "직업 선택 기준",
        "knowledge": "좋아하는 질문과 실제 수행할 과제를 함께 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e0f1223ff781ce157244"
    ],
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
      "ckr:job:research",
      "ckr:job:software"
    ],
    "positive": "탐구의 분야를 구체화할 여지",
    "risk": "연구라는 직함의 이미지로 수행을 상상할 수 있음",
    "factBomb": "생각할 시간이 많을 것이라는 기대가 보고·협업을 지워버릴 수 있음",
    "twist": "실무의 작은 조사도 전문 연구로 향할 질문을 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 개발 공고와 조사 공고의 산출물을 비교"
    },
    "economicScene": "조사에 쓸 시간과 사용할 결정의 차이",
    "learningScene": "대상별 자료 검증 방법을 확인",
    "action": "관심 분야의 작은 과제를 한 번 수행",
    "counterexample": "실제 전공·경험·자격을 입력 없이 채우지 않음",
    "distinctFromOtherParagraphs": "CH02 분석 능력 평가와 달리 조사 대상 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 전공·경험·자격을 입력 없이 채우지 않음",
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
    "id": "ckr:material:CH03.P1:output-audience",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "나에게 맞는 일의 공통점",
    "researchKind": "mbti_application",
    "coreMeaning": "창작 분야의 공통점은 매체보다 전달 목적과 독자",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "적합한 직무의 공통점",
        "knowledge": "만들고 싶은 것과 실제 쓰일 결과를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "근거",
        "knowledge": "창작 선호가 현재 제작 숙련을 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "만족 조건",
        "knowledge": "같은 메시지를 글·영상·시안에 옮기는 조건 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "직업 선택 기준",
        "knowledge": "사용 목적을 설명할 수 있는 작은 결과부터 탐색",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d3f1d896063ae672f97b"
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
      "ckr:job:brand_design",
      "ckr:job:writing",
      "ckr:job:video"
    ],
    "positive": "다른 제작 분야의 차이를 체험할 여지",
    "risk": "아름다운 결과를 만드는 관심만으로 직업 하루를 판단",
    "factBomb": "좋은 포트폴리오와 수정·납품의 일상은 다름",
    "twist": "제약이 명확한 의뢰가 표현을 더 구체적으로 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공고의 제작·질의·수정·인계 시간을 나눔"
    },
    "economicScene": "매체별 제작과 수정 투입 차이",
    "learningScene": "선택한 매체의 기본 기술과 피드백 확인",
    "action": "하고 싶은 매체와 감당할 작업 과정을 각각 적기",
    "counterexample": "실제 추천 근거 없는 분야를 천직으로 확정 금지",
    "distinctFromOtherParagraphs": "CH02 창작 기능보다 사용처와 직업 과정 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 추천 근거 없는 분야를 천직으로 확정 금지",
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
    "id": "ckr:material:CH03.P1:help-task-scope",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "나에게 맞는 일의 공통점",
    "researchKind": "mbti_application",
    "coreMeaning": "돕는 직무는 대상·권한·종결 기준이 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "적합한 직무의 공통점",
        "knowledge": "사람에게 도움을 주는 직업을 하나의 재능으로 묶지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "근거",
        "knowledge": "실용 도움 원천은 의료·상담 전문 권한의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "만족 조건",
        "knowledge": "교육은 이해 확인, 지원은 연결, 의료는 허용 절차를 요구",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "직업 선택 기준",
        "knowledge": "자격과 업무 범위를 먼저 확인한 뒤 작은 탐색",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d1d38d962c1cc346bc86"
    ],
    "semanticFacets": [
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
      "ckr:job:teaching",
      "ckr:job:care",
      "ckr:job:counsel_support"
    ],
    "positive": "원하는 기여의 종류를 구체화할 여지",
    "risk": "도와주기 좋아한다는 이유로 전문 분야를 확정",
    "factBomb": "좋은 의도만으로 대상자 안전과 전문 경계를 보장할 수 없음",
    "twist": "직접 해결하지 않고 적절히 연결하는 것도 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 세 공고에서 대상과 책임 종료를 비교"
    },
    "economicScene": "준비·후속 응대·지원 인계의 투입 차이",
    "learningScene": "각 분야의 필수 교육·권한 조건을 확인",
    "action": "어떤 도움과 범위를 맡고 싶은지 묻기",
    "counterexample": "자격 요건은 현재 실제 제도와 개별 공고에서 별도 확인 필요",
    "distinctFromOtherParagraphs": "CH04 관계 기술보다 도움 직무 사이의 조건 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자격 요건은 현재 실제 제도와 개별 공고에서 별도 확인 필요",
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
    "id": "ckr:material:CH03.P1:repeat-vs-search",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "readerQuestion": "나에게 맞는 일의 공통점",
    "researchKind": "natal_application",
    "coreMeaning": "반복 품질 유지와 새 수요 탐색은 다른 하루를 만든다",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "적합한 직무의 공통점",
        "knowledge": "좋아하는 과제가 유지인지 개척인지 나누기",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "근거",
        "knowledge": "정재 상징만으로 안정적 직업을 판정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "만족 조건",
        "knowledge": "매장 관리와 신규 제안은 같은 판매라도 다른 작업",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "직업 선택 기준",
        "knowledge": "반복과 변화 비중을 실제 질문으로 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ed5b09b1f8185708cd"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PERSISTENCE:repeat-practice",
        "axis": "PERSISTENCE",
        "definition": "정한 연습을 반복",
        "condition": "피드백을 받을 수 있는 과제",
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
    "positive": "직업 이름 아래 숨은 일의 비중을 알 여지",
    "risk": "안정을 변화가 없는 일로 오해할 수 있음",
    "factBomb": "반복 업무도 고객·재료·시간 조건은 달라질 수 있음",
    "twist": "작은 변화가 있는 반복이 숙련을 쌓는 좋은 환경일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 매장 공고에서 재고·응대·신규 판매의 비중 확인"
    },
    "economicScene": "재고 유지와 제안 준비의 다른 투입",
    "learningScene": "반복 작업의 예외 처리 학습",
    "action": "실제 하루에서 유지와 새 요청의 비중 묻기",
    "counterexample": "직무 이름만으로 스트레스나 만족을 예측하지 않음",
    "distinctFromOtherParagraphs": "CH05 현재 상태 전략보다 직무 구성의 탐색",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직무 이름만으로 스트레스나 만족을 예측하지 않음",
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
    "id": "ckr:material:CH03.P2:route-review-finance",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "검토 경로의 재무기획 후보를 실제 작업으로 설명",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 review일 때만 그 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "숫자 비교는 기간·가정·분류를 맞추는 과제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "정확성은 원자료를 볼 권한이 있어야 쓰임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "분야 지식과 작은 분석 자료로 적합성을 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a",
      "53113e9ff18319b22c8a"
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
      "employee",
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "판단 가능한 숫자 비교를 도울 여지",
    "risk": "정확성만으로 전망 능력을 인정할 수 있음",
    "factBomb": "표를 잘 만드는 것과 경영 질문에 답하는 것은 다름",
    "twist": "불확실한 가정을 드러내는 보고도 좋은 결과",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 실적과 계획의 차이를 가격·수량으로 나눔"
    },
    "economicScene": "원가 절감과 포기한 활동의 대가 비교",
    "learningScene": "집계 기준과 전망 가정 연습",
    "action": "실제 추천 proof와 준비할 학습을 별도 확인",
    "counterexample": "review가 실제 추천에 없으면 신규 추천으로 출력 불가",
    "distinctFromOtherParagraphs": "추천 순위가 아닌 기존 경로의 과제 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "review가 실제 추천에 없으면 신규 추천으로 출력 불가",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-investigate-dev",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "조사 경로의 개발 후보를 오류 재현과 구현으로 설명",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 investigate일 때만 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "개발은 생각뿐 아니라 코드·검증·인계를 요구",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "원인 탐구가 반복되는 문제를 좁히는 데 쓰일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "작은 구현의 실패 조건까지 확인해야 탐색이 됨",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "78ca1a3776c53c2d0b48",
      "d92063c1e7fc9ba8b4dd"
    ],
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
      "ckr:job:software"
    ],
    "positive": "설명을 작동 결과로 검증할 여지",
    "risk": "연구만 하고 사용 가능한 결과를 미룰 수 있음",
    "factBomb": "깊은 기술 관심이 협업과 유지보수를 없애주지는 않음",
    "twist": "재현한 실패는 멋진 화면보다 전문성을 보여줄 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 입력 오류를 좁혀 수정과 테스트를 남김"
    },
    "economicScene": "구현과 유지 투입을 구분",
    "learningScene": "언어·기본 자료 구조·검증 과제 확인",
    "action": "실제 경로·원천·직무 관심을 함께 대조",
    "counterexample": "기존 추천 없이는 개발자를 새 1순위로 만들지 않음",
    "distinctFromOtherParagraphs": "직함 추가가 아닌 investigate의 실제 산출물",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "기존 추천 없이는 개발자를 새 1순위로 만들지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-create-photo",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "창작 경로의 사진 분야를 촬영·선별·납품으로 구체화",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 create 후보를 사진 직무 질문에 연결하는 연구",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "목적에 맞는 장면을 촬영하고 사용할 컷을 선택",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "작품의 완성도와 의뢰인의 사용 조건을 함께 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "테스트 촬영으로 자신의 수행과 준비를 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "90e77590d3ea07930ba1",
      "ba9c4a59def3be6ff655"
    ],
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
      "employee",
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "시각적 선택을 필요한 결과로 남길 여지",
    "risk": "사진이라는 이름만으로 보정 스타일과 장비를 추정",
    "factBomb": "좋은 컷 한 장이 전체 납품의 일관성을 증명하지는 않음",
    "twist": "버린 컷의 이유가 선택 판단을 더 잘 보여줄 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 상품의 분위기 컷과 정보 컷을 가상 비교"
    },
    "economicScene": "준비·이동·선별·보정 투입의 분리",
    "learningScene": "광원 조건 하나를 바꿔 결과를 비교",
    "action": "현재 분류기 unknown을 유지하고 별도 확인 질문 남김",
    "counterexample": "사진가가 실제 추천 목록에 없다면 신규 추천 사실로 쓰지 않음",
    "distinctFromOtherParagraphs": "사진 직업명 삽입이 아닌 단계·사용처·준비 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "사진가가 실제 추천 목록에 없다면 신규 추천 사실로 쓰지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-teach-instruction",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "교육 경로의 설명·실습·피드백 기능",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 teach일 때만 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "아는 내용을 학습자가 혼자 쓰게 나누는 과제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "명리의 배움 상징과 실제 교육 선호는 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "예제 밖의 문제를 제시해 전달 효과 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fe11b875c7ad3a9c8318",
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
    "positive": "다른 사람의 수행 범위를 넓힐 여지",
    "risk": "도움을 많이 주는 것을 이해 증가로 착각",
    "factBomb": "학습자의 답을 대신 완성하면 수업 성과를 알기 어려움",
    "twist": "잠깐 기다리는 것이 배움에 필요한 지원일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 개념 설명 뒤 학습자의 풀이를 기다림"
    },
    "economicScene": "수업 외 준비·피드백 투입",
    "learningScene": "학습 목표에 맞는 과제를 설계",
    "action": "실제 추천·교육 대상·자격을 따로 확인",
    "counterexample": "교육 선호만으로 교사 자격이나 합격을 보장하지 않음",
    "distinctFromOtherParagraphs": "원국 정인과 돌봄 능력을 동일시하지 않는 teach 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "교육 선호만으로 교사 자격이나 합격을 보장하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-lead-project",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "리드 경로의 결정·역할 연결 기능",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 lead일 때만 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "막힌 결정과 책임 공백을 나누는 과제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "압박 대응 상징은 리더 직책의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "작은 과제의 권한과 완료 기준부터 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f8f90022e047bfe61557",
      "56954437569c5ef8f1f1"
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
      "ckr:job:project_planning"
    ],
    "positive": "여러 사람이 이어 일할 조건을 만들 여지",
    "risk": "빠른 결정을 다른 사람의 전문 판단보다 앞세울 수 있음",
    "factBomb": "직접 수습이 많다는 사실만으로 조정을 잘했다고 볼 수 없음",
    "twist": "다른 사람이 결정한 결과가 좋은 리더십일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 프로젝트의 보류 결정과 담당자를 나눔"
    },
    "economicScene": "결정 대기와 재작업의 투입 차이",
    "learningScene": "질문할 시점과 위임 범위 연습",
    "action": "직급이 아닌 실제 책임·권한을 질문",
    "counterexample": "실제 추천과 권한이 없으면 관리자라고 부르지 않음",
    "distinctFromOtherParagraphs": "lead를 CEO 운명으로 확장하지 않는 과제 해설",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "실제 추천과 권한이 없으면 관리자라고 부르지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-manage-admin",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "운영 경로의 반복 기준·인계 기능",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 manage일 때만 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "접수·보완·처리·기록의 흐름을 유지",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "정확한 처리에는 변경된 기준을 확인할 통로 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "가상 자료의 누락과 예외 안내를 연습",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ed5b09b1f8185708cd",
      "f25b06eb266a5bc7f915"
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
        "id": "sar:facet:PERSISTENCE:repeat-practice",
        "axis": "PERSISTENCE",
        "definition": "정한 연습을 반복",
        "condition": "피드백을 받을 수 있는 과제",
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
    "positive": "담당자가 달라도 이용자의 혼선을 줄일 여지",
    "risk": "이전 기준을 무조건 안전한 답으로 유지",
    "factBomb": "기준표가 있어도 바뀐 목적과 맞지 않으면 오류가 반복됨",
    "twist": "작은 예외 기록이 공통 절차를 더 정확하게 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 접수에서 보완할 자료만 구분"
    },
    "economicScene": "재문의와 재접수의 투입 비교",
    "learningScene": "처리 근거를 쉽게 설명하는 연습",
    "action": "실제 경로와 분야 요건을 확인",
    "counterexample": "행정이 실제 추천에 없으면 공공직 천직 주장 금지",
    "distinctFromOtherParagraphs": "manage의 직업 이름보다 흐름과 결과의 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "행정이 실제 추천에 없으면 공공직 천직 주장 금지",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-market-sales",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "시장 경로의 수요·제안·제공 조건 연결",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 market일 때만 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "관심을 실제 문제와 제공 가능 범위로 좁힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "재성 상징과 판매 선호는 실적이 아닌 연구 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "작은 제안에서 상대의 다음 판단을 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "bbc18a4e615032647a49",
      "fac606c7c6c40893bc49"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:OPPORTUNITY_SENSE:option-discovery",
        "axis": "OPPORTUNITY_SENSE",
        "definition": "새 연결에서 가능한 선택을 찾음",
        "condition": "접근 가능성과 조건 확인",
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
    "positive": "필요와 제공할 가치를 만날 여지",
    "risk": "성사 가능성을 과장하고 준비 범위를 늘릴 수 있음",
    "factBomb": "좋은 반응을 받은 제안도 승인·도입 조건은 비어 있을 수 있음",
    "twist": "확인 질문이 설득보다 거래를 현실적으로 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 고객이 좋아하지만 결정 주체가 없는 상황"
    },
    "economicScene": "사전 제안·도입 지원·미성사 투입",
    "learningScene": "조건을 나눠 비교안 만드는 연습",
    "action": "기존 market proof와 실제 업무 범위를 확인",
    "counterexample": "수입·거래 성사·사업 성공을 보장하지 않음",
    "distinctFromOtherParagraphs": "신규 직업 순위가 아닌 market의 검증할 과제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "수입·거래 성사·사업 성공을 보장하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P2:route-experience-service",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "readerQuestion": "추천 직업과 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "체험 경로의 현장 반응·다음 행동 개선",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "실제 첫 추천",
        "knowledge": "기존 첫 추천이 experience일 때만 후보를 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "추천 이유",
        "knowledge": "이용자가 어디서 멈췄는지 보고 안내를 고침",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "활용 강점",
        "knowledge": "서비스 선호가 모든 고객 관계의 적합성은 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "현실적 조건",
        "knowledge": "짧은 가상 서비스 과제로 반응을 관찰",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0447fe32a9bb113f3855"
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
      "ckr:job:customer_support"
    ],
    "positive": "직접 받은 정보를 다음 경험에 쓸 여지",
    "risk": "기분 좋은 분위기만 성과로 볼 수 있음",
    "factBomb": "웃으며 대화해도 이용자의 과제는 해결되지 않을 수 있음",
    "twist": "조용한 안내 수정이 큰 친절보다 도움이 될 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 체험 안내의 혼선 지점을 관찰"
    },
    "economicScene": "반복 질문·대기·추가 응대 투입",
    "learningScene": "관찰한 사실과 해석을 분리",
    "action": "실제 추천 경로와 서비스 범위를 확인",
    "counterexample": "외향 유형이라는 이유로 모든 접객 직무 추천 금지",
    "distinctFromOtherParagraphs": "experience를 단순 사교성으로 환원하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "외향 유형이라는 이유로 모든 접객 직무 추천 금지",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-translation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "분석 능력의 다른 후보는 언어 의미·용어 대조",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 추천에 investigate 또는 review가 있을 때 해설",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "분야 지식과 언어 수행은 각각 준비할 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "뜻을 추적하는 기능은 불명확한 원문 질의에 쓰일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "직접 번역 샘플과 원문 대조로 적합성 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e0f1223ff781ce157244"
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
      "ckr:job:translation"
    ],
    "positive": "언어 사이의 의미 차이를 설명할 여지",
    "risk": "논리적이라는 이유로 외국어 실력을 인정할 수 있음",
    "factBomb": "읽기 이해와 납품 문장의 정확성은 다름",
    "twist": "질문을 남기는 번역이 모르는 내용을 매끈하게 넘기는 것보다 정확",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 안내문의 약어가 다른 문서와 충돌"
    },
    "economicScene": "조사·질의·검수 투입을 분량과 구분",
    "learningScene": "용어표와 원문 대조 연습",
    "action": "현재 번역가 분류 unknown과 언어 기능 연구를 분리",
    "counterexample": "실제 추천·언어 능력·분야 조건 없으면 추천 확정 불가",
    "distinctFromOtherParagraphs": "개발 분석과 다른 언어 대상·산출물",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 추천·언어 능력·분야 조건 없으면 추천 확정 불가",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-video",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "콘텐츠 후보에서 영상의 이야기와 출력 조건 구별",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 create 또는 experience 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "구성·소재·편집·출력 규격은 다른 준비",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "메시지를 장면 순서로 만드는 기능을 시험",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "짧은 편집 과제와 피드백으로 실제 흥미 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "428155544a315487e6a6"
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
      "ckr:job:video"
    ],
    "positive": "독자와 다른 시청 경험을 설계할 여지",
    "risk": "영상 선호를 촬영·편집 모든 능력으로 합침",
    "factBomb": "짧은 결과물도 원본 정리와 렌더링 시간이 필요함",
    "twist": "분량을 줄이는 선택이 메시지를 더 명확하게 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 긴 강의를 짧은 안내 영상으로 구성"
    },
    "economicScene": "버전·자막·음향·출력 투입 분리",
    "learningScene": "동일 소재의 길이별 전달 차이 검토",
    "action": "기존 후보와 현재 배우는 기술을 대조",
    "counterexample": "영상 직접 function 분류가 있다고 기록하지 않음",
    "distinctFromOtherParagraphs": "시각 디자인과 다른 시간·소리·소재의 제약",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "영상 직접 function 분류가 있다고 기록하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-ux",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "혁신 후보에서 사용 흐름을 검증하는 다른 역할",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 create 또는 investigate 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "아이디어와 실제 사용 관찰은 다른 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "구조를 보는 선호는 단계 사이의 혼선 질문에 쓰일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "도움 없이 수행할 작은 시안으로 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "be18df3416f4583503eb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRATEGY:route-comparison",
        "axis": "STRATEGY",
        "definition": "목적에 이르는 여러 경로를 비교",
        "condition": "목적·자원·기한이 명시된 상황",
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
      "ckr:job:ux"
    ],
    "positive": "주장 대신 사용 조건을 비교할 여지",
    "risk": "자기 논리가 맞으면 사용자도 같을 거라 생각",
    "factBomb": "좋아 보이는 구조가 처음 쓰는 사람에게는 안 보일 수 있음",
    "twist": "단순한 관찰이 큰 설계의 가정을 바꿀 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 신청 흐름에서 안내 없이 마지막까지 가기"
    },
    "economicScene": "전체 개편과 작은 검증 투입 차이",
    "learningScene": "관찰 질문·시제품·기록 연습",
    "action": "실제 추천과 검증할 사용 과제 확인",
    "counterexample": "고객 행동이나 시장 효과를 근거 없이 예측하지 않음",
    "distinctFromOtherParagraphs": "기획안 작성과 다른 실제 사용 검증",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객 행동이나 시장 효과를 근거 없이 예측하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-support",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "지원 후보에서 뒤편의 기록과 절차 정비",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 teach 또는 manage 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "직접 응대와 응대가 이어질 자료를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "뒤편 지원 원천은 보이지 않는 작업의 후보",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "가상 인계 문서가 다른 담당에게 통하는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b2d2427cbee48429f3e8"
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
    "positive": "혼선을 줄이는 조용한 기여를 찾을 여지",
    "risk": "지원이 잘되면 개인에게 모든 잡무가 쌓일 수 있음",
    "factBomb": "아무도 몰라야 잘한 일이라는 기준은 기여 설명을 지움",
    "twist": "작업 흔적을 남기는 것이 배려를 보이게 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 반복 문의를 쉬운 안내 자료로 바꿈"
    },
    "economicScene": "자료 유지와 반복 응대 감소의 투입 비교",
    "learningScene": "기록을 처음 보는 사람이 따라가기",
    "action": "지원 범위와 완료 조건을 확인",
    "counterexample": "보조 역할이 본인의 유일한 천직이라고 제한하지 않음",
    "distinctFromOtherParagraphs": "직접 돌봄과 다른 운영 지원 결과",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "보조 역할이 본인의 유일한 천직이라고 제한하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-operations",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "운영 후보에서 개인 숙련을 위임 구조로 바꾸는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 manage 또는 lead 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "큰 팀 선호와 현재 인력·권한은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "반복 과제의 결과 기준을 나누는 기능",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "작은 위임과 질문 통로를 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5b8d6b11c49970419712"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "axis": "LEADERSHIP",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
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
    "positive": "운영의 대기를 줄일 여지",
    "risk": "기준을 세우며 수행 방법까지 통제",
    "factBomb": "담당자가 모든 승인을 기다리면 운영 규모가 커지지 않음",
    "twist": "다른 방식으로 같은 기준을 지키는 결과가 성장의 정보",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 담당자의 방법 선택을 남긴 과제"
    },
    "economicScene": "확인·재설명·대기 투입 구분",
    "learningScene": "결과·방법·권한을 분리하는 설명",
    "action": "기존 후보와 실제 조직 조건을 확인",
    "counterexample": "현재 직원과 매출이 존재한다고 추정하지 않음",
    "distinctFromOtherParagraphs": "직책명 변경이 아닌 운영의 재현 구조",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 직원과 매출이 존재한다고 추정하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-retail",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "판매 후보에서 반복 경험과 재고 약속을 잇는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 market 또는 experience 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "상품 추천과 실제 제공 상태는 같이 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "관계 서비스 원천은 반복 고객 경험의 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "가상 고객 목적과 재고 상태를 함께 안내",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "9c00dd07d98a425ce1c5"
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
        "id": "sar:facet:PERSISTENCE:repeat-practice",
        "axis": "PERSISTENCE",
        "definition": "정한 연습을 반복",
        "condition": "피드백을 받을 수 있는 과제",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "employee",
      "self_employed"
    ],
    "detailJobRefs": [
      "ckr:job:retail"
    ],
    "positive": "좋은 관계를 지킬 수 있는 약속을 찾을 여지",
    "risk": "관계를 지키려고 불가능한 제공을 약속",
    "factBomb": "기분 좋은 추천도 실제 재고가 없으면 불편으로 돌아옴",
    "twist": "모르는 규격을 확인하는 태도가 신뢰를 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 매장에서 용도에 맞는 두 상품 비교"
    },
    "economicScene": "재고·반품·예약 응대의 자원 구분",
    "learningScene": "사용 목적에 따른 비교 설명",
    "action": "추천과 제공 가능한 상태를 분리",
    "counterexample": "고객 수·재방문 실적을 사실로 만들지 않음",
    "distinctFromOtherParagraphs": "단발 거래 제안과 다른 반복 제공 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객 수·재방문 실적을 사실로 만들지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-field",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "현장 후보에서 상태 확인과 공정 연결 기능",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 review 또는 manage 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "위기 대응 선호는 안전 숙련의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "이상 상태를 사실로 전달하고 담당자에게 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "허용된 관찰·기록 과제로 적합성 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "17481957d3ad7c46239e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRACTICALITY:use-test",
        "axis": "PRACTICALITY",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
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
      "employee",
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:logistics"
    ],
    "positive": "작은 차이를 큰 재작업 전에 알릴 여지",
    "risk": "급한 해결을 위해 확인 절차를 생략",
    "factBomb": "빠르게 고친 일이 다음 공정에 어떤 영향을 줬는지는 별도 확인",
    "twist": "혼자 해결하지 않고 중단·전달하는 판단도 실력",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 공정 지연을 원인·현상·담당으로 분리"
    },
    "economicScene": "대기와 재처리 자원을 함께 봄",
    "learningScene": "허용 절차·인계·이상 보고 연습",
    "action": "실제 업무·안전 교육 조건부터 확인",
    "counterexample": "위험 작업 실험·사고 예측·자격 추정 금지",
    "distinctFromOtherParagraphs": "기술 구현과 다른 현장 연결·안전 제약",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "위험 작업 실험·사고 예측·자격 추정 금지",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P3:alternative-business-analysis",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "readerQuestion": "다른 직업 가능성",
    "researchKind": "mbti_application",
    "coreMeaning": "사업 후보에서 선택지와 운영 제약을 연결하는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "다른 실제 추천",
        "knowledge": "기존 다른 market 또는 lead 추천에만 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립 근거",
        "knowledge": "전략 관심과 실제 사업 판단 권한을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "발휘 능력",
        "knowledge": "규모보다 제공할 결과와 필요한 자원을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "준비와 조건",
        "knowledge": "가상 기획의 포기할 안까지 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a8c6b85971d9f1208b22"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRATEGY:route-comparison",
        "axis": "STRATEGY",
        "definition": "목적에 이르는 여러 경로를 비교",
        "condition": "목적·자원·기한이 명시된 상황",
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
      "employee",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:project_planning"
    ],
    "positive": "확장 전에 실행 조건을 살필 여지",
    "risk": "크기가 큰 계획을 더 가치 있다고 볼 수 있음",
    "factBomb": "작은 검증이 없으면 큰 목표도 가정의 묶음으로 남음",
    "twist": "범위를 좁힌 선택이 다음 확장의 근거를 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 신규 서비스의 확인할 가정 세 개 비교"
    },
    "economicScene": "준비 투입·제공 투입·회수 시점 구분",
    "learningScene": "실행 담당자의 제약을 기획에 반영",
    "action": "기존 후보·직무 관심·실제 자료를 확인",
    "counterexample": "사업 성공·고소득을 확정하지 않음",
    "distinctFromOtherParagraphs": "lead의 역할 조정과 다른 선택·자원의 결합",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "사업 성공·고소득을 확정하지 않음",
      "requiresExistingRecommendation": true,
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
    "id": "ckr:material:CH03.P4:blocked-review",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "맞지 않는 적성과 업무",
    "researchKind": "natal_application",
    "coreMeaning": "자료와 수정 통로 없는 검토는 적성보다 환경 문제",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "실제 회피 환경",
        "knowledge": "실제 회피 경로가 확인될 때만 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "불편한 이유",
        "knowledge": "기준을 확인할 정보가 없는 이유가 불편의 핵심",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "가능한 문제",
        "knowledge": "결과 책임만 받으면 같은 오류를 반복할 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "회피와 조정 구분",
        "knowledge": "자료·납기·권한을 조정할 수 있는지 먼저 질문",
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
      "ckr:job:finance"
    ],
    "positive": "환경 문제를 개인 능력 부족과 분리할 여지",
    "risk": "일시 누락을 조직 전체 결함으로 단정",
    "factBomb": "검토할 시간을 아끼는 운영이 나중 재처리 시간을 키울 수 있음",
    "twist": "조정 가능한 자료 전달 문제는 직업 전체를 피할 이유가 아닐 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 마감 검토에 원자료가 늦게 전달"
    },
    "economicScene": "대기와 재검토 투입을 따로 기록",
    "learningScene": "필수 자료와 대체 확인 조건 정리",
    "action": "실제 회피 proof와 반복 여부 확인",
    "counterexample": "불편을 실제 겪었다고 입력 없이 말하지 않음",
    "distinctFromOtherParagraphs": "CH01 조건보다 회피와 조정의 의사결정",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "불편을 실제 겪었다고 입력 없이 말하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": true,
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
    "id": "ckr:material:CH03.P4:creative-scope-chaos",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "맞지 않는 적성과 업무",
    "researchKind": "mbti_application",
    "coreMeaning": "기준 없는 취향 변경은 창작의 과제 범위를 흐린다",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "실제 회피 환경",
        "knowledge": "실제 회피 경로와 피드백 원천이 있을 때만 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "불편한 이유",
        "knowledge": "원하는 결과와 승인자가 바뀌는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "가능한 문제",
        "knowledge": "반복 수정은 기술 부족이 아니라 합의 부재일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "회피와 조정 구분",
        "knowledge": "새 방향과 기존 방향 수정을 구분해 조정",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1668268fb9233e277c7b"
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
      "ckr:job:photography",
      "ckr:job:brand_design"
    ],
    "positive": "창작을 유지할 검토 조건을 찾을 여지",
    "risk": "어떤 피드백도 창작 침해로 받아들일 수 있음",
    "factBomb": "내 취향을 지키려다 실제 사용 목적을 놓칠 수 있음",
    "twist": "구체적인 요구가 창작을 제한하기보다 선택을 도울 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 촬영 후 용도 자체가 바뀌어 추가 컷 요구"
    },
    "economicScene": "추가 제작과 같은 컷 보정의 투입 차이",
    "learningScene": "사용 목적 기준으로 수정 의견을 분류",
    "action": "변경한 목적·범위·검토자를 확인",
    "counterexample": "한 번의 다른 의견으로 직무 회피를 권하지 않음",
    "distinctFromOtherParagraphs": "일반 자율성 주장과 다른 취향·승인 변경 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "한 번의 다른 의견으로 직무 회피를 권하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": true,
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
    "id": "ckr:material:CH03.P4:care-always-on",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "맞지 않는 적성과 업무",
    "researchKind": "mbti_application",
    "coreMeaning": "준비와 회복을 인정하지 않는 상시 지원 조건",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "실제 회피 환경",
        "knowledge": "실제 회피 환경 근거와 지원 역할이 있을 때만 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "불편한 이유",
        "knowledge": "응대 시간과 맡을 범위가 불명확한지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "가능한 문제",
        "knowledge": "좋은 의도가 무제한 후속 책임으로 굳을 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "회피와 조정 구분",
        "knowledge": "연락·인계·종결 조건의 조정 가능성 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5b778076e2f7f6a60f75"
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
      "ckr:job:teaching",
      "ckr:job:counsel_support"
    ],
    "positive": "지속 가능한 지원 범위를 찾을 여지",
    "risk": "필요한 긴급 연결도 개인 경계 문제로 단순화",
    "factBomb": "한 사람의 친절이 인력과 운영 공백을 모두 메울 수 없음",
    "twist": "정해진 인계가 오히려 도움의 지속성을 높임",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 강의가 끝나도 채널마다 같은 질문이 도착"
    },
    "economicScene": "수업 외 반복 응대 투입을 구분",
    "learningScene": "지원 종료와 다음 도움 통로 설명",
    "action": "원천 위험과 실제 역할 범위를 확인",
    "counterexample": "의료·안전상 필요한 대응은 임의 중단 지침으로 쓰지 않음",
    "distinctFromOtherParagraphs": "직무 회피와 서비스 범위 재설계 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "의료·안전상 필요한 대응은 임의 중단 지침으로 쓰지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": true,
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
    "id": "ckr:material:CH03.P4:false-speed",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "맞지 않는 적성과 업무",
    "researchKind": "mbti_application",
    "coreMeaning": "속도만 평가하고 검증·안전 투입을 빼는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "실제 회피 환경",
        "knowledge": "실제 회피 경로에서 필요한 검토가 막히는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "불편한 이유",
        "knowledge": "빠름과 재작업을 함께 봐야 불편의 이유가 명확",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "가능한 문제",
        "knowledge": "확인 생략은 뒤 작업의 부담으로 옮겨갈 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "회피와 조정 구분",
        "knowledge": "중단·검증 기준을 합의할 통로 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "932f48a511820a551fae"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRACTICALITY:use-test",
        "axis": "PRACTICALITY",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
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
      "ckr:job:logistics",
      "ckr:job:software"
    ],
    "positive": "실행력을 지킬 환경을 고를 여지",
    "risk": "개인의 느린 수행과 구조적 문제를 혼동",
    "factBomb": "빨리 끝냈다는 숫자가 다음 사람의 수정 시간을 숨길 수 있음",
    "twist": "필요한 확인은 속도를 늦추기보다 반복 비용을 줄임",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 납기 압박 속 필수 확인을 생략하자는 요청"
    },
    "economicScene": "초기 속도와 후속 재처리를 구분",
    "learningScene": "위험 크기에 맞는 검증 구분 연습",
    "action": "허용된 확인 절차와 일정부터 점검",
    "counterexample": "안전 절차를 줄여서 적응하라는 조언 금지",
    "distinctFromOtherParagraphs": "직업의 좋고 나쁨이 아닌 검증 가능한 운영 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전 절차를 줄여서 적응하라는 조언 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": true,
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
    "id": "ckr:material:CH03.P4:purpose-mismatch",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "readerQuestion": "맞지 않는 적성과 업무",
    "researchKind": "mbti_application",
    "coreMeaning": "실제 목적과 보고 지표가 어긋난 환경",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "실제 회피 환경",
        "knowledge": "실제 회피 원천과 수행할 과제를 함께 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "불편한 이유",
        "knowledge": "숫자를 싫어해서가 아니라 그 숫자의 사용 목적이 문제",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "가능한 문제",
        "knowledge": "목표와 상관없는 반응만 쌓으면 선택을 바꾸기 어려움",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "회피와 조정 구분",
        "knowledge": "지표가 어떤 결정에 쓰이는지 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "9adba86c70d3adba42da"
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
      "ckr:job:marketing"
    ],
    "positive": "의미와 측정을 연결할 여지",
    "risk": "의미가 약하다는 이유로 기본 보고를 모두 거부",
    "factBomb": "좋은 뜻이 있어도 확인할 결과가 없으면 기여를 설명하기 어려움",
    "twist": "작은 지표도 목적이 명확하면 보람을 뒷받침",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 캠페인에서 조회와 실제 문의의 차이를 확인"
    },
    "economicScene": "노출·제작·응대 투입과 목표 연결",
    "learningScene": "목표별 다른 관찰 질문 설계",
    "action": "조정 가능한 목표와 바꿀 수 없는 조건을 나누기",
    "counterexample": "실제 조직 목적을 입력 없이 부정적으로 평가하지 않음",
    "distinctFromOtherParagraphs": "CH08 인정 해석보다 직무 목적과 평가 조건의 부합",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 조직 목적을 입력 없이 부정적으로 평가하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": true,
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
