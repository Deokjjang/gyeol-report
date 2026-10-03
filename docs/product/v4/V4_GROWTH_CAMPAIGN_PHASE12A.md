# V4 Phase 12A — Growth campaign acquisition

Verified 2026-10-04 KST. **Prepared only; not activated.**

- Branch: `v4/rebuild`.
- Actual fetched starting HEAD and `origin/v4/rebuild`: **`8f6028f82692f50d6cb61f4b6313c75bac7d43c6`**, `feat: add friend referral rewards`.
- Did not reset to the older Phase11A base. `.gitignore`, `AGENTS.md`, `supabase/.temp/` preserved/excluded.
- Book/Auth public gates remain `false`; no master, Production, remote migration, real OAuth/payment/OpenAI/Meta call, audience upload, env change or deployment.

## 1. Existing contracts / integration map

| Existing owner | Reuse in 12A |
| --- | --- |
| `account/handler`, policy, verified OAuth adapter | Callback identity, safe destinations, current required consent; acquisition decorator only |
| `library` / `report_account_links` | Actual owner, existing book list and purchase binding |
| Phase10A `report_tickets` | Only ticket grant/balance/redemption authority |
| Phase10B `report_coupons` | Private coupon grant, quote, restrictions, reserve, payment confirmation, redemption |
| `book/storedReport`, V4 runtime | Exact persisted snapshot/completeness; no content or calculation edits |
| Existing share port / Phase11A | Same read tokens, full-book projection, Kakao/native/copy controls |
| Phase11B | Same inviter eligibility, source validation, B reward, first valid publish and A reward |
| Existing analytics | MetaPixel/PurchaseTracker unchanged; no pre-existing general UTM/fbclid acquisition policy found |

The only new authority is **which acquisition context owns eligibility**. No new balance, monetary ledger or coupon engine.

## 2. Campaign definition

`growth_campaigns`: public slug, internal name, public message, status, nullable start/end, channel, offer type, ticket quantity OR existing coupon definition FK, new-user-only, context lifetime, operator-approved UTM tokens, timestamps.

| Field/policy | Truth |
| --- | --- |
| Status | DRAFT / SCHEDULED / ACTIVE / PAUSED / ENDED |
| Availability | Server clock, status, starts/ends, valid referenced offer; scheduled becomes eligible only after its start |
| Offer | NONE / REPORT_TICKET / COUPON; DB check prohibits ticket + coupon |
| Ticket quantity | Configured server-side; existing ledger technical bounds reused, not a business campaign cap |
| Coupon | Reference only; no duplicated discount formula/value truth in campaign table |
| Public URL | `/campaign/{publicSlug}`; gate OFF returns not-found before database access |
| Dev | `/dev/campaign/{publicSlug}`, loopback/dev-only; explicit POST `/dev/campaign/setup` seeds test definitions |

The 1-ticket and private 300-KRW/7-day coupon definitions are **local fixtures**, not decided operating policy. No Production seed in migration. DRAFT is not presented; paused/ended/future pages offer a normal product link without a benefit CTA. Dates use server absolute timestamps and KST; no countdown, fake stock or urgency.

## 3. Attribution lifecycle

`campaign_attributions`: campaign FK, unique opaque context hash, nullable unique user FK, acquired/context-expiry/attributed/benefit timestamps, existing ticket OR coupon grant FK, minimal source metadata, generation-start/first-publish/share timestamps and unique first-report FK.

`CONTEXT → ATTRIBUTED → BENEFIT_GRANTED` (NONE stops at ATTRIBUTED). INELIGIBLE is reserved; rejected requests currently leave an unawarded context rather than creating a second eligibility history.

Context is created only by CTA, not every page view. Source metadata has a SQL key allowlist. Grant IDs are references to original ledgers, not a second ledger. Expired/invalid claims do not receive an attribution-family slot or benefit. Already granted tickets/coupons are never revoked just because the campaign later ends.

## 4. Server new-user definition

- Database `auth.users.created_at >= acquired_at`, never future-dated.
- Verified identity and existing current required consent versions; no client `isNew`/eligibility flag.
- Reject prior profile/consent predating context, any previous ownership, ticket grant/redemption, coupon grant/redemption, or successful bound purchase (including historical paid state).
- Reject another account's bound context and any previous immutable acquisition attribution.
- Existing signed-in member gets normal book selection; anonymous existing users still fail eligibility after OAuth.
- Account deletion/provider-linking/multiple-human-identities are not inferred; these remain pre-activation abuse-policy work.

## 5. Referral versus campaign precedence

`new_user_acquisitions` is a unique **identity junction**, with exactly one campaign attribution OR referral attribution FK, no amounts/balances. Existing Phase11B attributions are backfilled first. A trigger reserves the same family when the unchanged 11B SQL inserts an attribution. Junction update/delete is prohibited.

The account decorator sorts the **provided, server-recorded, currently valid** campaign/referral contexts by acquisition time and attempts the first fully eligible one. Referral still validates the actual source snapshot before attribution. Invalid context can fall through to the other valid context.

Once committed, attribution is immutable. For truly concurrent different-tab contexts not simultaneously supplied to one request, the first valid transaction to commit wins; this is not a claim of global earliest click across unknown browsers. A tie in one request has stable kind ordering. Existing confirmed referral always wins over a later campaign, and the original inviter still qualifies for A's reward.

## 6. Multiple campaign policy

First still-valid server context cookie wins; another campaign does not replace it or extend its TTL. Forged/expired/unavailable unbound context can be replaced. After OAuth binding and final attribution, another campaign cannot change the source or add a benefit. A NONE acquisition also occupies the family: it is not an invitation to stack a second acquisition later.

## 7. Ticket offer

Atomic attribute + `report_tickets('grant')`, existing `source_type=promotion`, stable source/key `campaign:{attributionId}`, configured quantity. Duplicate callback, consent, attribution and recovery do not add tickets. The existing ticket reservation/publication/reversal flow is untouched. No fixture grant endpoint is used in browser acquisition tests.

## 8. Coupon offer

Existing private, member-only, code-null coupon definition. `report_coupons('grant')`, source `campaign`, stable `acquisition:{attributionId}`. Definition lifetime, member-only and active state are checked. Before commit, existing 10B **quote** must accept at least one current purchasable server-catalog product. This preserves product scope, minimum order/payment, expiry and usage restrictions without reimplementing discount math. Unusable quote rolls back attribution/junction/grant together.

The quote is eligibility validation, **not a future usage-slot reservation**. Actual checkout rechecks current policy and reserves through 10B; a coupon can later expire or exhaust its normal usage limit. Base price remains 1,290 KRW. Coupon fixture quote is 990 KRW; no server catalog/Toss contract changed. Ticket/coupon simultaneous use remains prohibited.

## 9. OAuth transport and safe navigation

- Fresh 32-byte context secret; only SHA-256 stored. Public slug is not a secret.
- Public `__Host-gyeol-campaign`: Secure, HttpOnly, SameSite=Lax, path `/`. Separate dev cookie.
- Max ten-minute context transport window, matching existing OAuth; not a campaign/benefit lifetime.
- Cookie survives verified OAuth return and current first-login consent. First bind ties it to that actual identity; consent/retry grants atomically.
- CTA accepts only slug + UTM. No caller amount, coupon definition ID, returnTo, user ID, reward or quantity.
- Fixed allowlisted login/home destinations. No localStorage eligibility source.

## 10. Conversion and recovery

| Stage | Durable / UI evidence |
| --- | --- |
| Landing / CTA / signup start | Local-only browser event contract; not a reward |
| Attribution / consent / benefit | Atomic SQL attribution plus original consent/grant records |
| Generation requested | Actual paid/ticket snapshot creation joined to its owner/payment binding; not conversion |
| First valid publication | Existing `referral_publication` + `validateBookPublication` exact persisted JSON; published timestamp and owner attachment after attribution |
| Share created | Existing `report_share_links` insert, joined to actual owner |

`reconcileCampaigns` validates durable candidates, skips invalid ones, compares the exact snapshot again in SQL and records only first valid report. Partial/corrupt/failed/unowned snapshots never convert. Post-commit paid observer leaves original payment/publish responses unchanged; ticket wrapper and summary/library visits recover missed updates. No cron or new public grant/publish endpoint. Six real generators remain unchanged.

## 11. Book → Share → Referral loop

Closed the documented 11B ticket-source sharing gap: existing share port can read an actual owned, complete, unexpired **ticket** publication through the same publication authority, in addition to ordinary paid sources. Read token and share revocation checks remain unchanged; a read token never establishes ownership. Public fallback is behind the existing Book gate. `book-local-*` is accepted only in dev/test, not Production.

Local coupon/share/referral/ticket adapters now use the same existing PGlite database, reflecting the single real database contract; no parallel balances. Library merging deduplicates by report ID.

Browser proof: campaign B receives one ticket → real Comprehensive book → existing share/copy/referral credential → C follows referral, then also visits coupon campaign → referral attribution retained, C gets one ticket and no campaign benefit → real Career book → B gets exactly one inviter ticket. No campaign/UTM identity leaks into the share URL.

## 12. Analytics contract

| Internal event | Source |
| --- | --- |
| campaign_landing_opened | One local mount event ID |
| campaign_cta_clicked | Button in-flight guard, fresh intent ID |
| campaign_signup_started | Same intent ID after server capture/login destination |
| campaign_attributed | SQL attributed_at |
| campaign_benefit_granted | SQL benefit_granted_at |
| campaign_generation_started | SQL generation_started_at |
| campaign_report_published | SQL published_at |
| campaign_share_created | SQL share_created_at |

Server-only `funnel` projects the five durable stages into event/name/opaque stable eventId/public slug/occurredAt. Re-reading does not create event rows or duplicate IDs. Browser dedupe key is event + intent/view ID; server IDs derive from attribution + stage. Analytics cannot grant anything.

Existing seven `REFERRAL_EVENTS` remain intact. No second event truth ledger and no external transport added. Pixel/CAPI delivery/retry mapping is deferred; **this is not live ad conversion reporting**.

## 13. UTM / Meta-ready boundary

Only `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`. Short ASCII tokens, no 6-digit sequences, and **must match campaign operator-approved tokens** before persistence. Unknown query keys, raw URL dump, name/email/birth input and fbclid are not retained. Server campaign identity determines benefit; UTM never does. New landing uses no-referrer metadata. No Meta API, audience, Pixel/CAPI settings or spend.

## 14. Security / RLS

All three tables enable RLS and revoke anon/authenticated privileges. No client policies. Service-only invoker functions, empty search path, explicit schema references; no SECURITY DEFINER. Service role gets only needed select/insert/update or immutable select/insert rights. Client cannot activate campaigns, set owner/eligibility, write grant timestamps or invoke grant functions.

Public DTO includes only public slug/message/state/deadlines and truthful offer conditions; no internal IDs/keys/user IDs. Same-origin POST; strict body fields; server catalog values only. Reviewed with existing Supabase SSR/RLS and Postgres least-privilege/lock-order guidance; no remote schema/secret inspection.

## 15. Privacy

Internal auth UUID only for ownership; attribution does not store email/name/date of birth/MBTI/raw OAuth profile/report input or prose. Conversion validates stored reports in existing report storage, not copies into analytics. External transport absent; local event payload and internal funnel projection omit PII. Retention/erasure for expired contexts, account deletion and derived attribution IDs must be reviewed before activation.

## 16. Concurrency / idempotency

User advisory lock shared with 11B → existing coupon actor lock → campaign row → context/attribution row → one existing benefit ledger. Coupon actor lock is taken before the campaign lock to preserve 10B ordering. Recheck expiry/binding after row lock. Unique user junction, context hash, user attribution, grant references and original grant keys reinforce application retries.

Tests use concurrent Promise.all callback/consent/claim/recovery and competing contexts, including direct legacy referral attribution. PGlite serializes one connection: **real multi-connection PostgreSQL contention/crash testing remains a staging prerequisite**, not claimed complete here.

## 17. Abuse controls

Verified auth age, current consent, prior-activity exclusion, opaque expiring bound context, immutable first acquisition, source validation, one primary benefit, strict input keys, server status/window and SQL uniqueness. Replays/other account context cannot add credit. No IP/fingerprint tracking. No benefit given merely for clicking/starting generation. Refund/fraud clawback policy was not invented.

## 18. Operating decisions still required

- Total/per-campaign grant cap and budget guard; no invented 100-person/day limit.
- Rate limits, multi-account/provider-link/self-abuse handling and operational alerts.
- Coupon usage-slot expectations, invalid campaign configuration review, paused/expired-after-OAuth messaging.
- Retention/deletion/appeals/clawback policy and reviewed consent/marketing copy.
- Durable background recovery cadence, bounded scanning and analytics transport/retry.
- Local SQL helper NFT tracing before production packaging: build passes but warning count is **7**, versus 4 documented in 11B; three added dev campaign entry points trace the same existing `tickets/localDatabase` dependency. Not represented as zero new warnings.

## 19. Migration and verification

Prepared only: `supabase/migrations/20261003154955_v4_growth_campaign_acquisition.sql`. Exercised against isolated PGlite only. After existing paid schema, share links, 9B accounts, 9C ownership, 10A tickets, 10B coupons and 11B referrals. Existing referral records are backfilled before the family trigger. No remote apply.

| Check | Result |
| --- | --- |
| New acquisition SQL/service suite | 19 PASS, including both offer types, concurrent retries, coupon rollback, family races, immutable referrals, six products, full loop and RLS |
| Entire current suite | **5,911 PASS / 0 FAIL**, 430 files; includes Auth/consent/library/coupon/payment/V3/V4/runtime/share/referral regressions |
| Content completeness | Six real V4 ticket publications; Major 14/14; Annual 12/12; Compatibility two directions; existing hashes/regressions pass |
| Browser ticket loop | **88 PASS** |
| Browser coupon acquisition | **62 PASS**; existing quote → mock provider → actual paid worker → owned book |
| Responsive | 390 / 430 / 768 / 1440, landing/benefit/receipt/book/share/existing/ended; no horizontal overflow or hydration/console errors observed |
| lint / build / diff-check | PASS; build warnings described above |
| TypeScript | Base **390**, current **390**, new locations/codes **0**; full tsc remains non-clean baseline |
| Production boundary | Public gates OFF; no real provider/ad/remote DB actions |

Commands:

```sh
CAMPAIGN_REVIEW_EXPORT=/tmp/gyeol-v4-12a pnpm exec vitest run tests/unit/account/campaigns.test.ts
pnpm test
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm build
git diff --check
```

Browser: fresh loopback dev server on 3192 **per mode**, then `BOOK_BROWSER_BIN=<agent-browser path> node scripts/verify-v4-campaigns.mjs ticket` / `coupon`. Server restart discards local database/provider identities. Explicit setup route only seeds definitions, never user rewards. Initial browser resize-click timing issue was corrected in the verification harness by waiting for layout frames and scrolling target into view; actual CTA path verified independently.

Artifacts (not committed):

- `/tmp/gyeol-v4-12a/ticket/browser-results.json`, `/tmp/gyeol-v4-12a/coupon/browser-results.json`
- `/tmp/gyeol-v4-12a/{ticket,coupon}/{390,430,768,1440}-{landing,benefit,existing-member,ended}.png`
- ticket `owner-share`, `referral-wins`, `B-created`, `C-created`, `loop-complete`; coupon `coupon-receipt`, `coupon-book`; 390 login/consent/receipt captures.
- `/tmp/gyeol-12a-{target,full-tests,lint,build,tsc-baseline,tsc-current,browser-ticket,browser-coupon}.log`

## 20. Next Growth stage — not started

Approve operating caps/abuse/retention, verify independent DB connections and production packaging, review public copy and real provider identity clocks, then separately authorize migration/gate/analytics activation. Meta Pixel/CAPI mapping, campaign setup/ad spend, audience upload and Production deployment require their own approval. No bundle, milestone, referral-policy rewrite or narrative change in 12A.
