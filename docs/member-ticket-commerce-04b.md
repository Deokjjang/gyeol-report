# COMMERCE-04B — 유료 이용권 비례 환불

## 범위와 활성화 상태

- Base: `v4/launch-event-schedule-fix` / `5a820cf69ac772f622206a980eb92b4ea83bf37a`.
- Branch: `v4/ticket-commerce-04b`.
- 신규 SQL은 **로컬 검증 완료 후 적용 대기**. Production 적용·실제 Toss 승인/취소·배포 없음.
- `BUNDLE_PURCHASE_POLICY_VERSION = null`, `AUTOMATIC_BUNDLE_REFUND_ENABLED = false`, 기존 공개 gate 그대로.
- 고객은 견적/접수/철회만 가능. 승인/PG 호출/원장 정산은 service-only. 실제 금융 실행을 연결한 HTTP/cron/운영 화면 없음.
- 본 문서는 구현 계약과 법률 검토용 고객 문안이다. 법률 전문가 또는 PG의 최종 승인을 대신하지 않는다.

## 1. 확정 사업정책과 금액

`원래 주문의 실제 결제금액 ÷ 지급수량 × 해당 구매 lot의 미사용 수량`.

정상가 1,490원을 사용분에 소급하지 않으며 할인 회수도 없다. 현재 catalog가 아니라 저장된 승인금액/수량을 사용한다. TypeScript는 safe-integer 검증과 BigInt, SQL은 정수 나눗셈을 사용한다. 나누어떨어지지 않는 과거 가격은 임의 반올림하지 않고 개별 검토한다.

| 구매 | 실제 결제 | 권당 단가 | 사용 완료 | 잔여 환불 |
|---|---:|---:|---:|---:|
| 1장 | 1,490 | 1,490 | 0 / 1 | 1,490 / 0 |
| 3장 | 4,290 | 1,430 | 1 / 2 | 2,860 / 1,430 |
| 5장 | 6,890 | 1,378 | 1 / 2 / 4 | 5,512 / 4,134 / 1,378 |
| 10장 | 13,400 | 1,340 | 1 / 2 / 5 / 9 | 12,060 / 10,720 / 6,700 / 1,340 |

예전 5장 6,500원 주문에서 1장 사용했다면 5,200원이다. 현재 6,890원으로 재계산하지 않는다. 과거 1,290원 단품 주문/기존 1,490원 리포트 직접 구매는 이번 이용권 환불과 별도이며 변경하지 않았다.

## 2. 원래 구매 lot과 불변 원장

기존 `report_ticket_grants`, `report_ticket_ledger`, redemption, bundle order를 재사용한다. 환불 기록은 금융 처리 상태이지 두 번째 이용권 원장이 아니다.

| 사실 | 판정 |
|---|---|
| 지급 원천 | 소유자 일치 + `source_type=purchase` + 원래 주문/grant 일치 + 기존 승인 증거 필수 |
| 사용량 | `COMPLETED` redemption만 확정 사용 |
| 생성 중 | `QUEUED/RUNNING`은 승인 차단. 완료/REVERSAL 이후 재견적 |
| 생성 실패 | 기존 정상 REVERSAL을 원래 lot에 복구 |
| 무료/다른 구매 | 견적/회수 대상에서 제외. FEFO 소비 사실 그대로 |
| 유료 만료 | `expires_at=NULL` 유지. 영구 보장 또는 무기한 환불 의미 아님 |
| 정상 발행 Book | 삭제하지 않음. 기존 생성 후 90일 열람 유지 |

10장 중 2장 완료: `GRANT +10`, `REDEEM -1` 두 건, PG 10,720원 부분 취소 확인, `REFUND -8`. lot 잔액 0, Book 2권과 다른 무료/유료 lot 보존. 원래 GRANT/REDEEM/REVERSAL을 수정하지 않는다.

`REFUND`는 승인 수량과 같은 음수, 연결 refund ID, 고유 멱등키를 요구한다. PG 확인 전 삽입 불가. 기존 잔액 검증/원장 불변성 유지. 환불별 REFUND unique, 금융 transactionKey unique, 주문별 active refund unique.

## 3. 요청·보류·철회

고객 endpoint는 기존 `/api/ticket-bundles/[action]`에 다음 POST만 추가했다.

| action | 고객 입력 |
|---|---|
| `refund-quote` | `bundleOrderId` |
| `refund-request` | `bundleOrderId`, `requestId`, `reasonCode` |
| `refund-withdraw` | `bundleOrderId`, `requestId` |

검증된 회원/현행 필수 동의/소유권/strict Origin/계정 scope/4KB body 제한을 그대로 적용한다. 금액·수량·grant·paymentKey·operatorRef 등 추가 필드 거절. 서비스 역할 RPC 권한과 RLS로 일반 DB 접근 차단. 이메일만 같다고 소유자로 인정하지 않는다.

계정 advisory lock(seed 10) → 주문 → 환불 → 원장 순서. 접수와 `REFUND_PENDING` 보류는 한 transaction이다. REQUESTED→HELD→REVIEW_REQUIRED 각 단계 감사 기록을 남긴다. 같은 요청 재전송은 기존 결과, 별도 요청으로 같은 주문 이중 접수는 거절한다.

보류분은 사용 가능 잔액에서 제외한다. FEFO의 앞 lot이 보류 중이면 **다른 lot을 몰래 대신 쓰지 않는다**. 기존 REFUND_HOLD를 유지하고 고객에게 이유를 표시한다. 원천 선택 UI/새 소비 알고리즘은 만들지 않았다.

PG 첫 처리 시각이 기록되기 전만 철회 가능하다. 승인만 된 상태는 철회 가능하지만 PG 조회/취소가 시작된 상태는 불확실 결과가 있어 해제하지 않는다. 철회 감사 기록을 남기고 기존 주문 guard가 검증된 철회에만 GRANTED 복귀를 허용한다.

## 4. 금융 상태와 복구

`REVIEW_REQUIRED → APPROVED → PG_CANCEL_PENDING → PG_CANCEL_CONFIRMED → LEDGER_SETTLED → COMPLETED`.

금액/결제수단 불일치는 `MANUAL_SETTLEMENT_REQUIRED`. 불확실한 네트워크 결과를 완료/실패로 확정하지 않는다. `FAILED_REQUIRES_ATTENTION`도 금융 미확정 상태로 지원한다. 전체 취소/부분 취소는 별도 환불 record의 원금/승인금액/수량으로 구분한다. 주문 REFUNDED만으로 원금 전액 취소라고 해석하지 않는다.

| 장애/경합 | 처리 |
|---|---|
| DB claim 전 실패 | PG 호출 0 |
| 최초/재시작/재시도 | 매번 GET으로 기존 취소 먼저 대조 |
| POST 성공 후 응답 유실 | 같은 취소 이력 확인 후 정산. 새 키 생성 안 함 |
| POST와 뒤따른 GET 모두 불명확 | PG_CANCEL_PENDING/보류 유지. lease 후 재조회 |
| PG 성공, DB confirm 실패 | 취소 사실 재조회 후 동일 record confirm |
| PG 확인 저장, 정산 실패 | PG 재취소 없이 settle 재시도 |
| 정산 성공, 응답 유실 | unique REFUND/상태 재확인으로 추가 차감 0 |
| 100회 접수/10개 동시 worker | 계정 lock·2분 claim lease·stable PG key·unique ledger로 중복 방지 |
| 취소 금액/이유/이력 불일치 | 자동 정산하지 않고 수동 대조 |
| 첫 시도 후 15일 이상 | GET만 허용. 불명확하면 수동 확인, 새 멱등키로 취소 금지 |

claim은 네트워크 전에 commit한다. 실제 취소 호출의 15초 timeout보다 2분 lease가 길다. lease token이 바뀌거나 만료되면 오래된 worker의 확인 기록은 거절한다. 늦게 성공한 금융 결과는 다음 GET으로 복구한다.

## 5. Toss 공식 계약과 구현 한계

`tossRefundClient.ts`는 기존 서버 client 패턴을 따르며 **명시적으로 주입한 transport/secret만** 사용한다. global fetch 기본값, env 읽기, public route 연결 없음. 이번 모든 호출은 격리된 mock transport다.

POST `/v1/payments/{paymentKey}/cancel`에 고정 cancelReason과 승인된 정수 cancelAmount를 전달한다. 전액도 금액을 명시한다. paymentKey/orderId/KRW/original totalAmount/balanceAmount/cancels/transactionKey/cancelAmount/cancelStatus/canceledAt 및 고유 사유를 대조한다. 다른 외부 취소와 합쳐 금액만 맞춘 결과는 인정하지 않는다. deprecated `refundableAmount`는 사용하지 않는다. [Toss API reference](https://docs.tosspayments.com/reference)

DB의 `ticket-refund-{UUID}`를 Idempotency-Key로 고정한다. 공식 유효기간은 첫 요청 후 15일이다. 에러 응답을 받았다고 키를 바꾸지 않는다. 15일이 지나거나 상태가 불명확하면 자동 POST를 중단하는 것은 이 제품의 더 보수적인 복구 정책이다. [Toss 인증·멱등키](https://docs.tosspayments.com/reference/using-api/authorization)

| 수단 | 공식 제약 확인 / 이번 처리 |
|---|---|
| 카드 | 일괄 기한은 없지만 1년 초과 시 카드사 기록에 따라 제한 가능. 부분 취소는 `isPartialCancelable` 확인 |
| 국내 간편결제 | 실제 method/부분 취소 가능 여부 확인. 세부 수단·가맹점 계약 추가 검토 |
| 계좌이체 | 통상 180일 내 취소. 이번 자동 POST 제외, 운영 검토 |
| 가상계좌 | 상점별 조건, 보통 365일. 입금 후 환불계좌 필요. 이번 계좌 수집/자동 POST 없음 |
| 휴대폰/해외 간편결제 등 | 휴대폰 당월, PayPal 180일 등 별도 제약. 이번 자동 POST 제외 |

PG API 미지원은 소비자 권리 거절 사유가 아니다. 수동 지급 수단/증빙/재대조 절차를 운영자가 승인해야 하며, 현재 코드로 계좌환불 성공을 가정해 원장을 정산하지 않는다. [Toss 결제 취소 안내](https://docs.tosspayments.com/guides/v2/cancel-payment)

`PROVIDER_LIVE_VERIFIED=NO`. Toss 테스트 환경 인증·실제 merchant 계약 확인은 후속 별도 승인 작업이다.

## 6. 운영자 절차 — service-only, 현재 mock 전용

1. verified account ID와 원래 bundle order, reason을 확인한다. quote의 지급/사용/진행/잔여/원금/단가를 읽는다.
2. 법정 청약철회/서비스 하자/중복 결제는 일반 미사용 환불과 분리 심사한다. 현재 approve는 UNUSED만 허용하며 나머지는 접수 상태를 유지한다.
3. 법적 권리·기간·수단을 검토한 기록의 불투명 ID를 `operatorRef`로 전달한다. 개인정보/상담 원문/secret을 넣지 않는다. 이 값 자체는 권한 토큰이 아니며 service-role 실행 주체를 별도 통제해야 한다.
4. `approve`에 현재 견적의 `approvedAmount/approvedQuantity`를 전달한다. 변경된 견적/진행 중 발행/0원은 재확인한다.
5. `processApprovedRefund(store, provider, userId, orderId, requestId, operatorRef)`를 실행한다. 이번에는 mock provider만 주입한다. public admin route/자동 batch를 만들지 않았다.
6. PG_CANCEL_PENDING은 기존 request로 재실행한다. lease가 살아 있으면 기다린다. PG_CANCEL_CONFIRMED/LEDGER_SETTLED는 금융 호출 없이 정산/완료를 재개한다.
7. MANUAL_SETTLEMENT_REQUIRED는 GET 확인만 가능. 사업자가 검증한 별도 환불이 필요하면 증빙/권한/정산 contract를 승인한 뒤 처리하며 DB 상태 강제 UPDATE로 완료 표시하지 않는다.

환불 record와 append-only audit에 단계/시각/operator review ref/actor ref/오류 분류를 보존한다. 고객에게는 상태·견적·수량·날짜만 반환한다. 금융 식별자/상담 내용/리포트 원문은 UI·분석 로그에 노출하지 않는다.

**운영 SLA도 활성화 blocker**: 수동 검토를 이유로 법정 반환 기한을 무기한 미루지 않는다. 기한/담당자/미처리 알림/휴일 업무 경로를 확정해야 한다. 기술적으로 보류를 유지하는 것과 법적으로 처리를 지연해도 되는 것은 다르다.

## 7. 고객 UI와 구매 고지 초안

위치: 내 계정 → 내 이용권 → 구매·사용 내역 → 환불·미사용 내역. White/Black 기존 stylesheet 사용. 원래 구매/사용 완료/진행 중/잔여/이미 환불/견적, 사유 선택, 명시적 확인 후 요청, 상태 새로고침/철회 제공. 견적과 확정 금액을 구분하며 PG/원장 최종 대조 전 완료 표시하지 않는다.

아래는 **법률 검토용 초안, 활성 판매 고지 아님**:

> 결리포트 유료 이용권은 종합, 직업·커리어·돈·학업, 연애·결혼·자녀, 궁합, 대운, 세운 6상품에 사용할 수 있습니다. 이용권 1장으로 리포트 1권을 발행합니다.
>
> 구매 전에 선택한 수량과 최종 결제금액을 확인해 주세요. 1장은 1,490원, 3장은 4,290원, 5장은 6,890원, 10장은 13,400원입니다. 결제 승인과 지급 확인 후 회원 계정에 제공됩니다.
>
> 유료 이용권은 현재 별도 만료일을 기록하지 않습니다. 영구 사용·영구 환불을 보장하는 문구는 아닙니다. 최종 사용기한 고지 및 서비스 종료·탈퇴 시 처리 기준은 법률 검토 후 확정합니다. 발행한 리포트는 생성일부터 90일 열람하며 이용권의 사용기한과 다릅니다.
>
> 구매 내역에서 환불 검토를 요청할 수 있습니다. 원래 구매금액을 지급수량으로 나눈 단가에 해당 구매의 미사용 수량을 곱합니다. 10장 13,400원 중 2장을 사용했다면 남은 8장 견적은 10,720원입니다. 정상가 소급 공제나 할인 회수는 없으며 무료 이용권은 금전 환불에 포함하지 않습니다.
>
> 요청 후 해당 구매의 이용권은 사용 보류됩니다. 발행 진행 중이면 결과를 확인한 뒤 다시 계산합니다. 정상 생성 실패는 기존 복구 절차에 따라 원래 이용권으로 돌아옵니다. 환불 완료 후 회수된 이용권은 사용할 수 없지만 이미 정상 발행된 책의 기존 열람 기간은 유지됩니다.
>
> 법정 청약철회, 서비스 미제공·하자, 중복 결제 등의 권리는 이 비례 계산으로 제한하지 않습니다. 개별 사유와 결제수단을 확인합니다. PG 처리가 시작되기 전에는 환불 요청을 철회할 수 있으며 처리 중이면 금융 결과 확인이 먼저 필요합니다. 고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.

법정 기간 이후 추가 환불 가능 기간은 미확정이다. 미확정 기간을 근거로 자동 거절하지 않는다. `BUNDLE_PURCHASE_POLICY_VERSION=null` 유지. 최종 전문·UI·서버 consent version·저장 evidence가 일치하도록 별도 승인 후 반영해야 한다. 기존 `/refund`, `/terms` 문서나 기존 checkout 법적 계약을 이번에 일방 변경하지 않았다.

## 8. 법률 검토 — 2026년 공식 자료

| 근거 | 이번 판단/보호 |
|---|---|
| 전자상거래법 17조 | 통상 7일 철회, 공급 개시된 디지털콘텐츠 예외와 분할 가능한 미제공 부분, 계약 불일치의 3개월/인지 후 30일, 예외 고지·시험사용 조건을 함께 검토해야 함. 이용권 지급만으로 모든 콘텐츠 제공 완료라고 단정하지 않음 |
| 같은 법 18조 | 디지털콘텐츠 철회 시 대금 반환 3영업일, PG 취소 요청 등 의무 확인. PG 입금 소요일과 사업자의 법정 조치 기한을 혼동하지 않음 |
| 시행령 21조·21조의2 | 개인화 리포트라고 무조건 철회 불가 아님. 주문제작 예외의 손해·별도 고지·동의 요건과 디지털콘텐츠 시험사용 방법 검토 필요 |
| 약관규제법 6조·9조 | 부당한 권리 제한/과도한 해지·반환 제한을 피해야 함. 기간·정상가 소급공제 같은 불리한 규칙을 임의 추가하지 않음 |
| 신유형 상품권 표준약관 | 2025년 개정 자료 확인. 이 서비스의 자사 디지털콘텐츠 이용권에 바로 적용된다고 확정하지 않음. 양도·환금·거래 구조를 포함한 분류 검토 필요 |

공식 근거: [전자상거래법 17조](https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=282793&joNo=0017&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR), [18조](https://www.law.go.kr/LSW/lsSideInfoP.do?lsiSeq=282793&joNo=0018&joBrNo=00&docCls=jo&urlMode=lsScJoRltInfoR) (2026.7.21 시행), [시행령 21조](https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=63483), [21조의2](https://law.go.kr/LSW/lsLinkCommonInfo.do?lspttninfSeq=63484), [약관규제법](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1025032407), [서울시가 게재한 공정위 2025.9.16 개정 자료](https://news.seoul.go.kr/economy/archives/568634).

법률 적용의 확정 판정은 하지 않았다. `LEGAL_CLASSIFICATION_REVIEW_REQUIRED`.

### Production 판매/환불 활성화 blocker

- 법적 분류(자체 선불 디지털콘텐츠 / 신유형 상품권 / 기타).
- 사용기한 NULL의 고지 적정성, 서비스 종료·탈퇴 처리.
- 법정 기간 이후 자발적 환불 기간.
- merchant/결제수단별 취소 기한·부분 취소·정산금·대체환불 계약.
- 최종 고객 전문/구매 동의 version/운영 SLA 승인.
- 별도 권한 통제된 운영 실행 경로와 Toss 실제 테스트 환경 검증.

## 9. 검증 결과

실제 외부 호출 없이 로컬 PostgreSQL/PGlite/주입 mock/Chrome을 사용했다. 검증 결과는 아래에 최종 기록한다.

- PostgreSQL 16.15: 11개 시나리오 그룹, 독립 backend 290개, 최대 10개 동시 연결, deadlock 0. 실제 coordinator + Toss adapter의 mock 응답 유실 및 DB 장애 복구 포함.
- 실제 Chrome: 390/430/768/1440 견적 화면, 접수/보류/철회/reload/다른 계정 조회. 100회 클릭→POST 1건, 타 계정 주문 404, runtime exception/외부 요청/수평 overflow 0.
- 결제/회원/이용권/무료 이벤트/쿠폰/추천/캠페인/측정/checkout 관련 회귀: **800 PASS / 0 FAIL / 2 SKIP**, 60개 파일 통과. 미실행 2개는 opt-in 용량 시뮬레이션/생성 성능 측정이며 PASS로 세지 않았다. 신규 환불 테스트 32개 포함.
- V3 paid completeness + V4 shadow generation/share + Book projection + 환불: **138 PASS / 0 FAIL**. Major 14/14·미래10·나이·전환, Annual 12/12, 실제 6상품 저장/읽기/공유 완전성 포함. 환불 테스트 32개는 위 실행과 중복이므로 고유 테스트 수를 합산하지 않는다.
- 최초 병렬 회귀는 기본 5초/일부 hook 제한 초과 및 잔액 응답에 불필요한 0 필드를 추가한 호환성 문제로 실패했다. 기존 응답은 보류 0일 때 그대로 유지하도록 수정했다. 최종 실행은 worker 2개, test timeout 30초/hook 60초로 **실제로 재실행**한 결과다. 테스트 내용을 삭제/완화해서 통과시키지 않았다.
- `pnpm lint` PASS. `pnpm build` PASS(Next의 dev 파일 추적 warning 8건은 남음). `git diff --check` PASS.
- TypeScript baseline **390 / 현재 390 / 신규 0**. 진단 위치를 정규화해 기존 목록과 대조했다. `tsc` 자체는 기존 오류로 exit 2이며 clean이라고 표시하지 않는다.
- 보호 파일 `.gitignore`, `AGENTS.md`, `supabase/.temp/`는 변경/스테이징 제외.

로컬 검증 산출물:

- `/private/tmp/gyeol-v4-commerce-04b/postgres-concurrency.json`
- `/private/tmp/gyeol-v4-commerce-04b/browser-qa.json`
- `/private/tmp/gyeol-v4-commerce-04b/screenshots/{390,430,768,1440}-refund-quote.png`
- `/private/tmp/gyeol-v4-commerce-04b/screenshots/390-refund-held.png`
- `/private/tmp/gyeol-v4-commerce-04b/screenshots/390-refund-withdrawn.png`
- `/private/tmp/gyeol-refund-04b-regression-final.log`, `gyeol-refund-04b-delivery.log` (같은 `/private/tmp`)
- `/private/tmp/gyeol-refund-04b-{lint,build}-final.log`, `/private/tmp/gyeol-refund-04b-tsc-final.log`

재현 명령:

```sh
pnpm exec vitest run tests/unit/payment tests/unit/account tests/unit/app/ticketCheckout.test.tsx tests/unit/app/ticketOwnerRoute.test.tsx --maxWorkers=2 --testTimeout=30000 --hookTimeout=60000
pnpm exec vitest run tests/unit/payment/ticketRefund.test.ts tests/unit/interpretation-v4/runtimeShadow.test.tsx tests/unit/app/dev/bookRuntime.test.tsx tests/unit/sharing/paidDeliveryCompleteness.test.tsx --maxWorkers=2 --testTimeout=30000 --hookTimeout=90000
```

실제 PostgreSQL 검증: `scripts/verify-ticket-refunds-postgres.mjs --isolated-local`. 정확히 `gyeol-refund-04b-pg`/`postgres:16-alpine`/`--network none`/`/var/lib/postgresql/data` tmpfs/host bind 없음을 검사한다. 새 `refund04b` 테스트 DB가 필요하며 기존 DB를 자동 삭제하지 않는다. 독립 docker exec/psql 연결과 실제 TypeScript refund coordinator를 사용한다. 외부 PG는 주입 mock이다. 이번 검증용 컨테이너는 결과 파일 보존 후 제거하며 다른 컨테이너는 건드리지 않는다.

## 10. 후속 Production 적용 순서 — 이번에는 실행하지 않음

1. 법률/사업/PG blocker 해결, 승인 기록과 최종 구매 전문·version 확정.
2. 기존 bundle commerce, publication queue, launch event, schedule fix 적용 상태를 별도 승인된 절차로 확인. migration `20261010143147_v4_ticket_refunds.sql`는 그 위에 한 번 적용하도록 guarded.
3. 백업/ACL/RLS/함수 서명/기존 계정 lock을 확인하고 별도 승인 환경에서 migration 검증. Production 적용은 별도 승인.
4. Toss 실제 테스트 인증·전액/부분 취소·응답 유실과 merchant 계약 검증. operator 실행 권한·회복·기한 알림 확정.
5. 승인된 customer policy version과 서버 consent evidence를 일치시킨 후에만 별도 activation 판단. 이 브랜치 push는 판매/환불 활성화가 아님.
6. 문제 발생 시 신규 접수/실행 gate를 닫고 금융 미확정 건을 GET 대조한다. 이미 실행된 금융 취소/REFUND/audit를 지우거나 과거 GRANT를 복구하는 파괴적 down migration 금지. DB 변경 전 오류는 transaction rollback, 적용 후는 보존형 forward fix.

## Backlog — FUTURE_POLICY_CANDIDATE

일부 사용분을 5/3/1장 묶음으로 재구성해 공제하는 대체 정책은 **미구현**. 숨은 옵션·토글 없음. 악용 비율·법률 검토·별도 사업 결정 후 검토하며 기존 구매자 소급 적용 금지.

`LEGAL_POLICY_FINAL_APPROVED=NO` · `PRODUCTION_REFUND_ACTIVE=NO` · `PUBLIC_SALES_READY=NO`.
