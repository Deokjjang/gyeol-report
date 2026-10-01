# V4 Phase 8A — personal publishing prototype

Base `435c7655cedf0ef275ef27b61b59d663c597ceb6` · branch `v4/rebuild`.

**Local preview: `/dev/book-preview`. Production mode: 404. V4 activation: NO.**

## Boundary and existing UI audit

| Existing surface | Source | This phase |
|---|---|---|
| Home / wordmark | `src/app/page.tsx`, `home.module.css`, `GyeolBrandHeader.tsx` | Unchanged. Reproduce the text lockup in black inside preview only |
| Global layout / fonts | `src/app/layout.tsx`, `globals.css` | Unchanged. Existing Geist/Geist Mono + installed Korean system sans; no font added |
| Input / purchase | `report/new/page.tsx`, `DevTossCheckoutLauncher.tsx`, `checkoutConsent.ts` | Read-only audit. No handler/contract edits |
| Paid reader / share | `reports/[reportId]`, `ReportReadingFrame`, `ReportShareActions` | Unchanged; no SDK invocation |
| Footer / business identity | `BusinessFooter.tsx`, `businessInfo.ts` | Reuse legal values. Inherited footer hidden by CSS **only while preview root exists** |
| Motion / icons | No installed motion/icon library | Native CSS transforms, small inline SVG; zero dependencies added |

New files are colocated in `src/app/dev/book-preview/`: `page.tsx`, `BookPreview.tsx`, `BookPages.tsx`, `model.ts`, `book.module.css`, `fixture.json`. Tests: `tests/unit/app/dev/bookPreview.test.tsx`, browser acceptance: `scripts/verify-v4-book-preview.mjs`.

The sole existing-file adjustment is a test-only clock fix in `runtimeShadow.test.tsx`: two Annual comparisons could straddle a second, changing only `evaluatedAtKst`. Freeze Date for that comparison, restore afterward. No composer/calculation/delivery output change.

## Visual rules

- Site: white / `#111111`, no V3 ivory/wine/gold, gradient, mystical imagery, dashboard cards or fake metrics.
- Six solid covers share an issue/grid, short Korean title, publishing metadata. Cover is the CTA.
- Mobile title 28px, cover 34px, body 16px/1.95; desktop page 700px, body 16.5px. Korean sans, with serif only for table Hanja.
- Thin black/gray rules, square pages, restrained page-edge depth. No reflection, paper texture, WebGL or canvas.
- First viewport: wordmark, login **demo toggle**, coverflow and its small navigation/pause controls only. Footer begins below it.

| Issue | Title | Solid color | Ink | Contrast |
|---|---|---|---|---|
| 01 | 나라는 사람 | Yellow `#F5D43B` | `#111111` | 12.92:1 |
| 02 | 내가 잘되는 방식 | Green `#176346` | white | 7.22:1 |
| 03 | 내 사랑 이야기 | Orange `#EC643B` | `#111111` | 5.80:1 |
| 04 | 우리라는 사이 | Purple `#6942A6` | white | 7.17:1 |
| 05 | 앞으로의 나 | Navy `#203754` | white | 12.10:1 |
| 06 | 나의 2026 | Gray `#CED1D4` | `#111111` | 12.31:1 |

Colors/ink are single-source tokens in `model.ts`, applied as CSS custom properties. All exceed WCAG AA normal-text contrast. No new font binary or package/lockfile change.

## Interaction contract

| Step | Behavior |
|---|---|
| Coverflow | Center front-facing; neighbors rotate and recede along shallow depth arc. Swipe/pointer drag, arrows, keyboard, horizontal trackpad. 6.5s auto rotation pauses after manual action and during hover/focus; hidden tab and reduced-motion disable auto |
| Open | Selected cover moves forward and pivots from spine; other covers move into depth. Inner sheet visible. 880ms book opening, not a route fade |
| Input | Two pages: identity/birth/time precision, then MBTI/job. Third page only Love relationship, Compatibility other person/category, Annual year. Fixed parent/manager roles. Plain form fields, native validation, bottom-right next control and swipe |
| Receipt | Guest/member local toggle. Full input/date/MBTI/title/₩1,290. Exact production consent labels. All-consent syncs individual items; member omits only general policy checkbox under explicit prior-consent assumption. Payment-specific disclosures retained |
| Publishing | `preparing → composing → binding → covering → complete`. Blank sheets → ink → aligned stack/spine → closed solid cover → title, then recipient. Decorative timing, no percent or fake server progress |
| Complete | Finished cover + one short sentence. Tap book to open reader. No oversized CTA |
| Reader | Opening → natal table → MBTI → all 11 stored chapters → glossary → back cover. 16 page units, each independently scrollable; no TOC or accordion |
| Page turn | 500ms directional rotateY with lifted corner, paper face/shadow and next-page glimpse; one chapter per turn. Previous/next buttons and swipe |
| Footnotes | Three manually selected, supported fixture markers. Small superscript, transparent 44px hit area, native modal note with focus containment/Escape/return focus |
| Back cover | Black surface, final line, three share preview actions. Shows demo message only; no SDK, clipboard, native-share, or token calls |
| Footer | Black small type, Instagram/Kakao chat icons, small channel link, exact support copy; collapsed business data and legal links. No footer during reading |

There are **no optional marketing consent items** in the current source contract, so none were invented. Minor/under-14 display is local prototype validation against its fixed preview date, not a new purchase policy. Member legal simplification requires a separate legal/auth audit before real activation.

## Data / exposure safety

- `page.tsx` rejects anything except `NODE_ENV=development` **before** importing the client prototype; no client/query/cookie flag can bypass it. `noindex/nofollow`, no public navigation/sitemap link.
- Actual local `next start`: preview URL with override-looking query → **404**; existing `/` → **200**.
- Static customer fixture is the Phase 7B Seojin projection, not a new generator: full opening/11 chapters/final, canonical natal and MBTI display data. Source clock/calculation/proof never imported into preview.
- Reader is explicitly a **fixed Seojin sample** across six cover choices. Edited input affects the local order/recipient only; it is not claimed to personalize/recalculate sample text. Annual cover/sample stays 2026. Actual six-product body binding is deferred.
- Natal detail rows, visible/weighted elements, all MBTI keywords and both preference descriptions remain available. No accordion/truncation for layout convenience.
- Glossary/footnotes quote existing `markerMaterials.ts` meanings for 현침살/도화살/홍염살; all appear in this fixture's natal markers. Automated footnote attribution is deferred.
- No fetch, server action, storage, auth, purchase, coupon/referral, API, tracking or sharing SDK integration in preview. Global Meta component unchanged; local verification clears its **process-only** public pixel ID. No `.env` edits.
- Production build may contain the static prototype asset, including on the 404 route's framework asset graph. The public home does not load its JS chunk. The route gate is an access/render boundary, **not secrecy for bundled sample assets**.

## Visual critique and verification

| Question | Final review |
|---|---|
| Fortune/MBTI-test/SaaS/old V3 look? | NO: white chrome and solid typographic covers, no icons from divination vocabulary |
| Choose without explanation? | YES: six short titles, center cover as action |
| Signature movement visible? | YES: actual perspective changes; opening frame and mid-page-turn capture reviewed |
| Outdated gimmick / reading interference? | NO in reviewed flow: no reflection/texture; motion only at navigation, 500ms page turn |
| Publishing more memorable than spinner? | YES: separate ink/stack/binding/cover states, no spinner |
| Mobile product feel? | YES in local Chromium viewport review; real-device Safari/keyboard testing remains below |
| Could more UI be removed? | Removed block-shaped footnote treatment, kept only inline marker; no home pitch, price or marketing boxes |

Corrections after viewing screenshots: reduced outer-cover spacing to eliminate mobile clipping; added depth-out to unselected covers; increased cover metadata legibility; made footnotes truly inline; improved glossary word wrapping; added form scroll/focus margin and explicit region semantics.

- **390 / 430 / 768 / 1440:** no horizontal overflow in verified entry/reader surfaces. All five visible covers fit 390 viewport. Desktop page 700px, not a 390px phone frame.
- Browser flow: **57 checks PASS**, including gesture/keyboard selection, unknown MBTI, two/three-page forms, all-consent/member, publishing, all chapters, footnote Escape, glossary/back/share demo, footer expansion, reduced motion, no backend/provider requests or console/page errors.
- Focused field remains visible with a 390×480 viewport. This approximates keyboard-reduced space; **native iOS/Android keyboard and GPU performance were not tested**.
- Accessibility: automated home/input checks report 0 violations; manual-review items remain for 3D overlap/offscreen contrast. Explicit token ratios above verify cover contrast. Input region semantic warning was corrected. Native form/dialog controls and visible focus preserved.
- Motion capture confirmed a changing `matrix3d` and `0.5s` page animation. Reduced-motion removes animated turns/opening and auto rotation.
- Unit/regression: **33 files / 1,046 PASS**, including 20 prototype tests, V4 golden/hash/shadow delivery, existing footer/share/checkout/API tests. Existing engine hashes preserved.
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS. standalone tsc **389 → 389, new diagnostic locations/codes 0**, not a clean full tsc.
- Build prototype JS about **51 KB raw / 17 KB gzip** (including fixed sample), separate from existing public home. No added dependency, image texture, canvas or WebGL. This is asset size, not a measured low-end-device performance guarantee.

## Review artifacts / reproduce

Artifacts: `/tmp/gyeol-v4-8a/`:

- `390-home.png`, `390-book-opening.png`, `390-input.png`
- `390-receipt-guest.png`, `390-receipt-member.png`, `390-publishing.png`, `390-completed.png`
- `390-report.png`, `390-chapter.png`, `390-footnote.png`, `390-manse.png`
- `390-glossary.png`, `390-back-cover.png`, `390-footer.png`
- `430-home.png`, `430-report.png`, `768-home.png`, `768-report.png`
- `1440-home.png`, `1440-report.png`, `page-turn-motion.png`
- `results.json`, `console.json`, `errors.json`, `network.json`.

```sh
NEXT_PUBLIC_META_PIXEL_ID='' OPENAI_REPORT_WRITER_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 WATCHPACK_POLLING=true pnpm dev --webpack --hostname 127.0.0.1 --port 3188
# Separate shell; uses an already installed CLI, no dependency installation:
BOOK_BROWSER_BIN=/path/to/agent-browser node scripts/verify-v4-book-preview.mjs
pnpm test tests/unit/app/dev/bookPreview.test.tsx
```

## Deferred / Phase 8B plan (not started)

1. Obtain approval for actual V4 data binding; keep server selection/gate and versioned snapshot as source of truth.
2. Map stored customer packet sections to chapter units; feed tables from canonical frozen projection, never prose. Preserve Major14/Annual12/Compatibility directions in their own page units.
3. Define automated evidence-to-footnote mapping without exposing proof/confidence/source IDs.
4. Audit real auth/member legal consent, birth precision, annual selection/purchase policy; then separately approve payment binding. No decorative timer may masquerade as runtime progress.
5. Connect semantic publishing states to real reliability states only after approval; preserve failure/retry and no partial-success contracts.
6. Later share phase binds existing share actions/token/SDK; no implementation here. Audit email/phone **CTA wording** sitewide while retaining statutory contacts.
7. Real-device iOS/Android keyboard, screen reader and lower-end GPU/motion QA before production readiness. No known blocking layout issue in tested viewports.

Future home slots, **not implemented**: actual issued-book/readership counts, actual reader notes/reviews, 3-week event countdown and verified reader milestones. Publishing language: “지금까지 N권이 발행되었습니다”, “독자들이 책에 남긴 메모”. No fake counts/reviews.

No public home/footer replacement, V4 runtime activation, real auth/payment/DB write, Meta redesign, master merge or deployment. Stop after Phase 8A.
