# Compatibility seven-category quality V2

Baseline: `80ef5a5aeebc3c6c0df1a95da779c3a1ef1f5072`.
Scope: category evidence selection, deterministic interpretation, writer/repair guidance, publication consistency, and one duplicate-render correction. No calendar/Dayun, MBTI source DB, pricing, payment, storage, retry, consent, expiry, environment or deployment changes.

## Structure and buying questions

Each category now has eight separate questions, each carrying selected source IDs, person/direction ownership, a concrete conditional scene, an action and a caution. The opening states a supported strength, friction and sustaining condition before detail.

| Category | Eight questions |
| --- | --- |
| Love | Attraction/comfort; expression; pace/intimacy; contact/distance; post-conflict recovery; dating costs; personal life; longevity |
| Marriage | Shared daily life; sustainable support; chores/invisible work; extended-family boundaries/authority; accumulated conflict; shared/personal spending; rest/conditional parenting; changed circumstances |
| Parent/child | Emotional access; expectations; rules/autonomy; emotional response; study/feedback; support/responsibility; independence; changing roles |
| Coworker | Joint strengths; division of work; speed/deadlines; reporting; actionable feedback; responsibility/credit; fatigue; sustainable collaboration |
| Manager/report | Power difference; executable instructions; autonomy; safe questions/reporting; evaluation/disagreement; resources/authority; coaching; trust |
| Business partner | Joint value; roles/decision rights; speed/risk; adverse information; conflict during operations; money/contribution; loss/exit conditions; long-term responsibility |
| Friendship | Closeness/shared interests; support; contact/distance; emotional sharing/privacy; hurt/recovery; promises/costs; life changes; longevity |

For the same customers, love asks whether a proposed next step is welcome and what contact is comfortable. Coworker asks when drafts become final, how dependencies are handed off, and what feedback must change. Business partnership asks who can commit shared resources, how contrary information reaches decisions, and when additional investment of time/resources must pause. These are relationship-operation suggestions, not legal or investment recommendations.

## Evidence and direction

`compatibilityCategoryReading.ts` selects from the existing validated packet; it computes no new astrology:

- Actual day-master relation, directional cross-ten-god relation, combined elements, existing branch interactions, month/hour context.
- Only present individual natal features: e.g. communication/hyeonchim, help/cheoneul, money/jie-cai, workplace/zheng-guan. A missing feature is omitted.
- Existing positive branch-trine evidence is available to the support question only when calculated.
- Individual MBTI traits retain the owner ID. Both notablePairs source viewpoints retain source/target IDs and original type names; a source viewpoint is not treated as an assertion exclusively about its owner.
- `lovePattern` is routed only to love; `marriagePattern` only to marriage. The other five categories select usable sharedGround/friction/positiveInfluence/repairStrategy sentences, excluding romance-only statements.
- Reused source paragraphs are rendered once within the narrative. Reuse of the same fact by a different question retains source references but adds that question's scene, not another copy of the source paragraph.
- Money traits contribute operating cautions, not source prose forecasting income. Absolute emphasis such as INTP's “반드시 필요하다” becomes “필요하다”; validators remain unchanged in strictness.

Existing canonical A→B/B→A fatigue paragraphs, person identity, symmetric facts and scores are preserved. Roles remain unassigned for parentChild/managerReport. The category text uses conditional role guidance; no parent or manager is inferred from input position, age, gender or MBTI.

## Fallback, writer, repair and publication

The evidence builder adds optional `categoryReading`. Fallback uses it; normal and repair prompts receive the same selection, questions, source IDs and role contract. Prompt chapter guidance no longer presupposes combined earth, a particular benefactor or clash. Repair instructions use the selected category's scene instead of introducing romance scenes in every category.

Publication checks supplied source IDs/fields/owners against the actual stored natal traits, directional pairs and computed relations, rejecting modified category, role or source ownership. It does not compare narrative wording to the latest editorial template: future copy edits must not quarantine previously valid snapshots. This is a structural consistency check, not whole-text NLP verification. Existing snapshots without the optional category selection do not fail solely because this metadata is absent. All earlier direction and input-basis requirements remain.

Renderer change: `roleMoneyLifeRhythm` and `categoryReading` were being copied into table cells called “오행 균형” and “십성 관계”, then rendered again in full below. Those misleading table values are now omitted. Each detailed section appears once; no layout redesign or loss of its text.

## Measurement method

Synthetic deterministic fixtures, no providers:

- A: 가람, 1999-07-31 07:30 male ENTJ; 나래, 1996-12-06 14:15 female INTP.
- B: 다온, 1980-05-18 10:15 male INTP; 서우, 2001-03-02 16:20 female INTP.
- C: 한결, 1990-01-10 09:20 male, MBTI missing; 윤슬, 1987-08-20 11:10 female ENFP.
- All inputs solar/Asia-Seoul. Before and after use identical inputs, fallback → publication → actual `CompatibilityReportView` SSR.
- Before handler, renderer and prompt were read from baseline Git objects and executed locally. Temporary helpers were removed before the full suite.
- Render length strips HTML tags and collapses whitespace; it includes foundation tables and safety text.
- Long sentence: exact, rendered, punctuation-delimited segment of at least 40 characters. Category-unique means absent from the other six categories for the same pair. No name/year stripping or synonym scoring.
- Long fields: recursively flattened opening, keyCompatibilityPoints, relationshipAnalysis, chapters and finalAdvice strings of at least 40 characters, excluding chart objects and safety text. “Same field” requires the same path and exact value in all seven categories.
- These are repetition/density checks, not a numerical guarantee of literary quality. Hidden/interactive table markup is included in SSR text counts consistently before/after.

### Rendered characters, before → after

| Category | A | B | C |
| --- | ---: | ---: | ---: |
| Love | 8,103 → 10,629 | 7,450 → 9,406 | 6,773 → 7,737 |
| Marriage | 8,850 → 10,762 | 7,691 → 9,351 | 6,781 → 7,693 |
| Parent/child | 8,336 → 10,136 | 7,683 → 9,074 | 6,986 → 7,563 |
| Coworker | 8,256 → 10,137 | 7,549 → 9,197 | 6,785 → 7,467 |
| Manager/report | 8,394 → 10,222 | 7,687 → 9,282 | 6,929 → 7,552 |
| Business partner | 8,323 → 10,545 | 7,670 → 9,481 | 6,957 → 7,774 |
| Friendship | 8,117 → 10,092 | 7,464 → 9,110 | 6,884 → 7,653 |

### Across the seven categories

| Metric | A before → after | B before → after | C before → after |
| --- | ---: | ---: | ---: |
| Identical long fields / total long fields in love | 25/42 → 0/58 | 24/40 → 1/58 | 26/36 → 1/58 |
| Identical long relationshipAnalysis fields | 11 → 0 | 11 → 1 | 12 → 1 |
| Shared rendered long sentences across all seven | 62 → 69 | 49 → 45 | 53 → 39 |
| Category-unique long sentences, min–max | 11–17 → 43–56 | 11–13 → 43–48 | 10–13 → 42–45 |

The earlier audit's “33 of 42” is not copied as the baseline: at this HEAD the stated method gives A **25/42**. Common complete narrative fields have fallen markedly. **All shared sentences have not uniformly decreased**: A increases by seven because more actual common natal/MBTI explanations are used and retained. Foundation text and canonical directional paragraphs also recur deliberately.

### Category-unique rendered long sentences

| Category | A | B | C |
| --- | ---: | ---: | ---: |
| Love | 13 → 53 | 13 → 48 | 13 → 44 |
| Marriage | 17 → 56 | 13 → 48 | 12 → 44 |
| Parent/child | 12 → 47 | 12 → 45 | 11 → 44 |
| Coworker | 12 → 44 | 12 → 44 | 12 → 43 |
| Manager/report | 12 → 46 | 12 → 46 | 12 → 45 |
| Business partner | 11 → 44 | 11 → 44 | 10 → 43 |
| Friendship | 12 → 43 | 12 → 43 | 11 → 42 |

### Same category, different customers

Shared long sentences across A/B/C: love **22→44**, marriage **21→45**, parentChild **20→45**, coworker **21→45**, managerReport **21→47**, businessPartner **19→45**, friendship **20→43**.

This increased because category-specific operational questions/actions are shared rather than arbitrary per-customer paraphrases. Customer evidence and directional claims differ. Reducing this remaining within-category common guidance through supported interaction-based scene selection is a follow-up QUALITY-P1; it is not claimed as solved here.

### Evidence and payload

Selected unique source references in the new category plan:

- A: **17–20 Saju**, **10–12 individual MBTI**, **8–10 directional pair-field references** per category. Eight scenes contain directional pair or cross-ten-god sources.
- B: **13–14 Saju**, **10–12 individual MBTI**, **8–10 directional pair-field references**.
- C: **11–12 Saju**, no pair-field evidence (one missing MBTI); only the known person's individual MBTI sources. Directional ten-god evidence remains, without inferred MBTI.
- Each category has eight explicit contextual scenes; previously it had one shared category scene/rule and mostly common longform assembly. Source IDs measure traceability, not the number of independent astrology calculations.
- Existing person profiles, Bridge v2 IDs and source pair entries remain intact.

Serialized prompt-message UTF-8 bytes (not tokens or billed cost): A **234,795–236,619 → 272,268–275,731**, B **184,903–185,489 → 218,248–220,404**, C **156,842–157,285 → 175,310–176,470**. The prompt omits duplicate assembled reading strings from the new plan but includes selected sources. Payload grew; no live model quality/cost claim is made.

## Verification

- New category suite: **48 tests**. Three distinct pairs × seven categories, 21 swap pairs, all 16 MBTI types × seven categories, seven mocked writer/repair paths, publication/source tampering, legacy optional metadata, actual SSR and minimum information checks.
- Existing directionality suite: **41 tests**, including both MBTI missing, both directions, same type/different charts, explicit source-owner/role errors.
- Full `pnpm test`: **355 files / 3,644 tests PASS**, including six-product deterministic generation/publication/SSR regression.
- `pnpm lint`: **PASS, zero warnings**.
- `pnpm build`: **PASS**, local Next.js build only.
- `git diff --check`: **PASS**.
- `pnpm exec tsc --noEmit`: baseline **387**, final **387**, normalized new diagnostics **0**, production-source diagnostics **0**. All remaining diagnostics are existing test diagnostics; repo-wide tsc does not pass.
- OpenAI/Toss real calls: **0**; production DB writes: **0**; deploys: **0**. Mock fetch implementations only; deterministic tests assert no global fetch use.

## Remaining quality work

1. Further person/pair interaction-based selection inside each category; common operational guidance remains as quantified above.
2. Future explicit role selector if parentChild/managerReport need named role-specific conclusions; current output remains conditional.
3. Real writer editorial quality is unmeasured because provider calls are prohibited. Mock tests establish evidence, repair and attribution behavior, not model prose quality.
4. Prompt compaction without losing source ownership or category depth; this task adds evidence rather than claiming lower token cost.

## Changed files

- `src/lib/report-knowledge/compatibilityCategoryReading.ts`
- `src/lib/report-knowledge/compatibilityEvidenceBuilder.ts`
- `src/lib/report-generation/compatibilityGenerationHandler.ts`
- `src/lib/report-generation/compatibilityReportDraftValidator.ts`
- `src/lib/report-generation/openaiCompatibilityReportWriterPrompt.ts`
- `src/app/reports/[reportId]/CompatibilityReportView.tsx`
- `tests/unit/report-generation/compatibilityCategoryQuality.test.tsx`
- `tests/unit/report-generation/openaiCompatibilityReportWriterPrompt.test.ts`
- `tests/unit/app/reports/compatibilityReportViewSource.test.tsx`
- `docs/compatibility-7category-quality-v2-01.md`

Unrelated `.gitignore` and `supabase/.temp/` are excluded. No production application/deployment is authorized by this work.
