# Compatibility directionality quality P0

## Scope and baseline

Baseline: `742e11e` (`fix: align career reports with customer evidence`). No calendar, Dayun, payment, DB, UI layout, price or MBTI source DB changes. All generation and SSR checks are local and deterministic; writer/repair use injected mock fetch. `tests/networkGuard.ts` rejects accidental network calls.

Original reproducible inputs (solar, Asia/Seoul, exact birth time):

- 가람: 1999-07-31 07:30, male, ENTJ
- 나래: 1996-12-06 14:15, female, INTP

At baseline, A is always described as speeding up to solve a problem and B as cautiously reviewing. Swapping the people changes the owner of that personality. This occurs despite passing publication checks. The old evidence direct findings, fallback analysis/chapters, deep element-complement scenes, prompt examples and legacy renderer all contribute positional assumptions.

Two related order dependencies were also confirmed by behavioral swap tests: `generates` received a different score from its inverse `generated_by`, and fire/water feature eligibility examined missing elements only in A and excess elements only in B. Both now evaluate the same pair fact symmetrically. No scoring weights or calendar calculations were invented.

## Data flow and contract

`canonical chart → person profile → two directed relations + category role context → evidence/direct findings → fallback or writer → validator → publish gate → existing renderer`.

- `compatibilityDirectionEvidence.ts` builds each person's natal features and MBTI source traits independently. Internal hashed attribution IDs exclude slot, partner, category and MBTI; they are not access tokens and are not rendered.
- Personal profiles retain actual day pillar, elements, visible natal features, MBTI communication/relationship/work/money traits, preference axes, function stack and compatibility use cases. Missing MBTI remains null with no invented traits.
- Each direction records subject, target, supporting evidence IDs, existing element relation and **target-as-viewer** cross-ten-god relation. No new Myeongli rules.
- Ordered notablePairs entries are separately retained with sourceType/targetType. Each entry contains claims about both named types; sourceType is the source viewpoint, not ownership of every claim. Shared summary arrays use a stable type order and preserve both source entries. Reverse source data is not substituted for a missing forward entry.
- The two fatigue paragraphs are deterministic evidence anchors. Writer and repair must retain them; normal free-form chapters remain writer-owned. Incorrect direction is rejected rather than silently rewritten. Repair now receives the original evidence packet as well as the invalid draft.
- Validation checks person/name/type/chart consistency; claim subject/target; evidence ownership on both sides; the receiving ten-god and source/target element direction; category role context; and the two exact anchors after existing display normalization. It does not claim to semantically prove every free-form sentence.
- The existing renderer's directional labels and fields were already aligned. Only its legacy fallback was changed: absent directional analysis no longer fabricates rapid/cautious personalities.

## Category roles

| Category | Role contract |
| --- | --- |
| love, marriage, coworker, businessPartner, friendship | Symmetric; no slot-based personality |
| parentChild | Role-asymmetric, but current input does not identify the parent |
| managerReport | Role-asymmetric, but current input does not identify the manager |

The current `report/new` UI calls its two inputs “첫 번째 사람” and “두 번째 사람”. `CompatibilityPersonInput.role` means personA/personB only. Consequently both domain-role assignments are null. Role-specific advice is conditional; names are not assigned parent/child/manager/report by age, gender or slot. Adding explicit role selection is a separate product/UI contract decision.

## Before / after measurement

Same customer pair, seven categories, both input orders, deterministic fallback → publish gate → `CompatibilityReportView` SSR. Baseline was executed from an isolated `git archive 742e11e` checkout with the same local dependencies. No provider calls.

Rendered character count strips HTML tags and normalizes whitespace, including headings/table text. Unique long strings split that text at sentence punctuation and count distinct segments of at least 40 characters; it is a lexical proxy, not a semantic quality score. Longform values flatten `relationshipAnalysis` strings and arrays. Pair-evidence count is deep pair-note count plus independently retained ordered MBTI pair entries (not every clause or personal trait).

| Category | Rendered chars before → after | Unique 40+ segments before → after | Longform values | Pair evidence |
| --- | ---: | ---: | ---: | ---: |
| love | 5,669 → 8,103 | 63 → 80 | 26 → 26 | 10 → 11 |
| marriage | 5,664 → 8,719 | 62 → 82 | 26 → 26 | 10 → 11 |
| parentChild | 5,710 → 8,336 | 62 → 78 | 26 → 26 | 10 → 11 |
| coworker | 5,693 → 8,131 | 63 → 80 | 26 → 26 | 10 → 11 |
| managerReport | 5,701 → 8,269 | 63 → 80 | 26 → 26 | 10 → 11 |
| businessPartner | 5,730 → 8,198 | 61 → 77 | 26 → 26 | 10 → 11 |
| friendship | 5,702 → 8,117 | 62 → 78 | 26 → 26 | 10 → 11 |

- Original fatigue ownership swap failures: **7/7 → 0/7** for the audited pair. The fixed permanent matrix additionally passes **35/35 pair/category swaps** (70 generated and published reports).
- Original “님은 해결을 위해 속도를 내지만” positional claim: **14/14 → 0/14** in the measured two-order reports.
- Publication: **7/7 → 7/7** at normal order, also 7/7 after swap. This demonstrates why shape/publication success alone did not detect the original bug.
- Long segments common to all seven categories for the same people: **48 → 61**. This increased as shared person/pair evidence replaced stereotypes. It is not claimed as a category-diversity improvement. Generic fast/slow role invention is removed; deeper category-specific prose and repetition reduction remain P1 work.

## Permanent behavioral coverage

`tests/unit/report-generation/compatibilityDirectionality.test.tsx`:

- ENTJ/INTP, ISFJ/ENFP, same INTP with different natal charts, one missing MBTI, both missing MBTI; all seven categories in both orders.
- Person retention, directional inversion, atomic symmetric branch facts, stable score, both source viewpoints and SSR attribution.
- Person profile independent of a different partner and category; no inferred MBTI; no internal attribution IDs in HTML.
- Receiving-person ten-god golden: 丁 viewing 甲 = 정인; reverse = 상관.
- Invalid subject, target evidence ownership, MBTI, element/ten-god direction, invented role and reversed fatigue text fail publication.
- Mock writer/repair retains original two-way evidence and unrelated valid prose.
- All measured outputs retain more than 5,000 rendered characters and more than 50 unique long segments; this guards information loss, not literary quality.

Existing writer, source, deep-bridge, renderer and other product suites remain enabled. The few old assertions requiring the positional bug were replaced by source-grounded expectations.

## Limits and release notes

- Exact assignment of parent/child or manager/report remains unavailable until an explicit input contract exists. Current output is conditional and does not invent it.
- Free-form writer narrative still needs editorial quality review; structural checks are not whole-text NLP validation. No live model quality claim is made by mock tests.
- New production publication validation requires direction evidence. Old stored compatibility snapshots lacking it fail closed. This task did not query production or assert that historical snapshots are absent; check existing snapshot compatibility before deployment. No automatic backfill or migration was added.
- No production deployment is part of this task. Existing `.gitignore` and `supabase/.temp` changes are excluded from the commit.

## Final verification

- `pnpm test`: **3,070 passed / 346 files**. Dedicated directionality suite: **41 passed**.
- `pnpm lint`: PASS.
- `pnpm build`: PASS (local build only).
- `git diff --check`: PASS.
- `pnpm exec tsc --noEmit`: existing **388 test-only diagnostics**, unchanged after normalizing shifted line numbers; **0 new diagnostics, 0 production-source diagnostics**. Repo-wide tsc is not reported as passing.
- Actual OpenAI/Toss calls, production DB writes and deployments: **0**.

Changed files (17):

- `src/lib/report-knowledge/compatibilityDirectionEvidence.ts`
- `src/lib/report-knowledge/compatibilityEvidenceBuilder.ts`
- `src/lib/report-knowledge/compatibilityDeepSajuBridge.ts`
- `src/lib/report-knowledge/compatibilitySajuBridge.ts`
- `src/lib/report-generation/compatibilityGenerationHandler.ts`
- `src/lib/report-generation/compatibilityReportDraftValidator.ts`
- `src/lib/report-generation/openaiCompatibilityReportWriter.ts`
- `src/lib/report-generation/openaiCompatibilityReportWriterPrompt.ts`
- `src/lib/report-generation/productPublishGate.ts`
- `src/app/reports/[reportId]/CompatibilityReportView.tsx`
- `tests/unit/report-generation/compatibilityDirectionality.test.tsx`
- `tests/unit/report-generation/openaiCompatibilityReportWriter.test.ts`
- `tests/unit/report-generation/openaiCompatibilityReportWriterPrompt.test.ts`
- `tests/unit/report-knowledge/compatibilityDeepSajuBridge.test.ts`
- `tests/unit/report-knowledge/compatibilityEvidenceBuilder.test.ts`
- `tests/unit/app/reports/compatibilityReportViewSource.test.tsx`
- `docs/compatibility-directionality-quality-01.md`
