# Compatibility Table Spec

## 1. Purpose

궁합 표는 궁합 리포트 상단에서 A/B 각자의 기본 facts와 두 사람의 연결 구조를 한 번에 보여주는 표 시스템이다.

목적은 다음과 같다.

- A와 B의 만세력표를 각각 독립적으로 보여준다.
- A와 B의 MBTI 성향표를 각각 독립적으로 보여준다.
- 두 사람 사이의 명리 연결, MBTI 관계, 조율 포인트를 중간 연결/궁합 요약표로 보여준다.
- 궁합을 연애/결혼 전용이 아니라 모든 관계 궁합 상품군으로 확장한다.
- 표 데이터는 writer 문장이 아니라 deterministic compatibility evidence와 MBTI relation source에서 만든다.

궁합 표는 관계의 성공/실패를 판정하지 않는다. 점수와 요약은 두 사람의 구조에서 잘 맞는 지점과 조정이 필요한 지점을 보기 쉽게 정리하는 참고값이다.

## 2. Compatibility Categories

확정 궁합 카테고리:

- 연애 궁합
- 결혼 궁합
- 부모·자식 궁합
- 직장 동료 궁합
- 상사·부하 궁합
- 사업/협업 궁합
- 친구/인간관계 궁합

현재 런타임 relationship type과의 1차 매핑:

| Product category | Runtime relationship type | Policy |
| --- | --- | --- |
| 연애 궁합 | `love` | 1차 직접 지원 |
| 결혼 궁합 | `marriage` | 1차 직접 지원 |
| 부모·자식 궁합 | `family` | 1차는 가족 궁합으로 지원, 2차에서 부모·자식 세분화 |
| 직장 동료 궁합 | `business_work_partner` | 1차는 업무/협업 궁합으로 지원, 2차에서 동료 세분화 |
| 상사·부하 궁합 | `business_work_partner` | 1차는 업무/협업 궁합으로 지원, 2차에서 위계 관계 세분화 |
| 사업/협업 궁합 | `business_work_partner` | 1차 직접 지원 |
| 친구/인간관계 궁합 | `friendship` | 1차는 친구 관계로 지원, 2차에서 일반 인간관계 세분화 |

참고:

- 현재 코드에는 `some`도 존재한다.
- `some`은 연애 전 단계 상품 또는 연애 궁합 내부 옵션으로 유지한다.
- 이 문서의 상품군 기준 카테고리는 위 7개로 고정한다.

## 3. Top Layout

궁합 리포트 상단 표 구조:

1. A 만세력표
2. A MBTI표
3. 중간 연결/궁합 요약표
4. B 만세력표
5. B MBTI표

배치 원칙:

- A/B 각각의 개인 표를 먼저 보여주고, 연결표는 두 사람의 관계를 해석하는 중간 layer로 둔다.
- A/B 표는 공통 만세력표와 공통 MBTI표의 구조를 그대로 재사용한다.
- 중간 연결/궁합 요약표는 두 사람의 facts를 섞어 만든 별도 표다.
- 중간 연결표는 writer가 새로 쓰는 문장이 아니라 compatibility evidence adapter 결과를 기준으로 한다.

권장 화면 순서:

- 궁합 리포트 header
- 관계 카테고리 badge
- A 만세력표
- A MBTI표
- 중간 연결/궁합 요약표
- B 만세력표
- B MBTI표
- 궁합 본문 accordion

## 4. A Person Tables

A 개인 표는 공통 만세력표와 공통 MBTI표를 그대로 사용한다.

### A 만세력표

기준:

- `MANSE_RYEOK_COMMON_TABLE_SPEC.md`의 공통 만세력표 구조를 사용한다.

표시:

- 제목: `{A 이름}님의 만세력`
- 컬럼: 시주 / 일주 / 월주 / 연주
- 행: 천간 / 지지 / 지장간 / 십이운성 / 십이신살 / 신살·귀인 / 합충형파해
- 천간/지지 카드: 한자, 한글 음, 십성, 오행 색상

출생시간 모름:

- 시주 컬럼은 유지한다.
- 값은 `모름` 또는 `-`로 표시한다.
- 시주 기반 궁합 해석의 confidence는 낮춘다.

### A MBTI표

기준:

- `MBTI_COMMON_PROFILE_TABLE_SPEC.md`의 공통 MBTI 성향표 구조를 사용한다.

표시:

- type header
- 선호 지표 비교
- 기능 서열
- 핵심 요약
- 궁합 리포트 활용 포인트

A의 MBTI가 없으면:

- MBTI표를 숨기거나 `MBTI 미입력` 상태로 표시한다.
- 중간 연결표의 MBTI connection confidence를 낮춘다.

## 5. B Person Tables

B 개인 표도 A와 동일한 구조를 사용한다.

### B 만세력표

표시:

- 제목: `{B 이름}님의 만세력`
- 컬럼: 시주 / 일주 / 월주 / 연주
- 행과 카드 필드는 A 만세력표와 동일하다.

정책:

- A/B 표의 구조와 필드 순서는 동일해야 한다.
- 한쪽만 출생시간을 모르는 경우에도 양쪽 표 레이아웃은 무너지지 않아야 한다.
- 차이는 데이터 상태와 confidence note로만 표현한다.

### B MBTI표

표시:

- type header
- 선호 지표 비교
- 기능 서열
- 핵심 요약
- 궁합 리포트 활용 포인트

정책:

- A/B MBTI표의 구조는 동일하다.
- 한쪽 MBTI가 없는 경우 입력된 쪽의 MBTI만 보조 참고로 사용한다.
- MBTI 후보 유형 추천은 하지 않는다.

## 6. Connection Summary Table

중간 연결/궁합 요약표는 A/B 개인 facts를 관계 단위로 변환한 표다.

필수 필드:

| Field | Meaning |
| --- | --- |
| `relationCategory` | 연애/결혼/부모·자식/직장 동료/상사·부하/사업·협업/친구·인간관계 |
| `compatibilityHeadline` | 관계를 한 줄로 요약하는 headline |
| `overallTone` | 전체 궁합의 분위기와 조율 방향 |
| `myeongliConnectionSummary` | 명리 연결 요약 |
| `mbtiConnectionSummary` | MBTI 관계 요약 |
| `dayMasterRelation` | A/B 일간 관계 |
| `dayBranchRelation` | A/B 일지/배우자궁 또는 핵심 지지 관계 |
| `elementBalance` | 두 사람 오행의 보완/과중/부족 |
| `tenGodRelation` | 서로에게 보이는 십성 관계 |
| `interactionLabels` | 삼합/반합/육합/충/형/파/해 등 label |
| `sharedStrengths` | 함께 잘 작동하는 지점 |
| `frictionPoints` | 반복 충돌 가능 지점 |
| `repairStrategy` | 오늘부터 쓸 조율 전략 |
| `timingNotes` | 거리, 속도, 결정 타이밍, 회복 타이밍 note |

추가 표시 후보:

- total score
- score label
- score caution
- score breakdown
- birth time confidence
- MBTI confidence
- warning notes

score breakdown:

- attraction
- communication
- lifestyleRhythm
- conflictRecovery
- longTermStability
- growthComplement

표시 원칙:

- score는 성공/실패 판정이 아니다.
- `compatibilityHeadline`은 단정 대신 관계의 작동 방식을 말한다.
- `repairStrategy`는 추상 조언이 아니라 행동 규칙으로 쓴다.
- `timingNotes`는 연애뿐 아니라 가족, 업무, 친구 관계에도 맞는 언어로 바꾼다.

## 7. Required Fields

### Common payload

- `productType`
- `productVersion`
- `relationCategory`
- `relationshipType`
- `personA`
- `personB`
- `personAChartSummary`
- `personBChartSummary`
- `score`
- `warnings`

### Person table payload

- `displayName`
- `birthTimeConfidence`
- `pillars`
- `dayMaster`
- `dayPillar`
- `featureLabels`
- `mbti`
- `manseTableData`
- `mbtiProfileTableData`

### Connection summary payload

- `relationCategory`
- `relationshipType`
- `compatibilityHeadline`
- `overallTone`
- `myeongliConnectionSummary`
- `mbtiConnectionSummary`
- `dayMasterRelation`
- `dayBranchRelation`
- `elementBalance`
- `tenGodRelation`
- `interactionLabels`
- `sharedStrengths`
- `frictionPoints`
- `repairStrategy`
- `timingNotes`
- `scoreSummary`
- `confidenceWarnings`

### Current gaps

- 궁합 전용 A/B 만세력 table adapter가 아직 없다.
- 궁합 전용 A/B MBTI profile table adapter가 아직 없다.
- 중간 연결/궁합 요약표 전용 `CompatibilityTableData` 타입이 아직 없다.
- 부모·자식, 직장 동료, 상사·부하, 친구/인간관계의 세분화 relationship type은 아직 없다.
- MBTI source DB의 notable pair를 runtime에서 직접 읽는 adapter가 아직 없다.
- 궁합 상단 표 UI 컴포넌트가 아직 없다.

## 8. Myeongli Data Mapping

현재 주요 source:

- `CompatibilityEvidencePacket`
- `personAChartSummary`
- `personBChartSummary`
- `CompatibilitySajuBridgeResult`
- `CompatibilityDeepSajuBridgeResult`
- `CompatibilityScoreResult`

매핑:

| Table field | Current source |
| --- | --- |
| A 이름 | `personAChartSummary.displayName` |
| B 이름 | `personBChartSummary.displayName` |
| A 원국 | `personAChartSummary.pillars` |
| B 원국 | `personBChartSummary.pillars` |
| A 일간 | `personAChartSummary.dayMaster` |
| B 일간 | `personBChartSummary.dayMaster` |
| A 일주 | `personAChartSummary.dayPillar` |
| B 일주 | `personBChartSummary.dayPillar` |
| 주요 사주 label | `featureLabels` |
| 출생시간 confidence | `birthTimeConfidence` |
| 명리 연결 요약 | `sajuBridge` |
| 일간 관계 | `deepSajuBridge.notes[layer=day_master_relation]` |
| 십성 관계 | `deepSajuBridge.notes[layer=cross_ten_god]` |
| 오행 밸런스 | `deepSajuBridge.notes[layer=combined_element_climate]`, `element_complement` |
| 지지 삼합/반합/육합 | `deepSajuBridge.notes[layer=branch_trine]` |
| 지지 충/해/형/파 | `deepSajuBridge.notes[layer=branch_clash]`, `branch_harm` |
| 일지/배우자궁 관계 | `deepSajuBridge.notes[layer=spouse_palace]` |
| 월지/생활 리듬 | `deepSajuBridge.notes[layer=month_rhythm]` |
| 시지/후반 리듬 | `deepSajuBridge.notes[layer=hour_life_rhythm]` |
| score | `score.totalScore`, `score.breakdown`, `score.scoreLabel`, `score.scoreCaution` |

중간 연결표에 사용할 deep note 필드:

- `layer`
- `title`
- `summary`
- `relationLabel`
- `emotionalMeaning`
- `practicalMeaning`
- `principleExplanation`
- `relationshipTranslation`
- `positiveExpression`
- `riskExpression`
- `everydayScene`
- `actionRule`
- `plainKoreanSummary`

정책:

- 사용자 표에는 diagnostic-only feature를 노출하지 않는다.
- `백호대살` 같은 diagnostic-only term은 표와 본문에서 모두 제외한다.
- 출생시간 모름으로 시주 layer confidence가 낮으면 중간 연결표에서 명시한다.

## 9. MBTI Relation Data Mapping

MBTI relation matrix source:

- `docs/product/mbti/source/*.json`
- `relationshipHints.notablePairs`

notable pair 필드:

- `withType`
- `label`
- `sourceRelationName`
- `sourceCoverage`
- `sharedGround`
- `friction`
- `positiveInfluence`
- `lovePattern`
- `marriagePattern`
- `repairStrategy`
- `reportLine`

중간 연결표에서 사용할 필드:

| Table field | MBTI source |
| --- | --- |
| MBTI relation label | `label` |
| MBTI source relation | `sourceRelationName` |
| source coverage | `sourceCoverage` |
| `sharedGround` | `sharedGround` |
| `friction` | `friction` |
| `positiveInfluence` | `positiveInfluence` |
| `lovePattern` | `lovePattern` |
| `marriagePattern` | `marriagePattern` |
| `repairStrategy` | `repairStrategy` |
| `reportLine` | `reportLine` |

현재 runtime bridge source:

- `CompatibilityMbtiBridgeResult`

runtime bridge 필드:

- `pairLabel`
- `sharedTraits`
- `complementaryTraits`
- `frictionRisks`
- `communicationNotes`
- `conflictRecoveryNotes`
- `evidenceItems`

결정:

- 궁합 표의 MBTI relation SSOT는 source DB의 `relationshipHints.notablePairs`로 둔다.
- 현재 runtime bridge는 기존 궁합 writer evidence로 유지한다.
- 1차 구현에서 source DB adapter를 만들어 `notablePairs`를 table data로 변환한다.
- source DB에 pair가 없거나 `sourceCoverage`가 낮은 경우 runtime bridge 결과로 fallback한다.

## 10. Category-Specific Emphasis

### 연애/결혼

강조 필드:

- attraction
- communication
- lifestyleRhythm
- conflictRecovery
- longTermStability
- dayBranchRelation
- lovePattern
- marriagePattern
- repairStrategy

문장/표 label:

- 감정 온도
- 데이트 리듬
- 생활 합
- 갈등 회복
- 장기 안정성
- 역할 분담

금지:

- 반드시 결혼
- 무조건 헤어짐
- 배우자복 없다

### 부모·자식

강조 필드:

- communication
- lifestyleRhythm
- conflictRecovery
- growthComplement
- month_rhythm
- family tone
- repairStrategy

문장/표 label:

- 말의 통로
- 생활 리듬
- 역할 경계
- 정서 반응
- 기대와 독립성
- 돌봄과 거리

금지:

- 부모복 없다
- 자식복 없다
- 가족 관계가 망했다
- 효도/불효 낙인

### 직장 동료/상사·부하

강조 필드:

- communication
- lifestyleRhythm
- conflictRecovery
- longTermStability
- tenGodRelation
- business_work_partner tone
- timingNotes

문장/표 label:

- 업무 리듬
- 의사결정
- 피드백 방식
- 역할 분담
- 권한과 책임
- 보고/검토 타이밍

상사·부하 세부 강조:

- 지시 방식
- 승인/검토 속도
- 책임 경계
- 평가 피로
- 말의 위계

금지:

- 직장운 망함
- 절대 같이 일하면 안 됨
- 상사복 없다
- 부하복 없다

### 사업/협업

강조 필드:

- longTermStability
- growthComplement
- money_lifestyle
- elementBalance
- tenGodRelation
- repairStrategy
- timingNotes

문장/표 label:

- 역할/지분/권한
- 돈과 자원
- 리스크 관리
- 결정권
- 기록과 계약
- 피드백 규칙

금지:

- 사업 망함
- 반드시 성공
- 돈복 없다
- 투자 자문식 표현

### 친구/인간관계

강조 필드:

- communication
- lifestyleRhythm
- conflictRecovery
- sharedGround
- friction
- positiveInfluence
- repairStrategy

문장/표 label:

- 대화 리듬
- 거리감
- 도움 방식
- 오해 회복
- 오래 가는 편안함
- 서로 자극되는 지점

금지:

- 절대 안 맞음
- 손절해야 함
- 인간관계운 망함

## 11. Safety And Forbidden Expressions

궁합 금지 표현:

- 무조건 헤어짐
- 절대 안 맞음
- 반드시 결혼
- 천생연분 확정
- 이별 확정
- 이혼 확정
- 배우자복 없다
- 부모복 없다
- 자식복 없다
- 직장운 망함
- 사업 망함
- 같이 하면 망한다
- 100% 맞다
- 운명이다

안전 정책:

- 궁합은 성공/실패 판정이 아니다.
- 점수는 조율 구조를 보기 쉽게 만든 참고값이다.
- 관계 카테고리별 언어를 섞지 않는다.
- 연애/썸에는 업무 용어를 쓰지 않는다.
- 업무/협업에는 로맨스 용어를 쓰지 않는다.
- 가족 궁합에는 가족, 생활, 정서, 역할 경계 언어를 쓴다.
- 명리 용어는 생활 언어로 번역한다.
- MBTI는 진단이 아니라 자기보고 성향으로만 사용한다.
- 입력되지 않은 MBTI 후보를 추천하지 않는다.

## 12. Mobile UX Rules

- A/B 개인 표는 세로로 쌓는다.
- 중간 연결/궁합 요약표는 A/B 표 사이에 둔다.
- 모바일에서 A/B를 좌우 비교로 강제하지 않는다.
- 공통 만세력표의 4열 구조는 유지한다.
- 공통 MBTI표의 선호 지표 4행 구조는 유지한다.
- 중간 연결표의 score breakdown은 compact bar 또는 짧은 row로 표시한다.
- 긴 명리 연결 요약은 접힘 처리한다.
- `sharedStrengths`, `frictionPoints`, `repairStrategy`는 각 2~3개까지만 기본 노출한다.
- 더 긴 내용은 본문 accordion에서 다룬다.
- 고정 floating 버튼이 표를 가리지 않게 한다.

## 13. Reuse Policy

재사용:

- A/B 만세력표는 공통 만세력표 컴포넌트를 재사용한다.
- A/B MBTI표는 공통 MBTI 성향표 컴포넌트를 재사용한다.
- 중간 연결표는 궁합 전용 컴포넌트로 만든다.
- score breakdown label은 relationship category에 따라 바꾼다.

상품별 확장:

- 연애/결혼 상품은 궁합 연결표의 일부 필드를 재사용할 수 있다.
- 가족/부모·자식 상품은 family tone mapping을 재사용한다.
- 직장/사업 상품은 business_work_partner tone mapping을 재사용한다.
- 종합 리포트는 궁합표를 기본 포함하지 않는다.

데이터 재사용:

- `CompatibilityEvidencePacket`은 궁합 writer와 궁합 표 adapter가 함께 사용한다.
- MBTI relation source DB는 궁합 표와 궁합 writer bridge가 함께 사용한다.
- 궁합표는 writer draft의 `chartComparison` 문자열을 SSOT로 쓰지 않는다.

## 14. Implementation Order

추천 구현 순서:

1. `CompatibilityTableData` 타입 계약을 정의한다.
2. A/B `ManseRyeokCommonTableData` adapter 재사용 경로를 만든다.
3. A/B `MbtiCommonProfileTableData` adapter 재사용 경로를 만든다.
4. `relationshipHints.notablePairs` runtime adapter를 만든다.
5. `CompatibilityEvidencePacket`에서 중간 연결/궁합 요약표 data를 만드는 adapter를 만든다.
6. relation category와 runtime `relationshipType` mapping을 고정한다.
7. score breakdown label을 category별로 매핑한다.
8. `dayMasterRelation`, `dayBranchRelation`, `elementBalance`, `tenGodRelation`, `interactionLabels` 추출 rule을 만든다.
9. `sharedStrengths`, `frictionPoints`, `repairStrategy`, `timingNotes` 추출 rule을 만든다.
10. 부족한 category 세분화가 필요한지 fixture로 검증한다.
11. 궁합 상단 표 UI 컴포넌트를 만든다.
12. 모바일에서 A/B 표와 중간 연결표의 읽기 흐름을 visual QA한다.
13. 궁합 writer가 상단 표 데이터를 변경하지 못하도록 validator를 보강한다.
14. 부모·자식, 직장 동료, 상사·부하, 친구/인간관계 세분화는 별도 task에서 relationship type 확장 후 진행한다.

## 15. Non Goals

이번 단계에서 하지 않을 것:

- UI 구현
- `src` 수정
- writer 구현
- 계산 엔진 수정
- MBTI JSON 수정
- relation type 코드 확장
- 궁합 점수 알고리즘 수정
- 결제/Supabase/Toss 수정
- 커밋/푸시
