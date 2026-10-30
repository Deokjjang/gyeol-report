/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH09_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH09.P1:money-as-project-resource",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "kind": "mbti",
    "readerQuestion": "돈을 선택할 때 어떤 목적을 중요하게 보는가?",
    "coreMeaning": "돈을 목표를 움직이는 자원으로 보는 선호 후보",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "돈을 벌거나 사용할 때의 대표적인 성향을 소개한다.",
        "knowledge": "소비 자체보다 이루고 싶은 목적의 자원을 살피는 경향",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "관련 명리·MBTI 근거를 설명한다.",
        "knowledge": "ENTJ capitalist_resource_logic의 money 원천 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "소비·저축·선택 상황에서 나타날 수 있는 행동을 보여준다.",
        "knowledge": "도구·사람·시간 중 어디에 쓸지 비교하는 가상 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "이 사람의 재물 관리 특징을 정리한다.",
        "knowledge": "자원을 배정하는 이유가 관리의 특징이라는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENTJ:money:capitalist_resource_logic",
        "auditRef": "source-catalog.json#1ab2480dc05b0f303177",
        "sourceKind": "mbti_trait",
        "recordSha256": "2fd5cb824effc3af530eba2ef7c1972ae831311f61b97619e178718ecc903b51",
        "sourceFileSha256": "93f94a0956a804629bdcb386dcd7938fbe8b8f029daed06cb9140692dd185b4c",
        "originalState": {
          "type": "ENTJ",
          "area": "money",
          "traitId": "capitalist_resource_logic",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
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
        "axis": "GOAL_DRIVE",
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
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
    "positive": "중요한 목적과 실제 지출을 비교할 여지",
    "shadow": "목표가 좋으면 모든 비용이 정당하다고 생각",
    "factBomb": "투자라는 이름을 붙여도 비용은 비용으로 남음",
    "twist": "이번에 쓰지 않을 자원을 정하면 목표가 더 선명해질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "같은 과제를 도구 구매와 외부 도움으로 비교하는 가상 장면"
    },
    "application": "목적·총비용·유지비·선택권을 구분",
    "prerequisites": [
      "실제 money trait·목적·가용 자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 소득·자산·투자 능력·수익률 추정 금지",
    "distinction": "CH08 업무 배치와 달리 지출의 목적·유지 부담",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH08 업무 배치와 달리 지출의 목적·유지 부담",
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
    "id": "cpr:material:CH09.P1:money-as-experience",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "kind": "mbti",
    "readerQuestion": "돈을 선택할 때 어떤 목적을 중요하게 보는가?",
    "coreMeaning": "현재의 경험과 다음 생활의 여력을 함께 보는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "돈을 벌거나 사용할 때의 대표적인 성향을 소개한다.",
        "knowledge": "즐거운 경험의 가치를 고려하는 지출 선호",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "관련 명리·MBTI 근거를 설명한다.",
        "knowledge": "ESFP experience_spending 원천의 조건부 범위 참고",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "소비·저축·선택 상황에서 나타날 수 있는 행동을 보여준다.",
        "knowledge": "하고 싶은 활동과 이후 필요한 비용을 비교하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "이 사람의 재물 관리 특징을 정리한다.",
        "knowledge": "원하는 경험과 남길 몫을 구분하는 관리 특징",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ESFP:money:experience_spending",
        "auditRef": "source-catalog.json#412220bcf92a4c16363f",
        "sourceKind": "mbti_trait",
        "recordSha256": "bd3500b042d52f5e794eae3e4fc4a726647ae1e6dd646ebed97b14ddaaecd37a",
        "sourceFileSha256": "5ace36b3856786cc4e19a9956b6fea8eef303ae951bbc5b05c84eba62741c15b",
        "originalState": {
          "type": "ESFP",
          "area": "money",
          "traitId": "experience_spending",
          "sourceCoverage": "inferred",
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
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:reserve",
        "definition": "예비 여력을 남김",
        "condition": "실제 부양·생활 제약 확인",
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
    "positive": "무조건 절약 대신 선택 이유를 분명히 할 여지",
    "shadow": "지금의 만족이 다음 달 부담을 가림",
    "factBomb": "좋은 추억도 미납 비용을 대신 갚아 주지는 않음",
    "twist": "작은 경험 예산이 즐거움을 오래 유지할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 전에 가능한 비용과 다른 선택지를 정하는 가상 장면"
    },
    "application": "필수 비용·경험 목적·감당할 한도를 따로 확인",
    "prerequisites": [
      "실제 trait·자원·본인의 원하는 경험 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "과소비·빚·재정난을 이미 겪은 일로 서술 금지",
    "distinction": "CH03의 두 원천 차이보다 실제 지출 판단 질문",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH03의 두 원천 차이보다 실제 지출 판단 질문",
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
    "id": "cpr:material:CH09.P1:money-as-meaning",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "kind": "mbti",
    "readerQuestion": "돈을 선택할 때 어떤 목적을 중요하게 보는가?",
    "coreMeaning": "중요한 가치와 현실 보상의 조건을 구분하는 후보",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "돈을 벌거나 사용할 때의 대표적인 성향을 소개한다.",
        "knowledge": "일의 의미와 보상의 균형을 묻는 돈 태도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "관련 명리·MBTI 근거를 설명한다.",
        "knowledge": "INFP low_material_drive의 원천은 실제 낮은 소득이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "소비·저축·선택 상황에서 나타날 수 있는 행동을 보여준다.",
        "knowledge": "좋아하는 일을 할 때 필요한 대가를 확인하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "이 사람의 재물 관리 특징을 정리한다.",
        "knowledge": "가치를 지키며 지속할 자원을 남기는 관리 특징",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INFP:money:low_material_drive",
        "auditRef": "source-catalog.json#5aa3def40f487ada68fe",
        "sourceKind": "mbti_trait",
        "recordSha256": "08406615ad1ee236e78f7a2c4e1359668e46f6f3ec2b88aba29dfec4555014bb",
        "sourceFileSha256": "b2f149534b4c4bcd8b8d7d776a0d84f4dc06811d213e919dde1214d9d7613ab2",
        "originalState": {
          "type": "INFP",
          "area": "money",
          "traitId": "low_material_drive",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:value-practice",
        "definition": "중요한 가치를 구체적 선택으로 옮김",
        "condition": "자원·권한의 제약을 먼저 확인",
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
        "self"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "자기 뜻과 현실 조건을 함께 말할 여지",
    "shadow": "의미 있는 일이면 대가를 묻기 어렵다고 생각",
    "factBomb": "좋은 뜻이 유지 비용을 없애 주지는 않음",
    "twist": "보상 조건을 말하면 원하는 일을 더 오래할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "의미 있는 활동의 유료·무료 범위를 나누는 가상 장면"
    },
    "application": "목적·대가·가능 시간·종료 범위를 구분",
    "prerequisites": [
      "실제 money trait·원하는 가치·가용 자원 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가난·수익 부진·특정 예술 직업을 유형에서 부여 금지",
    "distinction": "돈을 덜 원한다는 유형 설명을 실제 재무 상태로 전환하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "돈을 덜 원한다는 유형 설명을 실제 재무 상태로 전환하지 않음",
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
    "id": "cpr:material:CH09.P2:retained-value-conditions",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "kind": "natal",
    "readerQuestion": "재물 관련 상징은 어떤 현실 조건이 필요한가?",
    "coreMeaning": "정재의 축적·관리 상징과 실제 남는 자원을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "실제 확인되는 재물 관련 명리 구조를 제시한다.",
        "knowledge": "실제 정재를 먼저 확인하고 편중 구조는 별도 검토",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "해당 요소가 의미하는 바를 설명한다.",
        "knowledge": "정재 의미는 일정한 교환·관리의 관점이며 잔고가 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "재물 관련 강점이 나타나는 조건을 설명한다.",
        "knowledge": "수입·비용을 볼 실제 자료와 담당 권한이 있어야 응용",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "긍정적인 활용 방향을 제시한다.",
        "knowledge": "어디서 들어오고 무엇을 유지하는지 확인할 긍정 방향",
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
        "sourceId": "csr:profile:wealth_heavy",
        "auditRef": "source-catalog.json#7164f25a426519c40e67",
        "sourceKind": "natal_research",
        "recordSha256": "822b21bd8dec92705211a9c009ab5a5871f5be3de83b898348ecb13405d456ef",
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
              "wealthHeavy"
            ],
            "legacyPatternCodes": [
              "WEALTH_HEAVY"
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
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
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
        "resources"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "자원의 유지 조건을 분명히 할 여지",
    "shadow": "재성이 많으면 재물이 많다고 계산",
    "factBomb": "별의 개수와 남는 돈의 액수는 다른 단위",
    "twist": "작은 반복 비용을 알아보는 것이 큰 목표보다 유용할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "계획의 유입·유지비·예비 여력을 정리하는 가상 장면"
    },
    "application": "실제 기록이 있을 때 총액과 남는 몫을 비교",
    "prerequisites": [
      "실제 정재·강약·보완·본인 자원 자료 확인; wealth_heavy 미성립이면 제외",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "소득·재산·상속·재물 증가 보장 금지",
    "distinction": "CH07 상징 소개에서 자원이 남을 현실 조건으로 이동",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH07 상징 소개에서 자원이 남을 현실 조건으로 이동",
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
    "id": "cpr:material:CH09.P2:exchange-options-screening",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "kind": "natal",
    "readerQuestion": "재물 관련 상징은 어떤 현실 조건이 필요한가?",
    "coreMeaning": "편재의 교환 상징을 제안의 조건 검토로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "실제 확인되는 재물 관련 명리 구조를 제시한다.",
        "knowledge": "실제 편재 원국 근거를 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "해당 요소가 의미하는 바를 설명한다.",
        "knowledge": "여러 사람·자원의 연결 상징을 성공 사건과 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "재물 관련 강점이 나타나는 조건을 설명한다.",
        "knowledge": "실제 제안의 수요·권한·비용이 있어야 강점 응용",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "긍정적인 활용 방향을 제시한다.",
        "knowledge": "기회를 찾은 뒤 할 수 있는 범위를 고르는 방향",
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
        "axis": "OPPORTUNITY_SENSE",
        "id": "sar:facet:OPPORTUNITY_SENSE:screening",
        "definition": "발견한 선택의 실행 조건을 검토",
        "condition": "필요 자원과 답변 기한 확인",
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
        "chance"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "제안의 크기보다 조건의 적합성을 비교할 여지",
    "shadow": "사람을 만나면 돈이 온다고 관계를 도구화",
    "factBomb": "연락처가 늘어도 실행할 자원은 별도",
    "twist": "제안을 거절하는 선택이 더 좋은 기회를 남길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 제안의 실제 사용자·비용·역할을 확인하는 가상 장면"
    },
    "application": "수요·담당·리스크·중단 기준을 각각 묻기",
    "prerequisites": [
      "편재·전체 원국·실제 제안·자원·동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "영업 능력·사업 성공·투자 성과를 단정하지 않음",
    "distinction": "기회 발견과 실제 수익 조건 사이의 간격이 새 정보",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "기회 발견과 실제 수익 조건 사이의 간격이 새 정보",
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
    "id": "cpr:material:CH09.P2:output-price-maintenance",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "kind": "natal",
    "readerQuestion": "재물 관련 상징은 어떤 현실 조건이 필요한가?",
    "coreMeaning": "식상생재의 긍정 연결을 수요·가격·유지 책임으로 나눔",
    "roleContributions": {
      "S1": {
        "address": "CH09.P2.S1",
        "originalRole": "실제 확인되는 재물 관련 명리 구조를 제시한다.",
        "knowledge": "실제 식상생재의 성립 조건부터 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P2.S2",
        "originalRole": "해당 요소가 의미하는 바를 설명한다.",
        "knowledge": "산출과 자원의 연결은 원국 상징의 구조",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P2.S3",
        "originalRole": "재물 관련 강점이 나타나는 조건을 설명한다.",
        "knowledge": "사용자 요구·대가·수정 범위가 확인될 때 활용",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P2.S4",
        "originalRole": "긍정적인 활용 방향을 제시한다.",
        "knowledge": "만드는 힘을 실제 쓰임과 합의된 보상에 연결하는 방향",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "일의 완료와 추가 요청을 구분할 여지",
    "shadow": "좋은 결과를 냈으니 값도 자동으로 인정받는다고 기대",
    "factBomb": "정성의 양이 상대가 사는 결과의 범위를 대신하지 않음",
    "twist": "수정 횟수를 명확히 하면 만드는 일도 오래 지속될 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "결과물의 완료 범위와 유지비를 따로 적는 가상 장면"
    },
    "application": "수요·완료 기준·추가 대가·유지 책임을 구분",
    "prerequisites": [
      "실제 구조 성립·원국 여력·현실 과제와 교환 조건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "원고의 긍정 문구를 실제 매출 기록처럼 사용 금지",
    "distinction": "CH07의 제작 가능성보다 가격·수정·유지의 현실 조건",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH07의 제작 가능성보다 가격·수정·유지의 현실 조건",
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
    "id": "cpr:material:CH09.P3:generosity-has-a-budget",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "kind": "mbti",
    "readerQuestion": "어떤 판단이 자원 부담을 가릴 수 있는가?",
    "coreMeaning": "좋아하는 사람을 위한 지출과 자기 여력의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "재물 관리에서 나타날 수 있는 약점을 제시한다.",
        "knowledge": "관계를 위해 쓰고 싶은 돈의 한도가 늦어지는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "해당 약점의 근거를 설명한다.",
        "knowledge": "ENFJ generous_spending은 실제 지출·빚 기록이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "생활 속에서 발생할 수 있는 문제를 조건부로 묘사한다.",
        "knowledge": "선물 뒤 필요한 생활비가 줄어들 수 있는 조건부 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "위험을 줄이는 구체적인 기준을 제시한다.",
        "knowledge": "스스로 정한 범위 안에서 호의의 방법을 고르는 기준",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENFJ:money:generous_spending",
        "auditRef": "source-catalog.json#aab403f317e44128dd16",
        "sourceKind": "mbti_trait",
        "recordSha256": "a3a45a773d25b99dba2a1200ab9dd00190606201ad57b8d7bac6e23688baacbb",
        "sourceFileSha256": "c9055cddb9d2d0c159aac0dd8afb54fb218237786ec06ea339b97d29d3147f0c",
        "originalState": {
          "type": "ENFJ",
          "area": "money",
          "traitId": "generous_spending",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
        "care"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "따뜻한 뜻과 지속 가능한 자원을 함께 지킬 여지",
    "shadow": "상대 반응으로 선물의 양을 계속 늘림",
    "factBomb": "좋은 사람이라는 뜻에 무제한 결제 기능을 붙이지 않음",
    "twist": "작은 선물과 직접 말한 관심이 충분할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "기념일 예산과 다음 달 필수 비용을 나누는 가상 장면"
    },
    "application": "상대가 원하는 것과 본인이 감당할 몫을 확인",
    "prerequisites": [
      "실제 trait·본인 지출 맥락·가용 자원·관계 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대가 이용한다거나 본인이 낭비했다고 사실화 금지",
    "distinction": "CH11 돌봄 책임과 다른 선택적 지출의 경계",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 돌봄 책임과 다른 선택적 지출의 경계",
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
    "id": "cpr:material:CH09.P3:expertise-price-silence",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "kind": "mbti",
    "readerQuestion": "어떤 판단이 자원 부담을 가릴 수 있는가?",
    "coreMeaning": "대가를 말하기 어려워 추가 수고의 경계가 흐려질 위험",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "재물 관리에서 나타날 수 있는 약점을 제시한다.",
        "knowledge": "가격 협의에서 원하는 조건을 미루는 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "해당 약점의 근거를 설명한다.",
        "knowledge": "ISFP 원천의 보상 주장 어려움은 실제 저소득 증명이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "생활 속에서 발생할 수 있는 문제를 조건부로 묘사한다.",
        "knowledge": "수정 요청을 받으며 원래 범위가 늘어날 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "위험을 줄이는 구체적인 기준을 제시한다.",
        "knowledge": "맡을 결과와 추가 요청의 대가를 먼저 구분하는 기준",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFP:money:low_income_risk_due_to_softness",
        "auditRef": "source-catalog.json#ee27329e2a832f94c820",
        "sourceKind": "mbti_trait",
        "recordSha256": "ebb134b9b6b52ca1dd8fd188862589414ea377529ca7bd0fa0a87c244c299e48",
        "sourceFileSha256": "c5f3b4d9b7751e66db91891d896dbaf68452abe2df80e6668b204bcbf2302e51",
        "originalState": {
          "type": "ISFP",
          "area": "money",
          "traitId": "low_income_risk_due_to_softness",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
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
        "axis": "RESOURCE_SENSE",
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
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
    "positive": "좋은 관계와 정당한 조건을 함께 말할 여지",
    "shadow": "갈등을 피하면 협의도 끝났다고 생각",
    "factBomb": "말하지 않은 가격표를 상대가 알아서 읽을 수는 없음",
    "twist": "대가를 명확히 하면 작업에 더 편하게 몰입할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "과제 시작 전에 완료·추가 수정 조건을 쓰는 가상 장면"
    },
    "application": "감사 표현과 계약 조건을 별도로 확인",
    "prerequisites": [
      "실제 유료 과제·trait·권한·조건이 있을 때만 적용",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 직업·소득·착취 경험을 임의 생성 금지",
    "distinction": "돈의 결과가 아니라 조건을 전달하는 행동 가설",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "돈의 결과가 아니라 조건을 전달하는 행동 가설",
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
    "id": "cpr:material:CH09.P3:small-tests-big-costs",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "kind": "natal",
    "readerQuestion": "어떤 판단이 자원 부담을 가릴 수 있는가?",
    "coreMeaning": "기회를 시험하는 작은 비용 뒤의 유지 비용을 점검",
    "roleContributions": {
      "S1": {
        "address": "CH09.P3.S1",
        "originalRole": "재물 관리에서 나타날 수 있는 약점을 제시한다.",
        "knowledge": "확장 제안의 총부담을 늦게 확인하는 위험 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P3.S2",
        "originalRole": "해당 약점의 근거를 설명한다.",
        "knowledge": "편재 상징·재성 편중 구조와 실제 지출 행동은 별도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P3.S3",
        "originalRole": "생활 속에서 발생할 수 있는 문제를 조건부로 묘사한다.",
        "knowledge": "작은 시작 뒤 구독·시간·담당이 늘어나는 조건부 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P3.S4",
        "originalRole": "위험을 줄이는 구체적인 기준을 제시한다.",
        "knowledge": "시작비와 유지·중단 비용을 함께 보는 기준",
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
        "sourceId": "csr:profile:wealth_heavy",
        "auditRef": "source-catalog.json#7164f25a426519c40e67",
        "sourceKind": "natal_research",
        "recordSha256": "822b21bd8dec92705211a9c009ab5a5871f5be3de83b898348ecb13405d456ef",
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
              "wealthHeavy"
            ],
            "legacyPatternCodes": [
              "WEALTH_HEAVY"
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
        "axis": "RISK_STYLE",
        "id": "sar:facet:RISK_STYLE:loss-limit",
        "definition": "감당 가능한 손실 범위를 정함",
        "condition": "돈·시간·안전의 실제 한계 확인",
        "notIndependentEvidence": true
      },
      {
        "axis": "EXPANSION",
        "id": "sar:facet:EXPANSION:capacity-check",
        "definition": "확대 전에 운영 여력을 점검",
        "condition": "실제 운영 비용과 담당이 주어질 때",
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
    "positive": "감당 가능한 시험 범위를 고를 여지",
    "shadow": "작게 시작했으니 손실도 작다고 생각",
    "factBomb": "첫 결제 금액이 전체 비용의 마지막 줄은 아님",
    "twist": "중단 기준을 정해도 좋은 시도를 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 활동의 시작·월별 유지·종료 비용을 적는 가상 장면"
    },
    "application": "부담의 총범위와 되돌릴 수 있는 부분을 확인",
    "prerequisites": [
      "실제 원국·구조 성립·자원·제안 조건 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "특정 투자·종목·대출·수익 전망으로 확대 금지",
    "distinction": "일반적인 절약보다 확장에 따라 생기는 누적 부담",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "일반적인 절약보다 확장에 따라 생기는 누적 부담",
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
    "id": "cpr:material:CH09.P4:purpose-and-cost-ledger",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "kind": "recall",
    "readerQuestion": "내 자원을 지킬 다음 기준은 무엇인가?",
    "coreMeaning": "목적과 남는 자원을 함께 기록하는 적용",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "해당 사람에게 중요한 재물 관리 원칙을 제시한다.",
        "knowledge": "앞선 실제 소개된 자원 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "실제 행동으로 적용할 수 있게 설명한다.",
        "knowledge": "예상과 실제 비용의 차이를 확인하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "일·능력·자원 관리와 연결한다.",
        "knowledge": "일의 결과와 유지 부담을 연결",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "현실적인 긍정적 마무리를 제공한다.",
        "knowledge": "더 많이 버는 약속 대신 자원의 쓰임을 알 수 있는 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "다음 선택의 조건을 분명히 할 여지",
    "shadow": "기록하면 무조건 재정이 좋아진다고 보장",
    "factBomb": "정리한 숫자와 선택할 여력은 따로 봐야 함",
    "twist": "목표를 조금 바꾸는 것이 자원을 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 과제의 예상·실제 시간과 비용을 비교하는 가상 장면"
    },
    "application": "실제 자료가 있으면 차이 한 가지를 다음 계획에 반영",
    "prerequisites": [
      "앞선 도입 원천·본인 목적·실제 기록 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "기록이 없으면 수입·지출표를 가상 고객 사실로 채우지 않음",
    "distinction": "CH13 전체 선택 원칙보다 돈의 목적·총비용 비교",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH09.P1:money-as-project-resource",
      "cpr:material:CH09.P2:retained-value-conditions"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH13 전체 선택 원칙보다 돈의 목적·총비용 비교",
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
    "id": "cpr:material:CH09.P4:joy-with-room",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "kind": "recall",
    "readerQuestion": "내 자원을 지킬 다음 기준은 무엇인가?",
    "coreMeaning": "즐거움과 호의가 들어갈 여력을 스스로 고르는 적용",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "해당 사람에게 중요한 재물 관리 원칙을 제시한다.",
        "knowledge": "앞선 선택적 지출의 의미 중 실제 도입한 것을 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "실제 행동으로 적용할 수 있게 설명한다.",
        "knowledge": "필수 몫과 선택 가능한 몫을 구분하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "일·능력·자원 관리와 연결한다.",
        "knowledge": "일·생활의 유지 자원과 원하는 경험을 연결",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "현실적인 긍정적 마무리를 제공한다.",
        "knowledge": "즐거움을 없애기보다 지속할 범위를 알자는 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "MEANING",
        "id": "sar:facet:MEANING:purpose-check",
        "definition": "목표와 중요한 이유의 연결을 확인",
        "condition": "작은 일의 현실 필요도 함께 고려",
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
        "care"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "하고 싶은 경험의 우선순위를 정할 여지",
    "shadow": "둘 다 원하는 만큼 쓸 수 있다고 약속",
    "factBomb": "예산 칸을 나눠도 전체 자원이 늘지는 않음",
    "twist": "이번의 작은 거절이 다음 경험을 남길 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "두 모임 중 중요한 목적에 맞는 하나를 고르는 가상 장면"
    },
    "application": "필수 조건·본인 가치·현재 여력을 확인",
    "prerequisites": [
      "앞선 동일 원천·실제 자원·선택권 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "재정난 상황에서 지출을 권장하거나 해결을 보장하지 않음",
    "distinction": "소비를 성격의 선악으로 바꾸지 않는 관리 기준",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH09.P1:money-as-experience",
      "cpr:material:CH09.P3:generosity-has-a-budget"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "소비를 성격의 선악으로 바꾸지 않는 관리 기준",
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
    "id": "cpr:material:CH09.P4:scope-before-price",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "kind": "recall",
    "readerQuestion": "내 자원을 지킬 다음 기준은 무엇인가?",
    "coreMeaning": "대가보다 먼저 결과 범위를 분명히 하는 적용",
    "roleContributions": {
      "S1": {
        "address": "CH09.P4.S1",
        "originalRole": "해당 사람에게 중요한 재물 관리 원칙을 제시한다.",
        "knowledge": "앞선 실제 소개된 산출·조건 전달 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P4.S2",
        "originalRole": "실제 행동으로 적용할 수 있게 설명한다.",
        "knowledge": "완료·수정·추가 요청의 경계를 적는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P4.S3",
        "originalRole": "일·능력·자원 관리와 연결한다.",
        "knowledge": "능력·시간·유지 책임과 보상을 연결",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P4.S4",
        "originalRole": "현실적인 긍정적 마무리를 제공한다.",
        "knowledge": "내 수고를 과장하기보다 쓰이는 결과의 범위를 알자는 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "상호 기대와 실제 담당을 맞출 여지",
    "shadow": "가격을 세게 말하면 모든 문제가 해결된다고 판단",
    "factBomb": "대가 협의는 상대를 이기는 시험이 아님",
    "twist": "작업 범위가 좁아지면 서로 더 명확히 선택할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 유료 과제의 결과와 추가 요청을 합의하는 가상 장면"
    },
    "application": "권한·기한·결과·추가 대가를 별도 확인",
    "prerequisites": [
      "앞선 실제 원천·유료 과제·합의 가능성이 전제",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "계약 법률 판단·구체 가격·소득을 임의 제공하지 않음",
    "distinction": "새 재물 길성 없이 앞선 의미를 현실 조건으로 회수",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH09.P2:output-price-maintenance",
      "cpr:material:CH09.P3:expertise-price-silence"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "새 재물 길성 없이 앞선 의미를 현실 조건으로 회수",
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
    "id": "cpr:material:CH09.P1:resource-purpose-before-style",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "kind": "natal",
    "readerQuestion": "돈을 선택할 때 어떤 목적을 중요하게 보는가?",
    "coreMeaning": "재성 상징을 실제 지출·유입 판단의 질문으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH09.P1.S1",
        "originalRole": "돈을 벌거나 사용할 때의 대표적인 성향을 소개한다.",
        "knowledge": "원국에서 확인된 관리·교환 의미를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH09.P1.S2",
        "originalRole": "관련 명리·MBTI 근거를 설명한다.",
        "knowledge": "정재·편재는 실제 소득이나 소비 성격과 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH09.P1.S3",
        "originalRole": "소비·저축·선택 상황에서 나타날 수 있는 행동을 보여준다.",
        "knowledge": "작은 계획의 들어올 자원과 필요한 비용을 비교",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH09.P1.S4",
        "originalRole": "이 사람의 재물 관리 특징을 정리한다.",
        "knowledge": "관리의 특징은 본인이 지킬 목적과 범위로 확인",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "자원의 쓰임과 다음 여력을 같이 볼 가능성",
    "shadow": "두 재성이 있으니 안정·확장 능력을 모두 부여",
    "factBomb": "별의 목록이 실제 통장 내역은 아님",
    "twist": "어디에 쓰지 않을지도 중요한 관리 정보",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "작은 활동의 목적·필수 비용·예비 몫을 적는 가상 장면"
    },
    "application": "실제 자료가 있는 범위에서 자원 흐름을 질문",
    "prerequisites": [
      "실제 재성·원국 여력·본인 목적·자료 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·소득·자산·투자 능력·지출 이력을 생성 금지",
    "distinction": "재성 정의를 개인 재무 사실과 구분한 명리 단독 응용",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "재성 정의를 개인 재무 사실과 구분한 명리 단독 응용",
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
