/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH08_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH08.P1:parent-intj-reasoning",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "본인이 부모 역할을 선택한다면 정답보다 생각하는 과정을 돕는 강점의 적용 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "teach_how_to_think는 부모 본인의 성향 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "어떤 방법을 시도했는지 듣고 다음 질문을 작게 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "스스로 판단할 자리를 남기는 방향으로 쓸 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "아이의 나이와 표현 능력은 별도 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "825fd4e9a742a121464b"
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
    "positive": "답을 모르는 상황도 함께 탐색할 여지",
    "risk": "설명 못 한 감정까지 논리로 정리하게 요구",
    "factBomb": "생각을 돕는 질문이 답을 검사하는 시험이 되어서는 안 된다.",
    "twist": "감정을 먼저 듣는 일이 생각할 여유를 줄 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 어려운 과제에서 해본 방법을 하나 묻는다."
      }
    ],
    "repairAction": "실제 연령과 도움 필요를 확인하고 질문 하나씩 제안한다.",
    "counterexample": "아이의 실제 표현 능력이 아직 충분하지 않다면 이유를 말하도록 요구하기보다 관찰과 지원이 먼저다.",
    "applicationLimit": "자녀 존재·지능·성적·성격을 본인 유형으로 예측하지 않는다.",
    "distinctFromOtherParagraphs": "독립 판단 지원과 성과 평가를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자녀 존재·지능·성적·성격을 본인 유형으로 예측하지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-intp-patience",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "낯선 관심을 바로 닫지 않고 탐색할 시간을 주는 부모 본인의 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "open_patient_parent는 본인 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "안전한 범위와 도움 요청 방법을 먼저 정할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "실용성이 바로 보이지 않는 질문도 다룰 여지를 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "자유로운 탐색이 실제로 필요한지는 아이에게 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "96124cd17e5740ab238f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CURIOSITY:alternative-search",
        "axis": "CURIOSITY",
        "definition": "기존 답 밖의 자료를 찾아봄",
        "condition": "조사 시간과 종료 조건 확인",
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
    "positive": "모르는 것을 물을 공간",
    "risk": "생활의 반복 약속을 덜 중요한 일로 밀기",
    "factBomb": "자유롭게 두는 일에도 찾을 수 있는 어른이 필요하다.",
    "twist": "간단한 생활 기준이 탐색의 여유를 지킬 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 안전한 재료로 궁금한 방법을 해보게 돕는다."
      }
    ],
    "repairAction": "시간·안전·도움 신호를 먼저 나눈다.",
    "counterexample": "안전 위험이 있거나 도움이 요청됐다면 기다리며 탐색하게 하는 태도만으로 충분하지 않다.",
    "applicationLimit": "아이가 실제로 호기심이 많거나 INTP라고 만들지 않는다.",
    "distinctFromOtherParagraphs": "부모의 탐색 허용과 아이의 실제 관심은 별개",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이가 실제로 호기심이 많거나 INTP라고 만들지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-entj-responsibility",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "부모 역할을 진지하게 준비하는 강점을 분명한 기준과 설명에 쓰는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "serious_responsible_parent는 본인의 책임 태도 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "기대할 행동과 어른이 지킬 몫을 같이 설명한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "기준이 무엇인지 알아보기 쉬운 환경을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "아이의 현재 가능 단계는 유형으로 알 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "41f807794a6c25d13e93"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:LEADERSHIP:dissent-channel",
        "axis": "LEADERSHIP",
        "definition": "이견이 들어올 통로를 만듦",
        "condition": "권력·평가 관계를 먼저 확인",
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
    "positive": "필요한 준비와 안내를 꾸준히 맡을 여지",
    "risk": "아직 못 하는 일을 의지 부족으로 평가",
    "factBomb": "높은 기준이 지금 해낼 수 있는 단계를 대신하지는 않는다.",
    "twist": "책임을 줄여 나누는 것이 도전을 돕는 방법일 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 생활 약속을 작은 단계로 같이 연습한다."
      }
    ],
    "repairAction": "가능한 단계와 필요한 지원을 먼저 묻는다.",
    "counterexample": "아직 가능한 단계가 확인되지 않았다면 분명한 기준을 제시해도 적절한 기대라고 할 수 없다.",
    "applicationLimit": "성취·진로·좋은 부모의 등급을 유형으로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "준비 책임과 아이의 수행 기대 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성취·진로·좋은 부모의 등급을 유형으로 단정하지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-entp-experiment",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "직접 해보며 배우게 하고 싶은 부모 본인의 강점을 안전한 시행착오로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "free_range_parenting는 본인의 양육 태도 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "위험을 막을 범위와 선택할 방법을 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "실수하지 않는 결과보다 시도 후 확인할 질문을 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "아이의 나이와 위험 수준은 개별 확인이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1ff3e720872ec12c58db"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CURIOSITY:alternative-search",
        "axis": "CURIOSITY",
        "definition": "기존 답 밖의 자료를 찾아봄",
        "condition": "조사 시간과 종료 조건 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "positive": "선택과 결과를 연결할 작은 경험",
    "risk": "새 경험에 집중해 필요한 반복을 빠뜨리기",
    "factBomb": "해보게 두는 자유는 위험을 혼자 감당하게 하는 자유가 아니다.",
    "twist": "멈출 때를 정하면 더 편하게 시도할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 안전한 놀이 방법 두 가지를 고르게 한다."
      }
    ],
    "repairAction": "중단 신호와 어른에게 물을 방법을 먼저 정한다.",
    "counterexample": "연령과 환경상 위험한 활동이라면 직접 해보는 경험을 양육의 장점으로 승인하지 않는다.",
    "applicationLimit": "실제 아이의 모험 성향이나 발달 단계를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "부모의 허용 태도와 아이의 능력·안전은 별도",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 아이의 모험 성향이나 발달 단계를 추정하지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-infj-opinion",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "어른과 의견이 달라도 이유를 말할 수 있게 돕는 부모 본인의 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "free_thinking_home는 본인 양육 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "먼저 설명하기보다 아이가 궁금한 범위를 듣는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "다른 답에도 이유를 묻는 생활 장면을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "아이의 실제 생각을 부모의 통찰로 대신 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "89f7385eacb614219d5c"
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
    "positive": "이견을 말할 기회와 어른이 그 이유를 들을 시간",
    "risk": "작은 질문에 큰 가치관을 길게 가르치기",
    "factBomb": "좋은 의미를 많이 말해도 아이가 묻던 답과 다를 수 있다.",
    "twist": "덜 설명하는 것이 더 많이 생각할 자리를 남길 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 의견이 다를 때 고른 이유부터 듣는다."
      }
    ],
    "repairAction": "질문의 범위와 지금 필요한 답을 확인한다.",
    "counterexample": "아이에게 지금 필요한 것이 짧은 사실 설명이라면 큰 가치 질문을 덧붙이지 않는다.",
    "applicationLimit": "아이의 성향·지능·가치관을 본인 유형으로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "의견 허용과 어른의 의미 전달을 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이의 성향·지능·가치관을 본인 유형으로 단정하지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-infp-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "개성을 존중하는 부모 본인의 강점을 안전한 선택 범위로 옮기는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "autonomy_parent는 본인의 태도 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "골라도 되는 부분과 함께 지킬 기본 약속을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "취향을 설명할 기회를 줄 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "선택지는 실제 나이와 안전 조건에 맞게 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "10d4177606458102491b"
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
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "positive": "남과 다른 관심도 말할 공간",
    "risk": "규칙을 요구하는 일을 사랑의 반대로 보기",
    "factBomb": "존중한다는 마음이 모든 경계를 없애야 한다는 뜻은 아니다.",
    "twist": "분명한 범위가 선택할 자유를 알아보기 쉽게 할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 준비된 두 가지 활동 중 고르게 한다."
      }
    ],
    "repairAction": "필수 안전 기준과 취향 선택을 나눈다.",
    "counterexample": "안전상 선택할 수 없는 행동은 자율성 존중을 이유로 허용할 필요가 없다.",
    "applicationLimit": "자녀의 실제 취향·출생·성별을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "무제한 허용과 선택권 존중의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자녀의 실제 취향·출생·성별을 생성하지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-enfj-emotional-base",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "마음을 말할 때 반응해주는 부모 본인의 강점을 답을 대신 정하지 않는 경청으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "emotional_anchor_parent는 본인의 양육 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "들은 감정을 확인하되 실제 원인은 아이에게 물어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "도움과 경청 중 지금 원하는 것을 확인할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "부모가 잘 읽는다는 이유로 아이 감정을 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cb9ee7415c4e3089e7f9"
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
    "positive": "곤란한 이야기도 꺼낼 통로",
    "risk": "모든 불편을 부모 책임으로 받아 해결부터 시작",
    "factBomb": "감정을 알아챘다고 그 감정의 주인이 바뀌지는 않는다.",
    "twist": "해결하지 않고 곁에서 듣는 것도 지원일 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 속상한 이야기에 들은 뜻을 짧게 되말한다."
      }
    ],
    "repairAction": "감정 확인 뒤 원하는 도움을 묻는다.",
    "counterexample": "아이의 실제 답이 부모의 추측과 다르면 추측을 고치고 현재 말을 보존해야 한다.",
    "applicationLimit": "실제 아동의 감정·진단·문제를 본인 자료에서 만들지 않는다.",
    "distinctFromOtherParagraphs": "감정 안전과 감정 대리 결정은 다름",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 아동의 감정·진단·문제를 본인 자료에서 만들지 않는다.",
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
    "id": "lkr:material:CH08.P1:parent-enfp-encouragement",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "readerQuestion": "내가 부모가 된다면",
    "researchKind": "mbti_application",
    "coreMeaning": "애정을 알아듣게 전하고 작은 시도를 응원하는 부모 본인의 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "조건부 부모 강점",
        "knowledge": "affectionate_support_parent는 본인의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 본인 근거",
        "knowledge": "결과만 칭찬하기보다 구체적으로 시도한 행동을 알아볼 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "돌봄 행동",
        "knowledge": "다시 해볼 선택이 남도록 강요 없는 반응을 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "좋은 적용 조건",
        "knowledge": "아이의 성공·자신감이 보장된다는 결론은 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "caa9d371cf4fbf58585d"
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
    "positive": "작은 도전을 알아주는 반응",
    "risk": "밝고 반가운 반응만 좋은 모습으로 보상",
    "factBomb": "웃지 않는 날에도 애정의 자리는 남아야 한다.",
    "twist": "기쁜 결과가 없어도 해본 과정을 함께 볼 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 시작한 행동 하나를 구체적으로 알아준다."
      }
    ],
    "repairAction": "관찰한 행동과 아이가 느낀 점을 따로 묻는다.",
    "counterexample": "아이가 지금은 주목받기 싫다고 답하면 구체적인 칭찬도 조용한 방식으로 조정할 수 있다.",
    "applicationLimit": "아이의 성적·재능·성격을 예측하지 않는다.",
    "distinctFromOtherParagraphs": "응원의 구체성과 결과만 보는 칭찬의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이의 성적·재능·성격을 예측하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-istj-predictability",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "준비를 이어가는 부모 본인의 강점을 예측 가능한 작은 생활 순서로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "diligent_responsible_parent는 본인의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "어른의 기분에 따라 지시가 바뀌지 않도록 최소 순서를 설명한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "무엇부터 할지 알아볼 정보를 제공할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "아이에게 필요한 순서와 속도는 별도로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "63aa4d746575e86c7743"
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
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
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
    "positive": "반복할 기준을 알아보기 쉽게 할 가능성",
    "risk": "미래 준비를 이유로 놀이와 감정 이야기를 작게 보기",
    "factBomb": "책임 있게 준비하는 일에 오늘의 이야기를 듣는 몫도 있다.",
    "twist": "순서를 덜 정해도 지킬 기준을 더 분명히 할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 준비 순서를 짧게 보이게 두고 어려운 부분을 묻는다."
      }
    ],
    "repairAction": "필수 순서와 선택 가능한 방법을 나눈다.",
    "counterexample": "생활의 기본 순서는 유지해도 아이의 나이와 상황이 바뀌면 방법은 달라질 수 있다.",
    "applicationLimit": "실제 자녀의 성실함·성적·진로를 만들지 않는다.",
    "distinctFromOtherParagraphs": "생활의 예측 가능성과 미래 성과를 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 자녀의 성실함·성적·진로를 만들지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-isfj-security",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "일정한 돌봄을 주려는 부모 본인의 강점 안에 작은 선택을 남기는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "structured_home_parent는 본인의 양육 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "안전한 반복과 취향의 변화를 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "계획에 없던 관심을 바로 문제로 평가하지 않을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "아이의 현재 필요와 위험은 실제 정보가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f9709a2aaf92c814cb26"
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
    "positive": "안심할 생활과 자기 선택을 함께 마련",
    "risk": "낯선 방법을 불안정하다는 이유로 차단",
    "factBomb": "평소 순서와 다르다고 위험한 선택인 것은 아니다.",
    "twist": "작은 변화를 허용해도 기본 돌봄은 이어질 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 해야 할 일을 유지하되 할 순서를 고르게 한다."
      }
    ],
    "repairAction": "안전 조건을 먼저 두고 방법 선택을 남긴다.",
    "counterexample": "평소와 다른 선택이어도 위험이 확인되지 않았다면 안정감을 이유로 모두 막지 않는다.",
    "applicationLimit": "현재 자녀의 존재나 불안·기질을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "안정감의 강점과 과잉 보호를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 자녀의 존재나 불안·기질을 추정하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-estj-rules-explained",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "규칙을 분명하게 전하는 부모 본인의 강점을 이유와 어른의 모범으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "clear_rules_parent는 본인의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "기대 행동을 구체적으로 설명하고 어른도 같은 기준을 지킨다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "막연한 착함보다 실제로 할 일을 알아볼 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "규칙은 실제 연령·안전·상황에 맞춰 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d2987b5b1ad27d7ff7dc"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
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
    "positive": "무엇을 기대하는지 알아볼 수 있는 구체적인 생활 기준",
    "risk": "다른 방식을 버릇없음으로만 평가",
    "factBomb": "오래된 규칙이라는 이유만으로 지금도 맞는 답은 아니다.",
    "twist": "책임은 유지하되 방법은 바꿀 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 함께 쓴 물건을 정리할 이유를 설명한다."
      }
    ],
    "repairAction": "규칙의 목적과 바꿀 수 있는 방법을 나눈다.",
    "counterexample": "어른도 지킬 수 없거나 이유가 맞지 않는 규칙이라면 설명의 분명함만으로 적절해지지 않는다.",
    "applicationLimit": "복종으로 좋은 아이나 좋은 부모를 평가하지 않는다.",
    "distinctFromOtherParagraphs": "명확한 책임과 권위의 일방성 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "복종으로 좋은 아이나 좋은 부모를 평가하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-esfj-belonging",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "함께하는 돌봄을 주려는 부모 본인의 강점을 소속감과 개별 선택이 공존하는 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "protective_parenting는 본인 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "가족 일정이 있다면 모두 함께할 일과 각자 고를 일을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "편히 기댈 수 있어도 다른 취향을 말할 자리가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "가족 구성과 아이의 실제 성향을 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "59af620140e08fabfd3e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
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
    "positive": "함께할 통로를 꾸준히 마련",
    "risk": "걱정으로 작은 선택까지 대신하기",
    "factBomb": "보호받는다는 사실이 내 선택도 남아 있다는 뜻은 아닐 수 있다.",
    "twist": "고르도록 기다리는 것이 보호의 일부가 될 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 참여할 방법 두 가지와 쉬는 선택을 둔다."
      }
    ],
    "repairAction": "위험과 낯선 취향을 구분해 질문한다.",
    "counterexample": "함께하는 일정이 실제로 부담이라면 다른 참여 방식이나 쉬는 선택이 필요할 수 있다.",
    "applicationLimit": "실제 아이의 친구·위험 행동·성격을 예측하지 않는다.",
    "distinctFromOtherParagraphs": "소속감을 공동 취향 강요와 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 아이의 친구·위험 행동·성격을 예측하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-istp-help-access",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "간섭을 줄이는 부모 본인의 강점에 도움을 청할 통로를 같이 두는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "open_non_controlling_parent는 본인의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "혼자 해볼 범위와 어른을 찾을 신호를 정한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "직접 고르는 경험과 필요한 지원을 연결할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "스스로 하겠다는 답만으로 감정적 도움도 불필요하다고 보지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "63356dc69674fed27d17"
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
    "positive": "자기 선택과 도움 요청이 함께 가능한 환경",
    "risk": "눈에 보이는 문제가 없으면 관심 질문도 생략",
    "factBomb": "혼자 할 수 있다는 사실이 혼자 견디고 싶다는 답은 아니다.",
    "twist": "간섭을 줄여도 짧은 안부는 남길 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 안전한 과제를 맡기고 필요하면 부를 방법을 알려준다."
      }
    ],
    "repairAction": "도움의 신호와 돌아볼 시점을 확인한다.",
    "counterexample": "혼자 해낼 수 있는 과제라도 정서적 도움을 원한다면 간섭을 줄이는 것만이 지원은 아니다.",
    "applicationLimit": "아이의 독립성·안전·실제 문제를 본인 유형으로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "비간섭과 방치의 차이를 정보 통로로 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이의 독립성·안전·실제 문제를 본인 유형으로 판단하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-isfp-warm-limit",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "편안하게 함께하는 부모 본인의 강점에 필요한 한계를 짧게 말하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "friend_like_parent는 본인의 양육 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "가까운 대화와 어른이 맡을 안전 책임은 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "싫어하는 감정은 듣되 멈출 행동은 알려줄 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "친구 같다는 이유로 책임까지 같은 위치로 놓지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ed69b25578fd3caf28c9"
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
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "어려운 이야기도 꺼낼 분위기",
    "risk": "분위기를 지키려 위험한 행동의 중단을 미루기",
    "factBomb": "가까운 어른도 해야 할 거절이 있다.",
    "twist": "한계를 짧게 말해도 편안한 관계를 유지할 여지가 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 화난 마음은 듣고 위험한 행동은 멈춘다."
      }
    ],
    "repairAction": "감정 수용과 행동 경계를 별도로 말한다.",
    "counterexample": "즉시 멈춰야 할 위험 행동이라면 분위기를 지키려고 한계 안내를 미루지 않는다.",
    "applicationLimit": "아이의 감정·나이·가정 갈등을 만들어 넣지 않는다.",
    "distinctFromOtherParagraphs": "따뜻함과 한계 설정의 공존",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이의 감정·나이·가정 갈등을 만들어 넣지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-estp-activity-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "새 활동을 함께 해보는 부모 본인의 강점에 참여 강도와 중단 선택을 두는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "adventure_parent는 본인의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "어른의 즐거움과 아이가 고른 경험을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "안전한 단계 안에서 직접 시도할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "아이의 능력·건강·모험 선호는 실제 확인이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "15008cf38f6d07145c5e"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
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
    "positive": "새 환경을 알아갈 기회",
    "risk": "어른이 즐긴 경험을 좋은 경험으로 강요",
    "factBomb": "많은 경험을 주는 것과 원하는 경험을 듣는 것은 다르다.",
    "twist": "작게 해보고 멈추는 선택도 경험의 일부다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 활동 전에 해볼 수준과 멈출 신호를 정한다."
      }
    ],
    "repairAction": "참여 의사·안전·지원 방법을 확인한다.",
    "counterexample": "아이가 원하지 않는 경험이면 어른이 즐겼다는 이유로 참여를 요구하지 않는다.",
    "applicationLimit": "실제 아이의 재능이나 위험 허용 수준을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "활동 지원과 어른의 목표 투사를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 아이의 재능이나 위험 허용 수준을 추정하지 않는다.",
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
    "id": "lkr:material:CH08.P2:parent-esfp-shared-interest",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "readerQuestion": "아이에게 줄 수 있는 좋은 영향",
    "researchKind": "mbti_application",
    "coreMeaning": "새로운 장소와 활동을 나누는 부모 본인의 강점을 아이의 관심을 듣는 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "다른 양육 강점",
        "knowledge": "travel_parenting는 본인의 자료이며 실제 여행 이력은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "일정을 많이 채우기보다 기억에 남은 부분을 물을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "함께하는 상황",
        "knowledge": "즐겁게 반응하지 않는 날에도 참여 방식을 고르게 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "양육 조건",
        "knowledge": "연령과 여력에 맞는 활동 검토가 별도로 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1efb6b1d8473aa2560f6"
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
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
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
    "positive": "자기 관심을 발견할 질문",
    "risk": "반가운 반응이 나오는 활동만 남기기",
    "factBomb": "즐겁게 보여야 좋은 경험인 것은 아니다.",
    "twist": "다시 하지 않겠다는 답도 관심을 아는 정보다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 짧은 나들이 뒤 다시 하고 싶은 것과 싫었던 것을 묻는다."
      }
    ],
    "repairAction": "기억에 남은 경험과 다음 선택을 아이에게 듣는다.",
    "counterexample": "새 장소보다 익숙한 곳이 편한 실제 선택이라면 경험의 폭을 늘리는 것이 필요한 지원은 아니다.",
    "applicationLimit": "아이가 밝은 성격이거나 사회성이 좋을 것이라고 예측하지 않는다.",
    "distinctFromOtherParagraphs": "경험의 양보다 자기 관심의 수신",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이가 밝은 성격이거나 사회성이 좋을 것이라고 예측하지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-high-expectation",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "높은 기대를 가진 부모 본인이 아이 목표와 어른 목표를 분리할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "child_success_projection는 부모의 가능 반응 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "어떤 결과를 원하는지 아이에게 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "도움을 청한 순간을 능력 시험으로 바꾸지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "실제 성취 부진이나 자녀 문제를 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "46eb373ed8de497e1ba3"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "axis": "GOAL_DRIVE",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
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
    "positive": "도전할 준비를 지원할 여지",
    "risk": "부모가 정한 성공을 유일한 목표로 두기",
    "factBomb": "가능성을 믿는 말도 그 사람의 목표를 대신 정할 수는 없다.",
    "twist": "작은 목표를 함께 고르면 기대를 지원으로 바꿀 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 다음 도전의 목표를 먼저 묻는다."
      }
    ],
    "repairAction": "아이 목표·지원 필요·부모 기대를 따로 적는다.",
    "counterexample": "아이 자신의 목표가 다르다면 부모가 믿는 성공 방향을 도전의 조건으로 강요하지 않는다.",
    "applicationLimit": "성적·진로·장래 성공을 예언하지 않는다.",
    "distinctFromOtherParagraphs": "부모의 기대와 아이의 목표 소유권",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성적·진로·장래 성공을 예언하지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-overprotection",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "미리 위험을 막으려는 부모 본인이 안전과 단지 낯선 선택을 구분하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "protective_overinvolvement는 본인의 위험 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "실제 위험과 부모가 불편한 이유를 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "안전한 범위에서 고를 기회를 남길 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "구체적 안전 판단은 연령·환경 정보가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "3888aa2e5b9fb179e218"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "positive": "위험을 살피면서 자기 판단의 기회를 지킬 여지",
    "risk": "작은 시행착오까지 대신 없애기",
    "factBomb": "대신 고른 답이 안전해도 스스로 고를 연습은 남지 않을 수 있다.",
    "twist": "옆에서 기다리는 보호도 가능하다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 안전한 준비 두 가지 중 직접 고르게 한다."
      }
    ],
    "repairAction": "즉시 막을 위험과 지켜볼 시도를 나눈다.",
    "counterexample": "실제 안전 위험이 확인됐다면 선택 연습이라는 이유로 보호 책임을 줄이지 않는다.",
    "applicationLimit": "아이가 위험한 성격이라는 결론을 만들지 않는다.",
    "distinctFromOtherParagraphs": "보호의 이유와 선택 제한의 범위",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이가 위험한 성격이라는 결론을 만들지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-emotion-reading",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "감정을 이해하고 싶은 부모 본인이 아이의 말보다 추측을 앞세우는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "understanding_parent는 본인의 관심 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "표정을 보고 떠올린 이유를 사실처럼 말하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "들어본 감정을 다시 확인할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "아이의 감정과 원인은 본인 MBTI로 알 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ea9519a12540624c4823"
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
    "positive": "말하기 어려운 마음을 꺼낼 여지",
    "risk": "밝아져야 괜찮아졌다고 판단",
    "factBomb": "내가 이해했다고 느끼는 것과 아이가 말한 것은 다를 수 있다.",
    "twist": "모르겠다고 묻는 태도가 더 정확한 이해가 된다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 표정이 달라 보여도 어떤 기분인지 열린 질문을 한다."
      }
    ],
    "repairAction": "관찰·추측·실제 답을 분리한다.",
    "counterexample": "말로 표현하지 못하는 실제 연령이라면 열린 질문만 반복하기보다 검증된 연령별 돌봄 지식이 추가로 필요하다.",
    "applicationLimit": "우울·불안·기질 등 아동 진단을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "감정 공감과 감정 대리 확정의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "우울·불안·기질 등 아동 진단을 생성하지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-results-only",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "현실적인 준비를 돕는 부모 본인이 결과만으로 하루의 가치를 판단하는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "practical_success_parenting는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "공부와 별개로 즐긴 일이나 힘들었던 일을 들을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "실용적인 준비와 마음을 나누는 통로를 동시에 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "실제 학업·놀이·친구 문제는 입력 없이는 모른다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d34d165d4966692ca6cb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
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
    "positive": "필요한 연습을 작게 돕는 가능성",
    "risk": "성과에 도움 되는 이야기만 중요하게 듣기",
    "factBomb": "미래에 쓸모가 있다는 이유만으로 오늘의 관심을 평가할 수는 없다.",
    "twist": "결과 없는 시도도 다음 선택의 정보가 된다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 잘한 결과 외에 해보고 싶었던 일을 묻는다."
      }
    ],
    "repairAction": "준비 질문과 관심 질문을 하나씩 둔다.",
    "counterexample": "실제 과제의 준비가 급한 상황이라도 관심과 감정 이야기를 무가치한 것으로 평가하지 않는다.",
    "applicationLimit": "아이 성적·적성·진로를 부모 차트에서 추론하지 않는다.",
    "distinctFromOtherParagraphs": "실용 지원의 과용과 경험의 가치 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "아이 성적·적성·진로를 부모 차트에서 추론하지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-debate-as-listen",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "질문을 즐기는 부모 본인이 대화에서 이기려는 태도를 경청과 구분하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "debating_with_child는 부모 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "아이의 이유를 반박 재료보다 알아갈 정보로 듣는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "답을 바로 말하지 못해도 질문할 권리를 남긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "아이의 논리 능력을 나이 없이 평가하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1de5594bb3cc1a883744"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
    "positive": "다른 생각을 말할 연습",
    "risk": "어른의 언어 능력으로 결론을 닫기",
    "factBomb": "대화에서 이겼다고 아이의 생각을 들은 것은 아니다.",
    "twist": "답을 고치지 않아도 질문을 더 잘 만들 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 다른 의견에서 이유 하나를 먼저 듣는다."
      }
    ],
    "repairAction": "반박 전에 들은 이유를 되말한다.",
    "counterexample": "아이의 실제 언어 수준에 맞지 않으면 토론 형식의 질문을 사용하지 않는다.",
    "applicationLimit": "모든 연령에 토론을 적합한 양육법으로 권하지 않는다.",
    "distinctFromOtherParagraphs": "질문과 어른의 우위 사용을 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "모든 연령에 토론을 적합한 양육법으로 권하지 않는다.",
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
    "id": "lkr:material:CH08.P3:parent-monopoly-fatigue",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "readerQuestion": "부모 역할에서 조심할 점",
    "researchKind": "mbti_application",
    "coreMeaning": "돌봄을 혼자 맡으려는 부모 본인이 책임을 나누고 지원을 요청할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "과해질 성향",
        "knowledge": "self_sacrificing_parent는 본인의 가능 위험 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "부담의 이유",
        "knowledge": "양육을 선택했다면 다른 보호자와 지원 자원의 존재를 실제 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "보호 교육 기대",
        "knowledge": "혼자 감당하지 않아도 책임 있는 돌봄이 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "의도와 필요 구분",
        "knowledge": "다른 보호자의 존재와 여력을 만들어 넣지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "31fe578398dda7ed2b7e"
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
    "positive": "지속 가능한 돌봄의 범위를 말할 가능성",
    "risk": "내가 해야 안심된다는 이유로 모든 역할을 독점",
    "factBomb": "모두 맡았다는 사실이 모두 가능한 상태라는 뜻은 아니다.",
    "twist": "도움을 청하는 일이 돌봄의 일부가 될 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 쉬어야 할 시간과 요청할 지원을 정리한다."
      }
    ],
    "repairAction": "현재 확인된 지원 통로와 필요한 과제를 나눈다.",
    "counterexample": "확인된 다른 보호자나 서비스가 없다면 역할을 나누라는 말만으로 실제 지원이 생기지 않는다.",
    "applicationLimit": "부모의 소진·질병·실제 가족 갈등을 진단하지 않는다.",
    "distinctFromOtherParagraphs": "책임의 강점과 역할 독점의 비용",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "부모의 소진·질병·실제 가족 갈등을 진단하지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-age-aware-question",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "질문하는 양육을 쓰기 전에 아이의 실제 연령과 이해 범위를 확인하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "본인의 생각 지원 성향은 질문 방식의 후보일 뿐이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "발달 단계와 언어 이해는 별도 자료가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "지금 설명할 수 있는 단위로 질문을 줄일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "나이를 모르면 특정 연령의 기술이나 성취를 요구하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "825fd4e9a742a121464b"
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
    "positive": "서로 알아들을 질문을 고를 가능성",
    "risk": "설명 못 하는 답을 의지 부족으로 보기",
    "factBomb": "좋은 질문도 답할 준비를 넘으면 시험이 될 수 있다.",
    "twist": "답을 기다리는 시간이 설명을 더하는 것보다 필요할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 무엇이 어려웠는지 하나씩 묻고 필요한 도움을 확인한다."
      }
    ],
    "repairAction": "연령 확인 전에는 일반적인 열린 질문으로 제한한다.",
    "counterexample": "아이의 나이와 이해 범위가 확인되기 전에는 구체적인 발달 기대를 제시하지 않는다.",
    "applicationLimit": "발달·건강·진단의 판단을 본인 유형에서 만들지 않는다.",
    "distinctFromOtherParagraphs": "개인화보다 먼저 확인할 발달·입력 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "발달·건강·진단의 판단을 본인 유형에서 만들지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-model-commitment",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "규칙을 알려주는 어른 자신도 지킬 작은 약속을 남기는 양육 행동을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "분명한 기준을 전하는 본인 자료를 조건으로 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "어른이 바꾸어야 할 약속도 미리 알린다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "말과 행동의 차이를 함께 돌아볼 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "어른의 완벽함을 양육 조건으로 요구하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d2987b5b1ad27d7ff7dc"
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
        "id": "sar:facet:PRACTICALITY:outcome-check",
        "axis": "PRACTICALITY",
        "definition": "실행 뒤 남은 결과를 확인",
        "condition": "평가 기간과 기준을 명시",
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
    "positive": "기대가 일방적이지 않은 생활",
    "risk": "아이만 규칙을 지켜야 한다고 생각",
    "factBomb": "규칙의 이유를 가르치려면 어른의 예외도 설명해야 한다.",
    "twist": "실수를 인정하는 행동도 책임을 보여줄 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 못 지킨 약속을 짧게 인정하고 다시 가능한 때를 알린다."
      }
    ],
    "repairAction": "약속은 실제 가능한 범위로 줄이고 변경을 설명한다.",
    "counterexample": "불가피하게 약속이 바뀌었다면 무조건 지킨 척하기보다 이유와 새 범위를 설명하는 것이 필요할 수 있다.",
    "applicationLimit": "실제 부모의 실수나 아이의 신뢰 문제를 생성하지 않는다.",
    "distinctFromOtherParagraphs": "규칙 전달과 어른의 이행을 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 부모의 실수나 아이의 신뢰 문제를 생성하지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-consent-respect",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "자기 선택을 존중하는 양육 강점을 몸·정보·취향의 경계를 설명하는 행동으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "자율성을 지키려는 본인 원천이 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "안전 책임을 유지하면서 싫다는 표현도 들을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "친밀한 가족이라는 이유로 모든 표현에 동의한 것으로 보지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "구체적 아동 보호 절차는 별도 검증 자료가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "10d4177606458102491b"
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
    "relationshipStatuses": [
      "",
      "single",
      "some",
      "dating",
      "marriage_preparing",
      "married"
    ],
    "positive": "거절과 도움 요청을 말할 통로",
    "risk": "예의나 가족 관계를 이유로 불편한 접촉을 강요",
    "factBomb": "가족이라는 이름이 모든 동의를 대신하지는 않는다.",
    "twist": "다른 인사 방법을 고르는 것으로 존중을 연습할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 인사할 방법을 고르게 하고 싫은 접촉은 강요하지 않는다."
      }
    ],
    "repairAction": "안전·동의·대안을 나눠 설명한다.",
    "counterexample": "필수 안전 조치가 필요한 경우에는 선택 가능한 방식과 어른의 책임을 구분해야 한다.",
    "applicationLimit": "현재 학대 피해나 가해자를 특정하지 않는다.",
    "distinctFromOtherParagraphs": "자율성과 관계 경계를 구체 행동으로 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "현재 학대 피해나 가해자를 특정하지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-support-channel",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "사생활을 존중하면서 필요한 도움을 청할 통로를 남기는 양육 방향을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "privacy_respecting_parent는 본인의 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "모든 이야기를 보고하게 하기보다 요청하면 응답할 방법을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "위험이 있을 때 찾을 수 있는 실제 어른과 지원은 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "지원 기관의 지역·대상 조건은 별도 검증이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5d03c8ad1c25fc371767"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
    "positive": "독립과 도움 요청이 공존",
    "risk": "개인 영역 존중을 이유로 돌봄의 확인을 전부 생략",
    "factBomb": "사생활을 지키는 일에 도움의 문을 닫을 필요는 없다.",
    "twist": "묻는 횟수보다 응답 가능한 통로가 중요할 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택했다면 곤란할 때 어떤 방식으로 도움을 요청할지 같이 정한다."
      }
    ],
    "repairAction": "실제 사용 가능한 사람과 방법을 확인한다.",
    "counterexample": "실제로 사용할 수 없는 지원 통로라면 도움을 청할 수 있다고 보장하지 않는다.",
    "applicationLimit": "실제 아동의 위험·가족 구성·연락처를 만들어내지 않는다.",
    "distinctFromOtherParagraphs": "사적 범위와 실제 지원 접근성의 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 아동의 위험·가족 구성·연락처를 만들어내지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-care-sustainable",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "mbti_application",
    "coreMeaning": "부모 본인의 혼자 회복할 필요를 아이의 돌봄 공백과 구분하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "parent_needs_alone_time는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "양육을 선택한다면 쉬는 동안 필요한 돌봄을 어떻게 유지할지 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "확인된 다른 보호자나 서비스가 있다면 역할을 상의할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "지원이 없으면 있다고 가정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ff09b3cb5318045846ad"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
    "positive": "돌봄과 회복의 현실 조건을 함께 볼 가능성",
    "risk": "자율성을 이유로 아이에게 어른의 회복을 책임지게 하기",
    "factBomb": "어른의 휴식이 필요하다고 아이의 돌봄 필요가 사라지지는 않는다.",
    "twist": "역할을 줄이거나 도움을 찾는 것이 먼저일 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 부모 역할을 맡는다면 필요한 휴식과 반드시 유지할 돌봄을 따로 적는다."
      }
    ],
    "repairAction": "현재 여력과 확인된 지원만으로 가능한 계획을 고른다.",
    "counterexample": "돌봄을 대신할 자원이 없다면 휴식 시간의 배정 전에 유지할 최소 돌봄과 확인된 지원을 다시 검토해야 한다.",
    "applicationLimit": "실제 소진·우울·가족 지원을 진단하거나 보충하지 않는다.",
    "distinctFromOtherParagraphs": "부모 회복과 아이 돌봄의 별도 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 소진·우울·가족 지원을 진단하거나 보충하지 않는다.",
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
    "id": "lkr:material:CH08.P4:parent-optout-warmth",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "readerQuestion": "나에게 맞는 부모 역할",
    "researchKind": "input_context",
    "coreMeaning": "부모 역할을 선택하지 않아도 돌봄의 강점을 가질 수 있다는 적용 범위를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "긍정적 역할",
        "knowledge": "관계 상태와 자녀 유무·출산 의사는 별도 정보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "주의점 보완",
        "knowledge": "모든 양육 설명은 역할을 선택한다면이라는 조건을 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "일상 행동",
        "knowledge": "가족의 형태와 삶의 선택을 등급화하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "따뜻한 마무리",
        "knowledge": "자녀를 가져야 좋은 성향이 완성된다고 말하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "7dd6ccfe702fb492ef5e"
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
        "id": "sar:facet:CARE:sustainable-care",
        "axis": "CARE",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
    "positive": "선택권을 지키면서 조건부로 자기 성향을 알아갈 가능성",
    "risk": "따뜻한 마무리를 출산 권유로 바꾸기",
    "factBomb": "돌보는 힘이 있다는 사실이 부모가 되어야 한다는 의무는 아니다.",
    "twist": "다른 관계에서도 돌봄의 자원을 쓸 수 있다.",
    "scenes": [
      {
        "kind": "PARENTING_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 양육을 선택할 생각이 있다면 필요한 지원 조건부터 적는다."
      }
    ],
    "repairAction": "실제 의사와 입력 범위를 확인하고 추정을 보류한다.",
    "counterexample": "실제 양육을 선택해 필요한 질문을 원하는 사람에게 선택권만 말하며 실용적인 내용을 비워두지 않는다.",
    "applicationLimit": "출산·임신·성별·수명·자녀 수를 예측하지 않는다.",
    "distinctFromOtherParagraphs": "양육 연구의 적용 선택권을 명시",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "출산·임신·성별·수명·자녀 수를 예측하지 않는다.",
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
