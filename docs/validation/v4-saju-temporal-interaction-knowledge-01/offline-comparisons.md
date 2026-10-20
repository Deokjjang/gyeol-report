# 실제 오프라인 기간 사례

평가 시각 2026-10-12 12:00 KST. 운영 DB·결제·외부 원고 API 사용 없음. 원본 관찰은 tests/fixtures/temporal-interaction-01/offline-periods.json에 고정했다. B 계산과 D 질문은 별도 필드다.

## 14년 배열

| 사례/일간 | 연도 | 대운/십성 | 세운/십성 | 운-세운 | 원국-세운 |
|---|---|---|---|---|---|
| A/庚 | 2023 | 戊寅/편인 | 癸卯/상관 | 없음 | 파卯午 month / 형子卯 day |
| A/庚 | 2024 | 戊寅/편인 | 甲辰/편재 | 없음 | 반합辰子 day / 파丑辰 year / 해卯辰 hour |
| A/庚 | 2025 | 戊寅/편인 | 乙巳/정재 | 해寅巳  / 형寅巳  | 반합巳丑 year |
| A/庚 | 2026 | 戊寅/편인 | 丙午/편관 | 반합午寅  | 해丑午 year / 형午午 month / 충子午 day / 파卯午 hour |
| A/庚 | 2027 | 戊寅/편인 | 丁未/정관 | 없음 | 반합未卯 hour / 충丑未 year / 형未丑 year / 육합午未 month / 해子未 day |
| A/庚 | 2028 | 戊寅/편인 | 戊申/편인 | 충寅申  / 형申寅  | 반합申子 day |
| A/庚 | 2029 | 戊寅/편인 | 己酉/정인 | 없음 | 반합酉丑 year / 파子酉 day / 충卯酉 hour |
| A/庚 | 2030 | 戊寅/편인 | 庚戌/비견 | 반합戌寅  | 반합戌午 month / 형丑戌 year / 육합卯戌 hour |
| A/庚 | 2031 | 戊寅/편인 | 辛亥/겁재 | 육합寅亥  / 파寅亥  | 반합亥卯 hour |
| A/庚 | 2032 | 戊寅/편인 | 壬子/식신 | 없음 | 육합子丑 year / 충子午 month / 형子卯 hour |
| A/庚 | 2033 | 丁丑/정관 | 癸丑/상관 | 없음 | 해丑午 month / 육합子丑 day |
| A/庚 | 2034 | 丁丑/정관 | 甲寅/편재 | 없음 | 반합寅午 month |
| A/庚 | 2035 | 丁丑/정관 | 乙卯/정재 | 없음 | 파卯午 month / 형子卯 day |
| A/庚 | 2036 | 丁丑/정관 | 丙辰/편관 | 파丑辰  | 반합辰子 day / 파丑辰 year / 해卯辰 hour |
| B/甲 | 2023 | 庚辰/편관 | 癸卯/정인 | 해卯辰  | 반합卯未 month,hour / 파卯午 year |
| B/甲 | 2024 | 己卯/정재 | 甲辰/비견 | 해卯辰  | 반합辰申 day / 해卯辰 hour |
| B/甲 | 2025 | 己卯/정재 | 乙巳/겁재 | 없음 | 육합巳申 day / 형巳申 day / 파巳申 day |
| B/甲 | 2026 | 己卯/정재 | 丙午/식신 | 파卯午  | 형午午 year / 육합午未 month / 파卯午 hour |
| B/甲 | 2027 | 己卯/정재 | 丁未/상관 | 반합未卯  | 반합未卯 month,hour / 육합午未 year |
| B/甲 | 2028 | 己卯/정재 | 戊申/편재 | 없음 | 없음 |
| B/甲 | 2029 | 己卯/정재 | 己酉/정재 | 충卯酉  | 충卯酉 hour |
| B/甲 | 2030 | 己卯/정재 | 庚戌/편관 | 육합卯戌  | 반합戌午 year / 형戌未 month / 파未戌 month / 육합卯戌 hour |
| B/甲 | 2031 | 己卯/정재 | 辛亥/정관 | 반합亥卯  | 삼합亥卯未 month,hour / 해申亥 day |
| B/甲 | 2032 | 己卯/정재 | 壬子/편인 | 형子卯  | 반합子申 day / 충子午 year / 해子未 month / 형子卯 hour |
| B/甲 | 2033 | 己卯/정재 | 癸丑/정인 | 없음 | 해丑午 year / 충丑未 month / 형未丑 month |
| B/甲 | 2034 | 戊寅/편재 | 甲寅/비견 | 없음 | 반합寅午 year / 충寅申 day / 형申寅 day |
| B/甲 | 2035 | 戊寅/편재 | 乙卯/겁재 | 없음 | 반합卯未 month,hour / 파卯午 year |
| B/甲 | 2036 | 戊寅/편재 | 丙辰/식신 | 없음 | 반합辰申 day / 해卯辰 hour |
| C/戊 | 2023 | 壬申/편재 | 癸卯/정재 | 없음 | 반합卯亥 month / 육합卯戌 year / 해卯辰 hour |
| C/戊 | 2024 | 壬申/편재 | 甲辰/편관 | 반합辰申  | 반합辰申 day,hour / 충辰戌 year / 형辰辰 hour |
| C/戊 | 2025 | 壬申/편재 | 乙巳/정관 | 육합巳申  / 형巳申  / 파巳申  | 충巳亥 month / 육합巳申 day / 형巳申 day / 파巳申 day |
| C/戊 | 2026 | 壬申/편재 | 丙午/편인 | 없음 | 반합午戌 year |
| C/戊 | 2027 | 壬申/편재 | 丁未/정인 | 없음 | 반합未亥 month / 형戌未 year / 파未戌 year |
| C/戊 | 2028 | 辛未/상관 | 戊申/비견 | 없음 | 반합申辰 day,hour / 해申亥 month |
| C/戊 | 2029 | 辛未/상관 | 己酉/겁재 | 없음 | 해酉戌 year / 육합辰酉 hour |
| C/戊 | 2030 | 辛未/상관 | 庚戌/식신 | 형戌未  / 파未戌  | 충辰戌 hour |
| C/戊 | 2031 | 辛未/상관 | 辛亥/상관 | 반합亥未  | 형亥亥 month / 해申亥 day |
| C/戊 | 2032 | 辛未/상관 | 壬子/편재 | 해子未  | 삼합申子辰 day,hour |
| C/戊 | 2033 | 辛未/상관 | 癸丑/정재 | 충丑未  / 형未丑  | 형丑戌 year / 파丑辰 hour |
| C/戊 | 2034 | 辛未/상관 | 甲寅/편관 | 없음 | 반합寅戌 year / 육합寅亥 month / 파寅亥 month / 충寅申 day / 형申寅 day |
| C/戊 | 2035 | 辛未/상관 | 乙卯/정관 | 반합卯未  | 반합卯亥 month / 육합卯戌 year / 해卯辰 hour |
| C/戊 | 2036 | 辛未/상관 | 丙辰/편인 | 없음 | 반합辰申 day,hour / 충辰戌 year / 형辰辰 hour |

같은 고정 평가시각이므로 세 사례의 연도 라벨은 모두 2023–2036이다. 달라지는 것은 실제 운·십성·원국 접점이며 날짜를 억지로 바꾸지 않았다. 전환 연도의 row는 단일 명목 cycle reading이다. 실제 전후 관계까지 모두 계산했다는 뜻이 아니다.

## 12개월 구간

| 사례 | 달 | 구간 시작 | 월주/간·본기 십성 | 실효 연주 | 활성 운 | source별 관계 |
|---|---|---|---|---|---|---|
| A | 1 | 2026-01-01T00:00:00+09:00 | 戊子/편인·상관 | 乙巳 | 戊寅 | month_natal_branch: 육합子丑,충子午,형子卯 |
| A | 1 | 2026-01-05T17:23:10+09:00 | 己丑/정인·정인 | 乙巳 | 戊寅 | month_natal_branch: 해丑午,육합子丑 / month_annual_branch: 반합巳丑 |
| A | 2 | 2026-02-01T00:00:00+09:00 | 己丑/정인·정인 | 乙巳 | 戊寅 | month_natal_branch: 해丑午,육합子丑 / month_annual_branch: 반합巳丑 |
| A | 2 | 2026-02-04T05:02:08+09:00 | 庚寅/비견·편재 | 丙午 | 戊寅 | month_natal_branch: 반합寅午 / month_natal_element: missing_element_present / month_annual_branch: 반합寅午 |
| A | 3 | 2026-03-01T00:00:00+09:00 | 庚寅/비견·편재 | 丙午 | 戊寅 | month_natal_branch: 반합寅午 / month_natal_element: missing_element_present / month_annual_branch: 반합寅午 |
| A | 3 | 2026-03-05T22:59:00+09:00 | 辛卯/겁재·정재 | 丙午 | 戊寅 | month_natal_branch: 파卯午,형子卯 / month_natal_element: missing_element_present / month_annual_branch: 파卯午 |
| A | 4 | 2026-04-01T00:00:00+09:00 | 辛卯/겁재·정재 | 丙午 | 戊寅 | month_natal_branch: 파卯午,형子卯 / month_natal_element: missing_element_present / month_annual_branch: 파卯午 |
| A | 4 | 2026-04-05T03:40:00+09:00 | 壬辰/식신·편인 | 丙午 | 戊寅 | month_natal_branch: 반합辰子,파丑辰,해卯辰 |
| A | 5 | 2026-05-01T00:00:00+09:00 | 壬辰/식신·편인 | 丙午 | 戊寅 | month_natal_branch: 반합辰子,파丑辰,해卯辰 |
| A | 5 | 2026-05-05T20:48:44+09:00 | 癸巳/상관·편관 | 丙午 | 戊寅 | month_natal_branch: 반합巳丑 / month_dayun_branch: 해寅巳,형寅巳 |
| A | 6 | 2026-06-01T00:00:00+09:00 | 癸巳/상관·편관 | 丙午 | 戊寅 | month_natal_branch: 반합巳丑 / month_dayun_branch: 해寅巳,형寅巳 |
| A | 6 | 2026-06-06T00:48:21+09:00 | 甲午/편재·정관 | 丙午 | 戊寅 | month_natal_branch: 해丑午,형午午,충子午,파卯午 / month_annual_branch: 형午午 / month_dayun_branch: 반합寅午 |
| A | 7 | 2026-07-01T00:00:00+09:00 | 甲午/편재·정관 | 丙午 | 戊寅 | month_natal_branch: 해丑午,형午午,충子午,파卯午 / month_annual_branch: 형午午 / month_dayun_branch: 반합寅午 |
| A | 7 | 2026-07-07T10:56:57+09:00 | 乙未/정재·정인 | 丙午 | 戊寅 | month_natal_branch: 반합未卯,충丑未,형未丑,육합午未,해子未 / month_annual_branch: 육합午未 |
| A | 8 | 2026-08-01T00:00:00+09:00 | 乙未/정재·정인 | 丙午 | 戊寅 | month_natal_branch: 반합未卯,충丑未,형未丑,육합午未,해子未 / month_annual_branch: 육합午未 |
| A | 8 | 2026-08-07T20:42:43+09:00 | 丙申/편관·비견 | 丙午 | 戊寅 | month_natal_branch: 반합申子 / month_natal_element: missing_element_present / month_dayun_branch: 충寅申,형申寅 |
| A | 9 | 2026-09-01T00:00:00+09:00 | 丙申/편관·비견 | 丙午 | 戊寅 | month_natal_branch: 반합申子 / month_natal_element: missing_element_present / month_dayun_branch: 충寅申,형申寅 |
| A | 9 | 2026-09-07T23:41:16+09:00 | 丁酉/정관·겁재 | 丙午 | 戊寅 | month_natal_branch: 반합酉丑,파子酉,충卯酉 / month_natal_element: missing_element_present |
| A | 10 | 2026-10-01T00:00:00+09:00 | 丁酉/정관·겁재 | 丙午 | 戊寅 | month_natal_branch: 반합酉丑,파子酉,충卯酉 / month_natal_element: missing_element_present |
| A | 10 | 2026-10-08T15:29:17+09:00 | 戊戌/편인·편인 | 丙午 | 戊寅 | month_natal_branch: 반합戌午,형丑戌,육합卯戌 / month_annual_branch: 반합午戌 / month_dayun_branch: 반합寅戌 |
| A | 11 | 2026-11-01T00:00:00+09:00 | 戊戌/편인·편인 | 丙午 | 戊寅 | month_natal_branch: 반합戌午,형丑戌,육합卯戌 / month_annual_branch: 반합午戌 / month_dayun_branch: 반합寅戌 |
| A | 11 | 2026-11-07T18:52:05+09:00 | 己亥/정인·식신 | 丙午 | 戊寅 | month_natal_branch: 반합亥卯 / month_dayun_branch: 육합寅亥,파寅亥 |
| A | 12 | 2026-12-01T00:00:00+09:00 | 己亥/정인·식신 | 丙午 | 戊寅 | month_natal_branch: 반합亥卯 / month_dayun_branch: 육합寅亥,파寅亥 |
| A | 12 | 2026-12-07T11:52:32+09:00 | 庚子/비견·상관 | 丙午 | 戊寅 | month_natal_branch: 육합子丑,충子午,형子卯 / month_natal_element: missing_element_present / month_annual_branch: 충子午 |
| B | 1 | 2026-01-01T00:00:00+09:00 | 戊子/편재·정인 | 乙巳 | 己卯 | month_natal_branch: 반합子申,충子午,해子未,형子卯 / month_natal_element: missing_element_present / month_dayun_branch: 형子卯 |
| B | 1 | 2026-01-05T17:23:10+09:00 | 己丑/정재·정재 | 乙巳 | 己卯 | month_natal_branch: 해丑午,충丑未,형未丑 / month_annual_branch: 반합巳丑 |
| B | 2 | 2026-02-01T00:00:00+09:00 | 己丑/정재·정재 | 乙巳 | 己卯 | month_natal_branch: 해丑午,충丑未,형未丑 / month_annual_branch: 반합巳丑 |
| B | 2 | 2026-02-04T05:02:08+09:00 | 庚寅/편관·비견 | 丙午 | 己卯 | month_natal_branch: 반합寅午,충寅申,형申寅 / month_annual_branch: 반합寅午 |
| B | 3 | 2026-03-01T00:00:00+09:00 | 庚寅/편관·비견 | 丙午 | 己卯 | month_natal_branch: 반합寅午,충寅申,형申寅 / month_annual_branch: 반합寅午 |
| B | 3 | 2026-03-05T22:59:00+09:00 | 辛卯/정관·겁재 | 丙午 | 己卯 | month_natal_branch: 반합卯未,파卯午 / month_annual_branch: 파卯午 |
| B | 4 | 2026-04-01T00:00:00+09:00 | 辛卯/정관·겁재 | 丙午 | 己卯 | month_natal_branch: 반합卯未,파卯午 / month_annual_branch: 파卯午 |
| B | 4 | 2026-04-05T03:40:00+09:00 | 壬辰/편인·편재 | 丙午 | 己卯 | month_natal_branch: 반합辰申,해卯辰 / month_natal_element: missing_element_present / month_dayun_branch: 해卯辰 |
| B | 5 | 2026-05-01T00:00:00+09:00 | 壬辰/편인·편재 | 丙午 | 己卯 | month_natal_branch: 반합辰申,해卯辰 / month_natal_element: missing_element_present / month_dayun_branch: 해卯辰 |
| B | 5 | 2026-05-05T20:48:44+09:00 | 癸巳/정인·식신 | 丙午 | 己卯 | month_natal_branch: 육합巳申,형巳申,파巳申 / month_natal_element: missing_element_present |
| B | 6 | 2026-06-01T00:00:00+09:00 | 癸巳/정인·식신 | 丙午 | 己卯 | month_natal_branch: 육합巳申,형巳申,파巳申 / month_natal_element: missing_element_present |
| B | 6 | 2026-06-06T00:48:21+09:00 | 甲午/비견·상관 | 丙午 | 己卯 | month_natal_branch: 형午午,육합午未,파卯午 / month_annual_branch: 형午午 / month_dayun_branch: 파卯午 |
| B | 7 | 2026-07-01T00:00:00+09:00 | 甲午/비견·상관 | 丙午 | 己卯 | month_natal_branch: 형午午,육합午未,파卯午 / month_annual_branch: 형午午 / month_dayun_branch: 파卯午 |
| B | 7 | 2026-07-07T10:56:57+09:00 | 乙未/겁재·정재 | 丙午 | 己卯 | month_natal_branch: 반합未卯,육합午未 / month_annual_branch: 육합午未 / month_dayun_branch: 반합卯未 |
| B | 8 | 2026-08-01T00:00:00+09:00 | 乙未/겁재·정재 | 丙午 | 己卯 | month_natal_branch: 반합未卯,육합午未 / month_annual_branch: 육합午未 / month_dayun_branch: 반합卯未 |
| B | 8 | 2026-08-07T20:42:43+09:00 | 丙申/식신·편관 | 丙午 | 己卯 |  |
| B | 9 | 2026-09-01T00:00:00+09:00 | 丙申/식신·편관 | 丙午 | 己卯 |  |
| B | 9 | 2026-09-07T23:41:16+09:00 | 丁酉/상관·정관 | 丙午 | 己卯 | month_natal_branch: 충卯酉 / month_dayun_branch: 충卯酉 |
| B | 10 | 2026-10-01T00:00:00+09:00 | 丁酉/상관·정관 | 丙午 | 己卯 | month_natal_branch: 충卯酉 / month_dayun_branch: 충卯酉 |
| B | 10 | 2026-10-08T15:29:17+09:00 | 戊戌/편재·편재 | 丙午 | 己卯 | month_natal_branch: 반합戌午,형戌未,파未戌,육합卯戌 / month_annual_branch: 반합午戌 / month_dayun_branch: 육합卯戌 |
| B | 11 | 2026-11-01T00:00:00+09:00 | 戊戌/편재·편재 | 丙午 | 己卯 | month_natal_branch: 반합戌午,형戌未,파未戌,육합卯戌 / month_annual_branch: 반합午戌 / month_dayun_branch: 육합卯戌 |
| B | 11 | 2026-11-07T18:52:05+09:00 | 己亥/정재·편인 | 丙午 | 己卯 | month_natal_branch: 삼합亥卯未,해申亥 / month_natal_element: missing_element_present / month_dayun_branch: 반합亥卯 |
| B | 12 | 2026-12-01T00:00:00+09:00 | 己亥/정재·편인 | 丙午 | 己卯 | month_natal_branch: 삼합亥卯未,해申亥 / month_natal_element: missing_element_present / month_dayun_branch: 반합亥卯 |
| B | 12 | 2026-12-07T11:52:32+09:00 | 庚子/편관·정인 | 丙午 | 己卯 | month_natal_branch: 반합子申,충子午,해子未,형子卯 / month_natal_element: missing_element_present / month_annual_branch: 충子午 / month_dayun_branch: 형子卯 |
| C | 1 | 2026-01-01T00:00:00+09:00 | 戊子/비견·정재 | 乙巳 | 壬申 | month_natal_branch: 삼합申子辰 / month_natal_element: heavy_element_present / month_dayun_branch: 반합申子 |
| C | 1 | 2026-01-05T17:23:10+09:00 | 己丑/겁재·겁재 | 乙巳 | 壬申 | month_natal_branch: 형丑戌,파丑辰 / month_natal_element: heavy_element_present / month_annual_branch: 반합巳丑 |
| C | 2 | 2026-02-01T00:00:00+09:00 | 己丑/겁재·겁재 | 乙巳 | 壬申 | month_natal_branch: 형丑戌,파丑辰 / month_natal_element: heavy_element_present / month_annual_branch: 반합巳丑 |
| C | 2 | 2026-02-04T05:02:08+09:00 | 庚寅/식신·편관 | 丙午 | 壬申 | month_natal_branch: 반합寅戌,육합寅亥,파寅亥,충寅申,형申寅 / month_annual_branch: 반합寅午 / month_dayun_branch: 충寅申,형申寅 |
| C | 3 | 2026-03-01T00:00:00+09:00 | 庚寅/식신·편관 | 丙午 | 壬申 | month_natal_branch: 반합寅戌,육합寅亥,파寅亥,충寅申,형申寅 / month_annual_branch: 반합寅午 / month_dayun_branch: 충寅申,형申寅 |
| C | 3 | 2026-03-05T22:59:00+09:00 | 辛卯/상관·정관 | 丙午 | 壬申 | month_natal_branch: 반합卯亥,육합卯戌,해卯辰 / month_annual_branch: 파卯午 |
| C | 4 | 2026-04-01T00:00:00+09:00 | 辛卯/상관·정관 | 丙午 | 壬申 | month_natal_branch: 반합卯亥,육합卯戌,해卯辰 / month_annual_branch: 파卯午 |
| C | 4 | 2026-04-05T03:40:00+09:00 | 壬辰/편재·비견 | 丙午 | 壬申 | month_natal_branch: 반합辰申,충辰戌,형辰辰 / month_natal_element: heavy_element_present / month_dayun_branch: 반합申辰 |
| C | 5 | 2026-05-01T00:00:00+09:00 | 壬辰/편재·비견 | 丙午 | 壬申 | month_natal_branch: 반합辰申,충辰戌,형辰辰 / month_natal_element: heavy_element_present / month_dayun_branch: 반합申辰 |
| C | 5 | 2026-05-05T20:48:44+09:00 | 癸巳/정재·편인 | 丙午 | 壬申 | month_natal_branch: 충巳亥,육합巳申,형巳申,파巳申 / month_natal_element: missing_element_present,heavy_element_generated / month_dayun_branch: 육합巳申,형巳申,파巳申 |
| C | 6 | 2026-06-01T00:00:00+09:00 | 癸巳/정재·편인 | 丙午 | 壬申 | month_natal_branch: 충巳亥,육합巳申,형巳申,파巳申 / month_natal_element: missing_element_present,heavy_element_generated / month_dayun_branch: 육합巳申,형巳申,파巳申 |
| C | 6 | 2026-06-06T00:48:21+09:00 | 甲午/편관·정인 | 丙午 | 壬申 | month_natal_branch: 반합午戌 / month_natal_element: missing_element_present,heavy_element_generated / month_annual_branch: 형午午 |
| C | 7 | 2026-07-01T00:00:00+09:00 | 甲午/편관·정인 | 丙午 | 壬申 | month_natal_branch: 반합午戌 / month_natal_element: missing_element_present,heavy_element_generated / month_annual_branch: 형午午 |
| C | 7 | 2026-07-07T10:56:57+09:00 | 乙未/정관·겁재 | 丙午 | 壬申 | month_natal_branch: 반합未亥,형戌未,파未戌 / month_natal_element: heavy_element_present / month_annual_branch: 육합午未 |
| C | 8 | 2026-08-01T00:00:00+09:00 | 乙未/정관·겁재 | 丙午 | 壬申 | month_natal_branch: 반합未亥,형戌未,파未戌 / month_natal_element: heavy_element_present / month_annual_branch: 육합午未 |
| C | 8 | 2026-08-07T20:42:43+09:00 | 丙申/편인·식신 | 丙午 | 壬申 | month_natal_branch: 반합申辰,해申亥 / month_natal_element: missing_element_present,heavy_element_generated |
| C | 9 | 2026-09-01T00:00:00+09:00 | 丙申/편인·식신 | 丙午 | 壬申 | month_natal_branch: 반합申辰,해申亥 / month_natal_element: missing_element_present,heavy_element_generated |
| C | 9 | 2026-09-07T23:41:16+09:00 | 丁酉/정인·상관 | 丙午 | 壬申 | month_natal_branch: 해酉戌,육합辰酉 / month_natal_element: missing_element_present,heavy_element_generated |
| C | 10 | 2026-10-01T00:00:00+09:00 | 丁酉/정인·상관 | 丙午 | 壬申 | month_natal_branch: 해酉戌,육합辰酉 / month_natal_element: missing_element_present,heavy_element_generated |
| C | 10 | 2026-10-08T15:29:17+09:00 | 戊戌/비견·비견 | 丙午 | 壬申 | month_natal_branch: 충辰戌 / month_natal_element: heavy_element_present / month_annual_branch: 반합午戌 |
| C | 11 | 2026-11-01T00:00:00+09:00 | 戊戌/비견·비견 | 丙午 | 壬申 | month_natal_branch: 충辰戌 / month_natal_element: heavy_element_present / month_annual_branch: 반합午戌 |
| C | 11 | 2026-11-07T18:52:05+09:00 | 己亥/겁재·편재 | 丙午 | 壬申 | month_natal_branch: 형亥亥,해申亥 / month_natal_element: heavy_element_present / month_dayun_branch: 해申亥 |
| C | 12 | 2026-12-01T00:00:00+09:00 | 己亥/겁재·편재 | 丙午 | 壬申 | month_natal_branch: 형亥亥,해申亥 / month_natal_element: heavy_element_present / month_dayun_branch: 해申亥 |
| C | 12 | 2026-12-07T11:52:32+09:00 | 庚子/식신·정재 | 丙午 | 壬申 | month_natal_branch: 삼합申子辰 / month_annual_branch: 충子午 / month_dayun_branch: 반합申子 |

월운은 start부터 다음 start 또는 endKstExclusive 전까지다. 위 표는 검사 편의상 시작만 축약 표시하며 원본 fixture와 DB observedSignature에는 끝 시각·owner·certainty·ID가 모두 있다. 세 사례 각각12개월·24구간을 보존한다.

## A–V 대조

| 시나리오 | 실제 비교 |
|---|---|
| A/E | 1996-12-06 14:15 남성: 2026년 교운 없음, exact |
| B/C | 동일 인물 2027-02-21 12:15 KST 壬寅→癸卯, 2월3구간 |
| D/F | 1999-07-31 시간미상 안정 범위: 2027 후보 구간, 2024-02-04 시간미상은 DAYUN_UNCERTAIN |
| G | 위 exact 인물의 첫 대운 전 1997 구간: 빈 cycles, 운-월 관계 없음 |
| H/I | A2028 편인×편인 및 다른해의 다른 십성; 일간 기준과 flowGod 기준 별도 검증 |
| J/K/L/M | B2025 natal 巳申 육합; 실제 natal 충 사례; B2028 빈 관계; A2028 운 충·형+natal 반합 |
| N/P | 2026 실제 절입12개 직전/정각, 입춘 전乙巳→후丙午 |
| O | 2001-08-20 16:20 남성: 2025-12-03 00:20 교운과 며칠 뒤 대설을 분리 |
| Q/R/V | 세 인물14년/12월 배열 비교; 동일인2026/2027 월 ledger도 비교 |
| S | 쌍申子는 반합이며 삼합 아님; 방합 transit held |
| T | 같은 lifeStage의 두 출처는 observation2개/accepted1개, 영향점수 없음 |
| U | 2023–25과거/2026현재/2027–36미래; 현재해의 월구간 별도 구분 |
