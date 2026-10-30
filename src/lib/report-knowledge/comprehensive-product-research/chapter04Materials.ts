/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH04_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH04.P1:clear-request-first",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "kind": "mbti",
    "readerQuestion": "처음 드러난 행동에서 무엇을 알 수 있는가?",
    "coreMeaning": "분명한 말이 처음에는 결정적인 인상으로 전달될 가능성",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "타인에게 드러날 수 있는 대표적인 특징을 설명한다.",
        "knowledge": "요청을 먼저 말하는 행동 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "그 특징의 근거를 제시한다.",
        "knowledge": "실제 ESTJ 소통 원천의 해당 행동만 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "낯선 사람과 만나는 상황을 예로 든다.",
        "knowledge": "첫 회의에서 필요한 자료와 기한을 명시하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "타인이 받기 쉬운 인상을 조건부로 설명한다.",
        "knowledge": "상대가 명확함 또는 급함으로 느낄 수 있음을 조건부로 제시",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ESTJ:communication:direct_speech",
        "auditRef": "source-catalog.json#9c42149062cec1cf15f3",
        "sourceKind": "mbti_trait",
        "recordSha256": "ccfc61666f671ec70b040af4db983ed883009d70f70b1fe056694b8b755d383a",
        "sourceFileSha256": "aa1ceaa51bdbcd8766a2e6d09ac92e025a7c21a5638f8d373b060da02c97c407",
        "originalState": {
          "type": "ESTJ",
          "area": "communication",
          "traitId": "direct_speech",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "direct"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "상대가 무엇을 준비할지 이해하기 쉬움",
    "shadow": "요청이 명령으로 들릴 여지가 있음",
    "factBomb": "분명한 말이라고 설명이 필요 없는 것은 아님",
    "twist": "짧은 이유 하나가 단호함을 협업 신호로 바꿀 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "첫 만남에서 요청과 선택 가능한 기한을 말하는 가상 장면"
    },
    "application": "요청·이유·상대의 가능한 답을 함께 확인",
    "prerequisites": [
      "해당 trait의 원문 범위·본인 실제 표현·상대 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "타인의 실제 인상·호감을 확정하지 않음",
    "distinction": "CH01 본질적 인물상보다 처음 드러난 표현 채널",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH01 본질적 인물상보다 처음 드러난 표현 채널",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P1:quiet-first-contact",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "kind": "mbti",
    "readerQuestion": "처음 드러난 행동에서 무엇을 알 수 있는가?",
    "coreMeaning": "처음의 적은 말과 관심 주제의 밀도 차이",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "타인에게 드러날 수 있는 대표적인 특징을 설명한다.",
        "knowledge": "처음에는 듣고 정리하는 행동 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "그 특징의 근거를 제시한다.",
        "knowledge": "INTP quiet_logic_engine 원천의 상황 차이를 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "낯선 사람과 만나는 상황을 예로 든다.",
        "knowledge": "처음 모임에서는 듣다가 관심 질문 하나를 꺼내는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "타인이 받기 쉬운 인상을 조건부로 설명한다.",
        "knowledge": "말수가 적다는 관찰과 무관심이라는 해석을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:identity:quiet_logic_engine",
        "auditRef": "source-catalog.json#ebb1b71f08b57dd89d16",
        "sourceKind": "mbti_trait",
        "recordSha256": "36206c8ee6b1e65e0dc761fda2909e3ff558a2ab2336aa149b221fcc215bb415",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "identity",
          "traitId": "quiet_logic_engine",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "ENERGY_DIRECTION",
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:compact-explanation",
        "definition": "깊게 검토한 내용을 짧게 전달",
        "condition": "수신자가 필요한 정보 범위를 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "quiet"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "충분히 들은 뒤 핵심 질문을 보탤 여지",
    "shadow": "상대가 참여 의도를 알 수 없는 상태가 이어짐",
    "factBomb": "생각 중이라는 표시는 생각만으로 전해지지 않음",
    "twist": "짧은 참여 신호가 긴 설명보다 오해를 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "처음 대화에서 듣고 있다는 말과 질문을 남기는 가상 장면"
    },
    "application": "정리 시간이 필요하면 응답할 시점을 알려 줌",
    "prerequisites": [
      "실제 원천·낯선 상황의 본인 반응 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "유형만으로 말수가 적거나 사교성이 낮다고 확정 금지",
    "distinction": "CH12 우정 유지보다 처음 교환되는 정보의 한계",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH12 우정 유지보다 처음 교환되는 정보의 한계",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P1:invite-into-conversation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "kind": "mbti",
    "readerQuestion": "처음 드러난 행동에서 무엇을 알 수 있는가?",
    "coreMeaning": "반응과 질문으로 대화 문을 여는 첫인상 후보",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "타인에게 드러날 수 있는 대표적인 특징을 설명한다.",
        "knowledge": "대화의 즐거운 부분을 찾아 이어 주는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "그 특징의 근거를 제시한다.",
        "knowledge": "ENFP joy_giver 원천의 조건부 설명 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "낯선 사람과 만나는 상황을 예로 든다.",
        "knowledge": "낯선 모임에서 상대가 말할 주제를 묻는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "타인이 받기 쉬운 인상을 조건부로 설명한다.",
        "knowledge": "반응이 편안함이 될 가능성과 부담이 될 가능성을 함께 둠",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFP:relationships:joy_giver",
        "auditRef": "source-catalog.json#f996cad5c3d54e4a5215",
        "sourceKind": "mbti_trait",
        "recordSha256": "17f63b45b9c2eca5df78e08ed7eabc50a23f48d5541a265d613dfe1a8a08e354",
        "sourceFileSha256": "552bfacdcd738eadf3685881993df971fe1734ad08d070a9220b70a7f4c3c801",
        "originalState": {
          "type": "ENFP",
          "area": "relationships",
          "traitId": "joy_giver",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "condition": "안전하게 이견을 말할 통로가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "첫 대화의 참여 기회를 만들 여지",
    "shadow": "밝은 반응이 항상 관심을 보증한다고 생각",
    "factBomb": "대화를 잘 열어도 끝까지 듣는 일은 별도",
    "twist": "덜 말해도 상대가 이야기할 공간은 더 커질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "짧게 자기 경험을 나누고 상대 질문을 남기는 가상 장면"
    },
    "application": "상대 반응을 관찰하되 뜻은 직접 확인",
    "prerequisites": [
      "실제 원천·대화 상황·참여 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구 수·인기·호감이 이미 높다고 단정 금지",
    "distinction": "CH07 매력 상징과 별개인 실제 소통 채널 후보",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH07 매력 상징과 별개인 실제 소통 채널 후보",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P2:private-criteria",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "kind": "mbti",
    "readerQuestion": "혼자 정리할 때 어떤 여건이 필요한가?",
    "coreMeaning": "혼자 판단 기준을 정리할 때 필요한 시간",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "혼자 있을 때 두드러질 수 있는 성향을 소개한다.",
        "knowledge": "혼자 있을 때 중요한 기준을 정돈하는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "사고·감정·회복 방식의 근거를 제시한다.",
        "knowledge": "INTJ independent_decision_maker의 원천 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "바깥에서의 모습과 다른 부분을 설명한다.",
        "knowledge": "밖에서 결론을 들었어도 사적으로 이유를 다시 살필 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "쉽게 드러나지 않는 내면의 욕구를 해석한다.",
        "knowledge": "감춰 둔 진심을 읽기보다 스스로 납득할 여건을 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTJ:identity:independent_decision_maker",
        "auditRef": "source-catalog.json#18fb1909ee68e78603a1",
        "sourceKind": "mbti_trait",
        "recordSha256": "d270a153acb4895739ebf3c4b0e422814bd21da6cfa60048773d3ba361483ba8",
        "sourceFileSha256": "f5a9b70f194d7ea3de825ba3c7aab2e1f8837b92a92b1dee4a92e8f3a6a5216a",
        "originalState": {
          "type": "INTJ",
          "area": "identity",
          "traitId": "independent_decision_maker",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "ENERGY_DIRECTION",
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DECISION_STYLE",
        "id": "sar:facet:DECISION_STYLE:closure-criteria",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "condition": "결정의 영향과 정보 범위가 명시될 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "self"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "남의 평가와 자기 판단을 구분할 여지",
    "shadow": "생각을 공유하지 않아 타인은 기준을 추측",
    "factBomb": "속으로 확실해져도 공동 결정은 아직 남아 있을 수 있음",
    "twist": "중간 생각을 조금 공유하면 독립 판단을 유지하기 쉬움",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 선택 전 자기 기준 세 가지를 적는 가상 장면"
    },
    "application": "혼자 정리할 시간과 함께 답할 기한을 합의",
    "prerequisites": [
      "실제 원천·결정권·혼자 생각할 접근성 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "외향적 행동을 가면으로 해석하지 않음",
    "distinction": "CH03 원천 간 긴장이 아닌 사적 판단 환경",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH03 원천 간 긴장이 아닌 사적 판단 환경",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P2:inner-values-not-secret",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "kind": "mbti",
    "readerQuestion": "혼자 정리할 때 어떤 여건이 필요한가?",
    "coreMeaning": "말하지 않은 감정 대신 확인 가능한 가치 질문",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "혼자 있을 때 두드러질 수 있는 성향을 소개한다.",
        "knowledge": "혼자 있을 때 무엇이 중요했는지 돌아보는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "사고·감정·회복 방식의 근거를 제시한다.",
        "knowledge": "INFP fi_inner_alignment의 자기 기준 설명 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "바깥에서의 모습과 다른 부분을 설명한다.",
        "knowledge": "공개적으로 동의한 선택과 사적 만족이 다른지 본인에게 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "쉽게 드러나지 않는 내면의 욕구를 해석한다.",
        "knowledge": "알 수 없는 욕구를 발명하지 않고 질문으로 유지",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INFP:thinkingStyle:fi_inner_alignment",
        "auditRef": "source-catalog.json#a0d821cb22f763b8b860",
        "sourceKind": "mbti_trait",
        "recordSha256": "d6d7e369b1cc77beb6bb9509399ca1c6e83d536c845f899a53e5d279bd9afaaf",
        "sourceFileSha256": "b2f149534b4c4bcd8b8d7d776a0d84f4dc06811d213e919dde1214d9d7613ab2",
        "originalState": {
          "type": "INFP",
          "area": "thinkingStyle",
          "traitId": "fi_inner_alignment",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "ENERGY_DIRECTION",
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "self"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "정말 지킬 이유와 분위기에 맞춘 선택을 나눌 여지",
    "shadow": "스스로도 말하지 않은 뜻을 상대가 알아주길 기대",
    "factBomb": "진심은 비밀 시험의 정답지가 아님",
    "twist": "한 가지 필요를 말하면 관계를 덜 흔들며 자기 기준을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 뒤 좋았던 점과 힘들었던 점을 적는 가상 장면"
    },
    "application": "공유하고 싶은 필요만 골라 전함",
    "prerequisites": [
      "실제 원천·본인 진술·안전한 표현 환경 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "트라우마·숨은 상처·우울 등 미입력 상태 추정 금지",
    "distinction": "내면은 타인의 추측이 아닌 개인 확인 영역",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "내면은 타인의 추측이 아닌 개인 확인 영역",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P2:after-help-load",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "kind": "fusion",
    "readerQuestion": "혼자 정리할 때 어떤 여건이 필요한가?",
    "coreMeaning": "사람을 살핀 뒤 자기 부담을 확인할 조건",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "혼자 있을 때 두드러질 수 있는 성향을 소개한다.",
        "knowledge": "혼자 있을 때 자신의 필요를 늦게 알아보는지 질문",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "사고·감정·회복 방식의 근거를 제시한다.",
        "knowledge": "정인의 지원 상징과 ENFJ 제공 선호는 별도 역할",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "바깥에서의 모습과 다른 부분을 설명한다.",
        "knowledge": "바깥 참여가 많았다는 사실도 본인 확인이 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "쉽게 드러나지 않는 내면의 욕구를 해석한다.",
        "knowledge": "숨은 욕구는 쉬고 싶은 방식과 부담의 범위로 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:zheng_yin",
        "auditRef": "source-catalog.json#6c355b0f3636e1e51b3d",
        "sourceKind": "natal_research",
        "recordSha256": "7098bd99043e8c73d05217bc8908293875ca89dc07cd2ff70af16b065b32f339",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "repository_only",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_zheng_yin",
              "taxonomy:ten_god_zheng_yin"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
            "정인·편인의 세부 명명과 도식/효신 조건은 경고 없는 독립 판본 대조 전 보류한다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "mbti:ENFJ:identity:compassionate_facilitator",
        "auditRef": "source-catalog.json#a9b5f2a55f489ecc8df6",
        "sourceKind": "mbti_trait",
        "recordSha256": "050c9065f29693df0df7d183fd4144b35cd18f08bd92fed358d575ba06761127",
        "sourceFileSha256": "c9055cddb9d2d0c159aac0dd8afb54fb218237786ec06ea339b97d29d3147f0c",
        "originalState": {
          "type": "ENFJ",
          "area": "identity",
          "traitId": "compassionate_facilitator",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C080",
        "auditRef": "source-catalog.json#4d2a61a25090b0b6c3f9",
        "sourceKind": "fusion_research",
        "recordSha256": "12f98b97c12391073eeb7dce92f09f91426c83516472ef4e1ece68094ebb9a44",
        "sourceFileSha256": "3196e648432ea2a207564bcba11d90693b0bae14a515e9c7a7ef9ec1bb971f9b",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "specific_source_not_yet_bound"
        }
      },
      {
        "sourceId": "deep:ten_god:zheng_yin",
        "auditRef": "source-catalog.json#8bac4a0473ad71ca524b",
        "sourceKind": "natal_research",
        "recordSha256": "380e3f5f82de6c74467c4321d2e0234a21601692aeb639f6a481481d12941572",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      },
      {
        "axis": "RECOVERY_NEED",
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "care"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "도움의 지속 가능성을 살필 여지",
    "shadow": "피로를 타고난 운명·타인의 착취로 단정",
    "factBomb": "모두를 살폈다고 내 필요가 자동으로 확인되지는 않음",
    "twist": "응답을 쉬는 시간이 다음 도움을 정확하게 만들 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "도운 뒤 남은 일정과 쉬는 시간을 보는 가상 장면"
    },
    "application": "부담·쉬는 필요·다시 응답할 시점을 본인이 정함",
    "prerequisites": [
      "정인·trait·부하·CARE 제공 행동 추가 확인; C080의 사회조율 축과 구별 검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "해당 부하·회복 필요 미확인 시 내면 사실로 사용 금지",
    "distinction": "진짜 나를 소진한 모습으로 동일시하지 않음",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "진짜 나를 소진한 모습으로 동일시하지 않음",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P3:selective-warmth",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "kind": "mbti",
    "readerQuestion": "가까워지면 어떤 표현 선택이 달라질 수 있는가?",
    "coreMeaning": "친밀해지며 표현 채널이 달라질 수 있는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "친밀한 관계에서 달라지는 행동을 설명한다.",
        "knowledge": "낯선 자리보다 가까운 관계에서 표현이 늘 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "변화가 나타나는 조건을 제시한다.",
        "knowledge": "실제 신뢰·공개 동의·안전이 변화 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "긍정적인 변화와 어려운 변화를 구분한다.",
        "knowledge": "작은 취향 배려와 말하지 않은 기대의 부담을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "처음의 인상과 다른 반전 매력을 설명한다.",
        "knowledge": "첫인상보다 표현 방식의 변화가 긍정적 발견",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFP:love:slow_open_romantic",
        "auditRef": "source-catalog.json#efd2df690e448ae25f53",
        "sourceKind": "mbti_trait",
        "recordSha256": "d554fd46f3f0bf957c55df99dac6e23c7d428afdab7d49043f550be66c8b6baa",
        "sourceFileSha256": "c5f3b4d9b7751e66db91891d896dbaf68452abe2df80e6668b204bcbf2302e51",
        "originalState": {
          "type": "ISFP",
          "area": "love",
          "traitId": "slow_open_romantic",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
        "condition": "공동 책임과 사적 권한을 구분",
        "notIndependentEvidence": true
      },
      {
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "gentle"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "본인이 편한 통로로 관심을 전할 여지",
    "shadow": "조용했던 사람이 사실 헌신적이라고 미리 확정",
    "factBomb": "천천히 여는 문이라고 안에 무엇이 있는지 알 수는 없음",
    "twist": "작은 명시적 표현이 관계의 추측을 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람이 좋아하는 활동을 함께 고르는 가상 장면"
    },
    "application": "실제 표현 변화와 원하는 친밀감 수준을 묻기",
    "prerequisites": [
      "ISFP slow_open_romantic 원천·관계 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 연인·교제 이력·상대의 호감 존재 가정 금지",
    "distinction": "CH10 사랑 전체보다 친밀도에 따른 표현 조건",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH10 사랑 전체보다 친밀도에 따른 표현 조건",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P3:playful-after-trust",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "kind": "mbti",
    "readerQuestion": "가까워지면 어떤 표현 선택이 달라질 수 있는가?",
    "coreMeaning": "함께 생각을 나누며 드러날 수 있는 재치",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "친밀한 관계에서 달라지는 행동을 설명한다.",
        "knowledge": "관심 주제를 나눌 때 말의 유연함이 늘 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "변화가 나타나는 조건을 제시한다.",
        "knowledge": "공유 관심·경청·농담에 대한 동의가 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "긍정적인 변화와 어려운 변화를 구분한다.",
        "knowledge": "즐거운 연결과 상대가 따라오기 어려운 설명을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "처음의 인상과 다른 반전 매력을 설명한다.",
        "knowledge": "평소의 정숙함과 다른 재치가 조건부 매력",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:love:witty_intellectual_attraction",
        "auditRef": "source-catalog.json#9001b550f225e0c6153d",
        "sourceKind": "mbti_trait",
        "recordSha256": "8161fb47b480bdf5d0a9aaf78fb46975955dfdb75c808fc6e0ba6b5560ae5ea3",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "love",
          "traitId": "witty_intellectual_attraction",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CREATION",
        "id": "sar:facet:CREATION:recombination",
        "definition": "알고 있는 재료를 다른 방식으로 결합",
        "condition": "사용 목적과 저작 권리 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "craft"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "새 관점을 함께 시험할 소재를 만들 여지",
    "shadow": "관심이 맞으면 친밀감도 자동으로 생긴다고 추론",
    "factBomb": "농담의 논리가 맞아도 상대가 즐겁다는 보장은 없음",
    "twist": "뜻을 설명하지 않고 반응을 묻는 것이 재치를 살릴 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구와 같은 주제에 다른 관점을 붙이는 가상 장면"
    },
    "application": "상대가 즐길 주제와 멈출 신호를 확인",
    "prerequisites": [
      "실제 INTP 원천·관심 교환·서로의 참여 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대 유형·실제 친밀도 미확인 시 궁합으로 전환 금지",
    "distinction": "유형의 숨은 천재성 대신 공유 가능한 대화 조건",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "유형의 숨은 천재성 대신 공유 가능한 대화 조건",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P3:firm-boundary-close",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "kind": "mbti",
    "readerQuestion": "가까워지면 어떤 표현 선택이 달라질 수 있는가?",
    "coreMeaning": "따뜻함과 선택 기준이 가까운 관계에서 공존할 가능성",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "친밀한 관계에서 달라지는 행동을 설명한다.",
        "knowledge": "가까워져도 거절할 부분은 있을 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "변화가 나타나는 조건을 제시한다.",
        "knowledge": "신뢰·선호·부담의 실제 범위를 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "긍정적인 변화와 어려운 변화를 구분한다.",
        "knowledge": "필요를 듣는 태도와 대신 책임지는 행동을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "처음의 인상과 다른 반전 매력을 설명한다.",
        "knowledge": "무조건 수용보다 선을 말하는 친절이라는 반전",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:relationships:warm_but_selective_cutoff",
        "auditRef": "source-catalog.json#f5f18f53fded536d5453",
        "sourceKind": "mbti_trait",
        "recordSha256": "18c723e122ea6f08084a0a002c61b2ef92a36d4ac4fb53f186d625f50dd088f4",
        "sourceFileSha256": "c9055cddb9d2d0c159aac0dd8afb54fb218237786ec06ea339b97d29d3147f0c",
        "originalState": {
          "type": "ENFJ",
          "area": "relationships",
          "traitId": "warm_but_selective_cutoff",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:refusal",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "care"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "가능한 도움을 분명하게 제안할 여지",
    "shadow": "따뜻한 사람이 거절하면 배신처럼 해석",
    "factBomb": "좋은 사람이라는 소개가 평생 이용권은 아님",
    "twist": "거절이 분명할수록 가능한 호의는 오래 남을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친한 사람에게 가능한 부탁과 어려운 부탁을 나누는 가상 장면"
    },
    "application": "상대 평가 대신 요청 내용과 자신의 범위를 말함",
    "prerequisites": [
      "ENFJ warm_but_selective_cutoff 원천·실제 요청·본인 경계 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "갈등·관계 단절을 이미 겪은 사실로 쓰지 않음",
    "distinction": "CH06 단점 규정과 달리 친밀도 안의 선택권",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH06 단점 규정과 달리 친밀도 안의 선택권",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P4:invisible-maintenance",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "kind": "mbti",
    "readerQuestion": "처음에 놓칠 수 있는 가치는 무엇인가?",
    "coreMeaning": "티 나지 않는 유지 노동이 드러나는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "실제 근거가 있는 긍정적 특성을 선정한다.",
        "knowledge": "반복되는 일을 이어가는 후보 특성 선정",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "해당 특성이 처음에는 잘 보이지 않는 이유를 설명한다.",
        "knowledge": "유지 노동은 일이 끊기지 않아 눈에 잘 띄지 않을 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "가까운 관계에서 가치가 되는 상황을 보여준다.",
        "knowledge": "함께 준비한 일정에서 누락 가능성을 미리 알리는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "독자가 자신의 숨은 매력을 발견하는 문장으로 마무리한다.",
        "knowledge": "조용한 지속성을 구체적 행동으로 발견",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTJ:identity:verified_order_keeper",
        "auditRef": "source-catalog.json#751ae493400a7e8be818",
        "sourceKind": "mbti_trait",
        "recordSha256": "a92a78cfc6aaf5a88f64cb4ccbcb385a328142ba15e7d08f5e30f9214687e93d",
        "sourceFileSha256": "7265a4245d939ec8b8152c95928c1f21260f7074f6e39468b923e3e1dd01181e",
        "originalState": {
          "type": "ISTJ",
          "area": "identity",
          "traitId": "verified_order_keeper",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "PERSISTENCE",
        "id": "sar:facet:PERSISTENCE:maintenance-effort",
        "definition": "시작 후 필요한 관리를 지속",
        "condition": "담당과 기간이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "steady"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "다른 사람이 준비할 시간을 남길 여지",
    "shadow": "보이지 않는 수고를 알아서 인정받아야 한다고 기대",
    "factBomb": "아무 일도 없었다는 결과 안에 한 수고는 말로 남겨도 됨",
    "twist": "못 맡을 몫을 알리는 것이 믿음을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "정기 모임 준비의 누락과 담당을 공유하는 가상 장면"
    },
    "application": "실제 유지한 일과 부담을 구분해 전함",
    "prerequisites": [
      "ISTJ 실제 원천·본인 수행 확인; 유형만으로 성실함 승인 금지",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "해당 반복 행동이 없으면 숨은 장점으로 부여하지 않음",
    "distinction": "CH05 대표 재능보다 처음 보이지 않는 가치의 가시화",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 대표 재능보다 처음 보이지 않는 가치의 가시화",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P4:soft-precise-request",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "kind": "mbti",
    "readerQuestion": "처음에 놓칠 수 있는 가치는 무엇인가?",
    "coreMeaning": "부드러운 말 안에 자기 요청을 남기는 숨은 가치",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "실제 근거가 있는 긍정적 특성을 선정한다.",
        "knowledge": "맥락을 고려하는 전달 후보 선정",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "해당 특성이 처음에는 잘 보이지 않는 이유를 설명한다.",
        "knowledge": "처음에는 조심스러움으로만 보일 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "가까운 관계에서 가치가 되는 상황을 보여준다.",
        "knowledge": "민감한 의견에서 동의와 요청을 함께 말하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "독자가 자신의 숨은 매력을 발견하는 문장으로 마무리한다.",
        "knowledge": "부드러움도 분명한 합의를 만들 조건을 가진다는 발견",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INFJ:communication:gentle_language",
        "auditRef": "source-catalog.json#fd4fdd85f3ca3bb2693d",
        "sourceKind": "mbti_trait",
        "recordSha256": "77f4503516cc63b6edc064f70008384f7f90d4cff5ad321b7b4450b5b3fb74f1",
        "sourceFileSha256": "598a4ad1d36e3884a7a2db1a56b003cd4553a077f6fae69b0d6037ff8dac1d76",
        "originalState": {
          "type": "INFJ",
          "area": "communication",
          "traitId": "gentle_language",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "mbti:INFJ:communication:firm_refusal_when_decided",
        "auditRef": "source-catalog.json#11b0af8d9f1811491bfc",
        "sourceKind": "mbti_trait",
        "recordSha256": "34ae21e80397b63ceb2cf92f99acac9deee8a7816004b3b6dc352ce1ef66fcec",
        "sourceFileSha256": "598a4ad1d36e3884a7a2db1a56b003cd4553a077f6fae69b0d6037ff8dac1d76",
        "originalState": {
          "type": "INFJ",
          "area": "communication",
          "traitId": "firm_refusal_when_decided",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:contextual-delivery",
        "definition": "맥락과 관계를 고려해 전달",
        "condition": "민감한 피드백의 장소와 수신자 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:renegotiation",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "gentle"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "관계와 선택 기준을 함께 전달할 여지",
    "shadow": "상대 마음을 정확히 안다고 과신",
    "factBomb": "좋은 분위기만 남고 바뀔 일이 없으면 조율이 덜 끝난 것",
    "twist": "짧은 불편 표현이 오래 가는 관계를 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "서로 다른 일정을 차분히 다시 정하는 가상 장면"
    },
    "application": "이미 합의한 점과 조정할 점을 한 가지씩 전함",
    "prerequisites": [
      "실제 INFJ 원천의 기능·본인 소통 방식·조정 가능성 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "원천의 말투 설명만으로 실제 배려 결과·조정 능력을 승인하지 않음",
    "distinction": "추가 현대 적용 검토가 필요한 숨은 가치 후보",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "추가 현대 적용 검토가 필요한 숨은 가치 후보",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P4:useful-small-making",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "kind": "mbti",
    "readerQuestion": "처음에 놓칠 수 있는 가치는 무엇인가?",
    "coreMeaning": "설명보다 작은 실물로 돕는 가치가 보이는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "실제 근거가 있는 긍정적 특성을 선정한다.",
        "knowledge": "실제로 만져 확인하는 선호를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "해당 특성이 처음에는 잘 보이지 않는 이유를 설명한다.",
        "knowledge": "말의 양보다 작동 결과에 있어 첫인상에서 덜 보일 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "가까운 관계에서 가치가 되는 상황을 보여준다.",
        "knowledge": "요청받은 작은 불편을 시험 가능한 형태로 보여주는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "독자가 자신의 숨은 매력을 발견하는 문장으로 마무리한다.",
        "knowledge": "조용한 제작이 함께 이해할 단서를 남길 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTP:study:hands_on_learning",
        "auditRef": "source-catalog.json#d7919e26a177ef70aa67",
        "sourceKind": "mbti_trait",
        "recordSha256": "e0447b375086c01b1bf46ec0e5539289e4495aa5e4c7929fd2aba12657060697",
        "sourceFileSha256": "cd4d9a334a2498ff6ecda1a8e71f36fd57daf948a3b669e0441c9014547d9568",
        "originalState": {
          "type": "ISTP",
          "area": "study",
          "traitId": "hands_on_learning",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CREATION",
        "id": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "PRACTICALITY",
        "id": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "craft"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "설명만으로 다른 부분을 구체화할 여지",
    "shadow": "손재주·수리 기술을 이미 가진 것으로 확정",
    "factBomb": "작은 견본과 검증된 기술 자격은 다른 이야기",
    "twist": "완성품이 아니어도 확인 질문을 만드는 데 가치가 있을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "간단한 배치 견본을 만들어 의견을 듣는 가상 장면"
    },
    "application": "사용자 요구·가능한 시험·안전을 먼저 확인",
    "prerequisites": [
      "해당 실제 학습 trait·경험·요청 확인; 제작 능력은 추가 검증",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "위험한 수리·무자격 업무 권장 금지",
    "distinction": "직업 재능 대신 가까운 관계에서 보일 수 있는 소통 수단",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "직업 재능 대신 가까운 관계에서 보일 수 있는 소통 수단",
    "sourcePolicy": {
      "unknownMbti": "withhold_mbti_and_fusion",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P1:expression-not-mind-reading",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "kind": "natal",
    "readerQuestion": "처음 드러난 행동에서 무엇을 알 수 있는가?",
    "coreMeaning": "표현의 상징과 실제 겉으로 전달한 내용을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH04.P1.S1",
        "originalRole": "타인에게 드러날 수 있는 대표적인 특징을 설명한다.",
        "knowledge": "실제 명리에서 표현의 원천 의미를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P1.S2",
        "originalRole": "그 특징의 근거를 제시한다.",
        "knowledge": "식신·화의 상징은 외향성·인기 검사가 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P1.S3",
        "originalRole": "낯선 사람과 만나는 상황을 예로 든다.",
        "knowledge": "낯선 자리에서 본인이 고른 한 내용을 전하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P1.S4",
        "originalRole": "타인이 받기 쉬운 인상을 조건부로 설명한다.",
        "knowledge": "상대 인상은 답을 들은 범위에서만 조건부 확인",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:shi_shen",
        "auditRef": "source-catalog.json#932b470ec4e3fea0289b",
        "sourceKind": "natal_research",
        "recordSha256": "1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_shi_shen",
              "taxonomy:ten_god_shi_shen"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:element:fire",
        "auditRef": "source-catalog.json#3d331ffd5ef97967d59d",
        "sourceKind": "natal_research",
        "recordSha256": "1db8be16770756a35cbbf4438347f57b1a1c11ea5c72b75e7d4edc85bdb970ef",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.elements"
            ],
            "legacyRefs": [
              "knowledge:element_fire",
              "knowledge:element_fire_missing",
              "taxonomy:element_fire_excess",
              "taxonomy:element_fire_missing"
            ]
          },
          "deferred": [
            "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "deep:ten_god:shi_shen",
        "auditRef": "source-catalog.json#bec7245014c5a12f3f1e",
        "sourceKind": "natal_research",
        "recordSha256": "46429fe865e9a25fb4e332aa37e7709375a33374caa139c3857d3ef233b41ffd",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "뜻을 전할 통로를 선택할 여지",
    "shadow": "표현 상징만으로 주목받는 사람이라고 단정",
    "factBomb": "사주가 타인의 첫 생각을 읽어 주지는 않음",
    "twist": "짧은 표현도 수신 확인이 있으면 충분할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "처음 소개에서 기억할 내용 하나를 고르는 가상 장면"
    },
    "application": "표현 내용·대상·이해된 뜻을 구분",
    "prerequisites": [
      "실제 원국·표현 행동·공개 동의·상대의 답 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·외향성·타인 호감·실제 행동을 생성하지 않음",
    "distinction": "MBTI 없는 경우에도 상징과 관찰의 경계를 유지하는 첫인상 질문",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "MBTI 없는 경우에도 상징과 관찰의 경계를 유지하는 첫인상 질문",
    "sourcePolicy": {
      "unknownMbti": "natal_only_if_actual_evidence",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P2:private-reading-window",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "kind": "natal",
    "readerQuestion": "혼자 정리할 때 어떤 여건이 필요한가?",
    "coreMeaning": "화개·편인의 사적 탐색 상징을 혼자 정리할 여건으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH04.P2.S1",
        "originalRole": "혼자 있을 때 두드러질 수 있는 성향을 소개한다.",
        "knowledge": "실제 원국에서 사적 탐색 의미가 확인될 때 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P2.S2",
        "originalRole": "사고·감정·회복 방식의 근거를 제시한다.",
        "knowledge": "전통 상징과 실제 회복·감정 상태를 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P2.S3",
        "originalRole": "바깥에서의 모습과 다른 부분을 설명한다.",
        "knowledge": "공동 선택 뒤 이유를 혼자 살피고 싶은지 본인에게 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P2.S4",
        "originalRole": "쉽게 드러나지 않는 내면의 욕구를 해석한다.",
        "knowledge": "숨은 내면을 단정하지 않고 필요한 환경을 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:hwagae",
        "auditRef": "source-catalog.json#ee15600a801db03b49d2",
        "sourceKind": "natal_research",
        "recordSha256": "401eedba03ea2b79fd316c6ccc4f9fe3ee06bd34b80ec968efb13778cda3d319",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SHINSAL_RULES:HWAGAE",
              "SHINSAL_RULES:TWELVE_HWAGAE"
            ],
            "legacyRefs": [
              "knowledge:sinsal_hwagae",
              "taxonomy:twelve_sinsal_hwagae",
              "shinsal:HWAGAE",
              "shinsal:TWELVE_HWAGAE"
            ]
          },
          "deferred": [
            "현대 생활 적용의 경험과학 근거는 없다. 전통 상징과 조건부 편집 예시를 구분한다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "신살만으로 성과·재물·결혼·불륜·사고·건강·사망을 단정하는 용도.",
            "한 항목의 별칭이나 십이신살 중복을 독립된 근거 수로 부풀리는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:ten_god:pian_yin",
        "auditRef": "source-catalog.json#ffdda10bdd6ed8f95e03",
        "sourceKind": "natal_research",
        "recordSha256": "8576a3bbd78f37bde19bbf118910500e4498d448ec6a7ffc4432dfba0387858a",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "repository_only",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_pian_yin",
              "taxonomy:ten_god_pian_yin"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
            "정인·편인의 세부 명명과 도식/효신 조건은 경고 없는 독립 판본 대조 전 보류한다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "deep:ten_god:pian_yin",
        "auditRef": "source-catalog.json#c0e12c203231cd2b2018",
        "sourceKind": "natal_research",
        "recordSha256": "a6d3747f2872f90db9a5075fea446471d0f665fa58ef3d4fb57af24132720b90",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "ENERGY_DIRECTION",
        "id": "sar:facet:ENERGY_DIRECTION:private-processing",
        "definition": "생각을 먼저 사적으로 정리",
        "condition": "혼자 정리할 접근성과 응답 기한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "quiet"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "혼자 검토한 뜻을 다시 나눌 가능성",
    "shadow": "화개가 있으니 외롭고 고독하다고 해석",
    "factBomb": "혼자 있는 상징을 혼자인 삶의 증거로 쓰지 않음",
    "twist": "사적 정리가 다음 대화를 더 정확하게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "혼자 확인할 내용과 다시 답할 시점을 적는 가상 장면"
    },
    "application": "사적 정리의 필요·접근성·응답 시점을 확인",
    "prerequisites": [
      "실제 화개·편인·원국 조건·본인 선호 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "고립·우울·외로움·비밀 욕구·MBTI 추정 금지",
    "distinction": "명리 단독에서도 내면을 읽었다고 확정하지 않는 응용",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리 단독에서도 내면을 읽었다고 확정하지 않는 응용",
    "sourcePolicy": {
      "unknownMbti": "natal_only_if_actual_evidence",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P3:chosen-disclosure-with-trust",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "kind": "natal",
    "readerQuestion": "가까워지면 어떤 표현 선택이 달라질 수 있는가?",
    "coreMeaning": "자기 선택·표현 상징을 공개 범위의 변화로 검토",
    "roleContributions": {
      "S1": {
        "address": "CH04.P3.S1",
        "originalRole": "친밀한 관계에서 달라지는 행동을 설명한다.",
        "knowledge": "가까워져도 무엇을 나눌지는 본인이 고르는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P3.S2",
        "originalRole": "변화가 나타나는 조건을 제시한다.",
        "knowledge": "실제 원국 의미와 신뢰가 확인된 상황을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P3.S3",
        "originalRole": "긍정적인 변화와 어려운 변화를 구분한다.",
        "knowledge": "함께하는 시간이 늘어도 사적 경계를 유지할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P3.S4",
        "originalRole": "처음의 인상과 다른 반전 매력을 설명한다.",
        "knowledge": "공개 동의를 정할 때 표현이 편해질 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:bijian",
        "auditRef": "source-catalog.json#8cdde1a4757cf212c98f",
        "sourceKind": "natal_research",
        "recordSha256": "bdcbc44a5a262791cabcfd3165daad55831189de4069200af638a4dedf667e6e",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "repository_only",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_bijian",
              "taxonomy:ten_god_bijian"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:ten_god:shi_shen",
        "auditRef": "source-catalog.json#932b470ec4e3fea0289b",
        "sourceKind": "natal_research",
        "recordSha256": "1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_shi_shen",
              "taxonomy:ten_god_shi_shen"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "deep:ten_god:bijian",
        "auditRef": "source-catalog.json#abf6275af0339069f986",
        "sourceKind": "natal_research",
        "recordSha256": "840c6e6862018b7d5d8a960286c802edb2b4bd6caf5fb9b09164cff7cd8b3bc4",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      },
      {
        "sourceId": "deep:ten_god:shi_shen",
        "auditRef": "source-catalog.json#bec7245014c5a12f3f1e",
        "sourceKind": "natal_research",
        "recordSha256": "46429fe865e9a25fb4e332aa37e7709375a33374caa139c3857d3ef233b41ffd",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "condition": "공개 동의를 별도로 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "self"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "친밀도와 자기 선택을 같이 존중할 여지",
    "shadow": "가까우면 숨김없이 다 말해야 한다고 기대",
    "factBomb": "친밀함이 개인정보 전체의 열쇠는 아님",
    "twist": "말하지 않을 부분을 정해야 나눌 부분이 편해질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람에게 공유할 관심사와 사적 내용을 나누는 가상 장면"
    },
    "application": "본인 뜻·상대 참여·공개 범위를 확인",
    "prerequisites": [
      "실제 비견·식신·원국 조건·관계 맥락 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 친밀도·교제·과거 경험을 임의로 가정하지 않음",
    "distinction": "MBTI 비교 없이도 공개 선택의 질문을 제공",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:bijian의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "MBTI 비교 없이도 공개 선택의 질문을 제공",
    "sourcePolicy": {
      "unknownMbti": "natal_only_if_actual_evidence",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  },
  {
    "id": "cpr:material:CH04.P4:small-output-shows-value",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "kind": "natal",
    "readerQuestion": "처음에 놓칠 수 있는 가치는 무엇인가?",
    "coreMeaning": "말로 드러나지 않은 산출의 쓰임을 확인하는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH04.P4.S1",
        "originalRole": "실제 근거가 있는 긍정적 특성을 선정한다.",
        "knowledge": "원국의 실제 산출·유지 의미를 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH04.P4.S2",
        "originalRole": "해당 특성이 처음에는 잘 보이지 않는 이유를 설명한다.",
        "knowledge": "처음의 인상만으로 실제 결과를 알기 어려울 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH04.P4.S3",
        "originalRole": "가까운 관계에서 가치가 되는 상황을 보여준다.",
        "knowledge": "함께 쓸 작은 결과물을 보여주는 상황에서 가치 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH04.P4.S4",
        "originalRole": "독자가 자신의 숨은 매력을 발견하는 문장으로 마무리한다.",
        "knowledge": "확인된 쓰임이 있다면 숨은 장점의 후보로 검토",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:shi_shen",
        "auditRef": "source-catalog.json#932b470ec4e3fea0289b",
        "sourceKind": "natal_research",
        "recordSha256": "1faa86777dc89387411c777e0e864ce790e9f1b93e396007037b4aba2ce9249a",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.tenGods",
              "getTenGod"
            ],
            "legacyRefs": [
              "knowledge:ten_god_shi_shen",
              "taxonomy:ten_god_shi_shen"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:element:earth",
        "auditRef": "source-catalog.json#cff3fd7e8d3e2d820696",
        "sourceKind": "natal_research",
        "recordSha256": "4176162604027ef25519a9c912c418714265e3d913c70e4d6f015e549c2db5fc",
        "sourceFileSha256": "dc07e71f187bb49dc4b1cd43bd7b93f244444791d24682140f208eacd89c63c2",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": "source_checked",
          "support": {
            "calculation": "native",
            "calculationRefs": [
              "SajuCalcResult.elements"
            ],
            "legacyRefs": [
              "knowledge:element_earth",
              "knowledge:element_earth_excess",
              "taxonomy:element_earth_excess",
              "taxonomy:element_earth_missing"
            ]
          },
          "deferred": [
            "삶의 영역별 전통 해석은 각 문헌의 적용 조건과 다른 판본 대조 후 추가 검토한다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "단일 항목으로 성공·수익·결혼·출산·질병·사망을 단정하는 용도.",
            "입력되지 않은 실제 경험·가족 사정·직업·감정을 사실로 만드는 용도."
          ]
        }
      },
      {
        "sourceId": "deep:ten_god:shi_shen",
        "auditRef": "source-catalog.json#bec7245014c5a12f3f1e",
        "sourceKind": "natal_research",
        "recordSha256": "46429fe865e9a25fb4e332aa37e7709375a33374caa139c3857d3ef233b41ffd",
        "sourceFileSha256": "591db09e4fee5047f7afbc40719874b760fe75d4f3b1ac0296cab1a86b4e02b4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": null,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": null,
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "PRACTICALITY",
        "id": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "craft"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "설명보다 구체적 사용으로 뜻을 전할 여지",
    "shadow": "실제 제작 능력을 상징만으로 부여",
    "factBomb": "조용한 사람이라 손재주가 있다는 결론을 만들지 않음",
    "twist": "작은 결과가 말의 양보다 잘 전달될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "함께 고른 안내물의 사용 가능성을 묻는 가상 장면"
    },
    "application": "실제 산출·수신 요구·사용 반응을 확인",
    "prerequisites": [
      "실제 원국·산출 경험·안전·공유 동의 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "미경험 능력·타인 감탄·인기·성공을 생성 금지",
    "distinction": "겉으로 보이는 말과 실제 전달물의 차이라는 명리 단독 응용",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "겉으로 보이는 말과 실제 전달물의 차이라는 명리 단독 응용",
    "sourcePolicy": {
      "unknownMbti": "natal_only_if_actual_evidence",
      "unknownBirthTime": "no_synthetic_hour_recheck_prerequisites",
      "futurePrediction": false,
      "pairAsIndividual": false,
      "independentDerivedFacts": 0,
      "currentUserFactsKnown": false
    },
    "exclusions": [
      "미입력 직업·수입·가족 구성·교제·과거 사건을 개인 사실로 만들지 않는다.",
      "기간 근거를 타고난 성격으로, Pair 자료를 한 개인의 사실로 전환하지 않는다.",
      "sourceCoverage direct/inferred와 원천 수록을 실증 검증·개인 적합 승인으로 승격하지 않는다."
    ],
    "review": "conditional_editorial_research"
  }
];
