# V4-VERCEL-FUNCTION-TRACE-FIX-01

기존 로컬 SQL fixture 로더의 파일 경로만 고정했다. 연구 자료를 삭제·축소하거나 생성 엔진·결제·인증·운영 DB·배포 설정을 변경하지 않았다.

- 기준: `v4/compatibility-business-partner-product-knowledge-01` / `ab67b555609876a0e5520c741716c5236b973c51`
- 작업: `v4/vercel-function-trace-fix-01`, 독립 `/private/tmp/gyeol-vercel-function-trace-fix-01`
- 원본 checkout: `v4/annual-editorial-quality-fix-01` / `c048218cc5961e0f53a1deab2603511e17559fc3`

## 원인과 수정

기준 Vercel Preview `dpl_7JVzsQfBYVJ2EW9gw6gkmiqT4ffw`는 `dev/account/api/[action]`의 uncompressed size 255.74MB로 실패했다. Vercel의 기본 `next build`는 Turbopack이고, 로그에 전체 프로젝트가 의도치 않게 추적된다는 경고가6개 있었다. 같은 기준의 로컬 기본 빌드에서도 같은 유형의 경고9개와 과도한 NFT 목록을 재현했다. 플랫폼·추적 출력 차이에 따른 경고 개수 차이를 별도 기록했다.

`src/lib/tickets/localDatabase.ts`의 `readFile(file)`은 반복 변수에 폴더 접두사가 없다. Turbopack이 이를 프로젝트 전체에 걸친 동적 파일 읽기로 추적하면서 개발 SQL fixture와 무관한 검증 문서·연구 원본·테스트·public 파일까지 함수에 포함했다. `next.config.ts`가 경고에 등장하는 것은 전체 프로젝트 추적의 징후이며, 설정 파일을 수정해야 한다는 의미는 아니었다.

수정은 해당 파일 한 곳이다. `process.cwd()`를 기준으로 `supabase/migrations`와 `scripts`를 명시하고 동적 파일명을 그 폴더 안에서만 결합한다. 기존 번호 migration 정렬·BOM 처리, reliability SQL → 복구 patch3개 → V4 SQL3개의 순서·본문·bootstrap SQL은 유지했다. 새 SQL·쿼리·권한·재시도·API를 추가하지 않았다.

`bundleLocalReview.ts`, 개발 API 두 route, `next.config.ts`는 변경하지 않았다. `outputFileTracingExcludes`, `turbopackIgnore`, `VERCEL_SUPPORT_LARGE_FUNCTIONS`도 사용하지 않았다.

## 파일 추적 결과

단위는 로컬 NFT 상대 경로를 실제 파일로 해석해 합산한 MiB다. Vercel 로그의255.74MB와 로컬255.67MiB는 서로 다른 환경의 측정이며 같은 값으로 단정하지 않는다. Vercel의 최종 함수 패키징과 정확히 동일한 수치라고 주장하지 않는다.

| 대상 | 수정 전 | 수정 후 |
|---|---:|---:|
| `/dev/account/api/[action]` 파일 수 | 3,847 | 430 |
| 같은 함수 파일 크기 | 255.67MiB | 30.26MiB |
| 같은 함수의 `docs/validation` | 163.18MiB | 0 |
| 같은 함수의 raw `src/lib/report-knowledge` | 39.27MiB | 0 |
| 로컬 전체 프로젝트 추적 경고 | 9 | 0 |
| 가장 큰 app trace | 274.60MiB | 52.09MiB |

실제 필요한 MBTI JSON·font·Next chunks·로컬 PGlite 및 SQL 자산은 남는다. 런타임 코드에 필요한 명리 지식이 제거된 것이 아니라, compiled chunks와 별개로 추가되던 raw 프로젝트 파일의 무차별 추적이 제거된 것이다. [전체 route 요약](trace-summary.json)과 [제거된 raw 파일 목록](removed-project-files.json)에 파일별 기여도를 기록한다.

## 동작·보존 검증

- 기존 로컬 SQL·계정·이용권·mock checkout·차단 테스트5파일96건의 변경 전후 결과를 비교한다. 새2테스트는 실제 SQL 본문·순서·기존 BOM 처리와 절대 하위폴더 경로를 확인한다. 새 범위 검사는 수정 전 실패하고 수정 후 통과한다.
- 실제 SQL loader가 읽는20파일과 전체 실행 SQL digest를 비교한다. 운영 DB에 SQL을 적용하지 않는다. 기존 테스트는 PGlite 로컬 fixture만 사용한다.
- 실제 로컬 Production 서버에서 개발 API2개 × GET/POST × Host3종의12요청이 모두404다. 위조 쿠키·쿼리로 활성화되지 않는다.
- 실제 로컬 개발 서버에서 localhost/127.0.0.1의 guest 세션200, bundle state401, 외부Host404를 확인한다. 기존 전체 localhost mock 승인·지급·복구 시나리오도 테스트한다. 실제 금융 작업은 없다.
- 기존6상품 고정 통합64테스트와 사업 파트너 실제 생성46테스트를 수정 전후 실행한다. 고정 시각·가상 입력·disabled writer·`externalCalls=[]`를 사용한다.44성공 관찰의 계산·전체Evidence·원고·integration·개인A/B·Book308digest와 전체46관찰을 비교한다.
- 기존 tracked3,532파일 중 로컬 로더1파일 외3,531개를 byte hash로 검증한다. 명리 연구·지식 source532파일, 이전 validation1,257파일을 전부 보존한다. 기존 구매자 Book 조회·변경·재생성은 없다.
- 기존 worktree30개·원본 미커밋11개를 HEAD·브랜치·status·모든 tracked/nonignored untracked 파일 hash로 비교한다. 새 worktree 외 checkout은 변경하지 않는다.

실행 결과: 기존 로컬 기능 96/96 → 신규 검사 포함 98/98, 6상품·사업 파트너 회귀 110/110 → 110/110이다. 수정 후 관련 8파일 208건이 모두 통과했으며 실패·skip은 0건이다. 44개 성공 관찰의 308개 digest와 46개 전체 관찰, domain 근거 관찰이 변경 전후 일치했다. SQL 실행 digest도 `5d12baa1db3a63db4211a82f2f728060649a47aa858301a84d61139bf8c64237`로 동일하다.

`pnpm exec tsc --noEmit --incremental false`는 진단 0건, lint 및 `git diff --check`는 PASS다. 기본 Production build는 수정 후 두 차례 PASS, 경고 0건이며 최종 NFT 결과도 첫 수정 후 빌드와 일치한다. 실제 서버 HTTP 검증 18건과 기존 worktree 30개·미커밋 11개 hash 비교도 통과했다.

관련 검사 결과는 [validation-results.json](validation-results.json)에 기록했다. 전체 테스트 suite를 재실행한 결과로 과장하지 않는다. 이번 범위의 관련 회귀만 실행하며 과거 별도 범위의 27실패를 수정·삭제·skip하지 않았다. 의존성은 기존 lockfile로 독립 설치했고 manifest·lockfile은 변경하지 않았다. 로컬 pnpm 10.33.0과 기준 Vercel pnpm 10.28.0의 환경 차이는 있으나 Next.js 16.2.4와 잠긴 의존성 버전은 동일하다.

## Vercel Preview

기준 실패의 project는 `gyeol-report` / `prj_Iqp9hru3W1oQ6YLvGmvWl98yDUbc`, GitHub `Deokjjang/gyeol-report`다. 신규 작업 브랜치 push의 Preview에서 동일 project·branch·정확한 commit SHA·READY를 확인한다. 최종 URL·원격 SHA·READY 증거는 최종 응답과 `/tmp/gyeol-vercel-function-trace-fix-01-validation/preview-receipt.json`에 남긴다. 이 보고서 자체의 commit SHA를 본문에 내장하지 않는다.

Production 설정·환경변수·master·Production 배포는 변경하지 않는다. 다음 연구 작업을 시작하지 않는다.

## 참고

설치된 Next.js16.2.4의 `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/output.md`를 확인했다. [Next.js Output File Tracing](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)은 import·require·fs 정적 분석과 좁은 추적 범위를 설명한다. [Vercel Functions 제한](https://vercel.com/docs/functions/limitations)의 기본 제한을 올리는 대신 불필요한 추적의 원인을 수정했다.
