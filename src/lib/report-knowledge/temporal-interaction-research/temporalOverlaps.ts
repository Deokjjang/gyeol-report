import type { ResearchMaterial } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_OVERLAPS = [
  {
    "id": "tr:overlap:same-god",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운·세운 같은 십성",
    "meaning": "동일 natal 일간 기준의 두 십성이 같을 때 역할 주제가 겹친다.",
    "positive": "장기 연습을 올해 구체적인 과제로 확인한다.",
    "risk": "동일 명칭을 힘·확률 두 배로 합산하지 않는다.",
    "reversal": "반복이 도움이 아니라 과용일 수 있어 실제 수행 비용을 살핀다.",
    "distinction": "같은 주제의 장기 계획과 올해 할 일 두 칸이다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:different-god",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운·세운 다른 십성",
    "meaning": "동일 일간 기준에서 다른 두 기능을 비교한다.",
    "positive": "장기 자원과 연간 과제를 분담한다.",
    "risk": "다른 역할을 서로 모순된 예언으로 만들지 않는다.",
    "reversal": "새 역할이 기존 장점을 실행할 통로가 될 수 있다.",
    "distinction": "큰 여행 목적과 올해 이동 수단처럼 질문이 다르다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:annual-clash",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원국·세운 충",
    "meaning": "연지와 실제 natal 지지의 충 참가자·자리를 확인한다.",
    "positive": "기존 배치의 수정 가능성을 검토한다.",
    "risk": "충이면 이사·퇴사·이별한다는 사건을 붙이지 않는다.",
    "reversal": "바꾸지 않을 조건을 확인하는 것이 먼저일 수 있다.",
    "distinction": "고정 배치에 새 요구가 닿는 접점이지 파괴의 예고가 아니다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:major-harmony",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "원국·대운 합",
    "meaning": "실제 활성 운지와 natal 구성의 결합을 확인한다.",
    "positive": "장기 활용할 연결 자원을 검토한다.",
    "risk": "합만으로 안정·성공·합화를 확정하지 않는다.",
    "reversal": "과도한 묶임이면 필요한 분리를 검토한다.",
    "distinction": "오래 쓸 연결 통로지만 무엇을 흘릴지는 실제 배합에 달린다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:period-mixed",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운·세운 복수 관계",
    "meaning": "같은 두 기간의 충·형 등 여러 표 일치가 있는지 확인한다.",
    "positive": "배치 조정 질문과 반복 부담 질문을 구별한다.",
    "risk": "관계 개수로 길흉 점수를 만들지 않는다.",
    "reversal": "서로 다른 질문을 같은 장면에서 확인할 수 있어도 사건은 하나일 수 있다.",
    "distinction": "한 문제를 서로 다른 렌즈로 보는 것이 문제 수 증가를 뜻하지 않는다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:jie-inside",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월 안의 절입",
    "meaning": "실제 절입 전후 월주·십성·관계가 달라지는지 확인한다.",
    "positive": "작은 실행을 비교할 시간 단위를 나눈다.",
    "risk": "절입 후 설명을 월초에 적용하지 않는다.",
    "reversal": "전후 간지가 달라도 관계가 같으면 차이를 부풀리지 않는다.",
    "distinction": "달력 한 장 안에 두 개의 시간표가 들어갈 수 있다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:dayun-inside",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월 안의 교운",
    "meaning": "월주가 같아도 활성 운이 바뀌면 대운 소유자의 비교 조건이 달라진다.",
    "positive": "이어갈 역할과 새 역할을 구간별로 나눈다.",
    "risk": "대운 전환과 명리월 전환을 같은 이유로 설명하지 않는다.",
    "reversal": "새 운에서 관계가 사라지면 기존 긴장 설명을 중단한다.",
    "distinction": "같은 실행 공간에서 배경 시간표가 바뀌는 경우다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:close-boundaries",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "절입·교운 근접",
    "meaning": "두 경계가 가까워도 각 실제 시각을 순서대로 보존한다.",
    "positive": "중간 짧은 구간에 어떤 조건이 유효한지 확인한다.",
    "risk": "편의상 경계를 합치거나 가까움을 사건 강도로 번역하지 않는다.",
    "reversal": "짧은 구간의 관계가 연간 전체를 대표하지 않을 수 있다.",
    "distinction": "가까운 두 환승역은 한 역이 아니다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:multi-owners",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "여러 소유자의 관계",
    "meaning": "원국·대운·세운·월운 관계의 참가자와 교집합을 각각 구별한다.",
    "positive": "영역을 섞지 않고 겹치는 실제 조건만 확인한다.",
    "risk": "다른 source를 하나의 natal 위치나 점수로 합치지 않는다.",
    "reversal": "같은 지지라도 소유자가 달라 질문이 달라질 수 있다.",
    "distinction": "같은 글자가 적혀도 다른 시간표의 자리다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:uncertain-part",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "일부만 불확실",
    "meaning": "월주·실효 연주는 확정이고 활성 운만 후보일 수 있다.",
    "positive": "확정 정보는 유지하고 불확실 대운 설명만 유예한다.",
    "risk": "일부 불확실 때문에 모든 근거를 버리거나 모두 확정하지 않는다.",
    "reversal": "범위 밖에서 다시 확정되는 조건이 남는다.",
    "distinction": "안개 낀 길만 표시하고 지도 전체를 지우지 않는다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:none",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "일치 없음",
    "meaning": "해당 scope producer의 관계 배열이 실제로 비었는지 확인한다.",
    "positive": "간지·십성·오행의 다른 확인 가능한 정보로 제한한다.",
    "risk": "관계가 있어야 재미있다는 이유로 허위 연결을 넣지 않는다.",
    "reversal": "관계 없음은 실패가 아니라 설명 범위를 정하는 정보다.",
    "distinction": "빈 접점 표는 아무 일도 없을 해라는 뜻이 아니다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
    "id": "tr:overlap:time-perspective",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "회고·현재·미래",
    "meaning": "고정 평가 시각과 유효 구간을 비교한다.",
    "positive": "과거는 확인 질문, 현재는 선택, 미래는 준비 조건으로 구별한다.",
    "risk": "과거 해의 가능한 장면을 실제 경험처럼 쓰지 않는다.",
    "reversal": "과거 해석과 독자 경험이 다르면 독자 경험을 수정하지 않는다.",
    "distinction": "지난 지도는 실제 여행 일지가 아니다.",
    "requires": [
      "실제 동일 구간",
      "참가자별 source와 certainty"
    ],
    "excludes": [
      "관계 수로 영향 가산",
      "확인되지 않은 사건 생성"
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
