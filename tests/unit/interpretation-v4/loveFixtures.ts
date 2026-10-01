import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import type { ApproximateBirthTimeSlot } from "../../../src/lib/saju/birthTimePrecisionTypes";
import type { NarrativeInput } from "../../../src/lib/interpretation-v4/narrativeTypes";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";

type LoveFixture = (typeof NARRATIVE_FIXTURES)[number] & { slot?: ApproximateBirthTimeSlot };
/** Real calendar inputs: six women, two men, all six existing relationship states. */
export const LOVE_FIXTURES: readonly LoveFixture[] = [
  { ...NARRATIVE_FIXTURES[2], id: "01-jia" },
  { ...NARRATIVE_FIXTURES[0], id: "02-seojin", context: { ...NARRATIVE_FIXTURES[0].context, relationshipStatus: "single" } },
  { ...NARRATIVE_FIXTURES[1], id: "03-seoyun", context: { ...NARRATIVE_FIXTURES[1].context, relationshipStatus: "some" } },
  { ...NARRATIVE_FIXTURES[10], id: "04-doyun", time: undefined, slot: "MYOSI", context: { ...NARRATIVE_FIXTURES[10].context, relationshipStatus: "married" } },
  { ...NARRATIVE_FIXTURES[9], id: "05-minjae", context: { ...NARRATIVE_FIXTURES[9].context, relationshipStatus: "marriage_preparing" } },
  { ...NARRATIVE_FIXTURES[6], id: "06-nayeong" },
  { ...NARRATIVE_FIXTURES[8], id: "07-harin", mbti: "ESFP", context: { ...NARRATIVE_FIXTURES[8].context, relationshipStatus: "" } },
  { ...NARRATIVE_FIXTURES[5], id: "08-yerin", time: undefined, slot: "MISI", context: { ...NARRATIVE_FIXTURES[5].context, jobStatus: "employee", detailJob: "도서관 사서", relationshipStatus: "dating" } },
];
export function loveInputs() {
  return LOVE_FIXTURES.map(fixture => ({ fixture, input: {
    calculation: calculateSaju({ birthDate: fixture.date, calendarType: "SOLAR", gender: fixture.gender, timezone: "Asia/Seoul", birthTimeUnknown: !fixture.time && !fixture.slot,
      ...(fixture.slot ? { birthTimePrecision: "approximate", approximateBirthTimeSlot: fixture.slot } : fixture.time ? { birthTime: fixture.time, birthTimePrecision: "exact" } : { birthTimeUnknown: true, birthTimePrecision: "unknown" }),
    }), name: fixture.name, mbti: fixture.mbti, context: fixture.context,
  } satisfies NarrativeInput }));
}
