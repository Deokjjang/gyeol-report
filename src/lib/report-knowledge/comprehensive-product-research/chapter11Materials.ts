/** Authored offline product research; no binding, allocation or realization. */
import type { Material } from "./researchTypes";
export const CH11_MATERIALS: readonly Material[] = [
  {
    "id": "cpr:material:CH11.P1:protect-with-permission",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P1",
    "address": "CH11.P1",
    "kind": "mbti",
    "readerQuestion": "가까운 관계에서 실제 맡은 몫은 무엇인가?",
    "coreMeaning": "가까운 사람을 지키려는 뜻과 실제 맡을 몫을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH11.P1.S1",
        "originalRole": "가까운 사람과 있을 때의 성향을 설명한다.",
        "knowledge": "가까운 관계에서 보호하려는 후보 성향",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P1.S2",
        "originalRole": "그 특징의 실제 근거를 제시한다.",
        "knowledge": "ISFJ quiet_protector 원천은 가족 구성의 증거가 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P1.S3",
        "originalRole": "책임감·독립성·돌봄 등 관련 행동을 묘사한다.",
        "knowledge": "필요를 확인하고 동의한 도움을 맡는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P1.S4",
        "originalRole": "가까운 관계에서 중요하게 여기는 조건을 제시한다.",
        "knowledge": "보호·선택권·감당할 범위를 함께 중요하게 둠",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:identity:quiet_protector",
        "auditRef": "source-catalog.json#1fc7b68ee38cbe25ca6d",
        "sourceKind": "mbti_trait",
        "recordSha256": "9aca940dac86537535c10c128ba0d929dbc8c29b83e08e1a86ea9de906242718",
        "sourceFileSha256": "a9bc9fc83017d0b624f896f3765574c6758819fa5b499e257cf67f8f76b2f6e9",
        "originalState": {
          "type": "ISFJ",
          "area": "identity",
          "traitId": "quiet_protector",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "가까운 사람의 실제 부담을 덜어줄 여지",
    "shadow": "가족이면 무엇이 필요한지 이미 안다고 생각",
    "factBomb": "가깝다는 이유로 질문을 생략할 권한이 생기지는 않음",
    "twist": "도움의 방법을 고르게 하면 보호와 자율성이 같이 갈 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람이 원하는 지원을 직접 묻는 가상 장면"
    },
    "application": "보호 의도와 실제 요청·담당을 구분",
    "prerequisites": [
      "실제 가족·가까운 관계의 정의·trait·당사자 뜻 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "부모·배우자·자녀·형제 존재나 돌봄 담당을 가정 금지",
    "distinction": "연애의 호감 표현과 다른 지속 역할·지원의 질문",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "연애의 호감 표현과 다른 지속 역할·지원의 질문",
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
    "id": "cpr:material:CH11.P1:own-choice-near-family",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P1",
    "address": "CH11.P1",
    "kind": "mbti",
    "readerQuestion": "가까운 관계에서 실제 맡은 몫은 무엇인가?",
    "coreMeaning": "가까운 관계에서도 자기 판단을 지키고 싶은 조건",
    "roleContributions": {
      "S1": {
        "address": "CH11.P1.S1",
        "originalRole": "가까운 사람과 있을 때의 성향을 설명한다.",
        "knowledge": "중요한 선택은 사적으로 정리하려는 후보",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P1.S2",
        "originalRole": "그 특징의 실제 근거를 제시한다.",
        "knowledge": "독립 판단 원천과 실제 가족 역할을 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P1.S3",
        "originalRole": "책임감·독립성·돌봄 등 관련 행동을 묘사한다.",
        "knowledge": "함께 영향을 받는 일정에서는 자기 이유를 말하는 행동",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P1.S4",
        "originalRole": "가까운 관계에서 중요하게 여기는 조건을 제시한다.",
        "knowledge": "내 선택·공동 영향·공개 범위를 각각 확인",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTJ:identity:independent_decision_maker",
        "auditRef": "source-catalog.json#18fb1909ee68e78603a1",
        "sourceKind": "mbti_trait",
        "recordSha256": "d270a153acb4895739ebf3c4b0e422814bd21da6cfa60048773d3ba361483ba8",
        "sourceFileSha256": "f5a9b70f194d7ea3de825ba3c7aab2e1f8837b92a92b1dee4a92e8f3a6a5216a",
        "originalState": {
          "type": "INTJ",
          "area": "identity",
          "traitId": "independent_decision_maker",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "가족과 생각이 달라도 합의할 여지를 찾을 수 있음",
    "shadow": "내 선택이면 공동 영향의 설명도 필요 없다고 생각",
    "factBomb": "판단권과 함께 사는 사람의 준비권은 다를 수 있음",
    "twist": "선택 이유를 일부 공유하면 독립성을 지키기 쉬움",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "개인 일정 변경이 공동 준비에 미칠 부분을 알리는 가상 장면"
    },
    "application": "개인 결정과 공동 합의가 필요한 부분을 나눔",
    "prerequisites": [
      "실제 가까운 관계·공동 영향·trait·본인 공개 동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "현재 동거·혼인·갈등·통제 관계를 임의로 부여 금지",
    "distinction": "CH10 개인 공간과 달리 공동 생활의 영향 범위",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH10 개인 공간과 달리 공동 생활의 영향 범위",
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
    "id": "cpr:material:CH11.P1:position-is-not-duty-roster",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P1",
    "address": "CH11.P1",
    "kind": "natal",
    "readerQuestion": "가까운 관계에서 실제 맡은 몫은 무엇인가?",
    "coreMeaning": "원국 위치의 전통 역할과 실제 가족 담당을 구분",
    "roleContributions": {
      "S1": {
        "address": "CH11.P1.S1",
        "originalRole": "가까운 사람과 있을 때의 성향을 설명한다.",
        "knowledge": "월주·정관의 실제 위치를 좌표로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P1.S2",
        "originalRole": "그 특징의 실제 근거를 제시한다.",
        "knowledge": "전통적인 가까운 환경의 해석과 현실 가족 사실은 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P1.S3",
        "originalRole": "책임감·독립성·돌봄 등 관련 행동을 묘사한다.",
        "knowledge": "실제 맡고 있는 책임이 있으면 담당 범위를 질문",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P1.S4",
        "originalRole": "가까운 관계에서 중요하게 여기는 조건을 제시한다.",
        "knowledge": "관계 이름보다 누가 무엇을 합의했는지 중요하게 둠",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "foundation:position:month",
        "auditRef": "source-catalog.json#33f6686796b4388c0504",
        "sourceKind": "natal_research",
        "recordSha256": "1849a67cd72304bcb2709957dfae17c420d138cb4ef2875f5b1a0c28fe9c8ab2",
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
              "SajuCalcResult.pillars.month"
            ],
            "legacyRefs": []
          },
          "deferred": [
            "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
          ],
          "appliesWhen": [
            "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
          ],
          "doNotApply": [
            "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
            "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
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
        "axis": "DUTY",
        "id": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
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
        "steady"
      ],
      "relation": "distinct_question",
      "runtimeFacetChange": false
    },
    "positive": "타고난 역할 비유를 실제 합의 점검으로 사용할 여지",
    "shadow": "월주를 부모 성격·가족 의무의 증명으로 사용",
    "factBomb": "사주 표의 칸은 집안의 담당표가 아님",
    "twist": "합의한 작은 몫이 막연한 가족 책임보다 편할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 준비의 담당과 도움을 구분하는 가상 장면"
    },
    "application": "실제 역할이 확인된 범위에서만 응용",
    "prerequisites": [
      "실제 원국 위치·십성·가까운 관계 입력·담당 합의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "부모·가족 구성·부양 의무·과거 가족사를 계산에서 생성 금지",
    "distinction": "관계 자료를 알고 있는 가족 사실로 바꾸지 않는 원천 응용",
    "sourceReviewNotes": [],
    "meaningClass": "distinct_interpretation",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "관계 자료를 알고 있는 가족 사실로 바꾸지 않는 원천 응용",
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
    "id": "cpr:material:CH11.P2:practical-care-with-agreement",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P2",
    "address": "CH11.P2",
    "kind": "mbti",
    "readerQuestion": "가까운 사람에게 어떤 도움이 실제로 남는가?",
    "coreMeaning": "요청받은 생활 부담을 구체적으로 덜어주는 장점 후보",
    "roleContributions": {
      "S1": {
        "address": "CH11.P2.S1",
        "originalRole": "가족관계에서 긍정적으로 작동할 수 있는 특징을 선정한다.",
        "knowledge": "실제 가까운 관계에서 맡을 수 있는 작은 도움 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P2.S2",
        "originalRole": "근거를 설명한다.",
        "knowledge": "보호 원천과 본인의 수행을 따로 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P2.S3",
        "originalRole": "도움·배려·소통 방식으로 나타나는 모습을 보여준다.",
        "knowledge": "함께 사는지와 무관하게 동의한 한 과제를 돕는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P2.S4",
        "originalRole": "그 특징이 관계에 주는 긍정적 의미를 설명한다.",
        "knowledge": "필요와 담당이 맞을 때 관계의 예측 가능성을 높일 여지",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:identity:quiet_protector",
        "auditRef": "source-catalog.json#1fc7b68ee38cbe25ca6d",
        "sourceKind": "mbti_trait",
        "recordSha256": "9aca940dac86537535c10c128ba0d929dbc8c29b83e08e1a86ea9de906242718",
        "sourceFileSha256": "a9bc9fc83017d0b624f896f3765574c6758819fa5b499e257cf67f8f76b2f6e9",
        "originalState": {
          "type": "ISFJ",
          "area": "identity",
          "traitId": "quiet_protector",
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
    "positive": "막연한 걱정을 실제 도움으로 바꿀 가능성",
    "shadow": "도움이 많으면 가족 관계도 좋아야 한다고 기대",
    "factBomb": "가족을 위한 일도 원한 도움인지 물을 수 있음",
    "twist": "덜 맡아도 약속을 지키는 것이 안정감을 줄 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람과 합의한 일정 준비를 돕는 가상 장면"
    },
    "application": "도움 내용·기한·가능 범위를 합의",
    "prerequisites": [
      "실제 요청·관계 정의·trait·수행 여력 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "질병·돌봄 대상·자녀·부모의 존재를 상정하지 않음",
    "distinction": "우정의 자발적 만남과 다른 생활 지원의 합의",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "우정의 자발적 만남과 다른 생활 지원의 합의",
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
    "id": "cpr:material:CH11.P2:clear-shared-logistics",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P2",
    "address": "CH11.P2",
    "kind": "mbti",
    "readerQuestion": "가까운 사람에게 어떤 도움이 실제로 남는가?",
    "coreMeaning": "가까운 관계의 기대를 말로 정리하는 장점 후보",
    "roleContributions": {
      "S1": {
        "address": "CH11.P2.S1",
        "originalRole": "가족관계에서 긍정적으로 작동할 수 있는 특징을 선정한다.",
        "knowledge": "공동 일정의 애매한 부분을 확인하는 기능",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P2.S2",
        "originalRole": "근거를 설명한다.",
        "knowledge": "직접적 표현 원천은 실제 가족 지도력과 다름",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P2.S3",
        "originalRole": "도움·배려·소통 방식으로 나타나는 모습을 보여준다.",
        "knowledge": "준비할 일과 변경 가능성을 함께 말하는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P2.S4",
        "originalRole": "그 특징이 관계에 주는 긍정적 의미를 설명한다.",
        "knowledge": "상대가 선택·준비할 시간을 남기면 긍정적 소통",
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
        "axis": "DUTY",
        "id": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
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
    "positive": "서로 다른 기대를 일찍 확인할 여지",
    "shadow": "정리한 답을 가족의 합의로 간주",
    "factBomb": "가족 회의에도 지시와 동의는 다른 칸",
    "twist": "먼저 가능한 시간을 물으면 분명한 말이 덜 부담스러울 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람들과 공동 일정의 담당을 확인하는 가상 장면"
    },
    "application": "요청·선택 가능한 답·변경 신호를 구분",
    "prerequisites": [
      "실제 공동 과제·관계·trait·발언권·동의 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가족에게 명령할 권한을 유형에서 부여하지 않음",
    "distinction": "말투 장점에서 생활 운영의 기대 정렬로 이동",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "말투 장점에서 생활 운영의 기대 정렬로 이동",
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
    "id": "cpr:material:CH11.P2:agreed-responsibility",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P2",
    "address": "CH11.P2",
    "kind": "natal",
    "readerQuestion": "가까운 사람에게 어떤 도움이 실제로 남는가?",
    "coreMeaning": "정관·토의 역할·유지 상징을 합의한 담당으로 사용",
    "roleContributions": {
      "S1": {
        "address": "CH11.P2.S1",
        "originalRole": "가족관계에서 긍정적으로 작동할 수 있는 특징을 선정한다.",
        "knowledge": "원국의 실제 역할·유지 의미를 후보로 선택",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P2.S2",
        "originalRole": "근거를 설명한다.",
        "knowledge": "전통적 담당 상징은 성실한 행동의 실증이 아님",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P2.S3",
        "originalRole": "도움·배려·소통 방식으로 나타나는 모습을 보여준다.",
        "knowledge": "맡은 몫과 다음 담당이 알 정보를 남기는 장면",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P2.S4",
        "originalRole": "그 특징이 관계에 주는 긍정적 의미를 설명한다.",
        "knowledge": "실제 합의·여력·정보 공유가 있을 때 가치",
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
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "가까운 관계의 준비 부담을 줄일 질문",
    "shadow": "가족을 위해 무조건 지속해야 한다고 결론",
    "factBomb": "역할의 상징이 무급 무한 책임 계약은 아님",
    "twist": "담당을 넘길 수 있어야 지속도 가능할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "함께 정한 작은 일을 끝내고 상태를 알리는 가상 장면"
    },
    "application": "담당·완료·갱신·대체 방법을 확인",
    "prerequisites": [
      "실제 원국·관계·담당 합의·수행 여력 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가족의 성격·의무·재산·운명을 원국에서 확정 금지",
    "distinction": "CH05 일반 지속 재능보다 공동 생활의 담당·갱신",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH05 일반 지속 재능보다 공동 생활의 담당·갱신",
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
    "id": "cpr:material:CH11.P3:care-load-becomes-default",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P3",
    "address": "CH11.P3",
    "kind": "mbti",
    "readerQuestion": "가까움 때문에 어떤 기대를 생략하기 쉬운가?",
    "coreMeaning": "한 번의 도움이 계속할 역할로 굳어질 위험",
    "roleContributions": {
      "S1": {
        "address": "CH11.P3.S1",
        "originalRole": "거리감이나 갈등이 생길 수 있는 조건을 제시한다.",
        "knowledge": "일시적 도움과 반복 담당이 달라지는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P3.S2",
        "originalRole": "해당 문제의 성향적 근거를 설명한다.",
        "knowledge": "실제 도움 제공 행동·원천 선호·역할은 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P3.S3",
        "originalRole": "서로의 기대가 달라지는 상황을 보여준다.",
        "knowledge": "내가 잠깐 맡았다고 생각하지만 상대 기대가 달라질 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P3.S4",
        "originalRole": "관계에서 주의할 점을 설명한다.",
        "knowledge": "수행 주기와 변경 가능한 조건을 명확히 할 필요",
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
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "지속할 도움의 범위를 다시 합의할 여지",
    "shadow": "가까우니 말하지 않아도 알아준다고 기대",
    "factBomb": "지난번에 했다는 사실이 다음번 담당표까지 채우지는 않음",
    "twist": "다시 합의하는 것이 호의를 지킬 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "한 번 맡은 준비를 계속할지 확인하는 가상 장면"
    },
    "application": "이번 도움·반복 담당·종료 조건을 구분",
    "prerequisites": [
      "실제 반복 요청·trait·자원·관계 안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "부당한 가족·착취 경험을 이미 존재한 사실로 쓰지 않음",
    "distinction": "CH12 거절의 인상보다 반복 책임이 생기는 조건",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH12 거절의 인상보다 반복 책임이 생기는 조건",
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
    "id": "cpr:material:CH11.P3:protection-becomes-decision",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P3",
    "address": "CH11.P3",
    "kind": "mbti",
    "readerQuestion": "가까움 때문에 어떤 기대를 생략하기 쉬운가?",
    "coreMeaning": "보호하려는 뜻이 가까운 사람의 결정을 대신할 위험",
    "roleContributions": {
      "S1": {
        "address": "CH11.P3.S1",
        "originalRole": "거리감이나 갈등이 생길 수 있는 조건을 제시한다.",
        "knowledge": "안전을 걱정하는 것과 결정권을 소유하는 것을 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P3.S2",
        "originalRole": "해당 문제의 성향적 근거를 설명한다.",
        "knowledge": "보호 원천이 실제 통제 행동을 입증하지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P3.S3",
        "originalRole": "서로의 기대가 달라지는 상황을 보여준다.",
        "knowledge": "상대가 원하는 선택과 걱정하는 기준이 달라질 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P3.S4",
        "originalRole": "관계에서 주의할 점을 설명한다.",
        "knowledge": "연령·법적 책임·당사자 역량의 실제 조건을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:ISFJ:identity:quiet_protector",
        "auditRef": "source-catalog.json#1fc7b68ee38cbe25ca6d",
        "sourceKind": "mbti_trait",
        "recordSha256": "9aca940dac86537535c10c128ba0d929dbc8c29b83e08e1a86ea9de906242718",
        "sourceFileSha256": "a9bc9fc83017d0b624f896f3765574c6758819fa5b499e257cf67f8f76b2f6e9",
        "originalState": {
          "type": "ISFJ",
          "area": "identity",
          "traitId": "quiet_protector",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
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
    "positive": "필요한 안전 정보와 선택권을 함께 다룰 여지",
    "shadow": "가족이라 내가 더 잘 안다고 결론",
    "factBomb": "걱정의 크기와 대신 결정할 권한은 같은 단위가 아님",
    "twist": "일부 선택을 넘기는 것이 보호의 실효성을 높일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "가까운 사람의 계획에서 걱정과 요청을 나누는 가상 장면"
    },
    "application": "실제 책임·권한·위험·당사자 뜻을 구분",
    "prerequisites": [
      "실제 관계·역할·의사결정 권한·안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "미성년 자녀·장애·질병·의존 상태를 가정 금지",
    "distinction": "부모 역할의 사실을 발명하지 않는 보호·자율성 질문",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "부모 역할의 사실을 발명하지 않는 보호·자율성 질문",
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
    "id": "cpr:material:CH11.P3:privacy-and-coordination",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P3",
    "address": "CH11.P3",
    "kind": "mbti",
    "readerQuestion": "가까움 때문에 어떤 기대를 생략하기 쉬운가?",
    "coreMeaning": "사생활과 공동 준비에 필요한 정보를 구분",
    "roleContributions": {
      "S1": {
        "address": "CH11.P3.S1",
        "originalRole": "거리감이나 갈등이 생길 수 있는 조건을 제시한다.",
        "knowledge": "모든 생각을 설명할 부담이 있을 수 있는 조건",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P3.S2",
        "originalRole": "해당 문제의 성향적 근거를 설명한다.",
        "knowledge": "독립 판단 선호와 실제 가족 관계를 분리",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P3.S3",
        "originalRole": "서로의 기대가 달라지는 상황을 보여준다.",
        "knowledge": "개인 일정의 사적 이유와 공동 일정의 영향이 다를 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P3.S4",
        "originalRole": "관계에서 주의할 점을 설명한다.",
        "knowledge": "공유할 최소 정보와 공개하지 않을 범위를 합의",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [
      {
        "sourceId": "mbti:INTJ:identity:independent_decision_maker",
        "auditRef": "source-catalog.json#18fb1909ee68e78603a1",
        "sourceKind": "mbti_trait",
        "recordSha256": "d270a153acb4895739ebf3c4b0e422814bd21da6cfa60048773d3ba361483ba8",
        "sourceFileSha256": "f5a9b70f194d7ea3de825ba3c7aab2e1f8837b92a92b1dee4a92e8f3a6a5216a",
        "originalState": {
          "type": "INTJ",
          "area": "identity",
          "traitId": "independent_decision_maker",
          "sourceCoverage": "direct",
          "empiricalVerification": "not_established"
        }
      }
    ],
    "semanticFacets": [
      {
        "axis": "BOUNDARY",
        "id": "sar:facet:BOUNDARY:privacy",
        "definition": "정보·시간의 사적 범위를 정함",
        "condition": "공개 동의와 공유 의무 구분",
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
        "self"
      ],
      "relation": "conditional_combination",
      "runtimeFacetChange": false
    },
    "positive": "개인 영역을 지키며 공동 준비를 도울 여지",
    "shadow": "사생활이니 영향까지 말하지 않아도 된다고 판단",
    "factBomb": "비밀의 내용과 준비에 필요한 시간 정보는 다를 수 있음",
    "twist": "이유를 전부 밝히지 않아도 필요한 합의는 가능할 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "개인 약속의 세부 내용 없이 공동 일정 영향을 알리는 가상 장면"
    },
    "application": "공유 목적·최소 정보·변경 시점을 확인",
    "prerequisites": [
      "실제 공동 영향·trait·개인정보 경계·관계 안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가족이 통제하거나 본인이 고립됐다고 미확인 진단 금지",
    "distinction": "친구의 연락 빈도보다 공동 생활의 조정 정보",
    "sourceReviewNotes": [],
    "meaningClass": "conditional_combination",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "친구의 연락 빈도보다 공동 생활의 조정 정보",
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
    "id": "cpr:material:CH11.P4:renegotiate-care",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P4",
    "address": "CH11.P4",
    "kind": "recall",
    "readerQuestion": "역할과 거리를 어떻게 함께 조정할 수 있는가?",
    "coreMeaning": "반복 돌봄·도움의 담당을 갱신할 기준",
    "roleContributions": {
      "S1": {
        "address": "CH11.P4.S1",
        "originalRole": "관계에서 필요한 선택 기준을 설명한다.",
        "knowledge": "앞선 실제 도입된 도움·부담 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P4.S2",
        "originalRole": "구체적인 소통 방법을 제시한다.",
        "knowledge": "지금 가능한 내용과 어려운 내용을 구체적으로 말함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P4.S3",
        "originalRole": "건강한 거리와 역할 분담의 조건을 설명한다.",
        "knowledge": "수행 주기·대체 방법·종료 조건을 함께 정함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P4.S4",
        "originalRole": "따뜻하고 현실적인 마무리를 제공한다.",
        "knowledge": "호의와 자기 여력이 함께 남을 현실적 가능성",
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
    "positive": "상대의 필요와 실제 도움을 맞출 여지",
    "shadow": "이야기만 하면 역할이 공평해진다고 보장",
    "factBomb": "합의를 요청하는 일과 합의가 된 사실은 다름",
    "twist": "작은 한 번의 조정부터 관계가 달라질 여지가 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "반복 부탁 한 가지의 다음 담당을 의논하는 가상 장면"
    },
    "application": "변경 가능한 몫 하나와 필요한 지원을 확인",
    "prerequisites": [
      "실제 도입 의미·역할·자원·관계 안전 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "강압·학대 위험을 단순 대화 조언으로 해결 보장 금지",
    "distinction": "새 가족 사실 없이 기존 역할의 갱신에 집중",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH11.P2:practical-care-with-agreement",
      "cpr:material:CH11.P3:care-load-becomes-default"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "새 가족 사실 없이 기존 역할의 갱신에 집중",
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
    "id": "cpr:material:CH11.P4:coordinate-with-privacy",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P4",
    "address": "CH11.P4",
    "kind": "recall",
    "readerQuestion": "역할과 거리를 어떻게 함께 조정할 수 있는가?",
    "coreMeaning": "사적 이유와 공동 영향의 최소 공유 기준",
    "roleContributions": {
      "S1": {
        "address": "CH11.P4.S1",
        "originalRole": "관계에서 필요한 선택 기준을 설명한다.",
        "knowledge": "앞선 실제 소개된 자기 판단·정보 경계만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P4.S2",
        "originalRole": "구체적인 소통 방법을 제시한다.",
        "knowledge": "공유할 영향과 밝히지 않을 내용을 나눠 전함",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P4.S3",
        "originalRole": "건강한 거리와 역할 분담의 조건을 설명한다.",
        "knowledge": "다음 변경 시점과 공동 준비의 담당을 확인",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P4.S4",
        "originalRole": "따뜻하고 현실적인 마무리를 제공한다.",
        "knowledge": "모든 것을 같게 하지 않아도 조율할 가능성",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "자기 선택과 가까운 사람의 준비를 함께 존중",
    "shadow": "독립성을 얻으려면 관계를 끊어야 한다고 생각",
    "factBomb": "내 선택을 지키는 방법이 항상 단절일 필요는 없음",
    "twist": "짧은 일정 정보로 긴 사생활 설명을 줄일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 준비에 필요한 시간만 알려 주는 가상 장면"
    },
    "application": "필요한 정보·공개 동의·변경 약속을 확인",
    "prerequisites": [
      "앞선 실제 의미·공동 영향·안전·당사자 선택 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "동거·혼인·부모 관계를 새로 가정하지 않음",
    "distinction": "CH10의 친밀도 합의와 다른 공동 준비 정보",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH11.P1:own-choice-near-family",
      "cpr:material:CH11.P3:privacy-and-coordination"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "CH10의 친밀도 합의와 다른 공동 준비 정보",
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
    "id": "cpr:material:CH11.P4:shared-duty-with-return",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P4",
    "address": "CH11.P4",
    "kind": "recall",
    "readerQuestion": "역할과 거리를 어떻게 함께 조정할 수 있는가?",
    "coreMeaning": "합의한 가족 역할의 갱신·인수인계 조건",
    "roleContributions": {
      "S1": {
        "address": "CH11.P4.S1",
        "originalRole": "관계에서 필요한 선택 기준을 설명한다.",
        "knowledge": "앞선 실제 도입된 담당 의미만 회수",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P4.S2",
        "originalRole": "구체적인 소통 방법을 제시한다.",
        "knowledge": "못 맡을 가능성을 미리 알리는 방법",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P4.S3",
        "originalRole": "건강한 거리와 역할 분담의 조건을 설명한다.",
        "knowledge": "다음 담당·필요한 자료·다시 맡을 조건을 합의",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P4.S4",
        "originalRole": "따뜻하고 현실적인 마무리를 제공한다.",
        "knowledge": "가까운 관계의 부담을 함께 볼 현실적 마무리",
        "roleKind": "interpretation_material_not_final_copy"
      }
    },
    "sourceRefs": [],
    "semanticFacets": [
      {
        "axis": "DUTY",
        "id": "sar:facet:DUTY:promise-update",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
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
      "relation": "existing_meaning_application",
      "runtimeFacetChange": false
    },
    "positive": "한 사람의 기억에만 기대지 않는 준비 가능성",
    "shadow": "실제 역할을 혈연·원국의 타고난 의무로 고정",
    "factBomb": "가족이라는 말도 누가 언제까지 할지를 대신하지 않음",
    "twist": "담당을 바꾸는 것이 약속을 지키는 방법일 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 일을 넘길 때 현재 상태와 다음 확인을 남기는 가상 장면"
    },
    "application": "역할·기한·자원·대체 가능성을 확인",
    "prerequisites": [
      "앞선 실제 근거·합의된 역할·수행 여력 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "의무·법률·부양 계약을 원국이나 유형으로 판단하지 않음",
    "distinction": "운명적 가족 역할 대신 합의한 생활 역할의 사용법",
    "sourceReviewNotes": [],
    "meaningClass": "introduced_meaning_recall",
    "precedingMeaningRefs": [
      "cpr:material:CH11.P1:position-is-not-duty-roster",
      "cpr:material:CH11.P2:agreed-responsibility"
    ],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "운명적 가족 역할 대신 합의한 생활 역할의 사용법",
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
    "id": "cpr:material:CH11.P3:same-duty-different-expectations",
    "product": "saju_mbti_full",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "empiricalVerification": "not_established",
    "chapterId": "CH11",
    "paragraphId": "P3",
    "address": "CH11.P3",
    "kind": "natal",
    "readerQuestion": "가까움 때문에 어떤 기대를 생략하기 쉬운가?",
    "coreMeaning": "합의한 가까운 역할과 암묵적 기대가 달라질 조건",
    "roleContributions": {
      "S1": {
        "address": "CH11.P3.S1",
        "originalRole": "거리감이나 갈등이 생길 수 있는 조건을 제시한다.",
        "knowledge": "원국의 역할 좌표와 현실 담당을 먼저 구분",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S2": {
        "address": "CH11.P3.S2",
        "originalRole": "해당 문제의 성향적 근거를 설명한다.",
        "knowledge": "정관·월주가 특정 가족 의무를 증명하지 않음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S3": {
        "address": "CH11.P3.S3",
        "originalRole": "서로의 기대가 달라지는 상황을 보여준다.",
        "knowledge": "한 번의 도움을 반복 담당으로 다르게 이해할 수 있음",
        "roleKind": "interpretation_material_not_final_copy"
      },
      "S4": {
        "address": "CH11.P3.S4",
        "originalRole": "관계에서 주의할 점을 설명한다.",
        "knowledge": "실제로 맡은 몫과 변경 조건을 확인할 주의점",
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
        "sourceId": "foundation:position:month",
        "auditRef": "source-catalog.json#33f6686796b4388c0504",
        "sourceKind": "natal_research",
        "recordSha256": "1849a67cd72304bcb2709957dfae17c420d138cb4ef2875f5b1a0c28fe9c8ab2",
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
              "SajuCalcResult.pillars.month"
            ],
            "legacyRefs": []
          },
          "deferred": [
            "위치×십성×지지의 상세 전통 해석과 연령 구간별 계보 대조는 후속 검토."
          ],
          "appliesWhen": [
            "해당 기둥이 실제 계산되었을 때. 시주 미상에서는 시주 해석을 하지 않는다."
          ],
          "doNotApply": [
            "가족관계·배우자·자녀의 사실을 입력 없이 만들어내는 용도.",
            "출생시간 미상인 사람에게 시주의 결실·자녀 해석을 대입하는 용도."
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
        "id": "sar:facet:DUTY:scope-responsibility",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
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
        "steady"
      ],
      "relation": "product_application",
      "runtimeFacetChange": false
    },
    "positive": "담당이 불분명한 수고를 대화할 여지",
    "shadow": "사주상 책임감이니 계속 맡아야 한다고 결론",
    "factBomb": "태어난 달의 칸이 가족의 부탁을 전부 승인하지 않음",
    "twist": "같은 역할도 현재 여력에 맞춰 바꿀 수 있음",
    "fictionalScene": {
      "status": "fictional_not_customer_history",
      "text": "공동 일의 이번 담당과 다음 담당을 묻는 가상 장면"
    },
    "application": "실제 합의·수행 주기·변경 동의를 확인",
    "prerequisites": [
      "실제 원국·가까운 관계 정의·담당·자원 추가 확인",
      "연구 참조와 별도로 같은 개인의 실제 계산 Evidence·입력·적용 조건을 후속 단계에서 확인한다.",
      "동일 fact의 별칭·축·facet·Fusion wrapper는 추가 독립 사실이 아니다."
    ],
    "counterexample": "가족 구성·부양 의무·실제 분쟁·MBTI를 생성 금지",
    "distinction": "명리 단독에서도 가족의 사실과 해석 좌표를 분리",
    "sourceReviewNotes": [],
    "meaningClass": "contextual_application",
    "precedingMeaningRefs": [],
    "precedingMeaningPolicy": "actual_introduced_compatible_subset_only",
    "newInformation": "명리 단독에서도 가족의 사실과 해석 좌표를 분리",
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
