# MBTI Common Profile Table Spec

## 1. Purpose

공통 MBTI 성향표는 사용자가 입력한 MBTI 유형을 모든 결리포트 상품에서 동일한 구조로 보여주는 기본 성향 표다.

목적은 다음과 같다.

- 사용자가 자신의 MBTI 유형, 선호 지표, 기능 서열을 한 화면에서 바로 읽게 한다.
- 종합, 직업, 연애/결혼, 궁합, 대운, 세운 상품에서 같은 MBTI facts layer를 재사용한다.
- MBTI 해석 문장이 아니라 `docs/product/mbti/source/*.json`의 source DB와 deterministic adapter 결과를 기준으로 표시한다.
- 공통 만세력표 아래에 붙는 보조 성향 표로 사용하되, 상품별 리포트 활용 포인트만 각 상품 맥락에 맞게 선택한다.

공통 MBTI 성향표는 writer가 새로 만들어 내는 문장 영역이 아니다. 표에 표시되는 값은 source DB에 있거나 runtime adapter에서 고정 mapping으로 보강 가능한 값만 사용한다.

## 2. Reference Direction

참고 이미지에서 가져올 구조:

- `선호 지표의 비교` 블록을 둔다.
- E/I, S/N, T/F, J/P 네 축을 행 단위로 비교한다.
- 사용자의 유형에 해당하는 쪽을 시각적으로 강조한다.
- 각 축에는 한글명, 영문명, 짧은 키워드 설명을 표시한다.
- `기능의 서열` 블록을 둔다.
- 주 기능, 부 기능, 3차 기능, 열등 기능을 행 단위로 표시한다.
- 각 기능에는 `Te`, `Ni`, `Se`, `Fi` 같은 function code와 설명을 표시한다.
- 모바일에서도 축 비교와 기능 서열을 읽을 수 있게 한다.

결리포트식으로 바꿀 지점:

- 참고 이미지를 그대로 복제하지 않는다.
- 색은 선택된 지표와 기능 위계를 구분하는 보조 신호로만 사용한다.
- 상단에는 `type`, `titleKo`, `archetype`, `oneLine`을 먼저 보여준다.
- 선호 지표의 설명 문구는 source JSON에 없으므로 runtime adapter의 정적 mapping을 사용한다.
- 기능의 한글명, 태도, 영역, 짧은 설명도 source JSON에 없으므로 runtime adapter의 정적 mapping을 사용한다.
- 상품별 활용 포인트는 `reportUseCases`와 `traits`에서 가져오고, 공통 표 구조 자체는 상품별로 바꾸지 않는다.

## 3. Table Blocks

### Type header

표 상단의 유형 요약 영역이다.

표시 필드:

- `type`
- `titleKo`
- `archetype`
- `oneLine`

예시 구조:

- 큰 라벨: `ENFJ`
- 보조 제목: `titleKo`
- 짧은 정체성 문장: `archetype`
- 한 줄 요약: `oneLine`

### Preference axes comparison

사용자가 입력한 MBTI 유형의 네 가지 선호 지표를 비교한다.

행:

- E vs I
- S vs N
- T vs F
- J vs P

각 행은 양쪽 선택지 중 source DB의 `preferenceAxes` 값과 일치하는 쪽을 강조한다.

### Function stack table

사용자 유형의 기능 서열을 보여준다.

행:

- 주 기능
- 부 기능
- 3차 기능
- 열등 기능

각 행은 source DB의 `functionStack` code를 기준으로 하고, 기능 설명은 adapter mapping에서 가져온다.

### Core summary

유형의 핵심 요약을 짧게 보여준다.

표시 후보:

- `summary.identity`
- `summary.strength`
- `summary.risk`
- `summary.growthStrategy`

Core summary는 표 아래의 짧은 요약 블록으로 둔다. 긴 해석 문단으로 확장하지 않는다.

### Report usage notes

상품별 리포트에서 이 MBTI 유형을 어떻게 읽을지 보여주는 짧은 활용 포인트다.

source DB 기준 필드:

- `reportUseCases.generalReport`
- `reportUseCases.careerReport`
- `reportUseCases.loveMarriageChildReport`
- `reportUseCases.compatibilityReport`
- `reportUseCases.daeunReport`
- `reportUseCases.saeunReport`

상품별 화면은 자기 상품에 해당하는 `reportUseCases`만 선택한다. 공통 표의 선호 지표와 기능 서열 구조는 바꾸지 않는다.

## 4. Preference Axes Table

확정 행 구조:

| Axis key | Left | Right | Source value |
| --- | --- | --- | --- |
| `energy` | E | I | `preferenceAxes.energy` |
| `perception` | S | N | `preferenceAxes.perception` |
| `judgment` | T | F | `preferenceAxes.judgment` |
| `lifestyle` | J | P | `preferenceAxes.lifestyle` |

표시 방식:

- 행마다 좌우 선택지를 모두 보여준다.
- source value와 일치하는 선택지를 강조한다.
- 선택되지 않은 선택지도 흐리게 표시해 비교 맥락을 유지한다.
- 각 선택지는 `letter`, `nameKo`, `nameEn`, `keywordsKo`를 표시한다.

표시 mapping:

| Letter | nameKo | nameEn | keywordsKo |
| --- | --- | --- | --- |
| E | 외향 | Extrovert | 외부, 표현, 상호작용 |
| I | 내향 | Introvert | 내면, 생각, 집중 |
| S | 감각 | Sensing | 현실, 실용, 실천 |
| N | 직관 | iNtuition | 이상, 이론, 예측 |
| T | 사고 | Thinking | 논리, 사실 판단 |
| F | 감정 | Feeling | 관계, 가치 판단 |
| J | 판단 | Judging | 목적, 계획, 절차 |
| P | 인식 | Perceiving | 자율성, 유동성, 탐색 |

이 mapping은 source JSON에 추가하지 않는다. runtime adapter의 정적 display dictionary로 둔다.

## 5. Function Stack Table

확정 행 구조:

| Rank key | Label ko | Source value |
| --- | --- | --- |
| `dominant` | 주 기능 | `functionStack.dominant` |
| `auxiliary` | 부 기능 | `functionStack.auxiliary` |
| `tertiary` | 3차 기능 | `functionStack.tertiary` |
| `inferior` | 열등 기능 | `functionStack.inferior` |

표시 컬럼:

- 순서
- 기능 code
- 기능 한글명
- 설명
- 리포트 활용 포인트

기능 표시 mapping:

| Code | nameKo | attitude | domain | short description |
| --- | --- | --- | --- | --- |
| Te | 외향 사고 | 외향 | 사고 | 외부 기준, 성과, 구조화, 실행을 중시한다. |
| Ti | 내향 사고 | 내향 | 사고 | 내부 논리, 원리, 정확성, 분석을 중시한다. |
| Fe | 외향 감정 | 외향 | 감정 | 관계 온도, 조화, 반응 조율을 중시한다. |
| Fi | 내향 감정 | 내향 | 감정 | 내면 가치, 진정성, 개인의 기준을 중시한다. |
| Se | 외향 감각 | 외향 | 감각 | 현장 감각, 즉시성, 실제 경험을 중시한다. |
| Si | 내향 감각 | 내향 | 감각 | 기억, 축적 경험, 반복 가능한 기준을 중시한다. |
| Ne | 외향 직관 | 외향 | 직관 | 가능성, 변형 아이디어, 확장을 중시한다. |
| Ni | 내향 직관 | 내향 | 직관 | 방향성, 장기 패턴, 압축된 통찰을 중시한다. |

전체 기능 순서 표시:

- 1차 표에서는 source DB가 제공하는 네 기능을 `dominant -> auxiliary -> tertiary -> inferior` 순서로 표시한다.
- 8기능 전체 순서가 필요하면 source JSON을 바꾸지 말고 adapter의 16유형 deterministic mapping으로 별도 산출한다.
- 8기능 순서는 학파/모델 차이가 있으므로 UI 구현 전에 mapping rule과 fixture를 먼저 고정한다.

## 6. Required Fields

### Type header

- `type`
- `titleKo`
- `archetype`
- `oneLine`

### Preference axes comparison

Source DB 필드:

- `preferenceAxes.energy`
- `preferenceAxes.perception`
- `preferenceAxes.judgment`
- `preferenceAxes.lifestyle`

Adapter 필드:

- `axisKey`
- `left.letter`
- `left.nameKo`
- `left.nameEn`
- `left.keywordsKo`
- `right.letter`
- `right.nameKo`
- `right.nameEn`
- `right.keywordsKo`
- `selectedLetter`

### Function stack table

Source DB 필드:

- `functionStack.dominant`
- `functionStack.auxiliary`
- `functionStack.tertiary`
- `functionStack.inferior`

Adapter 필드:

- `rankKey`
- `rankLabelKo`
- `functionCode`
- `functionNameKo`
- `attitude`
- `domain`
- `shortDescription`
- `reportUsageNote`

### Core summary

- `summary.identity`
- `summary.strength`
- `summary.risk`
- `summary.growthStrategy`

### Traits core digest

공통 표의 1차 요약 후보:

- `traits.identity`
- `traits.thinkingStyle`
- `traits.strengths`
- `traits.risks`
- `traits.growth`

상품별 확장 후보:

- 직업/커리어: `traits.career`, `traits.workplace`
- 돈/투자: `traits.money`, `traits.investment`
- 학업: `traits.study`
- 연애/결혼/가족: `traits.love`, `traits.marriage`, `traits.parenting`, `traits.child`
- 궁합/관계: `traits.relationships`, `traits.communication`

trait item에서 사용할 수 있는 필드:

- `id`
- `label`
- `plainKo`
- `strongLine`
- `positiveUse`
- `risk`
- `matchingMyeongliSignals`
- `productDomains`
- `sourceCoverage`

## 7. Data Mapping

현재 확인한 source DB 구조:

- `docs/product/mbti/source/*.json`에는 16유형 파일이 있다.
- 유형 목록은 `ENFJ`, `ENFP`, `ENTJ`, `ENTP`, `ESFJ`, `ESFP`, `ESTJ`, `ESTP`, `INFJ`, `INFP`, `INTJ`, `INTP`, `ISFJ`, `ISFP`, `ISTJ`, `ISTP`다.
- 공통 top-level 필드는 `type`, `titleKo`, `archetype`, `oneLine`, `sourceStatus`, `preferenceAxes`, `functionStack`, `summary`, `traits`, `relationshipHints`, `myeongliBridgeHints`, `reportUseCases`를 포함한다.
- `traits`는 `identity`, `thinkingStyle`, `career`, `workplace`, `money`, `investment`, `study`, `love`, `marriage`, `parenting`, `child`, `relationships`, `communication`, `strengths`, `risks`, `growth` 영역을 포함한다.
- `reportUseCases`는 `generalReport`, `careerReport`, `loveMarriageChildReport`, `compatibilityReport`, `daeunReport`, `saeunReport`를 포함한다.

표 필드 매핑:

| Table field | Source |
| --- | --- |
| MBTI type | `type` |
| 유형 제목 | `titleKo` |
| 유형 원형 | `archetype` |
| 한 줄 요약 | `oneLine` |
| 선택된 E/I | `preferenceAxes.energy` |
| 선택된 S/N | `preferenceAxes.perception` |
| 선택된 T/F | `preferenceAxes.judgment` |
| 선택된 J/P | `preferenceAxes.lifestyle` |
| 주 기능 code | `functionStack.dominant` |
| 부 기능 code | `functionStack.auxiliary` |
| 3차 기능 code | `functionStack.tertiary` |
| 열등 기능 code | `functionStack.inferior` |
| 핵심 요약 | `summary` |
| traits 요약 | `traits.*` |
| 상품별 활용 포인트 | `reportUseCases.*` |

adapter 보강 매핑:

| Display need | Adapter source |
| --- | --- |
| E/I/S/N/T/F/J/P 한글명 | static preference display dictionary |
| E/I/S/N/T/F/J/P 영문명 | static preference display dictionary |
| E/I/S/N/T/F/J/P 짧은 키워드 | static preference display dictionary |
| 기능 한글명 | static function display dictionary |
| 기능 attitude | function code의 `e`/`i` 및 dictionary |
| 기능 domain | function code의 `T/F/S/N` 및 dictionary |
| 기능 짧은 설명 | static function display dictionary |
| 기능별 리포트 활용 포인트 | static function display dictionary 또는 product adapter |
| 8기능 전체 순서 | 16유형 deterministic mapping, 별도 fixture 필요 |

## 8. Missing Data / Gaps

현재 데이터로 바로 가능한 필드:

- `type`
- `titleKo`
- `archetype`
- `oneLine`
- 선택된 선호 지표 값
- 주 기능, 부 기능, 3차 기능, 열등 기능 code
- `summary`의 네 가지 요약
- `traits` 주요 영역
- 상품별 `reportUseCases`

부족한 필드:

- E/I/S/N/T/F/J/P 각각의 한글명, 영문명, 짧은 설명은 source JSON에 없다.
- 기능 code별 한글명, attitude, domain, 짧은 설명은 source JSON에 없다.
- 기능별 관계/상품 활용 note는 source JSON의 `functionStack`에 없다.
- 8기능 전체 순서는 source JSON에 없다.
- source DB를 runtime에서 직접 읽어 표 데이터로 바꾸는 adapter가 아직 없다.
- 표 전용 `MbtiCommonProfileTableData` 계약이 아직 없다.

결정안:

- source JSON은 수정하지 않는다.
- 선호 지표와 기능 설명은 runtime adapter의 정적 mapping table로 보강한다.
- 1차 구현은 4기능 stack을 기준으로 한다.
- 8기능 전체 순서를 반드시 보여줄 경우, 별도 task에서 16유형 mapping rule과 fixture를 먼저 고정한다.

## 9. Mobile UX Rules

- 선호 지표 비교는 모바일에서도 E/I, S/N, T/F, J/P 네 행을 유지한다.
- 각 행은 좌우 비교 구조를 유지하되, 긴 설명은 줄바꿈한다.
- 선택된 축은 배경, border, weight 중 2개 이하의 신호로만 강조한다.
- 기능 서열은 모바일에서 표가 좁아지면 `순서 + code`를 왼쪽에 고정하고 설명을 아래로 줄바꿈한다.
- 기능 설명은 한 행에서 과밀하게 보이지 않도록 짧은 설명을 기본으로 표시한다.
- 긴 report usage note는 접힘 처리하거나 상품별 섹션에서 별도로 보여준다.
- 색상은 선택 상태와 위계를 전달하는 용도로만 사용하고, 참고 이미지의 색/톤을 그대로 복제하지 않는다.
- 무료 미리보기와 유료 리포트에서 같은 데이터 계약을 사용한다.

## 10. Reuse Policy

- 모든 상품은 사용자가 MBTI를 입력한 경우 공통 MBTI 성향표를 사용할 수 있다.
- 공통 만세력표가 있는 상품에서는 만세력표 아래에 MBTI 성향표를 배치한다.
- MBTI를 입력하지 않은 사용자는 공통 표를 숨기거나 입력 유도 상태로 처리한다.
- 종합 리포트는 `generalReport` 활용 포인트를 사용한다.
- 직업/커리어 리포트는 `careerReport`, `traits.career`, `traits.workplace`를 우선 사용한다.
- 연애/결혼/자녀 리포트는 `loveMarriageChildReport`, `traits.love`, `traits.marriage`, `traits.parenting`, `traits.child`를 우선 사용한다.
- 궁합 리포트는 각 사용자별 공통 MBTI 성향표를 먼저 보여주고, 두 유형의 관계 해석은 별도 궁합 표에서 다룬다.
- 대운 리포트는 `daeunReport`를 사용하되, 대운 계산/해석 표와 MBTI 표의 데이터 계약을 섞지 않는다.
- 세운 리포트는 `saeunReport`를 사용하되, 세운 계산/해석 표와 MBTI 표의 데이터 계약을 섞지 않는다.

## 11. Implementation Order

추천 구현 순서:

1. `docs/product/mbti/source/*.json`을 읽는 runtime adapter의 입력/출력 계약을 먼저 정의한다.
2. `MbtiCommonProfileTableData` 타입을 정의한다.
3. 선호 지표 display dictionary를 만든다.
4. 기능 display dictionary를 만든다.
5. source DB의 `type`, `preferenceAxes`, `functionStack`, `summary`, `traits`, `reportUseCases`를 표 데이터로 변환하는 adapter를 만든다.
6. 16유형 fixture로 adapter 결과를 검증한다.
7. 공통 MBTI 성향표 UI 컴포넌트를 만든다.
8. 종합 리포트에 먼저 연결한다.
9. 직업, 연애/결혼, 궁합, 대운, 세운 상품에 같은 컴포넌트를 순차 연결한다.
10. 8기능 전체 순서가 필요하면 별도 task에서 mapping rule, fixture, UI 표현을 추가한다.

## 12. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- MBTI JSON 수정
- writer 구현
- 결제/Supabase/Toss 수정
