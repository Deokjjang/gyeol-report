# V4 Phase 11B — Friend referral rewards

Branch `v4/rebuild`; base `9c9114bea2264ceb7c6fecfe83eabf0d26032d60`.
Verified locally on 2026-10-04 KST. **Prepared, not activated.** Book/Auth public gates remain `false`.

## Policy and reused contracts

| Boundary | Contract |
| --- | --- |
| A shares | Existing Phase 11A shareable, complete publication; logged-in member must actually own it. Guest shares remain ordinary shares. |
| B joins | Context acquired before a newly created OAuth identity, then current required first-login consents. B receives one ticket. |
| B completes | First actually complete, persisted, published, owned report. Any of six products; ticket or ordinary paid generation. |
| A receives | One ticket per qualified B, never at click/signup/start/checkout. |
| Reward accounting | Existing Phase 10A `report_tickets('grant')`, `source_type=referral`, quantity 1. No second reward ledger. |
| Coupon | No coupon issuance or coupon schema change. Existing ticket-versus-paid/coupon choice and no mixing remain. |
| Content | Existing V4 generation/completeness validator and stored snapshot. No narrative/calculation/UI-renderer rewrite. |

Audited: `account/{handler,policy,supabase}.ts`, library claim/ownership migration, ticket service/SQL, coupon regression, `sharing/reportShareStore.ts`, `book/{shareServer,shareModel,storedReport}.ts`, paid `finish_job` and publication ownership attachment.

## Credentials and context

- `/r/{gr_shareToken}?ref={rf_referralToken}`. Share token remains read authority only.
- Referral token: 32 random bytes, 43 base64url characters with `rf_`; only SHA-256 hash stored. Bound to inviter account and source report. No user ID/email/name encoded in URL.
- Invite has nullable expiry and revocation. No invented campaign lifetime or daily cap.
- CTA POST accepts only `shareToken` and `ref`, checks same origin, validates the stored complete source and active share, and creates an opaque server context.
- Context uses a separate random secret/hash and a ten-minute transport lifetime, matching the existing OAuth flow. This is not a reward/campaign expiry.
- Public cookie `__Host-gyeol-referral`: Secure, HttpOnly, SameSite=Lax, path `/`. Loopback dev uses a separate local cookie.
- First captured context wins while its cookie lives; another link neither replaces it nor extends its TTL. First successful attribution becomes permanent. Invalid/expired context fails closed until a fresh context is possible.
- Only fixed `/login` or local login/home destinations are returned. Client also allowlists the returned destination; no caller-controlled return URL.

## Server-side new-user definition

`auth.users.created_at` must be at or after the database-recorded context acquisition and not in the future. Neither client flags nor editable user metadata establish eligibility.

Reject: same inviter identity; an existing attribution/binding to another context; prior profile/consent predating context; any prior report ownership, ticket grant/redemption, or successful account-bound purchase. Required current consent versions come from existing server constants.

The verified callback binds the context to the OAuth identity; consent/retry then attributes. Existing logged-in readers continue normally without a newcomer offer. An anonymous existing account can see the conditional invitation, but server account age rejects it after login.

Dev OAuth records a stable, server-only creation timestamp at first successful mock exchange. Provider re-login keeps that timestamp; it does not become a new account. This is a local fixture, not a real provider call.

## Lifecycle, B grant, qualification, A grant

| Internal state | Durable truth |
| --- | --- |
| invited | `referral_invites` exists; no credit |
| context/bound | `referral_contexts` acquired before identity creation and bound by verified callback |
| joined / REFERRED_REWARD_GRANTED | One immutable attribution + B grant committed together |
| QUALIFIED | Actual stored complete report + successful publication + owner link; validated before credit |
| rewarded / INVITER_REWARD_GRANTED | A grant and final attribution state committed together |

B source ref/key: `referred:{attributionId}` / `referral:referred:{attributionId}`.
A source ref/key: `inviter:{attributionId}` / `referral:inviter:{attributionId}`.
Both reference the same attribution, with role prefixes to avoid cross-role collisions.

Before B's grant, the service revalidates the source's current full snapshot; SQL compares the exact validated JSON again. Source corruption, expiry, revocation, lost ownership, or removed share before attribution prevents the grant.

Qualification reads durable publication candidates and reuses `validateBookPublication` on the exact persisted snapshot. SQL compares that JSON again under the attribution lock; `published_at` and ownership attachment must follow attribution. A source must be either a successful paid order/binding or a completed matching ticket redemption. Failed/partial/corrupt drafts and missing/revoked ownership do not qualify. Recovery skips an invalid stored candidate and can qualify a later genuinely complete report.

Paid publication has a guarded **post-commit observer**, leaving the original payment/publish result unchanged. Ticket publication uses the existing ledger flow; summary/library visits can recover a missed observer from durable state. Server-only `reconcileReferrals` is also a future background recovery hook; no cron or public reward endpoint was added.

After valid attribution, later expiry/revocation of the original A share/invite does not cancel B's eventual qualification. Ordinary report expiry after reward does not reverse A's ticket. Refund/fraud clawback policy is deferred; no new automatic reversal policy.

## Concurrency and exactly-once guards

- Unique referred user and context attribution; unique qualified report and each reward grant FK.
- Account advisory lock → context/attribution row lock → one existing ticket-account lock; observer runs after B publication transaction commits. No nested A/B ticket grant locks.
- Existing ledger idempotency keys plus immutable attribution enforce duplicate callback/consent/grant/publish/recovery safety.
- B reward and attribution, and A reward and qualification, are each atomic SQL transactions. Grant failure rolls back the attribution transition.
- Local SQL tests concurrently call the application callbacks/recovery via `Promise.all`; PGlite serializes its single database connection. Independent PostgreSQL connections/process-crash contention still require staging verification before activation.

## Security, RLS and privacy

Three new tables have RLS enabled and no client policies/privileges. `anon`/`authenticated` cannot read/mutate attribution or invoke rewards. Only service role receives minimal select/insert/update and function execute; no SECURITY DEFINER. Functions use an empty search path and qualified relations. No service credential is sent to the browser.

Source/full snapshots returned by the internal RPC remain server-only. Browser models contain only the existing allowed share projection, opaque ref and eligibility presentation. A's account notice exposes neither B identity/provider/email nor birth/report input. B receives no additional A account information. Shared full-book access remains the intentionally disclosed Phase 11A read contract.

Migration prepared via Supabase CLI and exercised against the isolated local SQL fixture. No remote advisor, DB mutation, migration apply, env change or provider configuration occurred. Reviewed against [Supabase SSR client guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs) and [RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).

## UI and internal event contract

- Reused the three small Kakao / system share / copy controls. Referral URL is used for those actions; canonical metadata/OG remains the existing read URL.
- Accurate staggered notice: “친구는 처음 가입·동의하면 1장, 나는 친구가 첫 책을 완성하면 1장을 받습니다.”
- Shared book keeps one “나도 내 책 만들기” CTA. Only eligible-looking anonymous presentation gets the conditional new-signup notice; actual eligibility is server-only.
- Existing library balance displays B's “친구 초대로 리포트 이용권 1장을 받았습니다.” or A's “친구가 첫 책을 완성해 이용권 1장이 추가되었습니다.” No dashboard/gamification.
- `REFERRAL_EVENTS` declares the seven requested internal names: link-created, landing-opened, CTA-clicked, attributed, B-granted, qualified, A-granted. This phase defines the contract only, not an analytics transport or event history. No Meta referral event/PII transmission.

## Verification

| Check | Result |
| --- | --- |
| Referral SQL/service suite | 20 PASS, including new/existing/self, forged/expired/revoked, ownership, source corruption, first valid recovery, two inviters, concurrency, paid/ticket and RLS |
| Related regression | **1,348 PASS / 0 FAIL**, 43 files: Auth/library/tickets/coupons/sharing/V4 runtime/book/report tables/paid reliability/share components |
| Six ticket-qualified products | 6/6; Major 14/14, Annual 12/12, Compatibility two directions; different received/generated products allowed |
| Browser | **74 PASS**: A share → B mock OAuth/consent → B +1 → actual Career V4 book → A +1; existing member normal CTA, retry no duplicate |
| Responsive | 390 / 430 / 768 / 1440: no horizontal overflow, hydration/console errors, or clipped reward notice observed |
| lint | PASS |
| build | PASS; four non-blocking NFT tracing warnings from the existing local SQL helper dependency path |
| TypeScript | Actual base 390 → current 390; **0 new**. Full `tsc` remains non-clean baseline. |
| diff-check | PASS |
| External side effects | Real OAuth/payment/OpenAI/Kakao reward transport 0; public Book/Auth remain OFF |

Commands:

```sh
pnpm test tests/unit/account tests/unit/sharing tests/unit/interpretation-v4 \
  tests/unit/app/bookPublicFlow.test.tsx tests/unit/app/dev/bookRuntime.test.tsx \
  tests/unit/app/dev/bookPreview.test.tsx tests/unit/payment/paidReportReliability.test.ts \
  tests/unit/components/ReportShareInteraction.test.tsx tests/unit/components/KakaoShare.test.tsx
pnpm lint
pnpm exec tsc --noEmit --pretty false
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
git diff --check
```

Local reproduction: export `RUNTIME_FIXTURES` using `REFERRAL_REVIEW_EXPORT=/tmp/gyeol-v4-11b` with the referral test, start a fresh loopback dev server on 3189, then run `scripts/verify-v4-referrals.mjs` with `BOOK_BROWSER_BIN` pointing to agent-browser. Fresh server is needed because mock provider identities deliberately remain existing on re-login. Local share/referral verification now uses the existing ticket SQL instance, so the grants shown in the library are the actual ledger grants, not UI mocks.

Artifacts (local, not committed):

- `/tmp/gyeol-v4-11b/browser-results.json`
- `/tmp/gyeol-v4-11b/{390,430,768,1440}-{A-owner-share,B-cover,B-shared-cta,B-reward,B-created,A-reward,existing-member-cta}.png`
- `/tmp/gyeol-v4-11b/390-B-consent.png`, `390-B-login.png`, `390-B-ticket-receipt.png`
- `/tmp/gyeol-11b-{regression-final,browser-final,lint,build,tsc-baseline,tsc-current}.log`

## Migration order and activation prerequisites

Do not apply in this phase. Existing paid reliability/schema first, then:

1. `20260929113608_report_share_links.sql`
2. `20261003094827_v4_account_foundation.sql`
3. `20261003104500_v4_report_library.sql`
4. `20261003114045_v4_report_tickets.sql`
5. `20261003123157_v4_coupon_foundation.sql` (coexistence only)
6. `20261003143822_v4_friend_referrals.sql`

Before Production: review actual Auth clock/identity-linking behavior, all pending migrations and privileges, consent/legal messaging, real multi-connection concurrency, failure/recovery, and existing dev SQL tracing warnings. Both public gates remain unchanged.

Existing Phase 11A source-share eligibility is intentionally preserved: its ordinary paid `read_report`/purchase-claim source path is what the browser A fixture exercises. **Ticket-created books qualifying B is covered; issuing a new share from a ticket-created book is not covered by the existing paid-only share authority.** Reconcile that source-share adapter in a separately scoped pre-activation integration pass; do not confuse B qualification support with ticket-source share support. Old `book-local-*` mock records are not converted into ordinary paid share records here.

## Remaining abuse policy / next Growth Campaign planning (not implemented)

- Decide campaign/per-inviter limits before activation; this phase gives one grant per distinct valid new identity without an invented cap.
- Define multi-account/provider-link abuse handling. Identity equality prevents self referral on the same account, not humans creating several real accounts. No fingerprint/IP tracking added.
- Define fraud/refund clawback, audit/review/appeal, account deletion/retention and stale context cleanup. FK restrictions preserve reward traceability; legal erasure lifecycle needs explicit policy.
- Add operational monitoring, reviewed event transport and bounded background recovery schedule only with approval. Events must exclude credential/identity/input data.
- Extend nullable invite expiry/campaign policy only after product decisions. No campaign coupon auto issue, countdown, milestone, bundle, Meta campaign, dashboard or production activation in Phase 11B.

Protected unrelated `.gitignore`, `AGENTS.md`, `supabase/.temp/` preserved and excluded. Master/Production untouched.
