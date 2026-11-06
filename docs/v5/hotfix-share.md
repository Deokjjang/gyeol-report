# [긴급] 리포트 공유 수정 — 카카오톡 공유·링크 복사·공유하기 (hotfix-share)

브랜치 `v5/hotfix-share-01` (기준 `origin/master` 468f4b40 = 운영 dpl_EGrjYckryQCDc5pSZP3rcgDF9Zg5). worktree `~/Developer/gyeol-worktrees/v5-hotfix-share`.
운영 DB는 읽기만 했다(SELECT와 읽기 전용 함수. 쓰기 0). 결제·환불·워커·원고 생성 코드, 환경변수, migration은 바꾸지 않았다. Anthropic·외부 API 호출 0.
판정 표기: PASS / PARTIAL / FAIL / UNVERIFIED.

## 0. 요약

| 질문 | 답 | 근거 |
|---|---|---|
| 새 링크 생성이 전부 깨졌나 | **아니다.** V4 책은 서버에서 새 링크 발급이 된다 | 옛 코드(468f4b40)로 같은 시험을 돌리면 V4는 발급·재사용·거절 모두 통과(§1-5) |
| v5만 깨졌나 | **그렇다(서버).** v5 책은 공유 API가 무조건 404 | `shareServer.ts:57` `productVersion === "v4"`가 아니면 `V4_REQUIRED` → 404. 운영 404 10건(§1-2) |
| 아이폰 사파리 복사만 깨졌나 | **따로 하나 더 깨져 있었다(화면).** V4 책도 아이폰에서 첫 「링크 복사」는 복사가 막혔다 | 링크를 받은 **뒤(await fetch 뒤)** 클립보드를 써서 WebKit이 `NotAllowedError`로 막음 → 수동 복사 칸(§1-5). 맥 크롬은 클릭 뒤 몇 초를 허용해서 됐다 |
| 버튼이 사라지며 문구만 뜨는 화면 | `BookShareActions.tsx:37` 403·404면 `setDenied(true)` → `:62` `!denied && …`가 버튼 3개를 지우고, 「이 책 공유하기 / 링크를 받은 사람은 책 전체를 읽을 수 있습니다. / 공유 권한 또는 책의 상태를 확인해 주세요.」만 남긴다 | 옛 코드 브라우저 재현: v5 책은 세 버튼 모두 버튼 3→0, 클립보드는 예전 유튜브 주소 그대로(§1-5) |
| 받는 사람 쪽 | v5 링크가 있었다면 그것도 안 열렸다 | `/r/[token]/page.tsx:353` v4만 책 표지로, v5는 구매자 확인 화면으로 보냄. `loadBookShare`도 v4만(`shareServer.ts:16`) |
| 언제부터 | **v5 출시 배포(dpl_BLd5…, 11-06 09:55 KST)부터**(잠복 결함). 단계 1 배포(18:24)는 원인 아님. 첫 v5 책은 20:13:27이라 실제 증상은 20:13 이후 | §2 |

고친 내용: 서버는 V4·v5 책 모두 주인에게만 링크를 만든다. 같은 책은 같은 링크이고, 추천(referral) 저장소와는 끊었다. 받는 사람은 v5도 로그인 없이 연다.
화면은 공유 칸이 열릴 때 링크를 미리 받아 두고, 버튼을 누른 순간 클릭 안에서 바로 복사·카카오·공유하기를 부른다. 어떤 실패에도 버튼은 남고, 실제로 된 경우에만 된 것처럼 말한다.

## 1. 원인 (증거)

### 1-1. 호출 경로 (옛 코드 468f4b40 기준 파일:줄)

1. 책 마지막 쪽 `src/components/book/BookReading.tsx:84` → 주인이면 `<BookShareActions owner={shareOwner}>`(주인 표시는 `src/app/reports/[reportId]/page.tsx:1574` 이용권 책, `:1650` 결제 책)
2. 버튼 클릭 → `src/components/book/BookShareActions.tsx:35` `await fetch("/api/book-share", {reportId})`
3. `src/app/api/book-share/route.ts:11` → `prepareBookShare(…, createReferralStore())`
4. `src/lib/book/shareServer.ts:55` 소유 확인 `mayShareBook` → `src/lib/sharing/reportShareStore.ts:31` `book_share_owned`(운영 SQL은 `referral_publication`의 owner)
5. `shareServer.ts:56-57` `issuePublishedReportShare(reportId, (p,d,e) => d.productVersion === "v4" ? validateBookPublication(…) : {ok:false, errors:["V4_REQUIRED"]})`
6. `reportShareStore.ts:91` `loadShareablePublication` → `:72` 위 검사 → v5면 실패 → `:97` `port.insert`(= `report_share_links` upsert, `:44`)에 **닿지 않음**
7. `shareServer.ts:58` `if (!result.ok) return json({}, 404)` → 화면 `BookShareActions.tsx:37` 404 → `setDenied(true)` → `:62` 버튼 제거
8. (V4일 때) 200 → `shareServer.ts:61` `attachReferral`(초대 토큰 `?ref=` 생성) → 화면 `:47` 복사는 `await fetch` 뒤 `copy()` → `:25` `copyShareLink`

### 1-2. 운영 로그 (Vercel 관측 데이터, `/api/book-share`, 응답 코드별)

런타임 로그(`get_runtime_logs`)는 이 기간에 아무 줄도 돌려주지 않았다(보존 기간 밖이거나 로그 줄이 없음). 그래서 요청 관측(`vercel.request.count`)으로 셌다.

| 배포 | 기간 | 200 | 404 | 403 |
|---|---|---|---|---|
| dpl_CHjqN89… (10-18 배포) | 10-20~ | 6 | 0 | 0 |
| dpl_BSFgg… (10-28 19:43) | ~10-29 | 5 (= 10-29 링크 3개 생성 등) | 0 | 0 |
| dpl_CFiY…·dpl_84CW… (10-29) | 10-29~11-06 09:55 | 0 | 0 | 0 |
| dpl_BLd5… (v5 출시 11-06 09:55) | 09:55~18:24 | 0 | 0 | 0 |
| **dpl_EGrj… (단계 1, 11-06 18:24)** | 18:24~21:00 | **1** | **10** | 0 |

1분 단위(KST): 404가 **20:24(1)·20:25(2)·20:26(2)·20:27(1)**. 누나 카카오페이 결제 20:20:45 → 책 발행 뒤 세 버튼을 누른 시각과 맞다. 그 뒤 **20:43(1)·20:44(1)·20:45(2)** 에 404, **20:45에 200 1건**(맥북 V4 책. 운영 DB에 10-29 뒤 새 링크가 없으므로 기존 링크를 다시 쓴 것).
403은 0건이다. 소유 확인은 통과했고, 그 다음 단계(버전 검사)에서 404가 났다는 뜻이다.

### 1-3. 운영 DB (읽기 전용)

- `report_share_links` 마지막 생성 2026-10-29 15:46 KST, 모두 V4.
- 11-06 책 2권 모두 `productVersion = v5`, `gate_version = paid-report-v1`, 발행·열람 기한 정상, 계정 연결 1개, `referral_publication(...) is not null` = 참, 링크 0개.
  - `report_16c003fe…`(20:20:45, 결제, 누나 계정): `book_share_owned(report, d0dd2e4e…)` = **참**, `paid_report_reliability('read_report')` = COMPLETED
  - `report_51eaea87…`(20:13:27, 이용권): `book_share_publication(report, null).ok` = 참
- → **DB 쪽 소유·발행 조건은 v5 책을 모두 통과**한다. 거절은 TS의 `V4_REQUIRED` 한 곳이다.
- (확인) `read_report` 분기는 SELECT만 한다(함수 본문 확인). 이 조회로 바뀐 행은 없다.

### 1-4. 확인 항목 a~f

| 항목 | 판정 | 근거 |
|---|---|---|
| a. P 빌드 제외 목록에 공유 API가 들었나(운영 404?) | **아니다** | `scripts/build/deploy-strip.mjs`는 `src/app/dev`·`src/app/api/dev`의 진입 파일과 `knowledge-v5/legacy`만 뺀다. `/api/book-share`는 `src/app/api`. 같은 배포(dpl_EGrj)에서 200이 1건 나왔다(라우트 있음). 404는 라우트 없음이 아니라 `shareServer.ts:58`의 404 |
| b. 자격 확인이 v5·P 소유 확인과 안 맞나 | **소유 확인은 맞다. 상품·버전 조건이 틀렸다** | P의 `book_share_owned`는 누나 v5 책에 참(§1-3). 403 0건. 버전 조건 `productVersion === "v4"`(10-03 9c9114be부터)가 v5를 404로 막음 |
| c. 친구 보너스 삭제로 추천 경로가 끊겼나 | **이번 고장의 원인은 아니다.** 다만 공유가 추천에 기대고 있었다 | 404는 추천 단계(`:61`) 전에 났다. V4 200 경로는 매번 `attachReferral`로 `referral_invites`에 행을 쓰고 `?ref=`가 붙은 새 URL을 줬다(같은 책도 누를 때마다 URL이 달라짐). 보너스 삭제(P 추가 C)·이벤트 종료(10-31) 뒤에는 의미 없는 의존 → 끊음 |
| d. 비동기로 받은 뒤 클립보드에 쓰나 | **그렇다(옛 코드)** | `BookShareActions.tsx:35`에서 `await fetch` 후 복사 모드는 `:47`로 바로 `copy()` → 클릭 밖. 옛 코드 WebKit(iPhone 13) 재현: `writeText`가 클릭 밖에서 불려 `NotAllowedError`, `execCommand` 거짓 → 수동 칸(§1-5) |
| e. 카카오 SDK 초기화·비동기 뒤 호출 | **SDK는 들어 있다. 첫 누름은 「한 번 더 눌러 주세요」로 미뤘다** | 운영 환경변수에 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`(Production) 있음(이름만 확인, 값 안 봄). SDK는 `afterInteractive`+`onReady` 초기화. 옛 코드는 링크를 받은 뒤 카카오·공유하기를 바로 부르지 않고 두 번째 누름을 요구했다(`:40-42`). v5는 그 전에 404라 카카오 창이 아예 안 떴다 |
| f. 실패해도 성공처럼 보이거나 버튼이 사라지는 상태 | **버튼이 사라졌다** | `:37` 403·404 → `denied` → `:62` 버튼 0개. 문구 「공유 권한 또는 책의 상태를 확인해 주세요.」(재현 §1-5). 성공처럼 보이는 경우: `:53` 카카오 `sendDefault` 직후 「카카오톡 공유창을 열었습니다.」(완료 확인 없이) |

### 1-5. 재현 — 옛 코드(468f4b40)

**SQL 시험**(이번에 만든 `tests/unit/sharing/bookShareV5.test.tsx`를 옛 트리에 넣어 실행): 9개 중 6개 실패, V4 3개 통과.
- V4 이용권 책: 주인 200·같은 링크·다른 계정/비로그인 403·받는 사람 열기 → **통과**
- v5 이용권 책·v5 결제 책: `expected 404 to be 200` → **실패**
- 받는 사람(v5), v5 표지 이름, 추천 분리 → 실패

**브라우저**(로컬 개발 흐름 `/dev/book-flow` + PGlite, 실제 결제 경로로 만든 책, Playwright 1.56 Chromium·WebKit. 옛 트리에는 v5 책 만들기 옵션 파일 2개만 잠시 넣었다가 되돌림)

| 화면 | 책·버튼 | 공유 API | 버튼 수 | 문구 | 클립보드 |
|---|---|---|---|---|---|
| Chromium 데스크톱 | V4 · 링크 복사 | 200 | 3→3 | 복사됨 | 새 링크(쓰기는 클릭 **밖**이지만 크롬이 허용) |
| Chromium 데스크톱 | v5 · 링크 복사/카카오톡/공유하기 | 404 | **3→0** | 공유 권한 또는 책의 상태를 확인해 주세요. | **예전 유튜브 주소 그대로** |
| WebKit iPhone 13 | V4 · 링크 복사 | 200 | 3→3 | 자동 복사에 실패했습니다… | 쓰기 클릭 **밖** → `NotAllowedError`, 수동 칸 |
| WebKit iPhone 13 | v5 · 링크 복사/카카오톡/공유하기 | 404 | **3→0** | 공유 권한 또는 책의 상태를 확인해 주세요. | 쓰기 시도 0 |

→ 덕짱님 제보(세 버튼 모두 버튼이 사라지며 문구만, 붙여넣으면 예전 내용)와 같다.

## 2. 언제부터 깨졌나

- 2026-10-03 9c9114be: 공유 API를 「책(V4)만」으로 만듦(`V4_REQUIRED`). 그때는 V4 책만 있어서 문제가 없었다.
- 2026-10-12 686641b0: 화면 구조(링크 받기 → 복사는 바로, 카카오·공유하기는 「한 번 더」, 403·404면 버튼 제거). 아이폰 첫 복사 실패는 이때부터 잠복(V4 포함).
- 2026-11-04 4de62cbb(P6d-ops) 등: v5 책을 V4와 같은 열람 화면(공유 버튼 포함)으로 열게 함. 공유 API는 v5로 넓히지 않음 → **잠복 결함**.
- **2026-11-06 09:55 v5 출시 배포(dpl_BLd5…, e58fc21a)**: 운영에서 v5 책이 생기기 시작 → 이때부터 v5 책 공유는 404.
- 2026-11-06 18:24 단계 1 배포(dpl_EGrj…, 468f4b40): 공유 관련 변경은 `sharePort.owned`를 `book_share_owned`로 가볍게 한 것(판단은 같음, 누나 책에 참)과 `/r` 만료 화면뿐. `V4_REQUIRED`는 그대로 → **원인 아님**.
- 첫 v5 책 20:13:27(이용권) → 첫 관측 404 20:24.

## 3. 원인 확정용 확인표

「API」 = 공유 링크 API 응답 코드(브라우저는 개발 모드라 공유 칸이 열릴 때 React StrictMode가 effect를 두 번 돌려 200이 2번 찍힌다. 운영 빌드는 1번이다). 「복사」 = 링크 복사 버튼의 결과.
기기 칸은 실제 기기가 아니라 엔진 대응이다. 맥 크롬 = Chromium 데스크톱, 맥 사파리 = WebKit 데스크톱, 아이폰 사파리 = WebKit + iPhone 13 화면·터치. 실제 기기 확인은 §7 덕짱님 순서로 한다.

### 3-1. 고치기 전(468f4b40)

| 책 | 기존 링크 | 기기 | 결과 |
|---|---|---|---|
| V4 책(링크 있음) | 있음 | 맥 크롬 | API 200 · 복사 됨(클릭 밖이지만 허용) — 덕짱님 맥북 성공과 같음 |
| V4 책(링크 있음) | 있음 | 아이폰 사파리 | API 200 · **복사 막힘**(`NotAllowedError`) → 수동 칸 |
| V4 책(링크 없음, 10-30·31 생성분과 같은 조건) | 없음 | 맥 크롬 / 사파리 / 아이폰 | API 200(새 링크, SQL 시험) · 복사는 위와 같음(크롬 됨, 아이폰 막힘) |
| v5 결제 책 | 없음 | 맥 크롬 / 아이폰 사파리 | **API 404 · 버튼 3→0 · 클립보드 그대로(예전 내용)** |
| v5 이용권 책 | 없음 | (SQL 시험) | **API 404** — 브라우저는 결제 책과 같은 화면 분기 |

맥 사파리(WebKit 데스크톱)의 옛 코드 칸은 따로 돌리지 않았다(UNVERIFIED). 엔진이 같은 아이폰 칸과 같은 정책이 적용된다고 본다.

### 3-2. 고친 뒤(이 브랜치) — 실제로 돌린 칸

| 책 | 기존 링크 | 기기 | API | 복사(클릭 안 호출 · 결과 · 클립보드) | 복사 실패 시 | 카카오(모의) | 받는 사람(쿠키 0) |
|---|---|---|---|---|---|---|---|
| V4 책 | 없음 → 새 링크 | 맥 크롬 | 200 | 클릭 안 · 성공 · **새 링크**(예전 유튜브 주소를 덮음) | 수동 칸 = 같은 링크 | 같은 URL | 열림 |
| V4 책 | 있음 → 다시 쓰기 | 맥 크롬 | 200(같은 링크) | 클릭 안 · 성공 · 새 링크 | 수동 칸 | 같은 URL | 열림 |
| v5 결제 책 | 없음 → 새 링크 | 맥 크롬 | 200 | 클릭 안 · 성공 · 새 링크 | 수동 칸 | 같은 URL | 열림 |
| V4 / V4(다시) / v5 결제 | 위와 같음 | 크롬 모바일(Pixel 7) | 200 | 클릭 안 · 성공 · 새 링크 | 수동 칸 | 같은 URL | 열림 |
| V4 / V4(다시) / v5 결제 | 위와 같음 | 맥 사파리(WebKit) | 200 | 클릭 안 · `writeText` 성공(resolve) | 수동 칸 | 같은 URL | 열림 |
| V4 / V4(다시) / v5 결제 | 위와 같음 | 아이폰 사파리(WebKit iPhone 13) | 200 | 클릭 안 · `writeText` 성공(resolve) | 수동 칸 | 같은 URL | 열림 |
| v5 이용권 책 | 없음 → 새 링크 | (SQL 시험) | 200 · 같은 링크 재사용 · 남 403 | 화면은 결제 책과 같은 컴포넌트·같은 응답 모양 | — | — | 열림(SQL 시험의 `/r/[token]` 렌더) |

WebKit은 Playwright에서 클립보드 읽기 권한을 줄 수 없어서 읽어 보지 않았다. 대신 「클릭 처리 안에서 `writeText` 호출 + 결과가 resolve」를 기록했다. 옛 코드는 같은 기록이 「클릭 밖 + reject(NotAllowedError)」였다.
v5 이용권 책은 로컬 개발 DB에 이용권 큐가 없어서 브라우저로는 돌리지 않았다. API는 SQL 시험으로 PASS, 브라우저 칸은 UNVERIFIED(화면 코드 경로는 결제 책과 같다).

## 4. 고친 내용

서버
- `src/lib/book/shareServer.ts`
  - `isShareableBookVersion`(v4·v5)과 `validateShareableBook`: 책 버전이면 저장 버전에 맞는 검사기(`validateBookPublication`: v5 → `validateV5Publication`, V4 → `validateV4Publication`)를 쓴다. V3 등 책이 아닌 저장본은 계속 거절한다.
  - `loadBookShare`: v5도 공유 모델을 만든다. 표지 이름·연도는 v5 근거의 첫 사람·제목 연도로, 주인 열람 화면(`storedBook`)과 같다(궁합은 V4처럼 첫 사람만).
  - `prepareBookShare`: 추천 인자 제거. 주인 확인(`mayShareBook`, 그대로) → `report_share_links` 하나(report_id 고유, 동시 클릭도 같은 링크) → 모델만 돌려준다. `?ref=` 초대 토큰과 `referral_invites` 쓰기는 하지 않는다.
- `src/app/api/book-share/route.ts`: 추천 저장소(`createReferralStore`)를 만들지도 넘기지도 않는다.
- `src/app/r/[token]/page.tsx`: v5 링크도 로그인 없이 표지 → 「책 펼치기」(`/r/[token]/book-data`)로 연다. 예전 초대 링크(`?ref=`)는 추천 확인이 실패해도 같은 책을 연다(`.catch`).
- `book-data`·`book-og` 라우트는 `loadBookShare`를 쓰므로 함께 v5를 연다(파일 변경 없음).

화면 — `src/components/book/BookShareActions.tsx`(다시 씀), `bookShare.module.css`(+1줄)
- 공유 칸이 열릴 때(책 마지막 쪽) 링크를 한 번 미리 받는다. 받는 동안 버튼 3개는 **보이되 잠김**, 문구 「공유 링크를 준비하고 있어요.」
- 버튼을 누르면 앞에 `await` 없이 클릭 처리 안에서 바로 부른다.
  - 링크 복사: `navigator.clipboard.writeText`(없거나 throw면 같은 클릭 안에서 선택 복사). **실제로 성공했을 때만** 「링크를 복사했어요.」 실패하면 링크를 선택 가능한 칸(16px, iOS 확대 방지)에 보여 주고 「길게 눌러 복사해 주세요.」
  - 카카오톡: 미리 받은 링크로 `Kakao.Share.sendDefault`. SDK가 없거나 throw면 공유하기 → 그것도 없으면 링크 복사. 문구는 「카카오톡을 여는 중이에요.」(완료라고 말하지 않음)
  - 공유하기: `navigator.share`가 없으면 링크 복사. 취소(AbortError)는 아무 말도 하지 않음. 그 밖의 실패는 링크 복사. 실제 완료 때만 「공유했어요.」
- 미리 받기 실패(403·404·503·네트워크)에도 버튼은 남는다. 문구는 403(주인 아님, 또는 주인이지만 현재 약관 미동의 — 링크 발급은 현재 약관 동의 회원만이라는 기존 정책 그대로)이면 「공유하려면 이 책을 산 계정으로 로그인하고 약관 동의를 마쳐 주세요.」, 그 밖은 「공유 링크를 만들지 못했어요. 버튼을 다시 눌러 주세요.」 누르면 다시 받고, 다음 누름에서 공유한다(없는 링크를 복사하지 않음).
- 연타 방지(받는 중 요청 1개)와 마지막으로 누른 동작만 문구를 바꾸는 규칙(늦게 끝난 앞 동작이 뒤 결과를 덮지 않음).
- 받는 사람 화면(공유받은 책 끝 쪽)은 링크가 이미 있어 요청 없이 바로 쓸 수 있다.
- 이벤트 안내(`BookEventNotice`)는 그대로 둔다(이벤트 종료로 지금은 표시 없음).

개발 전용(운영 빌드에서 진입 파일이 빠짐)
- `src/app/dev/book-flow/share/route.ts`: 추천 저장소 제거(운영 경로와 같게).
- `src/app/dev/book-flow/share-fixture/route.ts`·`src/lib/book/shareLocalReview.ts`: `?version=v5`로 같은 결제 경로의 v5 책을 만든다(작가 모델 없이 결정론 원고, 외부 호출 0). 브라우저 시험용.

시험
- 새 `tests/unit/sharing/bookShareV5.test.tsx`(9개): 실제 SQL(PGlite) + V4 결정론 / v5 목업 작가.
  V4 이용권·v5 이용권·v5 결제 책마다 주인 200 새 링크 → 3번 동시 재요청에도 같은 링크(행 1개) → 다른 계정·비로그인 403 → 카카오·공유하기·복사 URL 동일(초대 토큰 없음).
  받는 사람 `loadBookShare`·`book-data` 본문 = 주인 열람 본문, `/r/[token]` 렌더가 표지(펼치기). 주인 아닌 요청은 행을 만들지 않음. 공유 API가 추천에 기대지 않음.
- `tests/unit/components/BookUxFinishing.test.tsx` 「Book share gestures and status」: 옛 동작(두 번 눌러 공유, 권한 실패 시 버튼 제거)을 검사하던 5개를 새 동작 10개로 바꿈.
  미리 받기 1회·받는 중 잠김, 공유하기·카카오·복사가 클릭 안에서 바로 호출, 카카오 실패 → 공유하기 → 복사, 취소 조용히, 복사 실패 수동 칸, 403·404·503에도 버튼 유지·다시 받기, 연타 1회, 받는 사람 화면. 시험 틀에 `useCallback` 흉내 추가.

## 5. 시험 결과

### 5-1. 정적 검사·빌드 — PASS

| 명령 | 결과 |
|---|---|
| `pnpm exec tsc --noEmit` | 0 |
| `pnpm lint` (eslint 전체) | 0 (경고·오류 없음) |
| `pnpm build` (로컬, VERCEL 아님 → deploy-strip 건너뜀) | 0. `/api/book-share`, `/r/[token]`, `/r/[token]/book-data`, `/r/[token]/book-og` 모두 함수로 빌드됨 |

### 5-2. 공유 시험 — PASS

| 명령 | 결과 |
|---|---|
| `pnpm exec vitest run tests/unit/sharing/bookShareV5.test.tsx` | 9/9 통과(실제 SQL, V4 이용권·v5 이용권·v5 결제) |
| 같은 파일을 옛 트리(468f4b40)에서 | 6 실패 / 3 통과(V4만 통과, v5 `expected 404 to be 200`) → 원인 재현 |
| `pnpm exec vitest run tests/unit/components/BookUxFinishing.test.tsx` | 19/19 통과(공유 동작 10개 포함) |
| 브라우저(Playwright 1.56, `/dev/book-flow`, 4개 설정 × 3개 책) | 12/12 칸 통과(§3-2). 페이지 오류는 개발 서버 CSS 조각 ChunkLoadError 1종뿐(공유 무관) |

API 시험 요구 항목 대응: V4·v5 책 링크 생성 PASS, 주인 아닌 사람 거절(다른 계정·비로그인·현재 약관 미동의 403, 행 생성 0) PASS, 같은 책 같은 링크 재사용(동시 3회, 행 1개) PASS.
브라우저 요구 항목 대응: 복사 → 클립보드에 새 링크 PASS(Chromium은 실제 읽기, WebKit은 클릭 안 쓰기 resolve), 복사 실패 시 수동 칸 PASS, 카카오 공유 올바른 URL(SDK 모의) PASS, 공유하기 취소 처리 PASS, 받은 링크 비로그인 열기 V4·v5 PASS.

### 5-3. 전체 시험 — 신규 실패 0 (아래 재실행으로 확정)

두 트리를 차례로 같은 기계에서 돌렸다(`pnpm exec vitest run`, JSON 보고). 기준 트리는 `git worktree add --detach … 468f4b40`.

| 트리 | 시험 | 통과 | 실패 | 건너뜀 |
|---|---|---|---|---|
| 기준 468f4b40 | 31,646 | 27,377 | 843 | 3,426 |
| 이 브랜치 | 31,661 | 27,469 | 833 | 3,359 |

이 브랜치에서만 실패 11개(기준에서만 실패 24개)는 다음과 같다.
- 9개: 시간 초과(STACK_TRACE_ERROR, 5~35초). V4 원고·지식 생성 시험이고 공유 코드를 가져다 쓰지 않는다.
- 2개: `publicationSafety` READER 검사. 기준에서는 이 파일 전체가 실패(묶음 실패)라 같은 시험이 아예 돌지 않았다.

공유와 닿는 파일은 `campaigns`(바꾸지 않은 `sqlBookSharePort`만 가져다 씀)와 `releaseActivation`(V4 `prepareBookShare` 4인자 호출, 동작 같음) 둘이다. 11개는 모두 단독 재실행으로 판정했다(아래).

| 파일 | 다시 돌린 방법 | 이 브랜치 | 기준 | 판정 |
|---|---|---|---|---|
| compatibilityEditorial · annualSafety · manuscriptSafety · publicationSafety · actualCalculationSemanticBridge | 9개 파일만 한 번에 | 같은 시험이 같은 메시지로 실패(annualSafety Jie는 둘 다 통과) | 같음 | 기존 실패 |
| koreanEditorialEngine | 파일 하나씩 | 213/213 | 213/213 | 같음 |
| releaseActivation | 파일 하나씩 | 32/32 | 32/32 | 같음 |
| campaigns | 파일 하나씩 | 3 실패 / 16 통과 | 3 실패 / 16 통과 | 같음(`docs/baseline-failures.txt`의 campaigns 3건) |
| globalBookPlanner(실패 1건) | 파일 단독 → 해당 시험만 기준·수정·수정 순서로 | 파일 단독 때 1건 시간 초과, 시험만 돌리면 통과·통과 | 통과 | 시간 초과 흔들림(시험 24초, 5초 제한 근처) |

→ **신규 실패 0.** `tests/unit/sharing/bookSharing.test.tsx`(기존 V4 공유 시험)는 두 트리 모두 준비 단계에서 `LOCAL_BIND_FAILED`로 16개가 건너뛰어졌다. P 추가 A(비회원 결제 없음) 이후의 기존 실패다. V4 공유는 새 `bookShareV5`가 실제 SQL로 대신 확인한다.

## 6. 배포

(배포 뒤 채움)

## 7. 덕짱님 확인 순서 (배포 뒤)

1. 아이폰(사파리)에서 누나 계정의 v5 책(11-06 20:20 결제분)을 열고 마지막 쪽으로 간다. 「공유 링크를 준비하고 있어요.」가 잠깐 뜬 뒤 버튼 3개가 그대로 보이면 정상.
2. **링크 복사** → 「링크를 복사했어요.」 → 카카오톡 아무 대화방(나와의 채팅)에 붙여넣기 → `https://gyeolreport.com/r/gr_…` 새 주소인지(예전 유튜브 주소가 아닌지) 확인.
3. 그 주소를 **다른 폰**(로그인 안 한 상태도 좋음)에서 열기 → 표지 → 「책 펼치기」 → 본문이 열리는지.
4. 같은 책에서 **카카오톡** → 카카오톡 공유 창 → 친구 선택 → 보내기 → 받은 쪽에서 카드 「책 펼쳐보기」 → 책이 열리는지.
5. (선택) **공유** 버튼 → 아이폰 공유 시트가 바로 뜨는지, 닫으면 아무 문구 없이 그대로인지.
6. 맥북의 V4 종합 리포트도 같은 순서 1~3(이미 있던 링크가 그대로 나오는지).
- 복사가 막히는 기기라면 「길게 눌러 복사해 주세요.」와 링크 칸이 뜬다. 칸을 길게 눌러 복사하면 된다(실패를 성공처럼 보이지 않게 한 동작).

## 8. Q 세션(v5/ops-01)이 병합 전에 알아야 할 것

- **겹친 파일: 없음.** 이 브랜치가 바꾼 파일 12개(§4, 보고서 포함)와 `v5/ops-01`(로컬 3de5fce8, 확인 시점 21:5x)의 변경 파일은 겹치지 않는다. Q의 문의 양식·안내 문구(`socialLinks.ts` 등)·알림 코드는 건드리지 않았다.
- 맞닿은 파일(Q가 바꾸고, 이 브랜치가 읽기만 함):
  - `src/app/dev/book-preview/BookPages.tsx`: `BookShareActions`가 여기의 `ShareIcon`을 가져다 쓴다. `ShareIcon({kind})` 모양을 바꾸면 공유 버튼 아이콘이 깨진다.
  - `src/app/reports/[reportId]/page.tsx`: 주인 표시 `shareOwner`(`:1574` 이용권 책, `:1650` 결제 책)를 그대로 두어야 공유 칸이 주인용으로 열린다.
- **정책 영향(중요).** Q가 `policyVersions.ts`의 privacy를 `2026-11-06.1 → 2026-11-07.1`로 올린다. 공유 링크 발급은 기존 규칙대로 **현재 약관 동의 회원만**이다(`mayShareBook`, 열람만 예전 동의 허용). 그래서 Q 배포 뒤에는 재동의하지 않은 회원의 공유가 모두 403이 된다.
  이 브랜치에서는 그때도 버튼이 남고 「공유하려면 이 책을 산 계정으로 로그인하고 약관 동의를 마쳐 주세요.」가 뜬다(버튼이 사라지지 않음).
  재동의 전 공유도 허용할지는 덕짱님 결정 사항이라 바꾸지 않았다.
- 병합 순서: 이 핫픽스는 master에 먼저 들어간다. `v5/ops-01` → master 병합 때 충돌은 없어야 한다. `v5/main`에는 아직 없으니 master를 `v5/main`에 다시 합쳐 두면 된다.
- 시험: `tests/unit/components/BookUxFinishing.test.tsx`의 React 훅 흉내에 `useCallback`이 추가됐다. Q가 이 파일을 바꾼다면 함께 맞춰야 한다(현재 Q는 이 파일을 바꾸지 않음).

## 9. 남은 위험·메모

- 공유 칸(책 마지막 쪽)에 닿으면 버튼을 누르지 않아도 그 책의 공유 링크 행이 생긴다(주인일 때만, 책당 1행). 링크는 주인이 공유해야 밖으로 나가므로 공개 범위는 그대로다. 측정용 트리거 `record_campaign_share`(캠페인 종료됨)가 같이 돈다.
- 예전에 나간 `?ref=` 초대 링크는 계속 열린다. 새로 만드는 링크에는 초대 토큰이 없다(보너스·이벤트 종료 상태와 맞춤). 추천 함수·표는 그대로 두었다(삭제 아님).
- 실제 아이폰 사파리의 정책은 Playwright WebKit과 다를 수 있다. §7 실제 기기 확인 전까지 아이폰 칸은 엔진 수준 PASS다.
- 개발 모드 WebKit에서 `BookLegalRoutes` CSS 조각 ChunkLoadError가 한 번 찍혔다(개발 서버 turbopack, 공유 코드와 무관. 운영 빌드에는 해당 없음).
