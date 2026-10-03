# V4 Phase 12B — Growth UX and measurement

Prepared, local verification only. Start `6de84578d541932be6f24b7954989aa273af115a`, branch `v4/rebuild`; fetched origin matched. Book/Auth gates remain **OFF**. No master, deployment, real OAuth/payment/Meta/OpenAI, advertising, remote migration, env or price changes. Protected dirty `.gitignore`, `AGENTS.md`, `supabase/.temp/` excluded.

## 1. Existing implementation audit

| Source at base | Finding / disposition |
| --- | --- |
| `components/analytics/MetaPixel`, root layout | Existing loader + numeric `NEXT_PUBLIC_META_PIXEL_ID`; preserved source, no value inspected/changed. Initial inline PageView plus pathname effect consolidated into one effect/dispatcher. |
| `app/report/new/page` | V3 ViewContent direct fbq, hardcoded catalog amount, dropped when SDK late. Replaced only tracking block with canonical product-entry event. |
| `payment/DevTossCheckoutLauncher` | InitiateCheckout was pay-button click. Now completed-input receipt mount; submit/consent/payment behavior unchanged. |
| `MetaPurchaseTracker`, `reports/[reportId]` | Query `purchase=1`, catalog price, report-localStorage only. Could race tabs, misprice coupon, miss paid delivery failures. Now server order claim, actual amount, stable eventID; processing state also mounts tracker. |
| `payments/toss/success` | Server confirmation already authoritative; unchanged. Legacy purchase query remains a compatibility hint, not evidence. |
| Server CAPI | No implementation found. None introduced. |
| fbclid/fbp/fbc | No application capture/persistence found. No new copy/collection. SDK-managed cookies require legal audit. |
| 12A campaign events | Old prefixed names normalized; no parallel emissions of generation/publish/share aliases. SQL 12A legacy funnel remains readable but is not combined with new facts. |
| Book share events | Existing fine-grained action hooks retained; share-created triggers a refresh of committed share truth, not client conversion. |
| Consent/privacy | Existing required account/purchase agreements are not advertising consent. No tracking-consent UI/gate or explicit Meta disclosure found in repository policy. No invented cookie banner/legal copy. |

No CAPI credential, Pixel settings, audience/customer-list API or Meta admin screen accessed. Meta public documentation endpoints returned 429/login walls; live vendor delivery/dedup is **not verified**. Deployment-time vendor-contract verification remains required.

## 2. One canonical layer for V3 and V4

`analytics/events`: names, strict interaction allowlist, Meta product/Purchase payload projection, unique-event count.

`analytics/client`: interaction dispatcher, pathname boundary, delayed-SDK queue, local capture adapter. Existing Meta components use it; product components no longer call fbq. V4 adds only effect/action hooks.

`analytics/server` + prepared SQL: existing order, account, consent, ticket, publication, share, campaign and referral sources. No second balance, attribution or generic analytics ledger.

`analytics/localReview` + `/dev/measurement`: loopback/development-only, bounded process-local interaction collector and read-only facts projection. Restart discards interaction observations. Public ingestion/admin dashboard is deliberately **not** activated or invented. Source facts can be recomputed; local observation counts are not a Production lifetime metric.

## 3. Canonical funnel and authority

| Browser observation | Exact boundary |
| --- | --- |
| campaign_landing_opened / campaign_cta_clicked | Landing effect / primary CTA, including normal product CTA for ineligible users |
| book_selected | Manual arrow/swipe/key/side book selection only |
| book_viewed | Actual product input route effect; not cover rotation/centering |
| input_started / input_completed | First edit or next action / validated final step |
| signup_started | Actual OAuth start action; no user identity in event |
| checkout_started | Actual receipt mount, including ticket-capable receipt |
| coupon_applied | Successful existing server quote response, no code/grant ID |
| ticket_selected | Explicit ticket radio selection; not a redemption fact |
| report_opened | Book reader mount (shared referral readers classified separately) |
| referral_landing_opened / referral_cta_clicked | Valid referral reader / its CTA |

| Server fact | Existing authority / identity |
| --- | --- |
| account_created | Verified auth user creation, one per account |
| required_consent_completed | Committed required terms + privacy records; first complete consent fact |
| campaign_attributed / campaign_benefit_granted | 12A immutable attribution / actual grant timestamp |
| payment_succeeded | Verified payment order, paid_at/provider payment ID/positive KRW amount; order identity |
| ticket_redeemed | Existing redemption, excluding reversed redemption |
| publishing_started | Ticket running redemption or paid worker's first attempt; queued payment alone is not generation |
| report_published | Persisted completed/gated snapshot revalidated by existing full validator |
| share_created | First committed share per report, valid source snapshot; repeat token issuance is not another conversion |
| referral_link_created | First invite per source report |
| referral_attributed / referral_referred_ticket_granted / referral_qualified / referral_inviter_ticket_granted | Existing 11B attribution/grants/first valid publication; no policy rewrite |

Client endpoint cannot submit any server-fact event or amount. Server returns explicit safe fields, not the raw row or snapshot. JSONB must not recursively strip nulls from a snapshot before its exact validator; test protects all six real products.

## 4. Meta mapping / navigation

| Meta | Source / policy |
| --- | --- |
| PageView | Initial pathname + actual path change/back/forward; duplicate render/Strict Mode suppressed. Query/hash-only input steps are not page views. Full document reload is a new page view. |
| ViewContent | Deliberate product entry. `book_selected`, automatic rotation and side-to-center alone emit none. Catalog product ID/value, no personal title. |
| InitiateCheckout | Validated receipt entry; not input start or pay click. One per tab journey/product. Free-ticket choice can occur later; this event does not imply a sale. |
| Purchase | Server-issued paid order fact only; actual charged amount, KRW, one item, stable `eventID`. No free/ticket/zero-value Purchase. |

No custom Meta campaign/free conversion events. `payment_succeeded → Purchase` is a mapping, not a second internal business fact. PageView vendor params empty; product params only content_ids/content_type/value/currency/num_items. Stable eventID is an opaque digest of the order, never the raw order/report URL.

Production dispatcher restricts to the canonical hostname. Existing SDK/config source retained. Development localhost captures events and never loads the Meta SDK, even if an ID exists. Captures: `gyeol:measurement` CustomEvent and bounded sessionStorage diagnostic list. No real vendor calls in QA.

## 5. Purchase authority / dedup / failure semantics

`claim_meta_purchase(report capability)` reads existing `payment_orders`: status paid, paid timestamp, provider payment ID, Toss, positive amount, KRW, no deletion/refund/cancellation. Client cannot supply product, amount, status or eventID. No publication-success prerequisite: paid-but-failed delivery remains a Purchase.

`meta_purchase_dispatches` has one immutable order PK, unique event ID and issuance timestamp. `INSERT … ON CONFLICT DO NOTHING` gives at-most-one browser handoff across callbacks, refresh/back, tabs, lost localStorage and process instances. Existing share token is not accepted; the ordinary private report bearer URL remains the guest access model. Only service role can claim/read; anon/authenticated cannot call the function or read the table. Public POST is same-origin and strict-field/size checked.

Migration also writes suppression receipts for already-paid historical orders. Reopening a V3 report must not replay its old conversion. These receipts explicitly do **not** assert past Meta delivery, and historical internal payment facts remain intact. A coordinated cutover must cover orders paid between the migration and old-tracker retirement; concurrent old/new application traffic is not automatically certified by local tests.

**Trade-off:** this is at-most-once dispatch, not exactly-once delivery to Meta. Claim only after fbq/test transport is ready. Crash, blocked vendor network, or lost claim response after SQL commit may lose the browser conversion; it is not automatically resent. Internal paid fact remains correct. Reliable server delivery/CAPI with same eventID and audited consent is a later explicit decision. No false claim of live Meta receipt/dedup testing.

Order fact ID is stable and reused by internal purchase projection. Coupon test proves 1,290 − 300 = **990 KRW**; original/discount amounts remain in the existing coupon/order ledger. Ticket report_id resolves to no paid order and never produces Purchase. The older standalone in-memory Book mock does not simulate a verified provider order and is not promoted into a sale; verified mocked coupon checkout exercises the actual confirmation/worker path.

## 6. Campaign presentation and countdown

| State | Presentation / action |
| --- | --- |
| SCHEDULED | Start date, not yet available; normal Book CTA |
| ACTIVE_ELIGIBLE | Server config benefit and conditional new-user copy; capture → existing auth flow |
| ACTIVE_INELIGIBLE | No new-user offer promise; normal Book CTA |
| BENEFIT_ALREADY_GRANTED | Already received, use existing benefit; no new grant; account link |
| PAUSED | No benefit claim, product remains accessible |
| ENDED | Offer ended, product remains accessible |

New verified identity bound before consent can resume consent; an anonymous visitor is only a **potential** new user until 12A authority checks complete. Already granted benefits are not revoked by campaign expiry. DRAFT/unknown slugs remain non-public; scheduled/paused/ended valid campaigns are not broken 404 pages.

Server projection reuses `growth_campaign('presentation')`, coupon definition and availability. Ticket quantity is configured, coupon discount/minimum/cap/products/expiry are actual definition data. No client reward calculation or fake book count. Product-colored book row precedes small offer block and the single “내 책 만들기” CTA. No coupon-mall cards or flashing urgency.

Absolute server `ends_at` minus server time and monotonic elapsed time; customer Date.now is not authority. Poll every 20 seconds while visible; focus/visibility refresh follows operator edits. Conservative request-time anchoring avoids adding response latency to the deadline. Zero changes local state immediately to ended; claim independently rechecks server availability. Null end time means no countdown. Timer has no animation; reduced motion unaffected. Explicit local short/extend/long-copy fixtures are not business durations or Production definitions.

## 7. UTM / navigation / generation boundary

12A short-token/key allowlist and operator-approved values unchanged. Unknown query/PII/fbclid dropped, reward fields rejected. HttpOnly opaque campaign cookie survives home, product, input, OAuth, consent, receipt and report without appending campaign params to every URL. First valid context TTL not extended; settled family cannot be replaced.

Campaign B → B book → share/referral → C: shared URL contains only read token and referral credential, no UTM/campaign inheritance. C is referral acquisition even if C later sees a campaign. `downstreamCampaign` is a separate internal relationship for campaign reporting, **not** C's direct campaign. First-valid-family and inviter rewards remain 11B/12A authority.

## 8. Internal metrics / denominators

`GET /dev/measurement?aggregate=1` is loopback/dev-only. Campaign-safe counts, total counts and separate downstream facts. No customer book-total display. Interactions are unique tab journey/event/product (collector additionally collapses same authenticated subject/event/product/campaign); business conversions deduplicate by source account/order/report/attribution ID. Refresh is not a new conversion. Query/step change is not a new journey.

| Metric | Numerator / denominator |
| --- | --- |
| Landing → CTA | Unique campaign CTA journeys / unique campaign landing journeys |
| CTA → eligible attribution | Unique campaign-attributed accounts / CTA journeys; cross-device identity matching not claimed |
| Attributed → benefit | Granted attribution IDs / attributed IDs with a non-NONE offer |
| Benefit → first publication | Granted recipients with a valid first publication / granted recipients |
| Checkout → paid | Unique verified paid orders / receipt journeys; ticket receipts included unless explicitly segmented |
| Published → share | Distinct shared reports / valid published reports |
| Share → referral | Unique referred accounts / distinct inviter source reports with invite links; separate generation |

Raw counts are provided; unlike denominators must not be mislabeled as exact user conversion rates. Local receipts include free intent; payment rate requires segmentation. Snapshot-backed report counts are currently **live revalidatable publications**, not a historical lifetime total after retention erases snapshots. A durable privacy-reviewed analytics sink, retention policy and cohort queries are pre-activation work, not a second analytics DB fabricated in 12B.

## 9. Privacy / consent boundary

- Never pass names, email, dates/times of birth, MBTI, 사주, input answers, partner details, prose, OAuth metadata, share credentials or raw URLs as event params.
- Inputs are separate from existing local form-draft storage; analytics never reads drafts.
- Internal source snapshots stay server-side solely for completeness validation; explicit allowlist strips them from responses.
- Existing fbq script/vendor automatic URL/cookie/advanced-matching behavior must be audited with the real configuration later. Application payload tests do not certify vendor-side automatic collection.
- General required terms/privacy acceptance is not silently reused as tracking consent. Legal Final Audit must decide consent gating, notice/disclosure, Meta processing/transfer, cookies and opt-out. No legal text/banner invented here.

## 10. Prepared migration / release prerequisites

`supabase/migrations/20261003165059_v4_growth_measurement.sql`, created using CLI `migration new`, exercised only against isolated PGlite. Existing 12A schema suffices for facts; only new durable state is the order dispatch/cutover receipt. New read projection functions and minimal column SELECT for worker-start timestamps. RLS, restricted grants, invoker rights, empty search_path. No default privilege expansion, triggers on payment flow, schema rewrite or provider mutation. Historical suppression inserts only into the new receipt table; it does not rewrite payment orders or grant rewards.

Apply order, separately authorized: existing paid/share foundations → 9B accounts → 9C ownership → 10A tickets → 10B coupons → 11B referrals → 12A acquisition → 12B measurement. Deploying this tracker without its RPC would fail closed and miss Purchase, so migration/application ordering is a release prerequisite. CLI remote/local Docker advisors were not run; PGlite role/privilege tests are not a substitute for staging multi-connection and security-advisor review.

## 11. Production readiness — document only

- [ ] Authorize migration order, backup/rollback and independent-connection contention tests.
- [ ] Coordinate old/new tracker cutover and the paid-order watermark; prevent the old browser tracker and new server-claimed tracker from both dispatching during rollout.
- [ ] Real OAuth provider setup/redirects, current consent and identity clocks.
- [ ] Operator-approved campaign slug/message/status/start/end/offer/eligibility; no arbitrary duration.
- [ ] Exact ticket quantity or coupon amount/percentage/cap/minimum/products/expiry.
- [ ] Campaign grant cap, abuse guard, rate limits, multi-account policy, alerting and budget ceiling: **undecided**.
- [ ] Existing Meta env/Pixel ID and hostname/domain setup; ID never changed in this phase.
- [ ] Tracking consent, policy disclosures, vendor automatic data collection, deletion/retention.
- [ ] Pixel-only versus authorized CAPI; eventID parity, loss/retry strategy, test-events/domain/event-verification requirements in actual Meta account.
- [ ] UTM naming/operator allowlist; eventual `/campaign/{approved-slug}` URL (gated OFF now).
- [ ] Bounded production aggregation, analytics transport, failure recovery and retention.
- [ ] Separately approved production smoke: one eligible/ineligible path, actual paid amount, no duplicate purchase, ticket no Purchase, valid delivery/share/referral. No ads or finance performed here.

Milestones/end extensions: operator end-time changes supported; no threshold, extra-day policy, book count or automatic extension engine invented.

## 12. Verification and artifacts

Browser harness reuses `scripts/verify-v4-campaigns.mjs` with fresh local process per offer; existing 12A fixtures, mocked OAuth/provider, actual SQL and V4 generation. `/tmp/gyeol-v4-12b/{ticket,coupon}` contains viewport captures and event/aggregate logs. Unit tests include six real products, full snapshot validation, repeated claim concurrency, state/window truth, strict payloads and client navigation boundaries.

| Check | Actual result |
| --- | --- |
| New measurement authority/client tests | **15 PASS**; 1,290 and 990 actual paid amounts, legacy cutover, 12 simultaneous claims, absent/invalid payment proof, RLS, privacy, six actual valid snapshots |
| `pnpm test` | **432 files / 5,926 PASS / 0 FAIL**; V3/V4, six products, Major 14/14, Annual 12/12, compatibility roles/directions, auth/consent/library/tickets/coupons/paid delivery/share/referrals/campaigns |
| Ticket browser loop | **149 checks PASS**; B's campaign ticket → publish → share → C referral ticket → publish → B inviter reward; no Purchase; B campaign not inherited by C |
| Coupon browser loop | **124 checks PASS**; server 300 discount → final **990 KRW** Purchase exactly once; real second tab, refresh/back and duplicate server claim |
| Additional browser edge checks | **25 PASS**; auto rotation + side selection no ViewContent, actual entry one, input not checkout, deadline expiry, live end-time extension, reload, long Korean copy |
| Responsive | **390 / 430 / 768 / 1440**, no observed horizontal overflow, console or hydration error; countdown/CTA and receipt/share inspected in real screenshots |
| Local public exposure check | `/campaign/book-ticket`, its `/state`, and POST `/api/analytics/purchase` are **404** on local development server; Book/Auth hard gates remain false |
| `pnpm lint` / `git diff --check` | PASS |
| `pnpm build` | PASS, **8 NFT tracing warnings** (12A documented 7); added dev measurement route shares the existing `tickets/localDatabase` broad fixture trace. Not represented as zero new warnings. No unrelated bundler refactor. |
| `tsc --noEmit` | Baseline **390**, current **390**, new file/error-code diagnostics **0**. Full tsc remains non-clean baseline. |

Browser simulation is Chromium at mobile/Safari-like dimensions, **not a physical iPhone or WebKit certification**. CSS includes safe-area bottom padding. All resource URLs observed in QA were loopback; no real Meta/OAuth/Toss calls. Local PGlite concurrent promises/unique constraints are not proof of multi-instance Postgres contention; independent staging connections remain a release check.

Captured coupon sequence: product ViewContent → input_started → input_completed → receipt InitiateCheckout → coupon_applied → payment_succeeded → publishing_started → report_published → Purchase → report_opened. Business facts arrive in a batch after the local mocked confirmation/worker returns; their authoritative `occurredAt` establishes business order, not capture-array position. The independent test claims a verified paid order **before generation**. Ticket capture contains ticket_selected/redeemed, publishing_started/report_published/share_created/referral facts and **no Purchase**.

Artifacts:

- `/tmp/gyeol-v4-12b/ticket/{browser-results,events}.json`
- `/tmp/gyeol-v4-12b/coupon/{browser-results,events}.json`
- `/tmp/gyeol-v4-12b/edge/checks.json`, `{390,430,768,1440}-long-countdown.png`
- Ticket/coupon screenshots: `{390,430,768,1440}-{scheduled,paused,active_eligible,ended,landing,benefit,already-granted,existing-member}.png`; ticket owner-share/referral-wins/loop-complete, coupon receipt/book; 390 login/consent captures.
- `/tmp/gyeol-12b-{final-tests,final-target,final-lint,build,tsc-baseline,tsc-current,browser-ticket,browser-coupon,edge}.log`
- Extra browser harness: `/tmp/gyeol-12b-edge.mjs` (local review artifact, not a public route).

The initial sandboxed build made no progress; it was stopped and the same `pnpm build` completed with approved local execution. An automation-tool tab-close/CDP error occurred after successful multiple-tab assertions; keeping tabs until session cleanup resolved the harness issue and the full coupon run passed. Neither was a customer runtime defect. Next/React review checked action/effect boundaries and timer cleanup; Supabase guidance informed local-only RLS/grant and transaction tests.

## 13. Final Content Parity Audit handoff

Not started: no narrative/Fusion/calculation/report table/content changes. Subsequent authorized audit should compare V3 strengths and V4 fusion/story depth per product, independently of this measurement work. Review/referral-policy/bundle/milestone features not added. STOP after commit/push and results; no Production activation or ad spend.
