import { DAY_PILLAR_PROFILES } from "./dayPillarProfiles";
import type {
  DayPillarCode,
  DayPillarProfileLookupResult,
} from "./dayPillarProfileTypes";
import type { EarthlyBranch, HeavenlyStem } from "./types";

export function createDayPillarCode(input: {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}): DayPillarCode {
  return `${input.stem}${input.branch}` as DayPillarCode;
}

export function getDayPillarProfile(
  code: DayPillarCode,
): DayPillarProfileLookupResult {
  const profile = DAY_PILLAR_PROFILES.find((item) => item.code === code);

  if (profile) {
    return {
      ok: true,
      profile,
    };
  }

  return {
    ok: false,
    code,
    reason: "PROFILE_NOT_FOUND",
  };
}
