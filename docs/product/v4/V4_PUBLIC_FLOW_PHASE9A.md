# Phase 9A — Book public flow behind a closed gate

Base: `dd6cb81e3c7cdfe338acf6b22e5b849fab71e8b1`, branch: `v4/rebuild`.

## Scope / activation

- `src/lib/book/publicGate.ts` is server-only and returns the literal `false`. No environment variable, request, query, cookie, browser storage or client version controls it.
- Default/public customers still receive V3. This commit does **not** enable V4 generation, payment, Auth, sharing SDKs or Production configuration.
- The internal `/dev/book-flow` entry uses the same Book components selected by the public route gate, not a second presentation implementation. It returns 404 outside development. Its mock API additionally requires loopback Host and same-origin requests.
- Internal results are a bounded, process-local mock store (50 orders, one-hour expiry, lost on restart). There are no remote persistence calls. This is not a customer recovery contract.

## Actual route map

| Existing route / boundary | OFF (unchanged default) | Internal ON presentation |
|---|---|---|
| `/` | Existing six-product home | `BookHomeRoute` → `BookShelf` |
| `/report/new` | Existing page/state/checkout | Server layout selects `BookInputRoute` |
| Checkout | Existing Toss launcher and server | Receipt → same request builder with mandatory local mock runtime |
| Publishing | Existing generation lifecycle | Pending local publish request + explicitly decorative intermediate sequence |
| `/reports/[reportId]` | Existing paid read / V3 renderer | Same paid read, stored V4 validator → `StoredBookReport` |
| `/r/[token]` | Existing token lookup / report | Same token lookup with gated stored-version validator and Book renderer |
| Root footer | Existing `BusinessFooter` | Shared Book footer; no footer on report/share reading routes |
| `/terms`, `/privacy`, `/refund`, `/business` | Existing documents / presentation | Same legal data, white/black accordion presentation |
| Product information / payment success/fail/API | Unchanged | No replacement or provider changes |

`BookRoutes` is server-only. `BookEntry` provides client dynamic boundaries; default-OFF routes do not download the Book implementation. A server dynamic import alone still preloaded client modules, so this was measured and corrected. No dependency was added.

### Canonical product mapping

`src/lib/book/product.ts` is shared by home, input, receipt, projection and share metadata. The Phase 8C model now re-exports it.

| Product ID | Title | Issue / cover |
|---|---|---|
| `saju_mbti_full` | 나라는 사람 | 01 / yellow |
| `career_money_study` | 내가 잘되는 방식 | 02 / green |
| `love_marriage_child` | 내 사랑 이야기 | 03 / orange |
| `saju_mbti_compatibility` | 우리라는 사이 | 04 / purple |
| `major_fortune` | 앞으로의 나 | 05 / navy |
| `annual_fortune` | 나의 {selectedYear} | 06 / silver |

Annual has a validated four-digit year; absent year uses “나의 한 해”, never a hardcoded year. Price comes exclusively from `reportProductCatalog`.

## Input / checkout parity

The existing pure production helpers were extracted without behavior changes into `reportInputPresentation.ts`. Both presentations call them. Existing form state and V3 UI remain in place.

| Area | Contract retained |
|---|---|
| Identity | Name, date, gender, exact/approximate/unknown precision, canonical time slot |
| Unknown time | Empty time; no invented hour pillar |
| MBTI | All 16 types + existing empty-string “모름” |
| Context | Canonical job status, raw detailed job, relationship state, focus areas |
| Compatibility | Both people; seven categories; parent/manager fixed A roles |
| Annual | Existing commerce year policy and selected year |
| Payload | Existing product IDs/slugs, `contentVersion: v3`; client does not request V4 |
| Checkout envelope | Existing display name, A-person outer fields for pairs, timezone/calendar and nested payload |
| Money | Actual catalog amount 1,290원 for all six; no new price source |
| Validation | Existing birth-time/age helpers and canonical input adapter; adjacent field errors/focus |
| Local restoration | Whitelisted input fields in per-product session storage; never consent, price, gate, version or payment status |

Two input pages, with a third only for Love relationship or Annual year. Pair inputs include both people. Input state is outside animation state. Reload/back preserves entered data; validation still runs before proceeding. Changing product does not reuse another product's draft.

`BookCheckout` calls `runDevTossCheckout` with an explicit mandatory mock runtime. Its prepare payload is checked against the current production contract, then the local harness reuses `preparePaymentCheckoutSession` and `prepareTossCheckoutRequest`. The provider SDK loader is never called; real prepare/payment endpoints are not used. Reentrant clicks are locked. In the non-internal Book presentation the payment control remains disabled pending a separately authorized activation review.

### Guest / member legal behavior

- Actual required consent labels and policy versions are reused; no invented optional marketing consent.
- “전체 동의” synchronizes individual required items, supports unchecking and indeterminate state; minor representative consent follows the existing age policy.
- Full policies are closed by default and accessible through the detail sheet. Cross-document navigation opens the requested section.
- No actual login/accepted-policy account contract was found to justify silently bypassing consent. No fake member toggle or inferred consent is added. Auth-backed member receipt requires a later policy/version audit; transaction-specific notices must remain.
- The existing delivery period, availability and digital-report notices remain. No speculative lost-link/recovery warning: current success/retry/report/share URL mechanisms do not establish a universal “cannot recover” statement.

## Publishing / stored report / share

- Actual observed UI state is `REQUESTED` while awaiting local publish. Preparing/composing/binding/covering are decorative; no progress percentage or fabricated server substatus.
- Only successful generation, JSON snapshot round-trip, existing publish validation and paid read permit report navigation. Failed validation does not display success.
- Stored `productVersion` determines validation/presentation. V3 snapshots are not regenerated. Invalid V4 snapshots are rejected, not converted.
- Existing Meta purchase tracking, payment status views and share-token authorization remain in their original route.
- `projectBookShare` supplies canonical title, personal display title, cover color, issue, report URL and existing share URL/token. Only canonical share-origin URLs are accepted. No new token issuance or SDK send implementation.
- Back cover retains Kakao / system share / link copy visuals; Book actions explicitly say connection is pending. This is metadata preparation, not activated sharing.

## Structural parity / rendering

| Representative | Pages | Appendix items | Required structure |
|---|---:|---:|---|
| Comprehensive | 21 | 32 | Actual tables, full chapters, footnotes, final |
| Career | 20 | 24 | Same + actual job context |
| Love | 21 | 15 | Same + relationship state |
| Compatibility | 22 | 51 | Pair spread, two tables/MBTIs, directionality/category; no numeric score |
| Major | 31 | 38 | 14 years = past 3 + current + future 10; age, active cycle, transition |
| Annual | 26 | 23 | 12-month overview, ordered Jie source, month chapters, annual/cycle cross, final |

All seven compatibility categories and exact/approximate/unknown/unknown-MBTI extras use the same projection in automated tests. Existing Phase 8C table, feature/evidence policy and chapter footnotes are reused without changing narrative. An omitted optional gender is displayed as “미선택”, not inferred as male.

Only the current chapter mounts. Page turn has a single cancellable timer, reduced-motion behavior, vertical scroll reset and focus management. No all-pages interactive DOM. Long timeline/appendix remains scrollable within the chapter. Bottom navigation uses the actual book title and page count, not a second service logo.

Coverflow keeps the established design: side book selects, center opens; arrow/swipe/keyboard retained. Shared auto controller uses 6.5-second intervals / 8.5-second manual idle, pauses for hidden tab/reduced motion/desktop hover, and has no play/pause control.

## Support copy audit

No OFF-path legal text was rewritten. Contact data remains in `GYEOL_BUSINESS_INFO`.

| Classification | Source / location | Decision |
|---|---|---|
| A — legal values | `src/lib/legal/businessInfo.ts` | Preserve company, address, phone, support email |
| A — public disclosure | `src/app/business/page.tsx`, `src/app/products/saju-mbti-full/page.tsx` | Preserve all values |
| A — privacy contact | `src/app/privacy/page.tsx` contact section | Preserve controller/contact information |
| A/B — footer | `src/components/legal/BusinessFooter.tsx` telephone/email links | OFF unchanged; Book business foldout uses plain values, Kakao is the primary action |
| B — terms support instruction | `src/lib/legal/termsPolicy.ts`, customer-support clause | Future legal/copy review; verbatim policy retained now |
| B — refund request | `src/app/refund/page.tsx`, `src/lib/legal/refundPolicy.ts` request guidance | Future Kakao presentation/copy review; no policy edits |
| B — privacy contact actions | `src/app/privacy/page.tsx` tel/mailto links | Future presentation review; never delete legal contact values |
| B — report failures | `src/components/report/ReportStatusView.tsx` customer-center text and tel/mailto actions | Future Kakao action migration |
| B — report error | `src/app/reports/[reportId]/page.tsx` failure customer-center instruction | Documented; OFF unchanged |
| B — payment errors | `src/app/payments/toss/fail/page.tsx`, `src/app/payments/toss/success/page.tsx` missing identifiers / failure guidance | Documented only; payment scope excluded |

Career “전화 문의” job scenes are not support instructions and are excluded. No customer-facing old support-email value was introduced.

New Book footer: “고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.” Instagram + Kakao `/chat` icons, small channel link, collapsed business information; no large chat CTA. Public legal body strings remain verbatim, including old contact-action sentences awaiting the separate legal/copy audit.

## Verification

- Related tests: **187 files / 3,019 PASS / 0 FAIL**. Includes V4 hashes, V3, saju, tables, paid delivery/full-share, payment builders, legal and routing.
- New route-flow tests: 31; six actual input→mock checkout→generation→snapshot→paid read→actual report-route SSR cases, extra precision/MBTI/role cases, source-of-truth/gate/consent/share assertions.
- Browser: `scripts/verify-v4-book-flow.mjs`, **207 checks PASS**, local-only, actual six-product DOM flow, 390/430/768/1440; console/hydration/overflow errors 0. Includes auto/manual idle/visibility/reduced motion, three-page input back/forward, reload, field validation, consent, publishing and full stored reports.
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS. After the final navigation/legal presentation edits, the affected route/legal/UI tests were rerun: 70 PASS; paid delivery + route flow: 61 PASS.
- `pnpm exec tsc --noEmit`: preflight 389; after browser dev type generation 390. The extra diagnostic is the **existing** `/report/new` named export (`getAnnualFortuneYearOptions`) in `.next/dev/types/app/report/new/page.ts`, not a new source error. An isolated `git archive` of the exact base, compiled with that same generated checker, also produces 390. Matched-baseline comparison: **390 → 390, zero new diagnostics** (normalizing paths/line numbers and union-member order). No existing error was fixed or hidden. Logs: `/tmp/gyeol-v4-9a-tsc-before.log`, `...-tsc-matched-base.log`, `...-tsc-final.log`.
- Local **production-mode** server (not deployment): query override retains V3; dev Book routes/API return 404. The final OFF home loads **zero Book implementation chunks** (checked actual browser-loaded assets against Book DOM markers). Tiny dynamic loader stubs are allowed; no V4 generator reaches the client.
- Tests mock only the network/storage boundary. Real Toss/OpenAI/Supabase fetches are blocked. No Production requests, migrations, environment-file edits or SDK invocations.

Artifacts (local, not shipped): `/tmp/gyeol-v4-9a/` contains six input/book exports, browser results and screenshots. Examples: `390-input.png`, `390-receipt.png`, `390-consent-detail.png`, `390-publishing.png`, `390-full-manse.png`, `390-full-mbti.png`, `390-full-footnotes.png`, `390-major-timeline.png`, `390-annual-months.png`, `390-compatibility-pair.png`, `390-full-back.png`, `390-footer.png`, `390-business-open.png`, `390-legal.png`; corresponding 430/768/1440 key-screen images. The Next dev indicator in local captures is not a customer UI element.

## Deferred Content Quality Audit

No narrative wording, Fusion rule, evidence calculation or V3 body was rewritten.

- Interpretation reasons and saju×MBTI connection as perceived by readers.
- V3 strengths/positive-character material that readers miss in V4.
- Actual entertainment value and density of long chapters.
- Final content parity across six products.

## Next approval boundary

Phase 9A prepares integration but does not make it safe to flip the public gate immediately. Next authorized work must establish Auth and accepted-policy account contracts; audit member purchase consent, paid V4 generation/persistence rollout, actual checkout wiring, recovery and share SDK behavior; complete content parity review. Library/coupon/referral/Production activation are not started. Protected dirty `.gitignore`, `AGENTS.md`, `supabase/.temp/` remain outside this commit.
