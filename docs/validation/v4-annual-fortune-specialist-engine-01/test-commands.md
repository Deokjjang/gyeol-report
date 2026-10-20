# Executed validation

- `pnpm exec vitest run tests/unit/report-knowledge/annualFortuneSpecialistEngine.test.ts`: 71 PASS, 0 FAIL, 0 SKIP. Default heap/timeouts.
- Original Catalog, Source Verification, Semantic Verification, Actual Graph, Binder, Foundation, Comprehensive, Career, Love, Major, Korean Editorial preservation files: 11 files / 558 PASS, `--maxWorkers=1`; no fixture/timeout changes.
- Original 16 failing files: baseline and after each 5837 PASS / 46 FAIL. File, test name, first error and full normalized signatures match.
- Two fresh `node --max-old-space-size=8192 tools/annual-fortune-specialist-engine/verify.mjs <separate-output-dir>` executions: 29 JSON byte identical. Each chains the unchanged predecessor CLIs, reruns the original 27 Graph cases and compares the original Major output bytes.
- `pnpm exec tsc --noEmit`: baseline 0, final 0.
- `pnpm lint`: PASS, 0 warnings.
- `pnpm build`: PASS, 0 warnings. Original 88 app/server NFT paths (90 with Next server traces) and all dependency sets identical; no offline engine, research, verification or fixture files added to customer traces.
- 17 generated Books / 102 digests / full narrative and Book objects / stored offline roundtrip: identical. Original eleven Book observations / 132 complete monthly texts identical.
- `git diff --cached --check`: PASS.
- Original 4509 tracked files and all ten existing artifact families: byte unchanged.
- Original 45 worktrees and main checkout's 11 dirty files: heads, branches, statuses and file bytes preserved.

Runtime timings and RSS are separate in `offline-performance-observations.json`. They are offline measurements and do not represent customer Runtime performance. Implementation/final Preview SHA, branch, project and target=null are checked after push; no Production deployment, DB writes, financial actions or provider configuration changes are performed.
