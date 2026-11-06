# P — 화면 속도 개선 + P 추가(로그인 결제·1+1·이용권 11-30·서재·선물·결제수단·문서) 보고

> **단계 1(배포 전 보완 + 운영 배포, 2026-11-06) 결과는 맨 아래 「단계 1」 절.** 아래 1~9절은 배포 전(a58d3426) 보고 원문이다. 그중 G(결제위젯)는 단계 1에서 취소·제거했다.

브랜치 `v5/perf-01`(기준 `origin/v5/main` 2ad0af3f — 배포 직후 고친 migration e95b1f54·2ad0af3f 포함). Anthropic 호출 0. 운영 쓰기 0(운영은 공개 페이지 측정만). 배포 안 함.
판정 표기: PASS / PARTIAL / FAIL / UNVERIFIED.

## 1. 측정 결과 — 원인 순위

측정 방법
- 운영 공개 페이지: 헤드리스 크롬(390×844)으로 www.gyeolreport.com 3회씩(`x-vercel-id`·캐시 헤더·요청 순서).
- 로그인 화면: 로컬 `next build && next start` + 로컬 Supabase. 운영과 같은 양으로 시드(계정당 책 5~10권, v1·v2·v4 대형 스냅샷 240KB~1MB, v5 110~330KB — 같은 생성기로 만든 로컬 실제 책 복제, `tools/perf/seed.ts`).
  운영 DB 크기 집계는 권한 분류기가 운영 읽기를 막아 쓰지 못했다(로컬 실제 책 크기로 대신).
- 서버 구간: `tools/perf/sim.mjs`(제품 코드 무변경 preload)가 요청마다 Supabase 호출 목록·순차 단계를 Server-Timing 헤더와 로그로 남긴다.
  지연 모델: **iad1** = 엣지→함수 왕복 200ms(운영 실측) + Supabase 호출마다 180ms(미국 동부↔서울), **icn1** = 5ms + 3ms.
- 수치는 따뜻한 상태(같은 장면 한 번 먼저 열고 버림) 3회 중앙값, ms. 「첫 내용」 = 그 화면의 실제 내용이 DOM에 들어온 시각(뼈대·「확인 중」 제외).

| 순위 | 원인 | 근거 |
|---|---|---|
| 1 | **함수 지역이 미국 동부(iad1), DB는 서울** | 운영 배포 `regions: ["iad1"]`. 운영 실측: 공개 HTML은 서울 엣지 캐시(HIT, TTFB ≈10ms)인데, 뒤따르는 `/auth/session`·`/auth/event-popup`·`/api/gift-event`·`/api/analytics/meta`·`/login` 미리 불러오기는 모두 `icn1::iad1`로 가서 비회원도 한 번에 210~800ms. 로컬 재현: **코드는 그대로 두고 지역만 바꾸면** 서재 1,684→184ms, 책(v5) 1,582→102ms |
| 2 | 서재가 세션 확인 **뒤에** API 7개를 따로 부르고, 각 API가 로그인 확인(getUser)+계정 조회를 매번 반복 | 세션 → comp·orders·library-list·gift·profile·ticket-summary 7개. 이용권 조회 하나가 Supabase 9번·순차 7단계, 목록은 RPC 2개를 줄줄이 |
| 3 | 책 열기: 소유 확인이 **책 본문(최대 1MB)을 DB에서 한 번 더** 받고, 마지막 조회 3개가 순차 | v4 책 한 번 열 때 DB에서 667KB(본문 2회) |
| 4 | 함수 크기: 운영 빌드에 dev 라우트 함수 40개(각 30~50MB 추적 파일), 작가 함수 4개에 실행 중 읽지 않는 `knowledge-v5/legacy`(2.3MB) | 함수 추적 파일 합계 991MB |
| — | (원인 아님) 서재 목록이 책 본문을 받는가 | 아니다 — `list_account_reports`는 요약 칸만(확인). 그대로 둠 |
| — | (원인 아님) 공개 페이지(메인·상품·/example) | 이미 정적 생성(엣지 HIT). 남는 건 개인화 API(팝업 판정 등) → 지역 이동으로 해결 |

운영 공개 페이지(2026-11-06, 3회 중앙값)

| 주소 | TTFB | FCP | LCP | JS | 뒤따르는 API(함수) |
|---|---|---|---|---|---|
| / | 9 (엣지 HIT) | 196 | 472 | 13개·200KB | 4개, 각 225~268ms (iad1) |
| /products | 9 (HIT) | 148 | 444 | 13개·200KB | 4개, 238~795ms |
| /example | 8 (HIT) | 120 | 120 | 12개·210KB | 1개, 277ms |
| /report/new | 9 (HIT) | 152 | 584 | 18개·272KB | 3개, 307~365ms |
| /login | 391 (MISS, iad1 동적) | 372 | 636 | 14개·219KB | 2개 |

## 2. 고친 것

P(속도)
1. **함수 지역 icn1(서울)** — `vercel.json` `"regions": ["icn1"]`. 크론 5개·결제 승인(성공 화면에서 토스 API 호출, 토스는 국내)·토스 웹훅(503 뼈대, 그대로)·Meta CAPI·Anthropic 호출은 지역과 무관하게 그대로 돈다(Anthropic은 왕복 +150ms 정도, 원고 생성 수십 초에 비해 무시). maxDuration 설정 그대로.
2. **서재 한 번에 받기** `GET /auth/library-home`(`src/lib/library/home.ts`): 로그인 확인 1번 + 조회 4개 동시(목록·주문·제본 중·이용권 지갑). 책 본문 없음. `/account`에서는 세션 확인과 **동시에** 출발. 운영 확인용 `Server-Timing: auth;dur, data;dur` 헤더.
   목록 RPC 2개도 동시에(`library/supabase.ts`). 계정 정보의 혜택 알림 조회는 펼칠 때만.
3. **책 열기**: 소유 확인을 본문 없이 참·거짓만(`book_share_owned`, 같은 판단 함수 사용, 함수 없는 DB면 예전 방식) → DB에서 받는 양 667KB→334KB. 소유 확인·공유 링크·임시본 여부 3개를 동시에.
4. **뼈대 화면**: 서재 로딩 중 티켓 줄·책 카드 자리(회색). 책 화면은 기존 loading.tsx 그대로.
5. **함수 크기**: Vercel 빌드에서만(`VERCEL=1`, `package.json` build → `scripts/build/deploy-strip.mjs`) dev 라우트 진입 파일과 실행 중 읽지 않는 `knowledge-v5/legacy`를 뺀다. 로컬·시험은 그대로, 주소 차단은 기존 proxy가 계속. (`next.config.ts`는 v4 검증 기록이 해시로 고정해 두어 손대지 않았다.) Vercel 방식 빌드 확인: 함수 103→62개, 추적 파일 합계 991→357MB, 작가 함수 report-jobs 20.2→17.9MB, 작가 함수 4개에 legacy 0.
6. **바꾸지 않은 것**: 메인→상품 이동을 라우터 이동(미리 불러오기)으로 바꿔 쟀으나 휴대폰 CPU 조건(4배 감속)에서도 399 vs 410ms로 차이가 없어 되돌렸다. 공개 페이지는 이미 정적이라 그대로.

P 본문 3
- 재동의 화면 맨 위 한 줄 「업그레이드 기념 이용권이 서재에서 기다리고 있어요」 — 예전에 필수 동의를 마친 기존 회원(재동의 대상)이고 안 쓴 보상 이용권이 있을 때만(`ops_comp_campaign('popup')`, 읽기 전용). 신규 가입자는 계정 프로필이 없어 **조회 자체를 하지 않는다**.
- 카카오 가입자 이메일 직접 입력: `type=email` + `inputMode="email"`·`autoCapitalize="none"`·`autoCorrect="off"`·`spellCheck=false`·앞뒤 공백 제거. 오류 문구는 이미 해요체(형식·두 번 입력 불일치·직접 입력 요청).

## 3. 전후 표 (로컬, 따뜻한 상태, 중앙값 ms — TTFB / 첫 내용 / 상호작용 가능)

| 화면 | 전: 기준 코드 + iad1(=지금 운영) | 코드만 바꿈(iad1) | 지역만 바꿈(icn1) | **후: 브랜치 + icn1** |
|---|---|---|---|---|
| 서재(책 10권) | 3 / **1,684** (이용권 2,245) / 1,684 | 3 / 894 (897) / 894 | 3 / 184 (210) / 184 | 3 / **145** (이용권 **148**) / 145 |
| 서재(책 5권) | 3 / 1,669 (2,247) / 1,669 | 3 / 892 (895) / 892 | 2 / 169 (196) / 169 | 3 / **144** (146) / 144 |
| 재동의 화면 | 2 / 696 / 696 | 3 / 894 / 894 | 3 / 129 / 129 | 2 / **146** / 146 |
| 책 열기 v5 | 213 / 1,582 / 1,582 | 214 / 1,197 / 1,197 | 12 / 102 / 102 | 12 / **84** / 84 |
| 책 열기 v4 | 212 / 1,659 / 1,659 | 213 / 1,258 / 1,258 | 12 / 164 / 164 | 11 / **130** / 130 |
| 책 열기 v2 | 212 / 1,444 / 1,444 | 212 / 1,257 / 1,257 | 11 / 429 / 429 | 11 / **394** / 394 |
| 책 열기 v1 | 212 / 1,454 / 1,454 | 211 / 1,264 / 1,264 | 11 / 430 / 430 | 11 / **429** / 429 |
| 기한 지난 책 링크 | 210 / 968 / 968 | 212 / 979 / 979 | 13 / 378 / 378 | 11 / **346** / 346 |
| 생성 대기 화면 | 211 / 1,177 / 1,177 | 210 / 1,170 / 1,170 | 11 / 395 / 395 | 10 / **395** / 395 |
| 메인 | 3 / 53 / 54 | 3 / 52 / 72 | 3 / 54 / 72 | 3 / 35 / 73 |
| 상품(입력) | 3 / 329 / 329 | 3 / 327 / 327 | 3 / 328 / 328 | 3 / 328 / 328 |
| 메인→상품 이동(누른 뒤) | 351 | 370 | 351 | 374 |

- 목표 「서재 첫 표시 1초 안(따뜻한 상태)」: **145ms — PASS(로컬 모델)**. 운영 실측은 배포 뒤(UNVERIFIED).
- 서재 API: 7개(세션 뒤 순차 시작) → 2개(동시 출발). 책 v4 열기 DB 수신 667KB→334KB, 순차 7→5단계.
- 재동의 화면은 iad1에서는 보상 확인 1단계(+190ms)만큼 늦지만 icn1에서는 +17ms.
- 「코드만 바꿈(iad1)」 열: 지역을 옮기기 전 이 코드만 배포해도 서재 1,684→894ms.

## 4. 남은 느린 곳
1. **운영 수치는 배포 뒤에만 확인 가능**(UNVERIFIED): Vercel 함수 콜드 스타트(첫 요청 수백 ms~1초+), 실제 휴대폰 네트워크 왕복은 로컬 모델 밖.
2. 책 열기 v1·v2(옛 화면) ~430ms: 화면이 뜬 뒤 브라우저가 `/auth/session` → `/auth/library-status`를 또 부른다(서재 담기 확인, 옛 화면 전용). 이번 범위에서는 두지 않았다(화면 변화 0 조건).
3. 생성 대기·만료 화면 ~350~400ms: 서버는 40ms, 나머지는 화면 쪽 그림·애니메이션.
4. 모든 로그인 API가 Supabase Auth `getUser`(네트워크 1회)로 확인한다 — icn1에서는 수 ms라 그대로 둠(JWT 로컬 검증으로 바꾸는 건 보안 판단이 필요해 범위 밖).
5. `/login`은 동적 페이지(검색 인자 읽기) — icn1에서 수십 ms.

## 5. P 추가 A~I 결과

| 항목 | 한 일 | 판정 |
|---|---|---|
| A 로그인 결제 | 비회원·재동의 전은 주문서에 동의 칸·구매자 칸 없이 「결제하기」 하나 → 누르면 로그인(신규면 가입 동의·정보 입력까지). 돌아오면 입력값·상품 복원(같은 탭은 기존 sessionStorage, 다른 탭·앱 전환 대비 같은 기기 localStorage 30분 사본, 복원 뒤 삭제). 신규 가입자는 동의 뒤에도 가입 정보를 마칠 때까지 돌아갈 곳을 쥐고 있다가 보냄. 서버: 결제 준비가 회원이 아니면 `LOGIN_REQUIRED`(401, 주문 쓰기 전), 비회원 구매 연결 쿠키 발급 중단. 비회원 문구 제거(주문서·결제 완료·약관·처리방침·로그인 화면 「로그인 없이도 책을 만들 수 있습니다」→「로그인 없이 둘러보기」). 이미 비회원으로 만든 책은 링크 열람만(서재 담기 새로 안 만듦) | PASS(로컬 시험·캡처) |
| A 인앱 브라우저 | 카카오 버튼이 먼저(기존). 인스타그램·페이스북·카카오톡·네이버·라인 등에서 Google을 누르면 「이 앱 안에서는 Google 로그인이 안 돼요」 + [기본 브라우저로 열기](카카오톡 스킴·안드로이드 크롬 intent, 아이폰 다른 앱은 메뉴 안내) + [주소 복사] | PARTIAL — UA 흉내 캡처만. **인앱에서 카카오 로그인 → 결제 끝까지는 실기기 확인 필요(UNVERIFIED)** |
| B 기한 지난 v5 이전 책 | 서재에 「만료됨」 카드 없음. 링크(본인·공유)는 「열람 기간이 끝난 리포트예요」 한 줄. 만료 작업이 원고·입력행(기존)에 더해 주문의 옛 입력 칸(동의 기록만 남김)과 구매자 이름·이메일·전화도 지움. 남는 최소 기록: 주문번호·주문코드·상품·금액·일시·상태(내부 전용). v5 데이터는 그대로 | PASS(PGlite 시험) |
| C 1+1 단순화 | 상한 없음(SQL 상한 검사 제거, env `GIFT_EVENT_MAX_PER_ACCOUNT`·`BONUS_MAX` 읽지 않음), 친구 첫 결제 보너스 없음(SQL 'bonus'는 아무것도 주지 않음, 결제 뒤 처리에서 호출 제거). 기간 그대로 | PASS |
| C 환불 시 회수 | **동작 그대로 둠**(아래 9번 확인 요청): 기존 결정·코드는 「안 쓴 이벤트 이용권은 회수, 이미 쓴 것은 회수 안 함」. 약관 문장도 이 동작에 맞춤 | 결정 필요 |
| D 기한 11-30 | 새 발급(1+1·보상·수동) 기한 = 2026-11-30 23:59:59 KST(그 뒤 발급만 30일, 최종3 「30일 넘지 않음」 안전장치 유지). 기존 행 당김 migration + 기록표 `ticket_expiry_adjustments`(되돌리기용). 원장은 수정 금지 트리거를 같은 트랜잭션 안에서만 잠시 풀고 다시 켬(시험으로 확인). 팝업 ②③·서재·결제 화면·선물 창 「11월 30일까지」(캡처). 사용 범위 4종 그대로 | PASS(로컬). 운영 대상 수는 배포 단계 |
| E 결제 화면 이용권 | 「리포트 이용권 N장」 = 일반 + 남은 이벤트·보상(선물받은 것 포함, `ops_gift('wallet')`). 1장 고르면 그 책에 바로 씀 — 접수 직전 기한 가장 빠른 1장을 원장으로 옮김(`spend`, 같은 요청 재시도는 다시 안 옮김). 0장이면 이용권 칸·「보유한 이용권이 없습니다」 문장 숨김, 결제만. 해요체·글씨 크기 정리 | PASS(로컬). **누나 계정 5장 시험은 운영 — 덕짱님 직접**(로컬은 같은 시나리오 PGlite 통과: 수동 5장 → 지갑 5장·11-30) |
| F 서재 | 인사말·옛 업그레이드 문장·`/auth/comp`(꺼짐 표시 경로) 삭제. 위: 얇은 티켓 줄 「리포트 이용권 N장 · 11월 30일까지」 [이용권 선물하기](선물할 수 있는 장이 있을 때만) + 회색 한 줄(이벤트 기간 중). 0장: 「리포트 이용권 0장」만. 아래: 굵은 선 + 「만든 리포트」 책장(구매 내역 합침, 카드 전체 링크·접근성 라벨, 발행일·기한/「언제든 다시 읽을 수 있어요」, 주문코드 또는 「이용권으로 만든 책」, 「문의·환불 요청」 글자 링크, 상태는 만드는 중/확인이 필요해요만). 구매 내역 칸·금액·상태·영수증·「책 펼치기」 버튼 삭제 | PASS(로컬 캡처). 운영 B·A·덕짱님·누나 계정 판정은 배포 뒤(UNVERIFIED) |
| F 선물하기 창 | 제목·본문·[공유하기](휴대폰, Web Share)·[링크 복사](데스크톱은 복사만)·「보낸 선물 N장 · 받은 분 M명」. 링크는 누르는 순간 생성(토큰은 화면에서 만들어 공유 창을 바로 열고 서버는 해시만), 공유 창을 그냥 닫으면 그 이용권 되돌림. 받은 이용권은 원장이라 선물 대상 아님 | PASS(로컬·PGlite). 실제 휴대폰 공유 창은 UNVERIFIED |
| F 받는 화면 | 「결리포트 이용권 1장을 선물받았어요」 [로그인하고 받기] → 로그인(신규면 동의·정보까지) 뒤 자동으로 받음(돌아오기 쿠키 + 같은 기기 24시간 사본). 이미 회원이면 열자마자 받음. 기한 지남·이미 받음 「기한이 지났거나 이미 받은 선물이에요」 한 줄. 보낸 사람 본인이 열면 받지 않음(기존 규칙 유지 — 「자기 자신 받기 차단을 만들지 않는다」는 새로 만들지 않는다는 뜻으로 봄; 자동 받기라 기존 차단을 없애면 보낸 사람이 링크 확인만 해도 자기 것으로 돌아옴) | PASS(로컬 캡처 3종) |
| G 결제수단 | 아래 「G」 절 | PARTIAL |
| H 상품 카드 | 장 수·글자 수 표시 삭제(「한 사람, 한 권.」) | PASS |
| I 팝업·문서 | 팝업 ①·배너 작은 줄 「이용권은 11월 30일까지 쓸 수 있어요」, 친구 보너스 문구 없음 확인, 팝업 버튼 `/account#gifts`→`/account`. 약관(이용권 조항·결제는 회원만)·처리방침(비회원 표현·결제수단·v5 이전 파기·최소 기록·비회원 쿠키 행 삭제)·환불정책(시행일·이력 표시) 고침, 문서 버전 **2026-11-06.1**(변경 이력 기록), 시행일 임시 2026-11-07(배포 커밋에서 실제 날짜로). 재동의는 버전이 바뀌면 자동(재동의 전에도 산 책 열람 그대로 — 기존 `mayReadOwnedBooks`). 법률 검토 목록 갱신(`docs/v5/final4/legal-review.md` 첫 절, 질문 8개) | PASS(시험). 법률 검토 UNVERIFIED |

### G. 결제수단: 토스페이·카카오페이만
- 지금 고정된 곳: `BookCheckout.tsx` `easyPay: "TOSSPAY"` → `tossClientCheckoutLauncher.ts` `card: { flowMode: "DIRECT", easyPay }`(v2 결제창 `payment.requestPayment`, method CARD). 운영 화면엔 카카오페이가 없다. 토스 콘솔의 카카오페이 계약·키는 **확인하지 못함**(콘솔·키 페이지 접근 금지 — 덕짱님 확인).
- 토스 공식 문서 확인: 두 수단만 고르게 하는 방법은 **결제위젯**(v2 `tossPayments.widgets()`)에서 **결제 어드민 › 결제 UI › 결제수단 목록에 토스페이·카카오페이만 체크**하는 것뿐이다. 코드로 수단을 거르는 파라미터는 없다. 결제창(지금 방식)은 `easyPay`가 한 값뿐이라 불가.
  위젯은 **위젯 연동 키(gck/gsk 짝)**가 필요하고, 서버 승인 API(`/v1/payments/confirm`)는 같되 시크릿 키를 gsk로 바꿔야 한다.
  출처: https://docs.tosspayments.com/guides/v2/payment-widget/admin , https://docs.tosspayments.com/sdk/v2/js/payment-widget , https://docs.tosspayments.com/reference/using-api/api-keys
- 구현(코드는 키 종류를 보고 갈림 — **지금 키(ck)로 배포하면 동작 변화 0**): 클라이언트 키가 `test_gck_`/`live_gck_`면 우리 화면 「결제하기」 → 하단 시트 안에 토스 결제위젯(금액 먼저 설정 → 결제수단·약관 렌더 → 시트 안 「3,900원 결제하기」 → `widgets.requestPayment` → 기존 successUrl). 성공 리다이렉트 쿼리(paymentKey·orderId·amount)가 같아 **승인 금액 검사·중복 승인 방지 코드는 diff 0**. 시트를 닫으면 「결제를 취소했어요」.
- 시험: 키 분기 단위 시험 PASS(`tests/unit/perf/tossWidget.test.ts` — ck면 예전 결제창·토스페이, gck면 금액 → 수단·약관 → 시트 결제하기 → 서버가 준비한 주문번호·금액 그대로 요청, 시트 닫기 = 요청 없음). 토스 위젯 실제 렌더·수단별 시험 키 결제·카카오페이 앱 전환·인앱 브라우저는 **위젯 키가 없어 확인하지 못함(UNVERIFIED)**. 카카오페이는 문서용 공개 테스트 키로는 시험할 수 없다(토스 FAQ).
- 처리방침에 결제수단 제공사(토스페이 ㈜비바리퍼블리카·카카오페이 ㈜카카오페이) 문구 추가.

## 6. 회귀 확인
| 항목 | 결과 |
|---|---|
| 과거 Book 세 계열(v1·v2 옛 화면, v4, v5 2권) 열람 화면 | 기준 트리와 **바이트 동일 10/10**(휴대폰·데스크톱, 첫 화면 + 책 4쪽, `tools/perf/book-freeze.mjs`) — PASS |
| 팝업 ①②③ 판정 | 판정 함수(`selectPopup`) 변경 0, 시험 통과, 캡처 ①(비회원)·②(보상 B)·③(보상 A) — PASS |
| 결제 흐름 | 승인·확정(저장 금액 = 결제 금액, 중복 승인 방지)·환불·워커·크론 경로 **diff 0**. 결제 준비·실행의 변경은 A(비회원 거절)·E(이용권)·G(위젯 키 분기)뿐 |
| tsc · eslint · next build | 0 · 0 · 0(로컬 빌드, Vercel 방식 빌드(`VERCEL=1`, dev 라우트·legacy 뺌) 둘 다) |
| 전체 시험(31,648개) | 브랜치 실패 827 / 기준 863(기준은 두 트리 동시 실행 때 결과라 부하로 흔들린 61개 포함). 전체 실행에서 새로 보인 25개를 두 트리에서 단독 재실행 → 실제 차이 3개: `next.config.ts` 해시 고정 2개(설정을 되돌리고 배포 빌드 단계로 옮겨 해결), 서재 6상품 실제 생성 시험 1개(부하 때 30초 초과, 단독 27/27 통과). **신규 실패 0**. 의도한 동작 변경(비회원 결제 없음·상한·보너스·30일→11-30·만료 문구·결제 화면 장수)을 옛 규칙으로 검사하던 시험 20개 파일은 새 규칙으로 고침 |

## 7. 배포 순서(덕짱님 승인 뒤, P와 추가본을 한 번에)
1. 확인 SELECT(읽기 전용): `docs/v5/perf/deploy-counts.sql` — D 대상 수(이벤트·보상 gift_rewards, 원장 gift-self/claim/bonus·출시 뒤 수동, 캠페인·보상 기록, 누나 계정 5장), B 정리 예정 수. 결과 보관.
2. 적용 전 함수 본문 보관: `pg_get_functiondef` — ops_gift, ops_comp, ops_comp_campaign, report_tickets, paid_report_reliability(롤백용).
3. 운영 migration `20261107090000_v5_perf_event_tickets.sql`(C SQL·D 기한 당김·B 정리 보탬·책 소유 확인 함수) — 지난번과 같은 CLI 임시 폴더 방식(dry-run → `--yes`). NOTICE `PERF_D_BEFORE`·`PERF_D_UPDATED` 수가 1번 SELECT와 같아야 하고, 다르면 migration이 스스로 되돌린다(`PERF_D_COUNT_MISMATCH`).
4. 대상 수 확인: `select target,count(*) from ticket_expiry_adjustments group by 1`.
5. 코드: `v5/perf-01` → `v5/main` 병합 → `master` 병합(지난번 배포 직후 고친 migration 커밋 e95b1f54·2ad0af3f가 v5/main에 있어 함께 들어간다) → Production 배포. **지역 변경(icn1)은 이 배포와 함께 적용**(vercel.json). env 추가 없음.
6. 직후 확인(30분): 런타임 오류, 응답 헤더 `x-vercel-id`가 `icn1::icn1::…`, `/auth/library-home`의 `Server-Timing`, 서재·결제 화면, 선물 링크 만들기·받기(시험 계정), 팝업 ①②③, 만료일 「11월 30일까지」, 크론 5개(report-jobs 등) 정상, 만료 작업(`paid_report_reliability('expire')`) 오류 없음.
7. G(카카오페이)는 덕짱님이 위젯 키·어드민 설정을 마친 뒤 Vercel env 두 개만 바꿔 다시 배포(코드 변경 없음).

## 8. 롤백
- 코드·지역: Vercel 즉시 롤백 → 직전 Production `dpl_BLd5WA6kzHXaWnPL8uti2sQYf7qj`(지역 iad1로 같이 돌아감).
- DB는 예전 코드와 함께 써도 된다: 예전 코드가 보내는 `maxPerAccount`는 무시(상한 없음 유지), 'bonus'는 아무것도 주지 않음, 'list'·'use_self'·'link'·'claim'은 그대로.
- 기한 되돌리기(필요할 때만): `ticket_expiry_adjustments`의 `old_expires_at`으로 gift_rewards·comp 두 표 update, 원장은 같은 트랜잭션에서 `ticket_grants_immutable` 잠시 끄고 update 후 다시 켬.
- 함수 되돌리기: 2번에서 보관한 본문을 그대로 실행. `book_share_owned`는 남아도 무해(예전 코드는 안 부른다).

## 9. 덕짱님이 직접 할 일 · 결정할 것
직접 할 일
1. **토스**: 결제 어드민 › 결제 UI에서 결제수단을 토스페이·카카오페이만 체크(카드 체크를 끌 수 있는지 실제 화면 확인), 결제위젯 연동 키(gck/gsk) 발급 여부·카카오페이 계약 확인 → Vercel env `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`·`TOSS_PAYMENTS_SECRET_KEY`를 짝으로 교체.
2. 그 뒤 실결제: 토스페이 1건·카카오페이 1건(아이폰 사파리·안드로이드 크롬·카카오톡 인앱에서 앱 전환 후 돌아오기), 취소·실패 시 주문 상태, 1+1 이용권 발급, Meta InitiateCheckout·Purchase(3,900 KRW).
3. 누나 계정으로 결제 화면 5장 표시 → 1장 써서 책 발행 → 4장 확인, 선물 보내기·받기.
4. 인앱 브라우저(카카오톡·인스타그램)에서 카카오 로그인 → 결제 끝까지.
5. 운영 B 계정 1명·A 계정 1명·덕짱님·누나 계정으로 서재 화면 판정.

결정할 것
1. **환불 시 이용권 회수**: 지시 「결제가 환불돼도 이미 준 이용권은 회수하지 않는다(기존 결정)」와 기존 코드·약관(안 쓴 이벤트 이용권은 회수, 쓴 것은 회수 안 함)이 다르게 읽힌다. 지금은 **기존 동작 유지**. 안 쓴 것까지 회수하지 않으려면 환불 SQL 2곳·관리자 환불 경고 문구·약관을 바꾼다(남용 위험은 법률 검토 5번).
2. 문서 시행일(임시 2026-11-07)과 사전 고지 기간(불리한 변경 30일 여부 — 이용권 기한 단축·보너스 폐지), 법률 검토 8개 질문(`docs/v5/final4/legal-review.md`).
3. 자기 자신 받기 차단: 기존 차단을 유지했다(자동 받기라 없애면 보낸 사람이 자기 링크를 열기만 해도 이용권이 돌아온다). 없애길 원하면 알려 주세요.

## 부록
- 캡처(휴대폰·데스크톱): `docs/v5/perf/captures/` — library(이용권 있음)·library-zero(0장)·gift-sheet·gift-new·gift-member·gift-gone·checkout-tickets·checkout-zero·checkout-guest·inapp-login·home(상품 카드)·popup-1/2/3·expired·reconsent. 토스 결제 화면 안 수단 선택 캡처는 위젯 키가 없어 없음(UNVERIFIED).
- 측정 도구: `tools/perf/`(seed·cookies·env·serve.sh·sim.mjs·measure.mjs·capture.mjs·book-freeze.mjs).
- 새 시험: `tests/unit/perf/eventTickets.test.ts`(PGlite: C·D·E·F·B·소유 확인), `tests/unit/perf/libraryShelf.test.ts`.

---

## 단계 1 — P 배포 전 보완 + 운영 배포(2026-11-06)

판정 표기 PASS / PARTIAL / FAIL / UNVERIFIED. Anthropic·OpenAI 호출 0. 토스 API 호출 0. 결제·환불 0. 환경변수 변경 0.

### 1-1. 이용권 기한(결정 반영)
- migration `20261107090000` D 범위를 좁혔다.
  - 당김: 보상 캠페인(`comp_campaign_grants`) 수령자의 보상 이용권(`gift_rewards.kind='comp'`, 누나 계정 제외) + `comp_campaign_grants`·`comp_grants`의 기한 → 2026-11-30 23:59:59 KST. 원래 기한은 `ticket_expiry_adjustments`에 남는다.
  - 그대로: 누나 계정 `d0dd2e4e-…` 5장(캠페인 밖 개별 보상, 12-06 11:06 KST — 운영 확인 결과 `gift_rewards` comp 5장이었다. 예전 migration은 이것까지 당겼을 것), 관리자 수동 지급(오류 보상용 — 초안의 「기한 없이 들어온 지급도 11-30」 패치를 뺐다, 발급일 + 30일 유지), 원장 이용권(대상 0 → 원장 수정 막기 트리거를 끄는 단계도 없앰).
  - 멈춤 장치: 대상 중 하나라도 쓰였거나(상태≠available·used·claimed) 링크가 생겼으면(token·gifted) `PERF_D_TARGET_CHANGED`로 아무것도 바꾸지 않는다. 바꾼 수가 센 수와 다르면 `PERF_D_COUNT_MISMATCH`.
  - 새 발급: 1+1·보상은 코드가 넘기는 `ticketExpiresAt()` = 11-30 23:59:59 KST(그대로).
- 화면 기한: 서재 한 줄 = 지갑의 가장 빠른 기한(`wallet.expiresAt`, 기존), 팝업 ②③ = 그 계정 보상 이용권의 실제 기한(`comp.expiresAt`, 기존), **결제 화면에 새로** 「남은 이용권 N장 · M월 D일까지」(먼저 쓰는 장의 기한 `usableExpiresAt`).
- 시험(PGlite, 운영 모양 시드): 캠페인 이용권·기록 두 표만 11-30 / 누나 5장 12-06 11:06 그대로·지갑 5장·기한 12월 6일 / 관리자 지급·원장 그대로, 배포 뒤 관리자 지급 = 발급 + 30일 / 링크가 생긴 대상이 있으면 멈추고 아무것도 안 바뀜 — PASS.

### 1-2. 환불 때 이용권 회수
- 운영 함수 확인: 환불 경로는 둘(`ops_order('refund_finish')` 관리자·자동 환불, `ops_recon('external_refund')` 토스 상점관리자 환불 기록)이고 둘 다 이미 `status in ('available','gifted')`를 `revoked`·`token_hash=null`로 바꾼다. `gifted` = 링크를 만들었지만 아직 안 받은 이용권(token 있음·claimed 없음)이라 **추가 요구는 이미 동작 중**. 코드 변경 없음.
- 받는 화면: token이 지워져 링크 확인(peek)·받기(claim)가 `GIFT_NOT_FOUND` → 「기한이 지났거나 이미 받은 선물이에요」 한 줄(기존 `GiftClaim`).
- 새 시험 3건(PGlite): 관리자 환불 — 안 받은 선물 링크 회수·링크 무효·보낸 사람 지갑 0 / 관리자 환불 — 이미 받은 선물은 회수·차감 없이 `giftKept: "claimed"`만 / 외부 환불 기록 — 안 받은 선물 링크 회수 — PASS.

### 1-3. 친구 첫 결제 보너스
- 배포 직전(18:21 KST) 운영 선물 링크 수 **0개**(token·보냄·받음 모두 0, 이벤트 이용권 0장) → 삭제 그대로(SQL 'bonus'는 아무것도 주지 않음, 결제 뒤 호출 없음).

### 1-4. 약관·화면 「증정」
- 약관 「이용권」: 결제에 따른 무상 증정·판매 상품 아님 / 무상 증정이므로 현금 교환·환불 불가 / 결제 환불 시 그 결제로 받은 미사용 이용권(받지 않은 선물 링크 포함) 회수·링크 무효, 쓴 것·받은 선물은 회수 안 함 / 이용권으로 만든 책 오류 → 다시 만들거나 이용권을 다시 드림. 환불정책·주문서 짧은 줄도 같게. 처리방침 「지급」 → 「증정」.
- 약관 변경 이력 첫 줄이 「결제를 환불해도 이미 드린 이용권은 회수하지 않음」으로 조항과 어긋나 있던 것을 바로잡음.
- 화면: 메인 배너·팝업 ①②③·주문서 영수증 줄에서 「1+1」「한 권을 펼치면, 한 권이 더」「한 장을 더 드려요」를 빼고 「이용권 증정 EVENT · 한 권을 펼치면, 이용권 한 장 · 리포트를 결제하면 1건마다 이용권 1장을 증정해요」「이벤트 · 결제 후 이용권 1장 증정」으로.
- 문서 버전 `2026-11-06.1` 그대로(아직 배포 전 판), **시행일 2026-11-06(배포일)**. 불리한 변경 대상자 0명 근거: `docs/v5/final4/legal-review.md` 첫 절(39명 지급 뒤 로그인·세션·토큰 갱신 0, 사용 0, 링크 0, 이벤트 이용권 0, 선물 링크 0).

### 1-5. 결제수단(정정 지시 반영 — 위젯 키 취소)
- 결제 요청을 `method: "CARD"`(서버 어댑터 기존) + `card: { flowMode: "DEFAULT" }`(easyPay 없음)로. 토스 문서: DEFAULT = 카드·간편결제 통합결제창, DEFAULT에서는 easyPay를 넣어도 무시(https://docs.tosspayments.com/sdk/v2/js/payment). 키는 지금의 API 개별 연동 키 그대로, 새 환경변수 0.
- P에서 넣은 위젯 분기(gck 판별·결제위젯 시트·`TOSS_CLIENT_CHECKOUT_CANCELED`·CSS·시험)를 모두 걷어냄. 승인·확정·환불 경로 diff 0.
- **통합결제창에 계약한 수단만 보이는지는 토스 문서에 명시가 없다(UNVERIFIED)** — 덕짱님 실결제에서 카드 등 다른 수단이 보이면 보고만 하고 멈춘다.
- git 기록(토스페이만 뜨게 된 경위):

| 커밋 | 날짜(KST) | 결제 요청 |
|---|---|---|
| a6701673·047185f6·9a3bcf69 | 06-10~06-11 | 결제창 처음 연결. `method: "CARD"`, `flowMode: "DEFAULT"`를 넣었다가 바로 뺌(기본값 DEFAULT = 통합결제창) |
| **9aef88ad** | **09-24 08:32** | 「feat: add direct easy pay checkout」 — 공개 주문 화면(`/report/new`, `TossPaymentWidgetLauncher`)에 버튼 두 개 「토스페이로 결제」「카카오페이로 결제」, 요청 `card: { flowMode: "DIRECT", easyPay }` |
| 813cec8c | 10-02 02:36 | v4 책 주문서(`BookCheckout`) 추가, 미리보기 경로에 `easyPay: "TOSSPAY"` 고정 |
| **86a21eca** | **10-08 16:01** | 「fix: prepare v4 public launch」 — 공개 결제가 `BookCheckout`(버튼 「결제하기」 하나)로 옮겨가며 `runDevTossCheckout(…, { easyPay: "TOSSPAY" })` 고정 → **이때부터 토스페이만** |
| d770def4 | 10-10 19:22 | 가격 1,290원 → 1,490원(상품 표). **결제 요청(flowMode·easyPay)은 바꾸지 않음** |
| 이후 ~ a58d3426 | ~11-06 | `easyPay: "TOSSPAY"` 고정 유지(P에서 위젯 분기만 추가 → 이번에 제거) |

  1,290원 시기 카카오페이 3건(상점관리자)은 09-24~10-08의 두 버튼 화면에서 난 것으로 보인다(커밋 기준 — 각 커밋의 운영 배포 시각은 대조하지 않음).

### 1-6. 지역 변경 사전 확인(외부 서비스 허용 IP)
콘솔 화면은 열지 않고 공식 문서와 코드로만 확인(콘솔 실제 설정은 UNVERIFIED).

| 서비스 | 허용 IP 기능 | icn1 이동 영향 |
|---|---|---|
| Vercel | 기본 함수의 나가는 IP는 공유·순환(고정 아님). 고정 IP는 유료 Static IPs(지역마다 IP 쌍) | 프로젝트 정보(Vercel API)·저장소에 Static IPs 흔적 없음(설정 화면 직접 확인은 UNVERIFIED) → 해당 없음 |
| 토스페이먼츠 | 상점 → 토스 API를 상점 IP로 막는 기능은 문서에 없음(토스가 공개하는 IP 목록은 웹훅 발신용 = 반대 방향) | 없음 |
| 카카오 | 키별 「호출 허용 IP 주소」(등록했을 때만 적용) | 카카오 로그인은 Supabase Auth가 카카오와 주고받음(콜백 `…supabase.co/auth/v1/callback`), 연결 끊기(`kapi.kakao.com/v1/user/unlink`)는 우리 함수가 부름 → 허용 IP를 켰다면 지금도 실패 중이어야 함(아래 논리) |
| Meta | 앱 「Server IP Allowlist」(앱 시크릿으로 부르는 Graph API) | 같은 논리로 영향 없음 |
| Anthropic | 조직 IP allowlisting(관리자가 켜야 함) | 같은 논리 |
| OpenAI | 조직·프로젝트 IP allowlist(켜야 함) | 같은 논리 |
| Supabase | Network Restrictions는 Postgres·풀러 직접 접속에만 적용, PostgREST·Auth·supabase-js(HTTPS)에는 미적용 | 함수는 supabase-js만 씀 → 영향 없음 |

논리: 지금(iad1)도 함수의 나가는 IP가 계속 바뀌므로, 어느 서비스든 허용 IP가 켜져 있었다면 이미 간헐 실패가 났어야 한다. 정상으로 돌고 있으므로 icn1로 옮겨 IP 때문에 새로 깨질 곳은 없다(Static IPs를 쓰는 경우만 예외). 출처: vercel.com/kb/guide/how-to-choose-the-right-vercel-networking-option, vercel.com/docs/networking/static-ips, docs.tosspayments.com/reference/using-api/network-requirements, developers.kakao.com/docs/latest/ko/app-setting/app, developers.facebook.com/documentation/facebook-login/security, platform.claude.com/docs/en/manage-claude/ip-allowlist, developers.openai.com/api/docs/guides/ip-allowlist, supabase.com/docs/guides/platform/network-restrictions.

### 1-7. 검증
| 항목 | 결과 |
|---|---|
| tsc · eslint(전체) · next build | 0 · 0 · 0 |
| Vercel 방식 빌드(Preview `dpl_2qtzrRYdemehPNJimYp1Nsi1vwFM`, 7d385267, dev 라우트·legacy 뺌) | READY, 지역 icn1 |
| 전체 시험 | 브랜치 31,646개 중 실패 827 / 기준(2ad0af3f) 31,624개 중 실패 829. 이름 단위 대조 새 실패 후보 3개 → 단독 재실행: `protected-staging/isolation` 2개는 **기준 트리도 단독 실패**(전체 실행 땐 부하로 skipped), `account/library` 6상품 실제 생성은 단독 27/27 통과(부하 시간 초과, P 때와 같음). **새 실패 0** |
| 바뀐 시험 | 결제 요청(DEFAULT·easyPay 없음) 4파일, 문구(증정·이용권 재지급·시행일) 7파일, PGlite D·환불 회수(eventTickets 19개), 위젯 시험 삭제 |
| migration 앵커 | 적용 전 보관한 운영 본문에서 패치 앵커 8개 모두 정확히 1번(순서대로) |
| 기존 오류 | `DevTossCheckoutLauncher`「1,290원」 기대 1건 — 기준 트리도 같은 실패(가격 변경 전 문구) |

### 1-8. 배포
| 단계 | 결과 |
|---|---|
| ① 대상 수(18:21 KST) | 보상 캠페인 이용권 **42장·39명·사용 0·링크 0**, `comp_campaign_grants` 39·`comp_grants` 39, 누나 5장(12-06 11:06·available), 이벤트 이용권 0, 선물 링크 0 — 기대값과 같음 |
| ② 함수 본문 보관 | `docs/v5/perf/rollback/*.before-20261107090000.sql`(ops_gift·ops_comp·ops_comp_campaign·paid_report_reliability·report_tickets, md5 기록). 적용 직전 md5 재확인 같음 |
| ③ migration | `20261107090000` CLI 임시 폴더 방식(dry-run 대기 1건 → 적용) **18:22:39~46 KST** |
| ④ 적용 뒤 | `ticket_expiry_adjustments`: gift_rewards **42**·comp_campaign_grants **39**·comp_grants **39**(원래 12-06 10:34 → 11-30 23:59:59 KST). 남은 대상 0. 누나 5장 12-06 11:06 그대로. 원장 수정 막기 트리거 켜짐. 적용 뒤 운영 DB 오류 0, 만료 작업 RPC 200 |
| ⑤ 병합 | `v5/perf-01` 756e0168 → `v5/main` merge **3f1915a7** → `master` merge **468f4b40**. 트리 셋 다 `316dec5c`(= 시험한 브랜치). 지난번 고친 migration 커밋(e95b1f54·2ad0af3f)·20261106200000 파일이 master에 함께 들어감 |
| ⑥ Production | **`dpl_EGrjYckryQCDc5pSZP3rcgDF9Zg5`** · master 468f4b40 · READY 18:26:40 KST · 별칭 www.gyeolreport.com·gyeolreport.com · aliasError 없음 · 지역 icn1 |
| 롤백 기준 | 오류 증가·결제 화면 깨짐이면 `dpl_BLd5WA6kzHXaWnPL8uti2sQYf7qj`로 즉시 되돌림(DB는 예전 코드와 호환 — 위 8절) |

### 1-9. 배포 뒤 30분 확인(18:26:40 → 18:57 KST)
| 항목 | 결과 | 판정 |
|---|---|---|
| 런타임 오류(Vercel) | 0건(배포 뒤·24시간 모두) | PASS |
| 5xx(관측 쿼리, 08:00~10:00 UTC) | 0건 | PASS |
| 운영 DB 오류(postgres_logs, migration 뒤) | 0건(`is ambiguous` 포함). Supabase 호출 196건 전부 200 | PASS |
| `x-vercel-id` | 동적 경로 전부 `icn1::icn1`(배포 전 `icn1::iad1`) | PASS |
| 크론 | report-jobs·report-ticket-jobs 매분 200, ops-jobs·meta-events·report-writer-recovery 5분마다 200. 만료 작업 `paid_report_reliability` 200(48회/20분), 이용권 보조 발급 `ops_gift` 200(ops-jobs마다) | PASS |
| 결제 화면 진입(지금 키) | `/report/new?product=saju_mbti_full` 200. 운영 JS 묶음에 `flowMode:"DEFAULT"` 있음·`flowMode:"DIRECT"` 없음·위젯 코드 없음(배포 전은 반대). 토스 결제창 실제 화면은 실결제 때 | PASS(코드) / UNVERIFIED(결제창 화면) |
| 팝업·배너 | `/auth/event-popup`: 진행 중, 이용권 기한 2026-11-30T14:59:59Z(= 11-30 23:59:59 KST). JS 묶음에 「이용권 증정 EVENT」「이벤트 · 결제 후 이용권 1장 증정」 있음, 「한 권이 더」「1+1 · 결제 후」 없음 | PASS |
| 선물 받는 화면 | 없는 링크 → `GIFT_NOT_FOUND`(화면 「기한이 지났거나 이미 받은 선물이에요」) | PASS |
| 누나 계정 5장 | DB: 보상 5장 available·기한 12-06 11:06·조정 기록 0 → 서재·결제 화면 값 「5장 · 12월 6일까지」. 화면 눈 확인은 로그인 필요 | PASS(값) / UNVERIFIED(화면) |

운영 실측(Claude Code 회선, 비로그인, 첫 1회 버리고 3회 중앙값 TTFB ms):

| 경로 | 배포 전(iad1, 1회) | 배포 뒤 3회 | 중앙값 | 경유 |
|---|---|---|---|---|
| `/`(엣지 캐시) | 54 | 152/154/125 | 152 | icn1 |
| `/example`(책 화면, 엣지 캐시) | 46 | 145/153/127 | 145 | icn1 |
| `/auth/session` | 278 | 154/140/140 | 140 | icn1::icn1 |
| `/auth/event-popup` | 244 | 148/162/181 | 162 | icn1::icn1 |
| `/api/gift-event` | 246 | 145/134/152 | 145 | icn1::icn1 |
| `/auth/library-home`(서재 API, 비로그인 401) | 250(404, 예전 코드엔 없음) | 139/130/145 | 139 | icn1::icn1 |
| `/login` | 263 | 178/230/142 | 178 | icn1::icn1 |

- 배포 뒤 이 회선 자체가 흔들렸다(같은 때 google 첫 바이트 401ms, vercel.com 연결 101ms). 그래서 절대값보다 **같은 회차의 「함수 경로 − 엣지 캐시 경로」**를 본다: 배포 전 `/auth/session`이 엣지보다 **+224ms**(278−54, 미국 왕복), 배포 뒤 **약 −12ms**(140−152) → 함수 왕복이 사라짐.
- 브라우저(헤드리스 크롬 390×844, 3회 중앙값): 책 화면 `/example` 첫 내용 287ms, 메인 143ms, 서재 비로그인 화면 478ms.
- **로그인 서재 첫 표시·내 책 열기 운영 실측은 UNVERIFIED** — 운영 계정 세션이 없어 재지 못했다(로컬 모델 수치는 위 3절: 서재 1,684→145ms, 책 v5 1,582→84ms). 덕짱님이 로그인한 브라우저 개발자 도구에서 `/auth/library-home` 응답의 `x-vercel-id`(icn1::icn1)·`Server-Timing`(auth·data)을 보면 확인된다.

### 1-10. 결제 준비 상태(ready)로 남은 주문(11-06 09:00 이후, 개인정보 없이)
| 생성(KST) | 상품·금액 | 계정 | 결제키 | 결제창 복귀(/payments/*) |
|---|---|---|---|---|
| 11:10:52 | 종합 3,900원 | 덕짱님 계정 | 없음 | 없음 |
| 11:16:38 | 종합 3,900원 | 덕짱님 계정 | 없음 | 없음 |
| 17:27:12(추가로 생김) | 종합 3,900원 | 누나 계정 | 없음 | 없음 |

- 세 건 모두 결제 준비(`/api/payment-checkout/prepare` 200, 관측 쿼리로 같은 분에 1건씩)까지 됐고, 그 뒤 성공·실패·취소 복귀 요청은 하루 내내 0건 → 토스 쪽으로 넘어간 뒤 결제 없이 창을 닫은 것으로 보인다.
- 「결제수단 화면」 진입 여부는 우리 서버에 기록이 없어 **UNVERIFIED**: 그때 코드는 `flowMode: "DIRECT"` + `easyPay: "TOSSPAY"`라 결제수단 고르는 화면 없이 토스페이로 바로 갔다. 결제창이 열릴 때 보내는 InitiateCheckout은 브라우저 픽셀로만 가고 서버 대기열(`meta_conversion_outbox`)은 11-05 이후 0행. 토스 API 조회는 지시대로 하지 않음.

### 1-11. 덕짱님이 하실 일
1. **실결제 2건**(토스페이 1·카카오페이 1): 결제창에 **토스페이·카카오페이 두 수단만** 보이는지. 카드 등 다른 수단이 보이면 그 화면만 알려 주세요 — 보고만 하고 멈춥니다(통합결제창이 계약 수단만 보이는지는 토스 문서에 없음).
2. 결제 뒤 Claude Code가 확인할 것: 승인 금액 = 3,900원(주문 저장 금액과 대조), 1+1 이용권 1장 발급(기한 11-30 23:59:59 KST), Meta Purchase(3,900 KRW).
3. 누나 계정으로 서재·결제 화면에 「리포트 이용권 5장 · 12월 6일까지」가 보이는지(값은 DB로 확인함).
4. 로그인한 상태에서 서재를 열고 `/auth/library-home` 응답 헤더(`x-vercel-id`·`Server-Timing`)를 한 번 봐 주시면 운영 실측 UNVERIFIED가 풀립니다.

### 1-12. 남은 위험·참고
- 이 단계 보고 커밋(마지막 문서)은 `v5/perf-01`·`v5/main`에만 있다(코드 변경 없음, master에 넣으면 운영이 다시 배포되므로 다음 master 병합 때 함께).
- 예전 두 버튼 화면(`TossPaymentWidgetLauncher`, `/report/new` 옛 경로)의 「토스페이로 결제」「카카오페이로 결제」 문구는 그대로 남아 있다(공개 결제는 `BookCheckout`). 두 버튼 모두 같은 통합결제창을 연다.
- `compMessages.ts`의 「11월 30일까지」 고정 문구는 화면에서 쓰지 않는 파일이라 두었다.
- 선물 창(`GiftSheet`)의 「M월 D일까지」는 지갑 전체 가장 빠른 기한이라, 원장 이용권이 더 빨리 끝나면 선물하는 장의 기한과 다를 수 있다(이번 범위 밖, 지금 운영 데이터엔 해당 계정 없음).
