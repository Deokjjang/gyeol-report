import type { ResearchMaterial } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_PERIOD_DEPTH = [
  {
    "id": "tr:depth:dayun-stem",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운 천간",
    "meaning": "일간 대비 운간 십성은 장기 역할의 비교 기준이다.",
    "positive": "반복해 쓸 기능을 정리한다.",
    "risk": "운간을 실제 직업명으로 대체하지 않는다.",
    "reversal": "다른 역할을 맡아도 운간의 원국 기준은 유지된다.",
    "distinction": "운지 본기 십성과 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:dayun-branch",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운 지지",
    "meaning": "운지는 실제 간지의 지지이며 원국과의 쌍·3자 구조를 별도로 확인한다.",
    "positive": "운간의 역할과 실제 접점의 조건을 함께 살핀다.",
    "risk": "운지 자체와 관계 검출을 같은 근거로 중복 가산하지 않는다.",
    "reversal": "같은 운지라도 natal 구성이 다르면 접점이 다르다.",
    "distinction": "운간과 운지는 서로 다른 구성 요소다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:dayun-strength",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운과 원국 강약",
    "meaning": "원국의 개수 분포는 강약·용신 계산을 대신하지 않는다.",
    "positive": "실제 배합 근거가 있을 때만 보완할 기능을 검토한다.",
    "risk": "missing/heavy 표지를 희신·기신으로 읽지 않는다.",
    "reversal": "부족 요소도 필요하지 않을 수 있고 많은 요소도 쓸 기능이 있을 수 있다.",
    "distinction": "존재 빈도와 계절·통근 기반의 힘 판단은 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:dayun-next",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "현재와 다음 대운",
    "meaning": "각 운간의 십성을 원국 일간 기준으로 독립 비교한 뒤 바뀌는 역할을 찾는다.",
    "positive": "이어갈 기반과 새로 준비할 기능을 나눈다.",
    "risk": "원국 정재나 편관 설명을 다음 대운 편재나 상관의 설명으로 바꾸지 않는다.",
    "reversal": "다음 운의 다른 기능도 기존 강점을 없애기보다 쓰는 조건을 바꿀 수 있다.",
    "distinction": "전환 시각 이전과 이후를 한 장기 배경으로 합치지 않는다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:dayun-phase",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운 내부와 세운",
    "meaning": "early/middle/late 편집 단위와 실제 해별 간지는 별개다.",
    "positive": "같은 배경에서 매년 다르게 나타나는 질문을 살핀다.",
    "risk": "3·4·3년 편집 단위를 새 운 계산으로 설명하지 않는다.",
    "reversal": "유사한 십성이 다시 나와도 관계 참가자는 다를 수 있다.",
    "distinction": "원고 배치와 명리 경계는 구별된다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:dayun-first",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "첫 대운 이전",
    "meaning": "첫 시작 전에는 운간·운지의 활성 근거가 없다.",
    "positive": "확인된 원국·연주·월주만으로 범위를 제한한다.",
    "risk": "아직 시작하지 않은 첫 운을 현재 대운으로 쓰지 않는다.",
    "reversal": "첫 운 후보 구간은 이전 cycle 대신 beforeFirst 상태를 포함할 수 있다.",
    "distinction": "이전 대운이 없다는 것과 계산 실패는 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-stem-branch",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "세운 간과 지지",
    "meaning": "일간 대비 연간 십성과 연지 본기 십성을 분리한다.",
    "positive": "드러난 역할과 운영 기반을 두 질문으로 읽는다.",
    "risk": "연지 본기를 전체 지장간의 유일한 의미라고 하지 않는다.",
    "reversal": "운간 역할과 연지 조건이 다르면 실행과 유지의 비용을 나눌 수 있다.",
    "distinction": "연간 십성만 바꾸는 설명보다 실제 두 요소가 제공하는 정보가 늘어난다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-flow-reference",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "기간 기준 십성",
    "meaning": "flowGod는 대운 천간을 기준으로 실효 연간을 비교한 기존 값이다.",
    "positive": "일간 기준과 기간 기준 두 비교를 구별해 장기-연간 기능의 관계를 묻는다.",
    "risk": "flowGod가 natal annualGod를 대체하지 않는다.",
    "reversal": "기준을 바꾸면 십성이 달라져도 오류가 아니라 질문이 다른 것이다.",
    "distinction": "겉 같은 십성 문자열보다 기준 stem·target stem의 방향이 먼저다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-year-boundary",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "입춘의 연주",
    "meaning": "월운 구간 effectiveAnnualPillar는 입춘 전후 다른 연주를 보존한다.",
    "positive": "연간 상품 선택과 실제 구간 관계를 일치시킬 수 있다.",
    "risk": "1월의 월운 관계를 선택 연간과 임의로 비교하지 않는다.",
    "reversal": "달력 해가 바뀌어도 입춘 전 명리 연주는 이전일 수 있다.",
    "distinction": "선택 연도 정책과 명리 연주의 계산 경계는 별개다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-native-position",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "연운과 원국 자리",
    "meaning": "같은 지지가 여러 출생 자리에 있으면 affectedPillars를 보존한다.",
    "positive": "접점의 위치를 근거 범위로 한정한다.",
    "risk": "그 자리를 부모·배우자 실제 사건으로 확정하지 않는다.",
    "reversal": "같은 쌍은 여러 자리에서 확인될 수 있어도 사건 횟수는 늘지 않는다.",
    "distinction": "중복 값의 자리 정보와 독립 관계 종류는 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-no-relation",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "관계 없는 연도",
    "meaning": "빈 관계 배열은 해당 검출기에서 일치가 없다는 뜻이다.",
    "positive": "간지·십성·오행의 확인된 차이만 읽는다.",
    "risk": "밋밋함을 피하려고 충·합이나 사건을 만들어내지 않는다.",
    "reversal": "관계가 없어도 십성 관점의 유효한 생활 질문은 남는다.",
    "distinction": "no match와 전체 운의 영향 없음은 같은 주장이 아니다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:saeun-rank",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "연도 강조의 의미",
    "meaning": "현재/전환/관계 등 기존 planner의 강조는 편집상 집중도다.",
    "positive": "읽어볼 근거가 많은 구간을 안내한다.",
    "risk": "HIGH 등급을 운의 좋음·실제 사건 가능성 점수로 쓰지 않는다.",
    "reversal": "강조되지 않은 해도 고유 간지와 전체 본문이 존재한다.",
    "distinction": "중요도와 길흉·확률은 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-container",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "달력월 용기",
    "meaning": "한 양력월 내부에 실제 절입 경계가 존재한다.",
    "positive": "월초와 절입 뒤를 나눠 바뀐 실행 질문을 만든다.",
    "risk": "달력월 제목을 명리월 전체 동일성으로 읽지 않는다.",
    "reversal": "월이 달라져도 절입 전 월주는 이전 달 후반과 같을 수 있다.",
    "distinction": "12개 월 페이지와 12개 단일 월간지 배열은 다르다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-main-hidden",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월지 본기",
    "meaning": "월지 십성은 현재 producer의 본기 한 천간을 일간과 비교한 값이다.",
    "positive": "월간의 역할과 본기의 유지 조건을 나눈다.",
    "risk": "여기서 전체 장간 비율·투출·통근을 계산했다고 하지 않는다.",
    "reversal": "같은 월간 십성도 월지 본기가 다르면 질문이 달라질 수 있다.",
    "distinction": "본기는 지지 자체 또는 숨은 모든 성분과 동일하지 않다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-focus",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월 focus 구간",
    "meaning": "현재 시각 포함 구간 또는 절입 시작 구간을 대표로 골라도 전체 ledger는 남는다.",
    "positive": "핵심 설명을 어디서 가져왔는지 추적한다.",
    "risk": "대표 구간을 월초부터 말일까지 확장하지 않는다.",
    "reversal": "현재 시각이 바뀌면 focus가 달라질 수 있어도 원래 구간 근거는 그대로다.",
    "distinction": "편집 선택과 시간 근거의 존재를 구분한다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-annual",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월과 실효 연주",
    "meaning": "월운-세운 관계는 월 branch와 구간 effectiveAnnual branch의 쌍이다.",
    "positive": "연간 방향을 이번 구간의 조건과 비교한다.",
    "risk": "natal 쌍의 위치 설명을 기간간 관계에 붙이지 않는다.",
    "reversal": "입춘에서 월주와 연주가 동시에 바뀌면 두 변경의 역할을 따로 본다.",
    "distinction": "관계 source month_annual_branch를 보존한다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-dayun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월과 대운 후보",
    "meaning": "교운의 earliest/latest가 월 내부이면 구간을 추가 분할한다.",
    "positive": "실제 확정되는 배경 안에서만 행동 질문을 검토한다.",
    "risk": "두 후보와의 관계를 둘 다 confirmed라고 쓰지 않는다.",
    "reversal": "불확실 구간 밖의 설명은 확정 근거로 남길 수 있다.",
    "distinction": "월지 변화와 대운 변화는 다른 경계 원인이다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:depth:wolun-extended",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월운 확장 근거",
    "meaning": "월 target과 실제 natal anchor를 갖는 확장 관찰만 기간 근거로 다룬다.",
    "positive": "원진·십이운성 등의 관찰 출처를 분리한다.",
    "risk": "보류 mangsin·mungok·bokseong·cheoneui·banghap을 승인하지 않는다.",
    "reversal": "같은 feature가 반복되면 관찰 목록을 합쳐도 독립 효과를 더하지 않는다.",
    "distinction": "원국 신살을 새 월운 사실로 재포장하지 않는다.",
    "requires": [
      "관련 producer의 실제 필드",
      "추가 배합·생활 맥락"
    ],
    "excludes": [
      "예언·추정된 과거 경험",
      "다른 기간으로 근거 복사"
    ],
    "scopeRefs": [
      "natal_dayun",
      "natal_saeun",
      "natal_wolun",
      "dayun_saeun",
      "dayun_wolun",
      "saeun_wolun"
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  }
] as const satisfies readonly ResearchMaterial[];
