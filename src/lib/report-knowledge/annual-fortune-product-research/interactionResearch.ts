import type { Study } from "./researchTypes";

/** Conditional offline applications; no calculation, selection or prose binding. */
export const ANNUAL_SCOPE_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:scope:natal_saeun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun",
    "meaning": "원국 자리와 선택 연주",
    "positive": "개인 기반과 연간 접점을 구분",
    "risk": "원국을 올해 새로 생긴 특성으로 표시",
    "twist": "연간 관계와 구간의 다른 실효 연주를 분리하면 정확성이 높아짐",
    "action": "선택 연도와 실효 연주가 같은지 확인한 뒤 원국 자리별 관계를 읽는다.",
    "scene": {
      "text": "가상으로 1월에 읽는 연간 표의 질문을 현재 유효한 연주와 따로 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "원국 각 지지 + annualGanji.branch",
    "supported": "natalAnnualRelations.interactions; annualStemRelations separate year-level projection",
    "unsupported": "입춘 전 다른 effectiveAnnualPillar에 annualGanji 관계를 소급",
    "compositeVerdictSupported": null,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:natal_wolun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_wolun",
    "meaning": "원국 자리와 실제 월주",
    "positive": "같은 개인 기반의 짧은 적용 조건을 구체화",
    "risk": "일지 관계를 반드시 연애로 해석",
    "twist": "같은 관계가 다른 원국 자리에 걸리면 생활 질문은 달라질 수 있음",
    "action": "month target과 natal anchor의 자리·간지를 확인하고 해당 구간에만 적용한다.",
    "scene": {
      "text": "가상으로 같은 생활 과제에 나타나는 원국 월지와 일지의 서로 다른 접점을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "확정 natal position + segment month pillar",
    "supported": "month_natal_branch / month_natal_element; extension canonical month-target rules",
    "unsupported": "natal-only 신살을 transit으로 승격·미상 시주 생성",
    "compositeVerdictSupported": null,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:dayun_saeun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_saeun",
    "meaning": "활성 대운과 실효 연주",
    "positive": "장기 배경과 연간 요구의 차이를 비교",
    "risk": "선택 연도의 cycle 하나를 모든 구간에 적용",
    "twist": "연주가 같아도 교운 뒤 접점이 달라질 수 있음",
    "action": "annualGod와 flowGod가 각각 어느 stem을 기준으로 했는지 기록한다.",
    "scene": {
      "text": "가상으로 장기 자원 관리와 한 해의 외부 선택을 다른 참조 기준으로 검토한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "active cycle + segment effective annual pillar",
    "supported": "annualEvidence.crossPeriods cycles.branchRelations; flowGod references cycle stem",
    "unsupported": "uncertain 후보 동시 확정·flowGod를 natal-dayMaster annualGod로 치환",
    "compositeVerdictSupported": null,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:dayun_wolun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "dayun_wolun",
    "meaning": "활성 대운과 실제 월주",
    "positive": "같은 월주에서 장기 배경이 달라지는 조건을 설명",
    "risk": "후보별 관계를 한 묶음의 위험으로 합산",
    "twist": "조건부 관계를 제외해도 확정 원국·세운 관계는 남음",
    "action": "대운 후보마다 cycle index·월지·certainty를 확인하고 확정 관계와 별도로 둔다.",
    "scene": {
      "text": "가상으로 역할이 미확정인 동안 후보별 책임 조건을 각각 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "segment activeDayunContext.cycles + month pillar",
    "supported": "month_dayun_branch confirmed/conditional; binary relation table",
    "unsupported": "두 참가자 삼합·범위 내부 활성 확정·천간합화",
    "compositeVerdictSupported": null,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:saeun_wolun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "saeun_wolun",
    "meaning": "실효 연주와 실제 월주",
    "positive": "연간 질문이 짧은 구간에서 만나는 접점을 확인",
    "risk": "합 이름으로 연간 목표 달성을 보장",
    "twist": "같은 월간 십성도 실효 연주가 다르면 다른 접점을 가짐",
    "action": "counterpart 연주가 해당 segment의 effectiveAnnualPillar와 같은지 확인한다.",
    "scene": {
      "text": "가상으로 입춘 전의 월운 접점을 선택 연도 표와 구분해 기록한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "effectiveAnnualPillar + month pillar",
    "supported": "month_annual_branch confirmed binary relations",
    "unsupported": "selectedYear annualGanji로 counterpart 대체·두 참가자 삼합",
    "compositeVerdictSupported": null,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:natal_dayun_saeun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun_saeun",
    "meaning": "세 층위의 독립 관계 비교",
    "positive": "각 층위가 다른 질문을 제공할 수 있음을 나란히 비교",
    "risk": "관계 수를 독립 근거 수나 운세 점수로 합산",
    "twist": "교집합이 없으면 관계들을 따로 보류/설명",
    "action": "세 층위에서 독립적으로 확인된 pair와 유효 기간만 나란히 비교한다.",
    "scene": {
      "text": "가상으로 개인 기준·장기 운영·연간 제안의 질문을 합성 결론 없이 따로 둔다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "natal / active dayun / effective annual 각각 실제 참가자",
    "supported": "verified pair-level comparisons only; no dedicated three-layer verdict",
    "unsupported": "단일 pair를 composite 성립·강도·해소 판정으로 승격",
    "compositeVerdictSupported": false,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:natal_saeun_wolun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_saeun_wolun",
    "meaning": "원국·실효 연주·월주의 독립 관계 비교",
    "positive": "개인 기반과 연간 방향과 짧은 조건의 차이 이해",
    "risk": "서로 다른 pair를 같은 사건으로 병합",
    "twist": "확인된 연결과 긴장이 함께 있어도 상쇄할 필요 없음",
    "action": "연간·월간의 차이와 원국 root의 지속을 분리하고 복합 성립 주장은 보류한다.",
    "scene": {
      "text": "가상으로 평소 학습 방식과 연간 목표, 이번 실습의 조건을 다른 칸에 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "actual natal / annual / monthly participants",
    "supported": "existing separately supported pairs only",
    "unsupported": "dedicated three-layer formation/transformation/strength verdict",
    "compositeVerdictSupported": false,
    "formation": "existing producer confirmation only; conditional remains conditional"
  },
  {
    "id": "afpr:scope:natal_dayun_saeun_wolun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "natal_dayun_saeun_wolun",
    "meaning": "네 층위의 시간 교집합 비교",
    "positive": "어떤 층위가 확정이고 무엇이 보류인지 명확하게 확인",
    "risk": "모든 상징을 한 사람의 미래 사건으로 결론",
    "twist": "미확정 대운을 빼도 확정된 다른 층위는 보존 가능",
    "action": "네 층위의 시간 교집합을 확인하고 미확정 대운에 의존하는 claim만 보류한다.",
    "scene": {
      "text": "가상으로 전환 범위 안에서도 확정된 월주·연주와 후보 대운의 조건을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가자·기간 교집합·형성 근거가 없으면 복합 결론을 보류한다.",
    "requires": [
      "actual participants",
      "original evidence IDs",
      "source/version",
      "valid interval intersection",
      "counterconditions"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-evidence",
      "afpr:source:jie",
      "afpr:source:relation-facts",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "participants": "actual natal / active or conditional dayun / annual / monthly",
    "supported": "separate pair packets + time validity; no four-layer verdict",
    "unsupported": "dedicated four-layer composite·명리 강도·희기·해소·사건 예측",
    "compositeVerdictSupported": false,
    "formation": "existing producer confirmation only; conditional remains conditional"
  }
];
