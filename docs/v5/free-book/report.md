# F — 가입하면 내 책 한 권 무료 (신규 가입 이용권 · /free · 책 끝 연결 · 퍼널 · 시험 계정 메타 차단)

브랜치 `v5/free-book-01`(기준 origin/master `95c59368` = 결제창 수정 배포본 `dpl_5SRpJYdh…`, 17:53 KST). 덕짱님 지시 F + 추가 1~4(2026-11-10). 결정 2건은 작업 중 질문으로 받음(아래 1-2).

## 1. 결론과 항목별 판정

**배포 완료.** 운영 migration 2개 적용(2026-11-10 20:03 KST) → `v5/free-book-01 → v5/main → master` → Production `dpl_3DxC9hK59ECghAV3wp8ZgL8eTkab`(READY 20:07 KST, www.gyeolreport.com). 캠페인 시작 `SIGNUP_CAMPAIGN_START = 2026-11-10 20:00 KST`(배포보다 앞 — 배포 뒤 가입자는 모두 대상), 끝 = 1+1 끝 2026-11-30 23:59:59 KST. 운영 실가입 1건 흐름(카카오·구글 실제 로그인 → 이용권 → 책)은 덕짱님 실전 확인이 남았다(8절).

| 항목 | 판정 | 근거(명령·수치) |
|---|---|---|
| 0부 현황 정리·재활용 판단 | PASS | 2절(file:line, 운영 읽기) |
| 1부 지급(가입 직후 자동·1인 1장·기존 회원 제외·선물 링크 가입 포함·같은 요청 두 번도 1장) | PASS(시험) · 운영 실가입 UNVERIFIED | `freeBookSql` 16 · `freeBookFlow` 12 통과. 운영: `ops_signup('state'/'stats')` 응답 정상, 가입 이용권 0장(배포 뒤 아직 가입 없음) |
| 탈퇴·재가입 차단(제공자 + 회원번호 해시) | PASS(시험) | `freeBookSql`·`freeBookFlow`(같은 해시 → `ALREADY_RECEIVED`, 원문 id·이메일 저장 0) |
| 선물 거절(서재 버튼·선물하기 창·장 지정 링크·표 제약) | PASS(시험) · 운영 함수 확인 | `freeBookSql`(`NO_GIFTABLE`·`GIFT_NOT_GIFTABLE`·제약 위반), `freeBookWeb`(버튼 없음). 운영 `ops_gift` 본문에 `GIFT_NOT_GIFTABLE` 있음 |
| 7일 기한·4종만 | PASS(시험) | 대운·세운 사용 거절, 7일 뒤 `expired` |
| 가입 팝업(하나만, ① 대신) | PASS(시험 + 캡처) | `freeBookWeb`(`selectPopup` signup 우선·한 번에 1개), 캡처 `signup-popup.png` |
| 멈춤 장치(DB 설정, 끄면 지급·팝업·띠·혜택 문구 없음) | PASS(시험 + 로컬 실제 끄기) | `freeBookSql`(PAUSED), 로컬 `ops_signup_switch(false)` → /free `off`·띠 0 → 다시 켬. 운영 `signup_grant` = `{"on":true}` |
| 처리 봇 가입 급증 경보·[지급 멈춤]/[다시 켜기]·`/campaign` | PASS(시험) · 텔레그램 실제 응답 UNVERIFIED | `freeBookBots` 8 통과(20건 경보, 1시간 1번, 덕짱님 id만, 메시지 바뀜, 감사 기록). 운영: 두 봇 명령 목록 새 배포로 다시 등록(20:09:14), `ops_signup('stats')` 응답 정상 |
| API 잔액 경보 | PASS(시험) | `freeBookBots`(402·credit 문구 → 1시간 1번) |
| 2부 /free(손님·회원·이용권 보유·종료) | PASS | 캡처 4장 + 운영 확인(`data-free-landing="on"`, 손님 CTA `/login?next=/free`) |
| 옛 이벤트 주소 → /free(utm 유지) | PASS | 운영 `307 → /free?utm_source=meta&utm_campaign=free_book_1111`(fbclid 버림), `campaignRedirect` 시험 |
| 로그인 화면 한 줄 · 메인 띠(손님만) | PASS | 캡처 + 운영 WebKit 확인(띠 문구·`/free` 연결, 화면 오류 0) |
| 3부 책 끝(가입 이용권 책 2줄·결제 책 1줄, 공유 버튼 그대로) | PASS | 캡처 2장(`notice signup`/`paid`, 공유 버튼 3개), 공유 회귀 `bookShareV5`+`bookShareWebkit` **38/38** |
| 4부 퍼널(익명·세션 1번·시험 제외)·`/funnel` | PASS(시험) · 운영 집계 30분 뒤 확인(5-4) | `freeBookWeb`·`freeBookBots`. 운영 `/api/funnel` 다른 출처 403, `ops_funnel('report')` 응답 정상 |
| 추가 2 `/event` 시험 계정 제외 · 추가 3 시험 계정 메타 차단(DB·브라우저) | PASS(시험) · 운영 함수 확인 | `metaTestExclude` 4 · `freeBookSql`. 운영 4개 메타 함수 본문에 `ops_test_user` 있음, 결제 승인 코드 변경 0 |
| 5부 약관·처리방침(문서 개정, 동의 버전 그대로)·법률 검토 | PASS | `tests/unit/legal` 통과, `legal-review.md` F 절 질문 7개 |
| 인앱 브라우저(인스타·카카오톡) | PARTIAL | 로컬 WebKit에 인앱 UA를 넣어 `/free` → [가입하고 무료로 받기] → `/login?next=/free`(카카오 버튼·한 줄)까지 끊김 없음. 실기기에서 카카오 로그인 → 가입 → 이용권 → 책 고르기는 UNVERIFIED |
| tsc · eslint · build | PASS | `pnpm exec tsc --noEmit` 0 · `pnpm lint` exit 0 · `pnpm build` exit 0(`ƒ /free`) |
| 전체 시험 새 실패 0(기준 master 나란히) | PASS | `pnpm test` 브랜치 850 실패/27,493 통과 · 기준 `95c59368` 852 실패/27,469 통과(동시 실행 부하로 시간 초과 다수). 브랜치에만 있던 6건을 두 트리에서 단독 재실행 → 브랜치에만 있는 실패 **0**(남은 5건은 기준에서도 똑같이 실패: 지식 원본 해시·궁합 동료 보존) |
| 새 시험 | PASS | 5개 파일 **56개** 통과(`freeBookSql` 16 · `freeBookFlow` 12 · `freeBookWeb` 16 · `freeBookBots` 8 · `metaTestExclude` 4) |
| 화면 묶음에 비밀값·계정 id | PASS | `.next/static`에서 용도 이름·`REPORT_ADMIN_SECRET`·누나 계정 id·`ops_signup`·service role 0건 |
| 운영 migration · 배포 · 원격 SHA | PASS | 5절 |
| 광고 문구용 실측(추가 4) | PASS(궁합 0권) | 7절 |

### 1-2. 작업 중 받은 결정(2026-11-10)

| 질문 | 덕짱님 답 | 반영 |
|---|---|---|
| 지시서의 「1+1 종료 지금 11-30」과 달리 운영은 코드 기본값 **11-16 23:59:59 KST**(env `GIFT_EVENT_END` 없음, `/auth/event-popup` endsAt 11-16). 어떻게? | **11-30 연장, 이용권 기한 그대로** | `GIFT_EVENT_DEFAULT_END` 한 곳을 `2026-11-30T23:59:59+09:00`으로. 1+1 이용권 기한(`EVENT_TICKET_EXPIRES_AT` 11-30 23:59:59)은 그대로 |
| 재가입 방지 해시의 열쇠 | **기존 서버 비밀값에서 파생** | `REPORT_ADMIN_SECRET`에서 용도 이름 `gyeol-signup-grant-v1`로 HMAC 열쇠를 만들고, `HMAC(열쇠, "제공자:제공자 사용자 id")`(64자 hex)만 저장. 새 env 없음. 그 비밀값을 바꾸면 예전 기록과 대조가 안 된다(남은 위험) |

## 2. 0부 현황 정리(작업 전 master `95c59368`)와 재활용한 것

### 2-1. 1+1 종료 설정과 쓰는 곳
- 기간 값: `src/lib/ops/config.ts:50-51` 기본 `2026-11-06T09:00 ~ 2026-11-16T23:59:59 KST`, env `GIFT_EVENT_START`·`GIFT_EVENT_END`가 있으면 그 값(운영에는 없음 — Vercel env 목록 확인, `GIFT_EVENT_ENABLED` 주석 「기간은 코드 기본값」). 시간 창 `giftEventWindow` `:70-75`, 발급 설정 `giftEventConfig` `:82-87`, 화면 공개값 `giftEventPublicView` `:90-93`. 이용권 기한은 별도 상수 `EVENT_TICKET_EXPIRES_AT` `:35`(11-30 23:59:59).
- 발급: 결제 완료 화면 `src/components/ops/PaymentComplete.tsx:21`(`afterPaidOrder`), 5분 크론 보조 발급 `src/app/api/internal/ops-jobs/route.ts:23-24`, SQL `ops_gift('issue'/'pending_orders')`은 기간을 갖지 않고 코드가 넘긴 start·end만 쓴다.
- 팝업 ①: `src/lib/ops/comp/popup.ts:33`(`/auth/event-popup`) → `src/lib/ops/comp/popupSelect.ts:29-34` 선택 → `src/components/event/EventPopup.tsx`(기간 표시·타이머).
- 배너: `src/components/growth/GiftEventCountdown.tsx`(`/api/gift-event`, 60초마다), 결제 화면 한 줄 `src/components/book/BookCheckout.tsx:34,137`(`BookRoutes.tsx:19`가 기간 안 상품만 넘김), 서재 회색 줄 `src/lib/library/home.ts:38`.
- 봇: `/event` `src/lib/ops/notify/bots.ts:73-77`.
- 약관 문구: `src/lib/legal/termsPolicy.ts:77`은 **이용권 기한**(11-30)만 적고 1+1 기간은 적지 않았다(이번에 설정값으로 추가).

### 2-2. 옛 오픈 이벤트 장치(`campaign_attributions` 등) — 재활용하지 않음(판단)
- 구조: 이벤트 페이지에서 `/api/campaign-entry`로 맥락 쿠키(10분)를 받은 브라우저만(`src/lib/growth/service.ts:22-44`), 필수 동의 시점에(`:64-73` `withAcquisitionAccount`가 계정 포트를 감쌈) `growth_campaign('attribute')`로 이용권을 준다(`:45-63`).
- 운영 상태(읽기): `growth_campaigns` `gyeol-opening-2026` status `ACTIVE`, 기간 10-10 ~ 10-31 15:00Z(시간으로 끝남). `campaign_attributions` BENEFIT_GRANTED 31 · CONTEXT 13.
- 판단: 이번 조건(캠페인 시작 뒤 **모든** 신규 가입자 — 선물 링크 가입 포함, 「필수 동의 + 가입 정보」 완료 시점, 탈퇴·재가입 해시 차단, 7일·4종·선물 불가)과 맞지 않는다(맥락 쿠키가 있는 사람만, 동의 시점, 해시 없음, 원장 이용권). 새 종류 `gift_rewards.kind='signup'`로 따로 만들었다.
- 재활용한 것: 유입 값 정리 `campaignUtm`(`src/lib/growth/model.ts`, 퍼널 utm), 옛 주소 307 경로(`src/app/campaign/[slug]/page.tsx` → 이제 `/free`로), 1+1 이용권 표(`gift_rewards`)·지갑·사용(`ops_gift('wallet'/'spend')`)·서재 이용권 줄·결제 화면 이용권 칸, 처리 봇 대기표·버튼·소유자 확인, 시험 계정 함수 `ops_test_user()`(결제창 작업, 그대로 씀).

### 2-3. `gift_rewards` 종류·상태와 선물 막는 조건
- 종류 `kind`: `event`(1+1) · `comp`(보상) → 이번에 `signup` 추가. 상태: `available` · `used_self`(원장으로 옮김) · `gifted`(링크 만듦) · `claimed`(받음) · `expired` · `revoked`(환불 회수). `gift_only`(보상 B의 선물 전용).
- 서버 선물 API(`src/lib/ops/gift/handler.ts` → SQL `ops_gift`): `link_next`(선물하기 창 — 남은 장 중 기한 빠른 것, 종류 구분 없음), `link`(장 지정 — 상태만 확인), `use_self`(선물 전용이면 거절), `claim`(받는 사람 가입 정보 필요, 본인 거절). 받은 이용권은 원장에 있어 다시 선물 대상이 아님.
- 서재 [이용권 선물하기] 버튼: `src/components/account/LibraryHome.tsx:64` `wallet.giftable > 0` — 지갑 `giftable`이 종류 구분 없이 셌다. 선물하기 창 기한 `GiftSheet.tsx:68`은 가장 빠른 기한(`wallet.expiresAt`).

### 2-4. 「가입 완료」가 확정되는 때
- 로그인 콜백 `src/lib/account/handler.ts:42-75` → 필수 동의 POST `/auth/consent`(`:116`, `record_account_consent` → `account_profiles` 생성 = 회원) → 가입 정보 POST `/auth/profile`(`src/lib/account/profile.ts:91`, `ops_account('save')` → `account_contacts` 처음 생성, `completed_at` = 처음 저장 시각). 가입 정보 전에는 결제·이용권 사용만 막힌다.
- 이번 「가입 완료」 = **가입 정보가 없던 회원의 첫 저장**(`snapshot.contact === null`). SQL은 `account_profiles.created_at`과 `account_contacts.completed_at`이 모두 캠페인 시작 이후여야 지급한다(시작 전에 동의했거나 정보를 마친 계정 = 기존 회원).

## 3. 만든 것

### 3-1. 신규 가입 이용권(1부)
- 대상: 캠페인 시작(`SIGNUP_CAMPAIGN_START`, 이번 배포 시각 — `src/lib/ops/config.ts`) 이후 필수 동의 + 가입 정보를 **모두** 마친 계정, 1인 1장. 선물 링크로 들어와 가입한 사람도 같다. 끝 = 1+1 끝과 같은 값(`GIFT_EVENT_DEFAULT_END` 하나 → `signupCampaignConfig`).
- 종류·규칙: `gift_rewards.kind='signup'`(계정당 유일 색인), 받은 시각 + 7일, 출시 4종(`product_scopes`, 사용 때 `ops_gift('spend')`·원장 `redeem`이 다시 확인 → 대운·세운 불가), `gift_only=false`(내가 쓰기만). 원장으로 옮길 때 이유 `SIGNUP_FREE`(1+1·보상은 `EVENT_PAYMENT_GIFT` 그대로). 환불 회수 대상 아님(주문 없음).
- 선물·양도 불가: 선물하기 창(`link_next`)은 가입 이용권을 고르지 않고(그것만 있으면 `NO_GIFTABLE`), 장 지정 링크(`link`)는 `GIFT_NOT_GIFTABLE`, 표 제약 `gift_rewards_signup_not_giftable`이 한 번 더 막는다. 지갑 `giftable`·새 `giftExpiresAt`은 가입 이용권을 빼서 서재 [이용권 선물하기] 버튼이 안 보이고, 선물하기 창 기한도 선물할 수 있는 장의 기한으로.
- 중복 방지: `signup_grant_hashes(hash, granted_at)` — `HMAC(REPORT_ADMIN_SECRET → "gyeol-signup-grant-v1", "제공자:제공자 사용자 id")`. 원문 id·이메일·계정 id 없음. 탈퇴 뒤 새 계정으로 다시 가입해도 같은 해시면 `ALREADY_RECEIVED`. 제공자 사용자 id는 로그인한 제공자의 identity(`src/lib/account/supabase.ts`, 서버 메모리만).
- 지급 시점: `/auth/profile` 첫 저장 직후(`src/lib/account/profile.ts`) → `grantSignupTicket`(`src/lib/ops/gift/service.ts`) → SQL `ops_signup('grant')`(계정 잠금 + 해시 잠금 + 유일 색인 → 같은 요청 두 번·동시 요청도 1장). 저장소 오류면 한 번 더 부른다. 응답 `joined`·`signupGift{expiresAt, event}`.
- 팝업: 가입 직후 서재 화면에서 하나만(`AccountScreen` → `EventPopup id="signup"`), 「가입을 환영해요.」 + 「내 책 한 권을 무료로 만들 수 있는 이용권 1장을 서재에 넣어 드렸어요(7일 안에 사용).」 [책 고르기], 1+1 기간이면 아래 작은 줄. [책 고르기]는 결제하려던 상품이 있으면 그 화면, 없으면 책장. 메인·상품 화면 팝업 선택(`selectPopup`)에서는 안 쓴 가입 이용권이 있는 회원에게 `signup`이 맨 앞(①을 대신) — 한 번에 하나. 닫으면 같은 탭에서는 다시 안 뜬다(기존 팝업과 같은 기억).
- 멈춤 장치: `ops_settings 'signup_grant' = {"on":true}`(기본 켜짐). 꺼짐이면 지급 `PAUSED`, 팝업·메인 띠·/free 혜택 문구 없음(마감 문구 없음). 하루 상한 없음.
- 처리 봇: 1분 크론이 최근 60분 신규 가입(시험 계정 제외) 20건 이상이면 「🚨 가입 급증 N건 (최근 1시간) · 오늘 지급 N장」 [지급 멈춤](지난 1시간에 같은 경보가 있으면 안 보냄). [지급 멈춤] → 같은 메시지가 「⏸ 가입 이용권 지급 멈춤 · 시각」 [다시 켜기], [다시 켜기] → 「▶️ 가입 이용권 지급 다시 켬 · 시각」 [지급 멈춤]. 덕짱님 id만(웹훅 첫 관문, 다른 사람은 무시·기록), 비밀번호 없음, 감사 기록 `signup_grant_paused/resumed`. `/campaign`: 지급 상태, 오늘·누적 신규 가입·지급, 사용·남음·만료, 무료로 만든 책(발행), 추정 생성비(최근 30일 `book_generation_runs.cost_usd` 권당 평균 × 무료 책 수). 시험 계정 제외.
- API 잔액 경보: 작가 호출 응답이 Anthropic 「credit balance is too low」 또는 402(또는 OpenAI 할당량)면 「🚨 생성 실패: API 잔액 확인 필요」(1시간 1번, `src/lib/ops/generation/supervisor.ts` → `ops_signup('credit_alert')`).

### 3-2. 캠페인 랜딩 /free(2부)
- `src/app/free/page.tsx` + `src/components/growth/FreeLanding.tsx`(+ css). 위에서 아래로: 질문 → 설명 → 예시 「한 페이지」 3장(예시 리포트 /example 가상 인물 서하은 본문 그대로 HTML 카드, `freeExamples` `src/lib/book/example.ts`) → 혜택 「가입하면 내 책 한 권 무료」(이용권 1장, 7일) → [가입하고 무료로 받기](`/login?next=/free`) → 1+1 작은 줄(설정값 날짜) → 채널·팔로우 권유(조건 아님) + 카카오 채널·인스타·스레드·X 링크.
- 회원: 안 쓴 가입 이용권이 있으면 「무료 이용권 1장이 서재에 있어요. ○월 ○일까지」 [책 고르기], 없으면 「이미 회원이시네요. 서재에서 이용권을 확인해 주세요」 [서재로 가기]. 종료·꺼짐: 혜택 문구 없이 「나를 한 권의 책으로 만나 보세요」 [상품 보기].
- 옛 오픈 이벤트 주소 `/campaign/*` → `/free`(307, 허용된 utm만 유지).
- 로그인 화면 한 줄(카카오·구글 버튼 아래): 「카카오로 가입할 때 「결리포트 채널 추가」에 체크하면 새 소식을 받아 볼 수 있어요」.
- 메인 띠: 로그인하지 않은 방문자에게만 「지금 가입하면 내 책 한 권 무료 · 1+1 진행 중」(1+1 기간이 아니면 뒷부분 없음) → /free. 회원·꺼짐·종료면 없음.

### 3-3. 책 끝 연결(3부)
- 주인 화면 마지막 쪽, 공유 버튼(링크 복사·카카오톡·공유하기 그대로) 바로 아래 `BookEndNotice`(`src/components/book/BookReading.tsx`): 1+1 기간이면 「1+1 진행 중: 한 권 결제하면 이용권 1장을 더 드려요. 친구에게 선물할 수도 있어요.」, 가입 이용권으로 만든 책이면 그 위에 「무료로 받은 책은 어떠셨나요? 마음에 드셨다면 다른 이야기도 만나 보세요.」, [다른 책 고르기]. 받은 사람의 공유 화면·예시에는 없다(기존 「받은 사람 끝 쪽에 이용권·이벤트 문구 없음」 시험 그대로 통과).
- 가입 이용권 책 판정: `ops_signup('book_kind')`(책 → 이용권 접수 → 원장 → `gift-self:<가입 이용권>`).

### 3-4. 퍼널 익명 집계(4부)
- 표 `funnel_daily(day, step, source, campaign, n)` — 날짜(KST) × 단계 × 유입(utm_source·utm_campaign) × 횟수만. 사용자 id·IP·쿠키 식별자 칸 없음. 하루 3,000칸을 넘는 새 유입 조합은 `other`로.
- 단계 14개: /free 조회, 메인 조회, 상품 화면, 입력 시작, 입력 완료, 결제하기(새 하단 시트를 여는 클릭), 결제창 열림(시트의 [카카오페이]·[토스페이] → 토스 결제창 직전), 이용권 사용, 신규 가입, 기존 회원 로그인, 가입 이용권 지급, 책 생성 시작, 책 발행, 결제 완료.
- 브라우저: `src/lib/analytics/funnel.ts` — 세션 저장소로 단계마다 1번, 유입은 그 세션의 utm 값(없으면 direct). 루트 레이아웃 `FunnelTracker`(조회 단계·로그인 신호), 기존 행동 기록 지점(상품 화면·입력 시작/완료·결제창 열림)과 시트·이용권·결제 완료·책 화면에 한 줄씩. 결제 요청·승인 코드는 그대로.
- 서버: `POST /api/funnel` → `ops_funnel('hit')`(같은 출처만, 응답 204).
- 시험 제외: 회원 단계는 서버가 로그인 계정을 보고 시험 계정(`testAccountIds` = `ops_test_user` 목록과 같은 출처)이면 세지 않는다. 익명 단계는 시험 계정으로 로그인한 적이 있는 브라우저에 남긴 「시험」 표시(쿠키 `gyeol-test-browser=1`·저장소 값, 식별자 아님)로 뺀다(세션 응답 `tester:true`, 로그인 콜백).
- 매출 봇 `/funnel`(명령 응답): 오늘·최근 7일 단계별 숫자와 전환율(괄호 = 기준 단계 대비), 유입별(메타·X·인스타·직접…), 서버 기록(신규 가입·가입 이용권·주문·결제·발행, 시험 계정 제외).

### 3-5. 추가 지시
- 1: 최신 origin/master 병합 — 배포 직전(20:04 KST) `git fetch` 결과 origin/master는 분기점 `95c59368` 그대로(새 커밋 없음, 충돌 없음). v5/main에만 있던 문서 커밋 2개(`docs/v5/consent/report.md`·`docs/v5/hotfix-pay.md`)는 v5/main 병합으로 같이 들어갔다. 시험 계정 제외는 `ops_test_user()` 그대로, 결제 단계 계측은 새 하단 시트.
- 2: `/event` 집계(`ops_notify('event_stats')`)에서 시험 계정 이용권 제외(앵커 패치).
- 3: 시험 계정 메타 전송 차단 — DB: 결제 완료 트리거(`meta_purchase_on_paid`)·결제 완료 화면 경로(`queue_meta_purchase`)·서버 전송(`meta_delivery_batch` claim·전송 직전 재확인)·브라우저 거울(`claim_meta_browser_events`)에서 `ops_test_user` 계정 줄을 뺀다(migration `20261111091000`, 결제 승인 코드 무변경). 브라우저: 「시험」 표시가 있으면 픽셀 로더 404, 상태 조회 `ready:false`, 직접 전송·결제 완료 화면 경로 202(안 보냄), 브라우저 관문 `publicMetaAllowed`도 막음.
- 4: 광고 문구용 실측 → 7절.

### 3-6. 약관·문서(5부)
- 약관 이용권 조항(`src/lib/legal/termsPolicy.ts`): 1+1 기간 줄(설정값), 「가입 이용권」 문단(무상 증정·신규 가입 1인 1회·받은 날부터 7일·4종·선물·양도 불가·운영상 지급 멈춤 가능), 유효기간·선물·부정 취득 문장 보완. 변경 이력 첫 줄(`FREE_BOOK_POLICY_DATE`), 동의 버전 그대로(`2026-11-06.1`).
- 처리방침: 2번 「이용권·선물」에 가입 이용권 지급 기록(해시), 10번 쿠키·저장소 표(로그인 완료 표시·운영자 시험 표시·세션 방문 통계)와 방문 통계 문장, 변경 이력 첫 줄. 동의 버전 그대로.
- `docs/v5/final4/legal-review.md` 맨 위 F 절: 「가입 조건 무료 증정」·「이벤트 연장 표시」 표와 확인 질문 7개(7번 = 「1+1」 표기, 8절 결정 필요 1).


## 4. 화면 캡처와 문구 목록

### 4-1. 캡처(390px = iPhone 13 WebKit, `docs/v5/free-book/captures/`)

로컬 서버(next dev + 로컬 Supabase, 1+1 켜짐)에서 찍었다. 왼쪽 아래 둥근 「N」은 개발 서버 표시라 운영 화면에는 없다. 맨 위 「광고 성과 측정 변경 안내」 카드는 기존 결정 A 공지(이번 작업 아님).

| 파일 | 화면 | 확인한 값 |
|---|---|---|
| `free-guest.png` | /free 손님(혜택 켜짐, `?utm_source=meta…`) | `data-free-landing="on"` |
| `free-member.png` | /free 로그인한 기존 회원 | 상태 `member` — 「이미 회원이시네요. 서재에서 이용권을 확인해 주세요」 [서재로 가기] |
| `free-ended.png` | /free 꺼짐(로컬에서 `ops_signup_switch(false)` → 찍고 다시 켬) | 상태 `off`: 혜택·[가입하고 무료로 받기] 없음, 「나를 한 권의 책으로 만나 보세요」 [상품 보기]. 1+1은 계속 진행 중이라 1+1 한 줄은 남는다(11-30 뒤에는 둘 다 끝나 이 줄도 사라짐 — 시간 이동 시험) |
| `signup-popup.png` | 가입 팝업 | 1개만(`[data-event-popup='signup']`), 1+1 작은 줄. 서버 응답만 「가입 이용권 받은 신규 회원」으로 바꿔 그림(지급 자체는 시험으로 확인) |
| `main-strip-guest.png` | 메인 띠(손님) | 「지금 가입하면 내 책 한 권 무료 · 1+1 진행 중 →」 → `/free` |
| `login-channel-note.png` | 로그인 화면 한 줄 | 카카오·구글 버튼 아래 |
| `inapp-instagram-login.png` · `inapp-kakaotalk-login.png` | 인앱 UA로 /free → [가입하고 무료로 받기] | 둘 다 `/login?next=/free`, 카카오 버튼 1개 |
| `book-end-signup.png` | 책 끝 — 가입 이용권 책 | `data-book-end-notice="signup"`, 공유 버튼 3개 그대로 |
| `book-end-paid.png` | 책 끝 — 결제 책 | `data-book-end-notice="paid"`, 공유 버튼 3개 그대로 |

- 가입 이용권 책 캡처: 로컬에서 실제 경로(가입 이용권 1장 → `ops_gift('spend')` → 이용권 접수)로 책을 접수하니 그 이용권(`gift-self:<가입 이용권>`)에 연결됐다. 다만 로컬 작가는 예산 범위가 없어 Anthropic 호출을 거절하고(실호출 0) 책이 「보류」로 남아, **이미 완성된 로컬 이용권 책 하나의 접수 기록을 잠시 그 이용권에 연결해 찍고 바로 되돌렸다**(로컬 DB만). 실제 발행 경로 끝까지의 판정은 `freeBookFlow`(가짜 LLM으로 실제 발행 → COMPLETED → `book_kind` signup:true)로 확인했다.
- 운영 확인(배포 뒤, 손님, 퍼널·메타 요청은 막고): 메인 띠 문구·`/free` 연결, /free 손님 상태·CTA, 로그인 한 줄, 화면 오류 0.

### 4-2. 고객에게 보이는 새 문구

| 위치 | 문구 |
|---|---|
| /free 질문·설명 | 「명리 특징과 MBTI 성향, 비슷하다고 느낀 적 없나요?」 · 「결리포트는 타고난 사주와 MBTI가 왜 닮았는지 한 권의 책으로 풀어 드려요.」 |
| /free 예시 | 「책 속 「한 페이지」」 · 카드 머리 「예시 · 가상의 인물 서하은」 · 「예시 리포트 앞 2장 펼쳐 보기 →」 |
| /free 혜택 | 「가입하면 내 책 한 권 무료」 「(이용권 1장, 7일)」 [가입하고 무료로 받기] |
| /free 1+1 줄 | 「지금 1+1 진행 중 — 한 권 결제하면 이용권 1장 증정(11월 30일까지)」(날짜는 설정값) |
| /free 권유 | 「카카오톡 채널을 추가하면 새 소식을, 인스타·스레드·X를 팔로우하면 매일 「한 페이지」를 받아 볼 수 있어요」 + [카카오톡 채널] [인스타그램 @gyeolreport] [스레드 @gyeolreport] [X @gyeolreport] |
| /free 회원 | 「이미 회원이시네요. 서재에서 이용권을 확인해 주세요」 [서재로 가기] · 이용권 보유 「무료 이용권 1장이 서재에 있어요. ○월 ○일까지」 [책 고르기] |
| /free 종료·꺼짐 | 「나를 한 권의 책으로 만나 보세요」 [상품 보기] |
| 가입 팝업 | WELCOME · 「가입을 환영해요.」 · 「내 책 한 권을 무료로 만들 수 있는 이용권 1장을 서재에 넣어 드렸어요(7일 안에 사용).」 [책 고르기] · 작은 줄 「지금 1+1 진행 중 — 한 권 결제하면 이용권 1장을 더 드려요」 |
| 로그인 화면 | 「카카오로 가입할 때 「결리포트 채널 추가」에 체크하면 새 소식을 받아 볼 수 있어요」 |
| 메인 띠 | 「지금 가입하면 내 책 한 권 무료 · 1+1 진행 중 →」 |
| 책 끝 | (가입 이용권 책만) 「무료로 받은 책은 어떠셨나요? 마음에 드셨다면 다른 이야기도 만나 보세요.」 · (1+1 기간) 「1+1 진행 중: 한 권 결제하면 이용권 1장을 더 드려요. 친구에게 선물할 수도 있어요.」 · [다른 책 고르기] |
| 선물 거절 | 「가입 이용권은 선물할 수 없어요.」 · 선물할 장이 없을 때 기존 문구에 가입 이용권 안내를 더함 |
| 약관·처리방침 | 3-6 · `legal-review.md` F 절 |

## 5. migration 전후 · 배포 id · 원격 SHA

### 5-1. 운영 migration(덕짱님 승인 목록: 새 종류·해시 기록·설정·퍼널 표 + 함수 패치)

방법: 이전 작업과 같은 CLI 임시 폴더(migration 이름 자리표시 33개 + 새 파일 2개, 커밋본과 `cmp` 동일) → `supabase db push --linked --dry-run`(대기 **2개만**: `20261111090000_v5_free_book`, `20261111091000_v5_meta_test_exclude`) → 적용 **2026-11-10 20:03:08~20:03:12 KST**.

| 항목 | 적용 전(20:02 KST) | 적용 후(20:03 KST) |
|---|---|---|
| migration 기록 | 33개, 마지막 `20261110200000` | **35개, 마지막 `20261111091000`** |
| `gift_rewards` | 49장(event used_self 1 · claimed 1, comp available 43 · claimed 2 · used_self 2) | 49장, 같은 분포(기존 이용권 변경 0) |
| `gift_rewards` 종류 제약 | `event`,`comp` | `event`,`comp`,`signup` + `gift_rewards_signup_not_giftable` + 계정당 유일 색인 `gift_rewards_signup_owner_key` |
| `ops_settings` 키 | notify_since · notify_wake_url · profile_launch_at · telegram_webhook · test_accounts | + `signup_grant = {"on":true}` |
| 새 표 | 없음 | `signup_grant_hashes`(0행) · `funnel_daily`(0행), 둘 다 RLS 켜짐 |
| 새 함수 | 없음 | `ops_signup`·`ops_funnel`(invoker) · `ops_signup_switch`(definer). 실행 권한 `service_role`·`postgres`만(anon·authenticated 없음) |
| `ops_notifications` | payment 1 · 종류 7개 | payment 1 · 종류 + `signup_surge`,`api_credit` |
| `meta_conversion_outbox` | 0 | 0 |
| 바뀐 함수 본문 md5 | ops_gift `6ec5da34…` · ops_notify `a2cd9b60…` · meta_purchase_on_paid `cfa5aa43…` · queue_meta_purchase `646c5541…` · meta_delivery_batch `7280514f…` · claim_meta_browser_events `37da0510…`(19:16 덤프와 같음 확인) | ops_gift `64509223…`(`GIFT_NOT_GIFTABLE`·`SIGNUP_FREE`·`giftExpiresAt` 있음) · ops_notify `e1f5b185…` · meta_purchase_on_paid `2fe9a6c3…` · queue_meta_purchase `5ba40050…` · meta_delivery_batch `761a5103…` · claim_meta_browser_events `5ea15e6f…`(네 메타 함수 모두 `ops_test_user` 참조) |

- 되돌리기: `docs/v5/free-book/rollback/free_book.before-20261111090000.sql`(ops_gift·ops_notify 적용 전 본문 + 새 객체 걷어내기(주석, 선택)) · `meta_test_exclude.before-20261111091000.sql`(메타 함수 4개 적용 전 본문). 운영 `supabase db dump --linked`(읽기 전용, 19:16 KST)에서 뽑았다. 지급만 멈추려면 처리 봇 [지급 멈춤] 또는 `select public.ops_signup_switch(false,'rollback');`.
- 지금 배포돼 있던 코드(`95c59368`)는 새 함수와 호환된다(가입 이용권 행이 없으면 결과가 같다) — migration을 코드보다 먼저 적용했다.

### 5-2. 병합·배포

| 단계 | SHA(로컬 = 원격 확인) |
|---|---|
| `v5/free-book-01` push | `f20004eae18f9b2b26f6592a723979f0abd4a375` |
| `v5/free-book-01 → v5/main`(release-v5-main worktree, 충돌 없음, 차이는 v5/main 문서 2개뿐) | `4e55269794d6ae9452e8e8a0530e1919f025aea3` |
| `v5/main → master`(release-master worktree, 내용 = v5/main) push 20:05:44 KST | `3df4bc957e7cab97f0691ebdf8121ed3b3931f1a` |
| Production 배포(Git 연동) | **`dpl_3DxC9hK59ECghAV3wp8ZgL8eTkab`** READY(만든 시각 20:05:48 → 준비 20:07:45 KST), 별칭 www.gyeolreport.com · gyeolreport.com, 커밋 `3df4bc95` |

- 되돌리기 후보: 바로 앞 배포 `dpl_5SRpJYdhTxcLBLFHugSWGFrmdUSr`(결제창 수정, rollback candidate). 코드를 되돌려도 DB 변경은 호환된다(위).

### 5-3. 배포 직후 확인(20:07~20:10 KST)

| 확인 | 결과 |
|---|---|
| `/api/gift-event` | phase `during`, 1+1 `2026-11-06 09:00 ~ 2026-11-30 23:59:59 KST`(끝 경계 12-01 00:00), 이용권 기한 11-30 23:59:59, `signup {active:true, days:7}` |
| `/free` HTML | 질문·혜택·「가상의 인물」 카드·카카오 채널 링크 있음, `data-free-landing="on"` |
| `/campaign/gyeol-opening-2026?utm_source=meta&utm_campaign=free_book_1111&fbclid=x` | 307 → `/free?utm_source=meta&utm_campaign=free_book_1111` |
| `/api/funnel` 다른 출처 POST | 403 |
| 운영 화면(WebKit 390px, 손님) | 메인 띠 → `/free`, /free 손님·CTA, 로그인 한 줄, 화면 오류 0 |
| 1분 크론 · 봇 명령 | 두 봇 웹훅·명령 목록이 새 배포 id로 다시 등록(`telegram_webhook` 20:09:14 KST, `setWebhook`+`setMyCommands` 성공일 때만 기록) — `/funnel`(매출)·`/campaign`(처리)이 메뉴에 들어감 |
| `/campaign`·`/funnel`이 부르는 함수 | `ops_signup('stats')` 응답(지급 켜짐, 가입·지급 0, 권당 실측 평균 $0.2254 · 최근 30일 8권), `ops_funnel('report')` 응답(퍼널 행 0, 서버 기록: 7일 신규 가입 4 · 주문 1 · 결제 1 · 발행 7) |
| Vercel 런타임 오류(배포 뒤) | 0건 |

### 5-4. 배포 30분 뒤 확인

| 확인(20:38~20:40 KST) | 결과 |
|---|---|
| Vercel 런타임 오류(배포 뒤 전체) | **0건** |
| 크론 | 새 코드의 1분 크론이 20:09에 두 봇을 다시 등록한 뒤 그대로(`telegram_webhook` = 새 배포 id). 가입 급증 경보·API 잔액 경보 0건(`ops_notifications` 최근 40분 없음 — 가입 0이라 정상) |
| 가입 이용권 | 지급 켜짐 `{"on":true}`, 신규 가입·지급 0(배포 뒤 30분 동안 운영 가입 없음), 해시 기록 0. 기존 이용권 49장 분포 그대로 |
| 퍼널 | 30분 동안 실제 방문 기록 0(같은 시간 새 주문 0·새 책 0). 서버 → DB 경로를 보려고 표시값 1건을 보냈다: `POST /api/funnel {"step":"free_view","source":"deploycheck","campaign":"f_deploy_check"}` → 204 → `funnel_daily` 1행(2026-11-10 · free_view · deploycheck · f_deploy_check · 1). **`/funnel`의 「deploycheck」 1건은 이 확인값이다**(무시하면 됨, 7일 뒤 집계 창에서 빠진다). 브라우저 쪽 전송은 배포 직후 WebKit 확인에서 `/api/funnel` 요청이 나가는 것을 봤다(그때는 막아서 기록 안 됨) |
| /free·메인 띠 노출 | 배포 직후 확인과 같음(5-3) |
| `/campaign`·`/funnel` | 두 봇 명령 목록 등록 확인 + 부르는 함수 응답 정상. 텔레그램에서 실제로 눌러 본 응답은 덕짱님 확인(8-1 4·5) |
| 메타 대기열 | `meta_conversion_outbox` 0 그대로 |

## 6. Cowork가 쓸 정보

- /free 주소: **https://www.gyeolreport.com/free**
- 권장 UTM(값은 소문자·숫자·_·-만 집계, 6자리 이상 숫자는 버림):
  - 메타: `https://www.gyeolreport.com/free?utm_source=meta&utm_medium=paid&utm_campaign=free_book_1111`
  - X: `https://www.gyeolreport.com/free?utm_source=x&utm_medium=paid&utm_campaign=free_book_1111`
  - 인스타 자연 게시물: `?utm_source=instagram&utm_medium=social&utm_campaign=free_book_1111` · 스레드 `utm_source=threads` · 카카오 채널 `utm_source=kakao`
- 매출 봇 `/funnel`이 `meta`·`x`·`instagram`·`threads`·`kakao`를 각각 「메타·X·인스타·스레드·카카오」로 나눠 보여 준다.
- 광고에서는 1+1·대운·세운을 내세우지 않는다(지시). /free의 1+1 줄은 사이트 안 작은 줄로만.
- 예시 카드 문장은 가상 인물(서하은) 예시 리포트 본문 그대로 — 소재에 인용할 때도 이 세 문단을 쓴다(고객 리포트 인용 금지).


## 7. 광고 문구용 실측(운영 v5 책, 추가 4)

운영 DB 읽기(2026-11-10 19:10 KST): `paid_report_snapshots` status COMPLETED · `productVersion='v5'` · 출시 4종, 책 주인(이용권 접수 계정 또는 주문 계정)이 `ops_test_user`가 아닌 책. 본문 = 모든 장의 소제목 아래 문단(`draft.chapters[].sections[].paragraphs[]`)을 이은 글자 수(소제목·카드·표 제외). 공백 제외 = 모든 공백 문자(띄어쓰기·줄바꿈)를 뺀 수.

| 상품 | 책 수(시험 제외) | 장 수 최소·중앙·최대 | 본문 공백 포함 최소·중앙·최대 | 본문 공백 제외 최소·중앙·최대 |
|---|---|---|---|---|
| 나라는 사람(종합) | 4 | 13 · 13 · 13 | 12,449 · 13,670 · 14,672 | 9,390 · 10,275 · 11,038 |
| 내가 잘되는 방식(커리어) | 2 | 9 · 9 · 9 | 8,811 · 10,429 · 12,047 | 6,632 · 7,850 · 9,068 |
| 내 사랑 이야기(연애) | 1 | 9 · 9 · 9 | 9,415 · 9,415 · 9,415 | 7,118 · 7,118 · 7,118 |
| 우리라는 사이(궁합) | **0**(시험 계정 포함해도 0) | — | — | — |

- 시험 계정 책은 종합 1권(13장 · 12,755 / 9,618자)뿐이라 위 표에서 뺐다.
- 표본이 작다(종합 4·커리어 2·연애 1·궁합 0). 「약 ○자」는 종합 「약 1만 3천 자(13장)」, 커리어·연애 「약 1만 자(9장)」 정도가 근거가 있다. 궁합은 운영 v5 책이 없어 실측 근거가 없다(SPEC 목표 9장 9,000~11,250자는 목표값이지 실측이 아님) — 궁합 소재에 글자 수를 쓰려면 궁합 책이 나온 뒤 다시 잰다.


## 8. 덕짱님 실전 확인 순서 · 남은 위험 · 결정 필요

### 8-1. 실전 확인 순서(휴대폰, 10분)

시험 계정으로 로그인한 적이 있는 브라우저는 「시험」 표시가 남아 익명 퍼널·메타 전송에서 빠진다(1년). 확인은 **인스타그램·카카오톡 안 브라우저**(따로 저장소를 씀)나 그 계정으로 로그인한 적 없는 브라우저에서 한다.

1. 시험 계정이 아닌 새 카카오(또는 구글) 계정 준비 → 인스타그램 DM·카카오톡 나와의 채팅에 `https://www.gyeolreport.com/free?utm_source=meta&utm_medium=paid&utm_campaign=free_book_1111`를 보내 그 안에서 연다.
2. [가입하고 무료로 받기] → 로그인 화면 아래 한 줄 확인 → 카카오 화면에서 「결리포트 채널 추가」 체크 → 필수 동의 → 가입 정보 저장.
   - 기대: 「가입을 환영해요.」 팝업 **1개**(1+1 작은 줄 포함) → [책 고르기] → 책장. 서재 이용권 1장(오늘 + 7일), [이용권 선물하기] 버튼 없음. 메인으로 가면 띠가 없다(회원).
3. 종합·커리어·연애·궁합 중 하나 → 결제 화면에 이용권 1장(7일) → 이용권으로 만들기 → 책이 나오면 마지막 쪽: 공유 버튼 아래 「무료로 받은 책은 어떠셨나요?…」 「1+1 진행 중:…」 [다른 책 고르기]. (대운·세운 결제 화면에는 이 이용권이 잡히지 않는다)
4. 처리 봇 `/campaign` → 오늘 신규 가입 1 · 지급 1 · 사용 1 · 무료로 만든 책 1, 아래 [지급 멈춤]. 눌러 보면 같은 메시지가 「⏸ 가입 이용권 지급 멈춤 · 시각」 [다시 켜기]로 바뀐다 → **[다시 켜기]로 켜 둔다**(멈춘 동안 /free는 일반 소개, 메인 띠 없음 — 서버마다 최대 30초 늦게 반영).
5. 매출 봇 `/funnel` → 오늘 「메타」 유입에 /free 조회·신규 가입·가입 이용권 지급·책 생성 시작·책 발행이 1씩, 서버 기록 신규 가입·가입 이용권 +1.
6. (선택) 그 계정 탈퇴 → 같은 카카오 계정으로 다시 가입 → 이용권·팝업 없음.

이 계정은 시험 계정이 아니라서 `/campaign`·`/funnel`·`/event`에 1건으로 잡힌다(결정 필요 2).

### 8-2. 남은 위험

- **해시 열쇠**: `REPORT_ADMIN_SECRET`에서 파생한다. 그 값을 바꾸면 이전 가입 기록과 대조가 안 돼 탈퇴·재가입자가 한 번 더 받을 수 있다(같은 계정은 유일 색인으로 그대로 막힘).
- **급증 경보 전 지급**: 1분 크론이 「최근 60분 20건」에서 경보한다. 계정을 한꺼번에 만들면 경보 전에 20장 안팎이 나갈 수 있다(무료 책 1권 = 최근 30일 실측 평균 $0.2254 → 20권 ≈ $4.5). 하루 상한은 지시대로 없다. [지급 멈춤] 뒤에도 서버마다 최대 30초 지급될 수 있다(켜짐 값 30초 캐시).
- **퍼널 숫자의 성격**: 브라우저 세션 저장소 기준이라 「세션 수」다(같은 사람이 다른 날·새 탭이면 다시 셈). 광고 차단기·스크립트 꺼짐은 빠진다. 같은 출처 검사와 하루 3,000칸 상한(넘으면 `other`)만 있어 누가 일부러 숫자를 부풀리는 것은 막지 못한다(돈·이용권과 무관). 기준값은 `/funnel`의 서버 기록(가입·지급·주문·결제·발행).
- **인앱 실기기**: 카카오 로그인 왕복은 기존 흐름 그대로(이번에 바꾸지 않음)지만 실기기 확인은 8-1에서.
- **「1+1」 표기**: 결정 필요 1.
- 끝난 오픈 이벤트(`growth_campaigns` `gyeol-opening-2026` ACTIVE, 10-31에 시간으로 끝남)·`campaign_attributions`는 건드리지 않았다(상태 JSON 주소도 그대로).
- 로컬 DB(공용 로컬 Supabase)에 로컬 개발 계정의 가입 이용권 1장·「보류」 책 1권(`report_a32850…`)이 남아 있다(운영 무관).

### 8-3. 결정 필요

1. **「1+1」 표기** — 2026-11-06 법률 검토로 고객 화면에서 「1+1」·「한 장을 더 드려요」를 뺐다(묶음 판매로 읽힐 우려). 이번 F 문구는 지시 원문대로 「1+1 진행 중」·「이용권 1장을 더 드려요」를 쓴다(가입 팝업·책 끝·메인 띠·/free 한 줄). 메인 배너·팝업 ①·주문서는 「증정」 표현 그대로라 두 표현이 섞여 있다. 그대로 둘지, 「증정 이벤트 진행 중 — 결제 1건마다 이용권 1장 증정」처럼 맞출지(문구 상수 4곳만 바꾸면 됨). `legal-review.md` F 7번.
2. 실전 확인 계정을 시험 계정으로 뺄지 — 빼려면 Vercel env `ADMIN_USER_IDS`에 그 계정 id를 더하고 재배포(1분 크론이 env + 누나 계정으로 목록을 덮어쓴다). 안 빼면 집계에 1건 섞인다.
3. 법률 검토 F 질문 1~7, 특히 1번(광고 소재에도 「가입 시 1장·7일·4종」을 적을지 — Cowork 소재와 연결).

### 8-4. 정리

임시 파일(캡처·확인 스크립트, CLI 임시 폴더, 기준 master worktree, 로컬 env 파일)은 확인을 마친 뒤 지웠다(5-4 뒤). 로컬 개발 서버는 껐다.
