# Supabase Production Setup Runbook

## Purpose

This runbook describes how to prepare Supabase report storage for the future paid report flow. It covers project setup, migration application, local smoke verification, Vercel environment variables, rollback, and safety checks.

## Current Safe State

preview_memory remains the default runtime.

/api/reports/create is not switched to Supabase in this task.

Payment remains inactive, and this runbook does not change any production route behavior.

## Required Supabase Project Values

Use placeholders until the real project is created:

```text
SUPABASE_URL=<project-url>
SUPABASE_ANON_KEY=<anon-key>
REPORT_PERSISTENCE_MODE=supabase
```

The anon key is used only by server-side persistence wiring in this project. Do not add browser-exposed Supabase behavior in this setup step.

## Secret Handling Rules

Do not commit Supabase keys.

Do not paste keys into chat.

Do not use service role key in client-exposed code.

Do not put birth data or keys in URLs.

Keep personal input values, access hashes, and generated report JSON out of logs unless a local-only QA command explicitly needs safe status output.

## Migration Application

Apply the existing migration only to the intended Supabase project.

```powershell
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
```

Before running `supabase db push`, confirm the project ref in the Supabase dashboard and the linked CLI state. Do not run migrations against an unconfirmed project.

## Local Smoke Test

After the migration is applied, run the smoke test locally with placeholder values replaced by the project values:

```powershell
$env:REPORT_PERSISTENCE_MODE = "supabase"
$env:SUPABASE_URL = "<project-url>"
$env:SUPABASE_ANON_KEY = "<anon-key>"
pnpm exec jiti scripts/smoke_supabase_report_persistence.ts
```

The script should create a deterministic smoke report payload and write a row through the Supabase persistence runtime. It must not print environment values.

## Vercel Environment Variables

Future Vercel variables for the persistence switch:

```text
REPORT_PERSISTENCE_MODE=supabase
SUPABASE_URL=<project-url>
SUPABASE_ANON_KEY=<anon-key>
```

Do not set Production to supabase until local smoke test passes and SUPABASE-01C is complete.

Use Preview or a controlled environment first if the runtime switch is tested on Vercel.

## Production Enablement Plan

1. Create the Supabase project.
2. Apply the migration to the confirmed project.
3. Run the local smoke test successfully.
4. Complete SUPABASE-01C for the explicit route/runtime switch plan.
5. Verify report creation, storage, and safe read boundaries before enabling a paid flow.

## Rollback Plan

Set REPORT_PERSISTENCE_MODE back to preview_memory or remove the variable.

Redeploy after env changes.

If Supabase writes fail during a controlled rollout, stop the rollout and keep report creation on preview-memory until the failing adapter, migration, or environment value is fixed.

## Verification Checklist

- Confirm the migration exists in the intended Supabase project.
- Confirm `access_token_hash`, `access_token_created_at`, and `access_token_version` are populated by the smoke insert path.
- Confirm no Supabase keys are committed.
- Confirm the smoke script does not print environment values.
- Confirm `/api/reports/create` remains unchanged until the explicit route switch task.
- Confirm payment remains inactive.

## Non-Goals

No payment implementation.

No route switch in this task.

No share page implementation.

No service role key usage.
