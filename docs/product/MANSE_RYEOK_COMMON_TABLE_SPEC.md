# Manse Ryeok Common Table Spec

## 1. Purpose

공통 만세력표는 모든 결리포트 상품에서 기본으로 제공하는 원국 요약 표다.

목적은 다음과 같다.

- 사용자가 자기 원국의 네 기둥을 한 화면에서 바로 읽게 한다.
- 사주 해석의 근거가 되는 천간, 지지, 십성, 오행, 지장간, 십이운성, 십이신살, 신살/귀인, 합충형파해를 같은 구조로 제공한다.
- 종합, 직업, 연애/결혼, 궁합, 대운, 세운 상품에서 동일한 표 구조를 재사용한다.
- LLM 문장이 아니라 계산 엔진과 deterministic table builder에서 나온 값을 기준으로 표시한다.

공통 만세력표는 상품별 해석보다 먼저 놓이는 기본 facts layer다. 상품별 MBTI 표, 대운표, 세운표, 궁합표는 이 표 아래에 붙는 확장 표로 본다.

## 2. Reference Direction

참고 이미지에서 가져올 구조:

- 상단 제목은 `{이름}님의 만세력` 형식으로 표시한다.
- 4기둥은 시주, 일주, 월주, 연주 순서로 배치한다.
- 각 기둥은 천간 카드와 지지 카드로 구성한다.
- 천간/지지 카드에는 한자, 한글 음, 십성, 오행 색상을 함께 표시한다.
- 표 하단에는 지장간, 십이운성, 십이신살, 신살/귀인, 합충형파해를 행 단위로 표시한다.
- 모바일에서도 4열 구조를 유지한다.

결리포트식으로 바꿀 지점:

- 참고 이미지를 그대로 복제하지 않는다.
- 색은 장식이 아니라 오행 정보를 전달하는 기능으로 쓴다.
- 길고 복잡한 신살/귀인 목록은 모두 펼쳐 과밀하게 보이지 않게 한다.
- `profileTable.fourPillarGrid`가 제공하지 않는 값은 임의 생성하지 않는다.
- 모든 값은 계산 가능하거나 source mapping 가능한 값만 표시한다.
- 무료 미리보기와 유료 본문 모두 같은 데이터 계약을 사용한다.

품질 기준:

- 공통 만세력표는 결리포트 사주 계산 엔진의 기본 품질 기준이다.
- 표에 표시되는 모든 신살, 귀인, 대살, 십성, 오행, 합충형파해는 실제 계산/매핑 근거가 있어야 한다.
- 부족한 항목은 숨기거나 `-`로 표시하되, 없는 정보를 해석 문장으로 보완하지 않는다.

## 3. Table Layout

### Header

상단 헤더:

- `{displayName}님의 만세력`
- `displayName`이 없으면 `나의 만세력` 또는 `사용자님의 만세력`으로 표시한다.
- 접힘/펼침이 필요한 상품에서는 제목 오른쪽에 expand/collapse control을 둘 수 있다.

보조 정보:

- 양력 생년월일
- 출생시간 입력 여부
- 출생시간 모름 안내
- 계산 기준이 필요한 경우 `Asia/Seoul 기준` 표시

보조 정보는 표보다 약한 위계로 둔다.

### Pillar columns

표는 4개 기둥을 유지한다.

- 시주
- 일주
- 월주
- 연주

컬럼은 참고 이미지처럼 오른쪽에서 왼쪽으로 연주를 두지 않고, 결리포트 데이터 구조와 화면 스캔을 맞추기 위해 시주, 일주, 월주, 연주 순서로 고정한다.

### Heavenly stem row

천간 row는 카드형으로 표시한다.

각 카드 기본 구성:

- 한자
- 한글 음
- 십성
- 오행 색상

예시 구조:

- 큰 글자: `甲`
- 보조 글자: `갑`
- 십성: `비견`
- 색상: 목 계열 배경

### Earthly branch row

지지 row도 천간과 동일하게 카드형으로 표시한다.

각 카드 기본 구성:

- 한자
- 한글 음
- 십성
- 오행 색상

지지 십성은 지장간의 본기 또는 현재 `fourPillarGrid.tenGod`에 포함된 `지지 {십성}` 값을 우선 사용한다.

### Detail rows

카드 아래에는 행 단위 상세 정보를 둔다.

상세 행:

- 지장간
- 십이운성
- 십이신살
- 신살/귀인
- 합충형파해

상세 행은 카드보다 작은 글자와 낮은 배경 대비로 둔다. 카드 영역은 원국의 핵심, 상세 행은 근거 목록으로 구분한다.

## 4. Column Order

확정 컬럼 순서:

1. 시주
2. 일주
3. 월주
4. 연주

데이터 key 매핑:

- 시주: `hour`
- 일주: `day`
- 월주: `month`
- 연주: `year`

출생시간을 모르는 경우:

- 시주 컬럼은 유지한다.
- 시주 천간/지지 카드는 `모름` 또는 `-`로 표시한다.
- 시주 상세 행도 `-`로 표시한다.
- 표 전체 구조는 무너지지 않아야 한다.

## 5. Row Definition

### 천간

의미:

- 각 기둥의 위 글자.
- 겉으로 드러나는 기운과 십성의 표면 작용을 보여준다.

표시 방식:

- 카드형.
- 한자 크게 표시.
- 한글 음과 십성을 작게 표시.
- 천간 오행 색상 배경 적용.

현재 가능 데이터:

- `SajuCalcResult.pillars.*.stem`
- `ComprehensiveReportV2PillarGridColumn.heavenlyStem`
- `ComprehensiveReportV2PillarGridColumn.tenGod`의 `천간 {십성}`

### 지지

의미:

- 각 기둥의 아래 글자.
- 생활 배경, 자리, 안쪽에 깔린 기운을 보여준다.

표시 방식:

- 카드형.
- 한자 크게 표시.
- 한글 음과 십성을 작게 표시.
- 지지 오행 색상 배경 적용.

현재 가능 데이터:

- `SajuCalcResult.pillars.*.branch`
- `ComprehensiveReportV2PillarGridColumn.earthlyBranch`
- `ComprehensiveReportV2PillarGridColumn.tenGod`의 `지지 {십성}`

### 지장간

의미:

- 지지 안에 숨어 있는 천간.
- 겉으로 보이지 않는 보조 기운과 십성의 근거다.

표시 방식:

- 기둥별 지장간 목록을 작게 표시한다.
- 2개 이상이면 줄바꿈 또는 `·` 구분을 사용한다.

현재 가능 데이터:

- `SajuCalcResult.tenGods.hiddenStems`
- `ComprehensiveReportV2PillarGridColumn.hiddenStems`
- `buildSajuPillarGridColumns`의 `hiddenStemsByBranch`

보강 방향:

- 지장간에 십성까지 함께 표시하려면 `hiddenStems`를 string array에서 structured entry로 확장한다.

### 십이운성

의미:

- 일간을 기준으로 각 지지가 어떤 생장 단계에 있는지 보여준다.

표시 방식:

- 기둥별 1개 label 표시.

현재 가능 데이터:

- `ComprehensiveReportV2PillarGridColumn.twelveLifeStage`
- `buildSajuPillarGridColumns`의 `twelveLifeStageByStem`

### 십이신살

의미:

- 기준 지지에 따라 각 기둥에서 반복되는 12신살 흐름을 보여준다.

표시 방식:

- 기둥별 1개 이상 label 표시.
- 긴 label은 줄바꿈한다.

현재 가능 데이터:

- `ComprehensiveReportV2PillarGridColumn.twelveSinsal`
- `buildSajuPillarFeaturePlacements`
- `SajuCalcResult.shinsal`의 `TWELVE_*` 계열

### 신살/귀인

의미:

- 원국 안에서 보조 해석 근거가 되는 신살과 귀인을 보여준다.

표시 방식:

- 신살과 귀인을 한 행에 함께 보여주되, 시각적으로 구분한다.
- 3개 이상이면 접힘 또는 `+N` 요약을 허용한다.
- 유료 본문에서는 펼침으로 전체 목록을 볼 수 있게 한다.

현재 가능 데이터:

- `SajuCalcResult.shinsal`
- `ComprehensiveReportV2PillarGridColumn.sinsal`
- `ComprehensiveReportV2PillarGridColumn.gwiin`

### 합충형파해

의미:

- 기둥 사이의 연결, 충돌, 압박, 깨짐, 소모 흐름을 보여준다.

표시 방식:

- 각 기둥 셀에는 해당 기둥이 관여하는 작용만 표시한다.
- 예: `월-일 寅申 충`, `연-월 子丑 합`
- 모바일에서는 짧은 label을 먼저 보여주고 상세 설명은 접힘 처리한다.

현재 가능 데이터:

- `SajuCalcResult.relations.stemCombinations`
- `SajuCalcResult.relations.branchCombinations`
- `SajuCalcResult.relations.branchClashes`
- 세운 쪽 `getAnnualBranchInteractions`에는 형, 파, 해 규칙이 있음

보강 방향:

- 원국 표에 형, 파, 해까지 넣으려면 원국 relation builder를 확장해야 한다.
- 표용 relation은 string list보다 structured relation이 필요하다.

## 6. Card Fields

천간/지지 카드 공통 필드:

- `character`: 한자
- `readingKo`: 한글 음
- `tenGodKo`: 십성
- `element`: 오행 token
- `elementKo`: 오행 한글
- `elementColorToken`: 오행 색상 token

천간 카드 추가 정책:

- 천간 십성은 일간 기준으로 계산한다.
- 일간 자체의 천간 십성은 화면 정책상 `비견` 또는 `일간` label 중 하나를 선택해야 한다.
- 1차 구현은 기존 `fourPillarGrid.tenGod`에 있는 `천간 {십성}` 값을 사용한다.

지지 카드 추가 정책:

- 지지 십성은 본기 기준을 우선한다.
- 현재 `buildSajuPillarGridColumns`는 지장간의 main hidden stem을 기준으로 `지지 {십성}`을 만든다.
- 지장간 전체 십성 표시가 필요하면 별도 structured field로 보강한다.

카드 표시 우선순위:

1. 한자
2. 한글 음
3. 십성
4. 오행 색상
5. 오행 label

모든 카드에는 오행 색상이 들어가야 한다. 색상이 없으면 사용자는 표를 읽기 어렵다.

## 7. Element Color System

오행 색상 정책:

- 목: 초록 계열
- 화: 빨강/분홍 계열
- 토: 노랑/황토 계열
- 금: 흰색/금색/회색 계열
- 수: 파랑/보라/검정 계열

권장 token:

- `wood`
- `fire`
- `earth`
- `metal`
- `water`

표시 원칙:

- 색은 배경으로 사용한다.
- 텍스트 대비는 항상 확보한다.
- 카드 내부 한자는 크고 선명해야 한다.
- 같은 오행 안에서도 천간/지지에 따라 불필요하게 다른 색을 쓰지 않는다.
- 결리포트 전체 UI와 충돌하지 않도록 채도는 과하게 올리지 않는다.

예상 색상 방향:

- 목: muted green
- 화: rose/red
- 토: amber/ochre
- 금: stone/zinc/gold
- 수: blue/indigo/violet

접근성 원칙:

- 색상만으로 오행을 전달하지 않는다.
- 카드 안에 `목`, `화`, `토`, `금`, `수` label 또는 accessible label을 둔다.

## 8. Data Mapping

### SajuCalcResult

사용 가능한 필드:

- `pillars.year`
- `pillars.month`
- `pillars.day`
- `pillars.hour`
- `dayMaster`
- `tenGods.stems`
- `tenGods.hiddenStems`
- `elements.visible`
- `elements.weighted`
- `relations.stemCombinations`
- `relations.branchCombinations`
- `relations.branchClashes`
- `shinsal`

역할:

- 계산 엔진의 raw source.
- 향후 공통 table builder의 가장 낮은 레벨 입력으로 쓸 수 있다.

주의:

- 현재 V2 종합 리포트 표는 `SajuCalcResult`를 직접 받지 않고 `ComputedSajuFacts`와 feature placement를 통해 만들어진다.
- `SajuCalcResult`의 relation은 형, 파, 해를 포함하지 않는다.

### ComputedSajuFacts

사용 가능한 필드:

- `yearPillar`
- `monthPillar`
- `hourPillar`
- `dayPillar`
- `heavenlyStems`
- `earthlyBranches`
- `dayMaster`
- `fiveElementCounts`
- `excessiveElements`
- `missingElements`
- `tenGodSignals`
- `specialPatterns`
- `sinsal`
- `gwiin`

역할:

- V2 종합 리포트의 deterministic facts 입력.
- `buildComprehensiveReportV2ProfileTable`의 핵심 입력.

주의:

- `yearPillar`, `monthPillar`, `hourPillar`는 optional이다.
- 완전한 공통 만세력표에는 네 기둥 모두가 필요하므로 누락 정책이 필요하다.

### comprehensiveReportProfileTableBuilder

사용 가능한 구조:

- `buildComprehensiveReportV2ProfileTable`
- `buildPillarGrid`
- `buildSajuPillarGridColumns`

역할:

- V2 profile table을 만드는 deterministic builder.
- 공통 만세력표의 1차 확장 지점.

### fourPillarGrid

현재 필드:

- `columnId`
- `labelKo`
- `pillar`
- `heavenlyStem`
- `earthlyBranch`
- `tenGod`
- `hiddenStems`
- `twelveLifeStage`
- `twelveSinsal`
- `sinsal`
- `gwiin`

공통 만세력표에 필요한 보강 필드:

- `heavenlyStemReadingKo`
- `earthlyBranchReadingKo`
- `heavenlyStemElement`
- `earthlyBranchElement`
- `heavenlyStemTenGod`
- `earthlyBranchTenGod`
- `hiddenStemDetails`
- `relations`

### reports/[reportId] result page

현재 구조:

- V2 결과 화면에서 `renderV2ProfileTable`이 `profileTable.fourPillarGrid`를 표로 렌더링한다.
- 현재 row는 천간, 지지, 십성, 지장간, 십이운성, 십이신살, 신살, 귀인이다.
- 현재 천간/지지는 색상 chip helper가 일부 있으나 참고 이미지처럼 카드 구조는 아니다.

공통화 방향:

- 결과 페이지 내부 렌더링 함수를 상품 공통 컴포넌트로 분리한다.
- 먼저 data builder contract를 확정하고, 이후 UI 컴포넌트를 만든다.

## 9. Missing Data / Gaps

현재 데이터로 바로 가능한 필드:

- 시주/일주/월주/연주 컬럼
- 천간 한자
- 지지 한자
- 천간/지지 기본 십성 label
- 지장간 한자 목록
- 십이운성
- 십이신살
- 신살
- 귀인
- 오행 카운트 요약
- 천간/지지 오행 추론
- 천간/지지 한글 음 추론

부족하거나 보강이 필요한 필드:

- 천간/지지 카드 전용 structured field
- 지장간별 십성 표시
- 지장간별 오행 표시
- 원국 기준 형, 파, 해
- 합충형파해의 기둥별 structured placement
- `fourPillarGrid` 내 오행 token 필드
- `fourPillarGrid` 내 한글 음 필드
- 출생시간 모름일 때 시주 컬럼의 통일 표시 정책
- 무료 미리보기에서 일부 행을 숨길지 여부

보강 원칙:

- 표시 필드가 부족해도 임의 해석으로 채우지 않는다.
- `SajuCalcResult`, `ComputedSajuFacts`, `fourPillarGrid` 중 한 곳에서 deterministic하게 만들 수 있는 값만 추가한다.
- 원국 표의 품질은 모든 상품의 신뢰도를 좌우하므로, 보강 후 테스트 fixture가 필요하다.

## 10. Mobile UX Rules

모바일 원칙:

- 4열 표를 유지한다.
- 가로 스크롤을 기본 전제로 하지 않는다.
- 카드 안 텍스트는 최대 3단계로 제한한다.
- 한자 크기는 유지하되 보조 정보는 작게 둔다.
- 긴 신살/귀인 목록은 줄바꿈 또는 접힘 처리한다.
- 행 높이가 과하게 늘어나면 `+N` 요약을 사용한다.
- 무료 미리보기와 유료 리포트에서 같은 표를 재사용할 수 있어야 한다.

권장 모바일 구성:

- 상단 4기둥 label row
- 천간 카드 4개
- 지지 카드 4개
- 상세 rows는 compact table
- 신살/귀인과 합충형파해는 기본 compact, 펼침 가능

텍스트 과밀 방지:

- 카드 한 줄에는 한 정보만 둔다.
- 한자, 음, 십성, 오행을 같은 줄에 모두 넣지 않는다.
- 신살/귀인 목록은 셀 안에서 2줄까지만 기본 노출한다.
- 상세가 길면 행 단위 펼침을 우선한다.

## 11. Reuse Policy

공통 만세력표는 다음 상품에 기본 포함한다.

- 사주×MBTI 종합 리포트
- 직업/커리어 리포트
- 연애/결혼 리포트
- 궁합 리포트
- 대운 리포트
- 세운 리포트

재사용 기준:

- 표의 컬럼, 행, 카드 필드는 상품별로 바꾸지 않는다.
- 상품별 차이는 표 아래에 붙는 해석표에서 처리한다.
- 궁합 상품은 각 사람별 공통 만세력표를 각각 제공하고, 그 아래에 궁합 전용 비교표를 둔다.
- 대운 상품은 공통 만세력표 아래에 대운표를 둔다.
- 세운 상품은 공통 만세력표 아래에 세운표를 둔다.
- MBTI가 포함된 상품은 공통 만세력표 아래에 MBTI 성향표를 둔다.

무료/유료 정책:

- 공통 만세력표 자체는 무료 미리보기에도 사용할 수 있다.
- 유료 리포트에서는 상세 rows와 펼침 정보를 더 많이 제공할 수 있다.
- 유료 전용 해석 문장과 계산 facts table은 구분한다.

## 12. Implementation Order

추천 구현 순서:

1. 공통 만세력표 data contract를 `fourPillarGrid` 확장 기준으로 확정한다.
2. 천간/지지 한글 음, 오행 token, 오행 label, 카드용 십성 필드를 deterministic builder에서 만든다.
3. 원국 relation placement를 만든다.
4. 현재 가능한 합, 충을 먼저 연결한다.
5. 형, 파, 해를 원국 relation builder에 보강할지 별도 task로 결정한다.
6. 지장간 상세를 structured field로 보강한다.
7. 기존 결과 페이지의 V2 표를 공통 컴포넌트로 분리한다.
8. 모바일 4열 카드 UI를 구현한다.
9. 종합 리포트에 먼저 적용한다.
10. 직업, 연애/결혼, 궁합, 대운, 세운 상품에 동일 컴포넌트를 연결한다.
11. fixture 기반 visual/data regression test를 추가한다.

## 13. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- 계산 엔진 수정
- 대운 계산 엔진 구현
- 결제/Supabase/Toss 수정
- MBTI source JSON 수정
- 새 source JSON 생성
