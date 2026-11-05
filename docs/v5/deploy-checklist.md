# v5 운영 반영 점검표 (배포하지 않음 — 준비 문서)

작성 2026-11-05 · **최종 A로 갱신 2026-11-06(맨 위 「이번 배포 순서」가 최종본)** · 브랜치 `v5/final`(기준 origin/v5/main 2236557f) · 대상 Production = `origin/master`(d846c2ea, 2026-10-29).
**이 문서는 순서와 확인 방법만 적는다. migration 적용·환경변수 입력·배포는 모두 덕짱님 승인 뒤에 한다(CLAUDE.md 권한).**
비밀값은 이 문서에 쓰지 않는다(이름·용도·어디서 받는지만).

---

## 최종 A — 이번 배포 순서(최종본, 2026-11-06)

**배포 명령에서만 한다(이 작업에서는 0건).** 순서: 확인 SELECT → migration(0번 열람 격리 무동작을 가장 먼저) → env → 배포 → 보상 지급 → 직후 확인.

1. **확인 SELECT(읽기 전용)**: 1-0절 SQL과 2-1절 [R1]·[R1-b]·[R4]·[R5]. 결과와 `paid_report_reliability`·`report_ticket_publication`·`report_tickets` 본문을 파일로 보관.
2. **migration(1-1절 표 순서)**: **0번(열람 격리 무동작)을 가장 먼저** → [R1] 다시(`read_quarantine_disabled=true`) → 1 → 2 → 3 → 4(가격 변경으로 필수) → 5 → 6(고객 Book 기한 변경 — 대상 수 확인 후) → 7 → 8(최종 A 이벤트·보상) → 9(최종 A 원문 정리).
3. **env(Production)** — 값은 이 문서에 적지 않는다.
   - `WRITER_V5_PRODUCTS` = `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility`(공백 없이, 정확히 이 값).
   - `GIFT_EVENT_ENABLED` = `1`. 기간은 코드 기본값(2026-11-07 00:00:00 ~ 11-16 23:59:59 KST). 바꿀 때만 `GIFT_EVENT_START`·`GIFT_EVENT_END`.
   - 보상: `COMP_ENABLED`는 **넣지 않는다**(지급은 4번 도구로만). `ADMIN_USER_IDS`(관리자 화면·보상 명단 제외용)는 있어야 한다.
   - `POLICY_EFFECTIVE_DATE`: env가 아니라 코드 상수(`src/lib/legal/policyVersions.ts`) — **배포 커밋에서 배포일로 채운다**(문서 버전 `2026-11-05.1`은 그대로).
   - OpenAI env(`OPENAI_API_KEY`·`OPENAI_REPORT_*`)는 **그대로 둔다**(지시). 참고: `OPENAI_API_KEY`가 있으면 Sonnet이 2시간 넘게 실패한 주문에 OpenAI 임시본 레인이 돈다(처리방침 위탁 표에 OpenAI 없음 — legal-review 확인 항목).
   - `FORTUNE_SALES_OPEN`은 넣지 않는다(대운·세운 판매 중지 유지). `REPORT_PRICE_KRW`는 넣지 않는다(코드 표).
4. **배포**(Production) → 아래 5번 보상 지급 → 6번 직후 확인.
5. **보상 이용권 지급(4-A절)**: dry-run으로 B 명단 개수 **36** 확인 → 같은 인자에 `--execute --confirm <캠페인 id>`. 36이 아니면 지급하지 않고 차이 명단을 덕짱님께 보고.
6. **배포 직후 확인**(4-B절): 실결제 3,900원 1건 + 환불 1건, 예시 페이지·팝업 ①②③(시험 계정)·이벤트 타이머, 과거 Book 세 계열 열람, `/dev` 404, 아이폰 Safari 미리보기 이미지, 메타 이벤트.

### 4-A. 보상 이용권 지급(배포 직후, 덕짱님 승인 하에)

```bash
# A(2장): f6122631-f85f-4144-ba5a-53c9af251e92 · 35c222b2-8e88-45df-839b-581ab1340e13 · 67db6b1f-e633-4b47-bf14-1ceea9dba6e7 (도구 기본값)
# B(1장): --cutoff(배포 시각, KST) 전에 가입한 계정 − A − ADMIN_USER_IDS − 시험 계정 목록(--exclude-file, 한 줄에 하나)
# 1) dry-run — 지급 0, 명단·개수만. B가 36이 아니면 멈추고 차이 명단 출력
SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… ADMIN_USER_IDS=… \
  pnpm exec tsx tools/final4/comp-campaign.ts --remote --campaign v5-relaunch-2026-11 --cutoff "<배포 시각 KST>" --exclude-file <시험 계정 목록> --expect-b 36
# 2) 실행 — 같은 인자 + 확인 플래그. 같은 캠페인 id로 다시 실행해도 이미 받은 계정은 건너뛴다(멱등)
…같은 명령… --execute --confirm v5-relaunch-2026-11
```

- 이용권: 받은 날부터 30일, 장마다 내가 쓰기 또는 선물 1회(선물해도 처음 기한), 이용권 리포트는 환불 없음(오류 시 재생성).
- SQL Editor로 할 때의 같은 함수 호출: `docs/v5/final4/event-comp.md` 2절.

### 4-B. 배포 직후 확인 항목

| 항목 | 방법 | 기대 |
|---|---|---|
| 실결제 3,900원 1건 + 환불 1건 | 덕짱님 카드로 종합 1건 결제 → 생성 대기 → 책 → 관리자 화면에서 환불 | 주문 금액 3,900, 승인·발행 정상, 환불 후 토스 취소 완료·책 열람 정책대로 |
| 배포 전 주문(1,490원) 승인 | 배포 직전에 결제창을 연 주문이 있으면 그대로 승인되는지(저장 금액 == 토스 금액) | 거절 없음 |
| 예시 페이지 | `/example` 로그인 없이 | 「예시 · 가상의 인물」, 표지·1·2장·끝 쪽 [내 리포트 만들기], og 제목·이미지(`/example/og`) |
| 팝업 ① | 로그아웃 상태 메인·상품 화면(이벤트 기간) | ① 하나, 「오늘 하루 보지 않기」 동작, 읽는 화면(/reports, /r)에는 없음 |
| 팝업 ②③ | B 시험 계정·A 계정(지급 뒤) 로그인 | ②(이벤트 기간이면 1+1 줄), ③(이용권 2장·만료일 = 발급일+30일) |
| 이벤트 타이머 | 메인 | 시작 전 「11월 7일 00시 시작」+카운트다운, 기간 중 종료까지, 끝나면 사라짐 |
| 주문서 | 상품 화면 → 주문서 | 3,900원, 기간 중 1+1 줄, 동의 「주문 내용과 환불 안내를 확인했어요」 한 칸, 아래 작은 회색 두 줄 |
| 과거 Book 세 계열 | v1·1.0·v2 / v4 / v5 Book을 주인 계정으로 | 배포 전과 같은 화면(재동의 전에도 열림) |
| `/dev` | `curl -sI https://www.gyeolreport.com/dev/v5-login` | 404 |
| 아이폰 Safari 미리보기 | 카카오톡·메시지에 `https://gyeolreport.com/`, `/example` 붙여 넣기 | 새 og 이미지(1200×630) |
| 메타 | Events Manager 테스트 이벤트 | 동의 사용자에게만 InitiateCheckout(결제창 열 때 1회), Purchase 1회 값 3,900 KRW, 이용권·보상은 Purchase 없음 |
| 원문 정리 크론 | ops-jobs 응답 `rawPurge` | 숫자(0 이상), `error` 아님 |

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

2026-11-05 기준 결과: migration 8개(1절 0~7번), 새 환경변수 35개. **최종 A(2026-11-06): migration 10개(0~9번), 새 환경변수 이름 0개(값만: `GIFT_EVENT_ENABLED=1`)**(2절, `ANTHROPIC_API_KEY`는 문자열로 읽어 위 grep에 안 잡힘 — 표에 따로 적음).

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
| 0 (가장 먼저, 독립) | `supabase/migrations/20261105130000_v5_final3_read_no_quarantine.sql` | **(v5 최종3 추가 지시 1)** `paid_report_reliability('quarantine')`을 무동작으로(행 변경 0, 본문 한 줄 삽입, 재실행 안전). 옛 앱(master)·롤백에서도 열람이 고객 Book의 status·snapshot_json을 바꾸지 못한다. 앱 코드와 독립이라 master 코드에서도 안전 | 1-0에서 보관한 `paid_report_reliability` 본문 다시 실행. 같은 함수를 통째로 다시 만드는 `scripts/*.sql` 패치를 나중에 실행하면 이 변경이 지워지므로 그 뒤엔 이 파일을 다시 실행 |
| 1 | `supabase/migrations/20261029130000_v5_writer_jobs.sql` | 이용권 큐 v5: `report_ticket_redemptions`에 열 3개(`writer_version`·`writer_lease_until`·`recovery_count`)+제약·색인, 새 표 `report_writer_chapters`(장 원고), `report_ticket_publication` 함수 교체(장 저장·회수 동작 추가, `WRITER_V5_PRODUCTS`가 비면 기존 동작) | 1-0에서 보관한 `report_ticket_publication` 본문을 다시 실행. 새 열·표는 남겨도 기존 코드가 쓰지 않는다(지우려면 진행 중 v5 작업이 0건일 때 `drop table public.report_writer_chapters;` 후 열 삭제) |
| 2 | `supabase/migrations/20261104100000_v5_p6d_ops.sql` | 운영 기반·생성 감독: 새 표 15개(`ops_settings`·`account_contacts`·`account_provider_facts`·`upgrade_roster`·`order_records`·`order_requests`·`order_refunds`·`ops_audit_log`·`book_generation_state`·`book_generation_runs`·`ops_writer_chapters`·`book_snapshot_versions`·`llm_provider_switch`·`gift_rewards`·`retained_order_records`), `payment_orders` 입력 시 주문코드 트리거(`ops_order_record`), 기존 주문에 주문코드 행 추가(legacy), 기존 가입자 명단(`upgrade_roster`, 2026-11-01 00:00 KST 이전 가입) 채움, 새 함수 `ops_account`·`ops_order`·`ops_generation`·`ops_gift`·`ops_admin`, `report_ticket_redemptions.not_before` 열, `report_ticket_publication` 다시 교체(보류 not_before), 권한 | ① `drop trigger ops_order_record on public.payment_orders;` ② 1번 적용 뒤 본문(1번 파일의 함수)으로 `report_ticket_publication` 복원 ③ 새 표·함수는 남겨 둔다(주문 기록·가입 정보·감사 로그가 들어 있어 지우면 자료 손실). 기존 v4 코드는 새 표를 읽지 않는다 |
| 3 | `supabase/migrations/20261104180000_v5_p6e_ops.sql` | 요청 자동 처리(`order_requests.resolved_by`, `ops_requests_autoclose`), 환불 출처 `external`, 이용권 상품 범위 배열(`report_ticket_grants.product_scopes` + `report_tickets`(또는 `report_tickets_before_launch`) 본문 4곳 패치), 선물 이용권 `gift_rewards.kind`·`gift_only`·`product_scopes`, `ops_gift`·`ops_admin`·`ops_order` 본문 패치, 보상 표 `comp_designations`·`comp_grants`, 새 함수 `ops_comp`·`ops_recon` | 1-0에서 보관한 `report_tickets(_before_launch)` 본문 복원(상품 범위 제한이 풀림 — 보상 이용권이 이미 지급됐다면 대운·세운에도 쓰일 수 있음에 주의). `ops_*` 함수는 2번 파일의 정의를 `create or replace`로 바꿔 실행하면 복원된다. 열·표는 남긴다 |
| 4 (**최종 A: 필수**) | `supabase/migrations/20261105090000_v5_final_payment_recovery_price_free.sql` | **(v5 최종 2-4)** 결제 복구 대기열(`claim_payment_recovery`)의 가격 목록 `o.amount not in (1290,1490)`을 모양 검사 `o.amount<100`으로. 지금 가격(1490)에서는 동작이 같고, 가격을 바꿔도 이전 가격 주문의 복구가 멈추지 않는다 | `pg_get_functiondef`로 본문을 읽어 `'o.amount<100 or o.currency'` → `'o.amount not in (1290,1490) or o.currency'`로 바꿔 실행(같은 방식의 좁은 치환), 또는 1-0에서 보관한 본문 실행. **최종 A에서 가격이 3,900원으로 바뀌므로 반드시 적용한다**(안 하면 3,900원 주문의 결제 복구가 `RECOVERY_ORDER_MISMATCH`로 멈춘다) |
| 5 | `supabase/migrations/20261105091000_v5_final_comp_choice.sql` | **(v5 최종 2-3)** `ops_comp('sync')` 두 곳 패치: 보상 이용권을 모두 고를 수 있는 이용권(`gift_rewards`, 선물 전용 아님)으로 지급, A 총 장수 `aQty`(B로 먼저 받았으면 그만큼 뺌)·B `bQty`. 3번 바로 뒤에 적용해야 한다(코드가 `aQty`를 넘긴다) | 3번 파일의 `ops_comp` 정의를 `create or replace`로 바꿔 실행(본인용 1장+선물 전용 1장 방식으로 돌아감 — 이때는 코드도 함께 되돌려야 한다: `aSelf`·`aGift` 인자). 이미 지급한 행은 그대로 |
| 6 | `supabase/migrations/20261105120000_v5_final3_tickets_reading.sql` | **(v5 최종3 9)** ① 이용권 30일: `ops_gift` issue·bonus 기한을 `least(보낸 값, now()+30일)`, `ops_comp` 유효일 `least(days,30)`, `report_tickets`를 감싸 기한 없이 들어온 지급(관리자·캠페인 등)은 발급일+30일(같은 key 재요청은 처음 기한), summary에 남은 묶음 `lots`(장수·만료일). ② 열람: 제약 `paid_report_snapshots_access_expiry_check`에 `expires_at='infinity'` 허용, 처음 발행 때 스냅샷 `productVersion='v5'`면 기한 없음(트리거 `report_access_by_version`), 결제 Book 입력도 같이(`report_access_sync_input`·`report_input_access_by_version`). **이미 v5로 발행되어 열린 Book의 `expires_at`을 `infinity`로 바꾼다(기존 행 변경 — 적용 전 `select count(*) from paid_report_snapshots where status='COMPLETED' and snapshot_json->>'productVersion'='v5'`로 대상 수 확인, 고객 Book 변경이라 승인 필요)** | 파일 끝 주석 순서(트리거·함수 삭제 → `report_tickets_before_final3`를 `report_tickets`로 되돌림 → `ops_gift`·`ops_comp` 패치 역적용). 기한 없음이 된 Book을 되돌리는 것은 고객 Book 변경이라 승인 필요 |
| 7 | `supabase/migrations/20261105160000_v5_final3_writer_raw.sql` | **(v5 최종3 6)** 운영 워커 호출 원문 저장소: 새 표 `ops_writer_raw`(report_id·raw_key·kind·entry, RLS 켬, anon·authenticated 권한 없음) + 함수 `ops_writer_raw(p_action, p_data)`(`raw_save`·`raw_load`·`raw_clear`, 현재 lease 토큰만 — 결제 큐·교체 레인·이용권 큐), service_role만 실행. 추가만 함(기존 표·함수 변경 없음). 되돌리기: `drop function public.ops_writer_raw(text,jsonb); drop table public.ops_writer_raw;`(코드는 저장 실패를 무시하고 Book meta.raw로 계속 동작) |
| 8 | `supabase/migrations/20261106100000_v5_final4_event_comp.sql` | **(최종 A 11·12·14)** ① `ops_gift` issue의 계정 상한을 이벤트 이용권(`kind='event'`)만 세게 좁게 패치(보상 이용권이 1+1 상한을 먹던 결함, 이미 고친 본문이면 건너뜀) ② 새 표 `comp_campaign_grants`(캠페인 id + 계정 = 한 번) ③ 새 함수 `ops_comp_campaign('roster'·'run'·'popup')`(service_role만). 기존 행 변경 없음. 6번 뒤 | `drop function public.ops_comp_campaign(text,jsonb);`(지급 기록 표는 남김). ①은 `ops_gift` 본문의 `" and kind='event';"` → `";"` 같은 방식의 좁은 치환 |
| 9 | `supabase/migrations/20261106180000_v5_final4_writer_raw_purge.sql` | **(최종 A 18)** `ops_writer_raw`에 `raw_purge` 동작 추가(함수 교체만): 작업용 원문 사본을 발행 완료 30일 뒤, 발행 실패는 처리 완료(포기·환불·취소·이용권 되돌림·마지막 저장 중 가장 늦은 때) 30일 뒤 삭제. 크론 `/api/internal/ops-jobs`가 5분마다 부른다. Book 스냅샷 안 `meta.raw`는 고객 Book이라 지우지 않음. 7번 뒤 | 7번 파일의 함수 정의를 다시 실행 |

- 0번 적용 전 점검(읽기 전용): 2-1절 [R1-b] → `true`. 적용 뒤 2-1절 [R1] → `read_quarantine_disabled = true`.
- 6번은 5번 뒤, 코드(이용권 30일·`lots` 표시·열람 기한 없음 표시 `expiresAt==="infinity"`)와 **같은 배포에서** 적용한다. 코드만 먼저 나가면 이용권 기한은 코드 값(30일)대로지만 v5 Book은 90일로 남고, migration만 먼저 나가면 서재가 `infinity` 기한 Book을 목록에서 뺀다(옛 코드).
- 문서 시행일: `src/lib/legal/policyVersions.ts`의 `POLICY_EFFECTIVE_DATE`(지금 null → 문서에 "배포일(확정 전)")를 배포일로 채운 커밋을 배포한다. 문서 버전(`CHECKOUT_POLICY_VERSIONS` 2026-11-05.1)이 바뀌어 회원은 다음 로그인 때 약관·개인정보 재동의 화면을 본다. **재동의 전에도 이미 산 책(결제 Book·이용권 Book)은 열린다**(최종3 1-7, `src/lib/account/policy.ts` `mayReadOwnedBooks` — 각 종류의 가장 최근 기록이 필수 동의면 버전과 무관하게 열람 허용). 새 결제·이용권 사용·공유 링크 발급은 재동의 뒤에만 된다.
- 3·5번은 **같은 배포에서 함께** 적용한다(코드 `compSyncArgs`가 `aQty`를 넘기므로 5번 없이 켜면 A가 `COMP_CONFIG_INVALID`). `COMP_ENABLED`가 꺼져 있으면(기본) 지급은 일어나지 않는다.
- 2번의 트리거는 결제 주문 입력마다 `order_records` 1행을 만든다. 적용 직후 `select count(*) from order_records where legacy` 가 기존 주문 수와 같은지 본다.
- 7번(최종3 6)은 1~6번 뒤 아무 때나 적용해도 된다(추가만). 코드보다 늦게 적용되면 그사이 주문은 원문을 저장하지 못하고(저장 실패 무시) 재시도 때 작가를 다시 부를 수 있다 → **코드보다 먼저** 적용하는 것을 권한다. 확인: `select to_regclass('public.ops_writer_raw'), has_function_privilege('anon','public.ops_writer_raw(text,jsonb)','execute');` → `ops_writer_raw | f`.
- `ops_writer_raw` 행은 주문마다 원문 2~4개(약 30~80KB)이고 Book meta.raw에도 같은 원문이 남는다. 작업용 사본은 9번(최종 A 18)이 발행 30일 뒤·실패 처리 완료 30일 뒤 지운다. Book 안 meta.raw는 고객 Book이라 그대로(법률 검토 6번).

---

## 2. Vercel 환경변수 (Production)

값은 적지 않는다. "새로"는 master에 없던 변수. `NEXT_PUBLIC_*`는 빌드에 들어가므로 바꾸면 다시 배포해야 한다.

| 이름 | 용도 | 값을 어디서 | 필수 |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | v5 정식본 작가(Sonnet). 없으면 정식본을 만들 수 없어 시간표대로 보류→24시간 뒤 포기·자동 환불 | Anthropic 콘솔(덕짱님) | **필수(새로)** |
| `WRITER_V5_PRODUCTS` | v5 작가를 켤 상품 키(쉼표). 비면 6상품 모두 V4 경로. 비었거나 아래 값과 다르면 서버 시작 때 `WRITER_V5_PRODUCTS_MISMATCH` 로그 한 줄(`src/instrumentation.ts`) | **정확한 값: `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility`** (출시 4종, 공백 없이) | **필수(새로)** — 운영에 지금 없음(2026-11-05 확인). 배포 전에 넣어야 그 배포에 들어간다 |
| `OPENAI_API_KEY` | 임시본 레인(Sonnet이 2시간 넘게 실패할 때 terra 임시본, `src/lib/ops/generation/supervisor.ts:50`). 없으면 임시본 없이 정식본만 기다림 | OpenAI 콘솔 | 선택(기존 — 운영에 있음). 임시본 레인을 쓸 거면 둔다, 아니면 지운다 |
| `OPENAI_REPORT_WRITER_ENABLED` | **v5 코드는 읽지 않음**(src 0건). master(`reportWriterRuntime.ts:34`)만 읽는다 — 값이 `1`이면 master로 롤백했을 때 결제 워커가 OpenAI 작가를 부른다 | — | 운영에 있음. **롤백 대비로 `0`(꺼짐)으로 두고, v5가 안정되면 삭제** |
| `OPENAI_REPORT_MODEL` | **v5 코드는 읽지 않음**. master `reportWriterRuntime.ts:42`만 읽음 | — | 운영에 있음. v5 안정 뒤 삭제(그 전엔 두어도 무해) |
| `REPORT_PRICE_KRW` | **env로 읽지 않음** — 가격은 코드의 상품별 표 한 곳 `src/lib/payment/reportProductCatalog.ts` `REPORT_PRICE_TABLE_KRW`(출시 4종 3,900원, 대운·세운 4,900원 — 판매 중지 유지). 배포 전에 만든 주문은 저장 금액 == 토스 금액이면 그대로 승인(1,490원 주문 포함) | — | **넣지 않는다**(넣어도 무시). 가격 변경은 표 한 곳 코드 변경 |
| `ORDER_COST_CAP_USD` | **(최종3 6)** 주문 1건 비용 상한(기본 **0.55** = 계산한 최악 비용). 넘을 것 같으면 검수·수리만 건너뛰고 작가는 늘 부른다(결제 주문은 비용으로 보류하지 않음) | 넣지 않음(기본값) | 선택(새로) |
| `LLM_REVIEW_MODEL` | **(최종3 4·5)** 의미 검수 모델. 기본 `claude-haiku-5-5`(측정 채택: effort low, 생각은 adaptive라 예산 고정 불가 — 출력 상한 32,000토큰에 생각 포함, 측정 35회 최대 11,173). `claude-sonnet-5-5`만 다른 값으로 허용 | 넣지 않음(기본값) | 선택(새로) |
| `LLM_PROMPT_CACHE` | **(최종3 6)** `on`이면 시스템 프롬프트 5분 캐시. 손익분기 약 시간당 3건(같은 지침 호출 간격 5분 안이 22% 넘을 때)이라 출시 초기에는 **넣지 않음(끔)**, 주문이 시간당 3건을 꾸준히 넘으면 `on` | 덕짱님 결정(나중) | 선택(새로) |
| `LLM_PROVIDER` · `LLM_MODEL` · `LLM_FALLBACK` · `LLM_MAX_OUTPUT_TOKENS` | 작가 공급자·모델·대체·출력 상한. 정식본은 감독이 Sonnet으로 고정하므로 **넣지 않는 것을 권장** | — | 넣지 않음(새로) |
| `CRON_SECRET` | 크론 5개 인증(1-3절 크론) | 기존 값 그대로 | 필수(기존) |
| `SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` · `SUPABASE_ANON_KEY` · `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | DB(ops 저장소·생성 감독·진행 상태 읽기도 같은 service_role) | 기존 값 그대로 | 필수(기존) |
| `TOSS_PAYMENTS_SECRET_KEY` · `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` · `TOSS_CONFIRM_API_ENABLED` | 결제 승인·환불 크론(ops-jobs) | 기존 값 그대로(라이브 키) | 필수(기존) |
| `ADMIN_USER_IDS` | 관리자 화면 `/admin/orders`를 열 계정 id(쉼표). 비면 아무도 못 연다 | 덕짱님 계정 id(Supabase auth.users) | 필수(새로, 관리자 화면을 쓰려면) |
| `ADMIN_ACTION_PIN` | 환불·이용권 지급·보상 지정 때 다시 넣는 PIN | 덕짱님이 정함 | 필수(새로, 관리자 동작을 쓰려면) |
| `ADMIN_REFUND_DAILY_MAX_COUNT` · `ADMIN_REFUND_DAILY_MAX_AMOUNT` · `ADMIN_SESSION_HOURS` | 관리자 환불 하루 상한(기본 5건·50,000원), 다시 로그인 시간(기본 12) | 덕짱님 결정 | 선택(새로) |
| `KAKAO_CHANNEL_PUBLIC_ID` | 카카오 채널 관계 조회(가입 정보·채널 친구 여부) | **덕짱님이 Production 입력 완료** | 필수(새로) — 완료 |
| `KAKAO_ADMIN_KEY` | 탈퇴 때 카카오 연결 끊기 | 카카오 디벨로퍼스 앱 어드민 키(덕짱님) | 필수(새로) |
| `COMP_ENABLED` | 서재를 열 때 보상 이용권을 늦게 지급(`ops_comp sync`)하는 옛 방식. **최종 A: 넣지 않는다** — 보상은 캠페인 도구(`tools/final4/comp-campaign.ts`, 캠페인 id 멱등)로만 지급한다(4-A절) | — | **넣지 않음** |
| `COMP_A_QTY` · `COMP_B_QTY` · `COMP_PRODUCTS` | 보상 장수·상품(기본 A 2장, B 1장, 종합·커리어·연애·궁합). 유효일은 30일 고정(최종3: `COMP_A_VALID_DAYS`·`COMP_B_VALID_DAYS`는 더 이상 읽지 않고, SQL도 30일을 넘기지 않는다). 예전 `COMP_A_SELF_QTY`·`COMP_A_GIFT_QTY`도 읽지 않는다 | 기본값이면 넣지 않음 | 선택(새로) |
| `GIFT_EVENT_ENABLED` · `GIFT_EVENT_START` · `GIFT_EVENT_END` · `GIFT_EVENT_MAX_PER_ACCOUNT` · `GIFT_EVENT_BONUS_MAX` · `GIFT_EVENT_PRODUCTS` | 1+1 이벤트(결제 1건마다 이용권 1장, 계정당 2회, 30일, 선물 1회, 친구 첫 결제 보너스). **최종 A: 기간 기본값이 코드에 있다(2026-11-07 00:00:00 ~ 11-16 23:59:59 KST, 서버 시각)**. 시각에 오프셋이 없으면 KST로 읽고, 끝이 `:59`초면 그 초까지 포함. 메인 배너·타이머·팝업 ①·주문서 1+1 줄이 같은 설정을 읽는다 | `GIFT_EVENT_ENABLED=1`(필수). 기간을 바꿀 때만 `GIFT_EVENT_START`·`GIFT_EVENT_END`(예 `2026-11-16 23:59:59`) | **필수: `GIFT_EVENT_ENABLED=1`** |
| `FORTUNE_SALES_OPEN` | `1`이면 대운·세운 판매 재개(기본 닫힘). 12월 1일 | 덕짱님 결정 | 선택(새로) |
| `NEXT_PUBLIC_META_PIXEL_ID` · `META_MEASUREMENT_APPROVED` · `META_CONVERSIONS_ACCESS_TOKEN` · `META_GRAPH_API_VERSION` | Meta 픽셀(켜져 있을 때만 푸터 '광고 설정') | 기존 값 그대로 | 기존 |
| `OPS_MOCK_WRITER` · `OPS_FORCE_ANTHROPIC_DOWN` · `LLM_BUDGET_SCOPE` · `LLM_BUDGET_RUN` · `LLM_BUDGET_RUN_ID` · `LLM_BUDGET_STAGE` · `PAID_WORKER_MAX_RSS_MB` · `TICKET_WORKER_MAX_RSS_MB` | 로컬 개발 전용(코드가 `NODE_ENV=development`에서만 읽음) | — | **Production에 넣지 않음** |

---

## 2-1. 열람 보호 [R1] 기록과 운영 확인 SELECT (읽기 전용, 덕짱님이 SQL Editor에서)

- **[R1]** `scripts/paid_report_quarantine_recovery_patch.sql` 운영 적용 — **확인 완료(격리 시 내용 보존, 단 열람 불가)**. 이번 배포의 열람 경로는 격리를 부르지 않고 로그(`REPORT_READ_VALIDATION_FAILED`)만 남기며, 1절 0번 migration 뒤에는 SQL 격리도 무동작이다.
- 운영 고객 Book 41권(2026-11-05: v1·1.0·v2 8권, v4 33권, 모두 COMPLETED, 격리 0)은 배포 전·후 [R4]·[R5]가 같아야 한다.

```sql
-- [R1] quarantine 본문 상태
select position('''quarantined''' in d) > 0 as quarantine_keeps_snapshot,           -- 확인 완료: true
       position('snapshot_json=null where report_id=p_data->>''reportId''' in d) > 0 as quarantine_clears_snapshot, -- false
       position('READ_QUARANTINE_DISABLED' in d) > 0 as read_quarantine_disabled     -- 0번 적용 뒤 true
from (select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d) x;

-- [R1-b] 0번 migration 적용 가능 여부(분기 정확히 1개): true
select (length(d)-length(replace(d,'elsif p_action = ''quarantine'' then','')))/length('elsif p_action = ''quarantine'' then') = 1 as read_no_quarantine_ready
from (select pg_get_functiondef('public.paid_report_reliability(text,jsonb)'::regprocedure) d) x;

-- [R4] 고객 Book 계열·상태(배포 전·후 같아야 함)
select coalesce(s.snapshot_json->>'productVersion','(내용 없음)') as product_version, s.status,
       count(*) as books, count(*) filter (where s.snapshot_json is null) as no_content
from public.paid_report_snapshots s join public.payment_orders po on po.payment_order_id = s.order_id
where po.status = 'paid' group by 1, 2 order by 1, 2;

-- [R5] 열람 격리 흔적(배포 전·후 증가 0)
select j.last_error_code, s.status, count(*) from public.report_generation_jobs j join public.paid_report_snapshots s using (report_id)
where j.last_error_code in ('READ_GATE_REJECTED','PUBLISHED_SNAPSHOT_VALIDATION_FAILED') or s.status = 'FAILED_REQUIRES_ATTENTION'
group by 1, 2;
```

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

0. **켜는 순서**: ① 2-1절 [R1]·[R1-b]·[R4]·[R5] 실행, 결과 보관(`paid_report_reliability` 본문도 보관) ② 1절 0번 migration → [R1] 다시(`read_quarantine_disabled=true`) ③ 1~7번 순서대로 ④ Production env: `WRITER_V5_PRODUCTS` 추가(위 정확한 값), `FORTUNE_SALES_OPEN`은 넣지 않음, `OPENAI_REPORT_WRITER_ENABLED=0` ⑤ 배포.
1. **migration 적용 직후(배포 전)**: 1-0 SQL을 다시 돌려 `v5_not_applied_yet=false`, `recovery_price_list=false`(4번 적용 시). `select count(*) from upgrade_roster;`가 기존 가입자 수와 같은지, `order_records`의 legacy 행 수가 기존 주문 수와 같은지.
2. **환경변수**: 2절 필수 항목이 Production에 있는지(값은 보지 않고 이름만). 개발 전용 변수가 없는지.
3. **배포 직후 공개 화면**(로그인 없이):
   - 홈 `/`: 6권 진열이 자동 회전(모바일 포함), 푸터 아이콘 순서 인스타그램·카카오톡·X·스레드(새 탭), "채널 보기" 없음.
   - `GET /api/analytics/meta`가 `ready:true`이면 푸터에 '광고 설정'이 보이고, 첫 방문 카드는 화면 맨 위 흐름 안(버튼·쪽 넘김과 겹치지 않음), 닫으면 다시 안 뜸.
   - `curl -s https://gyeolreport.com/ | grep og:image` → `gyeol-report-og-20261030.png`(1200×630), 그 주소가 200. 옛 주소 `/brand/gyeol-report-og.png`도 새 이미지(1200×630)로 바뀌어 있음(아이폰 Safari 제안 이미지 원인 — 최종3 추가 지시 4).
   - `curl -sI https://www.gyeolreport.com/dev/v5-login` → 404, `/dev/book-preview` → 404(`src/proxy.ts`가 배포 빌드에서 /dev/* 전부 404).
   - Runtime Logs: 서버 시작 직후 `WRITER_V5_PRODUCTS_MISMATCH` 0건.
   - 기존 Book 2~3권(v4·legacy)을 그 주인 계정으로 `/reports/<id>`에서 연다 — **재동의 전에도 열림**(1-7), 내용이 배포 전과 같음.
   - 대운·세운: 상품 화면·결제 준비·주문·이용권 409, 배포 직전 결제창을 연(승인 전) 대운·세운 주문은 승인 단계에서 409(토스 승인 없음).
4. **크론**: Vercel 대시보드 Crons에 5개, 5분 안에 `report-writer-recovery`·`ops-jobs` 로그가 200(401이면 `CRON_SECRET`).
5. **결제 1건(승인 필요, 덕짱님)**: 결제 → `/reports/<id>` 생성 대기 화면 → `GET /api/reports/<id>/progress`가 `preparing`(감독 시작 뒤 단계 '책 집필') → 완성되면 같은 주소에서 책으로 바뀜 → 서재에 보임. 관리자 화면 상세에 시도·비용 기록.
6. **이용권 1장**: 서재에서 이용권으로 책 만들기(운영 출처) → 발행 → 서재.
7. **관리자**: `/admin/orders`가 `ADMIN_USER_IDS` 계정에서만 열리고 다른 계정은 404.
8. **보상**: 최종 A부터 `COMP_ENABLED`는 넣지 않고 캠페인 도구로만 지급한다(맨 위 4-A절). 지급 뒤 B 시험 계정 서재에 '보상 이용권' 1장(내가 쓰기·선물 링크), A 계정은 2장, 팝업 ②·③.
9. **배포 뒤 24시간**: 2-1절 [R4]·[R5] 다시 — 격리 행 증가 0, Vercel 로그 `REPORT_READ_VALIDATION_FAILED`·`REPORT_READ_SNAPSHOT_MISMATCH` 0건(있으면 그 Book id로 원인 확인 — 저장본은 그대로).
10. **되돌리기 판단**: 결제 승인 실패·생성 대기 고정·크론 401이 보이면 Vercel에서 직전 배포로 Promote(코드 되돌리기) → DB는 1절 표의 되돌리기 칸을 필요한 것만(새 표·열은 남겨도 기존 코드와 충돌하지 않는다).
