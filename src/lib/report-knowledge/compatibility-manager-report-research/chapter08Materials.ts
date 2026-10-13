/** Static offline managerReport research. No runtime registration or customer approval. */
import type { ManagerReportMaterial } from "./researchTypes";
export const MR_CH08_MATERIALS: readonly ManagerReportMaterial[] = [
  {
    "id": "mrpr:material:CH08.P1:clarify-output",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "readerQuestion": "실제로 소개된 공백을 어떤 사실·필요·결정 질문으로 바꾸는가?",
    "coreMeaning": "앞서 표시된 목표 공백을 결과물 확인 질문으로 바꾸기",
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 표시된 목표 공백을 결과물 확인 질문으로 바꾸기",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "실제 지시에서 빠진 결과·범위·마감 이유를 찾음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "A는 기준 설명 B는 실행 가능한 정보가 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "결과 예시·제외 범위·재확인 시점을 공동 문서에 남김",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "45c222b77f8da3a044fc",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "5b5228616e5b4f21b980",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:STRUCTURE_STYLE:fixed-minimum",
        "axis": "STRUCTURE_STYLE",
        "definition": "반드시 지킬 최소 절차를 선택",
        "condition": "법·안전상 필수와 취향을 분리",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "goal",
    "workFunctions": [
      "vague_instructions",
      "goal"
    ],
    "outputType": "instruction_gap",
    "positive": "추측 작업을 줄일 여지",
    "risk": "B에게 지시문을 대신 완성하게 함",
    "factBomb": "상사의 설명 공백을 팀원의 이해력 문제로 정리하지 않는다",
    "twist": "짧은 결과 예시가 긴 독촉보다 먼저일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 착수 전에 필수 출력 항목을 함께 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "필수 기준·목적·지원 설명",
      "personB": "이해한 범위와 빈칸 질문"
    },
    "counterexample": "직접 질문이 위험하면 안전 통로 확인",
    "distinctFromOtherParagraphs": "수행 전 정보 공백 복구",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P1:vague-instructions"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P1:vague-instructions",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P1:vague-instructions",
          "sourceKeys": [
            "45c222b77f8da3a044fc",
            "5b5228616e5b4f21b980",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "45c222b77f8da3a044fc"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "5b5228616e5b4f21b980"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "45c222b77f8da3a044fc",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "5b5228616e5b4f21b980",
          "domain": "COMMUNICATION"
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 착수 전에 필수 출력 항목을 함께 확인",
      "aChange": "필수 기준·목적·지원 설명",
      "bChange": "이해한 범위와 빈칸 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "instruction_gap",
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
      "kind": "goal_setting",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "결과·제외 범위·완료 예시를 확인할까요?"
    },
    "managerResponsibleAction": "필수 기준·목적·지원 설명",
    "teamMemberAvailableAction": "이해한 범위와 빈칸 질문",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P1:separate-method",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "readerQuestion": "실제로 소개된 공백을 어떤 사실·필요·결정 질문으로 바꾸는가?",
    "coreMeaning": "앞서 표시된 방법 간섭을 필수·선호 구분으로 조정",
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 표시된 방법 간섭을 필수·선호 구분으로 조정",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "실제 수정 요구가 품질 규칙인지 개인 선호인지 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "A는 필수 기준 B는 선택 가능한 방법이 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "필수 규칙을 지킨 다른 방식은 어떤 검토로 인정할지 정함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "0d96f1fc326be0f4a50a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "8df480c9e6bb997fbe0e",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "goals_methods",
      "autonomy"
    ],
    "outputType": "method_gap",
    "positive": "방법 논쟁의 범위를 줄일 여지",
    "risk": "모든 간섭을 부당행위로 단정",
    "factBomb": "팀원의 선택을 인정하려면 상사의 선호도 기준에서 분리해야 한다",
    "twist": "방법을 비교하기보다 결과 조건을 먼저 비교할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 서로 다른 순서로 만든 결과의 필수 항목 검토",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "선호와 필수 기준 구분",
      "personB": "선택한 방식·결과·위험 공유"
    },
    "counterexample": "법정·안전 절차 임의 변경 금지",
    "distinctFromOtherParagraphs": "재량을 실제 품질 기준에 연결",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P1:goal-method-confusion"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P1:goal-method-confusion",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P1:goal-method-confusion",
          "sourceKeys": [
            "0d96f1fc326be0f4a50a",
            "8df480c9e6bb997fbe0e",
            "7394a0c2a7a725f0d533"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "0d96f1fc326be0f4a50a"
            },
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "8df480c9e6bb997fbe0e"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "0d96f1fc326be0f4a50a",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "8df480c9e6bb997fbe0e",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 서로 다른 순서로 만든 결과의 필수 항목 검토",
      "aChange": "선호와 필수 기준 구분",
      "bChange": "선택한 방식·결과·위험 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "method_gap",
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
      "kind": "method_discretion",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "필수 기준을 충족하면 다른 순서도 가능한가요?"
    },
    "managerResponsibleAction": "선호와 필수 기준 구분",
    "teamMemberAvailableAction": "선택한 방식·결과·위험 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P1:delegate-decision",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "readerQuestion": "실제로 소개된 공백을 어떤 사실·필요·결정 질문으로 바꾸는가?",
    "coreMeaning": "앞서 표시된 권한 공백을 결정 목록으로 확인",
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 표시된 권한 공백을 결정 목록으로 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "막힌 결정·필요 자원·현재 승인자를 사실로 정리",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "A는 실제 위임 범위를 B는 승인 대기 영향을 알아야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "B가 결정할 항목과 A가 남길 결정·응답 시점을 구분",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "17a595663fd8055c13b7",
        "sourceUse": "context_guidance_not_person_fact",
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
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "responsibility_without_delegation",
      "authority"
    ],
    "outputType": "delegation_gap",
    "positive": "대기와 수행 책임을 구별 가능",
    "risk": "위임 문서로 실제 법적 권한을 만들어냄",
    "factBomb": "위임은 상사의 남은 책임도 적어야 끝난다",
    "twist": "모든 결정을 넘기기보다 승인 응답을 빠르게 하는 선택도 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 승인 대기 작업의 결정 목록을 작성",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 권한·지원·응답 책임 확인",
      "personB": "대기 영향·필요 시각 제시"
    },
    "counterexample": "권한 밖 결정을 확약하지 않음",
    "distinctFromOtherParagraphs": "선호 방법이 아닌 승인 대기 복구",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P1:responsibility-without-delegation"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P1:responsibility-without-delegation",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P1:responsibility-without-delegation",
          "sourceKeys": [
            "17a595663fd8055c13b7",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 승인 대기 작업의 결정 목록을 작성",
      "aChange": "실제 권한·지원·응답 책임 확인",
      "bChange": "대기 영향·필요 시각 제시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "delegation_gap",
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
      "kind": "delegation",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "결정 범위와 승인 응답 시점을 정할까요?"
    },
    "managerResponsibleAction": "실제 권한·지원·응답 책임 확인",
    "teamMemberAvailableAction": "대기 영향·필요 시각 제시",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P1:make-discretion-visible",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "readerQuestion": "실제로 소개된 공백을 어떤 사실·필요·결정 질문으로 바꾸는가?",
    "coreMeaning": "앞서 표시된 자율 모순을 선택 가능한 항목으로 바꾸기",
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 표시된 자율 모순을 선택 가능한 항목으로 바꾸기",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "시간·도구·순서 중 실제 고정된 조건을 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "A는 제약의 이유 B는 실제 선택지를 알아야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "한 항목부터 선택 범위·예외 조건·다음 점검을 명시",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "0d96f1fc326be0f4a50a",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "7d3a67f375180035e30f",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "autonomy_no_discretion",
      "delegation"
    ],
    "outputType": "discretion_gap",
    "positive": "재량을 예측 가능하게 할 여지",
    "risk": "자율이라는 이름으로 지원 중단",
    "factBomb": "재량은 맡겼다는 말보다 선택할 수 있는 항목으로 확인한다",
    "twist": "작은 재량을 명확히 주는 편이 큰 모호한 자유보다 낫다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 순서 선택은 맡기고 안전선만 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "선택 범위·지원·예외 설명",
      "personB": "선택할 항목과 확인할 예외 재진술"
    },
    "counterexample": "규정상 고정 조건은 그대로 보존",
    "distinctFromOtherParagraphs": "승인 권한과 다른 실행 선택 복구",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P1:autonomy-with-no-discretion"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P1:autonomy-with-no-discretion",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P1:autonomy-with-no-discretion",
          "sourceKeys": [
            "0d96f1fc326be0f4a50a",
            "7d3a67f375180035e30f",
            "7394a0c2a7a725f0d533"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "0d96f1fc326be0f4a50a"
            },
            {
              "owner": "B",
              "type": "ISFP",
              "sourceKey": "7d3a67f375180035e30f"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "0d96f1fc326be0f4a50a",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "7d3a67f375180035e30f",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 순서 선택은 맡기고 안전선만 확인",
      "aChange": "선택 범위·지원·예외 설명",
      "bChange": "선택할 항목과 확인할 예외 재진술",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "discretion_gap",
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
      "kind": "method_discretion",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "실제로 선택할 수 있는 한 항목부터 정할까요?"
    },
    "managerResponsibleAction": "선택 범위·지원·예외 설명",
    "teamMemberAvailableAction": "선택할 항목과 확인할 예외 재진술",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P1:reduce-duplicate-report",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P1",
    "address": "CH08.P1",
    "mode": "JOINT",
    "readerQuestion": "실제로 소개된 공백을 어떤 사실·필요·결정 질문으로 바꾸는가?",
    "coreMeaning": "앞서 표시된 중복 보고를 정보 사용처로 조정",
    "roleContributions": [
      {
        "address": "CH08.P1.S1",
        "originalRole": "앞선 갈등 질문",
        "knowledge": "앞서 표시된 중복 보고를 정보 사용처로 조정",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S2",
        "originalRole": "실제 원인",
        "knowledge": "각 보고가 어떤 결정·지원에 쓰이는지 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S3",
        "originalRole": "각자 필요",
        "knowledge": "A는 필요한 판단 정보 B는 중단 없는 작업 시간이 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P1.S4",
        "originalRole": "조정 기준",
        "knowledge": "공통 상태는 한 곳에 두고 예외·긴급 정보 통로만 별도 정함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "80abdb3362bb5a5279c3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "412d7ea5f91628d61b5d",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "excess_reporting",
      "reporting"
    ],
    "outputType": "report_cost",
    "positive": "필요 보고를 남기며 중단을 줄일 여지",
    "risk": "보고를 줄이면서 지원도 끊음",
    "factBomb": "받기만 하고 쓰지 않는 보고는 먼저 줄일 대상이다",
    "twist": "보고 횟수가 줄어도 예외 정보는 더 빨리 도착할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 같은 상태를 한 문서에서 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "정보 목적·주기·응답을 정함",
      "personB": "중복 준비 시간·긴급 조건 공유"
    },
    "counterexample": "필수 안전 보고는 유지",
    "distinctFromOtherParagraphs": "보고 비용을 실제 정보 흐름으로 복구",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P1:excess-report-frequency"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P1:excess-report-frequency",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P1:excess-report-frequency",
          "sourceKeys": [
            "80abdb3362bb5a5279c3",
            "412d7ea5f91628d61b5d",
            "7394a0c2a7a725f0d533"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "80abdb3362bb5a5279c3"
            },
            {
              "owner": "B",
              "type": "ISTP",
              "sourceKey": "412d7ea5f91628d61b5d"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "80abdb3362bb5a5279c3",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "412d7ea5f91628d61b5d",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 같은 상태를 한 문서에서 확인",
      "aChange": "정보 목적·주기·응답을 정함",
      "bChange": "중복 준비 시간·긴급 조건 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "report_cost",
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
      "question": "중복 상태는 한 곳에서 보고 예외만 바로 알릴까요?"
    },
    "managerResponsibleAction": "정보 목적·주기·응답을 정함",
    "teamMemberAvailableAction": "중복 준비 시간·긴급 조건 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P2:manager-set-report-time",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "readerQuestion": "A는 시점·변경·수정·평가·승인 책임을 어떻게 먼저 조정하는가?",
    "coreMeaning": "A가 판단 시한과 중간 정보 수준을 먼저 정하기",
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A가 판단 시한과 중간 정보 수준을 먼저 정하기",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "앞선 실제 시점 공백이 원인이며 충은 사건 원인으로 쓰지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "확정 전 정보도 불확실 표시로 받겠다고 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B에게 완성 여부 대신 상태·막힘·다음 확인 시간이 남음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "941361dcf854c0c9f213",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "A",
        "sourceKey": "16577eb313d7ad41b01b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ab7a3cfbec4c729e713c",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:ACTION_TEMPO:start-latency",
        "axis": "ACTION_TEMPO",
        "definition": "결론과 첫 행동 사이의 간격",
        "condition": "결론이 실제로 난 뒤의 간격을 비교",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "midpoint",
    "workFunctions": [
      "report_timing",
      "canonical"
    ],
    "outputType": "timing_gap",
    "positive": "지원 판단을 앞당길 여지",
    "risk": "미확인 보고를 최종 실적 평가로 사용",
    "factBomb": "충 때문이라는 설명보다 언제 무엇을 받을지 정하는 책임이 먼저다",
    "twist": "상사가 불확실성을 받는 방식이 보고 속도를 바꿀 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 잠정 상태와 확정 결과의 보고 시점을 나눔",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "판단 시한·중간 정보·지원 응답 설명",
      "personB": "잠정·확정·미확인을 구분"
    },
    "counterexample": "실제 관계 없으면 충 해석 보류",
    "distinctFromOtherParagraphs": "시간 불일치에 대한 A의 선행 조정",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P2:report-time-clash"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P2:report-time-clash",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P2:report-time-clash",
          "sourceKeys": [
            "941361dcf854c0c9f213",
            "16577eb313d7ad41b01b",
            "ab7a3cfbec4c729e713c",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "16577eb313d7ad41b01b"
            },
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "ab7a3cfbec4c729e713c"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "16577eb313d7ad41b01b",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "ab7a3cfbec4c729e713c",
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
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 잠정 상태와 확정 결과의 보고 시점을 나눔",
      "aChange": "판단 시한·중간 정보·지원 응답 설명",
      "bChange": "잠정·확정·미확인을 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "timing_gap",
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
      "question": "잠정 정보와 확정 결과를 언제 각각 확인하나요?"
    },
    "managerResponsibleAction": "판단 시한·중간 정보·지원 응답 설명",
    "teamMemberAvailableAction": "잠정·확정·미확인을 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P2:manager-record-priority",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "readerQuestion": "A는 시점·변경·수정·평가·승인 책임을 어떻게 먼저 조정하는가?",
    "coreMeaning": "A가 변경 이유·중단 작업·새 기한을 함께 설명",
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A가 변경 이유·중단 작업·새 기한을 함께 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "우선순위가 바뀐 사실과 전통 해 정의는 구별",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "기존 요청을 유지할지 철회할지 명시하고 필요한 자원 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B는 이전 수행과 새 요청의 범위를 구분할 수 있음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "e23b027944c5f0d3197a",
        "sourceUse": "actual_canonical_membership_required",
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
        "id": "sar:facet:ADAPTABILITY:method-revision",
        "axis": "ADAPTABILITY",
        "definition": "목적 안에서 방법을 바꿈",
        "condition": "방법의 재량이 실제 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "revision",
    "workFunctions": [
      "priority_changes",
      "canonical"
    ],
    "outputType": "priority_gap",
    "positive": "변경 비용을 드러낼 여지",
    "risk": "변경 흔적 없이 팀원 적응만 요구",
    "factBomb": "새 지시는 이전 지시의 시간을 자동으로 지우지 않는다",
    "twist": "일을 하나 멈추는 결정이 새 목표를 돕기도 한다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 새 긴급 요청과 중단할 기존 작업을 함께 기록",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "변경자·이유·기한·지원 결정",
      "personB": "현재 수행·추가 소요 확인"
    },
    "counterexample": "실제 변경 없는 고객 과거를 창작하지 않음",
    "distinctFromOtherParagraphs": "A의 우선순위 변경 책임",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P2:priority-change-harm"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P2:priority-change-harm",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P2:priority-change-harm",
          "sourceKeys": [
            "e23b027944c5f0d3197a",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 새 긴급 요청과 중단할 기존 작업을 함께 기록",
      "aChange": "변경자·이유·기한·지원 결정",
      "bChange": "현재 수행·추가 소요 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "priority_gap",
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
      "question": "새 요청과 함께 중단할 작업도 정할까요?"
    },
    "managerResponsibleAction": "변경자·이유·기한·지원 결정",
    "teamMemberAvailableAction": "현재 수행·추가 소요 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P2:manager-close-revision",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "readerQuestion": "A는 시점·변경·수정·평가·승인 책임을 어떻게 먼저 조정하는가?",
    "coreMeaning": "A가 추가 기준과 오류 수정을 구분",
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A가 추가 기준과 오류 수정을 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "앞선 재작업이 기준 변경인지 기존 미충족인지 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "한 번의 수정 범위·검토 담당·종료 조건을 제시",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B는 수정할 항목과 다음 검토의 끝을 알 수 있음",
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
        "sourceKey": "d23874cc920e78330b98",
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
    "workStage": "revision",
    "workFunctions": [
      "rework",
      "canonical"
    ],
    "outputType": "rework_gap",
    "positive": "반복 수정 범위를 줄일 여지",
    "risk": "수정 종료 뒤 기준을 다시 늘림",
    "factBomb": "좋은 관계라도 수정 종료 기준은 필요하다",
    "twist": "최종이라는 말을 반복하기보다 남은 항목을 줄일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 기존 오류 두 개와 새 요구 한 개를 나눔",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "수정 출처·범위·기한·재검토 정리",
      "personB": "기존 기준 충족·추가 소요 알림"
    },
    "counterexample": "실제 반합을 수정 성공 보장으로 사용 금지",
    "distinctFromOtherParagraphs": "A의 검토 종료 책임",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P2:rework-with-half-harmony"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P2:rework-with-half-harmony",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P2:rework-with-half-harmony",
          "sourceKeys": [
            "69aac2d24f114cdd40fb",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 기존 오류 두 개와 새 요구 한 개를 나눔",
      "aChange": "수정 출처·범위·기한·재검토 정리",
      "bChange": "기존 기준 충족·추가 소요 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "rework_gap",
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
      "kind": "review_standard",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "기존 오류와 새 요청을 나눠 완료 기준을 정할까요?"
    },
    "managerResponsibleAction": "수정 출처·범위·기한·재검토 정리",
    "teamMemberAvailableAction": "기존 기준 충족·추가 소요 알림",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P2:manager-explain-evaluation",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "readerQuestion": "A는 시점·변경·수정·평가·승인 책임을 어떻게 먼저 조정하는가?",
    "coreMeaning": "A가 추상 평가어를 관찰 행동과 기준으로 바꾸기",
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A가 추상 평가어를 관찰 행동과 기준으로 바꾸기",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "실제 관찰·업무 영향·평가 권한이 먼저 확인돼야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "어떤 결과가 왜 기준에 미치지 못했는지 설명하고 수정 시간 제공",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B는 사람 전체가 아니라 바꿀 행동을 알 수 있음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "97fa6fd9e95f85910bf9",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "6a87ebbb37ab5d75d10c",
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
    "workStage": "feedback",
    "workFunctions": [
      "vague_evaluation",
      "canonical"
    ],
    "outputType": "evaluation_gap",
    "positive": "구체적 개선을 검토할 여지",
    "risk": "근거 없는 평점·승진 약속",
    "factBomb": "평가의 근거를 묻는 일을 나쁜 태도로 돌릴 수는 없다",
    "twist": "관계가 좋다는 말보다 기준 예시가 도움이 될 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 적극성이라는 말 대신 필요한 사전 확인 행동 제시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "관찰 항목·기준·지원·재검토 설명",
      "personB": "수정 이해·우선순위 확인"
    },
    "counterexample": "실제 인사평가 절차를 임의 변경하지 않음",
    "distinctFromOtherParagraphs": "A의 기준 설명 책임",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P2:vague-evaluation-no-relation"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P2:vague-evaluation-no-relation",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P2:vague-evaluation-no-relation",
          "sourceKeys": [
            "97fa6fd9e95f85910bf9",
            "6a87ebbb37ab5d75d10c"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 적극성이라는 말 대신 필요한 사전 확인 행동 제시",
      "aChange": "관찰 항목·기준·지원·재검토 설명",
      "bChange": "수정 이해·우선순위 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "evaluation_gap",
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
      "kind": "evaluation",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "관찰 예시와 수정 조건을 함께 알려주실 수 있나요?"
    },
    "managerResponsibleAction": "관찰 항목·기준·지원·재검토 설명",
    "teamMemberAvailableAction": "수정 이해·우선순위 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P2:manager-confirm-final-authority",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P2",
    "address": "CH08.P2",
    "mode": "AB",
    "readerQuestion": "A는 시점·변경·수정·평가·승인 책임을 어떻게 먼저 조정하는가?",
    "coreMeaning": "A가 최종 결정자와 상충 지시 확인 경로를 설명",
    "roleContributions": [
      {
        "address": "CH08.P2.S1",
        "originalRole": "A의 전략",
        "knowledge": "A가 최종 결정자와 상충 지시 확인 경로를 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S2",
        "originalRole": "필요한 이유",
        "knowledge": "V4 역할·십성·미지원 원진은 실제 승인권을 만들지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S3",
        "originalRole": "실천 방법",
        "knowledge": "실제 권한 범위를 확인하고 권한 밖 판단은 정해진 담당자에게 연결",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P2.S4",
        "originalRole": "B에게 남는 변화",
        "knowledge": "B는 누구의 어떤 답변 후 실행할지 구분 가능",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "88af77cc76890045d0ca",
        "sourceUse": "unsupported_comparison_only",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "approval",
    "workFunctions": [
      "unclear_final_authority",
      "canonical"
    ],
    "outputType": "authority_gap",
    "positive": "승인 공백을 확인할 여지",
    "risk": "A가 역할 선언만으로 모든 권한을 약속",
    "factBomb": "상사 역할 선택은 실제 조직의 위임장을 대신하지 않는다",
    "twist": "자기 권한 한계를 설명하는 것이 판단 책임을 지키는 행동일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다른 지시자의 요구와 승인 순서를 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 결정 경로·대리 범위 확인",
      "personB": "상충 조건·필요 결정 시점 공유"
    },
    "counterexample": "미확인 권한은 UNKNOWN 유지",
    "distinctFromOtherParagraphs": "A의 조직 결정 경로 설명",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P2:final-authority-unsupported"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P2:final-authority-unsupported",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P2:final-authority-unsupported",
          "sourceKeys": [
            "88af77cc76890045d0ca",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
      "direction": {
        "direction": "A_TO_B",
        "subject": "A",
        "recipient": "B",
        "tenGodViewer": "B.dayMaster",
        "tenGodTarget": "A.dayMaster",
        "actualProducerRequired": true
      },
      "canonicalClaim": "actual_supported_relation_or_withhold",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 다른 지시자의 요구와 승인 순서를 확인",
      "aChange": "실제 결정 경로·대리 범위 확인",
      "bChange": "상충 조건·필요 결정 시점 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "authority_gap",
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
      "question": "충돌 지시 때 최종 확인할 담당자는 누구인가요?"
    },
    "managerResponsibleAction": "실제 결정 경로·대리 범위 확인",
    "teamMemberAvailableAction": "상충 조건·필요 결정 시점 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P3:report-request-specific-feedback",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "readerQuestion": "B는 안전·사실·용량·자원 안에서 무엇을 확인할 수 있는가?",
    "coreMeaning": "B는 안전이 확인될 때 수정 항목을 구체적으로 요청",
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B는 안전이 확인될 때 수정 항목을 구체적으로 요청",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "공개 인격 판단의 중단 책임은 A에게 있으며 B의 말투가 원인은 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "문서·개별 확인 등 안전한 방식으로 산출물 항목·시간 질문",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A에게 돌아가는 것은 인격 판단을 계속할 허락이 아니라 기준 설명 요청",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "ef731f4b889ed40d780d",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "1fa4cae7d38bb8fe8883",
        "sourceUse": "own_entered_type_only",
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
    "workStage": "feedback",
    "workFunctions": [
      "public_personal_judgment",
      "safety"
    ],
    "outputType": "safe_feedback",
    "positive": "수정 필요를 확인할 여지",
    "risk": "B가 상사의 기분을 달래야 한다고 요구",
    "factBomb": "질문을 예쁘게 해야만 존중받을 권리가 생기는 것은 아니다",
    "twist": "이견 표현보다 안전한 지원 경로 확인이 먼저일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 직접 대응이 어려우면 별도 지원을 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "공개 인격 판단 중단·기준 설명",
      "personB": "안전한 통로에서 구체적 수정 항목 확인"
    },
    "counterexample": "위험한 직접 대화·화해 강요 금지",
    "distinctFromOtherParagraphs": "B 행동을 안전 조건 안의 확인 요청으로 제한",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P3:public-personal-judgment"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P3:public-personal-judgment",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P3:public-personal-judgment",
          "sourceKeys": [
            "ef731f4b889ed40d780d",
            "1fa4cae7d38bb8fe8883",
            "97fa6fd9e95f85910bf9"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "INTP",
              "sourceKey": "ef731f4b889ed40d780d"
            },
            {
              "owner": "B",
              "type": "ISFP",
              "sourceKey": "1fa4cae7d38bb8fe8883"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "INTP",
          "sourceKey": "ef731f4b889ed40d780d",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "1fa4cae7d38bb8fe8883",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 직접 대응이 어려우면 별도 지원을 확인",
      "aChange": "공개 인격 판단 중단·기준 설명",
      "bChange": "안전한 통로에서 구체적 수정 항목 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "safe_feedback",
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
      "question": "안전한 방식으로 구체적 수정 항목을 받을 수 있나요?"
    },
    "managerResponsibleAction": "공개 인격 판단 중단·기준 설명",
    "teamMemberAvailableAction": "안전한 통로에서 구체적 수정 항목 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P3:report-safe-support-route",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "readerQuestion": "B는 안전·사실·용량·자원 안에서 무엇을 확인할 수 있는가?",
    "coreMeaning": "B는 직접 이견이 위험하면 적절한 지원 통로를 확인",
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B는 직접 이견이 위험하면 적절한 지원 통로를 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "실제 보복·법적 판단은 별도이며 불이익 우려를 유형으로 축소하지 않음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "업무 사실·필요 지원을 안전한 방식으로 정리하고 조직 절차 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A에게는 비보복·기준 설명·지원 책임이 남으며 B에게 화해 의무 없음",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "ae0c112b425afed611ff",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "55deedb0770c19853fe3",
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
    "workStage": "feedback",
    "workFunctions": [
      "fear_retaliation",
      "safety"
    ],
    "outputType": "voice_support",
    "positive": "선택 가능한 통로를 확인할 여지",
    "risk": "앱이 보호·익명성·법적 결과를 보장",
    "factBomb": "지원 통로를 찾는 행동은 관계를 망치는 행동으로 취급할 수 없다",
    "twist": "대면 대화가 모든 회복의 첫 단계는 아니다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 직접 지시자 외 적절한 조직 지원 경로 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "위험을 정상화하지 않고 적절한 지원 확인",
      "personB": "안전·동의·지원 필요를 우선 확인"
    },
    "counterexample": "실제 안전 보장·불법 여부 판정 금지",
    "distinctFromOtherParagraphs": "B의 발언 안전과 선택권",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P3:fear-of-retaliation"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P3:fear-of-retaliation",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P3:fear-of-retaliation",
          "sourceKeys": [
            "ae0c112b425afed611ff",
            "55deedb0770c19853fe3"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 직접 지시자 외 적절한 조직 지원 경로 확인",
      "aChange": "위험을 정상화하지 않고 적절한 지원 확인",
      "bChange": "안전·동의·지원 필요를 우선 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "voice_support",
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
      "kind": "safety_support",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "직접 말하기 전 어떤 안전한 지원을 확인할까요?"
    },
    "managerResponsibleAction": "위험을 정상화하지 않고 적절한 지원 확인",
    "teamMemberAvailableAction": "안전·동의·지원 필요를 우선 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P3:report-state-contribution",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "readerQuestion": "B는 안전·사실·용량·자원 안에서 무엇을 확인할 수 있는가?",
    "coreMeaning": "B는 수행·검토·지원 받은 범위를 사실로 구분",
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B는 수행·검토·지원 받은 범위를 사실로 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "기여 누락 여부는 실제 기록과 작업 사실로 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "초안·검증·마무리 항목을 나누고 기록 정정을 요청할 수 있음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A는 제시된 사실을 검토해 기여 출처를 정확히 남길 책임",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "f1a63049534f1dfb09b7",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "15401c66ebefeba6594d",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:STATUS_DRIVE:recognition-target",
        "axis": "STATUS_DRIVE",
        "definition": "무엇을 인정받고 싶은지 명시",
        "condition": "본인이 말한 평가 기대가 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "delivery",
    "workFunctions": [
      "insufficient_credit",
      "recognition"
    ],
    "outputType": "credit_gap",
    "positive": "기여 정보를 명료히 할 여지",
    "risk": "B에게 과도한 자기 홍보를 해결책으로 강요",
    "factBomb": "기여를 말하는 능력이 기여 자체를 대신하지 않는다",
    "twist": "칭찬 요청보다 기록의 정확성 요청이 먼저일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 검증 담당이 빠진 제출 기록의 정정 요청",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "수행 사실 확인·기여 기록 정리",
      "personB": "수행 범위·지원 받은 항목 제시"
    },
    "counterexample": "확인되지 않은 성과를 부풀리지 않음",
    "distinctFromOtherParagraphs": "B의 사실 기록 요청",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P3:insufficient-credit"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P3:insufficient-credit",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P3:insufficient-credit",
          "sourceKeys": [
            "f1a63049534f1dfb09b7",
            "15401c66ebefeba6594d",
            "97fa6fd9e95f85910bf9"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "f1a63049534f1dfb09b7"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "15401c66ebefeba6594d"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "f1a63049534f1dfb09b7",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "15401c66ebefeba6594d",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 검증 담당이 빠진 제출 기록의 정정 요청",
      "aChange": "수행 사실 확인·기여 기록 정리",
      "bChange": "수행 범위·지원 받은 항목 제시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "credit_gap",
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
      "kind": "recognition",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "제가 수행한 항목과 지원 받은 항목을 나눠 남길까요?"
    },
    "managerResponsibleAction": "수행 사실 확인·기여 기록 정리",
    "teamMemberAvailableAction": "수행 범위·지원 받은 항목 제시",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P3:report-state-capacity",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "readerQuestion": "B는 안전·사실·용량·자원 안에서 무엇을 확인할 수 있는가?",
    "coreMeaning": "B는 작업량·충돌 시각·가능 범위를 사실로 알림",
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B는 작업량·충돌 시각·가능 범위를 사실로 알림",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "우선순위·기한·지원 결정은 권한 있는 관리자가 검토해야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "현재 작업을 적고 동시에 어려운 부분의 조정을 요청",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A는 B의 과로 약속 대신 중단·연기·지원 선택을 답해야 함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "80abdb3362bb5a5279c3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "15401c66ebefeba6594d",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:RECOVERY_NEED:load-recognition",
        "axis": "RECOVERY_NEED",
        "definition": "현재 부담과 쉬는 필요를 알아봄",
        "condition": "실제 생활·업무 부하가 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "overload",
      "allocation"
    ],
    "outputType": "load_gap",
    "positive": "작업량을 관리 정보로 전환 가능",
    "risk": "B에게 혼자 완벽히 거절하라고 요구",
    "factBomb": "업무량을 알리는 보고는 상사의 배분 책임을 빼앗는 일이 아니다",
    "twist": "못한다는 결론보다 무엇을 바꿀지 확인할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 겹치는 마감 두 개와 추가 요청을 함께 표시",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "우선순위·자원 조정 결정",
      "personB": "소요·충돌·가능 범위 공유"
    },
    "counterexample": "실제 근로·건강 판단은 별도 지원",
    "distinctFromOtherParagraphs": "B의 용량 정보와 A의 배분 결정을 구분",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P3:overload-allocation"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P3:overload-allocation",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P3:overload-allocation",
          "sourceKeys": [
            "80abdb3362bb5a5279c3",
            "15401c66ebefeba6594d",
            "59caf289010ad94aa04b"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "80abdb3362bb5a5279c3"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "15401c66ebefeba6594d"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "80abdb3362bb5a5279c3",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "15401c66ebefeba6594d",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 겹치는 마감 두 개와 추가 요청을 함께 표시",
      "aChange": "우선순위·자원 조정 결정",
      "bChange": "소요·충돌·가능 범위 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "load_gap",
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
      "question": "가능 범위에 맞춰 우선순위를 정해 주실 수 있나요?"
    },
    "managerResponsibleAction": "우선순위·자원 조정 결정",
    "teamMemberAvailableAction": "소요·충돌·가능 범위 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P3:report-name-blocked-resource",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P3",
    "address": "CH08.P3",
    "mode": "BA",
    "readerQuestion": "B는 안전·사실·용량·자원 안에서 무엇을 확인할 수 있는가?",
    "coreMeaning": "B는 막힌 단계와 필요한 자원을 구체적으로 알림",
    "roleContributions": [
      {
        "address": "CH08.P3.S1",
        "originalRole": "B의 전략",
        "knowledge": "B는 막힌 단계와 필요한 자원을 구체적으로 알림",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S2",
        "originalRole": "필요한 이유",
        "knowledge": "자원·보안·접근 권한은 실제 절차로 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S3",
        "originalRole": "다른 실천 방법",
        "knowledge": "무엇이 없어서 어떤 수행이 멈췄는지와 필요 시점을 전달",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P3.S4",
        "originalRole": "A에게 남는 변화",
        "knowledge": "A는 해결 연결·대안·기한 중 지원 결정을 확인",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "17a595663fd8055c13b7",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7912252da76a38abbace",
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
    "workStage": "execution",
    "workFunctions": [
      "lack_resources",
      "support"
    ],
    "outputType": "resource_gap",
    "positive": "막힘을 조기에 연결할 여지",
    "risk": "권한 없는 우회로 문제를 해결하게 함",
    "factBomb": "자원 공백 보고는 능력 부족의 자백이 아니다",
    "twist": "상사의 지원은 답을 주기보다 담당자를 연결하는 행동일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 승인된 자료 접근 요청의 대기 영향을 공유",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "지원 담당·가능 시점·대안 결정",
      "personB": "필요 자원·막힘·영향 구분"
    },
    "counterexample": "보안·승인 우회 금지",
    "distinctFromOtherParagraphs": "B의 지원 요청을 수행 정보로 정리",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P3:insufficient-resources"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P3:insufficient-resources",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P3:insufficient-resources",
          "sourceKeys": [
            "17a595663fd8055c13b7",
            "7912252da76a38abbace"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [],
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 승인된 자료 접근 요청의 대기 영향을 공유",
      "aChange": "지원 담당·가능 시점·대안 결정",
      "bChange": "필요 자원·막힘·영향 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "resource_gap",
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
      "kind": "resource_support",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "어떤 담당자와 언제까지 자원을 확인하나요?"
    },
    "managerResponsibleAction": "지원 담당·가능 시점·대안 결정",
    "teamMemberAvailableAction": "필요 자원·막힘·영향 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P4:agree-early-risk-response",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "readerQuestion": "둘은 보고·의견·결정·변경·정보 경계를 어떻게 확인하는가?",
    "coreMeaning": "둘은 잠정 위험과 확정 결과를 구별하는 목표를 정함",
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "둘은 잠정 위험과 확정 결과를 구별하는 목표를 정함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A는 미확인 보고를 받고 지원·결정 응답 시점을 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B는 관찰 사실·불확실성·다음 확인을 정해진 통로로 공유",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "보고 의무와 관리 반응을 함께 재확인하고 안전 문제는 별도 지원",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "16577eb313d7ad41b01b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ab7a3cfbec4c729e713c",
        "sourceUse": "own_entered_type_only",
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
      "delayed_risk_report",
      "reporting"
    ],
    "outputType": "early_report_gap",
    "positive": "조기 판단을 도울 여지",
    "risk": "불확실성을 숨겨 긍정 보고만 남김",
    "factBomb": "좋은 소식만 받는 관계는 실제 상황을 보지 못할 수 있다",
    "twist": "문제 수를 줄이기보다 문제를 알 시점을 앞당길 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 위험 상태가 바뀔 때만 예외 보고",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "초기 정보 수용·지원 응답 명시",
      "personB": "상태 변화·영향·다음 확인 전달"
    },
    "counterexample": "안전 의무는 정해진 절차 우선",
    "distinctFromOtherParagraphs": "공동 목표 속 다른 보고·응답 책임",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P4:late-risk-report"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P4:late-risk-report",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P4:late-risk-report",
          "sourceKeys": [
            "16577eb313d7ad41b01b",
            "ab7a3cfbec4c729e713c",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "16577eb313d7ad41b01b"
            },
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "ab7a3cfbec4c729e713c"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "16577eb313d7ad41b01b",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "ab7a3cfbec4c729e713c",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 위험 상태가 바뀔 때만 예외 보고",
      "aChange": "초기 정보 수용·지원 응답 명시",
      "bChange": "상태 변화·영향·다음 확인 전달",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "early_report_gap",
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
      "question": "잠정 위험을 언제 알리고 누가 언제 답하나요?"
    },
    "managerResponsibleAction": "초기 정보 수용·지원 응답 명시",
    "teamMemberAvailableAction": "상태 변화·영향·다음 확인 전달",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P4:agree-multiple-voice-channels",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "readerQuestion": "둘은 보고·의견·결정·변경·정보 경계를 어떻게 확인하는가?",
    "coreMeaning": "둘은 결정 전 필요한 실행 정보를 놓치지 않기로 정함",
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "둘은 결정 전 필요한 실행 정보를 놓치지 않기로 정함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A는 사전 자료·검토 시간·대체 의견 통로 마련",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B는 안전한 방식으로 확인한 반례·질문을 제시",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "발언 속도 대신 결정에 반영할 정보의 존재를 확인",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "16577eb313d7ad41b01b",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "4d4a080342aae90654f6",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "ae0c112b425afed611ff",
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
    "workStage": "review",
    "workFunctions": [
      "excluded_voice",
      "safety"
    ],
    "outputType": "voice_gap",
    "positive": "다른 정보 참여를 열 여지",
    "risk": "강제 발언으로 안전을 대신함",
    "factBomb": "모두에게 말하라고 시키는 것과 모두의 정보를 듣는 것은 다르다",
    "twist": "회의 시간을 늘리지 않고 사전 질문을 열 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 문서 의견 시한 뒤 결정 사항 공유",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "응답 경로·검토 시점·결정 이유 설명",
      "personB": "검토 의견·미확인 항목 전달"
    },
    "counterexample": "보복 우려에서는 별도 지원 먼저",
    "distinctFromOtherParagraphs": "공동 의견 통로와 책임 구분",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P4:excluded-team-voice"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P4:excluded-team-voice",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P4:excluded-team-voice",
          "sourceKeys": [
            "16577eb313d7ad41b01b",
            "4d4a080342aae90654f6",
            "ae0c112b425afed611ff"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENTJ",
              "sourceKey": "16577eb313d7ad41b01b"
            },
            {
              "owner": "B",
              "type": "ISFP",
              "sourceKey": "4d4a080342aae90654f6"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENTJ",
          "sourceKey": "16577eb313d7ad41b01b",
          "domain": "COMMUNICATION"
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "4d4a080342aae90654f6",
          "domain": "COMMUNICATION"
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 문서 의견 시한 뒤 결정 사항 공유",
      "aChange": "응답 경로·검토 시점·결정 이유 설명",
      "bChange": "검토 의견·미확인 항목 전달",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "voice_gap",
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
      "kind": "safety_support",
      "actualAuthority": "UNKNOWN",
      "verificationRequired": true,
      "question": "검토 시간과 대체 제출 통로를 정할까요?"
    },
    "managerResponsibleAction": "응답 경로·검토 시점·결정 이유 설명",
    "teamMemberAvailableAction": "검토 의견·미확인 항목 전달",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P4:agree-retained-manager-decision",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "readerQuestion": "둘은 보고·의견·결정·변경·정보 경계를 어떻게 확인하는가?",
    "coreMeaning": "둘은 수행과 최종 결정의 경계를 유지하는 목표를 정함",
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "둘은 수행과 최종 결정의 경계를 유지하는 목표를 정함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A는 실제 권한의 결정·상위 확인·자원 지원을 맡음",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B는 실행 상태·선택지·결정 필요 시점을 알림",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "주도성이라는 말로 권한 밖 결정을 떠넘기지 않는 원칙",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "d23874cc920e78330b98",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "17a595663fd8055c13b7",
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
    "workStage": "approval",
    "workFunctions": [
      "manager_responsibility_transfer",
      "authority"
    ],
    "outputType": "decision_transfer_gap",
    "positive": "결정 책임을 예측 가능하게 할 여지",
    "risk": "책임 목록이 실제 위임 권한을 대신함",
    "factBomb": "정보를 보고한 사람과 최종 결정한 사람은 구분돼야 한다",
    "twist": "팀원 제안이 많아져도 관리 책임은 남길 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 선택지 보고 뒤 승인·미결 상태를 남김",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "결정 결과·보류 이유·다음 응답 시점 명시",
      "personB": "실행 가능 범위·결정 요청 구분"
    },
    "counterexample": "법적 책임 판정·조직 권한 날조 금지",
    "distinctFromOtherParagraphs": "공동 절차 속 관리 결정 보존",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P4:manager-responsibility-transfer"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P4:manager-responsibility-transfer",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P4:manager-responsibility-transfer",
          "sourceKeys": [
            "d23874cc920e78330b98",
            "17a595663fd8055c13b7"
          ],
          "typePredicates": [],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 선택지 보고 뒤 승인·미결 상태를 남김",
      "aChange": "결정 결과·보류 이유·다음 응답 시점 명시",
      "bChange": "실행 가능 범위·결정 요청 구분",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "decision_transfer_gap",
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
      "question": "수행·제안·승인·지원 담당을 구분할까요?"
    },
    "managerResponsibleAction": "결정 결과·보류 이유·다음 응답 시점 명시",
    "teamMemberAvailableAction": "실행 가능 범위·결정 요청 구분",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P4:agree-change-log",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "readerQuestion": "둘은 보고·의견·결정·변경·정보 경계를 어떻게 확인하는가?",
    "coreMeaning": "둘은 지시 변경의 출처와 영향을 남기기로 정함",
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "둘은 지시 변경의 출처와 영향을 남기기로 정함",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A는 이유·기준·기한·중단 작업을 명시",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B는 이전 수행·추가 소요·미완료를 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "다음 검토에서 기록된 기준과 실제 요구가 같은지 확인",
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
        "owner": "B",
        "sourceKey": "c3c4464cae8ed35c5fd1",
        "sourceUse": "own_entered_type_only",
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
    "workStage": "revision",
    "workFunctions": [
      "missing_change_history",
      "change"
    ],
    "outputType": "change_record_gap",
    "positive": "재작업의 원인을 추적할 여지",
    "risk": "기록을 사람 비난 자료로만 사용",
    "factBomb": "기록은 팀원 실수만 모으는 장부가 아니어야 한다",
    "twist": "상사 변경도 남겨야 기록이 더 공정해질 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 변경 한 번마다 범위·영향·결정자 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "변경 사유·지원·일정 책임 명시",
      "personB": "추가 수행·영향 사실 확인"
    },
    "counterexample": "과거 기록 임의 삭제 금지",
    "distinctFromOtherParagraphs": "합의 변경의 버전·이력 확인",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P4:missing-change-history"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P4:missing-change-history",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P4:missing-change-history",
          "sourceKeys": [
            "76d4c68e32d1662f8abf",
            "c3c4464cae8ed35c5fd1",
            "154edb00b2c3dca6d39c"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "76d4c68e32d1662f8abf"
            },
            {
              "owner": "B",
              "type": "ISTJ",
              "sourceKey": "c3c4464cae8ed35c5fd1"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "76d4c68e32d1662f8abf",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "c3c4464cae8ed35c5fd1",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 변경 한 번마다 범위·영향·결정자 확인",
      "aChange": "변경 사유·지원·일정 책임 명시",
      "bChange": "추가 수행·영향 사실 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "change_record_gap",
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
      "question": "변경자·이유·범위·기한을 함께 남길까요?"
    },
    "managerResponsibleAction": "변경 사유·지원·일정 책임 명시",
    "teamMemberAvailableAction": "추가 수행·영향 사실 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH08.P4:agree-report-purpose",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH08",
    "paragraphId": "P4",
    "address": "CH08.P4",
    "mode": "JOINT",
    "readerQuestion": "둘은 보고·의견·결정·변경·정보 경계를 어떻게 확인하는가?",
    "coreMeaning": "둘은 업무 판단에 필요한 정보 범위를 확인",
    "roleContributions": [
      {
        "address": "CH08.P4.S1",
        "originalRole": "공동 목표",
        "knowledge": "둘은 업무 판단에 필요한 정보 범위를 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S2",
        "originalRole": "A의 역할",
        "knowledge": "A는 수집 목적·이용자·점검 주기·지원 행동을 설명",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S3",
        "originalRole": "B의 역할",
        "knowledge": "B는 합의한 업무 상태를 제공하고 무관한 사생활과 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH08.P4.S4",
        "originalRole": "관계별 원칙",
        "knowledge": "필요한 판단 정보와 상시 노출 요구를 구별하는 원칙",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "80abdb3362bb5a5279c3",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "412d7ea5f91628d61b5d",
        "sourceUse": "own_entered_type_only",
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
        "id": "sar:facet:BOUNDARY:refusal",
        "axis": "BOUNDARY",
        "definition": "받지 않을 요청을 명시",
        "condition": "거절의 안전과 실제 의무 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "maintenance",
    "workFunctions": [
      "reporting_surveillance",
      "reporting"
    ],
    "outputType": "report_boundary",
    "positive": "업무 정보의 사용을 예측할 여지",
    "risk": "보고 조율로 실제 감시 적법성을 판정",
    "factBomb": "모든 정보를 알아야 좋은 상사가 되는 것은 아니다",
    "twist": "적게 모으고 실제 결정에 쓰는 정보가 더 유용할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 작업 상태 보고에서 개인 온라인 반응을 제외",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "목적·범위·사용·지원 통로 명시",
      "personB": "업무 상태와 개인 정보 경계 확인"
    },
    "counterexample": "법률·보안·조직 정책은 별도 확인",
    "distinctFromOtherParagraphs": "공동 보고 원칙의 정보 경계",
    "precedingMeaningRefs": [
      "mrpr:material:CH07.P4:reporting-versus-surveillance"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH07.P4:reporting-versus-surveillance",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      }
    ],
    "requirements": {
      "policyRef": "mrpr:binding-policy:v1",
      "sourceGroups": [
        {
          "groupId": "mrpr:material:CH07.P4:reporting-versus-surveillance",
          "sourceKeys": [
            "80abdb3362bb5a5279c3",
            "412d7ea5f91628d61b5d",
            "7394a0c2a7a725f0d533"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "80abdb3362bb5a5279c3"
            },
            {
              "owner": "B",
              "type": "ISTP",
              "sourceKey": "412d7ea5f91628d61b5d"
            }
          ],
          "allSourcesWithinGroupRequired": true
        }
      ],
      "groupPolicy": "compatible_actually_displayed_group_only",
      "allAncestorDomainAndOwnerReviewRequired": true,
      "typePredicates": [
        {
          "owner": "A",
          "type": "ENFJ",
          "sourceKey": "80abdb3362bb5a5279c3",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISTP",
          "sourceKey": "412d7ea5f91628d61b5d",
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
      "introducedRequired": true
    },
    "repair": {
      "firstFactCheck": "가상: 작업 상태 보고에서 개인 온라인 반응을 제외",
      "aChange": "목적·범위·사용·지원 통로 명시",
      "bChange": "업무 상태와 개인 정보 경계 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "report_boundary",
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
      "question": "업무 판단과 무관한 정보는 어떻게 구분하나요?"
    },
    "managerResponsibleAction": "목적·범위·사용·지원 통로 명시",
    "teamMemberAvailableAction": "업무 상태와 개인 정보 경계 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  }
];
