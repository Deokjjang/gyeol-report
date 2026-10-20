/** Static offline coworker research. No runtime registration or customer approval. */
import type { TypeWorkLens } from "./researchTypes";
export const CW_TYPE_WORK_LENSES: readonly TypeWorkLens[] = [
  {
    "id": "cwpr:type-work:ISTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISTJ",
    "sourceRefs": [
      "cwpr:work-trait:ISTJ:workplace:rule_following_reliability",
      "cwpr:work-trait:ISTJ:workplace:time_promise_strictness"
    ],
    "questions": {
      "information": "어떤 기준·기록이면 이번 판단을 시작하기 쉬운가?",
      "feedback": "오류의 위치와 수정할 최소 범위를 무엇으로 확인할까?",
      "decision": "인계 시각과 검토 시간이 둘 다 알려져 있는가?",
      "independent": "혼자 끝낼 범위와 알릴 중간 상태는 무엇인가?",
      "conflict": "전례와 다른 현재 조건을 어떻게 말할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ISTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISTP",
    "sourceRefs": [
      "cwpr:work-trait:ISTP:workplace:action_over_meeting",
      "cwpr:work-trait:ISTP:workplace:anti_micromanagement"
    ],
    "questions": {
      "information": "설명 뒤 어떤 작은 작동 확인이 필요한가?",
      "feedback": "긴 설명 대신 재현 가능한 한 문제가 있는가?",
      "decision": "바로 해도 되는 범위와 승인 필요한 범위는 어디인가?",
      "independent": "방법 재량 안에서도 공유할 상태는 무엇인가?",
      "conflict": "불필요한 간섭과 필요한 인계 확인을 어떻게 나눌까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ESTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESTJ",
    "sourceRefs": [
      "cwpr:work-trait:ESTJ:workplace:clear_expectations",
      "cwpr:work-trait:ESTJ:workplace:micro_management_precision"
    ],
    "questions": {
      "information": "결과·기한·필수 기준의 실제 출처는 무엇인가?",
      "feedback": "필수 오류와 세부 취향을 어떻게 나눌까?",
      "decision": "명확한 제안과 최종 결정 권한은 구분됐는가?",
      "independent": "담당 범위 안에서 상대가 고를 방법은 어디인가?",
      "conflict": "바로 고치려는 의견을 동료가 확인할 자료로 줄일 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ESTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESTP",
    "sourceRefs": [
      "cwpr:work-trait:ESTP:workplace:crisis_solver",
      "cwpr:work-trait:ESTP:workplace:flexible_negotiator"
    ],
    "questions": {
      "information": "현재 확인한 제약과 아직 못 본 구간은 무엇인가?",
      "feedback": "핵심 문제 뒤에 빠지면 안 되는 조건은 무엇인가?",
      "decision": "현장 조정이 다른 작업의 일정을 바꾸는가?",
      "independent": "즉시 가능한 실행과 공동 결정은 어떻게 나뉘는가?",
      "conflict": "바꾼 내용을 상대에게 언제 어떤 형태로 알릴까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ISFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISFJ",
    "sourceRefs": [
      "cwpr:work-trait:ISFJ:workplace:guideline_micro_manager",
      "cwpr:work-trait:ISFJ:workplace:recognition_and_boundary"
    ],
    "questions": {
      "information": "이어서 할 순서와 변한 항목은 무엇인가?",
      "feedback": "말하기 어려운 누락을 안전하게 남길 통로가 있는가?",
      "decision": "추가 지원이 현재 맡은 약속을 밀어내는가?",
      "independent": "챙길 일과 맡지 않을 일의 끝은 어디인가?",
      "conflict": "감사와 업무 수락을 따로 확인할 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ISFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISFP",
    "sourceRefs": [
      "cwpr:work-trait:ISFP:workplace:gentle_feedback_space",
      "cwpr:work-trait:ISFP:workplace:anti_authority_control"
    ],
    "questions": {
      "information": "고칠 기준과 방법의 재량은 각각 무엇인가?",
      "feedback": "공개 평가 대신 항목별 의견을 받을 수 있는가?",
      "decision": "지금 동의한 부분과 보류한 부분은 어디인가?",
      "independent": "공동 결과의 경계 안에서 자기 방법을 고를 수 있는가?",
      "conflict": "침묵을 동의로 해석하지 않으려면 어떤 표시가 필요한가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ESFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESFJ",
    "sourceRefs": [
      "cwpr:work-trait:ESFJ:workplace:policy_alignment_need",
      "cwpr:work-trait:ESFJ:workplace:praise_boundary_balance"
    ],
    "questions": {
      "information": "목적이 다음 실행 순서와 어떻게 이어지는가?",
      "feedback": "격려와 실제 수정 요청이 모두 보이는가?",
      "decision": "추가 부탁 전에 현재 범위·우선순위를 확인했는가?",
      "independent": "참여 반응과 혼자 정리할 시간을 어떻게 나눌까?",
      "conflict": "칭찬이 새 담당 수락으로 바뀌지 않게 무엇을 확인할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ESFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESFP",
    "sourceRefs": [
      "cwpr:work-trait:ESFP:workplace:improvised_action",
      "cwpr:work-trait:ESFP:workplace:messy_detail_risk"
    ],
    "questions": {
      "information": "현재 반응과 실제 필요한 정보는 어떻게 다른가?",
      "feedback": "현장에서 바꾼 표현의 필수 정보가 남았는가?",
      "decision": "빠른 대응 뒤 남은 정리와 인계는 누구에게 있는가?",
      "independent": "직접 시도와 공동 확인의 접점은 어디인가?",
      "conflict": "좋은 반응이 실제 해결 완료인지 무엇으로 확인할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:INTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INTJ",
    "sourceRefs": [
      "cwpr:work-trait:INTJ:workplace:authority_scope_alignment",
      "cwpr:work-trait:INTJ:thinkingStyle:definition_precision"
    ],
    "questions": {
      "information": "같은 용어의 정의와 실제 결정 목적은 무엇인가?",
      "feedback": "전제의 불일치를 재현할 자료가 있는가?",
      "decision": "책임 범위와 결정 권한의 출처가 확인됐는가?",
      "independent": "필요한 정보 접점과 사적 교류를 나눌 수 있는가?",
      "conflict": "상대의 다른 기준을 낮은 능력으로 판단하지 않으려면 무엇을 물을까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:INTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INTP",
    "sourceRefs": [
      "cwpr:work-trait:INTP:workplace:needs_thinking_time",
      "cwpr:work-trait:INTP:thinkingStyle:why_question_loop"
    ],
    "questions": {
      "information": "미리 읽을 질문과 현재 결정에 필요한 자료는 무엇인가?",
      "feedback": "원인 질문 중 지금 확인할 한 전제는 무엇인가?",
      "decision": "답을 닫을 기준과 다시 검토할 조건은 무엇인가?",
      "independent": "혼자 검토하는 동안 어떤 미확정 상태를 알릴까?",
      "conflict": "더 생각하겠다는 말 뒤에 다음 확인 지점을 남길 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ENTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENTJ",
    "sourceRefs": [
      "cwpr:work-trait:ENTJ:workplace:crisis_momentum",
      "cwpr:work-trait:ENTJ:workplace:delegation_pressure_control"
    ],
    "questions": {
      "information": "막힌 경로와 유지할 기존 작업은 각각 무엇인가?",
      "feedback": "개선 제안이 동료의 능력 평가로 들리지 않는가?",
      "decision": "빠른 결론이 실제 권한·수락을 확인했는가?",
      "independent": "목표를 맞추면서 상대의 방법을 남길 범위는 어디인가?",
      "conflict": "일방 지시 대신 변경 영향과 선택지를 제시할 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ENTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENTP",
    "sourceRefs": [
      "cwpr:work-trait:ENTP:workplace:brainstorming_leader",
      "cwpr:work-trait:ENTP:workplace:constructive_critic"
    ],
    "questions": {
      "information": "지금 비교할 대안과 나중에 볼 가설은 무엇인가?",
      "feedback": "허점을 묻는 말에 실제 위치·근거가 있는가?",
      "decision": "새 발상이 새 근거인지 단지 다른 가능성인지 구별됐는가?",
      "independent": "재량 안의 실험과 공동 약속의 경계를 어디에 둘까?",
      "conflict": "논쟁에서 이기기보다 어떤 비교 자료를 남길까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:INFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INFJ",
    "sourceRefs": [
      "cwpr:work-trait:INFJ:workplace:calm_deep_work",
      "cwpr:work-trait:INFJ:workplace:emotional_boundary_at_work"
    ],
    "questions": {
      "information": "혼자 정리할 자료와 필요한 공동 질문은 무엇인가?",
      "feedback": "관찰한 반응과 추측한 의도를 나눴는가?",
      "decision": "큰 의미와 현재 가능한 행동을 어떤 정보로 연결할까?",
      "independent": "조용한 집중과 동료의 필요한 접점을 어떻게 알릴까?",
      "conflict": "관계 문제를 전부 맡지 않으려면 어떤 지원 한도가 필요한가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:INFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INFP",
    "sourceRefs": [
      "cwpr:work-trait:INFP:workplace:autonomy_required",
      "cwpr:work-trait:INFP:workplace:feedback_safety_contract"
    ],
    "questions": {
      "information": "이 일의 사용 목적과 지킬 결과는 무엇인가?",
      "feedback": "의견의 범위·장소·수정 시간을 확인할 수 있는가?",
      "decision": "개인 가치와 공동으로 동의한 목표는 구분됐는가?",
      "independent": "방법 선택 안에서도 알릴 결과 조건은 무엇인가?",
      "conflict": "다른 의견이나 보류를 인격 거부 없이 어떻게 표시할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ENFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENFJ",
    "sourceRefs": [
      "cwpr:work-trait:ENFJ:workplace:collaborative_environment",
      "cwpr:work-trait:ENFJ:workplace:care_overload_at_work"
    ],
    "questions": {
      "information": "같이 할 이유와 각자 맡은 결과는 무엇인가?",
      "feedback": "부드러운 말 속에 고칠 실제 항목이 남아 있는가?",
      "decision": "분위기 반응 대신 목표·수락을 확인했는가?",
      "independent": "함께 확인할 접점과 각자 집중할 시간을 나눌 수 있는가?",
      "conflict": "도움을 주면서 자기 담당·지원 한도를 무엇으로 알릴까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "cwpr:type-work:ENFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "coworker",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENFP",
    "sourceRefs": [
      "cwpr:work-trait:ENFP:workplace:novelty_required_work",
      "cwpr:work-trait:ENFP:workplace:follow_through_system"
    ],
    "questions": {
      "information": "새 연결 중 지금 시험할 가설은 무엇인가?",
      "feedback": "가능성을 격려하면서 필수 오류는 어떻게 확인할까?",
      "decision": "새 제안이 기존 약속을 바꾸는지 확인했는가?",
      "independent": "자유로운 방법과 반복할 인계 항목은 무엇인가?",
      "conflict": "아이디어·확정 작업·보관할 제안을 나눌 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  }
];
