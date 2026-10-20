import type { Study } from "./researchTypes";

/** Conditional offline applications; no calculation, selection or prose binding. */
export const ANNUAL_INFORMATION_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:information:continuation",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "같은 월주·연주·대운이 이어지는가?",
    "positive": "유지·점검을 새 사실과 구분",
    "risk": "같은 흐름을 새로운 운세 사건으로 포장",
    "twist": "다른 과제 적용만 새 정보일 수 있음",
    "action": "이전 마지막 구간과 현재 첫 구간의 월주·연주·대운이 같은지 확인하고 유지 질문을 표시한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:same-god",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "같은 십성이라도 참가자·scope·기간이 다른가?",
    "positive": "정의 반복을 줄이고 실제 차이를 설명",
    "risk": "단순 문장 변형을 독립 의미로 계산",
    "twist": "다른 월지 본기·관계가 다른 조건을 줄 수 있음",
    "action": "같은 god를 앞서 쓴 월의 실제 관계·본기·기간을 대조해 새 차이만 남긴다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:same-root",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "같은 원국 root를 여러 달에서 재사용하는가?",
    "positive": "개인 기반을 유지하며 적용을 구분",
    "risk": "원국 한 사실을 매달 새로운 Evidence로 합산",
    "twist": "한 번 설명한 기반은 짧게 상기할 수 있음",
    "action": "개인별 root ledger에서 이미 설명한 원국 사실을 찾아 새 적용과 분리한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:new-pair",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "새 관계의 실제 참가자와 유효 구간이 확인되는가?",
    "positive": "달라진 접점만 설명",
    "risk": "relation label이 있다는 이유로 실제 검출로 승격",
    "twist": "연결과 긴장의 대상이 다르면 함께 남김",
    "action": "새 relation ID의 실제 참가자와 성립 구간을 확인하고 이전 pair와 구별한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:mixed-meaning",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "긍정과 위험이 별도 조건을 제공하는가?",
    "positive": "접점과 조정 부담을 따로 남김",
    "risk": "합이 충을 지웠다고 해석",
    "twist": "제한된 연결과 긴장이 동시에 존재 가능",
    "action": "support와 friction의 서로 다른 owner·조건을 비교하고 상쇄 주장은 제외한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:domain-fit",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "선택한 장면이 근거의 domain과 실제 상태에 맞는가?",
    "positive": "학습·일·관계의 적용 조건을 좁힘",
    "risk": "학생의 모든 월을 수입·고객 장면으로 채움",
    "twist": "돈의 원국 의미도 학습 자원의 선택으로 조건부 검토 가능",
    "action": "입력 시점의 상태와 적용 월의 상태를 구분하고 해당 활동이 있을 때만 장면을 제시한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:action-repeat",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "같은 조언이 다른 달에 새 판단을 주는가?",
    "positive": "조건·대상·종료 기준의 차이를 비교",
    "risk": "범위 확인이라는 말만 바꿔 정보로 세기",
    "twist": "차이가 없으면 짧은 continuity로 분류",
    "action": "이전 행동과 현재 행동에서 판단 대상·비용·종료 기준이 실제 달라졌는지 확인한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:past-limit",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "과거 시제에 실제 경험을 꾸며 넣었는가?",
    "positive": "있었다면 돌아볼 질문으로 남김",
    "risk": "이미 손실·성공·만남을 겪었다고 단정",
    "twist": "기억이 없으면 적용을 유보할 수 있음",
    "action": "과거 문장을 실제 이력의 진술과 조건부 회고 질문으로 구분해 검토한다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  },
  {
    "id": "afpr:information:future-limit",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "cross_month",
    "meaning": "미래 월에 현재 직업·관계가 고정돼 있는가?",
    "positive": "해당 활동이 있을 때만 사용할 기준 제시",
    "risk": "지금 상태를 과거·미래 이력으로 확대",
    "twist": "생활 상태가 달라져도 다른 적용 질문 가능",
    "action": "미래 문장의 직업·소득·관계 상태를 확인된 입력과 조건형 장면으로 나눈다.",
    "scene": {
      "text": "가상으로 두 월의 같은 표현이 다른 조건을 설명하는지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새로운 차이가 없으면 continuity/comparison/withhold로 남긴다.",
    "requires": [
      "actual source ancestry",
      "previous/current/next period evidence",
      "displayed proof ledger"
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
    "verification": "conditional_editorial_not_calculated_fact",
    "newScores": 0,
    "newWeights": 0
  }
];
