/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH08_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH08.P1:criteria-before-delivery",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "kind": "mbti",
    "readerQuestion": "실제 일에서 나는 무엇부터 맞추는가?",
    "coreMeaning": "해야 할 일과 결과 기준을 먼저 맞추는 업무 방식",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "대표적인 업무 성향을 소개한다.",
        "knowledge": "담당·기한·기준을 확인하는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거를 설명한다.",
        "knowledge": "ESTJ clear_expectations 원천의 업무 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "일할 때 나타나는 행동을 묘사한다.",
        "knowledge": "시작 전에 누구에게 어떤 결과를 전달할지 묻는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "그 방식의 강점을 설명한다.",
        "knowledge": "재작업을 줄일 수 있는 명확한 출발 조건",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ESTJ:workplace:clear_expectations",
        "auditRef": "source-catalog.json#57df72fa18aaa83db72e",
        "sourceKind": "mbti_trait",
        "recordSha256": "2640939c58d4d5990b690232e366f519cf2ea7b5ac01717cca9e808f9111b274",
        "sourceFileSha256": "8187be30ddd97adf87c1afedf15f179da1a25aa871dfa0ad9a6aadf6d4a25fc6",
        "originalState": {
          "type": "ESTJ",
          "area": "workplace",
          "traitId": "clear_expectations",
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
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:standard-consistency",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "condition": "같은 기준을 적용해도 되는 조건 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "order"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "동료가 기대하는 결과를 이해할 여지",
    "shadow": "기준 설명이 통제의 양으로 바뀜",
    "factBomb": "정확한 지시가 상대의 모든 방법까지 정할 권한은 아님",
    "twist": "방법 재량을 남기면 기준도 더 잘 지켜질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 과제의 완료 조건을 공동 문서에 남기는 가상 장면"
    },
    "application": "결과 기준과 선택 가능한 방법을 구분",
    "prerequisites": [
      "실제 업무 상태·trait·권한·요구 조건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "직업·직급·실제 성과를 유형으로 부여 금지",
    "distinction": "CH05 재능이 아니라 업무 시작 때의 정보 교환",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 재능이 아니라 업무 시작 때의 정보 교환",
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
    "id": "cpr:material:CH08.P1:try-in-real-use",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "kind": "natal",
    "readerQuestion": "실제 일에서 나는 무엇부터 맞추는가?",
    "coreMeaning": "산출 상징을 실제 사용 조건 확인으로 적용",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "대표적인 업무 성향을 소개한다.",
        "knowledge": "작동하는 작은 형태를 먼저 보는 업무 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거를 설명한다.",
        "knowledge": "식신 산출·토 유지 의미는 현대 직무 능력과 별도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "일할 때 나타나는 행동을 묘사한다.",
        "knowledge": "실제 쓸 환경에서 한 부분을 시험하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "그 방식의 강점을 설명한다.",
        "knowledge": "추상 요구의 차이를 일찍 확인할 가능성",
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
        "axis": "PRACTICALITY",
        "id": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "CREATION",
        "id": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
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
    "positive": "다른 사람이 필요한 수정점을 말하기 쉬움",
    "shadow": "작게 되면 전체도 같은 조건으로 된다고 기대",
    "factBomb": "작은 성공에 전체 운영의 증명서를 붙이지 않음",
    "twist": "시험의 실패가 큰 재작업을 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "안내문 한 장을 실제 수신자에게 읽혀보는 가상 장면"
    },
    "application": "시험할 가설·사용자·한계·다음 확인을 정함",
    "prerequisites": [
      "실제 원국 의미·과제·안전·시험 권한 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "직무 입력이 없으면 개발자·공예가 등 직업을 발명하지 않음",
    "distinction": "커리어 전문 적성 대신 현실 사용을 확인하는 일 방식",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "커리어 전문 적성 대신 현실 사용을 확인하는 일 방식",
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
    "id": "cpr:material:CH08.P1:work-through-shared-purpose",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "kind": "mbti",
    "readerQuestion": "실제 일에서 나는 무엇부터 맞추는가?",
    "coreMeaning": "공동 목적을 알아야 협업의 방향이 선명해지는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P1.S1",
        "originalRole": "대표적인 업무 성향을 소개한다.",
        "knowledge": "사람들과 목표의 이유를 나누는 업무 방식",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P1.S2",
        "originalRole": "실제 근거를 설명한다.",
        "knowledge": "ENFJ collaborative_environment의 업무 맥락 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P1.S3",
        "originalRole": "일할 때 나타나는 행동을 묘사한다.",
        "knowledge": "각 담당이 같은 결과를 향하는지 대화하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P1.S4",
        "originalRole": "그 방식의 강점을 설명한다.",
        "knowledge": "일의 의미와 각자의 기여가 보일 때 활용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:workplace:collaborative_environment",
        "auditRef": "source-catalog.json#1ad06916b42f0eb3ee39",
        "sourceKind": "mbti_trait",
        "recordSha256": "a122642407d729f4339eaecff56962c62fd39c0c0d5cc2a4060caf8880487a7c",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "workplace",
          "traitId": "collaborative_environment",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "condition": "작은 일의 현실 필요도 함께 고려",
        "notIndependentEvidence": true
      },
      {
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
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
    "positive": "역할 간 엇갈린 기대를 조율할 여지",
    "shadow": "팀 분위기를 지키느라 다른 의견을 감춤",
    "factBomb": "좋은 회의 분위기와 같은 목표를 가진 것은 다를 수 있음",
    "twist": "이견을 묻는 것이 공동 목적을 더 선명하게 함",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "과제 목적과 각자 필요한 지원을 확인하는 가상 장면"
    },
    "application": "합의한 목적과 남은 이견을 함께 기록",
    "prerequisites": [
      "실제 업무·공동 목적·trait·참여 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "사회성이 높으면 모든 팀 업무에 적합하다고 단정 금지",
    "distinction": "가족·친구의 친절과 다른 업무 협업의 기준",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "가족·친구의 친절과 다른 업무 협업의 기준",
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
    "id": "cpr:material:CH08.P2:diagnose-assumptions",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "kind": "fusion",
    "readerQuestion": "어떤 역할에 내 기능을 배정할 수 있는가?",
    "coreMeaning": "선택의 전제를 검토하는 역할 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "적합한 업무 역할을 제시한다.",
        "knowledge": "논리·규칙을 비교하는 역할을 과제 수준으로 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "해당 역할에 필요한 능력과 개인적 근거를 연결한다.",
        "knowledge": "편인 탐색 의미와 원천의 규칙·증명 과제 선호를 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "강점이 나타날 수 있는 상황을 보여준다.",
        "knowledge": "두 안이 서로 다른 가정에 기대는지 확인하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "능력이 인정받는 조건을 설명한다.",
        "knowledge": "판단 목적·자료 접근·결정권이 있어야 기여",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "sourceId": "mbti:INTJ:career:science_tech_law_fit",
        "auditRef": "source-catalog.json#7c9e075f5b0a5dcf9ca2",
        "sourceKind": "mbti_trait",
        "recordSha256": "e7d3ccc3ff0c555085ebf85eab220b86aa3b93055878cf19345158e5baa10fb5",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "career",
          "traitId": "science_tech_law_fit",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C008",
        "auditRef": "source-catalog.json#18a6c74116928b26372a",
        "sourceKind": "fusion_research",
        "recordSha256": "99a429658319fa1f86cf184d2840dde43885d741790f70942d006c2edda39e53",
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
        "axis": "STRATEGY",
        "id": "sar:facet:STRATEGY:route-comparison",
        "definition": "목적에 이르는 여러 경로를 비교",
        "condition": "목적·자원·기한이 명시된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "condition": "주장 사실과 감정 경험을 구분",
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
    "positive": "잘못된 전제로 시작할 재작업을 줄일 여지",
    "shadow": "직업명 목록을 개인의 천직으로 확정",
    "factBomb": "논리적인 원천이 모든 전문 자격을 대신하지 않음",
    "twist": "답을 고르기보다 질문을 고치는 역할이 중요할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "두 계획의 가정과 미확인 자료를 나누는 가상 장면"
    },
    "application": "다음 결정을 바꿀 전제만 확인",
    "prerequisites": [
      "실제 원국·trait·자격·업무 경험·과제 요구 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "과학자·법률가 등 직업 적합·취업 결과 보장 금지",
    "distinction": "CH05 분석 기능에서 어떤 업무 질문에 배정할지로 이동",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 분석 기능에서 어떤 업무 질문에 배정할지로 이동",
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
    "id": "cpr:material:CH08.P2:handoff-continuity",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "kind": "mbti",
    "readerQuestion": "어떤 역할에 내 기능을 배정할 수 있는가?",
    "coreMeaning": "다음 담당이 이어갈 수 있게 기록하는 역할 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "적합한 업무 역할을 제시한다.",
        "knowledge": "반복 업무의 완료·인계 조건을 다루는 역할",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "해당 역할에 필요한 능력과 개인적 근거를 연결한다.",
        "knowledge": "규칙·약속 이행 원천을 실제 수행과 별도로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "강점이 나타날 수 있는 상황을 보여준다.",
        "knowledge": "진행 상태와 다음 확인 시점을 남기는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "능력이 인정받는 조건을 설명한다.",
        "knowledge": "담당·기한·공유 체계가 있을 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTJ:workplace:rule_following_reliability",
        "auditRef": "source-catalog.json#b54b44778d3ddfda8eae",
        "sourceKind": "mbti_trait",
        "recordSha256": "dc2a76ff9861115a8f5deec7caced0c891029bfdcdb3b3e72f48f7f84b4043fe",
        "sourceFileSha256": "dfeda4d6607b2ee991ae6334b357af4aaae7000985b64a014b62bb0cad8d586a",
        "originalState": {
          "type": "ISTJ",
          "area": "workplace",
          "traitId": "rule_following_reliability",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "STABILITY",
        "id": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "팀이 같은 일을 다시 묻지 않고 이어갈 여지",
    "shadow": "본인만 아는 방법이 제일 안정적이라 생각",
    "factBomb": "나만 할 수 있는 절차는 안정성의 빈칸일 수 있음",
    "twist": "인수인계가 쉬워지면 본인도 새 일을 배울 여력이 생김",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "현재 상태·남은 위험·다음 담당을 적는 가상 장면"
    },
    "application": "기록의 사용자와 갱신 주기를 정함",
    "prerequisites": [
      "실제 반복 업무·수행·trait·정보 공유 권한 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "꼼꼼함을 전제해 미경험 업무를 맡기지 않음",
    "distinction": "사회적 신뢰보다 직무가 끊기지 않는 실제 구조",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "사회적 신뢰보다 직무가 끊기지 않는 실제 구조",
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
    "id": "cpr:material:CH08.P2:explain-use-for-people",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "kind": "mbti",
    "readerQuestion": "어떤 역할에 내 기능을 배정할 수 있는가?",
    "coreMeaning": "사용자가 이해하고 해볼 수 있게 안내하는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "적합한 업무 역할을 제시한다.",
        "knowledge": "설명·교육·사용 지원의 과제 역할 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "해당 역할에 필요한 능력과 개인적 근거를 연결한다.",
        "knowledge": "사람의 성장 지원 원천은 교육 자격과 구별",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "강점이 나타날 수 있는 상황을 보여준다.",
        "knowledge": "같은 설명을 받은 사람이 어느 단계에서 멈추는지 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "능력이 인정받는 조건을 설명한다.",
        "knowledge": "실제 배울 목적·권한·수신자 피드백이 있어야 기여",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:career:teacher_facilitator_fit",
        "auditRef": "source-catalog.json#0041c8de2fd1fe3af227",
        "sourceKind": "mbti_trait",
        "recordSha256": "bbec68b70ad35e7e0f016e664a3491709df63d29634c024203d15cdafb6d08b4",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "career",
          "traitId": "teacher_facilitator_fit",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "condition": "다른 점을 비교하고 시험할 수 있을 때",
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
    "positive": "안내와 실제 수행의 간격을 줄일 여지",
    "shadow": "좋은 의도가 있으면 설명도 잘한다고 판단",
    "factBomb": "열정적인 설명과 상대가 쓸 수 있는 설명은 다름",
    "twist": "질문을 받을 시간을 남기는 것이 교육의 일부",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 절차를 보여준 뒤 직접 한 단계를 해보게 하는 가상 장면"
    },
    "application": "상대의 재현·막힌 부분·다음 연습을 확인",
    "prerequisites": [
      "실제 업무·경험·자격·trait·수신 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "교사·상담사 천직·자격·심리치료 능력 보장 금지",
    "distinction": "종합의 역할 후보이며 커리어 전문 상품 대체 아님",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "종합의 역할 후보이며 커리어 전문 상품 대체 아님",
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
    "id": "cpr:material:CH08.P3:control-without-method-space",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "kind": "mbti",
    "readerQuestion": "어떤 환경 조건이 기능을 막을 수 있는가?",
    "coreMeaning": "방법 재량이 없고 이유도 모를 때의 불편 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "힘들어할 수 있는 환경을 제시한다.",
        "knowledge": "결과 기준 없이 모든 동작을 통제하는 환경",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "왜 해당 환경이 불편할 수 있는지 설명한다.",
        "knowledge": "ISTP anti_micromanagement 원천의 실제 업무 맥락 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "반복하기 쉬운 실수를 묘사한다.",
        "knowledge": "필수 절차와 불필요한 통제를 같이 거부할 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "더 적합한 환경의 조건을 설명한다.",
        "knowledge": "목적·필수 기준은 명확하고 방법 재량이 남는 환경 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISTP:workplace:anti_micromanagement",
        "auditRef": "source-catalog.json#c4c9446c351f8635705c",
        "sourceKind": "mbti_trait",
        "recordSha256": "cf77535e83aaeeb8f03e95e64f3c70a24a4cf2f9ad3ce9025ccf5f6341e661f9",
        "sourceFileSha256": "c40672de642913263c8cda23efba1c1ac70f34b5bfca6ce29820ff32a2e41e57",
        "originalState": {
          "type": "ISTP",
          "area": "workplace",
          "traitId": "anti_micromanagement",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:method-discretion",
        "definition": "합의된 결과 안에서 방법을 고름",
        "condition": "업무·계약의 실제 재량 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "STRUCTURE_STYLE",
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
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
    "positive": "실제 쓸 방법을 개선할 여지",
    "shadow": "규칙을 싫어하니 독립 창업해야 한다고 결론",
    "factBomb": "간섭이 싫다는 선호가 안전 절차의 면제는 아님",
    "twist": "필수선을 합의하면 방법 선택은 넓어질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작업 지시에서 필수 단계와 재량 부분을 묻는 가상 장면"
    },
    "application": "불편의 종류·실제 권한·변경 가능한 방법을 구분",
    "prerequisites": [
      "실제 환경·trait·자격·안전·업무 계약 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "퇴사·창업을 운명적 해법으로 권장 금지",
    "distinction": "환경 조건을 직업 전체의 부적합으로 확대하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "환경 조건을 직업 전체의 부적합으로 확대하지 않음",
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
    "id": "cpr:material:CH08.P3:changing-standard-without-log",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "kind": "mbti",
    "readerQuestion": "어떤 환경 조건이 기능을 막을 수 있는가?",
    "coreMeaning": "기준이 계속 바뀌는데 변경 이유가 공유되지 않는 환경",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "힘들어할 수 있는 환경을 제시한다.",
        "knowledge": "순서와 기준을 확인하기 어려운 상황 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "왜 해당 환경이 불편할 수 있는지 설명한다.",
        "knowledge": "ISFJ 구체 기준 선호와 실제 불편의 조건 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "반복하기 쉬운 실수를 묘사한다.",
        "knowledge": "이전 기준을 지키다가 바뀐 결과와 어긋나는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "더 적합한 환경의 조건을 설명한다.",
        "knowledge": "목적·변경 사항·인계 시점이 공유되는 환경 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:workplace:guideline_micro_manager",
        "auditRef": "source-catalog.json#b2d8c079b6947d1e86cc",
        "sourceKind": "mbti_trait",
        "recordSha256": "4cd49117c76236fde2a61e0bbc7f2fe289e1b99ba1ad3699443b644628f66352",
        "sourceFileSha256": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
        "originalState": {
          "type": "ISFJ",
          "area": "workplace",
          "traitId": "guideline_micro_manager",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "STRUCTURE_STYLE",
        "id": "sar:facet:STRUCTURE_STYLE:change-log",
        "definition": "계획 변경을 서로 확인 가능한 기록으로 남김",
        "condition": "공동 일정이나 담당이 바뀔 때",
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
        "order"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "예측 가능한 정보가 수행을 도울 여지",
    "shadow": "변화를 못 견디는 사람이라고 능력화",
    "factBomb": "바뀐 조건을 못 들은 것을 적응력 부족으로 채점하지 않음",
    "twist": "변경 기록이 있으면 새 방법도 안정적으로 시도할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "요청 수정의 이유와 새 완료 조건을 기록하는 가상 장면"
    },
    "application": "이전 기준·변경 이유·영향받는 담당을 확인",
    "prerequisites": [
      "실제 업무 상황·정보 접근·trait·합의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "새로운 업무 자체를 부적합으로 단정 금지",
    "distinction": "CH02 안정 상징보다 실제 업무의 정보 가시성",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH02 안정 상징보다 실제 업무의 정보 가시성",
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
    "id": "cpr:material:CH08.P3:feedback-never-reaches-work",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "kind": "mbti",
    "readerQuestion": "어떤 환경 조건이 기능을 막을 수 있는가?",
    "coreMeaning": "실제 사용자 반응을 확인할 수 없는 환경의 불편 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "힘들어할 수 있는 환경을 제시한다.",
        "knowledge": "형식·승인만 있고 결과의 쓰임이 보이지 않는 환경",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "왜 해당 환경이 불편할 수 있는지 설명한다.",
        "knowledge": "현장·사람 반응 선호와 별개인 실제 업무 조건 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "반복하기 쉬운 실수를 묘사한다.",
        "knowledge": "즉흥 변경으로 승인 절차를 빠뜨릴 수 있는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "더 적합한 환경의 조건을 설명한다.",
        "knowledge": "필수 승인 안에서 작은 사용자 확인이 가능한 환경 질문",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ESFP:workplace:anti_bureaucracy_work",
        "auditRef": "source-catalog.json#af11cbc3b971aff61984",
        "sourceKind": "mbti_trait",
        "recordSha256": "d98fbc035ba01882f404c6e6afd2172039165ad9d98e66f3682212b421e71bd5",
        "sourceFileSha256": "b22468fccc71563e5d256aa160d778fa3c61f582e1ead73caea369402a0f1248",
        "originalState": {
          "type": "ESFP",
          "area": "workplace",
          "traitId": "anti_bureaucracy_work",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "PRACTICALITY",
        "id": "sar:facet:PRACTICALITY:use-test",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "SOCIAL_ATTUNEMENT",
        "id": "sar:facet:SOCIAL_ATTUNEMENT:context-adjustment",
        "definition": "상황에 맞게 전달·참여를 조절",
        "condition": "안전하게 이견을 말할 통로가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "flexible"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "실제 피드백을 개선 과제로 바꿀 여지",
    "shadow": "유형만으로 관료 조직·사무직을 못 한다고 확정",
    "factBomb": "답답한 절차와 꼭 필요한 절차를 한꺼번에 지우지 않음",
    "twist": "짧은 피드백 통로가 기존 절차의 쓰임을 보여줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "필수 승인 후 한 부분의 사용 반응을 받는 가상 장면"
    },
    "application": "필수 통제와 시험 가능한 범위를 구분",
    "prerequisites": [
      "실제 환경·trait·정보 권한·안전·시험 승인 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "공식 승인·개인정보·안전 통제를 우회 금지",
    "distinction": "일반 환경 선호를 특정 직업의 성공 예측으로 만들지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "일반 환경 선호를 특정 직업의 성공 예측으로 만들지 않음",
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
    "id": "cpr:material:CH08.P4:learn-with-feedback",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "kind": "mbti",
    "readerQuestion": "현재 상태에서 무엇을 어떻게 익힐 수 있는가?",
    "coreMeaning": "현재 상태에 맞춰 익힌 것을 재현하는 성장 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "현재 입력한 직업 상태를 반영한다.",
        "knowledge": "실제 jobStatus의 과제·시간 조건을 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "적합한 학습·성장 방식을 설명한다.",
        "knowledge": "구체적 자료·연습·다시 꺼내 쓰는 학습 방식 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "실제로 시도할 수 있는 행동을 제안한다.",
        "knowledge": "학생이면 실제 과제, 직장인이면 실제 업무의 한 단계로 시험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "강점을 장기적으로 발전시키는 방향으로 마무리한다.",
        "knowledge": "익힌 방법을 다른 날에도 재현할 수 있는 성장",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:study:dutiful_study_rhythm",
        "auditRef": "source-catalog.json#518e597eb9bf5d2febcc",
        "sourceKind": "mbti_trait",
        "recordSha256": "07729ac8cc8c59714e2f703657166b994c1c19462fcd0df01b887ffc30b981d8",
        "sourceFileSha256": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
        "originalState": {
          "type": "ISFJ",
          "area": "study",
          "traitId": "dutiful_study_rhythm",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "condition": "현재 조건이 배운 조건과 맞는지 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
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
    "positive": "작은 반복에서 이해의 빈칸을 찾을 여지",
    "shadow": "정해진 방식만 따라야 배운다고 단정",
    "factBomb": "깔끔한 노트가 다시 해낼 수 있는 능력은 아님",
    "twist": "짧은 재현이 더 긴 복습보다 필요한 질문을 알려줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "배운 순서를 다음 날 자료 없이 한 번 해보는 가상 장면"
    },
    "application": "틀린 지점 하나를 확인해 다음 연습에 반영",
    "prerequisites": [
      "실제 상태·학습 목표·원천 trait·시간·접근성 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 학교·직장·성적·자격을 임의로 만들어내지 않음",
    "distinction": "개인 상태를 실제 enum으로만 반영하는 성장 응용",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "개인 상태를 실제 enum으로만 반영하는 성장 응용",
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
    "id": "cpr:material:CH08.P4:independent-delivery-learning",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "kind": "natal",
    "readerQuestion": "현재 상태에서 무엇을 어떻게 익힐 수 있는가?",
    "coreMeaning": "독립 수행 상태에서 결과의 쓰임을 배우는 성장 후보",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "현재 입력한 직업 상태를 반영한다.",
        "knowledge": "freelancer·self_employed·business_owner가 실제 입력된 때 과제 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "적합한 학습·성장 방식을 설명한다.",
        "knowledge": "제작과 사용 반응을 구분해 익히는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "실제로 시도할 수 있는 행동을 제안한다.",
        "knowledge": "작은 결과를 제공하고 실제 수정 요구 하나를 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "강점을 장기적으로 발전시키는 방향으로 마무리한다.",
        "knowledge": "한 번의 반응을 다음 결과의 기준으로 남기는 성장",
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
        "sourceId": "csr:profile:siksang_saengjae",
        "auditRef": "source-catalog.json#990b775374ed3ed549cb",
        "sourceKind": "natal_research",
        "recordSha256": "db31bcd17d9ffa13b894a36c61b85fe807a91c339d1cc18c24a925730826a9e4",
        "sourceFileSha256": "eb37214f9d61fb3da6c4ea836c856ffacad18521ae32645fdc4e0404b42e8fc4",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": false,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": {
            "classification": "A_DETECTED_CANDIDATE",
            "lineageOrDefinitionVaries": false,
            "insufficientForTraditionalFormation": true,
            "v4RuleIds": [
              "outputCreatesWealth"
            ],
            "legacyPatternCodes": [],
            "actualBehavior": "V4 buildMyeongliStructure: rule별 연결·기반·억제 및 시주 민감도 확인 후 후보. 고전 격국·취용의 완성 판정 아님.",
            "codeRefs": [
              "src/lib/interpretation-v4/structureRules.ts",
              "src/lib/interpretation-v4/structureEvidence.ts"
            ],
            "runtimeEvidenceIds": []
          },
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "condition": "다른 점을 비교하고 시험할 수 있을 때",
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
    "positive": "설명·제작·유지 책임을 구체화할 여지",
    "shadow": "원국의 구조를 현재 사업 성공으로 해석",
    "factBomb": "고객이라는 단어를 실제 직업 입력 없이 붙이지 않음",
    "twist": "더 큰 산출보다 작은 사용 시험이 성장을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "실제 맡은 과제의 견본과 수정 범위를 확인하는 가상 장면"
    },
    "application": "완료·수신 피드백·유지 책임을 서로 구분",
    "prerequisites": [
      "실제 jobStatus·detailJob·원국 성립·사용 과제·권한 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "독립 직업 미입력 또는 구조 미성립이면 해당 적용 보류",
    "distinction": "수입 확장이 아니라 일하는 방식의 배움",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "수입 확장이 아니라 일하는 방식의 배움",
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
    "id": "cpr:material:CH08.P4:return-from-manageable-step",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "kind": "natal",
    "readerQuestion": "현재 상태에서 무엇을 어떻게 익힐 수 있는가?",
    "coreMeaning": "쉬는 상태·돌봄 상태에도 본인이 고르는 배움의 여건",
    "roleContributions": {
      "S1": {
        "address": "CH08.P4.S1",
        "originalRole": "현재 입력한 직업 상태를 반영한다.",
        "knowledge": "unemployed·homemaker·job_seeker 등 실제 입력 상태부터 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P4.S2",
        "originalRole": "적합한 학습·성장 방식을 설명한다.",
        "knowledge": "성과 압박보다 현재 접근 가능한 학습 범위 질문",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P4.S3",
        "originalRole": "실제로 시도할 수 있는 행동을 제안한다.",
        "knowledge": "본인이 원하는 한 과제에 짧은 시간을 남기는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P4.S4",
        "originalRole": "강점을 장기적으로 발전시키는 방향으로 마무리한다.",
        "knowledge": "작게 익힌 것을 다음 선택의 자료로 쌓는 성장",
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
        "sourceId": "foundation:element:wood",
        "auditRef": "source-catalog.json#b1965f3e7683cb322955",
        "sourceKind": "natal_research",
        "recordSha256": "e02ee527b8d29388375b23471cb569eafe8bbb52cb2db8431f886fb9830aec6d",
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
              "knowledge:element_wood",
              "knowledge:element_wood_missing",
              "taxonomy:element_wood_excess",
              "taxonomy:element_wood_missing"
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "RECOVERY_NEED",
        "id": "sar:facet:RECOVERY_NEED:rest-access",
        "definition": "쉬는 방식과 가능한 공간을 확보",
        "condition": "선호·돌봄·경제 제약을 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "growth"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "현재 역할 밖의 관심을 시험할 여지",
    "shadow": "일을 쉬므로 의욕·능력이 낮다고 추정",
    "factBomb": "비어 있는 직업란에 부족한 사람이라는 뜻을 채우지 않음",
    "twist": "작은 배움을 고르는 것도 충분한 다음 선택일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "사용자가 원하는 새 도구 한 단계를 익히는 가상 장면"
    },
    "application": "원하는 목표·가능한 시간·필요한 지원을 본인에게 확인",
    "prerequisites": [
      "실제 상태·원국 의미·본인 희망·생활 여건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구직 성공·재취업 시기·가족 구성·돌봄 대상 추정 금지",
    "distinction": "일하는 상태의 우열 없이 입력 맥락에 맞는 응용",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "일하는 상태의 우열 없이 입력 맥락에 맞는 응용",
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
    "id": "cpr:material:CH08.P2:finish-before-handoff",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "kind": "natal",
    "readerQuestion": "어떤 역할에 내 기능을 배정할 수 있는가?",
    "coreMeaning": "전달 가능한 결과와 합의한 완료 기준을 맞추는 역할",
    "roleContributions": {
      "S1": {
        "address": "CH08.P2.S1",
        "originalRole": "적합한 업무 역할을 제시한다.",
        "knowledge": "제작·정리·인계의 과제 역할 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P2.S2",
        "originalRole": "해당 역할에 필요한 능력과 개인적 근거를 연결한다.",
        "knowledge": "산출·역할 상징을 실제 업무 능력과 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P2.S3",
        "originalRole": "강점이 나타날 수 있는 상황을 보여준다.",
        "knowledge": "받을 사람이 다음 단계에 쓸 결과를 준비하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P2.S4",
        "originalRole": "능력이 인정받는 조건을 설명한다.",
        "knowledge": "요구 조건·권한·완료 기준을 알 때 가치",
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
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
        "craft"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "일의 끝과 다음 담당의 시작을 연결할 여지",
    "shadow": "결과를 만들면 상대의 쓰임도 자동 충족",
    "factBomb": "내가 끝낸 것과 상대가 받을 준비가 된 것은 다름",
    "twist": "작은 인계 질문이 큰 재작업을 막을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "완료한 자료의 필요한 형식과 사용 방법을 확인하는 가상 장면"
    },
    "application": "결과 기준·누락·수신자·다음 담당을 확인",
    "prerequisites": [
      "실제 원국·직업 상태·과제·경험·수신 요구 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "미입력 직무·자격·성과·MBTI를 만들지 않음",
    "distinction": "종합의 기능별 역할 후보이며 천직 추천 아님",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "종합의 기능별 역할 후보이며 천직 추천 아님",
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
    "id": "cpr:material:CH08.P3:learning-without-access",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "kind": "natal",
    "readerQuestion": "어떤 환경 조건이 기능을 막을 수 있는가?",
    "coreMeaning": "배울 자료·질문 통로가 없는 환경의 조건부 불편",
    "roleContributions": {
      "S1": {
        "address": "CH08.P3.S1",
        "originalRole": "힘들어할 수 있는 환경을 제시한다.",
        "knowledge": "새 과제를 맡았는데 학습 자원에 접근하기 어려운 상황",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH08.P3.S2",
        "originalRole": "왜 해당 환경이 불편할 수 있는지 설명한다.",
        "knowledge": "원국의 지원·학습 의미와 실제 자료 접근을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH08.P3.S3",
        "originalRole": "반복하기 쉬운 실수를 묘사한다.",
        "knowledge": "모르는 부분을 감추거나 조사만 늘릴 수 있는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH08.P3.S4",
        "originalRole": "더 적합한 환경의 조건을 설명한다.",
        "knowledge": "기본 자료·질문 기한·시험 공간이 있는 환경 질문",
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
        "sourceId": "csr:profile:support_restraint",
        "auditRef": "source-catalog.json#a32d64e88e12354af8a1",
        "sourceKind": "natal_research",
        "recordSha256": "e6e25e6ab7078a69917053be8ef03b15ee92a6ba371d3d1c477f872bfd2af05c",
        "sourceFileSha256": "9e8b763c0d42d8850cfbb93dba61b59f4688a76a2935fe19ed556a3e5a696d71",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": false,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": {
            "classification": "C_KNOWLEDGE_ONLY",
            "lineageOrDefinitionVaries": true,
            "insufficientForTraditionalFormation": true,
            "v4RuleIds": [],
            "legacyPatternCodes": [],
            "actualBehavior": "기존 지식 정의만 있고 완전한 성립·취용 판정 미지원.",
            "codeRefs": [
              "src/lib/saju/constants.ts",
              "src/lib/saju/types.ts",
              "src/lib/interpretation-v4/strength.ts"
            ],
            "runtimeEvidenceIds": []
          },
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
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
    "positive": "필요한 배움을 구체적인 지원 요청으로 만들 여지",
    "shadow": "지원이 없으면 반드시 실패한다고 해석",
    "factBomb": "혼자 배우라는 말도 필요한 접근 권한을 대신하지는 않음",
    "twist": "질문을 좁히면 제한된 지원을 더 잘 쓸 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "낯선 과제의 필요한 자료와 문의할 담당을 찾는 가상 장면"
    },
    "application": "실제 접근성·과제 요구·지원 가능성을 확인",
    "prerequisites": [
      "실제 원국·구조 조건·직무 상태·학습 필요 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "직장 부당함·능력 부족·실제 실패를 확정 금지",
    "distinction": "MBTI 없이도 과제의 학습 여건을 구체적으로 묻는 응용",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "MBTI 없이도 과제의 학습 여건을 구체적으로 묻는 응용",
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
