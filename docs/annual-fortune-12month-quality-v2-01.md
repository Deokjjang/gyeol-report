# Annual fortune 12-month narrative V2

## Scope and ownership

The `annual-reading-v2` interpretation plan consumes the existing
`annual-month-jie-kst-v2` calendar segments. It does not calculate new pillars,
Dayun, branch relations, commerce years, or strength/luck scores. The generation
handler builds it once, after customer Dayun and the selected-year evidence.

New reading order: annual gains/costs and 2–4 core factors → dated Dayun × effective
annual periods → work/money/relationships/study-growth → important months → all
12 calendar months with exact segments → foundation tables → action standards.
The existing components, palette, native details and calendar-month layout remain.

`buildAnnualFortuneReading` owns selection and interpretation. Fallback and writer
receive the same plan; the writer must preserve server-owned publication fields.
The gate compares the stored plan with its deterministic derivation and verifies
publication fields, in addition to the existing exact-month/Dayun/input gates.
It rejects invented tiers, reason IDs, intervals, Bridge types and domain claims.

## Selection and factual boundaries

- Transition: effective annual pillar changes at LiChun, actual Dayun transition,
  or an uncertain Dayun interval. A routine monthly Jie does not automatically
  make every month important.
- Focus: newly starting segments with natal month/day clash or punishment first;
  then Dayun/annual clash or punishment; then a shared annual ten-god family with
  an actual six-combination/three-combination fact. At most three nontransition
  focus months are expanded; chronological order breaks equal-priority ties.
  This is a transparent explanation budget, not an intensity calculation.
- Basic: retains pillar, ten-gods, actual balance and an action. A continued
  segment at a calendar-month boundary reviews the preceding segment rather than
  presenting the same fact as a new event. Weak fact duplication cannot promote
  a month.
- Every reason preserves supporting IDs. Every narrative segment keeps its
  original `[startKst, endKstExclusive)` and evidence IDs. Annual core IDs refer
  to the selected-year ten-gods, elements, natal interaction and Dayun basis.
- Pre-LiChun passages use the segment's effective annual pillar/ten-god, not the
  selected calendar year's post-LiChun pillar. A Dayun-only split keeps the month
  facts and explains the changed background separately.
- Conditional Dayun candidates remain conditional. Supporting and friction facts
  from candidates are not asserted to occur simultaneously. Before-first-cycle
  uncertainty retains that possible state.
- Work/money/relationship/growth use distinct questions from existing ten-god
  interpretations. Money is resource-operation behavior, not a return forecast.
- Bridge scenes are selected only from validated `fortune-flow` interactions for
  the supplied MBTI type. Zero matching interactions means zero added scenes;
  neither missing MBTI nor missing Bridge evidence is guessed.

## Deterministic before/after evidence

Baseline: master `9eb4e151fe9a8378f50dd9370e2ba7fb82df009a`. Same inputs, selected
years and injected September 23 clock; writer disabled. Both versions pass
publication then SSR. Text measurement strips tags/entities, collapses whitespace,
splits on sentence-ending punctuation and counts exact sentences of 40+ characters.
Counts include text in expandable details. They are not a semantic quality score.
Before capture preceded source edits; after uses the same temporary capture,
removed after verification. Permanent tests retain the inputs and baseline limits.

| Customer | Birth / gender / MBTI | Selected year | SSR chars before → after | Repeated 40+ sentences | Unique 40+ sentences |
| --- | --- | --- | --- | --- | --- |
| A | 1996-12-06 14:15 / male / ENTJ | 2026 | 17,213 → 18,486 | 57 → 2 | 136 → 168 |
| B | 1980-05-15 09:30 / female / ISFJ | 2026 | 15,363 → 17,739 | 45 → 6 | 119 → 171 |
| C | 2001-08-20 16:20 / male / ENFP | 2025 | 16,917 → 19,621 | 54 → 5 | 134 → 182 |
| D | 1996-12-06 14:15 / male / missing | 2027 | 17,114 → 19,048 | 57 → 3 | 133 → 173 |
| E | 1999-07-31 / approximate JINSI / male / INTP | 2027 | 16,688 → 20,347 | 60 → 11 | 128 → 184 |

All inputs use solar/fixed KST. Sum of shared long-sentence intersections across
the ten customer pairs: **361 → 318**. This is a pairwise sum, not 318 distinct
sentences. Shared interpretation vocabulary remains; it is not claimed eliminated.
Numbered filler and the checked generic advice patterns are zero in the new SSR.

| Detail tier | Months across five reports | Narrative chars min–max | Average |
| --- | --- | --- | --- |
| Basic | 38 | 466–575 | 508 |
| Focus | 15 | 720–1,066 | 769 |
| Transition | 7 | 860–1,681 | 1,098 |

These density counts include core/balance/scenes/actions only, excluding fact
details and headings. All 60 months / 124 exact segments are retained. No segment
is replaced with a representative month pillar.

## Customer differences directly inspected in SSR

- A: competition/shared resources meet equal collaboration; February transition,
  May/July/October focus. January retains the pre-LiChun annual ten-god.
- B: alternative exploration meets learning/support; February transition,
  March/June/August focus. Its resource/learning questions differ from A.
- C: December includes the exact 2025-12-03 00:20 KST 甲午 → 癸巳 transition.
  February/December transition, May/June/September focus.
- D: February includes LiChun and the 2027-02-21 12:15 KST 壬寅 → 癸卯 transition.
  MBTI and Bridge traits are not inferred.
- E: May preserves the 2027-05-13 07:00 through 2027-05-23 06:59:59 KST possible
  transition window between 己巳/戊辰. The exact pillar persists across Dayun-only
  splits; candidate relations are conditional. February/May transition,
  January/June/October focus. No matching validated fortune-flow Bridge is added.

## Compatibility and verification

Snapshots without `annualReading` retain their existing approximate-month or
precise-month validator and renderer. Reading does not backfill them. New optional
plan versioning is separate from the calculation version; future changes to this
plan's derivation must preserve the old contract or introduce a new version.
No DB/schema/configuration change or production patch is needed.

Permanent regression covers five publication/SSR cases; 12 differentiated month
descriptions; density preservation; important-month reasons/IDs; exact intervals;
neutral/mixed facts; non-count-based ranking; conditional Dayun; approximate and
unknown-time windows; MBTI-only counterfactual; tamper rejection; mocked writer
parity; and old precise-month snapshot compatibility. Existing 48 Jie boundaries,
144 customer-month cases, canonical calendar/Dayun and other five product suites
remain unchanged.

Final local checks (2026-09-23): `pnpm test` **358 files / 3,752 tests PASS**;
`pnpm lint`, `pnpm build`, `git diff --check` **PASS**. `pnpm exec tsc --noEmit`
still exits 2 with the baseline **387 test-only diagnostics**. Comparing diagnostic
messages with line positions and union ordering normalized gives **0 new / 0
removed**; production source diagnostics remain **0**. The new quality suite adds
19 behavioral tests. Vitest's existing network guard forbids real fetches; writer
verification uses a supplied mock transport. The temporary capture test is removed.

Remaining quality work: selected fact types still share some domain/action
language between customers. More editorial variety must stay evidence-based.
The three-focus-month budget can be evaluated with user reading feedback; it is
not a claim that other months are inactive. Real model prose was not evaluated.
This task uses deterministic fallback, mock writer and SSR only, with no provider
calls, production writes or deployment.
