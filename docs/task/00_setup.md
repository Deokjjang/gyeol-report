Task 00 — Project Setup

# Task 00 — Project Setup
## Context
We are building **결리포트 / Gyeol Report**, a mobile-first web service that generates a paid Saju × MBTI self-narrative report.
This task is only for initial project setup.
Do not implement Saju calculation, MBTI analysis, payment, LLM generation, or database logic in this task.
The fixed V1 stack is:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui-ready structure
- Supabase later
- Toss Payments later
- Vercel deployment later
- pnpm
The project must follow the SSOT documents already created:
- `docs/ssot/01_PRODUCT_SSOT.md`
- `docs/ssot/02_SAJU_CALC_SPEC.md`
- `docs/ssot/03_REPORT_SPEC.md`
- `docs/ssot/04_TECH_SPEC.md`
- `docs/ssot/05_DEVELOPMENT_PLAN.md`
## Goal
Create the initial Next.js project and minimum folder structure for V1 development.
## Target Files / Directories
Create or verify:
```txt
gyeol-report/
  src/
    app/
      page.tsx
      layout.tsx
      globals.css
    components/
    lib/
      saju/
      analysis/
      payments/
      db/
      llm/
      validation/
  docs/
    ssot/
      01_PRODUCT_SSOT.md
      02_SAJU_CALC_SPEC.md
      03_REPORT_SPEC.md
      04_TECH_SPEC.md
      05_DEVELOPMENT_PLAN.md
  supabase/
    migrations/
    seed/
  tests/
    unit/
    e2e/
  README.md
  package.json
  tsconfig.json
  next.config.ts
  eslint.config.mjs
  postcss.config.mjs

Requirements

1. Create a new Next.js project named:

gyeol-report

2. Use:

TypeScript
ESLint
Tailwind CSS
src directory
App Router
import alias @/*
pnpm

3. Create the following empty module directories:

src/lib/saju
src/lib/analysis
src/lib/payments
src/lib/db
src/lib/llm
src/lib/validation

4. Create the following project directories:

docs/ssot
supabase/migrations
supabase/seed
tests/unit
tests/e2e

5. Ensure the existing 5 SSOT markdown files are placed under:

docs/ssot/

6. Update the temporary landing page at:

src/app/page.tsx

The page should show:

결리포트
사주와 MBTI로 읽는 나의 결
정가 1,290원 / 출시 이벤트가 990원

7. The landing page should be simple, mobile-first, and use Tailwind classes.
8. Create or update README.md with:

# 결리포트 / Gyeol Report
Mobile-first Saju × MBTI self-narrative report service.
## V1 Scope
- Saju × MBTI basic self-narrative report
- Free preview
- One-time payment
- Full paid report unlock
## V1 Non-goals
- Native app
- Daewoon/Sewoon
- Compatibility report
- New year fortune
- Chat consultation

Constraints

* Do not implement Saju calculation.
* Do not implement MBTI analysis.
* Do not implement LLM calls.
* Do not implement Toss Payments.
* Do not implement Supabase connection logic.
* Do not add authentication.
* Do not add admin pages.
* Do not add image generation.
* Do not add V1.1/V2 features.
* Do not create speculative abstractions.
* Keep this task limited to project setup and structure only.

Security

* Do not create real secrets.
* Do not commit API keys.
* If .env.local.example is created, use placeholder values only.
* Do not expose server-only keys in client code.

Optional .env.local.example placeholders:

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
LLM_API_KEY=
LLM_MODEL=
REPORT_RESULT_TOKEN_SECRET=

Done Criteria

This task is complete only if:

pnpm install passes
pnpm dev starts the local server
pnpm lint passes
pnpm build passes
src/app/page.tsx renders temporary 결리포트 landing page
all required directories exist
README.md exists and reflects V1 scope/non-goals
docs/ssot contains the 5 SSOT files
no business logic is implemented
no secrets are committed

Commands to Run

pnpm install
pnpm lint
pnpm build
pnpm dev

Expected Output

After running pnpm dev, opening the local app should show a simple landing page with:

결리포트
사주와 MBTI로 읽는 나의 결
정가 1,290원 / 출시 이벤트가 990원

Report Back

After completion, report:

Modified/created files
Commands run
Build/lint result
Any failures
Next recommended task

Next recommended task should be:

Task 01 — Supabase Schema