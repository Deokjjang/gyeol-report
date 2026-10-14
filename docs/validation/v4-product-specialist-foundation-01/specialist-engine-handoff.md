# Product Specialist Foundation handoff

This is an offline diagnostic foundation. It is not a customer selection engine, Planner, writer, publisher or approval service.

## Reproduce

From the feature worktree with the frozen lockfile dependencies installed:

```sh
node tools/product-specialist-foundation/verify.mjs /tmp/gyeol-specialist-rebuild
pnpm exec vitest run tests/unit/report-knowledge/productSpecialistFoundation.test.ts
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

The CLI reuses the unchanged Binder CLI and its unchanged Actual Graph CLI. All 27 original producer fixtures run, including seven relationships, swapped A/B, unknown MBTI/hour, exact transition, ranged transition and before-first-cycle. No production policy override or network writer runs. Matching uses unredacted in-memory Graph objects; redaction occurs only for audit output.

## Public offline APIs

- `ProductSpecialistFoundation.prepare(preparedKnowledgeBinderCatalog)` compiles the actual Reader registry, indexes exact research declarations, and creates immutable typed overlays once.
- `.run(KnowledgeBindingRequest, optionalOriginalReceipts)` supplies cloned candidates to the existing `bindKnowledgeCandidate`. Every receipt executes the original 12 Hard Gates. There is no approval provider input.
- `ProductQuestionIndex.at(productKey, relationship, originalAddress)` and `.forCandidate(catalogKey)` query original contracts. Material IDs are scoped by original research family. Source keys, producer, Graph kind, owner, temporal scope, source group and roots reuse the existing Catalog/ActualBindingIndex/EvidenceGraph indexes.
- `annualRoleSelector` separates MONTH_STEM, MONTH_BRANCH_MAIN, EFFECTIVE_ANNUAL, DAYUN_STEM and NATAL. Effective annual pillar identity is supported. Effective annual god and annual dayun-stem god are not exposed by the current Graph and return null; there is no recalculation or substitution.
- `evaluateTypedSelector` retains all exact observations, rejected observations and windows. It does not choose the first witness. An exact required interval uses `[start,end)` and excludes adjacent segments.
- `annualMonthContracts` retains all original calendar months and all variable segments, including nonfocus, unknown dayun and before-first-cycle nodes. It verifies original producer IDs, pointers, owners, values, and start/end against the Graph.
- `majorPeriodSelection` projects existing cycles, their exposed endpoints, tenGod/active state, current-only natal relations, original transition and 14 editorial year slots. Missing cycle endpoints stay missing. It does not calculate cycles or annual relations.

## Units and activation boundaries

Primary Before/After uses the same 5,073 candidate-fixture pairs. Additional exact civil-month period attempts are a separate population. Ambiguous monthly-god role alternatives are diagnostic observations, not Binding successes. None is an independent specialist interpretation or customer-eligible claim.

The month matrix has original meanings rather than literal `question` strings. Its originalQuestion remains null. Major matrix has 14 offsets and 12 real subquestions per offset. Reader CH IDs and older research C IDs are not guessed into a mapping.

The original ten monthly-god study rows do not declare whether a particular god applies to stem or branch-main. Both role alternatives are reported as `AMBIGUOUS_MONTHLY_GOD_ROLE`; neither is installed as an active requirement. Exact civil-month attempts append only original month/segment/annual/boundary identity requirements, retaining all original meaning, context, counterexample and approval requirements.

Missing natural-language predicates, personal Facet observations, rule-specific Fusion IDs, incomplete Personal Resonance ancestry, missing endpoints, multilayer 3/4 period contracts and source groups remain held. The unknown/unsupported report contains original source locators and actual rejected producer file/symbol/version where available. An absent producer identity remains absent, not invented.

Review priority is an operator worklist only. It does not rank customer claims, assign paragraphs or create display/RECALL ledger entries. Domain prohibitions are per product/relationship use, never global exclusion of a knowledge record. All 1,903 unscoped candidates keep their original empty product scope and require explicit subsequent policy.

## Subsequent specialist algorithm contract (not enabled)

Input: verified Binding Receipts, Registry, explicitly approved original Meaning, actual source roots, entered context, exact original temporal windows and approved product policy.

Output, only in a later authorized task: question-specific eligible claims.

Prerequisites, in order: zero Hard Gate violations; actual fulfillment of that question; original product specialism; distinct meaning identity; actual independent roots; exact uncertainty/counterexamples; cross-question duplication limits; deterministic ordering. Quality ranking may consider only fully approved eligible candidates. Current approved meanings and customer eligibility are zero, so this stage cannot be activated.

Next work must address verified original missing contracts and specialist policy separately. It must not infer meaning predicates from axis names, copy another product's interpretation, invent user contracts/equity/relationship roles, or treat model review as operator approval. No subsequent stage was started here.
