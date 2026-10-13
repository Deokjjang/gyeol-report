/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH01_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH01.P1:request-framing",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "타고난 업무 성향",
    "researchKind": "natal_application",
    "coreMeaning": "요청의 목적·완료 조건을 구분하는 착수 기능",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 업무 방식",
        "knowledge": "해야 할 양보다 완료 기준을 먼저 확인하는 방식",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "구체적 업무 상황",
        "knowledge": "신청서의 제출 목적과 처리 요건이 다른 가상 접수",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "그 방식의 장점",
        "knowledge": "공통 기준을 맞추면 담당자 사이의 되묻기를 줄일 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "기억할 업무 정체성",
        "knowledge": "직함보다 어떤 조건을 확인하는지가 업무 정체성",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a"
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
    "positive": "요청을 실행 가능한 약속으로 바꿀 여지",
    "risk": "기준 정리에 매달리며 질문을 미룰 수 있음",
    "factBomb": "완벽한 양식을 기다리면 실제 누락을 배울 기회도 늦어짐",
    "twist": "규칙을 좋아해도 예외 질의 통로를 만들면 조정에 기여",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "접수 전에 필요한 결과와 자료를 다른 칸에 적는 상황"
    },
    "economicScene": "서류 재제출의 시간을 줄이는 가치와 초기 확인의 투입 비교",
    "learningScene": "새 규정을 실제 사례와 대조하는 연습",
    "action": "가상 요청의 완료 기준 세 개를 질문으로 정리",
    "counterexample": "결과 기준이 이미 명확하면 확인을 반복할 이유가 적음",
    "distinctFromOtherParagraphs": "CH02 검토 능력 자체가 아니라 착수 때 정보를 요구하는 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "결과 기준이 이미 명확하면 확인을 반복할 이유가 적음",
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
    "id": "ckr:material:CH01.P1:hypothesis-first",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "타고난 업무 성향",
    "researchKind": "mbti_application",
    "coreMeaning": "원인 가설을 나누고 필요한 자료를 고르는 업무 출발점",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 업무 방식",
        "knowledge": "이유가 불분명할 때 설명 가능한 가설을 먼저 세우는 방향",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "구체적 업무 상황",
        "knowledge": "같은 지연을 인력 부족과 인계 누락으로 각각 설명하는 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "그 방식의 장점",
        "knowledge": "서로 다른 원인을 구분할 질문이 조사를 좁힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "기억할 업무 정체성",
        "knowledge": "질문을 고르는 방식과 지식의 양은 구별",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f666c10a6db231abcc92"
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
    "positive": "틀린 설명을 일찍 제외할 수 있음",
    "risk": "가능한 원인을 모두 같은 깊이로 조사할 수 있음",
    "factBomb": "조사한 양이 늘어도 다음 결정이 없으면 도움을 전달하기 어려움",
    "twist": "모른다고 말하는 태도가 성급한 단정보다 정확한 출발이 됨",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 운영 기록을 보기 전에 원인 후보 두 개를 쓰는 장면"
    },
    "economicScene": "조사 범위가 줄인 불확실성과 사용한 시간을 함께 봄",
    "learningScene": "맞지 않는 자료 한 개로 가설을 수정하는 연습",
    "action": "질문 하나가 어떤 선택을 바꿀지 적기",
    "counterexample": "확정 절차를 따르는 일에서는 원인 탐색이 우선이 아닐 수 있음",
    "distinctFromOtherParagraphs": "CH02 분석 결과의 품질보다 CH01 조사 시작의 정보 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "확정 절차를 따르는 일에서는 원인 탐색이 우선이 아닐 수 있음",
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
    "id": "ckr:material:CH01.P1:draft-as-question",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "타고난 업무 성향",
    "researchKind": "natal_application",
    "coreMeaning": "말로 모호한 요청을 작은 시안으로 확인하는 시작 방식",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 업무 방식",
        "knowledge": "첫 결과를 정답 대신 질문으로 쓰는 방향",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "구체적 업무 상황",
        "knowledge": "같은 브랜드 요청을 서로 다른 두 시안으로 보여주는 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "그 방식의 장점",
        "knowledge": "비교할 형태가 생기면 상대가 원하는 차이를 말하기 쉬움",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "기억할 업무 정체성",
        "knowledge": "초안의 역할은 결정할 질문을 선명하게 만드는 것",
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
    "positive": "불명확한 요구를 구체화할 여지",
    "risk": "취향 피드백을 매번 새 방향으로 받아들일 수 있음",
    "factBomb": "초안을 많이 만들수록 선택 기준이 없다는 문제를 가릴 수 있음",
    "twist": "빠른 초안도 폐기할 질문을 정하면 낭비가 줄어듦",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "최종 제작 전 색과 정보 순서만 다른 작은 시안 비교"
    },
    "economicScene": "초안 투입과 잘못된 방향의 전체 제작 비용을 구분",
    "learningScene": "한 요소만 바꾼 비교안으로 의도 설명 연습",
    "action": "두 시안에서 확인할 차이를 먼저 정하기",
    "counterexample": "안전·규정상 허용된 답이 정해졌다면 자유 시안은 부적절",
    "distinctFromOtherParagraphs": "CH03 추천 디자인 직업과 달리 시작할 때 표현을 정보로 쓰는 방식",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전·규정상 허용된 답이 정해졌다면 자유 시안은 부적절",
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
    "id": "ckr:material:CH01.P1:people-entry",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "타고난 업무 성향",
    "researchKind": "mbti_application",
    "coreMeaning": "상대가 어디서 막혔는지 듣고 과제의 입구를 정하는 방식",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 업무 방식",
        "knowledge": "같은 요청을 한 사람마다 필요한 안내가 다른지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "구체적 업무 상황",
        "knowledge": "수업 목표는 같은데 선행 이해가 다른 가상 학습자",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "그 방식의 장점",
        "knowledge": "필요를 구분하면 불필요한 설명과 방치 사이를 조절",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "기억할 업무 정체성",
        "knowledge": "사람을 살핀다는 말을 질문과 안내의 순서로 구체화",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cdc60c6b316ee8a858c1"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
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
    "positive": "처음부터 사용 가능한 지원을 설계할 수 있음",
    "risk": "상대의 모든 요청을 우선시할 위험",
    "factBomb": "좋은 출발을 돕다가 학습자의 몫까지 대신하면 결과를 확인하기 어려움",
    "twist": "도움을 줄이기 위해 먼저 충분히 묻는 경우도 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "수업 전 짧은 과제를 받아 어디서 멈췄는지 묻는 상황"
    },
    "economicScene": "준비·개별 안내 시간이 수업 시간 밖에 있음을 분리",
    "learningScene": "경청 뒤 실제 학습 목표를 다시 말하는 연습",
    "action": "상대가 원하는 도움과 필요한 준비를 나누기",
    "counterexample": "개별 요청을 확인할 입력이 없으면 사람별 필요를 단정하지 않음",
    "distinctFromOtherParagraphs": "CH04 소통 갈등보다 CH01 과제 착수의 대상 확인",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "개별 요청을 확인할 입력이 없으면 사람별 필요를 단정하지 않음",
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
    "id": "ckr:material:CH01.P1:capacity-entry",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "타고난 업무 성향",
    "researchKind": "natal_application",
    "coreMeaning": "가능한 투입과 지킬 결과를 동시에 확인하는 시작 방식",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 업무 방식",
        "knowledge": "새 일을 받을 때 현재 감당할 범위부터 비교하는 방향",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "구체적 업무 상황",
        "knowledge": "새 메뉴를 준비할 때 기존 주문과 마감 동선도 보는 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "그 방식의 장점",
        "knowledge": "실행 규모를 줄여 품질을 먼저 확인할 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "기억할 업무 정체성",
        "knowledge": "적게 시작하는 것이 항상 소극적인 선택은 아님",
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
      "ckr:job:cafe"
    ],
    "positive": "지속할 수 있는 작업 크기를 고를 여지",
    "risk": "가용 자원을 지나치게 적게 잡아 실험을 모두 미룰 수 있음",
    "factBomb": "절약만 남으면 무엇을 개선하려던 일인지 목적이 흐려짐",
    "twist": "작은 범위가 반복 검증의 기회를 늘릴 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "새 메뉴 한 종류를 제한된 준비량으로 시험하는 가상 운영"
    },
    "economicScene": "준비·폐기·청소 시간까지 합친 투입 비교",
    "learningScene": "작게 실행한 결과에서 다음에 바꿀 조건 찾기",
    "action": "결과와 투입을 한 쌍으로 기록",
    "counterexample": "실제 예산·운영량 없이 가능한 규모를 정답으로 제시할 수 없음",
    "distinctFromOtherParagraphs": "CH06 남는 자원 계산보다 착수 때 규모를 정하는 사고",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 예산·운영량 없이 가능한 규모를 정답으로 제시할 수 없음",
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
    "id": "ckr:material:CH01.P2:source-review-link",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 말하는 업무 방식",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "오류 확인과 원인 모델을 서로 다른 단계로 연결하는 조건부 Fusion",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "편인 근거는 원국의 탐구 상징으로 먼저 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "그 상징만으로 실제 디버깅 능력이 생기지는 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 MBTI 업무 특성",
        "knowledge": "INTJ 원천의 구조적 사고는 별도 선호 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "두 분석의 결합",
        "knowledge": "양측 조건이 있으면 발견한 오류를 원인 질문으로 연결",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "78ca1a3776c53c2d0b48",
      "7ff3a8b05b74a93b59af",
      "bfcb541ba28cf9dd0cce"
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
    "positive": "증상 확인 뒤 재발 조건을 살필 수 있는 조합",
    "risk": "검토와 모델이 같은 root이면 독립 사실을 늘리지 않음",
    "factBomb": "깊은 설명을 세웠다는 만족이 실제 오류 재현을 대신할 수 있음",
    "twist": "세부 확인과 큰 구조를 오가면 서로의 빈틈을 찾을 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "재현 입력은 찾았지만 발생 이유가 불분명한 가상 버그"
    },
    "economicScene": "추가 분석이 줄일 재작업과 분석 투입을 비교",
    "learningScene": "설명 모델로 예측한 입력을 실제 시험",
    "action": "양측 원천과 실제 과제를 각각 확인",
    "counterexample": "C002 성립 조건·source assignment가 없으면 조합 보류",
    "distinctFromOtherParagraphs": "CH01 근거 층위 설명이며 CH02 분석 재능 확정이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "원래 등록 규칙의 양측 feature/type 또는 signed axis·source assignment·domain/context·split을 각각 충족해야 함. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "C002 성립 조건·source assignment가 없으면 조합 보류",
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
    "id": "ckr:material:CH01.P2:source-expression-link",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 말하는 업무 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "식상 표현 상징과 창작 선호를 구분한 전달 연구",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "상관은 실제 원국 위치와 전체 조건을 확인할 전통 분류",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "표현 상징은 직업적 글쓰기 능력의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 MBTI 업무 특성",
        "knowledge": "ENFP 창작 분야 원천도 흥미와 활용 후보의 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "두 분석의 결합",
        "knowledge": "독자 질문에 답하는 결과를 만들 때 두 자료를 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6047f491aa9082328a86",
      "cf6e4b6c104165d3fff3"
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
      "ckr:job:writing"
    ],
    "positive": "관심 있는 내용을 바깥 결과로 시험할 여지",
    "risk": "같은 표현 의미를 두 체계가 반복할 수 있음",
    "factBomb": "출처가 둘이라는 이유로 전달 능력이 두 배 검증되지는 않음",
    "twist": "표현을 좋아해도 자료 검증을 더하면 설명의 신뢰가 생김",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 설명문의 문장과 근거를 따로 검토"
    },
    "economicScene": "제작 시간 외 자료 확인 시간을 구분",
    "learningScene": "초고에서 사실·의견·예시 표시",
    "action": "명리 상징·MBTI 선호·실제 작업을 다른 항목으로 기록",
    "counterexample": "사용자 유형이 ENFP가 아니면 이 유형 원천은 사용 불가",
    "distinctFromOtherParagraphs": "CH02 결과물 활용 이전에 근거가 무엇을 말하는지 한계를 밝힘",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "사용자 유형이 ENFP가 아니면 이 유형 원천은 사용 불가",
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
    "id": "ckr:material:CH01.P2:source-resource-link",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 말하는 업무 방식",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "재성의 전통 상징과 보상 판단 선호의 역할 구별",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "편재는 이미 계산된 원국 재성 분류를 확인할 때만 참조",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "재성의 존재는 실제 소득이나 사업 성공의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 MBTI 업무 특성",
        "knowledge": "ENTJ의 자원 판단 원천은 경제적 선택 선호 자료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "두 분석의 결합",
        "knowledge": "양측이 성립하면 제공할 결과와 대가를 비교하는 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "bbc18a4e615032647a49",
      "66a9cd49cd16d86ca992",
      "f7a5e64e8b2f2d997bb1"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      },
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
      "ckr:job:small_business"
    ],
    "positive": "기여를 막연한 칭찬 밖으로 설명할 여지",
    "risk": "성과 관심을 실제 재산 정보로 잘못 읽을 수 있음",
    "factBomb": "값을 받고 싶다는 마음과 시장에서 그 값을 받는 사실은 다름",
    "twist": "보상을 묻는 태도가 과업 범위를 명확하게 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 서비스에서 고객이 얻는 결과와 제공 범위를 나눔"
    },
    "economicScene": "실제 금액을 추정하지 않고 비용 항목만 비교",
    "learningScene": "상품 설명에서 제공 가치와 확인할 능력 구분",
    "action": "등록 Fusion의 유형·feature·domain 조건부터 확인",
    "counterexample": "원국 재성 또는 ENTJ 실제 입력이 없으면 조합 보류",
    "distinctFromOtherParagraphs": "CH06 수익 모델과 달리 원천이 지원하는 주장 범위를 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "원래 등록 규칙의 양측 feature/type 또는 signed axis·source assignment·domain/context·split을 각각 충족해야 함. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "원국 재성 또는 ENTJ 실제 입력이 없으면 조합 보류",
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
    "id": "ckr:material:CH01.P2:source-help-boundary",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 말하는 업무 방식",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "지원받는 인성 상징과 돌봄 직무 선호는 서로 다른 의미",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "정인의 생조 정의와 실제 원국 조건을 먼저 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "도움을 받는 상징을 남을 잘 돌보는 능력으로 바꾸지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 MBTI 업무 특성",
        "knowledge": "ISFJ의 구조화된 돌봄 원천은 별도로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "두 분석의 결합",
        "knowledge": "지원 자료를 익혀 정확한 인계를 연습하는 과제로 연결 가능",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fe11b875c7ad3a9c8318",
      "5d8f68e414bf0c19b5ed"
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
      "ckr:job:care"
    ],
    "positive": "배우는 조건과 실제 지원 기능을 함께 점검",
    "risk": "서로 다른 의미를 같은 돌봄으로 압축할 위험",
    "factBomb": "친절하다는 해석만으로 전문 권한이나 안전 숙련을 인정할 수 없음",
    "twist": "도움을 받는 법을 아는 것이 질문할 시점을 찾는 장점이 될 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "인계 문서를 읽고 모호한 항목을 담당자에게 묻는 가상 과제"
    },
    "economicScene": "누락 전달을 줄이는 가치와 확인 시간의 필요 구분",
    "learningScene": "관찰 사실과 자신의 해석을 따로 적기",
    "action": "의료 판단이 아닌 인계 기능에서만 연습",
    "counterexample": "실제 자격·원국·유형 조건이 없으면 전문 능력 주장 보류",
    "distinctFromOtherParagraphs": "receive와 give를 분리하며 CH04 대인 기능과 혼동하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "실제 자격·원국·유형 조건이 없으면 전문 능력 주장 보류",
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
    "id": "ckr:material:CH01.P2:source-two-sided-tempo",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 말하는 업무 방식",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "알고 시작하려는 근거와 해보며 배우는 선호의 조건부 차이",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "정인의 받음·배움 상징은 원국 근거로 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "충분한 설명을 원한다는 현대 적용은 별도 조건 필요",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 MBTI 업무 특성",
        "knowledge": "ESTP의 직접 경험 학습은 실제 원천을 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "두 분석의 결합",
        "knowledge": "낮은 위험의 연습과 반드시 알아야 할 기준을 나눠 비교",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fe11b875c7ad3a9c8318",
      "6293cdd44ddf08f38c74",
      "b02ceb60ba64a77dc688"
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
        "id": "sar:facet:ACTION_TEMPO:start-latency",
        "axis": "ACTION_TEMPO",
        "definition": "결론과 첫 행동 사이의 간격",
        "condition": "결론이 실제로 난 뒤의 간격을 비교",
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
    "positive": "설명과 실습이 다른 질문에 답할 수 있음",
    "risk": "차이를 모순된 성격이나 우열로 만들 수 있음",
    "factBomb": "직접 해보기가 전문 안전 기준을 건너뛸 허가가 되지 않음",
    "twist": "짧은 실습 뒤 읽는 설명이 구체적으로 와닿을 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "연습 재료로 시도한 뒤 실패 원인을 설명 자료와 비교"
    },
    "economicScene": "실습 재료 비용과 실제 제공 서비스의 비용을 구분",
    "learningScene": "해본 결과를 원리 용어와 연결",
    "action": "Fusion의 원래 contrast 조건과 허용 실습부터 확인",
    "counterexample": "신체·금전 손해가 가능한 실전에서 임의 실험 금지",
    "distinctFromOtherParagraphs": "CH07 학습법 처방 이전에 서로 다른 출처의 역할을 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "원래 등록 규칙의 양측 feature/type 또는 signed axis·source assignment·domain/context·split을 각각 충족해야 함. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "신체·금전 손해가 가능한 실전에서 임의 실험 금지",
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
    "id": "ckr:material:CH01.P3:start-finish-contract",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "일을 시작하고 끝내는 방식",
    "researchKind": "natal_application",
    "coreMeaning": "착수 정의·진행 확인·완료 검증을 서로 다른 행동으로 구별",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "시작 방식",
        "knowledge": "처음에는 요구를 확인할 사례로 정리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "진행 중 행동",
        "knowledge": "중간에는 요구 변경과 구현 오류를 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "마무리 방식",
        "knowledge": "끝에는 처음 약속한 동작이 유지되는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "효과적인 조건과 주의점",
        "knowledge": "계획을 지키는 것과 목적을 지키는 것을 함께 점검",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a"
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
      "ckr:job:software"
    ],
    "positive": "세 단계의 판단을 인계할 수 있음",
    "risk": "착수 때 정한 조건을 변경 불가능한 답으로 여길 수 있음",
    "factBomb": "계획은 완벽해도 변경 이력이 없으면 완료 판단이 어긋남",
    "twist": "중간 예외를 기록하면 기준을 고집하지 않고 보존 가능",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 기능의 요구·변경·검증 칸을 따로 쓰는 장면"
    },
    "economicScene": "재작업의 원인이 추가 요구인지 결함인지 구분",
    "learningScene": "요구 하나를 검증 사례로 바꾸는 연습",
    "action": "변경의 이유와 영향받는 완료 기준을 남기기",
    "counterexample": "명확한 입력이 없으면 실제 업무 단계 수행을 주장하지 않음",
    "distinctFromOtherParagraphs": "CH01 시간 순서의 기능으로 CH02 정확성의 결과 가치와 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "명확한 입력이 없으면 실제 업무 단계 수행을 주장하지 않음",
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
    "id": "ckr:material:CH01.P3:iterate-selected-idea",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "일을 시작하고 끝내는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "탐색을 닫는 시점과 제작을 이어갈 시점을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "시작 방식",
        "knowledge": "착수에서는 메시지 후보를 넓힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "진행 중 행동",
        "knowledge": "진행에서는 선택한 이야기의 자료를 맞춤",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "마무리 방식",
        "knowledge": "완료에서는 같은 메시지가 출력에서도 살아 있는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "효과적인 조건과 주의점",
        "knowledge": "새 생각은 이번 수정과 다음 기획으로 구분",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cd19631fd0781dd2ef4c"
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
      "ckr:job:video"
    ],
    "positive": "발상이 납품 가능한 결과로 이어질 여지",
    "risk": "후반에 새 콘셉트를 계속 끼워 넣을 수 있음",
    "factBomb": "창의적인 변경이 이미 합의한 검토를 처음으로 되돌릴 수 있음",
    "twist": "미채택 아이디어를 따로 두면 완성과 새로움을 함께 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "초벌 편집 뒤 다른 이야기 구성이 떠오른 가상 작업"
    },
    "economicScene": "재편집과 단순 길이 조정의 투입 차이",
    "learningScene": "같은 소재로 다른 길이의 편집 결과 비교",
    "action": "이번 목적을 바꾸는 제안인지 먼저 묻기",
    "counterexample": "기획 자체를 검증 중인 단계라면 방향 변경이 필요한 경우도 있음",
    "distinctFromOtherParagraphs": "착수·진행·완료 사이의 전환 기준으로 CH03 영상 추천과 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "기획 자체를 검증 중인 단계라면 방향 변경이 필요한 경우도 있음",
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
    "id": "ckr:material:CH01.P3:handoff-finish",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "일을 시작하고 끝내는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "자기 작업 완료와 다음 작업 가능의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "시작 방식",
        "knowledge": "시작할 때 다음 공정이 필요로 하는 상태를 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "진행 중 행동",
        "knowledge": "진행 중 지연과 품질 변화를 전달",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "마무리 방식",
        "knowledge": "끝에는 남은 예외와 다음 담당의 확인 지점을 남김",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "효과적인 조건과 주의점",
        "knowledge": "완료는 내 할 일 삭제만으로 판단하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "51a36ebd6ebe0593251c"
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
    "positive": "예측 가능한 연결을 남길 수 있음",
    "risk": "모든 후속 문제를 자신의 책임으로 가져올 수 있음",
    "factBomb": "끝까지 책임지려는 의도가 인계 없는 상시 대기로 바뀔 수 있음",
    "twist": "남은 문제를 공개하는 것이 미완성 숨기기보다 신뢰를 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "앞 공정은 끝났지만 표기가 빠진 가상 인계"
    },
    "economicScene": "재확인·대기 시간이 어디에서 생기는지 비교",
    "learningScene": "다음 담당자가 다시 묻는 정보를 정리",
    "action": "인계받는 사람이 필요한 정보부터 묻기",
    "counterexample": "후속 공정 정보가 없으면 완료 기준을 임의 결정하지 않음",
    "distinctFromOtherParagraphs": "CH04 역할 갈등보다 CH01 마무리 행동의 정의",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "후속 공정 정보가 없으면 완료 기준을 임의 결정하지 않음",
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
    "id": "ckr:material:CH01.P3:timeboxed-inquiry",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "일을 시작하고 끝내는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "조사 착수·반례 검토·한계 보고의 구별",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "시작 방식",
        "knowledge": "처음에는 조사로 바꿀 결정을 정함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "진행 중 행동",
        "knowledge": "중간에는 설명에 맞지 않는 자료를 살핌",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "마무리 방식",
        "knowledge": "끝에는 확인한 범위와 미확인 질문을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "효과적인 조건과 주의점",
        "knowledge": "자료가 모두 모이는 순간을 완료 조건으로 삼지 않음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1c5899365d6cd736a8"
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
    "positive": "불확실해도 쓸 수 있는 결과를 전달",
    "risk": "질문이 흥미로울수록 종료를 늦출 수 있음",
    "factBomb": "조사 미완료라는 이유로 쓸 수 있는 발견도 묻힐 수 있음",
    "twist": "한계를 남기면 확실한 척하지 않고도 다음 결정을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "보고일까지 한 가설이 남은 가상 분석"
    },
    "economicScene": "추가 조사가 바꿀 판단과 미룰 실행을 비교",
    "learningScene": "반례 한 개가 결론을 어디까지 바꾸는지 설명",
    "action": "정한 질문에 답한 범위부터 제출하기",
    "counterexample": "안전상 미확인 상태에서 진행할 수 없는 결정은 별도 중단",
    "distinctFromOtherParagraphs": "CH02 깊이 능력보다 조사 단계별 종료 기준",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "안전상 미확인 상태에서 진행할 수 없는 결정은 별도 중단",
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
    "id": "ckr:material:CH01.P3:feedback-loop-entry",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "일을 시작하고 끝내는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "반응을 받을 시점을 업무 단계 안에 두는 방식",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "시작 방식",
        "knowledge": "시작할 때 고객의 실제 요청을 되묻기",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "진행 중 행동",
        "knowledge": "진행 중 안내를 사용할 수 있는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "마무리 방식",
        "knowledge": "끝에는 해결과 다음 연결을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "효과적인 조건과 주의점",
        "knowledge": "좋은 반응을 완료로 착각하지 않는 기준",
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
      "ckr:job:customer_support"
    ],
    "positive": "즉각적인 반응을 작업 개선 정보로 쓸 수 있음",
    "risk": "상대의 기분만 따라 안내를 바꿀 수 있음",
    "factBomb": "친절한 대화가 길어도 문제는 다음 단계에 그대로 남을 수 있음",
    "twist": "짧은 확인 질문이 긴 설명보다 빠른 해결을 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 안내 뒤 고객이 어느 버튼에서 멈추는지 묻기"
    },
    "economicScene": "재문의와 긴 통화의 투입을 별도로 봄",
    "learningScene": "관찰한 반응과 해석을 구분하는 연습",
    "action": "마지막에 상대가 할 수 있는 행동을 확인",
    "counterexample": "즉시 반응을 받을 수 없는 과제에는 다른 검토 방식 필요",
    "distinctFromOtherParagraphs": "CH04 정서적 협업이 아니라 진행 정보의 수집 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "즉시 반응을 받을 수 없는 과제에는 다른 검토 방식 필요",
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
    "id": "ckr:material:CH01.P4:permission-to-correct",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 맞는 일의 조건",
    "researchKind": "natal_application",
    "coreMeaning": "검토할 자료와 수정 권한이 함께 있어야 정확성을 활용",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "능력이 살아나는 환경",
        "knowledge": "원자료를 볼 수 있는 환경이 검토 기능을 살림",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "적합한 이유",
        "knowledge": "합계와 증빙을 같은 기준으로 비교할 수 있어야 함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "불편한 조건",
        "knowledge": "수정 제안이 실제 반영될 경로가 없는 곳에서는 부담만 남을 수 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "선택 기준",
        "knowledge": "자료 접근과 이의 제기 통로를 선택 질문으로 삼음",
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
    "positive": "오류 예방을 공동 작업으로 만들 여지",
    "risk": "검토자에게 무제한 책임만 남을 수 있음",
    "factBomb": "정확하라는 요구가 자료 접근을 대신하지는 못함",
    "twist": "질문이 허용되는 환경에서는 모름을 밝히는 것도 전문성",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 검토에서 필요한 증빙이 없는 상태"
    },
    "economicScene": "추가 자료 요청 시간과 마감 변경을 함께 검토",
    "learningScene": "어떤 기준을 배울 수 있는지 확인",
    "action": "자료·권한·납기를 각각 묻기",
    "counterexample": "단순 참고 역할이면 최종 수정 권한을 요구할 이유가 다를 수 있음",
    "distinctFromOtherParagraphs": "CH03 회피 직업이 아닌 자신의 기능이 작동할 작업 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "단순 참고 역할이면 최종 수정 권한을 요구할 이유가 다를 수 있음",
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
    "id": "ckr:material:CH01.P4:autonomy-with-checkpoint",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 맞는 일의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "방법 재량과 연결부 확인을 함께 갖춘 자율성",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "능력이 살아나는 환경",
        "knowledge": "책임질 결과가 명확할 때 방법을 고를 여지가 도움",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "적합한 이유",
        "knowledge": "구현 방식은 달라도 연결 규격은 공유해야 함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "불편한 조건",
        "knowledge": "고립된 단독 작업이 항상 자율성을 뜻하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "선택 기준",
        "knowledge": "결과·안전·공유 시점을 환경 질문으로 묻기",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1decd822e13cf76d8f8e"
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
    "positive": "판단을 기다리는 시간을 줄일 여지",
    "risk": "자기 방법을 설명하지 않아 연결 단계에서 오해 발생",
    "factBomb": "간섭을 줄이려다 필요한 정보까지 닫으면 재량도 줄어들 수 있음",
    "twist": "중간 근거를 짧게 공유하면 더 큰 자율성을 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 모듈을 독립 구현하지만 연결 규격은 맞춰야 하는 상황"
    },
    "economicScene": "혼자 고른 도구의 이후 유지 투입도 비교",
    "learningScene": "다른 구현과 선택 이유를 설명하는 연습",
    "action": "방법의 재량과 변경 승인 범위를 나누기",
    "counterexample": "자격·안전 기준이 정한 방법은 재량 대상이 아닐 수 있음",
    "distinctFromOtherParagraphs": "CH04 조직문화 평가보다 자율성이 작동할 경계 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자격·안전 기준이 정한 방법은 재량 대상이 아닐 수 있음",
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
    "id": "ckr:material:CH01.P4:protected-depth-window",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 맞는 일의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "집중 시간과 필요한 응답 시간을 구분하는 환경",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "능력이 살아나는 환경",
        "knowledge": "자료를 연결할 시간이 확보되면 깊은 설명을 시도 가능",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "적합한 이유",
        "knowledge": "상시 응답과 조사 작업을 같은 시간으로 요구하는지 살핌",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "불편한 조건",
        "knowledge": "집중이 필요하다는 말은 협업을 하지 않겠다는 뜻이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "선택 기준",
        "knowledge": "응답 창구와 중간 공유 시간을 함께 제안",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "248692af90259c9eebe4"
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
      "ckr:job:writing"
    ],
    "positive": "끊어진 생각을 다시 잇는 낭비를 줄일 여지",
    "risk": "집중 보호가 피드백 차단으로 바뀔 수 있음",
    "factBomb": "혼자 오래 썼다는 사실만으로 독자에게 필요한 글이 되지는 않음",
    "twist": "예정된 짧은 피드백이 오히려 깊은 작업을 보호",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 취재 글의 조사 시간과 질의 응답 시간을 나누기"
    },
    "economicScene": "중단 후 재착수·추가 조사 투입 비교",
    "learningScene": "초고의 핵심 주장만 먼저 검토받는 연습",
    "action": "정해진 공유 시점과 집중 구간을 합의",
    "counterexample": "긴급 대응이 핵심인 직무는 연속 집중을 동일하게 확보하기 어려움",
    "distinctFromOtherParagraphs": "CH07 공부 환경과 달리 결과를 전달해야 하는 업무 집중 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "긴급 대응이 핵심인 직무는 연속 집중을 동일하게 확보하기 어려움",
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
    "id": "ckr:material:CH01.P4:change-with-baseline",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 맞는 일의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "빠른 대응에 필요한 내부 확인 통로",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "능력이 살아나는 환경",
        "knowledge": "조건이 달라지면 제공할 범위를 다시 확인할 수 있어야 함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "적합한 이유",
        "knowledge": "고객 앞에서 즉시 답할 항목과 내부에 물을 항목을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "불편한 조건",
        "knowledge": "유연성을 지킬 수 없는 약속으로 쓰지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "선택 기준",
        "knowledge": "확인 담당자와 응답 시점을 선택 기준으로 삼음",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c92cbae7d0a74770dee8"
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
    "positive": "현장 반응을 제안 수정에 쓸 여지",
    "risk": "승인 없는 예외 약속을 먼저 할 수 있음",
    "factBomb": "좋은 대응 속도가 제공 팀의 야근으로 이전될 수 있음",
    "twist": "바로 모른다고 말하고 확인 시점을 정하는 것이 신뢰를 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 고객이 갑자기 납기 단축을 요청"
    },
    "economicScene": "긴급 대응과 기존 고객 약속의 투입을 함께 검토",
    "learningScene": "확인 필요한 요구를 빠르게 분류하는 연습",
    "action": "즉답과 재확인 항목을 미리 나누기",
    "counterexample": "제공 범위가 고정된 상황에서는 약속 조정 여지가 없음",
    "distinctFromOtherParagraphs": "직업 추천이 아닌 현장 적응에 필요한 정보 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "제공 범위가 고정된 상황에서는 약속 조정 여지가 없음",
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
    "id": "ckr:material:CH01.P4:mission-with-basics",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 맞는 일의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "일의 의미와 반복 기초 업무를 이어 보는 환경",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "능력이 살아나는 환경",
        "knowledge": "도움을 주는 목적과 실제 지원 절차가 연결될 때 몰입할 여지",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "적합한 이유",
        "knowledge": "기록과 연결 업무가 어떤 도움을 가능하게 하는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "불편한 조건",
        "knowledge": "보람이 준비·회복 비용을 없애지는 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "선택 기준",
        "knowledge": "좋은 목적과 지속 가능한 범위를 함께 묻기",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0cc422b5a853b4a67ac0"
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
      "ckr:job:counsel_support"
    ],
    "positive": "중요한 가치를 현실 과제로 옮길 여지",
    "risk": "의미가 적어 보이는 기초 작업을 미룰 수 있음",
    "factBomb": "도움을 주고 싶다는 마음만으로 전문 경계가 생기지는 않음",
    "twist": "기록을 남기는 조용한 일도 지원이 끊기지 않게 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 지원 요청 뒤 다음 담당에게 필요한 정보 정리"
    },
    "economicScene": "상담 시간 밖 후속 연결·준비 투입을 분리",
    "learningScene": "지원 목적을 절차의 각 단계와 연결",
    "action": "왜 필요한 기초 작업인지 질문",
    "counterexample": "현재 역할과 지원 대상이 없으면 실제 보람을 경험했다고 말하지 않음",
    "distinctFromOtherParagraphs": "CH08 좋은 기운이 아니라 일을 지속할 목적과 절차의 관계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 역할과 지원 대상이 없으면 실제 보람을 경험했다고 말하지 않음",
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
