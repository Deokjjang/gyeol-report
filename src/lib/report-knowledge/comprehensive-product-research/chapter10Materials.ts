/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH10_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH10.P1:affection-through-small-actions",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P1",
    "address": "CH10.P1",
    "kind": "mbti",
    "readerQuestion": "관심을 어떤 통로와 속도로 전하고 싶은가?",
    "coreMeaning": "관심을 작은 행동과 약속으로 전하는 애정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P1.S1",
        "originalRole": "사랑하는 방식의 핵심을 소개한다.",
        "knowledge": "가까워지고 싶을 때 구체적인 수고를 나누는 방식",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P1.S2",
        "originalRole": "명리·MBTI 근거를 설명한다.",
        "knowledge": "실제 ISFJ love 원천의 해당 설명만 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P1.S3",
        "originalRole": "호감이 생겼을 때 나타날 수 있는 행동을 묘사한다.",
        "knowledge": "호감이 있으면 작은 제안이나 기억한 취향을 전할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P1.S4",
        "originalRole": "관계에서 중요하게 여기는 것을 설명한다.",
        "knowledge": "상대가 원하는 도움과 일정·선택권을 중요 조건으로 제시",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:love:devoted_partner",
        "auditRef": "source-catalog.json#01e7c19fe260d7d8dd0d",
        "sourceKind": "mbti_trait",
        "recordSha256": "e106fb929accb6d10551347630c458bb31cfc5f336eb14d7a4a2a9d890bbf5de",
        "sourceFileSha256": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
        "originalState": {
          "type": "ISFJ",
          "area": "love",
          "traitId": "devoted_partner",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:practical-support",
        "definition": "동의한 구체적 부담을 덜어줌",
        "condition": "역할과 감당할 자원 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
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
    "positive": "관심이 구체적인 행동으로 이해될 여지",
    "shadow": "행동했으니 마음도 충분히 전달됐다고 기대",
    "factBomb": "잘 챙긴 행동이 말하지 않은 고백까지 대신하지는 않음",
    "twist": "원하는 친밀감을 묻는 것이 배려를 더 정확하게 함",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "관심 있는 활동을 제안하고 상대의 답을 받는 가상 장면"
    },
    "application": "도움·호감 표현·교제 합의를 서로 구분",
    "prerequisites": [
      "실제 trait·현재 관계 상태·본인 뜻·상대의 자발적 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 연인·호감 상대·교제 경험·상대 마음 존재 가정 금지",
    "distinction": "CH11 의무가 아닌 선택적 친밀감 표현",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 의무가 아닌 선택적 친밀감 표현",
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
    "id": "cpr:material:CH10.P1:space-and-return",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P1",
    "address": "CH10.P1",
    "kind": "mbti",
    "readerQuestion": "관심을 어떤 통로와 속도로 전하고 싶은가?",
    "coreMeaning": "가까워져도 사적 영역을 남기고 싶은 애정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P1.S1",
        "originalRole": "사랑하는 방식의 핵심을 소개한다.",
        "knowledge": "함께하는 시간과 자기 시간을 구분하는 방식",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P1.S2",
        "originalRole": "명리·MBTI 근거를 설명한다.",
        "knowledge": "ISTP freedom_love_boundary 원천을 실제 맥락에서 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P1.S3",
        "originalRole": "호감이 생겼을 때 나타날 수 있는 행동을 묘사한다.",
        "knowledge": "호감이 있어도 모든 시간을 함께 쓰지 않을 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P1.S4",
        "originalRole": "관계에서 중요하게 여기는 것을 설명한다.",
        "knowledge": "허용할 공개·연락·일정의 범위를 함께 확인",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTP:love:freedom_love_boundary",
        "auditRef": "source-catalog.json#04d364954a00555e56e1",
        "sourceKind": "mbti_trait",
        "recordSha256": "0d7c4e17ce8e31aa432757a8784a892f852c30422cd96a2472202c012dda8a96",
        "sourceFileSha256": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
        "originalState": {
          "type": "ISTP",
          "area": "love",
          "traitId": "freedom_love_boundary",
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
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:privacy",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
    "positive": "개인 공간과 친밀감을 함께 설계할 여지",
    "shadow": "혼자 있고 싶다는 답이 충분한 관계 설명이라고 생각",
    "factBomb": "내 공간의 문은 닫아도 연락할 방법은 함께 정할 수 있음",
    "twist": "다시 함께할 시점을 말하면 공간이 단절로 오해될 여지가 줄어듦",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "혼자 할 활동과 다음 만남을 함께 정하는 가상 장면"
    },
    "application": "혼자 있음의 뜻과 다시 응답할 시간을 직접 전함",
    "prerequisites": [
      "실제 love trait·원하는 거리·서로의 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "회피 성향·무관심·연애 실패를 유형에서 진단 금지",
    "distinction": "CH04 혼자 사고하는 장면과 다른 친밀한 관계의 합의",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 혼자 사고하는 장면과 다른 친밀한 관계의 합의",
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
    "id": "cpr:material:CH10.P1:ask-about-direction",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P1",
    "address": "CH10.P1",
    "kind": "mbti",
    "readerQuestion": "관심을 어떤 통로와 속도로 전하고 싶은가?",
    "coreMeaning": "관계의 속도와 뜻을 말로 맞추고 싶은 애정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P1.S1",
        "originalRole": "사랑하는 방식의 핵심을 소개한다.",
        "knowledge": "호감의 표현과 관계 방향을 확인하는 방식",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P1.S2",
        "originalRole": "명리·MBTI 근거를 설명한다.",
        "knowledge": "ENFJ emotional_confirmation_need는 현재 불안 증명이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P1.S3",
        "originalRole": "호감이 생겼을 때 나타날 수 있는 행동을 묘사한다.",
        "knowledge": "서로 원하는 만남의 빈도를 직접 묻는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P1.S4",
        "originalRole": "관계에서 중요하게 여기는 것을 설명한다.",
        "knowledge": "확인 질문과 상대가 답할 선택권을 함께 중요하게 둠",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:love:emotional_confirmation_need",
        "auditRef": "source-catalog.json#962137f48456cc9e196d",
        "sourceKind": "mbti_trait",
        "recordSha256": "7798937240c84e59f327be4628eacc7e608ee4c5d7af70a662f0a8838b500ef8",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "love",
          "traitId": "emotional_confirmation_need",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
        "voice"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "서로 다른 속도를 조기에 알 수 있음",
    "shadow": "답을 더 많이 받으면 확신도 무한히 커진다고 생각",
    "factBomb": "확인 질문이 반복되면 답할 공간이 줄어들 수 있음",
    "twist": "한 번의 분명한 합의가 많은 추측보다 편할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "다음 만남과 연락의 가능한 범위를 묻는 가상 장면"
    },
    "application": "현재 뜻·변경 가능성·응답 시간을 확인",
    "prerequisites": [
      "실제 trait·관계 단계·상대의 자발적 참여 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대의 진심·외도·관계 지속을 추측하지 않음",
    "distinction": "타인의 마음읽기 대신 표현된 합의의 범위",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "타인의 마음읽기 대신 표현된 합의의 범위",
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
    "id": "cpr:material:CH10.P2:warmth-in-chosen-details",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P2",
    "address": "CH10.P2",
    "kind": "mbti",
    "readerQuestion": "어떤 표현이 관계에서 가치가 될 수 있는가?",
    "coreMeaning": "천천히 드러내는 작은 선택이 애정 표현이 될 조건",
    "roleContributions": {
      "S1": {
        "address": "CH10.P2.S1",
        "originalRole": "상대에게 매력적으로 느껴질 수 있는 특징을 선정한다.",
        "knowledge": "관심을 말·활동·취향으로 전하는 긍정 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P2.S2",
        "originalRole": "그 특징의 근거를 설명한다.",
        "knowledge": "ISFP slow_open_romantic의 실제 맥락 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P2.S3",
        "originalRole": "가까워지면서 드러나는 모습을 설명한다.",
        "knowledge": "가까워지면 본인이 고른 표현을 조금 더 나눌 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P2.S4",
        "originalRole": "매력이 잘 발휘되는 조건을 제시한다.",
        "knowledge": "상대의 취향·동의와 본인의 안전이 맞을 때 장점",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFP:love:slow_open_romantic",
        "auditRef": "source-catalog.json#efd2df690e448ae25f53",
        "sourceKind": "mbti_trait",
        "recordSha256": "d554fd46f3f0bf957c55df99dac6e23c7d428afdab7d49043f550be66c8b6baa",
        "sourceFileSha256": "c29503d26796af4c3dbc8c9298f4bf8d0636570e63c0494169bcf95d722d38d8",
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
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "과장 없이 관심의 내용을 전할 여지",
    "shadow": "조용한 진심이 자동으로 상대에게 매력이라고 단정",
    "factBomb": "아무 말도 안 해도 알아줄 사랑을 기본값으로 두지 않음",
    "twist": "작은 명시적 관심이 큰 연출보다 편할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "상대가 원한 활동을 함께 고르며 좋아하는 이유를 말하는 가상 장면"
    },
    "application": "관심의 내용과 상대가 원하는 참여를 확인",
    "prerequisites": [
      "실제 trait·본인 표현 선호·상대 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "미적 재능·성적 매력·실제 인기를 유형으로 확정 금지",
    "distinction": "CH04 숨은 매력에서 친밀한 표현의 수신 조건으로 이동",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 숨은 매력에서 친밀한 표현의 수신 조건으로 이동",
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
    "id": "cpr:material:CH10.P2:curiosity-as-intimacy",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P2",
    "address": "CH10.P2",
    "kind": "mbti",
    "readerQuestion": "어떤 표현이 관계에서 가치가 될 수 있는가?",
    "coreMeaning": "함께 생각을 나누는 호기심이 친밀감의 통로가 될 조건",
    "roleContributions": {
      "S1": {
        "address": "CH10.P2.S1",
        "originalRole": "상대에게 매력적으로 느껴질 수 있는 특징을 선정한다.",
        "knowledge": "서로의 관점을 듣는 긍정 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P2.S2",
        "originalRole": "그 특징의 근거를 설명한다.",
        "knowledge": "INTP witty_intellectual_attraction은 상대 지능 평가와 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P2.S3",
        "originalRole": "가까워지면서 드러나는 모습을 설명한다.",
        "knowledge": "가까워지며 같은 주제의 다른 생각을 나눌 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P2.S4",
        "originalRole": "매력이 잘 발휘되는 조건을 제시한다.",
        "knowledge": "질문을 시험이 아닌 함께 알아가는 선택으로 둘 때 장점",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTP:love:witty_intellectual_attraction",
        "auditRef": "source-catalog.json#9001b550f225e0c6153d",
        "sourceKind": "mbti_trait",
        "recordSha256": "8161fb47b480bdf5d0a9aaf78fb46975955dfdb75c808fc6e0ba6b5560ae5ea3",
        "sourceFileSha256": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "서로 중요하게 생각하는 이유를 알 여지",
    "shadow": "좋은 답을 해야 매력 있는 사람이라고 기준화",
    "factBomb": "데이트의 질문지를 면접 채점표로 만들지 않음",
    "twist": "모른다고 말할 수 있을 때 호기심이 더 편안해짐",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새로 본 작품에 다른 해석을 나누는 가상 장면"
    },
    "application": "답의 우열보다 상대가 궁금한 점을 묻기",
    "prerequisites": [
      "실제 trait·공유 주제·경청·질문 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대 유형·학력·지적 수준·궁합 지수 생성 금지",
    "distinction": "CH05 탐구 재능보다 함께 모르는 것을 말하는 친밀 조건",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 탐구 재능보다 함께 모르는 것을 말하는 친밀 조건",
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
    "id": "cpr:material:CH10.P2:respond-with-room",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P2",
    "address": "CH10.P2",
    "kind": "mbti",
    "readerQuestion": "어떤 표현이 관계에서 가치가 될 수 있는가?",
    "coreMeaning": "상대의 이야기를 받고 선택 공간을 남기는 애정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P2.S1",
        "originalRole": "상대에게 매력적으로 느껴질 수 있는 특징을 선정한다.",
        "knowledge": "관심과 반응을 나누는 긍정 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P2.S2",
        "originalRole": "그 특징의 근거를 설명한다.",
        "knowledge": "ENFP warm_confidant_partner 원천은 실제 신뢰 보증이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P2.S3",
        "originalRole": "가까워지면서 드러나는 모습을 설명한다.",
        "knowledge": "가까워지면 말하기 어려운 주제를 듣는 장면 가능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P2.S4",
        "originalRole": "매력이 잘 발휘되는 조건을 제시한다.",
        "knowledge": "듣기·비밀·다루고 싶은 범위를 당사자가 고를 때 장점",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFP:love:warm_confidant_partner",
        "auditRef": "source-catalog.json#cfc4d324191f14d671cd",
        "sourceKind": "mbti_trait",
        "recordSha256": "3d5dc96e8a36559dfdca6761f16b1fe50fc1ccfe7ca804be0abbfd0f3a2481a9",
        "sourceFileSha256": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
        "originalState": {
          "type": "ENFP",
          "area": "love",
          "traitId": "warm_confidant_partner",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
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
        "care"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "이야기할 수 있는 여유를 만들 가능성",
    "shadow": "털어놓은 내용에 반드시 조언을 해야 한다고 생각",
    "factBomb": "고민을 들었다고 해결 역할까지 자동 배정되지는 않음",
    "twist": "답을 주지 않는 경청이 더 편한 지원일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "상대가 말한 뒤 들어주길 원하는지 묻는 가상 장면"
    },
    "application": "들을 범위·원하는 도움·공개 동의를 확인",
    "prerequisites": [
      "실제 trait·당사자 뜻·경청 행동·안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 고민·비밀·과거 상처를 고객에게 부여하지 않음",
    "distinction": "개인 호감 결과가 아닌 소통의 선택 가능한 방식",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "개인 호감 결과가 아닌 소통의 선택 가능한 방식",
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
    "id": "cpr:material:CH10.P3:romance-as-problem-set",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P3",
    "address": "CH10.P3",
    "kind": "mbti",
    "readerQuestion": "내 방식이 어떤 상황에서 오해를 만들 수 있는가?",
    "coreMeaning": "관계를 잘하려는 분석이 당사자의 말보다 앞설 위험",
    "roleContributions": {
      "S1": {
        "address": "CH10.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 약점을 설명한다.",
        "knowledge": "정답을 찾으려 관계의 변화를 계산하는 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P3.S2",
        "originalRole": "실제 근거를 연결한다.",
        "knowledge": "INTJ strategic_romance_awkwardness의 원천 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P3.S3",
        "originalRole": "갈등이나 오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "연락의 뜻을 분석하다 실제 원하는 답을 묻지 않는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P3.S4",
        "originalRole": "상대방의 관점에서 나타날 수 있는 차이를 설명한다.",
        "knowledge": "상대는 설명보다 자기 말을 들을 공간이 필요할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTJ:love:strategic_romance_awkwardness",
        "auditRef": "source-catalog.json#2fbbbcbec9365163bb46",
        "sourceKind": "mbti_trait",
        "recordSha256": "ec80331bcc0c5669f8dc7c3279aa9c332de9570ad282c028e0c761619d38a20f",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "love",
          "traitId": "strategic_romance_awkwardness",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "STRATEGY",
        "id": "sar:facet:STRATEGY:route-comparison",
        "definition": "목적에 이르는 여러 경로를 비교",
        "condition": "목적·자원·기한이 명시된 상황",
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
        "research"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "관계 조건을 차분히 확인하는 힘은 유지",
    "shadow": "상대의 행동 패턴에서 진심을 확정",
    "factBomb": "연애의 답안지는 상대가 낸 질문과도 다를 수 있음",
    "twist": "직접 묻는 한 질문이 긴 분석보다 정확할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "연락 빈도의 이유를 추측 대신 물어보는 가상 장면"
    },
    "application": "관찰한 사실·추측·직접 들은 뜻을 구분",
    "prerequisites": [
      "실제 trait·관계 맥락·본인 행동·상대 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대 진심·외도·이별·현재 갈등을 사실화 금지",
    "distinction": "논리 능력 비하 없이 관계 분석의 정보 한계",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "논리 능력 비하 없이 관계 분석의 정보 한계",
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
    "id": "cpr:material:CH10.P3:confirmation-pressure",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P3",
    "address": "CH10.P3",
    "kind": "mbti",
    "readerQuestion": "내 방식이 어떤 상황에서 오해를 만들 수 있는가?",
    "coreMeaning": "관계를 확인하려는 질문이 응답 압박으로 번질 조건",
    "roleContributions": {
      "S1": {
        "address": "CH10.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 약점을 설명한다.",
        "knowledge": "확인 질문의 횟수보다 목적을 묻는 위험 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P3.S2",
        "originalRole": "실제 근거를 연결한다.",
        "knowledge": "해당 원천은 실제 집착·불안 진단이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P3.S3",
        "originalRole": "갈등이나 오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "답이 늦을 때 같은 질문을 반복할 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P3.S4",
        "originalRole": "상대방의 관점에서 나타날 수 있는 차이를 설명한다.",
        "knowledge": "상대는 답할 시간과 다른 속도를 원할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:love:emotional_confirmation_need",
        "auditRef": "source-catalog.json#962137f48456cc9e196d",
        "sourceKind": "mbti_trait",
        "recordSha256": "7798937240c84e59f327be4628eacc7e608ee4c5d7af70a662f0a8838b500ef8",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "love",
          "traitId": "emotional_confirmation_need",
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
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:renegotiation",
        "definition": "상황 변화에 맞게 선을 다시 합의",
        "condition": "바뀐 영향과 기존 약속을 설명",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "명확한 합의와 변경 신호를 정할 여지",
    "shadow": "빨리 답하면 더 사랑한다고 평가",
    "factBomb": "응답 속도로 마음의 양을 재지 않음",
    "twist": "다시 얘기할 시점을 정하면 지금의 침묵을 견딜 조건이 생길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "답하기 어려운 주제의 다음 대화 시간을 정하는 가상 장면"
    },
    "application": "확인할 내용·응답 기한·거절 가능성을 합의",
    "prerequisites": [
      "실제 trait·본인 행동·관계 단계·당사자 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "미확인 집착·가해·피해·정신 상태를 진단하지 않음",
    "distinction": "사랑의 강도가 아닌 확인 방식의 조율 비용",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "사랑의 강도가 아닌 확인 방식의 조율 비용",
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
    "id": "cpr:material:CH10.P3:space-without-signal",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P3",
    "address": "CH10.P3",
    "kind": "mbti",
    "readerQuestion": "내 방식이 어떤 상황에서 오해를 만들 수 있는가?",
    "coreMeaning": "개인 공간을 지키려다 관계의 상태가 불분명해질 조건",
    "roleContributions": {
      "S1": {
        "address": "CH10.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 약점을 설명한다.",
        "knowledge": "혼자 있을 필요를 설명하지 않는 위험 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P3.S2",
        "originalRole": "실제 근거를 연결한다.",
        "knowledge": "자유·경계 원천과 실제 침묵 행동을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P3.S3",
        "originalRole": "갈등이나 오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "연락을 쉬고 싶은 기간을 말하지 않을 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P3.S4",
        "originalRole": "상대방의 관점에서 나타날 수 있는 차이를 설명한다.",
        "knowledge": "상대는 사적 시간인지 관계 종료인지 알기 어려울 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTP:love:freedom_love_boundary",
        "auditRef": "source-catalog.json#04d364954a00555e56e1",
        "sourceKind": "mbti_trait",
        "recordSha256": "0d7c4e17ce8e31aa432757a8784a892f852c30422cd96a2472202c012dda8a96",
        "sourceFileSha256": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
        "originalState": {
          "type": "ISTP",
          "area": "love",
          "traitId": "freedom_love_boundary",
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
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
    "positive": "공간의 목적과 돌아올 방식을 직접 말할 여지",
    "shadow": "내 자유니까 관계의 영향은 설명할 필요 없다고 생각",
    "factBomb": "개인 공간은 관계 합의의 대체 문서가 아님",
    "twist": "짧은 안내로 자기 시간도 더 편하게 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "주말의 개인 일정과 다음 연락 시점을 말하는 가상 장면"
    },
    "application": "공개할 범위 안에서 상태와 다음 응답을 합의",
    "prerequisites": [
      "실제 trait·개인 공간 필요·상대 참여·안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "회피형·냉정함·이별 경험을 유형에서 부여 금지",
    "distinction": "자율성을 결함으로 만들지 않는 정보 전달 문제",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "자율성을 결함으로 만들지 않는 정보 전달 문제",
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
    "id": "cpr:material:CH10.P4:interest-and-clear-consent",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P4",
    "address": "CH10.P4",
    "kind": "recall",
    "readerQuestion": "다른 선택이 있어도 편한 관계의 조건은 무엇인가?",
    "coreMeaning": "관심의 내용과 상대의 참여를 맞추는 관계 조건",
    "roleContributions": {
      "S1": {
        "address": "CH10.P4.S1",
        "originalRole": "잘 맞는 관계의 조건을 설명한다.",
        "knowledge": "앞선 실제 소개된 행동 표현의 뜻만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P4.S2",
        "originalRole": "본인이 주의할 행동을 제시한다.",
        "knowledge": "도움과 호감·교제 합의를 분리할 주의점",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P4.S3",
        "originalRole": "관계를 개선할 실제 방법을 설명한다.",
        "knowledge": "무엇을 함께하고 싶은지 직접 제안하는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P4.S4",
        "originalRole": "긍정적인 관계 가능성으로 마무리한다.",
        "knowledge": "서로의 답이 선택으로 남을 때 긍정적 관계 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
        "care"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "돌봄과 친밀감의 기대를 명확히 할 여지",
    "shadow": "잘 챙기면 관계도 생겨야 한다고 기대",
    "factBomb": "호의는 상대의 마음을 사는 예약금이 아님",
    "twist": "거절을 받을 수 있어야 제안도 편안할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 만남을 제안하며 선택 가능한 답을 남기는 가상 장면"
    },
    "application": "관심·제안·답·다음 선택을 구분",
    "prerequisites": [
      "앞선 실제 도입 의미·본인 뜻·당사자 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대의 사랑·관계 시작·미래 결혼을 보장 금지",
    "distinction": "좋은 관계의 조건을 특정 상대의 마음으로 바꾸지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH10.P1:affection-through-small-actions",
      "cpr:material:CH10.P2:warmth-in-chosen-details"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "좋은 관계의 조건을 특정 상대의 마음으로 바꾸지 않음",
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
    "id": "cpr:material:CH10.P4:space-with-agreed-return",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P4",
    "address": "CH10.P4",
    "kind": "recall",
    "readerQuestion": "다른 선택이 있어도 편한 관계의 조건은 무엇인가?",
    "coreMeaning": "각자의 시간과 함께하는 시간을 확인 가능한 약속으로 조율",
    "roleContributions": {
      "S1": {
        "address": "CH10.P4.S1",
        "originalRole": "잘 맞는 관계의 조건을 설명한다.",
        "knowledge": "앞선 실제 소개된 공간 필요만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P4.S2",
        "originalRole": "본인이 주의할 행동을 제시한다.",
        "knowledge": "사적 정보를 모두 공개하거나 연락을 무시하는 양극단 주의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P4.S3",
        "originalRole": "관계를 개선할 실제 방법을 설명한다.",
        "knowledge": "가능한 연락 범위와 다시 만날 방법을 합의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P4.S4",
        "originalRole": "긍정적인 관계 가능성으로 마무리한다.",
        "knowledge": "다른 속도가 있어도 존중하며 지낼 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:privacy",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
        "self"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "혼자 있는 시간의 불필요한 추측을 줄일 여지",
    "shadow": "합의한 기준이 영원히 같다고 기대",
    "factBomb": "편한 거리도 상황이 바뀌면 다시 물을 수 있음",
    "twist": "변경 신호를 정하면 공간을 더 자유롭게 쓸 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "바빠진 주간의 연락 방식을 다시 정하는 가상 장면"
    },
    "application": "실제 범위·변경 신호·응답 시점을 확인",
    "prerequisites": [
      "앞선 의미·실제 관계 단계·상호 동의·안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "위험·강압 관계를 대화만으로 해결한다고 보장 금지",
    "distinction": "CH11 역할 조정과 달리 자발적 친밀감의 거리",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH10.P1:space-and-return",
      "cpr:material:CH10.P3:space-without-signal"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 역할 조정과 달리 자발적 친밀감의 거리",
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
    "id": "cpr:material:CH10.P4:curiosity-not-verdict",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P4",
    "address": "CH10.P4",
    "kind": "recall",
    "readerQuestion": "다른 선택이 있어도 편한 관계의 조건은 무엇인가?",
    "coreMeaning": "질문을 상대를 판정하는 도구 대신 함께 이해하는 통로로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH10.P4.S1",
        "originalRole": "잘 맞는 관계의 조건을 설명한다.",
        "knowledge": "앞선 실제 소개된 탐색·분석 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P4.S2",
        "originalRole": "본인이 주의할 행동을 제시한다.",
        "knowledge": "답의 우열·반응 속도로 마음을 판정하는 행동 주의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P4.S3",
        "originalRole": "관계를 개선할 실제 방법을 설명한다.",
        "knowledge": "상대가 말한 뜻을 요약하고 맞는지 묻는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P4.S4",
        "originalRole": "긍정적인 관계 가능성으로 마무리한다.",
        "knowledge": "다른 생각을 알고도 존중할 관계 가능성",
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
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
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
    "positive": "분석과 직접 들은 정보를 구분할 여지",
    "shadow": "좋은 질문이면 모든 비밀을 들어도 된다고 생각",
    "factBomb": "궁금함이 개인정보를 요구할 권한은 아님",
    "twist": "답하지 않을 선택도 이해의 일부가 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 계획에 다른 이유를 듣고 확인하는 가상 장면"
    },
    "application": "질문 동의·들은 뜻·말하지 않을 범위를 존중",
    "prerequisites": [
      "앞선 실제 원천·관계 맥락·당사자 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대 MBTI·숨은 마음·경험을 가정하지 않음",
    "distinction": "종합의 개인 사용법이며 두 사람 궁합 해석 아님",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH10.P2:curiosity-as-intimacy",
      "cpr:material:CH10.P3:romance-as-problem-set"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "종합의 개인 사용법이며 두 사람 궁합 해석 아님",
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
    "id": "cpr:material:CH10.P1:chosen-expression-in-closeness",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P1",
    "address": "CH10.P1",
    "kind": "natal",
    "readerQuestion": "관심을 어떤 통로와 속도로 전하고 싶은가?",
    "coreMeaning": "표현·자기 선택의 상징을 친밀감의 방식으로 검토",
    "roleContributions": {
      "S1": {
        "address": "CH10.P1.S1",
        "originalRole": "사랑하는 방식의 핵심을 소개한다.",
        "knowledge": "관심의 내용을 자기 통로로 전하는 애정 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P1.S2",
        "originalRole": "명리·MBTI 근거를 설명한다.",
        "knowledge": "실제 산출·자기 몫 의미와 관계 행동을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P1.S3",
        "originalRole": "호감이 생겼을 때 나타날 수 있는 행동을 묘사한다.",
        "knowledge": "호감이 실제 있을 때 말·활동 중 표현을 고르는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P1.S4",
        "originalRole": "관계에서 중요하게 여기는 것을 설명한다.",
        "knowledge": "본인의 뜻과 상대의 참여를 함께 중요하게 둠",
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
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "관심을 선택 가능한 제안으로 만들 여지",
    "shadow": "별이 있으니 적극적 연애형이라고 단정",
    "factBomb": "표현의 상징이 실제 연인의 존재를 만들지는 않음",
    "twist": "작은 요청이 큰 추측보다 관계를 정확히 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "함께하고 싶은 활동을 짧게 제안하는 가상 장면"
    },
    "application": "실제 호감·표현 동의·상대의 자발적 답 확인",
    "prerequisites": [
      "실제 원국·관계 상태·본인 선호·공개 범위 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·연인·교제 경험·상대 마음을 생성 금지",
    "distinction": "명리 단독의 관계 응용에서도 실제 호감 존재는 조건",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:bijian의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리 단독의 관계 응용에서도 실제 호감 존재는 조건",
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
    "id": "cpr:material:CH10.P2:expression-as-agreed-offer",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P2",
    "address": "CH10.P2",
    "kind": "natal",
    "readerQuestion": "어떤 표현이 관계에서 가치가 될 수 있는가?",
    "coreMeaning": "표현 상징을 상대가 원하는 참여와 맞추는 매력 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P2.S1",
        "originalRole": "상대에게 매력적으로 느껴질 수 있는 특징을 선정한다.",
        "knowledge": "기억에 남을 표현의 기능을 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P2.S2",
        "originalRole": "그 특징의 근거를 설명한다.",
        "knowledge": "실제 명리 원천과 표현 행동을 별도로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P2.S3",
        "originalRole": "가까워지면서 드러나는 모습을 설명한다.",
        "knowledge": "가까워질 때 관심의 내용을 구체적으로 나눌 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P2.S4",
        "originalRole": "매력이 잘 발휘되는 조건을 제시한다.",
        "knowledge": "상대가 받길 원하는 방식·공개 범위가 맞을 때 장점",
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
        "id": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
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
        "voice"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "뜻이 어떻게 닿았는지 확인할 여지",
    "shadow": "화·식신이 있으니 상대에게 매력적이라고 보장",
    "factBomb": "좋은 표현이라는 자기 평가가 상대의 호감은 아님",
    "twist": "짧게 묻고 듣는 시간이 표현을 더 따뜻하게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "실제 원하는 활동을 함께 고르는 가상 장면"
    },
    "application": "관심의 내용·수신 뜻·공개 동의를 확인",
    "prerequisites": [
      "실제 원국·본인 표현·관계 단계·상대 답 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "외모·성적 매력·인기·연애 결과를 계산에서 확정 금지",
    "distinction": "명리의 긍정 응용과 타인의 호감을 분리",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리의 긍정 응용과 타인의 호감을 분리",
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
    "id": "cpr:material:CH10.P3:own-criteria-without-message",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P3",
    "address": "CH10.P3",
    "kind": "natal",
    "readerQuestion": "내 방식이 어떤 상황에서 오해를 만들 수 있는가?",
    "coreMeaning": "자기 기준을 지키며 뜻을 전하지 않을 때의 오해 후보",
    "roleContributions": {
      "S1": {
        "address": "CH10.P3.S1",
        "originalRole": "관계에서 반복할 수 있는 약점을 설명한다.",
        "knowledge": "실제 원국의 자기 선택·표현 의미를 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P3.S2",
        "originalRole": "실제 근거를 연결한다.",
        "knowledge": "원국 표지만으로 독선·무관심을 확정하지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P3.S3",
        "originalRole": "갈등이나 오해가 생길 수 있는 상황을 묘사한다.",
        "knowledge": "중요한 선택의 이유를 말하지 않아 뜻이 달라질 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P3.S4",
        "originalRole": "상대방의 관점에서 나타날 수 있는 차이를 설명한다.",
        "knowledge": "상대가 고를 정보를 받았는지 별도로 확인",
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
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
    "positive": "자기 선택과 관계의 정보를 함께 존중할 여지",
    "shadow": "내 기준이니 상대가 이해해야 한다고 생각",
    "factBomb": "자기 기준을 가진 것과 그것을 전달한 것은 다른 행동",
    "twist": "짧은 이유가 선택권을 빼앗지 않고 관계를 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "각자 할 일정과 함께할 시간을 나누는 가상 장면"
    },
    "application": "본인 결정·공동 영향·공개 범위를 구분",
    "prerequisites": [
      "실제 원국·본인 행동·관계 맥락·상호 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·실제 갈등·이별·상대의 평가를 생성 금지",
    "distinction": "독립성을 결함으로 만들지 않는 정보의 문제",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:bijian의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "독립성을 결함으로 만들지 않는 정보의 문제",
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
    "id": "cpr:material:CH10.P4:closeness-with-chosen-space",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH10",
    "paragraphId": "P4",
    "address": "CH10.P4",
    "kind": "recall",
    "readerQuestion": "다른 선택이 있어도 편한 관계의 조건은 무엇인가?",
    "coreMeaning": "명리 단독에서 소개한 표현·선택 의미를 관계 합의로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH10.P4.S1",
        "originalRole": "잘 맞는 관계의 조건을 설명한다.",
        "knowledge": "앞선 실제 도입한 관계 응용만 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH10.P4.S2",
        "originalRole": "본인이 주의할 행동을 제시한다.",
        "knowledge": "자기 기준과 상대의 참여를 동시에 확인할 주의점",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH10.P4.S3",
        "originalRole": "관계를 개선할 실제 방법을 설명한다.",
        "knowledge": "관심의 뜻·공개 범위·함께할 시간을 직접 합의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH10.P4.S4",
        "originalRole": "긍정적인 관계 가능성으로 마무리한다.",
        "knowledge": "다른 선택을 존중하며 지낼 가능성으로 마무리",
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
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
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
    "positive": "추측 대신 실제 표현과 답을 볼 여지",
    "shadow": "명리에서 상대의 마음도 확인된 듯 회수",
    "factBomb": "함께할 뜻도 각자의 답이 남아 있어야 함",
    "twist": "작은 합의가 큰 약속보다 현실적인 시작일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "서로 가능한 만남의 방식 하나를 정하는 가상 장면"
    },
    "application": "실제 도입 의미·본인 뜻·상대 답·안전을 확인",
    "prerequisites": [
      "앞선 명리 응용의 실제 조건이 확인된 범위에서만 회수",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "유형·궁합·결혼·연애 성공을 새로 부여하지 않음",
    "distinction": "MBTI를 만들지 않고도 남길 수 있는 개인의 관계 선택 질문",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH10.P1:chosen-expression-in-closeness",
      "cpr:material:CH10.P2:expression-as-agreed-offer",
      "cpr:material:CH10.P3:own-criteria-without-message"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "MBTI를 만들지 않고도 남길 수 있는 개인의 관계 선택 질문",
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
