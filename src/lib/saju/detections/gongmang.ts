/** 공망(순공): 기둥이 속한 순(旬)에서 빠진 두 지지. idx=(지지idx−천간idx+10)%12, +11. */
import { BRANCH_INDEX, EARTHLY_BRANCHES, HEAVENLY_STEMS, STEM_INDEX } from "../constants";
import type { EarthlyBranch, Pillar } from "../types";

export function getGongmang(pillar: Pillar): { xun: string; branches: readonly [EarthlyBranch, EarthlyBranch] } {
  const diff = (BRANCH_INDEX[pillar.branch] - STEM_INDEX[pillar.stem] + 12) % 12;
  const first = EARTHLY_BRANCHES[(diff + 10) % 12];
  const second = EARTHLY_BRANCHES[(diff + 11) % 12];
  return { xun: `${HEAVENLY_STEMS[0]}${EARTHLY_BRANCHES[diff]}`, branches: [first, second] };
}
