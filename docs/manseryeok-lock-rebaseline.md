# v5-lmt 락 재기준화 기록

- 브랜치: `v5/manseryeok-merge`
- **회귀 기준선 갱신이다. 품질 승인이 아니다.** 새 원고의 품질은 사람이 따로 본다(`docs/manseryeok-release-checklist.md` 3단계 P7).
- 근거 보고서: `docs/manseryeok-report-3.md`(이번), `docs/manseryeok-report-2.md` §2.2(경로 비교)

## 방법

- 과거 락 픽스처와 해시 리터럴은 **한 글자도 바꾸지 않았다.** `productWideAssertions.ts`의 규칙("Historical snapshot/lock fixtures remain unmodified")을 따랐고, 여러 픽스처가 `docs/validation/*` 매니페스트에 바이트 해시로 걸려 있어 직접 고치면 다른 테스트가 연쇄로 깨진다.
- v5 값은 `tests/fixtures/v5-lmt-rebaseline/locks.json` 한 파일에만 있다. 키는 과거 기대값(해시 문자열은 그대로, 객체는 `v4Digest:`)이고, 값은 v5 기대값(2,000자를 넘는 객체는 `{ v4Digest }`)이다.
- 락 단정은 `expectLock(실제값, 과거값)`(`tests/helpers/v5LmtLocks.ts`)으로 바꿨다. overlay에 과거값이 있으면 v5 값과, 없으면 과거값과 비교한다.
- 과거 행을 **입력으로 찾는** 경우(`expectEditorialFoundations`)는 입력 고정으로 키가 달라져 과거 행이 없을 수 있다. 이때는 `foundation:<입력 digest>` 같은 이름 있는 슬롯을 쓴다. `loveQuality`의 Book 묶음도 같은 과거값이 v5에서 둘로 갈라져 `love:<id>` 슬롯을 쓴다.
- 다시 만들 때: `V5_LOCK_RECORD=1 npx vitest run <락 파일들> --no-file-parallelism`. 기록 모드는 락을 실패시키지 않으므로 `locks.json` diff를 검토한다.
- 가독성 있는 리터럴 2곳만 직접 고쳤다.
  - `majorReaderQuality` 2031 대운 전환 시각: 상수 `TRANSITION_2031` + 근거 주석.
  - `majorPersonalization` 증거 출처 포함 검사: 과거 출처의 버전 문자열(`calendar:saju-calendar-kst-v2`, `dayun:dayun-kst-sect2-v1`)만 현재 버전으로 바꿔 비교한다(`currentVersionRefs`). 해시로 덮지 않았다.

## 사유 분류

| 사유 | 뜻 | 확인 방법 |
|---|---|---|
| 사주 변경(신살) | 망신·고신·과숙 표 수정(51d6b78d)으로 원국 표식이 바뀜 | **이번에 측정.** v5 엔진에 kst-v2 신살 표를 강제한 채 같은 테스트를 돌려, v5 기대값과 달라지는 테스트 수를 셌다 |
| 사주 변경(시주 후보) | 시간 모름·근사 입력의 시주 후보·`hourSensitivity`가 태양시 일 경계로 바뀜 | 보고서 2 §2.2 D |
| 버전 | 해시 대상에 `calendarVersion`·`calculationVersion`·`timeBasis`·보정 문구가 들어 있음 | 보고서 2 §2.2 A(경로 정규화 시 old/new 동일). `majorPersonalization`은 이번에 출처 문자열로 확인 |
| 시각 | 해시 대상에 고정한 입력 시각(`input.birthTime`, `range.startKst`, 대운 시작 시각)이 들어 있음 | 보고서 2 §2.2 B. `majorReaderQuality` S는 이번에 확인(05:10→05:40 고정 → 대운 전환 +2일 12시간 30분, 대운 1년=3일) |
| 시드 | V4가 문장 변형을 고르는 키(`reportStableKey`/`personalDigest`)가 `birthTimeContext` 전체를 해시해, 원국이 같아도 다른 문장이 고름 | 보고서 2 §2.2 C |

## 18건

"갱신 테스트"는 재기준화 전 실패하고 후 통과한 테스트 수다. "신살 영향"은 그중 kst-v2 신살 표를 강제하면 v5 기대값과 달라지는 수다.

| # | 파일 | 잠긴 대상 | 갱신 테스트 | 사유 | 신살 영향 | 발행 검증 |
|---|---|---|---|---|---|---|
| 1 | interpretation-v3/comprehensiveDepth | 이전 판 종합 원고 해시(A–F) | 6/12 | 시각, 사주 변경(신살) | 1 (A) | 같은 테스트에서 `validateProductPublication` PASS |
| 2 | interpretation-v3/comprehensiveEnrichment | Phase 2 V3 원고 해시(A–E) | 5/14 | 버전, 사주 변경(신살) | 2 (A, B) | 같은 테스트 PASS |
| 3 | interpretation-v3/comprehensiveExperience | V3.2 원고 해시(A–F) | 6/11 | 시각, 사주 변경(신살) | 1 (A) | 같은 테스트 PASS |
| 4 | interpretation-v3/comprehensiveStorytelling | V3.1 원고 해시(A–F) | 6/8 | 버전, 사주 변경(신살) | 3 (A, C, E) | 같은 테스트 PASS |
| 5 | interpretation-v3/v2Regression | V2 draft+evidence+HTML 해시(6상품) | 6/6 | 버전, 사주 변경(신살) | 6 | 같은 테스트(publish·SSR) PASS |
| 6 | report-generation/deterministicProductQuality | 입력·원국표·대운·세운 정규 해시 | 17/23 | 시각, 버전, 사주 변경(신살) | 12 | 같은 테스트(publish·SSR) PASS |
| 7 | interpretation-v4/annualEditorialQuality | 세운 evidence·materials·integration, 런타임 Book 묶음 | 13/31 | 시드, 사주 변경(신살·시주 후보) | 12 | V4 생성이 `validateV4Publication` 통과해야 ok |
| 8 | interpretation-v4/annualReaderQuality | 세운 불변식, 런타임 Book 묶음 | 18/35 | 시드, 사주 변경(신살·시주 후보) | 17 | 위와 같음 |
| 9 | interpretation-v4/annualSafety | V4 대운 내레이션 해시(6) | 6/20 | 버전 | 0 | 입력 6건 별도 발행 PASS, Book 렌더 |
| 10 | interpretation-v4/careerQuality | 계산·추천 증거 해시, 다른 상품 Book | 11/14 | 시드, 버전, 사주 변경(신살) | 10 | V4 생성 통과 |
| 11 | interpretation-v4/compatibilityQuality | 궁합 계산·표·지수·방향 digest, 새 지수, 사례 A 부록 수(43·34→44·35) | 18/18 | 시드, 버전, 사주 변경(신살) | 18 | V4 생성 통과 |
| 12 | interpretation-v4/compatibilityRelease | 장 제목, 지수·방향·관계 ID, 다른 상품 Book | 13/48 | 시드, 시각 | 11 | V4 생성 통과 |
| 13 | interpretation-v4/loveQuality | 계산·MBTI·원국표 digest, personalDigest, 다른 상품 Book | 11/18 | 시드, 버전, 사주 변경(신살) | 10 | V4 생성 통과 |
| 14 | interpretation-v4/majorEditorialSafety | 대운 편집 불변식 | 6/20 | 시드, 사주 변경(시주 후보·신살) | 2 | V4 생성 통과 |
| 15 | interpretation-v4/majorPersonalization | 대운 결과 불변식, 블록별 증거 출처(포함 검사) | 6/12 | 시드, 버전, 사주 변경(신살) | 2 | V4 생성 통과 |
| 16 | interpretation-v4/majorReaderQuality | 대운 불변식, 2031 전환 시각, 런타임 Book 묶음 | 15/33 | 시드, 시각, 사주 변경(신살) | 8 | V4 생성 통과 |
| 17 | interpretation-v4/majorSafety | V4 궁합 내레이션 해시(8) | 7/24 | 시각 | 0 | 입력 8건 별도 발행 PASS, Book 렌더 |
| 18 | report-knowledge/sajuTemporalScenarios | 대운·세운 기간 오프라인 출력 전체 | 12/12(파일 단위) | 버전, 사주 변경(신살) | 파일 단위로 다름 | 입력 6건 별도 발행 PASS, Book 렌더 |

- 재기준화·신살 커밋 후 18개 파일 359/359 PASS. 최종 전체 실행에서는 357/359였고, 나머지 2건(`loveQuality`, 부하성 `STACK_TRACE_ERROR`)은 순차 재실행 18/18 PASS.
- "별도 발행"은 그 테스트가 내레이션만 잠그는 경우다. 같은 입력을 `generateV4ShadowReport`로 만들고 `validateV4Publication`과 `storedBook`을 확인했다(임시 테스트, 커밋 안 함).

## 신살 수정으로 실패한 3건 (+ 같은 원인의 단정 1개)

모두 v5 엔진에 kst-v2 신살 표를 강제하면 원래 기대값 그대로 통과한다. 즉 차이는 망신·고신·과숙 표 변경뿐이다.

| 파일 | 바뀐 것 | 의도된 변경인가 | 조치 |
|---|---|---|---|
| report-generation/writerPromptOptimization | 작성기 요청 해시 5개(커리어·연애·궁합·대운·세운). 증거의 신살 표식만 다름 | 예 | 해시 5개 직접 갱신, 근거 주석(이 파일의 기존 방식) |
| interpretation-v4/engineFusionAudit | 규칙 인벤토리 ≠ `docs/product/v4/AUDIT_DATA.json`. 차이는 신살 표 3개 | 예 | `AUDIT_DATA.json`은 여러 `docs/validation` 매니페스트에 바이트 해시가 있어 그대로 두고 `expectLock`으로 v5 인벤토리 digest를 기록 |
| report-tables/loveMarriageChildReportTablePresenter | 연애 픽스처(손으로 쓴 덕민 원국 표식)의 일주 `망신살` vs v5 커리어 계산. 己卯년(亥卯未) 亡神은 이제 寅이고 원국에 寅이 없다 | 예 | 픽스처 일주 신살을 `[]`로. 같은 파일의 다른 단정은 이 칸을 쓰지 않는다 |
| interpretation-v3/comprehensiveEnrichment (락 파일 안의 동작 단정) | 가온(丙子년) `shinsal:GOSINSAL` 관찰 기대. 亥子丑 孤辰은 寅이고 원국에 寅이 없다. v5에서 새로 생긴 `shinsal:*` 표식은 없다 | 예 | 관찰 목록에서 `shinsal:GOSINSAL`만 뺌 |
