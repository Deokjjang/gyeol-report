/** Static offline research only. No scoring, resolution or customer output. */
import type { LovePairMaterial } from "./researchTypes";
export const CH02_MATERIALS: readonly LovePairMaterial[] = [
  {
    "id": "clr:material:CH02.P1:a-deliberate-affection",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A의 관계 성향",
    "coreMeaning": "A가 신중하게 관심을 고르는 방식과 B가 알아듣는 신호를 분리한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "A가 신중하게 관심을 고르는 방식과 B가 알아듣는 신호를 분리한다. A의 검토 시간은 A의 실제 trait로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "비견의 정의는 A 원국의 실제 성립 조건과 별도 검토한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "A의 INTP love 자료에서 신중하게 관계를 고르는 선호를 확인한다. B의 반응 필요는 A의 선호를 대신 설명하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "A는 지금 가능한 답을 전하고 B의 필요는 직접 묻는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "d311c40e8b3f4b157c09",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "99d6728eeef28d090237",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "3f130780549c6cb7a467",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_definition_condition"
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:ACTION_TEMPO:review-window",
        "axis": "ACTION_TEMPO",
        "definition": "행동 전 검토 시간을 배정",
        "condition": "오류 비용과 기한이 모두 주어진 상황",
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
    "positive": "선택한 만남에 주의를 기울일 가능성",
    "risk": "확신할 때까지 아무 신호도 주지 않기",
    "factBomb": "생각이 깊어도 말하지 않은 답은 전달되지 않는다.",
    "twist": "아직 모르겠다는 답도 선택 정보가 된다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 다시 만나고 싶지만 더 알아가고 싶다고 전한다."
    },
    "senderAdjustment": "가능한 답과 보류한 답을 나눈다.",
    "recipientQuestion": "어떤 신호가 있어야 기다릴지 고를 수 있는가?",
    "counterexample": "A에게 해당 trait나 원국 조건이 없으면 신중함의 근거로 배정하지 않는다.",
    "distinctFromOtherParagraphs": "A의 처리 과정이며 B의 현재 감정은 아님",
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
    "id": "clr:material:CH02.P1:a-explicit-action",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A의 관계 성향",
    "coreMeaning": "A의 행동 중심 표현과 B가 중요하게 여길 의미의 확인을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "A의 행동 중심 표현과 B가 중요하게 여길 의미의 확인을 연구한다. A가 준비하고 이행하는 표현은 A 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "정관은 A의 위치·조건을 확인할 때만 개인 해석 후보가 된다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "A의 ESTJ love 자료에서 관심을 준비와 이행으로 표현할 가능성을 읽는다. B의 깊은 연결 선호와 출처를 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "준비한 행동의 뜻과 B가 받은 뜻을 같이 묻는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "8e927df60c470175a28b",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "1ad75d65f36179f32968",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "ce1defc1af72408fec4a",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "관심을 실제 행동으로 옮길 가능성",
    "risk": "일을 끝냈으니 감정 대화도 끝났다고 보기",
    "factBomb": "처리한 일이 많아도 듣지 않은 마음은 남을 수 있다.",
    "twist": "작은 질문이 행동의 도움을 더 정확히 만든다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 만남 준비 뒤 B에게 좋았던 점을 묻는다."
    },
    "senderAdjustment": "행동의 뜻을 설명하고 수신을 확인한다.",
    "recipientQuestion": "지금은 어떤 관심을 더 받고 싶은가?",
    "counterexample": "B가 실제 해결을 원한다면 경청만이 더 좋은 답이라고 하지 않는다.",
    "distinctFromOtherParagraphs": "A의 표현 자원과 B의 의미 해석 구분",
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
    "id": "clr:material:CH02.P2:a-space-with-connection",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 관계에서 중요하게 여기는 것",
    "coreMeaning": "A가 개인 공간을 지키려는 조건과 B에게 필요한 재연결 정보를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "A가 개인 공간을 지키려는 조건과 B에게 필요한 재연결 정보를 연구한다. A의 자유 선호는 A의 trait에서 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "B의 확인 필요를 A의 의무로 바로 바꾸지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "혼자 쓸 때와 다시 이야기할 때를 따로 알린다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "공간을 원한다는 말이 관계 거절은 아니다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f3a71de74732acc8d4fd",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "8a6e798d5bb288c958fa",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "자기 선택을 잃지 않는 만남",
    "risk": "연락의 이유까지 모두 생략",
    "factBomb": "내 자유를 설명하지 않으면 다른 사람의 대기시간이 될 수 있다.",
    "twist": "짧은 안내로 공간을 더 편하게 지킬 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 개인 작업 뒤 통화 가능한 때를 제안한다."
    },
    "senderAdjustment": "쉬는 범위와 공동 약속을 함께 말한다.",
    "recipientQuestion": "어떤 정보까지 알면 편히 각자 시간을 쓸 수 있는가?",
    "counterexample": "B가 연락을 원하지 않는 때라면 확인 질문을 의무로 늘리지 않는다.",
    "distinctFromOtherParagraphs": "A의 필요를 B의 성격으로 복사하지 않음",
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
    "id": "clr:material:CH02.P2:a-trust-change",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 관계에서 중요하게 여기는 것",
    "coreMeaning": "A가 신뢰를 느끼는 기준을 고정된 만남 횟수보다 변경 정보로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "A가 신뢰를 느끼는 기준을 고정된 만남 횟수보다 변경 정보로 연구한다. A의 약속 선호를 실제 원천으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "B의 즉흥 위험은 가능 조건이며 실제 위반은 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "변경할 때 무엇을 미리 알릴지 상의한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "한 번의 변화로 B의 애정을 판정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "5190684455c102b45097",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "b71d7b721fd430f52898",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "기다릴 기준을 명료하게 할 가능성",
    "risk": "예전 합의를 유일한 정답으로 고정",
    "factBomb": "지키라는 말만 있고 바꿀 길이 없으면 약속은 숨길 일이 된다.",
    "twist": "변경을 빨리 알리는 행동도 신뢰일 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 새 장소를 제안하면 A가 중요한 기존 조건을 말한다."
    },
    "senderAdjustment": "유지할 부분과 바꿀 수 있는 부분을 구분한다.",
    "recipientQuestion": "어떤 변화는 미리 알아야 준비할 수 있는가?",
    "counterexample": "두 사람이 이미 변화에 편하다면 경직된 기준을 새로 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 안정 조건과 B의 실제 행동 분리",
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
    "id": "clr:material:CH02.P3:a-help-with-permission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A가 관계에 가져오는 장점",
    "coreMeaning": "A의 세심한 관심을 B가 고를 수 있는 도움으로 제안하는 장점을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "A의 세심한 관심을 B가 고를 수 있는 도움으로 제안하는 장점을 연구한다. A의 감정 관찰 trait와 실제 개인 Fusion을 각각 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "A 안의 두 축이 있어야 C074를 사용할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "B에게는 혼자 해볼 필요가 있을 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "거절받아도 도움의 크기를 더 키우지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "6e846060eca8b8a32399",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "2f90ecfe06a11bd76f98",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "16a8411e967484ac9826",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_fusion_condition"
      }
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
    "positive": "필요한 부담을 정확히 덜 가능성",
    "risk": "부탁 전에 일을 전부 맡기",
    "factBomb": "잘해줄 수 있다는 생각이 대신할 권한은 아니다.",
    "twist": "돕지 않을 선택도 관심이 될 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 B의 바쁜 일을 들은 뒤 어떤 도움이 필요한지 묻는다."
    },
    "senderAdjustment": "한 가지 도움을 제안하고 선택을 기다린다.",
    "recipientQuestion": "직접 하고 싶은 부분과 도움받을 부분은 어디인가?",
    "counterexample": "A의 Fusion 한쪽이 빠지면 trait만으로 결합 사실을 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 자원과 B의 도움 동의를 분리",
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
    "id": "clr:material:CH02.P3:a-playful-encouragement",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A가 관계에 가져오는 장점",
    "coreMeaning": "A의 따뜻한 대화가 B에게 참여 강도를 고를 여지를 줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "A의 따뜻한 대화가 B에게 참여 강도를 고를 여지를 줄 조건을 연구한다. A의 친근한 대화는 A 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 천천히 여는 방식도 별도 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "새 이야기를 제안하되 지금 말하지 않아도 된다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "밝은 반응을 받아야만 기여가 유효한 것은 아니다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "96a809889e7203550ec2",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "7262748ae842a059b4fc",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "편한 이야기를 시작할 여지",
    "risk": "조용한 답을 재미없거나 무관심하다고 평가",
    "factBomb": "분위기를 열었다고 상대의 참여량까지 정할 수는 없다.",
    "twist": "잠깐 기다림이 초대를 더 따뜻하게 만들 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 새로운 관심을 말한 뒤 B가 고를 주제를 기다린다."
    },
    "senderAdjustment": "말할 차례와 넘길 선택을 남긴다.",
    "recipientQuestion": "지금 어떤 이야기가 편하고 어떤 것은 나중이 좋은가?",
    "counterexample": "B가 적극적인 교류를 원하면 무조건 느리게 맞추라고 하지 않는다.",
    "distinctFromOtherParagraphs": "A의 대화 기여를 B의 만족 사실로 승격하지 않음",
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
    "id": "clr:material:CH02.P4:a-fix-before-hearing",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A가 조심해야 할 부분",
    "coreMeaning": "A가 유용한 답을 주려는 의도로 B의 설명을 끊을 위험을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "A가 유용한 답을 주려는 의도로 B의 설명을 끊을 위험을 연구한다. A의 지원 방식은 A 원천에서 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "B의 조용한 관심은 B의 실제 필요 전체를 뜻하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "방법을 제시하기 전에 B가 원한 도움을 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "평가처럼 들렸는지는 실제 B의 답을 기다린다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "d35d738ef528ee981728",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "b237ee4b3b3a29f96aa1",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "해결 자원을 적절히 쓰는 가능성",
    "risk": "설명 중간에 답을 연속 제시",
    "factBomb": "해답을 많이 주었다고 많이 들은 것은 아니다.",
    "twist": "첫 질문을 바꾸면 같은 능력을 다르게 쓸 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 고민을 말할 때 A가 듣기와 제안 중 필요한 것을 묻는다."
    },
    "senderAdjustment": "들은 핵심을 먼저 확인한다.",
    "recipientQuestion": "지금 원하는 것은 방법인가, 같이 듣는 시간인가?",
    "counterexample": "B가 구체적인 해결을 요청했다면 제안 자체를 과용으로 판단하지 않는다.",
    "distinctFromOtherParagraphs": "A의 행동 비용이며 실제 B의 과거 부담은 아님",
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
    "id": "clr:material:CH02.P4:a-read-response",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A가 조심해야 할 부분",
    "coreMeaning": "A가 짧은 반응에 큰 의미를 붙일 위험과 확인할 정보를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "A가 짧은 반응에 큰 의미를 붙일 위험과 확인할 정보를 연구한다. A의 감정 확인 필요는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "B의 짧은 말은 B의 전달 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "짧아진 답의 이유는 그 두 자료만으로 알 수 없다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "같은 질문을 반복하기 전에 실제 뜻을 묻는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "8a6e798d5bb288c958fa",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "4b43fdff038f96814956",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "positive": "추측을 실제 답으로 고칠 가능성",
    "risk": "반응 크기로 애정량을 계산",
    "factBomb": "내가 읽은 표정은 B가 말한 대답이 아니다.",
    "twist": "불확실함을 인정하면 질문이 더 정확해질 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 B의 짧은 답에 불편한지 묻고 설명을 기다린다."
    },
    "senderAdjustment": "관찰한 말과 붙인 뜻을 분리한다.",
    "recipientQuestion": "그 답은 지금 어떤 뜻이었는가?",
    "counterexample": "B가 이미 명확히 설명했다면 숨은 이유를 계속 찾지 않는다.",
    "distinctFromOtherParagraphs": "관심의 민감성과 타인의 감정 사실을 구분",
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
