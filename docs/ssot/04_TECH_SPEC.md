04_TECH_SPEC.md 초안

# 04_TECH_SPEC.md
# 결리포트 Tech Spec v0.1
Status: DRAFT  
Product: 결리포트 / Gyeol Report  
Scope: V1 MVP 기술 구조, 스택, DB, API, 결제, 배포, 보안 기준
---
## 1. Purpose
이 문서는 결리포트 V1 MVP를 개발하기 위한 기술 구조를 고정한다.
V1의 목표는 앱이 아니라 모바일 웹 기반으로 빠르게 시장 검증 가능한 유료 리포트 서비스를 출시하는 것이다.
핵심은 다음이다.
```txt
정확한 만세력 계산
→ 안정적인 리포트 생성
→ 무료 미리보기
→ 소액 결제
→ 전체 리포트 공개

⸻

2. Tech Stack

V1 기술 스택은 다음으로 고정한다.

Framework: Next.js
Language: TypeScript
UI: Tailwind CSS + shadcn/ui
Backend: Next.js Route Handlers
Database: Supabase Postgres
Hosting: Vercel
Payment: Toss Payments
AI: OpenAI API or compatible LLM API
Testing: Vitest + Playwright
Package Manager: pnpm
Version Control: Git + GitHub

⸻

3. Platform Decision

V1은 모바일 웹으로만 제공한다.

Included

* 모바일 웹
* 데스크톱 대응 최소 수준
* 결과 링크 재접속
* 결제 후 전체 리포트 열람

Excluded

* iOS 앱
* Android 앱
* Flutter 앱
* React Native 앱
* 앱스토어 배포
* 푸시 알림
* 네이티브 인앱 결제

Rationale

앱은 초기 검증에 불리하다.

* 설치 장벽이 높다.
* 앱스토어 심사가 필요하다.
* 결제 정책이 복잡해진다.
* SEO와 공유 링크 유입이 약하다.
* V1 상품은 반복 사용보다 단건 결제 검증이 우선이다.

⸻

4. Hosting and Deployment

Hosting

Vercel

Vercel은 Next.js 웹앱 배포와 서버리스 Route Handler 실행을 담당한다.

Deployment Flow

Local development
→ GitHub push
→ Vercel automatic build
→ Production deployment

Environments

development
preview
production

Required Environment Variables

NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TOSS_CLIENT_KEY
TOSS_SECRET_KEY
LLM_API_KEY
LLM_MODEL
REPORT_RESULT_TOKEN_SECRET

Rules

* Secret key는 클라이언트에 노출하지 않는다.
* NEXT_PUBLIC_* 환경변수에는 공개 가능한 값만 넣는다.
* 결제 검증, 리포트 생성, DB write는 서버에서만 처리한다.

⸻

5. Database

Database Provider

Supabase Postgres

Supabase를 선택하는 이유:

* 리포트/결제/콘텐츠 블록 관리에 SQL이 적합하다.
* MBTI, 사주 태그, 해석 블록 통계 분석이 쉽다.
* 향후 관리자 페이지와 분석 쿼리 확장이 쉽다.
* Firebase보다 콘텐츠/결제형 서비스에 적합하다.

⸻

6. Database Tables

V1 최소 테이블은 다음과 같다.

reports
payments
interpretation_blocks
mbti_profiles
report_events

⸻

7. reports Table

사용자가 생성한 리포트 단위 레코드다.

create table reports (
  id uuid primary key default gen_random_uuid(),
  result_token text unique not null,
  birth_date date not null,
  birth_time time null,
  birth_time_unknown boolean not null default false,
  calendar_type text not null check (calendar_type in ('SOLAR', 'LUNAR')),
  is_leap_month boolean null,
  gender text not null check (gender in ('MALE', 'FEMALE', 'OTHER_OR_UNSPECIFIED')),
  mbti text not null,
  calc_spec_version text not null,
  report_spec_version text not null,
  saju_result jsonb null,
  analysis_tags jsonb null,
  selected_blocks jsonb null,
  preview_text text null,
  full_report jsonb null,
  generation_status text not null default 'PENDING'
    check (generation_status in ('PENDING', 'GENERATING', 'READY', 'FAILED')),
  payment_status text not null default 'UNPAID'
    check (payment_status in ('UNPAID', 'PAID', 'REFUNDED')),
  error_message text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz null
);

Notes

* result_token은 사용자가 결과 페이지에 재접속할 때 사용한다.
* 회원가입 없이 링크 기반 접근을 허용한다.
* full_report는 결제 전에도 DB에는 저장될 수 있지만, API 응답에서는 결제 전 공개하지 않는다.

⸻

8. payments Table

결제 기록 테이블이다.

create table payments (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references reports(id) on delete restrict,
  provider text not null check (provider in ('TOSS')),
  order_id text unique not null,
  payment_key text unique null,
  amount integer not null,
  currency text not null default 'KRW',
  status text not null default 'READY'
    check (status in ('READY', 'PAID', 'FAILED', 'CANCELED', 'REFUNDED')),
  raw_request jsonb null,
  raw_response jsonb null,
  created_at timestamptz not null default now(),
  paid_at timestamptz null,
  failed_at timestamptz null,
  refunded_at timestamptz null
);

Payment Amounts

Launch Price: 990 KRW
Regular Price: 1,290 KRW

가격은 서버에서 결정한다.
클라이언트가 보낸 가격을 신뢰하지 않는다.

⸻

9. interpretation_blocks Table

해석 블록 저장 테이블이다.

create table interpretation_blocks (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  block_key text not null,
  conditions jsonb not null default '[]'::jsonb,
  title text null,
  body text not null,
  tone text not null default 'BALANCED'
    check (tone in ('SOFT', 'DIRECT', 'BALANCED')),
  weight integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(category, block_key)
);

Categories

DAY_MASTER
FIVE_ELEMENT_STRONG
FIVE_ELEMENT_MISSING
TEN_GOD_STRONG
TEN_GOD_MISSING
YIN_YANG
MBTI_PROFILE
OVERLAP_PATTERN
CONFLICT_PATTERN
LOVE_STYLE
WORK_STYLE
CAREER_DIRECTION
MONEY_SENSE
RELATIONSHIP_PATTERN
WEAKNESS_PATTERN
COMPENSATION_STRATEGY
NARRATIVE_IMAGE

⸻

10. mbti_profiles Table

MBTI별 기본 태그와 설명을 저장한다.

create table mbti_profiles (
  type text primary key,
  ei text not null,
  sn text not null,
  tf text not null,
  jp text not null,
  traits jsonb not null default '[]'::jsonb,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

MBTI UNKNOWN

사용자가 MBTI를 모를 경우 UNKNOWN을 허용할 수 있다.

UNKNOWN

단, V1 UI에서는 MBTI 직접 선택을 기본으로 한다.

⸻

11. report_events Table

리포트 생성/결제 흐름의 최소 이벤트 로그다.

create table report_events (
  id uuid primary key default gen_random_uuid(),
  report_id uuid null references reports(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

Event Types

REPORT_CREATED
SAJU_CALCULATED
TAGS_EXTRACTED
BLOCKS_SELECTED
PREVIEW_GENERATED
FULL_REPORT_GENERATED
PAYMENT_READY
PAYMENT_CONFIRMED
PAYMENT_FAILED
REPORT_VIEWED
REPORT_ERROR

⸻

12. API Routes

V1 API 구조는 다음으로 고정한다.

POST /api/reports
GET  /api/reports/:token/preview
GET  /api/reports/:token/full
POST /api/payments/toss/prepare
POST /api/payments/toss/confirm
GET  /api/health

⸻

13. POST /api/reports

리포트 생성을 시작한다.

Request

type CreateReportRequest = {
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
  calendarType: "SOLAR" | "LUNAR";
  isLeapMonth?: boolean;
  gender: "MALE" | "FEMALE" | "OTHER_OR_UNSPECIFIED";
  mbti: string;
};

Server Flow

1. Validate input
2. Create reports row
3. Calculate saju
4. Extract saju tags
5. Extract MBTI tags
6. Compare overlap/conflict
7. Select interpretation blocks
8. Generate preview and full report
9. Save result
10. Return result_token and preview URL

Response

type CreateReportResponse = {
  reportId: string;
  resultToken: string;
  previewUrl: string;
};

Rule

초기 MVP에서는 동기 생성으로 시작할 수 있다.
생성 시간이 길어지면 비동기 job 구조로 전환한다.

⸻

14. GET /api/reports/:token/preview

무료 미리보기를 반환한다.

Response

type PreviewReportResponse = {
  resultToken: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  previewText: string;
  lockedSections: string[];
  price: {
    amount: number;
    regularAmount: number;
    currency: "KRW";
    isLaunchEvent: boolean;
  };
};

⸻

15. GET /api/reports/:token/full

전체 리포트를 반환한다.

Rule

* 결제 완료 상태면 전체 리포트 반환
* 미결제 상태면 preview만 반환하거나 402 상태 반환
* 존재하지 않는 token이면 404
* 생성 실패 상태면 오류 안내

Response

type FullReportResponse = {
  resultToken: string;
  fullReport: {
    narrativeImage: string;
    coreTemperament: string;
    sajuStructure: string;
    mbtiOverlap: string;
    mbtiConflict: string;
    loveStyle: string;
    workStudyStyle: string;
    careerDirection: string;
    moneySense: string;
    relationshipPattern: string;
    repeatingWeakness: string;
    compensationStrategy: string;
  };
};

⸻

16. POST /api/payments/toss/prepare

토스 결제 준비용 orderId를 생성한다.

Request

type PreparePaymentRequest = {
  resultToken: string;
};

Server Flow

1. Find report by token
2. Check report generation status
3. Check not already paid
4. Determine server-side price
5. Create payment row
6. Return orderId, amount, customerKey if needed

Response

type PreparePaymentResponse = {
  orderId: string;
  amount: number;
  currency: "KRW";
  orderName: string;
};

⸻

17. POST /api/payments/toss/confirm

토스페이먼츠 결제 승인 API다.

Request

type ConfirmPaymentRequest = {
  paymentKey: string;
  orderId: string;
  amount: number;
};

Server Flow

1. Find payment by orderId
2. Verify amount matches server-side payment amount
3. Call Toss Payments confirm API with secret key
4. If success, update payments.status = PAID
5. Update reports.payment_status = PAID
6. Set reports.paid_at
7. Return full report URL

Critical Rule

클라이언트가 보낸 amount를 신뢰하지 않는다.
반드시 DB의 payment amount와 비교한다.

⸻

18. Report Generation Pipeline

기술적 리포트 생성 순서:

CreateReportRequest
→ validateReportInput()
→ calculateSaju()
→ extractSajuTags()
→ getMbtiProfile()
→ compareSajuAndMbti()
→ selectInterpretationBlocks()
→ buildReportPrompt()
→ generateReportWithLLM()
→ validateGeneratedReport()
→ saveReport()

⸻

19. Saju Engine Module

위치:

src/lib/saju/

구조:

src/lib/saju/
  constants.ts
  calendar.ts
  solarTerms.ts
  pillars.ts
  tenGods.ts
  fiveElements.ts
  hiddenStems.ts
  relations.ts
  calculateSaju.ts
  types.ts

Rule

사주 계산 모듈은 LLM과 완전히 분리한다.

⸻

20. Analysis Module

위치:

src/lib/analysis/

구조:

src/lib/analysis/
  extractSajuTags.ts
  mbtiTags.ts
  compareSajuMbti.ts
  selectBlocks.ts
  buildPrompt.ts
  generateReport.ts
  validateReport.ts
  types.ts

⸻

21. Payment Module

위치:

src/lib/payments/

구조:

src/lib/payments/
  tossClient.ts
  pricing.ts
  types.ts

pricing.ts

가격은 서버 코드에서 결정한다.

export const REGULAR_PRICE_KRW = 1290;
export const LAUNCH_PRICE_KRW = 990;

출시 이벤트 기간도 서버에서 판정한다.

⸻

22. Frontend Routes

Next.js App Router 기준.

src/app/
  page.tsx
  report/
    new/
      page.tsx
    preview/
      [token]/
        page.tsx
    [token]/
      page.tsx
  checkout/
    [token]/
      page.tsx
  payment/
    success/
      page.tsx
    fail/
      page.tsx

⸻

23. UI Pages

Landing Page

Path:

/

Purpose:

* 서비스 설명
* 가격 표시
* 무료 미리보기 CTA
* 법적 고지 요약

⸻

Input Page

Path:

/report/new

Fields:

* 생년월일
* 양력/음력
* 윤달 여부
* 출생시간
* 출생시간 모름
* 성별
* MBTI

⸻

Preview Page

Path:

/report/preview/[token]

Includes:

* 무료 미리보기
* 잠긴 섹션 목록
* 가격
* 결제 CTA

⸻

Checkout Page

Path:

/checkout/[token]

Includes:

* 주문명
* 가격
* 토스페이먼츠 결제위젯

⸻

Full Report Page

Path:

/report/[token]

Includes:

* 전체 리포트 12섹션
* 결제 완료자만 접근 가능
* 다시 보기 가능

⸻

24. Authentication Policy

V1에서는 회원가입을 강제하지 않는다.

Access Model

result_token 기반 링크 접근

Reason

* 회원가입은 결제 전환율을 낮춘다.
* V1은 단건 리포트 상품이다.
* 사용자는 결과 링크로 재접속하면 충분하다.

Later

V1.2 이후 다음을 고려할 수 있다.

* 이메일 기반 결과 찾기
* 카카오 로그인
* Google 로그인
* 내 리포트 보관함

⸻

25. Result Token Policy

result_token은 추측 불가능해야 한다.

Requirements

* 최소 128-bit entropy
* UUID만 단독으로 쓰지 않는 것을 권장
* URL-safe token 사용
* DB에 unique index 적용

Expiration

V1 기본 정책:

결과 링크는 최소 30일 보관

추후 비용과 개인정보 정책에 따라 조정 가능.

⸻

26. Privacy Policy

V1에서 저장하는 개인정보성 데이터:

* 생년월일
* 출생시간
* 성별
* MBTI
* 결제 정보 일부
* 리포트 결과

Rules

* 주민등록번호 수집 금지
* 실명 수집 금지
* 전화번호 수집 금지
* 주소 수집 금지
* 출생지 수집 금지
* 불필요한 민감정보 수집 금지

Payment

카드번호 등 민감 결제정보는 직접 저장하지 않는다.
토스페이먼츠가 처리한다.

저장 가능:

* paymentKey
* orderId
* amount
* payment status
* provider response

⸻

27. Security Rules

Server-only

다음은 서버에서만 실행한다.

* 사주 계산
* 리포트 생성
* LLM 호출
* 결제 검증
* Supabase service role write
* 가격 결정

Client Must Not

* 결제 금액 결정
* fullReport 직접 요청 우회
* secret key 접근
* service role key 접근

Required Checks

* Input validation
* Payment amount verification
* Report token verification
* Payment status verification
* Forbidden content validation

⸻

28. LLM Usage

LLM은 리포트 문장 편집기로만 사용한다.

Allowed

* 선택된 해석 블록을 자연스럽게 연결
* 문체 정리
* 섹션별 문장 생성
* 반복 표현 줄이기

Forbidden

* 사주 계산
* 대운/세운 생성
* 없는 명리학 요소 추가
* 사용자 입력에 없는 정보 추측
* 질병/사고/투자/결혼 단정

Recommended Cost Control

* 짧은 prompt 사용
* 선택된 블록만 전달
* full report 1회 생성 후 저장
* 재조회 시 LLM 재호출 금지
* 같은 report에 중복 생성 방지

⸻

29. Cost Control

V1 원가 목표:

AI cost per paid report: 20 KRW 이하 목표

Rules

* 결제 전 full report를 생성할지 여부는 비용 기준으로 결정한다.
* 초기에는 preview + full report 동시 생성 가능.
* 트래픽 증가 후에는 preview 먼저 생성, 결제 후 full report 생성으로 전환 가능.
* LLM 결과는 반드시 저장하고 재사용한다.

⸻

30. Pricing Logic

가격 결정 함수는 서버에 둔다.

type PriceResult = {
  amount: number;
  regularAmount: number;
  currency: "KRW";
  isLaunchEvent: boolean;
};
function getCurrentReportPrice(now: Date): PriceResult {
  // launch event period check
}

V1 Values

Regular Price: 1290
Launch Price: 990
Launch Event Period: 2 months from launch date

⸻

31. Error Handling

Report Generation Failed

User message:

리포트 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.

Payment Failed

결제가 완료되지 않았습니다. 결제 수단을 확인한 뒤 다시 시도해 주세요.

Paid But Report Missing

결제는 확인되었지만 리포트 생성에 문제가 발생했습니다. 고객지원으로 문의해 주세요.

This case must be logged as high priority.

Invalid Token

결과 링크를 찾을 수 없습니다.

⸻

32. Testing

Unit Tests

Use:

Vitest

Required test areas:

* 사주 계산
* 오행 계산
* 십성 계산
* MBTI 태그 매핑
* 공통/충돌 분석
* 가격 계산
* 금지 표현 필터

E2E Tests

Use:

Playwright

Required flows:

1. 입력폼 작성 → 미리보기 생성
2. 미리보기 → 결제 준비
3. 결제 성공 mock → 전체 리포트 접근
4. 미결제 사용자의 전체 리포트 접근 차단
5. 출생시간 모름 리포트 생성

⸻

33. Observability

V1 최소 로그 이벤트:

REPORT_CREATED
REPORT_GENERATION_FAILED
PAYMENT_READY
PAYMENT_CONFIRMED
PAYMENT_FAILED
FULL_REPORT_VIEWED

Metrics

* 생성 요청 수
* 생성 실패율
* 미리보기 생성 수
* 결제 전환율
* 결제 실패율
* 전체 리포트 열람률
* 평균 생성 시간

⸻

34. Repository Structure

초기 추천 구조:

gyeol-report/
  src/
    app/
    components/
    lib/
      saju/
      analysis/
      payments/
      db/
      llm/
      validation/
    styles/
  supabase/
    migrations/
    seed/
  docs/
    ssot/
      01_PRODUCT_SSOT.md
      02_SAJU_CALC_SPEC.md
      03_REPORT_SPEC.md
      04_TECH_SPEC.md
      05_DEVELOPMENT_PLAN.md
  tests/
    unit/
    e2e/
  package.json
  pnpm-lock.yaml
  next.config.ts
  tsconfig.json
  tailwind.config.ts
  README.md

⸻

35. Development Order

기술 구현 순서는 다음을 따른다.

1. Next.js 프로젝트 생성
2. 기본 폴더 구조 생성
3. Supabase schema 작성
4. 사주 타입/상수 작성
5. 만세력 계산 엔진 작성
6. MBTI 태그 작성
7. 사주 태그 추출 작성
8. 공통/충돌 분석 작성
9. 해석 블록 seed 작성
10. 리포트 생성 pipeline 작성
11. 입력폼 작성
12. 미리보기 페이지 작성
13. 결제 연동
14. 전체 리포트 페이지 작성
15. 테스트
16. 배포

⸻

36. V1 Technical Non-goals

V1에서 하지 않는다.

앱 개발
회원가입 시스템
관리자 콘솔
대규모 큐 시스템
대운/세운 계산
궁합 계산
이미지 생성
소셜 로그인
구독 결제
복잡한 추천 시스템
실시간 채팅
사용자 커뮤니티

⸻

37. Final V1 Decision Summary

Frontend: Next.js App Router
Language: TypeScript
UI: Tailwind CSS + shadcn/ui
Backend: Next.js Route Handlers
DB: Supabase Postgres
Hosting: Vercel
Payment: Toss Payments
AI: LLM as editor only
Auth: No forced signup
Access: result_token link
Platform: Mobile web
App: Not in V1
Report generation: code/rule based + LLM editing
Saju calculation: deterministic server-side code
Payment price: server-side only
Full report: paid users only
## 이 문서에서 제일 중요한 고정값
```txt
1. 앱 말고 모바일 웹
2. Next.js + TypeScript
3. Supabase Postgres
4. Vercel 배포
5. Toss Payments 결제
6. 회원가입 강제 없음
7. result_token 링크 재접속
8. LLM은 편집자
9. 사주 계산은 서버 룰 기반
10. 결제 금액은 서버만 결정
