# 만세력 시간 계산 재구축 보고서 (v5-lmt)

- 작성: 2026-10-27
- 브랜치: `v5/manseryeok-lmt` (origin/master 84826020 기준 worktree). 병합·push·배포·운영 DB 접근은 하지 않았다.
- 정책 상세: `docs/manseryeok-policy.md`
- 골든 케이스: `docs/manseryeok-golden-cases.csv`

---

## 1. 결론: 시주 오류의 원인

| # | 원인 | 근거 | 판정 |
|---|---|---|---|
| 1 | **경도 보정이 없었다.** 일·시주를 KST 민간시각 그대로 계산했다. 서울 태양시는 KST보다 32분 05초 늦다 | 2000-05-11 17:05 → 기존 癸酉, 새 엔진 **壬申**(태양시 16:33) | **주원인 (확인)** |
| 2 | **23시대 처리가 어느 방식과도 맞지 않았다.** 일주는 당일로 두고 子시 천간도 당일 일간에서 계산했다 | 1988-02-15 23:30 → 기존 庚子일 丙子시. 통합(23시 일주 교체)이면 辛丑일 戊子시, 야자시면 庚子일 戊子시가 맞다 | 확인 |
| 3 | **민간시각을 항상 +09:00으로 보았다.** 1954-61 UTC+8:30과 1948-51·1955-60·1987-88 서머타임이 반영되지 않았다 | 1960-02-05 04:03(입춘 10분 뒤) → 기존 己亥년, 새 엔진 庚子년. 1987-07-15 12:00 → 기존 午시, 새 엔진 巳시 | 확인 |
| 4 | lunar-javascript 절기 기준 시간대 | 절기 시각은 UTC+8이다(`qiAccurate = … + ONE_THIRD`, lunar.js 3573-3576). 기존 엔진의 KST→UTC+8 비교 변환(`solarTerms.ts`)은 **정확했다**. 오차는 #3의 입력 오프셋에서만 생겼다 | 버그 아님 (근거 확인) |
| 5 | 시주 계산 경로가 둘이었는지 | 라이브러리의 일·시주(`EightChar.getDay/getTime`)는 원래부터 쓰지 않았다. 이제 일·시주는 `getDayHourPillarsFromSolarTime` 한 곳에서만 계산한다 | 단일 경로로 정리 |

---

## 2. 변경 내용

**새 파일**
- `src/lib/saju/solarTime.ts`: 민간시→UTC(IANA), 태양시, 균시차(옵션). 시간 변환을 하는 유일한 곳이다.
- `src/lib/saju/calcPolicy.ts`: `DEFAULT_SAJU_TIME_POLICY`. 경도 126.98, `ziHourRule: "unified"`, `equationOfTime: false`.

**엔진** (`src/lib/saju/`)
- `pillars.ts`: `getDayHourPillarsFromSolarTime(solarMs, ziHourRule)`. 일·시주를 계산하는 단일 경로다.
- `lunarJavascriptPillars.ts`: 년·월주는 절대 시각, 일·시주는 태양시로 계산한다. 반환값에 `solarDate`, `solarTime`, `utcOffsetMinutes`, `solarTimeCorrectionMinutes`를 추가했다.
- `birthTimePrecision.ts`:
  - 정확한 시각은 IANA로 UTC 변환한다.
  - 근사 슬롯은 태양시 시진으로 계산한다.
  - 시간 미상은 입력 날짜의 일주를 쓰고 시주를 만들지 않는다.
  - 결과에 `timeBasis`를 기록한다.
- `birthTimePrecisionTypes.ts`:
  - 슬롯 라벨을 서울 민간시 기준으로 생성한다(예: 유시 17:32~19:31).
  - 저장된 리포트용 `birthTimeSlotLabel`, `contextMatchesExactTime`, `solarTimeCorrectionNote`를 추가했다.
- `calculateSaju.ts`, `solarTerms.ts`: 음력·윤달을 양력으로 변환한다(`lunarToSolarDate`). 없는 윤달은 `InvalidLunarDateError`로 처리한다.
- `calendarVersion.ts`: `saju-calendar-v5-lmt`, `dayun-utc-sect2-v2`, 레거시 읽기 허용 목록, `SAJU_CALC_VERSION_ID = "v5-lmt"`.

**기존 리포트 보호(읽기 경로)**
- `report-generation/birthTimePublication.ts`, `productEvidenceValidation.ts`, `dayunPublication.ts`, `productPublishGate.ts`
- `interpretation-v4/evidencePolicy.ts`, `strength.ts`
- `report-knowledge/annualMonthJie.ts`
- `knowledge-integration-foundation/{actual-evidence-graph/natal.ts, actual-calculation-semantic-bridge/units.ts, global-source-domain-resolution/temporalTenGodEvidence.ts}`

**표시(최소 UI)**
- `report-tables/{types.ts, manseRyeokTableData.ts}`, `interpretation-v4/runtimeProjection.ts`
- `components/report-tables/ManseRyeokCommonTable.tsx`, `app/dev/book-preview/{BookPages.tsx, bookProjection.ts}`

**문서**
- `docs/ssot/02_SAJU_CALC_SPEC.md`: v5-lmt 개정 안내 한 블록을 추가했다.
- 새 문서: `docs/manseryeok-policy.md`, `docs/manseryeok-golden-cases.csv`, 이 보고서.

---

## 3. 기존 고객 Book 보호

**열람 방식.** 모든 열람 경로(`/reports/[id]`, `/r/[token]`, V1~V4)는 **저장된 스냅샷**으로 렌더링한다. 사주를 다시 계산하는 경로는 없다(코드 추적으로 확인).

**위험.** V1~V3 읽기 게이트는 `SAJU_CALENDAR_VERSION`과 완전 일치하는지 검사했다. 실패하면 `quarantine`이 `snapshot_json`을 null로 만든다(`paidReportReliability.ts:107`, SQL `production_reliability_reconcile.sql:432-433`). 버전만 올렸다면 기존 리포트가 지워졌을 것이다.

**조치.**
- **엔진 버전으로 분기한다.** 읽기 경로는 레거시 버전(`saju-calendar-kst-v2`, `dayun-kst-sect2-v1`)을 허용하고, 버전별 검증 함수로 확인한다.
- **새 생성에는 현재 버전만 허용한다.** 레거시 버전으로 만들면 `SAJU_CALENDAR_CURRENT_REQUIRED`로 막는다.
- **근사 시간대 라벨도 버전별로 분기한다.** 기존 Book은 "묘시 05:00~06:59"를 그대로 보여주고, 새 Book만 "묘시 05:32~07:31"을 보여준다.
- **새 문구는 새 리포트에만 나온다.** "시간 보정 -N분 적용"은 새 리포트에만 표시되고 기존 스냅샷에는 나타나지 않는다.
- **저장 데이터는 바꾸지 않았다.** migration도 백필도 없다.

**검증** (`tests/unit/saju/legacyBookProtection.test.ts`, 19건 PASS):
- 레거시 V4 Book 픽스처 5건이 저장본과 **똑같이** 렌더링된다.
- kst-v2 V3 증거가 읽기 게이트를 통과한다.
- 레거시 대운으로 연간 월운 12개월을 재검증해도 같은 결과가 나온다.
- 레거시 슬롯 라벨이 유지된다.

---

## 4. 골든 테스트

**필수 케이스: PASS.** 2000-05-11 17:05 양력 여성 → **庚辰 辛巳 己巳 壬申**. `unified`와 `split` 모두 같다. 기존 엔진은 癸酉였다.

**CSV.** 32건이다. 열은 기존 엔진 / 새 엔진(unified) / 새 엔진(split) / UTC 오프셋 / 보정 분이며, **expected 칸은 비워 두었다.**
- 테스트(`manseryeokGoldenCases.test.ts`)가 CSV와 엔진 결과가 같은지 고정한다.
- 기대값을 채워 넣어도 다시 생성할 때 유지된다(`GOLDEN_WRITE=1`).

| 사례 | 기존 | 새(unified) | 새(split) |
|---|---|---|---|
| 23:40 (태양시 23:08) | 己巳 甲子 | **庚午 丙子** | 己巳 丙子 |
| 다음 날 00:20 (태양시 전날 23:48) | 庚午 丙子 | 庚午 丙子 | **己巳 丙子** |
| 1956-07-15 12:00 (UTC+9:30) | 戊午 | 丁巳 | 丁巳 |
| 1960-02-05 04:03 (입춘 10분 뒤, UTC+8:30) | 己亥 丁丑 | **庚子 戊寅** | 같음 |
| 1987-10-11 02:30 (두 번 있는 시각) | 癸丑 | 壬子(서머타임 쪽) | 같음 |
| 음력 2023 윤2월 15일 | 미지원 | 양력 2023-04-05로 계산 | |
| 음력 2024 윤3월 | 미지원 | 오류(없는 윤달) | |

**결정론 단위 테스트**(모두 PASS):
- `solarTime.test.ts`: tzdata 이력 13구간, UTC 변환, 공백·중복 시각, 왕복 변환, 경도 −32:05, 균시차.
- `ziHourRule.test.ts`: 두 방식, 절입 경계 ±1초, 1960년 입춘.
- 기존 외부 골든 26건: 년·월주는 동결된 외부값 그대로 유지했다. 바뀌는 일·시주 13건은 손으로 유도한 값(`V5_LMT_DAY_HOUR`)과 엔진 결과가 일치했다.

**대운에 미치는 영향.**
- 서머타임 출생자는 대운 시작이 달라질 수 있다. 예: 1987-08-18 13:30 남 → 1991년 5세 시작에서 1990년 4세 시작으로 바뀐다(출생 시각이 1시간 앞당겨짐).
- 근사 슬롯 출생자는 대운 시작 범위가 이동한다.

---

## 5. 검증 결과

| 항목 | 결과 |
|---|---|
| 새 테스트·관련 saju 테스트 | **PASS**. `tests/unit/saju` 전체(24파일, 347건), report-generation·report-tables 중 계산 의미 테스트 갱신분 |
| `tsc --noEmit` | **PASS (0)** |
| `pnpm lint` | **PASS (0)** |
| `pnpm build` | **PASS** (경고 0) |
| 전체 테스트 | **PARTIAL**. 실패 파일 196개(기준선 140), 실패 테스트 1,167개(기준선 748) |

**기준선에 없던 실패 파일 56개의 분류** (파일 단위 비교, `docs/baseline-failures.txt`)

1. **부하로 인한 타임아웃·STACK_TRACE_ERROR: 15개.** 단독으로 다시 돌리면 모두 PASS다(`bookRuntime`은 라벨 수정 뒤 PASS).
   - launchEvent, library, bookPublicFlow, bookRuntime, releaseActivation, claimProfile, comprehensiveEditorialPlan, guidanceProfile, koreanNarrativeCore, personalResonanceProfile, productWideEditorial, ticketPublication, protected-staging/security, bookSharing, actualEvidenceGraph(1차 실행)
2. **원고 해시·동결 스냅샷 잠금: 20개.** 고정 픽스처 차트의 시주(예: 13:30 → 태양시 12:58)와 증거에 담긴 버전 문자열이 바뀌어서 생긴 결과다. 갱신하면 새 원고를 승인하는 셈이므로 **갱신하지 않았다**.
   - interpretation-v3: careerEditorialPolish, comprehensive{Depth,Enrichment,Experience,Storytelling}, loveEditorialPolish, v2Regression
   - interpretation-v4: annual{EditorialQuality,ReaderQuality,Safety}, careerQuality, compatibility{Quality,Release}, loveQuality, major{EditorialSafety,Personalization,ReaderQuality,Safety}
   - deterministicProductQuality, sajuTemporalScenarios
3. **픽스처 차트가 바뀌어 원고 품질·표식 기대가 달라진 테스트: 17개.** 확인 방법: 기본 경도를 일시적으로 135°E(태양시 = KST)로 바꿔 기존 차트를 재현했다. 그러자 19개 파일 중 16개가 완전히 PASS였다. 나머지 실패 6건은 모두 서머타임 픽스처(1987-05-18 09:30), 23시 픽스처(1985-03-06 23:30), 버전 문자열이 든 프롬프트 해시로 설명된다.
   - careerEvidenceQuality, mbtiDetail, compatibilityDirectionality, compatibilityEditorial(Polish), mangsinAudit, materialDepth, myeongliStructure, careerNarrative, narrativePolish, loveNarrative, comprehensiveManuscript, comprehensiveRelease, majorNarrative, majorFullContentRefinement, writerPromptOptimization
   - comprehensiveNarrative, mbtiProductUtilization, reportEvidenceCorrectness, customerDayunGeneration(1건)은 아래 **기존 결함**과 겹친다.
4. **동결된 출처 해시 검증: 2개.** conditionalTemporalMeaningReview, temporalTenGodSourceContract. 이전 작업의 `docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json`이 계산 소스를 고정하고 있어서, 소스가 바뀌자 설계대로 의미 사용을 보류했다. 역사 기록이므로 수정하지 않았다(재검토·재동결 대상).

**새로 드러난 기존 결함 (이번 변경 전부터 있음, 별도 작업 필요)**
- 종합(saju_mbti_full) V2 결정론 원고가 차트 **辛巳 甲午 丙辰 甲午**에서 `REPEATED_SENTENCE: 병화가 진토의 큰 땅 위에 비치는 구조입니다.`로 생성에 실패한다.
- 기존 엔진(84826020)에 12:58을 넣어도 똑같이 실패하는 것을 확인했다.
- 2001-06-22 13:30 픽스처가 새 엔진에서 이 차트가 되어 여러 생성 테스트가 실패한다. 실제로 이 차트를 가진 고객은 지금도 종합 생성이 실패한다.

**바꾸지 않은 고정값**
- 오프라인 계약 핀: `annual-{august,january,june,february,november}/contract.ts`, `annual-fortune-product-research/sourceInventory.ts`.
- `docs/validation/**` 해시 기록.
- 모두 운영(Vercel)에서는 실행되지 않는 검증 도구다.

---

## 6. 정책 선택지 (결정 필요, 상세는 policy 문서)

1. **경도 관례.** 현재 −32분(126.98°E)이다. 한국 앱 관례는 −30분(127.5°E)이다. 홀수 정시 뒤 :30~:32 출생이 갈린다. 기존 외부 만세력 픽스처(1999-07-31 07:30 → 戊辰)는 −30분 관례이거나 무보정과 일치한다.
2. **23시대.** 기본은 `unified`다. 기존 SSOT는 00:00 일자 변경을 기본으로 정했다.
3. **서머타임 종료 시 두 번 있는 시각.** 현재 앞 시각을 쓴다. 대안은 뒤 시각을 쓰거나 시주를 생략하는 것이다.
4. **신살 표 오류 4건**(망신=겁살 중복, 고신·과숙 삼합 묶음, 현침 집합, 십이신살 기준 혼재). 고치려면 버전별 표 분기가 필요하다.
5. **학파 차이 6건**: 십이신살 기준지, 천을귀인 庚·辛, 양인 음간, 괴강 범위, 거법 병기, 지장간 여기 표기.

---

## 7. 사용자가 할 일

1. **골든 CSV expected 칸 채우기.** 기준 앱의 시간 보정 설정(−30분/−32분/무보정, 야자시 여부)을 같이 적는다. 그 결과로 정책 1·2가 정해진다.
2. **정책 선택지 결정** (§6).
3. **원고 잠금 20개 처리 결정.** 계산 변경에 따른 새 원고를 검토해 잠금을 갱신(재승인)할지 정한다. 별도 작업으로 하는 것을 권장한다.
4. **별도 작업으로 할 일:** 종합 V2 반복 문장 결함 수정, 신살 표 오류 수정.
5. **입력 화면 문구 확인.** 근사 시간대 라벨이 "유시 17:32~19:31"처럼 바뀐다(새 입력에만 적용).
6. **병합·배포 승인.** Production 배포 전 검토가 필요하다. 음력 입력 UI는 열지 않았다(엔진만 지원).
