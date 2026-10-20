import type { ResearchBoundary } from "./temporalResearchTypes";

/** Offline research only. No runtime registration or customer approval. */
export const TEMPORAL_BOUNDARIES = [
  {
    "id": "tr:boundary:exact-transition",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "확정 교운",
    "rule": "t < startSolarKst는 이전 운, t >= startSolarKst는 새 운이다. 고정 지연이나 1월1일 경계를 넣지 않는다.",
    "required": "startSolarKst와 양쪽 실제 cycle",
    "prohibited": "연간 요약 cycle을 전환 전까지 확장",
    "nextEvidence": "경계 -1초/정각/+1초의 실제 선택 비교"
  },
  {
    "id": "tr:boundary:ranged-transition",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "범위 교운",
    "rule": "t < earliest는 이전 운, earliest <= t < latest는 후보 구간, t >= latest는 새 운이다.",
    "required": "각 cycle의 startSolarRange와 이전 cycle 존재 여부",
    "prohibited": "범위 중앙값·대표시각·두 운 동시 확정",
    "nextEvidence": "양끝과 내부의 activeDayunContext 비교"
  },
  {
    "id": "tr:boundary:stable-not-exact",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "안정성과 정밀도",
    "rule": "stable=true는 연도·간지 순서가 안정적이라는 뜻이며 정확 시각이 확인됐다는 뜻이 아니다.",
    "required": "precision·startSolarKst null 여부",
    "prohibited": "안정적 계산을 초 단위 확정으로 승격",
    "nextEvidence": "exact/approximate/unknown 각각의 결과 확인"
  },
  {
    "id": "tr:boundary:unknown-refusal",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "미상 입력 거절",
    "rule": "가능한 출생 구간에서 연월·방향·시작연도·간지가 안정적이지 않으면 기존 DAYUN_UNCERTAIN을 유지한다.",
    "required": "기존 계산 성공/실패 상태",
    "prohibited": "임의 정오·성별·방향을 대입해 성공 처리",
    "nextEvidence": "지원 가능한 미상 사례와 거절 사례를 둘 다 확인"
  },
  {
    "id": "tr:boundary:before-first",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "첫 대운 이전",
    "rule": "활성 운이 없으면 before_first_cycle과 빈 cycle 목록을 보존한다.",
    "required": "첫 earliest와 현재 시각",
    "prohibited": "첫 운이 이미 시작됐다고 출력",
    "nextEvidence": "첫 경계 이전과 첫 후보 구간 구분"
  },
  {
    "id": "tr:boundary:nominal-year",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "명목 시작연도",
    "rule": "startYear/endYear는 연도 요약 선택에 쓰지만 실제 KST 전환 시각과는 다르다.",
    "required": "nominal cycle과 activeCycleAtEvaluation",
    "prohibited": "1월1일에 교운한다고 주장",
    "nextEvidence": "연도별 요약과 실제 segment를 별도로 비교"
  },
  {
    "id": "tr:boundary:half-open",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "반열린 구간",
    "rule": "모든 ledger는 [startKst,endKstExclusive)로 비교한다. 경계 정각은 다음 구간이다.",
    "required": "명시 +09:00 또는 절대시각",
    "prohibited": "양끝 중복 소속·지역 시간대별 결과 차이",
    "nextEvidence": "접한 구간 end==다음 start와 t 정각 검사"
  },
  {
    "id": "tr:boundary:jie-not-midqi",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "절입과 중기",
    "rule": "현재 경계는 24절기 중 실제 canonical month pillar가 바뀌는 절입12개다.",
    "required": "getAnnualJieBoundaries의 월주 before/after",
    "prohibited": "24절기 모두 월주 경계로 사용",
    "nextEvidence": "동지·하지가 월주 변경이라고 가정하지 않기"
  },
  {
    "id": "tr:boundary:civil-month",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "달력월 분할",
    "rule": "달력월 12개 안에 절입 경계와 대운 earliest/latest가 추가로 들어갈 수 있다.",
    "required": "월 용기와 segments 전체",
    "prohibited": "항상 월마다 단일 간지·두 구간이라고 고정",
    "nextEvidence": "같은 달의 3개 이상 segment도 보존"
  },
  {
    "id": "tr:boundary:lichun",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "입춘 전후",
    "rule": "selectedYear와 effectiveAnnualPillar를 분리해 실제 연주를 사용한다.",
    "required": "segment 시작의 canonical year pillar",
    "prohibited": "1월1일에 연주가 바뀐다고 확정",
    "nextEvidence": "입춘 직전·정각에서 월주와 연주 함께 확인"
  },
  {
    "id": "tr:boundary:month-main-stem",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "월지 본기 기준",
    "rule": "branchTenGod는 월지의 본기 한 천간과 natal dayMaster 비교다.",
    "required": "본기 표와 기준 일간",
    "prohibited": "전체 장간·투간·강약 산출로 확대",
    "nextEvidence": "12월지의 본기와 기존 십성 함수 비교"
  },
  {
    "id": "tr:boundary:conditional-relations",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "조건부 관계",
    "rule": "불확실 교운 후보와의 month_dayun_branch는 conditional이고 원국·실효 연주 관계는 별도다.",
    "required": "fact.source·counterpart·certainty",
    "prohibited": "conditional을 confirmed로 합침",
    "nextEvidence": "후보별 ID와 유효 기간 동시 확인"
  },
  {
    "id": "tr:boundary:legacy-mixed",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "레거시 혼합 provenance",
    "rule": "majorFortuneEvidence 보조 함수의 [currentCycle.branch,...natalBranches] ordinal은 실제 natal 기둥 위치가 아니다.",
    "required": "현행 함수별 호출 경로·배열 소유자",
    "prohibited": "최신 분리된 cycleRelations와 같은 provenance라고 취급",
    "nextEvidence": "별도 고객 영향 추적 필요; 이번에 수정 안 함"
  },
  {
    "id": "tr:boundary:major-row-granularity",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "대운 연도 row의 한계",
    "rule": "majorEvidence는 14년 horizon 경계를 보존하지만 annual row는 해당 명목 cycle의 연간 reading 하나를 선택한다.",
    "required": "horizon.before/after와 annual.cycleRelations 출처",
    "prohibited": "전환 이후 관계를 해당 해 전체에 적용",
    "nextEvidence": "새 연결 전 전환 전후 관계 ledger의 별도 설계 승인 필요"
  },
  {
    "id": "tr:boundary:annual-stem-time",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "선택 연주 천간합의 한계",
    "rule": "annualStemRelations는 실제 표 투영이지만 selectedYear annualGanji를 사용한다. effectiveAnnualPillar 구간과 자동 동일하지 않다.",
    "required": "투영의 natal position·annual stem 및 구간별 연주",
    "prohibited": "선택 연주 투영을 입춘 전에도 그대로 적용",
    "nextEvidence": "구간 연주와 일치 여부 별도 검토"
  },
  {
    "id": "tr:boundary:duplicate-owner",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "동일값과 소유자",
    "rule": "같은 申이라도 natal day와 dayun branch는 다른 참가자다. 같은 쌍의 재투영과 다른 owner의 실제 접점을 구분한다.",
    "required": "owner·position·period·symbols·source rule",
    "prohibited": "지지 문자열만으로 합치기 또는 출처 수만큼 위험 합산",
    "nextEvidence": "의미 단위 key와 관찰 provenance를 분리"
  },
  {
    "id": "tr:boundary:time-position",
    "class": "B",
    "sourceRefs": [
      "repo-periods",
      "repo-calendar"
    ],
    "connectedToRuntime": false,
    "approvedForCustomer": false,
    "runtimeEvidenceIds": [],
    "subject": "과거·현재·미래",
    "rule": "구간 t<start 미래, start<=t<end 현재, t>=end 과거다. 연도 요약은 별도의 civil year label이다.",
    "required": "고정 평가 시각 2026-10-12T12:00:00+09:00",
    "prohibited": "과거 구간이면 경험한 사건으로 서술",
    "nextEvidence": "현재 해의 지난 월·현재 구간·다가올 월을 구분"
  }
] as const satisfies readonly ResearchBoundary[];
