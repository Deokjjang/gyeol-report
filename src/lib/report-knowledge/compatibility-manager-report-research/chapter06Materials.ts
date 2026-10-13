/** Static offline managerReport research. No runtime registration or customer approval. */
import type { ManagerReportMaterial } from "./researchTypes";
export const MR_CH06_MATERIALS: readonly ManagerReportMaterial[] = [
  {
    "id": "mrpr:material:CH06.P1:report-to-manager-reality-check",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A 수신 십성과 B의 실행 정보는 어떤 질문인가?",
    "coreMeaning": "B가 계획과 다른 사실을 A에게 보여주는 자극",
    "roleContributions": [
      {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B의 실제 검토 원천과 A의 큰 구조 원천을 구분하는 B→A 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "수신 A 일간으로 B 일간을 본 실제 상관 정의는 반항적 팀원이라는 판정 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "B가 계획 가정과 달라진 수치·영향을 정리하는 가상 보고",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A에게 남는 것은 체면 도전보다 수정 판단에 필요한 정보일 수 있음",
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
        "owner": "A",
        "sourceKey": "45c222b77f8da3a044fc",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "6047f491aa9082328a86",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "bfcb541ba28cf9dd0cce",
        "sourceUse": "both_same_person_roots_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "154edb00b2c3dca6d39c",
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
    "workStage": "midpoint",
    "workFunctions": [
      "direction",
      "risk"
    ],
    "outputType": "reality_brief",
    "positive": "계획 변경의 필요를 발견할 여지",
    "risk": "사실 보고를 인사 평가에 대한 도전으로 해석",
    "factBomb": "상사 판단에 다른 정보를 주는 것은 상사 책임을 대신 지는 일이 아니다",
    "twist": "팀원의 이견이 목표를 지키려는 행동일 수도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 일정 가정과 실제 작업 시간을 비교",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "정보를 검토하고 변경 여부·지원 결정",
      "personB": "관찰·영향·필요 결정 구분"
    },
    "counterexample": "B 같은 사람 Fusion root 없으면 해당 지원 보류",
    "distinctFromOtherParagraphs": "A→B 기준 자극과 다른 실행 사실의 역방향",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P1:report-to-manager-reality-check",
          "sourceKeys": [
            "c7fee219fcf7a5b642fd",
            "45c222b77f8da3a044fc",
            "6047f491aa9082328a86",
            "bfcb541ba28cf9dd0cce",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISTJ",
              "sourceKey": "c7fee219fcf7a5b642fd"
            },
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "45c222b77f8da3a044fc"
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
        },
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "45c222b77f8da3a044fc",
          "domain": "THINKING"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 일정 가정과 실제 작업 시간을 비교",
      "aChange": "정보를 검토하고 변경 여부·지원 결정",
      "bChange": "관찰·영향·필요 결정 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "reality_brief",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "priority_change",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "이 차이에서 어떤 계획 변경을 검토해 주실 수 있나요?"
    },
    "managerResponsibleAction": "정보를 검토하고 변경 여부·지원 결정",
    "teamMemberAvailableAction": "관찰·영향·필요 결정 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P1:report-to-manager-customer-observation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P1",
    "address": "CH06.P1",
    "mode": "BA",
    "readerQuestion": "A 수신 십성과 B의 실행 정보는 어떤 질문인가?",
    "coreMeaning": "B의 가까운 반응 정보와 A의 판단",
    "roleContributions": [
      {
        "address": "CH06.P1.S1",
        "originalRole": "B→A 영향",
        "knowledge": "B가 즉각 요구를 알아채는 실제 원천이 있을 때만 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S2",
        "originalRole": "받는 사람 기준 십성",
        "knowledge": "A 수신 실제 식신 정의는 B의 보고 정확성·고객 실적을 보장하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S3",
        "originalRole": "다른 방향 행동",
        "knowledge": "관찰한 문의·빈도·범위와 B의 해석을 나누어 A에게 전달",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P1.S4",
        "originalRole": "A에게 남는 의미",
        "knowledge": "A는 제한된 반응을 전체 고객 의견으로 확대하지 않고 확인할 수 있음",
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
        "owner": "A",
        "sourceKey": "16577eb313d7ad41b01b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "90e77590d3ea07930ba1",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "8cbe6472c2f9201328be",
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
    "workStage": "information",
    "workFunctions": [
      "direction",
      "information"
    ],
    "outputType": "observation_scope",
    "positive": "빠진 현장 질문을 얻을 여지",
    "risk": "눈앞 반응을 전체 판단으로 확정",
    "factBomb": "한 사람의 급한 반응이 모두의 요구는 아니다",
    "twist": "공감 정보도 범위를 적으면 판단 자료로 더 쓰기 쉬울 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 반복 문의와 미확인 원인을 분리해 보고",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "표본 범위·추가 확인·대응 우선순위 판단",
      "personB": "관찰 사실과 추정·제안 구분"
    },
    "counterexample": "실제 직업·고객 관계를 만들어내지 않음",
    "distinctFromOtherParagraphs": "수치 불일치와 다른 반응 정보의 범위",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P1:report-to-manager-customer-observation",
          "sourceKeys": [
            "e08ef500cdb091985a2e",
            "16577eb313d7ad41b01b",
            "90e77590d3ea07930ba1",
            "8cbe6472c2f9201328be"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "e08ef500cdb091985a2e"
            },
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "16577eb313d7ad41b01b"
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
        },
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "16577eb313d7ad41b01b",
          "domain": "COMMUNICATION"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 반복 문의와 미확인 원인을 분리해 보고",
      "aChange": "표본 범위·추가 확인·대응 우선순위 판단",
      "bChange": "관찰 사실과 추정·제안 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "observation_scope",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "information_access",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "확인한 반응의 범위와 추가 확인을 나눌까요?"
    },
    "managerResponsibleAction": "표본 범위·추가 확인·대응 우선순위 판단",
    "teamMemberAvailableAction": "관찰 사실과 추정·제안 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P2:report-propose-bounded-method",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 대안·용량 정보는 언제 관리 결정을 돕는가?",
    "coreMeaning": "B의 대안이 A의 검토를 돕는 조건",
    "roleContributions": [
      {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "새 선택지와 비교 기준을 함께 주는 강점 후보",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "각자 실제 개인 원천과 A 수신 십성 정의를 별도 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 새 방법 제안에서 예상 장점·검증 방법·되돌림 조건을 제시",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "A가 권한 안에서 시험 범위를 판단하고 필요한 자원을 결정해야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "0ba71def5f7dd66a4424",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "c3c4464cae8ed35c5fd1",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "bbc18a4e615032647a49",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7394a0c2a7a725f0d533",
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
    "workStage": "draft",
    "workFunctions": [
      "direction",
      "proposal"
    ],
    "outputType": "trial_proposal",
    "positive": "선택의 근거를 넓힐 가능성",
    "risk": "제안자가 승인·실패 책임까지 자동 부담",
    "factBomb": "좋은 안을 냈다고 승인권까지 가진 것은 아니다",
    "twist": "작은 시험 제안이 전면 변경보다 검토를 쉽게 할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 기존 기준을 지키는 작은 시험안",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "검토 기준과 허용 범위를 설명",
      "personB": "가정·비교 지표·시험 범위 제안"
    },
    "counterexample": "성과·예산 효과는 미확인 추정으로 표시",
    "distinctFromOtherParagraphs": "B의 아이디어를 관리 결정 입력으로 변환",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P2:report-propose-bounded-method",
          "sourceKeys": [
            "0ba71def5f7dd66a4424",
            "c3c4464cae8ed35c5fd1",
            "bbc18a4e615032647a49",
            "7394a0c2a7a725f0d533"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "0ba71def5f7dd66a4424"
            },
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "c3c4464cae8ed35c5fd1"
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
          "sourceKey": "0ba71def5f7dd66a4424",
          "domain": "THINKING"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "c3c4464cae8ed35c5fd1",
          "domain": "THINKING"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 기존 기준을 지키는 작은 시험안",
      "aChange": "검토 기준과 허용 범위를 설명",
      "bChange": "가정·비교 지표·시험 범위 제안",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "trial_proposal",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "approval",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "어느 범위까지 시험하고 누가 승인하나요?"
    },
    "managerResponsibleAction": "검토 기준과 허용 범위를 설명",
    "teamMemberAvailableAction": "가정·비교 지표·시험 범위 제안",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P2:report-capacity-information",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P2",
    "address": "CH06.P2",
    "mode": "BA",
    "readerQuestion": "B의 대안·용량 정보는 언제 관리 결정을 돕는가?",
    "coreMeaning": "B의 업무량 정보가 A의 배분 결정을 돕기",
    "roleContributions": [
      {
        "address": "CH06.P2.S1",
        "originalRole": "도움 되는 강점",
        "knowledge": "현재 작업·시간·충돌을 보이게 하는 조건부 강점",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S2",
        "originalRole": "독립적 근거",
        "knowledge": "인정 욕구·챙김 원천을 실제 과부하 이력으로 승격하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S3",
        "originalRole": "관계별 장면",
        "knowledge": "가상 추가 요청에서 기존 업무와 새 업무가 겹치는 시간을 알림",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P2.S4",
        "originalRole": "발휘 조건",
        "knowledge": "A는 우선순위·기한·지원 중 조정할 것을 판단",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "15401c66ebefeba6594d",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "80abdb3362bb5a5279c3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "e2ed5b09b1f8185708cd",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "59caf289010ad94aa04b",
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
    "workStage": "plan",
    "workFunctions": [
      "direction",
      "allocation"
    ],
    "outputType": "capacity_brief",
    "positive": "숨은 작업량을 관리 정보로 바꿀 가능성",
    "risk": "B에게 스스로 야근해 모두 끝내라고 요구",
    "factBomb": "팀원이 시간을 공개해도 없는 여력은 생기지 않는다",
    "twist": "한계 보고가 부탁을 거절하는 말보다 계획을 지키는 자료일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 추가 요청과 기존 마감의 충돌을 표로 표시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "중단·연기·지원할 항목 결정",
      "personB": "작업량·소요 근거·충돌 시점 공유"
    },
    "counterexample": "실제 근로조건·법률 판단은 별도",
    "distinctFromOtherParagraphs": "아이디어와 다른 배분 정보",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P2:report-capacity-information",
          "sourceKeys": [
            "15401c66ebefeba6594d",
            "80abdb3362bb5a5279c3",
            "e2ed5b09b1f8185708cd",
            "59caf289010ad94aa04b"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "15401c66ebefeba6594d"
            },
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "80abdb3362bb5a5279c3"
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
          "sourceKey": "15401c66ebefeba6594d",
          "domain": "WORK"
        },
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "80abdb3362bb5a5279c3",
          "domain": "WORK"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 추가 요청과 기존 마감의 충돌을 표로 표시",
      "aChange": "중단·연기·지원할 항목 결정",
      "bChange": "작업량·소요 근거·충돌 시점 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "capacity_brief",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "work_allocation",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "두 작업이 겹칠 때 우선순위를 정해 주실 수 있나요?"
    },
    "managerResponsibleAction": "중단·연기·지원할 항목 결정",
    "teamMemberAvailableAction": "작업량·소요 근거·충돌 시점 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P3:report-unclear-risk-timing",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 늦은 보고·질문은 언제 결정 공백이 되는가?",
    "coreMeaning": "완성본을 기다리는 보고가 A의 결정 시점을 놓칠 위험",
    "roleContributions": [
      {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B의 늦은 몰입과 A의 빠른 판단 원천이 모두 확인된 조건",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "속도 차이는 실제 지연·태만 사실이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "B는 확정하고 말하려 해도 A는 지원 판단에 필요한 상태를 못 받을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "불확실 보고마다 책임을 몰아주면 보고가 더 늦어질 위험",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "ab7a3cfbec4c729e713c",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "16577eb313d7ad41b01b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "78ca1a3776c53c2d0b48",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "154edb00b2c3dca6d39c",
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
    "workStage": "midpoint",
    "workFunctions": [
      "direction",
      "delay"
    ],
    "outputType": "risk_timing",
    "positive": "중간 정보로 지원 필요를 확인할 여지",
    "risk": "보고 지연 원인을 B 성격만으로 설명",
    "factBomb": "보고 의무가 있어도 상사의 불확실성 수용 책임은 없어지지 않는다",
    "twist": "모른다는 범위를 일찍 알리는 것이 더 정확한 보고일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 완료 전 막힘과 다음 확인 시점을 공유",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "보고 통로·시한·지원 응답을 명확히 함",
      "personB": "상태·영향·다음 확인을 전달"
    },
    "counterexample": "안전한 직접 보고가 어렵다면 적절한 지원 확인",
    "distinctFromOtherParagraphs": "BA 정보 시점의 비용",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P3:report-unclear-risk-timing",
          "sourceKeys": [
            "ab7a3cfbec4c729e713c",
            "16577eb313d7ad41b01b",
            "78ca1a3776c53c2d0b48",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "ab7a3cfbec4c729e713c"
            },
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "16577eb313d7ad41b01b"
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
          "sourceKey": "ab7a3cfbec4c729e713c",
          "domain": "WORK"
        },
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "16577eb313d7ad41b01b",
          "domain": "COMMUNICATION"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 완료 전 막힘과 다음 확인 시점을 공유",
      "aChange": "보고 통로·시한·지원 응답을 명확히 함",
      "bChange": "상태·영향·다음 확인을 전달",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "risk_timing",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "reporting",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "확정 전에도 어떤 위험을 먼저 알려야 하나요?"
    },
    "managerResponsibleAction": "보고 통로·시한·지원 응답을 명확히 함",
    "teamMemberAvailableAction": "상태·영향·다음 확인을 전달",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P3:report-question-as-final-decision",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P3",
    "address": "CH06.P3",
    "mode": "BA",
    "readerQuestion": "B의 늦은 보고·질문은 언제 결정 공백이 되는가?",
    "coreMeaning": "질문이 늘어도 승인 책임은 넘어가지 않음",
    "roleContributions": [
      {
        "address": "CH06.P3.S1",
        "originalRole": "부담 행동",
        "knowledge": "B가 이유를 계속 묻고 A가 기준을 지키려는 원천을 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S2",
        "originalRole": "검증된 차이",
        "knowledge": "검증된 차이는 질문 범위이며 실제 불복종·통제 이력은 미확인",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S3",
        "originalRole": "의도와 경험",
        "knowledge": "B는 이해하려고 질문해도 A는 이미 끝난 결정을 다시 논의한다고 받을 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P3.S4",
        "originalRole": "악화 조건",
        "knowledge": "질문·대안·승인 요청을 섞으면 필요한 결정이 불명확해짐",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "f666c10a6db231abcc92",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "0d96f1fc326be0f4a50a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "3f130780549c6cb7a467",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "d23874cc920e78330b98",
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
    "workStage": "review",
    "workFunctions": [
      "direction",
      "decision"
    ],
    "outputType": "question_status",
    "positive": "질문의 목적을 분명히 할 여지",
    "risk": "팀원이 질문을 포기해 결정 근거가 숨겨짐",
    "factBomb": "설명 질문을 줄이는 것만으로 관리 결정이 좋아지는 것은 아니다",
    "twist": "질문 범위를 정하면 권한과 이견이 함께 남을 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 기준 확인 질문과 변경 요청을 따로 제시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "결정 근거와 변경 가능 여부 설명",
      "personB": "확인 질문·제안·승인 요청 구분"
    },
    "counterexample": "실제 확정 결정·권한은 별도 확인",
    "distinctFromOtherParagraphs": "늦은 보고와 다른 질문 상태 혼동",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P3:report-question-as-final-decision",
          "sourceKeys": [
            "f666c10a6db231abcc92",
            "0d96f1fc326be0f4a50a",
            "3f130780549c6cb7a467",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "f666c10a6db231abcc92"
            },
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "0d96f1fc326be0f4a50a"
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
          "sourceKey": "f666c10a6db231abcc92",
          "domain": "THINKING"
        },
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "0d96f1fc326be0f4a50a",
          "domain": "WORK"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 기준 확인 질문과 변경 요청을 따로 제시",
      "aChange": "결정 근거와 변경 가능 여부 설명",
      "bChange": "확인 질문·제안·승인 요청 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "question_status",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "decision_rights",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "기준 확인과 변경 제안 중 무엇으로 검토하면 될까요?"
    },
    "managerResponsibleAction": "결정 근거와 변경 가능 여부 설명",
    "teamMemberAvailableAction": "확인 질문·제안·승인 요청 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P4:report-decision-ready-brief",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B는 결정·수정에 필요한 정보를 어떻게 요청하는가?",
    "coreMeaning": "간결함을 결정 가능한 정보로 바꾸기",
    "roleContributions": [
      {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "B는 결론만 말하는 대신 상태·영향·선택지·필요 시점을 나눔",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A가 결정할 항목과 B가 수행할 범위를 구분해 요구 정보를 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "보고 수신 확인과 승인·수락은 다르므로 결정 답변을 별도 기록",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "A는 핵심 정보를 받고도 결정·지원 책임을 B에게 넘기지 않음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "4b43fdff038f96814956",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "9157cb32f6c4c40c5336",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "ce1defc1af72408fec4a",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "8cbe6472c2f9201328be",
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
    "workStage": "midpoint",
    "workFunctions": [
      "direction",
      "reporting"
    ],
    "outputType": "decision_request",
    "positive": "보고의 쓰임을 명확히 할 여지",
    "risk": "요약이 미확인 위험을 숨기는 방식이 됨",
    "factBomb": "짧은 보고는 책임 회피도 자동 승인도 아니다",
    "twist": "한 줄 더 적는 불확실성이 전체 보고를 더 정확하게 할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 결정 필요 시각과 미확인 항목을 붙인 짧은 보고",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "결정과 미결 항목을 답변",
      "personB": "사실·선택지·결정 요청을 구분"
    },
    "counterexample": "간결함 때문에 필수 안전 정보를 생략 불가",
    "distinctFromOtherParagraphs": "BA 보고를 결정 인터페이스로 정리",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P4:report-decision-ready-brief",
          "sourceKeys": [
            "4b43fdff038f96814956",
            "9157cb32f6c4c40c5336",
            "ce1defc1af72408fec4a",
            "8cbe6472c2f9201328be"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISTP",
              "sourceKey": "4b43fdff038f96814956"
            },
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "9157cb32f6c4c40c5336"
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
          "sourceKey": "4b43fdff038f96814956",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "9157cb32f6c4c40c5336",
          "domain": "COMMUNICATION"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 결정 필요 시각과 미확인 항목을 붙인 짧은 보고",
      "aChange": "결정과 미결 항목을 답변",
      "bChange": "사실·선택지·결정 요청을 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "decision_request",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "decision_rights",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "이 중 상사 결정이 필요한 항목을 확인해 주실 수 있나요?"
    },
    "managerResponsibleAction": "결정과 미결 항목을 답변",
    "teamMemberAvailableAction": "사실·선택지·결정 요청을 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH06.P4:report-feedback-clarification",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH06",
    "paragraphId": "P4",
    "address": "CH06.P4",
    "mode": "BA",
    "readerQuestion": "B는 결정·수정에 필요한 정보를 어떻게 요청하는가?",
    "coreMeaning": "B가 평가어를 수정 조건 질문으로 바꾸기",
    "roleContributions": [
      {
        "address": "CH06.P4.S1",
        "originalRole": "조정할 행동",
        "knowledge": "막연한 지적에서 관찰 항목·수정 범위를 확인하는 행동",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S2",
        "originalRole": "A의 필요",
        "knowledge": "A가 답해야 할 기준을 B가 대신 추측하지 않게 함",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S3",
        "originalRole": "확인할 실천",
        "knowledge": "질문할 안전이 확인된 경우 문서·개별 대화 등 적합한 방식 선택",
        "notIndependentFact": true
      },
      {
        "address": "CH06.P4.S4",
        "originalRole": "B→A 가능성",
        "knowledge": "A는 수정 기준·지원·재검토 시점을 더 분명하게 설명할 수 있음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "B",
        "sourceKey": "4d4a080342aae90654f6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "f1a63049534f1dfb09b7",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "DIRECTION_BA",
        "sourceKey": "fe11b875c7ad3a9c8318",
        "sourceUse": "recipient_direction_definition",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "97fa6fd9e95f85910bf9",
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
    "workStage": "revision",
    "workFunctions": [
      "direction",
      "feedback"
    ],
    "outputType": "feedback_question",
    "positive": "수정 공백을 줄일 여지",
    "risk": "B의 말투 교정만 요구하고 공개 판단을 유지",
    "factBomb": "팀원이 질문을 잘해도 공개 인격 판단의 책임은 상사에게 남는다",
    "twist": "피드백을 다시 묻는 것이 거부보다 수행 의지일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 더 적극적이라는 평가어를 필요한 행동으로 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "행동 기준·수정 시간·지원 설명",
      "personB": "관찰 예시와 수정 우선순위를 요청"
    },
    "counterexample": "보복 위험이 있으면 직접 대화 대신 안전 통로 확인",
    "distinctFromOtherParagraphs": "결정 보고와 다른 수정 조건 확인",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH06.P4:report-feedback-clarification",
          "sourceKeys": [
            "4d4a080342aae90654f6",
            "f1a63049534f1dfb09b7",
            "fe11b875c7ad3a9c8318",
            "97fa6fd9e95f85910bf9"
          ],
          "typePredicates": [
            {
              "owner": "B",
              "type": "ISFP",
              "sourceKey": "4d4a080342aae90654f6"
            },
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "f1a63049534f1dfb09b7"
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
          "sourceKey": "4d4a080342aae90654f6",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "f1a63049534f1dfb09b7",
          "domain": "COMMUNICATION"
        }
      ],
      "direction": {
        "direction": "B_TO_A",
        "subject": "B",
        "recipient": "A",
        "tenGodViewer": "A.dayMaster",
        "tenGodTarget": "B.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
        "actual_manager_role",
        "actual_team_member_role",
        "verified_reporting_relationship",
        "verified_evaluation_authority",
        "safe_voice_channel",
        "actual_task",
        "current_phase",
        "output_requirements",
        "available_time",
        "verified_responsibility",
        "verified_decision_authority"
      ],
      "introducedRequired": false
    },
    "repair": {
      "firstFactCheck": "가상: 더 적극적이라는 평가어를 필요한 행동으로 확인",
      "aChange": "행동 기준·수정 시간·지원 설명",
      "bChange": "관찰 예시와 수정 우선순위를 요청",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "feedback_question",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0,
    "roleVersion": "compatibility-fixed-ab-v1",
    "declaredRoles": {
      "personA": "상사",
      "personB": "부하·팀원"
    },
    "authorityContext": {
      "kind": "feedback",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "구체적으로 바꿀 행동과 수정 시간을 알려주실 수 있나요?"
    },
    "managerResponsibleAction": "행동 기준·수정 시간·지원 설명",
    "teamMemberAvailableAction": "관찰 예시와 수정 우선순위를 요청",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  }
];
