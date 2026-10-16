# V4-OFFICIAL-APPROVAL-CONTRACT-01

Status: **OFFICIAL_APPROVAL_CONTRACT / OFFLINE_IMPLEMENTED**. This is a cryptographic governance contract and isolated test rehearsal. It is not human approval, customer authorization, a runtime activation or a sale/publication approval.

Base: `v4/global-book-planner-01` / `16afa43981db46a4cd936f120bfcc5cf86d58c54`.
Branch: `v4/official-approval-contract-01`.
Final SHA, remote equality and exact Preview metadata are resolved after commit in the external release receipt and final operator report, avoiding a self-referential commit SHA.

## Scope and original intake

All **6,058** Base tracked files are byte-identical. Only new approval modules, a unit test, offline CLI and this validation directory are added. All 20 research families, Catalog/Source/Domain verification, Graph, Binder, Foundation, 12 Specialists, Workbench, Pilot, Probe, Planner, Writer/Reader, UI, calculations, scores and Book runtime remain unchanged.

The archived and recompiled original contracts preserve 12 routes, 27 Graph cases, 5,073 original candidate-fixture evaluations, 11,170 source matches, 1,489 evidence matches and 81 structural matches. Synthetic approval tests are never added to that denominator. Original review units/readings/cards remain **6,965 / 36 / 37**, actual draft decisions and approvals remain zero.

## Executable contract

New TypeScript modules are under `src/lib/report-knowledge/knowledge-integration-foundation/official-approval-contract/`; entry point for verification is `tools/official-approval-contract/verify.mjs`.

- `types.ts`: exact scope, four distinct decisions, trusted registry/pins, validity, revocation, supersession, rotation, audit and handoff contracts.
- `canonicalApproval.ts`, `signatureVerification.ts`: existing SourceReader sorted-key JSON reused with strict plain JSON validation. Finite IEEE-754 JSON numbers follow the existing encoder; non-finite values, non-JSON values, accessors, extra/nonstandard array properties, invalid Unicode and cycles are rejected. Array ordering and Unicode are preserved; this is not a claim of full RFC 8785 compliance.
- `trustedReviewerRegistry.ts`: SPKI Ed25519 key fingerprint, identity boundary, exact permissions, validity and registry pin. A signed `reviewerAuthorityRef` is a content hash of the complete immutable authority snapshot, not an editable friendly reviewer label. Identity, key, role, scope, window or registry-version changes cannot silently reattribute or retroactively authorize an old signature.
- `reviewContext.ts`, `approvalScope.ts`: authentic sealed native synthetic observations; source file/record/version, frozen policy/source hashes, full ancestry, producer, source-group, owner/direction/temporal/context/meaning/claim scope retained. Current originals and native policy are revalidated at use time. No unrestricted factory exists for approving actual research.
- `reviewDecision.ts`, `approvalEnvelope.ts`: original material and model proposal remain separate; meaning, applicability, operator authorization and customer authorization are distinct, explicitly signed decisions with linked full decision hashes. Draft/further-review choices cannot convert to approval.
- `validityWindow.ts`, `revocationLedger.ts`: explicit issuedAt/validFrom/validUntil/evaluatedAt/verificationTime; half-open validity. Signed revocation/supersession events, exact target hash/scope, current trusted authority, pinned ledger hash/id/revision floor and freshness are mandatory. Unavailable, stale, unsigned or replayed ledgers block use. Rotation requires an already trusted replacement key with no implicit new permissions; old keys and backdated replacement-key approvals are blocked.
- `approvalProvider.ts`, `binderCompatibility.ts`: existing `lookup(requirement)` / `verifyAuthenticity(approval)` and every original ApprovalRequirement field preserved. Exact requirement includes evaluatedAt. Valid separate decisions and current trust/policy are required on lookup and authenticity recheck. An already issued record becomes invalid after revocation or current source/authority changes. The frozen authenticated adapter rejects a copied provider whose authenticity function was forced true.
- `plannerBoundary.ts`, `futureActivation.ts`: typed validated approval-state handoff without customer permission. Existing Planner has no injectable real approval provider; it is not modified. Each selected signed-native Binder receipt is proved byte-identical to its unchanged authenticated Planner counterpart before its original validator/handoff is reused.

The signed bytes are exactly `UTF8("GYEOL_OFFICIAL_APPROVAL_V1" + NUL + SourceReader-compatible canonical JSON of every envelope field except signature)`. Algorithm/version/key/scope are signed. Node builtin Ed25519 verification uses `verify(null, bytes, key, signature)`. Signature is strict canonical base64 of 64 bytes; key is canonical SPKI Ed25519, fingerprint SHA-256.

Primary references actually checked: [Node.js crypto](https://nodejs.org/api/crypto.html#cryptoverifyalgorithm-data-key-signature-callback), [RFC 8032](https://www.rfc-editor.org/info/rfc8032/). No external signing service or dependency was added.

## Real research boundary

`INTERPRETATION_REVIEW` remains REVIEW_REQUIRED for real research, and `CUSTOMER_APPROVAL` retains original NO_APPROVALS regardless of a supplied provider. Binder and Planner real gates were not promoted. Actual operator/customer approvals, eligibility, selections, claims and Book allocations are **all 0**. Trusted real keys registered: **0**. Actual signed approvals issued: **0**.

A valid signature does not establish a real person's identity. Actual identity/public-key enrollment, externally authenticated trust and latest revocation delivery, real human decisions and runtime Gate/Planner integration remain explicit future tasks. Synthetic authority entries and ephemeral signing closures cannot become real trust through NODE_ENV or a mode label.

Every other native Hard Gate remains mandatory. Signed approvals cannot manufacture calculations, unknown user facts, missing source groups, unsupported producers, complete ancestry, unbounded periods or an exception to domain prohibitions. Existing counterexample/recall requirements remain withheld when unmet.

## Synthetic rehearsal and native Planner preservation

Each route uses its original independent native synthetic Source, Graph, hash, meanings, owners and temporal contracts. Synthetic catalog keys/record hashes are checked not to collide with actual research. Four process-local Ed25519 keys sign distinct decisions; actual private keys are never generated, read or persisted. Test private keys are generated in memory, not exported or committed.

| Route | Registered materials | Verified signed bundles | Native signed Binder eligible | Existing Planner selected | Unfilled |
|---|---:|---:|---:|---:|---:|
| comprehensive | 12 | 11 | 11 | 4 | 0 |
| career | 16 | 15 | 15 | 5 | 0 |
| love | 26 | 25 | 25 | 7 | 0 |
| major-fortune | 36 | 32 | 32 | 17 | 151 |
| annual-fortune | 34 | 34 | 34 | 12 | 0 |
| compatibility-love | 184 | 184 | 184 | 160 | 20 |
| compatibility-marriage | 206 | 206 | 206 | 160 | 20 |
| compatibility-parent-child | 236 | 236 | 236 | 160 | 20 |
| compatibility-coworker | 276 | 276 | 276 | 140 | 40 |
| compatibility-manager-report | 353 | 350 | 350 | 140 | 40 |
| compatibility-business-partner | 224 | 224 | 224 | 140 | 40 |
| compatibility-friendship | 232 | 231 | 231 | 140 | 40 |

Default original Planner total remains **1,085**. The independent Friendship display fixture remains **180**, separately counted. Neither is a completed or customer-eligible Book. All corresponding Base plan hashes, selected receipt hashes and validated Editorial Handoff hashes remain equal. Sparse/unfilled native questions and unverified Reader/Scheduler bridges are not filled with invented meanings.

## Security verification

`negative-security-tests.json`: **90** executed negative checks, zero escapes. Missing/invalid/wrong-key signatures; unknown/revoked/expired/wrong-role keys; scope/hash/version/meaning/claim/evidence/root/context/owner/direction/time/packet changes; fixture/group replay; draft/further-review promotion; expiry/revocation/supersession; domain/producer/state/ancestry failures; synthetic-to-real trust; NODE_ENV; forced provider authenticity; direct Gate tampering; actual Planner allocation forgery are blocked.

Additional unit checks cover immutable authority reattribution/retroactive permission grants, same-human multiple roles with four separate signatures, authenticated callback replacement, key rotation permission escalation/backdating, current policy/frozen hash changes, typed handoff withholding, canonical numeric/Unicode/array handling and deterministic per-input audit bytes. `actual-allocation-forgery.json` additionally records direct selected-assignment insertion into the authentic Strict request and its observed `CURRENT_ACTUAL_RESEARCH_ASSIGNMENTS_MUST_BE_ZERO` rejection.

## Measured preservation and tests

- New contract: **146 PASS / 0 FAIL**. Existing Global Planner: **125 PASS / 0 FAIL**.
- Known 16-file regression set: Base and final **5,837 PASS / 46 FAIL**, exact file/name/first-error/full normalized signatures equal. Only checkout-root aliases and ANSI colors are normalized. No existing test/config/skip changes. This is not a full repository Suite PASS.
- Separate Business Partner: Base/current engine **360 PASS / 1 identical FAIL**, artifacts **22 PASS / 0 FAIL**; combined **382 PASS / 1 FAIL**. Original 5,000ms default budget and `STACK_TRACE_ERROR` baseline are recorded separately from the 46.
- TypeScript **0 before / 0 after / 0 new**. Full lint PASS, zero warnings. Default Next.js 16.2.4 Production build PASS under Node 24.22.0, zero observed warnings. Staged and final diff-check recorded in technical receipt.
- Fresh **17 Books / 102 digests**, **20 Friendship cases / 140 digests**, **40 full profiles**: calculations, evidence, narrative, Book, snapshot and compatibility results byte-identical. Stored snapshot roundtrip passes. No Production Book accessed or written.
- NFT **90** paths and dependency sets identical. New approval code/data runtime entries: **0**.
- Original checkout dirty 11 files and all **59** pre-existing worktrees protected. Eight pre-existing missing Git markers are preserved, not repaired or pruned. Own task worktree only is committed.

Initial local build environment issue: the temporary external node_modules symlink was rejected by Turbopack. Only this task's ignored dependency link was replaced by an identical local APFS copy. A sandbox build then stalled; its own generated output was archived, and the same default command passed outside the sandbox. No application source, Next configuration, dependency/lockfile or environment configuration changed to hide the issue.

## Determinism and privacy

Two independent final CLI processes produce **22 byte-identical JSON files**, including their deterministic index. All 18 executable module hashes are unchanged through both final runs. Each process generates fresh ephemeral keys; public artifacts intentionally omit key-dependent public-key/signature/authority/ledger hash values. The executable validator computes all full hashes and unit tests compare the full validation receipt byte-for-byte for identical inputs. This does not claim random keys or signatures are identical across processes.

Private-key data, actual customer data and environment values are not exported. Validation scans all new source/test/report/artifact files against the original synthetic customer-name/date terms and secret-material patterns. Raw generated Book/profile and Git comparison snapshots stay outside Git under `/tmp/gyeol-official-approval-contract-01-validation/`.

## Reproduction

```sh
node --max-old-space-size=8192 tools/official-approval-contract/verify.mjs /tmp/gyeol-approval-rebuild-one
node --max-old-space-size=8192 tools/official-approval-contract/verify.mjs /tmp/gyeol-approval-rebuild-two
node node_modules/vitest/vitest.mjs run tests/unit/report-knowledge/officialApprovalContract.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/eslint/bin/eslint.js
NODE_OPTIONS=--max-old-space-size=4096 node node_modules/next/dist/bin/next build
git diff --check
```

Use Node 24 for build parity. The full offline audit requires an explicit 8GiB heap; default approximately 4GiB exhausted during the combined original/native audit. The CLI now rejects insufficient memory before loading research with an actionable command. This changes no Production memory/configuration or existing engine. Existing local dependencies are required; no secret/environment pulls or DB operations are needed.

## Remaining activation gaps

`future-activation-handoff.json` and the executable typed handoff specify real identity/key enrollment, authenticated current trust/revocation distribution, explicit human meaning/application/operator/customer decisions, controlled Binder integration, Planner real approval and Reader/Scheduler/display proofs, and separately approved customer-runtime activation. Existing Source/Domain/semantic gaps and baseline failures remain. Korean Editorial Engine, actual approval issuance, master and Production deployment were not started.
