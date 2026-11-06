/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH03_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH03.P1:question-roots",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "kind": "fusion",
    "readerQuestion": "정확히 같은 대상·방향을 가리키는가?",
    "coreMeaning": "질문을 끝까지 좁히는 좁은 공통 의미",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "가장 강하게 일치하는 특징을 소개한다.",
        "knowledge": "이유를 확인하려는 점에서 조건부 일치 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "편인의 탐구 상징은 원국의 위치·유효성이 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "해당 MBTI 근거를 제시한다.",
        "knowledge": "INTP why_question_loop의 실제 primary trait를 별도로 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "공통 특징이 생활에서 어떻게 드러날 수 있는지 설명한다.",
        "knowledge": "고장 원인 하나를 검증하는 과제에서 공통 기능을 비교",
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
        "sourceId": "mbti:INTP:thinkingStyle:why_question_loop",
        "auditRef": "source-catalog.json#c51bdfb609a17396351d",
        "sourceKind": "mbti_trait",
        "recordSha256": "47d9a3968e95fec9bc328ed27f3cd38f057c65d86d473fc05f2480cb92d1faad",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "thinkingStyle",
          "traitId": "why_question_loop",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:intp-inquiry",
        "auditRef": "source-catalog.json#af39b884c2b1f1d16a4c",
        "sourceKind": "fusion_research",
        "recordSha256": "965f049dc309d8b7e27e0613703053ebd74e93abf10a97d82f36592d737a2a99",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
        "axis": "CURIOSITY",
        "id": "sar:facet:CURIOSITY:question-making",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "research"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "모호한 문제를 답할 수 있는 질문으로 바꿀 여지",
    "shadow": "공통 표현 두 개를 성격의 두 배 확신으로 처리",
    "factBomb": "서로 다른 설명이 같은 질문만 가리킬 수도 있음",
    "twist": "질문의 수를 줄이면 탐구가 더 깊어질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "문제의 관찰과 가설을 나누는 가상 장면"
    },
    "application": "답이 나오면 달라질 결정부터 적음",
    "prerequisites": [
      "편인·해당 INTP trait·동일 대상·원천 lineage 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "유형 prior만 있거나 질문 대상이 다르면 일치 보류",
    "distinction": "CH01 소개보다 양측의 정확한 공통 기능을 좁힘",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH01 소개보다 양측의 정확한 공통 기능을 좁힘",
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
    "id": "cpr:material:CH03.P1:learn-with-practice",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "kind": "fusion",
    "readerQuestion": "정확히 같은 대상·방향을 가리키는가?",
    "coreMeaning": "실제로 해보며 익히는 공통 기능의 조건",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "가장 강하게 일치하는 특징을 소개한다.",
        "knowledge": "만져보고 되짚는 학습 방식이라는 비교 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "식신의 산출 상징과 실제 원국 조건을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "해당 MBTI 근거를 제시한다.",
        "knowledge": "ISTP hands_on_learning 원천의 수행 선호를 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "공통 특징이 생활에서 어떻게 드러날 수 있는지 설명한다.",
        "knowledge": "설명·수행·되돌아보기가 가능한 과제에서 검토",
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
      },
      {
        "sourceId": "fkr:legacy:istp-study",
        "auditRef": "source-catalog.json#fe2706c113dbf5f98506",
        "sourceKind": "fusion_research",
        "recordSha256": "2f9ad989e1a508c8a6a028b54fceafb18355e73969017c5b709aef6c4478f67e",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "condition": "현재 조건이 배운 조건과 맞는지 확인",
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
    "positive": "읽은 내용을 수행 결과로 확인할 여지",
    "shadow": "실습 선호를 이론 학습 능력의 부족으로 바꿈",
    "factBomb": "손이 빠르다는 말로 이해 확인을 건너뛰지 않음",
    "twist": "짧은 설명이 실습의 시행착오를 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "안전한 연습 도구로 익힌 단계를 재현하는 가상 장면"
    },
    "application": "한 단계 수행 후 왜 작동했는지 확인",
    "prerequisites": [
      "실제 식신·ISTP trait·실습 권한·안전·학습 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "위험한 작업·필수 교육 미이수면 직접 시험 권장 금지",
    "distinction": "전문 직업 적성 대신 같은 학습 과제의 공통 기능",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "전문 직업 적성 대신 같은 학습 과제의 공통 기능",
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
    "id": "cpr:material:CH03.P1:promise-and-regularity",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "kind": "fusion",
    "readerQuestion": "정확히 같은 대상·방향을 가리키는가?",
    "coreMeaning": "예측 가능한 약속을 선호한다는 좁은 비교",
    "roleContributions": {
      "S1": {
        "address": "CH03.P1.S1",
        "originalRole": "가장 강하게 일치하는 특징을 소개한다.",
        "knowledge": "반복 가능한 기준을 만드는 점에서 일치 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P1.S2",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "정재의 관리 상징은 실제 원국 조건으로 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P1.S3",
        "originalRole": "해당 MBTI 근거를 제시한다.",
        "knowledge": "ISTJ 원천의 안정적 공동생활 설명은 해당 영역에 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P1.S4",
        "originalRole": "공통 특징이 생활에서 어떻게 드러날 수 있는지 설명한다.",
        "knowledge": "개인이 실제 합의한 반복 약속에서만 연결",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#a749994676901e70caf3",
        "sourceKind": "natal_research",
        "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
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
              "knowledge:ten_god_zheng_cai",
              "taxonomy:ten_god_zheng_cai"
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
        "sourceId": "mbti:ISTJ:marriage:fixed_role_and_budget",
        "auditRef": "source-catalog.json#f728f5dc57175a43afd6",
        "sourceKind": "mbti_trait",
        "recordSha256": "cf342a791bcdb1515b83c8fd88c4eb8f2d94ee89a11dc1bd9f02f9afbb763c7e",
        "sourceFileSha256": "7265a4245d939ec8b8152c95928c1f21260f7074f6e39468b923e3e1dd01181e",
        "originalState": {
          "type": "ISTJ",
          "area": "marriage",
          "traitId": "fixed_role_and_budget",
          "sourceCoverage": "inferred",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:istj-marriage",
        "auditRef": "source-catalog.json#05ab0d2c6c7faa658dc4",
        "sourceKind": "fusion_research",
        "recordSha256": "e30083e5641ec68255fb790b4e8dd9bb10dee7594620035793c816881d5d0f46",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
        }
      },
      {
        "sourceId": "deep:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#69c5faa4894c11e466cb",
        "sourceKind": "natal_research",
        "recordSha256": "c5190449e4eac664419b628d879f0413f683ed7418d0a7b136d474d3d19dd59a",
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
        "id": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "STABILITY",
        "id": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "steady"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "불확실한 기대를 확인할 말과 기록을 만들 여지",
    "shadow": "결혼 원천을 모든 영역의 성실함으로 이동",
    "factBomb": "유형이 약속 이행을 대신 보증하지 않음",
    "twist": "약속을 갱신하는 방식이 지속성을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 일정의 주기와 변경 조건을 묻는 가상 장면"
    },
    "application": "적용 영역을 공동생활로 명시하고 본인 맥락 확인",
    "prerequisites": [
      "실제 정재·해당 trait의 inferred 상태·공동생활 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 맥락이 없으면 분야 이전을 보류; 결혼 존재 가정 금지",
    "distinction": "일치 후보에도 Domain 제한이 있다는 정보를 전달",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "일치 후보에도 Domain 제한이 있다는 정보를 전달",
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
    "id": "cpr:material:CH03.P2:resource-versus-goal",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "kind": "fusion",
    "readerQuestion": "비슷한 장점의 원인은 정말 같은가?",
    "coreMeaning": "자원 교환의 원국 상징과 성과 보상 선호의 역할 차이",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "명리가 설명하는 타고난 경향을 제시한다.",
        "knowledge": "편재는 원국에서 자원·교환 의미로 읽는 상징",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "MBTI가 설명하는 행동 선호를 제시한다.",
        "knowledge": "ENTJ 원천은 눈에 보이는 성과를 선호하는 유형 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "두 결과가 실제로 만나는 상황을 설명한다.",
        "knowledge": "실제 보상 협의라는 같은 과제에서만 두 역할이 만남",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "함께 분석했을 때 새롭게 알 수 있는 점을 제시한다.",
        "knowledge": "원하는 총액과 실제 남는 몫을 따로 볼 정보",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:pian_cai",
        "auditRef": "source-catalog.json#2a75493cd45d713bdf99",
        "sourceKind": "natal_research",
        "recordSha256": "b2ced2072ff8bd848e6ff31903bbcde59b742102f5f3893e8b72bf8ea21dd966",
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
              "knowledge:ten_god_pian_cai",
              "taxonomy:ten_god_pian_cai"
            ]
          },
          "deferred": [
            "전통의 육친·성별 역할과 현대의 대등한 가족 관계는 구분하며 현대 고객 사실에 자동 대입하지 않는다.",
            "이 항목의 생활 적용은 편집자의 조건부 예시이며 전통 명리 사실로 검증된 것은 아니다.",
            "외부·공동 재물이라는 편재의 전통 비유는 卷六 후반의 전사 경고로 독립 판본 대조 전 보류한다."
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
        "sourceId": "mbti:ENTJ:money:high_earning_orientation",
        "auditRef": "source-catalog.json#c6e503b19c659758ddbf",
        "sourceKind": "mbti_trait",
        "recordSha256": "8d25e8024b2b4a93eb5117d5f62a609e45e8188aef99eea80e1386d8ca85b4bf",
        "sourceFileSha256": "93f94a0956a804629bdcb386dcd7938fbe8b8f029daed06cb9140692dd185b4c",
        "originalState": {
          "type": "ENTJ",
          "area": "money",
          "traitId": "high_earning_orientation",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:entj-wealth",
        "auditRef": "source-catalog.json#9854f8b4cdd00c332c03",
        "sourceKind": "fusion_research",
        "recordSha256": "0e546bce64df83fb904123590133c9b8567f71ed7fec98f9cf5af10fd22028d7",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
        }
      },
      {
        "sourceId": "deep:ten_god:pian_cai",
        "auditRef": "source-catalog.json#cba470d32e5f7d39af02",
        "sourceKind": "natal_research",
        "recordSha256": "8a54a02d908cc223152e32dd526251df907f3f944f39a97a1ec6267767a2aca5",
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
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "GOAL_DRIVE",
        "id": "sar:facet:GOAL_DRIVE:progress-feedback",
        "definition": "진행 결과와 목적의 차이를 확인",
        "condition": "목표와 지표의 관계가 명확할 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "resources"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "목표의 크기와 유지 비용을 함께 확인할 여지",
    "shadow": "돈을 원한다는 설명을 돈을 번다는 계산으로 전환",
    "factBomb": "매출 목표와 내 통장 잔액은 같은 문장이 아님",
    "twist": "작은 보상이 더 많은 선택권을 남길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "제안의 총액과 비용·담당 범위를 분리하는 가상 장면"
    },
    "application": "총액·시간·지원·순수하게 남는 몫을 따로 적음",
    "prerequisites": [
      "편재·실제 money trait·본인 목표·계약 조건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "소득·자산 입력이 없으면 금액·성공 추정 금지",
    "distinction": "CH09와 달리 양측이 다른 질문에 답한다는 비교 원리",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09와 달리 양측이 다른 질문에 답한다는 비교 원리",
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
    "id": "cpr:material:CH03.P2:support-received-and-given",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "kind": "fusion",
    "readerQuestion": "비슷한 장점의 원인은 정말 같은가?",
    "coreMeaning": "귀인 수혜와 타인을 돕는 행동은 서로 다른 방향",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "명리가 설명하는 타고난 경향을 제시한다.",
        "knowledge": "귀인은 전통적으로 도움 가능성의 상징으로 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "MBTI가 설명하는 행동 선호를 제시한다.",
        "knowledge": "ENFJ 원천의 실제 도움 제공 선호를 별도로 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "두 결과가 실제로 만나는 상황을 설명한다.",
        "knowledge": "도움을 요청하고 제공하는 방향은 실제 관계에서 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "함께 분석했을 때 새롭게 알 수 있는 점을 제시한다.",
        "knowledge": "같은 도움이라는 단어가 동등한 사실이 아님을 전달",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:cheoneul",
        "auditRef": "source-catalog.json#63dccadfb76cf92d7af3",
        "sourceKind": "natal_research",
        "recordSha256": "043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
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
              "SHINSAL_RULES:CHEON_EUL_GWIIN"
            ],
            "legacyRefs": [
              "knowledge:nobleman_cheoneul",
              "taxonomy:gwiin_cheoneul",
              "shinsal:CHEON_EUL_GWIIN"
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
        "sourceId": "fkr:legacy:enfj-help",
        "auditRef": "source-catalog.json#e4aee758d586cfbd2004",
        "sourceKind": "fusion_research",
        "recordSha256": "90b1b4e7948feff6dae7c97d41d00c2489419a656d6a8eb176acdc8f193af206",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "자신도 지원을 요청할 수 있다는 질문을 열어 둠",
    "shadow": "귀인이 있으니 착하고 타인을 돕는다고 추론",
    "factBomb": "받는 도움을 주는 능력으로 자동 환전하지 않음",
    "twist": "지원을 받을 줄 아는 것이 도움을 지속하게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "지원 요청과 내가 가능한 도움을 따로 말하는 가상 장면"
    },
    "application": "수혜·제공 주체와 동의·여력을 별도로 확인",
    "prerequisites": [
      "실제 귀인 검출·원래 전통 상태·ENFJ trait·현대 적용 추가 검증 필요",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "개인 행동·도움 경로가 없으면 일치 승인 금지",
    "distinction": "현재 legacy help 연결의 비동등성을 숨기지 않는 검토 자료",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "현재 legacy help 연결의 비동등성을 숨기지 않는 검토 자료",
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
    "id": "cpr:material:CH03.P2:output-and-meaning",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "kind": "fusion",
    "readerQuestion": "비슷한 장점의 원인은 정말 같은가?",
    "coreMeaning": "산출의 상징과 내적 가치 선호는 표현의 서로 다른 조건",
    "roleContributions": {
      "S1": {
        "address": "CH03.P2.S1",
        "originalRole": "명리가 설명하는 타고난 경향을 제시한다.",
        "knowledge": "식신은 말·작업을 밖으로 만드는 전통 해석의 출처",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P2.S2",
        "originalRole": "MBTI가 설명하는 행동 선호를 제시한다.",
        "knowledge": "INFP Fi 원천은 무엇이 자기 기준에 맞는지의 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P2.S3",
        "originalRole": "두 결과가 실제로 만나는 상황을 설명한다.",
        "knowledge": "실제 전하고 싶은 의견이 있을 때 통로와 이유가 만남",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P2.S4",
        "originalRole": "함께 분석했을 때 새롭게 알 수 있는 점을 제시한다.",
        "knowledge": "내용의 진정성과 전달 방식이 별도라는 새 정보",
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
      },
      {
        "sourceId": "fkr:complement:C057",
        "auditRef": "source-catalog.json#a6bbe9e490777bf3e377",
        "sourceKind": "fusion_research",
        "recordSha256": "e7d45f9cbd9ca5bcf46c4d6ff2931727551de03143a62a1e0aa22e10b7f4b948",
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
        "axis": "MEANING",
        "id": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
    "positive": "의미 있는 뜻을 타인이 검토할 형태로 만들 여지",
    "shadow": "진심만 있으면 오해가 없을 것이라 기대",
    "factBomb": "진심에는 수신 확인이 자동으로 붙지 않음",
    "twist": "짧은 문장이 긴 고백보다 뜻을 잘 보존할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "자기 의견의 중요한 이유를 한 문장으로 고르는 가상 장면"
    },
    "application": "전할 이유와 듣고 바뀔 선택을 따로 확인",
    "prerequisites": [
      "식신·primary trait·표현 주제·수신 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 가치가 미확인되면 가치관을 임의로 만들어내지 않음",
    "distinction": "CH05 표현 재능이 아니라 산출 조건과 가치 조건의 차이",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 표현 재능이 아니라 산출 조건과 가치 조건의 차이",
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
    "id": "cpr:material:CH03.P3:private-social-channel",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "kind": "fusion",
    "readerQuestion": "두 신호는 반대인가 다른 상황인가?",
    "coreMeaning": "사적 정리 상징과 사회적 참여 선호의 조건부 차이",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "실제로 확인된 차이나 긴장을 소개한다.",
        "knowledge": "혼자 정리와 함께 참여를 다른 대상의 신호로 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "명리 측면의 이유를 설명한다.",
        "knowledge": "화개의 전통 상징·원국 위치를 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "MBTI 측면의 이유를 설명한다.",
        "knowledge": "ESFJ 원천은 실제 사회적 적응 설명에 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "상황에 따라 두 모습이 어떻게 달라질 수 있는지 해석한다.",
        "knowledge": "모임 참여 후 사적 검토가 필요할 수 있다는 가설",
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
        "sourceId": "mbti:ESFJ:identity:social_adaptation_engine",
        "auditRef": "source-catalog.json#ce91678d7e3e04f71d90",
        "sourceKind": "mbti_trait",
        "recordSha256": "ec8e811aecd95c0e4a11af7b4c24e24b53e345f1c2c615abf578e657b6a3f912",
        "sourceFileSha256": "896a8bff5171a9cc8146694cbfe6d8b9596b61f99b5ce6826de186d85f29dceb",
        "originalState": {
          "type": "ESFJ",
          "area": "identity",
          "traitId": "social_adaptation_engine",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:esfj-alone",
        "auditRef": "source-catalog.json#bfab3261b5c5ddc01a03",
        "sourceKind": "fusion_research",
        "recordSha256": "0aae89fd87f08ca08b0aca325c9d3393c925361f22b9018cb975ba61278134d9",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
        "axis": "RELATION_STYLE",
        "id": "sar:facet:RELATION_STYLE:shared-participation",
        "definition": "함께할 활동의 참여 방식을 선택",
        "condition": "참여·공개 동의가 있을 때",
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
    "positive": "혼자 정리한 내용을 다음 대화에서 활용할 여지",
    "shadow": "resolved 표시를 실제 고객의 겉과 속 역사로 바꿈",
    "factBomb": "사람을 좋아해도 모든 정리를 사람 앞에서 할 필요는 없음",
    "twist": "조용한 시간이 참여를 줄이는 대신 돕는 조건일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 뒤 의견을 정리해 다음 날 전하는 가상 장면"
    },
    "application": "사적 정리 필요와 다시 응답할 시점을 본인에게 확인",
    "prerequisites": [
      "실제 화개·ESFJ trait·서로 다른 장면·split 검토 필요",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "두 장면의 차이가 없거나 회복이 다른 방식이면 미해결 유지",
    "distinction": "CH04 생활 초상보다 긴장의 대상·상황을 설명",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 생활 초상보다 긴장의 대상·상황을 설명",
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
    "id": "cpr:material:CH03.P3:learn-before-try",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "kind": "fusion",
    "readerQuestion": "두 신호는 반대인가 다른 상황인가?",
    "coreMeaning": "이해할 지원과 먼저 시험할 선호의 학습 순서 차이",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "실제로 확인된 차이나 긴장을 소개한다.",
        "knowledge": "설명부터와 시도부터가 다른 조건에서 유효할 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "명리 측면의 이유를 설명한다.",
        "knowledge": "정인의 습득·지원 의미는 실제 원국에 한정",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "MBTI 측면의 이유를 설명한다.",
        "knowledge": "ESTP experiential_learning의 학습 원천을 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "상황에 따라 두 모습이 어떻게 달라질 수 있는지 해석한다.",
        "knowledge": "안전 비용에 따라 먼저 설명할 부분과 시험할 부분 분리",
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
        "sourceId": "mbti:ESTP:study:experiential_learning",
        "auditRef": "source-catalog.json#961ea1c739908fff88dd",
        "sourceKind": "mbti_trait",
        "recordSha256": "d74635abd854a1f57c2957d408fe15960e1f805ff3206e56ea49c8efa41216ed",
        "sourceFileSha256": "11ff701c4e93b3d5829d06907c4909651c44681d3713a46bf1202b40c23d27e2",
        "originalState": {
          "type": "ESTP",
          "area": "study",
          "traitId": "experiential_learning",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:estp-study",
        "auditRef": "source-catalog.json#e9b8f6fbd26c687ee9db",
        "sourceKind": "fusion_research",
        "recordSha256": "5b223d5a3f2209d7d08debbea08df9f6e9601ed49bacbfce4a5262a627f0ae11",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
        "axis": "ACTION_TEMPO",
        "id": "sar:facet:ACTION_TEMPO:review-window",
        "definition": "행동 전 검토 시간을 배정",
        "condition": "오류 비용과 기한이 모두 주어진 상황",
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
    "positive": "설명과 실습을 서로 보완할 질문으로 사용",
    "shadow": "생각은 정인·행동은 ESTP라는 자동 이중 인격화",
    "factBomb": "빠르게 해보는 것과 모르고 해보는 것은 다름",
    "twist": "실습이 필요한 설명을 더 정확히 고를 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "안전한 연습에서 시험 뒤 필요한 원리를 읽는 가상 장면"
    },
    "application": "위험 점검·작은 시도·설명 보충 순서를 정함",
    "prerequisites": [
      "정인·실제 study trait·안전·과제 난도·분리 조건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "분리 조건이 없으면 TENSION 해석 보류",
    "distinction": "학업 전체보다 특정 학습 단계의 조건 차이",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "학업 전체보다 특정 학습 단계의 조건 차이",
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
    "id": "cpr:material:CH03.P3:save-and-experience",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "kind": "fusion",
    "readerQuestion": "두 신호는 반대인가 다른 상황인가?",
    "coreMeaning": "비축 상징과 경험 지출 선호의 목적 차이",
    "roleContributions": {
      "S1": {
        "address": "CH03.P3.S1",
        "originalRole": "실제로 확인된 차이나 긴장을 소개한다.",
        "knowledge": "남겨둘 몫과 경험할 몫이 다른 목적이라는 대비",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P3.S2",
        "originalRole": "명리 측면의 이유를 설명한다.",
        "knowledge": "정재의 축적 상징은 실제 수입·저축 사실이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P3.S3",
        "originalRole": "MBTI 측면의 이유를 설명한다.",
        "knowledge": "ENFP experience_spending 원천은 유형 선호의 조건부 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P3.S4",
        "originalRole": "상황에 따라 두 모습이 어떻게 달라질 수 있는지 해석한다.",
        "knowledge": "생활 비용이 확인될 때 두 몫의 합의를 검토",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#a749994676901e70caf3",
        "sourceKind": "natal_research",
        "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
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
              "knowledge:ten_god_zheng_cai",
              "taxonomy:ten_god_zheng_cai"
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
        "sourceId": "mbti:ENFP:money:experience_spending",
        "auditRef": "source-catalog.json#8ffef9419a4d9763d49f",
        "sourceKind": "mbti_trait",
        "recordSha256": "a039fb5ebbd332c4df2c1933f7bbb17e7c7681f9e2e96bf771dcd5a6c181b2ae",
        "sourceFileSha256": "552bfacdcd738eadf3685881993df971fe1734ad08d070a9220b70a7f4c3c801",
        "originalState": {
          "type": "ENFP",
          "area": "money",
          "traitId": "experience_spending",
          "sourceCoverage": "inferred",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:enfp-budget",
        "auditRef": "source-catalog.json#d3af1b1f332cbccacc06",
        "sourceKind": "fusion_research",
        "recordSha256": "6da442bba6caa77eab3689cff9afdb0111d1e3c020fadd00d12a970f51f529c8",
        "sourceFileSha256": "92240ecb930bf39b1f09696526c092a03c7ef0e6b02db066a58fb912ff8254c4",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
        }
      },
      {
        "sourceId": "deep:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#69c5faa4894c11e466cb",
        "sourceKind": "natal_research",
        "recordSha256": "c5190449e4eac664419b628d879f0413f683ed7418d0a7b136d474d3d19dd59a",
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
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "condition": "작은 일의 현실 필요도 함께 고려",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "resources"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "비축을 지키면서 원하는 경험의 범위를 정할 여지",
    "shadow": "저축하지 못하는 사람이라고 약점 확정",
    "factBomb": "기억에 남는 소비도 다음 달 비용을 지워 주지는 않음",
    "twist": "작은 경험 예산이 오히려 비축을 유지하게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 지출과 다음 달 필수 비용을 나누는 가상 장면"
    },
    "application": "필수 비용을 확인한 뒤 경험 예산의 한도를 고름",
    "prerequisites": [
      "정재·해당 trait·원래 inferred 연결·실제 가용 자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "재정 입력이 없으면 구체 금액과 소비 경험을 만들지 않음",
    "distinction": "차이를 낭비 성격이 아니라 자원을 쓰는 이유로 설명",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "차이를 낭비 성격이 아니라 자원을 쓰는 이유로 설명",
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
    "id": "cpr:material:CH03.P4:from-question-to-small-proof",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "kind": "fusion",
    "readerQuestion": "검토한 차이를 어떻게 입체적으로 사용할 수 있는가?",
    "coreMeaning": "앞선 탐구 일치를 작은 검증의 순서로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "P1~P3에서 도출된 가장 중요한 결합 해석을 선택한다.",
        "knowledge": "P1의 질문 의미가 실제 소개됐을 때만 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "어떤 조건에서 한쪽 성향이 두드러지는지 설명한다.",
        "knowledge": "원인을 더 알아야 결정이 달라지는 상황에서 탐구가 우선",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "이 차이가 강점으로 작동할 수 있는 상황을 보여준다.",
        "knowledge": "되돌릴 수 있는 수행에서는 작은 검증을 먼저 둘 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "단순 성격 유형만으로 알기 어려운 특징으로 마무리한다.",
        "knowledge": "깊이와 실행은 서로 다른 과제의 사용 순서로 마무리",
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
        "sourceId": "mbti:INTP:thinkingStyle:why_question_loop",
        "auditRef": "source-catalog.json#c51bdfb609a17396351d",
        "sourceKind": "mbti_trait",
        "recordSha256": "47d9a3968e95fec9bc328ed27f3cd38f057c65d86d473fc05f2480cb92d1faad",
        "sourceFileSha256": "8270ca89c4d2c216b82099b796ecee0b88139ad23d0b1bc0949517be9dc4da99",
        "originalState": {
          "type": "INTP",
          "area": "thinkingStyle",
          "traitId": "why_question_loop",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C006",
        "auditRef": "source-catalog.json#3ea24f29f1c7aa0ec702",
        "sourceKind": "fusion_research",
        "recordSha256": "9c73a8d75350c05396561adef2c303d5fd2208d616acf4113afca18f062dd5ec",
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
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:cause-tracing",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
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
        "research"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "과도한 조사와 무근거 실행을 함께 줄일 여지",
    "shadow": "새 재능을 마무리 문단에서 추가",
    "factBomb": "앞에서 읽지 않은 장점을 갑자기 회수하지 않음",
    "twist": "질문을 잠시 보관하는 것이 다음 탐구를 더 좋게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "검증할 가설 하나와 나중 질문을 나누는 가상 장면"
    },
    "application": "앞선 해석·과제 비용·검증 기한을 함께 확인",
    "prerequisites": [
      "CH03.P1~P3 중 실제 소개한 동일 원천·의미가 전제",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "앞선 문단에 없으면 새 결합을 만들어 요약하지 않음",
    "distinction": "일치·긴장 검증 뒤의 응용이며 동일 문장 재설명 아님",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [
      "cpr:material:CH03.P1:question-roots"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "일치·긴장 검증 뒤의 응용이며 동일 문장 재설명 아님",
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
    "id": "cpr:material:CH03.P4:choose-support-mode",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "kind": "fusion",
    "readerQuestion": "검토한 차이를 어떻게 입체적으로 사용할 수 있는가?",
    "coreMeaning": "앞선 수혜·제공 차이를 도움의 선택으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "P1~P3에서 도출된 가장 중요한 결합 해석을 선택한다.",
        "knowledge": "P2의 도움 방향 차이가 실제 소개된 경우 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "어떤 조건에서 한쪽 성향이 두드러지는지 설명한다.",
        "knowledge": "받는 도움은 요청·접근 가능한 자원이 있을 때 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "이 차이가 강점으로 작동할 수 있는 상황을 보여준다.",
        "knowledge": "제공하는 도움은 상대 동의와 자기 여력이 있을 때 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "단순 성격 유형만으로 알기 어려운 특징으로 마무리한다.",
        "knowledge": "같은 사람도 두 역할을 각각 선택할 수 있다는 통합",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:cheoneul",
        "auditRef": "source-catalog.json#63dccadfb76cf92d7af3",
        "sourceKind": "natal_research",
        "recordSha256": "043b49a5e791c3a4e8c18e3984d9f996649a0dbb486aa1ff980837539bac8998",
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
              "SHINSAL_RULES:CHEON_EUL_GWIIN"
            ],
            "legacyRefs": [
              "knowledge:nobleman_cheoneul",
              "taxonomy:gwiin_cheoneul",
              "shinsal:CHEON_EUL_GWIIN"
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
        "sourceId": "fkr:complement:C077",
        "auditRef": "source-catalog.json#a54280dd833c1b7c4394",
        "sourceKind": "fusion_research",
        "recordSha256": "705ba9e944bd88d45841f5e97b2f5f6d40e10c13b21efcf5c5942d28c5672881",
        "sourceFileSha256": "3196e648432ea2a207564bcba11d90693b0bae14a515e9c7a7ef9ec1bb971f9b",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "specific_source_not_yet_bound"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
    "positive": "도움이 책임의 독점으로 번지는 것을 줄일 여지",
    "shadow": "귀인 상징을 실제 호혜 관계의 증명으로 사용",
    "factBomb": "받았으니 갚아야 한다는 도덕 부채를 만들지 않음",
    "twist": "도움의 방법을 고르면 독립성과 지원이 함께 갈 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "조언 요청과 부탁 거절을 각각 정하는 가상 장면"
    },
    "application": "도움 방향·종료 범위·선택권을 명시",
    "prerequisites": [
      "앞선 검토가 유지되고 실제 수혜·제공 조건을 별도 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현대 적용 부족이면 조건부 질문 수준에서 보류",
    "distinction": "성격의 착함 대신 두 도움 역할의 실행 조건",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [
      "cpr:material:CH03.P2:support-received-and-given"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "성격의 착함 대신 두 도움 역할의 실행 조건",
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
    "id": "cpr:material:CH03.P4:keep-joy-and-reserve",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "kind": "fusion",
    "readerQuestion": "검토한 차이를 어떻게 입체적으로 사용할 수 있는가?",
    "coreMeaning": "앞선 돈의 두 목적을 실제 선택 기준으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH03.P4.S1",
        "originalRole": "P1~P3에서 도출된 가장 중요한 결합 해석을 선택한다.",
        "knowledge": "P3의 비축·경험 차이가 실제 소개된 경우 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH03.P4.S2",
        "originalRole": "어떤 조건에서 한쪽 성향이 두드러지는지 설명한다.",
        "knowledge": "필수 생활 조건을 지킬 때 비축 역할을 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH03.P4.S3",
        "originalRole": "이 차이가 강점으로 작동할 수 있는 상황을 보여준다.",
        "knowledge": "개인이 원하는 경험은 남은 여력 안에서 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH03.P4.S4",
        "originalRole": "단순 성격 유형만으로 알기 어려운 특징으로 마무리한다.",
        "knowledge": "다른 선호의 공존을 한 유형의 모순으로 만들지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#a749994676901e70caf3",
        "sourceKind": "natal_research",
        "recordSha256": "7f13e36ff2725cf74251e1ae66f401e14415b1063f4f5990577568e60602866f",
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
              "knowledge:ten_god_zheng_cai",
              "taxonomy:ten_god_zheng_cai"
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
        "sourceId": "mbti:ENFP:money:experience_spending",
        "auditRef": "source-catalog.json#8ffef9419a4d9763d49f",
        "sourceKind": "mbti_trait",
        "recordSha256": "a039fb5ebbd332c4df2c1933f7bbb17e7c7681f9e2e96bf771dcd5a6c181b2ae",
        "sourceFileSha256": "552bfacdcd738eadf3685881993df971fe1734ad08d070a9220b70a7f4c3c801",
        "originalState": {
          "type": "ENFP",
          "area": "money",
          "traitId": "experience_spending",
          "sourceCoverage": "inferred",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C040",
        "auditRef": "source-catalog.json#2a9fd503de69bf0e5b82",
        "sourceKind": "fusion_research",
        "recordSha256": "9bc0f661cb49f8c218fcf0f89893d5c42fe1658be556f6282fa1b844fffbda03",
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
        "sourceId": "deep:ten_god:zheng_cai",
        "auditRef": "source-catalog.json#69c5faa4894c11e466cb",
        "sourceKind": "natal_research",
        "recordSha256": "c5190449e4eac664419b628d879f0413f683ed7418d0a7b136d474d3d19dd59a",
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
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "condition": "작은 일의 현실 필요도 함께 고려",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "resources"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "즐거움과 유지 비용을 함께 질문할 가능성",
    "shadow": "양쪽을 모두 만족시킬 수 있다고 결과 보장",
    "factBomb": "예산의 칸을 나눠도 총자원은 늘지 않음",
    "twist": "이번 기회를 거절하는 것이 다음 경험을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 예산에서 두 경험의 목적을 비교하는 가상 장면"
    },
    "application": "현재 여력과 중요한 이유를 확인한 뒤 선택",
    "prerequisites": [
      "앞선 실제 원천·개인 목적·가용 자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "재정난·공동 비용 미합의이면 지출 제안 보류",
    "distinction": "CH09 관리법보다 앞선 Fusion 차이의 조건부 통합",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [
      "cpr:material:CH03.P3:save-and-experience"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09 관리법보다 앞선 Fusion 차이의 조건부 통합",
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
  }
];
