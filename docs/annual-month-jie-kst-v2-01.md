# ANNUAL-MONTH-JIE-KST-V2-01

기준 HEAD: `8dae084`, 2026-09-23. 월운 계산/evidence와 최소 표시만 변경한다. 원국 `saju-calendar-kst-v2`, 대운 `dayun-kst-sect2-v1`, 세운 구매 시점의 6년 계약은 유지한다.

## 계산 계약

`annualMonthJie.ts`의 `buildAnnualMonthCalendar`가 선택 연도 1월 1일 00:00 KST부터 다음 1월 1일 00:00 KST까지 계산한다. 기존 `getSolarTermInstants`의 절대 instant와 `createSajuCalendarContext`를 재사용한다. UTC+8 라이브러리 좌표 변환은 기존 canonical adapter 안에만 남는다. 새 절기표/역법/서버 local timezone 정책을 만들지 않는다.

24절기 후보 중 canonical 월주가 전환되는 instant만 골라 12 Jie로 사용한다. 경계 정각부터 새 월주, 입춘 정각부터 새 연주다. 양력 연초에는 이전 연주를 사용한다. 연간 상품의 선택 연도와 각 구간의 `effectiveAnnualPillar`는 구분한다.

```
canonical Jie + 계산 완료된 customerDayun 전환 범위
  → 12 calendarMonths
  → monthStart / Jie / 교운 정확 시각 또는 범위 양끝 / monthEnd 분할
  → 각 [start,end)의 월주·유효 연주·대운 후보
  → 십성·오행·source별 관계 사실·evidence IDs
  → 서버 소유 월별 원고 → writer/fallback → V2 gate → snapshot/SSR
```

각 calendar month에는 `month`, `startKst`, `endKstExclusive`, `segments`, `importanceCandidates`가 있다. segment에는 다음을 보존한다.

- 시작/종료 KST, `boundaryReason`(월 시작·Jie·교운/불확실 범위 시작과 끝)
- `monthPillar`, `effectiveAnnualPillar`, `activeDayunContext`
- 월간/월지 본기 십성, 실제 월간·월지 오행
- source/participants/ID가 있는 `relationFacts`, 참조 `evidenceIds`
- 교운 `uncertainty`와 원래 earliest/latest 범위

모든 구간은 `[start,end)`이고 gap/overlap이 없다. 달 전체를 대표하는 간지는 없으며 draft의 단일 `monthGanji`/`elementFocus`는 V2에서 null이다.

## 교운과 관계

월운은 연도 단위 `selectedCycle`을 모든 달에 복제하지 않는다. 이미 계산된 각 cycle의 실제 `startSolarRange`로 해당 시점의 대운을 찾는다. 정확한 시각에는 전후를 분할한다. 범위 시작 이상/범위 끝 미만에서는 이전/다음 후보를 모두 남기고 Dayun 관계는 conditional로 기록한다. latest 정각부터는 모든 후보에서 다음 대운이다. 첫 대운 전에는 `before_first_cycle`이며 가상의 소운/대운을 만들지 않는다. Yun 계산은 반복 실행하거나 수정하지 않는다.

| 관계 | source / 처리 |
|---|---|
| 원국 × 월지 | `month_natal_branch`; 기존 합충형파해·삼합/반합 규칙과 원국 위치 유지 |
| 원국 오행 × 월 오행 | `month_natal_element`; 기존 부족 유입/과다 직접 유입·상생 사실 유지 |
| 유효 연주 × 월지 | `month_annual_branch`; 실제 연주와 참여 지지, 확정 여부 저장 |
| 활성 대운 후보 × 월지 | `month_dayun_branch`; cycle index/간지와 참여 지지, conditional 여부 저장 |

세운/대운 지지를 원국 배열에 넣지 않는다. 기존 pair 규칙을 source 없는 helper로 추출해 각 출처를 따로 붙인다. 삼합은 실제 원국 참여자를 포함한 기존 규칙에만 적용하고 두 지지만 있는 연주/대운 pair는 완성된 삼합으로 만들지 않는다. 천간 합충이나 새 강도/길흉 점수는 추가하지 않았다.

`importanceCandidates`는 교운·원국 관계·연주 관계·대운 관계·십성 변화·오행 작용의 ID만 제공한다. 사실 개수를 중요도 점수로 바꾸지 않는다. 부족 오행 유입을 ‘좋은 달’로 확정하지 않는다.

## 표시 / writer

기존 1~12월 카드와 연간/대운 비교표를 유지한다. V2 월 카드에는 ‘2월 — 입춘 전후 흐름 변경’, 기간별 간지/십성/유효 연주/대운, 정확한 KST 경계가 표시된다. 관계 근거는 각 기간에 종속된 native details로 확인한다. 서로 다른 구간의 사실을 한 달 전체에서 동시에 성립한 것처럼 합치지 않는다. 교운 후보는 하나로 확정해서 표시하지 않는다.

월별 원고는 서버가 만들고 writer는 그대로 보존한다. 나머지 연간 본문 계약은 유지했다. fallback과 mock writer는 같은 V2 evidence/publication을 사용한다. renderer는 저장된 결과를 표시하며 Yun을 실행하지 않는다. 전체 UI나 연간 본문을 재설계하지 않았다.

## 버전 / 저장본 / 발행 경계

- 신규 생성: `monthlyCalculationVersion = annual-month-jie-kst-v2`, `calendarMonths` 필수. V1 `monthlyFortunes`/`monthlyFortuneSeeds`는 빈 배열이며 approximation을 실행하지 않는다.
- 공통 신규 생성과 paid worker의 발행 직전 gate에 `validateNewProductPublication`을 적용한다. 유효한 legacy 결과도 신규 발행은 거부한다. 결제/worker retry 동작은 변경하지 않는다.
- 기존 `validateProductPublication`/result read는 버전별 검증을 유지한다. version이 없는 V1은 기존 approximation 및 기존 월별 원고 규칙으로만 검증한다. V2 계산기를 실행하거나 저장본을 변경하지 않는다.
- V2 read/publish는 **저장된 selectedYear**의 canonical 구간을 재검증한다. 현재 commerce year로 다시 판단하지 않는다. 저장된 Dayun basis는 기존 Dayun consistency gate가 검사하며 월별 gate는 그 basis에 맞는 시점별 후보를 대조한다.
- V2 version 제거/미지원 version/V1·V2 혼합은 거부한다. JSONB object key 순서는 의미가 없으므로 무시하고 배열 순서는 보존한다.
- 전체 coverage, 경계, 월주/연주, 대운, 십성, 사실 출처·참여자·IDs, 불확실성, 중요도 후보와 표시 원고의 변조를 차단한다.
- JSON 버전만 추가한다. DB column/RPC/migration/운영 patch는 필요 없다. read backfill/재저장 없음.

구형 approximation helper는 V1 validator, 명시적 legacy 진단/fixture, 기존 dev preview/smoke에 남는다. 새 paid handler는 full customerDayun을 전달하므로 그 경로를 사용하지 않는다. 이 문서는 이전 `annual-month-relation-facts-quality-01.md`의 approximation 유지 결정을 신규 생성에 한해 대체한다.

## 검증 근거

48개 Jie timestamp는 앞선 audit에서 고정한 2024~2027 fixture다. 각 직전 1초/정각/직후 1초의 월주와 연주를 확인한다. 이는 기존 canonical/package 계약의 회귀 검증이며 별도 천문 관측 정확도를 주장하지 않는다. 십성은 설치된 lunar-javascript의 별도 SHI_SHEN/본기 표와 교차 확인한다.

| 고객 | 입력 (양력 KST) | 2024/2025/2026/2027 segment 수 |
|---|---|---|
| A | 1996-12-06 14:15 남 ENTJ | 24 / 24 / 24 / 25 |
| B | 1980-05-15 09:30 여 ISFJ | 24 / 24 / 24 / 24 |
| C | 2001-08-20 16:20 남 ENFP | 24 / 25 / 24 / 24 |

12개 보고서, 144 customer-month, 290 segment의 fallback → 신규 publish gate → SSR을 검증한다.

- 48 Jie × 직전/정각/직후, 4개 양력 연초, 입춘 연주 변경.
- 2026 망종: UTC+8 6월 5일 23:48:21 = KST 6월 6일 00:48:21.
- UTC / Asia/Seoul / America/New_York 별도 Node 프로세스에서 4년 전체 segment 결과 동일.
- A 2026년 2월: 입춘 전 己丑/乙巳년, 후 庚寅/丙午년. 십성 식신·식신 → 정재·정인. 출처가 다른 巳丑/寅午 반합을 각각 해당 기간에만 기록.
- A 2027-02-21 12:15 壬寅→癸卯, C 2025-12-03 00:20 甲午→癸巳: 해당 달 3구간, 정확한 전환.
- 1999-07-31 남: approximate 辰시의 2027-05-13 07:00~05-23 06:59:59, unknown의 04-08 00:00~08-08 21:59:59 교운 범위 보존. 관계가 없으면 uncertainty를 이유로 새 관계를 만들지 않는다.
- 첫 대운 전, 불확실 후보 제거/conditional→confirmed 변조, 시간·간지·십성·source·participants·IDs 변조 거부.
- 정상 mock writer 통과, 단일 대표 월간지 삽입 거부. V2 publication/prompt/SSR에 approximation marker 없음.
- 수정 전 HEAD의 고정 V1 fixture는 read_report 한 번만 호출하고 COMPLETED 유지. V2 계산·backfill·quarantine 호출 0. 같은 V1을 새로 발행하는 것은 거부.
- V2 JSONB 키 순서 변경도 정상 읽기. 저장된 선택 연도 보존.

## 다음 세운 V2 범위

중요 월 tier의 해석 정책, 구간별 사실을 일·돈·관계·성장 장면으로 연결하는 본문, 중요 월별 정보 밀도는 후속 작업이다. 현재는 정밀 사실과 출처/불확실성을 제공한다. 자유 서술 전체의 의미를 NLP로 판정하거나 새로운 궁합/천간 이론을 만들지 않았다.

## 최종 로컬 검증

- `pnpm test`: 357개 파일 / 3,733개 테스트 PASS. 신규 월운 suite 72개 포함, 기존 다른 5상품 및 calendar/Dayun 회귀 유지.
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS. 샌드박스의 첫 Turbopack 빌드는 compile 단계에서 진행되지 않아 그 프로세스만 종료했고, 동일 build 명령을 로컬 실행 권한으로 재시도해 통과했다.
- `pnpm exec tsc --noEmit`: 기존 test-only 387건으로 exit 2. 기준/최종 파일·코드·내용을 비교하면 줄번호와 union 표시 순서 차이만 있으며 신규 진단 0, production source 진단 0이다. Repo-wide tsc clean을 의미하지 않는다.
- 12개 보고서 SSR 및 펼침 영역의 기간/사실 표시 검증. 브라우저 screenshot은 이번 검증에 포함하지 않았다.
- 실제 OpenAI/Toss 호출 0, 운영 DB 접근/쓰기 0, 배포 0. 외부 transport는 mock으로만 실행했다.
- unrelated `.gitignore`, `supabase/.temp`는 유지하고 commit 대상에서 제외한다.
