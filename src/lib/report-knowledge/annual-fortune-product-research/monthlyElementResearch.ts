import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const MONTHLY_ELEMENT_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:element:wood",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "목의 전통 상징을 확장·시도의 현대 질문으로 제한한다.",
    "positive": "새 과제를 작은 단위로 시험할 수 있다.",
    "risk": "가지 수를 늘려 실제 유지 자원이 분산될 수 있다.",
    "twist": "확장보다 남길 한 가지를 고르는 편이 유효할 수 있다.",
    "action": "새 활동 하나의 종료·검토 조건을 정한다.",
    "scene": {
      "text": "가상으로 관심 분야 두 가지 중 한 번 시험할 과제를 고른다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 원국 분포·월운 오행·생활 조건 없이 성장 사건을 예언하지 않는다.",
    "requires": [
      "actual month stem/branch elements",
      "natal distribution labels",
      "existing element fact IDs",
      "actual life context"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:legacy-saju",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "element": "wood",
    "traditionalSymbolIsModernScene": false,
    "modernApplicationIsTraditionalFact": false,
    "strengthCalculated": false,
    "usefulGodCalculated": false
  },
  {
    "id": "afpr:element:fire",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "화의 드러남 상징을 표현·반응 확인의 질문으로 제한한다.",
    "positive": "보여줄 결과를 통해 실제 반응을 확인한다.",
    "risk": "눈에 띄는 양을 보상·인정 확보로 착각할 수 있다.",
    "twist": "공개 범위를 좁히는 선택이 피드백을 정확하게 할 수 있다.",
    "action": "누구에게 어느 완성도로 보여줄지 정한다.",
    "scene": {
      "text": "가상으로 시제품을 소수에게 보여주고 질문을 받는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "화 유입만으로 인기·승진·건강을 판단하지 않는다.",
    "requires": [
      "actual month stem/branch elements",
      "natal distribution labels",
      "existing element fact IDs",
      "actual life context"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:legacy-saju",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "element": "fire",
    "traditionalSymbolIsModernScene": false,
    "modernApplicationIsTraditionalFact": false,
    "strengthCalculated": false,
    "usefulGodCalculated": false
  },
  {
    "id": "afpr:element:earth",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "토의 기반 상징을 생활·운영의 유지 조건으로 제한한다.",
    "positive": "반복할 약속과 가용 자원을 나란히 볼 수 있다.",
    "risk": "유지 자체를 목표로 삼아 변경 여지가 사라질 수 있다.",
    "twist": "기존 약속을 줄이는 것이 기반을 오래 지킬 수 있다.",
    "action": "유지 비용과 조정 가능한 부분을 나눠 적는다.",
    "scene": {
      "text": "가상으로 반복 일정 하나를 격주로 바꾸어 부담을 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "토가 많다고 부동산·재물·소화기 사건을 예언하지 않는다.",
    "requires": [
      "actual month stem/branch elements",
      "natal distribution labels",
      "existing element fact IDs",
      "actual life context"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:legacy-saju",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "element": "earth",
    "traditionalSymbolIsModernScene": false,
    "modernApplicationIsTraditionalFact": false,
    "strengthCalculated": false,
    "usefulGodCalculated": false
  },
  {
    "id": "afpr:element:metal",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "금의 구분 상징을 기준·선택의 현대 질문으로 제한한다.",
    "positive": "무엇을 남기고 수정할지 기준을 정할 수 있다.",
    "risk": "정확한 기준이 상대에게 평가·통제로 전달될 수 있다.",
    "twist": "예외 조건을 명시하면 기준의 신뢰가 높아질 수 있다.",
    "action": "필수 기준과 협의 가능한 방법을 분리한다.",
    "scene": {
      "text": "가상으로 공동 작업의 검사 항목과 각자 방법을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "금 유입으로 결단력·권위·질병을 확정하지 않는다.",
    "requires": [
      "actual month stem/branch elements",
      "natal distribution labels",
      "existing element fact IDs",
      "actual life context"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:legacy-saju",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "element": "metal",
    "traditionalSymbolIsModernScene": false,
    "modernApplicationIsTraditionalFact": false,
    "strengthCalculated": false,
    "usefulGodCalculated": false
  },
  {
    "id": "afpr:element:water",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "수의 흐름 상징을 정보·관찰·연결의 현대 질문으로 제한한다.",
    "positive": "서로 다른 정보를 비교해 질문을 좁힐 수 있다.",
    "risk": "관찰을 충분히 해야 한다며 실행을 계속 미룰 수 있다.",
    "twist": "추가 정보 수집보다 작은 적용이 더 필요한 자료를 알려줄 수 있다.",
    "action": "현재 가진 자료로 확인할 수 있는 질문을 하나 고른다.",
    "scene": {
      "text": "가상으로 여러 조언에서 직접 시험 가능한 가정을 골라본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "수 유입을 지능·부·건강 변화로 확정하지 않는다.",
    "requires": [
      "actual month stem/branch elements",
      "natal distribution labels",
      "existing element fact IDs",
      "actual life context"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:relation-facts",
      "afpr:source:legacy-saju",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "element": "water",
    "traditionalSymbolIsModernScene": false,
    "modernApplicationIsTraditionalFact": false,
    "strengthCalculated": false,
    "usefulGodCalculated": false
  }
];
