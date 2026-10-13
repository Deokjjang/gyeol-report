/** Static offline research only. No scoring, resolution or customer output. */
import type { LovePairMaterial } from "./researchTypes";
export const CH03_MATERIALS: readonly LovePairMaterial[] = [
  {
    "id": "clr:material:CH03.P1:b-reaction-as-participation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B의 관계 성향",
    "coreMeaning": "B가 반응을 주고받으며 참여를 확인하는 방식과 A의 몰입을 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "B가 반응을 주고받으며 참여를 확인하는 방식과 A의 몰입을 구분한다. B의 표현 수신은 B 원천에서 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "식신은 B의 실제 원국 조건을 따로 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "B의 ESFJ love 자료에서 애정의 반응을 주고받는 통로를 확인한다. A의 몰입을 B의 유형 설명으로 복사하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "관심 신호와 즉시 긴 대화의 요구를 나눌 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "99d6728eeef28d090237",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "2f90ecfe06a11bd76f98",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "90e77590d3ea07930ba1",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_definition_condition"
      }
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
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "axis": "RELATION_STYLE",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "서로 참여하고 있는지 물을 통로",
    "risk": "같은 크기의 반응을 애정 의무로 만들기",
    "factBomb": "함께 있다는 답이 늘 같은 방식으로 와야 하는 것은 아니다.",
    "twist": "작은 신호와 긴 이야기를 나눠 받을 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 기다리기 편한 짧은 안내를 A에게 설명한다."
    },
    "senderAdjustment": "필요한 정보와 희망하는 반응을 구분한다.",
    "recipientQuestion": "지금 줄 수 있는 신호와 나중에 할 이야기는 무엇인가?",
    "counterexample": "B가 반응을 원한다는 사실로 A가 무관심했다고 단정하지 않는다.",
    "distinctFromOtherParagraphs": "B의 수신 방식으로 A의 성향을 설명하지 않음",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P1:b-practical-quietness",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B의 관계 성향",
    "coreMeaning": "B가 조용한 행동으로 관심을 전할 때 A에게 뜻을 알리는 과정을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "B가 조용한 행동으로 관심을 전할 때 A에게 뜻을 알리는 과정을 연구한다. B의 담백한 표현은 B 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "비견의 개인 설명은 B 원국에 실제 성립해야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "B의 ISTP love 자료에 있는 조용한 행동의 표현을 읽는다. A가 그 표현을 알아들었는지는 별도 실제 답으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "행동의 뜻을 한마디 덧붙일 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "90de97440a025970e638",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "f4b08443773729cee364",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "3f130780549c6cb7a467",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_definition_condition"
      }
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "과장 없이 참여할 여지",
    "risk": "충분히 해줬으니 알아야 한다고 보기",
    "factBomb": "내게 분명한 행동도 상대에게는 설명이 필요한 정보다.",
    "twist": "작은 말이 이미 한 행동을 더 잘 전달할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 약속 준비를 마친 뒤 A에게 어떤 뜻인지 짧게 말한다."
    },
    "senderAdjustment": "한 행동과 그 의도를 연결한다.",
    "recipientQuestion": "이 행동이 어떤 관심으로 전해졌는가?",
    "counterexample": "실제 행동이나 능력이 없다면 수리·도움의 성과를 만들지 않는다.",
    "distinctFromOtherParagraphs": "B의 행동 통로와 A의 의미 수신을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P2:b-safe-disagreement",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 관계에서 중요하게 여기는 것",
    "coreMeaning": "B가 다른 의견을 말할 때 존중받는 조건과 A의 선명한 전달을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "B가 다른 의견을 말할 때 존중받는 조건과 A의 선명한 전달을 연구한다. B의 비판 민감성은 B 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "A의 명료함은 A 자료이며 무례함의 사실이 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "뜻과 말투가 남긴 영향을 나눠 이야기한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "B도 동의하지 않는 부분을 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "db247d65aafcb4dee108",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "9157cb32f6c4c40c5336",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "axis": "COMMUNICATION_STYLE",
        "definition": "맥락과 관계를 고려해 전달",
        "condition": "민감한 피드백의 장소와 수신자 확인",
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
    "positive": "거절이 가능한 대화",
    "risk": "불편을 숨기다가 관계 전체의 평가로 확대",
    "factBomb": "상처받기 싫다는 마음이 다른 의견까지 없애지는 않는다.",
    "twist": "부드러운 거절이 정확한 정보를 남길 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 제안의 일부는 좋지만 일정은 어렵다고 말한다."
    },
    "senderAdjustment": "감정과 동의 여부를 따로 전한다.",
    "recipientQuestion": "어떤 표현이면 같은 의견 차이를 편하게 말할 수 있는가?",
    "counterexample": "모욕이나 강요가 있다면 단순 화법 차이로 조율하지 않는다.",
    "distinctFromOtherParagraphs": "B의 편안한 조건과 A의 의도를 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P2:b-chosen-presence",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 관계에서 중요하게 여기는 것",
    "coreMeaning": "B가 함께하는 시간에서 가까움을 느낄 조건과 A의 목표 공유를 나눠 본다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "B가 함께하는 시간에서 가까움을 느낄 조건과 A의 목표 공유를 나눠 본다. B의 함께할 시간 필요는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "A의 방향 선호가 B의 매일 반응을 뜻하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "양보다 어떤 시간에 서로 참여할지 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "개인 시간을 관계 거절로 자동 해석하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "36656d3001309491d0b4",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "829aba7d8c1c08596ec1",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "axis": "RELATION_STYLE",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
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
    "positive": "함께할 시간을 구체적으로 고를 여지",
    "risk": "만난 횟수를 관심의 순위로 만들기",
    "factBomb": "일정을 같이 썼다고 서로를 같은 만큼 들은 것은 아니다.",
    "twist": "짧아도 서로 고른 시간이 더 편할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 함께하고 싶은 활동 하나를 A에게 제안한다."
    },
    "senderAdjustment": "함께할 시간과 각자 할 일을 나눈다.",
    "recipientQuestion": "어떤 순간에는 함께하는 것이 더 중요한가?",
    "counterexample": "현재 두 사람 모두 각자 쉬고 싶다면 만남을 의무로 늘리지 않는다.",
    "distinctFromOtherParagraphs": "B의 연결 조건을 생활 전체의 동일화와 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P3:b-reliable-small-care",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B가 관계에 가져오는 장점",
    "coreMeaning": "B의 작은 돌봄이 A의 새 관심을 실제 만남으로 이어줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "B의 작은 돌봄이 A의 새 관심을 실제 만남으로 이어줄 조건을 연구한다. B의 헌신 자료와 개인 C073 양측 source를 각각 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 새로운 제안은 A의 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "필요한 준비 중 가능한 몫만 보탤 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "B가 모든 정리 역할을 맡는 것으로 고정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "1004e6a907ac24e91902",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "dfc34b2596abcc59968f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "0cd0bd812b5a8be66358",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_fusion_condition"
      }
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
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "새 관심을 실행할 작은 도움",
    "risk": "고마움을 기다리며 요청 없이 역할을 늘리기",
    "factBomb": "많이 챙겼다는 사실이 계속 맡겠다는 동의는 아니다.",
    "twist": "도움을 줄여도 같이 즐길 자리는 남길 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 새 활동의 예약만 맡고 나머지는 함께 나눈다."
    },
    "senderAdjustment": "준비·참여·마무리의 몫을 분리한다.",
    "recipientQuestion": "지금 도와주면 좋은 부분과 직접 할 부분은 무엇인가?",
    "counterexample": "B의 Fusion 조건이 부족하면 꾸준한 돌봄의 결합 근거로 배정하지 않는다.",
    "distinctFromOtherParagraphs": "B의 실제 기여와 A의 활동 기대 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P3:b-new-view-with-listening",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B가 관계에 가져오는 장점",
    "coreMeaning": "B의 다른 이유를 묻는 힘을 A의 준비를 무시하지 않는 질문으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "B의 다른 이유를 묻는 힘을 A의 준비를 무시하지 않는 질문으로 연구한다. B의 왜 묻기 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 신뢰 속도는 별도 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "준비한 이유를 듣고 다른 방법의 일부만 제안한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "질문이 많다는 사실로 냉정한 인격을 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "2b93d97c1e2c796152d6",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "d048a1db929d8e81a67f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "익숙한 만남에 새로운 선택을 더할 가능성",
    "risk": "질문의 재미로 상대의 수고를 부정",
    "factBomb": "다른 답이 보인다고 이미 준비한 이유가 없어지지는 않는다.",
    "twist": "하나만 바꾸어도 새 관점의 가치를 볼 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 A의 장소 선택 이유를 듣고 활동 하나를 보탠다."
    },
    "senderAdjustment": "기존 목적과 수정 가능한 방법을 구분한다.",
    "recipientQuestion": "지키고 싶은 준비와 시험할 수 있는 부분은 무엇인가?",
    "counterexample": "A가 변화를 원하지 않으면 새 방법을 반드시 시도해야 한다고 하지 않는다.",
    "distinctFromOtherParagraphs": "B의 질문 기여를 A의 능력 평가와 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P4:b-silent-resentment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B가 조심해야 할 부분",
    "coreMeaning": "B가 원하는 것을 말하기 어려울 때 A에게 동의한 것으로 전달될 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "B가 원하는 것을 말하기 어려울 때 A에게 동의한 것으로 전달될 위험을 연구한다. B의 의견 전달 어려움은 B 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "A의 분명한 기대는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "괜찮다는 답과 아직 정리 중이라는 답은 다른 정보다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "말하지 않은 불편을 실제 A의 위반으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "4d4a080342aae90654f6",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "3c4908e2cedec63d2de9",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "작은 요청으로 선택을 남길 가능성",
    "risk": "힌트로 정답을 맞히게 하기",
    "factBomb": "암호처럼 전한 기대는 공동 약속이 아니다.",
    "twist": "아직 답하기 어렵다는 안내도 분명한 표현이다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 장소가 불편한 이유 하나와 대안을 전한다."
    },
    "senderAdjustment": "불편한 항목 하나부터 명시한다.",
    "recipientQuestion": "지금 동의한 부분과 보류한 부분은 무엇인가?",
    "counterexample": "B가 이미 분명히 거절했다면 더 잘 말하지 못한 탓으로 돌리지 않는다.",
    "distinctFromOtherParagraphs": "B의 정보 제공과 A의 해석을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "clr:material:CH03.P4:b-novelty-with-cost",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B가 조심해야 할 부분",
    "coreMeaning": "B의 상황에 맞춘 변경이 A의 준비 비용을 놓칠 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "B의 상황에 맞춘 변경이 A의 준비 비용을 놓칠 조건을 연구한다. B의 즉흥 위험은 B 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "A의 약속 선호는 A 원천이며 실제 손해는 별도다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "변경 이유와 남은 준비 담당을 같이 말한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "한 번 바뀐 약속을 B의 인격으로 확대하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "b71d7b721fd430f52898",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "5190684455c102b45097",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "새 선택과 기존 약속을 조정할 가능성",
    "risk": "좋은 제안이라며 변경 비용을 가볍게 넘기기",
    "factBomb": "다른 재미를 찾았다고 먼저 기다린 시간이 돌아오지는 않는다.",
    "twist": "작게 바꾸면 서로의 수고를 함께 살릴 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 만남을 바꾸자고 할 때 취소와 재예약도 함께 정한다."
    },
    "senderAdjustment": "바뀐 항목과 남은 처리 몫을 알린다.",
    "recipientQuestion": "이 변경으로 다시 해야 하는 일은 무엇인가?",
    "counterexample": "비용이 없고 양쪽이 편하면 변경 자체를 문제로 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 안정성 설명을 반복하지 않고 B의 변경 책임을 연구",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": null,
      "mbtiPair": "두 유형이 모두 알려졌을 때만 해당 방향 notablePairs와 역방향의 서로 다른 sourceCoverage를 참고한다. 유형만으로 실제 감정·관계 결과를 판정하지 않는다.",
      "fusion": "A/B 개인별 기존 명리와 MBTI 두 root 및 실제 rule 충족을 따로 확인한다. 공통 Pair Fusion 점수를 만들지 않는다.",
      "unknownMbti": "해당 사람 MBTI와 개인 Fusion 및 Pair 후보를 보류한다. 상대 유형·원국으로 보충하지 않는다.",
      "unknownBirthTime": "실제 남은 원국만 사용하고 시주·시주 관계를 보충하지 않는다.",
      "recall": "CH09 모든 문단은 같은 두 사람에게 앞서 실제 도입된 호환 의미만 회수한다. 없는 의미를 마지막에 새로 도입하지 않는다.",
      "safety": "강요·통제·폭력은 성향 차이로 조율하지 않는다. 동의 없는 접촉·만남·화해를 요구하지 않는다."
    },
    "disallowed": [
      "결혼·이별·외도·실제 호감·과거 사건의 단정",
      "공통 축·합·유형 차이를 성공 또는 갈등의 보장으로 사용",
      "같은 root를 개인·Pair·Fusion의 독립 세 근거로 집계",
      "계보 미검증 Pair 이름을 과학적 관계 예측으로 승격"
    ],
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  }
];
