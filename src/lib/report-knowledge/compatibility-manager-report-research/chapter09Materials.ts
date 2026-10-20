/** Static offline managerReport research. No runtime registration or customer approval. */
import type { ManagerReportMaterial } from "./researchTypes";
export const MR_CH09_MATERIALS: readonly ManagerReportMaterial[] = [
  {
    "id": "mrpr:material:CH09.P1:recall-goal-execution",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "mode": "RECALL",
    "readerQuestion": "실제로 표시된 접점·공통 완료 조건만 어떻게 지속하는가?",
    "coreMeaning": "표시된 목표·실행 접점을 지속하기",
    "roleContributions": [
      {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "앞서 실제 표시된 목적과 과정의 연결만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "같은 두 사람의 실제 원국·MBTI 출처와 표시 이력이 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "A의 목표 설명과 B의 실행 질문이 다른 정보를 보탤 가능성",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "목표·방법·질문 통로가 계속 확인돼야 함",
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
      "recall",
      "goal"
    ],
    "outputType": "introduced_goal",
    "positive": "알아들은 범위를 반복 확인할 여지",
    "risk": "후보 존재만으로 좋은 관계 이력 생성",
    "factBomb": "앞에서 말하지 않은 강점을 마지막에 사실로 꺼낼 수는 없다",
    "twist": "좋은 끝맺음도 실제 소개된 질문을 다시 여는 선택일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 과제에도 목적과 필수 조건을 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "목표·지원 조건을 설명",
      "personB": "실행 질문·미확인 항목 제시"
    },
    "counterexample": "actuallyDisplayed ledger 없으면 고객 적용 보류",
    "distinctFromOtherParagraphs": "새 강점 아닌 핵심 접점 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH01.P1:goal-method-interface"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH01.P1:goal-method-interface",
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
          "groupId": "mrpr:material:CH01.P1:goal-method-interface",
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
      "firstFactCheck": "가상: 다음 과제에도 목적과 필수 조건을 확인",
      "aChange": "목표·지원 조건을 설명",
      "bChange": "실행 질문·미확인 항목 제시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_goal",
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
      "question": "다음 과제에서도 먼저 확인할 목표·방법 질문은 무엇인가요?"
    },
    "managerResponsibleAction": "목표·지원 조건을 설명",
    "teamMemberAvailableAction": "실행 질문·미확인 항목 제시",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P1:recall-shared-completion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P1",
    "address": "CH09.P1",
    "mode": "RECALL",
    "readerQuestion": "실제로 표시된 접점·공통 완료 조건만 어떻게 지속하는가?",
    "coreMeaning": "표시된 공통 완결 선호의 역할 차이 유지",
    "roleContributions": [
      {
        "address": "CH09.P1.S1",
        "originalRole": "긍정적 특징",
        "knowledge": "앞서 표시된 완료 기준·수행 정보만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S2",
        "originalRole": "실제 명리·MBTI",
        "knowledge": "각자 원천·과제·표시 이력이 일치해야 함",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S3",
        "originalRole": "함께하는 장점",
        "knowledge": "A는 기준·자원 B는 수행·미완료를 맡는 장점",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P1.S4",
        "originalRole": "지속 조건",
        "knowledge": "끝내려는 마음이 과부하가 되지 않을 종료선 유지",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "871f1880dae3d3831abc",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "e5bb3aac2a342fa953aa",
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
        "id": "sar:facet:DUTY:role-fulfilment",
        "axis": "DUTY",
        "definition": "합의한 담당을 이행",
        "condition": "담당·권한·기한이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "delivery",
    "workFunctions": [
      "recall",
      "completion"
    ],
    "outputType": "introduced_completion",
    "positive": "마무리를 구체화할 여지",
    "risk": "공통 성향을 성과 보장으로 확대",
    "factBomb": "함께 끝내고 싶어도 맡은 책임은 같지 않다",
    "twist": "공통점이 오래가려면 서로 다른 역할을 남길 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 제출에서도 필수 항목과 검토를 분리",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "완료 기준·지원 확인",
      "personB": "남은 수행·검토 필요 공유"
    },
    "counterexample": "같은 root·과제·실제 표시 확인 전 보류",
    "distinctFromOtherParagraphs": "공통점의 재진술보다 지속 조건 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH04.P1:shared-completion-distinct-duty"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH04.P1:shared-completion-distinct-duty",
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
          "groupId": "mrpr:material:CH04.P1:shared-completion-distinct-duty",
          "sourceKeys": [
            "871f1880dae3d3831abc",
            "e5bb3aac2a342fa953aa",
            "d23874cc920e78330b98"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ISTJ",
              "sourceKey": "871f1880dae3d3831abc"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "e5bb3aac2a342fa953aa"
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
          "sourceKey": "871f1880dae3d3831abc",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ESFJ",
          "sourceKey": "e5bb3aac2a342fa953aa",
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
      "firstFactCheck": "가상: 다음 제출에서도 필수 항목과 검토를 분리",
      "aChange": "완료 기준·지원 확인",
      "bChange": "남은 수행·검토 필요 공유",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_completion",
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
      "question": "완료 기준과 각자의 남은 역할을 다시 확인할까요?"
    },
    "managerResponsibleAction": "완료 기준·지원 확인",
    "teamMemberAvailableAction": "남은 수행·검토 필요 공유",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P2:recall-supported-possibility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "mode": "RECALL",
    "readerQuestion": "표시된 지원·개인 Fusion의 호환 의미를 어떻게 활용하는가?",
    "coreMeaning": "실제 소개된 지원 가능성을 활용하기",
    "roleContributions": [
      {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "B에게 맞는 A 지원의 검증된 부분만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "동일 A/B·AB방향·수신 십성·개인 원천·실제 표시가 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "접근 경로·담당·시점이 확인돼야 지원 가능성으로 남음",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "다음 막힘에도 필요한 자원과 응답을 구체적으로 요청",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "5b778076e2f7f6a60f75",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "B",
        "sourceKey": "ab01acce90e1dd368d2d",
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
        "sourceKey": "7912252da76a38abbace",
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
    "workStage": "execution",
    "workFunctions": [
      "recall",
      "support"
    ],
    "outputType": "introduced_support",
    "positive": "지원 창구를 활용할 여지",
    "risk": "정인을 실제 보호·성공 경험으로 표현",
    "factBomb": "지원의 좋은 기운은 권한 없는 약속을 대신하지 못한다",
    "twist": "상사가 답을 직접 몰라도 연결 책임을 맡을 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 막힘에서도 지원 담당·시점을 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확인 가능한 지원·연결 책임 명시",
      "personB": "막힌 단계·필요 자원 설명"
    },
    "counterexample": "후보·계산만으로 실제 도움 받은 이력 생성 금지",
    "distinctFromOtherParagraphs": "AB 실제 지원 의미 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH05.P2:manager-resource-removal"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH05.P2:manager-resource-removal",
        "expectedMode": "AB",
        "direction": "A_TO_B",
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
          "groupId": "mrpr:material:CH05.P2:manager-resource-removal",
          "sourceKeys": [
            "5b778076e2f7f6a60f75",
            "ab01acce90e1dd368d2d",
            "fe11b875c7ad3a9c8318",
            "7912252da76a38abbace"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "5b778076e2f7f6a60f75"
            },
            {
              "owner": "B",
              "type": "INTP",
              "sourceKey": "ab01acce90e1dd368d2d"
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
          "sourceKey": "5b778076e2f7f6a60f75",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "ab01acce90e1dd368d2d",
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
      "firstFactCheck": "가상: 다음 막힘에서도 지원 담당·시점을 확인",
      "aChange": "확인 가능한 지원·연결 책임 명시",
      "bChange": "막힌 단계·필요 자원 설명",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_support",
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
      "question": "다음 막힘에 활용할 확인된 지원 경로는 무엇인가요?"
    },
    "managerResponsibleAction": "확인 가능한 지원·연결 책임 명시",
    "teamMemberAvailableAction": "막힌 단계·필요 자원 설명",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P2:recall-personal-fusion",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P2",
    "address": "CH09.P2",
    "mode": "RECALL",
    "readerQuestion": "표시된 지원·개인 Fusion의 호환 의미를 어떻게 활용하는가?",
    "coreMeaning": "표시된 B의 실제 정보 기여만 활용",
    "roleContributions": [
      {
        "address": "CH09.P2.S1",
        "originalRole": "검증된 좋은 기운",
        "knowledge": "원국·MBTI가 만난 개인 Fusion의 호환된 의미만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S2",
        "originalRole": "근거와 의미",
        "knowledge": "B 개인의 실제 두 root·rule·context와 BA표시 이력이 필요",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S3",
        "originalRole": "관계의 가능성",
        "knowledge": "B의 실제 검토 정보가 A의 계획 확인에 쓰일 가능성",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P2.S4",
        "originalRole": "현실적 활용",
        "knowledge": "가정·관찰·결정 필요를 구분하는 현실 행동으로 활용",
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
      "recall",
      "fusion"
    ],
    "outputType": "introduced_fusion",
    "positive": "정보의 설명력을 유지할 여지",
    "risk": "개인 Fusion을 공동 궁합 점수로 합산",
    "factBomb": "두 체계가 같은 사람을 설명해도 새 궁합 점수는 아니다",
    "twist": "팀원의 반례가 공동 목표를 더 선명하게 할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 계획의 가정과 실제 결과를 비교",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 정보를 검토해 결정·지원",
      "personB": "관찰·영향·미확인을 분리"
    },
    "counterexample": "Fusion root·방향·실제 표시 없으면 보류",
    "distinctFromOtherParagraphs": "계산된 개인 연결의 출처를 보존한 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH06.P1:report-to-manager-reality-check"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH06.P1:report-to-manager-reality-check",
        "expectedMode": "BA",
        "direction": "B_TO_A",
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
      "groupPolicy": "compatible_actually_displayed_group_only",
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
      "firstFactCheck": "가상: 계획의 가정과 실제 결과를 비교",
      "aChange": "실제 정보를 검토해 결정·지원",
      "bChange": "관찰·영향·미확인을 분리",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_fusion",
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
      "question": "실제 정보가 바꾸는 가정과 필요한 결정을 구분할까요?"
    },
    "managerResponsibleAction": "실제 정보를 검토해 결정·지원",
    "teamMemberAvailableAction": "관찰·영향·미확인을 분리",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P3:recall-delegation-principle",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "mode": "RECALL",
    "readerQuestion": "표시된 위임·안전 원칙을 어떤 조건에서 유지하는가?",
    "coreMeaning": "실제로 소개된 결정 경계만 지속",
    "roleContributions": [
      {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "앞서 실제 표시된 조율 원칙과 같은 인물·과제의 의미만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "A는 기준·지원 B는 수행 범위가 필요한 독립 이유",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "확인된 결정 범위·응답 책임·기한을 다음 과제에도 점검",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "과제가 달라지면 과거 합의를 자동으로 확대하지 않음",
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
        "id": "sar:facet:AUTONOMY:choice-ownership",
        "axis": "AUTONOMY",
        "definition": "자신에게 속한 선택을 확인",
        "condition": "영향받는 사람과 권한 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "recall",
      "delegation"
    ],
    "outputType": "introduced_delegation",
    "positive": "재량·승인 대기를 구별할 여지",
    "risk": "한 번 합의로 모든 권한 확인 완료 선언",
    "factBomb": "위임의 범위는 과제가 바뀌면 다시 물어야 한다",
    "twist": "좋은 원칙도 상황에 맞게 좁히는 것이 지속 조건일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 과제에서 승인 경계를 새로 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 범위·지원·응답을 재확인",
      "personB": "변경된 수행 조건을 알림"
    },
    "counterexample": "같은 task·owner·actuallyDisplayed 확인 필요",
    "distinctFromOtherParagraphs": "강점 요약 아닌 결정 원칙 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH08.P1:delegate-decision"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH08.P1:delegate-decision",
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
      "firstFactCheck": "가상: 다음 과제에서 승인 경계를 새로 확인",
      "aChange": "실제 범위·지원·응답을 재확인",
      "bChange": "변경된 수행 조건을 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_delegation",
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
      "question": "새 과제에서 재량과 승인 경계가 달라졌나요?"
    },
    "managerResponsibleAction": "실제 범위·지원·응답을 재확인",
    "teamMemberAvailableAction": "변경된 수행 조건을 알림",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P3:recall-safe-voice",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P3",
    "address": "CH09.P3",
    "mode": "RECALL",
    "readerQuestion": "표시된 위임·안전 원칙을 어떤 조건에서 유지하는가?",
    "coreMeaning": "실제로 소개된 안전한 지원 선택을 유지",
    "roleContributions": [
      {
        "address": "CH09.P3.S1",
        "originalRole": "조율 원칙",
        "knowledge": "앞서 실제 표시된 조율 원칙과 같은 인물·과제의 의미만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S2",
        "originalRole": "개인별 이유",
        "knowledge": "관리 책임과 팀원 발언 위험은 같은 조건이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S3",
        "originalRole": "실천 행동",
        "knowledge": "A는 안전한 질문·지원 조건 B는 가능한 통로를 확인",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P3.S4",
        "originalRole": "지속 조건",
        "knowledge": "보복 우려가 있으면 직접 화해보다 적절한 별도 지원을 우선",
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
      "recall",
      "safety"
    ],
    "outputType": "introduced_safety",
    "positive": "필요 지원을 확인할 여지",
    "risk": "관계를 오래 지키기 위해 위험을 참게 함",
    "factBomb": "관계의 지속이 안전보다 앞서는 의무는 아니다",
    "twist": "안전한 거리를 두는 선택도 고려할 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 직접 대화 전 지원 경로를 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "위험을 정상화하지 않고 지원 확인",
      "personB": "안전·동의·선택 가능한 통로 확인"
    },
    "counterexample": "보호·안전·법적 결과를 보장하지 않음",
    "distinctFromOtherParagraphs": "실제 소개된 안전 원칙의 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH08.P3:report-safe-support-route"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH08.P3:report-safe-support-route",
        "expectedMode": "BA",
        "direction": "B_TO_A",
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
      "firstFactCheck": "가상: 직접 대화 전 지원 경로를 확인",
      "aChange": "위험을 정상화하지 않고 지원 확인",
      "bChange": "안전·동의·선택 가능한 통로 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_safety",
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
      "question": "관계를 조율하기 전 어떤 안전 조건을 확인하나요?"
    },
    "managerResponsibleAction": "위험을 정상화하지 않고 지원 확인",
    "teamMemberAvailableAction": "안전·동의·선택 가능한 통로 확인",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P4:recall-decision-responsibility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "mode": "RECALL",
    "readerQuestion": "정보·결정·기여·수정·지원의 다른 책임을 어떻게 남기는가?",
    "coreMeaning": "표시된 정보와 결정의 다른 역할로 마무리",
    "roleContributions": [
      {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "B가 상태·선택지를 알리고 A가 실제 권한 안의 결정을 확인하는 상호작용",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "정보와 판단이 이어질 가능성이지 과거 성공 사실이 아님",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "함께 기억할 기준은 수행·제안·승인·지원의 구분",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "관리 역할 선언과 실제 권한을 확인하는 관계의 결론",
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
      "recall",
      "authority"
    ],
    "outputType": "introduced_responsibility",
    "positive": "기준을 다음 선택으로 남길 여지",
    "risk": "마지막 메시지에서 평등 책임으로 환원",
    "factBomb": "협력한다는 이유로 관리 책임까지 반씩 나눌 수는 없다",
    "twist": "서로 다른 책임을 인정하는 것이 함께 일할 조건일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 결정에서도 수행과 승인 담당을 확인",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "결정 결과·미결·지원 책임 설명",
      "personB": "실행 상태·결정 필요 전달"
    },
    "counterexample": "실제 표시·동일 인물·과제 범위 없으면 보류",
    "distinctFromOtherParagraphs": "추상 신뢰 대신 역할별 책임 회수",
    "precedingMeaningRefs": [
      "mrpr:material:CH08.P4:agree-retained-manager-decision"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH08.P4:agree-retained-manager-decision",
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
      "firstFactCheck": "가상: 다음 결정에서도 수행과 승인 담당을 확인",
      "aChange": "결정 결과·미결·지원 책임 설명",
      "bChange": "실행 상태·결정 필요 전달",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_responsibility",
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
      "question": "함께 일하기 위해 각자 남길 책임은 무엇인가요?"
    },
    "managerResponsibleAction": "결정 결과·미결·지원 책임 설명",
    "teamMemberAvailableAction": "실행 상태·결정 필요 전달",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  },
  {
    "id": "mrpr:material:CH09.P4:recall-contribution-learning",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH09",
    "paragraphId": "P4",
    "address": "CH09.P4",
    "mode": "RECALL",
    "readerQuestion": "정보·결정·기여·수정·지원의 다른 책임을 어떻게 남기는가?",
    "coreMeaning": "표시된 인정·수정·지원의 좋은 방향",
    "roleContributions": [
      {
        "address": "CH09.P4.S1",
        "originalRole": "특징적인 상호작용",
        "knowledge": "실제로 소개된 기여 기록과 지원된 학습의 교집합만 회수",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S2",
        "originalRole": "함께 만드는 가치",
        "knowledge": "관찰한 기여를 남기고 수정 조건을 함께 바꾸는 가치",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S3",
        "originalRole": "기억할 기준",
        "knowledge": "칭찬·요청·평가·지원은 서로 다른 행동이라는 기준",
        "notIndependentFact": true
      },
      {
        "address": "CH09.P4.S4",
        "originalRole": "관계별 결론",
        "knowledge": "좋은 관계는 팀원의 적응뿐 아니라 관리 행동의 변화도 포함",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "A",
        "sourceKey": "a405c7c47aa46bef385b",
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
      },
      {
        "owner": "A",
        "sourceKey": "80abdb3362bb5a5279c3",
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
        "sourceKey": "c9a09e727fe2ed6dcdbd",
        "sourceUse": "context_guidance_not_person_fact",
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
    "workStage": "maintenance",
    "workFunctions": [
      "recall",
      "recognition"
    ],
    "outputType": "introduced_learning",
    "positive": "다음 검토의 원칙을 남길 여지",
    "risk": "둘 중 표시 안 된 자료를 전부 회수",
    "factBomb": "고맙다는 말 뒤에 바뀌어야 할 업무 조건도 남겨야 한다",
    "twist": "좋은 마지막 문장은 더 참으라는 말보다 확인할 질문일 수 있다",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상: 다음 검토에서 기여·수정·지원 조건을 나눔",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "기여 기록과 자기 지원 개선을 구분",
      "personB": "수행·미완료·지원 필요를 알림"
    },
    "counterexample": "복수 ref는 실제 표시된 호환 subset만 회수",
    "distinctFromOtherParagraphs": "상호작용을 인정·학습의 경계로 마무리",
    "precedingMeaningRefs": [
      "mrpr:material:CH04.P3:feedback-credit-visible",
      "mrpr:material:CH04.P4:learning-with-retained-accountability"
    ],
    "introducedMeaningRequirements": [
      {
        "materialId": "mrpr:material:CH04.P3:feedback-credit-visible",
        "expectedMode": "JOINT",
        "direction": null,
        "actualOwnersMustMatch": true,
        "actualTaskMustMatch": true,
        "actuallyDisplayedRequired": true,
        "mayUseOnlyCompatibleDisplayedSubset": true
      },
      {
        "materialId": "mrpr:material:CH04.P4:learning-with-retained-accountability",
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
          "groupId": "mrpr:material:CH04.P3:feedback-credit-visible",
          "sourceKeys": [
            "a405c7c47aa46bef385b",
            "15401c66ebefeba6594d",
            "97fa6fd9e95f85910bf9"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "a405c7c47aa46bef385b"
            },
            {
              "owner": "B",
              "type": "ESFJ",
              "sourceKey": "15401c66ebefeba6594d"
            }
          ],
          "allSourcesWithinGroupRequired": true
        },
        {
          "groupId": "mrpr:material:CH04.P4:learning-with-retained-accountability",
          "sourceKeys": [
            "80abdb3362bb5a5279c3",
            "1fa4cae7d38bb8fe8883",
            "c9a09e727fe2ed6dcdbd"
          ],
          "typePredicates": [
            {
              "owner": "A",
              "type": "ENFJ",
              "sourceKey": "80abdb3362bb5a5279c3"
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
          "type": "ENFJ",
          "sourceKey": "a405c7c47aa46bef385b",
          "domain": "WORK"
        },
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
        },
        {
          "owner": "B",
          "type": "ISFP",
          "sourceKey": "1fa4cae7d38bb8fe8883",
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
      "firstFactCheck": "가상: 다음 검토에서 기여·수정·지원 조건을 나눔",
      "aChange": "기여 기록과 자기 지원 개선을 구분",
      "bChange": "수행·미완료·지원 필요를 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "introduced_learning",
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
      "question": "기여·수정·지원에서 다음에 바꿀 항목은 무엇인가요?"
    },
    "managerResponsibleAction": "기여 기록과 자기 지원 개선을 구분",
    "teamMemberAvailableAction": "수행·미완료·지원 필요를 알림",
    "safeVoiceCondition": "직접 이견·질문이 안전한지 먼저 확인. 상사는 기준·지원·비보복의 조건을 확인하며 팀원에게 감정 관리·화해 의무를 부과하지 않음. 위험·강압은 적절한 별도 지원·조직 절차를 확인."
  }
];
