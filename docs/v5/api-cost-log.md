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
| 2026-11-04 13:25 | P6d 종합 · 장소담(카페 사장·INTP·관계 미입력) r1 | anthropic/claude-sonnet-5-5 | 24091 | 0 | 14264 | 0.19422200 | complete | req_011CghFVEPp3Txr9nr8oKhEJ | 6.86689995 |
| 2026-11-04 13:25 | P6d 종합 · 장소담(카페 사장·INTP·관계 미입력) r1 수리 | anthropic/claude-sonnet-5-5 | 6230 | 0 | 2331 | 0.03577000 | complete | req_011CghFd59fReoL9D56TZiNX | 6.90266995 |
| 2026-11-04 13:28 | P6d 커리어 · 권태오(구직) r1 | anthropic/claude-sonnet-5-5 | 15707 | 6800 | 12687 | 0.15896400 | complete | req_011CghFfhbTd91bmsA5fhvdM | 7.06163395 |
| 2026-11-04 13:28 | P6d 커리어 · 권태오(구직) r1 수리 | anthropic/claude-sonnet-5-5 | 9604 | 0 | 3970 | 0.05890800 | complete | req_011CghFnNBr4L4GUHbcKu7Gh | 7.12054195 |
| 2026-11-04 13:29 | P6d 연애 · 문채린(연애 중) r1 | anthropic/claude-sonnet-5-5 | 14954 | 6800 | 12149 | 0.15207800 | complete | req_011CghFpdJVkUKDy5npY2KTY | 7.27261995 |
| 2026-11-04 13:29 | P6d 연애 · 문채린(연애 중) r1 수리 | anthropic/claude-sonnet-5-5 | 5153 | 0 | 1978 | 0.03008600 | complete | req_011CghFwaX1QnyYNeZBSZf5i | 7.30270595 |
| 2026-11-04 13:31 | P6d 궁합 사업 파트너 · 남궁현×백은솔 r1 | anthropic/claude-sonnet-5-5 | 20074 | 6800 | 11590 | 0.15672800 | complete | req_011CghFy2y1HumKEU7GqBnbo | 7.45943395 |
| 2026-11-04 13:31 | P6d 궁합 사업 파트너 · 남궁현×백은솔 r1 수리 | anthropic/claude-sonnet-5-5 | 2967 | 0 | 563 | 0.01156400 | complete | req_011CghG5U2JkBR39X7aC4Eez | 7.47099795 |
| 2026-11-04 13:38 | P6d 커리어 · 권태오(구직) r2 | anthropic/claude-sonnet-5-5 | 22507 | 0 | 13467 | 0.18308400 | complete | req_011CghGSrxHEBN49Vn9Gtq2v | 7.65408195 |
| 2026-11-04 13:38 | P6d 커리어 · 권태오(구직) r2 수리 | anthropic/claude-sonnet-5-5 | 8421 | 0 | 3506 | 0.05190200 | complete | req_011CghGa5eiTwNm2AvEsqTjh | 7.70598395 |

| 2026-11-04 23:36 | 최종판 시험 1장 · 종합 · 장소담(카페 사장·INTP·연애 중) 1장 continuation | anthropic/claude-sonnet-5-5 | 0 | 0 | 0 | 0.00000000 | error:http_401 | req_011Cgi4E2z1roBwF2dHgUEfj | 7.70598395 |
| 2026-11-05 00:14 | 최종판 시험 1장 · 종합 · 장소담(카페 사장·INTP·연애 중) 1장 continuation | anthropic/claude-sonnet-5-5 | 26069 | 0 | 1682 | 0.07244250 | complete | req_011Cgi77A6ZgwF7MYhgoNmLe | 7.77842645 |
| 2026-11-05 00:18 | 최종판 4권(결제 경로) · official report_0c7636d107c84b8baa997c7051fe5cea | anthropic/claude-sonnet-5-5 | 19215 | 6969 | 13673 | 0.17585690 | complete | req_011Cgi7Kf4vQMtKXBJgGQXQS | 7.95428335 |
| 2026-11-05 00:19 | 최종판 4권(결제 경로) · official report_0c7636d107c84b8baa997c7051fe5cea repair | anthropic/claude-sonnet-5-5 | 5935 | 0 | 1860 | 0.03072850 | complete | req_011Cgi7TWXCJ66cJVMmvh27y | 7.98501185 |
| 2026-11-05 00:19 | 최종판 4권(결제 경로) · official report_0c7636d107c84b8baa997c7051fe5cea rewrite | anthropic/claude-sonnet-5-5 | 2419 | 0 | 477 | 0.00960800 | complete | req_011Cgi7ULjMKidGzGRPsiSbb | 7.99461985 |
| 2026-11-05 00:20 | 최종판 4권(결제 경로) · official report_065b67917da04a3983333fa0bbfdb296 | anthropic/claude-sonnet-5-5 | 17139 | 6969 | 11517 | 0.15014490 | complete | req_011Cgi7VBGcWjFzwUYvroMj9 | 8.14476475 |
| 2026-11-05 00:21 | 최종판 4권(결제 경로) · official report_065b67917da04a3983333fa0bbfdb296 repair | anthropic/claude-sonnet-5-5 | 14788 | 517 | 5576 | 0.08538770 | complete | req_011Cgi7bKQBL6HqLS3G45GCx | 8.23015245 |
| 2026-11-05 00:22 | 최종판 4권(결제 경로) · official report_c136f0c838d94fd0811717ca80883562 | anthropic/claude-sonnet-5-5 | 22819 | 6969 | 13738 | 0.18371490 | complete | req_011Cgi7dmWsHX2N6XgkBQ7jB | 8.41386735 |
| 2026-11-05 00:22 | 최종판 4권(결제 경로) · official report_c136f0c838d94fd0811717ca80883562 cover | anthropic/claude-sonnet-5-5 | 407 | 0 | 36 | 0.00117400 | complete | req_011Cgi7m1vVPcMrteaWjovUj | 8.41504135 |
| 2026-11-05 00:23 | 최종판 4권(결제 경로) · official report_c136f0c838d94fd0811717ca80883562 repair | anthropic/claude-sonnet-5-5 | 5018 | 517 | 1332 | 0.02340770 | complete | req_011Cgi7mAe7Sy5J4fny3WXCq | 8.43844905 |
| 2026-11-05 00:26 | 최종판 4권(결제 경로) · official report_8dbe7218366449868ff33aaf364f1a58 | anthropic/claude-sonnet-5-5 | 15423 | 6969 | 12489 | 0.15643290 | complete | req_011Cgi7wsBCBk2ak4eJYbbrG | 8.59488195 |
| 2026-11-05 00:26 | 최종판 4권(결제 경로) · official report_8dbe7218366449868ff33aaf364f1a58 cover | anthropic/claude-sonnet-5-5 | 416 | 0 | 38 | 0.00121200 | complete | req_011Cgi84nuQbDP2kd7vcQi4g | 8.59609395 |
| 2026-11-05 00:27 | 최종판 4권(결제 경로) · official report_8dbe7218366449868ff33aaf364f1a58 repair | anthropic/claude-sonnet-5-5 | 6993 | 517 | 2767 | 0.04170770 | complete | req_011Cgi84tXjogsJuGswtsahV | 8.63780165 |
| 2026-11-05 00:27 | 최종판 4권(결제 경로) · official report_8dbe7218366449868ff33aaf364f1a58 rewrite | anthropic/claude-sonnet-5-5 | 3986 | 0 | 1149 | 0.01946200 | complete | req_011Cgi85yvi5WCmrSFKLodqE | 8.65726365 |
| 2026-11-05 00:39 | 최종판 4 궁합 장면 주인 고침 · 소제목 재작성 12 repair | anthropic/claude-sonnet-5-5 | 5175 | 0 | 1194 | 0.02254850 | complete | req_011Cgi8zyYNAeazsqQHcSMiV | 8.67981215 |
| 2026-11-05 00:39 | 최종판 4 궁합 장면 주인 고침 · 소제목 재작성 12 rewrite | anthropic/claude-sonnet-5-5 | 14632 | 0 | 6122 | 0.09048400 | complete | req_011Cgi91YkQ1obg8GJFku5UD | 8.77029615 |
| 2026-11-05 00:44 | 최종판 4·5 실질 결함 고침(새 검사(자녀 단정·조건 안내)) · 소제목 재작성 0 repair | anthropic/claude-sonnet-5-5 | 8266 | 0 | 3080 | 0.04759050 | complete | req_011Cgi9RGeh17RvX9RXtJwVS | 8.81788665 |
| 2026-11-05 00:45 | 최종판 4·5 실질 결함 고침(새 검사(자녀 단정·조건 안내)) · 소제목 재작성 0 rewrite | anthropic/claude-sonnet-5-5 | 3512 | 0 | 1045 | 0.01747400 | complete | req_011Cgi9STanBnkYjEK3kyzoW | 8.83536065 |
| 2026-11-05 00:49 | 최종판 4·5 실질 결함 고침(새 검사(자녀 단정·조건 안내)) · 소제목 재작성 0 rewrite | anthropic/claude-sonnet-5-5 | 5760 | 0 | 1873 | 0.03025000 | complete | req_011Cgi9jxVKR4jAEeupBNUS5 | 8.86561065 |
| 2026-11-05 00:51 | 최종판 4·5 실질 결함 고침(새 검사) · 소제목 재작성 0 repair | anthropic/claude-sonnet-5-5 | 6209 | 0 | 2028 | 0.03295650 | complete | req_011Cgi9x47zAYNBDtttxDAju | 8.89856715 |
| 2026-11-05 00:51 | 최종판 4·5 실질 결함 고침(새 검사) · 소제목 재작성 0 rewrite | anthropic/claude-sonnet-5-5 | 2433 | 0 | 503 | 0.00989600 | complete | req_011Cgi9y21kzSmFfzjRwCTfr | 8.90846315 |
| 2026-11-05 11:36 | 최종판2 4권(결제 경로) · official report_ef42d66ffef340f0b9de46d2eb57af16 | anthropic/claude-sonnet-5-5 | 26154 | 0 | 14344 | 0.19923250 | complete | req_011Cgj128UzY4c7bvkLGyC8c | 9.10769565 |
| 2026-11-05 11:37 | 최종판2 4권(결제 경로) · official report_ef42d66ffef340f0b9de46d2eb57af16 repair | anthropic/claude-sonnet-5-5 | 9365 | 0 | 3083 | 0.04981850 | complete | req_011Cgj1AC32JKyYj7H9geiy4 | 9.15751415 |
| 2026-11-05 11:37 | 최종판2 4권(결제 경로) · official report_ef42d66ffef340f0b9de46d2eb57af16 rewrite | anthropic/claude-sonnet-5-5 | 3657 | 0 | 793 | 0.01524400 | complete | req_011Cgj1BiTu8aw9uZrBqDMti | 9.17275815 |
| 2026-11-05 11:44 | 최종판2 4권(결제 경로) · official report_fe29cb0ed88a4a459c14f1b377a3a9bf | anthropic/claude-sonnet-5-5 | 24010 | 0 | 12890 | 0.18040450 | complete | req_011Cgj1cfpMKRFj5ohL8Sjxy | 9.35316265 |
| 2026-11-05 11:44 | 최종판2 4권(결제 경로) · official report_fe29cb0ed88a4a459c14f1b377a3a9bf cover | anthropic/claude-sonnet-5-5 | 834 | 0 | 29 | 0.00195800 | complete | req_011Cgj1jbueBmcj2LsMN2ts2 | 9.35512065 |
| 2026-11-05 11:44 | 최종판2 4권(결제 경로) · official report_fe29cb0ed88a4a459c14f1b377a3a9bf repair | anthropic/claude-sonnet-5-5 | 10633 | 0 | 4251 | 0.06403450 | complete | req_011Cgj1jkQcNBy16UhdRcB4b | 9.41915515 |
| 2026-11-05 11:44 | 최종판2 4권(결제 경로) · official report_fe29cb0ed88a4a459c14f1b377a3a9bf rewrite | anthropic/claude-sonnet-5-5 | 3140 | 0 | 489 | 0.01117000 | complete | req_011Cgj1mVtJQq3pGENAece85 | 9.43032515 |
| 2026-11-05 11:48 | 최종판2 4권(결제 경로) · official report_a29459e21b9548e79d3e3a5cd33e118e | anthropic/claude-sonnet-5-5 | 14697 | 6969 | 11854 | 0.14932780 | complete | req_011Cgj1vexFUKuAaei86Tfwr | 9.57965295 |
| 2026-11-05 11:48 | 최종판2 4권(결제 경로) · official report_a29459e21b9548e79d3e3a5cd33e118e cover | anthropic/claude-sonnet-5-5 | 856 | 0 | 35 | 0.00206200 | complete | req_011Cgj23VqGDCDW9keFDy8mz | 9.58171495 |
| 2026-11-05 11:48 | 최종판2 4권(결제 경로) · official report_a29459e21b9548e79d3e3a5cd33e118e repair | anthropic/claude-sonnet-5-5 | 6939 | 517 | 2438 | 0.03836140 | complete | req_011Cgj23iJcpprjQEAzi5JL5 | 9.62007635 |
| 2026-11-05 11:50 | 최종판2 4권(결제 경로) · official report_4d95800013d242e48022248ca9394bf2 | anthropic/claude-sonnet-5-5 | 24082 | 6969 | 11438 | 0.16393780 | complete | req_011Cgj26UA9qf8chUJv6uUsR | 9.78401415 |
| 2026-11-05 11:50 | 최종판2 4권(결제 경로) · official report_4d95800013d242e48022248ca9394bf2 cover | anthropic/claude-sonnet-5-5 | 889 | 0 | 32 | 0.00209800 | complete | req_011Cgj2CiznjSz8nfgEKnraP | 9.78611215 |
| 2026-11-05 11:50 | 최종판2 4권(결제 경로) · official report_4d95800013d242e48022248ca9394bf2 repair | anthropic/claude-sonnet-5-5 | 7779 | 517 | 1982 | 0.03548140 | complete | req_011Cgj2CvUrSxCaHyTdXTypb | 9.82159355 |
| 2026-11-05 15:23 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19219 | 0 | 6000 | 0.00496555 | length | req_011CgjJPKyrMEas1oD6a9FDC | 9.82655910 |
| 2026-11-05 15:23 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22311 | 1746 | 6000 | 0.00524856 | length | req_011CgjJRWyTJZrDq22xxnDVM | 9.83180766 |
| 2026-11-05 15:24 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19500 | 1746 | 6000 | 0.00496746 | length | req_011CgjJTXWzsyyJSXvexbcne | 9.83677512 |
| 2026-11-05 15:24 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21920 | 1746 | 6000 | 0.00520946 | length | req_011CgjJVcHo9TMsgvdkkuJAh | 9.84198458 |
| 2026-11-05 15:25 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22322 | 1746 | 6000 | 0.00524966 | length | req_011CgjJXjKHPeafwKqCcxGXF | 9.84723424 |
| 2026-11-05 15:25 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20619 | 1746 | 6000 | 0.00507936 | length | req_011CgjJZgfLKyMru5nx2RXc1 | 9.85231360 |
| 2026-11-05 15:26 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19692 | 1746 | 6000 | 0.00498666 | length | req_011CgjJbtfxLopRzdDgzB6Yc | 9.85730026 |
| 2026-11-05 15:26 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21886 | 1746 | 6000 | 0.00520606 | length | req_011CgjJe4KSUhj44qmxDFukJ | 9.86250632 |
| 2026-11-05 15:27 | 검수 측정 review | anthropic/claude-haiku-5-5 | 16927 | 1746 | 6000 | 0.00471016 | length | req_011CgjJg7RmmSFzdSAuKu8Ni | 9.86721648 |
| 2026-11-05 15:27 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19836 | 1746 | 6000 | 0.00500106 | length | req_011CgjJi7jCDG6br4uZUS4Ax | 9.87221754 |
| 2026-11-05 15:27 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20614 | 1746 | 6000 | 0.00507886 | length | req_011CgjJk89YFxTMp3bYx1c1W | 9.87729640 |
| 2026-11-05 15:28 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19501 | 1746 | 6000 | 0.00496756 | length | req_011CgjJnC3WeA5D41v4uvnwf | 9.88226396 |
| 2026-11-05 15:28 | 검수 측정 review | anthropic/claude-haiku-5-5 | 18005 | 1746 | 6000 | 0.00481796 | length | req_011CgjJpGF5Q3SKFb7K7cGmh | 9.88708192 |
| 2026-11-05 15:29 | 검수 측정 review | anthropic/claude-haiku-5-5 | 23708 | 1746 | 6000 | 0.00538826 | length | req_011CgjJrHkfcDfJByPyVvcdv | 9.89247018 |
| 2026-11-05 15:29 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21226 | 1746 | 6000 | 0.00514006 | length | req_011CgjJtTDVCAijvJ6HLTiwU | 9.89761024 |
| 2026-11-05 15:30 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22130 | 1746 | 6000 | 0.00523046 | length | req_011CgjJvaZZuAck7F6xqHwW8 | 9.90284070 |
| 2026-11-05 15:30 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20134 | 1746 | 6000 | 0.00503086 | length | req_011CgjJxdqK6MhS1G7Tba2yi | 9.90787156 |
| 2026-11-05 15:32 | 검수 측정 review | anthropic/claude-haiku-5-5 | 23744 | 0 | 3567 | 0.00420152 | complete | req_011CgjK56pTTPzszHNTrxbhF | 9.91207308 |
| 2026-11-05 15:33 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21999 | 1746 | 5214 | 0.00482436 | complete | req_011CgjK9JJ8yTuzy4zwD35PJ | 9.91689744 |
| 2026-11-05 15:33 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 23744 | 0 | 3821 | 0.08657050 | complete | req_011CgjKBhVhdYwPmWUDcRhPk | 10.00346794 |
| 2026-11-05 15:34 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19457 | 0 | 9429 | 0.00670955 | complete | req_011CgjKG6PDrDMLBz5UhaJ6Y | 10.01017749 |
| 2026-11-05 15:35 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22427 | 1974 | 6727 | 0.00562594 | complete | req_011CgjKK9qREd36Y4RFxnE1J | 10.01580343 |
| 2026-11-05 15:36 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19510 | 1974 | 8374 | 0.00615774 | complete | req_011CgjKMVHmDdHJRpGMi4bnB | 10.02196117 |
| 2026-11-05 15:36 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21930 | 1974 | 6328 | 0.00537674 | complete | req_011CgjKQDdG68h2R2ohzw4kC | 10.02733791 |
| 2026-11-05 15:36 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22332 | 1974 | 106 | 0.00230594 | complete | req_011CgjKSNeo7Qbfy93VqNYrZ | 10.02964385 |
| 2026-11-05 15:37 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20629 | 1974 | 6407 | 0.00528614 | complete | req_011CgjKSXcYq7Du9TtRhh2st | 10.03492999 |
| 2026-11-05 15:37 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19702 | 1974 | 2412 | 0.00319594 | complete | req_011CgjKUfcKATV7qP9fZdfVe | 10.03812593 |
| 2026-11-05 15:37 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21999 | 1974 | 6304 | 0.00537164 | complete | req_011CgjKVX1ffopxvFZhxhzbJ | 10.04349757 |
| 2026-11-05 15:38 | 검수 측정 review | anthropic/claude-haiku-5-5 | 16937 | 1974 | 4082 | 0.00375444 | complete | req_011CgjKXZ9DHYaX85RRu2u3o | 10.04725201 |
| 2026-11-05 15:38 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19943 | 1974 | 3157 | 0.00359254 | complete | req_011CgjKYyWCWk3qoK9GTPkBR | 10.05084455 |
| 2026-11-05 15:38 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20624 | 1974 | 6947 | 0.00555564 | complete | req_011CgjKZw9bgX4LD9vMLkRAJ | 10.05640019 |
| 2026-11-05 15:39 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19511 | 1974 | 9661 | 0.00680134 | complete | req_011CgjKcPKVkHWU8oaSbxP4i | 10.06320153 |
| 2026-11-05 15:40 | 검수 측정 review | anthropic/claude-haiku-5-5 | 18015 | 1974 | 9103 | 0.00637274 | complete | req_011CgjKfXrJUW918c5f5Kroy | 10.06957427 |
| 2026-11-05 15:40 | 검수 측정 review | anthropic/claude-haiku-5-5 | 23815 | 1974 | 261 | 0.00253174 | complete | req_011CgjKiPJBmTemw58bdvthg | 10.07210601 |
| 2026-11-05 15:40 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21236 | 1974 | 2537 | 0.00341184 | complete | req_011CgjKiZy7xdozT7ZyxVuGq | 10.07551785 |
| 2026-11-05 15:40 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22140 | 1974 | 5880 | 0.00517374 | complete | req_011CgjKjSFJrqb9t2KWfcWFt | 10.08069159 |
| 2026-11-05 15:41 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20144 | 1974 | 7876 | 0.00597214 | complete | req_011CgjKmWap6MD9Lnt9UhWNW | 10.08666373 |
| 2026-11-05 15:42 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 19456 | 0 | 1538 | 0.05527850 | complete | req_011CgjKtGipycL7kht3KbBhy | 10.14194223 |
| 2026-11-05 15:42 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 22427 | 1973 | 2773 | 0.07297860 | complete | req_011CgjKuCKwYMLqTz6rfTRXw | 10.21492083 |
| 2026-11-05 15:43 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 19510 | 1973 | 3407 | 0.07348460 | complete | req_011CgjKvbnMQ8opMhL1zDewc | 10.28840543 |
| 2026-11-05 15:43 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 21930 | 1973 | 3345 | 0.07770460 | complete | req_011CgjKxPAsv8peLS3pUut7R | 10.36611003 |
| 2026-11-05 15:44 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 22332 | 1973 | 3845 | 0.08350860 | complete | req_011CgjKz9i4XaoYBYrRMyYQU | 10.44961863 |
| 2026-11-05 15:44 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 20629 | 1973 | 3090 | 0.07255260 | complete | req_011CgjL26G1bAxHnbSeMMSzZ | 10.52217123 |
| 2026-11-05 15:45 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 19702 | 1973 | 4338 | 0.08317860 | complete | req_011CgjL3d2i9uTBNpiRx25DH | 10.60534983 |
| 2026-11-05 15:45 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 21999 | 1973 | 2528 | 0.06967260 | complete | req_011CgjL5jKnQzMmR1WARMaJM | 10.67502243 |
| 2026-11-05 15:45 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 16937 | 1973 | 1674 | 0.05100860 | complete | req_011CgjL7CLmChWHeKJ4ejVJk | 10.72603103 |
| 2026-11-05 15:45 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 19943 | 1973 | 2712 | 0.06740060 | complete | req_011CgjL8AConZvXP2e6AS7xy | 10.79343163 |
| 2026-11-05 15:46 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 20624 | 1973 | 4119 | 0.08283260 | complete | req_011CgjL9avs4Ge2iAS2cJ3Ly | 10.87626423 |
| 2026-11-05 15:46 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 19511 | 1973 | 3510 | 0.07451660 | complete | req_011CgjLBdkLhc7BDT8fasuEA | 10.95078083 |
| 2026-11-05 15:47 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 18015 | 1973 | 3591 | 0.07233460 | complete | req_011CgjLDJWGA677Dhi4Ci9wp | 11.02311543 |
| 2026-11-05 15:47 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 23815 | 1973 | 2591 | 0.07393460 | complete | req_011CgjLFB8YzQ8Z2jSmqsmLU | 11.09705003 |
| 2026-11-05 15:48 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 21236 | 1973 | 4640 | 0.08926660 | complete | req_011CgjLGa1VtLiuXnu7mnuKk | 11.18631663 |
| 2026-11-05 15:48 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 22140 | 1973 | 2641 | 0.07108460 | complete | req_011CgjLK28wCZc163LYyKiY4 | 11.25740123 |
| 2026-11-05 15:48 | 검수 측정 review | anthropic/claude-sonnet-5-5 | 20144 | 1973 | 4351 | 0.08419260 | complete | req_011CgjLLTUxT9h6Th9dznqbu | 11.34159383 |
| 2026-11-05 15:51 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19696 | 0 | 8787 | 0.00641827 | complete | req_011CgjLWsa4sKvwtAQgwKtU2 | 11.34801210 |
| 2026-11-05 15:51 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22425 | 2207 | 6155 | 0.00534207 | complete | req_011CgjLZobXnj31kNujAqpG7 | 11.35335417 |
| 2026-11-05 15:52 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19518 | 2207 | 7571 | 0.00575937 | complete | req_011CgjLc34TcFzahoy8aYmgW | 11.35911354 |
| 2026-11-05 15:53 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21938 | 2207 | 7274 | 0.00585287 | complete | req_011CgjLeY42uRbjrBvVensKw | 11.36496641 |
| 2026-11-05 15:53 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22340 | 2207 | 7771 | 0.00614157 | complete | req_011CgjLgw6g3pTL9SnAH5DKE | 11.37110798 |
| 2026-11-05 15:54 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20639 | 2207 | 8151 | 0.00616147 | complete | req_011CgjLjYyzNM55X3TAD3tzK | 11.37726945 |
| 2026-11-05 15:54 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19714 | 2207 | 185 | 0.00208597 | complete | req_011CgjLnFTdCR6MbFGXdVj19 | 11.37935542 |
| 2026-11-05 15:54 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21987 | 2207 | 121 | 0.00228127 | complete | req_011CgjLnU5tugbxLSDipwnhS | 11.38163669 |
| 2026-11-05 15:54 | 검수 측정 review | anthropic/claude-haiku-5-5 | 16939 | 2207 | 6787 | 0.00510947 | complete | req_011CgjLnegry47ywcpGFbQC4 | 11.38674616 |
| 2026-11-05 15:55 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19927 | 2207 | 5642 | 0.00483577 | complete | req_011CgjLpz6EaQYJn9BDsYwCq | 11.39158193 |
| 2026-11-05 15:55 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20624 | 2207 | 5755 | 0.00496197 | complete | req_011CgjLrwNLHV8aUMzCZGYcd | 11.39654390 |
| 2026-11-05 15:56 | 검수 측정 review | anthropic/claude-haiku-5-5 | 19515 | 2207 | 11173 | 0.00756007 | complete | req_011CgjLtsQGQHaxq3jmMWhkk | 11.40410397 |
| 2026-11-05 15:56 | 검수 측정 review | anthropic/claude-haiku-5-5 | 18021 | 2207 | 2158 | 0.00290317 | complete | req_011CgjLxNfF6n43RZZyDJQmw | 11.40700714 |
| 2026-11-05 15:56 | 검수 측정 review | anthropic/claude-haiku-5-5 | 23805 | 2207 | 3150 | 0.00397757 | complete | req_011CgjLy4Ez7Yj9e5BdimTbX | 11.41098471 |
| 2026-11-05 15:57 | 검수 측정 review | anthropic/claude-haiku-5-5 | 21238 | 2207 | 3262 | 0.00377687 | complete | req_011CgjLz3jWVWv7QB3cRG289 | 11.41476158 |
| 2026-11-05 15:57 | 검수 측정 review | anthropic/claude-haiku-5-5 | 22148 | 2207 | 7349 | 0.00591137 | complete | req_011CgjM16x1kPizsaTRFEiAD | 11.42067295 |
| 2026-11-05 15:58 | 검수 측정 review | anthropic/claude-haiku-5-5 | 20148 | 2207 | 8954 | 0.00651387 | complete | req_011CgjM3bhD2saBtzTWQgFXQ | 11.42718682 |
| 2026-11-05 16:05 | 발행 흐름 재생 review | anthropic/claude-haiku-5-5 | 23575 | 0 | 4631 | 0.00467300 | complete | req_011CgjMeBfK79v9pbp4GMBbg | 11.43185982 |
| 2026-11-05 16:06 | 발행 흐름 재생 repair | anthropic/claude-sonnet-5-5 | 8951 | 0 | 1752 | 0.03542200 | complete | req_011CgjMfwWL2K6wmybo8rn2u | 11.46728182 |
| 2026-11-05 17:02 | 최종판3 4권(결제 경로) · official report_b743ac3a17da4f308867071b97a1e93b | anthropic/claude-sonnet-5-5 | 26680 | 0 | 15802 | 0.21486450 | complete | req_011CgjRofcHuh9a5ufVX26cN | 11.68214632 |
| 2026-11-05 17:02 | 최종판3 4권(결제 경로) · official report_b743ac3a17da4f308867071b97a1e93b review | anthropic/claude-haiku-5-5 | 23470 | 0 | 11066 | 0.00792935 | complete | req_011CgjRxXinMAXotjvrbkz2L | 11.69007567 |
| 2026-11-05 17:03 | 최종판3 4권(결제 경로) · official report_b743ac3a17da4f308867071b97a1e93b repair | anthropic/claude-sonnet-5-5 | 7740 | 0 | 1699 | 0.03247000 | complete | req_011CgjS2RPtTvCbBdC2wFZbJ | 11.72254567 |
| 2026-11-05 17:05 | 최종판3 4권(결제 경로) · official report_2ed154e5008d4ccd91f131666071699c | anthropic/claude-sonnet-5-5 | 17535 | 6969 | 13187 | 0.16833380 | complete | req_011CgjS4w3QLUG5aciLfpsLQ | 11.89087947 |
| 2026-11-05 17:05 | 최종판3 4권(결제 경로) · official report_2ed154e5008d4ccd91f131666071699c review | anthropic/claude-haiku-5-5 | 18836 | 1974 | 8184 | 0.00599534 | complete | req_011CgjSC4z6146HCeh2wNxEu | 11.89687481 |
| 2026-11-05 17:05 | 최종판3 4권(결제 경로) · official report_2ed154e5008d4ccd91f131666071699c repair | anthropic/claude-sonnet-5-5 | 9036 | 0 | 1698 | 0.03505200 | complete | req_011CgjSEeNLN5CkjUDbebW8q | 11.93192681 |
| 2026-11-05 17:08 | 최종판3 4권(결제 경로) · official report_67a9e52ce70148c59797afa008d85a0b | anthropic/claude-sonnet-5-5 | 17084 | 6969 | 10757 | 0.14313180 | complete | req_011CgjSM5Kvs2eNxHyZvj6md | 12.07505861 |
| 2026-11-05 17:09 | 최종판3 4권(결제 경로) · official report_67a9e52ce70148c59797afa008d85a0b review | anthropic/claude-haiku-5-5 | 16052 | 1974 | 6442 | 0.00484594 | complete | req_011CgjST3dtYqmpg7gE5UBWa | 12.07990455 |
| 2026-11-05 17:09 | 최종판3 4권(결제 경로) · official report_67a9e52ce70148c59797afa008d85a0b repair | anthropic/claude-sonnet-5-5 | 5061 | 0 | 975 | 0.01987200 | complete | req_011CgjSVF9zieDAM4Ghbw87y | 12.09977655 |
| 2026-11-05 17:17 | 최종판3 4권(결제 경로) · official report_165ef864ee85407fbcc87449f58d7be4 | anthropic/claude-sonnet-5-5 | 33543 | 0 | 12000 | 0.19057050 | complete | req_011CgjSzNyquoa42THYttunt | 12.29034705 |
| 2026-11-05 17:17 | 최종판3 4권(결제 경로) · official report_165ef864ee85407fbcc87449f58d7be4 review | anthropic/claude-haiku-5-5 | 22970 | 0 | 8026 | 0.00635935 | complete | req_011CgjT7LZwEBd9Xjt1NKA24 | 12.29670640 |
| 2026-11-05 17:17 | 최종판3 4권(결제 경로) · official report_165ef864ee85407fbcc87449f58d7be4 repair | anthropic/claude-sonnet-5-5 | 5803 | 0 | 932 | 0.02122500 | complete | req_011CgjT9s24dCPZToL7LHFjB | 12.31793140 |
| 2026-11-05 17:27 | 최종판3 12 차단 문장 고침 · 문장 7 repair | anthropic/claude-sonnet-5-5 | 3115 | 0 | 377 | 0.01029900 | complete | req_011CgjTrWWfPfnPHeqCNRgbn | 12.32823040 |
| 2026-11-05 17:27 | 최종판3 12 차단 문장 고침 · 문장 4 repair | anthropic/claude-sonnet-5-5 | 1953 | 598 | 251 | 0.00653560 | complete | req_011CgjTvJAd26ZCkUgUSPA3L | 12.33476600 |
| 2026-11-05 17:27 | 최종판3 12 차단 문장 고침 · 문장 1 repair | anthropic/claude-sonnet-5-5 | 1020 | 598 | 43 | 0.00258960 | complete | req_011CgjTvc5eWaHHewfm843Xx | 12.33735560 |
| 2026-11-05 17:28 | 최종판3 12 차단 문장 고침 · 문장 1 repair | anthropic/claude-sonnet-5-5 | 2165 | 598 | 70 | 0.00514960 | complete | req_011CgjTvrz5ic24WAW6KtN4P | 12.34250520 |
| 2026-11-05 17:32 | 최종판3 13 운영 워커 경로 재생(작가 저장본) review | anthropic/claude-haiku-5-5 | 22961 | 0 | 6849 | 0.00572060 | complete | req_011CgjUDHQD9jmwmge2sHLii | 12.34822580 |
| 2026-11-05 17:32 | 최종판3 13 운영 워커 경로 재생(작가 저장본) repair | anthropic/claude-sonnet-5-5 | 5715 | 0 | 1022 | 0.02165000 | complete | req_011CgjUFcave6Bra3WgxBpwC | 12.36987580 |
| 2026-11-05 17:33 | 최종판3 13 운영 워커 경로 재생(작가 저장본) review | anthropic/claude-haiku-5-5 | 22961 | 0 | 3929 | 0.00426060 | complete | req_011CgjUK1sjXhCbk3MbakJBx | 12.37413640 |
| 2026-11-13 20:25 | W1 p4-1-gr6aa2 | anthropic/claude-sonnet-5-5 | 24879 | 0 | 48458 | 0.53433800 | length | req_011CgzqTp26orKKQZkkGyf3Y | 12.90847440 |
| 2026-11-13 20:25 | W1 p4-1-gr6aa2 review | anthropic/claude-haiku-5-5 | 13690 | 0 | 5834 | 0.00428600 | complete | req_011Cgzquojy1JobgYUduqgwT | 12.91276040 |
| 2026-11-13 20:25 | W1 p4-1-gr6aa2 repair | anthropic/claude-sonnet-5-5 | 2995 | 0 | 320 | 0.00919000 | complete | req_011Cgzqwq9r7fWhNGvLE9Zig | 12.92195040 |
| 2026-11-13 20:36 | W1 p4-1b-gr6aa2 | anthropic/claude-sonnet-5-5 | 24879 | 0 | 50140 | 0.55115800 | complete | req_011CgzrLWybaPxQk7TbRg6r9 | 13.47310840 |
| 2026-11-13 20:37 | W1 p4-1b-gr6aa2 review | anthropic/claude-haiku-5-5 | 23556 | 0 | 7548 | 0.00612960 | complete | req_011CgzrnZjmhyYwTTja2i69U | 13.47923800 |
| 2026-11-13 20:37 | W1 p4-1b-gr6aa2 repair | anthropic/claude-sonnet-5-5 | 6058 | 0 | 1206 | 0.02417600 | complete | req_011CgzrqLmjZQn42CST9YDfU | 13.50341400 |
| 2026-11-13 20:40 | W1 p4-2-full758132 | anthropic/claude-sonnet-5-5 | 25454 | 0 | 16880 | 0.21970800 | complete | req_011Cgzrv48GNKK6xwFSShoih | 13.72312200 |
| 2026-11-13 20:40 | W1 p4-2-full758132 review | anthropic/claude-haiku-5-5 | 24651 | 0 | 7286 | 0.00610810 | complete | req_011Cgzs5FdZvNvt1bu559pjG | 13.72923010 |
| 2026-11-13 20:41 | W1 p4-2-full758132 repair | anthropic/claude-sonnet-5-5 | 10719 | 0 | 2117 | 0.04260800 | complete | req_011Cgzs7ghFaTRwptqwfUWEh | 13.77183810 |
| 2026-11-13 20:42 | W1 p4-2-full0cfdac | anthropic/claude-sonnet-5-5 | 28630 | 0 | 13341 | 0.19067000 | complete | req_011Cgzs9HwpmhMDKePQcQS6K | 13.96250810 |
| 2026-11-13 20:43 | W1 p4-2-full0cfdac review | anthropic/claude-haiku-5-5 | 21445 | 0 | 7437 | 0.00586300 | complete | req_011CgzsGY7KP2hE8m1i8vrSH | 13.96837110 |
| 2026-11-13 20:43 | W1 p4-2-full0cfdac repair | anthropic/claude-sonnet-5-5 | 7448 | 0 | 1603 | 0.03092600 | complete | req_011CgzsK6WGroQ3cXdujfrry | 13.99929710 |
| 2026-11-13 20:45 | W1 p4-3-new-full | anthropic/claude-sonnet-5-5 | 28369 | 0 | 15230 | 0.20903800 | complete | req_011CgzsLfYfEd4M4taffkKQj | 14.20833510 |
| 2026-11-13 20:46 | W1 p4-3-new-full review | anthropic/claude-haiku-5-5 | 23031 | 0 | 6300 | 0.00545310 | complete | req_011CgzsUinbM6tgJs9mnBiHY | 14.21378820 |
| 2026-11-13 20:46 | W1 p4-3-new-full repair | anthropic/claude-sonnet-5-5 | 5653 | 0 | 1308 | 0.02438600 | complete | req_011CgzsWnGF9oDmXK3DTCG91 | 14.23817420 |
| 2026-11-13 20:47 | W1 p4-3-new-career | anthropic/claude-sonnet-5-5 | 25361 | 0 | 12860 | 0.17932200 | complete | req_011CgzsXtovyMgocohZmyu5d | 14.41749620 |
| 2026-11-13 20:48 | W1 p4-3-new-career review | anthropic/claude-haiku-5-5 | 20475 | 0 | 552 | 0.00232350 | complete | req_011CgzsekDCJd1eKjUaMzLDG | 14.41981970 |
| 2026-11-13 20:48 | W1 p4-3-new-career repair | anthropic/claude-sonnet-5-5 | 10776 | 0 | 2259 | 0.04414200 | complete | req_011Cgzsf33y8PCnz1UzuobWd | 14.46396170 |
| 2026-11-13 20:49 | W1 p4-3-new-love | anthropic/claude-sonnet-5-5 | 23968 | 0 | 11761 | 0.16554600 | complete | req_011CgzsgNH9ZN8jGSy3CjAGP | 14.62950770 |
| 2026-11-13 20:50 | W1 p4-3-new-love review | anthropic/claude-haiku-5-5 | 19231 | 0 | 8298 | 0.00607210 | complete | req_011Cgzso1KWRLkTC165mA9XR | 14.63557980 |
| 2026-11-13 20:50 | W1 p4-3-new-love repair | anthropic/claude-sonnet-5-5 | 5994 | 0 | 1153 | 0.02351800 | complete | req_011CgzsqcygEJALha9yGzHV9 | 14.65909780 |
| 2026-11-13 20:52 | W1 p4-3-new-compat | anthropic/claude-sonnet-5-5 | 33266 | 0 | 14333 | 0.20986200 | complete | req_011CgzsrQStwndRyQ5yqesf2 | 14.86895980 |
| 2026-11-13 20:52 | W1 p4-3-new-compat review | anthropic/claude-haiku-5-5 | 26131 | 0 | 2094 | 0.00366010 | complete | req_011CgzsysY1deEuqGY5zdgH3 | 14.87261990 |
| 2026-11-13 20:52 | W1 p4-3-new-compat repair | anthropic/claude-sonnet-5-5 | 6297 | 0 | 901 | 0.02160400 | complete | req_011Cgzszad3Zzd957c8MQdtr | 14.89422390 |
| 2026-11-13 20:54 | W1 p4-3-old-career | anthropic/claude-sonnet-5-5 | 25361 | 0 | 12671 | 0.17743200 | complete | req_011Cgzt1GZsNP3tFxMhdxAGJ | 15.07165590 |
| 2026-11-13 20:54 | W1 p4-3-old-career review | anthropic/claude-haiku-5-5 | 20179 | 0 | 9376 | 0.00670590 | complete | req_011Cgzt7p77Un3esvQeWQtic | 15.07836180 |
| 2026-11-13 20:55 | W1 p4-3-old-career repair | anthropic/claude-sonnet-5-5 | 10654 | 0 | 2341 | 0.04471800 | complete | req_011CgztAuPvniDaX9qcFWgRu | 15.12307980 |
| 2026-11-13 20:56 | W1 p4-3-old-love | anthropic/claude-sonnet-5-5 | 23968 | 0 | 11396 | 0.16189600 | complete | req_011CgztCBmCcrcq3Bp8ndnAq | 15.28497580 |
| 2026-11-13 20:56 | W1 p4-3-old-love review | anthropic/claude-haiku-5-5 | 18900 | 0 | 186 | 0.00198300 | complete | req_011CgztJbjX8gn3birKLwrSz | 15.28695880 |
| 2026-11-13 20:56 | W1 p4-3-old-love repair | anthropic/claude-sonnet-5-5 | 3990 | 0 | 672 | 0.01470000 | complete | req_011CgztJjwP5unt91Axqh2dm | 15.30165880 |
| 2026-11-13 20:58 | W1 p4-3-old-compat | anthropic/claude-sonnet-5-5 | 33266 | 0 | 11255 | 0.17908200 | complete | req_011CgztKQ6Jt3Adcd8kEMcit | 15.48074080 |
| 2026-11-13 20:58 | W1 p4-3-old-compat review | anthropic/claude-haiku-5-5 | 21888 | 0 | 8546 | 0.00646180 | complete | req_011CgztRQnQUpuqQcLUTb7uQ | 15.48720260 |
| 2026-11-13 20:58 | W1 p4-3-old-compat repair | anthropic/claude-sonnet-5-5 | 7250 | 0 | 1377 | 0.02827000 | complete | req_011CgztU9rK1ToAYW5WSuax6 | 15.51547260 |
| 2026-11-13 21:01 | W1 p4-4-cut-love | anthropic/claude-sonnet-5-5 | 23968 | 0 | 6000 | 0.10793600 | length | req_011CgztdVk8eYDqukA3D6oSQ | 15.62340860 |
| 2026-11-13 21:02 | W1 p4-4-cut-love continuation | anthropic/claude-sonnet-5-5 | 29420 | 0 | 6527 | 0.12411000 | complete | req_011CgzthEHKyZAWj6SKpdahN | 15.74751860 |
| 2026-11-13 21:02 | W1 p4-4-cut-love review | anthropic/claude-haiku-5-5 | 19196 | 0 | 5451 | 0.00464510 | complete | req_011Cgztm1MZ573x3AzLNgLMf | 15.75216370 |
| 2026-11-13 21:03 | W1 p4-4-cut-love repair | anthropic/claude-sonnet-5-5 | 6123 | 0 | 1332 | 0.02556600 | complete | req_011CgztnqiBXXBZekcKufh3h | 15.77772970 |
| 2026-11-13 21:06 | W1 p4-5-reduced-gr6aa2 | anthropic/claude-sonnet-5-5 | 24880 | 0 | 23449 | 0.28425000 | complete | req_011Cgzts2qGmJcmBnQc1Bkor | 16.06197970 |
| 2026-11-13 21:07 | W1 p4-5-reduced-gr6aa2 review | anthropic/claude-haiku-5-5 | 21206 | 0 | 8404 | 0.00632260 | complete | req_011Cgzu5syL9EqzRmLey5im8 | 16.06830230 |
| 2026-11-13 21:07 | W1 p4-5-reduced-gr6aa2 repair | anthropic/claude-sonnet-5-5 | 7253 | 0 | 1532 | 0.02982600 | complete | req_011Cgzu8eLNcaXpJmCBpjeRH | 16.09812830 |
| 2026-11-14 16:40 | W3 P2 p2-normal-love | anthropic/claude-sonnet-5-5 | 23767 | 0 | 11946 | 0.16699400 | complete | req_011Ch2STkfGkFqviyQfMZSkd | 16.26512230 |
| 2026-11-14 16:40 | W3 P2 p2-normal-love review | anthropic/claude-haiku-5-5 | 19676 | 0 | 5866 | 0.00490060 | complete | req_011Ch2Saas6sXZdNC1kYAQfn | 16.27002290 |
| 2026-11-14 16:40 | W3 P2 p2-normal-love repair | anthropic/claude-sonnet-5-5 | 5868 | 0 | 1026 | 0.02199600 | complete | req_011Ch2Sca3ZEWmY5uBthCwYP | 16.29201890 |
| 2026-11-14 16:41 | W3 P2 p2-forced-career | anthropic/claude-sonnet-5-5 | 0 | 0 | 0 | 0.00000000 | error:http_529 | - | 16.29201890 |
| 2026-11-14 16:42 | W3 P2 p2-forced-career | anthropic/claude-sonnet-5-5 | 25135 | 0 | 14977 | 0.20004000 | complete | req_011Ch2Se8g8gnKRWgK7N8tNt | 16.49205890 |
| 2026-11-14 16:43 | W3 P2 p2-forced-career review | anthropic/claude-haiku-5-5 | 23092 | 0 | 7597 | 0.00610770 | complete | req_011Ch2Sn7k3MEqai2rHVrHqA | 16.49816660 |
| 2026-11-14 16:43 | W3 P2 p2-forced-career repair | anthropic/claude-sonnet-5-5 | 11376 | 0 | 2430 | 0.04705200 | complete | req_011Ch2SpeXm4XsQtWc166HfH | 16.54521860 |
| 2026-11-14 16:44 | W3 P2 p2-forced2-career | anthropic/claude-sonnet-5-5 | 0 | 0 | 0 | 0.00000000 | error:http_529 | - | 16.54521860 |
| 2026-11-14 16:44 | W3 P2 p2-forced2-career | anthropic/claude-sonnet-5-5 | 0 | 0 | 0 | 0.00000000 | error:http_529 | - | 16.54521860 |
| 2026-11-14 16:48 | W3 P2 p2-forced2-career | anthropic/claude-sonnet-5-5 | 25140 | 0 | 13983 | 0.19011000 | complete | req_011Ch2T5w8ZqnDhSEkjxuES9 | 16.73532860 |
| 2026-11-14 16:49 | W3 P2 p2-forced2-career review | anthropic/claude-haiku-5-5 | 21897 | 0 | 6927 | 0.00565320 | complete | req_011Ch2TD8mVnpJuVsEAwfiXL | 16.74098180 |
| 2026-11-14 16:49 | W3 P2 p2-forced2-career repair | anthropic/claude-sonnet-5-5 | 11202 | 0 | 2509 | 0.04749400 | complete | req_011Ch2TFyzytLLDnP6BC8PrG | 16.78847580 |
| 2026-11-14 19:00 | W3 P4 p4-1-full-AL | anthropic/claude-sonnet-5-5 | 26117 | 0 | 10513 | 0.15736400 | complete | req_011Ch2d9GVeE6qKvAnKeCqfR | 16.94583980 |
| 2026-11-14 19:00 | W3 P4 p4-1-full-AL review | anthropic/claude-haiku-5-5 | 18631 | 0 | 7724 | 0.00572510 | complete | req_011Ch2dF17bdu3yXq2QeLPCM | 16.95156490 |
| 2026-11-14 19:00 | W3 P4 p4-1-full-AL repair | anthropic/claude-sonnet-5-5 | 7791 | 0 | 1570 | 0.03128200 | complete | req_011Ch2dHheCjrpnh72jKtYns | 16.98284690 |
| 2026-11-14 19:02 | W3 P4 p4-1-love-AL | anthropic/claude-sonnet-5-5 | 22619 | 0 | 11690 | 0.16213800 | complete | req_011Ch2dJfEsVzQfCw1P8BCsg | 17.14498490 |
| 2026-11-14 19:02 | W3 P4 p4-1-love-AL review | anthropic/claude-haiku-5-5 | 19782 | 0 | 3620 | 0.00378820 | complete | req_011Ch2dR9C3Rge6VJ5NxFKXw | 17.14877310 |
| 2026-11-14 19:03 | W3 P4 p4-1-love-AL repair | anthropic/claude-sonnet-5-5 | 8524 | 0 | 1781 | 0.03485800 | complete | req_011Ch2dSLEbdaAZUA78ewjXb | 17.18363110 |
| 2026-11-14 19:05 | W3 P4 p4-1-compat-AL | anthropic/claude-sonnet-5-5 | 33315 | 0 | 16119 | 0.22782000 | complete | req_011Ch2dTZz7rrYn4GYatk5Ko | 17.41145110 |
| 2026-11-14 19:05 | W3 P4 p4-1-compat-AL review | anthropic/claude-haiku-5-5 | 27653 | 0 | 7874 | 0.00670230 | complete | req_011Ch2dcQrBxGyV6qUYXPL3F | 17.41815340 |
| 2026-11-14 19:05 | W3 P4 p4-1-compat-AL repair | anthropic/claude-sonnet-5-5 | 13116 | 0 | 2539 | 0.05162200 | complete | req_011Ch2dewBsvhJ5JzfgNCJMD | 17.46977540 |
| 2026-11-14 19:07 | W3 P4 p4-1-career-AL | anthropic/claude-sonnet-5-5 | 24695 | 0 | 13216 | 0.18155000 | complete | req_011Ch2dgLiFrCykwYcnayHve | 17.65132540 |
| 2026-11-14 19:08 | W3 P4 p4-1-career-AL review | anthropic/claude-haiku-5-5 | 21143 | 0 | 8033 | 0.00613080 | complete | req_011Ch2doAbkHd2jxDqyE2Jan | 17.65745620 |
| 2026-11-14 19:08 | W3 P4 p4-1-career-AL repair | anthropic/claude-sonnet-5-5 | 10722 | 0 | 2498 | 0.04642400 | complete | req_011Ch2dqqCWtSZ9LZrgELDWA | 17.70388020 |
| 2026-11-14 19:54 | W3 P4 p4-2-full-A | anthropic/claude-sonnet-5-5 | 28354 | 0 | 15897 | 0.21567800 | complete | req_011Ch2hF4mphSLdDGgtGdWfK | 17.91955820 |
| 2026-11-14 19:55 | W3 P4 p4-2-full-A review | anthropic/claude-haiku-5-5 | 24430 | 0 | 6283 | 0.00558450 | complete | req_011Ch2hQ4DbXm7jn9Ex36KZs | 17.92514270 |
| 2026-11-14 19:55 | W3 P4 p4-2-full-A repair | anthropic/claude-sonnet-5-5 | 6229 | 0 | 1268 | 0.02513800 | complete | req_011Ch2hST4KiWkMx86NUMRgA | 17.95028070 |
| 2026-11-14 19:57 | W3 P4 p4-2-career-A | anthropic/claude-sonnet-5-5 | 24979 | 0 | 15213 | 0.20208800 | complete | req_011Ch2hTNhRimKNFTdAq6RoE | 18.15236870 |
| 2026-11-14 19:57 | W3 P4 p4-2-career-A review | anthropic/claude-haiku-5-5 | 23118 | 0 | 8050 | 0.00633680 | complete | req_011Ch2hbbrf2x3Zx7oRoRsZL | 18.15870550 |
| 2026-11-14 19:58 | W3 P4 p4-2-career-A repair | anthropic/claude-sonnet-5-5 | 11140 | 0 | 1943 | 0.04171000 | complete | req_011Ch2heEQQwtEQciHjyBjds | 18.20041550 |
| 2026-11-14 19:59 | W3 P4 p4-2-love-A | anthropic/claude-sonnet-5-5 | 24345 | 0 | 12900 | 0.17769000 | complete | req_011Ch2hfHSVXpbpznYqWyS7N | 18.37810550 |
| 2026-11-14 20:00 | W3 P4 p4-2-love-A review | anthropic/claude-haiku-5-5 | 21058 | 0 | 6184 | 0.00519780 | complete | req_011Ch2hnmf5h5g8ngbRzpakJ | 18.38330330 |
| 2026-11-14 20:00 | W3 P4 p4-2-love-A repair | anthropic/claude-sonnet-5-5 | 4870 | 0 | 751 | 0.01725000 | complete | req_011Ch2hpy8CMGiSoZDrnmQzh | 18.40055330 |
| 2026-11-14 20:02 | W3 P4 p4-2-compat-A | anthropic/claude-sonnet-5-5 | 33138 | 0 | 14906 | 0.21533600 | complete | req_011Ch2hqW53HEBgfDRyuKdJe | 18.61588930 |
| 2026-11-14 20:02 | W3 P4 p4-2-compat-A review | anthropic/claude-haiku-5-5 | 26302 | 0 | 5280 | 0.00527020 | complete | req_011Ch2hyaL18DiSJX7w7sheY | 18.62115950 |
| 2026-11-14 20:02 | W3 P4 p4-2-compat-A repair | anthropic/claude-sonnet-5-5 | 8735 | 0 | 1591 | 0.03338000 | complete | req_011Ch2i1PpYMp3jr78YZAAeP | 18.65453950 |
| 2026-11-14 20:05 | W3 P4 p4-1-full-AL2 | anthropic/claude-sonnet-5-5 | 26171 | 0 | 14922 | 0.20156200 | complete | req_011Ch2i3VtxgGtp5Cw29p38H | 18.85610150 |
| 2026-11-14 20:05 | W3 P4 p4-1-full-AL2 review | anthropic/claude-haiku-5-5 | 24508 | 0 | 9926 | 0.00741380 | complete | req_011Ch2iBquxJw7W8MHncWkpC | 18.86351530 |
| 2026-11-14 20:06 | W3 P4 p4-1-full-AL2 repair | anthropic/claude-sonnet-5-5 | 8380 | 0 | 1956 | 0.03632000 | complete | req_011Ch2iFCV3w4Meab48SAU9r | 18.89983530 |
| 2026-11-14 20:07 | W3 P4 p4-1-love-AL2 | anthropic/claude-sonnet-5-5 | 22634 | 0 | 11463 | 0.15989800 | complete | req_011Ch2iGJ5fcx8PdBhgfzRCh | 19.05973330 |
| 2026-11-14 20:08 | W3 P4 p4-1-love-AL2 review | anthropic/claude-haiku-5-5 | 19491 | 0 | 7340 | 0.00561910 | complete | req_011Ch2iNgZSYz2gNdSKjZkoj | 19.06535240 |
| 2026-11-14 20:08 | W3 P4 p4-1-love-AL2 repair | anthropic/claude-sonnet-5-5 | 8472 | 0 | 1836 | 0.03530400 | complete | req_011Ch2iR8kLYM77EfPcYc5PG | 19.10065640 |
| 2026-11-14 20:10 | W3 P4 p4-1-compat-AL2 | anthropic/claude-sonnet-5-5 | 33210 | 0 | 14205 | 0.20847000 | complete | req_011Ch2iSBBxUx9QjnD3xLzuE | 19.30912640 |
| 2026-11-14 20:10 | W3 P4 p4-1-compat-AL2 review | anthropic/claude-haiku-5-5 | 26347 | 0 | 3501 | 0.00438520 | complete | req_011Ch2iZozEQLAhsNaW5qFP3 | 19.31351160 |
| 2026-11-14 20:10 | W3 P4 p4-1-compat-AL2 repair | anthropic/claude-sonnet-5-5 | 13369 | 0 | 2665 | 0.05338800 | complete | req_011Ch2iatWsPsD44ReGASXgU | 19.36689960 |
| 2026-11-14 20:12 | W3 P4 p4-1-career-AL2 | anthropic/claude-sonnet-5-5 | 24640 | 0 | 12907 | 0.17835000 | complete | req_011Ch2icD5bz2GHiqtJwXDB3 | 19.54524960 |
| 2026-11-14 20:12 | W3 P4 p4-1-career-AL2 review | anthropic/claude-haiku-5-5 | 21302 | 0 | 7115 | 0.00568770 | complete | req_011Ch2iipCtBvRHaLc4PhAms | 19.55093730 |
| 2026-11-14 20:12 | W3 P4 p4-1-career-AL2 repair | anthropic/claude-sonnet-5-5 | 11164 | 0 | 2266 | 0.04498800 | complete | req_011Ch2im8Jc7NxAS93EEpVGz | 19.59592530 |
| 2026-11-14 20:14 | W3 P4 p4-2-full-AL | anthropic/claude-sonnet-5-5 | 26493 | 0 | 13232 | 0.18530600 | complete | req_011Ch2inNySgiE13zoENDpiU | 19.78123130 |
| 2026-11-14 20:15 | W3 P4 p4-2-full-AL review | anthropic/claude-haiku-5-5 | 21591 | 0 | 6775 | 0.00554660 | complete | req_011Ch2iuefwrxR1vQWnwQ9wm | 19.78677790 |
| 2026-11-14 20:15 | W3 P4 p4-2-full-AL repair | anthropic/claude-sonnet-5-5 | 6587 | 0 | 1252 | 0.02569400 | complete | req_011Ch2iwu2CqtQSWv8vFZu8f | 19.81247190 |
| 2026-11-14 20:16 | W3 P4 p4-2-career-AL | anthropic/claude-sonnet-5-5 | 24471 | 0 | 14122 | 0.19016200 | complete | req_011Ch2ixju4fxFi5dJhFpGcu | 20.00263390 |
| 2026-11-14 20:17 | W3 P4 p4-2-career-AL review | anthropic/claude-haiku-5-5 | 21874 | 0 | 8188 | 0.00628140 | complete | req_011Ch2j66C93THVn3fmRMuGe | 20.00891530 |
| 2026-11-14 20:17 | W3 P4 p4-2-career-AL repair | anthropic/claude-sonnet-5-5 | 11140 | 0 | 2123 | 0.04351000 | complete | req_011Ch2j8rF5DGa3X1yND3rXQ | 20.05242530 |
| 2026-11-14 20:19 | W3 P4 p4-2-love-AL | anthropic/claude-sonnet-5-5 | 23265 | 0 | 11846 | 0.16499000 | complete | req_011Ch2jA2PogBSQvYexNMUfc | 20.21741530 |
| 2026-11-14 20:19 | W3 P4 p4-2-love-AL review | anthropic/claude-haiku-5-5 | 20120 | 0 | 5397 | 0.00471050 | complete | req_011Ch2jGZF74ahhprR9TAsxR | 20.22212580 |
| 2026-11-14 20:19 | W3 P4 p4-2-love-AL repair | anthropic/claude-sonnet-5-5 | 9433 | 0 | 1546 | 0.03432600 | complete | req_011Ch2jJUQhxXbTCMqt9feAd | 20.25645180 |
| 2026-11-14 20:21 | W3 P4 p4-2-compat-AL | anthropic/claude-sonnet-5-5 | 33130 | 0 | 11461 | 0.18087000 | complete | req_011Ch2jKMiuBSoDF67PWMwH4 | 20.43732180 |
| 2026-11-14 20:21 | W3 P4 p4-2-compat-AL review | anthropic/claude-haiku-5-5 | 22212 | 0 | 4429 | 0.00443570 | complete | req_011Ch2jRKUdFBNUn5LJduoKE | 20.44175750 |
| 2026-11-14 20:21 | W3 P4 p4-2-compat-AL repair | anthropic/claude-sonnet-5-5 | 9486 | 0 | 1737 | 0.03634200 | complete | req_011Ch2jSuQ6913wuroStmw1f | 20.47809950 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 896 | 27797 | 1408 | 0.01865170 | complete | req_011Ch6Y8SNctasHYEgNsKA8L | 20.49675120 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 667 | 27797 | 1477 | 0.01888370 | complete | req_011Ch6Y8SNsMTTMM5FrJS28H | 20.51563490 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 28797 | 0 | 2401 | 0.09550250 | complete | req_011Ch6Y8M9MMVLUBavqHmEZd | 20.61113740 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 727 | 27797 | 2145 | 0.02568370 | complete | req_011Ch6Y8SK9Hv7BT6NDoRdkS | 20.63682110 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 801 | 27797 | 2403 | 0.02841170 | complete | req_011Ch6Y8SMsPh5Gcuw78mFL2 | 20.66523280 |
| 2026-11-16 20:35 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 164 | 27797 | 2451 | 0.02761770 | complete | req_011Ch6Y8SEC3yrgDkmXsYH5H | 20.69285050 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 772 | 31694 | 1511 | 0.01982340 | complete | req_011Ch6Y9yFmwC3qy331XhH4Y | 20.71267390 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 703 | 31694 | 1617 | 0.02074540 | complete | req_011Ch6Y9yGmLap2Su8BvR1nQ | 20.73341930 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 807 | 31694 | 2097 | 0.02575340 | complete | req_011Ch6Y9xeZfN2XUU2dJYCDP | 20.75917270 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 164 | 31694 | 2478 | 0.02827740 | complete | req_011Ch6Y9xYMXHbKCjoiPzSgu | 20.78745010 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 32809 | 0 | 2966 | 0.11112500 | complete | req_011Ch6Y9uZ28AaWyBZbYqUhS | 20.89857510 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 767 | 31694 | 2334 | 0.02804340 | complete | req_011Ch6Y9xeKLqvib8iqnkg93 | 20.92661850 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 2442 | 31694 | 197 | 0.01002340 | complete | req_011Ch6YBbZbyvVNApBVTdyZu | 20.93664190 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 682 | 30984 | 1487 | 0.01933240 | complete | req_011Ch6YCB6UG6NfzXS2Ji5ei | 20.95597430 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 955 | 30984 | 1793 | 0.02293840 | complete | req_011Ch6YCB2kkJKW9wcdE2mZK | 20.97891270 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 164 | 30984 | 2154 | 0.02496640 | complete | req_011Ch6YCB5EPyrS1uSsQgP94 | 21.00387910 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 755 | 30984 | 1952 | 0.02412840 | complete | req_011Ch6YCB5DvguxGTxqje5YJ | 21.02800750 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 32167 | 0 | 2552 | 0.10534600 | complete | req_011Ch6YBwwTAQvBcnxPxmWHD | 21.13335350 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 827 | 30984 | 2373 | 0.02848240 | complete | req_011Ch6YCB3jX3n1dZxa7q3BP | 21.16183590 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 329 | 27906 | 1421 | 0.01765860 | complete | req_011Ch6YDc8t43pf4CCP836Zk | 21.17949450 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 365 | 27906 | 1639 | 0.01991060 | complete | req_011Ch6YDc5ukhcPoqd5uh2Ck | 21.19940510 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 354 | 27906 | 1948 | 0.02297860 | complete | req_011Ch6YDbNjygsnNBYyGHDfJ | 21.22238370 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 28078 | 0 | 2445 | 0.09455900 | complete | req_011Ch6YDYf3A4NjXeoykxkko | 21.31694270 |
| 2026-11-16 20:36 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 164 | 27906 | 2527 | 0.02838860 | complete | req_011Ch6YDc2Brus7pW1DB94RM | 21.34533130 |
| 2026-11-16 20:37 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 206 | 27906 | 2770 | 0.03090260 | complete | req_011Ch6YDbwE4eMkf11Cuir8u | 21.37623390 |
| 2026-11-16 20:37 | AM2-9 P9 new | anthropic/claude-sonnet-5-5 | 1399 | 27906 | 256 | 0.00814860 | complete | req_011Ch6YFHgRpbgXrhhk2khoA | 21.38438250 |
| 2026-11-16 20:37 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 667 | 28117 | 1478 | 0.01892570 | complete | req_011Ch6YJYoMnqW5HzGUfacof | 21.40330820 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 727 | 28117 | 1832 | 0.02258570 | complete | req_011Ch6YJYieieAW6Mfwo1svQ | 21.42589390 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 896 | 28117 | 1717 | 0.02177370 | complete | req_011Ch6YJYfBKbWG8L1PnkCYM | 21.44766760 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 164 | 28117 | 2282 | 0.02595970 | complete | req_011Ch6YJYgR7oQUCLEaMiwip | 21.47362730 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 21486 | 7631 | 2445 | 0.07842810 | complete | req_011Ch6YJSkEA2CnygozmJazZ | 21.55205540 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 801 | 28117 | 2283 | 0.02724370 | complete | req_011Ch6YJYgAgmupbMur16ei4 | 21.57929910 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2409 | 28117 | 325 | 0.01087970 | complete | req_011Ch6YKtw6C1iTZZB5bY2kD | 21.59017880 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1960 | 28117 | 455 | 0.01128170 | complete | req_011Ch6YKtoQgMjUuKGPSjqHp | 21.60146050 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2569 | 28117 | 428 | 0.01222970 | complete | req_011Ch6YKunwmPxNZfM4M6Umj | 21.61369020 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1929 | 28117 | 160 | 0.00826970 | complete | req_011Ch6YL9m53baqjMtAjs4Nc | 21.62195990 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 3391 | 28117 | 538 | 0.01497370 | complete | req_011Ch6YKu81NbVwkPx96UPkw | 21.63693360 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 4096 | 28117 | 696 | 0.01796370 | complete | req_011Ch6YKtnRRhVoiR8KBdgfc | 21.65489730 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1696 | 28117 | 175 | 0.00795370 | complete | req_011Ch6YLo2gAb6XQNXf4o6KT | 21.66285100 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1745 | 28117 | 164 | 0.00794170 | complete | req_011Ch6YLoXgRT9ujNMKSKZTJ | 21.67079270 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 772 | 31815 | 1548 | 0.02020550 | complete | req_011Ch6YMFgYte7bzWhxDBsTK | 21.69099820 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 703 | 31815 | 1609 | 0.02067750 | complete | req_011Ch6YMFhHdADAscnAKXSFy | 21.71167570 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 807 | 31815 | 2098 | 0.02577550 | complete | req_011Ch6YMFWsJcqqgcxDTjkrQ | 21.73745120 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 164 | 31815 | 2482 | 0.02832950 | complete | req_011Ch6YMEzNQYRq3Xaf2H4CM | 21.76578070 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 25077 | 7853 | 2850 | 0.09142030 | complete | req_011Ch6YM7uUbjZ7NzXvBtv51 | 21.85720100 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 767 | 31815 | 2552 | 0.03023550 | complete | req_011Ch6YMFkmVxExeghNXP341 | 21.88743650 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1730 | 31815 | 207 | 0.00871150 | complete | req_011Ch6YNreGf8jd8gUd8kbk7 | 21.89614800 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2703 | 31815 | 329 | 0.01187750 | complete | req_011Ch6YNrmTGHqh9uRX1Pn3q | 21.90802550 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2065 | 31815 | 176 | 0.00907150 | complete | req_011Ch6YNrfFbHoguYDQj6h3s | 21.91709700 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1568 | 31815 | 177 | 0.00808750 | complete | req_011Ch6YP316yWoxWrt5TkuKT | 21.92518450 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 3366 | 31815 | 597 | 0.01588350 | complete | req_011Ch6YNqwqindwBYWPugYVV | 21.94106800 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 3842 | 31815 | 768 | 0.01854550 | complete | req_011Ch6YNqyLEvUvfpbz1yoVi | 21.95961350 |
| 2026-11-16 20:38 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1606 | 31815 | 201 | 0.00840350 | complete | req_011Ch6YPgWqJPyP52Ux4tXbR | 21.96801700 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1088 | 31815 | 180 | 0.00715750 | complete | req_011Ch6YPh4aoZPSzYj5JQHyz | 21.97517450 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 682 | 31278 | 1600 | 0.02049180 | complete | req_011Ch6YQ5REbABJjcKyVagQf | 21.99566630 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 955 | 31278 | 2026 | 0.02529780 | complete | req_011Ch6YQ5GZLvvv4VUXd84Ne | 22.02096410 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 755 | 31278 | 2151 | 0.02614780 | complete | req_011Ch6YQ5SVKwpJGkUcfpeCx | 22.04711190 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 24836 | 7625 | 2700 | 0.08926100 | complete | req_011Ch6YPyZ2Dgpe87RT6G3ZG | 22.13637290 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 164 | 31278 | 2540 | 0.02885580 | complete | req_011Ch6YQ4kZMwG3J5ByKYZvp | 22.16522870 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 827 | 31278 | 2830 | 0.03308180 | complete | req_011Ch6YQ5KY3iDZWuAcyvFWN | 22.19831050 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2335 | 31278 | 234 | 0.01013780 | complete | req_011Ch6YRsL27ywJLRjDa8XvL | 22.20844830 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1684 | 31278 | 206 | 0.00855580 | complete | req_011Ch6YRsp42J31vtePe7e8V | 22.21700410 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2570 | 31278 | 302 | 0.01128780 | complete | req_011Ch6YRsGJMJvf8fYsMtFoi | 22.22829190 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 4324 | 31278 | 724 | 0.01901580 | complete | req_011Ch6YRsEa74Moss1DBoJr4 | 22.24730770 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1776 | 31278 | 285 | 0.00952980 | complete | req_011Ch6YRsvVnarmgdWeSLdpA | 22.25683750 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1775 | 31278 | 144 | 0.00811780 | complete | req_011Ch6YSXvz6cEMTfhD1ax9n | 22.26495530 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2210 | 31278 | 464 | 0.01218780 | complete | req_011Ch6YSXqmtubeCK7RCMuea | 22.27714310 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1757 | 31278 | 152 | 0.00816180 | complete | req_011Ch6YSrThtvcrMwLzFo3Wv | 22.28530490 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 329 | 28080 | 1316 | 0.01662600 | complete | req_011Ch6YTCoKmE2vCHbSJbzeY | 22.30193090 |
| 2026-11-16 20:39 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 365 | 28080 | 1420 | 0.01773800 | complete | req_011Ch6YTCtnkmEreTL8UZ2dN | 22.31966890 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 20926 | 7326 | 2249 | 0.07545160 | complete | req_011Ch6YT6xLsCoUZ6wYdeZaT | 22.39512050 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 354 | 28080 | 2104 | 0.02455600 | complete | req_011Ch6YTCfPovSgzrxoTrJJt | 22.41967650 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 164 | 28080 | 2374 | 0.02687600 | complete | req_011Ch6YTCp5SXdBvHXjPPLHK | 22.44655250 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 206 | 28080 | 2374 | 0.02696000 | complete | req_011Ch6YTCn6D5tbXBjtd1BtF | 22.47351250 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1028 | 28080 | 160 | 0.00646400 | complete | req_011Ch6YUinf4zd4C9f5TeLtV | 22.47997650 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1441 | 28080 | 289 | 0.00858000 | complete | req_011Ch6YUi7E17fmNei9pr7Ae | 22.48855650 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1940 | 28080 | 325 | 0.00993800 | complete | req_011Ch6YUinu7qUzzU6DXhthB | 22.49849450 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 1900 | 28080 | 347 | 0.01007800 | complete | req_011Ch6YUiDvNqm7pt4GMXDhd | 22.50857250 |
| 2026-11-16 20:40 | AM2-9 P9 base | anthropic/claude-sonnet-5-5 | 2594 | 28080 | 520 | 0.01319600 | complete | req_011Ch6YUiBgTfrD5E6BvXWzT | 22.52176850 |
| 2026-11-16 22:02 | AM2-10 1부 am2-10-w81-full | anthropic/claude-sonnet-5-5 | 26023 | 0 | 14733 | 0.19937600 | complete | req_011Ch6ebwcULreQ6vqunwMtk | 22.72114450 |
| 2026-11-16 22:02 | AM2-10 1부 am2-10-w81-full review | anthropic/claude-haiku-5-5 | 23647 | 0 | 5952 | 0.00534070 | complete | req_011Ch6ejq535yytAiNQ1LMBW | 22.72648520 |
| 2026-11-16 22:02 | AM2-10 1부 am2-10-w81-full repair | anthropic/claude-sonnet-5-5 | 5112 | 0 | 1079 | 0.02101400 | complete | req_011Ch6emseNc7iPfEc2LGimq | 22.74749920 |
| 2026-11-16 22:04 | AM2-10 1부 am2-10-w81-compat | anthropic/claude-sonnet-5-5 | 32257 | 0 | 14245 | 0.20696400 | complete | req_011Ch6enht2gDy4sTrSDSTiM | 22.95446320 |
| 2026-11-16 22:04 | AM2-10 1부 am2-10-w81-compat review | anthropic/claude-haiku-5-5 | 26063 | 0 | 1889 | 0.00355080 | complete | req_011Ch6evCpX8SWf1u4nNfARk | 22.95801400 |
| 2026-11-16 22:04 | AM2-10 1부 am2-10-w81-compat repair | anthropic/claude-sonnet-5-5 | 6168 | 0 | 864 | 0.02097600 | complete | req_011Ch6evwHQvFXCK1gutEMRZ | 22.97899000 |
| 2026-11-16 22:06 | AM2-10 1부 am2-10-w81-career | anthropic/claude-sonnet-5-5 | 24036 | 0 | 13618 | 0.18425200 | complete | req_011Ch6ewVfKbRdmaaSbo3yBh | 23.16324200 |
| 2026-11-16 22:06 | AM2-10 1부 am2-10-w81-career review | anthropic/claude-haiku-5-5 | 22022 | 0 | 6882 | 0.00564320 | complete | req_011Ch6f4aUjtnJDwxiRzp767 | 23.16888520 |
| 2026-11-16 22:07 | AM2-10 1부 am2-10-w81-career repair | anthropic/claude-sonnet-5-5 | 6626 | 0 | 1263 | 0.02588200 | complete | req_011Ch6f6yHVYkMcZafSuj5A8 | 23.19476720 |
| 2026-11-16 22:08 | AM2-10 1부 am2-10-w81-love | anthropic/claude-sonnet-5-5 | 22950 | 0 | 12756 | 0.17346000 | complete | req_011Ch6f7jcVMP4qfhp6hd7go | 23.36822720 |
| 2026-11-16 22:09 | AM2-10 1부 am2-10-w81-love review | anthropic/claude-haiku-5-5 | 21037 | 0 | 5913 | 0.00506020 | complete | req_011Ch6fF1EnS3xtsqKCxhfhD | 23.37328740 |
| 2026-11-16 22:09 | AM2-10 1부 am2-10-w81-love repair | anthropic/claude-sonnet-5-5 | 6796 | 0 | 1407 | 0.02766200 | complete | req_011Ch6fH3Ppt3jYpWayE9Lb1 | 23.40094940 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3937 | 0 | 3187 | 0.00202247 | complete | req_011Ch6jvGTPHvspDMJWSN25P | 23.40297187 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3823 | 0 | 3685 | 0.00226007 | complete | req_011Ch6jvGTstXiTLsaagMLkQ | 23.40523194 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3968 | 0 | 3718 | 0.00229107 | complete | req_011Ch6jvGSPCCfcDcfzot7pq | 23.40752301 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 4006 | 0 | 4279 | 0.00257538 | complete | req_011Ch6jvGU7tKH9JFnCMDQj9 | 23.41009839 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3930 | 0 | 4710 | 0.00278328 | complete | req_011Ch6jvGUdGy6CmUgALcRzM | 23.41288167 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 4009 | 0 | 4518 | 0.00269518 | complete | req_011Ch6jvGStV8xRoZBVin6Ho | 23.41557685 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 4090 | 0 | 4389 | 0.00263878 | complete | req_011Ch6jvGV82W8cpt5MX194C | 23.41821563 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3960 | 0 | 4706 | 0.00278428 | complete | req_011Ch6jvGufpcrN2TNAYoTwg | 23.42099991 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2457 | 1411 | 1552 | 0.00103581 | complete | req_011Ch6jwUxjTGWidzhhHSAvz | 23.42203572 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2630 | 1411 | 3991 | 0.00227261 | complete | req_011Ch6jwA99ajLQo7kmReiZb | 23.42430833 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2783 | 1411 | 3127 | 0.00185591 | complete | req_011Ch6jwWVWtKPMMCW8DWKYP | 23.42616424 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2471 | 1411 | 4051 | 0.00228671 | complete | req_011Ch6jwGQS2pFDkRZN8kHpB | 23.42845095 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2640 | 1411 | 4187 | 0.00237161 | complete | req_011Ch6jwHmHfSQPF2TfEwJZi | 23.43082256 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2504 | 1411 | 3908 | 0.00221851 | complete | req_011Ch6jwSQCi8tLBQHqLVndY | 23.43304107 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2552 | 1411 | 3867 | 0.00220281 | complete | req_011Ch6jwW3Dfm8Nak27V8PN2 | 23.43524388 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2490 | 1411 | 3977 | 0.00225161 | complete | req_011Ch6jweXTL4R8EzT7APL9b | 23.43749549 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2478 | 1411 | 4048 | 0.00228591 | complete | req_011Ch6jws22jd4kFNmJLTZLY | 23.43978140 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2551 | 1411 | 4121 | 0.00232971 | complete | req_011Ch6jxKq5nAbGUBGmbXP2Y | 23.44211111 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2487 | 1411 | 3864 | 0.00219481 | complete | req_011Ch6jxNWa6Vpx9RChAKmte | 23.44430592 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2592 | 1411 | 4234 | 0.00239031 | complete | req_011Ch6jxPjVJXaD7jNi6CHL5 | 23.44669623 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2690 | 1411 | 4282 | 0.00242411 | complete | req_011Ch6jxWHdjjph1ZF1iwVTC | 23.44912034 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2705 | 1411 | 3241 | 0.00190511 | complete | req_011Ch6jxn4AQQf8uFHScn3RT | 23.45102545 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2797 | 1411 | 4450 | 0.00251881 | complete | req_011Ch6jxTxzQeGW7FqyG8r9r | 23.45354426 |
| 2026-11-16 23:10 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2708 | 1411 | 4366 | 0.00246791 | complete | req_011Ch6jxc78kegpr6kYvvPRb | 23.45601217 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2587 | 1411 | 4349 | 0.00244731 | complete | req_011Ch6jxxZSvnFb6SaxHcXry | 23.45845948 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2387 | 1411 | 3720 | 0.00211281 | complete | req_011Ch6jybVwsdM2Vo5nfpf2U | 23.46057229 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2591 | 1411 | 4202 | 0.00237421 | complete | req_011Ch6jyT8eguq5NyLiWbczQ | 23.46294650 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2716 | 1411 | 4316 | 0.00244371 | complete | req_011Ch6jySR1DCpWrSUNPZMvW | 23.46539021 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2401 | 1411 | 3884 | 0.00219621 | complete | req_011Ch6jyf8jEGs5SVQ2xaK6n | 23.46758642 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2446 | 1411 | 3931 | 0.00222421 | complete | req_011Ch6jyfV4e8RN4wVUvSXgG | 23.46981063 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2380 | 1411 | 3644 | 0.00207411 | complete | req_011Ch6jyrLftzesUs8vdRyzg | 23.47188474 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2469 | 1411 | 4076 | 0.00229901 | complete | req_011Ch6jykr1cP8z4N2hkt6gp | 23.47418375 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2414 | 1411 | 4795 | 0.00265301 | complete | req_011Ch6jzAbGwd71UrF8GGFDE | 23.47683676 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2465 | 1411 | 2972 | 0.00174661 | complete | req_011Ch6jzevM317fFVrzywVdi | 23.47858337 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2485 | 1411 | 4078 | 0.00230161 | complete | req_011Ch6jzc8g6nvcDY7xXcbNC | 23.48088498 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2484 | 1411 | 3819 | 0.00217201 | complete | req_011Ch6jzcF8G5c8Qui6WhEhc | 23.48305699 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2576 | 1411 | 4278 | 0.00241071 | complete | req_011Ch6jzgydWusAJaCy1Vzwp | 23.48546770 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2618 | 1411 | 4186 | 0.00236891 | complete | req_011Ch6jzmax15Qkftwizkk7K | 23.48783661 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2593 | 1411 | 3710 | 0.00212841 | complete | req_011Ch6jzrBmMss5pqBfVkNTV | 23.48996502 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2487 | 1411 | 4034 | 0.00227981 | complete | req_011Ch6jzrVciAvZB9sCr9uc5 | 23.49224483 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2688 | 1411 | 4182 | 0.00237391 | complete | req_011Ch6k1ThCMTZgkQKuwHwSz | 23.49461874 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2525 | 1411 | 3730 | 0.00213161 | complete | req_011Ch6k1dLdagEJHTvyswZp5 | 23.49675035 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2658 | 1411 | 4074 | 0.00231691 | complete | req_011Ch6k1i9bRNYTrbKZuw6An | 23.49906726 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2647 | 1411 | 4524 | 0.00254081 | complete | req_011Ch6k1iFYYFDNkaEU2DyfL | 23.50160807 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2432 | 1411 | 4251 | 0.00238281 | complete | req_011Ch6k232u3ke4CScVGBBja | 23.50399088 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2597 | 1411 | 4852 | 0.00269981 | complete | req_011Ch6k1uxGDyJh96WMFwtVZ | 23.50669069 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2600 | 1411 | 4908 | 0.00272811 | complete | req_011Ch6k1sKWjNTxvCLzLmef8 | 23.50941880 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2697 | 1411 | 5031 | 0.00279931 | complete | req_011Ch6k1ujcFJcpsuasWSBWM | 23.51221811 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2562 | 1411 | 3717 | 0.00212881 | complete | req_011Ch6k2eaKPLxoS1DyUHUns | 23.51434692 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2645 | 1411 | 4405 | 0.00248111 | complete | req_011Ch6k2hD5RuePfxcmXxtGr | 23.51682803 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2389 | 1411 | 4547 | 0.00252651 | complete | req_011Ch6k2wczy5PjHquMPafsX | 23.51935454 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2703 | 1411 | 4592 | 0.00258041 | complete | req_011Ch6k2v9CTS9k3XV1hy3q6 | 23.52193495 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2496 | 1411 | 4918 | 0.00272271 | complete | req_011Ch6k3BxxK154qs3GnU2y3 | 23.52465766 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2476 | 1411 | 4518 | 0.00252071 | complete | req_011Ch6k3BviPbFeAHYVGi6YL | 23.52717837 |
| 2026-11-16 23:11 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2553 | 1411 | 4150 | 0.00234441 | complete | req_011Ch6k3JCzbTdjojtPekvD3 | 23.52952278 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2585 | 1411 | 5443 | 0.00299411 | complete | req_011Ch6k3CHo1fLYEd8PErojy | 23.53251689 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2610 | 1411 | 4031 | 0.00229061 | complete | req_011Ch6k3fYPpK7g1gpQ6VuJT | 23.53480750 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2574 | 1411 | 1496 | 0.00101951 | complete | req_011Ch6k4dtwzjwycf3ass47g | 23.53582701 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2384 | 1411 | 4195 | 0.00235001 | complete | req_011Ch6k3vezAY8UHiRQhUUV7 | 23.53817702 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2482 | 1411 | 4358 | 0.00244131 | complete | req_011Ch6k4Dw48jwBx1Kii46Zr | 23.54061833 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2630 | 1411 | 4495 | 0.00252461 | complete | req_011Ch6k49xC2KAf9apnFMvCB | 23.54314294 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2558 | 1411 | 3993 | 0.00226641 | complete | req_011Ch6k4S82FRWqgWrydSygy | 23.54540935 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2650 | 1411 | 4392 | 0.00247511 | complete | req_011Ch6k4Smxcxt14rK6bZQkd | 23.54788446 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2502 | 1411 | 4439 | 0.00248381 | complete | req_011Ch6k4VtEsvpANjUUKRRFA | 23.55036827 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2516 | 1411 | 4326 | 0.00242871 | complete | req_011Ch6k4oioMvhmugs7v9TxA | 23.55279698 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2635 | 1411 | 4272 | 0.00241361 | complete | req_011Ch6k576JvodciKQ9KSWeA | 23.55521059 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2538 | 1411 | 4873 | 0.00270441 | complete | req_011Ch6k51u2TakyW5vmbvo84 | 23.55791500 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2448 | 1411 | 4266 | 0.00239191 | complete | req_011Ch6k5JaNtNiZVQaohCiNR | 23.56030691 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2491 | 1411 | 4823 | 0.00267471 | complete | req_011Ch6k5Q7kPoxz85Nbqx8ef | 23.56298162 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2436 | 1411 | 3954 | 0.00223471 | complete | req_011Ch6k5gwHJd87JN6bxBEas | 23.56521633 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2456 | 1411 | 4172 | 0.00234571 | complete | req_011Ch6k5dtEZGgZ7c126LTU9 | 23.56756204 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2597 | 1411 | 4567 | 0.00255731 | complete | req_011Ch6k5Zt8XiFFkNwE991Ak | 23.57011935 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2366 | 1411 | 4222 | 0.00236171 | complete | req_011Ch6k5xwCrFixgPdwdcW8T | 23.57248106 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2449 | 1411 | 3941 | 0.00222951 | complete | req_011Ch6k6Gk2919kBe3KwMsLN | 23.57471057 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2501 | 1411 | 4507 | 0.00251771 | complete | req_011Ch6k6GSREBMkL6p85mmfM | 23.57722828 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2441 | 1411 | 3971 | 0.00224371 | complete | req_011Ch6k6f5hNg67hr3hNRNjw | 23.57947199 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2390 | 1411 | 4511 | 0.00250861 | complete | req_011Ch6k6Wju58oixgqTeTw47 | 23.58198060 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2402 | 1411 | 4143 | 0.00232581 | complete | req_011Ch6k6mGmPe9CJx8u3jyL8 | 23.58430641 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2439 | 1411 | 4744 | 0.00263001 | complete | req_011Ch6k6mjYKh4qkVuonbdLv | 23.58693642 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2403 | 1411 | 5054 | 0.00278141 | complete | req_011Ch6k6s3XPfLb89JJXktaW | 23.58971783 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2475 | 1411 | 4409 | 0.00246611 | complete | req_011Ch6k78tn1pu31R8TFNsyc | 23.59218394 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2330 | 1411 | 3958 | 0.00222611 | complete | req_011Ch6k7LUnemtiT66KZ7DfV | 23.59441005 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2348 | 1411 | 4073 | 0.00228541 | complete | req_011Ch6k7VupMDUfGFGSuFJmc | 23.59669546 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2372 | 1411 | 4217 | 0.00235981 | complete | req_011Ch6k7jXrwKQZr1QfMmMt5 | 23.59905527 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2375 | 1411 | 2046 | 0.00127461 | complete | req_011Ch6k8QcrAkQ3aFdDFbp75 | 23.60032988 |
| 2026-11-16 23:12 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2291 | 1411 | 3746 | 0.00211621 | complete | req_011Ch6k7ukn2hupHgJyJirEf | 23.60244609 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2464 | 1411 | 4320 | 0.00242051 | complete | req_011Ch6k7pH7TqgLDvJmSJ6C5 | 23.60486660 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2505 | 1411 | 4905 | 0.00271711 | complete | req_011Ch6k85n2RjBGxA9FbPCXc | 23.60758371 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2378 | 1411 | 4494 | 0.00249891 | complete | req_011Ch6k8Gt1zf8z3nUy4giNR | 23.61008262 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2470 | 1411 | 5338 | 0.00293011 | complete | req_011Ch6k8DNBjQdRFJFFRvkHj | 23.61301273 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2444 | 1411 | 4049 | 0.00228301 | complete | req_011Ch6k8gLAByAtdWsvFjbmN | 23.61529574 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2472 | 1411 | 3560 | 0.00204131 | complete | req_011Ch6k8vmKrJ7aHtATSesCR | 23.61733705 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2307 | 1411 | 4657 | 0.00257331 | complete | req_011Ch6k8uzSeo2szkBXxMe4j | 23.61991036 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2503 | 1411 | 4178 | 0.00235341 | complete | req_011Ch6k8zHfAc8wMn7KA6tok | 23.62226377 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2296 | 1411 | 5059 | 0.00277321 | complete | req_011Ch6k8mwVs4AoCYumcA6Qq | 23.62503698 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2514 | 1411 | 3808 | 0.00216951 | complete | req_011Ch6k9TprpPNAmuc4Eb1Kf | 23.62720649 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2561 | 1411 | 4142 | 0.00234121 | complete | req_011Ch6k9VW4qbtwhaC5fNAFu | 23.62954770 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2550 | 1411 | 4030 | 0.00228411 | complete | req_011Ch6k9Y2s7UUFsHrKJifLS | 23.63183181 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2433 | 1411 | 4539 | 0.00252691 | complete | req_011Ch6k9oz4Tgz5W3N19JTTy | 23.63435872 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2414 | 1411 | 4607 | 0.00255901 | complete | req_011Ch6k9uBbP7W8kcV4hbtuW | 23.63691773 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2507 | 1411 | 4034 | 0.00228181 | complete | req_011Ch6kA8DfonBmeAkCbWoJp | 23.63919954 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2558 | 1411 | 3914 | 0.00222691 | complete | req_011Ch6kAAdXVhma3Rz5fsGue | 23.64142645 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2301 | 1411 | 3554 | 0.00202121 | complete | req_011Ch6kAckQXFGAcoFFsD9sq | 23.64344766 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2613 | 1411 | 1710 | 0.00113041 | complete | req_011Ch6kBEYTYb68ifhV3pJi1 | 23.64457807 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2164 | 1411 | 5183 | 0.00282201 | complete | req_011Ch6kAFu2abYH2J2kY8U5H | 23.64740008 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2674 | 1411 | 4258 | 0.00241051 | complete | req_011Ch6kAda1xpWQSeQ11RTkt | 23.64981059 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2463 | 1411 | 4878 | 0.00269941 | complete | req_011Ch6kAWg3QAJCnRkC3upbW | 23.65251000 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2346 | 1411 | 3410 | 0.00195371 | complete | req_011Ch6kB8HufJK1Fbwkk2aby | 23.65446371 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2440 | 1411 | 4026 | 0.00227111 | complete | req_011Ch6kB55BzT7C5VTrZcAX8 | 23.65673482 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2678 | 1411 | 3841 | 0.00220241 | complete | req_011Ch6kBFgv9YBAi7wJBHkMB | 23.65893723 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2396 | 1411 | 3374 | 0.00194071 | complete | req_011Ch6kBgZ8gJEHPbaprUS6g | 23.66087794 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2449 | 1411 | 4136 | 0.00232701 | complete | req_011Ch6kBamsxxVAe1LP9FZRD | 23.66320495 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2797 | 1411 | 3672 | 0.00212981 | complete | req_011Ch6kBnVKujUPRTTJNPmPi | 23.66533476 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2671 | 1411 | 4510 | 0.00253621 | complete | req_011Ch6kBhqmzicGcnat1qQJo | 23.66787097 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2629 | 1411 | 3897 | 0.00222551 | complete | req_011Ch6kBzdaQc4rB23X9KWL1 | 23.67009648 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2431 | 1411 | 3638 | 0.00207621 | complete | req_011Ch6kC4R2p45eUDL5jHNY3 | 23.67217269 |
| 2026-11-16 23:13 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2464 | 1411 | 3798 | 0.00215951 | complete | req_011Ch6kCCD5fYDYYdU4ofK94 | 23.67433220 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2501 | 1411 | 4780 | 0.00265421 | complete | req_011Ch6kCKa7E3MdY2sBArf1C | 23.67698641 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2658 | 1411 | 3717 | 0.00213841 | complete | req_011Ch6kCiZi437vdpcvdTsaz | 23.67912482 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2617 | 1411 | 4765 | 0.00265831 | complete | req_011Ch6kCZKbS4yzLEZRk6Stj | 23.68178313 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2479 | 1411 | 4596 | 0.00256001 | complete | req_011Ch6kCjr77D7kVwwaYSMNh | 23.68434314 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2587 | 1411 | 3585 | 0.00206531 | complete | req_011Ch6kD28tLhHkCXJgpsauN | 23.68640845 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2568 | 1411 | 3750 | 0.00214591 | complete | req_011Ch6kD51mc9LkkkL18KVPk | 23.68855436 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2315 | 1411 | 4389 | 0.00244011 | complete | req_011Ch6kCyeKHUc4871ZKai9u | 23.69099447 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2371 | 1411 | 4447 | 0.00247471 | complete | req_011Ch6kDF9EHrBxPMrSirZ9V | 23.69346918 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2364 | 1411 | 3063 | 0.00178201 | complete | req_011Ch6kDq98Ra2TBT68Eiswj | 23.69525119 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2597 | 1411 | 3302 | 0.00192481 | complete | req_011Ch6kDio7zDwGeobXB4mSN | 23.69717600 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2635 | 1411 | 3408 | 0.00198161 | complete | req_011Ch6kDnojbaovMpVmaJKME | 23.69915761 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2544 | 1411 | 3612 | 0.00207451 | complete | req_011Ch6kE2Rn5M1rgvRmhTpHi | 23.70123212 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2616 | 1411 | 3544 | 0.00204771 | complete | req_011Ch6kEBWEV8vu7rjrRPj6M | 23.70327983 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2577 | 1411 | 3898 | 0.00222081 | complete | req_011Ch6kE3HshcweJZ2n9sxPp | 23.70550064 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2626 | 1411 | 4265 | 0.00240921 | complete | req_011Ch6kE7dZwb6gdjUQXJash | 23.70790985 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2489 | 1411 | 3759 | 0.00214251 | complete | req_011Ch6kEUtVcbnYYw14mid5C | 23.71005236 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2612 | 1411 | 3341 | 0.00194581 | complete | req_011Ch6kEgwnbdGTgK4csTgjr | 23.71199817 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2556 | 1411 | 3404 | 0.00197171 | complete | req_011Ch6kEhYzToQ1yQhHdHTru | 23.71396988 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2381 | 1411 | 4261 | 0.00238271 | complete | req_011Ch6kEkRtDmqnLGuAkCbXB | 23.71635259 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2598 | 1411 | 3465 | 0.00200641 | complete | req_011Ch6kF3S5aEeER6P4ep6ZE | 23.71835900 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2564 | 1411 | 3488 | 0.00201451 | complete | req_011Ch6kFCqdDPS4Bi6Q85XmJ | 23.72037351 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 1983 | 1411 | 3222 | 0.00182341 | complete | req_011Ch6kFGuwSrtJgHBnncNbi | 23.72219692 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2571 | 1411 | 3730 | 0.00213621 | complete | req_011Ch6kFBkeNtk5WqwymMBMg | 23.72433313 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2201 | 1411 | 3140 | 0.00180421 | complete | req_011Ch6kFXWHVaqSSMmw56B57 | 23.72613734 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2341 | 1411 | 3447 | 0.00197171 | complete | req_011Ch6kFbea5SKAHGBprAnHA | 23.72810905 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2554 | 1411 | 3573 | 0.00205601 | complete | req_011Ch6kFcmY4jrqzkGP1zakc | 23.73016506 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2328 | 1411 | 3217 | 0.00185541 | complete | req_011Ch6kFx1BBRov8Jiwtu5Zx | 23.73202047 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2501 | 1411 | 3125 | 0.00182671 | complete | req_011Ch6kG9o6DbfQycKJmdVzT | 23.73384718 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2481 | 1411 | 4061 | 0.00229271 | complete | req_011Ch6kG18wMJ4LqPDf3tw8f | 23.73613989 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2328 | 1411 | 2586 | 0.00153991 | complete | req_011Ch6kGTLnRk8zREt1xoy7g | 23.73767980 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2530 | 1411 | 3506 | 0.00202011 | complete | req_011Ch6kGG57xkHxbZuLhzjx9 | 23.73969991 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2121 | 1411 | 4169 | 0.00231071 | complete | req_011Ch6kGBubXBvhq6bYDt5GY | 23.74201062 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2286 | 1411 | 2979 | 0.00173221 | complete | req_011Ch6kGcwjAdaDeFRpQwBny | 23.74374283 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2583 | 1411 | 4005 | 0.00227491 | complete | req_011Ch6kGXW4Yn9eCVNNd1G1A | 23.74601774 |
| 2026-11-16 23:14 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2101 | 1411 | 1564 | 0.00100621 | complete | req_011Ch6kHJRH7tVTFNQ2GpKKD | 23.74702395 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2410 | 1411 | 3034 | 0.00177211 | complete | req_011Ch6kH6vUaiyPhX38LY3mX | 23.74879606 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2540 | 1411 | 4311 | 0.00242361 | complete | req_011Ch6kGrPcjJXYNmyTwthsq | 23.75121967 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2356 | 1411 | 2642 | 0.00157071 | complete | req_011Ch6kHTVEZRzF6bg5d7AhN | 23.75279038 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2391 | 1411 | 4039 | 0.00227271 | complete | req_011Ch6kH3doAT4j2ArScAzn5 | 23.75506309 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2111 | 1411 | 4792 | 0.00262121 | complete | req_011Ch6kHBGRirhW31p5Brsxp | 23.75768430 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2228 | 1411 | 4372 | 0.00242291 | complete | req_011Ch6kHEarZDUypJkLb9bDb | 23.76010721 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2201 | 1411 | 3274 | 0.00187121 | complete | req_011Ch6kHdD8v6xLZrXBVujVt | 23.76197842 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2333 | 1411 | 3919 | 0.00220691 | complete | req_011Ch6kHhEUh1pLvLrhxHfmy | 23.76418533 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2387 | 1411 | 3737 | 0.00212131 | complete | req_011Ch6kJ2ReGvYxqd7P1BoKT | 23.76630664 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2492 | 1411 | 4049 | 0.00228781 | complete | req_011Ch6kJ6etkQMACM8QmrYiN | 23.76859445 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2214 | 1411 | 4377 | 0.00242401 | complete | req_011Ch6kJBgzoBTeNDGvocft3 | 23.77101846 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2359 | 1411 | 4015 | 0.00225751 | complete | req_011Ch6kJDYcx88kp1vePUubg | 23.77327597 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2296 | 1411 | 4778 | 0.00263271 | complete | req_011Ch6kJQYv2Fa2duCCg4wCT | 23.77590868 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2314 | 1411 | 4562 | 0.00252651 | complete | req_011Ch6kJQA6jhJzPoKmyFqBe | 23.77843519 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2297 | 1411 | 4309 | 0.00239831 | complete | req_011Ch6kJZ9M3QsoH4QqLx3hM | 23.78083350 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2386 | 1411 | 3615 | 0.00206021 | complete | req_011Ch6kK4eNY1t87k3ZRLX76 | 23.78289371 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2354 | 1411 | 4571 | 0.00253501 | complete | req_011Ch6kJsyv9cswKnZmWBBdX | 23.78542872 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2349 | 1411 | 3784 | 0.00214101 | complete | req_011Ch6kKC7LPJX99ZMb2VbBE | 23.78756973 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2395 | 1411 | 3667 | 0.00208711 | complete | req_011Ch6kKHghP61WiEvwxxyzp | 23.78965684 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2399 | 1411 | 3485 | 0.00199651 | complete | req_011Ch6kKKiEd7MaC5nKRyb3r | 23.79165335 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2481 | 1411 | 2692 | 0.00160821 | complete | req_011Ch6kKeWKysJCs9FXtmFDp | 23.79326156 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2378 | 1411 | 3862 | 0.00218291 | complete | req_011Ch6kKZfdES3dtvmBkSjEC | 23.79544447 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2305 | 1411 | 4152 | 0.00232061 | complete | req_011Ch6kKerQcwVELM4en9P9L | 23.79776508 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2474 | 1411 | 3612 | 0.00206751 | complete | req_011Ch6kL1iY9xC6gSEKMbGH1 | 23.79983259 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2452 | 1411 | 2816 | 0.00166731 | complete | req_011Ch6kLJR83buDGhQbgPdA2 | 23.80149990 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2345 | 1411 | 3417 | 0.00195711 | complete | req_011Ch6kLAnFBVvxcpMu7ym2Q | 23.80345701 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2371 | 1411 | 3756 | 0.00212921 | complete | req_011Ch6kLDYw5gFyCFhJ5CnVa | 23.80558622 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2517 | 1411 | 3868 | 0.00219981 | complete | req_011Ch6kLHBTEX8xqq57dooQa | 23.80778603 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2720 | 1411 | 3997 | 0.00228461 | complete | req_011Ch6kLQLpSnKaKaNpsjZvQ | 23.81007064 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2792 | 1411 | 4795 | 0.00269081 | complete | req_011Ch6kLcy5oH4vznJ1HAreg | 23.81276145 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2602 | 1411 | 4190 | 0.00236931 | complete | req_011Ch6kLpHDgk4gaHZnkFWhY | 23.81513076 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2659 | 1411 | 4054 | 0.00230701 | complete | req_011Ch6kLzthdSZL6ToyVUjeB | 23.81743777 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2575 | 1411 | 3666 | 0.00210461 | complete | req_011Ch6kM723jAjiAYgUdP92W | 23.81954238 |
| 2026-11-16 23:15 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2670 | 1411 | 4299 | 0.00243061 | complete | req_011Ch6kM4TGW9ehUk2jsyfKt | 23.82197299 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2532 | 1411 | 4700 | 0.00261731 | complete | req_011Ch6kMGPMxGz5yyjUu3wLP | 23.82459030 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2774 | 1411 | 4545 | 0.00256401 | complete | req_011Ch6kMKHyeoteuvp6uURdL | 23.82715431 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2614 | 1411 | 4367 | 0.00245901 | complete | req_011Ch6kMYaweM2JFDYd3Yydn | 23.82961332 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2699 | 1411 | 2799 | 0.00168351 | complete | req_011Ch6kN4dheraoSaHs3aBB4 | 23.83129683 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2713 | 1411 | 3735 | 0.00215291 | complete | req_011Ch6kMxUsg2GEkbR4wrrCi | 23.83344974 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2897 | 1411 | 4434 | 0.00252081 | complete | req_011Ch6kMv3XNDpa8LXTFiXfw | 23.83597055 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2617 | 1411 | 4148 | 0.00234981 | complete | req_011Ch6kNDMq3Pg24FkgVgxoE | 23.83832036 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2482 | 1411 | 4782 | 0.00265331 | complete | req_011Ch6kNCj7qcZ2pAGbp6m4Q | 23.84097367 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2543 | 1411 | 3901 | 0.00221891 | complete | req_011Ch6kNXGauQTKF9MhoQJ91 | 23.84319258 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2410 | 1411 | 4118 | 0.00231411 | complete | req_011Ch6kNZubS5HH89Kya2GMR | 23.84550669 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2625 | 1411 | 3569 | 0.00206111 | complete | req_011Ch6kNkKAAJkDtcuECmUkg | 23.84756780 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2257 | 1411 | 4383 | 0.00243131 | complete | req_011Ch6kNzDq1p4pqFMe4b1Qh | 23.84999911 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2588 | 1411 | 3644 | 0.00209491 | complete | req_011Ch6kP8DHuwpuRwpE9saRf | 23.85209402 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2564 | 1411 | 3540 | 0.00204051 | complete | req_011Ch6kNshANqQCGUEh2EUT8 | 23.85413453 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2592 | 1411 | 4702 | 0.00262431 | complete | req_011Ch6kPKh6hJVoWMdGbvo2D | 23.85675884 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2396 | 1411 | 4067 | 0.00228721 | complete | req_011Ch6kPTkHUcUqZqXkCpyEt | 23.85904605 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2315 | 1411 | 4086 | 0.00228861 | complete | req_011Ch6kPd8qu9rMtyzyn8Qkk | 23.86133466 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2496 | 1411 | 3929 | 0.00222821 | complete | req_011Ch6kPdzBS47cjNvfcBcuh | 23.86356287 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2308 | 1411 | 4147 | 0.00231841 | complete | req_011Ch6kPkJwMUMp2nFWSsthJ | 23.86588128 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2726 | 1411 | 4256 | 0.00241471 | complete | req_011Ch6kQCkuqStfn71pu8GQe | 23.86829599 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2780 | 1411 | 3451 | 0.00201761 | complete | req_011Ch6kQa26byRmLfawv9NWF | 23.87031360 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2569 | 1411 | 5193 | 0.00286751 | complete | req_011Ch6kQ7eaMisRWhPanJNnW | 23.87318111 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2767 | 1411 | 5498 | 0.00303981 | complete | req_011Ch6kQBfg6DVrLBB9u35Z5 | 23.87622092 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2767 | 1411 | 3734 | 0.00215781 | complete | req_011Ch6kQgASTJkhXjTjekKKG | 23.87837873 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2601 | 1411 | 4912 | 0.00273021 | complete | req_011Ch6kQZZoh7SXSoCJ9c4aZ | 23.88110894 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2774 | 1411 | 4348 | 0.00246551 | complete | req_011Ch6kQoEaTEqUHx4FqcNfk | 23.88357445 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2584 | 1411 | 5241 | 0.00289301 | complete | req_011Ch6kQhLsdDg9DTqWvQNiN | 23.88646746 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2825 | 1411 | 3393 | 0.00199311 | complete | req_011Ch6kRN1Z4NDJLze9JQqjj | 23.88846057 |
| 2026-11-16 23:16 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2613 | 1411 | 3432 | 0.00199141 | complete | req_011Ch6kRZufZy66RFUYh6gnW | 23.89045198 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2555 | 1411 | 4766 | 0.00265261 | complete | req_011Ch6kRVH7HQckmQcDBwD7X | 23.89310459 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2487 | 1411 | 3245 | 0.00188531 | complete | req_011Ch6kRy9AQGQWyMY4vD9Eb | 23.89498990 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2553 | 1411 | 4114 | 0.00232641 | complete | req_011Ch6kRjgYiW3Yf8cWSwfzk | 23.89731631 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2621 | 1411 | 4229 | 0.00239071 | complete | req_011Ch6kRfjRH1FsrrbDntYo4 | 23.89970702 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2526 | 1411 | 4353 | 0.00244321 | complete | req_011Ch6kRwHYVMQwxEZZoNT5g | 23.90215023 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2389 | 1411 | 4235 | 0.00237051 | complete | req_011Ch6kS9LbVedkSA6gZVNbR | 23.90452074 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2582 | 1411 | 1992 | 0.00126831 | complete | req_011Ch6kSpK8Mnkh4U98iz2NG | 23.90578905 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2624 | 1411 | 4124 | 0.00233851 | complete | req_011Ch6kSJ7BP6qegso89avqJ | 23.90812756 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2445 | 1411 | 3997 | 0.00225711 | complete | req_011Ch6kSYQfeuCzHiKZtAyZk | 23.91038467 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2164 | 1411 | 3193 | 0.00182701 | complete | req_011Ch6kSraoChnXDFSQmgDLy | 23.91221168 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2424 | 1411 | 3779 | 0.00214601 | complete | req_011Ch6kSrRNcL9j7gLeCD3qa | 23.91435769 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2350 | 1411 | 4563 | 0.00253061 | complete | req_011Ch6kSqngL69KLaRTScurz | 23.91688830 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2487 | 1411 | 3462 | 0.00199381 | complete | req_011Ch6kT8V2YG1chuqtoKCuG | 23.91888211 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2392 | 1411 | 3084 | 0.00179531 | complete | req_011Ch6kTFesZABzxCHpVvkiN | 23.92067742 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2345 | 1411 | 4443 | 0.00247011 | complete | req_011Ch6kTJ12AMSu2fRZHxVmJ | 23.92314753 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2403 | 1411 | 3710 | 0.00210941 | complete | req_011Ch6kTSff6LWRnJXdvBB2C | 23.92525694 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2297 | 1411 | 3396 | 0.00194181 | complete | req_011Ch6kThVdsrzpexdUiKy7y | 23.92719875 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2397 | 1411 | 3707 | 0.00210731 | complete | req_011Ch6kTfRNB5ykkx99gn4Vu | 23.92930606 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2583 | 1411 | 3579 | 0.00206191 | complete | req_011Ch6kU7bUSHjFdLQkDyCWE | 23.93136797 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2518 | 1411 | 4319 | 0.00242541 | complete | req_011Ch6kTtiZtY9WWmhk9K9vF | 23.93379338 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2428 | 1411 | 4365 | 0.00243941 | complete | req_011Ch6kU6XyVHUDdUmdWnyGt | 23.93623279 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2319 | 1411 | 4335 | 0.00241351 | complete | req_011Ch6kU7AffDDQmhZiPWmtS | 23.93864630 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2305 | 1411 | 3618 | 0.00205361 | complete | req_011Ch6kUUSbSyCwrp2CSkoX6 | 23.94069991 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 114 | 1411 | 81 | 0.00006601 | complete | req_011Ch6kVVEW8bCV4vRe4K4ZX | 23.94076592 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2392 | 1411 | 4457 | 0.00248181 | complete | req_011Ch6kUUfz7veeaSdGxBGew | 23.94324773 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 3002 | 1411 | 1823 | 0.00122581 | complete | req_011Ch6kVHLtTeAFZ5vfXg7pP | 23.94447354 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2393 | 1411 | 3920 | 0.00221341 | complete | req_011Ch6kUgh3kyfMxpBjYxSpA | 23.94668695 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2467 | 1411 | 4255 | 0.00238831 | complete | req_011Ch6kUaj7SMFPzxS5LHS5q | 23.94907526 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2244 | 1411 | 4049 | 0.00226301 | complete | req_011Ch6kV6upbTbokX2VTJPzS | 23.95133827 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2504 | 1411 | 3814 | 0.00217151 | complete | req_011Ch6kV77UeMGA9oritbRyW | 23.95350978 |
| 2026-11-16 23:17 | AM2-10 2부 꼬리표 repair | anthropic/claude-haiku-5-5 | 2675 | 1411 | 3952 | 0.00225761 | complete | req_011Ch6kVH6jvcW9XLPqeVPkd | 23.95576739 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 851 | 25291 | 1399 | 0.01822110 | complete | req_011Ch6pETHDfjtGQPPGRBn5f | 23.97398849 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 652 | 25291 | 1388 | 0.01771310 | complete | req_011Ch6pETD1iw6gdMf3P2WR6 | 23.99170159 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 771 | 25291 | 2064 | 0.02471110 | complete | req_011Ch6pET54hWhrqHDTkPSYe | 24.01641269 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 727 | 25291 | 1868 | 0.02266310 | complete | req_011Ch6pET8nkDGiaNjotUPY1 | 24.03907579 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 164 | 25291 | 2163 | 0.02448710 | complete | req_011Ch6pET7JYauB3nAH8QB2H | 24.06356289 |
| 2026-11-17 00:06 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 26291 | 0 | 2505 | 0.09027750 | complete | req_011Ch6pENS2GBMED7mZLNo1s | 24.15384039 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 1681 | 25291 | 168 | 0.00757110 | complete | req_011Ch6pFvY62vDejCN2wJuSZ | 24.16141149 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 1577 | 25291 | 166 | 0.00734310 | complete | req_011Ch6pFvWMAB7oR2awFFznG | 24.16875459 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 742 | 28627 | 1340 | 0.01774670 | complete | req_011Ch6pGPzak5xFa16mVPodM | 24.18650129 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 688 | 28627 | 1566 | 0.01989870 | complete | req_011Ch6pGPzqMvxRqsuDi8k9W | 24.20639999 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 777 | 28627 | 1988 | 0.02429670 | complete | req_011Ch6pGQ3KSg7p4WLrweBtq | 24.23069669 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 29742 | 0 | 2769 | 0.10148750 | complete | req_011Ch6pGJzSt85CPXgiuox4r | 24.33218419 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 702 | 28627 | 2406 | 0.02832670 | complete | req_011Ch6pGPzLD9uguaVjrgJ5D | 24.36051089 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 164 | 28627 | 2784 | 0.03103070 | complete | req_011Ch6pGP1o8hrsy6jpismRr | 24.39154159 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 2029 | 28627 | 152 | 0.00844070 | complete | req_011Ch6pJLxLBj2e9GVnWAsM4 | 24.39998229 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 667 | 27780 | 1259 | 0.01670200 | complete | req_011Ch6pJzAwsEB9r7ZoBqtrb | 24.41668429 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 910 | 27780 | 1620 | 0.02079800 | complete | req_011Ch6pJzJsxgKiDVz6NZCm5 | 24.43748229 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 755 | 27780 | 1769 | 0.02197800 | complete | req_011Ch6pK1P8PmksajUgobXdU | 24.45946029 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 164 | 27780 | 2216 | 0.02526600 | complete | req_011Ch6pJzFevXw8ykM2gC1PA | 24.48472629 |
| 2026-11-17 00:07 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 28963 | 0 | 2462 | 0.09643600 | complete | req_011Ch6pJvFZSP4DV55ENxNrP | 24.58116229 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 797 | 27780 | 2316 | 0.02753200 | complete | req_011Ch6pJzNrqrskzywkMSoxS | 24.60869429 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 1962 | 27780 | 224 | 0.00894200 | complete | req_011Ch6pLYjJaDb7c9uoZ44bx | 24.61763629 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 329 | 25940 | 1304 | 0.01629200 | complete | req_011Ch6pM3q1x1Rn19C7K5M8X | 24.63392829 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 365 | 25940 | 1608 | 0.01940400 | complete | req_011Ch6pM3q28bizWaMAtx5Bd | 24.65333229 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 354 | 25940 | 1787 | 0.02117200 | complete | req_011Ch6pM3oHPoFeHGRSK1si7 | 24.67450429 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 26112 | 0 | 2507 | 0.09026400 | complete | req_011Ch6pLyy6tzcVJxiU6NMAJ | 24.76476829 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 164 | 25940 | 2528 | 0.02820200 | complete | req_011Ch6pM3nYkn4K1iNVoG6jZ | 24.79297029 |
| 2026-11-17 00:08 | AM2-10 P10 new | anthropic/claude-sonnet-5-5 | 206 | 25940 | 2552 | 0.02852600 | complete | req_011Ch6pM3pHQGic44VKkPYwM | 24.82149629 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 851 | 25147 | 1489 | 0.01910670 | complete | req_011Ch7rwgCjGkHQ8x1vqYJaX | 24.84060299 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 652 | 25147 | 1601 | 0.01982870 | complete | req_011Ch7rwg82KVyMQ13rsuXFV | 24.86043169 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 727 | 25147 | 2064 | 0.02460870 | complete | req_011Ch7rwg6HCMsBs8L7q3Cv7 | 24.88504039 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 771 | 25147 | 2290 | 0.02695670 | complete | req_011Ch7rwfwcCArh1hYXGQDzh | 24.91199709 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 26055 | 0 | 2463 | 0.08931350 | complete | req_011Ch7rwZEHSGarj8m9Eyfmz | 25.00131059 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 164 | 25147 | 2386 | 0.02670270 | complete | req_011Ch7rwgDUFvjerr8K4MPZi | 25.02801329 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 742 | 29513 | 1506 | 0.01949530 | complete | req_011Ch7ryEJoCpAsunCxF4tSC | 25.04750859 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 688 | 29513 | 1503 | 0.01935730 | complete | req_011Ch7ryEPGP6VuhHDgtWTVP | 25.06686589 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 777 | 29513 | 1922 | 0.02372530 | complete | req_011Ch7ryETip2zJghegDf4k4 | 25.09059119 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 164 | 29513 | 2311 | 0.02638930 | complete | req_011Ch7ryDuVKtehfzEKftxsx | 25.11698049 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 702 | 29513 | 2461 | 0.02896530 | complete | req_011Ch7ryEVTZq85JHnz5Wqfy | 25.14594579 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 30471 | 0 | 2912 | 0.10481850 | complete | req_011Ch7ry8Bhr5E6UWTLNFXDV | 25.25076429 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 1972 | 29513 | 179 | 0.00868530 | complete | req_011Ch7rziQXY1zpVUfNJofT2 | 25.25944959 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 667 | 27735 | 1294 | 0.01704750 | complete | req_011Ch7s16w6PHddjh4Henzwe | 25.27649709 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 910 | 27735 | 1441 | 0.01900350 | complete | req_011Ch7s16wMMrdWVtvyiCcj6 | 25.29550059 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 28844 | 0 | 2247 | 0.09402550 | complete | req_011Ch7s11TCVjsF9CiVbviqd | 25.38952609 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 755 | 27735 | 2021 | 0.02449350 | complete | req_011Ch7s1752aCUgma52bhDLu | 25.41401959 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 164 | 27735 | 2328 | 0.02638150 | complete | req_011Ch7s16kw3kzhrRQFZz7a6 | 25.44040109 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 797 | 27735 | 2217 | 0.02653750 | complete | req_011Ch7s16jgqg3g33xVAn9zY | 25.46693859 |
| 2026-11-17 13:23 | AM2 P11 | anthropic/claude-sonnet-5-5 | 1922 | 27735 | 216 | 0.00877750 | complete | req_011Ch7s2SGxyXD3dNEjnA4gR | 25.47571609 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 329 | 26727 | 1102 | 0.01435070 | complete | req_011Ch7s2njXLWWz9VPgArdXf | 25.49006679 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 365 | 26727 | 1453 | 0.01793270 | complete | req_011Ch7s2nk2XXZatAkzZ5ky9 | 25.50799949 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 164 | 26727 | 2311 | 0.02611070 | complete | req_011Ch7s2nrxzV8oSaouEiqLf | 25.53411019 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 354 | 26727 | 2142 | 0.02480070 | complete | req_011Ch7s2nh3NFBHT4eZs72c8 | 25.55891089 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 26899 | 0 | 2517 | 0.09233150 | complete | req_011Ch7s2h8Rs1MdyH8Zhdzxr | 25.65124239 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 206 | 26727 | 2650 | 0.02958470 | complete | req_011Ch7s2noFUvRBavUTXc9gB | 25.68082709 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 670 | 27903 | 1301 | 0.01714030 | complete | req_011Ch7s4X6jbsERc5rUgwXNL | 25.69796739 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 758 | 27903 | 1408 | 0.01838630 | complete | req_011Ch7s4X4WVhkDNnP4ey9F3 | 25.71635369 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 536 | 27903 | 1692 | 0.02078230 | complete | req_011Ch7s4WNKwKskbbKRbrq6S | 25.73713599 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 689 | 27903 | 2102 | 0.02518830 | complete | req_011Ch7s4WtL97YhPw87CjtaJ | 25.76232429 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 164 | 27903 | 2529 | 0.02840830 | complete | req_011Ch7s4X7jQTuBaVH3MQCrd | 25.79073259 |
| 2026-11-17 13:24 | AM2 P11 | anthropic/claude-sonnet-5-5 | 28639 | 0 | 2659 | 0.09781950 | complete | req_011Ch7s4SJzuVoF9kStSLHao | 25.88855209 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 652 | 24968 | 1323 | 0.01703080 | complete | req_011Ch8FyWUZrTQAewogZLWTe | 25.90558289 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 851 | 24968 | 1264 | 0.01683880 | complete | req_011Ch8FyWWZS7Y1TK2a1AK1v | 25.92242169 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 771 | 24968 | 2123 | 0.02526880 | complete | req_011Ch8FyWPbz47HN9GGMH41A | 25.94769049 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 25876 | 0 | 2358 | 0.08781600 | complete | req_011Ch8FyS88Zbo529Wmge9nh | 26.03550649 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 24968 | 2230 | 0.02512480 | complete | req_011Ch8FyWRMXhJP5cvbEyD5i | 26.06063129 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 727 | 24968 | 2018 | 0.02413080 | complete | req_011Ch8FyWQrhevwpVjaBXYqv | 26.08476209 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 742 | 29255 | 1304 | 0.01744950 | complete | req_011Ch8G1J9DfsKqrLy4M9Lfr | 26.10221159 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 688 | 29255 | 1608 | 0.02038150 | complete | req_011Ch8G1JBhSUMwLpG2i1E3Z | 26.12259309 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 777 | 29255 | 2157 | 0.02604950 | complete | req_011Ch8G1JADLy3MFYpgZ8eEF | 26.14864259 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 702 | 29255 | 2345 | 0.02777950 | complete | req_011Ch8G1HgRxo9Ch469ykcgn | 26.17642209 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 29255 | 2361 | 0.02686350 | complete | req_011Ch8G1J9xZz4pCxAigergM | 26.20328559 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 30213 | 0 | 2832 | 0.10337350 | complete | req_011Ch8G1DywA3ayYx7jpNN2i | 26.30665909 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 1955 | 29255 | 199 | 0.00882550 | complete | req_011Ch8G2i2gdGLQu2i8z9FTx | 26.31548459 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 667 | 27472 | 1300 | 0.01708120 | complete | req_011Ch8G34dfdRjMtQQBEhcGZ | 26.33256579 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 910 | 27472 | 1718 | 0.02174720 | complete | req_011Ch8G34eB3sdnrHCa1LSLp | 26.35431299 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 27472 | 2090 | 0.02397520 | complete | req_011Ch8G34qq5k7iKNRNJYynX | 26.37828819 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 797 | 27472 | 2397 | 0.02831120 | complete | req_011Ch8G34ZDY3vzi32pfTFGy | 26.40659939 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 755 | 27472 | 2193 | 0.02618720 | complete | req_011Ch8G34ahJe2YHdrYZhNcF | 26.43278659 |
| 2026-11-17 18:25 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 28581 | 0 | 2881 | 0.09970800 | complete | req_011Ch8G2yCWCnJeTbH6cm1YN | 26.53249459 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 329 | 26641 | 1196 | 0.01528210 | complete | req_011Ch8G4i5UMeVGKevaWf3W1 | 26.54777669 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 365 | 26641 | 1254 | 0.01593410 | complete | req_011Ch8G4i1kaNsBfLPkfXrro | 26.56371079 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 354 | 26641 | 1907 | 0.02244210 | complete | req_011Ch8G4hvYaUWC3KGvxsayk | 26.58615289 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 26813 | 0 | 2338 | 0.09032650 | complete | req_011Ch8G4eJkC124yJGxqvWfb | 26.67647939 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 26641 | 2416 | 0.02715210 | complete | req_011Ch8G4i4De4NzmzKUao7L7 | 26.70363149 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 206 | 26641 | 2567 | 0.02874610 | complete | req_011Ch8G4hxmNhh1dkNb7GJnk | 26.73237759 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 1255 | 26641 | 248 | 0.00765410 | complete | req_011Ch8G68ipghYsK2FvW8UGy | 26.74003169 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 1967 | 26641 | 367 | 0.01026810 | complete | req_011Ch8G68o3KrhWidYHpEdp2 | 26.75029979 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 758 | 27461 | 1200 | 0.01626210 | complete | req_011Ch8G6XSp28z9rw2fXXseX | 26.76656189 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 670 | 27461 | 1679 | 0.02087610 | complete | req_011Ch8G6XPaS3e53N1xWzmMs | 26.78743799 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 536 | 27461 | 2198 | 0.02579810 | complete | req_011Ch8G6XU3Z48PtE6ZLFbGD | 26.81323609 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 689 | 27461 | 2026 | 0.02438410 | complete | req_011Ch8G6XUHdw16scLT3ydYV | 26.83762019 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 28198 | 0 | 2717 | 0.09729650 | complete | req_011Ch8G6TTSYVYbcoQVjdJae | 26.93491669 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 27461 | 2752 | 0.03059410 | complete | req_011Ch8G6Ws612edfR4E1sk4u | 26.96551079 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 1802 | 27461 | 199 | 0.00834010 | complete | req_011Ch8G85qz5fxMxjhf3iKy8 | 26.97385089 |
| 2026-11-17 18:26 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 2618 | 27461 | 372 | 0.01170210 | complete | req_011Ch8G85pk2ntuGcC5oLXjV | 26.98555299 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 666 | 28890 | 1379 | 0.01801100 | complete | req_011Ch8G8cJZRQgePhBbwxMME | 27.00356399 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 915 | 28890 | 1783 | 0.02254900 | complete | req_011Ch8G8cE75pPcN98hhDDtF | 27.02611299 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 795 | 28890 | 2419 | 0.02866900 | complete | req_011Ch8G8cF5mt2AWJsE2yD6a | 27.05478199 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 30055 | 0 | 2820 | 0.10275500 | complete | req_011Ch8G8VqNMH221gg5A6iFw | 27.15753699 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 164 | 28890 | 2456 | 0.02777700 | complete | req_011Ch8G8cD72YZTAGU2Dmnnx | 27.18531399 |
| 2026-11-17 18:27 | AM2-12 P12 | anthropic/claude-sonnet-5-5 | 782 | 28890 | 2521 | 0.02966300 | complete | req_011Ch8G8cH52R5SWDAXiCN7p | 27.21497699 |
| 2026-11-17 20:48 | AM2 P | anthropic/claude-sonnet-5-5 | 689 | 26985 | 2097 | 0.02504650 | complete | req_011Ch8SwGRxP85iLNJc11oWG | 27.24002349 |
| 2026-11-17 20:48 | AM2 P | anthropic/claude-sonnet-5-5 | 27722 | 0 | 2916 | 0.09809650 | complete | req_011Ch8SwCMsUyo5qburHCTCx | 27.33811999 |
| 2026-11-17 20:48 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 26985 | 2782 | 0.03084650 | complete | req_011Ch8SwGPiSVHgs7XRyuH1V | 27.36896649 |
| 2026-11-17 20:49 | AM2 P | anthropic/claude-sonnet-5-5 | 758 | 26985 | 1283 | 0.01704450 | complete | req_011Ch8Sxm2BwtAcQ26wmriVe | 27.38601099 |
| 2026-11-17 20:49 | AM2 P | anthropic/claude-sonnet-5-5 | 670 | 26985 | 1601 | 0.02004850 | complete | req_011Ch8Sxbm4qbw3KbPvHsFQv | 27.40605949 |
| 2026-11-17 20:49 | AM2 P | anthropic/claude-sonnet-5-5 | 536 | 26985 | 1825 | 0.02202050 | complete | req_011Ch8SyRdtr2ZLswEBr7r71 | 27.42807999 |
| 2026-11-17 20:49 | AM2 P | anthropic/claude-sonnet-5-5 | 1585 | 26985 | 155 | 0.00741850 | complete | req_011Ch8SzYbctUVEXtqBbscXm | 27.43549849 |
| 2026-11-17 20:49 | AM2 P | anthropic/claude-sonnet-5-5 | 3042 | 26985 | 552 | 0.01430250 | complete | req_011Ch8SzXpEpsfiL8nyZdq62 | 27.44980099 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 20595 | 0 | 1454 | 0.06594450 | complete | req_011Ch9oMDGhfnp9vfvyfPuhz | 27.51574549 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 624 | 20429 | 1360 | 0.01689090 | complete | req_011Ch9oMJg8dipXHimrqMFo1 | 27.53263639 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 170 | 20429 | 2005 | 0.02243290 | complete | req_011Ch9oMJbvjkc3y4bpCMJxw | 27.55506929 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 819 | 20429 | 1781 | 0.02149090 | complete | req_011Ch9oN5BoiqrZmYSt9mbod | 27.57656019 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 152 | 20429 | 1747 | 0.01981690 | complete | req_011Ch9oNUUHC6FfLhTqdYuVt | 27.59637709 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 20429 | 1313 | 0.01548090 | complete | req_011Ch9oP5NVNvshWUSF1Tjq7 | 27.61185799 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 1490 | 20429 | 178 | 0.00680290 | complete | req_011Ch9oPxpdJUbzViMt2T7ap | 27.61866089 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 1522 | 20429 | 186 | 0.00694690 | complete | req_011Ch9oPyLsddcHw5YprdbJD | 27.62560779 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 1231 | 20429 | 168 | 0.00618490 | complete | req_011Ch9oQ9nSRBGhfWq8oTcMN | 27.63179269 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 20084 | 0 | 1487 | 0.06499700 | complete | req_011Ch9oQj6QRP8JHH8seWESs | 27.69678969 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 897 | 19918 | 1459 | 0.01837580 | complete | req_011Ch9oQrdLaDoxW6rtLoj4o | 27.71516549 |
| 2026-11-18 13:57 | AM2 P | anthropic/claude-sonnet-5-5 | 170 | 19918 | 2026 | 0.02259180 | complete | req_011Ch9oQpRt2JSSudpwQY4hL | 27.73775729 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 359 | 19918 | 1031 | 0.01301980 | complete | req_011Ch9oRgj4K2wURWwojbsmG | 27.75077709 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 152 | 19918 | 2105 | 0.02334580 | complete | req_011Ch9oRwhUCTemKS2gH96ne | 27.77412289 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 19918 | 1432 | 0.01661980 | complete | req_011Ch9oSFjfZwMhZJPhgst9M | 27.79074269 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 1137 | 19918 | 162 | 0.00588580 | complete | req_011Ch9oTD5DHKh48ccpfpenc | 27.79662849 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 19208 | 0 | 1556 | 0.06349700 | complete | req_011Ch9oTkaHVNKvDLwd673RL | 27.86012549 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 400 | 19042 | 1653 | 0.01923420 | complete | req_011Ch9oTsV1ix2hThYGnnv5N | 27.87935969 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 170 | 19042 | 2055 | 0.02279420 | complete | req_011Ch9oTsS3cpJBy1brFyYLB | 27.90215389 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 313 | 19042 | 1152 | 0.01405020 | complete | req_011Ch9oUqGLT3JGcECkdSc6o | 27.91620409 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 152 | 19042 | 1600 | 0.01820820 | complete | req_011Ch9oV534ua7gW1ufuo4YQ | 27.93441229 |
| 2026-11-18 13:58 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 19042 | 1392 | 0.01613220 | complete | req_011Ch9oVXvLF6TYX2NAsVEeF | 27.95054449 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 1139 | 19042 | 100 | 0.00518220 | complete | req_011Ch9oWUuHpwd84Tpx3u3pR | 27.95572669 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 1058 | 19042 | 177 | 0.00579020 | complete | req_011Ch9oWUL4W6iMchyTEJVag | 27.96151689 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 734 | 20503 | 1389 | 0.01740830 | complete | req_011Ch9oWvLjoxsKamuEg5MT2 | 27.97892519 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 20669 | 0 | 1660 | 0.06818950 | complete | req_011Ch9oWpS3bcJGJYc6ukSBa | 28.04711469 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 170 | 20503 | 1908 | 0.02147030 | complete | req_011Ch9oWvMjdr9DDAVUVmkP4 | 28.06858499 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 727 | 20503 | 1530 | 0.01880430 | complete | req_011Ch9oXhnUawERRf9zMLQwV | 28.08738929 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 152 | 20503 | 1840 | 0.02075430 | complete | req_011Ch9oXx8Bfnu16F33vgizb | 28.10814359 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 20503 | 1295 | 0.01530830 | complete | req_011Ch9oYVjxPGybK5bD1uVG8 | 28.12345189 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 1761 | 20503 | 154 | 0.00711230 | complete | req_011Ch9oZUP8LpF5SZWQdnpkz | 28.13056419 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 2345 | 20503 | 387 | 0.01061030 | complete | req_011Ch9oZUJAAWuRtsngbABvR | 28.14117449 |
| 2026-11-18 13:59 | AM2 P | anthropic/claude-sonnet-5-5 | 19119 | 0 | 1457 | 0.06228450 | complete | req_011Ch9oa915Vpxn477bkwfkK | 28.20345899 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 18953 | 1471 | 0.01731330 | complete | req_011Ch9oaFLLZzk71fpufKuLB | 28.22077229 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 170 | 18953 | 1894 | 0.02117530 | complete | req_011Ch9oaFQ49qVj5fbD2DrUY | 28.24194759 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 359 | 18953 | 1213 | 0.01474330 | complete | req_011Ch9ob5hfvxL5ttsrLkkWh | 28.25669089 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 152 | 18953 | 1746 | 0.01965930 | complete | req_011Ch9obK2c7sQHjAiFtD1fa | 28.27635019 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 18953 | 1527 | 0.01747330 | complete | req_011Ch9obmmwY94rLb32pJQXe | 28.29382349 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 1031 | 18953 | 153 | 0.00548730 | complete | req_011Ch9ocqdtXJdSgL26mYx64 | 28.29931079 |
| 2026-11-18 14:00 | AM2 P | anthropic/claude-sonnet-5-5 | 2084 | 18953 | 372 | 0.00978330 | complete | req_011Ch9ocpzCNy68LZ6qdR1Wb | 28.30909409 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 19958 | 0 | 1561 | 0.06542200 | complete | req_011ChLD9vuEYk28yQnLyrAqo | 28.37451609 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 897 | 19792 | 1364 | 0.01741320 | complete | req_011ChLDA4kWc2jBqkWHx4YNH | 28.39192929 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 170 | 19792 | 2186 | 0.02417920 | complete | req_011ChLDA4hXxMXwLdj6FcLjp | 28.41610849 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 359 | 19792 | 1120 | 0.01389720 | complete | req_011ChLDBEHWsxJW2DMN4cGsK | 28.43000569 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 152 | 19792 | 1739 | 0.01967320 | complete | req_011ChLDBNCmr7zTyhQxJBWqW | 28.44967889 |
| 2026-11-24 01:55 | AM2 D2 | anthropic/claude-sonnet-5-5 | 154 | 19792 | 1539 | 0.01767720 | complete | req_011ChLDBs1d9GgjwUXrnPTeq | 28.46735609 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 132 | 19141 | 986 | 0.01203810 | complete | req_011ChRH9vuDdbqqSPhTi86YX | 28.47939419 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 126 | 19141 | 966 | 0.01182610 | complete | req_011ChRH9w49CXdRJBYSxcyPi | 28.49122029 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 122 | 19141 | 1215 | 0.01430810 | complete | req_011ChRH9w39WQ624rTnCsQcx | 28.50552839 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 19730 | 0 | 1998 | 0.06901050 | complete | req_011ChRH9sNPF1wcajGDb1aSa | 28.57453889 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 150 | 19141 | 1973 | 0.02194410 | complete | req_011ChRH9vwwfVds5oZdggA51 | 28.59648299 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 154 | 19141 | 2300 | 0.02522210 | complete | req_011ChRH9vvDByiEQtiFyYdtb | 28.62170509 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 957 | 19141 | 153 | 0.00535810 | complete | req_011ChRHB77eLx8TnetG6sNpt | 28.62706319 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 1058 | 19141 | 212 | 0.00615010 | complete | req_011ChRHB7p4qtd26CKvsGxbY | 28.63321329 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 126 | 18842 | 1021 | 0.01234620 | complete | req_011ChRHBQST49ZE8MoKVSSTj | 28.64555949 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 132 | 18842 | 977 | 0.01191820 | complete | req_011ChRHBQVg99E8D7tcKNDtX | 28.65747769 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 122 | 18842 | 1255 | 0.01467820 | complete | req_011ChRHBPryL98HtSNWWRJVY | 28.67215589 |
| 2026-11-26 18:10 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 19010 | 0 | 1870 | 0.06614100 | complete | req_011ChRHBJ4xqca46nB3QRvhG | 28.73829689 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 154 | 18842 | 2272 | 0.02491220 | complete | req_011ChRHBPqjdFqHYDFgWEdyG | 28.76320909 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 150 | 18842 | 2218 | 0.02436420 | complete | req_011ChRHBQywEzsrfhfMkkeqf | 28.78757329 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 950 | 18842 | 176 | 0.00554420 | complete | req_011ChRHCcke2HubzfBUoqVbY | 28.79311749 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 132 | 17856 | 1081 | 0.01285960 | complete | req_011ChRHCv5SP7VeFwUzdSahp | 28.80597709 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 126 | 17856 | 1020 | 0.01223760 | complete | req_011ChRHCuyjKjsMoVGZLz7Xx | 28.81821469 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 122 | 17856 | 1290 | 0.01492960 | complete | req_011ChRHCuumjK5Hyxqpc7Myq | 28.83314429 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 18372 | 0 | 1765 | 0.06332200 | complete | req_011ChRHCkxWUdNHLHy9VjqpY | 28.89646629 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 150 | 17856 | 1992 | 0.02200560 | complete | req_011ChRHCupotj9ATEy4PSdfr | 28.91847189 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 154 | 17856 | 2182 | 0.02391360 | complete | req_011ChRHCv8fLAZ6fNrUVozZT | 28.94238549 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 126 | 17763 | 1047 | 0.01249830 | complete | req_011ChRHEuhunFsSwYkXgKpf5 | 28.95488379 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 17931 | 0 | 1672 | 0.06146350 | complete | req_011ChRHE4yzkbvmF8G1SykZo | 29.01634729 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 132 | 17763 | 1017 | 0.01221030 | complete | req_011ChRHEumPhFakFnXBdRiCr | 29.02855759 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 150 | 17763 | 1870 | 0.02077630 | complete | req_011ChRHEuku9KvqPmbFRYM3P | 29.04933389 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 122 | 17763 | 1307 | 0.01509030 | complete | req_011ChRHEumdVrAFfJwfncHoh | 29.06442419 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 154 | 17763 | 2211 | 0.02419430 | complete | req_011ChRHEuMqDtpAHzVRz7uti | 29.08861849 |
| 2026-11-26 18:11 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 1051 | 17763 | 177 | 0.00564830 | complete | req_011ChRHG4JsPddqtH2hBWT2w | 29.09426679 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 132 | 18071 | 1033 | 0.01240110 | complete | req_011ChRHGWumNFzYg8XRtTa3T | 29.10666789 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 126 | 18071 | 980 | 0.01185910 | complete | req_011ChRHGX8QhG86iKnWYN2gg | 29.11852699 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 122 | 18071 | 1266 | 0.01471110 | complete | req_011ChRHGWxzFpZW4x2mBvMK3 | 29.13323809 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 18638 | 0 | 1911 | 0.06542150 | complete | req_011ChRHGFDwh1o1G578hBubX | 29.19865959 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 150 | 18071 | 1860 | 0.02070710 | complete | req_011ChRHGX9Qt5oh8KpMLSbZR | 29.21936669 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 154 | 18071 | 2131 | 0.02342510 | complete | req_011ChRHGX5wHPdAgZRWUQ5qv | 29.24279179 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 939 | 18071 | 212 | 0.00580510 | complete | req_011ChRHHbLCMSkEdbHqyovgx | 29.24859689 |
| 2026-11-26 18:12 | ZW2 Z5 repair | anthropic/claude-sonnet-5-5 | 961 | 18071 | 214 | 0.00586910 | complete | req_011ChRHHbDGCnnYNv1QXCxUK | 29.25446599 |
누적 합계: **$29.25446599** (P0-2 점검 상한 $0.10, 개발 총 상한 $8)
| 2026-11-11 11:26 | AM 7부 | anthropic/claude-sonnet-5-5 | 42122 | 0 | 19660 | 0.28432700 | complete | req_011CgvM5ZBFdKp5YdoM4NezC | 12.65846340 |
| 2026-11-11 11:27 | AM 7부 review | anthropic/claude-haiku-5-5 | 25575 | 0 | 8712 | 0.00696285 | complete | req_011CgvMFk95irBJ8oSpmjZ1g | 12.66542625 |
| 2026-11-11 11:27 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10886 | 0 | 2557 | 0.04764100 | complete | req_011CgvMJiaeotwQMpXnL8Wk1 | 12.71306725 |
| 2026-11-11 11:29 | AM 7부 | anthropic/claude-sonnet-5-5 | 34871 | 6966 | 18180 | 0.25293520 | complete | req_011CgvMKtVjitwUMnB4rPPSi | 12.96600245 |
| 2026-11-11 11:30 | AM 7부 review | anthropic/claude-haiku-5-5 | 22470 | 1974 | 11598 | 0.00806574 | complete | req_011CgvMV651MyYzMi1w8rJck | 12.97406819 |
| 2026-11-11 11:31 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10332 | 598 | 2353 | 0.04431360 | complete | req_011CgvMZ5KUVyjr9VhxsRHFE | 13.01838179 |
| 2026-11-11 11:33 | AM 7부 | anthropic/claude-sonnet-5-5 | 34576 | 6966 | 17627 | 0.24681520 | complete | req_011CgvMa8KaiWiXgQUPB4yNU | 13.26519699 |
| 2026-11-11 11:33 | AM 7부 review | anthropic/claude-haiku-5-5 | 21979 | 1974 | 7546 | 0.00599064 | complete | req_011CgvMj1tNr9tzJRv99h1ny | 13.27118763 |
| 2026-11-11 11:34 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10124 | 598 | 2490 | 0.04526760 | complete | req_011CgvMmitkZjocXELHCN962 | 13.31645523 |
| 2026-11-11 11:38 | AM 7부 | anthropic/claude-sonnet-5-5 | 34905 | 6966 | 36365 | 0.43485320 | length | req_011CgvMnwyqXbbV9upcL2rQP | 13.75130843 |
| 2026-11-11 11:40 | AM 7부 | anthropic/claude-sonnet-5-5 | 33393 | 6966 | 16455 | 0.23272920 | complete | req_011CgvN8J3rYLTyTzZGi4gw4 | 13.98403763 |
| 2026-11-11 11:41 | AM 7부 review | anthropic/claude-haiku-5-5 | 22210 | 0 | 11613 | 0.00807685 | complete | req_011CgvNGUnzeUD1Xw5RbWN7U | 13.99211448 |
| 2026-11-11 11:41 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10142 | 0 | 2315 | 0.04373300 | complete | req_011CgvNLSmoymitjoB4G98ie | 14.03584748 |
| 2026-11-11 11:43 | AM 7부 | anthropic/claude-sonnet-5-5 | 35356 | 6966 | 15232 | 0.22442520 | complete | req_011CgvNMYsxQDMQcZwB6V1q8 | 14.26027268 |
| 2026-11-11 11:43 | AM 7부 review | anthropic/claude-haiku-5-5 | 20116 | 1974 | 5707 | 0.00488484 | complete | req_011CgvNV3ZZ8PiydztvBjMig | 14.26515752 |
| 2026-11-11 11:43 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 9475 | 598 | 2017 | 0.03923960 | complete | req_011CgvNX5f85Quf6Xo8gNRm3 | 14.30439712 |
| 2026-11-11 11:45 | AM 7부 | anthropic/claude-sonnet-5-5 | 29811 | 6966 | 14155 | 0.20256520 | complete | req_011CgvNY6spVFzSR4scsysJc | 14.50696232 |
| 2026-11-11 11:46 | AM 7부 review | anthropic/claude-haiku-5-5 | 18966 | 1974 | 9279 | 0.00655584 | complete | req_011CgvNfVurxw7PWPPevcoCy | 14.51351816 |
| 2026-11-11 11:46 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10209 | 598 | 2575 | 0.04628760 | complete | req_011CgvNiZHqKc1AfDwQnVxfg | 14.55980576 |
| 2026-11-11 12:21 | AM 7부 | anthropic/claude-sonnet-5-5 | 36917 | 0 | 12602 | 0.20333700 | complete | req_011CgvRHfKtHKQ1JE6f8R7V2 | 14.76314276 |
| 2026-11-11 12:21 | AM 7부 review | anthropic/claude-haiku-5-5 | 18881 | 0 | 7449 | 0.00566195 | complete | req_011CgvRQHZ9CC3CQYoATrSzZ | 14.76880471 |
| 2026-11-11 12:22 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10365 | 0 | 2327 | 0.04429900 | complete | req_011CgvRSoXVsVJPCAdgfHS1C | 14.81310371 |
| 2026-11-11 12:23 | AM 7부 | anthropic/claude-sonnet-5-5 | 30217 | 6966 | 12856 | 0.19038720 | complete | req_011CgvRUWPRnK6aCDNdGqonw | 15.00349091 |
| 2026-11-11 12:24 | AM 7부 review | anthropic/claude-haiku-5-5 | 17530 | 1974 | 9609 | 0.00657724 | complete | req_011CgvRbSCMVdPi7cY9QohLq | 15.01006815 |
| 2026-11-11 12:24 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 9309 | 598 | 2402 | 0.04275760 | complete | req_011CgvRekjf8k7dRiyoaca4b | 15.05282575 |
| 2026-11-11 12:26 | AM 7부 | anthropic/claude-sonnet-5-5 | 30683 | 6966 | 12332 | 0.18607920 | complete | req_011CgvRg8fJGD81yb6pBr3kY | 15.23890495 |
| 2026-11-11 12:27 | AM 7부 review | anthropic/claude-haiku-5-5 | 18369 | 1974 | 11617 | 0.00766514 | complete | req_011CgvRnnmfykCUkA9GT2rLJ | 15.24657009 |
| 2026-11-11 12:27 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10214 | 598 | 2103 | 0.04157760 | complete | req_011CgvRrer2PKaJ7Dg7oMsAC | 15.28814769 |
| 2026-11-11 12:31 | AM 7부 | anthropic/claude-sonnet-5-5 | 30450 | 6966 | 32619 | 0.38848320 | length | req_011CgvRsq5DGt4w46hWbgF1Y | 15.67663089 |
| 2026-11-11 12:33 | AM 7부 | anthropic/claude-sonnet-5-5 | 22186 | 6966 | 17647 | 0.22223520 | complete | req_011CgvSBc8bZvuoMTewC7Shy | 15.89886609 |
| 2026-11-11 12:34 | AM 7부 review | anthropic/claude-haiku-5-5 | 25544 | 0 | 6380 | 0.00579375 | complete | req_011CgvSMUgeLy9ptV9RMp83c | 15.90465984 |
| 2026-11-11 12:34 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 6597 | 0 | 1520 | 0.02869300 | complete | req_011CgvSPk2SvijqfQmnh4xTg | 15.93335284 |
| 2026-11-11 12:36 | AM 7부 | anthropic/claude-sonnet-5-5 | 18785 | 6966 | 12954 | 0.16850320 | complete | req_011CgvSRAVNcU7NHSCMtBWx3 | 16.10185604 |
| 2026-11-11 12:36 | AM 7부 review | anthropic/claude-haiku-5-5 | 19106 | 1974 | 8194 | 0.00602734 | complete | req_011CgvSXqmgrKgAuk19zvF9n | 16.10788338 |
| 2026-11-11 12:37 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10779 | 598 | 2937 | 0.05104760 | complete | req_011CgvSaWpVvAX2nwVTHwduE | 16.15893098 |
| 2026-11-11 12:40 | AM 7부 | anthropic/claude-sonnet-5-5 | 18180 | 6966 | 25183 | 0.28958320 | length | req_011CgvScEn9tiYijryEtFXLH | 16.44851418 |
| 2026-11-11 12:42 | AM 7부 | anthropic/claude-sonnet-5-5 | 25755 | 6966 | 13678 | 0.18968320 | complete | req_011CgvSrJVnPufT8NwoftikA | 16.63819738 |
| 2026-11-11 12:42 | AM 7부 review | anthropic/claude-haiku-5-5 | 24986 | 0 | 10069 | 0.00758245 | complete | req_011CgvSyafaDZt8DvEQ9aFxm | 16.64577983 |
| 2026-11-11 12:42 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 8795 | 0 | 1563 | 0.03351900 | complete | req_011CgvT2tYgwD45BgBofjfEx | 16.67929883 |
| 2026-11-11 12:47 | AM 7부 | anthropic/claude-sonnet-5-5 | 34940 | 6966 | 36365 | 0.43492320 | length | req_011CgvT3pqUeKqJxKqE2fJFs | 17.11422203 |
| 2026-11-11 14:27 | AM 7부 | anthropic/claude-sonnet-5-5 | 37416 | 0 | 12725 | 0.20556500 | complete | req_011CgvasQWuCaj5vmHSedX5L | 17.31978703 |
| 2026-11-11 14:27 | AM 7부 review | anthropic/claude-haiku-5-5 | 17900 | 0 | 8173 | 0.00592585 | complete | req_011CgvazF4K9gDfwCMJhnwZZ | 17.32571288 |
| 2026-11-11 14:27 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 9312 | 0 | 2104 | 0.03996300 | complete | req_011Cgvb34f5HVAqhTgHC5Jvi | 17.36567588 |
| 2026-11-11 14:32 | AM 7부 | anthropic/claude-sonnet-5-5 | 34940 | 6966 | 36365 | 0.43492320 | length | req_011Cgvb4UP7RSuqyopLkBwxs | 17.80059908 |
| 2026-11-11 14:33 | AM 7부 | anthropic/claude-sonnet-5-5 | 41907 | 0 | 14221 | 0.22950750 | complete | req_011CgvbPheNK4hgUtUXKDNiA | 18.03010658 |
| 2026-11-11 14:36 | AM 7부 임시본 · interim report_aminterimannual0001 | openai/gpt-6.1-terra | 26117 | 0 | 9794 | 0.07508700 | complete | req_33bd1d60414b495ba112c68904a6d4a5 | 18.10519358 |
| 2026-11-11 14:37 | AM 7부 정식본 교체 · official report_aminterimannual0001 | anthropic/claude-sonnet-5-5 | 42143 | 0 | 14840 | 0.23268600 | complete | req_011Cgvbh47tiwB8i65HF8V2p | 18.33787958 |
| 2026-11-11 14:38 | AM 7부 정식본 교체 · official report_aminterimannual0001 review | anthropic/claude-haiku-5-5 | 20478 | 0 | 8338 | 0.00621680 | complete | req_011CgvbpGNnCptdgkXrtBxtj | 18.34409638 |
| 2026-11-11 14:38 | AM 7부 정식본 교체 · official report_aminterimannual0001 repair | anthropic/claude-sonnet-5-5 | 11028 | 0 | 2480 | 0.04685600 | complete | req_011CgvbsBEJJDJrhBd24vnJx | 18.39095238 |
| 2026-11-11 14:41 | AM 7부 임시본 · interim report_aminterimmajor0001 | openai/gpt-6.1-terra | 18947 | 4186 | 8054 | 0.05942630 | complete | req_b9c999c8f416446685492823b7acd76a | 18.45037868 |
| 2026-11-11 14:41 | AM 7부 정식본 교체 · official report_aminterimmajor0001 review | anthropic/claude-haiku-5-5 | 18878 | 0 | 9625 | 0.00670030 | complete | req_011Cgvc4eddVhEC4YzJgDSHL | 18.45707898 |
| 2026-11-11 14:42 | AM 7부 정식본 교체 · official report_aminterimmajor0001 repair | anthropic/claude-sonnet-5-5 | 10387 | 0 | 2372 | 0.04449400 | complete | req_011Cgvc7xherBg7ysuACDAew | 18.50157298 |
| 2026-11-11 15:31 | AM 7부 | anthropic/claude-sonnet-5-5 | 37777 | 0 | 13599 | 0.21509250 | complete | req_011CgvfmnrEiDLYxb55sYPSf | 18.71666548 |
| 2026-11-11 15:32 | AM 7부 review | anthropic/claude-haiku-5-5 | 20429 | 0 | 9352 | 0.00676940 | complete | req_011CgvftwxbxvBAx8ZL7gV9g | 18.72343488 |
| 2026-11-11 15:32 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10252 | 0 | 2343 | 0.04423300 | complete | req_011CgvfxE2L3N6zqPZrRWfpf | 18.76766788 |
| 2026-11-11 15:34 | AM 7부 | anthropic/claude-sonnet-5-5 | 35624 | 7097 | 16802 | 0.24068740 | complete | req_011Cgvfyi6pVFBYNLkAXAqw9 | 19.00835528 |
| 2026-11-11 15:34 | AM 7부 review | anthropic/claude-haiku-5-5 | 21480 | 2020 | 124 | 0.00223020 | complete | req_011Cgvg8MCi9fzxbgDTZ6DP1 | 19.01058548 |
| 2026-11-11 15:34 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 9757 | 598 | 2575 | 0.04538360 | complete | req_011Cgvg8YNuyJmSwyyfmB8wA | 19.05596908 |
| 2026-11-11 15:36 | AM 7부 | anthropic/claude-sonnet-5-5 | 22186 | 7097 | 15286 | 0.19865140 | complete | req_011Cgvg9ys7tPRNL1UGh8XPx | 19.25462048 |
| 2026-11-11 15:37 | AM 7부 review | anthropic/claude-haiku-5-5 | 21180 | 2020 | 10142 | 0.00720920 | complete | req_011CgvgHyne9HwEBSRLRWDr6 | 19.26182968 |
| 2026-11-11 15:37 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 8886 | 598 | 2321 | 0.04110160 | complete | req_011CgvgMJQPnW8UxJi7cJhGN | 19.30293128 |
| 2026-11-11 16:40 | AM 7부 | anthropic/claude-sonnet-5-5 | 37779 | 0 | 14119 | 0.22029650 | complete | req_011Cgvm4sPdksB9CJBoUMAo9 | 19.52322778 |
| 2026-11-11 16:41 | AM 7부 review | anthropic/claude-haiku-5-5 | 20908 | 0 | 10478 | 0.00738030 | complete | req_011CgvmC7iJH5GoUvV4xCR62 | 19.53060808 |
| 2026-11-11 16:41 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10872 | 0 | 2534 | 0.04738300 | complete | req_011CgvmFdhvRRcvEKUGUzKth | 19.57799108 |
| 2026-11-11 16:42 | AM 7부 review | anthropic/claude-haiku-5-5 | 21424 | 2020 | 10209 | 0.00726710 | complete | req_011CgvmHDxyGpRMp4oohFAkF | 19.58525818 |
| 2026-11-11 16:43 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10267 | 598 | 2483 | 0.04548360 | complete | req_011CgvmLaqAya2asqLyHYfHc | 19.63074178 |
| 2026-11-11 16:44 | AM 7부 | anthropic/claude-sonnet-5-5 | 22216 | 7097 | 14586 | 0.19171140 | complete | req_011CgvmMpaCMokLNUD7uvE4L | 19.82245318 |
| 2026-11-11 16:45 | AM 7부 review | anthropic/claude-haiku-5-5 | 20523 | 2020 | 6548 | 0.00534650 | complete | req_011CgvmVoNjVchpRoQP7GoBS | 19.82779968 |
| 2026-11-11 16:45 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 5426 | 598 | 1106 | 0.02203160 | complete | req_011CgvmY4sCY9qCkJGuogkTz | 19.84983128 |
| 2026-11-11 17:34 | AM 7부 review | anthropic/claude-haiku-5-5 | 23940 | 0 | 7350 | 0.00612238 | complete | req_011CgvqDHoGcvqXPqnfweigh | 19.85595366 |
| 2026-11-11 17:34 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10830 | 0 | 2523 | 0.04718900 | complete | req_011CgvqFvUx4wYBeh277pv2V | 19.90314266 |
| 2026-11-11 17:34 | AM 7부 review | anthropic/claude-haiku-5-5 | 19154 | 2135 | 121 | 0.00199725 | complete | req_011CgvqHpxryuRDZyGhbF46g | 19.90513991 |
| 2026-11-11 17:34 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10075 | 598 | 2575 | 0.04601960 | complete | req_011CgvqHyLPmNwhNnyrKbHXW | 19.95115951 |
| 2026-11-11 17:37 | AM 7부 review | anthropic/claude-haiku-5-5 | 19147 | 2135 | 10344 | 0.00710805 | complete | req_011CgvqSZUTBWGbTZx1QmJe3 | 19.95826756 |
| 2026-11-11 17:37 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 10428 | 598 | 2459 | 0.04556560 | complete | req_011CgvqW28uaB3hw12JS6kya | 20.00383316 |
| 2026-11-11 17:39 | AM 7부 review | anthropic/claude-haiku-5-5 | 20579 | 2135 | 7983 | 0.00607075 | complete | req_011CgvqdkuLVAJBJ3xECVWae | 20.00990391 |
| 2026-11-11 17:39 | AM 7부 repair | anthropic/claude-sonnet-5-5 | 5300 | 598 | 1084 | 0.02155960 | complete | req_011CgvqgTsjqB3kF1VB9qGtu | 20.03146351 |
| 2026-11-11 19:59 | AM2 P | anthropic/claude-sonnet-5-5 | 34392 | 0 | 3223 | 0.11812400 | complete | req_011Cgw2JvN7A71qN8sfRP2vM | 20.14958751 |
| 2026-11-11 19:59 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 34220 | 3228 | 0.03945200 | complete | req_011Cgw2K1Pj9H9jDGbtW3HFk | 20.18903951 |
| 2026-11-11 19:59 | AM2 P | anthropic/claude-sonnet-5-5 | 210 | 34220 | 3456 | 0.04182400 | complete | req_011Cgw2Jzxw3EkvYYrcQz28x | 20.23086351 |
| 2026-11-11 19:59 | AM2 P | anthropic/claude-sonnet-5-5 | 180 | 34220 | 2580 | 0.03300400 | complete | req_011Cgw2LoTSUTZhS1UFUoW6f | 20.26386751 |
| 2026-11-11 19:59 | AM2 P | anthropic/claude-sonnet-5-5 | 196 | 34220 | 3444 | 0.04167600 | complete | req_011Cgw2Ljii1oJW7j8NCMvqH | 20.30554351 |
| 2026-11-11 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 34220 | 3018 | 0.03743600 | complete | req_011Cgw2N7fLy4P25mwLtCQzD | 20.34297951 |
| 2026-11-11 20:00 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3872 | 34220 | 3243 | 0.04701800 | complete | req_011Cgw2PnmbkuQvaJZ9PfGTi | 20.38999751 |
| 2026-11-11 20:00 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4084 | 34220 | 3259 | 0.04760200 | complete | req_011Cgw2PnhNypFuvmxNAz53h | 20.43759951 |
| 2026-11-11 20:00 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3729 | 34220 | 3263 | 0.04693200 | complete | req_011Cgw2R1NfZCtwF6t6aYv5B | 20.48453151 |
| 2026-11-11 20:01 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3936 | 34220 | 3197 | 0.04668600 | complete | req_011Cgw2SBmkqLicB2uiEiHRy | 20.53121751 |
| 2026-11-11 20:06 | AM2 P | anthropic/claude-sonnet-5-5 | 27043 | 0 | 1893 | 0.08645550 | complete | req_011Cgw2rcirtK9Mejt15oBtd | 20.61767301 |
| 2026-11-11 20:06 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 26879 | 2582 | 0.03151180 | complete | req_011Cgw2rh15YdBkJwrJgJB43 | 20.64918481 |
| 2026-11-11 20:06 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 26879 | 3272 | 0.03840380 | complete | req_011Cgw2rh2pbvK2rJetfxKtC | 20.68758861 |
| 2026-11-11 20:06 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 26879 | 1741 | 0.02309380 | complete | req_011Cgw2t9FfsnY6d4yqmX68F | 20.71068241 |
| 2026-11-11 20:06 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 26879 | 2222 | 0.02792580 | complete | req_011Cgw2tNh4M9K1ds2ZqtaXu | 20.73860821 |
| 2026-11-11 20:07 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 26879 | 2285 | 0.02851380 | complete | req_011Cgw2u3aeX9B69cLX8S7mX | 20.76712201 |
| 2026-11-11 20:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2352 | 26879 | 1889 | 0.02896980 | complete | req_011Cgw2vRAT8fXaXe3FbDo5R | 20.79609181 |
| 2026-11-11 20:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3483 | 26879 | 2577 | 0.03811180 | complete | req_011Cgw2vQ2jQLnmpsffNveu5 | 20.83420361 |
| 2026-11-11 20:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2816 | 26879 | 2271 | 0.03371780 | complete | req_011Cgw2wMK42BoUTB4fWHzVu | 20.86792141 |
| 2026-11-11 20:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2765 | 26879 | 2232 | 0.03322580 | complete | req_011Cgw2wM9d5Cmkj33nt1r8r | 20.90114721 |
| 2026-11-11 21:11 | AM2 P | anthropic/claude-sonnet-5-5 | 35700 | 0 | 2637 | 0.11553400 | complete | req_011Cgw7p1vNVPHXf6Agu6aD8 | 21.01668121 |
| 2026-11-11 21:11 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 35528 | 2671 | 0.03414360 | complete | req_011Cgw7p7i8akiayeUv6ytBr | 21.05082481 |
| 2026-11-11 21:11 | AM2 P | anthropic/claude-sonnet-5-5 | 210 | 35528 | 3580 | 0.04332560 | complete | req_011Cgw7p7NnToctTvdHRgVD2 | 21.09415041 |
| 2026-11-11 21:12 | AM2 P | anthropic/claude-sonnet-5-5 | 196 | 35528 | 3577 | 0.04326760 | complete | req_011Cgw7qahsB3aYDwsWQvoY4 | 21.13741801 |
| 2026-11-11 21:12 | AM2 P | anthropic/claude-sonnet-5-5 | 180 | 35528 | 2957 | 0.03703560 | complete | req_011Cgw7qzgG6GoBpqDeJUXQf | 21.17445361 |
| 2026-11-11 21:12 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 35528 | 2819 | 0.03570760 | complete | req_011Cgw7sE6C36QEmCVtT2PJD | 21.21016121 |
| 2026-11-11 21:12 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3332 | 35528 | 2677 | 0.04053960 | complete | req_011Cgw7tp6N4iUtevffgVziw | 21.25070081 |
| 2026-11-11 21:12 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4163 | 35528 | 3650 | 0.05193160 | complete | req_011Cgw7toNi5HYZBqP2ErdBS | 21.30263241 |
| 2026-11-11 21:12 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3343 | 35528 | 2811 | 0.04190160 | complete | req_011Cgw7ukjygBpHaNxWGgikq | 21.34453401 |
| 2026-11-11 21:12 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2953 | 35528 | 2655 | 0.03956160 | complete | req_011Cgw7v5fWizrnWVM7ueqJd | 21.38409561 |
| 2026-11-11 21:13 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4328 | 35528 | 3593 | 0.05169160 | complete | req_011Cgw7w3T6bSp9xmSnhVYgo | 21.43578721 |
| 2026-11-11 21:13 | AM2 P | anthropic/claude-sonnet-5-5 | 28140 | 0 | 2028 | 0.09054800 | complete | req_011Cgw7xRTwoHwhW9q2yNsyz | 21.52633521 |
| 2026-11-11 21:13 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 27976 | 2695 | 0.03285320 | complete | req_011Cgw7xWjSzJ4eYaYxmTqNH | 21.55918841 |
| 2026-11-11 21:13 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 27976 | 2506 | 0.03097120 | complete | req_011Cgw7xX91Dcc3GmKNMCEcQ | 21.59015961 |
| 2026-11-11 21:13 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 27976 | 2094 | 0.02686520 | complete | req_011Cgw7ysBnk2quH5HMEuSDu | 21.61702481 |
| 2026-11-11 21:13 | AM2 P | anthropic/claude-sonnet-5-5 | 154 | 27976 | 2252 | 0.02842320 | complete | req_011Cgw7yr7oDqd5q8Wfhe3G7 | 21.64544801 |
| 2026-11-11 21:14 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 27976 | 2088 | 0.02676320 | complete | req_011Cgw812vCXi3KaVqR3hCr8 | 21.67221121 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2682 | 27976 | 2107 | 0.03202920 | complete | req_011Cgw82AcqFjo7JaCWYtvdK | 21.70424041 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2681 | 27976 | 2027 | 0.03122720 | complete | req_011Cgw82BnHg7WstVVh2EUNz | 21.73546761 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2489 | 27976 | 2065 | 0.03122320 | complete | req_011Cgw82vq8xhKX2aFe47mEW | 21.76669081 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2358 | 27976 | 2026 | 0.03057120 | complete | req_011Cgw83g98SRzQvuPg3UVnY | 21.79726201 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2589 | 27976 | 2107 | 0.03184320 | complete | req_011Cgw83hPYcTpjh4HJiq84M | 21.82910521 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2587 | 27976 | 2083 | 0.03159920 | complete | req_011Cgw84U5NFX2Q91WRT2mgj | 21.86070441 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2954 | 27976 | 2440 | 0.03590320 | complete | req_011Cgw84UNj4tXepT4cEtVNw | 21.89660761 |
| 2026-11-11 21:14 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2545 | 27976 | 2127 | 0.03195520 | complete | req_011Cgw85HMEmPk6dkLBxsiFa | 21.92856281 |
| 2026-11-12 12:56 | AM2 P | anthropic/claude-sonnet-5-5 | 39525 | 0 | 2404 | 0.12276650 | complete | req_011CgxMtpJuK8QrMjyUKFB5Q | 22.05132931 |
| 2026-11-12 12:56 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 39353 | 2370 | 0.03189860 | complete | req_011CgxMttTvpy2wJrA1YGBv9 | 22.08322791 |
| 2026-11-12 12:56 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 39353 | 3061 | 0.03918860 | complete | req_011CgxMttVARAodg8yiPcsoi | 22.12241651 |
| 2026-11-12 12:57 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 39353 | 2895 | 0.03755060 | complete | req_011CgxMv2QwFxAH4koT7Mumi | 22.15996711 |
| 2026-11-12 12:57 | AM2 P | anthropic/claude-sonnet-5-5 | 330 | 39353 | 2271 | 0.03124060 | complete | req_011CgxMvP4QZFdFc39TQ4Eci | 22.19120771 |
| 2026-11-12 12:57 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 39353 | 2291 | 0.03119260 | complete | req_011CgxMwKE1T3VWtoYnbDPJZ | 22.22240031 |
| 2026-11-12 12:57 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2958 | 39353 | 2370 | 0.03748660 | complete | req_011CgxMxWfcdim9gyWwioG2K | 22.25988691 |
| 2026-11-12 12:57 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3842 | 39353 | 2926 | 0.04481460 | complete | req_011CgxMxWEpBN1ja5BtkkaMV | 22.30470151 |
| 2026-11-12 12:57 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2980 | 39353 | 2286 | 0.03669060 | complete | req_011CgxMySEVuAP33BDCfYvpG | 22.34139211 |
| 2026-11-12 12:57 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2851 | 39353 | 2447 | 0.03804260 | complete | req_011CgxMyaRMqx3Vy9VQc9BZt | 22.37943471 |
| 2026-11-12 12:57 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2817 | 39353 | 2325 | 0.03675460 | complete | req_011CgxMzF9GryLLTLPwoK82L | 22.41618931 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2740 | 39353 | 2370 | 0.03705060 | complete | req_011CgxN16dacgLWtWsfg1Z4Y | 22.45323991 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3512 | 39353 | 2960 | 0.04449460 | complete | req_011CgxN16D2tSjVYVJBncjnP | 22.49773451 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3483 | 39353 | 2207 | 0.03690660 | complete | req_011CgxN26ZtX4Zezzb1yUenP | 22.53464111 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4568 | 39353 | 2854 | 0.04554660 | complete | req_011CgxN26UvzT9qxETJdeXEK | 22.58018771 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3262 | 39353 | 2379 | 0.03818460 | complete | req_011CgxN2wdQC9tkhxdpHHUiF | 22.61837231 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2900 | 39353 | 2378 | 0.03745060 | complete | req_011CgxN3AZGoSigTCL3G6jg8 | 22.65582291 |
| 2026-11-12 12:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2791 | 39353 | 2403 | 0.03748260 | complete | req_011CgxN3qTMj1orVpRhqi1kx | 22.69330551 |
| 2026-11-12 13:06 | AM2 P | anthropic/claude-sonnet-5-5 | 31404 | 0 | 1724 | 0.09566800 | complete | req_011CgxNfPUfYkug2YqR5Trjj | 22.78897351 |
| 2026-11-12 13:06 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 31240 | 2157 | 0.02813400 | complete | req_011CgxNfTt5kc34qztq5Rvog | 22.81710751 |
| 2026-11-12 13:06 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 31240 | 2778 | 0.03472400 | complete | req_011CgxNfTsLAkVDj5opmzUDe | 22.85183151 |
| 2026-11-12 13:07 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 31240 | 2638 | 0.03333600 | complete | req_011CgxNgbfAPnYiBvaxnNb6K | 22.88516751 |
| 2026-11-12 13:07 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 31240 | 2071 | 0.02728800 | complete | req_011CgxNgnSKQy2NGDRf7K8pX | 22.91245551 |
| 2026-11-12 13:07 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 31240 | 1826 | 0.02479600 | complete | req_011CgxNhnU5XV5RG2BT2KkaU | 22.93725151 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2502 | 31240 | 1713 | 0.02838200 | complete | req_011CgxNit6gSqHcmRq1XhX67 | 22.96563351 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3964 | 31240 | 2684 | 0.04101600 | complete | req_011CgxNitYyHeYuyDiAihcTM | 23.00664951 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2596 | 31240 | 2018 | 0.03162000 | complete | req_011CgxNjYC948njVqLMcZRTK | 23.03826951 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2523 | 31240 | 1824 | 0.02953400 | complete | req_011CgxNjswnoECJEQZuoys4h | 23.06780351 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2826 | 31240 | 2143 | 0.03333000 | complete | req_011CgxNkH2rZ7aF938H5m39S | 23.10113351 |
| 2026-11-12 13:07 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3182 | 31240 | 2653 | 0.03914200 | complete | req_011CgxNkYaVcw76U1GVpujz5 | 23.14027551 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2867 | 31240 | 2131 | 0.03329200 | complete | req_011CgxNmU9cfX342EzJFESbV | 23.17356751 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4556 | 31240 | 2799 | 0.04335000 | complete | req_011CgxNmTc7yREDMetUPpABF | 23.21691751 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2610 | 31240 | 1828 | 0.02974800 | complete | req_011CgxNnGebHa5GBNgEvdMAP | 23.24666551 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3555 | 31240 | 2754 | 0.04089800 | complete | req_011CgxNnatCqfTxTtBBjU27B | 23.28756351 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2690 | 31240 | 2050 | 0.03212800 | complete | req_011CgxNnzARsr7Jvz69yPraR | 23.31969151 |
| 2026-11-12 13:08 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2068 | 31240 | 1690 | 0.02728400 | complete | req_011CgxNodSWyCUhp58qv218u | 23.34697551 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 30170 | 1956 | 0.02630200 | complete | req_011CgxbjEsrZKL1m3kGsen4t | 23.37327751 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 30170 | 2484 | 0.03120200 | complete | req_011CgxbjEoQ3ZpdyXLLycD64 | 23.40447951 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 30342 | 0 | 2671 | 0.10247900 | complete | req_011CgxbjA1fmoTu1DZzzonsx | 23.50695851 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 30170 | 1395 | 0.02071400 | complete | req_011CgxbkLWDaC1WgATvBYqtt | 23.52767251 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 30170 | 1128 | 0.01797200 | complete | req_011CgxbkRvemzrr9ySEvHLUX | 23.54564451 |
| 2026-11-12 15:58 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 30170 | 2661 | 0.03305600 | complete | req_011Cgxbkwux4AjNvUxiVJvMg | 23.57870051 |
| 2026-11-12 15:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2343 | 30170 | 1094 | 0.02166000 | complete | req_011CgxbnSuzq21r7ECV69jCj | 23.60036051 |
| 2026-11-12 15:58 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 4101 | 30170 | 2683 | 0.04106600 | complete | req_011CgxbnSYuZ7AtBQWnphjAk | 23.64142651 |
| 2026-11-12 15:59 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3622 | 30170 | 2710 | 0.04037800 | complete | req_011CgxbntsSohVYuJSMjYVpa | 23.68180451 |
| 2026-11-12 15:59 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3461 | 30170 | 2528 | 0.03823600 | complete | req_011CgxboTmcKiY8FcQiNeCPN | 23.72004051 |
| 2026-11-12 15:59 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2862 | 30170 | 1929 | 0.03104800 | complete | req_011CgxboukZ1LNYBhrAwLgKL | 23.75108851 |
| 2026-11-12 16:03 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 24536 | 1000 | 0.01560320 | complete | req_011CgxcAY79RZzKcMZAJkkL5 | 23.76669171 |
| 2026-11-12 16:03 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 24536 | 1006 | 0.01567320 | complete | req_011CgxcAxbnuBUkco35nrwYn | 23.78236491 |
| 2026-11-12 16:03 | AM2 P | anthropic/claude-sonnet-5-5 | 24700 | 0 | 1924 | 0.08090800 | complete | req_011CgxcATnSftiDAJPMLDrJQ | 23.86327291 |
| 2026-11-12 16:03 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 24536 | 2201 | 0.02723320 | complete | req_011CgxcAY4v8C9ccE3DmykQ8 | 23.89050611 |
| 2026-11-12 16:04 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 24536 | 1861 | 0.02384720 | complete | req_011CgxcBSEhrqEkLystxCSoc | 23.91435331 |
| 2026-11-12 16:04 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 24536 | 1899 | 0.02418520 | complete | req_011CgxcBeEXWJFoYrND5EZjp | 23.93853851 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3646 | 24536 | 1899 | 0.03118920 | complete | req_011CgxcCmHhz4PGQ38t2BNV1 | 23.96972771 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3363 | 24536 | 1902 | 0.03065320 | complete | req_011CgxcCmHiE7Z5CkYDv4UTZ | 24.00038091 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 1889 | 24536 | 1044 | 0.01912520 | complete | req_011CgxcDXk9aSDTb8uwjAaR6 | 24.01950611 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 3415 | 24536 | 2229 | 0.03402720 | complete | req_011CgxcDVXhTvpuowR6mHSQG | 24.05353331 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2393 | 24536 | 1781 | 0.02750320 | complete | req_011CgxcDxvjJbAxepmBJwofy | 24.08103651 |
| 2026-11-12 16:04 | AM2 P rewrite | anthropic/claude-sonnet-5-5 | 2226 | 24536 | 1905 | 0.02840920 | complete | req_011CgxcEeykGgHTgADGjayVz | 24.10944571 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 33653 | 1822 | 0.02565860 | complete | req_011CgxujzWJESATjwun2zrWk | 24.13510431 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 33825 | 0 | 2823 | 0.11270650 | complete | req_011Cgxujre23MSgeARjMHBJX | 24.24781081 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 33653 | 2746 | 0.03451860 | complete | req_011CgxujyqrqG4pm6wcFENtZ | 24.28232941 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 33653 | 1580 | 0.02326060 | complete | req_011CgxuksGzkoeBDnPA7QsKP | 24.30559001 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 33653 | 1273 | 0.02011860 | complete | req_011CgxumPMkW8geHLNBizDhM | 24.32570861 |
| 2026-11-12 19:54 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 33653 | 2739 | 0.03453260 | complete | req_011CgxumZM1fuMZu7MoiQxxS | 24.36024121 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 4258 | 33653 | 1175 | 0.02699660 | complete | req_011CgxuoDVUBJfcg2rZvyDna | 24.38723781 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 5655 | 33653 | 1515 | 0.03319060 | complete | req_011CgxuoDtY9wnzJvbEbP9BE | 24.42042841 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3179 | 33653 | 851 | 0.02159860 | complete | req_011CgxuonAzTDjw5xqYL6tkT | 24.44202701 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 4193 | 33653 | 745 | 0.02256660 | complete | req_011CgxuosUyrW2VWrHGDKz49 | 24.46459361 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 4196 | 33653 | 609 | 0.02121260 | complete | req_011Cgxup97aMVidJVBPsdk89 | 24.48580621 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2668 | 33653 | 278 | 0.01484660 | complete | req_011CgxupaUZnZ5qn6TakdapV | 24.50065281 |
| 2026-11-12 19:55 | AM2 P | anthropic/claude-sonnet-5-5 | 4129 | 33653 | 680 | 0.02178860 | complete | req_011CgxupaNcXMQDiaKGUqyDG | 24.52244141 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 32829 | 2124 | 0.02851380 | complete | req_011CgxustHCurUEWZNZdBMA9 | 24.55095521 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 32829 | 2120 | 0.02809380 | complete | req_011CgxustPAQ6prTXavGzR8g | 24.57904901 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 33001 | 0 | 2426 | 0.10667650 | complete | req_011CgxusiFTsAS2BPHWeUsqp | 24.68572551 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 32829 | 1203 | 0.01925380 | complete | req_011CgxutwyV4AodBac8JcGrP | 24.70497931 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 32829 | 1491 | 0.02220580 | complete | req_011CgxutwNmqdphbYiMYdhho | 24.72718511 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 32829 | 2070 | 0.02759380 | complete | req_011CgxuubE6UsqPqvjYLTFB8 | 24.75477891 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3662 | 32829 | 890 | 0.02278980 | complete | req_011Cgxuvkfu8GV4mPmqRWHXe | 24.77756871 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 4185 | 32829 | 1512 | 0.03005580 | complete | req_011CgxuvkAPraoZz8dixd5x3 | 24.80762451 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 4296 | 32829 | 1306 | 0.02821780 | complete | req_011CgxuwAiWKV9yzVVYTP5AT | 24.83584231 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3362 | 32829 | 620 | 0.01948980 | complete | req_011CgxuwQNJAuveeJmz1VxsG | 24.85533211 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3295 | 32829 | 253 | 0.01568580 | complete | req_011CgxuwhywokKr2THajehzN | 24.87101791 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3510 | 32829 | 526 | 0.01884580 | complete | req_011CgxuwtP2TH6adX97DrVPJ | 24.88986371 |
| 2026-11-12 19:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3735 | 32829 | 938 | 0.02341580 | complete | req_011CgxuwtyzkKtSMAWKCQcYD | 24.91327951 |
| 2026-11-12 19:57 | AM2 P | anthropic/claude-sonnet-5-5 | 2279 | 32829 | 156 | 0.01268380 | complete | req_011CgxuxQBfAeaw1DYFTqbmd | 24.92596331 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 26320 | 1319 | 0.01915000 | complete | req_011CgxvBbb8DVzq5EiM4avYS | 24.94511331 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 26484 | 0 | 1648 | 0.08260800 | complete | req_011CgxvBWqdEgW5uUdu1NWEj | 25.02772131 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 26320 | 2140 | 0.02698000 | complete | req_011CgxvBbL11aXmx7xbN56HR | 25.05470131 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 26320 | 1072 | 0.01669000 | complete | req_011CgxvCCGwFvnax6SEo3dGV | 25.07139131 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 26320 | 1779 | 0.02334200 | complete | req_011CgxvCmaR4i9hzkJCevVGT | 25.09473331 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 26320 | 2018 | 0.02577400 | complete | req_011CgxvCiUP8Vk29TsLcnPjo | 25.12050731 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 3045 | 26320 | 526 | 0.01661400 | complete | req_011CgxvDra5xi9Kn8UTnxBNF | 25.13712131 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 3618 | 26320 | 989 | 0.02239000 | complete | req_011CgxvDrTtF4YWve5FCnn7b | 25.15951131 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 3447 | 26320 | 705 | 0.01920800 | complete | req_011CgxvEBkFh8ewtWpu7VVS4 | 25.17871931 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 3093 | 26320 | 494 | 0.01639000 | complete | req_011CgxvELqSopGtPgXRd71b9 | 25.19510931 |
| 2026-11-12 20:00 | AM2 P | anthropic/claude-sonnet-5-5 | 2670 | 26320 | 174 | 0.01234400 | complete | req_011CgxvF3xDFEUCWf57vYWdJ | 25.20745331 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 24622 | 1229 | 0.01791040 | complete | req_011CgxvG6iBZPF3gbRQGY9WQ | 25.22536371 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 24786 | 0 | 1625 | 0.07813300 | complete | req_011CgxvG2e7zFTuhmaMyEGXe | 25.30349671 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 24622 | 2028 | 0.02552040 | complete | req_011CgxvG6mfYGrKD1XRe6Gg2 | 25.32901711 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 24622 | 949 | 0.01512040 | complete | req_011CgxvGhxFCXUZKVFLLC2iE | 25.34413751 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 24622 | 2255 | 0.02779040 | complete | req_011CgxvHBG4aCHTyhb6wBLYt | 25.37192791 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 24622 | 1743 | 0.02264240 | complete | req_011CgxvHkb2J9a8ai35fW8eY | 25.39457031 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 2694 | 24622 | 1102 | 0.02133240 | complete | req_011CgxvJpuWRB3cxYgdGoy1c | 25.41590271 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 2742 | 24622 | 788 | 0.01828840 | complete | req_011CgxvJqRkqBRyW3iFgRMGR | 25.43419111 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 3539 | 24622 | 505 | 0.01705240 | complete | req_011CgxvKKUycM9JxCzpbqynt | 25.45124351 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 3208 | 24622 | 774 | 0.01908040 | complete | req_011CgxvKKBrn9bEoHop3SGKB | 25.47032391 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 2812 | 24622 | 590 | 0.01644840 | complete | req_011CgxvKcfq9asCUX2ZRqFxX | 25.48677231 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 3204 | 24622 | 606 | 0.01739240 | complete | req_011CgxvKgtLnsSKEw8kjEbKs | 25.50416471 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 2107 | 24622 | 449 | 0.01362840 | complete | req_011CgxvL4MvDt9ajRUUSh3ak | 25.51779311 |
| 2026-11-12 20:01 | AM2 P | anthropic/claude-sonnet-5-5 | 2848 | 24622 | 411 | 0.01473040 | complete | req_011CgxvL4Fxag6tQSNNriHTy | 25.53252351 |
| 2026-11-12 23:17 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 37064 | 2046 | 0.02858080 | complete | req_011CgyBF7cjYZZH7HGNPmMcn | 25.56110431 |
| 2026-11-12 23:17 | AM2 P | anthropic/claude-sonnet-5-5 | 37236 | 0 | 2684 | 0.11984400 | complete | req_011CgyBF2br4wHCf3qQon6xD | 25.68094831 |
| 2026-11-12 23:17 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 37064 | 2454 | 0.03228080 | complete | req_011CgyBF8ZnXuuvWJWNxjMBQ | 25.71322911 |
| 2026-11-12 23:17 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 37064 | 1265 | 0.02079280 | complete | req_011CgyBGCRjTPTRCuA3kwtWK | 25.73402191 |
| 2026-11-12 23:17 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 37064 | 1493 | 0.02300080 | complete | req_011CgyBGPFM4kj6BLA4Mh1FR | 25.75702271 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 37064 | 2483 | 0.03265480 | complete | req_011CgyBGo3qKNJK6C5r1V86Q | 25.78967751 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3529 | 37064 | 1460 | 0.02907080 | complete | req_011CgyBJCQo2tCHx7ZkBM1Um | 25.81874831 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3764 | 37064 | 1635 | 0.03129080 | complete | req_011CgyBJCx3FwzUFi1eABjs6 | 25.85003911 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 4882 | 37064 | 1114 | 0.02831680 | complete | req_011CgyBJufkPF6qsGbvSQf2X | 25.87835591 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 4449 | 37064 | 1383 | 0.03014080 | complete | req_011CgyBJoEYWkrpkw47HdwAZ | 25.90849671 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 4165 | 37064 | 395 | 0.01969280 | complete | req_011CgyBKNt6wmmoppsMPBUbB | 25.92818951 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3712 | 37064 | 372 | 0.01855680 | complete | req_011CgyBKP9jPKbCz5NS7tYBq | 25.94674631 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3891 | 37064 | 152 | 0.01671480 | complete | req_011CgyBKfvHy9EK2FAJQ9EzF | 25.96346111 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3678 | 37064 | 390 | 0.01866880 | complete | req_011CgyBKfn6wkJaBNxwSVV1s | 25.98212991 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3376 | 37064 | 457 | 0.01873480 | complete | req_011CgyBKx77krMjbDctXainx | 26.00086471 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 3619 | 37064 | 746 | 0.02211080 | complete | req_011CgyBKuwepQS7sGyUkG1ws | 26.02297551 |
| 2026-11-12 23:18 | AM2 P | anthropic/claude-sonnet-5-5 | 2173 | 37064 | 566 | 0.01741880 | complete | req_011CgyBLKgeWyGgidaJm2Hhy | 26.04039431 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 36081 | 2289 | 0.03043420 | complete | req_011CgyDejenhCt7rXgCzpso2 | 26.07082851 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 36253 | 0 | 2640 | 0.11694650 | complete | req_011CgyDedSioANScfNJJyb9h | 26.18777501 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 36081 | 2473 | 0.03265420 | complete | req_011CgyDejGTuytysRM9iFZ3h | 26.22042921 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 36081 | 1252 | 0.02039420 | complete | req_011CgyDg9E9iVG6cwZ5taqy9 | 26.24082341 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 36081 | 1758 | 0.02552620 | complete | req_011CgyDfs5JJB6eHjAmrXx2v | 26.26634961 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 36081 | 1970 | 0.02724420 | complete | req_011CgyDgjsjigkW44CKc72tk | 26.29359381 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 4712 | 36081 | 1234 | 0.02898020 | complete | req_011CgyDhsyAxrotdRGoJkF9p | 26.32257401 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 3776 | 36081 | 1122 | 0.02598820 | complete | req_011CgyDhtVSMWWRVuXGNaXxD | 26.34856221 |
| 2026-11-12 23:49 | AM2 P | anthropic/claude-sonnet-5-5 | 3708 | 36081 | 1080 | 0.02543220 | complete | req_011CgyDiTM7ybAwti4Lf5acS | 26.37399441 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 4591 | 36081 | 1300 | 0.02939820 | complete | req_011CgyDiSyo6FFfvPBCU1Hg9 | 26.40339261 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 4007 | 36081 | 362 | 0.01885020 | complete | req_011CgyDj39rQzU9NbyPDSy36 | 26.42224281 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 4102 | 36081 | 804 | 0.02346020 | complete | req_011CgyDiuFbMmHYXd7HzzonC | 26.44570301 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 3786 | 36081 | 679 | 0.02157820 | complete | req_011CgyDjKc52gnP1ZvbiiwL3 | 26.46728121 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 3832 | 36081 | 1029 | 0.02517020 | complete | req_011CgyDjKTtNfQ1uMGYvSZTF | 26.49245141 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 3731 | 36081 | 168 | 0.01635820 | complete | req_011CgyDjh6PLNsKfuwHdEPEK | 26.50880961 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 2820 | 36081 | 308 | 0.01593620 | complete | req_011CgyDjmgi4hwzbyUzu1Xmc | 26.52474581 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 3455 | 36081 | 206 | 0.01618620 | complete | req_011CgyDjxWqLe3kcNg2t9xBR | 26.54093201 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 3413 | 36081 | 766 | 0.02170220 | complete | req_011CgyDjpXcMMG97YyLp3RhG | 26.56263421 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 32668 | 2288 | 0.02974160 | complete | req_011CgyDkKcafTGhpYQ9H5qxJ | 26.59237581 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 32668 | 2033 | 0.02757160 | complete | req_011CgyDkL1tm3SfMNygyYVYd | 26.61994741 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 32840 | 0 | 2350 | 0.10551400 | complete | req_011CgyDkGMdpQin1ZaRwfsWu | 26.72546141 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 32668 | 1052 | 0.01771160 | complete | req_011CgyDmU2szb425pmDfyRvR | 26.74317301 |
| 2026-11-12 23:50 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 32668 | 1662 | 0.02388360 | complete | req_011CgyDmSwtQ4oMqPQ9PxuWX | 26.76705661 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 32668 | 2362 | 0.03056560 | complete | req_011CgyDn6eHxczmCr32dc2R9 | 26.79762221 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 4436 | 32668 | 1507 | 0.03047560 | complete | req_011CgyDoRU9YfwHuZ2ej5Mcy | 26.82809781 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 3993 | 32668 | 1292 | 0.02743960 | complete | req_011CgyDoS4crfduCybDy9oCw | 26.85553741 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 3597 | 32668 | 285 | 0.01657760 | complete | req_011CgyDp4tfqQ7xFCDr3AvS3 | 26.87211501 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 3863 | 32668 | 754 | 0.02179960 | complete | req_011CgyDp3ruKfdzJwtnp2nd1 | 26.89391461 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 3336 | 32668 | 315 | 0.01635560 | complete | req_011CgyDpJpKzd1doNemLAVjG | 26.91027021 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 2578 | 32668 | 559 | 0.01727960 | complete | req_011CgyDpRnXejpsH5C5pRwux | 26.92754981 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 3164 | 32668 | 144 | 0.01430160 | complete | req_011CgyDpjD1wdma6uuxpZ9EQ | 26.94185141 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 32949 | 0 | 2304 | 0.10532650 | complete | req_011CgyDpw5A28L4Srhi6wg7a | 27.04717791 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 32777 | 2172 | 0.02898340 | complete | req_011CgyDq15m1W8UdieYsEres | 27.07616131 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 32777 | 2492 | 0.03180340 | complete | req_011CgyDq12Xfrme1TA5HhB9W | 27.10796471 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 32777 | 1234 | 0.01962540 | complete | req_011CgyDr7ymcqpApmYGw5xN8 | 27.12759011 |
| 2026-11-12 23:51 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 32777 | 1563 | 0.02284340 | complete | req_011CgyDrHvopcbo5x4CaYYeZ | 27.15043351 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 32777 | 1801 | 0.02489340 | complete | req_011CgyDrpx7fMfJSD4LxZbJH | 27.17532691 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 4190 | 32777 | 1004 | 0.02497540 | complete | req_011CgyDssGY4EbFpLXtApKJi | 27.20030231 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 3490 | 32777 | 1116 | 0.02469540 | complete | req_011CgyDssjZfQxCFqCCUdLZb | 27.22499771 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 2905 | 32777 | 469 | 0.01705540 | complete | req_011CgyDtP9dZGbEttpLWiPsf | 27.24205311 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 4202 | 32777 | 911 | 0.02406940 | complete | req_011CgyDtLC3JLsCUe6DPYwvH | 27.26612251 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 3435 | 32777 | 681 | 0.02023540 | complete | req_011CgyDtdvPi846AYsJWN6Gs | 27.28635791 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 3576 | 32777 | 444 | 0.01814740 | complete | req_011CgyDtivWq93Jmt4Y8WNRJ | 27.30450531 |
| 2026-11-12 23:52 | AM2 P | anthropic/claude-sonnet-5-5 | 3059 | 32777 | 106 | 0.01373340 | complete | req_011CgyDtxiyr5rg9MHMmqr4o | 27.31823871 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 29363 | 0 | 1865 | 0.09197550 | complete | req_011CgyDxf4D2wbE3D5EfqJMw | 27.41021421 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 29199 | 1776 | 0.02429580 | complete | req_011CgyDxkcaf94wxp6MqS6Qq | 27.43451001 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 29199 | 2280 | 0.02895580 | complete | req_011CgyDxkgo4CwVVTWHE9h5r | 27.46346581 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 29199 | 1109 | 0.01763580 | complete | req_011CgyDyo8uofdoUdrWKg9Ed | 27.48110161 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 29199 | 1851 | 0.02467980 | complete | req_011CgyDyz2G5cjpB22BB7YEz | 27.50578141 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 29199 | 2016 | 0.02628780 | complete | req_011CgyDzMTqtXhbQTnaEFQWL | 27.53206921 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 5130 | 29199 | 1054 | 0.02663980 | complete | req_011CgyE1ZMkExakxtzVy6jLe | 27.55870901 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 4142 | 29199 | 1025 | 0.02437380 | complete | req_011CgyE1Zb989ahQvBMWEtyq | 27.58308281 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 3832 | 29199 | 765 | 0.02115380 | complete | req_011CgyE26B9MYSH5MzqHcNhX | 27.60423661 |
| 2026-11-12 23:53 | AM2 P | anthropic/claude-sonnet-5-5 | 3901 | 29199 | 1169 | 0.02533180 | complete | req_011CgyE23C4Fi7cgn2ABBPJU | 27.62956841 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 2968 | 29199 | 425 | 0.01602580 | complete | req_011CgyE2TiC2gGpRFDbhmKoY | 27.64559421 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 3309 | 29199 | 1066 | 0.02311780 | complete | req_011CgyE2XjJ231B5NsPYF4o7 | 27.66871201 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 3554 | 29199 | 806 | 0.02100780 | complete | req_011CgyE33SUdASeqnow66Qb6 | 27.68971981 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 2892 | 29199 | 1032 | 0.02194380 | complete | req_011CgyE33NWHkcPdyK1qXxcr | 27.71166361 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 26829 | 0 | 1551 | 0.08250050 | complete | req_011CgyE3pAnSgAGdbRBUyKLA | 27.79416411 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 26665 | 1175 | 0.01777900 | complete | req_011CgyE3soom4ZSS2kAv1msh | 27.81194311 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 26665 | 2003 | 0.02567900 | complete | req_011CgyE3smLCVsLYST62m3Kb | 27.83762211 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 26665 | 1188 | 0.01791900 | complete | req_011CgyE4evBva6X7bYpdq6Kx | 27.85554111 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 26665 | 1535 | 0.02099900 | complete | req_011CgyE4uZ1r3XsUqQoCrLSM | 27.87654011 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 26665 | 1708 | 0.02270100 | complete | req_011CgyE5MFb6VDfXXV5eRiaj | 27.89924111 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 4103 | 26665 | 1000 | 0.02353900 | complete | req_011CgyE6NYzj2BDcYfzcPp55 | 27.92278011 |
| 2026-11-12 23:54 | AM2 P | anthropic/claude-sonnet-5-5 | 3436 | 26665 | 958 | 0.02178500 | complete | req_011CgyE6P8E7u9EYGWHT3kBU | 27.94456511 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2761 | 26665 | 561 | 0.01646500 | complete | req_011CgyE6qYipGMCYYZRT7q4w | 27.96103011 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2961 | 26665 | 714 | 0.01839500 | complete | req_011CgyE6pHZhDbAeC6bpEfSR | 27.97942511 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3653 | 26665 | 661 | 0.01924900 | complete | req_011CgyE77DJRzc8fhdpYDWkk | 27.99867411 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3080 | 26665 | 653 | 0.01802300 | complete | req_011CgyE7FiGGrEK1a8dcduFd | 28.01669711 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2494 | 26665 | 182 | 0.01214100 | complete | req_011CgyE7YkwXFoqR3zCPGZc4 | 28.02883811 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2412 | 26665 | 248 | 0.01263700 | complete | req_011CgyE7YjCqLwRXJmNW3FZK | 28.04147511 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 27934 | 1520 | 0.02148280 | complete | req_011CgyE7tboC2TYGBVs6B7wJ | 28.06295791 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 28098 | 0 | 1763 | 0.08779300 | complete | req_011CgyE7o7Pu2UgiPphFTajT | 28.15075091 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 27934 | 2211 | 0.02801280 | complete | req_011CgyE7t5YBAozsibDqftdu | 28.17876371 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 27934 | 1256 | 0.01885280 | complete | req_011CgyE8fz4Mfw4NCberFgZL | 28.19761651 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 27934 | 2040 | 0.02631680 | complete | req_011CgyE92pvmjoe2Lf1MY2tS | 28.22393331 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 27934 | 1958 | 0.02545480 | complete | req_011CgyE9PC2etweATwzoRPWy | 28.24938811 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3845 | 27934 | 1188 | 0.02515680 | complete | req_011CgyEAXmzLivp8yqCnsHsL | 28.27454491 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 4747 | 27934 | 1131 | 0.02639080 | complete | req_011CgyEAYKjprLmvtpTFbvtF | 28.30093571 |
| 2026-11-12 23:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3093 | 27934 | 629 | 0.01806280 | complete | req_011CgyEB3QhkYASGza26svap | 28.31899851 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3494 | 27934 | 1428 | 0.02685480 | complete | req_011CgyEB1VcVSeq96KBN5HrK | 28.34585331 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3828 | 27934 | 580 | 0.01904280 | complete | req_011CgyEBMdKutN1fFNeDnkgS | 28.36489611 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3233 | 27934 | 563 | 0.01768280 | complete | req_011CgyEBbvoZ2at4sRPoCZuz | 28.38257891 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3053 | 27934 | 320 | 0.01489280 | complete | req_011CgyEBvWWPG44zCsNiwh84 | 28.39747171 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 2902 | 27934 | 483 | 0.01622080 | complete | req_011CgyEBvndQacf7GKdg6yDu | 28.41369251 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 2745 | 27934 | 325 | 0.01432680 | complete | req_011CgyEC6DQxVYit26umx6wX | 28.42801931 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3120 | 27934 | 155 | 0.01337680 | complete | req_011CgyECBMik9UBkYmDbQwV3 | 28.44139611 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 347 | 28115 | 1285 | 0.01916700 | complete | req_011CgyECanseoDAQoVWiFhWE | 28.46056311 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 28279 | 0 | 1585 | 0.08646550 | complete | req_011CgyECX8MTcteAN19CLasT | 28.54702861 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 28115 | 1915 | 0.02508900 | complete | req_011CgyECaBQPyMtepxkP9W8y | 28.57211761 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 28115 | 1581 | 0.02214100 | complete | req_011CgyEDJJxBPG1czBksFjeu | 28.59425861 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 28115 | 1836 | 0.02431300 | complete | req_011CgyEDYq5dCa5pYm2RTAmx | 28.61857161 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 28115 | 1541 | 0.02132100 | complete | req_011CgyEECeRE9ccAi4pKBJJ8 | 28.63989261 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3952 | 28115 | 1188 | 0.02540700 | complete | req_011CgyEF9FoWQHKEGQqT7G9x | 28.66529961 |
| 2026-11-12 23:56 | AM2 P | anthropic/claude-sonnet-5-5 | 3947 | 28115 | 1395 | 0.02746700 | complete | req_011CgyEF8oGDk5vpUqEosdW4 | 28.69276661 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 2919 | 28115 | 975 | 0.02121100 | complete | req_011CgyEFhbEBi7Xmpy4N9x72 | 28.71397761 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 3357 | 28115 | 979 | 0.02212700 | complete | req_011CgyEFmZ7fWc6ghdax3q7N | 28.73610461 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 3094 | 28115 | 350 | 0.01531100 | complete | req_011CgyEGFWd8QqHguFNL7eFd | 28.75141561 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 3565 | 28115 | 693 | 0.01968300 | complete | req_011CgyEG9zjJUWTxqyV6Gf4o | 28.77109861 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 2288 | 28115 | 546 | 0.01565900 | complete | req_011CgyEGVy2B96JdgNzRgskj | 28.78675761 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 3166 | 28115 | 645 | 0.01840500 | complete | req_011CgyEGVvHuT2rN662zconh | 28.80516261 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 2466 | 28115 | 277 | 0.01332500 | complete | req_011CgyEGkoVCieZK7NnJFkqN | 28.81848761 |
| 2026-11-12 23:57 | AM2 P | anthropic/claude-sonnet-5-5 | 2967 | 28115 | 173 | 0.01328700 | complete | req_011CgyEGrqP6ZpYjS4TwGWUz | 28.83177461 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 34315 | 2176 | 0.02933100 | complete | req_011CgzC6ESN9QccFYczgPU4B | 28.86110561 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 34315 | 2444 | 0.03163100 | complete | req_011CgzC6ERs9o98Akvgr66LP | 28.89273661 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 34487 | 0 | 2702 | 0.11315150 | complete | req_011CgzC6A6gENBPqrUGZwKWy | 29.00588811 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 34315 | 1421 | 0.02173100 | complete | req_011CgzC7WSZoo7aMAPiXd7bd | 29.02761911 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 34315 | 1654 | 0.02413300 | complete | req_011CgzC7QTuAsUP3naHE45Tw | 29.05175211 |
| 2026-11-13 12:09 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 34315 | 2885 | 0.03612500 | complete | req_011CgzC8EwSMzqP2oozgp4oi | 29.08787711 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 3314 | 34315 | 660 | 0.02009100 | complete | req_011CgzCA6nrdpqaAWUdhUo4u | 29.10796811 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 2248 | 34315 | 952 | 0.02087900 | complete | req_011CgzCA79fyZrMHyRAiCiD6 | 29.12884711 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 2187 | 34315 | 614 | 0.01737700 | complete | req_011CgzCAW2qfwPYJZh97v4DM | 29.14622411 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1444 | 34315 | 213 | 0.01188100 | complete | req_011CgzCAqPfhsdEu5ijYQEcC | 29.15810511 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 2079 | 34315 | 644 | 0.01746100 | complete | req_011CgzCAkyWspdQc6fQEFDVX | 29.17556611 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1743 | 34315 | 339 | 0.01373900 | complete | req_011CgzCBC6cUVmoDPnNaPP7e | 29.18930511 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1690 | 34315 | 453 | 0.01477300 | complete | req_011CgzCBC7NBU34vNikprUbT | 29.20407811 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1225 | 34315 | 149 | 0.01080300 | complete | req_011CgzCBVxQ7EmE4dSFRFNSC | 29.21488111 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1105 | 34315 | 130 | 0.01037300 | complete | req_011CgzCBTwMgE3efv3BvbQZU | 29.22525411 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 1167 | 34315 | 226 | 0.01145700 | complete | req_011CgzCBgZNnh4NNxHdAx4qH | 29.23671111 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 33858 | 2461 | 0.03170960 | complete | req_011CgzCC4CdDiYEiHgMkhKqx | 29.26842071 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 34030 | 0 | 2767 | 0.11265900 | complete | req_011CgzCBx4ngLcedfzBcKaAL | 29.38107971 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 33858 | 2607 | 0.03354960 | complete | req_011CgzCC4BPV9Cdp7v7RtjM8 | 29.41462931 |
| 2026-11-13 12:10 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 33858 | 1494 | 0.02236960 | complete | req_011CgzCDUMUAbLpW3ReR2WCd | 29.43699891 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 33858 | 1978 | 0.02728160 | complete | req_011CgzCDJdq1BKXFBTkhFS2n | 29.46428051 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 33858 | 2061 | 0.02770960 | complete | req_011CgzCEFBV4VtPtTRNTdWgb | 29.49199011 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 2762 | 33858 | 504 | 0.01733560 | complete | req_011CgzCFb6pyaLF1TkJAaMZ9 | 29.50932571 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 3137 | 33858 | 610 | 0.01914560 | complete | req_011CgzCFbfp6onyCkg3uVomB | 29.52847131 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1521 | 33858 | 200 | 0.01181360 | complete | req_011CgzCFx5e9ydKycz9eZpMJ | 29.54028491 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1659 | 33858 | 260 | 0.01268960 | complete | req_011CgzCG37WbADGvwjiQQa98 | 29.55297451 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1183 | 33858 | 276 | 0.01189760 | complete | req_011CgzCGAAfeZtyCh2BSXbhb | 29.56487211 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1043 | 33858 | 171 | 0.01056760 | complete | req_011CgzCGEWN2GEnUGhyW6j4D | 29.57543971 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1879 | 33858 | 307 | 0.01359960 | complete | req_011CgzCGQpjWmpJ9uEdYPtKM | 29.58903931 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 1824 | 33858 | 425 | 0.01466960 | complete | req_011CgzCGQkkvuD8NqWej9g75 | 29.60370891 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 29255 | 2117 | 0.02772900 | complete | req_011CgzCGvRhwzQfPVGxMq8Bv | 29.63143791 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 29427 | 0 | 2423 | 0.09771150 | complete | req_011CgzCGqF9xH9gcPMdw3W2S | 29.72914941 |
| 2026-11-13 12:11 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 29255 | 2558 | 0.03175900 | complete | req_011CgzCGvUg8FPHJVQ1oEBUv | 29.76090841 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 29255 | 1410 | 0.02068100 | complete | req_011CgzCJ7JLWcwmVxQVw6Nxf | 29.78158941 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 29255 | 1399 | 0.02049900 | complete | req_011CgzCJFE5WByK5LQ3qggCQ | 29.80208841 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 206 | 29255 | 2746 | 0.03372300 | complete | req_011CgzCJsok71JdDEhZGacRX | 29.83581141 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 2229 | 29255 | 353 | 0.01383900 | complete | req_011CgzCLhYuaYbfw3x2h4sH5 | 29.84965041 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1772 | 29255 | 347 | 0.01286500 | complete | req_011CgzCLha9ftoq7zHytjTXN | 29.86251541 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1212 | 29255 | 150 | 0.00977500 | complete | req_011CgzCLzJipqEf5Af8eVacF | 29.87229041 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1309 | 29255 | 177 | 0.01023900 | complete | req_011CgzCLzGzUeqHuVMzmTN5S | 29.88252941 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1261 | 29255 | 165 | 0.01002300 | complete | req_011CgzCM8sBQkDEFkpbYhxdq | 29.89255241 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1222 | 29255 | 147 | 0.00976500 | complete | req_011CgzCMNTjkZPgERnwDqhuY | 29.90231741 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 1188 | 29255 | 194 | 0.01016700 | complete | req_011CgzCMNQztohjAC77VXStP | 29.91248441 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 30467 | 2314 | 0.02956140 | complete | req_011CgzCMktcSZBuDVeeyuPBe | 29.94204581 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 30639 | 0 | 2372 | 0.10023150 | complete | req_011CgzCMgKGiQv7ivGFcS5Np | 30.04227731 |
| 2026-11-13 12:12 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 30467 | 2267 | 0.02947140 | complete | req_011CgzCMmBitafuqAwpCbBBs | 30.07174871 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 365 | 30467 | 1445 | 0.02127340 | complete | req_011CgzCNudzpuQnhgEBoQmkP | 30.09302211 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 329 | 30467 | 1400 | 0.02075140 | complete | req_011CgzCNznZB9JSFsyxuzEYW | 30.11377351 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 30467 | 2019 | 0.02661140 | complete | req_011CgzCPgj92C8BXat3ZxUkz | 30.14038491 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 2689 | 30467 | 796 | 0.01943140 | complete | req_011CgzCQtnwmcxof3VTfxdgn | 30.15981631 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 3848 | 30467 | 1059 | 0.02437940 | complete | req_011CgzCQtpCLCUtycT9u4t7A | 30.18419571 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 1448 | 30467 | 272 | 0.01170940 | complete | req_011CgzCRK4hxhTEHvo5deT5W | 30.19590511 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 1414 | 30467 | 315 | 0.01207140 | complete | req_011CgzCRaLDZLoTguwCkrSwy | 30.20797651 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 2129 | 30467 | 418 | 0.01453140 | complete | req_011CgzCRaXNwBFbSr7S4tAm7 | 30.22250791 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 1158 | 30467 | 231 | 0.01071940 | complete | req_011CgzCRvWvEYQoT78FqusTY | 30.23322731 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 1074 | 30467 | 193 | 0.01017140 | complete | req_011CgzCS8UkXafw2QLAauAPp | 30.24339871 |
| 2026-11-13 12:13 | AM2 P | anthropic/claude-sonnet-5-5 | 1688 | 30467 | 332 | 0.01278940 | complete | req_011CgzCS8SmTrHuL6TcKmnzi | 30.25618811 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 27067 | 0 | 1838 | 0.08596550 | complete | req_011CgzFNtnFRo8MaPbaGNT74 | 30.34215361 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 26903 | 1796 | 0.02403660 | complete | req_011CgzFNzTp2vvXCzEvW95bT | 30.36619021 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 26903 | 2123 | 0.02692660 | complete | req_011CgzFNzSKBRNAvNMpkxr3Z | 30.39311681 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 26903 | 1239 | 0.01847660 | complete | req_011CgzFPxznh5eZTi3fAD7Qt | 30.41159341 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 26903 | 2053 | 0.02624060 | complete | req_011CgzFQ7VGAbY5ik1ZgDRPd | 30.43783401 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 26903 | 1715 | 0.02281860 | complete | req_011CgzFQe5XKhD9QmPmAbdSZ | 30.46065261 |
| 2026-11-13 12:52 | AM2 P | anthropic/claude-sonnet-5-5 | 2321 | 26903 | 461 | 0.01463260 | complete | req_011CgzFRkRne7Gn96fMkBXSY | 30.47528521 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 2932 | 26903 | 574 | 0.01698460 | complete | req_011CgzFRjwH1vuMv9GutaRTQ | 30.49226981 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1097 | 26903 | 152 | 0.00909460 | complete | req_011CgzFS4Dco9HC5sneNdRDe | 30.50136441 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 970 | 26903 | 153 | 0.00885060 | complete | req_011CgzFS9D1QdJ81wueVQcZz | 30.51021501 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1170 | 26903 | 236 | 0.01008060 | complete | req_011CgzFSDSFhxfncRR12eANB | 30.52029561 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1002 | 26903 | 179 | 0.00917460 | complete | req_011CgzFSG8DddDNQqsniQw6T | 30.52947021 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 24376 | 1349 | 0.01906120 | complete | req_011CgzFSs1hd4mfZAGyuAYG4 | 30.54853141 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 24540 | 0 | 1755 | 0.07881800 | complete | req_011CgzFSmc1HLUqmBV6zd7UN | 30.62734941 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 24376 | 2207 | 0.02726120 | complete | req_011CgzFSryiYP6vSHM7V6rAv | 30.65461061 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 24376 | 1388 | 0.01946120 | complete | req_011CgzFTf49NgjfWYxkZ3aTS | 30.67407181 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 24376 | 1694 | 0.02213120 | complete | req_011CgzFU54WzhEQL8FDCBUGb | 30.69620301 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 24376 | 1673 | 0.02189320 | complete | req_011CgzFUWx18q32wrERJsh5B | 30.71809621 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1533 | 24376 | 299 | 0.01093120 | complete | req_011CgzFVbwBD1CMpce1kGDS5 | 30.72902741 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 2038 | 24376 | 402 | 0.01297120 | complete | req_011CgzFVbaqVfRD9HjDfhbUq | 30.74199861 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1017 | 24376 | 137 | 0.00827920 | complete | req_011CgzFVqfv2TTUJQ8hLv3fv | 30.75027781 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 1601 | 24376 | 281 | 0.01088720 | complete | req_011CgzFVndMQdKmzqcheNZYt | 30.76116501 |
| 2026-11-13 12:53 | AM2 P | anthropic/claude-sonnet-5-5 | 984 | 24376 | 128 | 0.00812320 | complete | req_011CgzFW7J1dxVpcpdJh8nTd | 30.76928821 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 348 | 25791 | 1730 | 0.02315420 | complete | req_011CgzFWV8S5r4n9MfreyN7o | 30.79244241 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 25955 | 0 | 1845 | 0.08325550 | complete | req_011CgzFWP34jhX6hm3bgMtS3 | 30.87569791 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 25791 | 2101 | 0.02648420 | complete | req_011CgzFWVFdAfSsnmmTDkAJ6 | 30.90218211 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 353 | 25791 | 1268 | 0.01854420 | complete | req_011CgzFXTUzSFzLfk1A5ZGHH | 30.92072631 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 25791 | 2122 | 0.02670820 | complete | req_011CgzFXcZRjTHFBxeyvGAoM | 30.94743451 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 25791 | 1668 | 0.02212620 | complete | req_011CgzFYH4SxBSShrYSaGntg | 30.96956071 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 2925 | 25791 | 664 | 0.01764820 | complete | req_011CgzFZQYg1GyCEZzB9juYU | 30.98720891 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 2945 | 25791 | 676 | 0.01780820 | complete | req_011CgzFZQyUQaVEkbrrxfDM5 | 31.00501711 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 1863 | 25791 | 471 | 0.01359420 | complete | req_011CgzFZuNXYwUqdrA6QZccs | 31.01861131 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 2071 | 25791 | 699 | 0.01629020 | complete | req_011CgzFZqAGvw5rvbhjjjEHF | 31.03490151 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 1805 | 25791 | 261 | 0.01137820 | complete | req_011CgzFaCeaza2pLLEM43y4b | 31.04627971 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 1719 | 25791 | 334 | 0.01193620 | complete | req_011CgzFaGHrw26ADyB4RYGw6 | 31.05821591 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 1100 | 25791 | 207 | 0.00942820 | complete | req_011CgzFaXhZnYFPBt6uV2KWG | 31.06764411 |
| 2026-11-13 12:54 | AM2 P | anthropic/claude-sonnet-5-5 | 1478 | 25791 | 345 | 0.01156420 | complete | req_011CgzFaXsVL4zzNAwQaYVKr | 31.07920831 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 347 | 25377 | 1344 | 0.01920940 | complete | req_011CgzFbAFm9m2AqckMyx5Td | 31.09841771 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 25541 | 0 | 1652 | 0.08029050 | complete | req_011CgzFb6bEiMzN1LAtMBG7m | 31.17870821 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 158 | 25377 | 1967 | 0.02506140 | complete | req_011CgzFbAE2SyzA5LgLT1eHg | 31.20376961 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 354 | 25377 | 1548 | 0.02126340 | complete | req_011CgzFbu1FX3FLBddXSQ1bc | 31.22503301 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 165 | 25377 | 1985 | 0.02525540 | complete | req_011CgzFcFWYMvhz9g8pJs2AN | 31.25028841 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 144 | 25377 | 1647 | 0.02183340 | complete | req_011CgzFcnrwxdTHxG48YgHND | 31.27212181 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 2957 | 25377 | 527 | 0.01625940 | complete | req_011CgzFdqah1hP2Bgy7r9rpw | 31.28838121 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 3442 | 25377 | 830 | 0.02025940 | complete | req_011CgzFdr8vHpA983tc7BVuU | 31.30864061 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1925 | 25377 | 473 | 0.01365540 | complete | req_011CgzFeC9wBnZj1MMmUFRxs | 31.32229601 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1350 | 25377 | 133 | 0.00910540 | complete | req_011CgzFeNCgHZVfaH6ayb5Cg | 31.33140141 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1131 | 25377 | 183 | 0.00916740 | complete | req_011CgzFeXbEWU1qSgR15zAqP | 31.34056881 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1053 | 25377 | 182 | 0.00900140 | complete | req_011CgzFeY9idt8CS676trh4g | 31.34957021 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1217 | 25377 | 122 | 0.00872940 | complete | req_011CgzFekEzpBqVLZ11A67cF | 31.35829961 |
| 2026-11-13 12:55 | AM2 P | anthropic/claude-sonnet-5-5 | 1133 | 25377 | 178 | 0.00912140 | complete | req_011CgzFekEjc6qX6Lo6WaiUU | 31.36742101 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 807 | 31963 | 2255 | 0.03055660 | complete | req_011CgzhjmpfMuUUcmtiH8CmV | 31.39797761 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 31963 | 2502 | 0.03174060 | complete | req_011CgzhjmtsfV92jQ122DiaW | 31.42971821 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 33078 | 0 | 2919 | 0.11132750 | complete | req_011Cgzhjffaeio2kmBmd8fR3 | 31.54104571 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 703 | 31963 | 1596 | 0.02375860 | complete | req_011Cgzhm1zE6AWsB9w48G9R4 | 31.56480431 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 772 | 31963 | 1550 | 0.02343660 | complete | req_011Cgzhm5qttKjawi6fmoAC2 | 31.58824091 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 767 | 31963 | 2580 | 0.03372660 | complete | req_011CgzhmsQpYUbUE1TEnec9J | 31.62196751 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 3013 | 31963 | 531 | 0.01772860 | complete | req_011CgzhoSeqtW5MDV1tUE9wo | 31.63969611 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 3991 | 31963 | 733 | 0.02170460 | complete | req_011CgzhoS5NXVca67FL5Nwx8 | 31.66140071 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 2493 | 31963 | 334 | 0.01471860 | complete | req_011CgzhorJPnPMZjmUfb8g8r | 31.67611931 |
| 2026-11-13 18:38 | AM2 P | anthropic/claude-sonnet-5-5 | 2670 | 31963 | 385 | 0.01558260 | complete | req_011Cgzhp3gGSWtfwFAJ7StNt | 31.69170191 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 1848 | 31963 | 347 | 0.01355860 | complete | req_011CgzhpCutB8nM4sE8QRYj9 | 31.70526051 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 1722 | 31963 | 140 | 0.01123660 | complete | req_011CgzhpJTzuQw8QP4DhHdXM | 31.71649711 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 2053 | 31963 | 186 | 0.01235860 | complete | req_011Cgzhpab7xmbNK3RsUjnkb | 31.72885571 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 1812 | 31963 | 199 | 0.01200660 | complete | req_011CgzhpaLV5Q45YxZV8NFvL | 31.74086231 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 998 | 31963 | 1542 | 0.02380860 | complete | req_011CgzhptZr4uDtkQ2tjtvMh | 31.76467091 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 2625 | 31963 | 338 | 0.01502260 | complete | req_011CgzhqsoF2o5pFCdwUpS89 | 31.77969351 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 29193 | 0 | 2457 | 0.09705250 | complete | req_011CgzhrB552C9xxEW5e6oYw | 31.87674601 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 164 | 28193 | 2482 | 0.03078660 | complete | req_011CgzhrFHKoPecVeVdvqc3o | 31.90753261 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 801 | 28193 | 2657 | 0.03381060 | complete | req_011CgzhrFFacXwsZjnMNLdGG | 31.94134321 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 667 | 28193 | 1388 | 0.02085260 | complete | req_011CgzhsgkHo4XJVv5HxuY3C | 31.96219581 |
| 2026-11-13 18:39 | AM2 P | anthropic/claude-sonnet-5-5 | 896 | 28193 | 1647 | 0.02390060 | complete | req_011CgzhsZBsZu88XYofz995s | 31.98609641 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 727 | 28193 | 1870 | 0.02579260 | complete | req_011CgzhtUXMTsLgPV5QiXB7d | 32.01188901 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1722 | 28193 | 354 | 0.01262260 | complete | req_011CgzhumgkVxqcfZV9GqoiQ | 32.02451161 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 4084 | 28193 | 606 | 0.01986660 | complete | req_011Cgzhummhya35f5uo3gxUZ | 32.04437821 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 2758 | 28193 | 438 | 0.01553460 | complete | req_011Cgzhv75577P8bngaTwePW | 32.05991281 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 2346 | 28193 | 352 | 0.01385060 | complete | req_011CgzhvJmXRTabcRt6REv9y | 32.07376341 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1985 | 28193 | 226 | 0.01186860 | complete | req_011CgzhvTo1XrcvjygEGbEvG | 32.08563201 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1745 | 28193 | 237 | 0.01149860 | complete | req_011CgzhvbQtd9KcXcBxyKjrh | 32.09713061 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1923 | 28193 | 186 | 0.01134460 | complete | req_011Cgzhvps22sHqgEt5LAQ4R | 32.10847521 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1816 | 28193 | 191 | 0.01118060 | complete | req_011CgzhvpvkDYjoPKELbRBX5 | 32.11965581 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1089 | 28193 | 173 | 0.00954660 | complete | req_011Cgzhw21VVHdwEU7TA6B9U | 32.12920241 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1582 | 28193 | 219 | 0.01099260 | complete | req_011Cgzhw3tbe4xFUZviggEiQ | 32.14019501 |
| 2026-11-13 18:40 | AM2 P | anthropic/claude-sonnet-5-5 | 1045 | 28193 | 2513 | 0.03285860 | complete | req_011CgzhwM6Cu4mjyjGwKY96y | 32.17305361 |
누적 합계: **$32.17305361** (P0-2 점검 상한 $0.10, 개발 총 상한 $8)

메모
- 2026-11-05 최종판3(출시 전 마지막) 시작: 콘솔 시작 잔액 **$94.33**(덕짱님 지시값). 범위 `final3` 상한 $4.00(측정·생성 포함), 이 표 누적 $9.82159355에서 시작.
- 2026-11-05 최종판3 마감: 이 표 누적 $9.82159355 → **$12.37413640**, 범위 `final3` 실제 **$2.55254**(원장 $2.5632 = 실제 + 정산 안 된 pending 예약 1건 $0.0107). 잔액 예상 약 $91.78(콘솔 확인 전).
  - 내역: 검수 측정 Haiku 4회분·Sonnet 2회분 $1.6056 · 발행 흐름 재생 $0.0401 · 결제 경로 4권 $0.85065(작가 4·검수 4·수리 4) · 판정 고침 4회 $0.02458 · 워커 경로 재생 $0.03163.
  - 헛쓴 비용: ① Haiku 첫 측정 17회 $0.0863 — 생각(기본 effort medium)이 출력 상한 6,000을 다 써 글자 0(length). 이후 effort low + 상한 32,000, 44회 length 0. ② 워커 경로 재생 두 번째 실행 검수 $0.0043 — 도구가 관문 캐시를 안 물려 같은 입력을 다시 부름(고침).
- `GET /v1/models`(무료)에 나오는 모델이라도 deprecated일 수 있다(gpt-4.1-nano는 목록에 있었지만 404). 새 모델은 호출 전에 최소 호출로 확인한다.
- 추론 모델(gpt-5-nano 등)은 출력 상한 안에서 추론에 토큰을 쓸 수 있어 배관 검증에는 비추론 모델이 안전하다.
