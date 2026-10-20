/** Static offline businessPartner research. No runtime registration or customer approval. */
import type { BusinessPartnerMaterial } from "./researchTypes";
export const BP_CH05_MATERIALS: readonly BusinessPartnerMaterial[] = [
  {
    "id": "bppr:material:CH05.P1:a-alternative-b-standard",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B 수신 십성과 A의 제안은 무엇이 다른가?",
    "coreMeaning": "A의 새 선택지를 B가 기준 질문으로 받는 방향",
    "roleContributions": [
      {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "실제 A→B 방향 근거가 있을 때만 출발",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "정관 정의는 B 일간을 기준으로 A를 본 관계이며 B의 승인권이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "A의 대안 제안이 B에게 수행 기준·고객 조건 질문을 남길 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "B가 제안을 거절했다거나 실제 사업이 있다고 단정하지 않음",
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
        "owner": "DIRECTION_AB",
        "sourceKey": "ce1defc1af72408fec4a",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:CHANGE_ORIENTATION:preserve-value",
        "axis": "CHANGE_ORIENTATION",
        "definition": "유지할 이유를 선택적으로 확인",
        "condition": "유지 효과의 실제 자료가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "opportunity",
    "workFunctions": [
      "opportunity",
      "decision"
    ],
    "outputType": "opportunity_question",
    "positive": "새 문제와 기준을 함께 찾을 여지",
    "risk": "A의 관심을 B의 검토 의무로 만듦",
    "factBomb": "가능성을 꺼낸 사람이 검토 비용을 상대에게 자동 넘길 수는 없다",
    "twist": "기준 질문은 기회를 없애는 반응이 아닐 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: A가 새 고객 문제 가설을 제안",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "문제·가정·필요 검토량 설명",
      "personB": "실행 조건·미확인 질문"
    },
    "counterexample": "실제 방향 십성·각자 유형·사업 맥락 없으면 보류",
    "distinctFromOtherParagraphs": "A 제안을 B가 받는 조건",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P1:a-alternative-b-standard",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "60699f5629066c047ea1",
            "ce1defc1af72408fec4a",
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
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: A가 새 고객 문제 가설을 제안",
      "aChange": "문제·가정·필요 검토량 설명",
      "bChange": "실행 조건·미확인 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "opportunity_question",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "조사·시간·기존 약속의 비용 확인",
    "additionalBusinessInfo": [
      "customer_problem",
      "review_cost",
      "current_obligations"
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
      "kind": "opportunity_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "새 기회를 검토할 비용과 다음 결정은 무엇인가요?"
    },
    "personAAction": "문제·가정·필요 검토량 설명",
    "personBAction": "실행 조건·미확인 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P1:a-resource-b-obligation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P1",
    "address": "CH05.P1",
    "mode": "AB",
    "readerQuestion": "B 수신 십성과 A의 제안은 무엇이 다른가?",
    "coreMeaning": "A의 자원 제안을 B가 의무 범위로 받는 방향",
    "roleContributions": [
      {
        "address": "CH05.P1.S1",
        "originalRole": "A→B 영향",
        "knowledge": "A→B 실제 방향을 개인 재산 정보와 분리",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "편재는 방향 관계의 전통적 자원 상징이며 공동 자산·수익이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S3",
        "originalRole": "구체적 행동",
        "knowledge": "A가 투입할 수 있다고 말한 자원에 B는 대가·관리·상환 질문을 할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P1.S4",
        "originalRole": "B에게 남는 의미",
        "knowledge": "제안·출자·대여·사용 허락을 확인 전 동일하게 취급하지 않음",
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
        "owner": "B",
        "sourceKey": "b64fa2920704301bf622",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:RESOURCE_SENSE:flow-account",
        "axis": "RESOURCE_SENSE",
        "definition": "자원 유입과 소모를 구분",
        "condition": "실제 돈·시간 자료가 주어질 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "resources",
    "workFunctions": [
      "capital",
      "consent"
    ],
    "outputType": "resource_terms",
    "positive": "자원 종류와 책임을 드러낼 여지",
    "risk": "자원을 냈다는 이유로 모든 결정권 요구",
    "factBomb": "돈을 보태는 방식과 모든 일의 최종 결정권은 같은 질문이 아니다",
    "twist": "투입을 미루는 것이 책임을 명확하게 할 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 장비 제공과 현금 투입 조건을 구분",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자원 종류·조건 공개",
      "personB": "권리·유지·반환 조건 질문"
    },
    "counterexample": "실제 자산·상환 능력·권한 추정 금지",
    "distinctFromOtherParagraphs": "A의 제안이 B에게 만드는 경제 조건",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P1:a-resource-b-obligation",
          "sourceKeys": [
            "66a9cd49cd16d86ca992",
            "b64fa2920704301bf622",
            "bbc18a4e615032647a49",
            "42cd2d081510f52bb34d"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "66a9cd49cd16d86ca992"
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
          "type": "ENTJ",
          "sourceKey": "66a9cd49cd16d86ca992",
          "domain": "MONEY"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "b64fa2920704301bf622",
          "domain": "MONEY"
        }
      ],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 장비 제공과 현금 투입 조건을 구분",
      "aChange": "자원 종류·조건 공개",
      "bChange": "권리·유지·반환 조건 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "resource_terms",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "자원 가치·유지비·반환·손실 부담 별도",
    "additionalBusinessInfo": [
      "contribution_form",
      "ownership",
      "liability_terms"
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
      "kind": "resource_acceptance",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "제공하는 것은 출자·대여·사용 허락 중 무엇인가요?"
    },
    "personAAction": "자원 종류·조건 공개",
    "personBAction": "권리·유지·반환 조건 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P2:a-prototype-b-service-cost",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 기여가 B에게 도움 될 조건은 무엇인가?",
    "coreMeaning": "A의 실제 시험이 B의 제공 조건을 도울 가능성",
    "roleContributions": [
      {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "작은 시연이 B에게 확인 가능한 범위를 줄 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "실제 식신 방향·각자 원천이 있어도 품질·매출 보장은 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상: 작동 결과를 반복 제공·고객 지원 질문과 연결",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "B가 필요한 기준을 밝히고 A가 시험의 한계를 보여야 함",
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
        "sourceKey": "60699f5629066c047ea1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "recipient_direction_definition",
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
      "trial",
      "delivery"
    ],
    "outputType": "trial_to_offer",
    "positive": "판매 전 제공 가능 범위를 좁힐 여지",
    "risk": "작동 결과를 B의 무제한 지원 의무로 넘김",
    "factBomb": "만든 사람의 완료와 고객을 받는 사람의 완료는 다를 수 있다",
    "twist": "시연의 한계를 밝히면 판매 조건을 더 선명하게 만들 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 시험 결과와 지원 제외 항목을 정리",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "시험 조건·한계 제시",
      "personB": "지원·납기·반복 운영 질문"
    },
    "counterexample": "실제 기술·고객 서비스 역할 고정 금지",
    "distinctFromOtherParagraphs": "A의 산출이 B에게 주는 확인 자료",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P2:a-prototype-b-service-cost",
          "sourceKeys": [
            "c0fbe9a4b01f0f51c46b",
            "60699f5629066c047ea1",
            "90e77590d3ea07930ba1",
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
          "type": "ISTP",
          "sourceKey": "c0fbe9a4b01f0f51c46b",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "60699f5629066c047ea1",
          "domain": "WORK"
        }
      ],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 시험 결과와 지원 제외 항목을 정리",
      "aChange": "시험 조건·한계 제시",
      "bChange": "지원·납기·반복 운영 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "trial_to_offer",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시제품 비용과 운영·지원 비용 분리",
    "additionalBusinessInfo": [
      "trial_result",
      "service_scope",
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
      "kind": "offer_conditions",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "B가 제공 조건을 확인할 수 있도록 무엇을 보여줄까요?"
    },
    "personAAction": "시험 조건·한계 제시",
    "personBAction": "지원·납기·반복 운영 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P2:a-meaning-b-allocation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P2",
    "address": "CH05.P2",
    "mode": "AB",
    "readerQuestion": "A의 기여가 B에게 도움 될 조건은 무엇인가?",
    "coreMeaning": "A의 가치 설명이 B의 배분 질문을 돕는 조건",
    "roleContributions": [
      {
        "address": "CH05.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "기여의 의미를 말하면 보이지 않는 작업을 발견할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S2",
        "originalRole": "실제 근거",
        "knowledge": "정인 방향 정의는 지원 상징이며 실제 감사·보상 의무가 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상: 소개·고객 대응·유지 작업을 함께 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "B에게 의미를 인정하라고 강요하기보다 실제 기여·대가를 구분",
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
        "owner": "DIRECTION_AB",
        "sourceKey": "fe11b875c7ad3a9c8318",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:MEANING:value-articulation",
        "axis": "MEANING",
        "definition": "자기에게 중요한 이유를 말함",
        "condition": "본인이 밝힌 가치가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "settlement",
    "workFunctions": [
      "recognition",
      "distribution"
    ],
    "outputType": "recognition_to_terms",
    "positive": "경제 합의 밖의 누락 기여를 확인할 여지",
    "risk": "좋은 뜻을 근거로 정산 질문을 막음",
    "factBomb": "가치 있는 일을 했다는 말이 비용 자료를 대신하지는 않는다",
    "twist": "정산을 묻는 것이 기여의 의미를 부정하는 것은 아니다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 감사 표현과 실제 정산 의제를 나눔",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "기여·부담·가치 설명",
      "personB": "확인 기록·배분 기준 질문"
    },
    "counterexample": "실제 배분 비율·세금·법률 판단 금지",
    "distinctFromOtherParagraphs": "A의 인정이 B의 확인에 주는 정보",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P2:a-meaning-b-allocation",
          "sourceKeys": [
            "fd240bf6e5740f4fe5d6",
            "b64fa2920704301bf622",
            "fe11b875c7ad3a9c8318",
            "51ae3a3317baa66901c0"
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
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 감사 표현과 실제 정산 의제를 나눔",
      "aChange": "기여·부담·가치 설명",
      "bChange": "확인 기록·배분 기준 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "recognition_to_terms",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "보수·비용 정산·이익 배분·출자 반환은 별개",
    "additionalBusinessInfo": [
      "contribution_record",
      "allocation_terms",
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
      "kind": "settlement_scope",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "기여의 의미와 합의한 대가를 따로 확인할까요?"
    },
    "personAAction": "기여·부담·가치 설명",
    "personBAction": "확인 기록·배분 기준 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P3:a-client-promise-b-cost",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 약속·확장이 B에게 남길 비용은 무엇인가?",
    "coreMeaning": "A의 고객 반응 대응이 B에게 남기는 추가 작업",
    "roleContributions": [
      {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "A의 약속이 B에게 작업 범위 확대로 도착할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "실제 양쪽 원천·방향 정의를 다른 역할·권한으로 바꾸지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "A의 친절한 의도와 B의 시간·납기 영향은 다를 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "확정 전 확인 통로가 없고 수정이 반복되면 부담이 커질 수 있음",
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
        "sourceKey": "f30fa018d453a0318547",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "6047f491aa9082328a86",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:EXPRESSION:channel-choice",
        "axis": "EXPRESSION",
        "definition": "뜻에 맞는 말·글·행동을 선택",
        "condition": "상대가 전달 통로에 접근할 수 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "proposal",
    "workFunctions": [
      "customer_promise",
      "scope"
    ],
    "outputType": "promise_impact",
    "positive": "고객 가치와 수행 범위를 함께 확인할 여지",
    "risk": "상대 미동의 작업을 외부에 먼저 약속",
    "factBomb": "고객에게 한마디 더 해준 약속이 상대에게 며칠의 일이 될 수 있다",
    "twist": "추가 약속을 보류하는 것이 기존 약속을 지키는 선택일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: A의 추가 수정 약속이 B 작업에 영향을 줌",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "약속 전 범위·기한 확인",
      "personB": "추가 작업·대가·동의 범위 설명"
    },
    "counterexample": "실제 고객·피해·반복 이력 생성 금지",
    "distinctFromOtherParagraphs": "A의 외부 약속과 B의 실행 부담",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P3:a-client-promise-b-cost",
          "sourceKeys": [
            "e08ef500cdb091985a2e",
            "f30fa018d453a0318547",
            "6047f491aa9082328a86",
            "5b95f1a5a0504d2d0869"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ESFJ",
              "sourceKey": "e08ef500cdb091985a2e"
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
          "type": "ESFJ",
          "sourceKey": "e08ef500cdb091985a2e",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "f30fa018d453a0318547",
          "domain": "MONEY"
        }
      ],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: A의 추가 수정 약속이 B 작업에 영향을 줌",
      "aChange": "약속 전 범위·기한 확인",
      "bChange": "추가 작업·대가·동의 범위 설명",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "promise_impact",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "추가 수정·외주·지체 비용 실제 확인",
    "additionalBusinessInfo": [
      "customer_terms",
      "scope_change",
      "consent"
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
      "question": "외부 약속 전에 상대의 수행 동의를 확인했나요?"
    },
    "personAAction": "약속 전 범위·기한 확인",
    "personBAction": "추가 작업·대가·동의 범위 설명",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P3:a-expand-b-cash-timing",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P3",
    "address": "CH05.P3",
    "mode": "AB",
    "readerQuestion": "A의 약속·확장이 B에게 남길 비용은 무엇인가?",
    "coreMeaning": "A의 확장 제안이 B에게 지급 시점 위험으로 도착",
    "roleContributions": [
      {
        "address": "CH05.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "새 자원 투입 제안이 B에게 현금 시점 확인을 남길 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "편재 방향과 실제 현금흐름 자료는 별개",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "A의 목표 의도와 B가 보려는 지급 의무는 다른 정보",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "계약 예상액만 있고 입금·지출 시점이 없으면 부담 커질 수 있음",
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
        "owner": "B",
        "sourceKey": "c7fee219fcf7a5b642fd",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:EXPANSION:scope-extension",
        "axis": "EXPANSION",
        "definition": "같은 기능의 적용 범위를 넓힘",
        "condition": "새 대상의 요구가 실제 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "continuation",
    "workFunctions": [
      "expansion",
      "cash_flow"
    ],
    "outputType": "expansion_timing",
    "positive": "확장의 실행 조건을 드러낼 여지",
    "risk": "B의 질문을 기회 회피로 단정",
    "factBomb": "매출 전망이 좋아도 이번 달 지급할 돈이 있다는 뜻은 아니다",
    "twist": "현금 질문이 확장 반대보다 규모 조정으로 이어질 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 수주 확대안과 선지급 비용을 비교",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확장 가정·결정 필요 제시",
      "personB": "지급·회수·미확인 자료 질문"
    },
    "counterexample": "실제 잔고·부채·투자 적합성 추정 금지",
    "distinctFromOtherParagraphs": "A의 자원 방향과 B의 유동성 질문",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P3:a-expand-b-cash-timing",
          "sourceKeys": [
            "66a9cd49cd16d86ca992",
            "c7fee219fcf7a5b642fd",
            "bbc18a4e615032647a49",
            "24c9a0e7e3707d4f1f00"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "66a9cd49cd16d86ca992"
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
          "type": "ENTJ",
          "sourceKey": "66a9cd49cd16d86ca992",
          "domain": "MONEY"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "c7fee219fcf7a5b642fd",
          "domain": "THINKING"
        }
      ],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 수주 확대안과 선지급 비용을 비교",
      "aChange": "확장 가정·결정 필요 제시",
      "bChange": "지급·회수·미확인 자료 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "expansion_timing",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "계약액·청구·입금·지급 의무 시점 분리",
    "additionalBusinessInfo": [
      "cash_timing",
      "payment_obligations",
      "receipts"
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
      "kind": "expansion_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "회수 전에 지출할 비용을 확인했나요?"
    },
    "personAAction": "확장 가정·결정 필요 제시",
    "personBAction": "지급·회수·미확인 자료 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P4:a-change-small-safe-trial",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A는 변경·위험 동의를 어떻게 확인하는가?",
    "coreMeaning": "A의 운영 변경을 B의 작은 시험으로 확인",
    "roleContributions": [
      {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 변경 이유·가정·원복 가능한 범위를 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B는 실행 순서·고객 영향·유지 비용을 확인할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "가상: 기존 제공을 지키며 제한된 범위에서 변경을 시험",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "실제 방향 근거가 있어도 비용·권한 동의 없으면 보류",
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
        "owner": "DIRECTION_AB",
        "sourceKey": "78ca1a3776c53c2d0b48",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "trial",
    "workFunctions": [
      "change",
      "trial"
    ],
    "outputType": "bounded_change",
    "positive": "새 방식의 확인 범위를 좁힐 여지",
    "risk": "새 아이디어를 운영 전체 변경으로 바로 시행",
    "factBomb": "생각을 바꿨다는 이유로 이미 한 약속이 사라지지는 않는다",
    "twist": "작게 바꾸면 다른 의견도 실제 자료로 만날 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 일부 내부 과정만 시험하고 재검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "변경·시험·원복 기준 제시",
      "personB": "수행·고객·유지 영향 질문"
    },
    "counterexample": "법정·안전 검증을 작은 시험으로 우회 금지",
    "distinctFromOtherParagraphs": "A의 변화 제안이 B와 확인할 절차",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P4:a-change-small-safe-trial",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "60699f5629066c047ea1",
            "78ca1a3776c53c2d0b48",
            "f64a1b254b8c7a0ebd5e"
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
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 일부 내부 과정만 시험하고 재검토",
      "aChange": "변경·시험·원복 기준 제시",
      "bChange": "수행·고객·유지 영향 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "bounded_change",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "시험 비용·기존 약속·원복 비용 확인",
    "additionalBusinessInfo": [
      "test_scope",
      "change_authority",
      "review_date"
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
      "kind": "trial_consent",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "어떤 범위만 시험하고 언제 다시 결정할까요?"
    },
    "personAAction": "변경·시험·원복 기준 제시",
    "personBAction": "수행·고객·유지 영향 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH05.P4:a-risk-disclosure-before-consent",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH05",
    "paragraphId": "P4",
    "address": "CH05.P4",
    "mode": "AB",
    "readerQuestion": "A는 변경·위험 동의를 어떻게 확인하는가?",
    "coreMeaning": "A가 위험을 설명하고 B의 동의를 따로 확인",
    "roleContributions": [
      {
        "address": "CH05.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "A는 미확인 위험·부담·선택 가능한 보류를 제시",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S2",
        "originalRole": "B의 필요",
        "knowledge": "B는 신뢰·호감과 실제 수락 범위를 나눠 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "가상: 손실 범위·추가 출자·중단 조건을 별도로 논의",
        "notIndependentFact": true
      },
      {
        "address": "CH05.P4.S4",
        "originalRole": "A→B 가능성",
        "knowledge": "실제 편관 방향을 강압·권리 부여로 사용하지 않음",
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
        "sourceKey": "6256f57a0be573a6725a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_AB",
        "sourceKey": "f8f90022e047bfe61557",
        "sourceUse": "recipient_direction_definition",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "contract",
    "workFunctions": [
      "risk",
      "consent"
    ],
    "outputType": "risk_consent",
    "positive": "서로 다른 위험 이해를 드러낼 여지",
    "risk": "동의 질문 없이 자료 전달만으로 합의 확정",
    "factBomb": "설명 자료를 보냈다는 사실만으로 상대가 위험을 수락한 것은 아니다",
    "twist": "거절할 수 있어야 동의의 범위를 알 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 검토 뒤 보류 항목을 명시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "위험·선택·미확정 공개",
      "personB": "이해·질문·동의 범위 확인"
    },
    "counterexample": "강요·착취·불법 의심 시 협의 지속 강요 금지",
    "distinctFromOtherParagraphs": "A가 B의 수락을 확인하는 방향",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH05.P4:a-risk-disclosure-before-consent",
          "sourceKeys": [
            "81c172dd5bbbb1920ae6",
            "6256f57a0be573a6725a",
            "f8f90022e047bfe61557",
            "464de610689b7074363e"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "81c172dd5bbbb1920ae6"
            },
            {
              "owner": "B",
              "type": "ENFJ",
              "sourceKey": "6256f57a0be573a6725a"
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
          "type": "ENFJ",
          "sourceKey": "6256f57a0be573a6725a",
          "domain": "INVESTMENT"
        }
      ],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
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
      "firstFactCheck": "가상: 검토 뒤 보류 항목을 명시",
      "aChange": "위험·선택·미확정 공개",
      "bChange": "이해·질문·동의 범위 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "risk_consent",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "실제 손실 한도·추가 의무는 계약 검토 필요",
    "additionalBusinessInfo": [
      "risk_terms",
      "consent",
      "stop_conditions"
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
      "kind": "risk_acceptance",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "무엇에 동의했고 무엇은 아직 보류인가요?"
    },
    "personAAction": "위험·선택·미확정 공개",
    "personBAction": "이해·질문·동의 범위 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  }
];
