# Phase 12C — Local manual content and experience review

Base: `6a46d2f5efe6bb027b499ff3d84ec2439060fdac`, branch `v4/rebuild`.
Scope: review harness only. Narrative, calculation, MBTI/bridge, footnotes, chapter layout, customer Book design and public activation are unchanged. This document does not assess or propose changes to the report prose.

## Start / review routes

```sh
node scripts/start-v4-manual-review.mjs
```

- Six independent books: <http://127.0.0.1:3193/dev/content-review>
- Login onward / all existing local features: <http://127.0.0.1:3193/dev/content-review/experience>
- Stop the local server with Ctrl+C. No `.env` file is changed. The launcher supplies process-only external-writer/payment safety overrides and `NEXT_PUBLIC_LOCAL_REVIEW_SILENT=1`.
- Use the same browser/profile and origin for saved cases. Different browsers do not share IndexedDB.

## Two intentionally separate boundaries

| Mode | What happens | What does not happen |
| --- | --- | --- |
| Content cases A–F | Arbitrary canonical input → actual deterministic generation → complete Book; browser-only review storage | No payment order, ticket redeem, coupon redemption, campaign/referral grant, ownership/library write, analytics dispatch or Meta Purchase |
| Full experience hub | Links to existing localhost mock account, checkout, library, ticket, coupon, share, referral and campaign UI; explicit fixed fixture preparation | No real OAuth, Toss, production DB, production ownership, SDK delivery or operational Meta events |

The user explicitly approved multi-file changes and isolated mock business ledgers for the second mode. Mock ledger creation is **not** described as zero writes; the first mode never enters that path. Login and coupon/reward fixtures remain the existing implementations, not a new auth/payment engine.

## Production inaccessible

- Layout, each page and API check the server environment before importing generation/presentation. Only development/test on explicit loopback Host is accepted; deployed Vercel/CI environments are rejected.
- POST additionally requires matching Origin. Missing Host, other host, production NODE_ENV, query and cookie activation attempts cannot unlock it.
- Generator is server-only and also refuses non-development/test execution.
- Public Book and Auth code gates remain `false`; no new public customer buttons or redirects.
- Verified the actual local production build on port 3194: dashboard, `?review=1` + cookie, book URL, experience hub and POST API all returned 404. Temporary production-mode server is not a deployment.

## Cases / actual editable contract

| Case | Product | Extra fields |
| --- | --- | --- |
| A | `saju_mbti_full` / 나라는 사람 | Current work/context, relationship, focus areas |
| B | `career_money_study` / 내가 잘되는 방식 | Job status + raw detailed job, relationship, focus areas |
| C | `love_marriage_child` / 내 사랑 이야기 | Exactly the six existing relationship statuses |
| D | `saju_mbti_compatibility` / 우리라는 사이 | Two independent people; seven categories; canonical fixed roles |
| E | `major_fortune` / 앞으로의 나 | Existing Dayun-required gender/time validation + current context |
| F | `annual_fortune` / 나의 선택연도 | Existing commerce selected-year policy + current context |

Shared editable person fields: name, solar DOB, gender, exact clock time / approximate canonical time slot / unknown, all 16 MBTIs and unknown. Single-person cases also expose all existing job statuses, detailed job (200-character input limit), relationship status and focus areas. Compatibility does not invent job fields absent from its actual person contract.

`Fields`/`MbtiInput` are exported from the existing Book form without changing their behavior. `bookInputPayload`, canonical `normalizeReportInputPayload`, existing `personErrors` and the V4 runtime context validator are reused. There is no QA schema that accepts extra invalid values.

Annual year options come from `getAnnualFortuneCommerceYearPolicy(now)`: at the verification date the actual range was **2021–2026**. Future 2027 is intentionally rejected, not silently added to the existing product contract. The server supplies the current generation clock; it is not a client override.

Compatibility categories: love, marriage, parentChild, coworker, managerReport, businessPartner, friendship. A=parent/B=child and A=manager/B=team member remain fixed. No score/grade is introduced. Unknown time/MBTI is never inferred; existing Dayun uncertainty rejections are surfaced rather than bypassed.

## Actual pipeline / completeness

`bookInputPayload` → canonical input validation → **`generateV4ShadowReport`** (existing six composers, calendar, MBTI and evidence) → versioned V4 packet → **`validateV4Publication`** → **`projectBook`** + safe share presentation → **`BookReadingPresentation` / BookReading / BookReader**.

No fake zero-price purchase, worker queue, persistence snapshot or authored fixture prose is involved. Only the entitlement boundary is omitted. Exact generated paragraphs, tables, evidence digest and final line are compared against direct current-engine output in tests. Internal calculation summary stays in the separate dev facts panel, not customer pages.

Status events are validating → generating → validating-output → ready / failed. Validation/generation/completeness/projection errors carry a short reference; reader errors have a separate render boundary. Raw stack traces are not placed in the Book. Corrupt final output cannot become ready.

Major: use the actual “시간의 흐름” page; all **14 years**, past 3/current/future 10, ages, transitions and linked narratives remain readable. Annual: actual “올해의 12장면” overview and **12 monthly chapters**, in existing Jie order, plus opening, Dayun cross, final and appendix.

## Persistence / regenerate / reset / feedback

- No automatic generation on load. Each case has its own editable form, generation UUID, status and result.
- Inputs and results use only IndexedDB `gyeol:manual-content-review:v1`, six case records. This avoids six long books exceeding localStorage quota. No account/profile storage key is reused.
- Editing a field aborts its old request and removes that case's ready result immediately. UUID checks suppress late responses. Per-case queued writes prevent old saves overtaking new input/results.
- “책 펼쳐보기” and “새 탭에서 열기” appear after the complete result is saved. Return using the Book close link or the dev tool. Input/result remain available after reload.
- A previous-generation URL cannot load a replaced result. Case Reset clears only that case; 전체 Reset asks confirmation and clears all six review records. It does not clear mock account ledgers or unrelated browser data.
- Storage failure is explicit; regenerate after fixing browser storage. A partially saved book is not exposed as ready.
- “검수 정보” contains actual canonical input, product/version, generated clock, digest, chapter count, completeness, computed pillar/time summary. “검수 정보 복사” copies that context, not the full report. In the reader it is a collapsed dev-only tool outside Book content.
- Feedback format: case + copied facts + chapter title + exact problematic sentence + what the user expected. Content changes wait for the user's feedback.

## Full feature / UIUX review instructions

1. Use the dedicated launcher above so **all** local routes suppress client analytics dispatch/fact polling, not just content review. The hub withholds feature links if that launch flag is absent.
2. Start with 비회원 book shelf → choose product → enter information → receipt/required agreements. No real financial action is performed by existing internal routes.
3. Open 로그인: Kakao/Google are two existing mock identities. Check 가입 동의, legal details, individual/all agreement, logout/re-login, account info and empty library.
4. After mocked membership, prepare a fixed ticket or coupon scenario from the hub. Inspect balances in the library and selection/application in the receipt. Fixed codes: GYEOL300, 20PERCENT, CAREER_ONLY, EXPIRED, MEMBER_ONLY. A separate explicit button arms the existing next-publication-failure fixture.
5. Publish through the local purchase/ticket path, inspect ownership/library/reopen and actual back-cover sharing. This mode intentionally uses local mock ledgers. It never contaminates six content cases.
6. Prepare campaign fixtures explicitly, then inspect active/none/paused/draft/ended/future campaign links. Existing members do not receive another signup benefit. To review genuinely fresh mock membership, restart the server before signup.
7. For referral, use a generated local book's existing share/invitation UI. Open the received local URL in another browser profile and use the other mock provider identity. Inspect receiver, qualification/reward and duplicate suppression using the existing system. Do not send actual Kakao messages.
8. Legal/footer and varied/expired library previews are linked individually. External support/social URLs are presentation checks only.

**Not certified by this harness:** real OAuth callback/provider settings, real payment/refund, real SDK message delivery, production analytics ingestion and real account recovery. Those remain separately gated integrations. No new account-delete/password/provider behavior is invented when absent from the current product.

## Verification / artifacts

| Check | Result |
| --- | --- |
| Actual six different inputs, generation/Book projection/all chapter SSR, direct-engine parity | PASS |
| 7 compatibility categories, two directions, roles/no scores | PASS |
| Exact / approximate / unknown, MBTI unknown, invalid input and selectedYear rejection | PASS |
| Major 14/14 + future10 / Annual 12/12 | PASS |
| Concurrent independent cases, new generation identity, stale-event suppression, corrupt-output rejection | PASS |
| Route gating incl real production runtime / analytics suppression and public gates unchanged | PASS |
| Final full suite after explicit dev-consumer boundary update | 5,951 PASS / 0 FAIL; 434 files |
| Final added review-specific tests, including past year and corrupt output | 25 PASS / 0 FAIL |
| Browser six cases generate/open/return/regenerate/reload; Case Reset isolation / stale URL / new tab | 6/6 PASS |
| Browser page walk | 100 actual Book pages across Comprehensive/Compatibility/Major/Annual + 12 viewport checks; no overflow |
| 390 six Book smoke; 390/430/768/1440 dashboard | PASS, console errors/hydration errors 0 |
| Mock login → consent → library, ticket/coupon/campaign fixture setup | PASS; local measurement storage empty / external measurement requests 0 |
| lint / build / diff-check | PASS |
| TypeScript | Existing 390 diagnostics; zero new diagnostics |

Build emits **9 NFT tracing warnings** from the existing broad local database tracing chain (prior phase recorded 8); build succeeds. No bundler/configuration refactor is included. The new public client bundle does not import the review harness; generation is lazy behind the server guard.

Artifacts: `/tmp/gyeol-v4-12c/` contains six test input exports, packet projections, `browser-report.json`, `pages-report.json`, `production-404.log` and screenshots (case-A…F covers, manseryeok, MBTI, footnotes, appendix, timeline, months, share, dashboard sizes, login/library and experience hub). Test/lint/build/tsc logs: `/tmp/gyeol-12c-*.log`.

Reproduce automatic browser checks after the unit fixture export with `scripts/verify-v4-manual-review.mjs` then `scripts/verify-v4-review-pages.mjs` (`AGENT_BROWSER_BIN` can select the installed CLI). Automated checks do not replace the user's manual reading.

## Before Content Parity Audit

Use all six independently chosen people and compare input facts against the current generated book; read each chapter, table, appendix and final line. Check unknown-time behavior, roles, all 14 years/12 months, then supply concrete feedback. **No editorial assessment, content rewrite or Final Content Parity Audit has been performed in this phase.**

Implementation blocker: none in the tested local harness. Production activation, real providers, public UI changes, migrations, master merge and deployment remain prohibited/deferred.
