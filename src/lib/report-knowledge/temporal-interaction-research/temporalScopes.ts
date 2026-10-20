import type { ScopeMaterial } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_SCOPES = [
  {
    "id": "tr:scope:natal_dayun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "태어난 구조에서 어떤 기능이 장기 환경과 맞물리는가",
    "meaning": "대운의 실제 활성 구간과 원국의 출생 기준을 교차",
    "positive": "원국의 반복 자원을 새로운 장기 역할에 배치한다.",
    "risk": "원국 십성을 대운의 십성처럼 이름 붙이지 않는다.",
    "reversal": "필요한 기능을 묶는 합이라면 합의 존재가 오히려 제약 질문이 된다.",
    "distinction": "연간 변동보다 장기적으로 유지되는 역할의 조건을 다룬다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "natal_dayun"
    ],
    "scope": "natal_dayun",
    "owners": [
      "natal",
      "dayun"
    ],
    "window": "대운의 실제 활성 구간과 원국의 출생 기준을 교차",
    "support": [
      {
        "producer": "majorFortuneEvidence:branchInteractions",
        "supported": [
          "육합",
          "충",
          "삼합(실제 3자만)",
          "형(쌍)",
          "해",
          "반합",
          "파"
        ],
        "unsupported": [
          "천간합",
          "원진",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:scope:natal_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "타고난 반응 가운데 올해 자극받는 자리는 어디인가",
    "meaning": "세운의 실제 연주 적용 구간과 확인된 원국 자리",
    "positive": "원국의 여러 자리 중 실제 접점만 골라 올해 선택을 좁힌다.",
    "risk": "연지·월지·일지·시지를 사건 당사자로 단정하지 않는다.",
    "reversal": "긴장 관계가 익숙한 방식의 수정 기회를 제시할 수 있다.",
    "distinction": "원국 자체 분석과 달리 올해 요소가 빠지면 성립하지 않는 접점을 다룬다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "natal_saeun"
    ],
    "scope": "natal_saeun",
    "owners": [
      "natal",
      "saeun"
    ],
    "window": "세운의 실제 연주 적용 구간과 확인된 원국 자리",
    "support": [
      {
        "producer": "annualFortuneEvidence:natalAnnualRelations + annualEvidence:annualStemRelations",
        "supported": [
          "육합",
          "충",
          "삼합(실제 3자만)",
          "형(쌍)",
          "해",
          "반합",
          "파",
          "천간합(V4 selectedYear 투영)"
        ],
        "unsupported": [
          "원진",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:scope:natal_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "같은 출생 자원과 이 짧은 구간의 요구는 어떻게 만나는가",
    "meaning": "달력월 내부 각 절입·교운 분할 [start,end)",
    "positive": "구체적인 한 가지 실행을 짧게 관찰할 비교 기간을 잡는다.",
    "risk": "절입 뒤의 관계를 절입 전이나 다음 달에 그대로 연장하지 않는다.",
    "reversal": "관계 없음도 근거이며 일반 성향을 관계 효과로 바꾸지 않는다.",
    "distinction": "세운보다 관찰 단위가 짧고 월지 본기·확장 근거의 출처가 더 세밀하다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "natal_wolun"
    ],
    "scope": "natal_wolun",
    "owners": [
      "natal",
      "wolun"
    ],
    "window": "달력월 내부 각 절입·교운 분할 [start,end)",
    "support": [
      {
        "producer": "annualMonthRelationFacts + annualMonthExtendedEvidence",
        "supported": [
          "육합",
          "충",
          "삼합(실제 3자만)",
          "형(쌍)",
          "해",
          "반합",
          "파",
          "원진(확장 경로)"
        ],
        "unsupported": [
          "천간합",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:scope:dayun_saeun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "장기 역할을 유지하면서 올해 어떤 기능을 따로 처리할 것인가",
    "meaning": "실효 연주 구간 ∩ 실제 대운 활성/후보 구간",
    "positive": "같은 십성이면 역할의 일관성, 다르면 과제 분담을 검토한다.",
    "risk": "대운 기준 flowGod를 일간 기준 annualGod와 혼동하지 않는다.",
    "reversal": "서로 다른 역할은 모순만이 아니라 역할을 나눌 자원이 될 수 있다.",
    "distinction": "원국 비교와 달리 두 기간 모두 끝점이 있고 기준 천간도 명시해야 한다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "dayun_saeun"
    ],
    "scope": "dayun_saeun",
    "owners": [
      "dayun",
      "saeun"
    ],
    "window": "실효 연주 구간 ∩ 실제 대운 활성/후보 구간",
    "support": [
      {
        "producer": "annualEvidence:crossPeriods + majorFortuneDecadeReading:cycleRelations",
        "supported": [
          "육합",
          "충",
          "형(쌍)",
          "해",
          "반합",
          "파"
        ],
        "unsupported": [
          "천간합",
          "삼합",
          "원진",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:scope:dayun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "장기적으로 유지할 조건과 이번 구간에 바꿀 운영은 무엇인가",
    "meaning": "월운 구간 ∩ 대운 확정/범위 경계",
    "positive": "작은 조정을 통해 장기 목표를 성급히 포기하지 않게 한다.",
    "risk": "불확실 교운에서 두 대운 관계를 모두 confirmed로 제시하지 않는다.",
    "reversal": "월운의 충이 장기 계획 전체의 실패를 뜻하지 않고 실행 순서의 검토가 될 수 있다.",
    "distinction": "대운·세운보다 짧은 관찰 범위이며 첫 대운 이전에는 이 비교가 없다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "dayun_wolun"
    ],
    "scope": "dayun_wolun",
    "owners": [
      "dayun",
      "wolun"
    ],
    "window": "월운 구간 ∩ 대운 확정/범위 경계",
    "support": [
      {
        "producer": "annualMonthJie:month_dayun_branch",
        "supported": [
          "육합",
          "충",
          "형(쌍)",
          "해",
          "반합",
          "파"
        ],
        "unsupported": [
          "천간합",
          "삼합",
          "원진",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  },
  {
    "id": "tr:scope:saeun_wolun",
    "class": "C",
    "sourceRefs": [
      "repo-periods",
      "editorial"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "올해의 방향을 이번 구간의 실행으로 옮길 때 무엇을 확인할 것인가",
    "meaning": "월운 구간 ∩ 입춘 전후 실효 연주",
    "positive": "연간 선택을 월별 작은 실험으로 구체화한다.",
    "risk": "1월과 입춘 전 월운에 선택 연주를 고정해서 붙이지 않는다.",
    "reversal": "월간 요구가 연간 목표와 달라도 속도나 방법을 바꾸는 쪽으로 읽을 수 있다.",
    "distinction": "두 요소 모두 운의 소유자이고 natal 자리 ordinal을 부여하지 않는다.",
    "requires": [
      "소유자별 실제 간지",
      "실제 기간의 교집합",
      "근거 ID와 확정 여부"
    ],
    "excludes": [
      "누락된 원국 시주 대입",
      "연도만 같은 관계의 합산"
    ],
    "scopeRefs": [
      "saeun_wolun"
    ],
    "scope": "saeun_wolun",
    "owners": [
      "saeun",
      "wolun"
    ],
    "window": "월운 구간 ∩ 입춘 전후 실효 연주",
    "support": [
      {
        "producer": "annualMonthJie:month_annual_branch",
        "supported": [
          "육합",
          "충",
          "형(쌍)",
          "해",
          "반합",
          "파"
        ],
        "unsupported": [
          "천간합",
          "삼합",
          "원진",
          "전체 삼형"
        ],
        "certainty": "확정 원국만 사용; 교운 후보 관계는 conditional. major 연도 요약의 단일 cycle은 전환 전후 상세 ledger 아님."
      }
    ],
    "fieldClasses": {
      "meaning": "C",
      "positive": "C",
      "risk": "C",
      "reversal": "C"
    }
  }
] as const satisfies readonly ScopeMaterial[];
