# Phase D2 — Love final editorial polish

## Scope / compatibility

- Branch `v3/rebuild`; new explicit-V3 copy version `love_v3.0-editorial.2`.
- D's calculator, input normalization, six relationship states, MBTI sources, charm detection, prominence gate, compounds, top UI and evidence packet are unchanged. No other product, provider, payment, database or Production changes.
- D's builder and copy remain frozen. Generation uses D2; validation dispatches by stored version. All 12 D draft SHA-256 hashes are pinned and still publish/render. Legacy non-V3 and unknown/approximate-time paths also remain readable.
- This is an authored Love-only pass over D's existing scenes, not a new scoring/interpretation engine. Only already-substantial evidence can lead a scene; relations/spouse palace and positionless derived charm retain their supporting status.
- The Next.js server-boundary check kept internal evidence graphs out of customer HTML. Browser verification covered local create → memory snapshot → SSR → hydrated interactions, without external services.

## Gaon: distributed character, not a replacement monopoly

Before: 겁재 appeared in 14 of 21 scenes. After: 3 of 21 (opening, recognition question, whole-person ending).

| Scene role | Actual leading evidence in D2 |
| --- | --- |
| Opening / belonging | 겁재 |
| Trust that attracts attention | 정관 |
| Quietly remembering a person | 편인 |
| Love expressed through accumulated time | 정축일주 + 식신 + supporting 배우자궁 |
| Everyday charm / care / hypothetical parenting | 식신 |
| Overdone standards | 정관 |
| Trying to solve a partner's problem | 편관 + actual ENTJ love trait |
| Solitude and different conversation speeds | 화개; actual 충 remains supporting |
| People luck | 천을귀인 |
| Softening tension / finding a point of contact | 천덕귀인; actual 합 remains supporting |

Nine different leading facts; the most frequent leads 6/21 scenes, with different manifestations. No weak 재성, absent 현침/도화/홍염, or unqualified 고신 is promoted to fill a slot. The day-pillar passage is selected by actual `정축` evidence, never a fixture name/date.

## Reading experience

- Dictionary tails and analyst explanations are removed from D2 body paragraphs. The original professional tables remain intact. Body tags abbreviate actual relations, e.g. `子丑 육합` / `巳亥 충`.
- Gaon has 19/21 blocks without an advice part. One-line punches, prose, quoted perspective, paired observations and two short tips retain the existing ivory/wine presentation. No new UI structure.
- Pure-fun observation: “연애에서도 은근히 승부욕이 있습니다. 응원석에 앉았다가 어느새 유니폼까지 입고 있는 쪽입니다.”
- Partner perspective: “본인은 챙김으로 다 표현했다고 생각하는데 상대에게는 가끔 자막이 필요합니다.”
- Friend perspective: “친구에게는 아직 잘 모르겠다고 하면서 그 사람에 관한 설명만 유독 자세해질 수 있습니다.”
- Light blunt humor: “연애 상담을 듣다가 마음속 솔루션 센터가 먼저 열립니다.” Seven recognizable humor/reversal moments in Gaon: uniform, friends noticing, subtitles, relationship evaluation, solution center, an exhausting perfect calendar, the adult over-invested in a child's craft.
- Parenting stays conditional and describes the adult, not a child's future. Family-focus collapse behavior is unchanged.
- Five-paragraph endings combine actual character, good relationship resources, current state and domestic intimacy. Gaon's last line: **“같은 편인 사람 앞에서는, 매번 이길 필요가 없습니다.”**
- Authored-role metrics are review aids, not a semantic quality score: explicit advice is 6.2–9.5% across the 12. Reflective direction can also be present inside character prose. No text was padded to hit a length/ratio KPI.

## Six states / counterfactuals

Same chart, unchanged calculation hash, six different selected situation angles, scenes and conclusion paragraphs:

| State | Concrete focus |
| --- | --- |
| 미선택 | Comfortable conversations and noticing one's response; no assumed partner |
| 솔로 | Group encounters, remembering details, friends noticing, wanting a second conversation |
| 썸 | Initiating a message, an actual invitation, reciprocal questions/time |
| 연애 | Familiar affection, hurt, an everyday message after an argument |
| 결혼 준비 | Budget/home/family expectations and how two people decide |
| 기혼 | Invisible domestic work, different recovery rhythms, living costs and family schedules |

The existing 12 fixtures A–L are unchanged. Added QA uses C's actual chart with state 솔로; no invented natal facts or new relationship state.

Actual rendered-text review:

- **Dohwa only / single (C-single):** “사람의 시선에 들어오고 첫인상을 남기는 도화의 매력이 있습니다.” ENFP expression changes the public scene; no 홍염 passage.
- **Hongyeom only / dating (D):** “가까워질수록 매력이 커지는 홍염의 기운이 있습니다.” INFJ's intimate questions change the scene; no 도화 passage.
- **Both (B):** separate uncollapsed first-impression and second/third-meeting scenes; not merged into one meaning.
- **Neither (A):** no 도화/홍염 text anywhere in the customer article.
- **Derived positionless dohwa (H):** remains a mild supporting manifestation alongside a strong anchor; never the opening/final hero. Weak/conditional charm counterfactuals produce neither passage.
- **MBTI:** 12 charts × 16 types plus unknown = 204 combinations. All publish; 16 distinct approach paragraphs per chart. Unknown adds no MBTI assertion. Existing actual 현침 + ENTJ/INFP paths remain different.

## Validation

- Love tests: **47/47 pass** (31 prior-contract tests plus 16 D2 tests).
- Related targeted suite: **396/396 pass in 20 files**, including Comprehensive/Career frozen snapshots.
- All 12: generate → publication → JSON snapshot → SSR. Local HTTP creates return 200 with **0 external calls**; the dohwa-single counterfactual also passes.
- Actual browser: **39/39 measurements** (12 fixtures + C-single × 390/768/1440). All expandable tables/MBTI/parent sections checked; no document/element overflow, runtime error, hydration warning or overlay. Existing 10 major signals + full expansion preserved.
- No backend/source IDs in full SSR HTML; no missing/weak fact used as hero; no absent charm invented. Composer rejected scenes/warnings/errors: 0.
- `pnpm lint`, `pnpm build`, `git diff --check`: pass.
- Standalone `tsc` retains the 384 pre-existing test diagnostics; no Love/D2 source or test diagnostics. This is not a globally clean standalone TypeScript run.
- Full regression: **4,323/4,326 pass**. Same three pre-existing unrelated failures: legal date expectations in `legalPagesSource.test.ts` and `policyPagesSource.test.ts`, removed numeric compatibility label expectation in `compatibilityPreviewPageSource.test.ts`. These files were not changed.

## Review artifacts

- Final Gaon: http://127.0.0.1:3100/reports/report_pvrpu81ise4uq
- Dohwa-only single: http://127.0.0.1:3100/reports/report_se0i3ro477wz9
- Both charms: http://127.0.0.1:3100/reports/report_pwht1nwqrywg9
- Hongyeom dating: http://127.0.0.1:3100/reports/report_qrpfszhimgxvu
- [Full Gaon customer text, all panels expanded](./LOVE_EDITORIAL_PHASE_D2_REVIEW.txt).
- Local screenshots / 39 measurements: `/tmp/gyeol-love-d2-*.png`, `/tmp/gyeol-love-d2-browser-results.json`.
- Reproduce offline body/evidence exports: `LOVE_D2_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3/loveEditorialPolish.test.tsx`.

URLs are local preview-memory artifacts, not Production. Restarting that server can invalidate them. Unrelated `.gitignore`, `AGENTS.md`, `supabase/.temp/` stay excluded. Stop after D2; no Phase E work.
