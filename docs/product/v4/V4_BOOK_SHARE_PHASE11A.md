# Phase 11A — Book share experience

Base: `f730ac83fd75ad54f3f281f3638e8fd36010bdb2`, branch `v4/rebuild`.

## Scope and activation

- Book/Auth public gates remain **OFF**. No environment/query/cookie/client override.
- No narrative, calculation, payment-provider, legal, schema, migration, campaign or reward change.
- `/r/[token]` selects the **stored** V4 version only behind the server Book gate. Existing V3/legacy links retain their renderer, SDK and metadata defaults.
- The new issuance endpoint requires both Book and Account gates. Routes are prepared, not activated or deployed.

## Existing share audit / reuse

| Contract | Implementation / result |
|---|---|
| Credential | Existing `reportShareStore`: `gr_` + 24 random bytes (192 bits), 32 base64url characters |
| Persistence | Existing `report_share_links`; unique `report_id`, insert-on-conflict-do-nothing |
| Repeat clicks | Same active token; 8 simultaneous requests converge on one row |
| Revocation | Existing token denied, never recreated by visitor |
| Expiration/cancellation | Existing paid `read_report` + publication validation on entry, body fetch and OG |
| Issuance authority | V4 reuses 9C `LibraryPort.claim(..., commit=false)` with verified account/current consent or HTTP-only guest purchase proof |
| Legacy authority | V3 ID-capability endpoint unchanged; it cannot validate/issue V4 through the legacy publication validator |
| Ownership | Share token never accepted as guest proof, library claim, account identity or transfer |
| SDK | Existing Kakao 2.8.3 script URL, SRI, initialization key name and domain contract retained |
| Copy/native | Existing `copyShareLink` and `nativeShare`, including AbortError and manual-copy fallback |

The small injected `ShareStorePort` permits the **same** token/validation functions to run against local SQL. It is not a second share engine. Production uses the original Supabase operations by default.

Guest purchase proof retains the existing 7-day capability lifetime; report retention remains the existing 90-day publication policy. An old guest URL alone does not grant issuance authority. No recovery/claim policy was expanded.

## Canonical model and privacy

`src/lib/book/shareModel.ts` owns:

`shareToken`, `shareUrl`, `productType`, `bookTitle`, `issueNumber`, `coverColor`, `displayName`, `displayTitle`, `reportVersion`, `publishedAt`, `expiresAt`, `isShareable`.

- Color/title/issue come from `BOOKS`; Annual uses the actual selected year.
- Name sanitation reuses the existing NFC/markup/control filtering and 20-character limit.
- Compatibility external preview uses **A's display name only**. The full reader retains both people, the category and directions.
- Publication/expiry come from the validated stored publication; never client-supplied dates.
- Metadata/OG/native/Kakao use allowlisted display name and book identity only. No birthday/time/gender/MBTI/job/relationship/private report URL/order/auth ID/evidence.
- Example: `서진의 나라는 사람`, `지아의 사랑 이야기`, `도윤의 2026`.
- Canonical URL is the token URL, not the private report URL. Robots noindex/nofollow/noarchive; no-referrer; data/OG no-store.

## Owner and shared reading

| Stage | Behavior |
|---|---|
| Owner back cover | Three small icon buttons: 카카오톡 / 공유 / 링크 복사; one-line full-report disclosure |
| First SDK/native gesture | Prepare an authorized link first; a second gesture invokes the sheet if async preparation consumed Safari activation |
| Kakao | Book title, `한 권 펼쳐보세요.`, dynamic 1200×630 cover, `책 펼쳐보기`; missing/failing SDK copies the same URL |
| Native | Web Share API; cancel is quiet; unsupported/error falls back to copy |
| Copy | Canonical URL; `복사됨`; denied clipboard/execCommand exposes read-only manual selection |
| Entry | Only cover metadata sent to the client; actual button, keyboard Enter, short cover animation, reduced-motion |
| Open | Token-only no-store request revalidates permission/expiry and loads actual Book projection; credentials omitted |
| Reader | Existing Phase 8C actual-data reader, current page only; no owner controls/account claim/tickets/coupons |
| Final | Same final line, re-share of the existing token (existing policy), **one** `나도 내 책 만들기` CTA to Book selection |

Reader code is dynamically split. Initial entry does not serialize full birth tables or narrative. Local warm entry requests were 40–88 ms (median 60 ms); body requests median 32 ms, with a 1.8 s development compilation outlier. These are local development observations, not Production SLOs.

## Dynamic OG

- `bookOg.tsx`, 1200×630, canonical Yellow / Green / Orange / Purple / Navy / Gray.
- Bundled OFL Noto Sans KR WOFF, 23,174 mappings; Node-only cached filesystem read, no runtime remote font/image/emoji request and no npm dependency.
- Font is 2.9 MiB server asset, not browser payload. Local font metadata/license/conversion instructions are under `fonts/`.
- Long Korean names wrap/scale. Unsupported rare glyphs become a visible square in OG only instead of triggering remote font fetch; original HTML name is unchanged.
- 6 images plus long-name Compatibility rendered and visually inspected: legible Korean, no clipped title/name, correct contrast/colors. Output PNGs about 33–43 KiB.
- Existing V3 fixed OG remains untouched. Social services may retain images already fetched before revocation; server cannot retract third-party caches.

## Direct/shared parity

| Product | Verified |
|---|---|
| Comprehensive | All pages/prose, actual 만세력/MBTI, appendix and final |
| Career | Same pages and current-job context |
| Love | Same pages, relationship state and unknown birth-time behavior |
| Compatibility | Both profiles, category, A→B/B→A, no numeric score/grade |
| Major | 14/14 years, future 10, age/active cycle/transition, appendix/final |
| Annual | 12/12 ordered months, annual/Dayun cross, appendix/final |

Generated V4 → existing paid SQL → publication validator → stored Book projection was used, not mock body text. Full DTO and per-page SSR equality checked. Existing runtime/category/role/precision and content hash regression suites retained.

## Local verification and reproducibility

The explicit loopback-only fixture endpoint prepares ordinary 1,290원 **mock** orders, binds a guest/member purchase proof, injects a mock confirm response, runs the existing paid worker and actual V4 generator. It issues no ticket, coupon or referral. SQL is process-local/discarded on server restart; no Production database client is constructed.

- Fixture: `POST /dev/book-flow/share-fixture` (actual fixture input; same-origin + development + loopback + size limit).
- Owner: `/dev/book-flow/report/{reportId}` with purchase proof.
- Issue: `POST /dev/book-flow/share`.
- Shared: `/dev/book-flow/r/{gr_token}`; `/book-data`, `/book-og`.
- Copied URL deliberately remains the canonical public URL; local tokens exist **only locally** and will not open in Production. QA uses the explicit local route, never sends to a recipient.
- Old Phase 9A `book-local-*` mock sessions are not silently converted into canonical paid share records. The new harness uses real `report_*` SQL records. Existing ticket/coupon/local account workflows were regression-tested, not rewritten.

```
BOOK_SHARE_REVIEW_EXPORT=/tmp/gyeol-v4-11a pnpm test tests/unit/sharing/bookSharing.test.tsx
BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-book-share.mjs
```

Browser script uses six real golden inputs plus a long-name Compatibility input. Actual Kakao transport and system share dispatch are stubbed locally; clipboard success/failure and navigation are exercised in Chromium.

## QA results

- Related suites: **1,328 PASS / 0 FAIL** (42 files), including existing Kakao/share interactions and actual SQL rejection of unpaid, canceled, refunded, unpublished and expired reports.
- Browser: **120 PASS**, 390/430/768/1440, six full book flows, long Korean name, keyboard open, copy/manual fallback, mock native/Kakao, guest token-only access, CTA navigation, no horizontal overflow/runtime errors.
- Shared component is current-page-only. No initial narrative DOM and no owner/action leakage.
- `pnpm lint`: PASS. `pnpm build`: PASS after restarting a silent sandbox build with the same command.
- Build has five non-blocking NFT tracing warnings from the pre-existing local SQL helper reached by more dev routes. Public gates prevent local DB initialization; no deploy/config change made.
- `tsc`: baseline **390**, current **390**, **0 new**. Full TypeScript check is not clean; debt was not hidden/fixed in this phase.
- `git diff --check`: PASS.

Artifacts `/tmp/gyeol-v4-11a/`:

- `390-owner-back.png`, `390-copy-success.png`, `390-manual-copy.png`
- `{390,430,768,1440}-comprehensive-entry.png`
- `{390,430,768,1440}-{product}-shared-final.png`
- `390-{product}-shared-reader.png`
- `{390,430,768,1440}-long-name-entry.png`, `390-open-animation.png`
- `og-1.png` … `og-6.png`, `og-long-compatibility.png`
- `models.json`, `inputs.json`, `browser-results.json` (local URLs/check list).

## Event and referral boundary

Local-only `gyeol:book-share` events contain `{event, productType}` — no credential, personal information or transport:

`report_share_created`, `report_share_kakao`, `report_share_native`, `report_share_copy`, `shared_report_opened`, `shared_cta_clicked`.

`report_share_created` means successful link preparation/reuse, not a new database row. Kakao means SDK handoff, not verified recipient delivery. No events are sent to Meta.

Future referral design (not implemented): use a separate opaque attribution context, validated independently of share read permission. Never derive referral identity from `shareToken`, append owner/order IDs, grant ownership, prolong access or award on a read. Define expiry/consent/abuse/idempotency before any reward implementation. Preserve the original canonical share URL. No schema or reward added now.

## Before any future activation

1. Separate approval for Book/Auth gates and existing account/library migrations/configuration.
2. Live Kakao allowed-domain/key/SDK availability and crawler card validation using the existing app; **not accessed or changed here**.
3. Real-device iOS/Android native-share/cancel testing; desktop mock checks do not prove OS recipient integrations.
4. Preview deployment verification of bundled OG asset tracing, cold starts and private/no-store headers; investigate dev SQL NFT warnings before deployment optimization.
5. Existing retention and guest-proof recovery UX review; share access remains separate from ownership.

No implementation blocker in the local approved scope. Live Kakao/OS/Production verification remains deliberately unperformed. Referral/campaign/Production work **STOPPED**.
