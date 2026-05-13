# 결리포트 Concrete Payment Provider Decision Record

## 1. 목적

이 문서는 실제 payment integration 전에 1차 concrete payment provider 방향을 기록한다.

- provider 선택 기록과 실제 결제 연동 구현을 분리한다.
- provider-neutral payment adapter contract를 유지하면서 V1 결제 후보를 검토한다.
- paid public launch 전에 필요한 구현, 정책, 지원 준비 범위를 명확히 둔다.

## 2. 현재 전제

- payment types는 provider-neutral 구조다.
- payment adapter interface가 존재한다.
- in-memory payment adapter는 tests/dev only 용도다.
- real payment provider는 구현되어 있지 않다.
- paid unlock API는 구현되어 있지 않다.
- payment는 UI에서 비활성 상태다.
- production persistence는 아직 연결되어 있지 않다.

## 3. 후보 비교 요약

| 기준 | Toss Payments | KakaoPay PG | Paddle | manual/internal only |
| --- | --- | --- | --- | --- |
| Korean domestic checkout fit | 한국 V1 checkout 후보로 적합성이 높다. | 국내 사용자 선호가 강한 경우 보조 후보가 될 수 있다. | 국내 카드 결제 중심 V1에는 우선순위가 낮을 수 있다. | paid public launch 전 내부 검토에는 충분할 수 있다. |
| developer integration complexity | provider-specific adapter로 분리해 다룰 수 있다. | PG 계약과 checkout 흐름 확인이 필요하다. | 글로벌 상거래 구조 이해와 설정 범위가 커질 수 있다. | 구현 복잡도는 낮지만 자동 결제 흐름은 없다. |
| settlement/tax/admin burden | 국내 결제 정산, 세무, 관리자 확인 범위를 검토해야 한다. | 계약/정산/관리 절차 확인이 필요하다. | 해외 정산, 세금, 계정 운영을 별도로 검토해야 한다. | 정산 자동화는 제공하지 않는다. |
| refund handling | API 또는 관리자 기반 환불 경계를 설계해야 한다. | 환불 flow와 고객 안내 문구 확인이 필요하다. | 글로벌 환불 정책과 운영 절차 확인이 필요하다. | 수동 지원 절차로만 처리한다. |
| mobile UX | 국내 모바일 checkout 친숙도 측면에서 유리할 수 있다. | 카카오 생태계 선호 사용자에게 유리할 수 있다. | 글로벌 checkout UX 검토가 필요하다. | 결제 UX는 제공하지 않는다. |
| future Japan/global expansion | 국내 V1 이후 다른 provider 추가가 필요할 수 있다. | 국내 보조 수단으로 검토한다. | Japan/global phase에서 재검토할 수 있다. | 확장용 provider가 아니다. |
| policy/support readiness | 결제, 환불, 고객지원 문구 준비가 필요하다. | 동일하게 정책 및 지원 준비가 필요하다. | 글로벌 정책과 통화/세금 문구가 필요하다. | pre-launch 지원 범위로 제한한다. |
| persistence/payment linkage | orderId와 providerPaymentId를 metadata로 저장하기 좋다. | 동일한 linkage 설계가 필요하다. | provider id mapping 설계가 필요하다. | 실제 provider linkage는 없다. |

## 4. 1차 권장 선택

Toss Payments를 한국 V1 유료 결제의 1차 payment provider 후보로 둔다.

이 기록은 구현 완료 상태가 아니라, 실제 provider adapter 구현 전에 남기는 추천 및 decision record다.

- manual/internal only는 paid public launch 전 내부 검토 단계에서 허용 가능한 상태로 둔다.
- Paddle은 Japan/global phase에서 재검토할 수 있다.
- KakaoPay PG는 checkout conversion 또는 user preference 요구가 커질 때 secondary/alternative 후보로 검토할 수 있다.

## 5. 선택 이유

- KR-first launch 방향과 맞는다.
- card/mobile checkout familiarity 측면에서 국내 사용자에게 익숙할 수 있다.
- provider-neutral payment adapter를 유지하면 이후 교체 또는 추가 여지를 남길 수 있다.
- payment order ID와 provider payment ID가 기존 payment linkage 설계에 자연스럽게 mapping된다.
- Supabase/Postgres persistence linkage에 payment metadata를 저장할 수 있다.
- small-scale launch에서는 provider 수를 줄여 운영 복잡도를 낮추는 편이 현실적이다.

## 6. 선택 시 구현 범위

- create payment session
- confirm payment
- cancel/refund skeleton 또는 documented boundary
- webhook handling design
- payment order persistence linkage
- paid unlock transition
- typed error mapping
- tests

## 7. 선택하지 않는 범위

- storing raw card data
- enabling paid public launch immediately
- Japan/global payment support
- Paddle integration
- KakaoPay PG integration
- admin console automation
- accounting automation
- final legal/support policy replacement

## 8. 리스크와 보완책

- provider contract/account setup이 필요하다.
- webhook verification 설계가 필요하다.
- refund/support flow 준비가 필요하다.
- failure, retry, idempotency 기준이 필요하다.
- policy/legal copy review가 필요하다.
- persistence dependency는 먼저 해결하거나 병행 task로 진행해야 한다.
- end-to-end checks가 통과될 때까지 payment inactive 상태를 유지한다.

## 9. 결정 전 확인 사항

- Toss account/project setup
- test keys/secrets management
- webhook endpoint plan
- redirect/callback URL plan
- refund policy copy
- privacy/terms/payment copy
- persistence linkage ready
- release check pass
- manual QA pass

## 10. 다음 개발 Task 제안

1. 59B — concrete payment provider decision record source test
2. 59C — Toss payment integration task spec
3. 59D — paid unlock API implementation plan
4. 59E — payment webhook design draft
5. 60A — production persistence adapter implementation plan
