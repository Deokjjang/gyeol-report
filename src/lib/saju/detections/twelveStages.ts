/** 십이운성: 일간 기준 지지. 양간 순행·음간 역행, 戊는 丙·己는 丁과 같은 자리(화토동법). */
import { BRANCH_INDEX, EARTHLY_BRANCHES, STEM_YIN_YANG } from "../constants";
import type { EarthlyBranch, HeavenlyStem } from "../types";
import { CHANGSAENG_BRANCH, STAGE_ORDER } from "./tables";
import type { TwelveStage } from "./types";

export function getTwelveStage(stem: HeavenlyStem, branch: EarthlyBranch): TwelveStage {
  const start = BRANCH_INDEX[CHANGSAENG_BRANCH[stem]];
  const target = BRANCH_INDEX[branch];
  const step = STEM_YIN_YANG[stem] === "YANG" ? target - start : start - target;
  return STAGE_ORDER[((step % 12) + 12) % 12];
}

/** 해당 운성이 되는 지지(역표). */
export function getStageBranch(stem: HeavenlyStem, stage: TwelveStage): EarthlyBranch {
  const found = EARTHLY_BRANCHES.find((b) => getTwelveStage(stem, b) === stage);
  if (!found) throw new Error("twelve stage table broken");
  return found;
}
