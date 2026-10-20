/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH02_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH02.P1:wood-earth-map",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "kind": "natal",
    "readerQuestion": "내 원국의 구성과 유효성은 어떻게 다른가?",
    "coreMeaning": "목의 확장 상징과 토의 유지 상징을 분포·계절 안에서 읽기",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "가장 특징적인 오행 구성을 직관적으로 소개한다.",
        "knowledge": "확인된 목·토의 상대적 분포를 먼저 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "상대적으로 두드러지는 기운을 설명한다.",
        "knowledge": "두드러짐은 visible·weighted·월령의 구분을 필요로 함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "다른 기운과의 상호작용을 설명한다.",
        "knowledge": "새로 여는 일과 유지할 바탕은 서로 다른 상징 역할",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "전체적인 기질의 특징을 제시한다.",
        "knowledge": "변화와 정착의 과제가 함께 있을 가능성까지 제시",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "sourceId": "csr:profile:season_command",
        "auditRef": "source-catalog.json#0d44aa1c8497e52cdc20",
        "sourceKind": "natal_research",
        "recordSha256": "8eefe9b90a700346c6352d1e32da3cb0670d02f863d5c76f9a9b6f18f0a68b67",
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
            "classification": "B_FACTS_NO_V4_DETECTOR",
            "lineageOrDefinitionVaries": true,
            "insufficientForTraditionalFormation": true,
            "v4RuleIds": [],
            "legacyPatternCodes": [],
            "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음.",
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
        "axis": "STABILITY",
        "id": "sar:facet:STABILITY:continuity",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "growth"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "새 시도를 유지 가능한 작은 체계로 만들 여지",
    "shadow": "목이 많으면 진취적·토가 많으면 성실하다고 단정",
    "factBomb": "오행 숫자가 이력서의 능력 목록은 아님",
    "twist": "같은 비율도 계절과 통근에 따라 다른 조건을 가짐",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 학습 계획과 주간 유지 시간을 같이 적는 가상 장면"
    },
    "application": "원래 분포와 생활 적용 가설을 다른 줄에 둠",
    "prerequisites": [
      "실제 오행 산출 방식·월령·기둥 완전성·계절 구조 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "두 오행의 유효성이 낮으면 결합 인물상 보류",
    "distinction": "CH01 핵심 성격이 아니라 전체 구성의 역할 지도",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH01 핵심 성격이 아니라 전체 구성의 역할 지도",
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
    "id": "cpr:material:CH02.P1:fire-water-map",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "kind": "natal",
    "readerQuestion": "내 원국의 구성과 유효성은 어떻게 다른가?",
    "coreMeaning": "화·수의 상징적 대비와 실제 한난 조건 구분",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "가장 특징적인 오행 구성을 직관적으로 소개한다.",
        "knowledge": "화·수의 실제 분포를 표지로 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "상대적으로 두드러지는 기운을 설명한다.",
        "knowledge": "상대 강도와 계절의 한난 판단은 다른 계산·연구 층위",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "다른 기운과의 상호작용을 설명한다.",
        "knowledge": "드러냄과 숙고의 비유는 시간·대상 조건을 따로 필요로 함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "전체적인 기질의 특징을 제시한다.",
        "knowledge": "표현과 검토의 사용 조건을 묻는 전체 기질 후보",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "sourceId": "foundation:element:water",
        "auditRef": "source-catalog.json#6186bbc28de3ff92580b",
        "sourceKind": "natal_research",
        "recordSha256": "ebef8b89cee2f739c46b4caff660ce1ad81837a67da35d7efbabfcd5916ec4a1",
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
              "knowledge:element_water",
              "knowledge:element_water_missing",
              "taxonomy:element_water_excess",
              "taxonomy:element_water_missing"
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
        "sourceId": "csr:profile:temperature",
        "auditRef": "source-catalog.json#851ffc3bfcd20ecaf456",
        "sourceKind": "natal_research",
        "recordSha256": "b7c7de4e67dcafeb0ffb12f6313887ff7873d983317c9e624461d9c6bcfc87d5",
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
        "axis": "DEPTH",
        "id": "sar:facet:DEPTH:context-layer",
        "definition": "같은 행동의 다른 조건을 검토",
        "condition": "행동 사실과 해석을 구분",
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
    "positive": "말할 일과 살펴볼 일을 분리할 여지",
    "shadow": "상극을 내면 갈등이나 정신 상태로 확정",
    "factBomb": "뜨겁다·차갑다는 비유로 사람의 정을 판정하지 않음",
    "twist": "두 상징이 있어도 생활에서는 갈등 없이 쓰일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "말하기 전 검토할 내용과 바로 전할 내용을 나누는 가상 장면"
    },
    "application": "전통 한난 정의와 현대 소통 비유를 구분",
    "prerequisites": [
      "실제 화·수·월령과 조후 자료의 지원 수준 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 상호작용 미확인·조후 producer 미지원이면 계산된 균형이라고 표현 금지",
    "distinction": "CH03의 MBTI 긴장과 별개인 원국 설명",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH03의 MBTI 긴장과 별개인 원국 설명",
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
    "id": "cpr:material:CH02.P1:metal-wood-constraint",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "kind": "natal",
    "readerQuestion": "내 원국의 구성과 유효성은 어떻게 다른가?",
    "coreMeaning": "금·목의 분포와 금다목절 구조 성립을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH02.P1.S1",
        "originalRole": "가장 특징적인 오행 구성을 직관적으로 소개한다.",
        "knowledge": "보이는 금·목의 구성을 실제 수치로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P1.S2",
        "originalRole": "상대적으로 두드러지는 기운을 설명한다.",
        "knowledge": "금의 기준 상징이 강하다는 읽기에는 여력·계절 조건 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P1.S3",
        "originalRole": "다른 기운과의 상호작용을 설명한다.",
        "knowledge": "금다목절은 단순 개수와 다른 구조 성립 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P1.S4",
        "originalRole": "전체적인 기질의 특징을 제시한다.",
        "knowledge": "기준과 새로운 시도의 관계를 조건부로 묻기",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:element:metal",
        "auditRef": "source-catalog.json#7e34d4ce98dc700092a3",
        "sourceKind": "natal_research",
        "recordSha256": "a69c75e7eaa2571623ac29d0af7a3cfcc4d6de6a02ca415db923d565edc00c22",
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
              "knowledge:element_metal",
              "knowledge:element_metal_strong",
              "taxonomy:element_metal_excess",
              "taxonomy:element_metal_missing"
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
        "sourceId": "csr:profile:geumda_mokjeol",
        "auditRef": "source-catalog.json#f400095c6aa5ff73ddd2",
        "sourceKind": "natal_research",
        "recordSha256": "6805399b774b1a47c4ba8321755654bf71a92fc329b8e0e34d83d39505833c60",
        "sourceFileSha256": "a8dcc0a9e528e710e696a3b0747ae84aeccd422777f2bc46e46715776af4bddf",
        "originalState": {
          "verification": null,
          "review": null,
          "class": null,
          "traditionalClass": null,
          "connectedToRuntime": false,
          "approvedForCustomer": null,
          "definitionReview": null,
          "support": {
            "classification": "B_FACTS_NO_V4_DETECTOR",
            "lineageOrDefinitionVaries": false,
            "insufficientForTraditionalFormation": true,
            "v4RuleIds": [],
            "legacyPatternCodes": [],
            "actualBehavior": "기존 facts/상수는 있으나 V4에서 이 전통 구조의 성립을 독립 판정하지 않음. 계산 facts enum과 매핑의 존재는 producer의 존재가 아님. 전수 검색에서 해당 specialPatterns의 소스 생산 경로를 찾지 못했으며 fixture 투입은 존재.",
            "codeRefs": [
              "src/lib/report-knowledge/sajuComputedFactsMapper.ts",
              "src/lib/report-knowledge/sajuComputedFactsTypes.ts"
            ],
            "runtimeEvidenceIds": []
          },
          "deferred": [],
          "appliesWhen": null,
          "doNotApply": null
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "CHANGE_ORIENTATION",
        "id": "sar:facet:CHANGE_ORIENTATION:novelty-trial",
        "definition": "새 방식의 일부를 시험",
        "condition": "시험을 되돌릴 수 있는 상황",
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
    "positive": "유효한 기준 안에서 시험 범위를 고를 가능성",
    "shadow": "금이 많으면 냉정하거나 목이 약하면 성장 불가라 단정",
    "factBomb": "구성의 이름으로 사람의 가능성을 잘라내지 않음",
    "twist": "작은 새 시도를 보호하는 기준도 가능함",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 방법을 시험할 최소 허용 범위를 정하는 가상 장면"
    },
    "application": "구조 성립 확인 전에는 오행 구성 수준에서 설명",
    "prerequisites": [
      "실제 분포·월령·생극·근·보완·구조 지원 상태 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "연구 구조 미성립이면 금다목절의 개인 적용 보류",
    "distinction": "전문 용어 나열 대신 개수·유효성·구조의 차이를 전달",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "전문 용어 나열 대신 개수·유효성·구조의 차이를 전달",
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
    "id": "cpr:material:CH02.P2:wood-use-learning",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "kind": "natal",
    "readerQuestion": "실제 확인된 기운을 어떤 조건에서 잘 쓸 수 있는가?",
    "coreMeaning": "목의 생장 상징을 실제 학습 기회와 구분하는 긍정 후보",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "실제 근거가 있는 긍정적인 기운을 선택한다.",
        "knowledge": "실제 원국에서 유효한 목·정인 의미 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "해당 기운의 명리적 의미를 쉽게 설명한다.",
        "knowledge": "생장과 배움은 전통 상징·십성 역할의 두 층위",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "실제 행동이나 재능으로 나타날 수 있는 모습을 보여준다.",
        "knowledge": "새 개념을 다른 과제에 시험하는 생활 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "그 힘이 장점이 되는 조건을 설명한다.",
        "knowledge": "자료·연습·지원이 있을 때 장점으로 검토",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "condition": "다른 점을 비교하고 시험할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "growth"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "한 번 배운 방식을 다른 문제에 옮겨 볼 여지",
    "shadow": "오행 하나로 학습 능력·성적 확정",
    "factBomb": "배움의 상징이 시험 결과까지 대신하지 않음",
    "twist": "느리게 익혀도 전이할 과제가 있으면 활용 가능",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 도구로 익힌 순서를 다른 과제에 시험하는 가상 장면"
    },
    "application": "이해한 내용과 실제 써본 내용을 구분",
    "prerequisites": [
      "유효 원국 근거와 학습 맥락·접근 가능한 지원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "자료 접근·시간이 없으면 의지 부족으로 처리 금지",
    "distinction": "CH05의 검증된 재능과 달리 긍정 상징의 사용 조건",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05의 검증된 재능과 달리 긍정 상징의 사용 조건",
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
    "id": "cpr:material:CH02.P2:earth-use-continuity",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "kind": "natal",
    "readerQuestion": "실제 확인된 기운을 어떤 조건에서 잘 쓸 수 있는가?",
    "coreMeaning": "토의 유지 상징을 약속 갱신과 연결할 조건",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "실제 근거가 있는 긍정적인 기운을 선택한다.",
        "knowledge": "실제 토·정관에서 유지·담당의 의미 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "해당 기운의 명리적 의미를 쉽게 설명한다.",
        "knowledge": "버팀은 변경을 거부하는 성격과 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "실제 행동이나 재능으로 나타날 수 있는 모습을 보여준다.",
        "knowledge": "못 지킬 약속을 미리 조정하는 장면 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "그 힘이 장점이 되는 조건을 설명한다.",
        "knowledge": "반복 범위와 자원을 합의할 때 긍정적으로 사용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "함께하는 사람이 다음 단계를 예상하기 쉬움",
    "shadow": "책임감이 있으면 끝까지 버텨야 한다고 해석",
    "factBomb": "버팀목도 자기 하중을 알려야 오래 감",
    "twist": "미리 바꾸는 약속이 지속성을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 준비 기한을 어렵기 전에 조정하는 가상 장면"
    },
    "application": "유지할 최소 범위와 갱신할 신호를 정함",
    "prerequisites": [
      "원국·실제 담당·자원·약속 갱신 권한 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "강요된 의무나 과부하에서는 지속 권고 보류",
    "distinction": "긍정 오행을 착함이나 가족 부양 역할로 확장하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "긍정 오행을 착함이나 가족 부양 역할로 확장하지 않음",
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
    "id": "cpr:material:CH02.P2:metal-use-finish",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "kind": "natal",
    "readerQuestion": "실제 확인된 기운을 어떤 조건에서 잘 쓸 수 있는가?",
    "coreMeaning": "금의 구분 상징을 전달 전 누락 검토라는 응용으로 제한",
    "roleContributions": {
      "S1": {
        "address": "CH02.P2.S1",
        "originalRole": "실제 근거가 있는 긍정적인 기운을 선택한다.",
        "knowledge": "실제 금·상관 의미에서 기준·산출을 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P2.S2",
        "originalRole": "해당 기운의 명리적 의미를 쉽게 설명한다.",
        "knowledge": "잘라 구분하는 상징은 현대 오류 능력의 직접 검증이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P2.S3",
        "originalRole": "실제 행동이나 재능으로 나타날 수 있는 모습을 보여준다.",
        "knowledge": "최종 전달물의 빠진 조건을 확인하는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P2.S4",
        "originalRole": "그 힘이 장점이 되는 조건을 설명한다.",
        "knowledge": "기준을 공유하고 오류 비용이 있을 때 가치",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:element:metal",
        "auditRef": "source-catalog.json#7e34d4ce98dc700092a3",
        "sourceKind": "natal_research",
        "recordSha256": "a69c75e7eaa2571623ac29d0af7a3cfcc4d6de6a02ca415db923d565edc00c22",
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
              "knowledge:element_metal",
              "knowledge:element_metal_strong",
              "taxonomy:element_metal_excess",
              "taxonomy:element_metal_missing"
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
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "PRACTICALITY",
        "id": "sar:facet:PRACTICALITY:outcome-check",
        "definition": "실행 뒤 남은 결과를 확인",
        "condition": "평가 기간과 기준을 명시",
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
    "positive": "재작업을 줄일 질문을 정할 가능성",
    "shadow": "대화의 작은 차이까지 모두 교정",
    "factBomb": "고칠 수 있다고 꼭 고쳐야 하는 것은 아님",
    "twist": "중요하지 않은 오류를 넘기는 것이 완성을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "제출 전 필수 항목만 체크하는 가상 장면"
    },
    "application": "사용자가 실제 필요한 결과 기준부터 확인",
    "prerequisites": [
      "실제 근거와 생활에서의 누락 검토 행동을 별도 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "안전·법적 검토는 생략을 권장하지 않음",
    "distinction": "CH06의 지적 말투와 다른 결과물의 완성 조건",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH06의 지적 말투와 다른 결과물의 완성 조건",
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
    "id": "cpr:material:CH02.P3:low-output-is-not-silence",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "kind": "natal",
    "readerQuestion": "부재·편중은 실제로 무엇까지 말해 주는가?",
    "coreMeaning": "식상 부재와 표현할 통로의 부재를 구별",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "편중되거나 부족한 오행의 특징을 설명한다.",
        "knowledge": "확인된 식상 부재·낮은 분포를 사실 수준으로 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 구조에서 어떤 의미인지 구분한다.",
        "knowledge": "부재는 계산 범위·시주 미상·지장간 포함 여부에 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "지나치게 발휘될 수 있는 행동을 설명한다.",
        "knowledge": "말을 못하거나 창의성이 없다는 결론은 배제",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "이를 완화할 수 있는 현실적인 선택을 제안한다.",
        "knowledge": "표현 방식의 실제 선호를 따로 확인하는 제안",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "csr:profile:no_output",
        "auditRef": "source-catalog.json#18eea312b8ff37c8ecf9",
        "sourceKind": "natal_research",
        "recordSha256": "bb27f41515884753e1533f43b383ceac7d88d7629a5e3355d62efd98f8ec0ff4",
        "sourceFileSha256": "ddc45519fb30b7b1a7f1af4be540489dc2cee77c216e2f0fee25823b4c2f0f65",
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
              "noOutput"
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "voice"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "자기에게 맞는 통로를 찾을 수 있음",
    "shadow": "낮은 요소를 결함을 고쳐야 할 진단으로 사용",
    "factBomb": "없는 별을 찾다가 있는 표현까지 못 보게 하지 않음",
    "twist": "말보다 글·작업·행동의 표현이 편할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "하고 싶은 말을 글과 그림 중 고르는 가상 장면"
    },
    "application": "표현할 내용·상대·공개 범위를 본인에게 확인",
    "prerequisites": [
      "기존 계산의 no_output 성립·시주 완전성 확인; 식신은 정의 참조이며 존재 가정 아님",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "시간 미상 또는 간접 산출 근거가 있으면 전체 부재 표현 금지",
    "distinction": "별의 분포와 실제 능력의 차이를 핵심 정보로 둠",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "별의 분포와 실제 능력의 차이를 핵심 정보로 둠",
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
    "id": "cpr:material:CH02.P3:wealth-overload-condition",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "kind": "natal",
    "readerQuestion": "부재·편중은 실제로 무엇까지 말해 주는가?",
    "coreMeaning": "재다신약 후보의 자원 요구와 감당 여력 차이",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "편중되거나 부족한 오행의 특징을 설명한다.",
        "knowledge": "재성 편중·일간 여력은 서로 다른 확인 항목",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 구조에서 어떤 의미인지 구분한다.",
        "knowledge": "자원 규모가 커도 부담을 떠받칠 조건은 따로 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "지나치게 발휘될 수 있는 행동을 설명한다.",
        "knowledge": "기회를 모두 맡으면 실제 일정이 넘칠 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "이를 완화할 수 있는 현실적인 선택을 제안한다.",
        "knowledge": "맡을 범위·지원 조건을 조정하는 응용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "csr:profile:jaeda_sinyak",
        "auditRef": "source-catalog.json#4afa166a512fc64bcfb1",
        "sourceKind": "natal_research",
        "recordSha256": "15d7e48a153974db45c1571ea95cd900f0e3af28ab6f387a24629cd051ce82fb",
        "sourceFileSha256": "58e9857dd90713c3c947250478c48cdeb9e33be05920c934a963adba607b2e50",
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
              "wealthHeavyWeakDaymaster"
            ],
            "legacyPatternCodes": [
              "WEAK_DAYMASTER_WITH_STRONG_WEALTH"
            ],
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
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
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
        "resources"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "과제 규모를 감당 가능한 몫으로 나눌 여지",
    "shadow": "재다신약이면 돈이 새고 가난하다고 단정",
    "factBomb": "기회가 많다는 말로 무제한 담당을 맡기지 않음",
    "twist": "작은 계약이 큰 제안보다 선택권을 남길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "제안의 보상과 유지 시간·인력을 비교하는 가상 장면"
    },
    "application": "할 수 있는 자원과 빠지는 자원을 각각 적음",
    "prerequisites": [
      "구조 성립·강약·통근·보완·실제 자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구조가 미성립하거나 지원이 충분하면 과부하 해석 보류",
    "distinction": "CH09 재무 상태가 아닌 원국 구조의 조건 설명",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09 재무 상태가 아닌 원국 구조의 조건 설명",
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
    "id": "cpr:material:CH02.P3:resource-excess-application",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "kind": "natal",
    "readerQuestion": "부재·편중은 실제로 무엇까지 말해 주는가?",
    "coreMeaning": "인성 편중 후보를 이해·실행의 간격으로 조건부 검토",
    "roleContributions": {
      "S1": {
        "address": "CH02.P3.S1",
        "originalRole": "편중되거나 부족한 오행의 특징을 설명한다.",
        "knowledge": "실제 인성의 편중을 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P3.S2",
        "originalRole": "실제 구조에서 어떤 의미인지 구분한다.",
        "knowledge": "인성의 지원·습득 상징은 실제 망설임과 별개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P3.S3",
        "originalRole": "지나치게 발휘될 수 있는 행동을 설명한다.",
        "knowledge": "자료를 더 모을 때 착수가 늦어지는지 질문",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P3.S4",
        "originalRole": "이를 완화할 수 있는 현실적인 선택을 제안한다.",
        "knowledge": "이미 아는 내용으로 작은 수행을 시험하는 방향",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "csr:profile:resource_many",
        "auditRef": "source-catalog.json#514cd6caa16e72114753",
        "sourceKind": "natal_research",
        "recordSha256": "2464996b56cd38a2a15ae7d53ddd621a12f733c7e31f039220ffd64a32377961",
        "sourceFileSha256": "de6f1fa459bb457beae9e67dd4b59de1a0da44fe564774ab48a5565bb593f33b",
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
              "resourceHeavy"
            ],
            "legacyPatternCodes": [
              "RESOURCE_HEAVY"
            ],
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
        "id": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "condition": "현재 조건이 배운 조건과 맞는지 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "ACTION_TEMPO",
        "id": "sar:facet:ACTION_TEMPO:start-latency",
        "definition": "결론과 첫 행동 사이의 간격",
        "condition": "결론이 실제로 난 뒤의 간격을 비교",
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
    "positive": "이해를 실제 과제에 꺼내 쓸 여지",
    "shadow": "인성 많으면 의존적·게으르다고 단정",
    "factBomb": "자료 폴더가 늘어도 행동은 다른 칸에 적혀야 함",
    "twist": "실행 결과가 추가 공부의 질문을 좁힐 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "설명 한 단원을 읽고 작은 문제 하나를 푸는 가상 장면"
    },
    "application": "더 알아야 할 것과 지금 해볼 것을 분리",
    "prerequisites": [
      "실제 구조·다른 십성·부하·기한과 본인 행동 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "새 과제가 위험하거나 필수 지식이 부족하면 착수 재촉 금지",
    "distinction": "학업 능력·심리 결함을 만들지 않는 편중 응용",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "학업 능력·심리 결함을 만들지 않는 편중 응용",
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
    "id": "cpr:material:CH02.P4:recall-grow-with-support",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "kind": "natal",
    "readerQuestion": "확인된 구성에서 지금 어떤 선택을 해볼 수 있는가?",
    "coreMeaning": "앞서 확인한 생장·지원 의미를 배움의 선택으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "앞선 오행 해석에서 가장 중요한 점을 선택한다.",
        "knowledge": "앞선 원국 설명 중 학습을 지속할 조건만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "일·관계·생활 중 적합한 적용 영역을 고른다.",
        "knowledge": "일·생활 중 본인이 실제 배우려는 영역 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "해당 영역에서 가능한 행동을 제안한다.",
        "knowledge": "자료와 도움의 방식을 스스로 고르는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "타고난 구성을 강점으로 활용하는 메시지로 마무리한다.",
        "knowledge": "자기 구성에 맞는 활용 가능성을 조건부로 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "sourceId": "csr:profile:officer_resource",
        "auditRef": "source-catalog.json#f91a31f72da764233b91",
        "sourceKind": "natal_research",
        "recordSha256": "be25b2588dd5fa1475ca48e148c4b6408793604571f0e97de684ab8d4a030996",
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
              "officerResourceFlow"
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
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:chosen-support",
        "definition": "받을 도움의 방식을 선택",
        "condition": "도움 수용·거절 모두 가능할 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "growth"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "배움의 자원과 자율성을 같이 확보",
    "shadow": "지원이 있다는 해석으로 타인 도움을 당연시",
    "factBomb": "도움은 원국에 적힌 자동 배달 서비스가 아님",
    "twist": "도움을 고르는 능력도 독립성을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "자료 요청과 혼자 해볼 부분을 나누는 가상 장면"
    },
    "application": "도움받을 항목·스스로 시험할 항목을 정함",
    "prerequisites": [
      "CH02 앞 문단의 실제 근거와 원하는 학습 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "앞선 설명에 해당 의미가 없으면 새 오행을 끌어오지 않음",
    "distinction": "CH13 전체 선택 기준보다 오행 응용 한 영역만 다룸",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [
      "cpr:material:CH02.P2:wood-use-learning"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH13 전체 선택 기준보다 오행 응용 한 영역만 다룸",
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
    "id": "cpr:material:CH02.P4:recall-expression-audience",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "kind": "natal",
    "readerQuestion": "확인된 구성에서 지금 어떤 선택을 해볼 수 있는가?",
    "coreMeaning": "드러냄 상징을 표현 대상·범위 선택으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "앞선 오행 해석에서 가장 중요한 점을 선택한다.",
        "knowledge": "앞서 설명한 화·식신의 표현 의미 중 하나 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "일·관계·생활 중 적합한 적용 영역을 고른다.",
        "knowledge": "실제 일·관계에서 전달하려는 내용과 대상을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "해당 영역에서 가능한 행동을 제안한다.",
        "knowledge": "짧게 전하고 이해된 뜻을 확인하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "타고난 구성을 강점으로 활용하는 메시지로 마무리한다.",
        "knowledge": "많이 드러내기보다 알맞게 닿는 사용 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "id": "sar:facet:EXPRESSION:visibility-control",
        "definition": "드러낼 범위와 대상을 고름",
        "condition": "공개 동의를 별도로 확인",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "표현의 목적과 수신자를 맞출 여지",
    "shadow": "표현하면 인정받는다는 결과로 건너뜀",
    "factBomb": "말을 크게 하기보다 도착했는지 묻기",
    "twist": "덜 공개해도 중요한 뜻은 충분히 전달 가능",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "발표 내용을 청중과 한 문장으로 맞추는 가상 장면"
    },
    "application": "전할 내용·공개 범위·확인 질문을 정함",
    "prerequisites": [
      "앞서 소개된 실제 화·식신 근거와 공개 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "원하지 않는 공개·안전하지 않은 관계에서는 표현 권고 보류",
    "distinction": "CH04 매력이나 타인 호감이 아닌 표현의 쓰임",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [
      "cpr:material:CH02.P1:fire-water-map"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 매력이나 타인 호감이 아닌 표현의 쓰임",
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
    "id": "cpr:material:CH02.P4:recall-boundaries-for-trials",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "kind": "natal",
    "readerQuestion": "확인된 구성에서 지금 어떤 선택을 해볼 수 있는가?",
    "coreMeaning": "기준과 생장 상징을 안전한 시험 범위로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH02.P4.S1",
        "originalRole": "앞선 오행 해석에서 가장 중요한 점을 선택한다.",
        "knowledge": "앞선 금·목 해석의 유효 범위만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH02.P4.S2",
        "originalRole": "일·관계·생활 중 적합한 적용 영역을 고른다.",
        "knowledge": "새 과제의 권한·실패 비용이 확인된 영역 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH02.P4.S3",
        "originalRole": "해당 영역에서 가능한 행동을 제안한다.",
        "knowledge": "돌릴 수 있는 한 부분을 시험하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH02.P4.S4",
        "originalRole": "타고난 구성을 강점으로 활용하는 메시지로 마무리한다.",
        "knowledge": "타고난 표지는 선택을 돕는 질문으로 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:element:metal",
        "auditRef": "source-catalog.json#7e34d4ce98dc700092a3",
        "sourceKind": "natal_research",
        "recordSha256": "a69c75e7eaa2571623ac29d0af7a3cfcc4d6de6a02ca415db923d565edc00c22",
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
              "knowledge:element_metal",
              "knowledge:element_metal_strong",
              "taxonomy:element_metal_excess",
              "taxonomy:element_metal_missing"
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
      }
    ],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "RISK_STYLE",
        "id": "sar:facet:RISK_STYLE:reversible-probe",
        "definition": "되돌릴 수 있는 시험을 선택",
        "condition": "복구 비용과 선택권이 확인될 때",
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
    "positive": "필수 기준 안에서 새 방식을 탐색할 여지",
    "shadow": "금목 관계를 무조건 충돌·실패로 읽음",
    "factBomb": "규칙은 시작을 막는 문뿐 아니라 안전한 울타리도 될 수 있음",
    "twist": "지킬 최소선을 정하면 방법은 더 열릴 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "기존 작업의 한 부분만 새 방법으로 시험하는 가상 장면"
    },
    "application": "필수 기준과 바꿔도 될 방법을 구분",
    "prerequisites": [
      "앞선 실제 원국 해석과 변경 권한·위험 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "원국 근거만으로 실제 안전성 판정 금지",
    "distinction": "CH08의 업무 적합도를 대신하지 않는 원국 활용 질문",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [
      "cpr:material:CH02.P1:metal-wood-constraint"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH08의 업무 적합도를 대신하지 않는 원국 활용 질문",
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
