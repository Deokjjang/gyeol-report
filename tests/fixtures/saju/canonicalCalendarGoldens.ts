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
