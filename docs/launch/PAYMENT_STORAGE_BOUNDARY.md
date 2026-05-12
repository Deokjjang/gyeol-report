# 결리포트 Payment / Storage Boundary

## 1. 목적

이 문서는 결제와 저장 기능을 구현하기 전에 상품, 결제, 데이터 저장의 경계를 고정하기 위한 기준이다.

- paid unlock 범위를 흐리지 않는다.
- 필요한 데이터만 저장하도록 기준을 정한다.
- 결제 이후 리포트 접근, 환불, 삭제 요청 흐름을 구현 전에 분리한다.
- 법률 문서의 최종 대체물이 아니라, 구현과 검토를 위한 제품/기술 경계 문서로 사용한다.

## 2. V1 상품 경계

- V1은 one-time report generation 상품으로 설계한다.
- 현재는 sample/free preview flow가 존재하며, 홈에서 `/report/new`로 진입해 샘플 리포트를 생성한다.
- paid unlock은 이후 추가할 수 있지만, 리포트 계산 결과 자체를 바꾸는 기능으로 다루지 않는다.
- subscription은 V1에 포함하지 않는다. 이후 별도 의사결정이 있을 때만 검토한다.
- V1 리포트는 자기이해를 돕는 참고 콘텐츠이며, 전문 상담이나 개별 자문 상품으로 표현하지 않는다.

## 3. 무료/유료 경계

- `FREE_PREVIEW` 섹션은 결제 전에도 볼 수 있는 영역으로 둔다.
- `PAID_FULL` 섹션은 production에서는 결제 이후 unlock되는 영역으로 둔다.
- 현재 dev preview는 전체 섹션을 보여주며, production gating과 구분해서 관리한다.
- paid unlock은 deterministic report logic을 변경하지 않는다.
- 결제 전/후 차이는 계산 결과의 품질 차이가 아니라 접근 가능한 섹션 범위로 정의한다.
- 유료 잠금 해제 UI는 section level label과 실제 접근 제어가 서로 맞아야 한다.

## 4. 결제 경계

- payment provider는 TBD 상태로 둔다.
- terms/privacy/refund copy가 준비되기 전에는 real payment를 받지 않는다.
- payment success는 report access 또는 paid section unlock만 수행한다.
- 카드 번호, 결제 인증값 등 민감 결제 정보는 payment provider가 처리한다.
- 앱은 payment reference와 receipt metadata만 저장한다.
- 결제 실패, 취소, 중복 요청은 사용자에게 차분한 오류 상태로 안내한다.
- dev/sandbox 결제와 production 결제는 환경 변수와 화면 표시로 구분한다.

## 5. 저장 데이터 경계

저장은 최소화한다. V1에서 검토 가능한 필드는 다음 범위로 제한한다.

- `reportId`
- `createdAt`
- input summary 또는 가능한 경우 hashed input
- 조회 기능이 필요한 경우에만 `birthDate`, `birthTime`, `calendarType`, `mbtiType`
- paid access가 재계산 없이 표시되어야 한다면 report snapshot
- 결제된 리포트라면 payment status/reference
- 사용자가 명시적으로 제공한 경우에만 email

저장 목적은 리포트 재열람, 결제 상태 확인, 고객지원 처리로 제한한다.

## 6. 저장하지 않는 데이터

- raw payment card data
- 필요하지 않은 raw request/response logs
- secret keys
- user-visible record 안의 stack traces
- 리포트 생성과 무관한 personal profile data
- 고객지원에 필요하지 않은 장기 디버그 로그
- 운영자가 직접 볼 필요가 없는 내부 오류 세부 정보

## 7. 개인정보/삭제 요청 경계

- deletion request path를 운영 전에 정한다.
- 기본 support email은 `official@dvem.ai`로 둔다.
- 삭제 요청 시 report, input, app-side payment metadata를 가능한 범위에서 삭제한다.
- payment provider records는 provider 또는 관련 규정상 남을 수 있음을 안내한다.
- 이후 admin pages가 생기면 접근 권한을 제한하고 접근 로그를 남긴다.
- 삭제 처리 결과를 사용자에게 확인 가능한 문구로 회신한다.

## 8. 영수증/구매 기록 경계

구매 기록은 결제 확인과 고객지원에 필요한 최소 정보만 가진다.

- `orderId`
- `providerPaymentId`
- `reportId`
- `amount`
- `currency`
- `status`
- `createdAt`
- `refundStatus`

구매 기록에는 card details를 저장하지 않는다.

## 9. 실패/환불/고객지원 경계

- payment failure UX는 결제 실패와 리포트 생성 실패를 구분한다.
- 결제 성공 후 report generation failure가 발생하면 고객지원 또는 환불 경로를 제공한다.
- V1은 manual refund process로 시작할 수 있으며, 처리 단계와 담당자를 문서화한다.
- 고객지원 contact는 `official@dvem.ai`를 사용한다.
- 사용자 화면에는 내부 오류 세부 정보 대신 처리 가능한 안내 문구를 보여준다.

## 10. V1 비범위

- subscription
- user accounts, 단 별도 의사결정으로 추가하는 경우는 제외
- native app
- chat consultation
- compatibility report
- annual fortune
- admin console
- provider records를 넘어서는 automated legal/tax handling
- 리포트 외부의 장기 개인 프로필 관리

## 11. 구현 전 체크리스트

- [ ] payment provider를 선택했다.
- [ ] terms/privacy/refund copy가 화면에서 확인 가능하다.
- [ ] production env vars와 dev env vars가 분리되어 있다.
- [ ] dev 환경에서 real payment가 발생하지 않는다.
- [ ] raw card storage가 없다.
- [ ] paid/free UI gate가 설계되어 있다.
- [ ] report retrieval policy가 결정되어 있다.
- [ ] deletion process가 정의되어 있다.
- [ ] 결제 성공 후 리포트 생성 실패 대응 경로가 있다.
- [ ] `pnpm test`, `pnpm lint`, `pnpm build`, `pnpm release:check`가 통과한다.

## 12. 다음 개발 Task 제안

1. 36B — source tests/checklist reference
2. 37A — paid/free gating UI design document
3. 38A — minimal report persistence design
4. 39A — payment provider decision document
5. 40A — production deployment checklist
