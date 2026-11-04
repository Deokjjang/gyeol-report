# P6d-ops 진행 기록

브랜치 `v5/p6d-ops`(origin/v5/main 638254e3에서), worktree `~/Developer/gyeol-worktrees/v5-p6d-ops`.
기준선 worktree `~/Developer/gyeol-worktrees/v5-p6d-base`(같은 커밋, detached, 변경 없음).
경계: 운영 배포·운영 DB 변경 없음, migration은 로컬 Supabase만, API 실호출 없음(목업), 결제는 로컬 토스 테스트 키만.
브리프·작가 지침·lint·지식 DB는 ⑥ 세션(v5/p6d-content) 담당 — 이 브랜치는 책 생성 진입 함수를 호출만 한다.

## 기록

- 2026-11-04 시작. worktree 생성, 기준선 전체 시험(기준선 worktree) 백그라운드 실행.

## 조사 요약 (서브에이전트 4개 + 직접 확인)

- 실제 홈은 `BookShelf`(src/components/book/BookShelf.tsx) + `BOOKS`(src/lib/book/product.ts). 대운 `major_fortune`/`major-fortune`, 세운 `annual_fortune`/`annual-fortune`. 상세 페이지는 없고 `/report/new?product=<slug>` → `BookInput` → `BookCheckout`(결제 `/api/payment-checkout/prepare`, 이용권 `/auth/ticket-redeem`).
- 이용권 사용(`enqueueTicketPublication`)에는 판매 여부 검사가 없다 → 서버 거절을 새로 넣어야 한다.
- 현재 비회원도 결제할 수 있다. 계정 상태는 `accountSession`(guest·needs_consent·member). 프로필에 이메일·휴대폰 칸이 없고 카카오는 닉네임만 받는다.
- 주문: `payment_orders`(구매자 칸 없음), Toss 요청 `customerName`은 "결리포트 고객" 고정, orderName은 상품명. orderId는 `provider_order_<uuid>`. `gyeol2026…`은 코드 어디에도 없다(외부·옛 데이터로 추정).
- 환불: 상품 결제 환불 경로 없음. Toss 취소 클라이언트는 이용권 묶음용(`tossRefundClient.ts`)만 있다.
- 생성: 진입 함수 `buildV5Snapshot`(writer/publish.ts)은 실패해도 결정론 작가로 채운 완성본을 돌려준다. 기본 폴백이 terra라 Sonnet 출력 전 실패 → terra 원고가 정식본으로 나간다. 결제 경로는 장 저장이 없고(NO_CHAPTER_SINK) 3번째 시도는 결정론 완성. 이용권 경로는 회수 크론이 결정론으로 완성. 잔액 부족 감지 없음.
- 서재는 완성본만 보인다(제본 중 표시 없음).

## 설계 (요약)

- 진입 함수는 그대로 두고 `deps`(provider·model·fallback=null·fetchImpl)로만 정책을 건다. 결과(meta.chapters source·run.calls)를 읽어 정식/임시/보류를 판정하는 감독 층 `src/lib/ops/generation/`을 결제·이용권 두 경로가 같이 쓴다.
- 새 migration(로컬 전용) 1개: 주문 칸(주문코드·계정·구매자), 문의 요청, 관리자 감사 로그, 생성 시도 기록·상태, 결제 경로 장 저장, 공급자 스위치, 임시본 보관, 이벤트 보상·선물 링크, 프로필 칸.
- 판매 중지는 `isPurchasable`(읽기·분석 경로가 씀)을 바꾸지 않고 판매 진입점 전용 게이트 하나(`FORTUNE_SALES_OPEN`)로 막는다.

## 결정 (AskUserQuestion, 2026-11-04)

| 항목 | 결정 |
|---|---|
| 비회원 결제 | 유지. 비회원은 결제 화면에서 이름·이메일(두 번)·휴대폰(선택)을 입력해야 결제된다. 회원은 정보 화면을 마쳐야 결제·이용권 사용 가능 |
| 24시간 실패(임시본도 없음) | 결제 주문은 자동 전액 환불(토스 취소 API + 감사 로그). 이용권 주문은 이용권 환급(기존 reverse) |
| 환불 후 Book | 열람 막기(주문 상태가 refunded면 기존 읽기 경로가 막는다). 스냅숏은 지우거나 바꾸지 않는다 |
| 업그레이드 이용권 자격 | 기능 공개 전에 가입한 기존 계정 전부(정보 화면 완료 시 표시, 지급은 P6c) |

## 추가 지시 체크리스트(보고서 끝에 반영 여부·근거 파일로 옮긴다)

1. 정정(카카오 설정): account_email 필수 동의 → 미리 채움, is_email_valid·is_email_verified 둘 다 참일 때만 확정값 / 기존 카카오 가입자 추가 동의·직접 입력 두 경로 / 입력 전에는 결제·이용권만 막고 로그인·열람은 열어 둠 / plusfriends 값 없으면 미연결(→ 뒤 지시로 '미확인') / 개인정보 초안에 이메일 항목·목적
2. 카카오 채널: scope = account_email·profile_nickname·plusfriends 셋만 / 콜백에서 provider_token으로 채널 관계 조회 → 계정에 저장, 토큰 없음·거부는 미확인 / 이벤트 보상 상태 값(기본 없음) / 운영 Supabase 카카오 scope 변경 필요 시 수동 항목
3. 개인정보·탈퇴: 처리방침 페이지 갱신(항목·목적·보관·파기·제3자 토스) 초안 / 탈퇴 메뉴(계정·연락처·출생 입력 삭제, 주문·결제 분리 보관, 카카오 연결 끊기, 구매 Book 열람 불가 안내) / 처리방침 링크를 가입 정보·결제 화면에
4. 기존 카카오 가입자 이메일: identity에 이메일 없으면 scope=account_email로 한 번 더 인가 → 받으면 우리 프로필 표에 저장(auth email 덮지 않음) / 거부·유효하지 않으면 다시 묻지 않음(거부 시각) → 바로 가입 정보 화면 / 업그레이드 이용권 = 기존 가입자 명단(오픈 이벤트 종료 시점) 중 가입 정보 완료 계정만, 상태 값만 / 관리자 기존 가입자 현황(이메일 확보·미확보, 최근 로그인, 주문 유무) / 과거 주문(provider_order_…, gyeol2026…) uid 연결이 관리자·서재에 보이는지 로컬 시험 데이터로 검증
5. 보고서 끝에 이 체크리스트와 반영 여부·근거 파일

## 진행

- 기준선(v5-p6d-base, 638254e3) 전체 시험: 31,223개 중 실패 831(파일 165). JSON은 세션 scratchpad baseline/base.json.
- 생성 신뢰성 핵심(감독·정책·장 저장·잔액 감지·교체 레인·결제/이용권 연결) + migration + 실패 주입 시험 19개 통과. 기존 ticketQueue 시험은 새 정책(결정론 원고 발행 안 함)에 맞춰 기대값만 갱신.
- 고객 화면 슬라이스(7ec22f6a): 판매 중지, 가입 정보, 카카오 이메일·채널, 주문 기록, 결제 완료 화면, 구매 내역·문의, 선물, 탈퇴, 개인정보 초안(/privacy/draft).
- 관리자 화면(87cbe5ac, 서브에이전트 구현 + 메인 검토): 환불 하루 상한을 DB 잠금 안에서 다시 세도록 보강(동시 요청).
- 로컬 E2E 출처 예외(f06ea9d8): next dev + 로컬 Supabase일 때만 localhost.
- 로컬 DB에 migration 적용(`pnpm db:v5`, 누적 39). ⑥ 세션과 같은 로컬 DB라 이용권 큐 함수가 바뀐 것(보류·회수=큐로 되돌림)을 보고서에 적는다.
- 과거 주문 연결(로컬 시험 데이터 `tools/p6d/seed-legacy.ts`): provider_order_…(구매 묶음 buyer) → GR-EBN8, gyeol20260915-…(비회원 → 서재 연결) → GR-SF46. 고객 구매 내역(ops_order summary)과 관리자 검색(gyeol2026·provider_order_·GR-) 모두 나옴(SQL 확인). 화면 확인은 E2E 캡처.
