# 세운·대운 v5 출시 체크리스트

AM2-5 4부에서 만들었다(2026-11-12). 이 목록은 코드와 확인 방법만 적는다.

- 배포, 운영 DB 쓰기, 운영 환경변수 변경, migration 적용은 모두 덕짱님 승인 뒤에 한다.
- 운영 설정 값은 2026-11-12에 읽기 전용으로 확인했다(Vercel 프로젝트 `prj_Iqp9hru3W1oQ6YLvGmvWl98yDUbc`, production).
- 순서는 위에서 아래로다. 항목마다 「확인」을 마친 뒤 다음으로 간다.

## 1. 배포 전 — 코드

| # | 항목 | 명령 · 위치 | 통과 기준 | 2026-11-12 상태 |
|---|---|---|---|---|
| 1-1 | 앱 형식 검사(빌드와 같은 범위) | `pnpm typecheck` | 오류 0 | 0 · 최대 3.49GB |
| 1-2 | 전체 형식 검사(tests·tools 포함) | `pnpm typecheck:all` | 오류 0 | 0 · 최대 4.61GB |
| 1-3 | 빌드(기본 heap, `NODE_OPTIONS` 없이) | `pnpm build` | exit 0 | 통과. TypeScript 단계 20.5초, 최대 3.6GB |
| 1-4 | 린트 | `pnpm lint` | 오류 0 · 경고 0 | 15절 검증표 |
| 1-5 | 전체 시험 | `pnpm test` | `docs/baseline-failures.txt` 밖 새 실패 0 | 15절 검증표 |
| 1-6 | 공유 회귀 시험 두 곳 | `pnpm exec vitest run tests/unit/sharing/bookShareV5.test.tsx tests/unit/sharing/bookShareWebkit.test.ts` | 통과. 형식 표에 `major_fortune` · `annual_fortune`이 있다 | 두 형식이 표에 있다. 통과 여부는 15절 |
| 1-7 | 출시 묶음 | `pnpm release:check` | test → lint → typecheck:all → build 모두 통과 | — |

**빌드 범위.**

- 빌드 형식 검사는 `tsconfig.json`이 정한다. 이 파일은 `tests/` · `tools/` · `scripts/` · `vitest.config.ts`를 뺀다.
- 전체 검사는 `tsconfig.all.json`이 한다.
- `next.config.ts`는 v4 검증 해시로 고정돼 있어 손대지 않았다.
- Vercel 빌드에 `NODE_OPTIONS`를 둘 필요는 없다. 그래서 환경변수는 바꾸지 않는다(덕짱님 결정 14-7 5번 (가)).

## 2. 배포 때 — DB

| # | 항목 | 방법 | 통과 기준 |
|---|---|---|---|
| 2-1 | `generation_hold` migration 적용(덕짱님 결정 14-7 5번 — 배포 때) | `supabase/migrations/20261112100000_v5_am2_generation_hold.sql`. 저장소가 아니라 CLI 임시 폴더에서 한다. 적용된 migration 이름마다 빈 자리표시 파일을 두고 이 파일만 더한다. `supabase db push --linked --dry-run`에 이 파일 하나만 나와야 한다. 그다음 `--yes`로 적용한다 | dry-run 목록이 이 파일 하나다. 적용 뒤 `supabase_migrations.schema_migrations` 최대 버전이 `20261112100000`이다 |
| 2-2 | 적용 전후 대조 | 함수 md5(`pg_get_functiondef`)와 표 행 수를 적용 전후로 잰다 | 바뀐 것은 이 migration이 만든 것뿐이다 |

- 적용 전에는 생성 보류 경보가 운영 알림 표에 들어가지 못한다(14-7 5번).
- 그래서 판매를 열기 전에 적용한다.

## 3. 배포 때 — 운영 설정(환경변수, 승인 필요)

| # | 변수 | 지금 운영 값(2026-11-12 읽음) | 출시에 필요한 값 | 무엇을 정하나 |
|---|---|---|---|---|
| 3-1 | `WRITER_V5_PRODUCTS` | `saju_mbti_full,career_money_study,love_marriage_child,saju_mbti_compatibility`(4종) | 끝에 `,major_fortune,annual_fortune`을 더한 6종 | 세운·대운을 v5 장 묶음 작가로 만드는지. 빠지면 v4 경로로 만들어진다. 세운이 시각 미상 대운 고객을 받는 것도 v5 경로에서만이다(14-7 4번) |
| 3-2 | `FORTUNE_SALES_OPEN` | 없음(= 닫힘) | `1` | **끄기 스위치.** `1`이 아니면 세운·대운 판매가 닫히고 「12월 1일에 다시 만나요」 안내가 나간다(`src/lib/ops/config.ts`). 정적 화면은 60초 안에 따라온다 |
| 3-3 | 판매 시각 | 코드 상수 `FORTUNE_SALES_OPEN_AT = 2026-12-01T09:00:00+09:00` | 그대로(바꾸려면 코드 변경) | 3-2가 켜져 있어도 이 시각 전에는 닫힌다. 운영 빌드는 시험용 `FORTUNE_SALES_OPEN_AT_TEST`를 읽지 않는다 |
| 3-4 | `FORTUNE_PRICE_MAJOR_KRW` · `FORTUNE_PRICE_ANNUAL_KRW` | 없음(= 팔지 않음) | 덕짱님이 정한 가격(원, 100 이상 정수) | 비어 있으면 판매를 열어도 팔지 않는다 |
| 3-5 | `NEXT_PUBLIC_FORTUNE_PRICE_MAJOR_KRW` · `NEXT_PUBLIC_FORTUNE_PRICE_ANNUAL_KRW` | 없음 | 3-4와 같은 값 | 화면에 보이는 가격이다. 빌드 때 새겨지므로 값을 넣은 뒤 다시 배포해야 한다 |
| 3-6 | `ANNUAL_PRODUCT_YEAR` | 없음(= 기본 2027) | 비워 두거나 `2027` | 세운 신년판 해 |
| 3-7 | `ORDER_COST_CAP_AM_USD` | 없음(= 기본 $1.0) | 비워 둔다 | 세운·대운 주문당 상한. 넘을 것 같으면 검수·수리만 건너뛴다(작가는 늘 부른다) |

- 3-1을 바꾼 뒤 서버 시작 경고 `WRITER_V5_PRODUCTS_MISMATCH`가 없어야 한다(`src/instrumentation.ts`, 기대값은 6종).
- 지금 운영 값이 4종이라, 지금 코드가 배포되면 이 경고가 한 줄 남는다. 동작은 바뀌지 않는다.

## 4. 배포 뒤 — 확인

| # | 항목 | 방법 |
|---|---|---|
| 4-1 | 배포 READY | Vercel 배포 상태 |
| 4-2 | 운영 알림 봇 다시 등록 | `ops_settings.telegram_webhook` 값이 새 배포 id와 같은지 본다(1분 ops-notify cron) |
| 4-3 | 판매 닫힘(판매 시각 전) | `/products`에서 세운·대운이 닫힘 안내로 나오는지 본다. 결제 진입점이 `PRODUCT_SALES_CLOSED`를 내는지 본다 |
| 4-4 | 판매 열림(판매 시각 뒤) | 가짜 결제 없이 화면 가격과 3-4·3-5 값이 같은지 본다 |
| 4-5 | 끄기 | 문제가 생기면 `FORTUNE_SALES_OPEN`을 지우거나 `0`으로 둔다. 정적 화면은 60초 안에 닫힌다. 이미 결제된 주문은 그대로 만들어진다 |
| 4-6 | 보고 기록 반영 | 배포 뒤 보고 커밋은 v5/main과 **master** 모두에 병합한다(2026-11-10 교훈) |

## 5. 출시 관문(세운·대운, AM2-5 3부 — 판독으로 정한다)

1. 차단 0
2. 경계 가운데 「고객이 알아챌 것: 예」 0
3. 「이 사람만의 문장」이 있는 key가 3분의 2 이상
4. 덕짱님이 같은 사람의 달·해 장을 P4와 P5로 나란히 읽고, P5가 낫다고 판단

- 경미는 점수로만 기록하고 관문에 넣지 않는다.
- 잣대는 [annual-major/rubric.md](annual-major/rubric.md)다.
- 판정은 [annual-major/am2.md](annual-major/am2.md) 15절에 있다.
