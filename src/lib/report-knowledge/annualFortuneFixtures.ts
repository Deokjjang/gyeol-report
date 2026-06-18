import type {
  AnnualFortuneEvidencePacket,
  AnnualPersonInput,
} from "./annualFortuneEvidence";

export type AnnualFortuneFixture = {
  readonly id: string;
  readonly label: string;
  readonly targetYear: number;
  readonly currentDate: string;
  readonly person: AnnualPersonInput;
  readonly expected?: {
    readonly mode?: AnnualFortuneEvidencePacket["mode"];
    readonly ganji?: string;
  };
};

const deokminPerson: AnnualFortuneFixture["person"] = {
  label: "덕민",
  mbti: "ENTJ",
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
};

export const ANNUAL_FORTUNE_FIXTURES = [
  {
    id: "deokmin-2026-current",
    label: "Deokmin 2026 current annual fortune",
    targetYear: 2026,
    currentDate: "2026-06-18",
    person: deokminPerson,
    expected: {
      mode: "current_year",
      ganji: "丙午",
    },
  },
  {
    id: "deokmin-2021-review",
    label: "Deokmin 2021 annual review",
    targetYear: 2021,
    currentDate: "2026-06-18",
    person: deokminPerson,
    expected: {
      mode: "past_review",
      ganji: "辛丑",
    },
  },
  {
    id: "deokmin-2024-review",
    label: "Deokmin 2024 annual review",
    targetYear: 2024,
    currentDate: "2026-06-18",
    person: deokminPerson,
    expected: {
      mode: "past_review",
      ganji: "甲辰",
    },
  },
  {
    id: "deokmin-2025-review",
    label: "Deokmin 2025 annual review",
    targetYear: 2025,
    currentDate: "2026-06-18",
    person: deokminPerson,
    expected: {
      mode: "past_review",
      ganji: "乙巳",
    },
  },
  {
    id: "deokmin-2027-locked-before-december",
    label: "Deokmin 2027 locked before December",
    targetYear: 2027,
    currentDate: "2026-11-30",
    person: deokminPerson,
    expected: {
      mode: "locked_future",
      ganji: "丁未",
    },
  },
  {
    id: "deokmin-2027-new-year-after-december",
    label: "Deokmin 2027 new year after December open",
    targetYear: 2027,
    currentDate: "2026-12-01",
    person: deokminPerson,
    expected: {
      mode: "new_year_preview",
      ganji: "丁未",
    },
  },
] as const satisfies readonly AnnualFortuneFixture[];

export function getAnnualFortuneFixtureById(
  fixtureId: string,
): AnnualFortuneFixture | undefined {
  return ANNUAL_FORTUNE_FIXTURES.find((fixture) => fixture.id === fixtureId);
}

export function requireAnnualFortuneFixture(
  fixtureId: string,
): AnnualFortuneFixture {
  const fixture = getAnnualFortuneFixtureById(fixtureId);

  if (fixture === undefined) {
    throw new Error(`missing annual fortune fixture: ${fixtureId}`);
  }

  return fixture;
}
