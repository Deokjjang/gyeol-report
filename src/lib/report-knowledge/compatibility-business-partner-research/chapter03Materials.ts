/** Static offline businessPartner research. No runtime registration or customer approval. */
import type { BusinessPartnerMaterial } from "./researchTypes";
export const BP_CH03_MATERIALS: readonly BusinessPartnerMaterial[] = [
  {
    "id": "bppr:material:CH03.P1:b-operational-conditions",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B는 어떤 자료로 실행 조건을 이해하는가?",
    "coreMeaning": "B가 실행 순서·기준을 확인하는 독립적 이유",
    "roleContributions": [
      {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "약속을 수행할 과정·기준을 묻는 B 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "B 실제 정재 정의는 자원 관리 상징이며 실제 회계 역량이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "ESFJ 원천의 절차 확인을 A의 유형에서 복사하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "A의 제안을 실행 단계·필요 자료·미확정 조건으로 함께 읽을 수 있음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "60699f5629066c047ea1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "e2ed5b09b1f8185708cd",
        "sourceUse": "actual_natal_condition_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "5b95f1a5a0504d2d0869",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "operations",
      "contract"
    ],
    "outputType": "operation_conditions",
    "positive": "납품 전 필요한 조건을 찾을 여지",
    "risk": "정해진 방식이 없으면 대안을 모두 보류",
    "factBomb": "과정을 묻는 질문이 기회에 대한 반대는 아니다",
    "twist": "실행 조건을 확인해야 더 독립적으로 맡을 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 새 수주안의 작업·검토·고객 응답 순서를 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "제안·확정·미결을 설명",
      "personB": "수행 기준·필요 자료 질문"
    },
    "counterexample": "B 실제 원천·업무 맥락 없으면 보류",
    "distinctFromOtherParagraphs": "B의 이해 형식",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P1:b-operational-conditions",
          "sourceKeys": [
            "60699f5629066c047ea1",
            "e2ed5b09b1f8185708cd",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "60699f5629066c047ea1"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "60699f5629066c047ea1",
          "domain": "WORK"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 새 수주안의 작업·검토·고객 응답 순서를 확인",
      "aChange": "제안·확정·미결을 설명",
      "bChange": "수행 기준·필요 자료 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "operation_conditions",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "실제 납기·인력·추가 작업 비용은 별도 확인",
    "additionalBusinessInfo": [
      "delivery_requirements",
      "resources",
      "contract_scope"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "delivery_scope",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "고객에게 약속하기 전 어떤 수행 조건이 필요한가요?"
    },
    "personAAction": "제안·확정·미결을 설명",
    "personBAction": "수행 기준·필요 자료 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P1:b-method-and-data",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P1",
    "address": "CH03.P1",
    "mode": "SELF_B",
    "readerQuestion": "B는 어떤 자료로 실행 조건을 이해하는가?",
    "coreMeaning": "B가 작동 자료를 검토하는 방식",
    "roleContributions": [
      {
        "address": "CH03.P1.S1",
        "originalRole": "독립적 행동",
        "knowledge": "말보다 실제 작동·수치·비용을 확인하는 독립 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "B 실제 식신 정의는 산출 상징이며 기술 자격·성과 보장이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "실제 ISTP 원천의 확인 방식을 따로 사용",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P1.S4",
        "originalRole": "A와의 관계",
        "knowledge": "A와 논의할 때 시험 결과가 알려준 범위와 미확인을 구분할 수 있음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "c0fbe9a4b01f0f51c46b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "actual_natal_condition_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "f64a1b254b8c7a0ebd5e",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRACTICALITY:use-test",
        "axis": "PRACTICALITY",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "trial",
    "workFunctions": [
      "trial",
      "data"
    ],
    "outputType": "operation_data",
    "positive": "실행 가능성을 좁힐 여지",
    "risk": "눈에 보이는 작동만 보고 유지·회수 비용 누락",
    "factBomb": "돌아간다는 사실만으로 유지할 돈과 시간이 확보되지는 않는다",
    "twist": "작은 시험이 더 큰 유지 질문을 드러낼 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 작동 시연 뒤 반복 운영 자원을 따로 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "시험의 가정·한계를 설명",
      "personB": "작동·유지·미확인을 구분"
    },
    "counterexample": "실제 전문 자격·기술력을 유형으로 부여 금지",
    "distinctFromOtherParagraphs": "절차 확인과 다른 관찰 자료의 단위",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P1:b-method-and-data",
          "sourceKeys": [
            "c0fbe9a4b01f0f51c46b",
            "90e77590d3ea07930ba1",
            "f64a1b254b8c7a0ebd5e"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISTP",
              "sourceKey": "c0fbe9a4b01f0f51c46b"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "c0fbe9a4b01f0f51c46b",
          "domain": "THINKING"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 작동 시연 뒤 반복 운영 자원을 따로 확인",
      "aChange": "시험의 가정·한계를 설명",
      "bChange": "작동·유지·미확인을 구분",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "operation_data",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "장비·유지·지원·작업 시간이 다른 비용",
    "additionalBusinessInfo": [
      "operating_costs",
      "test_results",
      "maintenance_scope"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "trial_scope",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "시연이 끝난 뒤 반복 운영에 무엇이 더 필요한가요?"
    },
    "personAAction": "시험의 가정·한계를 설명",
    "personBAction": "작동·유지·미확인을 구분",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P2:b-terms-before-money",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 필요한 비용·범위 정보는 무엇인가?",
    "coreMeaning": "B가 정산 기준을 확인해야 하는 조건",
    "roleContributions": [
      {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "무엇을 어떤 기준으로 정산하는지 알고 싶을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "실제 개인 원천의 기준 선호는 실제 공정함·회계 실력 증명이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "A가 말한 기여와 실제 합의한 비용·보수·분배가 다르면 질문 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "계약·수행·자료가 구분되면 확인할 금액 범위를 좁힐 여지",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "b64fa2920704301bf622",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "51ae3a3317baa66901c0",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "settlement",
    "workFunctions": [
      "contribution",
      "settlement"
    ],
    "outputType": "settlement_questions",
    "positive": "정산의 빈칸을 드러낼 가능성",
    "risk": "기록을 보여달라는 요청을 불신으로 해석",
    "factBomb": "친하다는 이유로 정산 기준을 추측할 수는 없다",
    "twist": "기준을 먼저 정하는 것이 돈 얘기를 줄일 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 노동 대가와 손익 배분을 별도로 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "합의·수행·미정 항목을 제시",
      "personB": "정산 자료·기준·시점 질문"
    },
    "counterexample": "실제 비율·세금·책임 판정 금지",
    "distinctFromOtherParagraphs": "B가 필요한 경제 정보의 종류",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P2:b-terms-before-money",
          "sourceKeys": [
            "b64fa2920704301bf622",
            "51ae3a3317baa66901c0"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISTJ",
              "sourceKey": "b64fa2920704301bf622"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "b64fa2920704301bf622",
          "domain": "MONEY"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 노동 대가와 손익 배분을 별도로 확인",
      "aChange": "합의·수행·미정 항목을 제시",
      "bChange": "정산 자료·기준·시점 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "settlement_questions",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "정산액·분배액·입금 가능액은 서로 다른 항목",
    "additionalBusinessInfo": [
      "financial_records",
      "compensation_terms",
      "profit_distribution"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "allocation_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "비용 정산·노동 대가·손익 분배를 나눠 확인할까요?"
    },
    "personAAction": "합의·수행·미정 항목을 제시",
    "personBAction": "정산 자료·기준·시점 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P2:b-value-before-price",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P2",
    "address": "CH03.P2",
    "mode": "SELF_B",
    "readerQuestion": "B가 필요한 비용·범위 정보는 무엇인가?",
    "coreMeaning": "B가 추가 작업 범위와 대가를 확인하는 조건",
    "roleContributions": [
      {
        "address": "CH03.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "작업 범위를 정하고 반복 가능한 제공 조건이 필요할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S2",
        "originalRole": "독립적 이유",
        "knowledge": "ISFP 원천의 추가 작업 경계는 실제 가격 협상 능력·수입을 판정하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S3",
        "originalRole": "A와의 장면",
        "knowledge": "A가 고객에게 더 해주자는 제안을 하면 기존 약속과 추가 작업을 나눔",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "양쪽 동의한 범위·대가·기한이 있어야 부담을 예측할 여지",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "f30fa018d453a0318547",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "5b95f1a5a0504d2d0869",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "pricing",
    "workFunctions": [
      "pricing",
      "extra_scope"
    ],
    "outputType": "extra_scope",
    "positive": "무상 추가 노동을 드러낼 가능성",
    "risk": "관계를 위해 범위 없는 수정을 수락",
    "factBomb": "고객에게 친절한 약속이 상대에게는 무료 노동일 수 있다",
    "twist": "범위를 줄이는 것이 고객 약속을 더 확실히 지킬 조건일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 기본 납품과 추가 변경 견적을 구분",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "제안의 추가 범위·목적 설명",
      "personB": "소요·대가·기한 확인"
    },
    "counterexample": "고객 계약·적정 가격·자격을 추정하지 않음",
    "distinctFromOtherParagraphs": "정산 기준과 다른 제공 범위·가격 질문",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P2:b-value-before-price",
          "sourceKeys": [
            "f30fa018d453a0318547",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISFP",
              "sourceKey": "f30fa018d453a0318547"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "f30fa018d453a0318547",
          "domain": "MONEY"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 기본 납품과 추가 변경 견적을 구분",
      "aChange": "제안의 추가 범위·목적 설명",
      "bChange": "소요·대가·기한 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "extra_scope",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "작업 시간·외부 비용·추가 검토를 별도 확인",
    "additionalBusinessInfo": [
      "scope",
      "pricing_basis",
      "delivery_time"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "pricing_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "추가 요청은 기존 대가와 납기에 포함돼 있나요?"
    },
    "personAAction": "제안의 추가 범위·목적 설명",
    "personBAction": "소요·대가·기한 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P3:b-customer-observation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B의 독립 강점은 언제 유용한가?",
    "coreMeaning": "B의 가까운 반응 정보가 제공할 기여",
    "roleContributions": [
      {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "즉각적인 요청·반응을 살피는 독립적 강점 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "실제 B 원천은 고객 전문성·매출 실증이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "A가 세운 가설과 다른 문의·사용 막힘을 제시할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "관찰 범위·빈도·실제 구매 여부를 구분해야 정보가 유용",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "e08ef500cdb091985a2e",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d8e6b5b9bc1c9e1094f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "customer_review",
    "workFunctions": [
      "customer",
      "information"
    ],
    "outputType": "customer_evidence",
    "positive": "사업 가정을 확인할 여지",
    "risk": "좋은 반응을 전체 수요로 확대",
    "factBomb": "고맙다는 반응과 다시 돈을 내겠다는 약속은 다르다",
    "twist": "불편한 문의가 다음 제품의 중요한 질문일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 무료 시연 반응과 유료 구매 의향을 별도 기록",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가설과 비교할 질문을 제시",
      "personB": "관찰·해석·표본 범위 구분"
    },
    "counterexample": "입력 없는 실제 고객·구매 이력 생성 금지",
    "distinctFromOtherParagraphs": "B의 강점 중 가까운 반응 정보",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P3:b-customer-observation",
          "sourceKeys": [
            "e08ef500cdb091985a2e",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "e08ef500cdb091985a2e"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "e08ef500cdb091985a2e",
          "domain": "THINKING"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 무료 시연 반응과 유료 구매 의향을 별도 기록",
      "aChange": "가설과 비교할 질문을 제시",
      "bChange": "관찰·해석·표본 범위 구분",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "customer_evidence",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시연·지원·반복 문의 대응의 비용 확인",
    "additionalBusinessInfo": [
      "customer_data",
      "purchase_evidence",
      "support_cost"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "demand_validation",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "관심·사용·구매·재구매 중 무엇을 실제 확인했나요?"
    },
    "personAAction": "가설과 비교할 질문을 제시",
    "personBAction": "관찰·해석·표본 범위 구분",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P3:b-cost-gap-review",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P3",
    "address": "CH03.P3",
    "mode": "SELF_B",
    "readerQuestion": "B의 독립 강점은 언제 유용한가?",
    "coreMeaning": "B의 불일치 검토가 자금 판단에 주는 정보",
    "roleContributions": [
      {
        "address": "CH03.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "수치·절차의 빈칸을 찾는 독립 강점 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S2",
        "originalRole": "독립적 근거",
        "knowledge": "개인 원천은 회계 자격·실제 검토 결과를 보장하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S3",
        "originalRole": "A에게 좋은 상황",
        "knowledge": "A에게 계약 금액·청구·입금 시점 차이를 확인 질문으로 제공",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "실제 자료·지급 의무·미확인 회수 조건을 함께 봐야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "c7fee219fcf7a5b642fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "24c9a0e7e3707d4f1f00",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "collection",
    "workFunctions": [
      "cash_flow",
      "review"
    ],
    "outputType": "cash_gap_question",
    "positive": "누락된 시점을 발견할 여지",
    "risk": "검토 성향 때문에 B를 자동 재무 담당자로 고정",
    "factBomb": "숫자를 잘 따지는 것처럼 보여도 공동 계좌 관리 책임이 자동 생기지는 않는다",
    "twist": "회수 시점 질문이 좋은 매출 제안을 실행 가능하게 할 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 청구 예정액과 실제 입금액을 나눠 검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "현재 가정·필요 결정을 제시",
      "personB": "자료 차이·미확인 회수 조건 질문"
    },
    "counterexample": "잔고·부채·연체 사실·자격 추정 금지",
    "distinctFromOtherParagraphs": "고객 반응과 다른 지급 시점 정보",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P3:b-cost-gap-review",
          "sourceKeys": [
            "c7fee219fcf7a5b642fd",
            "24c9a0e7e3707d4f1f00"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISTJ",
              "sourceKey": "c7fee219fcf7a5b642fd"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "c7fee219fcf7a5b642fd",
          "domain": "THINKING"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 청구 예정액과 실제 입금액을 나눠 검토",
      "aChange": "현재 가정·필요 결정을 제시",
      "bChange": "자료 차이·미확인 회수 조건 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "cash_gap_question",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "수익성 전망과 지급할 현금의 시점은 별개",
    "additionalBusinessInfo": [
      "receipts",
      "payment_dates",
      "payables"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "collection_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "계약 금액 중 언제 실제로 들어올 돈을 확인했나요?"
    },
    "personAAction": "현재 가정·필요 결정을 제시",
    "personBAction": "자료 차이·미확인 회수 조건 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P4:b-review-without-close",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B의 과용은 어떤 조건을 가리는가?",
    "coreMeaning": "B의 검토가 결정 종료 기준 없이 늘어나는 위험",
    "roleContributions": [
      {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "자료를 더 모으려다 필요한 결정을 미룰 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "실제 B 원천은 신중함·능력·위험 회피를 확정하지 않음; 개인 Fusion은 같은 B의 두 실제 root·방향·context 확인 전 보류",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "A에게는 검토 요청이 계속 새 조건으로 들릴 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "필수 확인·남은 불확실성·보류할 이유·재검토 시한을 구분",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "446d4547c9d18193acaa",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "f64a1b254b8c7a0ebd5e",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "24425ec34fdb222ac805",
        "sourceUse": "both_same_person_roots_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "continuation",
    "workFunctions": [
      "overanalysis",
      "decision"
    ],
    "outputType": "review_close",
    "positive": "판단에 필요한 검토를 좁힐 여지",
    "risk": "A에게 반대 근거를 무조건 다 제거하게 함",
    "factBomb": "자료를 더 본다는 말에도 이번 결정에 필요한 끝이 있어야 한다",
    "twist": "모른다는 범위를 밝히고 작은 시험으로 옮길 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 전체 확장 대신 제한된 검토안의 시한을 정함",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "결정 필요·가정을 명시",
      "personB": "필수 질문·종료 조건·시한 제시"
    },
    "counterexample": "정해진 법정·안전 확인은 생략 불가",
    "distinctFromOtherParagraphs": "B의 검토 과용 비용",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P4:b-review-without-close",
          "sourceKeys": [
            "446d4547c9d18193acaa",
            "f64a1b254b8c7a0ebd5e",
            "24425ec34fdb222ac805"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "446d4547c9d18193acaa"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "446d4547c9d18193acaa",
          "domain": "INVESTMENT"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 전체 확장 대신 제한된 검토안의 시한을 정함",
      "aChange": "결정 필요·가정을 명시",
      "bChange": "필수 질문·종료 조건·시한 제시",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "review_close",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "검토 시간·기회비용·기존 외부 약속 구분",
    "additionalBusinessInfo": [
      "decision_deadline",
      "missing_evidence",
      "external_commitments"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "continuation_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "무엇을 확인하면 검토를 마치고 다시 결정하나요?"
    },
    "personAAction": "결정 필요·가정을 명시",
    "personBAction": "필수 질문·종료 조건·시한 제시",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH03.P4:b-relationship-cost-blindness",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH03",
    "paragraphId": "P4",
    "address": "CH03.P4",
    "mode": "SELF_B",
    "readerQuestion": "B의 과용은 어떤 조건을 가리는가?",
    "coreMeaning": "신뢰하는 제안자의 호감과 실제 조건을 섞는 위험",
    "roleContributions": [
      {
        "address": "CH03.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "친분·평판을 먼저 받아들일 때 검토 범위가 줄어들 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S2",
        "originalRole": "원인",
        "knowledge": "실제 원천은 취약함·금전 피해 이력의 증거가 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S3",
        "originalRole": "A가 받는 뜻",
        "knowledge": "A는 동의로 받아도 B는 관계를 거절하기 어려웠을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH03.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "조건·질문·보류 의사를 안전하게 확인해야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "756426b20e7a45cb7d82",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "464de610689b7074363e",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:cue-observation",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "말·표정·참여의 변화를 관찰",
        "condition": "추측과 관찰을 명확히 분리",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "contract",
    "workFunctions": [
      "trust",
      "risk"
    ],
    "outputType": "consent_conditions",
    "positive": "기대와 동의 범위를 분리할 여지",
    "risk": "호응만 보고 공동 위험 수락으로 확정",
    "factBomb": "상대를 믿는 마음이 모든 비용을 이해했다는 뜻은 아니다",
    "twist": "조건을 묻는 것이 관계의 거절이 아닐 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 추천자의 진심과 계약·손실 조건을 분리",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "조건·자료·보류 가능성 설명",
      "personB": "미확인·동의 범위를 확인"
    },
    "counterexample": "사기·강요·경제적 착취는 궁합 차이로 정상화 금지",
    "distinctFromOtherParagraphs": "검토 지연과 다른 관계·조건 혼동",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH03.P4:b-relationship-cost-blindness",
          "sourceKeys": [
            "756426b20e7a45cb7d82",
            "464de610689b7074363e"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "756426b20e7a45cb7d82"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "756426b20e7a45cb7d82",
          "domain": "INVESTMENT"
        }
      ],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_business_status",
        "actual_business_type",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "actual_costs",
        "cash_timing",
        "verified_contributions",
        "verified_equity",
        "verified_contract",
        "verified_decision_rights",
        "safe_negotiation_context"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 추천자의 진심과 계약·손실 조건을 분리",
      "aChange": "조건·자료·보류 가능성 설명",
      "bChange": "미확인·동의 범위를 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "consent_conditions",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "추가 지출·손실 한도·회수 약속은 실제 확인 필요",
    "additionalBusinessInfo": [
      "risk_terms",
      "consent",
      "contract_scope"
    ],
    "businessContext": {
      "status": "UNKNOWN",
      "equity": "UNKNOWN",
      "assets": "UNKNOWN",
      "debt": "UNKNOWN",
      "revenue": "UNKNOWN",
      "contract": "UNKNOWN",
      "decisionRights": "UNKNOWN"
    },
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "A",
      "personB": "B"
    },
    "authorityContext": {
      "kind": "contract_confirmation",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "호감과 실제 비용·권한 동의를 나눠 확인할까요?"
    },
    "personAAction": "조건·자료·보류 가능성 설명",
    "personBAction": "미확인·동의 범위를 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  }
];
