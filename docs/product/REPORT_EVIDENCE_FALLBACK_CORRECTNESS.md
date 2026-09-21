# Report evidence and fallback correctness

Scope: REPORT-EVIDENCE-FALLBACK-CORRECTNESS-P1-01. No changes to calendar/Dayun algorithms, commerce, retry scheduling, persistence schema, or UI.

## Dependency map

All six products enter `reportInputAdapter` and `productGenerationDispatcher`. Each handler calculates the canonical birth-time-aware natal basis, builds product evidence, runs either the writer or its deterministic builder, and validates the draft. `generateProductReport` then validates the exact draft/evidence pair with the original input. The paid job and persisted-report reader independently apply the same publication gate.

| Product | Evidence → draft → renderer |
| --- | --- |
| Comprehensive | `comprehensiveReportEvidenceInputBuilder` → `comprehensiveV2GenerationHandler` / comprehensive writer → `ComprehensiveReportV2View` |
| Career | `careerReportEvidence` → `careerMoneyStudyGenerationHandler` / career writer → `CareerReportView` |
| Love | `loveMarriageChildReportEvidence` → `loveMarriageChildGenerationHandler` / love writer → `LoveMarriageChildReportView` and common tables |
| Major | customer Dayun → `majorFortuneEvidence` → `majorFortuneGenerationHandler` / major writer → `MajorFortuneReportView` |
| Annual | selected-year customer Dayun → `annualFortuneEvidence` → `annualFortuneGenerationHandler` / annual writer → `AnnualFortuneReportView` |
| Compatibility | two canonical natal contexts → `compatibilityEvidenceBuilder` → `compatibilityGenerationHandler` / compatibility writer → `CompatibilityReportView` |

## Corrected causes

- Comprehensive had an ENTJ default for missing MBTI and repeated execution/control prose irrespective of type. Several chapter hit-reading lists were shorter than the validator contract; some inputs happened to qualify for a rescue rule. Dynamic Korean particles also rejected otherwise valid natal structures.
- Fixed fire/water deficiency prose was independent of the calculated visible-element counts. Fallback now derives zero/max counts from the canonical profile and uses the actual feature dictionary.
- All 16 MBTI types now draw from the existing MBTI source database by chapter domain. Missing MBTI remains an empty input value, no MBTI evidence is selected, and the displayed profile says `미입력`. The input remains optional.
- Love and major fallback paragraphs also attributed the same behavior to any MBTI label. They now use their actual MBTI evidence; missing input produces no invented type.
- The career prompt's personal example is explicitly conditional on matching evidence. It is not a universal customer profile.
- Draft validation and an evidence object with three fields did not constitute a complete publication contract. Missing annual nested arrays could reach a renderer that spreads/maps them.

## Publication contract

`reportInputEvidence` binds the normalized customer input at the handler boundary, after writer output. A writer cannot supply or replace this basis. `productEvidenceValidation` is client-safe and performs no provider calls, filesystem access, or calendar recomputation.

Common requirements: current calendar version, valid precision/range/confirmed-pillar context, handler-bound input identity, matching birth date/time/MBTI, and matching product. With an original request available, compare the request against that input basis. The existing gate compares product pillars with the confirmed canonical context.

| Product | Additional completeness and consistency |
| --- | --- |
| Comprehensive | All evidence sections; actual feature meanings; supplied MBTI basis or explicit absence; profile pillars/grid; five-element counts re-counted from confirmed pillars; required longform chapters; existing density/repetition checks |
| Career | Natal and manseryeok columns, career ten-god/element basis, MBTI basis, job/path/money/investment/study evidence and safety notes |
| Love | Full canonical pillars, spouse palace/day branch, relationship/ten-god signal arrays, actual MBTI trait groups and safety notes |
| Major | Existing Dayun version/direction/stability/selection invariants plus the twelve-cycle display table, current selection, ten-year evidence rows and draft identifiers, natal/MBTI/domain basis |
| Annual | Existing Dayun invariants plus requested year, canonical annual GanZhi, annual/natal interaction object, twelve ordered monthly rows including both signal arrays, natal/MBTI/domain basis |
| Compatibility | Existing evidence-based allowed-term validator plus both canonical birth contexts, customer identities/MBTI and relationship type |

Empty signal arrays remain valid when the actual evidence contract allows no matching signal. They are not replaced with invented facts. Love's existing optional twelve-stage data can be an empty array; this work does not invent missing calculations. Internal markers, duplicate feature meanings, excessive sentence/paragraph repetition and low content density remain publication failures.

## Offline regression

- Three distinct natal/customer fixtures × all 16 MBTI types and missing MBTI; actual comprehensive renderer after gate PASS.
- Three customers for career, love, major, annual and compatibility, each through generation → gate → actual renderer (including common tables).
- Historical 2021/2025 versus transition/current 2026 annual context for the existing 2001-06-22 13:30 KST male golden: 壬辰 versus 辛卯.
- Fixed-element regression: 1977-06-10 01:30 KST yields 丁巳 / 丙午 / 戊戌 / 癸丑, visible counts 목0·화4·토3·금0·수1. Fallback must not claim fire/water is absent.
- Delete/mutate required evidence, monthly nested arrays, customer input, MBTI, calendar version, pillars, element counts, annual GanZhi/year and Dayun cycles. Publication must reject before rendering.
- Mock timeout/malformed/empty/validator-invalid writer output for the five audited single-person products. Two failed writer strategies followed by deterministic fallback retain identical canonical evidence and make no fallback transport call.
- PGlite exercises the actual durable retry/publish transaction for all four failure modes, retaining PAID and three attempt records. No live services are involved.

## Deployment and limits

Snapshots without the new handler-bound `inputBasis` fail closed. Existing stored snapshots require inventory and regeneration through the authorized admin retry path before deploying this stricter reader. This change does not edit production data or grandfather unverifiable reports.

The gate verifies structured facts and consistency; it does not prove every free-form sentence's meaning, literary quality, or an arbitrarily coordinated rewrite of all trusted snapshot fields. Existing source-database interpretations and calculation algorithms remain the authority. Live writer quality has not been tested in this work. Repo-wide TypeScript diagnostics remain the pre-existing test-only baseline; production-source diagnostics must remain zero.
