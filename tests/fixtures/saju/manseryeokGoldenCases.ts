// Boundary cases for docs/manseryeok-golden-cases.csv. Expected values are filled by a human from a reference app.
export type ManseryeokGoldenCase = {
  readonly id: string;
  readonly category: string;
  readonly calendar: "SOLAR" | "LUNAR";
  readonly leap: boolean;
  readonly date: string;
  readonly time: string;
  readonly slot: "" | "YUSI" | "JASI";
  readonly unknown: boolean;
  readonly gender: "MALE" | "FEMALE";
  readonly note: string;
};

const solar = (id: string, category: string, date: string, time: string, gender: "MALE" | "FEMALE", note: string): ManseryeokGoldenCase =>
  ({ id, category, calendar: "SOLAR", leap: false, date, time, slot: "", unknown: false, gender, note });
const lunar = (id: string, date: string, leap: boolean, note: string): ManseryeokGoldenCase =>
  ({ id, category: "lunar", calendar: "LUNAR", leap, date, time: "12:00", slot: "", unknown: false, gender: "FEMALE", note });

export const MANSERYEOK_GOLDEN_CASES: readonly ManseryeokGoldenCase[] = [
  solar("G01", "required", "2000-05-11", "17:05", "FEMALE", "필수: 庚辰 辛巳 己巳 壬申"),
  solar("T01", "hour", "2000-05-11", "23:10", "FEMALE", "태양시 22:38 亥"),
  solar("T02", "hour", "2000-05-11", "23:40", "FEMALE", "태양시 23:08 子(통합: 다음 날 일주)"),
  solar("T03", "hour", "2000-05-12", "00:20", "FEMALE", "태양시 전날 23:48 子(야자시: 전날 일주)"),
  solar("T04", "hour", "2000-05-12", "01:20", "FEMALE", "태양시 00:48 子"),
  solar("T05", "hour", "2000-05-11", "17:20", "FEMALE", "태양시 16:48 申"),
  solar("T06", "hour", "2000-05-11", "17:40", "FEMALE", "태양시 17:08 酉"),
  solar("C01", "convention", "1999-07-31", "07:30", "MALE", "경도 관례 차이: -32분(126.98°E)=06:58 卯, -30분(127.5°E)=07:00 辰. 기존 외부 만세력 픽스처는 戊辰"),
  solar("Z01", "offset", "1956-07-15", "12:00", "MALE", "서머타임 UTC+9:30"),
  solar("Z02", "offset", "1959-07-15", "12:00", "MALE", "서머타임 UTC+9:30"),
  solar("Z03", "offset", "1955-01-15", "12:00", "MALE", "표준시 UTC+8:30"),
  solar("Z04", "offset", "1960-01-15", "12:00", "MALE", "표준시 UTC+8:30"),
  solar("Z05", "offset", "1987-07-15", "12:00", "MALE", "서머타임 UTC+10"),
  solar("Z06", "offset", "1988-07-15", "12:00", "MALE", "서머타임 UTC+10"),
  solar("Z07", "offset", "1956-07-15", "23:40", "MALE", "서머타임 UTC+9:30, 태양시 22:08 亥"),
  solar("Z08", "offset", "1961-08-09", "23:50", "MALE", "UTC+8:30 마지막 날"),
  solar("Z09", "offset", "1961-08-10", "00:40", "MALE", "UTC+9 전환 직후"),
  solar("Z10", "offset", "1987-05-10", "02:30", "MALE", "서머타임 시작 공백(존재하지 않는 시각)"),
  solar("Z11", "offset", "1987-10-11", "02:30", "MALE", "서머타임 종료 중복(두 번 있는 시각)"),
  solar("J01", "solar-term", "2024-02-04", "17:17", "FEMALE", "입춘 17:27 KST 10분 전"),
  solar("J02", "solar-term", "2024-02-04", "17:37", "FEMALE", "입춘 17:27 KST 10분 후"),
  solar("J03", "solar-term", "1960-02-05", "03:43", "MALE", "입춘 03:53 민간시(UTC+8:30) 10분 전"),
  solar("J04", "solar-term", "1960-02-05", "04:03", "MALE", "입춘 03:53 민간시(UTC+8:30) 10분 후"),
  solar("J05", "solar-term", "2024-05-05", "09:00", "FEMALE", "입하 09:10 KST 10분 전"),
  solar("J06", "solar-term", "2024-05-05", "09:20", "FEMALE", "입하 09:10 KST 10분 후"),
  lunar("L01", "2023-02-15", true, "음력 윤2월 15일"),
  lunar("L02", "2020-04-01", true, "음력 윤4월 1일"),
  lunar("L03", "1990-01-01", false, "음력 1월 1일(평달)"),
  lunar("L04", "2024-03-01", true, "존재하지 않는 윤달 → 오류"),
  { id: "U01", category: "unknown-time", calendar: "SOLAR", leap: false, date: "2000-05-11", time: "", slot: "", unknown: true, gender: "FEMALE", note: "시간 미상: 시주 없음" },
  { id: "S01", category: "slot", calendar: "SOLAR", leap: false, date: "2000-05-11", time: "", slot: "YUSI", unknown: false, gender: "FEMALE", note: "근사 유시(태양시 시진)" },
  { id: "S02", category: "slot", calendar: "SOLAR", leap: false, date: "2000-05-12", time: "", slot: "JASI", unknown: false, gender: "FEMALE", note: "근사 자시(태양시 시진)" },
];
