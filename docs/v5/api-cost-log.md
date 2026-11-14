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
