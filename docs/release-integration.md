# V3 + sharing paid-delivery release gate

## Scope and findings

- Integrate `v3/rebuild` into `feat/share-brand-system`, verify there, then merge back and rerun the complete gate on `v3/rebuild`.
- No master merge/push, deployment, external migration, environment change, real payment or OpenAI request.
- Existing V3 publication validators replay content from stored evidence. Reuse them; no second publication/reliability architecture or schema is added.
- Paid workers did not pass preview-only version options. Explicit stored `productOptions.contentVersion: "v3"` now selects Comprehensive, Career, Love and Major V3 in that same generator. Unversioned legacy input remains legacy; explicit Comprehensive V2 still wins. Annual's existing input-version behavior and Compatibility's role-version contract are retained.
- The customer input form also omitted V3 metadata for Comprehensive, Career and Love. Its existing options helper now marks those new inputs as V3, just like Major/Annual. The release fixtures execute that actual pure form helper instead of manufacturing version metadata, so either missing form selection or missing worker dispatch fails the gate.
- Two old legal expectations are aligned with the existing September 24 effective date, without changing legal copy or consent versions. The obsolete preview numeric-score expectation is removed. Career/Love legacy tests now explicitly use unversioned inputs.

## Executable contract

`tests/unit/sharing/paidDeliveryCompleteness.test.tsx` exercises six ordinary and six rich/long-context fixtures. It uses the actual paid worker, existing SQL functions in ephemeral **PGlite**, actual JSONB publication/readback, the share store and both route components. The payment confirmation callback is mocked; the writer is disabled and the test network guard forbids provider calls.

`tests/fixtures/report-sharing/completeness.ts` projects the current V3 customer render contracts into section IDs, every required customer paragraph, collection counts, input summaries and final-section sentinels. Internal legacy Annual sub-period prose is stored but intentionally not treated as an additional visible story: the current UI renders one main story per month.

The gate covers:

| Product | Required content |
| --- | --- |
| Comprehensive | Opening, all domain blocks, patterns, final direction, common tables |
| Career | Raw input/job/MBTI, all routed chapters and scenes, final direction |
| Love | Relationship status/family input, all chapters and conditional parent content, final direction |
| Compatibility | Both people/date/MBTI, category, A→B and B→A, all chapters, ending, no numeric score/grade |
| Major | Recent 3 + current + future 10 years, matching timeline/body, every age, actual transition, all prose/finale |
| Annual | Input/selected year, spoiler, Dayun context, 12 unique month stories and table rows, current-month marker, finale |

Six negative tests mutate middle/final collections and inject empty/null/undefined/truncation placeholders; the existing publication validators must reject them. Generated and SQL-readback manifests must match exactly. Direct and shared SSR must preserve every paragraph, with one share area after the article and no footer.

## Repeatable local verification

Run from the branch's worktree; choose a separate temporary output directory per branch. The exported fixtures are synthetic and not production customer records.

```sh
RELEASE_QA_DIR=/tmp/gyeol-release-share pnpm exec vitest run tests/unit/sharing/paidDeliveryCompleteness.test.tsx
pnpm exec vitest run tests/unit/interpretation-v3 tests/unit/sharing tests/unit/components/ReportShareInteraction.test.tsx tests/unit/components/KakaoShare.test.tsx
pnpm test
pnpm lint
pnpm build
git diff --check
```

In separate terminal sessions, connect a local Next build only to the exported local fixture server:

```sh
SHARE_QA_DIR=/tmp/gyeol-release-share node tests/fixtures/report-sharing/server.mjs

SUPABASE_URL=http://127.0.0.1:3140 \
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:3140 \
SUPABASE_SERVICE_ROLE_KEY=local-fixture-only \
SUPABASE_ANON_KEY=local-fixture-only \
PAID_REPORT_RELIABILITY_ENABLED=1 \
OPENAI_REPORT_WRITER_ENABLED=0 \
NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY= \
pnpm start --hostname 127.0.0.1 --port 3141

RELEASE_QA_DIR=/tmp/gyeol-release-share \
AGENT_BROWSER_BIN=agent-browser \
RELEASE_BROWSER_SESSION=release-share \
node tests/fixtures/report-sharing/check-completeness.mjs
```

The checker opens all 12 actual persisted snapshots and SQL-issued random share tokens at 390/768/1440px (72 cases). It interacts with a hydrated control, expands content, compares every required paragraph and direct/shared article text, checks final/share order, footer absence, overflow/runtime errors and crawler OG/privacy metadata. It captures top/middle/final/share screenshots (288 per branch) and writes `browser-results.json`. Review representative screenshots as well as automated assertions. Kakao/native/copy behavior is covered by local mocked interaction tests, not external sending.

After verifying and pushing the share branch, rerun these commands and browser checks on integrated `v3/rebuild`, using `/tmp/gyeol-release-v3`. Stop the local fixture servers between branch runs. Do not reuse the first branch's results as the second branch's evidence.

## Safety boundary

The sharing migration remains source code only outside the ephemeral test engine. These gates establish local full-delivery integrity, not that Production already has the migration or provider configuration. Production rollout requires a separate authorization and verification. Preserve unrelated `.gitignore`, `AGENTS.md` and `supabase/.temp/` changes; stage only integration files.
