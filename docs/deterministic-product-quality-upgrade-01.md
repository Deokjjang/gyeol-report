# Deterministic product quality upgrade

Baseline: `1d75784`. Verification date: 2026-09-24. No provider requests or production changes.

## Interpretation contract

The existing calculation → product evidence → deterministic draft → publish gate → renderer path is retained. Calendar, Dayun, annual/month segments, payment, worker, schemas and validators are unchanged.

`reportContextScenes` selects possible activities from the supplied study/job context. It does not infer actual duties, ability, MBTI, ten-gods or natal facts. The caller supplies a ten-god already present in validated evidence. Scene, warning, action and transition each answer a different question; selection is deterministic, without random or numbered variants.

- Career: existing natal-supported role examples adjacent to the current activity precede generic MBTI examples. Context does not increase fit confidence. MBTI job source IDs remain available under other possibilities. Study, portfolio, remuneration and risk follow-up questions address the current activity.
- Comprehensive: plain meaning, scene and practice precede the professional feature label. No selected feature is removed.
- Love: retain SOLO/attraction/comfort/adjustment, marriage, recovery and parenting guards. Show shared natal partner criteria once, followed by distinct comparison questions for each example.
- Compatibility: explain only actual pair relations; remove fixed 丑未/申亥/子未 illustrations from customer-specific pressure explanations. Preserve both directions and conditional category roles. A source phrase negating an absolute judgment is rendered without the unsafe absolute word; the validator is not weakened.
- Major: use actual important-year evidence for contextual scenes. Runtime current-year position must not rewrite the narratives of the same ten-year cycle. Compact cards and detailed readings have different purposes.
- Annual: retain every `annual-month-jie-kst-v2` fact. Read annual core → natal/MBTI foundation → Dayun×annual → domains → important months → twelve months → actions. Each segment has plain meaning, an applicable activity and an action before expandable technical details. MBTI work/money/relationship/study labels now use the corresponding trait area, not a position in an untyped list.

Korean particles share one utility: 은/는, 이/가, 을/를, 과/와, 으로/로 and 이라는/라는. Hangul finals, the ㄹ exception and numeric readings are handled; unknown foreign/Hanja pronunciation uses an explicit neutral form instead of guessing. Only identified inherited-copy slots are corrected.

## Comparison method

Three synthetic profiles: B2B sales planning/INFP, business student/ESTP, manufacturing quality/ISFJ. Clock fixed at 2026-09-24 KST; annual year 2026. Business-partner pairs use consecutive profiles. All six products use actual generators, publish validation and SSR.

Character counts below use the same SSR text extraction, excluding scripts/styles and including detail content. A repeat group is a sentence of at least 40 characters appearing more than once. It can include necessary fact/summary repetitions, so it is not a count of factual defects. Love baseline was remeasured without embedded CSS. Browser `innerText` counts differ because hydrated tables and expanded controls contribute additional text.

| Product | Characters before → after (three profiles) | Exact repeat groups before → after |
| --- | --- | --- |
| Comprehensive | 17,932→18,217 / 17,327→17,627 / 16,940→17,225 | 13→13 / 9→10 / 12→13 |
| Career | 10,891→11,578 / 10,713→11,341 / 10,684→11,374 | 5→0 / 5→1 / 5→0 |
| Love | 12,353→12,366 / 12,381→12,354 / 12,079→12,092 | 3→2 / 1→1 / 2→1 |
| Compatibility | failed→10,783 / 10,529→10,535 / 10,658→10,711 | n/a→5 / 5→5 / 5→5 |
| Major | 13,907→14,325 / 13,897→14,319 / 13,835→14,263 | 4→4 / 2→2 / 5→5 |
| Annual | 18,273→21,034 / 19,547→22,373 / 18,547→21,305 | 3→3 / 8→8 / 4→4 |

The 17 comparable successful samples have 91→77 exact repeat groups. This is not a claim of zero repetition. Comprehensive has two additional detectable groups after separating plain meanings from labels. Major retains repeated fact/summary sentences. Normalizing names and digits produces unchanged annual groups 26/31/27, largely including recurring technical period summaries; no arbitrary paraphrase was introduced to hide them.

The original career profile retains money/investment/study/qualification/portfolio sections and adds grounded CRM, proposal, sales report, contract and settlement questions. Its recommendation order is based on supported adjacent roles rather than generic INFP artistic jobs. No DIRECT writer prose was copied.

## Bridge and fact limits

Existing Bridge predicate matching, source IDs, type routing and bidirectional pair data are preserved. The prior ESTJ/INFJ business-partner sample's zero selected Bridge-v2 scenes is a valid no-match: the available rules require specific natal predicates absent from that input. Directional notable-pair evidence remains present. Do not fabricate interactions to meet a scene quota.

Selected Bridge-v2 scene counts are not uniformly high: comprehensive 2/1/1, career 1/1/1, love 1/0/0, compatibility 0/0/0, major 0/0/0, annual 0/0/1 for this matrix. These counts describe that scene layer only, not all MBTI or earlier validated Bridge evidence. Broader independently validated interaction coverage remains future work.

## Regression evidence

- 18/18 generate → publish → SSR; the original INFP→ESTP negated-copy publish failure now passes.
- Permanent hashes captured before edits preserve canonical input basis, natal/pillars, customer Dayun and complete annual V2 month evidence for all 17 baseline-successful samples.
- Context counterfactual keeps natal, timing and MBTI sources unchanged. Pair swap preserves person ownership and both directions. Existing major within-cycle current-year counterfactual passes.
- Six real local customer pages pass hydration, disclosure interaction and 390px overflow checks. Annual also passes 768/1440px overflow checks and MBTI disclosure Enter/Space toggling. Browser errors and framework error overlays: zero.
- Full suite: 364 files / 4,005 tests PASS. Lint, build and diff check PASS. TypeScript: existing 387 test diagnostics unchanged; new diagnostics 0; production source diagnostics 0.

## Runtime recommendation

Use deterministic generation as the launch default through the existing `OPENAI_REPORT_WRITER_ENABLED=0` contract. `generateProductReport` still performs normalization, evidence construction and publish validation with the writer disabled. Keep the existing one-call writer path for later controlled comparisons; this task does not delete it or change any deployed flag. Provider-quality improvement is not claimed without another separately authorized writer evaluation.

Remaining work is interpretation coverage and purposeful fact/summary repetition, not a reason to weaken calculation or publish gates. This change does not certify all possible customer inputs from an 18-sample matrix.
