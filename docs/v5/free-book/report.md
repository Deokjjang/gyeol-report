# F — 가입하면 내 책 한 권 무료 (신규 가입 이용권 · /free · 책 끝 연결 · 퍼널 · 시험 계정 메타 차단)

브랜치 `v5/free-book-01`(기준 origin/master `95c59368` = 결제창 수정 배포본 `dpl_5SRpJYdh…`, 17:53 KST). 덕짱님 지시 F + 추가 1~4(2026-11-10). 결정 2건은 작업 중 질문으로 받음(아래 1-2).

## 1. 결론과 항목별 판정

TODO_CONCLUSION

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
- 1: 최신 origin/master 병합 TODO_MERGE, 시험 계정 제외는 `ops_test_user()` 그대로, 결제 단계 계측은 새 하단 시트.
- 2: `/event` 집계(`ops_notify('event_stats')`)에서 시험 계정 이용권 제외(앵커 패치).
- 3: 시험 계정 메타 전송 차단 — DB: 결제 완료 트리거(`meta_purchase_on_paid`)·결제 완료 화면 경로(`queue_meta_purchase`)·서버 전송(`meta_delivery_batch` claim·전송 직전 재확인)·브라우저 거울(`claim_meta_browser_events`)에서 `ops_test_user` 계정 줄을 뺀다(migration `20261111091000`, 결제 승인 코드 무변경). 브라우저: 「시험」 표시가 있으면 픽셀 로더 404, 상태 조회 `ready:false`, 직접 전송·결제 완료 화면 경로 202(안 보냄), 브라우저 관문 `publicMetaAllowed`도 막음.
- 4: 광고 문구용 실측 → 7절.

### 3-6. 약관·문서(5부)
- 약관 이용권 조항(`src/lib/legal/termsPolicy.ts`): 1+1 기간 줄(설정값), 「가입 이용권」 문단(무상 증정·신규 가입 1인 1회·받은 날부터 7일·4종·선물·양도 불가·운영상 지급 멈춤 가능), 유효기간·선물·부정 취득 문장 보완. 변경 이력 첫 줄(`FREE_BOOK_POLICY_DATE`), 동의 버전 그대로(`2026-11-06.1`).
- 처리방침: 2번 「이용권·선물」에 가입 이용권 지급 기록(해시), 10번 쿠키·저장소 표(로그인 완료 표시·운영자 시험 표시·세션 방문 통계)와 방문 통계 문장, 변경 이력 첫 줄. 동의 버전 그대로.
- `docs/v5/final4/legal-review.md` 맨 위 F 절: 「가입 조건 무료 증정」·「이벤트 연장 표시」 표와 확인 질문 6개.


## 4. 화면 캡처와 문구 목록

TODO_CAPTURES

## 5. migration 전후 · 배포 id · 원격 SHA

TODO_DEPLOY

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

TODO_NEXT
