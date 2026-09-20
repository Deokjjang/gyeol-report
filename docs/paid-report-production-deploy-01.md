# PAID-REPORT-PRODUCTION-DEPLOY-01

## Release status

Production sales must remain closed. This document prepares deployment; it is not evidence that a remote migration or staging run succeeded.

The requested project name is `gyeol-report`. Its Supabase project reference, Vercel account/team, and separate staging target have not been verified. At preparation time no database credentials, Vercel project link, or deployment credentials were available in this workspace. Supabase and Vercel connections were requested. Do not infer a deployment target from the Git remote.

Reliability release: `43c8c78a94199a4830bb26d2acc5bf6c7d4b02b2`, pushed to `origin/master` and verified against the remote ref. Existing unrelated brand changes remain outside this commit. A Git push is not proof of a successful hosting deployment.

Migration 0013 SHA-256: `94918d4736e9964c723036c542da3f31883937d9e62c1b7a89014d81202cd69f`.

## 1. Identify and back up the target

Record production and staging project references, database versions, Vercel team/project, hosting plan, current deployment revision, and environment scopes. Use separate staging data and credentials. Never print keys or put them in Git.

Run `scripts/paid_report_production_audit.sql` through the connected database tool before applying anything. It only reads catalog metadata, including columns, defaults, constraints, indexes, RLS, effective table/function privileges, and RPC contract indicators. It does not expose report/input JSON and is not a backup.

Take a restorable backup and schema export to access-restricted storage outside this repository. With PostgreSQL tools installed and an authenticated libpq service entry named `gyeol-production` (password in a protected passfile, SSL verification configured), an operator can use:

```sh
umask 077
pg_dump --dbname=service=gyeol-production --format=custom --file=before-0013.dump
pg_dump --dbname=service=gyeol-production --schema-only --file=before-0013-schema.sql
pg_restore --list before-0013.dump > before-0013-restore-list.txt
psql service=gyeol-production -X -v ON_ERROR_STOP=1 -f scripts/paid_report_production_audit.sql > before-0013-audit.txt
```

Store backup location, timestamp, checksum and restore verification. Listing a dump is only a readability check; test restoring into an isolated database before relying on it. Do not restore over production. If managed-schema permissions prevent a full logical backup, use an authenticated platform backup and verify its restore scope instead of silently accepting an incomplete dump. See [Supabase backup guidance](https://supabase.com/docs/guides/platform/backups).

If `supabase_migrations.schema_migrations` exists, read its versions/names. Compare its history AND actual schema against active `0001_*`–`0012_*`. The repository also has **`001_init.sql`, an incompatible older schema**. Never use `--include-all`. Do not mark missing migrations as applied to bypass drift. Reconcile drift first, preserving existing data.

### Exact Supabase CLI sequence

These commands pin the verified CLI version and use an explicit project ref on every remote command. They do not use the Supabase plugin. Replace the two bracketed values locally; do not paste credentials into source files or chat.

```sh
cd /Users/Deokmin/Dev/projects/gyeol-report
pnpm dlx supabase@2.117.0 login
pnpm dlx supabase@2.117.0 projects list
export GYEOL_SUPABASE_PROJECT_REF='<20-lowercase-project-ref>'
export GYEOL_BACKUP_DIR='<absolute-private-backup-directory>'
mkdir -p "$GYEOL_BACKUP_DIR"
chmod 700 "$GYEOL_BACKUP_DIR"
pnpm dlx supabase@2.117.0 migration list --project-ref "$GYEOL_SUPABASE_PROJECT_REF"
pnpm dlx supabase@2.117.0 db query --project-ref "$GYEOL_SUPABASE_PROJECT_REF" "select version,name from supabase_migrations.schema_migrations order by version"
pnpm dlx supabase@2.117.0 db dump --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --role-only --file "$GYEOL_BACKUP_DIR/pre-0013-roles.sql"
pnpm dlx supabase@2.117.0 db dump --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --schema public --file "$GYEOL_BACKUP_DIR/pre-0013-public-schema.sql"
pnpm dlx supabase@2.117.0 db dump --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --schema public --data-only --use-copy --file "$GYEOL_BACKUP_DIR/pre-0013-public-data.sql"
shasum -a 256 "$GYEOL_BACKUP_DIR/pre-0013-roles.sql" "$GYEOL_BACKUP_DIR/pre-0013-public-schema.sql" "$GYEOL_BACKUP_DIR/pre-0013-public-data.sql"
pnpm dlx supabase@2.117.0 db query --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --file scripts/paid_report_production_audit.sql
pnpm dlx supabase@2.117.0 db push --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --dry-run --skip-vault
```

Stop here unless all of the following are true: the project ref is production `gyeol-report`; backup files exist and have nonzero size; remote history and actual schema match active `0001`–`0012`; the audit shows `reports.report_id` and `payment_orders`; and the dry run lists **only** `0013_paid_report_reliability.sql`. If it lists `001_init.sql`, any earlier migration, no migration, or schema drift, do not apply anything.

Only after that gate passes, run:

```sh
pnpm dlx supabase@2.117.0 db push --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --skip-vault
pnpm dlx supabase@2.117.0 migration list --project-ref "$GYEOL_SUPABASE_PROJECT_REF"
pnpm dlx supabase@2.117.0 db query --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --file scripts/paid_report_production_audit.sql
pnpm dlx supabase@2.117.0 db lint --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --schema public --level warning --fail-on error
pnpm dlx supabase@2.117.0 db advisors --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --type security --level warn --fail-on error
pnpm dlx supabase@2.117.0 db advisors --project-ref "$GYEOL_SUPABASE_PROJECT_REF" --type performance --level warn --fail-on error
```

## 2. Apply and verify 0013

After the target, backup and prerequisite schema are verified, apply the exact checked-in `supabase/migrations/0013_paid_report_reliability.sql` through the connected Supabase migration tool, recording its returned migration identifier and file checksum. Apply to staging first, then the verified production target. The file is not a repeatable seed: existing new tables indicate prior/partial application and require investigation rather than rerunning it blindly.

Run the audit again and compare before/after. All must hold:

| Object | Required result |
| --- | --- |
| `payment_orders` | Existing rows preserved; provider order and payment key unique; confirmation lease/token columns |
| `report_input_snapshots` | Order PK/FK, non-null payload, default expiry +90 days, expiry index, RLS |
| `paid_report_snapshots` | Unique order, report PK, +90-day default, expiry index, completion/snapshot/gate constraint, attention/expiry states, RLS |
| `report_generation_jobs` | Unique order and report; due index; attempts 0–3; lease/token/run/retry fields; attention state; RLS |
| `report_generation_attempts` | Unique job/run/attempt, indexed report FK, timestamps, strategy and error audit, RLS |
| `paid_report_reliability(text,jsonb)` | Security definer, pinned search path, service-role execute only; admin retry and fenced claims |
| Legacy RPCs named in 0013 | No effective `anon`/`authenticated` execute privilege |
| New snapshot/job tables | No effective public-client read/write privileges, including inherited PUBLIC grants |

The catalog audit reports facts; it does not automatically certify correctness. Check each constraint definition, not just its name. Never test permissions by exposing real customer payloads. Production reports from older storage need separate audit/migration; 0013 does not reconstruct lost in-memory orders.

## 3. Environment and deployment

Configure values in the target environment's secret store; verify presence/scope without logging values. Redeploy after changes.

| Variable | Required configuration in this deployment stage |
| --- | --- |
| `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` | Verified target project URL; staging must use staging DB |
| `SUPABASE_SERVICE_ROLE_KEY` | Target-specific, server only |
| `CRON_SECRET` | Random server secret, distinct from admin secret |
| `REPORT_ADMIN_SECRET` | Random server secret, admin entry point only |
| `PAID_REPORT_RELIABILITY_ENABLED` | **`0`**; do not enable sales in this task |
| `TOSS_CONFIRM_API_ENABLED` | **`0`** during mock staging/initial deployment; worker otherwise reconciles reserved payments through Toss |
| `OPENAI_REPORT_WRITER_ENABLED` | **`0`** during mock validation; prevents real writer calls |
| `OPENAI_API_KEY`, `OPENAI_REPORT_MODEL` | Needed for a later explicitly enabled writer; not used for these checks |
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`, `TOSS_PAYMENTS_SECRET_KEY` | Later test/live flow only, matching environment; no live keys used here |

Do not copy `.env.local` wholesale: it currently has writer/payment settings but lacks deployment DB and worker/admin settings. The sale flag must stay off in both deployment scopes. Production builds also block the old mock-paid HTTP endpoint; do not weaken that guard for staging.

Worker: Next.js Node route `GET /api/internal/report-jobs`, `maxDuration=300`. Vercel registers `vercel.json` cron `* * * * *`; requests authenticate with `Authorization: Bearer <CRON_SECRET>`. Each invocation expires old content, optionally reconciles one pending payment, then claims at most one due generation job. No-job calls should return 200; unauthorized calls 401. Check function logs and DB attempt timestamps from actual scheduled invocations.

Vercel cron runs against the project's **production deployment**, not its ordinary preview deployments. Use a separate staging Vercel project with staging DB/disabled provider flags to exercise a real staging cron. Verify a plan supporting minute-level cron and the function duration; Hobby's daily cron is insufficient. See [cron management](https://vercel.com/docs/cron-jobs/manage-cron-jobs) and [plan limits](https://vercel.com/docs/cron-jobs/usage-and-pricing).

Retry: normal writer → regeneration after at least 30 seconds → deterministic fallback after at least 2 minutes. Minute-level scheduling makes these lower bounds, not exact timing guarantees. Crashed work becomes reclaimable after its 10-minute lease; three exhausted attempts enter `FAILED_REQUIRES_ATTENTION`. Payment remains `paid`. Track queue age and attention counts; one job per tick is a capacity limit.

Admin entry point: authenticated `GET /api/internal/report-retry` lists attention jobs; `POST` with JSON `{ "reportId": "..." }` returns 202 when requeued, 409 if ineligible. Use `REPORT_ADMIN_SECRET`, never a browser-visible key. Same job/report is retained and audit run increments. A visual admin panel is a later task.

## 4. Staging acceptance record

Local suite `pnpm test tests/unit/payment/paidReportReliability.test.ts` uses real migration SQL in PGlite, injected mock payment/writer, and a network guard. This is local integration evidence, **not remote staging evidence**.

On isolated staging, run the same service functions with a staging Supabase store and injected mocks through an authenticated operator-only harness. Do not add a public mock payment route. Scope all fixtures and cleanup to a unique run prefix; never truncate remote tables. Keep provider flags disabled. Real scheduled-worker checks can use missing-writer failures followed by the deterministic third attempt; normal-writer success/fault injection require the injected mock harness.

| Acceptance case | Required remote observation | Current remote result |
| --- | --- | --- |
| paid → generating → completed | Durable job/attempt and public completed page | Not run |
| writer fails → retry succeeds | Retry audit then same report completes | Not run |
| all attempts fail | Attention, null public snapshot, three attempts | Not run |
| duplicate callback | Same reportId, one report and job | Not run |
| browser refresh | No extra generation attempt | Not run |
| expired report | Move only test fixture expiry into past; expired page and cleanup | Not run |
| paid survives failures | Order remains paid and unexpired input preserved | Not run |
| evidence/pillars/longform | Persisted content passes gate and full page renders | Not run |
| partial draft | Rejected before publication; no partial page | Not run |
| admin retry | HTTP authentication enforced, 202, same report, next audit run, completes | Not run |

For expiry, also check the original timestamps are exactly 90 days apart before advancing only the staging fixture. For scheduler proof, allow actual retry deadlines to pass and capture scheduled invocation IDs; forcibly making jobs due proves state logic, not scheduling. Record deployment revision, project reference, anonymized fixture IDs and pass/fail evidence for each row.

## Local release verification

The production launch preparation was verified locally with provider calls disabled:

- `pnpm test`: 321 files / 2,359 tests passed.
- Reliability suite: 22/22 passed, including the original ten required scenarios.
- `pnpm lint`: passed.
- `pnpm build`: passed with `OPENAI_REPORT_WRITER_ENABLED=0`, `TOSS_CONFIRM_API_ENABLED=0`, and `PAID_REPORT_RELIABILITY_ENABLED=0`, including TypeScript. Network access was needed only for Google Fonts.
- `git diff --check`: passed.
- Active `0001`–`0013` applied cleanly to local PostgreSQL. Catalog checks found all five required RLS tables, service-role-only RPC access, exact +90-day defaults, no unindexed reliability foreign keys, and all expiry cleanup indexes.
- Applying legacy `001_init.sql` after the active sequence failed on its incompatible `reports(id)` foreign key, confirming it must never be included in the production push.

These checks do not establish remote schema, secrets, scheduler operation or staging acceptance.

## Rollback and remaining release blockers

Keep sales disabled on any failed gate. Stop the scheduler if necessary and retain PAID orders/input/attempts. Do not roll back to the old production in-memory fulfillment code or drop the new tables. Prefer a corrected forward migration; restore backups only under a reviewed recovery plan that accounts for payments recorded since the backup.

Outstanding until actual connections are available: target identification, restorable backup, production schema/history comparison, migration application, scoped secrets, deployment/plan verification, scheduled invocation evidence, and all ten remote staging checks. Financial/dispute retention policy and operational response ownership remain launch requirements. No real Toss payment, real OpenAI request, or live-sales activation is required for this task.
