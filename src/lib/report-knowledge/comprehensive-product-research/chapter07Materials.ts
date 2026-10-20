/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH07_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH07.P1:help-has-a-door",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "kind": "natal",
    "readerQuestion": "원국에서 실제 확인되는 좋은 상징은 무엇인가?",
    "coreMeaning": "천을귀인의 도움 상징을 실제 지원 통로를 찾는 관점으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "가장 강하게 확인되는 긍정적 특징을 소개한다.",
        "knowledge": "실제로 검출된 천을귀인의 긍정 상징을 후보로 소개",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "해당 특징과 관련된 명리 요소를 설명한다.",
        "knowledge": "원국 전체·생왕·충파·공망의 조건을 함께 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 좋은 가능성을 설명한다.",
        "knowledge": "혼자 막힌 문제에서 물어볼 사람과 질문을 찾을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "독자가 기억할 만한 긍정적 메시지를 제시한다.",
        "knowledge": "좋은 패는 혼자 버티는 것 외의 문을 살피는 관점",
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
      }
    ],
    "semanticFacets": [
      {
        "axis": "INITIATIVE",
        "id": "sar:facet:INITIATIVE:help-initiation",
        "definition": "필요한 도움을 먼저 요청",
        "condition": "상대의 거절·자원 조건을 확인",
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
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "도움이 필요한 지점을 구체화할 수 있음",
    "shadow": "귀인이 있으니 누군가 반드시 구해 준다고 해석",
    "factBomb": "귀인의 이름이 실제 지원자의 연락처는 아님",
    "twist": "도움을 요청하는 선택이 자기 판단을 더 단단하게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "막힌 일을 한 질문으로 줄여 경험자에게 묻는 가상 장면"
    },
    "application": "실제 지원 가능성·접근·동의를 확인",
    "prerequisites": [
      "천을귀인 실제검출·기준축·충파·원국 조건 확인; 현대 적용은 편집 연구",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "검출되지 않거나 도움 통로가 없으면 실제 지원 예고 금지",
    "distinction": "CH05의 돕는 재능과 다른 도움 수혜 상징",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05의 돕는 재능과 다른 도움 수혜 상징",
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
    "id": "cpr:material:CH07.P1:learning-support-card",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "kind": "natal",
    "readerQuestion": "원국에서 실제 확인되는 좋은 상징은 무엇인가?",
    "coreMeaning": "정인과 관인 연결의 지원·학습 상징이 쓰일 자리",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "가장 강하게 확인되는 긍정적 특징을 소개한다.",
        "knowledge": "실제 유효한 정인과 연결 조건을 긍정 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "해당 특징과 관련된 명리 요소를 설명한다.",
        "knowledge": "정인은 받아 익힐 자원, 관인 연결은 역할과 지원 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 좋은 가능성을 설명한다.",
        "knowledge": "새 역할에 필요한 자료·가르침을 찾는 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "독자가 기억할 만한 긍정적 메시지를 제시한다.",
        "knowledge": "좋은 바탕을 실제로 꺼내 쓸 수 있는 질문으로 기억",
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
        "axis": "DUTY",
        "id": "sar:facet:DUTY:role-fulfilment",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
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
    "positive": "모르는 부분을 배워 담당할 여지",
    "shadow": "지원 상징을 학벌·시험 합격·자격 보장으로 변환",
    "factBomb": "좋은 교재의 상징과 공부를 끝낸 사실은 다름",
    "twist": "질문을 드러내는 것이 부족함보다 성장의 출발이 될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 역할에서 필요한 교육과 실습을 요청하는 가상 장면"
    },
    "application": "역할 요구·배울 내용·실습 자리를 확인",
    "prerequisites": [
      "실제 정인·관인 성립·강약·지원 여건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구조 미성립이면 정인 단독 의미까지로 제한",
    "distinction": "CH05 일반 학습 능력보다 원국의 지원 연결 조건",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 일반 학습 능력보다 원국의 지원 연결 조건",
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
    "id": "cpr:material:CH07.P1:made-value-can-travel",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "kind": "natal",
    "readerQuestion": "원국에서 실제 확인되는 좋은 상징은 무엇인가?",
    "coreMeaning": "식상생재의 산출·교환 연결을 긍정 가능성으로 설명",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "가장 강하게 확인되는 긍정적 특징을 소개한다.",
        "knowledge": "실제 구조가 확인된 경우 만드는 힘과 교환의 연결 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "해당 특징과 관련된 명리 요소를 설명한다.",
        "knowledge": "산출이 다른 사람의 필요와 만나는 원국 의미",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 좋은 가능성을 설명한다.",
        "knowledge": "만든 결과를 실제로 쓰는 사람을 찾는 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "독자가 기억할 만한 긍정적 메시지를 제시한다.",
        "knowledge": "좋은 패는 잘 만든 것의 쓰임을 살피는 연결",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
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
    "positive": "제작과 수요를 함께 질문할 여지",
    "shadow": "구조 이름만으로 매출 증가·창업 성공 보장",
    "factBomb": "만든 양과 필요한 사람이 생기는 일은 다른 조건",
    "twist": "작은 사용 반응이 더 많이 만드는 것보다 큰 정보를 줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "견본을 사용할 사람에게 필요한 수정점을 묻는 가상 장면"
    },
    "application": "수요·가격·유지 책임·개인 여력을 각각 검토",
    "prerequisites": [
      "실제 구조 성립·원국 여력·실제 생활 과제 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구조 미성립·비상업 맥락이면 재물 해석으로 확대 금지",
    "distinction": "CH09의 관리 방법보다 긍정적인 명리 연결의 이유",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09의 관리 방법보다 긍정적인 명리 연결의 이유",
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
    "id": "cpr:material:CH07.P1:munchang-held-study-symbol",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "kind": "natal",
    "readerQuestion": "원국에서 실제 확인되는 좋은 상징은 무엇인가?",
    "coreMeaning": "문창의 학습·문장 응용은 기존 배치표 차이 검증 전 보류",
    "roleContributions": {
      "S1": {
        "address": "CH07.P1.S1",
        "originalRole": "가장 강하게 확인되는 긍정적 특징을 소개한다.",
        "knowledge": "문창이 검출돼도 긍정 서사의 승인과 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P1.S2",
        "originalRole": "해당 특징과 관련된 명리 요소를 설명한다.",
        "knowledge": "기존 명칭·계산표와 전통 배치의 교감 문제가 남아 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P1.S3",
        "originalRole": "실제 생활에서 나타날 수 있는 좋은 가능성을 설명한다.",
        "knowledge": "정인의 별도 실제 학습 의미가 있을 때 그 부분만 설명 가능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P1.S4",
        "originalRole": "독자가 기억할 만한 긍정적 메시지를 제시한다.",
        "knowledge": "문창의 개인 적용은 검증 대기라는 연구 상태",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:munchang",
        "auditRef": "source-catalog.json#ab32693ae1655a1444a6",
        "sourceKind": "natal_research",
        "recordSha256": "a8aa6bd11349bac7c737a14db14649ca9468bcbee2a9318c1ed7bac401201691",
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
              "SHINSAL_RULES:MUN_CHANG_GWIIN"
            ],
            "legacyRefs": [
              "knowledge:nobleman_munchang",
              "taxonomy:gwiin_munchang",
              "shinsal:MUN_CHANG_GWIIN"
            ]
          },
          "deferred": [
            "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
            "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다.",
            "문창의 전통 배치표와 현재 계산표 사이의 계보·전사 오자 대조. 계산은 변경하지 않는다."
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
        "axis": "EXPRESSION",
        "id": "sar:facet:EXPRESSION:channel-choice",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "research"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "자료가 검증되면 학습·설명 과제의 별도 질문 후보가 될 수 있음",
    "shadow": "이름이 문창이므로 글재주·합격을 확정",
    "factBomb": "좋은 이름이 확인되지 않은 능력을 대신 만들지 않음",
    "twist": "보류해도 별도로 확인된 정인의 의미는 남음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "자료 검토 시 문창 표와 실제 계산표를 나누는 가상 연구 장면"
    },
    "application": "전거·계보·배치 차이를 먼저 대조",
    "prerequisites": [
      "문창 전거·현재표 불일치 해결 전 고객 적용 불가; 정인은 독립 실제 근거 필요",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "문창만으로 지능·작문·시험 결과 승인 금지",
    "distinction": "원천 부족 후보를 조용히 검증 완료로 섞지 않는 보류 자료",
    "sourceReviewNotes": [
      "원천 foundation:shinsal_gwiin:munchang의 정의·전거 부족을 해결하지 못해 보류한다.",
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "원천 부족 후보를 조용히 검증 완료로 섞지 않는 보류 자료",
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
    "review": "source_or_condition_insufficient"
  },
  {
    "id": "cpr:material:CH07.P2:reserve-with-purpose",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "kind": "natal",
    "readerQuestion": "첫 좋은 패와 다른 힘은 무엇인가?",
    "coreMeaning": "정재의 축적 상징을 유지할 생활 조건의 관점으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "첫 문단과 다른 긍정적 근거를 선정한다.",
        "knowledge": "P1과 다른 실제 정재 근거가 있을 때 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "귀인·재능·관계·성공 관련 의미를 정확히 설명한다.",
        "knowledge": "축적은 실제 잔고가 아니라 관리·교환 역할의 상징",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "도움을 받거나 강점이 발휘되는 상황을 보여준다.",
        "knowledge": "필수 비용과 예비 여력을 살피는 생활 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "그 힘이 작동하는 조건을 제시한다.",
        "knowledge": "실제 자원이 있을 때 비축의 목적을 고르는 조건",
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
        "axis": "STABILITY",
        "id": "sar:facet:STABILITY:minimum-security",
        "definition": "유지할 최소 생활 조건을 정함",
        "condition": "실제 위험과 선호를 분리",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "resources"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "중요한 생활 기반을 남길 질문을 마련",
    "shadow": "정재가 있으니 부자·절약가라고 단정",
    "factBomb": "남기는 이유가 없으면 아끼는 행동도 답답해질 수 있음",
    "twist": "자원을 쓰는 시점을 고르는 것이 축적을 살릴 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 계획에서 유지 비용과 예비 시간을 남기는 가상 장면"
    },
    "application": "비축의 목적·실제 여력·필수 조건을 확인",
    "prerequisites": [
      "실제 정재·강약·다른 재성·본인 상황 확인; P1의 같은 fact면 독립 패로 집계 금지",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 잔고·소득·금액을 상징에서 추정 금지",
    "distinction": "CH09 돈 관리법보다 정재 상징의 긍정 역할",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09 돈 관리법보다 정재 상징의 긍정 역할",
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
    "id": "cpr:material:CH07.P2:start-and-finish-card",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "kind": "natal",
    "readerQuestion": "첫 좋은 패와 다른 힘은 무엇인가?",
    "coreMeaning": "태극귀인의 시작·귀착 상징을 목적과 마무리 점검으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "첫 문단과 다른 긍정적 근거를 선정한다.",
        "knowledge": "실제 태극귀인이 확인될 때 별도 긍정 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "귀인·재능·관계·성공 관련 의미를 정확히 설명한다.",
        "knowledge": "기운의 시작과 귀착을 짝짓는 전통 분류를 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "도움을 받거나 강점이 발휘되는 상황을 보여준다.",
        "knowledge": "몰입할 과제에서 시작 이유와 종료 기준을 함께 정하는 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "그 힘이 작동하는 조건을 제시한다.",
        "knowledge": "신비 능력보다 처음과 끝을 살피는 편집 응용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:taegeuk",
        "auditRef": "source-catalog.json#7f2c1ccc0c1e3b56bb38",
        "sourceKind": "natal_research",
        "recordSha256": "85c4617d3c6b3b45cde4c619ae12e5250a4f17572a4236fb1e645407d155f679",
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
              "SHINSAL_RULES:TAEGEUK_GWIIN"
            ],
            "legacyRefs": [
              "knowledge:nobleman_taegeuk",
              "taxonomy:gwiin_taegeuk",
              "shinsal:TAEGEUK_GWIIN"
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
      }
    ],
    "semanticFacets": [
      {
        "axis": "PERSISTENCE",
        "id": "sar:facet:PERSISTENCE:stop-rule",
        "definition": "지속의 종료 조건을 정함",
        "condition": "효과·비용을 다시 볼 자료가 있을 때",
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
        "steady"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "시도한 것을 다음 선택의 자료로 남길 여지",
    "shadow": "영적 자질·천재성·종교 운을 확정",
    "factBomb": "왜 시작했는지 잊고 계속하는 것까지 깊이라고 부르지 않음",
    "twist": "끝내는 기준이 다음 시작의 여력을 남길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "배울 주제의 시작 이유와 끝낼 결과를 적는 가상 장면"
    },
    "application": "목적·종료 기준·남길 기록을 함께 확인",
    "prerequisites": [
      "실제 태극 검출·기준·전통 조건 확인; 생활 응용은 조건부 편집",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "검출되지 않으면 명칭을 인상적인 비유로 부여 금지",
    "distinction": "정인의 습득·천을의 지원과 다른 시작·종료 관점",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "정인의 습득·천을의 지원과 다른 시작·종료 관점",
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
    "id": "cpr:material:CH07.P2:center-of-shared-work",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "kind": "natal",
    "readerQuestion": "첫 좋은 패와 다른 힘은 무엇인가?",
    "coreMeaning": "장성의 중심 상징과 정관의 역할 조건을 함께 검토",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "첫 문단과 다른 긍정적 근거를 선정한다.",
        "knowledge": "P1과 다른 실제 장성·역할 근거를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "귀인·재능·관계·성공 관련 의미를 정확히 설명한다.",
        "knowledge": "장성은 삼합 가운데 자리의 장수 상징이며 직책이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "도움을 받거나 강점이 발휘되는 상황을 보여준다.",
        "knowledge": "실제 조정 역할을 맡으면 담당과 권한을 나눌 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "그 힘이 작동하는 조건을 제시한다.",
        "knowledge": "공동 목적·권한·동의가 있을 때 활용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:jangseong",
        "auditRef": "source-catalog.json#b724381ec7fe09d28fe0",
        "sourceKind": "natal_research",
        "recordSha256": "32e09231866902c37b2db529935baa2e5982deea821635fa2c8c0044217d0f3d",
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
              "SHINSAL_RULES:TWELVE_JANGSEONGSAL"
            ],
            "legacyRefs": [
              "knowledge:sinsal_jangseong",
              "taxonomy:twelve_sinsal_jangseong",
              "shinsal:TWELVE_JANGSEONGSAL"
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
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "condition": "담당자의 자원과 거절 가능성 확인",
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
    "positive": "사람들이 다음 담당을 알 수 있게 돕는 관점",
    "shadow": "장성 때문에 리더·승진·명예가 보장된다고 주장",
    "factBomb": "장수 비유가 타인을 지휘할 권한증은 아님",
    "twist": "권한을 나누는 것이 중심 역할을 더 안정시킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 준비에서 결정·확인·지원 담당을 나누는 가상 장면"
    },
    "application": "공식 역할과 자발적 도움의 범위를 구분",
    "prerequisites": [
      "실제 장성 검출·정관·원국 조건·현실 권한 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "같은 장성 별칭·중복 검출을 두 독립 패로 세지 않음",
    "distinction": "CH05의 개인 리더 능력보다 전통 상징의 역할 조건",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05의 개인 리더 능력보다 전통 상징의 역할 조건",
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
    "id": "cpr:material:CH07.P2:jaego-held-storehouse",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "kind": "natal",
    "readerQuestion": "첫 좋은 패와 다른 힘은 무엇인가?",
    "coreMeaning": "재고귀인의 자산 상징은 projection·전거 검증 전 보류",
    "roleContributions": {
      "S1": {
        "address": "CH07.P2.S1",
        "originalRole": "첫 문단과 다른 긍정적 근거를 선정한다.",
        "knowledge": "재고 관련 계산 투영과 외부 검증 상태를 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P2.S2",
        "originalRole": "귀인·재능·관계·성공 관련 의미를 정확히 설명한다.",
        "knowledge": "기존 내부 명칭만으로 자산 축적의 전통 전거를 확정 못 함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P2.S3",
        "originalRole": "도움을 받거나 강점이 발휘되는 상황을 보여준다.",
        "knowledge": "정재의 독립 근거가 있으면 실제 자원 질문만 별도 가능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P2.S4",
        "originalRole": "그 힘이 작동하는 조건을 제시한다.",
        "knowledge": "재고 의미의 개인 승인 없이 후속 조사 대상으로 보존",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:jaego",
        "auditRef": "source-catalog.json#897888fda5bac45dedcd",
        "sourceKind": "natal_research",
        "recordSha256": "c853e20dea93692f0d571012b08a2ac153112faab8b2bc534c3357ab0eb36ac6",
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
            "calculation": "projection",
            "calculationRefs": [
              "sajuComputedFeatureExtractor: jaego"
            ],
            "legacyRefs": [
              "knowledge:nobleman_jaego",
              "knowledge:gwiin_jaego",
              "taxonomy:gwiin_jaego"
            ]
          },
          "deferred": [
            "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
            "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
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
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "resources"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "검증된다면 비축과 사용의 별도 질문 연구 가능",
    "shadow": "창고라는 이름으로 부동산·부자·상속 보장",
    "factBomb": "상징의 창고에 실제 자산을 채워 넣지 않음",
    "twist": "자료를 보류해도 자원 관리 질문은 실제 입력으로 가능",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "재고 투영 근거와 실제 보유 자산을 분리하는 가상 연구 장면"
    },
    "application": "원전·projection·지원 범위·원국 조건을 먼저 확인",
    "prerequisites": [
      "기존 정의 repository_only·projection 상태를 보존; 출처 확보 전 사용 보류",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 자산·상속·금융 상품 추천 근거로 사용 금지",
    "distinction": "검증되지 않은 재물 길성을 검증된 좋은 패와 분리",
    "sourceReviewNotes": [
      "원천 foundation:shinsal_gwiin:jaego의 정의·전거 부족을 해결하지 못해 보류한다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "검증되지 않은 재물 길성을 검증된 좋은 패와 분리",
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
    "review": "source_or_condition_insufficient"
  },
  {
    "id": "cpr:material:CH07.P3:attention-has-a-message",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "kind": "natal",
    "readerQuestion": "이 좋은 기운을 어떤 행동으로 드러낼 수 있는가?",
    "coreMeaning": "도화의 관심 상징과 표현 내용의 쓰임을 분리",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "사회·일·관계에서 가치가 되는 특징을 선정한다.",
        "knowledge": "실제 도화와 별도 식신 근거를 조건부 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "앞선 장점과 다른 근거를 설명한다.",
        "knowledge": "도화 분류의 전통 상징과 산출 의미는 다른 근거",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "실제로 인정받을 수 있는 행동을 묘사한다.",
        "knowledge": "주목받는 실제 장면에서 전달한 뜻을 확인하는 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "그 특징을 더 잘 드러내는 방법을 제안한다.",
        "knowledge": "보여줄 내용과 공개 범위를 고르면 활용 여지",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:dohwa",
        "auditRef": "source-catalog.json#3d5d19b79ca1e80681f0",
        "sourceKind": "natal_research",
        "recordSha256": "debf8f8fa431fed9978dc8fe01062dc0db3454c93d48fc519c1896c7cdc5049a",
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
              "SHINSAL_RULES:DOHWASAL"
            ],
            "legacyRefs": [
              "knowledge:sinsal_dohwa",
              "taxonomy:sinsal_dohwa",
              "shinsal:DOHWASAL"
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
        "axis": "CHARISMA",
        "id": "sar:facet:CHARISMA:situated-attention",
        "definition": "특정 장면에서 타인이 주목한 현상",
        "condition": "실제 관찰자와 장면이 필요",
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
    "positive": "주의를 받는 기회를 이해되는 표현으로 바꿀 질문",
    "shadow": "도화만으로 실제 인기·연애 호감·성적 매력 확정",
    "factBomb": "관심을 받는 것과 동의를 받은 것은 다른 일",
    "twist": "덜 드러내도 전달할 핵심이 선명해질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "발표나 소개 자리에서 기억할 한 내용을 고르는 가상 장면"
    },
    "application": "실제 주목 여부·수신 뜻·공개 동의를 확인",
    "prerequisites": [
      "실제 도화·원국 조건·표현 행동 추가 확인; 전통 성별 평가 배제",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "호감·불륜·결혼·외모를 상징에서 추정 금지",
    "distinction": "CH04 첫인상보다 긍정 상징을 사용할 내용과 조건",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH04 첫인상보다 긍정 상징을 사용할 내용과 조건",
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
    "id": "cpr:material:CH07.P3:recognition-by-role",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "kind": "natal",
    "readerQuestion": "이 좋은 기운을 어떤 행동으로 드러낼 수 있는가?",
    "coreMeaning": "정관·재생관의 역할·지원 상징을 인정받을 행동과 구분",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "사회·일·관계에서 가치가 되는 특징을 선정한다.",
        "knowledge": "실제 확인된 역할·연결 근거를 후보로 선정",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "앞선 장점과 다른 근거를 설명한다.",
        "knowledge": "재생관은 자원과 공식 역할의 연결 조건이며 승진 약속 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "실제로 인정받을 수 있는 행동을 묘사한다.",
        "knowledge": "담당 기준을 충족한 결과를 설명하는 생활 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "그 특징을 더 잘 드러내는 방법을 제안한다.",
        "knowledge": "역할의 기준과 자원·책임이 맞아야 활용 가능",
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
        "sourceId": "csr:profile:jaesaenggwan",
        "auditRef": "source-catalog.json#6ccb508c6f6247bd7ec7",
        "sourceKind": "natal_research",
        "recordSha256": "50f0a6e17aa0b972795ba739ba1de06fdbb95d7f0a0ef15496f281dfd93c42c2",
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
              "wealthCreatesOfficer"
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
        "axis": "STATUS_DRIVE",
        "id": "sar:facet:STATUS_DRIVE:formal-role",
        "definition": "공식 위치의 책임과 기준을 검토",
        "condition": "실제 조직·계약의 권한 확인",
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
        "steady"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "자신의 기여를 구체적인 수행으로 보여줄 질문",
    "shadow": "직장 직급·관직·시험 합격을 예언",
    "factBomb": "좋은 위치의 상징이 합격 통지서를 대신하지 않음",
    "twist": "작은 역할을 명확히 수행하는 것이 큰 타이틀보다 정보를 줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 과제에서 맡은 결과와 지원 조건을 정리하는 가상 장면"
    },
    "application": "평가 기준·담당·사용 자원·결과를 구분",
    "prerequisites": [
      "실제 정관·재생관 성립·권한·평가 맥락 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "앞선 장성과 같은 fact·역할이면 다른 인정 패로 중복 집계 금지",
    "distinction": "CH05 능력보다 명리의 공식 역할 연결 의미",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 능력보다 명리의 공식 역할 연결 의미",
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
    "id": "cpr:material:CH07.P3:day-pillar-resource-question",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "kind": "natal",
    "readerQuestion": "이 좋은 기운을 어떤 행동으로 드러낼 수 있는가?",
    "coreMeaning": "갑자 일주의 지장간 관계를 배움의 쓰임으로 좁히기",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "사회·일·관계에서 가치가 되는 특징을 선정한다.",
        "knowledge": "실제 갑자 일주·자중 계수의 관계가 확인될 때 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "앞선 장점과 다른 근거를 설명한다.",
        "knowledge": "일간 대비 지장간 십성은 같은 원천의 다른 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "실제로 인정받을 수 있는 행동을 묘사한다.",
        "knowledge": "익힌 내용을 남이 이해할 짧은 설명으로 남기는 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "그 특징을 더 잘 드러내는 방법을 제안한다.",
        "knowledge": "실제 이해·사용 과제가 있을 때 긍정적 응용",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "sourceId": "foundation:hidden_stem:子",
        "auditRef": "source-catalog.json#a6a30b32950aa72ab0c4",
        "sourceKind": "natal_research",
        "recordSha256": "feee1dfb7074121a0cee09c14f149f140a12a38355633537afc4da1c69fe3cc7",
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
              "HIDDEN_STEMS.子",
              "SajuCalcResult.tenGods.hiddenStems"
            ],
            "legacyRefs": []
          },
          "deferred": [
            "지장간 집합의 신뢰 가능한 원본 판본 대조 및 본기·중기·여기 배치 계보 추가 검토.",
            "지장간별 독립 생활 해석은 일간·월령·투간 근거 없이 만들지 않는다."
          ],
          "appliesWhen": [
            "실제 계산으로 항목과 출처가 확인되고 원국 전체·월령·강약 조건을 함께 검토할 때."
          ],
          "doNotApply": [
            "지장간 하나로 숨겨진 실제 감정·사건을 알아냈다고 주장하는 용도.",
            "월령 사령일수표를 기존 HIDDEN_STEMS 가중치와 혼합하거나 덮어쓰는 용도."
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
        "id": "sar:facet:LEARNING:transfer",
        "definition": "다른 문제에 배운 구조를 시험",
        "condition": "다른 점을 비교하고 시험할 수 있을 때",
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
        "research"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "혼자 익힌 것을 다른 문제에 시험할 관점",
    "shadow": "갑자면 지적·학업 성공이라고 전체 성격화",
    "factBomb": "일주 두 글자가 실제 배움의 이력을 대신하지 않음",
    "twist": "설명을 짧게 해보면 아직 모르는 부분이 드러날 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "배운 원리를 다른 예에 한 번 적용하는 가상 장면"
    },
    "application": "이해한 내용·반례·적용한 과제를 각각 확인",
    "prerequisites": [
      "실제 갑자·장간·십성·월령·원국 조건; 세 참조를 독립 세 사실로 세지 않음",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "다른 일주·시주 미상 전체구조 추정·학력 추정 금지",
    "distinction": "60일주 지식을 조건부 응용으로 사용한 예이며 유형화 아님",
    "sourceReviewNotes": [
      "원천 foundation:hidden_stem:子의 정의·전거 부족을 해결하지 못해 보류한다.",
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "60일주 지식을 조건부 응용으로 사용한 예이며 유형화 아님",
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
    "review": "source_or_condition_insufficient"
  },
  {
    "id": "cpr:material:CH07.P3:banan-held-status",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "kind": "natal",
    "readerQuestion": "이 좋은 기운을 어떤 행동으로 드러낼 수 있는가?",
    "coreMeaning": "반안의 인정·지위 응용은 전거 검증 전 보류",
    "roleContributions": {
      "S1": {
        "address": "CH07.P3.S1",
        "originalRole": "사회·일·관계에서 가치가 되는 특징을 선정한다.",
        "knowledge": "반안 검출과 해석 검증 상태를 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P3.S2",
        "originalRole": "앞선 장점과 다른 근거를 설명한다.",
        "knowledge": "원본 전거·계보 미확인 상태를 그대로 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P3.S3",
        "originalRole": "실제로 인정받을 수 있는 행동을 묘사한다.",
        "knowledge": "정관 별도 근거가 있으면 역할의 질문만 독립 사용 가능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P3.S4",
        "originalRole": "그 특징을 더 잘 드러내는 방법을 제안한다.",
        "knowledge": "반안의 개인 좋은 패 적용은 검증 대기",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:shinsal_gwiin:banan",
        "auditRef": "source-catalog.json#e4a14f0fcd5fc3fd3a34",
        "sourceKind": "natal_research",
        "recordSha256": "214a791354d43e7c4aafe0c0f8236f09acbe38ac3baa4f339692788c58e585e5",
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
              "SHINSAL_RULES:TWELVE_BANANSAL"
            ],
            "legacyRefs": [
              "knowledge:sinsal_banan",
              "taxonomy:twelve_sinsal_banan",
              "shinsal:TWELVE_BANANSAL"
            ]
          },
          "deferred": [
            "명칭별 원본 전거·계보·적용 조건 대조를 보류한다. 내부 자료를 외부 검증 완료로 취급하지 않는다.",
            "직업·재물·학업·연애·결혼·가족의 추가 해석은 출처 확보 전 보류한다."
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
        "axis": "STATUS_DRIVE",
        "id": "sar:facet:STATUS_DRIVE:formal-role",
        "definition": "공식 위치의 책임과 기준을 검토",
        "condition": "실제 조직·계약의 권한 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "condition": "담당자의 자원과 거절 가능성 확인",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "action"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "출처가 확보되면 공식 역할과 인정의 별도 조건 연구 가능",
    "shadow": "출세·승진·귀한 신분을 자동 부여",
    "factBomb": "이름에 올라탄다고 실제 직급이 올라가지는 않음",
    "twist": "보류가 실제 검증된 역할 해석을 지키는 선택",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "반안 원전과 계산 기준을 비교하는 가상 연구 장면"
    },
    "application": "전거·계보·배치·원국 조건 대조",
    "prerequisites": [
      "repository_only 상태에서 인정·지위 응용 승인 금지",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 직책·평판·계급·시험 결과 추정 금지",
    "distinction": "검증된 정관과 미검증 반안의 역할을 분리",
    "sourceReviewNotes": [
      "원천 foundation:shinsal_gwiin:banan의 정의·전거 부족을 해결하지 못해 보류한다."
    ],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "검증된 정관과 미검증 반안의 역할을 분리",
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
    "review": "source_or_condition_insufficient"
  },
  {
    "id": "cpr:material:CH07.P4:use-support-not-wait",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "kind": "recall",
    "readerQuestion": "지금 활용할 좋은 패를 어떻게 고르는가?",
    "coreMeaning": "도움·학습의 좋은 패를 실제 요청으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "가장 활용 가치가 높은 특징을 선택한다.",
        "knowledge": "앞선 실제 도입된 지원 상징 중 하나 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "해당 강점을 활용할 만한 영역을 설명한다.",
        "knowledge": "막힌 과제·배울 자료가 있는 생활 영역을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "지나치게 발휘될 때의 주의점을 간단히 제시한다.",
        "knowledge": "기다리기만 하거나 의존으로 확대하는 위험을 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "긍정적인 가능성을 기억에 남도록 마무리한다.",
        "knowledge": "도움을 구할 질문을 만들 수 있다는 긍정 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "INITIATIVE",
        "id": "sar:facet:INITIATIVE:help-initiation",
        "definition": "필요한 도움을 먼저 요청",
        "condition": "상대의 거절·자원 조건을 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "LEARNING",
        "id": "sar:facet:LEARNING:acquisition",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
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
    "positive": "필요한 지원의 통로를 찾을 여지",
    "shadow": "귀인이 있으니 준비 없이 기다려도 된다고 해석",
    "factBomb": "좋은 패가 있어도 어떤 문을 두드릴지는 남아 있음",
    "twist": "질문 하나가 지원의 실제 쓰임을 열 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "도움 요청에 배경·막힌 점·원하는 답을 붙이는 가상 장면"
    },
    "application": "실제 도입한 상징과 지원 가능성을 재확인",
    "prerequisites": [
      "앞선 동일 근거가 실제 소개됐고 접근 가능한 도움·자료가 있을 때",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "새 귀인·새 경험을 마지막 문단에 추가 금지",
    "distinction": "CH13 전체 사용법 대신 긍정 상징 한 가지의 활성화",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH07.P1:help-has-a-door",
      "cpr:material:CH07.P1:learning-support-card"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH13 전체 사용법 대신 긍정 상징 한 가지의 활성화",
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
    "id": "cpr:material:CH07.P4:use-created-value",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "kind": "recall",
    "readerQuestion": "지금 활용할 좋은 패를 어떻게 고르는가?",
    "coreMeaning": "산출·표현의 좋은 패를 실제 사용 질문으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "가장 활용 가치가 높은 특징을 선택한다.",
        "knowledge": "앞선 확인된 산출·표현 의미 중 유효한 하나 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "해당 강점을 활용할 만한 영역을 설명한다.",
        "knowledge": "실제 상대가 쓸 결과나 이해할 내용의 영역 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "지나치게 발휘될 때의 주의점을 간단히 제시한다.",
        "knowledge": "더 많이 만들거나 더 많이 보여주려는 과용 경계",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "긍정적인 가능성을 기억에 남도록 마무리한다.",
        "knowledge": "만든 것의 쓰임을 확인할 가능성으로 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "CREATION",
        "id": "sar:facet:CREATION:finish-output",
        "definition": "산출물을 전달 가능한 상태로 정리",
        "condition": "완료 기준이 합의된 상황",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "반응을 받아 다음 결과를 조정할 여지",
    "shadow": "주목이 매출·호감으로 이어진다고 보장",
    "factBomb": "보여준 횟수와 유용한 결과는 따로 확인",
    "twist": "작은 반응 하나가 큰 공개보다 다음 선택을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "견본의 쓸 부분과 이해 안 된 부분을 묻는 가상 장면"
    },
    "application": "내용·수신자·공개 범위·실제 피드백을 확인",
    "prerequisites": [
      "앞선 소개된 실제 근거·표현 행동·동의가 전제",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "도화만으로 제작·매출·호감 근거 생성 금지",
    "distinction": "긍정 상징을 결과 예언이 아닌 사용 과제로 전환",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH07.P1:made-value-can-travel",
      "cpr:material:CH07.P3:attention-has-a-message"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "긍정 상징을 결과 예언이 아닌 사용 과제로 전환",
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
    "id": "cpr:material:CH07.P4:use-role-with-room",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "kind": "recall",
    "readerQuestion": "지금 활용할 좋은 패를 어떻게 고르는가?",
    "coreMeaning": "역할·인정 상징을 감당 가능한 담당으로 회수",
    "roleContributions": {
      "S1": {
        "address": "CH07.P4.S1",
        "originalRole": "가장 활용 가치가 높은 특징을 선택한다.",
        "knowledge": "앞선 실제 도입된 역할 의미 중 하나 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH07.P4.S2",
        "originalRole": "해당 강점을 활용할 만한 영역을 설명한다.",
        "knowledge": "현실의 역할·권한·지원이 맞는 자리에서 사용",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH07.P4.S3",
        "originalRole": "지나치게 발휘될 때의 주의점을 간단히 제시한다.",
        "knowledge": "큰 직함을 얻으려 담당 밖까지 늘리는 위험 제한",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH07.P4.S4",
        "originalRole": "긍정적인 가능성을 기억에 남도록 마무리한다.",
        "knowledge": "잘 맡을 범위를 아는 것이 좋은 패의 활용이라는 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "LEADERSHIP",
        "id": "sar:facet:LEADERSHIP:delegation",
        "definition": "역할에 맞는 권한과 책임을 나눔",
        "condition": "담당자의 자원과 거절 가능성 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
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
    "positive": "권한·지원·책임을 함께 협의할 여지",
    "shadow": "좋은 패를 증명하려 과도한 역할을 감수",
    "factBomb": "패가 좋아도 한 사람이 모든 자리를 맡을 필요는 없음",
    "twist": "넘길 담당이 있어야 자기 기여도 분명해질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 과제에서 맡을 결과와 지원을 합의하는 가상 장면"
    },
    "application": "담당·지원·평가 기준·쉬는 여력을 확인",
    "prerequisites": [
      "앞선 실제 근거·권한·동의·자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "직책·승진·평판을 이미 얻은 결과로 쓰지 않음",
    "distinction": "좋은 패의 긍정은 남기되 성공 보장을 만들지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH07.P2:center-of-shared-work",
      "cpr:material:CH07.P3:recognition-by-role"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "좋은 패의 긍정은 남기되 성공 보장을 만들지 않음",
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
