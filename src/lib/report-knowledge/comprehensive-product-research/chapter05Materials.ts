/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH05_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH05.P1:analysis-that-decides",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "kind": "fusion",
    "readerQuestion": "이 기능은 무엇을 가능하게 하는가?",
    "coreMeaning": "논리의 빈칸을 찾아 결정할 수 있는 설명으로 만드는 강점",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "가장 대표적인 강점을 직설적으로 제시한다.",
        "knowledge": "답의 전제와 원인을 함께 확인하는 능력 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "해당 강점의 주요 명리·MBTI 근거를 설명한다.",
        "knowledge": "편인 상징과 INTJ intellectual_depth 원천의 역할 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "실제로 잘할 수 있는 행동을 보여준다.",
        "knowledge": "원인 후보를 좁혀 다음 선택이 달라지게 하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "그 강점이 다른 사람에게 가치가 되는 조건을 설명한다.",
        "knowledge": "설명을 받을 사람이 결정할 수 있을 때 가치",
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
        "sourceId": "mbti:INTJ:strengths:intellectual_depth",
        "auditRef": "source-catalog.json#71d069a8af17db632a8b",
        "sourceKind": "mbti_trait",
        "recordSha256": "35c386e460217df0e2ff1d3c9c3357030f1ef3f380ae21b6136f451cb9cf82a4",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "strengths",
          "traitId": "intellectual_depth",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C002",
        "auditRef": "source-catalog.json#19909e38d10a2dcb8bd4",
        "sourceKind": "fusion_research",
        "recordSha256": "b3061c278a7b32733d7400a2b8b25a81403a010dd3e4b4dfc43efb1a676e15c1",
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
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "condition": "주장 사실과 감정 경험을 구분",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "정보의 양보다 판단 가능한 이유를 남길 여지",
    "shadow": "깊은 조사를 끝내야만 도움된다고 생각",
    "factBomb": "보고서가 길어도 다음 행동이 안 보이면 분석이 덜 끝난 것",
    "twist": "짧은 설명을 만들 때 깊은 검토가 더 잘 보일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "문제 원인과 당장 바꿀 선택을 한 장에 적는 가상 장면"
    },
    "application": "확인할 전제·반례·다음 결정을 묶음",
    "prerequisites": [
      "실제 원국·trait·분석 행동·같은 과제와 수신자 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "분석 경험 미확인 시 전문 능력으로 보증 금지",
    "distinction": "CH01 탐색적 인물상에서 실제 산출 기능으로 질문 전환",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH01 탐색적 인물상에서 실제 산출 기능으로 질문 전환",
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
    "id": "cpr:material:CH05.P1:start-with-consent",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "kind": "fusion",
    "readerQuestion": "이 기능은 무엇을 가능하게 하는가?",
    "coreMeaning": "멈춘 공동 과제에 결정 구조를 제안하는 강점",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "가장 대표적인 강점을 직설적으로 제시한다.",
        "knowledge": "앞서 움직일 몫을 나누는 능력 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "해당 강점의 주요 명리·MBTI 근거를 설명한다.",
        "knowledge": "편관 압박 의미와 공동 목표 선호를 별도로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "실제로 잘할 수 있는 행동을 보여준다.",
        "knowledge": "누가 무엇을 결정할지 정해 첫 행동을 만드는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "그 강점이 다른 사람에게 가치가 되는 조건을 설명한다.",
        "knowledge": "당사자 동의·권한이 있을 때 타인의 수고를 줄임",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:qi_sha",
        "auditRef": "source-catalog.json#6abc231d58e234e34654",
        "sourceKind": "natal_research",
        "recordSha256": "772e2f835195bbd7ae171796d6507aa2ec10a4efdb9dd0be7535729ef4a3b80d",
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
              "knowledge:ten_god_qi_sha",
              "taxonomy:ten_god_qi_sha"
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
        "sourceId": "mbti:ENTJ:identity:commanding_goal_builder",
        "auditRef": "source-catalog.json#654b835ccd167ecab80a",
        "sourceKind": "mbti_trait",
        "recordSha256": "8a331415bd007f180e6e2b9a20a3f32dfa1a5279d868b58073e91b4304626543",
        "sourceFileSha256": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
        "originalState": {
          "type": "ENTJ",
          "area": "identity",
          "traitId": "commanding_goal_builder",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C027",
        "auditRef": "source-catalog.json#a96f525d87fa26a8e007",
        "sourceKind": "fusion_research",
        "recordSha256": "0fb474c212fad32dc166c512a7cdaced88d2e2c04dbb21b0b020ec504d2780ba",
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
        "sourceId": "deep:ten_god:qi_sha",
        "auditRef": "source-catalog.json#af84fd9c275b4acb11b1",
        "sourceKind": "natal_research",
        "recordSha256": "2e8310a635977205afbcb0dffde9f5cbe8b140f2adf14e7b5899d4517a7defa3",
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
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "action"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "정체된 상황에 실행 경로를 마련할 여지",
    "shadow": "역할 배분을 자기 혼자 정함",
    "factBomb": "일을 시작시킨 사람이 모든 결정을 소유하지는 않음",
    "twist": "결정권을 나누면 추진력이 더 오래갈 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "급한 준비에서 결정자와 확인자를 구분하는 가상 장면"
    },
    "application": "맡을 역할·권한·기한을 합의",
    "prerequisites": [
      "실제 원국·trait·공동 목적·권한·담당 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "권한이나 참여 동의가 없으면 리더십 행동 권장 보류",
    "distinction": "재능의 가치는 속도보다 공동 실행이 가능해진 변화",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "재능의 가치는 속도보다 공동 실행이 가능해진 변화",
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
    "id": "cpr:material:CH05.P1:support-need-not-guess",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "kind": "fusion",
    "readerQuestion": "이 기능은 무엇을 가능하게 하는가?",
    "coreMeaning": "관찰한 불편을 실제 도움 요청으로 확인하는 강점",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "가장 대표적인 강점을 직설적으로 제시한다.",
        "knowledge": "필요를 짐작한 뒤 당사자에게 묻는 기능 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "해당 강점의 주요 명리·MBTI 근거를 설명한다.",
        "knowledge": "지원 수용 상징과 제공 선호의 비동등성 유지",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "실제로 잘할 수 있는 행동을 보여준다.",
        "knowledge": "상대에게 필요한 도움의 종류를 선택하게 하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "그 강점이 다른 사람에게 가치가 되는 조건을 설명한다.",
        "knowledge": "수신자 동의와 제공 여력이 있을 때 가치",
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
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "identity",
          "traitId": "compassionate_facilitator",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C049",
        "auditRef": "source-catalog.json#7264cc563b4d3e851776",
        "sourceKind": "fusion_research",
        "recordSha256": "9377aacf3e7d648d26abc66921077d5c7e9fed2e238af3da4f6737023ef49694",
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
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
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
    "positive": "도움의 헛수고와 불필요한 개입을 줄일 여지",
    "shadow": "표정을 읽으면 마음도 안다고 생각",
    "factBomb": "눈치가 빠른 것과 확인 질문을 생략하는 것은 다름",
    "twist": "돕지 않는 선택을 존중해도 신뢰가 생길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "말이 줄어든 동료에게 듣기·도움·혼자 두기 중 묻는 가상 장면"
    },
    "application": "관찰한 사실과 확인한 요청을 다른 칸에 둠",
    "prerequisites": [
      "실제 사회조율 행동·trait·원국 역할·동의 추가 검증 필요",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "정인 존재만으로 배려 재능을 승인하지 않음",
    "distinction": "수혜와 제공을 구분한 실제 기능 후보이며 착한 성격 선언 아님",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "수혜와 제공을 구분한 실제 기능 후보이며 착한 성격 선언 아님",
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
    "id": "cpr:material:CH05.P2:make-visible",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "kind": "fusion",
    "readerQuestion": "첫 강점과 다른 두 번째 기능은 무엇인가?",
    "coreMeaning": "생각을 함께 검토할 견본으로 바꾸는 독립 재능",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "첫 강점과 의미가 다른 재능을 제시한다.",
        "knowledge": "분석이나 추진과 다른 가시화 기능 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "독립적인 근거를 설명한다.",
        "knowledge": "실제 식신 산출 의미·creative_intelligence 원천을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "구체적인 생활 장면을 보여준다.",
        "knowledge": "말로 다른 생각을 작은 모형으로 보여주는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "해당 재능을 살릴 수 있는 환경을 설명한다.",
        "knowledge": "시험과 수정이 가능한 환경에서 발전",
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
        "sourceId": "mbti:INTP:strengths:creative_intelligence",
        "auditRef": "source-catalog.json#2efaea4433078768f5d3",
        "sourceKind": "mbti_trait",
        "recordSha256": "ac2c18ba7af5e3f23b6dcada7caffa63681564bfbed45585ed13822e71747bdd",
        "sourceFileSha256": "752828dc12d5f7114176d739e9e6f5b8ca05fd8facfeeaa331e9d88c163f694e",
        "originalState": {
          "type": "INTP",
          "area": "strengths",
          "traitId": "creative_intelligence",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C065",
        "auditRef": "source-catalog.json#4b130693e39a2e137995",
        "sourceKind": "fusion_research",
        "recordSha256": "777d7dd880a4f4eba665e4df655ede365d69b3f795402a74ffa3309bb4fff8b5",
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:prototype",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
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
        "craft"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "다른 사람이 어디를 바꿀지 말할 단서 제공",
    "shadow": "견본이 곧 완성품이라고 기대",
    "factBomb": "설명 못한 생각을 크게 포장한다고 견본이 되지는 않음",
    "twist": "서투른 작은 형태가 긴 설명보다 좋은 질문을 만들 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 안내 과정을 종이 모형으로 시험하는 가상 장면"
    },
    "application": "견본이 확인할 가설 하나를 정함",
    "prerequisites": [
      "P1과 다른 실제 기능·근거 확인; 창작 능력·사용자 맥락 검증",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "첫 강점과 동일 fact의 동의어면 두 번째 독립 재능으로 집계 금지",
    "distinction": "분석은 답의 이유, 제작은 타인이 시험할 대상이라는 차이",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "분석은 답의 이유, 제작은 타인이 시험할 대상이라는 차이",
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
    "id": "cpr:material:CH05.P2:resource-route",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "kind": "fusion",
    "readerQuestion": "첫 강점과 다른 두 번째 기능은 무엇인가?",
    "coreMeaning": "목적에 필요한 시간·도구의 배치를 설계하는 재능",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "첫 강점과 의미가 다른 재능을 제시한다.",
        "knowledge": "실행량과 다른 자원 배치 기능 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "독립적인 근거를 설명한다.",
        "knowledge": "편재 교환 의미와 목표 자원 원천의 각각의 역할",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "구체적인 생활 장면을 보여준다.",
        "knowledge": "같은 결과를 다른 순서·담당·도구로 비교하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "해당 재능을 살릴 수 있는 환경을 설명한다.",
        "knowledge": "자원에 접근하고 변경할 권한이 있을 때 가치",
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
        "sourceId": "mbti:ENTJ:money:capitalist_resource_logic",
        "auditRef": "source-catalog.json#1ab2480dc05b0f303177",
        "sourceKind": "mbti_trait",
        "recordSha256": "2fd5cb824effc3af530eba2ef7c1972ae831311f61b97619e178718ecc903b51",
        "sourceFileSha256": "e19ac6a4a676e3f12d56aacb42fc40b4458874640f044c0ebe2176be4f36056e",
        "originalState": {
          "type": "ENTJ",
          "area": "money",
          "traitId": "capitalist_resource_logic",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C047",
        "auditRef": "source-catalog.json#a2be397bc08e6f032976",
        "sourceKind": "fusion_research",
        "recordSha256": "402b3fcec5f7aa241c1cfc4cf81d3344d92c65ef5dfa5547670361d83fe5c68f",
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
        "axis": "STRATEGY",
        "id": "sar:facet:STRATEGY:sequence-design",
        "definition": "의존 관계에 맞게 순서를 배치",
        "condition": "담당자의 재량·동의 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
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
    "positive": "같은 수고로 중요한 결과에 더 집중할 여지",
    "shadow": "타인의 시간을 값싸게 쓰면 효율이라고 생각",
    "factBomb": "아낀 비용이 남에게 떠넘긴 부담인지도 확인",
    "twist": "조금 더 지원하는 것이 전체 재작업을 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "행사의 준비 순서와 필요한 사람을 배치하는 가상 장면"
    },
    "application": "자원 비용과 담당 동의를 같이 비교",
    "prerequisites": [
      "실제 원국·trait·자원·변경 권한 확인; P1과 독립 기능 검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "소득·투자 수익 능력으로 확장 금지",
    "distinction": "첫 추진 재능과 달리 무엇을 어디에 배정할지의 설계",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "첫 추진 재능과 달리 무엇을 어디에 배정할지의 설계",
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
    "id": "cpr:material:CH05.P2:translate-for-learner",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "kind": "fusion",
    "readerQuestion": "첫 강점과 다른 두 번째 기능은 무엇인가?",
    "coreMeaning": "아는 내용을 상대가 써볼 수 있게 설명하는 재능",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "첫 강점과 의미가 다른 재능을 제시한다.",
        "knowledge": "혼자 이해와 다른 수신자 중심 설명 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "독립적인 근거를 설명한다.",
        "knowledge": "정인 학습 의미와 성장 지원 원천을 별도 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "구체적인 생활 장면을 보여준다.",
        "knowledge": "상대가 설명을 재현해 보며 막힌 부분을 찾는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "해당 재능을 살릴 수 있는 환경을 설명한다.",
        "knowledge": "배울 목적과 피드백을 함께 확인하는 환경",
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
        "sourceId": "mbti:ENFJ:strengths:growth_support",
        "auditRef": "source-catalog.json#7c44661a1400737a0782",
        "sourceKind": "mbti_trait",
        "recordSha256": "8354d4d6b0c2252ab7a9040915dc2d7dc2f0ff1969b5ebc43736b0d279531c9e",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
        "originalState": {
          "type": "ENFJ",
          "area": "strengths",
          "traitId": "growth_support",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C066",
        "auditRef": "source-catalog.json#6342a45a82df8fc4dcee",
        "sourceKind": "fusion_research",
        "recordSha256": "4dff8e25db9ec2c472e1f2e624a62a756b2a8294d4f26c12f921306cb86da05d",
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:retrieval",
        "definition": "익힌 내용을 다시 꺼내 사용",
        "condition": "현재 조건이 배운 조건과 맞는지 확인",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "이해의 차이를 줄이고 다음 연습을 도울 여지",
    "shadow": "잘 설명하면 배움도 완료됐다고 생각",
    "factBomb": "내 설명이 끝난 시간과 상대가 이해한 시간은 다름",
    "twist": "말을 줄이고 질문을 받는 것이 전달력을 키울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "친구에게 새 기능을 설명한 뒤 직접 해보게 하는 가상 장면"
    },
    "application": "상대가 재현할 한 단계와 질문 시간을 남김",
    "prerequisites": [
      "실제 설명 행동·학습 원천·수신 동의; P1과 다른 근거 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "도움 선호만으로 교사 자격·교육 능력 확정 금지",
    "distinction": "이해의 깊이가 아니라 상대에게 전달된 변화가 새 정보",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "이해의 깊이가 아니라 상대에게 전달된 변화가 새 정보",
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
    "id": "cpr:material:CH05.P3:quiet-lead",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "kind": "fusion",
    "readerQuestion": "예상과 다른 장점은 어떤 조합에서 가능한가?",
    "coreMeaning": "사적으로 기준을 정리한 뒤 공동 방향을 제안할 가능성",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "일반적인 첫인상과 다른 능력을 소개한다.",
        "knowledge": "말수가 많지 않아도 방향 제안 역할을 할 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "근거가 되는 명리·MBTI 조합을 설명한다.",
        "knowledge": "편관·사적 판단 원천은 실제 리더십의 증명이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "예상 밖의 상황에서 드러나는 모습을 제시한다.",
        "knowledge": "사전 정리한 선택 기준을 공동 과제에 제안하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "해당 능력이 강점으로 발전할 가능성을 설명한다.",
        "knowledge": "본인과 타인이 함께 검토할 기준이 남을 때 강점",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:ten_god:qi_sha",
        "auditRef": "source-catalog.json#6abc231d58e234e34654",
        "sourceKind": "natal_research",
        "recordSha256": "772e2f835195bbd7ae171796d6507aa2ec10a4efdb9dd0be7535729ef4a3b80d",
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
              "knowledge:ten_god_qi_sha",
              "taxonomy:ten_god_qi_sha"
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
        "sourceId": "mbti:INTJ:identity:independent_decision_maker",
        "auditRef": "source-catalog.json#18fb1909ee68e78603a1",
        "sourceKind": "mbti_trait",
        "recordSha256": "d270a153acb4895739ebf3c4b0e422814bd21da6cfa60048773d3ba361483ba8",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "identity",
          "traitId": "independent_decision_maker",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C089",
        "auditRef": "source-catalog.json#a0771fdeae03f4a011fe",
        "sourceKind": "fusion_research",
        "recordSha256": "8179bb8e6a14b35ec7729710ca157982fde3ea8b3ee25b002c3252dacb6316fa",
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
        "sourceId": "deep:ten_god:qi_sha",
        "auditRef": "source-catalog.json#af84fd9c275b4acb11b1",
        "sourceKind": "natal_research",
        "recordSha256": "2e8310a635977205afbcb0dffde9f5cbe8b140f2adf14e7b5899d4517a7defa3",
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
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:direction-proposal",
        "definition": "공동 목적을 제안하고 조율",
        "condition": "참여자의 동의와 공식 권한 확인",
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
    "positive": "조용한 준비를 공동 결정에 활용할 여지",
    "shadow": "혼자 정리한 답을 합의된 결론으로 착각",
    "factBomb": "마음속 회의에서 만장일치가 나도 실제 회의는 남아 있음",
    "twist": "중간 생각을 공유하면 독립적인 준비가 협업을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "혼자 비교한 두 방안을 회의에서 질문으로 내는 가상 장면"
    },
    "application": "최종 결정 전에 바꿀 수 있는 의견 통로를 남김",
    "prerequisites": [
      "실제 양측 근거·과제 권한·방향 제안 행동 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "내향적 prior만으로 숨은 리더를 부여하지 않음",
    "distinction": "강점1의 빠른 시작과 달리 준비한 방향을 공유하는 역할",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "강점1의 빠른 시작과 달리 준비한 방향을 공유하는 역할",
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
    "id": "cpr:material:CH05.P3:standards-open-way",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "kind": "fusion",
    "readerQuestion": "예상과 다른 장점은 어떤 조합에서 가능한가?",
    "coreMeaning": "필수 기준을 남기며 방법을 바꾸는 반전 후보",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "일반적인 첫인상과 다른 능력을 소개한다.",
        "knowledge": "규칙을 지키는 의미와 개선 질문의 공존 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "근거가 되는 명리·MBTI 조합을 설명한다.",
        "knowledge": "정관 원국 의미와 flaw_detection 원천의 대상 차이",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "예상 밖의 상황에서 드러나는 모습을 제시한다.",
        "knowledge": "목적은 유지하고 불필요한 절차만 바꾸는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "해당 능력이 강점으로 발전할 가능성을 설명한다.",
        "knowledge": "필수·선택 절차를 구분할 권한이 있을 때 가치",
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
        "sourceId": "mbti:ENTP:thinkingStyle:flaw_detection",
        "auditRef": "source-catalog.json#611b24073281ed349665",
        "sourceKind": "mbti_trait",
        "recordSha256": "1dba8b2921149e0ba4f92f0bb267fdaf15b3bb7d96a159e11da85b900132a42b",
        "sourceFileSha256": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
        "originalState": {
          "type": "ENTP",
          "area": "thinkingStyle",
          "traitId": "flaw_detection",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C090",
        "auditRef": "source-catalog.json#501c3962b3798ef6f6a3",
        "sourceKind": "fusion_research",
        "recordSha256": "fbd8cf081d17e3d112c9415959fdcddacbd027beae1013ce34fc8b1d8e7ef0e1",
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
        "axis": "STRUCTURE_STYLE",
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      },
      {
        "axis": "ADAPTABILITY",
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
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
    "positive": "기준을 버리지 않고 사용하기 쉬운 방법을 찾을 여지",
    "shadow": "허점을 찾으면 규칙 전체가 무효라고 해석",
    "factBomb": "규칙의 빈칸을 발견했다고 안전선까지 지울 수는 없음",
    "twist": "지킬 최소 기준이 명확하면 방법은 더 자유로울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 체크리스트의 필수 항목과 중복 절차를 나누는 가상 장면"
    },
    "application": "기준 목적·변경 권한·시험 결과를 확인",
    "prerequisites": [
      "실제 원국·해당 trait·동일 절차·법과 안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "검증된 필수 규정은 편의 때문에 우회 금지",
    "distinction": "정확성의 동의어 대신 기준 보존과 방법 변경의 결합",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "정확성의 동의어 대신 기준 보존과 방법 변경의 결합",
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
    "id": "cpr:material:CH05.P3:boundaries-enable-support",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "kind": "fusion",
    "readerQuestion": "예상과 다른 장점은 어떤 조합에서 가능한가?",
    "coreMeaning": "자기 선택을 지키는 것이 지속적인 도움의 바탕이 되는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH05.P3.S1",
        "originalRole": "일반적인 첫인상과 다른 능력을 소개한다.",
        "knowledge": "독립성과 배려가 반대 성격일 필요는 없음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P3.S2",
        "originalRole": "근거가 되는 명리·MBTI 조합을 설명한다.",
        "knowledge": "비견의 자기 몫 상징과 실제 도움 제공 선호를 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P3.S3",
        "originalRole": "예상 밖의 상황에서 드러나는 모습을 제시한다.",
        "knowledge": "도울 범위가 분명할 때 부담을 덜어주는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P3.S4",
        "originalRole": "해당 능력이 강점으로 발전할 가능성을 설명한다.",
        "knowledge": "요청자 선택권·제공 여력·종료 범위가 중요",
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
        "sourceId": "mbti:ENFJ:identity:compassionate_facilitator",
        "auditRef": "source-catalog.json#a9b5f2a55f489ecc8df6",
        "sourceKind": "mbti_trait",
        "recordSha256": "050c9065f29693df0df7d183fd4144b35cd18f08bd92fed358d575ba06761127",
        "sourceFileSha256": "04422dcc0008ceb4dfa6b5d92738db73db9cc5961ff90d1a56e87dfedc2a98c8",
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
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
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
        "self"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "서로의 선택을 남기며 도움을 지속할 여지",
    "shadow": "거절하지 못해야 친절하다고 믿음",
    "factBomb": "가능한 몫을 정하지 않은 호의에는 종료 버튼이 없을 수 있음",
    "twist": "한계를 밝히는 것이 도움의 질을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "도움 요청에 가능한 한 부분을 제안하는 가상 장면"
    },
    "application": "가능한 내용과 못 맡는 책임을 동시에 말함",
    "prerequisites": [
      "비견·trait·자율적 선택·실제 도움 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "자기 경계 자료만으로 상대의 의존·감사를 추론 금지",
    "distinction": "P1의 필요 확인에서 제공 지속 조건으로 새 질문 이동",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:bijian의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "P1의 필요 확인에서 제공 지속 조건으로 새 질문 이동",
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
    "id": "cpr:material:CH05.P4:feedback-windows",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "kind": "recall",
    "readerQuestion": "재능을 오래 쓰려면 무엇을 지켜야 하는가?",
    "coreMeaning": "검토·제작·개선에 공통으로 필요한 확인 창",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "세 장점 중 가장 중요한 공통 조건을 찾는다.",
        "knowledge": "실제로 선택된 장점들에서 피드백 조건만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "장점을 지나치게 사용할 때의 위험을 설명한다.",
        "knowledge": "끝없이 고치거나 비판을 전부 수용하는 위험 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "강점을 발전시키기 위한 행동을 제시한다.",
        "knowledge": "사용자가 바꿔야 할 부분과 이미 충분한 부분을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "긍정적이고 구체적인 마무리 문장을 제공한다.",
        "knowledge": "잘할 것을 더하는 대신 유효한 수정 기준을 유지",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:completion-quality",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "ADAPTABILITY",
        "id": "sar:facet:ADAPTABILITY:feedback-uptake",
        "definition": "받은 정보의 유효 부분을 반영",
        "condition": "정보의 신뢰성과 권한을 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "order"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "실제 쓰임이 늘어나는 방향으로 재능을 다듬을 여지",
    "shadow": "매번 새 평가를 받아야 안심",
    "factBomb": "검토 요청을 늘리면 결정 기준이 사라질 수 있음",
    "twist": "수정하지 않을 부분을 정해야 수정할 곳이 선명해짐",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 결과물의 유지 항목과 변경 항목을 고르는 가상 장면"
    },
    "application": "한 차례 피드백과 종료 기준을 합의",
    "prerequisites": [
      "선택된 P1~P3의 실제 도입 근거·행동이 전제",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "앞선 장점이 없으면 이 묶음의 기능을 새로 부여하지 않음",
    "distinction": "CH13 과제 선택보다 같은 재능의 발전·유지 조건",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH05.P1:analysis-that-decides",
      "cpr:material:CH05.P2:make-visible",
      "cpr:material:CH05.P3:standards-open-way"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH13 과제 선택보다 같은 재능의 발전·유지 조건",
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
    "id": "cpr:material:CH05.P4:role-and-rest",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "kind": "recall",
    "readerQuestion": "재능을 오래 쓰려면 무엇을 지켜야 하는가?",
    "coreMeaning": "공동 과제를 이끄는 장점의 여력 보존",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "세 장점 중 가장 중요한 공통 조건을 찾는다.",
        "knowledge": "실제 소개된 추진·배치·준비의 담당 범위 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "장점을 지나치게 사용할 때의 위험을 설명한다.",
        "knowledge": "결정권을 독점하면 부담도 모이는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "강점을 발전시키기 위한 행동을 제시한다.",
        "knowledge": "지속할 담당과 넘길 담당을 정하는 연습",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "긍정적이고 구체적인 마무리 문장을 제공한다.",
        "knowledge": "휴식과 인수인계가 추진력을 유지하는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
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
        "action"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "다른 사람도 다음 단계를 맡을 수 있게 할 여지",
    "shadow": "내가 빠지면 안 된다는 방식으로 장점을 증명",
    "factBomb": "혼자 계속 버티는 것을 팀의 안정과 혼동하지 않음",
    "twist": "자리를 비울 수 있는 체계가 더 강한 추진력일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "준비 중간에 다음 담당과 확인 일정을 남기는 가상 장면"
    },
    "application": "핵심 책임·인수인계·쉬는 시간을 함께 정함",
    "prerequisites": [
      "실제 도입한 장점·역할·자원·휴식 접근성 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "일상 부하가 미확인되면 소진을 진단하지 않음",
    "distinction": "강점의 크기보다 지속 가능한 사용 구조를 설명",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH05.P1:start-with-consent",
      "cpr:material:CH05.P2:resource-route",
      "cpr:material:CH05.P3:quiet-lead"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "강점의 크기보다 지속 가능한 사용 구조를 설명",
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
    "id": "cpr:material:CH05.P4:keep-choice-in-care",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "kind": "recall",
    "readerQuestion": "재능을 오래 쓰려면 무엇을 지켜야 하는가?",
    "coreMeaning": "관찰·설명·지원의 공통 조건은 상대의 선택권",
    "roleContributions": {
      "S1": {
        "address": "CH05.P4.S1",
        "originalRole": "세 장점 중 가장 중요한 공통 조건을 찾는다.",
        "knowledge": "실제 선택된 도움 관련 기능의 수신 조건 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P4.S2",
        "originalRole": "장점을 지나치게 사용할 때의 위험을 설명한다.",
        "knowledge": "도움을 계속 추가하면 상대가 결정할 공간을 줄임",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P4.S3",
        "originalRole": "강점을 발전시키기 위한 행동을 제시한다.",
        "knowledge": "먼저 선택지를 묻고 맡을 한 부분만 합의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P4.S4",
        "originalRole": "긍정적이고 구체적인 마무리 문장을 제공한다.",
        "knowledge": "잘 돕는 힘을 상대가 써볼 수 있게 남기기",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:respectful-nonintervention",
        "definition": "돕지 않을 선택을 존중",
        "condition": "보호 의무와 선택 지원을 구분",
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
        "care"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "상대의 자율성과 제공자의 여력을 함께 지킬 여지",
    "shadow": "도움의 양으로 좋은 관계를 증명",
    "factBomb": "상대가 할 수 있는 부분까지 대신하면 배울 자리가 줄어듦",
    "twist": "한 발 물러나는 것이 더 큰 지원일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "설명 뒤 상대가 스스로 시도할 시간을 두는 가상 장면"
    },
    "application": "도움 요청·거절·종료 세 가지를 함께 확인",
    "prerequisites": [
      "선택된 앞선 근거·당사자 동의·역할 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "지원 자료만으로 상대의 무능·의존을 부여하지 않음",
    "distinction": "반복 호의가 아닌 장점을 오래 쓰는 선택권 설계",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH05.P1:support-need-not-guess",
      "cpr:material:CH05.P2:translate-for-learner",
      "cpr:material:CH05.P3:boundaries-enable-support"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "반복 호의가 아닌 장점을 오래 쓰는 선택권 설계",
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
    "id": "cpr:material:CH05.P1:learn-and-transfer",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "kind": "natal",
    "readerQuestion": "이 기능은 무엇을 가능하게 하는가?",
    "coreMeaning": "받아 익힌 내용을 다른 질문에 옮겨 보는 강점 후보",
    "roleContributions": {
      "S1": {
        "address": "CH05.P1.S1",
        "originalRole": "가장 대표적인 강점을 직설적으로 제시한다.",
        "knowledge": "실제 학습·탐구 원천의 유효 조건을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P1.S2",
        "originalRole": "해당 강점의 주요 명리·MBTI 근거를 설명한다.",
        "knowledge": "정인·편인의 서로 다른 역할을 한 성격으로 압축하지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P1.S3",
        "originalRole": "실제로 잘할 수 있는 행동을 보여준다.",
        "knowledge": "익힌 원리를 다른 예에 시험하는 행동 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P1.S4",
        "originalRole": "그 강점이 다른 사람에게 가치가 되는 조건을 설명한다.",
        "knowledge": "실제 이해·수행·상대 필요가 확인될 때 가치",
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
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "condition": "다른 점을 비교하고 시험할 수 있을 때",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "새 문제를 익숙한 구조로 검토할 여지",
    "shadow": "배움의 상징만으로 지능·성적을 확정",
    "factBomb": "알아들은 설명과 다시 쓸 수 있는 설명은 다름",
    "twist": "실패한 적용이 배움의 빈칸을 알려줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "배운 개념을 다른 사례에 대입하는 가상 장면"
    },
    "application": "원리·적용·반례를 한 번씩 확인",
    "prerequisites": [
      "실제 원국·학습 맥락·본인 수행·근거 lineage 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·학력·전문 자격·검증된 능력으로 승격 금지",
    "distinction": "MBTI 없이 검토 가능한 학습 기능 후보",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다.",
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "MBTI 없이 검토 가능한 학습 기능 후보",
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
    "id": "cpr:material:CH05.P2:maintain-an-independent-function",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "kind": "natal",
    "readerQuestion": "첫 강점과 다른 두 번째 기능은 무엇인가?",
    "coreMeaning": "학습·분석과 다른 유지·갱신 기능의 재능 후보",
    "roleContributions": {
      "S1": {
        "address": "CH05.P2.S1",
        "originalRole": "첫 강점과 의미가 다른 재능을 제시한다.",
        "knowledge": "첫 강점과 다른 유지 기능을 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH05.P2.S2",
        "originalRole": "독립적인 근거를 설명한다.",
        "knowledge": "원국의 역할·유지 의미는 독립 실제 근거가 추가로 필요",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH05.P2.S3",
        "originalRole": "구체적인 생활 장면을 보여준다.",
        "knowledge": "반복할 일의 완료와 변경 가능성을 알리는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH05.P2.S4",
        "originalRole": "해당 재능을 살릴 수 있는 환경을 설명한다.",
        "knowledge": "주기·담당·인수인계가 합의된 환경에서 발전",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "다음 사람이 예측하고 이어갈 여지",
    "shadow": "같은 fact의 다른 이름을 독립 재능으로 세기",
    "factBomb": "꼼꼼함과 지속성도 같은 근거라면 두 번 세지 않음",
    "twist": "변경을 알리는 능력이 반복을 더 오래 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "정기 준비에서 다음 확인과 담당을 남기는 가상 장면"
    },
    "application": "첫 강점의 기능·fact root와 새 기능의 차이를 대조",
    "prerequisites": [
      "실제 원국·독립 root·본인 수행·반복 과제 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "첫 장점과 실제 근거·기여가 같으면 별도 재능으로 배정 금지",
    "distinction": "두 번째 재능에 필요한 기능·근거 독립 조건을 명리 단독으로 제공",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "두 번째 재능에 필요한 기능·근거 독립 조건을 명리 단독으로 제공",
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
