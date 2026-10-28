@AGENTS.md
# 결리포트 v5

**원고·설계·브리프·작가·UI 작업 전 반드시 `docs/v5/SPEC.md`를 읽는다 (제1원칙).** 분량·상품 구조·방어 4겹·LLM 정책은 SPEC이 기준이다.

## 가치 기준
본질·가치·미니멀리즘. 시간·비용 최적해. 복잡하면 줄인다.

## 제품
사주×MBTI 엔터형 리포트. 핵심 가치=재미(내 얘기 느낌). 초·중등도 이해하는 쉬운 직설체.
장점 위주 + 중간중간 근거 있는 팩폭. 확정 예언 금지(결혼 시기, 특정 사건 등).
상품 키: saju_mbti_full / career_money_study / love_marriage_child / saju_mbti_compatibility / major_fortune / annual_fortune
(`src/lib/payment/reportProductCatalog.ts`). 궁합 7관계: `src/lib/report-generation/reportInputTypes.ts`.

## 원고 규칙
근거(계산·DB) 없는 주장 금지. 시간 미상→시주 생성 금지. MBTI 없음→MBTI 근거 날조 금지.
같은 성향 반복 금지(챕터별 새 정보). 분량은 정보량의 결과이며 초과 허용(수치는 SPEC §1).

## 만세력 정책 (현행 코드 사실 — 바꾸려면 정책 결정 먼저)
- 계산 기준·보정·시간 미상 처리: `docs/manseryeok-policy.md`, `src/lib/saju/*`. 골든 테스트 `tests/unit/saju/canonicalCalendar.test.ts`.
- 계산 로직을 바꾸면 `SAJU_CALENDAR_VERSION`(`saju/calendarVersion.ts`)을 올리고, 기존 고객 Book 영향을 보고한 뒤 승인받는다.

## 모듈 지도
- 원고 생성: `src/lib/report-generation/generateProductReport.ts` 단일 진입. 결정론 빌더 `interpretation-v3`, v4 Book `interpretation-v4/runtimeShadow.ts`.
- LLM: `src/lib/llm/` 공급자 교체형 어댑터(streamCompletion). 재시도 정책은 작가 단계에서 정한다.
- 워커: Vercel cron `/api/internal/report-jobs`, `/api/internal/report-ticket-jobs`, `/api/internal/meta-events` (`vercel.json`).
- 결제: Toss confirm `src/app/api/payments/toss/confirm/route.ts` → `src/lib/payment/paidReportReliability.ts`.
- 이용권·이벤트: `src/lib/tickets/*`, `growth/*`, `referrals/*`, `coupons/*`. 규칙 원본은 SQL RPC(`supabase/migrations/*v4_*`).
- 지식 DB(v5): `src/data/knowledge-v5/**`, 검사 `scripts/knowledge-lint.ts`.

## 대형 데이터 (직접 읽기 금지 — grep·범위 읽기만)
`docs/validation/**`, `src/lib/report-knowledge/**`, `tests/fixtures/**` 대형 JSON, `tools/**` 산출물.

## 권한
v5 전권: 구조·코드 변경 허용(기존 계산 포함). 단, 아래는 **승인 필요**:
- master 변경, push(새 작업 브랜치 push는 작업 지시에 있을 때만), Production 배포
- 운영 DB 접근·쓰기, migration 적용(`scripts/*.sql` 수동 패치 포함)
- 결제·환불, 고객 Book 스냅샷 삭제/변경
- 이벤트 일정·보상 변경(TS 상수와 SQL 함수에 중복 하드코딩), Meta 동의 문구·버전 변경

## 비밀값
- 키·토큰·`service_role`·JWT는 출력·로그·커밋 금지. `.env.local`은 필요한 변수 한 줄만 복사하고 값을 echo하지 않는다.
- `vercel env pull`로 Production 변수를 받지 않는다. Vercel/Toss/OpenAI/Anthropic 키 관리 페이지에 접근하지 않는다.
- Anthropic 실호출은 P6 최종 단계 전까지 금지. 외부 API 실호출은 `docs/v5/api-cost-log.md`에 기록하고 상한을 지킨다.

## Git
작업 전 branch/HEAD/status 확인. 미커밋 파일 보호. reset/clean/stash/rebase/force push 금지. 작업별 worktree.
- 기준선은 `origin/master`(= Production). 분기 전 `git fetch`, `git worktree add -b <branch> <path> origin/master`.
- 가져오기는 경로 기반 복원(`git checkout <branch> -- <path>`)만 사용한다.
- 빌드 해시 클래스(`*-module__xxxx__*`)를 전역 CSS로 직접 지정하지 않는다.

## 명령
- 설치 `pnpm install --frozen-lockfile` / 타입 `pnpm exec tsc --noEmit` / 린트 `pnpm lint` / 테스트 `pnpm test`(vitest, 네트워크 가드) / 빌드 `pnpm build`
- 특정 테스트 `pnpm exec vitest run tests/unit/<영역>`. 출시 전 일괄 `pnpm release:check`.
- 기준선: `docs/baseline-failures.txt`. 여기 없는 실패는 신규 실패다.

## 검증
PASS/PARTIAL/FAIL/UNVERIFIED. 테스트 통과≠판매 품질 통과. 기존 오류와 신규 오류 구분.
보고에는 실행한 명령과 결과 수치를 적는다. 실행하지 않은 항목은 UNVERIFIED.

## 토큰
탐색은 서브에이전트. grep 우선, 큰 파일은 범위 읽기. 전체 디스크 탐색(`find /`) 금지 — 저장소·worktree 안에서만. 작업당 세션 분리.
