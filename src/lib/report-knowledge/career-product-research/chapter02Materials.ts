/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH02_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH02.P1:detect-mismatch",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "readerQuestion": "가장 강한 업무 능력",
    "researchKind": "natal_application",
    "coreMeaning": "기준과 자료 사이의 불일치를 찾는 검토 기능",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "주요 강점",
        "knowledge": "검토의 강점은 작지만 중요한 차이를 구분하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "근거",
        "knowledge": "실제 원국의 관성 분류만으로 회계 실력을 인정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "발휘 장면",
        "knowledge": "총액은 같지만 기간이 중복된 가상 자료를 대조",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "실제 가치",
        "knowledge": "다음 검토자가 같은 오류를 찾을 근거를 남길 때 가치",
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
      "ckr:job:accounting"
    ],
    "positive": "재처리 전에 오류를 드러낼 여지",
    "risk": "모든 흠을 같은 위험으로 다룰 수 있음",
    "factBomb": "정확해 보이는 표도 원본 추적이 안 되면 다른 사람이 검증하기 어려움",
    "twist": "보기 좋은 정리보다 불명확한 칸을 남기는 것이 더 정확할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 거래표의 기간·증빙·분류를 나란히 확인"
    },
    "economicScene": "추가 검토 투입과 예방할 재처리의 종류를 구분",
    "learningScene": "오류 유형마다 다른 검토 사례를 만들기",
    "action": "핵심 조건과 표현상의 흠을 분리",
    "counterexample": "원자료와 검토 기준이 없으면 정확성 판정 보류",
    "distinctFromOtherParagraphs": "분석의 원인 설명과 달리 맞지 않는 곳을 발견하는 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "원자료와 검토 기준이 없으면 정확성 판정 보류",
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
    "id": "ckr:material:CH02.P1:causal-model",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "readerQuestion": "가장 강한 업무 능력",
    "researchKind": "natal_application",
    "coreMeaning": "원인 후보를 비교하고 설명의 한계를 남기는 분석 기능",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "주요 강점",
        "knowledge": "반복 문제를 한 가지 성격 설명으로 압축하지 않는 힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "근거",
        "knowledge": "편인의 전통 탐구 상징은 능력 검증과 별개",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "발휘 장면",
        "knowledge": "같은 결과를 낸 서로 다른 조건을 가상 자료에서 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "실제 가치",
        "knowledge": "반례와 적용 범위를 남기면 다음 판단에 쓸 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "78ca1a3776c53c2d0b48"
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
      "ckr:job:research"
    ],
    "positive": "근거를 따라갈 수 있는 설명을 만들 여지",
    "risk": "자료가 늘수록 결론이 저절로 좋아진다고 생각할 수 있음",
    "factBomb": "설명을 어렵게 만드는 것이 분석의 깊이를 보여주지는 않음",
    "twist": "짧은 한계 설명이 긴 확신보다 실무에 유용할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 설문에서 반응 차이를 두 가설로 검토"
    },
    "economicScene": "판단에 필요한 확실성과 조사 비용의 관계",
    "learningScene": "다른 가설로 같은 자료를 설명하는 연습",
    "action": "바뀐 판단 한 가지와 남은 질문 한 가지 적기",
    "counterexample": "통계적 근거나 설계가 없으면 인과관계 단정 불가",
    "distinctFromOtherParagraphs": "정확성의 대조와 구별되는 설명 모델의 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "통계적 근거나 설계가 없으면 인과관계 단정 불가",
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
    "id": "ckr:material:CH02.P1:make-alternative",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "readerQuestion": "가장 강한 업무 능력",
    "researchKind": "natal_application",
    "coreMeaning": "모호한 요구를 비교 가능한 대안으로 만드는 창작 기능",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "주요 강점",
        "knowledge": "새로움보다 선택할 수 있는 형태를 만드는 능력",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "근거",
        "knowledge": "식신 근거는 표현의 상징이며 작품 품질 보증이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "발휘 장면",
        "knowledge": "같은 정보에 다른 읽기 순서를 가진 가상 시안을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "실제 가치",
        "knowledge": "비교 기준이 있을 때 초안이 의사결정을 도움",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "90e77590d3ea07930ba1"
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
    "positive": "없는 선택지를 현실 검토 대상으로 만들 여지",
    "risk": "개수가 많아지면 선택 비용도 커질 수 있음",
    "factBomb": "열 가지 안을 만들었어도 차이를 설명하지 못하면 선택 부담을 넘김",
    "twist": "제약을 줄이는 대신 분명히 하면 발상의 차이가 더 잘 보일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 문구를 두 매체에 맞춰 다르게 배치"
    },
    "economicScene": "제작 범위와 채택 후 적용 투입을 구분",
    "learningScene": "매체 제약 하나를 바꿔 시안 수정",
    "action": "대안마다 해결하는 질문을 써보기",
    "counterexample": "이미 기준이 확정된 과제에는 대안의 수가 성과가 아님",
    "distinctFromOtherParagraphs": "설명 능력과 달리 아직 없는 결과의 형태를 만드는 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "이미 기준이 확정된 과제에는 대안의 수가 성과가 아님",
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
    "id": "ckr:material:CH02.P1:explain-to-use",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "readerQuestion": "가장 강한 업무 능력",
    "researchKind": "mbti_application",
    "coreMeaning": "듣는 사람이 스스로 행동할 설명을 만드는 기능",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "주요 강점",
        "knowledge": "표현의 가치는 말의 양보다 사용할 수 있는 이해",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "근거",
        "knowledge": "원천의 발표 선호는 실제 수업 효과와 별개",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "발휘 장면",
        "knowledge": "설명을 듣고 다른 문제를 혼자 푸는 가상 학습 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "실제 가치",
        "knowledge": "자기 말로 사용할 수 있는지 확인할 때 가치가 드러남",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "25034b1d3583cb77b7ab"
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
      "ckr:job:teaching"
    ],
    "positive": "지식에 접근하는 문턱을 낮출 여지",
    "risk": "좋은 분위기를 이해의 증거로 볼 수 있음",
    "factBomb": "다들 고개를 끄덕였어도 아무도 다음 행동을 모르고 있을 수 있음",
    "twist": "짧고 낯선 질문이 긴 칭찬보다 설명을 개선",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "강의 뒤 예제와 조건이 다른 과제를 주는 장면"
    },
    "economicScene": "반복 문의 감소와 준비 투입을 분리",
    "learningScene": "초보자에게 개념을 설명한 뒤 다시 듣기",
    "action": "상대의 다음 행동을 확인하는 질문 추가",
    "counterexample": "실제 학습 반응이 없으면 효과를 단정하지 않음",
    "distinctFromOtherParagraphs": "창작의 형식 생성과 구별되는 전달·이해의 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 학습 반응이 없으면 효과를 단정하지 않음",
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
    "id": "ckr:material:CH02.P1:reliable-execution",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "readerQuestion": "가장 강한 업무 능력",
    "researchKind": "natal_application",
    "coreMeaning": "반복되는 조건에서도 합의한 품질을 이어가는 실행 기능",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "주요 강점",
        "knowledge": "꾸준함은 연차보다 유지할 기준을 확인하는 행동",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "근거",
        "knowledge": "정재의 축적 상징과 실제 납기·품질은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "발휘 장면",
        "knowledge": "작업 순서가 바뀌어도 누락 없이 이어받는 가상 현장",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "실제 가치",
        "knowledge": "다음 공정이 예상하고 움직일 수 있을 때 가치",
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
    "positive": "반복을 안정된 결과로 남길 여지",
    "risk": "익숙한 방식의 효용이 줄어도 계속 지킬 수 있음",
    "factBomb": "오래 했다는 말이 조건이 달라진 일까지 잘한다는 근거는 아님",
    "twist": "반복을 고치는 힘도 꾸준함의 일부",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 인계에서 매번 빠지는 정보를 기준표에 반영"
    },
    "economicScene": "유지 품질과 반복 확인 시간의 관계",
    "learningScene": "같은 과제에 조건이 다른 예외를 섞어 연습",
    "action": "지킬 반복과 바꿀 반복을 나눔",
    "counterexample": "측정할 품질과 실제 업무가 없으면 숙련 판정 불가",
    "distinctFromOtherParagraphs": "추진 속도와 달리 다음에도 제공할 결과의 일관성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "측정할 품질과 실제 업무가 없으면 숙련 판정 불가",
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
    "id": "ckr:material:CH02.P2:coordination-distinct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "readerQuestion": "두 번째 전문적 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "직접 잘하는 능력과 다른 사람이 끝내게 하는 조정의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "다른 재능",
        "knowledge": "두 번째 재능은 일의 공백을 연결하는 기능일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "위임 압력 원천은 첫 재능의 별칭으로 계산하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "문제 해결 장면",
        "knowledge": "담당자가 서로 결정을 기다리는 가상 과제를 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "발전 조건",
        "knowledge": "역할과 권한을 맞춰야 실제 조정 능력으로 발전",
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
      "ckr:job:small_business"
    ],
    "positive": "여러 사람의 대기를 줄일 여지",
    "risk": "맡긴 일을 다시 가져와 책임을 독점할 수 있음",
    "factBomb": "혼자 끝낸 양이 많다는 사실은 팀을 움직였다는 증거와 다름",
    "twist": "덜 개입한 결과가 좋은 조정의 산출물일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 과제의 완료 결과와 질문 지점을 담당자에게 전달"
    },
    "economicScene": "대표 개입 시간과 담당자의 대기 시간을 구분",
    "learningScene": "결과 기준과 수행 방법을 다른 문장으로 설명",
    "action": "첫 재능과 다른 기능·root가 있는지 확인",
    "counterexample": "실제 위임할 권한과 사람이 없으면 관리자 능력 확정 금지",
    "distinctFromOtherParagraphs": "검토·실행과 구별되는 타인의 실행 조건 조성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 위임할 권한과 사람이 없으면 관리자 능력 확정 금지",
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
    "id": "ckr:material:CH02.P2:resource-distinct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "readerQuestion": "두 번째 전문적 재능",
    "researchKind": "natal_application",
    "coreMeaning": "자료를 분석하는 힘과 투입 선택을 비교하는 힘의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "다른 재능",
        "knowledge": "비용과 결과의 대안을 고르는 기능을 별도 검토",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "원국 재성의 존재만으로 재무 전문성을 인정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "문제 해결 장면",
        "knowledge": "가상 예산에서 같은 목적의 다른 투입안을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "발전 조건",
        "knowledge": "싼 안과 전체 부담이 적은 안을 구별하는 연습",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ed5b09b1f8185708cd"
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
    "positive": "제한된 자원을 필요한 결과에 남길 여지",
    "risk": "보이지 않는 배움·관계의 가치를 제외할 수 있음",
    "factBomb": "당장 절약한 금액 뒤에 재작업이 남으면 효율을 과대평가",
    "twist": "지금 더 쓰는 선택이 유지 투입을 줄일 수도 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 도구의 최초 비용과 유지 부담 비교"
    },
    "economicScene": "구입·전환·유지의 비용을 같은 항목으로 합치지 않음",
    "learningScene": "조건이 다른 선택지의 전체 투입 비교",
    "action": "정확한 분석과 자원 배분이 다른 결과인지 확인",
    "counterexample": "실제 비용 정보가 없으면 가장 유리한 안을 확정하지 않음",
    "distinctFromOtherParagraphs": "분석의 설명과 자원 선택의 판단을 독립 기능으로 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 비용 정보가 없으면 가장 유리한 안을 확정하지 않음",
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
    "id": "ckr:material:CH02.P2:care-distinct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "readerQuestion": "두 번째 전문적 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "정확히 설명하는 기능과 상대의 막힌 단계를 돕는 기능의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "다른 재능",
        "knowledge": "지원의 재능은 필요한 도움의 크기를 조정하는 데 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "실제 도움 선호 원천을 설명 성향의 중복으로 세지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "문제 해결 장면",
        "knowledge": "가상 고객이 안내를 알아도 실행하지 못한 이유를 물음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "발전 조건",
        "knowledge": "대신 처리와 스스로 할 지원을 나누어 발전",
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
      "ckr:job:customer_support"
    ],
    "positive": "접근 가능한 안내를 만들 여지",
    "risk": "개인 응대에 모든 시간을 쓸 수 있음",
    "factBomb": "도움을 많이 준 사실이 상대의 독립성을 늘린 사실과 같지 않음",
    "twist": "한 번 덜 도와주는 것이 사용 능력을 확인할 기회일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 신청에서 필요한 단계만 함께 확인"
    },
    "economicScene": "후속 연락과 반복 문의 투입을 구분",
    "learningScene": "말·화면·실행 단계 중 어디서 막혔는지 분류",
    "action": "첫 재능과 다른 문제를 푸는지 확인",
    "counterexample": "도움받을 상대의 실제 필요를 입력 없이 만들지 않음",
    "distinctFromOtherParagraphs": "전달 품질과 지원 범위 조정의 독립성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "도움받을 상대의 실제 필요를 입력 없이 만들지 않음",
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
    "id": "ckr:material:CH02.P2:opportunity-distinct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "readerQuestion": "두 번째 전문적 재능",
    "researchKind": "natal_application",
    "coreMeaning": "새 수요를 찾는 기능과 이미 있는 자원을 관리하는 기능의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "다른 재능",
        "knowledge": "새 요청의 실제 필요를 좁히는 힘을 별도 검토",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "편재 상징을 실적이나 영업 능력으로 바꾸지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "문제 해결 장면",
        "knowledge": "좋다는 반응과 승인 조건이 다른 가상 제안을 살핌",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "발전 조건",
        "knowledge": "관심을 검증 질문으로 바꾸어 발전",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "bbc18a4e615032647a49"
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
    "positive": "기존 결과의 다른 사용처를 발견할 여지",
    "risk": "새 요청을 모두 기회로 받아들일 수 있음",
    "factBomb": "새 고객 관심을 얻는 활동이 기존 약속을 무너뜨릴 수 있음",
    "twist": "거절할 조건이 선명하면 탐색에 쓸 자원도 남음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 고객의 필요·도입 시점·제공 범위를 나눔"
    },
    "economicScene": "미성사 제안의 조사·응대 투입도 봄",
    "learningScene": "관심 표현을 실제 문제 질문으로 바꾸기",
    "action": "첫 재능과 다른 수요 탐색 기능인지 확인",
    "counterexample": "실제 수요 확인 없이 매출 가능성을 단정하지 않음",
    "distinctFromOtherParagraphs": "resource의 배분과 opportunity의 탐색을 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 수요 확인 없이 매출 가능성을 단정하지 않음",
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
    "id": "ckr:material:CH02.P2:technical-distinct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "readerQuestion": "두 번째 전문적 재능",
    "researchKind": "mbti_application",
    "coreMeaning": "개념을 이해하는 능력과 조건에 맞춰 도구를 다루는 기능의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "다른 재능",
        "knowledge": "손기술은 실제 조건 변화에 맞춘 선택에서 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "원천의 실습 선호는 숙련 수준의 측정이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "문제 해결 장면",
        "knowledge": "연습 재료가 달라졌을 때 과정을 조정하는 가상 작업",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "발전 조건",
        "knowledge": "조건과 결과를 함께 설명해야 기술을 전달할 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "aaccdefbe9afed4f9db6"
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
      "ckr:job:hands_on_service"
    ],
    "positive": "구체적인 문제를 작업으로 풀 여지",
    "risk": "잘된 요령의 적용 한계를 놓칠 수 있음",
    "factBomb": "한 번 성공한 작업이 다른 재료에서도 안전하다는 보장은 아님",
    "twist": "실패 조건을 설명하는 기술도 전문성",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 연습 과제를 다른 재료 조건으로 비교"
    },
    "economicScene": "재료 소모와 재작업 투입을 구분",
    "learningScene": "선택한 도구가 어떤 조건에서 통하는지 기록",
    "action": "안전한 연습 범위에서 결과를 확인",
    "counterexample": "자격·위험이 있는 실전 작업을 임의 실험하지 않음",
    "distinctFromOtherParagraphs": "이론 이해와 구별되는 조건부 수행 기능",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자격·위험이 있는 실전 작업을 임의 실험하지 않음",
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
    "id": "ckr:material:CH02.P3:precision-to-visual",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "readerQuestion": "의외로 잘할 수 있는 것",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "검토 기능을 시각 결과의 정보 정확성에 옮기는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "덜 익숙한 활용 가능성",
        "knowledge": "덜 익숙한 활용은 시안의 정보 누락을 찾는 일",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 결합 근거",
        "knowledge": "관성 근거와 ISTJ 정확성 직무 원천을 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "다른 업무의 활용",
        "knowledge": "문구·규격·매체가 바뀔 때 같은 약속이 살아 있는지 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "가능성의 의미",
        "knowledge": "디자이너가 아니라도 검수 기능을 시험할 수 있음",
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
      "ckr:job:brand_design"
    ],
    "positive": "제작자의 표현을 해치지 않고 오류를 줄일 여지",
    "risk": "정확성으로 취향까지 판단할 수 있다고 착각",
    "factBomb": "규격을 지킨 시안도 전달 목적이 틀릴 수 있음",
    "twist": "창작을 제한하는 검토가 아닌 사용 조건을 지키는 검토",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 배너의 상품명과 작은 글자 가독성을 대조"
    },
    "economicScene": "출력 재제작을 줄일 검토와 확인 시간",
    "learningScene": "같은 문구의 다른 매체 적용을 검수",
    "action": "자료 정확성과 표현 취향을 나누기",
    "counterexample": "실제 디자인 능력이나 추천 순위 상승의 근거가 아님",
    "distinctFromOtherParagraphs": "첫 재능 재설명이 아니라 새로운 대상에 옮기는 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "실제 디자인 능력이나 추천 순위 상승의 근거가 아님",
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
    "id": "ckr:material:CH02.P3:analysis-to-teaching",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "readerQuestion": "의외로 잘할 수 있는 것",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "깊이 이해한 구조를 다른 사람이 따라갈 설명으로 바꾸는 조합",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "덜 익숙한 활용 가능성",
        "knowledge": "분석의 덜 익숙한 활용은 개념 사이의 연결 안내",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 결합 근거",
        "knowledge": "양측 source assignment와 실제 교육 원천 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "다른 업무의 활용",
        "knowledge": "자기 설명에서 학습자가 멈춘 부분을 다시 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "가능성의 의미",
        "knowledge": "알아야 할 것과 스스로 해볼 것을 구분할 때 가능성",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "78ca1a3776c53c2d0b48",
      "67821ba0891eef23e2a5",
      "f5d39e081aa424e96817"
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
      "ckr:job:teaching"
    ],
    "positive": "개념의 빈틈을 드러내는 교육 자료를 만들 여지",
    "risk": "전문 설명의 깊이를 학습자의 이해와 혼동",
    "factBomb": "내게 쉬운 설명이 상대에게도 쉬운 것은 아님",
    "twist": "초보자의 질문이 전문가 설명의 생략을 찾아줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기술 설명서를 읽고 처음 따라하는 사람의 질문 받기"
    },
    "economicScene": "반복 교육의 시간을 줄일 자료와 제작 투입",
    "learningScene": "짧은 설명 뒤 다른 조건의 문제를 제시",
    "action": "C066의 양측 근거와 실제 과제에서 확인",
    "counterexample": "본인 이해 근거나 타인 전달 조건이 없으면 조합 보류",
    "distinctFromOtherParagraphs": "분석의 반복이 아닌 지식 전달 대상 변화",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "원래 등록 규칙의 양측 feature/type 또는 signed axis·source assignment·domain/context·split을 각각 충족해야 함. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "본인 이해 근거나 타인 전달 조건이 없으면 조합 보류",
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
    "id": "ckr:material:CH02.P3:care-to-process",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "readerQuestion": "의외로 잘할 수 있는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "사람을 돕는 감각을 개인 호의에서 안내 절차로 옮기는 활용",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "덜 익숙한 활용 가능성",
        "knowledge": "지원 기능을 반복 가능한 절차로 확장",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 결합 근거",
        "knowledge": "돌봄 운영 원천은 새로운 행정 자격을 만들지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "다른 업무의 활용",
        "knowledge": "누구에게나 반복되는 질문을 가상 안내 순서로 정리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "가능성의 의미",
        "knowledge": "다른 담당자도 같은 도움을 제공할 조건을 살핌",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d12ffea3e7e02bd3f478"
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
    "positive": "개인의 배려가 공동의 접근성으로 남을 여지",
    "risk": "절차가 생겼다는 이유로 다른 필요를 듣지 않을 수 있음",
    "factBomb": "좋은 안내를 만들고도 실제로 찾을 수 없다면 도움은 남지 않음",
    "twist": "개별 질문을 줄이는 것이 배려의 감소는 아닐 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 신청자의 반복 질문을 안내에 반영"
    },
    "economicScene": "응대량 감소와 자료 유지 시간을 구분",
    "learningScene": "처음 보는 사람이 안내를 찾아 사용할 수 있는지",
    "action": "개인 지원과 표준 안내의 대상을 구분",
    "counterexample": "반복 질문의 실제 자료가 없으면 필요를 가정으로 표시",
    "distinctFromOtherParagraphs": "돌봄 재능의 별칭이 아닌 지원 전달 구조의 변화",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "반복 질문의 실제 자료가 없으면 필요를 가정으로 표시",
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
    "id": "ckr:material:CH02.P3:execution-to-experiment",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "readerQuestion": "의외로 잘할 수 있는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "현장 대응을 작은 검증 실험으로 옮기는 활용",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "덜 익숙한 활용 가능성",
        "knowledge": "빠른 행동의 덜 익숙한 가치는 가정을 확인할 움직임",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 결합 근거",
        "knowledge": "현장 대응 선호만으로 연구 설계 숙련을 인정하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "다른 업무의 활용",
        "knowledge": "예약 시안의 한 단계만 바꿔 수행을 보는 가상 실험",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "가능성의 의미",
        "knowledge": "무엇을 확인할지 정해야 활동이 정보로 남음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "db6c7a28d75b72af5336"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:INITIATIVE:opening-proposal",
        "axis": "INITIATIVE",
        "definition": "멈춘 상황에 첫 선택지를 제시",
        "condition": "제안과 실행 권한을 분리",
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
    "positive": "아이디어를 실제 사용 조건과 대조할 여지",
    "risk": "움직인 뒤 확인 질문을 잊을 수 있음",
    "factBomb": "해봤다는 말만 남으면 다음 선택을 바꿀 정보가 적음",
    "twist": "작은 멈춤이 실행의 가치를 더 분명히 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 예약 화면에서 날짜 선택 안내만 바꿔 보기"
    },
    "economicScene": "실험 규모와 전체 개편 투입을 구분",
    "learningScene": "관찰과 해석을 다른 칸에 기록",
    "action": "변경한 한 조건과 보고 싶은 결과를 정하기",
    "counterexample": "확정 효과나 모든 사용자에 대한 결론을 만들지 않음",
    "distinctFromOtherParagraphs": "실행의 반복이 아닌 검증 목적의 행동",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "확정 효과나 모든 사용자에 대한 결론을 만들지 않음",
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
    "id": "ckr:material:CH02.P3:meaning-to-proposal",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "readerQuestion": "의외로 잘할 수 있는 것",
    "researchKind": "mbti_application",
    "coreMeaning": "목적을 깊이 보는 성향을 선택 근거가 있는 기획으로 옮기는 활용",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "덜 익숙한 활용 가능성",
        "knowledge": "큰 의미를 가까운 선택 질문으로 바꿈",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 결합 근거",
        "knowledge": "비전 콘텐츠 원천은 실행 경험의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "다른 업무의 활용",
        "knowledge": "같은 목표를 가진 세 안의 포기할 결과를 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "가능성의 의미",
        "knowledge": "실행할 사람이 이해할 범위로 좁힐 때 활용 가능",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c2b9d32b8dc32f41a677"
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
      "ckr:job:project_planning"
    ],
    "positive": "좋은 의도를 구체적인 결정으로 남길 여지",
    "risk": "모든 안이 목적에 완벽히 맞기를 기다릴 수 있음",
    "factBomb": "멋진 방향을 말했어도 누가 다음에 무엇을 할지 없으면 일이 안 움직임",
    "twist": "작은 실행은 큰 뜻의 축소가 아닌 검증 방식",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기획안에서 이번에 제외할 항목을 적기"
    },
    "economicScene": "기획·실행·검증에 쓸 자원을 나누기",
    "learningScene": "목적 하나를 실제 검토 질문으로 바꾸기",
    "action": "다음 결정과 담당 역할을 분리",
    "counterexample": "실제 조직 권한이나 시장 성공을 단정하지 않음",
    "distinctFromOtherParagraphs": "성향 재소개가 아닌 결정 자료로의 전환",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 조직 권한이나 시장 성공을 단정하지 않음",
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
    "id": "ckr:material:CH02.P4:criterion-before-practice",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "readerQuestion": "재능을 실력으로 바꾸는 방법",
    "researchKind": "natal_application",
    "coreMeaning": "재능 연습의 성공 기준을 먼저 정하는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "공통 조건",
        "knowledge": "연습 전에 바꿀 결과를 정함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "성과로 바꿀 요소",
        "knowledge": "틀린 곳을 찾은 수보다 중요한 오류를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "다른 사람이 같은 근거를 따라갈 수 있는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "구체적 행동",
        "knowledge": "가상 자료에서 검토 흔적을 남김",
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
      "ckr:job:accounting"
    ],
    "positive": "검토 능력을 관찰 가능한 작업으로 바꿀 여지",
    "risk": "잘 보이는 성과만 고를 수 있음",
    "factBomb": "쉬운 오류만 많이 찾으면 약한 판단을 시험하지 못함",
    "twist": "못 찾은 오류가 다음 훈련의 좋은 질문이 됨",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "정답을 가린 가상 증빙표를 검토"
    },
    "economicScene": "연습 시간과 실제 재작업 예방은 별도 지표",
    "learningScene": "난도가 다른 오류를 섞어 대조",
    "action": "검토 기준·시간·누락을 따로 기록",
    "counterexample": "관찰 자료가 없으면 실력이 늘었다고 단정하지 않음",
    "distinctFromOtherParagraphs": "CH07 공부법보다 소개된 재능을 실제 검토 결과로 확인",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "관찰 자료가 없으면 실력이 늘었다고 단정하지 않음",
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
    "id": "ckr:material:CH02.P4:feedback-not-praise",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "readerQuestion": "재능을 실력으로 바꾸는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "칭찬과 개선할 수 있는 구체 피드백의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "공통 조건",
        "knowledge": "좋다는 반응에서 어느 선택이 효과적인지 질문",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "성과로 바꿀 요소",
        "knowledge": "실제 칭찬 학습 원천은 능력 증명의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 시안의 정보 순서와 취향 반응을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "구체적 행동",
        "knowledge": "다음 시안에 바꿀 한 항목이 있어야 연습으로 이어짐",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1288e7c671389c17eb7d"
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
    "positive": "표현 선택을 재현 가능한 판단으로 만들 여지",
    "risk": "기분 좋은 반응만 모을 수 있음",
    "factBomb": "칭찬을 많이 받아도 어떤 과제에서 통하는지 모를 수 있음",
    "twist": "불편한 한 질문이 재능의 적용 범위를 넓힐 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 포스터를 보고 가장 먼저 읽은 문구를 묻기"
    },
    "economicScene": "수정 투입과 얻은 전달 개선을 비교",
    "learningScene": "같은 지적을 새 과제에 적용",
    "action": "무엇을 유지하고 무엇을 바꿀지 따로 묻기",
    "counterexample": "피드백 상대와 목적이 다르면 그대로 적용 불가",
    "distinctFromOtherParagraphs": "CH02 재능 개발의 외부 관찰 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "피드백 상대와 목적이 다르면 그대로 적용 불가",
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
    "id": "ckr:material:CH02.P4:transfer-test",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "readerQuestion": "재능을 실력으로 바꾸는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "익숙한 예제 수행과 새 조건 적용을 분리하는 실력 확인",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "공통 조건",
        "knowledge": "재능을 실력으로 바꾸려면 조건을 바꿔 시험",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "성과로 바꿀 요소",
        "knowledge": "실습 선호는 혼자 할 수 있는 범위를 알려주지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 기능의 입력을 바꾸고 실패 이유를 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "구체적 행동",
        "knowledge": "도움받은 부분을 남겨야 다음 배움이 보임",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "4b48516cd55d06412f8a"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
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
    "positive": "배운 기술의 적용 한계를 정확히 알 여지",
    "risk": "익숙한 예제만 반복해 자신감을 과대평가",
    "factBomb": "외운 결과는 작은 조건 변경에서 멈출 수 있음",
    "twist": "못 하는 범위를 알면 맡을 일을 더 정확히 고름",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "예제 코드를 가린 뒤 다른 입력으로 재구현"
    },
    "economicScene": "교육 투입과 실제 유지 가능한 결과 구분",
    "learningScene": "도움 없이 같은 원리를 쓰는 연습",
    "action": "원리·조건·결과를 한 번 설명",
    "counterexample": "실전 시스템을 위험하게 변경하는 검증 금지",
    "distinctFromOtherParagraphs": "CH07 기술 목록이 아닌 소개된 재능의 전이 검증",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실전 시스템을 위험하게 변경하는 검증 금지",
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
    "id": "ckr:material:CH02.P4:two-skill-complement",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "readerQuestion": "재능을 실력으로 바꾸는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "본인 수행과 위임 설명을 함께 발전시키는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "공통 조건",
        "knowledge": "첫 재능의 결과를 남이 이해할 기준으로 바꿈",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "성과로 바꿀 요소",
        "knowledge": "두 재능이 서로 다른 기능인지 다시 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 반복 과제의 결과와 질문 시점을 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "구체적 행동",
        "knowledge": "대신 해주지 않고도 이어지는지 확인",
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
      "ckr:job:small_business"
    ],
    "positive": "개인 숙련이 공동의 결과로 넓어질 여지",
    "risk": "설명 이후 수행 방법까지 통제할 수 있음",
    "factBomb": "위임했다고 말하면서 모든 판단을 되가져오면 능력 전이는 안 됨",
    "twist": "내 방식과 다른 방법이 기준을 지키면 좋은 결과일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 담당자에게 예외 하나의 판단 권한을 남김"
    },
    "economicScene": "확인 시간과 담당자의 대기 투입 구분",
    "learningScene": "설명받은 사람이 같은 기준을 말할 수 있는지",
    "action": "결과와 방법을 분리한 작은 위임 실험",
    "counterexample": "실제 위임 대상이 없는 입력에 직원·팀 생성 금지",
    "distinctFromOtherParagraphs": "강점 나열이 아닌 두 기능을 묶는 발전 과제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 위임 대상이 없는 입력에 직원·팀 생성 금지",
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
    "id": "ckr:material:CH02.P4:value-trace",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "readerQuestion": "재능을 실력으로 바꾸는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "좋은 작업을 다른 사람이 사용할 수 있는 흔적으로 남기는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "공통 조건",
        "knowledge": "내가 한 일과 그 일로 달라진 결정을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "성과로 바꿀 요소",
        "knowledge": "능력의 가치는 자기 평가만으로 확정되지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "부족해질 부분",
        "knowledge": "가상 분석을 받기 전후 선택지가 어떻게 좁혀졌는지 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "구체적 행동",
        "knowledge": "다음에 쓸 수 있는 판단 기준을 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1d7da5209fe3284e2d3e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRATEGY:route-comparison",
        "axis": "STRATEGY",
        "definition": "목적에 이르는 여러 경로를 비교",
        "condition": "목적·자원·기한이 명시된 상황",
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
    "positive": "과정의 전문성을 설명할 여지",
    "risk": "모든 결과를 자기 공으로 귀속할 수 있음",
    "factBomb": "최종 성과가 좋아도 내 작업의 기여는 따로 확인해야 함",
    "twist": "작은 결정의 변화가 큰 숫자보다 정직한 설명일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기획 자료에 채택·보류 이유를 표시"
    },
    "economicScene": "산출물 분량과 실제 사용 가치를 구별",
    "learningScene": "다른 사람이 쓸 수 있는 설명 형태 연습",
    "action": "기여·외부 조건·미확인 결과를 구분",
    "counterexample": "관찰한 변화가 없으면 실제 성과라고 쓰지 않음",
    "distinctFromOtherParagraphs": "CH06 가격 설명 전 단계의 역량 확인 기록",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "관찰한 변화가 없으면 실제 성과라고 쓰지 않음",
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
