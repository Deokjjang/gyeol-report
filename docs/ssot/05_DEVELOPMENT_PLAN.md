05_DEVELOPMENT_PLAN.md 초안

# 05_DEVELOPMENT_PLAN.md
# 결리포트 Development Plan v0.1
Status: DRAFT  
Product: 결리포트 / Gyeol Report  
Scope: V1 MVP 개발 순서, 태스크 분리, 완료 기준
---
## 1. Purpose
이 문서는 결리포트 V1 MVP를 실제 개발하기 위한 작업 순서와 단계별 완료 기준을 고정한다.
V1의 목표는 다음이다.
```txt
사용자가 생년월일/출생시간/양음력/성별/MBTI를 입력한다.
→ 만세력 기반 사주 구조를 계산한다.
→ MBTI 자기인식 데이터와 결합한다.
→ 무료 미리보기를 제공한다.
→ 990원/1,290원 결제를 받는다.
→ 전체 자기서사 리포트를 공개한다.

⸻

2. Development Principles

V1 개발은 다음 원칙을 따른다.

작게 만든다.
계산 정확도를 먼저 잡는다.
LLM에게 사주 계산을 맡기지 않는다.
기능 확장보다 리포트 품질을 우선한다.
앱이 아니라 모바일 웹으로 만든다.
회원가입을 강제하지 않는다.
결제 금액은 서버에서만 결정한다.
대운/세운/궁합/신년사주는 V1에서 제외한다.

⸻

3. Fixed Stack

Framework: Next.js
Language: TypeScript
UI: Tailwind CSS + shadcn/ui
Backend: Next.js Route Handlers
DB: Supabase Postgres
Hosting: Vercel
Payment: Toss Payments
AI: LLM as report editor only
Testing: Vitest + Playwright
Package Manager: pnpm

⸻

4. V1 Milestones

M0. Project setup
M1. Database schema
M2. Saju calculation engine
M3. MBTI + analysis tag engine
M4. Interpretation block system
M5. Report generation pipeline
M6. Web UX flow
M7. Payment flow
M8. Validation, tests, deployment

⸻

M0. Project Setup

Goal

Next.js 기반 프로젝트를 생성하고 기본 개발 구조를 만든다.

Tasks

Task 00-1 — Create Project

pnpm create next-app gyeol-report

Recommended options:

TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Turbopack: Optional
Import alias: @/*

Expected Structure

gyeol-report/
  src/
    app/
    components/
    lib/
  docs/
    ssot/
  supabase/
    migrations/
    seed/
  tests/
    unit/
    e2e/

Done Criteria

pnpm dev works
Landing page renders
TypeScript build passes
SSOT docs are stored in docs/ssot/

⸻

M1. Database Schema

Goal

Supabase Postgres에 V1 최소 테이블을 만든다.

Tables

reports
payments
interpretation_blocks
mbti_profiles
report_events

Tasks

Task 01-1 — Create Supabase Project

* Supabase 프로젝트 생성
* 환경변수 준비
* 로컬 .env.local 구성

Task 01-2 — Create Migration

Create:

supabase/migrations/001_init.sql

Include:

* reports
* payments
* interpretation_blocks
* mbti_profiles
* report_events

Task 01-3 — DB Client

Create:

src/lib/db/supabaseServer.ts
src/lib/db/supabaseClient.ts

Done Criteria

Migration applies successfully
Tables exist
Server DB client can insert report_events
Service role key is server-only

⸻

M2. Saju Calculation Engine

Goal

입력값으로 deterministic한 사주 계산 결과를 만든다.

Module Path

src/lib/saju/

Files

src/lib/saju/types.ts
src/lib/saju/constants.ts
src/lib/saju/calendar.ts
src/lib/saju/solarTerms.ts
src/lib/saju/pillars.ts
src/lib/saju/tenGods.ts
src/lib/saju/fiveElements.ts
src/lib/saju/hiddenStems.ts
src/lib/saju/relations.ts
src/lib/saju/calculateSaju.ts

Tasks

Task 02-1 — Saju Types and Constants

Create:

src/lib/saju/types.ts
src/lib/saju/constants.ts

Include:

* HeavenlyStem
* EarthlyBranch
* FiveElement
* YinYang
* TenGod
* Pillar
* SajuCalcInput
* SajuCalcResult
* stem/branch tables
* element mappings
* yin/yang mappings
* hidden stem table

Task 02-2 — Day Pillar Calculation

Create:

src/lib/saju/pillars.ts

Implement:

* 60갑자 cycle
* day pillar from fixed epoch
* tests with known samples

Task 02-3 — Year and Month Pillar Calculation

Implement:

* 입춘 기준 year pillar
* 절기 기준 month pillar
* solar term boundary handling

Task 02-4 — Hour Pillar Calculation

Implement:

* 시지 calculation
* 시천간 calculation from day stem
* birthTimeUnknown handling

Task 02-5 — Five Elements and Ten Gods

Create:

src/lib/saju/fiveElements.ts
src/lib/saju/tenGods.ts

Implement:

* visible elements
* weighted elements
* ten gods by day master
* ten god distribution

Task 02-6 — Hidden Stems and Relations

Create:

src/lib/saju/hiddenStems.ts
src/lib/saju/relations.ts

Implement:

* hidden stem extraction
* stem combinations
* branch combinations
* branch clashes

Task 02-7 — calculateSaju()

Create:

src/lib/saju/calculateSaju.ts

Combine:

calendar conversion
year pillar
month pillar
day pillar
hour pillar
elements
ten gods
yin/yang
relations
notices

Done Criteria

calculateSaju(input) returns SajuCalcResult
Same input always returns same output
birthTimeUnknown returns no hour pillar
23:00~23:59 adds notice
At least 20 unit test samples pass during dev
At least 100 validation samples required before launch

Critical Rule

LLM must never calculate saju.

⸻

M3. MBTI + Analysis Tag Engine

Goal

사주 계산 결과와 MBTI 입력을 리포트 생성용 태그로 변환한다.

Module Path

src/lib/analysis/

Files

src/lib/analysis/types.ts
src/lib/analysis/mbtiProfiles.ts
src/lib/analysis/extractSajuTags.ts
src/lib/analysis/compareSajuMbti.ts

Tasks

Task 03-1 — Analysis Types

Create:

src/lib/analysis/types.ts

Include:

* SajuTag
* MbtiTag
* OverlapTag
* ConflictTag
* AnalysisTags

Task 03-2 — MBTI Profiles

Create:

src/lib/analysis/mbtiProfiles.ts

Include 16 MBTI profiles.

Each profile should include:

traits
strengths
weaknesses
relationshipStyle
workStyle
decisionStyle

Task 03-3 — Extract Saju Tags

Create:

src/lib/analysis/extractSajuTags.ts

Generate tags like:

DAY_MASTER_GAP_WOOD
EARTH_STRONG
WATER_MISSING
OFFICER_STRONG
WEALTH_STRONG
EXPRESSION_MISSING
RESOURCE_MISSING
HIGH_PRESSURE
HIGH_STANDARD
LOW_RECOVERY

Task 03-4 — Compare Saju and MBTI

Create:

src/lib/analysis/compareSajuMbti.ts

Output:

overlapTags
conflictTags
summarySignals

Done Criteria

ENTJ + high officer/wealth structure produces goal/standard/control overlap
Missing expression/resource can produce emotional expression/recovery conflict
MBTI UNKNOWN degrades gracefully
No direct “this saju is ENTJ” logic exists

⸻

M4. Interpretation Block System

Goal

해석 블록을 저장하고, 분석 태그에 맞는 블록을 선택한다.

Files

src/lib/analysis/selectBlocks.ts
supabase/seed/interpretation_blocks_seed.sql

Tasks

Task 04-1 — Block Selection Logic

Implement:

selectInterpretationBlocks(analysisTags)

Rules:

* active blocks only
* category balance
* weight-based ranking
* avoid duplicate meaning
* minimum blocks per report section

Task 04-2 — Initial Blocks

Create initial seed.

Minimum before internal test:

100 blocks

Minimum before public launch:

300 blocks

Preferred quality target:

500+ blocks

Done Criteria

Each of 12 report sections has enough selected blocks
No section is empty
Block selection is deterministic for same tags

⸻

M5. Report Generation Pipeline

Goal

선택된 블록을 기반으로 무료 미리보기와 전체 리포트를 생성한다.

Files

src/lib/analysis/buildPrompt.ts
src/lib/llm/client.ts
src/lib/analysis/generateReport.ts
src/lib/analysis/validateReport.ts

Tasks

Task 05-1 — Build Prompt

Prompt must include:

saju result summary
analysis tags
MBTI profile
overlap/conflict tags
selected blocks
section structure
tone guide
forbidden content rules

Task 05-2 — LLM Client

Create LLM wrapper.

Rules:

* server-only
* timeout handling
* JSON output required
* no client-side key exposure

Task 05-3 — Generate Report

Output:

preview
fullReport.12 sections
warnings

Task 05-4 — Validate Report

Check:

* required sections exist
* forbidden terms absent
* no daewoon/sewoon/gunghap references
* no disease/death/investment/legal/marriage certainty
* no “this saju is MBTI” wording

Done Criteria

Sample report generated
Report length roughly 3,500~5,000 Korean chars
Preview length roughly 500~800 Korean chars
Forbidden content filter works
LLM never receives instruction to calculate saju

⸻

M6. Web UX Flow

Goal

사용자가 모바일 웹에서 입력 → 미리보기 → 결제 → 전체 리포트를 볼 수 있게 한다.

Pages

/
 /report/new
 /report/preview/[token]
 /checkout/[token]
 /payment/success
 /payment/fail
 /report/[token]

Tasks

Task 06-1 — Landing Page

Include:

* 결리포트 설명
* 슬로건
* 가격
* CTA
* 고지문 요약

Task 06-2 — Input Form

Fields:

birthDate
birthTime
birthTimeUnknown
calendarType
isLeapMonth
gender
mbti

Task 06-3 — Preview Page

Include:

* preview text
* locked section list
* price
* CTA to checkout

Task 06-4 — Full Report Page

Include:

* 12 sections
* paid access only
* invalid token handling

Done Criteria

Mobile layout usable
User can create preview
Unpaid user cannot see full report
Paid user can revisit result link

⸻

M7. Payment Flow

Goal

토스페이먼츠 결제를 통해 결제 완료 후 전체 리포트를 공개한다.

Files

src/lib/payments/pricing.ts
src/lib/payments/tossClient.ts
src/app/api/payments/toss/prepare/route.ts
src/app/api/payments/toss/confirm/route.ts

Tasks

Task 07-1 — Pricing

Implement:

regular price = 1290
launch price = 990
launch period = 2 months from launch date

Server-side only.

Task 07-2 — Prepare Payment

Create orderId and payment record.

Task 07-3 — Confirm Payment

Confirm with Toss API.

Rules:

Verify orderId
Verify amount
Confirm with Toss secret key
Update payment status
Update report payment_status
Return full report URL

Task 07-4 — Payment UI

Use Toss payment widget or payment window.

Done Criteria

Mock/sandbox payment works
Amount tampering rejected
Paid report unlocks
Failed payment does not unlock
Payment events logged

⸻

M8. Validation, Tests, Deployment

Goal

출시 전 최소 검증 기준을 통과한다.

Unit Tests

Required:

saju day pillar tests
year pillar tests
month pillar tests
hour pillar tests
five element tests
ten gods tests
mbti profile tests
tag extraction tests
pricing tests
forbidden content filter tests

E2E Tests

Required:

input → preview
preview → payment prepare
payment success mock → full report
unpaid full report blocked
birthTimeUnknown flow
invalid token flow

Launch Validation

Before public launch:

100 saju validation samples
300+ interpretation blocks
payment sandbox pass
mobile UX pass
forbidden content filter pass
result token access pass
privacy policy page
refund policy page
terms page

Deployment

Vercel production deploy
Supabase production DB
Toss production keys
LLM production key
Domain connected

⸻

5. Recommended Task Order

개발 태스크 순서는 다음으로 고정한다.

Task 00 — Project setup
Task 01 — Supabase schema
Task 02 — Saju types/constants
Task 03 — Day pillar calculation
Task 04 — Year/month pillar calculation
Task 05 — Hour pillar calculation
Task 06 — Elements/ten gods
Task 07 — Saju calculate integration
Task 08 — MBTI profiles
Task 09 — Saju tag extraction
Task 10 — Saju-MBTI comparison
Task 11 — Interpretation block model + seed
Task 12 — Report prompt + LLM generation
Task 13 — Report validation filter
Task 14 — Create report API
Task 15 — Landing + input form
Task 16 — Preview page
Task 17 — Pricing + Toss prepare
Task 18 — Toss confirm + unlock
Task 19 — Full report page
Task 20 — E2E tests
Task 21 — Production deployment

⸻

6. First Development Task

첫 개발 태스크는 프로젝트 생성이다.

Task 00 — Project Setup

Task 00 Scope

Create:

Next.js project
TypeScript config
Tailwind
basic folder structure
docs/ssot copy
README skeleton

Task 00 DoD

pnpm install passes
pnpm dev passes
pnpm lint passes
pnpm build passes
docs/ssot contains 5 SSOT files
Landing page shows temporary 결리포트 title

⸻

7. Codex/Agent Task Format

각 개발 태스크는 다음 형식으로 작성한다.

# Task XX — Title
## Context
## Target Files
## Requirements
## Constraints
## Security
## Done Criteria
## Commands to Run
## Expected Output

⸻

8. Development Constraints

모든 태스크는 다음 제약을 따른다.

한 번에 너무 많은 파일을 수정하지 않는다.
사주 계산 로직과 LLM 로직을 섞지 않는다.
결제 금액을 클라이언트에서 신뢰하지 않는다.
서비스 키를 클라이언트에 노출하지 않는다.
V1 제외 기능을 구현하지 않는다.
보고서 문장은 금지 표현 필터를 통과해야 한다.
대운/세운/궁합은 V1에서 언급하지 않는다.

⸻

9. V1 Non-goals

V1 개발 중 다음은 하지 않는다.

앱 개발
자체 MBTI 테스트
회원가입
관리자 콘솔
대운 계산
세운 계산
궁합 계산
신년사주
이미지 생성
구독 결제
채팅 상담
커뮤니티
광고 시스템
추천 알고리즘

⸻

10. Launch Readiness Checklist

출시 준비 완료 기준:

[ ] SSOT 5개 저장 완료
[ ] Next.js production build pass
[ ] Supabase migration applied
[ ] Saju calculation tests pass
[ ] 100 validation samples checked
[ ] 300+ interpretation blocks loaded
[ ] Report generation works
[ ] Forbidden content filter works
[ ] Toss sandbox payment works
[ ] Paid unlock works
[ ] Mobile UX checked
[ ] Terms page exists
[ ] Privacy page exists
[ ] Refund policy exists
[ ] Vercel deployment works
[ ] Domain connected
[ ] Production payment key configured

⸻

11. Final V1 Build Summary

V1은 “결리포트 기본 자기서사 리포트” 하나만 만든다.
핵심은 만세력 계산 정확도, 사주-MBTI 태그 결합, 리포트 품질, 결제 플로우다.
웹앱으로 빠르게 출시하고, 대운/세운/궁합/신년사주는 후속 상품으로 분리한다.
## 다음 단계
이제 SSOT 5개가 끝났음.
바로 이어서 할 일은 **Task 00 — Project Setup** 작성이다.
원하면 다음 메시지에 그대로 붙여 넣을 수 있는 **Codex용 Task 00 지시문**으로 가면 된다.