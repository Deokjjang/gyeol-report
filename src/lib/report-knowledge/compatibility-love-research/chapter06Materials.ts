/** Static offline research only. No scoring, resolution or customer output. */
import type { LovePairMaterial } from "./researchTypes";
export const CH06_MATERIALS: readonly LovePairMaterial[] = [
  {
    "id": "clr:material:CH06.P1:ba-care-receiving",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "B는 A에게 어떤 자극을 주는가",
    "coreMeaning": "B→A의 정인 관계를 도움을 받을 통로와 실제 수락의 차이로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B→A의 정인 관계를 도움을 받을 통로와 실제 수락의 차이로 연구한다. B가 돌봄을 제안하는 행동 가설은 B trait다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A를 viewer로 B 일간을 본 실제 정인 결과가 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 B가 필요한 준비를 돕겠다고 하고 A가 범위를 고른다. A는 받을 도움과 직접 할 일을 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A가 안심했다는 실제 감정은 계산 관계로 알 수 없다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "fe11b875c7ad3a9c8318",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "B",
        "sourceKey": "cbf1428b3d23661a2472",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "2f90ecfe06a11bd76f98",
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
        "id": "sar:facet:AUTONOMY:chosen-support",
        "axis": "AUTONOMY",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "혼자 감당할 필요를 줄일 선택지",
    "risk": "좋은 도움이라며 A의 거절을 바꾸려 하기",
    "factBomb": "도움의 통로가 있다고 그 도움을 받아야 하는 것은 아니다.",
    "twist": "받지 않겠다는 답도 적절한 지원 정보를 준다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 필요한 준비를 돕겠다고 하고 A가 범위를 고른다."
    },
    "senderAdjustment": "도움을 제안한 뜻과 실제 수락을 나눈다.",
    "recipientQuestion": "지금 받고 싶은 도움과 혼자 해볼 부분은 무엇인가?",
    "counterexample": "A 기준 정인 결과가 아니면 이 십성 의미를 사용하지 않는다.",
    "distinctFromOtherParagraphs": "정인의 수혜 상징을 B의 검증된 돌봄 능력으로 뒤집지 않음",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P1:ba-other-question",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "B는 A에게 어떤 자극을 주는가",
    "coreMeaning": "B→A의 편인 관계를 익숙한 답의 이유를 묻는 가능 조건으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B→A의 편인 관계를 익숙한 답의 이유를 묻는 가능 조건으로 연구한다. B의 관심 주제에서 말이 늘어나는 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 일간 기준으로 B를 본 실제 편인 결과를 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 B가 A가 고른 만남의 이유 하나를 묻고 답을 남긴다. A의 반응 감각은 질문을 어떻게 받는지 직접 물을 단서다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "새 질문이 A에게 실제 통찰을 줬다고 확정하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "78ca1a3776c53c2d0b48",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "B",
        "sourceKey": "8fce1695b6195da81f9d",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "6e846060eca8b8a32399",
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
    "positive": "같은 경험을 다른 이유로 볼 기회",
    "risk": "질문을 계속해 A의 원래 뜻을 해명 대상으로 만들기",
    "factBomb": "다른 이유를 찾는 일은 상대의 답을 의심할 의무가 아니다.",
    "twist": "질문을 하나 줄이면 더 중요한 이유가 들릴 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 A가 고른 만남의 이유 하나를 묻고 답을 남긴다."
    },
    "senderAdjustment": "알아볼 질문과 당장 필요 없는 질문을 나눈다.",
    "recipientQuestion": "이 질문은 지금 이야기하고 싶은 범위인가?",
    "counterexample": "실제 편인 결과가 없거나 질문 동의가 없으면 이 자극을 배정하지 않는다.",
    "distinctFromOtherParagraphs": "A→B의 활동·규칙 자극과 다른 수신자 기준 의미",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P1:ba-equal-opinion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "B는 A에게 어떤 자극을 주는가",
    "coreMeaning": "B→A의 비견 관계를 각자 의견을 낼 수 있는 접점으로 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B→A의 비견 관계를 각자 의견을 낼 수 있는 접점으로 연구한다. B의 깊은 연결 선호와 A의 활동 선호를 분리한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 일간에서 본 B의 실제 비견 결과만 사용한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "가상으로 B가 활동의 이유를 말하고 A가 지금 하고 싶은 범위를 고른다. 둘이 같은 답을 해야 동등한 관계가 되는 것은 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "같은 오행 분류를 동일한 행동이나 같은 감정으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "3f130780549c6cb7a467",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "recipient_direction_definition"
      },
      {
        "owner": "B",
        "sourceKey": "a469049c0715564eddeb",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "e49363e69d48e0771b10",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "의견을 나란히 놓을 기회",
    "risk": "같은 기준일 것이라며 차이를 생략",
    "factBomb": "동등한 자리는 같은 대답을 강요하는 자리가 아니다.",
    "twist": "비슷한 계산 관계 안에도 다른 선택이 남을 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 활동의 이유를 말하고 A가 지금 하고 싶은 범위를 고른다."
    },
    "senderAdjustment": "각자 낸 뜻을 합의 전까지 따로 둔다.",
    "recipientQuestion": "같은 말로 보이지만 다르게 고른 부분은 무엇인가?",
    "counterexample": "양쪽 십성이 비견으로 같다면 계산 차이가 있는 척 쓰지 않는다.",
    "distinctFromOtherParagraphs": "방향 의미가 수렴해도 source owner와 실제 답을 유지",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P2:ba-warm-feedback",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B가 A에게 주는 좋은 영향",
    "coreMeaning": "B의 따뜻한 반응이 A의 정리 중인 생각을 밖으로 꺼낼 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 따뜻한 반응이 A의 정리 중인 생각을 밖으로 꺼낼 조건을 연구한다. B의 온화한 전달은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 생각 뒤 감정 처리는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "정리되지 않은 말을 들어도 즉시 결론을 요구하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "A가 실제로 말하고 싶었는지는 확인해야 한다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "be4762318c579457d41c",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "c0d70c49b5a928ce5a82",
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
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "positive": "완성되지 않은 생각도 나눌 여지",
    "risk": "대답이 나오면 곧바로 감정의 확답을 요구",
    "factBomb": "열린 질문 뒤에 정해진 답을 기다리면 초대가 시험이 된다.",
    "twist": "반응을 적게 요구할수록 더 솔직한 정보가 나올 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 A의 짧은 생각에 반응하고 더 말할지는 A가 고르게 한다."
    },
    "senderAdjustment": "듣는 반응과 추가 질문을 분리한다.",
    "recipientQuestion": "지금 더 이야기하고 싶은가, 생각할 시간이 필요한가?",
    "counterexample": "A가 혼자 정리를 원하면 따뜻한 대화를 계속하는 것이 도움은 아니다.",
    "distinctFromOtherParagraphs": "B의 반응 제공과 A의 표현 선택을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P2:ba-quiet-doing",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B가 A에게 주는 좋은 영향",
    "coreMeaning": "B의 조용한 행동이 A에게 알아볼 수 있는 관심으로 전해질 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B의 조용한 행동이 A에게 알아볼 수 있는 관심으로 전해질 조건을 연구한다. B의 행동 표현은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 조용한 배려는 같은 뜻의 자동 증거가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "둘이 했던 행동의 뜻을 짧게 설명할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "상대가 이미 고마워했다고 만들지 않는다.",
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
        "sourceKey": "b237ee4b3b3a29f96aa1",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
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
        "id": "sar:facet:EXPRESSION:receipt-check",
        "axis": "EXPRESSION",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "positive": "큰 표현 없이 지원할 여지",
    "risk": "행동을 했으니 말은 필요 없다고 판단",
    "factBomb": "해준 일은 보이더라도 해준 이유는 보이지 않을 수 있다.",
    "twist": "한마디가 과장 없이 관심을 알려줄 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 준비를 마친 뒤 A에게 어떤 도움이었는지 설명한다."
    },
    "senderAdjustment": "행동 하나와 그 뜻을 전한다.",
    "recipientQuestion": "어떤 부분은 도움으로 전해졌고 무엇은 다르게 들렸는가?",
    "counterexample": "실제 도움 요청이나 능력이 없다면 결과를 보장하지 않는다.",
    "distinctFromOtherParagraphs": "A→B의 명확한 제안과 다른 B의 행동 번역",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P2:ba-memory-open-question",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B가 A에게 주는 좋은 영향",
    "coreMeaning": "B가 기억한 취향을 A의 현재 선택으로 갱신하는 관심을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "B가 기억한 취향을 A의 현재 선택으로 갱신하는 관심을 연구한다. B의 기억 기반 애정은 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "A의 자유 선호는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "예전 답을 인용하되 바뀌었는지 물어본다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "기억을 A의 고정 성격으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "471b73edd84a2be883e2",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "738f089cfefc104fd626",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "익숙한 관심과 새 답을 함께 남길 가능성",
    "risk": "예전 말을 근거로 현재 선택을 막기",
    "factBomb": "잘 기억하는 것과 같은 답을 요구하는 것은 다르다.",
    "twist": "다시 모른다고 묻는 것이 더 세심할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 전에 좋아한 장소를 A가 지금도 원하는지 묻는다."
    },
    "senderAdjustment": "기억과 현재의 답을 따로 둔다.",
    "recipientQuestion": "이번에는 같은 방식과 다른 방식 중 무엇이 편한가?",
    "counterexample": "A의 선호가 그대로라는 실제 답이면 매번 바뀌어야 한다고 요구하지 않는다.",
    "distinctFromOtherParagraphs": "B의 정보 갱신이 A에게 주는 선택 공간",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P3:ba-asking-becomes-monitoring",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 행동이 A에게 부담이 되는 순간",
    "coreMeaning": "B의 확인 질문이 A의 개인 시간에 대한 보고 요구가 될 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 확인 질문이 A의 개인 시간에 대한 보고 요구가 될 조건을 연구한다. 확인하고 싶은 B의 필요는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A의 자유 경계는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "공동 일정의 정보와 사적인 생각을 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "A가 감시당했다고 느꼈다는 사실은 확인 전 알 수 없다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "8a6e798d5bb288c958fa",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
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
        "id": "sar:facet:BOUNDARY:privacy",
        "axis": "BOUNDARY",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
        "notIndependentEvidence": true
      }
    ],
    "positive": "필요한 정보를 좁힐 기회",
    "risk": "답이 올 때까지 질문 범위를 확대",
    "factBomb": "마음을 확인하고 싶다는 말이 모든 정보를 볼 권한은 아니다.",
    "twist": "한 가지 합의된 신호로 여러 질문을 줄일 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 A의 모든 일정을 묻기보다 다음 연결 시간만 상의한다."
    },
    "senderAdjustment": "필요한 공동 정보만 요청한다.",
    "recipientQuestion": "어떤 정보는 함께 필요하고 어떤 것은 개인 영역인가?",
    "counterexample": "위협·감시·강요가 있으면 애정 확인 방식의 차이로 정상화하지 않는다.",
    "distinctFromOtherParagraphs": "B의 확인 의도와 A의 실제 경계를 별도로 유지",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P3:ba-explanation-too-late",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 행동이 A에게 부담이 되는 순간",
    "coreMeaning": "B의 늦은 표현이 A에게 정보 없는 보류로 전달될 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 늦은 표현이 A에게 정보 없는 보류로 전달될 조건을 연구한다. B의 침묵 방식은 B 자료다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A가 피드백을 원한다는 자료는 실제 답할 의무가 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "정리 중이라는 안내와 동의 여부를 구분한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "A가 버림받았다고 느꼈다는 실제 경험을 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "fbf6075c276ff0b58116",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "0893c89cb6a0f134a6d6",
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
        "id": "sar:facet:ACTION_TEMPO:paced-handoff",
        "axis": "ACTION_TEMPO",
        "definition": "자기 착수와 타인의 준비 속도를 조정",
        "condition": "공동 과제의 의존 단계가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "말할 준비와 필요한 안내를 함께 고를 여지",
    "risk": "괜찮다고 한 뒤 이유 없이 멀어지기",
    "factBomb": "말이 늦어도 보류라는 정보는 먼저 줄 수 있다.",
    "twist": "짧은 거절이 긴 추측보다 정확할 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 제안에 아직 답하기 어렵다고 말하고 가능한 시점을 둔다."
    },
    "senderAdjustment": "보류한 항목과 지금 가능한 답을 전한다.",
    "recipientQuestion": "무엇은 지금 답하고 무엇은 나중에 말하고 싶은가?",
    "counterexample": "B가 이미 명확하게 거절했다면 추가 설명을 요구하지 않는다.",
    "distinctFromOtherParagraphs": "B의 표현 지연과 A의 추측 비용을 방향별로 연구",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P3:ba-care-erases-choice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 행동이 A에게 부담이 되는 순간",
    "coreMeaning": "B가 미리 챙긴 도움이 A의 직접 선택을 앞설 조건을 연구한다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B가 미리 챙긴 도움이 A의 직접 선택을 앞설 조건을 연구한다. 돌봄을 표현하는 B와 몰입을 지키는 A source가 각각 필요하다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "A가 요청했는지부터 확인한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "거절을 받으면 더 좋은 방법으로 설득하기보다 멈춘다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "실제 부담이나 무감사를 A의 성격으로 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "cbf1428b3d23661a2472",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "2f90ecfe06a11bd76f98",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "원하는 도움의 범위를 맞출 여지",
    "risk": "준비한 수고를 이유로 A의 거절을 무효화",
    "factBomb": "정성을 들였어도 받는 사람이 고를 자리는 남아야 한다.",
    "twist": "이미 준비했어도 일부를 하지 않을 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 계획을 대신 정하기 전에 A가 원하는 참여를 묻는다."
    },
    "senderAdjustment": "제안·수락·보류를 세 단계로 나눈다.",
    "recipientQuestion": "어떤 도움은 지금 받지 않길 원하는가?",
    "counterexample": "A가 도움을 요청했다면 돌봄 자체를 간섭으로 단정하지 않는다.",
    "distinctFromOtherParagraphs": "A→B 수고의 빚과 달리 B가 선택을 대신하는 위험",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P4:ba-present-not-explain-away",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 영향력을 잘 사용하는 방법",
    "coreMeaning": "B가 꾸민 위로 대신 A의 말을 확인하는 방식으로 관심을 전달하는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B가 꾸민 위로 대신 A의 말을 확인하는 방식으로 관심을 전달하는 연구다. B의 거짓 위로를 꺼리는 자료는 B source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A의 비판 수신 자료는 A source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "동의하지 않아도 실제 들은 영향을 인정할 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "B에게 감정을 연기하거나 A에게 즉시 괜찮아지라고 하지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "d2bab7db06e5a988314b",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "db247d65aafcb4dee108",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
    "positive": "솔직함과 수신이 함께 남을 여지",
    "risk": "정확한 말만 하며 감정의 영향을 부정",
    "factBomb": "위로를 꾸미지 않는 것과 불편을 듣지 않는 것은 다르다.",
    "twist": "해결하지 않고 들은 뜻을 남길 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 A의 불편을 되말하고 어떤 부분이 남았는지 묻는다."
    },
    "senderAdjustment": "판단과 경청의 순서를 구분한다.",
    "recipientQuestion": "지금 들은 것 중 내가 놓친 영향은 무엇인가?",
    "counterexample": "A가 대화를 원하지 않으면 확인을 계속하는 것이 존중은 아니다.",
    "distinctFromOtherParagraphs": "B의 진실한 전달과 A의 감정 확정을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P4:ba-update-memory",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 영향력을 잘 사용하는 방법",
    "coreMeaning": "B가 익숙한 방식에서 A의 새로운 관심을 들을 여지를 남기는 조율 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B가 익숙한 방식에서 A의 새로운 관심을 들을 여지를 남기는 조율 연구다. B의 기억은 실제 과거 입력이 있을 때만 사실로 쓴다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A의 열정은 현재 원하는 내용의 증거는 아니다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "이전 기준을 버릴지 유지할지 각각 묻는다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "A가 바뀌었다는 실제 사건을 미리 만들지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "471b73edd84a2be883e2",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      },
      {
        "owner": "A",
        "sourceKey": "dfc34b2596abcc59968f",
        "knowledgeIsRuntimeEvidence": false,
        "sourceUse": "individual_trait_condition"
      }
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
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "positive": "오래 아는 관심을 현재에 맞출 가능성",
    "risk": "원래 좋아했으니 지금도 맞을 것이라고 결정",
    "factBomb": "기억은 현재의 답을 대신할 수 없다.",
    "twist": "바뀌지 않은 취향도 직접 확인한 새 정보가 된다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 익숙한 만남과 새로운 제안 중 A의 현재 선택을 묻는다."
    },
    "senderAdjustment": "과거 선호와 현재 답을 나란히 둔다.",
    "recipientQuestion": "지금도 좋은 점과 새로 바꾸고 싶은 점은 무엇인가?",
    "counterexample": "A가 기존 방식을 원한다면 새로움을 의무로 만들지 않는다.",
    "distinctFromOtherParagraphs": "정보 갱신의 B 책임과 A의 선택권 구분",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
    "id": "clr:material:CH06.P4:ba-name-own-need",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "love",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B가 영향력을 잘 사용하는 방법",
    "coreMeaning": "B가 알아주길 기다리는 마음을 A에게 답할 수 있는 요청으로 바꾸는 연구다.",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B가 알아주길 기다리는 마음을 A에게 답할 수 있는 요청으로 바꾸는 연구다. B의 느린 애정 표현과 A의 분명한 기대는 각각 source다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "모든 감정을 정리하지 않아도 필요한 행동 하나는 고를 수 있다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "A는 요청을 들은 뒤 가능 여부를 실제로 답한다.",
        "roleKind": "research_not_customer_sentence"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "B에게 관계 회복의 전부를 맡기지 않는다.",
        "roleKind": "research_not_customer_sentence"
      }
    },
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "9480be75092745eda721",
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "positive": "추측 대신 요청과 응답을 남길 여지",
    "risk": "A가 알아채야 사랑이라고 판단",
    "factBomb": "말하지 않은 부탁을 못 맞힌 것은 애정의 점수가 아니다.",
    "twist": "작은 요청이 두 사람 모두의 선택을 넓힐 수 있다.",
    "fictionalScene": {
      "kind": "LOVE_SCENE",
      "status": "fictional_not_customer_history",
      "text": "가상으로 B가 다음 만남에서 받고 싶은 관심 하나를 짧게 말한다."
    },
    "senderAdjustment": "바람과 공동 합의를 구분한다.",
    "recipientQuestion": "이 요청 중 가능한 부분과 어려운 부분은 무엇인가?",
    "counterexample": "A가 이미 거절이나 불이익을 준다면 B의 표현만 고쳐 해결한다고 하지 않는다.",
    "distinctFromOtherParagraphs": "B의 명시적 요청과 A의 수락 책임을 분리",
    "precedingMeaningRefs": [],
    "review": "conditional_editorial_research",
    "requirements": {
      "personA": "A 본인의 실제 natal/MBTI/Fusion만 연결. 등록된 유형·trait·성립 조건과 signed axis를 확인한다.",
      "personB": "B 본인의 실제 natal/MBTI/Fusion만 연결. A의 trait를 B에게 복사하지 않는다.",
      "canonicalPair": "본 후보에 관계 종류가 없으면 새로운 합·충·형 등을 추가하지 않는다.",
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
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
