/** Static offline love, marriage and parenting research. No customer approval or runtime connection. */
import type { Material } from "./researchTypes";

export const CH07_MATERIALS: readonly Material[] = [
  {
    "id": "lkr:material:CH07.P1:home-self-choice",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "결혼생활에서의 나",
    "researchKind": "mbti_application",
    "coreMeaning": "공동생활을 선택한다면 개인 공간과 공동 책임을 별도로 정하는 성향 적용을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "상태별 생활 성향",
        "knowledge": "space_based_marriage는 본인의 생활 선호 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "함께 사는 선택은 모든 시간을 같이 쓰는 합의가 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "생활 행동",
        "knowledge": "개인 시간과 공동으로 필요한 정보를 구분할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "장점과 조건",
        "knowledge": "현재 배우자 존재는 관계 상태와 별도 입력 범위로 제한한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "30b373f5892dd5de9b47"
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
    "positive": "나를 잃지 않고 함께 지내는 조건",
    "risk": "쉬는 권리로 담당한 일을 생략",
    "factBomb": "개인 공간을 갖는 것과 공동 책임에서 사라지는 것은 다르다.",
    "twist": "함께하지 않을 시간을 정하면 같이할 시간을 더 편히 고를 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동생활을 고른 경우 혼자 쓸 공간과 공동 정리 몫을 나눈다."
      }
    ],
    "repairAction": "개인 시간·공동 담당·다시 이야기할 때를 각각 정한다.",
    "counterexample": "공동생활을 선택하지 않은 사람에게 개인 공간과 가사 분담을 현재 과제로 부과하지 않는다.",
    "applicationLimit": "비혼을 결함으로 보거나 현재 동거를 추정하지 않는다.",
    "distinctFromOtherParagraphs": "CH05 친밀 공간과 달리 생활의 책임 단위",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "비혼을 결함으로 보거나 현재 동거를 추정하지 않는다.",
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
    "id": "lkr:material:CH07.P1:home-planned-not-fixed",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "결혼생활에서의 나",
    "researchKind": "mbti_application",
    "coreMeaning": "미래를 계획하는 성향을 실제 생활 변화에 수정 가능한 운영으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "상태별 생활 성향",
        "knowledge": "future_planned_marriage는 본인의 준비 선호 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "큰 계획과 반복되는 생활의 작은 선택을 나눠 본다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "생활 행동",
        "knowledge": "계획을 바꿀 권한을 같이 두면 한 사람의 설계가 되지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "장점과 조건",
        "knowledge": "장기 계획의 존재는 안정된 결혼의 증거가 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "f3061cb47601ea867c4f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRATEGY:sequence-design",
        "axis": "STRATEGY",
        "definition": "의존 관계에 맞게 순서를 배치",
        "condition": "담당자의 재량·동의 확인",
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
    "positive": "생활의 우선순위를 명확히 할 가능성",
    "risk": "처음의 계획을 계속 지켜야 한다고 압박",
    "factBomb": "잘 세운 계획도 지금의 사정을 대신하지는 않는다.",
    "twist": "수정할 수 있어야 장기 계획이 실제 생활을 받친다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동생활을 선택했다면 다음 달 일정과 쉬는 기준을 다시 정한다."
      }
    ],
    "repairAction": "유지할 목적과 바꿀 방법을 분리한다.",
    "counterexample": "상황 변화가 없고 현재 합의가 편하다면 장기 계획을 무조건 바꿀 필요는 없다.",
    "applicationLimit": "배우자의 직업·능력·자산·미래 성과를 만들지 않는다.",
    "distinctFromOtherParagraphs": "생활 계획의 가변성과 동의",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "배우자의 직업·능력·자산·미래 성과를 만들지 않는다.",
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
    "id": "lkr:material:CH07.P1:home-warm-rhythm",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "결혼생활에서의 나",
    "researchKind": "mbti_application",
    "coreMeaning": "함께하는 일상을 돌보는 성향을 생활의 예측 가능한 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "상태별 생활 성향",
        "knowledge": "domestic_spouse_pattern는 본인 원천이며 성별 역할을 정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "식사나 연락의 리듬을 누가 정하고 바꿀지 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "생활 행동",
        "knowledge": "익숙함이 모두에게 맞을 때 편안함이 될 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "장점과 조건",
        "knowledge": "본인 성향으로 실제 배우자의 만족을 말하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "657f0a60c702c59fd825"
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
        "id": "sar:facet:STABILITY:minimum-security",
        "axis": "STABILITY",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
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
    "positive": "작은 준비로 반복 부담을 줄일 가능성",
    "risk": "함께하는 일정이 모든 사람의 의무로 굳기",
    "factBomb": "돌보는 마음이 일정을 대신 결정할 권한은 아니다.",
    "twist": "각자 쉬는 날을 남겨도 생활의 따뜻함을 지킬 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 함께 살게 되면 식사 시간과 각자 먹을 날을 나눈다."
      }
    ],
    "repairAction": "반복할 최소 리듬과 선택 가능한 부분을 정한다.",
    "counterexample": "실제 생활 시간이 서로 다르면 함께 식사하는 반복보다 다른 돌봄 통로가 맞을 수 있다.",
    "applicationLimit": "기혼이 아닌 입력에 현재 배우자를 쓰지 않는다.",
    "distinctFromOtherParagraphs": "가정 역할의 성별 고정 없이 생활 리듬 연구",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "기혼이 아닌 입력에 현재 배우자를 쓰지 않는다.",
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
    "id": "lkr:material:CH07.P1:home-conditional-rule",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "readerQuestion": "결혼생활에서의 나",
    "researchKind": "natal_application",
    "coreMeaning": "정재의 관리 관계를 공동생활의 책임과 실제 합의 질문으로 제한해 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "상태별 생활 성향",
        "knowledge": "정재의 계산 정의와 현대 적용은 출처 수준이 다르다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "실제 근거",
        "knowledge": "원국의 위치·강약·감당할 책임을 기존 조건으로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "생활 행동",
        "knowledge": "생활비와 가사를 함께 논의하는 질문이 가능하다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "장점과 조건",
        "knowledge": "정재로 좋은 배우자나 결혼 안정성을 예언하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "e08794b5eb33c746679f",
      "e2ed5b09b1f8185708cd"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
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
    "positive": "돈 밖의 생활 책임까지 드러낼 가능성",
    "risk": "관리 성향으로 경제 결정권을 독점",
    "factBomb": "관리를 잘한다는 믿음이 둘의 동의를 대신할 수는 없다.",
    "twist": "장부 밖의 노동을 같이 보면 책임의 범위가 달라질 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동생활을 고른 경우 지출과 준비 노동을 함께 적는다."
      }
    ],
    "repairAction": "계산 사실과 생활 합의의 근거를 분리한다.",
    "counterexample": "정재를 감당하지 못하는 기존 원국 조건이라면 관리의 긍정 의미만 선택하지 않는다.",
    "applicationLimit": "원국 성별 전통 비유를 실제 배우자의 성격으로 쓰지 않는다.",
    "distinctFromOtherParagraphs": "명리 자원 의미와 공동생활의 사실 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "실제 본인 원국의 Evidence·위치·성립/반대 조건과 원래 전거/검토 상태 확인. 관계·기간 사실을 원국 애정 성향으로 옮기지 않음.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "원국 성별 전통 비유를 실제 배우자의 성격으로 쓰지 않는다.",
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
    "id": "lkr:material:CH07.P2:home-care-rotation",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "함께 사는 사람에게 줄 수 있는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "돌봄을 잘하는 사람이 모두 맡지 않도록 역할을 다시 나누는 생활 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "생활 강점",
        "knowledge": "shared_care_responsibility는 inferred 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "준비·실행·확인의 담당을 실제로 드러낸다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "책임 돌봄 운영",
        "knowledge": "고마움과 다음 담당을 함께 논의할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "안정적 생활",
        "knowledge": "현재 가족이나 돌봄 대상의 존재는 추정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "4b07fe3f9004cfc8a777"
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
    "positive": "한 사람에게 몰리지 않는 책임",
    "risk": "잘할수록 더 맡는 구조를 당연하게 보기",
    "factBomb": "먼저 알아챘다고 먼저 맡아야 하는 것은 아니다.",
    "twist": "모르는 사람도 배울 수 있게 역할을 나누는 것이 돌봄이다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동 일정의 연락과 준비와 마무리를 나눠 본다."
      }
    ],
    "repairAction": "과제별 담당과 바꿀 조건을 기록한다.",
    "counterexample": "현재 역할을 나누고 싶지 않다는 상호 합의가 있다면 무조건 교대하는 것이 공정함은 아니다.",
    "applicationLimit": "실제 배우자나 가족의 무능함을 단정하지 않는다.",
    "distinctFromOtherParagraphs": "돌봄의 순환과 학습 가능한 생활 역할",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 배우자나 가족의 무능함을 단정하지 않는다.",
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
    "id": "lkr:material:CH07.P2:home-minimum-system",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "함께 사는 사람에게 줄 수 있는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "반복되는 일을 간단한 체계로 만들 때 양쪽이 사용할 수 있는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "생활 강점",
        "knowledge": "automated_household_system는 inferred 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "기억해야 할 일과 직접 해야 할 일을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "책임 돌봄 운영",
        "knowledge": "공유 목록이 통제표가 아니라 필요한 정보가 되게 한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "안정적 생활",
        "knowledge": "체계 도입을 상대가 이미 원한다고 가정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d8ee6a6775c1d5a71420"
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
    "positive": "잊을 부담을 낮출 가능성",
    "risk": "정리 체계를 만든 사람이 감독권도 갖기",
    "factBomb": "목록을 만들었다는 사실이 모두의 합의를 뜻하지는 않는다.",
    "twist": "덜 상세한 체계가 실제로 더 오래 쓰일 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 함께 살게 되면 반복 지출의 확인 날짜만 공유한다."
      }
    ],
    "repairAction": "최소 항목과 수정 권한을 함께 정한다.",
    "counterexample": "공유 목록이 실제로 사용되지 않거나 감시로 쓰인다면 항목을 늘리는 것이 해결은 아니다.",
    "applicationLimit": "자동화가 갈등을 해결하거나 노동을 없앤다고 보장하지 않는다.",
    "distinctFromOtherParagraphs": "생활 체계의 사용 조건과 권한 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "자동화가 갈등을 해결하거나 노동을 없앤다고 보장하지 않는다.",
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
    "id": "lkr:material:CH07.P2:home-change-buffer",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "함께 사는 사람에게 줄 수 있는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "예상 못 한 일정 변화에도 생활을 유지할 여유를 두는 강점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "생활 강점",
        "knowledge": "change_buffer_marriage는 inferred 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "비상 담당과 쉬어야 하는 날의 대안을 실제 여력 안에서 정한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "책임 돌봄 운영",
        "knowledge": "계획대로 못 한 일을 인격 평가로 바꾸지 않을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "안정적 생활",
        "knowledge": "실제 비상 상황이나 재산은 입력 없이 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "ede67b716c40fbe4b6c4"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:protective-change",
        "axis": "STABILITY",
        "definition": "지속을 위해 필요한 변경을 수용",
        "condition": "유지할 가치와 바꿀 방법을 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "axis": "RESOURCE_SENSE",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
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
    "positive": "반복 생활의 작은 여유",
    "risk": "예외가 생긴 사람에게 늘 설명과 보상을 요구",
    "factBomb": "빈틈을 남기는 것은 준비가 부족하다는 뜻이 아니다.",
    "twist": "조금 덜 계획하면 바뀐 날도 함께 조정할 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 한 사람이 바쁠 때 최소한만 유지할 집안일을 고른다."
      }
    ],
    "repairAction": "평소 기준과 예외 기준을 나눈다.",
    "counterexample": "당장 유지해야 할 안전과 필수 비용이 있다면 예외 여유를 이유로 그 기준을 없애지 않는다.",
    "applicationLimit": "소득·건강·직업 변화의 실제 사건을 예측하지 않는다.",
    "distinctFromOtherParagraphs": "안정감의 경직성과 다른 예외 여유",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "소득·건강·직업 변화의 실제 사건을 예측하지 않는다.",
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
    "id": "lkr:material:CH07.P2:home-kin-information",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "readerQuestion": "함께 사는 사람에게 줄 수 있는 힘",
    "researchKind": "mbti_application",
    "coreMeaning": "가족과의 관계를 잘 잇는 힘에 둘이 먼저 정할 정보와 결정을 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "생활 강점",
        "knowledge": "family_social_boundary는 inferred 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "가족 일정과 지원 요청이 있다면 공유할 범위를 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "책임 돌봄 운영",
        "knowledge": "친절을 유지하면서도 일방적인 약속을 줄일 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "안정적 생활",
        "knowledge": "양가 가족의 존재·갈등·요구는 실제 입력 전에는 모른다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "24baf614208a551324d1"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "positive": "외부 관계와 공동생활을 조율할 가능성",
    "risk": "좋은 분위기를 위해 둘의 돈이나 시간을 미리 약속",
    "factBomb": "가족에게 잘하려는 마음도 함께 쓰는 자원을 혼자 정할 권한은 아니다.",
    "twist": "먼저 상의하는 절차가 관계를 끊지 않고 경계를 세울 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 가족 모임 제안이 있다면 가능한 일정부터 함께 확인한다."
      }
    ],
    "repairAction": "외부에 답하기 전 공유할 정보를 정한다.",
    "counterexample": "가족 지원 요청 자체가 없다면 양가 갈등이나 경제 경계를 현재 문제로 만들지 않는다.",
    "applicationLimit": "친족 관계나 성별에 역할을 자동 배정하지 않는다.",
    "distinctFromOtherParagraphs": "친절의 강점을 공동 결정의 절차로 연결",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "친족 관계나 성별에 역할을 자동 배정하지 않는다.",
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
    "id": "lkr:material:CH07.P3:home-money-power",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "결혼생활에서의 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "생활비 기여와 의사결정 권한을 동일시하는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "생활 위험",
        "knowledge": "joint_finance_authority는 inferred 원천이다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "성향적 이유",
        "knowledge": "실제 기여와 필요한 정보 접근을 따로 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "역할 돈 습관",
        "knowledge": "돈 밖의 가사와 돌봄 노동도 합의 질문에 포함한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "조정 방법",
        "knowledge": "기여액을 실제로 추정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "8670a7cd306dd817250d"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
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
    "positive": "경제 대화를 선택권의 문제와 분리",
    "risk": "더 내는 사람이 반대 답을 무효화",
    "factBomb": "공동생활의 동의는 소득 비율로 자동 계산되지 않는다.",
    "twist": "돈의 부담이 달라도 의견을 들을 절차는 같이 둘 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동 지출을 정할 때 금액과 동의 기준을 따로 논의한다."
      }
    ],
    "repairAction": "부담·권한·공개 범위를 분리한다.",
    "counterexample": "실제로 동등한 정보와 의사결정 절차가 있다면 기여액의 차이만으로 통제 관계라고 판단하지 않는다.",
    "applicationLimit": "재정 법률 조언이나 실제 자산의 답을 만들지 않는다.",
    "distinctFromOtherParagraphs": "돈의 역할과 관계 권한의 경계",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "재정 법률 조언이나 실제 자산의 답을 만들지 않는다.",
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
    "id": "lkr:material:CH07.P3:home-correction-fatigue",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "결혼생활에서의 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "효율적으로 생활을 고치려는 마음이 모든 방식의 평가로 번지는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "생활 위험",
        "knowledge": "role_agreement_marriage는 inferred 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "성향적 이유",
        "knowledge": "맡긴 과제의 결과 기준과 실행 방법의 재량을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "역할 돈 습관",
        "knowledge": "작은 취향 차이를 오류로 고치지 않을 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "조정 방법",
        "knowledge": "실제 상대가 비효율적이라고 추정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "048c520649d4c0b898cb"
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
        "id": "sar:facet:AUTONOMY:method-discretion",
        "axis": "AUTONOMY",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
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
    "positive": "필수 기준을 명료하게 할 가능성",
    "risk": "맡겼지만 매 단계 다시 검사",
    "factBomb": "역할을 나눴어도 방법을 모두 통제하면 책임은 나뉘지 않는다.",
    "twist": "같은 결과에 다른 방법을 허용할 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 정리 담당을 나누고 꼭 필요한 기준만 합의한다."
      }
    ],
    "repairAction": "안전·공동 결과·개인 취향을 세 범위로 나눈다.",
    "counterexample": "담당한 결과가 합의된 안전 기준에 못 미쳤다면 방법의 재량만으로 문제를 덮지 않는다.",
    "applicationLimit": "통제를 효율 성향의 장점으로 정상화하지 않는다.",
    "distinctFromOtherParagraphs": "역할 분담과 감독의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "통제를 효율 성향의 장점으로 정상화하지 않는다.",
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
    "id": "lkr:material:CH07.P3:home-novelty-cost",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "결혼생활에서의 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "새로운 생활 제안 뒤에 반복될 관리 비용을 놓치는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "생활 위험",
        "knowledge": "domestic_follow_through_gap는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "성향적 이유",
        "knowledge": "시작의 재미와 이후 준비·정리의 담당을 나눈다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "역할 돈 습관",
        "knowledge": "함께 원한 변화인지 확인해야 공동 과제가 된다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "조정 방법",
        "knowledge": "실제 가사 부족이나 과거 실수를 만들지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "c72ad7e4dbeab2b8b75f"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "axis": "ADAPTABILITY",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
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
    "positive": "새 시도의 지속 조건을 볼 가능성",
    "risk": "아이디어를 낸 뒤 남은 관리를 넘기기",
    "factBomb": "새 제안이 즐거워도 뒷정리는 저절로 끝나지 않는다.",
    "twist": "작게 시작하면 새로움을 더 오래 즐길 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동 취미 물건을 들이기 전 정리와 비용을 함께 논의한다."
      }
    ],
    "repairAction": "시작·유지·중단 시 담당을 각각 정한다.",
    "counterexample": "유지 비용과 담당이 이미 합의됐다면 새 생활 제안 자체를 책임 부족으로 보지 않는다.",
    "applicationLimit": "성별이나 MBTI로 가사 능력을 고정하지 않는다.",
    "distinctFromOtherParagraphs": "변화의 즐거움과 반복 관리의 정보",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "성별이나 MBTI로 가사 능력을 고정하지 않는다.",
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
    "id": "lkr:material:CH07.P3:home-peace-not-consent",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "readerQuestion": "결혼생활에서의 팩폭",
    "researchKind": "mbti_application",
    "coreMeaning": "분위기를 지키려고 작은 불편을 넘기면 합의한 생활처럼 보이는 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "생활 위험",
        "knowledge": "silent_conflict_marriage는 본인 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "성향적 이유",
        "knowledge": "불편이 없어서 조용한지 아직 말하지 않았는지 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "역할 돈 습관",
        "knowledge": "공동공간과 소리 같은 작은 조건을 이야기할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "조정 방법",
        "knowledge": "침묵의 이유를 실제로 확정하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "cd4db85b9a6b894d203d"
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
    "positive": "작은 불편을 초기에 말할 가능성",
    "risk": "불편이 커진 뒤 모든 생활을 한꺼번에 부정",
    "factBomb": "조용한 집이 항상 합의된 집은 아니다.",
    "twist": "작은 수정 요청이 평화를 깨는 말이 아닐 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 쉬는 시간의 소음이 불편하다면 가능한 대안을 묻는다."
      }
    ],
    "repairAction": "반복되는 불편 하나만 먼저 꺼낸다.",
    "counterexample": "작은 불편이 실제로 없다는 답이라면 조용한 상태를 숨은 갈등의 증거로 해석하지 않는다.",
    "applicationLimit": "실제 동거·이혼·갈등 이력을 생성하지 않는다.",
    "distinctFromOtherParagraphs": "좋은 분위기와 실제 동의의 차이",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "실제 동거·이혼·갈등 이력을 생성하지 않는다.",
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
    "id": "lkr:material:CH07.P4:home-revision-meeting",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "오래 함께할 수 있는 생활의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "오래 함께할 조건을 처음의 분담을 주기적으로 바꿀 수 있는 절차로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "생활 기준",
        "knowledge": "역할 합의의 inferred 자료와 실제 공동생활이 전제다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "누가 무엇을 맡는지와 지금도 가능한지를 별도로 묻는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "함께 조정할 부분",
        "knowledge": "상황이 바뀌면 담당도 바꿀 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "편안한 생활",
        "knowledge": "회의처럼 매번 평가받는 형식은 강요하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "048c520649d4c0b898cb"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
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
    "positive": "묵은 기대를 현재 합의로 바꿀 가능성",
    "risk": "처음 동의가 영구 계약이라고 보기",
    "factBomb": "한 번 맡았다는 사실은 계속 가능하다는 답이 아니다.",
    "twist": "분담을 줄이는 것이 공동생활을 지킬 방법이 될 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 다음 달 일정 변화에 맞춰 반복 과제를 다시 나눈다."
      }
    ],
    "repairAction": "유지할 것·바꿀 것·보류할 것을 고른다.",
    "counterexample": "역할 재논의가 계속 평가받는 부담이라면 회의 형식 대신 짧은 확인 방식이 더 맞을 수 있다.",
    "applicationLimit": "미래 사건이나 가족의 여력을 추정하지 않는다.",
    "distinctFromOtherParagraphs": "장기 조건의 수정 가능성",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "미래 사건이나 가족의 여력을 추정하지 않는다.",
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
    "id": "lkr:material:CH07.P4:home-spending-threshold",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "오래 함께할 수 있는 생활의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "큰 지출과 외부 지원에서 먼저 상의할 범위를 정하는 생활 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "생활 기준",
        "knowledge": "family_money_boundary는 inferred 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "개인 지출·공동 지출·외부 지원을 각각 구분한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "함께 조정할 부분",
        "knowledge": "정해진 상한도 여력이 바뀌면 다시 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "편안한 생활",
        "knowledge": "실제 금액과 재산은 개인 입력이 있어야 한다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4a61263d8611202dcef"
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
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
    "positive": "말하기 어려운 돈의 기대를 드러낼 가능성",
    "risk": "상한을 세웠다는 이유로 세부 사생활까지 감시",
    "factBomb": "공동 지출을 묻는 일과 모든 소비를 검사하는 일은 다르다.",
    "twist": "정보를 덜 공유해도 필요한 동의는 명확히 할 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 공동생활 선택 시 먼저 상의할 지출 종류를 정한다."
      }
    ],
    "repairAction": "금액 대신 우선 지출 종류와 동의 절차를 묻는다.",
    "counterexample": "개인 자원의 작은 지출까지 승인받게 되는 방식은 공동 지출의 합의와 구분해야 한다.",
    "applicationLimit": "법적 재산 권리나 실제 부양 의무를 임의로 규정하지 않는다.",
    "distinctFromOtherParagraphs": "경제 경계와 사적 선택권의 구분",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "법적 재산 권리나 실제 부양 의무를 임의로 규정하지 않는다.",
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
    "id": "lkr:material:CH07.P4:home-rest-fairness",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "오래 함께할 수 있는 생활의 조건",
    "researchKind": "mbti_application",
    "coreMeaning": "각자의 쉬는 필요와 돌봄·가사의 공백을 함께 조율하는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "생활 기준",
        "knowledge": "marriage_with_space는 본인 휴식 자료다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "쉬는 시간을 빼앗기지 않되 남은 일을 누가 할지 확인한다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "함께 조정할 부분",
        "knowledge": "휴식의 형태가 달라도 필요한 책임은 별도로 나눌 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "편안한 생활",
        "knowledge": "본인이나 상대의 체력·건강을 예측하지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "060272ee97676577841a"
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
    "positive": "휴식과 책임이 충돌할 때 선택지를 만들 가능성",
    "risk": "혼자 쉬는 권리만 말하고 상대의 공백은 보지 않기",
    "factBomb": "쉬는 시간이 내게 필요하듯 다른 사람에게도 필요할 수 있다.",
    "twist": "일을 줄이는 선택이 분담 싸움보다 먼저일 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 피곤한 날에는 꼭 할 일만 남기고 나머지는 미룬다."
      }
    ],
    "repairAction": "최소 생활 과제와 각자의 회복 시간을 함께 정한다.",
    "counterexample": "서로의 회복 필요가 다르면 똑같은 시간의 휴식이 반드시 같은 도움은 아닐 수 있다.",
    "applicationLimit": "돌봄 대상이나 질병을 실제 사실로 생성하지 않는다.",
    "distinctFromOtherParagraphs": "공동생활의 회복 자원을 분배하는 조건",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "실제 본인 유형의 동일 분야·trait·pointer/hash 확인. direct/inferred는 실증 수준이 아니며 타인·아이의 성격을 만들지 않음.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "돌봄 대상이나 질병을 실제 사실로 생성하지 않는다.",
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
    "id": "lkr:material:CH07.P4:home-optout-legitimate",
    "productKey": "love_marriage_child",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "readerQuestion": "오래 함께할 수 있는 생활의 조건",
    "researchKind": "input_context",
    "coreMeaning": "결혼과 공동생활을 선택하지 않는 답도 생활의 기준으로 인정하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "생활 기준",
        "knowledge": "관계 상태와 결혼 의사는 다른 정보다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "필요한 이유",
        "knowledge": "미혼·연애·기혼의 삶을 한 줄의 진행 단계로 놓지 않는다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "함께 조정할 부분",
        "knowledge": "선택한다면 필요한 조건을 알아보는 질문으로 제한할 수 있다.",
        "roleKind": "research_not_final_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "편안한 생활",
        "knowledge": "결혼하지 않음이 미성숙이나 실패는 아니다.",
        "roleKind": "research_not_final_customer_sentence"
      }
    },
    "sourceKeys": [
      "d4e7f0e0e2cbaab22aa7",
      "3571efa2a1cfc06f784f"
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
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
    "positive": "삶의 선택을 스스로 정할 여지",
    "risk": "좋은 성향은 결국 결혼해야 완성된다고 암시",
    "factBomb": "관계를 잘 맺는 힘이 반드시 같은 형태의 삶을 요구하지는 않는다.",
    "twist": "공동생활을 선택하지 않아도 친밀한 관계를 가질 수 있다.",
    "scenes": [
      {
        "kind": "MARRIAGE_SCENE",
        "status": "fictional_not_customer_history",
        "text": "가상으로 미래 생활을 고른다면 필요한 공간과 책임을 적는다."
      }
    ],
    "repairAction": "현재 사실과 미래 선택의 조건을 분리한다.",
    "counterexample": "이미 공동생활을 선택한 사람에게 비선택만 강조하며 필요한 생활 질문을 피하지 않는다.",
    "applicationLimit": "결혼·출산을 의무나 성공 기준으로 만들지 않는다.",
    "distinctFromOtherParagraphs": "생활 조건 연구의 적용 범위를 명확히 함",
    "review": "conditional_editorial_research",
    "holdReason": null,
    "prerequisites": {
      "sourceOwner": "same_person_only",
      "saju": "이 자료의 명리 사실을 새로 만들지 않음. 개인화할 다른 근거는 별도 확인.",
      "mbti": "미입력 유형을 추정하지 않음. 회수는 실제 선행 원천 확인.",
      "fusion": "이 후보가 새 Fusion 근거나 계산을 만들지 않음.",
      "input": "결혼·출산을 의무나 성공 기준으로 만들지 않는다.",
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
