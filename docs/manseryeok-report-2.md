# 만세력 v5-lmt 마무리 보고서 2

- 작성: 2026-10-27
- 브랜치: `v5/manseryeok-lmt`. 이전 보고서: `docs/manseryeok-report.md`. 정책: `docs/manseryeok-policy.md`. 수동 확인표: `docs/manseryeok-release-checklist.md`
- 하지 않은 것: master 변경, push, 배포, 운영 DB 접근, migration, 결제·환불 수정, 기존 Book 데이터 변경
- 판정 표기: PASS / PARTIAL / FAIL / UNVERIFIED

---

## 0. 요약

| 항목 | 결과 | 판정 |
|---|---|---|
| 1. 기본 −30분(127.5°E) + 출생지 경도 | 엔진·문구·calcVersion(`v5-lmt-2`)·문서 반영. 출생지는 엔진만 지원(입력 화면 미연결) | PASS |
| 2. 신규 실패 파일 | 기준선(140) 대비 **24개**(+부하 1개). 이전 보고 56개. 1~2번만으로는 21개 | **PARTIAL** |
| 2. 원문 락 20건 | 입력 고정으로 2개 PASS. 18개는 해시 대상에 계산 메타데이터·입력 시각·V4 문장 시드가 있어 고정만으로 불가 → 결정 필요 | PARTIAL |
| 2. 동작 테스트 | 분류표 작성(§2.3). 의도된 변경만 기대값/입력 갱신. 1개(comprehensiveStability)는 V4 잠재 결함으로 보고 | PARTIAL |
| 2. 동결 해시 2건 | 수정 없이 보고 | 보고 |
| 3. 신살 4건 | 망신·고신/과숙 **수정**(별도 커밋 `51d6b78d`, 기존 Book은 기존 표 유지). 현침·십이신살 혼재는 **미수정·보고** | PARTIAL |
| 4. 반복 문장 버그 | 기존 결함(두 엔진 동일). 무작위 원국 9%에서 발생. 현재 유료 경로(V4)는 영향 없음. V2 경로 실패 시 재시도·폴백·환불·알림 모두 없음 | 조사 완료 |
| 5. 수동 확인표 | `docs/manseryeok-release-checklist.md` | 완료 |
| tsc / lint / build | 0 / 0 / 성공(경고 0) | PASS |

커밋(브랜치 `v5/manseryeok-lmt`, push 안 함)
- `5d6a9279` 기본 −30분·출생지 경도·락 픽스처 고정
- `621fb4a9` 픽스처 고정값 보정
- `51d6b78d` 신살 수정(별도)
- 마지막 커밋: 이 보고서·확인표

---

## 1. 기본 시간 보정 −30분(127.5°E)

| 항목 | 내용 | 판정 |
|---|---|---|
| 기본 경도 | 126.98°E(−32분 05초) → **127.5°E(−30분)**. `DEFAULT_SAJU_TIME_POLICY`(`src/lib/saju/calcPolicy.ts`) | PASS |
| 출생지 경도 | 엔진 입력 `birthLongitude`(124~132°E)가 있으면 그 경도를 쓴다(`withBirthLongitude`). 범위 밖이면 `InvalidBirthLongitudeError` | PASS(엔진) |
| 출생지 입력 경로 | **입력 화면·결제 payload·생성 핸들러에는 경도 필드가 없다.** 지금 생성되는 신규 리포트는 모두 127.5°E다. 연결은 별도 작업 | 미연결(보고) |
| calcVersion | `timeBasis.calcVersion` `v5-lmt` → **`v5-lmt-2`**. `longitudeSource: "default-127.5" \| "birthplace"`. 미배포 `v5-lmt`는 저장된 리포트가 없어 읽기 허용 목록에 넣지 않았다 | PASS |
| 고객 문구 | `기준 경도 동경 127.5°로 시간 보정 -30분 적용`. 출생지 입력 시 `출생지 경도 동경 126.98°로 시간 보정 -32분 적용`. 1954~61년(UTC+8:30)은 `시간 보정 없음 (당시 표준시 UTC+8:30 반영)` | PASS |
| 근사 시간대 라벨 | `유시 17:30~19:29`, `자시 전날 23:30~당일 01:29` (새 입력만) | PASS |
| 기존 Book 보호 | 방식 그대로(읽기 경로는 저장 버전으로 검증, 새 생성만 현재 버전). `legacyBookProtection.test.ts` PASS(레거시 V4 Book 5건 저장본과 동일 렌더) | PASS |
| 문서 | `docs/manseryeok-policy.md` §1·1.0·1.2·1.3·3, `docs/ssot/02_SAJU_CALC_SPEC.md` 개정 블록, 골든 CSV 재생성 | PASS |

**−30분으로 바뀌어 달라진 것**
- 필수 골든 2000-05-11 17:05 여 → 庚辰 辛巳 己巳 **壬申** 유지.
- 1999-07-31 07:30이 다시 **戊辰**시다. 기존 외부 만세력 픽스처와 같다(C01).
- 홀수 정시 뒤 :30~:31에 태어난 사람은 −32분일 때와 시주가 다르다(예: 13:30 → 태양시 13:00 未).
- 이 브랜치가 −32분 기준으로 써 둔 saju 테스트 기대값은 손으로 다시 유도해 고쳤다. 예: `V5_LMT_DAY_HOUR` 12건, 2024-12-06 23:30은 태양시 23:00 → 다음 날 乙巳 丙子. 고친 뒤 `tests/unit/saju` 26파일 PASS.

---

## 2. 테스트 정리

### 2.1 숫자

| 시점 | 실패 파일 | 기준선에 없던 실패 파일 |
|---|---|---|
| 기준선 origin/master 84826020 (`docs/baseline-failures.txt`) | 140 | — |
| 이전 보고(−32분) | 196 | 56 |
| 1~2번 후(`5d6a9279` 전체 실행) | 162 | 22. 이 중 contentRobustness는 `621fb4a9`에서 고쳐 **21** (락 18 + 동결 해시 2 + comprehensiveStability 1) |
| 최종 HEAD(신살 포함) | 165 / 629파일, 실패 테스트 986 / 31,130 | **24** + 부하 1 |

- 최종 24개 = 1~2번 21개 + 신살 영향 3개(`engineFusionAudit`, `writerPromptOptimization`, `loveMarriageChildReportTablePresenter`, §3.3).
- 기준선에 있던 실패 파일 140개는 그대로 실패한다. 새로 고쳐진 것도 없다.
- 기준선은 env 없이 돌린 결과다. 이번 실행도 같은 조건이다.

### 2.2 원문 락 20건 — 입력 고정 결과

**방법**
- 락 해시와 기대 원문은 고치지 않았다. 제품 코드에 legacy 분기도 넣지 않았다.
- 고정 픽스처의 생시만 테스트 전용 값으로 옮겨, v5 엔진의 원국이 변경 전(kst-v2) 원국과 같아지게 했다.
  - 기본은 원래 시각 +30분이다. 이러면 태양시가 예전 KST 시각과 같다.
  - 1987년 서머타임은 +60분이다. 절대 시각도 같아진다.
  - 23:30은 같은 날 01:00으로 옮겼다.
- 고정값 10건은 `tests/unit/saju/fixturePins.test.ts`가 검사한다. 고정한 시각은 kst-v2 원국과 같아야 하고, 원래 시각은 원국이 달라야 한다. kst-v2 원국은 동결값이다.
- 확인한 것: 변경 전 엔진을 흉내 낸 계산이 저장된 kst-v2 골든 출력과 11/11 일치했다.

**결과: 2개 PASS, 18개 FAIL.**
- PASS: `careerEditorialPolish`, `loveEditorialPolish`
- 나머지 18개는 원국을 되돌려도 해시가 다르다. 변경 전 커밋(84826020) worktree와 현재 브랜치에서 각 락이 해시하는 입력 JSON을 기록해 경로 단위로 비교했다.

| 원인 | 설명 | 해당 파일 |
|---|---|---|
| A. 계산 메타데이터만 다름 | 해시 대상에 `calendarVersion`/`calculationVersion` 문자열, `birthTimeContext.timeBasis`, 태양시 필드, 표 아래 보정 문구가 들어 있다. 이것만 정규화하면 old/new 입력이 **완전히 같다** | comprehensiveEnrichment, comprehensiveStorytelling, annualSafety, sajuTemporalScenarios, v2Regression(draft+evidence+HTML 전체 해시) |
| B. 고정한 입력 시각 자체 | 해시 대상에 `input.birthTime`, `range.startKst`, 대운 시작 시각(`startSolarKst`)이 들어 있다. 입력을 옮기면 이 값도 바뀐다 | comprehensiveDepth, comprehensiveExperience, deterministicProductQuality, majorReaderQuality·compatibilityRelease·majorSafety 일부 |
| C. V4 문장 선택 시드 | V4는 `reportStableKey`/`personalDigest`로 문장 변형을 고른다. 이 키가 `birthTimeContext` 전체를 해시한다(`careerProductAdapter.ts:56`, `timeProductContext.ts:101`, `loveProductAdapter.ts:55`). 그래서 원국이 같아도 **고객 문장이 다른 변형으로 바뀐다** | annualEditorialQuality, annualReaderQuality, careerQuality, compatibilityQuality, compatibilityRelease, loveQuality, majorEditorialSafety, majorPersonalization, majorReaderQuality |
| D. 시간 모름·근사 시간대 | 태양시 일 경계로 시주 후보(`candidates.hour`)와 `hourSensitivity`가 달라졌다. 이 픽스처에는 고정할 생시가 없다 | annual·major·love 계열의 시간 모름/근사 픽스처 |

**결론: 입력 고정만으로는 18개를 통과시킬 수 없다.** 락 해시를 갱신하거나 해시 대상을 바꾸는 것은 금지 조건이라 손대지 않았다. 아래 셋 중 하나를 결정해야 한다(체크리스트 D1).
1. 새 원고를 검토하고 재승인한다(해시 갱신).
2. 락 해시 대상에서 계산 메타데이터를 빼도록 테스트를 바꾼다. A만 해결되고 B·C·D는 남는다.
3. 보류한다(병합 시 18개 FAIL 상태).

**C는 제품 동작이기도 하다.** v5로 버전·`timeBasis`가 바뀌면서, 같은 생년월일시로 다시 사는 고객은 이전 Book과 다른 문장 변형을 받는다. 기존 Book은 스냅샷이라 바뀌지 않는다.

### 2.3 동작 테스트 분류표

이전 보고서의 동작 테스트 묶음(17개, 기존 결함과 겹친 4개 포함 20파일)과, 이번 작업 중 새로 드러난 2파일이다.

| 파일 | 실패 원인 | 분류 | 조치 | 근거 |
|---|---|---|---|---|
| careerEvidenceQuality, mbtiDetail, compatibilityDirectionality, mangsinAudit, materialDepth, careerNarrative, loveNarrative, comprehensiveManuscript, comprehensiveRelease, majorNarrative, majorFullContentRefinement, comprehensiveNarrative, mbtiProductUtilization, reportEvidenceCorrectness, customerDayunGeneration (15) | −32분일 때만 시주가 바뀌던 픽스처(예: 13:30 → 12:58 午). −30분에서는 태양시 13:00 未로 변경 전 시주와 같다 | 의도된 시주 변경 | **기대값 변경 없이 PASS** | 1번 변경만 적용하고 고정 전에 실행해서 확인 |
| compatibilityEditorial, compatibilityEditorialPolish | 공유 픽스처 유나 1993-10-17 13:20 → 12:50 午. 도화·홍염 유무가 바뀐다 | 의도된 시주 변경 | 공유 픽스처 고정(14:20, 같은 乙未시). 기대값 변경 없음 | `fixturePins.test.ts` |
| narrativePolish | 준서 1987-05-18 09:30은 서머타임이다. 실제 08:30 → 태양시 08:00 辰. 역마 표식이 사라진다 | 의도된 변경(서머타임 반영) | 공유 픽스처 고정(10:30, 절대 시각 동일). 기대값 변경 없음 | 같음 |
| myeongliStructure | ① 1987-05-18 09:30: 서머타임으로 시주가 乙巳→甲辰, 강약이 veryStrong→strong. ② 1985-03-06 23:30: 23시 일주 교체로 일간이 甲→乙 | 의도된 변경 | 시험하려던 원국을 유지하도록 **입력 시각만 갱신**(10:30, 01:00). 기대 강약·구조값은 그대로 | 강약 분류기 시험이라 원국이 시험 대상이다. 기대값(veryStrong)을 strong으로 바꾸면 veryStrong 사례가 사라진다 |
| writerPromptOptimization (3건) | 프롬프트에 넣는 증거에서 `calendarVersion`·`calculationVersion` 문자열과 `timeBasis`만 다르다. 정규화하면 old/new가 같고, 원국·대운 주기도 같다 | 의도된 변경 | **기대 해시 3개 갱신**, 근거 주석 | old/new 프롬프트 JSON 경로 비교 |
| contentRobustness (이번 고정으로 생김) | V3 궁합 마지막 문장의 순서가 같은 원국이라도 **출생 분(minute)에 따라** 바뀐다(변경 전 엔진에서도 13:20/13:30/14:20이 서로 다름). +30분 고정값 13:50이 비교 대상 쌍과 같은 순서가 됐다 | 회귀 아님(고정값 선택 문제) | 유나 고정값을 14:20(+60분)으로. 같은 乙未시 | 두 엔진에서 분별 출력 비교 |
| comprehensiveStability (S046 exact, S047 approximate) | V4 종합 원고 `RENDERABILITY_NOT_CLOSED`. S046은 원국이 같다(甲申 丁卯 壬子 己酉). V4 문장 시드가 `birthTimeContext`를 해시해 다른 변형이 골라졌고, 그 변형이 렌더 검사에서 떨어진다 | **회귀(픽스처 기준)**. 제품 수준에서는 기존부터 있던 V4 결함이 다른 고객에게 옮겨 간 것 | **미수정, 보고** | 무작위 300건 표본: V4 원고 실패 v5 10건(3.3%), 변경 전 엔진 8건(2.7%). 정확 시각 실패 5건 중 4건은 두 엔진에서 같은 입력으로 실패(§4.4) |

### 2.4 동결 출처 해시 2건 (수정하지 않음, 보고만)

| 파일 | 실패 내용 | 원인 |
|---|---|---|
| `tests/unit/report-knowledge/conditionalTemporalMeaningReview.test.ts` | `WITHHELD` ≠ `SCOPED_CALCULATION_LINK_VERIFIED` (3건) | `docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json`이 계산 소스 파일 해시를 고정한다. 소스가 바뀌어 설계대로 의미 사용이 보류된다 |
| `tests/unit/report-knowledge/temporalTenGodSourceContract.test.ts` | `CALCULATION_SOURCE_HASH_MISMATCH` (11건) | 위와 같다 |

재동결하려면 `docs/validation/**`의 기록을 다시 만들어야 한다(체크리스트 D5).

### 2.5 부하 시에만 실패하는 파일

- 최종 전체 실행에서 부하로만 실패한 신규 파일은 `interpretation-v4/koreanNarrativeCore.test.ts` 1개다. 단독 재실행 79/79 PASS.
- 이전 보고의 부하 15개는 이번 전체 실행에서 모두 통과했다.
- 기준선 파일 안에서 부하로 실패가 바뀐 경우(STACK_TRACE_ERROR): `account/measurement`, `interpretation-v4/contentRebuild`, `interpretation-v4/relationshipProduct`. 모두 기준선 실패 파일이라 숫자에는 영향이 없다.

---

## 3. 신살 명백 오류 4건 (별도 커밋)

### 3.1 교차 확인

| 항목 | 출처 1 | 출처 2 | 현재 코드 | 판정 |
|---|---|---|---|---|
| 망신살(亡神) | 《삼명통회》 권3 〈論劫煞亡神〉: "申子辰以亥為亡神 … 寅午戌以巳 … 巳酉丑以申 … 亥卯未以寅" ([quanxue.cn](https://www.quanxue.cn/qt_mingxiang/sanmingth/sanmingth25.html)) | 년지 기준 신살표(知命網 [astrology.tw](https://www.astrology.tw/arcview/1193)): 亡神 = 申子辰亥·寅午戌巳·巳酉丑申·亥卯未寅. 같은 원문에서 劫煞 = 申子辰巳·寅午戌亥… | 단독 `MANGSINSAL`이 劫煞 표와 같다(亥卯未→申 등). 같은 파일의 `TWELVE_MANGSINSAL`은 맞다 | **수정** |
| 고신·과숙(孤辰·寡宿) | 《삼명통회》 권3 〈論孤辰寡宿〉: "如亥子丑逐方三位，進前一辰見寅為孤，退後一辰見戌為寡 … 其餘三方皆依此推", 玉門集 "寅卯辰人，巳為孤，丑為寡" ([zggdwx.com](https://www.zggdwx.com/sanming/82.html)) | 방합 기준 표([vocus.cc](https://vocus.cc/article/66dc6843fd8978000151cb4d)): 亥子丑 寅/戌, 寅卯辰 巳/丑, 申酉戌 亥/未. 巳午未만 酉/巳로 적혀 있는데, 같은 글의 "孤辰只入四馬地，寡宿只入四墓地" 규칙과 어긋나 오기로 본다. 원문 규칙으로는 申/辰이다. 百度百科·知乎 조항은 직접 열람이 403이라 검색 요약으로만 4조 동일을 확인했다 | 방합이 아닌 **삼합**(亥卯未·寅午戌…)으로 묶었다. 12칸 중 8칸이 다르다 | **수정** |
| 현침살(懸針) | 쎄하다 사전: 정통 甲·辛·卯·午·申, 未는 약하게 봄([ssehada.com](https://ssehada.com/encyclopedia/deep-components/shinsal/hyeon-chim-sal)) | 두루미 사전: 일간 甲·辛만(자평 다수설), 卯·午·申·未는 넓은 학파([durumisaju.com](https://www.durumisaju.com/dict/sinsal/hyunchim)). 중국 懸針煞 字形 설명: 干 甲·辛, 支 卯·午·申 | {卯, 酉}. 酉는 어느 출처에도 없다 | **미수정**: 오류는 확실하나 정답 집합이 원국 5자 / 未 포함 6자 / 일간만 3가지로 갈린다. 지지만 받는 현재 규칙 종류(`BRANCH_ONLY`)로는 천간을 표현할 수 없다. 파생 규칙 `hyeonchimBranches`(`sajuFeatureExtractionRules.ts:407`)도 같은 {묘, 유}다 |
| 십이신살 기준 혼재 | 《삼명통회》는 劫煞·亡神 등을 삼합 기준으로 주며, 기준지(년지/일지)는 학파마다 다르다 | 두 기준 모두 통용(학파 차이 #1) | 표시는 연지 기준인데 `withConsistentNatalMarkers`가 V3 상세·V4 Book에서 같은 칸에 연지·일지 결과를 섞고, 라벨 "· 연지 기준"을 지운다. 예: 庚辰 辛巳 己巳 壬申 일주 칸 = 연지 기준 겁살 + 일지 기준 지살 + 잘못된 망신살 | **미수정**: 오류(같은 칸에 기준 표시 없이 섞임)는 확인했다. 그러나 고치는 방법(연지만 / 일지만 / 따로 표시)이 곧 학파 차이 #1의 선택지라 지시에 따라 건드리지 않았다 |

### 3.2 수정 내용 (커밋 `51d6b78d`, 병합 여부는 결정 필요)

| 표 | 변경 전 | 변경 후 (v5-lmt 리포트만) |
|---|---|---|
| 망신살 `MANGSINSAL` | 亥卯未→申, 寅午戌→亥, 巳酉丑→寅, 申子辰→巳 (= 겁살) | 亥卯未→**寅**, 寅午戌→**巳**, 巳酉丑→**申**, 申子辰→**亥** (= `TWELVE_MANGSINSAL`) |
| 고신살 `GOSINSAL` | 삼합 묶음: 亥卯未→寅, 寅午戌→巳, 巳酉丑→申, 申子辰→亥 | 방합 묶음: 亥子丑→寅, 寅卯辰→巳, 巳午未→申, 申酉戌→亥 |
| 과숙살 `GWASUKSAL` | 삼합 묶음: 亥卯未→戌, 寅午戌→丑, 巳酉丑→辰, 申子辰→未 | 방합 묶음: 亥子丑→戌, 寅卯辰→丑, 巳午未→辰, 申酉戌→未 |

**기존 Book 보호.** 읽기 경로는 저장된 원국으로 원국 표를 다시 만들어 비교한다(`validateNatalTableEvidence`, V4 `evidencePolicy.ts:94`). 그래서 표를 그냥 고치면 기존 리포트가 "준비 중"이 되거나 quarantine된다. 이를 막기 위해 표를 **리포트의 계산 버전으로 고른다**.
- `shinsalRulesFor(calendarVersion)`: `saju-calendar-v5-lmt`면 수정된 표, 그 밖(저장된 kst-v2 등)이면 기존 표.
- 호출 위치
  - `detectShinsal(pillars, calendarVersion = 현재)`
  - `buildCanonicalNatalTable`: 저장된 context 버전을 쓴다.
  - `extendAnnualMonthEvidence`: packet의 `calendarVersion`을 쓴다. 신규 세운은 `withBirthTimeEvidence`로 항상 들어 있다.
- 검증
  - `shinsalVersioning.test.ts` 4건 PASS. 수정 표·기존 표, 庚辰 辛巳 己巳 壬申 예시, kst-v2 표의 읽기 검증 통과를 본다.
  - `legacyBookProtection.test.ts` PASS. 레거시 V4 Book 5건이 저장본과 똑같이 렌더된다.

**예시** 庚辰 辛巳 己巳 壬申
- 월·일주의 망신살(실제로는 겁살 자리)이 사라진다.
- 辰년은 寅卯辰 방합이라 월·일주 巳에 고신살이 새로 붙는다.

**그대로 둔 것**
- V4는 망신을 정책으로 계속 제외한다(`MANGSIN_CANONICAL_RULE_CONFLICT`, `foundationSupplement.ts:102`). 이 제외를 풀지는 별도 결정이다.
- Book 화면의 망신 숨김(`bookProjection.ts`)도 그대로다.

**특성화 테스트 갱신.** `mangsinAudit`, `engineFusionAudit`의 망신 충돌 테스트는 처음부터 "나중의 정식 규칙 검토가 명시적으로 갱신해야 한다"는 주석이 달린 특성화 테스트다. 그래서 이번에 갱신했다. kst-v2는 충돌을 유지하고, v5-lmt는 해소됐다는 내용이다.

### 3.3 신살 수정의 영향 파일 (락·동결값은 갱신하지 않음)

신살 커밋 전(1~2번 후)과 최종 실행을 테스트 단위로 비교했다.

| 파일 | 바뀐 것 | 종류 | 기준선 실패 파일인가 |
|---|---|---|---|
| `report-generation/writerPromptOptimization.test.ts` | 작성기 요청 해시 5개(종합·커리어·연애·궁합 + 확장 증거). 증거의 신살 표식이 바뀜 | 프롬프트 락 | 아니오 → **신규 실패** |
| `interpretation-v4/engineFusionAudit.test.ts` | 규칙 인벤토리가 동결 문서 `docs/product/v4/AUDIT_DATA.json`과 다름(신살 표 포함) | 동결 데이터 | 아니오 → **신규 실패** |
| `report-tables/loveMarriageChildReportTablePresenter.test.ts` | 동결된 연애 Book 표(kst-v2)와 지금 계산한 커리어 표(v5)의 신살·귀인 칸이 다름 | 동결 비교 | 아니오 → **신규 실패** |
| `interpretation-v3/comprehensiveEnrichment.test.tsx` | Gaon(丙子년) 원고가 `shinsal:GOSINSAL`을 기대. 수정 후 丙子년 고신은 寅이라 해당 없음 | 원문 락(이미 실패 파일) | 아니오(락 18개에 포함) |
| `interpretation-v4/comprehensiveStability.test.ts` | S051(시간 모름) V4 원고 `TITLE_TYPE_REPEAT` | V4 잠재 결함(§2.3) | 아니오(이미 실패 파일) |
| `report-knowledge/annualProductKnowledge.test.ts` | `annualMonthExtendedEvidence.ts` 소스 파일 해시 | 소스 해시 락 | 예 |
| `report-knowledge/sajuFoundationKnowledge.test.ts` | 신살 규칙 내용 다이제스트 | 다이제스트 락 | 예 |

신살 커밋을 병합하지 않으면 위 영향은 모두 사라진다. 커밋 하나만 되돌리면 된다(별도 커밋).

---

## 4. 종합 리포트 반복 문장 버그 조사 (수정하지 않음)

### 4.1 재현
- 입력 2001-06-22 12:30, 여, INFP → 원국 **辛巳 甲午 丙辰 甲午**.
- 종합 V2 결정론 원고가 `COMPREHENSIVE_V2_DRAFT_INVALID: REPEATED_SENTENCE: 병화가 진토의 큰 땅 위에 비치는 구조입니다.`로 실패한다.
  - MBTI가 없으면 `LONGFORM_READING_TOO_SHORT: finalMessage`도 함께 난다.
- **변경 전 엔진(84826020)에서도 같은 입력으로 똑같이 실패한다.** 기존 결함이다.
- 문장이 나오는 곳은 세 군데다: opening, baseSajuReading, peopleFamilyEnvironmentReading. 검사기는 3개 이상 장에 같은 문장이 있으면 실패시킨다(`comprehensiveReportDraftValidator.ts:2854-2873`).
- 문장 출처: 일주 지식 `sajuDayPillarKnowledge.ts:1020`.

### 4.2 발생 조건 (무작위 400개 원국 표본, 두 엔진 각각)

| 항목 | v5 엔진 | 변경 전 엔진 |
|---|---|---|
| V2 생성 실패 | 57/400 (14.2%) | 58/400 (14.5%) |
| 그중 `REPEATED_SENTENCE` | 36/400 (9.0%) | 36/400 (9.0%) |
| 그 밖의 실패 | `EVERYDAY_SCENE_MISSING: love_relationships`, headline 길이 부족, `RAW_SAJU_LABEL_EXPLANATION_MISSING` 등 21건 | 22건 |

- **특정 원국 하나의 문제가 아니다.** 같은 원국 표식의 고정 설명문이 opening과 2개 이상의 섹션 본문에 그대로 들어가면 난다.
- 반복된 문장의 출처(케이스 수, v5 기준)
  - 귀인: 20. 천을귀인 12, 태극귀인 5.
  - 일주 설명: 13.
  - 출처 미확인 파생 문장(장성살 계열 등): 17.
- 구조 조건: 반복 실패 36건 중 24건은 사주×MBTI 연결 장면이 0개였다. 서사 테마를 원국 표식 요약으로 채우는 경로(`comprehensiveNarrative.ts:91-96`)다.
- MBTI 미입력 원국은 11/80로, 입력한 원국(6~7/80)보다 자주 난다.

### 4.3 결제 후 발행 경로에서의 처리 (코드 추적)

| 질문 | 답 | 근거 |
|---|---|---|
| 지금 유료 주문이 V2를 타는가 | **아니다.** 결제 준비 때 `bookGeneration: v4`를 찍고(`bookExperiencePublicEnabled()`가 항상 true), 워커는 V4(`generateV4ShadowReport`)로 만든다. V4는 V2 원고·검사기를 쓰지 않는다 | `src/lib/book/publicGate.ts:5`, `src/app/api/payment-checkout/prepare/route.ts:374-375`, `src/lib/book/paidRuntime.ts:31-37` |
| V4는 같은 원국을 발행하는가 | 2001-06-22 12:30을 포함해, V2에서 반복 문장으로 실패한 표본 13건 모두 V4 생성·`validateV4Publication` 통과 | 로컬 재현 |
| V2가 아직 도는 경우 | `bookGeneration` 표식이 없는 V4 이전 주문 중 `contentVersion: "v3"`도 없는 입력, `contentVersion` 없이 부른 `/api/reports/create`. 현재 입력 화면은 항상 v3를 넣는다 | `generateProductReport.ts:30,90`, `reportInputPresentation.ts:36-43`, `src/app/api/reports/create/route.ts:389` |
| 재시도 | DB 기준 최대 3회(약 30초, 2분 간격). 같은 입력이면 같은 결과라 의미가 없다. 패치 스크립트 `scripts/paid_report_one_call_delivery_patch.sql:232`는 `PREFLIGHT_CONTRACT_INVALID`를 1회 만에 attention으로 보낸다(운영 적용 여부 **UNVERIFIED**) | `supabase/migrations/20260920163924_production_reliability_reconcile.sql:382,417,424` |
| 폴백 | 없음. 2·3회차도 같은 결정론 경로다. 작성기(LLM) 호출 전에 실패한다 | `generateProductReport.ts:100-110`, `paidReportReliability.ts:66` |
| 최종 상태 | 작업·리포트 `FAILED_REQUIRES_ATTENTION`, 스냅샷 없음. 주문은 `paid` 유지 | `paidReportReliability.ts` |
| 환불 연결 | **없음.** 주문 어댑터 `markRefunded`는 미구현(unavailable 반환), Toss 환불은 티켓 환불에만 쓴다 | `paidReportReliabilityStore.ts:71`, `src/lib/tickets/refundService.ts:2`, `docs/paid-report-reliability-architecture-01.md:66` |
| 고객 화면 | 재시도 중 "지연" 안내, attention이면 고객센터 연락처와 "추가 결제는 필요하지 않습니다" 안내. 자동 새로고침 중단 | `src/app/reports/[reportId]/ReportStatusView.tsx:20-27,61-65` |
| 운영 알림 | 없음. 운영자가 `GET /api/internal/report-retry`로 목록을 직접 봐야 한다 | `paidWorkerBatch.ts:51` |

결론
- 현재 유료 판매 경로(V4)에서는 이 버그로 발행이 실패하지 않는다.
- V2가 도는 예외 경로에서 실패하면 재시도·폴백·환불·알림이 모두 실질적으로 없다. 결제는 그대로 둔 채 고객은 "연락 주세요" 화면에 멈춘다.
- 위 표의 경로 인용은 서브에이전트 추적 결과 중 핵심 6곳을 직접 열어 확인했다. 나머지(SQL 재시도 간격, 화면 문구 줄 번호)는 추적 결과 그대로다.

### 4.4 함께 발견한 것: V4 종합도 일부 원국에서 결제 후 실패한다 (기존 결함)

조사 중 V4 경로(현재 유료 판매 경로)도 같은 방식으로 표본을 돌렸다. 대상은 무작위 300건(정확 시각·근사 시간대·시간 모름 각 100건)이고, `generateV4ShadowReport` 후 `validateV4Publication`을 거쳤다.

| 실패 | v5 엔진 | 변경 전 엔진 |
|---|---|---|
| `COMPREHENSIVE_MANUSCRIPT_UNSAFE` (V4 원고 검사 실패: `RENDERABILITY_NOT_CLOSED`, `TITLE_TYPE_REPEAT` 등) | 10/300 (3.3%) | 8/300 (2.7%) |
| `BIRTH_TIME_UNCERTAIN` (결제 전 입력 단계에서 거절) | 6/300 | 24/300 |

- 정확 시각 실패 5건 중 4건은 두 엔진에서 같은 입력으로 실패한다. 기존 결함이다.
- 결제 준비 API는 입력 정규화만 검사한다(`prepare/route.ts:376-384`). 그래서 `BIRTH_TIME_UNCERTAIN`은 결제 전에 막히지만, **원고 실패는 결제 후에야 드러난다.** 결과는 §4.3과 같다: 재시도 무의미, 환불·알림 없음.
- v5에서 근사 시간대 거절이 18/100 → 0/100으로 줄었다. 23시 통합 규칙 때문에 자시 슬롯이 하루로 확정되기 때문이다.
- 수정하지 않았다. 별도 작업이 필요하다. 예: 결제 전 V4 사전 생성 검사, 실패 시 환불·알림 연결.

---

## 5. 검증

| 항목 | 결과 | 판정 |
|---|---|---|
| `npx tsc --noEmit` | 오류 0 | PASS |
| `npx eslint` (저장소 전체) | 오류 0 | PASS |
| `pnpm build` (next build) | 성공, 경고 0 | PASS |
| `tests/unit/saju` | 26파일 363건 PASS. 새 테스트 `fixturePins`, `shinsalVersioning` 포함 | PASS |
| 관련 테스트 | annualMonthJie, newReportPageSource, bookRuntime, customerDayunGeneration, birthTimePrecisionGeneration, canonicalCalendarGeneration, pipeline, myeongliStructure, mangsinAudit, contentRobustness, compatibilityEditorial(Polish), narrativePolish, careerEditorialPolish, loveEditorialPolish PASS. `loveMarriageChildReportTablePresenter`는 신살 영향으로 1건 FAIL(§3.3) | PARTIAL |
| 전체 | §2.1 | PARTIAL |
| 판매 품질 | 테스트 통과가 판매 품질 통과는 아니다. Preview 확인 전(체크리스트 §2) | UNVERIFIED |

조사에 쓴 임시 worktree 2개(84826020, 5d6a9279)와 임시 테스트 파일은 scratchpad에 두었다가 지웠다. 저장소에 남긴 임시 파일은 없다.

---

## 6. 사용자가 할 일

1. **락 18개 처리 결정(D1).** 재승인·해시 대상 변경·보류 중 하나를 고른다. 근거는 §2.2 표. V4 문장 변형이 바뀌는 C는 제품 결정이기도 하다.
2. **신살 커밋 `51d6b78d` 병합 여부(D2).** 영향 파일은 §3.3. 현침(정답 집합)과 십이신살 표시 기준(연지/일지/둘 다)도 정해야 고칠 수 있다.
3. **골든 CSV `expected` 채우기.** 기준 앱 설정을 함께 적고, 23시 규칙(D3)과 서머타임 중복 시각(D4)을 정한다.
4. **동결 해시 재동결 여부(D5).** 대상: `docs/validation/v4-global-source-domain-resolution-01`, `docs/product/v4/AUDIT_DATA.json`.
5. **별도 작업으로 넘길 것**
   - 출생지 입력 화면·결제 payload 연결.
   - V2 반복 문장 결함.
   - V4 원고 실패(표본 3%)가 결제 후에 드러나는 문제: 결제 전 검사, 환불·알림 연결.
6. **병합·배포 전 수동 확인.** `docs/manseryeok-release-checklist.md` §1~3. 롤백 주의(§4): v5 리포트가 생긴 뒤 이전 코드로 롤백하면 quarantine 위험이 있다.
7. `docs/audit-step0.md`, `docs/baseline-failures.txt`는 이전 작업이 남긴 미추적 파일이다. 커밋하지 않고 그대로 두었다.
