# Saeun Fortune Table Spec

## 1. Purpose

세운 표는 세운 상품에서 선택 연도의 연운과 월운을 표로 보여주는 시간 흐름 facts table이다.

목적은 다음과 같다.

- 선택 연도 연운의 천간, 지지, 십성, 오행, 원국과의 작용을 한눈에 보여준다.
- 현재 대운이 제공되는 경우 대운과 선택 연도 연운을 나란히 비교한다.
- 1월부터 12월까지의 월운을 상반기와 하반기로 나누어 읽기 쉽게 표시한다.
- 세운 해석 문장이 아니라 `AnnualFortuneEvidencePacket`, `monthlyFortuneSeeds`, 연간/월간 간지 계산 함수에서 나온 deterministic data를 기준으로 표시한다.

세운 표는 공통 만세력표를 대체하지 않는다. 공통 만세력표는 원국 facts layer이고, 세운 표는 선택 연도와 월별 흐름을 보여주는 time layer다.

## 2. Reference Direction

참고 이미지에서 가져올 구조:

- 상단에 `대운·연운` 비교표를 둔다.
- 좌측은 현재 대운, 우측은 선택 연도 연운으로 표시한다.
- 대운/연운 모두 천간 카드와 지지 카드를 표시한다.
- 각 카드는 한자, 한글 음, 십성, 오행 색상을 포함한다.
- 카드 아래에는 지장간, 십이운성, 십이신살, 신살/귀인, 합충형파해를 행 단위로 표시한다.
- 월운은 `월운 - 상반기`, `월운 - 하반기`로 나누어 표시한다.
- 상반기는 1월부터 6월, 하반기는 7월부터 12월을 6컬럼 표로 표시한다.
- 각 월에도 천간/지지 카드, 상세 행, 핵심 관계/주의 label을 표시한다.

결리포트식으로 바꿀 지점:

- 참고 이미지를 그대로 복제하지 않는다.
- `세운`은 상품/계산 용어로 유지하고, 화면에서는 사용자가 이해하기 쉬운 `연운`을 병기한다.
- 월운은 현재 코드 기준상 `달력월 기준 운영 가이드`임을 명확히 표시한다.
- 절기 기준 정밀 월운처럼 아직 구현되지 않은 계산은 표시하지 않는다.
- writer draft의 월별 문장을 표 SSOT로 쓰지 않는다.
- `monthlyFortuneSeeds`를 월운 표의 1차 SSOT로 사용한다.

## 3. Table Types

세운 상품의 1차 표 종류:

1. 대운·연운 비교표
2. 월운 상반기 표
3. 월운 하반기 표

배치 원칙:

- 공통 만세력표
- 대운·연운 비교표
- 월운 상반기 표
- 월운 하반기 표
- 세운 해석 본문

대운 정보가 없는 세운 상품에서는 대운 컬럼을 숨기거나 `대운 정보 없음` 상태로 처리한다. 연운 표와 월운 표는 세운 evidence만으로 표시할 수 있어야 한다.

## 4. Daeun And Annual Fortune Table

대운·연운 비교표는 현재 대운과 선택 연도 연운을 두 컬럼으로 비교한다.

컬럼:

- 대운
- 연운 `{targetYear}`

행:

- 천간
- 지지
- 지장간
- 십이운성
- 십이신살
- 신살/귀인
- 합충형파해

대운 컬럼 source:

- `majorFortuneCycles`
- `getMajorFortuneCycleForYear`
- `MajorFortuneEvidencePacket.currentCycle`
- `MajorFortuneEvidencePacket.majorTenGod`
- `MajorFortuneEvidencePacket.branchInteractions`
- `MajorFortuneEvidencePacket.myeongliLayers`

연운 컬럼 source:

- `AnnualFortuneEvidencePacket.annualGanji`
- `AnnualFortuneEvidencePacket.annualTenGod`
- `AnnualFortuneEvidencePacket.elementEffect`
- `AnnualFortuneEvidencePacket.branchInteractions`

표시 카드 필드:

- 한자
- 한글 음
- 십성
- 오행
- 오행 색상 token
- 음양

대운·연운 비교표는 대운 표 spec의 `Current Daeun And Annual Fortune Table`과 같은 데이터 계약을 재사용한다. 세운 상품에서는 선택 연도 `{targetYear}`가 고정이고, 대운 상품에서는 타임라인에서 선택한 연도에 따라 연운 컬럼이 바뀐다.

## 5. Monthly Fortune First Half Table

월운 상반기 표는 1월부터 6월까지의 월운을 6컬럼으로 보여준다.

컬럼:

- 1월
- 2월
- 3월
- 4월
- 5월
- 6월

행:

- 천간 카드
- 지지 카드
- 지장간
- 십이운성
- 십이신살
- 신살/귀인
- 합충형파해
- 핵심 관계/주의 label

월별 필드:

| Field | Meaning |
| --- | --- |
| `month` | 월 숫자 |
| `monthLabel` | `1월` 같은 표시 label |
| `monthlyPillar` | 월운 간지 |
| `heavenlyStem` | 월운 천간 |
| `earthlyBranch` | 월운 지지 |
| `tenGod` | 월운 천간의 십성 |
| `element` | 월운 천간/지지 오행 |
| `elementColor` | 오행 색상 token |
| `hiddenStems` | 월지 지장간 |
| `twelveLifeStage` | 일간 기준 월지 십이운성 |
| `twelveSinsal` | 월지 기준 십이신살 |
| `sinsal` | 월운 신살 |
| `gwiin` | 월운 귀인/길신 |
| `interactions` | 월지와 원국/연운/대운의 합충형파해 |
| `oneLine` | 월별 한 줄 요약 |
| `caution` | 월별 주의 label |

현재 1차 구현에서는 `monthlyFortuneSeeds`의 deterministic 값으로 가능한 항목부터 채운다. 부족한 항목은 `-` 또는 숨김 처리한다.

## 6. Monthly Fortune Second Half Table

월운 하반기 표는 7월부터 12월까지의 월운을 6컬럼으로 보여준다.

컬럼:

- 7월
- 8월
- 9월
- 10월
- 11월
- 12월

행 구조와 필드는 상반기 표와 동일하다.

하반기 표는 별도 데이터 계약을 만들지 않는다. 같은 `MonthlyFortuneTableRow` 또는 `MonthlyFortuneTableMonth` 데이터를 `month <= 6`, `month >= 7` 기준으로 나누어 렌더링한다.

## 7. Required Fields

### Common payload

- `personLabel`
- `targetYear`
- `currentDate`
- `mode`
- `yearAccess`
- `dayMaster`
- `userPillars`
- `annualGanji`
- `annualTenGod`
- `branchInteractions`
- `monthlyFortuneSeeds`
- `majorFortuneContext` optional

### Daeun and annual comparison

- `daeunColumn` optional
- `annualColumn`
- `selectedYear`
- `calculationBasisLabel`
- `stemCard`
- `branchCard`
- `hiddenStems`
- `twelveLifeStage`
- `twelveSinsal`
- `sinsal`
- `gwiin`
- `interactions`

### Monthly fortune table

- `month`
- `monthLabel`
- `monthlyPillar`
- `heavenlyStem`
- `earthlyBranch`
- `tenGod`
- `element`
- `elementColor`
- `hiddenStems`
- `twelveLifeStage`
- `twelveSinsal`
- `sinsal`
- `gwiin`
- `interactions`
- `oneLine`
- `caution`
- `basis`

### Ganji card

- `hanja`
- `hangul`
- `tenGod`
- `element`
- `elementKo`
- `elementColorToken`
- `yinYang`

## 8. Data Mapping

현재 확인한 주요 파일:

- `src/lib/report-knowledge/annualFortuneTypes.ts`
- `src/lib/report-knowledge/annualFortuneYearRules.ts`
- `src/lib/report-knowledge/annualFortuneEvidence.ts`
- `src/lib/report-generation/annualFortuneReportDraftTypes.ts`
- `src/lib/report-generation/annualFortuneReportDraftValidator.ts`
- `src/app/reports/[reportId]/AnnualFortuneReportView.tsx`
- `docs/product/DAEUN_FORTUNE_TABLE_SPEC.md`
- `docs/product/MANSE_RYEOK_COMMON_TABLE_SPEC.md`
- `docs/product/REPORT_TABLE_SSOT_DESIGN.md`

연운 mapping:

| Need | Current source |
| --- | --- |
| 대상 연도 | `AnnualFortuneEvidencePacket.targetYear` |
| 연운 간지 | `AnnualFortuneEvidencePacket.annualGanji.ganji` |
| 연운 천간 | `AnnualFortuneEvidencePacket.annualGanji.stem` |
| 연운 지지 | `AnnualFortuneEvidencePacket.annualGanji.branch` |
| 연운 천간 오행 | `AnnualFortuneEvidencePacket.annualGanji.stemElement` |
| 연운 지지 오행 | `AnnualFortuneEvidencePacket.annualGanji.branchElement` |
| 연운 천간 십성 | `AnnualFortuneEvidencePacket.annualTenGod.stemTenGod` |
| 연운 지지 기본 오행 | `AnnualFortuneEvidencePacket.annualTenGod.branchMainElement` |
| 연운과 원국 작용 | `AnnualFortuneEvidencePacket.branchInteractions` |

월운 mapping:

| Need | Current source |
| --- | --- |
| 월 숫자 | `monthlyFortuneSeeds[].month` |
| 월 label | `monthlyFortuneSeeds[].label` |
| 월운 간지 | `monthlyFortuneSeeds[].monthGanji.ganji` |
| 월운 천간 | `monthlyFortuneSeeds[].monthGanji.stem` |
| 월운 지지 | `monthlyFortuneSeeds[].monthGanji.branch` |
| 월운 천간 오행 | `monthlyFortuneSeeds[].monthGanji.stemElement` |
| 월운 지지 오행 | `monthlyFortuneSeeds[].monthGanji.branchElement` |
| 월운 기준 | `monthlyFortuneSeeds[].basis` |
| 오행 요약 | `monthlyFortuneSeeds[].elementFocus` |
| 원국 작용 요약 | `monthlyFortuneSeeds[].natalInteractionSummary` |
| 월별 기본 설명 | `monthlyFortuneSeeds[].plain` |

writer draft mapping:

| Need | Current source |
| --- | --- |
| 월별 headline | `AnnualFortuneReportDraft.monthlyFlow[].headline` |
| 월별 body | `AnnualFortuneReportDraft.monthlyFlow[].body` |
| 월별 advice | `AnnualFortuneReportDraft.monthlyFlow[].advice` |

결정:

- 월운 표의 SSOT는 `monthlyFortuneSeeds`다.
- `monthlyFlow`는 해석 본문용 draft이며 표 SSOT로 쓰지 않는다.
- `oneLine`과 `caution`은 1차에서는 seed 기반 deterministic adapter에서 만들고, writer 문장을 그대로 표 필드에 넣지 않는다.

## 9. Missing Data / Gaps

현재 데이터로 바로 가능한 필드:

- 대상 연도
- 연운 간지, 천간, 지지
- 연운 천간/지지 오행
- 연운 천간 십성
- 연운 지지와 원국 지지의 합충형파해
- 월 숫자와 월 label
- 월운 간지, 천간, 지지
- 월운 천간/지지 오행
- 월운 달력월 기준 label
- 월운 오행 요약
- 월운 원국 작용 요약
- 월운 12개월 seed
- 상반기/하반기 분할

부족한 필드:

- 세운 상품 안의 대운 비교표를 위한 `majorFortuneContext`
- 대운이 없는 경우의 비교표 fallback 계약
- 천간/지지 한글 음 display dictionary
- 월운 천간 십성 field
- 지지 십성 산출 규칙
- 월운 지장간 structured entries
- 연운 지장간 structured entries
- 월운 십이운성
- 연운 십이운성
- 월운 십이신살
- 연운 십이신살
- 월운 신살/귀인
- 연운 신살/귀인
- 월지와 연지의 직접 합충형파해
- 월지와 대운 지지의 직접 합충형파해
- 표 전용 `SaeunFortuneTableData`
- 표 전용 `MonthlyFortuneTableData`

보강 원칙:

- 부족한 필드를 writer 문장으로 채우지 않는다.
- 월운 표는 현재 가능한 deterministic seed를 우선 노출한다.
- 고급 월운 계산은 별도 spec에서 절기 기준, 월지 관계, 신살/귀인 산출 규칙을 고정한 뒤 추가한다.

## 10. Saeun Policy

1차 정책:

- 세운표는 기존 annual fortune evidence 구조를 활용한다.
- 연운은 `getAnnualGanjiInfo(targetYear)`와 `buildAnnualFortuneEvidence` 결과를 기준으로 한다.
- 월운은 `getAnnualMonthGanjiInfo({ year, month })`와 `monthlyFortuneSeeds`를 기준으로 한다.
- 월운은 상반기 1월~6월, 하반기 7월~12월로 나누어 표시한다.
- 월운 기준은 `달력월 기준 운영 가이드`로 명시한다.
- 절기 기준 정밀 월운은 1차 범위에서 제외한다.

대운 연결 정책:

- 세운 상품에서 대운·연운 비교표를 보여주려면 `majorFortuneCycles` 입력이 필요하다.
- `majorFortuneCycles`가 있으면 현재 대운을 계산해 대운 컬럼을 표시한다.
- `majorFortuneCycles`가 없으면 대운 컬럼을 숨기고 연운 단독 표를 표시한다.
- 직접 대운 계산 엔진은 세운표 구현의 선행 조건이 아니다.

## 11. Mobile UX Rules

- 대운·연운 비교표는 모바일에서도 2컬럼 구조를 유지한다.
- 대운 정보가 없을 때는 연운 단독 1컬럼 표로 자연스럽게 전환한다.
- 월운 상반기/하반기 표는 6컬럼을 유지하되 각 월 카드의 텍스트를 짧게 제한한다.
- 천간/지지 카드는 고정 높이로 두어 월별 컬럼 높이가 흔들리지 않게 한다.
- 지장간, 신살/귀인, 합충형파해 목록은 줄바꿈 또는 접힘 처리한다.
- 긴 `oneLine`과 `caution`은 표 셀 안에 과밀하게 넣지 않고 월별 상세 drawer나 하단 요약으로 뺄 수 있다.
- 오행 색상은 공통 만세력표의 색상 정책을 재사용한다.
- 부족한 값은 `-`로 표시하거나 행 자체를 숨긴다.

## 12. Reuse Policy

세운 상품:

- 공통 만세력표 아래에 대운·연운 비교표, 월운 상반기 표, 월운 하반기 표를 모두 표시한다.
- 월운 표 아래에 월별 해석 본문을 붙인다.

대운 상품:

- 대운·연운 비교표 데이터 계약을 재사용할 수 있다.
- 월운 상반기/하반기 표는 대운 상품의 기본 표가 아니다.

종합 리포트:

- 세운 표 전체를 기본 표시하지 않는다.
- 필요 시 현재 연도 연운 요약과 일부 월운 preview만 축약해 사용할 수 있다.

다른 상품:

- 직업, 연애/결혼, 궁합 상품은 월운 표를 기본 표시하지 않는다.
- 특정 상품에서 연간/월간 흐름을 보여줄 때 같은 월운 table adapter를 재사용할 수 있다.

## 13. Implementation Order

추천 구현 순서:

1. `SaeunFortuneTableData` 타입 계약을 정의한다.
2. `AnnualFortuneEvidencePacket`에서 연운 table data를 만드는 adapter를 만든다.
3. `monthlyFortuneSeeds`에서 12개월 월운 table data를 만드는 adapter를 만든다.
4. 12개월 데이터를 `firstHalfMonths`와 `secondHalfMonths`로 분리한다.
5. 공통 만세력표의 오행 색상 token과 천간/지지 한글 음 mapping을 재사용한다.
6. 월운 천간 십성을 `getTenGodForStemPair(dayMaster, monthStem)`로 보강한다.
7. 지장간 structured entry와 지지 십성 산출 규칙을 보강한다.
8. 대운 정보가 있는 경우 `majorFortuneCycles` 기반 대운·연운 비교표를 연결한다.
9. 십이운성, 십이신살, 신살/귀인은 계산 근거가 확정된 순서대로 추가한다.
10. fixture로 연운 간지, 월운 12개월 간지, 상반기/하반기 분할, basis label을 검증한다.
11. 세운 상품 화면에 표를 연결한다.
12. 월운 상세 해석 본문은 표 아래에 기존 `monthlyFlow`를 사용해 배치한다.
13. 절기 기준 정밀 월운은 별도 spec과 fixture를 만든 뒤 진행한다.

## 14. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- 세운 계산 엔진 수정
- 절기 기준 정밀 월운 구현
- 대운 계산 엔진 구현
- writer 구현
- 결제/Supabase/Toss 수정
- MBTI JSON 수정
