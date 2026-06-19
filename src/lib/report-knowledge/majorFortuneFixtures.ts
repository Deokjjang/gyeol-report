import { hydrateMajorFortuneCycle } from "./majorFortuneRules";
import type {
  MajorFortuneCycle,
  MajorFortuneCycleBasis,
} from "./majorFortuneTypes";
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
    readonly majorFortuneCycleBasis: MajorFortuneCycleBasis;
    readonly majorFortuneCycles: readonly MajorFortuneCycle[];
  };
};

const deokminMajorFortuneCycles = [
  {
    index: 1,
    startAge: 7,
    endAge: 16,
    startYear: 2006,
    endYear: 2015,
    ganji: "丙寅",
  },
  {
    index: 2,
    startAge: 17,
    endAge: 26,
    startYear: 2016,
    endYear: 2025,
    ganji: "丁卯",
  },
  {
    index: 3,
    startAge: 27,
    endAge: 36,
    startYear: 2026,
    endYear: 2035,
    ganji: "戊辰",
  },
  {
    index: 4,
    startAge: 37,
    endAge: 46,
    startYear: 2036,
    endYear: 2045,
    ganji: "己巳",
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
        relationshipStatus: "unknown",
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
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
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
