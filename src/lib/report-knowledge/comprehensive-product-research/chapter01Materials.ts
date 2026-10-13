/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH01_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH01.P1:understand-before-answer",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "kind": "natal",
    "readerQuestion": "나는 어떤 일을 먼저 확인하는 사람인가?",
    "coreMeaning": "먼저 이해해야 움직일 수 있는 설명 탐색형 인물상 후보",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "가장 특징적인 성향을 흥미롭게 소개한다.",
        "knowledge": "답보다 이해의 빈칸을 먼저 보는 성향 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "그 성향을 설명할 수 있는 쉬운 비유를 제시한다.",
        "knowledge": "비유는 길 안내 전에 지도를 펼치는 모습이며 능력 검사가 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 대표적인 행동을 묘사한다.",
        "knowledge": "낯선 규칙을 만나면 이유를 묻는 조건부 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "이 사람을 다른 사람과 구별하는 핵심 특징으로 마무리한다.",
        "knowledge": "정답의 양보다 납득 가능한 이유를 찾는 점으로 구별",
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
    "positive": "새로운 상황을 익숙한 구조로 정리할 여지",
    "shadow": "확인할 이유가 끝없이 늘어 착수를 놓침",
    "factBomb": "준비를 열심히 했는데 출발선만 계속 정비함",
    "twist": "모르는 범위를 밝히면 오히려 도움받기 쉬움",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "처음 쓰는 도구의 설명과 첫 과제를 나눠 보는 가상 장면"
    },
    "application": "오늘 결정이 달라질 질문 하나부터 확인",
    "prerequisites": [
      "실제 정인·원국 조건과 다른 독립 원천 및 본인 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "설명 없이 해보는 편이 더 잘 맞는 상황에서는 적용 보류",
    "distinction": "CH05의 분석 재능과 달리 무엇을 먼저 확인하는 사람인지 소개",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05의 분석 재능과 달리 무엇을 먼저 확인하는 사람인지 소개",
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
    "id": "cpr:material:CH01.P1:open-small-door",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "kind": "fusion",
    "readerQuestion": "나는 어떤 일을 먼저 확인하는 사람인가?",
    "coreMeaning": "가능성을 말로만 남기지 않고 작은 형태로 여는 인물상",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "가장 특징적인 성향을 흥미롭게 소개한다.",
        "knowledge": "작게 해볼 수 있는 것을 먼저 찾는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "그 성향을 설명할 수 있는 쉬운 비유를 제시한다.",
        "knowledge": "비유는 큰 설계도 대신 문 하나를 열어보는 방식",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 대표적인 행동을 묘사한다.",
        "knowledge": "새 모임이나 과제에서 작은 견본을 제안하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "이 사람을 다른 사람과 구별하는 핵심 특징으로 마무리한다.",
        "knowledge": "새로움 자체보다 반응을 볼 수 있게 만든다는 차이",
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
        "sourceId": "mbti:ENFP:identity:spark_of_possibility",
        "auditRef": "source-catalog.json#16876d687153c7f4f805",
        "sourceKind": "mbti_trait",
        "recordSha256": "45d03a7544d3f39fbf66c5ede9c5ce66c31bec2c9647ab4bf0accf11223dfa18",
        "sourceFileSha256": "093dc33663ca44087c7880b042da01546f245629fd5ba7650c35ad1c71a96648",
        "originalState": {
          "type": "ENFP",
          "area": "identity",
          "traitId": "spark_of_possibility",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C061",
        "auditRef": "source-catalog.json#a017ec5e5b94c443c385",
        "sourceKind": "fusion_research",
        "recordSha256": "34ad492a4417d98b6980cb5347fc728ba5e100c90947f76aea14460674f71202",
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
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:receipt-check",
        "definition": "표현이 어떻게 전달됐는지 확인",
        "condition": "확인 질문을 거절할 여지도 보장",
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
    "positive": "가능성을 다른 사람과 검토할 실마리 제공",
    "shadow": "작은 시작만 늘리고 마무리 자원은 비워 둠",
    "factBomb": "시작 버튼은 많은데 저장 버튼은 놓침",
    "twist": "작은 완성 하나가 다음 상상을 더 자유롭게 함",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 아이디어를 종이 견본으로 보여주는 가상 장면"
    },
    "application": "첫 견본의 확인 질문과 끝낼 기준을 함께 정함",
    "prerequisites": [
      "식신 원국 의미와 해당 ENFP trait·실제 표현 맥락을 각각 확인; C061 역할 적합성 별도 검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "아이디어 표현을 원치 않거나 시험 권한이 없으면 적용 불가",
    "distinction": "CH08의 직무 성과가 아니라 관심을 현실에 꺼내는 출발 방식",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH08의 직무 성과가 아니라 관심을 현실에 꺼내는 출발 방식",
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
    "id": "cpr:material:CH01.P1:keep-room-for-others",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "kind": "fusion",
    "readerQuestion": "나는 어떤 일을 먼저 확인하는 사람인가?",
    "coreMeaning": "약속을 지키면서 감당 가능한 도움을 남기는 인물상",
    "roleContributions": {
      "S1": {
        "address": "CH01.P1.S1",
        "originalRole": "가장 특징적인 성향을 흥미롭게 소개한다.",
        "knowledge": "맡은 몫과 타인의 어려움을 함께 살피는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P1.S2",
        "originalRole": "그 성향을 설명할 수 있는 쉬운 비유를 제시한다.",
        "knowledge": "비유는 모두의 짐을 드는 대신 자기 자리를 지키는 난간",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 대표적인 행동을 묘사한다.",
        "knowledge": "약속에 필요한 준비와 도울 여력을 나누는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P1.S4",
        "originalRole": "이 사람을 다른 사람과 구별하는 핵심 특징으로 마무리한다.",
        "knowledge": "무조건 착함보다 책임과 지속 가능성을 함께 보려는 특징",
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
        "sourceId": "mbti:ISFJ:identity:quiet_protector",
        "auditRef": "source-catalog.json#1fc7b68ee38cbe25ca6d",
        "sourceKind": "mbti_trait",
        "recordSha256": "9aca940dac86537535c10c128ba0d929dbc8c29b83e08e1a86ea9de906242718",
        "sourceFileSha256": "5558f3ca6c2fb71fdcbffd21130951733c5b440240e1d77131c3d8bde96ccdd2",
        "originalState": {
          "type": "ISFJ",
          "area": "identity",
          "traitId": "quiet_protector",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C095",
        "auditRef": "source-catalog.json#d82c40a8601e9fa92949",
        "sourceKind": "fusion_research",
        "recordSha256": "50010e390115589a3442750c4947a4ae95b65171630d77eb74ded6f4fa7aab75",
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
        "axis": "DUTY",
        "id": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
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
        "steady"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "예측 가능한 참여가 협업의 불안을 줄일 수 있음",
    "shadow": "사람을 실망시키지 않으려 담당 밖까지 맡음",
    "factBomb": "괜찮다는 답이 늘면 자기 일정이 사라짐",
    "twist": "못 맡을 몫을 말하는 것이 약속의 신뢰를 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 준비에서 담당과 추가 부탁을 구분하는 가상 장면"
    },
    "application": "원래 맡은 일과 도울 수 있는 일을 두 칸으로 나눔",
    "prerequisites": [
      "정관의 실제 위치·구조와 ISFJ 원천·도움 동의·자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "공식 의무가 없거나 도움이 부담이면 같은 행동을 기대하지 않음",
    "distinction": "CH11의 가족 역할을 가정하지 않는 전체 인물상",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11의 가족 역할을 가정하지 않는 전체 인물상",
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
    "id": "cpr:material:CH01.P2:wood-learning-condition",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "kind": "natal",
    "readerQuestion": "이 인물상은 무엇을 근거로 설명할 수 있는가?",
    "coreMeaning": "갑목·갑자와 관인 연결을 실제로 확인했을 때의 출처별 설명",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 일간과 일주의 주요 의미를 설명한다.",
        "knowledge": "실제 갑목 일간·갑자 일주는 기본 표지이며 성격 확정이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "이를 뒷받침하는 중요한 명리 구조를 제시한다.",
        "knowledge": "관인 연결은 의무와 학습 지원의 조건을 따로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "다른 오행·십성의 영향을 연결한다.",
        "knowledge": "수의 지장간·계절·투출은 같은 일주도 다르게 읽는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "앞선 성격 설명이 어떻게 도출됐는지 종합한다.",
        "knowledge": "배움을 지속할 여건을 찾는 가설까지로 종합",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:day_master:甲",
        "auditRef": "source-catalog.json#a9cf4e6c836e6e477adb",
        "sourceKind": "natal_research",
        "recordSha256": "18314601519e210863adb5a9fa299f243a6c37c553116f9183ad43f30780e699",
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
              "SajuCalcResult.dayMaster"
            ],
            "legacyRefs": [
              "knowledge:day_master_gabmok"
            ]
          },
          "deferred": [
            "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
            "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
          ],
          "appliesWhen": [
            "실제 계산된 일주의 천간이 해당 글자일 때."
          ],
          "doNotApply": [
            "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
            "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:day_pillar:甲子",
        "auditRef": "source-catalog.json#db7eddcb6e633e114699",
        "sourceKind": "natal_research",
        "recordSha256": "f512ac026d891bd832d6d24a4892676ff807da316c57de052a5caccbac4e701a",
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
              "SEXAGENARY_CYCLE",
              "index:0"
            ],
            "legacyRefs": [
              "knowledge:day_pillar_gabja",
              "taxonomy:day_pillar_gapja",
              "dayPillars:day_pillar_gapja"
            ]
          },
          "deferred": [
            "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
            "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
          ],
          "appliesWhen": [
            "엔진이 해당 조합을 실제 일주로 계산한 경우."
          ],
          "doNotApply": [
            "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
            "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
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
      },
      {
        "sourceId": "deep:day_pillar:甲子",
        "auditRef": "source-catalog.json#9ea13d9e3b790bf38083",
        "sourceKind": "natal_research",
        "recordSha256": "4eb9ca1bdbe135c0b85ca66a6b683347f3c5c630ed8766f1fa7f19ff4dec9179",
        "sourceFileSha256": "6ce7804fa213cc48f0945ed5747808e6444d3c261395a9205ef344a29602b14b",
        "originalState": {
          "verification": null,
          "review": "all_eight_domains_reviewed",
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
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "역할을 익힐 자료와 시간을 활용할 수 있음",
    "shadow": "일간 상징 하나로 계획 능력까지 확정",
    "factBomb": "나무 비유가 실제 사람보다 앞서 나가면 해석을 멈춤",
    "twist": "같은 갑자라도 지원 경로가 다르면 다른 인물상 가능",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 책임을 맡으며 필요한 학습 지원을 적는 가상 장면"
    },
    "application": "일간·일주·구조·생활 확인을 별도 항목으로 설명",
    "prerequisites": [
      "갑목·갑자 실제 계산과 관인 구조 성립; 시주 미상에서 조건 재검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "관인 연결이 미성립이면 구조 설명을 제외",
    "distinction": "CH02의 전체 오행 분포가 아니라 핵심 해석의 출처 추적",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH02의 전체 오행 분포가 아니라 핵심 해석의 출처 추적",
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
    "id": "cpr:material:CH01.P2:metal-output-context",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "kind": "natal",
    "readerQuestion": "이 인물상은 무엇을 근거로 설명할 수 있는가?",
    "coreMeaning": "신금·신사와 식상생재의 표지·산출·교환 조건을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 일간과 일주의 주요 의미를 설명한다.",
        "knowledge": "일간 신금·일주 신사는 실제 계산된 경우에만 명시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "이를 뒷받침하는 중요한 명리 구조를 제시한다.",
        "knowledge": "식상생재는 산출과 수요의 연결을 별도 성립 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "다른 오행·십성의 영향을 연결한다.",
        "knowledge": "월령과 일간 여력은 정교함 상징의 적용을 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "앞선 성격 설명이 어떻게 도출됐는지 종합한다.",
        "knowledge": "완성 기준과 실제 사용 가치를 잇는 조건부 인물상",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:day_master:辛",
        "auditRef": "source-catalog.json#6b2f6f70fe4764416014",
        "sourceKind": "natal_research",
        "recordSha256": "6393cdc5d3822084b968c6edd9288227cfaef09b7927da07d6d275efa84de25c",
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
              "SajuCalcResult.dayMaster"
            ],
            "legacyRefs": [
              "knowledge:day_master_singeum"
            ]
          },
          "deferred": [
            "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
            "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
          ],
          "appliesWhen": [
            "실제 계산된 일주의 천간이 해당 글자일 때."
          ],
          "doNotApply": [
            "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
            "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:day_pillar:辛巳",
        "auditRef": "source-catalog.json#fe180ba66061f054fa1b",
        "sourceKind": "natal_research",
        "recordSha256": "452b0701e3455770a0b48ca37d1a9c09f75af0906833efeda71db2e783c3d1af",
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
              "SEXAGENARY_CYCLE",
              "index:17"
            ],
            "legacyRefs": [
              "taxonomy:day_pillar_sinsa",
              "dayPillars:day_pillar_sinsa"
            ]
          },
          "deferred": [
            "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
            "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
          ],
          "appliesWhen": [
            "엔진이 해당 조합을 실제 일주로 계산한 경우."
          ],
          "doNotApply": [
            "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
            "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
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
        "sourceId": "deep:day_pillar:辛巳",
        "auditRef": "source-catalog.json#bca9f2baa9c41dd4b43f",
        "sourceKind": "natal_research",
        "recordSha256": "3532f9077155bb5efeb406b2bb02a110d62d1394d16a53f99b1023edcbc87f26",
        "sourceFileSha256": "6ce7804fa213cc48f0945ed5747808e6444d3c261395a9205ef344a29602b14b",
        "originalState": {
          "verification": null,
          "review": "all_eight_domains_reviewed",
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
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
    "positive": "결과를 쓰는 사람의 요구를 살펴볼 수 있음",
    "shadow": "좋은 결과면 자동으로 보상이 온다고 기대",
    "factBomb": "광택을 내는 일과 값을 받는 일은 다른 과제",
    "twist": "덜 다듬고 수요를 확인하는 것이 완성을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작업물의 완성 기준과 사용 요청을 맞추는 가상 장면"
    },
    "application": "정교함·산출·가격은 서로 다른 근거로 확인",
    "prerequisites": [
      "실제 신금·신사·식상생재 및 전체 원국 조건; 실제 판매는 미확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구조 미성립·비상업 과제이면 보상 연결 보류",
    "distinction": "CH09의 실제 돈 관리 원칙을 미리 단정하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09의 실제 돈 관리 원칙을 미리 단정하지 않음",
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
    "id": "cpr:material:CH01.P2:water-pressure-support",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "kind": "natal",
    "readerQuestion": "이 인물상은 무엇을 근거로 설명할 수 있는가?",
    "coreMeaning": "임수·임신과 살인상생 후보를 표지와 구조로 분리",
    "roleContributions": {
      "S1": {
        "address": "CH01.P2.S1",
        "originalRole": "실제 일간과 일주의 주요 의미를 설명한다.",
        "knowledge": "임수·임신의 실제 간지를 먼저 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P2.S2",
        "originalRole": "이를 뒷받침하는 중요한 명리 구조를 제시한다.",
        "knowledge": "살인상생은 압박·지원·수용 여력이 있는 구조 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P2.S3",
        "originalRole": "다른 오행·십성의 영향을 연결한다.",
        "knowledge": "지장간과 통근은 표지 하나의 일반화를 막는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P2.S4",
        "originalRole": "앞선 성격 설명이 어떻게 도출됐는지 종합한다.",
        "knowledge": "어려움을 이해 가능한 과제로 바꿀 가능성만 연결",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:day_master:壬",
        "auditRef": "source-catalog.json#bba1b4bc827d09bb15c4",
        "sourceKind": "natal_research",
        "recordSha256": "d1305afac8546c7524d6619ef0add6de8ea7b4f48f14f1a90822255de0a15e01",
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
              "SajuCalcResult.dayMaster"
            ],
            "legacyRefs": [
              "knowledge:day_master_imsu"
            ]
          },
          "deferred": [
            "일간 10개에 독립 성격 원고를 복제하지 않는다. 천간 원자료와 조건 검토를 참조한다.",
            "일간별 8개 생활 영역의 개별 적용과 과다·부족 판정은 후속 검토 대상이다."
          ],
          "appliesWhen": [
            "실제 계산된 일주의 천간이 해당 글자일 때."
          ],
          "doNotApply": [
            "일간의 오행을 곧 재성·관성 또는 용신이라고 간주하는 용도.",
            "일간 하나로 직업·배우자·성격·부의 수준을 확정하는 용도."
          ]
        }
      },
      {
        "sourceId": "foundation:day_pillar:壬申",
        "auditRef": "source-catalog.json#cc9d9d517d752d19395a",
        "sourceKind": "natal_research",
        "recordSha256": "fe0d771a67e4f93842d7cc19e4cff49258b124aecd36f716265f0dfd633a6e62",
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
              "SEXAGENARY_CYCLE",
              "index:8"
            ],
            "legacyRefs": [
              "taxonomy:day_pillar_imsin",
              "dayPillars:day_pillar_imsin"
            ]
          },
          "deferred": [
            "60일주별 독립 전통 성격·직업·재물·가족 해석의 문헌 근거는 별도 교감이 필요하다.",
            "기존 dayPillars의 의미·긍정·주의·문장 재료는 그대로 보존되며 이 항목에 복사하지 않는다."
          ],
          "appliesWhen": [
            "엔진이 해당 조합을 실제 일주로 계산한 경우."
          ],
          "doNotApply": [
            "간지 순번·띠·한 가지 물상으로 평생 사건·배우자·직업을 단정하는 용도.",
            "기존 60일주 편집 문장을 출처 검증 없이 고전 원문으로 승격하는 용도."
          ]
        }
      },
      {
        "sourceId": "csr:profile:salin_sangsaeng",
        "auditRef": "source-catalog.json#ebc75d28637a5df43bc6",
        "sourceKind": "natal_research",
        "recordSha256": "9e8d17765c83a731a9b2d940f31b815d2ee4fadf7a5a0e197e3bb747c1be52aa",
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
              "killingResourceFlow"
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
        "sourceId": "deep:day_pillar:壬申",
        "auditRef": "source-catalog.json#be7f0a94c847543dcc5b",
        "sourceKind": "natal_research",
        "recordSha256": "e1828c4e975916874a237481e561274c4b74a74b92a1986f068516ce320d88a5",
        "sourceFileSha256": "6ce7804fa213cc48f0945ed5747808e6444d3c261395a9205ef344a29602b14b",
        "originalState": {
          "verification": null,
          "review": "all_eight_domains_reviewed",
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
        "axis": "ADAPTABILITY",
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "필요한 지식을 구해 상황을 다시 다룰 여지",
    "shadow": "어려움이 있으면 반드시 성장한다고 해석",
    "factBomb": "힘든 일을 성장 재료라는 말로 참게 하지 않음",
    "twist": "지원이 부족하면 배움보다 부담을 줄이는 것이 먼저",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "낯선 책임을 자료·도움·작은 수행으로 나누는 가상 장면"
    },
    "application": "현재 과제와 지원 가능성을 확인한 뒤 적용",
    "prerequisites": [
      "실제 간지·살인상생 조건·원국 여력 확인; 사건 경험은 입력되지 않음",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "과도한 부담·지원 부재이면 긍정 전환을 보류",
    "distinction": "기존 과거 경험을 꾸며 핵심 성향의 이유로 쓰지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "기존 과거 경험을 꾸며 핵심 성향의 이유로 쓰지 않음",
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
    "id": "cpr:material:CH01.P3:criteria-and-questions",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "kind": "fusion",
    "readerQuestion": "MBTI를 함께 보면 어떤 질문이 추가되는가?",
    "coreMeaning": "질문을 만드는 원국 상징과 기준을 의심하는 유형 설명의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "해당 MBTI에서 특징적인 사고·행동 성향을 소개한다.",
        "knowledge": "INTJ 원천의 기존 규칙을 재검토하는 선호 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "명리 해석과 일치하는 부분을 설명한다.",
        "knowledge": "편인의 탐색 의미와 질문이라는 좁은 기능에서 비교",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "서로 다르게 나타나는 부분이 있다면 제시한다.",
        "knowledge": "상징적 탐색과 실제 검증 방식은 같은 사실이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "두 분석을 함께 사용해 얻는 새로운 해석을 제공한다.",
        "knowledge": "어떤 반례가 나오면 기준을 고칠지 함께 보는 질문",
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
        "sourceId": "mbti:INTJ:identity:strategic_skeptic",
        "auditRef": "source-catalog.json#48b443bb748ac81f2a3d",
        "sourceKind": "mbti_trait",
        "recordSha256": "1f2cc74c199ce626b165ed088618573659162aca303a2cbfee9c19d0e91a03e0",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "identity",
          "traitId": "strategic_skeptic",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "mbti:INTJ:thinkingStyle:system_first_thinking",
        "auditRef": "source-catalog.json#88a8ae8e5733c323bd3a",
        "sourceKind": "mbti_trait",
        "recordSha256": "41d3a67731d994d294cf37f81479c67138a353fdb0c5daa9c7a89242a0ed12a9",
        "sourceFileSha256": "2c48ef88ead10045051529db9afa6354e80c3ef29683c0ca98265d2b77968a83",
        "originalState": {
          "type": "INTJ",
          "area": "thinkingStyle",
          "traitId": "system_first_thinking",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:intj-inquiry",
        "auditRef": "source-catalog.json#25701865c30fc283e43f",
        "sourceKind": "fusion_research",
        "recordSha256": "a14d80c742f58029ef2790ef1329cbbe03ab06b5639d1217c878625f2c7dfb1e",
        "sourceFileSha256": "fd5d3b30d17358c4500739ceed9407ea194e7ffffff4af906af64550a1afc318",
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
        "axis": "PATTERN_SENSE",
        "id": "sar:facet:PATTERN_SENSE:counterpattern",
        "definition": "맞지 않는 사례를 적극 확인",
        "condition": "자료의 출처·범위를 확인",
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
    "positive": "받아들일 이유와 바꿀 이유를 함께 확인",
    "shadow": "의심을 깊이의 증거로만 사용",
    "factBomb": "질문이 많아도 답을 바꿀 조건이 없으면 검토가 멈춤",
    "twist": "반례 하나를 수용하는 것이 더 단단한 기준을 만듦",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "기존 규칙의 유효한 경우와 예외를 적는 가상 장면"
    },
    "application": "자기 기준을 갱신할 관찰 하나를 정함",
    "prerequisites": [
      "실제 편인·INTJ trait·같은 검토 대상 확인; inferred 여부 보존",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "비판이 목적이 아니거나 실제 반례가 없으면 차이를 만들어내지 않음",
    "distinction": "CH03보다 짧은 양측 기여 소개이며 비교 원리의 전체 설명 아님",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:pian_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH03보다 짧은 양측 기여 소개이며 비교 원리의 전체 설명 아님",
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
    "id": "cpr:material:CH01.P3:lead-and-listen",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "kind": "fusion",
    "readerQuestion": "MBTI를 함께 보면 어떤 질문이 추가되는가?",
    "coreMeaning": "압박 대응 상징과 공동 목표 제안 선호를 함께 읽는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "해당 MBTI에서 특징적인 사고·행동 성향을 소개한다.",
        "knowledge": "ENTJ 원천의 목표를 조직하는 선호 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "명리 해석과 일치하는 부분을 설명한다.",
        "knowledge": "편관의 압박 조건과 앞서 결정하는 점에서 관련성 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "서로 다르게 나타나는 부분이 있다면 제시한다.",
        "knowledge": "공식 권한·평상시 행동은 압박 대응과 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "두 분석을 함께 사용해 얻는 새로운 해석을 제공한다.",
        "knowledge": "공동 방향과 반대 의견 통로를 함께 두는 새 과제",
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
        "sourceId": "fkr:legacy:entj-pressure",
        "auditRef": "source-catalog.json#945007633c5d9d749423",
        "sourceKind": "fusion_research",
        "recordSha256": "6ec9023ba18ac6a1bfd31a0c46dfad2f7bbb758c89fd443325fb42d2bcacbf79",
        "sourceFileSha256": "fd5d3b30d17358c4500739ceed9407ea194e7ffffff4af906af64550a1afc318",
        "originalState": {
          "review": "conditional_editorial_not_empirical",
          "connectedToRuntime": false,
          "approvedForCustomer": false,
          "sourcePolicy": "myeongli_fact_and_mbti_source_not_three_independent_facts",
          "mbtiSourceStatus": "existing_local_source_not_empirical"
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
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:dissent-channel",
        "definition": "이견이 들어올 통로를 만듦",
        "condition": "권력·평가 관계를 먼저 확인",
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
    "positive": "급할 때 책임자를 정하고 필요한 의견을 받을 여지",
    "shadow": "속도가 다른 동료의 이견을 비효율로 처리",
    "factBomb": "답을 빨리 낸 사람이 질문까지 끝낼 필요는 없음",
    "twist": "이견을 받으면 리더 역할의 범위가 더 정확해짐",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "급한 과제에서 결론과 확인 질문을 따로 배정하는 가상 장면"
    },
    "application": "결정권·의견 제출 기한을 함께 밝힘",
    "prerequisites": [
      "같은 개인의 편관·ENTJ 실제 원천과 과제 권한·상황 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "공동 책임자 역할이 아니면 지휘 성향으로 확정하지 않음",
    "distinction": "타고난 리더·승진 운을 선언하지 않는 기여 차이",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "타고난 리더·승진 운을 선언하지 않는 기여 차이",
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
    "id": "cpr:material:CH01.P3:values-and-expression",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "kind": "fusion",
    "readerQuestion": "MBTI를 함께 보면 어떤 질문이 추가되는가?",
    "coreMeaning": "표현의 원국 상징과 내적 가치 기준이 만나는 말의 선택",
    "roleContributions": {
      "S1": {
        "address": "CH01.P3.S1",
        "originalRole": "해당 MBTI에서 특징적인 사고·행동 성향을 소개한다.",
        "knowledge": "INFP 원천의 가치 일치 선호 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P3.S2",
        "originalRole": "명리 해석과 일치하는 부분을 설명한다.",
        "knowledge": "식신의 산출·표현 상징과 뜻을 담는 과제에서 비교",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P3.S3",
        "originalRole": "서로 다르게 나타나는 부분이 있다면 제시한다.",
        "knowledge": "표현 가능성과 언제 말하고 싶은지는 다른 정보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P3.S4",
        "originalRole": "두 분석을 함께 사용해 얻는 새로운 해석을 제공한다.",
        "knowledge": "가치가 전달될 통로를 스스로 고르는 조건부 해석",
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
        "sourceFileSha256": "da20db33f5117531247ce3a366a20925ca5845f19174efaf20e356763ecae94a",
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
        "axis": "MEANING",
        "id": "sar:facet:MEANING:value-articulation",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
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
        "voice"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "소중한 이유를 구체적인 말·작업으로 옮길 여지",
    "shadow": "진정성이 있으면 상대도 뜻을 알아줄 것이라 기대",
    "factBomb": "마음속의 진심은 전달 방식까지 대신해 주지 않음",
    "twist": "짧게 표현해도 자신의 가치를 충분히 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "중요한 의견을 글과 대화 중 고르는 가상 장면"
    },
    "application": "전할 핵심 하나와 공개할 범위를 정함",
    "prerequisites": [
      "식신·실제 INFP trait·표현할 내용과 동의 확인; C057 정확한 역할 재검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "표현을 원하지 않으면 침묵을 결함으로 다루지 않음",
    "distinction": "명리와 MBTI를 둘 다 같은 진정성의 증거로 합산하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리와 MBTI를 둘 다 같은 진정성의 증거로 합산하지 않음",
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
    "id": "cpr:material:CH01.P4:precision-has-a-stop",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "kind": "natal",
    "readerQuestion": "나를 관통하는 장점과 이면은 어떤 조건에서 갈리는가?",
    "coreMeaning": "오류를 찾는 힘과 결정을 닫을 기준의 대비",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "가장 중요한 성격적 대비를 설명한다.",
        "knowledge": "빈틈을 보고도 어디서 멈출지 필요한 대비",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "그 특징이 장점으로 작동하는 상황을 보여준다.",
        "knowledge": "누락의 비용이 큰 과제에서는 점검이 가치를 더함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "지나치게 발휘되었을 때의 문제를 설명한다.",
        "knowledge": "모든 차이를 고치려 하면 결정권과 시간이 소모",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "이 사람의 핵심 결을 기억에 남는 문장으로 정리한다.",
        "knowledge": "기억할 핵심은 중요한 오류에 힘을 쓰는 기준",
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
        "id": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
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
        "order"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "핵심 재작업을 줄일 가능성",
    "shadow": "완벽한 확인을 시작 허가로 사용",
    "factBomb": "마침표를 찍는 것도 정확성의 일부라는 팩폭",
    "twist": "덜 확인해도 되는 부분을 고르는 것이 전문성을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "발표 전 핵심 수치와 꾸밈 요소를 나누는 가상 장면"
    },
    "application": "확인할 항목과 종료 조건을 먼저 정함",
    "prerequisites": [
      "실제 원국·생활의 오류 확인 맥락; 상관·금만으로 현대 능력 확정 금지",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "정확성 근거가 없거나 안전상 추가 검토 필요하면 시간 단축 보류",
    "distinction": "CH06의 비용 분석을 미리 반복하지 않는 대표 대비",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH06의 비용 분석을 미리 반복하지 않는 대표 대비",
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
    "id": "cpr:material:CH01.P4:care-with-choice",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "kind": "fusion",
    "readerQuestion": "나를 관통하는 장점과 이면은 어떤 조건에서 갈리는가?",
    "coreMeaning": "도움받을 선택과 돕고 싶은 선호가 공존하는 대비",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "가장 중요한 성격적 대비를 설명한다.",
        "knowledge": "함께하고 싶어도 선택권은 남겨야 하는 특징",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "그 특징이 장점으로 작동하는 상황을 보여준다.",
        "knowledge": "상대가 도움을 원할 때 구체적 부담을 덜어줄 여지",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "지나치게 발휘되었을 때의 문제를 설명한다.",
        "knowledge": "상대의 선택까지 챙기면 좋은 뜻이 간섭이 됨",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "이 사람의 핵심 결을 기억에 남는 문장으로 정리한다.",
        "knowledge": "핵심은 필요한 도움을 함께 고르는 사람이라는 가설",
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
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "지원의 내용과 수신자의 뜻을 맞출 가능성",
    "shadow": "수혜 상징을 제공 능력으로 뒤집어 확정",
    "factBomb": "도움을 준 뒤 감사까지 설계하지 않음",
    "twist": "돕지 않기로 합의하는 것도 배려가 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "도움 제안에 가능한 방법과 거절 여지를 남기는 가상 장면"
    },
    "application": "정인의 지원 수용과 ENFJ의 도움 제공을 별도 확인",
    "prerequisites": [
      "지원 수혜·제공 방향이 다름; 실제 개인 행동·동의가 추가로 필요",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "정인만으로 CARE 제공을 주장하는 연결은 보류",
    "distinction": "CH11 돌봄 역할을 가정하지 않고 전체 대비만 소개",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 돌봄 역할을 가정하지 않고 전체 대비만 소개",
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
    "id": "cpr:material:CH01.P4:change-keeps-purpose",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "kind": "fusion",
    "readerQuestion": "나를 관통하는 장점과 이면은 어떤 조건에서 갈리는가?",
    "coreMeaning": "새 선택과 지킬 목적을 함께 가진 인물상 대비",
    "roleContributions": {
      "S1": {
        "address": "CH01.P4.S1",
        "originalRole": "가장 중요한 성격적 대비를 설명한다.",
        "knowledge": "바꿀 수단과 남길 생활 조건을 나누는 대비",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH01.P4.S2",
        "originalRole": "그 특징이 장점으로 작동하는 상황을 보여준다.",
        "knowledge": "방법이 막혔을 때 다른 경로를 찾을 여지",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH01.P4.S3",
        "originalRole": "지나치게 발휘되었을 때의 문제를 설명한다.",
        "knowledge": "새로움이 목표를 대신하면 시작만 반복",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH01.P4.S4",
        "originalRole": "이 사람의 핵심 결을 기억에 남는 문장으로 정리한다.",
        "knowledge": "핵심은 변화를 고르는 기준을 가진 탐색이라는 가설",
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
        "sourceId": "mbti:ENTP:identity:rule_breaking_innovator",
        "auditRef": "source-catalog.json#ed517424138830a947a6",
        "sourceKind": "mbti_trait",
        "recordSha256": "91c2a87868904e37d1c0877aa232459c74eade0bd5649ebdaffb3feb31acfe18",
        "sourceFileSha256": "07777e18f189be746a6339aef118a8589c05f6121450586bfe63e8959b42daab",
        "originalState": {
          "type": "ENTP",
          "area": "identity",
          "traitId": "rule_breaking_innovator",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:complement:C084",
        "auditRef": "source-catalog.json#e2341fa24f153a511269",
        "sourceKind": "fusion_research",
        "recordSha256": "73f432ecc5e35ee8fff3a6b64c205c5bc0b99ef38c4ff252598cb3499c013ada",
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
        "axis": "CHANGE_ORIENTATION",
        "id": "sar:facet:CHANGE_ORIENTATION:chosen-change",
        "definition": "스스로 선택한 변화와 강제 변화를 구별",
        "condition": "변경 권한과 실제 제약이 확인될 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "ADAPTABILITY",
        "id": "sar:facet:ADAPTABILITY:constraint-response",
        "definition": "새 제약에 가능한 행동을 재배치",
        "condition": "거절의 불이익과 안전을 먼저 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "flexible"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "상황이 달라도 중요한 목적을 이어갈 가능성",
    "shadow": "발견한 선택을 모두 실행 가능한 기회로 처리",
    "factBomb": "새 길이 많아도 돌아올 집의 조건은 필요",
    "twist": "유지할 것을 정하면 더 안전하게 바꿀 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 제안의 비용과 지금 지킬 약속을 비교하는 가상 장면"
    },
    "application": "바꿀 한 가지와 유지할 한 가지를 짝으로 적음",
    "prerequisites": [
      "편재 상징·ENTP 실제 trait·변경 권한과 자원 확인; C084 역할 적합성 재검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "선택권이 없거나 생계 안전이 위태로우면 시도 권장 보류",
    "distinction": "성격의 변덕·재물 성공으로 대비를 과장하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "성격의 변덕·재물 성공으로 대비를 과장하지 않음",
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
