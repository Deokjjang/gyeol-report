import type { EarthlyBranch, HeavenlyStem } from "./types";

export type DayPillarCode = `${HeavenlyStem}${EarthlyBranch}`;

export type DayPillarProfileTone =
  | "WARM"
  | "SHARP"
  | "CALM"
  | "INTENSE"
  | "PRACTICAL"
  | "IDEALISTIC"
  | "INDEPENDENT"
  | "RELATIONAL";

export type DayPillarProfileTheme =
  | "SELF_EXPRESSION"
  | "INNER_DEPTH"
  | "REALITY_SENSE"
  | "RELATIONSHIP"
  | "LEADERSHIP"
  | "LEARNING"
  | "CREATIVITY"
  | "DISCIPLINE"
  | "MOBILITY"
  | "RESOURCEFULNESS";

export type DayPillarProfileItem = {
  titleKo: string;
  bodyKo: string;
};

export type DayPillarMbtiHint = {
  axisHint: "EI" | "SN" | "TF" | "JP";
  tendencyKo: string;
  cautionKo: string;
};

export type DayPillarProfile = {
  code: DayPillarCode;
  nameKo: string;
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  imageKo: string;
  coreSummaryKo: string;
  structureKo: string;
  strengthItems: readonly DayPillarProfileItem[];
  cautionItems: readonly DayPillarProfileItem[];
  developmentItems: readonly DayPillarProfileItem[];
  tones: readonly DayPillarProfileTone[];
  themes: readonly DayPillarProfileTheme[];
  mbtiHints: readonly DayPillarMbtiHint[];
};

export type DayPillarProfileLookupResult =
  | {
      ok: true;
      profile: DayPillarProfile;
    }
  | {
      ok: false;
      code: DayPillarCode;
      reason: "PROFILE_NOT_FOUND";
    };
