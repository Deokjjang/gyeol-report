/** Static offline career research; no runtime selection or customer approval. */
import type { Material } from "./researchTypes";

export const CH08_MATERIALS: readonly Material[] = [
  {
    "id": "ckr:material:CH08.P1:cheoneul-help-network",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "천을귀인의 전통 도움 상징은 질문·지원 기회로 조건부 읽기",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "실제 긍정 특징은 전거와 계산 위치를 확인한 천을 분류",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "도움을 받는 상징이 현재 조력자의 존재를 증명하지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "가상 어려운 과제에서 확인할 사람과 자료를 찾는 장면",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "지원받은 내용을 스스로 수행할 때 활용 가능",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8404eadd074651539efa"
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
      "ckr:job:research"
    ],
    "positive": "고립된 추측보다 확인할 통로를 찾을 여지",
    "risk": "좋은 사람이 알아서 도와준다고 기대",
    "factBomb": "도움 상징이 있어도 무엇을 물을지 모르면 지원을 활용하기 어려움",
    "twist": "모른다고 정확히 묻는 태도가 도움을 받을 준비일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석의 불명확한 가정을 경험자에게 질문"
    },
    "economicScene": "질문 준비·피드백·실습 시간을 함께 봄",
    "learningScene": "받은 답을 다른 조건에 적용",
    "action": "실제 원국 위치와 전거 조건부터 확인",
    "counterexample": "실제 귀인·채용 추천·인맥·성공을 생성하지 않음",
    "distinctFromOtherParagraphs": "좋은 상징의 활용 조건으로 CH04 도움 제공 능력과 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 귀인·채용 추천·인맥·성공을 생성하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P1:jangseong-responsibility",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "장성의 전통 위상 상징을 작은 책임의 수행 조건으로 제한",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "실제 긍정 특징은 계산된 장성의 출처를 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "위상 상징은 현재 직책·승진·권력의 사실이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "가상 작은 과제의 판단·담당·완료 기준을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "책임과 실제 권한이 맞을 때 활용 가능",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2bc77a6b7aac71ca7b44"
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
    "positive": "기여의 범위를 분명히 할 여지",
    "risk": "앞에 서야만 가치 있다고 읽을 수 있음",
    "factBomb": "직책이 커져도 결정권이 없으면 책임만 늘 수 있음",
    "twist": "한정된 책임을 정확히 지키는 것도 좋은 활용",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 프로젝트의 멈춘 결정 하나를 연결"
    },
    "economicScene": "대기·설명·수습의 투입 차이",
    "learningScene": "결과 기준과 방법을 분리",
    "action": "실제 계산·위치·성립 조건과 권한을 확인",
    "counterexample": "승진·지위·사업 성공을 보장하지 않음",
    "distinctFromOtherParagraphs": "좋은 상징과 현대 직책을 구분하는 긍정 해석",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "승진·지위·사업 성공을 보장하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P1:taegeuk-understanding",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "태극의 전통 이해 상징은 근본 질문과 실제 검증을 구별",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "긍정 후보는 실제 계산된 태극과 전거 범위",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "상징이 지능·통찰력·학력의 측정은 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "가상 원리 설명에 맞지 않는 예를 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "설명을 자기 과제에 적용할 때 현실 의미가 생김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a6a27c42f6bd298906a4"
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
    "positive": "깊이 묻는 관심을 과제로 옮길 여지",
    "risk": "깊은 상징을 모든 판단의 우월성으로 읽음",
    "factBomb": "통찰이 있다고 말해도 다른 사람이 따라갈 근거가 필요",
    "twist": "반례를 남기는 태도가 설명의 깊이를 더할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석의 가정·확인·한계를 다른 칸에 적음"
    },
    "economicScene": "추가 조사와 사용할 결정의 균형",
    "learningScene": "새 조건의 사례로 원리를 비교",
    "action": "실제 원국 근거와 적용 한계를 먼저 확인",
    "counterexample": "전문 능력·시험 합격·예지력을 보장하지 않음",
    "distinctFromOtherParagraphs": "CH02 분석 능력과 다른 전통 상징의 제한된 역할",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "전문 능력·시험 합격·예지력을 보장하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P1:siksang-output-potential",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "식신 표현의 긍정 상징은 사용할 결과를 만드는 조건과 연결",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "실제 식신 근거와 원국 전체 조건을 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "상징은 완성한 작품이나 수익의 사실이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "가상 설명 자료를 독자의 질문에 맞춰 다듬음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "재능의 표현을 실제 결과로 검증할 때 활용",
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
      "ckr:job:writing"
    ],
    "positive": "생각을 구체 형태로 남길 여지",
    "risk": "표현 자체를 인정과 수익으로 바로 연결",
    "factBomb": "만든 양이 많아도 누가 왜 쓰는지 모르면 가치 전달은 미확인",
    "twist": "작은 사용처가 표현의 방향을 분명히 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 짧은 안내 글에 필수 질문을 반영"
    },
    "economicScene": "작성·검증·수정 투입의 차이",
    "learningScene": "읽은 사람이 핵심을 설명할 수 있는지",
    "action": "원국 성립·실제 목적·검증을 별도 확인",
    "counterexample": "창작 성공·고소득·인기 보장 금지",
    "distinctFromOtherParagraphs": "긍정적 상징을 줄이지 않되 현대 성과와 구별",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "창작 성공·고소득·인기 보장 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P1:resource-foundation-positive",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "정재 축적의 긍정성은 반복해서 남길 결과와 부담을 같이 보는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "실제 정재 계산 근거를 원국 분류로 제시",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "정재가 많다는 말만으로 실제 부를 만들지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "가상 반복 서비스의 품질과 준비를 같이 점검",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "지킬 결과가 다음에도 이어질 때 활용",
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
      "ckr:job:cafe"
    ],
    "positive": "꾸준한 기여를 설명할 여지",
    "risk": "안정이라는 이름으로 모든 새 시도를 미룸",
    "factBomb": "오래 유지했다고 지금도 가치 있는 방식이라는 보장은 아님",
    "twist": "작은 개선이 반복의 장점을 더 살릴 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 메뉴 준비의 한 단계만 바꿔 비교"
    },
    "economicScene": "준비·폐기·정리 투입을 구분",
    "learningScene": "다른 조건에서도 같은 품질을 확인",
    "action": "원국·실제 과제·반례를 함께 확인",
    "counterexample": "부·수익·자산의 크기를 보장하지 않음",
    "distinctFromOtherParagraphs": "CH06 돈 계산보다 전통 축적 상징의 실현 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "부·수익·자산의 크기를 보장하지 않음",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P1:held-munchang-exam",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 가진 좋은 기운",
    "researchKind": "natal_application",
    "coreMeaning": "문창의 배치 전거와 현행 표 대조가 남은 보류 연구",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "승인된 긍정 특징",
        "knowledge": "보류이므로 승인된 긍정 특징으로 배정 불가",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "원천에 전통 배치와 현행 표 차이가 기록돼 있음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "발휘 상황",
        "knowledge": "학습 상징이 있더라도 시험 결과를 만들 수 없음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "실현 조건",
        "knowledge": "후속 대조가 끝나기 전에는 근거 연결을 보류",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "47fcf46be449c285af54"
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
    "detailJobRefs": [],
    "positive": "전거를 확인한 범위의 연구만 보존",
    "risk": "ID가 있다는 이유로 시험 행운을 자동 승인",
    "factBomb": "전거 문제를 자료 수로 가리면 정확성이 나아지지 않음",
    "twist": "보류를 명확히 하면 유효한 다른 긍정 자료를 보호",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 후보 검토에서 문창 항목을 미사용으로 남김"
    },
    "economicScene": "시험 비용이나 수입 자료를 생성하지 않음",
    "learningScene": "배치·정의·현행 계산 차이를 별도 검토",
    "action": "기존 보류 상태 유지",
    "counterexample": "성적·합격·학력·문재의 확정 근거로 사용 금지",
    "distinctFromOtherParagraphs": "좋은 상징 자체 삭제가 아닌 정확한 출처 보류",
    "review": "held_source_or_conditions",
    "holdReason": "전통 배치와 현행 문창 표의 대조 미해결. 고객 긍정 특징·시험 해석 배정 보류.",
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성적·합격·학력·문재의 확정 근거로 사용 금지",
      "requiresExistingRecommendation": false,
      "requiresExistingAvoidProof": false,
      "requiresCustomerApprovedPositiveSource": true
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
    "id": "ckr:material:CH08.P2:recognized-prevention",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "인정받을 수 있는 나의 힘",
    "researchKind": "natal_application",
    "coreMeaning": "예방 기여는 실제 발견·수정과 줄인 재처리를 구분해 드러낸다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "타인에게 주는 가치",
        "knowledge": "타인에게 주는 가치는 중요한 오류의 조기 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "독립 원천과 실제 관찰 결과를 따로 확인",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "인정받을 상황",
        "knowledge": "가상 자료의 오류를 검토 기준으로 남겨 다음 담당이 사용",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "드러내는 방법",
        "knowledge": "보이지 않던 작업을 근거 있는 설명으로 전달",
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
    "positive": "정확성을 공동의 결과로 만들 여지",
    "risk": "일어나지 않은 손실을 모두 자신의 성과로 계산",
    "factBomb": "예방했다고 추정한 큰 피해액은 관찰된 사실이 아닐 수 있음",
    "twist": "작은 발견 기록이 과장된 절감액보다 믿을 만함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 검토 전후 실제 바뀐 항목만 표시"
    },
    "economicScene": "검토 투입과 확인된 재처리의 차이",
    "learningScene": "다른 담당자가 같은 기준을 쓰는지",
    "action": "발견·변경·추정 효과를 분리",
    "counterexample": "인정·보상·사고 방지를 실제 사실로 만들지 않음",
    "distinctFromOtherParagraphs": "CH06 대가 조건과 다른 기여를 드러내는 방법",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "인정·보상·사고 방지를 실제 사실로 만들지 않음",
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
    "id": "ckr:material:CH08.P2:recognized-translation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "인정받을 수 있는 나의 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "복잡한 의미를 되짚을 수 있게 전달하는 전문 기여",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "타인에게 주는 가치",
        "knowledge": "타인에게 주는 가치는 혼선을 줄일 정확한 의미",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "연구 선호 원천은 번역 실력의 증명이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "인정받을 상황",
        "knowledge": "가상 문서의 용어 선택 이유와 불명확 항목을 남김",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "드러내는 방법",
        "knowledge": "다른 사람이 원문을 따라갈 수 있게 드러냄",
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
      "ckr:job:translation"
    ],
    "positive": "분야 간 이해를 도울 여지",
    "risk": "매끄럽게 읽히면 검수도 끝났다고 느낌",
    "factBomb": "번역이 자연스러워도 중요한 조건이 바뀌면 신뢰는 별도",
    "twist": "질문을 남긴 항목이 더 정직한 전문 결과",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 안내문의 조건과 숫자를 원문에 대조"
    },
    "economicScene": "조사·질의·검수 투입을 분리",
    "learningScene": "다른 표현의 의미 차이를 설명",
    "action": "확인한 뜻과 미확인 뜻을 표시",
    "counterexample": "실제 번역 경력·언어 수준·고객 반응을 추정하지 않음",
    "distinctFromOtherParagraphs": "CH02 분석 재능과 다른 전문 결과의 추적 가능성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 번역 경력·언어 수준·고객 반응을 추정하지 않음",
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
    "id": "ckr:material:CH08.P2:recognized-enablement",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "인정받을 수 있는 나의 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "남이 스스로 할 수 있게 된 범위를 드러내는 지원 기여",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "타인에게 주는 가치",
        "knowledge": "가치는 많은 응대보다 막힌 단계의 개선",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "뒤편 지원 원천은 현재 조직 성과가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "인정받을 상황",
        "knowledge": "가상 안내를 고쳐 같은 질문이 어디서 생겼는지 보여줌",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "드러내는 방법",
        "knowledge": "문제·수정·확인할 결과를 나눠 설명",
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
    "positive": "조용한 작업의 쓸모를 보일 여지",
    "risk": "모든 사람을 직접 도운 양으로 인정받으려 함",
    "factBomb": "내가 없으면 항상 멈추는 구조는 도움의 지속성을 제한",
    "twist": "나를 덜 찾는 결과도 좋은 지원일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 안내 자료로 처음 이용자가 다음 단계를 찾음"
    },
    "economicScene": "응대·문서 유지·인계의 투입",
    "learningScene": "독립 수행을 확인할 작은 과제",
    "action": "실제 해결한 범위만 설명",
    "counterexample": "실제 고객·동료·인정이 있었다고 서술하지 않음",
    "distinctFromOtherParagraphs": "CH04 지원 방식보다 기여를 확인·전달하는 기준",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 고객·동료·인정이 있었다고 서술하지 않음",
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
    "id": "ckr:material:CH08.P2:recognized-clarity",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "인정받을 수 있는 나의 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "직접 피드백은 사람이 아니라 다음 선택을 명확히 할 때 가치",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "타인에게 주는 가치",
        "knowledge": "타인에게 주는 가치는 무엇을 바꾸면 되는지의 분명함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "직접 피드백 원천은 현재 리더 직책이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "인정받을 상황",
        "knowledge": "가상 기획 검토에서 문제·기준·다음 행동을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "드러내는 방법",
        "knowledge": "근거와 결정 범위를 드러내야 인정 가능성 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "300c56cfaf4d8929142e"
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
      "ckr:job:project_planning"
    ],
    "positive": "망설임을 실행 질문으로 바꿀 여지",
    "risk": "명확함을 상대 감정 무시의 허가로 삼음",
    "factBomb": "말이 빠르고 정확해도 상대가 수행할 조건은 따로 필요",
    "twist": "한 번 더 묻는 질문이 더 빠른 실행을 만들 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 제안에 우선 바꿀 항목 하나만 제시"
    },
    "economicScene": "재논의·대기·추가 작업의 투입",
    "learningScene": "판단 근거와 사람 평가를 구분",
    "action": "상대가 다음 행동을 이해했는지 확인",
    "counterexample": "실제 인정·승진·상대 반응을 만들지 않음",
    "distinctFromOtherParagraphs": "직접 말하는 성격 재소개가 아닌 사용할 피드백",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 인정·승진·상대 반응을 만들지 않음",
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
    "id": "ckr:material:CH08.P2:recognized-experience",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "인정받을 수 있는 나의 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "사람의 반응을 사용 경험에 반영한 기여를 드러내기",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "타인에게 주는 가치",
        "knowledge": "가치는 관심의 양과 목적 달성을 나누는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "독립 근거",
        "knowledge": "표현 서비스 원천은 현재 인기나 매출의 증거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "인정받을 상황",
        "knowledge": "가상 안내 영상에서 반복 질문의 원인을 수정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "드러내는 방법",
        "knowledge": "반응·수정·다음 확인을 짧게 설명",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1949199fcd8a2e08e71e"
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
    "positive": "현장 감각을 구체 결과로 남길 여지",
    "risk": "재미있다는 반응을 목적 달성으로 동일시",
    "factBomb": "호감이 높아도 핵심 안내를 기억하지 못할 수 있음",
    "twist": "짧고 덜 화려한 장면이 실제 사용을 더 잘 도움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 영상의 마지막 안내를 사용자 질문으로 검토"
    },
    "economicScene": "재편집·자막·추가 안내 투입",
    "learningScene": "소리 없는 조건에서도 메시지 확인",
    "action": "실제 목적과 관찰한 반응만 사용",
    "counterexample": "고객 수·인기·수익·재의뢰를 추정하지 않음",
    "distinctFromOtherParagraphs": "CH06 경제 효과와 구별되는 기여 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "고객 수·인기·수익·재의뢰를 추정하지 않음",
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
    "id": "ckr:material:CH08.P3:career-precision-lock",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "성공을 방해하는 나의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "매번 직접 검토만 하면 다음에도 같은 확인에 묶일 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "중요 위험",
        "knowledge": "중요 위험은 숙련을 공유 기준으로 남기지 못하는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "원인",
        "knowledge": "완벽주의 회복 원천은 실제 성장 정체가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "기회와 비용",
        "knowledge": "가상 같은 오류를 계속 개인이 수정",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "과사용 방지",
        "knowledge": "반복되는 한 유형을 다른 사람도 볼 기준으로 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6de6be185ee5f6ecec9b"
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
    "positive": "정확성을 더 넓은 결과로 사용할 여지",
    "risk": "확인한 양이 많을수록 성장했다고 느낌",
    "factBomb": "오늘의 완성도를 높이느라 다음의 반복 문제는 남을 수 있음",
    "twist": "검토를 덜 해도 되는 구조가 전문성의 성장",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 반복 오류를 짧은 대조 표로 정리"
    },
    "economicScene": "누적 확인·기준 유지의 투입 차이",
    "learningScene": "다른 담당자가 같은 기준으로 확인",
    "action": "공유할 오류 유형 하나 선택",
    "counterexample": "실제 실패·정체·불인정을 단정하지 않음",
    "distinctFromOtherParagraphs": "CH04 즉시 갈등·CH06 자원 비용과 다른 성장 범위 제한",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 실패·정체·불인정을 단정하지 않음",
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
    "id": "ckr:material:CH08.P3:career-depth-without-use",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "성공을 방해하는 나의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "깊은 이해가 사용 가능한 결과로 나오지 않으면 맡길 범위가 좁아질 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "중요 위험",
        "knowledge": "위험은 설명을 계속 넓히고 사용 결정을 남기지 않는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "원인",
        "knowledge": "모델 제품 연결 원천은 실제 경력 평가가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "기회와 비용",
        "knowledge": "가상 조사가 쌓이지만 답할 질문은 바뀜",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "과사용 방지",
        "knowledge": "이번 결과로 바뀔 판단 하나를 닫기",
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
    "positive": "깊이를 실제 기여로 연결할 여지",
    "risk": "해결되지 않은 질문이 있으면 제출을 모두 보류",
    "factBomb": "혼자 많이 아는 것과 다른 사람이 맡길 이유는 다름",
    "twist": "짧은 한계 설명이 전문 영역을 더 믿게 할 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석에서 사용할 결정과 후속 질문을 분리"
    },
    "economicScene": "추가 조사와 적용 지연의 투입",
    "learningScene": "가정·결론·한계 요약",
    "action": "사용할 사람의 결정 질문부터 확인",
    "counterexample": "실제 소득·경력 실패를 유형으로 예언하지 않음",
    "distinctFromOtherParagraphs": "CH07 학습 착수와 다른 장기 기여 가시성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 소득·경력 실패를 유형으로 예언하지 않음",
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
    "id": "ckr:material:CH08.P3:career-help-overload",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "성공을 방해하는 나의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "개인 지원만 늘면 전문성을 정리할 시간이 줄 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "중요 위험",
        "knowledge": "위험은 모든 질문에 직접 답해야 가치 있다고 느끼는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "원인",
        "knowledge": "과부하 원천은 실제 소진 상태의 진단 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "기회와 비용",
        "knowledge": "가상 수업 뒤 반복 질문마다 같은 설명을 다시 작성",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "과사용 방지",
        "knowledge": "공통 질문과 개별 지원을 구분",
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
    "positive": "배려를 지속 가능한 자료로 발전시킬 여지",
    "risk": "다른 사람이 답하는 것을 도움의 감소로 느낌",
    "factBomb": "좋은 의도로 빼곡한 일정이 새 수업 준비를 밀 수 있음",
    "twist": "지원 통로를 나누는 것이 더 많은 학습을 돕는 방법",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 반복 질문을 자료·수업·개별 질의로 분류"
    },
    "economicScene": "반복 응대와 전문 준비의 자원 구분",
    "learningScene": "다른 사람이 사용할 안내 설명",
    "action": "직접 답할 필요가 있는 질문만 구분",
    "counterexample": "건강·번아웃·실제 실패 단정 금지",
    "distinctFromOtherParagraphs": "즉시 경계 문제와 다른 전문성 축적의 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "건강·번아웃·실제 실패 단정 금지",
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
    "id": "ckr:material:CH08.P3:career-drive-repeat-fire",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "성공을 방해하는 나의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "급한 수습만 인정받으려 하면 원인과 기준을 남길 시간이 줄 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "중요 위험",
        "knowledge": "위험은 끝낸 속도만 성장 지표로 삼는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "원인",
        "knowledge": "일 몰입 원천은 실제 야근·과로 경험이 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "기회와 비용",
        "knowledge": "가상 장애 수정 뒤 재현 사례가 남지 않음",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "과사용 방지",
        "knowledge": "한 번의 해결을 다음 변경의 검증으로 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "120b3da73ae37f6baf51"
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
      "ckr:job:software"
    ],
    "positive": "실행 속도가 반복 해결 능력으로 쌓일 여지",
    "risk": "돌아보는 시간을 낭비로 여김",
    "factBomb": "더 큰 일을 맡아도 비슷한 수습만 반복할 수 있음",
    "twist": "짧은 회고가 다음 실행을 더 빠르게 함",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 오류 수정 후 실패 입력과 변경 이유 기록"
    },
    "economicScene": "응급 수정·재발 확인·예방 투입 구분",
    "learningScene": "같은 문제의 다른 조건 검증",
    "action": "작업 뒤 다시 발생할 조건 하나 남기기",
    "counterexample": "실제 운영 장애나 실패 사건을 생성하지 않음",
    "distinctFromOtherParagraphs": "CH04 속도 갈등보다 성장의 재사용 자산 부족",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 운영 장애나 실패 사건을 생성하지 않음",
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
    "id": "ckr:material:CH08.P3:career-boundary-isolation",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "성공을 방해하는 나의 약점",
    "researchKind": "mbti_application",
    "coreMeaning": "독립 영역을 지키다 다른 분야의 조건을 배울 통로까지 닫을 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "중요 위험",
        "knowledge": "위험은 협력 요청을 모두 집중 방해로 읽는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "원인",
        "knowledge": "정치 거리두기 원천은 실제 고립의 증거가 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "기회와 비용",
        "knowledge": "가상 분석이 정확해도 실행 부서의 제약을 모름",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "과사용 방지",
        "knowledge": "부담을 늘리지 않는 연결 질문을 남김",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a4e17745da4f51f467aa"
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
      "ckr:job:research"
    ],
    "positive": "전문성을 다른 문제로 넓힐 여지",
    "risk": "내 범위 밖이라는 말로 대화를 끝냄",
    "factBomb": "혼자 잘하는 영역이 넓은 기여로 연결되지 않을 수 있음",
    "twist": "제한된 협업이 독립 판단의 질을 높일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 보고의 사용 조건을 실행자에게 묻기"
    },
    "economicScene": "협의 시간과 잘못된 적용의 투입 비교",
    "learningScene": "다른 전문 영역의 질문을 듣기",
    "action": "가능한 연결과 필요한 전문가를 안내",
    "counterexample": "실제 직장 정치·소외를 추정하지 않음",
    "distinctFromOtherParagraphs": "경계의 일반 장점과 다른 전문성 확장의 제한",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 필요한 다른 원천은 별도 승인·확인.",
      "mbti": "실제 본인 유형의 동일 trait·분야·pointer/hash 확인. direct/inferred는 실증 수준이 아님. 능력·경력·지능·경제 사실로 승격 금지.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 직장 정치·소외를 추정하지 않음",
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
    "id": "ckr:material:CH08.P4:positive-conditions-to-proof",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "좋은 힘을 제대로 사용하는 조건",
    "researchKind": "natal_application",
    "coreMeaning": "좋은 상징을 현실에서 쓰려면 확인할 도움과 수행이 필요",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "활용 가치",
        "knowledge": "활용 가치는 질문할 통로를 실제 과제에 연결",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "가치가 커질 조건",
        "knowledge": "도움을 받는 조건과 자기 행동의 역할을 구분",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "피할 행동",
        "knowledge": "막연한 기다림을 피하고 작은 질의를 준비",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "현실적 희망",
        "knowledge": "성공 예언 대신 다음 확인이 가능한 희망",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8404eadd074651539efa"
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
      "ckr:job:research"
    ],
    "positive": "긍정 상징을 실행 가능 질문으로 남길 여지",
    "risk": "귀인이 알아서 결과를 만들어준다고 기대",
    "factBomb": "상징이 있어도 검증할 과제가 없으면 활용은 미확인",
    "twist": "잘 묻는 준비가 도움을 쓸 수 있는 실력",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 질문에 자료·모르는 조건·원하는 확인을 붙임"
    },
    "economicScene": "준비·확인·연습의 투입 구분",
    "learningScene": "받은 피드백을 새 조건에 적용",
    "action": "실제 원국 근거와 질문 대상을 확인",
    "counterexample": "미입력 인맥·조력자·좋은 사건 생성 금지",
    "distinctFromOtherParagraphs": "P1 상징 소개 이후 현실 조건을 추가하는 응용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "미입력 인맥·조력자·좋은 사건 생성 금지",
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
    "id": "ckr:material:CH08.P4:positive-to-client-use",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "좋은 힘을 제대로 사용하는 조건",
    "researchKind": "natal_application",
    "coreMeaning": "좋은 표현을 사용할 결과로 이어가려면 목적과 선택 기준이 필요",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "활용 가치",
        "knowledge": "활용 가치는 자기 취향과 상대 목적의 비교",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "가치가 커질 조건",
        "knowledge": "작품의 아름다움과 의뢰 목적 충족은 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "피할 행동",
        "knowledge": "좋아하는 컷만 고르는 행동을 점검",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "현실적 희망",
        "knowledge": "작은 견본에서 쓰일 조건을 확인하는 희망",
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
      "freelancer",
      "student"
    ],
    "detailJobRefs": [
      "ckr:job:photography"
    ],
    "positive": "표현의 선택을 전문 결과로 남길 여지",
    "risk": "긍정 상징을 무조건 인기와 연결",
    "factBomb": "빛나는 한 장이 전체 요구를 채웠다는 뜻은 아님",
    "twist": "평범해 보이는 정보 컷도 목적에 꼭 필요한 결과일 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 상품의 필수 디테일과 분위기 컷을 나눔"
    },
    "economicScene": "선별·보정·규격별 출력 투입 구분",
    "learningScene": "용도별 다른 기준으로 같은 사진 검토",
    "action": "실제 목적과 테스트 결과만 사용",
    "counterexample": "실제 고객·재의뢰·인기를 예언하지 않음",
    "distinctFromOtherParagraphs": "표현 재능을 반복하지 않고 사용 조건을 더함",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 고객·재의뢰·인기를 예언하지 않음",
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
    "id": "ckr:material:CH08.P4:positive-to-repeat-system",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "좋은 힘을 제대로 사용하는 조건",
    "researchKind": "natal_application",
    "coreMeaning": "좋은 반복은 바뀐 조건에서도 품질과 부담을 조정할 수 있어야 한다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "활용 가치",
        "knowledge": "활용 가치는 지킬 기준과 바꿀 방법을 나누는 것",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "가치가 커질 조건",
        "knowledge": "축적 상징과 실제 운영 자료는 별도",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "피할 행동",
        "knowledge": "오래 한 방법을 무조건 유지하는 행동 점검",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "현실적 희망",
        "knowledge": "작은 개선을 비교할 수 있는 현실적 희망",
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
      "self_employed",
      "business_owner"
    ],
    "detailJobRefs": [
      "ckr:job:cafe"
    ],
    "positive": "지속 조건을 찾을 여지",
    "risk": "안정을 모든 변경의 거부로 읽음",
    "factBomb": "꾸준히 바쁜 것과 꾸준히 남는 결과는 다를 수 있음",
    "twist": "기반을 지킨 작은 변경이 반복의 힘을 더 키움",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 준비 순서 한 개를 바꿔 품질·마감 비교"
    },
    "economicScene": "유지 부담과 변경 투입 분리",
    "learningScene": "조건이 다른 날의 동일 기준 검토",
    "action": "지킬 결과와 시험할 방법을 분리",
    "counterexample": "매출·이익·확장 결과를 보장하지 않음",
    "distinctFromOtherParagraphs": "긍정성의 실현 조건이지 새 부의 사실이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "매출·이익·확장 결과를 보장하지 않음",
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
    "id": "ckr:material:CH08.P4:positive-to-shared-decision",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "좋은 힘을 제대로 사용하는 조건",
    "researchKind": "natal_application",
    "coreMeaning": "책임의 좋은 힘은 다른 사람도 결정할 기준이 생길 때 커질 수 있다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "활용 가치",
        "knowledge": "활용 가치는 자기 결정보다 공동의 실행 조건",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "가치가 커질 조건",
        "knowledge": "실제 원국 상징과 현실 권한을 나눔",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "피할 행동",
        "knowledge": "모두 대신 결정하는 행동을 피함",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "현실적 희망",
        "knowledge": "작은 위임의 결과를 확인하는 희망",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2bc77a6b7aac71ca7b44"
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
    "positive": "역할의 영향 범위를 넓힐 여지",
    "risk": "책임을 혼자 부담할 일로만 이해",
    "factBomb": "아무도 결정하지 않는 구조를 계속 수습하면 성장도 묶일 수 있음",
    "twist": "일부 결정을 맡기는 것이 책임을 약하게 하지 않을 수 있음",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 담당자에게 결과 기준과 질문 통로를 전달"
    },
    "economicScene": "결정 대기·확인·재수행 투입",
    "learningScene": "작은 범위의 다른 수행 방법 검토",
    "action": "실제 권한과 위임 대상부터 확인",
    "counterexample": "직책·직원·승진을 추정하지 않음",
    "distinctFromOtherParagraphs": "원천의 지위 상징을 현대 권력으로 바꾸지 않는 응용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "직책·직원·승진을 추정하지 않음",
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
    "id": "ckr:material:CH08.P4:positive-to-learning-humility",
    "productKey": "career_money_study",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "좋은 힘을 제대로 사용하는 조건",
    "researchKind": "natal_application",
    "coreMeaning": "깊이 이해하려는 좋은 힘은 모르는 범위를 인정할 때 더 정확히 쓰인다",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "활용 가치",
        "knowledge": "활용 가치는 근본 질문과 검증 가능한 범위의 결합",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "가치가 커질 조건",
        "knowledge": "상징이 모든 질문의 답을 알고 있다는 뜻은 아님",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "피할 행동",
        "knowledge": "용어만 늘어놓거나 확신을 과장하는 행동 점검",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "현실적 희망",
        "knowledge": "설명과 반례를 함께 남길 수 있는 희망",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "a6a27c42f6bd298906a4"
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
    "positive": "깊이와 실용성을 함께 검토할 여지",
    "risk": "상징을 지능·우월성의 이름으로 사용",
    "factBomb": "어려운 말을 써도 실제 판단은 명료해지지 않을 수 있음",
    "twist": "모르는 한 조건을 남기는 것이 더 깊은 설명의 출발",
    "workScene": {
      "status": "fictional_not_customer_history",
      "text": "가상 분석에서 반례와 남은 질문을 함께 정리"
    },
    "economicScene": "추가 조사와 사용할 결과의 투입 균형",
    "learningScene": "다른 조건의 사례를 설명",
    "action": "확인된 원국과 실제 질문만 연결",
    "counterexample": "예지·학력·합격·전문 자격 보장 금지",
    "distinctFromOtherParagraphs": "긍정 상징을 축소하지 않고 검증할 활용 조건을 제시",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_natal_only",
      "saju": "실제 본인의 원국 계산·위치·월령·강약·성립/반대조건과 원래 전거/검토 상태 확인. 연구 항목 존재는 계산 Evidence가 아님.",
      "mbti": "미입력 유형을 만들지 않음. 회수는 실제 도입된 원천을 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "예지·학력·합격·전문 자격 보장 금지",
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
