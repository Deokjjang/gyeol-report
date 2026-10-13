/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH07_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH07.P1:concept-structure",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "내가 공부하는 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "개념을 연결해 이해하는 방식과 실제 적용을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "학습 특징",
        "knowledge": "학습 특징 후보는 개념 사이의 관계를 묻는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 학업 자료",
        "knowledge": "INTJ의 깊은 프로젝트 학습 원천을 실제 입력에서 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "명리 근거",
        "knowledge": "정인의 배움 상징은 지능·학력의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "적합한 방식",
        "knowledge": "자료를 덮고 다른 조건의 문제에 적용",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fe11b875c7ad3a9c8318",
      "042ffda8801ebeaf2c6d"
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
    "positive": "지식의 연결을 사용할 설명으로 만들 여지",
    "risk": "원리를 모두 이해할 때까지 수행을 미룸",
    "factBomb": "잘 이해한 느낌이 도움 없이 답할 능력은 아닐 수 있음",
    "twist": "풀지 못한 문제는 필요한 연결을 더 정확히 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석 개념을 새 자료에 적용"
    },
    "economicScene": "읽기·자료 수집·실습 투입을 따로 봄",
    "learningScene": "같은 개념의 반례를 설명",
    "action": "명리와 MBTI의 범위를 나눠 확인",
    "counterexample": "원국이나 실제 유형 없으면 양측 결합을 보류",
    "distinctFromOtherParagraphs": "CH01 근거 설명과 달리 배운 것을 사용할 확인 방식",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "원국이나 실제 유형 없으면 양측 결합을 보류",
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
    "id": "ckr:material:CH07.P1:learn-by-doing",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "내가 공부하는 방식",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "실습으로 익힌 요령을 원리와 적용 조건으로 남기는 학습",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "학습 특징",
        "knowledge": "직접 해보는 선호를 낮은 위험의 과제에 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 학업 자료",
        "knowledge": "ISTP 원천은 실제 손기술 수준이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "명리 근거",
        "knowledge": "식신 상징과 원래 Fusion feature 조건을 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "적합한 방식",
        "knowledge": "잘된 조건·안 된 조건을 설명으로 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "90e77590d3ea07930ba1",
      "130ebac8873e64f99e23",
      "c009e50b177f9c93ca31"
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
    "positive": "구체적인 결과에서 질문을 만들 여지",
    "risk": "작동한 한 번으로 원리를 안다고 판단",
    "factBomb": "도구를 쓸 수 있어도 왜 실패했는지 모르면 전이가 어려움",
    "twist": "짧은 기록이 손의 요령을 다른 환경으로 옮겨줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기능의 입력을 바꾸며 동작 비교"
    },
    "economicScene": "실습 도구와 배우는 시간 투입",
    "learningScene": "실패 조건을 원리 이름과 연결",
    "action": "Fusion 원조건과 허용된 실습 범위 확인",
    "counterexample": "안전 위험이 있는 실전 시행착오 권장 금지",
    "distinctFromOtherParagraphs": "CH02 기술 재능과 다른 학습·정리의 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "원래 등록 규칙의 양측 feature/type 또는 signed axis·source assignment·domain/context·split을 각각 충족해야 함. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "안전 위험이 있는 실전 시행착오 권장 금지",
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
    "id": "ckr:material:CH07.P1:learn-by-explain",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "내가 공부하는 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "함께 설명하며 배운 이해를 혼자 쓸 수 있는지 확인",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "학습 특징",
        "knowledge": "사회적 학습 선호를 짧은 설명 과제에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 학업 자료",
        "knowledge": "실제 학업 원천을 확인하되 성적 예측은 하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "명리 근거",
        "knowledge": "인성 상징은 배움 조건으로만 읽음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "적합한 방식",
        "knowledge": "대화 뒤 자료 없이 자기 답안을 작성",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fe11b875c7ad3a9c8318",
      "6aac2c369ca11d84cf6b"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "employee",
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:teaching"
    ],
    "positive": "질문으로 이해의 빈틈을 찾을 여지",
    "risk": "모두 이해한 느낌을 자기 이해로 오인",
    "factBomb": "친구의 설명을 따라 말하는 것과 혼자 원리를 쓰는 것은 다름",
    "twist": "잠깐 혼자 푸는 단계가 대화의 효과를 드러냄",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 개념을 설명한 뒤 조건 다른 문제를 혼자 풀기"
    },
    "economicScene": "모임 시간과 개인 연습 시간을 구분",
    "learningScene": "다시 설명할 때 빠진 전제를 찾기",
    "action": "함께 학습과 혼자 수행을 따로 확인",
    "counterexample": "타인의 실제 성과·유형을 만들어내지 않음",
    "distinctFromOtherParagraphs": "자신의 학습법이며 교육 직무 추천과 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "타인의 실제 성과·유형을 만들어내지 않음",
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
    "id": "ckr:material:CH07.P1:story-to-rule",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "내가 공부하는 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "이야기로 붙인 관심을 정확한 개념과 풀이로 연결",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "학습 특징",
        "knowledge": "낯선 개념을 구체 상황으로 바꾸는 선호",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 학업 자료",
        "knowledge": "INFP의 이야기 학습 원천은 언어 점수 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "명리 근거",
        "knowledge": "식신 표현 상징은 실제 학습 행동 확인이 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "적합한 방식",
        "knowledge": "예시를 벗어난 조건에서도 같은 원리를 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "90e77590d3ea07930ba1",
      "d5a3f16c5cef50521cd4"
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
      "student",
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:writing"
    ],
    "positive": "추상 개념에 접근할 여지",
    "risk": "흥미로운 이야기만 남고 정의를 놓칠 수 있음",
    "factBomb": "재미있게 기억해도 풀이에 필요한 조건은 빠질 수 있음",
    "twist": "흥미를 붙인 예시가 어려운 원리를 다시 읽을 입구가 됨",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 경제 개념을 생활 장면과 정의로 각각 정리"
    },
    "economicScene": "자료 제작과 필수 연습의 시간 구분",
    "learningScene": "예시에서 바뀌면 답이 달라질 조건 찾기",
    "action": "정의·예시·반례를 세 칸으로 작성",
    "counterexample": "학업 성과·지능·언어 능력을 유형으로 단정하지 않음",
    "distinctFromOtherParagraphs": "암기 일반론과 다른 관심·정확성의 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "학업 성과·지능·언어 능력을 유형으로 단정하지 않음",
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
    "id": "ckr:material:CH07.P1:structured-practice",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "내가 공부하는 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "분량의 완료와 이해의 확인을 다른 학습 기록으로 남기기",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "학습 특징",
        "knowledge": "꾸준한 학습 선호를 단계별 과제에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 학업 자료",
        "knowledge": "ISFJ 원천은 시험 결과가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "명리 근거",
        "knowledge": "관성 상징은 현재 규칙 분류·원국 조건 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "적합한 방식",
        "knowledge": "같은 문제의 조건을 바꾸어 혼자 풀이",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a",
      "4d87fbb51867b1899de4"
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
      "student",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:administration"
    ],
    "positive": "예측 가능한 학습 리듬을 만들 여지",
    "risk": "분량을 채운 날이면 이해도 끝났다고 느낌",
    "factBomb": "반복한 시간이 많아도 새로운 질문에서는 막힐 수 있음",
    "twist": "조건을 바꾼 작은 문제 하나가 진도보다 진짜 이해를 드러냄",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 새 절차를 다른 접수 사례에 적용"
    },
    "economicScene": "정리·반복·응용 연습의 시간 구분",
    "learningScene": "기존 문제와 새 문제를 나란히 검토",
    "action": "완료량과 혼자 설명한 범위를 따로 기록",
    "counterexample": "정확한 출생시간이 있어도 학업 능력을 보장하지 않음",
    "distinctFromOtherParagraphs": "공부의 규칙과 실제 이해를 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "정확한 출생시간이 있어도 학업 능력을 보장하지 않음",
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
    "id": "ckr:material:CH07.P2:photo-light-comparison",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "잘 배우는 분야와 환경",
    "researchKind": "mbti_application",
    "coreMeaning": "사진 기술은 조명 선택과 납품 목적을 같은 과제로 비교",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "흥미와 능력 조건",
        "knowledge": "흥미는 실제 촬영 과제를 통해 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "학습 근거",
        "knowledge": "실습 선호는 촬영 숙련의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "학습 활동",
        "knowledge": "같은 대상의 광원 방향 하나만 바꿔 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "환경",
        "knowledge": "바뀐 정보·분위기와 사용 조건을 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a78eebeaa12bff33d79b"
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
      "ckr:job:photography"
    ],
    "positive": "기술의 쓰임을 눈에 보이는 결과로 확인할 여지",
    "risk": "새 기법의 화려함을 목적 충족으로 착각",
    "factBomb": "기법을 배웠어도 사용자가 필요한 디테일이 사라질 수 있음",
    "twist": "단순한 조명이 목적에 더 맞는 결과를 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 상품의 질감과 색 정보가 다른 두 연습 컷"
    },
    "economicScene": "장비·연습·선별·보정 투입 구분",
    "learningScene": "동일 목적에서 한 조건만 바꾸기",
    "action": "학습 전후 납품 기준으로 비교",
    "counterexample": "실제 수요·장비 보유·고객 반응을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH06 장비 비용과 달리 기술 선택의 전이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 수요·장비 보유·고객 반응을 추정하지 않음",
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
    "id": "ckr:material:CH07.P2:dev-new-input",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "잘 배우는 분야와 환경",
    "researchKind": "mbti_application",
    "coreMeaning": "개발 학습 환경은 실패 입력을 시험하고 이유를 물을 수 있어야 함",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "흥미와 능력 조건",
        "knowledge": "흥미 분야와 혼자 수행하는 능력은 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "학습 근거",
        "knowledge": "원천의 수학·과학 관심을 지능 판정으로 쓰지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "학습 활동",
        "knowledge": "예제 밖의 누락 입력에서 코드가 달라지는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "환경",
        "knowledge": "실패를 설명할 피드백과 질문 통로를 찾음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0559dd6941aec884dc1a"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "job_seeker",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "원리 이해를 실행으로 검증할 여지",
    "risk": "예제를 따라친 것을 새 문제 해결로 인식",
    "factBomb": "강의를 이해해도 입력이 바뀌면 같은 함수를 못 만들 수 있음",
    "twist": "실패 입력 하나가 다음 강의보다 필요한 주제를 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 검증 함수에 빈 입력을 넣어보기"
    },
    "economicScene": "강의·실습·재현·피드백 시간 구분",
    "learningScene": "의도한 결과와 실제 실패 이유를 설명",
    "action": "다른 조건에서 도움 없이 수행",
    "counterexample": "고객 서비스·실전 데이터로 위험한 실험 금지",
    "distinctFromOtherParagraphs": "학습 환경을 구체적인 검증 조건으로 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객 서비스·실전 데이터로 위험한 실험 금지",
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
    "id": "ckr:material:CH07.P2:design-constraint-learning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "잘 배우는 분야와 환경",
    "researchKind": "mbti_application",
    "coreMeaning": "디자인 학습은 매체 제약을 바꿔 표현의 이유를 확인",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "흥미와 능력 조건",
        "knowledge": "예술 흥미는 전공 적합성 확정이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "학습 근거",
        "knowledge": "실제 원천과 과제 목적을 함께 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "학습 활동",
        "knowledge": "같은 내용을 큰 포스터와 작은 화면에 옮김",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "환경",
        "knowledge": "다른 조건에서도 전달할 정보를 지키는 연습",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "76c5466694297d1a36cf"
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
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "도구 사용을 목적 판단과 연결할 여지",
    "risk": "좋아하는 표현만 반복",
    "factBomb": "많은 기법이 있어도 읽히지 않는 결과의 이유는 따로 확인해야 함",
    "twist": "단순한 화면이 복잡한 표현보다 판단을 잘 보여줄 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 시안의 크기를 줄여 핵심 문구 확인"
    },
    "economicScene": "도구·제작·피드백 투입 구분",
    "learningScene": "작은 화면의 읽기 순서 비교",
    "action": "매체·대상·필수 정보부터 정리",
    "counterexample": "학생에게 고객·계약 경험을 만들지 않음",
    "distinctFromOtherParagraphs": "CH03 디자인 직업 선택과 다른 기술 전이 환경",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "학생에게 고객·계약 경험을 만들지 않음",
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
    "id": "ckr:material:CH07.P2:finance-scenario-learning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "잘 배우는 분야와 환경",
    "researchKind": "mbti_application",
    "coreMeaning": "재무 학습은 같은 합계에서 다른 가정을 구별하는 과제",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "흥미와 능력 조건",
        "knowledge": "학습 근거는 새 유형에 적응하는 원천",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "학습 근거",
        "knowledge": "현재 재무 전문성은 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "학습 활동",
        "knowledge": "가격·수량·시점을 바꾼 가상 전망을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "환경",
        "knowledge": "숫자뿐 아니라 왜 달라졌는지 설명하는 환경",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "eb4b0b7bcdda51afcf86"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
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
    "positive": "외운 계산을 판단 자료로 옮길 여지",
    "risk": "익숙한 답의 형태만 반복",
    "factBomb": "계산 결과가 같아도 의사결정의 조건은 다를 수 있음",
    "twist": "틀린 가정을 찾는 과제가 맞는 표를 만드는 것보다 배울 정보가 많음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 전망의 회수 시점만 변경"
    },
    "economicScene": "교재·자료 정리·검증 투입 구분",
    "learningScene": "가정을 한 개씩 바꿔 설명",
    "action": "새 조건의 반례와 피드백 확보",
    "counterexample": "실제 사업 전망·투자 판단을 예측하지 않음",
    "distinctFromOtherParagraphs": "학습을 암기와 꾸준함 하나로 축소하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 사업 전망·투자 판단을 예측하지 않음",
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
    "id": "ckr:material:CH07.P2:field-anomaly-learning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "잘 배우는 분야와 환경",
    "researchKind": "mbti_application",
    "coreMeaning": "현장 학습은 정상 순서와 이상을 전달할 조건을 같이 익히기",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "흥미와 능력 조건",
        "knowledge": "반복 확인 원천을 허용된 훈련에 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "학습 근거",
        "knowledge": "손기술 선호는 안전 능력의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "학습 활동",
        "knowledge": "가상 지연 기록에서 어느 단계에 전달할지 고름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "환경",
        "knowledge": "실습과 피드백은 실제 권한·안전 조건 안에서만",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "46b1ab895711e38e6215"
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
    "positive": "익숙한 요령의 한계를 알 여지",
    "risk": "대응 속도가 빠르면 확인을 생략할 수 있다고 생각",
    "factBomb": "개인이 고쳤다고 다음 공정의 안전이 확인된 것은 아님",
    "twist": "멈춰 알리는 판단도 배워야 할 수행",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 이상 상태를 현상·시간·확인 대상으로 기록"
    },
    "economicScene": "교육·확인·인계 투입의 구분",
    "learningScene": "표준과 예외를 비교하는 사례 검토",
    "action": "실제 교육 담당과 허용 범위 확인",
    "counterexample": "설비·위험 작업을 임의 시험하는 행동 금지",
    "distinctFromOtherParagraphs": "현장 기술의 안전한 학습 적용 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "설비·위험 작업을 임의 시험하는 행동 금지",
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
    "id": "ckr:material:CH07.P3:collecting-not-learning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "학업과 성장의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "새 자료 수집의 즐거움이 실제 수행 연습을 밀 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "가능한 실수",
        "knowledge": "가능한 실수는 모으는 것을 익히는 것으로 보는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "원인",
        "knowledge": "관심 전환 원천과 실제 학습 습관은 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "지속성 비용",
        "knowledge": "가상 자료 탭은 늘지만 설명 초고는 비어 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "학습 방법",
        "knowledge": "작은 완성 과제로 배운 범위를 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cca22a892a0cdcc5f2e8"
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
      "ckr:job:writing"
    ],
    "positive": "흥미를 실제 결과로 옮길 여지",
    "risk": "새 주제가 생길 때 필수 반복을 미룸",
    "factBomb": "자료 목록이 길어도 도움 없이 쓸 내용은 적을 수 있음",
    "twist": "짧은 완성의 제한이 오히려 새로운 질문을 만듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 읽기 자료 하나를 짧은 설명으로 작성"
    },
    "economicScene": "수집·읽기·작성 시간 구분",
    "learningScene": "자료 없이 핵심을 다시 설명",
    "action": "이번에 완성할 결과 하나 정하기",
    "counterexample": "새로운 자료가 실제 필수 정보일 때는 수집을 무조건 줄이지 않음",
    "distinctFromOtherParagraphs": "CH08 장기 성장 위험과 다른 학습 활동의 혼동",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "새로운 자료가 실제 필수 정보일 때는 수집을 무조건 줄이지 않음",
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
    "id": "ckr:material:CH07.P3:familiarity-trap",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "학업과 성장의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "익숙함과 원리 이해의 차이를 확인하는 약점 연구",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "가능한 실수",
        "knowledge": "가능한 실수는 답을 알아보는 느낌에 의존",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "원인",
        "knowledge": "연결 학습 필요 원천은 개인의 낮은 능력 판정 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "지속성 비용",
        "knowledge": "가상 예제의 조건이 바뀌면 답의 이유를 못 찾음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "학습 방법",
        "knowledge": "답을 가리고 다른 조건의 풀이를 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ed5c3e422134873cef0d"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:finance"
    ],
    "positive": "반복의 효과를 정확히 알 여지",
    "risk": "아는 문제만 더 오래 반복",
    "factBomb": "연습량이 많아도 바뀐 전제를 읽지 못하면 새 문제는 다름",
    "twist": "틀린 답을 비교하는 것이 외운 답을 늘리는 것보다 유용",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 계획표의 기간을 바꿔 다시 계산"
    },
    "economicScene": "반복·오답·전이 연습의 시간 구분",
    "learningScene": "왜 답이 달라지는지 설명",
    "action": "조건 하나를 바꾼 문제 추가",
    "counterexample": "실제 성적·시험 불안·학습 장애를 추정하지 않음",
    "distinctFromOtherParagraphs": "학업 성과 단정 없이 반복의 적용 한계 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 성적·시험 불안·학습 장애를 추정하지 않음",
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
    "id": "ckr:material:CH07.P3:perfection-start",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "학업과 성장의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "충분히 이해해야 시작한다는 기준이 수행 기회를 늦출 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "가능한 실수",
        "knowledge": "가능한 실수는 준비를 제출의 선행 조건으로 끝없이 확대",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "원인",
        "knowledge": "완벽주의 시작 원천은 실제 지연 경험이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "지속성 비용",
        "knowledge": "가상 분석 자료가 늘지만 작은 결과를 작성하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "학습 방법",
        "knowledge": "필수 설명부터 만들고 미확인 질문은 따로 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b7cf3c6e7279367349b5"
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
      "ckr:job:research"
    ],
    "positive": "깊이를 버리지 않고 수행할 여지",
    "risk": "모르는 것을 전부 해결해야 결과가 유효하다고 느낌",
    "factBomb": "한계가 남아도 쓸 수 있는 발견을 숨길 수 있음",
    "twist": "한계를 공개한 초안이 정확한 피드백을 받을 기회",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 보고서에 확인 범위와 보류 질문을 나눔"
    },
    "economicScene": "추가 읽기와 결과 작성 시간의 균형",
    "learningScene": "필수 주장 하나를 자료 없이 설명",
    "action": "작은 제출 기준을 먼저 정하기",
    "counterexample": "안전·정확성상 필수 검증을 생략하라는 뜻이 아님",
    "distinctFromOtherParagraphs": "CH01 업무 착수와 다른 배움에서 수행으로의 전환",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전·정확성상 필수 검증을 생략하라는 뜻이 아님",
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
    "id": "ckr:material:CH07.P3:activity-to-language",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "학업과 성장의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "직접 했던 선택을 용어와 이유로 남겨 다른 조건에 옮기기",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "가능한 실수",
        "knowledge": "가능한 실수는 잘된 장면의 느낌만 기억",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "원인",
        "knowledge": "짧은 오류 기록 원천은 필기 능력의 판정이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "지속성 비용",
        "knowledge": "가상 촬영에서 빛을 바꿨지만 왜 나아졌는지 설명이 없음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "학습 방법",
        "knowledge": "잘된 조건·안 된 조건을 짧게 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "331d66e109fedda15aa9"
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
      "ckr:job:photography"
    ],
    "positive": "현장 감각을 전달할 지식으로 만들 여지",
    "risk": "기록은 실습을 방해하는 일이라고 여김",
    "factBomb": "새 장비에서도 같은 결과를 내려면 손의 요령 밖의 설명이 필요",
    "twist": "짧은 단어 두 개가 다음 시행착오를 줄일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 연습 컷에 광원·움직임 조건을 표시"
    },
    "economicScene": "실습·선별·재시험 투입",
    "learningScene": "실패 컷에서 바꿀 한 조건 설명",
    "action": "실습 뒤 짧은 이유 기록",
    "counterexample": "실제 사진 촬영 경험과 장비를 보충하지 않음",
    "distinctFromOtherParagraphs": "새 기법 학습과 기존 경험 단정의 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 사진 촬영 경험과 장비를 보충하지 않음",
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
    "id": "ckr:material:CH07.P3:social-solo-gap",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "학업과 성장의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "함께 잘 설명해도 혼자 꺼낼 지식은 따로 확인해야 한다",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "가능한 실수",
        "knowledge": "가능한 실수는 모임의 이해를 개인 수행과 동일시",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "원인",
        "knowledge": "보호된 개인 공부 시간 원천은 내향성 판정 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "지속성 비용",
        "knowledge": "가상 학습 대화는 끝났지만 개인 풀이에서 막힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "학습 방법",
        "knowledge": "모임 뒤 짧은 독립 과제와 다시 설명을 연결",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b8b1788be86a366e0070"
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:teaching"
    ],
    "positive": "대화의 효과를 개인 지식으로 남길 여지",
    "risk": "다른 사람을 도우며 자기 약점을 확인할 시간을 잃음",
    "factBomb": "공부를 오래 함께해도 내 답안의 빈칸은 남을 수 있음",
    "twist": "혼자 풀 시간이 함께 배우는 재미를 더 살림",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 개념을 자료 없이 적고 친구 설명과 대조"
    },
    "economicScene": "모임·개인 연습·후속 질문의 시간 구분",
    "learningScene": "자기 풀이의 누락 전제를 찾기",
    "action": "함께 학습 후 혼자 확인 구간 확보",
    "counterexample": "실제 친구·학습 모임이 있다고 추정하지 않음",
    "distinctFromOtherParagraphs": "타인 교육 능력과 자기 학습 확인의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 친구·학습 모임이 있다고 추정하지 않음",
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
    "id": "ckr:material:CH07.P4:certificate-requirement",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "자격·기술·전문성 만들기",
    "researchKind": "mbti_application",
    "coreMeaning": "자격의 이름과 맡을 업무에 필요한 조건을 분리",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 분야 기준을 과제에 적용하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "능력의 가치",
        "knowledge": "매뉴얼 학습 원천이 합격·자격을 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "상태별 전략",
        "knowledge": "가상 공고의 요구와 교육 과정의 실습을 대조",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "실력 확인",
        "knowledge": "필요한 제도 요건은 실제 최신 자료로 별도 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b846da55e4e5cf6a302b"
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
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "student",
      "job_seeker",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:accounting"
    ],
    "positive": "선택할 배움의 목적을 좁힐 여지",
    "risk": "자격을 따면 수행과 취업도 자동 해결된다고 기대",
    "factBomb": "증서는 필요 조건일 수 있어도 모든 업무 능력을 보장하지 않음",
    "twist": "작은 과제가 자격 과정에서 필요한 빈틈을 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 과정에서 기준 대조를 직접 할 수 있는지"
    },
    "economicScene": "교육비·시험 준비·실습 시간 구분",
    "learningScene": "설명 없이 새로운 사례를 처리하는 연습",
    "action": "실제 공고·과정·권한의 조건부터 확인",
    "counterexample": "특정 자격 취득 권고·합격·채용 보장 금지",
    "distinctFromOtherParagraphs": "자격 제도와 실제 전문성의 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 자격 취득 권고·합격·채용 보장 금지",
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
    "id": "ckr:material:CH07.P4:portfolio-decision",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "자격·기술·전문성 만들기",
    "researchKind": "mbti_application",
    "coreMeaning": "포트폴리오는 좋은 화면뿐 아니라 판단 과정을 보여주는 자료",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 목적·대안·선택·검증 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "능력의 가치",
        "knowledge": "전략 자산 원천은 실제 포트폴리오 보유 정보가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "상태별 전략",
        "knowledge": "가상 시안에서 왜 한 안을 버렸는지 정리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "실력 확인",
        "knowledge": "과제의 조건과 개인 기여를 구분해 보여줌",
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
      "student",
      "job_seeker",
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "실력을 검토할 자료를 만들 여지",
    "risk": "선택 결과를 실제 고객 성과로 과장",
    "factBomb": "예쁜 완성 화면은 요구와 자신의 판단을 모두 설명하지 않음",
    "twist": "작은 과제의 솔직한 한계가 믿을 수 있는 설명",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 시안의 초고·변경 이유·남은 질문을 기록"
    },
    "economicScene": "자료 정리와 새 제작 투입을 구분",
    "learningScene": "다른 사람이 이유를 따라갈 수 있는지",
    "action": "가상 과제임을 표시하고 수행한 범위만 적기",
    "counterexample": "없는 의뢰·고객·계약·성과를 경력으로 쓰지 않음",
    "distinctFromOtherParagraphs": "CH06 대가 설명 전 실제 역량 자료의 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "없는 의뢰·고객·계약·성과를 경력으로 쓰지 않음",
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
    "id": "ckr:material:CH07.P4:work-based-upskill",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "자격·기술·전문성 만들기",
    "researchKind": "mbti_application",
    "coreMeaning": "일하면서 배울 기술은 실제 빈틈과 안전한 연습을 연결",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 익힌 도구를 기존 문제에 맞게 사용하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "능력의 가치",
        "knowledge": "실습 연결 원천은 현재 업무 경험 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "상태별 전략",
        "knowledge": "가상 반복 오류를 작은 연습 환경에서 재현",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "실력 확인",
        "knowledge": "기존 방식보다 무엇이 나아졌는지 확인",
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
      "employee",
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:software"
    ],
    "positive": "배움이 제공 범위에 연결될 여지",
    "risk": "새 도구를 배우자마자 실전 전부를 바꿈",
    "factBomb": "기술을 안다고 연결부·유지 조건까지 확인한 것은 아님",
    "twist": "작은 검증이 이후 실제 적용의 질문을 줄여줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 데이터로 새 검증 방식을 시험"
    },
    "economicScene": "연습·검토·도입·유지 투입을 구분",
    "learningScene": "다른 입력의 실패 조건 확인",
    "action": "실전 권한과 안전한 검증부터 확인",
    "counterexample": "고객 데이터·실전 시스템 임의 변경 지침 금지",
    "distinctFromOtherParagraphs": "기술 수료와 실제 제공 가능의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객 데이터·실전 시스템 임의 변경 지침 금지",
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
    "id": "ckr:material:CH07.P4:career-change-learning",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "자격·기술·전문성 만들기",
    "researchKind": "input_context",
    "coreMeaning": "전환을 위한 배움은 현재 생활과 다시 할 수 있는 범위를 먼저 확인",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전 과제는 새 역할의 작은 수행부터",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "능력의 가치",
        "knowledge": "이 상태들이 같은 생활이나 경험을 뜻하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "상태별 전략",
        "knowledge": "가상 관심 분야의 입문 과제를 짧게 수행",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "실력 확인",
        "knowledge": "흥미·부담·필요 지원을 기록한 뒤 다음 학습 선택",
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
      "homemaker",
      "unemployed",
      "other"
    ],
    "detailJobRefs": [],
    "positive": "새 선택을 강요 없이 탐색할 여지",
    "risk": "현재 생활을 모두 바꿔야 배울 수 있다고 생각",
    "factBomb": "큰 과정 등록이 반복 가능한 시간과 같지는 않음",
    "twist": "짧은 실습이 다음 배움의 필요를 더 분명히 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 입문 과제에서 도움받은 부분을 표시"
    },
    "economicScene": "배움 시간·생활 역할·외부 도움은 실제 정보 필요",
    "learningScene": "짧은 독립 과제 후 다시 할 범위 확인",
    "action": "상태별 프로필의 질문으로 분리 적용",
    "counterexample": "가족·질병·경력 단절·구직 의사 추정 금지",
    "distinctFromOtherParagraphs": "CH05 다음 선택과 다른 학습 범위의 실제 확인",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "가족·질병·경력 단절·구직 의사 추정 금지",
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
    "id": "ckr:material:CH07.P4:skill-repeatability",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "자격·기술·전문성 만들기",
    "researchKind": "mbti_application",
    "coreMeaning": "전문성은 한 번의 성공보다 조건과 한계를 설명하며 다시 수행하는 것",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "발전 능력",
        "knowledge": "발전할 능력은 문제 해결을 반복 가능한 절차로 남기는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "능력의 가치",
        "knowledge": "기술 문제 해결 원천은 숙련 등급이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "상태별 전략",
        "knowledge": "가상 이상 사례의 다른 조건에서 같은 판단이 통하는지 검토",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "실력 확인",
        "knowledge": "자기 권한과 확인할 전문 영역을 함께 밝힘",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b211b5d3637a2f223e18"
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
    "positive": "수행과 설명을 연결할 여지",
    "risk": "익숙한 해결을 모든 예외에 적용",
    "factBomb": "오래 한 요령도 새 조건에서는 다시 확인해야 함",
    "twist": "모르는 조건을 분명히 하는 것이 전문성의 일부",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 인계 사례에서 정상·예외·질의 지점을 분리"
    },
    "economicScene": "재수행·검토·훈련 투입 구분",
    "learningScene": "새 조건의 사례를 허용 범위에서 비교",
    "action": "결과·조건·한계를 함께 설명",
    "counterexample": "안전 기준과 자격을 대체하는 요령 제작 금지",
    "distinctFromOtherParagraphs": "시험·자격을 넘어 실제 적용 범위의 확인",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전 기준과 자격을 대체하는 요령 제작 금지",
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
