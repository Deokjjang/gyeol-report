import type { EarthlyBranch } from "./types";

export type SolarTermKey =
  | "IPCHUN"
  | "GYEONGCHIP"
  | "CHEONGMYEONG"
  | "IPHA"
  | "MANGJONG"
  | "SOSEO"
  | "IPCHU"
  | "BAEKRO"
  | "HANRO"
  | "IPDONG"
  | "DAESEOL"
  | "SOHAN";

export type SolarTermBoundary = {
  key: SolarTermKey;
  monthBranch: EarthlyBranch;
  isoDateTimeKst: string;
};

export type SolarTermYearData = {
  year: number;
  boundaries: readonly SolarTermBoundary[];
};

export class UnsupportedSolarTermYearError extends Error {
  constructor(readonly year: number) {
    super(`Solar term data for year ${year} is not available.`);
    this.name = "UnsupportedSolarTermYearError";
  }
}

const KST_DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+09:00$/;
const KST_DATE_TIME_FORMAT_ERROR =
  "Invalid KST date-time format. Expected YYYY-MM-DDTHH:mm:ss+09:00.";

// V1 deterministic development table.
// Must be validated against at least two independent sources before public launch.
const SOLAR_TERM_YEAR_DATA = [
  {
    year: 1983,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "1983-02-04T18:40:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "1983-03-06T12:47:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "1983-04-05T17:44:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "1983-05-06T11:11:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "1983-06-06T15:26:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "1983-07-08T01:43:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "1983-08-08T11:30:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "1983-09-08T14:20:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "1983-10-09T05:52:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "1983-11-08T08:52:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "1983-12-08T01:34:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "1983-01-06T00:59:00+09:00",
      },
    ],
  },
  {
    year: 1984,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "1984-02-05T00:19:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "1984-03-05T18:25:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "1984-04-04T23:22:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "1984-05-05T16:51:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "1984-06-05T21:08:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "1984-07-07T07:29:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "1984-08-07T17:18:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "1984-09-07T20:10:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "1984-10-08T11:43:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "1984-11-07T14:46:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "1984-12-07T07:29:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "1984-01-06T06:42:00+09:00",
      },
    ],
  },
  {
    year: 2023,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "2023-02-04T11:43:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "2023-03-06T05:36:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "2023-04-05T10:13:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "2023-05-06T03:19:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "2023-06-06T07:18:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "2023-07-07T17:31:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "2023-08-08T03:23:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "2023-09-08T06:27:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "2023-10-08T22:16:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "2023-11-08T01:36:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "2023-12-07T18:33:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "2023-01-06T00:04:00+09:00",
      },
    ],
  },
  {
    year: 2024,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "2024-02-04T17:27:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "2024-03-05T11:23:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "2024-04-04T16:02:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "2024-05-05T09:10:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "2024-06-05T13:10:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "2024-07-06T23:20:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "2024-08-07T09:09:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "2024-09-07T12:11:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "2024-10-08T04:00:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "2024-11-07T07:20:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "2024-12-06T23:17:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "2024-01-06T05:49:00+09:00",
      },
    ],
  },
  {
    year: 2025,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "2025-02-03T23:10:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "2025-03-05T17:07:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "2025-04-04T21:48:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "2025-05-05T14:57:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "2025-06-05T18:57:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "2025-07-07T05:04:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "2025-08-07T14:52:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "2025-09-07T17:52:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "2025-10-08T09:41:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "2025-11-07T13:04:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "2025-12-07T05:04:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "2025-01-05T11:32:00+09:00",
      },
    ],
  },
  {
    year: 2026,
    boundaries: [
      {
        key: "IPCHUN",
        monthBranch: "寅",
        isoDateTimeKst: "2026-02-04T05:02:00+09:00",
      },
      {
        key: "GYEONGCHIP",
        monthBranch: "卯",
        isoDateTimeKst: "2026-03-05T22:57:00+09:00",
      },
      {
        key: "CHEONGMYEONG",
        monthBranch: "辰",
        isoDateTimeKst: "2026-04-05T03:40:00+09:00",
      },
      {
        key: "IPHA",
        monthBranch: "巳",
        isoDateTimeKst: "2026-05-05T20:48:00+09:00",
      },
      {
        key: "MANGJONG",
        monthBranch: "午",
        isoDateTimeKst: "2026-06-06T00:49:00+09:00",
      },
      {
        key: "SOSEO",
        monthBranch: "未",
        isoDateTimeKst: "2026-07-07T10:57:00+09:00",
      },
      {
        key: "IPCHU",
        monthBranch: "申",
        isoDateTimeKst: "2026-08-07T20:42:00+09:00",
      },
      {
        key: "BAEKRO",
        monthBranch: "酉",
        isoDateTimeKst: "2026-09-07T23:41:00+09:00",
      },
      {
        key: "HANRO",
        monthBranch: "戌",
        isoDateTimeKst: "2026-10-08T15:29:00+09:00",
      },
      {
        key: "IPDONG",
        monthBranch: "亥",
        isoDateTimeKst: "2026-11-07T18:52:00+09:00",
      },
      {
        key: "DAESEOL",
        monthBranch: "子",
        isoDateTimeKst: "2026-12-07T10:52:00+09:00",
      },
      {
        key: "SOHAN",
        monthBranch: "丑",
        isoDateTimeKst: "2026-01-05T17:23:00+09:00",
      },
    ],
  },
] as const satisfies readonly SolarTermYearData[];

function parseKstDateTimeMs(value: string): number {
  const match = KST_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue] =
    match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const second = Number(secondValue);

  if (hour > 23 || minute > 59 || second > 59) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  return timestamp;
}

function parseKstYear(value: string): number {
  const match = KST_DATE_TIME_PATTERN.exec(value);

  if (!match) {
    throw new Error(KST_DATE_TIME_FORMAT_ERROR);
  }

  return Number(match[1]);
}

export function getSolarTermYearData(year: number): SolarTermYearData {
  const yearData = SOLAR_TERM_YEAR_DATA.find((data) => data.year === year);

  if (!yearData) {
    throw new UnsupportedSolarTermYearError(year);
  }

  return yearData;
}

export function getActiveSolarTermBoundary(
  solarDateTimeKst: string,
): SolarTermBoundary {
  const inputMs = parseKstDateTimeMs(solarDateTimeKst);
  const year = parseKstYear(solarDateTimeKst);
  const currentYearData = getSolarTermYearData(year);
  const previousYearData = getSolarTermYearData(year - 1);
  const boundaries = [
    ...previousYearData.boundaries,
    ...currentYearData.boundaries,
  ].sort(
    (left, right) =>
      parseKstDateTimeMs(left.isoDateTimeKst) -
      parseKstDateTimeMs(right.isoDateTimeKst),
  );
  let activeBoundary: SolarTermBoundary | undefined;

  boundaries.forEach((boundary) => {
    if (parseKstDateTimeMs(boundary.isoDateTimeKst) <= inputMs) {
      activeBoundary = boundary;
    }
  });

  if (!activeBoundary) {
    throw new Error("Failed to resolve active solar term boundary.");
  }

  return activeBoundary;
}

export function isBeforeIpchun(solarDateTimeKst: string): boolean {
  const inputMs = parseKstDateTimeMs(solarDateTimeKst);
  const year = parseKstYear(solarDateTimeKst);
  const yearData = getSolarTermYearData(year);
  const ipchunBoundary = yearData.boundaries.find(
    (boundary) => boundary.key === "IPCHUN",
  );

  if (!ipchunBoundary) {
    throw new Error(`IPCHUN boundary for year ${year} is not available.`);
  }

  return inputMs < parseKstDateTimeMs(ipchunBoundary.isoDateTimeKst);
}
