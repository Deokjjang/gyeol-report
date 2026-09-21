# Career evidence and timing correctness

Scope: `career_money_study` only. Baseline: `c627584`. No calendar, Dayun,
MBTI database, payment, persistence, retry policy, price or renderer changes.

## Contract and data flow

Customer input → existing canonical Saju calculation → positive natal labels
and actual element counts → career role/environment selection + the existing
16-type MBTI source adapter → claim-specific job examples, avoidance, money,
investment behavior and study evidence → deterministic draft or mock-tested
writer → structural and factual checks → existing publish gate → existing SSR.

- Negative labels such as 무인성/무식상 cannot establish positive 인성/식상.
  Group labels also cannot manufacture both members of a ten-god group.
- Each job keeps its own natal/source IDs. MBTI jobs are examples; high fit
  requires an actual matching natal signal. Unmatched MBTI examples are medium
  and explicitly provisional. Environment/role examples remain visible alongside
  MBTI examples; a long MBTI job list cannot fill the entire recommendation list.
- Sparse evidence produces explicitly qualified comparison examples to preserve
  the existing minimum job count. It does not invent a strength or occupation.
- Trait selection is deterministic, prioritizing actual matching signals. All
  16 types use career/workplace/money/investment/study plus recommended jobs,
  avoidance and career report-use-case source data. Report-use-case instructions
  remain internal to the writer packet, never customer prose.
- No MBTI input means no inferred type. A job title does not establish actual
  duties; current-job comparison asks about responsibilities and environment.
- Investment content describes decisions, risk limits and loss responses. It
  does not infer financial suitability or recommend assets from a personality.
- Career retains the existing five annual rows, starting at the canonical Seoul
  current year. Each row records annual Ganji, day-master-relative ten-god and
  natal branch interactions. Meanings follow those facts, not a year→theme array.
  These are review perspectives, not promised events. No Dayun is invented for
  this product, whose gender input remains optional. Annual-fortune commerce
  policy is unchanged.
- A year change affects timing only. No fixed 2026 default or QA timing row.
- Generation, writer acceptance and publication use the same limited semantic
  checks: element/absence, asserted ten-god strength/presence, named features,
  MBTI type and annual timing basis. They reject rather than rewrite false claims.
  This is not a general natural-language entailment checker.
- QA job appendices containing `writer` were removed at their source. Gate rules
  were not weakened. Invalid writer output fails its attempt; the existing
  retry/fallback strategy remains responsible for recovery.

## Reproducible comparison

Local deterministic generation, fake clock `2026-09-22T03:00:00Z`, female inputs,
name `고객N`, job context `운영`. No external transports. Before was run against
an isolated `git archive c627584`, after against the working tree with identical
inputs. The permanent test `careerEvidenceQuality.test.tsx` fixes these cases.

Character counts: SSR markup/tags/entities stripped and whitespace collapsed;
approximate reading length, not token counts. Payload: UTF-8 bytes of the complete
serialized system/developer/user messages. Long sentences: recursively collected
draft strings split at `. ! ?`, trimmed, minimum 40 characters. Duplicates count
occurrences beyond the first; cross-customer counts use distinct shared sentences.
These metrics describe these fixtures, not an estimate of production prevalence.

| KST solar birth / MBTI | Render chars before → after | Payload bytes before → after | Long duplicate occurrences before → after |
| --- | ---: | ---: | ---: |
| 1980-05-09 09:30 / ENFP | 9,135 → 10,029 | 223,406 → 161,130 | 24 → 10 |
| 2001-06-22 13:30 / ENTJ | 9,451 → 9,993 | 242,927 → 176,747 | 30 → 9 |
| 1999-07-31 13:30 / ISTJ | 9,727 → 10,260 | 239,581 → 175,092 | 29 → 13 |
| 1996-12-06 13:30 / INTP | 9,077 → 9,705 | 231,557 → 169,097 | 27 → 8 |
| 1992-05-21 13:30 / ISFJ | 9,065 → 9,858 | 225,130 → 163,438 | 26 → 11 |
| 1998-03-14 13:30 / no MBTI | 8,830 → 7,605 | 31,199 → 35,887 | 27 → 6 |

- Earth-excess claims without excess evidence: 3 affected fixtures → 0.
  First fixture has visible wood 1 / fire 3 / earth 0 / metal 3 / water 1.
- Unsupported valid MBTI types: 9/16 → 0/16. All 16 plus no MBTI pass.
- Resource-only synthetic fixtures previously appended one `writer` QA sentence
  for each of 16 types. The new fallback has zero internal markers. The six main
  customer fixtures already had zero such markers; no misleading baseline claim.
- Six-customer publish pass: 6/6 → 6/6. The old gate accepting contradictory
  evidence was the bug, so the unchanged pass rate alone is not quality evidence.
- 2028 fixed monetization theme: 6/6 → 0/6. New perspectives in table order:
  부담과 대응 권한 / 꾸준히 완성하는 결과물 / 외부 접점과 거래 조건 /
  제안과 표현의 전달 방식 / 제안과 표현의 전달 방식 / 새 관점의 검증.
  Shared perspectives are legitimate when the calculated ten-god agrees;
  natal branch interactions remain separately recorded.
- Long sentences identical across all six: 23 → 17; shared by two or more: 37 → 33.
- MBTI payload reduction comes only from removing duplicate raw trait copies and
  biased examples, preserving selected trait data and IDs. The no-MBTI packet is
  larger because of explicit annual evidence. This was not a compression project.

## Coverage and remaining limits

Permanent tests cover zero/excess earth, all MBTI source areas and avoidance,
missing MBTI, sparse evidence, semantic tampering, source ID grounding, MBTI /
element / ten-god / KST-year counterfactuals, six-customer SSR, current-year
rollover, mock writer failure and deterministic fallback through the publish gate.
Existing cross-product suites cover the other five products.

Remaining QUALITY-P1: deeper job-specific weighting, broader interpretation
angles within the same annual ten-god, and fewer repeated introductory/action
phrases. Source type traits remain tendencies, not measured aptitude. Semantic
checks intentionally cannot prove every paraphrased sentence. Real-model prose
was not evaluated because live OpenAI calls are prohibited.

Existing career snapshots without structured timing basis do not satisfy the new
career publication check. This task neither inspected nor altered production
snapshots; deployment compatibility must be established separately. No deploy.

## Final local verification

- `pnpm test`: 345 files / 3,029 tests passed, including 36 new career regressions.
- `pnpm lint`: passed without warnings.
- `pnpm build`: passed. The first sandboxed Turbopack process stalled; only that
  local build was stopped, and the unchanged build command succeeded with the
  execution permission needed by the local bundler. No deployment command ran.
- `git diff --check`: passed.
- `pnpm exec tsc --noEmit`: still exits 2 on 388 pre-existing test diagnostics.
  Baseline and final diagnostics match after normalizing line positions; zero
  new diagnostics, zero production-source diagnostics in either run.
- Real OpenAI / Toss / production DB calls: zero. Mock transports and SSR only.
