/** Static offline managerReport research. No runtime registration or customer approval. */
import type { TypeWorkLens } from "./researchTypes";
export const MR_TYPE_WORK_LENSES: readonly TypeWorkLens[] = [
  {
    "id": "mrpr:type-work:ISTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISTJ",
    "sourceRefs": [
      "mrpr:work-trait:ISTJ:workplace:rule_following_reliability",
      "mrpr:work-trait:ISTJ:workplace:clear_instruction_boundary"
    ],
    "questions": {
      "information": "A라면 기준의 출처·버전·예외를 어떻게 설명할까?",
      "feedback": "B라면 수정 요청이 필수 기준인지 새 요구인지 무엇으로 확인할까?",
      "decision": "A의 선례 검토와 실제 승인권을 구분했는가?",
      "independent": "B가 선택할 방법과 A가 남길 검토는 무엇인가?",
      "conflict": "비공식 추가 요청의 우선순위를 누가 정할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ISTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISTP",
    "sourceRefs": [
      "mrpr:work-trait:ISTP:workplace:action_over_meeting",
      "mrpr:work-trait:ISTP:workplace:minimal_report_protocol"
    ],
    "questions": {
      "information": "A라면 실행 예시와 필요한 점검만 어떻게 남길까?",
      "feedback": "B라면 설명을 줄여도 상태·막힘·결정 요청을 어떻게 전달할까?",
      "decision": "짧은 보고 뒤 A가 답해야 할 결정은 무엇인가?",
      "independent": "B의 작업 구간과 A의 지원 창구가 둘 다 있는가?",
      "conflict": "간섭을 줄이는 요구와 필수 안전 보고를 어떻게 나눌까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ESTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESTJ",
    "sourceRefs": [
      "mrpr:work-trait:ESTJ:workplace:clear_expectations",
      "mrpr:work-trait:ESTJ:workplace:micro_management_precision"
    ],
    "questions": {
      "information": "A라면 결과·기한의 이유와 변경 가능한 방법을 어떻게 밝힐까?",
      "feedback": "B라면 지시의 우선순위 충돌을 어떤 사실로 알릴까?",
      "decision": "명료한 말투와 실제 평가·징계권은 구분됐는가?",
      "independent": "A의 기준이 B의 모든 작업 방식까지 고정하는가?",
      "conflict": "기준 변경 때 A가 조정할 시간·자원은 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ESTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESTP",
    "sourceRefs": [
      "mrpr:work-trait:ESTP:workplace:crisis_solver",
      "mrpr:work-trait:ESTP:workplace:flexible_negotiator"
    ],
    "questions": {
      "information": "A라면 빠른 현장 판단의 예외·지원 범위를 어떻게 정할까?",
      "feedback": "B라면 즉시 조정한 결과와 미확인 영향을 어떻게 보고할까?",
      "decision": "속도보다 먼저 확인할 실제 결정권은 무엇인가?",
      "independent": "B가 현장에서 바꿔도 될 범위는 어디인가?",
      "conflict": "A는 빠른 보고에서 빠진 위험·추정을 어떻게 질문할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ISFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISFJ",
    "sourceRefs": [
      "mrpr:work-trait:ISFJ:workplace:guideline_micro_manager",
      "mrpr:work-trait:ISFJ:workplace:recognition_and_boundary"
    ],
    "questions": {
      "information": "A라면 안정된 순서와 변경 이유를 어떻게 함께 설명할까?",
      "feedback": "B라면 추가 지원 요청과 기존 약속의 충돌을 어떻게 알릴까?",
      "decision": "고마움과 새로운 수행 책임을 구분했는가?",
      "independent": "B에게 기대하는 챙김의 범위와 A의 지원 책임은 무엇인가?",
      "conflict": "A가 먼저 확인해야 할 숨은 작업량은 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ISFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ISFP",
    "sourceRefs": [
      "mrpr:work-trait:ISFP:workplace:gentle_feedback_space",
      "mrpr:work-trait:ISFP:workplace:anti_authority_control"
    ],
    "questions": {
      "information": "A라면 구체적 기준과 개별 수정 시간을 어떻게 제공할까?",
      "feedback": "B라면 공개 판단 대신 안전한 수정 확인을 어떤 통로로 요청할까?",
      "decision": "부드러운 말투가 실제 이견 안전을 보장하는가?",
      "independent": "B의 방법 선택을 평가 취향과 구별했는가?",
      "conflict": "침묵을 동의로 보지 않기 위해 A가 줄 시간·통로는 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ESFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESFJ",
    "sourceRefs": [
      "mrpr:work-trait:ESFJ:workplace:policy_alignment_need",
      "mrpr:work-trait:ESFJ:workplace:praise_boundary_balance"
    ],
    "questions": {
      "information": "A라면 목표·과정·우선순위·예시를 어떻게 구별해 설명할까?",
      "feedback": "B라면 인정받으려는 수락과 실제 가능한 시간을 어떻게 나눌까?",
      "decision": "칭찬이 새 업무 자동 배정으로 바뀌는가?",
      "independent": "A의 챙김이 B의 감정 업무가 되지 않을 조건은 무엇인가?",
      "conflict": "A가 업무량·우선순위 조정으로 답해야 할 요청은 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ESFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ESFP",
    "sourceRefs": [
      "mrpr:work-trait:ESFP:workplace:improvised_action",
      "mrpr:work-trait:ESFP:workplace:messy_detail_risk"
    ],
    "questions": {
      "information": "A라면 즉각 반응에서 관찰 사실·해석을 어떻게 나눌까?",
      "feedback": "B라면 현장 대응 뒤 남은 정리·승인 필요를 어떻게 보고할까?",
      "decision": "호응이 완료·성과·고객 전체의 동의를 뜻하는가?",
      "independent": "B의 대응 재량과 A의 예외 지원은 무엇인가?",
      "conflict": "A는 좋은 반응 뒤 남은 위험을 어떻게 확인할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:INTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INTJ",
    "sourceRefs": [
      "mrpr:work-trait:INTJ:workplace:authority_scope_alignment",
      "mrpr:work-trait:INTJ:thinkingStyle:definition_precision"
    ],
    "questions": {
      "information": "A라면 목적·용어 정의·판단 권한을 어떻게 설명할까?",
      "feedback": "B라면 전제 차이와 필요한 결정·기한을 어떤 자료로 알릴까?",
      "decision": "논리가 분명해도 조직의 실제 승인권을 별도 확인했는가?",
      "independent": "B에게 줄 정보 접근과 독립 실행 범위는 무엇인가?",
      "conflict": "A가 다른 기준을 낮은 능력으로 평가하지 않으려면 무엇을 물을까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:INTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INTP",
    "sourceRefs": [
      "mrpr:work-trait:INTP:workplace:needs_thinking_time",
      "mrpr:work-trait:INTP:thinkingStyle:why_question_loop"
    ],
    "questions": {
      "information": "A라면 큰 원칙을 결과 예시·필수 조건까지 어떻게 풀까?",
      "feedback": "B라면 원인 질문과 이번 결정에 필요한 검토를 어떻게 좁힐까?",
      "decision": "분석 중·제안·확정 지시의 상태를 표시했는가?",
      "independent": "B의 숙고 시간과 A의 결정 시한을 어떻게 연결할까?",
      "conflict": "A는 미완성 정보도 지원 판단에 쓸 수 있는가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ENTJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENTJ",
    "sourceRefs": [
      "mrpr:work-trait:ENTJ:workplace:crisis_momentum",
      "mrpr:work-trait:ENTJ:workplace:delegation_pressure_control"
    ],
    "questions": {
      "information": "A라면 목표를 바꿀 때 중단할 작업·자원을 어떻게 함께 결정할까?",
      "feedback": "B라면 빠른 결론 속 미확인·승인 필요를 어떻게 알릴까?",
      "decision": "강한 주장과 실제 권한·실력을 구분했는가?",
      "independent": "A의 속도 요구 안에 B의 검토 시간도 있는가?",
      "conflict": "A는 침묵을 무능으로 해석하기 전에 어떤 정보를 확인할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ENTP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENTP",
    "sourceRefs": [
      "mrpr:work-trait:ENTP:workplace:brainstorming_leader",
      "mrpr:work-trait:ENTP:workplace:constructive_critic"
    ],
    "questions": {
      "information": "A라면 아이디어·검토 요청·실행 지시를 어떻게 표시할까?",
      "feedback": "B라면 대안의 장점·검증 범위·되돌림을 어떻게 제안할까?",
      "decision": "논쟁에서 나온 안이 실제 승인됐는가?",
      "independent": "B의 시험 재량과 A의 기준 검토는 어디서 만나는가?",
      "conflict": "A는 새 발상 때문에 생기는 재작업을 어떻게 조정할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:INFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INFJ",
    "sourceRefs": [
      "mrpr:work-trait:INFJ:workplace:calm_deep_work",
      "mrpr:work-trait:INFJ:workplace:emotional_boundary_at_work"
    ],
    "questions": {
      "information": "A라면 목적의 의미와 실제 수행 범위를 어떻게 함께 밝힐까?",
      "feedback": "B라면 관찰한 반응과 추측한 의도를 어떻게 분리해 보고할까?",
      "decision": "관계에 대한 해석이 실제 평가 근거로 바뀌는가?",
      "independent": "B의 집중 시간과 필요한 정보 접점은 무엇인가?",
      "conflict": "A가 챙김을 팀원 감정 관리 책임으로 넘기지 않을 조건은 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:INFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "INFP",
    "sourceRefs": [
      "mrpr:work-trait:INFP:workplace:autonomy_required",
      "mrpr:work-trait:INFP:workplace:feedback_safety_contract"
    ],
    "questions": {
      "information": "A라면 과제 목적·필수 결과와 개인 가치 판단을 어떻게 나눌까?",
      "feedback": "B라면 수정 기준·장소·시간을 어떤 안전한 방식으로 확인할까?",
      "decision": "가치가 다르다는 이유로 충성도·인격을 평가하는가?",
      "independent": "B가 선택할 방법과 반드시 지킬 공동 기준은 무엇인가?",
      "conflict": "A가 먼저 조정할 공개 판단·모호한 지시는 무엇인가?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ENFJ",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENFJ",
    "sourceRefs": [
      "mrpr:work-trait:ENFJ:workplace:collaborative_environment",
      "mrpr:work-trait:ENFJ:workplace:care_overload_at_work"
    ],
    "questions": {
      "information": "A라면 목적에 대한 공감 뒤 가용 시간·자원도 어떻게 확인할까?",
      "feedback": "B라면 타인 지원과 자신의 실제 수행 범위를 어떻게 보고할까?",
      "decision": "따뜻한 반응이 업무 수락으로 해석되는가?",
      "independent": "A의 지원과 B의 감정 노동을 구분했는가?",
      "conflict": "A는 배려 때문에 미룬 수정 기준을 어떻게 명확히 말할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  },
  {
    "id": "mrpr:type-work:ENFP",
    "productKey": "saju_mbti_compatibility",
    "relationshipCategory": "managerReport",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "type": "ENFP",
    "sourceRefs": [
      "mrpr:work-trait:ENFP:workplace:novelty_required_work",
      "mrpr:work-trait:ENFP:workplace:follow_through_system"
    ],
    "questions": {
      "information": "A라면 새 목표·실험 범위·기존 중단 작업을 어떻게 함께 정할까?",
      "feedback": "B라면 제안·실행·보류 상태를 어떤 결과물로 보여줄까?",
      "decision": "가능성을 말한 안과 실제 승인된 과제를 구분했는가?",
      "independent": "B의 탐색 재량과 A의 자원 지원은 무엇인가?",
      "conflict": "A는 방향 변경 뒤 기한·검토 기준을 어떻게 다시 확인할까?"
    },
    "questionStatus": "conditional_editorial_application_not_type_fact",
    "actualWorkContextRequired": true
  }
];
