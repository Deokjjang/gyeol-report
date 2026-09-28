# Phase D — Love / Marriage / Child V3

## Scope and contracts

- Branch: `v3/rebuild`. Version: `love_v3.0-editorial.1`.
- Opt-in: `productOptions.contentVersion = "v3"` at the existing local preview boundary. Existing paid/default generation is unchanged.
- The original Love calculator/evidence builder is reused verbatim; the only legacy-handler edits export those two functions. No new saju calculation, MBTI database, score, provider call, payment or persistence migration.
- Canonical states remain exactly: 미선택 / 솔로 / 썸 / 연애 / 결혼 준비 / 기혼. No breakup/reunion state or fixture.
- Unknown or approximate birth time stays on the validated conservative legacy path, including when a writer is enabled. Unknown MBTI adds no inferred type or fusion.
- Version-specific validation replays the draft from stored evidence. Legacy Love and prior Comprehensive/Career snapshot versions keep their original readers/builders.
- Common composer and other five products are unchanged. Existing composer already permits no-advice blocks and varied forms; globally rewriting it would break frozen snapshots.

## Customer experience

Title → raw relationship/MBTI input panel → contents → existing integrated Manse/element table → 10 main signals + full expansion → MBTI → nine editorial chapters.

Only the actually-used `가족` focus appears as an additional input. It opens the hypothetical parenting section; otherwise that section starts collapsed. DOB/time are not repeated in the compact panel.

Ten existing ten-god portraits supply distinct motivation, expression, attraction, comfort, overuse, domestic life, parenting and final lines. Selection uses the existing substantial-evidence gate and existing weights. The day branch's already-calculated main hidden stem can supply the domestic portrait only when independently substantial; the spouse-palace fact remains supporting. This is not a prediction about a future spouse.

Six authored situation paths differ in scenes and final perspective:

| State | Present-day experience |
| --- | --- |
| 미선택 | Comfortable conversations, remembering a person; no assumed partner |
| 솔로 | Groups, first impression, personal attraction vs friends' approval, second meeting |
| 썸 | Initiating a message, ambiguous friendliness, an actual invitation and reciprocal effort |
| 연애 | Changed tone, everyday response, hurt, contact after an argument |
| 결혼 준비 | Budget, housing, family expectations, shared priorities and decisions |
| 기혼 | Invisible household work, living costs, family boundaries, rest and recovery |

Sixteen exact local MBTI love-trait paths change approach and conflict behavior, with the same caring style applied hypothetically to the adult as a parent. Unknown stays unknown. No fixture name/date/job is used as a copy-selection condition.

Examples:

- Confirmed 도화 + ENFP: “반가운 반응이 보이면 표현이 더 밝아지고 새 이야기거리가 이어집니다.”
- Confirmed 홍염 + INFJ: “처음에는 조용히 듣던 사람이 깊은 대화에서 세심한 질문을 건넵니다.”
- Confirmed 현침 + ENTJ: notices a tone change and quickly looks for reasons/solutions.
- The same 현침 + INFP: remembers an exact expression that touched sincerity or values.
- Gaon has none of those three features. Gaon's ENTJ fusion therefore uses the actual strong peer/cooperation motif, not fabricated 현침.
- Gaon's blunt observation: “둘이 한 팀인데 점수판을 혼자 켜는 순간입니다.” This is figurative prose, not a compatibility score.
- Positive relationship luck: “사람복과 귀인의 좋은 패가 있습니다.” Only a substantial 천을귀인 anchor permits this passage.

Confirmed direct 도화/홍염 always receive distinct, uncollapsed main-body scenes. A legacy-derived day-reference charm with no position data (H) is retained as an explicitly supporting manifestation alongside a substantial anchor, never promoted into the opening hero, compound or final identity. Weak/conditional or absent charm is not used. The shared prominence gate is not loosened.

합/충 and 원진 are used only where the unchanged canonical evidence supplies them. No 형/파/해 algorithm is added. These are the customer's natal relationships, not a fabricated partner chart or a promise about marriage/breakup.

All conclusions have five paragraphs and combine personal motivation, positive strengths, current relationship context and comfortable daily life. The 12 fixtures produce six distinct final archetypes. Prose, quote, punchline, observations and short tips all render; an action is not forced into every block.

## Fixtures and verification

| ID | Person / MBTI | State | Confirmed charm / special coverage |
| --- | --- | --- | --- |
| A | 가온 / ENTJ | 솔로 | Neither charm; day-involving 합, other-position 충; representative |
| B | 라온 / ENFP | 솔로 | Both 도화 and 홍염; 현침; several actual 합 |
| C | 도윤 / ENFP | 연애 | 도화 only |
| D | 유나 / INFJ | 연애 | 홍염 only; 현침 |
| E | 서연 / ISFJ | 솔로 | Neither charm; 원진 + 충 |
| F | 수현 / ISTJ | 기혼 | Family focus; parenting expanded |
| G | 나래 / ENFJ | 결혼 준비 | Day-involving 충 |
| H | 다온 / ESFP | 썸 | Existing derived 도화, supporting treatment |
| I | 마루 / 모름 | 미선택 | Gender unspecified; no inferred MBTI or partner |
| J | 가온 / INFP | 연애 | Same natal chart as A, changed MBTI/state |
| K | 이든 / INFJ | 기혼 | Both charms; same chart as B, different MBTI/state |
| L | 하람 / ESTJ | 결혼 준비 | Neither charm; 천간합 |

- Love targeted tests: **31/31 pass**.
- Related targeted suite: **380/380 pass, 19 files** (including prior Comprehensive/Career exact snapshot hashes).
- 12 charts × 16 MBTI + unknown: **204 combinations pass**, 16 distinct fusion paragraphs on each chart; calculation hashes unchanged by MBTI.
- Same chart × all six relationship states: six distinct situation/conclusion passages; one unchanged calculation hash.
- All 12: generate → publish → JSON snapshot roundtrip → full-page SSR pass. Local HTTP create returns 200, exact V3 version, **0 external calls**.
- Actual browser: **12 × 390/768/1440 = 36 pass**; all tables/MBTI/child panels expanded, no document or element horizontal overflow, no browser errors/overlays. Major signals show the existing 10-row default plus full expansion.
- Backend/source IDs in full SSR HTML: **0**. Missing/weak feature used as hero: **0**. Present charm body coverage: **100%**, with H explicitly supporting. Absent charm invented: **0**.
- Authored paragraph-role counts, as a review aid rather than a quality KPI: character **67.0–72.1%**, explanation **15.6–20.3%**, advice **9.5–15.3%**. More than 70% of blocks have no advice part. Semantic/editorial reading was also reviewed manually.
- `pnpm lint`: pass. `pnpm build`: pass. `git diff --check`: pass.
- Full suite: **4,307 passed / 4,310 total**, same three pre-existing failures: `legalPagesSource.test.ts`, `policyPagesSource.test.ts` (old legal date expectations), `compatibilityPreviewPageSource.test.ts` (removed numeric score-label expectation). No unrelated test/source changes.
- Standalone TypeScript check still has the existing unrelated test diagnostics; **no source or new Love-file diagnostics**. This is not reported as a globally clean `tsc` run.

Reproduce the new fixtures offline:

```sh
LOVE_D_REVIEW_OUTPUT=1 pnpm exec vitest run tests/unit/interpretation-v3/loveEditorial.test.tsx
```

This exports body text/evidence under `/tmp/gyeol-love-d-{A..L}.{txt,json}`. For local API review, explicitly supply `productOptions: { contentVersion: "v3" }`: stored normalized `inputBasis.productOptions` deliberately omits that preview-only option.

## Review artifacts

- Representative Gaon: http://127.0.0.1:3100/reports/report_a9lhixbhq9d1c
- Both charms (B): http://127.0.0.1:3100/reports/report_svqkh2xxu76n6
- 홍염 + INFJ (D): http://127.0.0.1:3100/reports/report_oki3xxpv5up6y
- Full Gaon customer-visible text, including all expanded tables: [LOVE_EDITORIAL_PHASE_D_REVIEW.txt](./LOVE_EDITORIAL_PHASE_D_REVIEW.txt).
- Local-only 36-screen measurements: `/tmp/gyeol-love-d-browser-results.json`.

URLs are local preview-memory artifacts, not Production deployments; restarting the preview server can invalidate them. Phase E is not started.
