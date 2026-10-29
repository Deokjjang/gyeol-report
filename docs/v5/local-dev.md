# 로컬 v5 개발 환경 (P3 G)

운영 DB·운영 키를 쓰지 않는 로컬 전용 환경이다. 모든 개발 스크립트는 DB·API 주소가 localhost가 아니면 즉시 중단한다(`scripts/dev/local.ts`의 가드).

## 한 번에 띄우기

```bash
pnpm dev:v5          # http://localhost:3100 (PORT=3200 pnpm dev:v5 로 바꿀 수 있음)
```

순서: Docker Desktop 실행(꺼져 있으면 `open -a Docker`) → 로컬 Supabase(`supabase start`, 필요한 컨테이너만) → DB 준비(`pnpm db:v5`) → `.env.development.local`의 관리 구역에 로컬 값만 기록 → 로컬 가드 → `next dev`.

## 처음 한 번만

1. 도구: Docker Desktop, `brew install supabase/tap/supabase`(2.122.0 확인).
2. OpenAI 키(실호출할 때만): `.env.development.local`에 `OPENAI_API_KEY=...` 한 줄을 직접 넣는다. 관리 구역 밖이라 `pnpm dev:v5`가 건드리지 않는다. 키가 없으면 v5 작가는 결정론 작가로만 책을 만든다(호출 0).
3. `.env.development.local`과 `.env*.local`은 git 무시 대상이다.

## 무엇이 들어가나

| 구분 | 내용 |
|---|---|
| DB | 저장소 migration 전부 + `scripts/*.sql` 패치를 정해진 순서로(`scripts/dev/v5-db.ts`의 `migrationOrder`). `001_init.sql`(레거시)과 운영 데이터 정리용 `20260920171500_production_test_data_cleanup.sql`은 제외. 적용 기록은 `local_dev.applied` 테이블이라 다시 실행해도 된다 |
| 시드 | 테스트 계정 `v5-dev@gyeol.local`(비밀번호 로그인, 공급자 표시는 google), 이용약관·개인정보 동의, 무료 이용권 20장. 상품 목록은 코드(`src/lib/payment/reportProductCatalog.ts`)에 있어 테이블 시드가 없다 |
| 환경 변수(관리 구역) | `NEXT_PUBLIC_SUPABASE_URL`·`SUPABASE_URL`·`NEXT_PUBLIC_SUPABASE_ANON_KEY`·`SUPABASE_SERVICE_ROLE_KEY`(로컬 기본값), `LOCAL_DB_URL`, `CRON_SECRET`(무작위), `WRITER_V5_PRODUCTS`(6상품 전부), `LLM_PROVIDER=openai`, `LLM_MODEL=gpt-4o-mini`, `TICKET_WORKER_MAX_RSS_MB=16384`(개발 모드 전용: next dev의 RSS가 수 GB라 워커 메모리 상한을 올림, 운영은 1.25GiB 그대로) |

## 책 만들어 보기

공개 이용권 API(`/auth/ticket-redeem`)와 로그인(카카오·구글)은 운영 도메인 출처만 받는다(로컬 예외 없음 — 보안 설계라 바꾸지 않았다). 그래서 로컬에서는 같은 서버 함수·같은 RPC로 접수하고, 로컬 서버의 워커 라우트로 책을 만든 뒤, 테스트 계정 쿠키로 책 페이지를 연다.

```bash
pnpm exec tsx scripts/dev/v5-e2e.ts --no-key   # 호출 0: 7권(6상품 + 궁합 1유형 추가) 접수 → 워커 → 페이지 확인
pnpm exec tsx scripts/dev/v5-e2e.ts            # 실호출(OpenAI), 기본 상한 $1, 비용은 docs/v5/api-cost-log.md
```

결과표는 `docs/v5/p3-e2e.md`(실호출), `docs/v5/p3-e2e-nokey.md`(호출 0). 회수 크론은 `GET /api/internal/report-writer-recovery`(Bearer CRON_SECRET, 로컬에서는 직접 호출 — `vercel.json` 등록은 운영 적용 때 승인 후).

## 브라우저에서 읽기

로컬에는 OAuth 로그인이 없으므로 개발 전용 로그인 라우트로 테스트 계정 쿠키를 심는다(next dev + 로컬 Supabase일 때만 동작, 그 밖에는 404):

```
http://localhost:3100/dev/v5-login?next=/reports/<reportId>
```

reportId는 `docs/v5/p3-e2e.md`·`p3-e2e-nokey.md`에 있다. 내 서재는 `?next=/account`.

## 끄기

`Ctrl+C`로 next dev를 끄고, DB까지 끄려면 `supabase stop`.
