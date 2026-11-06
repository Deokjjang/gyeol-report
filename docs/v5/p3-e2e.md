# P3 종단 시험(실호출 OpenAI, 로컬 서버·로컬 Supabase)

실행: `pnpm exec tsx scripts/dev/v5-e2e.ts` · 2026-10-29 13:47 KST · 이번 실행 비용 $0.02194

| 사례 | reportId | 최종 상태 | 페이지 | 장별 source | 호출(종료) | 입력/출력 토큰 | 비용(USD) | 소요(초) | 출력 글자/토큰 |
|---|---|---|---|---|---|---|---|---|---|
| 종합 · c1 하람(정시·ENTJ) | `report_a097f5cd6df34347a8815c8366109b16` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 13 | complete | 12161/2198 | 0.00314 | 53 | 1.70 |
| 커리어 · c1 하람 | `report_26e3eab9facc47f8b89d9933e282838d` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 9 | complete | 11915/2525 | 0.00330 | 32 | 1.74 |
| 연애 · c2 서윤(시간 미상·INFP·연애 중) | `report_42ed83becf4c41dca04a71665e86b2b5` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 7 | complete | 11996/2901 | 0.00354 | 28 | 1.75 |
| 대운 · 지우(ISFJ) | `report_c7c63f173b0342bba65d1011580dfc8a` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 3 | complete | 19833/1934 | 0.00414 | 20 | 1.76 |
| 세운 2026 · 도윤(ESTP) | `report_d4b7d7e000314f10a6e66219886d4de4` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 2 · deterministic 3 | complete | 18776/1914 | 0.00396 | 23 | 1.73 |
| 궁합 연인 · 하람×지우 | `report_3125e68b79cb4538bd1ec84ff249cd6e` | COMPLETED/COMPLETED (v5) | 열림(200) | writer 1 · deterministic 8 | complete | 15085/2654 | 0.00386 | 20 | 1.72 |
| 궁합 동료 · 도윤×서윤(B 시간 미상) | - | 접수 실패 NO_USABLE_TICKET | | | | | | | |

## 추가 실행

실행: `pnpm exec tsx scripts/dev/v5-e2e.ts --only coworker` · 2026-10-29 13:50 KST · 이번 실행 비용 $0.00379

| 사례 | reportId | 최종 상태 | 페이지 | 장별 source | 호출(종료) | 입력/출력 토큰 | 비용(USD) | 소요(초) | 출력 글자/토큰 |
|---|---|---|---|---|---|---|---|---|---|
| 궁합 동료 · 도윤×서윤(B 시간 미상) | `report_df14398dc9f945d19d3089000032c70a` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 9 | complete | 15642/2407 | 0.00379 | 22 | 1.71 |

## 추가 실행

실행: `pnpm exec tsx scripts/dev/v5-e2e.ts --only saju_mbti_full` · 2026-10-29 13:51 KST · 출력 상한 LLM_MAX_OUTPUT_TOKENS=1200 · 이번 실행 비용 $0.00513

| 사례 | reportId | 최종 상태 | 페이지 | 장별 source | 호출(종료) | 입력/출력 토큰 | 비용(USD) | 소요(초) | 출력 글자/토큰 |
|---|---|---|---|---|---|---|---|---|---|
| 종합 · c1 하람(정시·ENTJ) | `report_9d25497e3cc1443081690f36ad9fd44e` | COMPLETED/COMPLETED (v5) | 열림(200) | deterministic 11 · writer 1 · continuation 1 | length→length | 24577/2400 | 0.00513 | 56 | 1.74 |
