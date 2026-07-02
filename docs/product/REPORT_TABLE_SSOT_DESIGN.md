# Report Table SSOT Design

## 1. Current Finding

REPORT-TABLE-DATA-AUDIT-01에서 확인한 현재 상태는 다음과 같다.

- 기존 `ReportOutput`은 사용자에게 보여 줄 문장 섹션 중심의 결과물이다. 원국 표에 필요한 raw 사주 데이터의 SSOT로 쓰기에는 부족하다.
- 사주 계산 엔진에는 연주, 월주, 일주, 시주, 천간, 지지, 십성, 오행, 지장간, 신살/귀인, 일부 합충 데이터가 이미 있다.
- 유료 종합 리포트 V2에는 `profileTable`과 `fourPillarGrid`가 있으며, 현재 화면에도 "만세력 및 명리학 표" 렌더링 구조가 있다.
- MBTI 16유형 source DB는 `docs/product/mbti/source/*.json`에 있으며, 표에 필요한 필드를 이미 포함한다.
- 세운은 연도 간지, 월별 간지 근사, 세운 십성, 오행 효과, 원국 지지와의 작용 계산 구조가 있다.
- 대운은 해석 및 표시 구조는 있으나 대운표 자체를 산출하는 계산 엔진은 없다. 현재는 `majorFortuneCycles` 입력을 받아 해석하는 구조다.

## 2. Table Types

- 공통 만세력표
- MBTI 성향표
- 대운표
- 세운표

## 3. SSOT Decision

### 공통 만세력표

SSOT는 기존 `ReportOutput`이 아니라 종합 리포트 V2의 deterministic `profileTable.fourPillarGrid`로 둔다.

기준 방향:

- `ComprehensiveReportV2ProfileTable`을 표 데이터 계약으로 사용한다.
- `fourPillarGrid`를 시주, 일주, 월주, 연주 컬럼의 기본 구조로 사용한다.
- `buildComprehensiveReportV2ProfileTable`과 `buildSajuPillarGridColumns`를 중심으로 확장한다.
- 기존 `ReportOutput.sections`의 문장/블록 데이터는 표 SSOT로 사용하지 않는다.

이유:

- `ReportOutput`은 표시 문장용 결과이며 raw 계산 필드를 보존하지 않는다.
- V2 `profileTable`은 이미 화면 렌더링과 deterministic facts 주입을 전제로 설계되어 있다.
- 표는 LLM 생성 문장이 아니라 계산/매핑 결과로 고정되어야 한다.

### MBTI 성향표

SSOT는 `docs/product/mbti/source/*.json`의 16유형 source DB로 둔다.

기준 방향:

- runtime adapter를 만들어 source DB에서 필요한 MBTI 표 필드만 읽는다.
- 기존 `src/lib/mbti/types.ts`, `MBTI_KNOWLEDGE_BASE`, `MbtiTypeKnowledgeBase`는 기존 리포트/지식 선택 흐름을 유지하기 위한 별도 런타임 지식으로 둔다.
- MBTI 표의 원천 필드는 source DB를 기준으로 한다.

이유:

- source DB에는 `type`, `titleKo`, `archetype`, `oneLine`, `preferenceAxes`, `functionStack`, `summary`, `traits`가 모두 있다.
- 현재 런타임 MBTI 구조는 표 요구 필드를 한 번에 제공하지 않는다.
- 16유형 DB를 제품용 SSOT로 확정해야 이후 표와 writer 연결이 흔들리지 않는다.

### 세운표

SSOT는 기존 세운 계산 구조를 사용한다.

기준 방향:

- 연도 단위 표는 `getAnnualGanjiInfo`, `getTenGodForStemPair`, `getAnnualBranchInteractions`의 계산 결과를 기준으로 한다.
- 세운 리포트용 evidence는 `buildAnnualFortuneEvidence`를 기준으로 한다.
- 표시용 draft인 `AnnualFortuneReportDraft`는 렌더링 결과이며, 가능하면 표 데이터는 writer draft보다 계산 evidence에서 만든다.

이유:

- 세운은 연도 간지, 천간/지지 오행, 십성, 지지 작용, 월별 흐름 seed가 이미 deterministic 계산으로 나온다.
- 표는 계산 가능한 항목을 LLM 문장에 의존하지 않아야 한다.

### 대운표

현재 대운표 SSOT는 `majorFortuneCycles` 입력 기반으로 둔다.

대운표 정책 후보는 두 가지다.

#### 후보 A. 직접 대운 계산 엔진 구현

장점:

- 생년월일시 입력만으로 대운표를 자동 산출할 수 있다.
- 장기적으로 사용자 입력/외부 만세력 의존도를 줄일 수 있다.
- 표와 대운 리포트의 계산 기준을 내부 엔진으로 통일할 수 있다.

단점:

- 절기 기준, 순행/역행, 성별/음양 기준, 시작 나이 계산 등 검증 범위가 크다.
- 현재 프로젝트 V1 사주 계산 spec에서는 대운/세운이 제외되어 있었다.
- 검산 fixture와 외부 만세력 parity 테스트가 충분히 필요하다.
- 지금 단계에서 구현하면 표 구현보다 계산 엔진 검증이 먼저 커진다.

#### 후보 B. 사용자 입력/외부 만세력 기준 `majorFortuneCycles` 입력 기반

장점:

- 현재 코드 구조와 맞다.
- `hydrateMajorFortuneCycle`, `getMajorFortuneCycleForYear`, `buildMajorFortuneEvidence`를 바로 활용할 수 있다.
- 대운표 계산 검증 리스크를 이번 단계에서 분리할 수 있다.
- 외부 만세력 기준을 명시하면 사용자에게 계산 기준을 투명하게 보여줄 수 있다.

단점:

- 사용자가 검증된 대운표를 입력하거나 외부 산출값을 받아야 한다.
- 자동 계산형 UX가 아니다.
- 외부 데이터 입력 형식 검증이 필요하다.

결정:

- 1차 구현은 후보 B를 기준으로 한다.
- 직접 대운 계산 엔진은 이번 단계의 non-goal로 둔다.
- 추후 대운 계산 엔진을 만들 경우 별도 task에서 spec, parity fixture, 테스트를 먼저 고정한다.

## 4. Required Fields

### 공통 만세력표

컬럼:

- 시주
- 일주
- 월주
- 연주

행:

- 천간
- 지지
- 십성
- 오행
- 지장간
- 십이운성
- 십이신살
- 신살/귀인
- 합충형파해

필드 계약 방향:

- `columnId`: `hour` | `day` | `month` | `year`
- `labelKo`: 시주/일주/월주/연주
- `pillar`: 간지 문자열
- `heavenlyStem`: 천간
- `earthlyBranch`: 지지
- `tenGod`: 천간/지지 십성 표시값
- `element`: 천간/지지 오행 표시값
- `hiddenStems`: 지장간
- `twelveLifeStage`: 십이운성
- `twelveSinsal`: 십이신살
- `sinsal`: 신살
- `gwiin`: 귀인/길신
- `relations`: 해당 기둥과 연결된 합충형파해 표시값

### MBTI 성향표

필수 필드:

- `type`
- `titleKo`
- `archetype`
- `oneLine`
- `preferenceAxes`
- `functionStack`
- `summary`
- `traits` 핵심 요약

traits 핵심 요약의 1차 표 영역:

- `identity`
- `thinkingStyle`
- `career`
- `workplace`
- `money`
- `investment`
- `study`
- `love`
- `marriage`
- `relationships`
- `communication`
- `strengths`
- `risks`
- `growth`

### 대운표

필수 필드:

- 대운 순번
- 시작 나이
- 종료 나이
- 시작 연도
- 종료 연도
- 대운 간지
- 대운 천간
- 대운 지지
- 대운 천간 오행
- 대운 지지 오행
- 대운 천간 십성
- 현재 연도 기준 위치
- 이전 대운
- 다음 대운
- 대운 지지와 원국 지지의 합충형파해
- 대운 지장간
- 계산 기준 라벨

1차 SSOT:

- `majorFortuneCycles`
- `MajorFortuneCycle`
- `MajorFortuneEvidencePacket`
- `MajorFortuneReportDraft.majorFortuneTimelineRows`

### 세운표

필수 필드:

- 대상 연도
- 세운 간지
- 세운 천간
- 세운 지지
- 천간 오행
- 지지 오행
- 천간 십성
- 지지 작용
- 원국과의 합충형파해
- 월별 간지
- 월별 오행 포인트
- 월별 원국 작용 요약
- 선택 가능 여부/모드

1차 SSOT:

- `AnnualGanjiInfo`
- `AnnualFortuneEvidencePacket`
- `AnnualMonthGanjiInfo`
- `AnnualBranchInteraction`

## 5. Gaps

### 공통 만세력표

- `ReportOutput`에는 표용 raw data가 없다.
- `profileTable.fourPillarGrid`에는 기본 표 구조가 있으나 합충형파해 row는 아직 명확한 필드로 고정되어 있지 않다.
- 기존 원국 relation은 천간합, 지지합, 지지충 중심이다. 형, 파, 해까지 원국 표에 넣으려면 보강이 필요하다.
- 지장간 십성은 위치별 표시가 더 명확해야 한다.
- 기존 `ComputedSajuFacts`에는 `dayPillar`는 필수지만 `yearPillar`, `monthPillar`, `hourPillar`는 optional이다. 완전한 원국표를 위해서는 입력 누락 정책이 필요하다.

### MBTI 성향표

- source DB는 완성되어 있으나 runtime adapter가 없다.
- source JSON schema를 runtime에서 검증하는 계약이 아직 없다.
- 표용 traits 핵심 요약을 몇 개까지 노출할지 정책이 필요하다.

### 대운표

- 내부 대운 계산 엔진이 없다.
- 현재 대운표는 `majorFortuneCycles`가 주어져야 한다.
- 사용자 입력/외부 만세력 기준을 사용할 경우 입력 검증 schema가 필요하다.
- 직접 계산 엔진을 선택할 경우 별도 spec과 검산 fixture가 필요하다.

### 세운표

- 세운 계산 구조는 있으나 표 전용 데이터 계약은 아직 분리되어 있지 않다.
- 월별 간지는 현재 달력월 근사 기준이다. 절기 exact 기준이 필요하면 별도 보강이 필요하다.
- 세운표도 writer draft가 아니라 deterministic evidence에서 만드는 원칙을 고정해야 한다.

## 6. Implementation Order

1. MBTI source DB runtime adapter와 schema를 만든다.
2. `profileTable.fourPillarGrid`를 공통 만세력표 SSOT로 확정하고 부족 필드를 보강한다.
3. 원국 표의 합충형파해 필드 정책을 확정한다.
4. V2 결과 페이지의 기존 만세력표 렌더링을 확장한다.
5. MBTI 성향표 렌더링을 추가한다.
6. 세운 evidence 기반 세운표 데이터 builder를 만든다.
7. 대운은 `majorFortuneCycles` 입력 기반 표를 먼저 만든다.
8. 직접 대운 계산 엔진은 별도 task에서 spec과 parity 테스트를 먼저 만든 뒤 진행한다.

## 7. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- 대운 계산 엔진 구현
- 결제/Supabase/Toss 수정
- MBTI source JSON 수정
- 새 source JSON 생성
