# v5 배포 보고 (2026-11-06)

작성 2026-11-06 · 브랜치 `v5/final` → `v5/main` → `master` · Anthropic 호출 0 · OpenAI 코드·env 변경 0 · 카드 입력·실결제 0.

## 0. 배포 전 마지막 수정(v5/final, 호출 0)

| # | 결과 |
|---|---|
| 0-1 | 처리방침 6번 위탁 표·7번 국외 이전 표에 OpenAI 추가(Anthropic이 오래 장애일 때 임시본, 미국, 입력 정보·해석 근거·이전 리포트 겹침 방지 표현, 보유 = 남용 감시 기록 최대 30일 — OpenAI API 공식 문서 「Your data」 2026-11-06 확인, 우리 호출은 Responses API `store: false`). 법률 검토 7번 「표에 반영」 |
| 0-2 | 「단순 변심 환불은 어려워요」 → 「되지 않아요」. 주문서·상세 보기 원문·약관·환불정책·결제 전 고지·내 서재 문의 안내를 「단순 변심 환불(청약철회)은 되지 않습니다/않아요」로 통일 |
| 0-3 | 회원 주문서: 「주문 내용과 환불정책을 확인하고 동의해요」 + 「만 14세 이상」(약관·개인정보는 가입 동의). 비회원: 같은 환불 칸 + 「이용약관·개인정보 동의」 + 「만 14세 이상」. consentEvidence 확인 항목 일곱 개 그대로(ui v2에 칸별 덮는 항목, 회원은 `via: signup`), 결제 준비가 회원 배치 ↔ 실제 회원 대조 |
| 0-4 | 보상 B = 기준 시각 전 `auth.users`(익명·삭제 제외) − A − 덕짱님 계정 − ADMIN_USER_IDS, 시험 계정 목록 비움. 가입 미완료 계정 지급 → 가입 완료 뒤 서재(`ops_gift list`)·팝업 ② 시험 통과 |
| 0-5 | `POLICY_EFFECTIVE_DATE = "2026-11-06"` |
| 0-8 | 1+1 시작 2026-11-06 09:00:00 KST(끝 11-16 23:59:59 그대로). SQL은 기간을 갖지 않고 코드의 [시작, 끝)을 받음 — 시험으로 고정. 팝업 ① 「11월 6일 – 11월 16일」, 배너는 서버 시각으로 시작 전/진행 중 자동 |
| 0-6 | 임시 worktree 3개 제거(event·checkout의 미커밋 초안은 v5/final에 더 나중 판이 있어 `~/Developer/gyeol-worktrees/_removed-worktrees/*.patch`로 보관 후 제거). 커밋에 디버그 코드·비밀값·.cache·DB 덤프 0 |
| 0-7 | `tsc --noEmit` 0 · `pnpm lint` 0 오류 · `next build` exit 0 · 전체 시험: 기준 트리(916b0ce6) 31,616개 중 실패 853 / 지금 31,622개 중 실패 859, 차이 6 = 의도된 변경의 시험 표식 3(BookCheckout 소스 표식 `consents`→`effective` 2, 처리방침 「OpenAI 없음」 1 — 고침) + 부하 흔들림 3(bookPublicFlow 궁합·p6cScore·productionTestDataCleanupMigration — 단독 실행 두 트리 모두 통과). **신규 실패 0**. 관련 시험(final4 9파일·legal·주문서·이벤트·보상) 통과 |

## 1. 배포 전 운영 확인(읽기만, 2026-11-06 09:10 KST 무렵)

| 항목 | 결과 | 판정 |
|---|---|---|
| 1-0 전제 | `report_ticket_publication`·`report_tickets`·`report_ticket_grants` 있음, `book_generation_state` 없음(v5 미적용), 결제 복구 가격 목록 `o.amount not in (1290,1490)` 있음, `report_tickets_before_launch` 있음 | PASS |
| [R1] | quarantine_keeps_snapshot=true · clears_snapshot=false · read_quarantine_disabled=false(0번 적용 전) | PASS |
| [R1-b] | read_no_quarantine_ready=true | PASS |
| [R4] 고객 책(결제 주문 조인) | 1.0 3 · v1 1 · v2 4 · v4 5, 모두 COMPLETED, 내용 없음 0 | — |
| [R4] 고객 책(전체 스냅샷) | v1·1.0·v2 **8** · v4 **33**(결제 5 + 이용권 28), 모두 COMPLETED, 내용 없음 0, 만료 0 | PASS(기대 8·33) |
| [R5] 열람 격리 흔적 | 0행 | PASS |
| 대기 작업 | `report_generation_jobs` 13건 전부 COMPLETED, `report_ticket_redemptions` 28건 전부 COMPLETED | PASS(0) |
| 주문 | `payment_orders` paid 58 · ready 45(결제창만 연 주문) | 참고 |
| 롤백용 함수 지문 | `paid_report_reliability` md5 9260b70c…(26,322B) · `report_ticket_publication` 753c9b05…(4,828B) · `report_tickets_before_launch` 47feeb5d…(11,214B) · `report_tickets` 77e420d8…(927B, 감싸기) | 기록 |

[R4]를 결제 주문(`payment_orders.status='paid'`)과 조인하면 이용권 책 28권이 빠져 v4가 5권으로 나온다. 고객 책 41권(8 + 33)은 스냅샷 전체 기준이다.

## 2. 롤백 기준점(1-2)

- 운영 배포 `dpl_84CWqXBCu4UB6uNGmtmWt7Kh3o5P`(master `d846c2ea`, READY, 별칭 www.gyeolreport.com·gyeolreport.com).
- 태그 `v4-last` → `d846c2ea` push 완료.

## 3. migration 0~9 점검(1-3) — 「배포 전에 적용해도 지금 운영 중인 v4 코드(master d846c2ea)가 깨지지 않는가」

| 순서 | 파일 | v4 코드가 닿는 곳 | 판정 | 적용 시점 |
|---|---|---|---|---|
| 0 | `20261105130000_v5_final3_read_no_quarantine` | `paid_report_reliability('quarantine')` 무동작(행 변경 0). v4 열람 경로가 격리를 불러도 책을 바꾸지 않음 | 안전(오히려 보호) | 배포 전, 가장 먼저 |
| 1 | `20261029130000_v5_writer_jobs` | `report_ticket_publication` 교체: v4가 쓰는 claim·enqueue·publish·status와 입력 키 그대로(+recover). claim에 `v5Products`가 없으면 v4 경로. 새 열·표는 v4가 읽지 않음 | 안전 | 배포 전 |
| 2 | `20261104100000_v5_p6d_ops` | `payment_orders` 입력 트리거(`order_records` 1행, `on conflict do nothing`, service_role 권한 있음), `report_ticket_publication` 재교체(+defer, not_before가 null이면 그대로), 새 표 15개·함수(v4는 안 부름), 기존 주문 103건에 주문코드(legacy) | 안전 | 배포 전 |
| 3 | `20261104180000_v5_p6e_ops` | `report_tickets_before_launch` 본문 4곳 패치: `productScopes`가 없으면 예전과 같음(v4 지급은 `productScope` 하나만). 고칠 자리가 정확히 1번이 아니면 아무것도 안 바꾸고 멈춤 | 안전 | 배포 전 |
| 4 | `20261105090000_v5_final_payment_recovery_price_free` | 결제 복구 금액 검사 `not in (1290,1490)` → `amount<100`. v4 가격 1,490원에서 동작 같음. **v5 3,900원 주문 복구에 필수** | 안전 | 배포 전(필수) |
| 5 | `20261105091000_v5_final_comp_choice` | `ops_comp`만(v4는 안 부름) | 안전 | 배포 전 |
| 6 | `20261105120000_v5_final3_tickets_reading` | ① `report_tickets` 감싸기: 기한 없이 들어온 지급은 30일, summary에 `lots` 추가(v4 화면은 모르는 칸 무시). ② 열람 제약에 infinity 허용 + v5 스냅샷만 기한 없음 트리거(v4 발행은 v4라 그대로). ③ 기존 v5 책 기한 변경 **대상 0권**(운영 v5 책 0), 새 제약 위반 0행 | 안전(v4 화면 변화 없음, 그사이 v4가 만드는 기한 없는 지급만 30일) | 배포 직전(코드와 같은 창) |
| 7 | `20261105160000_v5_final3_writer_raw` | 새 표·함수만 | 안전 | 배포 전 |
| 8 | `20261106100000_v5_final4_event_comp` | `ops_gift` 상한 패치(v4는 안 부름), 새 표·함수 | 안전 | 배포 전 |
| 9 | `20261106180000_v5_final4_writer_raw_purge` | `ops_writer_raw` 교체만 | 안전 | 배포 전 |

배포 직후로 옮길 것: 없음. 적용 순서 = 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9(점검표 1-1절과 같음).

적용 방법: 운영 migration 기록 15건이 저장소 파일 버전과 다르게 적혀 있어(예전에 커넥터로 적용, 예 `20261011085143_v4_coupon_foundation` ↔ 저장소 `20261003123157`) `supabase db push`가 그대로는 쓸 수 없다(거절하거나 옛 migration 수십 개를 적용하려 함). 저장소 밖 임시 작업 폴더에 운영 기록 15건의 자리표 파일 + 적용할 파일 하나만 두고 `supabase db push --linked --include-all`(CLI, linked)을 파일마다 돌렸다 — CLI가 저장소 파일을 그대로 읽어 실행하고 기록에 **파일 버전·이름**을 남긴다. 저장소의 `supabase/config.toml`(`[db.migrations] enabled = false`)은 그대로 두고 임시 사본에서만 켰다.

## 4. 운영 반영(2)

### 2-1. migration(운영 `xscosaueqpatcqzbgkbl`, 09:44~09:51 KST)

| 순서 | 버전 · 이름 | 적용 뒤 확인 SELECT |
|---|---|---|
| 0 | 20261105130000 v5_final3_read_no_quarantine | [R1] read_quarantine_disabled **true**, keeps_snapshot true · 책 41 · [R5] 0 |
| 1 | 20261029130000 v5_writer_jobs | `report_writer_chapters` 있음 · 열 3개 · 큐 동작 claim·enqueue·publish·recover·status · 이용권 대기 0 |
| 2 | 20261104100000 v5_p6d_ops | 새 표 15/15 · `order_records` 103 = legacy 103 = 주문 103 · `upgrade_roster` 39 · 트리거 `ops_order_record` 있음 |
| 3 | 20261104180000 v5_p6e_ops | `report_ticket_grants.product_scopes` · `report_tickets_before_launch` 본문 패치 · 보상 표·`ops_comp`·`ops_recon` · 기존 지급 31건 그대로 |
| 4 | 20261105090000 v5_final_payment_recovery_price_free | 가격 목록 없음 · `amount<100` 모양 검사 · 열람 격리 무동작 유지 |
| 5 | 20261105091000 v5_final_comp_choice | — |
| 6 | 20261105120000 v5_final3_tickets_reading | 적용 전 대상 **0권**(운영 v5 책 0) · 새 제약 위반 0 · 41권 열람 기한 지문 `65bd43ed…` 적용 전후 같음(고객 책 변경 0) · infinity 0 · 트리거 3 · 감싸기 `report_tickets_before_final3` |
| 7 | 20261105160000 v5_final3_writer_raw | `ops_writer_raw` 있음, anon 실행 false |
| 8 | 20261106100000 v5_final4_event_comp | `comp_campaign_grants` · `ops_comp_campaign`(B = auth.users) · 1+1 상한 kind='event' · anon 실행 false |
| 9 | 20261106180000 v5_final4_writer_raw_purge | `raw_purge` 분기 |

운영 migration 기록(v5 10건)이 저장소 파일 버전·이름과 그대로 같다. 마지막 확인: 책 41 COMPLETED, [R5] 0, 열람 격리 무동작 true.

### 2-2. Vercel Production env

- 넣음: `WRITER_V5_PRODUCTS`(출시 4종), `GIFT_EVENT_ENABLED=1` — Vercel 커넥터(vercel CLI 없음). 지금 v4 코드는 두 이름을 읽지 않음(master grep 0).
- 확인: `ADMIN_USER_IDS` 있음(sensitive라 값은 못 읽음) · `COMP_ENABLED` 없음 · OpenAI env 3개(`OPENAI_API_KEY`·`OPENAI_REPORT_MODEL`·`OPENAI_REPORT_WRITER_ENABLED`) 그대로 · `ANTHROPIC_API_KEY` 있음.

### 2-3. 병합

- `v5/final` 20e5880e → `v5/main` merge commit **9e2324c8**(트리 = v5/final) push, 원격 SHA 같음.
- `master`(release-master worktree): `v5/main` merge commit **e58fc21a**(부모 d846c2ea · 9e2324c8). 충돌 5개(BookPages·MetaPixel·metaConsent.module.css·BusinessFooter·metaConsentCard 시험)는 v5 쪽 — master 핫픽스 c5c11ca8·d846c2ea의 v5판(8086996f·63e7bab0)이 v5/main에 있음. **병합 트리 = v5/main 트리(95db4d48)**. push 09:54:58 KST, 원격 SHA 같음.
- 태그 `v5.0.0` → e58fc21a push.

### 2-4. Production 배포

- `dpl_BLd5WA6kzHXaWnPL8uti2sQYf7qj` · SHA **e58fc21a** · READY(빌드 09:55:15 → 완료 **09:57:36 KST**) · 별칭 www.gyeolreport.com · gyeolreport.com(→ www 308) · aliasError 없음.
- 롤백: `v4-last`(d846c2ea) 배포 `dpl_84CWqXBCu4UB6uNGmtmWt7Kh3o5P`로 Vercel Instant Rollback(대시보드 또는 커넥터 `request_rollback`). DB migration은 v4 코드와 호환이라 그대로 둬도 된다(1-3 표).

## 5. 배포 직후 확인(3)

| # | 확인 | 결과 | 판정 |
|---|---|---|---|
| 3-1 | 메인·상품(종합·궁합)·`/example`·`/example/og`·약관·처리방침·환불정책·`/products` | 전부 200. 처리방침: OpenAI 위탁·국외 이전 행, 「2026년 11월 6일부터 시행」. 약관·환불정책: 「단순 변심 환불(청약철회)은 되지 않습니다」 각 3곳, 「할 수 없습니다」·「어려워요」 0 | PASS |
| 3-1 | 비회원 주문서(헤드리스, 결제 버튼 안 누름) | PRICE 3,900원 · 「1+1 · 로그인하고 결제하면 무료 이용권 1장」 · 동의 3칸(「주문 내용과 환불정책을 확인하고 동의해요」·「이용약관·개인정보 동의」·「만 14세 이상」)+전체 동의 · 맨 아래 「결제하면 바로 생성이 시작돼 단순 변심 환불은 되지 않아요 · 예시 보기」/「명리 계산과 MBTI 자료를 바탕으로 AI가 작성해요」 | PASS |
| 3-1 | 회원 주문서 | 운영 회원 로그인 없이 확인 못 함(시험 `checkoutReceipt.test.tsx`: 환불 칸 하나 + 만 14세) — 누나 시험에서 확인 | UNVERIFIED(운영 화면) |
| 3-2 | `/api/gift-event` | `phase: during`, startsAt 2026-11-06T00:00Z(09:00 KST), endsAt 11-16T15:00Z(11-17 00:00 KST), 계정당 2, 30일 | PASS |
| 3-2 | 손님 화면 팝업 ①·배너(크롬 390·웹킷 390·크롬 1280) | 메인: 팝업 ① + 「11월 6일 – 11월 16일」 + 배너 「종료까지」, 상품 화면: 팝업 ①, `/example`·`/reports/…`·`/r/…`: 팝업 없음, 페이지 오류 0 | PASS |
| 3-2 | 회원 결제 1건 → 이용권 1장(운영 설정값 대조) | 운영 env 조합으로 계산한 설정 = 운영 응답(시작·끝·상한 2·보너스 2·30일·출시 4종). 운영 `ops_gift` 상한은 이벤트 이용권만 셈(패치 확인). PGlite: 결제 2건 → 2장, 3번째 `ACCOUNT_LIMIT`(보상 2장 보유 계정) | PASS(실결제 없이) |
| 3-3 | `/dev/v5-login`·`/dev/book-flow`·`/dev/account`·`/dev/book-preview` | 404 | PASS |
| 3-4 | 과거 Book 세 계열 | DB: v1 1·1.0 3·v2 4·v4 33 전부 COMPLETED, 내용 없음 0, [R5] 0, 열람 격리 무동작. 운영 v5 책은 아직 0권(누나 시험 책이 첫 v5). 고객 계정 로그인 화면 확인은 못 함 | PASS(DB) · UNVERIFIED(화면) |
| 3-5 | 공유 미리보기 | 메인 og:image `/brand/gyeol-report-og-20261030.png`(v4는 `gyeol-report-og.png` — 이름이 바뀌어 미리보기 캐시도 새로), `/example` og:image `/example/og`, 둘 다 200 image/png 1200×630 | PASS(태그·이미지) |
| 3-6 | 배포 뒤 30분(09:57:36~10:28 KST) | Vercel 런타임 오류 **0**(`get_runtime_errors`). Vercel 로그 API는 지난 24시간 전체가 0줄로 나와(옛 배포 포함) 쓸 수 없어 Supabase API 로그로 대신 확인: 크론·서버 RPC 정상 200(paid_report_reliability 98 · report_ticket_publication 37 · ops_generation 12 · meta 12 · ops_writer_raw 6 · ops_order 6 · ops_recon 6). **새 오류 1종: `ops_gift` 400 ×6(5분마다)** — `column reference "o.payment_order_id" is ambiguous`. PostgREST `Thread killed by timeout manager`는 배포 전에도 시간당 65~81건(기존) | **멈춤** |

### 3-6 멈춤 — 원인

- 어디: `ops_gift('pending_orders')` — 크론 `/api/internal/ops-jobs`(5분)의 「1+1 이벤트 이용권 보조 발급」(결제 완료 화면을 못 본 주문 찾기). P6d(20261104100000) 본문 그대로.
- 왜: 함수에 PL/pgSQL 변수 `o`(payment_orders 행)·`x`(order_records 행)가 선언돼 있는데 이 조회가 같은 이름을 별칭으로 쓴다 → Postgres가 변수인지 열인지 못 정해 오류. 시험이 이 동작을 부른 적이 없어 놓쳤다(v5 migration 전체 함수 훑기: 같은 충돌은 이곳 하나).
- 영향: 보조 발급만 멈춤. 기본 발급(결제 완료 화면 → `issue`)은 별칭 없는 구문이라 정상. 크론은 오류를 잡아 `gifts: 0`으로 넘기고 다른 단계(환불·정리·원문 정리·교체 레인)는 정상. 배포 뒤 결제 0건이라 빠진 이용권 0. 고치면 크론이 기간 안의 아직 따지지 않은 주문을 다시 찾아 채운다.
- 결제·발행 경로 아님 → **롤백하지 않음**(지시: 결제·발행 경로 오류면 롤백).
- 고침(준비만, 운영 미적용): `supabase/migrations/20261106200000_v5_deploy_gift_pending_alias.sql` — 이 조회 한 곳만 별칭 o→po, x→q(좁은 치환, 고칠 자리 1번 확인, 다시 실행 안전, 기존 행 변경 없음). 시험 `tests/unit/deploy/giftPending.test.ts`: 고치기 전 운영과 같은 `is ambiguous` 재현 → 고친 뒤 기간 안 회원 주문만·발급 뒤 다시 안 나옴. 코드 변경 없음(배포 불필요).
- 4단계(보상 지급)는 이 멈춤에서 실행하지 않았다. dry-run만: A 3(모두 있음·가입 완료·미지급), **B 36**(가입 동의 미완료 1 = dea018f8), 제외 1(덕짱님 계정), 익명·삭제 0, 기준 시각(배포 완료 2026-11-06 09:57:36.853 KST) 뒤 가입 0.

### 3-6 이후(덕짱님 결정: 「고침 적용 후 보상 지급」)

- 고침 migration `20261106200000_v5_deploy_gift_pending_alias`를 CLI(linked)로 적용(10:33 KST, 커밋 38d76b9e 내용 그대로). 확인: 새 별칭 있음·옛 별칭 없음, `ops_gift('pending_orders')` 직접 호출 `{ok: true, orders: []}`, 운영 migration 기록 v5 11건(10 + 고침 1)이 저장소 파일과 같음.
- 고침 뒤 크론 2회(10:35·10:40): `ops_gift` 200, `is ambiguous` 0, Supabase edge 4xx·5xx 0. 배포 뒤(09:57~10:43) Vercel 런타임 오류 0. → 3-6 **PASS(고침 뒤)**

## 6. 보상 이용권 지급(4)

| # | 결과 |
|---|---|
| 4-1 dry-run | 캠페인 `v5-relaunch-2026-11`, 기준 시각 = 배포 완료 **2026-11-06 09:57:36.853 KST**. A 3(모두 있음·가입 완료·미지급) · **B 36**(가입 동의 미완료 1 = dea018f8) · 제외 1(덕짱님 계정 3b35f970) · 익명·삭제 0 · 기준 시각 뒤 가입 0. 운영 계정 40 = A 3 + 덕짱님 1 + B 36. `ADMIN_USER_IDS`는 sensitive라 값을 못 읽었지만 기대 36과 같아 관리자 계정이 B에 섞이지 않았다(40 − 3 − 1 = 36) |
| 4-2 실행 | `ops_comp_campaign('run')`(서비스 키 대신 SQL 함수 직접 호출 — 같은 함수·같은 인자, 기대 B 36·확인 플래그): **새로 39명**(A 3·B 36), 이용권 **42장**(A 2장×3 + B 1장×36), 기한 **2026-12-06 10:34:23 KST**(지급 + 30일), 4종 상품, 선택형(내가 쓰기/선물 1회). 다시 실행 → 새로 **0명**·이미 39명. 덕짱님 계정 0장 |
| 4-3 확인 | A(f6122631): 서재 목록 2장 available·만료 12-06 · 팝업 읽기 tier A(③) unused 2. B 가입 완료(0a9df1fc): 1장 · tier B(②). B 가입 미완료(dea018f8): 1장이 목록에 있음 · 팝업 읽기 tier B — 화면 팝업 ②는 가입(약관 동의)을 마쳐 회원이 되면 뜬다(`/auth/event-popup`은 회원에게만 보상 정보, 시험 `eventPopup.test.tsx`·`eventComp.test.ts`) |

참고: v5 문서 버전(2026-11-05.1)이 바뀌어 기존 회원 39명은 다음 로그인 때 약관·개인정보 재동의 화면을 먼저 본다. 재동의 전에는 회원 상태가 아니라 팝업 ②③이 뜨지 않고, 재동의하면 뜬다(산 책 열람은 재동의 전에도 됨).

## 7. 남은 위험

1. **master에 고침 파일 없음**: 운영 DB에는 고침(20261106200000)이 들어갔지만 그 파일·시험·이 보고서는 `v5/final`(·`v5/main`)에만 있다. master는 e58fc21a(배포본) 그대로 — 다음 master 병합 때 함께 들어간다(코드 변경 없음, 다시 실행해도 건너뜀).
2. **회원 주문서·v5 책 열람·환불 흐름은 운영 화면 미확인**: 운영 회원 로그인·실결제를 하지 않았다. 누나 실고객 시험이 첫 v5 운영 주문·첫 v5 책·첫 이벤트 이용권·첫 선물이다.
3. **기존 회원 재동의**: 문서 버전 2026-11-05.1 배포로 기존 회원 39명은 다음 로그인 때 약관·개인정보 재동의 화면부터 본다. 재동의 전에는 보상 팝업 ②③이 안 뜬다(이용권은 서재에 있음, 산 책 열람은 됨).
4. **가입 정보 0명**: `account_contacts`가 운영에 0행 — 기존 회원은 결제·선물 받기 전에 가입 정보(이름·이메일) 화면을 거친다(`PROFILE_REQUIRED`).
5. **OpenAI 임시본 레인 켜짐**: `OPENAI_API_KEY`가 운영에 있어 Anthropic이 2시간 넘게 실패한 주문은 OpenAI로 임시본을 만든다(처리방침에 반영). 이전받는 자 법인 이름(OpenAI, LLC)은 API 계약 상대방과 맞는지 확인 필요(법률 검토 7번).
6. **Vercel 로그 API를 못 씀**: 운영 함수 로그 확인은 Supabase 로그(edge·postgres)로만 했다. 앱 안 `console` 경고(예: `WRITER_V5_PRODUCTS_MISMATCH`)는 대시보드 Logs에서 덕짱님이 한 번 보는 것을 권한다(env 값은 출시 4종 정확히 넣음).
7. **점검표의 `SUPABASE_ANON_KEY`(필수·기존) 표기**: 운영에 없는 이름이지만 master도 같은 방식으로 읽고 운영이 그대로 돈다(새 요구 아님, 표기만 부정확).
8. 법률 검토 목록(docs/v5/final4/legal-review.md) 1~10번은 덕짱님 판단이 남아 있다(특히 1 환불 표시, 2 합친 동의 칸).

## 8. 덕짱님이 직접 할 일

1. **누나 실결제**(실결제 확인 대신) — 아래 순서, 확인표 `docs/v5/deploy/sister-test.md`. 환불 시험은 선택.
   1. 새 계정으로 가입 → 팝업 ①
   2. 예시 보기 → 상품 고르기 → 3,900원 결제
   3. 생성 대기 → 책 열기
   4. 서재에 무료 이용권 1장(만료일 = 결제일 + 30일)
   5. 이용권을 선물 링크로 친구에게 보내기
   6. 친구가 가입하고 이용권 사용
   7. (친구가 첫 결제를 하면) 누나에게 보너스 1장
2. 아이폰 Safari에서 메인·`/example`, 카카오톡·메시지에 `https://gyeolreport.com/` 붙여 새 공유 이미지 확인.
3. 메타 이벤트 관리자 테스트 이벤트: 결제창 열 때 InitiateCheckout 1회, 결제 뒤 Purchase 1회 3,900 KRW.
4. 이벤트는 이미 진행 중(11-06 09:00 시작) — 팝업 ①·「종료까지」 타이머가 떠 있는지 한 번 보기(11-07 00시 확인은 필요 없음).
