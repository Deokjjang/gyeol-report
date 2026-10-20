# GYEOL-V4-MOBILE-UX-EVENT-COPY-PRODUCTION-FIX-01

Base: master `525760d6d0b535d445693446116fc21e38cdc0ef`.
Branch: `fix/v4-mobile-book-gesture-event-copy-01`.
Persistent worktree: `~/Developer/gyeol-worktrees/v4-mobile-book-gesture-event-copy-01`.

## Changes and boundaries

- Public `BookShelf`: hover is relevant only to a real fine pointer with hover capability. Touch clears stale hover, visibility changes clear stale interaction state. Touch/drag records pointer identity and vertical intent, suppresses accidental release clicks, and keeps the existing one-shot timer. `4500ms` automatic interval / `8500ms` manual idle are unchanged. Motion preference listeners and all timers/listeners are cleaned up.
- Public `BookReading`: text/headings/lists/table cells can begin a deliberate horizontal touch gesture. Controls, editable content, actual horizontal scrollers, selected text, long press without movement, multi-touch, native edge navigation (20px margin), zoom panning, vertical-first gestures, scroll/cancel/lost capture and ongoing page turns are protected. Slow movement after horizontal intent is accepted; the old 450ms limit is removed. No history mutation, global preventDefault or user-select:none is added. A dragged control cannot become a TOC/link click. Native vertical scroll and pinch zoom remain enabled.
- Existing V4 paper/cover/turn animation and colors are reused. Small-screen navigation titles wrap; touch targets remain at least 44×44px.
- Campaign participation CTA precedes the six covers on mobile. Eligibility, signup/required consent, invite link, and the invited friend's first completed report are explained separately. General Book sharing is distinguished from a referral invitation. Full conditions remain in closed details. Inactive/unknown server states do not expose a participation CTA or promise a benefit.
- Customer event times use Korean display strings. Internal `2026-10-31T15:00:00Z`, monotonic server-based countdown and all reward authority are unchanged.

No composer, Saju/MBTI/Fusion data/calculation, compatibility score, Book projection/snapshot, payment/auth/worker/referral/ticket service, price, migration or environment configuration changed.

## Validation

- Mobile/countdown/share/publishing component regression: **52 PASS** (six files, no skips).
- Existing reader/public Book/library/referral/campaign/launch-event suite: **134 PASS, 7 FAIL** with default test budgets. Four files pass completely, including public Book flow, reader navigation, library and launch-event SQL.
- All seven failures reproduced on the unchanged master source tree (existing worktree SHA `31178094`, whose tree is identical to the base merge commit): six heavy publication cases exceed the existing 5000ms test budget; one old public-OFF assertion expects 404 although the current public gate yields 503 without a production store in tests.
- Diagnostic execution of the six timeout cases with CLI-only `--testTimeout=30000`: **6 PASS** with all original assertions. No test source timeout, skip or assertion was weakened. The full default-budget failure result remains reported; name-filtered diagnostic cases are not represented as a full-suite pass.
- TypeScript: zero diagnostics. ESLint: zero diagnostics. Production build: 47 static pages, successful. Diff check: clean. Final exact-commit receipts live in the external validation directory.
- Runtime content/calculation protection: protected source-directory diff is empty. Six actual Books generated and persisted through the existing manual-review UI; public Book-flow regressions validate publication, projection and saved/shared reading without production writes.

## Browser observations

- Chrome DevTools mobile touch emulation, including iPhone 16 preset; **not physical iOS Safari or Android hardware**.
- Six-book automatic rotation: continuous observed intervals **4503–4511ms**. First sampled partial interval is excluded. Manual touch selects the next product without opening input; automatic rotation resumes at approximately **8600ms** (browser observation of the 8500ms contract).
- Real native drags through the device emulator verified cover and narrative movement in both directions, input/blank area movement, and TOC-button drag suppression. Rapid gestures during the existing 510ms turn are ignored. Selection encountered during testing correctly prevented page turning until cleared.
- All six real Books traversed in the actual shared production reader component using browser keyboard controls at 320px: **21 / 17 / 17 / 21 / 31 / 26 = 133 pages**, no page/body horizontal overflow, last next-button disabled. Includes cover/input/contents/Manse/MBTI/narrative/score/pair/timeline/months/appendix/back. This complete page traversal is distinct from sampled native drag tests; it does not claim every page was touch-tested.
- Measured viewports: **320×568, 360×800, 375×812, 390×844, 430×932, 768×1024, 844×390**. Navigation buttons measured 44×44px minimum.
- Physical Safari edge navigation, physical long-press/copy, device rotation/zoom and exhaustive touch tests of every table/timeline/month/legacy/shared page remain manual device checks. Native UI automation was stopped when the user's active Chrome tab changed; unrelated authenticated surfaces were not operated.

## Approved campaign copy change

The current task section 5 explicitly authorized changing only `growth_campaigns.message` for `gyeol-opening-2026`. Automatic review initially rejected the write by applying older task restrictions. The user then explicitly reapproved this exact one-field operation; only the reapproved update succeeded.

Before: `오픈 기념 신규 가입 시 무료 리포트 이용권 1장. 친구 추천 성공 시 추천인에게 1장 추가.`

After: `오픈 이벤트`.

- State: **ACTIVE unchanged**.
- Protected campaign fields digest, before/after: `619a6fa44cb44ee7f771af5586cf20b8`.
- Entire launch-event policy digest, before/after: `adc556cb0bb7b867902a9edbd4f2bae4`.
- One row returned; id/slug/status/start/end/quantity/offer/new-user-only and all other campaign fields unchanged. No grants, attribution/customer history or policy writes were executed.

## Release and preservation

Feature push, PR, authorized master integration, real Production build/READY and official-domain checks are recorded after this commit in:
`~/Documents/gyeol-validation/v4-mobile-book-gesture-event-copy-01/`.
A Preview READY result alone is not a Production completion claim.

Original checkout remains on its original branch/SHA. Its 11 dirty files, existing worktrees/refs and Git objects are preserved; only this new worktree/branch plus explicitly authorized remote feature/master updates are intended metadata changes. Existing 3193/3194 review servers and their browser storage are not replaced. Local task verification uses 3195 with existing local-only safeguards. No secrets or ignored environment files were copied.
