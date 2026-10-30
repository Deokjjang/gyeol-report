# 외부 API 실호출 비용 로그

규칙: 호출 전 아래 누적 합계를 확인한다. 개발 중 OpenAI 총 상한 $8, P0-2 점검 합계 상한 $0.10. Anthropic 실호출은 P6 최종 단계 전까지 금지.
기록 형식: 한 호출 = 한 줄. 비용은 `src/lib/llm/prices.ts` 단가로 계산(토큰은 응답 usage 그대로).

| 시각(KST) | 단계 | 공급자/모델 | 입력 | 캐시입력 | 출력 | 비용(USD) | 종료 | request id | 누적(USD) |
|---|---|---|---|---|---|---|---|---|---|
| 2026-10-28 20:21 | P0-2 §5 | openai/gpt-4.1-nano | 0 | 0 | 0 | 0 | HTTP 404 (모델 deprecated, 과금 없음) | req_a34951ada3564d319978a844008f66e6 | 0.00000000 |
| 2026-10-28 20:21 | P0-2 §5 | openai/gpt-4o-mini | 51 | 0 | 33 | 0.00002745 | complete (32 조각 스트림) | req_2c65f916f0414d28af21455e6be27c0c | 0.00002745 |
| 2026-10-29 13:45 | P3 H 종합 · c1 하람(정시·ENTJ) | openai/gpt-4o-mini | 12161 | 0 | 2198 | 0.00314295 | complete | req_53187f23e7c24f1bad9c952a8e76091d | 0.00317040 |
| 2026-10-29 13:45 | P3 H 커리어 · c1 하람 | openai/gpt-4o-mini | 11915 | 0 | 2525 | 0.00330225 | complete | req_ca22d742d9d9469bae616f1e321cf11a | 0.00647265 |
| 2026-10-29 13:46 | P3 H 연애 · c2 서윤(시간 미상·INFP·연애 중) | openai/gpt-4o-mini | 11996 | 0 | 2901 | 0.00354000 | complete | req_2e102e4efef742009e48eb7dc4f29908 | 0.01001265 |
| 2026-10-29 13:46 | P3 H 대운 · 지우(ISFJ) | openai/gpt-4o-mini | 19833 | 0 | 1934 | 0.00413535 | complete | req_8e989683a38243748e5d2a31534ab833 | 0.01414800 |
| 2026-10-29 13:46 | P3 H 세운 2026 · 도윤(ESTP) | openai/gpt-4o-mini | 18776 | 0 | 1914 | 0.00396480 | complete | req_0d2dc66b908e41afac7cf2c956344002 | 0.01811280 |
| 2026-10-29 13:47 | P3 H 궁합 연인 · 하람×지우 | openai/gpt-4o-mini | 15085 | 0 | 2654 | 0.00385515 | complete | req_b6608165000c43868c0f869f0b0d4f49 | 0.02196795 |
| 2026-10-29 13:50 | P3 H 궁합 동료 · 도윤×서윤(B 시간 미상) | openai/gpt-4o-mini | 15642 | 0 | 2407 | 0.00379050 | complete | req_028d7aeba52649469442cb6d892a11eb | 0.02575845 |
| 2026-10-29 13:51 | P3 H 종합 · c1 하람(정시·ENTJ) | openai/gpt-4o-mini | 12161 | 0 | 1200 | 0.00254415 | length | req_a11659465c65465782e6ca0c51a5e452 | 0.02830260 |
| 2026-10-29 13:51 | P3 H 종합 · c1 하람(정시·ENTJ) | openai/gpt-4o-mini | 12416 | 0 | 1200 | 0.00258240 | length | req_30f42419e38f464c8d0504bc3247fe70 | 0.03088500 |
| 2026-10-30 19:20 | P6 배관 확인 (A) | anthropic/claude-sonnet-5-5 | 39 | 0 | 60 | 0.00067800 | length | req_011CgYFgfBLvag196NqKMcRk | 0.03156300 |
| 2026-10-30 19:20 | P6 배관 확인 (B) | openai/gpt-6.1-terra | 31 | 0 | 35 | 0.00020600 | complete | req_5baef330a95c4bd2b9e3a820d5ea20ce | 0.03176900 |
| 2026-10-30 20:13 | P6 종합 · 하람(c1) (A) | anthropic/claude-sonnet-5-5 | 24001 | 0 | 11418 | 0.16481100 | complete | req_011CgYKXyWt8jrj3YYhwiuTF | 0.19658000 |
| 2026-10-30 20:14 | P6 커리어 · 하람(c1) (A) | anthropic/claude-sonnet-5-5 | 16736 | 5258 | 9716 | 0.13115780 | complete | req_011CgYKgAiHpZdDGrrZ6p4Ly | 0.32773780 |
| 2026-10-30 20:15 | P6 연애 · 도현(Y) (A) | anthropic/claude-sonnet-5-5 | 16669 | 5258 | 9481 | 0.12867380 | complete | req_011CgYKmrY5WjGG8Y8GRWqqC | 0.45641160 |
| 2026-10-30 20:16 | P6 궁합 연애 · 하람×서윤 (A) | anthropic/claude-sonnet-5-5 | 18864 | 5258 | 10830 | 0.14655380 | complete | req_011CgYKsKBM9S89FCUUu8JQk | 0.60296540 |
| 2026-10-30 20:18 | P6 대운 · 수진(X) (A) | anthropic/claude-sonnet-5-5 | 21730 | 5258 | 9585 | 0.13983580 | complete | req_011CgYKxyBybyrmsupKB3mvF | 0.74280120 |
| 2026-10-30 20:19 | P6 세운 2026 · 서윤(c2, 대략 오시) (A) | anthropic/claude-sonnet-5-5 | 20855 | 5258 | 9692 | 0.13915580 | complete | req_011CgYL4LXFpxRrnyoyfJmuu | 0.88195700 |
| 2026-10-30 20:22 | P6 대운 · 수진(X) (A) | anthropic/claude-sonnet-5-5 | 21726 | 5258 | 9837 | 0.14234780 | complete | req_011CgYLL9adzgQn12guwT6aZ | 1.02430480 |
| 2026-10-30 20:24 | P6 세운 2026 · 서윤(c2, 대략 오시) (A) | anthropic/claude-sonnet-5-5 | 20851 | 5258 | 8286 | 0.12508780 | complete | req_011CgYLRXHzvrgAyzp1ey2dJ | 1.14939260 |
| 2026-10-30 20:26 | P6 종합 · 하람(c1) (B) | openai/gpt-6.1-terra | 14117 | 0 | 5896 | 0.04359700 | complete | req_5683372be4dc4819bd65726f03cd423d | 1.19298960 |
| 2026-10-30 20:28 | P6 커리어 · 하람(c1) (B) | openai/gpt-6.1-terra | 9974 | 3099 | 4972 | 0.03498895 | complete | req_70dc96f67ae64ceab0e944878aa90388 | 1.22797855 |
| 2026-10-30 20:29 | P6 연애 · 도현(Y) (B) | openai/gpt-6.1-terra | 9928 | 3099 | 4967 | 0.03491795 | complete | req_4f4f25067f24429298e99a2291c5e8e5 | 1.26289650 |
| 2026-10-30 20:30 | P6 궁합 연애 · 하람×서윤 (B) | openai/gpt-6.1-terra | 11241 | 3099 | 5015 | 0.03647095 | complete | req_caac0063d25748948ab1cd6a79a03409 | 1.29936745 |
| 2026-10-30 20:32 | P6 대운 · 수진(X) (B) | openai/gpt-6.1-terra | 13370 | 3099 | 5968 | 0.04336495 | complete | req_bb617bc64a944d09b84cc176bf487545 | 1.34273240 |
| 2026-10-30 20:33 | P6 세운 2026 · 서윤(c2, 대략 오시) (B) | openai/gpt-6.1-terra | 12909 | 3099 | 4271 | 0.03441895 | complete | req_7593884b68464193a45b220261ce20fd | 1.37715135 |

누적 합계: **$1.37715135** (P0-2 점검 상한 $0.10, 개발 총 상한 $8)

메모
- `GET /v1/models`(무료)에 나오는 모델이라도 deprecated일 수 있다(gpt-4.1-nano는 목록에 있었지만 404). 새 모델은 호출 전에 최소 호출로 확인한다.
- 추론 모델(gpt-5-nano 등)은 출력 상한 안에서 추론에 토큰을 쓸 수 있어 배관 검증에는 비추론 모델이 안전하다.
