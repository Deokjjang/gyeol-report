/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH12_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH12.P1:open-a-voluntary-meeting",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P1",
    "address": "CH12.P1",
    "kind": "mbti",
    "readerQuestion": "자발적인 우정에서 어떤 참여를 제안하는가?",
    "coreMeaning": "새로운 만남의 소재와 참여 선택을 함께 건네는 우정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH12.P1.S1",
        "originalRole": "친구 관계에서 드러날 수 있는 대표적 성향을 소개한다.",
        "knowledge": "공유할 이야기와 활동을 제안하는 성향 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P1.S2",
        "originalRole": "그 성향의 근거를 설명한다.",
        "knowledge": "ENFP wide_light_network 원천의 관계 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P1.S3",
        "originalRole": "실제 대화와 행동의 특징을 묘사한다.",
        "knowledge": "친구가 선택할 일정·활동을 질문하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P1.S4",
        "originalRole": "주변에 줄 수 있는 인상을 조건부로 설명한다.",
        "knowledge": "편안한 제안 또는 빠른 확장으로 보일 가능성을 조건부 제시",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFP:relationships:wide_light_network",
        "auditRef": "source-catalog.json#580e60e5a7233997dbbb",
        "sourceKind": "mbti_trait",
        "recordSha256": "c06ad27341da69b15a2107b24f3f392afef635ad6aeca6f7966479442e5d1cbc",
        "sourceFileSha256": "552bfacdcd738eadf3685881993df971fe1734ad08d070a9220b70a7f4c3c801",
        "originalState": {
          "type": "ENFP",
          "area": "relationships",
          "traitId": "wide_light_network",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "INITIATIVE",
        "id": "sar:facet:INITIATIVE:opening-proposal",
        "definition": "멈춘 상황에 첫 선택지를 제시",
        "condition": "제안과 실행 권한을 분리",
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
        "chance"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "만나고 싶은 뜻을 실제 선택지로 만들 여지",
    "shadow": "새 모임의 숫자로 친밀함을 판단",
    "factBomb": "약속이 많아도 서로 들은 이야기는 따로 남음",
    "twist": "작은 일대일 만남이 넓은 모임보다 관계를 깊게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "전시나 산책을 제안하며 거절 여지를 남기는 가상 장면"
    },
    "application": "같이할 이유·가능한 일정·선택 가능한 답을 제시",
    "prerequisites": [
      "실제 관계 원천·본인 참여 방식·친구의 자발적 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구 수·인기·실제 만남 이력을 유형에서 부여 금지",
    "distinction": "CH04 낯선 첫인상에서 자발적 우정의 참여로 이동",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 낯선 첫인상에서 자발적 우정의 참여로 이동",
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
    "id": "cpr:material:CH12.P1:reliable-invitation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P1",
    "address": "CH12.P1",
    "kind": "mbti",
    "readerQuestion": "자발적인 우정에서 어떤 참여를 제안하는가?",
    "coreMeaning": "정한 만남을 이어가는 우정의 예측 가능성 후보",
    "roleContributions": {
      "S1": {
        "address": "CH12.P1.S1",
        "originalRole": "친구 관계에서 드러날 수 있는 대표적 성향을 소개한다.",
        "knowledge": "약속의 범위와 시간을 분명히 하는 성향 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P1.S2",
        "originalRole": "그 성향의 근거를 설명한다.",
        "knowledge": "실제 ISTJ relationships 원천의 해당 의미 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P1.S3",
        "originalRole": "실제 대화와 행동의 특징을 묘사한다.",
        "knowledge": "만나기로 한 일정과 변경할 가능성을 미리 알리는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P1.S4",
        "originalRole": "주변에 줄 수 있는 인상을 조건부로 설명한다.",
        "knowledge": "믿음직함 또는 경직됨으로 보일 가능성을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTJ:relationships:few_but_stable_bonds",
        "auditRef": "source-catalog.json#3fafff5e693a2a83dddb",
        "sourceKind": "mbti_trait",
        "recordSha256": "f73eb6b94f509aa6a07aa3d1ec9dc857e5248faba005205e54d863f066e968f1",
        "sourceFileSha256": "7265a4245d939ec8b8152c95928c1f21260f7074f6e39468b923e3e1dd01181e",
        "originalState": {
          "type": "ISTJ",
          "area": "relationships",
          "traitId": "few_but_stable_bonds",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "condition": "실제 관계와 생활 제약이 주어진 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "steady"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "친구가 자기 일정과 함께 준비할 여지",
    "shadow": "같은 연락 주기를 지켜야 우정이라고 생각",
    "factBomb": "친구 사이의 약속에도 서로 다른 생활이 들어옴",
    "twist": "미리 변경을 알리면 오래된 방식이 달라도 이어갈 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 날짜를 바꿀 때 다음 가능한 답을 남기는 가상 장면"
    },
    "application": "실제 약속·변경 사유의 공개 범위·다음 선택을 확인",
    "prerequisites": [
      "실제 trait·본인 약속 행동·친구의 가능한 속도 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "연락 횟수로 신뢰·애정을 확정 금지",
    "distinction": "CH11 공동 의무와 다른 선택적 만남의 약속",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 공동 의무와 다른 선택적 만남의 약속",
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
    "id": "cpr:material:CH12.P1:curious-listener",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P1",
    "address": "CH12.P1",
    "kind": "mbti",
    "readerQuestion": "자발적인 우정에서 어떤 참여를 제안하는가?",
    "coreMeaning": "잘난 답보다 함께 생각을 듣는 관계 후보",
    "roleContributions": {
      "S1": {
        "address": "CH12.P1.S1",
        "originalRole": "친구 관계에서 드러날 수 있는 대표적 성향을 소개한다.",
        "knowledge": "모르는 것을 편하게 말할 수 있는 대화를 선호하는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P1.S2",
        "originalRole": "그 성향의 근거를 설명한다.",
        "knowledge": "INTP respect_for_listening_mind 원천을 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P1.S3",
        "originalRole": "실제 대화와 행동의 특징을 묘사한다.",
        "knowledge": "친구의 관심사에 이유를 묻고 다른 관점을 듣는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P1.S4",
        "originalRole": "주변에 줄 수 있는 인상을 조건부로 설명한다.",
        "knowledge": "깊은 관심 또는 질문 압박으로 보일 가능성을 함께 둠",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:relationships:respect_for_listening_mind",
        "auditRef": "source-catalog.json#9a67a19dffd6030af049",
        "sourceKind": "mbti_trait",
        "recordSha256": "fa39ae35ddbdee96ce319bf0cb4337333ffc550b993921e8cd4b724ea3cb1d88",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "relationships",
          "traitId": "respect_for_listening_mind",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
        "notIndependentEvidence": true
      },
      {
        "axis": "CURIOSITY",
        "id": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "research"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "겉으로 다른 취향의 이유를 알 여지",
    "shadow": "좋은 질문에 좋은 답을 해야 친한 사람이라고 기대",
    "factBomb": "친구의 이야기는 설명 실력 시험이 아님",
    "twist": "답 없는 이야기도 함께 듣는 시간이 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구의 새 관심사에서 어떤 점이 재미있는지 묻는 가상 장면"
    },
    "application": "질문의 동의·듣고 싶은 범위·그냥 나눌 이야기를 확인",
    "prerequisites": [
      "실제 원천·친구와의 대화 방식·상호 참여 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구의 지능·가치관·유형을 추정하지 않음",
    "distinction": "연애의 호감 기준과 다른 자발적인 지적 교류",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "연애의 호감 기준과 다른 자발적인 지적 교류",
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
    "id": "cpr:material:CH12.P2:space-with-respect",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P2",
    "address": "CH12.P2",
    "kind": "mbti",
    "readerQuestion": "친구가 선택할 여지를 남기며 무엇을 나눌 수 있는가?",
    "coreMeaning": "각자 다른 취향을 유지해도 이어갈 수 있는 우정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH12.P2.S1",
        "originalRole": "관계에서 강점으로 작동하는 특징을 선정한다.",
        "knowledge": "같은 것을 모두 좋아하지 않아도 존중하는 기능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P2.S2",
        "originalRole": "관련 근거를 제시한다.",
        "knowledge": "INTJ selective_friendship의 원천은 실제 친구의 질 평가가 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P2.S3",
        "originalRole": "실제 관계에서 나타나는 장점을 설명한다.",
        "knowledge": "함께할 활동과 각자 할 활동을 나누는 장점 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P2.S4",
        "originalRole": "좋은 관계를 만드는 조건을 제시한다.",
        "knowledge": "서로의 거절이 우정의 부정으로 읽히지 않을 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTJ:relationships:selective_friendship",
        "auditRef": "source-catalog.json#05f2d1edfe1991f60079",
        "sourceKind": "mbti_trait",
        "recordSha256": "0a113bb165fb54de1ea72840bd81387563f77c529e2d198e5e3ceb2c0fe1363a",
        "sourceFileSha256": "f5a9b70f194d7ea3de825ba3c7aab2e1f8837b92a92b1dee4a92e8f3a6a5216a",
        "originalState": {
          "type": "INTJ",
          "area": "relationships",
          "traitId": "selective_friendship",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
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
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:private-space",
        "definition": "공동 관계 안의 사적 영역을 유지",
        "condition": "공동 책임과 사적 권한을 구분",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "self"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "독립적인 선택을 남기며 가까워질 여지",
    "shadow": "기준이 다른 사람은 관계 가치도 낮다고 생각",
    "factBomb": "친한 사람과 같은 선택을 해야 할 의무는 없음",
    "twist": "다른 선택을 편하게 말할 수 있어야 오래 나눌 주제가 남을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구와 좋아하는 활동의 겹치는 부분만 고르는 가상 장면"
    },
    "application": "각자의 이유·함께할 부분·거절 가능한 답을 확인",
    "prerequisites": [
      "실제 관계 trait·본인 선호·친구의 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대의 가치·지능·적합성을 유형으로 판정 금지",
    "distinction": "가족 역할에서 벗어난 자율적 우정의 범위",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "가족 역할에서 벗어난 자율적 우정의 범위",
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
    "id": "cpr:material:CH12.P2:remember-and-check",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P2",
    "address": "CH12.P2",
    "kind": "mbti",
    "readerQuestion": "친구가 선택할 여지를 남기며 무엇을 나눌 수 있는가?",
    "coreMeaning": "기억한 관심사를 현재의 뜻과 다시 맞추는 우정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH12.P2.S1",
        "originalRole": "관계에서 강점으로 작동하는 특징을 선정한다.",
        "knowledge": "상대 이야기를 기억하고 안부를 묻는 기능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P2.S2",
        "originalRole": "관련 근거를 제시한다.",
        "knowledge": "실제 ISFJ 관계 원천과 본인 행동을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P2.S3",
        "originalRole": "실제 관계에서 나타나는 장점을 설명한다.",
        "knowledge": "지난 관심사의 소식을 건네며 지금도 좋아하는지 묻는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P2.S4",
        "originalRole": "좋은 관계를 만드는 조건을 제시한다.",
        "knowledge": "기억이 현재의 선택을 대신하지 않을 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:relationships:hard_to_enter_reliable_once_in",
        "auditRef": "source-catalog.json#8ea0c96ce718cdbee685",
        "sourceKind": "mbti_trait",
        "recordSha256": "2d56cfbede1a040db6c45c75d5f7c6803dbe9547d1b171de97cba18323627792",
        "sourceFileSha256": "a9bc9fc83017d0b624f896f3765574c6758819fa5b499e257cf67f8f76b2f6e9",
        "originalState": {
          "type": "ISFJ",
          "area": "relationships",
          "traitId": "hard_to_enter_reliable_once_in",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
        "care"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "지속적인 관심을 부담 적게 전할 여지",
    "shadow": "예전에 좋아했으니 지금도 같다고 생각",
    "factBomb": "오래 안다는 말이 업데이트를 면제하지는 않음",
    "twist": "바뀐 취향을 묻는 것이 오래된 기억을 더 잘 쓰는 방법",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구가 이야기한 활동의 근황을 묻는 가상 장면"
    },
    "application": "기억한 사실·현재 관심·공개하고 싶은 범위를 확인",
    "prerequisites": [
      "실제 trait·기억한 정보·친구의 자발적 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구가 힘든 일을 겪었다거나 사생활을 이미 안다고 가정 금지",
    "distinction": "CH11 돌봄 노동보다 선택 가능한 안부의 지속",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 돌봄 노동보다 선택 가능한 안부의 지속",
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
    "id": "cpr:material:CH12.P2:shared-making-not-performance",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P2",
    "address": "CH12.P2",
    "kind": "mbti",
    "readerQuestion": "친구가 선택할 여지를 남기며 무엇을 나눌 수 있는가?",
    "coreMeaning": "함께 만들어 보는 과정이 우정의 소재가 될 조건",
    "roleContributions": {
      "S1": {
        "address": "CH12.P2.S1",
        "originalRole": "관계에서 강점으로 작동하는 특징을 선정한다.",
        "knowledge": "관점·아이디어를 교환하는 장점 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P2.S2",
        "originalRole": "관련 근거를 제시한다.",
        "knowledge": "창의적 연결 원천과 경청 관계 원천의 역할을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P2.S3",
        "originalRole": "실제 관계에서 나타나는 장점을 설명한다.",
        "knowledge": "작은 모임 준비를 함께 고르며 서로의 생각을 반영",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P2.S4",
        "originalRole": "좋은 관계를 만드는 조건을 제시한다.",
        "knowledge": "멋진 결과보다 함께 선택할 권한이 남을 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:strengths:creative_intelligence",
        "auditRef": "source-catalog.json#2efaea4433078768f5d3",
        "sourceKind": "mbti_trait",
        "recordSha256": "ac2c18ba7af5e3f23b6dcada7caffa63681564bfbed45585ed13822e71747bdd",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "strengths",
          "traitId": "creative_intelligence",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "mbti:INTP:relationships:respect_for_listening_mind",
        "auditRef": "source-catalog.json#9a67a19dffd6030af049",
        "sourceKind": "mbti_trait",
        "recordSha256": "fa39ae35ddbdee96ce319bf0cb4337333ffc550b993921e8cd4b724ea3cb1d88",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "relationships",
          "traitId": "respect_for_listening_mind",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "취향이 다른 사람과 공유할 과정을 만들 여지",
    "shadow": "함께하는 활동도 본인의 완성도 기준으로 운영",
    "factBomb": "친구와 만든 결과가 포트폴리오 심사대에 올라갈 필요는 없음",
    "twist": "미완성의 웃음도 공유할 경험이 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "각자가 고를 한 부분을 남겨 공동 활동을 준비하는 가상 장면"
    },
    "application": "활동 목적·참여·비용·그만둘 선택을 합의",
    "prerequisites": [
      "실제 개인 원천·친구의 참여·공유 과제 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "제작 능력·친밀도·친구의 만족을 원천에서 확정 금지",
    "distinction": "CH05 제작 재능보다 함께 선택한 경험의 가치",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 제작 재능보다 함께 선택한 경험의 가치",
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
    "id": "cpr:material:CH12.P3:repair-not-correct-person",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P3",
    "address": "CH12.P3",
    "kind": "mbti",
    "readerQuestion": "우정에서 내 좋은 뜻이 어디서 어긋날 수 있는가?",
    "coreMeaning": "친구의 고민에 교정부터 나가 오해가 생길 조건",
    "roleContributions": {
      "S1": {
        "address": "CH12.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 단점을 설명한다.",
        "knowledge": "정확한 답이 먼저 나오는 위험 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P3.S2",
        "originalRole": "그 원인을 설명한다.",
        "knowledge": "직접적 표현 원천과 실제 대화의 목적을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P3.S3",
        "originalRole": "오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "친구는 듣기를 원했는데 해결책이 계속 나오는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P3.S4",
        "originalRole": "그 문제를 줄이는 방법을 제시한다.",
        "knowledge": "어떤 도움을 원하는지 묻고 의견의 범위를 좁히는 방법",
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
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
    "positive": "필요할 때 명확한 조언을 줄 여지",
    "shadow": "좋은 답이면 상대도 받아야 한다고 기대",
    "factBomb": "우정의 대화에는 정답보다 요청의 종류가 먼저일 수 있음",
    "twist": "묻고 잠시 멈추면 필요한 조언이 더 잘 닿을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구의 고민에 듣기와 의견 중 원하는 것을 묻는 가상 장면"
    },
    "application": "요청·내 의견·상대 선택을 구분",
    "prerequisites": [
      "실제 trait·상대의 요청·본인 전달 방식 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구가 상처받거나 관계가 틀어졌다고 사실화 금지",
    "distinction": "CH06 전반적 교정 과용에서 우정의 대화 목적을 새로 다룸",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH06 전반적 교정 과용에서 우정의 대화 목적을 새로 다룸",
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
    "id": "cpr:material:CH12.P3:invite-without-oversubscription",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P3",
    "address": "CH12.P3",
    "kind": "mbti",
    "readerQuestion": "우정에서 내 좋은 뜻이 어디서 어긋날 수 있는가?",
    "coreMeaning": "새 만남 제안과 기존 약속을 함께 유지할 조건",
    "roleContributions": {
      "S1": {
        "address": "CH12.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 단점을 설명한다.",
        "knowledge": "관계 확장이 일정의 여력을 넘을 수 있는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P3.S2",
        "originalRole": "그 원인을 설명한다.",
        "knowledge": "넓은 교류 원천은 실제 약속 위반 증명이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P3.S3",
        "originalRole": "오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "여러 모임에 관심을 보이다 가능한 시간을 늦게 확인하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P3.S4",
        "originalRole": "그 문제를 줄이는 방법을 제시한다.",
        "knowledge": "가능한 일정과 참여 뜻을 구분해 답하는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFP:relationships:wide_light_network",
        "auditRef": "source-catalog.json#580e60e5a7233997dbbb",
        "sourceKind": "mbti_trait",
        "recordSha256": "c06ad27341da69b15a2107b24f3f392afef635ad6aeca6f7966479442e5d1cbc",
        "sourceFileSha256": "552bfacdcd738eadf3685881993df971fe1734ad08d070a9220b70a7f4c3c801",
        "originalState": {
          "type": "ENFP",
          "area": "relationships",
          "traitId": "wide_light_network",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "EXPANSION",
        "id": "sar:facet:EXPANSION:capacity-check",
        "definition": "확대 전에 운영 여력을 점검",
        "condition": "실제 운영 비용과 담당이 주어질 때",
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
        "chance"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "새 연결과 오래된 관계를 함께 살필 여지",
    "shadow": "흥미를 보였으니 참여 약속도 한 것처럼 말함",
    "factBomb": "좋아 보인다는 답과 갈 수 있다는 답은 다름",
    "twist": "이번 약속을 줄이면 오래된 친구의 이야기를 더 들을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 제안에 현재 일정 확인 뒤 답하는 가상 장면"
    },
    "application": "관심·가능 시간·확정 답·변경 알림을 구분",
    "prerequisites": [
      "실제 trait·일정·본인 행동·친구의 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "약속을 어긴 과거 경험·친구의 실망을 만들어내지 않음",
    "distinction": "친구 영역의 확장 비용을 실제 참여 기준으로 좁힘",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "친구 영역의 확장 비용을 실제 참여 기준으로 좁힘",
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
    "id": "cpr:material:CH12.P3:quiet-without-disappearance",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P3",
    "address": "CH12.P3",
    "kind": "mbti",
    "readerQuestion": "우정에서 내 좋은 뜻이 어디서 어긋날 수 있는가?",
    "coreMeaning": "연락 필요가 적어도 관계의 뜻을 알릴 방법",
    "roleContributions": {
      "S1": {
        "address": "CH12.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 단점을 설명한다.",
        "knowledge": "자기 시간을 지키며 응답을 미루는 위험 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P3.S2",
        "originalRole": "그 원인을 설명한다.",
        "knowledge": "낮은 교류 필요 원천을 실제 외로움·관계 단절과 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P3.S3",
        "originalRole": "오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "답할 생각은 있었지만 친구가 가능한 시점을 모르는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P3.S4",
        "originalRole": "그 문제를 줄이는 방법을 제시한다.",
        "knowledge": "다시 응답할 범위를 알려 추측을 줄이는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:relationships:low_need_for_human_ties",
        "auditRef": "source-catalog.json#0711f7a4ebe38057e4e1",
        "sourceKind": "mbti_trait",
        "recordSha256": "6486a235e1eec8a9ea0973db228a8f96b07296f6acce030ad39323c4ce035be2",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "relationships",
          "traitId": "low_need_for_human_ties",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "condition": "실제 관계와 생활 제약이 주어진 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
    "positive": "적은 연락 속에서도 관계의 뜻을 전할 여지",
    "shadow": "친한 사이면 침묵도 알아서 이해해야 한다고 기대",
    "factBomb": "답을 생각한 것과 답을 보낸 것은 친구에게 다른 정보",
    "twist": "짧은 신호가 긴 근황보다 관계를 편하게 만들 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "연락을 받은 뒤 다시 답할 시간을 알려 주는 가상 장면"
    },
    "application": "연락 의무를 늘리기보다 가능한 응답 방식을 합의",
    "prerequisites": [
      "실제 trait·연락 선호·친구의 상황·본인 뜻 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "고립·외로움·우정 실패를 유형으로 진단 금지",
    "distinction": "CH10 친밀감의 방향과 다른 자율적 우정 유지 정보",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH10 친밀감의 방향과 다른 자율적 우정 유지 정보",
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
    "id": "cpr:material:CH12.P4:questions-without-tests",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P4",
    "address": "CH12.P4",
    "kind": "recall",
    "readerQuestion": "나와 다르면서도 편할 관계는 어떤 조건인가?",
    "coreMeaning": "모르는 것을 편하게 말할 수 있는 우정의 조건",
    "roleContributions": {
      "S1": {
        "address": "CH12.P4.S1",
        "originalRole": "편안하게 느낄 수 있는 사람의 특징을 설명한다.",
        "knowledge": "앞선 실제 도입된 호기심·교류 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P4.S2",
        "originalRole": "해당 조건의 근거를 제시한다.",
        "knowledge": "답을 경쟁시키지 않고 관심을 나눌 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P4.S3",
        "originalRole": "상호 존중과 관계 유지에 필요한 행동을 설명한다.",
        "knowledge": "번갈아 질문하고 함께할 활동을 선택하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P4.S4",
        "originalRole": "관계의 긍정적인 가능성으로 마무리한다.",
        "knowledge": "다른 생각을 가진 사람과도 나눌 것이 남을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "CURIOSITY",
        "id": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
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
        "research"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "우정의 편안함과 지적 관심을 함께 지킬 여지",
    "shadow": "잘 맞는 유형이어야 편하다고 판단",
    "factBomb": "친구의 MBTI를 몰라도 들은 뜻은 확인할 수 있음",
    "twist": "같은 답보다 다른 질문을 존중하는 것이 관계를 넓힐 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "서로 관심 있는 주제를 하나씩 나누는 가상 장면"
    },
    "application": "모름·거절·다른 취향을 말할 여지를 남김",
    "prerequisites": [
      "앞선 의미·실제 상호 관심·참여·동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가상의 상대 유형·궁합·인지 능력을 생성 금지",
    "distinction": "유형 맞춤 친구 추천 대신 상호 행동의 조건",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH12.P1:curious-listener",
      "cpr:material:CH12.P2:shared-making-not-performance"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "유형 맞춤 친구 추천 대신 상호 행동의 조건",
    "sourcePolicy": {
      "unknownMbti": "follow_antecedent_availability",
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
    "id": "cpr:material:CH12.P4:contact-not-counter",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P4",
    "address": "CH12.P4",
    "kind": "recall",
    "readerQuestion": "나와 다르면서도 편할 관계는 어떤 조건인가?",
    "coreMeaning": "같은 연락 횟수보다 서로 가능한 유지 방식",
    "roleContributions": {
      "S1": {
        "address": "CH12.P4.S1",
        "originalRole": "편안하게 느낄 수 있는 사람의 특징을 설명한다.",
        "knowledge": "앞선 실제 도입된 약속·응답 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P4.S2",
        "originalRole": "해당 조건의 근거를 제시한다.",
        "knowledge": "바뀐 생활과 응답 여건이 다를 수 있다는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P4.S3",
        "originalRole": "상호 존중과 관계 유지에 필요한 행동을 설명한다.",
        "knowledge": "가능한 속도·변경 신호·만날 방식을 함께 고름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P4.S4",
        "originalRole": "관계의 긍정적인 가능성으로 마무리한다.",
        "knowledge": "형식이 달라도 우정을 이어갈 여지",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "condition": "실제 관계와 생활 제약이 주어진 때",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "연락의 양보다 뜻을 명확히 할 가능성",
    "shadow": "같은 횟수로 연락해야 공평하다고 생각",
    "factBomb": "우정의 장부에는 모든 답의 횟수를 적을 필요는 없음",
    "twist": "짧은 안부가 긴 만남의 공백을 설명할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "바쁜 기간의 가능한 연락 방식을 함께 정하는 가상 장면"
    },
    "application": "실제 여건·선호·서로의 선택을 확인",
    "prerequisites": [
      "앞선 의미·자발적 관계·양측 가능한 참여 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "친구의 성실성·호감·관계 지속을 횟수로 판정 금지",
    "distinction": "가족의 담당과 다른 우정의 자율적 지속",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH12.P1:reliable-invitation",
      "cpr:material:CH12.P3:quiet-without-disappearance"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "가족의 담당과 다른 우정의 자율적 지속",
    "sourcePolicy": {
      "unknownMbti": "follow_antecedent_availability",
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
    "id": "cpr:material:CH12.P4:choice-with-a-warm-no",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P4",
    "address": "CH12.P4",
    "kind": "recall",
    "readerQuestion": "나와 다르면서도 편할 관계는 어떤 조건인가?",
    "coreMeaning": "거절해도 관계의 뜻을 분명히 전할 수 있는 조건",
    "roleContributions": {
      "S1": {
        "address": "CH12.P4.S1",
        "originalRole": "편안하게 느낄 수 있는 사람의 특징을 설명한다.",
        "knowledge": "앞선 실제 도입된 선택·참여 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P4.S2",
        "originalRole": "해당 조건의 근거를 제시한다.",
        "knowledge": "싫은 활동과 친구 자체의 거절을 구분할 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P4.S3",
        "originalRole": "상호 존중과 관계 유지에 필요한 행동을 설명한다.",
        "knowledge": "어려운 요청·가능한 다른 참여를 나눠 말함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P4.S4",
        "originalRole": "관계의 긍정적인 가능성으로 마무리한다.",
        "knowledge": "각자의 선택이 우정 안에 남을 긍정적 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:refusal",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "self"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "한 번의 거절이 모든 관계의 평가가 되지 않을 여지",
    "shadow": "싫은 이유를 증명해야 거절할 수 있다고 생각",
    "factBomb": "친구에게도 가능한 답은 예와 아니오 둘 다임",
    "twist": "할 수 없는 것을 말해야 할 수 있는 만남도 선명해짐",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임은 어렵지만 다른 짧은 만남을 제안하는 가상 장면"
    },
    "application": "실제 참여 뜻·가능 범위·상대의 선택을 확인",
    "prerequisites": [
      "앞선 의미·본인 경계·실제 관계 안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "안전상 어려운 관계에 대안 만남을 강요하지 않음",
    "distinction": "CH11 지속 역할의 재협상과 다른 선택적 우정의 경계",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH12.P2:space-with-respect",
      "cpr:material:CH12.P3:invite-without-oversubscription"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 지속 역할의 재협상과 다른 선택적 우정의 경계",
    "sourcePolicy": {
      "unknownMbti": "follow_antecedent_availability",
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
    "id": "cpr:material:CH12.P1:share-a-chosen-story",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P1",
    "address": "CH12.P1",
    "kind": "natal",
    "readerQuestion": "자발적인 우정에서 어떤 참여를 제안하는가?",
    "coreMeaning": "표현 상징을 친구와 나눌 소재의 선택으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH12.P1.S1",
        "originalRole": "친구 관계에서 드러날 수 있는 대표적 성향을 소개한다.",
        "knowledge": "실제 원국의 산출·표현 의미를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P1.S2",
        "originalRole": "그 성향의 근거를 설명한다.",
        "knowledge": "표현 상징은 실제 사교성·친구 수와 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P1.S3",
        "originalRole": "실제 대화와 행동의 특징을 묘사한다.",
        "knowledge": "관심 주제를 나누고 친구가 답할 여지를 남기는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P1.S4",
        "originalRole": "주변에 줄 수 있는 인상을 조건부로 설명한다.",
        "knowledge": "전한 내용과 받은 답 범위에서만 인상을 확인",
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
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
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
    "positive": "대화의 공통 소재를 만들 여지",
    "shadow": "표현이 많으면 관계도 깊다고 단정",
    "factBomb": "내 이야기가 길어진 것과 서로 가까워진 것은 다름",
    "twist": "짧은 소재 하나가 친구의 이야기를 여는 통로가 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "최근 관심을 나누고 친구의 뜻을 묻는 가상 장면"
    },
    "application": "공유할 내용·듣고 싶은 범위·참여를 확인",
    "prerequisites": [
      "실제 원국·본인 표현·친구의 참여·공개 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·인기·현재 친구 수·실제 만남을 생성 금지",
    "distinction": "낯선 인상보다 자발적 우정의 대화 교환",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "낯선 인상보다 자발적 우정의 대화 교환",
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
    "id": "cpr:material:CH12.P2:promise-as-choice",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P2",
    "address": "CH12.P2",
    "kind": "natal",
    "readerQuestion": "친구가 선택할 여지를 남기며 무엇을 나눌 수 있는가?",
    "coreMeaning": "역할·유지 상징을 자발적 만남의 약속으로 좁히기",
    "roleContributions": {
      "S1": {
        "address": "CH12.P2.S1",
        "originalRole": "관계에서 강점으로 작동하는 특징을 선정한다.",
        "knowledge": "친구와 합의한 작은 약속을 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P2.S2",
        "originalRole": "관련 근거를 제시한다.",
        "knowledge": "정관·토가 우정의 성실함을 보증하지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P2.S3",
        "originalRole": "실제 관계에서 나타나는 장점을 설명한다.",
        "knowledge": "못 만날 가능성을 미리 알리고 다른 답을 남기는 장점",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P2.S4",
        "originalRole": "좋은 관계를 만드는 조건을 제시한다.",
        "knowledge": "만남 방식은 자율적이고 갱신 가능할 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:zheng_guan",
        "auditRef": "source-catalog.json#a7fe556624da8372c452",
        "sourceKind": "natal_research",
        "recordSha256": "94995b8c136aa8e30fd19773f8b71c5711beb46091f3f80e01e4c5af1152ce71",
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
              "knowledge:ten_god_zheng_guan",
              "taxonomy:ten_god_zheng_guan"
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
        "sourceId": "deep:ten_god:zheng_guan",
        "auditRef": "source-catalog.json#7bae0211c906962de1b4",
        "sourceKind": "natal_research",
        "recordSha256": "02292f2111aaf7b4a4934cecc4b14bbe4f7149241fe5601a054d35e32d7a3d59",
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
        "axis": "DUTY",
        "id": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:contact-range",
        "definition": "연락·만남의 참여 범위를 정함",
        "condition": "실제 관계와 생활 제약이 주어진 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "steady"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "서로의 생활을 존중하며 이어갈 여지",
    "shadow": "친구에게도 가족 같은 의무를 부과",
    "factBomb": "친밀함이 연락의 고정 할당량은 아님",
    "twist": "변경을 말하는 것이 오래 유지할 방법일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임이 어려운 주에 가능한 짧은 연락을 제안하는 가상 장면"
    },
    "application": "실제 약속·가능한 주기·변경 동의를 확인",
    "prerequisites": [
      "실제 원국·자발적 관계·본인 약속 행동 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "타인의 호감·성실함·관계 성공·MBTI를 생성 금지",
    "distinction": "CH11 가족의 공동 책임과 구별되는 선택적 약속",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 가족의 공동 책임과 구별되는 선택적 약속",
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
    "id": "cpr:material:CH12.P3:critique-without-invitation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P3",
    "address": "CH12.P3",
    "kind": "natal",
    "readerQuestion": "우정에서 내 좋은 뜻이 어디서 어긋날 수 있는가?",
    "coreMeaning": "표현·교정 상징을 친구가 원한 답과 맞추는 질문",
    "roleContributions": {
      "S1": {
        "address": "CH12.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 단점을 설명한다.",
        "knowledge": "실제 원국 의미와 교정 행동을 별도로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P3.S2",
        "originalRole": "그 원인을 설명한다.",
        "knowledge": "표현할 내용이 있어도 조언을 원했는지는 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P3.S3",
        "originalRole": "오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "친구의 취미를 평가하다 듣고 싶었던 뜻을 놓칠 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P3.S4",
        "originalRole": "그 문제를 줄이는 방법을 제시한다.",
        "knowledge": "원하는 도움의 종류를 먼저 묻는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:shang_guan",
        "auditRef": "source-catalog.json#2abf174fd9263dc77069",
        "sourceKind": "natal_research",
        "recordSha256": "bc99009644343d85b0161b881f90ac0fc7e9954cfd65f69a4f187d4e08344c3b",
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
              "knowledge:ten_god_shang_guan",
              "taxonomy:ten_god_shang_guan"
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
        "sourceId": "deep:ten_god:shang_guan",
        "auditRef": "source-catalog.json#726e219c519ed3559b55",
        "sourceKind": "natal_research",
        "recordSha256": "3e4680f1d5790eb0614c29a380cd7c8ecbf27be8c600c27180989af07a73b797",
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
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:respectful-nonintervention",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "direct"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "필요할 때 명확한 의견을 나눌 여지",
    "shadow": "분석이 맞으니 요청 없이 평가해도 된다고 생각",
    "factBomb": "친구의 관심사가 검수 대상이 될 의무는 없음",
    "twist": "의견을 잠시 보관하면 친구가 고를 공간이 남음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 취미 이야기에 의견을 원하는지 묻는 가상 장면"
    },
    "application": "실제 요청·경청·의견·거절을 구분",
    "prerequisites": [
      "실제 원국·본인 전달 행동·친구의 동의 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·이미 생긴 갈등·친구의 실망을 사실화 금지",
    "distinction": "명리 단독에서도 대화 목적이 먼저라는 우정 응용",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리 단독에서도 대화 목적이 먼저라는 우정 응용",
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
    "id": "cpr:material:CH12.P4:friendship-with-voluntary-answers",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH12",
    "paragraphId": "P4",
    "address": "CH12.P4",
    "kind": "recall",
    "readerQuestion": "나와 다르면서도 편할 관계는 어떤 조건인가?",
    "coreMeaning": "명리 단독 관계 응용을 자발적 답이 남는 우정으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH12.P4.S1",
        "originalRole": "편안하게 느낄 수 있는 사람의 특징을 설명한다.",
        "knowledge": "앞선 실제 도입된 표현·약속 의미만 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH12.P4.S2",
        "originalRole": "해당 조건의 근거를 제시한다.",
        "knowledge": "같은 빈도·같은 취향을 강제하지 않는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH12.P4.S3",
        "originalRole": "상호 존중과 관계 유지에 필요한 행동을 설명한다.",
        "knowledge": "함께할 부분과 각자 고를 부분을 말로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH12.P4.S4",
        "originalRole": "관계의 긍정적인 가능성으로 마무리한다.",
        "knowledge": "서로 달라도 이어갈 방식이 있을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "관심과 거절을 동시에 전할 여지",
    "shadow": "친구의 뜻을 원국에서 대신 읽음",
    "factBomb": "우정의 다음 장도 두 사람의 답이 있어야 열림",
    "twist": "같은 활동을 줄여도 함께 나눌 이야기는 남을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "선택 가능한 한 활동과 다음 연락을 합의하는 가상 장면"
    },
    "application": "실제 소개된 의미·자발적 답·가능한 참여를 확인",
    "prerequisites": [
      "앞선 실제 명리 응용과 관계 맥락이 확인된 범위만 회수",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대 유형·궁합·친구의 마음을 생성 금지",
    "distinction": "부모·연애 역할을 만들지 않는 명리 단독 우정의 조건",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH12.P1:share-a-chosen-story",
      "cpr:material:CH12.P2:promise-as-choice",
      "cpr:material:CH12.P3:critique-without-invitation"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "부모·연애 역할을 만들지 않는 명리 단독 우정의 조건",
    "sourcePolicy": {
      "unknownMbti": "follow_antecedent_availability",
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
