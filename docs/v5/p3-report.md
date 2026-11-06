# P3 완료 보고 — 작가·안전망·발행 경로

브랜치 `v5/p3-writer`(v5/main 4d6f9d17에서 분기) → `v5/main` fast-forward 병합. 진행·결정 기록 `docs/v5/p3-progress.md`(결정 9개). 실호출은 OpenAI만, Anthropic 호출 0.

## 요약

| 항목 | 결과 | 판정 |
|---|---|---|
| A1 MBTI 연결 밀도 | Fusion 일간·십성 × 16유형 320쌍 완비(신규 264). c1 브리프 연결 4/10 → **8/10**, 표본 15건 80~100%, 성질 테스트 48건 모두 ≥70%·핵심 특성 정확 유형·같은 글자·기능 ≤2 | PASS |
| A2 오행 단일 판단 | 엔진 `judgeElementBalance` 한 번 계산 → 브리프·hit·올해 한 줄·타임라인·궁합 공통. c1: 물 가장 강함(38%)·쇠 가장 약함(1.5%)·불 보통 | PASS |
| A3 문체 규칙 | 옛 부정 낱말·면책문·과거 단정 금지(lint·안전망·Fusion 도구 공통 패턴), 데이터 38문장 교체 | PASS |
| A4 팩폭 자리 조건 | 조건절 대조(자리·인접 십성·관계·오행 다소·신살 동반·계절), c1 근거 없는 팩폭 2개 제거 | PASS |
| A5 분량 | 장 1,000~1,250자 고정, SPEC 총량 갱신 | PASS |
| A6 기본값 표 | `docs/v5/p3-defaults.md` 27항목(값·근거·대안·판정 칸) | 판정 대기 |
| B 작가 지침 | 시스템 지침 추정 1,120토큰(테스트로 ≤1,500 강제), 예시 2개, 캐시 접두부 2,331토큰 | PASS |
| C 실행기 | 스트리밍 1회, 장 경계 저장, 출력 0 실패만 재시도, 끊김·length면 이어쓰기 1회, 작가 lease 15분, 회수 크론 | PASS |
| D 안전망 | 문장 삭제 11규칙, 장 60% 미만 교체, 키 보충, 장별 source·사유 기록 | PASS |
| E 결정론 작가 | 6상품 + 궁합 7유형 결정론 책이 안전망 위반 0 | PASS |
| F Book 연결 | v5 스냅샷 → 기존 BookData 렌더러, 메타데이터, 플래그 기본 비어 있음 | PASS |
| G 로컬 DB | 로컬 Supabase·migration 38개·시드·가드·`pnpm dev:v5` | PASS |
| H 종단 | 실호출 7권 + 잘림 시험 1권 저장·열림($0.0309), 실패 주입 8시나리오 전부 저장·열림 | PASS |
| I 전체 원고 | c1 종합·c2 연애 2회, `docs/v5/p3-fullbook.md` | PARTIAL(c1 분량) |
| J 게이트 | lint 0·tsc 0·eslint 0/0, 관련 테스트 통과, 기준선 대비 신규 실패 0 | PASS |
| 판매 품질 | 브라우저에서 사용자가 읽는 판단은 아직 없음 | UNVERIFIED |

## A. 품질 보강

**MBTI 연결 밀도(전 → 후)**: 일간·십성 Fusion이 320쌍 중 56쌍 → 320쌍. 브리프 규칙: 1장 핵심 특성(일주·일간)은 정확한 유형 연결(일주에 없으면 그 일간 × 유형 Fusion), 그 밖의 특성은 dimensionTags 공명·긴장 점수로 계산 연결(차원 설명으로 why 조립, `source: "computed"` = 계산 연결), 특성 70% 이상 연결, 같은 MBTI 글자·기능은 책 전체 2회까지. c1 종합 4/10 → 8/10(Fusion 3·mbtiLink 4·계산 1), c2 10/10, 표본(5명 × 3상품) 80~100%.

**c1(丙子 己亥 丁丑 乙巳) 오행**: P2의 "불이 많다"(올해 한 줄 "이미 많은 불을 더 보탭니다")와 "수 과다"(trait)는 둘 다 기존 weighted 라벨(합 ≥3이면 STRONG)에서 나왔다. 불 3.6 = 丙·丁·巳 3자 + 巳 지장간 丙 0.6, 물 3.5 = 子·亥 2자 + 癸 0.6·壬 0.6·丑의 癸 0.3. 월령을 보지 않는 절대 기준이라 둘 다 과다였다. 단일 판단(겉 글자 + 지장간 + 월지 ×2): 물 5.1(38%) **가장 강함·많음**, 불 3.6(27%) 보통, 쇠 0.2(1.5%) **가장 약함·부족**. 올해(丙午) 한 줄: "불 기운이 들어오는 해입니다. 태어난 날의 기운과 같은 기운이라 내 힘이 보태집니다." 가중치는 `docs/manseryeok-policy.md` §6.

**문체·데이터**: 옛 부정 낱말(흉·길흉·액운·재앙·재난·불길하다·과부 등)과 옛 해석 면책문("겁주는 옛 풀이가 있지만", "~라는 예언이 아닙니다"), 과거 경험 단정을 lint·안전망이 같은 정규식으로 막는다. 지식 DB 38문장 교체(음착양차·원진·백호·고신·월살·육해·형·십이운성 8개 등).

## B~F. 작가 경로

- 지침 `src/lib/writer/prompt/`(v5-3): 시스템 지침 + 문체 예시 2개(P2 c2 종합 2장, c1 연애 5장을 A-3 규칙에 맞게 고친 판, 고객 이름은 [이름]으로 가림) = 캐시 접두부. 브리프는 사용자 메시지(내부 값 제거, 대운·세운 반복 장은 keys로 묶음). 출력 "## N. 제목" → "### 소제목" 3~5개, 반복 장은 "### {key}".
- 실행기 `runner.ts`: max_tokens = 장 상한 합계 × 글자당 토큰(1/1.5, P2 추정 — q3 실측은 잔액 부족으로 없었음) × 1.3, 모델 상한으로 자름. 저장소가 lease를 잃었다고 하면 스트림을 끊는다.
- 이용권 큐(로컬 전용 migration `20261029130000_v5_writer_jobs.sql`): v5 작업만 작가 lease 15분(> maxDuration 800초)·정산 기한 25분, 상태는 RUNNING 그대로(기존 정산·환불 집계가 계속 본다). `save-chapter`·`chapters`·`recover` 액션, 회수 크론 `/api/internal/report-writer-recovery`. 중복 claim 불가·회수 중복 불가·이전 토큰 거부를 PGlite 테스트로 증명. 테스트가 발행 거부 조건의 NULL 논리 버그를 잡아 고쳤다.
- Book: `productVersion: "v5"` 스냅샷(장·소제목·문단 + 대운·세운 카드 + 만세력·MBTI 표 고정) → `projectV5Book`이 기존 페이지(cover·input·manse·mbti·narrative·timeline/months·contents·back)로 투영. 메타데이터: 작가 모델, 지침·지식·브리프 버전, 브리프 해시, 토큰, 비용, 호출 기록, 장별 source·사유·근거 요약(쉬운 이름 3~5개), 안전망 삭제 수.
- 플래그 `WRITER_V5_PRODUCTS` 기본 비어 있음: claim 인자가 이전과 같고(테스트), 결제(paid) 경로는 바뀌지 않는다.

## H. 종단 시험

**실호출(OpenAI gpt-4o-mini, 로컬 서버 `pnpm dev:v5` + 로컬 Supabase)** — `docs/v5/p3-e2e.md`, `scripts/dev/v5-e2e.ts`

접수는 이용권 서버 함수와 같은 RPC(`enqueue`), 제작은 로컬 서버 워커 라우트(`/api/internal/report-ticket-jobs`), 확인은 테스트 계정 쿠키로 `/reports/<id>` 페이지 200 + 1장 제목 포함. 공개 API(`/auth/ticket-redeem`)는 운영 도메인 출처만 받는 보안 설계라 로컬에서는 쓰지 않았다(결정 5).

| 사례 | reportId | 최종 상태 | 페이지 | 장별 source | 호출(종료) | 입력/출력 토큰 | 비용(USD) | 소요(초) | 출력 글자/토큰 |
|---|---|---|---|---|---|---|---|---|---|
| 종합 · c1 하람(정시·ENTJ) | `report_a097f5cd6df34347a8815c8366109b16` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 13 | complete | 12161/2198 | 0.00314 | 53 | 1.70 |
| 커리어 · c1 하람 | `report_26e3eab9facc47f8b89d9933e282838d` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 9 | complete | 11915/2525 | 0.00330 | 32 | 1.74 |
| 연애 · c2 서윤(시간 미상·INFP·연애 중) | `report_42ed83becf4c41dca04a71665e86b2b5` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 7 | complete | 11996/2901 | 0.00354 | 28 | 1.75 |
| 대운 · 지우(ISFJ) | `report_c7c63f173b0342bba65d1011580dfc8a` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 3 | complete | 19833/1934 | 0.00414 | 20 | 1.76 |
| 세운 2026 · 도윤(ESTP) | `report_d4b7d7e000314f10a6e66219886d4de4` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 3 | complete | 18776/1914 | 0.00396 | 23 | 1.73 |
| 궁합 연인 · 하람×지우 | `report_3125e68b79cb4538bd1ec84ff249cd6e` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 1 · deterministic 8 | complete | 15085/2654 | 0.00386 | 20 | 1.72 |
| 궁합 동료 · 도윤×서윤(B 시간 미상) | `report_df14398dc9f945d19d3089000032c70a` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 9 | complete | 15642/2407 | 0.00379 | 22 | 1.71 |
| 종합 · c1 하람 — 출력 상한 1,200토큰(잘림 시험) | `report_9d25497e3cc1443081690f36ad9fd44e` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 11 · writer 1 · continuation 1 | length→length | 24577/2400 | 0.00513 | 56 | 1.74 |

- 실호출 7권 + 잘림 시험 1권 모두 저장·열림. 비용 **$0.0309**(상한 $1), 누적 $0.03088500(`docs/v5/api-cost-log.md`).
- gpt-4o-mini는 책을 아주 짧게 끝낸다(13장에 2,198토큰, 장당 170~530자) → 안전망이 60% 미만 장을 결정론 작가로 교체했다. 출력 한도에 걸리지 않아 일반 실행에서는 이어쓰기가 나오지 않았고, 출력 상한을 1,200토큰으로 낮춘 잘림 시험에서 **length → 받은 장 확정 → 이어쓰기 1회(length) → 나머지 결정론**을 실호출로 확인했다.
- 실측 출력 글자/토큰(gpt-4o-mini): **1.70~1.76**(공식의 추정 1.5보다 큼). Claude 실측은 P6.
- 키 없는 같은 경로 7권(작가 호출 0 → 결정론): 전부 완성·열림(`docs/v5/p3-e2e-nokey.md`).

**실패 주입(목업 LLM + PGlite 이용권 큐, 비용 0)** — `tests/unit/writer/ticketQueue.test.ts`

| 시나리오 | 최종 상태 | Book 열림 | 장별 source | LLM 호출 | 소요(ms) | 비고 |
|---|---|---|---|---|---|---|
| 정상 | COMPLETED | 예 | writer 13 | 1 | 214 |  |
| 출력 전 5xx → 재시도 | COMPLETED | 예 | writer 13 | 2 | 130 |  |
| 출력 전 429 → 재시도 | COMPLETED | 예 | writer 13 | 3 | 122 |  |
| 중간 끊김 → 이어쓰기 | COMPLETED | 예 | writer 6 · continuation 7 | 2 | 136 |  |
| length 종료 → 이어쓰기 | COMPLETED | 예 | writer 8 · continuation 5 | 2 | 129 |  |
| 타임아웃 → 결정론 보충 | COMPLETED | 예 | writer 4 · deterministic 9 | 1 | 1026 |  |
| 인증 실패(401, 재시도 안 함) → 전부 결정론 | COMPLETED | 예 | deterministic 13 | 1 | 22 |  |
| 워커 강제 종료 → 회수 크론 | COMPLETED | 예 | writer 3 · deterministic 10 | 1 | 3023 | 회수 1건, 늦게 깨어난 원래 워커: ok |

같은 PGlite 큐에서: 플래그 꺼짐이면 claim이 기존과 같다(lease 10분, v5 발행 거부), v5 claim 5개 동시 → 1개만 잡힘, 작가 lease 안에서는 회수 불가, lease 만료 뒤 회수자 2개 동시 → 1개만, 이전 토큰의 장 저장·발행은 STALE_LEASE.

## I. 전체 원고 시험 — `docs/v5/p3-fullbook.md`

| 항목 | c1 종합 13장 | c2 연애 9장 |
|---|---|---|
| 직설 / 이미지 / 장면 | 5 / 5 / 5 | 5 / 5 / 5 |
| 명리×MBTI 연결 | 3 → 4 | 4 → 5 |
| 팩폭 | 4 → 4 | 4 → 5 |
| 분량 | 2 → 3 (10,639 → 11,156자, 장당 780~955) | 4 → 5 (9,208 → 9,824자) |
| 장 간 반복 | 3 → 3 | 3 → 4 |
| 금지 위반(안전망 뒤) | 0 → 0 | 0 → 0 |
| 결정론 교체 장 | 0 → 0 | 0 → 0 |

1회차 약점 중 지침·브리프·안전망 원인 5개를 고쳐 다시 썼다(분량 기준 숫자화, 비유 재소개 금지, 책 단위 중복 문장 삭제, 종합 올해 한 줄 한 장만, 장마다 MBTI 연결, 조건형 장 오탐).

## J. 게이트

| 명령 | 결과 |
|---|---|
| `pnpm exec tsx scripts/knowledge-lint.ts --strict` | issueCount 0, warningCount 0 |
| `pnpm exec tsc --noEmit` | 0 |
| `git diff --name-only v5/main...HEAD -- '*.ts' '*.tsx' '*.mjs' \| xargs pnpm exec eslint` | 0 errors, 0 warnings(54파일) |
| `pnpm exec vitest run tests/unit/writer tests/unit/brief tests/unit/saju tests/unit/knowledge-v5 tests/unit/llm` + 바뀐 모듈을 쓰는 테스트 | 43파일 / 601테스트 통과(작가 59 포함) |
| `pnpm exec vitest run`(전체) vs `docs/baseline-failures-v5main.txt` | 1,279파일 / 31,030케이스 중 실패 156파일 / 835케이스. 기준선 밖 2파일: `ticketPublicationRoutes`(vercel.json 크론 고정 테스트 — 크론 추가를 되돌린 뒤 통과), `bookPublicFlow`(단독 실행 통과, 전체 실행 부하 일시 실패). **신규 실패 0** |
| 플래그 꺼짐 동작 | claim 호출 인자 동일(`store.call("claim", null)`), v4 발행·읽기 경로 그대로, 결제 경로 무변경. PGlite 테스트로 lease 10분·v5 발행 거부 확인 |

## 남은 문제

1. **책 한 권을 한 번에 쓰면 장이 짧아진다(c1)**: 지침을 숫자로 고쳐도 장당 780~955자. P6 실제 Claude 모델로 확인 필요.
2. **"이 기운 때문에" 공식 반복(c1 2회차 7회)**: 지침 v5-3에서 고쳤지만 다시 쓰지 않아 미검증.
3. **예시 복사 삭제 뒤 빈약한 소제목**: 삭제 후 2문장만 남은 소제목을 합치는 처리가 없다.
4. **운영 적용 승인 필요**: migration `20261029130000_v5_writer_jobs.sql`(이용권 큐 함수 교체·장 테이블), 회수 크론 `vercel.json` 등록(라우트만 있고 등록은 안 함 — 출시 설정 고정 테스트도 같이 갱신), 이용권 워커 maxDuration 800(Vercel 플랜 확인). 플래그가 비어 있으면 동작은 같다.
5. **결제(paid) 경로는 v5 미연결**: 이번 범위는 이용권 경로. 결제 워커(`report_generation_jobs`)에 같은 방식을 붙이는 일은 남음.
6. **글자당 토큰**: 공식은 P2 추정(1/1.5). gpt-4o-mini 실측 1.70~1.76자/토큰, Claude 실측은 P6.
7. **결정론 장 분량**: 결정론 작가 장이 373~1,178자로 목표(1,000) 미달이 많다(재료가 적은 장). 폴백 품질 격차를 줄이려면 재료 보강이 필요.
8. **저가 모델 실호출은 품질 판단 불가**: gpt-4o-mini는 장당 170~530자라 대부분 교체됐다. 작가 품질은 Claude로 P6에서.
9. **판정 대기**: `docs/v5/p3-defaults.md` 27항목.
