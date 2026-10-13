import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_DOMAIN_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:domain:self",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "평소 반응과 한 해·구간의 요구를 분리",
    "positive": "내 기준을 새 과제에 쓸 조건 확인",
    "risk": "기간이 성격을 새로 만든다는 단정",
    "twist": "성향을 바꾸지 않고 사용처를 바꿀 수 있음",
    "action": "개인 근거와 기간 질문을 각각 한 줄로 적는다.",
    "scene": {
      "text": "가상으로 평소 검토 습관을 짧은 과제에 적용한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "MBTI·원국만으로 현재 행동을 이미 안다고 보지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "self",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:work",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "연간 역할과 해당 구간의 실제 책임·마감 조건",
    "positive": "맡을 범위·완료 기준을 구체화",
    "risk": "현재 직업이 선택한 과거·미래에도 동일하다는 가정",
    "twist": "업무가 없는 시기에는 일반 과제의 선택 기준으로 제한 가능",
    "action": "실제 역할이 있다면 마감과 결정권을 같이 확인한다.",
    "scene": {
      "text": "가상으로 발표 준비의 담당 범위를 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "미입력 취업·승진·매출을 만들어내지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "work",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:money",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "연간 운영 질문과 구간별 지출·회수 조건",
    "positive": "가용 자원을 실제 일정에 맞춰 비교",
    "risk": "편재·정재가 수익을 보장한다는 단정",
    "twist": "지출을 줄이는 결정도 선택권을 늘릴 수 있음",
    "action": "정해진 비용과 아직 기대인 유입을 분리한다.",
    "scene": {
      "text": "가상으로 활동 참여비와 생활비가 겹치는 날짜를 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "소득·부채·투자 경험을 입력 없이 확정하지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "money",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:learning",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "한 해의 학습 방향과 짧은 검증 과제",
    "positive": "배운 것의 적용과 피드백을 구체화",
    "risk": "인성이 합격·자격·지원자를 보장한다는 단정",
    "twist": "더 배우기보다 이미 아는 것을 써보는 선택도 유효",
    "action": "이번 구간에 설명·풀이할 작은 문제를 정한다.",
    "scene": {
      "text": "가상으로 자료를 닫고 한 주제의 원리를 설명한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "과거·미래 학생 신분을 자동 유지하지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "learning",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:social",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "관계의 연간 질문과 구간별 약속·역할 조정",
    "positive": "동의·기여·거절 기준을 실제 관계에서 확인",
    "risk": "합=호감·충=악연을 확정",
    "twist": "접점을 줄여도 신뢰를 유지할 수 있음",
    "action": "함께 정할 것과 개인 선택을 구분한다.",
    "scene": {
      "text": "가상으로 모임 일정에서 모두의 참여 가능 범위를 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "상대 입력 없이 마음·친구 수·지속 기간을 계산하지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "social",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:intimacy",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "친밀함의 장기 기대와 짧은 연락·만남 조건",
    "positive": "원하는 도움과 생활 속 여유를 확인",
    "risk": "원국 일지 관계를 월별 연애 사건으로 고정",
    "twist": "기다리거나 거절할 여유가 편안함을 도울 수 있음",
    "action": "그 시기에 관계가 있다면 연락·만남의 기대를 묻는다.",
    "scene": {
      "text": "가상으로 바쁜 주의 연락 빈도를 함께 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "결혼·임신·이별·새 연인 출현을 예언하지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "intimacy",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:family_life",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "생활·돌봄의 연간 책임과 구간별 분담 조건",
    "positive": "회복·지원·담당의 범위를 나눔",
    "risk": "가족 역할·건강 문제·이사 사실을 생성",
    "twist": "위임과 일정 축소가 돌봄의 지속을 도울 수 있음",
    "action": "실제 생활 의무가 있다면 대체 가능한 담당을 찾는다.",
    "scene": {
      "text": "가상으로 집안일 한 가지의 담당과 쉬는 시간을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "가족 구성·부모 사건·자녀 발달을 미입력 상태에서 확정하지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "family_life",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  },
  {
    "id": "afpr:domain:new_choice",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "conditional_life_application",
    "meaning": "연간 방향 아래 구간별로 되돌릴 수 있는 선택",
    "positive": "작은 시험과 재검토 조건을 정함",
    "risk": "절입·교운 시각을 의사결정 실행일로 강제",
    "twist": "선택을 미루는 판단도 실제 조건에 맞을 수 있음",
    "action": "시도할 범위와 중단·수정 조건을 나란히 둔다.",
    "scene": {
      "text": "가상으로 새로운 활동을 하루만 체험한 뒤 다음 참여를 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "시도 자체가 성공·변화 완료라는 결과가 되지 않는다.",
    "requires": [
      "actual annual and monthly evidence",
      "context timestamp",
      "actual or hypothetical status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:practice",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "domain": "new_choice",
    "layerDifference": {
      "dayun": "장기 유지 조건",
      "annual": "선택한 한 해의 질문",
      "monthly": "그 안의 짧은 시기별 실제 차이"
    }
  }
];
