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

function hydrateMajorFortuneCycles(
  cycles: readonly {
    readonly index: number;
    readonly startAge: number;
    readonly endAge: number;
    readonly startYear: number;
    readonly endYear: number;
    readonly ganji: string;
  }[],
): MajorFortuneCycle[] {
  return cycles.map((cycle) => hydrateMajorFortuneCycle(cycle));
}

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
      majorFortuneCycles: hydrateMajorFortuneCycles(deokminMajorFortuneCycles),
    },
  },
  {
    id: "major-fortune-sample-wealth-single",
    currentYear: 2026,
    person: {
      label: "민준",
      birthDate: "1998-03-14",
      gender: "male",
      mbti: "ENTP",
      userContext: {
        lifeStatus: "freelancer",
        fieldLabel: "브랜드 운영·영업",
        relationshipStatus: "single",
      },
      pillars: {
        year: "戊寅",
        month: "乙卯",
        day: "甲午",
        hour: "癸酉",
      },
      labels: [
        "갑오일주",
        "목 과다",
        "수 부족",
        "재성 강함",
        "편재",
        "정재",
        "재고귀인",
        "공망",
      ],
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
      majorFortuneCycles: hydrateMajorFortuneCycles([
        {
          index: 2,
          startAge: 18,
          endAge: 27,
          startYear: 2016,
          endYear: 2025,
          ganji: "丁卯",
        },
        {
          index: 3,
          startAge: 28,
          endAge: 37,
          startYear: 2026,
          endYear: 2035,
          ganji: "戊辰",
        },
        {
          index: 4,
          startAge: 38,
          endAge: 47,
          startYear: 2036,
          endYear: 2045,
          ganji: "己巳",
        },
      ]),
    },
  },
  {
    id: "major-fortune-sample-officer-dating",
    currentYear: 2026,
    person: {
      label: "서윤",
      birthDate: "1996-11-02",
      gender: "female",
      mbti: "ISTJ",
      userContext: {
        lifeStatus: "employee",
        fieldLabel: "공공기관 행정",
        relationshipStatus: "dating",
      },
      pillars: {
        year: "丙子",
        month: "庚戌",
        day: "乙亥",
        hour: "丁丑",
      },
      labels: [
        "을해일주",
        "금 과다",
        "목 부족",
        "관성 강함",
        "편관",
        "정관",
        "천을귀인",
        "공망",
      ],
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
      majorFortuneCycles: hydrateMajorFortuneCycles([
        {
          index: 2,
          startAge: 18,
          endAge: 27,
          startYear: 2014,
          endYear: 2023,
          ganji: "庚申",
        },
        {
          index: 3,
          startAge: 28,
          endAge: 37,
          startYear: 2024,
          endYear: 2033,
          ganji: "辛酉",
        },
        {
          index: 4,
          startAge: 38,
          endAge: 47,
          startYear: 2034,
          endYear: 2043,
          ganji: "壬戌",
        },
      ]),
    },
  },
  {
    id: "major-fortune-sample-expression-married",
    currentYear: 2026,
    person: {
      label: "하린",
      birthDate: "1992-05-21",
      gender: "female",
      mbti: "ENFJ",
      userContext: {
        lifeStatus: "business_owner",
        fieldLabel: "온라인 교육 콘텐츠",
        relationshipStatus: "married",
      },
      pillars: {
        year: "壬申",
        month: "丁巳",
        day: "戊辰",
        hour: "辛酉",
      },
      labels: [
        "무진일주",
        "화 과다",
        "금 부족",
        "수 부족",
        "식상 과다",
        "식신",
        "상관",
        "홍염살",
        "화개살",
      ],
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
      majorFortuneCycles: hydrateMajorFortuneCycles([
        {
          index: 2,
          startAge: 21,
          endAge: 30,
          startYear: 2012,
          endYear: 2021,
          ganji: "己未",
        },
        {
          index: 3,
          startAge: 31,
          endAge: 40,
          startYear: 2022,
          endYear: 2031,
          ganji: "庚申",
        },
        {
          index: 4,
          startAge: 41,
          endAge: 50,
          startYear: 2032,
          endYear: 2041,
          ganji: "辛酉",
        },
      ]),
    },
  },
  {
    id: "major-fortune-sample-resource-unknown",
    currentYear: 2026,
    person: {
      label: "도현",
      birthDate: "2001-01-09",
      gender: "male",
      mbti: "INTP",
      userContext: {
        lifeStatus: "exam_certificate",
        fieldLabel: "데이터 분석 자격증",
        relationshipStatus: "unknown",
      },
      pillars: {
        year: "辛巳",
        month: "己丑",
        day: "丙子",
        hour: "甲午",
      },
      labels: [
        "병자일주",
        "수 과다",
        "목 부족",
        "인성 강함",
        "편인",
        "정인",
        "무재성",
        "천을귀인",
        "공망",
      ],
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
      majorFortuneCycles: hydrateMajorFortuneCycles([
        {
          index: 1,
          startAge: 10,
          endAge: 19,
          startYear: 2010,
          endYear: 2019,
          ganji: "癸丑",
        },
        {
          index: 2,
          startAge: 20,
          endAge: 29,
          startYear: 2020,
          endYear: 2029,
          ganji: "甲寅",
        },
        {
          index: 3,
          startAge: 30,
          endAge: 39,
          startYear: 2030,
          endYear: 2039,
          ganji: "乙卯",
        },
      ]),
    },
  },
  {
    id: "major-fortune-sample-peer-single",
    currentYear: 2026,
    person: {
      label: "지안",
      birthDate: "2000-09-17",
      gender: "female",
      mbti: "ISFP",
      userContext: {
        lifeStatus: "job_seeker",
        fieldLabel: "영상 편집·프리랜서 준비",
        relationshipStatus: "single",
      },
      pillars: {
        year: "庚辰",
        month: "乙酉",
        day: "庚戌",
        hour: "丙寅",
      },
      labels: [
        "경술일주",
        "금 과다",
        "화 부족",
        "비겁 강함",
        "비견",
        "겁재",
        "무관성",
        "양인살",
        "금여록",
      ],
      majorFortuneCycleBasis: "user_supplied_major_fortune_table",
      majorFortuneCycles: hydrateMajorFortuneCycles([
        {
          index: 2,
          startAge: 15,
          endAge: 24,
          startYear: 2015,
          endYear: 2024,
          ganji: "己未",
        },
        {
          index: 3,
          startAge: 25,
          endAge: 34,
          startYear: 2025,
          endYear: 2034,
          ganji: "庚申",
        },
        {
          index: 4,
          startAge: 35,
          endAge: 44,
          startYear: 2035,
          endYear: 2044,
          ganji: "辛酉",
        },
      ]),
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
