/** Static offline coworker research. No runtime registration or customer approval. */
import type { CoworkerMaterial } from "./researchTypes";
export const CW_CH07_MATERIALS: readonly CoworkerMaterial[] = [
  {
    "id": "cwpr:material:CH07.P1:division-gap",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "분담 목록에서 아무도 맡지 않은 통합 작업의 부담을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "분담한 항목과 빠진 연결을 구분한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 작성과 B의 검토는 자동 통합이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 제출본 담당이 비어 있으면 다시 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "소유자 없는 마지막 작업이 갈등의 조건이다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "friction",
      "division"
    ],
    "outputType": "통합 담당 질문",
    "positive": "빠진 담당 발견",
    "risk": "각자 끝냈다고 공동 완료 처리",
    "factBomb": "둘 다 자기 일을 했어도 넘길 한 파일이 없을 수 있다.",
    "twist": "빈 담당 표시가 능력 비난을 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 공동 문서의 통합자가 없다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 완료 범위 표시",
      "personB": "남은 통합 작업 확인"
    },
    "counterexample": "실제 분담 없으면 과거 누락 단정 금지",
    "distinctFromOtherParagraphs": "분담의 빈칸",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 공동 문서의 통합자가 없다면",
      "aChange": "자기 완료 범위 표시",
      "bChange": "남은 통합 작업 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "통합 담당 질문",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P1:responsibility-border",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "한 번 도운 일이 계속 담당으로 굳어지는 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "지원과 책임 인수를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 요청과 B의 수락을 따로 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 도움 이후 다음 담당을 다시 본다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "지원 종료가 없으면 기대가 어긋날 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "983ac049dd4d1607030f",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "friction",
      "responsibility"
    ],
    "outputType": "지원 종료 질문",
    "positive": "지원 범위의 확인",
    "risk": "친절한 사람에게 반복 요청 집중",
    "factBomb": "지난번 도와줬다는 이유가 이번 담당의 근거는 아니다.",
    "twist": "지원 종료를 정하면 다음 요청도 더 명확해진다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 반복 요청의 담당이 불명확하다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "이번 필요한 범위 제시",
      "personB": "가능 범위·종료 알림"
    },
    "counterexample": "실제 도움 이력은 미입력이다.",
    "distinctFromOtherParagraphs": "지원과 담당의 경계",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 반복 요청의 담당이 불명확하다면",
      "aChange": "이번 필요한 범위 제시",
      "bChange": "가능 범위·종료 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "지원 종료 질문",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P1:completion-mismatch",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "초안 완료와 사용 가능 완료가 다를 때 인계의 부담을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "두 완료 표현을 각각 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A의 완료와 B의 수신 준비는 다른 정보다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 검토 전 파일을 최종본으로 받은 경우를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "완료 기준 미합의가 문제 조건이다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "approval",
    "workFunctions": [
      "friction",
      "completion"
    ],
    "outputType": "상태 기준표",
    "positive": "완료의 뜻을 좁히기",
    "risk": "모호한 끝났다는 말로 상태 전달",
    "factBomb": "파일이 있다는 말과 바로 써도 된다는 말은 다르다.",
    "twist": "상태 이름을 나누면 늦었다는 비난이 줄어들 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 초안과 승인본이 섞였다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "현재 파일 상태 표시",
      "personB": "사용에 필요한 조건 질문"
    },
    "counterexample": "실제 승인 권한은 별도 확인",
    "distinctFromOtherParagraphs": "완료의 서로 다른 뜻",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 초안과 승인본이 섞였다면",
      "aChange": "현재 파일 상태 표시",
      "bChange": "사용에 필요한 조건 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "상태 기준표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P1:review-depth-gap",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "항목 오류 검토와 원인 탐색의 깊이가 다를 때 필요한 범위를 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "A의 오류 관심과 B의 원리 질문을 분리한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "한 사람이 더 전문적이라는 근거는 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 수치 수정과 산식 재검토를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "검토 깊이 미합의가 작업량을 바꿀 수 있다.",
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
        "sourceKey": "f666c10a6db231abcc92",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "99abb271c1ef0a874619",
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
      },
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
      "friction",
      "review"
    ],
    "outputType": "검토 수준표",
    "positive": "필요한 검토의 구분",
    "risk": "모든 오류를 전면 분석으로 확대",
    "factBomb": "작은 오류를 찾았다고 항상 전체 원인을 다시 밝혀야 하는 것은 아니다.",
    "twist": "원인 검토를 후속으로 남겨도 현재 수정은 가능하다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 표 한 칸에서 질문이 커진다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "확인할 오류 범위 제시",
      "personB": "원인 검토의 필요 근거 질문"
    },
    "counterexample": "실제 오류·중요도 확인 전 범위 판정 보류",
    "distinctFromOtherParagraphs": "검토 깊이의 차이",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "c7fee219fcf7a5b642fd",
          "domain": "THINKING"
        },
        {
          "owner": "B",
          "type": "INTP",
          "sourceKey": "f666c10a6db231abcc92",
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
      "firstFactCheck": "가상 표 한 칸에서 질문이 커진다면",
      "aChange": "확인할 오류 범위 제시",
      "bChange": "원인 검토의 필요 근거 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "검토 수준표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P1:deadline-dependency",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "최종 마감은 같아도 중간 결과를 받아야 할 시점이 다른 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "A의 작성 종료와 B의 작업 시작을 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "각자 가능한 시간은 실제로 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 인계가 최종 전날이면 B의 시간이 줄 수 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "의존성이 숨으면 마감 갈등이 커진다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "0388561cdeef5da930d4",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:promise-update",
        "axis": "DUTY",
        "definition": "못 지킬 가능성을 미리 알림",
        "condition": "대안·인수인계를 협의할 수 있을 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:STRATEGY:sequence-design",
        "axis": "STRATEGY",
        "definition": "의존 관계에 맞게 순서를 배치",
        "condition": "담당자의 재량·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "handoff",
    "workFunctions": [
      "friction",
      "deadline"
    ],
    "outputType": "의존 일정표",
    "positive": "중간 인계의 확인",
    "risk": "최종 시간만 맞추려 함",
    "factBomb": "내가 늦지 않았어도 동료의 작업 시간은 없을 수 있다.",
    "twist": "부분 인계가 전체를 기다리는 시간을 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 B 검토가 A 초안 뒤에만 가능하다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "초안 일부의 준비 시점 알림",
      "personB": "필수 인계 항목·필요 시점 제시"
    },
    "counterexample": "실제 의존성이 없으면 일정 부담 창작 금지",
    "distinctFromOtherParagraphs": "최종과 중간 마감의 구별",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 B 검토가 A 초안 뒤에만 가능하다면",
      "aChange": "초안 일부의 준비 시점 알림",
      "bChange": "필수 인계 항목·필요 시점 제시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "의존 일정표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P1:priority-conflict",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P1",
    "address": "CH07.P1",
    "mode": "JOINT",
    "readerQuestion": "분담·책임·완료·검토·의존 마감·우선순위에서 어떤 다른 공백이 있는가?",
    "coreMeaning": "각자 받은 우선순위가 충돌할 때 동료가 임의 서열을 정하지 않는 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P1.S1",
        "originalRole": "불일치 또는 확인할 조건",
        "knowledge": "요청의 출처와 실제 시한을 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S2",
        "originalRole": "각자의 성향",
        "knowledge": "A와 B 모두 최종 결정권이 미확인이다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S3",
        "originalRole": "다른 이해",
        "knowledge": "가상 두 작업이 같은 시간을 요구한다면 영향을 적는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P1.S4",
        "originalRole": "답답함의 이유",
        "knowledge": "권한 있는 조정이 필요한지 확인한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "0388561cdeef5da930d4",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
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
    "workStage": "execution",
    "workFunctions": [
      "friction",
      "priority"
    ],
    "outputType": "충돌 요청표",
    "positive": "충돌한 요구의 가시화",
    "risk": "서로 자신의 급함을 명령으로 전달",
    "factBomb": "급한 일이 둘이라는 사실이 두 사람의 시간이 두 배라는 뜻은 아니다.",
    "twist": "미룰 작업을 적으면 필요한 결정이 보일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 상충한 요청 두 개가 왔다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 요청의 근거 공유",
      "personB": "밀릴 작업의 영향 기록"
    },
    "counterexample": "조직 권한을 성향으로 대체하지 않는다.",
    "distinctFromOtherParagraphs": "우선순위 권한의 공백",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 상충한 요청 두 개가 왔다면",
      "aChange": "자기 요청의 근거 공유",
      "bChange": "밀릴 작업의 영향 기록",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "충돌 요청표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:clash-and-current-work",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "실제 寅申 충과 현재 수정 의견의 충돌을 인과로 연결하지 않는다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "교차 충의 실제 refs를 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "전통 긴장 분류를 쉬운 말로 제한한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "A와 B의 현재 다른 반응은 직접 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "충이 있어도 별도 기준으로 조정할 여지는 남는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "SHARED",
        "sourceKey": "21a2cc4649da9423a26d",
        "sourceUse": "actual_canonical_membership_required",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "99abb271c1ef0a874619",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:CHANGE_ORIENTATION:chosen-change",
        "axis": "CHANGE_ORIENTATION",
        "definition": "스스로 선택한 변화와 강제 변화를 구별",
        "condition": "변경 권한과 실제 제약이 확인될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "revision",
    "workFunctions": [
      "friction",
      "canonical"
    ],
    "outputType": "근거·의견 대조",
    "positive": "차이를 질문할 계기",
    "risk": "실제 작업 문제를 모두 충 탓으로 설명",
    "factBomb": "충이 있다는 계산만으로 누가 어떤 실수를 했는지는 알 수 없다.",
    "twist": "구체 자료가 있으면 분류보다 좁은 문제를 고를 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 수정 방향이 다르다면 실제 근거와 의견을 따로 적는다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 의견의 자료 제시",
      "personB": "다른 기준의 이유 확인"
    },
    "counterexample": "실제 충 없으면 해당 관계 설명 보류",
    "distinctFromOtherParagraphs": "계산과 현재 갈등의 층위",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 수정 방향이 다르다면 실제 근거와 의견을 따로 적는다.",
      "aChange": "자기 의견의 자료 제시",
      "bChange": "다른 기준의 이유 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "근거·의견 대조",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:harm-not-hostility",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "실제 子未 해를 상대의 악의나 뒷말의 증거로 쓰지 않는다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "해의 실제 관계 종류·ID를 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "원진 정의와 혼동하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "A의 전달과 B의 수신 차이는 별도 질문한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "의도를 모르면 사실로 확정하지 않는다.",
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
        "sourceKey": "99abb271c1ef0a874619",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:SOCIAL_ATTUNEMENT:interpretation-check",
        "axis": "SOCIAL_ATTUNEMENT",
        "definition": "관찰한 뜻을 당사자에게 묻기",
        "condition": "말하지 않을 선택권을 보장",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "feedback",
    "workFunctions": [
      "friction",
      "canonical"
    ],
    "outputType": "수신 차이 질문",
    "positive": "의도 확인의 경계",
    "risk": "해를 불신·괴롭힘의 확정 근거로 사용",
    "factBomb": "관계 이름은 동료의 속마음을 증명하지 못한다.",
    "twist": "해석을 유보해야 실제 필요한 질문이 남는다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 말이 다르게 전달됐다면 관찰과 추측을 나눈다.",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "관찰한 표현만 말함",
      "personB": "받은 뜻을 확인 질문"
    },
    "counterexample": "실제 부당행위는 단순 오해로 지우지 않는다.",
    "distinctFromOtherParagraphs": "해와 악의의 비동일성",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 말이 다르게 전달됐다면 관찰과 추측을 나눈다.",
      "aChange": "관찰한 표현만 말함",
      "bChange": "받은 뜻을 확인 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "수신 차이 질문",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:half-harmony-not-agreement",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "실제 반합이 있어도 업무 합의의 누락을 대신하지 못함을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "실제 반합의 위치·성립 조건이 필요하다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "합의 분류는 업무 동의 사실이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "각자 이해한 작업 범위를 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "좋은 가능성과 확인할 책임을 함께 남긴다.",
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
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DECISION_STYLE:closure-criteria",
        "axis": "DECISION_STYLE",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "condition": "결정의 영향과 정보 범위가 명시될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "friction",
      "canonical"
    ],
    "outputType": "분담 확인서",
    "positive": "합의 항목을 구체화",
    "risk": "맞는 관계니까 확인 생략",
    "factBomb": "잘 맞을 가능성이 있어도 같은 일을 맡았다는 합의는 따로 필요하다.",
    "twist": "익숙한 관계일수록 짧은 범위 확인이 유용할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 작업 분담을 말로만 정했다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "이해한 범위 적음",
      "personB": "서로 다른 항목 확인"
    },
    "counterexample": "실제 반합 미검출이면 관계 설명 보류",
    "distinctFromOtherParagraphs": "좋은 분류와 실제 합의 구분",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 작업 분담을 말로만 정했다면",
      "aChange": "이해한 범위 적음",
      "bChange": "서로 다른 항목 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "분담 확인서",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:unsupported-punishment",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "미지원 원진 연구를 실제 동료 갈등의 계산으로 만들지 않는다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "현재 producer는 원진을 발급하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "子未 해의 실제 검출과 원진 정의는 다르다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "가상 부담은 일반 업무 조건으로만 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "미지원 분류를 고객 판단에 넣지 않는다.",
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
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "review",
    "workFunctions": [
      "friction",
      "unsupported"
    ],
    "outputType": "미지원 기록",
    "positive": "종류·지원의 정확한 보류",
    "risk": "정의표를 실제 계산으로 승격",
    "factBomb": "연구 자료에 이름이 있다고 실제 근거가 생기는 것은 아니다.",
    "twist": "보류하면 지원되는 관계의 설명이 더 선명해진다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 원진 연구만 참고하려 한다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 계산 결과 확인",
      "personB": "해석 적용 보류"
    },
    "counterexample": "미지원 상태가 바뀌기 전 binding 금지",
    "distinctFromOtherParagraphs": "미지원 관계의 안전성",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "actual_supported_relation_or_withhold",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 원진 연구만 참고하려 한다면",
      "aChange": "실제 계산 결과 확인",
      "bChange": "해석 적용 보류",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "미지원 기록",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:no-relation-current-issue",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "관계 미검출에도 있을 수 있는 업무 문제를 실제 조건으로만 확인한다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "미검출을 갈등 부재로 해석하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "A/B의 현재 조건은 새로 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "가상 누락·범위·시한을 분리한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "계산 대신 없는 관계를 채우지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "review",
    "workFunctions": [
      "friction",
      "unknown"
    ],
    "outputType": "사실 확인표",
    "positive": "일의 문제를 좁힐 수 있음",
    "risk": "관계가 없으니 문제도 없다고 판단",
    "factBomb": "계산에 충이 없어도 넘길 파일이 빠질 수 있다.",
    "twist": "일의 조건은 관계 이름 없이도 확인할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 결과물 누락을 점검한다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "사실 상태 공유",
      "personB": "필요 항목 질문"
    },
    "counterexample": "실제 누락 경험 창작 금지",
    "distinctFromOtherParagraphs": "미검출과 실제 업무 질문",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 결과물 누락을 점검한다면",
      "aChange": "사실 상태 공유",
      "bChange": "필요 항목 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "사실 확인표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P2:same-source-no-false-conflict",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P2",
    "address": "CH07.P2",
    "mode": "JOINT",
    "readerQuestion": "실제 충·해·반합·미지원·미검출·동일 의미를 어떻게 구별하는가?",
    "coreMeaning": "같은 원천 의미를 억지 차이로 바꾸지 않고 적용 기준만 확인한다.",
    "roleContributions": [
      {
        "address": "CH07.P2.S1",
        "originalRole": "실제 충돌 또는 부재",
        "knowledge": "A와 B는 같은 trait일 수 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S2",
        "originalRole": "쉬운 의미",
        "knowledge": "같은 선호를 반대 성향으로 꾸미지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S3",
        "originalRole": "다른 반응",
        "knowledge": "가상 기준의 대상이 같은지만 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P2.S4",
        "originalRole": "긍정적 여지",
        "knowledge": "차이가 없으면 공통 의미로 남긴다.",
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
        "sourceKey": "871f1880dae3d3831abc",
        "sourceUse": "own_entered_type_only",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "1050924385abffda9deb",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:PRECISION:standard-consistency",
        "axis": "PRECISION",
        "definition": "상황 사이 기준 적용의 일관성을 확인",
        "condition": "같은 기준을 적용해도 되는 조건 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "friction",
      "sameType"
    ],
    "outputType": "공통 조건표",
    "positive": "공통 기준의 확인",
    "risk": "갈등 장을 채우려 가짜 차이 생성",
    "factBomb": "갈등을 설명할 근거가 없다면 차이를 만들 이유도 없다.",
    "twist": "같은 선호에서도 이번 기준은 함께 확인할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 두 사람이 같은 절차를 원한다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 적용 범위 말함",
      "personB": "같은 조건인지 확인"
    },
    "counterexample": "다른 실제 근거가 없으면 차이 판정 보류",
    "distinctFromOtherParagraphs": "동일 의미의 보존",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [
        {
          "owner": "A",
          "type": "ISTJ",
          "sourceKey": "871f1880dae3d3831abc",
          "domain": "WORK"
        },
        {
          "owner": "B",
          "type": "ISTJ",
          "sourceKey": "871f1880dae3d3831abc",
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
      "firstFactCheck": "가상 두 사람이 같은 절차를 원한다면",
      "aChange": "자기 적용 범위 말함",
      "bChange": "같은 조건인지 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "공통 조건표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:request-without-input",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "목적·기한·필수 자료 없이 급하다고만 요청할 때의 비용을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "요청자는 필요한 결과를 명시한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "수신자는 받은 뜻을 되확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 필요한 파일이 없으면 착수 조건이 부족하다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "요청의 감정 강도가 정보를 대신하지 못한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "607d86e676269d444952",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:direct-request",
        "axis": "COMMUNICATION_STYLE",
        "definition": "원하는 행동을 명시",
        "condition": "거절 가능한 실제 선택권이 있을 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "information",
    "workFunctions": [
      "friction",
      "request"
    ],
    "outputType": "요청 항목표",
    "positive": "착수 정보의 확인",
    "risk": "급함으로 설명을 대체",
    "factBomb": "급하다고 여러 번 말해도 빠진 입력 파일은 생기지 않는다.",
    "twist": "요청을 한 번 정리하면 반복 질문이 줄어들 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 자료 없이 결과만 요청받는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "목적·입력·기한 제시",
      "personB": "누락 입력 표시"
    },
    "counterexample": "실제 요청자가 A라는 고정 없음",
    "distinctFromOtherParagraphs": "업무 요청의 정보 비용",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 자료 없이 결과만 요청받는다면",
      "aChange": "목적·입력·기한 제시",
      "bChange": "누락 입력 표시",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "요청 항목표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:feedback-as-person-score",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "작업물의 한 문제를 동료 전체의 능력 평가로 확대할 위험을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "관찰한 항목을 특정한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "원인은 추측 대신 질문한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 오류를 성격 결함으로 부르지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "공개 반복 비난이 부담을 키울 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "99abb271c1ef0a874619",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "feedback",
    "workFunctions": [
      "friction",
      "feedback"
    ],
    "outputType": "관찰 의견",
    "positive": "수정 가능한 의견",
    "risk": "늘 무능하다는 인격 낙인",
    "factBomb": "한 번의 오류는 그 사람 전체의 업무 능력을 측정한 결과가 아니다.",
    "twist": "문제를 좁히면 필요한 수정 자료가 보인다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 표의 오류를 검토한다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "위치·영향만 말함",
      "personB": "확인 자료·수정 범위 답함"
    },
    "counterexample": "실제 괴롭힘은 피드백 차이로 정상화 금지",
    "distinctFromOtherParagraphs": "작업과 개인 평가의 혼동",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 표의 오류를 검토한다면",
      "aChange": "위치·영향만 말함",
      "bChange": "확인 자료·수정 범위 답함",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "관찰 의견",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:revision-without-stop",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "수정 종료 조건이 없어 새 의견이 계속 필수 작업이 될 상황을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "현재 합의한 완료 기준을 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "새 오류와 새 취향을 구별한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 수정 횟수보다 요청의 성격을 본다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "최종 변경 승인자는 별도 확인한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "0388561cdeef5da930d4",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DECISION_STYLE:closure-criteria",
        "axis": "DECISION_STYLE",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "condition": "결정의 영향과 정보 범위가 명시될 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "revision",
    "workFunctions": [
      "friction",
      "revision"
    ],
    "outputType": "수정 종료표",
    "positive": "수정 범위의 정리",
    "risk": "끝없는 고침을 성실함으로 포장",
    "factBomb": "더 고칠 수 있다는 말과 지금 반드시 고쳐야 한다는 말은 다르다.",
    "twist": "후속 목록이 현재 완료를 가능하게 할 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 검토마다 새 선호가 붙는다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "필수 근거·완료 기준 제시",
      "personB": "현재 가능 범위 답함"
    },
    "counterexample": "계약·필수 규정 변경은 별도 절차",
    "distinctFromOtherParagraphs": "수정 종료의 공백",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 검토마다 새 선호가 붙는다면",
      "aChange": "필수 근거·완료 기준 제시",
      "bChange": "현재 가능 범위 답함",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "수정 종료표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:additional-work-hidden",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "짧은 추가 요청에 준비·검토·인계의 숨은 작업이 붙을 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "새 요청의 전체 단계를 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "수락은 실제 가능한 범위로 제한한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 한 장 수정에도 다른 자료 갱신이 필요할 수 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "비용을 말하지 못하면 부담이 쌓일 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "execution",
    "workFunctions": [
      "friction",
      "scope"
    ],
    "outputType": "요청 영향도",
    "positive": "요청 영향의 가시화",
    "risk": "금방 할 일이라며 일정 영향 삭제",
    "factBomb": "작아 보이는 요청에도 다시 확인할 작업은 따로 있다.",
    "twist": "작업을 나누면 지금 할 일부만 고를 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 작은 변경이 연결 파일을 바꾼다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "의존 작업 확인",
      "personB": "가능 범위·밀릴 일 알림"
    },
    "counterexample": "실제 작업량을 유형으로 산정하지 않는다.",
    "distinctFromOtherParagraphs": "추가 요청의 연결 비용",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 작은 변경이 연결 파일을 바꾼다면",
      "aChange": "의존 작업 확인",
      "bChange": "가능 범위·밀릴 일 알림",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "요청 영향도",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:information-silo",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "일부만 아는 최신 정보가 공동 결과물에 반영되지 않을 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "최신 정보의 위치와 버전을 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "읽음과 이해·적용은 다르다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 변경 자료를 한 사람만 알고 있다면 알린다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "접근 권한 없는 정보는 별도 통로를 확인한다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "8166189640ff584ab6f6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "607d86e676269d444952",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "information",
    "workFunctions": [
      "friction",
      "information"
    ],
    "outputType": "버전 확인표",
    "positive": "최신 조건의 공유",
    "risk": "보냈다는 이유로 적용 완료 가정",
    "factBomb": "보낸 파일과 동료가 쓰는 파일이 같다는 보장은 없다.",
    "twist": "버전 하나의 확인이 중복 수정을 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 서로 다른 파일을 쓰고 있다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "최신본·변경분 표시",
      "personB": "접근·사용본 확인"
    },
    "counterexample": "보안상 공유 금지 정보는 공개하지 않는다.",
    "distinctFromOtherParagraphs": "정보 전달과 실제 사용의 차이",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 서로 다른 파일을 쓰고 있다면",
      "aChange": "최신본·변경분 표시",
      "bChange": "접근·사용본 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "버전 확인표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P3:handoff-omission",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P3",
    "address": "CH07.P3",
    "mode": "JOINT",
    "readerQuestion": "요청·피드백·수정·추가 업무·정보·인계에서 어떤 비용이 생기는가?",
    "coreMeaning": "파일만 넘기고 미완료·불확실성·다음 담당을 빠뜨릴 부담을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P3.S1",
        "originalRole": "반복 문제",
        "knowledge": "인계 묶음의 상태를 나눈다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S2",
        "originalRole": "방향별 원인",
        "knowledge": "실제 인수 수락은 별도 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S3",
        "originalRole": "악화 장면",
        "knowledge": "가상 다음 행동이 보이지 않으면 질문한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P3.S4",
        "originalRole": "직설적 결론",
        "knowledge": "책임을 일방적으로 넘기지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "8166189640ff584ab6f6",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:STABILITY:continuity",
        "axis": "STABILITY",
        "definition": "유지·인수인계 체계를 갖춤",
        "condition": "기능·담당·검토 주기 확인",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:PRECISION:completion-quality",
        "axis": "PRECISION",
        "definition": "최종 결과물의 누락을 점검",
        "condition": "완료 수준과 마감이 명시된 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "handoff",
    "workFunctions": [
      "friction",
      "handoff"
    ],
    "outputType": "상태 인계표",
    "positive": "이어갈 정보의 확인",
    "risk": "전송을 책임 이전으로 간주",
    "factBomb": "파일을 보냈다고 남은 일을 누가 맡을지 정해진 것은 아니다.",
    "twist": "미완료 표시 하나가 뒤늦은 추측을 막을 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 인계 자료에 상태가 없다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "미완료·다음 단계 알림",
      "personB": "받을 범위·이해 확인"
    },
    "counterexample": "의료 책임 규칙을 일반 업무에 자동 전이 금지",
    "distinctFromOtherParagraphs": "인계의 상태·수락 공백",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 인계 자료에 상태가 없다면",
      "aChange": "미완료·다음 단계 알림",
      "bChange": "받을 범위·이해 확인",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "상태 인계표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:duplicate-edit",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "서로 최신본을 모른 채 같은 부분을 고칠 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "각자 고치는 대상과 버전을 표시한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "합치는 사람을 당연히 A로 정하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 충돌한 수정은 내용 기준으로 비교한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "기여 경쟁으로 번지면 해결이 멀어질 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "607d86e676269d444952",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "revision",
    "workFunctions": [
      "friction",
      "duplicate"
    ],
    "outputType": "편집 상태표",
    "positive": "수정 충돌의 가시화",
    "risk": "먼저 고친 사람이 무조건 옳다고 판단",
    "factBomb": "먼저 손댔다는 사실이 최종본의 기준은 아니다.",
    "twist": "겹친 의견이 다른 기준을 찾는 자료가 될 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 같은 문단이 두 버전으로 갈렸다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 변경·근거 표시",
      "personB": "수신본·통합 질문"
    },
    "counterexample": "실제 중복 이력은 창작하지 않는다.",
    "distinctFromOtherParagraphs": "중복 편집의 통합 문제",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 같은 문단이 두 버전으로 갈렸다면",
      "aChange": "자기 변경·근거 표시",
      "bChange": "수신본·통합 질문",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "편집 상태표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:credit-erasure",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "발표·작성·검토의 기여가 한 사람의 성과로만 남을 조건을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 작업 항목을 먼저 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "의도적 가로채기는 사실 확인 전 단정하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 기여 기록과 조직 평가를 구별한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "기여 누락 반복은 별도 확인 통로가 필요할 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "1b369a62ec425b1ebbe5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DUTY:scope-responsibility",
        "axis": "DUTY",
        "definition": "책임의 경계를 구분",
        "condition": "실제 계약과 동의 우선",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "delivery",
    "workFunctions": [
      "friction",
      "recognition"
    ],
    "outputType": "기여 확인표",
    "positive": "작업의 출처 보존",
    "risk": "보이는 역할만 전체 성과로 인정",
    "factBomb": "최종 문서를 낸 사람이 검토와 준비까지 모두 한 것은 아니다.",
    "twist": "기여 목록은 다음 분담의 불균형도 보일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 공동 결과물의 작성 이력이 빠졌다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 기여·지원 출처 말함",
      "personB": "확인된 작업 기록"
    },
    "counterexample": "실제 인사 평가·권리 판단은 조직·전문 절차",
    "distinctFromOtherParagraphs": "기여 인정과 평가 권한 구분",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 공동 결과물의 작성 이력이 빠졌다면",
      "aChange": "자기 기여·지원 출처 말함",
      "bChange": "확인된 작업 기록",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "기여 확인표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:meeting-closure-gap",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "회의에서 의견만 늘고 결정 질문·담당·후속이 남지 않을 부담을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "논의할 질문과 결정할 질문을 구분한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A/B 중 누가 결정권자인지 추정하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 결정이 보류되면 필요한 자료를 적는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "반복 회의가 작업 시간을 줄일 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7bdcdc1310dd783e91f2",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:DECISION_STYLE:closure-criteria",
        "axis": "DECISION_STYLE",
        "definition": "어떤 정보면 결론을 닫을지 정의",
        "condition": "결정의 영향과 정보 범위가 명시될 때",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "plan",
    "workFunctions": [
      "friction",
      "meeting"
    ],
    "outputType": "결정 질문표",
    "positive": "회의 목적의 확인",
    "risk": "회의를 합의 완료로 착각",
    "factBomb": "오래 함께 말했어도 다음 할 일이 정해지지 않을 수 있다.",
    "twist": "짧은 보류 이유가 다음 회의를 줄일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 회의 뒤 담당이 없다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 다음 행동·질문 표시",
      "personB": "미결정·필요 자료 정리"
    },
    "counterexample": "권한 없는 결정 강요 금지",
    "distinctFromOtherParagraphs": "회의와 실행 연결의 공백",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 회의 뒤 담당이 없다면",
      "aChange": "자기 다음 행동·질문 표시",
      "bChange": "미결정·필요 자료 정리",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "결정 질문표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:disagreement-becomes-competence",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "다른 우선 기준을 상대의 낮은 실력으로 읽을 위험을 연구한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "각자 쓴 기준과 현재 제약을 묻는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "유형 차이는 실력의 우열이 아니다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 속도와 오류 위험의 기준을 대조한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "공개 능력 경쟁은 정보 공유를 어렵게 할 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "99abb271c1ef0a874619",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      }
    ],
    "semanticFacets": [
      {
        "id": "sar:facet:COMMUNICATION_STYLE:intent-check",
        "axis": "COMMUNICATION_STYLE",
        "definition": "표현과 이해된 뜻을 다시 확인",
        "condition": "해석 차이를 당사자가 확인할 때",
        "notIndependentEvidence": true
      },
      {
        "id": "sar:facet:BOUNDARY:role-border",
        "axis": "BOUNDARY",
        "definition": "자기 담당과 타인 담당을 구분",
        "condition": "합의된 업무·가족 역할 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "feedback",
    "workFunctions": [
      "friction",
      "disagreement"
    ],
    "outputType": "판단 기준표",
    "positive": "다른 판단 이유의 확인",
    "risk": "의견 불일치를 능력 부족으로 해석",
    "factBomb": "내 답에 동의하지 않는다고 문제를 이해 못한 것은 아니다.",
    "twist": "다른 기준이 빠진 제약을 보일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 두 안이 다른 기준으로 평가됐다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "자기 판단 기준 공유",
      "personB": "비교할 자료 제안"
    },
    "counterexample": "실제 능력 평가 근거 없이 우열 판단 금지",
    "distinctFromOtherParagraphs": "이견과 능력 낙인의 구별",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 두 안이 다른 기준으로 평가됐다면",
      "aChange": "자기 판단 기준 공유",
      "bChange": "비교할 자료 제안",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "판단 기준표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:fatigue-without-rebalance",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "반복 지원·회의·수정이 누적될 때 실제 작업량과 여력을 확인한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "피로를 유형의 약점으로 판정하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A/B가 각각 부담을 말할 수 있다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 지원이 본래 작업을 밀면 범위를 다시 본다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "자원 조정은 조직 권한이 필요할 수 있다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
        "sourceUse": "context_guidance_not_person_fact",
        "knowledgeIsRuntimeEvidence": false
      },
      {
        "owner": "GUIDANCE",
        "sourceKey": "983ac049dd4d1607030f",
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
      },
      {
        "id": "sar:facet:RESOURCE_SENSE:allocation",
        "axis": "RESOURCE_SENSE",
        "definition": "중요한 목적에 자원을 배정",
        "condition": "자원 소유자·동의 확인",
        "notIndependentEvidence": true
      }
    ],
    "workStage": "maintenance",
    "workFunctions": [
      "friction",
      "fatigue"
    ],
    "outputType": "여력 재검토표",
    "positive": "부담을 조정할 자료",
    "risk": "더 배려하면 해결된다고 개인에게 전가",
    "factBomb": "노력만 늘리라는 말로 없는 여력을 채울 수는 없다.",
    "twist": "줄일 작업을 찾는 것이 협력의 한 방법일 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 반복 지원으로 계획이 밀린다면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "작업·지원의 시간 영향 공유",
      "personB": "가능 여력·조정 요청"
    },
    "counterexample": "건강 진단·근로 법률 판단은 전문 영역",
    "distinctFromOtherParagraphs": "반복 협업의 작업량 문제",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 반복 지원으로 계획이 밀린다면",
      "aChange": "작업·지원의 시간 영향 공유",
      "bChange": "가능 여력·조정 요청",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "여력 재검토표",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  },
  {
    "id": "cwpr:material:CH07.P4:coercion-not-style",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "chapterId": "CH07",
    "paragraphId": "P4",
    "address": "CH07.P4",
    "mode": "JOINT",
    "readerQuestion": "중복·기여·회의·이견·피로·부당행위는 어떤 다른 문제인가?",
    "coreMeaning": "괴롭힘·차별·보복·강압 가능성을 일반적인 업무 의견 차이와 구분한다.",
    "roleContributions": [
      {
        "address": "CH07.P4.S1",
        "originalRole": "주의 상황",
        "knowledge": "실제 행동과 안전 상황을 먼저 확인한다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S2",
        "originalRole": "A의 기대",
        "knowledge": "A/B에 피해·가해 역할을 유형으로 부여하지 않는다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S3",
        "originalRole": "B의 기대",
        "knowledge": "가상 위험 상황에는 안전한 별도 지원 통로가 필요하다.",
        "notIndependentFact": true
      },
      {
        "address": "CH07.P4.S4",
        "originalRole": "다르게 전달되는 뜻",
        "knowledge": "대화·용서·동등 책임을 강제하지 않는다.",
        "notIndependentFact": true
      }
    ],
    "ownedSources": [
      {
        "owner": "GUIDANCE",
        "sourceKey": "7fdeffb028558576a2a5",
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
      "friction",
      "safety"
    ],
    "outputType": "지원 필요 기록",
    "positive": "안전과 지원의 우선 확인",
    "risk": "유형 차이라며 부당행위 정상화",
    "factBomb": "친절하게 맞추라는 조언이 부당한 요구의 책임을 지워주지는 않는다.",
    "twist": "일반 조율을 멈추는 것이 필요한 지원을 남길 수 있다.",
    "fictionalScene": {
      "status": "hypothetical_only",
      "text": "가상 보복이 걱정돼 의견을 못 내는 상황이라면",
      "isCustomerHistory": false
    },
    "actions": {
      "personA": "실제 안전·지원 선택 확인",
      "personB": "동의 없이 화해 강요하지 않음"
    },
    "counterexample": "구체 법률·조사 결론은 별도 전문 절차",
    "distinctFromOtherParagraphs": "성향 해석의 적용 중단",
    "precedingMeaningRefs": [],
    "introducedMeaningRequirements": [],
    "requirements": {
      "policyRef": "cwpr:binding-policy:v1",
      "typePredicates": [],
      "direction": null,
      "canonicalClaim": "no_new_relation_claim",
      "jobRole": "UNKNOWN",
      "authority": "UNKNOWN",
      "workplace": "UNKNOWN",
      "workHistory": "UNKNOWN",
      "actualWorkContextRequired": true,
      "additionalInput": [
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
      "firstFactCheck": "가상 보복이 걱정돼 의견을 못 내는 상황이라면",
      "aChange": "실제 안전·지원 선택 확인",
      "bChange": "동의 없이 화해 강요하지 않음",
      "authority": "UNKNOWN_verify_existing_organization_procedure",
      "scope": "지원 필요 기록",
      "recheck": "다음 같은 산출물의 전달·검토 때 실제로 달라진 항목과 미완료를 확인. 새 조건이면 재합의.",
      "improvement": "확인된 상태·담당·요청 범위가 맞는지 본다. 친밀감·복종·인사 평점·성과 보장으로 측정하지 않음.",
      "safetySupport": "부당행위·강압·위험은 일반 궁합 조율로 정상화하지 않고 안전한 별도 지원·조직 절차를 확인."
    },
    "review": "conditional_editorial_research",
    "bindingState": "unresolved_no_engine",
    "newCalculatedFacts": 0
  }
];
