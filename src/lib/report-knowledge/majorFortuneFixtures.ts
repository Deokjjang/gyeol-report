import { hydrateMajorFortuneCycle } from "./majorFortuneRules";
import type { MajorFortuneCycle } from "./majorFortuneTypes";
import type { UserContextProfile } from "./userContextTypes";

export type MajorFortuneFixture = {
  readonly id: string;
  readonly currentYear: number;
  readonly person: {
    readonly label: string;
    readonly birthDate: string;
    readonly gender: string;
    readonly mbti: string | null;
    readonly userContext: UserContextProfile;
    readonly pillars: {
      readonly year: string;
      readonly month: string;
      readonly day: string;
      readonly hour?: string;
    };
    readonly labels: readonly string[];
    readonly majorFortuneCycleBasis: "fixture_precomputed";
    readonly majorFortuneCycles: readonly MajorFortuneCycle[];
  };
};

const deokminMajorFortuneCycles = [
  {
    index: 1,
    startAge: 4,
    endAge: 13,
    startYear: 2003,
    endYear: 2012,
    ganji: "壬申",
  },
  {
    index: 2,
    startAge: 14,
    endAge: 23,
    startYear: 2013,
    endYear: 2022,
    ganji: "癸酉",
  },
  {
    index: 3,
    startAge: 24,
    endAge: 33,
    startYear: 2023,
    endYear: 2032,
    ganji: "甲戌",
  },
  {
    index: 4,
    startAge: 34,
    endAge: 43,
    startYear: 2033,
    endYear: 2042,
    ganji: "乙亥",
  },
] as const;

export const MAJOR_FORTUNE_FIXTURES: readonly MajorFortuneFixture[] = [
  {
    id: "deokmin-current-major-fortune",
    currentYear: 2026,
    person: {
      label: "덕민",
      birthDate: "1999-07-31",
      gender: "male",
      mbti: "ENTJ",
      userContext: {
        lifeStatus: "employee",
        fieldLabel: "개발·서비스 기획",
      },
      pillars: {
        year: "己卯",
        month: "辛未",
        day: "甲申",
        hour: "戊辰",
      },
      labels: [
        "갑신일주",
        "토 과다",
        "화 부족",
        "수 부족",
        "편재",
        "정재",
        "정관",
        "편관",
        "재다신약",
        "무인성",
        "무식상",
        "현침살",
        "홍염살",
        "귀문관살",
        "원진살",
        "재고귀인",
        "육해살",
        "천살",
        "지살",
        "화개살",
        "천을귀인",
        "금여록",
        "양인살",
        "공망",
      ],
      majorFortuneCycleBasis: "fixture_precomputed",
      majorFortuneCycles: deokminMajorFortuneCycles.map((cycle) =>
        hydrateMajorFortuneCycle(cycle),
      ),
    },
  },
] as const;

export function requireMajorFortuneFixture(
  fixtureId: string,
): MajorFortuneFixture {
  const fixture = MAJOR_FORTUNE_FIXTURES.find((item) => item.id === fixtureId);

  if (fixture === undefined) {
    throw new Error(`Unknown major fortune fixture: ${fixtureId}`);
  }

  return fixture;
}
