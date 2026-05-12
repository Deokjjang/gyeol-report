# 결리포트 Manual QA Execution Record Template

## 1. 목적

이 문서는 브라우저 기반 manual QA 실행 결과를 기록하기 위한 템플릿이다.

- 실제 QA 수행 시 확인한 환경, 명령 결과, 라우트, 시나리오, 이슈를 남긴다.
- 이 문서 자체는 QA가 이미 통과했다는 증거가 아니다.
- 기록이 완료된 뒤에도 blocker가 있으면 해당 항목을 먼저 처리한다.

## 2. QA 실행 전 상태

- Git commit:
- Branch:
- Date:
- Tester:
- Environment:

## 3. 실행 환경

- OS:
- Browser:
- Device:
- Viewport:
- Network:

## 4. 검증 명령 결과

| Command | Result | Notes |
| --- | --- | --- |
| pnpm test |  |  |
| pnpm lint |  |  |
| pnpm build |  |  |
| pnpm release:check |  |  |

## 5. 라우트별 QA 기록

| Route | Expected | Result | Issue |
| --- | --- | --- | --- |
| / | Home page loads and CTA is visible |  |  |
| /report/new | Report preview creation screen loads |  |  |
| /terms | Terms placeholder page loads |  |  |
| /privacy | Privacy placeholder page loads |  |  |
| /refund | Refund placeholder page loads |  |  |

## 6. 입력 시나리오 QA 기록

| Scenario | Expected | Result | Issue |
| --- | --- | --- | --- |
| valid solar birth date/time | Report preview can be generated |  |  |
| unknown birth time | Flow remains usable with unknown time path |  |  |
| MBTI selected | MBTI-related report content appears where applicable |  |  |
| MBTI omitted | Flow does not stop because MBTI is omitted |  |  |
| missing birth date | Validation guidance appears |  |  |
| incomplete field | User can correct input and retry |  |  |

## 7. 모바일 QA 기록

| Scenario | Expected | Result | Issue |
| --- | --- | --- | --- |
| 360px viewport | Core pages remain readable |  |  |
| no horizontal overflow | Page does not require sideways scrolling |  |  |
| form usability | Inputs and submit control are usable |  |  |
| report card readability | Report cards and lists are readable |  |  |
| policy page readability | Policy placeholder pages are readable |  |  |

## 8. 결제 비활성 QA 기록

| Scenario | Expected | Result | Issue |
| --- | --- | --- | --- |
| home no-payment preview copy visible | Home states preview is no-payment |  |  |
| /report/new payment inactive notice visible | Report preview page states payment is inactive |  |  |
| no card/payment input | No card or payment information input appears |  |  |
| no active purchase flow | User cannot start a real purchase flow |  |  |
| locked/full report CTA is non-purchase wording | CTA does not imply active purchase |  |  |

## 9. 정책 페이지 QA 기록

| Scenario | Expected | Result | Issue |
| --- | --- | --- | --- |
| pre-launch draft notice | Placeholder status is visible |  |  |
| support email visible | official@dvem.ai is visible |  |  |
| home link works | Link returns to / |  |  |
| no final legal approval claim | Page does not imply completed legal review |  |  |

## 10. 오류/복구 QA 기록

| Scenario | Expected | Result | Issue |
| --- | --- | --- | --- |
| validation error | User-facing validation message appears |  |  |
| API failure if simulated | Safe error message appears |  |  |
| retry path | User can retry after failure |  |  |
| user not stuck after error | User can continue or correct input |  |  |

## 11. 이슈 목록

| ID | Severity | Area | Description | Owner | Status |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

## 12. 최종 판정

- [ ] Internal/private no-payment preview can proceed
- [ ] Internal/private no-payment preview is blocked
- [ ] Paid public launch remains blocked

## 13. 다음 조치

- blocking issue를 먼저 수정한다.
- release check를 다시 실행한다.
- 영향을 받은 manual QA scenario를 다시 확인한다.
- payment, persistence, policy, support가 정리되기 전에는 paid public launch로 진행하지 않는다.
