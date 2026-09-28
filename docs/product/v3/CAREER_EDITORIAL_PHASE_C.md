# Career V3 — Phase C review

Date: 2026-09-28. Branch: `v3/rebuild`. Content version: `career_v3.0-editorial.1`.

## Review artifact

Representative 가온 / employee / B2B SaaS 영업기획 / ENTJ:
[Local final report](http://127.0.0.1:3100/reports/report_5be8hri4k92z4).

`CAREER_EDITORIAL_PHASE_C_REVIEW.txt` is the actual rendered article text, including the TOC, all Manse/elements/signal/MBTI panels, collapsed role alternatives and the entire body. All panels were expanded before extraction. Footer/share controls are outside the report article and are excluded. This is a local `preview_memory` URL, not a Production deployment; restarting the local server can clear it.

## Scope and compatibility

- Explicit Career V3 generation option only. The local create endpoint selects it with `productOptions.contentVersion: "v3"`.
- No OpenAI/Job Enricher calls. Explicit V3 bypasses even an enabled writer runtime. No new scoring, calendar, MBTI source, payment, DB, persistence migration or deployment behavior.
- Existing `career_money_study` V1 drafts and default paid generation remain on their existing contract. Unknown/approximate birth times keep the validated conservative deterministic V1 path; they are not upgraded into exact-time editorial claims.
- Career V3 consumes the same canonical calculation, natal table, source traits and Common Core prominence/compound rules. Weak or unsupported evidence cannot anchor an editorial scene.
- V3-specific work taxonomy adds care, education, regulated analysis, service and field work while preserving the original interpreter's output for other products. Multiple descriptors merge rather than overwrite (SaaS + sales + planning + CRM).
- The existing comprehensive upper-table component is exported for reuse with a smaller evidence-usage type. Its JSX/output are unchanged; no site redesign. All six Phase B draft hashes are fixed in a regression test.
- Read/publish validation rebuilds the versioned Career draft from stored evidence and compares the exact object. Existing paid snapshots are neither migrated nor rewritten.

## Editorial review

Current-work scenes lead: requirements/reviews for developers, handover/safety for nursing, understanding/lesson preparation for teachers, repeat customers/cost/delegation for owners, scope/rates/payment dates for freelancers. No enormous per-job narrative catalog: behavior is authored by existing natal meaning, exact MBTI trait, normalized work structure and life status.

Employee body stays centered on the current role across identity, strengths, friction, collaboration, compensation, progression, learning, fortune and next environment. Other occupations are a collapsed auxiliary chapter near the end. Students get learning as the second chapter and substantially more learning material; job seekers move from environment/problem to role examples and concrete entry routes.

Character body share across 12 fixtures: 72.3–74.8%; advice: 12.3–17.4%. These are authored paragraph-role annotations and aid review, not a claim of automatic semantic quality measurement. No character-count KPI. Prose, observations, punchlines, quotes and short tips vary; consecutive tone repeats are rejected. Questions remain brief. Money concerns behavior and resources, never a promised investment outcome.

The first minute shows a working character, a work-specific moment and actual MBTI behavior. Precision + ENTJ changes into correction/order; precision + INFP into quality/value boundaries. Expression + ENFP and responsibility + ISTJ have separately authored manifestations. Unknown MBTI does not acquire a guessed type. Strong positive signals become concrete career assets, not conditional rewards for effort.

## Fixtures

All below: local create 200 → publish PASS → actual SSR PASS; external calls 0; backend IDs in HTML 0. Twelve charts/status inputs × 16 MBTI types + unknown = 204 validated combinations. Seven distinct dominant endings in this fixture set.

| ID | Context | Final local report ID |
| --- | --- | --- |
| A | 가온 / B2B SaaS 영업기획 / employee / ENTJ | report_5be8hri4k92z4 |
| B | 도윤 / 백엔드 개발자 / employee / INTJ | report_7q1f27whop6xr |
| C | 서연 / 병원 간호사 / employee / ISFJ | report_6mywr088vmk5k |
| D | 나래 / 중학교 교사 / employee / ENFJ | report_tlx0t6p01a6f5 |
| E | 다온 / 카페 사장 / self_employed / ESFP | report_e82mbuuz67vis |
| F | 이든 / 영상 크리에이터 디자이너 / freelancer / ENFP | report_qcz1iz38a0k07 |
| G | 수현 / 세무 회계 전문직 / employee / ISTJ | report_vofsavbblwvkd |
| H | 라온 / 콘텐츠 디자인 / student / INFP | report_xfgw6hmypupji |
| I | 마루 / job_seeker / INTP | report_mbw2crb875apx |
| J | 지온 / 생산관리 / employee / MBTI unknown | report_b36b892ldjkes |
| K | 유나 / 네일아티스트 매장 대표 / business_owner / ISFP | report_zn29p3h3up3jl |
| L | 하람 / 행정 공무원 / employee / ESTJ | report_km33a6us3sitk |

Counterfactual checks preserve the natal calculation while changing work: eight jobs on one chart; all 16 MBTI types plus unknown; employee → business owner. Behavioral content, work scenes and status-specific chapters change, not merely evidence chips. No unsupported/weak hero, invented attraction signal, repeated exact sentence or internal source ID is accepted.

## Verification

- Targeted: 18 files / 370 tests PASS (core, all comprehensive versions, Career, local create/full result route, existing completed paid reading, six-product deterministic regression, persistence boundary, common tables).
- Full suite: 4,259 / 4,262 PASS; three pre-existing failures remain untouched: `legalPagesSource.test.ts`, `policyPagesSource.test.ts` (old legal date), `compatibilityPreviewPageSource.test.ts` (removed legacy score marker).
- `pnpm lint`, `pnpm build`, `git diff --check`: PASS.
- Supplemental full `tsc --noEmit`: existing 384 test diagnostics; zero source/new Career test diagnostics. This is not a clean full-project standalone typecheck claim.
- Local browser: A/B/C/E/F/H/I/J × 390/768/1440, all panels expanded: viewport equals document width; visible-child overflow 0; error overlay 0; browser errors 0. Manse/MBTI buttons successfully hydrate; all intended expandable panels open. Employee alternatives are collapsed on first load; TOC anchors resolve.
- Browser and React skill checks kept evidence graphs server-side; only existing allowlisted table display data reaches client components. No new client state or data fetching.
- Screenshots: `/tmp/gyeol-career-final-390.png`, `-768.png`, `-1440.png`.

Protected dirty files `.gitignore`, `AGENTS.md`, `supabase/.temp/` are excluded. Push only `origin v3/rebuild`. STOP after C; do not start Phase D automatically.
