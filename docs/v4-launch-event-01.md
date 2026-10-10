# GYEOL-V4-LAUNCH-EVENT-01

> Historical implementation record. Its October 29 / 72-hour schedule and automatic SCHEDULED activation are superseded by [LAUNCH-EVENT-SCHEDULE-FIX](v4-launch-event-schedule-fix.md). Use that document for current operating dates and activation requirements. Reward caps and the fixed November 1 expiry remain unchanged.

## Scope / activation boundary

- Base: `v4/ticket-commerce-04a` / `8f4b35a9c13128d9b7fe2e325d77891f9f869f3f`.
- Work branch: `v4/launch-event-01`.
- Prepared SQL only. No Production migration, campaign seed, budget approval, public gate change, deployment, real payment or ad operation.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/` are pre-existing changes and excluded.
- Existing calculation/narrative, product IDs/prices, Auth/ownership, ticket fulfillment, shared-report capability and 90-day report retention are unchanged.

## Exactly 72 hours

| Boundary | KST | UTC | State |
|---|---|---|---|
| Before start | 2026-10-28 23:59:59 | 2026-10-28 14:59:59Z | SCHEDULED |
| Start inclusive | 2026-10-29 00:00:00 | 2026-10-28 15:00:00Z | ACTIVE, only if approved/available |
| Last full second | 2026-10-31 23:59:59 | 2026-10-31 14:59:59Z | ACTIVE, only if approved/available |
| End exclusive | 2026-11-01 00:00:00 | 2026-10-31 15:00:00Z | ENDED |

`clock_timestamp()` is the only reward clock. Grant checks read it again after waiting for the budget lock. The event has no client clock/query/cookie override. PAUSED/DRAFT operational status overrides the time window. Missing/unapproved budget pauses active-period benefits; before start the home can show SCHEDULED without promising eligibility. There is no extension mechanism.

## Reused authority and new guard

Migration: `supabase/migrations/20261010132645_v4_launch_event.sql` (CLI-generated filename; not applied remotely).

| Existing authority | Preserved / added behavior |
|---|---|
| `growth_campaigns.starts_at / ends_at` | Bound event campaign must use the exact window, REPORT_TICKET, quantity 1. Trigger rejects changed window/type/quantity. Other campaigns remain separate. |
| `new_user_acquisitions` | First actually committed valid acquisition wins across campaign/referral. Context visits alone are not grants. |
| OAuth member + required consent + new-user checks | Existing server/SQL checks reused. Existing users, self-referral and forged publication rejected. |
| `report_ticket_grants` / `report_ticket_ledger` | No second points system. Add nullable event/family/source columns only; historic rows untouched. BEFORE INSERT guard forces event expiry, evidence, lifetime cap, budget. |
| `referral_publication` | Stored complete publication, active owner link, paid/ticket origin and snapshot equality remain mandatory. |
| `book_referrals('qualify')` | First qualified attribution; inviter account locked; actual grant separately bounded. Capped inviter does not block new friend's acquisition. |

New `launch_event_policy` holds only the existing campaign reference, approved budget and approval time. **No row is seeded**. The public status projection contains state/time/availability/slug, never internal IDs or numeric budget balances.

Mutation functions remain security-invoker, service-role-only; RLS is enabled with no anon/authenticated policy. Budget configuration has no browser endpoint. Existing service role can read/lock/update policy; insertion/initial approval is an operator-controlled DB step, not an automatic app action.

Lock order: account(11) → context/attribution → ticket account(10) → event budget row. The budget row serializes only event grant issuance, not all paid redemptions. A partial unique index `(user_id, reward_family)` plus the existing ticket account lock enforces lifetime families; historic relevant source refs are also checked without rewriting them.

## Reward contract

| Family | Sources | Lifetime maximum | Quantity | Expiry |
|---|---|---|---|---|
| ACQUISITION_REWARD | campaign or referral | 1/account | 1 | 2026-10-31T15:00:00Z |
| INVITER_REWARD | first valid friend publication | 1/account | 1 | same |

- Total event promotional maximum: 2/account, not per link/report/session/event page.
- Purchase/manual/refund-compensation grants are not promotional-cap consumption. They retain original expiry.
- A campaign → B referral → C referral works. A's second invitation can still grant D's acquisition, but never A's second inviter reward.
- Referral links/shared Books are not revoked at deadline. `inspect` can still validate the shared publication while marking reward availability false.
- New capture/bind/attribute cannot authorize referral grants outside the event. Ledger guard also fences direct service grant calls; invalid source evidence is rejected.
- A budget/clock/cap rejection during acquisition rolls back the attribution/grant transaction. No half-granted junction remains.
- Qualification without available inviter reward records QUALIFIED without a grant, avoiding endless recovery attempts or retroactive rewards after a pause/deadline.

## Budget — unapproved

All four values require explicit operator approval:

- Total event issued ticket count.
- Campaign acquisition count.
- Referral acquisition count.
- Inviter success count.

No arbitrary Production numbers are supplied. Null approval or missing cap is fail closed. The locked policy row plus counts of immutable event grants makes the last-slot competition atomic. Spent, expired and reversed lots still consume issuance budget and lifetime caps; failures do not manufacture another grant.

The old local `book-coupon` 300-won fixture is not the launch policy. Tests use separately labeled isolated campaign/budget fixtures only.

## Expiry / in-flight publication

- All new scoped event grants have the same fixed end, not grant-time + 3 days.
- Existing EXPIRE events remain append-only. Summary excludes expired lots; new REDEEM cannot choose them.
- A committed reservation before the deadline can publish afterward. No completed Book cancellation; report access remains first publication + 2,160 hours (90 days).
- Failed publication reverses into the original lot, which is immediately expired if its deadline has passed. No extension, deletion or replacement grant.
- A friend's publication completed after the deadline **does not produce a new inviter reward**, even when generation was reserved before it. Delay at the final seconds can cause a reward dispute; customer notices explicitly disclose this rather than promise compensation.

## Home countdown / customer presentation

- Existing header → monochrome editorial event strip → existing six-book coverflow.
- `GYEOL REPORT / LIMITED EVENT`, `단 3일, 나의 결을 발견하는 시간`, `10.29 — 10.31`, tabular DD : HH : MM : SS.
- SCHEDULED targets start; ACTIVE targets end. ENDED hides timer/benefit CTA; PAUSED shows interruption first.
- Initial SSR has stable non-eligible loading text. Fetch failure clears eligibility; normal paid/product navigation continues.
- Monotonic `performance.now()` elapsed time + DB `serverNow`, conservative request-start anchor, 20-second refresh, focus and visibility refresh. Countdown cannot promote SCHEDULED into eligible ACTIVE without a server response.
- One-second tick is isolated from coverflow state. No every-second live region announcement. Reduced-motion CSS; existing coverflow reduced-motion behavior retained.
- Details disclosure contains period, expiry, 1+1 lifetime caps, no ad/referral double acquisition, first valid publication, deadline-delay warning, paid-ticket isolation and no mandatory Kakao-channel add.
- Campaign page failures hide free-benefit copy; referral CTA also revalidates event status while open. General share actions/native/Kakao/copy are unchanged.

Origin fix: campaign/referral POSTs reuse `isPublicSameOrigin`. Exact apex→apex or www→www allowed; apex↔www, external/suffix/preview/forwarded-host spoofing rejected. No CSRF relaxation.

## Verification evidence

Artifacts: `/private/tmp/gyeol-v4-launch-event-01/`.

- Event targeted: 29 PASS, including actual six-product event-ticket generation, full stored Book, Major 14/14, Annual 12/12, Compatibility directions, historical grants preserved, two lifetime caps, fixed expiry and actual account/ledger linkage. An additional full A → B → C chain runs real writers/completeness and the existing referral service reconciler (not just minimal SQL envelopes).
- Real PostgreSQL 16.15: 7 PASS, 199 independent backend PIDs, maximum 10 concurrent connections, deadlocks 0. Not a PGlite Promise.all claim.
- SQL scenarios: 100 retries; campaign/referral race; last total budget slot; referral sub-budget; simultaneous qualifications into one inviter; different inviters into last inviter budget; expiry after account-lock wait; publish/reverse after expiry; paid isolation; RLS.
- Isolated SQL tests substitute a DB-only clock function in their own temporary database. Shipping migration always uses real DB time; no OS clock changed.
- Browser: real Chrome, 21 screenshots. 390/430/768/1440 × SCHEDULED/ACTIVE/ENDED/PAUSED; 320 reference, reduced-motion, notices expanded, failed API. Console/hydration errors 0; document horizontal overflow 0. Keyboard book selection and timer movement observed.
- Browser baseline used the actual local endpoint: SCHEDULED, budget unapproved, all rewards unavailable. Other dates/states used Chrome response interception with isolated clock fixtures **only for visual checks**; not a claim that the real current date was ACTIVE or that Production was activated.
- Visual pass found excessive blank space after adding the strip; adjusted only the adjacent home section's minimum height. Existing covers/controls/navigation were not redesigned.
- Broad regression initial run: 491 PASS, 12 timeout FAIL, 2 opt-in SKIP (33 files). All 12 failures were default 5-second timeouts in 4 unchanged generation-heavy files; rerunning those 4 files with `--maxWorkers=1 --testTimeout=30000` produced 103 PASS / 0 FAIL. No assertions were changed to obtain a pass. Two optional worker capacity/measurement simulations remain skipped.
- Additional legacy/direct-payment/snapshot regression: 75 PASS / 0 FAIL (4 files). Golden-producing calculation/narrative modules and data files have no diff from base.
- Final deduplicated coverage: **579 PASS / 0 remaining FAIL / 2 opt-in SKIP**, plus **7 real PostgreSQL scenarios PASS**. Current broad test collection has 504 runnable cases (including the added full-chain case); legacy checks add 75. Timeout recovery and targeted reruns are not double-counted.
- `pnpm lint`: PASS. `pnpm build`: PASS (local sandbox build stalled; same build succeeded with local process permission). `tsc --noEmit --incremental false`: baseline 390, new 0 (compared with COMMERCE-04A diagnostics; only equivalent union-member display order differs). `git diff --check`: PASS.

Representative screenshots:

- `screenshots/390-real-db-scheduled-unapproved.png`
- `screenshots/390-active.png`
- `screenshots/430-paused.png`
- `screenshots/768-ended.png`
- `screenshots/1440-active.png`
- `screenshots/390-notices-open.png`
- `screenshots/390-fail-closed.png`

Reproduce PostgreSQL checks only in a fresh explicitly isolated local container:

```sh
docker run --detach --name gyeol-launch-event-pg --network none --tmpfs /var/lib/postgresql/data --env POSTGRES_HOST_AUTH_METHOD=trust postgres:16-alpine
node scripts/verify-launch-event-postgres.mjs --isolated-local
```

The runner checks network=none, no bound host directories, no published ports and tmpfs data before creating a fresh DB. It refuses to reuse an existing test DB. No credentials or Production connection are read.

## Operator checklist before activation (NOT executed)

- [ ] Approve total and three source budgets and the real campaign slug/message.
- [ ] Review/apply guarded migration in a separately authorized DB rollout; verify existing ledger/publication history.
- [ ] Create the exact REPORT_TICKET ×1 campaign and policy in an approved transaction. Check schema guard, approval time, source caps, and no DRAFT/PAUSED status when intentionally enabling.
- [ ] Separately approve Book/Auth gates and operational launch. This branch does not change them.
- [ ] Confirm customer expiry/cap/first-publication-delay notices and support handling; no automatic reward extension.
- [ ] Check Meta ad-account timezone. Schedule start at 2026-10-29 00:00 KST and stop at 2026-11-01 00:00 KST, converted to the actual account timezone.
- [ ] Do not infer that the web timer stops ads. Independently verify the platform's stop reservation and delivery after cutoff. No ads API is called by this implementation.
- [ ] Confirm monitoring for issuance counts, failures and reconciliation under the approved budget; keep normal paid purchase, login, ticket shop and existing shared Books available after deadline.

Production activated: **NO**. No LAUNCH-KAKAO-02 or LAUNCH-BRAND-03 work included.
