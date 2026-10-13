/** Static offline businessPartner research. No runtime registration or customer approval. */
import type { BusinessPartnerMaterial } from "./researchTypes";
export const BP_CH02_MATERIALS: readonly BusinessPartnerMaterial[] = [
  {
    "id": "bppr:material:CH02.P1:a-opportunity-model",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A는 어떤 정보로 기회를 이해하는가?",
    "coreMeaning": "A가 여러 가능성을 사업 가설로 보는 조건",
    "roleContributions": [
      {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "대안·연결을 탐색하는 A의 대표 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "실제 A 원국 편인 정의는 탐색 상징으로만 분리",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "실제 INTP 원천의 가능성 탐색은 시장성·기술력의 증명이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "B와 논의할 때 지금 시험할 가설과 나중에 볼 안을 나눌 필요",
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
        "owner": "A",
        "sourceKey": "78ca1a3776c53c2d0b48",
        "sourceUse": "actual_natal_condition_required",
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
        "id": "sar:facet:CURIOSITY:question-making",
        "axis": "CURIOSITY",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "idea",
    "workFunctions": [
      "opportunity",
      "market"
    ],
    "outputType": "hypothesis_selection",
    "positive": "새 질문을 찾을 여지",
    "risk": "아이디어마다 새 작업·비용을 요구",
    "factBomb": "가설이 늘어나는 속도와 사업이 검증되는 속도는 다르다",
    "twist": "보류할 아이디어를 남기는 것도 현재 안을 돕는 행동일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 여러 기능 중 한 고객 문제만 시험안으로 고름",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가설·필요 정보·시험안을 구분",
      "personB": "검토할 범위·근거를 질문"
    },
    "counterexample": "A 실제 원국·MBTI 없으면 개인화 보류",
    "distinctFromOtherParagraphs": "A의 탐색 출발점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P1:a-opportunity-model",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "78ca1a3776c53c2d0b48",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "A",
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
      "firstFactCheck": "가상: 여러 기능 중 한 고객 문제만 시험안으로 고름",
      "aChange": "가설·필요 정보·시험안을 구분",
      "bChange": "검토할 범위·근거를 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "hypothesis_selection",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "가설별 조사·개발 시간과 시험비는 추정으로 표시",
    "additionalBusinessInfo": [
      "target_customer",
      "trial_cost",
      "available_time"
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
      "question": "이번에 어떤 가설 하나를 확인하나요?"
    },
    "personAAction": "가설·필요 정보·시험안을 구분",
    "personBAction": "검토할 범위·근거를 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P1:a-resource-as-goal",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P1",
    "address": "CH02.P1",
    "mode": "SELF_A",
    "readerQuestion": "A는 어떤 정보로 기회를 이해하는가?",
    "coreMeaning": "A가 자원을 목표 수단으로 보는 조건",
    "roleContributions": [
      {
        "address": "CH02.P1.S1",
        "originalRole": "대표 행동",
        "knowledge": "목표 달성을 위해 자원 배치를 제안하는 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S2",
        "originalRole": "명리 근거",
        "knowledge": "A 실제 편재 정의는 자원 관계이며 실제 재산·수익 역량이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S3",
        "originalRole": "MBTI 선호",
        "knowledge": "ENTJ 원천의 목표 자원 관점과 현금 보유·승인권은 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P1.S4",
        "originalRole": "B와의 관계",
        "knowledge": "B에게 목표·가정·현재 필요한 비용과 남는 의무를 함께 제시",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "66a9cd49cd16d86ca992",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "bbc18a4e615032647a49",
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
        "id": "sar:facet:GOAL_DRIVE:priority-focus",
        "axis": "GOAL_DRIVE",
        "definition": "목적에 따라 우선 과제를 고름",
        "condition": "목표의 실제 소유자·동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "resources",
    "workFunctions": [
      "resources",
      "goal"
    ],
    "outputType": "resource_proposal",
    "positive": "자원 사용의 목적을 드러낼 여지",
    "risk": "목표가 크면 추가 출자도 당연하다고 생각",
    "factBomb": "큰 목표는 상대의 추가 출자 동의를 대신하지 못한다",
    "twist": "목표를 분명히 하면 지금 쓰지 않을 돈도 보일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 확대 목표와 선투입 자원을 나눠 제안",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "기대 가치·자원 가정·대안을 제시",
      "personB": "실제 가용 조건·동의 범위 확인"
    },
    "counterexample": "실제 자산·차입 능력·사업 감각 추정 금지",
    "distinctFromOtherParagraphs": "탐색과 다른 자원 배치의 출발점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P1:a-resource-as-goal",
          "sourceKeys": [
            "66a9cd49cd16d86ca992",
            "bbc18a4e615032647a49",
            "f64a1b254b8c7a0ebd5e"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "66a9cd49cd16d86ca992"
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
          "type": "ENTJ",
          "sourceKey": "66a9cd49cd16d86ca992",
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
      "firstFactCheck": "가상: 확대 목표와 선투입 자원을 나눠 제안",
      "aChange": "기대 가치·자원 가정·대안을 제시",
      "bChange": "실제 가용 조건·동의 범위 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "resource_proposal",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "추가 자금·인력·장비·유지비를 실제 견적과 구분",
    "additionalBusinessInfo": [
      "budget",
      "decision_rights",
      "resource_capacity"
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
      "kind": "resource_commitment",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "목표와 지금 필요한 자원을 나눠 확인할까요?"
    },
    "personAAction": "기대 가치·자원 가정·대안을 제시",
    "personBAction": "실제 가용 조건·동의 범위 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P2:a-record-before-commit",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 시작 전에 확인할 조건은 무엇인가?",
    "coreMeaning": "A가 약속의 범위·정산 기록을 확인하는 이유",
    "roleContributions": [
      {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "금액·기한·책임을 분명히 해야 협의하기 쉬운 조건",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "실제 개인 원천은 선호이며 계약 이행 이력을 입증하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "가상 수주에서 B에게 합의한 범위와 아직 협의 중인 조건을 묻기",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "기록된 조건이 있으면 이후 변경 질문을 구체화할 여지",
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
        "owner": "GUIDANCE",
        "sourceKey": "47598f584969b3d3f879",
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
    "workStage": "contract",
    "workFunctions": [
      "contract",
      "record"
    ],
    "outputType": "agreement_state",
    "positive": "약속의 빈칸을 발견할 가능성",
    "risk": "문서가 있으면 위험도 사라졌다고 생각",
    "factBomb": "서명된 문서도 실제 이행·회수 능력까지 보장하지는 않는다",
    "twist": "기록은 친분을 줄이는 대신 추측을 줄일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 구두 제안과 확정 조건을 별도 표시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 이해·미확정 조건을 기록",
      "personB": "합의 여부·변경 절차 확인"
    },
    "counterexample": "법적 효력·세금·책임은 별도 검토",
    "distinctFromOtherParagraphs": "A에게 필요한 협의 정보의 형태",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P2:a-record-before-commit",
          "sourceKeys": [
            "81c172dd5bbbb1920ae6",
            "47598f584969b3d3f879"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "81c172dd5bbbb1920ae6"
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
      "firstFactCheck": "가상: 구두 제안과 확정 조건을 별도 표시",
      "aChange": "자기 이해·미확정 조건을 기록",
      "bChange": "합의 여부·변경 절차 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "agreement_state",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "납기·대금·추가 작업 비용을 분리해 확인",
    "additionalBusinessInfo": [
      "contract_scope",
      "payment_terms",
      "change_procedure"
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
      "question": "이미 합의한 조건과 아직 논의 중인 조건은 무엇인가요?"
    },
    "personAAction": "자기 이해·미확정 조건을 기록",
    "personBAction": "합의 여부·변경 절차 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P2:a-meaning-and-finance",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P2",
    "address": "CH02.P2",
    "mode": "SELF_A",
    "readerQuestion": "A가 시작 전에 확인할 조건은 무엇인가?",
    "coreMeaning": "A의 사업 명분과 경제 조건을 구분",
    "roleContributions": [
      {
        "address": "CH02.P2.S1",
        "originalRole": "관계 조건",
        "knowledge": "의미 있는 일에 자원을 쓰고 싶어 하는 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S2",
        "originalRole": "실제 이유",
        "knowledge": "실제 ENFJ 원천의 가치 지향은 수익성·선행 이력 증거가 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S3",
        "originalRole": "B와의 장면",
        "knowledge": "B와 고객에게 줄 가치·사업 유지에 필요한 수입을 따로 논의",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P2.S4",
        "originalRole": "충족될 때",
        "knowledge": "명분과 비용·현금 조건이 모두 보이면 동의 범위를 정하기 쉬움",
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
        "owner": "GUIDANCE",
        "sourceKey": "52e29256ddea72aefa88",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "offer",
    "workFunctions": [
      "purpose",
      "profit"
    ],
    "outputType": "value_economics",
    "positive": "사업 목적을 선명히 할 여지",
    "risk": "좋은 목적이면 비용을 따질 필요 없다고 함",
    "factBomb": "의미 있는 사업도 공급자에게 낼 돈은 필요하다",
    "twist": "비용 질문이 명분에 대한 반대가 아닐 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 사회적 가치와 유료 제공 범위를 나눠 검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가치 목표와 운영 가정을 구분",
      "personB": "실제 비용·지원·가격 조건 확인"
    },
    "counterexample": "기부·투자·출자·대가를 자동 같은 것으로 취급 금지",
    "distinctFromOtherParagraphs": "문서 선호와 다른 명분·지속 조건",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P2:a-meaning-and-finance",
          "sourceKeys": [
            "fd240bf6e5740f4fe5d6",
            "52e29256ddea72aefa88"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "fd240bf6e5740f4fe5d6"
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
      "firstFactCheck": "가상: 사회적 가치와 유료 제공 범위를 나눠 검토",
      "aChange": "가치 목표와 운영 가정을 구분",
      "bChange": "실제 비용·지원·가격 조건 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "value_economics",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "무료 제공 범위·기회비용·반복 운영비를 별도 확인",
    "additionalBusinessInfo": [
      "offer_scope",
      "operating_costs",
      "revenue_model"
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
      "kind": "offer_definition",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "좋은 목적과 운영을 지속할 비용 조건을 나눠 볼까요?"
    },
    "personAAction": "가치 목표와 운영 가정을 구분",
    "personBAction": "실제 비용·지원·가격 조건 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P3:a-small-working-test",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A의 강점이 사업 질문에 도움이 될 조건은 무엇인가?",
    "coreMeaning": "A가 실제 작동을 확인하는 강점 후보",
    "roleContributions": [
      {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "설명보다 작은 시험으로 검토하려는 특징",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "실제 A 원천의 시도 선호는 제작 능력·매출 실증이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "B가 논의하던 가설을 제한된 시험 결과로 함께 볼 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "시험 범위·관찰 항목·중단·외부 약속을 정해야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "932f48a511820a551fae",
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
      "execution"
    ],
    "outputType": "working_trial",
    "positive": "논의에 실제 관찰을 더할 가능성",
    "risk": "잘 작동한 시제품을 시장 수요로 확정",
    "factBomb": "작동하는 제품과 돈을 내고 선택하는 고객은 별개의 검증이다",
    "twist": "작은 실패가 큰 약속 전에 필요한 정보일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 고객 계약 전 제한된 시제품 검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "시험할 기능·관찰·한계를 명시",
      "personB": "결과가 증명한 것·미확인을 구분"
    },
    "counterexample": "안전·자격·권리 조건 없는 실제 시험 권유 금지",
    "distinctFromOtherParagraphs": "A의 강점 중 검증을 위한 실행",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P3:a-small-working-test",
          "sourceKeys": [
            "932f48a511820a551fae",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTP",
              "sourceKey": "932f48a511820a551fae"
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
          "sourceKey": "932f48a511820a551fae",
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
      "firstFactCheck": "가상: 고객 계약 전 제한된 시제품 검토",
      "aChange": "시험할 기능·관찰·한계를 명시",
      "bChange": "결과가 증명한 것·미확인을 구분",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "working_trial",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시험비·작업 시간·되돌릴 수 없는 지출을 확인",
    "additionalBusinessInfo": [
      "test_scope",
      "safety_requirements",
      "trial_budget"
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
      "question": "이번 시험으로 무엇을 알 수 있고 무엇은 아직 모르나요?"
    },
    "personAAction": "시험할 기능·관찰·한계를 명시",
    "personBAction": "결과가 증명한 것·미확인을 구분",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P3:a-correct-assumptions",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P3",
    "address": "CH02.P3",
    "mode": "SELF_A",
    "readerQuestion": "A의 강점이 사업 질문에 도움이 될 조건은 무엇인가?",
    "coreMeaning": "A가 오류를 알면 기존 판단을 고칠 여지",
    "roleContributions": [
      {
        "address": "CH02.P3.S1",
        "originalRole": "특징적 강점",
        "knowledge": "잘못을 바로잡으려는 독립적 강점 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S2",
        "originalRole": "실제 근거",
        "knowledge": "A 실제 원천과 실제 사업 판단의 옳고 그름은 구별; 개인 Fusion C002는 같은 A의 실제 명리·MBTI 두 root·축·허용 context 확인 전 보류",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S3",
        "originalRole": "B에게 좋은 상황",
        "knowledge": "B가 예상과 다른 비용·수요 자료를 제시하면 이전 가정을 수정할 수 있음; 오류 수정과 원인 검토는 별도 질문",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P3.S4",
        "originalRole": "유지 조건",
        "knowledge": "수정 근거·영향·외부 약속을 함께 기록해야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "76d4c68e32d1662f8abf",
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
        "owner": "A",
        "sourceKey": "bfcb541ba28cf9dd0cce",
        "sourceUse": "both_same_person_roots_required",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:LEARNING:acquisition",
        "axis": "LEARNING",
        "definition": "새 내용을 이해하고 익힘",
        "condition": "연습·피드백 기회가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "customer_review",
    "workFunctions": [
      "review",
      "assumptions"
    ],
    "outputType": "assumption_update",
    "positive": "계획을 최신 정보에 맞출 가능성",
    "risk": "기존 결정을 지키기 위해 반례를 제외",
    "factBomb": "계획을 바꾸는 것이 곧 약속을 가볍게 여기는 것은 아니다",
    "twist": "잘못된 가정을 남기지 않는 것이 책임을 지키는 방식일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 시험 자료가 예상 수요와 달라 다음 범위를 수정",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가정 변화·추가 의무·다음 판단을 기록",
      "personB": "관찰과 해석·대안을 구분"
    },
    "counterexample": "실제 손실·과거 실패를 만들어내지 않음",
    "distinctFromOtherParagraphs": "시험 실행과 다른 가정 수정의 강점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P3:a-correct-assumptions",
          "sourceKeys": [
            "76d4c68e32d1662f8abf",
            "f64a1b254b8c7a0ebd5e",
            "bfcb541ba28cf9dd0cce"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "76d4c68e32d1662f8abf"
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
          "sourceKey": "76d4c68e32d1662f8abf",
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
      "firstFactCheck": "가상: 시험 자료가 예상 수요와 달라 다음 범위를 수정",
      "aChange": "가정 변화·추가 의무·다음 판단을 기록",
      "bChange": "관찰과 해석·대안을 구분",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "assumption_update",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "예상·실제 차이와 앞으로 필요한 비용을 분리",
    "additionalBusinessInfo": [
      "actual_results",
      "forecast",
      "external_obligations"
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
      "question": "현재 자료가 바꾸는 가정은 무엇인가요?"
    },
    "personAAction": "가정 변화·추가 의무·다음 판단을 기록",
    "personBAction": "관찰과 해석·대안을 구분",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P4:a-theory-without-demand",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A의 서두름·과검토는 어떤 부담을 남기는가?",
    "coreMeaning": "완성도 높은 설명이 고객 근거를 대신하는 위험",
    "roleContributions": [
      {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "A가 정교한 논리에 끌릴 때 현실 검증이 늦을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "실제 원천은 조건부 경향이며 투자 실력·실제 실패를 판정하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "B에게는 자료를 더 보자는 말이 종료 시점 없는 작업으로 남을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "지금 결정에 필요한 근거·반례·검토 종료 조건을 좁힘",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "1f7d00a7995b32bad2b3",
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
        "id": "sar:facet:DEPTH:cause-tracing",
        "axis": "DEPTH",
        "definition": "표면 결과 뒤의 과정을 탐색",
        "condition": "실제 과정 정보가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "market",
    "workFunctions": [
      "overanalysis",
      "demand"
    ],
    "outputType": "analysis_stop",
    "positive": "분석을 실제 질문에 연결할 여지",
    "risk": "이론의 빈틈만 메우고 구매 조건은 미확인",
    "factBomb": "설명이 아름다워도 대금이 들어오는 것은 아니다",
    "twist": "분석을 줄이기보다 검증할 질문을 바꾸는 것이 필요할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 자료 조사 종료 전에 확인할 고객 질문을 지정",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가설별 필요한 증거·종료 조건 제시",
      "personB": "현재 결정·미확인 수요 질문"
    },
    "counterexample": "유형으로 실제 시장 실패·수입 예측 금지",
    "distinctFromOtherParagraphs": "A의 분석 과용 비용",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P4:a-theory-without-demand",
          "sourceKeys": [
            "1f7d00a7995b32bad2b3",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "1f7d00a7995b32bad2b3"
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
          "sourceKey": "1f7d00a7995b32bad2b3",
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
      "firstFactCheck": "가상: 자료 조사 종료 전에 확인할 고객 질문을 지정",
      "aChange": "가설별 필요한 증거·종료 조건 제시",
      "bChange": "현재 결정·미확인 수요 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "analysis_stop",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "조사·개발 시간의 기회비용과 추가 시험비 확인",
    "additionalBusinessInfo": [
      "validation_question",
      "review_deadline",
      "trial_cost"
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
      "question": "어떤 자료가 있어야 분석을 닫고 다음을 결정하나요?"
    },
    "personAAction": "가설별 필요한 증거·종료 조건 제시",
    "personBAction": "현재 결정·미확인 수요 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH02.P4:a-support-becomes-funding",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH02",
    "paragraphId": "P4",
    "address": "CH02.P4",
    "mode": "SELF_A",
    "readerQuestion": "A의 서두름·과검토는 어떤 부담을 남기는가?",
    "coreMeaning": "상대 가능성 지원과 출자 약속을 섞는 위험",
    "roleContributions": [
      {
        "address": "CH02.P4.S1",
        "originalRole": "과사용 위험",
        "knowledge": "A가 시간·돈·연결을 함께 지원하려 할 때 범위가 흐려질 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S2",
        "originalRole": "원인",
        "knowledge": "개인 원천의 지원 선호가 실제 재산·투자 적합성을 뜻하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S3",
        "originalRole": "B가 받는 뜻",
        "knowledge": "B는 응원·대여·출자·대가 중 어떤 약속인지 다르게 이해할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH02.P4.S4",
        "originalRole": "조절 행동",
        "knowledge": "지원 형태·회수 기대·권한·거절 가능한 범위를 따로 확인",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "c3e0328ac10371fa55ab",
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
    "workStage": "resources",
    "workFunctions": [
      "support",
      "contribution"
    ],
    "outputType": "support_form",
    "positive": "기여를 명확히 남길 여지",
    "risk": "도움 이후 지분·결정권을 자동 요구",
    "factBomb": "도왔다는 마음만으로 상대의 지분이 정해지지는 않는다",
    "twist": "지원 형태를 정하는 일이 관계의 따뜻함을 지킬 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 초기 장비 제공을 선물·대여·출자 중 무엇으로 볼지 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 지원 형태·조건을 명시",
      "personB": "사용·회수·권한 조건을 질문"
    },
    "counterexample": "법적 출자 유형·개별 반환 책임은 전문 검토",
    "distinctFromOtherParagraphs": "분석 과용과 다른 지원·자본 경계",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH02.P4:a-support-becomes-funding",
          "sourceKeys": [
            "c3e0328ac10371fa55ab",
            "42cd2d081510f52bb34d"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "c3e0328ac10371fa55ab"
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
          "sourceKey": "c3e0328ac10371fa55ab",
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
      "firstFactCheck": "가상: 초기 장비 제공을 선물·대여·출자 중 무엇으로 볼지 확인",
      "aChange": "자기 지원 형태·조건을 명시",
      "bChange": "사용·회수·권한 조건을 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "support_form",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "자금·장비·시간 제공과 실제 회수 부담은 UNKNOWN",
    "additionalBusinessInfo": [
      "contribution_form",
      "ownership",
      "return_terms"
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
      "kind": "contribution_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "이 지원은 어떤 형태와 조건의 약속인가요?"
    },
    "personAAction": "자기 지원 형태·조건을 명시",
    "personBAction": "사용·회수·권한 조건을 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  }
];
