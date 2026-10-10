# V4 RELEASE BLOCKERS 02

2026-10-11 · **Production 활성화 승인서가 아니다.**

| 항목 | 값 |
|---|---|
| Base | `v4/release-final-qa-01` · `1c7ebc3918a932b355b43aa1005175ed33ae7442` |
| 작업 branch | `v4/release-blockers-02` |
| 범위 | 지정 sparse 종합 발행, Annual 구매 전 안내, Book 하단 safe-area |
| Production / master / DB migration / 공개 gate / 실제 결제 | 모두 변경·실행 없음 |
| 보호 경로 | 기존 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 그대로 보존·스테이징 제외 |

## 1. 지정 종합 P0: 실제 근거 배정 복구

입력: `saju_mbti_full`, 1993-02-06, FEMALE, 출생시간 unknown, MBTI unknown, 직업 없음, single. 이름에 의존하는 분기는 없다.

| 조사 경로 | 결과 |
|---|---|
| `comprehensiveProductAdapter` | 원고 이후 `V4_CONTENT_INCOMPLETE`; 최종 validator가 원인이 아님 |
| `comprehensiveEditorialPlan` / `comprehensiveAllocator` | C1 core와 같은 정체성인 PR018 support가 배정되어 공통 주제의 support 예산을 소비 |
| `comprehensiveSectionRenderer` / `comprehensiveManuscriptRenderer` | 그 support를 기존 `CORE_IDENTITY_ALREADY_INTRODUCED` 규칙으로 제거. 배정 예산은 복구되지 않음 |
| 실제로 남은 후보 | `F04_OVERWORK`의 별도 shadow가 유효하지만 `THEME_SUPPORT_BUDGET`으로 탈락 |
| 원인 분류 | **B: 배정 문제 + C: renderer 제거와 planner 예산 불일치**. 원국 근거 부족이나 unknown 추정 문제는 아님 |
| 최소 수정 | allocator의 C1 support 배정 전에 기존 renderer와 같은 중복 조건을 검사. 이미 지워질 정체성이 예산을 소비하지 않게 함 |

수정 source는 `src/lib/interpretation-v4/comprehensiveAllocator.ts`의 조건 1개다. writer 문장, 계산, C1~C10 계약, section 최소 5개, manuscript safety, publication validator는 바꾸지 않았다.

- 수정 전: `why / fortune / work / direction` **4 sections**.
- 수정 후: `why / fortune / fact-bomb / work / direction` **5 sections** + opening.
- 복구된 C6: “일은 끝났는데 생각은 아직 남아 있습니다”. 기존 material의 별도 `OVERWORK` 장면이며 filler를 새로 쓰지 않았다.
- 실제 문장: “일은 끝났는데 머리는 아직 퇴근하지 않을 때가 있습니다. 목표가 정해지면 끝낸 결과를 보고 다음 행동을 정하려는 쪽이죠.”
- provenance 9개 보존: 戊 일간, 寅 월지, 甲 월간, 월지 MAIN 甲/MINOR 戊, 월간 visible 甲, 연간 visible 癸, 학당, 일주 제왕. 본문 이유에 선택된 근거는 寅 월지다.
- hour evidence 0, MBTI source 0. Book 시주 `null`, MBTI table `null` 유지.
- hard violation / exact sentence duplicate / semantic theme overuse / exact evidence overuse 0. 기존 `GENERIC_DESCRIPTION` **soft warning은 유지**하며 임의 해제하지 않았다. 문체 고도화는 이번 수정 범위가 아니다.
- 4 sections로 변조한 별도 packet은 여전히 `V4_CONTENT_INCOMPLETE`로 거절되는 negative test를 추가했다.

실행 경로: 실제 `generateV4ShadowReport` → publication validation → snapshot JSON 저장/재읽기 → Book 목차/본문/뒤표지 → 공유 projection PASS. 이전 준호(1989-09-21 17:40 INTP 프리랜서 번역가)의 C4 role/문장 중복 해결도 유지된다.

### 이용권 발행·저장

`ticketPublication.test.ts`의 실제 로컬 SQL queue/worker 회귀에 sparse 입력을 추가했다. 이용권 1장 예약·완료·최종 REDEEM 1회, published snapshot 1개, 서재/소유자 Book/공유 Book parity PASS. 같은 request ID로 재요청해도 같은 완료 결과이고 다음 worker 실행은 empty다. payment/coupon/referral/campaign/Meta 테이블 쓰기는 0이다.

실제 Chrome에서도 가상 이름 `새벽`의 동일 입력을 기존 **dev adapter**로 발행했다. 이용권 1장 소비 → Book 새로고침 → 11/11 페이지/뒤표지 → 서재 → 공유 Book 열람을 확인했다. Production 저장이나 실제 PG 성공으로 해석하지 않는다.

## 2. Annual: canonical 안내와 결제 전 거절

변경: `src/components/book/BookInput.tsx`.

- API는 `{ ok:false, message }`, UI는 `error`만 읽어 일반 오류로 바뀌었다. `message` 우선, 기존 `error` fallback 유지.
- dev Major/Annual도 공개 경로와 동일한 **계산 전용** `/api/reports/validate-input` preflight를 사용한다. 다른 dev 상품은 기존 dev validation boundary를 유지한다.
- 검증 실패는 step 이동 전에 return. 기존 validation attempt ID로 오래된 응답 무시도 유지.
- canonical 문구: **“선택하신 출생시간 정보로는 대운 기준이 하나로 확정되지 않습니다. 정확한 출생시간을 입력해 주세요.”**

| 검증 | 결과 |
|---|---|
| 1998-08-29 MALE, 시간/MBTI unknown, Annual 2026 | preflight 400, 정확한 문구, 주문서 진입 안 함 |
| 같은 입력 exact 18:20으로 수정 | 재검증 성공, 실제 Chrome 주문서 진입 |
| 1979-04-17 FEMALE unknown | 계산 경계가 안정적이므로 preflight 성공. unknown 전체를 금지하지 않음 |
| 직접 checkout prepare 우회 요청 | 400, order persistence 호출 0, checkout session 없음 |
| 직접 ticket enqueue/redeem 우회 요청 | `INVALID_INPUT`, SQL/RPC 호출 0 → queue 0 / REDEEM 0 |
| Toss/외부 호출 | 0 |
| 정상 Major/Annual | 14/14 및 12/12 유지 |

계산 및 서버 금융 guard는 원래 경로를 검증했으며 수정하지 않았다. 실제 금전 결제는 수행하지 않았다.

## 3. Safe-area: 공통 Book scroll/nav만 수정

변경: `src/app/dev/book-preview/book.module.css` (실제 Book이 재사용하는 공통 CSS).

- 기존 nav 높이 54px에 `env(safe-area-inset-bottom, 0px)`를 더하고 같은 값의 하단 padding을 적용.
- scroll 영역은 nav 전체 높이를 빼서 마지막 본문/입력/구매 동의/공유가 nav 뒤로 들어가지 않게 함.
- mobile rule의 높이·padding 덮어쓰기를 제거. inset 0이면 기존 54px이며 고정 34px 여백 없음.
- viewport-fit 전역 변경은 하지 않았다. 브라우저가 제공하는 inset을 소비하며 top layout과 Book 이동/회전 로직은 그대로다.

390×844, bottom34: 이전 button bottom 약839.5 → **805.5**, 안전 경계810 안쪽. nav top756/bottom844, scroll bottom756. inset0에서는 nav54/padding0이다.

### 실제 Chrome 155

| 검증 | 결과 |
|---|---|
| 320 / 390 / 430 / 768 / 1440 × inset 0 / 34 | 입력 마지막 항목, 주문서 동의/발행 버튼, Book reader/nav, 뒤표지 공유 모두 PASS |
| top47 + bottom34 에뮬레이션 | 버튼이 하단 inset 위에 위치, 수평 overflow 0 |
| 본문 | 긴 chapter 수직 스크롤, 다음/이전 페이지 후 scroll reset, 11/11 마지막 페이지 접근 PASS |
| 공유 | 카카오톡/공유/링크 복사 접근, 로컬 공유 Book 재열람 PASS. 실제 카카오 메시지는 보내지 않음 |
| 실제 desktop 200% | Chrome default zoom=2, outer1440/inner720/DPR2/visualViewport.scale1. reader/입력 마지막 항목 PASS; 이후 zoom 복원 |
| Coverflow | 다음 책 조작 PASS, overflow 0, 디자인/로직 미변경 |
| 런타임 예외 / 외부 요청 | 0 / 0 (QA CDP에서 외부 origin 차단) |
| 물리 iOS Safari | **미실행 — REAL_IOS_SAFARI_VERIFIED=NO** |

스크린샷을 실제 확인했다. Next dev indicator는 개발 화면에만 존재하는 chrome이며 앱 nav를 수정해 숨기지 않았다. 첫 자동화 스크립트의 DOM 객체 직렬화 오류는 boolean 조회로 바꾸고 해당 읽기/공유 경로를 재실행했다. 앱 오류로 세지 않았다.

산출물: `/private/tmp/gyeol-release-blockers-02/`.

- `{320,390,430,768,1440}-{reader,receipt}-inset-{0,34}.png`
- `{320,390,430,768,1440}-{input,share}-inset-34.png`
- `390-annual-prepayment-rejection.png`, `390-narrative-scroll-bottom.png`, `390-back-share-inset-34.png`
- `390-shared-sparse-book.png`, `390-sparse-library.png`, `390-home-coverflow.png`
- `desktop-200-reader.png`, `desktop-200-input.png`
- `browser.json`, `reader.json`, `layout.json`: 측정값/경로 결과.

## 4. Bounded matrix와 추가로 발견한 미해결 P0

이전 23개 표본을 그대로 재사용: `sixProductSale` 10 + `releaseContent` 13.

| 구분 | 정상 생성 | 정상 안전 거절 | 예상 밖 발행 실패 |
|---|---:|---:|---:|
| 기존 23개 표본 | **22** | **1** (Annual DAYUN_UNCERTAIN) | **0** |
| 별도 sparse 고정 검사 3개(지정 재현 포함) | **2** | **0** | **1** |

두 줄은 지정 재현을 공유하므로 독립 표본처럼 합산하지 않는다. 별도 DOB는 1988-03-22(성공), **1994-11-18(실패)**. 모두 FEMALE/시간 unknown/MBTI unknown/직업 없음/single이며 명리값은 실제 계산했다.

1994-11-18의 실패는 `COMPREHENSIVE_MANUSCRIPT_UNSAFE` → C8 `PRIMARY_NOT_RENDERED: PR015`다. C7 support가 PR015의 유일한 direct-claim 표현을 먼저 사용하고, C8 primary에서 문장 중복 방지에 걸려 필수 role을 만들지 못한다. base allocator를 임시로 연결한 고정 재현에서도 **동일 실패**를 확인했고 임시 모듈은 제거했다.

이는 지정 4-section 문제와 다른 **기존 원고 source/role 소유권 문제**다. 이번 최소 배정 수정으로 해결됐다고 보고하지 않는다. `releaseSparse.test.ts`에 실패 원인을 명시적으로 assert해 남겼다. 이 assertion의 PASS는 해당 고객 입력의 발행 PASS가 아니다. 이후 별도 수정에서는 primary 문장 소유권/지원 문단 표현 배정을 검토해야 하며, 중복 허용·필수 role 삭제·generic filler로 우회하면 안 된다.

따라서 **SIX_PRODUCT_RELEASE_CODE_READY=NO**. 지정 P0 해결과 전체 지원 입력의 출시 준비 완료는 구분한다.

## 5. 회귀 집계

| 검사 | 실제 이번 결과 |
|---|---|
| 요청된 관련 suite | **1,055 PASS / 0 FAIL / 2 SKIP**, 75 files PASS / 2 skipped |
| 추가 planner suite | **21 PASS / 1 기존 FAIL**. 아래 별도 설명 |
| 두 최종 suite의 고유 합계 | **1,076 PASS / 1 기존 FAIL / 2 SKIP** (재실행 중복 제외) |
| skip | 기존 opt-in `paidWorkerCapacity`, `paidWorkerMeasurement`; 이번 부하실험 미실행 |
| lint | PASS, 경고 0 |
| build | PASS, 기존 미수정 dev SQL 파일 추적 계열 Turbopack warning 8건 |
| TypeScript | baseline390 / 현재390 / 신규0 / 제거0. 진단 위치·union 순서 정규화 비교, tsc exit2 |
| diff-check | PASS |

추가 `comprehensiveEditorialPlan.test.ts`의 기존 isolation assertion은 `timeProductContext.ts`의 core 사용을 예전 allowlist에서 허용하지 않아 실패한다. 두 파일 모두 base와 diff 없음. 이번 범위를 넘어 allowlist를 바꿔 초록으로 만들지 않았다. 전체 green이라고 보고하지 않는다.

관련 suite에는 account/Auth/library/campaign/referral, payment/refund/ledger/ticketPublication, sharing, ticket checkout/owner, releaseContent/releaseSparse/sixProductSale/timeProduct/manuscriptSafety/manuscriptHumanClosure, Book public/dev runtime, V2 저장본, Annual preflight/customerDayun 회귀가 포함된다. 실제 금융 호출·Production DB 쓰기 없이 로컬 SQL과 주입 provider를 사용했다. 검증 skill로 화면→API→저장→Book 경로를 확인했고 Supabase skill의 경계를 적용해 Production 접근 없이 로컬 SQL 회귀만 수행했다.

재현 명령:

```sh
pnpm exec vitest run tests/unit/account tests/unit/payment tests/unit/sharing tests/unit/app/ticketCheckout.test.tsx tests/unit/app/ticketOwnerRoute.test.tsx tests/unit/interpretation-v4/releaseContent.test.ts tests/unit/interpretation-v4/releaseSparse.test.ts tests/unit/interpretation-v4/sixProductSale.test.ts tests/unit/interpretation-v4/timeProduct.test.tsx tests/unit/interpretation-v4/manuscriptSafety.test.ts tests/unit/interpretation-v4/manuscriptHumanClosure.test.ts tests/unit/app/bookPublicFlow.test.tsx tests/unit/app/dev/bookRuntime.test.tsx tests/unit/interpretation-v3/v2Regression.test.tsx tests/unit/api/bookAnnualPreflight.test.ts tests/unit/report-generation/customerDayunGeneration.test.ts --maxWorkers=2 --testTimeout=30000 --hookTimeout=60000
pnpm exec vitest run tests/unit/interpretation-v4/comprehensiveEditorialPlan.test.ts --maxWorkers=2
pnpm lint
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 pnpm build
pnpm exec tsc --noEmit --pretty false --incremental false
git diff --check
```

로그: `/private/tmp/gyeol-blockers-{regression,planner,lint-final,build,tsc-final,browser,reader}.log`. 추가 sparse base 재현은 `/private/tmp/gyeol-sparse-baseline.log`.

## 6. 출시 경계

- 애플리케이션 source 변경은 allocator / BookInput / Book CSS **3개**. 나머지는 관련 회귀와 이 문서다.
- 판매가/묶음/환불/PG 승인·복구/원장/worker lease/이벤트 일정·상한·만료/OAuth/채널/브랜드/V3 저장본/공유 URL 계약은 수정하지 않았다.
- master/Production DB·migration/배포/공개 gate/실제 결제 변경 없음. git push는 이 feature branch만 대상이다.
- 기존 운영 준비·승인 항목은 [이전 감사](v4-release-final-qa.md)에 남아 있다. 이번에 Production catalog/provider 설정을 재감사하거나 해결했다고 주장하지 않는다.
- 다음 단계 자동 시작 없음. 추가 PR015 콘텐츠 P0 및 물리 Safari 확인은 별도 잔여 항목이다.

```text
COMPREHENSIVE_SPARSE_P0_READY: YES
ANNUAL_PREPAYMENT_GUARD_READY: YES
MOBILE_SAFE_AREA_READY: YES
SIX_PRODUCT_RELEASE_CODE_READY: NO
PRODUCTION_ACTIVATED: NO
REAL_IOS_SAFARI_VERIFIED: NO
```
