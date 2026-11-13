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
누적 합계: **$16.09812830** (P0-2 점검 상한 $0.10, 개발 총 상한 $8)

메모
- 2026-11-05 최종판3(출시 전 마지막) 시작: 콘솔 시작 잔액 **$94.33**(덕짱님 지시값). 범위 `final3` 상한 $4.00(측정·생성 포함), 이 표 누적 $9.82159355에서 시작.
- 2026-11-05 최종판3 마감: 이 표 누적 $9.82159355 → **$12.37413640**, 범위 `final3` 실제 **$2.55254**(원장 $2.5632 = 실제 + 정산 안 된 pending 예약 1건 $0.0107). 잔액 예상 약 $91.78(콘솔 확인 전).
  - 내역: 검수 측정 Haiku 4회분·Sonnet 2회분 $1.6056 · 발행 흐름 재생 $0.0401 · 결제 경로 4권 $0.85065(작가 4·검수 4·수리 4) · 판정 고침 4회 $0.02458 · 워커 경로 재생 $0.03163.
  - 헛쓴 비용: ① Haiku 첫 측정 17회 $0.0863 — 생각(기본 effort medium)이 출력 상한 6,000을 다 써 글자 0(length). 이후 effort low + 상한 32,000, 44회 length 0. ② 워커 경로 재생 두 번째 실행 검수 $0.0043 — 도구가 관문 캐시를 안 물려 같은 입력을 다시 부름(고침).
- `GET /v1/models`(무료)에 나오는 모델이라도 deprecated일 수 있다(gpt-4.1-nano는 목록에 있었지만 404). 새 모델은 호출 전에 최소 호출로 확인한다.
- 추론 모델(gpt-5-nano 등)은 출력 상한 안에서 추론에 토큰을 쓸 수 있어 배관 검증에는 비추론 모델이 안전하다.
