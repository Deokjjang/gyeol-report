# P6e-ops 보고 — 출시 전 운영 마무리

2026-11-04 · 브랜치 `v5/p6e-ops`(origin/v5/main c7615c9e에서 분기) · 캡처 `docs/v5/ui-p6e/` · E2E 도구 `tools/p6e/`

경계 준수: 운영 배포 없음, 운영 DB 변경 없음(migration `20261104180000_v5_p6e_ops.sql`은 로컬 Supabase에만), 운영 환경변수 변경 없음, 결제는 토스 **테스트 키**(승인·취소는 로컬 대역), Vercel·토스·OpenAI 키 관리 화면 접근 없음. 작가 지침·브리프·lint·지식 DB·Book 화면 컴포넌트는 건드리지 않았다(푸터·`/reports/[id]`·계정·결제·관리자만). 운영 사이트에는 **공개 읽기 API 한 번**(`GET /api/analytics/meta`, 광고 설정 상태 확인)만 호출했다.

## 1. 한눈에

| # | 항목 | 판정 | 한 줄 |
|---|---|---|---|
| 1 | 환불된 책 주소 안내 | PASS | "환불된 주문의 책이라 열 수 없어요" + 내 서재·문의 링크, 재확인(자동 새로고침) 없음 |
| 2 | 고객 요청 자동 연결 | PASS | 환불·재생성·이용권 지급·외부 환불 → 그 주문의 처리 전 요청을 "자동 처리 완료"로, 자동 메모(동작·시각)와 감사 로그 |
| 3 | 환불 경고 | PASS | 쓴 이벤트 이용권·나간 친구 보너스가 있으면 경고 + "확인했어요" 없이는 서버가 환불을 저장하지 않음. 회수 정책은 그대로 |
| 4 | 토스 상태 대조 | PASS(로컬 대역) · 실제 토스 조회 UNVERIFIED | 상세·기존 주문 일괄 "토스 상태 확인"(조회만) → CANCELED면 PIN으로 "외부 환불" 기록 |
| 5 | 보상 이용권 A·B | PASS(로컬) · 기본 꺼짐 | A 2장(본인 1+선물 1, 60일)/B 1장(30일), 4종 한정은 이용권 자체에 저장, 서재 안내, 관리자 탭 |
| 6 | 가격 단일 출처 | PASS(확인) | 바꾸는 곳 한 군데(아래 2.6), 서버가 그 값으로 검증. 가격은 덕짱님 결정 대기 |
| 7 | 선물 링크 화면 E2E | PASS · **기존 결함 1건 발견·수정** | 비로그인→로그인→정보→받기→책 만들기, 자기 링크·이미 받은·만료·환불 회수 전부 브라우저 캡처 |
| 8 | 실호출 1회씩 | **PARTIAL** | OpenAI 임시본 실호출 PASS($0.0577). **Sonnet 정식본·정식본 교체는 UNVERIFIED**(Anthropic 키 접근이 막힘, 3절) |
| 9 | 푸터 | PASS | 채널 보기 삭제, X·스레드 로고(주소 상수·빈 값이면 숨김), 광고 설정 유지(운영 픽셀 켜짐 확인), 관리자 화면 푸터 없음 |
| 10 | 검증 | **PASS** (실호출·토스 실응답 제외) | tsc 0 · eslint(전체) 0 · build 성공 · 전체 시험 신규 실패 0 · 동결 8장 동일 · E2E 전 경로 |

테스트 통과 ≠ 판매 품질 통과: 실제 Sonnet 원고 품질, 실제 토스 취소·조회 응답, 실제 카카오 연동은 이번에도 확인하지 못했다(아래 한계).

## 2. 항목별 근거

### 2.1 환불된 책 주소 — PASS
- `src/app/reports/[reportId]/page.tsx`: 읽기가 실패하면 먼저 `refundedBook()`(DB `ops_recon('report_refunded')`, 내용은 읽지 않음)으로 환불 여부를 보고, 환불이면 `refunded` 상태로 안내만 한다. 환불이 아니면 기존 동작(운영은 자동 재확인) 그대로. `ReportStatusView`에 `refunded` 상태 추가.
- 캡처 `ui-p6e/refunded-book.png`(E2E: 환불한 `GR-74XN` Book 주소, 링크 "내 서재 ↗ · 문의하기 ↗").

### 2.2 고객 요청 자동 연결 — PASS
- DB: `ops_requests_autoclose`(처리 전 요청 → `status=done, resolved_by=auto`, 메모 "자동 처리: 환불 완료 · 2026-11-04 17:51 (KST)", 감사 로그 `request_auto_done`). `refund_finish`(관리자·24시간 자동 환불 둘 다)와 외부 환불 기록이 호출. 재생성·이용권 지급은 관리자 동작 성공 뒤 서버가 `autoclose`(실패하면 요청은 그대로).
- E2E(캡처 `admin-refunded-dev.png`): 고객이 "계산 오류" 요청 → 관리자 환불 → `done:auto:자동 처리: 환불 완료 …`. 시험 `p6eOps.test.ts`(요청 2건 자동 처리·이미 처리한 요청은 그대로·두 번 불러도 한 번), `adminP6e.test.ts`(지급·재생성 성공 시만 호출).
- 관리자 요청함 "처리 완료" 탭은 자동 메모와 "자동 처리" 표시(`admin-requests-done.png`).

### 2.3 환불 경고 — PASS
- DB `ops_recon('refund_warnings')`: (a) 이 주문의 이벤트 이용권이 `used_self`/`claimed`, (b) 이 주문이 친구의 **첫 결제**라 보낸 사람에게 보너스가 나감. 환불 확인 단계가 열릴 때 화면이 읽어 경고 상자 + "위 내용을 확인했어요" 체크를 요구. **서버도** `ackWarnings` 없이는 409(`REFUND_WARNINGS`)로 환불 요청을 저장하지 않는다(시험).
- 회수 정책 그대로: 안 쓴 이벤트 이용권만 환불 때 회수, 쓴 것·나간 보너스는 회수하지 않음(경고 문구에도 명시).
- 캡처 `admin-refund-warning-dev.png`, `admin-refund-form-dev.png`(이벤트 이용권을 "내가 쓰기"로 쓴 주문).

### 2.4 토스 상태 대조 — PASS(로컬 대역)
- 조회 API(`GET /v1/payments/{key}`)만: 기존 `RefundProvider.lookup`에 `canPost:false` 의도를 넘긴다 — 이 경로에서는 취소 호출을 만들 수 없다.
- 관리자 주문 상세 "토스 상태 확인" + 주문 목록 "토스 상태 일괄 확인"(기존 주문 = 주문코드 도입 전, 또는 결제 완료 전체, 20건씩 커서). 결과는 일치/토스 취소(우리는 결제 완료)/일부 취소/확인 실패. 일부 취소는 자동 기록하지 않고 수동 확인 안내.
- 토스가 전액 취소(CANCELED, 잔액 0)면 "외부 환불로 기록…": **서버가 토스를 다시 조회**해 확인한 값만, 주문코드 재입력 + PIN, 감사 로그 `external_refund`. 기록하면 주문 `refunded`(환불 `source=external`), 안 쓴 이벤트 이용권 회수, 처리 전 요청 자동 처리, 책은 열리지 않는다. 관리자 하루 환불 상한은 외부 환불을 세지 않는다.
- E2E: `cust`의 주문을 토스 상점관리자에서 직접 환불한 상황(대역 상태)으로 만든 뒤 확인 → 불일치 → 기록. 대역 로그 기준 `cust` 주문에는 **GET 조회만** 있었다(취소 POST 0). 캡처 `admin-toss-mismatch-cust.png`, `admin-toss-external-form-cust.png`, `admin-external-refunded-cust.png`, 일괄 `admin-toss-batch.png`(일치 1·토스 취소 1·일부 취소 1·확인 실패 14).
- 시험: `adminP6e.test.ts`(조회만·cancel 호출 0, PIN, 부분 취소 거절), `p6eOps.test.ts`(대상 목록·커서, 외부 환불 기록 전 과정).

### 2.5 보상 이용권 A·B — PASS(로컬), 기본 꺼짐
- 설정(`src/lib/ops/config.ts` `compConfig`, 모두 환경변수): `COMP_ENABLED=1`(꺼짐이 기본), A `COMP_A_SELF_QTY`(1)·`COMP_A_GIFT_QTY`(1)·`COMP_A_VALID_DAYS`(60), B `COMP_B_QTY`(1)·`COMP_B_VALID_DAYS`(30), 상품 `COMP_PRODUCTS`(기본 종합·커리어·연애·궁합 4종).
- 등급: A = 관리자가 지정한 "결제 후 환불한 고객", B = 기존 무료 이벤트 가입자 명단(2026-11-01 00:00 KST 전, `upgrade_roster`) 중 A가 아닌 계정. 둘 다 가입 정보(`account_contacts`) 입력 완료 뒤에만 지급 — 서재를 열 때마다 서버가 멱등 판정(`ops_comp('sync')`).
- 4종 한정: 이용권에 상품 범위 배열(`report_ticket_grants.product_scopes`)을 담고, 사용(redeem)이 그 배열 안의 상품만 허용(원본 이용권 함수를 migration이 본문 치환으로 확장). 실제 로컬 DB에서 `oldmember`(B)가 대운·세운은 `NO_USABLE_TICKET`, 커리어는 접수·발행. 설정을 바꾸면 상품 범위도 바뀐다.
- A 지급: 본인용 이용권 1장 + 선물 링크 전용 1장(`gift_rewards.kind=comp, gift_only` — "내가 쓰기" 거절, 링크로만). 받은 친구에게도 같은 4종 범위. B로 먼저 받은 뒤 A로 지정되면 본인용은 B로 받은 1장으로 갈음하고 선물 1장만 추가(총 2장).
- "1+1 없음": 보상 이용권을 써도 이벤트 이용권이 생기지 않고(결제 주문에서만 발급), 보상 선물을 받은 친구가 첫 결제를 해도 보낸 사람 보너스가 없다(`bonus`는 `kind='event'`만) — 시험.
- 관리자: "기존 가입자" 탭 위에 **보상 A 지정**(주문코드 또는 토스 주문번호, 환불 완료 주문만, PIN, 감사 로그 `comp_designate`), 등급별 인원·지급·지급 대기·정보 입력 전·사용 수, 구성원별 등급·지급 상태·사용(`admin-members-comp.png`). 이메일은 가려서 표시.
- 서재 맨 위 안내 한 줄(`library-top-cust.png`=A, `profile-saved-oldmember.png`=B). **문구는 `src/lib/ops/compMessages.ts` 한 곳**(자리표시자 {장수}{구성}{기한}).
- E2E: B(oldmember) 정보 입력 전 안내 → 저장 → 1장·12월 4일까지 → 커리어 책 발행. A(cust) 지정 → 2장·1월 3일까지 → 본인용으로 종합 책 발행, 선물 링크를 `friend2`가 받아 4종 범위 이용권 확인(대운은 거절, 커리어 발행).

### 2.6 가격 단일 출처 — PASS(확인)
- **가격을 바꾸는 곳: `src/lib/payment/reportProductCatalog.ts`의 `REPORT_PRICE_KRW` 한 줄.** 모든 상품 금액·표시 문구(`REPORT_PRICE_LABEL_KO`)·이용권 묶음(`tickets/bundleCatalog.ts`)이 이 값에서 나온다(시험 `priceSingleSource.test.ts`가 결제·화면 코드에 가격 숫자가 그 파일 밖에 없는지 검사).
- 서버 검증 지점: 결제 준비(`paymentCheckoutSessionBoundary.ts` — 화면이 보낸 금액이 카탈로그와 다르면 `PAYMENT_CHECKOUT_AMOUNT_MISMATCH`), 승인 요청(`api/payments/toss/confirm/route.ts`·성공 페이지의 `isDirectReportPaymentAmount`), 승인 처리(DB가 저장한 주문 금액과 대조, 토스 응답 금액이 주문 금액과 같아야 함 `paidReportReliability.ts`).
- **주의 하나**: `isDirectReportPaymentAmount`는 현재가 외에 **직전 가격 1290**을 하드코딩으로 허용한다. 가격을 바꾸면 결제 화면을 연 채 진행 중이던 이전 가격(1490) 주문은 승인 단계에서 거절될 수 있다. 가격을 바꿀 때 그 허용값에 직전 가격을 함께 넣어 주세요(결정 후 한 줄 작업).

### 2.7 선물 링크 화면 E2E — PASS (390px, 캡처 `gift-*.png`)
| 단계 | 화면 문구 | 캡처 |
|---|---|---|
| 비로그인 진입 | "로그인하고 받기 →" | `gift-1-guest` |
| 로그인(정보 입력 전) | "가입 정보(이름·이메일)를 먼저 입력해 주세요 → 가입 정보 입력하기" | `gift-2-profile-required`, `gift-3-profile-form` |
| 정보 입력 뒤 | "이용권 받기" 버튼 | `gift-4-ready` |
| 받기 | "이용권 1장을 받았어요 · 책 고르러 가기 →" | `gift-5-claimed` |
| 자기 링크 | "내가 보낸 선물 링크예요. 친구에게 이 주소를 보내 주세요." | `gift-6-own-link` |
| 보낸 사람이 받은 뒤 열면 | "친구가 이 선물을 받았어요." | `gift-6b-sender-after-claim` |
| 이미 받은 링크(제3자) | "이미 받았거나 쓸 수 없는 선물이에요." | `gift-7-already-claimed` |
| 받은 사람이 다시 열면 | "이용권 1장을 받았어요." | `gift-7b-recipient-again` |
| 만료된 링크 | "선물 기간이 지났어요." | `gift-8-expired` |
| 환불로 회수된 링크 | "선물 링크를 찾지 못했어요. … 보낸 분의 주문이 환불되어 선물이 회수됐을 수도 있어요." | `gift-9-revoked` |
| 보상 선물(링크 전용) 받기 | 같은 화면 | `gift-10-comp-ready`, `gift-11-comp-claimed` |

- **발견·수정한 기존 결함(P6d부터)**: 이미 다른 사람이 받은 링크를 제3자가 열면 "이용권 1장을 받았어요"라는 **거짓 성공 문구**가 나왔다(화면이 "받은 사람이 나인지"를 모르고 `claimed`이면 성공 문구를 냈다). `ops_gift.peek`가 `received`(내가 받은 사람인지)를 주고 `GiftClaim`이 그 값으로만 성공 문구를 낸다. 시험 `p6eOps.test.ts`(받은 사람·보낸 사람·제3자·비로그인).
- 환불 회수 링크는 회수 때 링크 해시를 지우는 기존 설계라 "찾지 못했어요" 문구에 회수 가능성을 덧붙였다(DB 설계는 그대로).
- "받은 뒤 책 만들기": 이용권 공개 API(`/auth/ticket-redeem`)가 운영 도메인 출처만 받는 기존 보안 설계라 브라우저 클릭으로는 못 돌린다 → 같은 RPC로 접수하는 `tools/p6e/redeem.ts`로 `friend`가 종합 책을 발행, 서재 캡처 `library-top-friend.png`. 이 마지막 단계의 **브라우저 클릭 경로는 로컬에서 돌리지 못했다**(화면 UNVERIFIED) — 접수·발행·서재 표시까지는 확인.

### 2.8 실호출 — **PARTIAL**
- **OpenAI 임시본 — PASS(실호출 1회).** 결제 경로(토스 대역)로 주문 → "Anthropic이 2시간 30분째 실패 중"인 상태를 DB에 만들어(`book_generation_state.first_failure_at`) 워커를 돌렸다. 결과: 임시본 레인이 `openai · gpt-6.1-terra`를 **실제 호출**, 131초, 호출 2회(첫 쓰기 14,110자 + 수리 406자), 토큰 입력 15,281·출력 8,478, **비용 $0.057671(상한 $0.3 이내)**, 13장 모두 출처 `writer`(결정론 0), 상태 `interim`, Book에 "임시본이에요. 정식본이 완성되면 같은 주소에서 자동으로 바뀌어요." 한 줄. 관리자 상세에 시도(공급자·모델·비용·시간)가 남는다. 캡처 `interim-book.png`, `admin-detail-interim.png`. 실모델명 `gpt-6.1-terra`가 실제 OpenAI에서 동작함을 확인했다.
- **Sonnet 정식본 실호출 — UNVERIFIED.** Anthropic 키를 쓸 수 없었다. 이 세션의 셸 환경·저장소 `.env.local`에는 없고, 이전 도구(`tools/p6/cases.ts`)가 가리키는 다른 worktree의 키 파일을 확인하려는 시도는 권한 분류기가 막았다(우회하지 않았다). 키 주입 방법만 정해 주시면 같은 서버·같은 단계로 바로 돌릴 수 있다(수동 항목 1).
- **정식본으로 교체 — UNVERIFIED**(위와 같은 이유). 교체 레인 동작은 P6d 목업 시험(감독 11개)만 근거.
- "Anthropic 장애 강제": 코드에 그 플래그가 없어 개발 전용 `OPS_FORCE_ANTHROPIC_DOWN=1`을 추가했다(정식본 시도만 출력 전 529, 운영에서는 항상 꺼짐, 시험 있음). 실제로 켜 보니 쓰기 재시도 백오프가 예산(700초)까지 이어져 한 번에 5분 넘게 걸리고 내 클라이언트 5분 타임아웃에 끊겨 기록이 남지 않았다 → 최종 실호출은 플래그 대신 위의 "2.5시간 실패 상태 심기"로 돌렸다. 즉 **장애 강제 플래그 경로 자체는 실호출로 끝까지 확인하지 못했다.**
- 비용 기록: 이번 실호출은 OpenAI 1회 $0.0577만. (`docs/v5/api-cost-log.md` 누적에는 넣지 않았다 — 해당 표는 `scripts/dev/v5-e2e.ts` 호출용.)

### 2.9 푸터 — PASS
- 실제로 보이는 푸터는 `BookFooter → PreviewFooter`(Book 공개 켜짐), `BusinessFooter`는 꺼짐일 때만. 두 곳 모두: "채널 보기" 삭제, X·스레드 아이콘(공식 로고 모양, 단색 SVG) 추가, 관리자 화면(`/admin…`)에는 푸터를 그리지 않음(예전엔 CSS로만 숨김).
- 주소는 상수 한 곳 `src/lib/legal/socialLinks.ts`(`SOCIAL_LINKS.x`·`threads`). **지금은 둘 다 빈 문자열이라 아이콘이 보이지 않는다**(https가 아니면 숨김). 주소를 채우면 나타난다. 캡처: 비어 있을 때 `footer-empty.png`, 임시 주소를 넣었을 때 `footer-with-icons.png`(캡처 뒤 원복).
- "광고 설정": 운영 사이트 `GET /api/analytics/meta` 응답이 `{"choice":null,"ready":true}` — **Meta 픽셀 켜짐**(2026-11-04 공개 읽기 1회) → 유지. 코드도 서버 `ready`가 참일 때만 링크를 보이게 바꿔(`MetaPixel.tsx`), 나중에 픽셀을 끄면 링크가 저절로 사라진다. 시험 `footerSocial.test.tsx`, `BusinessFooter.test.tsx`.

### 2.10 검증 — PASS
tsc 0 오류, eslint(저장소 전체) 0 오류·0 경고, `next build` 성공.

**전체 시험**: 31,361개 중 실패 832(기준선 c7615c9e 위에서 P6d 최종 비교는 831개 기준 832 — 같은 수준). 이번 브랜치의 새 시험은 모두 통과: SQL 12(`p6eOps`), 관리자 동작 23(`adminP6e`), 푸터 4(`footerSocial`)+기존 푸터 시험 갱신, 가격 4(`priceSingleSource`), 장애 강제 플래그 1, 기존 ops 시험 65. 헬퍼 갱신: `tests/helpers/v5Scenarios.ts`(새 migration 적재), `opsStoreStub.ts`.

**신규 실패 0** — 근거: 브랜치에서 실패한 154개 파일 전부를 기준선 트리(`v5-p6e-base`)에서 같은 방식으로 다시 돌려 시험 단위로 비교했다. 같은 파일들에서 브랜치 832 · 기준선 830, 차이 27개(브랜치만)·25개(기준선만)는 전부 부하(동시에 다른 세션 시험이 돌아 load average 30~50)로 5초 제한에 걸리는 시험이다. 차이가 난 5개 파일(`majorEvidenceSeparation` 7, `publicationSafety` 2, `knowledgeBinder` 1, `knowledgeSourceVerification` 2, `manualReview`)을 부하가 줄었을 때 따로 돌리자 **브랜치와 기준선의 실패 집합이 같다**(앞 4개 파일은 같은 12개가 양쪽에서 실패, `manualReview`는 양쪽 모두 5초 제한 시간 초과로 3~11개가 들쭉날쭉). 이번 변경은 이 실패 파일들이 쓰는 지식·해석·Book 화면 코드를 건드리지 않았다. 기존 실패 830여 개는 그대로(이번 범위 밖).

**E2E**(로컬 dev 서버 3500 · 로컬 Supabase · 토스 테스트 키 + 대역 · 목업 작가, `tools/p6e/e2e.mjs`):
| 흐름 | 계정 | 결과 |
|---|---|---|
| 정보 → 결제 → 생성 → 요청 → 환불 | dev(`GR-74XN`) | 가입 정보 → 결제(토스 승인 대역) → Book 발행 → 이벤트 이용권 "내가 쓰기" → 요청("계산 오류") → 관리자 환불(경고 확인·PIN) → 요청이 `done:auto:자동 처리: 환불 완료 · 2026-11-04 17:51 (KST)`, 환불된 책 주소 안내 |
| 토스 직접 환불 → 대조 → 외부 환불 → 보상 A | cust(`GR-MJG6`) | 대역 상태 CANCELED → "토스 상태 확인"(불일치) → 외부 환불 기록 → 요청 자동 처리 → 보상 A 지정(즉시 지급) → 서재 A 안내 → 본인용으로 종합 책 발행 → 선물 링크를 friend2가 받아 4종 범위 확인 |
| 보상 B | oldmember(명단) | 정보 입력 전 안내 → 입력 → 1장·12월 4일까지 → 대운·세운 거절, 커리어 발행 |
| 선물 | sender → friend, friend2 | 2.7절 표 전부 + friend가 받은 이용권으로 종합 책 발행 |
| 관리자 | dev | 요청함·토스 일괄 확인(일치 1·토스 취소 1·일부 취소 1·실패 14)·보상 현황(A 1/1/사용1, B 2/2/사용1)·감사 로그 |
토스 대역 호출 기록: 승인 6, 조회(GET) 55, 취소(POST) 2(관리자 환불 2건). 외부 환불·상태 확인에는 취소 호출이 없다.

## 3. 디자인 동결
요청 밖 화면 8장 — 홈, 입력(종합·커리어), 개인정보처리방침, 이용약관, 로그인, 이용권 Book 표지·2쪽 — 을 기준 트리(c7615c9e, 포트 3600)와 이 브랜치(3500)에서 같은 조건(광고 동의 카드 고정, 개발 표시기·푸터 숨김)으로 찍어 **전부 바이트 동일(cmp)**: `ui-p6e/freeze-base/`, `ui-p6e/freeze-branch/`. 푸터는 이번 요청 대상이라 비교에서 가렸다. 바뀐 화면은 요청 범위만: 서재 맨 위 안내, 이벤트 이용권 목록(보상), 환불된 책, 선물 링크, 관리자(확인·일괄·지정·경고), 푸터.

## 4. 이번에 찾아 고친 결함
| 결함 | 출처 | 수정 |
|---|---|---|
| 다른 사람이 이미 받은 선물 링크를 열면 "이용권 1장을 받았어요" | **기존(P6d)** — 브라우저 E2E에서 발견 | `peek.received` + 화면 분기, SQL 시험 |
| 관리자 화면에도 고객용 푸터 DOM이 붙음(CSS로만 숨김) | 기존 | 두 푸터 모두 `/admin`에서 렌더하지 않음 |
| 광고 설정 링크가 픽셀 꺼짐과 무관하게 보일 수 있음 | 기존 | 서버 `ready`가 참일 때만 |

## 5. 알려진 한계
1. 실제 Sonnet 호출·정식본 교체·장애 강제 플래그 실호출은 확인하지 못했다(2.8). 토스 조회(상태 확인)는 대역으로만 — 실제 토스 응답은 수동 항목 4.
2. 보상 이용권 4종 한정은 DB 이용권 범위로 구현했다. 12월 1일 대운·세운 판매를 열어도 보상 이용권으로는 대운·세운을 못 만든다(`COMP_PRODUCTS`로 늘리면 바뀜). 이미 지급된 이용권의 범위는 지급 때 값 그대로다.
3. 사용 여부는 "이용권 사용 또는 선물 링크 발송/받음"을 센다. 선물 링크만 만들고 안 받은 것도 "사용"에 들어간다.
4. 환불 확인 단계 경고는 이벤트 이용권(결제당 1장)과 친구 보너스만 다룬다. 업그레이드·보상 이용권은 환불과 무관하다.
5. 토스 일괄 확인은 한 번에 20건 조회(응답이 느리면 길어짐). 확인 결과는 저장하지 않고 감사 로그에 건수만 남긴다.
6. 회수된 선물 링크는 "찾지 못했어요"와 구분되지 않는다(링크 해시 삭제 설계). 문구로만 안내.
7. 로컬 DB는 다른 세션과 공유된다. 이번 E2E 계정(`p6e-*@gyeol.local`)·주문·이용권이 로컬 DB에 남아 있다.

## 6. 덕짱님 수동 항목 (P6d 목록 갱신)
1. **Anthropic 실호출 재시도**: 키를 서버 환경(`ANTHROPIC_API_KEY`)으로만 넘길 방법을 정해 주세요(제가 다른 폴더의 키 파일을 직접 열 수 없었습니다). 그러면 ① 결제 경로 Sonnet 정식본 1권(상한 $0.4) ② 임시본 → 정식본 교체까지 같은 도구(`tools/p6e/e2e.mjs buy` + 워커)로 확인합니다.
2. **운영 migration 승인**: `20261104100000_v5_p6d_ops.sql`(P6d) 다음에 `20261104180000_v5_p6e_ops.sql` — 고객 요청 자동 처리 열, 외부 환불 허용, 이용권 상품 범위 열·본문 치환, 선물 보상 열, 보상 지정·지급 표, 새 함수 3개. 기존 행은 지우거나 바꾸지 않는다. 운영의 이용권 원본 함수 본문이 로컬과 같은지(치환 앵커가 정확히 맞아야 migration이 중단 없이 적용됨 — 안 맞으면 적용 전에 멈추고 아무것도 바꾸지 않음) 승인 때 확인.
3. **보상 켜기**: Vercel에 `COMP_ENABLED=1`. 필요하면 `COMP_A_SELF_QTY`·`COMP_A_GIFT_QTY`·`COMP_A_VALID_DAYS`·`COMP_B_QTY`·`COMP_B_VALID_DAYS`·`COMP_PRODUCTS`. 관리자 "기존 가입자" 탭에서 보상 A 지정(환불 완료 주문).
4. **실제 토스 조회 확인**: 운영 비밀키로 관리자 주문 상세 "토스 상태 확인"을 환불 안 한 주문 1건에 눌러 "일치"가 나오는지, 토스 상점관리자에서 직접 환불한 과거 주문에는 "토스 취소"가 나오는지 확인. 그 뒤 "토스 상태 일괄 확인(기존 주문)".
5. 푸터 **X·스레드 주소**: `src/lib/legal/socialLinks.ts`의 `SOCIAL_LINKS.x`·`threads`에 https 주소(빈 값이면 아이콘 숨김).
6. 보상 안내 **문구 검토**: `src/lib/ops/compMessages.ts`(A 사과·감사, B 업그레이드 안내).
7. **가격**: 결정되면 `reportProductCatalog.ts`의 `REPORT_PRICE_KRW` 한 줄 + `isDirectReportPaymentAmount` 허용값에 직전 가격 추가(2.6).
8. (P6d에서 이어짐) 카카오 콘솔 동의 항목, `KAKAO_ADMIN_KEY`·`KAKAO_CHANNEL_PUBLIC_ID`, `ADMIN_USER_IDS`·`ADMIN_ACTION_PIN`, 이벤트 `GIFT_EVENT_*`, 12월 1일 `FORTUNE_SALES_OPEN=1`, 개인정보처리방침 초안 검토, `vercel.json` 크론 승인, 실제 토스 테스트 결제 1회, `gyeol2026…` 주문 출처 확인.
