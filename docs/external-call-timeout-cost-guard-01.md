# External call time and cost boundary

Scope: local/mock verification only. No provider calls, production SQL or deployment.

## Inventory and request limits

All six writers use native fetch against `POST https://api.openai.com/v1/responses`.
There is no OpenAI SDK dependency or automatic HTTP retry. Reliability attempts
1 and 2 invoke the writer; attempt 3 is entirely deterministic. The compatibility
writer may repair a schema/content validation failure once per attempt. The paid
comprehensive path already disables its development repair option.

| Product | Before: HTTP timeout | Now, including body | HTTP per attempt | HTTP per automatic run | max_output_tokens |
|---|---|---|---|---|---|
| Comprehensive | 120s abort signal | 120s abort + deadline race | 1 | 2 | 65,536 |
| Career | none | 120s | 1 | 2 | 32,768 |
| Love | none | 120s | 1 | 2 | 32,768 |
| Compatibility | 120s abort signal | 120s, also repair | 2 | 4 | 32,768 |
| Major | none | 120s | 1 | 2 | 65,536 |
| Annual | none | 120s | 1 | 2 | 32,768 |

These limits are per automatic **run**, not per lifetime order. An authorized admin
retry opens an existing new run; it can incur another bounded set of requests.
The durable attempt/lease mechanism is unchanged. A single injected call budget
also prevents accidental nested requests from exceeding the per-attempt limit.
No network initialization is needed for fallback.

Toss `POST /v1/payments/confirm` has a 15s whole-request deadline. Recovery retains
its earlier 10s parent deadline. Both use the same deadline helper; parent abort
cancels the child request. Endpoint, amount, payload and `confirm-${orderId}`
idempotency key are unchanged. There is no transport retry. A timeout leaves the
durable claim uncertain and recoverable, not financially failed. The success route
does not wait for report generation. Report generation and recovery already run
concurrently under independent error handling.

Other network inventory: the durable Supabase store uses supabase-js/PostgREST RPC;
legacy Supabase clients remain in payment, report-persistence, reports, persistence
and db modules. The durable store now applies a 10s RPC deadline and propagates abort through
PostgREST. The installed PostgREST 2.105.1 retries only GET/HEAD/OPTIONS; these RPCs
are POST and are not automatically retried. Legacy clients remain unchanged. Browser
fetches to prepare/validate/status are same-origin application requests. Standalone
smoke scripts can make live calls only when deliberately executed; none were run.

## Token and input rationale

Local deterministic fixture measurements (UTF-8; **not token estimates**):

| Product | Draft bytes | Serialized writer request bytes before guard |
|---|---:|---:|
| Comprehensive | 86,722 | 529,572 |
| Career | 20,278 | 234,766 |
| Love | 11,755 | 188,645 |
| Major | 69,510 | 251,657 |
| Annual | 31,350 | 211,469 |
| Compatibility, three categories | 21,129–21,254 | 140,519–140,554 |

Comprehensive's deterministic final draft differs from the writer's narrative
schema; it is a size reference, not a valid writer-response fixture. Existing
comprehensive narrative golden tests independently verify successful long output.
Other five product fixtures pass the writer and publish gate without shortening.

The larger tier accommodates comprehensive chapters/longform and major full-cycle
narrative; the other tier accommodates their structured chapters and tables. Caps
are generous ceilings, not prompts to produce more text. No model, prompt,
required section, minimum-density rule or fallback content changed. They are not
claims about the maximum length or latency of an unobserved real response.
The existing local non-secret model setting is `gpt-5.4-mini`; it is unchanged.
[Its official model reference](https://developers.openai.com/api/docs/models/gpt-5.4-mini)
lists a 128,000-token maximum output, above both ceilings. Vercel's actual model
setting and live latency remain operational checks; no secret value was printed
and no env value was changed.

All serialized requests (including repair) are capped at 1 MiB before HTTP. The
measured largest request leaves roughly 2x room. Prompts include selected evidence,
knowledge/allowed-term material, instructions and strict JSON schemas. Repair also
includes the failed draft and validation feedback intentionally. No proven redundant
serialization was removed: changing those prompts would require content QA.

[Responses API reference](https://developers.openai.com/api/reference/typescript/resources/responses/methods/create)
defines `max_output_tokens`, completion status/incomplete details and usage. The
output ceiling includes reasoning tokens where applicable. Explicit incomplete,
non-completed or errored responses, including incomplete output messages, fail
before writer parsing. Existing JSON/schema/publish validators remain mandatory.
Legacy test fixtures without a status field remain supported; an explicit failure
can never be treated as completed merely because its text parses as JSON.

## Audit and failure behavior

`report_generation_attempts.external_calls` stores at most two entries:
sequence, model, inputTokens, outputTokens, totalTokens, durationMs, outcome.
Attempt, strategy, run number, order/report linkage and overall duration already
exist on the attempt/job records. Missing/invalid usage is null, never zero-cost.
No monetary price tables, prompt, raw response, authorization or provider error
message are added. RPC reconstructs allowlisted scalar entries rather than storing
caller JSON wholesale. Old attempts keep `[]` (unknown), without inferred usage.

Internal outcomes distinguish timeout, rate limit, config/auth/model, quota,
malformed, incomplete, validation and generic provider failure. Missing local
configuration sends zero HTTP requests. Remote permanent errors remain bounded by
the existing two writer attempts; retry scheduling is intentionally unchanged.
30s / 2min retry and final deterministic fallback remain authoritative.

The first compatibility response can be HTTP-completed but invalid for publication;
repair is a separate audit entry. Publication validation remains outside the
transport audit. Network usage cannot be recovered after a process crash before
finish_job; lease-expired attempts correctly remain unknown. Abort stops local
waiting and requests cancellation; it does not guarantee provider billing stops.

## Worker time budget and limits

Per worker attempt: other products <=120s OpenAI waiting; compatibility <=240s.
Durable RPCs are individually bounded to 10s, including their response bodies.
Actual longest sequential paths, before local CPU overhead:

- Compatibility: expire + claim + 2 HTTP + finish = 270s; 30s platform margin.
- Annual: expire + claim + find_order + HTTP + finish = 160s.
- Other products: expire + claim + HTTP + finish = 150s.
- Recovery runs concurrently: claim + provider + finish + failure recording <=40s
  after expire (10s). It does not add serially to generation.
- Foreground confirmation: claim + provider + finish <=35s, without AI generation.

These are waiting bounds, not hard CPU preemption. Heavy local computation or a
process crash can still consume the remaining margin. A timed-out RPC may have
committed remotely; no blind transport retry is added. Existing tokens, atomic RPC
idempotency and expired leases handle uncertain completion. DB outages can still
prevent persisting usage; unknown usage must not be interpreted as zero cost.

## Manual production application, later

Do not use db push or migration repair. Review/apply in order in SQL Editor:

1. `scripts/paid_report_quarantine_recovery_patch.sql`
2. `scripts/paid_payment_confirm_recovery_queue_patch.sql`
3. `scripts/paid_report_publish_expiry_patch.sql`
4. `scripts/paid_report_external_call_guard_patch.sql`
5. `scripts/paid_report_publish_expiry_verify.sql` and
   `scripts/paid_report_external_call_guard_verify.sql` — both summaries failed=0
6. Separately authorized application deployment.

Already-applied prerequisites need not be replayed. The new patch checks expiry
and recovery prerequisites, adds only the audit column/check, and replaces the RPC
cumulatively. Reapplication preserves business rows, leases, expiry and prior audit.
Supabase role restrictions are retained. No production operation was performed.

## Local verification

- `pnpm test`: 342 files, 2,950 tests passed, including six-product HTTP caps,
  real guard deadlines with fake timers, compatibility repair, PGlite durable
  retries, 100 repeated worker executions, audit sanitization and patch reapply.
- `pnpm lint`, `pnpm build`, `git diff --check`: passed.
- `pnpm exec tsc --noEmit`: 394 pre-existing diagnostics, identical after
  normalizing shifted line numbers; zero new diagnostics and zero `src/` errors.
- Installed Supabase SDK mock transport verifies POST RPC is not retried on 503.
- Real OpenAI/Toss calls, production DB writes, deployments: zero.
