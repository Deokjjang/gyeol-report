# Phase 9C — Personal report library

- Branch: `v4/rebuild`; base: `ffff79056324f701acd23bd6928701c1455f62bb`.
- Scope: ownership contract, prepared migration, closed-gate endpoints, local Book/library UI.
- Account / public Book gates remain literal `false`. No Production OAuth, migration, environment change, payment, OpenAI call, master merge or deployment.

## 1. Existing ownership audit

| Question | Verified source / conclusion |
|---|---|
| Existing owner column? | `payment_orders`, `paid_report_snapshots` have no account owner. Phase 9B `account_profiles` / consent history contain no reports. |
| Order/report identity? | `payment_order_id` → snapshot `order_id` (unique) → `report_id`. Provider order/payment IDs belong to payment confirmation, not to account authorization. |
| Safe logged-in binding? | After ready-order persistence, before returning checkout, `createAccountPort.currentUser()` uses server `auth.getUser`; current required consent must be satisfied. Request userId/ownerId/email is not used. |
| Existing guest proof? | Direct report URLs and `report_share_links.token` confer reading, not purchasing identity. No suitable existing claim proof was found. Neither is promoted to ownership. |
| Migration? | Required: additive purchase binding + primary ownership tables, no auth metadata lists or legacy backfill. |
| Publication / expiry? | `runPaidReportJob` validates before `finish_job`; `scripts/paid_report_publish_expiry_patch.sql` preserves first valid `published_at` and its 2160-hour deadline. `readPublishedReport` validates saved snapshots without regeneration. |
| Deleted/refunded/revoked? | Claim checks current paid order, `deleted_at`, report publication/status/expiry, binding and owner revocation. Share revocation remains separate from ownership revocation. |

The expiry contract is in the existing reviewed SQL patch, not just migration 0013. The new migration refuses to install without the validated `paid_report_snapshots_access_expiry_check` prerequisite. It does not apply or rewrite that patch.

## 2. Ownership model / migration

`supabase/migrations/20261003104500_v4_report_library.sql` was named by `supabase migration new` in an isolated `/tmp` workspace, then prepared in this repository. **Not applied to Production.**

| Table | Meaning | Constraints |
|---|---|---|
| `report_purchase_bindings` | Server-verified purchaser OR random guest capability hash; minimal display metadata | Order PK/FK, buyer auth.users FK, unique SHA256, seven-day proof expiry, revocation; no token plaintext |
| `report_account_links` | One primary account owner after valid publication | Report PK/FK, user auth.users FK, source, link timestamp, original report version, revocation |

- RLS on both tables. No anon/authenticated grants or own-row policies; the browser never queries these tables directly.
- Server-only invoker RPCs and explicit minimal service grants; no new security-definer function. Service role's bypass remains confined to server code.
- New tables' broad default grants are explicitly revoked first. Indexes cover user library and buyer FK lookup; order/report uniqueness prevents duplicates.
- Auth user deletion is restricted while links exist: account deletion/reassignment is a separately reviewed future contract, not silent ownership movement.
- Source/security reference: [Supabase RLS and grants](https://supabase.com/docs/guides/database/postgres/row-level-security). Local SQL tests also exercise permissive initial default grants.

## 3. Logged-in purchase → first publish

1. Existing canonical input, purchase assertions and 1,290원 catalog validation remain.
2. `bindCheckout` independently verifies the current account. Binding failure prevents checkout payload delivery; it does not start a payment.
3. The payment provider/worker/calculation/narrative remain unchanged.
4. `report_library_first_publish` runs inside the valid publication transaction. It requires paid, undeleted, matching report/product, gate, publication timestamp and future expiry.
5. Only then is the account link inserted. Pending/failed/invalid reports have no library item. Repeated publishing/confirming cannot change its owner or version.

The production prepare hook is behind the closed account gate. With it OFF there are no additional auth/ownership DB calls. Existing unbound orders are a trigger no-op.

## 4. Guest → account claim

- Guest purchase still requires no login. On the first-party checkout response, the server issues 32 random bytes (256 bits).
- Production cookie: `__Host-gyeol-claim-{order digest}`, Secure, HttpOnly, SameSite=Lax, Path=/, no Domain. Local mock has a separate non-Secure name for loopback HTTP.
- Cookie contains the capability; SQL stores only SHA256. It is never in JSON, RSC props, report/share URLs, localStorage or logs.
- **Claim window: seven days from checkout binding, and never after the report's existing expiry.** This is a capability policy, not another report retention clock.
- Cookies are per order; buying another book does not overwrite the first proof. The server resolves report → order, then verifies that order's cookie.
- Last-page action → login → PKCE callback → required consent if necessary → exact original report → explicit save POST.
- Safe return allows only canonical site paths and validated direct-report paths, no `/r`, external origin, arbitrary query or traversal. The first-consent return is HttpOnly, ten minutes, allowlisted again and cleared on consent/logout.
- Same account repeats succeed; another account is rejected. Provider change with the same authenticated UUID preserves identity. Email never merges/transfers ownership.
- Losing the purchasing browser/cookie, waiting seven days, or an old purchase without this capability means self-service claim is unavailable. Existing guest reading/sharing remains available. No invented account recovery or legacy proof issuance.

## 5. Sharing vs ownership

| Permission | Direct purchased report | Shared `/r/{token}` |
|---|---|---|
| Read while valid | Existing contract | Existing share contract |
| Save to library | Only verified owner or private purchasing-browser proof | Never from share token |
| Save CTA | Only when server reports claimable; hidden for current owner | Not mounted |

No sharing table, token issuer, share SDK or ACL was changed. Passing the original direct URL to somebody also does not pass the HttpOnly proof. The read URL/report ID alone cannot claim.

## 6. Library query / UI

- Server session → `list_account_reports(verified user UUID)` → metadata only.
- Returned projection: reportId, productType, canonical title, cover color/ink, displayName, selectedYear, publishedAt, expiresAt, status, original reportVersion, existing access URL.
- Query does **not** fetch `snapshot_json`, birth information, MBTI, payment keys or full report text. IDs/proof hashes for accounts/orders do not enter the client response.
- All session/library/status/claim responses are private no-store; mutation requires exact Origin and bounded body. Extra client authority/proof fields are rejected.
- Book shelf: two columns at 390/430, three at 768/1440; real links, readable titles and dates, visible focus; no SaaS cards. Empty shelf, account name and logout only.
- Focus/session broadcast invalidates old list while refetching. Logout unmounts the shelf; B cannot see A's list.
- Direct Book back cover retains the three share actions and adds the optional save action before END OF BOOK. Shared renderers receive no save action.

## 7. Ninety-day retention

- Durable library uses existing `paid_report_snapshots.published_at/expires_at`; saving never extends or restarts them.
- Display: issuance date and `YYYY. MM. DD.까지 열람 가능`. No permanent/lifetime ownership wording.
- Expired entries remain as minimal non-personal title/version/date metadata, disabled and explicitly labelled `열람기간이 끝난 책`; input names are omitted immediately at query time.
- Existing expiry worker nulls report content. Trigger cleanup also erases binding name/hash, including abandoned orders when their input snapshot is purged. No new cron/deadline.
- For local end-to-end QA only, the already-existing `paidProductReportFulfillment` expiry arithmetic is exposed as `publishedReportExpiresAt` and reused unchanged. The local one-hour process-cache TTL is **not** displayed as a customer expiry. Local mock books still disappear when the server restarts; they are not durable purchases.

## 8. V3 / V4 and concurrency

- SQL saves snapshot `productVersion`, not a request-supplied desired version. V3 saved text is never regenerated/upgraded; its existing report route/renderer remains.
- V4 local stored packets render with the Book adapter. Production V4 activation remains OFF.
- Report-row lock → binding-row lock → report primary-key insert. Conflicting claims converge on one owner; `ON CONFLICT DO NOTHING` cannot transfer ownership.
- Same-user retries, competing users, publish/claim overlap, failed publish, expired/revoked/deleted/refunded inputs are tested.
- PGlite tests run real SQL with competing Promise requests; they are **not** a multi-connection/replica load test. A real staging Postgres concurrency/advisor run remains an activation prerequisite.

## 9. Local fixtures / visual verification

Automated actual-runtime fixture ownership:

| Account | Books |
|---|---|
| A | Comprehensive, Love, Annual; later claims Guest Major |
| B | Career |
| Guest | Major before claim |
| Share-only viewer | Compatibility reading never grants ownership |

Browser path `/dev/account` uses existing local OAuth ports (Kakao=A, Google=B), no external login. Six runtime-generated books are used for the final shelf, not fabricated body text.

- 390 / 430 / 768 / 1440: empty, one book, six books, long names, expired appearance, open book, logout, guest save/login/return/claim.
- `/dev/account/library-preview` is explicitly metadata-only visual boundary QA, not an authentication shortcut. Actual expiry enforcement is separately tested against SQL.
- Visual fixes found by looking at screenshots: keep Korean title words together; move save action inside the back-cover page above END; small cover imprint ≥10px.
- Evidence folder: `/tmp/gyeol-v4-9c/`; browser results list every assertion and generated URL. Key images: `390-six-books.png`, `390-guest-save.png`, `390-empty.png`, `390-expired-detail.png`, `1440-six-books.png`.

Reproduce after starting a fresh loopback dev server:

```sh
LIBRARY_REVIEW_EXPORT=/tmp/gyeol-v4-9c pnpm test tests/unit/account/library.test.tsx
BOOK_FLOW_EXPORT=/tmp/gyeol-v4-9a pnpm test tests/unit/app/bookPublicFlow.test.tsx
BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-library.mjs
```

## 10. Validation / activation boundary

Final validation on the Phase 9C working tree:

| Check | Result |
|---|---|
| Related auth / library / payment / sharing / report / persistence / V4 / component / Book regressions | **259 test files, 4,200 PASS, 0 FAIL** |
| Local browser end-to-end | **66 PASS**; 390 / 430 / 768 / 1440, overflow 0, console / hydration errors 0, only loopback requests |
| `pnpm lint` / `pnpm build` / `git diff --check` | **PASS** |
| TypeScript baseline comparison | **390 before → 390 after; new diagnostics 0**. Existing debt remains; this is not a clean full typecheck. |
| Public activation | Account / Book gates unchanged and OFF; no Production DB / OAuth / payment / environment changes |

Local logs and screenshots are under `/tmp/gyeol-v4-9c*`; `browser-results.json` records all 66 assertions. The final browser run also verifies the stored 90-day publication deadline rather than the local cache TTL.

Before any later Production activation, separately approve:

- Existing auth, first-publication/expiry patch and new migration review/application; staging RLS/advisor/parallel-connection verification.
- Production provider/redirect/session setup and member legal/copy audit from 9B.
- Guest seven-day proof/cookie-loss support policy; legacy claim/recovery remains intentionally unimplemented without private proof.
- Public account/Book gate activation, V3/V4 renderer routing and real checkout/provider staging verification. No real payments were run here.
- Future account deletion/ownership revocation administration and monitoring. No email-based automatic merge.

Future pass/credit functionality may attach a separately authorized entitlement source at the publication boundary; this Phase neither creates a balance nor accepts new `link_source` values for gifts/referrals.

No Phase beyond 9C is started.
