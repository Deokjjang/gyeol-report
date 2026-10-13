/** Static offline businessPartner research. No runtime registration or customer approval. */
import type { BusinessPartnerMaterial } from "./researchTypes";
export const BP_CH04_MATERIALS: readonly BusinessPartnerMaterial[] = [
  {
    "id": "bppr:material:CH04.P1:shared-proof-before-investment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "mode": "JOINT",
    "readerQuestion": "고객·제공의 어떤 접점이 실제로 공통인가?",
    "coreMeaning": "가설과 관찰을 구분하는 공통 접점",
    "roleContributions": [
      {
        "address": "CH04.P1.S1",
        "originalRole": "검증된 공통점 또는 다른 기여",
        "knowledge": "A의 대안 탐색과 B의 불일치 검토가 수요 질문에 만날 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S2",
        "originalRole": "각자 근거",
        "knowledge": "각자 실제 원천이 있어도 고객 조사 실력은 미확인",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S3",
        "originalRole": "함께하는 행동",
        "knowledge": "가상: 관심 표현·시험 사용·실제 구매를 나눠 적음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S4",
        "originalRole": "강점의 조건",
        "knowledge": "서로 같은 시장 결론을 강요하지 않고 반증 자료도 남길 때 유용",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "0ba71def5f7dd66a4424",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "c7fee219fcf7a5b642fd",
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
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "market",
    "workFunctions": [
      "market",
      "evidence"
    ],
    "outputType": "demand_log",
    "positive": "투자 전에 가정을 좁힐 가능성",
    "risk": "두 사람의 동의만으로 외부 수요를 인정",
    "factBomb": "우리끼리 납득한 사업은 아직 고객에게 검증된 사업이 아니다",
    "twist": "반대 증거를 함께 찾는 것이 제안을 살릴 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 유료 시험 전 고객 문제와 구매 조건을 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "대안·가설 제시",
      "personB": "관찰·오차 질문"
    },
    "counterexample": "조사 응답을 실제 매출로 환산 금지",
    "distinctFromOtherParagraphs": "공통 성향의 시장 검증 접점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P1:shared-proof-before-investment",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "c7fee219fcf7a5b642fd",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "0ba71def5f7dd66a4424"
            },
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
          "owner": "A",
          "type": "INTP",
          "sourceKey": "0ba71def5f7dd66a4424",
          "domain": "THINKING"
        },
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
      "firstFactCheck": "가상: 유료 시험 전 고객 문제와 구매 조건을 확인",
      "aChange": "대안·가설 제시",
      "bChange": "관찰·오차 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "demand_log",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시험비·응답 편향·구매 의사와 실제 입금은 별개",
    "additionalBusinessInfo": [
      "customer_problem",
      "test_budget",
      "purchase_evidence"
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
      "kind": "trial_approval",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "무엇이 확인되어야 시험에 자원을 쓸까요?"
    },
    "personAAction": "대안·가설 제시",
    "personBAction": "관찰·오차 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P1:shared-scope-repeatability",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P1",
    "address": "CH04.P1",
    "mode": "JOINT",
    "readerQuestion": "고객·제공의 어떤 접점이 실제로 공통인가?",
    "coreMeaning": "기록과 수행 순서가 제공 조건에 만나는 접점",
    "roleContributions": [
      {
        "address": "CH04.P1.S1",
        "originalRole": "검증된 공통점 또는 다른 기여",
        "knowledge": "A는 금전 약속 기록을 B는 수행 절차를 확인하는 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S2",
        "originalRole": "각자 근거",
        "knowledge": "독립 원천은 실제 계약 이행·수입을 보장하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S3",
        "originalRole": "함께하는 행동",
        "knowledge": "가상: 기본 제공·추가 변경·응답 시간을 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P1.S4",
        "originalRole": "강점의 조건",
        "knowledge": "새 요청을 받아도 기존 합의를 다시 확인할 통로가 필요",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "81c172dd5bbbb1920ae6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "60699f5629066c047ea1",
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
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "offer",
    "workFunctions": [
      "scope",
      "repeatability"
    ],
    "outputType": "offer_scope",
    "positive": "반복 가능한 제공 조건을 만들 여지",
    "risk": "기록을 만든 것만으로 납품 능력 확보로 오인",
    "factBomb": "문서에 적힌 약속도 수행할 자원이 없으면 지킬 수 없다",
    "twist": "제공 범위를 좁히면 반복 운영이 더 쉬워질 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 상품 설명과 실제 지원 범위를 대조",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "약속·가격 조건 정리",
      "personB": "반복 수행·지원 순서 확인"
    },
    "counterexample": "법적 효력·허가·이행 능력 미확인 시 보류",
    "distinctFromOtherParagraphs": "시장 증거와 다른 제공 약속의 접점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P1:shared-scope-repeatability",
          "sourceKeys": [
            "81c172dd5bbbb1920ae6",
            "60699f5629066c047ea1",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "81c172dd5bbbb1920ae6"
            },
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
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "81c172dd5bbbb1920ae6",
          "domain": "MONEY"
        },
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
      "firstFactCheck": "가상: 상품 설명과 실제 지원 범위를 대조",
      "aChange": "약속·가격 조건 정리",
      "bChange": "반복 수행·지원 순서 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "offer_scope",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "기본 작업·추가 수정·유지 지원 비용 구분",
    "additionalBusinessInfo": [
      "offer_terms",
      "resources",
      "ongoing_support"
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
      "kind": "offer_release",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "같은 조건으로 두 번째도 제공할 수 있나요?"
    },
    "personAAction": "약속·가격 조건 정리",
    "personBAction": "반복 수행·지원 순서 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P2:exploration-delivery-interface",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "mode": "JOINT",
    "readerQuestion": "다른 기여를 잇는 비용·동의 조건은 무엇인가?",
    "coreMeaning": "새 대안과 실행 순서를 잇는 조건",
    "roleContributions": [
      {
        "address": "CH04.P2.S1",
        "originalRole": "검증된 보완 또는 다른 장점",
        "knowledge": "대안을 넓히는 A 후보와 과정을 확인하는 B 후보가 만날 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "Pair 일반 참고는 전문 사업 성공 근거가 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S3",
        "originalRole": "도움의 장면",
        "knowledge": "가상: 새 기능 제안에 필요한 작업·지원·납기를 붙임",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S4",
        "originalRole": "좋은 차이의 경계",
        "knowledge": "A가 영업 담당 B가 운영 담당이라고 고정하지 않아야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "0ba71def5f7dd66a4424",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "60699f5629066c047ea1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "2fe4d73f766a08fb06e6",
        "sourceUse": "directed_reference_only",
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
        "id": "sar:facet:CREATION:prototype",
        "axis": "CREATION",
        "definition": "아이디어를 시험 가능한 형태로 만듦",
        "condition": "미완성 상태와 시험 목적을 알릴 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "proposal",
    "workFunctions": [
      "idea",
      "delivery"
    ],
    "outputType": "proposal_conditions",
    "positive": "제안과 실제 제공 사이의 빈칸을 찾을 여지",
    "risk": "아이디어·실행의 가치를 지분 서열로 바꿈",
    "factBomb": "좋은 제안도 누군가의 공짜 운영을 전제로 하면 보완이 아니다",
    "twist": "실행의 질문이 아이디어를 줄이기보다 제공 형태를 바꿀 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 새 옵션을 제한된 제공안으로 바꿈",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가치·가정·미정 설명",
      "personB": "수행·검토·지원 비용 질문"
    },
    "counterexample": "각자의 실제 역량·역할은 별도 확인",
    "distinctFromOtherParagraphs": "서로 다른 정보의 제안 인터페이스",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P2:exploration-delivery-interface",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "60699f5629066c047ea1",
            "2fe4d73f766a08fb06e6",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "0ba71def5f7dd66a4424"
            },
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
          "owner": "A",
          "type": "INTP",
          "sourceKey": "0ba71def5f7dd66a4424",
          "domain": "THINKING"
        },
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
      "firstFactCheck": "가상: 새 옵션을 제한된 제공안으로 바꿈",
      "aChange": "가치·가정·미정 설명",
      "bChange": "수행·검토·지원 비용 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "proposal_conditions",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "추가 기능의 개발·지원·납기 비용은 분리",
    "additionalBusinessInfo": [
      "proposal",
      "delivery_conditions",
      "roles"
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
      "kind": "customer_commitment",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "제안의 가치를 지키려면 수행 조건은 무엇인가요?"
    },
    "personAAction": "가치·가정·미정 설명",
    "personBAction": "수행·검토·지원 비용 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P2:trial-and-contract-boundary",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P2",
    "address": "CH04.P2",
    "mode": "JOINT",
    "readerQuestion": "다른 기여를 잇는 비용·동의 조건은 무엇인가?",
    "coreMeaning": "실물 검토와 조건 확인을 잇는 경계",
    "roleContributions": [
      {
        "address": "CH04.P2.S1",
        "originalRole": "검증된 보완 또는 다른 장점",
        "knowledge": "A의 작동 관찰과 B의 기준 확인은 서로 다른 정보",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "각 원천은 기술 자격·법률 검토의 대체가 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S3",
        "originalRole": "도움의 장면",
        "knowledge": "가상: 시험 결과와 유료 제공의 보증 범위를 나눔",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P2.S4",
        "originalRole": "좋은 차이의 경계",
        "knowledge": "작동한 부분·미시험 부분·약속할 수 없는 범위를 확인",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "c0fbe9a4b01f0f51c46b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "b64fa2920704301bf622",
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
        "id": "sar:facet:PRACTICALITY:use-test",
        "axis": "PRACTICALITY",
        "definition": "실제 사용 환경에서 작동 여부를 확인",
        "condition": "사용 목적과 사용자가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "trial",
    "workFunctions": [
      "test",
      "contract"
    ],
    "outputType": "trial_boundary",
    "positive": "과도한 고객 약속을 줄일 여지",
    "risk": "시연이 된 것을 계약 이행 가능으로 확대",
    "factBomb": "한 번 작동한 결과가 모든 사용 조건의 보증은 아니다",
    "twist": "계약 전에 드러난 한계가 더 정확한 시험을 만들 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 제한된 시범 제공 조건을 작성",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "시험 조건·한계 공개",
      "personB": "수락·보증·추가 검토 질문"
    },
    "counterexample": "법적 의무·안전 검증은 임의 면제 불가",
    "distinctFromOtherParagraphs": "보완을 전문 자격 대신 경계 정보로 한정",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P2:trial-and-contract-boundary",
          "sourceKeys": [
            "c0fbe9a4b01f0f51c46b",
            "b64fa2920704301bf622",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTP",
              "sourceKey": "c0fbe9a4b01f0f51c46b"
            },
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
          "owner": "A",
          "type": "ISTP",
          "sourceKey": "c0fbe9a4b01f0f51c46b",
          "domain": "THINKING"
        },
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
      "firstFactCheck": "가상: 제한된 시범 제공 조건을 작성",
      "aChange": "시험 조건·한계 공개",
      "bChange": "수락·보증·추가 검토 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "trial_boundary",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시험·보증·유지·보완 비용의 주체 미확인",
    "additionalBusinessInfo": [
      "test_limits",
      "customer_terms",
      "verification"
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
      "kind": "trial_terms",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "시험 결과 중 어디까지 고객에게 약속할 수 있나요?"
    },
    "personAAction": "시험 조건·한계 공개",
    "personBAction": "수락·보증·추가 검토 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P3:customer-signal-product-adjustment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "mode": "JOINT",
    "readerQuestion": "좋은 공동 장면에서 각자 무엇을 제공하는가?",
    "coreMeaning": "고객 신호를 제품 가정으로 되돌리는 협업",
    "roleContributions": [
      {
        "address": "CH04.P3.S1",
        "originalRole": "관계별 상황",
        "knowledge": "가상: 반복 문의를 단순 친절 응답과 제품 문제로 나눔",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S2",
        "originalRole": "A의 기여",
        "knowledge": "A는 관찰한 반응의 범위·빈도를 제시할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S3",
        "originalRole": "B의 기여",
        "knowledge": "B는 가능한 원인·수정 가설을 따로 검토할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S4",
        "originalRole": "함께 얻는 결과",
        "knowledge": "공동 결과는 해결 여부를 확인할 질문이며 매출 예측이 아님",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "e08ef500cdb091985a2e",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "0ba71def5f7dd66a4424",
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
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "customer_review",
    "workFunctions": [
      "customer",
      "product"
    ],
    "outputType": "feedback_to_trial",
    "positive": "같은 지원 부담을 줄일 가설 발견",
    "risk": "큰 고객 한 명의 요구를 모든 고객의 필요로 일반화",
    "factBomb": "반복 문의를 열심히 처리하는 것과 원인을 줄이는 것은 다르다",
    "twist": "친절한 대응과 제품 수정은 경쟁하는 기여가 아닐 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 지원 문의 뒤 작은 수정안을 시험",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "관찰·빈도·비용 공유",
      "personB": "대안·시험·남은 의문 제시"
    },
    "counterexample": "각자의 고객·개발 역할 고정 금지",
    "distinctFromOtherParagraphs": "공동 장면에서 서로 다른 작업의 연결",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P3:customer-signal-product-adjustment",
          "sourceKeys": [
            "e08ef500cdb091985a2e",
            "0ba71def5f7dd66a4424",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ESFJ",
              "sourceKey": "e08ef500cdb091985a2e"
            },
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "0ba71def5f7dd66a4424"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ESFJ",
          "sourceKey": "e08ef500cdb091985a2e",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "0ba71def5f7dd66a4424",
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
      "firstFactCheck": "가상: 지원 문의 뒤 작은 수정안을 시험",
      "aChange": "관찰·빈도·비용 공유",
      "bChange": "대안·시험·남은 의문 제시",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "feedback_to_trial",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "응답 시간·개발 시간·검증 비용 비교 필요",
    "additionalBusinessInfo": [
      "support_records",
      "change_cost",
      "test_result"
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
      "kind": "product_change",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "문의 대응과 제품 수정 중 무엇을 먼저 시험할까요?"
    },
    "personAAction": "관찰·빈도·비용 공유",
    "personBAction": "대안·시험·남은 의문 제시",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P3:crisis-information-two-views",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P3",
    "address": "CH04.P3",
    "mode": "JOINT",
    "readerQuestion": "좋은 공동 장면에서 각자 무엇을 제공하는가?",
    "coreMeaning": "위기에서 수치 불일치와 실제 작동을 나누는 기여",
    "roleContributions": [
      {
        "address": "CH04.P3.S1",
        "originalRole": "관계별 상황",
        "knowledge": "가상: 품질 문제가 있을 때 원인·영향·미확인을 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S2",
        "originalRole": "A의 기여",
        "knowledge": "A는 자료의 빠진 항목과 약속된 기준을 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S3",
        "originalRole": "B의 기여",
        "knowledge": "B는 재현 조건·우회 방법·확인 범위를 제시",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P3.S4",
        "originalRole": "함께 얻는 결과",
        "knowledge": "함께 확인한 정보도 긴급 권한과 고객 통지는 별도 결정",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "c7fee219fcf7a5b642fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "c0fbe9a4b01f0f51c46b",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:PRECISION:error-detection",
        "axis": "PRECISION",
        "definition": "작은 오류를 기준에 비추어 발견",
        "condition": "검증 기준이 합의된 상황",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "quality",
    "workFunctions": [
      "crisis",
      "quality"
    ],
    "outputType": "incident_scope",
    "positive": "추측 대신 복구 선택지를 좁힐 여지",
    "risk": "문제 해결 중 비용·외부 약속을 숨김",
    "factBomb": "급하다는 이유가 상대가 모르는 지출의 동의가 되지는 않는다",
    "twist": "원인을 모르는 범위를 밝히면 임시 대응을 좁힐 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 납품 전 결함의 영향 범위와 임시 대안을 비교",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확인 자료·약속 기준 제시",
      "personB": "재현·대안·한계 제시"
    },
    "counterexample": "안전·법률 의무는 성향 조율보다 우선",
    "distinctFromOtherParagraphs": "좋은 협업의 위기 정보 구조",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P3:crisis-information-two-views",
          "sourceKeys": [
            "c7fee219fcf7a5b642fd",
            "c0fbe9a4b01f0f51c46b",
            "f64a1b254b8c7a0ebd5e"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "c7fee219fcf7a5b642fd"
            },
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
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "c7fee219fcf7a5b642fd",
          "domain": "THINKING"
        },
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
      "firstFactCheck": "가상: 납품 전 결함의 영향 범위와 임시 대안을 비교",
      "aChange": "확인 자료·약속 기준 제시",
      "bChange": "재현·대안·한계 제시",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "incident_scope",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "복구비·환불 의무·지체 비용 실제 확인 필요",
    "additionalBusinessInfo": [
      "incident_facts",
      "authority",
      "customer_obligation"
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
      "kind": "emergency_temporary",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "지금 임시로 할 일과 다시 동의받을 일은 무엇인가요?"
    },
    "personAAction": "확인 자료·약속 기준 제시",
    "personBAction": "재현·대안·한계 제시",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P4:repeatable-operation-value",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "mode": "JOINT",
    "readerQuestion": "반복 운영·기여 인정은 무엇을 전제로 하는가?",
    "coreMeaning": "반복 운영을 가능하게 하는 경계의 가치",
    "roleContributions": [
      {
        "address": "CH04.P4.S1",
        "originalRole": "가치 있는 특징",
        "knowledge": "기록·추가 작업 경계를 함께 확인하는 가치를 살필 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S2",
        "originalRole": "좋은 관계의 조건",
        "knowledge": "유지에 필요한 실제 시간·비용·수행자가 확인돼야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S3",
        "originalRole": "과사용 위험",
        "knowledge": "친절한 예외가 늘면 기록만으로 과부하가 사라지지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S4",
        "originalRole": "활용 방향",
        "knowledge": "제공 조건을 다시 정할 때 반복 가능성에 활용",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "81c172dd5bbbb1920ae6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "f30fa018d453a0318547",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:PERSISTENCE:repeat-practice",
        "axis": "PERSISTENCE",
        "definition": "정한 연습을 반복",
        "condition": "피드백을 받을 수 있는 과제",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "continuation",
    "workFunctions": [
      "maintenance",
      "value"
    ],
    "outputType": "maintenance_capacity",
    "positive": "보이지 않는 유지 기여를 드러낼 여지",
    "risk": "신규 수주만 성과로 인정",
    "factBomb": "다음 계약이 없어도 오늘 유지해야 할 약속은 남아 있다",
    "twist": "안 받는 주문의 기준이 기존 고객 약속을 지킬 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 반복 지원과 신규 작업의 가용 시간을 비교",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "기존 약속·반복 비용 제시",
      "personB": "추가 요청·작업 한계 제시"
    },
    "counterexample": "반복 수입·실제 안정성 보장 금지",
    "distinctFromOtherParagraphs": "좋은 가치의 반복 운영 조건",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P4:repeatable-operation-value",
          "sourceKeys": [
            "81c172dd5bbbb1920ae6",
            "f30fa018d453a0318547",
            "f64a1b254b8c7a0ebd5e"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "81c172dd5bbbb1920ae6"
            },
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
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "81c172dd5bbbb1920ae6",
          "domain": "MONEY"
        },
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
      "firstFactCheck": "가상: 반복 지원과 신규 작업의 가용 시간을 비교",
      "aChange": "기존 약속·반복 비용 제시",
      "bChange": "추가 요청·작업 한계 제시",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "maintenance_capacity",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "매출 성장과 유지·지원·회수 비용은 별개",
    "additionalBusinessInfo": [
      "ongoing_obligations",
      "capacity",
      "actual_costs"
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
      "kind": "continuation_scope",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "다음 수주 전에 남은 지원을 감당할 수 있나요?"
    },
    "personAAction": "기존 약속·반복 비용 제시",
    "personBAction": "추가 요청·작업 한계 제시",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH04.P4:contribution-recognition-without-shares",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH04",
    "paragraphId": "P4",
    "address": "CH04.P4",
    "mode": "JOINT",
    "readerQuestion": "반복 운영·기여 인정은 무엇을 전제로 하는가?",
    "coreMeaning": "기여를 인정하되 보상·지분을 따로 논의하는 가치",
    "roleContributions": [
      {
        "address": "CH04.P4.S1",
        "originalRole": "가치 있는 특징",
        "knowledge": "관계의 의미와 기준 확인을 공동 기여 대화에 참고",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S2",
        "originalRole": "좋은 관계의 조건",
        "knowledge": "실제 현금·노동·유지·위험 부담을 당사자가 확인해야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S3",
        "originalRole": "과사용 위험",
        "knowledge": "의미 있는 기여라는 칭찬만으로 배분 합의를 대체하면 안 됨",
        "notIndependentFact": true
      },
      {
        "address": "CH04.P4.S4",
        "originalRole": "활용 방향",
        "knowledge": "인정·대가·손익·지분을 별도 의제로 활용",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "fd240bf6e5740f4fe5d6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "b64fa2920704301bf622",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "42cd2d081510f52bb34d",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CARE:need-check",
        "axis": "CARE",
        "definition": "상대가 원하는 도움을 확인",
        "condition": "요청·거절·실제 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "settlement",
    "workFunctions": [
      "contribution",
      "recognition"
    ],
    "outputType": "contribution_review",
    "positive": "가려진 기여를 확인할 여지",
    "risk": "감사 표현을 무급 기여의 동의로 간주",
    "factBomb": "고맙다는 말과 정산을 마쳤다는 말은 다르다",
    "twist": "서로 다른 기여를 같은 단위로 환산하지 않고 인정할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 소개·실행·유지 기여를 구분해 논의",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확인 가능한 기여·부담 제시",
      "personB": "인정과 보상 조건 구분"
    },
    "counterexample": "기여의 법적 평가·비율·가격 결정 금지",
    "distinctFromOtherParagraphs": "공동 가치와 경제 합의의 분리",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH04.P4:contribution-recognition-without-shares",
          "sourceKeys": [
            "fd240bf6e5740f4fe5d6",
            "b64fa2920704301bf622",
            "42cd2d081510f52bb34d"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "fd240bf6e5740f4fe5d6"
            },
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
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "fd240bf6e5740f4fe5d6",
          "domain": "MONEY"
        },
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
      "firstFactCheck": "가상: 소개·실행·유지 기여를 구분해 논의",
      "aChange": "확인 가능한 기여·부담 제시",
      "bChange": "인정과 보상 조건 구분",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "contribution_review",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "출자·보수·손익 배분·지분 가치 혼동 금지",
    "additionalBusinessInfo": [
      "contributions",
      "compensation",
      "equity_terms"
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
      "kind": "compensation_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "인정과 대가·분배를 각각 합의했나요?"
    },
    "personAAction": "확인 가능한 기여·부담 제시",
    "personBAction": "인정과 보상 조건 구분",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  }
];
