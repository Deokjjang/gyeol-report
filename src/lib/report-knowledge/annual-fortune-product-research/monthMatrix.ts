import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_MONTH_MATRIX: readonly Study[] = [
  {
    "id": "afpr:month-slot:01",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "새 달력과 이전 실효 연주의 구분",
    "positive": "달력이 바뀌어도 이어갈 기준을 찾는다.",
    "risk": "1월부터 selectedYear 연주가 모두 적용됐다고 가정",
    "twist": "이전 흐름을 유지하는 선택도 새 계획을 정확하게 할 수 있다.",
    "action": "연간 표와 월초/소한 뒤 pillar를 다른 칸에 적는다.",
    "scene": {
      "text": "가상으로 새 계획표의 첫 주에 이전 약속과 새 목표를 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "새해 시작을 곧 명리 연주 변경으로 해석하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "previous December segment if actually available"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 1,
    "jieName": "소한",
    "primaryMeaning": "새 달력과 이전 실효 연주의 구분",
    "secondaryMeaning": "연초 계획과 현재 적용 중인 연주·월주를 별도 확인",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:02",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "유효 연주와 월주가 함께 바뀌는 실제 경계",
    "positive": "같은 달 안의 서로 다른 연주 조건을 구별한다.",
    "risk": "연간 천간합을 입춘 전 구간에 자동 연장",
    "twist": "같은 약속도 변경된 기간 조건에서 다시 비교할 수 있다.",
    "action": "입춘 직전·정각·직후의 연주와 관계 source를 분리한다.",
    "scene": {
      "text": "가상으로 2월 초 회의의 조건을 입춘 뒤 결정과 별도로 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "달 전체를 하나의 연주나 하나의 관계로 합치지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "effective annual before/after + annualStemRelations validity"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 2,
    "jieName": "입춘",
    "primaryMeaning": "유효 연주와 월주가 함께 바뀌는 실제 경계",
    "secondaryMeaning": "입춘 전후 원국·대운·월운 관계의 참가자 재확인",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:03",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "연주 유지와 새 월주 조건의 차이",
    "positive": "같은 연간 방향 아래 이번 월의 독립 접점을 확인한다.",
    "risk": "새 월이라는 이유로 새로운 기회·사건을 자동 생성",
    "twist": "이전 질문의 적용을 바꾸는 것만으로도 정보가 될 수 있다.",
    "action": "2월 말과 3월 경칩 뒤의 실제 signature 차이만 남긴다.",
    "scene": {
      "text": "가상으로 같은 학습 목표를 다른 과제에 적용할지 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "계절 이미지가 활력·성공을 증명하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual before/after month pillar and relation signatures"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 3,
    "jieName": "경칩",
    "primaryMeaning": "연주 유지와 새 월주 조건의 차이",
    "secondaryMeaning": "지난 입춘의 변화를 다시 새 사실로 세지 않기",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:04",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "반복 참가자와 독립 근거의 구분",
    "positive": "조정할 대상이 다른 관계를 나눠 이해한다.",
    "risk": "같은 지지·다른 문장을 독립 행운·위험 수로 합산",
    "twist": "자리별 적용 질문은 달라도 fact root 수는 정직하게 유지할 수 있다.",
    "action": "참가 지지·원국 위치·중복 root를 같이 기록한다.",
    "scene": {
      "text": "가상으로 협업 절차와 개인 일정의 부담을 다른 문제로 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "원국 일지 관계만으로 연애 장면을 고정하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual affectedPillars + participant identity + root ancestry"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 4,
    "jieName": "청명",
    "primaryMeaning": "반복 참가자와 독립 근거의 구분",
    "secondaryMeaning": "동일 지지가 여러 원국 자리에 있을 때 소유·자리 보존",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:05",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "월간의 선택과 월지 본기의 유지 조건",
    "positive": "겉으로 추진할 일과 실제 지속 자원을 비교한다.",
    "risk": "원고 다양성을 위해 계산에 없는 십성을 추가",
    "twist": "같은 십성이라면 같은 기준을 점검하는 기능도 가능하다.",
    "action": "선택된 god가 월간인지 본기인지 원문 근거를 붙인다.",
    "scene": {
      "text": "가상으로 발표할 내용과 반복 연습할 분량을 따로 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "월지의 모든 지장간이 동시에 활성됐다고 설명하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "month stemTenGod/branchTenGod + main-hidden-stem convention"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 5,
    "jieName": "입하",
    "primaryMeaning": "월간의 선택과 월지 본기의 유지 조건",
    "secondaryMeaning": "월간과 본기 십성이 같거나 다른 이유를 구별",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:06",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "반복 십성과 다른 기간 조건의 비교",
    "positive": "실제 바뀐 접점만 새 정보로 전달한다.",
    "risk": "비슷한 조언을 문장만 바꿔 새 해석으로 표시",
    "twist": "유지할 기준을 짧게 상기하고 다른 적용에 집중할 수 있다.",
    "action": "앞선 동일 god 월의 roots와 현재 segment를 대조한다.",
    "scene": {
      "text": "가상으로 같은 비용 기준을 새로운 활동의 지출에 적용한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "상반기 말이 곧 수확·정산 시기라고 정하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "previous same god + current actual relations + source scope"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 6,
    "jieName": "망종",
    "primaryMeaning": "반복 십성과 다른 기간 조건의 비교",
    "secondaryMeaning": "다른 월과 같은 god가 나와도 참가 관계의 차이 확인",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:07",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "한 해 중간에도 유지되는 조건과 실제 변화",
    "positive": "남길 선택과 다시 검토할 실행 조건을 구분한다.",
    "risk": "7월이 새 운·새 삶의 시작이라고 자동 처리",
    "twist": "달력 구분을 활용하되 운세 fact는 그대로 유지할 수 있다.",
    "action": "실제 소서/교운 경계가 있는지 확인한 뒤 기존 약속을 비교한다.",
    "scene": {
      "text": "가상으로 남은 일정에 현재 계획의 비용이 맞는지 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "교운이 검출되지 않았으면 대운 전환을 창작하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual boundaries + active cycle + continuing annual pillar"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 7,
    "jieName": "소서",
    "primaryMeaning": "한 해 중간에도 유지되는 조건과 실제 변화",
    "secondaryMeaning": "달력의 절반과 명리적 경계가 별개임을 확인",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:08",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "여러 달 이어지는 조건부 범위의 취급",
    "positive": "확정 가능한 생활 기준부터 적용할 수 있다.",
    "risk": "후보 관계를 모두 동시에 발생한 사실로 합산",
    "twist": "판단 유보가 실제 선택의 부담을 줄일 수 있다.",
    "action": "범위가 있으면 earliest/latest를 보존하고 겹치는 구간만 표시한다.",
    "scene": {
      "text": "가상으로 두 가능한 업무 조건에 공통으로 필요한 준비만 한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "8월에 반드시 교운 범위가 있다고 가정하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual uncertainty range if present + conditional counterpart cycle"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 8,
    "jieName": "입추",
    "primaryMeaning": "여러 달 이어지는 조건부 범위의 취급",
    "secondaryMeaning": "교운 불확실성이 있을 때 후보별 관계와 확정 관계 구별",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:09",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "같은 월주의 이어짐과 새 절입 이후의 차이",
    "positive": "같은 조건이면 유지·점검으로 설명할 수 있다.",
    "risk": "절입 전의 반복 흐름을 월 전체의 새로운 특성으로 포장",
    "twist": "새 근거가 적은 구간도 선택을 점검하는 의미가 있다.",
    "action": "월초 carryover와 백로 뒤 새 월주를 따로 비교한다.",
    "scene": {
      "text": "가상으로 이미 정한 작업 순서를 지금 조건에서도 쓸지 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "월 이름이나 계절만으로 결실·평가 결과를 예측하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "prior month last segment + current first/new Jie segment"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 9,
    "jieName": "백로",
    "primaryMeaning": "같은 월주의 이어짐과 새 절입 이후의 차이",
    "secondaryMeaning": "carryover와 onset의 정보 기능을 구별",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:10",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "읽는 순간의 활성 구간과 대표 focus",
    "positive": "지금 적용되는 근거를 먼저 읽을 수 있다.",
    "risk": "미래 절입 뒤 focus를 이미 시작된 흐름으로 표시",
    "twist": "같은 Book의 재생성 검증 시 평가 순간이 달라지면 focus 차이는 가능하다.",
    "action": "고정 평가 instant와 focus start/end를 함께 남긴다.",
    "scene": {
      "text": "가상으로 월초에 읽은 계획과 절입 뒤 확인할 질문을 나눈다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "10월만 현재 월이라고 연구 조건을 고정하지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual reading instant + focus interval + all unselected segments"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 10,
    "jieName": "한로",
    "primaryMeaning": "읽는 순간의 활성 구간과 대표 focus",
    "secondaryMeaning": "현재 월에서 절입 전후 실제 focus가 바뀌는 조건",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:11",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "미래 월과 미입력 생활 상태의 구분",
    "positive": "미래에도 적용할 선택 기준을 조건형으로 남긴다.",
    "risk": "지금 직업·관계가 그 달에도 그대로라고 가정",
    "twist": "생활 상태가 달라져도 같은 자원 질문은 다른 방식으로 쓸 수 있다.",
    "action": "해당 시점에 그 활동이 있다면 적용할 기준을 적는다.",
    "scene": {
      "text": "가상으로 그때 과제가 생긴 경우의 투입 한도를 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "예정되지 않은 취업·만남·가족 사건을 넣지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "period time + context timestamp + actual/conditional scene status"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 11,
    "jieName": "입동",
    "primaryMeaning": "미래 월과 미입력 생활 상태의 구분",
    "secondaryMeaning": "연간/월간 미래 시제와 실제 직업·관계 미상 분리",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  },
  {
    "id": "afpr:month-slot:12",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "civil_month",
    "meaning": "양력 연말과 명리 흐름의 끝 구분",
    "positive": "연말에도 계속되는 기준과 종료할 약속을 구별한다.",
    "risk": "12월을 대운·세운의 최종 결과나 성공 도착점으로 만들기",
    "twist": "연말 이후에도 동일 월주가 이어질 수 있다.",
    "action": "지원되는 다음 연도 첫 구간이 있을 때만 연결을 비교한다.",
    "scene": {
      "text": "가상으로 연말 약속과 다음 달에도 유지할 자원을 다른 칸에 놓는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "다음 연도 ledger가 없으면 월주 이후 관계를 만들어내지 않는다.",
    "requires": [
      "selectedYear + actual civil month bounds",
      "every canonical segment",
      "actual last segment + optional next-year canonical segment + boundaries"
    ],
    "disallowed": [
      "입력받지 않은 과거 경험 단정",
      "성공·실패·수입·질병·혼인 사건 예언",
      "근거 없는 시주·복합 관계 생성"
    ],
    "sourceRefs": [
      "afpr:source:jie",
      "afpr:source:month-copy",
      "afpr:source:editorial"
    ],
    "verification": "conditional_editorial_not_calculated_fact",
    "month": 12,
    "jieName": "대설",
    "primaryMeaning": "양력 연말과 명리 흐름의 끝 구분",
    "secondaryMeaning": "다음 1월로 이어질 월주와 실제 교운 경계 확인",
    "duplicateMeaningGroup": "actual_fact_root_and_scope_not_month_name",
    "previousMonthDifference": "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold",
    "nextMonthConnection": "only if next canonical segment is present; continuity or comparison without new event",
    "notFixedToYear": true,
    "notMonthlyFate": true,
    "segmentCountFixed": false,
    "informationFunctionNotCalculatedEvidence": true
  }
];
