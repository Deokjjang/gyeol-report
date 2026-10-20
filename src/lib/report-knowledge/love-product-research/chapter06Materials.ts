/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH06_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH06.P1:solution-over-listen",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "연애에서 가장 아픈 단점",
    "researchKind": "mbti_application",
    "coreMeaning": "돕고 싶은 마음이 상대가 말할 시간을 줄이는 행동으로 바뀌는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "실제 약점",
        "knowledge": "유용한 지원을 선호하는 실제 본인 자료가 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "구체적 행동",
        "knowledge": "고민을 끝까지 듣기 전에 방법을 연속 제시할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "의도와 행동 차이",
        "knowledge": "본인은 돕는 중이어도 상대는 평가받는 느낌일 수 있으며 확인이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "인상적인 팩폭",
        "knowledge": "해결의 속도와 수신의 편안함을 나눠 보아야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d35d738ef528ee981728"
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
    "positive": "문제 해결에 참여할 자원",
    "risk": "듣기 요청이 있었는데도 방법만 늘리기",
    "factBomb": "해답이 많아도 들은 말이 적으면 도움은 엇갈릴 수 있다.",
    "twist": "첫 질문을 바꾸면 같은 해결 능력을 다르게 쓸 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 고민을 들었을 때 지금 제안이 필요한지 먼저 묻는다."
      }
    ],
    "repairAction": "들은 핵심을 되말하고 도움 형태를 확인한다.",
    "counterexample": "상대가 구체적인 해결책을 요청했다면 방법 제시 자체를 듣기 부족으로 보지 않는다.",
    "applicationLimit": "상대가 실제로 서운했거나 본인이 반복했다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "팩폭 대상은 능력이 아니라 도움의 순서",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대가 실제로 서운했거나 본인이 반복했다고 단정하지 않는다.",
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
    "id": "lkr:material:CH06.P1:silent-agreement-cost",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "연애에서 가장 아픈 단점",
    "researchKind": "mbti_application",
    "coreMeaning": "분위기를 해치기 싫어 말하지 않은 불편을 나중에 합의 위반처럼 다루는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "실제 약점",
        "knowledge": "silent_when_angry는 본인 표현 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "구체적 행동",
        "knowledge": "괜찮다고 한 뒤 거리만 늘리면 이유가 전달되지 않을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "의도와 행동 차이",
        "knowledge": "상대가 알았어야 한다는 기대는 실제 정보와 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "인상적인 팩폭",
        "knowledge": "작은 불편을 말할 통로를 먼저 확보하는 것이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "fbf6075c276ff0b58116"
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
    "positive": "과열 전에 말을 고를 시간",
    "risk": "침묵으로 상대가 정답을 맞히게 하기",
    "factBomb": "말하지 않은 불편까지 이미 합의했다고 셀 수는 없다.",
    "twist": "아직 정리 중이라는 짧은 안내도 정보가 된다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 불편한 제안을 받은 뒤 지금은 답하기 어렵다고 말한다."
      }
    ],
    "repairAction": "보류 이유의 범위와 다시 이야기할 때를 알린다.",
    "counterexample": "이미 불편을 명확히 말했는데 받아들여지지 않았다면 더 잘 표현하지 못한 본인 탓으로 돌리지 않는다.",
    "applicationLimit": "침묵을 벌이나 조종이라고 진단하지 않는다.",
    "distinctFromOtherParagraphs": "무언의 불편과 명시적 합의의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "침묵을 벌이나 조종이라고 진단하지 않는다.",
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
    "id": "lkr:material:CH06.P1:care-ledger",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "연애에서 가장 아픈 단점",
    "researchKind": "mbti_application",
    "coreMeaning": "책임을 먼저 맡는 강점이 말하지 않은 기대를 쌓는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "실제 약점",
        "knowledge": "낮은 요청과 높은 책임의 실제 본인 자료가 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "구체적 행동",
        "knowledge": "수고를 늘리면서 상대가 알아주길 기다릴 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "의도와 행동 차이",
        "knowledge": "상대는 허용받았다고 생각할 가능성이 있지만 확인 전 사실이 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "인상적인 팩폭",
        "knowledge": "내 선택과 공동 요청을 분리해야 수고의 이유가 보인다.",
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
    "positive": "책임과 요청을 명확히 할 가능성",
    "risk": "선택한 수고를 상대의 빚으로 바꾸기",
    "factBomb": "내가 다 했다는 말은 우리가 그렇게 정했다는 말과 다르다.",
    "twist": "수고를 줄여도 애정이 줄어드는 것은 아니다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음 약속 준비에서 맡을 몫을 처음부터 나눈다."
      }
    ],
    "repairAction": "한 가지 부탁을 명시하고 상대의 답을 기다린다.",
    "counterexample": "실제 합의한 분담을 이행하지 않은 문제라면 숨은 기대의 문제로 축소하지 않는다.",
    "applicationLimit": "과거 희생이나 실제 착취를 만들지 않는다.",
    "distinctFromOtherParagraphs": "과도한 돌봄의 은밀한 거래 위험",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "과거 희생이나 실제 착취를 만들지 않는다.",
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
    "id": "lkr:material:CH06.P1:precision-not-person",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "readerQuestion": "연애에서 가장 아픈 단점",
    "researchKind": "mbti_application",
    "coreMeaning": "틀린 부분을 고치는 힘이 사람 전체를 평가하는 말로 번지는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "실제 약점",
        "knowledge": "corrective_feedback는 본인의 피드백 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "구체적 행동",
        "knowledge": "사소한 오류를 연속 지적하면 행동보다 인격 평가처럼 들릴 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "의도와 행동 차이",
        "knowledge": "상대가 말을 줄였는지는 실제로 확인해야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "인상적인 팩폭",
        "knowledge": "바꿔야 할 행동과 단지 다른 취향을 나누어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "09f88fe7ec21e62f0659"
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
    "positive": "문제를 구체적으로 짚을 가능성",
    "risk": "정확함을 이유로 상대 설명의 순서를 없애기",
    "factBomb": "틀린 점을 모두 찾았어도 그 사람의 이유를 들은 것은 아니다.",
    "twist": "고치지 않아도 될 차이를 고르는 것이 정확함일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 약속 준비의 실수 한 가지와 이미 잘한 부분을 따로 말한다."
      }
    ],
    "repairAction": "필수 수정 하나만 고르고 영향을 먼저 확인한다.",
    "counterexample": "안전상 즉시 멈출 행동이라면 취향의 차이로 두거나 수정 자체를 피할 필요는 없다.",
    "applicationLimit": "실제 오류·지능·인격을 유형으로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "팩폭은 교정의 범위이며 상대 등급이 아님",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 오류·지능·인격을 유형으로 판단하지 않는다.",
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
    "id": "lkr:material:CH06.P2:natal-rule-not-control",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "왜 그런 문제가 생기는가",
    "researchKind": "natal_application",
    "coreMeaning": "정관의 규범 관계와 연애에서 서로 지킬 기준을 묻는 현대 적용을 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "명리 근거",
        "knowledge": "정관은 일간을 극하며 다른 음양인 기존 계산 관계다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "규범을 관계에 쓸지는 위치·강약·주변 관계의 기존 조건을 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI 조건",
        "knowledge": "함께 정한 약속과 내 규칙을 구분하는 연구로 제한한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "개인별 원인",
        "knowledge": "정관을 근거로 상대를 관리할 권한은 생기지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ce1defc1af72408fec4a",
      "cf50142dddc360c3324a"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
    "positive": "서로 예측할 최소 기준을 묻는 가능성",
    "risk": "내가 옳다고 믿는 규칙을 합의처럼 제시",
    "factBomb": "좋은 기준도 둘이 정하지 않았다면 아직 내 기준이다.",
    "twist": "규칙을 바꾸는 절차가 규칙의 신뢰를 지킬 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 연락 약속을 정할 때 어려운 날의 수정 방식도 묻는다."
      }
    ],
    "repairAction": "원국 사실과 생활 합의의 출처를 별도 표시한다.",
    "counterexample": "정관의 실제 성립·강약·주변 관계가 검토되지 않았다면 규범의 생활 장점으로 바로 연결하지 않는다.",
    "applicationLimit": "정관으로 결혼 안정·배우자 성격을 예언하지 않는다.",
    "distinctFromOtherParagraphs": "문제의 원인을 명리 하나에 귀속하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "실제 본인 원국의 Evidence·위치·성립/반대 조건과 원래 전거/검토 상태 확인. 관계·기간 사실을 원국 애정 성향으로 옮기지 않음.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "정관으로 결혼 안정·배우자 성격을 예언하지 않는다.",
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
    "id": "lkr:material:CH06.P2:mbti-speed-not-motive",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "왜 그런 문제가 생기는가",
    "researchKind": "mbti_application",
    "coreMeaning": "빠른 시작 자료로 상대가 같은 속도를 원한다고 추론하는 오류를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "명리 근거",
        "knowledge": "fast_start_romance는 본인에 대한 자료일 뿐이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "다음 계획을 빨리 떠올려도 상대의 선택 시간은 별도다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI 조건",
        "knowledge": "상대가 망설이는 이유는 묻기 전 알 수 없다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "개인별 원인",
        "knowledge": "유형은 실제 행동의 가능 조건이며 과거 사건의 원인이 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "3f713efd6c7ca838b2f8"
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
    "positive": "선제 제안을 조절할 가능성",
    "risk": "속도 차이를 의지 차이로 단정",
    "factBomb": "내 준비가 끝났다고 상대의 고민도 끝난 것은 아니다.",
    "twist": "계획을 제안만 한 상태로 남길 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 여러 일정을 만들기 전에 다음 만남 의사를 묻는다."
      }
    ],
    "repairAction": "제안과 확정의 단계를 나눈다.",
    "counterexample": "실제 상대가 같은 빠른 속도를 원한다고 답하면 속도 차이를 반드시 존재하는 갈등으로 만들지 않는다.",
    "applicationLimit": "실제 상대가 게으르거나 회피한다고 만들지 않는다.",
    "distinctFromOtherParagraphs": "성향 원천과 타인의 동기를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대가 게으르거나 회피한다고 만들지 않는다.",
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
    "id": "lkr:material:CH06.P2:fusion-meaning-care",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "왜 그런 문제가 생기는가",
    "researchKind": "registered_fusion_application",
    "coreMeaning": "관계를 중요하게 느끼는 마음과 필요한 돌봄이 다를 때의 긴장을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "명리 근거",
        "knowledge": "C079의 실제 양측 축과 context를 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "내게 의미 있는 행동이 지금 상대에게 필요한 행동인지 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI 조건",
        "knowledge": "관계의 의미를 지키려는 의도가 행동의 정확성을 보장하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "개인별 원인",
        "knowledge": "원천의 공존을 실제 갈등 원인으로 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "10f1b188eaa3ff171bee"
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
    "positive": "중요한 이유와 필요한 지원을 함께 설명",
    "risk": "큰 의미로 작은 거절을 덮기",
    "factBomb": "좋은 관계를 위한 말도 당사자의 답을 넘을 수는 없다.",
    "twist": "큰 의미를 잠시 내려두면 구체적인 필요를 들을 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 기념일 준비가 부담스럽다는 답에 의미와 규모를 따로 논의한다."
      }
    ],
    "repairAction": "보존하고 싶은 의미와 바꿀 행동을 나눈다.",
    "counterexample": "관계의 의미가 실제 양측 원천에 없거나 현재 도움의 동의가 없다면 이 결합 응용은 보류한다.",
    "applicationLimit": "한쪽 근거가 없으면 결합 해석을 보류한다.",
    "distinctFromOtherParagraphs": "뜻과 필요의 구분으로 일반 갈등 원인을 대신하지 않음",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "원래 등록 규칙의 양측 signed axis·owner·source assignment·domain/context·split·충족 조건 확인. 연구 ID는 runtime Fusion ID가 아님.",
      "input": "한쪽 근거가 없으면 결합 해석을 보류한다.",
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
    "id": "lkr:material:CH06.P2:attune-interpretation-loop",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "readerQuestion": "왜 그런 문제가 생기는가",
    "researchKind": "mbti_application",
    "coreMeaning": "반응을 잘 살피는 본인이 관찰보다 해석을 빨리 확정하는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "명리 근거",
        "knowledge": "감정 변화에 민감한 본인 자료를 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "작은 표정과 짧은 답을 하나의 결론으로 묶을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI 조건",
        "knowledge": "확신한 추측을 해명시키면 실제 답을 듣는 기회가 줄 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "개인별 원인",
        "knowledge": "알아챔과 정확한 이해는 따로 검증한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6e846060eca8b8a32399"
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
        "id": "sar:facet:PATTERN_SENSE:counterpattern",
        "axis": "PATTERN_SENSE",
        "definition": "맞지 않는 사례를 적극 확인",
        "condition": "자료의 출처·범위를 확인",
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
    "positive": "확인 질문으로 해석을 갱신할 가능성",
    "risk": "자신의 추측에 맞는 반응만 찾기",
    "factBomb": "표정을 읽는 감각이 상대의 답을 대신하지는 않는다.",
    "twist": "틀렸을 가능성을 묻는 것이 더 세심할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 조용한 답을 받았을 때 불편한지 다른 이유인지 묻는다."
      }
    ],
    "repairAction": "실제 말과 붙인 의미를 분리해 확인한다.",
    "counterexample": "상대의 명시적 설명이 이미 있다면 계속 다른 숨은 이유를 찾는 것은 확인 질문과 다르다.",
    "applicationLimit": "상대 감정·애착 유형·갈등 이력을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "감정 해석의 순환을 개인 원인 단정 없이 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대 감정·애착 유형·갈등 이력을 생성하지 않는다.",
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
    "id": "lkr:material:CH06.P3:pace-escalation",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "갈등이 커지는 순간",
    "researchKind": "mbti_application",
    "coreMeaning": "답을 빨리 듣고 싶은 행동이 상대의 설명을 줄이는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "문제 상황",
        "knowledge": "wait_and_listen_gap는 본인의 듣기 어려움 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "의도",
        "knowledge": "대답이 끝나기 전 결론을 요구하면 설명이 짧아질 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대의 해석",
        "knowledge": "짧아진 설명을 의지 부족으로 읽으면 더 재촉할 위험이 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "반복 조건",
        "knowledge": "실제 상대 반응은 가능한 해석으로만 둔다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "16577eb313d7ad41b01b"
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
    "positive": "속도의 엇갈림을 먼저 알아볼 가능성",
    "risk": "재촉과 침묵이 서로를 키우는 순환",
    "factBomb": "빨리 답하라는 요구가 답할 정보를 줄일 수 있다.",
    "twist": "결론을 잠깐 보류하면 필요한 설명이 늘어날 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 의견 차이에서 각자 설명할 차례를 먼저 정한다."
      }
    ],
    "repairAction": "말이 끝날 때까지 기다린 뒤 들은 뜻을 확인한다.",
    "counterexample": "시급한 안전 정보가 필요한 경우에는 결론을 늦추는 것만이 적절한 대화 방법은 아니다.",
    "applicationLimit": "실제 상대의 소극성이나 성격 결함을 만들지 않는다.",
    "distinctFromOtherParagraphs": "단순 속도 차이보다 악순환의 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 상대의 소극성이나 성격 결함을 만들지 않는다.",
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
    "id": "lkr:material:CH06.P3:avoidance-escalation",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "갈등이 커지는 순간",
    "researchKind": "mbti_application",
    "coreMeaning": "다투기 싫어 대화를 미루는 행동이 이유 없는 거리로 전달되는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "문제 상황",
        "knowledge": "conflict_avoidance_marriage는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "의도",
        "knowledge": "잠시 쉬는 것과 다시 이야기하지 않는 것을 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대의 해석",
        "knowledge": "상대가 거절로 받아들일 가능성은 확인할 질문이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "반복 조건",
        "knowledge": "위험한 관계에서 대화를 재개하라고 강요하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "be9cb942010f0a199f50"
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
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
    "positive": "과열을 낮출 시간을 고를 가능성",
    "risk": "보류가 계속 이어져 공동 문제를 남기기",
    "factBomb": "갈등이 없어진 것과 갈등 이야기가 없어졌다는 것은 다르다.",
    "twist": "돌아올 때를 정하면 침묵을 휴식으로 설명할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 말이 어려운 날 다음에 이야기할 항목과 시간을 남긴다."
      }
    ],
    "repairAction": "재대화에 동의하는지부터 묻는다.",
    "counterexample": "위협이나 강요가 있어 중단한 경우에는 관계 유지를 위한 재대화가 우선하지 않는다.",
    "applicationLimit": "갈등 회피를 실제 성격 진단이나 비난으로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "회피의 가능성과 안전한 중단 권리를 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "갈등 회피를 실제 성격 진단이나 비난으로 쓰지 않는다.",
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
    "id": "lkr:material:CH06.P3:unasked-help-escalation",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "갈등이 커지는 순간",
    "researchKind": "mbti_application",
    "coreMeaning": "도움이 거절됐을 때 감사 부족으로 읽으면 통제로 바뀔 수 있는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "문제 상황",
        "knowledge": "care_without_overreach는 inferred 자료임을 유지한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "의도",
        "knowledge": "상대가 직접 하겠다는 답을 존중하는 행동이 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대의 해석",
        "knowledge": "도움을 줄일수록 관심이 작아진다는 해석은 별도 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "반복 조건",
        "knowledge": "실제 상대가 부담을 느꼈다는 사실로 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "1f40e8e8931a7e80cec7"
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
    "positive": "원하는 방식의 지원을 고를 가능성",
    "risk": "거절 뒤에도 더 나은 도움이라며 개입하기",
    "factBomb": "더 잘해줄 수 있다는 말이 대신할 권한은 아니다.",
    "twist": "곁에서 기다리는 것이 필요한 도움일 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 준비를 대신하려다 직접 하겠다는 답을 듣고 멈춘다."
      }
    ],
    "repairAction": "도움 요청이 생기면 어떤 신호를 줄지 묻는다.",
    "counterexample": "상대가 다시 요청했고 여력이 확인되면 이전에 거절했다는 이유로 지원을 모두 닫을 필요는 없다.",
    "applicationLimit": "강제·위협을 선한 의도나 성향 차이로 정상화하지 않는다.",
    "distinctFromOtherParagraphs": "도움과 자율성의 경계를 갈등 조건으로 설명",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "강제·위협을 선한 의도나 성향 차이로 정상화하지 않는다.",
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
    "id": "lkr:material:CH06.P3:broken-promise-loop",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "readerQuestion": "갈등이 커지는 순간",
    "researchKind": "mbti_application",
    "coreMeaning": "잦은 변경을 가볍게 설명하면 상대가 더 강한 확약을 요구할 가능성을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "문제 상황",
        "knowledge": "domestic_follow_through_gap는 실제 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "의도",
        "knowledge": "변경의 비용을 누가 다시 감당하는지 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대의 해석",
        "knowledge": "더 강한 요구를 통제라고만 읽으면 실제 부담을 놓칠 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "반복 조건",
        "knowledge": "반복 이력은 입력 없이 실제 사실로 쓰지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c72ad7e4dbeab2b8b75f"
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
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "axis": "ADAPTABILITY",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
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
    "positive": "변경 비용을 함께 볼 가능성",
    "risk": "사과로만 마감하고 다음 행동은 그대로 두기",
    "factBomb": "미안하다는 말을 반복해도 다시 준비한 수고는 사라지지 않는다.",
    "twist": "지킬 약속을 줄이면 유연함을 더 정확히 쓸 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 바뀐 약속의 취소와 재예약을 누가 할지 함께 정한다."
      }
    ],
    "repairAction": "변경 통보와 남은 처리 몫을 같이 말한다.",
    "counterexample": "변경의 실제 비용이 없고 양쪽이 동의했다면 유연한 수정 자체를 문제로 보지 않는다.",
    "applicationLimit": "상대의 모든 요구를 통제나 합리성으로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "변경 자체보다 반복 비용과 반응의 순환",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "상대의 모든 요구를 통제나 합리성으로 단정하지 않는다.",
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
    "id": "lkr:material:CH06.P4:repair-heard-first",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "다툰 뒤 다시 가까워지는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "다툰 뒤 관계를 빨리 밝게 돌리기보다 남은 뜻을 먼저 듣는 회복을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "개인별 행동",
        "knowledge": "gentle_feedback는 본인의 전달 자원이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "대화 방식",
        "knowledge": "내가 이해한 영향이 맞는지 짧게 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "실제 시도",
        "knowledge": "좋은 의도를 설명하는 순서를 뒤로 둘 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "장점 회복",
        "knowledge": "상대가 계속 이야기할 의사는 별도다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f1a63049534f1dfb09b7"
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
    "positive": "방어적 설명을 줄이고 영향을 들을 가능성",
    "risk": "부드럽게 말했으니 문제가 끝났다고 보기",
    "factBomb": "말투가 좋아졌다고 듣지 않은 내용도 사라지는 것은 아니다.",
    "twist": "즉시 화해하지 않아도 이해를 수정할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 서로 준비됐을 때 들은 불편을 되말하고 맞는지 묻는다."
      }
    ],
    "repairAction": "영향 확인 뒤 바꿀 행동 하나를 제안한다.",
    "counterexample": "상대가 지금은 말하고 싶지 않다고 답하면 남은 영향을 듣겠다는 제안도 보류해야 한다.",
    "applicationLimit": "동의 없는 대화·용서·재결합을 강요하지 않는다.",
    "distinctFromOtherParagraphs": "온화한 전달보다 수신 확인이 회복의 시작",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "동의 없는 대화·용서·재결합을 강요하지 않는다.",
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
    "id": "lkr:material:CH06.P4:repair-action-not-apology",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "다툰 뒤 다시 가까워지는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "사과의 어려움을 인정하되 다음 행동의 변화가 없는 설명과 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "개인별 행동",
        "knowledge": "apology_difficulty는 본인의 전달 위험 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "대화 방식",
        "knowledge": "무엇을 바꿀지 행동 단위로 말할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "실제 시도",
        "knowledge": "상대가 받은 영향을 듣고 약속 가능한 크기를 고른다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "장점 회복",
        "knowledge": "행동 하나로 용서가 보장되는 것은 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "6a97973055bda9994161"
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
    "positive": "말과 이행을 연결할 가능성",
    "risk": "사정 설명으로 책임을 끝내기",
    "factBomb": "다음에는 잘하겠다는 말만으로 다음 행동은 정해지지 않는다.",
    "twist": "작은 약속을 지키는 것이 긴 해명보다 분명할 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 늦은 변경 안내를 다음부터 언제 알릴지 정한다."
      }
    ],
    "repairAction": "관찰 가능한 수정과 다시 확인할 때를 합의한다.",
    "counterexample": "행동 하나를 바꿔도 이미 생긴 피해나 비용이 있다면 별도 책임 조정이 필요할 수 있다.",
    "applicationLimit": "실제 잘못·사과·용서의 역사를 생성하지 않는다.",
    "distinctFromOtherParagraphs": "반성 표현과 검증 가능한 행동 변화의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 잘못·사과·용서의 역사를 생성하지 않는다.",
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
    "id": "lkr:material:CH06.P4:repair-space-with-return",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "다툰 뒤 다시 가까워지는 방법",
    "researchKind": "mbti_application",
    "coreMeaning": "생각 뒤에 감정을 알아차리는 경우 쉬는 시간과 재대화 통로를 함께 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "개인별 행동",
        "knowledge": "emotion_after_thought는 본인 처리 방식 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "대화 방식",
        "knowledge": "아직 말하기 어렵다는 정보와 돌아올 의사를 구분해 전한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "실제 시도",
        "knowledge": "쉬는 동안 상대도 기다릴지 고를 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "장점 회복",
        "knowledge": "상대에게 즉시 이해하거나 무기한 기다리라고 하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c0d70c49b5a928ce5a82"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "axis": "ENERGY_DIRECTION",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
    "positive": "자기 속도를 지키며 대화를 남길 가능성",
    "risk": "정리할 때까지 아무 정보도 주지 않기",
    "factBomb": "시간이 필요하다는 말에는 함께 정할 다음 정보도 필요하다.",
    "twist": "정리된 완벽한 말보다 현재 가능한 짧은 말이 도움이 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 지금은 멈추고 내일 대화 가능 여부를 다시 묻기로 한다."
      }
    ],
    "repairAction": "중단·재개 의사·시점을 나눠 합의한다.",
    "counterexample": "공동 결정의 마감이 있다면 개인 정리 시간을 이유로 필요한 최소 정보까지 미룰 수는 없다.",
    "applicationLimit": "위험한 관계에서 재개를 기본값으로 강요하지 않는다.",
    "distinctFromOtherParagraphs": "회복을 위한 휴식과 방치의 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "위험한 관계에서 재개를 기본값으로 강요하지 않는다.",
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
    "id": "lkr:material:CH06.P4:repair-boundary-safety",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "readerQuestion": "다툰 뒤 다시 가까워지는 방법",
    "researchKind": "legacy_application",
    "coreMeaning": "회복을 원해도 위협과 동의 없는 통제가 있다면 안전을 우선하는 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "개인별 행동",
        "knowledge": "이 자료는 특정 고객의 피해 사실을 뜻하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "대화 방식",
        "knowledge": "대화 중단과 도움 요청을 선택할 수 있는 조건을 남긴다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "실제 시도",
        "knowledge": "성향이 다르다는 이유로 위험을 참는 책임을 부과하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "장점 회복",
        "knowledge": "상담·신고·의료의 개별 절차는 검증된 지역 안내가 별도 필요하다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "86ce278eca349b89b4d4"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
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
    "positive": "화해만을 유일한 답으로 두지 않는 선택",
    "risk": "폭력이나 강요를 서로 노력하면 해결할 문제로 축소",
    "factBomb": "상처를 준 의도가 없었다는 말이 안전을 대신하지는 않는다.",
    "twist": "관계를 회복하지 않는 선택도 보호가 될 수 있다.",
    "scenes": [
      {
        "kind": "LOVE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 위협이 있는 대화라면 중단하고 신뢰할 수 있는 지원을 찾는다."
      }
    ],
    "repairAction": "회복 제안 전에 안전과 자유로운 동의를 확인한다.",
    "counterexample": "일반적인 의견 차이만 확인된 경우에는 이 자료로 실제 폭력이나 학대를 진단하지 않는다.",
    "applicationLimit": "특정 입력에서 학대가 발생했다고 진단하거나 상대를 가해자로 지정하지 않는다.",
    "distinctFromOtherParagraphs": "일반 갈등 조율과 안전 경계를 명확히 분리",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "특정 입력에서 학대가 발생했다고 진단하거나 상대를 가해자로 지정하지 않는다.",
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
