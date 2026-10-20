/** Static offline businessPartner research. No runtime registration or customer approval. */
import type { BusinessPartnerMaterial } from "./researchTypes";
export const BP_CH01_MATERIALS: readonly BusinessPartnerMaterial[] = [
  {
    "id": "bppr:material:CH01.P1:idea-demand-interface",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "같이 볼 고객 문제와 제공 가정은 무엇인가?",
    "coreMeaning": "가능성과 실제 필요를 다른 질문으로 보기",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A가 대안을 탐색하고 B가 적용 장면을 묻는 독립 원천이 있을 때의 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "좋은 아이디어의 논리와 누가 실제로 필요로 하는지는 다른 정보",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 제안에서 제품 가설과 고객에게 확인할 질문을 나눌 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "상징은 확신을 키우는 응원보다 사업 가설을 함께 들여다보는 지도",
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
        "sourceKey": "72685cd9261c6060b22d",
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
        "id": "sar:facet:CURIOSITY:question-making",
        "axis": "CURIOSITY",
        "definition": "모르는 지점을 질문으로 구체화",
        "condition": "정보 요청의 목적과 동의를 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "market",
    "workFunctions": [
      "opportunity",
      "demand"
    ],
    "outputType": "market_hypothesis",
    "positive": "빈 수요 가정을 발견할 여지",
    "risk": "두 사람의 호응을 시장 반응으로 확정",
    "factBomb": "둘이 좋아한 아이디어가 고객의 구매 이유가 되는 것은 아니다",
    "twist": "반대 질문이 기회를 버리는 말보다 검증할 길을 열 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 새 서비스를 논의하며 고객 문제와 대안을 따로 적음",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "해결할 문제·가정·확인 방법 제시",
      "personB": "실제 적용 장면·미확인 수요를 질문"
    },
    "counterexample": "실제 고객 자료 없으면 수요 확정 금지",
    "distinctFromOtherParagraphs": "CH04 실행 연결 전 대표 시장 질문만 소개",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P1:idea-demand-interface",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "72685cd9261c6060b22d",
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
              "sourceKey": "72685cd9261c6060b22d"
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
          "sourceKey": "72685cd9261c6060b22d",
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
      "firstFactCheck": "가상: 새 서비스를 논의하며 고객 문제와 대안을 따로 적음",
      "aChange": "해결할 문제·가정·확인 방법 제시",
      "bChange": "실제 적용 장면·미확인 수요를 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "market_hypothesis",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "검증 시간·시험비는 아직 가정이며 공동 지출 승인과 별도",
    "additionalBusinessInfo": [
      "actual_business_status",
      "target_customer",
      "validation_cost"
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
      "question": "누가 어떤 문제 때문에 실제로 선택할지 무엇으로 확인하나요?"
    },
    "personAAction": "해결할 문제·가정·확인 방법 제시",
    "personBAction": "실제 적용 장면·미확인 수요를 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P1:opportunity-capacity-interface",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P1",
    "address": "CH01.P1",
    "mode": "JOINT",
    "readerQuestion": "같이 볼 고객 문제와 제공 가정은 무엇인가?",
    "coreMeaning": "목표를 위한 자원과 감당할 부담의 접점",
    "roleContributions": [
      {
        "address": "CH01.P1.S1",
        "originalRole": "특징적인 조합",
        "knowledge": "A가 돈을 목표 자원으로 보고 B가 정산·책임 기준을 묻는 원천을 각각 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S2",
        "originalRole": "대표 성향 대비",
        "knowledge": "새 기회에 대한 찬성과 지금 자금을 낼 수 있다는 동의는 다름",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S3",
        "originalRole": "함께하는 장면",
        "knowledge": "가상 확대안에서 기대 가치와 실제 필요한 시간·현금을 별도 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P1.S4",
        "originalRole": "관계의 상징",
        "knowledge": "관계의 상징은 가속과 제동의 고정 배역보다 같은 결정을 다른 조건에서 읽는 두 질문",
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
        "owner": "GUIDANCE",
        "sourceKey": "f64a1b254b8c7a0ebd5e",
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
      "opportunity",
      "capacity"
    ],
    "outputType": "capacity_hypothesis",
    "positive": "의욕과 가용 조건을 함께 검토할 여지",
    "risk": "A공격형 B안정형으로 항상 배정",
    "factBomb": "기회에 동의했다고 상대의 추가 출자까지 승인한 것은 아니다",
    "twist": "자원 한계를 묻는 사람이 기회에 반대하는 것은 아닐 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 새 주문 기회와 선투입 비용을 나란히 검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "기대 가치·가정·필요 자원을 구분",
      "personB": "가능한 기여·미확인 부담을 질문"
    },
    "counterexample": "실제 자산·손실 감당 능력은 유형으로 판정 금지",
    "distinctFromOtherParagraphs": "시장 수요와 다른 참여·가용 자원 접점",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P1:opportunity-capacity-interface",
          "sourceKeys": [
            "66a9cd49cd16d86ca992",
            "b64fa2920704301bf622",
            "f64a1b254b8c7a0ebd5e"
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
      "firstFactCheck": "가상: 새 주문 기회와 선투입 비용을 나란히 검토",
      "aChange": "기대 가치·가정·필요 자원을 구분",
      "bChange": "가능한 기여·미확인 부담을 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "capacity_hypothesis",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "추가 자금·시간을 낼 실제 여력은 UNKNOWN",
    "additionalBusinessInfo": [
      "actual_resources",
      "contributions",
      "spending_authority"
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
      "question": "기회에 대한 동의와 시간·출자 약속을 나눠 확인할까요?"
    },
    "personAAction": "기대 가치·가정·필요 자원을 구분",
    "personBAction": "가능한 기여·미확인 부담을 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P2:harmony-not-revenue",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 정의와 사업 조건을 어떻게 구분하는가?",
    "coreMeaning": "명리 연결 상징과 사업 실적의 분리",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "실제 양쪽 기둥에서 子丑 육합을 검출한 때만 기존 관계 정의 참고",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "전통 연결의 상징은 실제 구매·이익·입금을 보장하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "각자 관점을 확인하는 질문에 참고할 수 있으나 사업 자료와 구별",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "좋은 접점도 비용·수요·권한·이행 조건을 확인해야 활용 가능",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "84d1ddc4aa078aa8fa5f",
        "sourceUse": "actual_canonical_membership_required",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "continuation",
    "workFunctions": [
      "canonical",
      "profit"
    ],
    "outputType": "relation_boundary",
    "positive": "관계 정의를 확인 질문으로 열어둘 여지",
    "risk": "합을 돈이 되는 파트너의 증거로 사용",
    "factBomb": "명리의 합은 고객의 계약서나 통장 내역이 아니다",
    "twist": "의견이 잘 맞아도 다른 검토 역할을 남길 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 두 사람의 호응과 계약·입금 여부를 별도 표시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "제안과 실제 검증 결과 구분",
      "personB": "미확인 비용·결제 조건 확인"
    },
    "counterexample": "실제 관계 refs 없으면 이 후보 보류",
    "distinctFromOtherParagraphs": "CH07 충돌 전에 연결 상징의 경제 경계",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P2:harmony-not-revenue",
          "sourceKeys": [
            "84d1ddc4aa078aa8fa5f",
            "52e29256ddea72aefa88"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "firstFactCheck": "가상: 두 사람의 호응과 계약·입금 여부를 별도 표시",
      "aChange": "제안과 실제 검증 결과 구분",
      "bChange": "미확인 비용·결제 조건 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "relation_boundary",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "매출·비용·현금 자료는 명리 정의로 생성하지 않음",
    "additionalBusinessInfo": [
      "actual_relation_ids",
      "financial_records"
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
      "kind": "financial_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "좋은 접점과 실제 손익·입금 근거를 나눠 볼까요?"
    },
    "personAAction": "제안과 실제 검증 결과 구분",
    "personBAction": "미확인 비용·결제 조건 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P2:half-harmony-not-governance",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P2",
    "address": "CH01.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 명리 정의와 사업 조건을 어떻게 구분하는가?",
    "coreMeaning": "부분 연결과 공동 결정 권한의 비동일성",
    "roleContributions": [
      {
        "address": "CH01.P2.S1",
        "originalRole": "실제 명리 관계",
        "knowledge": "실제 申子 반합과 두 사람의 기둥 refs가 있을 때만 정의 참조",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "전통 연결을 동일 지분·과반 투표·공동대표 사실로 바꾸지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S3",
        "originalRole": "상호 영향",
        "knowledge": "사업의 결정·통지·협의·공동 동의는 실제 계약과 구조로 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P2.S4",
        "originalRole": "강점과 주의 조건",
        "knowledge": "연결 가능성에도 개인 선호와 권한을 구분할 여지",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "69aac2d24f114cdd40fb",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d4af2f38a725dac45d6e",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "contract",
    "workFunctions": [
      "canonical",
      "authority"
    ],
    "outputType": "authority_boundary",
    "positive": "역할을 추측하지 않고 질문할 가능성",
    "risk": "대칭 궁합이니 모든 결정도 반씩이라고 단정",
    "factBomb": "사주가 이어져도 결재권이 나뉜 것은 아니다",
    "twist": "잘 맞는 관계에서도 권한을 먼저 확인하는 것이 필요할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 제안 검토자와 실제 서명권자가 다른 사업 상황",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 권한 출처·확인 경로 질문",
      "personB": "동의 범위·실행 주체 확인"
    },
    "counterexample": "정족수·법적 대표권을 DB가 확정하지 않음",
    "distinctFromOtherParagraphs": "수익 경계와 다른 지분·결정권 경계",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P2:half-harmony-not-governance",
          "sourceKeys": [
            "69aac2d24f114cdd40fb",
            "d4af2f38a725dac45d6e"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "firstFactCheck": "가상: 제안 검토자와 실제 서명권자가 다른 사업 상황",
      "aChange": "실제 권한 출처·확인 경로 질문",
      "bChange": "동의 범위·실행 주체 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "authority_boundary",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "서명·지출·책임의 실제 범위는 UNKNOWN",
    "additionalBusinessInfo": [
      "business_structure",
      "contract",
      "decision_rights"
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
      "kind": "decision_rights",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "각자 결정·사전 협의·공동 동의가 필요한 것은 무엇인가요?"
    },
    "personAAction": "실제 권한 출처·확인 경로 질문",
    "personBAction": "동의 범위·실행 주체 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P3:analysis-and-use",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 정보 질문은 어떻게 다른가?",
    "coreMeaning": "원인 탐구와 사용 장면의 독립적 질문",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A 실제 INTP 원천의 구조·원인 질문을 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B 실제 ESFJ 원천의 적용·절차 질문을 따로 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "같이 이해하고 싶어도 설명의 단위가 다를 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "사업 가설의 이유와 고객이 사용할 때의 정보를 연결하는 조건부 후보",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f666c10a6db231abcc92",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "72685cd9261c6060b22d",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "2fe4d73f766a08fb06e6",
        "sourceUse": "directed_reference_only",
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
    "workStage": "idea",
    "workFunctions": [
      "mbti",
      "customer_value"
    ],
    "outputType": "information_interface",
    "positive": "가설을 구체화할 여지",
    "risk": "일반 Pair 문구를 사업 조합 성공의 실증으로 사용",
    "factBomb": "이론을 납득한 것과 사용자가 값을 지불하는 것은 다르다",
    "twist": "짧은 사용 예시가 더 정교한 가설을 만들 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 원리 설명 옆에 이용자의 실제 문제 질문을 붙임",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "해결 논리·가정을 설명",
      "personB": "적용 대상·사용 장면·확인 자료 질문"
    },
    "counterexample": "한쪽 미상·실제 원천 부족이면 Pair 보류",
    "distinctFromOtherParagraphs": "개인 특징보다 두 정보 형식 대비",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P3:analysis-and-use",
          "sourceKeys": [
            "f666c10a6db231abcc92",
            "72685cd9261c6060b22d",
            "2fe4d73f766a08fb06e6"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "f666c10a6db231abcc92"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "72685cd9261c6060b22d"
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
          "sourceKey": "f666c10a6db231abcc92",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "72685cd9261c6060b22d",
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
      "firstFactCheck": "가상: 원리 설명 옆에 이용자의 실제 문제 질문을 붙임",
      "aChange": "해결 논리·가정을 설명",
      "bChange": "적용 대상·사용 장면·확인 자료 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "information_interface",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "제안·조사·시험 시간과 현금은 별도 추정",
    "additionalBusinessInfo": [
      "entered_types",
      "customer_context",
      "trial_scope"
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
      "question": "원리의 근거와 실제 사용 장면을 함께 확인할까요?"
    },
    "personAAction": "해결 논리·가정을 설명",
    "personBAction": "적용 대상·사용 장면·확인 자료 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P3:same-type-different-stakes",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P3",
    "address": "CH01.P3",
    "mode": "JOINT",
    "readerQuestion": "각자의 정보 질문은 어떻게 다른가?",
    "coreMeaning": "같은 기준 선호와 다른 이해관계",
    "roleContributions": [
      {
        "address": "CH01.P3.S1",
        "originalRole": "A의 실제 MBTI",
        "knowledge": "A 실제 ISTJ의 정산·책임 기준 선호 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S2",
        "originalRole": "B의 실제 MBTI",
        "knowledge": "B 실제 ISTJ의 검증된 절차·기록 선호 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S3",
        "originalRole": "공통점과 차이",
        "knowledge": "선호가 같아도 출자·노동·회수 시점·생활 부담은 같지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P3.S4",
        "originalRole": "상호작용",
        "knowledge": "문서 확인을 공통 접점으로 쓰되 실제 권리·기여는 별도 확인",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "b64fa2920704301bf622",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "be75c6da843ca261cd98",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "PAIR_AB",
        "sourceKey": "38fa9db618761c3db5b0",
        "sourceUse": "directed_reference_only",
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
      "mbti",
      "stakes"
    ],
    "outputType": "stake_questions",
    "positive": "계약 전 숨은 전제를 묻는 데 활용 가능",
    "risk": "같은 유형이니 손실도 같은 비율로 감당한다고 가정",
    "factBomb": "같은 MBTI는 같은 통장 잔고나 계약 조건을 뜻하지 않는다",
    "twist": "닮았을수록 다른 이해관계를 먼저 적어볼 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 같은 기준을 중시하지만 참여 기간이 다른 제안",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 가정·참여 범위 명시",
      "personB": "회수 시점·미확인 약정 확인"
    },
    "counterexample": "실제 지분·손실 분담 비율 임의 산정 금지",
    "distinctFromOtherParagraphs": "다른 유형 대비와 다른 공유 전제의 경제 차이",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P3:same-type-different-stakes",
          "sourceKeys": [
            "b64fa2920704301bf622",
            "be75c6da843ca261cd98",
            "38fa9db618761c3db5b0"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "b64fa2920704301bf622"
            },
            {
              "owner": "B",
              "type": "ISTJ",
              "sourceKey": "be75c6da843ca261cd98"
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
          "sourceKey": "b64fa2920704301bf622",
          "domain": "MONEY"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "be75c6da843ca261cd98",
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
      "firstFactCheck": "가상: 같은 기준을 중시하지만 참여 기간이 다른 제안",
      "aChange": "자기 가정·참여 범위 명시",
      "bChange": "회수 시점·미확인 약정 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "stake_questions",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "실제 출자액·부채·운영 부담은 UNKNOWN",
    "additionalBusinessInfo": [
      "contributions",
      "commitment_period",
      "loss_agreement"
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
      "question": "비슷한 선호와 다른 기여·회수 조건을 나눠 볼까요?"
    },
    "personAAction": "자기 가정·참여 범위 명시",
    "personBAction": "회수 시점·미확인 약정 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P4:trust-verification-boundary",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "동업 상태·기여·위험에서 무엇을 먼저 확인하는가?",
    "coreMeaning": "좋은 의도와 확인 가능한 약속의 경계",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "상대를 존중하며 조건을 명료히 할 가능성은 긍정적 접점",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "호감과 자료 확인 선호가 다르더라도 실제 신뢰 이력은 미확인",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "사업 선택은 분석 카테고리이며 실제 계약·공동 계좌·대표권 확인이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "무엇을 믿고 무엇을 기록으로 확인할지 묻는 기준",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "6256f57a0be573a6725a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
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
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "contract",
    "workFunctions": [
      "trust",
      "contract"
    ],
    "outputType": "trust_record",
    "positive": "신뢰를 검증 가능한 약속으로 지킬 여지",
    "risk": "서면 확인을 불신·관계 거부로 해석",
    "factBomb": "믿는다는 말은 상대가 감당할 약속의 범위를 대신하지 못한다",
    "twist": "기록을 남기는 것이 서로를 덜 추측하게 할 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 친분과 별개로 납기·지급·기여를 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "약속 범위·변경 조건을 설명",
      "personB": "미확인·동의하지 않은 항목 질문"
    },
    "counterexample": "형태별 법적 요건·효력은 전문 검토 필요",
    "distinctFromOtherParagraphs": "대표 관계를 유지할 정보·동의 기준",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P4:trust-verification-boundary",
          "sourceKeys": [
            "6256f57a0be573a6725a",
            "81c172dd5bbbb1920ae6",
            "47598f584969b3d3f879"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "6256f57a0be573a6725a"
            },
            {
              "owner": "B",
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
          "type": "ENFJ",
          "sourceKey": "6256f57a0be573a6725a",
          "domain": "INVESTMENT"
        },
        {
          "owner": "B",
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
      "firstFactCheck": "가상: 친분과 별개로 납기·지급·기여를 확인",
      "aChange": "약속 범위·변경 조건을 설명",
      "bChange": "미확인·동의하지 않은 항목 질문",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "trust_record",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "분쟁·추가 비용을 개인 성향으로 배분하지 않음",
    "additionalBusinessInfo": [
      "actual_contract",
      "scope",
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
      "question": "신뢰와 별개로 어떤 약속을 확인해야 하나요?"
    },
    "personAAction": "약속 범위·변경 조건을 설명",
    "personBAction": "미확인·동의하지 않은 항목 질문",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  },
  {
    "id": "bppr:material:CH01.P4:stop-before-risk-lock",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "businessPartner",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH01",
    "paragraphId": "P4",
    "address": "CH01.P4",
    "mode": "JOINT",
    "readerQuestion": "동업 상태·기여·위험에서 무엇을 먼저 확인하는가?",
    "coreMeaning": "기회를 지키는 시험 범위와 멈출 질문",
    "roleContributions": [
      {
        "address": "CH01.P4.S1",
        "originalRole": "좋은 점",
        "knowledge": "작은 시험으로 미확인 가정을 좁힐 가능성",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S2",
        "originalRole": "조심할 차이",
        "knowledge": "확신·기대와 실제 감당 가능한 손실은 다른 조건",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S3",
        "originalRole": "관계별 조건",
        "knowledge": "현재 사업 단계·외부 의무·지출 승인·개인의 참여 동의가 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH01.P4.S4",
        "originalRole": "앞으로의 질문",
        "knowledge": "어떤 자료가 나오면 확대·보류·종료를 다시 논의할지 질문",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7ecd3182d36691c2b6b5",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:RISK_STYLE:loss-limit",
        "axis": "RISK_STYLE",
        "definition": "감당 가능한 손실 범위를 정함",
        "condition": "돈·시간·안전의 실제 한계 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "trial",
    "workFunctions": [
      "risk",
      "exit"
    ],
    "outputType": "stop_question",
    "positive": "다음 결정을 위한 기준을 남길 여지",
    "risk": "관계를 위해 계속 돈을 넣어야 한다고 주장",
    "factBomb": "사업을 멈추는 결정이 개인 관계의 실패를 뜻하지는 않는다",
    "twist": "중단 기준이 있어야 작은 실험에도 함께 동의할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 시험 기간과 비용 검토 시점을 먼저 정함",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "가정·시험 범위·재검토 조건 제안",
      "personB": "자기 참여 한계·미확인 의무 확인"
    },
    "counterexample": "종료 권리·반환금·법적 책임은 계약 검토 별도",
    "distinctFromOtherParagraphs": "계약 기록과 다른 지속·중단의 기본 질문",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "bppr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "bppr:material:CH01.P4:stop-before-risk-lock",
          "sourceKeys": [
            "7ecd3182d36691c2b6b5",
            "d8e6b5b9bc1c9e1094f2"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "all_direct_sources",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
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
      "firstFactCheck": "가상: 시험 기간과 비용 검토 시점을 먼저 정함",
      "aChange": "가정·시험 범위·재검토 조건 제안",
      "bChange": "자기 참여 한계·미확인 의무 확인",
      "authority": "UNKNOWN_verify_contract_and_business_structure",
      "scope": "stop_question",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·지분율·수익·손실 회복 보장으로 측정하지 않음.",
      "safetySupport": "사기·강요·경제적 착취·불법 의심은 일반 궁합 조율로 정상화하지 않으며 안전·전문 지원·협의 중단 조건을 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "economicCondition": "이미 쓴 돈과 앞으로 쓸 비용을 구분;손실 능력 추정 금지",
    "additionalBusinessInfo": [
      "trial_cost",
      "external_obligations",
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
      "kind": "continuation_review",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "무엇을 확인하면 시험을 끝내고 다시 결정하나요?"
    },
    "personAAction": "가정·시험 범위·재검토 조건 제안",
    "personBAction": "자기 참여 한계·미확인 의무 확인",
    "safeNegotiationCondition": "협의의 안전·동의·실제 권한을 먼저 확인. 사기·강요·경제적 착취·불법 의심을 성향 차이로 정상화하거나 동업 유지·같은 비율 양보를 강요하지 않음. 실제 법적 책임·계약 효력은 적절한 전문 검토가 필요."
  }
];
