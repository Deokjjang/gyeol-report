# 결리포트 Final Policy Copy Preparation

## 1. 목적

이 문서는 placeholder policy pages를 public final copy로 교체하기 전에 준비해야 할 정책 문구 범위를 정리한다.

- 내부 draft와 public final copy를 구분한다.
- 결제, 개인정보, 환불, 고객지원 문구가 paid launch 범위와 맞는지 확인한다.
- 정책 페이지 교체 전에 검토해야 할 blocker를 명확히 한다.

## 2. 현재 상태

- `/terms`, `/privacy`, `/refund` pages는 placeholder 상태다.
- payment는 비활성 상태다.
- production persistence는 구현되어 있지 않다.
- support email은 `official@dvem.ai`이다.
- final legal, payment, refund review는 완료 상태가 아니다.

## 3. 이용약관 준비 항목

- service description
- user input responsibility
- digital content nature
- account 또는 payment access가 나중에 추가될 경우의 이용 조건
- service limitation
- support/contact path

## 4. 개인정보 처리방침 준비 항목

- 수집 입력값: birth date, birth time, calendar type, optional gender, optional MBTI
- 이용 목적: report generation, provision, support
- payment 활성화 이후 payment provider가 payment details를 처리한다는 설명
- 앱은 raw card data를 저장하지 않는다는 설명
- retention/deletion period 정의
- third-party/provider list 추후 확정

## 5. 환불 안내 준비 항목

- payment failure는 paid report unlock으로 이어지지 않는다는 설명
- paid 이후 report generation failure가 발생했을 때 support/refund path
- duplicate payment handling
- refund request channel
- refund processing window 정의
- digital content access와 refund boundary 정의

## 6. 결제/영수증 문구 준비 항목

- provider name placeholder
- `orderId`
- `reportId`
- amount/currency
- `paidAt`/`refundedAt`
- receipt/support instructions
- 앱이 card details를 노출하지 않는다는 설명

## 7. 고객지원 문구 준비 항목

- `official@dvem.ai`
- required support info: `reportId`, paid 상태라면 `orderId`, issue description
- response time policy 정의
- full automation 전에는 manual support가 허용될 수 있다는 안내

## 8. 리포트 해석 고지 문구 준비 항목

- report는 reference와 self-understanding을 돕기 위한 콘텐츠라는 안내
- medical, legal, financial advice가 아니라는 안내
- Saju/MBTI interpretation은 신중한 참고로 다루어야 한다는 안내
- 사용자가 report를 major decisions의 단일 근거로 삼지 않도록 하는 안내

## 9. 출시 전 검토 체크리스트

- [ ] policy placeholders를 public copy로 교체한다.
- [ ] payment inactive copy는 provider 활성화 이후 상태와 맞게 갱신한다.
- [ ] privacy retention/deletion을 정의한다.
- [ ] refund process를 정의한다.
- [ ] support process를 정의한다.
- [ ] mobile readability를 확인한다.
- [ ] release check가 통과한다.

## 10. 페이지 반영 전 차단 조건

- payment provider가 결정되지 않았다.
- production persistence가 준비되지 않았다.
- retention/deletion policy가 없다.
- refund process가 없다.
- support process가 없다.
- release check가 실패한다.
- manual QA가 실행되지 않았다.

## 11. 다음 개발 Task 제안

1. 51B — final policy copy preparation source test
2. 52A — production persistence adapter task spec
3. 53A — payment provider implementation task spec
4. 54A — paid unlock API task spec
5. 55A — final public policy page replacement
