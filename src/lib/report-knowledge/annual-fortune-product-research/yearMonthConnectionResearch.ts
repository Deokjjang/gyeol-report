import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_MONTH_CONNECTIONS: readonly Study[] = [
  {
    "id": "afpr:connection:shared-god",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual_monthly_connection",
    "meaning": "연간과 월간 십성이 같아도 장기 질문과 짧은 실행은 다르다.",
    "positive": "같은 방향을 실제 구간의 작은 선택으로 좁힘",
    "risk": "같은 이름을 두 배 강한 운으로 합산",
    "twist": "현재 과제를 줄여 연간 방향을 유지할 수 있음",
    "action": "연간 목적과 이번 구간 완료 조건을 따로 적는다.",
    "scene": {
      "text": "가상으로 올해 학습 목표 중 한 문제만 이번 구간에 풀어본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "십성 일치만으로 강화·성공·시기를 확정하지 않는다.",
    "requires": [
      "actual annual and monthly tenGod",
      "reference stem identity",
      "verified relations if used",
      "valid intervals"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact"
  },
  {
    "id": "afpr:connection:different-god",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual_monthly_connection",
    "meaning": "다른 연간·월간 의미는 같은 생활 안에서 공존할 수 있다.",
    "positive": "확장과 유지 등 다른 요구를 구분",
    "risk": "다른 십성의 존재를 자동 충돌·실패로 해석",
    "twist": "단기 선택을 나누면 서로 다른 요구를 함께 다룰 수 있음",
    "action": "각 요구가 필요한 실제 자원과 담당을 분리한다.",
    "scene": {
      "text": "가상으로 연간 학습 계획을 유지하면서 이 달의 비용을 조정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 관계 계산이 없으면 십성 개념 차이를 명리 충으로 부르지 않는다.",
    "requires": [
      "actual annual and monthly tenGod",
      "reference stem identity",
      "verified relations if used",
      "valid intervals"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact"
  },
  {
    "id": "afpr:connection:changing-dayun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual_monthly_connection",
    "meaning": "월주가 유지돼도 교운에 따라 장기 배경이 달라질 수 있다.",
    "positive": "어느 층위가 달라졌는지 독자가 이해",
    "risk": "연도·월 이름이 같다고 같은 기간 fact로 병합",
    "twist": "변하지 않은 월주·원국 근거는 그대로 남길 수 있음",
    "action": "before/uncertain/after의 cycle과 관계만 별도 비교한다.",
    "scene": {
      "text": "가상으로 같은 과제를 계속하되 책임의 조건을 교운 뒤 다시 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "현재 producer에 없는 전후 상세 관계를 연구로 채우지 않는다.",
    "requires": [
      "actual annual and monthly tenGod",
      "reference stem identity",
      "verified relations if used",
      "valid intervals"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:annual-reading",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact"
  }
];
