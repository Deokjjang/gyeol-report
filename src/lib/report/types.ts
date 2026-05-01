import type { BridgeSignal } from "../bridge/types";
import type { MbtiProfile } from "../mbti/types";
import type { SajuTag } from "../saju/tags";
import type { SajuCalcResult } from "../saju/types";

export type ReportSectionId =
  | "INTRO"
  | "SAJU_CORE"
  | "DAY_MASTER"
  | "ELEMENTS"
  | "TEN_GODS"
  | "ADVANCED_PATTERNS"
  | "RELATIONS"
  | "MBTI_PROFILE"
  | "SAJU_MBTI_BRIDGE"
  | "ACTION_GUIDE"
  | "DISCLAIMER";

export type ReportSectionLevel = "FREE_PREVIEW" | "PAID_FULL";

export type ReportBlockKind =
  | "PARAGRAPH"
  | "BULLET_LIST"
  | "KEY_VALUE"
  | "WARNING"
  | "HIGHLIGHT";

export type ReportBlock = {
  kind: ReportBlockKind;
  titleKo?: string;
  bodyKo?: string;
  itemsKo?: string[];
  keyValues?: readonly {
    keyKo: string;
    valueKo: string;
  }[];
};

export type ReportSection = {
  id: ReportSectionId;
  level: ReportSectionLevel;
  titleKo: string;
  summaryKo: string;
  blocks: ReportBlock[];
};

export type ReportInput = {
  saju: SajuCalcResult;
  sajuTags: readonly SajuTag[];
  mbti: MbtiProfile;
  bridgeSignals: readonly BridgeSignal[];
};

export type ReportOutput = {
  version: "v1";
  titleKo: string;
  subtitleKo: string;
  sections: ReportSection[];
  notices: string[];
};
