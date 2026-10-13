/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH01_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH01.P1:care-asked",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "나의 기본적인 연애 스타일",
    "researchKind": "mbti_application",
    "coreMeaning": "필요를 알아보는 관심과 동의한 도움을 건네는 행동을 나눠 사랑의 방식을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 성향",
        "knowledge": "본인의 attuned_partner는 관심의 방향을 설명하는 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "친밀감의 행동",
        "knowledge": "도움을 바로 실행하기 전에 원하는 도움을 물을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "긍정적인 면",
        "knowledge": "실제로 필요한 몫을 덜면 상대의 선택도 남는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "핵심 연애 방식",
        "knowledge": "돌봄의 크기보다 요청과 응답이 맞는지가 핵심이다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6e846060eca8b8a32399"
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
        "id": "sar:facet:CARE:respectful-nonintervention",
        "axis": "CARE",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
    "positive": "작은 불편을 듣고 적절한 지원을 고를 가능성",
    "risk": "미리 정한 도움을 거절하면 애정 거부로 읽을 위험",
    "factBomb": "잘 알아챘다고 상대의 답까지 받은 것은 아니다.",
    "twist": "돕지 않을 때에도 관심을 표현할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 피곤하다는 말에 식사 준비와 조용히 쉬기 중 무엇이 필요한지 묻는다."
      }
    ],
    "repairAction": "한 번의 도움을 제안하고 거절할 선택도 남긴다.",
    "counterexample": "상대가 혼자 처리하고 싶다고 답하면 바로 돕는 행동보다 기다리는 쪽이 필요할 수 있다.",
    "applicationLimit": "요청이 확인되지 않았다면 세심함을 실제 도움의 성과로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "CH02의 매력 인상과 달리 도움을 제공하는 기본 과정",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "요청이 확인되지 않았다면 세심함을 실제 도움의 성과로 단정하지 않는다.",
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
    "id": "lkr:material:CH01.P1:quiet-concentration",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "나의 기본적인 연애 스타일",
    "researchKind": "mbti_application",
    "coreMeaning": "표현량이 작은 애정에서 선택한 사람에게 주의를 지속하는 방식과 전달 통로를 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 성향",
        "knowledge": "reserved_affection은 말수와 관심을 같은 것으로 보지 않는 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "친밀감의 행동",
        "knowledge": "가까운 사람에게만 남기는 시간과 작은 반응을 관찰 질문으로 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "긍정적인 면",
        "knowledge": "반복 가능한 관심은 큰 행사를 매번 준비할 부담을 줄일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "핵심 연애 방식",
        "knowledge": "표현이 조용해도 무엇이 애정인지 알려줄 통로는 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ed6c765a89a6653fbe49"
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
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
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
    "positive": "평범한 약속에서 지속할 수 있는 관심",
    "risk": "조용하다는 이유로 설명할 책임까지 생략",
    "factBomb": "말하지 않는 진심은 상대가 확인할 수 없는 진심일 수 있다.",
    "twist": "말을 늘리는 것보다 이미 하는 행동의 뜻을 알려줄 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 전 시간을 비워둔 이유를 짧게 전한다."
      }
    ],
    "repairAction": "자주 하는 배려 하나와 그 뜻을 말로 연결한다.",
    "counterexample": "본인이 말로 자주 확인받기를 원한다면 조용한 반복만으로는 편하지 않을 수 있다.",
    "applicationLimit": "원천의 충실함 표현을 실제 외도 여부의 증거로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "CH05의 오래된 관계 유지와 달리 표현 방식의 첫 정의",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "원천의 충실함 표현을 실제 외도 여부의 증거로 쓰지 않는다.",
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
    "id": "lkr:material:CH01.P1:self-retained",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "나의 기본적인 연애 스타일",
    "researchKind": "mbti_application",
    "coreMeaning": "각자의 관심사에 머물 시간과 함께할 선택이 공존하는 애정 방식을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 성향",
        "knowledge": "freedom_based_attachment의 본인 몰입 필요를 읽는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "친밀감의 행동",
        "knowledge": "혼자 보낼 시간과 관계를 위해 고른 시간을 따로 표시한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "긍정적인 면",
        "knowledge": "자기 취향을 숨기지 않아 서로의 실제 모습을 알 기회가 생긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "핵심 연애 방식",
        "knowledge": "개인 공간은 연락과 책임의 전면 면제가 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "2f90ecfe06a11bd76f98"
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
    "positive": "동조를 강요하지 않는 가까움",
    "risk": "거리의 이유를 설명하지 않아 무관심으로 전달",
    "factBomb": "자유를 지켰다는 이유로 기다리는 사람의 시간을 지워서는 안 된다.",
    "twist": "혼자 있을 시간을 말하는 일이 관계에 참여하는 행동일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 개인 작업 후 통화 가능한 때를 먼저 제안한다."
      }
    ],
    "repairAction": "필요한 공간과 다시 만날 통로를 함께 말한다.",
    "counterexample": "함께 활동할 때 오히려 회복되는 사람에게 혼자 있는 시간을 기본값으로 주지 않는다.",
    "applicationLimit": "실제 몰입 선호가 다르면 유형만으로 혼자 있어야 한다고 규정하지 않는다.",
    "distinctFromOtherParagraphs": "CH07의 공간 사용 규칙과 달리 본인의 애정 작동 방식",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 몰입 선호가 다르면 유형만으로 혼자 있어야 한다고 규정하지 않는다.",
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
    "id": "lkr:material:CH01.P1:shared-meaning",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "readerQuestion": "나의 기본적인 연애 스타일",
    "researchKind": "mbti_application",
    "coreMeaning": "감정적 유대의 깊이를 거창한 운명보다 서로 중요하게 여기는 의미를 알아가는 과정으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "대표 성향",
        "knowledge": "deep_emotional_bond는 본인이 중요하게 느끼는 연결의 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "친밀감의 행동",
        "knowledge": "작은 선택이 왜 소중했는지 서로 설명하는 행동을 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "긍정적인 면",
        "knowledge": "표면의 공통 취미가 없어도 가치의 대화가 이어질 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "핵심 연애 방식",
        "knowledge": "깊이를 원한다는 사실은 상대가 같은 의미를 느낀다는 증거가 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1ad75d65f36179f32968"
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
        "id": "sar:facet:DEPTH:context-layer",
        "axis": "DEPTH",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
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
    "positive": "마음을 존중받는 대화를 찾아갈 가능성",
    "risk": "상대의 다른 이유를 유대의 부족으로 판단",
    "factBomb": "내게 특별한 장면이 상대에게도 같은 약속은 아니다.",
    "twist": "같은 행동에 다른 의미가 있어도 관계를 알아갈 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 기억에 남은 대화에서 각자가 좋았던 부분을 묻는다."
      }
    ],
    "repairAction": "상대의 이유를 내 해석과 나란히 기록한다.",
    "counterexample": "가벼운 경험을 즐기는 것이 지금 더 중요하다면 깊은 가치 대화가 필요한 때가 아닐 수 있다.",
    "applicationLimit": "실제 연애 경험이나 영혼의 짝을 만들지 않는다.",
    "distinctFromOtherParagraphs": "CH03의 관계 선택 기준 이전에 사랑의 의미를 읽는 방식",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 연애 경험이나 영혼의 짝을 만들지 않는다.",
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
    "id": "lkr:material:CH01.P2:saju-output-context",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 설명하는 사랑",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "식신의 산출 관계와 함께 즐기는 현대적 연애 적용을 서로 다른 근거 수준으로 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "식신은 일간이 생하며 같은 음양인 기존 계산 관계다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "먹고 즐기는 행동을 보편적인 연애 사실로 확정할 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 관계 MBTI",
        "knowledge": "실제 본인의 ESFP 애정 표현 자료가 있다면 말과 행동의 통로를 별도로 읽는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "검증된 결합",
        "knowledge": "명리의 산출 의미와 실제 MBTI 표현 자료는 각각 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "90e77590d3ea07930ba1",
      "9a582309fae56a95316b",
      "22219e4de369178b0387"
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
        "id": "sar:facet:CARE:practical-support",
        "axis": "CARE",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
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
    "positive": "함께 만드는 경험에 마음을 전할 통로를 마련",
    "risk": "즐거운 분위기로 어려운 대화를 계속 미루기",
    "factBomb": "같이 즐겼다는 사실이 중요한 이야기를 끝냈다는 뜻은 아니다.",
    "twist": "편안한 활동이 진지한 대화를 시작할 여지가 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 산책 후 좋았던 일과 불편했던 일을 하나씩 묻는다."
      }
    ],
    "repairAction": "원국 조건과 생활 장면의 동의를 확인한 뒤 적용을 보류 또는 선택한다.",
    "counterexample": "식신의 산출 통로가 제약되는 기존 원국 조건이라면 편안한 표현의 장점으로 바로 적용하지 않는다.",
    "applicationLimit": "식신 하나로 자녀 유무나 연애 능력을 판정하지 않는다.",
    "distinctFromOtherParagraphs": "전통 관계 정의와 현대 생활 적용의 출처 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "실제 본인 원국의 Evidence·위치·성립/반대 조건과 원래 전거/검토 상태 확인. 관계·기간 사실을 원국 애정 성향으로 옮기지 않음.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "두 원천을 비교하는 조건부 연구이며 신규 등록 Fusion이 아님. 독립 사실 3개로 계산하지 않음.",
      "input": "식신 하나로 자녀 유무나 연애 능력을 판정하지 않는다.",
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
    "id": "lkr:material:CH01.P2:saju-equality-context",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 설명하는 사랑",
    "researchKind": "conditional_cross_source",
    "coreMeaning": "비견의 동류 관계와 본인의 독립성을 연애에서 대등하게 의견을 내는 조건부 질문으로 연결한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "같은 오행·같은 음양은 명리상의 상대 관계다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "독립 지원인지 과경쟁인지는 통근과 월령 등 원래 조건을 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 관계 MBTI",
        "knowledge": "실제 본인의 INTP 자유 선호 자료가 있다면 개인 공간의 필요를 별도 출처로 읽는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "검증된 결합",
        "knowledge": "본인 MBTI의 자유 선호가 있다 해도 명리와 별도 출처다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "3f130780549c6cb7a467",
      "5a745f7c32242de3a71e",
      "2f90ecfe06a11bd76f98"
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
        "id": "sar:facet:RELATION_STYLE:contact-range",
        "axis": "RELATION_STYLE",
        "definition": "연락·만남의 참여 범위를 정함",
        "condition": "실제 관계와 생활 제약이 주어진 때",
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
    "positive": "각자의 선택을 유지하며 공동 결정을 만드는 가능성",
    "risk": "나의 기준을 동등함의 유일한 기준으로 만들기",
    "factBomb": "대등하다는 말로 내 방식만 밀면 동등한 선택은 사라진다.",
    "twist": "서로 다른 결론을 보유할 권리도 대등함에 포함된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 주말 계획을 각자 낸 뒤 겹치는 부분만 고른다."
      }
    ],
    "repairAction": "비견의 실제 위치와 반대 조건을 확인하고 공동 선택 질문으로 제한한다.",
    "counterexample": "실제 비견의 과중첩과 경쟁 조건이 있다면 자립 지원만 긍정적으로 고르지 않는다.",
    "applicationLimit": "비견의 존재로 파트너 성격이나 관계 점수를 만들지 않는다.",
    "distinctFromOtherParagraphs": "독립 성향의 원국 조건과 실제 대등한 합의는 별개",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "실제 본인 원국의 Evidence·위치·성립/반대 조건과 원래 전거/검토 상태 확인. 관계·기간 사실을 원국 애정 성향으로 옮기지 않음.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "두 원천을 비교하는 조건부 연구이며 신규 등록 Fusion이 아님. 독립 사실 3개로 계산하지 않음.",
      "input": "비견의 존재로 파트너 성격이나 관계 점수를 만들지 않는다.",
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
    "id": "lkr:material:CH01.P2:fusion-visible-care",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 설명하는 사랑",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "돌봄 필요를 살피는 힘과 애정을 전달하는 힘을 실제 양측 근거가 충족될 때만 함께 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "C074는 CARE와 EXPRESSION의 기존 결합 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "명리와 MBTI가 어느 축을 맡는지 독립적으로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 관계 MBTI",
        "knowledge": "필요한 도움을 말과 행동으로 알리는 적용이 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "검증된 결합",
        "knowledge": "두 자료가 있다는 이유만으로 새 Fusion 사실을 발급하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "16a8411e967484ac9826"
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
    "positive": "관심이 무엇인지 상대가 확인할 통로",
    "risk": "알아듣기 쉬운 표현을 같은 크기의 답 요구로 바꾸기",
    "factBomb": "보이게 사랑했다는 사실이 답할 의무를 만들지는 않는다.",
    "twist": "표현의 선명함과 상대의 자유는 함께 남길 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 돕고 싶은 이유를 말한 뒤 가능한지 묻는다."
      }
    ],
    "repairAction": "실제 signed axis와 원천 domain을 확인하고 수신 질문을 둔다.",
    "counterexample": "명리 쪽의 CARE만 있고 실제 MBTI EXPRESSION 근거가 없으면 C074 결합 후보를 사용할 수 없다.",
    "applicationLimit": "한쪽 근거가 빠지면 결합 설명을 보류한다.",
    "distinctFromOtherParagraphs": "단일 표현 trait와 달리 양측의 서로 다른 기여를 점검",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "한쪽 근거가 빠지면 결합 설명을 보류한다.",
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
    "id": "lkr:material:CH01.P2:fusion-care-space",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "readerQuestion": "명리와 MBTI가 설명하는 사랑",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "아끼는 마음과 자기 선택권이 동시에 필요한 경우 돌봄의 지속 가능한 범위를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 근거",
        "knowledge": "C077의 두 역할은 돌봄과 자기 시간을 각각 지원해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "명리·MBTI 어느 쪽이 어떤 역할인지 바꾸어 자동 승인하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "실제 관계 MBTI",
        "knowledge": "가능한 도움의 크기를 말하면 지치기 전에 참여 방식을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "검증된 결합",
        "knowledge": "MBTI를 대운이나 상대방의 성격 근거로 쓰지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fa83818c7308d0737c2f"
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
    "positive": "자기 필요를 포함하는 돌봄",
    "risk": "한계를 말하지 않다가 도움 전체를 끊기",
    "factBomb": "모두 해준 뒤 사라지는 방식은 가능한 몫을 먼저 말하는 것과 다르다.",
    "twist": "일부만 돕겠다는 말이 관계를 오래 지킬 여지가 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 일정상 가능한 짧은 도움과 어려운 부분을 나눠 제안한다."
      }
    ],
    "repairAction": "두 축의 실제 개인 근거와 생활 여력을 따로 확인한다.",
    "counterexample": "돌봄과 자율 근거가 있어도 현재 맡은 긴급 책임이 있다면 개인 시간을 먼저 확보하는 답이 맞지 않을 수 있다.",
    "applicationLimit": "상대가 이미 의존한다거나 실제로 지쳤다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "돌봄 크기의 절충을 설명하는 조건부 결합",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "상대가 이미 의존한다거나 실제로 지쳤다고 단정하지 않는다.",
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
    "id": "lkr:material:CH01.P3:expression-and-receipt",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "마음을 표현하고 받아들이는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "애정이 드러나는 방식과 상대가 반갑게 받는 방식의 차이를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "애정 행동",
        "knowledge": "본인의 expressive_love_style는 표현 통로의 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "근거",
        "knowledge": "말·표정·행동 가운데 무엇을 보내는지 구체화한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "오해 조건",
        "knowledge": "큰 반응을 받지 못했다고 마음의 크기를 재지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "잘 전달되는 상황",
        "knowledge": "잘 전달되는 방식은 상대에게 물어야 확인할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "22219e4de369178b0387"
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
    "positive": "관심이 묻히지 않게 알리는 가능성",
    "risk": "반응의 크기를 애정의 성적표로 쓰기",
    "factBomb": "내 표현량이 상대가 답해야 할 분량은 아니다.",
    "twist": "표현을 줄이기보다 전달 통로를 바꿀 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 긴 메시지 대신 짧은 통화가 편한지 묻는다."
      }
    ],
    "repairAction": "반가웠던 표현과 부담스러운 표현을 각각 확인한다.",
    "counterexample": "상대가 긴 표현보다 짧은 행동을 편하게 받는다면 표현량을 늘리는 방법은 반대 효과일 수 있다.",
    "applicationLimit": "실제 상대의 성격이나 연락 선호를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "CH02의 표현 매력과 달리 발신과 수신의 번역 문제",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 성격이나 연락 선호를 추정하지 않는다.",
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
    "id": "lkr:material:CH01.P3:practical-not-substitute",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "마음을 표현하고 받아들이는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "행동으로 마음을 전할 때 실제 도움과 감정 대화가 서로 대체되지 않는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "애정 행동",
        "knowledge": "love_through_action은 본인에게 자연스러운 표현 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "근거",
        "knowledge": "약속 이행과 필요한 준비가 관심을 보이는 통로일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "오해 조건",
        "knowledge": "문제를 처리해도 서운했던 뜻이 남을 가능성을 열어둔다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "잘 전달되는 상황",
        "knowledge": "도움을 주기 전에 듣기와 해결 중 원하는 것을 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8e927df60c470175a28b"
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
    "positive": "말뿐인 약속을 실제 행동으로 이어갈 가능성",
    "risk": "해결한 양을 근거로 감정 설명을 중단시키기",
    "factBomb": "일을 끝냈다고 마음을 들을 순서까지 끝난 것은 아니다.",
    "twist": "도와주기 전에 잠깐 듣는 것이 도움의 정확도를 높일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 망가진 물건을 고치기 전 어떤 점이 속상했는지 듣는다."
      }
    ],
    "repairAction": "처리할 과제와 듣고 싶은 이야기를 따로 확인한다.",
    "counterexample": "상대가 실제 해결을 요청했다면 경청만 오래 하는 것이 원하는 지원이 아닐 수 있다.",
    "applicationLimit": "연인이 이미 고마워하거나 불만을 가졌다고 만들지 않는다.",
    "distinctFromOtherParagraphs": "돌봄 행동의 유용성과 감정 수신은 독립 정보",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "연인이 이미 고마워하거나 불만을 가졌다고 만들지 않는다.",
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
    "id": "lkr:material:CH01.P3:quiet-request",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "마음을 표현하고 받아들이는 방식",
    "researchKind": "mbti_application",
    "coreMeaning": "마음을 직접 말하기 어려울 때 호감과 불편을 작은 요청으로 나누는 방법을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "애정 행동",
        "knowledge": "hard_to_state_opinion는 본인의 전달 어려움 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "근거",
        "knowledge": "모든 감정을 설명하기보다 지금 원하는 행동을 한 가지 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "오해 조건",
        "knowledge": "거절할 수 있어야 동의한 표현도 편해질 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "잘 전달되는 상황",
        "knowledge": "조용함을 상대가 알아서 읽을 암호로 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "4d4a080342aae90654f6"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
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
    "positive": "내 속도를 지키며 필요한 뜻을 꺼낼 가능성",
    "risk": "괜찮다는 말 뒤에 상대의 눈치만 기다리기",
    "factBomb": "힌트를 많이 주었다는 사실이 합의했다는 뜻은 아니다.",
    "twist": "작은 거절이 관계를 포기하는 말이 아닐 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 늦은 약속이 어렵다고 말하고 가능한 시간을 제안한다."
      }
    ],
    "repairAction": "감정 전체 대신 한 가지 요청과 가능한 대안을 말한다.",
    "counterexample": "이미 짧고 분명하게 요청하고 있는 사람에게 더 직접적으로 말하라는 교정을 반복할 필요는 없다.",
    "applicationLimit": "침묵의 이유를 연애 경험이나 상처로 꾸며내지 않는다.",
    "distinctFromOtherParagraphs": "분명한 표현 trait의 반대가 아니라 요청의 난도 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "침묵의 이유를 연애 경험이나 상처로 꾸며내지 않는다.",
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
    "id": "lkr:material:CH01.P3:memory-updated",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "readerQuestion": "마음을 표현하고 받아들이는 방식",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "기억한 취향을 현재의 필요와 다시 맞추는 애정 표현을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "애정 행동",
        "knowledge": "C081은 작은 차이의 확인과 돌봄의 필요를 함께 검토한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "근거",
        "knowledge": "과거 발언이 맞았더라도 지금 원하는지는 다시 물어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "오해 조건",
        "knowledge": "선호의 변화를 허용하면 기억이 통제가 아닌 관심이 된다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "잘 전달되는 상황",
        "knowledge": "상대의 마음을 이미 읽었다는 결론을 피한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c2b4165c3415338f558a"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:standard-consistency",
        "axis": "PRECISION",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "condition": "같은 기준을 적용해도 되는 조건 확인",
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
    "positive": "이전에 들은 말을 존중하면서 현재 선택을 남기는 가능성",
    "risk": "과거 말을 인용해 지금의 다른 선택을 막기",
    "factBomb": "잘 기억하는 것과 계속 같은 답을 요구하는 것은 다르다.",
    "twist": "기억한 내용을 수정할 수 있어야 세심함이 살아난다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 좋아했던 선물을 이번에도 원하는지 묻는다."
      }
    ],
    "repairAction": "현재 선호를 묻는 질문을 준비하고 추측은 따로 둔다.",
    "counterexample": "과거 취향이 지금도 같다는 실제 답을 받았다면 매번 의심하듯 재확인할 필요는 없다.",
    "applicationLimit": "PRECISION과 CARE만으로 기억력이나 상대 취향을 확정하지 않는다.",
    "distinctFromOtherParagraphs": "일반적인 표현량보다 정보의 갱신이 핵심",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "PRECISION과 CARE만으로 기억력이나 상대 취향을 확정하지 않는다.",
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
    "id": "lkr:material:CH01.P4:trust-as-condition",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 사랑이란 무엇인가",
    "researchKind": "mbti_application",
    "coreMeaning": "신뢰를 설렘의 반대가 아니라 함께 예측할 수 있는 최소 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "중요 조건",
        "knowledge": "trust_first_love는 본인이 약속을 중요하게 보는 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "개인적 이유",
        "knowledge": "지킬 수 없는 약속을 미리 고치는 행동도 신뢰 질문에 포함한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "충족 여부의 차이",
        "knowledge": "반복을 통해 불확실한 추측의 부담을 줄일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "핵심 특징",
        "knowledge": "일정한 연락량이 충실함을 증명하지는 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "5190684455c102b45097"
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
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
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
    "positive": "확인 가능한 약속으로 편안함을 만들 가능성",
    "risk": "한 번의 변경을 인격 전체의 불신으로 확대",
    "factBomb": "약속을 중요하게 여길수록 바꿔 말할 통로도 필요하다.",
    "twist": "변경을 빨리 알리는 것이 무조건 지키는 척보다 정직할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바쁜 주의 연락 가능 시간을 미리 다시 정한다."
      }
    ],
    "repairAction": "지킬 최소 약속과 변경 통보 방식을 구분한다.",
    "counterexample": "연락 주기를 정하는 것 자체가 부담이라는 실제 답이라면 다른 신뢰 통로를 찾아야 한다.",
    "applicationLimit": "모든 ISTJ가 같은 연락 주기를 원한다고 정하지 않는다.",
    "distinctFromOtherParagraphs": "CH07 일정 운영 이전에 사랑에서 중요한 안전 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "모든 ISTJ가 같은 연락 주기를 원한다고 정하지 않는다.",
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
    "id": "lkr:material:CH01.P4:meaning-not-sameness",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 사랑이란 무엇인가",
    "researchKind": "mbti_application",
    "coreMeaning": "함께 가는 방향을 원할 때 모든 취향과 계획이 같아야 한다는 요구와 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "중요 조건",
        "knowledge": "same_direction_attraction은 본인의 관계 기준 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "개인적 이유",
        "knowledge": "지금 중요한 선택에서 어떤 목적을 공유할지 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "충족 여부의 차이",
        "knowledge": "차이를 숨기지 않고도 겹치는 방향을 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "핵심 특징",
        "knowledge": "공통 목표가 상대의 개별 선택을 없애서는 안 된다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "829aba7d8c1c08596ec1"
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
    "positive": "관계에서 중요하게 여기는 기준을 명료하게 할 가능성",
    "risk": "다른 관심사를 관계 의지 부족으로 읽기",
    "factBomb": "같은 방향을 바란다고 같은 사람이 될 필요는 없다.",
    "twist": "다른 방법이 공유 목적을 더 잘 지킬 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 앞으로 해보고 싶은 일 중 함께할 부분과 각자 할 부분을 고른다."
      }
    ],
    "repairAction": "공동 목표와 개인 취향을 두 목록으로 나눈다.",
    "counterexample": "공유 목표를 원하지 않고 각자 관심을 유지하고 싶은 현재 선택이라면 공동 목표를 만들 필요는 없다.",
    "applicationLimit": "상대의 미래 계획이나 결혼 의사를 생성하지 않는다.",
    "distinctFromOtherParagraphs": "끌리는 특징보다 본인이 관계에 부여하는 의미",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 미래 계획이나 결혼 의사를 생성하지 않는다.",
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
    "id": "lkr:material:CH01.P4:reciprocal-care",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 사랑이란 무엇인가",
    "researchKind": "mbti_application",
    "coreMeaning": "자기 요청을 말할 수 있어야 돌보는 성향이 일방적인 역할로 고정되지 않는다는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "중요 조건",
        "knowledge": "low_request_high_duty는 부탁과 책임의 불균형 후보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "개인적 이유",
        "knowledge": "내가 하고 싶은 도움과 나도 필요한 도움을 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "충족 여부의 차이",
        "knowledge": "고마움을 기다리는 대신 구체적인 부탁을 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "핵심 특징",
        "knowledge": "주는 양으로 상대가 갚을 몫을 자동 계산하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "78cdb2e803560073a1c5"
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
    "positive": "돌봄 속에 자신의 필요를 포함할 가능성",
    "risk": "말하지 않은 기대를 나중에 수고의 청구서로 꺼내기",
    "factBomb": "부탁하지 않은 일을 해줬다고 말하지 않은 부탁까지 합의된 것은 아니다.",
    "twist": "받고 싶은 것을 말하는 일이 돌봄을 포기하는 행동은 아니다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 준비를 맡은 뒤 다음 예약은 나눌 수 있는지 묻는다."
      }
    ],
    "repairAction": "내가 선택한 수고와 요청할 몫을 분리한다.",
    "counterexample": "서로 합의해 한쪽이 잠시 더 맡는 상황이라면 양의 차이를 바로 불공정으로 판단하지 않는다.",
    "applicationLimit": "본인이 이미 희생했거나 상대가 이기적이라고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "CH06 갈등 이전의 관계 성립 조건으로 상호성을 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "본인이 이미 희생했거나 상대가 이기적이라고 단정하지 않는다.",
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
    "id": "lkr:material:CH01.P4:safe-dissent",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "readerQuestion": "나에게 사랑이란 무엇인가",
    "researchKind": "mbti_application",
    "coreMeaning": "관계의 피드백을 원할 때 반대 답을 말해도 되는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "중요 조건",
        "knowledge": "feedback_expectation_love는 본인이 의견 교환을 중요하게 보는 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "개인적 이유",
        "knowledge": "의견을 묻는 일과 동의할 때까지 설득하는 일을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "충족 여부의 차이",
        "knowledge": "반대 의견이 들어와야 실제 두 사람의 기준을 알 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "핵심 특징",
        "knowledge": "대답을 주저할 자유까지 남기는 것이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "0893c89cb6a0f134a6d6"
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
        "id": "sar:facet:AUTONOMY:chosen-support",
        "axis": "AUTONOMY",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
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
    "positive": "의견 차이를 일찍 확인할 가능성",
    "risk": "질문을 승인받기 위한 절차로 만들기",
    "factBomb": "답을 물어놓고 다른 답을 틀렸다고 하면 질문은 명령이 된다.",
    "twist": "결론을 늦추는 시간이 더 분명한 선택을 만들 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 여행 제안에서 싫은 부분도 말해달라고 하고 바로 반박하지 않는다."
      }
    ],
    "repairAction": "반대 답 한 가지를 듣고 이해한 뜻만 먼저 확인한다.",
    "counterexample": "지금은 반대 이유를 설명할 준비가 없다고 답하면 즉시 이견을 끌어내는 것이 좋은 질문은 아니다.",
    "applicationLimit": "실제 상대의 소극성이나 의사결정 능력을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "솔직함의 강점과 의견 교환의 안전 조건을 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 소극성이나 의사결정 능력을 추정하지 않는다.",
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
