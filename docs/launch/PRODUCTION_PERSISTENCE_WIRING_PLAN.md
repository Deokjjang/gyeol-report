# 결리포트 Production Persistence Wiring Plan

## 1. 목적

이 문서는 future wiring plan for production persistence를 정의한다.

runtime wiring은 adapter implementation과 분리한다. 이 단계는 앱/API에서 어떤 persistence adapter를 언제 주입할지의 경계를 문서화하며, 실제 runtime wiring이나 DB 연결을 포함하지 않는다.

## 2. 현재 전제

- report creation API exists.
- in-memory adapter exists.
- Supabase adapter exists with injected query client.
- Supabase SDK client is still skeleton.
- production DB is not connected.
- payment remains inactive.

## 3. Wiring 전 차단 조건

- SDK-backed query client implemented.
- env/secrets boundary decided.
- migration applied or confirmed.
- RLS/access policy reviewed.
- fallback behavior decided.
- manual QA plan ready.
- release check pass.

## 4. Runtime 구성 후보

후보 factory 이름:

- `createReportPersistenceRuntime`
- `createProductionReportPersistenceAdapter`
- `createPreviewReportPersistenceAdapter`

구성 원칙:

- production runtime should use Supabase adapter + SDK query client.
- preview/dev runtime may use in-memory adapter.
- runtime factory must be server-only.

## 5. Report Creation 저장 흐름

저장 흐름 초안:

1. validate input.
2. calculate saju.
3. build report.
4. create persistence record.
5. save via adapter.create.
6. return report preview response.

응답/경계:

- API response should not expose internal DB row.
- access token handling remains separate.
- payment remains inactive until paid unlock is implemented.

## 6. Report Lookup 조회 흐름

조회 흐름 초안:

1. receive report id/access token later.
2. validate access boundary.
3. adapter.find.
4. return public preview/full result according to access mode.

응답/경계:

- do not expose deleted reports.
- do not expose raw payment/provider data.
- token hash verification remains separate.

## 7. Preview/Paid Access 경계

- preview mode can show limited/public safe result.
- paid mode must require future unlock/token/payment validation.
- current UI payment inactive state remains unchanged.
- no automatic paid unlock.

## 8. Adapter 선택 규칙

- production env selects Supabase adapter only after SDK query client is implemented.
- local/dev/test may use in-memory adapter.
- no silent production fallback to memory without explicit flag.
- fail closed if production persistence is configured incorrectly.
- avoid hidden runtime switching.

## 9. 환경변수/서버 전용 경계

- env read only inside server-only composition layer.
- no env read in mapper.
- no env read in report generation logic.
- no secrets in client bundle.
- no NEXT_PUBLIC_ service role key.
- no secrets in logs.

## 10. 실패 처리 규칙

실패 케이스:

- persistence unavailable.
- duplicate report id.
- mapper validation failure.
- DB permission failure.
- unknown DB failure.

처리 규칙:

- return typed API error envelope.
- do not expose secrets/provider raw errors.

## 11. 테스트 전략

테스트 후보:

- runtime factory selects preview adapter.
- runtime factory selects Supabase adapter when configured.
- production misconfiguration fails closed.
- report creation calls persistence adapter.
- persistence failure maps to API error envelope.
- lookup excludes deleted records.
- no client-side import markers.
- no env read in pure files.
- release check pass.

## 12. 구현하지 않는 범위

- actual SDK-backed query client.
- actual paid unlock API.
- Toss payment integration.
- webhook processing.
- admin console.
- analytics.
- production deployment.
- legal/support copy finalization.

## 13. 완료 기준

- wiring plan exists.
- runtime factory task is defined.
- server-only boundary is defined.
- adapter selection rules are defined.
- creation/lookup flows are defined.
- test strategy is defined.
- no source changes.
- release check passes.

## 14. 다음 개발 Task 제안

1. 65B — production persistence wiring plan source test
2. 65C — persistence runtime factory skeleton
3. 65D — persistence runtime factory tests
4. 66A — report creation persistence integration plan
5. 66B — payment provider implementation preparation
