# Daeun Fortune Table Spec

## 1. Purpose

대운 표는 대운 상품과 종합 리포트에서 공통 만세력표 아래에 붙는 장기 운세 facts table이다.

목적은 다음과 같다.

- 현재 10년 대운 구간에서 사용자가 어느 연도에 있는지 한눈에 보여준다.
- 대운과 연운을 같은 기준으로 나란히 놓아 장기 배경과 해당 연도의 작용을 비교한다.
- 대운 해석 문장이 아니라 `majorFortuneCycles` 입력값, `MajorFortuneEvidencePacket`, 연운 계산 함수에서 나온 deterministic data를 기준으로 표시한다.
- 직접 대운 계산 엔진이 없는 현재 단계에서도 외부 만세력 또는 사용자 입력 대운표를 기준으로 일관된 표 UI를 제공한다.

대운 표는 공통 만세력표를 대체하지 않는다. 공통 만세력표는 원국 facts layer이고, 대운 표는 원국 아래에 붙는 시간 흐름 layer다.

## 2. Reference Direction

참고 이미지에서 가져올 구조:

- `대운 타임라인` 블록을 둔다.
- 현재 대운 구간의 연도별 행을 세로 timeline으로 보여준다.
- 각 행에 연도, 나이, 대운 간지, 연운 간지를 표시한다.
- 현재 연도는 강조하고 `올해` badge를 붙인다.
- 대운 시작 또는 전환 연도에는 `전환` badge를 붙인다.
- 좌측 timeline indicator로 현재 위치를 직관적으로 보여준다.
- `대운·연운` 비교표를 둔다.
- 좌측은 현재 대운, 우측은 선택 연도 연운으로 고정한다.
- 천간/지지 카드는 한자, 한글 음, 십성, 오행 색상으로 표시한다.
- 하단 detail rows에는 지장간, 십이운성, 십이신살, 신살/귀인, 합충형파해를 표시한다.

결리포트식으로 바꿀 지점:

- 참고 이미지를 그대로 복제하지 않는다.
- `세운`이라는 표현은 연도 운을 뜻하는 계산 용어로 유지하되, 화면 title은 사용자가 이해하기 쉬운 `연운`을 우선 사용한다.
- 표 데이터는 writer draft가 아니라 evidence 또는 deterministic table adapter에서 만든다.
- 현재 존재하지 않는 십이운성, 십이신살, 신살/귀인 세부값은 임의 생성하지 않는다.
- 부족한 항목은 숨기거나 `-`로 표시하고, 계산 보강 후 노출한다.

## 3. Table Types

대운 상품의 1차 표 종류:

1. 대운 타임라인
2. 현재 대운·선택 연운 비교표

배치 원칙:

- 공통 만세력표
- 대운 타임라인
- 현재 대운·선택 연운 비교표
- 대운 해석 본문

종합 리포트에서는 대운 상품 전체를 그대로 넣지 않고, 현재 대운 요약과 필요한 preview rows만 축약해서 사용할 수 있다.

## 4. Daeun Timeline Table

대운 타임라인은 현재 대운 구간의 10년 흐름을 연도별 행으로 보여준다.

기본 행:

| Field | Meaning |
| --- | --- |
| `year` | 표시 연도 |
| `age` | 해당 연도의 나이 숫자 |
| `ageLabel` | 화면 표시용 나이 label |
| `yearIndexInCycle` | 현재 대운 안에서 몇 년차인지 |
| `phase` | `early` / `middle` / `late` |
| `isCurrentYear` | 현재 연도 여부 |
| `isTransitionYear` | 대운 시작 또는 전환 연도 여부 |
| `badges` | `올해`, `전환`, `강함`, `주의`, `정리` |
| `daeunPillar` | 해당 연도에 적용되는 대운 간지 |
| `annualPillar` | 해당 연도의 연운 간지 |
| `daeunTenGod` | 대운 천간의 십성 |
| `annualTenGod` | 연운 천간의 십성 |
| `daeunStemElement` | 대운 천간 오행 |
| `daeunBranchElement` | 대운 지지 오행 |
| `annualStemElement` | 연운 천간 오행 |
| `annualBranchElement` | 연운 지지 오행 |
| `elementColors` | 오행 색상 token |
| `keyInteractionLabel` | 핵심 합충형파해 label |
| `oneLine` | 해당 연도 한 줄 요약 |
| `strategy` | 해당 연도 전략 |

현재 코드의 `MajorFortuneEvidencePacket.majorFortuneTimelineRows`에는 다음 값이 이미 있다.

- `year`
- `ageLabel`
- `ageBasisLabel`
- `yearIndexInCycle`
- `phase`
- `isCurrentYear`
- `isCycleStartYear`
- `isCycleEndYear`
- `badges`
- `majorGanji`
- `annualGanji`
- `annualTenGodLabel`
- `keyInteractionLabel`
- `oneLine`
- `strategy`

1차 adapter 매핑:

- `daeunPillar` = `row.majorGanji`
- `annualPillar` = `row.annualGanji`
- `annualTenGod` = `row.annualTenGodLabel`
- `isTransitionYear` = `row.isCycleStartYear`
- `badges` = `row.badges`
- `ageLabel` = `row.ageLabel`
- `age` = `ageLabel`에서 숫자 파싱하거나 evidence builder에서 numeric field로 보강
- `daeunTenGod` = `MajorFortuneEvidencePacket.majorTenGod.stemTenGod`
- `daeunStemElement`, `daeunBranchElement` = `MajorFortuneEvidencePacket.currentCycle`
- `annualStemElement`, `annualBranchElement` = `getAnnualGanjiInfo(row.year)`

표시 방식:

- 좌측에는 timeline indicator를 둔다.
- 현재 연도 행은 배경, border, dot 중 2개 이하의 시각 신호로 강조한다.
- `올해` badge는 현재 연도에만 표시한다.
- `전환` badge는 대운 시작 연도에 표시한다.
- 대운 종료 연도는 `정리` badge로 표시한다.
- 간지 표시는 텍스트만 두지 않고 작은 오행 카드로 표시한다.

## 5. Current Daeun And Annual Fortune Table

현재 대운·선택 연운 비교표는 대운과 연운을 두 컬럼으로 비교한다.

컬럼:

- 대운
- 연운 `{selectedYear}`

행:

- 천간
- 지지
- 지장간
- 십이운성
- 십이신살
- 신살/귀인
- 합충형파해

천간/지지 카드 필드:

| Field | Daeun source | Annual source |
| --- | --- | --- |
| `stem.hanja` | `currentCycle.stem` | `getAnnualGanjiInfo(selectedYear).stem` |
| `stem.hangul` | display dictionary | display dictionary |
| `stem.tenGod` | `getTenGodForStemPair(dayMaster, currentCycle.stem)` | `getTenGodForStemPair(dayMaster, annualStem)` |
| `stem.element` | `currentCycle.stemElement` | `annualGanji.stemElement` |
| `stem.elementColor` | common element color system | common element color system |
| `branch.hanja` | `currentCycle.branch` | `annualGanji.branch` |
| `branch.hangul` | display dictionary | display dictionary |
| `branch.tenGod` | branch main hidden-stem ten-god rule 필요 | branch main hidden-stem ten-god rule 필요 |
| `branch.element` | `currentCycle.branchElement` | `annualGanji.branchElement` |
| `branch.elementColor` | common element color system | common element color system |

detail row 필드:

| Row | Daeun source | Annual source |
| --- | --- | --- |
| 지장간 | `myeongliLayers.hiddenStemLayer.majorBranchHiddenStems` | hidden stems mapping 필요 |
| 십이운성 | 현재 `twelveStageLayer`가 `null` | annual twelve stage 계산 필요 |
| 십이신살 | 현재 per-branch 계산 없음 | annual twelve sinsal 계산 필요 |
| 신살/귀인 | `myeongliLayers.auxiliaryStarsLayer` 일부 사용 가능 | annual auxiliary stars 계산 필요 |
| 합충형파해 | `branchInteractions` | selected year 기준 `getAnnualBranchInteractions` |

비교표의 합충형파해는 두 층으로 나눈다.

- 대운 컬럼: 현재 대운 지지가 원국 지지와 맺는 작용
- 연운 컬럼: 선택 연도 지지가 원국 지지와 맺는 작용, 그리고 대운 지지와 맺는 작용

연운과 대운의 직접 관계는 별도 label로 분리한다.

- 예: `연운 午 - 대운 辰: 관계 없음`
- 예: `연운 戌 - 대운 辰: 충`

현재 timeline의 `keyInteractionLabel`은 원국과 대운 지지가 함께 섞인 결과에서 첫 번째 interaction만 보여줄 수 있으므로, 비교표 SSOT로는 부족하다.

## 6. Required Fields

### Common table payload

- `personLabel`
- `currentYear`
- `selectedYear`
- `currentAge`
- `dayMaster`
- `calculationBasis`
- `majorCycleBasis`
- `currentCycle`
- `previousCycle`
- `nextCycle`

### Daeun timeline

- `year`
- `age`
- `ageLabel`
- `yearIndexInCycle`
- `phase`
- `isCurrentYear`
- `isTransitionYear`
- `isCycleStartYear`
- `isCycleEndYear`
- `badges`
- `daeunPillar`
- `annualPillar`
- `daeunTenGod`
- `annualTenGod`
- `daeunStemElement`
- `daeunBranchElement`
- `annualStemElement`
- `annualBranchElement`
- `elementColors`
- `keyInteractionLabel`
- `oneLine`
- `strategy`

### Daeun and annual comparison

- `selectedYear`
- `daeunColumn.title`
- `annualColumn.title`
- `daeunColumn.stem`
- `daeunColumn.branch`
- `annualColumn.stem`
- `annualColumn.branch`
- `hiddenStems`
- `twelveLifeStage`
- `twelveSinsal`
- `auxiliaryStars`
- `relations`

### Ganji card

- `hanja`
- `hangul`
- `tenGod`
- `element`
- `elementKo`
- `elementColorToken`
- `yinYang`

## 7. Data Mapping

현재 확인한 주요 파일:

- `src/lib/report-knowledge/majorFortuneTypes.ts`
- `src/lib/report-knowledge/majorFortuneRules.ts`
- `src/lib/report-knowledge/majorFortuneEvidence.ts`
- `src/lib/report-knowledge/annualFortuneTypes.ts`
- `src/lib/report-knowledge/annualFortuneYearRules.ts`
- `src/lib/report-knowledge/annualFortuneEvidence.ts`
- `src/lib/report-generation/majorFortuneReportDraftTypes.ts`
- `src/app/reports/[reportId]/MajorFortuneReportView.tsx`
- `docs/product/REPORT_TABLE_SSOT_DESIGN.md`
- `docs/product/MANSE_RYEOK_COMMON_TABLE_SPEC.md`

기준 데이터:

| Need | Current source |
| --- | --- |
| 대운 구간 입력 | `person.majorFortuneCycles` |
| 대운 기준 | `person.majorFortuneCycleBasis` |
| 현재 대운 선택 | `getMajorFortuneCycleForYear` |
| 대운 간지 구조화 | `hydrateMajorFortuneCycle`, `getMajorFortuneGanjiInfo` |
| 현재 대운 evidence | `buildMajorFortuneEvidence` |
| 대운 타임라인 | `MajorFortuneEvidencePacket.majorFortuneTimelineRows` |
| 연운 간지 | `getAnnualGanjiInfo(year)` |
| 천간 십성 | `getTenGodForStemPair(dayMaster, targetStem)` |
| 연운 지지와 원국 작용 | `getAnnualBranchInteractions` |
| 대운 지지와 원국 작용 | `getMajorFortuneBranchInteractions` |
| 대운 지장간 | `myeongliLayers.hiddenStemLayer.majorBranchHiddenStems` |
| 대운 신살/귀인 일부 | `myeongliLayers.auxiliaryStarsLayer` |
| 현재 대운 화면 | `MajorFortuneReportView.renderTimeline` |

SSOT 결정:

- 대운 타임라인의 1차 SSOT는 `MajorFortuneEvidencePacket.majorFortuneTimelineRows`다.
- 단, UI 카드에 필요한 오행/천간/지지 구조는 writer draft가 아니라 evidence adapter에서 보강한다.
- 대운·연운 비교표의 SSOT는 `MajorFortuneEvidencePacket.currentCycle` + `getAnnualGanjiInfo(selectedYear)` + 원국 branches 기반 deterministic comparison builder다.
- `MajorFortuneReportDraft`는 렌더링/본문 draft이므로 표 데이터의 최종 SSOT로 쓰지 않는다.

## 8. Missing Data / Gaps

현재 데이터로 바로 가능한 필드:

- 대운 구간 index, 시작 나이, 종료 나이, 시작 연도, 종료 연도
- 현재 대운 간지, 천간, 지지
- 대운 천간/지지 오행
- 대운 음양
- 현재 연도와 현재 나이
- 대운 기준 label과 설명
- 현재 대운 내 몇 년차인지
- 대운 타임라인의 연도별 row
- 현재 연도 강조 여부
- 대운 시작/종료 여부
- `올해`, `전환`, `강함`, `주의`, `정리` badge
- 연도별 연운 간지
- 연도별 연운 천간 십성
- 연운 천간/지지 오행
- 대운 지지와 원국 지지의 합충형파해
- 연운 지지와 원국 지지의 합충형파해
- 대운 지장간 string 목록
- 대운 신살/귀인 일부 목록

부족한 필드:

- 직접 대운 계산 엔진
- timeline row의 numeric `age`
- timeline row의 명시적 `isTransitionYear`
- timeline row의 대운 천간/지지 structured card
- timeline row의 연운 천간/지지 structured card
- timeline row의 대운 천간 십성 field
- timeline row의 오행 색상 token
- 천간/지지 한글 음 display dictionary
- 지지 십성 산출 규칙
- 대운 지장간 structured entries
- 연운 지장간 structured entries
- 대운 십이운성
- 연운 십이운성
- 대운 십이신살
- 연운 십이신살
- 선택 연도 기준 신살/귀인
- 대운 지지와 연운 지지의 직접 합충형파해
- 비교표 전용 `DaeunAnnualComparisonTableData`

보강 원칙:

- writer draft에 필드를 추가해 표를 맞추지 않는다.
- 먼저 deterministic table adapter와 타입 계약을 만든다.
- 공통 만세력표의 오행 색상 정책과 display dictionary를 재사용한다.
- 십이운성, 십이신살, 신살/귀인은 계산 근거가 확정된 항목만 노출한다.

## 9. Daeun Policy

1차 정책:

- 대운표는 `majorFortuneCycles` 입력 기반으로 만든다.
- `majorFortuneCycleBasis`는 입력값의 출처를 명시한다.
- 외부 만세력 또는 사용자가 검증해 입력한 대운표는 `user_supplied_major_fortune_table`로 처리한다.
- 추후 내부 만세력 엔진에서 산출한 대운표를 쓰는 경우 `manse_engine_major_fortune_table`을 사용할 수 있다.
- 현재 단계에서는 직접 대운 계산 엔진을 구현하지 않는다.

직접 대운 계산 엔진은 별도 작업으로 분리한다.

필요 선행:

- 절기 기준 spec
- 순행/역행 기준 spec
- 성별/음양 기준 spec
- 대운 시작 나이 계산 spec
- 외부 만세력 parity fixture
- 60갑자 경계 테스트
- timezone/date boundary 테스트

대운 표 UI는 위 엔진이 없어도 먼저 구현할 수 있어야 한다. 단, 사용자가 볼 수 있는 기준 label에는 `입력된 대운표 기준` 또는 `만세력 대운표 기준`을 명확히 표시한다.

## 10. Mobile UX Rules

- 대운 타임라인은 모바일에서 세로 timeline을 유지한다.
- 연도, 나이, badge는 한 줄 안에 과밀하게 넣지 않는다.
- 대운/연운 간지는 작은 카드 2개씩 표시한다.
- 현재 연도는 timeline dot, border, background 중 2개 이하로 강조한다.
- `올해`, `전환`, `주의` badge는 짧은 label로 유지한다.
- 긴 `oneLine`과 `strategy`는 두 줄 이상 줄바꿈을 허용한다.
- 대운·연운 비교표는 모바일에서도 2컬럼 구조를 유지한다.
- 천간/지지 카드는 각 컬럼 안에서 위아래로 쌓는다.
- 지장간, 신살/귀인, 합충형파해처럼 긴 목록은 줄바꿈 또는 접힘 처리한다.
- 부족한 값은 빈 문장으로 보완하지 않고 `-` 또는 숨김 처리한다.

## 11. Reuse Policy

대운 상품:

- 공통 만세력표 아래에 대운 타임라인과 대운·연운 비교표를 모두 표시한다.
- 선택 연도는 기본값으로 현재 연도를 사용한다.
- 사용자가 타임라인 행을 선택하면 비교표의 연운 컬럼이 해당 연도로 바뀐다.

종합 리포트:

- 공통 만세력표 아래에 현재 대운 summary와 축약 timeline을 배치할 수 있다.
- 전체 10년 상세 타임라인과 비교표 전체는 유료 대운 상품으로 확장한다.

세운 상품:

- 세운 상품은 별도 세운표를 기준으로 한다.
- 대운·연운 비교표의 연운 column builder는 세운표 구현 시 재사용할 수 있다.

다른 상품:

- 직업, 연애/결혼, 궁합 상품은 대운표 전체를 기본 표시하지 않는다.
- 필요 시 현재 대운 badge 또는 간단한 대운 context만 상품별 해석에 참조한다.

## 12. Implementation Order

추천 구현 순서:

1. `DaeunFortuneTableData` 타입 계약을 정의한다.
2. `DaeunTimelineTableData`와 `DaeunAnnualComparisonTableData`를 분리한다.
3. `MajorFortuneEvidencePacket`에서 대운 타임라인 table data를 만드는 adapter를 만든다.
4. `getAnnualGanjiInfo(row.year)`를 이용해 timeline row의 연운 structured card를 보강한다.
5. `currentCycle`을 이용해 timeline row의 대운 structured card를 보강한다.
6. 공통 만세력표의 오행 색상 token과 천간/지지 한글 음 mapping을 재사용한다.
7. 현재 대운·선택 연운 비교표 adapter를 만든다.
8. 지장간 structured entry와 지지 십성 산출 규칙을 먼저 보강한다.
9. 십이운성, 십이신살, 신살/귀인은 계산 근거가 확정된 순서대로 추가한다.
10. fixture 기반으로 10년 타임라인, 현재 연도 강조, 전환 badge, 연운 간지 매핑을 검증한다.
11. 대운 상품 화면에 연결한다.
12. 종합 리포트에는 축약형으로 연결한다.
13. 직접 대운 계산 엔진은 별도 spec과 parity 검증 후 진행한다.

## 13. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- 대운 계산 엔진 구현
- 세운표 구현
- writer 구현
- 결제/Supabase/Toss 수정
- MBTI JSON 수정
