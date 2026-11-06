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

## 비용 (최종판 0, 덕짱님 결정 2026-11-04)
- 작가는 한 번만 부른다. 작가 원고가 나오면 그 책은 완성본이 된다: 검사 → 걸린 문장만 수리(1회) → 그래도 사실·금지 규칙이면 그 소제목만 재작성(1회) → 그래도면 그 소제목을 뺀다(장은 비우지 않는다).
  책·장을 버리고 다시 만드는 경로는 없다. 예외는 API가 중간에 끊겨 빠진 장만 이어 쓰는 것 하나. 운영(⑦ 감독)과 개발 도구는 같은 발행 함수(`buildV5Snapshot`)를 쓴다.
- 원문 보관: 작가·수리 원문은 입력 해시(모델 + 지침 + 브리프·장 목록)로 남긴다 — 운영은 Book `meta.raw`(스키마 변경 없음), 개발은 `.cache/writer/`. 같은 입력이면 다시 부르지 않는다.
- 검사·표기·렌더만 바뀌면 `pnpm book:replay <책>`(호출 0)만 쓴다. 재료·선택 로직 수정은 `pnpm book:brief <사례>`(호출 0)로만 확인한다.
- 개발용 유료 호출은 모두 `tools/llm/budget.ts`를 지난다: 실행마다 예산 필수(`--budget`, 개발 서버는 `LLM_BUDGET_SCOPE`·`LLM_BUDGET_RUN`), 원장 `.cache/llm-ledger.json` + `docs/v5/api-cost-log.md`.
  누적이 상한을 넘게 되는 호출은 부르기 전에 거절, 시작 전 예상 비용(권당 실측 최대 × 1.3)이 남은 예산보다 크면 시작하지 않음, 같은 입력 해시로 재생성하면 거절.
- 운영 주문당 상한: 결제 주문은 비용으로 보류하지 않는다. 작가는 늘 부르고, 예상 비용이 `ORDER_COST_CAP_USD`(기본 $0.55)를 넘으면 검수·수리만 건너뛴다.
- **권 전체 재생성과 예산 상향은 덕짱님이 채팅에서 승인한 경우만.**

## 품질 하한선 (덕짱님 결정 2026-11-04)
- 원칙: P6d 수준이 하한선이고, 그 이상으로만 간다.
- 판정은 "객관 결함 0 + 덕짱님 판독"으로 한다. 지표(분량·근거 수 등)는 참고로만 본다. 장별 자동 '나빠짐' 판정은 하지 않는다.
- 객관 결함: 판독에서 인용된 결함 문장 꼴, 내부 용어·장 안 면책·고아 문장·사전 밖 한자, 엔진 대조(기둥·세기·오행 개수·신살 주인·직군) 위반, 뺀 소제목·문단.

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

## 진행 방식
- 결정이 필요하면 멈춰서 보고하지 말고 AskUserQuestion으로 선택지를 묻고 답을 받아 즉시 진행한다. 보안·비용에 무관한 사소한 판단은 SPEC 우선순위(근거 → 재미 → 단순함)로 스스로 정하고 기록한다.
- 필요한 도구·패키지는 직접 설치한다. 사용자에게 수동 작업을 요청하지 않는다(비밀값 입력 제외).
- 개발 DB는 로컬 Supabase(Docker Desktop 실행 포함, P3에서 설정).

## 토큰
탐색은 서브에이전트. grep 우선, 큰 파일은 범위 읽기. 전체 디스크 탐색(`find /`) 금지 — 저장소·worktree 안에서만. 작업당 세션 분리.
