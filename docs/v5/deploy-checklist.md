# v5 운영 반영 점검표 (배포하지 않음 — 준비 문서)

작성 2026-11-05 · 브랜치 `v5/final`(기준 origin/v5/main 2236557f) · 대상 Production = `origin/master`(d846c2ea, 2026-10-29).
**이 문서는 순서와 확인 방법만 적는다. migration 적용·환경변수 입력·배포는 모두 덕짱님 승인 뒤에 한다(CLAUDE.md 권한).**
비밀값은 이 문서에 쓰지 않는다(이름·용도·어디서 받는지만).

---

## 0. 반영 직전에 다시 확인할 것

```bash
git fetch origin
# 운영(master)에 없는 migration — 아래 1절 표와 같아야 한다. 리드 작업(작가·브리프)에서 새 파일이 생기면 이 표에 더한다.
git diff --name-only origin/master...HEAD -- supabase/migrations scripts | grep '\.sql$'
# 새로 쓰는 환경변수 — 아래 2절 표와 같아야 한다.
git grep -ohE "process\.env\.[A-Z0-9_]+|env\.[A-Z][A-Z0-9_]{3,}" HEAD -- src | sed -E 's/.*env\.//' | sort -u > /tmp/env-head
git grep -ohE "process\.env\.[A-Z0-9_]+|env\.[A-Z][A-Z0-9_]{3,}" origin/master -- src | sed -E 's/.*env\.//' | sort -u > /tmp/env-master
comm -23 /tmp/env-head /tmp/env-master
```

2026-11-05 기준 결과: migration 5개(1절), 새 환경변수 35개(2절, `ANTHROPIC_API_KEY`는 문자열로 읽어 위 grep에 안 잡힘 — 표에 따로 적음).

---

## 1. Production migration (적용 순서 · 내용 · 되돌리기)

모든 파일은 `begin; … commit;` 한 트랜잭션이고 `lock_timeout 5s`, 전제가 없거나 고칠 자리가 예상과 다르면 `raise exception`으로 **아무것도 바꾸지 않고 멈춘다**.
기존 행을 지우거나 바꾸지 않는다(새 행 추가·새 열·새 표·함수 교체만). 로컬 DB·PGlite 시험에서만 적용해 봤다.

### 1-0. 적용 전 점검(읽기 전용 SQL, SQL Editor에서 실행)

```sql
-- 전제 함수·표(운영에 이미 있어야 함: master의 v4 이용권·이용권 큐 패치)
select to_regprocedure('public.report_ticket_publication(text,uuid,jsonb)') is not null as ticket_queue,   -- scripts/report_ticket_publication_queue_patch.sql
       to_regprocedure('public.report_tickets(text,uuid,jsonb)') is not null as tickets,
       to_regclass('public.report_ticket_grants') is not null as grants,
       to_regclass('public.book_generation_state') is null as v5_not_applied_yet;
-- 결제 복구 대기열 본문이 v4 이용권 migration 상태인지(4번 파일의 고칠 자리)
select position('o.amount not in (1290,1490) or o.currency' in pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure)) > 0 as recovery_price_list;
-- 되돌리기용으로 지금 함수 본문을 보관(결과를 파일로 저장해 둔다)
select pg_get_functiondef('public.report_ticket_publication(text,uuid,jsonb)'::regprocedure);
select pg_get_functiondef(coalesce(to_regprocedure('public.report_tickets_before_launch(text,uuid,jsonb)'),'public.report_tickets(text,uuid,jsonb)'::regprocedure));
select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure);
```

전부 `true`가 아니면 멈추고 원인을 먼저 확인한다(운영에 어떤 `scripts/*.sql` 패치가 들어갔는지 대조).

### 1-1. 적용 순서

| 순서 | 파일 | 하는 일 | 되돌리기 |
|---|---|---|---|
| 1 | `supabase/migrations/20261029130000_v5_writer_jobs.sql` | 이용권 큐 v5: `report_ticket_redemptions`에 열 3개(`writer_version`·`writer_lease_until`·`recovery_count`)+제약·색인, 새 표 `report_writer_chapters`(장 원고), `report_ticket_publication` 함수 교체(장 저장·회수 동작 추가, `WRITER_V5_PRODUCTS`가 비면 기존 동작) | 1-0에서 보관한 `report_ticket_publication` 본문을 다시 실행. 새 열·표는 남겨도 기존 코드가 쓰지 않는다(지우려면 진행 중 v5 작업이 0건일 때 `drop table public.report_writer_chapters;` 후 열 삭제) |
| 2 | `supabase/migrations/20261104100000_v5_p6d_ops.sql` | 운영 기반·생성 감독: 새 표 15개(`ops_settings`·`account_contacts`·`account_provider_facts`·`upgrade_roster`·`order_records`·`order_requests`·`order_refunds`·`ops_audit_log`·`book_generation_state`·`book_generation_runs`·`ops_writer_chapters`·`book_snapshot_versions`·`llm_provider_switch`·`gift_rewards`·`retained_order_records`), `payment_orders` 입력 시 주문코드 트리거(`ops_order_record`), 기존 주문에 주문코드 행 추가(legacy), 기존 가입자 명단(`upgrade_roster`, 2026-11-01 00:00 KST 이전 가입) 채움, 새 함수 `ops_account`·`ops_order`·`ops_generation`·`ops_gift`·`ops_admin`, `report_ticket_redemptions.not_before` 열, `report_ticket_publication` 다시 교체(보류 not_before), 권한 | ① `drop trigger ops_order_record on public.payment_orders;` ② 1번 적용 뒤 본문(1번 파일의 함수)으로 `report_ticket_publication` 복원 ③ 새 표·함수는 남겨 둔다(주문 기록·가입 정보·감사 로그가 들어 있어 지우면 자료 손실). 기존 v4 코드는 새 표를 읽지 않는다 |
| 3 | `supabase/migrations/20261104180000_v5_p6e_ops.sql` | 요청 자동 처리(`order_requests.resolved_by`, `ops_requests_autoclose`), 환불 출처 `external`, 이용권 상품 범위 배열(`report_ticket_grants.product_scopes` + `report_tickets`(또는 `report_tickets_before_launch`) 본문 4곳 패치), 선물 이용권 `gift_rewards.kind`·`gift_only`·`product_scopes`, `ops_gift`·`ops_admin`·`ops_order` 본문 패치, 보상 표 `comp_designations`·`comp_grants`, 새 함수 `ops_comp`·`ops_recon` | 1-0에서 보관한 `report_tickets(_before_launch)` 본문 복원(상품 범위 제한이 풀림 — 보상 이용권이 이미 지급됐다면 대운·세운에도 쓰일 수 있음에 주의). `ops_*` 함수는 2번 파일의 정의를 `create or replace`로 바꿔 실행하면 복원된다. 열·표는 남긴다 |
| 4 | `supabase/migrations/20261105090000_v5_final_payment_recovery_price_free.sql` | **(v5 최종 2-4)** 결제 복구 대기열(`claim_payment_recovery`)의 가격 목록 `o.amount not in (1290,1490)`을 모양 검사 `o.amount<100`으로. 지금 가격(1490)에서는 동작이 같고, 가격을 바꿔도 이전 가격 주문의 복구가 멈추지 않는다 | `pg_get_functiondef`로 본문을 읽어 `'o.amount<100 or o.currency'` → `'o.amount not in (1290,1490) or o.currency'`로 바꿔 실행(같은 방식의 좁은 치환), 또는 1-0에서 보관한 본문 실행. **가격을 바꾸기 전까지는 적용하지 않아도 동작이 같다** |
| 5 | `supabase/migrations/20261105091000_v5_final_comp_choice.sql` | **(v5 최종 2-3)** `ops_comp('sync')` 두 곳 패치: 보상 이용권을 모두 고를 수 있는 이용권(`gift_rewards`, 선물 전용 아님)으로 지급, A 총 장수 `aQty`(B로 먼저 받았으면 그만큼 뺌)·B `bQty`. 3번 바로 뒤에 적용해야 한다(코드가 `aQty`를 넘긴다) | 3번 파일의 `ops_comp` 정의를 `create or replace`로 바꿔 실행(본인용 1장+선물 전용 1장 방식으로 돌아감 — 이때는 코드도 함께 되돌려야 한다: `aSelf`·`aGift` 인자). 이미 지급한 행은 그대로 |

- 3·5번은 **같은 배포에서 함께** 적용한다(코드 `compSyncArgs`가 `aQty`를 넘기므로 5번 없이 켜면 A가 `COMP_CONFIG_INVALID`). `COMP_ENABLED`가 꺼져 있으면(기본) 지급은 일어나지 않는다.
- 2번의 트리거는 결제 주문 입력마다 `order_records` 1행을 만든다. 적용 직후 `select count(*) from order_records where legacy` 가 기존 주문 수와 같은지 본다.
- 리드 작업(작가·브리프·감독)은 2026-11-05 현재 스키마 변경 계획 없음(새 migration 없음). 반영 직전 0절 명령으로 다시 확인한다.

---

## 2. Vercel 환경변수 (Production)

값은 적지 않는다. "새로"는 master에 없던 변수. `NEXT_PUBLIC_*`는 빌드에 들어가므로 바꾸면 다시 배포해야 한다.

| 이름 | 용도 | 값을 어디서 | 필수 |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | v5 정식본 작가(Sonnet). 없으면 정식본을 만들 수 없어 시간표대로 보류→24시간 뒤 포기·자동 환불 | Anthropic 콘솔(덕짱님) | **필수(새로)** |
| `WRITER_V5_PRODUCTS` | v5 작가를 켤 상품 키(쉼표). 비면 기존 v4 경로 | 덕짱님 결정(예: 판매 중 4종) | **필수(새로)** |
| `OPENAI_API_KEY` | 임시본 레인(Sonnet이 2시간 넘게 실패할 때 terra 임시본). 없으면 임시본 없이 정식본만 기다림 | OpenAI 콘솔 | 선택(기존 이름) |
| `ORDER_COST_CAP_USD` | 주문 1건 작가 비용 상한(기본 0.60) | 덕짱님 결정 | 선택(새로) |
| `LLM_PROVIDER` · `LLM_MODEL` · `LLM_FALLBACK` · `LLM_MAX_OUTPUT_TOKENS` | 작가 공급자·모델·대체·출력 상한. 정식본은 감독이 Sonnet으로 고정하므로 **넣지 않는 것을 권장** | — | 넣지 않음(새로) |
| `CRON_SECRET` | 크론 5개 인증(1-3절 크론) | 기존 값 그대로 | 필수(기존) |
| `SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` · `SUPABASE_ANON_KEY` · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | DB(ops 저장소·생성 감독·진행 상태 읽기도 같은 service_role) | 기존 값 그대로 | 필수(기존) |
| `TOSS_PAYMENTS_SECRET_KEY` · `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` · `TOSS_CONFIRM_API_ENABLED` | 결제 승인·환불 크론(ops-jobs) | 기존 값 그대로(라이브 키) | 필수(기존) |
| `ADMIN_USER_IDS` | 관리자 화면 `/admin/orders`를 열 계정 id(쉼표). 비면 아무도 못 연다 | 덕짱님 계정 id(Supabase auth.users) | 필수(새로, 관리자 화면을 쓰려면) |
| `ADMIN_ACTION_PIN` | 환불·이용권 지급·보상 지정 때 다시 넣는 PIN | 덕짱님이 정함 | 필수(새로, 관리자 동작을 쓰려면) |
| `ADMIN_REFUND_DAILY_MAX_COUNT` · `ADMIN_REFUND_DAILY_MAX_AMOUNT` · `ADMIN_SESSION_HOURS` | 관리자 환불 하루 상한(기본 5건·50,000원), 다시 로그인 시간(기본 12) | 덕짱님 결정 | 선택(새로) |
| `KAKAO_CHANNEL_PUBLIC_ID` | 카카오 채널 관계 조회(가입 정보·채널 친구 여부) | **덕짱님이 Production 입력 완료** | 필수(새로) — 완료 |
| `KAKAO_ADMIN_KEY` | 탈퇴 때 카카오 연결 끊기 | 카카오 디벨로퍼스 앱 어드민 키(덕짱님) | 필수(새로) |
| `COMP_ENABLED` | 보상 이용권 지급·안내 켜기(`1`일 때만). **기본 꺼짐** | 덕짱님 결정(켜는 날) | 선택(새로) |
| `COMP_A_QTY` · `COMP_A_VALID_DAYS` · `COMP_B_QTY` · `COMP_B_VALID_DAYS` · `COMP_PRODUCTS` | 보상 장수·유효일·상품(기본 A 2장 60일, B 1장 30일, 종합·커리어·연애·궁합). 예전 `COMP_A_SELF_QTY`·`COMP_A_GIFT_QTY`는 더 이상 읽지 않는다 | 기본값이면 넣지 않음 | 선택(새로) |
| `GIFT_EVENT_ENABLED` · `GIFT_EVENT_START` · `GIFT_EVENT_END` · `GIFT_EVENT_MAX_PER_ACCOUNT` · `GIFT_EVENT_BONUS_MAX` · `GIFT_EVENT_PRODUCTS` · `GIFT_EVENT_VALID_DAYS` | 결제 1건마다 이용권 1장 이벤트(기본 꺼짐) | 덕짱님 결정(이벤트 일정) | 선택(새로) |
| `FORTUNE_SALES_OPEN` | `1`이면 대운·세운 판매 재개(기본 닫힘). 12월 1일 | 덕짱님 결정 | 선택(새로) |
| `NEXT_PUBLIC_META_PIXEL_ID` · `META_MEASUREMENT_APPROVED` · `META_CONVERSIONS_ACCESS_TOKEN` · `META_GRAPH_API_VERSION` | Meta 픽셀(켜져 있을 때만 푸터 '광고 설정') | 기존 값 그대로 | 기존 |
| `OPS_MOCK_WRITER` · `OPS_FORCE_ANTHROPIC_DOWN` · `LLM_BUDGET_SCOPE` · `LLM_BUDGET_RUN` · `LLM_BUDGET_RUN_ID` · `LLM_BUDGET_STAGE` · `PAID_WORKER_MAX_RSS_MB` · `TICKET_WORKER_MAX_RSS_MB` | 로컬 개발 전용(코드가 `NODE_ENV=development`에서만 읽음) | — | **Production에 넣지 않음** |

---

## 3. 크론 (`vercel.json`)

| 경로 | 주기 | 하는 일 | master 대비 |
|---|---|---|---|
| `/api/internal/report-jobs` | 매분 | 결제 Book 생성(v5 상품은 생성 감독 경유: 보류·포기·자동 환불) | 기존 |
| `/api/internal/report-ticket-jobs` | 매분 | 이용권 Book 생성 | 기존 |
| `/api/internal/meta-events` | 5분 | Meta 전환 전송 | 기존 |
| `/api/internal/report-writer-recovery` | 5분 | 이용권 v5 작가 lease가 끝난 작업 이어받기 | **새로** |
| `/api/internal/ops-jobs` | 5분 | ① 환불 처리·재확인(토스 취소) ② 이벤트 이용권 발급(결제 완료 화면을 못 본 주문) ③ 열람 기한 지난 보관본·장 원고 정리 ④ 임시본→정식본 교체·관리자 재생성 레인 | **새로** |

모두 `Authorization: Bearer $CRON_SECRET`. 새 크론 2개는 Vercel 플랜의 크론 개수·`maxDuration`(800초/300초) 한도를 넘지 않는지 배포 전 확인.

---

## 4. 반영 뒤 확인 순서

1. **migration 적용 직후(배포 전)**: 1-0 SQL을 다시 돌려 `v5_not_applied_yet=false`, `recovery_price_list=false`(4번 적용 시). `select count(*) from upgrade_roster;`가 기존 가입자 수와 같은지, `order_records`의 legacy 행 수가 기존 주문 수와 같은지.
2. **환경변수**: 2절 필수 항목이 Production에 있는지(값은 보지 않고 이름만). 개발 전용 변수가 없는지.
3. **배포 직후 공개 화면**(로그인 없이):
   - 홈 `/`: 6권 진열이 자동 회전(모바일 포함), 푸터 아이콘 순서 인스타그램·카카오톡·X·스레드(새 탭), "채널 보기" 없음.
   - `GET /api/analytics/meta`가 `ready:true`이면 푸터에 '광고 설정'이 보이고, 첫 방문 카드는 화면 맨 위 흐름 안(버튼·쪽 넘김과 겹치지 않음), 닫으면 다시 안 뜸.
   - `curl -s https://gyeolreport.com/ | grep og:image` → `gyeol-report-og-20261030.png`(1200×630), 그 주소가 200.
4. **크론**: Vercel 대시보드 Crons에 5개, 5분 안에 `report-writer-recovery`·`ops-jobs` 로그가 200(401이면 `CRON_SECRET`).
5. **결제 1건(승인 필요, 덕짱님)**: 결제 → `/reports/<id>` 생성 대기 화면 → `GET /api/reports/<id>/progress`가 `preparing`(감독 시작 뒤 단계 '책 집필') → 완성되면 같은 주소에서 책으로 바뀜 → 서재에 보임. 관리자 화면 상세에 시도·비용 기록.
6. **이용권 1장**: 서재에서 이용권으로 책 만들기(운영 출처) → 발행 → 서재.
7. **관리자**: `/admin/orders`가 `ADMIN_USER_IDS` 계정에서만 열리고 다른 계정은 404.
8. **보상(켜는 날만)**: `COMP_ENABLED=1` 뒤 B 대상 계정 서재에 안내 한 줄 + '보상 이용권' 1장(내가 쓰기·선물 링크 버튼), A로 지정한 계정은 2장.
9. **되돌리기 판단**: 결제 승인 실패·생성 대기 고정·크론 401이 보이면 Vercel에서 직전 배포로 Promote(코드 되돌리기) → DB는 1절 표의 되돌리기 칸을 필요한 것만(새 표·열은 남겨도 기존 코드와 충돌하지 않는다).
