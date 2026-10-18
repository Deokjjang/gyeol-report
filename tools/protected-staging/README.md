# Protected Book review tools

This is a separate application, outside the customer Next.js `src/app` tree. The existing Writer, calculations, Publication Safety and Reader are unchanged. Nothing here authorizes customer use or sales quality.

## Local verified generation

From the persistent worktree, use Node24 and the existing frozen pnpm dependencies:

```sh
export PATH="$HOME/Documents/gyeol-validation/v4-technical-stabilization-01/toolchain/node-v24.22.0-darwin-arm64/bin:$PATH"
node tools/protected-staging/local.mjs init-key
node tools/protected-staging/local.mjs
```

Initialize the key **once**; a second initialization refuses to overwrite it. The private Ed25519 key stays at `~/Documents/gyeol-validation/v4-protected-staging-integration-01/keys/review-private.pem`, owner only, mode600. Never commit, upload or print it. The public companion PEM is not an Official Approval signing key.

Open `http://127.0.0.1:4317`. Choose a product, relationship or original fixture; enter fictitious people, birth time precision, MBTI, context and supported additional inputs. ParentChild is A=parent/B=child; ManagerReport is A=manager/B=team member. Unknown MBTI remains empty. All dates are solar/Asia-Seoul. The fixed evaluation/policy clock is `2026-10-12T12:00:00+09:00`; annual purchase constraints still apply. No custom policy override exists.

The UI uses the original input enum values, and the server reuses `normalizeReportInputPayload`. It runs `prepareOfflinePublication`, authentic private session verification, existing Publisher, Snapshot and `storedBook` JSON roundtrip. Unsupported/unsafe inputs return stage and error codes, with no partial Book. The original39 fixtures remain32SAFE_OFFLINE/7WITHHELD. No names are substituted into old fixture results.

The generator refuses Vercel/Production, changed original Writer sources and uncommitted tool revisions. It binds only127.0.0.1:4317, requires exact Host and POST Origin, limits input bytes and serializes generation. The existing offline bootstrap prohibits outgoing HTTP/fetch; no DB/payment/Worker port is invoked. Generation data is process/request local; only an explicit browser download persists an artifact. Use fictitious inputs exclusively.

## Local Reader

```sh
node tools/protected-staging/start-reader.mjs
```

Open `http://127.0.0.1:4318` and choose the downloaded signed Book JSON. The public verification key and current source commit are configured in the local child process only; no environment file or operating credential is copied. The Reader verifies Ed25519 over exact serialized bytes, trusted source commit, Book hash, versions and test-only authority. It uses the unmodified BookReader/BookPage components and CSS, with a wrapper for navigation, keyboard, gestures and notes. The whole original Book is present. Analytics, account, payment, real saving/sharing/referrals are absent. Refresh discards the loaded artifact; choose the same file to reopen without generation.

## Independent Vercel deployment — BLOCKED pending administrator setup

Do not use the existing `gyeol-report` project to host this app. Do not promote or deploy Production. No new Vercel project/protection change has been executed. The independent project and its explicit access policy must be confirmed before uploading review data.

An administrator must provision a separate project in the intended team, linked to this repository/feature branch, with Root Directory `tools/protected-staging/reader` and access to source outside that root. Review its install/build commands in `reader/vercel.json`. Use Preview only. Enable Vercel Authentication and explicitly restrict authorized reviewers. Audit Shareable Links, protection bypasses, all direct API/static paths and caches before providing any review data. No Supabase/Toss/OpenAI/customer environment variables are required.

Then record the exact administrator-verified project ID/protection in `reader/deployment-policy.json` in a separately reviewed change; its committed default is null/false, so **every Vercel deployment is currently404**. Set only the new project's server-side `GYEOL_STAGING_REVIEW_PUBLIC_KEY` to the public PEM; keep the private key local. `VERCEL_GIT_COMMIT_SHA` pins accepted artifacts to the exact reader deployment SHA. Environment variables/client flags cannot enable the shipped default policy. Never set NODE_ENV=development on Vercel or delete VERCEL.

Before calling the deployment ready, verify exact repo/branch/commit/project/Preview/READY and actual unauthenticated, unauthorized and authorized access; direct API/static paths; bypass/share settings; headers/logs/cache. This task does not claim those remote tests passed. Public client assets contain no Books or raw inputs, and no artifact is stored in Git/build output.

The final external receipt pins source SHA and test results. Customer bridges, approvals, allocations, Production changes, operating DB calls, payments, Worker jobs and real shares remain0. Actual human reading, customer runtime activation, sales approval and Production release are separate decisions.
