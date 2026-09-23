# ANNUAL-MONTH-RELATION-FACTS-QUALITY-P0-01

기준: master `aefa854`, 2026-09-23. 로컬 deterministic generation + mock writer + SSR만 사용. 운영 DB/실제 provider/배포 접근 없음.

## 원인과 수정 경로

이전: `getAnnualMonthGanjiInfo` → 실제 오행/지지 관계 계산 → `natalInteractionSummary`로 합침 → `/충|해|형|파/`, `/보완|합|반합|삼합|육합/`로 설명 재분류 → 같은 설명을 support/friction에 삽입 → draft와 세운표에서 재조립.

이후: 기존 월간지/지지 엔진 → `AnnualMonthRelationFact[]` → `classifyAnnualMonthFacts` → `buildAnnualMonthlyPublication` → evidence-aware validator/publish gate → fact별 설명 한 번 렌더.

`부족 오행 직접 보완 약함 / 뚜렷한 지지 충·합·해는 약함` 및 부정문 6종은 사실을 만들지 않는다. 계산된 충은 설명에 ‘충’이 없어도 friction이다. MBTI 변경은 월별 명리 사실에 영향을 주지 않는다.

## 구조화 계약

- 사실: ID, source, type, 월지, 참여 지지, 원국 위치 또는 오행/유입 오행. 사실 객체는 월별 relationFacts에 한 번 저장한다.
- 분류: supportFactIds/frictionFactIds로 참조. 양쪽이 실제 서로 다른 사실을 가질 때 mixed, 모두 없으면 neutral.
- 부재: no_natal_branch_relation/no_missing_element_present/no_heavy_element_pressure. 존재·강도·길흉으로 바꾸지 않는다.
- 설명: 실제 fact 타입별로 생성한다. 기존 supportSignals/frictionSignals는 호환용 표시 문자열이며 분류의 입력이 아니다. writer payload에서는 이 복제 문자열을 제외하고 seed에는 fact ID를 전달한다.
- 같은 지지 관계가 여러 원국 위치에서 나타나면 한 ID와 affectedPillars 목록으로 합친다. 같은 과다 오행에 직접/생성 작용이 겹치면 기존 의미대로 한 압력 대상으로 보존하며 관련 월 오행을 남긴다.
- 강도/방향 수치를 새로 만들지 않는다. ‘보조/마찰’은 기존 제품 해석의 분류이며 한 달의 총 길흉 점수가 아니다.
- 십성/오행/월간지/basis는 별도로 유지한다. 십성 자체를 긍정/부정 분류하지 않는다.

| 현재 계산 | 상태 |
|---|---|
| 원국 지지 × 월지: 육합·삼합·반합·충·형·파·해 | AVAILABLE, 기존 `getAnnualBranchInteractions` 재사용 |
| 부족 오행의 월간지 유입 | AVAILABLE, 계산된 ElementLabel의 정확한 매핑 |
| 과다 오행 직접 유입/상생 자극 | AVAILABLE, 기존 element rule 재사용 |
| 일간 기준 월간/월지 본기 십성 | AVAILABLE |
| 월간 × 원국 천간의 합충 | NOT AVAILABLE |
| 세운 × 월간지의 별도 관계 | NOT AVAILABLE; 연간은 월간지 배정의 입력일 뿐 |
| 대운 × 월간지의 별도 관계 | NOT AVAILABLE; 기존 대운×세운 관계와 구분 |
| 원진·귀문, 관계 강도 점수 | NOT AVAILABLE; 이번 작업에서 추가하지 않음 |

## 생성, writer, gate, renderer

월별 사실표와 분기 요약(`monthlyFlow`, `monthlyHighlights`, `monthlyFlowReading`)은 서버가 소유한다. writer에는 확정된 monthlyPublication과 구조화 근거를 제공하고 동일 값을 요구한다. 나머지 세운 문장은 기존 writer 계약을 유지한다. 이 방식은 자연어 전체를 NLP로 판정하는 대신 핵심 월별 문장을 근거에 고정한다.

validator는 선택 연도, 12개월 순서/간지/십성, fact ID/참여자/분류/부재, 표시 문자열을 기존 엔진으로 다시 만든 값과 대조한다. 핵심 월별 원고는 기존 sanitize 규칙 적용 후 비교한다. 정상 mock은 통과하고 없는 합충, 반대 분류, 중립 월의 강한 충돌, 틀린 연도는 거부한다. writer의 targetYear를 임의로 덮어써 오류를 숨기던 경로도 없앴다.

JSON object key 순서는 비교하지 않는다. 저장소의 키 순서 변경은 허용하지만 배열의 월/참여자 순서와 내용은 검증한다. 구조가 없는 malformed evidence는 fail closed한다. 계산기/달력/대운을 조회 중 다시 실행하거나 외부에 호출하지 않는다.

세운표는 support/friction 설명을 합치지 않고 relationFacts를 한 번씩 렌더한다. evidence 없는 진단용 렌더도 관계 설명을 주의 행에 재출력하지 않는다. 화면 layout은 유지했다. 월별 body와 분기 요약은 실제 간지·십성·해석 관점을 포함한다. 오행/길흉에 대한 반복 주의문은 공통 월운 안내로 모았다. 영역별 본문은 연간 lifeAreaSignals/difficultySignals를 사용하므로 월별 사실을 여러 영역의 새 사실로 복제하지 않는다. 연간 본문 전체는 재작성하지 않았다.

원문→명리 사실 분류 검색 결과: 월별 classifier의 설명문 검색 0. 남은 includes 검색은 계산된 label을 표시하는 기존 formatter, 품질 단어 검사, 지지 이름 검사다. 다른 상품 formatter의 표현 품질 전체를 검증했다는 뜻은 아니다. 개발 preview/smoke의 구형 조립 코드는 기존 API의 표시 문자열을 사용하며 새 사실을 추론하지 않는다.

## 측정 방법

고정 시계: 2026-09-23 KST, selectedYear=2026. 기존 deterministic 테스트 고객 재사용: A(1996-12-06 14:15 남/ENTJ), B(1980-05-15 09:30 여/ISFJ), C(2001-08-20 16:20 남/ENFP). 실제 고객 DB 데이터가 아니다.

Before는 수정 전 HEAD에서 생성해 저장한 audit 결과다. After는 같은 입력의 fallback → validate → publish gate → SSR이다. 40자 이상 문장은 월별 draft의 관계 요약/body/advice에서 문장부호로 분리한 exact 문장이다. 반복 수는 첫 출현 이후 횟수다. 전체 SSR은 태그/엔티티를 제거하고 공백을 합친 글자 수다. 월별 SSR은 기존 SaeunMonthlyHalfTable의 각 행을 동일 component로 따로 렌더한 값(공통 표 라벨 포함)이다. 수집용 임시 파일은 commit하지 않는다.

| 지표(36개월) | Before | After |
|---|---:|---:|
| 설명 검색에 의한 분류 판단 | 72 | 0 |
| support가 있는 월 | 36 | 30 |
| 실제 support가 없는데 있다고 한 월 | 6 | 0 |
| friction이 있는 월 | 29 | 36 |
| 실제 friction이 없는데 있다고 한 월 | 0 | 0 |
| 실제 pressure를 놓친 월 | 7 | 0 |
| 동일 설명이 support/friction 양쪽에 중복된 월 | 29 | 0 |
| 실제 support-only / friction-only / neutral / mixed | — | 0 / 6 / 0 / 30 |
| 고객별 publish gate | 3/3 | 3/3 |

이 고객 집합은 계산된 과다 오행/지지 관계 때문에 36개월 모두 friction 사실이 있다. 이를 억지로 줄이지 않았다. 중립/부재와 support-only 사례는 별도의 고정 구조화 fixture로 검증한다. 부정문만으로 잘못 만든 마찰은 해당 fixture에서 0이다.

| 고객 | 전체 SSR 전→후 | 월별 SSR 전→후 범위 | 고유 40자+ 문장 전→후 | 중복 장문 전→후 |
|---|---:|---|---:|---:|
| 고객A | 12783 → 14351 | 288~333 → 302~461 | 34 → 53 | 2 → 0 |
| 고객B | 12061 → 13196 | 209~330 → 171~459 | 32 → 46 | 2 → 0 |
| 고객C | 12258 → 13535 | 206~325 → 188~436 | 31 → 47 | 2 → 0 |

12개월 모두에서 반복된 40자 이상 동일 문장은 전/후 모두 0. 한 달의 근거가 적을 때 표가 짧아지는 것은 허용하되, 전체 고객별 SSR 정보량은 줄이지 않았다. 위 글자 수는 문학적 품질 점수가 아니다.

### 36개월 실제 사실 분포

S/F/N은 support fact 수/friction fact 수/absence observation 수다. N은 실제 관계로 세지 않는다.

| 월/간지 | A S/F/N | B S/F/N | C S/F/N |
|---|---|---|---|
| 1월 庚寅 | 3/3/0 | 1/6/0 | 0/6/1 |
| 2월 辛卯 | 3/3/0 | 1/3/0 | 0/2/2 |
| 3월 壬辰 | 1/3/1 | 1/1/1 | 3/3/0 |
| 4월 癸巳 | 1/4/1 | 1/3/1 | 2/3/0 |
| 5월 甲午 | 2/4/0 | 1/2/0 | 0/2/1 |
| 6월 乙未 | 2/5/0 | 1/3/0 | 2/2/0 |
| 7월 丙申 | 2/4/0 | 2/4/1 | 1/3/1 |
| 8월 丁酉 | 2/4/0 | 1/3/1 | 1/2/1 |
| 9월 戊戌 | 0/4/1 | 0/1/2 | 2/1/0 |
| 10월 己亥 | 1/3/1 | 0/3/1 | 3/4/0 |
| 11월 庚子 | 2/2/0 | 1/1/1 | 2/3/0 |
| 12월 辛丑 | 2/4/0 | 2/1/1 | 2/1/0 |

## 정밀도와 남은 P1

- `calendar_month_approximation` 유지. 기존 선택 연간별 첫 월간을 정하고 순차 배정하며, 1~12월 슬롯의 지지는 寅~丑이다. 해당 Gregorian 월의 실제 절입 instant 전후를 판정한 정밀 월주가 아니다. `solar_term_exact`로 승격하지 않았다.
- 후속 품질 작업: 실제 절입 기반 월운, 세운×월/대운×월 관계의 검증된 계산, 실제 근거에 기반한 중요 월 밀도. 현재 사용할 수 있는 후보는 관계 종류/개수, 원국 위치, 부족/과다 유입, 십성이다. 강도 점수/우선순위 알고리즘은 이번에 만들지 않았다.
- 월별 핵심 영역 이외의 모든 자유 서술에 대해 자연어 의미를 완전 검증한다고 주장하지 않는다. 월별 주장을 다른 섹션에 추가하지 않도록 writer 계약을 명시했다.
- 기존 월별 구조화 사실이 없는 저장본은 새 publish gate와 호환되지 않는다. 운영 데이터는 조회하지 않았으며 자동 backfill/삭제하지 않았다. 배포 전 기존 세운 snapshot 존재 여부와 호환성은 별도 확인해야 한다.
- 기존 annual preview/smoke snapshot의 구형 월별 표시문은 유료 publish 허용 근거로 사용하지 않는다. 실제 paid handler와 worker는 새 공통 월별 publication을 사용한다.

## 변경/검증 범위

- 계산된 월별 사실: `annualMonthRelationFacts.ts`, `annualFortuneEvidence.ts`
- 월별 원고/검증: `annualMonthlyPublication.ts`, `annualFortuneGenerationHandler.ts`, `annualFortuneReportDraftValidator.ts`, `productPublishGate.ts`
- writer: `openaiAnnualFortuneReportWriter.ts`, `openaiAnnualFortuneReportWriterPrompt.ts`
- 표시: `AnnualFortuneReportView.tsx` (UI 구조 변경 없음)
- 테스트: `annualMonthlyRelationFacts.test.tsx`, 기존 annual writer/prompt 테스트 2개
- 문서: 본 파일

검증: `pnpm test` 347개 파일/3,088개 테스트 PASS, `pnpm lint` PASS, `pnpm build` PASS, `git diff --check` PASS. `pnpm exec tsc --noEmit`는 기존 test-only 388건에서 387건으로 감소(관련 writer mock fixture의 불완전한 타입 1건 제거), 신규 진단 0/production source 진단 0. Repo-wide tsc 자체는 기존 오류 때문에 exit 2이며 전체 타입 검사가 clean하다는 뜻은 아니다. 캘린더/Dayun, 연도 구매 정책, 가격·결제, DB/schema, reliability, consent, 90일 정책, env/flags 변경 0. 실제 OpenAI/Toss 호출 0, 운영 DB write 0, 배포 0.
