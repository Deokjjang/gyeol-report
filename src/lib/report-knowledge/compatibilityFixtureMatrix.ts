import {
  DEOKMIN_REPORT_SMOKE_FIXTURE_ID,
  SODAM_REPORT_SMOKE_FIXTURE_ID,
  getReportQualityFixtureById,
} from "./reportQualityFixtureMatrix";
import type {
  CompatibilityInput,
  CompatibilityPillars,
  CompatibilityRelationshipType,
} from "./compatibilityTypes";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";

export type CompatibilityFixture = {
  readonly id: string;
  readonly label: string;
  readonly input: CompatibilityInput;
  readonly expectedPillars: {
    readonly personA: CompatibilityPillars;
    readonly personB: CompatibilityPillars;
  };
  readonly personASajuFacts: ComputedSajuFacts;
  readonly personBSajuFacts: ComputedSajuFacts;
};

function requireReportFixture(fixtureId: string): NonNullable<
  ReturnType<typeof getReportQualityFixtureById>
> {
  const fixture = getReportQualityFixtureById(fixtureId);

  if (fixture === undefined) {
    throw new Error(`missing report fixture for compatibility matrix: ${fixtureId}`);
  }

  return fixture;
}

function compatibilityInput(input: {
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: CompatibilityInput["personA"];
  readonly personB: CompatibilityInput["personB"];
}): CompatibilityInput {
  return {
    productType: "saju_mbti_compatibility",
    productVersion: "1.0",
    relationshipType: input.relationshipType,
    personA: input.personA,
    personB: input.personB,
  };
}

const deokmin = requireReportFixture(DEOKMIN_REPORT_SMOKE_FIXTURE_ID);
const sodam = requireReportFixture(SODAM_REPORT_SMOKE_FIXTURE_ID);
const reflectiveInfp = requireReportFixture("reflective-water-infp");
const estpResource = requireReportFixture("money-resource-estp");
const istjResponsibility = requireReportFixture("responsibility-earth-istj");

export const COMPATIBILITY_FIXTURE_MATRIX = [
  {
    id: "deokmin-sodam-love",
    label: "Deokmin ENTJ x Sodam INTP love fixture",
    input: compatibilityInput({
      relationshipType: "love",
      personA: {
        role: "personA",
        displayName: "덕민",
        gender: "MALE",
        calendarType: "SOLAR",
        birthDate: "1999-07-31",
        birthTime: "07:30",
        birthTimeKnown: true,
        timezone: "Asia/Seoul",
        mbti: "ENTJ",
      },
      personB: {
        role: "personB",
        displayName: "소담",
        gender: "FEMALE",
        calendarType: "SOLAR",
        birthDate: "1996-12-06",
        birthTime: "14:15",
        birthTimeKnown: true,
        timezone: "Asia/Seoul",
        mbti: "INTP",
      },
    }),
    expectedPillars: {
      personA: deokmin.expectedPillars,
      personB: sodam.expectedPillars,
    },
    personASajuFacts: deokmin.sajuFacts,
    personBSajuFacts: sodam.sajuFacts,
  },
  {
    id: "unknown-time-some",
    label: "Unknown time and missing MBTI some fixture",
    input: compatibilityInput({
      relationshipType: "some",
      personA: {
        role: "personA",
        displayName: "A",
        gender: "OTHER",
        calendarType: "SOLAR",
        birthDate: "1996-03-12",
        birthTime: "09:10",
        birthTimeKnown: true,
        timezone: "Asia/Seoul",
        mbti: "INFP",
      },
      personB: {
        role: "personB",
        displayName: "B",
        gender: null,
        calendarType: "SOLAR",
        birthDate: "1997-08-19",
        birthTime: null,
        birthTimeKnown: false,
        timezone: "Asia/Seoul",
        mbti: null,
      },
    }),
    expectedPillars: {
      personA: reflectiveInfp.expectedPillars,
      personB: estpResource.expectedPillars,
    },
    personASajuFacts: reflectiveInfp.sajuFacts,
    personBSajuFacts: estpResource.sajuFacts,
  },
  {
    id: "friendship-mbti-known",
    label: "Friendship fixture with both MBTI known",
    input: compatibilityInput({
      relationshipType: "friendship",
      personA: {
        role: "personA",
        displayName: "친구A",
        gender: "FEMALE",
        calendarType: "SOLAR",
        birthDate: "1998-01-20",
        birthTime: "11:20",
        birthTimeKnown: true,
        timezone: "Asia/Seoul",
        mbti: "ISTJ",
      },
      personB: {
        role: "personB",
        displayName: "친구B",
        gender: "MALE",
        calendarType: "SOLAR",
        birthDate: "1995-09-11",
        birthTime: "20:05",
        birthTimeKnown: true,
        timezone: "Asia/Seoul",
        mbti: "ESTP",
      },
    }),
    expectedPillars: {
      personA: istjResponsibility.expectedPillars,
      personB: estpResource.expectedPillars,
    },
    personASajuFacts: istjResponsibility.sajuFacts,
    personBSajuFacts: estpResource.sajuFacts,
  },
] as const satisfies readonly CompatibilityFixture[];

export function getCompatibilityFixtureById(
  fixtureId: string,
): CompatibilityFixture | undefined {
  return COMPATIBILITY_FIXTURE_MATRIX.find((fixture) => fixture.id === fixtureId);
}

export function requireCompatibilityFixture(fixtureId: string): CompatibilityFixture {
  const fixture = getCompatibilityFixtureById(fixtureId);

  if (fixture === undefined) {
    throw new Error(`missing compatibility fixture: ${fixtureId}`);
  }

  return fixture;
}
