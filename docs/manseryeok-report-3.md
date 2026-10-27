# 만세력 v5 병합 전 보고서 3 — 롤백 안전장치와 테스트 정리

- 작성: 2026-10-27
- 판정 표기: PASS / PARTIAL / FAIL / UNVERIFIED
- 하지 않은 것: master 변경, push, 병합, 배포, 운영 DB 접근, migration 적용, 결제·환불 수정, 기존 Book 데이터 변경, reset/clean/stash/rebase
- 작업 위치: 기존 worktree `~/Developer/gyeol-worktrees/v5-manseryeok-lmt`. 지금 `v5/manseryeok-merge`에 체크아웃되어 있다. `v5/manseryeok-lmt` 브랜치는 그대로(df60d562)다.

---

## 0. 요약

| 항목 | 결과 | 판정 |
|---|---|---|
| A. Phase 0 `v5/phase0-version-tolerant` | 1커밋. v5 버전 3종을 읽기에서 허용, 모르는 버전은 quarantine하지 않고 보존·로그. 새 리포트 버전은 그대로 | PASS |
| A. 실제 v5 스냅샷 읽기 | 33건(V3 16, V4 17). 84826020: V4 17 열림, **V3 16 전부 quarantine**. Phase 0: 33 전부 열림 | PASS |
| A. 테스트 | `readVersionTolerance.test.ts` 11건. 실제 SQL에서 모르는 버전 4종은 `snapshot_json` 보존 | PASS |
| B. 병합 후보 `v5/manseryeok-merge` | Phase 0 위에 lmt 5커밋 cherry-pick. 충돌 7파일, 모두 Phase 0 동작 유지로 해결(§2) | PASS |
| B. 락 18건 | 별도 커밋. 과거 픽스처는 그대로 두고 v5 값은 overlay 한 파일. 건별 사유표 `docs/manseryeok-lock-rebaseline.md` | PASS(회귀 기준선만) |
| B. 재기준화 원고 발행 검증 | V3: 같은 테스트의 `validateProductPublication`. V4: 생성 시 `validateV4Publication`. 내레이션 락 입력 20건 별도 발행 | PASS |
| B. 신살 3건(+단정 1) | kst-v2 신살 표를 강제하면 원래 기대값 그대로 통과 → 신살 변경만 반영해 갱신 | PASS |
| B. 동결 해시 2건, comprehensiveStability | 수정 없이 `docs/baseline-failures.txt`에 사유 기록 | 보고 |
| B. 골든 CSV priority | 8건 표시 | PASS |
| C. 발행 실패 SQL | `docs/publish-failure-query.sql` 5개 SELECT. 로컬 PGlite(전체 migration)에서 실행·분류 확인. 운영 실행은 사용자 | PASS(로컬) / UNVERIFIED(운영) |
| D. 체크리스트 | `docs/manseryeok-release-checklist.md` 새 순서 1→2→3, 4 롤백 | 완료 |
| 전체 테스트 | §5 | §5 |
| tsc / lint / build | §5 | §5 |
| 판매 품질 | 테스트 통과·락 재기준화는 품질 승인이 아니다 | UNVERIFIED |

---

## 1. A. Phase 0 (`v5/phase0-version-tolerant` = 463c4f8e, origin/master 84826020 위)

### 1.1 무엇을 바꿨나

| 파일 | 변경 |
|---|---|
| `src/lib/saju/calendarVersion.ts` | v5 버전 상수 3개(`saju-calendar-v5-lmt`, `dayun-utc-sect2-v2`, `timeBasis.calcVersion` `v5-lmt-2`), `isReadable…`, `unknownCalculationVersions(snapshot)`. **현재 버전(`saju-calendar-kst-v2`, `dayun-kst-sect2-v1`)은 그대로** |
| `src/lib/payment/paidReportReliability.ts` | `readPublishedReport`: 검증 실패 + 모르는 계산 버전이면 `quarantine`을 부르지 않는다. 응답은 `FAILED_REQUIRES_ATTENTION`/`UNKNOWN_CALCULATION_VERSION`/`snapshot: null`(고객은 "확인 필요" 화면), `console.error`로 `REPORT_READ_UNKNOWN_CALCULATION_VERSION` 로그. 알려진 버전의 진짜 실패는 예전처럼 quarantine |
| `birthTimePublication.ts` | 버전별 범위 검사(kst-v2 기존 그대로 / v5는 `timeBasis` 기준) |
| `productEvidenceValidation.ts`, `birthTimePrecisionTypes.ts` | v5 정확 시각은 `timeBasis.civilDateTime`으로 비교 |
| `dayunPublication.ts`, `annualMonthJie.ts` | 읽을 수 있는 대운·달력 버전 쌍 허용 |
| `shinsal.ts`, `shinsalConstants.ts`, `natalTableEvidence.ts`, `annualMonthExtendedEvidence.ts` | 원국표·세운 월 신살을 **리포트의 계산 버전으로** 고른다. v5는 수정 표(망신·고신·과숙), 나머지는 기존 표 |
| `productPublishGate.ts` | `validateNewProductPublication`: 현재 버전이 아니면 `SAJU_CALENDAR_CURRENT_REQUIRED`. 새 발행은 kst-v2만 |

### 1.2 왜 이 범위인가 (실험 결과)

lmt(df60d562) 코드로 실제 v5 스냅샷을 만들어(`generateReportSnapshot`, V4 = 현재 유료 경로, V3 = `contentVersion: v3`), 각 코드의 읽기 경로(`readPublishedReport` + `validateBookPublication`)에 넣었다.

| 읽는 코드 | V4 Book 17건 | V3 16건 |
|---|---|---|
| 84826020 (Phase 0 이전) | 17 열림 | **16 모두 quarantine**(`BIRTH_TIME_CONTEXT_INVALID`, `calendarCalculationVersion`, `NATAL_TABLE_EVIDENCE_MISMATCH`, 세운 `ANNUAL_MONTH_FACTS_MISMATCH` 등) |
| Phase 0 | 17 열림 | 16 열림 |

- 보고서 2의 UNVERIFIED("V4 Book 경로")가 풀렸다. V4 검증기는 계산 버전을 보지 않아 84826020에서도 v5 Book이 열린다. 위험은 V3 경로였다.
- V3 v5 스냅샷 16건은 전부 v5 신살 표를 실제로 거친다(구 표로 다시 만들면 원국표가 다르다). 그래서 Phase 0에 v5 신살 표가 들어갔다.

### 1.3 테스트 (`tests/unit/payment/readVersionTolerance.test.ts`, 11건 PASS)

- 픽스처: 실제 v5 스냅샷 4건(`tests/fixtures/v5-lmt-snapshots/*.json.gz`, 265KB): 세운 정확·대운 근사·연애 시간 모름(V3), 종합 근사(V4).
- 알려진 버전: 4건 모두 `COMPLETED`, 같은 스냅샷 반환, `quarantine` 호출 없음, V4는 `storedBook` 렌더.
- 모르는 버전: **quarantine 패치가 없는 실제 SQL**(migration만, quarantine이 `snapshot_json=null`로 지우는 상태)에서 달력·대운·`calcVersion`·V4 달력 버전을 바꾼 스냅샷 4종 → 응답 `UNKNOWN_CALCULATION_VERSION`, 로그 1줄, **DB 행은 `COMPLETED` + 원래 `snapshot_json` 그대로**.
- 대조군: 알려진 버전인데 진짜로 깨진 스냅샷은 예전처럼 quarantine되고 이 SQL에서 `snapshot_json`이 null이 된다(보존 테스트가 의미 있는 환경임을 확인).
- 새 발행: v5 증거는 `SAJU_CALENDAR_CURRENT_REQUIRED`로 거절.

### 1.4 한계 (롤백 중에만 해당)

- v5 리포트의 근사 시간대 라벨이 예전 표기로 보이고(예: `유시 17:00~18:59`), 만세력 표 아래 보정 문구가 없다. 데이터는 그대로다.
- Phase 0는 v5 리포트가 **수정된 신살 표**를 쓴다고 가정한다. v5에서 신살 커밋(51d6b78d)을 빼고 출시하면, 롤백 시 v5 V3 리포트의 원국표 검사가 어긋나 quarantine될 수 있다. 이 경우 Phase 0도 함께 고쳐야 한다.
- Phase 0가 아는 v5 버전은 위 3개뿐이다. v5에서 계산 버전을 다시 올리면(예: 출생지 경도 입력 → `v5-lmt-3`) Phase 0 목록도 먼저 갱신해 배포해야 한다. 안 하면 그 리포트는 보존되지만 롤백 중 열리지 않는다.

---

## 2. B. 병합 후보 `v5/manseryeok-merge`

### 2.1 커밋 (push 안 함)

| SHA | 내용 | 원본 |
|---|---|---|
| 463c4f8e | Phase 0 | — |
| 4bc9cfd0 | v5-lmt 달력 | d50d9dbb (충돌 해결) |
| 665b08b0 | 기본 −30분·출생지 경도 | 5d6a9279 (충돌 없음) |
| 21571ebf | 연애 픽스처 D 고정 | 621fb4a9 |
| 76c32862 | 망신·고신·과숙 표 | 51d6b78d (충돌 해결) |
| 628570a5 | 보고서 2·체크리스트 | df60d562 |
| 9897bb05 | Phase 0 테스트를 v5 현재 버전 기준으로(2개 단정만) | — |
| 37e3fbd6 | **락 18건 회귀 기준선 갱신, 품질 승인 아님** | — |
| 32e656a4 | 신살 변경만으로 바뀐 기대값 갱신 | — |
| b4b97db7 | 골든 CSV priority | — |
| (마지막) | 문서: 이 보고서, 체크리스트, SQL, baseline-failures | — |

### 2.2 충돌 해결

원칙: v5를 현재 버전으로 받아들이되 Phase 0 동작(모르는 버전 보존, kst-v2·v5 모두 읽기)을 유지한다.

| 파일 | 충돌 | 해결 |
|---|---|---|
| `calendarVersion.ts` | 두 쪽이 버전 목록을 다르게 정의 | lmt 이름(`SAJU_CALENDAR_VERSION`=v5, `LEGACY_…`=kst-v2)을 쓰고 Phase 0 별칭 3개는 삭제. `unknownCalculationVersions` 유지, 알려진 `calcVersion` = `[SAJU_CALC_VERSION_ID]` |
| `birthTimePrecisionTypes.ts`, `birthTimePublication.ts` | 같은 읽기 로직을 다른 이름으로 | lmt 쪽 채택(d50d9dbb 원본과 바이트 동일 확인). 로직은 Phase 0와 같다 |
| `dayunPublication.ts`, `productPublishGate.ts` | 주석만 다름 | lmt 문구 |
| `shinsal.ts`, `shinsalConstants.ts` | 같은 수정 표를 Phase 0는 "v5 읽기용", lmt는 "기본"으로 | lmt 쪽 채택(51d6b78d 원본과 동일). 같은 표·같은 선택 |
| `shinsalConstants.ts` (d50d9dbb 단계, 문자 충돌 없음) | Phase 0 v5 표가 삭제된 별칭을 참조 | `SAJU_CALENDAR_VERSION`으로 연결 |

검증: `git diff v5/manseryeok-lmt v5/manseryeok-merge -- src` = Phase 0 고유 코드(`paidReportReliability.ts` 보존 분기, `unknownCalculationVersions`)뿐. `readVersionTolerance` 11/11, `legacyBookProtection`, `shinsalVersioning` PASS.

### 2.3 락 18건

- 별도 커밋 37e3fbd6. 메시지에 "회귀 기준선 갱신, 품질 승인 아님".
- 건별 사유·신살 영향 측정·발행 검증: `docs/manseryeok-lock-rebaseline.md`.
- 방식: 과거 픽스처·해시 리터럴은 그대로. v5 값은 `tests/fixtures/v5-lmt-rebaseline/locks.json`(과거값 → v5값, 250항목). 이유: 공용 헬퍼가 "과거 락 픽스처는 수정하지 않는다"고 명시하고, 여러 픽스처가 `docs/validation` 매니페스트에 바이트 해시로 걸려 있어 직접 고치면 연쇄 실패가 난다.
- 신살 영향 측정: v5 엔진에 kst-v2 신살 표를 강제하고 18개를 다시 돌렸다. annualSafety·majorSafety는 신살과 무관, 나머지 16개는 일부 값이 신살 때문에 바뀐다.

### 2.4 신살 3건

| 파일 | 조치 | 근거 |
|---|---|---|
| writerPromptOptimization | 해시 5개 갱신 | 구 신살 표 강제 시 원래 해시와 같음 |
| engineFusionAudit | `AUDIT_DATA.json`은 그대로, 인벤토리 digest를 overlay에 기록 | 구 표 강제 시 `AUDIT_DATA.json`과 완전히 같음. 이 파일은 `docs/validation` 매니페스트에 해시가 있다 |
| loveMarriageChildReportTablePresenter | 덕민 픽스처 일주 `망신살` 삭제 | 己卯년 亡神=寅, 원국에 없음 |
| (+) comprehensiveEnrichment 가온 | 관찰 목록에서 `shinsal:GOSINSAL` 삭제 | 丙子년 孤辰=寅, 원국에 없음. 새로 생긴 신살 표식 없음 |

### 2.5 수정하지 않은 3건 → `docs/baseline-failures.txt` 끝 `KNOWN NEW FAILURES 3`

- `conditionalTemporalMeaningReview`, `temporalTenGodSourceContract`: `docs/validation/v4-global-source-domain-resolution-01`의 동결 소스 해시. 사주·발행 소스 파일 거의 전부가 대상이라 읽기 경로를 고치는 어떤 변경도 걸린다(Phase 0도 같은 2건이 실패한다). 오프라인 연구 모듈만 해당하고 판매 런타임은 import하지 않는다.
- `comprehensiveStability`: V4 종합 원고 검사 실패 S046·S047(렌더 닫힘), S051(제목 유형 반복, 신살 후). 기존 V4 결함이 다른 고객으로 옮겨 간 것. 결제 후 발행 실패 경로라 C의 SQL로 운영 비율을 본다.

### 2.6 골든 CSV priority (1~8)

| # | 행 | 이유 |
|---|---|---|
| 1, 2 | T02 2000-05-11 23:40, Z08 1961-08-09 23:50 | 23시 규칙: `unified`/`split` 일주가 다름 |
| 3 | T03 2000-05-12 00:20 | 00:20(태양시 전날 23:50) |
| 4 | C01 1999-07-31 07:30 | 홀수 시 +30분: −30분 07:00 辰 / −32분 06:58 卯 |
| 5 | Z05 1987-07-15 12:00 | 서머타임 UTC+10 |
| 6 | Z03 1955-01-15 12:00 | 표준시 UTC+8:30 |
| 7 | J04 1960-02-05 04:03 | 입춘 10분 후. 현재 엔진과 v5의 년·월주가 다름 |
| 8 | J06 2024-05-05 09:20 | 월 절입(입하) 10분 후 |

생성기는 CSV 자기 헤더로 `expected` 열을 찾도록 바꿨다(열을 더해도 사람이 적은 값이 밀리지 않는다).

---

## 3. C. 운영 진단 SQL (`docs/publish-failure-query.sql`)

- SELECT 5개, 쓰기 없음. migration에 있는 열만 쓴다(운영 패치 스크립트 적용 여부와 무관).
  1. 기간별(24시간/7일/30일/90일/전체) 결제 주문 수, 발행, 재시도 후 발행, 발행 실패, **원고 검증 실패**(마지막 시도 `failure_stage='validation'`), 발행 후 열람 차단, 진행 중, 비율
  2. 최근 30일 상품별
  3. 최근 90일 최종 실패 사유(단계·코드·검증 오류 표본)
  4. 최근 12주 주별 추이
  5. 이용권(티켓) 발행: 완료/되돌림(REVERSED)/진행 중, 실패 코드
- 확인: 로컬 PGlite에 전체 migration+패치를 올리고 5가지 상태(발행, 1회 실패 후 발행, 검증 3회 실패, 발행 후 quarantine, 대기)를 만든 뒤 실행해 분류·비율이 맞는 것을 봤다. 운영 결과는 **UNVERIFIED**(사용자 실행).
- 주의: 만료(90일) 뒤에는 `validation_errors`가 비워진다. 실패 코드는 남는다.

---

## 4. D. 체크리스트 (`docs/manseryeok-release-checklist.md`)

새 순서: 1) Phase 0 Preview → 배포 → 기존 Book 열람 2) 골든 priority 1~8 확인 → 23시 규칙 확정 3) v5 Preview → 신규 리포트 → 배포 4) 롤백.
롤백 절차에는 읽기 전용 SQL 3개를 넣었다: [R1] 운영 quarantine이 `snapshot_json`을 보존하는 패치 상태인지, [R2] v5 배포 이후 리포트의 계산 버전·상태별 수(롤백 전후 비교), [R3] 열람 차단 건수. 로컬 PGlite에서 실행 확인.

---

## 5. 검증

| 항목 | Phase 0 (463c4f8e) | 병합 후보 (HEAD) | 판정 |
|---|---|---|---|
| `npx tsc --noEmit` | 오류 0 | 오류 0 | PASS |
| `npx eslint .` | 오류 0 | 오류 0 | PASS |
| `pnpm build` | 성공, 경고 0 | 성공, 경고 0 | PASS |
| 전체 테스트(env 없음, 기준선과 같은 조건) | 624파일, 31,070건 중 762 실패. 실패 파일 141 = 기준선 139 + 동결 해시 2 | 630파일, 31,141건 중 835 실패. 실패 파일 154 = 기준선 140 + KNOWN 3 + 부하 11 | — |
| **기준선 대비 신규 실패 파일** | **2**(동결 해시. 병합 후보의 KNOWN 3건 중 2건과 같은 원인) | **0**(KNOWN 3건은 `docs/baseline-failures.txt`에 기록, 부하 11개는 순차 재실행 11/11 PASS) | PASS |
| 기준선 실패에서 통과로 | `app/dev/bookReading13b` 1개 | 0 | — |
| 관련·새 테스트 | `readVersionTolerance` 11/11 | `readVersionTolerance` 11, `legacyBookProtection` 20, `shinsalVersioning` 4, 골든 2, `fixturePins` 10, 락 18파일 359/359, 신살 3파일 97/97 | PASS |
| 판매 품질 | — | 락 재기준화는 회귀 기준선일 뿐이다. Preview에서 사람이 원고를 봐야 한다 | UNVERIFIED |

기준선 실패 파일 **안에서** 새로 실패한 케이스(파일 단위 숫자에는 영향 없음)
- Phase 0: 28건. 동결 소스 해시(`actualCalculationSemanticBridge`, `annualProductKnowledge`), `account/tickets` 2건(단독 재실행 PASS, 부하), `runtimeShadow` 1건(깨끗한 84826020 worktree에서도 실패 — 기준선 실행 때 파일이 케이스 없이 실패해 목록에 빠져 있었다).
- 병합 후보: 87건 = 부하 21 + 실제 66. 실제 66은 동결 소스 해시(`actualCalculationSemanticBridge` 34, `annualProductKnowledge` 3, `sajuFoundationKnowledge`, `knowledgeSourceVerification`)와 과거 원고 락(`finalEditorial` 14, `commonEditorial` 3, `majorEvidenceSeparation` 2, career·love·compatibility·comprehensive 계열 각 1)이다. 18건 범위 밖이라 손대지 않았다(재기준화 전 67건과 거의 같다).

임시로 만든 것: scratchpad의 84826020 비교용 worktree 1개(확인 후 삭제), 임시 테스트 파일(모두 삭제). 저장소에 남긴 임시 파일은 없다.

---

## 6. 사용자가 할 일

1. **Phase 0 검토 → Preview → 운영 배포**(체크리스트 1). v5보다 반드시 먼저다. 배포 전 `docs/publish-failure-query.sql` [1]을 돌려 지금 발행 실패율을 기록한다.
2. **골든 CSV priority 1~8**을 기준 앱으로 확인해 `expected`를 채우고, **23시 규칙(D3)**과 서머타임 중복 시각(D4)을 정한다(체크리스트 2).
3. **v5 Preview에서 6개 상품 원고를 직접 읽는다**(P7). 락 18건은 회귀 기준선만 갱신했다.
4. 결정: 동결 해시 재동결(D5), `comprehensiveStability`(V4 원고 결함, 결제 후 실패 경로) 별도 작업 여부, 기준선 파일 안 신규 실패 66건을 같은 overlay 방식으로 재기준화할지.
5. 병합·push는 하지 않았다. 각 브랜치에 커밋만 있다.
