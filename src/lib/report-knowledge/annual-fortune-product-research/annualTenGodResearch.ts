import type { Study } from "./researchTypes";

/** Offline research only. No producer, candidate selector, prose or Book binding. */
export const ANNUAL_TEN_GOD_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:annual-god:비견",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 비견의 질문은 자기 기준과 독자 선택이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "자율 판단과 공동 확인의 경계를 구분",
    "risk": "내 방식만을 정답으로 고집",
    "twist": "도움을 구하는 선택도 자기 결정권을 지킬 수 있음",
    "action": "이번 구간에 혼자 끝낼 과제와 검토받을 사안을 나눈다.",
    "scene": {
      "text": "가상으로 팀 과제에서 단독 결론과 공동 승인선을 표시한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "권한이 없는 과제에 독자 결정을 강제하지 않는다.",
    "requires": [
      "독립 판단 관련 natal 근거·실제 권한",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "비견",
    "distinction": "겁재의 공동 자원 배분과 달리 독자 기준의 범위",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:겁재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 겁재의 질문은 함께 쓰는 힘과 자원의 몫이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "기여·비용·명의를 드러내 협업 지속",
    "risk": "친분으로 부담을 숨겨 분담이 불명확",
    "twist": "분담을 작게 정하는 편이 다음 협업을 쉽게 할 수 있음",
    "action": "공동 투입과 각자 회수할 것을 다른 칸에 적는다.",
    "scene": {
      "text": "가상으로 공동 행사 준비 시간과 비용 담당을 따로 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "협업이 없는데 경쟁·배신·손실 사건을 가정하지 않는다.",
    "requires": [
      "공동 자원 관련 natal 근거·실제 소유/동의",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "겁재",
    "distinction": "비견의 독자 기준과 달리 공동 투입의 합의",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:식신",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 식신의 질문은 반복 가능한 산출과 생활 리듬이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "작은 완성 기준과 회복 시간을 함께 유지",
    "risk": "수량을 늘리다 재료·시간 한계를 누락",
    "twist": "산출량을 줄여도 재현 가능한 방식은 남길 수 있음",
    "action": "결과 한 단위의 완료와 수정 횟수를 정한다.",
    "scene": {
      "text": "가상으로 발표 자료 한 부분을 완성해 피드백받는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "산출이 판매·수입·출산·건강으로 이어진다고 단정하지 않는다.",
    "requires": [
      "표현 관련 natal 근거·실제 품질/유지 자원",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "식신",
    "distinction": "상관의 방법 수정과 달리 지속 가능한 산출",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:상관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 상관의 질문은 표현과 방법의 검토이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "불편한 절차에 대안과 시험 범위를 붙임",
    "risk": "맞는 지적이면 수용도 당연하다고 여김",
    "twist": "바꾸지 않을 조건을 먼저 합의하면 개선이 쉬워질 수 있음",
    "action": "문제의 근거·변경 권한·검증 결과를 분리한다.",
    "scene": {
      "text": "가상으로 반복 업무의 한 단계만 바꿔 전후를 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "규정·안전 승인 없이 변경하거나 갈등·실직을 예언하지 않는다.",
    "requires": [
      "표현/기준 natal 근거·실제 변경 승인",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "상관",
    "distinction": "식신의 산출 재현성과 달리 수정 근거·전달 조건",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:편재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 편재의 질문은 외부 접점과 선택 자원이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "제안의 크기보다 감당할 투입·회수를 비교",
    "risk": "유입 가능성을 확보된 수익으로 착각",
    "twist": "기회를 거절하면 남긴 약속의 이행력을 지킬 수 있음",
    "action": "제안별 비용·회수 시점·중단 조건을 적는다.",
    "scene": {
      "text": "가상으로 외부 활동 두 가지의 시간과 지출을 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 제안·거래가 없는데 고객·투자 수익을 만들지 않는다.",
    "requires": [
      "재성 natal 근거·실제 제안/비용",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "편재",
    "distinction": "정재의 반복 운영보다 외부 변수의 선택",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:정재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 정재의 질문은 지속 운영과 자원 유지이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "고정 의무와 여유분을 같은 기간으로 비교",
    "risk": "안정을 지키느라 필요한 변경도 지연",
    "twist": "기존 비용을 줄이는 것도 운영 능력이 될 수 있음",
    "action": "실제 수입·지출 시점을 나누고 남길 여유를 정한다.",
    "scene": {
      "text": "가상으로 생활비와 학습비가 겹치는 주의 가용 자원을 본다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "정기 소득·자산 증가·결혼이 있다고 전제하지 않는다.",
    "requires": [
      "자원 관리 natal 근거·실제 의무/가용 자원",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "정재",
    "distinction": "편재의 외부 선택보다 반복 의무의 지속 조건",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:편관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 편관의 질문은 급한 요구와 책임의 한계이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "실행과 권한·지원·거절 조건을 함께 확인",
    "risk": "견디는 능력으로 회복·위임 필요를 가림",
    "twist": "즉답을 늦춰 승인부터 확인하면 판단이 안정될 수 있음",
    "action": "급한 요청의 우선순위와 지원 요청선을 확인한다.",
    "scene": {
      "text": "가상으로 추가 역할을 제안받아 기존 마감과 결정권을 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 급한 요구가 없는데 위기·질환·사고를 예측하지 않는다.",
    "requires": [
      "책임 관련 natal 근거·실제 요청/지원",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "편관",
    "distinction": "정관의 합의 기준과 달리 압박 대응 범위",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:정관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 정관의 질문은 공식 역할과 약속의 기준이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "평가와 업무 경계를 명확히 해 신뢰 유지",
    "risk": "모든 기대를 자신의 의무로 받아들임",
    "twist": "맡지 않을 일을 밝히면 남긴 약속을 더 잘 지킬 수 있음",
    "action": "완료 기준과 비공식 부탁을 구분한다.",
    "scene": {
      "text": "가상으로 맡은 과제의 평가 항목과 추가 요청을 따로 정리한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "공식 역할이 없는데 승진·합격·혼인 자리를 확정하지 않는다.",
    "requires": [
      "역할/기준 natal 근거·실제 약속/평가",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "정관",
    "distinction": "편관의 긴급 대응보다 규칙과 합의의 지속",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:편인",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 편인의 질문은 다른 관점과 선택적 탐색이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "질문을 좁혀 이해와 작은 적용을 연결",
    "risk": "자료를 더 모으느라 검증 시점을 무기한 연기",
    "twist": "더 읽기보다 작은 시험이 다음 질문을 선명하게 할 수 있음",
    "action": "탐색 종료 기준과 안전한 첫 적용을 한 쌍으로 정한다.",
    "scene": {
      "text": "가상으로 서로 다른 설명 하나씩을 제한된 문제에 시험한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "필수 안전 검토를 생략하거나 고독·천재성을 확정하지 않는다.",
    "requires": [
      "탐색 natal 근거·실제 가설/검증 가능성",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "편인",
    "distinction": "정인의 공유 기반보다 기존 답과 다른 가정 검토",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  },
  {
    "id": "afpr:annual-god:정인",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "annual",
    "meaning": "선택 연도 정인의 질문은 배움과 지원의 활용이며, 한 해의 다른 월 조건과 비교할 기준이다.",
    "positive": "받은 설명을 자기 수행과 기록으로 전환",
    "risk": "보호·준비 안에 머물며 이미 가능한 행동도 연기",
    "twist": "배운 작은 부분을 설명하며 이해가 깊어질 수 있음",
    "action": "자료 없이 설명해 보고 막힌 부분만 다시 확인한다.",
    "scene": {
      "text": "가상으로 배운 절차를 실제 과제 한 부분에 적용한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "지원자·합격·자격 취득·부모 사건을 보장하지 않는다.",
    "requires": [
      "학습 natal 근거·실제 지원/적용 과제",
      "actual dayMaster + target stem + tenGod",
      "exact segment/month bounds where monthly",
      "actual annual/dayun context"
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
    "god": "정인",
    "distinction": "편인의 대안 탐색보다 지식·지원의 이해와 활용",
    "layerRoles": {
      "natal": "개인 구성과 평소 반응의 조건",
      "dayun": "장기 배경과 전환의 조건",
      "annual": "선택 연도 또는 effective annual 조건",
      "monthly": "해당 [start,end) 월주 조건"
    },
    "monthlyGate": "월간과 월지 본기를 구분; 같은 이름의 다른 구간은 별도 기간",
    "annualGate": "selectedYear 대표 십성과 effective annual의 참조를 분리",
    "existingDefinitionOnly": "기존 십성 범주를 재사용; 실제 효과·강도·희기·사건은 새로 계산하지 않음"
  }
];
