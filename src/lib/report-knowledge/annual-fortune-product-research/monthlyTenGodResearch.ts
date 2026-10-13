import type { Study } from "./researchTypes";

/** Conditional offline applications; no calculation, selection or prose binding. */
export const MONTHLY_TEN_GOD_RESEARCH: readonly Study[] = [
  {
    "id": "afpr:month-god:비견",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "짧은 마감 안에서 혼자 결정할 부분과 검토가 필요한 부분을 구분하는 질문이다.",
    "positive": "작은 선택의 완료 기준을 본인이 설명할 수 있다.",
    "risk": "기한이 짧다는 이유로 공동 검토가 필요한 항목까지 혼자 확정할 수 있다.",
    "twist": "검토할 시점을 먼저 정하면 승인을 기다리는 시간에도 독자 작업을 진행할 수 있다.",
    "action": "이번 과제에서 바로 정할 한 가지와 검토받을 한 가지를 나눠 완료일을 적는다.",
    "scene": {
      "text": "가상으로 발표 자료의 구성은 직접 정하고 공개 전 사실 확인은 함께 받는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "공동 승인 의무가 있거나 되돌릴 수 없는 결정이면 단독 시험을 권하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:겁재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "한 번의 공동 작업에서 투입한 자원과 끝낼 몫을 확인하는 질문이다.",
    "positive": "작업 직전에 분담을 알리면 누락된 마무리 담당을 찾을 수 있다.",
    "risk": "함께 시작했다는 이유로 마지막 정리와 비용 부담도 같다고 여길 수 있다.",
    "twist": "맡을 양을 줄이거나 다른 역할로 바꾸는 합의가 작업 완료를 도울 수 있다.",
    "action": "이번 작업의 준비·실행·정리 담당과 비용 상한을 각각 확인한다.",
    "scene": {
      "text": "가상으로 행사 준비는 함께하되 당일 진행과 철수 담당을 따로 정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 공동 작업이나 자원 공유가 없으면 경쟁·분배 장면을 만들지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:식신",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "이번 구간에 보여줄 산출물의 단위와 재현 방법을 확인하는 질문이다.",
    "positive": "작은 완성본으로 실제 피드백을 받아 다음 수정 범위를 알 수 있다.",
    "risk": "아이디어를 계속 더하면 구간 안에 검토할 결과 자체가 남지 않을 수 있다.",
    "twist": "완성 범위를 줄여도 어떤 과정이 반복 가능한지는 더 선명하게 보일 수 있다.",
    "action": "한 번 보여줄 분량과 다음에 다시 만들 때 남길 순서를 정한다.",
    "scene": {
      "text": "가상으로 실습 전체를 기다리지 않고 작동하는 한 부분을 보여준 뒤 수정한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "산출물·검토 시간이 없는 상황이면 생산량을 늘리는 행동으로 적용하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:상관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "실제 불편한 절차 하나의 수정 가설을 시험하는 질문이다.",
    "positive": "전후 차이를 좁혀 보여주면 지적과 개선 제안을 구별할 수 있다.",
    "risk": "틀린 항목을 발견한 순간 사람 전체를 평가하면 필요한 협의가 어려워질 수 있다.",
    "twist": "기존 방식이 유효한 조건부터 밝히면 바꿀 부분의 근거도 명확해질 수 있다.",
    "action": "바꿀 항목 하나와 유지할 기준, 결과를 확인할 사람을 정한다.",
    "scene": {
      "text": "가상으로 신청 양식의 한 칸을 줄여도 필수 정보가 남는지 시험한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "안전·규정상 승인이 필요한 절차는 가설이 있어도 임의로 바꾸지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:편재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "이번에 검토하는 외부 선택 하나의 실제 투입과 회수를 확인하는 질문이다.",
    "positive": "시간·비용·받을 것을 같은 표에 놓으면 큰 소개와 실행 가능한 제안을 구별할 수 있다.",
    "risk": "흥미로운 설명만 듣고 참여 범위가 정해지기 전에 약속할 수 있다.",
    "twist": "비교에 필요한 자료만 받는 작은 접점도 다음 선택의 정보가 될 수 있다.",
    "action": "제안 하나의 참여 시간·확정 비용·돌아올 자원·철회 조건을 확인한다.",
    "scene": {
      "text": "가상으로 외부 활동 소개를 듣고 참가비와 실제 맡을 역할을 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 제안이 없거나 비용·동의가 확인되지 않으면 거래나 수익을 예상하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:정재",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "이번 기간에 이미 정한 비용과 조정할 여유를 확인하는 질문이다.",
    "positive": "필수 지출과 선택 지출을 나누어 다음 약속을 감당할 범위를 볼 수 있다.",
    "risk": "눈앞의 작은 절약만 보다가 필요한 배움이나 회복까지 줄일 수 있다.",
    "twist": "사용하지 않는 반복 비용을 줄이면 필요한 활동은 유지할 수 있다.",
    "action": "반복 비용 하나의 실제 사용 여부와 다음 납부 시점을 확인한다.",
    "scene": {
      "text": "가상으로 장비를 추가 구매하기 전에 가진 도구로 가능한 과제를 비교한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 소득·고정비를 모르면 저축액이나 안정 수입이 확보됐다고 말하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:편관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "당장 판단을 요구받은 상황의 책임과 지원선을 확인하는 질문이다.",
    "positive": "먼저 결정할 항목을 좁히면 긴급한 일과 나중에 검토할 일을 나눌 수 있다.",
    "risk": "빨리 해결할 수 있다는 이유로 승인권 없이 결과 책임까지 맡을 수 있다.",
    "twist": "즉시 실행보다 판단 권한을 확인하는 짧은 질문이 불필요한 수습을 줄일 수 있다.",
    "action": "급한 항목 하나의 승인자와 도움을 청할 기준을 확인한다.",
    "scene": {
      "text": "가상으로 당일 마감 요청을 받았을 때 바꿀 수 없는 조건부터 담당자에게 묻는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "실제 긴급 요청이 없다면 위기가 왔다는 경험이나 압박을 새로 만들지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:정관",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "이번에 맡은 약속을 끝냈다고 볼 기준을 확인하는 질문이다.",
    "positive": "진행 상황과 완료 기준을 보여주면 막연한 성실함을 실제 수행과 구별할 수 있다.",
    "risk": "좋은 평가를 받고 싶어 원래 역할 밖의 요청까지 마감 없이 받을 수 있다.",
    "twist": "추가 부탁의 완료일을 다시 협의하는 태도가 기존 약속을 지키는 데 도움이 될 수 있다.",
    "action": "맡은 결과와 제출일을 확인하고 추가 요청은 별도 조건으로 기록한다.",
    "scene": {
      "text": "가상으로 모임의 자료 정리를 맡되 발표 준비는 따로 협의한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "공식 역할이나 합의가 없으면 평가·승진·합격의 결과를 전제하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:편인",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "남아 있는 가정 하나를 자료와 제한된 실제 적용으로 비교하는 질문이다.",
    "positive": "서로 다른 설명의 차이를 작게 시험하면 다음 탐색 범위를 좁힐 수 있다.",
    "risk": "한 번의 예외나 흥미로운 사례로 기존 설명 전체를 틀렸다고 여길 수 있다.",
    "twist": "잘 맞지 않은 시험도 필요한 조건을 더 정확히 묻는 자료가 될 수 있다.",
    "action": "다른 설명 두 개가 갈리는 조건 하나를 안전한 과제에 대입한다.",
    "scene": {
      "text": "가상으로 참고 이미지의 공통점과 의뢰인의 실제 요구가 다른 지점을 확인한다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "안전한 적용 범위가 없거나 추가 검증이 필수면 빠른 실행을 강요하지 않는다.",
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
      "afpr:source:practice",
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
    "id": "afpr:month-god:정인",
    "productKey": "annual_fortune",
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "existingScoreContribution": false,
    "runtimeEvidenceIds": [],
    "scope": "monthly_segment",
    "meaning": "받은 설명을 혼자 다시 써볼 수 있는지 확인하는 질문이다.",
    "positive": "직접 설명하거나 적용한 흔적으로 이해와 익숙함을 구별할 수 있다.",
    "risk": "알아들은 느낌만으로 수행까지 끝났다고 판단하면 막힌 순서를 놓칠 수 있다.",
    "twist": "모르는 부분을 좁혀 다시 묻는 것이 추가 자료 수집보다 효과적일 수 있다.",
    "action": "자료를 닫고 한 번 수행한 뒤 막힌 단계만 구체적으로 질문한다.",
    "scene": {
      "text": "가상으로 배운 절차를 혼자 따라 해보고 설명이 빠진 순서를 적는다.",
      "hypothetical": true,
      "isCustomerHistory": false
    },
    "counterexample": "도움이나 학습 내용이 실제 없으면 지원자 출현·합격을 약속하지 않는다.",
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
      "afpr:source:practice",
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
