# 결리포트 Payment Provider Decision

## 1. 목적

이 문서는 실제 결제 구현 전에 결제 provider 방향을 정하기 위한 기준이다.

- 결제 구현 전에 환불, 영수증, 저장 데이터, 고객지원 경계를 맞춘다.
- 국내 우선 출시와 이후 일본/글로벌 확장 가능성을 분리해서 본다.
- provider 선택이 report generation, paid/free gating, persistence boundary와 충돌하지 않게 한다.
- 세무, 법무, 결제 규정에 대한 최종 자문이 아니라 구현 전 제품/기술 의사결정 자료로 사용한다.

## 2. 현재 제품 전제

- V1 상품은 one-time report purchase에 가깝다.
- 저가 digital content로 시작하는 흐름이 적합하다.
- 초기 시장은 KR-first 가능성이 높다.
- 이후 Japan/global expansion 가능성은 열어 둔다.
- 현재 app에는 real payment가 구현되어 있지 않다.
- report generation은 dev preview에서 동작한다.
- paid/free section level과 UI-only gating skeleton은 준비되어 있다.
- persistence boundary와 최소 persistence type/interface는 준비되어 있다.

## 3. 결제 후보

### Toss Payments

- 국내 사용자에게 익숙한 결제 경험을 제공하기 쉽다.
- one-time payment 중심 V1에 맞추기 좋다.
- 국내 PG 연동, 정산, 환불 운영 흐름을 별도로 이해해야 한다.
- 글로벌 확장에서는 별도 provider 또는 추가 설계가 필요할 수 있다.

### KakaoPay via PG/provider

- 국내 사용자 친숙도가 높다.
- 단독 연동보다 PG를 통한 제공 방식이 현실적일 수 있다.
- 결제 수단 선택 폭, 정산, 환불 운영은 선택한 PG 조건에 따라 달라진다.
- 구현 전에 provider별 지원 범위를 확인해야 한다.

### Paddle

- merchant-of-record 성격의 글로벌 결제 운영을 고려할 때 후보가 될 수 있다.
- 국제 결제, 세금/정산 운영 부담을 줄이는 방향으로 검토할 수 있다.
- 제품 승인, 설정, 수수료, 국내 사용자 결제 경험은 별도 확인이 필요하다.
- 국내 검증이 우선이면 초기 선택으로는 부담이 커질 수 있다.

### Manual/no-payment launch preview

- real payment 없이 홈, report creation, gated preview, support flow를 먼저 검증한다.
- 약관, 개인정보, 환불 copy와 저장 경계가 준비되기 전까지 안전한 선택이다.
- 매출 검증은 늦어지지만 제품 품질과 전환 흐름을 먼저 확인할 수 있다.

## 4. 평가 기준

- Korean user familiarity
- setup complexity
- one-time payment support
- receipt/refund handling
- settlement/tax/accounting burden
- global expansion
- developer implementation complexity
- support burden
- sandbox와 production 분리 난이도
- paid unlock, persistence, retrieval 흐름과의 결합도

## 5. 한국 V1 권장 방향

권장 staged direction은 다음과 같다.

1. policy pages, storage boundary, paid/free gating이 준비되기 전에는 launch preview without real payment로 유지한다.
2. KR-first paid V1에서는 국내 사용자 경험과 one-time purchase를 우선해 Korean PG 또는 Toss-style integration을 우선 검토한다.
3. provider abstraction을 유지해 Paddle 또는 global provider를 이후 검토할 수 있게 한다.

이 방향은 국내 검증을 먼저 하려는 경우에 적합하다. 일본/글로벌 출시가 바로 필요한 상황이면 provider 평가를 다시 열어야 한다.

## 6. 일본/글로벌 확장 고려

- Paddle 또는 유사 merchant-of-record provider는 international tax/payment operations 부담을 줄이는 후보가 될 수 있다.
- 다만 product approval, setup, payout, support, refund 조건이 제품 운영 방식과 맞는지 확인해야 한다.
- 국내 검증이 우선이면 global provider를 먼저 고정하지 않는다.
- 일본/글로벌 확장이 즉시 목표라면 pricing, language, support, refund policy, data storage policy를 함께 재검토한다.
- provider를 바꿀 수 있도록 payment linkage type과 adapter boundary를 provider-neutral하게 유지한다.

## 7. 결제 구현 전 차단 조건

- terms/privacy/refund copy가 없다.
- paid/free gating implementation이 없다.
- report persistence/retrieval plan이 없다.
- support/refund process가 없다.
- production env separation이 없다.
- `pnpm release:check`가 실패한다.
- 결제 성공 후 report generation failure 대응 경로가 없다.
- sandbox와 production 결제 표시가 구분되지 않는다.

## 8. 결제 연동 최소 데이터

Persistence design과 맞춰 다음 최소 필드를 사용한다.

- `orderId`
- `reportId`
- `provider`
- `providerPaymentId`
- `paymentStatus`
- `amount`
- `currency`
- `paidAt`
- `refundedAt`

앱은 card details를 저장하지 않는다. 결제 인증값과 민감 결제 정보는 provider boundary 안에서 처리한다.

## 9. 환불/실패/고객지원 경계

- payment failure는 paid report unlock을 발생시키지 않는다.
- 결제는 성공했지만 report generation이 실패한 경우 support 또는 refund path를 제공한다.
- V1에서는 manual refund process로 시작할 수 있다.
- 고객지원 contact는 `official@dvem.ai`로 둔다.
- 사용자 화면에는 처리 가능한 안내 문구를 보여주고, 내부 오류 세부 정보는 노출하지 않는다.
- 환불 처리 결과와 report access 상태가 서로 어긋나지 않게 payment status를 기록한다.

## 10. 보류 사항

- final provider
- pricing finalization
- tax/accounting review
- terms/privacy/refund final copy
- business registration/통신판매업 practical checks if needed
- 국내 결제와 글로벌 결제를 한 provider로 처리할지 여부
- 무료 미리보기에서 유료 전환 CTA의 최종 문구와 위치

## 11. 다음 개발 Task 제안

1. 40B — payment provider source-neutral types
2. 40C — payment status UI copy skeleton
3. 41A — policy page placeholders
4. 42A — production deployment checklist
5. 43A — manual QA checklist
