# 결제수단 긴급 수정 + 시험 계정 집계 제외 (2026-11-10)

브랜치 `v5/hotfix-pay-01`(기준 master `36d08bf4` = 운영 `dpl_EduYZoGyjsVtcM7yCELEUnVLSsAr`). 덕짱님 지시·배포 승인 2026-11-10.

## 1. 문제

2026-11-06(3238becb)부터 결제창을 `card.flowMode: "DEFAULT"`(카드·간편결제 통합결제창)로 열었다. 통합결제창에는 계약하지 않은 카드·페이코·삼성페이까지 보였다.

## 2. 바꾼 것

### 결제수단
- 주문서 「결제하기」 → 결제 준비 없이 우리 하단 시트(「결제수단 선택」)만 연다. 버튼은 **[카카오페이] [토스페이]** 두 개, 이 순서.
- 버튼을 누르면 시트를 닫고(PC 토스 결제창이 모달 아래에 깔리지 않게) 기존 결제 준비(`/api/payment-checkout/prepare`) → 토스 SDK `requestPayment({ method: "CARD", …, card: { flowMode: "DIRECT", easyPay: "KAKAOPAY" | "TOSSPAY" } })`.
- `easyPay`가 둘 중 하나가 아니면 결제 준비도 하지 않는다(`runDevTossCheckout`), SDK도 부르지 않는다(`launchTossCheckout`).
- 참고: 2026-09-24 `9aef88ad` 두 버튼 방식(DIRECT + easyPay).
- **바꾸지 않은 것**: 결제 준비 요청 본문, 승인(`/payments/toss/success`)·확정·환불·웹훅 경로, 서버 금액 대조. diff는 화면(`BookCheckout.tsx`·`book.module.css`)과 결제창 여는 두 파일(`tossClientCheckoutLauncher.ts`·`tossClientCheckoutTypes.ts`), 준비 함수의 수단 검사(`DevTossCheckoutLauncher.tsx`)뿐이다.
- 묶음 이용권 상점(`shopClient.ts`)은 코드에서 꺼져 있어(`ticketBundleCommerceEnabled() = false`) 손대지 않았다. 다시 켤 때 같은 DIRECT 방식으로 바꿔야 한다.

### 시험 계정(관리자 `ADMIN_USER_IDS` + 누나 계정 `d0dd2e4e-…`)
- migration `20261110200000_v5_test_accounts.sql`:
  - `ops_settings` `test_accounts = {"ids":[…]}`(처음 값 누나 계정 하나).
  - `ops_test_user(uuid) → boolean`: 시험 계정인가. **앞으로의 퍼널 집계도 이 함수로 뺀다**(service_role만).
  - 기존 함수 4곳 앵커 패치(운영 본문에서 앵커 5개 모두 1번씩 확인 후 적용): `ops_notify('stats')` 결제·환불에서 시험 계정 제외, `ops_notify_order`·`ops_notify_ticket`에 `test`, `ops_notify_put_setting`이 `test_accounts`(uuid 배열 20개까지)를 쓸 수 있게.
- 서버: 1분 크론(`runNotifyCycle`)이 DB 목록을 env `ADMIN_USER_IDS` + 누나 계정으로 맞춘다(`testAccountIds`, 서버 전용 `src/lib/ops/notify/deps.ts` — 화면 묶음에 계정 id가 실리지 않게).
- 매출 봇: `/today`·`/yesterday`·`/month`(지난달 비교 포함), 결제 알림의 「오늘 N건」, 환불 알림의 「오늘 순매출」에서 빠진다. 알림은 그대로 보내고 맨 앞에 **「🧪 시험(집계 제외)」**. 처리 봇 메시지도 같은 표시.
- 손대지 않은 것: `/event`(1+1 이용권 현황), Meta 전송(시험 계정 결제도 기존 규칙대로 나간다).

## 3. 확인

| 항목 | 판정 | 근거 |
|---|---|---|
| 결제 단위 시험(시트·DIRECT·수단 거절) | PASS | checkoutReceipt·tossClientCheckoutLauncher·DevTossCheckoutLauncher·PaidFunnel·metaCheckout·bookPublicFlow |
| 시험 계정 SQL·봇 시험 | PASS | opsNotifySql(PGlite)·opsBots |
| 모바일 브라우저 7곳 × 2수단(로컬, 토스 시험 키) | PASS(흉내) | 아래 표 |
| 앱 전환(「눌러서 열기」·「다음」 뒤 카카오톡·토스 앱) | UNVERIFIED | 흉내 브라우저로는 앱을 못 연다 → 실기기 확인 필요 |
| tsc·eslint·build | PASS | tsc 0, 바꾼 파일 eslint 0, `pnpm run build` 성공. 화면 묶음(.next/static): `flowMode:"DEFAULT"` 0곳·`"DIRECT"` 3곳, 누나 계정 id 0곳 |
| 전체 시험 새 실패 | PASS(0건) | 두 트리 동시 실행(브랜치 816 실패 / 기준 master 858 실패). 브랜치에서만 실패한 5건은 모두 STACK_TRACE_ERROR(부하 시간 초과) → 단독 재실행 통과, 같은 파일의 다른 실패 11건은 기준에서도 실패(기존). 새 시험 20개 통과 |

브라우저 확인(WebKit = iOS, Chromium = Android, 390px, 각 UA): 「결제하기」 → 시트 버튼 `KAKAOPAY:카카오페이`, `TOSSPAY:토스페이` 두 개, 시트를 열 때 결제 준비 0번, 수단을 누른 뒤 1번(200). 토스 SDK에 넘긴 값 `card: {"flowMode":"DIRECT","easyPay":"KAKAOPAY"|"TOSSPAY"}`(iOS 사파리에서 기록).

| 환경 | 카카오페이 | 토스페이 |
|---|---|---|
| iOS 사파리 | 카카오페이 「결제를 위해 카카오페이를 열어주세요」 | pay.toss.im 「토스페이로 결제하려면 다음을…」 |
| iOS 크롬(CriOS) | 같음 | 같음 |
| Android 크롬 | 같음 | 같음 |
| iOS 카카오톡 인앱 | 같음 | 같음(1회차는 부하로 이동 전 시간 초과, 단독 재실행 통과) |
| iOS 인스타 인앱 | 같음 | 같음 |
| Android 카카오톡 인앱(wv) | 같음 | 같음 |
| Android 인스타 인앱(wv) | 같음 | 같음 |

경로는 모두 `payment-gateway-sandbox.tosspayments.com/mobile/direct` → 각 간편결제 화면(통합결제창 없음).

## 4. 운영 적용

- 사전 확인(읽기): 운영 함수 본문에서 앵커 5개 모두 1번(`stats_pays`·`stats_refs`·`order_test`·`ticket_test`·`put_setting`), 운영 migration 기록 32건(마지막 20261110100000), dry-run 대기 1건.
- migration `20261110200000` 운영 적용 **2026-11-10 17:50 KST**(CLI 임시 폴더). 적용 뒤: 기록 마지막 20261110200000, `ops_test_user` 있음, 누나 계정 = 시험, 네 함수 패치 확인, 목록 1개(관리자 id는 새 코드의 1분 크론이 더한다).
- master 병합·배포: 아래 「배포 기록」(v5/main에 적는다 — master에 문서만 올리면 운영 배포가 한 번 더 돈다).

## 5. 롤백

- 화면·결제: Vercel 운영 배포를 `dpl_EduYZoGyjsVtcM7yCELEUnVLSsAr`(master `36d08bf4`)로 되돌린다.
- DB(옛 코드와 함께 둬도 문제 없음 — 옛 코드는 `test` 칸을 읽지 않고, 집계는 목록에 든 시험 계정만 뺀다): 집계 제외까지 되돌릴 때만 아래를 실행(같은 트랜잭션 안에서 migration 파일의 `pg_temp.t_patch` 정의를 먼저 실행).

```sql
begin;
-- 이 migration의 앵커 치환을 거꾸로(새 → 옛). pg_temp.t_patch는 migration 파일의 정의를 그대로 쓴다.
select pg_temp.t_patch('public.ops_notify(text,jsonb)'::regprocedure, $p$ and not public.ops_test_user(public.ops_order_user(po.payment_order_id)))$p$, $p$)$p$, 2);
select pg_temp.t_patch('public.ops_notify_order(text)'::regprocedure, $p$'test',public.ops_test_user(v_user),$p$, '');
select pg_temp.t_patch('public.ops_notify_ticket(text)'::regprocedure, $p$'test',public.ops_test_user(v_rr.user_id),$p$, '');
-- put_setting의 test_accounts 분기는 남겨도 무해(쓰는 코드가 없어진다).
commit;
```

## 6. 남은 일

- 실기기 확인(덕짱님): 사파리·크롬·카카오톡·인스타에서 「결제하기」 → 카카오페이·토스페이 각각 앱으로 넘어가는지.
- 묶음 이용권 상점을 다시 켤 때 `launchBundleCheckout`도 DIRECT + 두 버튼으로.
- 퍼널 집계를 새로 만들 때 `where not public.ops_test_user(<계정 id>)`.
