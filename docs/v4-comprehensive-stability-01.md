# Comprehensive Stability 01 — STOP / release blocked

Base: `53fdeb596a9cc69ae8a23770dd7f9759e3276646` (`v4/release-blockers-02`).
Work branch: `v4/comprehensive-stability-01`.

## Decision

**Structural correction is NOT complete.** The request's STOP rule applies: preserving all current contracts requires more than reserving PR015's sentence or dropping an optional support. Do not release based on this branch.

A bounded optional-placement reconciliation was tried locally (at most four passes; no new evidence, sentence, or validator relaxation). It removed the named PR015 PRIMARY error, but publication still rejected the manuscript with `V4_CONTENT_INCOMPLETE`: only four non-opening sections remained. It was removed before commit. **Application/runtime source is byte-identical to base.**

This commit contains diagnostic publication gates, the narrowly corrected historical import assertion, and this audit. A red publication test is deliberately red, not an expected-error success. No per-DOB/MBTI/candidate exception was added.

## Responsibility map and verified mismatch

All paths below are under `src/lib/interpretation-v4/`.

| Stage / module | Existing authority | Gap |
|---|---|---|
| `comprehensiveCandidateAdapter` | Candidate collection, source/provenance/context | Different candidate IDs may resolve to the same human phrase |
| `comprehensiveDiagnostics` | Source validity, unknown-MBTI exclusion | Eligibility does not promise a renderable sentence-role set |
| `comprehensiveConflictGraph` | Candidate-level semantic/conflict edges | Not a final-surface or role-capability graph |
| `comprehensiveReservation` | Core, fusion, fortune, arc reservation | Reserves candidate IDs, not mandatory role phrases |
| `comprehensiveAllocator` | PRIMARY/theme/support budgets, section slots | Charges a placement before renderer-only suppression; C1 PR018 already has a narrow mirrored check |
| `comprehensiveEvidenceOwnership` | Explanation owner, terminology and evidence exposure | Provenance ownership is not sentence ownership |
| `comprehensiveEditorialPlan` | Immutable, JSON-safe plan and candidate audit | Can validate with empty opening or later non-renderable placements |
| `comprehensiveNarrativeAdapter` / `comprehensiveManuscriptPolish` | Context realization, role phrases, human-language mapping | A claimed different application can retain the same direct surface; phrase removal can leave only one role |
| `comprehensiveSectionRenderer` | Semantic suppression, recovery priority, required depth | Several early `continue` paths suppress PRIMARY without `PRIMARY_NOT_RENDERED`; skipped support does not refund planner budget |
| `narrativeBlockRenderer` | Greedy pattern/phrase selection, local role validation | First block-valid pattern may omit section-required roles; no future PRIMARY reservation |
| `narrativeMemory` | Actual consumed phrases, endings, definitions and images | Reading-order first consumer wins, even when it is optional SUPPORT |
| `narrativeMeaningSignature` | Render-time role/family/axis/context repetition | Separate representation from planner conflict/theme constraints |
| `comprehensiveManuscriptRenderer` | C1→C10 reading order, bridges, operating manual | No whole-book renderability reconciliation |
| `comprehensiveManuscriptValidator` | Duplicate/provenance/role/MBTI/C10 safety | Missing planned PRIMARY is otherwise only `INCOMPLETE_PLANNED_COVERAGE` warning |
| `comprehensiveProductAdapter` / `runtimeProjection` | Opening, ending, minimum five body sections, packet/publication | Correctly refuse the incomplete manuscript; these gates must not be weakened |

### Three fixed reproductions

| Case | Current result | Explanation |
|---|---|---|
| C4: 1989-09-21 exact 17:40, INTP, freelance translator | PASS | Existing source-role repair keeps distinct `MYEONGLI_REASON` and `CLOSER` for PR009 |
| PR018: 1993-02-06, female, unknown time/MBTI, no job | PASS | Existing C1 identity suppression before charging SUPPORT preserves a later real shadow/application |
| PR015: 1994-11-18, female, unknown time/MBTI, no job | FAIL | C7 SUPPORT consumes C8 PRIMARY's direct claim; removing C7 is insufficient for whole-report completeness |

All three are success assertions through generation, publication validation, snapshot JSON, Book projection and stored/shared Book. PR015 stops at actual generation failure, so its downstream stages are **not** reported as PASS. Deliberately corrupted four-section negative tests remain.

### Trace evidence (no customer prose)

For the fixed PR015 reproduction:

- Candidate: `editorial:PERSONAL_RESONANCE:resonance:PR015`.
- C7: `SUPPORT`, `social`, `DIFFERENT_APPLICATION`; C8: `PRIMARY`, `work`, `FIRST_MEANING`.
- Both adapted sources carry `editorial:PERSONAL_RESONANCE:resonance:PR015:human` as `DIRECT_CLAIM`, identical text digest `5fdb121d0b804b14e5a29209f22fa39b841c7e3aed0752c473e03527c8476f3a`.
- C7/C8 reason phrases use distinct evidence IDs (`day:MINOR:戊` / `year:MAIN:戊`) but the same text digest; closer is also shared.
- C8 suppression: `ROLE_FLOW`, `NO_COMPLETE_SOURCE_BLOCK`; hard error: `PRIMARY_NOT_RENDERED`.

Broader traces establish non-PR015 failures:

| Fixed sample | Actual observation | Why SUPPORT-only recovery is insufficient |
|---|---|---|
| S003 | C1 has no blocks; downstream sections exist, manuscript hard errors empty | Candidate-only plan accepts no opening; product requires one |
| S006 | C7 `F06_TOO_FAST` suppressed, `ROLE_FLOW` / `FACT_BOMB_NOT_FIRST`; `EMPTY_SECTION:C7` | Planned relation application does not ensure renderable context roles |
| S010 | C5 `A02_INTIMATE_CHARM`; `:human` GOOD_RESULT + `:quality:fortune-reasons` MYEONGLI_REASON + `:quality:reward` CLOSER; P18 `ROLE_FLOW` | Declared role presence alone does not guarantee available realization under memory |
| S015 | C8 PR015 `:reason:natal:year:stem:癸` and `:positive:natal:year:stem:癸` have identical base text, different roles | Intrablock role collisions coexist with cross-section ownership collisions |
| S048 | C4 `SU02_GROWTH_DESIRE`: block-valid P02/P19 attempts, but section-required reward depth not met | Block validity and section validity are separate selection objectives |
| S061 | C4 PR040's adapted source has only `:human` DIRECT_CLAIM; block-valid P03/P24 still rejected | Required minimum two sentences cannot be supplied by reordering one source phrase |
| S086 | C5 `TITLE_TYPE_REPEAT`; fallback has only direct-judgment title type | Title selection can exhaust an allowed type after earlier sections; not a phrase reservation issue |

No guess is made that every observed failure has the same root cause. Full failure aggregation follows the bounded generation run.

## Proposed minimum contract change — NOT implemented

1. Establish a render-capability record after actual source adaptation/polish: candidate + section + context + required roles + permitted phrase/surface IDs. Do not equate different evidence IDs with different prose.
2. Reserve the sole usable mandatory role surface for PRIMARY before optional SUPPORT. Rendering still follows C1→C10. Definitions/endings/explicit-MBTI budgets remain constraints.
3. Share suppression/eligibility outcomes with allocation before charging optional theme/support budgets. A rejected optional placement releases its budget; PRIMARY disappearance is explicit.
4. Make complete section requirements part of bounded pattern selection, rather than stopping at the first block-valid pattern and then rejecting it for missing section roles.
5. Reconcile the whole-book obligations as well: supported opening, at least five substantive body sections, and C10's actually introduced antecedents. An alternate must use existing grounded material and be genuinely renderable; otherwise expose a failure instead of filling space.
6. Keep all provenance, no-MBTI/no-hour inference, exact/semantic duplication, fortune qualification, C10 no-new-evidence and publication checks. Existing successful drafts should remain unchanged wherever feasible.

This spans the adapter/polish capability contract, allocator, renderer, memory, operating-manual continuity, and title feasibility. It is a larger ownership-contract change than the rejected local SUPPORT exclusion. It needs a separately approved implementation scope; this phase does not silently start it.

## Bounded sampling and classification

- `stabilityFixtures.ts` fixes LCG seed `0x13d2026` before the first run. 120 deterministic cases: first 96 training, last 24 reserved holdout. No seed changes or success-based selection.
- Training has 32 exact / 32 approximate / 32 unknown inputs; known MBTI types cycle through all 16, every seventh input is unknown. Includes supplied/empty job context and all six canonical relationship states. Valid actual birth dates are calculated; no synthetic pillars.
- `comprehensiveStability.test.ts` requires actual publication for each supported sample. Failed manuscripts remain failed assertions.
- Diagnostic exports contain synthetic IDs, hashes, roles, source IDs, suppression codes, section coverage, duplicate counts and projection outcomes. They do not contain name/DOB/job text or manuscript prose.
- Initial diagnostic harness hashed an absent profile for eight upstream failures. That logging bug was corrected (`undefined`→`null`) and the same 96 inputs rerun; this was not an engine fix or an input change.
- Training execution completed: **67 supported publications / 8 expected prepayment rejections / 21 unexpected supported-input publication failures**. The eight are independently rejected by the existing `normalizeReportInputPayload` (`BIRTH_TIME_UNCERTAIN`: year/month/day cannot all be confirmed), also called by checkout prepare before creating the order and by ticket enqueue. They are not manuscript failures and are not counted as successful publications. The final classified gate run is recorded below.
- Supported inputs produced **86 distinct semantic-profile hashes** across 88 accepted inputs. This is bounded diversity, not exhaustive chart coverage.
- Published 67: all publication, snapshot JSON, Book and stored/shared Book checks pass; exact duplicate sentences 0; unknown-time hour evidence and unknown-MBTI inferred evidence 0 in the asserted output.
- **Publication success is not complete ownership agreement.** Among the 67 published reports, 28 retain planned-PRIMARY coverage warnings (40 C9 placements plus one C4 and one C8 placement). Those warnings remain visible in the audit. C9's generic/recovery suppression is legitimate editorial filtering but is not reconciled into the plan. This branch does not claim all mandatory roles/allocations are fulfilled.
- **Holdout 24 not run:** no accepted structural implementation to freeze; STOP keeps this set unseen for the next approved correction. Not counted as PASS.
- Metamorphic: 4 PASS. Repeated input+clock yields identical output; changing name preserves semantic profile/plan; unknown MBTI removes MBTI evidence; unknown time removes hour evidence/pillar. No success claim for all future names/inputs.

| Training classification | Count | Fixed IDs |
|---|---:|---|
| `PRIMARY_NOT_RENDERED` A02_INTIMATE_CHARM | 6 | S010, S019, S046, S064, S081, S082 (also EMPTY_SECTION C5) |
| `PRIMARY_NOT_RENDERED` PR015 | 2 | S015, S050 |
| `PRIMARY_NOT_RENDERED` SU02_GROWTH_DESIRE | 1 | S048 |
| `PRIMARY_NOT_RENDERED` PR040 | 1 | S061 |
| `EMPTY_SECTION` C7 | 6 | S006, S022, S057, S083, S085, S093 |
| `COMPREHENSIVE_PRIMARY_CONTENT_MISSING` | 4 | S003, S005, S059, S071 |
| `TITLE_TYPE_REPEAT` C5 | 1 | S086 |
| Expected `BIRTH_TIME_UNCERTAIN` | 8 | S014, S026, S044, S060, S068, S075, S078, S080 |

| Input precision | Published | Expected rejection | Unexpected failure |
|---|---:|---:|---:|
| exact | 24 | 0 | 8 |
| approximate | 21 | 5 | 6 |
| unknown | 22 | 3 | 7 |

MBTI known: 61 published / 7 expected / 14 unexpected. MBTI unknown: 6 / 1 / 7. These small, correlated samples do not establish MBTI or precision as the cause; failure is present in all precision groups.

The fixed PR015 reproduction is distinct from S015/S050. Total unexpected supported-input publication failures observed across unique expanded cases and fixed reproductions: **22 (21 training + 1 fixed PR015)**. Trace reruns are not counted again.

## Recovery boundary — read-only audit

| Boundary | Existing behavior | Limit |
|---|---|---|
| Direct payment `confirmPaidReport` | Durable confirmation claim, same provider/order identity; repeated callbacks reuse report | No new payment is needed for generation retry |
| `src/lib/book/paidRuntime.ts` | When the existing gate and server-owned `bookGeneration:v4` binding select V4, calls the actual shadow generator and V4 validator inside the same reliable worker; legacy purchases keep their existing generator | A V4 manuscript rejection is not silently delivered as V3 |
| `runPaidReportJob` / `paid_report_one_call_delivery_patch.sql` | Failed publication is not persisted. Typically up to three attempts, then `FAILED_REQUIRES_ATTENTION`; invariant/preflight failures may go directly to attention. Financial order remains `paid`, input retained | Deterministic content failure repeats until source code is corrected; retry alone does not fix it |
| Admin recovery | Existing `admin_retry` is allowed only for eligible paid, unexpired retained orders/reports | No new permission, refund endpoint or policy implemented |
| Customer status | `ReportStatusView` distinguishes waiting/attention, says payment completed and no additional payment needed; asks for report URL when contacting support | Operator must resolve undelivered paid content; this is a release P0, not a successful fulfillment |
| Ticket `runTicketPublicationJob` | Publication failure calls existing REVERSAL. Durable locks distinguish failed publish from lost acknowledgement of completed publish | Correct reversal does not make normal-input failure acceptable |
| Refund/financial action | No auto-refund is invoked by the generation failure path inspected | Refund/operations remain separate authorized boundaries; no real financial operation performed |

Commerce production code, SQL, pricing, expiration, ownership, gates and providers are unchanged. Local PGlite/mock regression is not Production DB or a real Toss/OpenAI call. `paidWorkerBatchSql.test.ts` covers actual six-product V4 → SQL → stored Book and legacy preservation; the failure/retry/reversal tests use controlled generation/publication failures. PR015 was not turned into an expected-success recovery test.

## Historical planner assertion

`timeProductContext.ts` is the existing approved Major/Annual integration. It imports `collectComprehensiveCandidates` and `ComprehensivePlanInputs`/`EditorialCandidate`, not the Comprehensive scheduler. The old negative import test omitted this consumer.

The corrected assertion allows exactly the two existing candidate/type modules for that one path and continues prohibiting the remaining scheduler modules. No `skip`, broad allowlist, or removed scheduler isolation assertion.

## Verification

| Check | Result |
|---|---|
| Existing 23 bounded inputs (`sixProductSale` 10 + `releaseContent` 13) | 22 publications, 1 expected Annual `DAYUN_UNCERTAIN` prepayment rejection, 0 unexpected publication failures |
| Fixed C4 / PR018 / PR015 | PASS / PASS / FAIL |
| New training 96 | **75 test PASS / 21 FAIL** = 67 publications + 8 expected rejections; 21 unexpected publication failures |
| Untouched holdout 24 | NOT RUN under STOP; no completed fix to validate |
| Metamorphic | 4 PASS |
| Related regression, 78 files | **1,076 PASS / 1 FAIL / 2 SKIP**, 378.05s; sole FAIL is PR015's real publication assertion |
| Historical scheduler suite | 22 PASS within the related run |
| lint | PASS |
| TypeScript | 390 existing diagnostics, 0 added/removed against base log (locations and union-order normalized); exit 2, not a clean tsc |
| build | PASS, 9 existing dev-helper SQL/glob tracing warnings; initial sandbox build stalled, only its own verified processes were terminated, then the same local build completed outside that restriction |
| diff-check | PASS |

The two skips are existing opt-in `paidWorkerCapacity` and `paidWorkerMeasurement` checks, not manuscript tests. No claim that the entire repository suite is green. Commands run locally:

```sh
pnpm exec vitest run tests/unit/interpretation-v4/comprehensiveStability.test.ts --maxWorkers=1
pnpm exec vitest run tests/unit/interpretation-v4/comprehensiveStabilityMetamorphic.test.ts --maxWorkers=1
pnpm exec vitest run tests/unit/account tests/unit/payment tests/unit/sharing tests/unit/app/ticketCheckout.test.tsx tests/unit/app/ticketOwnerRoute.test.tsx tests/unit/interpretation-v4/releaseContent.test.ts tests/unit/interpretation-v4/releaseSparse.test.ts tests/unit/interpretation-v4/sixProductSale.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/interpretation-v4/manuscriptSafety.test.ts tests/unit/interpretation-v4/manuscriptHumanClosure.test.ts tests/unit/interpretation-v4/comprehensiveEditorialPlan.test.ts tests/unit/app/bookPublicFlow.test.tsx tests/unit/app/dev/bookRuntime.test.tsx tests/unit/interpretation-v3/v2Regression.test.tsx tests/unit/api/bookAnnualPreflight.test.ts tests/unit/report-generation/customerDayunGeneration.test.ts --maxWorkers=2 --testTimeout=30000 --hookTimeout=60000
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
pnpm exec tsc --noEmit --pretty false --incremental false
git diff --check
```

Trace-only reruns select S003/S006/S010/S015/S048/S061/S086 or fixed PR015. They are diagnostic repeats, not new successful coverage. Final full-generation log: `/private/tmp/gyeol-stability-matrix-final.log`; safe final matrix: `/private/tmp/gyeol-stability-training-after.json`; baseline: `/private/tmp/gyeol-stability-training-before.json`; selected source-role trace: `/private/tmp/gyeol-stability-training-after-trace.json` ("after" denotes test-harness phase only; runtime unchanged). All 96 input digests and all 67 successful customer-draft digests match before/after.

## Release boundary

- Runtime, calculations, customer prose, all six product IDs, payment/auth/library/share/referral/campaign, SQL and public gates: unchanged.
- `.gitignore`, `AGENTS.md`, `supabase/.temp/`: pre-existing changes preserved and excluded from commit.
- No Production access/write/deploy, gate activation, master push, real payment/refund or provider call.
- **SIX_PRODUCT_RELEASE_CODE_READY: NO. PRODUCTION_ACTIVATED: NO.**
- This is an audit/diagnostic checkpoint under STOP, not a completed structural fix.
