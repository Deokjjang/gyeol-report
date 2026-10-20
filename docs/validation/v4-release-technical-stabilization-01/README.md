# V4 Release Technical Stabilization 01

검증일: 2026-10-13. 기준: `v4/six-product-common-editorial-polish-01` / `964e6b9a1b248c67e695f112615873f232d9320e`. 작업 브랜치: `v4/release-technical-stabilization-01`.

독립 worktree `/private/tmp/gyeol-release-technical-stabilization-01`에서 수행했다. 원본 checkout은 `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`였다. 기준 SHA가 있는 통합 브랜치에서 새 worktree를 생성했으며 원본을 전환하지 않았다. 시작 시 실제 기존 worktree는 요청서의 9개보다 하나 많은 10개였다. 모두 보존했다.

## 결과와 범위

전체 Next.js Webpack Production build와 strict TypeScript, lint가 통과한다. 기준 25개 파일의 **498 PASS / 30 FAIL**을 같은 의존성과 환경에서 재현했다. 타입 수정 영향 파일과 UI 회귀까지 확장한 **67개 파일, 1,263개 기존 테스트**를 전후 비교했다. 테스트 삭제·skip, 검사 비활성화, `@ts-ignore`, 새로운 `any`, 보안 검증 우회는 없다.

| 항목 | 수정 전 | 수정 후 |
|---|---|---|
| 기준 관련 528개 테스트 | 498 PASS / 30 FAIL | 528 PASS / 0 FAIL |
| 확장한 기존 735개 테스트 | 678 PASS / 57 FAIL | 735 PASS / 0 FAIL |
| 신규 보안·법적 화면 회귀 | 없음 | 7 PASS |
| 관련 테스트 전체 | 1,176 PASS / 87 FAIL | **1,270 PASS / 0 FAIL** |
| TypeScript | 390 diagnostics | **0 diagnostics** |
| Page export / 전체 Production build | FAIL | **PASS** |
| lint / diff-check | PASS | **PASS** |
| 추가 과거 대운·세운 저장본 재열람 | 기존 artifact 18건 | **18/18 PASS** |

테스트 수는 중간 재실행을 중복 집계하지 않은 최종 결과다. 저장소 전체의 모든 테스트를 실행했다고 주장하지 않는다. 67개 관련 파일의 정확한 목록, 모든 실패 이름·메시지·전후 상태, 신규 7개 테스트는 [test-comparison.json](test-comparison.json)에 있다. 추가 18개 저장본 검증은 위 1,270개와 별도다.

## 근본 원인과 최소 수정

| 분류 | 확인한 원인 | 조치 / 운영 영향 |
|---|---|---|
| A. 공통 원인 | TypeScript `@/*`가 실제 소스 폴더가 아닌 저장소 루트를 가리켰다. TS2307 104건과 추론 실패가 연쇄 발생했다. | `tsconfig.json` 경로를 기존 Vitest와 같은 `./src/*`로 수정. alias만 수정한 중간 측정은 390 → 87건. strict/exclude/검사 옵션은 유지했다. |
| B. 소스 계약 결함 | `/report/new` page가 Next.js 허용 export 외의 함수 두 개를 export했다. | 동일 함수 본문을 인접 `annualYearOptions.ts`로 이동하고 page·테스트가 import. 날짜·연도·정적 페이지 계약과 고객 UI는 유지했다. |
| B. 타입 계약 결함 | 궁합 runtime은 이미 7개 canonical category와 legacy 입력을 정규화했지만 두 함수의 타입은 구형 관계 타입만 허용했다. | 기존 `CompatibilityRelationshipCategoryInput`을 적용. 점수/문장/분기 수정 없음. 두 모듈의 transpile된 JavaScript SHA256 전후 일치. |
| C. fixture/mock 결함 | 누락된 필수 chart 구조, 넓어진 결과 union의 미분기 접근, readonly/nullable/SDK mock 타입 불일치. 인증 owner 조회가 추가된 경로의 기존 SQL fixture에 external owner port mock이 없었다. | 실제 타입에 맞는 fixture, 명시적 union 분기, 외부 port mock만 수정. 음성 검증용 의도적 불완전 draft는 실패 검증을 유지한다. |
| D. 빌드 환경/설정 | 새 worktree와 기준 archive에서 Page export 오류를 재현했다. 환경변수 누락, 오래된 `.next`, Server/Client 전환이나 static/dynamic 설정이 원인이 아니었다. | Next 설정·의존성·환경 파일 수정 없음. 동일 Webpack Production 명령으로 완료까지 검증. |
| E. 과거 계약 테스트 | 1,290원, 구형 TOC 수, 초기 대운·세운 원고 hash, 동기 legacy 법적 화면을 현재 V4 출력에 기대했다. | 현행 1,490원/목차/비동기 화면 계약으로 검증을 갱신. 과거 가격 기록과 과거 edition lock 파일은 보존. 원고 hash는 수정 전 기준 SHA에서 별도로 생성해 고정했다. |
| F. 운영 잠재 위험 | 결제 prepare fixture가 잘못된 Origin으로 차단되고 있었다. 이를 통과시키려고 보안을 완화하면 실제 위험이 생긴다. | 실제 same-origin/bindCheckout 로직을 유지하고 정상 fixture Origin 및 외부 port만 수정. 누락·외부 Origin 403, binding 실패 503 테스트를 추가했다. |

### Page export 원인

[build-before.log](logs/build-before.log)의 실제 오류:

```text
src/app/report/new/page.tsx
Type error: Page "src/app/report/new/page.tsx" does not match the required types of a Next.js Page.
  "getAsiaSeoulCurrentYear" is not a valid Page export field.
```

같은 page의 `getAnnualFortuneYearOptions`도 동일하게 허용되지 않는 export였다. 해당 helper 두 개만 분리했다. `"use client"` 경계, 연도 정책 함수, Suspense, static/dynamic 설정은 바꾸지 않았다. [build-after.log](logs/build-after.log)는 타입 검사, page data, 47/47 static pages, 최적화, build traces와 전체 route 목록까지 완료한다.

### 실패 테스트 묶음

기준 30개 실패는 다음과 같이 분류됐다.

- 22개: annual checkout 21개와 annual preflight 1개가 실제 same-origin 계약에 맞지 않는 요청을 보냈다. 올바른 Origin 및 guest/binding 외부 port fixture를 사용하고 서버가 추가하는 `bookGeneration` metadata를 검증한다.
- 1개: expiry fixture에 owner lookup mock이 없어 legacy SQL 저장본까지 도달하지 못했다. 기존 공유 접근성 레이블과 만료 경계 검증은 그대로 유지했다.
- 3개: Book front/end TOC 테스트가 확장된 편집본의 실제 end TOC를 구형 9개 기준으로 판단했다. 각 chapter target과 ID 고유성 검증은 유지했다.
- 4개: love/compatibility release 경계 테스트가 후속 승인된 대운·세운 편집 이전 hash를 현재 생성 결과에 비교했다. [time-product-locks.json](../../../tests/fixtures/release-technical-01/time-product-locks.json)은 이번 수정 전 기준 SHA의 동일 payload/clock에서 생성했다. 기존 역사적 hash 파일을 덮어쓰지 않았다.

확장 검사에서 재현한 57개는 `PaidFunnel`/new-report 가격 7개, owner port 누락으로 렌더 경로가 막힌 report-result/paid-delivery 35개, 비동기 법적 화면 SSR 12개, receipt/payment-source 과거 가격 계약 2개, 이미 본문에 풀이가 포함돼 footnote가 없는 Book을 고른 fixture 1개다. 마지막 사례는 명시적인 저장 Book footnote fixture로 기존 footnote 표시 기능을 검증한다. 법적 문구 자체는 수정하지 않았으며 retained legacy 문서와 V4 문서의 전체 정책 내용을 비교하고 현재 V4 accordion 4개를 추가 검증한다.

TypeScript 코드별 390건과 중간 alias 진단은 [typescript-comparison.json](typescript-comparison.json), [원본 진단](logs/ts-before.log), [alias 조사](logs/ts-alias-investigation.log)에 있다. 나머지 87건은 잘못된 타입 계약과 테스트 fixture/narrowing 문제를 명시적으로 고쳤다. 오류 수를 줄이기 위해 test include를 제외하지 않았다.

## 콘텐츠·근거·기존 Book 보존

[sixProductIntegration.test.ts](../../../tests/unit/interpretation-v4/sixProductIntegration.test.ts)의 기존 immutable lock을 그대로 실행했다. 64건 중 정상 생성 62건의 다음 값이 기준 SHA와 정확히 같다: draft, evidence, calculations, narrative, integration, Book, snapshot, page 구조 digest. 2건의 기존 `DAYUN_UNCERTAIN` 정책 거절도 동일하다. [book-preservation.json](book-preservation.json)에 각 상품/사례/hash가 있다.

- 종합 13장·52문단, 커리어 9장·36문단, 연애 9장·36문단, 궁합 7유형·9장·36문단, 대운 14년, 세운 12개월 계약을 관련 상품 회귀에서 확인했다.
- 명리·MBTI·Fusion·근거 ID·미상 입력 안전성의 기존 lock과 본문 digest가 같다. 원고 문장은 변경하지 않았다.
- 새 62개 snapshot을 owner/shared 경로로 재열람하고 저장 JSON 불변을 확인했다. 기존 6상품 이전 Book 6권도 저장본 그대로 재열람했다.
- 이전 대운 8건/세운 10건의 별도 artifact도 재생성 없이 owner/shared 재열람했다. [legacy-books.json](legacy-books.json), [로그](logs/legacy-books.log). 입력은 기존 `/tmp/gyeol-major-reader-validation/before/` 및 `/tmp/gyeol-annual-reader-validation/before/`의 저장 JSON이다.
- V3/V2 회귀, paid delivery와 만료 검증은 로컬 SQL(PGlite) 및 보존된 저장본 fixture로 실행했다. 운영 고객 데이터에 접근하거나 변경하지 않았다.

[protected-source-parity.json](protected-source-parity.json)은 `src`, `supabase`, `public`의 기존 추적 파일 중 명시적으로 검토한 page 및 타입 전용 두 파일을 제외한 전체 byte 일치를 기록한다. [type-only-runtime-parity.json](type-only-runtime-parity.json)은 수정한 두 타입 모듈의 emitted JavaScript도 동일함을 증명한다. page helper의 본문과 기존 연도 정책 함수 호출은 그대로다.

## UI·권한·결제 안전성

기존 UI를 다시 개발하지 않았다. Book 출판의 preparing/composing/binding/covering, 실제 Worker 완료 상태, 10초 상태 갱신, hidden/reduced-motion, V4 서재 로딩, 4500ms 자동 넘김/8500ms 수동 idle, 6상품 OG, 공식 Kakao resource, 공유 준비/성공/취소/실패와 fallback, 서버 이벤트 상태 안내를 기존 unit/SSR/source 회귀로 검증했다.

결제·인증·권한·Worker·Supabase 구현과 migration은 byte 그대로다. 테스트에서만 외부 account/library port를 대체했다. missing/foreign Origin은 실제 guard에서 403, bind 실패는 checkout session 없이 503을 반환하며 외부 fetch를 호출하지 않음을 확인한다. 90일 만료 직전/정확한 경계/이후, 권한 없는 owner/shared 접근, 기존 V3/V4 저장본 검증을 유지했다. 보안 조건을 제거하거나 가짜 결제 성공을 운영 코드에 추가하지 않았다.

이 결과는 로컬 자동 회귀와 전체 production build의 결과다. 실제 운영 OAuth 완료, 실결제, 카카오 앱에서의 공유 완료, 새로운 브라우저 기기별 육안 검수를 수행했다고 주장하지 않는다. 환경 파일·Production 설정·이벤트 상태·유료 묶음 gate는 변경하지 않았다.

## 재현 환경과 명령

Node `v25.9.0`, npm `11.12.1`, Next `16.2.4`, TypeScript `5.9.3`, Vitest `4.1.5`. 원본의 동일 설치 의존성을 사용했다. 기준 SHA archive와 새 worktree에 Production 환경 파일을 복사하지 않았다. baseline `.next`를 재사용하지 않고 격리된 환경에서 재현했다.

```sh
OPENAI_REPORT_WRITER_ENABLED=0 TOSS_CONFIRM_API_ENABLED=0 PAID_REPORT_RELIABILITY_ENABLED=0 npm run build -- --webpack
./node_modules/.bin/tsc --noEmit --incremental false
npm run lint
git diff --check
./node_modules/.bin/vitest run <listed-files> --fileParallelism=false --hookTimeout=120000
```

기록한 로그는 terminal 진행 출력의 CR 및 줄 끝 공백/마지막 빈 줄만 정리했다. 진단 메시지와 종료 결과는 변경하지 않았다.

파일 목록은 [groups.json](groups.json) 25개, [extra-files.json](extra-files.json) 37개, [ui-files.json](ui-files.json) 5개다. baseline과 수정 후 같은 조건으로 묶음 실행했고 최종 재실행은 해당 파일의 결과 전체를 대체했다. 중간 실패를 PASS로 기록하지 않았다.

빌드는 이전 검증과 같은 **공식 Webpack Production 모드**다. `package.json`의 기본 bundler나 Next 설정은 바꾸지 않았다. 기본 Turbopack 명령의 별도 성공을 주장하지 않는다. build 우회 옵션은 사용하지 않았다. 최종 전체 build에서 NFT 경고 및 새 경고 유형은 관측되지 않았다. 기준 build는 trace 단계 이전에 중단돼 동일 단계의 baseline 경고 수를 측정할 수 없었다. 과거 보고서의 NFT 경고 수를 이번 실행 결과로 대체하지 않는다.

## Git·작업 공간 보존

원본 `.gitignore`, `AGENTS.md`, `supabase/.temp/` 9개 파일의 변경 전후 bytes와 status를 비교했다. 실제 기존 worktree 10개의 HEAD/status/추적·비추적 파일 SHA256도 모두 같았다. [workspace-preservation.json](workspace-preservation.json). destructive reset/clean/force push를 사용하지 않았다. 이 작업의 파일만 새 브랜치에 commit/push하며 master·기준 브랜치는 변경하지 않는다.

## 출시 체크리스트와 잔여 승인

[기존 출시 runbook](../../v4-production-activation-runbook.md)에 다음 13단계를 명시했다: 콘텐츠 보존 → 기존 UI·공유 보존 → 빌드/타입/테스트 → 최종 통합 회귀 → 응답시간/API 수 측정 후 필요한 성능 최적화 → 운영자 6권 전체 원고 검수 → Kakao 앱 아이콘 수동 등록 → Google OAuth 브랜딩 → 승인된 master 통합 → 승인된 Production 배포 → 운영 환경 확인 → 운영자 승인 후 이벤트 활성화 → 광고 집행.

V4 UI·공유와 6상품 본문은 통합 브랜치에 함께 포함되어 있으나 이번 작업은 master/Production에 반영하지 않는다. 향후 배포에서 세 범위를 함께 반영해야 한다. 성능 측정/최적화와 배포, 실제 운영 점검 및 이벤트 활성화는 이번에 실행하지 않았다.

## 최종 판정

| 요청 항목 | 판정 |
|---|---|
| ROOT_CAUSE | Page export, alias, 타입/fixture/mock/과거 기대값의 원인을 재현해 수정 |
| PAGE_EXPORT_BUILD / PRODUCTION_BUILD | PASS — 전체 Webpack Production build |
| TYPESCRIPT_BEFORE_AFTER | 390 → 0 |
| TEST_FAILURES_BEFORE_AFTER | 기준 30 → 0, 확장 포함 87 → 0; 신규 7개 포함 1,270 PASS |
| NEW_REGRESSIONS | 검사 범위 내 0 |
| SIX_PRODUCT_PRESERVATION / BOOK_PRESERVATION | PASS — 모든 기존 digest/구조/저장본 보존 |
| UI_UX_PRESERVATION | PASS — 구현 byte 보존 및 관련 자동 회귀 |
| PAYMENT_AUTH_SAFETY | PASS — 구현 무변경, 실제 guard 유지 및 음성 회귀 추가 |
| LINT_BUILD | PASS; strict TypeScript 및 diff-check PASS |
| REMAINING_BLOCKERS | 이번에 재현한 기술 오류는 해결. 별도 출시 승인·성능/실운영/원고 검수 단계는 남음 |
| RELEASE_CHECKLIST | 기존 runbook에 13단계 기록 |
| BRANCH | `v4/release-technical-stabilization-01` |
| COMMIT_SHA / REMOTE_SHA_MATCH | 최종 전달 메시지에 commit 후 실제 조회값 기록 |
| DEPLOY_READY | **NO — 기술 안정화 통과는 판매·master 통합·배포 승인이 아님** |
