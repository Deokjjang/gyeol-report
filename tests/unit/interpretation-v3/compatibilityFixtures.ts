import { COMPATIBILITY_ROLE_VERSION, COMPATIBILITY_RELATIONSHIP_TYPES, type CompatibilityRelationshipType } from "../../../src/lib/report-generation/reportInputTypes";
import { LOVE_V3_FIXTURES, loveFixture } from "./loveFixtures";

export const pairPerson = (index: number) => loveFixture(LOVE_V3_FIXTURES[index]).payload.person;
export function compatibilityFixture(category: CompatibilityRelationshipType = "love", first = 0, second = 3) {
  return { productKey: "saju_mbti_compatibility" as const, productSlug: "compatibility" as const, compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION,
    relationshipType: category, personA: pairPerson(first), personB: pairPerson(second) };
}
export const COMPATIBILITY_V3_FIXTURES = COMPATIBILITY_RELATIONSHIP_TYPES.flatMap(category => [
  { id: `${category}-ga-on`, payload: compatibilityFixture(category) },
  { id: `${category}-expansion`, payload: compatibilityFixture(category, 1, 4) },
  { id: `${category}-quiet`, payload: compatibilityFixture(category, 8, 11) },
]);
