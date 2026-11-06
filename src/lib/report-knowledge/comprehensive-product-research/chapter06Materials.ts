/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH06_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH06.P1:correction-before-request",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "kind": "mbti",
    "readerQuestion": "좋은 기능이 언제 비용이 되는가?",
    "coreMeaning": "틀린 점을 먼저 말해 필요한 요청이 묻힐 위험",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "명확한 근거가 있는 약점을 직설적으로 소개한다.",
        "knowledge": "내용보다 교정이 먼저 나오는 행동 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "독자가 공감할 만한 행동을 조건부로 묘사한다.",
        "knowledge": "빠진 수치를 바로 지적하는 조건부 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "스스로 생각하는 모습과 실제 행동의 차이를 설명한다.",
        "knowledge": "도와주려는 자기 설명과 평가처럼 들릴 가능성을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "재치 있지만 과도하게 모욕적이지 않은 팩폭으로 마무리한다.",
        "knowledge": "답은 맞았는데 다음 협업의 질문이 줄어들 수 있다는 팩폭",
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
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "direct"
      ],
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "기준을 명확하게 하는 힘 자체는 유지",
    "shadow": "오류 하나를 사람 전체의 성실함으로 확대",
    "factBomb": "맞는 말의 개수로 대화의 성공을 채점하지 않음",
    "twist": "고칠 한 부분만 요청하면 정확함이 더 잘 쓰일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "동료 초안에서 오류와 수정 요청을 나눠 말하는 가상 장면"
    },
    "application": "사실 한 가지·영향·요청을 구분",
    "prerequisites": [
      "해당 trait·실제 전달 행동·피드백 역할 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대가 상처받았다는 실제 경험·평가를 발명하지 않음",
    "distinction": "CH05 검수 능력과 달리 지적의 전달 비용",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 검수 능력과 달리 지적의 전달 비용",
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
    "id": "cpr:material:CH06.P1:goal-eats-capacity",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "kind": "mbti",
    "readerQuestion": "좋은 기능이 언제 비용이 되는가?",
    "coreMeaning": "목표를 크게 보느라 운영 여력을 늦게 확인할 위험",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "명확한 근거가 있는 약점을 직설적으로 소개한다.",
        "knowledge": "할 수 있는 일보다 해내고 싶은 일부터 늘리는 가설",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "독자가 공감할 만한 행동을 조건부로 묘사한다.",
        "knowledge": "새 제안을 받으며 이미 맡은 일정이 밀리는 조건부 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "스스로 생각하는 모습과 실제 행동의 차이를 설명한다.",
        "knowledge": "야망이라는 자기 설명과 실제 담당 누적을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "재치 있지만 과도하게 모욕적이지 않은 팩폭으로 마무리한다.",
        "knowledge": "계획표의 빈칸이 의욕만으로 늘지는 않는다는 팩폭",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENTJ:identity:commanding_goal_builder",
        "auditRef": "source-catalog.json#654b835ccd167ecab80a",
        "sourceKind": "mbti_trait",
        "recordSha256": "8a331415bd007f180e6e2b9a20a3f32dfa1a5279d868b58073e91b4304626543",
        "sourceFileSha256": "93f94a0956a804629bdcb386dcd7938fbe8b8f029daed06cb9140692dd185b4c",
        "originalState": {
          "type": "ENTJ",
          "area": "identity",
          "traitId": "commanding_goal_builder",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
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
      }
    ],
    "semanticFacets": [
      {
        "axis": "GOAL_DRIVE",
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
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
        "growth"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "큰 목표를 작은 책임으로 나눌 힘은 유지",
    "shadow": "고성과 유형이면 더 큰 목표를 줘도 된다고 단정",
    "factBomb": "하고 싶은 일과 감당 가능한 일은 서로 다른 칸",
    "twist": "기회를 거절하면 중요한 목표의 완성률이 높아질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "새 과제를 맡기 전 유지 시간까지 적는 가상 장면"
    },
    "application": "지원·기한·담당을 확인한 뒤 목표를 줄이거나 나눔",
    "prerequisites": [
      "실제 trait·원하는 목표·가용 자원·본인 행동 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 과로·실패·소득 상태를 단정하지 않음",
    "distinction": "CH09 돈의 결과가 아닌 목표 과용의 조건",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH09 돈의 결과가 아닌 목표 과용의 조건",
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
    "id": "cpr:material:CH06.P1:help-with-hidden-expectation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "kind": "mbti",
    "readerQuestion": "좋은 기능이 언제 비용이 되는가?",
    "coreMeaning": "괜찮다고 답한 뒤 알아주기를 기다리는 행동 가설",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "명확한 근거가 있는 약점을 직설적으로 소개한다.",
        "knowledge": "감당 범위를 말하지 않고 도움을 추가하는 위험",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "독자가 공감할 만한 행동을 조건부로 묘사한다.",
        "knowledge": "부탁을 수락한 뒤 자기 일정이 어려워질 수 있는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "스스로 생각하는 모습과 실제 행동의 차이를 설명한다.",
        "knowledge": "도움을 주고 싶은 뜻과 이해받고 싶은 기대를 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "재치 있지만 과도하게 모욕적이지 않은 팩폭으로 마무리한다.",
        "knowledge": "말하지 않은 한도를 상대의 눈치 시험으로 두지 않는 팩폭",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:refusal",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
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
    "positive": "관심을 실제로 행동에 옮기는 힘은 유지",
    "shadow": "상대가 감사하지 않는 사람이라고 원인 배정",
    "factBomb": "호의의 양을 늘려도 미공개 계약이 생기지는 않음",
    "twist": "범위를 말하면 덜 돕고도 더 오래 관계를 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "추가 부탁에 이번에 가능한 부분만 정하는 가상 장면"
    },
    "application": "가능한 내용·종료 시점·못 맡는 책임을 함께 전함",
    "prerequisites": [
      "실제 도움 제공 행동·trait·자원·요청 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "실제 서운함·착취·관계 갈등을 이미 겪었다고 쓰지 않음",
    "distinction": "CH12 거절 대화보다 도움을 시작할 때 숨긴 기대의 문제",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH12 거절 대화보다 도움을 시작할 때 숨긴 기대의 문제",
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
    "id": "cpr:material:CH06.P2:output-authority-collision",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "kind": "fusion",
    "readerQuestion": "그 비용을 무엇으로 설명할 수 있는가?",
    "coreMeaning": "규칙의 허점을 보는 것과 권한을 다루는 조건의 차이",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "실제 상관견관 후보의 성립·강약을 설명",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "해당 구조의 쉬운 의미를 설명한다.",
        "knowledge": "산출·표현과 공식 기준의 긴장은 징계 사건이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI가 이 특징을 강화하거나 완화하는 조건을 설명한다.",
        "knowledge": "ENTP flaw_detection이 반론을 더하게 하는지 별도 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "해당 단점이 나타나는 원인을 종합한다.",
        "knowledge": "같은 쟁점·공개 방식·수정 권한에서 비용을 조건부 설명",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "csr:profile:sanggwan_gyeongwan",
        "auditRef": "source-catalog.json#260e0d352cae77dda2c4",
        "sourceKind": "natal_research",
        "recordSha256": "6d6468e0184917932513807b1deb39f4ed577a6998b9d182525cfa6cdaf32f92",
        "sourceFileSha256": "490ce202255ea32abb66ea9b2c59b0f641ec6b1281b04cba28c4ae980b2df3e1",
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
              "hurtingOfficerMeetsOfficer"
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
        "sourceId": "mbti:ENTP:thinkingStyle:flaw_detection",
        "auditRef": "source-catalog.json#611b24073281ed349665",
        "sourceKind": "mbti_trait",
        "recordSha256": "1dba8b2921149e0ba4f92f0bb267fdaf15b3bb7d96a159e11da85b900132a42b",
        "sourceFileSha256": "0301fc16e45e3dd73ee114821e56b1798fa0d35c25d4fd6a9ecda31a581aefbb",
        "originalState": {
          "type": "ENTP",
          "area": "thinkingStyle",
          "traitId": "flaw_detection",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      },
      {
        "sourceId": "fkr:legacy:entp-question-authority-structure",
        "auditRef": "source-catalog.json#fca68d9638a654ea08b2",
        "sourceKind": "fusion_research",
        "recordSha256": "d5a2ddc1f0b44b9191253241acbbb23a1502ae8cb3bfa60ab6138bd7a7ab8c8b",
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
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "condition": "주장 사실과 감정 경험을 구분",
        "notIndependentEvidence": true
      },
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "positive": "잘못된 전제와 대안 절차를 제시할 여지",
    "shadow": "권위에 반대하면 논리적인 사람이라고 자부",
    "factBomb": "규칙이 틀려도 반론의 방법은 다시 고를 수 있음",
    "twist": "공개 논박보다 적용 범위를 묻는 것이 개선을 도울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "절차의 목적과 예외를 담당자에게 묻는 가상 장면"
    },
    "application": "성립 근거·전제 오류·대안·안전한 통로를 분리",
    "prerequisites": [
      "실제 구조·trait·공식 권한·반론 안전·같은 과제 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "구조 미성립이면 원인으로 적용 금지; 소송·징계 예언 금지",
    "distinction": "구조 상징을 실제 말버릇의 직접 인과로 확정하지 않음",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "구조 상징을 실제 말버릇의 직접 인과로 확정하지 않음",
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
    "id": "cpr:material:CH06.P2:wealth-and-load",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "kind": "fusion",
    "readerQuestion": "그 비용을 무엇으로 설명할 수 있는가?",
    "coreMeaning": "크게 남기려는 목표와 부담 구조를 출처별로 설명",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "실제 재다신약의 구조 성립·여력을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "해당 구조의 쉬운 의미를 설명한다.",
        "knowledge": "재성 요구와 감당 여력의 조건을 쉬운 역할로 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI가 이 특징을 강화하거나 완화하는 조건을 설명한다.",
        "knowledge": "성과 선호가 과제를 늘리는지 실제 상황 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "해당 단점이 나타나는 원인을 종합한다.",
        "knowledge": "목표·지원·맡은 몫이 만날 때 과용 가능성을 검토",
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
        "sourceId": "fkr:legacy:entj-wealth-pressure-structure",
        "auditRef": "source-catalog.json#dd54e52cdafb7cd80b11",
        "sourceKind": "fusion_research",
        "recordSha256": "c7935534efacef8815083bd59cf848857796785914f0eaa636a173a24a8f152a",
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
        "axis": "GOAL_DRIVE",
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
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
    "positive": "목표별 필요한 지원을 먼저 확보할 여지",
    "shadow": "원국 구조가 과로의 원인이라고 확정",
    "factBomb": "지원 없이 목표만 키우면 열심히 할수록 조건이 나빠질 수 있음",
    "twist": "목표를 나누는 것이 성과 선호를 오래 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "큰 제안을 인력·유지비·기간으로 나누는 가상 장면"
    },
    "application": "부담을 설명한 뒤 지원 또는 범위 조정을 선택",
    "prerequisites": [
      "실제 구조·primary trait·자원과 역할 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "질병·실패·재정난을 구조명으로 진단 금지",
    "distinction": "CH02 원국 조건에서 실제 목표를 늘리는 행동 가설로 이동",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH02 원국 조건에서 실제 목표를 늘리는 행동 가설로 이동",
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
    "id": "cpr:material:CH06.P2:support-versus-obligation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "kind": "fusion",
    "readerQuestion": "그 비용을 무엇으로 설명할 수 있는가?",
    "coreMeaning": "지원 상징·도움 선호·실제 책임을 구분하는 원인 검토",
    "roleContributions": {
      "S1": {
        "address": "CH06.P2.S1",
        "originalRole": "실제 명리 근거를 제시한다.",
        "knowledge": "실제 정인의 위치·지원 역할을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P2.S2",
        "originalRole": "해당 구조의 쉬운 의미를 설명한다.",
        "knowledge": "원국의 지원 수용은 타인을 돕는 책임과 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P2.S3",
        "originalRole": "MBTI가 이 특징을 강화하거나 완화하는 조건을 설명한다.",
        "knowledge": "ENFJ 제공 선호가 거절을 늦추는지는 실제 행동 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P2.S4",
        "originalRole": "해당 단점이 나타나는 원인을 종합한다.",
        "knowledge": "요청·자원·담당 경계가 겹칠 때만 부담 가설을 구성",
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
        "sourceId": "fkr:complement:C053",
        "auditRef": "source-catalog.json#f0cb8f3af429f7e5fefa",
        "sourceKind": "fusion_research",
        "recordSha256": "9d1093839a4fb2505b3a4a3d9ec36cd8178396a5a52588319fef50f85cff8131",
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
        "id": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:role-border",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
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
    "positive": "도움과 담당을 구분하면 호의를 유지할 여지",
    "shadow": "정인이 있으니 희생적인 사람이라고 원인 확정",
    "factBomb": "좋은 뜻은 담당표의 빈칸을 전부 채우라는 지시가 아님",
    "twist": "맡지 않을 몫을 말하는 것이 지원을 정확히 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가족 아닌 공동 활동에서 도움과 담당을 구분하는 가상 장면"
    },
    "application": "누가 결정하고 누가 보조할지 함께 확인",
    "prerequisites": [
      "정인·trait·실제 제공 행동·경계·동의 추가 검토",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "수혜 상징만 있으면 제공·과용 원인 해석 보류",
    "distinction": "명리·MBTI를 합친 심리 진단을 만들지 않는 설명",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리·MBTI를 합친 심리 진단을 만들지 않는 설명",
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
    "id": "cpr:material:CH06.P3:feedback-as-evaluation",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "kind": "mbti",
    "readerQuestion": "내 의도와 받은 뜻은 어디에서 달라질 수 있는가?",
    "coreMeaning": "정확한 피드백이 전체 평가처럼 전달될 조건",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "해당 단점이 나타날 수 있는 생활 상황을 제시한다.",
        "knowledge": "작업물 의견이 필요한 구체적 장면 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "본인이 의도한 행동을 설명한다.",
        "knowledge": "본인은 실수를 줄이고 싶은 의도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대방이 다르게 받아들일 수 있는 부분을 설명한다.",
        "knowledge": "상대는 담당 전체를 믿지 않는 말로 들을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "문제가 커지는 조건을 제시한다.",
        "knowledge": "공개성·권한 차이·누적된 수정 요청이 비용을 키울 수 있음",
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
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
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
        "direct"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "핵심 오류를 함께 해결할 여지",
    "shadow": "상대의 의도를 이미 안다고 설명",
    "factBomb": "틀린 수치를 고치는 일과 사람의 태도를 재단하는 일은 다름",
    "twist": "사실과 요청을 나누면 지적이 협업으로 돌아올 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "모임 준비의 수치 오류를 조용히 확인하는 가상 장면"
    },
    "application": "실제 들린 뜻을 묻고 요청 범위를 좁힘",
    "prerequisites": [
      "해당 표현 행동·피드백 목적·상대의 답 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "타인의 기분·관계 결과를 사실로 읽지 않음",
    "distinction": "CH12 자율적 우정의 거절과 다른 평가 맥락",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH12 자율적 우정의 거절과 다른 평가 맥락",
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
    "id": "cpr:material:CH06.P3:decide-for-everyone",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "kind": "mbti",
    "readerQuestion": "내 의도와 받은 뜻은 어디에서 달라질 수 있는가?",
    "coreMeaning": "정체를 풀려는 결정이 타인의 선택권을 줄일 조건",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "해당 단점이 나타날 수 있는 생활 상황을 제시한다.",
        "knowledge": "공동 일정이 정해지지 않는 장면 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "본인이 의도한 행동을 설명한다.",
        "knowledge": "본인은 빨리 합의하고 실행하려는 의도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대방이 다르게 받아들일 수 있는 부분을 설명한다.",
        "knowledge": "상대는 이미 결론 난 제안으로 받을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "문제가 커지는 조건을 제시한다.",
        "knowledge": "시간 압박·발언권 차이가 있으면 동의를 확인하기 어려움",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ENTJ:identity:commanding_goal_builder",
        "auditRef": "source-catalog.json#654b835ccd167ecab80a",
        "sourceKind": "mbti_trait",
        "recordSha256": "8a331415bd007f180e6e2b9a20a3f32dfa1a5279d868b58073e91b4304626543",
        "sourceFileSha256": "93f94a0956a804629bdcb386dcd7938fbe8b8f029daed06cb9140692dd185b4c",
        "originalState": {
          "type": "ENTJ",
          "area": "identity",
          "traitId": "commanding_goal_builder",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
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
        "axis": "AUTONOMY",
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
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
    "positive": "선택 가능한 방안을 제시할 여지",
    "shadow": "동의가 없는 침묵을 승인으로 사용",
    "factBomb": "답이 없다는 이유로 전원의 결정을 대신하지 않음",
    "twist": "조금 기다리면 이후의 수정 비용이 줄어들 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "두 일정 중 선택 가능한 답을 받는 가상 장면"
    },
    "application": "결정 기한과 이견 통로·실제 동의를 함께 확인",
    "prerequisites": [
      "공동 목적·역할·응답 가능한 시간·trait 적합성 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "상대의 무능·우유부단을 원인으로 부여하지 않음",
    "distinction": "본인의 의도와 다른 사람의 권한이 만나는 지점",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "본인의 의도와 다른 사람의 권한이 만나는 지점",
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
    "id": "cpr:material:CH06.P3:care-without-request",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "kind": "mbti",
    "readerQuestion": "내 의도와 받은 뜻은 어디에서 달라질 수 있는가?",
    "coreMeaning": "필요를 알아챈 것과 부탁받은 것을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "해당 단점이 나타날 수 있는 생활 상황을 제시한다.",
        "knowledge": "친한 사람이 바빠 보이는 장면 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "본인이 의도한 행동을 설명한다.",
        "knowledge": "본인은 부담을 덜어주려는 의도",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대방이 다르게 받아들일 수 있는 부분을 설명한다.",
        "knowledge": "상대는 자기 방법을 바꾸라는 개입으로 받을 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "문제가 커지는 조건을 제시한다.",
        "knowledge": "반복 제안·거절하기 어려운 관계가 위험을 키움",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
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
      "relation": "subfacet",
      "runtimeFacetChange": false
    },
    "positive": "원하는 도움을 확인하면 실제 지원이 가능",
    "shadow": "표정 하나로 필요한 해결책까지 확정",
    "factBomb": "상대의 할 일을 덜어주는 것과 선택을 덜어주는 것은 다름",
    "twist": "돕지 않을 답을 존중하면 다음 요청이 더 쉬울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "도울 방법을 제안한 뒤 거절도 받는 가상 장면"
    },
    "application": "관찰·질문·동의·작은 지원 순서를 구분",
    "prerequisites": [
      "실제 요청·관계 맥락·제공 여력 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "부탁받지 않은 개인 문제를 사실로 만들어내지 않음",
    "distinction": "CH11 가족의 지속 의무와 다른 자발적 도움의 조건",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH11 가족의 지속 의무와 다른 자발적 도움의 조건",
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
    "id": "cpr:material:CH06.P4:correction-to-agreement",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "kind": "recall",
    "readerQuestion": "기능을 버리지 않고 무엇을 조정할 수 있는가?",
    "coreMeaning": "교정의 힘을 한 가지 합의로 바꾸는 적용",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "약점에 숨어 있는 장점이 있다면 설명한다.",
        "knowledge": "앞선 약점 속 오류 확인의 유효 기능만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "문제를 줄일 수 있는 실제 행동을 제안한다.",
        "knowledge": "사실·영향·요청을 세 항목으로 나누는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "행동이 바뀌었을 때 기대할 수 있는 차이를 보여준다.",
        "knowledge": "상대가 다음 행동을 선택할 공간이 생길 가능성",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "긍정적인 전환 문장으로 마무리한다.",
        "knowledge": "정확함을 버리는 대신 쓰임의 범위를 고르는 전환",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "PRECISION",
        "id": "sar:facet:PRECISION:error-detection",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "legacyFacetRelation": {
      "facets": [
        "direct"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "중요한 수정이 이해될 여지",
    "shadow": "친절하게 말하면 갈등이 없어질 것이라 보장",
    "factBomb": "말투만 바꿔도 없는 권한이 생기지는 않음",
    "twist": "맞는 지적을 줄이면 필요한 지적의 힘이 커질 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "초안에서 가장 중요한 한 오류만 합의하는 가상 장면"
    },
    "application": "실제 권한·수정 필요·상대 답을 확인",
    "prerequisites": [
      "앞선 동일 원천·약점 가설이 실제 도입된 경우만 회수",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "앞선 행동이 미확인되면 변화 전후를 고객 사실로 쓰지 않음",
    "distinction": "해결을 약속하지 않는 행동 선택의 변화",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH06.P1:correction-before-request",
      "cpr:material:CH06.P3:feedback-as-evaluation"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "해결을 약속하지 않는 행동 선택의 변화",
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
    "id": "cpr:material:CH06.P4:goal-to-operable-scope",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "kind": "recall",
    "readerQuestion": "기능을 버리지 않고 무엇을 조정할 수 있는가?",
    "coreMeaning": "야망의 크기보다 운영 가능한 범위를 선택",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "약점에 숨어 있는 장점이 있다면 설명한다.",
        "knowledge": "앞선 목표 과용 안의 방향 제안 강점을 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "문제를 줄일 수 있는 실제 행동을 제안한다.",
        "knowledge": "지원 인력·시간·종료 조건부터 정하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "행동이 바뀌었을 때 기대할 수 있는 차이를 보여준다.",
        "knowledge": "작은 목표를 실제 끝낼 가능성의 변화",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "긍정적인 전환 문장으로 마무리한다.",
        "knowledge": "하고 싶은 일을 오래 하기 위한 범위 조절",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "GOAL_DRIVE",
        "id": "sar:facet:GOAL_DRIVE:goal-release",
        "definition": "목적을 위해 불필요한 과제를 내려놓음",
        "condition": "목적·비용이 바뀌었는지 확인",
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
        "growth"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "선택할 목표를 분명히 할 여지",
    "shadow": "범위를 줄이면 실패를 인정하는 것이라 생각",
    "factBomb": "작아진 계획이 줄어든 능력을 뜻하지는 않음",
    "twist": "덜 맡는 선택이 중요한 목표를 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "진행 중 과제 하나를 멈추고 남길 과제를 정하는 가상 장면"
    },
    "application": "지킬 목적과 내려놓을 과제를 구분",
    "prerequisites": [
      "앞선 가설·실제 자원·선택권·공동 책임 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "포기할 권한이 없으면 일방적 중단을 권장하지 않음",
    "distinction": "CH13의 전체 사용법보다 앞선 팩폭 한 가지의 조절",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH06.P1:goal-eats-capacity",
      "cpr:material:CH06.P2:wealth-and-load"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH13의 전체 사용법보다 앞선 팩폭 한 가지의 조절",
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
    "id": "cpr:material:CH06.P4:help-to-clear-offer",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "kind": "recall",
    "readerQuestion": "기능을 버리지 않고 무엇을 조정할 수 있는가?",
    "coreMeaning": "호의를 숨은 기대 대신 명확한 제안으로 전환",
    "roleContributions": {
      "S1": {
        "address": "CH06.P4.S1",
        "originalRole": "약점에 숨어 있는 장점이 있다면 설명한다.",
        "knowledge": "앞선 약점 속 구체적 관심 기능 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P4.S2",
        "originalRole": "문제를 줄일 수 있는 실제 행동을 제안한다.",
        "knowledge": "가능한 도움·어려운 책임·종료 시점 제안",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P4.S3",
        "originalRole": "행동이 바뀌었을 때 기대할 수 있는 차이를 보여준다.",
        "knowledge": "상대도 받고 싶은 부분을 고를 수 있다는 변화",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P4.S4",
        "originalRole": "긍정적인 전환 문장으로 마무리한다.",
        "knowledge": "덜 희생해도 유효한 도움은 남길 수 있는 전환",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "CARE",
        "id": "sar:facet:CARE:sustainable-care",
        "definition": "자기 한계를 포함해 도움을 설계",
        "condition": "상호 기대를 다시 합의할 수 있을 때",
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
        "care"
      ],
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "도움의 내용과 선택권을 맞출 여지",
    "shadow": "알려주면 반드시 이해받는다고 기대",
    "factBomb": "한계를 전하는 일과 상대의 수용은 다른 선택",
    "twist": "불가능한 답이 분명해야 가능한 호의도 믿을 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "추가 요청에 이번에 도울 한 부분을 말하는 가상 장면"
    },
    "application": "이전 합의를 상황 변화에 맞춰 다시 확인",
    "prerequisites": [
      "앞선 동일 약점·자원·관계 안전·동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "위험하거나 강압적인 관계에서 대화만으로 해결 약속 금지",
    "distinction": "의미 없는 긍정 전환 대신 요청·제공의 실제 경계",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH06.P1:help-with-hidden-expectation",
      "cpr:material:CH06.P3:care-without-request"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "의미 없는 긍정 전환 대신 요청·제공의 실제 경계",
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
    "id": "cpr:material:CH06.P1:overused-output-standard",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "kind": "natal",
    "readerQuestion": "좋은 기능이 언제 비용이 되는가?",
    "coreMeaning": "표현·비판 상징을 무조건 교정 행동으로 읽지 않는 팩폭 후보",
    "roleContributions": {
      "S1": {
        "address": "CH06.P1.S1",
        "originalRole": "명확한 근거가 있는 약점을 직설적으로 소개한다.",
        "knowledge": "실제 원국의 산출·표현 조건을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P1.S2",
        "originalRole": "독자가 공감할 만한 행동을 조건부로 묘사한다.",
        "knowledge": "오류 지적이 먼저 나오는 행동이 있는지 조건부 질문",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P1.S3",
        "originalRole": "스스로 생각하는 모습과 실제 행동의 차이를 설명한다.",
        "knowledge": "개선 의도와 요청의 전달은 다른 기능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P1.S4",
        "originalRole": "재치 있지만 과도하게 모욕적이지 않은 팩폭으로 마무리한다.",
        "knowledge": "고칠 수 있어도 이번에 필요한 교정인지 묻는 팩폭",
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
        "sourceId": "csr:profile:output_heavy",
        "auditRef": "source-catalog.json#0ceaf58e8fd17c1c8561",
        "sourceKind": "natal_research",
        "recordSha256": "d736e5d4946d98895b3df45c725c6b9ce31af249f25dd67b43e7c67a357bbf42",
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
              "outputHeavy"
            ],
            "legacyPatternCodes": [
              "OUTPUT_HEAVY"
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
        "id": "sar:facet:PRECISION:argument-coherence",
        "definition": "설명의 전제와 결론 사이 모순 확인",
        "condition": "주장 사실과 감정 경험을 구분",
        "notIndependentEvidence": true
      },
      {
        "axis": "COMMUNICATION_STYLE",
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
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
    "positive": "유효한 문제 제기의 힘을 살릴 여지",
    "shadow": "상관이 있으니 독설가라고 성격화",
    "factBomb": "별 이름으로 상대에게 받은 평가를 만들어내지 않음",
    "twist": "지적을 줄이면 필요한 질문이 더 잘 들릴 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 자료에서 꼭 고칠 한 전제만 묻는 가상 장면"
    },
    "application": "사실·영향·요청·권한을 확인",
    "prerequisites": [
      "상관·구조 성립·실제 말하기 행동·역할 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "MBTI·실제 갈등·모욕·징계 경험을 생성 금지",
    "distinction": "명리만 있는 경우도 관찰 확인 전 행동은 가설",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리만 있는 경우도 관찰 확인 전 행동은 가설",
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
    "id": "cpr:material:CH06.P3:offered-explanation-not-asked",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "kind": "natal",
    "readerQuestion": "내 의도와 받은 뜻은 어디에서 달라질 수 있는가?",
    "coreMeaning": "설명할 내용을 아는 것과 설명을 부탁받은 것을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH06.P3.S1",
        "originalRole": "해당 단점이 나타날 수 있는 생활 상황을 제시한다.",
        "knowledge": "설명할 기회가 생긴 구체적 장면 제시",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH06.P3.S2",
        "originalRole": "본인이 의도한 행동을 설명한다.",
        "knowledge": "본인은 배운 내용을 나눠 돕고 싶은 의도 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH06.P3.S3",
        "originalRole": "상대방이 다르게 받아들일 수 있는 부분을 설명한다.",
        "knowledge": "상대는 해결보다 경청을 원할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH06.P3.S4",
        "originalRole": "문제가 커지는 조건을 제시한다.",
        "knowledge": "요청·시간·수신 목적이 다르면 비용이 커짐",
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
        "axis": "CARE",
        "id": "sar:facet:CARE:need-check",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
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
    "positive": "받을 사람이 필요한 설명을 고를 여지",
    "shadow": "지원 수용 상징을 제공 재능으로 자동 변환",
    "factBomb": "알고 있다는 사실이 설명할 차례까지 정해 주지는 않음",
    "twist": "먼저 묻는 것이 지식을 더 잘 쓰게 할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "고민을 들은 뒤 설명을 원하는지 묻는 가상 장면"
    },
    "application": "실제 요청·설명 목적·가능 시간·상대 답 확인",
    "prerequisites": [
      "실제 원국·학습 내용·표현 행동·수신 동의 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "원국만으로 가르치는 역할·실제 사건을 부여 금지",
    "distinction": "명리 단독 지식 응용에서도 도움 방향의 비동등성 유지",
    "sourceReviewNotes": [
      "기초 foundation:ten_god:zheng_yin의 repository_only 상태는 보존했다. 별도 심층 정의·전거를 함께 참조하며 현대 행동과 개인 적용은 여전히 미검증이다."
    ],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리 단독 지식 응용에서도 도움 방향의 비동등성 유지",
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
