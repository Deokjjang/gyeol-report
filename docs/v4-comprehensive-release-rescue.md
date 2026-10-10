# Comprehensive Release Rescue

Base: `613c6f4c7b3ff3ac7067c879dd0a7f2d1bba23fe` (`v4/comprehensive-stability-01`).
Branch: `v4/comprehensive-release-rescue`.

## Shared failure and independent causes

The prior 96-input artifacts were reused, not regenerated for discovery: 67 publications, 8 intentional prepayment rejections, 21 unexpected failures. The previous STOP document remains a record of that baseline, not this implementation.

| Recorded failures | Count | Actual cause |
|---|---:|---|
| A02 intimate charm (S010/019/046/064/081/082) | 6 | A required multi-sentence reason shares a fragment with earlier content. Available endings then cannot realize the whole reason and reward; the indivisible source cannot be shortened. |
| PR015 (S015/050; also the separate fixed reproduction) | 2 + fixed | Optional C7 consumes the same direct phrase needed by C8 PRIMARY; role aliases can also carry identical base copy. |
| SU02 in C4 (S048) | 1 | The first block-valid pattern can omit the section-required reason/closer. Late rejection cannot ask the selector for the next complete pattern. |
| PR040 in C4 (S061) | 1 | Actual adaptation leaves only one phrase. No ordering can supply the required minimum; selection must use another eligible source. |
| Empty C7 (S006/022/057/083/085/093) | 6 | Budgeted application/support is not actually renderable in its context; no budget is returned for another candidate. |
| Missing opening (S003/005/059/071) | 4 | C1 admits only a composite CoreGyeol even when an eligible evidence-backed identity exists without that composite. |
| C5 title repetition (S086) | 1 | Non-fortune C5 requires a direct title after two direct titles. Prior title selection does not reserve that constrained choice. |

C4 translator and PR018 were reproduced as PASS before changes; fixed PR015 reproduced as `PRIMARY_NOT_RENDERED`. Ten representative historical failures were reproduced, all ten failed at baseline. No fixture input, calculated evidence, or suppression threshold was changed to make these cases eligible.

## One bounded renderability contract

1. `comprehensiveRenderability.ts` derives minimum sentences, mandatory roles and opening role from the actual adapted source. `NarrativeRequest.requirements` is enforced by the existing block validator **during pattern selection**, not only after the first valid block has been chosen.
2. A later selected PRIMARY's sole phrase for a required role reserves its actual **sentence fragments**, not its candidate ID or a guessed semantic paraphrase. Adaptation/polish remains the only source of text. Optional SUPPORT cannot consume these fragments. Earlier PRIMARY first tries another legitimate realization; if it cannot, its own required content remains mandatory and allocation must reconcile the conflict.
3. Rendering returns unavailable placements to the same allocator. The allocator excludes those section/candidate pairs **before spending budgets**, releases their reservations and selects from the existing eligible pool. Empty application slots can take a genuinely grounded alternative SUPPORT under the unchanged theme/conflict limits. No all-SUPPORT ban and no new customer copy.
4. At most four deterministic allocation/render passes. Final selected PRIMARY coverage must close. Exhaustion is a hard failure. Removing an unrenderable mandatory chapter without rendering a replacement preserves `PRIMARY_NOT_RENDERED`; it is not treated as publication success.
5. The product adapter records the **effective final plan**, not a stale preliminary plan. Original profiles/input remain immutable, and a forged initial plan still fails closed.
6. A source-backed non-fortune identity may open C1 when no composite CoreGyeol exists; no new nickname or interpretation is fabricated. C4 reserves a constrained upcoming C5 title type. Bridges may not displace already-rendered source blocks.
7. C9 uses the **same existing `classifyRecovery` function** before reservation/allocation and at rendering. The first post-fix 96 pass exposed two non-closing plans (S022, S052): successive generic element traits kept being selected and then correctly rejected as non-recovery prose. Pre-allocation classification resolves this shared mismatch without adding attempts or dropping the final coverage check. Both targeted cases then published; unrelated C8 use of the same generic trait remains eligible.
8. A relation chapter can be starved **at initial allocation**, not only after a rendering rejection: a legitimate recovery primary may own the same broad theme. The same evidence-backed alternative SUPPORT allocation now also runs for an initially empty C7. Existing support/conflict budgets and phrase protection still apply. Broader regression caught this as a missing relationship Book group for an existing golden input; the six-group assertion was retained, not reduced. That input plus eight affected historical inputs and the isolation test pass (10 targeted tests).

No sentence/scene bank, calculation, MBTI source, claim threshold, conflict rule, evidence ownership rule or publication minimum was relaxed. Optional constraints are absent for other product callers of the common language renderer; their existing behavior remains the regression contract.

## Safety and publication assertions

- Required content is selected from upstream phrases; one phrase with two role labels cannot count twice.
- Reservations are checked by both selector and validator. A forged block using a reserved phrase fails validation.
- Source scarcity does not create filler; incomplete sources remain rejected or are replaced with another eligible source.
- Minimum five body sections, opening and C10 remain publication requirements. The four-section corruption test remains negative.
- Unknown time/MBTI, no unsupported claims, source/provenance integrity, exact/semantic duplication, explicit MBTI budgets, endings, scenes, title proof and C10 antecedents remain enforced.
- Fixed PR015 asserts that C8 still owns its original PRIMARY, C7 contains a different real candidate, and actual publication/snapshot/stored/shared Book succeed.
- Matrix assertions now compare to the effective plan and require **zero missing selected PRIMARYs**. Reallocation passes/rejections are retained in safe diagnostics.

## Verification ledger

| Stage | Result |
|---|---|
| Baseline fixed cases | C4 PASS, PR018 PASS, PR015 FAIL |
| Baseline representative historical failures | 10 FAIL, as previously recorded |
| Contract checks + fixed sparse cases + representative ten | 18 PASS after fragment reservation; no input-specific exception |
| Historical 96, final allocation | 96 tests PASS: **88 supported publications + 8 intentional `BIRTH_TIME_UNCERTAIN` prepayment rejections; 0 unexpected failures** (339.53 s) |
| Previously unused holdout 24 | First run PASS (77.41 s); final allocation recheck **24 PASS: 21 supported publications + 3 intentional `BIRTH_TIME_UNCERTAIN` rejections; 0 unexpected failures** (78.92 s) |
| Broad regression (before final C7 closure) | 325 PASS / 2 FAIL: relationship group missing; new contract import allowlist missing. Both failures subsequently pass targeted and final broad verification. |
| Broad regression on final runtime | 326 PASS / 1 stale fixture assertion: PR018 now has **six** supported body chapters instead of five. No publication failure. The assertion was strengthened to exactly six plus an explicit relation chapter; no runtime change followed. |
| Final fixed reproductions | 4 PASS / 0 FAIL: C4 translator and three sparse inputs including PR018/PR015 (10.57 s). Twelve nonmatching tests were deselected, not counted. All 327 broader test cases are closed across the broad run plus this focused rerun; a third broad run was deliberately avoided. |
| lint | PASS |
| TypeScript | 390 baseline diagnostics, 0 added/removed after normalizing locations and union order; exit 2, not a clean tsc |
| build | PASS on final source locally, external writer/payment integrations disabled; 10 warnings from unchanged local-DB route/file tracing |
| diff-check | PASS |

The language isolation test also exposed a **pre-existing** stale consumer list: Career, Relationship and Time product adapters already imported the language core at base. Their exact three existing dependencies are allowed explicitly; all other forbidden imports remain asserted. The new renderability module is allowed only its exact adapter/type/variant/surface dependencies, and the section contract may reuse only the existing recovery classifier. Pure/deterministic/no-provider assertions also cover these contracts. The prior narrowly corrected `timeProductContext` scheduler assertion is preserved. No tests are skipped to conceal these failures.

Historical before/after: **67 → 88 actual publications, 21 → 0 unexpected failures**, with the same eight prepayment rejections (S014/026/044/060/068/075/078/080). All 96 input and integrated-evidence digests match the baseline. All 88 published results have zero missing selected PRIMARYs, zero exact duplicate sentences, no evidence/theme budget violations, and successful sealed-snapshot JSON roundtrip/direct/shared Book projection. Final deterministic render pass counts: 48 × one, 33 × two, 5 × three, 2 × four. No previously present C7 relation chapter disappears in the final 96 results.

Holdout was not inspected or used to tune the fix before its first run. All 21 publications have the same role/duplicate/ownership/snapshot assertions above; final pass counts are 13 × one, 5 × two, 2 × three, 1 × four. S104/108/116 remain prepayment rejections, not publications. No changes were made in response to holdout inputs. The final C7 closure comes from the existing golden regression, not the holdout; both 96/24 gates passed again after that allocation change.

Seven explicit contract tests pass, including a fault-injected missing primary chapter that must retain `PRIMARY_NOT_RENDERED`. Its first isolated run exceeded the default 5 s test timeout (7.55 s actual runtime); the integration test now has a 30 s timeout, without changing assertions or runtime retries.

The final 17-file broader run includes the language/planner/manuscript contracts, twelve-person canonical generation with actual Book reader SSR, deterministic/name-only/unknown-input metamorphic checks, sparse publication, all six actual products, sealed snapshot/direct/shared Book reopening, canonical table/MBTI projection, Major 14/14 and future ten/transition, Annual 12/12 and Jie order, annual purchase precheck, customer Dayun generation and V2/V3 regression. The intentional Annual `DAYUN_UNCERTAIN` prepayment rejection remains asserted separately. No expected failure is relabelled as a successful publication. Logs: `gyeol-rescue-regression-verified.log` and `gyeol-rescue-fixed-verified.log`; final matrices: `gyeol-rescue-training96-verified.log`, `gyeol-rescue-holdout24-verified.log`.

Artifacts are local under `/private/tmp/gyeol-rescue-*`; historical comparison inputs remain fixed in `stabilityFixtures.ts`. The training/holdout harness writes its safe ID/hash/role/projection records to `/private/tmp/gyeol-stability-{training,holdout}-after.json`. Filtered test runs' deselected cases are not counted as successful publications.

Persistence verification uses the real snapshot serializer and stored direct/shared Book projection after a JSON roundtrip. The paid-worker SQL helper executes migration files even against an in-memory DB, so it was not run under this task's explicit **no migration execution** rule. No live DB persistence or financial integration is claimed.

## Release boundary

No master change, Production deployment/write, migration, gate activation, payment, refund, provider call, price/policy change, commerce/auth/ticket/campaign/referral change, Book redesign or V3 runtime change. Protected `.gitignore`, `AGENTS.md`, `supabase/.temp/` are preserved and excluded.

## Closure

```text
PRIMARY_SUPPORT_OWNERSHIP_FIXED: YES
RENDERABILITY_CONTRACT_FIXED: YES
PR015_PUBLICATION_PASS: YES
HISTORICAL_96_UNEXPECTED_FAILURES: 0
HOLDOUT_24_UNEXPECTED_FAILURES: 0
MANUSCRIPT_SAFETY_PRESERVED: YES
COMPREHENSIVE_RELEASE_CODE_READY: YES
SIX_PRODUCT_RELEASE_CODE_READY: YES
PRODUCTION_ACTIVATED: NO
```

No unresolved publication blocker remains in the requested matrices/regressions. Code readiness above is scoped to this structural-publication correction, **not Production activation approval**. Existing 390 TypeScript diagnostics and file-tracing warnings are separate debt. No new customer prose/manual editorial quality verdict is claimed; bounded fixture success cannot exhaustively guarantee arbitrary future inputs. Unsupported or unresolved output still fails closed. Live DB/deployment/financial validation and release authorization remain outside this task.
