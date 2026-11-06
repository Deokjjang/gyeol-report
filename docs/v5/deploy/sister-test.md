# 누나 실고객 시험 — 확인표 (운영, 2026-11-06~)

누나 = 새 계정(배포 완료 뒤 가입이라 보상 B 대상 아님), 친구 = 누나가 선물 링크를 보낼 새 계정. 이벤트 1+1 기간 11-06 09:00 ~ 11-16 23:59:59 KST.
DB 확인은 Supabase SQL Editor(읽기만). `:누나` = 누나 이메일, `:친구` = 친구 이메일.

```sql
-- 계정 id 찾기(가입 정보 입력 뒤)
select user_id, full_name, created_at from public.account_contacts where email in (:누나, :친구);
```

| # | 누나가 하는 일 | 화면에 보여야 하는 것 | 그 뒤 DB에서 볼 값 |
|---|---|---|---|
| 1 | 새 계정으로 가입(카카오/구글 → 약관·개인정보 동의 → 가입 정보) → 메인 | 팝업 ①「한 권을 펼치면, 한 권이 더」, 기간 줄 「11월 6일 – 11월 16일」, 「오늘 하루 보지 않기」. 메인 배너 「종료까지 N일 …」 | `auth.users` 1행(created_at = 가입 시각) · `account_profiles` 1행 · `account_consent_events` terms·privacy `2026-11-05.1` is_agreed · `account_contacts` 이름·이메일 · 보상 지급 없음(`comp_campaign_grants`에 없음) |
| 2 | [예시 먼저 보기] → `/example` → 상품 고르기 → 입력 → 주문서 → 결제 3,900원(토스) | 예시: 「예시 · 가상의 인물」. 주문서: PRICE 3,900원, 「1+1 · 결제 후 무료 이용권 1장」, 동의 칸 **두 개**(「주문 내용과 환불정책을 확인하고 동의해요」·「만 14세 이상」), 맨 아래 회색 「결제하면 바로 생성이 시작돼 단순 변심 환불은 되지 않아요 · 예시 보기」 / 「명리 계산과 MBTI 자료를 바탕으로 AI가 작성해요」 | `payment_orders`: amount **3900**, status `paid`, paid_at, product_type · `order_records`: order_code `GR-…`, user_id = 누나 · `report_input_snapshots.payload_json`→`consentEvidence`: `ui.version='final4-order-refund-v2'`, `ui.layout='member'`, assertions 일곱 개 모두 true, `policyVersions` 2026-11-05.1 |
| 3 | 생성 대기 화면 → 책 열기 | 진행 표시 → 완성된 책(표지·장 13개), 책 끝 「이 리포트는 … AI가 작성했어요」 | `report_generation_jobs`: QUEUED→RUNNING→**COMPLETED** · `book_generation_runs`: provider `anthropic`, model `claude-sonnet-5-5`, cost_usd(주문당 상한 0.55 안) · `paid_report_snapshots`: status COMPLETED, `snapshot_json->>'productVersion'='v5'`, **expires_at = infinity** |
| 4 | 내 서재 | 무료 이용권 1장(이벤트), 만료일 = 결제일 + 30일(12월 6일 무렵) | `gift_rewards`: owner = 누나, kind `event`, source_order_id = 2번 주문, status `available`, expires_at ≈ 결제 + 30일 |
| 5 | 이용권 → [선물 링크 만들기] → 친구에게 링크 보내기 | 링크 `https://www.gyeolreport.com/gift/…` | 같은 `gift_rewards` 행: status **gifted**, token_hash 있음, gifted_at |
| 6 | 친구: 링크 열기 → 가입(동의·가입 정보) → 받기 → 이용권으로 책 만들기 | 친구 서재에 이용권 1장(기한 = 누나가 받은 기한 그대로), 이용권 1장으로 책 발행 → 책 열림 | `gift_rewards`: status **claimed**, recipient_user_id = 친구, claimed_at · `report_ticket_grants`(친구): reason `EVENT_GIFT_RECEIVED`, source_ref `gift-claim:<선물 id>`, expires_at = 누나 기한 · `report_ticket_redemptions`(친구): state COMPLETED · 친구 책 `paid_report_snapshots` productVersion v5 |
| 7 | (친구가 첫 결제를 하면) | 누나 서재 이용권 +1장 | 친구 `payment_orders` paid 1건째 → 누나 `report_ticket_grants`: reason `EVENT_GIFT_BONUS`, source_ref `gift-bonus:<선물 id>` · 원래 `gift_rewards.bonus_granted_at` 채워짐(계정당 보너스 최대 2) |

```sql
-- 2~4: 누나 주문·책·이용권 한 번에
select o.payment_order_id, o.amount, o.status, o.paid_at, r.order_code,
       i.payload_json->'consentEvidence'->'ui'->>'version' as ui_version, i.payload_json->'consentEvidence'->'ui'->>'layout' as layout,
       s.status as book, s.snapshot_json->>'productVersion' as v, s.expires_at,
       g.kind, g.status as gift, g.expires_at as gift_expires
from public.order_records r join public.payment_orders o using (payment_order_id)
left join public.report_input_snapshots i on i.order_id = o.payment_order_id
left join public.paid_report_snapshots s on s.order_id = o.payment_order_id
left join public.gift_rewards g on g.source_order_id = o.payment_order_id
where r.user_id = '<누나 id>' order by o.created_at desc;
-- 5~7: 선물·보너스
select id, status, recipient_user_id, gifted_at, claimed_at, bonus_granted_at, expires_at from public.gift_rewards where owner_user_id = '<누나 id>';
select user_id, reason, source_ref, quantity, expires_at from public.report_ticket_grants where user_id in ('<누나 id>', '<친구 id>') order by granted_at;
```

막히면 볼 곳: 4번이 안 보이면 결제 완료 화면을 못 본 경우 5분 크론(`/api/internal/ops-jobs`의 이벤트 이용권 발급)이 채운다. 6번 받기가 「가입 정보 입력」으로 막히면 친구가 가입 정보(이름·이메일)를 먼저 넣어야 한다(`PROFILE_REQUIRED`). 7번 보너스는 이벤트 기간 안의 친구 **첫** 결제 완료 주문 1건만.
