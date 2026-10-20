# Semantic / Domain handoff contract

This is a future integration contract, not a Binder implementation. The current overlay has customerApproved=false, bindingAllowed=false, runtimeConnected=false and actualEvidenceIssued=0.

## Inputs to carry forward

Keep the original catalog record and locator/hash, Source Verification occurrence keys, exact original source review state, original Domain value, original policy declarations, model meaning receipt, all required ancestry and separate conditional source groups. `UNKNOWN` is an unmet requirement, not an inferred value.

Consume each record's `evidence-graph-requirements.json` entry alongside `semantic-domain-decisions.json` and `semantic-review-receipts.json`. Preserve the immutable base catalog/source artifacts. A reviewed semantic relation does not override a blocker or grant customer permission.

## Required future Binding Gate order

1. Re-resolve exact original locator and verify file/record hash and Source Verification receipt identity. Keep unrecovered, ambiguous or incomplete sources held.
2. Traverse only originally required source edges and the actually compatible source group. Inspect every required ancestor Domain, not just the top-level node. Documentary/future/related declarations remain contextual.
3. Apply existing explicit scoped prohibitions before relevance or ranking. BusinessPartner WORK/CAREER/THINKING/MONEY/INVESTMENT, coworker WORK/CAREER/THINKING, manager CHILDREN/WORK/CAREER/THINKING and friendship CHILDREN restrictions remain in force as originally declared.
4. Require an exact source-to-target meaning comparison with original common/different units, counterexamples, strength and limitations. Unread meanings and INSUFFICIENT_VERIFICATION cannot be treated as equivalent.
5. Preserve axis/facet/tag scope. Negative bipolar direction is not a defect; low strength is not an opposite trait; a facet is not the whole axis; tag relatedness is not axis strength; dynamic and fortune tags are not permanent traits.
6. Check the product's distinct question and the relationship's roles, inputs and excluded claims. Original policies cannot be expanded by a favorable semantic score.
7. Require actual supported producer output, exact source/root identity, owner and A/B direction. Pair reference is not an individual trait. Traditional definition is not a calculated personal fact or empirically established prediction.
8. Preserve natal/major/annual/month scopes and actual effective start/end intervals. Unknown times and transition windows remain uncertain; do not merge incompatible periods or invent an event.
9. For Fusion, require both actual original systems, the same person, direction/context/rule/hash and original conditions. Fusion adds no third independent calculated fact. Keep all five existing Fusion systems separate.
10. For ALL_DIRECT groups require every source. For conditional displayed groups require every source within one actually displayed compatible alternative, with original owner/type predicates. Do not union unrelated alternatives or borrow sources from another MBTI type.
11. Verify required user state, consent, asymmetric roles/authority and actual relationship history. Unentered marriage/cohabitation, friendship conflict, contracts, shares, revenue, debt or representative authority remain UNKNOWN.
12. Require explicit human operator and customer-use approval. Every gate above must be fulfilled for the exact use; none is fulfilled by this overlay alone.

## Meaning reuse

`classifyMeaningReuse` accepts declared source/prior roots, claim/meaning IDs, question, conditions, action and an actually-displayed flag. It does not produce those facts.

- SAME_FACT preserves one root identity; a new sentence is not another independent fact.
- SAME_CLAIM and SAME_MEANING preserve original claim/meaning identity.
- NEW_APPLICATION requires a different actual question, different conditions and different action with the same meaning. It still adds zero independent facts.
- VALID_RECALL requires actual display history, matching roots and matching meaning. A planned or research-only paragraph is not display history.
- DIFFERENT_MEANING preserves explicit differing meaning identities; absence of identities returns INSUFFICIENT_VERIFICATION where no stronger relation is established.

No semantic similarity model, personal evidence graph, new scoring, planner or Korean sentence generator is implemented here.

## Product and relationship separation

The six-product matrix preserves original representative IDs/proofs and available specialist questions. Full-person description, work/money/study decisions, intimate relationship discussion, cross-person compatibility, long-period choices and bounded annual/monthly interpretation remain different uses even when they share an original source.

The seven relationship matrix entries preserve love, marriage, parentChild, coworker, managerReport, businessPartner and friendship independently. B→A and A→B declarations must not be swapped. A parent's duty, an employee's authority, a partner's contractual role and a friend's voluntary availability cannot be inferred from similar personality material.

## Outstanding gates

No producer coverage is invented for declarations without support. Existing original `unsupportedProducerScopeRefs`, missing source references, type conflicts and time uncertainty remain available in the overlay and original artifacts.

The current customer runtime's `relationshipProductView.ts` uses an allowed-source `.some` check. This task audits its limitation and provides all-ancestor receipts but does not connect or repair the customer path. Before any affected future runtime use, separately verify complete ancestry and compatible displayed-group enforcement. The new offline checks cannot be claimed as an already deployed runtime guarantee.

All decisions require operator approval. The 31 CODEX_MODEL readings (five within Domain Queue) are not human approval. No pending entry becomes approved merely because an automated test passes or a Preview is READY.
