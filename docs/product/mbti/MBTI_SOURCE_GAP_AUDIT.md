# MBTI Source Gap Audit

## 1. Summary

- Audit target: `docs/product/mbti/source/*.json`
- Expected files: 16
- Existing files: 16
- JSON parse success: 16 / 16
- Missing files: none
- `sourceStatus` failures: none
- Relationship matrix fill need: 83 pair tasks
  - Missing pairs: 62
  - `needs_enrichment` pairs: 21
  - Direct pairs requiring expansion by density heuristic: 0
- Overall high-priority types by gap score:
  1. ISTP: 31
  2. ENFP: 30
  3. ESTP: 26
  4. ESFP: 23
  5. ISTJ: 23

Overall priority is relation matrix first, then money/investment, marriage, career scenes, study/certification, and parenting/child detail.

## 2. Type Coverage Table

Thresholds: identity 6, thinkingStyle 5, career 6, workplace 5, money 4, investment 3, study 4, love 4, marriage 4, parenting 4, child 4, relationships 5, communication 4, strengths 4, risks 5, growth 4, recommendedJobs 12, avoidJobsOrEnvironments 8, notablePairs 16.

| Type | identity | thinkingStyle | career | workplace | money | investment | study | love | marriage | parenting | child | relationships | communication | strengths | risks | growth | jobs | avoid | pairs | missingPairs | needsEnrich |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| INTJ | 6 | 6 | 7 | 6 | 3 | 2 | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 12 | 10 | 16 | 0 | 0 |
| INTP | 6 | 6 | 6 | 5 | 3 | 2 | 4 | 4 | 3 | 3 | 5 | 4 | 5 | 4 | 6 | 4 | 8 | 7 | 13 | 3 | 0 |
| ENTJ | 6 | 5 | 6 | 5 | 3 | 3 | 3 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 22 | 10 | 15 | 1 | 0 |
| ENTP | 6 | 6 | 5 | 5 | 3 | 2 | 3 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 12 | 12 | 9 | 7 | 0 |
| INFJ | 6 | 6 | 6 | 5 | 3 | 1 | 4 | 4 | 3 | 3 | 5 | 4 | 5 | 4 | 6 | 4 | 12 | 8 | 15 | 1 | 6 |
| INFP | 6 | 6 | 6 | 5 | 3 | 1 | 4 | 4 | 3 | 3 | 5 | 4 | 5 | 4 | 6 | 4 | 12 | 8 | 16 | 0 | 0 |
| ENFJ | 5 | 5 | 5 | 5 | 3 | 2 | 3 | 4 | 3 | 3 | 3 | 3 | 3 | 3 | 4 | 3 | 10 | 8 | 16 | 0 | 0 |
| ENFP | 5 | 5 | 4 | 4 | 2 | 2 | 3 | 4 | 3 | 3 | 4 | 3 | 3 | 3 | 4 | 3 | 8 | 8 | 6 | 10 | 2 |
| ISTJ | 6 | 5 | 6 | 5 | 3 | 2 | 3 | 3 | 2 | 3 | 2 | 3 | 2 | 2 | 3 | 2 | 11 | 5 | 16 | 0 | 8 |
| ISFJ | 6 | 4 | 6 | 5 | 3 | 2 | 3 | 4 | 3 | 4 | 4 | 4 | 3 | 4 | 5 | 4 | 12 | 6 | 10 | 6 | 0 |
| ESTJ | 6 | 5 | 5 | 6 | 3 | 2 | 3 | 4 | 3 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 12 | 8 | 16 | 0 | 0 |
| ESFJ | 6 | 5 | 5 | 6 | 3 | 2 | 3 | 4 | 3 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 18 | 6 | 15 | 1 | 0 |
| ISTP | 6 | 5 | 6 | 5 | 3 | 2 | 3 | 3 | 2 | 3 | 3 | 3 | 2 | 3 | 3 | 2 | 13 | 5 | 5 | 11 | 4 |
| ISFP | 6 | 5 | 6 | 5 | 3 | 2 | 4 | 4 | 3 | 3 | 4 | 4 | 3 | 4 | 5 | 4 | 12 | 6 | 16 | 0 | 0 |
| ESTP | 6 | 5 | 5 | 4 | 2 | 2 | 3 | 4 | 2 | 3 | 4 | 4 | 4 | 4 | 5 | 4 | 9 | 7 | 4 | 12 | 0 |
| ESFP | 6 | 5 | 5 | 5 | 3 | 2 | 3 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 5 | 4 | 7 | 6 | 6 | 10 | 1 |

## 3. Missing Trait Areas by Type

The following items are below the threshold and should be filled before the source DB is considered product-complete.

- INTJ: money, investment, marriage, relationships.
- INTP: money, investment, marriage, parenting, relationships, recommendedJobs, avoidJobsOrEnvironments, notablePairs.
- ENTJ: money, study, marriage, relationships, notablePairs.
- ENTP: career, money, investment, study, marriage, relationships, notablePairs.
- INFJ: money, investment, marriage, parenting, relationships, notablePairs.
- INFP: money, investment, marriage, parenting, relationships.
- ENFJ: identity, career, money, investment, study, marriage, parenting, child, relationships, communication, strengths, risks, growth, recommendedJobs.
- ENFP: identity, career, workplace, money, investment, study, marriage, parenting, relationships, communication, strengths, risks, growth, recommendedJobs, notablePairs.
- ISTJ: money, investment, study, love, marriage, parenting, child, relationships, communication, strengths, risks, growth, recommendedJobs, avoidJobsOrEnvironments.
- ISFJ: thinkingStyle, money, investment, study, marriage, communication, avoidJobsOrEnvironments, notablePairs.
- ESTJ: career, money, investment, study, marriage.
- ESFJ: career, money, investment, study, marriage, avoidJobsOrEnvironments, notablePairs.
- ISTP: money, investment, study, love, marriage, parenting, child, relationships, communication, strengths, risks, growth, avoidJobsOrEnvironments, notablePairs.
- ISFP: money, investment, marriage, parenting, relationships, communication, avoidJobsOrEnvironments.
- ESTP: career, workplace, money, investment, study, marriage, parenting, relationships, recommendedJobs, avoidJobsOrEnvironments, notablePairs.
- ESFP: career, money, investment, study, marriage, relationships, recommendedJobs, avoidJobsOrEnvironments, notablePairs.

Category shortfall count across 16 types:

| Category | Types below threshold |
|---|---:|
| money | 16 |
| marriage | 16 |
| investment | 15 |
| relationships | 14 |
| study | 11 |
| parenting | 9 |
| avoidJobsOrEnvironments | 8 |
| career | 7 |
| communication | 6 |
| recommendedJobs | 6 |
| notablePairs | 10 |
| strengths | 4 |
| risks | 4 |
| growth | 4 |
| child | 3 |
| identity | 2 |
| love | 2 |
| workplace | 2 |
| thinkingStyle | 1 |

Enrichment notes already declared inside source JSON:

- INTJ: group-only relationship pair detail needs later source expansion; investment detail inferred from strategy and evidence traits; specific marriage conflict cases beyond source summary; sex/intimacy wording intentionally omitted for product safety.
- INTP: marriage-specific source detail limited beyond love and parenting sections; investment mostly inferred; some relationship pairs shorter than ESFJ/INTJ/INFJ pairs; health and diagnosis-like wording excluded.
- ENTJ: investment strategy detail sparse; job list broad and summarized; disease/depression/gender statistics excluded from direct product wording.
- ENTP: investment direct detail; marriage direct detail.
- INFJ: investment direct detail missing; some relationship pairs title-only; money details limited; health and crime-stat fragments excluded.
- INFP: investment direct detail missing; health and diagnosis-like fragments excluded; some relationship descriptions may benefit from expansion; money based on income tendency, low material drive, and career fit.
- ENFJ: investment direct detail; money direct detail; avoidJobs direct list.
- ENFP: investment direct detail; money direct detail; marriage direct detail; ISFP relation detail; ISTP relation detail; specific job list.
- ISTJ: INFJ, ISTP, ISFJ, ENTP, ESFP, INTP, ESFJ, ENTJ relation detail; investment beyond stable accumulation; sexual intimacy tone for compatibility product.
- ISFJ: full 16-type relation matrix; specific investment examples; more direct recommended job list; health-sensitive wording review for HSP/chronic-pain source noise.
- ESTJ: investment inferred from stability/profit-loss/conservative risk attitude; health and crime statistics excluded; career sub-scenes sparse.
- ESFJ: investment direct detail sparse; job-specific conditions and long-term growth path need expansion; health/disease statistics excluded.
- ISTP: ENFJ, ESTP, INFJ, ENFP relation detail; full 16-type matrix; money beyond practical spending; investment beyond quality/risk preference; marriage conflict examples beyond freedom boundary.
- ISFP: full 16-type matrix; money/investment cases; health-sensitive wording review; more school/career remediation examples.
- ESTP: most relation detail inferred from ESTP traits; investment inferred from risk appetite and short-term realism; health/crime/diagnosis-like statistics excluded; marriage sparse.
- ESFP: investment inferred from impulsivity/immediate reward/experience spending; ESTP relation title-only; career growth path needs expansion; intelligence/academic/ADHD statistics excluded.

## 4. Relationship Matrix Gaps

Audit target is 16 possible `withType` entries per type. Same-type pairs are included in this audit because several source files already include identical relations and the downstream compatibility matrix benefits from deterministic coverage.

- INTJ: missing none; `needs_enrichment` none.
- INTP: missing ENFJ, ISTP, ESTP; `needs_enrichment` none.
- ENTJ: missing ENTJ; `needs_enrichment` none.
- ENTP: missing ENTP, INFP, ENFP, ESTJ, ISTP, ESTP, ESFP; `needs_enrichment` none.
- INFJ: missing INFJ; `needs_enrichment` ESFP, ISFP, ISTJ, ESFJ, ENTJ, INTJ.
- INFP: missing none; `needs_enrichment` none.
- ENFJ: missing none; `needs_enrichment` none.
- ENFP: missing INTJ, INTP, ENTJ, ENTP, ENFJ, ISTJ, ISFJ, ESTJ, ESTP, ESFP; `needs_enrichment` ISFP, ISTP.
- ISTJ: missing none; `needs_enrichment` INFJ, ISTP, ISFJ, ENTP, ESFP, INTP, ESFJ, ENTJ.
- ISFJ: missing INFJ, ENFJ, ISTJ, ESTJ, ISTP, ESFP; `needs_enrichment` none.
- ESTJ: missing none; `needs_enrichment` none.
- ESFJ: missing INFJ; `needs_enrichment` none.
- ISTP: missing INTJ, INTP, ENTJ, ENTP, INFP, ISTJ, ISFJ, ESTJ, ESFJ, ISTP, ESFP; `needs_enrichment` ENFJ, ESTP, INFJ, ENFP.
- ISFP: missing none; `needs_enrichment` none.
- ESTP: missing INTJ, INTP, ENTJ, ENTP, ENFP, ISTJ, ISFJ, ESTJ, ESFJ, ISFP, ESTP, ESFP; `needs_enrichment` none.
- ESFP: missing ENTP, INFJ, INFP, ENFP, ISTJ, ISFJ, ESTJ, ISTP, ISFP, ESFP; `needs_enrichment` ESTP.

Pairs with empty fields:

- INFJ: ESFP, ISFP, ISTJ, ESFJ, ENTJ, INTJ are `needs_enrichment`; empty fields are sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, reportLine.
- ENFP: ISFP, ISTP are `needs_enrichment`; empty fields are sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, reportLine.
- ISTJ: INFJ, ISTP, ISFJ, ENTP, ESFP, INTP, ESFJ, ENTJ are `needs_enrichment`; empty fields are sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, reportLine.
- ISTP: ENFJ, ESTP, INFJ, ENFP are `needs_enrichment`; empty fields are sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, reportLine.
- ESFP: ESTP is `needs_enrichment`; empty fields are sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, reportLine.

Direct pairs currently pass the automated density heuristic for `needsExpansion`. Relation fill should still review older direct pairs during matrix normalization, but the immediate hard gaps are missing and `needs_enrichment` pairs.

## 5. High Priority Fill Targets

1. Relationship matrix
   - Fill 62 missing pairs.
   - Replace 21 `needs_enrichment` placeholders with full relationship objects.
   - Ensure each pair includes sharedGround, friction, positiveInfluence, lovePattern, marriagePattern, repairStrategy, and reportLine.
   - Highest urgency by type: ISTP, ESTP, ENFP, ESFP, ENTP, ISFJ, ISTJ, INFJ.
2. Investment / money
   - Money is below threshold in all 16 types.
   - Investment is below threshold in 15 types.
   - Convert source-safe traits into spending style, risk preference, decision bias, cashflow weakness, and money partnership patterns without promises or deterministic financial claims.
3. Marriage
   - Marriage is below threshold in all 16 types.
   - Add concrete long-term relationship scenes: home routines, conflict timing, emotional expression, role division, money management, family obligations.
4. Career detail scenes
   - Fill under-threshold career categories and recommendedJobs counts.
   - Add job-specific work scenes, bad-fit environments, growth path, team role, manager/subordinate dynamics.
5. Study / certification
   - Fill study gaps with learning method, test strategy, certification fit, concentration risks, and remediation patterns.
6. Parenting / child
   - Fill parent-child interaction scenes, discipline style, emotional support, school conflict, independence, and family routine patterns.

## 6. Sensitive Content Exclusion Notes

Direct output prohibition: the following source fragments must not be surfaced as direct product claims. If needed, convert them only into mild lifestyle or tendency wording.

- Disease / health diagnosis: do not say a type has or will have a disease. Use only "stress management", "routine care", "sleep and recovery", or "health-sensitive source noise excluded".
- Crime rate: do not use as a trait, prediction, stigma, or relationship warning.
- Intelligence / IQ determinism: do not rank the user by intelligence. Use only learning style, abstraction preference, or study strategy.
- Gender superiority or gendered value judgment: do not imply better/worse by gender. If source includes gender ratio, exclude from user-facing narrative.
- Investment return guarantee: never promise gains, dates, market outcomes, or guaranteed suitability.
- Specific date prediction: do not provide date-level fortune claims from MBTI source data.
- Excessive sexual expression: do not use explicit sexual descriptions; if relationship intimacy is needed, use restrained "affection expression", "physical closeness preference", or "intimacy pacing".

Sensitive terms detected in source JSON text and requiring review discipline:

- INTJ: sexual/intimacy safety note.
- INTP: health, IQ, intelligence, academic score fragments.
- ENTJ: disease/health/IQ/intelligence/academic fragments.
- ENTP: disease/health/sexual wording fragments.
- INFJ: health/academic fragments; crime-stat source excluded by missing notes.
- INFP: health/diagnosis-like fragments.
- ISTJ: sexual intimacy tone, relation placeholders.
- ISFJ: health-sensitive HSP/chronic-pain source noise.
- ESTJ: health and crime statistics excluded.
- ESFJ: health/disease statistics excluded.
- ISTP: crime/crime-rate fragments.
- ISFP: health and date-like source noise.
- ESTP: disease/health/crime/crime-rate/investment-return phrase fragments.
- ESFP: intelligence/academic/ADHD statistics excluded.

## 7. Recommended Next Tasks

- `MBTI-SOURCE-GAP-FILL-RELATION-01`
  - Fill missing and `needs_enrichment` relationship pairs first.
  - Recommended order: ISTP, ESTP, ENFP, ESFP, ENTP, ISFJ, ISTJ, INFJ.
- `MBTI-SOURCE-GAP-FILL-MONEY-INVESTMENT-01`
  - Bring money to at least 4 and investment to at least 3 for all types.
- `MBTI-SOURCE-GAP-FILL-MARRIAGE-PARENTING-01`
  - Bring marriage to at least 4 for all types and fill parenting/child gaps.
- `MBTI-SOURCE-GAP-FILL-CAREER-STUDY-01`
  - Bring career, recommendedJobs, avoid environments, and study/certification scenes to target density.
