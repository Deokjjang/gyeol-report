/** Static offline research only. No scoring, resolution or customer output. */
import type { LovePairMaterial } from "./researchTypes";
export const CH05_MATERIALS: readonly LovePairMaterial[] = [
  {
    "id": "clr:material:CH05.P1:ab-rule-as-option",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "A는 B에게 어떤 자극을 주는가",
    "coreMeaning": "A→B의 정관 관계를 약속의 기준을 알아보는 조건부 자극으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A→B의 정관 관계를 약속의 기준을 알아보는 조건부 자극으로 연구한다. A가 기준을 제안할 때 B의 선택이 남아야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B 일간을 viewer로 A 일간을 본 실제 정관 결과가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 A가 만남 주기를 제안하고 B가 바꾸고 싶은 부분을 고른다. A의 꾸준함과 B의 열정은 각자 source로 따로 읽는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B가 책임을 느꼈다는 실제 감정은 단정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "ce1defc1af72408fec4a",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "A",
        "sourceKey": "5190684455c102b45097",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "dfc34b2596abcc59968f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "예측할 약속을 함께 고를 가능성",
    "risk": "기준의 제안을 B를 관리할 권한으로 바꾸기",
    "factBomb": "정관으로 보인다는 말이 상대를 지휘할 권한은 아니다.",
    "twist": "수정할 규칙이 있어야 기준도 선택이 된다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 만남 주기를 제안하고 B가 바꾸고 싶은 부분을 고른다."
    },
    "senderAdjustment": "제안과 공동 확정을 나눈다.",
    "recipientQuestion": "어떤 약속은 편하고 어떤 부분은 바꾸고 싶은가?",
    "counterexample": "B 기준 결과가 정관이 아니면 이 십성 의미를 배정하지 않는다.",
    "distinctFromOtherParagraphs": "받는 사람 B의 계산 관계와 A의 실제 행동 가설 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P1:ab-output-enjoyment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "A는 B에게 어떤 자극을 주는가",
    "coreMeaning": "A→B의 식신 관계를 직접 해볼 즐거움의 가능성과 실제 참여 의사로 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A→B의 식신 관계를 직접 해볼 즐거움의 가능성과 실제 참여 의사로 구분한다. A가 활동을 제안하는 가설은 A trait에서 출발한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B를 viewer로 한 기존 식신 결과만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 A가 짧은 체험을 제안하고 B가 수준과 끝낼 때를 고른다. B의 의미 있는 경험 선호는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "즐거웠는지는 실제 B의 답을 받아야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "90e77590d3ea07930ba1",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "A",
        "sourceKey": "e49363e69d48e0771b10",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "ba4aed5f58e7de310848",
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
    "positive": "새 경험을 선택할 기회",
    "risk": "움직여야 즐거워진다는 기대를 강요",
    "factBomb": "기회를 열었다고 그 경험을 원했다는 답까지 생기지는 않는다.",
    "twist": "멈출 선택이 있어야 시도도 자유롭다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 짧은 체험을 제안하고 B가 수준과 끝낼 때를 고른다."
    },
    "senderAdjustment": "참여 강도와 중단 신호를 함께 둔다.",
    "recipientQuestion": "직접 해보고 싶은 부분과 쉬고 싶은 부분은 무엇인가?",
    "counterexample": "실제 식신 결과나 B의 참여 의사가 없으면 긍정 효과를 확정하지 않는다.",
    "distinctFromOtherParagraphs": "십성의 원천과 활동의 실제 수신을 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P1:ab-resource-specificity",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "A는 B에게 어떤 자극을 주는가",
    "coreMeaning": "A→B의 정재 관계를 만남의 시간·비용을 구체화하는 조건부 질문으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A→B의 정재 관계를 만남의 시간·비용을 구체화하는 조건부 질문으로 연구한다. A의 행동 중심 표현과 실제 여력은 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "B의 일간을 기준으로 본 정재 결과를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "가상으로 A가 만남의 소요 시간을 말하고 B가 가능한 범위를 고른다. B가 천천히 고를 선호는 B source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "돈을 많이 쓴다는 사실이나 경제적 도움은 생성하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "e2ed5b09b1f8185708cd",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "A",
        "sourceKey": "8e927df60c470175a28b",
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
    "positive": "무리 없는 만남의 범위를 정할 가능성",
    "risk": "준비한 비용으로 B의 선택권을 제한",
    "factBomb": "시간과 돈을 썼다고 상대의 답을 산 것은 아니다.",
    "twist": "규모를 줄여도 분명한 관심을 전할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 만남의 소요 시간을 말하고 B가 가능한 범위를 고른다."
    },
    "senderAdjustment": "준비한 자원과 동의할 선택을 나눈다.",
    "recipientQuestion": "이번 제안에서 감당 가능한 시간과 비용의 범위는 무엇인가?",
    "counterexample": "정재 결과가 없으면 실제 자원 관계로 설명하지 않으며 소득도 추정하지 않는다.",
    "distinctFromOtherParagraphs": "정재의 관리 의미와 현실 재물·애정의 보장을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P2:ab-clear-invite",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A가 B에게 주는 좋은 영향",
    "coreMeaning": "A의 분명한 제안이 B에게 생각할 정보를 줄 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 분명한 제안이 B에게 생각할 정보를 줄 조건을 연구한다. 도움 되는 선명함은 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 신중함은 B source로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "날짜와 목적을 알려주되 대답할 시간을 남긴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "방향 ID는 실제 A subject와 B target의 기존 결과여야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "9157cb32f6c4c40c5336",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "f4b08443773729cee364",
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
        "id": "sar:facet:ACTION_TEMPO:review-window",
        "axis": "ACTION_TEMPO",
        "definition": "행동 전 검토 시간을 배정",
        "condition": "오류 비용과 기한이 모두 주어진 상황",
        "notIndependentEvidence": true
      }
    ],
    "positive": "불필요한 추측을 줄일 여지",
    "risk": "답이 늦으면 제안을 확정해버리기",
    "factBomb": "제안이 구체적이라는 이유로 동의가 빨라질 의무는 없다.",
    "twist": "분명히 말하고 기다리는 두 행동은 함께 가능하다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 다음 만남을 제안한 뒤 B가 답할 때를 묻는다."
    },
    "senderAdjustment": "제안 내용과 확정의 시점을 분리한다.",
    "recipientQuestion": "어떤 정보가 더 있으면 고르기 쉬운가?",
    "counterexample": "B가 바로 답하고 싶다면 신중한 유형이라는 이유로 기다리게 하지 않는다.",
    "distinctFromOtherParagraphs": "A의 제안이 B에게 주는 정보와 실제 호감은 별개",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P2:ab-care-with-autonomy",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A가 B에게 주는 좋은 영향",
    "coreMeaning": "A의 관심이 B가 고른 지원으로 도착할 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 관심이 B가 고른 지원으로 도착할 조건을 연구한다. A의 관찰·표현 Fusion은 A의 양측 source가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 자기 몰입 필요는 B 원천이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "대신 해결할지 같이 정리할지 B에게 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "두 사람의 Fusion을 공동 근거로 합치지 않는다.",
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
    "positive": "필요한 도움의 방향을 맞출 가능성",
    "risk": "B가 직접 하겠다고 해도 더 좋은 도움이라며 밀기",
    "factBomb": "도울 마음이 크다는 사실이 받는 사람의 결정을 대신하지는 않는다.",
    "twist": "기다려주는 행동도 A의 기여가 될 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 준비를 돕기 전에 B가 원한 범위를 묻는다."
    },
    "senderAdjustment": "도움 제안과 수락한 몫을 따로 적는다.",
    "recipientQuestion": "어떤 부분은 직접 하고 어떤 부분을 나눌 수 있는가?",
    "counterexample": "도움 동의나 A의 Fusion 조건이 없으면 결합 효과를 말하지 않는다.",
    "distinctFromOtherParagraphs": "A의 제공 자원과 B의 수락 조건을 방향별로 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P2:ab-new-meaning",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A가 B에게 주는 좋은 영향",
    "coreMeaning": "A의 새로운 제안이 B의 기존 약속을 지우지 않으며 선택을 넓힐 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "A의 새로운 제안이 B의 기존 약속을 지우지 않으며 선택을 넓힐 조건을 연구한다. A의 열정은 새로운 초대의 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "B의 신뢰 선호는 실제 유지할 조건을 묻는 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "새 경험의 작은 일부부터 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "B가 실제로 성장하거나 재미를 느꼈다고 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "dfc34b2596abcc59968f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "5190684455c102b45097",
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
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "익숙한 만남에 다른 선택을 넣을 여지",
    "risk": "준비와 마무리는 B에게 전부 맡기기",
    "factBomb": "새로움을 제안한 사람에게도 유지할 몫이 있다.",
    "twist": "작게 시작하면 기존 수고도 살릴 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 새로운 장소 하나를 제안하며 기존 시간을 유지한다."
    },
    "senderAdjustment": "바꿀 항목과 처리할 몫을 같이 말한다.",
    "recipientQuestion": "새로운 것 중 무엇은 해보고 무엇은 그대로 두고 싶은가?",
    "counterexample": "B가 원치 않는다면 보완 관계라는 이름으로 참여시키지 않는다.",
    "distinctFromOtherParagraphs": "A의 확장과 B의 동의를 구분한 긍정 방향",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P3:ab-reaction-pressure",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 행동이 B에게 부담이 되는 순간",
    "coreMeaning": "A의 빠른 표현이 B의 정리 시간을 반응 의무로 바꿀 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 빠른 표현이 B의 정리 시간을 반응 의무로 바꿀 조건을 연구한다. 표현하고 싶은 A의 의도는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "생각 뒤 감정을 다루는 B의 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "B의 짧은 답을 거절로 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "답을 요구할수록 말할 여유가 줄 수 있으나 실제 경험은 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "22219e4de369178b0387",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "c0d70c49b5a928ce5a82",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
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
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "axis": "ENERGY_DIRECTION",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "수신 속도를 따로 정할 기회",
    "risk": "같은 반응이 올 때까지 표현을 반복",
    "factBomb": "크게 전했다고 같은 크기의 답을 받을 권리는 없다.",
    "twist": "반응을 덜 요구하면 설명이 더 나올 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 긴 메시지를 보낸 뒤 B에게 답할 준비가 됐는지 묻는다."
    },
    "senderAdjustment": "듣고 있다는 신호와 대답의 시점을 나눈다.",
    "recipientQuestion": "지금은 어떤 응답이 가능하고 언제 더 말할 수 있는가?",
    "counterexample": "B가 즉시 같은 표현을 원한다면 대비된 부담을 사실로 만들지 않는다.",
    "distinctFromOtherParagraphs": "A의 발신 비용과 B의 가능한 수신을 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P3:ab-correction-without-request",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 행동이 B에게 부담이 되는 순간",
    "coreMeaning": "A의 교정이 B에게 인격 평가처럼 전달될 가능 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 교정이 B에게 인격 평가처럼 전달될 가능 조건을 연구한다. A의 수정 성향과 B의 비판 수신은 독립 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "실제 교정 요청 여부를 먼저 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "틀린 행동과 취향의 차이를 나눠야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "상처받았는지는 B의 실제 답으로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "09f88fe7ec21e62f0659",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "db247d65aafcb4dee108",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "axis": "COMMUNICATION_STYLE",
        "definition": "맥락과 관계를 고려해 전달",
        "condition": "민감한 피드백의 장소와 수신자 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "필요한 문제를 정확히 줄일 여지",
    "risk": "사소한 차이와 지난 실수를 모두 지적",
    "factBomb": "정확한 내용이라고 사람을 평가할 권한이 되지는 않는다.",
    "twist": "고치지 않을 차이를 고르는 것도 정확함이다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 만남 준비의 오류 하나만 말하고 B의 이유를 듣는다."
    },
    "senderAdjustment": "필수 수정과 취향을 나눈다.",
    "recipientQuestion": "이 부분을 함께 고치길 원하는가?",
    "counterexample": "안전상 즉시 멈출 행동이면 취향 차이로 덮지 않는다.",
    "distinctFromOtherParagraphs": "B의 실제 상처를 가정하지 않는 방향별 교정 위험",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P3:ab-care-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 행동이 B에게 부담이 되는 순간",
    "coreMeaning": "A가 미리 맡은 수고를 B의 빚으로 해석하게 되는 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A가 미리 맡은 수고를 B의 빚으로 해석하게 되는 조건을 연구한다. A의 낮은 요청·높은 책임은 A 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "B의 자유 경계는 B의 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "부탁 없이 한 일과 실제 합의한 몫을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "B가 이용했거나 A가 희생했다는 과거를 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "78cdb2e803560073a1c5",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "f3a71de74732acc8d4fd",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "돌봄의 범위를 명확히 할 가능성",
    "risk": "고마움을 알아채지 못하면 애정 부족으로 평가",
    "factBomb": "A가 다 했다는 말은 B가 부탁했다는 말과 다르다.",
    "twist": "다음 부탁을 말하면 수고의 비교를 줄일 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 준비를 맡기 전 B와 가능한 역할을 나눈다."
    },
    "senderAdjustment": "선택한 도움과 요청할 몫을 따로 말한다.",
    "recipientQuestion": "어떤 일은 부탁한 것이고 어떤 일은 내가 먼저 선택했는가?",
    "counterexample": "이미 합의한 담당의 미이행이라면 숨은 기대라고 축소하지 않는다.",
    "distinctFromOtherParagraphs": "제공자의 기대와 수신자의 동의를 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P4:ab-listen-before-more",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 영향력을 잘 사용하는 방법",
    "coreMeaning": "A가 제안을 늘리기 전에 B가 말한 뜻을 확인하는 조율을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A가 제안을 늘리기 전에 B가 말한 뜻을 확인하는 조율을 연구한다. A의 해결 자원은 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 완곡한 전달은 실제 B의 답을 더 들어야 한다는 조건이다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "들은 사실과 A의 해석을 따로 되말한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "B에게 항상 더 잘 설명할 책임을 넘기지 않는다.",
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
        "sourceKey": "e8152f5a228dde8da538",
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
    "positive": "도움의 순서를 맞출 가능성",
    "risk": "이해했다며 해결 계획부터 확정",
    "factBomb": "들었다는 말보다 이해를 고칠 여지가 먼저다.",
    "twist": "제안을 보류하는 시간이 도움을 구체화할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 B의 설명을 한 문장으로 확인한 뒤 도움을 제안한다."
    },
    "senderAdjustment": "핵심을 되말하고 틀린 부분을 묻는다.",
    "recipientQuestion": "내가 이해한 것 중 다르게 받아들인 부분은 무엇인가?",
    "counterexample": "B가 대화를 원치 않으면 경청을 이유로 계속 묻지 않는다.",
    "distinctFromOtherParagraphs": "A의 조정 행동과 B의 실제 선택을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P4:ab-offer-not-reservation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 영향력을 잘 사용하는 방법",
    "coreMeaning": "A의 적극적인 제안을 B의 일정에 대한 예약권과 구분한다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A의 적극적인 제안을 B의 일정에 대한 예약권과 구분한다. A의 행동 표현과 B의 신뢰 속도는 따로 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "A는 확정 전에 수정·거절할 때를 열어둔다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "B는 고른 부분과 어려운 부분을 말할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "방향의 가능성을 실제 교제 진행으로 예언하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "d88467512c1c5489e7d0",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "d048a1db929d8e81a67f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "서로 다른 속도에도 선택을 맞출 여지",
    "risk": "먼저 준비한 일을 취소하기 어렵게 만들어 동의를 받기",
    "factBomb": "준비를 끝냈다는 사실이 상대의 답을 끝내지는 않는다.",
    "twist": "준비 규모를 줄이면 거절도 편해질 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 작은 만남을 제안하고 B가 바꿀 시간을 둔다."
    },
    "senderAdjustment": "조사와 확정을 나눈다.",
    "recipientQuestion": "어디까지가 제안이고 언제부터 확정인가?",
    "counterexample": "거절에 불이익이나 위협이 있다면 조율 가능한 속도 차이로 보지 않는다.",
    "distinctFromOtherParagraphs": "적극성의 좋은 활용과 강요의 경계",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
    "id": "clr:material:CH05.P4:ab-return-with-boundary",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A가 영향력을 잘 사용하는 방법",
    "coreMeaning": "A가 개인 시간을 확보하면서 B에게 기다릴 선택 정보를 주는 조율 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A가 개인 시간을 확보하면서 B에게 기다릴 선택 정보를 주는 조율 연구다. A의 공간 선호는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B의 확인 필요는 B source이며 무기한 반응 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "다시 대화할 의사와 시점을 함께 전한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "모든 사적인 생각을 공개할 의무를 두지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "2f90ecfe06a11bd76f98",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RECOVERY_NEED:return-agreement",
        "axis": "RECOVERY_NEED",
        "definition": "회복 뒤 다시 응답할 시점을 합의",
        "condition": "완료 보장 대신 현재 가능한 연락만 합의",
        "notIndependentEvidence": true
      }
    ],
    "positive": "공간과 재연결을 동시에 고를 가능성",
    "risk": "설명 없이 거리를 두다가 B의 질문을 모두 간섭으로 보기",
    "factBomb": "내 공간이 필요하다는 말에 B의 시간도 포함해 생각할 수 있다.",
    "twist": "짧은 안내가 혼자 쉴 시간을 지킬 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 A가 오늘은 쉬고 다음 날 대화 가능 여부를 다시 묻겠다고 알린다."
    },
    "senderAdjustment": "중단·재개 의사·가능 시점을 분리한다.",
    "recipientQuestion": "어떤 안내가 있으면 각자 시간을 편히 고를 수 있는가?",
    "counterexample": "원치 않거나 안전하지 않은 대화에는 재개 약속을 강요하지 않는다.",
    "distinctFromOtherParagraphs": "A의 공간 사용과 B의 대기 선택을 방향에 맞게 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
