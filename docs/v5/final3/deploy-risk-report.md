# v5 최종3 — 배포 차단 위험 점검 보고 (2026-11-05)

브랜치 `v5/final` (worktree `~/Developer/gyeol-worktrees/v5-final`, 기준 HEAD 1f268605). 커밋 없음(리드가 경로 지정 커밋).
운영 DB·Vercel env·배포 접근 없음. 로컬 Supabase(Docker)만 읽고, 새 migration 1개만 로컬에 적용(아래 1-4).
3800 dev 서버(목업 작가·빈 키·로컬 Supabase)는 그대로 두고 핫 리로드로 확인했다.

## 요약

| # | 항목 | 판정 | 한 줄 근거 |
|---|---|---|---|
| 1-1 | 열람 → 검증 → 격리 → SQL 경로 확인 | PASS(확인) | `page.tsx:157` → `readPublishedReport` → 실패 시 `store.call("quarantine")` → SQL이 status 변경(기본 본문은 `snapshot_json=null`) |
| 1-2 | 새 검사(정답지·렌더·시점·라벨·의미 검수)가 열람 경로에 없음 | PASS | 열람 진입점 6곳 import 그래프(동적 import 포함, esbuild·TS 그래프 둘 다)에 `factsheet/**`·`writer/review`·`repair3`·`safety/p6c` 0개. 자동 시험으로 고정 |
| 1-3 | 열람 검증은 발행 당시 계약(저장된 판 계열)으로만, 실패해도 격리 없이 로그만 | PASS | `readPublishedReport` 수정: quarantine 호출 삭제, `REPORT_READ_VALIDATION_FAILED` 로그. 검사기는 저장된 판으로 고름(v5→v5 계약, v4→v4 계약, 그 밖→기존 열람 검사) |
| 1-4 | 격리가 snapshot_json을 지우거나 덮는 경로 제거(TS·SQL) | PASS(로컬) | TS 호출 0. 새 migration `20261105130000_v5_final3_read_no_quarantine.sql`: quarantine 동작은 어떤 행도 안 바꿈(기본·R1 본문 둘 다 PGlite 시험 + 로컬 Docker 적용). 운영 적용은 안 함 |
| 1-5 | R1 운영 적용 여부 | 확인 완료(덕짱님, 격리 시 내용 보존, 단 열람 불가) | 확인용 SELECT 아래 7절 |
| 1-6 | 회귀: v1·1.0·v2 / v4 / v5 열람 격리 0, 화면 변화 0 | PASS(데이터·렌더) / PARTIAL(HTTP 본문) | 로컬 10권 HTTP + 열람 데이터 15권 + vitest 19권 전후 해시 같음, DB 행·격리 수 같음. HTTP에서 v4·v5 본문은 계정 재동의 상태 때문에 안내 화면만 비교(아래 1-6 주의) |
| 1-7 | **새로 발견: 약관 재동의 전 회원은 산 책을 못 연다** | FAIL(결정 필요) | 최종3 문서 버전(2026-11-05.1) 뒤 기존 회원은 `needs_consent` → `/reports/<id>`가 "리포트 상태를 확인하지 못했습니다". 아래 1-7 |
| 2-1 | WRITER_V5_PRODUCTS 정확한 값 | PASS | `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility` |
| 2-2 | 비었거나 4종과 다르면 서버 시작 경고 | PASS(단위) / UNVERIFIED(실제 시작 로그) | `src/instrumentation.ts` register → `WRITER_V5_PRODUCTS_MISMATCH` 한 줄. dev 서버가 컴파일함(.next/dev/server/instrumentation.js), 재시작 금지라 시작 로그 실측 없음 |
| 2-3 | 대운·세운 판매 중지(화면·준비·확인) | PASS(고침 1곳) | 화면·결제 준비·주문 생성·이용권은 이미 막힘(HTTP 409 확인). **확인(승인) 단계는 안 막혀 있었다** → 승인 전 주문만 막음(토스 승인·주문 선점 없이 409) |
| 3 | /dev/* 운영 노출 | PASS(고침) | 고치기 전: 라우트별 가드, 미리보기 6쪽+내보내기 1곳은 `*_DEV_PREVIEW_ENABLED=1`이면 운영에서 열림. 고친 뒤: `src/proxy.ts`가 배포 빌드에서 /dev/* 전부 404. 리더 정상(HTTP·단위) |
| 4 | 아이폰 Safari 구형 이미지 | 원인 확인·고침 | 운영(master) og:image = 옛 파일 `/brand/gyeol-report-og.png`(1536×1024 검은 바탕). 새 이미지(1200×630 책 진열)는 v5 브랜치에만 있음 → 배포로 해결. 추가로 옛 주소 파일도 새 이미지로 교체 |
| env | REPORT_PRICE_KRW · OpenAI env 3개 | 확인 | REPORT_PRICE_KRW는 코드가 env로 읽지 않음(상수 1490) → 넣지 않음. OPENAI_REPORT_* 2개는 v5가 안 읽음, OPENAI_API_KEY는 임시본 레인만 읽음 |

---

## 1. 과거 Book 보호

### 1-1. 고치기 전 경로 (파일:줄, 고치기 전 기준)

1. `src/app/reports/[reportId]/page.tsx:156-157` — `validator = validateBookPublication`(공개 게이트는 항상 true: `src/lib/book/publicGate.ts:5`) → `readPublishedReport(createPaidReportReliabilityStore(), reportId, validator)`.
   - 공유 주소 `/r/[token]`도 `src/app/r/[token]/page.tsx:350` → (v4 외) `ReportResultPage` → 같은 경로.
2. `src/lib/book/storedReport.tsx:13-17` — 저장된 판으로 검사기 선택: `v5` → `validateV5Publication`(`src/lib/writer/book.ts`, 구조 검사), `v4` → `validateV4Publication`(`src/lib/interpretation-v4/runtimeProjection.ts:88`, "Frozen snapshot validation only"), 그 밖(v1·1.0·v2·v3) → `validateProductPublication`(`src/lib/report-generation/productPublishGate.ts:52`).
3. `src/lib/payment/paidReportReliability.ts:114-131`(고치기 전) — 검사 실패 → 모르는 계산 버전이면 숨기기만, 아니면 **`:128 await store.call("quarantine", { reportId, expectedSnapshot })`** → `FAILED_REQUIRES_ATTENTION` 반환.
4. `src/lib/payment/paidReportReliabilityStore.ts:24` — `rpc("paid_report_reliability", { p_action: "quarantine" })`.
5. SQL `quarantine` 분기:
   - 기본 migration `supabase/migrations/0013_paid_report_reliability.sql:185-188`, `supabase/migrations/20260920163924_production_reliability_reconcile.sql:432-435`: `update paid_report_snapshots set status='FAILED_REQUIRES_ATTENTION', snapshot_json=null …` → **내용 삭제, 복구 불가**.
   - R1 패치 `scripts/paid_report_quarantine_recovery_patch.sql:149-167`(운영 적용 확인됨): 내용은 남기고 status만 `FAILED_REQUIRES_ATTENTION`, 작업 `PUBLISHED_SNAPSHOT_VALIDATION_FAILED`.
   - `read_report`(`…reconcile.sql:426-431`)는 `status='COMPLETED'`일 때만 snapshot을 준다 → R1에서도 격리되면 고객은 못 본다. `admin_retry`(`:436-442`)는 원본 복원이 아니라 재생성(QUEUED)이다.
- 이용권 책(`src/lib/tickets/ownerRead.ts`)·공유 저장소(`src/lib/sharing/reportShareStore.ts:62`)는 원래 격리를 부르지 않는다(읽기만).

### 1-2. 새 검사는 열람 경로에 없음 (import 그래프)

- 진입점: `src/app/reports/[reportId]/page.tsx`, `src/app/r/[token]/page.tsx`, `src/app/r/[token]/book-data/route.ts`, `src/app/r/[token]/book-og/route.tsx`, `src/lib/book/storedReport.tsx`, `src/lib/tickets/ownerRead.ts`.
- esbuild metafile(번들, 동적 import 포함): 진입점별 src 파일 409·414·341·343·321·240개. `src/lib/factsheet/**`, `writer/{review,repair3,repair,publish,runner}.ts`, `writer/safety/p6c.ts`, `writer/prompt/index.ts`, `llm/**`, `ops/generation/**` **0개**.
  닿는 writer 모듈은 `writer/book.ts` → `brief/chart.ts` → `writer/safety/{lint,patterns,sentences}.ts` → `writer/prompt/examples.ts`(상수 `DAYUN_PHASE_KO`·`splitSentences`·예문 목록을 가져올 뿐, 검사 실행 없음).
- 자동 시험: `tests/unit/book/readPathProtection.test.tsx` "새 발행 검사는 열람 경로에 없다" — 저장소 TS 그래프(`tests/helpers/moduleDependencyGraph.ts`)로 위 목록이 0인지 고정한다(다른 레인이 열람 경로에 새 검사를 import하면 이 시험이 깨진다).

### 1-3·1-4. 바꾼 내용

- `src/lib/payment/paidReportReliability.ts` `readPublishedReport`(현재 :137-159):
  - quarantine 호출 삭제. 저장소 쓰기 0.
  - 검사 실패 → `console.error({"event":"REPORT_READ_VALIDATION_FAILED", reportId, productType, productVersion, errors})` 후 이번 열람만 `FAILED_REQUIRES_ATTENTION`(손상 내용은 그리지 않고 기존 안내 화면). 저장본은 그대로라 코드를 고치면 다음 열람에 다시 열린다.
  - 검사기 예외 → `READ_VALIDATOR_EXCEPTION`로 같은 처리(예전엔 예외가 그대로 터짐). 스냅샷 모양·reportId 불일치 → `REPORT_READ_SNAPSHOT_MISMATCH` 로그.
  - 모르는 계산 버전(롤백 대비) 처리는 그대로(`REPORT_READ_UNKNOWN_CALCULATION_VERSION`).
  - 검사기 선택은 그대로 `validateBookPublication`(저장된 판 계열). 발행 경로의 새 검사와 섞이지 않는다.
- 새 migration `supabase/migrations/20261105130000_v5_final3_read_no_quarantine.sql`:
  - `pg_get_functiondef`로 본문을 읽어 `elsif p_action = 'quarantine' then` 바로 뒤에 `return {ok:true, quarantined:false, code:'READ_QUARANTINE_DISABLED'}` 한 줄만 넣는다. 분기가 정확히 1개가 아니면 `REVIEW_READ_NO_QUARANTINE_BASE`로 멈춤, 이미 들어 있으면 그대로(재실행 안전). 기존 행 변경 0, CREATE OR REPLACE라 소유자·권한 유지.
  - 모든 본문(0013, reconcile, scripts 패치 6개)에 이 분기 글자가 정확히 1번 있는 것 확인(grep). `20261105090000_v5_final_payment_recovery_price_free.sql`과 같은 함수의 다른 조각을 고치므로 순서 무관.
  - 효과: 옛 앱으로 롤백해도 열람이 고객 Book의 status·snapshot_json을 못 바꾼다.
  - **로컬 적용**(Docker `supabase_db_gyeol-report`): 적용 전 본문 보관 → 적용 2회(두 번째는 무동작) → 본문의 `READ_QUARANTINE_DISABLED` 1회 확인 → `local_dev.applied`에 이름 기록. 되돌리기: `scripts/paid_report_quarantine_recovery_patch.sql`부터 결제 패치를 다시 실행하거나 보관 본문 실행.
- 기존 시험 갱신(옛 정책 "열람 실패 → 격리"를 단언하던 것): `tests/unit/app/reports/postPaymentExperience.test.tsx`(2), `tests/unit/app/reports/completedReadingExperience.test.tsx`(2), `tests/unit/payment/readVersionTolerance.test.ts`(1), `tests/unit/payment/paidReportReliability.test.ts`(R1 SQL 격리·복구 묶음은 열람 대신 SQL `quarantine`을 직접 불러 기존 R1 동작을 그대로 시험, 열람 시험은 "행 그대로"로).

### 1-6. 회귀 시험 (바꾸기 전·후)

방법: 바꾸기 전에 (a) 3800 dev 서버 HTTP 열람 10권 + DB 상태, (b) 열람 데이터(BookData) 해시, (c) vitest 렌더 19권을 기록 → 코드·migration 적용 → 같은 것을 다시 기록 → 비교.
열기 전에 10권 모두 현재 검사기 통과를 오프라인으로 확인해(바꾸기 전 열람이 격리를 부르지 않게) 로컬 DB를 바꾸지 않았다.

**(a) HTTP `/reports/<id>` (dev 로그인 as=final) — 보이는 글자 sha256 앞 16자, 전 = 후**

| 책 id | 판 | 상품 | 전 | 후 | 비고 |
|---|---|---|---|---|---|
| report_b40c07ad86a04041abaae1ac6167496f | v1 | annual_fortune | 44202a0679860a3b (21,736자) | 같음 | 본문 전체 렌더 |
| report_a9861bfda5f7416fa9669d395ee851fd | v2 | saju_mbti_full | 1fbc852a2a706471 (19,095자) | 같음 | 본문 전체 렌더 |
| report_e52000519fb74c45aa21f266cdeaabf7 | v4 | saju_mbti_full | 9c762b60e4c1a1d3 | 같음 | 소유 확인 화면(1-7) |
| report_4627a98845684c309de936615a49f4a0 | v4 | annual_fortune | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_ef42d66ffef340f0b9de46d2eb57af16 | v5 | saju_mbti_full | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_fe29cb0ed88a4a459c14f1b377a3a9bf | v5 | career_money_study | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_a29459e21b9548e79d3e3a5cd33e118e | v5 | love_marriage_child | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_4d95800013d242e48022248ca9394bf2 | v5 | saju_mbti_compatibility | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_a3f66262d9994051aef2a8e5c1bc919c | v5 | major_fortune | 9c762b60e4c1a1d3 | 같음 | 〃 |
| report_ebef1f15cf884714806f354e4b611f56 | v5 | annual_fortune | 9c762b60e4c1a1d3 | 같음 | 〃 |

DB(전·후, 열람 직전·직후 모두): `paid_report_snapshots` 행별 (status, md5(snapshot_json)) 차이 0, `report_generation_jobs` 차이 0.
격리 수: snapshots `COMPLETED 168 / FAILED_REQUIRES_ATTENTION 6(모두 생성 실패, 내용 없음, 기존) / GENERATING 7 / RETRYING 1`, 작업 `last_error_code ∈ {READ_GATE_REJECTED, PUBLISHED_SNAPSHOT_VALIDATION_FAILED}` = **0 → 0**.
로컬 v4 결제 Book은 2권뿐이라 v4 3권 이상은 (b)·(c)로 채웠다.

**(b) 열람 데이터(화면이 그리는 BookData) sha256 앞 16자, 전 = 후** (`projectV5Book`·`projectBook`, 기준일 2026-11-05)

| 책 | 판 | 검사 | BookData 전=후 | 저장본 전=후 |
|---|---|---|---|---|
| report_4627a988… | v4 annual | PASS | ac20e0cef0414b24 | c2a5368c06a515d7 |
| report_e5200051… | v4 full | PASS | 9d496d037f88e938 | f7b2b268de03d585 |
| fixture career-editorial-base | v4 career | PASS | 3433aecbc708ec64 | cf96bffa943a8226 |
| fixture compatibility-editorial-base | v4 compat | PASS | 8bcb9449a5818250 | fee67074fbd811dd |
| fixture love-editorial-base | v4 love | PASS | 6ba4bbcd00254e12 | 66a21a8f1f5416e3 |
| fixture career-quality-01/previous-book | v4 career | PASS | d61e87fd36ac008c | 136f1eab61327fd6 |
| fixture comprehensive-quality-01/previous-book | v4 full | PASS | e14c10e82ab8e761 | 14043ae8dad2929b |
| report_ef42d66f… | v5 full | PASS | 4e5146ca949c7efd | e7d1f319c1a5e524 |
| report_fe29cb0e… | v5 career | PASS | 29f4f9ad651c5599 | 5a6cdd0ba76501b2 |
| report_a29459e2… | v5 love | PASS | 50847f05fce0af3d | 4e5a87784ce90fce |
| report_4d958000… | v5 compat | PASS | 89c7b5db7b527a06 | 602dfaaf966adfce |
| report_a3f66262… | v5 major | PASS | 0359f7e39d4945b0 | fa1e45b4ce59b727 |
| report_ebef1f15… | v5 annual | PASS | d3f9165dc6c5905f | 5dc60ea0cf5eeaea |
| report_b40c07ad… | v1 annual | PASS | (Book 아님) | 4df8fba7a16c341a |
| report_a9861bfd… | v2 full | PASS | (Book 아님) | 8e818f18d632301a |

**(c) vitest `tests/unit/book/readPathProtection.test.tsx` — 실제 리포트 페이지(`ReportResultPage`, NODE_ENV=production) 렌더, 저장소 호출·보이는 글자·BookData 해시**
운영 모양 fixture(`tests/fixtures/production-version-combos`: 덕짱님이 확인한 운영 계열 v1·1.0·v2·v4) + 이전 판 v5 저장본(`docs/v5/baseline/p6d` 제5판, `p6e` 제6판).

| 계열 | 책 | 호출(후) | 글자 전=후 | BookData 전=후 |
|---|---|---|---|---|
| v1 | career_money_study-v1 | read_report | 78782a72fe9573f2 | — |
| 1.0 | saju_mbti_compatibility-1.0 | read_report | fb5965b0c923702c | — |
| v2 | saju_mbti_full-v2 | read_report | 619c725e49060c53 | — |
| v4 | annual_fortune-v4 | read_report | 36d6be46be304511 | ac79b825e9813543 |
| v4 | career_money_study-v4 | read_report | 50e131463e4e103d | 6da0bc79e61bb019 |
| v4 | love_marriage_child-v4 | read_report | 8bb9e880ea69a842 | 8e60a9249c015b5c |
| v4 | major_fortune-v4 | read_report | f59068a8d2153e20 | fb85ff444220c07f |
| v4 | saju_mbti_compatibility-v4 | read_report | d167a63b8bc0100e | ba4b3d8a2b8fd3aa |
| v4 | saju_mbti_full-v4 | read_report | 58492d4fd14c0e62 | 5990ee03839d8578 |
| v5 | p6d/chaerin-love | read_report | e5e49bdb03497f48 | e6ded5977508b0b1 |
| v5 | p6d/haram-full-p6c | read_report | 55e3abb9b3668a98 | 8d1518258db05c3f |
| v5 | p6d/pair-business | read_report | 1968c0f9ac6c46fb | 7ec559c674dcee5b |
| v5 | p6d/sodam-full | read_report | 24c323e76d28b315 | 1de38a8200dccd80 |
| v5 | p6d/taeo-career | read_report | 91dbd358fd2e8695 | b88fcb962ed76b84 |
| v5 | p6e/chaerin-love | read_report | 4f6f37aaac2bb697 | 43ce3956fe1f5cd3 |
| v5 | p6e/pair-business | read_report | 309c023ea96a2bd2 | a9e60b7227729119 |
| v5 | p6e/seoha-love-single | read_report | 11578b9bc66d6be5 | 1b1957d44069687e |
| v5 | p6e/sodam-full | read_report | 6f06de46c14bc74a | 57931219308b955b |
| v5 | p6e/taeo-career | read_report | acfc845523e6426d | 25375948ccc0ac7f |

손상본(같은 판 계약 검사에 걸리는 것: v2 근거 없음·v4 화면 투영 불일치·v5 근거 판 불일치): **바꾸기 전 `["read_report","quarantine"]` → 바꾼 뒤 `["read_report"]`**, 내용 미표시, `REPORT_READ_VALIDATION_FAILED` 로그 1줄. 검사기 예외도 격리 없음.
SQL(PGlite): 기본 본문(snapshot_json=null로 지우던 것)·R1 본문 둘 다 새 migration 2회 적용 뒤 `quarantine` → `{ok:true, quarantined:false, code:"READ_QUARANTINE_DISABLED"}`, 행(status·snapshot_json·작업 상태) 그대로, `read_report`가 COMPLETED 내용을 준다.
→ 시험 전(코드 바꾸기 전) 23 통과 / 5 실패(옛 동작: 격리 호출 3, 검사기 예외 1, 시험 준비 1), 바꾼 뒤 **28/28 통과**.

### 1-6 주의 — HTTP에서 v4·v5 본문을 못 그린 이유
로컬 검수 계정(p6e-final)의 동의 기록이 `terms 2026-06-14.1 / privacy 2026-09-22.1`인데 코드(1f268605)가 `2026-11-05.1`을 요구 → `accountSession`이 `needs_consent` → `canReadPurchasedBook` false → "리포트 상태를 확인하지 못했습니다". 그래도 이 화면 전에 `loadPageState`가 열람 검사(`readPublishedReport`)를 먼저 돌리므로 격리 여부는 HTTP로 검증됐다. 본문 렌더는 (b)·(c)로 대신 증명.

### 1-7. 새로 발견한 배포 위험 — 약관 재동의 전 회원은 산 책을 못 연다 (FAIL, 결정 필요)
- 근거: `src/lib/account/policy.ts:18-26`(`needsRequiredReconsent` → 문서 버전이 하나라도 다르면 `needs_consent`), `src/lib/book/shareServer.ts:33-43`(`mayShareBook`: member일 때만 소유 확인, 아니면 7일 claim 쿠키뿐), `src/lib/book/ownerAccess.ts:22-27`, 이용권 책 `src/lib/tickets/ownerRead.ts:15`(member만).
- 영향: 배포 직후 기존 회원 전원이 재동의 전까지 `/reports/<id>`(결제 v4·v5 Book)와 이용권 책을 못 연다. 화면은 재동의 안내가 아니라 "확인하지 못했습니다/고객센터 문의". 로그인 뒤 재동의(`/account`의 needs_consent 화면)를 하면 서재에서 열린다. 비회원 구매(claim 쿠키 7일)도 기한이 지나면 같다.
- 선택지(덕짱님 결정): ① 열람은 이전 동의로 허용(산 책 읽기는 새 약관 동의 없이) — `canReadPurchasedBook`·`readOwnedTicketReport`에서 "프로필 있음 + 재동의 필요"도 소유 확인 허용. ② 동의는 필요 — `/reports/<id>`에서 needs_consent면 재동의 화면으로 보내는 안내로 바꿈(`safeAccountNext`는 `/reports/*`를 허용하지 않아 재동의 뒤 서재로 감).
  이 레인에서는 바꾸지 않았다(법무·제품 판단).

## 2. WRITER_V5_PRODUCTS · 대운·세운

### 2-1. 정확한 값
- 코드: `src/lib/writer/flags.ts:7-9` — `env.WRITER_V5_PRODUCTS`를 **쉼표**로 나누고 앞뒤 공백 제거, `PRODUCT_KEYS`(`src/data/knowledge-v5/schema.ts:26`, 상품 키 — 주소 조각(slug) 아님)에 있는 것만, 중복 제거. 순서 무관.
- 운영 값(출시 4종): **`saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility`** (상수 `LAUNCH_V5_PRODUCTS_VALUE`, `flags.ts:13`).
- 비었을 때: 결제 워커 v5 훅 없음(`src/lib/book/paidRuntime.ts:41-45`) → 6상품 모두 V4 생성, 이용권 큐도 V4(`src/lib/tickets/publicationWorker.ts:21-22`), 입력 화면 AI 고지·열람 기간 v5 표시 없음(`src/components/book/BookRoutes.tsx:16` → `BookInput.tsx:44`), 이용권 v5 이어받기 크론 404(`src/app/api/internal/report-writer-recovery/route.ts:13`).

### 2-2. 서버 시작 경고
- `src/instrumentation.ts`(Next 16 `register`, 새 서버 인스턴스마다 1번, nodejs 런타임만) → `writerV5ProductsWarning()`(`flags.ts:19-27`)이 null이 아니면 `console.warn` 한 줄. 동작은 안 바꾼다.
- 로그 문구(JSON 한 줄):
  - 비었을 때: `{"event":"WRITER_V5_PRODUCTS_MISMATCH","message":"WRITER_V5_PRODUCTS가 비어 있습니다(또는 아는 상품 키가 없습니다) — 6상품 모두 V4로 생성됩니다.","expected":"saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility","parsed":[],"missing":[…4개],"extra":[],"ignored":[]}`
  - 다를 때: `"message":"WRITER_V5_PRODUCTS가 출시 4종과 다릅니다 — 빠진 상품은 V4로 생성됩니다."` + `missing`(빠진 키)·`extra`(더 들어간 키)·`ignored`(모르는 글자, 예: `saju-mbti-full`).
- Vercel 로그 확인: 배포 직후 Runtime Logs에서 `WRITER_V5_PRODUCTS_MISMATCH` 0건이어야 한다(로컬 dev는 6종이라 경고가 나오는 게 정상).

### 2-3. 대운·세운 차단 확인 표

| 지점 | 파일:줄 | 고치기 전 | 확인 |
|---|---|---|---|
| 홈 진열·입력 화면 | `src/components/book/BookRoutes.tsx:13,16` → `BookInput.tsx:41` `SalesClosedNotice` | 막힘 | HTTP `/report/new?product=major-fortune`·`annual-fortune` → "12월 1일 · 2027 신년판 공개" |
| 결제 준비 API | `src/app/api/payment-checkout/prepare/route.ts:364-366` | 막힘 | HTTP POST major/annual → 409 `PRODUCT_SALES_CLOSED` |
| 주문 생성 API | `src/app/api/payment-orders/create-ready/route.ts:91-94` | 막힘 | 로컬은 API 자체 404(꺼짐), 코드상 409 |
| 이용권 사용·발행 | `src/lib/tickets/service.ts:25`, `src/lib/tickets/publication.ts:20` | 막힘 | 코드 |
| **결제 확인(승인)** — `/api/payments/toss/confirm`, `/payments/toss/success` | `confirmPaidReport`(`src/lib/payment/paidReportReliability.ts:29-31`) | **안 막힘** | **고침**: 승인 전(`status='ready'`) 판매 중지 상품 주문은 `find_order`로 확인해 토스 승인·`confirm_claim` 없이 `PRODUCT_SALES_CLOSED`(API 409, 결제 완료 화면 "지금은 판매하지 않는 상품이에요 … 이 주문은 결제를 승인하지 않았어요."). 이미 승인된 주문·주문 조회 실패·`FORTUNE_SALES_OPEN=1`은 기존 흐름 그대로 |
| 쿠폰 결제 | `src/lib/coupons/service.ts:38`(isPurchasable만) | 운영 경로 없음 | 공개 라우트 없음(`/dev/account/api/coupon-*`만, 이제 운영 404) |

- 왜 필요했나: 운영(master d846c2ea)은 지금 대운·세운을 판다(`isPurchasable: true`, 닫는 코드 없음). 배포 순간 master에서 결제창을 연 대운·세운 주문이 새 배포의 승인 단계로 오면 결제·V4 생성이 됐다.
- 결제 흐름 자체(선점·토스 승인·금액 대조·finish·복구 큐)는 그대로. 게이트는 HTTP 승인 진입점 2곳만 넘긴다(결제 복구·시험 도구는 그대로).

## 3. /dev/* 운영 차단

- 고치기 전(코드): 라우트별 가드. 대부분 `NODE_ENV==="development"`(+localhost) 또는 `localAccountAllowed`·`localDevAuthAllowed`·`manualReviewAllowed`로 운영 404. 예외 7곳은 env 하나로 운영에서 열림: `comprehensive-preview`(`COMPREHENSIVE_DEV_PREVIEW_ENABLED`), `career-report-preview`, `compatibility-preview`, `love-marriage-child-report-preview`, `major-fortune-preview`+`/export`(`MAJOR_FORTUNE_DEV_PREVIEW_ENABLED`), `annual-fortune-preview`(`ANNUAL_…` 또는 `COMPATIBILITY_…`). proxy/middleware 없음. → PARTIAL(기본 닫힘, env로 열림).
- 고친 뒤: `src/proxy.ts`(Next 16 proxy 파일 규약, 문서 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` 확인) matcher `["/dev/:path*"]`, 판정 `src/lib/devRouteGate.ts` `devRoutesBlocked(env) = NODE_ENV==="production"`(Vercel Production·Preview·next start). 걸리면 라우트·서버 함수 실행 전 `404`(`cache-control: no-store`, `x-robots-tag: noindex, nofollow`). 요청 값·`*_DEV_PREVIEW_ENABLED`로 못 연다.
- 파일 이동 없음: 운영 리더가 import하는 `src/app/dev/book-preview/*`(BookReader·bookProjection·bookTypes)는 주소가 아니라 모듈이라 영향 없음. 리더 주소(`/reports/*`, `/r/*`)는 matcher 밖.
- 시험:
  - 단위 `tests/unit/ops/final3DeployRisk.test.ts`: production에서 `/dev/v5-login`·`/dev/book-preview`·`/dev/account/api/…`·`/dev` → 404, 미리보기 env 켜도 404, development·test는 통과, `/reports/<id>`는 통과, matcher 고정.
  - 3800 dev 서버: proxy가 컴파일됨(`.next/dev/server/middleware.js`가 `src/proxy.ts`를 가리킴) + `/dev/v5-login` 307, `/dev/book-preview` 200(개발이라 통과), `/reports/report_b40c…` 200·본문 해시 전과 같음.
  - 운영 리더 렌더(NODE_ENV=production)는 1-6 (c) 19권 시험이 같은 페이지 컴포넌트로 확인.
  - 운영 빌드에서의 실측(`next build`·`next start`)은 금지라 UNVERIFIED.

## 4. 아이폰 Safari 제안 이미지

| 무엇 | 가리키는 파일 | 크기(px) | 바이트 | 수정 시각(worktree) | sha256 앞 16 | git 마지막 | 운영(master) |
|---|---|---|---|---|---|---|---|
| og:image·twitter:image (v5 브랜치) | `public/brand/gyeol-report-og-20261030.png` (`src/lib/sharing/reportShareMetadata.ts:5` `SHARE_IMAGE`, `src/app/layout.tsx:41-62`) | 1200×630 | 44,427 | 2026-11-04 22:09 | edee6262d69e6881 | 0532995b(11-04) | **없음(404)** |
| og:image (운영 master) | `public/brand/gyeol-report-og.png` | 1536×1024 | 1,329,108 | 2026-11-04 21:54 | 44cf010c9f3afcb5 | bc10aa4e(09-29) | **지금 운영 og:image** |
| apple-touch-icon | `src/app/apple-icon.png` → `<link rel="apple-touch-icon" href="/apple-icon.png?…" sizes="180x180">` | 180×180 | 2,220 | 2026-11-04 21:54 | 2b649f43b8b2a964 | dc1666a7(10-30) | 같은 파일 |
| icon | `src/app/icon.svg` / `src/app/favicon.ico` | 96 / 64 | 297 / 1,731 | 2026-11-04 21:54 | 9a226ba8a0db9293 / 2b8992a1f52d6afe | dc1666a7 | 같은 파일 |
| manifest | 없음(`/manifest.webmanifest`·`/manifest.json` 404) | — | — | — | — | — | 없음 |
| `/apple-touch-icon.png`(루트 관례 주소) | 없음(404) | — | — | — | — | — | 없음 |

- 원인(명확): 운영 HTML(공개 GET `https://www.gyeolreport.com/`, 2026-11-05)의 og:image가 `https://gyeolreport.com/brand/gyeol-report-og.png` — 옛 검은 바탕 "GYEOL REPORT" 이미지(1.3MB). 새 책 진열 이미지와 버전 붙은 이름(`-20261030`)은 v5 브랜치(0532995b)에만 있고 master에는 없다. Safari 링크 미리보기·제안은 og:image를 쓰므로 옛 이미지가 나온다. apple-touch-icon은 master와 같은 파일(책 아이콘)이라 원인이 아니다.
- 고침: ① v5 배포로 og:image가 새 이름으로 바뀐다(링크 미리보기 캐시는 주소 기준이라 새 이름이면 다시 받는다). ② 추가로 `public/brand/gyeol-report-og.png`를 새 이미지(1200×630, edee6262…)로 교체 — 이미 퍼진 옛 주소(카카오 카드·캐시된 HTML)도 다시 받을 때 새 이미지가 된다. 3800에서 `/brand/gyeol-report-og.png` sha256 = edee6262d69e6881 확인.
- 참고: og:image 주소가 `https://gyeolreport.com`(apex) → www로 308. 대부분의 수집기는 따라가지만, 문제가 남으면 `SHARE_ORIGIN`을 www로 바꾸는 것을 검토(공유 주소에도 쓰여 이번엔 안 바꿈).

## 5. env (덕짱님 확인 결과 반영)

| 이름 | 운영 지금 | 코드가 읽는 곳 | 없을 때 | 권고 |
|---|---|---|---|---|
| `WRITER_V5_PRODUCTS` | 없음 | `src/lib/writer/flags.ts:7-9`(paidRuntime·이용권 큐·입력 화면·이어받기 크론) | 6상품 모두 V4 | **추가(필수)**: `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility` |
| `REPORT_PRICE_KRW` | 없음 | **env로 읽지 않음** — 코드 상수 `src/lib/payment/reportProductCatalog.ts:11` `REPORT_PRICE_KRW = 1490` | 영향 없음(1,490원) | 넣지 않는다(넣어도 무시). 가격 변경은 그 한 줄 코드 변경 |
| `ANTHROPIC_API_KEY` | 있음 | 작가(Sonnet) | 정식본 못 만듦 → 보류·포기·환불 | 그대로 |
| `OPENAI_API_KEY` | 있음 | `src/lib/ops/generation/supervisor.ts:50`(`openAiAvailable` — 임시본 레인), `src/lib/llm/providers.ts:96`(OpenAI 드라이버 키 이름) | 임시본 레인 없이 정식본만 기다림 | 임시본 레인을 쓸 거면 둔다, 아니면 지운다(선택). v5에서 자동 실호출은 Sonnet 2시간 실패 때 임시본뿐 |
| `OPENAI_REPORT_WRITER_ENABLED` | 있음 | **v5 src에서 안 읽음**(`git grep` src 0건, scripts/start-v4-manual-review.mjs가 `"0"`으로 덮어쓸 뿐). master는 `src/lib/report-generation/reportWriterRuntime.ts:34`에서 읽음(결제 워커 OpenAI 작가) | v5 영향 없음 | v5가 안정되면 삭제. 그 전 롤백 대비로는 `0`(꺼짐) 권고 — 값이 `1`이면 master로 롤백 시 결제 워커가 OpenAI 작가를 부른다 |
| `OPENAI_REPORT_MODEL` | 있음 | **v5 src에서 안 읽음**. master `reportWriterRuntime.ts:42` | v5 영향 없음 | v5 안정 뒤 삭제 |
| `FORTUNE_SALES_OPEN` | (없음 가정) | `src/lib/ops/config.ts:16` | 대운·세운 닫힘 | 12월 1일 전에는 넣지 않는다 |

## 6. deploy-checklist에 넣을 항목

**새 migration** (1절 표 7번으로 추가)

| 순서 | 파일 | 하는 일 | 되돌리기 |
|---|---|---|---|
| 7(독립, 먼저 적용 권고) | `supabase/migrations/20261105130000_v5_final3_read_no_quarantine.sql` | `paid_report_reliability('quarantine')`을 무동작으로(행 변경 0, 본문 한 줄 삽입, 재실행 안전). 옛 앱·롤백에서도 열람이 고객 Book status·snapshot_json을 못 바꿈 | 1-0에서 보관한 `paid_report_reliability` 본문 다시 실행 |

- 적용 전 점검(읽기 전용): `select (length(d)-length(replace(d,'elsif p_action = ''quarantine'' then','')))/length('elsif p_action = ''quarantine'' then') = 1 as read_no_quarantine_ready, position('READ_QUARANTINE_DISABLED' in d) > 0 as already_applied from (select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d) x;` → `true, false`.
- 이 migration은 앱 코드와 독립(master 코드에서도 안전)이라 **다른 migration·배포보다 먼저** 적용해도 된다. 같은 함수를 통째로 다시 만드는 `scripts/*.sql` 패치를 나중에 다시 실행하면 지워지므로 그 뒤엔 이 파일을 다시 실행.

**새 env** — `WRITER_V5_PRODUCTS=saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility` (Production, 필수, 배포 전에 넣어야 그 배포에 들어간다). `REPORT_PRICE_KRW`는 넣지 않음. OpenAI 3개는 5절 권고.

**[R1] 항목 문구**: "R1(`scripts/paid_report_quarantine_recovery_patch.sql`) 운영 적용 — **확인 완료(격리 시 내용 보존, 단 열람 불가)**. 이번 배포의 열람 경로는 격리를 부르지 않고(로그만), 7번 migration 뒤에는 SQL 격리도 무동작."

**켜는 순서**
1. (읽기 전용) 7절 [R1]·[R1-b]·[R4] 실행, 결과 보관. `pg_get_functiondef('public.paid_report_reliability(text,jsonb)')` 본문 보관(1-0).
2. 7번 migration 적용 → [R1] 다시 실행해 `read_quarantine_disabled = true`.
3. 나머지 migration(1~6) 기존 순서대로.
4. Vercel Production env: `WRITER_V5_PRODUCTS` 추가(위 값). `FORTUNE_SALES_OPEN`은 넣지 않음. (권고) `OPENAI_REPORT_WRITER_ENABLED=0`.
5. 배포 → Runtime Logs에서 서버 시작 직후 `WRITER_V5_PRODUCTS_MISMATCH` 0건.
6. 배포 직후 확인: `curl -sI https://www.gyeolreport.com/dev/v5-login` → 404, `/dev/book-preview` → 404. `curl -s https://www.gyeolreport.com/ | grep og:image` → `gyeol-report-og-20261030.png`, 그 주소 200. 기존 Book 2~3권(v4·legacy) `/reports/<id>`가 열림(1-7 재동의 결정 반영 후).
7. 배포 뒤 24시간: [R4] 다시 실행해 격리 행 수 증가 0, Vercel 로그 `REPORT_READ_VALIDATION_FAILED`·`REPORT_READ_SNAPSHOT_MISMATCH` 0건(있으면 해당 Book id로 원인 확인 — 저장본은 그대로).

## 7. 운영에서 덕짱님이 직접 돌릴 확인 SELECT (읽기 전용)

```sql
-- [R1] quarantine 본문 상태: R1 패치(내용 보존) / 기본(내용 삭제) / 이번 7번 migration(무동작)
select position('''quarantined''' in d) > 0 as quarantine_keeps_snapshot,           -- 확인 완료: true
       position('snapshot_json=null where report_id=p_data->>''reportId''' in d) > 0 as quarantine_clears_snapshot, -- false여야 함
       position('READ_QUARANTINE_DISABLED' in d) > 0 as read_quarantine_disabled     -- 7번 적용 뒤 true
from (select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d) x;

-- [R1-b] 7번 migration 적용 가능 여부(분기 정확히 1개)
select (length(d)-length(replace(d,'elsif p_action = ''quarantine'' then','')))/length('elsif p_action = ''quarantine'' then') = 1 as read_no_quarantine_ready
from (select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d) x;

-- [R4] 고객 Book 계열·상태(배포 전·후 같아야 함: 41권 COMPLETED, 격리 0)
select coalesce(s.snapshot_json->>'productVersion','(내용 없음)') as product_version, s.status,
       count(*) as books, count(*) filter (where s.snapshot_json is null) as no_content
from public.paid_report_snapshots s join public.payment_orders po on po.payment_order_id = s.order_id
where po.status = 'paid' group by 1, 2 order by 1, 2;

-- [R5] 열람 격리 흔적(2026-11-05 운영 0건 — 배포 전·후 증가 0이어야 함. 생성 실패로 생긴 FAILED_REQUIRES_ATTENTION도 함께 보이므로 last_error_code로 구분)
select j.last_error_code, s.status, count(*) from public.report_generation_jobs j join public.paid_report_snapshots s using (report_id)
where j.last_error_code in ('READ_GATE_REJECTED','PUBLISHED_SNAPSHOT_VALIDATION_FAILED') or s.status = 'FAILED_REQUIRES_ATTENTION'
group by 1, 2;
```

## 8. 돌린 명령과 결과

| 명령 | 결과 |
|---|---|
| `pnpm exec tsc --noEmit` | 오류 0 |
| `pnpm exec eslint <바꾼 src 7개 + 시험 7개>` | 오류 0 |
| `pnpm exec vitest run tests/unit/book/readPathProtection.test.tsx` (바꾸기 전 / 후) | 23 통과·5 실패(옛 동작) / **28 통과** |
| `pnpm exec vitest run` 영향 시험 13파일(postPaymentExperience·completedReadingExperience·readVersionTolerance·paidReportReliability·productionVersionCombos·legacyBookProtection·paidDeliveryCompleteness·compatibilityCategoryQuality·annualMonthJie·reportPublishExpiry·paidExpiryCostGuard·paidV5Read·readPathProtection) | **350/350 통과** |
| `pnpm exec vitest run tests/unit/ops/final3DeployRisk.test.ts tests/unit/api/tossConfirmRoute.test.ts tests/unit/app/tossPaymentSuccessPage.test.tsx tests/unit/app/tossPaymentSuccessPageSource.test.ts` | **32/32 통과** |
| 관련 시험 104파일(`readPublishedReport`·리포트 페이지·결제 승인·`writer/flags`·`storedReport`를 쓰는 시험) 한꺼번에 | 1634 통과 / 242 실패(34파일). 같은 실패 파일 33개를 **내 변경 없는 기준 트리**(HEAD 1f268605 + 다른 레인 미커밋 src 2개·스냅숏 1개, `git worktree add --detach` 임시)에서 돌림 → 241 실패, **실패 시험 이름 245개가 완전히 같음**. 차이 1건은 내 새 시험의 시간 초과(저장소 전체 TS 파싱 5초 초과) → 60초로 고쳐 다시 통과. 즉 신규 실패 0, 나머지는 기존·다른 레인 실패(V4 원고 잠금 해시·가격 1,290원 문구·시간 초과 등, 대부분 `docs/baseline-failures.txt`에 있음) |
| 마지막 재실행: 내 시험 + 바뀐 동작을 단언하는 시험 10파일 | **180/180 통과**, `tsc` 0, `eslint` 0 |
| esbuild metafile 그래프(열람 진입점 6곳) | 새 검사 모듈 0 |
| 3800 HTTP 10권 × 전·후 2회씩 + DB 상태 | 해시·행 차이 0, 격리 0 |
| 로컬 Docker: 7번 migration 적용 2회 | `BEGIN/DO/COMMIT` ×2, 본문 표식 1개 |

기존 실패 예(내 변경과 무관): `tests/unit/api/paidReportProductionRuntime.test.ts` 2건(`runJob` 인자·`ReportGenerationStatus` 문구), `tests/unit/app/tossPgReviewCheckoutPathSource.test.ts` 2건(가격 1,290원 문구), `tests/unit/account/library.test.tsx`(`src/lib/library/model.ts`의 90 문구·`reportShareStore.ts`의 library 문구 — 다른 레인 파일), `interpretation-v4/*` 잠금 해시들.

## 9. 소유 밖 "필요한 변경"

1. (book.ts 레인) `src/lib/writer/book.ts` `projectV5Book`이 `validateV5Publication`을 직접 부르고, 그 함수는 `d.version === V5_DRAFT_VERSION`("v5-book-1")만 받는다. **`V5_DRAFT_VERSION`·`V5_EVIDENCE_VERSION`을 올리면 이전 v5 Book이 모두 열람 불가**가 된다. 판을 올릴 때는 열람 검사를 저장된 판 목록(`v5-book-1` 등)으로 받게 바꿔야 한다(이번엔 올리지 않아 그대로 둠, 열람 경로 시험이 v5 제5·6판 10권으로 지킨다).
2. (계정·문서 레인) 1-7 재동의 전 열람 불가 — 결정 후 `src/lib/book/ownerAccess.ts`·`src/lib/tickets/ownerRead.ts` 또는 리포트 화면 안내 수정.
3. (문서 레인) `docs/v5/deploy-checklist.md`에 6절 항목 반영(이 레인은 점검표를 고치지 않았다).
