import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_TIME_BOUNDARY_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:boundary:before-jie",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "절입 이전은 앞 명리월의 유효 구간이다.",
    "positive": "이어갈 기준을 점검한다.",
    "risk": "양력월 이름으로 새 월주를 소급 적용",
    "twist": "새 달에서도 기존 조건을 유지할 수 있다.",
    "action": "실제 경계 T 직전까지의 pillar와 ID를 보존한다.",
    "scene": {
      "text": "가상으로 월초 약속을 앞 달의 조건에서 다시 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 instant가 경계 뒤라면 이전 segment를 현재로 쓰지 않는다.",
    "requires": [
      "actual Jie T·before pillar·[start,T)"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:after-jie",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "절입 정각부터 새 월주가 적용된다.",
    "positive": "변경된 관계와 선택 조건을 확인한다.",
    "risk": "정각을 제외하거나 기존 관계를 자동 연장",
    "twist": "같은 일이 계속돼도 적용 기간은 달라질 수 있다.",
    "action": "정각 T와 T+1초의 canonical pillar를 확인한다.",
    "scene": {
      "text": "가상으로 같은 과제의 검토 기준을 새 구간에서 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "경계에서 바뀌지 않은 사실도 새로운 fact로 세지 않는다.",
    "requires": [
      "actual Jie T·after pillar·[T,end)"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:ipchun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "입춘은 월주와 effective annual pillar가 함께 달라지는 경계다.",
    "positive": "연간 표와 현재 구간의 차이를 설명한다.",
    "risk": "selectedYear annualStemRelations를 전 구간에 적용",
    "twist": "입춘 전후 같은 약속도 다른 기간 관계를 만날 수 있다.",
    "action": "전후 실효 연주·월주·관계를 분리한다.",
    "scene": {
      "text": "가상으로 2월 초 계획과 입춘 뒤 실행 조건을 다른 칸에 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "연도 이름만으로 실효 연주를 결정하지 않는다.",
    "requires": [
      "actual Ipchun instant·before/after annual/month pillars"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:exact-dayun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "정확 교운 T 직전과 T부터 활성 cycle이 다르다.",
    "positive": "같은 월주 안에서도 장기 배경의 변화만 비교한다.",
    "risk": "달 전체를 새 대운으로 표시",
    "twist": "월주가 같아도 대운 관계는 달라질 수 있다.",
    "action": "T±1초와 정각의 cycle·관계 참가자를 대조한다.",
    "scene": {
      "text": "가상으로 진행 중인 약속의 책임 범위를 전후로 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새 대운 상세 관계가 없으면 기존 관계로 채우지 않는다.",
    "requires": [
      "exact transition T·cycle index/ganji·interval"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:range-start",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "교운 earliest부터 latest 직전까지 후보 상태를 유지한다.",
    "positive": "확정 원국·월운 근거와 조건부 대운 관계를 나눈다.",
    "risk": "earliest를 실제 교운 시각으로 확정",
    "twist": "공통으로 필요한 행동과 후보별 차이를 분리할 수 있다.",
    "action": "범위 전체와 각 후보의 관계를 별도 상태로 남긴다.",
    "scene": {
      "text": "가상으로 두 가능한 역할에 공통인 확인 사항만 준비한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "후보 두 개를 하나의 합성 대운으로 만들지 않는다.",
    "requires": [
      "earliest/latest·transition_uncertain·conditional facts"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:range-end",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "latest부터 새 cycle이 확정되는 기존 계약을 따른다.",
    "positive": "불확실 구간의 후보와 이후 실제 참가자를 구분한다.",
    "risk": "이전 후보 관계를 range 이후에도 동시에 확정",
    "twist": "범위가 끝나도 원국과 월주는 계속될 수 있다.",
    "action": "latest 직전·정각·직후의 상태를 확인한다.",
    "scene": {
      "text": "가상으로 유보했던 책임을 확정 조건에서 다시 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "range 가운데 대표 timestamp를 생성하지 않는다.",
    "requires": [
      "latest endpoint·active after cycle·certainty"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:pre-first",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "첫 대운 시작 전에는 활성 cycle이 없을 수 있다.",
    "positive": "원국·연주·월주 사실은 독립적으로 남긴다.",
    "risk": "0번 가상 대운이나 첫 주기를 미리 적용",
    "twist": "대운 관계 없이도 확인된 단기 질문은 검토 가능하다.",
    "action": "includesBeforeFirstCycle과 cycles=[]를 그대로 둔다.",
    "scene": {
      "text": "가상으로 대운 관련 주장을 빼고 확인된 학습 조건만 검토한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "저수준 calendar 지원을 유료 발행 성공과 동일시하지 않는다.",
    "requires": [
      "actual first boundary·before_first_cycle·generation gate"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:near-boundaries",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "절입과 교운 경계가 가까워도 두 시각을 합치지 않는다.",
    "positive": "중간 구간의 실제 달라진 요소를 확인한다.",
    "risk": "짧다는 이유로 유효 segment를 버리거나 순서를 바꿈",
    "twist": "월주만 또는 대운만 바뀌는 짧은 구간도 별도 사실이다.",
    "action": "실제 경계를 정렬하고 양끝 포함/제외를 유지한다.",
    "scene": {
      "text": "가상으로 짧은 기간에는 확정된 범위 안의 선택만 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 가까운 경계가 없으면 편의상 시각을 옮기지 않는다.",
    "requires": [
      "two actual boundary instants·ordered positive-length segments"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:multiple-segments",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "한 양력월의 segment 수는 실제 경계로 결정된다.",
    "positive": "각 구간의 시간적 소유자를 모두 보존한다.",
    "risk": "모든 달을 두 구간으로 고정",
    "twist": "더 많은 segment가 더 강한 운을 뜻하지 않는다.",
    "action": "전체 ledger의 연속성과 source ancestry를 확인한다.",
    "scene": {
      "text": "가상으로 12월의 절입 뒤 교운까지 세 구간을 읽는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "구간 개수를 중요도·행운 점수로 쓰지 않는다.",
    "requires": [
      "all boundaries·calendar month start/end·every segment"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  },
  {
    "id": "afpr:boundary:focus-vs-ledger",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "segment_time",
    "meaning": "대표 focus는 실제 원고의 선택이며 전체 구간의 대체물이 아니다.",
    "positive": "지금 읽는 핵심과 나머지 근거의 적용 한계를 같이 확인한다.",
    "risk": "focus 관계를 달 전체로 연장하거나 미선택 근거를 사용했다고 주장",
    "twist": "표시되지 않은 유효 자료는 후속 연구 후보로 남길 수 있다.",
    "action": "displayed proof와 accepted/held/unselected를 다른 목록으로 기록한다.",
    "scene": {
      "text": "가상으로 월초와 절입 뒤의 판단 자료를 각각 열람한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "자료 존재만으로 고객 문장에 연결됐다고 세지 않는다.",
    "requires": [
      "focus interval·all segments·displayed proofs·candidate ledger"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:dayun",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "bindingImplemented": false
  }
];
