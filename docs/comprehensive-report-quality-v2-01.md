# Comprehensive report narrative V2

## Scope and baseline

- Baseline: `aeb900cb17118cc3a4f6f14dda95075e205e3ebb`.
- Product: `saju_mbti_full`. Calendar/Dayun engines, MBTI source JSON, payment, persistence, worker, policy, and other product prose are unchanged.
- All samples use the deterministic path, a fixed clock of `2026-09-23T03:00:00Z`, fictional names, and existing test birth inputs. No live writer/provider/database calls or deployment.
- Before was generated from a separate `git archive` of the baseline, with the same payloads and SSR extraction. It is not a reconstruction from the new implementation.

## What changed

The old fallback repeated the same chapter introductions, element recap, fast-judgment assumptions, and final advice across unrelated customers. Chapter-index rotation selected features without a narrative purpose. The renderer also selected actions by matching six fixed phrases, hiding newly evidence-based actions.

`comprehensiveNarrative.ts` now builds one `narrativePlan` from existing validated evidence. Both fallback and writer receive this plan. It records the selected themes and each section's question, feature IDs, source MBTI trait IDs, and Bridge interaction IDs.

1. Select 2–4 core themes from proven Bridge interactions, preferring distinct contexts.
2. Explain the actual day pillar, elements, ten gods, hidden stems, and twelve stages.
3. Route relevant source traits into work/money/study, intimacy, family, and recovery alongside their Saju evidence.
4. Allocate every Bridge scene to one section. A scene does not reappear in another chapter.
5. Explain important features through strengths, fatigue, concrete situations, and practical limits. `comprehensiveFeaturePerspectives.ts` adds conditional reading scenes keyed to existing feature IDs, without computing new facts.
6. Select final actions from the customer's Bridge switches and actual feature advice.

When only one verified interaction exists, its strength/tension and fatigue boundary form two facets. This does **not** claim two independent interactions. When no interaction exists, the themes remain explicitly Saju-only. Missing MBTI never creates a type, function, or synthetic Bridge match to meet a quota.

Function-stack descriptions come from the existing type source; the report does not infer ability rankings from the stack. Specialized career/love/timing reports are not copied into comprehensive.

## Correctness caught during reading

The comprehensive adapter previously equated missing 食神 with no 食傷, and missing 正印 with no 印星. It also mapped `WEAK_DAYMASTER_WITH_STRONG_OUTPUT` to `no_output`. Thus a report could contain 傷官 and 無食傷 together.

Only this product's evidence mapping was corrected:

- `no_output` requires both 食神 and 傷官 to be missing.
- `no_resource` requires both 正印 and 偏印 to be missing.
- Strong output is not mapped to absent output.

Existing calendar/ten-god calculations are reused. Permanent tests cover the ENTP customer with 傷官 but no 食神 and the ENTJ customer with 偏印 but no 正印. Korean particle corrections apply to fixed template slots in deterministic copy; valid writer prose is not rewritten.

## Evidence and publication checks

For packets carrying `narrativePlan`, publication checks:

- 2–4 nonempty themes with actual customer fact references;
- each theme's Bridge fact/MBTI references exactly match its interaction;
- Saju-only themes have no MBTI evidence references;
- exactly one of each of the ten existing reading IDs;
- section feature/type-trait references exist in this packet;
- every proven scene is allocated exactly once.

This is a structural evidence contract, not an NLP proof of every sentence. Existing canonical input/pillar checks and prose safety/completeness/repetition gates remain. Legacy packets without this optional plan do not acquire a new required field.

## Five actual report readings

All five outputs were generated, passed the publication gate, rendered with the real `ComprehensiveReportV2View`, and read through, including the professional tables/cards and final advice.

| Sample | Solar KST input | MBTI | Actual narrative difference |
| --- | --- | --- | --- |
| 가람 | 1996-12-06 14:15, male | INTP | 재고귀인×분류 습관, 정축×내부 검증, 식신×작은 산출물. Final criterion: separate/automate resource records and make help requests explicit. |
| 나래 | 1980-03-09 13:30, female | ENTP | 정관의 합의된 기준과 대안 탐색의 긴장. Keep responsibility fixed while proposing one bounded experiment; no false 무식상. |
| 지민 | 2001-06-22 13:30, male | ISFJ | 정인×구체적 경험 기억. Familiar care can help, but ask whether the same help is wanted now. |
| 서진 | 1999-07-31 13:30, male | ENTJ | 수 부족의 회복 관점, 현침의 표현 강도, 편관의 역할 경계, 정관의 업무/사적 상황전환. Final criterion distinguishes empathy from solving. |
| 수연 | 1988-10-17 08:30, female | none | 재고귀인·비견·금여록 and actual Saju evidence only. Resource storage, autonomy, and sustainable conditions; no invented type/functions. |

Reading found and removed duplicate MBTI descriptions inside Bridge paragraphs, duplicated extended scenes across cards/body, inherited particle errors, and repeated generic card endings. Feature definitions and brief final action recaps can still repeat intentionally.

## Before/after measurements

Method: render the real React component to static HTML, strip tags, decode quote/ampersand entities, collapse whitespace. Character counts include all visible SSR text. Sentence metrics split on `. ! ?`, trim, and retain strings at least 40 characters long. They are lexical measures, not semantic-quality scores.

| Sample | Rendered chars before → after | Unique 40+ strings before → after | Longform duplicate surplus before → after | All-SSR duplicate surplus before → after | Displayed distinct professional labels before → after |
| --- | ---: | ---: | ---: | ---: | ---: |
| 가람 | 17,223 → 17,824 | 196 → 221 | 3 → 0 | 3 → 0 | 17 → 20 |
| 나래 | 16,060 → 17,867 | 187 → 234 | 0 → 0 | 0 → 3 | 17 → 20 |
| 지민 | 15,195 → 16,806 | 165 → 205 | 0 → 0 | 0 → 3 | 19 → 20 |
| 서진 | 17,366 → 19,473 | 208 → 250 | 2 → 0 | 3 → 1 | 19 → 23 |
| 수연 | 12,848 → 13,522 | 169 → 181 | 0 → 0 | 0 → 2 | 16 → 22 |

- No sample loses rendered volume. Missing MBTI remains shorter because no type text is invented.
- Long strings shared by **all five**: **82 → 37**.
- Sum of overlap across the ten customer pairs: **927 → 837**.
- Distinct long strings shared by **at least two**: **167 → 233**. This metric increases because more actual professional knowledge is explained for customers sharing the same facts; not every overlap metric improves.
- Final advice uniqueness: **1/5 → 5/5**.
- A predefined seven-phrase generic-scaffold check: **7 hits per customer → 0**. Examples: “처음에는 판단 속도와 책임감이 같이”, “수익화 감각이 빠른 사람일수록”, “오늘부터는 더 세게 밀어붙이는 것보다”. This sample check is not a claim that all generic language is gone.
- Verified Bridge interactions / rendered scenes are unchanged: **3 / 1 / 1 / 4 / 0**, respectively. Each scene appears exactly once.
- Every added feature perspective appears at most once in each full rendered report.
- Remaining all-SSR duplicate strings are short practical recaps shared between feature cards/body/actions, not repeated Bridge scenes or numbered filler. Their surplus totals **6 → 9**; longform itself reaches zero.

The writer gets expanded section-selected evidence plus the existing packet. Serialized prompt UTF-8 bytes before → after: 가람 524,232 → 602,590; 나래 531,054 → 594,172; 지민 503,105 → 575,760; 서진 658,072 → 719,893; 수연 389,232 → 434,922. These are bytes, not token counts. Payload compression remains a separate P1; no live writer quality/cost claim is made.

## Renderer

The order is cover/contents → core themes → existing professional foundation → feature detail → longform → actions → personal conclusion. All pillar, element, hidden-stem and MBTI tables remain. The core reading is removed from the later list so it appears once. Top selected features receive detail alongside previously detailed labels; other features retain quick readings. Repeated identical closing notes appear once. Actions come directly from the final chapter instead of a fixed-string filter. No global UI redesign.

## Regression and verification

`comprehensiveNarrative.test.tsx` covers five real SSR goldens, minimum retained volume, scene ownership, perspective duplication, proof mutations, MBTI/natal counterfactuals, missing MBTI, the two absence-mapping regressions, and a mock writer receiving the same plan without changing accepted prose.

The existing 16 MBTI + missing × three natal inputs × six products matrix remains: **306 deterministic generation/publication/SSR cases**. Existing Fusion/Bridge and compatibility directionality suites also pass.

- `pnpm test`: 353 files / 3,584 tests PASS.
- `pnpm lint`: PASS.
- `pnpm build`: PASS.
- `git diff --check`: PASS.
- `pnpm exec tsc --noEmit`: existing 387 test-source diagnostics; production-source diagnostics 0; new diagnostics 0. Compared by file, diagnostic code and message, ignoring line shifts. This check retains its existing nonzero exit status; it is not reported as passing.
- Actual OpenAI/Toss calls 0, production database writes 0, deploys 0.

Local read-through artifacts: `/tmp/comprehensive-quality-v2/before-<name>.txt` and `after-<name>.txt`. Source capture JSON: `/tmp/comprehensive-v2-baseline-HEAD.json` and `/tmp/comprehensive-v2-after.json`. The temporary audit test was removed; the permanent goldens contain the reproducible inputs and SSR extraction.

## Remaining quality P1

1. Some valid type/natal combinations have only one proven interaction or none. Broader evidence-backed Bridge coverage is separate work; this change deliberately does not invent matches.
2. Source MBTI descriptions still have some categorical wording. Source editorial review, including strength of claims, remains distinct from routing/factual-reference validation.
3. The comprehensive prompt retains a large legacy packet and instructions. Compressing it and evaluating a real writer should be separately authorized and measured.
4. Common professional definitions and final action recaps remain. Reducing those further should preserve the new evidence density rather than chase an arbitrary duplicate count.
