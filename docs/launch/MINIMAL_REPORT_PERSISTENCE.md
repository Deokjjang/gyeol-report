# 결리포트 Minimal Report Persistence Design

## 1. 목적

이 문서는 paid report retrieval을 위해 필요한 최소 저장 모델을 정의한다.

- 결제 이후 사용자가 리포트를 다시 볼 수 있는 기준을 정한다.
- 출생정보와 MBTI 입력값을 필요 이상으로 저장하지 않도록 경계를 둔다.
- report snapshot, input snapshot, payment linkage, deletion 상태를 구현 전에 분리한다.
- 법률/개인정보 문서의 최종 대체물이 아니라 구현 계획을 위한 기술/제품 설계 기준으로 사용한다.

## 2. 저장 원칙

- 저장 데이터는 서비스 제공에 필요한 최소 범위로 제한한다.
- raw payment card data는 저장하지 않는다.
- 리포트 생성과 무관한 profile data는 저장하지 않는다.
- deterministic versioning이 충분히 갖춰지기 전에는 paid access를 위해 recomputation보다 report snapshot 저장을 우선 검토한다.
- reportVersion, calculationVersion, renderVersion 같은 version fields를 저장한다.
- 사용자에게 보여줄 오류에는 raw internal error를 포함하지 않는다.

## 3. V1 저장 단위

V1의 saved report는 하나의 리포트 생성 결과를 기준으로 한다.

- `reportId`
- `createdAt`
- `status`
- input snapshot
- report snapshot
- optional payment linkage
- deletion state

이 단위는 사용자 계정 없이도 access token 기반 조회로 확장할 수 있어야 한다.

## 4. Report Record

Report record는 저장된 리포트의 최상위 메타데이터다.

제안 필드:

- `reportId`
- `createdAt`
- `updatedAt`
- `status`: `draft` | `generated` | `paid_unlocked` | `deleted`
- `reportVersion`
- `calculationVersion`
- `locale`
- `accessMode`: `preview` | `paid`

`status`는 리포트 생성, 결제 unlock, 삭제 상태를 구분하는 데 사용한다.

## 5. Input Snapshot

Input snapshot은 리포트 생성에 사용된 입력값의 최소 기록이다.

제안 필드:

- `birthDate`
- `birthTime`
- `birthTimeUnknown`
- `calendarType`
- `timezone`
- `gender`, 사용 중인 경우
- `mbti`

운영 정책에 따라 input snapshot은 encryption 또는 minimization을 적용할 수 있다. 리포트 재계산이 필요하지 않고 report snapshot만으로 재열람이 가능하다면, snapshot 생성 후 raw input 제거를 검토할 수 있다.

## 6. Report Snapshot

Report snapshot은 사용자에게 보여준 리포트 JSON을 저장하는 영역이다.

제안 저장 항목:

- report JSON snapshot
- section levels
- notices
- `createdAt`
- render version

Snapshot은 paid user에게 같은 결제 결과를 안정적으로 다시 보여주기 위해 유용하다. 계산 로직이나 profile coverage가 이후 바뀌어도 기존 구매 리포트의 표시 결과를 보존할 수 있다.

## 7. Payment Linkage

Payment linkage는 optional 영역으로 시작한다. 결제가 붙기 전에는 비워 둘 수 있다.

제안 필드:

- `orderId`
- `provider`
- `providerPaymentId`
- `paymentStatus`
- `amount`
- `currency`
- `paidAt`
- `refundedAt`

카드 번호, 인증값, 결제 비밀번호 등 provider가 처리해야 하는 민감 결제 정보는 저장하지 않는다.

## 8. Retrieval Boundary

- report retrieval은 `reportId`와 access token 또는 future account를 통해 수행한다.
- `preview` access는 `FREE_PREVIEW` 섹션만 표시한다.
- `paid_unlocked` access는 full snapshot을 표시한다.
- expired 또는 deleted report는 사용자에게 안전한 오류 문구를 반환한다.
- 조회 실패 응답에는 stack trace, 내부 경로, raw exception을 포함하지 않는다.
- public URL에 predictable ID만 노출하지 않는다.

## 9. Deletion Boundary

- V1에서는 사용자가 support를 통해 삭제를 요청할 수 있게 한다.
- 삭제 요청 시 가능한 범위에서 input snapshot과 report snapshot을 삭제한다.
- 회계 또는 provider reconciliation에 필요한 최소 payment metadata는 보관이 필요할 수 있다.
- 삭제 처리 후 `status`는 `deleted`로 표시한다.
- 삭제된 리포트 조회 시 본문을 반환하지 않는다.

## 10. Security / Access Boundary

- public predictable IDs를 사용하지 않는다.
- 로그인 없이 조회를 제공한다면 signed 또는 random access token을 사용한다.
- admin access가 이후 추가되면 권한 제한과 접근 로그를 함께 설계한다.
- 사용자 화면에는 raw internal errors를 노출하지 않는다.
- reportId와 access token은 로그와 고객지원 도구에서 과도하게 노출되지 않도록 다룬다.

## 11. Implementation Checklist

- [ ] storage provider를 선택한다.
- [ ] schema를 정의한다.
- [ ] reportId/token generation 방식을 정의한다.
- [ ] encryption/minimization policy를 정의한다.
- [ ] deletion operation을 정의한다.
- [ ] retrieval API를 정의한다.
- [ ] preview/paid access mode를 테스트한다.
- [ ] source/unit tests를 추가한다.
- [ ] `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm release:check`를 통과한다.

## 12. 다음 개발 Task 제안

1. 39B — persistence source-neutral type design
2. 39C — reportId/access token utility
3. 39D — in-memory persistence adapter for tests only
4. 40A — payment provider decision document
5. 41A — production deployment checklist
