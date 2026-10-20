/** Static offline research only. No scoring, resolution or customer output. */
import type { LovePairMaterial } from "./researchTypes";
export const CH07_MATERIALS: readonly LovePairMaterial[] = [
  {
    "id": "clr:material:CH07.P1:mismatched-response-time",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "가장 중요한 차이",
    "coreMeaning": "표현 직후의 확인 필요와 정리 뒤 답하는 방식이 만날 갈등 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "표현 직후의 확인 필요와 정리 뒤 답하는 방식이 만날 갈등 조건을 연구한다. A와 B의 실제 source가 각각 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A는 반응을 기다리고 B는 생각할 시간을 원할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "늦은 답을 무관심으로, 질문을 압박으로 읽는지는 직접 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "이 차이는 갈등이 이미 일어났다는 사실이 아니다.",
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
    "positive": "다른 속도를 일찍 알릴 기회",
    "risk": "재촉과 침묵이 서로를 늘리는 순환",
    "factBomb": "반응을 더 요구할수록 답할 정보가 줄 수 있다.",
    "twist": "짧은 안내로 두 필요를 같이 남길 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 긴 메시지 뒤 같은 질문이 이어지면 가능한 응답부터 나눈다."
    },
    "senderAdjustment": "읽었다는 신호와 답할 시점을 따로 정한다.",
    "recipientQuestion": "지금 필요한 것은 관심 신호인가, 완성된 답인가?",
    "counterexample": "둘 다 즉시 대화가 편하면 속도 갈등을 만들지 않는다.",
    "distinctFromOtherParagraphs": "대표 차이와 실제 악순환의 성립 조건을 분리",
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
    "id": "clr:material:CH07.P1:no-friction-no-hidden-fault",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "가장 중요한 차이",
    "coreMeaning": "뚜렷한 축 대립이 없을 때도 여건과 기대를 묻되 숨은 갈등을 발명하지 않는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "뚜렷한 축 대립이 없을 때도 여건과 기대를 묻되 숨은 갈등을 발명하지 않는 연구다. 같은 trait도 A/B owner를 각각 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "현재 가능한 시간과 기대는 유형으로 알 수 없다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "합의하지 않은 부탁이 있다면 범위를 물을 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "friction이 없다는 사실은 완벽함이나 숨은 불화의 증거가 아니다.",
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
        "sourceKey": "2f90ecfe06a11bd76f98",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "ec946768eedaf2debe5c",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "pair_reference"
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
        "id": "sar:facet:BOUNDARY:renegotiation",
        "axis": "BOUNDARY",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
        "notIndependentEvidence": true
      }
    ],
    "positive": "유사한 필요 안의 실제 차이를 질문할 여지",
    "risk": "갈등 장을 채우려고 가상의 원인을 만들기",
    "factBomb": "차이가 확인되지 않았다면 그 빈칸도 남겨야 한다.",
    "twist": "같은 필요여도 가능한 여력은 달라질 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 둘 다 혼자 쉴 필요가 있다면 공동 약속을 무엇까지 유지할지 묻는다."
    },
    "senderAdjustment": "성향과 현재 여건을 나눠 확인한다.",
    "recipientQuestion": "지금 가능한 몫과 기대했던 몫은 각각 무엇인가?",
    "counterexample": "실제 불편이 없다는 답이면 새로운 문제를 찾아내려 하지 않는다.",
    "distinctFromOtherParagraphs": "근거 부재의 처리로 갈등 예언과 구분",
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
    "id": "clr:material:CH07.P2:clash-position-and-question",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "명리에서 보이는 충돌",
    "coreMeaning": "실제 子午 충의 위치 사실과 생활의 변경 문제를 서로 다른 층으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "실제 子午 충의 위치 사실과 생활의 변경 문제를 서로 다른 층으로 연구한다. 두 사람의 실제 교차 子午 refs가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "대향하는 관계의 정의를 이별 사건으로 번역하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "약속과 변경에 관한 개인 trait는 각자의 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "원국의 충이 변경 갈등을 일으켰다는 인과를 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "941361dcf854c0c9f213",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "canonical_membership_condition"
      },
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
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "axis": "ADAPTABILITY",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "확인할 기대를 좁힐 관점",
    "risk": "충 때문에 어쩔 수 없다는 숙명론",
    "factBomb": "관계 이름은 책임을 설명하지 않고 행동을 면제하지도 않는다.",
    "twist": "차이를 작은 합의로 다룰 여지가 남는다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 만남 변경 때 누가 무엇을 다시 준비할지 확인한다."
    },
    "senderAdjustment": "명리의 refs와 실제 준비 비용을 따로 기록한다.",
    "recipientQuestion": "달라진 조건 중 무엇을 함께 다시 정해야 하는가?",
    "counterexample": "canonical 충이 없으면 연구표의 같은 글자로 충을 보충하지 않는다.",
    "distinctFromOtherParagraphs": "실제 구조 설명과 연애 행동의 별도 조건",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "해당 종류·참여 지지·실제 양쪽 소유자·기둥 위치가 있는 기존 cross-person relation ID가 필요하다. 전통 표만으로 검출하지 않는다.",
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
    "id": "clr:material:CH07.P2:harm-is-not-wonjin",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "명리에서 보이는 충돌",
    "coreMeaning": "실제 해와 연구표의 원진이 같은 글자를 포함해도 다른 producer 상태임을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "실제 해와 연구표의 원진이 같은 글자를 포함해도 다른 producer 상태임을 연구한다. 교차 해는 실제 canonical harm refs가 있어야 한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "원진은 현행 교차 producer가 지원하지 않아 별도 보류한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "서운함의 현대 비유를 A/B의 실제 감정으로 쓰지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "개인 traits는 소유자별로만 확인한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "e23b027944c5f0d3197a",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "canonical_membership_condition"
      },
      {
        "owner": "SHARED",
        "sourceKey": "88af77cc76890045d0ca",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "unsupported_comparison_only"
      },
      {
        "owner": "A",
        "sourceKey": "8a6e798d5bb288c958fa",
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
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
    "positive": "관계명 혼동을 줄일 가능성",
    "risk": "같은 子未를 두 독립된 갈등 효과로 세기",
    "factBomb": "같은 글자에 두 이름이 있어도 실제 검출이 두 번 된 것은 아니다.",
    "twist": "근거를 줄여도 더 정확한 질문을 남길 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 짧은 답의 뜻을 확인하되 원진 때문에 서운했다고 하지 않는다."
    },
    "senderAdjustment": "검출된 종류와 미지원 연구를 분리한다.",
    "recipientQuestion": "실제로 들은 답과 내가 붙인 의미는 무엇인가?",
    "counterexample": "해의 실제 refs도 없으면 두 관계 모두 개인에게 배정하지 않는다.",
    "distinctFromOtherParagraphs": "미지원 의미를 실제 canonical 관계로 승격하지 않는 조건",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "해를 설명할 때 기존 실제 cross-person harm의 子未 refs·참여 소유자·기둥 위치가 필요하다. 원진 원천은 미지원 비교·보류용이며 실제 원진 ID를 요구하거나 생성하지 않는다.",
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
    "id": "clr:material:CH07.P3:correction-and-retreat",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "이 관계의 팩폭",
    "coreMeaning": "A의 교정과 B의 침묵이 서로 이유를 잃게 할 반복 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "A의 교정과 B의 침묵이 서로 이유를 잃게 할 반복 조건을 연구한다. A의 수정 선호는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "B의 늦은 표현은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "침묵을 무성의로 읽어 지적이 늘면 설명할 공간이 줄 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "누가 먼저 잘못했는지는 이 근거로 알 수 없다.",
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
        "sourceKey": "fbf6075c276ff0b58116",
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
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "악순환의 행동을 나눌 가능성",
    "risk": "작은 오류를 사람됨의 평가로 묶기",
    "factBomb": "맞는 말을 계속해도 듣지 못한 이유는 남는다.",
    "twist": "한 항목만 고르면 대화의 크기가 줄어들 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 한 번의 약속 실수에서 지난 일까지 꺼내려 할 때 멈춘다."
    },
    "senderAdjustment": "수정 하나와 보류할 이야기를 나눈다.",
    "recipientQuestion": "지금 꼭 바꿀 행동과 더 들어야 할 이유는 무엇인가?",
    "counterexample": "B가 명확히 답했는데 A가 무시했다면 B의 침묵 탓으로 돌리지 않는다.",
    "distinctFromOtherParagraphs": "방향별 원인을 함께 놓되 양쪽 책임을 자동 동등화하지 않음",
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
    "id": "clr:material:CH07.P3:care-and-unasked-debt",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "이 관계의 팩폭",
    "coreMeaning": "서로 챙기려는 마음이 말하지 않은 수고의 경쟁이 될 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "서로 챙기려는 마음이 말하지 않은 수고의 경쟁이 될 조건을 연구한다. A의 요청 어려움과 B의 감정 관찰은 별도 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "각자 한 일과 실제 부탁한 일을 나눈다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "알아주길 기다리는 기대가 있으면 명시할 필요가 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "실제 희생이나 상대의 착취를 생성하지 않는다.",
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
        "sourceKey": "6e846060eca8b8a32399",
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "positive": "감사와 분담을 구분할 여지",
    "risk": "더 많이 한 사람이 더 사랑한다고 평가",
    "factBomb": "수고의 양은 마음의 순위를 계산하는 단위가 아니다.",
    "twist": "부탁을 줄이는 것이 관계를 덜 아끼는 일은 아니다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 둘 다 준비를 맡으려 할 때 원하는 도움과 가능한 몫을 따로 적는다."
    },
    "senderAdjustment": "감사·요청·담당을 나눈다.",
    "recipientQuestion": "원한 도움과 먼저 선택한 수고는 각각 무엇인가?",
    "counterexample": "실제 합의 위반이 있으면 단순 숨은 기대로 축소하지 않는다.",
    "distinctFromOtherParagraphs": "같은 돌봄 의미에서도 반복 비용의 원인이 다른 경우",
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
    "id": "clr:material:CH07.P4:safety-outside-type",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "갈등이 커지는 조건",
    "coreMeaning": "거절에 대한 불이익과 감시가 있을 때 유형 차이로 조율하지 않는 경계를 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "거절에 대한 불이익과 감시가 있을 때 유형 차이로 조율하지 않는 경계를 연구한다. 경계 source는 실제 피해 사실의 증거가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "안전하게 의견을 말할 수 있는지 먼저 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "폭력·강요·통제는 표현 차이로 미화하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "화해나 관계 유지를 의무로 두지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "77f627655304fd8ba002",
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
    "positive": "자유로운 선택을 보호할 기준",
    "risk": "관계를 지키려 한쪽의 거절을 계속 줄이기",
    "factBomb": "좋은 의도라는 말이 안전을 대신할 수는 없다.",
    "twist": "계속하지 않는 선택도 유효하다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 위협이 있는 대화라면 중단과 확인된 지원을 먼저 검토한다."
    },
    "senderAdjustment": "안전과 동의를 확인한 뒤 조율 가능 여부를 판단한다.",
    "recipientQuestion": "지금 자유롭게 거절하고 멈출 수 있는가?",
    "counterexample": "일반 의견 차이만 확인됐다면 이 자료로 실제 학대를 진단하지 않는다.",
    "distinctFromOtherParagraphs": "연애 갈등과 안전 문제의 적용 경계",
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
    "id": "clr:material:CH07.P4:assumption-grows-with-meaning",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "갈등이 커지는 조건",
    "coreMeaning": "A의 큰 의미 해석과 B의 짧은 설명이 서로 다른 기대를 남길 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "A의 큰 의미 해석과 B의 짧은 설명이 서로 다른 기대를 남길 조건을 연구한다. A의 이상적 사랑과 B의 짧은 설명 선호는 각자 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "한 행동의 의미를 상대도 공유했다고 가정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "해석을 사실처럼 말하면 실제 이유가 빠질 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "큰 의미를 원한다고 예민한 인격으로 규정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "8264ae5e3ee1beaf0072",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "B",
        "sourceKey": "ab58584bb46db51081a8",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "기대의 차이를 실제 질문으로 바꿀 여지",
    "risk": "작은 행동을 관계 전체의 시험으로 확대",
    "factBomb": "내가 붙인 의미는 두 사람이 합의한 뜻이 아니다.",
    "twist": "짧은 설명 하나가 큰 추측을 줄일 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 약속 취소를 사랑의 부정으로 읽기 전 실제 이유를 묻는다."
    },
    "senderAdjustment": "행동·해석·현재 요청을 나눈다.",
    "recipientQuestion": "그 행동에 어떤 뜻을 담았고 어떤 뜻으로 들렸는가?",
    "counterexample": "명확한 거절을 받은 경우에는 좋은 의도일 거라는 추측으로 덮지 않는다.",
    "distinctFromOtherParagraphs": "의미 부여와 실제 상대 답의 차이를 악화 조건으로 연구",
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
