# P01 보고서 — 만세력(v5 태양시 보정)·Phase 0 독립 검증과 릴리스 준비

- 작성: 2026-10-28 · 작업 위치 `~/Developer/gyeol-worktrees/v5-manseryeok-lmt` (`v5/manseryeok-merge`)
- 판정: PASS / PARTIAL / FAIL / UNVERIFIED. 테스트 통과는 판매 품질 승인이 아니다.
- 하지 않은 것: master 변경·push·배포, 운영 DB 접근, migration 적용, 결제·환불 수정, 기존 Book 변경, 락 기준선 갱신, reset/clean/stash/rebase

## 0. 요약

| 항목 | 결과 | 판정 |
|---|---|---|
| 대상 관계 | origin/master 84826020 ⊂ phase0 463c4f8e(+1) ⊂ merge 3e53c123(+10). 둘 다 fast-forward 가능 | PASS |
| 정책값 | 127.5°E(−30분), 통자시(unified), 진태양시 끔, IANA tzdata(하드코딩 없음) — 예상과 같음 | PASS |
| 오라클 자체 검증 | 시간대 기간·경계(1930~1989), 일주 앵커 3개(서로 일치), KASI 절기 2개, 음력 6개 — 8건 | PASS |
| 엔진 vs 오라클(양력) | 골든 32건 × 2규칙, 무작위 3,000건 × 2 = 6,000비교 **전부 일치** | PASS |
| 절입 시각 | 1930~2025 2,304개, 최대 55.8초·평균 11초 차(허용 120초) | PASS |
| 절입 ±10분 경계 | 130건 전부 일치 | PASS |
| 엔진 버그 | 양력 경로 0건. 음력 변환(고객 경로 없음)은 중국 음력이라 43/1,152개월 다름 | 보고(수정 보류) |
| 고객 사례 2000-05-11 17:05 여 | 庚辰 辛巳 己巳 壬申 (엔진·오라클 같음. 현 운영 84826020은 癸酉) | PASS |
| 1999-07-31 07:30 | 己卯 辛未 甲申 戊辰 — 기존 외부 픽스처 戊辰과 같음(−32분이면 丁卯) | PASS |
| 문서 | 골든 CSV 2열, 정책 §1.4, CS FAQ | 완료 |
| 릴리스 준비 | §4 | §4 |
| 판매 품질 | 계산 검증만 했다 | UNVERIFIED |

## 1. 대상 확인

- `v5/phase0-version-tolerant` = 463c4f8e (origin에 있음), `v5/manseryeok-merge` = 3e53c123 (origin에 없음, 이번 커밋 포함 push 필요).
- 로컬 `master`(5f71a7d0)는 origin보다 200커밋 뒤라 쓰지 않는다. 릴리스는 SHA를 origin master로 fast-forward push한다.
- 정책 코드: `src/lib/saju/calcPolicy.ts` `DEFAULT_SAJU_TIME_POLICY`, 시각 변환 `solarTime.ts` `civilToUtc`(Intl `longOffset`).

## 2. 독립 오라클 (`tests/oracle/`, `src/lib/saju` import 없음)

| 부분 | 방법 | 자체 검증 |
|---|---|---|
| a) 시각 | Intl `formatToParts`로 서울 벽시계를 직접 읽어 UTC를 찾음(엔진의 오프셋 문자열 방식과 다름). Node ICU 78.3, tz 2026a | 1954-03-21 UTC+8:30, 1961-08-10 UTC+9(00:00~00:29 없음), 1948~51·1987~88 UTC+10, 1955~60 UTC+9:30, 1987-05-10 02:30 없음·10-11 02:30 중복 |
| b) 일주 | 율리우스일 `(JDN+49) mod 60` | JDN(2000-01-01)=2451545, 2000-01-01 戊午, 1949-10-01 甲子, 2024-02-04 戊戌(HKO) — 세 앵커 일치 |
| c) 시주 | 지방평균태양시 = UTC + 경도/15시간, 五鼠遁. 통자시·분리형 둘 다 | 필수 사례, 23:40 두 규칙 |
| d) 년·월주 | astronomy-engine 2.1.19 겉보기 태양 황경(입춘 315°, 30°마다 節) | 2024 입춘 17:27, 입하 09:10 KST(KASI) |
| e) 음력(추가) | KST 합삭 날짜로 달 시작, 中氣로 달 번호 | 1990·2025 설날, 2024 추석, 2023 윤2월, 2020 윤4월, 2024 윤3월 없음 |

- 허용치: 절입 시각 차 ≤ 120초(실측 최대 55.8초, 2003-02-19 우수). 절입 ±10분 출생은 `docs/v5/oracle-jie-boundary-cases.csv`로 따로 둔다.
- 무작위 3,000건 구성: 균등 2,000 · UTC+8:30 400 · 서머타임 300 · 절입 ±15분 200 · 22:30~01:29 100 (시드 20261028).
- 재실행: `ORACLE_WRITE=1 pnpm exec vitest run tests/oracle` (표 재생성), 기본 `pnpm test`에도 포함(약 9초).

### 2.1 불일치 분류

| 분류 | 엔진 vs 오라클(양력 6,000 + 골든 64) | 음력 초하루 1,152개월(추가 스캔) |
|---|---|---|
| (가) 엔진 버그 | 0 | 41 (중국 UTC+8 합삭 날짜 38, 윤달 위치 3: 2012·2017·1965) |
| (나) 오라클 한계 | 0 | 2 (1984-12, 1985-01: 오라클의 윤달 규칙 단순화) |
| (다) 의도된 정책 차이 | 0 (오라클이 같은 정책을 구현) | 0 |

- 음력 (가)는 외부 사실로 확인된다: 1997 한국 설날 02-08(엔진 02-07), 2012 한국 윤3월(중국 윤4월), 2017 한국 윤5월(중국 윤6월).
- **수정하지 않았다.** 유료 생성 핸들러 5종이 모두 `calendarType: "SOLAR"`를 고정하고, 입력 화면도 양력만 받는다. LUNAR를 받는 곳은 미리보기(`preview_memory`) API뿐이다. 고치려면 한국 음력 기준(KASI 표 또는 천문 계산)을 엔진에 넣는 별도 작업이 필요하고, 릴리스 2 직전에 고객 경로에 없는 계산을 바꾸는 것은 위험만 늘린다. 결정 필요: (1) 음력 입력을 열 때 한국 음력으로 구현, (2) 지금 엔진에서 LUNAR를 거부.
- (다) "의도된 정책 차이"는 다른 앱 설정과의 비교에서 나온다(§3).

## 3. 다른 앱 설정과의 차이 (정책 차이 구간)

무작위 3,000건에서 우리 기준과 결과가 달라지는 비율(`docs/v5/oracle-comparison.md`):

| 설정 | 일반 | UTC+8:30 | 서머타임 | 주로 달라지는 기둥 |
|---|---|---|---|---|
| −30 야자시/조자시 | 5.6% | 5.9% | 3.1% | 일주 |
| −32(서울 126.98°E) | 2.2% | 3.9% | 1.9% | 시주 |
| −30 고정(당시 시간대 미반영) | 0.0% | 29.6% | 36.2% | 시주 |
| 보정 없음 | 26.2% | 2.4% | 64.2% | 시주 |

- 구간 설명표: `docs/manseryeok-policy.md` §1.4. 골든 CSV `other_app_settings` 열에 사례별 결과.
- CS 응대: `docs/v5/cs-manseryeok-faq.md` (내부용).

## 4. 릴리스 준비 (배포하지 않음)

| 항목 | 결과 | 판정 |
|---|---|---|
| Release 1 | master ← `463c4f8e`, fast-forward 가능(+1) | 준비됨 |
| Release 2 | master ← `v5/manseryeok-merge` HEAD(Phase 0 + 10 + P01 커밋), Release 1 뒤 fast-forward 가능. **origin에 아직 push 안 함**(Preview용 기능 브랜치 push 필요) | 준비됨 |
| `scripts/verify-books-readonly.ts` | `/r/gr_…` GET + `/book-data` JSON 확인, Next.js 오류·제품 오류 화면 문구 감지, 다른 호스트 리다이렉트(SSO) FAIL. 쓰기·로그인 없음. 단위 4건, 로컬 서버 스모크 | PASS(로컬) / UNVERIFIED(운영 URL) |
| `docs/v5/release-phase0-manseryeok.md` | 순서·명령·배포 전후 점검·롤백(Phase 0 배포로 Vercel Instant Rollback, 대안은 revert fast-forward push, force 금지). 84826020 롤백 금지(Release 1 단독 실패이고 v5 리포트가 0건일 때만 예외) | 완료 |
| `docs/publish-failure-query.sql` | migration 스키마와 모두 일치(수정 없음). 헤더 보강, [6] 7·30일 상태 집계 추가. SELECT만. 로컬 PGlite(전체 migration)에서 6개 쿼리 실행·손계산 일치 | PASS(로컬) / UNVERIFIED(운영) |
| tsc / lint / build | 최종 트리 오류 0 / 0 / 성공 | PASS |
| 전체 테스트(3e53c123) | 630파일 중 154 실패 = 기준선 140 + 알려진 3 + 부하 11. 11개 단독 재실행 11/11 PASS. **신규 실패 0** | PASS |
| P01 추가 테스트 | `tests/oracle` 3파일 + saju·스크립트 관련 30파일 381건 PASS | PASS |

- Vercel Production Branch가 `master`인지는 저장소로 확인할 수 없다(UNVERIFIED). 배포 전 Settings → Git에서 확인.
- 릴리스 2 diff에 `supabase/` 변경 없음. `package.json`은 devDependency `astronomy-engine` 한 줄(테스트 전용, 번들에 안 들어감).

## 5. 사용자가 할 일

1. 운영 Supabase SQL 편집기에서 `docs/publish-failure-query.sql` [1]·[6] 실행·기록(읽기 전용).
2. 기존 Book 공유 URL 3개 준비(저장소 밖 파일).
3. Vercel Production Branch = master 확인.
4. Release 1: 채팅에 정확히 **PHASE0 배포 승인** 입력 → 제가 fast-forward push·READY/SHA 확인·URL 3개 검증.
5. Release 2 전: Preview에서 원고 사람 확인(판매 품질), 그다음 **만세력 배포 승인**.
6. 음력 엔진 처리 결정: (1) 음력 입력 열 때 한국 음력 구현 (2) 지금 LUNAR 거부.

## 6. 커밋

| SHA | 내용 |
|---|---|
| 12f8952b | 오라클, 골든 CSV 2열, astronomy-engine devDependency |
| f04c9f80 | 정책 §1.4, CS FAQ, 음력 주의 |
| (다음 커밋) | verify 스크립트·테스트, 런북, SQL 최종본, 보고서 |
