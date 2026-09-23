# LOVE-MARRIAGE-CHILD-QUALITY-V2-01

Baseline: `50f6d365685893846adb7a5b7087e8432c1e9341`. Local deterministic evaluation, 2026-09-23 KST. No provider call, production database access, or deployment.

## Contract and root cause

The actual input enum is `""`, `single`, `some`, `dating`, `marriage_preparing`, `married`. The old love handler collapsed `some` and `marriage_preparing` into `dating`; the fallback did not meaningfully use status. Its fixed responsibility-first personality also appeared in two additional renderer panels, including an ENTJ-only branch and the same INTJ/INTP/ENFP/ISFP examples for everyone.

The six existing choices now retain distinct questions; no input/UI contract was added:

| Input | Reading question |
| --- | --- |
| single | Attraction versus lasting comfort; observable partner criteria |
| some | Expressing interest without treating expectations as mutual promises |
| dating | My expression, contact/distance, conflict and repair patterns |
| marriage_preparing | Moving from wedding preparation to shared-life decisions |
| married | Revisiting established money, chores, decisions and family boundaries |
| empty → unknown | Situation-based reading without assuming a partner or marriage |

## Evidence and narrative

`loveRelationshipSelection.ts` selects existing ten-god signals, source trait IDs, explicitly supported pair examples and validated Bridge v2 scenes. Known day-branch and month-branch ten gods set reading priority; this is **not** a claim of strength. The calendar, ten-god calculation, shinsal and Bridge matching rules are unchanged.

`loveRelationshipNarrative.ts` assembles the existing draft sections. Ten-god presence selects situation questions for expression, practical care, responsibility, support and autonomy. Absent gods do not receive named claims in the tested outputs. Day pillar/master/spouse palace identify the customer's own context; natal combinations/clashes are not described as an interaction with an unprovided partner.

MBTI love, marriage, relationship, communication and parenting assets supply different expressions and risks. Recovery uses only growth traits explicitly tagged for love/marriage/parenting/compatibility in the existing source. Work/study-only growth content stays out of relationship recovery. Missing MBTI produces no type examples or Bridge scenes.

Validated Bridge scenes are allocated once across love, marriage/household, parenting and conflict. Parenting only takes a family scene whose source traits concern parenting/child roles; general household scenes stay with shared life. Unsupported interaction types are not filled artificially. The sample suite includes an additional same-birth INTJ counterfactual with the existing Hongyeom/tension rule, alongside agreement/context-switch/amplification/compensation cases.

### SOLO examples

Three behavior-first layers: lasting comfort, attraction, adjustment cost. Examples use the customer's own directional `notablePairs` entry, plus a present ten-god criterion and source IDs. The first two complete, distinct examples come from the source's `comfortableTypes` list; the third comes from `challengingTypes`. Source order is only a deterministic example selection, not a ranking or evidence of optimal compatibility. The attraction example uses positive influence/love pattern; it is not a separate calculated attraction score.

- INTP sample: ISFJ / ESFJ / ESFP; actual 식신 criterion.
- ENFP sample: ESTJ / ISTJ / ISTP; actual 정관 criterion.
- ISFJ 썸 sample: ESFJ / ENTP / ENTJ; actual 식신 criterion.
- Missing MBTI: behavior criteria only.

Each example includes the source's long-term marriage tradeoff and repair action. The report explicitly distinguishes those examples from assessing an actual partner's unprovided chart. DATING/MARRIED do not receive replacement-partner recommendations.

### Shared life, parenting and frank reading

Shared life separates execution from invisible planning/decision work, joint versus individual money, personal time, and extended-family commitments. Parenting separates safety rules from parental preference, helping from taking over, effort from outcomes, and autonomy from abandonment. No child's traits, type, health, birth prospects or number are predicted.

The actual source risks remain visible: INTP's excessive bluntness, ISFJ's delayed requests, ENTJ's decision/control pressure, ENFP's spread of attention, INFJ's indirect requests, ESFP's premature disclosure. Those are conditional interpretations of supplied type data, not diagnoses or claims about the customer's actual partner.

## Writer and rendering

Writer and fallback receive the same `relationshipReading` selection. The prompt's hardcoded ENTJ paragraph and four-type recommendation example were removed. Writer validation and the publish gate reject type examples outside the selected attraction candidates and reject deterministic soulmate wording. Missing/malformed writer sections fail with the normal validation error, not a validator exception. This narrow guard does not claim to verify all natural-language semantics.

The renderer's independent generic fit/fatigue panels were removed. Attraction and friction are rendered once from the generated, evidence-selected sections. Existing tables, section layout, navigation, payment and report URLs are unchanged; there is no UI redesign.

## Reproducible quality sample

Each case ran `generateProductReport(..., deterministic_fallback)` → `validateProductPublication` → actual `LoveMarriageChildReportView` SSR with both production table components. Baseline and after use identical input and fixed clock. Synthetic fixture names below are not production customer data.

Rendered text measurement strips HTML, decodes quote/ampersand entities, and collapses whitespace. Long sentences split on punctuation and keep at least 40 characters. The figures include tables, instructions and notices, not just narrative prose. They are exact-string statistics, not semantic quality scores.

| Sample | Birth KST / type / status | Render chars before → after | Unique 40+ sentences before → after | Within-report duplicate occurrences before → after |
| --- | --- | ---: | ---: | ---: |
| 가람 | 1996-12-06 14:15 / INTP / single | 8,299 → 11,798 | 82 → 132 | 3 → 3 |
| 나래 | 1980-03-09 13:30 / ENFP / single | 8,605 → 12,348 | 84 → 145 | 2 → 4 |
| 지민 | 2001-06-22 13:30 / ISFJ / some | 8,586 → 12,461 | 83 → 138 | 3 → 3 |
| 서진 | 1999-07-31 13:30 / ENTJ / dating | 9,174 → 11,254 | 90 → 131 | 3 → 3 |
| 유진 | 1988-10-17 08:30 / INFJ / marriage_preparing | 8,667 → 11,112 | 86 → 127 | 2 → 2 |
| 다온 | 1990-02-15 10:15 / ESFP / married | 8,597 → 10,798 | 85 → 124 | 4 → 4 |
| 수연 | 1988-10-17 08:30 / missing / single | 6,826 → 8,378 | 72 → 94 | 0 → 0 |
| 하늘 | 1996-12-06 14:15 / ISTJ / unknown | 8,476 → 10,634 | 83 → 118 | 2 → 2 |

Across all 28 customer pairs, total shared long-sentence intersections: **1,670 → 1,466**; mean **59.64 → 52.36** (12.2% decrease). Worst pair **64 → 75**, so repetition is not universally improved. Common ten-god perspectives, table definitions and practical guidance remain; no numbered filler or text rotation was used to hide them.

Distinct source MBTI trait passages found in the draft: 6 → 15–21 per typed sample; absent MBTI remains 0. Named present ten gods used: 4–5 → 4–7. Validated Bridge scene use remains 0–1 in the main eight cases (none invented); the additional INTJ/Hongyeom counterfactual verifies tension. SOLO/썸 pair examples with explicit proof: 0 → 3 where MBTI is provided, otherwise 0.

Manual output review covered the attraction examples, differing love/communication risks, all eight marriage/parenting readings and rendered text. It caught and removed unrelated career/study growth passages and a family-scene placement in parenting. Examples of real differences: INTP's explanatory/open parenting versus ISFJ's routine/protection; ENFP's experience and expression versus ENTJ's expectations and decision authority. These are source-backed readings, not proof that a type determines parenting behavior.

## Verification

- `pnpm test`: **354 files / 3,596 tests PASS**.
- Includes 13 new narrative tests; 6 products × 51 combinations (306 generation/publish/SSR cases), six-status counterfactual, MBTI-only counterfactual, missing MBTI, proof IDs/pair direction, Bridge scene preservation, writer mock and malformed output, renderer attribution, and content-size floors.
- `pnpm lint`: PASS.
- `pnpm build`: PASS (local build only).
- `git diff --check`: PASS.
- `pnpm exec tsc --noEmit`: existing **387 test diagnostics**, identical normalized file/code/message multiset before/after. **0 new; production source 0**. Repo-wide typecheck is not green.
- Real OpenAI/Toss calls 0; production DB writes 0; deployment 0.

## Remaining QUALITY-P1

1. Common fact definitions and same-signal practical paragraphs still repeat across some customers; the worst-pair statistic rose. Further editing should distinguish scene purpose without inventing additional facts or deleting useful guidance.
2. The MBTI source itself uses some broad declarative wording. This change routes existing assets; it does not establish empirical validity or rewrite that database.
3. Partner examples remain source-list examples, not personalized compatibility scores. Relative attraction/comfort strength is not calculated.
4. Live writer prose was not evaluated because provider calls were prohibited. Mock validation and deterministic publication passed; semantic review beyond the narrow guards remains necessary for future writer quality work.
