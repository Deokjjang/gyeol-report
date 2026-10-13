/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH06_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH06.P1:wealth-not-balance",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "나는 어떤 방식으로 돈을 버는 사람인가",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "재성 상징·수입 선호·실제 자산 정보는 서로 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "수익 관련 경향",
        "knowledge": "반복 가치와 자원을 살피는 수익 활동 후보",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "명리 재물 근거",
        "knowledge": "정재의 계산 근거는 원국의 분류로 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "MBTI 판단 선호",
        "knowledge": "ISTJ의 안정 수입 선호도 실제 소득 자료는 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "가치 생산 방식",
        "knowledge": "누구에게 무엇을 계속 제공할지로 경제 질문 전환",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e2ed5b09b1f8185708cd",
      "9742bfa47ad032c7c9f8"
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
    "positive": "지속할 가치의 조건을 볼 여지",
    "risk": "재성을 실제 부나 안정 수입의 보증으로 읽음",
    "factBomb": "돈을 차곡차곡 남기고 싶어도 확보한 돈의 양은 별도 사실",
    "twist": "규칙적인 제공 가치가 큰 금액 예측보다 실용적인 질문",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 정기 자료 제공의 사용 목적 확인"
    },
    "economicScene": "반복 제공·유지·변경에 드는 투입 구분",
    "learningScene": "같은 품질을 다른 조건에 제공할 과제",
    "action": "원국 재성·본인 유형·실제 과제를 따로 확인",
    "counterexample": "자산·급여·수익률을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH01 근거 소개가 아닌 수익 활동과 자산 사실의 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "자산·급여·수익률을 추정하지 않음",
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
    "id": "ckr:material:CH06.P1:opportunity-to-demand",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "나는 어떤 방식으로 돈을 버는 사람인가",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "새 기회 상징을 실제 수요를 묻는 과정으로 제한",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "수익 관련 경향",
        "knowledge": "수익 관련 질문은 관심을 제공 가능한 결과로 좁히는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "명리 재물 근거",
        "knowledge": "편재 상징은 거래 성공이나 재산이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "MBTI 판단 선호",
        "knowledge": "ENTP 원천의 아이디어 수익 필터를 별도 선호로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "가치 생산 방식",
        "knowledge": "실제 필요한 사용처와 제공 조건을 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "bbc18a4e615032647a49",
      "51b0bd2bbf8f57a25a91"
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
      "ckr:job:marketing"
    ],
    "positive": "가능성을 검증 가능한 제안으로 만들 여지",
    "risk": "관심 반응을 매출 확정으로 볼 수 있음",
    "factBomb": "좋은 아이디어가 많아도 누가 어떤 결과를 필요한지는 비어 있을 수 있음",
    "twist": "보류할 조건을 정하면 준비를 필요한 기회에 남길 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 캠페인 문의를 사용 문제와 호기심으로 분리"
    },
    "economicScene": "준비·제작·응대 투입과 실제 거래는 별도",
    "learningScene": "작은 제안의 반응을 기록",
    "action": "등록 조건과 실제 수요 자료를 확인",
    "counterexample": "사주·MBTI로 사업 성공을 보장하지 않음",
    "distinctFromOtherParagraphs": "CH03 market 직무 후보와 다른 수익 성립 질문",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "양측 자료의 조건부 연구이며 새 등록 Fusion이 아님. 명리·MBTI를 독립 점수나 인과로 합치지 않음.",
      "input": "사주·MBTI로 사업 성공을 보장하지 않음",
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
    "id": "ckr:material:CH06.P1:expertise-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "나는 어떤 방식으로 돈을 버는 사람인가",
    "researchKind": "mbti_application",
    "coreMeaning": "전문성을 돈으로 설명하려면 다른 사람의 판단에 쓸 결과가 필요",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "수익 관련 경향",
        "knowledge": "깊이 아는 것과 값을 지불할 결과를 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "명리 재물 근거",
        "knowledge": "실제 MBTI 전문성 수입 원천도 시장 검증과 별개",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "MBTI 판단 선호",
        "knowledge": "가상 조사로 불확실했던 결정의 조건을 좁힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "가치 생산 방식",
        "knowledge": "시간 대신 해결할 질문과 결과의 한계를 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "58333fe1ce51da5e5389"
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
      "ckr:job:research"
    ],
    "positive": "전문 기여를 구체화할 여지",
    "risk": "오래 조사한 것을 높은 가치로 동일시",
    "factBomb": "노력한 시간이 길어도 의뢰인의 질문과 다르면 쓸 수 없음",
    "twist": "짧은 판단 기준이 긴 보고서보다 높은 쓸모를 가질 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 보고에서 어떤 결정이 바뀔지 먼저 묻기"
    },
    "economicScene": "조사 범위·자료 접근·추가 확인 투입 분리",
    "learningScene": "복잡한 설명을 결정 자료로 요약",
    "action": "실제 사용자·과제·사용 조건부터 확인",
    "counterexample": "시장 가격·수입 규모·전문 자격은 보장하지 않음",
    "distinctFromOtherParagraphs": "분석의 재능과 다른 수요자·사용처 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "시장 가격·수입 규모·전문 자격은 보장하지 않음",
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
    "id": "ckr:material:CH06.P1:service-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "나는 어떤 방식으로 돈을 버는 사람인가",
    "researchKind": "mbti_application",
    "coreMeaning": "지원의 경제적 가치는 대신한 양보다 해결한 막힘에서 설명",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "수익 관련 경향",
        "knowledge": "서비스 선호를 실제 제공할 결과와 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "명리 재물 근거",
        "knowledge": "친절 원천은 현재 수입이나 고객 만족 자료가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "MBTI 판단 선호",
        "knowledge": "가상 안내로 반복 문의의 원인을 없앰",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "가치 생산 방식",
        "knowledge": "제공 범위와 준비·후속 지원 조건이 있어야 지속",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ede4c870287adb0ff868"
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
      "ckr:job:customer_support"
    ],
    "positive": "보이지 않는 지원을 설명할 여지",
    "risk": "고마움을 보상 합의로 착각",
    "factBomb": "좋은 관계가 준비와 추가 응대의 투입을 자동 보상하지 않음",
    "twist": "지원 종료 기준이 서비스의 신뢰를 높일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 고객의 신청 막힘을 해결하고 다음 도움 통로 안내"
    },
    "economicScene": "응대·자료 유지·후속 연결 시간을 구분",
    "learningScene": "지원 전후에 혼자 할 수 있는 단계 확인",
    "action": "값을 받을 결과와 호의를 구분",
    "counterexample": "현재 고객 수·실적·금액을 만들지 않음",
    "distinctFromOtherParagraphs": "모든 돈 문제를 절약으로 환원하지 않는 제공 가치",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 고객 수·실적·금액을 만들지 않음",
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
    "id": "ckr:material:CH06.P1:skill-to-use",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "나는 어떤 방식으로 돈을 버는 사람인가",
    "researchKind": "mbti_application",
    "coreMeaning": "기술을 안다는 사실과 사용할 결과를 제공하는 것은 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "수익 관련 경향",
        "knowledge": "기술 문제 해결을 수익 활동의 후보로 검토",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "명리 재물 근거",
        "knowledge": "기술 수입 원천도 실제 숙련과 거래를 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "MBTI 판단 선호",
        "knowledge": "가상 도구가 반복 작업의 어느 단계를 바꾸는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "가치 생산 방식",
        "knowledge": "사용·유지·설명 범위를 정해야 기여를 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "58f001425acf022b0d6b"
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
      "ckr:job:software"
    ],
    "positive": "손에 익은 기능을 필요한 결과로 연결할 여지",
    "risk": "작동하는 결과면 사용자는 저절로 생긴다고 생각",
    "factBomb": "제작 후 지원과 유지가 비어 있으면 제공 약속을 지키기 어려움",
    "twist": "작은 기술도 반복 문제에 맞으면 유용",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 작업 도구의 입력·출력·오류 대응을 설명"
    },
    "economicScene": "구현·설치·유지·지원 투입 구분",
    "learningScene": "다른 입력과 환경에서도 검증",
    "action": "필요한 문제와 제공할 범위를 먼저 질문",
    "counterexample": "수입·계약·기술 자격 자동 확정 금지",
    "distinctFromOtherParagraphs": "CH07 기술 습득과 다른 경제적 사용 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "수입·계약·기술 자격 자동 확정 금지",
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
    "id": "ckr:material:CH06.P2:photo-use-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "수익으로 이어질 수 있는 능력",
    "researchKind": "natal_application",
    "coreMeaning": "사진 결과의 가치는 촬영량보다 실제 사용할 목적과 조건",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "검증된 재능",
        "knowledge": "검증한 표현 재능이 있을 때만 후보",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "근거",
        "knowledge": "식신 근거는 작품·납품 능력의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "직업적 활용",
        "knowledge": "가상 상세페이지에서 필요한 정보가 보이는 컷 선택",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "경제적 가치 조건",
        "knowledge": "사용 매체·규격·수정 범위를 합의해야 제공 가치",
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
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "시각 결과의 쓸모를 설명할 여지",
    "risk": "작품 완성도만 대가의 근거로 사용",
    "factBomb": "촬영이 빨라도 선별·보정·응대가 작업 전체를 늘릴 수 있음",
    "twist": "일부 컷을 제외하는 선택이 납품 가치를 높일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 상품 촬영의 대표 컷과 설명 컷을 구분"
    },
    "economicScene": "준비·현장·보정·사용 범위·출력 버전의 투입",
    "learningScene": "용도별 선정 기준을 작은 견본으로 설명",
    "action": "실제 의뢰의 목적을 확인한 뒤 범위 질문",
    "counterexample": "고객·가격·장비·이전 계약을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH05 판단 성장과 달리 결과를 제공할 경제 계약",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객·가격·장비·이전 계약을 추정하지 않음",
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
    "id": "ckr:material:CH06.P2:employee-contribution",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "수익으로 이어질 수 있는 능력",
    "researchKind": "mbti_application",
    "coreMeaning": "직장인 기여는 수행량과 의사결정 변화의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "검증된 재능",
        "knowledge": "검증된 검토 재능의 실제 역할만 설명",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "근거",
        "knowledge": "원천은 보상 수준의 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "직업적 활용",
        "knowledge": "가상 예산 자료가 부서의 비교 질문을 명확히 함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "경제적 가치 조건",
        "knowledge": "어떤 자료로 무엇을 바꿨는지 남겨 평가에 쓸 수 있음",
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
    "positive": "조용한 예방 작업을 설명할 여지",
    "risk": "모든 절감과 최종 성과를 자신의 공으로 귀속",
    "factBomb": "큰 결과와 내 작업 사이의 기여를 따로 확인해야 함",
    "twist": "작은 오류 예방 기록이 막연한 야근량보다 명확",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 중복 집계 확인 전후 보고 차이 기록"
    },
    "economicScene": "재처리 시간·자료 준비·검토 투입 분리",
    "learningScene": "성과 설명에서 외부 조건과 자기 기여 구분",
    "action": "실제 평가 기준과 관찰된 결과를 확인",
    "counterexample": "급여 인상·승진·실제 회사 절감액 보장 금지",
    "distinctFromOtherParagraphs": "가격 조언이 아닌 근거 있는 직업 기여 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "급여 인상·승진·실제 회사 절감액 보장 금지",
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
    "id": "ckr:material:CH06.P2:cafe-unit-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "수익으로 이어질 수 있는 능력",
    "researchKind": "natal_application",
    "coreMeaning": "자영업의 상품 가치는 판매 뒤 남는 자원과 반복 품질을 함께 본다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "검증된 재능",
        "knowledge": "검증된 운영 강점의 과제에 한정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "근거",
        "knowledge": "재성은 실제 이익을 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "직업적 활용",
        "knowledge": "가상 메뉴의 준비·제공·폐기·정리 투입을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "경제적 가치 조건",
        "knowledge": "판매량과 운영 부담을 따로 확인해야 확대를 비교",
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
      "self_employed"
    ],
    "detailJobRefs": [
      "ckr:job:cafe"
    ],
    "positive": "상품별 감당할 운영을 볼 여지",
    "risk": "매출이 큰 상품이 항상 유리하다고 판단",
    "factBomb": "많이 팔려도 다른 주문을 밀면 전체 기여는 다를 수 있음",
    "twist": "작은 메뉴가 전체 경험과 마감 여유를 지킬 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 인기 메뉴의 긴 준비가 대기 흐름을 바꿈"
    },
    "economicScene": "재료·폐기·고정 부담·시간은 서로 다른 항목",
    "learningScene": "조건 하나를 바꾼 운영 비교",
    "action": "실제 자료가 있는 상품 하나부터 질문",
    "counterexample": "판매량·원가·이익 수치를 추정하지 않음",
    "distinctFromOtherParagraphs": "재물운 일반론과 다른 반복 제공·전체 운영의 가치",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "판매량·원가·이익 수치를 추정하지 않음",
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
    "id": "ckr:material:CH06.P2:learning-investment-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "수익으로 이어질 수 있는 능력",
    "researchKind": "mbti_application",
    "coreMeaning": "배움에 쓴 자원은 제공 가능한 수행이 달라질 때 가치로 연결",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "검증된 재능",
        "knowledge": "검증된 학습 강점을 작은 설명 결과에 적용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "근거",
        "knowledge": "성장 수입 원천이 교육비 회수를 보장하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "직업적 활용",
        "knowledge": "가상 과제에서 새 설명 방식이 혼자 이해할 범위를 넓힘",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "경제적 가치 조건",
        "knowledge": "수료보다 적용할 문제와 검증을 먼저 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "dc4c6fa772a27851195b"
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
      "student",
      "job_seeker"
    ],
    "detailJobRefs": [
      "ckr:job:teaching"
    ],
    "positive": "배움을 현재 역할에 연결할 여지",
    "risk": "교육 과정을 늘리면 경제적 가치도 늘 거라 기대",
    "factBomb": "배운 분야가 많아도 실제 맡을 과제가 없으면 쓰임은 미확인",
    "twist": "작은 적용 과제가 다음 교육 선택을 줄여줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 입문 과정 후 짧은 설명 자료를 제작"
    },
    "economicScene": "과정비·재료·연습·기회비용을 나눔",
    "learningScene": "같은 개념을 새 조건에서 설명",
    "action": "현재 필요한 수행을 먼저 정의",
    "counterexample": "학비 회수·채용·합격·수입 증가를 보장하지 않음",
    "distinctFromOtherParagraphs": "CH07 학습법과 다른 교육 투입의 사용 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "학비 회수·채용·합격·수입 증가를 보장하지 않음",
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
    "id": "ckr:material:CH06.P2:business-repeat-value",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "수익으로 이어질 수 있는 능력",
    "researchKind": "mbti_application",
    "coreMeaning": "운영 전문성의 값은 대표 없이도 이어질 결과에서 설명",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "검증된 재능",
        "knowledge": "검증된 운영 기능과 실제 조직 조건이 있을 때",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "근거",
        "knowledge": "운영 수입 원천은 현재 사업 규모가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "직업적 활용",
        "knowledge": "가상 반복 업무를 다른 담당자가 같은 기준으로 완료",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "경제적 가치 조건",
        "knowledge": "위임할 결과·질문·유지 책임을 명확히 함",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "3c2b6472c0c4d3051d9f"
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
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:small_business"
    ],
    "positive": "재현 가능한 기여를 설명할 여지",
    "risk": "표준 문서의 양을 운영 가치로 착각",
    "factBomb": "문서가 많아도 사용자가 찾지 못하면 대표 질문은 줄지 않음",
    "twist": "짧은 기준 한 개가 긴 매뉴얼보다 실용적일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 담당자가 예외를 만났을 때 문의 통로 확인"
    },
    "economicScene": "자료 작성·유지·교육·대표 개입 투입 구분",
    "learningScene": "기준을 처음 보는 사람이 수행하는지",
    "action": "실제 사람과 권한을 먼저 확인",
    "counterexample": "매출·직원 존재·확장 성공을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH04 역할 조정과 다른 반복 제공의 경제 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "매출·직원 존재·확장 성공을 추정하지 않음",
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
    "id": "ckr:material:CH06.P3:unpriced-revision",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "돈과 관련된 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "호의로 남긴 추가 수정이 보이지 않는 작업 범위가 될 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "가능한 약점",
        "knowledge": "가능한 약점은 수정의 종류를 구분하지 않는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "그 근거",
        "knowledge": "저평가 원천은 실제 손실 경험을 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "지출 기회 시간 위험",
        "knowledge": "가상 납품 뒤 새 용도에 맞춘 재보정을 요청",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "선택 기준",
        "knowledge": "같은 목적 수정과 새 목적 제작을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5697e5371d9b4b34d523"
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
    "positive": "작업을 계속 제공할 조건을 지킬 여지",
    "risk": "좋은 관계를 깨기 싫어 범위 확인을 미룸",
    "factBomb": "조금만 고쳐달라는 말이 여러 버전과 재선별을 포함할 수 있음",
    "twist": "조건을 일찍 묻는 것이 관계의 기대를 안정시킴",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 촬영 요청의 추가 컷·재보정·재출력을 구분"
    },
    "economicScene": "수정 횟수보다 목적 변경과 필요한 투입 확인",
    "learningScene": "수정 요청을 작업 단계로 분류",
    "action": "제공 범위와 새 요청의 차이를 설명",
    "counterexample": "법적 계약 효력을 단정하거나 실제 단가 제시하지 않음",
    "distinctFromOtherParagraphs": "CH04 피드백 감정이 아닌 추가 노동의 자원 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "법적 계약 효력을 단정하거나 실제 단가 제시하지 않음",
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
    "id": "ckr:material:CH06.P3:tool-demand-gap",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "돈과 관련된 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "장비·도구를 갖추는 것과 실제 수요를 충족하는 것은 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "가능한 약점",
        "knowledge": "가능한 위험은 도구의 향상을 수행 향상과 동일시",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "그 근거",
        "knowledge": "취미 도구 예산 원천은 실제 구매 사실이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "지출 기회 시간 위험",
        "knowledge": "가상 새 렌즈가 해결할 납품 제약이 있는지 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "선택 기준",
        "knowledge": "현재 도구로 못 하는 과제부터 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8c7eb0318961ed4e1cce"
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
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer",
      "self_employed",
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "필요한 투자 질문을 좁힐 여지",
    "risk": "갖고 싶은 기능을 필수 업무 비용으로 설명",
    "factBomb": "새 도구를 사도 선택·보정·설명 문제는 그대로일 수 있음",
    "twist": "빌리거나 작은 테스트를 하는 것이 필요한 조건을 알려줌",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 촬영에서 장비 변경 전후 같은 목적의 결과 비교"
    },
    "economicScene": "구입·임차·관리·학습·사용 빈도의 투입 구분",
    "learningScene": "장비 설명보다 실제 결과를 대조",
    "action": "필요와 욕구를 다른 질문으로 적기",
    "counterexample": "장비 투자 수익·감가 금액·구매 추천을 제공하지 않음",
    "distinctFromOtherParagraphs": "단순 예산 관리와 다른 수요·수행·도구의 간격",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "장비 투자 수익·감가 금액·구매 추천을 제공하지 않음",
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
    "id": "ckr:material:CH06.P3:fast-commitment",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "돈과 관련된 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "속도를 얻는 지출은 검증·변경 비용도 함께 비교",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "가능한 약점",
        "knowledge": "가능한 위험은 시간 절약을 무조건 효율로 보는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "그 근거",
        "knowledge": "속도를 위한 소비 원천은 실제 지출 이력 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "지출 기회 시간 위험",
        "knowledge": "가상 도구가 준비를 줄이지만 바꾸기 어려운 조건을 만듦",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "선택 기준",
        "knowledge": "되돌릴 범위와 사용 목적을 먼저 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cd6db5be5e62ed3b4f56"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "axis": "GOAL_DRIVE",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
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
    "positive": "필요한 속도와 유지 부담을 구별",
    "risk": "급한 일정 때문에 불명확한 제공 범위를 수락",
    "factBomb": "지금 빨라진 만큼 다음 선택의 자유가 줄어들 수 있음",
    "twist": "작은 검증을 먼저 하면 큰 결정을 더 빨리 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 제작 서비스의 자동화·수동 대안 비교"
    },
    "economicScene": "초기·유지·전환·검증 투입 구분",
    "learningScene": "대표 과제 하나로 실제 작동 시험",
    "action": "취소·변경 가능한 조건은 실제 자료로 확인",
    "counterexample": "구매·투자 수익을 권하거나 실제 계약 조건을 단정하지 않음",
    "distinctFromOtherParagraphs": "추진 성향과 다른 되돌릴 수 없는 투입의 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "구매·투자 수익을 권하거나 실제 계약 조건을 단정하지 않음",
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
    "id": "ckr:material:CH06.P3:many-opportunities-cost",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "돈과 관련된 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "새 기회마다 준비하면 미룬 약속과 시간이 비용이 된다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "가능한 약점",
        "knowledge": "가능한 위험은 좋은 제안을 모두 병렬로 받는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "그 근거",
        "knowledge": "프로젝트 비용 확장 원천은 실제 손실을 뜻하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "지출 기회 시간 위험",
        "knowledge": "가상 캠페인 세 개가 같은 제작 시간을 요구",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "선택 기준",
        "knowledge": "이번 선택으로 하지 않을 일을 먼저 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2ca38b805cc09d2e2625"
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
      "freelancer",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:marketing"
    ],
    "positive": "기회 비교를 현실 자원으로 옮길 여지",
    "risk": "관심을 잃기 전에 시작해야 한다고 생각",
    "factBomb": "시작이 늘어도 사용할 결과는 적을 수 있음",
    "twist": "보류 목록이 탐색 자체를 포기하지 않게 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 제안마다 필요한 제작·응대·검증 구간 표시"
    },
    "economicScene": "기회비용은 예상 수익이 아니라 포기할 실제 활동으로 설명",
    "learningScene": "가설 하나당 작은 완료 과제",
    "action": "동시에 할 수 있는 실제 범위를 질문",
    "counterexample": "소득 변동이나 실패를 유형의 운명으로 만들지 않음",
    "distinctFromOtherParagraphs": "CH05 우선순위보다 기회를 받는 자원 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "소득 변동이나 실패를 유형의 운명으로 만들지 않음",
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
    "id": "ckr:material:CH06.P3:help-hidden-cost",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "돈과 관련된 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "지원 범위가 없으면 돈보다 먼저 시간이 소진될 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "가능한 약점",
        "knowledge": "가능한 약점은 준비·후속 연락을 계산 밖에 두는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "그 근거",
        "knowledge": "지원 한도 원천은 실제 과소득 근거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "지출 기회 시간 위험",
        "knowledge": "가상 정보 지원 뒤 여러 채널로 후속 요청",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "선택 기준",
        "knowledge": "제공할 결과와 다음 전문 연결을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c3e0328ac10371fa55ab"
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
      "ckr:job:counsel_support"
    ],
    "positive": "도움을 지속할 조건을 설명할 여지",
    "risk": "상대가 힘들다는 이유로 모든 후속 지원을 맡음",
    "factBomb": "좋은 목적이 실제 자원 한도를 없애지는 않음",
    "twist": "범위를 정하면 필요한 사람에게 더 정확한 도움을 연결",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 지원 종료 뒤 어떤 문의를 받을지 합의"
    },
    "economicScene": "준비·응대·연결·회복의 투입 구분",
    "learningScene": "정보 제공과 전문 지원을 구분하는 연습",
    "action": "도움 범위와 종료 기준을 먼저 확인",
    "counterexample": "진단·치료·금전 구제 책임을 추정하지 않음",
    "distinctFromOtherParagraphs": "돈의 약점을 지출 성향 한 가지로 축소하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "진단·치료·금전 구제 책임을 추정하지 않음",
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
    "id": "ckr:material:CH06.P4:cashflow-timing",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "나에게 맞는 재물 관리",
    "researchKind": "mbti_application",
    "coreMeaning": "예상 의뢰·합의한 대가·실제 확보한 자원은 다르다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "관리 원칙",
        "knowledge": "관리 원칙은 발생과 회수 시점을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "소득 비용 시간",
        "knowledge": "원천의 불규칙 수입 완충은 실제 수입 자료 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "개인 점검 방식",
        "knowledge": "가상 의뢰 완료와 대금 확인 시점이 다른 상황",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "현실적인 결론",
        "knowledge": "생활과 다음 작업에 쓸 자원을 따로 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2f83590d0543224f2684"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:minimum-security",
        "axis": "STABILITY",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
        "notIndependentEvidence": true
      }
    ],
    "jobStatuses": [
      "freelancer"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "약속과 확보의 차이를 알 여지",
    "risk": "예상 수입을 이미 쓸 수 있는 돈으로 취급",
    "factBomb": "바쁜 달의 의뢰량이 다음 달의 확보 자원을 보장하지 않음",
    "twist": "회수 시점을 아는 것이 일감의 크기보다 도움이 될 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 일정표에 제작·납품·대금 확인을 나눔"
    },
    "economicScene": "작업 비용과 개인 생활비는 별도 확인",
    "learningScene": "제작 일정과 자원 일정 함께 보기",
    "action": "실제 계약 자료와 확보 상태만 사용",
    "counterexample": "개인 금융 권고·저축 비율·금액 처방 금지",
    "distinctFromOtherParagraphs": "수입 크기 예측과 다른 자원의 시점 관리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "개인 금융 권고·저축 비율·금액 처방 금지",
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
    "id": "ckr:material:CH06.P4:fixed-variable-time",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "나에게 맞는 재물 관리",
    "researchKind": "natal_application",
    "coreMeaning": "고정 부담·상품별 투입·보이지 않는 시간은 다른 자원 항목",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "관리 원칙",
        "knowledge": "관리 원칙은 매출 합계 하나로 판단하지 않는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "소득 비용 시간",
        "knowledge": "원국 재성은 비용 자료가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "개인 점검 방식",
        "knowledge": "가상 상품의 재료와 준비·마감 시간을 따로 기록",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "현실적인 결론",
        "knowledge": "항목별 조정 가능성을 비교",
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
      "self_employed",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:cafe"
    ],
    "positive": "지속할 운영의 조건을 볼 여지",
    "risk": "시간을 무료 자원처럼 제외",
    "factBomb": "판매가 늘어도 정리 시간이 밀리면 반복할 여유는 줄 수 있음",
    "twist": "줄일 수 없는 부담과 조정할 투입을 나누면 판단이 선명",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 메뉴의 준비부터 정리까지 단계 기록"
    },
    "economicScene": "고정·변동·시간을 구별하되 수치를 만들어내지 않음",
    "learningScene": "작은 기간의 실제 투입 기록 연습",
    "action": "자료가 있는 항목만 비교",
    "counterexample": "세무·투자·특정 사업 손익의 결론으로 사용하지 않음",
    "distinctFromOtherParagraphs": "예산 절약과 다른 비용 종류의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "세무·투자·특정 사업 손익의 결론으로 사용하지 않음",
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
    "id": "ckr:material:CH06.P4:value-not-cheapest",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "나에게 맞는 재물 관리",
    "researchKind": "mbti_application",
    "coreMeaning": "싼 선택과 전체 부담이 적은 선택은 다를 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "관리 원칙",
        "knowledge": "관리 원칙은 최초 가격과 사용할 조건의 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "소득 비용 시간",
        "knowledge": "계약 비용 선호 원천은 실제 선택의 정답이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "개인 점검 방식",
        "knowledge": "가상 도구의 준비·유지·전환 시간을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "현실적인 결론",
        "knowledge": "같은 결과를 제공할 조건이 맞는지 확인",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "b64fa2920704301bf622"
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
      "ckr:job:software"
    ],
    "positive": "비용의 숨은 조건을 볼 여지",
    "risk": "최초 가격만 비교해 장기 부담을 놓침",
    "factBomb": "싸게 시작했어도 바꾸기 어렵다면 다음 비용이 커질 수 있음",
    "twist": "초기 투입이 큰 안도 반복 사용 조건에서는 비교할 가치",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 작업 도구 두 개를 같은 과제로 시험"
    },
    "economicScene": "초기·유지·변경의 자원 구분",
    "learningScene": "대표 과제에서 혼자 사용할 수 있는지",
    "action": "실제 가격·제공 범위·중단 조건을 확인",
    "counterexample": "특정 상품 구매나 미래 절감액을 보장하지 않음",
    "distinctFromOtherParagraphs": "모든 관리 문제를 저축으로 환원하지 않는 전체 투입",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 상품 구매나 미래 절감액을 보장하지 않음",
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
    "id": "ckr:material:CH06.P4:learning-budget-question",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "나에게 맞는 재물 관리",
    "researchKind": "mbti_application",
    "coreMeaning": "배움의 지출은 적용할 과제와 연습 시간을 함께 정한다",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "관리 원칙",
        "knowledge": "관리 원칙은 과정 선택과 활용 계획의 분리",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "소득 비용 시간",
        "knowledge": "가능성 소비 원천이 실제 지출 사실은 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "개인 점검 방식",
        "knowledge": "가상 새 기법 과정에 과제·피드백·연습 시간 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "현실적인 결론",
        "knowledge": "이번 배움으로 할 수 있는 결과를 먼저 정의",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "53f96587bbaa900e8b0e"
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
      "job_seeker",
      "employee"
    ],
    "detailJobRefs": [
      "ckr:job:brand_design"
    ],
    "positive": "흥미와 실제 사용을 연결할 여지",
    "risk": "새 과정이 나타날 때 기존 연습을 미룸",
    "factBomb": "수료증이 늘어도 도움 없이 만들 결과가 같을 수 있음",
    "twist": "무료 작은 과제에서도 다음 배움의 빈틈을 찾을 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 디자인 과정 전 같은 요구로 작은 시안 제작"
    },
    "economicScene": "과정·재료·도구·연습 투입을 분리",
    "learningScene": "수강 전후 다른 조건의 수행 비교",
    "action": "필요한 기능과 실제 학습 여유를 확인",
    "counterexample": "교육비 회수·취업·합격을 보장하지 않음",
    "distinctFromOtherParagraphs": "CH07 학습 기법보다 교육 자원 선택",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "교육비 회수·취업·합격을 보장하지 않음",
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
    "id": "ckr:material:CH06.P4:reserve-options",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "나에게 맞는 재물 관리",
    "researchKind": "mbti_application",
    "coreMeaning": "관리의 목적은 큰돈의 예측보다 다음 선택의 여지를 남기는 것",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "관리 원칙",
        "knowledge": "확보 자원과 기대를 나누는 원칙",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "소득 비용 시간",
        "knowledge": "축적 원천은 현재 자산의 양을 알려주지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "개인 점검 방식",
        "knowledge": "가상 새 역할에서 생활·배움·휴식의 제약을 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "현실적인 결론",
        "knowledge": "실제 제공된 자료로만 감당할 범위를 질문",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "563ac17bf788fce06e6f"
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
    "detailJobRefs": [],
    "positive": "좋은 목적을 지속할 기반을 생각할 여지",
    "risk": "모든 불확실성을 피하려 선택을 미룸",
    "factBomb": "안정만 지키면 배울 기회도 계속 뒤로 갈 수 있음",
    "twist": "작고 되돌릴 수 있는 시도는 기반과 성장을 함께 검토",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 선택의 필요한 자원과 포기할 활동을 적음"
    },
    "economicScene": "생활 자원과 새 준비 투입을 별도로 확인",
    "learningScene": "작은 검증 후 선택을 수정하는 연습",
    "action": "숫자 처방 대신 확인할 조건을 남김",
    "counterexample": "금융 자문·자산 예측·수익 보장으로 사용하지 않음",
    "distinctFromOtherParagraphs": "경제 선택을 통제감이나 부의 운명으로 만들지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "금융 자문·자산 예측·수익 보장으로 사용하지 않음",
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
