import type { ResearchMaterial } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_CONCEPTS = [
  {
    "id": "tr:concept:natal",
    "class": "B",
    "sourceRefs": [
      "repo-calendar",
      "repo-periods"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원국은 고정된 출생 기준",
    "meaning": "기간이 바뀌어도 출생 기둥은 바뀌지 않는다. 기간 요소는 별도의 소유자를 갖는 비교 대상이다.",
    "positive": "타고난 반응과 현재 환경을 구별해 원래 가진 자원을 재사용할 질문을 만든다.",
    "risk": "새 월간지를 타고난 월주에 덮어쓰면 개인화 근거와 기간 근거가 함께 훼손된다.",
    "reversal": "불편한 기간이 지나도 원국이 정화되거나 악화됐다고 설명하지 않는다.",
    "distinction": "사주 월주와 현재 월운은 같은 월이라는 글자가 있어도 서로 다른 시점이다.",
    "requires": [
      "실제 계산 버전",
      "기둥 소유자",
      "start/end와 certainty"
    ],
    "excludes": [
      "대표 출생시간 강제 입력",
      "추정 사건을 사실로 서술"
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
      "meaning": "B",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:concept:dayun",
    "class": "B",
    "sourceRefs": [
      "repo-calendar",
      "repo-periods"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운은 장기 배경",
    "meaning": "기존 sect2 계산에서 선택된 약 10년 주기 간지와 정확·범위 전환을 함께 읽는다. 명목 시작연도는 실제 시작 시각을 대신하지 않는다.",
    "positive": "일간 대비 운간의 역할을 여러 해의 실천과 연결해 장기 자원 배분을 검토한다.",
    "risk": "대운 십성 하나로 10년간의 직장·혼인·소득 사건을 확정하면 세운 차이와 생활 조건이 사라진다.",
    "reversal": "같은 대운 안에서도 다른 세운과 월운으로 질문은 달라질 수 있다.",
    "distinction": "14년 상품 창과 하나의 10년 대운은 길이도 시작점도 다르다.",
    "requires": [
      "실제 계산 버전",
      "기둥 소유자",
      "start/end와 certainty"
    ],
    "excludes": [
      "대표 출생시간 강제 입력",
      "추정 사건을 사실로 서술"
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
      "meaning": "B",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:concept:saeun",
    "class": "B",
    "sourceRefs": [
      "repo-calendar",
      "repo-periods"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "세운은 연도 관점",
    "meaning": "선택 연도의 간지를 독립 보존하되 실제 구간의 연주는 입춘 경계를 반영한다. 선택 연주 표와 effectiveAnnualPillar의 용도를 구별한다.",
    "positive": "장기 목표에서 올해 점검할 구체적인 기능을 분리할 수 있다.",
    "risk": "양력 1월 1일부터 선택 연주가 적용된다고 가정하면 월운의 기간간 관계를 잘못 연결한다.",
    "reversal": "올해 새 십성이 나타나도 원래 대운 역할이 지워지는 것은 아니다.",
    "distinction": "civil selectedYear는 상품 선택 단위이고 실제 연주 경계는 calendar context다.",
    "requires": [
      "실제 계산 버전",
      "기둥 소유자",
      "start/end와 certainty"
    ],
    "excludes": [
      "대표 출생시간 강제 입력",
      "추정 사건을 사실로 서술"
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
      "meaning": "B",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:concept:wolun",
    "class": "B",
    "sourceRefs": [
      "repo-calendar",
      "repo-periods"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월운은 절입 구간",
    "meaning": "양력 월은 표시 용기다. 절입과 교운 경계로 나뉜 각 구간마다 월주·실효 연주·대운 후보가 있다.",
    "positive": "작은 실행 단위에서 앞 구간과 달라진 요구를 확인한다.",
    "risk": "focus segment 하나를 한 달 전체로 확대하면 절입 전 조건이 누락된다.",
    "reversal": "같은 달의 두 구간이 다른 질문을 줄 수 있으며 어느 하나가 월 전체의 운세 우열을 뜻하지 않는다.",
    "distinction": "월지 본기 십성과 전체 지장간 십성은 같은 자료가 아니다.",
    "requires": [
      "실제 계산 버전",
      "기둥 소유자",
      "start/end와 certainty"
    ],
    "excludes": [
      "대표 출생시간 강제 입력",
      "추정 사건을 사실로 서술"
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
      "meaning": "B",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:concept:boundary",
    "class": "B",
    "sourceRefs": [
      "repo-calendar",
      "repo-periods"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "경계는 소유권의 변경점",
    "meaning": "확정 전환은 시각에서 바로 새 운으로 넘어가며 범위 전환은 earliest 이상 latest 미만에서 후보가 열린다.",
    "positive": "이전·후보·이후를 나눠 근거가 언제 유효한지 설명한다.",
    "risk": "두 후보를 동시에 확정된 하나의 배경으로 합치거나 임의 중간값을 택하면 안 된다.",
    "reversal": "시간이 불확실해도 양끝 밖에서 동일한 조건이 안정적이면 그 부분만 설명할 수 있다.",
    "distinction": "확정 경계와 출생시간 불확실 구간은 서로 다른 상태다.",
    "requires": [
      "실제 계산 버전",
      "기둥 소유자",
      "start/end와 certainty"
    ],
    "excludes": [
      "대표 출생시간 강제 입력",
      "추정 사건을 사실로 서술"
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
      "meaning": "B",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  }
] as const satisfies readonly ResearchMaterial[];
