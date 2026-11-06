# v5 최종3 — 9. 이용권·열람·환불 / 10. 문서 3종 보고

작성 2026-11-05 · worktree `~/Developer/gyeol-worktrees/v5-final`(v5/final, HEAD bdedbe6f) · 커밋 없음(작업 트리만) · 운영 DB·Vercel·비밀값 접근 0, 결제·환불 실행 0, Supabase MCP SQL 0.
로컬 Supabase(Docker)에만 migration 1개를 적용했다.

## 0. 한눈에

| 항목 | 판정 | 한 줄 |
|---|---|---|
| 9-1 이용권 30일(앞으로 발급분) | PASS | TS 상수 `TICKET_VALID_DAYS=30` + SQL이 30일을 넘기지 않음(이벤트·보너스·보상 A·B·관리자 지급). 구매 이용권·기존 발급분은 그대로 |
| 9-2 선물해도 만료일 승계 | PASS | 받은 이용권 기한 = 선물의 처음 기한(기존 SQL 동작 확인 + 시험) |
| 9-3 지급 화면·안내·이용권 표시에 만료일 | PASS(코드·SSR 시험) / 화면 캡처 UNVERIFIED | 서재 이용권 묶음 "1장 · 12월 5일까지", 선물 받기 화면, 보상 안내(지급 전 "받은 날부터 30일"), 선물·내가 쓰기 메시지 |
| 9-4 이용권 리포트 환불 없음·재생성만 | PASS(문서·결제 화면) | 관리자 재생성 경로: 결제 Book은 있었고, **이용권 Book은 화면 경로가 없어 새로 추가**(`ticket-regenerate`) |
| 9-5 선물 기능 유지 | PASS | 동작 변경 없음(표시 문구만 추가) |
| 9-6 열람 기간 버전별 | PASS(로컬 DB·PGlite) | v5 Book은 `expires_at='infinity'`(버전 필드로 결정), v5 이전은 처음 발행+90일 그대로. 삭제 작업은 v5에 닿지 않음 |
| 9-7 화면 「90일」 문구 버전별 | PASS(살아 있는 화면) / PARTIAL(옛 v4 화면 원문은 남김) | 결제 직전·서재·만료 안내·이용권 상점 문구 교체, 옛 `/products`는 책 첫 화면으로 |
| 9-8 혜택 알림 받기(선택) | PASS | 가입 화면(기존 체크박스, 문구·버전 갱신) + 마이페이지 켜기/끄기·동의 일시 표시. **migration 없음**(기존 `account_consent_events.recorded_at`) |
| 10 문서 3종 | PASS(코드·시험) / 법률 검토 필요 문장 §8 | 개인정보처리방침 16절(법정 항목 전부), 약관 이용권·AI·버전별 열람·종료 안내, 환불정책 이용권 재생성 |
| AI 작성 고지(결제 직전·책 끝) | PASS | v5 상품 결제 직전 + v5 책 끝 페이지(읽을 때만, 저장본 불변) |
| 시행일 = 배포일 | UNVERIFIED(배포 때 정함) | `POLICY_EFFECTIVE_DATE = null` → 문서에 "배포일(확정 전)". 배포 커밋에서 날짜를 채운다 |

## 1. 바꾼 파일

### 1-1. 이 작업만 바꾼 파일(파일째 커밋해도 됨)

새 파일
- `supabase/migrations/20261105120000_v5_final3_tickets_reading.sql`
- `src/lib/legal/aiNotice.ts`
- `src/components/legal/PolicyBlocks.tsx`
- `src/app/products/layout.tsx`
- `tests/unit/ops/final3TicketsReading.test.ts`
- `docs/v5/final3/legal-ops-report.md`(이 문서)

삭제
- `src/lib/legal/privacyPolicyDraft.ts`(초안을 정식 방침에 합침)

수정
- 문서: `src/lib/legal/privacyPolicy.ts`, `src/lib/legal/termsPolicy.ts`, `src/lib/legal/refundPolicy.ts`, `src/lib/legal/policyVersions.ts`
- 문서 화면: `src/app/privacy/page.tsx`, `src/app/privacy/draft/page.tsx`(→ `/privacy` 308), `src/app/refund/page.tsx`, `src/app/dev/book-preview/BookLegal.tsx`
- 이용권·열람: `src/lib/ops/config.ts`, `src/lib/ops/compMessages.ts`, `src/lib/tickets/handler.ts`, `src/components/account/TicketSummary.tsx`, `src/components/ops/AccountOps.tsx`, `src/components/ops/GiftClaim.tsx`, `src/lib/library/model.ts`, `src/components/account/Library.tsx`, `src/lib/sharing/reportShareStore.ts`, `src/components/report/ReportStatusView.tsx`, `src/components/account/TicketShop.tsx`, `src/components/account/TicketRefund.tsx`
- 관리자: `src/lib/ops/admin/actions.ts`, `src/app/admin/orders/AdminClient.tsx`, `src/app/admin/orders/page.tsx`, `src/app/admin/orders/[code]/page.tsx`
- 결제 직전: `src/components/book/BookRoutes.tsx`, `src/components/book/BookInput.tsx`, `src/components/book/BookCheckout.tsx`
- 혜택 알림: `src/lib/account/contact.ts`, `src/lib/account/profile.ts`, `src/components/account/AccountScreen.tsx`
- 시험: `tests/helpers/v5Scenarios.ts`(최종3 migration을 v5 큐 시험 DB에 포함), `tests/unit/ops/{compChoice,adminP6e,p6eOps,accountOps}.test.ts`, `tests/unit/legal/{privacyPolicy,termsPolicy,refundPolicy}.test.ts`, `tests/unit/components/LegalDocuments.test.tsx`, `tests/unit/app/{legalPagesSource,policyPagesSource}.test.ts`, `tests/unit/app/bookPublicFlow.test.tsx`, `tests/unit/payment/{reportPublishExpiry.test.tsx,ticketBundleCommerce.test.ts}`

### 1-2. 다른 작업과 같이 쓰는 파일(이 작업 몫은 아래 줄만)

| 파일 | 이 작업이 넣은 것 | 같은 파일의 다른 변경 |
|---|---|---|
| `src/lib/writer/book.ts` | import `AI_WRITTEN_NOTICE_KO`(11행) + back 페이지에 `aiNotice: AI_WRITTEN_NOTICE_KO`(404행 한 줄) | 리드 변경 다수 |
| `src/app/dev/book-preview/bookTypes.ts` | back 종류에 `aiNotice?: string`과 주석 한 줄(30–31행) | 다른 에이전트의 pair·appendix 변경 |
| `src/app/dev/book-preview/BookReader.tsx` | back 페이지에 `{page.aiNotice ? <p className={s.aiNotice} data-ai-notice>…</p> : null}`(125행) | 다른 에이전트 변경 |
| `src/app/dev/book-preview/book.module.css` | `.backContent > .aiNotice …` 두 줄 | 다른 에이전트의 `.pairRelations h3` |
| `docs/v5/deploy-checklist.md` | 1-1 표 6번 행 + 그 아래 두 줄, 2절 env 표 `COMP_*`·`GIFT_EVENT_*` 두 행(유효일 env 삭제 반영) | 없음(이 작업 전 미수정) |

## 2. 9번 항목별 결과와 근거

### 9-1 이용권 유효기간 30일 — PASS
- TS: `src/lib/ops/config.ts:32` `TICKET_VALID_DAYS = 30`. 이벤트(`giftEventConfig.validDays`), 보상 A·B(`compConfig.aDays/bDays`)가 이 값을 쓴다. `GIFT_EVENT_VALID_DAYS`·`COMP_A_VALID_DAYS`·`COMP_B_VALID_DAYS`는 더 이상 읽지 않는다(예전 A 기본 60일 → 30일).
- SQL(migration): `ops_gift` issue·bonus 기한 = `least(보낸 값, now()+30일)`, `ops_comp` 유효일 `least(days,30)`, `report_tickets`를 감싸 **기한 없이 들어온 지급**(관리자 지급 `manual`·캠페인 `promotion`·`referral`·`welcome`)은 발급일+30일. 같은 key로 다시 부르면 처음 기한을 그대로 넘겨 기존 멱등 비교가 맞는다(계정 잠금 키 10을 먼저 잡음).
- 그대로 두는 것: 구매 이용권(`purchase`, 묶음 판매는 꺼져 있음)·환불 되돌림, 이미 발급한 이용권·선물 행(발급 때 기한), 런칭 이벤트 정규화(10/31 고정, 끝난 이벤트).
- 근거: `pnpm exec vitest run tests/unit/ops/final3TicketsReading.test.ts` → 6/6 통과(이벤트 90일 요청 → 30일, 보상 A 60일 → 30일, 관리자 지급 30일·재요청 같은 grantId, 구매 이용권 기한 없음). 로컬 DB 적용 뒤 `ops_comp` 본문에 `least(days,30)`, `ops_gift`에 `now()+interval '30 days'` 2곳 확인.

### 9-2 선물해도 만료일 승계 — PASS
- 기존 `ops_gift('claim')`이 `w.expires_at`(선물의 처음 기한)을 그대로 이용권에 넣는다. 받은 이용권은 `report_tickets` 지급이라 다시 선물할 수 없다(선물 1회).
- 근거: 같은 시험에서 선물 기한을 5일로 당긴 뒤 친구가 받으면 받은 이용권 `expires_at` = 선물 기한(문자열 동일).

### 9-3 만료일 표시 — PASS(코드·SSR 시험) / 화면 캡처 UNVERIFIED
- 서재 이용권: `report_tickets('summary')`가 `lots`(남은 장수·만료일, 만료 이른 순)를 돌려주고(`src/lib/tickets/handler.ts:25`), `TicketSummary.tsx`가 "1장 · 12월 5일까지 / …"로 보인다(예전 기한 없는 이용권은 "기한 없음").
- 이벤트·보상 이용권 목록: 기존 "…까지" 표시 유지 + "받은 날부터 30일 · 선물해도 기한 그대로 · 현금 교환·환불 불가" 한 줄(`AccountOps.tsx:120`). 내가 쓰기/선물 링크 메시지에 그 장의 기한.
- 선물 받기 화면: 받기 전·받은 뒤 "YYYY년 M월 D일까지 쓸 수 있어요."(`GiftClaim.tsx:9`).
- 보상 안내: 지급 뒤 "{기한}까지"(기존), 지급 전 "받은 날부터 30일 동안 쓸 수 있어요."(`compMessages.ts`).
- 관리자 지급 결과 메시지에는 기한을 따로 넣지 않았다(고객 서재에 보임).
- 브라우저 캡처는 서재·선물 화면을 찍지 않았다(로그인·보상 계정 준비 필요) → UNVERIFIED.

### 9-4 이용권 리포트: 환불 없음·재생성만 — PASS
- 문서: 약관 「이용권」·「청약철회 및 환불」, 환불정책 새 행 `ticket_report`, 결제 직전 문구(이용권 선택 시 "이용권으로 만든 책은 환불되지 않아요. 오류가 있으면 다시 만들어 드려요.").
- 관리자 재생성 경로 확인:

| Book 종류 | 경로 | 상태 |
|---|---|---|
| 결제 Book | `/admin/orders/[주문코드]` → 「다시 만들기」 → `actions.ts:141 regenerate`(공개 전 실패 `admin_retry`, 공개 Book은 `ops_generation('regenerate')` → 교체 레인) | 있었음 |
| 이용권 Book | 주문코드가 없어 화면으로 찾을 수 없었음(SQL `ops_generation('regenerate')`·교체 레인은 `origin='ticket'`을 이미 지원) | **새로 추가**: `/admin/orders?tab=delayed` 「이용권 Book 다시 만들기」(Book 주소 또는 report ID) → `actions.ts:182 ticketRegenerate`(공개된 이용권 Book만, 감사 로그 `admin_regenerate`) |
| 만드는 중 실패한 이용권 | 기존 자동 되돌림(이용권 복구) | 그대로 |

- 화면 동작 시험은 하지 않았다(관리자 세션 필요) → 이용권 재생성 버튼의 실제 클릭은 UNVERIFIED. 형식 검사는 tsc·eslint 통과.

### 9-5 선물 기능 — PASS(동작 변경 없음)

### 9-6 열람 기간 — PASS(로컬 DB·PGlite)

**구현: `expires_at='infinity'`(기한 없음)를 버전 필드로 정한다.** 덕짱님 추가 지시(운영 read_report·expire·admin_retry, null 처리)에 따라 세 방법을 따졌다.

| 방법 | 운영 읽기 경로 영향 | 판단 |
|---|---|---|
| `expires_at` null 허용 | 제약(발행이면 not null) 변경 + `read_report`(`expires_at>now()`면 보여 줌 → null이면 안 보임), `claim_report_account`(`expires_at is null`이면 거절), `list_account_reports`(`expires_at is not null`만), `admin_retry`(null = 미발행으로 봄), 이용권 `read`·`library`, `referral_publication`, `ops_generation` 레인 등 **함수 10여 개 본문을 운영에서 고쳐야 함**. 운영은 scripts로 손으로 패치된 본문이라 고칠 자리가 어긋날 위험이 크다 | 버림 |
| 먼 미래 날짜(예 9999-12-31) | 모든 `>now()`/`<=now()` 비교가 그대로 맞고 TS 날짜 파싱도 안전 | 가능하나 고객 화면에 "9999년까지"가 보이지 않게 따로 가려야 하고, 가짜 날짜가 약속처럼 남는다 |
| **`'infinity'`(채택)** | 모든 비교가 그대로 맞다(`infinity>now()` 참, `<=now()` 거짓). 함수 본문을 하나도 고치지 않는다. 제약에 대안 하나(`or expires_at='infinity'`)만 더한다 | TS가 받는 값이 문자열 `"infinity"`라 날짜로 읽는 3곳만 고쳤다(아래 표). `new Date("infinity").toISOString()` 같은 코드는 저장소에 없음(grep) |

- 어느 Book이 기한 없음이 되는지: 트리거 `report_access_by_version` — **처음 발행**(published_at이 비어 있다가 채워짐) 때 스냅샷 `productVersion='v5'`면 `infinity`. 기한 없음은 처음부터 v5로 발행된 Book만 가질 수 있다(다른 경로로 `infinity`를 넣으면 `REPORT_ACCESS_VERSION_REQUIRED`로 거절). 날짜 경계는 쓰지 않는다.
- 결제 Book 입력(출생 정보)도 같은 기한: `report_access_sync_input`(Book이 기한 없음이 되면 입력도) + `report_input_access_by_version`(발행 함수가 입력 기한을 나중에 다시 써도 기한 없음 유지).
- 기존 Book: 열려 있는 v5 Book만 `infinity`로 바꾼다(보관본 중 v5 이전 판이 있는 Book은 제외). **운영 41권(v1·1.0·v2 8권, v4 33권)은 대상 0권** — 운영 만료(12/23~1/29) 그대로 90일이다. 로컬 DB에서는 v5 164권·입력 26행이 바뀌었고 v5 이전 4권은 그대로.
- 자동 삭제: `paid_report_reliability('expire')`(snapshot 비움·입력 삭제), `ops_generation('purge')`(보관본·장 원고 삭제)는 `expires_at<=now()`로 도는데 v5 Book은 `infinity`라 대상이 될 수 없다. 탈퇴(`ops_account('withdraw')`)는 버전과 상관없이 바로 닫는다.

**열람 경로 표(모두 `infinity`에서 무기한 동작)**

| 경로 | SQL 함수(조건) | TS(파일:줄) | 확인 |
|---|---|---|---|
| 결제 Book 읽기 | `paid_report_reliability('read_report')` — `expires_at<=now()`면 EXPIRED, `>now()`일 때 snapshot | `/reports/[id]` 읽기(만료 판단은 SQL), 만료 안내 `src/components/report/ReportStatusView.tsx:53`(문구를 버전 중립으로) | PGlite: v5 발행 → `expire` 뒤에도 COMPLETED·입력 유지 |
| 만료 작업 | `paid_report_reliability('expire')` — `expires_at<=now()` | `/api/internal/report-jobs` | 위와 같음 |
| 재시도 | `admin_retry` — `(expires_at is null or >now())`(공개 전 실패만), `finish_job` 재발행 `coalesce(r.expires_at, …)` → 기한 유지 | `src/lib/ops/admin/actions.ts:141` | 비교식 확인 |
| 교체 레인·재생성 | `ops_generation('lane_claim'/'lane_replace')` — `expires_at>now()` | `actions.ts:141`, `actions.ts:182` | opsSql 시험 통과(교체 뒤 기한 불변) |
| 원고 정리 | `ops_generation('purge')` — `expires_at<=now()` | `/api/internal/ops-jobs` | 비교식 확인 |
| 이용권 Book 읽기·서재 | `report_tickets('read'/'library')` — `expires_at>stamp` | `src/lib/library/model.ts:15-25`(`"infinity"` = 열림), `src/components/account/Library.tsx:11`("탈퇴 전까지 계속 열람") | final3 시험 `libraryItem(... "infinity")` available |
| 결제 Book 서재 | `list_account_reports` — `expires_at is not null`, `<=now()`면 expired | 같은 model.ts | 비교식 확인 |
| 비회원 구매 연결 | `claim_report_account` — `expires_at is null or <=now()`면 거절 | `src/lib/library/supabase.ts:19` | 비교식 확인 |
| 공유 링크 | `read_report` 재사용 | `src/lib/sharing/reportShareStore.ts:66`(`reportAccessOpen`) | 코드 수정 |
| 친구 초대 자격 | `referral_publication` — `expires_at>clock_timestamp()`(`book_referrals('qualify')` 안에서만 부름) | TS 직접 호출 없음 | 비교식 확인 |
| 탈퇴 안내 수 | `ops_account('withdraw_preview')` — `expires_at>now()` | `AccountOps.tsx WithdrawPanel` | 비교식 확인 |
| 관리자 상세 | `ops_admin('detail')` `expiresAt` 그대로 | `src/app/admin/orders/[code]/page.tsx:61`("기한 없음(v5…)") | 코드 수정 |
| 첫 발행 계정 연결 | `link_published_report_account` 트리거 — `expires_at<=now()`면 건너뜀 | — | 비교식 확인 |

(로컬 DB에서 `expires_at`을 쓰는 public 함수 23개를 모두 훑었다: `pg_get_functiondef … ~ 'expires_at'`. 나머지는 이용권·쿠폰·캠페인·선물 자체 기한이라 Book 열람과 무관.)

- 주의: 코드와 migration은 **같은 배포**여야 한다. migration만 먼저면 옛 서재 코드가 `"infinity"` Book을 목록에서 빼고(날짜로 못 읽음), 옛 공유 코드가 공유를 막는다.
- 로컬 검수용 메모리 경로 `src/lib/book/localReview.ts:63`은 자체 90일을 계산한다(개발 전용, 고치지 않음).

### 9-7 화면 「90일」 문구 — PASS(살아 있는 화면) / PARTIAL(옛 화면)
- 결제 직전(`BookCheckout.tsx:197`): v5 상품(`WRITER_V5_PRODUCTS`)이면 "탈퇴 전까지 계속 열람", 아니면 "생성일로부터 90일". 서버(`BookRoutes.tsx`)가 상품 목록을 넘긴다.
- 서재: 기한 없음이면 "탈퇴 전까지 계속 열람". 만료 안내·이용권 상점(꺼져 있음)·묶음 환불 문구를 버전 중립으로.
- 옛 `/products`·`/products/saju-mbti-full`(v4 소개, "6개 리포트 모두 … 90일")은 책 화면이 켜져 있으면 책 첫 화면을 보여 준다(`src/app/products/layout.tsx`, 홈·입력 화면과 같은 방식). 원문은 소스에 남는다(옛 소스 시험이 원문을 고정).
- 손대지 않은 곳(보이지 않음): 옛 홈 `src/app/page.tsx`·옛 입력 `src/app/report/new/page.tsx`(책 화면이 켜지면 안 보임), `DevTossCheckoutLauncher.tsx`(옛 입력 안), `src/app/dev/book-preview/BookPages.tsx`(개발 전용), `ProductFlowSteps.tsx`(쓰는 곳 없음).

### 9-8 혜택 알림 받기 — PASS, migration 없음
- 가입 정보 화면: 기존 체크박스 문구를 "[선택] 혜택 알림 받기 — 새 책·이벤트·할인 소식을 이메일·문자·카카오톡으로 보내 드려요. 언제든 끌 수 있어요."로, 동의 문서 버전 `MARKETING_CONSENT_VERSION` 2026-11-04.1 → **2026-11-05.1**(문구가 바뀌었으므로).
- 마이페이지: 내 서재 → 계정 정보에 `MarketingPanel`(체크박스 + "YYYY. M. D. 오후 h:mm에 동의했어요/동의를 거두었어요" + 서비스 공지는 설정과 무관 안내). 서버는 `POST /auth/profile {op:"marketing"}`(`profile.ts:76`) — 저장된 가입 정보 그대로 `ops_account('save')`에 동의만 바꿔 넘긴다.
- 동의 일시: 기존 `account_consent_events`(consent_type='marketing', document_version, is_agreed, **recorded_at**)에 동의·철회마다 1행. 현재 상태는 `account_contacts.marketing_opt_in`. 화면 일시는 마지막 기록과 현재 상태가 같을 때만 보인다(`marketingState`, `profile.ts:17`).
- 근거: `tests/unit/ops/accountOps.test.ts` 17/17(새 시험: 켜기 → save 인자·응답 일시, 잘못된 값 400, GET 상태).

## 3. 코드 추출 표(외부 서비스·수집 필드·보관 동작)

### 3-1. 외부 서비스(운영 경로)

| 서비스 | 보내는 것 | 코드 | 켜짐 조건 |
|---|---|---|---|
| Supabase(DB·Auth) | 아래 3-2 전부 | `src/lib/db/supabaseServer.ts:5-20`, `src/lib/ops/store.ts:12-14`, `src/lib/account/supabase.ts` | 항상(서버 전용 클라이언트) |
| Anthropic(`claude-sonnet-5-5`) | 시스템 지침 + 브리프(이름·호칭, 성별, 나이, MBTI, 관계·현재 하는 일, 사주 계산, 궁합 상대 같은 항목, 이전 책 이미지 줄 `avoidImages`) | `src/lib/llm/providers.ts:47-59`, `writer/prompt/index.ts`, `brief/buildBrief.ts:391-392` | `WRITER_V5_PRODUCTS`에 든 상품, `ANTHROPIC_API_KEY` |
| OpenAI | Anthropic과 같은 지침·브리프 | `providers.ts:89-102`, `ops/generation/supervisor.ts`·`policy.ts`(임시본) | §9 참고 — 문서에는 넣지 않음 |
| 토스페이먼츠 | 주문번호·상품명(주문코드)·금액·구매자 이름·이메일·휴대폰(선택), 승인·조회·취소 | `payment/tossConfirmClient.ts`, `tossRefundClient.ts`, `BookCheckout.tsx` | `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`·`TOSS_PAYMENTS_SECRET_KEY` |
| 카카오 로그인 | scope `account_email`·`profile_nickname`·`plusfriends`, `/v2/user/me` 이메일 확인 | `account/kakaoLogin.ts:2-37` | 항상 |
| 카카오 채널·연결 끊기·공유 | 채널 추가 상태 조회, 탈퇴 시 `unlink`(회원 식별자), 공유 시 제목·주소 | `kakaoLogin.ts:41-50`, `profile.ts`, `BookShareActions.tsx` | 각 키 설정 시, 공유는 누를 때만 |
| Google 로그인 | Supabase OAuth(이메일·이름·확인 여부) | `account/supabase.ts:29-31` | 항상 |
| Meta 픽셀·전환 API | 동의한 경우만(기존 문서 그대로) | `analytics/metaDelivery.ts`, `MetaPixel.tsx` | `META_MEASUREMENT_APPROVED` 등 + 3개 동의 |
| Vercel | 호스팅·크론, 요청 전체 통과(런타임 로그) | `vercel.json` | 항상 |
| 없음 | Sentry·GA·메일/문자/알림톡 발송기 | `package.json`·grep | — |

### 3-2. 수집·저장 필드(요약)

| 구분 | 필드 | 저장 위치 |
|---|---|---|
| 로그인 | 공급자 식별자·이메일·이름/닉네임·이메일 확인 여부·최근 로그인 | `auth.users`/`identities`, `account_profiles`, `account_provider_facts`(`p6d_ops.sql:30-43`) |
| 가입 정보 | 이름(필수)·이메일(필수)·휴대폰(선택)·혜택 알림(선택) | `account_contacts`(`p6d_ops.sql:15-26`) |
| 동의 | 약관·개인정보·혜택 알림 동의 문서 버전·일시 | `account_consent_events` |
| 리포트 입력 | 이름, 생년월일, 출생시간(정확/대략/모름), 성별, MBTI, 연애 상태, 직업 상태·현재 하는 일, 관심 분야, 궁합 관계·상대 같은 항목 | `report_input_snapshots`, `report_ticket_redemptions.input_json`, `paid_report_snapshots.snapshot_json`(`evidencePacket.input`) |
| 이용권·선물 | 지급·사용·만료 원장, 선물 보낸·받은 계정, 링크 해시 | `report_ticket_grants/ledger/redemptions`, `gift_rewards`, `comp_grants` |
| 결제 | 주문코드·금액·상태·결제 키·영수증 주소·구매자 이름·이메일·휴대폰, 결제 전 동의 기록 | `payment_orders`, `order_records`, `order_refunds` |
| 문의 | 요청 종류·직접 쓴 글(최대 1000자)·처리 메모 | `order_requests` |
| 이전 책 참조 | 같은 계정·같은 사람(이름|생년월일|시간) 이전 책 최대 8권의 문장·장면·이미지 줄 | 읽기만(`ops/generation/paidPrior.ts`, `writer/prior.ts:40-79`) |
| 쿠키·저장소 | 로그인 세션, `gyeol-auth-flow`·`gyeol-account-return`(10분), `__Host-gyeol-claim-*`(7일), 초대·캠페인(10분), Meta 동의(1년), sessionStorage 입력 초안 등 | 방침 10절 표 |

### 3-3. 보관·삭제 동작

| 동작 | 기준 | 코드 |
|---|---|---|
| v5 이전 Book 만료(원고 비움·입력 삭제) | `expires_at<=now()`(처음 발행+2160h) | `paid_report_reliability('expire')`, cron `/api/internal/report-jobs` |
| v5 Book | 기한 없음(`infinity`, 버전 필드) — 탈퇴·삭제 요청·서비스 종료 때만 | 최종3 migration 트리거 |
| 보관본·장 원고 정리 | `expires_at<=now()` 또는 EXPIRED | `ops_generation('purge')`, cron `/api/internal/ops-jobs` |
| 탈퇴 | 계정·연락처·입력 즉시 삭제, Book EXPIRED, 결제 기록 `retained_order_records`(5년) 분리 | `ops_account('withdraw')`, `account/profile.ts` |
| Meta | IP·브라우저 7일, 기록 180일 | `meta…sql` cleanup |
| 이용권·선물 | 기한 지나면 사용 불가(행은 남음) | `report_tickets` reconcile, `ops_gift` |

## 4. 국외 이전 업체별 표(방침 7절과 같은 값)

| 이전받는 자 · 국가 · 연락처 | 항목 | 시기·방법 | 목적 | 보유 기간 | 거부 방법·효과 |
|---|---|---|---|---|---|
| Anthropic, PBC · 미국(추론은 다른 지역 서버 가능) · 548 Market St, PMB 90375, San Francisco, CA 94104 · privacy@anthropic.com | 리포트 입력정보·궁합 상대 같은 항목·계산 근거·이전 책 겹침 방지 표현 | 리포트 만들 때 HTTPS | 리포트 문장 작성(학습 안 함) | 받은 날부터 30일 이내 삭제(정책 위반 판정 최대 2년) | 리포트를 만들지 않으면 됨(거부 시 리포트 불가) |
| Supabase Pte. Ltd. · 싱가포르(운영사), 저장 위치 서울(AWS ap-northeast-2) · 65 Chulia Street #38-02/03, OCBC Centre, Singapore 049513 · privacy@supabase.com | 회원·주문·결제·리포트·이용권·문의 | 이용할 때마다 HTTPS | 데이터 저장·로그인 | 방침 3절 기간(계약 종료 뒤 30일 안 삭제) | 거부 시 서비스 이용 불가 |
| Vercel Inc. · 미국(함수 iad1 워싱턴 D.C.) · 440 N Barranca Avenue #4133, Covina, CA 91723 · privacy@vercel.com | 요청에 담긴 정보·IP·브라우저·요청 주소 | 요청마다 HTTPS | 호스팅·서버 실행 | 처리 중에만, 실행 기록은 요금제별 최대 30일 | 거부 시 서비스 이용 불가 |

출처(2026-11-05 조회)
- Anthropic: https://www.anthropic.com/legal/privacy (법인·주소·privacy@·국내대리인), https://www.anthropic.com/legal/commercial-terms (학습 금지 §B), https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data (API 입력·출력 30일, 정책 위반 2년), https://platform.claude.com/docs/en/manage-claude/api-and-data-retention , https://platform.claude.com/docs/en/manage-claude/data-residency (추론 위치 기본 global), https://www.anthropic.com/legal/data-processing-addendum (계약 종료 30일 안 삭제)
- Supabase: https://supabase.com/terms (Supabase Pte. Ltd., 싱가포르 주소), https://supabase.com/legal/dpa (지역 저장 6.1, 계약 종료 30일), https://supabase.com/privacy (privacy@supabase.com), https://supabase.com/docs/guides/platform/regions , https://supabase.com/docs/guides/platform/backups , https://supabase.com/pricing (백업·로그 보관)
- Vercel: https://vercel.com/legal/privacy-policy (법인·주소·privacy@), https://vercel.com/legal/dpa (미국 주 처리, 해지 뒤 삭제), https://vercel.com/docs/functions/configuring-functions/region (iad1), https://vercel.com/docs/logs/runtime (로그 보관 Hobby 1시간·Pro 1일·Observability Plus 30일)
- 리전 근거(저장소): `docs/v4-release-final-qa.md:103`(Supabase ap-northeast-2), `:133`(Vercel iad1). Supabase MCP는 쓰지 않았다.
- 구제 기관: 개인정보분쟁조정위원회 1833-6972(kopico.go.kr 푸터 확인), 개인정보침해신고센터 118(검색 결과로만 확인 — PARTIAL), 경찰청 182(ecrm.police.go.kr 확인).

## 5. 문서 3종 변경 요약

개인정보처리방침(`privacyPolicy.ts`, 두 화면이 같은 `privacyPolicySections`를 그림)
- 16절: 처리 목적 / 항목(수집 경로별 표) / 보유 기간(법정 5·5·3년·3개월, 회원 탈퇴 시까지, 리포트 v5 이전 90일·v5 탈퇴·삭제 요청·서비스 종료 시까지) / 파기 / 제3자 제공 / 처리 위탁(토스·Supabase·Anthropic·Vercel) / 국외 이전(업체별 6칸) / 권리·행사 방법·10일 / 14세 미만·미성년 / 쿠키 표·거부 방법 / 안전성 확보 조치 / 보호책임자(장덕민 대표, support@gyeolreport.com, 050-6664-8562) / 광고 성과 측정(Meta 문구 그대로) / 구제 기관 / 자동화된 결정 / 변경·시행일·이력.
- 항목 추가: 이메일(필수), 로그인 식별자, 현재 하는 일·연애 상태·관심 분야, 궁합 상대·선물, 이용권 기록, 혜택 알림 동의 여부·일시. 목적 추가: 이용권 관리, 서비스 공지·긴급 안내, 같은 사람 이전 리포트 참조, 혜택 알림(동의자만).
- OpenAI → Anthropic. 「현재 버전에서」 삭제. 초안(`privacyPolicyDraft.ts`)은 합치고 삭제, `/privacy/draft`는 `/privacy`로 308.
- 6칸 표는 휴대폰 폭에서 업체별 항목 목록(dl)으로 그린다(390px 캡처: 가로 넘침 0px).

이용약관(`termsPolicy.ts`)
- 가격 숫자 삭제 → "결제 금액: 상품 페이지와 결제 화면에 표시된 금액". 판매 상품 4종(대운·세운 일시 중지, 이미 받은 책 열람 가능).
- 서비스의 성격에 AI 작성 고지, 명리·MBTI 참고 정보·미래 단정 안 함.
- 「이용권」 신설: 종류(이벤트·보상·고객 응대 무상 지급, 상품 범위), 발급일로부터 30일(기존 발급분은 발급 당시 기간), 선물 1회·만료일 승계·재선물 불가, 이용권 리포트 환불 없음·오류 시 재생성, 현금 교환·환불 불가·탈퇴 시 소멸, 부정 취득 회수·결제 환불 시 미사용분 회수.
- 상대 정보는 동의 받고 입력(입력정보·금지행위). 열람 기간 버전별 + v5 정의 + 서재에서 기한 확인. 서비스 종료 30일 전 공지와 열람 종료일 안내. 14세 문구의 「현재」 삭제. 시행일 = `POLICY_EFFECTIVE_DATE_KO` + 변경 이력.

환불정책(`refundPolicy.ts`)
- 생성 시작 후·결과 제공 후: "단순 변심에 의한 청약철회(환불)는 할 수 없습니다"(예전 "제한될 수 있습니다"). 새 행 「이용권으로 만든 리포트」(환불 대상 아님, 오류 시 재생성, 현금 교환·환불 불가). 필수 안내 6번째 줄, 문의 안내에 리포트 주소.
- 결제 직전 화면: 동의 항목(`refundRestriction`)은 원래 있었고, 영수증 아래에 굵게 "책 만들기가 시작되면 단순 변심으로는 환불되지 않아요."(이용권 선택 시 이용권 문구) + v5 상품이면 AI 고지 한 줄을 더했다.

문서 버전·동의 기록
- `CHECKOUT_POLICY_VERSIONS` terms·privacy·refund → `2026-11-05.1`. 결과: ① 회원은 다음 로그인 때 약관·개인정보 재동의 화면(`needsRequiredReconsent`)을 본다(초안 파일에 적혀 있던 계획대로), ② 새 결제·이용권 동의 기록(`consentEvidence.policyVersions`)에 새 버전이 남고 옛 주문 기록은 그대로, ③ 옛 브라우저(옛 버전을 보낸 결제 요청)는 서버가 버전 불일치로 거절한다(기존 동작).
- Meta 동의 문구·버전(`meta-20261020-v2`)은 바꾸지 않았다(방침 13절이 같은 상수를 그대로 싣는다).
- 시행일: `src/lib/legal/policyVersions.ts` `POLICY_EFFECTIVE_DATE = null`(→ "배포일(확정 전)"). 배포 커밋에서 `"YYYY-MM-DD"`로 채운다.

## 6. 법률 검토가 필요한 문장

1. 「v5 리포트」라는 말 자체(고객이 v5를 모름) — 약관·방침에 정의 문장을 넣었으나 "새 버전 출시일 이후 발행"처럼 날짜로 풀지 여부.
2. 토스페이먼츠를 제3자 제공이 아닌 **처리 위탁**으로 분류(초안은 제3자 제공 표에 있었음).
3. Supabase를 국외 이전 표에 넣은 것(저장 위치는 서울, 운영사는 싱가포르) — 위탁만 적을지.
4. Anthropic 국가 "미국(추론은 다른 지역 서버 가능)" — 코드가 `inference_geo`를 지정하지 않음. 미국으로 고정하려면 요청에 `inference_geo:"us"`(요금 1.1배).
5. 보유 기간 「이용권·선물 기록: 탈퇴 뒤 5년」, 「혜택 알림 동의·철회 기록: 3년」 — 법정 기간이 아니라 회사가 정한 기간.
6. 「로그인 기록 3개월(통신비밀보호법)」 — 앱은 최근 로그인 1건만 덮어쓰고, Supabase 인증 기록 보관은 코드 밖(§10).
7. 환불: "생성이 시작되면 … 단순 변심에 의한 청약철회(환불)는 할 수 없습니다"(전자상거래법 제17조 제2항 제5호·제6항 표시 요건 충족 여부), 「이용권으로 만든 리포트는 환불 대상이 아닙니다」(무상 지급 이용권 + 결제 환불 시 회수 규정과의 관계).
8. 약관 「부정한 방법으로 받은 이용권은 회수하고, 그 이용권으로 만든 리포트의 열람을 막을 수 있습니다」.
9. 약관 「서비스 종료 30일 전 … 회원 이메일로」 — 메일 발송 수단이 코드에 없음(운영 약속).
10. 방침 「변경 시행 7일 전(불리한 변경 30일 전) 공지」.
11. 방침 「요청 받은 날부터 10일 안에 처리」(열람 10일은 시행령, 정정·삭제·처리정지 기한 표현).
12. 방침 「자동화된 결정」 절 — 리포트 작성이 제37조의2 대상이 아니라는 판단.
13. 구제 기관에서 「대검찰청 사이버수사과(1301)」를 뺐다 — 조사 결과 2026-10-02 검찰청 폐지·공소청 전환으로 연락처 확인 불가(UNVERIFIED). 새 기관을 넣을지.
14. 혜택 알림 동의 문구의 채널(이메일·문자·카카오톡) — 실제 발송기는 코드에 없음. 정보통신망법상 2년마다 수신 동의 확인 의무(운영).
15. Vercel 보유 기간 「요청을 처리하는 동안만 쓰며 … 최대 30일」 — 실제 요금제(Pro/Observability Plus) 확인 필요.
16. Supabase 연락처: 개인정보처리방침은 privacy@supabase.com, DPA는 privacy@supabase.io — 방침 쪽(.com)을 적었다.

## 7. OpenAI 잔존 경로와 이유

| 위치 | 상태 | 이유 |
|---|---|---|
| `src/lib/llm/providers.ts:89-102`(`/v1/responses`, `store:false`, `apiKeyEnv: OPENAI_API_KEY`) | **살아 있는 대체 경로** | Sonnet이 2시간 넘게 실패하면 임시본을 OpenAI로 만들고 나중에 Sonnet 정식본으로 교체(`ops/generation/policy.ts`·`supervisor.ts`). 조건: 상품이 `WRITER_V5_PRODUCTS`에 있음 + `OPENAI_API_KEY` 있음 + `llm_provider_switch.openai.disabled_at`가 비어 있음(p6d migration이 켜진 상태로 넣음) |
| `src/lib/llm/streamCompletion.ts` 기본 대체 `openai` | 운영 경로에서는 안 씀(`supervisor`가 `fallback:null`) | 도구 직접 호출용 |
| 관리자 「OpenAI 다시 켜기」 버튼(`app/admin/orders`, `ops/admin/actions.ts`) | 살아 있음 | 위 스위치 |
| `writer/runner.ts`·`ticketJob.ts`·`prices.ts`·`types.ts` | 상수·시험 주입·가격표 | — |
| 원고 검사기의 "OpenAI"·키 이름 차단 목록(여러 validator) | API 호출 아님 | 원고 유출 방지 |
| `report-generation/writerDisabled.ts`·`generateProductReport.ts` 주석 | 죽은 코드 설명 | v4 OpenAI 작가는 v5에서 제거됨 |

운영 Vercel Production env(덕짱님 확인): `OPENAI_API_KEY`·`OPENAI_REPORT_WRITER_ENABLED`·`OPENAI_REPORT_MODEL`이 남아 있다.
- v5 코드는 `OPENAI_REPORT_WRITER_ENABLED`·`OPENAI_REPORT_MODEL`을 **읽지 않는다**(grep 0, master의 `reportWriterRuntime.ts`만 읽음 — 지금 운영(v4)에서는 쓰일 수 있음).
- `OPENAI_API_KEY`는 v5에서 위 임시본 경로를 켠다. 새 방침은 OpenAI를 적지 않았으므로 **배포 때 둘 중 하나를 골라야 한다(덕짱님 결정)**: (가) v5 배포 때 Production에서 `OPENAI_API_KEY`(와 쓰지 않는 두 변수)를 지우고 관리자 화면 OpenAI 스위치를 꺼 둔다 → 장애 2시간 넘으면 임시본 없이 보류만 된다, (나) 임시본을 유지하려면 방침 6·7절에 OpenAI(OpenAI, L.L.C., 미국, `store:false`)를 다시 넣고 버전을 올린다.
- `REPORT_PRICE_KRW` env 없음: 코드는 env가 아니라 상수(`reportProductCatalog.ts:11` 1490)를 쓰므로 영향 없음. 약관은 이제 가격 숫자를 적지 않는다.

## 8. migration

파일: `supabase/migrations/20261105120000_v5_final3_tickets_reading.sql`(이번 작업 전체 1개). 한 트랜잭션, `lock_timeout 5s`, 전제(`ops_comp`·`ops_gift`·`report_tickets`·제약) 없거나 고칠 자리가 정확히 1곳이 아니면 아무것도 바꾸지 않고 멈춘다.

1. `ops_gift` 두 곳·`ops_comp` 한 곳 패치(이용권 30일 상한).
2. `report_tickets` → `report_tickets_before_final3`로 이름 바꾸고 새 `report_tickets`로 감쌈(기한 없는 지급 30일, summary `lots`). 권한 다시 부여(service_role만).
3. 제약 `paid_report_snapshots_access_expiry_check`를 같은 이름으로 다시 만듦(2160h **또는** `infinity`).
4. 열린 v5 Book과 그 입력의 기한을 `infinity`로(운영 대상 0권 예상 — 적용 전 수를 센다).
5. 트리거 3개(`report_access_by_version`, `report_access_sync_input`, `report_input_access_by_version`, security definer·`search_path=''`, 일반 역할 실행 권한 회수).
6. `notify pgrst, 'reload schema'`.
- 되돌리기: 파일 끝 주석.
- 로컬 적용: `docker exec -i supabase_db_gyeol-report psql -U postgres -d postgres -v ON_ERROR_STOP=1 < …` → COMMIT, v5 164권·입력 26행 `infinity`, v5 이전 COMPLETED 4권 그대로. `report_tickets('summary')` 호출 정상(`lots` 포함).

### 배포 체크리스트 순서(`docs/v5/deploy-checklist.md` 1-1 표 6번에 넣어 둠)
1. (코드) `src/lib/legal/policyVersions.ts` `POLICY_EFFECTIVE_DATE`를 배포일로 채운 커밋.
2. (env) 새 env 없음. 지울 env: `GIFT_EVENT_VALID_DAYS`·`COMP_A_VALID_DAYS`·`COMP_B_VALID_DAYS`(이제 무시), OpenAI 세 변수는 §7 결정에 따라.
3. (migration) 1~5번 기존 순서 → **6번 최종3** → (리드의 `20261105160000_v5_final3_writer_raw.sql`은 리드 순서대로). 6번 적용 전 읽기 전용 점검: `select count(*) from paid_report_snapshots where status='COMPLETED' and snapshot_json->>'productVersion'='v5';`(운영 0 예상), `select count(*) from paid_report_snapshots where published_at is not null and expires_at<>published_at+interval '2160 hours';`(0이어야 함).
4. (배포) 코드와 6번 migration을 같은 배포 창에서. 순서가 벌어지면 9-6의 "주의" 참고.
5. (켜기) 이벤트·보상은 기존처럼 `GIFT_EVENT_ENABLED`·`COMP_ENABLED`로. 켠 뒤 서재에서 이용권 기한 줄, 선물 받기 화면 기한을 확인.
6. (확인) `/privacy`·`/terms`·`/refund` 시행일 표시, 회원 재동의 화면, `/privacy/draft` → `/privacy`.

## 9. 실행한 명령과 결과

| 명령 | 결과 |
|---|---|
| `pnpm exec tsc --noEmit` | 이 작업 파일 오류 0. 마지막 실행에서 `src/lib/ops/generation/paidJob.ts` 3건(리드 진행 중 변경 `opsRawCache`·`raw`) — 그 전 실행(리드 변경 전)은 0건 |
| `pnpm exec eslint <바꾼 파일 52개>` | 0건 |
| `pnpm exec vitest run tests/unit/ops/final3TicketsReading.test.ts …(27파일: ops 7·legal 7·legal 화면·소스 4·결제 2·책 흐름·만료 안내·이용권 상점·p6bUi·p6cUi2·writer·ticketQueue·generationProgress)` | 327 통과 / 1 실패: `ticketQueue.test.ts` '출력 전 429 → 재시도' — **최종3 migration을 빼고 돌려도 같은 실패**(리드 진행 중 `ticketJob.ts`·원문 저장 변경 쪽, 기존 실패 아님·이 작업 무관) |
| 같은 묶음의 기준선 대조(`v5-final2-base` 270a3676, 관련 경로 변경 없음) | `checkoutConsentEvidence.test.ts` 31건 실패는 기준선도 31건(JSON 끝 오류) — 기존. `legalPagesSource`·`policyPagesSource`의 약관 검사 2건은 기준선에서 실패(1,290원·6상품) → 이번에 새 문서 기준으로 고쳐 통과 |
| UI 묶음 17파일 | 기준선과 같은 기존 실패만: isolation 2, launchFlagUiBoundarySource 1, layoutMetadataSource 1, bookPreview 3, bookSharing 1, manualReview 3(단독 실행 3건 = 기준선 3건, 묶음 실행 때 추가 실패는 부하 시간 초과) |
| `tests/unit/ops/accountOps.test.ts` | 17/17(혜택 알림 새 시험 포함) |
| `tests/unit/app/bookPublicFlow.test.tsx` | 32/32(결제 직전 v5/v4 문구·AI 고지·환불 불가 새 시험) |
| dev 서버(3800, 다른 작업이 띄운 것) GET `/privacy`·`/terms`·`/refund`·`/privacy/draft` | 200·200·200·308(→/privacy). Playwright 390px `/privacy`: 가로 넘침 0px, 국외 이전 업체별 목록 확인 |
| 로컬 DB migration 적용·함수 호출 | §8 |

## 10. 따로 확인이 필요한 발견(이번 범위 밖, 고치지 않음)

- **파기 작업이 없는 보관**: `retained_order_records.retain_until`(5년) 지난 행, `order_requests`(문의 원문, 탈퇴 뒤에도 남음), `account_consent_events`, 이용권 원장(트리거로 지우기 불가), `report_writer_chapters`(되돌린 이용권 작업의 장 원고가 남음)를 지우는 작업이 코드에 없다. 방침의 기간(5년·3년 등)대로 지우려면 정리 작업이 필요하다.
- **리드의 `ops_writer_raw`(새 migration)**: 작가·수리 원문을 report_id로 저장 — 개인정보를 담은 원고다. 만료·탈퇴 때 지우는지 확인 필요(방침 파기 절과 맞춰야 함).
- **`src/lib/brief/data/image-ledger.json`**(리드 영역, git 추적·번들 포함): `이름|YYYY-MM-DD|HH:MM` 사람 키 12개. 실제 고객 정보면 번들·저장소 노출이다.
- 「로그인 기록 3개월」: 앱은 최근 로그인 1건만 덮어쓰고, Supabase 인증 기록(`auth.audit_log_entries`) 보관은 설정 밖.
- 혜택 알림 채널(이메일·문자·카카오톡) 발송기가 없다. 2년마다 수신 동의 재확인도 없음.
- 토스 결제 `customerKey`가 모든 구매자에 같은 상수(`gyeol_local_test_customer`).
- 리포트 삭제 요청(탈퇴 없이·비회원)을 처리하는 관리자 기능이 없다 — 지금은 방침대로 창구 접수 후 수동 처리.
