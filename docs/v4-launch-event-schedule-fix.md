# GYEOL-V4-LAUNCH-EVENT-SCHEDULE-FIX

## Scope and current operating contract

- Base: `origin/v4/launch-event-01` / `05b2c89c4064bf3daef332bf2008c6f5609e197a`.
- Branch: `v4/launch-event-schedule-fix`.
- This supersedes only the schedule, activation semantics and associated copy in [LAUNCH-EVENT-01](v4-launch-event-01.md). That document remains a historical implementation/verification record, not the current schedule.
- Earliest start: **2026-10-11 00:00:00 KST = 2026-10-10T15:00:00Z** (inclusive).
- Fixed end: **2026-11-01 00:00:00 KST = 2026-10-31T15:00:00Z** (exclusive).
- Actual participation starts only after public service release, explicit operator `ACTIVE` status and approved available budget. A late release never extends the fixed end.
- Total and source budgets remain **unapproved**. No campaign seed, budget value, approval or activation is supplied by this change.

## Server/SQL authority

Prepared migration: `supabase/migrations/20261010135755_v4_launch_event_schedule_fix.sql` (CLI-generated name). Not applied to Production.

1. Preserve the original launch migration and all reward/ledger functions.
2. Replace `launch_campaign_guard` to require the new earliest start and unchanged end/type/quantity.
3. If a scoped campaign was already prepared with the old start, update **only** its start floor. Do not change its status, end, policy, approval, budget, rewards or references.
4. Replace `launch_event_state`; existing campaign/referral/ledger grant boundaries consume that same function, including the fresh check after lock wait.
5. Preserve security-invoker, empty search path, service-only execution, RLS and existing locks/indexes. No browser-controlled clock or status override.

The internal event identity `launch-20261029` is retained to preserve references, idempotency and grant history. It no longer means a start date and is not customer copy. The old timestamp occurs only in migration history, the exact old-row migration predicate and regression counterexamples.

| Precedence | Server condition | State / display |
|---|---|---|
| 1 | At/after fixed end, or operator ended | ENDED; no timer, no new rewards |
| 2 | Operator PAUSED | PAUSED; no running timer/rewards |
| 3 | Before earliest start | SCHEDULED; time until **earliest possible** start |
| 4 | Missing campaign, DRAFT/SCHEDULED, missing/future approval | SCHEDULED; after the floor, wait for public release/operator activation, not a running event |
| 5 | Total approved budget exhausted | PAUSED; no new event rewards |
| 6 | Explicit ACTIVE, approved budget and time within window | ACTIVE; source availability also checks each source budget |

`SCHEDULED` never automatically becomes `ACTIVE` merely because its timestamp passed. Application public Book/Auth gates remain unchanged and OFF; an operator must activate the campaign only after actual release. No new public-release bypass is added.

## Customer display and clock

- Existing white/black strip above the Book shelf, unchanged shelf dimensions, CSS, rotation/navigation and cover artwork.
- `EVENT COUNTDOWN` / `이벤트 진행 중` / `이벤트 종료까지` / `DD일 HH : MM : SS` / `11월 1일 00:00 종료` when genuinely active.
- Loading, scheduled, paused and ended do not claim the event is in progress. Crossing the start floor locally changes only to waiting, never to ACTIVE.
- Shared `LAUNCH_NOTICE` now describes earliest eligibility, actual activation and fixed expiry; the existing campaign landing and referral/share notices reuse it. Campaign start metadata says `최초 시작 가능` for this event only.
- Removed live fixed-three-day/Oct-29 campaign copy. Historical documentation is explicitly superseded; no arbitrary stored campaign marketing text is rewritten. When preparing an operational campaign, use the new copy, not historical three-day copy.
- Existing DB `serverNow` + `performance.now()` elapsed contract retained, including conservative request-start anchor, 20-second refresh, focus/visibility refresh, cleanup and fetch-failure fail-closed behavior.
- Reentry/new tab/reload reads the current server snapshot; the customer need not have kept a page open at the start. Browser wall-clock changes do not extend/restart the timer. Initial SSR remains a fixed loading state.
- Deadline hides the timer/benefit CTA, not ordinary Book selection or paid purchase. General sharing stays available.

## Reward invariants — unchanged

| Contract | Result |
|---|---|
| New-account acquisition | Lifetime max 1; campaign/referral first committed source only |
| Inviter success | Lifetime max 1; qualifying first actual publication, not link/report count |
| Combined free maximum | 2/account |
| A → B → C | Preserved; capped A can still invite D without earning a second inviter reward |
| Oct 11 / Oct 30 grants | Same fixed Nov 1 00:00 KST expiry, not relative duration |
| Paid/manual/non-event lots | No expiry, price, balance or refund-policy changes |
| In-flight generation | Pre-end reservation can finish after end; no new inviter reward after end |
| Failure reversal | Returns to original lot; expired lot remains unusable |
| Existing Book retention | 90 days from original publication, unchanged |
| Security | Account locks, budget row serialization, idempotency, RLS, strict Origin and append-only history unchanged |

## Verification

Artifacts: `/private/tmp/gyeol-v4-launch-event-schedule-fix/`.

Required boundary checks use isolated DB test clocks, never OS/client authorization:

| KST | Approved + explicitly activated campaign |
|---|---|
| Oct 10 23:59:59 | SCHEDULED, no grant |
| Oct 11 00:00:00 | ACTIVE; earliest eligible instant |
| Oct 12 12:00:00 | ACTIVE |
| Oct 29 00:00:00 | Still ACTIVE, same end; no reset |
| Oct 31 23:59:59 | ACTIVE |
| Nov 1 00:00:00 | ENDED, no grant |

- Event SQL/presentation: 34 PASS, including explicit activation/late activation, unknown policy, future approval, old-window rejection, historical migration preservation and real six-product event-ticket generation. Major 14/14, Annual 12/12 and Compatibility A/B retained.
- Component effect tests: 6 PASS; initial late entry, wall-clock jumps both directions, remount, scheduled floor crossing without activation, focus activation, hidden/resume, timer/listener cleanup, end/fetch failure and Oct 29 continuity.
- PostgreSQL 16 real concurrency: 8 scenarios PASS, 203 independent backends, max 10 simultaneous, deadlocks 0. Includes revised boundary/activation contract plus all prior races/caps/expiry safety checks. First run caught one obsolete PAUSED expectation for missing approval; corrected to the new SCHEDULED contract and reran all scenarios in a fresh isolated DB.
- Related account/referral/campaign/coupon/ledger/member-payment/Book/share/six-product regression: **456 PASS / 0 FAIL (28 files)**, including the 34 event SQL/presentation cases above.
- Additional paid reliability / snapshot / V3 regression: **75 PASS / 0 FAIL (4 files)**. With the 6 component-effect cases, final distinct automated coverage is **537 PASS / 0 FAIL**, plus the 8 real-PostgreSQL scenarios.
- `pnpm lint`: PASS. `pnpm build`: PASS. `git diff --check`: PASS. TypeScript `--noEmit --incremental false`: **390 existing diagnostics, 0 new**, identical diagnostic lines to the LAUNCH-EVENT-01 baseline.
- Browser: real Chrome 155 headless, 390/430/768/1440 × scheduled-before-floor / scheduled-after-floor / active / paused / ended; actual unapproved local endpoint first. Future state/time fixtures are injected only through Chrome response interception, not through a shipped clock override or a Production campaign activation.
- Browser PASS, 25 screenshots: new-tab entry, reload, both-direction `Date.now` changes, Oct 29 continuity, lifecycle freeze/visible return, arrows/keyboard/swipe/side-book touch selection, center-book opening, browser back, expiry/failed-response CTA removal and reduced motion. Document horizontal overflow 0, application/hydration errors 0; Book geometry/control implementation unchanged. Three development HMR/BFCache warnings are recorded separately.
- Headless lifecycle resume requires explicitly restoring visible focus. Initial QA script retries corrected stale pre-reload DOM reads and canceled interception handling; no application changes were made for those harness conditions. Dev-only `/_next/webpack-hmr` Back-Forward Cache warnings are retained separately from application/hydration errors in the browser artifact.
- PostgreSQL verification container used `--network none`, tmpfs-only data and no ports/mounts, and was removed afterward. Its synthetic test rows are discarded; no user/Production data was present. The pre-existing dev server remains running.

Representative visual artifacts:

- `screenshots/390-active.png`
- `screenshots/430-wait.png`
- `screenshots/768-ended.png`
- `screenshots/1440-active.png`
- `screenshots/390-side-select.png`
- `screenshots/390-notices-open.png`
- `screenshots/390-fail-closed.png`
- `browser-qa.json`, `postgres-concurrency.json`, `regression.log`, `legacy-regression.log`, `lint.log`, `build.log`, `tsc-final.log`.

## Operational handoff — NOT performed

1. Review and separately authorize applying both launch migrations to the intended environment.
2. Approve total + campaign + referral + inviter issuance budgets explicitly. Do not infer budget from test fixtures.
3. Prepare the existing event-linked campaign with the new start floor, fixed end, REPORT_TICKET quantity 1 and updated copy; leave non-active until release is real.
4. Only after separately approved public release and budget approval, explicitly set the campaign ACTIVE. If release is late, keep the original end.
5. Verify real status/remaining time and each reward source before running ads. Ad start cannot precede actual activation and must stop at the fixed end.

No Production DB migration, seed, gate activation, deploy, payment, advertising, Meta action, master push, Kakao addition, price/refund-policy change or content-engine change. Protected `.gitignore`, `AGENTS.md`, `supabase/.temp/` preserved and excluded. COMMERCE-04B not started.
