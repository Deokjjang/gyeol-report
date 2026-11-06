# P6d-ops 보고 — 판매·환불·공지 운영 기반과 생성 신뢰성

2026-11-04 · 브랜치 `v5/p6d-ops` → `v5/main`(origin/v5/main d9985cda 위로 rebase) · 진행·결정 기록 `docs/v5/p6d-ops-progress.md`

경계 준수: 운영 배포 없음, 운영 DB 변경 없음(migration은 로컬 Supabase에만), LLM·카카오 API 실호출 없음(목업), 결제는 토스 **테스트 키**로만. 브리프·작가 지침·lint·지식 DB는 건드리지 않았고, 책 생성 진입 함수 `buildV5Snapshot`(src/lib/writer/publish.ts)은 호출만 한다(변경 0줄).

## 1. 한눈에

| # | 항목 | 판정 | 한 줄 |
|---|---|---|---|
| 1 | 대운·세운 판매 닫기 | PASS | 표지 어둡게 + "12월 1일 · 2027 신년판 공개", 입력 경로는 안내 화면, 결제·이용권 API 409/거절, 산 책은 열림, `FORTUNE_SALES_OPEN=1` 한 줄로 재개 |
| 2 | 로그인 직후 정보 화면 | PASS | 이름·이메일(두 번)·휴대폰(선택)·마케팅(별도). 입력 전엔 결제·이용권만 막힘. 업그레이드 자격 표시. 개인정보 초안 |
| 3 | 주문 기록 | PASS | GR-XXXX, 계정·상품·입력·Book·토스 주문번호/결제키·금액·상태·구매자. 토스 요청에 구매자·주문코드. 과거 주문 검색 |
| 4 | 구매 내역·결제 완료 화면 | PASS | 코드·상품·일시·금액·상태·영수증, "문의·환불 요청"(주문 자동 첨부), 결제 전 고지 필수 체크 |
| 5 | /admin/orders | PASS(로컬) | ADMIN_USER_IDS만, 검색·상세·지연·요청함·기존 가입자, 재생성·이용권 지급·환불(2단계+PIN+하루 상한+감사) |
| 6 | 이벤트(설정) | PASS(시험) · 친구 화면 UNVERIFIED | 결제 1건 1장, 계정당 2회, 선물 링크(받는 사람 정보 화면 필수), 첫 결제 보너스, 환불 시 안 쓴 이용권 회수 |
| 7 | 생성 신뢰성 | PASS(목업) · 실호출 UNVERIFIED | Sonnet만 정식본, 1·5·15분·1·3·6시간 재시도 24시간, 끊기면 빠진 장만, 2시간 뒤 임시본(OpenAI)·교체, 잔액 부족 자동 끄기, 결정론 원고는 고객 최종본 아님 |
| 8 | 검증 | PARTIAL | tsc·lint·build 0. 전체 시험 신규 실패 0(아래 4절). E2E 1회 완료, 단 **토스 승인·취소는 로컬 대역**(카드사 실제 인증을 자동화하지 않음) |

테스트 통과 ≠ 판매 품질 통과: 실제 Sonnet/OpenAI 원고 품질과 실제 토스 취소 응답은 이번에 확인하지 않았다(제약상 목업).

## 2. 항목별 근거

### 1) 대운·세운 판매 닫기 — PASS
- 설정: `src/lib/ops/config.ts` `FORTUNE_SALES_OPEN`(기본 닫힘), 문구 `FORTUNE_REOPEN_LINE`. 판매 진입점 전용(`productOnSale`): 결제 준비·create-ready·이용권 발행/사용 4곳만. 읽기 경로(`isPurchasable`, 리포트 페이지·서재)는 그대로라 산 책은 열린다.
- 화면: 표지 `filter: brightness(.74) saturate(.9)` + 한 줄(`book.module.css` `.bookSlot[data-closed=true]`, `.coverNotice`), 입력 경로 `/report/new?product=major-fortune` → 안내 화면(`SalesClosedNotice`). 캡처 `ui-p6d/home-annual-center.png`(기준 `ui-p6d/freeze-base/home-annual-center.png`), `ui-p6d/notice-major.png`.
- 서버: 결제 준비 409 `PRODUCT_SALES_CLOSED`(주문 쓰기 전) — `tests/unit/report-generation/customerDayunGeneration.test.ts` "sales closed by default"; 이용권 — `tests/unit/ops/accountOps.test.ts`.

### 2) 정보 화면 — PASS
- `src/components/ops/AccountOps.tsx`(ProfileForm), `src/lib/account/profile.ts`, `src/lib/account/contact.ts`. 기존 계정은 다음 로그인 때 콜백이 `/account`로 보낸다(`src/lib/account/handler.ts`).
- 막는 곳: 결제 `src/lib/ops/orders/buyer.ts`(PROFILE_REQUIRED 403), 이용권 `src/lib/tickets/publicHandler.ts`. 로그인·열람은 막지 않는다.
- 업그레이드 자격 표시(지급은 P6c): `ui-p6d/profile-saved.png` "기존 회원 업그레이드 이용권 지급 대상이에요".
- 카카오 채널 동의 연결점·개인정보 초안: 아래 7절 체크리스트.
- 캡처 `ui-p6d/profile-form.png`(Google 확인 이메일이면 잠근 채 미리 채움, 카카오면 둘 다 참일 때만).

### 3) 주문 기록 — PASS
- 표 `order_records`(GR- 코드, 헷갈리는 0·O·1·I·L 제외), 결제 준비 때 `attach`(계정·구매자·고지 버전), 새 주문은 트리거로 코드 부여, 기존 주문도 코드 백필(legacy 표시).
- 토스 요청: `customerName/customerEmail/customerMobilePhone`, `orderName` 끝에 주문코드. 샌드박스 결제창에서 확인 — `ui-p6d/toss-sandbox-card.png`("사주×MBTI 종합 리포트 GR-Y5PH", 이메일 미리 채움, "실제 결제가 안되는 테스트입니다").
- 과거 주문: `tools/p6d/seed-legacy.ts`로 `provider_order_…`(GR-EBN8)·`gyeol20260915-…`(GR-SF46, 비회원→서재 연결)을 로컬에 넣고 관리자 검색 `ui-p6d/admin-search-legacy.png`, 서재 `ui-p6d/library-history.png`에서 확인.

### 4) 구매 내역·결제 완료 — PASS
- 결제 완료 `ui-p6d/payment-complete.png`, 서재 구매 내역 `ui-p6d/library-history.png`, 요청 접수 `ui-p6d/library-request.png`(사유 + 메모, 주문 자동 첨부).
- 결제 전 고지(필수 체크): `ui-p6d/checkout.png` "[필수] 청약철회 제한 · 계산 오류는 재생성·환불", 개인정보처리방침 링크.

### 5) /admin/orders — PASS(로컬)
- 접근: `ADMIN_USER_IDS`에 없으면 404, 마지막 로그인 12시간 지나면 다시 로그인(`src/lib/ops/admin/access.ts`, `tests/unit/ops/adminAccess.test.tsx`).
- 목록·요청함·기존 가입자·과거 주문 검색·상세: `ui-p6d/admin-list.png`, `admin-requests.png`, `admin-members.png`, `admin-search-legacy.png`, `admin-detail.png`(입력값·만세력 요약·Book 링크·생성 상태·시도·비용·요청·감사 로그).
- 동작: 환불은 E2E로 실행(`admin-refunded.png`). 재생성·이용권 지급·OpenAI 다시 켜기·CSV는 단위 시험(`tests/unit/ops/adminActions.test.ts`)만.

### 6) 이벤트 — PASS(시험) · 친구 화면 UNVERIFIED
- 기본 꺼짐. 기간·상한·상품·유효일 모두 설정값(`GIFT_EVENT_*`).
- E2E(켜고 실행): 결제 → 이용권 1장 발급 `ui-p6d/library-gift.png`; 환불 → 안 쓴 이용권 회수(`revoked`, DB 확인).
- SQL 시험(`tests/unit/ops/opsSql.test.ts` "이벤트"): 계정당 2회, 본인 사용, 선물 링크, 받는 사람 정보 화면 필수, 자기 링크 거절, 친구 첫 결제 → 보낸 사람 +1, 환불 회수.
- 친구가 링크를 여는 화면(`/gift/[token]`)은 브라우저로 돌려 보지 않았다.

### 7) 생성 신뢰성 — PASS(목업) · 실호출 UNVERIFIED
- 감독 층 `src/lib/ops/generation/`(policy·supervisor·sinks·paidJob)이 결제·이용권 두 경로에 같이 붙는다. 진입 함수에는 `fallback: null`과 대상 모델만 넘기고, 결과(장 출처)를 읽어 정식본/보류/임시본을 판정한다.
- 실패 주입(`tests/unit/ops/generationSupervisor.test.ts` 11개 + `opsSql.test.ts`): 429, 5xx(529), 중간 끊김(빠진 장만 이어쓰기), 이어쓰기도 실패(결정론으로 안 채우고 보류), 401, Anthropic 24시간 장애(2시간 임시본 → 교체 레인 재시도 → 정식본 교체·임시본 보관), OpenAI 잔액 부족(자동 끄기 → 24시간 포기 → 결제는 자동 전액 환불).
- E2E: 목업 작가(`OPS_MOCK_WRITER=ok`)로 결제 → 큐 → 정식본 발행. 시도·비용·장 출처가 Book meta와 관리자 상세에 남음(`admin-detail.png` "시도 기록").
- "제본 중": 결제 완료 화면·구매 내역 상태, 서재 "제본 중인 책"(이용권), 다시 와도 이어짐.

### 8) 검증 — PARTIAL(토스 승인·취소만 대역)
E2E 1회(로컬 dev 서버 3300, 로컬 Supabase, 토스 테스트 키, 목업 작가):

| 단계 | 결과 |
|---|---|
| 정보 화면 저장 | PASS |
| 홈·안내 화면 | PASS |
| 결제창(토스 샌드박스, 테스트 키) | PASS — 카드 선택·약관까지. "다음"을 누르면 카드사 실제 인증 페이지(신한 앱 인증)로 넘어가 거기서 멈췄다 |
| 승인 | **대역** — successUrl로 이동(토스가 하는 일 그대로) → 실제 승인 라우트 → `api.tosspayments.com` 호출만 `tools/p6d/toss-mock.mjs`가 받음 |
| 생성 → 서재 → 요청 | PASS |
| 관리자 환불(PIN·확인) | PASS(취소 API는 대역) — 주문 `refunded`, 환불 `done/CANCELED`, 이벤트 이용권 `revoked`, 감사 로그 3건, Book 열람 막힘 |

토스 결제창은 토스페이 간편결제(운영 설정)면 토스 앱 로그인, 카드 일반결제면 카드사 앱 인증이 필요하다. 남의 인증을 자동화하지 않으려고 승인·취소를 대역으로 돌렸다. 실제 토스 테스트 취소 확인은 수동 항목 9.

## 3. 디자인 동결

- 요청 밖 화면 7장을 기준 트리(638254e3)와 이 브랜치에서 같은 조건으로 찍어 **바이트 동일**(cmp): 입력(종합·커리어), 개인정보처리방침, 이용약관, 로그인, 이용권 Book 표지·2쪽 — `ui-p6d/freeze-base/`, `ui-p6d/freeze-branch/`.
- 바뀐 화면은 요청 범위만: 홈 표지(대운·세운), 안내 화면, 결제 화면(구매자 칸·고지·링크), 서재(정보·구매 내역·이벤트·탈퇴), 결제 완료, 관리자. 기존 색·글꼴·표지·컴포넌트는 그대로 쓰고 새 부분은 흑백 1px 선.

## 4. 시험

- tsc 0, eslint(저장소 전체) 0 오류·0 경고, `next build` 성공.
- 전체 시험: rebase 전 기준선(638254e3) 31,223개 중 실패 831. 브랜치 비교에서 새로 깨진 것은 모두 고쳤거나 의도된 변경에 맞춰 시험을 갱신했다(판매 닫힘 → 재개 경로로 시험, 비회원 구매자 정보, 카카오 scope 3항목). 부하로 실패한 파일은 기준선·브랜치를 따로 돌려 비교(같거나 브랜치가 적음). rebase 후 최종: 31,314개 중 실패 832(기준선 831). 차이 25개는 모두 기준선 실행에서 부하로 건너뛴(hook timeout) 파일이라, 최신 기준선(d9985cda)과 따로 돌려 비교했다 — `referrals` 2개만 브랜치 쪽(판매 닫힘)이라 재개 경로로 시험을 갱신해 같아졌고(4=4), `publicationSafety`·`manualReview`(5=5)·`protected-staging/isolation`은 기준선과 같다. **신규 실패 0**(기존 실패 830여 개는 그대로, 이번 범위 밖).
- 새 시험: `tests/unit/ops/` 7개 파일 — 감독 11, SQL 8, 계정·결제 게이트 16, 관리자 접근·동작, migration 스모크, 유료 v5 열람 1.

## 5. 이번에 찾아 고친 결함

| 결함 | 출처 | 수정 |
|---|---|---|
| 유료 v5 Book이 `/reports/[id]`에서 "저장된 리포트 형식을 확인할 수 없습니다" | **기존 v5/main**(페이지가 v4만 Book 화면으로 보냄). 결제 경로 v5가 켜지면 모든 유료 Book이 안 열림 | v4·v5 모두 Book 열람 + 구매자 확인. 시험 `paidV5Read.test.tsx`(수정 전 실패 확인) |
| Google 확인 이메일을 잠근 채 보여 주고 저장은 거절 | 이번 작업 | 화면·저장 같은 기준, 출처 표기 |
| 환불해도 그 주문의 이벤트 이용권이 남음 | 이번 작업 | 안 쓴 이용권 `revoked` |
| 임시본 안내가 서버 렌더에서 suspend | 이번 작업 | 상태를 페이지가 먼저 읽고 동기 컴포넌트로 |
| 구매자 검사가 입력 오류보다 먼저 나옴 | 이번 작업 | 입력·동의 검증 뒤, 주문 쓰기 직전으로 |

## 6. 알려진 한계

1. 환불된 Book 주소를 열면 "리포트 상태를 확인하지 못했습니다"(운영에선 자동 재확인)가 나온다. 기존 읽기 함수가 환불을 '없음'으로 돌려줘서다. 서재 카드는 "환불 완료"에 열기 버튼 없음, 책장은 '열람 불가'.
2. 이미 쓴 이벤트 이용권, 환불된 첫 결제로 준 친구 보너스는 회수하지 않는다.
3. 키 표시 장(keys_filled)은 정식본으로 받는다(기록에 keysFilled 표시).
4. 관리자 메일 알림은 발송 수단이 없어 화면 상단 "최근 관리자 동작" 기록으로 대신했다. 고객 문의 답장도 지금은 덕짱님이 직접 메일로 보낸다.
5. 로컬 DB는 ⑥ 세션과 같다. migration이 이용권 큐 함수를 바꿨다: 보류·회수 때 결정론으로 완성하지 않고 큐로 되돌린다. `tools/p3-writer/failure-injection.ts`는 ops 저장소 없이 돌리면 옛 동작을 기대할 수 있다.
6. 카카오 채널 관계·연결 끊기 API, 실제 Sonnet/OpenAI 호출은 목업 시험만.

## 7. 덕짱님 수동 항목

1. **카카오 콘솔**: 동의 항목 account_email(필수)·profile_nickname·plusfriends(선택)만. 로그인은 이 셋을 `scope`로 바꿔 요청한다(GoTrue 기본값을 대체). 배포 뒤 Preview에서 카카오 로그인 1회(KOE205 같은 오류면 운영 Supabase 카카오 provider 설정 확인).
2. Vercel Secret: `KAKAO_ADMIN_KEY`(탈퇴 때 연결 끊기), `KAKAO_CHANNEL_PUBLIC_ID`(채널 관계 조회, `_xxxx` 형식).
3. Vercel Secret: `ADMIN_USER_IDS`(본인 계정 id), `ADMIN_ACTION_PIN`. 선택 `ADMIN_REFUND_DAILY_MAX_COUNT`(기본 5)·`ADMIN_REFUND_DAILY_MAX_AMOUNT`(기본 50000)·`ADMIN_SESSION_HOURS`(기본 12).
4. 이벤트 시작 때 `GIFT_EVENT_ENABLED=1`, `GIFT_EVENT_START/END`, 필요하면 `GIFT_EVENT_MAX_PER_ACCOUNT`·`GIFT_EVENT_BONUS_MAX`·`GIFT_EVENT_PRODUCTS`·`GIFT_EVENT_VALID_DAYS`.
5. 12월 1일 `FORTUNE_SALES_OPEN=1`.
6. 개인정보처리방침 문구 검토: `/privacy/draft`(검색 제외). 배포 때 `privacyPolicy.ts`로 옮기고 `CHECKOUT_POLICY_VERSIONS.privacy`를 올린다(회원 재동의).
7. 운영 migration 승인: `supabase/migrations/20261104100000_v5_p6d_ops.sql`. 기존 주문에 주문코드 백필, 기존 가입자 명단 저장(기준 2026-11-01 00:00 KST, 오픈 이벤트 종료 시각과 같은지 확인), 이용권 큐 함수 교체가 들어 있다.
8. 배포 때 `vercel.json` 크론 `/api/internal/ops-jobs`(5분) 승인.
9. 실제 토스 테스트 결제 1회(카드사 인증은 직접) → 관리자 환불로 토스 테스트 취소 API 확인.
10. 운영 데이터의 `gyeol2026…` 주문이 실제로 어떤 경로로 만들어졌는지 확인(코드에는 이 형식이 없어 로컬에서는 시드로만 검증).

## 8. 이번 세션 추가 지시 체크리스트

| 지시 | 반영 | 근거 파일 |
|---|---|---|
| **정정(카카오 설정)** account_email 미리 채움, is_email_valid·is_email_verified 둘 다 참일 때만 확정 | ✅ | `src/lib/account/kakaoLogin.ts`(kakaoFacts), `src/lib/account/profile.ts`, `src/components/ops/AccountOps.tsx`, 시험 `tests/unit/ops/accountOps.test.ts` |
| 기존 카카오 가입자: 추가 동의·직접 입력 두 경로 | ✅ | `src/lib/account/handler.ts`(emailRetry), `src/lib/account/supabase.ts`(afterLogin), `accountOps.test.ts` |
| 입력 전에는 결제·이용권만 막고 로그인·열람은 열어 둠 | ✅ | `src/lib/ops/orders/buyer.ts`, `src/lib/tickets/publicHandler.ts`, `accountOps.test.ts` |
| plusfriends 값 없으면 필드만 준비(→ '미확인') | ✅ | migration `account_provider_facts.kakao_channel`(null=미확인) |
| 개인정보 초안에 이메일 항목·목적 | ✅ | `src/lib/legal/privacyPolicyDraft.ts` |
| **카카오 채널** scope는 account_email·profile_nickname·plusfriends 셋만 | ✅ | `KAKAO_LOGIN_SCOPE`(kakaoLogin.ts), `tests/unit/account/accountSupabase.test.ts`·`accountFoundation.test.ts` |
| 콜백에서 provider_token으로 채널 관계 조회 → 계정 저장, 토큰 없음·거부는 미확인 | ✅(실호출 UNVERIFIED) | `src/lib/account/supabase.ts`, `kakaoLogin.ts`, `accountOps.test.ts` "채널 ADDED·403 미확인·토큰 없음" |
| 이벤트 보상 상태 값만, 기본 보상 없음 | ✅ | migration `channel_reward default 'none'` |
| 운영 Supabase 카카오 scope 변경 필요 시 수동 항목 | ✅ | 이 보고 7절 1 |
| **개인정보·탈퇴** 처리방침 갱신 초안(항목·목적·보관·파기·제3자 토스) | ✅(운영 반영은 배포 때) | `src/app/privacy/draft/page.tsx`, `privacyPolicyDraft.ts` |
| 탈퇴 메뉴: 계정·연락처·출생 입력 삭제, 주문·결제 분리 보관, 카카오 연결 끊기, 구매 Book 열람 불가 안내 | ✅(카카오 실호출 UNVERIFIED) | `AccountOps.tsx`(WithdrawPanel), `profile.ts`, migration `ops_account withdraw`·`retained_order_records`, `opsSql.test.ts` "탈퇴" |
| 처리방침 링크를 가입 정보·결제 화면에 | ✅ | `ui-p6d/profile-form.png`, `ui-p6d/checkout.png` |
| **기존 카카오 가입자 이메일** identity에 이메일 없으면 scope=account_email로 한 번 더 인가 | ✅ | `kakaoLogin.ts`(KAKAO_EMAIL_SCOPE), `handler.ts`, `accountOps.test.ts` |
| 받은 이메일은 우리 프로필 표에 저장(auth email 안 덮음) | ✅ | `account_provider_facts`·`account_contacts`(migration), `supabase.ts` |
| 거부·false면 다시 묻지 않음(거부 시각) → 바로 정보 화면 | ✅ | `email_declined_at`·`email_consent_asked_at`, `accountOps.test.ts` "재시도 뒤(거부)에는 다시 묻지 않고" |
| 업그레이드 이용권: 명단(오픈 이벤트 종료 시점) 중 정보 완료 계정만, 상태 값만 | ✅(지급은 P6c) | migration `upgrade_roster`·`upgrade_state`, `opsSql.test.ts` "저장: 기존 가입자 명단" |
| 관리자 기존 가입자 현황(이메일 확보·미확보, 최근 로그인, 주문 유무) | ✅ | `ui-p6d/admin-members.png`, migration `ops_admin legacy_members` |
| 과거 주문(provider_order_…, gyeol2026…) uid 연결이 관리자·서재에 보이는지 로컬 검증 | ✅ | `tools/p6d/seed-legacy.ts`, `ui-p6d/library-history.png`(GR-EBN8·GR-SF46), `ui-p6d/admin-search-legacy.png` |
| **관리자 보안** 환불·이용권 지급·내보내기는 PIN 재입력(ADMIN_ACTION_PIN) | ✅ | `src/lib/ops/admin/actions.ts`, `adminActions.test.ts`, E2E 환불 |
| 환불 하루 건수·금액 상한(기본 5건·5만 원), 초과 차단·기록 | ✅ | `actions.ts` + DB 잠금 안 재확인(`ops_order refund_request`), `adminActions.test.ts`, `opsSql.test.ts` |
| 관리자 동작마다 관리자 이메일 알림(없으면 화면 상단 기록) | ✅(화면 기록으로 대체) | `src/app/admin/orders/ui.tsx`, `ui-p6d/admin-refunded.png` "최근 관리자 동작 (2)" |
| 고객 이메일·휴대폰 가림, 클릭 때만 보기 + 열람 기록 | ✅ | `admin-detail.png`, `adminActions.test.ts` "보기는 … 감사 로그(pii_view)" |
| 관리자 세션 12시간 만료 | ✅ | `src/lib/ops/admin/access.ts`, `adminAccess.test.tsx` |
| 보고서 끝에 추가 지시 체크리스트 | ✅ | 이 표 |
