// Frozen audit goldens, not generated from the implementation.
// upstream: lunar-javascript@1.7.7/__tests__/EightChar.test.js.
// repo external: sajuFeatureAudit.ts Deokmin/Sodam external manse fixtures.
// HKO+policy: monthly calendars' day GanZhi/solar terms (minute precision),
// combined with 02_SAJU_CALC_SPEC.md's KST/00:00/same-day hour-stem policy.
// https://www.hko.gov.hk/tc/gts/astron2024/files/2024cal02.pdf
// https://www.hko.gov.hk/tc/gts/astron2024/files/2024cal03.pdf
// https://www.hko.gov.hk/en/gts/astron2024/files/2024cal04.pdf
// https://www.hko.gov.hk/en/gts/astron2024/files/2024cal05.pdf
// https://www.hko.gov.hk/en/gts/astron2024/files/2024cal12.pdf
export const CANONICAL_CALENDAR_GOLDENS = [
  ["1988-02-02 22:30:00","丁卯 癸丑 丁亥 辛亥","upstream"],
  ["1988-02-15 22:30:00","戊辰 甲寅 庚子 丁亥","upstream"],
  ["1996-12-06 14:15:00","丙子 己亥 丁丑 丁未","repo external"],
  ["1999-07-31 07:30:00","己卯 辛未 甲申 戊辰","repo external"],
  ["1999-06-07 09:11:00","己卯 庚午 庚寅 辛巳","upstream"],
  ["2005-12-23 08:37:00","乙酉 戊子 辛巳 壬辰","upstream"],
  ["2020-01-06 11:22:00","己亥 丁丑 戊申 戊午","upstream"],
  ["2024-02-04 16:40:00","癸卯 乙丑 戊戌 庚申","HKO+policy"],
  ["2024-02-04 17:28:00","甲辰 丙寅 戊戌 辛酉","HKO+policy"],
  ["2024-02-29 12:00:00","甲辰 丙寅 癸亥 戊午","HKO+policy"],
  ["2024-03-05 11:22:00","甲辰 丙寅 戊辰 戊午","HKO+policy"],
  ["2024-03-05 11:24:00","甲辰 丁卯 戊辰 戊午","HKO+policy"],
  ["2024-04-04 16:01:00","甲辰 丁卯 戊戌 庚申","HKO+policy"],
  ["2024-04-04 16:03:00","甲辰 戊辰 戊戌 庚申","HKO+policy"],
  ["2024-05-05 09:09:00","甲辰 戊辰 己巳 己巳","HKO+policy"],
  ["2024-05-05 09:11:00","甲辰 己巳 己巳 己巳","HKO+policy"],
  ["1988-02-15 22:59:00","戊辰 甲寅 庚子 丁亥","upstream day+repo policy"],
  ["1988-02-15 23:00:00","戊辰 甲寅 庚子 丙子","upstream day+repo policy"],
  ["1988-02-15 23:59:00","戊辰 甲寅 庚子 丙子","upstream day+repo policy"],
  ["1988-02-16 00:00:00","戊辰 甲寅 辛丑 戊子","upstream day+repo policy"],
  ["1988-02-16 00:59:00","戊辰 甲寅 辛丑 戊子","upstream day+repo policy"],
  ["1988-02-16 01:00:00","戊辰 甲寅 辛丑 己丑","upstream day+repo policy"],
  ["2024-12-06 23:16:00","甲辰 乙亥 甲辰 甲子","HKO+policy"],
  ["2024-12-06 23:30:00","甲辰 乙亥 甲辰 甲子","HKO+policy"],
  ["2024-12-07 00:16:00","甲辰 乙亥 乙巳 丙子","HKO+policy"],
  ["2024-12-07 00:18:00","甲辰 丙子 乙巳 丙子","HKO+policy"],
] as const;

// v5-lmt day/hour, hand-derived (not generated): solar = KST - 30:00 (default 127.5E), unified 子 rule
// (solar 23:00 starts the next day). Year/month stay the frozen external values above (absolute instants).
// Only entries whose day/hour changes are listed; every other golden keeps its frozen day/hour.
// 1999-07-31 07:30 is solar 07:00 辰, i.e. the frozen external 戊辰.
export const V5_LMT_DAY_HOUR: Readonly<Record<string, string>> = {
  "1999-06-07 09:11:00": "庚寅 庚辰", // solar 08:41 辰
  "2020-01-06 11:22:00": "戊申 丁巳", // solar 10:52 巳
  "2024-02-04 17:28:00": "戊戌 庚申", // solar 16:58 申
  "2024-03-05 11:22:00": "戊辰 丁巳", // solar 10:52 巳
  "2024-03-05 11:24:00": "戊辰 丁巳", // solar 10:54 巳
  "2024-05-05 09:09:00": "己巳 戊辰", // solar 08:39 辰
  "2024-05-05 09:11:00": "己巳 戊辰", // solar 08:41 辰
  "1988-02-15 23:00:00": "庚子 丁亥", // solar 22:30 亥
  "1988-02-15 23:59:00": "辛丑 戊子", // solar 23:29 子 -> next day 辛丑
  "1988-02-16 01:00:00": "辛丑 戊子", // solar 00:30 子
  "2024-12-06 23:16:00": "甲辰 乙亥", // solar 22:46 亥
  "2024-12-06 23:30:00": "乙巳 丙子", // solar 23:00 子 -> next day 乙巳
};
export function v5LmtGolden(civil: string, frozen: string): string {
  const parts = frozen.split(" ");
  return [parts[0], parts[1], V5_LMT_DAY_HOUR[civil] ?? `${parts[2]} ${parts[3]}`].join(" ");
}
