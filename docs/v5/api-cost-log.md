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
| 2026-11-03 11:50 | P6b 종합 · 하람(c1) | anthropic/claude-sonnet-5-5 | 22167 | 0 | 11940 | 0.16568750 | complete | req_011CgfERPAArwJqjNsMtwzfk | 1.54283885 |
| 2026-11-03 11:51 | P6b 커리어 · 하람(c1) | anthropic/claude-sonnet-5-5 | 14094 | 3907 | 8759 | 0.11616870 | complete | req_011CgfEYJogWozSL7n6SZfhp | 1.65900755 |
| 2026-11-03 11:52 | P6b 연애 · 도현(Y) | anthropic/claude-sonnet-5-5 | 13492 | 3907 | 7997 | 0.10734470 | complete | req_011CgfEcyaRtyJAVqY5khGf6 | 1.76635225 |
| 2026-11-03 11:53 | P6b 궁합 연애 · 하람×서윤 | anthropic/claude-sonnet-5-5 | 17976 | 3907 | 9691 | 0.13325270 | complete | req_011CgfEhMKkFcwsfaSjYCVB1 | 1.89960495 |
| 2026-11-03 11:54 | P6b 대운 · 수진(X) | anthropic/claude-sonnet-5-5 | 20189 | 3907 | 7973 | 0.12049870 | complete | req_011CgfEnTwWCBLSM5vePc8R4 | 2.02010365 |
| 2026-11-03 11:55 | P6b 세운 2026 · 서윤(c2, 대략 오시) | anthropic/claude-sonnet-5-5 | 18438 | 3907 | 7353 | 0.11079670 | complete | req_011CgfEraj98tRAA3n34jpKq | 2.13090035 |
| 2026-11-03 11:56 | P6b 종합 · 장덕민(본인) | anthropic/claude-sonnet-5-5 | 19095 | 3907 | 11332 | 0.15190070 | complete | req_011CgfEvXdidGaQK4gc7AwC9 | 2.28280105 |
| 2026-11-03 11:59 | P6b 종합 · 하람(c1) r2 | anthropic/claude-sonnet-5-5 | 22281 | 0 | 14441 | 0.19098050 | complete | req_011CgfF82hGFZodCasyTjMfB | 2.47378155 |
| 2026-11-03 12:01 | P6b 커리어 · 하람(c1) r2 | anthropic/claude-sonnet-5-5 | 14224 | 4017 | 8479 | 0.11363970 | complete | req_011CgfFJ4M1SneEU8AEh5AJm | 2.58742125 |
| 2026-11-03 12:02 | P6b 연애 · 도현(Y) r2 | anthropic/claude-sonnet-5-5 | 13492 | 4017 | 9715 | 0.12453570 | complete | req_011CgfFPKnatfvKsnJk9rjyE | 2.71195695 |
| 2026-11-03 12:03 | P6b 궁합 연애 · 하람×서윤 r2 | anthropic/claude-sonnet-5-5 | 17976 | 4017 | 9789 | 0.13424370 | complete | req_011CgfFUvBw4fYFD6r2SPy1n | 2.84620065 |
| 2026-11-03 12:05 | P6b 대운 · 수진(X) r2 | anthropic/claude-sonnet-5-5 | 20215 | 4017 | 14294 | 0.18377170 | complete | req_011CgfFZsVr11L1PUduhMp7Y | 3.02997235 |
| 2026-11-03 12:06 | P6b 세운 2026 · 서윤(c2, 대략 오시) r2 | anthropic/claude-sonnet-5-5 | 18464 | 4017 | 8772 | 0.12504970 | complete | req_011CgfFhZKBV7LfvkEt7U5pH | 3.15502205 |
| 2026-11-03 12:08 | P6b 종합 · 장덕민(본인) r2 | anthropic/claude-sonnet-5-5 | 19099 | 4017 | 11366 | 0.15225970 | complete | req_011CgfFnZmMQUmkrui1JkRwT | 3.30728175 |
| 2026-11-03 12:13 | P6b 커리어 · 하람(c1) r3 | anthropic/claude-sonnet-5-5 | 19831 | 0 | 10620 | 0.14789050 | complete | req_011CgfGBv38uLFcBrt71fEnT | 3.45517225 |
| 2026-11-03 12:14 | P6b 연애 · 도현(Y) r3 | anthropic/claude-sonnet-5-5 | 16452 | 4057 | 9874 | 0.13204970 | complete | req_011CgfGJJeMGzX5PSYaDCix6 | 3.58722195 |
| 2026-11-03 12:15 | P6b 궁합 연애 · 하람×서윤 r3 | anthropic/claude-sonnet-5-5 | 18063 | 4057 | 11960 | 0.15613170 | complete | req_011CgfGPrbMWLZ7KX1ZHeXgh | 3.74335365 |
| 2026-11-03 12:16 | P6b 세운 2026 · 서윤(c2, 대략 오시) r3 | anthropic/claude-sonnet-5-5 | 21110 | 4057 | 9045 | 0.13307570 | complete | req_011CgfGW3gXJQ3FbqpkAAiG5 | 3.87642935 |
| 2026-11-03 12:18 | P6b 세운 2026 · 서윤(c2, 대략 오시) r4 | anthropic/claude-sonnet-5-5 | 25299 | 0 | 9988 | 0.15253300 | complete | req_011CgfGeCRrAjeYp2ifGnaQg | 4.02896235 |
| 2026-11-03 12:24 | P6b 커리어 · 하람(c1) 실패 주입 | anthropic/claude-sonnet-5-5 | 0 | 0 | 0 | 0.00000000 | error (http_401) | req_011CgfH5hVHmxNCia3aLxbQt | 4.02896235 |
| 2026-11-03 12:24 | P6b 커리어 · 하람(c1) 실패 주입 | openai/gpt-6.1-terra | 11789 | 0 | 6310 | 0.04333900 | complete | req_74162cb9fe0b49038b9c9c331a683dd2 | 4.07230135 |
| 2026-11-04 08:31 | P6c 종합 · 하람(c1) r1 | anthropic/claude-sonnet-5-5 | 21961 | 0 | 12268 | 0.16925500 | complete | req_011Cggs4wcnANC7GzCbqu91f | 4.24155635 |
| 2026-11-04 08:31 | P6c 종합 · 하람(c1) r1 수리 | anthropic/claude-sonnet-5-5 | 2721 | 0 | 922 | 0.01466200 | complete | req_011CggsBfJTGwotuC9rGX2Mn | 4.25621835 |
| 2026-11-04 08:32 | P6c 커리어 · 하람(c1) r1 | anthropic/claude-sonnet-5-5 | 15044 | 5306 | 9914 | 0.12975860 | complete | req_011CggsCzGVh9kiWwDzN8Rc6 | 4.38597695 |
| 2026-11-04 08:32 | P6c 커리어 · 하람(c1) r1 수리 | anthropic/claude-sonnet-5-5 | 5621 | 0 | 2204 | 0.03328200 | complete | req_011CggsJ9FPPSgPpwi6JARaj | 4.41925895 |
| 2026-11-04 08:34 | P6c 연애 · 도현(Y) r1 | anthropic/claude-sonnet-5-5 | 14959 | 5306 | 11239 | 0.14283860 | complete | req_011CggsKQNVhpabKHc9mE9tC | 4.56209755 |
| 2026-11-04 08:34 | P6c 연애 · 도현(Y) r1 수리 | anthropic/claude-sonnet-5-5 | 3724 | 0 | 1441 | 0.02185800 | complete | req_011CggsRsbmKbGugWqAwmkCr | 4.58395555 |
| 2026-11-04 08:35 | P6c 궁합 연애 · 하람×서윤 r1 | anthropic/claude-sonnet-5-5 | 18441 | 5306 | 9617 | 0.13358260 | complete | req_011CggsSkFmQkNEa6w6UVHLa | 4.71753815 |
| 2026-11-04 08:35 | P6c 궁합 연애 · 하람×서윤 r1 수리 | anthropic/claude-sonnet-5-5 | 2041 | 0 | 570 | 0.00978200 | complete | req_011CggsY7uf4n9dAJj3nuTjq | 4.72732015 |
| 2026-11-04 08:37 | P6c 대운 · 수진(X) r1 | anthropic/claude-sonnet-5-5 | 21084 | 5306 | 10103 | 0.14372860 | complete | req_011CggsYbGwnG6j6rXP5R6nj | 4.87104875 |
| 2026-11-04 08:37 | P6c 대운 · 수진(X) r1 수리 | anthropic/claude-sonnet-5-5 | 3349 | 0 | 1013 | 0.01682800 | complete | req_011CggsdfGwsFDKssLYWST14 | 4.88787675 |
| 2026-11-04 08:38 | P6c 세운 2026 · 서윤(c2, 대략 오시) r1 | anthropic/claude-sonnet-5-5 | 20896 | 5306 | 11160 | 0.15392260 | complete | req_011CggseQBNfnTfKQkydJrdt | 5.04179935 |
| 2026-11-04 08:38 | P6c 세운 2026 · 서윤(c2, 대략 오시) r1 수리 | anthropic/claude-sonnet-5-5 | 1940 | 0 | 449 | 0.00837000 | complete | req_011Cggsk8depgDKu1aBJZ9Lf | 5.05016935 |
| 2026-11-04 08:40 | P6c 종합 · 장덕민(본인) r1 | anthropic/claude-sonnet-5-5 | 16941 | 5306 | 13026 | 0.16467260 | complete | req_011CggskdR1hBKB4FzCL9hWG | 5.21484195 |
| 2026-11-04 08:40 | P6c 종합 · 장덕민(본인) r1 수리 | anthropic/claude-sonnet-5-5 | 4554 | 0 | 1778 | 0.02688800 | complete | req_011CggsskmEhEsuSabW5rHZ3 | 5.24172995 |
| 2026-11-04 08:49 | P6c 종합 · 하람(c1) r2 | anthropic/claude-sonnet-5-5 | 22823 | 0 | 16045 | 0.20918000 | complete | req_011CggtLU4dqKzAWGxTuhaap | 5.45090995 |
| 2026-11-04 08:49 | P6c 종합 · 하람(c1) r2 수리 | anthropic/claude-sonnet-5-5 | 4133 | 0 | 1675 | 0.02501600 | complete | req_011CggtVMAeqvTxwLFNYVUJo | 5.47592595 |
| 2026-11-04 08:50 | P6c 커리어 · 하람(c1) r2 | anthropic/claude-sonnet-5-5 | 15044 | 6168 | 11403 | 0.14473480 | complete | req_011CggtYoiAYZRKLVBNb6pmb | 5.62066075 |
| 2026-11-04 08:50 | P6c 커리어 · 하람(c1) r2 수리 | anthropic/claude-sonnet-5-5 | 5930 | 0 | 2289 | 0.03475000 | complete | req_011CggtewbrPgtqY31Zyj5uC | 5.65541075 |
| 2026-11-04 08:52 | P6c 궁합 연애 · 하람×서윤 r2 | anthropic/claude-sonnet-5-5 | 18441 | 6168 | 10652 | 0.14401880 | complete | req_011Cggth8vnoutKgHoxLsapQ | 5.79942955 |
| 2026-11-04 08:52 | P6c 궁합 연애 · 하람×서윤 r2 수리 | anthropic/claude-sonnet-5-5 | 2637 | 0 | 845 | 0.01372400 | complete | req_011CggtnzbuQQ8KJ4AkC7FHP | 5.81315355 |
| 2026-11-04 08:54 | P6c 대운 · 수진(X) r2 | anthropic/claude-sonnet-5-5 | 21084 | 6168 | 15272 | 0.19550480 | complete | req_011CggtoewFYH5n3FNGTRpZA | 6.00865835 |
| 2026-11-04 08:54 | P6c 대운 · 수진(X) r2 수리 | anthropic/claude-sonnet-5-5 | 3555 | 0 | 1499 | 0.02210000 | complete | req_011CggtwYLLYZfKueDHbrPqZ | 6.03075835 |
| 2026-11-04 08:56 | P6c 세운 2026 · 서윤(c2, 대략 오시) r2 | anthropic/claude-sonnet-5-5 | 20896 | 6168 | 12072 | 0.16312880 | complete | req_011CggtxgKLqHwyXUfJ5p8qS | 6.19388715 |
| 2026-11-04 08:56 | P6c 세운 2026 · 서윤(c2, 대략 오시) r2 수리 | anthropic/claude-sonnet-5-5 | 4215 | 0 | 1660 | 0.02503000 | complete | req_011Cggu4ibgZ3osky3kDVHZs | 6.21891715 |
| 2026-11-04 08:58 | P6c 종합 · 장덕민(본인) r2 | anthropic/claude-sonnet-5-5 | 16941 | 6168 | 14376 | 0.17825880 | complete | req_011Cggu65sd7McuuVhByHji8 | 6.39717595 |
| 2026-11-04 08:58 | P6c 종합 · 장덕민(본인) r2 수리 | anthropic/claude-sonnet-5-5 | 3403 | 0 | 1293 | 0.01973600 | complete | req_011CgguED7ReNBfxMz1pVgdG | 6.41691195 |
| 2026-11-04 09:05 | P6c 종합 · 하람(c1) r3 | anthropic/claude-sonnet-5-5 | 22843 | 0 | 17220 | 0.22098000 | complete | req_011CgguaqkNqJBMfNej6tFT5 | 6.63789195 |
| 2026-11-04 09:05 | P6c 종합 · 하람(c1) r3 수리 | anthropic/claude-sonnet-5-5 | 5498 | 0 | 2379 | 0.03478600 | complete | req_011CggukiGx4Ds2as6Mne5Ma | 6.67267795 |

누적 합계: **$6.67267795** (P0-2 점검 상한 $0.10, 개발 총 상한 $8)

메모
- `GET /v1/models`(무료)에 나오는 모델이라도 deprecated일 수 있다(gpt-4.1-nano는 목록에 있었지만 404). 새 모델은 호출 전에 최소 호출로 확인한다.
- 추론 모델(gpt-5-nano 등)은 출력 상한 안에서 추론에 토큰을 쓸 수 있어 배관 검증에는 비추론 모델이 안전하다.
