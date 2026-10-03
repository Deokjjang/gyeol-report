# Phase 9B — Account authentication foundation

Base `813cec8c886ad3f6b8ff9564a516eb7203f28248`, branch `v4/rebuild`.

## Scope and activation

- Kakao / Google only. No password/email login, library implementation, credits, coupons or referral.
- `accountPublicEnabled()` is server-only, literal **false**, independently of `bookExperiencePublicEnabled()` (also false). No environment/query/cookie override.
- Public `/login`, `/account`, `/auth/[action]` return 404 while OFF. Existing V3 home/header, paid reads, payment and sharing contracts remain unchanged.
- `/dev/account` and its API require development + loopback Host. Its opaque in-memory identities never contact Supabase or providers. Cookies expire after one hour; records are local fixtures and reset on server restart. No real account or durable library is created by this harness.
- Public activation is **not** approved or safe merely because this branch passes tests. Review the activation checklist below first.

## Current repository audit

| Existing source | Finding / reuse |
|---|---|
| `lib/db/supabaseServer.ts` | Server-only service-role client, no authenticated customer session. Reused only for restricted persistence after `getUser` verification. |
| `lib/db/supabaseClient.ts` | Browser client existed, but no account/session/profile flow. Unchanged; not used to establish authority. |
| Auth middleware/proxy | None. No broad middleware added: all auth operations/refresh happen in cookie-writable Route Handlers; RSC pages render only a non-private shell. |
| `0004_create_payment_orders_table.sql` | Order/provider/report identifiers and input snapshot, no authenticated account owner. |
| Paid reliability migrations / `paid_report_snapshots` | Order→report linkage, fulfillment status and snapshots; no account owner. |
| `report_share_links` / `paidReportLookupBoundary.ts` | Token authorizes reading/sharing, not proof of original purchase or authority to claim a report. |
| `DevTossCheckoutLauncher.tsx` | Existing shared local customer key is not account identity. Do not repurpose it for ownership. |
| `checkoutConsent.ts` | Six confirmations including minor representative when applicable. General policy checkbox maps to terms/privacy/refund assertions. Server payment validator unchanged. |
| `policyVersions.ts` | Terms `2026-06-14.1`, privacy `2026-09-22.1`; reused verbatim. Displayed effective dates are not rewritten as version IDs. |
| Marketing | No existing opt-in contract. No marketing checkbox, scope or automatic opt-in added. |

## Routes / session flow

| Operation | Public prepared path | Local test path |
|---|---|---|
| Screen | `/login`, `/account` | `/dev/account` |
| Initiation | POST `/auth/start` | POST `/dev/account/api/start` |
| Callback | GET `/auth/callback` | GET `/dev/account/api/callback` |
| Verified state / refresh | GET `/auth/session` | GET `/dev/account/api/session` |
| Required consent | POST `/auth/consent` | POST `/dev/account/api/consent` |
| Logout | POST `/auth/logout` | POST `/dev/account/api/logout` |

1. Same-origin POST + provider allowlist → official `signInWithOAuth`.
2. Supabase SSR PKCE verifier lives in HttpOnly cookies; Supabase owns provider OAuth state. Additional random 10-minute app flow cookie binds callback/return path.
3. Callback compares flow nonce/expiry, exchanges the one-time code, then calls `getUser`. Cookie `user`, localStorage, client role, email or supplied user ID never authorizes a write.
4. No current profile + required consent history → consent screen. Current profile/history → account shell. Old version/withdrawn required record → `needs_consent`, not a broken OAuth login.
5. Session refresh uses per-request SSR `getAll`/`setAll`; all rotated cookies reach the response. Auth JSON/redirects are private, no-store. No user data is statically rendered/cached.
6. Reload/focus/visibility/minute refresh reads the server. BroadcastChannel transmits only an invalidation hint; another tab cannot broadcast an authenticated identity.
7. Logout explicitly uses `scope: local`, revoking the current browser's refresh session and clearing cookies. Other tabs refresh to guest. This is not global-device logout: existing stolen access JWTs may survive until expiry under Supabase's standard semantics. Do not claim immediate global JWT revocation.

Kakao requests only `profile_nickname`; Google uses the provider's basic OIDC profile defaults. No contacts, friends, calendar or offline-access scopes. Provider email/avatar are not persisted in the new app profile. Missing display name becomes “회원”; displayed metadata is bounded cosmetic text only.

Implementation uses `@supabase/ssr` **0.9.0** with existing `supabase-js` **2.105.1**, both pinned. SSR 0.12.7 required a newer Supabase client; it was not retained and the existing client was not upgraded.

Official references checked during implementation: [SSR clients](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [Kakao](https://supabase.com/docs/guides/auth/social-login/auth-kakao), [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [redirect allowlists](https://supabase.com/docs/guides/auth/redirect-urls), [identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking), [logout semantics](https://supabase.com/docs/guides/auth/signout).

## Consent storage — prepared, NOT applied

Migration: `supabase/migrations/20261003094827_v4_account_foundation.sql`, created with the CLI migration-new command. No push/reset/migrate/remote SQL or advisor calls were made.

Repository hygiene: `.gitignore`, `AGENTS.md` and `supabase/.temp/` are excluded from staging. The CLI automatically refreshed the local `.temp/cli-latest` version-check cache (mtime observed); its pre-run content was not captured, so byte-for-byte preservation of that cache is not claimed. It was not reset/deleted or included in the commit. Existing linked-project metadata was not edited.

| Model | Contract |
|---|---|
| `account_profiles` | `auth.users.id` FK/PK, display name, provider, created/updated server timestamps. Created atomically only after required agreement. |
| `account_consent_events` | Append-only type/version/decision/required/source/server timestamp; monotonic ID defines latest event; `(user_id, request_id, consent_type)` uniqueness. |
| `record_account_consent` | SECURITY INVOKER, service-role-only execute, per-user transaction lock, exact-payload idempotent retry. Different retry payload rejected. |
| Required consent | Both terms and privacy, exact current canonical versions checked in the server handler; client cannot choose user ID or timestamp. |
| Reconsent | Append a new current-version record, never replace prior history. `needsRequiredReconsent()` uses newest decisions. |
| Optional / withdrawal | Schema can append a marketing decline/withdrawal with its own document version. No enabled marketing document/UI/endpoint exists in this phase. |
| Access | RLS; authenticated users may SELECT only their own rows; anon has no table access; clients cannot mutate or invoke persistence. Service-role events are SELECT/INSERT only, not UPDATE/DELETE. Explicit revokes also neutralize pre-existing default grants. |

OAuth may create an `auth.users` identity before consent; that identity is **not** an activated Gyeol profile. Auth metadata does not store the consent authority.

## Guest and member checkout

| Area | Guest / stale consent | Verified current member |
|---|---|---|
| General terms + privacy | Current full checkbox remains | Existing versioned account agreement reused |
| Refund policy checkbox | Included in policy agreement | Explicit “환불정책 동의” remains |
| Input accuracy | Required | Required |
| Immediate digital report generation | Required | Required |
| Withdrawal/refund restriction | Required | Required |
| Age 14+ / minor representative | Existing rules retained | Existing rules retained |
| Delivery/availability notices | Unchanged | Unchanged |

- Member presentation is prepared in the internal Book receipt only; actual public checkout remains unchanged/disabled behind its prior gate.
- Status changes remount purchase confirmations; a prior refund checkbox cannot silently become a new guest terms agreement.
- Local prepare revalidates current server consent when the UI claims inheritance. Spoofed/expired/stale member state is rejected. Existing payment assertion builder and validator are not weakened.
- Production member purchase activation still requires a purchase audit record linking the inherited account consent versions/event IDs to that specific order. This phase does not alter existing order persistence to add that linkage.
- Guest remains free to select→input→confirm→mock purchase→generate→read. Login is never required in that path. Prices remain 1,290원.

## Identity collision / future library boundary

- Same authenticated UUID on relogin is the same account. Different UUIDs stay different even if email/name match.
- Supabase may natively link verified identities according to its configured identity-linking policy. The application does no email-based merge, manual linking or report reassignment.
- Tests cover same provider, different providers, no email, no name, expired/forged session, callback errors/cancellation and duplicate consent.

Future library integration must separately establish:

1. Authenticated purchaser ownership at checkout, or a server-issued one-time claim capability bound to an already verified purchase and report.
2. Explicit owner link (unique order/report → `auth.users.id`), claim consumption/expiry/replay rules, own-row read policy and safe dispute/recovery behavior.
3. Payment/order ID, customer-supplied birth/name/email, provider email, paid read URL or publicly shareable token alone is **not** sufficient ownership proof.
4. Existing guest purchases stay readable by their original contracts. No automatic backfill or forced attachment.
5. Account deletion/withdrawal, abandoned unconsented OAuth identity retention, and purchase-record retention must be reviewed before activation. No speculative recovery warning or new library UI was added.

## Production configuration checklist — documentation only

- [ ] Approve account/legal/privacy wording before activation. Current privacy collection/purpose/retention lists are report-oriented; they do not explicitly define the new social-account identifiers/consent history lifecycle. This phase preserved all legal text and versions.
- [ ] Review signup age/guardian requirements and account withdrawal/retention policy; checkout age rules are unchanged, not a substitute for a signup review.
- [ ] Review and apply the migration through the separately authorized DB workflow; run Supabase advisors then. PGlite tests are not a remote Supabase configuration audit.
- [ ] Configure Kakao REST API client ID/secret and Google OAuth client ID/secret in Supabase provider settings. Do not put provider secrets in client bundles.
- [ ] Provider-console callback is `https://<project-ref>.supabase.co/auth/v1/callback` (not the application callback). Review provider consent screen and minimal scopes. Kakao email-unavailable handling must be enabled/verified if email is not required.
- [ ] Supabase site URL: approved canonical `https://gyeolreport.com`. Application callback path is `/auth/callback`; it carries only a random `flow` query. Allowlist the exact host/path with narrowly scoped query matching (`https://gyeolreport.com/auth/callback\?flow=*` under documented glob escaping), not arbitrary wildcard domains. Verify this redirect against a non-production provider project before launch.
- [ ] Existing variable **names only**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. No new env flag or secret value added/read out. Service-role value stays server-only.
- [ ] Review native identity linking, JWT/session lifetime, provider rate limits and optional abuse protection. Execute real provider acceptance in an explicitly authorized non-production environment.
- [ ] Bind member inherited-consent references at the actual purchase persistence boundary before deduplicating public checkout.
- [ ] Independently approve account gate and Book gate. Neither is activated by this commit or branch push.

## Verification and artifacts

- New auth tests: 54, including real SDK PKCE URL/cookie behavior, mocked refresh→`getUser`→verified-ID RPC→local logout, current/stale consent, CSRF/redirect/role/user-id spoofing, and member purchase-specific enforcement.
- Actual local PGlite SQL tests cover RLS with permissive default grants, private rows, invoker privileges, atomic/idempotent writes, reconsent history and optional withdrawal. No Production database accessed.
- Combined related regression: **163 files / 2,834 tests** (final rerun recorded in `/tmp/gyeol-v4-9b-final-tests.log`): account, payment/checkout, six-product delivery/full-share, read/access, legal, Book gate, V3/V4 hashes, saju/tables, Jie and compatibility directionality.
- Browser `scripts/verify-v4-account.mjs`: **59 checks PASS**, 390/430/768/1440; login, first consent, full legal detail, all/individual/indeterminate, account header, reload, repeat login, provider separation, multi-tab logout, member/guest receipt, cancellation and guest escape. Overflow/hydration/console errors 0. Actual local adapter only; no external provider traffic.
- Local production-mode browser: existing V3 home; `/login`, `/account`, `/auth/session?enabled=true`, `/dev/account`, `/dev/account/api/session` all 404. Not a deployment.
- Lint/build/diff-check PASS. TypeScript matched baseline **390 → 390**, zero new source diagnostics. The existing generated `/report/new` named-export diagnostic can name `getAnnualFortuneYearOptions` or `getAsiaSeoulCurrentYear` depending on union order; the source file is unchanged. Baseline is not a clean TypeScript check.
- Screenshots `/tmp/gyeol-v4-9b/`: `{390,430,768,1440}-{login,consent,account,member-receipt,guest-receipt}.png`, `390-consent-detail.png`, `390-member-header.png`, `390-logout.png`, `390-error.png`; `browser-checks.json` contains the assertion list.

## Remaining blockers / next boundary

No known local implementation/visual blocker. Actual provider redirects, real Supabase Auth/RLS installation and legal approval remain **unverified activation blockers**, intentionally outside this phase. No Production provider/env/DB configuration, migration, payment/OpenAI call, public V4 activation, master merge/push or deployment was performed. Stop here; library/tickets/coupon/referral are not started.
