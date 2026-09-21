// PRODUCT CONTRACT GOLDENS: frozen in the 2026-09-21 sect benchmark BEFORE
// customerDayun implementation. Fixed KST + lunar-javascript 1.7.7 sect2.
// These are NOT universally established Myeongli truths. Independent calendar
// goldens remain in canonicalCalendarGoldens.ts.
export const CUSTOMER_DAYUN_GOLDENS = [
  {
    "birthDate": "1970-05-11",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "庚戌 辛巳 辛卯 乙未",
    "direction": "forward",
    "startSolarKst": "1979-01-02T09:30:00+09:00",
    "firstGanji": "壬午",
    "startYear": 1979,
    "startAge": 10,
    "offset": [
      8,
      7,
      21,
      20
    ]
  },
  {
    "birthDate": "1973-02-22",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "癸丑 甲寅 己丑 辛未",
    "direction": "forward",
    "startSolarKst": "1976-12-26T01:30:00+09:00",
    "firstGanji": "乙卯",
    "startYear": 1976,
    "startAge": 4,
    "offset": [
      3,
      10,
      3,
      12
    ]
  },
  {
    "birthDate": "1976-03-02",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "丙辰 庚寅 癸丑 己未",
    "direction": "reverse",
    "startSolarKst": "1984-12-31T19:30:00+09:00",
    "firstGanji": "己丑",
    "startYear": 1984,
    "startAge": 9,
    "offset": [
      8,
      9,
      29,
      6
    ]
  },
  {
    "birthDate": "1979-07-09",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "己未 辛未 丁丑 丁未",
    "direction": "reverse",
    "startSolarKst": "1980-01-04T01:30:00+09:00",
    "firstGanji": "庚午",
    "startYear": 1980,
    "startAge": 2,
    "offset": [
      0,
      5,
      25,
      12
    ]
  },
  {
    "birthDate": "1980-03-09",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "庚申 己卯 辛巳 乙未",
    "direction": "forward",
    "startSolarKst": "1989-01-02T05:30:00+09:00",
    "firstGanji": "庚辰",
    "startYear": 1989,
    "startAge": 10,
    "offset": [
      8,
      9,
      23,
      16
    ]
  },
  {
    "birthDate": "1981-03-03",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "辛酉 庚寅 庚辰 癸未",
    "direction": "forward",
    "startSolarKst": "1981-12-31T11:30:00+09:00",
    "firstGanji": "辛卯",
    "startYear": 1981,
    "startAge": 1,
    "offset": [
      0,
      9,
      27,
      22
    ]
  },
  {
    "birthDate": "1984-01-03",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "癸亥 甲子 丙申 乙未",
    "direction": "forward",
    "startSolarKst": "1984-12-29T09:30:00+09:00",
    "firstGanji": "乙丑",
    "startYear": 1984,
    "startAge": 1,
    "offset": [
      0,
      11,
      25,
      20
    ]
  },
  {
    "birthDate": "1987-08-18",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "丁卯 戊申 己亥 辛未",
    "direction": "reverse",
    "startSolarKst": "1991-01-02T15:30:00+09:00",
    "firstGanji": "丁未",
    "startYear": 1991,
    "startAge": 5,
    "offset": [
      3,
      4,
      15,
      2
    ]
  },
  {
    "birthDate": "1990-11-01",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "庚午 丙戌 庚午 癸未",
    "direction": "forward",
    "startSolarKst": "1992-12-30T23:30:00+09:00",
    "firstGanji": "丁亥",
    "startYear": 1992,
    "startAge": 3,
    "offset": [
      2,
      1,
      29,
      10
    ]
  },
  {
    "birthDate": "1993-01-20",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "壬申 癸丑 辛丑 乙未",
    "direction": "reverse",
    "startSolarKst": "1998-01-02T09:30:00+09:00",
    "firstGanji": "壬子",
    "startYear": 1998,
    "startAge": 6,
    "offset": [
      4,
      11,
      12,
      20
    ]
  },
  {
    "birthDate": "1996-02-16",
    "birthTime": "13:30",
    "gender": "FEMALE",
    "pillars": "丙子 庚寅 癸未 己未",
    "direction": "reverse",
    "startSolarKst": "2000-01-02T11:30:00+09:00",
    "firstGanji": "己丑",
    "startYear": 2000,
    "startAge": 5,
    "offset": [
      3,
      10,
      16,
      22
    ]
  },
  {
    "birthDate": "2001-06-22",
    "birthTime": "13:30",
    "gender": "MALE",
    "pillars": "辛巳 甲午 丙辰 乙未",
    "direction": "reverse",
    "startSolarKst": "2006-12-30T15:30:00+09:00",
    "firstGanji": "癸巳",
    "startYear": 2006,
    "startAge": 6,
    "offset": [
      5,
      6,
      8,
      2
    ]
  }
] as const;
