# 만세력 계산 정책 (saju-calendar-v5-lmt)

- 작성: 2026-10-27, 브랜치 `v5/manseryeok-lmt` (기준 origin/master 84826020)
- 적용 대상: 이 버전 이후 **새로 생성되는** 리포트. 저장된 기존 리포트는 `saju-calendar-kst-v2` 계약으로만 읽는다(§3).
- 표기: 아래 "현재 기준"은 코드 위치로 확인한 값이다. "선택지"는 바꾸지 않았고 결정만 요청한다.

---

## 1. 시간 정책

출생 시각은 **절대 시각(UTC)**과 **지역 태양시** 두 가지로만 다룬다.

| 단계 | 규칙 | 코드 |
|---|---|---|
| 민간시각 → UTC | IANA `Asia/Seoul`(런타임 tzdata)로 변환. 1954-03-21~1961-08-09 UTC+8:30, 1948~51·1955~60·1987~88 서머타임을 자동 반영. 오프셋 하드코딩 없음 | `src/lib/saju/solarTime.ts` `civilToUtc` |
| 년주·월주 | UTC 출생 시각과 절입 시각(절대 시각) 비교. 태양시 보정 미적용 | `solarTerms.ts` `getSolarTermContext` |
| 대운수 | 같은 절대 시각으로 lunar-javascript `getYun(sect 2)` | `customerDayun.ts` (변경 없음) |
| 일주·시주 | 지역 평균태양시 = UTC + 경도/15시간. 출생지 미수집이므로 서울 126.98°E 고정(UTC+8:27:55, 현재 KST보다 32분 05초 늦음) | `solarTime.ts` `solarWallClockMs`, `pillars.ts` `getDayHourPillarsFromSolarTime` |
| 진태양시(균시차) | 기본 **미적용**. `equationOfTime: true`로 켤 수 있음(NOAA 근사) | `calcPolicy.ts` |
| 23시대 | `ziHourRule` 기본 `unified`(태양시 23:00에 다음 날 일주·子시). `split`은 23시대 일주 유지 + 다음 날 子시 천간(야자시), 00시대는 당일 子시(조자시) | `calcPolicy.ts`, `pillars.ts` |

설정은 `DEFAULT_SAJU_TIME_POLICY`(`src/lib/saju/calcPolicy.ts`) 한 곳이다. 쓰인 값은 리포트마다 `birthTimeContext.timeBasis`에 기록된다.

### 1.1 경계 규칙
- **존재하지 않는 시각**(서머타임 시작, 1961-08-10 00:00~00:29): 전환 **직전** 오프셋으로 해석한다(시계를 앞으로 민 것과 같음). `timeBasis.nonexistent = true`.
- **두 번 있는 시각**(서머타임 종료 1시간): **앞(서머타임) 시각**을 쓴다. `timeBasis.ambiguous = true`.
  - 선택지: 뒤(표준시) 시각을 쓰거나, 두 시각의 시주가 다르면 시주를 생략할 수 있다. 결정 필요.
- **시간 미상**: 입력 날짜(민간 날짜)의 일주를 그대로 쓰고 시주는 만들지 않는다(기존 계약 유지). 연·월주는 그날 전체를 평가하며, 그날 절입이 있으면 계산을 거부한다(기존 동작).
- **근사 시간대(시진)**: 슬롯은 **태양시 시진**이다. 예: 유시 = 태양시 17:00~18:59 = 서울 민간시 17:32~19:31. 입력 화면 라벨도 이 민간시로 표시된다(`birthTimePrecisionTypes.ts`). 시주는 슬롯 안에서 항상 하나로 정해진다. `unified`에서는 자시 슬롯 전체가 입력 날짜의 일주다.
- **음력 입력**: 엔진만 지원한다(`calculateSaju`). lunar-javascript의 음력(중국 기준)으로 양력 날짜를 구한 뒤 계산한다. 윤달은 `isLeapMonth`. 없는 윤달이나 없는 날은 오류로 처리한다. 입력 화면·결제 흐름은 계속 양력만 받는다.
  - 주의(**UNVERIFIED**): 한국천문연구원 음력과 중국 음력은 합삭 시각이 자정 근처일 때 드물게 하루 다르다. 해당 날짜는 확인하지 않았다.

### 1.2 시간 정책 선택지 (결정 필요)
- **경도 관례**: 현재 서울 126.98°E(−32분 05초)다. 한국 만세력 앱은 대개 동경 127.5°E로 **−30분**을 쓴다. 홀수 정시 뒤 :30~:32에 태어난 경우 결과가 다르다.
  - 예: 1999-07-31 07:30은 −32분이면 卯시, −30분이면 辰시다. 저장소의 기존 외부 만세력 픽스처는 戊辰이었다(`sajuFeatureAudit.ts:155-200`). 골든 CSV `C01`에서 확인할 수 있다.
  - 선택지: (a) 126.98 유지, (b) `longitude: 127.5`로 바꿔 관례에 맞춘다(설정 한 줄).
- **23시대**: 기존 SSOT(`02_SAJU_CALC_SPEC.md` 자시 절)는 00:00 일자 변경을 기본으로 정했다. 이번에 지시에 따라 `unified`(23:00 일자 변경)를 기본으로 바꿨다. `split`은 설정 한 줄로 켤 수 있다.
- **서머타임 종료 중복 시각**: §1.1 참고.

### 1.3 고객 표시
만세력 표 아래에 한 줄을 표시한다: `출생지 경도 기준 시간 보정 -32분 적용`.
- 서머타임이면 `(당시 서머타임 반영)`, UTC+8:30 시기이면 `(당시 표준시 UTC+8:30 반영)`을 덧붙인다.
- 시간 미상이거나 기존(v2) 리포트이면 표시하지 않는다.
- 코드: `solarTimeCorrectionNote`(`birthTimePrecisionTypes.ts`). 표시 위치는 `BookPages.tsx` `NatalTable`, `ManseRyeokCommonTable.tsx`.

---

## 2. lunar-javascript 기준 시간대

- 절기 시각은 **UTC+8(북경시)**이다. 근거: `qiAccurate = t - dtT(t) + ONE_THIRD`(lunar.js 3573-3576, 1/3일 = 8시간)와 주석 `节气时刻(北京时间)`.
- 엔진은 절대 시각을 UTC+8 벽시계로 바꿔 라이브러리에 넣는다(`solarTerms.ts` `getSolarTermContext`). 이 변환은 원래부터 정확했다.
- 오류의 원인은 **입력 민간시각을 항상 +09:00으로 본 것**이다. 1954-61년과 서머타임 기간 출생자는 절대 시각이 30~60분 어긋났다.
- 라이브러리의 일주·시주(`EightChar.getDay/getTime`, UTC+8 날짜 기준)는 **쓰지 않는다**. 년·월주만 가져오고, 일·시주는 `pillars.ts`에서 태양시로 한 번만 계산한다.

---

## 3. 계산 버전과 기존 리포트 보호

| 상수 | 새 값 | 읽기 허용(레거시) |
|---|---|---|
| `SAJU_CALENDAR_VERSION` | `saju-calendar-v5-lmt` | `saju-calendar-kst-v2` |
| `DAYUN_CALCULATION_VERSION` | `dayun-utc-sect2-v2` | `dayun-kst-sect2-v1` |
| `timeBasis.calcVersion` | `v5-lmt` | (없음) |

- 고객 Book과 리포트는 **저장된 스냅샷으로 렌더링**한다. 열람할 때 사주를 다시 계산하지 않는다.
- 다만 V1~V3 읽기 게이트는 버전을 현재 상수와 **완전 일치**로 비교했다. 실패하면 `quarantine`이 `snapshot_json`을 null로 만든다(`paidReportReliability.ts:107`). 그래서 버전을 그냥 올리면 기존 리포트가 지워진다.
- 이렇게 바꿨다:
  - 읽기 경로는 `isReadableSajuCalendarVersion` / `isReadableDayunCalculationVersion`로 **허용 집합**을 검사하고, 버전별로 검증한다(`birthTimePublication.ts`의 `validLegacyRange` / `validCurrentRange`).
  - 새 생성은 `validateNewProductPublication`에서 현재 버전만 허용한다(`SAJU_CALENDAR_CURRENT_REQUIRED`).
  - 연간 월운 재검증(`buildAnnualMonthCalendar`)도 레거시 대운을 허용한다. 년·월주는 절대 시각 기준이라 결과가 같다(테스트로 확인).
- 저장 데이터는 바꾸지 않았다. 레거시 Book 5건이 저장본과 똑같이 렌더링되는지 `tests/unit/saju/legacyBookProtection.test.ts`가 확인한다.

---

## 4. 만세력 표 항목별 현재 기준 (변경 없음)

| 항목 | 현재 기준 | 위치 |
|---|---|---|
| 지장간 | 정기·중기·여기를 가중치 0.6/0.3/0.1로 둔 3단 표(중국식 藏干 순서). 예: 寅=甲丙戊, 巳=丙戊庚, 申=庚壬戊. 子·卯·酉는 1개, 午는 丁己, 亥는 壬甲. 子壬·卯甲·酉庚·午丙·亥戊 여기는 없음 | `src/lib/saju/constants.ts:114-164` |
| 십신 | 일간 대비. 지지는 정기 천간 기준 | `tenGods.ts:24-53` |
| 십이운성 | **봉법**(일간 대비 각 지지). 음간 역행, 火土同法(戊=丙, 己=丁). 거법은 계산하지 않음 | `report-knowledge/sajuPillarFeaturePlacement.ts:146-287` |
| 십이신살(표시) | **년지** 삼합 기준 | `shinsalConstants.ts:499-750`, 표 라벨 "십이신살 · 연지 기준" |
| 십이신살(파생) | 일지 기준(없으면 년지) | `sajuFeatureExtractionRules.ts:253-311` |
| 천을귀인 | 일간 기준. 甲戊庚→丑未, 乙己→子申, 丙丁→亥酉, 辛→寅午, 壬癸→卯巳 | `shinsalConstants.ts:387-404` |
| 문창·학당·태극 | 일간 기준 | `shinsalConstants.ts:405-458` |
| 월덕·천덕 | 월지 기준 | `shinsalConstants.ts:459-498` |
| 도화·역마·화개(단독) | 년지 기준 (12신살의 년살·역마·화개와 중복 표시) | `shinsalConstants.ts:287-346` |
| 홍염 | 일간 기준(甲午 乙申 丙寅 丁未 戊辰 己辰 庚戌 辛酉 壬子 癸申) | `shinsalConstants.ts:234-251` |
| 양인 | 일간 기준. 음간을 제왕 자리로 둠(乙寅 丁巳 己巳 辛申 癸亥) | `sajuFeatureExtractionRules.ts:394-405` |
| 괴강 | 일주 庚辰·庚戌·壬辰·戊戌 | `sajuFeatureExtractionRules.ts:387-392` |
| 시간 미상 | 시주 칸과 시주 의존 표식을 제외 | `natalTableEvidence.ts:56,61,103` |

### 4.1 학파 차이 — 선택지만 보고 (바꾸지 않음)
1. **십이신살 기준지**: 표시는 년지, 파생 특징은 일지다. 선택지: (a) 년지 유지, (b) 일지로 통일, (c) 두 기준을 표에서 따로 표시.
2. **천을귀인 庚·辛 배속**: 현재 庚→丑未, 辛→寅午. 선택지: 庚→寅午(일부 학파) 등.
3. **양인 음간**: 현재 제왕 자리(소수설). 선택지: 음간 양인 없음 또는 관대 자리(乙辰 丁未 己未 辛戌 癸丑).
4. **괴강**: 현재 4개. 선택지: 壬戌(및 戊辰)을 넣은 5~6개.
5. **십이운성**: 봉법만 계산. 선택지: 거법 병기.
6. **지장간 표기**: 현재 정기 먼저, 여기 일부 없음. 선택지: 한국 만세력 앱처럼 여기→중기→정기 순서와 子壬·卯甲·午丙·酉庚·亥戊 여기 추가.

### 4.2 학파 차이가 아닌 표 오류 — 이번엔 보고만 (별도 작업)
표를 고치면 기존 리포트 열람 검증(`validateNatalTableEvidence`가 저장된 원국으로 표를 다시 만들어 비교)이 실패한다. 그래서 고치려면 **계산 버전별 표 분기**가 필요하다.

| 오류 | 근거 | 영향 |
|---|---|---|
| 단독 `MANGSINSAL` 표가 겁살 표와 같음(예: 亥卯未→申, 표준 망신은 寅) | `shinsalConstants.ts:267-286` vs `TWELVE_GEOPSAL` 500-519 | 같은 라벨 "망신살"로 잘못된 위치가 합쳐진다. Book은 이미 화면에서 망신을 숨기고 있다(`bookProjection.ts:95-96`) |
| 고신·과숙을 계절(亥子丑·寅卯辰…)이 아닌 삼합으로 묶음 | `shinsalConstants.ts:347-386` | 표마다 12칸 중 8칸이 틀림 |
| 현침살이 {卯, 酉}뿐 | `shinsalConstants.ts:227-233` | 표준 집합 甲·辛·卯·午·申과 다름 |
| 십이신살 칸에 년지·일지 결과가 섞임 | `manseRyeokTableData.ts` `withConsistentNatalMarkers` | V3 표와 V4 Book 표의 같은 칸에 두 기준이 구분 없이 나온다 |
