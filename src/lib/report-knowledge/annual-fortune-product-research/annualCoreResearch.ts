import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_CORE_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:core:stem",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 천간의 관계 범주와 실제 실효 연주를 구분한다.",
    "positive": "한 해의 선택 주제를 일간 기준으로 확인할 수 있다.",
    "risk": "selectedYear 천간을 입춘 전 모든 구간에 적용하면 참가자가 달라진다.",
    "twist": "새 달력이 시작돼도 이전 연주의 조건이 남을 수 있다.",
    "action": "연간 간지와 segment effectiveAnnualPillar를 나란히 기록한다.",
    "scene": {
      "text": "가상으로 1월 계획표에서 올해 목표와 현재 실효 조건을 다른 칸에 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "입춘 이전에는 연간 표와 구간 연주가 다르면 같은 사실로 묶지 않는다.",
    "requires": [
      "dayMaster·annualGanji·effectiveAnnualPillar·time bounds"
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
    "id": "afpr:core:branch",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "연지 자체와 원국/월운/대운 지지 관계는 서로 다른 출처다.",
    "positive": "구체적인 참가자와 접점을 분리해 생활 질문을 정한다.",
    "risk": "연지 하나를 전체 원국의 성향이나 사건으로 확장할 수 없다.",
    "twist": "같은 연지여도 일간·자리·대운에 따라 다른 질문을 제공한다.",
    "action": "관계의 상대와 소유자·원국 자리를 함께 확인한다.",
    "scene": {
      "text": "가상으로 동일 연도의 두 사람이 다른 원국 접점을 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "상대 지지가 없거나 관계가 검출되지 않으면 그 관계 설명을 보류한다.",
    "requires": [
      "실제 연지·상대 지지·position·source owner·relation ID"
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
    "id": "afpr:core:ten-god",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "세운 십성은 일간 대비 해당 연간의 관계 이름이다.",
    "positive": "장기 대운과 같은 부분·다른 요구를 한 해의 질문으로 나눈다.",
    "risk": "십성명만으로 특정 직업·소득·배우자가 생긴다고 설명하지 않는다.",
    "twist": "같은 십성이 와도 유지·비교의 해가 될 수 있다.",
    "action": "대운/세운/월운 십성에 각각 참조 천간과 기간을 붙인다.",
    "scene": {
      "text": "가상으로 연간 정재의 운영 질문과 월간 상관의 개선 질문을 분리한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "대운간 기준 flowGod를 일간 기준 세운 십성으로 바꾸지 않는다.",
    "requires": [
      "기준 stem·target stem·scope·tenGod calculation source"
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
    "id": "afpr:core:elements",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "세운 오행의 표지와 원국 분포에 대한 기존 해석을 구별한다.",
    "positive": "이미 많이 쓰는 방식과 새로 살필 방식을 비교한다.",
    "risk": "오행 유입이 곧 용신·희기·건강 개선이라는 결론은 아니다.",
    "twist": "보완할 가능성이 있어도 실제 상황에서는 과용을 줄이는 편이 유효할 수 있다.",
    "action": "분포·유입 표지와 실제 자원 조건을 분리해 적는다.",
    "scene": {
      "text": "가상으로 새 활동의 양을 늘리기 전에 가용 시간을 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "강약·희기 계산이 없으면 유리한 오행이라고 승인하지 않는다.",
    "requires": [
      "annual elements·natal labels·existing elementEffect·context"
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
    "id": "afpr:core:natal",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "타고난 성향은 연간 운이 새로 만든 인물이 아니다.",
    "positive": "같은 강점의 다른 적용 조건을 검토한다.",
    "risk": "원국 신살·귀인이 올해나 월운에 새로 발생한 것처럼 표시될 수 있다.",
    "twist": "기존 성향이 기간의 다른 요구를 감당하는 자원이 될 수 있다.",
    "action": "개인 근거와 기간 claim의 proof를 별도로 남긴다.",
    "scene": {
      "text": "가상으로 익숙한 학습 방식이 올해 실제 과제에 맞는지 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "동일한 원국 설명을 여러 달의 새 fact로 세지 않는다.",
    "requires": [
      "natal fact root·annual ID·conditional application"
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
    "id": "afpr:core:dayun",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "대운은 장기 배경이고 세운은 그 안의 해당 연도 조건이다.",
    "positive": "같은 큰 배경 아래 올해 검토할 선택을 좁힌다.",
    "risk": "연도 표의 selected cycle을 교운 전후 모두의 활성 주기로 취급할 수 없다.",
    "twist": "같은 연주도 교운 뒤에는 다른 대운 배경과 만난다.",
    "action": "crossPeriods의 실제 구간·활성 상태·참가 cycle을 읽는다.",
    "scene": {
      "text": "가상으로 교운 전후에 계속할 약속과 다시 검토할 비용을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "transition_uncertain에서는 두 후보 작용을 동시에 확정하지 않는다.",
    "requires": [
      "activeDayunContext·cycle index/ganji·valid interval"
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
    "id": "afpr:core:continuity",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "원국과 장기 조건의 유지 자체도 연간 비교의 정보다.",
    "positive": "새 변화를 만들기보다 계속 유효한 기준을 확인한다.",
    "risk": "작년에 하던 일을 실제로 했다거나 성과가 쌓였다고 꾸밀 수 있다.",
    "twist": "새로운 근거가 없으면 유지·점검으로 정직하게 설명할 수 있다.",
    "action": "새 fact·새 적용·비교·유지·보류를 구분한다.",
    "scene": {
      "text": "가상으로 동일한 판단 기준을 다른 과제에 적용할지 검토한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "과거 행동 입력이 없으면 실제 경험의 결론을 내리지 않는다.",
    "requires": [
      "이전/현재 기간 사실·fact roots·actual history status"
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
    "id": "afpr:core:new-condition",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "새로운 연도 조건은 달라진 실제 간지·관계·유효 기간에서 찾는다.",
    "positive": "어느 층위가 달라졌는지 독자가 구별할 수 있다.",
    "risk": "문장 표현의 차이를 새로운 근거로 세면 정보가 부풀려진다.",
    "twist": "연주가 달라도 독립 의미 차이가 적으면 비교 질문만 남길 수 있다.",
    "action": "전후 signature의 참가자·기간·관계 차이를 대조한다.",
    "scene": {
      "text": "가상으로 새로운 연주 접점이 생긴 부분만 별도 표기한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "다른 연도라는 이유만으로 삶의 전환을 확정하지 않는다.",
    "requires": [
      "actual annual signature·previous signature·independent source IDs"
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
    "id": "afpr:core:year-question",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "연간 핵심은 사건 목록보다 지속할 선택의 질문이다.",
    "positive": "월별 실제 차이를 한 해의 방향과 연결한다.",
    "risk": "목표가 곧 달성되거나 특정 달에 결과가 난다는 결론은 아니다.",
    "twist": "작은 월별 실험이 연간 목표의 수정 근거가 될 수 있다.",
    "action": "연간 질문과 월별 확인 가능한 판단을 한 줄씩 분리한다.",
    "scene": {
      "text": "가상으로 올해 배울 과제와 이번 구간에 시험할 내용을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 목표를 입력하지 않았다면 조건형 제안으로만 남긴다.",
    "requires": [
      "annual tenGod·actual monthly facts·known user context"
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
    "id": "afpr:core:positive",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "긍정은 검증된 접점과 자원을 활용할 조건이다.",
    "positive": "연결·학습·산출의 가능성을 제한된 행동으로 옮긴다.",
    "risk": "합이나 귀인 표지가 있다는 이유로 성공·후원자 출현을 약속할 수 없다.",
    "twist": "범위를 줄이면 좋은 접점을 더 오래 사용할 수 있다.",
    "action": "확인된 접점에서 시도할 양과 종료 조건을 정한다.",
    "scene": {
      "text": "가상으로 협업 제안을 작게 시험한 뒤 다음 조건을 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "참가 조건과 실제 생활 접점이 없으면 적용하지 않는다.",
    "requires": [
      "actual supported relation/feature·context·counterconditions"
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
    "id": "afpr:core:overuse",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "주의는 실제 관계·원국 주의 성향·생활 부담을 구분해 읽는다.",
    "positive": "필요한 조정의 대상을 좁혀 불필요한 불안을 줄인다.",
    "risk": "충·형의 이름만으로 실패나 건강 사건을 확정할 수 없다.",
    "twist": "조정 필요성을 발견하는 일이 기존 무리를 줄이는 기회가 될 수 있다.",
    "action": "지금 바꿀 수 있는 일정·책임·자원 조건을 확인한다.",
    "scene": {
      "text": "가상으로 급한 요청을 받았을 때 기존 약속과 충돌하는 부분을 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 부담이 없으면 이미 문제가 생긴 것처럼 말하지 않는다.",
    "requires": [
      "confirmed relation·actual participant·natal warning·life condition"
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
    "id": "afpr:core:twist",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "반전은 상징을 반대로 예언하는 것이 아니라 다른 활용 가능성이다.",
    "positive": "성취 확대 외에 지속·위임·유보의 가치를 설명한다.",
    "risk": "위험 근거를 없애거나 실패가 성공으로 바뀐다고 확정할 수 없다.",
    "twist": "선택하지 않는 판단도 자원과 관계를 지킬 수 있다.",
    "action": "주어진 조건에서 비용이 낮은 다른 선택을 비교한다.",
    "scene": {
      "text": "가상으로 새 공부를 추가하기보다 이미 배운 내용을 한 번 써본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "반전 가능성을 실제 결과나 해소 판정으로 승인하지 않는다.",
    "requires": [
      "actual positive/risk premises·alternative action·counterexample"
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
    "id": "afpr:core:annual-month-link",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "연간 질문과 월별 구간 질문은 범위가 다르다.",
    "positive": "전체 방향과 짧은 실행 조건을 서로 대체하지 않고 연결한다.",
    "risk": "한 focus 문단을 달 전체의 모든 segment 사실로 확대할 수 있다.",
    "twist": "같은 월주가 이어져도 연주·대운 경계가 바뀌면 다른 비교가 필요하다.",
    "action": "대표 focus와 전체 ledger의 적용 범위를 함께 확인한다.",
    "scene": {
      "text": "가상으로 월초에 시작한 선택을 절입 뒤 조건과 다시 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "같은 표현이 있다고 근거의 시간 범위를 합치지 않는다.",
    "requires": [
      "annual facts·month focus·all segments·time validity"
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
